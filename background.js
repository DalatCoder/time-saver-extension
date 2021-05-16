
chrome.storage.local.get(['timeSaver'], (result) => {
    if (!result.timeSaver) {
        chrome.storage.local.set({ timeSaver: {} }, () => {
            console.log('Init timeSaver object for the first time');
        });
    }
});

chrome.alarms.get('timesaver', async (alarm) => {
    if (alarm) {
        const { timeSaver } = await getAllStorageLocalData();
        if (Object.keys(timeSaver).length === 0)
            chrome.alarms.clear('timesaver');
    }
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
    try {
        const { timeSaver } = await getAllStorageLocalData();
        console.log(timeSaver);

        const alarm = await getAlarm('timesaver');

        if (alarm) {
            if (Object.keys(timeSaver).length === 0) {
                const result = await killAlarm('timesaver');
                if (result) console.log('Kill alarm');
                else console.log('Error when killing alarm');
            }
        }
        else {
            if (Object.keys(timeSaver).length > 0) {
                console.log('Init new alarm');
                initAlarm();
            }
        }

    } catch (ex) { console.log(ex); }
});

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

    } catch (ex) { console.log(ex) }
})

chrome.alarms.onAlarm.addListener(async () => {
    const { timeSaver } = await getAllStorageLocalData();
    console.log(timeSaver);

    for (const key in timeSaver) {
        if (Object.hasOwnProperty.call(timeSaver, key)) {
            const element = timeSaver[key];

            element.duration -= 1;
            if (element.duration === 0) {
                delete timeSaver[key];
            }
        }
    }

    chrome.storage.local.set({ timeSaver });
});

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

function initAlarm() {
    chrome.alarms.create('timesaver', {
        delayInMinutes: 0,
        periodInMinutes: 1 // 1 minutes | set 0: 1 second
    });
}

async function getAlarm(name) {
    return new Promise((resolve, reject) => {
        try {
            chrome.alarms.get(name, (alarm) => {
                resolve(alarm);
            });
        }
        catch (ex) {
            reject(ex);
        }
    })
}

async function killAlarm(name) {
    return new Promise((resolve, reject) => {
        try {
            chrome.alarms.clear(name, result => {
                resolve(result);
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension is %crunning', `color: ${'#00FF00'}`);
});
