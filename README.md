# Injectooor

Injectooor is a minimalistic Firefox extension to inject custom JavaScript into specified URLs. This extension allows you to manage your scripts and automatically inject them when you visit the corresponding URLs.

## Features

- Inject custom JavaScript into specific URLs.
- Manage and edit scripts through a popup interface.
- Settings page to view, edit, and delete saved scripts.
- Supports dark and light themes based on your browser's theme settings.

## Installation

### Temporary Installation for Development

1. Open Firefox and navigate to `about:debugging`.
2. Click on "This Firefox" in the sidebar.
3. Click on "Load Temporary Add-on..."
4. Select the `manifest.json` file from your extension directory.

### Permanent Installation

To install the extension permanently, you need to sign it through Mozilla's Add-ons Developer Hub:

1. Create a Mozilla Developer Account at [Firefox Add-ons Developer Hub](https://addons.mozilla.org/en-US/developers/).
2. Submit your extension as an unlisted add-on.
3. Download the signed `.xpi` file once it's reviewed.
4. Open Firefox and navigate to `about:addons`.
5. Click on the gear icon and select "Install Add-on From File...".
6. Select the signed `.xpi` file to install the extension.

## Usage

### Popup Interface

1. Click on the extension icon in the toolbar to open the popup.
2. Enter your custom JavaScript for the current URL.
3. The script will be saved and automatically injected when you visit the URL.

### Settings Page

1. Open the extension settings by navigating to `about:addons` and clicking on "Options" for Injectooor.
2. Use the dropdown to select a saved script.
3. Edit or delete the script using the provided textarea and buttons.

## Development

To contribute or modify the extension:

1. Clone the repository.
2. Make your changes in the source files (`manifest.json`, `background.js`, `popup.html`, `popup.js`, `settings.html`, `settings.js`, `content.js`, `styles.css`).
3. Test your changes by loading the extension temporarily in Firefox (`about:debugging`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
