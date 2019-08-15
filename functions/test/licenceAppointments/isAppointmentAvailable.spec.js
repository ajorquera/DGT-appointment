const axios   = require('axios');
const cheerio = require('cheerio');

const ERRORS                    = require('@utils/errors'); 
const checkAvailableAppointment = require('@licenceAppointments/checkOfficeAppointment');

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

let office;

beforeEach(() => {
    office = {code: '32', label: 'Mádrid'};
});

test('there needs to be a different user-agent header per request', async () => {
    const calls = axios.instance.mock.calls;

    const getLastCallArgs = () => {
        return calls[calls.length - 1][0];
    }

    await checkAvailableAppointment(office);
    const userAgent1 = getLastCallArgs().headers['User-Agent'];

    await checkAvailableAppointment(office);
    const userAgent2 = getLastCallArgs().headers['User-Agent'];

    expect(!!userAgent1).toBe(true);
    expect(userAgent1).not.toBe(userAgent2);
});

test('needs to return a promise that resolves to {checkOfficeAppointment, body, office, datesAvailable}', async () => {
    const response = await checkAvailableAppointment(office);

    expect(typeof response.checkOfficeAppointment).toBe('boolean');
    expect(Array.isArray(response.datesAvailable)).toBe(true);
    expect(response.body).toBeDefined();
    expect(response.office).toBe(office);
});

test('handles error from DGT server', async () => {
    const error = {message: 'some weird error message'};

    axios.instance.mockReturnValueOnce(Promise.reject(error));

    try {
        await checkAvailableAppointment(office);
    } catch(e) {
        expect(e).toEqual({code: ERRORS['REQUEST_FAILED'].code, data: error});
    }
});

test('send an error when viewStateStr is missing', async () => {
    const html = cheerio();

    html.attr.mockReturnValueOnce(null);

    try {
        await checkAvailableAppointment(office);
    } catch(e) {
        expect(e).toEqual({code: ERRORS['VIEW_STATE_MISSING'].code});
    }
});