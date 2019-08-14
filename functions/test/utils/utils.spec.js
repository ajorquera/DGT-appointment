const {setOfficeName} = require('../../utils/utils');

describe('setofficeName', () => {
    test('offices with "/"', () => {
        const example = setOfficeName('Valencia/Valencia');
        const example2 = setOfficeName('Valencia/Valencia/madrid');

        expect(example).toBe('valencia-valencia');
        expect(example2).toBe('valencia-valencia-madrid');
    });

    test('offices with " "', () => {
        const example = setOfficeName('Madrid-Alcala de Henares');

        expect(example).toBe('madrid-alcala-de-henares');
    });

    test('offices in upper case', () => {
        const example = setOfficeName('Guadalajara');

        expect(example).toBe('guadalajara');
    });

    test('offices with "."', () => {
        const example = setOfficeName('S.C. de Tenerife');

        expect(example).toBe('s-c-de-tenerife');
    });

    test('offices with "-"', () => {
        const example = setOfficeName('Toledo-Talavera');

        expect(example).toBe('toledo-talavera');
    });

    test('offices with accents/diacritics', () => {
        const example = setOfficeName('Álmeria');

        expect(example).toBe('almeria');
    });

    test('offices others', () => {
        const example = setOfficeName('Toledo-Talavera');

        expect(example).toBe('toledo-talavera');
    });
});
