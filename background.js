browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const url = tab.url;

    if (!url.startsWith("http") && !url.startsWith("https")) {
      return; // Ignore special pages like about:newtab
    }

    const result = await browser.storage.local.get(url);
    const script = result[url] || "";

    if (script) {
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
      } catch (e) {
        console.error(`Error injecting script into ${url}: ${e}`);
      }
    }
  }
});
