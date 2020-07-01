import { generateDeleteButton, generateCancelButton, generateSaveButton, generateRenameInput, generateRangeInput, generateCrementButton, generateOutput, generateRenameButton, generateLabel } from './rendering/form-elements.js';
import { setContent, removeContent } from './utils.js';
import { group } from './index.js';
import { handleAction, handleCancel } from './rendering/submit-action-handler.js';
export const priorityList = document.querySelector('ul');
const generateEditPriorityForm = (priority, crements) => {
    const form = document.createElement('form');
    form.append(generateDeleteButton(priority), generateCancelButton(priority), generateSaveButton(priority), generateRenameInput(priority), generateRangeInput(priority), generateCrementButton(priority, crements.decrement), generateOutput(priority), generateCrementButton(priority, crements.increment));
    form.addEventListener('keydown', (event) => event.code === 'Escape' && handleCancel(priority));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAction(event, priority, form, crements);
    });
    return form;
};
const renderPriorityBeingEdited = (priority, crements) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generateEditPriorityForm(priority, crements));
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};
const generatePriorityForm = (priority, crements) => {
    const form = document.createElement('form');
    form.append(generateDeleteButton(priority), generateRenameButton(priority), generateLabel(priority), generateRangeInput(priority), generateCrementButton(priority, crements.decrement), generateOutput(priority), generateCrementButton(priority, crements.increment));
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        handleAction(event, priority, form, crements);
    });
    return form;
};
const renderPriority = (priority, crements) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generatePriorityForm(priority, crements));
    return priorityItem;
};
const renderPriorities = () => {
    const crements = {
        decrement: { icon: '⊖', stepAction: 'Decrement', stepValue: -1 },
        increment: { icon: '⊕', stepAction: 'Increment', stepValue: 1 }
    };
    const prioritiesToRender = group.priorities.map((priority) => priority.isBeingEdited
        ? renderPriorityBeingEdited(priority, crements)
        : renderPriority(priority, crements));
    priorityList.append(...prioritiesToRender);
    const remainingWeight = document.getElementById('remaining-weight');
    setContent(remainingWeight, String(group.remainingWeight));
};
const setMinWidth = () => {
    const labels = [...priorityList.querySelectorAll('li > form > label')];
    const longestLabelLength = labels
        .map((element) => +getComputedStyle(element).width.split('px')[0])
        .reduce((current, next) => current > next ? current : next, 0) + 'px';
    labels.forEach((label) => label.style.minWidth = longestLabelLength);
    const inputs = [...priorityList.querySelectorAll('li > form > input[type="text"]')];
    inputs.forEach((input) => input.style.minWidth = longestLabelLength);
};
export const unrender = () => {
    priorityList.classList.remove('in-edit-mode');
    removeContent(priorityList);
};
export const render = () => {
    renderPriorities();
    setMinWidth();
};
