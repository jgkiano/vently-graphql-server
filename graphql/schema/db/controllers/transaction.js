const models = require('./models');
const Hashes = require('jshashes');
const moment = require('moment');

const {
    Transaction,
    EventTickets
} = models;

const transaction = {};

transaction.getAllUserTransactions = async ({ _id }) => {
    return Transaction.find({ userId: _id });
}

transaction.createTransaction = async (parentValue, args, context) => {
    const { userId, tickets } = args;
    let transactionAmount = 0;
    let eventTicketInfo = null;
    for ( let { eventTicketId, totalTickets} of tickets) {
        eventTicketInfo = await EventTickets.findById(eventTicketId);
        if(!eventTicketInfo) {
            throw new Error('invalid eventticketid provided')
        }
        transactionAmount = transactionAmount + (eventTicketInfo.price * totalTickets)
    }
    const valueToHash = `${moment().unix()}${transactionAmount}${userId}`;
    const MD5 = new Hashes.MD5;
    const transactionReference = MD5.hex(valueToHash);
    const transaction = new Transaction({ userId, transactionAmount, transactionReference });
    return transaction.save();
}

module.exports = transaction;
