const axios     = require('axios');
const cheerio   = require('cheerio');
var querystring = require("querystring");
const fakeUserAgent = require('fake-useragent');

const URL_STEP1 = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces';
const URL_STEP2 = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso1.faces';
const URL_STEP3 = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso2.faces';

const requestInstance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

module.exports = async (office) => {
    const headers = {
        'User-Agent': fakeUserAgent()
    };

    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        

        let data;
        if(step.method == 'post') {
            step.data['publicacionesForm:oficina'] = office.code;
            data = setFormData(step.data);
        };
        
        const {html, body} = await requestInstance.request({
            method: step.method, 
            url: step.url, 
            data, 
            headers
        }).then(requestCB).catch(handleError);

        const isError = !!html.find('.msgError').length;
        let isAppointmentAvailable = false;
        
        if(isError) {
            return {
                isAppointmentAvailable,
                body
            }
        }

        if(stepIndex + 1 === steps.length) {

            let datesAvailable
            
            if(html) {
                datesAvailable = html.find('.dias').map((i, elm) => {
                    return elm.firstChild.firstChild.children[0].data;
                });

                datesAvailable = Array.from(datesAvailable);
                isAppointmentAvailable = !!datesAvailable.length;
            }

            return {
                isAppointmentAvailable,
                body,
                datesAvailable
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
    {method: 'get', url: URL_STEP1},
    {method: 'post', url: URL_STEP1,  data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:tipoTramiteinicializado': '-1',
        'publicacionesForm:oficina': '1'
    }},
    {method: 'post', url: URL_STEP1 ,data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3'
    }},
    {method: 'post', url: URL_STEP1, data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3',
        'publicacionesForm:pais': '21',
        'publicacionesForm:j_id70': 'continuar',
        'honeypotName': ''
    }},
    {method: 'post', url: URL_STEP2, data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id112': 'Continuar'
    }},
    {method: 'post', url: URL_STEP3, data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:j_id383:0:YVminif': '99999999R',
        'publicacionesForm:j_id387:4:nombreYV': 'JOSE',
        'publicacionesForm:j_id392:2:primerApellidoYV': 'MARIA',
        'publicacionesForm:j_id396:3:segundoApellidoYV': '',
        'publicacionesForm:j_id401:1:residenciaYV': '28',
        'publicacionesForm:j_id408:5:YVelsalvador6': '',
        'publicacionesForm:j_id413:6:YVelsalvador7': '27/01/1981',
        'publicacionesForm:j_id420:8:venezuela9': '27/01/2013',
        'publicacionesForm:j_id427:9:venezuela21': 'VENEZUELA',
        'publicacionesForm:j_id431:10:venezuela64': '156456374',
        'publicacionesForm:j_id436:11:venezuela75': '156456374',
        'publicacionesForm:j_id457:7:YVobservaciones': '',
        'publicacionesForm:j_id2121': 'Solicitar',
        'publicacionesForm:autorizacion': 'on',
    }},
]