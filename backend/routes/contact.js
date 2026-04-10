const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST api/contact
// @desc    Store contact message in MongoDB
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message, isCallbackRequested } = req.body;

        // Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        const newContact = new Contact({
            name, email, phone, subject, message, isCallbackRequested
        });

        const savedContact = await newContact.save();
        res.status(201).json(savedContact);

    } catch (err) {
        console.error('Contact Submission Error:', err.message);
        res.status(500).json({ error: 'Failed to send message', details: err.message });
    }
});

module.exports = router;
