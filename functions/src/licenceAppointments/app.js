const express                   = require('express');
const checkOffices              = require('./checkOffices');
const checkOffice               = require('./checkOffice');
const createUserAppointment     = require('./createUserAppointment');
const handleError               = require('@utils/handleError');

const app = express();

app.get('/offices', checkOffices);
app.get('/offices/:officeName', checkOffice);
app.post('/offices/:officeName', createUserAppointment);

app.use(handleError);

module.exports = app;