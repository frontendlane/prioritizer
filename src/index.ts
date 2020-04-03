import { TGroup, TPriority } from './types';
import { Group } from './Group.js';
import domPath from './dom-path.js';
import { attachListeners } from './event-listeners.js';
import { unrender, render, priorityList } from './rendering.js';

export let group: TGroup = new Group({});
export const groupHistory: TGroup[] = [];

export const weightFactor: number = 3;

const calcRemainingWeight = (group: TGroup): number => {
    const totalMaxWeight = group.priorities.length * weightFactor;
    const usedWeight = group.priorities
        .map((priority: TPriority): number => priority.weight)
        .reduce((accumulator: number, next: number) => accumulator + next, 0);

    return totalMaxWeight - usedWeight;
};

const addToHistory = (group: TGroup) => groupHistory.push(group);

export const rinseDOM = (updatedGroup: TGroup) => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
};

const getParentCssSelector = (cssSelector: string): string => {
    const cssSelectorParts: string[] = cssSelector.split('>')
    const parentCssSelector: string = cssSelectorParts.splice(0, cssSelectorParts.length - 1).join('>');
    return parentCssSelector || 'body';
};

const queryClosest = (cssSelector: string): HTMLElement => {
    let closest = document.querySelector(cssSelector);
    while (!closest) {
        closest = document.querySelector(cssSelector);
        cssSelector = getParentCssSelector(cssSelector);
    }
    return closest as HTMLElement;
};

export const update = (updatedGroup: TGroup, elementToFocus: string | HTMLElement = document.activeElement as HTMLElement) => {
    const cssSelector: string = typeof elementToFocus === 'string'
        ? elementToFocus
        : domPath(elementToFocus).toCSS();

    addToHistory(group);
    rinseDOM(updatedGroup);

    elementToFocus = queryClosest(cssSelector);
    elementToFocus.focus();
};

const init = () => fetch(`${location.href}data/initial-data.json`)
    .then(response => response.json())
    .then((data: TGroup) => {
        priorityList.classList.add('done-fetching');
        update(new Group(data));
        attachListeners();
    })
    .catch(console.error);

init();