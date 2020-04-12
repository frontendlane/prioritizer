const initialWeight = 1;
export class Priority {
    constructor({ id = '', name = '', weight = initialWeight, isBeingEdited = false }) {
        this.id = id;
        this.name = name;
        this.previousSavedName = name;
        this.weight = weight;
        this.isBeingEdited = isBeingEdited;
    }
}
