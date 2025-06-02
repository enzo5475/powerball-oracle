// ===== MAIN APPLICATION CONTROLLER =====

// Application state
let APP_STATE = {
    initialized: false,
    generating: false,
    lastGeneration: null,
    methodCount: 0,
    winningNumbers: null,
    currentResults: []
};

// ===== METHOD REGISTRY =====
const CALCULATION_METHODS = [
    // Basic Mathematical Methods
    { name: '🌙 Lunar Calculations', func: calculateLunarNumbers, category: 'mathematical' },
    { name: '🌀 Fibonacci Sequence', func: calculateFibonacciNumbers, category: 'mathematical' },
    { name: '✨ Golden Ratio', func: calculateGoldenRatioNumbers, category: 'mathematical' },
    { name: '🔢 Pi Sequence', func: calculatePiNumbers, category: 'mathematical' },
    { name: '📈 Euler Numbers', func: calculateEulerNumbers, category: 'mathematical' },
    
    // Sacred & Divine Methods
    { name: '📜 Gematria', func: calculateGematriaNumbers, category: 'sacred' },
    { name: '🌳 Kabbalah Tree', func: calculateKabbalahNumbers, category: 'sacred' },
    { name: '🕉️ Vedic Numbers', func: calculateVedicNumbers, category: 'sacred' },
    { name: 'ᚱ Elder Futhark Runes', func: calculateRuneNumbers, category: 'sacred' },
    { name: '🔮 Tarot Cards', func: calculateTarotNumbers, category: 'sacred' },
    { name: '☪️ Islamic Sacred', func: calculateIslamicNumbers, category: 'sacred' },
    { name: '🌳 Celtic Ogham', func: calculateOghamNumbers, category: 'sacred' },
    
    // Astrological & Celestial Methods
    { name: '🪐 Planetary Positions', func: calculatePlanetaryNumbers, category: 'astrological' },
    { name: '♈ Zodiac Degrees', func: calculateZodiacNumbers, category: 'astrological' },
    { name: '☀️ Solar Cycles', func: calculateSolarCycleNumbers, category: 'astrological' },
    
    // Advanced Mathematical Methods
    { name: '🌀 Chaos Theory', func: calculateChaosNumbers, category: 'advanced' },
    { name: '🔢 Prime Gaps', func: calculatePrimeGapNumbers, category: 'advanced' },
    { name: '🔶 Catalan Numbers', func: calculateCatalanNumbers, category: 'advanced' },
    
    // Temporal/Calendar Methods
    { name: '🐉 Chinese Calendar', func: calculateChineseNumbers, category: 'temporal' },
    { name: '✡️ Jewish Calendar', func: calculateJewishNumbers, category: 'temporal' },
    { name: '🗿 Mayan Tzolkin', func: calculateMayanNumbers, category: 'temporal' },
    
    // Additional Sacred Methods
    { name: '👼 Angel Numbers', func: calculateAngelNumbers, category: 'sacred' },
    { name: '☯ I Ching', func: calculateIChing, category: 'sacred' },
    { name: '🔺 Sacred Geometry', func: calculateSacredGeometry, category: 'mathematical' },
    
    // Data-driven Method
    { name: '📊 Frequency Analysis', func: calculateFrequencyAnalysis, category: 'statistical' }
];

// ===== CORE APPLICATION FUNCTIONS =====
async function initializeApp() {
    return safeAsyncExecute('initializeApp', async () => {
        logDebug('Starting application initialization');
        
        if (APP_STATE.initialized) {
            logDebug('App already initialized');
            return;
        }
        
        // Update state
        APP_STATE.initialized = false;
        APP_STATE.methodCount = CALCULATION_METHODS.length;
        
        // Initialize lottery data and API
        const dataResult = await initializeLotteryData();
        if (dataResult) {
            APP_STATE.winningNumbers = dataResult.liveData;
            logDebug('Lottery data initialized', {
                hasLiveData: !!dataResult.liveData,
                hasLocalData: !!dataResult.localData
            });
        }
        
        // Run system health check
        const healthCheck = checkSystemHealth();
        if (healthCheck.status === 'critical') {
            logError('Critical issues detected during initialization', healthCheck.issues);
        }
        
        // Mark as initialized
        APP_STATE.initialized = true;
        
        logDebug('Application initialization completed', {
            methodCount: APP_STATE.methodCount,
            hasWinningNumbers: !!APP_STATE.winningNumbers,
            healthStatus: healthCheck.status
        });
        
        // Auto-generate numbers after initialization
        setTimeout(() => {
            generateAllMethods();
        }, 1000);
        
    }, null);
}

