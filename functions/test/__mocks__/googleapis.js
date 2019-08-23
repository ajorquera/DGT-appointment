const excelResponse = require('./excelResponse');
const auth = {
    fromJSON: jest.fn(),
    getCLient: jest.fn(() => Promise.resolve())  
};

const response = excelResponse;

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

module.exports = {google};