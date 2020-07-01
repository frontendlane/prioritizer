export const generateIdFromString = (string) => string.toLowerCase().replace(/ /g, '-');
export const removeContent = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};
export const setContent = (element, content) => {
    removeContent(element);
    element.append(content);
};
export const findPriority = (group, id) => group.priorities.find((priority) => priority.id === id);
const getPrioritiesSafeForSlimming = (priorities) => priorities.filter((priority, index) => !priorities[index + 1] || (priority.weight - priorities[index + 1].weight > 1));
const getRiskyPrioritiesForSlimming = (priorities) => priorities.filter((priority, index) => !priorities[index + 1] || (priority.weight - priorities[index + 1].weight === 1));
export const slim = (groupForUpdate, groupWithoutDeletedPriority) => {
    const prioritiesByWeight = [...groupForUpdate.priorities]
        .sort((current, next) => current.weight > next.weight ? -1 : 1);
    let eligibleForSlimming;
    const safePrioritiesForSlimming = getPrioritiesSafeForSlimming(prioritiesByWeight);
    const riskyPrioritiesForSlimming = getRiskyPrioritiesForSlimming(prioritiesByWeight);
    if (safePrioritiesForSlimming.length) {
        eligibleForSlimming = safePrioritiesForSlimming;
    }
    else if (riskyPrioritiesForSlimming.length) {
        eligibleForSlimming = riskyPrioritiesForSlimming;
    }
    else {
        eligibleForSlimming = prioritiesByWeight;
    }
    const prioritiesWithSlimmingPriority = eligibleForSlimming.map((priority) => (Object.assign(Object.assign({}, priority), { slimRatio: (findPriority(groupForUpdate, priority.id).weight - 1) / findPriority(groupWithoutDeletedPriority, priority.id).weight })));
    const sortedPrioritiesWithSlimmingPriority = prioritiesWithSlimmingPriority
        .sort((current, next) => current.slimRatio > next.slimRatio ? -1 : 1);
    const priorityToSlim = findPriority(groupForUpdate, sortedPrioritiesWithSlimmingPriority[0].id);
    priorityToSlim.weight--;
    return groupForUpdate;
};
