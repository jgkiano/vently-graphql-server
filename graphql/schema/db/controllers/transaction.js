const models = require('./models');

const {
    Transaction
} = models;

const transaction = {};

transaction.getAllUserTransactions = async ({ _id }) => {
    return Transaction.find({ userId: _id });
}

module.exports = transaction;
