// Log a message when the service worker starts
console.log("Background service worker is running!");

// Listen for tab updates (e.g., new URL loaded or tab created)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the tab is fully loaded
  if (changeInfo.status === "complete" && tab.active) {
    // Check if the URL is valid and not restricted
    if (tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
      // Inject the content script into the updated tab
      try {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ["content.js"] // Inject the content script
        }, () => {
          if (chrome.runtime.lastError) {
            // Handle error silently
          }
        });
      } catch (error) {
        // Handle unexpected errors silently
      }
    }
  }
});
