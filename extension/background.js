chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-text",
    title: "ClearFrame: Analyze Selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "analyze-text" && info.selectionText) {

    chrome.storage.local.set({ pendingText: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  }
});
