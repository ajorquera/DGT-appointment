const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

module.exports = async (req, res, next) => {
    let appointment;
    try {
        const userInfo = await getUserInfo();
        appointment = await createAppointment(userInfo);
        await sendNotification({});
    } catch (e) {
        return next(e);
    }

    res.json(appointment);
};

const createAppointment = async () => {

}

const sendNotification = async () => {

}

const processExcelData = () => {

}

const excelClient = async () => {

};