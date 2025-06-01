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
        
        // Get the LATEST 50 drawings (data is oldest first, so take from the END)
        const totalRecords = apiData.data.length;
        console.log(`📊 Total records in API: ${totalRecords}`);
        
        // Take the absolute last 50 records (including the very last one)
        const recentDrawings = apiData.data.slice(-50);
        
        console.log(`📅 Taking records ${totalRecords - 50} to ${totalRecords - 1} (most recent)`);
        console.log(`🔍 Last record date: ${recentDrawings[recentDrawings.length - 1]?.[8]}`);
        console.log(`🔍 Last record numbers: ${recentDrawings[recentDrawings.length - 1]?.[9]}`);
        
        const processedResults = [];
        
        // Process in reverse order so newest is first in our results
        recentDrawings.reverse().forEach((row, index) => {
            try {
                // Based on your example format:
                // Index 8: "2025-05-31T00:00:00" (date)
                // Index 9: "01 29 37 56 68 13" (winning numbers)
                // Index 10: "2" (multiplier)
                
                const drawDate = row[8]; // Date column
                const winningNumbers = row[9]; // Winning numbers column
                const multiplier = row[10]; // Multiplier column
                
                console.log(`🔍 Processing row ${index}: Date=${drawDate}, Numbers=${winningNumbers}`);
                
                if (!drawDate || !winningNumbers) {
                    console.log('⚠️  Skipping row with missing data');
                    return;
                }
                
                // Parse the winning numbers
                // Format: "01 29 37 56 68 13" (space separated, 6 numbers total)
                const numbersStr = winningNumbers.toString().trim();
                
                // Extract numbers (split by spaces, remove leading zeros)
                const allNumbers = numbersStr.split(' ').map(n => parseInt(n.trim()));
                
                if (!allNumbers || allNumbers.length !== 6) {
                    console.log('⚠️  Invalid number format (expected 6 numbers):', numbersStr, 'Got:', allNumbers);
                    return;
                }
                
                // First 5 are white balls, last is red powerball
                const whiteBalls = allNumbers.slice(0, 5).sort((a, b) => a - b);
                const powerball = allNumbers[5];
                
                // Validate number ranges
                const validWhite = whiteBalls.every(n => n >= 1 && n <= 69);
                const validRed = powerball >= 1 && powerball <= 26;
                
                if (!validWhite || !validRed) {
                    console.log('⚠️  Numbers out of range:', { whiteBalls, powerball, validWhite, validRed });
                    return;
                }
                
                // Parse date (format: "2025-05-31T00:00:00")
                const date = new Date(drawDate);
                const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
                
                const result = {
                    date: formattedDate,
                    white: whiteBalls,
                    red: powerball,
                    jackpot: "0", // NY.gov doesn't provide jackpot amounts
                    multiplier: multiplier || "1"
                };
                
                processedResults.push(result);
                
                console.log(`✅ Added: ${formattedDate} [${whiteBalls.join(',')}] PB:${powerball}`);
                
            } catch (error) {
                console.log('⚠️  Error processing row:', error.message);
            }
        });
        
        console.log(`✅ Successfully processed ${processedResults.length} drawings`);
        
        if (processedResults.length === 0) {
            throw new Error('No valid lottery results found in API response');
        }
        
        // Display latest result for verification
        const latest = processedResults[0];
        console.log('🎯 Latest drawing:', {
            date: latest.date,
            white: latest.white,
            red: latest.red
        });
        
        return processedResults;
        
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
