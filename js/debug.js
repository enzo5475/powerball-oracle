// ===== DEBUG & ERROR SYSTEM =====

// Global error and debug storage
let ERROR_LOG = [];
let DEBUG_INFO = [];

// ===== ERROR LOGGING FUNCTIONS =====
function logError(message, details = null) {
    const timestamp = new Date().toLocaleString();
    const errorEntry = { 
        timestamp, 
        message, 
        details,
        type: 'error'
    };
    
    ERROR_LOG.push(errorEntry);
    console.error(`[${timestamp}] ERROR: ${message}`, details);
    
    // Keep only last 20 errors to prevent memory issues
    if (ERROR_LOG.length > 20) {
        ERROR_LOG = ERROR_LOG.slice(-20);
    }
    
    updateErrorDisplay();
    return errorEntry;
}

function logDebug(message, data = null) {
    const timestamp = new Date().toLocaleString();
    const debugEntry = { 
        timestamp, 
        message, 
        data,
        type: 'debug'
    };
    
    DEBUG_INFO.push(debugEntry);
    console.log(`[${timestamp}] DEBUG: ${message}`, data);
    
    // Keep only last 30 debug entries
    if (DEBUG_INFO.length > 30) {
        DEBUG_INFO = DEBUG_INFO.slice(-30);
    }
    
    updateDebugDisplay();
    return debugEntry;
}

function logWarning(message, details = null) {
    const timestamp = new Date().toLocaleString();
    const warningEntry = { 
        timestamp, 
        message, 
        details,
        type: 'warning'
    };
    
    ERROR_LOG.push(warningEntry);
    console.warn(`[${timestamp}] WARNING: ${message}`, details);
    
    if (ERROR_LOG.length > 20) {
        ERROR_LOG = ERROR_LOG.slice(-20);
    }
    
    updateErrorDisplay();
    return warningEntry;
}

// ===== DISPLAY UPDATE FUNCTIONS =====
function updateErrorDisplay() {
    const errorBox = document.getElementById('error-status');
    if (!errorBox) return;
    
    if (ERROR_LOG.length === 0) {
        errorBox.style.display = 'none';
        return;
    }
    
    const recent = ERROR_LOG.slice(-5); // Show last 5 errors/warnings
    let html = '<h4>🚨 Error & Warning Log</h4>';
    
    recent.forEach(entry => {
        const icon = entry.type === 'warning' ? '⚠️' : '❌';
        const typeClass = entry.type === 'warning' ? 'warning' : 'error';
        
        html += `
            <div class="log-entry ${typeClass}">
                <div class="log-header">
                    <span class="log-icon">${icon}</span>
                    <span class="log-time">${entry.timestamp}</span>
                </div>
                <div class="log-message">${entry.message}</div>
        `;
        
        if (entry.details) {
            html += `
                <div class="log-details">
                    <pre>${JSON.stringify(entry.details, null, 2)}</pre>
                </div>
            `;
        }
        
        html += '</div>';
    });
    
    if (ERROR_LOG.length > 5) {
        html += `<div class="log-summary">... and ${ERROR_LOG.length - 5} earlier entries</div>`;
    }
    
    errorBox.innerHTML = html;
}

function updateDebugDisplay() {
    const debugBox = document.getElementById('debug-info');
    if (!debugBox) return;
    
    if (DEBUG_INFO.length === 0) return;
    
    const recent = DEBUG_INFO.slice(-10); // Show last 10 debug entries
    let html = '<h4>🔍 Debug Information</h4>';
    
    recent.forEach(entry => {
        html += `
            <div class="debug-entry">
                <div class="debug-header">
                    <span class="debug-icon">🔍</span>
                    <span class="debug-time">${entry.timestamp}</span>
                </div>
                <div class="debug-message">${entry.message}</div>
        `;
        
        if (entry.data) {
            html += `
                <div class="debug-data">
                    <pre>${JSON.stringify(entry.data, null, 2)}</pre>
                </div>
            `;
        }
        
        html += '</div>';
    });
    
    if (DEBUG_INFO.length > 10) {
        html += `<div class="debug-summary">... and ${DEBUG_INFO.length - 10} earlier entries</div>`;
    }
    
    debugBox.innerHTML = html;
}

// ===== TOGGLE FUNCTIONS =====
function toggleDebug() {
    const debugBox = document.getElementById('debug-info');
    if (!debugBox) {
        logError('Debug box element not found');
        return;
    }
    
    const isVisible = debugBox.style.display !== 'none';
    debugBox.style.display = isVisible ? 'none' : 'block';
    
    // Update debug display when showing
    if (!isVisible) {
        updateDebugDisplay();
    }
    
    logDebug(`Debug panel ${isVisible ? 'hidden' : 'shown'}`);
}

function toggleErrors() {
    const errorBox = document.getElementById('error-status');
    if (!errorBox) {
        logError('Error box element not found');
        return;
    }
    
    const isVisible = errorBox.style.display !== 'none';
    errorBox.style.display = isVisible ? 'none' : 'block';
    
    // Update error display when showing
    if (!isVisible) {
        updateErrorDisplay();
    }
    
    logDebug(`Error panel ${isVisible ? 'hidden' : 'shown'}`);
}

