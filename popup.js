document.addEventListener("DOMContentLoaded", async () => {
  const editorElement = document.getElementById("scriptEditor");
  const lineNumbersElement = document.getElementById("line-numbers");

  // Load the utility functions from utils.js
  const { updateIcon, injectScript } = await import("./utils.js");

  // Function to update line numbers
  const updateLineNumbers = () => {
    const lines = editorElement.value.split("\n").length;
    lineNumbersElement.innerHTML = "";
    for (let i = 1; i <= lines; i++) {
      const lineNumber = document.createElement("span");
      lineNumber.textContent = i;
      lineNumbersElement.appendChild(lineNumber);
    }
  };

  // Update line numbers on input
  editorElement.addEventListener("input", updateLineNumbers);

  // Sync scroll position between textarea and line numbers
  editorElement.addEventListener("scroll", () => {
    lineNumbersElement.scrollTop = editorElement.scrollTop;
  });

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;

  console.log("Active tab URL:", url);

  // Load the script for the current active tab
  const result = await browser.storage.local.get(url);
  const script = result[url] || "";
  editorElement.value = script;

  console.log("Loaded script from localStorage:", script);

  // Initial update of line numbers
  updateLineNumbers();

  // Initial update of the icon based on whether a script exists
  updateIcon(!!script ? "active" : "no-script");

  // Focus the textarea input
  editorElement.focus();

  // Save the script, inject it, and update the icon when the textarea loses focus
  editorElement.addEventListener("blur", async (event) => {
    const newScript = editorElement.value;

    console.log("Script on blur:", newScript);

    await browser.storage.local.set({ [url]: newScript });

    // Inject the updated script into the current page
    if (newScript) {
      injectScript(activeTab.id, url, newScript);
    } else {
      updateIcon("no-script");
    }
  });

  // Apply theme-based styling
  const applyTheme = () => {
    const isDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      editorElement.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      editorElement.classList.remove("dark-mode");
    }
  };

  // Listen for theme changes
  window.matchMedia("(prefers-color-scheme: dark)").addListener(applyTheme);
  applyTheme();
});
