import { focusHistory } from './focus-history.js';
import { cssPath } from './css-path.js';
export const focus = (element) => {
    if (element) {
        element.focus();
        focusHistory.push(cssPath(element));
    }
};
export const normalizeFocus = () => {
    document.addEventListener('click', (event) => {
        const clickEvent = event;
        // @ts-ignore
        if (clickEvent.target.matches('button, input, textarea, select, [contenteditable]')) {
            const elementToFocus = clickEvent.explicitOriginalTarget || clickEvent.target;
            focus(elementToFocus);
        }
    }, true);
};
