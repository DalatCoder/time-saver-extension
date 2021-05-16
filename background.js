
chrome.storage.local.set({ timeSaver: {} });

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension is %crunning', `color: ${'#00FF00'}`);
});