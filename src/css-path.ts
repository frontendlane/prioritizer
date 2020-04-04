const getCssPath = (element: HTMLElement): string => {
    if (element === document.body) {
        return 'body';
    } else {
        const parent = element.parentElement || document.body;
        const childIndex = [...parent.children].findIndex(child => child === element) + 1;
        return `${getCssPath(parent)} > ${element.nodeName.toLowerCase()}:nth-child(${childIndex})`;
    }
};

export const cssPath = (element: HTMLElement | null) => element ? getCssPath(element) : '';

const getParentCssSelector = (cssSelector: string) => {
    const cssSelectorParts = cssSelector.split('>');
    return cssSelectorParts.splice(0, cssSelectorParts.length - 1).join('>');
};

export const queryClosest = (cssSelector: string) => {
    let closest = document.querySelector(cssSelector);
    while (!closest) {
        closest = document.querySelector(cssSelector);
        cssSelector = getParentCssSelector(cssSelector);
    }
    return closest as HTMLElement;
};