import { TPriority, IPriority } from './types';

const initialWeight: number = 1;

export class Priority implements TPriority {
    constructor({ id = '', name = '', weight = initialWeight, isBeingEdited = false}: IPriority) {
        this.id = id;
        this.name = name;
        this.previousSavedName = name;
        this.weight = weight;
        this.isBeingEdited = isBeingEdited;
    }

    id: string;
    name: string;
    previousSavedName: string;
    weight: number;
    isBeingEdited: boolean;
}