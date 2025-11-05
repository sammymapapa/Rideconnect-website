const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 STARTING COMPREHENSIVE BACKEND TEST...\n');

const testBackend = async () => {
    try {
        // Test 1: Database Connection
        console.log('1. Testing MongoDB Connection...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB Connection: SUCCESS\n');

        // Test 2: Environment Variables
        console.log('2. Testing Environment Variables...');
        if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing');
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');
        if (!process.env.PORT) throw new Error('PORT missing');
        console.log('✅ Environment Variables: SUCCESS\n');

        // Test 3: Database Operations (Create test models)
        console.log('3. Testing Database Operations...');
        
        // Create a simple test schema
        const TestSchema = new mongoose.Schema({
            name: String,
            value: Number
        });
        const TestModel = mongoose.model('Test', TestSchema);

        // Test CREATE
        const testDoc = await TestModel.create({ name: 'backend-test', value: 42 });
        console.log('✅ Database CREATE: SUCCESS');

        // Test READ
        const foundDoc = await TestModel.findById(testDoc._id);
        console.log('✅ Database READ: SUCCESS');

        // Test UPDATE
        await TestModel.findByIdAndUpdate(testDoc._id, { value: 100 });
        console.log('✅ Database UPDATE: SUCCESS');

        // Test DELETE
        await TestModel.findByIdAndDelete(testDoc._id);
        console.log('✅ Database DELETE: SUCCESS\n');

        // Test 4: Server API (using HTTP requests)
        console.log('4. Testing Server API Endpoints...');
        const http = require('http');

        // Test basic server response
        const testServer = () => {
            return new Promise((resolve, reject) => {
                const req = http.request({
                    hostname: 'localhost',
                    port: process.env.PORT || 3000,
                    path: '/api/test',
                    method: 'GET'
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const result = JSON.parse(data);
                            if (result.message === 'Server is working!') {
                                resolve('✅ Server API: SUCCESS');
                            } else {
                                reject('Server returned unexpected response');
                            }
                        } catch (e) {
                            reject('Failed to parse server response');
                        }
                    });
                });

                req.on('error', reject);
                req.setTimeout(5000, () => reject('Server request timeout'));
                req.end();
            });
        };

        const serverResult = await testServer();
        console.log(serverResult + '\n');

        // Final Summary
        console.log('🎉 ALL BACKEND TESTS PASSED!');
        console.log('📊 Summary:');
        console.log('   - Database Connection: ✅');
        console.log('   - Environment Variables: ✅');
        console.log('   - Database Operations: ✅');
        console.log('   - Server API: ✅');
        console.log('\n🚀 Your backend is ready for frontend development!');

        process.exit(0);

    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
        process.exit(1);
    }
};

testBackend();