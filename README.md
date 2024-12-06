# Cookie Cleaner & Refresher

A browser extension that automatically clears cookies for specified websites and refreshes them at regular intervals. Perfect for maintaining fresh sessions or testing purposes.

## Features

- 🔄 Automatically clears cookies and refreshes specified websites every 5 minutes
- ⏸️ Pause/Resume cookie clearing for individual sites
- 🎯 Easy to add and remove monitored websites
- ⏲️ Real-time countdown timer for next refresh
- 🔒 Works with both secure (HTTPS) and regular (HTTP) websites

## Installation

### For Developers (Loading Unpacked Extension)

#### Load in Chrome/Edge/Brave

1. Open your browser
2. Go to Extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `Cookies-Refresher` folder

#### Load in Firefox

1. Open Firefox
2. Enter `about:debugging` in the URL bar
3. Click "This Firefox"
4. Click "Load Temporary Add-on"
5. Select any file in the `Cookies-Refresher` folder

## Usage

1. Click the extension icon in your browser toolbar
2. Enter a website domain (e.g., `example.com`)
3. Click "Add Site" to start monitoring
4. Use the controls to:
   - Start/Stop cookie clearing for individual sites
   - Remove sites from monitoring
   - View countdown timer for next refresh

## Important Notes

- Enter domains without `http://` or `https://` (e.g., `example.com` instead of `https://example.com`)
- The extension requires permissions to:
  - Access cookies
  - Access tabs
  - Store settings
  - Execute scripts
- All timers reset when the browser restarts

## Technical Details

- Uses Manifest V3
- Compatible with Chromium-based browsers and Firefox
- Stores settings in browser's local storage
- Automatically handles both `www` and non-`www` domains
- Refreshes all tabs matching the monitored domain

## Development

### Project Structure

- `background.js`: Handles background tasks like clearing cookies and refreshing tabs
- `popup.html`: The HTML for the extension's popup interface
- `popup.js`: The JavaScript for the extension's popup interface
- `manifest.json`: The extension's manifest file

### Building from Source

No build process required! The extension uses vanilla JavaScript and can be loaded directly as an unpacked extension.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

If you encounter any issues or have suggestions, please open an issue on GitHub.