const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressGraphQL = require('express-graphql');
const app = express();
const schema = require('./graphql/schema');
const config = require('./config');

const PORT = process.env.PORT || 3000;
const MONGO_URI = config.mongodb;

//parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true }, () => console.log('connected to mongodb 🎉'));

app.use('/graphql', expressGraphQL({ schema, graphiql: true }));

app.listen(PORT, () => console.log(`houston we have lift off 🚀: ${PORT}`))
