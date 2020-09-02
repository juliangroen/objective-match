const csvFileInput = document.querySelector('#csv-file');
const csvFile = csvFileInput.files[0];
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

csvFileInput.addEventListener('change', (e) => {
    readFile(csvFile).then((result) => {
        const itemSet = csvToItemSet(result);
        console.log(itemSet);
        createItemElements(itemSet);
    });
});

function csvToItemSet(data) {
    const lines = data.split('\n');
    lines.shift();
    const items = lines
        .map((line) => {
            const values = line.split(',');
            const array = values[5].split('-');
            const first = array[0];
            const second = array[1].split('.')[0];
            const item = `${first}-${second}`;
            if (!(item[0] === 'T')) {
                return item;
            }
        })
        .filter((item) => item !== undefined);
    return [...new Set(items)];
}

function createItemElements(itemsArray) {
    itemsContainer.innerHTML = '';
    for (item of itemsArray) {
        const frag = new DocumentFragment();
        const el = document.createElement('div');
        el.innerHTML = item;
        frag.appendChild(el);
        itemsContainer.appendChild(frag);
    }
}
