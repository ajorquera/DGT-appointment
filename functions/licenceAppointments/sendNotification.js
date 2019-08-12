const Mailgun           = require('mailgun-js');
const Handlebars        = require('handlebars');
const fs                = require('fs');
const path              = require('path');
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

const slackNotify       = require('slack-notify');
const slack             = slackNotify(SLACK_WEBHOOK_URL);

const emailStr          = fs.readFileSync(path.resolve(__dirname, '../templates/appointmentNotification.hbs'), 'utf8');

const emailTemplate     = Handlebars.compile(emailStr);

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN  = process.env.MAILGUN_DOMAIN;
const NOTIFY          = !!process.env.NOTIFY;
const EMAIL_TO        = process.env.EMAIL_TO;

const FROM       = 'scrappy@andresjorquera.com';
const SUBJECT    = 'Citas Disponibles';
const REPLY_TO   = 'hola@andresjorquera.com';
const DOMAIN     = 'andresjorquera.com';
const ACTION_URL = 'https://sedeapl.dgt.gob.es:7443/WEB_NCIT_CONSULTA/solicitarCita.faces';

const defaultData = {
    from: FROM,
    subject: SUBJECT,
    'h:Reply-To': REPLY_TO
};

const mailgun = new Mailgun({
    apiKey: MAILGUN_API_KEY, 
    domain: MAILGUN_DOMAIN, 
    host: 'api.eu.mailgun.net'
});

module.exports = ({email=EMAIL_TO, offices, notification='email'}) => {
    if(!NOTIFY) {
        return {NOTIFY};
    }

    let notificationRequest;

    switch (notification) {
        case 'email':
            notificationRequest = notifyByEmail({email, offices})
            break;

        case 'slack':
            const officesStr = offices.map(office => office.label).join(', ');
            const message = `offices available: ${officesStr}`;
            notificationRequest = notifyBySlack({message});
            break;
    }

    return notificationRequest;
    
};

const notifyByEmail = ({email, offices}) => {
    const data = {...defaultData };

    data.html = emailTemplate({
        title: SUBJECT,
        domain: DOMAIN,
        action_url: ACTION_URL,
        offices
    });

    data.to = email;

    return new Promise((resolve, reject) => {
        mailgun.messages().send(data,  (error, body) => {
            return error ? reject(error) : resolve(body)
        });
    });
}

const notifyBySlack = ({message}) => {
    return new Promise((resolve, reject) => {
        slack.alert({text: message, channel: 'robodgt'}, (err) => {
            err ? reject(err) : resolve();
        })
    });
};