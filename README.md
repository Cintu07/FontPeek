# FontPeek — Instantly Detect Fonts on Any Website ✨

**FontPeek** is a lightweight Chrome extension that lets you instantly identify the font used in any selected text on a webpage. Just highlight the text, and a neat tooltip pops up showing the font name — no extra clicks, no clutter.

---

## ✨ Features

- 🎯 **Instant Font Detection** - Select any text to see its font family
- 📊 **Detailed Information** - View font weight, size, and fallback fonts
- 🎨 **Beautiful UI** - Modern gradient tooltip with smooth animations
- ⚡ **Lightning Fast** - Optimized performance with minimal overhead
- 🌐 **Universal Compatibility** - Works on every website
- 🔒 **Privacy First** - No data collection, everything runs locally
- 💪 **Custom Web Fonts** - Detects both system fonts and custom web fonts

---

## 🚀 Installation

### From Chrome Web Store (Recommended)

1. Visit the Chrome Web Store (Coming Soon)
2. Click "Add to Chrome"
3. Start selecting text to see fonts!

### Manual Installation (Developer Mode)

1. Download or clone this repository:

git clone https://github.com/Cintu07/FontPeek.git


2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `fontpeek` folder
6. Done! The extension is now active 🎉

---

## 🎮 How to Use

1. Visit any website (e.g., Google, Twitter, Medium)
2. Select/highlight any text with your mouse
3. See the magic! A tooltip appears showing:
- Primary font name
- Fallback fonts
- Font weight
- Font size
4. Click anywhere to dismiss the tooltip

That's it! No configuration needed.

---

## 🛠️ Technical Details

### Built With

- **Manifest V3** - Latest Chrome extension standard
- **Vanilla JavaScript** - No dependencies, pure performance
- **CSS3 Animations** - Smooth, modern UI effects
- **Web APIs** - `window.getSelection()`, `getComputedStyle()`

### File Structure

fontpeek/
├── manifest.json # Extension configuration
├── content.js # Main logic & font detection
├── content.css # Tooltip styling
├── icons/ # Extension icons
│ ├── icon16.png
│ ├── icon48.png
│ └── icon128.png
└── README.md # Documentation


### Permissions

- **activeTab** - Required to detect text selection on active tabs
- No other permissions needed!

---

## 💻 Development

### Prerequisites

- Google Chrome (version 88 or higher)
- Basic knowledge of JavaScript and Chrome Extensions

### Local Setup

Clone the repository
git clone https://github.com/Cintu07/FontPeek.git

Navigate to directory
cd fontpeek

Load in Chrome (see Installation section above)


### Making Changes

1. Edit the files in your favorite code editor
2. Go to `chrome://extensions/`
3. Click the refresh icon on the FontPeek extension card
4. Reload the webpage to test changes

### Code Structure

**content.js** - Main functionality:
- `getFontInfo()` - Extracts font information from selected text
- `showTooltip()` - Displays the tooltip with font data
- `handleSelection()` - Manages selection events with debouncing

**content.css** - Styling:
- Gradient background with purple theme
- Responsive tooltip positioning
- Smooth fade-in animations

---

## 🎨 Customization

### Change Tooltip Colors

Edit `content.css`:

#font-detector-tooltip {
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}


Try these color combos:
- 🔴 Red/Pink: `#ff6b6b`, `#ee5a6f`
- 🔵 Blue/Teal: `#4ecdc4`, `#44a08d`
- 🟢 Green/Lime: `#56ab2f`, `#a8e063`
- 🟡 Orange/Yellow: `#f2994a`, `#f2c94c`

### Adjust Tooltip Size

In `content.css`, modify:

.fd-name {
font-size: 16px; /* Change font size */
}


---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contribution

- [ ] Add keyboard shortcut support
- [ ] Copy font name to clipboard
- [ ] Font history/favorites feature
- [ ] Dark mode option
- [ ] Multiple language support
- [ ] Export font list from a page

---

## 🐛 Bug Reports & Issues

Found a bug? Please open an issue on [GitHub Issues](https://github.com/Cintu07/FontPeek/issues).

When reporting bugs, include:
- Chrome version
- Operating system
- Website where the issue occurred
- Steps to reproduce
- Screenshot (if applicable)

---

## 📝 Changelog

### Version 1.0.0 (2025-10-24)

- 🎉 Initial release
- ✨ Font detection for selected text
- 🎨 Beautiful gradient tooltip
- 📊 Display font family, weight, size, and fallbacks
- ⚡ Optimized performance with debouncing
- 🌐 Universal website compatibility

---

## 🌟 Acknowledgments

- Inspired by the need for quick font identification while browsing
- Built with ❤️ for the design and developer community
- Thanks to all contributors and users!

---

## 📬 Contact

- **GitHub**: [@Cintu07](https://github.com/Cintu07)
- **Email**: pawankalyan1892@gmail.com
- **Twitter**: @pawankalyandev

---

## 🎯 Roadmap

- [ ] Firefox extension version
- [ ] Edge extension version
- [ ] Font comparison feature
- [ ] Export functionality
- [ ] Font pairing suggestions
- [ ] Integration with Google Fonts
- [ ] Advanced filtering options

---

## 📜 License

This project is licensed under the **MIT License** — free to use and modify.

---

<div align="center">

⭐ **Star this repo if you find it helpful!**

Made with 💜 by **Pawan Kalyan (aka Cintu)**

[Report Bug](https://github.com/Cintu07/FontPeek/issues) · [Request Feature](https://github.com/Cintu07/FontPeek/issues) · [Documentation](https://github.com/Cintu07/FontPeek)

</div>
