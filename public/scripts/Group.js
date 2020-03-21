import { Priority } from './Priority.js';
export class Group {
    constructor({ priorities = [], remainingWeight = 0 }) {
        this.priorities = priorities.map((priority) => new Priority(priority));
        // TODO: would Object.freeze(this.priorities) array work?
        this.remainingWeight = remainingWeight;
    }
}
;
