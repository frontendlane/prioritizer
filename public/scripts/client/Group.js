import { Priority } from './Priority.js';
export class Group {
    constructor({ name = 'Enter your project name here', priorities = [], remainingWeight = 0 }) {
        this.name = name;
        this.priorities = priorities.map((priority) => new Priority(priority));
        this.remainingWeight = remainingWeight;
    }
}
;
