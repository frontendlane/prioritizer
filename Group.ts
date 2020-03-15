import { TGroup, IGroup, TPriority } from './types';
import { Priority } from './Priority.js';

export class Group implements TGroup {
    constructor({ priorities = [], remainingWeight = 0 }: IGroup) {
        this.priorities = priorities.map((priority: TPriority): TPriority => new Priority(priority));
        // TODO: would Object.freeze(this.priorities) array work?
        this.remainingWeight = remainingWeight;
    }

    priorities: TPriority[];
    remainingWeight: number;
};