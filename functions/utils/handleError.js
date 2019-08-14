const ERRORS = require('./errors');

module.exports = (error, res, req) => {
    let errorToReport = ERRORS[error.code];

    if(!errorToReport) {
        errorToReport = ERRORS.UNKNOWN;
    }

    console.error(new Error(errorToReport));
    res.status(errorToReport.httpStatus).json(errorToReport);
}