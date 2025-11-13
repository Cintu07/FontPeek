# 🎨 FontPeek — Instantly Detect Fonts on Any Website (V3.0)

FontPeek is a lightweight Chrome extension that reveals the font behind any selected text — now powered by a fully upgraded tooltip engine, a redesigned popup, dark mode, history tracking, and smarter internals.

V3 is the biggest glow-up yet. Faster. Cleaner. Actually useful.

---

## 🚀 What’s New in V3.0

### ⚡ Completely Upgraded Tooltip
- Quick-action buttons:
  - 📝 Copy font  
  - 💻 Copy full CSS  
  - 🎨 Copy color  
  - 🅶 Open Google Fonts  
- Google Fonts detection + badge  
- Richer property breakdown  
- Polished visuals + smoother animations  
- Smarter positioning (stays visible even in tight spaces)  
- Tooltip stays open while copying  
- Doesn’t disappear on scroll  

---

## 🌙 Full Dark Mode Support
- Toggle inside popup  
- Saves preference via sync storage  
- Tooltip theme updates instantly  
- UI adapts automatically  

---

## 🕘 Font History Tracking
- Stores recently inspected fonts (deduped)  
- Listed in the popup  
- One-click copy  
- “Clear History” button  
- Synced through the service worker  

---

## 🎛 Popup Redesign (New UI)
- Gradient, modern visual style  
- Tabs: **Settings** + **History**  
- Version badge  
- Clean footer links  
- Fully responsive layout  
- Smoother interactions  

---

## 🛠 Background Service Worker (New)
- Runs install-time initialization  
- Manages history + theme storage  
- Cleans old data  
- Handles events like `clearHistory`  
- Keeps popup lightweight and fast  

---

## 🧩 Manifest + Asset Upgrades
- Proper MV3 service worker registration  
- New popup HTML/CSS/JS architecture  
- Updated permissions  
- Improved tooltip stylesheet  
- Cleaner folder structure  

---

## 🎮 How to Use

### ⚡ Tooltip (Select Any Text)
- Select any text  
- Tooltip appears with:  
  - Font name  
  - Color  
  - CSS details  
  - Quick-action buttons  

### 🎛 Popup (Click Extension Icon)
- Toggle dark mode  
- View font history  
- One-click copy  
- Clear history  

### ⌨️ Shortcuts
- `Ctrl + Shift + F` — Force refresh tooltip  
- `ESC` — Close tooltip  

---

## 📥 Manual Installation
(Chrome Web Store version coming later)

1. Download this repository  
2. Go to `chrome://extensions/`  
3. Enable **Developer Mode**  
4. Click **Load Unpacked**  
5. Select the project folder  

Done. 🎉

---

## 🤝 Contribute

PRs are welcome.  
If you wanna improve performance, UI, or detection — jump in.

---

## 🐛 Issues
Found a bug? Open an issue with:
- Chrome version  
- OS  
- Website tested  
- Steps to reproduce  
- Screenshot  

---

## 📜 Project History (Short & Clean)

### **V1 (2025-10-24)**
- Basic font detector  
- Gradient tooltip  
- Font family, weight, size, fallbacks  
- Vanilla JS + simple UI  

### **V2**
- Minor UI polish  
- Smoother animations  
- Better stability  

### **V3 (Current Version)**  
Massive rebuild with:
- Quick-actions  
- Dark mode  
- History  
- Popup redesign  
- Service worker  
- Upgraded manifest  
- Smarter tooltip behavior  

---

## ⭐ Show Support
If FontPeek helped you, star the repo!  
It keeps the project alive 💜

---

Made with ❤️ by **Pawan Kalyan (Cintu)**  
