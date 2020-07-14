import { deepCloneObject } from './../deep-clone.js';
import { isBetween } from './../is-between.js';
import { generateIdFromString, findPriority, slim } from './../utils.js';
import { group, weightFactor, updateAndPreserveFocus, updateAndRewindFocus, updateAndDirectFocus } from './../index.js';
import { setNotification } from './../event-listeners.js';
import { cssPath } from './../css-path.js';
const deletePriorityAndSlim = (id, weightToSlim) => {
    const groupWithoutDeletedPriority = deepCloneObject(group);
    groupWithoutDeletedPriority.priorities = groupWithoutDeletedPriority.priorities.filter((priority) => priority.id !== id);
    let groupForUpdate = deepCloneObject(groupWithoutDeletedPriority);
    for (let i = 0; i < weightToSlim; i++) {
        groupForUpdate = slim(groupForUpdate, groupWithoutDeletedPriority);
    }
    updateAndRewindFocus(groupForUpdate);
};
const confirmSlimming = (priority) => {
    const weightToSlim = weightFactor - group.remainingWeight - priority.weight;
    const shouldAutoSlim = confirm(`"${priority.name}"'s weight is being used on other priorities. To ensure priorities maintain their relative importance you should free up ${weightToSlim} weight from other priorities. Prioritizer can automaticaly remove this weight but this may change relative importance of your priorities. Do you want Prioritizer to automatically free up weight?`);
    shouldAutoSlim
        ? deletePriorityAndSlim(priority.id, weightToSlim)
        : setNotification(`You need to free up ${weightToSlim} weights in order to delete "${priority.name}" without Prioritizer (possibly incorectly) automatically freeing up weights for you.`);
};
const deletePriority = (id) => {
    const updatedGroup = deepCloneObject(group);
    updatedGroup.priorities = updatedGroup.priorities.filter((priority) => priority.id !== id);
    updateAndRewindFocus(updatedGroup);
};
export const handleCancel = (priority) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.name = updatedPriority.previousSavedName;
    updatedPriority.isBeingEdited = false;
    updateAndRewindFocus(updatedGroup);
};
const handleDelete = (priority) => {
    const requiresSlimming = group.remainingWeight + priority.weight < weightFactor;
    requiresSlimming
        ? confirmSlimming(priority)
        : deletePriority(priority.id);
};
const handleRename = (priority, form) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.isBeingEdited = true;
    const cssSelector = form && `${cssPath(form)} > input[type="text"]`;
    updateAndDirectFocus(updatedGroup, cssSelector);
};
const handleSave = (priority, form) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.name = updatedPriority.name.trim();
    updatedPriority.previousSavedName = updatedPriority.name;
    updatedPriority.id = generateIdFromString(updatedPriority.name);
    updatedPriority.isBeingEdited = false;
    const cssSelector = form && `${cssPath(form, false)} > button:nth-child(2)`;
    updateAndDirectFocus(updatedGroup, cssSelector);
};
const crementPriority = (priority, newWeight) => {
    const updatedGroup = deepCloneObject(group);
    const updatedPriority = findPriority(updatedGroup, priority.id);
    updatedPriority.weight = newWeight;
    updateAndPreserveFocus(updatedGroup);
};
const handleCrement = (priority, crement) => {
    const newWeight = priority.weight + crement.stepValue;
    if (isBetween('0<=', newWeight, `<=${priority.weight + group.remainingWeight}`)) {
        crementPriority(priority, newWeight);
    }
};
export const handleAction = (submitEvent, priority, form, crements) => {
    switch (submitEvent.submitter.dataset.action) {
        case 'delete':
            handleDelete(priority);
            break;
        case 'cancel':
            handleCancel(priority);
            break;
        case 'save':
            handleSave(priority, form);
            break;
        case 'Decrement':
            handleCrement(priority, crements.decrement);
            break;
        case 'Increment':
            handleCrement(priority, crements.increment);
            break;
        case 'rename':
            handleRename(priority, form);
            break;
    }
};
