let priorities = [];
const priorityList = document.querySelector('ul');

        const unrenderPriorities = () => {
            const renderedPriorities = [...priorityList.querySelectorAll('ul > li:not(:first-child)')];
            renderedPriorities.forEach(priority => priority.remove());
        };

                const generateDeleteButton = id => {
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '🗑';
                    deleteButton.classList.add('delete-button');
                    deleteButton.onclick = () => {
                        priorities = priorities.filter(priority => priority.id !== id);
                        // TODO: if all weights are expanded and an item with no weight is deleted an error occurs
                        rinse();
                    };
                    return deleteButton;
                };

                    const generateRenameInput = priority => {
                        const renameInput = document.createElement('input');
                        renameInput.value = priority.name;

                        const priorityItem = [...priorityList.querySelectorAll('li')].find(priorityItem => priorityItem.id === priority.id);
                        const renameButton = priorityItem.querySelector('button:nth-of-type(2)');
                        const label = priorityItem.querySelector('label');
                        
                        renameInput.onkeyup = event => {
                            if (event.code === 'Escape') {
                                const saveButton = priorityItem.querySelector('button:nth-of-type(2)');
                                saveButton.after(renameButton, label);

                                renameInput.remove();
                                saveButton.remove();
                            }
                        };
                        return renameInput;
                    };

                        const generateIdFromString = string => string.toLowerCase().replace(/ /g, '-');

                    const generateSaveButton = (priority, renameInput, renameButton, label) => {
                        const saveButton = document.createElement('button');
                        saveButton.textContent = '💾';
                        renameButton.classList.add('save-button');
                        saveButton.onclick = () => {
                            priority.name = renameInput.value;
                            priority.id = generateIdFromString(renameInput.value);
                            
                            saveButton.after(renameButton, label);

                            renameInput.remove();
                            saveButton.remove();
                            rinse();
                        };

                        return saveButton;
                    };

                const generateRenameButtonAndLabel = priority => {
                    const renameButton = document.createElement('button');
                    renameButton.textContent = '✏️';
                    renameButton.classList.add('rename-button');
                    renameButton.onclick = () => {
                        const renameInput = generateRenameInput(priority);
                        renameInput.style.minWidth = label.style.minWidth;
                        const saveButton = generateSaveButton(priority, renameInput, renameButton, label);
                        
                        renameButton.after(saveButton, renameInput);
                        renameInput.focus();

                        renameButton.remove();
                        label.remove();
                    };
                    
                    const label = document.createElement('label');
                    label.textContent = priority.name;
                    label.htmlFor = `${priority.id}-range`;
                    
                    return [renameButton, label];
                };
                        const weightFactor = 3;

                    const getRemainingWeight = () => {
                        const maxWeight = priorities.length * weightFactor;
                        const usedWeight = priorities
                            .map(priority => priority.weight)
                            .reduce((accumulator, next) => accumulator + next, 0);

                        return maxWeight - usedWeight;
                    };

                const generateRange = priority => {
                    const range = document.createElement('input');
                    range.type = 'range';
                    range.id = `${priority.id}-range`;
                    range.name = priority.name;
                    range.value = priority.weight;
                    range.min = 0;
                    range.max = priority.maxWeight;
                    range.onchange = event => {
                        priority.weight = event.target.valueAsNumber;
                        rinse(range);
                    };

                    return range;
                };

                const generateCrement = (priority, props) => {
                    const crement = document.createElement('button');
                    crement.textContent = props.text;
                    crement.onclick = () => {
                        const newWeight = priority.weight + props.value;
                        if (newWeight >= 0 && newWeight <= priority.maxWeight) {
                            priority.weight = newWeight;
                        }
                        rinse(crement);
                    };
                    return crement;
                };

                const generateOutput = priority => {
                    const output = document.createElement('output');
                    output.textContent = priority.weight;
                    return output;
                };

            const renderPriorities = () => {
                const prioritiesToRender = priorities.map(priority => {
                    const priorityItem = document.createElement('li');
                    priorityItem.id = priority.id;
                    // TODO: must first return focus before continuing with this feature
                    // priorityList.onclick = event => {
                    //     if (event.target.classList.contains('rename-button')) {
                    //         priorityList.classList.add('in-edit-mode');
                    //         [...priorityList.querySelectorAll('li:not(:focus-within) > button')].forEach(button => button.disabled = true);
                    //     } else if (event.target.classList.contains('save-button') || event.target.classList.contains('delete-button')) {
                    //         priorityList.classList.remove('in-edit-mode');
                    //         [...priorityList.querySelectorAll('li > button')].forEach(button => button.disabled = false);
                    //     }
                    // };
                    priorityItem.append(
                        generateDeleteButton(priority.id),
                        ...generateRenameButtonAndLabel(priority),
                        generateRange(priority),
                        generateCrement(priority, { text: '-', value: -1 }),
                        generateOutput(priority),
                        generateCrement(priority, { text: '+', value: 1 })
                    );
                    return priorityItem;
                });
        
                priorityList.append(...prioritiesToRender);
                document.getElementById('remaining-weight').textContent = getRemainingWeight();
            };

                const setLabelMinWidth = () => {
                    const priorityLabels = [...priorityList.querySelectorAll('li:not(:first-child) > label')];
                    const longestLabelLength = priorityLabels
                        .map(element => +window.getComputedStyle(element).width.split('px')[0])
                        .reduce((current, next) => current > next ? current : next) + 'px'
                    priorityLabels.forEach(label => label.style.minWidth = longestLabelLength);
                };

            const applyStyles = () => {
                setLabelMinWidth();
            };

        const render = () => {
            priorities.forEach(priority => priority.maxWeight = priority.weight + getRemainingWeight());
            renderPriorities();
            applyStyles();
        };

    const rinse = (focusedElement = document.activeElement) => {
        const focusedElementCssSelector = dompath(focusedElement).toCSS();

        unrenderPriorities();
        render();

        document.querySelector(focusedElementCssSelector).focus();
    };

    const attachDocumentListeners = () => {
        document.addEventListener('click', () => clearTooltip());
        document.addEventListener('focus', () => clearTooltip(), true);
    };

