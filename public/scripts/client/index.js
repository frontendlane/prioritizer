var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners, setNotification } from './event-listeners.js';
import { unrender, render } from './rendering.js';
import { setContent } from './utils.js';
import { heading } from './event-listeners.js';
import { storage } from './storage.js';
export let group = new Group({});
export const groupHistory = [];
export const weightFactor = 3;
export const updateAndDirectFocus = (updatedGroup, secondParameter) => {
    update(updatedGroup);
    if (secondParameter) {
        const elementToFocus = document.querySelector(secondParameter);
        focus(elementToFocus);
    }
};
export const updateAndRewindFocus = (updatedGroup) => {
    update(updatedGroup);
    const elementToFocus = getMostRecentFocusableElement();
    focus(elementToFocus);
};
const handleLoadFailure = (...args) => {
    if (heading) {
        setContent(heading, `😯 Something went wrong 🤭`);
        heading.removeAttribute('contenteditable');
    }
    setNotification(...args);
    document.body.classList.add('load-failure');
};
const handleMalformedFetch = () => {
    const email = document.createElement('a');
    email.href = 'mailto:petar@frontendlane.com';
    email.append('petar@frontendlane.com');
    const json = document.createElement('abbr');
    json.append('JSON');
    json.title = 'JavaScript Object Notation';
    const localStorage = document.createElement('code');
    localStorage.append('localStorage');
    handleLoadFailure(`Couldn't load sample data, probably because of a syntax error in the sample data `, json, `. 🤦‍♂️ This is embarassing, but can you please let me know at `, email, ` that you're seeing this message and I'll fix it.\n\nIf you know your way around browser DevTools, feel free to fix the syntax issue and manually save the data to `, localStorage, `.`);
};
const handleFetchFailure = () => {
    const samplePage = document.createElement('a');
    samplePage.append('static version of this page');
    samplePage.href = './sample-page.html';
    handleLoadFailure(`Couldn't load sample data. An unreliable internet connection may be at fault. Give the `, samplePage, ` a try instead.`);
};
const handleLoadSuccess = (...args) => {
    setNotification(...args);
    document.body.classList.add('load-success');
};
let fetchFailCount = 0;
const handleFetchError = () => {
    (++fetchFailCount < 3)
        ? setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return (yield fetchSampleData()) && handleLoadSuccess('Loaded sample data.'); }), 1000)
        : handleFetchFailure();
};
export const doAndPreserveFocus = (callback) => {
    const cssSelector = cssPath(document.activeElement);
    callback();
    if (cssSelector) {
        const elementToFocus = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};
const calcRemainingWeight = (group) => {
    const totalMaxWeight = group.priorities.length * weightFactor;
    const usedWeight = group.priorities
        .map((priority) => priority.weight)
        .reduce((accumulator, next) => accumulator + next, 0);
    return totalMaxWeight - usedWeight;
};
export const rinseContent = (updatedGroup) => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
    document.title = updatedGroup.name;
};
const update = (updatedGroup) => {
    groupHistory.push(group);
    rinseContent(updatedGroup);
    storage.save();
};
export const updateAndPreserveFocus = (updatedGroup) => doAndPreserveFocus(() => update(updatedGroup));
const load = (group) => {
    updateAndPreserveFocus(group);
    heading && setContent(heading, group.name);
    attachListeners();
};
const fetchSampleData = () => __awaiter(void 0, void 0, void 0, function* () {
    let sampleData;
    try {
        const response = yield fetch(`${location.protocol}//${location.host + (location.pathname.endsWith('/') ? location.pathname : '/')}public/sample-data.json`);
        if (response.ok) {
            try {
                sampleData = yield response.json();
            }
            catch (error) {
                handleMalformedFetch();
            }
        }
        else {
            handleLoadFailure('Error with fetching sample data: ', response.statusText);
        }
    }
    catch (error) {
        handleFetchError();
    }
    if (sampleData) {
        load(sampleData);
    }
    return !!sampleData;
});
const handleMalformedStorage = () => {
    const could = document.createElement('em');
    could.append('could');
    const email = document.createElement('a');
    email.href = 'mailto:petar@frontendlane.com';
    email.append('petar@frontendlane.com');
    const json = document.createElement('abbr');
    json.append('JSON');
    json.title = 'JavaScript Object Notation';
    const localStorage = document.createElement('code');
    localStorage.append('localStorage');
    const clearData = document.createElement('button');
    clearData.append('delete your data');
    clearData.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        storage.clear();
        (yield fetchSampleData()) && handleLoadSuccess('Loaded sample data.');
    }));
    handleLoadFailure(`Your data couldn't be loaded from browser memory. It `, could, ` be that an update to Prioritizer broke your old data. Shoot me an email at `, email, ` and I'll try to help retrieve your data.\n\nIf you know your way around browser DevTools, you may first want to try to fix the issue yourself by changing the `, json, ` stored in `, localStorage, `. Don't forget to make a backup of your data if you decide to do this!\n\nOr you can `, clearData, ` and start again from scratch.`);
};
const handleUnavailableStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield fetchSampleData()) {
        const localStorage = document.createElement('code');
        localStorage.append('localStorage');
        handleLoadSuccess(`Loaded sample data 👍, but had an error saving data to browser memory 👎 (`, localStorage, `). If you're using Safari make sure to disable "Block All Cookies". You can use the app but your data won't be here when you return.`);
    }
});
const loadFromStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    let storedData;
    if (storage.isAvailable()) {
        const rawData = storage.load();
        if (rawData) {
            try {
                storedData = JSON.parse(rawData);
            }
            catch (error) {
                handleMalformedStorage();
            }
        }
        else {
            (yield fetchSampleData()) && handleLoadSuccess('Loaded sample data.');
        }
    }
    else {
        handleUnavailableStorage();
    }
    if (storedData) {
        load(storedData);
        handleLoadSuccess('Loaded data from browser memory.');
    }
});
const init = () => {
    normalizeFocus();
    loadFromStorage();
};
init();
