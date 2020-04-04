import { Group } from './Group.js';
import { cssPath, queryClosest } from './css-path.js';
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
export const update = (updatedGroup, elementToFocus = document.activeElement) => {
    const cssSelector = typeof elementToFocus === 'string'
        ? elementToFocus
        : cssPath(elementToFocus);
    groupHistory.push(group);
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
