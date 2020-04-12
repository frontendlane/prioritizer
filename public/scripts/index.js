import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners } from './event-listeners.js';
import { unrender, render, priorityList } from './rendering.js';
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
export const rinseDOM = (updatedGroup) => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
};
const update = (updatedGroup) => {
    groupHistory.push(group);
    rinseDOM(updatedGroup);
};
export const updateAndPreserveFocus = (updatedGroup) => {
    const cssSelector = cssPath(document.activeElement);
    update(updatedGroup);
    if (cssSelector) {
        const elementToFocus = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};
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
const init = () => fetch(`${location.protocol}//${location.host + location.pathname}data/initial-data.json`)
    .then(response => response.json())
    .then((data) => {
    priorityList.classList.add('done-fetching');
    updateAndPreserveFocus(new Group(data));
    attachListeners();
})
    .catch(console.error);
normalizeFocus();
init();
