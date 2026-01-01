const express = require('express');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notifications');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

router.route('/')
    .get(getNotifications);

router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
