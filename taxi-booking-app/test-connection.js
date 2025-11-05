const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB Connection...');

// Test connection string (replace with your actual password)
const testConnection = async () => {
    try {
        // Use your actual password here (with @ not %40)
        const uri = 'mongodb+srv://Mapapa:Map123@taxiexpressapp.hwrqwkx.mongodb.net/?retryWrites=true&w=majority&appName=TaxiExpressApp';
        
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    } catch (error) {
        console.log('❌ FAILED: Could not connect');
        console.log('Error:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.log('💡 Check your username and password');
        } else if (error.message.includes('bad auth')) {
            console.log('💡 Authentication failed - wrong username/password');
        } else if (error.message.includes('getaddrinfo')) {
            console.log('💡 Network error - check cluster URL');
        }
        
        process.exit(1);
    }
};

testConnection();