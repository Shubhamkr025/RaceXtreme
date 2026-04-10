const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    speed: { type: Number, required: true },
    power: { type: Number, required: true },
    acceleration: { type: String, required: true },
    performance: { type: Number, required: true },
    colorCode: { type: String },
    colorName: { type: String },
    thumbnail: { type: String, required: true }
});

module.exports = mongoose.model('Car', CarSchema);
