const csvFileInput = document.querySelector('#csv-file');
const csvUploadLabel = document.querySelector('#csv-upload-label');
const dataSection = document.querySelector('#data-section');
const itemsContainer = document.querySelector('#item-container');
const fileName = document.querySelector('#file-name');
const fileError = document.querySelector('#file-error');
const reloadButton = document.querySelector('#reload-button');
const copyTextButton = document.querySelector('#copy-text-button');
const extractorForm = document.querySelector('#extractor-form');
const extractorToggle = document.querySelector('#extractor-toggle');
const matchForm = document.querySelector('#match-form');
const matchToggle = document.querySelector('#match-toggle');

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
    try {
        const lines = data.split('\n');
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
        const itemSet = [...new Set(items)];

        return itemSet.length > 0 ? itemSet : ['Unable to find any items, please check your file and try again.'];
    } catch (err) {
        return ['Unable to parse data, please check your file and try again.', 'err'];
    }
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
    const types = ['text/csv'];
    const csvFile = e.target.files[0];
    fileName.innerHTML = csvFile.name;
    fileName.classList.toggle('hidden');
    if (types.includes(csvFile.type)) {
        readFile(csvFile).then((result) => {
            const itemSet = csvToItemSet(result);
            createItemElements(itemSet);
        });
        dataSection.classList.toggle('hidden');
    } else {
        fileError.classList.toggle('hidden');
        fileError.innerHTML = `Error: Filetype is ${csvFile.type}, please upload a CSV file.`;
        reloadButton.classList.toggle('hidden');
        csvUploadLabel.classList.toggle('hidden');
    }
});

function handleToggle(event) {
    const toggle = event.target;
    const circle = event.target.children[0];
    toggle.classList.toggle('bg-blue-600');
    toggle.classList.toggle('bg-gray-400');
    toggle.dataset.toggle === '0' ? (toggle.dataset.toggle = '1') : (toggle.dataset.toggle = '0');
    circle.classList.toggle('right-0');
}

reloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload(true);
});

copyTextButton.addEventListener('click', (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(itemsContainer);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
});

extractorToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle(e);
    extractorToggle.dataset.toggle === '0' && matchToggle.dataset.toggle === '0' && matchToggle.click();
    extractorToggle.dataset.toggle === '1' && matchToggle.dataset.toggle === '1' && matchToggle.click();
    extractorForm.classList.toggle('hidden');
});

matchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle(e);
    extractorToggle.dataset.toggle === '0' && matchToggle.dataset.toggle === '0' && extractorToggle.click();
    extractorToggle.dataset.toggle === '1' && matchToggle.dataset.toggle === '1' && extractorToggle.click();
    matchForm.classList.toggle('hidden');
});
