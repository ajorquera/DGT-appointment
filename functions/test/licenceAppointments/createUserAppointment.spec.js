const createUserAppointment = require('@licenceAppointmnets/createUserAppointment');
const createAppointment     = require('@licenceAppointmnets/createAppointmnet');
const Sheets                = require('@utils/Sheets');

jest.mock('@utils/Sheets', () => {
   const Sheets = () => {};
   Sheets.prototype.init = () => {};
   Sheets.prototype.getUsers = jest.fn();

    return Sheets;
});

jest.mock('@licenceAppointmnets/createAppointmnet', () => {
    return jest.fn(() => {});
});

test('handle userAppointment failure', async () => {
    const error = {};

    createAppointment.mockReturnOnce(Promise.reject(error));

    await createUserAppointment();
});

test('creates multiple appointments from users', async () => {
    await createUserAppointment();

})

test('doesn\'t  iteerates for an office that already doestn have appointments', (params) => {
    
});

test('throws an error when notification failes', () => {
    
});