const init = async () => {
    priorities = await fetch('initial-data.json').then(response => response.json()).catch(console.error) || [];
    document.body.classList.add('done-fetching');
    rinse();
    attachDocumentListeners();
};

init();

// Below not neccessary for init()

    const moveCaretTo = (node, index) => {
        const range = document.createRange();
        range.setStart(node, index);

        const selection = document.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    };

const updateProjectName = event => {
    const caretIndex = document.getSelection().focusOffset;
    const projectName = event.target.textContent;
    document.title = `${projectName} priorities`;

    setTimeout(() => {
        event.target.innerHTML = projectName;
        moveCaretTo(event.target.firstChild, caretIndex);
    }, 0);
};

const sort = () => {
    priorities.sort((current, next) => current.weight > next.weight ? -1 : 1);
    rinse();
};

    const add = htmlId => {
        const initialWeight = 1;
        priorities.unshift({
            name: document.getElementById('new-priority').value,
            id: htmlId,
            weight: initialWeight,
            maxWeight: weightFactor - initialWeight + getRemainingWeight()
        });
        rinse();
    };

        const getTooltipElement = () => document.querySelector('[aria-live="polite"][role="status"]');
        const clearTooltip = (element = getTooltipElement()) => element.innerHTML = '&nbsp;';

    const setTooltip = text => {
        const tooltipElement = getTooltipElement();
        clearTooltip(tooltipElement);
        setTimeout(() => tooltipElement.textContent = text, 50);
    };

const submitNew = event => {
    event.preventDefault();
    const htmlId = generateIdFromString(document.getElementById('new-priority').value);
    priorities.every(priority => htmlId !== priority.id)
        ? add(htmlId)
        : setTooltip('There\'s already a priority with that name');
};