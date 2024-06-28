document.addEventListener('DOMContentLoaded', async () => {
  const editorElement = document.getElementById('editor');
  
  // Create a simple textarea for the editor
  const textarea = document.createElement('textarea');
  textarea.id = 'scriptEditor';
  textarea.style.width = '100%';
  textarea.style.height = '300px';
  editorElement.appendChild(textarea);

  // Get the current active tab
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  const url = activeTab.url;

  // Load the script for the current active tab
  const result = await browser.storage.local.get(url);
  const script = result[url] || '';
  textarea.value = script;

  // Save the script when the textarea content changes
  textarea.addEventListener('input', () => {
    const newScript = textarea.value;
    browser.storage.local.set({ [url]: newScript });
  });
});
