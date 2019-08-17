const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const slackNotify       = require('slack-notify');

const slack = slackNotify(SLACK_WEBHOOK_URL);

module.exports = ({message}) => {
    return new Promise((resolve, reject) => {
        slack.alert({text: message, channel: 'robodgt'}, (err) => {
            err ? reject({code: 'SLACK_MESSAGE', data: err}) : resolve();
        });
    });
};