function generateAllMethods() {
    return safeExecute('generateAllMethods', () => {
        if (APP_STATE.generating) {
            logDebug('Generation already in progress, skipping');
            return;
        }
        
        logDebug('Starting number generation for all methods');
        APP_STATE.generating = true;
        
        const resultsDiv = document.getElementById('results');
        const timestampDiv = document.getElementById('timestamp');
        
        if (!resultsDiv) {
            logError('Results container not found');
            APP_STATE.generating = false;
            return;
        }
        
        // Show loading state
        resultsDiv.innerHTML = '<div class="loading">🔮 Calculating divine mathematics... 🔮</div>';
        
        setTimeout(() => {
            try {
                // Generate numbers from all methods
                const results = generateNumbersFromAllMethods();
                
                // Check against winning numbers if available
                const checkedResults = checkResultsAgainstWinning(results);
                
                // Store current results
                APP_STATE.currentResults = checkedResults;
                APP_STATE.lastGeneration = new Date();
                
                // Display results
                displayResults(checkedResults);
                updateTimestamp(timestampDiv);
                
                // Calculate and log statistics
                const stats = calculateWinStatistics(checkedResults);
                logDebug('Generation statistics', stats);
                
                // Check for notable wins
                const notableWins = checkForNotableWins(checkedResults);
                if (notableWins.length > 0) {
                    logDebug('Notable wins found', { count: notableWins.length, wins: notableWins });
                }
                
                logDebug('Number generation completed successfully', {
                    methodCount: results.length,
                    winningMethods: stats.winningMethods,
                    totalWinnings: stats.totalWinnings
                });
                
            } catch (error) {
                logError('Error during number generation', {
                    error: error.message,
                    stack: error.stack
                });
                
                resultsDiv.innerHTML = `
                    <div class="error-box">
                        <h4>Generation Error</h4>
                        <div>Failed to generate numbers: ${error.message}</div>
                        <div style="margin-top: 10px;">
                            <button class="toggle-btn" onclick="toggleErrors()">Show Error Details</button>
                        </div>
                    </div>
                `;
            } finally {
                APP_STATE.generating = false;
            }
        }, 1500); // Delay for dramatic effect
        
    }, null);
}

function generateNumbersFromAllMethods() {
    return safeExecute('generateNumbersFromAllMethods', () => {
        logDebug('Executing all calculation methods');
        
        const results = [];
        let successCount = 0;
        let errorCount = 0;
        
        CALCULATION_METHODS.forEach((method, index) => {
            try {
                logDebug(`Calculating method: ${method.name}`);
                
                const startTime = performance.now();
                const result = method.func();
                const endTime = performance.now();
                
                // Validate result format
                if (!result || !result.whites || !result.red || !result.note) {
                    throw new Error(`Invalid result format from ${method.name}`);
                }
                
                // Validate numbers
                if (!validateNumbers(result.whites, result.red, `from ${method.name}`)) {
                    throw new Error(`Invalid numbers from ${method.name}`);
                }
                
                results.push({
                    ...result,
                    name: method.name,
                    category: method.category,
                    executionTime: (endTime - startTime).toFixed(2)
                });
                
                successCount++;
                
            } catch (error) {
                logError(`Error in method ${method.name}`, {
                    error: error.message,
                    stack: error.stack,
                    methodIndex: index
                });
                
                // Add error placeholder
                results.push({
                    name: method.name,
                    category: method.category,
                    whites: [1, 2, 3, 4, 5],
                    red: 1,
                    note: `❌ Error: ${error.message}`,
                    hasError: true
                });
                
                errorCount++;
            }
        });
        
        logDebug('Method execution summary', {
            total: CALCULATION_METHODS.length,
            successful: successCount,
            errors: errorCount,
            successRate: `${((successCount / CALCULATION_METHODS.length) * 100).toFixed(1)}%`
        });
        
        return results;
        
    }, []);
}

function checkResultsAgainstWinning(results) {
    return safeExecute('checkResultsAgainstWinning', () => {
        const winningNumbers = getLatestWinningNumbers();
        
        if (!winningNumbers) {
            logWarning('No winning numbers available for comparison');
            return results.map(result => ({
                ...result,
                winStatus: {
                    prize: 'No comparison available',
                    amount: '$0',
                    class: 'none'
                }
            }));
        }
        
        return checkAllMethodsAgainstWinning(results, winningNumbers);
        
    }, results);
}

