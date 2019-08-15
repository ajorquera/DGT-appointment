const cheerio       = require('cheerio');
const querystring   = require('querystring');
const {requestStep} = require('@utils/helpers');
const URLS          = require('@utils/URLS');

module.exports = async (office) => {
    let viewStateStr;
    let response;
    for(const step of steps) {
        response = await requestStep({
            ...step, 
            office, 
            viewStateStr
        });

        viewStateStr = response.viewStateStr;
    }

    const {body, html} = response;
    
    const {isAppointmentAvailable, datesAvailable} = processHtml(html);

    return {
        isAppointmentAvailable,
        datesAvailable,
        body,
        office
    }
};

processHtml = (html) => {
    const datesAvailable = html.find('.dias').map((i, elm) => {
        return elm.firstChild.firstChild.children[0].data;
    });

    return {
        datesAvailable: Array.from(datesAvailable),
        isAppointmentAvailable: !!datesAvailable.length
    };
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