const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, username, phone, password, dateOfBirth, address, company } = req.body;

        // Validation for existing user
        let userByEmail = await User.findOne({ email });
        let userByUsername = await User.findOne({ username });

        if (userByEmail) return res.status(400).json({ msg: 'Email is already registered' });
        if (userByUsername) return res.status(400).json({ msg: 'Username is already taken' });

        user = new User({
            firstName, lastName, email, username, phone, password, dateOfBirth, address, company
        });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ error: 'Registration failed', details: err.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verify email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ error: 'Login failed', details: err.message });
    }
});

// Forgot Password – generates a time-limited reset token
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) {
            // Respond with success even if email not found (security best practice)
            return res.json({ msg: 'If that email is registered, a reset link has been sent.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // In production you would email the token. For dev we return it directly.
        res.json({ msg: 'Reset token generated.', token });
    } catch (err) {
        console.error('Forgot Password Error:', err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Reset Password – validates token and updates hashed password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ msg: 'Token and new password are required' });
        if (password.length < 8) return res.status(400).json({ msg: 'Password must be at least 8 characters' });

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        });

        if (!user) return res.status(400).json({ msg: 'Invalid or expired reset token' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.json({ msg: 'Password has been reset successfully. You can now sign in.' });
    } catch (err) {
        console.error('Reset Password Error:', err.message);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;
