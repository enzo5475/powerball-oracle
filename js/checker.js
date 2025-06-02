// ===== POWERBALL WINNING CHECKER SYSTEM =====

// Powerball prize structure (official rules)
const POWERBALL_PRIZES = {
    '5+PB': { amount: 'JACKPOT', display: 'JACKPOT! 🎰💰', class: 'jackpot' },
    '5+0': { amount: 1000000, display: '🎉 $1,000,000', class: 'million' },
    '4+PB': { amount: 50000, display: '🎉 $50,000', class: 'large' },
    '4+0': { amount: 100, display: '🎉 $100', class: 'medium' },
    '3+PB': { amount: 100, display: '🎉 $100', class: 'medium' },
    '3+0': { amount: 7, display: '🎉 $7', class: 'small' },
    '2+PB': { amount: 7, display: '🎉 $7', class: 'small' },
    '1+PB': { amount: 4, display: '🎉 $4', class: 'small' },
    '0+PB': { amount: 4, display: '🎉 $4', class: 'small' },
    'NONE': { amount: 0, display: 'No win', class: 'none' }
};

// ===== CORE WINNING LOGIC =====
function checkWinnings(myWhite, myRed, winningWhite, winningRed) {
    return safeExecute('checkWinnings', () => {
        // Validate inputs
        if (!Array.isArray(myWhite) || !Array.isArray(winningWhite)) {
            logError('Invalid input arrays for winning check', {
                myWhite: myWhite,
                winningWhite: winningWhite
            });
            return POWERBALL_PRIZES.NONE;
        }
        
        if (myWhite.length !== 5 || winningWhite.length !== 5) {
            logError('Invalid white ball count', {
                myWhiteCount: myWhite.length,
                winningWhiteCount: winningWhite.length
            });
            return POWERBALL_PRIZES.NONE;
        }
        
        logDebug('Checking winning combination', {
            myNumbers: `${myWhite.join(', ')} + ${myRed}`,
            winningNumbers: `${winningWhite.join(', ')} + ${winningRed}`
        });
        
        // Count how many white numbers match (order doesn't matter)
        const whiteMatches = myWhite.filter(num => winningWhite.includes(num)).length;
        const redMatch = myRed === winningRed;
        
        logDebug('Match analysis', {
            whiteMatches: whiteMatches,
            redMatch: redMatch,
            matchingWhites: myWhite.filter(num => winningWhite.includes(num))
        });
        
        // Determine prize tier based on official Powerball rules
        let prizeKey;
        if (whiteMatches === 5 && redMatch) {
            prizeKey = '5+PB';
        } else if (whiteMatches === 5 && !redMatch) {
            prizeKey = '5+0';
        } else if (whiteMatches === 4 && redMatch) {
            prizeKey = '4+PB';
        } else if (whiteMatches === 4 && !redMatch) {
            prizeKey = '4+0';
        } else if (whiteMatches === 3 && redMatch) {
            prizeKey = '3+PB';
        } else if (whiteMatches === 3 && !redMatch) {
            prizeKey = '3+0';
        } else if (whiteMatches === 2 && redMatch) {
            prizeKey = '2+PB';
        } else if (whiteMatches === 1 && redMatch) {
            prizeKey = '1+PB';
        } else if (whiteMatches === 0 && redMatch) {
            prizeKey = '0+PB';
        } else {
            prizeKey = 'NONE';
        }
        
        const prize = POWERBALL_PRIZES[prizeKey];
        
        logDebug('Prize determination', {
            prizeKey: prizeKey,
            prize: prize,
            formattedAmount: formatPrizeAmount(prize.amount)
        });
        
        return {
            prize: prize.display,
            amount: formatPrizeAmount(prize.amount),
            class: prize.class,
            tier: prizeKey,
            matches: { white: whiteMatches, red: redMatch }
        };
        
    }, POWERBALL_PRIZES.NONE);
}

// ===== HELPER FUNCTIONS =====
function formatPrizeAmount(amount) {
    if (amount === 'JACKPOT') {
        return 'Jackpot';
    } else if (amount === 0) {
        return '$0';
    } else if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    } else {
        return `$${amount}`;
    }
}

