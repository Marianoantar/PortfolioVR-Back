'use strict';

const mongoose = require('mongoose');
const app = require('./app');

const PORT=3000;

mongoose.connect('mongodb://localhost:27017/portfolio')
.then(() => {
    console.log('Connected to MongoDB');

    // Creacion del Servidor
    app.listen(PORT, () => {
        console.log('Server running on port 3000');
    });
})
 .catch((err) => {
    console.log('Could not connect to MongoDB', err);
});