function displayResults(results) {
    return safeExecute('displayResults', () => {
        const resultsDiv = document.getElementById('results');
        if (!resultsDiv) {
            logError('Results display container not found');
            return;
        }
        
        let html = '';
        
        results.forEach(result => {
            const winStatus = result.winStatus || {
                prize: 'No win',
                amount: '$0',
                class: 'none'
            };
            
            const winStatusHtml = result.hasError ? '' : 
                `<div class="winning-status win-${winStatus.class}">${winStatus.prize}</div>`;
            
            const categoryClass = `category-${result.category || 'unknown'}`;
            
            html += `
                <div class="method-group ${categoryClass}">
                    <div class="method-title">${result.name}</div>
                    <div class="numbers">
                        ${result.whites.map(num => `<span class="white-ball">${num}</span>`).join('')}
                        <span class="red-ball">${result.red}</span>
                    </div>
                    <div class="calculation-note">${result.note}</div>
                    ${winStatusHtml}
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
        
        logDebug('Results displayed', {
            resultCount: results.length,
            htmlLength: html.length
        });
        
    }, null);
}

function updateTimestamp(timestampDiv) {
    return safeExecute('updateTimestamp', () => {
        if (!timestampDiv) return;
        
        const now = new Date();
        const dataStatus = LOTTERY_DATA ? 
            `Data: ${LOTTERY_DATA.results?.length || 0} drawings` : 
            'Data: Not loaded';
        
        const winningStatus = APP_STATE.winningNumbers ? 
            `Latest: ${APP_STATE.winningNumbers.dateFormatted} (${APP_STATE.winningNumbers.source})` :
            'No winning numbers';
        
        const nextLunarPhase = 29.53 - (getCurrentLunarPhase() * 3.69);
        
        timestampDiv.innerHTML = `
            Generated: ${now.toLocaleString()}<br>
            ${dataStatus}<br>
            ${winningStatus}<br>
            Next lunar phase in ${nextLunarPhase.toFixed(1)} days
        `;
        
    }, null);
}

// ===== UI EVENT HANDLERS =====
async function handleRefreshWinningNumbers() {
    return safeAsyncExecute('handleRefreshWinningNumbers', async () => {
        logDebug('User requested winning numbers refresh');
        
        const result = await refreshWinningNumbers();
        if (result) {
            APP_STATE.winningNumbers = result;
            
            // Regenerate all methods with new winning numbers
            generateAllMethods();
        }
        
        return result;
        
    }, null);
}

function handleToggleDebug() {
    return safeExecute('handleToggleDebug', () => {
        toggleDebug();
    }, null);
}

function handleToggleErrors() {
    return safeExecute('handleToggleErrors', () => {
        toggleErrors();
    }, null);
}

// ===== STATISTICS AND ANALYTICS =====
function getAppStatistics() {
    return safeExecute('getAppStatistics', () => {
        const stats = {
            appState: { ...APP_STATE },
            methodStats: {
                total: CALCULATION_METHODS.length,
                byCategory: {}
            },
            performance: {
                lastGenerationTime: APP_STATE.lastGeneration,
                averageExecutionTime: null
            },
            winnings: null
        };
        
        // Calculate method distribution by category
        CALCULATION_METHODS.forEach(method => {
            const category = method.category || 'unknown';
            stats.methodStats.byCategory[category] = (stats.methodStats.byCategory[category] || 0) + 1;
        });
        
        // Calculate average execution time
        if (APP_STATE.currentResults.length > 0) {
            const executionTimes = APP_STATE.currentResults
                .filter(result => result.executionTime)
                .map(result => parseFloat(result.executionTime));
            
            if (executionTimes.length > 0) {
                stats.performance.averageExecutionTime = 
                    (executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length).toFixed(2);
            }
        }
        
        // Get current winnings
        if (APP_STATE.currentResults.length > 0) {
            stats.winnings = calculateWinStatistics(APP_STATE.currentResults);
        }
        
        logDebug('App statistics calculated', stats);
        return stats;
        
    }, null);
}

// ===== GLOBAL EVENT HANDLERS =====
window.generateAllMethods = generateAllMethods;
window.refreshWinningNumbers = handleRefreshWinningNumbers;
window.toggleDebug = handleToggleDebug;
window.toggleErrors = handleToggleErrors;

// ===== APPLICATION LIFECYCLE =====
document.addEventListener('DOMContentLoaded', () => {
    logDebug('DOM content loaded, starting app initialization');
    initializeApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        logDebug('Page became visible');
        
        // Check if data is stale (more than 1 hour old)
        if (APP_STATE.lastGeneration) {
            const hoursSinceLastGeneration = (new Date() - APP_STATE.lastGeneration) / (1000 * 60 * 60);
            if (hoursSinceLastGeneration > 1) {
                logDebug('Data is stale, refreshing');
                generateAllMethods();
            }
        }
    }
});

// Handle errors and cleanup
window.addEventListener('beforeunload', () => {
    logDebug('Page unloading, performing cleanup');
    
    // Save any important state to sessionStorage if needed
    try {
        sessionStorage.setItem('powerball-oracle-state', JSON.stringify({
            lastGeneration: APP_STATE.lastGeneration,
            methodCount: APP_STATE.methodCount
        }));
    } catch (error) {
        logError('Failed to save state before unload', error);
    }
});

// ===== INITIALIZATION =====
logDebug('Main application script loaded', {
    methodCount: CALCULATION_METHODS.length,
    categories: [...new Set(CALCULATION_METHODS.map(m => m.category))],
    timestamp: new Date().toISOString()
});
