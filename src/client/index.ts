import { TGroup, TPriority } from './types';
import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners } from './event-listeners.js';
import { unrender, render, priorityList } from './rendering.js';
import { setContent } from './utils.js';
import { heading } from './event-listeners.js';

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
};

export const doAndPreserveFocus = (callback: () => any): void => {
    const cssSelector: string | null = cssPath(document.activeElement);
    callback();
    if (cssSelector) {
        const elementToFocus: HTMLElement | null = document.querySelector(cssSelector);
        focus(elementToFocus);
    }
};

export const updateAndPreserveFocus = (updatedGroup: TGroup) => doAndPreserveFocus(() => update(updatedGroup));

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

const init = () => fetch(`${location.protocol}//${location.host + (location.pathname.endsWith('/') ? location.pathname : '/')}public/sample-data.json`)
    .then(response => response.json())
    .then((data: TGroup) => {
        priorityList.classList.add('done-fetching');
        updateAndPreserveFocus(new Group(data));
        heading && setContent(heading, group.name);
        attachListeners();
    })
    .catch(console.error);

normalizeFocus();
init();