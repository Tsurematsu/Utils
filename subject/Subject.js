export default class Subject {
    /** @type {any} */
    #value = null;
    /** @type {Array<(data: any) => void>} */
    #observers = [];
    /** @param {(data: any) => void} */
    subscribe(observer) {
        this.#observers.push(observer);
    }
    /** @param {(data: any) => void} */
    unsubscribe(observer) {
        this.#observers = this.#observers.filter(obs => obs !== observer);
    }
    /** @param {any} */
    set(data) {
    this.#value = data;
    this.#observers.forEach(observer => observer(data));
    }
    /** @returns {any} */
    get() { return this.#value; }
}