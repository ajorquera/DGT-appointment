const Mailgun = require('mailgun-js');

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN  = process.env.MAILGUN_DOMAIN;

const FROM       = 'scrappy@andresjorquera.com';
const REPLY_TO   = 'hola@andresjorquera.com';

const defaultData = {
    from: FROM,
    'h:Reply-To': REPLY_TO
};


const mailgun = new Mailgun({
    apiKey: MAILGUN_API_KEY, 
    domain: MAILGUN_DOMAIN, 
    host: 'api.eu.mailgun.net'
});

module.exports = ({html, emails}) => {
    const subject = html.match(/<title>(.+)<\/title>/)[1];

    const data = {
        ...defaultData,
        html,
        to: emails,
        subject
    };

    return new Promise((resolve, reject) => {
        mailgun.messages().send(data,  (error, body) => {
            return error ? reject({code: 'SEND_EMAIL', data: error}) : resolve(body);
        });
    });
};



