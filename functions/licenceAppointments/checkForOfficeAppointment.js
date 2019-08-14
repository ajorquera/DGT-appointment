
const checkAvailableAppointment = require('./checkAvailableAppointment');
const sendNotitification        = require('./sendNotification');
const offices                   = require('./offices');
const EMAIL_TO                  = process.env.EMAIL_TO;
const {setOfficeName}           = require('../utils/utils');

module.exports = async (req, res, next) => {
    const officeName = req.params.officeName;

    const office = offices.find(officeObj => setOfficeName(officeObj.label) === setOfficeName(officeName));

    if(!office) {
        return res.status(404).end();
    }
    
    let response;

    try {
        response = await checkAvailableAppointment(office);
    } catch(e) {
        return next(e);
    }

    const {isAppointmentAvailable, body, datesAvailable} = response;
    
    office.datesAvailable = datesAvailable;

    if(isAppointmentAvailable) {
        try {
            await sendNotitification({email: EMAIL_TO, offices: [office]});
        } catch(e) {
            return next(e);
        }
    }
    
    res.json({
        ...office,
        isAppointmentAvailable,
    });
}