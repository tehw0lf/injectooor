// Function to create a dynamically colored icon
function createColoredIcon(status, baseIconPath = "icon-19.png") {
  return new Promise((resolve) => {
    const icon = new Image();
    icon.src = browser.runtime.getURL(baseIconPath);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 19;
    canvas.height = 19;

    let backgroundColor;
    switch (status) {
      case "active":
        backgroundColor = "green";
        break;
      case "error":
        backgroundColor = "red";
        break;
      default:
        backgroundColor = "grey";
        break;
    }

    icon.onload = () => {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(icon, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
  });
}

// Function to update the extension's icon with dynamic coloring
async function updateIcon(status) {
  const imageData = await createColoredIcon(status);
  browser.browserAction.setIcon({ imageData });
}

// Function to inject script into a tab
async function injectScript(tabId, url, script) {
  try {
    await browser.tabs.executeScript(tabId, {
      code: `(() => {
        const existingScript = document.getElementById('injectedScript');
        if (existingScript) existingScript.remove();

        const scriptElement = document.createElement('script');
        scriptElement.id = 'injectedScript';
        scriptElement.textContent = ${JSON.stringify(script)};
        document.body.appendChild(scriptElement);
      })();`,
    });
    console.log(`Injected script into ${url}`);
    updateIcon("active");
  } catch (e) {
    console.error(`Error injecting script into ${url}: ${e}`);
    updateIcon("error");
  }
}

// Export the functions
export { updateIcon, injectScript };
