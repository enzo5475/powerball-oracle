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
    
    // Force update display immediately
    setTimeout(updateErrorDisplay, 100);
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
    
    // Force update display immediately
    setTimeout(updateDebugDisplay, 100);
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
    
    setTimeout(updateErrorDisplay, 100);
    return warningEntry;
}

// ===== DISPLAY UPDATE FUNCTIONS =====
function updateErrorDisplay() {
    const errorBox = document.getElementById('error-status');
    if (!errorBox) {
        console.error('Error box not found!');
        return;
    }
    
    if (ERROR_LOG.length === 0) {
        errorBox.innerHTML = '<h4>🚨 Error & Warning Log</h4><div>No errors or warnings</div>';
        return;
    }
    
    const recent = ERROR_LOG.slice(-10); // Show last 10 errors/warnings
    let html = '<h4>🚨 Error & Warning Log</h4>';
    
    recent.forEach(entry => {
        const icon = entry.type === 'warning' ? '⚠️' : '❌';
        
        html += `
            <div style="margin-bottom: 10px; padding: 8px; background: rgba(255,0,0,0.1); border-radius: 4px;">
                <div style="font-weight: bold; color: #ff6666;">
                    ${icon} ${entry.timestamp}
                </div>
                <div style="margin: 4px 0; color: #ffcccc;">
                    ${entry.message}
                </div>
        `;
        
        if (entry.details) {
            html += `
                <div style="background: rgba(0,0,0,0.3); padding: 4px; border-radius: 2px; font-size: 0.8em; color: #ccc; margin-top: 4px;">
                    <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(entry.details, null, 2)}</pre>
                </div>
            `;
        }
        
        html += '</div>';
    });
    
    if (ERROR_LOG.length > 10) {
        html += `<div style="text-align: center; color: #999; font-style: italic;">... and ${ERROR_LOG.length - 10} earlier entries</div>`;
    }
    
    errorBox.innerHTML = html;
}

function updateDebugDisplay() {
    const debugBox = document.getElementById('debug-info');
    if (!debugBox) {
        console.error('Debug box not found!');
        return;
    }
    
    if (DEBUG_INFO.length === 0) {
        debugBox.innerHTML = '<h4>🔍 Debug Information</h4><div>No debug information yet</div>';
        return;
    }
    
    const recent = DEBUG_INFO.slice(-15); // Show last 15 debug entries
    let html = '<h4>🔍 Debug Information</h4>';
    
    recent.forEach(entry => {
        html += `
            <div style="margin-bottom: 8px; padding: 6px; background: rgba(0,100,200,0.1); border-radius: 4px;">
                <div style="font-weight: bold; color: #66ccff;">
                    🔍 ${entry.timestamp}
                </div>
                <div style="margin: 4px 0; color: #ccddff;">
                    ${entry.message}
                </div>
        `;
        
        if (entry.data) {
            html += `
                <div style="background: rgba(0,0,0,0.3); padding: 4px; border-radius: 2px; font-size: 0.8em; color: #aaa; margin-top: 4px;">
                    <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(entry.data, null, 2)}</pre>
                </div>
            `;
        }
        
        html += '</div>';
    });
    
    if (DEBUG_INFO.length > 15) {
        html += `<div style="text-align: center; color: #999; font-style: italic;">... and ${DEBUG_INFO.length - 15} earlier entries</div>`;
    }
    
    debugBox.innerHTML = html;
}

// ===== TOGGLE FUNCTIONS =====
function toggleDebug() {
    const debugBox = document.getElementById('debug-info');
    if (!debugBox) {
        alert('Debug box element not found!');
        return;
    }
    
    if (debugBox.style.display === 'none' || !debugBox.style.display) {
        debugBox.style.display = 'block';
        updateDebugDisplay(); // Force update when showing
        logDebug('Debug panel shown');
    } else {
        debugBox.style.display = 'none';
        logDebug('Debug panel hidden');
    }
}

function toggleErrors() {
    const errorBox = document.getElementById('error-status');
    if (!errorBox) {
        alert('Error box element not found!');
        return;
    }
    
    if (errorBox.style.display === 'none' || !errorBox.style.display) {
        errorBox.style.display = 'block';
        updateErrorDisplay(); // Force update when showing
        logDebug('Error panel shown');
    } else {
        errorBox.style.display = 'none';
        logDebug('Error panel hidden');
    }
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
        'generateAllMethods'
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
