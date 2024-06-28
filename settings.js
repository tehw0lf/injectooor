document.addEventListener("DOMContentLoaded", async () => {
  const scriptsDropdown = document.getElementById("scriptsDropdown");
  const scriptEditor = document.getElementById("scriptEditor");
  const saveButton = document.getElementById("saveButton");
  const deleteButton = document.getElementById("deleteButton");

  // Load saved scripts into the dropdown
  const loadScripts = async () => {
    const allScripts = await browser.storage.local.get();
    scriptsDropdown.innerHTML = "";
    for (const [url, script] of Object.entries(allScripts)) {
      const option = document.createElement("option");
      option.value = url;
      option.textContent = url;
      scriptsDropdown.appendChild(option);
    }
  };

  // Populate the editor when a script is selected
  scriptsDropdown.addEventListener("change", () => {
    const selectedURL = scriptsDropdown.value;
    browser.storage.local.get(selectedURL).then((result) => {
      scriptEditor.value = result[selectedURL] || "";
    });
  });

  // Save the edited script
  saveButton.addEventListener("click", async () => {
    const selectedURL = scriptsDropdown.value;
    const newScript = scriptEditor.value;
    await browser.storage.local.set({ [selectedURL]: newScript });
    alert("Script saved!");
  });

  // Delete the selected script
  deleteButton.addEventListener("click", async () => {
    const selectedURL = scriptsDropdown.value;
    await browser.storage.local.remove(selectedURL);
    scriptEditor.value = "";
    await loadScripts();
    alert("Script deleted!");
  });

  // Initial load
  await loadScripts();
});
