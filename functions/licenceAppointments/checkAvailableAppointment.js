const axios         = require('axios');
const cheerio       = require('cheerio');
const fakeUserAgent = require('fake-useragent');
const querystring   = require('querystring');
const URLS = [
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso1.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso2.faces'
];

const requestInstance = axios.create({
    timeout: 10000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

module.exports = async (office) => {
    let body;
    let html;
    let viewStateStr;
    
    for(const step of steps) {
        const response = await requestStep({
            ...step, 
            office, 
            viewStateStr
        });

        error        = response.error;
        body         = response.body;
        html         = response.html;
        viewStateStr = response.viewStateStr;

        if(error) {
            throw error;
        }
    }
    
    const {isAppointmentAvailable, datesAvailable} = processHtml(html);

    return {
        isAppointmentAvailable,
        datesAvailable,
        body,
        office
    }
};

const requestStep = ({method, data, url, office, viewStateStr}) => {
    const requestOpts = {
        method: method, 
        url, 
        headers: {'User-Agent': fakeUserAgent()}
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

processHtml = (html) => {
    const datesAvailable = html.find('.dias').map((i, elm) => {
        return elm.firstChild.firstChild.children[0].data;
    });

    return {
        datesAvailable: Array.from(datesAvailable),
        isAppointmentAvailable: !!datesAvailable.length
    };
}

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

    if (errorResponse && errorResponse.code) {
        error = errorResponse;
    } else {
        error = {
            code: 'REQUEST_FAILED',
            data: errorResponse
        };
    }

    return {error};
}

const steps = [
    {method: 'get', url: URLS[0]},
    {method: 'post', url: URLS[0],  data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:tipoTramiteinicializado': '-1',
        'publicacionesForm:oficina': '1'
    }},
    {method: 'post', url: URLS[0] ,data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3'
    }},
    {method: 'post', url: URLS[0], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '1',
        'publicacionesForm:tipoTramite': '3',
        'publicacionesForm:pais': '21',
        'publicacionesForm:j_id70': 'continuar',
        'honeypotName': ''
    }},
    {method: 'post', url: URLS[1], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id112': 'Continuar'
    }},
    {method: 'post', url: URLS[2], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:j_id383:0:YVminif': '99999999R',
        'publicacionesForm:j_id387:4:nombreYV': 'JOSE',
        'publicacionesForm:j_id392:2:primerApellidoYV': 'MARIA',
        'publicacionesForm:j_id396:3:segundoApellidoYV': '',
        'publicacionesForm:j_id401:1:residenciaYV': '28',
        'publicacionesForm:j_id408:5:YVelsalvador6': '',
        'publicacionesForm:j_id413:6:YVelsalvador7': '04/05/1981',
        'publicacionesForm:j_id420:8:venezuela9': '27/01/2013',
        'publicacionesForm:j_id427:9:venezuela21': 'VENEZUELA',
        'publicacionesForm:j_id431:10:venezuela64': '156456374',
        'publicacionesForm:j_id436:11:venezuela75': '156456374',
        'publicacionesForm:j_id457:7:YVobservaciones': '',
        'publicacionesForm:j_id2121': 'Solicitar',
        'publicacionesForm:autorizacion': 'on',
    }}
]