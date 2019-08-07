const API_KEY = '';

exports.module = async () => {
    return google.sheets({version: 'v4', auth: API_KEY});
};
