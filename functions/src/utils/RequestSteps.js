const axios           = require('axios');
const cheerio         = require('cheerio');
const querystring     = require('querystring');
const SocksProxyAgent = require('socks-proxy-agent');
const fakeUseragent   = require('fake-useragent');
const {ERRORS}          = require('@errors');

let httpsAgent;
if(process.env.USE_TOR) {
    const proxyOptions = `socks5://localhost:9050`;
    httpsAgent = new SocksProxyAgent(proxyOptions);
}

class RequestSteps {
    constructor(args={}) {
        this._request = this._buildRequest();

        if(!args || typeof args !== 'object') {
            throw new Error('args needs to be an object');
        }

        this._args = args;
        this._html = '';
        this.cookies = '';
        this.viewStateStr = '';
    }

    async send(step) {
        this._step = step;

        const {method, url} = step;
        const requestOpts = {
            method,
            url,
            headers: {
                'Cookie': this.cookies
            }
        };

        if(method === 'post') {
            requestOpts.data = await this._processData();
        }

        return this._request(requestOpts).then(this._onResolve.bind(this)).catch(this._onError.bind(this));
    } 

    _onResolve(res) {
        const html        = cheerio(res.data);
        this.viewStateStr = html.find('input[name="javax.faces.ViewState"]').attr('value');
        
        if(res.headers['set-cookie']) {
            this.cookies = res.headers['set-cookie'].join('; ');
        }
        
        if(!this.viewStateStr || !this.cookies) {
            throw {
                code: 'VIEW_STATE_MISSING'
            };
        }

        let result;
        if(this._validateStep(html) ) {
            result = this._html = html;
        } else {
            result = null;
        }

        return result;
    }

    _onError(errorResponse) {
        let error;

        if (errorResponse && ERRORS[errorResponse.code]) {
            error = errorResponse;
        } else {
            error = this._processFailedDGTRequest(errorResponse);
        }

        throw error;
    }

    _processFailedDGTRequest(error) {
        const html = cheerio(error.response.data);

        let message = html.find('p[style]').text();
        const isExcesivePetitions = message === 'Se ha sobrepasado el umbral de peticiones del servicio';

        if(!isExcesivePetitions) {
            message = undefined;
        }

        return {
            code: 'REQUEST_FAILED',
            data: {
                status: error.response.status,
                data: error.response.data,
                message
            }
        };
    }

    _buildRequest() {
        return axios.create({
            timeout: 20000,
            httpsAgent,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': fakeUseragent()
            }
        });
    }

    async _processData() {
        const stepData = this._step.data;
        let data = {};

        if(typeof stepData === 'function') {
            data = stepData.call(this, {...this._args, html: this._html});
        } else if (stepData && typeof stepData === 'object') {
            data = stepData;
        }

        //check if is a promise
        if(data && data.then) {
            data = await data;
        }

        return querystring.stringify({
            ...data,
            'javax.faces.ViewState': this.viewStateStr
        });
    }

    _validateStep(html) {
        let isValidStep = true;

        if(typeof this._step.validate === 'function') {
            isValidStep= this._step.validate.call(this, {...this._args, html});
        }
 
        return isValidStep;
    }
}

RequestSteps.REQUEST_DELAY = 10000;

module.exports = RequestSteps;