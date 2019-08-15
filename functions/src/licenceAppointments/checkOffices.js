
const checkOfficeAppointment    = require('./checkOfficeAppointment');
const sendNotitification        = require('./sendNotification');
const allOffices                = require('@utils/offices');
const {normalizeName}           = require('@utils/helpers');

module.exports = async (req, res) => {
    const officesAvailable = [];

    let offices = allOffices.get();
    
    const {name, email, notification} = req.query;

    if(name) {
        const officesName = Array.isArray(name) ? name : [name];

        offices = officesName.map(name => allOffices.get(name)).filter(Boolean);
    }

    for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        
        const {isAppointmentAvailable, body, datesAvailable} = await checkOfficeAppointment   (office);
    
        if(isAppointmentAvailable) {
            office.datesAvailable = datesAvailable;
            officesAvailable.push(office);
        }
    }

    if(officesAvailable.length) {
        try {
            await sendNotitification({email, offices: officesAvailable, notification});
        } catch(e) {
            console.log(e)
        }
    }
    
    res.send(officesAvailable);
}