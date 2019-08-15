const axios           = require('axios');
const cheerio         = require('cheerio');
const ERRORS          = require('@utils/errors'); 

const {requestStep, normalizeName} = require('@utils/helpers');

jest.mock('axios', () => {
    const instance = jest.fn(() => Promise.resolve({data: 'body'}));

    return {
        create: () => instance,
        instance
    };
});

jest.mock('cheerio', () => {
    const html = {};

    html.attr = jest.fn(() => 'viewStateString');
    html.find = () => html;
    html.map = () => html;

    return () => html;
});


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

describe('requestStep', () => {
    
    
    test('handles error from DGT server', async () => {
        const error = {message: 'some weird error message'};
    
        axios.instance.mockReturnValueOnce(Promise.reject(error));
    
        try {
            await requestStep({});
        } catch(e) {
            expect(e).toEqual({code: ERRORS['REQUEST_FAILED'].code, data: error});
        }
    });

    test('send an error when viewStateStr is missing', async () => {
        const html = cheerio();
    
        html.attr.mockReturnValueOnce(null);
    
        try {
            await requestStep({});
        } catch(e) {
            expect(e).toEqual({code: ERRORS['VIEW_STATE_MISSING'].code});
        }
    });

    test('return a promise that resolves to {body, html, viewStateStr}', async() => {
        const {body, html, viewStateStr} = await requestStep({});

        expect(typeof body).toBe('string');
        expect(typeof html).toBe('object');
        expect(typeof viewStateStr).toBe('string');
    });
});
