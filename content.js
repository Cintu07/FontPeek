// FontPeek v2.0 - Enhanced Font Detector
// Features: Copy functionality, detailed font properties

let tooltip = null;
let timeout = null;
let copyFeedback = null;

// Create tooltip element
function createTooltip() {
  if (tooltip) return tooltip;
  
  tooltip = document.createElement('div');
  tooltip.id = 'fontpeek-tooltip';
  document.body.appendChild(tooltip);
  
  // Add click event for copying
  tooltip.addEventListener('click', handleTooltipClick);
  
  return tooltip;
}

// Create copy feedback element
function createCopyFeedback() {
  if (copyFeedback) return copyFeedback;
  
  copyFeedback = document.createElement('div');
  copyFeedback.id = 'fontpeek-copy-feedback';
  copyFeedback.textContent = '✓ Copied!';
  document.body.appendChild(copyFeedback);
  
  return copyFeedback;
}

// Get comprehensive font info
function getFontInfo() {
  const selection = window.getSelection();
  
  if (!selection || !selection.toString().trim()) {
    return null;
  }
  
  const range = selection.getRangeAt(0);
  let element = range.commonAncestorContainer;
  
  // If text node, get parent element
  if (element.nodeType === 3) {
    element = element.parentElement;
  }
  
  const style = window.getComputedStyle(element);
  
  // Get font family and parse it
  const fontFamily = style.fontFamily.replace(/['"]/g, '');
  const fonts = fontFamily.split(',').map(f => f.trim());
  
  // Get color and convert to hex
  const rgbColor = style.color;
  const hexColor = rgbToHex(rgbColor);
  
  return {
    // Font family
    primary: fonts[0],
    fallback: fonts.slice(1).join(', '),
    fullFamily: fontFamily,
    
    // Font properties
    size: style.fontSize,
    weight: style.fontWeight,
    style: style.fontStyle,
    variant: style.fontVariant,
    
    // Text properties
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    wordSpacing: style.wordSpacing,
    textTransform: style.textTransform,
    textDecoration: style.textDecoration,
    
    // Color
    color: hexColor,
    colorRgb: rgbColor,
    
    // Background (if any)
    backgroundColor: style.backgroundColor,
    
    // Rendering
    textRendering: style.textRendering,
    fontSmoothing: style.webkitFontSmoothing || 'default'
  };
}

// Convert RGB to Hex
function rgbToHex(rgb) {
  const match = rgb.match(/\d+/g);
  if (!match) return rgb;
  
  const r = parseInt(match[0]).toString(16).padStart(2, '0');
  const g = parseInt(match[1]).toString(16).padStart(2, '0');
  const b = parseInt(match[2]).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`.toUpperCase();
}

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCopyFeedback();
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Show copy feedback
function showCopyFeedback() {
  const feedback = createCopyFeedback();
  feedback.classList.add('show');
  
  setTimeout(() => {
    feedback.classList.remove('show');
  }, 1500);
}

// Handle clicks on tooltip items
function handleTooltipClick(e) {
  e.stopPropagation(); // IMPORTANT: Prevents event bubbling
  
  const copyable = e.target.closest('.fp-copyable');
  if (!copyable) return;
  
  const value = copyable.getAttribute('data-value');
  if (value) {
    copyToClipboard(value);
    
    // Visual feedback on the clicked item
    copyable.classList.add('copied');
    setTimeout(() => {
      copyable.classList.remove('copied');
    }, 300);
    
    // DON'T close tooltip after copying
  }
}

// Show tooltip with all font info
function showTooltip(fontInfo) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const tip = createTooltip();
  
  // Build comprehensive HTML
  let html = `
    <div class="fp-header">
      <div class="fp-title">FontPeek</div>
      <div class="fp-subtitle">Click any property to copy • ESC to close</div>
      <button class="fp-close-btn" onclick="document.getElementById('fontpeek-tooltip').style.display='none'">✕</button>
    </div>
 
    <div class="fp-section">
      <div class="fp-section-title">FONT FAMILY</div>
      <div class="fp-copyable fp-main-font" data-value="${fontInfo.primary}">
        <span class="fp-value">${fontInfo.primary}</span>
        <span class="fp-copy-icon">📋</span>
      </div>
  `;
  
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
  
  // Font Properties Section
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
  
  // Spacing Section
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
  
  // Color Section
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
  
  // Advanced Section (collapsible)
  if (fontInfo.textTransform !== 'none' || fontInfo.textDecoration !== 'none solid rgb(0, 0, 0)') {
    html += `
      <div class="fp-section fp-advanced">
        <div class="fp-section-title">ADVANCED</div>
        <div class="fp-grid">
    `;
    
    if (fontInfo.textTransform !== 'none') {
      html += `
        <div class="fp-copyable fp-property" data-value="${fontInfo.textTransform}">
          <span class="fp-prop-label">Transform</span>
          <span class="fp-prop-value">${fontInfo.textTransform}</span>
        </div>
      `;
    }
    
    if (fontInfo.textDecoration !== 'none solid rgb(0, 0, 0)') {
      html += `
        <div class="fp-copyable fp-property" data-value="${fontInfo.textDecoration}">
          <span class="fp-prop-label">Decoration</span>
          <span class="fp-prop-value">${fontInfo.textDecoration.split(' ')[0]}</span>
        </div>
      `;
    }
    
    html += `
        </div>
      </div>
    `;
  }
  
  tip.innerHTML = html;
  
  // Position tooltip
  const x = rect.left + (rect.width / 2) + window.scrollX;
  const y = rect.top + window.scrollY - 15;
  
  tip.style.left = x + 'px';
  tip.style.top = y + 'px';
  tip.style.display = 'block';
  
  // Keep tooltip in viewport
  // Keep tooltip in viewport with better positioning
  setTimeout(() => {
    const tipRect = tip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Horizontal positioning - center on selection
    let finalX = x;
    if (tipRect.right > viewportWidth - 10) {
      // Too far right - align to right edge
      finalX = viewportWidth - tipRect.width/2 - 10 + window.scrollX;
    }
    if (tipRect.left < 10) {
      // Too far left - align to left edge
      finalX = tipRect.width/2 + 10 + window.scrollX;
    }
    tip.style.left = finalX + 'px';
    
    // Vertical positioning - always try to show above first
    if (tipRect.top < 10) {
      // Not enough space above - show below
      const belowY = rect.bottom + window.scrollY + 15;
      tip.style.top = belowY + 'px';
      tip.classList.add('below');
      
      // Check if it fits below, if not - show at top of viewport
      const belowRect = tip.getBoundingClientRect();
      if (belowRect.bottom > viewportHeight - 10) {
        tip.style.top = (window.scrollY + 10) + 'px';
        tip.style.transform = 'translateX(-50%)'; // Remove Y transform
      }
    } else {
      tip.classList.remove('below');
    }
  }, 10);
}
// Update tooltip position on scroll instead of hiding
let scrollTimeout;
document.addEventListener('scroll', () => {
  if (!tooltip || tooltip.style.display === 'none') return;
  
  clearTimeout(scrollTimeout);
  
  // Optional: Add a semi-transparent overlay while scrolling
  tooltip.style.opacity = '0.7';
  
  scrollTimeout = setTimeout(() => {
    tooltip.style.opacity = '1';
  }, 150);
}, true);

// Hide tooltip
function hideTooltip() {
  if (tooltip) {
    tooltip.style.display = 'none';
  }
}

// Handle selection
function handleSelection() {
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

// Initialize
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
    return;
  }
  
  // Only hide if clicking outside
  hideTooltip();
});

// Add close button functionality (optional but recommended)
document.addEventListener('keydown', (e) => {
  // Press Escape to close tooltip
  if (e.key === 'Escape') {
    hideTooltip();
  }
});



// Keyboard shortcut: Ctrl+Shift+F to toggle
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'F') {
    e.preventDefault();
    handleSelection();
  }
});