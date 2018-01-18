const express       = require('express');
const routes        = express();

const confirmationRoute = require('./confirmation');
routes.use('/confirmation', confirmationRoute);

module.exports = routes;
