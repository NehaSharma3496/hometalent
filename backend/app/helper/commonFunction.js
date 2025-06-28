const { ActivityLogs } = require('../models');
const formatPrettyDate = async (value) => {
    const d = new Date(value);
    const day = d.getDate();
    const suffix = ["th", "st", "nd", "rd"][(day % 10 > 3 || ~~(day % 100 / 10) == 1) ? 0 : day % 10];
    const dayWithSuffix = `${day}${suffix}`;
    const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
    const month = d.toLocaleDateString('en-GB', { month: 'long' });
    const year = d.getFullYear();
    return `${weekday}, ${dayWithSuffix} ${month} ${year}`;
}

const logActivity = async ({user_id, action, request = null, response = null}) => {
    try {
        await ActivityLogs.create({
            user_id,
            action,
            request: typeof request === 'object' ? JSON.stringify(request) : request,
            response: typeof response === 'object' ? JSON.stringify(response) : response,
        });
        return true;
    } catch (error) {
        console.error("Error logging activity:", error);
        return false;
    }
};

module.exports = { formatPrettyDate, logActivity }