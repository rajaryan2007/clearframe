chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-text",
    title: "ClearFrame: Analyze Selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-text" && info.selectionText) {
    // Open the popup or simply send a notification
    // Since popups can't be opened programmatically in V3 easily without a user gesture,
    // we can redirect them to the dashboard or store it in local storage for the popup to read.
    chrome.storage.local.set({ pendingText: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  }
});
