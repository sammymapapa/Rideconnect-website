const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    // Personal Information (from your form)
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    
    // Location Details (from your form)
    idNumber: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
    },
    
    // Emergency Contact (from your form)
    emergencyContact: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        relationship: {
            type: String,
            required: true
        }
    },
    
    // Profile
    profilePhoto: {
        type: String // URL to uploaded image
    },
    userType: {
        type: String,
        enum: ['passenger', 'driver'],
        required: true
    },
    
    // Driver-specific fields (from your new sections)
    licenseNumber: {
        type: String,
        sparse: true
    },
    vehicleType: {
        type: String,
        enum: ['saloon', 'hatchback', 'suv', 'mpv', 'premium'],
        sparse: true
    },
    vehicleMake: {
        type: String,
        sparse: true
    },
    vehicleModel: {
        type: String,
        sparse: true
    },
    vehicleYear: {
        type: Number,
        sparse: true
    },
    vehicleColor: {
        type: String,
        sparse: true
    },
    licensePlate: {
        type: String,
        sparse: true
    },
    
    // Documents (URLs to uploaded files)
    documents: {
        drivingLicense: String,
        idFront: String,
        idBack: String,
        insurance: String,
        inspection: String
    },
    
    // Verification Status
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    
    // Driver status
    isAvailable: {
        type: Boolean,
        default: false
    },
    currentLocation: {
        lat: Number,
        lng: Number
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRides: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});