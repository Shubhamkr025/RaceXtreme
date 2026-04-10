const express = require('express');
const router = express.Router();
const Car = require('../models/Car');
const User = require('../models/User');

// @route   GET api/dashboard/stats
// @desc    Get live dashboard statistics
// @access  Private (though for now public as we haven't enforced JWT on all routes)
router.get('/stats', async (req, res) => {
    try {
        const carsCount = await Car.countDocuments();
        const usersCount = await User.countDocuments();
        
        // Sum total inventory value
        const cars = await Car.find({});
        const totalValue = cars.reduce((acc, car) => {
            const price = parseFloat(car.price.replace(/[^0-9.]/g, '')) || 0;
            return acc + price;
        }, 0);

        // Get latest 3 cars for the showroom
        const trendingCars = await Car.find().sort({ createdAt: -1 }).limit(3);

        res.json({
            stats: {
                carsCount,
                usersCount,
                totalValue: totalValue.toLocaleString(),
                growth: Math.floor(Math.random() * (30 - 10 + 1)) + 10 // Simulated growth
            },
            trendingCars
        });

    } catch (err) {
        console.error('Dashboard Stats Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
