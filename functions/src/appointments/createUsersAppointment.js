const Sheets            = require('@utils/Sheets');
const createAppointment = require('./createAppointment');
const {notify}          = require('../notifications');

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
        } catch (e) {
            return next(e);
        }

        if(appointment) {
            appointments.push(appointment);
            try {
                notifyUser({user, ...appointment});
            } catch(e) {
                next(e);
            }
        } else {
            officesNotAvailable.push(user.office);
        }
    }

    res.json(appointments);
};

const notifyUser = async (data) => {
    const user = data.user;
    
    return notify({templateName: 'newAppointment', data, emails: user.email});
};