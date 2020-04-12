import { setContent, findPriority } from './../utils.js';
import { group, updateAndPreserveFocus } from './../index.js';
import { deepCloneObject } from './../deep-clone.js';
export const generateDeleteButton = (priority) => {
    const deleteButton = document.createElement('button');
    setContent(deleteButton, '🗑');
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.dataset.action = 'delete';
    deleteButton.formNoValidate = true;
    return deleteButton;
};
export const generateRenameButton = (priority) => {
    const renameButton = document.createElement('button');
    setContent(renameButton, '✏️');
    renameButton.setAttribute('aria-label', `Rename "${priority.name}"`);
    renameButton.dataset.action = 'rename';
    return renameButton;
};
export const generateLabel = (priority) => {
    const label = document.createElement('label');
    setContent(label, priority.name);
    label.htmlFor = `${priority.id}-range`;
    return label;
};
export const generateRangeInput = (priority) => {
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.id = `${priority.id}-range`;
    rangeInput.name = priority.name;
    rangeInput.value = String(priority.weight);
    rangeInput.min = '0';
    rangeInput.max = String(priority.weight + group.remainingWeight);
    rangeInput.addEventListener('change', () => {
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = rangeInput.valueAsNumber;
        updateAndPreserveFocus(updatedGroup);
    });
    return rangeInput;
};
export const generateCrementButton = (priority, crement) => {
    const crementButton = document.createElement('button');
    crementButton.append(crement.icon);
    crementButton.setAttribute('aria-label', `${crement.stepAction} "${priority.name}"`);
    crementButton.dataset.action = crement.stepAction;
    return crementButton;
};
export const generateOutput = (priority) => {
    const output = document.createElement('output');
    setContent(output, String(priority.weight));
    return output;
};
export const generateCancelButton = (priority) => {
    const cancelButton = document.createElement('button');
    setContent(cancelButton, '❌');
    cancelButton.setAttribute('aria-label', `Cancel renaming "${priority.name}"`);
    cancelButton.dataset.action = 'cancel';
    cancelButton.formNoValidate = true;
    return cancelButton;
};
export const generateSaveButton = (priority) => {
    const saveButton = document.createElement('button');
    setContent(saveButton, '💾');
    saveButton.setAttribute('aria-label', `Save name change for "${priority.name}"`);
    saveButton.dataset.action = 'save';
    return saveButton;
};
const handleRenameInputChange = (renameInput, priority) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.name = renameInput.value;
    updateAndPreserveFocus(updatedGroup);
};
const handleEnter = (event, renameInput) => {
    const form = renameInput.closest('form');
    form === null || form === void 0 ? void 0 : form.requestSubmit(form.querySelector('button:nth-child(3)'));
    event.preventDefault();
};
export const generateRenameInput = (priority) => {
    const renameInput = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = priority.name;
    renameInput.required = true;
    renameInput.addEventListener('keydown', (event) => event.code === 'Enter' && handleEnter(event, renameInput));
    renameInput.addEventListener('input', () => handleRenameInputChange(renameInput, priority));
    return renameInput;
};
