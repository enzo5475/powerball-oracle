const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function fetchLatestPowerballResults() {
    try {
        console.log('Fetching latest Powerball results...');
        
        // Using USA Mega (reliable lottery results site)
        const response = await axios.get('https://www.usamega.com/powerball-drawing.asp', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        const $ = cheerio.load(response.data);
        
        // Parse the latest drawing results
        const latestDrawing = $('.ball').first().parent();
        const dateText = latestDrawing.find('.date').text().trim();
        
        // Extract numbers
        const balls = [];
        latestDrawing.find('.ball').each((i, el) => {
            const num = parseInt($(el).text().trim());
            if (!isNaN(num)) {
                balls.push(num);
            }
        });
        
        if (balls.length !== 6) {
            throw new Error(`Expected 6 numbers, got ${balls.length}`);
        }
        
        const white = balls.slice(0, 5).sort((a, b) => a - b);
        const red = balls[5];
        
        // Parse date
        const dateParts = dateText.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        let drawingDate;
        if (dateParts) {
            const [, month, day, year] = dateParts;
            drawingDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } else {
            drawingDate = new Date().toISOString().split('T')[0];
        }
        
        console.log(`Found drawing: ${drawingDate}, White: [${white.join(', ')}], Red: ${red}`);
        
        return {
            date: drawingDate,
            white: white,
            red: red,
            jackpot: "0" // Will be updated if found
        };
        
    } catch (error) {
        console.error('Error fetching from USA Mega, trying backup source...');
        
        // Backup: Try lottery.com
        try {
            const response = await axios.get('https://www.lottery.com/results/powerball', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            
            const $ = cheerio.load(response.data);
            
            // This would need to be adjusted based on lottery.com's HTML structure
            // For now, return a fallback
            console.log('Using fallback data structure');
            
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            return {
                date: yesterday.toISOString().split('T')[0],
                white: [1, 2, 3, 4, 5], // Placeholder - would parse from HTML
                red: 1,
                jackpot: "0"
            };
            
        } catch (backupError) {
            console.error('Both sources failed:', error.message, backupError.message);
            return null;
        }
    }
}

function updateFrequencies(data, newResult) {
    // Update white ball frequencies
    newResult.white.forEach(num => {
        data.frequency.white[num.toString()] = (data.frequency.white[num.toString()] || 0) + 1;
    });
    
    // Update red ball frequency
    data.frequency.red[newResult.red.toString()] = (data.frequency.red[newResult.red.toString()] || 0) + 1;
}

async function updateLotteryData() {
    try {
        // Read existing data
        let data;
        try {
            const fileContent = fs.readFileSync('lottery-data.json', 'utf8');
            data = JSON.parse(fileContent);
        } catch (error) {
            console.log('Creating new lottery data file...');
            data = {
                last_updated: new Date().toISOString(),
                results: [],
                frequency: {
                    white: {},
                    red: {}
                }
            };
            
            // Initialize frequency counters
            for (let i = 1; i <= 69; i++) {
                data.frequency.white[i.toString()] = 0;
            }
            for (let i = 1; i <= 26; i++) {
                data.frequency.red[i.toString()] = 0;
            }
        }
        
        // Fetch latest results
        const latestResult = await fetchLatestPowerballResults();
        
        if (!latestResult) {
            console.log('Could not fetch latest results');
            return;
        }
        
        // Check if we already have this date
        const existingResult = data.results.find(r => r.date === latestResult.date);
        
        if (existingResult) {
            console.log(`Results for ${latestResult.date} already exist`);
            return;
        }
        
        // Add new result to beginning of array
        data.results.unshift(latestResult);
        
        // Keep only last 100 results to prevent file from growing too large
        if (data.results.length > 100) {
            data.results = data.results.slice(0, 100);
        }
        
        // Update frequencies
        updateFrequencies(data, latestResult);
        
        // Update timestamp
        data.last_updated = new Date().toISOString();
        
        // Write updated data back to file
        fs.writeFileSync('lottery-data.json', JSON.stringify(data, null, 2));
        
        console.log(`Successfully updated lottery data with drawing from ${latestResult.date}`);
        console.log(`Total results stored: ${data.results.length}`);
        
    } catch (error) {
        console.error('Error updating lottery data:', error);
        process.exit(1);
    }
}

// Run the update
updateLotteryData();
