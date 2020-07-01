import { TPriority, TGroup, HTMLInputRangeElement, TCrement } from './../types';
import { setContent, findPriority } from './../utils.js';
import { group, updateAndPreserveFocus } from './../index.js';
import { deepCloneObject } from './../deep-clone.js';

export const generateDeleteButton = (priority: TPriority): HTMLButtonElement => {
    const deleteButton: HTMLButtonElement = document.createElement('button');
    setContent(deleteButton, '🗑');
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.dataset.action = 'delete';
    deleteButton.formNoValidate = true;
    return deleteButton;
};

export const generateRenameButton = (priority: TPriority): HTMLButtonElement => {
    const renameButton: HTMLButtonElement = document.createElement('button');
    setContent(renameButton, '✏️');
    renameButton.setAttribute('aria-label', `Rename "${priority.name}"`);
    renameButton.dataset.action = 'rename';
    return renameButton;
};

export const generateLabel = (priority: TPriority): HTMLLabelElement => {
    const label: HTMLLabelElement = document.createElement('label');
    setContent(label, priority.name);
    label.htmlFor = `${priority.id}-range`;
    return label;
};

export const generateRangeInput = (priority: TPriority): HTMLInputRangeElement => {
    const rangeInput: HTMLInputRangeElement = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.id = `${priority.id}-range`;
    rangeInput.name = priority.name;
    rangeInput.setAttribute('value', String(priority.weight));
    rangeInput.min = '0';
    rangeInput.max = String(priority.weight + group.remainingWeight);
    rangeInput.addEventListener('change', () => {
        const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
        const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = rangeInput.valueAsNumber;
        updateAndPreserveFocus(updatedGroup);
    });
    return rangeInput;
};

export const generateCrementButton = (priority: TPriority, crement: TCrement): HTMLButtonElement => {
    const crementButton: HTMLButtonElement = document.createElement('button');
    crementButton.append(crement.icon);
    crementButton.setAttribute('aria-label', `${crement.stepAction} "${priority.name}"`);
    crementButton.dataset.action = crement.stepAction;
    return crementButton;
};

export const generateOutput = (priority: TPriority): HTMLOutputElement => {
    const output: HTMLOutputElement = document.createElement('output');
    setContent(output, String(priority.weight));
    return output;
};

export const generateCancelButton = (priority: TPriority): HTMLButtonElement => {
    const cancelButton: HTMLButtonElement = document.createElement('button');
    setContent(cancelButton, '❌');
    cancelButton.setAttribute('aria-label', `Cancel renaming "${priority.name}"`);
    cancelButton.dataset.action = 'cancel';
    cancelButton.formNoValidate = true;
    return cancelButton;
};

export const generateSaveButton = (priority: TPriority): HTMLButtonElement => {
    const saveButton: HTMLButtonElement = document.createElement('button');
    setContent(saveButton, '💾');
    saveButton.setAttribute('aria-label', `Save name change for "${priority.name}"`);
    saveButton.dataset.action = 'save';
    return saveButton;
};

const handleRenameInputChange = (renameInput: HTMLInputElement, priority: TPriority): void => {
    const updatedGroup: TGroup = deepCloneObject(group) as TGroup;
    const updatedPriority: TPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.name = renameInput.value;
    updateAndPreserveFocus(updatedGroup);
};

const handleEnter = (event: KeyboardEvent, renameInput: HTMLInputElement): void => {
    const form: HTMLFormElement | null = renameInput.closest('form');
    form?.requestSubmit(form.querySelector('button:nth-child(3)'));
    event.preventDefault();
};

export const generateRenameInput = (priority: TPriority): HTMLInputElement => {
    const renameInput: HTMLInputElement = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = priority.name;
    renameInput.required = true;
    renameInput.addEventListener('keydown', (event: KeyboardEvent) => event.code === 'Enter' && handleEnter(event, renameInput));
    renameInput.addEventListener('input', () => handleRenameInputChange(renameInput, priority));
    return renameInput;
};