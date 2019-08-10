
const checkAvailableAppointment = require('./checkAvailableAppointment');
const sendNotitification        = require('./sendNotification');
const offices                   = require('./offices');
const EMAIL_TO                  = process.env.EMAIL_TO;

const setOfficeName = name => {
    return name.toLowerCase().replace(' ', '-');
}

module.exports = async (req, res) => {
    const officeName = req.params.officeName;

    const office = offices.find(officeObj => setOfficeName(officeObj.label) === setOfficeName(officeName));

    if(!office) {
        return res.status(404).end();
    }

    const {isAppointmentAvailable, body, datesAvailable} = await checkAvailableAppointment(office);
    
    office.datesAvailable = datesAvailable;

    if(isAppointmentAvailable) {
        await sendNotitification({email: EMAIL_TO, offices: [office]});
    }
    
    res.send({isAppointmentAvailable});
}