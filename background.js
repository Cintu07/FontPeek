// FontPeek v3.0 Background Service Worker
// Handles storage and settings

chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings
  chrome.storage.sync.get(['darkMode'], (result) => {
    if (result.darkMode === undefined) {
      chrome.storage.sync.set({ darkMode: false });
    }
  });
  
  console.log('FontPeek v3.0 installed!');
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'clearHistory') {
    chrome.storage.local.set({ fontHistory: [] }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});