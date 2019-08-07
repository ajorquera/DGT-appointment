const axios = require('axios');
const cherio = require('cheerio');

const URL = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces'

const requestInstance = axios.create({
    timeout: 1000,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

module.exports = await (appointment) => {
    for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        if(step.method == 'post' && !viewStateStr) {
            return handleError();
        }

        const step = steps[stepIndex];
        
        await requestInstance([step.method], step.data).then(requestCB).catch(handleError);
    }
}

let viewStateStr;

const requestCB = () => {
    const html = cherio.load(res.data);
    viewStateStr = html.find('input[name="javax.faces.ViewState"]').attr('value');
};

const handleError = (err) => {
    
}

const steps = [
    {method: 'get'},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:tipoTramiteinicializado': '-1',
        'publicacionesForm:oficina': '40'
    }},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '40',
        'publicacionesForm:tipoTramite': '3'
    }},
    {method: 'post', data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:oficina': '40',
        'publicacionesForm:tipoTramite': '3',
        'publicacionesForm:pais': '21',
        'publicacionesForm:j_id70': 'continuar'
    }},
]