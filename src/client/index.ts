import { TGroup, IGroup, TPriority } from './types';
import { Group } from './Group.js';
import { normalizeFocus, focus } from './focus-normalizer.js';
import { cssPath } from './css-path.js';
import { getMostRecentFocusableElement } from './focus-history.js';
import { attachListeners } from './event-listeners.js';
import { unrender, render, priorityList } from './rendering.js';
import { setContent } from './utils.js';
import { heading } from './event-listeners.js';
import { storage } from './storage.js';

export let group: TGroup = new Group({} as IGroup);
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
    storage.save();
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

const load = (group: TGroup): void => {
    priorityList.classList.add('done-loading');
    updateAndPreserveFocus(group);
    heading && setContent(heading, group.name);
    attachListeners();
};

const loadSavedData = (savedData: string): void => {
    try {
        load(JSON.parse(savedData));
    } catch (error) {
        console.error(error);
    }
};

const fetchSampleData = (): Promise<void> =>
    fetch(`${location.protocol}//${location.host + (location.pathname.endsWith('/') ? location.pathname : '/')}public/sample-data.json`)
        .then((response: Response) => response.json())
        .then((data: IGroup) => load(new Group(data)))
        .catch(console.error);

const init = (): void => {
    const savedData: string = storage.load();
    savedData ? loadSavedData(savedData) : fetchSampleData();
};

normalizeFocus();
init();