function validateNumbers(white, red, context = '') {
    const errors = [];
    
    if (!Array.isArray(white)) {
        errors.push('White numbers must be an array');
    } else {
        if (white.length !== 5) {
            errors.push(`White numbers must contain 5 numbers, got ${white.length}`);
        }
        
        white.forEach((num, index) => {
            if (!Number.isInteger(num) || num < 1 || num > 69) {
                errors.push(`White ball ${index + 1} invalid: ${num} (must be 1-69)`);
            }
        });
        
        // Check for duplicates
        const uniqueWhite = [...new Set(white)];
        if (uniqueWhite.length !== white.length) {
            errors.push('White numbers contain duplicates');
        }
    }
    
    if (!Number.isInteger(red) || red < 1 || red > 26) {
        errors.push(`Red Powerball invalid: ${red} (must be 1-26)`);
    }
    
    if (errors.length > 0) {
        logError(`Number validation failed ${context}`, {
            white: white,
            red: red,
            errors: errors
        });
        return false;
    }
    
    return true;
}

// ===== BATCH CHECKING =====
function checkAllMethodsAgainstWinning(methods, winningNumbers) {
    return safeExecute('checkAllMethodsAgainstWinning', () => {
        if (!winningNumbers) {
            logWarning('No winning numbers available for comparison');
            return methods.map(method => ({
                ...method,
                winStatus: {
                    prize: 'No comparison available',
                    amount: '$0',
                    class: 'none'
                }
            }));
        }
        
        logDebug('Checking all methods against winning numbers', {
            methodCount: methods.length,
            winningNumbers: `${winningNumbers.white.join(', ')} + ${winningNumbers.red}`
        });
        
        const results = methods.map(method => {
            // Validate method result format
            if (!method.whites || !method.red) {
                logError('Invalid method result format', method);
                return {
                    ...method,
                    winStatus: {
                        prize: 'Invalid format',
                        amount: '$0',
                        class: 'none'
                    }
                };
            }
            
            // Validate numbers
            if (!validateNumbers(method.whites, method.red, `for ${method.name || 'unknown method'}`)) {
                return {
                    ...method,
                    winStatus: {
                        prize: 'Invalid numbers',
                        amount: '$0',
                        class: 'none'
                    }
                };
            }
            
            // Check for winning
            const winResult = checkWinnings(
                method.whites,
                method.red,
                winningNumbers.white,
                winningNumbers.red
            );
            
            return {
                ...method,
                winStatus: winResult
            };
        });
        
        // Log summary of wins
        const winSummary = results.reduce((summary, result) => {
            const tier = result.winStatus.tier || 'NONE';
            summary[tier] = (summary[tier] || 0) + 1;
            return summary;
        }, {});
        
        logDebug('Batch checking completed', {
            totalMethods: results.length,
            winSummary: winSummary
        });
        
        return results;
        
    }, methods.map(method => ({
        ...method,
        winStatus: { prize: 'Check failed', amount: '$0', class: 'none' }
    })));
}

// ===== WIN STATISTICS =====
function calculateWinStatistics(checkedMethods) {
    return safeExecute('calculateWinStatistics', () => {
        const stats = {
            totalMethods: checkedMethods.length,
            winningMethods: 0,
            totalWinnings: 0,
            prizeBreakdown: {},
            biggestWin: null,
            winPercentage: 0
        };
        
        checkedMethods.forEach(method => {
            const winStatus = method.winStatus;
            if (!winStatus || winStatus.class === 'none') return;
            
            stats.winningMethods++;
            
            // Count prize tiers
            const tier = winStatus.tier || 'UNKNOWN';
            stats.prizeBreakdown[tier] = (stats.prizeBreakdown[tier] || 0) + 1;
            
            // Calculate total winnings (excluding jackpot)
            if (winStatus.tier && winStatus.tier !== '5+PB') {
                const prizeAmount = POWERBALL_PRIZES[winStatus.tier]?.amount || 0;
                if (typeof prizeAmount === 'number') {
                    stats.totalWinnings += prizeAmount;
                }
            }
            
            // Track biggest win
            if (!stats.biggestWin || 
                (winStatus.tier === '5+PB') ||
                (stats.biggestWin.tier !== '5+PB' && comparePrizeTiers(winStatus.tier, stats.biggestWin.tier) > 0)) {
                stats.biggestWin = {
                    method: method.name || 'Unknown',
                    tier: winStatus.tier,
                    prize: winStatus.prize
                };
            }
        });
        
        stats.winPercentage = stats.totalMethods > 0 ? 
            (stats.winningMethods / stats.totalMethods * 100).toFixed(1) : 0;
        
        logDebug('Win statistics calculated', stats);
        return stats;
        
    }, {
        totalMethods: 0,
        winningMethods: 0,
        totalWinnings: 0,
        prizeBreakdown: {},
        biggestWin: null,
        winPercentage: 0
    });
}

