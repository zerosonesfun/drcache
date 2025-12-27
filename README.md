# Site Memory Helper - Bookmarklet

![Site Memory Helper](drcache.png)

A powerful browser bookmarklet that detects and helps you clear various types of browser storage (cookies, cache, localStorage, sessionStorage, service workers, and IndexedDB) for the current website.

🌐 **[Try it now on GitHub Pages →](https://zerosonesfun.github.io/drcache/)**

The GitHub Pages site includes drag-to-bookmark functionality and detailed installation instructions for all browsers.

## Features

- 🔍 **Detects All Storage Types**: Automatically detects and counts:
  - localStorage items
  - sessionStorage items
  - Cache Storage entries
  - Service Workers
  - IndexedDB databases
  - Cookies

- ✅ **Individual Clearing**: Select which storage types to clear with checkboxes
- 📊 **Dynamic Updates**: Real-time count updates after clearing
- 📝 **Clear Feedback**: Shows exactly what was cleared
- 🌐 **Cross-Browser Support**: Works in Chrome, Firefox, Safari, Edge, and other modern browsers
- 📖 **Browser-Specific Instructions**: Provides detailed step-by-step instructions for manually clearing site data in your specific browser
- 🔒 **Privacy First**: Runs entirely locally - no tracking, no network requests

## Installation

**👉 [Visit the GitHub Pages site](https://zerosonesfun.github.io/drcache/) for the easiest installation with drag-to-bookmark functionality!**

Or manually:

1. Copy the entire contents of `minified.js`
2. Create a new bookmark in your browser
3. Edit the bookmark and paste the code as the URL (it should start with `javascript:`)
4. Name it something like "Site Memory Helper" or "Clear Site Data"

### Quick Setup

**Chrome/Edge/Brave:**
1. Right-click your bookmarks bar
2. Select "Add page" or "Add bookmark"
3. Name: `Site Memory Helper`
4. URL: Paste the entire contents of `minified.js`

**Firefox:**
1. Right-click your bookmarks toolbar
2. Select "New Bookmark"
3. Name: `Site Memory Helper`
4. Location: Paste the entire contents of `minified.js`

**Safari:**
1. Bookmarks → Add Bookmark
2. Name: `Site Memory Helper`
3. Address: Paste the entire contents of `minified.js`

## Usage

1. Navigate to any website
2. Click the "Site Memory Helper" bookmarklet
3. Review the detected storage counts
4. Select which storage types you want to clear (checkboxes)
5. Click "Clear selected"
6. Review the results and updated counts

## What It Clears

- **localStorage**: Small saved values used by the site
- **sessionStorage**: Temporary tab memory
- **Cache Storage**: Stored network responses
- **Service Workers**: Background logic that can keep old behavior
- **Cookies**: Only cookies that browsers allow scripts to remove (some may remain for security)

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Brave
- ✅ Opera
- ✅ Other Chromium-based browsers

## Files

- `bookmarklet.js` - Full, commented source code for developers
- `minified.js` - Minified version ready for bookmarklet use
- `drcache.png` - Project logo/image

## How It Works

The bookmarklet:
1. Detects all available storage types on the current page
2. Displays counts in a user-friendly overlay
3. Allows selective clearing via checkboxes
4. Provides browser-specific instructions for manual clearing
5. Updates counts dynamically after clearing operations

## Limitations

- Some cookies may remain due to browser security restrictions (HttpOnly, Secure, SameSite attributes)
- The bookmarklet can only clear what browsers allow scripts to access
- For complete clearing, use the browser-specific instructions provided in the tool
- **LinkedIn and other strict CSP sites**: Some websites (like LinkedIn) have strict Content Security Policies that may prevent the bookmarklet from loading. The bookmarklet includes fallback methods, but if it doesn't work, use your browser's developer tools directly.

## Privacy & Security

- **100% Local**: All code runs in your browser
- **No Tracking**: No analytics, no external requests
- **No Data Collection**: Nothing is sent anywhere
- **Open Source**: Review the code yourself

## Development

The full source code is available in `bookmarklet.js` with comprehensive comments explaining:
- Storage detection methods
- Cookie clearing logic
- UI construction
- Event handling
- Error handling

## License

This project is open source and available for use.

## Contributing

Contributions, issues, and feature requests are welcome!

## Support

If you encounter any issues or have questions, please open an issue on [GitHub](https://github.com/zerosonesfun/drcache).

## Links

- 🌐 **[GitHub Pages Site](https://zerosonesfun.github.io/drcache/)** - Interactive installation page with drag-to-bookmark
- 📦 **[Repository](https://github.com/zerosonesfun/drcache)** - Source code and documentation

---

**Note**: This tool helps clear site data, but browsers protect certain cookies and cache for security. For complete clearing, follow the browser-specific instructions provided in the tool.

