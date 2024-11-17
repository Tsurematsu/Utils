/**
 * Genera una cadena de letras aleatorias de una longitud definida.
 * 
 * @param {number} length - La longitud de la cadena a generar.
 * @param {boolean} [name=false] - Si es true, genera una cadena de solo mayúsculas intercalando consonantes y vocales.
 * @returns {string} - La cadena generada.
 */
export default function makeString(length, name = false) {
    const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const vowels = "AEIOU";
    const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
    const abc = ABC.toLowerCase();
    const characters = ABC + abc;
    let result = '';

    if (name) {
        for (let i = 0; i < length; i++) {
            if (i % 2 === 0) {
                const randomConsonantIndex = Math.floor(Math.random() * consonants.length);
                result += consonants[randomConsonantIndex];
            } else {
                const randomVowelIndex = Math.floor(Math.random() * vowels.length);
                result += vowels[randomVowelIndex];
            }
        }
    } else {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
    }

    return result;
}