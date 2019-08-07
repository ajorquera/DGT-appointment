const Mailgun    = require('mailgun-js');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const emailStr   = fs.readFileSync(path.resolve(__dirname, '../templates/appointmentNotification.hbs'), 'utf8');

const emailTemplate = Handlebars.compile(emailStr);

const MAILGUN_API_KEY    = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

const FROM       = 'scrappy@andresjorquera.com';
const SUBJECT    = 'Citas Disponibles';
const REPLY_TO   = 'hola@andresjorquera.com';
const DOMAIN     = 'andresjorquera.com';
const ACTION_URL = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces';

const defaultData = {
    from: FROM,
    subject: SUBJECT,
    replyTo: REPLY_TO,
    //'h:Reply-To': REPLY_TO
};

const mailgun = new Mailgun({apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN, host: 'api.eu.mailgun.net'});

module.exports = async ({email}) => {
    const data = {...defaultData };

    data.html = emailTemplate({
        title: SUBJECT,
        domain: DOMAIN,
        action_url: ACTION_URL
    });

    data.to = email;

    return new Promise((resolve, reject) => {
        mailgun.messages().send(data,  (error, body) => {
            return error ? reject(error) : resolve(body)
        });
    });
};