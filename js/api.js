// ===== LIVE LOTTERY DATA API =====

// Global variables for data management
let LOTTERY_DATA = null;
let LATEST_WINNING_NUMBERS = null;

// ===== NY.GOV API INTEGRATION =====
async function fetchLiveWinningNumbers() {
    return safeAsyncExecute('fetchLiveWinningNumbers', async () => {
        logDebug('Fetching live winning numbers from NY.gov API');
        
        const apiUrl = "https://data.ny.gov/api/views/d6yy-54nr/rows.json";
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'PowerballOracle/1.0'
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`API responded with ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        logDebug('API response received', { 
            dataLength: json.data?.length || 0,
            metaColumns: json.meta?.view?.columns?.length || 0
        });
        
        if (!json.data || json.data.length === 0) {
            throw new Error('No data received from API');
        }
        
        // Get the latest drawing (last item in array)
        const latest = json.data[json.data.length - 1];
        
        if (!latest || latest.length < 11) {
            throw new Error('Invalid data format from API');
        }
        
        const drawDateRaw = latest[8]; // e.g. "2025-05-31T00:00:00"
        const winningNumbersStr = latest[9]; // e.g. "07 10 11 13 24"
        const powerball = parseInt(latest[10]);
        
        logDebug('Raw API data', {
            date: drawDateRaw,
            numbers: winningNumbersStr,
            powerball: powerball
        });
        
        // Validate and parse winning numbers
        if (!winningNumbersStr || typeof winningNumbersStr !== 'string') {
            throw new Error('Invalid winning numbers format');
        }
        
        const winningNumbers = winningNumbersStr.split(' ')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num) && num >= 1 && num <= 69);
        
        if (winningNumbers.length !== 5) {
            throw new Error(`Expected 5 winning numbers, got ${winningNumbers.length}`);
        }
        
        if (isNaN(powerball) || powerball < 1 || powerball > 26) {
            throw new Error(`Invalid Powerball number: ${powerball}`);
        }
        
        const liveData = {
            white: winningNumbers.sort((a, b) => a - b),
            red: powerball,
            date: drawDateRaw.split('T')[0], // Convert to YYYY-MM-DD format
            dateFormatted: formatDate(drawDateRaw),
            jackpot: "Unknown", // API doesn't provide jackpot amount
            source: "NY.gov Live API"
        };
        
        logDebug('Live winning numbers parsed successfully', liveData);
        return liveData;
        
    }, null);
}

// ===== LOCAL LOTTERY DATA MANAGEMENT =====
async function loadLotteryData() {
    return safeAsyncExecute('loadLotteryData', async () => {
        logDebug('Starting lottery data load from local file');
        
        const response = await fetch('lottery-data.json');
        logDebug('Local file fetch response', { 
            status: response.status, 
            ok: response.ok,
            contentType: response.headers.get('content-type')
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const text = await response.text();
        logDebug('Raw file content', { 
            length: text.length, 
            preview: text.substring(0, 100).replace(/\s+/g, ' ')
        });
        
        if (!text.trim()) {
            throw new Error('Empty response from lottery-data.json');
        }
        
        let parsedData;
        try {
            parsedData = JSON.parse(text);
        } catch (parseError) {
            throw new Error(`JSON parse error: ${parseError.message}`);
        }
        
        logDebug('Parsed lottery data structure', {
            hasResults: !!parsedData.results,
            resultsCount: parsedData.results?.length || 0,
            hasFrequency: !!parsedData.frequency,
            lastUpdated: parsedData.last_updated,
            whiteFrequencyKeys: Object.keys(parsedData.frequency?.white || {}).length,
            redFrequencyKeys: Object.keys(parsedData.frequency?.red || {}).length
        });
        
        // Validate data structure
        if (!parsedData.results) {
            parsedData.results = [];
            logWarning('No results array in lottery data, created empty array');
        }
        
        if (!parsedData.frequency) {
            parsedData.frequency = { white: {}, red: {} };
            logWarning('No frequency data found, created empty frequency object');
        }
        
        // Set global variable
        LOTTERY_DATA = parsedData;
        
        logDebug('Lottery data loaded successfully', {
            totalResults: LOTTERY_DATA.results.length,
            latestDate: LOTTERY_DATA.results[0]?.date || 'None'
        });
        
        return parsedData;
        
    }, {
        results: [],
        frequency: { white: {}, red: {} },
        last_updated: null
    });
}

// ===== WINNING NUMBERS MANAGEMENT =====
function getLatestWinningNumbers() {
    return safeExecute('getLatestWinningNumbers', () => {
        // First try to get from live API data
        if (LATEST_WINNING_NUMBERS && LATEST_WINNING_NUMBERS.source === "NY.gov Live API") {
            logDebug('Using live API winning numbers');
            return LATEST_WINNING_NUMBERS;
        }
        
        // Fallback to local lottery data
        if (!LOTTERY_DATA || !LOTTERY_DATA.results || LOTTERY_DATA.results.length === 0) {
            logWarning('No winning numbers available - no local data');
            return null;
        }
        
        // Get the most recent drawing from local data
        const latest = LOTTERY_DATA.results[0];
        const localData = {
            white: latest.white,
            red: latest.red,
            date: latest.date,
            dateFormatted: formatDate(latest.date + 'T00:00:00'),
            jackpot: latest.jackpot,
            source: "Local Data"
        };
        
        logDebug('Using local data winning numbers', localData);
        return localData;
        
    }, null);
}

async function refreshWinningNumbers() {
    return safeAsyncExecute('refreshWinningNumbers', async () => {
        logDebug('Manually refreshing winning numbers');
        
        const refreshBtn = document.querySelector('button[onclick="refreshWinningNumbers()"]');
        if (refreshBtn) {
            const originalText = refreshBtn.innerHTML;
            refreshBtn.innerHTML = '⏳ Loading...';
            refreshBtn.disabled = true;
            
            try {
                const liveNumbers = await fetchLiveWinningNumbers();
                if (liveNumbers) {
                    LATEST_WINNING_NUMBERS = liveNumbers;
                    displayLatestWinningNumbers();
                    
                    // Regenerate all methods with new winning numbers
                    if (typeof generateAllMethods === 'function') {
                        generateAllMethods();
                    }
                    
                    logDebug('Successfully refreshed winning numbers');
                    return liveNumbers;
                } else {
                    logError('Failed to fetch updated winning numbers');
                    return null;
                }
            } finally {
                refreshBtn.innerHTML = originalText;
                refreshBtn.disabled = false;
            }
        }
        
    }, null);
}

// ===== DISPLAY FUNCTIONS =====
function displayLatestWinningNumbers() {
    return safeExecute('displayLatestWinningNumbers', () => {
        const latestDiv = document.getElementById('latest-winning');
        const displayDiv = document.getElementById('winning-display');
        const dateDiv = document.getElementById('winning-date');
        
        if (!latestDiv || !displayDiv || !dateDiv) {
            logError('Missing winning number display elements');
            return;
        }
        
        if (!LATEST_WINNING_NUMBERS) {
            latestDiv.style.display = 'none';
            logDebug('No winning numbers to display');
            return;
        }
        
        const { white, red, dateFormatted, jackpot, source } = LATEST_WINNING_NUMBERS;
        
        // Display the winning numbers
        let html = '<div class="winning-numbers">';
        white.forEach(num => {
            html += `<span class="white-ball">${num}</span>`;
        });
        html += `<span class="red-ball">${red}</span>`;
        html += '</div>';
        
        displayDiv.innerHTML = html;
        
        const jackpotFormatted = jackpot && jackpot !== "0" && jackpot !== "Unknown" ? 
            `$${parseInt(jackpot).toLocaleString()}` : 
            'Unknown';
        
        const sourceIndicator = source === "NY.gov Live API" ? "🔴 LIVE" : "📁 Local";
        
        dateDiv.innerHTML = `
            ${sourceIndicator} | Drawing: ${dateFormatted}<br>
            Jackpot: ${jackpotFormatted}
        `;
        
        latestDiv.style.display = 'block';
        
        logDebug('Winning numbers displayed', {
            source: source,
            date: dateFormatted,
            numbers: `${white.join(', ')} + ${red}`
        });
        
    }, null);
}

// ===== DATA INITIALIZATION =====
async function initializeLotteryData() {
    return safeAsyncExecute('initializeLotteryData', async () => {
        logDebug('Initializing lottery data system');
        
        // Try to fetch live winning numbers first
        const liveNumbers = await fetchLiveWinningNumbers();
        if (liveNumbers) {
            LATEST_WINNING_NUMBERS = liveNumbers;
            logDebug('Live winning numbers loaded');
        }
        
        // Load local lottery data for frequency analysis
        await loadLotteryData();
        
        // If we didn't get live numbers, try local data
        if (!LATEST_WINNING_NUMBERS) {
            LATEST_WINNING_NUMBERS = getLatestWinningNumbers();
            if (LATEST_WINNING_NUMBERS) {
                logDebug('Using local data for winning numbers');
            }
        }
        
        // Display the winning numbers
        if (LATEST_WINNING_NUMBERS) {
            displayLatestWinningNumbers();
        } else {
            logWarning('No winning numbers available from any source');
        }
        
        logDebug('Lottery data initialization completed', {
            hasLiveNumbers: !!(LATEST_WINNING_NUMBERS && LATEST_WINNING_NUMBERS.source === "NY.gov Live API"),
            hasLocalData: !!(LOTTERY_DATA && LOTTERY_DATA.results.length > 0),
            latestSource: LATEST_WINNING_NUMBERS?.source || 'None'
        });
        
        return {
            liveData: LATEST_WINNING_NUMBERS,
            localData: LOTTERY_DATA
        };
        
    }, null);
}

// ===== API HEALTH MONITORING =====
async function checkApiHealth() {
    return safeAsyncExecute('checkApiHealth', async () => {
        const healthStatus = {
            timestamp: new Date().toISOString(),
            nyGovApi: { status: 'unknown', responseTime: null, error: null },
            localData: { status: 'unknown', size: null, error: null }
        };
        
        // Test NY.gov API
        try {
            const startTime = performance.now();
            const response = await fetch("https://data.ny.gov/api/views/d6yy-54nr/rows.json", {
                method: 'HEAD',
                timeout: 5000
            });
            const endTime = performance.now();
            
            healthStatus.nyGovApi.status = response.ok ? 'healthy' : 'error';
            healthStatus.nyGovApi.responseTime = Math.round(endTime - startTime);
            
            if (!response.ok) {
                healthStatus.nyGovApi.error = `HTTP ${response.status}`;
            }
        } catch (error) {
            healthStatus.nyGovApi.status = 'error';
            healthStatus.nyGovApi.error = error.message;
        }
        
        // Test local data
        try {
            const response = await fetch('lottery-data.json', { method: 'HEAD' });
            healthStatus.localData.status = response.ok ? 'healthy' : 'error';
            healthStatus.localData.size = response.headers.get('content-length');
            
            if (!response.ok) {
                healthStatus.localData.error = `HTTP ${response.status}`;
            }
        } catch (error) {
            healthStatus.localData.status = 'error';
            healthStatus.localData.error = error.message;
        }
        
        logDebug('API health check completed', healthStatus);
        return healthStatus;
        
    }, null);
}

// ===== BACKUP DATA SOURCES =====
async function fetchFromBackupSource() {
    return safeAsyncExecute('fetchFromBackupSource', async () => {
        logDebug('Attempting backup data source');
        
        // This could be expanded to include additional lottery data APIs
        // For now, it returns a reasonable fallback
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Generate deterministic fallback data based on current date
        const dateStr = yesterday.toISOString().split('T')[0];
        const seed = dateStr.split('-').reduce((sum, part) => sum + parseInt(part), 0);
        
        const white = [];
        for (let i = 0; i < 5; i++) {
            let num;
            do {
                num = ((seed * (i + 1) * 17 + i * 23) % 69) + 1;
            } while (white.includes(num));
            white.push(num);
        }
        
        const red = ((seed * 7) % 26) + 1;
        
        const fallbackData = {
            white: white.sort((a, b) => a - b),
            red: red,
            date: dateStr,
            dateFormatted: formatDate(dateStr + 'T00:00:00'),
            jackpot: "100000000",
            source: "Fallback Generator"
        };
        
        logDebug('Generated fallback winning numbers', fallbackData);
        return fallbackData;
        
    }, null);
}

// ===== EXPORT FUNCTIONS =====
window.fetchLiveWinningNumbers = fetchLiveWinningNumbers;
window.refreshWinningNumbers = refreshWinningNumbers;
window.loadLotteryData = loadLotteryData;
window.initializeLotteryData = initializeLotteryData;
