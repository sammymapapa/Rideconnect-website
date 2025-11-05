const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register endpoint (for both passengers and basic drivers)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, userType, licenseNumber, vehicleType, vehicleNumber } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            phone,
            userType,
            ...(userType === 'driver' && { licenseNumber, vehicleType, vehicleNumber })
        });

        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Enhanced Driver Registration endpoint
router.post('/register/driver', async (req, res) => {
    try {
        const {
            firstName, lastName, email, password, phone, idNumber,
            address, city, county, emergencyContact,
            vehicleType, vehicleMake, vehicleModel, vehicleYear, 
            vehicleColor, licensePlate, licenseNumber
        } = req.body;

        console.log('🔍 Driver registration attempt:', { email, phone, idNumber });

        // Check if user already exists with email, phone, or ID
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }, { idNumber }] 
        });
        
        if (existingUser) {
            let conflictField = '';
            if (existingUser.email === email) conflictField = 'email';
            else if (existingUser.phone === phone) conflictField = 'phone';
            else if (existingUser.idNumber === idNumber) conflictField = 'ID number';
            
            return res.status(400).json({ 
                message: `User with this ${conflictField} already exists` 
            });
        }

        // Parse emergency contact if it's a string
        let emergencyContactData;
        try {
            emergencyContactData = typeof emergencyContact === 'string' 
                ? JSON.parse(emergencyContact) 
                : emergencyContact;
        } catch (parseError) {
            return res.status(400).json({ 
                message: 'Invalid emergency contact data' 
            });
        }

        // Create new driver user
        const user = new User({
            // Personal Information
            firstName,
            lastName,
            email,
            password,
            phone,
            idNumber,
            address,
            city,
            county,
            emergencyContact: emergencyContactData,
            userType: 'driver',
            
            // Vehicle Details
            vehicleType,
            vehicleMake,
            vehicleModel,
            vehicleYear: vehicleYear ? parseInt(vehicleYear) : undefined,
            vehicleColor,
            licensePlate,
            licenseNumber,
            
            // Default driver status
            isVerified: false,
            verificationStatus: 'pending',
            isAvailable: false,
            rating: 0,
            totalRides: 0,
            totalEarnings: 0
        });

        await user.save();
        console.log('✅ Driver registered successfully:', user._id);

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Driver registration submitted successfully! Your account will be activated after verification.',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                userType: user.userType,
                verificationStatus: user.verificationStatus,
                city: user.city
            }
        });
    } catch (error) {
        console.error('❌ Driver registration error:', error);
        res.status(500).json({ 
            message: 'Registration failed', 
            error: error.message 
        });
    }
});

// Login endpoint (updated to handle both passenger and driver)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if driver is verified (only for drivers)
        if (user.userType === 'driver' && !user.isVerified) {
            return res.status(403).json({ 
                message: 'Your driver account is pending verification. Please wait for approval.' 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data based on type
        const userResponse = {
            id: user._id,
            email: user.email,
            userType: user.userType,
            ...(user.firstName && { firstName: user.firstName, lastName: user.lastName }),
            ...(user.name && { name: user.name }), // For backward compatibility
            ...(user.userType === 'driver' && {
                isVerified: user.isVerified,
                verificationStatus: user.verificationStatus,
                isAvailable: user.isAvailable,
                rating: user.rating,
                totalRides: user.totalRides
            })
        };

        res.json({
            message: 'Login successful',
            token,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user (updated for enhanced user data)
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build comprehensive user response
        const userResponse = {
            id: user._id,
            email: user.email,
            phone: user.phone,
            userType: user.userType,
            createdAt: user.createdAt,
            // Handle both name formats for backward compatibility
            ...(user.firstName && { firstName: user.firstName, lastName: user.lastName }),
            ...(user.name && { name: user.name }),
            // Driver-specific fields
            ...(user.userType === 'driver' && {
                isVerified: user.isVerified,
                verificationStatus: user.verificationStatus,
                isAvailable: user.isAvailable,
                rating: user.rating,
                totalRides: user.totalRides,
                totalEarnings: user.totalEarnings,
                // Vehicle information
                ...(user.vehicleType && { 
                    vehicleType: user.vehicleType,
                    vehicleMake: user.vehicleMake,
                    vehicleModel: user.vehicleModel,
                    vehicleYear: user.vehicleYear,
                    vehicleColor: user.vehicleColor,
                    licensePlate: user.licensePlate
                }),
                // Location information
                ...(user.city && {
                    city: user.city,
                    county: user.county,
                    address: user.address
                }),
                // Emergency contact
                ...(user.emergencyContact && {
                    emergencyContact: user.emergencyContact
                })
            })
        };

        res.json({ user: userResponse });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Update driver availability
router.patch('/driver/availability', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user || user.userType !== 'driver') {
            return res.status(403).json({ message: 'Only drivers can update availability' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your account first' });
        }

        const { isAvailable, currentLocation } = req.body;
        
        const updateData = {};
        if (typeof isAvailable === 'boolean') {
            updateData.isAvailable = isAvailable;
        }
        if (currentLocation) {
            updateData.currentLocation = currentLocation;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id, 
            updateData, 
            { new: true }
        ).select('-password');

        res.json({
            message: 'Availability updated successfully',
            user: {
                id: updatedUser._id,
                isAvailable: updatedUser.isAvailable,
                currentLocation: updatedUser.currentLocation
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get driver profile (public endpoint)
router.get('/driver/:id', async (req, res) => {
    try {
        const driver = await User.findById(req.params.id)
            .select('firstName lastName rating totalRides vehicleType vehicleMake vehicleModel isVerified')
            .where('userType').equals('driver')
            .where('isVerified').equals(true);

        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json({
            driver: {
                id: driver._id,
                firstName: driver.firstName,
                lastName: driver.lastName,
                rating: driver.rating,
                totalRides: driver.totalRides,
                vehicleType: driver.vehicleType,
                vehicleMake: driver.vehicleMake,
                vehicleModel: driver.vehicleModel
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;