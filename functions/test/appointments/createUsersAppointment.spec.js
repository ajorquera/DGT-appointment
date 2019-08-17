const createUserAppointment = require('@appointments/createUsersAppointment');
const createAppointment     = require('@appointments/createAppointment');
const Sheets                = require('@utils/Sheets');
const mailgunJs             = require('mailgun-js');

jest.mock('@utils/Sheets', () => {
   const Sheets = function() {};
   Sheets.prototype.init = () => Promise.resolve();
   Sheets.prototype.getUsers = jest.fn(() => Promise.resolve([{}]));

    return Sheets;
});

jest.mock('mailgun-js', () => {
    const MailGunJs = function() {};

    MailGunJs.prototype.messages = function() {return this;}
    MailGunJs.prototype.send = function() {return this;}

    return MailGunJs;
});

jest.mock('@appointments/createAppointment', () => {
    return jest.fn(() => {});
});

let res = {};
let req;
let next;

beforeEach(() => {
    res.json = jest.fn();
    res.status = jest.fn();
    req = {};
    next = jest.fn();
});

test('handle userAppointment failure', async () => {
    const error = {};

    createAppointment.mockReturnValueOnce(Promise.reject(error));

    await createUserAppointment(req, res, next);
});

test('creates multiple appointments from users', async () => {
    await createUserAppointment(req, res, next);

})

test('doesn\'t  iteerates for an office that already doestn have appointments', () => {
    
});

test('throws an error when notification failes', () => {
    
});