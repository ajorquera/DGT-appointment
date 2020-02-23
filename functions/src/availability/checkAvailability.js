const get             = require('lodash/get');

const RequestSteps    = require('@utils/RequestSteps');
const steps           = require('../steps');
const fakeUser        = require('./fakeUser.json');


//Steps to check if appointment is available
const availabilitySteps = steps.slice(0, steps.length - 2);

module.exports = async (office) => {
    let html;

    const user = {
        ...fakeUser,
        officeName: office.label
    };

    const requestSteps = new RequestSteps({user});

    for(const step of availabilitySteps) {
        html = await requestSteps.send(step);

        if(!html) {
            throw {code: 'STEP_FAILED', data: `step ${step.id} failed`};
        }
    }

    const datesAvailable = processHtml(html);
    return {
        isAppointmentAvailable: !!datesAvailable.length,
        datesAvailable,
        office
    };

};

const processHtml = (html) => {
    const datesAvailable = html.find('.dias').map((i, elm) => {
        return get(elm , 'firstChild.firstChild.children[0].firstChild.data');
    });

    return Array.from(datesAvailable);
};
