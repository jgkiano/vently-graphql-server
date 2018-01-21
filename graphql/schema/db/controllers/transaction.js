const axios = require('axios');
const models = require('./models');
const Hashes = require('jshashes');
const moment = require('moment');
const config = require('./config');

const {
    Transaction,
    EventTickets,
    User,
    Event,
    Ticket
} = models;

const MAX_TICKETS_USER_SHOULD_HAVE = 5;
const SAFCOM_OAUTH_ENDPOINT = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const SAFCOM_LNMO_REQUEST_ENDPOINT = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

const transaction = {};

transaction.getAllUserTransactions = async ({ _id }) => {
    return Transaction.find({ userId: _id });
}

transaction.createTransaction = async (parentValue, args, context) => {
    const { userId, tickets } = args;
    if(!tickets || tickets.length === 0) { throw new Error('please provide tickets to purchase'); }
    try {
        const user = await User.findById(userId);
        if(!user) { throw new Error('user does not exist'); }
        const eventInfo = await getEventInfo(tickets);
        let ticketsUserWillHave = 0;
        tickets.forEach(({ totalTickets }) => {
            ticketsUserWillHave = ticketsUserWillHave + totalTickets;
        });
        const existingTickets = await Ticket.find({ currentOwner: userId, eventId: eventInfo._id });
        ticketsUserWillHave = ticketsUserWillHave + existingTickets.length;
        if(ticketsUserWillHave > MAX_TICKETS_USER_SHOULD_HAVE) {
            throw new Error(`Maximum number of tickets owned exceeded. You can not own more than ${MAX_TICKETS_USER_SHOULD_HAVE} tickets per event`);
        }
        await checkIfTicketsAvailable(tickets);
        const transactionAmount = await calculateTransactionTotal(tickets);
        const transactionReference = generateTransactionRef(transactionAmount, userId);
        const transaction = new Transaction({
            transactionReference,
            transactionAmount,
            transactionPaymentMethod: 'LNMO',
            userId: user._id,
            tickets,
            eventId: eventInfo._id
        });
        const newTransaction = await transaction.save();
        const status = await requestLipaNaMpesaOnline(newTransaction, user);
        if(status) { return { transactionRequestStatus: true }; }
        return { transactionRequestStatus: false };
    } catch (e) {
        throw new Error(e);
    }
}

requestLipaNaMpesaOnline = async (transaction, user) => {
    try {
        const safcomAuthToken = await getSafcomAuthToken();
        const requestPayload = config.genMpesaRequestPayload(transaction._id, user.phoneNumber, 1); // remember to change transaction amount from 1 to transaction.transactionAmount
        const { data } = await axios.post(SAFCOM_LNMO_REQUEST_ENDPOINT, requestPayload, {
            headers: {
                Authorization: `Bearer ${safcomAuthToken}`
            }
        });
        const { MerchantRequestID, CheckoutRequestID, ResponseCode, ResponseDescription, CustomerMessage } = data;
        const updatedTransaction = await Transaction.findByIdAndUpdate(transaction._id, {
            merchantRequestId: MerchantRequestID,
            checkoutRequestId: CheckoutRequestID,
            responseDescription: ResponseDescription,
            responseCode: ResponseCode,
            customerMessage: CustomerMessage
        }, { new: true });
        if(updatedTransaction.responseCode !== "0") {
            return false;
        }
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

getSafcomAuthToken = async () => {
    const { safcomAuthBase64 } = config;
    try {
        const resp = await axios.get(SAFCOM_OAUTH_ENDPOINT, {
            headers: {
                Authorization: safcomAuthBase64
            }
        });
        return resp.data.access_token
    } catch (e) {
        throw new Error(e);
    }
}

const getEventInfo = async (tickets) => {
    try {
        const [ { eventTicket } ] = tickets;
        const { eventId } = await EventTickets.findById(eventTicket);
        const eventInfo = await Event.findById(eventId);
        return eventInfo;
    } catch (e) {
        throw new Error(e);
    }
}

const calculateTransactionTotal = async (tickets) => {
    try {
        let transactionAmount = 0;
        for ( let { eventTicket, totalTickets} of tickets) {
            let eventTicketInfo = await EventTickets.findById(eventTicket);
            if(!eventTicketInfo) {
                throw new Error('invalid eventticketid provided')
            }
            transactionAmount = transactionAmount + (eventTicketInfo.price * totalTickets)
        }
        return transactionAmount;
    } catch (e) {
        throw new Error(e);
    }
}

const generateTransactionRef = (transactionAmount, userId) => {
    const MD5 = new Hashes.MD5;
    return MD5.hex(`${moment().unix()}${transactionAmount}${userId}`);
}

const checkIfTicketsAvailable = async (tickets) => {
    for (let { eventTicket, totalTickets } of tickets) {
        let { ticketsLeft } = await EventTickets.findById(eventTicket);
        if(totalTickets > ticketsLeft) { throw new Error('ticket request has exceeded the number of tickets left'); }
    }
    return true;
}

module.exports = transaction;
