const express = require('express');
const routes = express();
const config = require('../config');
const models = require('../models');
const { Transaction, Ticket } = models;

routes.post('/', async (req, res) => {
    console.log('mpesa hit');
    console.log(req.body);
    res.send('mpesa')
});

module.exports = routes;
