export interface HTMLInputRangeElement extends HTMLInputElement {
    valueAsNumber: number;
}

export interface ClickEvent extends MouseEvent {
    explicitOriginalTarget: HTMLButtonElement | HTMLInputElement;
}

export interface SubmitEvent extends Event {
    submitter: HTMLButtonElement | HTMLInputElement;
}

export type FocusableHTMLElement = HTMLButtonElement | HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type TPriority = {
    id: string,
    name: string,
    previousSavedName: string,
    weight: number,
    isBeingEdited: boolean
};

export interface IPriority {
    id?: string,
    name?: string,
    weight?: number,
    isBeingEdited?: boolean
}

export type TPrioritySlimRatio = {
    id: string,
    name: string,
    weight: number,
    isBeingEdited: boolean,
    slimRatio: number
};

export type TGroup = {
    name: string;
    priorities: TPriority[],
    remainingWeight: number
};

export interface IGroup {
    name?: string;
    priorities?: TPriority[],
    remainingWeight?: number
}

export type TCrement = {
    icon: string,
    stepAction: string,
    stepValue: number
};

export type TCrements = {
    decrement: TCrement,
    increment: TCrement
};