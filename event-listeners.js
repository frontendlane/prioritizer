import { Priority } from './Priority.js';
import { deepCloneObject } from './deep-clone.js';
import { generateIdFromString } from './utils.js';
import { group, groupHistory, update, rinseDOM } from './index.js';
const moveCaretTo = (selection, h1, index) => {
    const range = document.createRange();
    range.setStart(h1.firstChild || h1, index);
    selection.removeAllRanges();
    selection.addRange(range);
};
const updateProjectName = (event) => {
    const selection = document.getSelection();
    const caretIndex = selection.focusOffset;
    const h1 = event.target;
    const projectName = h1.textContent;
    document.title = `${projectName} priorities`;
    setTimeout(() => {
        h1.innerHTML = projectName;
        moveCaretTo(selection, h1, caretIndex);
    }, 0);
};
const add = ({ id, name }, elementToFocus, form) => {
    const updatedGroup = deepCloneObject(group);
    const newPriority = new Priority({ id, name });
    updatedGroup.priorities.unshift(newPriority);
    update(updatedGroup, elementToFocus);
    form.reset();
};
const getTooltip = () => document.querySelector('[aria-live="polite"][role="status"]');
const clearTooltip = (tooltip = getTooltip()) => tooltip.innerHTML = '&nbsp;';
const setTooltip = (text) => {
    const tooltipElement = getTooltip();
    clearTooltip(tooltipElement);
    setTimeout(() => tooltipElement.textContent = text, 50);
};
const submitNew = (event) => {
    const submitEvent = event;
    submitEvent.preventDefault();
    const input = document.getElementById('new-priority');
    const name = input.value.trim();
    const id = `fel-prioritizer-${generateIdFromString(name)}`;
    const doesAlreadyExist = group.priorities.some((priority) => id === priority.id);
    doesAlreadyExist
        ? setTooltip('There\'s already a priority with that name')
        : add({ id, name }, submitEvent.explicitOriginalTarget, submitEvent.target);
};
const sort = (event) => {
    const updatedGroup = deepCloneObject(group);
    updatedGroup.priorities.sort((current, next) => current.weight > next.weight ? -1 : 1);
    update(updatedGroup, event.target);
};
const undo = () => {
    if (groupHistory.length > 1) {
        rinseDOM(groupHistory.pop());
    }
};
export const attachListeners = () => {
    var _a, _b, _c, _d;
    document.addEventListener('click', () => clearTooltip());
    document.addEventListener('focus', () => clearTooltip(), true);
    (_a = document.querySelector('h1')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', updateProjectName);
    (_b = document.querySelector('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', submitNew);
    (_c = document.getElementById('undo')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', undo);
    (_d = document.getElementById('sort')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', sort);
};
