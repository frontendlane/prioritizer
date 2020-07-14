import { group } from './index.js';
export const storage = {
    name: '__fel-prioritizer',
    isAvailable: function () {
        try {
            localStorage.getItem(this.name);
            return true;
        }
        catch (error) {
            return false;
        }
    },
    load: function () {
        return localStorage.getItem(this.name) || '';
    },
    save: function async() {
        storage.isAvailable() && localStorage.setItem(this.name, JSON.stringify(group));
    },
    clear: function () {
        storage.isAvailable() && localStorage.removeItem(this.name);
    }
};
