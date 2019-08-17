const {
    INTERNAL_SERVER_ERROR,
    SERVICE_UNAVAILABLE,
    NOT_FOUND
} = require('http-status-codes');

const ERRORS = {
    'UNKNOWN': {
        message: 'There was an unknown error',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'APPOINTMENT_CREATION': {
        message: 'Something went wrong when trying to create an appointment',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'APPOINTMENT_EXIST': {
        message: 'There is already an appointment for this user',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'NOTIFICATION': {
        message: 'There was an error when trying to send a notification',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'REQUEST_FAILED': {
        message: 'The request to DGT failed',
        httpStatus: SERVICE_UNAVAILABLE
    },
    'SEND_EMAIL': {
        message: 'There was a problem when trying to send an email',
        httpStatus: SERVICE_UNAVAILABLE
    },
    'SLACK_MESSAGE': {
        message: 'There was a problem when trying to send a message by slack',
        httpStatus: SERVICE_UNAVAILABLE
    },
    'VIEW_STATE_MISSING': {
        message: 'For some reason the viewState param is missing',
        httpStatus: SERVICE_UNAVAILABLE
    },
    'STEP_FAILED': {
        message: 'A step failed it\'s validation',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'APPOINTMENT_NOT_AVAILABLE': {
        message: 'There is no appointment for this office',
        httpStatus: NOT_FOUND
    },
    'OFFICE_NOT_FOUND': {
        message: 'The offices you requested doesn\'t exist',
        httpStatus: NOT_FOUND
    }
};

Object.entries(ERRORS).forEach(([key, value]) => {
    value.code = key;
});

module.exports = ERRORS;