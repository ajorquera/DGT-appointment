
const checkAvailableAppointment = require('./checkAvailableAppointment');
const sendNotitification        = require('./sendNotification');
const EMAIL_TO = process.env.EMAIL_TO;


module.exports = async (req, res) => {
    const {isAppointmentAvailable, body} = await checkAvailableAppointment();

    if(isAppointmentAvailable) {
        sendNotitification({email: EMAIL_TO});
    }
    
    res.send(body);
}