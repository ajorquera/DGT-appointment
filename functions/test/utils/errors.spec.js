const errors = require('@utils/errors');

test('that errors to be a hashtable', () => {
    expect(typeof errors).toBe('object');
    expect(Array.isArray(errors)).toBe(false);
    expect(!!errors).toBe(true);
});

test('that every error has {httpStatus, message, code}', () => {
    Object.entries(errors).forEach(([code, error]) => {
        expect(error.code).toBe(code); 
        expect(typeof error.message).toBe('string'); 
        expect(typeof error.code).toBe('string'); 
        expect(typeof error.httpStatus).toBe('number'); 
    });
});
