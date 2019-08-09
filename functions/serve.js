require('dotenv').config();

const checkAppointment = require('./licenceAppointments');

const bodyParser = require('body-parser');

const port = 8080;

const message = `app listening in port: ${port}`

checkAppointment.use(bodyParser.json());

checkAppointment.listen(port, () => console.log(message));