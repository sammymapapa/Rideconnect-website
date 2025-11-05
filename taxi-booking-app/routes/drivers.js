const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get available drivers
router.get('/available', async (req, res) => {
    try {
        const drivers = await User.find({
            userType: 'driver',
            isAvailable: true
        }).select('name vehicleType vehicleNumber currentLocation rating');

        res.json({ drivers });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;