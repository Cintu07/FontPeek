Development
===========

This extension is intentionally minimal. Use these steps to develop and debug locally.

1. Load the extension unpacked
   - Open chrome://extensions (or edge://extensions)
   - Enable "Developer mode"
   - Click "Load unpacked" and select this repository folder

2. Inspect content script
   - Open DevTools on any page and go to the "Sources" tab
   - In the left file tree find the content script under "Content scripts"
   - You can set breakpoints in `content.js` or add `debugger` statements

3. Live edit styles
   - `content.css` is injected by the content script, but you can override styles in DevTools to test changes

4. Re-loading
   - After code changes, click the reload button for the extension in chrome://extensions
   - Reload the target page to ensure content scripts reinject

5. Testing notes
   - The extension runs on all pages by default (see `manifest.json` matches)
   - Some pages (cross-origin frames, PDF viewers) may not allow content scripts