function comparePrizeTiers(tier1, tier2) {
    const tierOrder = ['5+PB', '5+0', '4+PB', '4+0', '3+PB', '3+0', '2+PB', '1+PB', '0+PB', 'NONE'];
    const index1 = tierOrder.indexOf(tier1);
    const index2 = tierOrder.indexOf(tier2);
    
    if (index1 < index2) return 1;
    if (index1 > index2) return -1;
    return 0;
}

// ===== HISTORICAL WIN TRACKING =====
function trackHistoricalWins(methodName, winResult, winningNumbers) {
    return safeExecute('trackHistoricalWins', () => {
        const winRecord = {
            timestamp: new Date().toISOString(),
            method: methodName,
            winTier: winResult.tier,
            prize: winResult.prize,
            amount: winResult.amount,
            winningNumbers: `${winningNumbers.white.join(', ')} + ${winningNumbers.red}`,
            date: winningNumbers.date
        };
        
        // Store in session (could be expanded to localStorage if needed)
        if (!window.sessionWinHistory) {
            window.sessionWinHistory = [];
        }
        
        window.sessionWinHistory.push(winRecord);
        
        // Keep only last 100 records
        if (window.sessionWinHistory.length > 100) {
            window.sessionWinHistory = window.sessionWinHistory.slice(-100);
        }
        
        logDebug('Win tracked', winRecord);
        return winRecord;
        
    }, null);
}

function getWinHistory(methodName = null, limit = 10) {
    return safeExecute('getWinHistory', () => {
        if (!window.sessionWinHistory) {
            return [];
        }
        
        let history = window.sessionWinHistory.slice();
        
        if (methodName) {
            history = history.filter(record => record.method === methodName);
        }
        
        // Sort by timestamp (newest first)
        history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        return history.slice(0, limit);
        
    }, []);
}

// ===== WIN NOTIFICATION SYSTEM =====
function checkForNotableWins(checkedMethods) {
    return safeExecute('checkForNotableWins', () => {
        const notableWins = [];
        
        checkedMethods.forEach(method => {
            const winStatus = method.winStatus;
            if (!winStatus || winStatus.class === 'none') return;
            
            // Define what constitutes a "notable" win
            const notableTiers = ['5+PB', '5+0', '4+PB', '4+0', '3+PB'];
            
            if (notableTiers.includes(winStatus.tier)) {
                notableWins.push({
                    method: method.name || 'Unknown',
                    tier: winStatus.tier,
                    prize: winStatus.prize,
                    amount: winStatus.amount,
                    numbers: `${method.whites.join(', ')} + ${method.red}`
                });
            }
        });
        
        if (notableWins.length > 0) {
            logDebug('Notable wins detected', notableWins);
            
            // Could trigger notifications here
            notableWins.forEach(win => {
                console.log(`🎉 NOTABLE WIN: ${win.method} - ${win.prize}!`);
            });
        }
        
        return notableWins;
        
    }, []);
}

// ===== EXPORT FUNCTIONS =====
window.checkWinnings = checkWinnings;
window.checkAllMethodsAgainstWinning = checkAllMethodsAgainstWinning;
window.calculateWinStatistics = calculateWinStatistics;
