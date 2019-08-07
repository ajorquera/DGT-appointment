const axios;

const getSheetsClient = require('./getSheetsClient');

exports.module = async () => {
    const client = await getSheetsClient();

    const [configResponse, appointmentsResponse] = await client.spreadsheets.values.get({
        spreadsheetId,
        range: ['Config!A1:B2', 'Config!D2:E6'],
    });

    return {
        config: {
            on: configResponse[0][1]
        },
        appointment: {
            id: appointmentsResponse[3][0],
            label: appointmentsResponse[3][0]
        }
    }
}