const KEY_FILE_PATH = '../../../credentials';
const {google} = require('googleapis');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

class Sheets {
    constructor() {
        this.initialized = false;
    }

    async init() {
        if(this.initialized) {
            return Promise.resolve();
        }


        const auth = new google.auth.GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        });
    
        let client;


        if(process.env.GCLOUD_PROJECT) {
            client = await auth.getClient();
        } else if (process.env.NODE_ENV !== 'test')  {
            const serviceAccount = require(KEY_FILE_PATH);
            client = auth.fromJSON(serviceAccount);
        }
    
        this.gSheets = google.sheets({version: 'v4', auth: client});
        this.spreadsheetID = SPREADSHEET_ID;

        if(!this.spreadsheetID) {
            throw new Error('env variable SPREADSHEET_ID not found');
        }

        this.initialized = true;
    }

    async getUsers() {
        const response = await this.getRange('A1:R10');

        const users = this._processResponse(response);

        users.forEach(this._validateUser);

        return users.filter(user => user.isOn);
    }

    getRange(range) {
        this._checkIfInitialized();

        return this.gSheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetID,
            range: `users!${range}`
        }).catch(this._handleRequestError.bind(this));
    }

    writeToRange(range, values) {
        this._checkIfInitialized();

        return this.gSheets.spreadsheets.values.update({
            spreadsheetId: this.spreadsheetID,
            range: `users!${range}`,
            valueInputOption: 'USER_ENTERED', //USER_ENTERED , RAW
            resource: {values}
        }).catch(this._handleRequestError.bind(this));
    }

    turnUser(user, option) {
        if(['on', 'off'].indexOf(option) === -1) {
            throw new Error('The are just two options "on", "off"');
        }

        if(!(user && user.row)) {
            throw new Error('It needs the user information');
        }

        const value = option === 'on' ? 'TRUE' : 'FALSE';

        return this.writeToRange(`B${Number(user.row) + 1}`, [[value]]);
    }

    _checkIfInitialized() {
        if(!this.initialized) {
            throw new Error('instance needs to call init()');
        }
    }

    _handleRequestError(err) {
        throw {code: 'GOOGLE_SHEETS', data: {message: err.message}};
        
    }

    _processResponse(response) {
        const data = response.data.values;

        let processedData = [];

        const rows = data.slice(1);

        rows.forEach(row => {
            const user = {};

            Sheets.columnMap.forEach((key, i) => {
                user[key] = row[i];
            });
            user.isOn = user.isOn === 'TRUE';
            processedData.push(user);
        });

        return processedData;
    }

    _validateUser(user) {
        const isValid = Sheets.columnMap.every(key => {
            const value = user[key];

            return (
                key && 
                value && 
                (
                    typeof value === 'string' ||
                    key === 'isOn' && typeof value === 'boolean'
                )
            );
        });

        if(!isValid) {
            throw new Error('user structure is wrong');
        }
    }
}

Sheets.columnMap = [
    'row',
    'isOn',
    'date',
    'name',
    'lastName',
    'secodLastName',
    'id',
    'phoneNumber',
    'email',
    'stateName',
    'birthDate',
    'licenceExpDate',
    'licenceNumber',
    'officeName'
];

module.exports = Sheets;