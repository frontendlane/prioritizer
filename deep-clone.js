const deepCloneArray = (array) => array.map((element) => {
    if (Array.isArray(element)) {
        return deepCloneArray(element);
    }
    else if (typeof element === 'object' && element !== null) {
        return deepCloneObject(element);
    }
    else {
        return element;
    }
});
export const deepCloneObject = (object) => {
    const clonedObject = {};
    for (const entryPair of Object.entries(object)) {
        const [propertyName, propertyValue] = entryPair;
        let clonedPropertyValue;
        if (Array.isArray(propertyValue)) {
            clonedPropertyValue = deepCloneArray(propertyValue);
        }
        else if (typeof propertyValue === 'object' && propertyValue !== null) {
            clonedPropertyValue = deepCloneObject(propertyValue);
        }
        else {
            clonedPropertyValue = propertyValue;
        }
        clonedObject[propertyName] = clonedPropertyValue;
    }
    return clonedObject;
};
