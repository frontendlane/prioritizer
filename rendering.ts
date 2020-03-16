import { HTMLInputRangeElement, TPriority, TGroup } from './types';
import { deepCloneObject } from './deep-clone.js';
import { isBetween } from './is-between.js';
import { generateIdFromString } from './utils.js';
import { group, update } from './index.js';
import domPath from './dom-path.js';

const priorityList: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;

const findPriority = (group: TGroup, id: string): TPriority =>
    group.priorities.find((priority: TPriority) => priority.id === id) as TPriority;

const generateDeleteButton = (id: string) => {
    const deleteButton: HTMLButtonElement = document.createElement('button');
    deleteButton.textContent = '🗑';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        updatedGroup.priorities = updatedGroup.priorities.filter((priority: TPriority) => priority.id !== id);
        update(updatedGroup, deleteButton);
    };
    return deleteButton;
};

const cancel = (priority: TPriority, elementToFocus: HTMLElement) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.isBeingEdited = false;
    update(updatedGroup, elementToFocus);
};

const generateCancelButton = (priority: TPriority): HTMLButtonElement => {
    const cancelButton: HTMLButtonElement = document.createElement('button');
    cancelButton.textContent = '❌';
    cancelButton.onclick = () => cancel(priority, cancelButton);
    return cancelButton;
};

const generateRenameInput = (priority: TPriority): HTMLInputElement => {
    const renameInput: HTMLInputElement = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = priority.name;
    renameInput.onkeyup = event => {
        if (event.code === 'Escape') {
            cancel(priority, renameInput);
        }
    };
    return renameInput;
};

const generateSaveButtonAndRenameInput = (priority: TPriority): [HTMLButtonElement, HTMLInputElement] => {
    const renameInput: HTMLInputElement = generateRenameInput(priority);

    const saveButton: HTMLButtonElement = document.createElement('button');
    saveButton.textContent = '💾';
    saveButton.classList.add('save-button');
    saveButton.onclick = () => {
        const value: string = renameInput.value.trim();

        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.name = value;
        updatedPriority.id = generateIdFromString(value);
        updatedPriority.isBeingEdited = false;
        update(updatedGroup, saveButton);
    };

    return [saveButton, renameInput];
};

const generateRange = (priority: TPriority): HTMLInputRangeElement => {
    const range: HTMLInputRangeElement = document.createElement('input');
    range.type = 'range';
    range.id = `${priority.id}-range`;
    range.name = priority.name;
    range.value = `${priority.weight}`;
    range.min = '0';
    range.max = `${priority.weight + group.remainingWeight}`;
    range.onchange = () => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = range.valueAsNumber;
        update(updatedGroup, range);
    };

    return range;
};

const generateCrement = (priority: TPriority, props: { text: string, value: number }): HTMLButtonElement => {
    const crement: HTMLButtonElement = document.createElement('button');
    crement.textContent = props.text;
    crement.onclick = () => {
        const newWeight = priority.weight + props.value;
        if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
            const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
            const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
            updatedPriority.weight = newWeight;
            update(updatedGroup, crement);
        }
    };
    return crement;
};

const generateOutput = (priority: TPriority): HTMLOutputElement => {
    const output: HTMLOutputElement = document.createElement('output');
    output.textContent = `${priority.weight}`;
    return output;
};

const generateRenameButtonAndLabel = (priority: TPriority) => {
    const renameButton: HTMLButtonElement = document.createElement('button');
    renameButton.textContent = '✏️';
    renameButton.classList.add('rename-button');
    renameButton.onclick = (event: Event) => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.isBeingEdited = true;
        const container: HTMLLIElement = (event.target as HTMLButtonElement).closest('li') as HTMLLIElement;
        const elementToFocus: string = domPath(container).toCSS() + ' > input[type="text"]';
        update(updatedGroup, elementToFocus);
    };

    const label: HTMLLabelElement = document.createElement('label');
    label.textContent = priority.name;
    label.htmlFor = `${priority.id}-range`;

    return [renameButton, label];
};

const renderPriorities = () => {
    const prioritiesToRender: HTMLLIElement[] = group.priorities.map((priority: TPriority): HTMLLIElement =>
        priority.isBeingEdited
            ? renderPriorityBeingEdited(priority)
            : renderPriority(priority)
    );

    priorityList.append(...prioritiesToRender);
    const remainingWeight: HTMLOutputElement = document.getElementById('remaining-weight') as HTMLOutputElement;
    remainingWeight.textContent = `${group.remainingWeight}`;
};

const renderPriorityBeingEdited = (priority: TPriority): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(
        generateDeleteButton(priority.id),
        generateCancelButton(priority),
        ...generateSaveButtonAndRenameInput(priority),
        generateRange(priority),
        generateCrement(priority, { text: '⊖', value: -1 }),
        generateOutput(priority),
        generateCrement(priority, { text: '⊕', value: 1 })
    );
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};

const renderPriority = (priority: TPriority): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.tabIndex = -1;
    priorityItem.append(
        generateDeleteButton(priority.id),
        ...generateRenameButtonAndLabel(priority),
        generateRange(priority),
        generateCrement(priority, { text: '⊖', value: -1 }),
        generateOutput(priority),
        generateCrement(priority, { text: '⊕', value: 1 })
    );
    return priorityItem;
};

const setMinWidth = () => {
    const labels: HTMLLabelElement[] = [...priorityList.querySelectorAll('li:not(:first-child) > label')] as HTMLLabelElement[];
    const longestLabelLength: string = labels
        .map((element: HTMLLabelElement): number => +window.getComputedStyle(element).width.split('px')[0])
        .reduce((current: number, next: number) => current > next ? current : next, 0) + 'px'
    labels.forEach((label: HTMLLabelElement) => label.style.minWidth = longestLabelLength);
    
    const inputs: HTMLInputElement[] = [...priorityList.querySelectorAll('li:not(:first-child) > input')] as HTMLInputElement[];
    inputs.forEach((input: HTMLInputElement) => input.style.minWidth = longestLabelLength);
};

export const unrender = () => {
    priorityList.classList.remove('in-edit-mode');
    const renderedPriorities: HTMLLIElement[] = [...priorityList.querySelectorAll('li:not(:first-child)')] as HTMLLIElement[];
    renderedPriorities.forEach((priority: HTMLLIElement) => priority.remove());
};

export const render = () => {
    renderPriorities();
    setMinWidth();
};