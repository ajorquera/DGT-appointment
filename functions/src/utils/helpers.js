const axios         = require('axios');
const cheerio       = require('cheerio');
const querystring   = require('querystring');

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';

const requestInstance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

module.exports = {
    normalizeName: name => {
        return name
            .toLowerCase()
            // replace any accents 
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            // replace any spaces "/" "." ". "
            .replace(/(\. |-|\.| |\/)/g, '-');
    },
    requestStep: ({method, data={}, url, office={}, viewStateStr, userAgent=DEFAULT_USER_AGENT}) => {
        const requestOpts = {
            method: method, 
            url, 
            headers: {'User-Agent': userAgent}
        };
    
        if(method === 'post') {
            requestOpts.data = querystring.stringify({
                ...data, 
                'javax.faces.ViewState': viewStateStr,
                'publicacionesForm:oficina': office.code
            });
        }
    
        return requestInstance(requestOpts).then(requestCB).catch(handleError);
    }
};

const requestCB = (res) => {
    const html = cheerio(res.data);
    const viewStateStr = html.find('input[name="javax.faces.ViewState"]').attr('value');
    
    if(!viewStateStr) {
        throw {
            code: 'VIEW_STATE_MISSING'
        };
    }

    return {
        html, 
        viewStateStr,
        body: res.data 
    };
};

const handleError = (errorResponse) => {
    let error;

    if (errorResponse && errorResponse.code === 'VIEW_STATE_MISSING') {
        error = errorResponse;
    } else {
        error = {
            code: 'REQUEST_FAILED',
            data: errorResponse
        };
    }

    throw error;
}