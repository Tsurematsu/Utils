export default class DataProcessor {
    #debounceTime = 1000;
    #debounceTimer = null;
    #cache = [];
    onAvailableObject = ()=>{};
    checkAvailabilityObject = ()=>false;

    /**
     * Constructor for DataProcessor.
     * 
     * @param {Function} onAvailableObject - Callback function to be called when data is available.
     * @param {Function} checkAvailabilityObject - Function to check the availability of data.
     * @param {number} [debounceTime] - Optional debounce time in milliseconds.
     */
    constructor(onAvailableObject, checkAvailabilityObject, debounceTime) {
        if (debounceTime) { this.#debounceTime = debounceTime }
        if (onAvailableObject) { this.onAvailableObject = onAvailableObject }
        if (checkAvailabilityObject) { this.checkAvailabilityObject = checkAvailabilityObject }
    }

    /**
     * Adds data to the cache and attempts to apply it to the object.
     * If the object is not available, it sets a debounce timer to retry.
     * 
     * @param {*} data - The data to be processed.
     */
    async data(data) {
        if (this.#debounceTimer !== null) { clearTimeout(this.#debounceTimer); }
        this.#cache.push(data);
        await this.#applyCacheOnObject();
        this.#debounceTimer = setTimeout(this.#callbackDebounce.bind(this), this.#debounceTime);
    }

    /**
     * Callback function for the debounce timer.
     * Attempts to apply cached data to the object.
     * If there is still data in the cache, it sets another debounce timer.
     * If the cache is empty, it clears the debounce timer.
     * 
     * @private
     */
    async #callbackDebounce() {
        await this.#applyCacheOnObject();
        if (this.#cache.length > 0) {
            this.#debounceTimer = setTimeout(this.#callbackDebounce.bind(this), this.#debounceTime);
        } else {
            clearTimeout(this.#debounceTimer);
            this.#debounceTimer = null;
        }
    }

    /**
     * Attempts to apply cached data to the object if it is available.
     * Calls the onAvailableObject callback for each item in the cache.
     * 
     * @private
     */
    async #applyCacheOnObject() {
        if (this.checkAvailabilityObject()) {
            while (this.#cache.length) {
                await this.onAvailableObject(this.#cache.shift());
            }
        }
    }
}
