// Function to create a canvas and draw the icon with the desired background color
function createIcon(status) {
  const icon = new Image();
  icon.src = browser.runtime.getURL("icon-base.png");
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
    browser.browserAction.setIcon({ imageData });
  };
}

// Function to inject script into a tab and change icon based on status
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
    createIcon("active");
  } catch (e) {
    console.error(`Error injecting script into ${url}: ${e}`);
    createIcon("error");
  }
}

// Handle tab updates
browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = tab.url;
    if (!url.startsWith("http") && !url.startsWith("https")) {
      return; // Ignore special pages like about:newtab
    }

    const result = await browser.storage.local.get(url);
    const script = result[url] || "";
    if (script) {
      injectScript(tabId, url, script);
    } else {
      createIcon("no-script");
    }
  }
});

// Handle browser startup
browser.runtime.onStartup.addListener(async () => {
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    const url = tab.url;
    if (!url.startsWith("http") && !url.startsWith("https")) {
      continue; // Ignore special pages like about:newtab
    }

    const result = await browser.storage.local.get(url);
    const script = result[url] || "";
    if (script) {
      injectScript(tab.id, url, script);
    } else {
      createIcon("no-script");
    }
  }
});