// ===== SYSTEM HEALTH CHECKS =====
function checkSystemHealth() {
    const healthReport = {
        timestamp: new Date().toLocaleString(),
        issues: [],
        warnings: [],
        status: 'healthy'
    };
    
    // Check if required elements exist
    const requiredElements = [
        'results', 'latest-winning', 'error-status', 'debug-info', 'timestamp'
    ];
    
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (!element) {
            healthReport.issues.push(`Missing element: ${id}`);
        }
    });
    
    // Check if required functions exist
    const requiredFunctions = [
        'generateAllMethods', 'calculateLunarNumbers', 'fetchLiveWinningNumbers'
    ];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] !== 'function') {
            healthReport.issues.push(`Missing function: ${funcName}`);
        }
    });
    
    // Check data availability
    if (typeof LOTTERY_DATA === 'undefined') {
        healthReport.warnings.push('LOTTERY_DATA not defined');
    } else if (!LOTTERY_DATA || !LOTTERY_DATA.results) {
        healthReport.warnings.push('LOTTERY_DATA has no results');
    }
    
    // Check constants
    if (typeof PI_DIGITS === 'undefined') {
        healthReport.issues.push('Mathematical constants not loaded');
    }
    
    // Determine overall status
    if (healthReport.issues.length > 0) {
        healthReport.status = 'critical';
    } else if (healthReport.warnings.length > 0) {
        healthReport.status = 'warning';
    }
    
    logDebug('System health check completed', healthReport);
    
    if (healthReport.status === 'critical') {
        logError('Critical system issues detected', healthReport.issues);
    } else if (healthReport.status === 'warning') {
        logWarning('System warnings detected', healthReport.warnings);
    }
    
    return healthReport;
}

// ===== PERFORMANCE MONITORING =====
function measurePerformance(functionName, func, ...args) {
    const startTime = performance.now();
    
    try {
        const result = func(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        logDebug(`Performance: ${functionName}`, {
            duration: `${duration.toFixed(2)}ms`,
            success: true
        });
        
        return result;
    } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        logError(`Performance: ${functionName} failed`, {
            duration: `${duration.toFixed(2)}ms`,
            error: error.message,
            stack: error.stack
        });
        
        throw error;
    }
}

// ===== ERROR BOUNDARIES =====
function safeExecute(functionName, func, fallbackValue = null) {
    try {
        logDebug(`Executing: ${functionName}`);
        const result = func();
        logDebug(`Completed: ${functionName}`, { success: true });
        return result;
    } catch (error) {
        logError(`Failed: ${functionName}`, {
            error: error.message,
            stack: error.stack
        });
        return fallbackValue;
    }
}

function safeAsyncExecute(functionName, asyncFunc, fallbackValue = null) {
    return new Promise(async (resolve, reject) => {
        try {
            logDebug(`Executing async: ${functionName}`);
            const result = await asyncFunc();
            logDebug(`Completed async: ${functionName}`, { success: true });
            resolve(result);
        } catch (error) {
            logError(`Failed async: ${functionName}`, {
                error: error.message,
                stack: error.stack
            });
            resolve(fallbackValue);
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function clearErrorLog() {
    ERROR_LOG = [];
    updateErrorDisplay();
    logDebug('Error log cleared');
}

function clearDebugLog() {
    DEBUG_INFO = [];
    updateDebugDisplay();
    logDebug('Debug log cleared');
}

function exportLogs() {
    const exportData = {
        timestamp: new Date().toISOString(),
        errors: ERROR_LOG,
        debug: DEBUG_INFO,
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `powerball-oracle-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    logDebug('Logs exported');
}

// ===== INITIALIZATION =====
function initializeDebugSystem() {
    logDebug('Debug system initializing');
    
    // Set up global error handler
    window.addEventListener('error', (event) => {
        logError('Global error caught', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
        });
    });
    
    // Set up unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        logError('Unhandled promise rejection', {
            reason: event.reason,
            promise: event.promise
        });
    });
    
    // Add debug panel styling
    const style = document.createElement('style');
    style.textContent = `
        .log-entry { margin-bottom: 8px; padding: 5px; border-radius: 3px; }
        .log-entry.error { background: rgba(220, 20, 60, 0.1); }
        .log-entry.warning { background: rgba(255, 165, 0, 0.1); }
        .log-header { display: flex; align-items: center; gap: 8px; font-weight: bold; }
        .log-time { font-size: 0.8em; color: #999; }
        .log-message { margin: 3px 0; }
        .log-details, .debug-data { 
            background: rgba(0,0,0,0.3); 
            padding: 5px; 
            border-radius: 3px; 
            margin-top: 5px;
            font-size: 0.8em;
        }
        .log-details pre, .debug-data pre { 
            margin: 0; 
            white-space: pre-wrap; 
            word-break: break-word; 
        }
        .log-summary, .debug-summary { 
            text-align: center; 
            font-style: italic; 
            color: #666; 
            margin-top: 8px; 
        }
        .debug-entry { margin-bottom: 6px; }
        .debug-header { display: flex; align-items: center; gap: 8px; }
        .debug-message { color: #87ceeb; margin: 2px 0; }
    `;
    document.head.appendChild(style);
    
    // Run initial health check
    setTimeout(() => {
        checkSystemHealth();
    }, 1000);
    
    logDebug('Debug system initialized');
}

// ===== AUTO-INITIALIZATION =====
// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDebugSystem);
} else {
    initializeDebugSystem();
}
