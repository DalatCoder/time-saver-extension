const txtLink = document.getElementById('txt-link');
const txtDuration = document.getElementById('txt-duration');
const btnAdd = document.getElementById('btn-add');
const btnReset = document.getElementById('btn-reset');
const dashboardList = document.getElementById("dashboard-list");

loadStorage();

btnAdd.addEventListener('click', () => {
    const itemID = +(new Date()); // current timestamp
    const link = txtLink.value;
    const duration = txtDuration.value * 1;

    const newItem = {
        itemID,
        link,
        duration
    }

    // Store
    chrome.storage.local.get(["timeSaver"], ({ timeSaver }) => {

        // Duplicate
        const result = Object.keys(timeSaver).find(key => timeSaver[key].link.includes(link));
        if (result) {
            timeSaver[result].duration += duration;
            chrome.storage.local.set({ timeSaver });
        }
        else {
            timeSaver[itemID] = newItem;
        }

        chrome.storage.local.set({ timeSaver });

        console.log(timeSaver);

        renderDashboardList(timeSaver);;
    });
});

btnReset.addEventListener('click', () => {
    chrome.storage.local.set({ timeSaver: {} });
    renderDashboardList({});
})

function loadStorage() {
    chrome.storage.local.get(["timeSaver"], ({ timeSaver }) => {
        console.log(timeSaver);
        renderDashboardList(timeSaver);;
    });
}

function createDashboardItem(orderNumber, itemID, link, duration) {
    return `
    <li class="flex text-gray-500" id="${itemID}">
        <span class="w-4/6 py-1 border-r border-pink-300">
            <span class="font-bold text-pink-500">${orderNumber}. </span>
            ${link}
        </span>
        <span class="w-2/6 py-1 text-center">${duration}</span>
    </li>
    `;
}

function truncateString(str) {
    if (str.length < 30) return str;
    else return str.split('').slice(0, 25).join('').concat('...');
}

function renderDashboardList(timeSaverObject) {
    const innerHTMLs = Object.keys(timeSaverObject).map((key, index) => {
        const { itemID, link, duration } = timeSaverObject[key];

        return createDashboardItem(index + 1, itemID, truncateString(link), duration);
    });
    dashboardList.innerHTML = innerHTMLs.join('');
}
