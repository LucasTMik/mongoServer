require('dotenv').config();

// Load sereer
if(process.env.NODE_ENV === 'production') {
    require('../dist/index.js');
} else {
    require('../src/index.js');
}