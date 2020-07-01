export const focusHistory: string[] = [];

export const getMostRecentFocusableElement = (): HTMLElement => {
    let elementToFocus: HTMLElement = document.body;
    for (let i: number = focusHistory.length - 1; i >= 0; i--) {
        const focusedElement = document.querySelector(focusHistory[i]);
        if (document.documentElement.contains(focusedElement)) {
            elementToFocus = focusedElement as HTMLElement;
            break;
        } else {
            focusHistory.pop();
        }
    }
    return elementToFocus as HTMLElement;
};