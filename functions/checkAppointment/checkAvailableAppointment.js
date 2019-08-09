const axios     = require('axios');
const cheerio   = require('cheerio');
var querystring = require("querystring");

const URL = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces';

const requestInstance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

module.exports = async (office) => {
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];

        let data;
        if(step.method == 'post') {
            step.data['publicacionesForm:oficina'] = office.code;
            data = setFormData(step.data);
        }
        const {html, body} = await requestInstance[step.method](URL, data).then(requestCB).catch(handleError);

        if(stepIndex + 1 === steps.length) {

            let isAppointmentAvailable;

            if(html) {
                isAppointmentAvailable = !html.find('.msgError').length
            }

            return {
                isAppointmentAvailable,
                body
            };
        }
    }
}

let viewStateStr;

const requestCB = (res) => {
    const html = cheerio(res.data);
    viewStateStr = html.find('input[name="javax.faces.ViewState"]').attr('value');
    return {html, body: res.data};
};

const handleError = (err) => {
    return {}
}

const setFormData = (data) => {
    data['javax.faces.ViewState'] = viewStateStr;
    return querystring.stringify(data)
};

const steps = [
    {method: 'get'},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:tipoTramiteinicializado': '-1',
        'publicacionesForm:oficina': '1'
    }},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3'
    }},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3',
        'publicacionesForm:pais': '21',
        'publicacionesForm:j_id70': 'continuar',
        'honeypotName': ''
    }},
]