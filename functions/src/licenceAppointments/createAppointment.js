const {requestStep} = require('@utils/helpers');
const Offices       = require('@utils/offices');
const URLS          = require('@utils/URLS');
const get           = require('lodash/get')

const offices = new Offices();
const states = new Offices('states');

module.exports = async (user) => {
    let response;
    let viewStateStr;
    let html;
    let cookies;

    const office = offices.get(user.office);

    for (const step of steps) {
        let data;
        if(typeof step.data === 'function') {
            data = step.data.call(null, {user, html, office});
        } else {
            data = step.data;
        }

    
        response = await requestStep({
            ...step, 
            data,
            office,
            cookies,
            viewStateStr
        });

        html         = response.html;
        viewStateStr = response.viewStateStr;
        body         = response.body;
        cookies      = response.cookies

        if(typeof step.validate === 'function') {
            const isValidStep = step.validate.call(this, {html, office, user, body})

            if(!isValidStep) return null; 
        }
    }

    const appointmentDetails = generateAppointment(html);

    return {...appointmentDetails, user, office}
};

const generateAppointment = (html) => {
    return {
        time: html.find('td[headers="hora"]').text(),
        date: html.find('td[headers="fechaCita"]').text(),
        office: html.find('td[headers="lugar"]').text()
    };
};

const isErrorMsg = ({html}) => {
    const msgError = html.find('.msgError')[0];

    let message; 
    if(msgError) {
        message = msgError.children[0].data;
    }

    if(message && message.search('usted tiene una cita pendiente de CANJES') !== -1) {
        throw {code: 'APPOINTMENT_EXIST'}
    }

    return !msgError;
};
const steps = [
    {method: 'get', url: URLS[0]},
    {method: 'post', url: URLS[0],  validate: isErrorMsg, data: ({html, office}) => {
        const timestamp = html.find('#timestampId')[0].attribs.value;
        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramiteinicializado': '-1',
        }
    }},
    {method: 'post', url: URLS[0] , validate: isErrorMsg, data: ({office, html}) => {
        const timestamp = html.find('#timestampId')[0].attribs.value;

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3'
        }
    }},
    {method: 'post', url: URLS[0], validate: isErrorMsg, data: ({user, office, html}) => {
        const timestamp = html.find('#timestampId')[0].attribs.value;

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': office.code,
            'publicacionesForm:tipoTramite': '3',
            'publicacionesForm:pais': '21',
            'publicacionesForm:j_id70': 'Continuar',
            'honeypotName': ''
        }
    }},
    {method: 'post', url: URLS[1], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id112': 'Continuar'
    }},
    {
        method: 'post', 
        url: URLS[2], 
        data: ({user, office}) => {
            const stateCode = states.get(user.stateResidence).code;
            
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
            }
        },
        validate: isErrorMsg
    },
    {method: 'post', url: URLS[3], validate: isErrorMsg, data: ({user, html, office}) => {
        const timeOption = html.find('.buscIntCamposEvProvSelect optgroup option')[0];
        const timeAttr = timeOption.parentNode.parentNode.attribs.name;
        const time = timeOption.attribs.value;
        const buttonAttr = timeAttr.replace('horario', 'j_id56');

        return {
            'publicacionesForm': 'publicacionesForm',
            [timeAttr]: time,
            [buttonAttr]: 'Continuar',
        }

    }, validate: isErrorMsg},
    {method: 'post', url: URLS[4], data: ({html}) =>  {
        const code = html.find('input[name="j_id31:j_id275"]').attr('value');

        return {
            'publicacionesForm': 'publicacionesForm',
            'j_id31': 'j_id31',
            'j_id31:j_id272': 'Confirmar',
            'j_id31:j_id275': code,
            '\'j_id31:honeypot': ''
        };

    }, validate: ({html, body}) => {
        let isValid = isErrorMsg({html});

        if(isValid) {
            const messageDOM = html.find('#j_id24');
            const message = get(messageDOM, '[0].firstChild.data')
            isValid = message === 'Estos son los datos de la cita solicitada';
        }

        return isValid;
    }},
]

