import { group } from './index.js';

export const storage = {
    name: '__fel-prioritizer',
    isAvailable: function (): boolean {
        try {
            localStorage.getItem(this.name);
            return true;
        } catch (error) {
            return false;
        }
    },
    load: function (): string {
        return localStorage.getItem(this.name) || '';
    },
    save: function async (): void {
        storage.isAvailable() && localStorage.setItem(this.name, JSON.stringify(group));
    },
    clear: function (): void {
        storage.isAvailable() && localStorage.removeItem(this.name);
    }
};