document.addEventListener("DOMContentLoaded", async () => {
  const editorElement = document.getElementById("scriptEditor");
  const lineNumbersElement = document.getElementById("line-numbers");
  const errorMessageElement = document.getElementById("error-message");

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

  // Function to validate script using Function constructor
  const validateScript = (script) => {
    try {
      new Function(script);
      errorMessageElement.innerHTML = "";
      return true;
    } catch (e) {
      errorMessageElement.innerHTML = `Error: ${e.message}`;
      return false;
    }
  };

  // Update line numbers on input
  editorElement.addEventListener("input", updateLineNumbers);

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;

  // Load the script for the current active tab
  const result = await browser.storage.local.get(url);
  const script = result[url] || "";
  editorElement.value = script;

  // Initial update of line numbers
  updateLineNumbers();

  // Save the script and inject it when the textarea loses focus
  editorElement.addEventListener("blur", async (event) => {
    const newScript = editorElement.value;

    if (!validateScript(newScript)) {
      event.preventDefault();
      editorElement.focus();
      return;
    }

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
