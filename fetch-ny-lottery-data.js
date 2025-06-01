const fs = require('fs');

/**
 * Fetches latest Powerball data from NY.gov official API
 * API URL: https://data.ny.gov/api/views/d6yy-54nr/rows.json
 * Data is sorted from newest to oldest (today back to 2010)
 */

async function fetchNYLotteryData() {
    try {
        console.log('🎰 Fetching Powerball data from NY.gov API...');
        
        const response = await fetch('https://data.ny.gov/api/views/d6yy-54nr/rows.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        console.log(`📊 Received ${apiData.data.length} total records from NY.gov`);
        
        // Parse the data structure
        // apiData.meta.view.columns contains column definitions
        // apiData.data contains the actual data rows
        
        // Find column indices (NY.gov API structure)
        const columns = apiData.meta.view.columns;
        const columnMap = {};
        
        columns.forEach((col, index) => {
            columnMap[col.name] = index;
        });
        
        console.log('📋 Available columns:', Object.keys(columnMap));
        console.log('🔍 Sample first 3 rows for debugging:');
        apiData.data.slice(0, 3).forEach((row, i) => {
            const drawDate = row[columnMap['Draw Date']] || row[1];
            const winningNumbers = row[columnMap['Winning Numbers']] || row[2];
            console.log(`Row ${i}: Date=${drawDate}, Numbers=${winningNumbers}`);
        });
        
        // Get ALL data and sort by date to find the latest
        const allDrawings = apiData.data;
        
        const processedResults = [];
        
        allDrawings.forEach(row => {
            try {
                // Extract data based on column mapping
                const drawDate = row[columnMap['Draw Date']] || row[1];
                const winningNumbers = row[columnMap['Winning Numbers']] || row[2];
                const multiplier = row[columnMap['Multiplier']] || row[3];
                
                if (!drawDate || !winningNumbers) {
                    return; // Skip invalid rows
                }
                
                // Parse the winning numbers
                const numbersStr = winningNumbers.toString().trim();
                const allNumbers = numbersStr.match(/\d+/g);
                
                if (!allNumbers || allNumbers.length < 6) {
                    return; // Skip invalid number formats
                }
                
                // Convert to integers
                const numbers = allNumbers.map(n => parseInt(n));
                
                // First 5 are white balls, last is red powerball
                const whiteBalls = numbers.slice(0, 5).sort((a, b) => a - b);
                const powerball = numbers[5];
                
                // Validate number ranges
                const validWhite = whiteBalls.every(n => n >= 1 && n <= 69);
                const validRed = powerball >= 1 && powerball <= 26;
                
                if (!validWhite || !validRed) {
                    return; // Skip invalid ranges
                }
                
                // Parse date and create Date object for sorting
                const date = new Date(drawDate);
                const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
                
                processedResults.push({
                    date: formattedDate,
                    dateObj: date, // Keep for sorting
                    white: whiteBalls,
                    red: powerball,
                    jackpot: "0",
                    multiplier: multiplier || "1",
                    raw_data: row
                });
                
            } catch (error) {
                // Skip problematic rows
                return;
            }
        });
        
        if (processedResults.length === 0) {
            throw new Error('No valid lottery results found in API response');
        }
        
        // Sort by date - NEWEST FIRST
        processedResults.sort((a, b) => b.dateObj - a.dateObj);
        
        // Remove the dateObj helper property
        processedResults.forEach(result => delete result.dateObj);
        
        // Take only the most recent 50 for efficiency
        const recentResults = processedResults.slice(0, 50);
        
        console.log(`✅ Successfully processed ${recentResults.length} drawings`);
        console.log(`📅 Date range: ${recentResults[recentResults.length-1].date} to ${recentResults[0].date}`);
        
        // Display latest result for verification
        const latest = recentResults[0];
        console.log('🎯 Latest drawing:', {
            date: latest.date,
            white: latest.white,
            red: latest.red
        });
        
        return recentResults;
        
    } catch (error) {
        console.error('❌ Error fetching NY lottery data:', error);
        throw error;
    }
}

function updateFrequencies(data, results) {
    console.log('📊 Calculating frequency statistics...');
    
    // Initialize frequency counters
    for (let i = 1; i <= 69; i++) {
        data.frequency.white[i.toString()] = 0;
    }
    for (let i = 1; i <= 26; i++) {
        data.frequency.red[i.toString()] = 0;
    }
    
    // Count frequencies from all results
    results.forEach(result => {
        result.white.forEach(num => {
            data.frequency.white[num.toString()]++;
        });
        data.frequency.red[result.red.toString()]++;
    });
    
    // Show top frequent numbers
    const topWhite = Object.entries(data.frequency.white)
        .map(([num, freq]) => ({ num: parseInt(num), freq }))
        .sort((a, b) => b.freq - a.freq)
        .slice(0, 5);
    
    const topRed = Object.entries(data.frequency.red)
        .map(([num, freq]) => ({ num: parseInt(num), freq }))
        .sort((a, b) => b.freq - a.freq)
        .slice(0, 3);
    
    console.log('🔥 Most frequent white balls:', topWhite.map(x => `${x.num}(${x.freq})`).join(', '));
    console.log('🔴 Most frequent red balls:', topRed.map(x => `${x.num}(${x.freq})`).join(', '));
}

async function updateLotteryDataFile() {
    try {
        console.log('🎰 Starting NY.gov lottery data update...');
        
        // Read existing data or create new structure
        let data;
        try {
            const fileContent = fs.readFileSync('lottery-data.json', 'utf8');
            data = JSON.parse(fileContent);
            console.log(`📁 Loaded existing data with ${data.results?.length || 0} results`);
        } catch (error) {
            console.log('📁 Creating new lottery data file...');
            data = {
                last_updated: new Date().toISOString(),
                results: [],
                frequency: {
                    white: {},
                    red: {}
                },
                source: "NY.gov Official API"
            };
        }
        
        // Fetch latest results from NY.gov
        const newResults = await fetchNYLotteryData();
        
        // Check if we need to add new results
        const existingDates = new Set(data.results.map(r => r.date));
        const newEntries = newResults.filter(result => !existingDates.has(result.date));
        
        if (newEntries.length === 0) {
            console.log('ℹ️  No new drawings found. Data is up to date.');
            return;
        }
        
        console.log(`➕ Adding ${newEntries.length} new drawings`);
        
        // Add new results to beginning (most recent first)
        data.results = [...newEntries, ...data.results];
        
        // Keep only last 200 results
        if (data.results.length > 200) {
            data.results = data.results.slice(0, 200);
            console.log('🗂️  Trimmed to last 200 results');
        }
        
        // Recalculate frequencies
        updateFrequencies(data, data.results);
        
        // Update metadata
        data.last_updated = new Date().toISOString();
        data.source = "NY.gov Official API";
        
        // Write updated data back to file
        fs.writeFileSync('lottery-data.json', JSON.stringify(data, null, 2));
        
        console.log('✅ Successfully updated lottery-data.json');
        console.log(`📊 Total results: ${data.results.length}`);
        console.log(`📅 Latest drawing: ${data.results[0].date}`);
        console.log(`🕐 Last updated: ${data.last_updated}`);
        
    } catch (error) {
        console.error('💥 Error updating lottery data:', error);
        process.exit(1);
    }
}

// For Node.js environments (GitHub Actions)
if (typeof require !== 'undefined' && require.main === module) {
    // Add fetch polyfill for Node.js
    if (typeof fetch === 'undefined') {
        global.fetch = require('node-fetch');
    }
    
    updateLotteryDataFile();
}

// For browser environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fetchNYLotteryData,
        updateLotteryDataFile
    };
}
