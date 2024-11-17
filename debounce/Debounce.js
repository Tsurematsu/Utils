/**
 * Clase que implementa la funcionalidad de debounce.
 */
export default class Debounce {
    #timer;
    #callback;
    #delay;
    #onReset;

    /**
     * Crea una instancia de Debounce.
     * @param {Function} callback - El callback que se ejecuta cuando el timer llega a 0.
     * @param {Function} onReset - El callback que se ejecuta cada vez que se resetea el timer.
     * @param {number} delay - El tiempo en milisegundos que se espera para ejecutar el callback.
     */
    constructor(callback, onReset, delay) {
        this.callback = callback;
        this.delay = delay;
        this.retorno = onReset;
    }

    /**
     * Ejecuta el callback después del retraso especificado, reseteando el timer si se llama de nuevo antes de que expire.
     * @param {...any} args - Argumentos que se pasan al callback de reset.
     */
    run(...args) {
        clearTimeout(this.#timer);
        let execute = false;
        this.#timer = setTimeout(() => {
            this.#callback(); 
            execute = true;
        }, this.#delay);
        if (!execute) {
            return this.#onReset(...args);
        }
    }
}