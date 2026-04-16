require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors());
app.use(express.json());

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/contact', contactRoutes);

// MongoDB connection
const startServer = async () => {
    try {
        mongoose.set('bufferCommands', false); // Disable buffering globally
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        console.log('✅ MongoDB Connected...');
        
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('High-level summary: The server could not start because it cannot connect to the database. Check your IP whitelist on MongoDB Atlas.');
        process.exit(1);
    }
};

startServer();
