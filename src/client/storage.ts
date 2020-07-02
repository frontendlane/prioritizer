import { group } from './index.js';

export const storage = {
    name: '__fel-prioritizer',
    load: function (): string {
        return localStorage.getItem(this.name) || '';
    },
    save: function (): void {
        localStorage.setItem(this.name, JSON.stringify(group));
    }
};