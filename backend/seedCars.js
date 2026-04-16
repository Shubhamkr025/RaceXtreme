require('dotenv').config();
const mongoose = require('mongoose');
const Car = require('./models/Car');

const cars = [
    {
        brand: 'Lamborghini',
        title: 'Aventador SVJ',
        description: 'The ultimate expression of Lamborghini performance, the Aventador SVJ combines ground-breaking design, extraordinary aerodynamics, and a powerful V12 engine.',
        price: 517000,
        speed: 217,
        power: 770,
        acceleration: '2.8',
        performance: 98,
        colorCode: '#EFCA29',
        colorName: 'yellow',
        thumbnail: '/img-1.png'
    },
    {
        brand: 'Bugatti',
        title: 'Chiron Super Sport',
        description: 'A masterpiece of engineering and a true icon of speed. The Bugatti Chiron is designed to redefine the limits of performance and luxury.',
        price: 3300000,
        speed: 304,
        power: 1600,
        acceleration: '2.4',
        performance: 99,
        colorCode: '#3498DB',
        colorName: 'blue',
        thumbnail: '/img-2.png'
    },
    {
        brand: 'Opel',
        title: 'Kapitän 1959',
        description: 'A classic vintage masterpiece. The Opel Kapitän represents a golden era of automotive design, combining elegance with a robust driving experience.',
        price: 45000,
        speed: 90,
        power: 90,
        acceleration: '15.0',
        performance: 40,
        colorCode: '#E74C3C',
        colorName: 'red',
        thumbnail: '/img-3.png'
    }
];

const seedCars = async () => {
    try {
        console.log("Connecting to MongoDB for seeding cars...");
        await mongoose.connect(process.env.MONGODB_URI);

        // Clear existing cars
        await Car.deleteMany();
        console.log('Cleared existing car data.');

        // Insert new cars
        await Car.insertMany(cars);
        console.log('Successfully seeded 3 premium cars!');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding cars:', err.message);
        process.exit(1);
    }
};

seedCars();
