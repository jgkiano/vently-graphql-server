const express       = require('express');
const routes        = express();

const confirmationRoute = require('./confirmation');
routes.use('/confirmation', confirmationRoute);

const ipnRoute = require('./ipn');
routes.use('/ipn', ipnRoute);

const mpesaRoute = require('./mpesa');
routes.use('/mpesa', mpesaRoute);

module.exports = routes;
