const checkAvailability  = require('./checkAvailability');
const {notify}           = require('@notifications');
const {getOffices}       = require('@utils/codeMapping');

module.exports = async (req, res, next) => {
    const officesAvailable = [];

    let offices = getOffices();
    
    const {name, email, notification} = req.query;

    if(name) {
        const officesName = Array.isArray(name) ? name : [name];

        offices = officesName.map(name => getOffices(name)).filter(Boolean);
    }

    for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        
        let response;
        let datesAvailable = [];
        let isAppointmentAvailable = true;
        try {
            response = await checkAvailability(office);
            datesAvailable = response.datesAvailable;
        } catch(e) {
            if(e.code !== 'APPOINTMENT_NOT_AVAILABLE') {
                return next(e);
            }
            
            isAppointmentAvailable = false;
        }

        
        if(isAppointmentAvailable) {
            officesAvailable.push({...office, datesAvailable});
        }
    }

    if(officesAvailable.length) {
        try {
            await notify({email, offices: officesAvailable, notification});
        } catch(e) {
            next(e);
        }
    }
    
    res.json(officesAvailable);
};