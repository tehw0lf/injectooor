let scripts = {};

function updateIcon(tabId) {
  let script = scripts[tabId];
  let iconClass = "no-script";

  if (script) {
    if (script.status === "active") {
      iconClass = "active-script";
    } else if (script.status === "warning") {
      iconClass = "warning-script";
    } else if (script.status === "error") {
      iconClass = "error-script";
    }
  }

  browser.browserAction.setIcon({ path: 'icon.png', tabId: tabId });
  browser.tabs.executeScript(tabId, {
    code: `document.getElementById('extension-button').className = '${iconClass}';`
  });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateIcon(tabId);
  }
});

browser.runtime.onMessage.addListener((message, sender) => {
  if (sender.tab) {
    scripts[sender.tab.id] = message;
    updateIcon(sender.tab.id);
  }
});
