const deepCloneArray = (array: any[]): any[] => array.map((element: any) => {
    if (Array.isArray(element)) {
        return deepCloneArray(element);
    } else if (typeof element === 'object' && element !== null) {
        return deepCloneObject(element as object);
    } else {
        return element;
    }
});

export const deepCloneObject = (object: object): object => {
    const clonedObject: {[index: string]: any} = {};
    for (const entryPair of Object.entries(object)) {
        const [propertyName, propertyValue]: [string, any] = entryPair;
        let clonedPropertyValue: any;
        if (Array.isArray(propertyValue)) {
            clonedPropertyValue = deepCloneArray(propertyValue);
        } else if (typeof propertyValue === 'object' && propertyValue !== null) {
            clonedPropertyValue = deepCloneObject(propertyValue);
        } else {
            clonedPropertyValue = propertyValue;
        }
        clonedObject[propertyName] = clonedPropertyValue;
    }
    return clonedObject;
};