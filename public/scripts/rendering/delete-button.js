import { setContent } from './../utils.js';
export const generateDeleteButton = (priority) => {
    const deleteButton = document.createElement('button');
    setContent(deleteButton, '🗑');
    deleteButton.setAttribute('aria-label', `Delete "${priority.name}"`);
    deleteButton.dataset.action = 'delete';
    deleteButton.formNoValidate = true;
    return deleteButton;
};
