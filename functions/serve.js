require('dotenv').config();
require('module-alias/register');

const checkAppointment = require('@licenceAppointments');

const port = 8080;

const message = `app listening in port: ${port}`

checkAppointment.listen(port, () => console.log(message));