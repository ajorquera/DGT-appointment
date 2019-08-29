const Sheets            = require('@utils/Sheets');
const createAppointment = require('./createAppointment');
const {notify}          = require('../notifications');

const sheets = new Sheets();

module.exports = async (req, res, next) => {
    await sheets.init();
    const officesNotAvailable = [];    
    let users = await sheets.getUsers();

    const appointments = [];
    for (const user of users) {
        const offices = user.officeName.split(',');

        for (const officeName of offices) {
            if(officesNotAvailable.indexOf(officeName) !== -1) {
                continue;
            }
    
            let appointment;
            try {
                appointment = await createAppointment({...user, officeName});
            } catch (e) {
                if(e.code !== 'APPOINTMENT_NOT_AVAILABLE') {
                    return next(e);
                }
            }
    
            if(appointment) {
                appointments.push(appointment);
                try {
                    await notifyUser({user, ...appointment});
                    await sheets.turnUser(user, 'off');
                } catch(e) {
                     return next(e);
                }

                break;
            } else {
                officesNotAvailable.push(user.officeName);
            }   
        }
    }

    res.json(appointments);
};

const notifyUser = async (data) => {
    const user = data.user;
    
    return notify({templateName: 'newAppointment', data, emails: user.email});
};