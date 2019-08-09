const express                   = require('express');
const checkOffices              = require('./checkOffices');
const checkForOfficeAppointment = require('./checkForOfficeAppointment');

const app = express();

app.get('/offices', checkOffices);
app.get('/offices/:officeName', checkForOfficeAppointment);

module.exports = app;