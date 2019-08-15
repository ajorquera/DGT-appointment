const {normalizeName} = require('@utils/helpers');

describe('normalizeName', () => {
    test('offices with "/"', () => {
        const example = normalizeName('Valencia/Valencia');
        const example2 = normalizeName('Valencia/Valencia/madrid');

        expect(example).toBe('valencia-valencia');
        expect(example2).toBe('valencia-valencia-madrid');
    });

    test('offices with " "', () => {
        const example = normalizeName('Madrid-Alcala de Henares');

        expect(example).toBe('madrid-alcala-de-henares');
    });

    test('offices in upper case', () => {
        const example = normalizeName('Guadalajara');

        expect(example).toBe('guadalajara');
    });

    test('offices with "."', () => {
        const example = normalizeName('S.C. de Tenerife');

        expect(example).toBe('s-c-de-tenerife');
    });

    test('offices with "-"', () => {
        const example = normalizeName('Toledo-Talavera');

        expect(example).toBe('toledo-talavera');
    });

    test('offices with accents/diacritics', () => {
        const example = normalizeName('Álmeria');

        expect(example).toBe('almeria');
    });

    test('offices others', () => {
        const example = normalizeName('Toledo-Talavera');

        expect(example).toBe('toledo-talavera');
    });
});
