
const checkOfficeAppointment    = require('./checkOfficeAppointment');
const sendNotitification        = require('./sendNotification');
const Offices                   = require('@utils/offices');
const EMAIL_TO                  = process.env.EMAIL_TO;
const {normalizeName}           = require('@utils/helpers');

const offices = new Offices();

module.exports = async (req, res, next) => {
    const officeName = req.params.officeName;

    const office = offices.get(officeName);

    if(!office) {
        return res.status(404).end();
    }
    
    let response;

    try {
        response = await checkOfficeAppointment(office);
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