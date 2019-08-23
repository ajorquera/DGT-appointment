const RequestSteps = require('@utils/RequestSteps');
const {getOffices} = require('@utils/codeMapping');
const steps        = require('../steps');

module.exports = async (user) => {
    let html;

    const office = getOffices(user.officeName);
    const requestStep = new RequestSteps({user});

    for (const step of steps) {
        html = await requestStep.send(step);
    }

    const appointmentDetails = processAppointment(html);

    return {...appointmentDetails, user, office};
};

const processAppointment = (html) => {
    return {
        time: html.find('td[headers="hora"]').text(),
        date: html.find('td[headers="fechaCita"]').text(),
        officeAddress: html.find('td[headers="lugar"]').text()
    };
};
