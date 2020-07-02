import { ClickEvent, FocusableHTMLElement } from './types';
import { focusHistory } from './focus-history.js';
import { cssPath } from './css-path.js';

export const focus = (element: HTMLElement | null) => {
    if (element) {
        element.focus();
        focusHistory.push(cssPath(element) as string);
    }
};

export const normalizeFocus = (): void => {
    document.addEventListener('click', (event: MouseEvent): void => {
        const clickEvent: ClickEvent = event as ClickEvent;
        if ((clickEvent.target as Element).matches('button, input, textarea, select, [contenteditable]')) {
            const elementToFocus: FocusableHTMLElement = clickEvent.explicitOriginalTarget || clickEvent.target;
            focus(elementToFocus);
        }
    }, true);
};