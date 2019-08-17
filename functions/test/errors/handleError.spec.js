const {ERRORS, handleError} = require('@errors');

let req;
let res = {};

beforeEach(() => {
    console.error = jest.fn(); 

    res.json = jest.fn(() => res);
    res.status = jest.fn(() => res)
});

const checkError = (errorObj) => {
    const arg = console.error.mock.calls[0][0];

    expect(arg.message).toEqual(JSON.stringify(errorObj));
    expect(res.status).toHaveBeenCalledWith(errorObj.httpStatus);
    expect(res.json).toHaveBeenCalledWith(errorObj);

}

test('should return an APPOINTMENT_CREATION error', () => {
    const error = {code: 'APPOINTMENT_CREATION'}
    handleError(error, req, res);

    checkError(ERRORS['APPOINTMENT_CREATION']);    
});

test('should return an UNKNOWN error', () => {
    const error = {code: 'UNKNOWN error'}

    handleError(error, req, res);
    
    checkError(ERRORS['UNKNOWN']);
})

test('should an error with data', () => {
    const data = {message: 'some data'}
    const error = {code: 'UKNOWN', data}

    handleError(error, req, res);

    checkError({...ERRORS['UNKNOWN'], data});
})




