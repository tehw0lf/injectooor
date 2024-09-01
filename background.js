import { injectScript, updateIcon } from "./utils.js";

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
      updateIcon("no-script");
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
      updateIcon("no-script");
    }
  }
});
