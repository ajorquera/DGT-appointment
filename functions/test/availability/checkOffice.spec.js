const checkOffice = require('@availability/checkOffice')
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
    }
    next = jest.fn()
})

test('should check an office availability ', async () => {
    await checkOffice(req, res);

    expect(notify).toHaveBeenCalled();
});

test('should throw an error if officeName url param is not valid', async () => {
    try {
        await checkOffice(req, res, next);
    } catch(e) {
        expect(e).toEqual({code: 'OFFICE_NOT_FOUND'})
    }
})

test('should not notify if appointmnet is not available', async () => {
    checkAvailability.mockReturnValueOnce(Promise.reject({code: 'OFFICE_NOT_FOUND'}));
    try {
        await checkOffice(req, res, next);
    } catch(e) {
        expect(e.code).toBe('OFFICE_NOT_FOUND')
    }
})



