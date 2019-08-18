const checkAvailableAppointment = require('@availability/checkAvailability');
const RequestSteps = require('@utils/RequestSteps');

jest.mock('@utils/RequestSteps', () => {
    const RequestSteps = function() {};
    const html = {
        find: () => []
    };
    RequestSteps.prototype.send = jest.fn(() => Promise.resolve(html))

    return RequestSteps;
});

let office;

beforeEach(() => {
    office = {code: '32', label: 'Mádrid'};
});

test('needs to return a promise that resolves to {isAppointmentAvailable, office, datesAvailable}', async () => {
    const response = await checkAvailableAppointment(office);

    expect(typeof response.isAppointmentAvailable).toBe('boolean');
    expect(Array.isArray(response.datesAvailable)).toBe(true);
    expect(response.office).toBe(office);
});




