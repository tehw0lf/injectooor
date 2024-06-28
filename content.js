document.addEventListener("DOMContentLoaded", () => {
  const injectScript = () => {
    const existingScript = document.getElementById("injectedScript");
    if (existingScript) existingScript.remove();

    const scriptElement = document.createElement("script");
    scriptElement.id = "injectedScript";
    scriptElement.textContent = script;
    document.body.appendChild(scriptElement);
  };

  browser.storage.local.get(window.location.href).then((result) => {
    const script = result[window.location.href];
    if (script) {
      injectScript(script);
    }
  });
});
