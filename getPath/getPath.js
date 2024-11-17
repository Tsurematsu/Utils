import path from 'path';
import { fileURLToPath } from 'url';

export default function getPath() {
    const originalFunc = Error.prepareStackTrace;
    let callerfile;

    try {
        const err = new Error();
        let currentfile;

        // Personalizamos el stack para acceder a él
        Error.prepareStackTrace = function (_, stack) { return stack; };

        // El archivo actual (donde estamos llamando getPath)
        currentfile = err.stack.shift().getFileName();

        // Recorremos la pila de llamadas para encontrar el archivo que instanció
        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();
            if (currentfile !== callerfile) break;
        }
    } catch (err) {
        console.error('Error al obtener el archivo que instanció el módulo:', err);
    } finally {
        // Restauramos el comportamiento original del stack
        Error.prepareStackTrace = originalFunc;
    }

    // Si `callerfile` es una URL, la convertimos a una ruta válida del sistema
    if (callerfile.startsWith('file://')) {
        callerfile = fileURLToPath(callerfile);
    }

    // Usamos path.dirname para obtener la ruta del directorio
    return path.dirname(callerfile);
}
