const Sheets            = require('@utils/Sheets');
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
            //appointment = await createAppointment(user);
            appointment = {
                date: '25/11/2019',
                time: '9:00',
                office: {
                    code: '103',
                    label: 'Ceuta'
                },
                user
            }
        } catch (e) {
            return next(e);
        }

        if(appointment) {
            appointments.push(appointment);
        } else {
            officesNotAvailable.push(user.office);
        }
    }
    
    let notificationData;
    try {
        await sendNotification(notificationData);
    } catch(e) {
        next({code: 'NOTIFICATION', data: notificationData});
    }

    res.json(appointments);
};

const sendNotification = async () => {

}