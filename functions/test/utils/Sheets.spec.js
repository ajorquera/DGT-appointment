process.env.SPREADSHEET_ID = 'some value';

const Sheets = require('@utils/Sheets');
const {google} = require('googleapis');

jest.mock('googleapis', () => {
    const auth = {
        fromJSON: jest.fn(),
        getCLient: jest.fn(() => Promise.resolve())  
    };

    const response = {data: {values: [[]]}}

    const sheets = {};
    sheets.spreadsheets = {
        values: {
            get: jest.fn(() => Promise.resolve(response)),
            update: jest.fn(() => Promise.resolve(response))
        }
    };
    
    const google = {
        auth: {GoogleAuth: jest.fn(() => auth)},
        sheets: jest.fn(() => sheets)
    };
    
    return {google};
});

let sheets;
beforeEach(async () => {
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
})


