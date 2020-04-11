import { HTMLInputRangeElement, TPriority, TGroup, TCrements, TCrement } from './types';
import { deepCloneObject } from './deep-clone.js';
import { isBetween } from './is-between.js';
import { generateIdFromString, findPriority, slim, setContent } from './utils.js';
import { group, weightFactor, updateAndPreserveFocus, updateAndRewindFocus, updateAndDirectFocus } from './index.js';
import { setNotification } from './event-listeners.js';
import { cssPath } from './css-path.js';

export const priorityList: HTMLUListElement = document.querySelector('ul') as HTMLUListElement;

const deletePriorityAndSlim = (id: string, weightToSlim: number) => {
    const groupWithoutDeletedPriority: TGroup = deepCloneObject(group) as TGroup;
    groupWithoutDeletedPriority.priorities = groupWithoutDeletedPriority.priorities.filter((priority: TPriority) => priority.id !== id);
    let groupForUpdate: TGroup = deepCloneObject(groupWithoutDeletedPriority) as TGroup;
    for (let i: number = 0; i < weightToSlim; i++) {
        groupForUpdate = slim(groupForUpdate, groupWithoutDeletedPriority);
    }

    updateAndRewindFocus(groupForUpdate);
};

const confirmSlimming = (priority: TPriority) => {
    const weightToSlim: number = weightFactor - group.remainingWeight - priority.weight;
    const shouldAutoSlim: boolean = confirm(`"${priority.name}"'s weight is being used on other priorities. To ensure priorities maintain their relative importance you should free up ${weightToSlim} weight from other priorities. Prioritizer can automaticaly remove this weight but this may change relative importance of your priorities. Do you want Prioritizer to automatically free up weight?`);
    shouldAutoSlim
        ? deletePriorityAndSlim(priority.id, weightToSlim)
        : setNotification(`You need to free up ${weightToSlim} weights in order to delete "${priority.name}" without Prioritizer (incorectly) automatically freeing up weights for you.`);
};

const deletePriority = (id: string) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    updatedGroup.priorities = updatedGroup.priorities.filter((priority: TPriority) => priority.id !== id);        

    updateAndRewindFocus(updatedGroup);
};

const generateDeleteButton = (priority: TPriority) => {
    const deleteButton: HTMLButtonElement = document.createElement('button');
    setContent(deleteButton, '🗑');
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.onclick = () => {
        const requiresSlimming: boolean = group.remainingWeight + priority.weight < weightFactor;
        requiresSlimming
            ? confirmSlimming(priority)
            : deletePriority(priority.id);
    };
    return deleteButton;
};

const cancel = (priority: TPriority) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.isBeingEdited = false;

    updateAndRewindFocus(updatedGroup);
};

const generateCancelButton = (priority: TPriority): HTMLButtonElement => {
    const cancelButton: HTMLButtonElement = document.createElement('button');
    setContent(cancelButton, '❌');
    cancelButton.setAttribute('aria-label', `Cancel renaming "${priority.name}"`);
    cancelButton.onclick = () => cancel(priority);
    return cancelButton;
};

const generateRenameInput = (priority: TPriority): HTMLInputElement => {
    const renameInput: HTMLInputElement = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = priority.name;
    renameInput.onkeyup = event => {
        if (event.code === 'Escape') {
            cancel(priority);
        } else {
            // TODO: update the name in the database
        }
    };
    return renameInput;
};

const generateSaveButtonAndRenameInput = (priority: TPriority): [HTMLButtonElement, HTMLInputElement] => {
    const renameInput: HTMLInputElement = generateRenameInput(priority);

    const saveButton: HTMLButtonElement = document.createElement('button');
    setContent(saveButton, '💾');
    saveButton.setAttribute('aria-label', `Save name change for "${priority.name}"`);
    saveButton.onclick = (event: MouseEvent) => {
        const value: string = renameInput.value.trim();

        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.name = value;
        updatedPriority.id = generateIdFromString(value);
        updatedPriority.isBeingEdited = false;

        const container: HTMLLIElement | null = (event.target as HTMLButtonElement).closest('li');
        const cssSelector: string | null = container && `${cssPath(container, false)} > button:nth-child(2)`;
        updateAndDirectFocus(updatedGroup, cssSelector);
    };

    return [saveButton, renameInput];
};

const generateRangeInput = (priority: TPriority): HTMLInputRangeElement => {
    const rangeInput: HTMLInputRangeElement = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.id = `${priority.id}-range`;
    rangeInput.name = priority.name;
    rangeInput.value = String(priority.weight);
    rangeInput.min = '0';
    rangeInput.max = String(priority.weight + group.remainingWeight);
    rangeInput.onchange = () => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = rangeInput.valueAsNumber;

        updateAndPreserveFocus(updatedGroup);
    };

    return rangeInput;
};

const crementPriority = (priority: TPriority, newWeight: number) => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.weight = newWeight;

    updateAndPreserveFocus(updatedGroup);
};

const generateCrementButton = (priority: TPriority, crement: TCrement): HTMLButtonElement => {
    const crementButton: HTMLButtonElement = document.createElement('button');
    crementButton.append(crement.icon);
    crementButton.setAttribute('aria-label', `${crement.stepAction} "${priority.name}"`);
    crementButton.onclick = () => {
        const newWeight: number = priority.weight + crement.stepValue;
        if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
            crementPriority(priority, newWeight);
        }
    };
    return crementButton;
};

const generateOutput = (priority: TPriority): HTMLOutputElement => {
    const output: HTMLOutputElement = document.createElement('output');
    setContent(output, String(priority.weight));
    return output;
};

const generateRenameButtonAndLabel = (priority: TPriority) => {
    const renameButton: HTMLButtonElement = document.createElement('button');
    setContent(renameButton, '✏️');
    renameButton.setAttribute('aria-label', `Rename "${priority.name}"`);
    renameButton.onclick = (event: MouseEvent) => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.isBeingEdited = true;

        const container: HTMLLIElement | null = (event.target as HTMLButtonElement).closest('li');
        const cssSelector: string | null = container && `${cssPath(container)} > input[type="text"]`;
        updateAndDirectFocus(updatedGroup, cssSelector);
    };

    const label: HTMLLabelElement = document.createElement('label');
    setContent(label, priority.name);
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
    setContent(remainingWeight, String(group.remainingWeight));
};

const setMinWidth = () => {
    const labels: HTMLLabelElement[] = [...priorityList.querySelectorAll('li > label')] as HTMLLabelElement[];
    const longestLabelLength: string = labels
        .map((element: HTMLLabelElement): number => +getComputedStyle(element).width.split('px')[0])
        .reduce((current: number, next: number) => current > next ? current : next, 0) + 'px'
    labels.forEach((label: HTMLLabelElement) => label.style.minWidth = longestLabelLength);
    
    const inputs: HTMLInputElement[] = [...priorityList.querySelectorAll('li > input[type="text"]')] as HTMLInputElement[];
    inputs.forEach((input: HTMLInputElement) => input.style.minWidth = longestLabelLength);
};

export const unrender = () => {
    priorityList.classList.remove('in-edit-mode');
    const renderedPriorities: HTMLLIElement[] = [...priorityList.querySelectorAll('li')] as HTMLLIElement[];
    renderedPriorities.forEach((priority: HTMLLIElement) => priority.remove());
};

export const render = () => {
    renderPriorities();
    setMinWidth();
};