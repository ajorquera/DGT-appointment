const {ERRORS} = require('@errors');

test('that ERRORS to be a hashtable', () => {
    expect(typeof ERRORS).toBe('object');
    expect(Array.isArray(ERRORS)).toBe(false);
    expect(!!ERRORS).toBe(true);
});

test('that every error has {httpStatus, message, code}', () => {
    Object.entries(ERRORS).forEach(([code, error]) => {
        expect(error.code).toBe(code); 
        expect(typeof error.message).toBe('string'); 
        expect(typeof error.code).toBe('string'); 
        expect(typeof error.httpStatus).toBe('number'); 
    });
});
