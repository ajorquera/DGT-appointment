const puppeteer = require('puppeteer');
const {URLS} = require('@utils/constants');

module.exports = async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.goto(URLS[0],  { waitUntil: 'networkidle0' });

    const token = await page.evaluate(() => {
        /*global document */
        return document.getElementById('g-recaptcha-response').value;
    });

    await browser.close();

    return token;
};