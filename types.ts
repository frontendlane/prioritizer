export interface HTMLInputRangeElement extends HTMLInputElement {
    valueAsNumber: number;
}

export interface SubmitEvent extends Event {
    explicitOriginalTarget: HTMLButtonElement | HTMLInputElement;
}

export type TPriority = {
    id: string,
    name: string,
    weight: number,
    isBeingEdited: boolean
};

export type TPrioritySlimRatio = {
    id: string,
    name: string,
    weight: number,
    isBeingEdited: boolean,
    slimRatio: number
};

export interface IPriority {
    id?: string,
    name?: string,
    weight?: number,
    isBeingEdited?: boolean
}

export type TGroup = {
    priorities: TPriority[],
    remainingWeight: number
};

export interface IGroup {
    priorities?: TPriority[],
    remainingWeight?: number
}
