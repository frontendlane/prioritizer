import { deepCloneObject } from './deep-clone.js';
import { isBetween } from './is-between.js';
import { generateIdFromString, findPriority, slim, setContent } from './utils.js';
import { group, update, weightFactor } from './index.js';
import { setNotification } from './event-listeners.js';
import { cssPath } from './css-path.js';
export const priorityList = document.querySelector('ul');
const deletePriorityAndSlim = (id, weightToSlim, elementToFocus) => {
    const smallerGroup = deepCloneObject(group);
    smallerGroup.priorities = smallerGroup.priorities.filter((priority) => priority.id !== id);
    let groupForUpdate = deepCloneObject(smallerGroup);
    for (let i = 0; i < weightToSlim; i++) {
        groupForUpdate = slim(groupForUpdate, smallerGroup);
    }
    update(groupForUpdate, elementToFocus);
};
const confirmSlimming = (priority, elementToFocus) => {
    const weightToSlim = weightFactor - group.remainingWeight - priority.weight;
    const shouldAutoSlim = confirm(`"${priority.name}"'s weight is being used on other priorities. To ensure priorities maintain their relative importance you should free up ${weightToSlim} weight from other priorities. Prioritizer can automaticaly remove this weight but this may change relative importance of your priorities. Do you want Prioritizer to automatically free up weight?`);
    shouldAutoSlim
        ? deletePriorityAndSlim(priority.id, weightToSlim, elementToFocus)
        : setNotification(`You need to free up ${weightToSlim} weights in order to delete "${priority.name}" without Prioritizer (incorectly) automatically freeing up weights for you.`);
};
const deletePriority = (id, elementToFocus) => {
    const updatedGroup = deepCloneObject(group);
    updatedGroup.priorities = updatedGroup.priorities.filter((priority) => priority.id !== id);
    update(updatedGroup, elementToFocus);
};
const generateDeleteButton = (priority) => {
    const deleteButton = document.createElement('button');
    setContent(deleteButton, '🗑');
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.onclick = () => {
        const requiresSlimming = group.remainingWeight + priority.weight < weightFactor;
        requiresSlimming
            ? confirmSlimming(priority, deleteButton)
            : deletePriority(priority.id, deleteButton);
    };
    return deleteButton;
};
const cancel = (priority, elementToFocus) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.isBeingEdited = false;
    update(updatedGroup, elementToFocus);
};
const generateCancelButton = (priority) => {
    const cancelButton = document.createElement('button');
    setContent(cancelButton, '❌');
    cancelButton.setAttribute('aria-label', `Cancel renaming "${priority.name}"`);
    cancelButton.onclick = () => cancel(priority, cancelButton);
    return cancelButton;
};
const generateRenameInput = (priority) => {
    const renameInput = document.createElement('input');
    renameInput.type = 'text';
    renameInput.value = priority.name;
    renameInput.onkeyup = event => {
        if (event.code === 'Escape') {
            cancel(priority, renameInput);
        }
    };
    return renameInput;
};
const generateSaveButtonAndRenameInput = (priority) => {
    const renameInput = generateRenameInput(priority);
    const saveButton = document.createElement('button');
    setContent(saveButton, '💾');
    saveButton.setAttribute('aria-label', `Save name change for "${priority.name}"`);
    saveButton.onclick = () => {
        const value = renameInput.value.trim();
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.name = value;
        updatedPriority.id = generateIdFromString(value);
        updatedPriority.isBeingEdited = false;
        update(updatedGroup, saveButton);
    };
    return [saveButton, renameInput];
};
const generateRangeInput = (priority) => {
    const rangeInput = document.createElement('input');
    rangeInput.type = 'range';
    rangeInput.id = `${priority.id}-range`;
    rangeInput.name = priority.name;
    rangeInput.value = String(priority.weight);
    rangeInput.min = '0';
    rangeInput.max = String(priority.weight + group.remainingWeight);
    rangeInput.onchange = () => {
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = rangeInput.valueAsNumber;
        update(updatedGroup, rangeInput);
    };
    return rangeInput;
};
const generateCrementButton = (priority, crement) => {
    const crementButton = document.createElement('button');
    crementButton.append(crement.icon);
    crementButton.setAttribute('aria-label', `${crement.stepAction} "${priority.name}"`);
    crementButton.onclick = () => {
        const newWeight = priority.weight + crement.stepValue;
        if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
            const updatedGroup = deepCloneObject(group);
            const updatedPriority = findPriority(updatedGroup, priority.id);
            updatedPriority.weight = newWeight;
            update(updatedGroup, crementButton);
        }
    };
    return crementButton;
};
const generateOutput = (priority) => {
    const output = document.createElement('output');
    setContent(output, String(priority.weight));
    return output;
};
const generateRenameButtonAndLabel = (priority) => {
    const renameButton = document.createElement('button');
    setContent(renameButton, '✏️');
    renameButton.setAttribute('aria-label', `Rename "${priority.name}"`);
    renameButton.onclick = (event) => {
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.isBeingEdited = true;
        const container = event.target.closest('li');
        const elementToFocus = `${cssPath(container)} > input[type="text"]`;
        update(updatedGroup, elementToFocus);
    };
    const label = document.createElement('label');
    setContent(label, priority.name);
    label.htmlFor = `${priority.id}-range`;
    return [renameButton, label];
};
const renderPriorityBeingEdited = (priority, crements) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generateDeleteButton(priority), generateCancelButton(priority), ...generateSaveButtonAndRenameInput(priority), generateRangeInput(priority), generateCrementButton(priority, crements.decrement), generateOutput(priority), generateCrementButton(priority, crements.increment));
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};
const renderPriority = (priority, crements) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.tabIndex = -1;
    priorityItem.append(generateDeleteButton(priority), ...generateRenameButtonAndLabel(priority), generateRangeInput(priority), generateCrementButton(priority, crements.decrement), generateOutput(priority), generateCrementButton(priority, crements.increment));
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
    const labels = [...priorityList.querySelectorAll('li > label')];
    const longestLabelLength = labels
        .map((element) => +getComputedStyle(element).width.split('px')[0])
        .reduce((current, next) => current > next ? current : next, 0) + 'px';
    labels.forEach((label) => label.style.minWidth = longestLabelLength);
    const inputs = [...priorityList.querySelectorAll('li > input')];
    inputs.forEach((input) => input.style.minWidth = longestLabelLength);
};
export const unrender = () => {
    priorityList.classList.remove('in-edit-mode');
    const renderedPriorities = [...priorityList.querySelectorAll('li')];
    renderedPriorities.forEach((priority) => priority.remove());
};
export const render = () => {
    renderPriorities();
    setMinWidth();
};
