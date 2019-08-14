const express                   = require('express');
const checkOffices              = require('./checkOffices');
const handleError               = require('../utils/handleError');
const checkForOfficeAppointment = require('./checkForOfficeAppointment');

const app = express();

app.get('/offices', checkOffices);
app.get('/offices/:officeName', checkForOfficeAppointment);
app.use(handleError)

module.exports = app;