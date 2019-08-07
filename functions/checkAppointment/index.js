const express          = require('express');
const checkAppointment = require('./checkAppointment');

const app = express();

app.post('/', checkAppointment);

module.exports = app;