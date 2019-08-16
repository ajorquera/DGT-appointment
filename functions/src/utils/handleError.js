const ERRORS = require('@utils/errors');

module.exports = (error, req, res, next) => {
    let errorToReport = ERRORS[error.code];

    if(!errorToReport) {
        errorToReport = ERRORS.UNKNOWN;
    }

    errorToReport.data = error.data || error;

    console.error(new Error(errorToReport));
    res.status(errorToReport.httpStatus).json(errorToReport);
}