// FontPeek v3.0 - Enhanced Font Detector
// NEW: History tracking, Quick actions, Google Fonts detection, Dark mode

let tooltip = null;
let timeout = null;
let copyFeedback = null;
let currentFontInfo = null;
let isDarkMode = false;

const hasChrome = typeof chrome !== 'undefined';
const hasStorage = hasChrome && chrome.storage;
const hasStorageSync = hasStorage && chrome.storage.sync;
const hasStorageLocal = hasStorage && chrome.storage.local;
const hasStorageChangeApi = hasStorage && chrome.storage.onChanged && typeof chrome.storage.onChanged.addListener === 'function';
const hasRuntime = hasChrome && chrome.runtime && typeof chrome.runtime.onMessage?.addListener === 'function';

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
    console.warn('FontPeek:', message);
  }
}

function safeStorageSyncGet(keys, callback) {
  if (!hasStorageSync) {
    callback({});
    return;
  }
  try {
    chrome.storage.sync.get(keys, (result) => {
      const lastErr = hasChrome && chrome.runtime ? chrome.runtime.lastError : null;
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
      const lastErr = hasChrome && chrome.runtime ? chrome.runtime.lastError : null;
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

function safeStorageLocalSet(data, onComplete) {
  if (!hasStorageLocal) {
    if (onComplete) onComplete(false);
    return;
  }
  try {
    chrome.storage.local.set(data, () => {
      const lastErr = hasChrome && chrome.runtime ? chrome.runtime.lastError : null;
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

// Google Fonts list (top popular ones)
const GOOGLE_FONTS = [
  'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Source Sans Pro',
  'Raleway', 'PT Sans', 'Merriweather', 'Ubuntu', 'Playfair Display',
  'Poppins', 'Noto Sans', 'Mukta', 'Rubik', 'Work Sans', 'Inter',
  'Nunito', 'Crimson Text', 'Libre Baskerville'
];

// Initialize settings - FIXED VERSION
(function loadDarkModeSetting() {
  if (!hasStorageSync) {
    isDarkMode = false;
    return;
  }
  safeStorageSyncGet(['darkMode'], (result) => {
    isDarkMode = result && typeof result.darkMode === 'boolean' ? result.darkMode : false;
  });
})();

if (hasStorageChangeApi) {
  try {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.darkMode) {
        isDarkMode = changes.darkMode.newValue;
        if (tooltip) {
          updateTooltipTheme();
        }
      }
    });
  } catch (err) {
    handleExtensionError(err);
  }
}

// Create tooltip
function createTooltip() {
  if (tooltip) return tooltip;
  
  tooltip = document.createElement('div');
  tooltip.id = 'fontpeek-tooltip';
  tooltip.classList.add(isDarkMode ? 'fp-dark' : 'fp-light');
  document.body.appendChild(tooltip);
  
  return tooltip;
}

// Update theme
function updateTooltipTheme() {
  if (!tooltip) return;
  tooltip.classList.remove('fp-dark', 'fp-light');
  tooltip.classList.add(isDarkMode ? 'fp-dark' : 'fp-light');
}

// Create copy feedback
function createCopyFeedback() {
  if (copyFeedback) return copyFeedback;
  
  copyFeedback = document.createElement('div');
  copyFeedback.id = 'fontpeek-copy-feedback';
  document.body.appendChild(copyFeedback);
  
  return copyFeedback;
}

// Check if Google Font
function isGoogleFont(fontName) {
  return GOOGLE_FONTS.some(gFont => 
    fontName.toLowerCase().includes(gFont.toLowerCase())
  );
}

// Get Google Fonts URL
function getGoogleFontsUrl(fontName) {
  if (!fontName || typeof fontName !== 'string') {
    return null;
  }
  const cleanName = fontName.split(',')[0].trim();
  return `https://fonts.google.com/specimen/${cleanName.replace(/\s+/g, '+')}`;
}

// Get font info
function getFontInfo() {
  const selection = window.getSelection();
  
  if (!selection || !selection.toString().trim()) {
    return null;
  }
  
  const range = selection.getRangeAt(0);
  let element = range.commonAncestorContainer;
  
  if (element.nodeType === 3) {
    element = element.parentElement;
  }
  
  const style = window.getComputedStyle(element);
  
  const fontFamily = style.fontFamily.replace(/['"]/g, '');
  const fonts = fontFamily.split(',').map(f => f.trim());
  const primaryFont = fonts[0];
  
  const rgbColor = style.color;
  const hexColor = rgbToHex(rgbColor);
  
  const isGoogle = isGoogleFont(primaryFont);
  
  return {
    primary: primaryFont,
    fallback: fonts.slice(1).join(', '),
    fullFamily: fontFamily,
    
    size: style.fontSize,
    weight: style.fontWeight,
    style: style.fontStyle,
    
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    wordSpacing: style.wordSpacing,
    
    color: hexColor,
    colorRgb: rgbColor,
    
    textTransform: style.textTransform,
    textDecoration: style.textDecoration,
    
    isGoogleFont: isGoogle,
  googleFontsUrl: isGoogle ? getGoogleFontsUrl(primaryFont) : null,
    
    timestamp: Date.now(),
    url: window.location.hostname
  };
}

function rgbToHex(rgb) {
  // Handle rgba values
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  
  if (!match) {
    // If already hex or other format, return as is
    if (rgb.startsWith('#')) return rgb.toUpperCase();
    return rgb;
  }
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  // Convert to hex with proper padding
  const toHex = (num) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Generate CSS
function generateCSS(fontInfo) {
  let css = `font-family: ${fontInfo.fullFamily};\n`;
  css += `font-size: ${fontInfo.size};\n`;
  css += `font-weight: ${fontInfo.weight};\n`;
  css += `font-style: ${fontInfo.style};\n`;
  css += `line-height: ${fontInfo.lineHeight};\n`;
  css += `letter-spacing: ${fontInfo.letterSpacing};\n`;
  css += `color: ${fontInfo.color};`;
  
  if (fontInfo.textTransform !== 'none') {
    css += `\ntext-transform: ${fontInfo.textTransform};`;
  }
  
  return css;
}

// Save to history
function saveToHistory(fontInfo) {
  if (!hasStorageLocal) {
    return;
  }
  safeStorageLocalGet(['fontHistory'], (result) => {
    let history = result.fontHistory || [];
    
    const isDuplicate = history.some(item => 
      item.primary === fontInfo.primary && 
      item.url === fontInfo.url &&
      Date.now() - item.timestamp < 60000
    );
    
    if (!isDuplicate) {
      history.unshift(fontInfo);
      history = history.slice(0, 50);
      safeStorageLocalSet({ fontHistory: history });
    }
  });
}

// Copy to clipboard
function copyToClipboard(text, message = '✓ Copied!') {
  navigator.clipboard.writeText(text).then(() => {
    showCopyFeedback(message);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Show copy feedback
function showCopyFeedback(message = '✓ Copied!') {
  const feedback = createCopyFeedback();
  feedback.textContent = message;
  feedback.classList.add('show');
  
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 1500);
}

let repositionScheduled = false;

function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) {
    return null;
  }
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) {
    return null;
  }
  return rect;
}

function applyTooltipPosition(rect) {
  if (!tooltip || !rect) {
    return;
  }

  const padding = 12;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  let left = rect.left + scrollX + (rect.width / 2) - (tooltipWidth / 2);
  left = Math.max(scrollX + padding, Math.min(left, scrollX + viewportWidth - tooltipWidth - padding));

  const topAbove = rect.top + scrollY - tooltipHeight - padding;
  const topBelow = rect.bottom + scrollY + padding;
  const canShowAbove = topAbove >= scrollY + padding;
  const canShowBelow = topBelow + tooltipHeight <= scrollY + viewportHeight - padding;

  let top;
  let useBelow = false;

  if (canShowAbove) {
    top = topAbove;
  } else if (canShowBelow) {
    top = topBelow;
    useBelow = true;
  } else {
    const minTop = scrollY + padding;
    const maxTop = scrollY + viewportHeight - tooltipHeight - padding;
    const centeredTop = rect.top + scrollY + (rect.height / 2) - (tooltipHeight / 2);
    top = Math.min(Math.max(centeredTop, minTop), maxTop);
  }

  const minTop = scrollY + padding;
  const maxTop = scrollY + viewportHeight - tooltipHeight - padding;
  if (top < minTop) {
    top = minTop;
  }
  if (top > maxTop) {
    top = maxTop;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
  tooltip.classList.toggle('below', useBelow);
}

function scheduleTooltipReposition() {
  if (!tooltip || tooltip.style.display === 'none' || isClosing) {
    return;
  }
  if (repositionScheduled) {
    return;
  }
  repositionScheduled = true;
  requestAnimationFrame(() => {
    repositionScheduled = false;
    const rect = getSelectionRect();
    if (rect) {
      applyTooltipPosition(rect);
    }
  });
}

if (hasRuntime) {
  chrome.runtime.onMessage.addListener((message) => {
    if (!message) {
      return;
    }
    if (message.type === 'FONTPEEK_SET_DARK_MODE') {
      isDarkMode = !!message.value;
      updateTooltipTheme();
    }
  });
}

// Handle tooltip clicks - FIXED VERSION!
function handleTooltipClick(e) {
  e.stopPropagation();
  e.preventDefault(); // ADD THIS!
  
  // Handle close button - IMPROVED
  const closeBtn = e.target.closest('.fp-close-btn');
  if (closeBtn) {
    hideTooltip();
    // Clear selection to prevent re-triggering
    window.getSelection().removeAllRanges();
    return;
  }
  
  
  // Handle copyable items
  const copyable = e.target.closest('.fp-copyable');
  if (copyable) {
    const value = copyable.getAttribute('data-value');
    if (value) {
      copyToClipboard(value);
      
      copyable.classList.add('copied');
      setTimeout(() => {
        copyable.classList.remove('copied');
      }, 300);
    }
    return;
  }
  
  // Handle quick actions
  const action = e.target.closest('[data-action]');
  if (action && currentFontInfo) {
    const actionType = action.getAttribute('data-action');
    
    switch(actionType) {
      case 'copy-font':
        copyToClipboard(currentFontInfo.primary, '✓ Font name copied!');
        break;
      case 'copy-css':
        copyToClipboard(generateCSS(currentFontInfo), '✓ CSS copied!');
        break;
      case 'copy-color':
        copyToClipboard(currentFontInfo.color, '✓ Color copied!');
        break;
      case 'google-fonts':
        if (currentFontInfo.googleFontsUrl) {
          window.open(currentFontInfo.googleFontsUrl, '_blank');
        }
        break;
    }
    return;
  }
}

// Show tooltip
function showTooltip(fontInfo) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  currentFontInfo = fontInfo;
  saveToHistory(fontInfo);
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) {
    hideTooltip();
    return;
  }
  
  const tip = createTooltip();
  updateTooltipTheme();
  
  // Build HTML
  let html = `
    <div class="fp-header">
      <div class="fp-title-row">
        <div class="fp-title">FontPeek v3.0</div>
        <button class="fp-close-btn">✕</button>
      </div>
    </div>
    
    <div class="fp-quick-actions">
      <button class="fp-action-btn" data-action="copy-font" title="Copy font name">
        <span class="fp-btn-icon">📝</span>
        <span class="fp-btn-text">Font</span>
      </button>
      <button class="fp-action-btn" data-action="copy-css" title="Copy CSS">
        <span class="fp-btn-icon">💻</span>
        <span class="fp-btn-text">CSS</span>
      </button>
      <button class="fp-action-btn" data-action="copy-color" title="Copy color">
        <span class="fp-btn-icon">🎨</span>
        <span class="fp-btn-text">Color</span>
      </button>
  `;
  
  if (fontInfo.isGoogleFont) {
    html += `
      <button class="fp-action-btn fp-google-btn" data-action="google-fonts" title="View on Google Fonts">
        <span class="fp-btn-icon">G</span>
        <span class="fp-btn-text">Google</span>
      </button>
    `;
  }
  
  html += `</div>`;
  
  // Font Family
  html += `
    <div class="fp-section">
      <div class="fp-section-title">FONT FAMILY</div>
      <div class="fp-copyable fp-main-font" data-value="${fontInfo.primary}">
        <span class="fp-value">${fontInfo.primary}</span>
        <span class="fp-copy-icon">📋</span>
      </div>
  `;
  
  if (fontInfo.isGoogleFont) {
    html += `<div class="fp-badge fp-google-badge">Google Fonts</div>`;
  }
  
  if (fontInfo.fallback) {
    html += `
      <div class="fp-copyable fp-fallback" data-value="${fontInfo.fullFamily}">
        <span class="fp-label">Full Stack:</span>
        <span class="fp-value-small">${fontInfo.fullFamily}</span>
        <span class="fp-copy-icon">📋</span>
      </div>
    `;
  }
  
  html += `</div>`;
  
  // Properties
  html += `
    <div class="fp-section">
      <div class="fp-section-title">PROPERTIES</div>
      <div class="fp-grid">
        <div class="fp-copyable fp-property" data-value="${fontInfo.size}">
          <span class="fp-prop-label">Size</span>
          <span class="fp-prop-value">${fontInfo.size}</span>
        </div>
        <div class="fp-copyable fp-property" data-value="${fontInfo.weight}">
          <span class="fp-prop-label">Weight</span>
          <span class="fp-prop-value">${fontInfo.weight}</span>
        </div>
        <div class="fp-copyable fp-property" data-value="${fontInfo.style}">
          <span class="fp-prop-label">Style</span>
          <span class="fp-prop-value">${fontInfo.style}</span>
        </div>
        <div class="fp-copyable fp-property" data-value="${fontInfo.lineHeight}">
          <span class="fp-prop-label">Line Height</span>
          <span class="fp-prop-value">${fontInfo.lineHeight}</span>
        </div>
      </div>
    </div>
  `;
  
  // Spacing
  html += `
    <div class="fp-section">
      <div class="fp-section-title">SPACING</div>
      <div class="fp-grid">
        <div class="fp-copyable fp-property" data-value="${fontInfo.letterSpacing}">
          <span class="fp-prop-label">Letter</span>
          <span class="fp-prop-value">${fontInfo.letterSpacing}</span>
        </div>
        <div class="fp-copyable fp-property" data-value="${fontInfo.wordSpacing}">
          <span class="fp-prop-label">Word</span>
          <span class="fp-prop-value">${fontInfo.wordSpacing}</span>
        </div>
      </div>
    </div>
  `;
  
  // Color
  html += `
    <div class="fp-section">
      <div class="fp-section-title">COLOR</div>
      <div class="fp-copyable fp-color-box" data-value="${fontInfo.color}">
        <div class="fp-color-preview" style="background-color: ${fontInfo.color};"></div>
        <div class="fp-color-info">
          <span class="fp-color-hex">${fontInfo.color}</span>
          <span class="fp-color-rgb">${fontInfo.colorRgb}</span>
        </div>
        <span class="fp-copy-icon">📋</span>
      </div>
    </div>
  `;
  
  tip.innerHTML = html;
  
  // Add click listener - IMPORTANT!
  tip.removeEventListener('click', handleTooltipClick);
  tip.addEventListener('click', handleTooltipClick);
  
  repositionScheduled = false;
  tip.classList.remove('below');
  tip.classList.remove('is-visible');
  tip.style.visibility = 'hidden';
  tip.style.display = 'block';

  requestAnimationFrame(() => {
    const activeRect = getSelectionRect() || rect;
    if (!activeRect) {
      hideTooltip();
      return;
    }
    applyTooltipPosition(activeRect);
    tip.style.visibility = 'visible';
    tip.classList.add('is-visible');
  });
}

let isClosing = false;

// Modified hideTooltip
function hideTooltip() {
  if (tooltip && tooltip.style.display !== 'none') {
    isClosing = true;
    tooltip.classList.remove('is-visible');
    tooltip.style.visibility = 'hidden';
    tooltip.removeEventListener('click', handleTooltipClick);
    setTimeout(() => {
      if (tooltip && !tooltip.classList.contains('is-visible')) {
        tooltip.style.display = 'none';
        tooltip.classList.remove('below');
      }
      isClosing = false;
    }, 200);
  } else {
    isClosing = false;
  }
  repositionScheduled = false;
  currentFontInfo = null;
}

// Modified handleSelection
function handleSelection() {
  if (isClosing) return; // Don't process if we just closed
  
  clearTimeout(timeout);
  
  timeout = setTimeout(() => {
    const fontInfo = getFontInfo();
    
    if (fontInfo) {
      showTooltip(fontInfo);
    } else {
      hideTooltip();
    }
  }, 100);
}

document.addEventListener('mouseup', handleSelection);
document.addEventListener('keyup', handleSelection);

document.addEventListener('mousedown', (e) => {
  // Don't hide if clicking inside tooltip
  if (tooltip && tooltip.contains(e.target)) {
    return;
  }
  
  // Don't hide if clicking on selected text
  const selection = window.getSelection();
  if (selection && selection.toString().trim() !== '') {
    // But hide if clicking on already selected text (to allow deselection)
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width === 0) {
      hideTooltip();
    }
    return;
  }
  
  hideTooltip();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hideTooltip();
  }
  
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    handleSelection();
  }
});

document.addEventListener('scroll', scheduleTooltipReposition, true);
window.addEventListener('resize', scheduleTooltipReposition);