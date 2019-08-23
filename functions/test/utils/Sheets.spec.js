process.env.SPREADSHEET_ID = 'some value';

const Sheets = require('@utils/Sheets');
const {google} = require('googleapis');

let sheets;
beforeEach(async () => {
    google.auth.GoogleAuth.mockClear();
    google.sheets().spreadsheets.values.get.mockClear();
    
    sheets = new Sheets();
    await sheets.init()   
});

test('should throw an error if instance is not initialized', async () => {
    sheets = new Sheets();

    try {
        await sheets.getUsers();
    } catch (e) {
        expect(e.message).toBe('instance needs to call init()');        
    }
});

test('should get user from spreedsheet', async () => {
    const users = await sheets.getUsers();

    expect(Array.isArray(users)).toBe(true);
});

test('should turnOff an user', async () => {
    await sheets.turnUser({row: '1'}, 'off');
});

test('should return an error if option is diffirent "on","off"', async () => {
    try {
        await sheets.turnUser({row: '1'});    
    } catch (e) {
    expect(e.message).toBe('The are just two options "on", "off"');        
    }
});

test('should not run whole function if init is called twice', async () => {
    google.auth.GoogleAuth.mockClear();

    const sheets = new Sheets();
    
    expect(google.auth.GoogleAuth.mock.calls.length).toBe(0);

    await sheets.init();

    expect(google.auth.GoogleAuth.mock.calls.length).toBe(1);

    await sheets.init();

    expect(google.auth.GoogleAuth.mock.calls.length).toBe(1);
});

test('should throw error if the structure of users is wrong', async () => {
    google.sheets().spreadsheets.values.get.mockReturnValueOnce(Promise.resolve({data: {values: [[], ['osme']]}}));

    try {
        await sheets.getUsers();
    } catch (e) {  
        expect(e.message).toBe('user structure is wrong');
    }
})




