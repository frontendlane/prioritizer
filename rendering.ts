import { HTMLInputRangeElement, TPriority, TGroup, TCrements, TCrement } from './types';
import { deepCloneObject } from './deep-clone.js';
import { isBetween } from './is-between.js';
import { generateIdFromString, findPriority, slim } from './utils.js';
import { group, update, weightFactor } from './index.js';
import { setTooltip } from './event-listeners.js';
import domPath from './dom-path.js';

const priorityList: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;

const deletePriorityAndSlim = (id: string, weightToSlim: number, elementToFocus: HTMLButtonElement) => {
    const smallerGroup: TGroup = deepCloneObject(group) as TGroup;
    smallerGroup.priorities = smallerGroup.priorities.filter((priority: TPriority) => priority.id !== id);
    let groupForUpdate: TGroup = deepCloneObject(smallerGroup) as TGroup;
    for (let i: number = 0; i < weightToSlim; i++) {
        groupForUpdate = slim(groupForUpdate, smallerGroup);
    }
    update(groupForUpdate, elementToFocus);
};

const confirmSlimming = (priority: TPriority, elementToFocus: HTMLButtonElement) => {
    const weightToSlim: number = weightFactor - group.remainingWeight - priority.weight;
    const shouldAutoSlim: boolean = confirm(`"${priority.name}"'s weight is being used on other priorities. To ensure priorities maintain their relative importance you should free up ${weightToSlim} weight from other priorities. Prioritizer can automaticaly remove this weight but this may change relative importance of your priorities. Do you want Prioritizer to automatically free up weight?`);
    shouldAutoSlim
        ? deletePriorityAndSlim(priority.id, weightToSlim, elementToFocus)
        : setTooltip(`You need to free up ${weightToSlim} weights in order to delete "${priority.name}" without Prioritizer (incorectly) automatically freeing up weights for you.`);
};

const deletePriority = (id: string, elementToFocus: HTMLButtonElement) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    updatedGroup.priorities = updatedGroup.priorities.filter((priority: TPriority) => priority.id !== id);        
    update(updatedGroup, elementToFocus);
};

const generateDeleteButton = (priority: TPriority) => {
    const deleteButton: HTMLButtonElement = document.createElement('button');
    deleteButton.textContent = '🗑';
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        const requiresSlimming: boolean = group.remainingWeight + priority.weight < weightFactor;
        requiresSlimming
            ? confirmSlimming(priority, deleteButton)
            : deletePriority(priority.id, deleteButton);
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
    cancelButton.setAttribute('aria-label', `Cancel renaming "${priority.name}"`);
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
    saveButton.setAttribute('aria-label', `Save name change for "${priority.name}"`);
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

const generateRangeInput = (priority: TPriority): HTMLInputRangeElement => {
    const rangeInput: HTMLInputRangeElement = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.id = `${priority.id}-range`;
    rangeInput.name = priority.name;
    rangeInput.value = `${priority.weight}`;
    rangeInput.min = '0';
    rangeInput.max = `${priority.weight + group.remainingWeight}`;
    rangeInput.onchange = () => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = rangeInput.valueAsNumber;
        update(updatedGroup, rangeInput);
    };

    return rangeInput;
};

const generateCrementButton = (priority: TPriority, crement: TCrement): HTMLButtonElement => {
    const crementButton: HTMLButtonElement = document.createElement('button');
    crementButton.append(crement.icon);
    crementButton.setAttribute('aria-label', `${crement.stepAction} "${priority.name}"`);
    crementButton.onclick = () => {
        const newWeight = priority.weight + crement.stepValue;
        if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
            const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
            const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
            updatedPriority.weight = newWeight;
            update(updatedGroup, crementButton);
        }
    };
    return crementButton;
};

const generateOutput = (priority: TPriority): HTMLOutputElement => {
    const output: HTMLOutputElement = document.createElement('output');
    output.textContent = `${priority.weight}`;
    return output;
};

const generateRenameButtonAndLabel = (priority: TPriority) => {
    const renameButton: HTMLButtonElement = document.createElement('button');
    renameButton.textContent = '✏️';
    renameButton.setAttribute('aria-label', `Rename "${priority.name}"`);
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

const renderPriorityBeingEdited = (priority: TPriority, crements: TCrements): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(
        generateDeleteButton(priority),
        generateCancelButton(priority),
        ...generateSaveButtonAndRenameInput(priority),
        generateRangeInput(priority),
        generateCrementButton(priority, crements.decrement),
        generateOutput(priority),
        generateCrementButton(priority, crements.increment)
    );
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};

const renderPriority = (priority: TPriority, crements: TCrements): HTMLLIElement => {
    const priorityItem: HTMLLIElement = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.tabIndex = -1;
    priorityItem.append(
        generateDeleteButton(priority),
        ...generateRenameButtonAndLabel(priority),
        generateRangeInput(priority),
        generateCrementButton(priority, crements.decrement),
        generateOutput(priority),
        generateCrementButton(priority, crements.increment)
    );
    return priorityItem;
};

const renderPriorities = () => {
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
    remainingWeight.textContent = `${group.remainingWeight}`;
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