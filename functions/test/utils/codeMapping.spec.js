const {
    normalizeName, 
    getOffices, 
    getStates
} = require('@utils/codeMapping');

describe('normalizeName', () => {
    test('should throw an error if name is not a string', () => {
        expect(() => normalizeName({})).toThrow();
        expect(() => normalizeName(6)).toThrow();
        expect(() => normalizeName()).toThrow();
        expect(() => normalizeName(null)).toThrow();
    })  
    
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

describe('getOffices', () => {
    test('look for an office by name', () => {
        const office = getOffices('Mádrid');
    
        expect(typeof office.label).toBe('string');
        expect(typeof office.code).toBe('string');
    });
    
    test('return all offices', () => {
        const allOffices = getOffices();
    
        expect(Array.isArray(allOffices)).toBe(true);
    });
    
    test('return undefined for non existing office', () => {
        const office = getOffices('non existen office');
    
        expect(office).toBe(undefined);
    });
    
});

describe('getStates', () => {
    test('get state', () => {
        const state = getStates('madrid');
        expect(state.code).toBe('28');
    });

    test('return all states', () => {
        const allStates = getStates();
    
        expect(Array.isArray(allStates)).toBe(true);
    });
});
