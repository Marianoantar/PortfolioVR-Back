'use strict';

const express = require('express');

const app = express();
app.use(express.json());

// CARGAR ARCHIVOS DE RUTAS
const project_routes = require('./rutes/project');

// MIDLEWARES



// CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});



// RUTAS
app.use('/api', project_routes);



// Exportar
module.exports = app;