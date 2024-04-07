document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get('adsSkipped', (data) => {
    document.getElementById('adsSkippedCount').textContent = data.adsSkipped || '0';
  });

  const statusButton = document.querySelector('.status_active');
  statusButton.addEventListener('click', function() {
    chrome.storage.local.get('extensionActive', (data) => {
      const isActive = data.extensionActive || false;
      const newStatus = !isActive;
      chrome.storage.local.set({ extensionActive: newStatus }, ()=> {
        updateStatusUI(newStatus);
        if (!newStatus) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            chrome.tabs.sendMessage(tabId, { extensionActive: newStatus });
          });
        }
      });
    });
  });

  function updateStatusUI(isActive) {
    const statusText = document.querySelector('.status');
    const buttonText = document.querySelector('.status_active');
    if (isActive) {
      statusText.textContent = 'Status: Active';
      buttonText.textContent = 'OFF';
      buttonText.style.backgroundColor = '#ff0000e7';
      buttonText.classList.remove('active');
    } else {
      statusText.textContent = 'Status: Inactive';
      buttonText.textContent = 'ON';
      buttonText.style.backgroundColor = 'green';
      buttonText.classList.add('active');
    }
  }

  chrome.storage.local.get('extensionActive', (data) => {
    const isActive = data.extensionActive || false;
    updateStatusUI(isActive);
  });

});
