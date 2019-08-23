const ERRORS = require('./ERRORS');

// eslint-disable-next-line
module.exports = (error, req, res, next) => {
    let errorToReport = ERRORS[error.code] || ERRORS.UNKNOWN;

    errorToReport = {...errorToReport};

    if(error.data) {
        errorToReport.data = error.data;
    }

    const err = new Error(JSON.stringify(errorToReport));

    if(errorToReport.httpStatus >= 500) {
        console.error(err);
    } else if(errorToReport.httpStatus >= 400) {
        console.warn(err);
    }

    res.status(errorToReport.httpStatus).json(errorToReport);
};