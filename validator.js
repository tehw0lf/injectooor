self.onmessage = function (event) {
  const script = event.data;
  try {
    new Function(script);
    self.postMessage({ valid: true });
  } catch (e) {
    self.postMessage({ valid: false, error: e.message });
  }
};
