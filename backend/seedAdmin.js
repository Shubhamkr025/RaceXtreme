require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);

        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('An admin user already exists!');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456789', salt);

        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@racextreme.com',
            username: 'admin',
            phone: '0000000000',
            password: hashedPassword,
            dateOfBirth: '1990-01-01',
            address: 'Admin Setup',
            company: 'ClarityFlow'
        });

        await adminUser.save();
        console.log('Admin user successfully created! You can now log in with:');
        console.log('Email/Username: admin@racextreme.com or admin');
        console.log('Password: 123456789');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin. Make sure your MONGODB_URI is correct in .env!');
        console.error(err.message);
        process.exit(1);
    }
};

seedAdmin();
