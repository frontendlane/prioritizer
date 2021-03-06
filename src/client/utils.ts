import { TPriority, TGroup, TPrioritySlimRatio } from './types';

export const generateIdFromString = (string: string) => string.toLowerCase().replace(/ /g, '-');

export const removeContent = (element: HTMLElement) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

export const setContent = (element: HTMLElement, content: string | (string | Element | DocumentFragment)[]) => {
    removeContent(element);
    if (typeof content === 'string') {
        element.append(content);
    } else {
        element.append(...content);
    }
};

export const findPriority = (group: TGroup, id: string): TPriority =>
    group.priorities.find((priority: TPriority) => priority.id === id) as TPriority;

const getPrioritiesSafeForSlimming = (priorities: TPriority[]): TPriority[] =>
    priorities.filter((priority: TPriority, index: number) =>
        !priorities[index + 1] || (priority.weight - priorities[index + 1].weight > 1));

const getRiskyPrioritiesForSlimming = (priorities: TPriority[]): TPriority[] =>
    priorities.filter((priority: TPriority, index: number) =>
        !priorities[index + 1] || (priority.weight - priorities[index + 1].weight === 1));

export const slim = (groupForUpdate: TGroup, groupWithoutDeletedPriority: TGroup): TGroup => {
    const prioritiesByWeight: TPriority[] = [...groupForUpdate.priorities]
        .sort((current: TPriority, next: TPriority) => current.weight > next.weight ? -1 : 1);

    let eligibleForSlimming: TPriority[];
    const safePrioritiesForSlimming: TPriority[] = getPrioritiesSafeForSlimming(prioritiesByWeight);
    const riskyPrioritiesForSlimming: TPriority[] = getRiskyPrioritiesForSlimming(prioritiesByWeight);

    if (safePrioritiesForSlimming.length) {
        eligibleForSlimming = safePrioritiesForSlimming;
    } else if (riskyPrioritiesForSlimming.length) {
        eligibleForSlimming = riskyPrioritiesForSlimming;
    } else {
        eligibleForSlimming = prioritiesByWeight;
    }

    const prioritiesWithSlimmingPriority: TPrioritySlimRatio[] = eligibleForSlimming.map((priority: TPriority) => ({
        ...priority,
        slimRatio: (findPriority(groupForUpdate, priority.id).weight - 1) / findPriority(groupWithoutDeletedPriority, priority.id).weight
    }));
    const sortedPrioritiesWithSlimmingPriority: TPrioritySlimRatio[] = prioritiesWithSlimmingPriority
        .sort((current: TPrioritySlimRatio, next: TPrioritySlimRatio) => current.slimRatio > next.slimRatio ? -1 : 1);

    const priorityToSlim: TPriority = findPriority(groupForUpdate, sortedPrioritiesWithSlimmingPriority[0].id);
    priorityToSlim.weight--;

    return groupForUpdate;
};