const checkOffices        = require('@availability/checkOffices')
const {notify}            = require('@notifications');
const checkAvailability   = require('@availability/checkAvailability');

jest.mock('@availability/checkAvailability', () => {
    return jest.fn(() => ({isAppointmentAvailable: true, datesAvailable: ['12/03/2019']}));
});

jest.mock('@notifications', () => {
    return {
        notify: jest.fn()
    }   
});

const req = {};
const res = {};
let next;
beforeEach(() => {
    res.json = jest.fn();  
    req.params = {
        officeName: 'madrid'
    };

    req.query = {}
    next = jest.fn();
    notify.mockRestore()
})

test('should check all offices availability ', async () => {
    await checkOffices(req, res, next);

    expect(notify).toHaveBeenCalled();
    const calls = checkAvailability.mock.calls;
    
    expect(calls.length > 10).toBe(true);
    expect(notify).toHaveBeenCalled();
});

test('should not notify if there is no appointments available', async () => {
    checkAvailability.mockReturnValue(Promise.reject({code: 'OFFICE_NOT_FOUND'}));
    
    await checkOffices(req, res, next);
    expect(notify).not.toHaveBeenCalled();
})



