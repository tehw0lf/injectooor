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
  } catch (e) {
    console.error(`Error injecting script into ${url}: ${e}`);
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
    }
  }
});
