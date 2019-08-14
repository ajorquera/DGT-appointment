require('dotenv').config();

const Sheets = require('./utils/Sheets');

const run = async () => {

    const sheets = new Sheets();
    await sheets.init();
    
    const users = await sheets.getUsers();
    
    console.log(users);
}

run()