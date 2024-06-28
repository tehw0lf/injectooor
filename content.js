browser.storage.local.get(window.location.href).then((result) => {
  const script = result[window.location.href];
  if (script) {
    try {
      eval(script);
      browser.runtime.sendMessage({ status: "active" });
    } catch (e) {
      console.error(e);
      browser.runtime.sendMessage({ status: "error" });
    }
  }
});
