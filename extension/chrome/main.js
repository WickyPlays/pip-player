document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btn-open-link").addEventListener("click", async function () {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab && tab.url) {
          const pipLink = `pipplayer://${encodeURIComponent(tab.url)}`;
          chrome.tabs.update(tab.id, { url: pipLink });
      }
  });
});
