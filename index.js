///////////////////////
// ELEMENT SELECTORS //
///////////////////////

// extractor script elements
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
const submitButton = document.querySelector('#submit-button');

// match script elements
const matchCsvFileInput = document.querySelector('#match-csv-file');
const matchCsvUploadLabel = document.querySelector('#match-csv-upload-label');
const matchCsvFileName = document.querySelector('#match-csv-file-name');
const matchCsvFileError = document.querySelector('#match-csv-file-error');
const matchHtmlFileInput = document.querySelector('#match-html-file');
const matchHtmlUploadLabel = document.querySelector('#match-html-upload-label');
const matchHtmlFileName = document.querySelector('#match-html-file-name');
const matchHtmlFileError = document.querySelector('#match-html-file-error');
const matchDataSection = document.querySelector('#match-data-section');
const matchForm = document.querySelector('#match-form');
const matchToggle = document.querySelector('#match-toggle');
const matchSubmitButton = document.querySelector('#match-submit-button');
const matchReloadButton = document.querySelector('#match-reload-button');

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

function handleToggle(event) {
    const toggle = event.target;
    const circle = event.target.children[0];
    toggle.classList.toggle('bg-blue-600');
    toggle.classList.toggle('bg-gray-400');
    toggle.dataset.toggle === '0' ? (toggle.dataset.toggle = '1') : (toggle.dataset.toggle = '0');
    circle.classList.toggle('right-0');
}

function toggleSubmit(element) {
    element.classList.toggle('bg-gray-200');
    element.classList.toggle('text-gray-400');
    element.classList.toggle('cursor-not-allowed');
    element.classList.toggle('bg-blue-200');
    element.classList.toggle('text-blue-800');
}

//////////////////////
// EXTRACTOR EVENTS //
//////////////////////

// extractor csv file event
csvFileInput.addEventListener('change', (e) => {
    const types = ['text/csv', 'application/vnd.ms-excel'];
    const csvFile = e.target.files[0];
    fileName.innerHTML = csvFile.name;
    fileName.classList.toggle('hidden');
    if (types.includes(csvFile.type)) {
        toggleSubmit(submitButton);
    } else {
        fileError.classList.toggle('hidden');
        fileError.innerHTML = `Error: Filetype is ${csvFile.type}, please upload a CSV file.`;
        reloadButton.classList.toggle('hidden');
        csvUploadLabel.classList.toggle('hidden');
    }
});

// extractor submit button event
submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    const csvFile = csvFileInput.files[0];
    if (csvFile) {
        readFile(csvFile).then((result) => {
            const itemSet = csvToItemSet(result);
            createItemElements(itemSet);
        });
        dataSection.classList.remove('hidden');
    }
});

// extractor reload button
reloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload(true);
});

// extractor copy text button
copyTextButton.addEventListener('click', (e) => {
    e.preventDefault();
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(itemsContainer);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
});

//////////////////
// MATCH EVENTS //
//////////////////

// match csv file event
matchCsvFileInput.addEventListener('change', (e) => {
    const types = ['text/csv', 'application/vnd.ms-excel'];
    const csvFile = e.target.files[0];
    matchCsvFileName.innerHTML = csvFile.name;
    matchCsvFileName.classList.toggle('hidden');
    if (types.includes(csvFile.type)) {
        readFile(csvFile).then((result) => {
            if (matchHtmlFileInput.files[0]) {
                toggleSubmit(matchSubmitButton);
            }
            console.log('match CSV file loaded!');
        });
    } else {
        matchCsvFileError.classList.toggle('hidden');
        matchCsvFileError.innerHTML = `Error: Filetype is ${csvFile.type}, please upload a CSV file.`;
        matchReloadButton.classList.toggle('hidden');
        matchCsvUploadLabel.classList.toggle('hidden');
    }
});

// match html file event
matchHtmlFileInput.addEventListener('change', (e) => {
    const types = ['text/html'];
    const htmlFile = e.target.files[0];
    matchHtmlFileName.innerHTML = htmlFile.name;
    matchHtmlFileName.classList.toggle('hidden');
    if (types.includes(htmlFile.type)) {
        readFile(htmlFile).then((result) => {
            if (matchCsvFileInput.files[0]) {
                toggleSubmit(matchSubmitButton);
            }
            console.log('match HTML file loaded!');
        });
    } else {
        matchHtmlFileError.classList.toggle('hidden');
        matchHtmlFileError.innerHTML = `Error: Filetype is ${htmlFile.type}, please upload a CSV file.`;
        matchReloadButton.classList.toggle('hidden');
        matchHtmlUploadLabel.classList.toggle('hidden');
    }
});

// match submit button event
matchSubmitButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (matchCsvFileInput.files[0] && matchHtmlFileInput.files[0]) {
        matchDataSection.classList.toggle('hidden');
    }
});

////////////////////
// TOGGLE BUTTONS //
////////////////////

extractorToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle(e);
    extractorToggle.dataset.toggle === '0' && matchToggle.dataset.toggle === '0' && matchToggle.click();
    extractorToggle.dataset.toggle === '1' && matchToggle.dataset.toggle === '1' && matchToggle.click();
    extractorForm.classList.toggle('hidden');
    if (!dataSection.classList.contains('hidden')) {
        dataSection.classList.toggle('hidden');
    }
});

matchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    handleToggle(e);
    extractorToggle.dataset.toggle === '0' && matchToggle.dataset.toggle === '0' && extractorToggle.click();
    extractorToggle.dataset.toggle === '1' && matchToggle.dataset.toggle === '1' && extractorToggle.click();
    matchForm.classList.toggle('hidden');
    if (!matchDataSection.classList.contains('hidden')) {
        matchDataSection.classList.toggle('hidden');
    }
});
