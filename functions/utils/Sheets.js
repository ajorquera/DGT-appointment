const KEY_FILE_PATH = '../../credentials';
const {google} = require('googleapis');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID

class Sheets {
    constructor() {
        this.initialized = false;
    }

    async init() {
        const auth = new google.auth.GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/spreadsheets'
        });
    
        let client;
        if(process.env.GCLOUD_PROJECT) {
            client = await auth.getClient();
        } else {
            const serviceAccount = require(KEY_FILE_PATH);
            client = auth.fromJSON(serviceAccount);
        }
    
        this.gSheets = google.sheets({version: 'v4', auth: client});
        this.spreadsheetID = SPREADSHEET_ID

        if(!this.spreadsheetID) {
            throw new Error('env variable SPREADSHEET_ID not found');
        }

        this.initialized = true;
    }

    async getUsers() {
        const response = await this.getRange('A1:M10');

        const users = this._processResponse(response);

        return users.filter(user => user.isOn);
    }

    getRange(range) {
        if(!this.initialized) {
            throw new Error('instance needs to call init()');
        }

        return this.gSheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetID,
            range: `users!${range}`
        }).catch(this._handleRequestError.bind(this));
    }

    _handleRequestError(err) {
        throw err;
    }

    _processResponse(response) {
        const data = response.data.values;

        let processedData = [];

        const headers = data[0];
        const rows = data.slice(1);

        rows.forEach(row => {
            const user = {};

            Sheets.columnMap.forEach((key, i) => {
                user[key] = row[i];
            })
            user.isOn = user.isOn === 'TRUE';
            processedData.push(user);
        });

        return processedData;
    }
}

Sheets.columnMap = [
    'isOn',
    'date',
    'name',
    'lastName',
    'secodLastName',
    'id',
    'phoneNumber',
    'email',
    'stateResidence',
    'birthDate',
    'licenceExpDate',
    'licenceNumber',
    'office'
]


module.exports = Sheets;