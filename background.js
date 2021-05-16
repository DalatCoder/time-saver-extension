
chrome.storage.local.set({ timeSaver: {} });

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function getAllStorageLocalData() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }

            resolve(items);
        });
    });
}

function killTab(tabId) {
    chrome.tabs.remove(tabId);
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension is %crunning', `color: ${'#00FF00'}`);

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        try {
            if (!tab.status.includes("complete")) return;

            const { timeSaver } = await getAllStorageLocalData();
            const url = tab.url;

            for (const key in timeSaver) {
                if (Object.hasOwnProperty.call(timeSaver, key)) {
                    const element = timeSaver[key];
                    
                    if (element.link.includes(url)) {
                        console.log('Match ' + url);
                        killTab(tabId);

                        //TODO: open new animated tab to show reason
                    }
                }
            }

        } catch(ex) { console.log(ex) }
    })
});
