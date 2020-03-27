import { TGroup, TPriority, SubmitEvent } from './types';
import { Priority } from './Priority.js';
import { deepCloneObject } from './deep-clone.js';
import { generateIdFromString, removeContent, setContent } from './utils.js';
import { group, groupHistory, update, rinseDOM } from './index.js';

const moveCaretTo = (selection: Selection, h1: HTMLHeadingElement, index: number) => {
    const range: Range = document.createRange();
    range.setStart(h1.firstChild || h1, index);

    selection.removeAllRanges();
    selection.addRange(range);
};

const updateProjectName = (event: Event) => {
    const selection: Selection = document.getSelection() as Selection;
    const caretIndex: number = selection.focusOffset;
    const h1: HTMLHeadingElement = event.target as HTMLHeadingElement;
    const projectName: string = h1.textContent as string;
    document.title = `${projectName} priorities`;

    setTimeout(() => {
        h1.innerHTML = projectName;
        moveCaretTo(selection, h1, caretIndex);
    }, 0);
};

const add = ({id, name}: {id: string, name: string}, elementToFocus: HTMLButtonElement | HTMLInputElement, form: HTMLFormElement) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const newPriority: TPriority = new Priority({ id, name });
    updatedGroup.priorities.unshift(newPriority);
    update(updatedGroup, elementToFocus);
    form.reset();
};

const getNotificationBar = () => document.querySelector('[aria-live="polite"][role="status"]') as HTMLParagraphElement;
const clearNotification = (notificationBar = getNotificationBar()) => removeContent(notificationBar);

export const setNotification = (text: string) => {
    const notificationBar = getNotificationBar();
    clearNotification(notificationBar);
    setTimeout(() => setContent(notificationBar, text), 100);
};

const submitNew = (event: Event) => {
    const submitEvent: SubmitEvent = event as SubmitEvent;
    submitEvent.preventDefault();
    const input: HTMLInputElement = document.getElementById('new-priority') as HTMLInputElement;
    const name: string = input.value.trim();
    const id: string = `fel-prioritizer-${generateIdFromString(name)}`;
    const doesAlreadyExist = group.priorities.some((priority: TPriority) => id === priority.id);
    doesAlreadyExist
        ? setNotification(`There's already a priority with that name`)
        : add({ id, name}, submitEvent.explicitOriginalTarget, submitEvent.target as HTMLFormElement);
};

const sort = (event: Event) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    updatedGroup.priorities.sort((current: TPriority, next: TPriority) => current.weight > next.weight ? -1 : 1);
    update(updatedGroup, event.target as HTMLButtonElement);
};

const undo = () => {
    if (groupHistory.length > 1) {
        rinseDOM(groupHistory.pop() as TGroup);
    }
};

export const attachListeners = () => {
    document.addEventListener('click', () => clearNotification());
    document.querySelector('h1')?.addEventListener('input', updateProjectName);
    document.querySelector('form')?.addEventListener('submit', submitNew);
    document.getElementById('undo')?.addEventListener('click', undo);
    document.getElementById('sort')?.addEventListener('click', sort);
};