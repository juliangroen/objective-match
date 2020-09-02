const csvFileInput = document.querySelector('#csv-file');
const itemsContainer = document.querySelector('#item-container');

function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsText(file);
    });
}

function csvToItemSet(data) {
    const lines = data.split('\n');
    lines.shift();
    const items = lines
        .map((line) => {
            try {
                const values = line.split(',');
                const array = values[5].split('-');
                const first = array[0];
                const second = array[1].split('.')[0];
                const item = `${first}-${second}`;
                if (!(item[0] === 'T')) {
                    return item;
                }
            } catch {
                return undefined;
            }
        })
        .filter((item) => item !== undefined);
    return [...new Set(items)];
}

function createItemElements(itemsArray) {
    itemsContainer.innerHTML = '';
    for (const [index, item] of itemsArray.entries()) {
        const frag = new DocumentFragment();
        const el = document.createElement('div');
        el.innerHTML = item;
        frag.appendChild(el);
        itemsContainer.appendChild(frag);
    }
}

csvFileInput.addEventListener('change', (e) => {
    const csvFile = e.target.files[0];
    console.log(csvFile);
    readFile(csvFile).then((result) => {
        const itemSet = csvToItemSet(result);
        createItemElements(itemSet);
    });
});
