const Handlebars       = require('handlebars');
const sendEmail        = require('./sendEmail');
const sendSlackMessage = require('./sendSlackMessage');
const EMAIL_TO         = process.env.EMAIL_TO;
const fs               = require('fs');
const path             = require('path');

module.exports = async ({data, templateName, type="email", emails=[EMAIL_TO]}) => {

    if(type === 'slack') {
        const message = slackMessages[templateName](data);
        await sendSlackMessage({message});

    } else if (type === 'email') {
        const template = await readFile(path.resolve(__dirname, `../templates/${templateName}.hbs`));
        const html = Handlebars.compile(template)(data);

        await sendEmail({html, emails});
    }
};

const readFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            err ? reject(err): resolve(data);
        });
    });
};

const slackMessages = {
    officeAvailable: Handlebars.compile("These offices are available: {{#each offices}} {{label}} - {{datesAvailable.[0]}} {{/each}}")
};