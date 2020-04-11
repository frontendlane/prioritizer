const generateElementSelector = (element, childIndex, useId) => {
    const type = element.getAttribute('type');
    const typeSelector = type ? `[type="${type}"]` : '';
    return useId && element.id
        ? `#${element.id}`
        : `${element.nodeName.toLowerCase()}${typeSelector}:nth-child(${childIndex})`;
};
const getCssPath = (element, useId) => {
    if (element === document.body) {
        return 'body';
    }
    else {
        const parent = element.parentElement || document.body;
        const childIndex = [...parent.children].findIndex(child => child === element) + 1;
        return `${getCssPath(parent, useId)} > ${generateElementSelector(element, childIndex, useId)}`;
    }
};
export const cssPath = (element, useId = true) => element && getCssPath(element, useId);
