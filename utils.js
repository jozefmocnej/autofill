/*jshint esversion: 6 */
function autofill(pages, delayInMs) {
    'use strict';

    const initAutoFill = () => {  
        reset();
    
        const page = getPage(pages);
    
        if (page) {
            const fillFieldsFunc = initFillFieldsFunc(delayInMs);
            createButtons(page, fillFieldsFunc);
            initShortcuts(page, fillFieldsFunc);
        }
    }
 
    initAutoFill();

    window.addEventListener('popstate', initAutoFill);
}

function getPage(pages) {
    return pages.find(({ url }) => location.href.includes(url));
}

function reset() {
    removeButtons();
    document.removeEventListener('keydown', null, false);
    document.removeEventListener('keyup', null, false);
}

function initFillFieldsFunc(delayInMs) {
    return async (data) => {
        if (!isIterable(data)) {
            console.log('Selected dataset is not defined');
            return;
        }
        
        await sleep(10);

        for (const record of data) {
            const selectedElement = selectRecordElement(record);

            if (selectedElement) {
                selectedElement.focus();
                await sleep(delayInMs);
                setElementValue(selectedElement, record.value);
                selectedElement.dispatchEvent(new Event('change', { 'bubbles': true } ));
                await sleep(delayInMs);
                selectedElement.blur();
                await sleep(delayInMs);
            }
        }
    };
}

function createButtons(page, onClick) {
    const wrapper = document.createElement('div');
    wrapper.id = 'magicWrapper';
    wrapper.className = 'magic-wrapper';
    document.body.appendChild(wrapper);

    for (const [key, dataset] of Object.entries(page.datasets)) {
        const button = htmlToElement(`<button id="magicBtn${key}" type="button" class="magic-button">${dataset.buttonLabel}</button>`);
        button.title = dataset.shortcut ? 'Shortcut: ' + dataset.shortcut.join(' + ') : 'Shortcut is not defined';
        button.onclick = () => onClick(dataset.data);
        wrapper.appendChild(button);
    }
}

function removeButtons() {
    const wrapper = document.getElementById('magicWrapper');
    if (wrapper) {
        wrapper.parentNode.removeChild(wrapper);
    }
}

function initShortcuts(page, onMatch) {
    const pressedKeys = new Set();

    const keydown = (e) => {
            if (pressedKeys.has(e.key)) {
                return;
            }

            pressedKeys.add(e.key);

            if (pressedKeys.size === 2 && pressedKeys.has('b') && pressedKeys.has('v')) {
                const wrapper = document.getElementById('magicWrapper');
                wrapper.style.display = wrapper.style.display === 'block' ? 'none' : 'block';
                return;
            }

            Object.values(page.datasets).some(dataset => {
                const isMatch = isShortcutMatch(dataset.shortcut, pressedKeys);
                if (isMatch) {
                    onMatch(dataset.data);
                }
                return isMatch;
            });
    };

    const keyup = (e) => {
        pressedKeys.delete(e.key);
    }

    document.addEventListener('keydown', keydown, false);
    document.addEventListener('keyup', keyup, false);
}

function isShortcutMatch(shortcut, pressedKeys) {
    if (shortcut && shortcut.length === pressedKeys.size) {
        return shortcut.every(key => {
            if (!pressedKeys.has(key)) {
                return false;
            }
            return true;
        });
    }
    return false;
};

function selectRecordElement(record) {
    if (record.name) {
        return document.getElementsByName(record.name)[0];
    } else if (record.id) {
        return document.getElementById(record.id);
    } else if (record.class) {
        return document.getElementsByClassName(record.className)[0];
    }
}

function setElementValue(element, value) {
    if (element.type === 'checkbox') {
        element.checked = value;
    } else {
        element.value = value;
    }
}

function htmlToElement(html) {
    html = html.trim();
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}