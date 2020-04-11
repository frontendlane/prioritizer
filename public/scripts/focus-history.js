export const focusHistory = [];
export const getMostRecentFocusableElement = () => {
    let elementToFocus = document.body;
    for (let i = focusHistory.length - 1; i >= 0; i--) {
        const focusedElement = document.querySelector(focusHistory[i]);
        if (document.documentElement.contains(focusedElement)) {
            elementToFocus = focusedElement;
            break;
        }
        else {
            focusHistory.pop();
        }
    }
    return elementToFocus;
};
