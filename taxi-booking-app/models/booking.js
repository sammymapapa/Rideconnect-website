const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true
    },
    pickupLocation: {
        address: String,
        lat: Number,
        lng: Number
    },
    destination: {
        address: String,
        lat: Number,
        lng: Number
    },
    distance: {
        type: Number, // in kilometers
        required: true
    },
    estimatedFare: {
        type: Number,
        required: true
    },
    finalFare: {
        type: Number
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'driver_assigned', 'picked_up', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    bookingTime: {
        type: Date,
        default: Date.now
    },
    pickupTime: Date,
    completionTime: Date,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'mobile_money']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    review: String
}, {
    timestamps: true
});

// Calculate fare based on distance
bookingSchema.statics.calculateFare = function(distance, vehicleType = 'standard') {
    const baseFare = 50; // Base fare
    const perKmRate = {
        'standard': 15,
        'premium': 25,
        'luxury': 40
    }[vehicleType] || 15;
    
    return baseFare + (distance * perKmRate);
};

module.exports = mongoose.model('Booking', bookingSchema);