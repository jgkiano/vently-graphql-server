const models = require('./models');
const Hashes = require('jshashes');
const moment = require('moment');
const config = require('./config');

const {
    Transaction,
    EventTickets,
    User,
    Event
} = models;

const transaction = {};

transaction.getAllUserTransactions = async ({ _id }) => {
    return Transaction.find({ userId: _id });
}

transaction.createTransaction = async (parentValue, args, context) => {
    try {
        const { userId, tickets } = args;
        const user = await User.findById(userId);
        if(!user) { throw new Error('user does not exist'); }
        const eventInfo = await getEventInfo(tickets);
        const transactionAmount = await calculateTransactionTotal(tickets)
        const transactionReference = generateTransactionRef(transactionAmount, userId);
        const transaction = new Transaction({ userId, transactionAmount, transactionReference, tickets });
        const { _id } = await transaction.save();

        const PesaPal = getPesaPal();
        const customer = new PesaPal.Customer(user.email, user.phoneNumber);
        const order = new PesaPal.Order(_id, customer, `${eventInfo.name} tickets`, transactionAmount, "KES", "MERCHANT");
        const url = PesaPal.getPaymentURL(order, "http://localhost:3000/paymentconfirmation");

        return { link: url };
    } catch (e) {
        throw new Error(e);
    }
}

const getEventInfo = async (tickets) => {
    const [ { eventTicket } ] = tickets;
    const { eventId } = await EventTickets.findById(eventTicket);
    const eventInfo = await Event.findById(eventId);
    return eventInfo;
}

const calculateTransactionTotal = async (tickets) => {
    let transactionAmount = 0;
    for ( let { eventTicket, totalTickets} of tickets) {
        let eventTicketInfo = await EventTickets.findById(eventTicket);
        if(!eventTicketInfo) {
            throw new Error('invalid eventticketid provided')
        }
        transactionAmount = transactionAmount + (eventTicketInfo.price * totalTickets)
    }
    return transactionAmount;
}

const generateTransactionRef = (transactionAmount, userId) => {
    const MD5 = new Hashes.MD5;
    return MD5.hex(`${moment().unix()}${transactionAmount}${userId}`);
}

const getPesaPal = () => {
    const PesaPal = require('pesapaljs').init({
        key: config.pesapalDemoKey,
        secret: config.pesapalDemoSecret,
        debug: true // false in production!
    });
    return PesaPal;
}

// const { userId, tickets } = args;
// let transactionAmount = 0;
// let eventTicketInfo = null;
// for ( let { eventTicketId, totalTickets} of tickets) {
//     eventTicketInfo = await EventTickets.findById(eventTicketId);
//     if(!eventTicketInfo) {
//         throw new Error('invalid eventticketid provided')
//     }
//     transactionAmount = transactionAmount + (eventTicketInfo.price * totalTickets)
// }
// const valueToHash = `${moment().unix()}${transactionAmount}${userId}`;
// const MD5 = new Hashes.MD5;
// const transactionReference = MD5.hex(valueToHash);
// const transaction = new Transaction({ userId, transactionAmount, transactionReference });
// return transaction.save();

module.exports = transaction;
