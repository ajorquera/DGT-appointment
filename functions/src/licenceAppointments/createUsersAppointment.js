const spreadsheetId     = process.env.GOOGLE_SPREADSHEET_ID;
const Sheets            = require('@utils/Sheets');
const offices           = require('@utils/offices');
const createAppointment = require('./createAppointment');

const sheets = new Sheets();
sheets.init();

module.exports = async (req, res, next) => {
    const officesNotAvailable = [];    
    let users = await sheets.getUsers();

    const appointments = [];
    for (const user of users) {
        if(officesNotAvailable.indexOf(user.office) !== -1) {
            continue;
        }


        let appointment;
        try {
            appointment = await createAppointment(user);
            if(appointment) {
                appointments.push(appointment);
            } else {
                officesNotAvailable.push(user.office);
            }
        } catch (e) {
            return next(e);
        }
    }
    
    await sendNotification({});

    res.json(appointments);
};

const sendNotification = async () => {

}