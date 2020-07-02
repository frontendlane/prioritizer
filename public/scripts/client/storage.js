import { group } from './index.js';
export const storage = {
    name: '__fel-prioritizer',
    load: function () {
        return localStorage.getItem(this.name) || '';
    },
    save: function () {
        localStorage.setItem(this.name, JSON.stringify(group));
    }
};
