import { TGroup, IGroup, TPriority } from './types';
import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners, setNotification } from './event-listeners.js';
import { unrender, render } from './rendering.js';
import { setContent } from './utils.js';
import { heading } from './event-listeners.js';
import { storage } from './storage.js';

export let group: TGroup = new Group({} as IGroup);
export const groupHistory: TGroup[] = [];
export const weightFactor: number = 3;

export const updateAndDirectFocus = (updatedGroup: TGroup, secondParameter: string | null): void => {
    update(updatedGroup);
    if (secondParameter) {
        const elementToFocus: HTMLElement | null = document.querySelector(secondParameter);
        focus(elementToFocus);
    }
};

export const updateAndRewindFocus = (updatedGroup: TGroup): void => {
    update(updatedGroup);
    const elementToFocus: HTMLElement = getMostRecentFocusableElement();
    focus(elementToFocus);
};

const handleLoadFailure = (...args: (string | Element | DocumentFragment)[]): void => {
    if (heading) {
        setContent(heading, `😯 Something went wrong 🤭`);
        heading.removeAttribute('contenteditable');
    }
    setNotification(...args);
    document.body.classList.add('load-failure');
};

const handleMalformedFetch = (): void => {
    const email: HTMLAnchorElement = document.createElement('a');
    email.href = 'mailto:petar@frontendlane.com';
    email.append('petar@frontendlane.com');
    const json: HTMLElement = document.createElement('abbr');
    json.append('JSON');
    json.title = 'JavaScript Object Notation';
    const localStorage: HTMLElement = document.createElement('code');
    localStorage.append('localStorage');
    handleLoadFailure(`Couldn't load sample data, probably because of a syntax error in the sample data `, json, `. 🤦‍♂️ This is embarassing, but can you please let me know at `, email ,` that you're seeing this message and I'll fix it.\n\nIf you know your way around browser DevTools, feel free to fix the syntax issue and manually save the data to `, localStorage, `.`);
};

const handleFetchFailure = (): void => {
    const samplePage: HTMLAnchorElement = document.createElement('a');
    samplePage.append('static version of this page');
    samplePage.href = './sample-page.html';
    handleLoadFailure(`Couldn't load sample data. An unreliable internet connection may be at fault. Give the `, samplePage, ` a try instead.`);
};

const handleLoadSuccess = (...args: (string | Element | DocumentFragment)[]): void => {
    setNotification(...args);
    document.body.classList.add('load-success');
};

let fetchFailCount: number = 0;
const handleFetchError = (): any => {
    (++fetchFailCount < 3)
        ? setTimeout(async (): Promise<void | false> =>
            await fetchSampleData() && handleLoadSuccess('Loaded sample data.'), 1000)
        : handleFetchFailure();
};

export const doAndPreserveFocus = (callback: () => any): void => {
    const cssSelector: string | null = cssPath(document.activeElement);
    callback();
    if (cssSelector) {
        const elementToFocus: HTMLElement | null = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};

const calcRemainingWeight = (group: TGroup): number => {
    const totalMaxWeight = group.priorities.length * weightFactor;
    const usedWeight = group.priorities
        .map((priority: TPriority): number => priority.weight)
        .reduce((accumulator: number, next: number) => accumulator + next, 0);
    return totalMaxWeight - usedWeight;
};

export const rinseContent = (updatedGroup: TGroup): void => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
    document.title = updatedGroup.name;
};

const update = (updatedGroup: TGroup): void => {
    groupHistory.push(group);
    rinseContent(updatedGroup);
    storage.save();
};

export const updateAndPreserveFocus = (updatedGroup: TGroup): void =>
    doAndPreserveFocus(() => update(updatedGroup));

const load = (group: TGroup): void => {
    updateAndPreserveFocus(group);
    heading && setContent(heading, group.name);
    attachListeners();
};

const fetchSampleData = async (): Promise<boolean> => {
    let sampleData: TGroup | undefined;
    try {
        const response: Response = await fetch(`${location.protocol}//${location.host + (location.pathname.endsWith('/') ? location.pathname : '/')}public/sample-data.json`);
        if (response.ok) {
            try {
                sampleData = await response.json();
            } catch (error) {
                handleMalformedFetch();
            }
        } else {
            handleLoadFailure('Error with fetching sample data: ', response.statusText);
        }
    } catch (error) {
        handleFetchError();
    }
    if (sampleData) {
        load(sampleData);
    }
    return !!sampleData;
};

const handleMalformedStorage = (): void => {
    const could: HTMLElement = document.createElement('em');
    could.append('could');
    const email: HTMLAnchorElement = document.createElement('a');
    email.href = 'mailto:petar@frontendlane.com';
    email.append('petar@frontendlane.com');
    const json: HTMLElement = document.createElement('abbr');
    json.append('JSON');
    json.title = 'JavaScript Object Notation';
    const localStorage: HTMLElement = document.createElement('code');
    localStorage.append('localStorage');
    const clearData: HTMLButtonElement = document.createElement('button');
    clearData.append('delete your data');
    clearData.addEventListener('click', async (): Promise<void> => {
        storage.clear();
        await fetchSampleData() && handleLoadSuccess('Loaded sample data.');
    });
    handleLoadFailure(`Your data couldn't be loaded from browser memory. It `, could, ` be that an update to Prioritizer broke your old data. Shoot me an email at `, email ,` and I'll try to help retrieve your data.\n\nIf you know your way around browser DevTools, you may first want to try to fix the issue yourself by changing the `, json ,` stored in `, localStorage, `. Don't forget to make a backup of your data if you decide to do this!\n\nOr you can `, clearData, ` and start again from scratch.`);
};

const handleUnavailableStorage = async (): Promise<void> => {
    if (await fetchSampleData()) {
        const localStorage: HTMLElement = document.createElement('code');
        localStorage.append('localStorage');
        handleLoadSuccess(`Loaded sample data 👍, but had an error saving data to browser memory 👎 (`, localStorage, `). If you're using Safari make sure to disable "Block All Cookies". You can use the app but your data won't be here when you return.`);
    }
};

const loadFromStorage = async (): Promise<void> => {
    let storedData: TGroup | undefined;
    if (storage.isAvailable()) {
        const rawData: string = storage.load();
        if (rawData) {
            try {
                storedData = JSON.parse(rawData);
            } catch (error) {
                handleMalformedStorage();
            }
        } else {
            await fetchSampleData() && handleLoadSuccess('Loaded sample data.');
        }
    } else {
        handleUnavailableStorage();
    }
    if (storedData) {
        load(storedData);
        handleLoadSuccess('Loaded data from browser memory.');
    }
};

const init = (): void => {
    normalizeFocus();
    loadFromStorage();
};

init();