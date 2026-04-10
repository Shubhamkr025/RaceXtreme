const fetch = require('node-fetch');

async function checkCars() {
    try {
        const response = await fetch('http://localhost:5000/api/cars');
        const data = await response.json();
        console.log('--- Car Data from API ---');
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error fetching from API:', err.message);
    }
}

checkCars();
