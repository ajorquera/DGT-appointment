require('dotenv').config();
require('module-alias/register');

const app = require('./src/app');

const port = 8080;

const message = `app listening in port: ${port}`;

app.listen(port, () => console.log(message));