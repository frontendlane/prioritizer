import { Priority } from './Priority.js';
import { deepCloneObject } from './deep-clone.js';
import { generateIdFromString, removeContent, setContent } from './utils.js';
import { group, groupHistory, rinseContent, updateAndPreserveFocus, doAndPreserveFocus } from './index.js';
export const heading = document.querySelector('h1');
const getNotificationBar = () => document.querySelector('p[aria-live="polite"][role="status"]');
const clearNotification = (notificationBar = getNotificationBar()) => notificationBar && removeContent(notificationBar);
const updateProjectName = (event) => {
    const inputEvent = event;
    const heading = event.target;
    const updatedGroupName = heading.textContent || '';
    const updatedGroup = deepCloneObject(group);
    updatedGroup.name = updatedGroupName;
    !updatedGroupName && removeContent(heading);
    inputEvent.inputType === 'deleteByDrag' || inputEvent.inputType === 'insertFromDrop'
        ? setTimeout(() => updateAndPreserveFocus(updatedGroup), 0)
        : updateAndPreserveFocus(updatedGroup);
};
export const setNotification = (text) => {
    const notificationBar = getNotificationBar();
    clearNotification(notificationBar);
    setTimeout(() => notificationBar && setContent(notificationBar, text), 100);
};
const add = ({ id, name }, form) => {
    const updatedGroup = deepCloneObject(group);
    const newPriority = new Priority({ id, name });
    updatedGroup.priorities.unshift(newPriority);
    form.reset();
    updateAndPreserveFocus(updatedGroup);
};
const submitNew = (event) => {
    event.preventDefault();
    const input = document.getElementById('new-priority');
    const name = input.value.trim();
    const id = generateIdFromString(name);
    const doesAlreadyExist = group.priorities.some((priority) => id === priority.id);
    doesAlreadyExist
        ? setNotification(`There's already a priority with that name`)
        : add({ id, name }, event.target);
};
const undo = () => {
    const previousGroup = groupHistory.pop();
    heading && setContent(heading, previousGroup.name);
    rinseContent(previousGroup);
};
const handleUndo = () => groupHistory.length > 1 ? doAndPreserveFocus(undo) : setNotification('No change to undo');
const sort = () => {
    const updatedGroup = deepCloneObject(group);
    updatedGroup.priorities.sort((current, next) => current.weight > next.weight ? -1 : 1);
    updateAndPreserveFocus(updatedGroup);
};
export const attachListeners = () => {
    var _a, _b, _c;
    document.addEventListener('click', () => clearNotification());
    heading === null || heading === void 0 ? void 0 : heading.addEventListener('input', updateProjectName);
    (_a = document.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', submitNew);
    document.addEventListener('keydown', (event) => event.metaKey && event.key === 'z' && handleUndo());
    (_b = document.getElementById('undo')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', handleUndo);
    (_c = document.getElementById('sort')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', sort);
};
