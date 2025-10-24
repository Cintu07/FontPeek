Usage
=====

- Select text on any page and a tooltip will appear with the detected font family.
- The extension reads the computed `font-family` of the selection's container element. In some cases the computed font-family may be a fallback or a generic family.

Caveats
-------

- If text is inside a canvas, image, or complex web component, the extension may not get the true font used.
- The extension detects the first font in the `font-family` stack; it may report a generic font if the primary font is not available in the environment.
- Some sites block content scripts or CSP may prevent injection.

Privacy
-------

This extension runs entirely in the browser and does not transmit data off-device. It only reads styles from the page DOM and displays them locally.

