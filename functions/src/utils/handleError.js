const ERRORS = require('@utils/errors');

module.exports = (error, req, res, next) => {
    let errorToReport = ERRORS[error.code] || ERRORS.UNKNOWN;

    errorToReport = {...errorToReport};

    if(error.data) {
        errorToReport.data = error.data;
    }

    console.error(new Error(JSON.stringify(errorToReport)));
    res.status(errorToReport.httpStatus).json(errorToReport);
}