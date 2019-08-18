const get = require('lodash/get');

const {getOffices, getStates} = require('@utils/codeMapping');

const URLS = [
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso1.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso2.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaPaso3.faces',
    'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCitaResumen.faces'
];

const checkAppointmentExist = ({html, user}) => {
    const msgErrorDOM = html.find('.msgError');
    const message     = msgErrorDOM.text();

    if(message && message.search('usted tiene una cita pendiente de CANJES') !== -1) {
        throw {code: 'APPOINTMENT_EXIST'};
    }

    return isErrorMsg({user, html});
};

const isErrorMsg = ({html, user}) => {
    const msgErrorDOM = html.find('.msgError');
    const message = msgErrorDOM.text();

    if(message.search('El horario de atención al cliente está completo para los próximos días') !== -1) {
        const office = getOffices(user.officeName);
        throw {code: 'APPOINTMENT_NOT_AVAILABLE', data: office};
    }

    return !html.find('.msgError').length;
};

module.exports = [
    {id: 'paso1', method: 'get', url: URLS[0]},
    {method: 'post', url: URLS[0], validate: isErrorMsg, data: ({user}) => {
        const office = getOffices(user.officeName);

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramiteinicializado': '-1',
        }
    }},
    {id: 'paso2', method: 'post', url: URLS[0] , validate: isErrorMsg, data: ({user}) => {
        const office = getOffices(user.officeName);

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3'
        }
    }},
    {id: 'paso3', method: 'post', url: URLS[0], validate: isErrorMsg, data: ({user}) => {
        const office = getOffices(user.officeName);

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3',
            'publicacionesForm:pais': '21',
            'publicacionesForm:j_id70': 'Continuar',
            'honeypotName': ''
        };
    }},
    {id: 'paso4', method: 'post', url: URLS[1], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id112': 'Continuar'
    }},
    {
        id: 'paso5',
        method: 'post', 
        url: URLS[2], 
        data: ({user}) => {
            const stateCode = getStates(user.stateName).code;
            
            return {
                'publicacionesForm': 'publicacionesForm',
                'publicacionesForm:j_id383:0:YVminif': user.id,
                'publicacionesForm:j_id387:4:nombreYV': user.name,
                'publicacionesForm:j_id392:2:primerApellidoYV': user.lastName,
                'publicacionesForm:j_id396:3:segundoApellidoYV': user.secodLastName,
                'publicacionesForm:j_id401:1:residenciaYV': stateCode,
                'publicacionesForm:j_id408:5:YVelsalvador6': user.phoneNumber,
                'publicacionesForm:j_id413:6:YVelsalvador7': user.birthDate,
                'publicacionesForm:j_id420:8:venezuela9': user.licenceExpDate,
                'publicacionesForm:j_id427:9:venezuela21': 'VENEZUELA',
                'publicacionesForm:j_id431:10:venezuela64': user.licenceNumber,
                'publicacionesForm:j_id436:11:venezuela75': user.licenceNumber,
                'publicacionesForm:j_id457:7:YVobservaciones': '',
                'publicacionesForm:j_id2121': 'Solicitar',
                'publicacionesForm:autorizacion': 'on',
            };
        },
        validate: checkAppointmentExist
    },
    {id: 'paso6', method: 'post', url: URLS[3], validate: isErrorMsg, data: ({html}) => {
        const timeOption = html.find('.buscIntCamposEvProvSelect optgroup option')[0];
        const timeAttr = get(timeOption, 'parentNode.parentNode.attribs.name');
        const time = get(timeOption , 'attribs.value');
        const buttonAttr = timeAttr.replace('horario', 'j_id56');

        return {
            'publicacionesForm': 'publicacionesForm',
            [timeAttr]: time,
            [buttonAttr]: 'Continuar',
        };

    }},
    {id: 'final', method: 'post', url: URLS[4], data: ({html}) =>  {
        const code = html.find('input[name="j_id31:j_id275"]').attr('value');

        return {
            'publicacionesForm': 'publicacionesForm',
            'j_id31': 'j_id31',
            'j_id31:j_id272': 'Confirmar',
            'j_id31:j_id275': code,
            '\'j_id31:honeypot': ''
        };

    }, validate: ({html}) => {
        let isValid = isErrorMsg({html});

        if(isValid) {
            const messageDOM = html.find('#j_id24');
            const message = get(messageDOM, '[0].firstChild.data');
            isValid = message === 'Estos son los datos de la cita solicitada';
        } 
        
        if(!isValid) {
            const errorMessage = html.find('.msgError').text();
            throw {code: 'APPOINTMENT_CREATION', data: {message: errorMessage}};
        }

        return isValid;
    }},
];

