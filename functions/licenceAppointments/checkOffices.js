
const checkAvailableAppointment = require('./checkAvailableAppointment');
const sendNotitification        = require('./sendNotification');
const offices                   = require('./offices');
const EMAIL_TO                  = process.env.EMAIL_TO;


module.exports = async (req, res) => {
    const officesAvailable = [];

    for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        
        const {isAppointmentAvailable, body, datesAvailable} = await checkAvailableAppointment(office);
    
        if(isAppointmentAvailable) {
            office.datesAvailable = datesAvailable;
            officesAvailable.push(office);
        }
    }
    try {
        await sendNotitification({email: EMAIL_TO, offices: officesAvailable});
    } catch(e) {
        console.log(e)
    }
    
    res.send(officesAvailable);
}