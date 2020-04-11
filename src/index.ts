import { TGroup, TPriority } from './types';
import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
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

export const rinseDOM = (updatedGroup: TGroup) => {
    group = updatedGroup;
    group.remainingWeight = calcRemainingWeight(updatedGroup);
    unrender();
    render();
};

const update = (updatedGroup: TGroup) => {
    groupHistory.push(group);
    rinseDOM(updatedGroup);
};

export const updateAndPreserveFocus = (updatedGroup: TGroup) => {
    const cssSelector: string | null = cssPath(document.activeElement);
    update(updatedGroup);
    if (cssSelector) {
        const elementToFocus: HTMLElement | null = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};

export const updateAndDirectFocus = (updatedGroup: TGroup, secondParameter: string | null) => {
    update(updatedGroup);
    if (secondParameter) {
        const elementToFocus: HTMLElement | null = document.querySelector(secondParameter);
        focus(elementToFocus);
    }
};

export const updateAndRewindFocus = (updatedGroup: TGroup) => {
    update(updatedGroup);
    const elementToFocus: HTMLElement = getMostRecentFocusableElement();
    focus(elementToFocus);
};

const init = () => fetch(`${location.href}data/initial-data.json`)
    .then(response => response.json())
    .then((data: TGroup) => {
        priorityList.classList.add('done-fetching');
        updateAndPreserveFocus(new Group(data));
        attachListeners();
    })
    .catch(console.error);

normalizeFocus();
init();