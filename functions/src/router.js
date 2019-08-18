const express = require('express');

const checkOffices              = require('@availability/checkOffices');
const checkOffice               = require('@availability/checkOffice');
const createUsersAppointment    = require('@appointments/createUsersAppointment');
const {handleError}             = require('@errors');

const router = express.Router();

router.get('/offices', checkOffices);
router.get('/offices/:officeName', checkOffice);
router.post('/offices', createUsersAppointment);

router.use(handleError);

module.exports = router;