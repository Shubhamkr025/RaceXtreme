require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Testing connection to:', process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@'));
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Success: Connected to MongoDB.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failure:', err.message);
        process.exit(1);
    }
}

testConnection();
