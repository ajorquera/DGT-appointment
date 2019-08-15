const checkAvailableAppointment = require('@licenceAppointments/checkOfficeAppointment');
const {requestStep} = require('@utils/helpers');

jest.mock('@utils/helpers', () => {
    const html = {
        find: () => []
    }

    return {
        requestStep: jest.fn(() => Promise.resolve({html, body: 'some html', viewStateStr: 'some string'}))
    }   
});

let office;

beforeEach(() => {
    office = {code: '32', label: 'Mádrid'};
});

test('there needs to be a different user-agent header per request', async () => {
    const calls = requestStep.mock.calls;
    
    const getLastCalledUserAgent = () => {
        return calls[calls.length - 1][0].userAgent;
    };

    await checkAvailableAppointment(office);
    const userAgent1 = getLastCalledUserAgent();
    
    await checkAvailableAppointment(office);
    const userAgent2 = getLastCalledUserAgent();

    expect(!!userAgent1).toBe(true);
    expect(userAgent1).not.toBe(userAgent2);
});

test('needs to return a promise that resolves to {isAppointmentAvailable, body, office, datesAvailable}', async () => {
    const response = await checkAvailableAppointment(office);

    expect(typeof response.isAppointmentAvailable).toBe('boolean');
    expect(Array.isArray(response.datesAvailable)).toBe(true);
    expect(response.body).toBeDefined();
    expect(response.office).toBe(office);
});




