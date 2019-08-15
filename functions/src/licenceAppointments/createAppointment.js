const {requestStep} = require('@utils/helpers');
const offices       = require('@utils/offices');
const URLS          = require('@utils/URLS');

module.exports = async (user) => {
    let response;
    let viewStateStr;
    let html;

    const office = offices.get(user.office);
    const stateResidence = states.get(user.stateResidence);

    for (const step of steps) {
        let data;
        if(typeof step.data === 'function') {
            const userData = {...user, office, stateResidence};
            data = step.data.call(null, {user, html});
        } else {
            data = step.data;
        }

        response = await requestStep({
            ...step, 
            data,
            office, 
            viewStateStr
        });

        html = response.html;
    }  

    return {...response, user};
}

const steps = [
    {method: 'get', url: URLS[0]},
    {method: 'post', url: URLS[0],  data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:tipoTramiteinicializado': '-1',
        'publicacionesForm:oficina': '1'
    }},
    {method: 'post', url: URLS[0] , data: ({user}) => {

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': user.office.code,
            'publicacionesForm:tipoTramite': '3'
        }
    }},
    {method: 'post', url: URLS[0], data: ({user}) => {

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:oficina': user.office.code,
            'publicacionesForm:tipoTramite': '3',
            'publicacionesForm:pais': '21',
            'publicacionesForm:j_id70': 'continuar',
            'honeypotName': ''
        }
    }},
    {method: 'post', url: URLS[1], data: {
        'publicacionesForm': 'publicacionesForm',
        'publicacionesForm:area:0:j_id112': 'Continuar'
    }},
    {method: 'post', url: URLS[2], data: ({user}) => {
        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:j_id383:0:YVminif': user.id,
            'publicacionesForm:j_id387:4:nombreYV': user.firstName,
            'publicacionesForm:j_id392:2:primerApellidoYV': user.lastName,
            'publicacionesForm:j_id396:3:segundoApellidoYV': user.secondLastName,
            'publicacionesForm:j_id401:1:residenciaYV': user.stateResidence.code,
            'publicacionesForm:j_id408:5:YVelsalvador6': '',
            'publicacionesForm:j_id413:6:YVelsalvador7': user.birthDate,
            'publicacionesForm:j_id420:8:venezuela9': user.licenceExpDate,
            'publicacionesForm:j_id427:9:venezuela21': 'VENEZUELA',
            'publicacionesForm:j_id431:10:venezuela64': user.licenceNumber,
            'publicacionesForm:j_id436:11:venezuela75': user.licenceNumber,
            'publicacionesForm:j_id457:7:YVobservaciones': '',
            'publicacionesForm:j_id2121': 'Solicitar',
            'publicacionesForm:autorizacion': 'on',
        }
    }},
    {method: 'post', url: URLS[3], data: ({user, html}) => {
        const time = html.find('.buscIntCamposEvProvSelect optgroup option')[0].attr('value');

        return {
            'publicacionesForm': 'publicacionesForm',
            'publicacionesForm:j_id45:0:horario': time,
            'publicacionesForm:j_id45:0:j_id56': 'Continuar',
        }

    }},
    {method: 'post', url: URLS[4], data: ({html}) =>  {
        const code = html.find('input[name="j_id31:j_id275"]').attr('value');

        return {
            'j_id31': 'j_id31',
            'j_id31:j_id272' : 'Confirmar',
            'j_id31:j_id275' : code,
            'j_id31:honeypot': ''
        };
    }},
]