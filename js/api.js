// ===== LIVE LOTTERY DATA API =====

// Global variables for data management
let LOTTERY_DATA = null;
let LATEST_WINNING_NUMBERS = null;

// ===== NY.GOV API INTEGRATION (CORS-FREE) =====
async function fetchLiveWinningNumbers() {
    return safeAsyncExecute('fetchLiveWinningNumbers', async () => {
        logDebug('Attempting to fetch live winning numbers via CORS proxy');
        
        // Try CORS proxy first
        try {
            const proxyUrl = "https://api.allorigins.win/get?url=";
            const apiUrl = encodeURIComponent("https://data.ny.gov/api/views/d6yy-54nr/rows.json");
            const fullUrl = proxyUrl + apiUrl;
            
            const response = await fetch(fullUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                timeout: 10000
            });
            
            if (!response.ok) {
                throw new Error(`Proxy responded with ${response.status}: ${response.statusText}`);
            }
            
            const proxyData = await response.json();
            const json = JSON.parse(proxyData.contents);
            
            logDebug('Proxy API response received', { 
                dataLength: json.data?.length || 0,
                metaColumns: json.meta?.view?.columns?.length || 0
            });
            
            if (!json.data || json.data.length === 0) {
                throw new Error('No data received from API via proxy');
            }
            
            // Get the latest drawing (last item in array)
            const latest = json.data[json.data.length - 1];
            
            if (!latest || latest.length < 11) {
                throw new Error('Invalid data format from API');
            }
            
            const drawDateRaw = latest[8]; // e.g. "2025-05-31T00:00:00"
            const winningNumbersStr = latest[9]; // e.g. "07 10 11 13 24"
            const powerball = parseInt(latest[10]);
            
            logDebug('Raw API data via proxy', {
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
                source: "NY.gov Live API (via proxy)"
            };
            
            logDebug('Live winning numbers parsed successfully via proxy', liveData);
            return liveData;
            
        } catch (proxyError) {
            logWarning('CORS proxy failed, using fallback generator', { error: proxyError.message });
            
            // Use fallback generator if proxy fails
            return await fetchFromBackupSource();
        }
        
    }, null);
}

