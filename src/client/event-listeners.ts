import { TGroup, TPriority } from './types';
import { Priority } from './Priority.js';
import { deepCloneObject } from './deep-clone.js';
import { generateIdFromString, removeContent, setContent } from './utils.js';
import { group, groupHistory, rinseContent, updateAndPreserveFocus, doAndPreserveFocus } from './index.js';

export const heading: HTMLHeadingElement | null = document.querySelector('h1');

const getNotificationBar = (): HTMLParagraphElement | null => document.querySelector('p[aria-live="polite"][role="status"]');
const clearNotification = (notificationBar = getNotificationBar()) => notificationBar && removeContent(notificationBar);

const updateProjectName = (event: Event) => {
    const inputEvent: InputEvent = event as InputEvent;
    const heading: HTMLHeadingElement = event.target as HTMLHeadingElement;
    const updatedGroupName: string = heading.textContent || '';
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    updatedGroup.name = updatedGroupName;
    !updatedGroupName && removeContent(heading);
    inputEvent.inputType === 'deleteByDrag' || inputEvent.inputType === 'insertFromDrop'
        ? setTimeout(() => updateAndPreserveFocus(updatedGroup), 0)
        : updateAndPreserveFocus(updatedGroup);
};

export const setNotification = (text: string) => {
    const notificationBar = getNotificationBar();
    clearNotification(notificationBar);
    setTimeout(() => notificationBar && setContent(notificationBar, text), 100);
};

const add = ({id, name}: {id: string, name: string}, form: HTMLFormElement) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const newPriority: TPriority = new Priority({ id, name });
    updatedGroup.priorities.unshift(newPriority);
    form.reset();

    updateAndPreserveFocus(updatedGroup);
};

const submitNew = (event: Event) => {
    event.preventDefault();
    const input: HTMLInputElement = document.getElementById('new-priority') as HTMLInputElement;
    const name: string = input.value.trim();
    const id: string = generateIdFromString(name);
    const doesAlreadyExist = group.priorities.some((priority: TPriority) => id === priority.id);
    doesAlreadyExist
        ? setNotification(`There's already a priority with that name`)
        : add({ id, name}, event.target as HTMLFormElement);
};

const undo = (): void => {
    const previousGroup = groupHistory.pop() as TGroup;
    heading && setContent(heading, previousGroup.name);
    rinseContent(previousGroup);
};

const handleUndo = () => groupHistory.length > 1 ? doAndPreserveFocus(undo) : setNotification('No change to undo');

const sort = () => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    updatedGroup.priorities.sort((current: TPriority, next: TPriority) => current.weight > next.weight ? -1 : 1);
    updateAndPreserveFocus(updatedGroup);
};

export const attachListeners = () => {
    document.addEventListener('click', () => clearNotification());
    heading?.addEventListener('input', updateProjectName);
    document.querySelector('form')?.addEventListener('submit', submitNew);
    document.addEventListener('keydown', (event: KeyboardEvent) => event.metaKey && event.key === 'z' && handleUndo());
    document.getElementById('undo')?.addEventListener('click', handleUndo);
    document.getElementById('sort')?.addEventListener('click', sort);
};