
const METHOD_NOT_ALLOWED = 405;

module.exports = async (req, res) => {
    if(req.method !== 'POST') {
        return res.status(METHOD_NOT_ALLOWED);
    }

    const isAppointmentAvailable = await checkAvailableAppointment(appointment.appointment);

    if(isAppointmentAvailable) {
        await sendNotitificationEmail({email: appointment.notificationEmail});
    }
}