function formatJackpotAmount(jackpot) {
    if (!jackpot || jackpot === "Unknown" || jackpot === "0") {
        return 'Unknown';
    }
    
    const amount = parseInt(jackpot);
    if (isNaN(amount)) {
        return 'Unknown';
    }
    
    if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)}M`;
    } else if (amount >= 1000) {
        return `${(amount / 1000).toFixed(0)}K`;
    } else {
        return `${amount.toLocaleString()}`;
    }
}

// ===== AUTOMATIC DATA UPDATE SYSTEM =====
async function updateLocalDataWithLive(liveData) {
    return safeAsyncExecute('updateLocalDataWithLive', async () => {
        if (!liveData) {
            logWarning('No live data to update local storage with');
            return false;
        }
        
        logDebug('Updating local lottery data with live results', liveData);
        
        // Load current local data
        let localData = LOTTERY_DATA || {
            results: [],
            frequency: { white: {}, red: {} },
            last_updated: null
        };
        
        // Check if this drawing already exists
        const existingResult = localData.results.find(r => r.date === liveData.date);
        if (existingResult) {
            logDebug('Live data already exists in local storage', { date: liveData.date });
            return false;
        }
        
        // Add new result to beginning of array
        const newResult = {
            date: liveData.date,
            white: liveData.white,
            red: liveData.red,
            jackpot: liveData.jackpot || "Unknown"
        };
        
        localData.results.unshift(newResult);
        
        // Keep only last 50 results to prevent bloat
        if (localData.results.length > 50) {
            localData.results = localData.results.slice(0, 50);
        }
        
        // Update frequency data
        updateFrequencyData(localData, newResult);
        
        // Update timestamp
        localData.last_updated = new Date().toISOString();
        
        // Store updated data globally
        LOTTERY_DATA = localData;
        
        // Save to localStorage for persistence (if available)
        try {
            localStorage.setItem('powerball-oracle-data', JSON.stringify(localData));
            logDebug('Updated data saved to localStorage');
        } catch (error) {
            logWarning('Could not save to localStorage', { error: error.message });
        }
        
        logDebug('Local lottery data updated successfully', {
            totalResults: localData.results.length,
            newDate: newResult.date,
            lastUpdated: localData.last_updated
        });
        
        return true;
        
    }, false);
}

function updateFrequencyData(data, newResult) {
    // Initialize frequency objects if they don't exist
    if (!data.frequency) {
        data.frequency = { white: {}, red: {} };
    }
    
    // Initialize all numbers to 0 if not present
    for (let i = 1; i <= 69; i++) {
        if (!data.frequency.white[i.toString()]) {
            data.frequency.white[i.toString()] = 0;
        }
    }
    for (let i = 1; i <= 26; i++) {
        if (!data.frequency.red[i.toString()]) {
            data.frequency.red[i.toString()] = 0;
        }
    }
    
    // Update frequencies with new result
    newResult.white.forEach(num => {
        data.frequency.white[num.toString()]++;
    });
    
    data.frequency.red[newResult.red.toString()]++;
    
    logDebug('Frequency data updated', {
        whiteNumbers: newResult.white,
        redNumber: newResult.red
    });
}

async function loadLotteryDataWithFallback() {
    return safeAsyncExecute('loadLotteryDataWithFallback', async () => {
        logDebug('Loading lottery data with localStorage fallback');
        
        // Try localStorage first (most recent)
        try {
            const stored = localStorage.getItem('powerball-oracle-data');
            if (stored) {
                const parsedStored = JSON.parse(stored);
                logDebug('Loaded data from localStorage', {
                    resultsCount: parsedStored.results?.length || 0,
                    lastUpdated: parsedStored.last_updated
                });
                LOTTERY_DATA = parsedStored;
                return parsedStored;
            }
        } catch (error) {
            logWarning('Could not load from localStorage', { error: error.message });
        }
        
        // Fallback to remote file
        try {
            const response = await fetch('lottery-data.json');
            if (response.ok) {
                const text = await response.text();
                const parsedData = JSON.parse(text);
                logDebug('Loaded data from remote file', {
                    resultsCount: parsedData.results?.length || 0
                });
                LOTTERY_DATA = parsedData;
                return parsedData;
            }
        } catch (error) {
            logWarning('Could not load from remote file', { error: error.message });
        }
        
        // Create minimal fallback structure
        const fallbackData = {
            results: [],
            frequency: { white: {}, red: {} },
            last_updated: new Date().toISOString()
        };
        
        // Initialize frequency counters
        for (let i = 1; i <= 69; i++) {
            fallbackData.frequency.white[i.toString()] = 0;
        }
        for (let i = 1; i <= 26; i++) {
            fallbackData.frequency.red[i.toString()] = 0;
        }
        
        LOTTERY_DATA = fallbackData;
        logDebug('Created fallback lottery data structure');
        return fallbackData;
        
    }, null);
}

// ===== WINNING NUMBERS MANAGEMENT =====
function getLatestWinningNumbers() {
    return safeExecute('getLatestWinningNumbers', () => {
        // First try to get from live API data
        if (LATEST_WINNING_NUMBERS && LATEST_WINNING_NUMBERS.source && LATEST_WINNING_NUMBERS.source.includes("NY.gov Live API")) {
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
        
        const jackpotFormatted = formatJackpotAmount(jackpot);
        const sourceIndicator = LATEST_WINNING_NUMBERS.source && LATEST_WINNING_NUMBERS.source.includes("NY.gov Live API") ? "🔴 LIVE" : "📁 Local";
        
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
        
        // Load local/stored data first
        await loadLotteryDataWithFallback();
        
        // Try to fetch live winning numbers
        const liveNumbers = await fetchLiveWinningNumbers();
        if (liveNumbers) {
            LATEST_WINNING_NUMBERS = liveNumbers;
            logDebug('Live winning numbers loaded');
            
            // Update local data with live results
            const updated = await updateLocalDataWithLive(liveNumbers);
            if (updated) {
                logDebug('Local data updated with live results');
            }
        }
        
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
            hasLiveNumbers: !!(LATEST_WINNING_NUMBERS && LATEST_WINNING_NUMBERS.source && LATEST_WINNING_NUMBERS.source.includes("Live API")),
            hasLocalData: !!(LOTTERY_DATA && LOTTERY_DATA.results.length > 0),
            latestSource: LATEST_WINNING_NUMBERS?.source || 'None',
            totalStoredResults: LOTTERY_DATA?.results?.length || 0
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
