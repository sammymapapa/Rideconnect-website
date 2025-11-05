const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token
const auth = require('../middleware/auth');

// Create a new booking
router.post('/', auth, async (req, res) => {
    try {
        const { pickupLocation, destination, distance, vehicleType } = req.body;
        
        // Calculate fare
        const estimatedFare = Booking.calculateFare(distance, vehicleType);

        const booking = new Booking({
            passenger: req.userId,
            pickupLocation,
            destination,
            distance,
            estimatedFare,
            vehicleType
        });

        await booking.save();
        
        // Populate passenger details
        await booking.populate('passenger', 'name phone');

        res.status(201).json({
            message: 'Booking created successfully',
            booking
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({
            $or: [{ passenger: req.userId }, { driver: req.userId }]
        })
        .populate('passenger', 'name phone')
        .populate('driver', 'name phone vehicleType')
        .sort({ createdAt: -1 });

        res.json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get available bookings for drivers
router.get('/available', auth, async (req, res) => {
    try {
        // Check if user is a driver
        const user = await User.findById(req.userId);
        if (user.userType !== 'driver') {
            return res.status(403).json({ message: 'Only drivers can access this endpoint' });
        }

        const availableBookings = await Booking.find({
            status: 'pending',
            'pickupLocation.lat': { $exists: true },
            'pickupLocation.lng': { $exists: true }
        })
        .populate('passenger', 'name phone rating')
        .sort({ createdAt: -1 });

        res.json({ bookings: availableBookings });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Accept a booking (driver)
router.patch('/:id/accept', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking already accepted' });
        }

        // Update driver availability
        await User.findByIdAndUpdate(req.userId, { isAvailable: false });

        booking.driver = req.userId;
        booking.status = 'accepted';
        await booking.save();

        await booking.populate('driver', 'name phone vehicleType vehicleNumber');

        res.json({ message: 'Booking accepted successfully', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['picked_up', 'in_progress', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Authorization check
        if (booking.passenger.toString() !== req.userId && booking.driver?.toString() !== req.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        booking.status = status;
        
        if (status === 'completed') {
            booking.completionTime = new Date();
            booking.finalFare = booking.estimatedFare; // In real app, calculate based on actual distance/time
            
            // Make driver available again
            if (booking.driver) {
                await User.findByIdAndUpdate(booking.driver, { isAvailable: true });
            }
        }

        await booking.save();

        res.json({ message: 'Booking status updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// In your booking page
async function submitBooking(bookingData) {
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            showBookingConfirmation(result.booking);
        } else {
            // Show error message
            showError(result.message);
        }
    } catch (error) {
        console.error('Booking failed:', error);
        showError('Network error. Please try again.');
    }
}

module.exports = router;