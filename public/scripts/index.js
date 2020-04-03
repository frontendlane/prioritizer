import { Group } from './Group.js';
import domPath from './dom-path.js';
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
const addToHistory = (group) => groupHistory.push(group);
export const rinseDOM = (updatedGroup) => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
};
const getParentCssSelector = (cssSelector) => {
    const cssSelectorParts = cssSelector.split('>');
    const parentCssSelector = cssSelectorParts.splice(0, cssSelectorParts.length - 1).join('>');
    return parentCssSelector || 'body';
};
const queryClosest = (cssSelector) => {
    let closest = document.querySelector(cssSelector);
    while (!closest) {
        closest = document.querySelector(cssSelector);
        cssSelector = getParentCssSelector(cssSelector);
    }
    return closest;
};
export const update = (updatedGroup, elementToFocus = document.activeElement) => {
    const cssSelector = typeof elementToFocus === 'string'
        ? elementToFocus
        : domPath(elementToFocus).toCSS();
    addToHistory(group);
    rinseDOM(updatedGroup);
    elementToFocus = queryClosest(cssSelector);
    elementToFocus.focus();
};
const init = () => fetch(`${location.href}data/initial-data.json`)
    .then(response => response.json())
    .then((data) => {
    priorityList.classList.add('done-fetching');
    update(new Group(data));
    attachListeners();
})
    .catch(console.error);
init();
