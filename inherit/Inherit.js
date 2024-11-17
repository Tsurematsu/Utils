/**
 * Hereda propiedades de un objeto a otro.
 * 
 * @param {Object} A - El objeto destino que recibirá las propiedades.
 * @param {Object} B - El objeto fuente del cual se heredan las propiedades.
 * 
 * @description
 * Es importante llamar a `Inherit(this, parent)` antes de definir cualquier propiedad en `this`.
 * Esto asegura que las propiedades heredadas se configuren correctamente antes de cualquier
 * modificación adicional.
 */
export default function Inherit(A, B) {
    for (const k in B) {
        if (Object.prototype.hasOwnProperty.call(B, k)) {
            Object.defineProperty(A, k, {
                get: () => B[k],
                set: (v) => { B[k] = v; },
                enumerable: true,
                configurable: true
            });
        }
    }
}