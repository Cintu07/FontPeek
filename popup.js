// FontPeek v3.0 Popup Script
// Handles settings and history display

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadHistory();
  setupEventListeners();
});

const hasChrome = typeof chrome !== 'undefined';
const hasStorage = hasChrome && chrome.storage;
const hasStorageSync = hasStorage && chrome.storage.sync;
const hasStorageLocal = hasStorage && chrome.storage.local;
const hasRuntime = hasChrome && chrome.runtime && typeof chrome.runtime.sendMessage === 'function';

function handleExtensionError(err) {
  if (!err) return;
  const message = typeof err === 'string' ? err : err.message || err.toString();
  if (!message) {
    return;
  }
  if (message.includes('message port closed before a response was received')) {
    return;
  }
  if (typeof console !== 'undefined' && console.warn) {
    console.warn('FontPeek Popup:', message);
  }
}

function safeStorageSyncGet(keys, callback) {
  if (!hasStorageSync) {
    callback({});
    return;
  }
  try {
    chrome.storage.sync.get(keys, (result) => {
      const lastErr = chrome.runtime ? chrome.runtime.lastError : null;
      if (lastErr) {
        handleExtensionError(lastErr);
        callback({});
        return;
      }
      callback(result || {});
    });
  } catch (err) {
    handleExtensionError(err);
    callback({});
  }
}

function safeStorageLocalGet(keys, callback) {
  if (!hasStorageLocal) {
    callback({});
    return;
  }
  try {
    chrome.storage.local.get(keys, (result) => {
      const lastErr = chrome.runtime ? chrome.runtime.lastError : null;
      if (lastErr) {
        handleExtensionError(lastErr);
        callback({});
        return;
      }
      callback(result || {});
    });
  } catch (err) {
    handleExtensionError(err);
    callback({});
  }
}

function safeStorageSyncSet(data, onComplete) {
  if (!hasStorageSync) {
    if (onComplete) onComplete(false);
    return;
  }
  try {
    chrome.storage.sync.set(data, () => {
      const lastErr = chrome.runtime ? chrome.runtime.lastError : null;
      if (lastErr) {
        handleExtensionError(lastErr);
        if (onComplete) onComplete(false);
        return;
      }
      if (onComplete) onComplete(true);
    });
  } catch (err) {
    handleExtensionError(err);
    if (onComplete) onComplete(false);
  }
}

function safeRuntimeSendMessage(message, callback) {
  if (!hasRuntime) {
    if (callback) callback(undefined);
    return;
  }
  try {
    chrome.runtime.sendMessage(message, (response) => {
      const lastErr = chrome.runtime && chrome.runtime.lastError;
      if (lastErr) {
        handleExtensionError(lastErr);
        if (callback) callback(undefined);
        return;
      }
      if (callback) callback(response);
    });
  } catch (err) {
    handleExtensionError(err);
    if (callback) callback(undefined);
  }
}

// Load settings
function loadSettings() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (!hasStorageSync) {
    if (darkModeToggle) {
      darkModeToggle.checked = false;
      darkModeToggle.disabled = true;
      darkModeToggle.title = 'Dark mode unavailable (extension context inactive).';
    }
    return;
  }
  safeStorageSyncGet(['darkMode'], (result) => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) {
      return;
    }
    darkModeToggle.checked = result && typeof result.darkMode === 'boolean' ? result.darkMode : false;
  });
}

// Load font history
function loadHistory() {
  const historyList = document.getElementById('historyList');
  if (!historyList) {
    return;
  }
  if (!hasStorageLocal) {
    historyList.innerHTML = '<p class="empty-state">History unavailable right now. Reload the extension.</p>';
    return;
  }
  safeStorageLocalGet(['fontHistory'], (result) => {
    const history = result.fontHistory || [];
    
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-state">No fonts checked yet</p>';
      return;
    }
    
    historyList.innerHTML = '';
    
    // Show last 10 items
    history.slice(0, 10).forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.innerHTML = `
        <div class="history-font-name">${item.primary}</div>
        <div class="history-details">
          ${item.url} • ${item.weight} • ${item.size}
        </div>
      `;
      
      // Copy font name on click
      historyItem.addEventListener('click', () => {
        navigator.clipboard.writeText(item.primary);
        historyItem.style.background = 'rgba(76, 217, 100, 0.3)';
        setTimeout(() => {
          historyItem.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 300);
      });
      
      historyList.appendChild(historyItem);
    });
  });
}

// Setup event listeners
function setupEventListeners() {
  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', (e) => {
      const isDark = e.target.checked;
      if (!hasStorageSync) {
        return;
      }
      safeStorageSyncSet({ darkMode: isDark }, (success) => {
        if (!success) {
          return;
        }
        if (hasRuntime) {
          safeRuntimeSendMessage({ type: 'FONTPEEK_SET_DARK_MODE', value: isDark });
        }
      });
    });
  }
  
  // Clear history button
  const clearHistoryBtn = document.getElementById('clearHistory');
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
      if (!hasRuntime || !hasStorageLocal) {
        return;
      }
      if (confirm('Clear all font history?')) {
        safeRuntimeSendMessage({ action: 'clearHistory' }, (response) => {
          if (response && response.success) {
            loadHistory();
          }
        });
      }
    });
  }
}
