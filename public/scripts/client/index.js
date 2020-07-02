import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners } from './event-listeners.js';
import { unrender, render, priorityList } from './rendering.js';
import { setContent } from './utils.js';
import { heading } from './event-listeners.js';
import { storage } from './storage.js';
export let group = new Group({});
export const groupHistory = [];
export const weightFactor = 3;
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
export const doAndPreserveFocus = (callback) => {
    const cssSelector = cssPath(document.activeElement);
    callback();
    if (cssSelector) {
        const elementToFocus = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};
export const updateAndPreserveFocus = (updatedGroup) => doAndPreserveFocus(() => update(updatedGroup));
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
const load = (group) => {
    priorityList.classList.add('done-loading');
    updateAndPreserveFocus(group);
    heading && setContent(heading, group.name);
    attachListeners();
};
const loadSavedData = (savedData) => {
    try {
        load(JSON.parse(savedData));
    }
    catch (error) {
        console.error(error);
    }
};
const fetchSampleData = () => fetch(`${location.protocol}//${location.host + (location.pathname.endsWith('/') ? location.pathname : '/')}public/sample-data.json`)
    .then((response) => response.json())
    .then((data) => load(new Group(data)))
    .catch(console.error);
const init = () => {
    const savedData = storage.load();
    savedData ? loadSavedData(savedData) : fetchSampleData();
};
normalizeFocus();
init();
