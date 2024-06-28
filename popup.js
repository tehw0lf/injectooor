document.addEventListener("DOMContentLoaded", async () => {
  const editorElement = document.getElementById("editor");

  // Create a simple textarea for the editor
  const textarea = document.createElement("textarea");
  textarea.id = "scriptEditor";
  textarea.style.width = "100%";
  textarea.style.height = "600px"; // Adjusted for the new height
  editorElement.appendChild(textarea);

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;

  // Load the script for the current active tab
  const result = await browser.storage.local.get(url);
  const script = result[url] || "";
  textarea.value = script;

  // Save the script and inject it when the textarea loses focus
  textarea.addEventListener("blur", async () => {
    const newScript = textarea.value;
    await browser.storage.local.set({ [url]: newScript });

    // Inject the updated script into the current page
    await browser.tabs.executeScript(activeTab.id, {
      code: `(() => {
        const existingScript = document.getElementById('injectedScript');
        if (existingScript) existingScript.remove();

        const scriptElement = document.createElement('script');
        scriptElement.id = 'injectedScript';
        scriptElement.textContent = ${JSON.stringify(newScript)};
        document.body.appendChild(scriptElement);
      })();`,
    });
  });

  // Apply theme-based styling
  const applyTheme = () => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      textarea.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      textarea.classList.remove("dark-mode");
    }
  };

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addListener(applyTheme);
  applyTheme();
});
