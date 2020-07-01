import { TPriority, TCrements, SubmitEvent } from './types';
import { generateDeleteButton, generateCancelButton, generateSaveButton, generateRenameInput, generateRangeInput, generateCrementButton, generateOutput, generateRenameButton, generateLabel } from './rendering/form-elements.js';
import { setContent, removeContent } from './utils.js';
import { group } from './index.js';
import { handleAction, handleCancel } from './rendering/submit-action-handler.js';

export const priorityList: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;

const generateEditPriorityForm = (priority: TPriority, crements: TCrements): HTMLFormElement => {
    const form: HTMLFormElement = document.createElement('form');
    form.append(
        generateDeleteButton(priority),
        generateCancelButton(priority),
        generateSaveButton(priority),
        generateRenameInput(priority),
        generateRangeInput(priority),
        generateCrementButton(priority, crements.decrement),
        generateOutput(priority),
        generateCrementButton(priority, crements.increment)
    );
    form.addEventListener('keydown', (event: KeyboardEvent) => event.code === 'Escape' && handleCancel(priority));
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        handleAction(event as SubmitEvent, priority, form, crements);
    });
    return form;
};

const renderPriorityBeingEdited = (priority: TPriority, crements: TCrements): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generateEditPriorityForm(priority, crements));
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};

const generatePriorityForm = (priority: TPriority, crements: TCrements): HTMLFormElement => {
    const form: HTMLFormElement = document.createElement('form');
    form.append(
        generateDeleteButton(priority),
        generateRenameButton(priority),
        generateLabel(priority),
        generateRangeInput(priority),
        generateCrementButton(priority, crements.decrement),
        generateOutput(priority),
        generateCrementButton(priority, crements.increment)
    );
    form.addEventListener('submit', (event: Event) => {
        event.preventDefault();
        handleAction(event as SubmitEvent, priority, form, crements);
    });
    return form;
};

const renderPriority = (priority: TPriority, crements: TCrements): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generatePriorityForm(priority, crements));
    return priorityItem;
};

const renderPriorities = (): void => {
    const crements: TCrements = {
        decrement: { icon: '⊖', stepAction: 'Decrement', stepValue: -1 },
        increment: { icon: '⊕', stepAction: 'Increment', stepValue: 1 }
    };
    const prioritiesToRender: HTMLLIElement[] = group.priorities.map((priority: TPriority): HTMLLIElement =>
        priority.isBeingEdited
            ? renderPriorityBeingEdited(priority, crements)
            : renderPriority(priority, crements)
    );
    priorityList.append(...prioritiesToRender);
    const remainingWeight: HTMLOutputElement = document.getElementById('remaining-weight') as HTMLOutputElement;
    setContent(remainingWeight, String(group.remainingWeight));
};

const setMinWidth = (): void => {
    const labels: HTMLLabelElement[] = [...priorityList.querySelectorAll('li > form > label')] as HTMLLabelElement[];
    const longestLabelLength: string = labels
        .map((element: HTMLLabelElement): number => +getComputedStyle(element).width.split('px')[0])
        .reduce((current: number, next: number) => current > next ? current : next, 0) + 'px'
    labels.forEach((label: HTMLLabelElement) => label.style.minWidth = longestLabelLength);
    const inputs: HTMLInputElement[] = [...priorityList.querySelectorAll('li > form > input[type="text"]')] as HTMLInputElement[];
    inputs.forEach((input: HTMLInputElement) => input.style.minWidth = longestLabelLength);
};

export const unrender = (): void => {
    priorityList.classList.remove('in-edit-mode');
    removeContent(priorityList);
};

export const render = (): void => {
    renderPriorities();
    setMinWidth();
};