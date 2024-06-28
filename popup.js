document.addEventListener("DOMContentLoaded", async () => {
  const editorElement = document.getElementById("scriptEditor");
  const lineNumbersElement = document.getElementById("line-numbers");

  console.log("Popup script loaded");

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

  // Function to validate script using Web Worker
  const validateScript = (script) => {
    return new Promise((resolve) => {
      console.log("Starting Web Worker for validation");
      const worker = new Worker("validator.js");
      worker.onmessage = (event) => {
        console.log("Web Worker validation result:", event.data);
        resolve(event.data);
      };
      worker.onerror = (error) => {
        console.error("Web Worker error:", error);
        resolve({ valid: false, error: error.message });
      };
      worker.postMessage(script);
    });
  };

  // Update line numbers on input
  editorElement.addEventListener("input", updateLineNumbers);

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;

  console.log("Active tab URL:", url);

  // Load the script for the current active tab
  const result = await browser.storage.local.get(url);
  const script = result[url] || "";
  editorElement.value = script;

  console.log("Loaded script:", script);

  // Initial update of line numbers
  updateLineNumbers();

  // Save the script and inject it when the textarea loses focus
  editorElement.addEventListener("blur", async (event) => {
    const newScript = editorElement.value;

    console.log("Script on blur:", newScript);

    const validation = await validateScript(newScript);

    if (!validation.valid) {
      window.alert(`Error in script: ${validation.error}`);
      event.preventDefault();
      editorElement.focus();
      return;
    }

    console.log("Saving script:", newScript);
    await browser.storage.local.set({ [url]: newScript });

    // Inject the updated script into the current page
    await browser.tabs.executeScript(activeTab.id, {
      code: `document.addEventListener('DOMContentLoaded', () => {
        const existingScript = document.getElementById('injectedScript');
        if (existingScript) existingScript.remove();

        const scriptElement = document.createElement('script');
        scriptElement.id = 'injectedScript';
        scriptElement.textContent = ${JSON.stringify(newScript)};
        document.body.appendChild(scriptElement);
      });`,
    });
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
