import { TGroup, IGroup, TPriority } from './types';
import { Priority } from './Priority.js';

export class Group implements TGroup {
    constructor({ name = 'Enter your project name here', priorities = [], remainingWeight = 0 }: IGroup) {
        this.name = name;
        this.priorities = priorities.map((priority: TPriority): TPriority => new Priority(priority));
        // TODO: would Object.freeze(this.priorities) array work?
        this.remainingWeight = remainingWeight;
    }

    name: string;
    priorities: TPriority[];
    remainingWeight: number;
};