const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (err) {
        console.error('API Error:', err.message);
        res.status(500).json({ error: 'Database connection or retrieval failed', details: err.message });
    }
});

module.exports = router;
