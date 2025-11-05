const axios = require('axios');
const BASE_URL = 'http://localhost:3000/api';

const manualTests = async () => {
    console.log('🧪 MANUAL API TESTING\n');

    // Test 1: Server status
    try {
        const response = await axios.get(`${BASE_URL}/test`);
        console.log('✅ GET /api/test:', response.data);
    } catch (error) {
        console.log('❌ GET /api/test failed:', error.message);
    }

    // Test 2: Database test
    try {
        const response = await axios.get(`${BASE_URL}/db-test`);
        console.log('✅ GET /api/db-test:', response.data);
    } catch (error) {
        console.log('❌ GET /api/db-test failed:', error.message);
    }

    console.log('\n📋 Manual Testing Complete!');
};

// Install axios first if needed
manualTests();