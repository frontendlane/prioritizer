import { deepCloneObject } from './deep-clone.js';
import { isBetween } from './is-between.js';
import { generateIdFromString, findPriority, slim } from './utils.js';
import { group, update, weightFactor } from './index.js';
import { setTooltip } from './event-listeners.js';
import domPath from './dom-path.js';
const priorityList = document.querySelector('ul');
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
        : setTooltip(`You need to free up ${weightToSlim} weights in order to delete "${priority.name}" without Prioritizer (incorectly) automatically freeing up weights for you.`);
};
const deletePriority = (id, elementToFocus) => {
    const updatedGroup = deepCloneObject(group);
    updatedGroup.priorities = updatedGroup.priorities.filter((priority) => priority.id !== id);
    update(updatedGroup, elementToFocus);
};
const generateDeleteButton = (id) => {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '🗑';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = () => {
        const priority = group.priorities.find((priority) => priority.id === id);
        const requiresSlimming = group.remainingWeight + priority.weight < weightFactor;
        requiresSlimming
            ? confirmSlimming(priority, deleteButton)
            : deletePriority(id, deleteButton);
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
    cancelButton.textContent = '❌';
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
    saveButton.textContent = '💾';
    saveButton.classList.add('save-button');
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
const generateRange = (priority) => {
    const range = document.createElement('input');
    range.type = 'range';
    range.id = `${priority.id}-range`;
    range.name = priority.name;
    range.value = `${priority.weight}`;
    range.min = '0';
    range.max = `${priority.weight + group.remainingWeight}`;
    range.onchange = () => {
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.weight = range.valueAsNumber;
        update(updatedGroup, range);
    };
    return range;
};
const generateCrement = (priority, props) => {
    const crement = document.createElement('button');
    crement.textContent = props.text;
    crement.onclick = () => {
        const newWeight = priority.weight + props.value;
        if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
            const updatedGroup = deepCloneObject(group);
            const updatedPriority = findPriority(updatedGroup, priority.id);
            updatedPriority.weight = newWeight;
            update(updatedGroup, crement);
        }
    };
    return crement;
};
const generateOutput = (priority) => {
    const output = document.createElement('output');
    output.textContent = `${priority.weight}`;
    return output;
};
const generateRenameButtonAndLabel = (priority) => {
    const renameButton = document.createElement('button');
    renameButton.textContent = '✏️';
    renameButton.classList.add('rename-button');
    renameButton.onclick = (event) => {
        const updatedGroup = deepCloneObject(group);
        const updatedPriority = findPriority(updatedGroup, priority.id);
        updatedPriority.isBeingEdited = true;
        const container = event.target.closest('li');
        const elementToFocus = domPath(container).toCSS() + ' > input[type="text"]';
        update(updatedGroup, elementToFocus);
    };
    const label = document.createElement('label');
    label.textContent = priority.name;
    label.htmlFor = `${priority.id}-range`;
    return [renameButton, label];
};
const renderPriorities = () => {
    const prioritiesToRender = group.priorities.map((priority) => priority.isBeingEdited
        ? renderPriorityBeingEdited(priority)
        : renderPriority(priority));
    priorityList.append(...prioritiesToRender);
    const remainingWeight = document.getElementById('remaining-weight');
    remainingWeight.textContent = `${group.remainingWeight}`;
};
const renderPriorityBeingEdited = (priority) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.append(generateDeleteButton(priority.id), generateCancelButton(priority), ...generateSaveButtonAndRenameInput(priority), generateRange(priority), generateCrement(priority, { text: '⊖', value: -1 }), generateOutput(priority), generateCrement(priority, { text: '⊕', value: 1 }));
    priorityItem.classList.add('being-edited');
    priorityList.classList.add('in-edit-mode');
    return priorityItem;
};
const renderPriority = (priority) => {
    const priorityItem = document.createElement('li');
    priorityItem.id = priority.id;
    priorityItem.tabIndex = -1;
    priorityItem.append(generateDeleteButton(priority.id), ...generateRenameButtonAndLabel(priority), generateRange(priority), generateCrement(priority, { text: '⊖', value: -1 }), generateOutput(priority), generateCrement(priority, { text: '⊕', value: 1 }));
    return priorityItem;
};
const setMinWidth = () => {
    const labels = [...priorityList.querySelectorAll('li:not(:first-child) > label')];
    const longestLabelLength = labels
        .map((element) => +window.getComputedStyle(element).width.split('px')[0])
        .reduce((current, next) => current > next ? current : next, 0) + 'px';
    labels.forEach((label) => label.style.minWidth = longestLabelLength);
    const inputs = [...priorityList.querySelectorAll('li:not(:first-child) > input')];
    inputs.forEach((input) => input.style.minWidth = longestLabelLength);
};
export const unrender = () => {
    priorityList.classList.remove('in-edit-mode');
    const renderedPriorities = [...priorityList.querySelectorAll('li:not(:first-child)')];
    renderedPriorities.forEach((priority) => priority.remove());
};
export const render = () => {
    renderPriorities();
    setMinWidth();
};
