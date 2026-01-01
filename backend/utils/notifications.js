const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a notification for a single user
 */
const createNotification = async (userId, title, message, type = 'system', data = {}) => {
    try {
        await Notification.create({
            user: userId,
            title,
            message,
            type,
            data
        });
        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
};

/**
 * Create a notification for all users (e.g. new product, promotion)
 */
const notifyAllUsers = async (title, message, type = 'promotion', data = {}) => {
    try {
        const users = await User.find({ role: 'customer' }).select('_id');
        const notifications = users.map(user => ({
            user: user._id,
            title,
            message,
            type,
            data
        }));

        await Notification.insertMany(notifications);
        return true;
    } catch (error) {
        console.error('Error fetching users for mass notification:', error);
        return false;
    }
};

module.exports = {
    createNotification,
    notifyAllUsers
};
