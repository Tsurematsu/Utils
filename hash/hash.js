/**
 * Clase para gestionar el hash de la URL del navegador.
 */
export default class HashManager {
    /**
     * Constructor que inicializa el hash actual.
     */
    constructor() {
        this.hash = this._stripHash(window.location.hash);
    }

    /**
     * Elimina el carácter '#' del inicio del hash si está presente.
     * @param {string} hash - El hash de la URL.
     * @returns {string} - El hash sin el carácter '#'.
     * @private
     */
    _stripHash(hash) {
        return hash.startsWith('#') ? hash.substring(1) : hash;
    }

    /**
     * Obtiene el hash actual sin el carácter '#'.
     * @returns {string} - El hash actual.
     */
    getHash() {
        this.hash = this._stripHash(window.location.hash);
        return this.hash;
    }

    /**
     * Establece un nuevo hash en la URL.
     * @param {string} newHash - El nuevo hash a establecer.
     */
    setHash(newHash) {
        window.location.hash = `#${newHash}`;
        this.hash = newHash;
    }

    /**
     * Limpia el hash de la URL.
     */
    clearHash() {
        window.location.hash = '';
        this.hash = '';
    }
}