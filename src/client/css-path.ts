const generateElementSelector = (element: Element, childIndex: number, useId: boolean): string => {
    const type: string | null = element.getAttribute('type');
    const typeSelector: string = type ? `[type="${type}"]` : '';
    
    return useId && element.id
        ? `#${element.id}`
        : `${element.nodeName.toLowerCase()}${typeSelector}:nth-child(${childIndex})`;
};

const getCssPath = (element: Element, useId: boolean): string => {
    if (element === document.body) {
        return 'body';
    } else {
        const parent: Element = element.parentElement || document.body;
        const childIndex: number = [...parent.children].findIndex(child => child === element) + 1;
        return `${getCssPath(parent, useId)} > ${generateElementSelector(element, childIndex, useId)}`;
    }
};

export const cssPath = (element: Element | null, useId: boolean = true): string | null =>
    element && getCssPath(element, useId);