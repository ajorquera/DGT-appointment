const get = require('lodash/get');
const getCaptchaCode = require('@utils/getCaptchaCode');
const {URLS} = require('@utils/constants');

const {getOffices, getStates} = require('@utils/codeMapping');

const checkAppointmentExist = ({html, user}) => {
    const msgErrorDOM = html.find('.msgError');
    const message     = msgErrorDOM.text();

    if(message && message.search('usted tiene una cita pendiente de CANJES') !== -1) {
        throw {code: 'APPOINTMENT_EXIST', data: user};
    }

    return isErrorMsg({user, html});
};

const isErrorMsg = ({html, user}) => {
    const msgErrorDOM = html.find('.msgError');
    const message = msgErrorDOM.text();

    if(get(message, 'htmlsearch') && message.htmlsearch('El horario de atención al cliente está completo para los próximos días') !== -1) {
        const office = getOffices(user.officeName);
        throw {code: 'APPOINTMENT_NOT_AVAILABLE', data: office};
    } else if (message) {
        throw {code: 'STEP_FAILED', data: message};
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
        };
    }},
    {id: 'paso2', method: 'post', url: URLS[0] , validate: isErrorMsg, data: ({user}) => {
        const office = getOffices(user.officeName);

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3'
        };
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
    {id: 'paso3a', method: 'post', validate: isErrorMsg, url: URLS[0], data: async ({user}) => {
        const office = getOffices(user.officeName);
        const token = await getCaptchaCode();

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3',
            'publicacionesForm:pais': '21',
            'g-recaptcha-response': token,
            'publicacionesForm:j_id60': 'Continuar'
        };

    }},
    {id: 'paso4', method: 'post', url: URLS[1], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id97': 'Continuar'
    }},
    {
        id: 'paso5',
        method: 'post', 
        url: URLS[2], 
        data: ({user}) => {
            const stateCode = getStates(user.stateName).code;
            
            return {
                'publicacionesForm': 'publicacionesForm',
                'publicacionesForm:j_id314:0:YVminif': user.id,
                'publicacionesForm:j_id318:4:nombreYV': user.name,
                'publicacionesForm:j_id323:2:primerApellidoYV': user.lastName,
                'publicacionesForm:j_id327:3:segundoApellidoYV': user.secondLastName,
                'publicacionesForm:j_id332:1:residenciaYV': stateCode,
                'publicacionesForm:j_id229:5:YVelsalvador6': user.phoneNumber,
                'publicacionesForm:j_id343:6:YVelsalvador7': user.birthDate,
                'publicacionesForm:j_id350:8:venezuela9': user.licenceExpDate,
                'publicacionesForm:j_id357:9:venezuela21': 'VENEZUELA',
                'publicacionesForm:j_id361:10:venezuela64': user.licenceNumber,
                'publicacionesForm:j_id366:11:venezuela75': user.licenceNumber,
                'publicacionesForm:j_id383:7:YVobservaciones': '',
                'publicacionesForm:YVmiemailsavi': user.email,
                'publicacionesForm:j_id2017': 'Solicitar',
                'publicacionesForm:autorizacion': 'on'
            };
        },
        validate: checkAppointmentExist
    },
    {id: 'paso6', method: 'post', url: URLS[3], validate: isErrorMsg, data: ({html, user}) => {
        const timeOption = html.find('.buscIntCamposEvProvSelect optgroup option')[0];
        const timeAttr = get(timeOption, 'parentNode.parentNode.attribs.name');
        const time = get(timeOption , 'attribs.value');
        const buttonAttr = timeAttr.replace('horario', 'j_id59');

        return {
            'publicacionesForm': 'publicacionesForm',
            [timeAttr]: time,
            [buttonAttr]: 'Continuar',
        };

    }},
    {id: 'final', method: 'post', url: URLS[4], data: ({html}) =>  {
        const code = html.find('input[name="publicacionesCitaResumenForm:j_id283"]').attr('value');

        return {
            'publicacionesCitaResumenForm': 'publicacionesCitaResumenForm',
            'publicacionesCitaResumenForm:j_id280': 'Confirmar',
            'publicacionesCitaResumenForm:j_id283': code
        };

    }, validate: ({html}) => {
        let isValid = isErrorMsg({html});

        if(isValid) {
            const messageDOM = html.find('#j_id27');
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

