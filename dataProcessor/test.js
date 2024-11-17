import DataProcessor from './DataProcessor.js';
main();
async function main() {
    // Ejemplo de uso del módulo DataProcessor

    // Función que simula la disponibilidad del objeto
    let isObjectAvailable = false;
    function checkAvailabilityObject() {
        return isObjectAvailable;
    }

    // Función que se llama cuando los datos están disponibles
    async function onAvailableObject(data) {
        console.log('Data processed:', data);
    }

    // Crear una instancia de DataProcessor con un tiempo de debounce de 2000 ms
    const processor = new DataProcessor(onAvailableObject, checkAvailabilityObject, 2000);

    // Simular la llegada de datos
    processor.data('Dato 1');
    processor.data('Dato 2');

    // Simular que el objeto se vuelve disponible después de 3 segundos
    setTimeout(() => {
        isObjectAvailable = true;
        console.log('Object is now available');
    }, 3000);

    // Simular la llegada de más datos después de que el objeto esté disponible
    setTimeout(() => {
        processor.data('Dato 3');
        processor.data('Dato 4');
    }, 4000);
}