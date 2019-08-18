const axios           = require('axios');
const cheerio         = require('cheerio');
const {ERRORS}        = require('@errors'); 
const RequestSteps    = require('@utils/RequestSteps');
const {normalizeName} = require('@utils/codeMapping');

jest.mock('axios', () => {
    
    const instance = jest.fn(() => Promise.resolve({data: 'body', headers: {'set-cookie': ['cookie:fsdf;']}}));

    return {
        create: jest.fn(() => instance),
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
let requestSteps;
let requestStepsArg;
beforeEach(() => {
    requestStepsArg = {user: {message: 'a message'}};
    requestSteps = new RequestSteps(requestStepsArg);
});

test('should throw an error for args that are not objects', () => {
    expect(() => (new RequestSteps('345'))).toThrow();
    expect(() => (new RequestSteps(34535))).toThrow();
    expect(() => (new RequestSteps(null))).toThrow();
})

test('should make a step post request with data as a function', async () => {
    const spy = jest.fn();
    const html = await requestSteps.send({method: 'post', data: spy});
    
    expect(typeof html).toBe('object');
    expect(spy).toHaveBeenCalledWith({html: '', ...requestStepsArg})
})


test('handles error from DGT server', async () => {
    const error = {message: 'some weird error message'};

    axios.instance.mockReturnValueOnce(Promise.reject(error));

    try {
        await requestSteps.send({});
    } catch(e) {
        expect(e).toEqual({code: ERRORS['REQUEST_FAILED'].code, data: error});
    }
});

test('send an error when viewStateStr is missing', async () => {
    const html = cheerio();

    html.attr.mockReturnValueOnce(null);

    try {
        await requestSteps.send({});
    } catch(e) {
        expect(e).toEqual({code: ERRORS['VIEW_STATE_MISSING'].code});
    }
});

test('return a promise that resolves to {body, html, viewStateStr}', async() => {
    const html = await requestSteps.send({});

    expect(typeof html).toBe('object');
});

test('there needs to be a different user-agent header per request', async () => {
    const calls = axios.create.mock.calls;
    
    const getLastCalledUserAgent = () => {
        return calls[calls.length - 1][0].headers['User-Agent'];
    };

    let requestSteps = new RequestSteps();
    const userAgent1 = getLastCalledUserAgent();
    
    requestSteps = new RequestSteps();
    const userAgent2 = getLastCalledUserAgent();

    expect(!!userAgent1).toBe(true);
    expect(userAgent1).not.toBe(userAgent2);
});
