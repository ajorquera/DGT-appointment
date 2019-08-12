
const checkAvailableAppointment = require('./checkAvailableAppointment');
const sendNotitification        = require('./sendNotification');
const allOffices                = require('./offices');
const {setOfficeName}           = require('./utils');

module.exports = async (req, res) => {
    const officesAvailable = [];

    let offices = allOffices;
    
    const {name, email, notification} = req.query;

    if(name) {
        const officesName = Array.isArray(name) ? name : [name];

        offices = officesName.map(name => allOffices.find(office => setOfficeName(office.label) === setOfficeName(name))).filter(Boolean);
    }

    for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        
        const {isAppointmentAvailable, body, datesAvailable} = await checkAvailableAppointment(office);
    
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