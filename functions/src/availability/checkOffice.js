const checkAvailability   = require('./checkAvailability');
const {notify}            = require('@notifications');
const {getOffices}        = require('@utils/codeMapping');

module.exports = async (req, res, next) => {
    const officeName = req.params.officeName;

    const office = getOffices(officeName);
    const notificationType = req.query['notification-type'];

    if(!office) {
        return res.status(404).end();
    }
    
    let response;

    try {
        response = await checkAvailability(office);
    } catch(e) {
        return next(e);        
    }

    const {isAppointmentAvailable, datesAvailable} = response;

    if(isAppointmentAvailable) {
        await notify({
            type: notificationType, 
            templateName: 'officeAvailable', 
            data: {
                offices: [{...office, datesAvailable}]
            }
        });
    }
    
    res.json({
        office,
        datesAvailable,
        isAppointmentAvailable,
    });
};