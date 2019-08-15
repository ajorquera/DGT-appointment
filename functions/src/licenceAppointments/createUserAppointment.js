const spreadsheetId     = process.env.GOOGLE_SPREADSHEET_ID;
const Sheets            = require('@utils/Sheets');
const offices           = require('@utils/offices');
const createAppointment = require('./createAppointment');

const sheets = new Sheets();
sheets.init();

module.exports = async (req, res, next) => {
    const office = offices.get(req.params.officeName);

    if(!office) {
        return next({code: 'NOT_FOUND'});
    }

    let users = await sheets.getUsers();
    users = users.filter(user => offices.normalizeName(user.office) === offices.normalizeName(office.label));

    const appointments = [];
    for (const user of users) {
        let appointment;
        try {
            appointment = await createAppointment(user);
            appointments.push(appointment);
        } catch (e) {
            return next(e);
        }
    }
    
    await sendNotification({});

    res.json(appointments);
};

const sendNotification = async () => {

}