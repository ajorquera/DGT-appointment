const {
    INTERNAL_SERVER_ERROR,
    SERVICE_UNAVAILABLE
} = require('http-status-codes')

const ERRORS = {
    'UNKNOW': {
        message: 'There was an unknown error',
        httpStatus: INTERNAL_SERVER_ERROR
    },
    'REQUEST_FAILED': {
        message: 'The request to DGT failed',
        httpStatus: SERVICE_UNAVAILABLE
    },
    'VIEW_STATE_MISSING': {
        message: 'For some reason the viewState param is missing',
        httpStatus: SERVICE_UNAVAILABLE
    }
};

Object.entries(ERRORS).forEach(([key, value]) => {
    value.code = key;
});

module.exports = ERRORS;