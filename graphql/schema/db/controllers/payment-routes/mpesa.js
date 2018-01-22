const express = require('express');
const moment = require('moment');
const routes = express();
const config = require('../config');
const models = require('../models');
const { Transaction, Ticket, EventTickets } = models;

routes.post('/', async (req, res) => {
    const updatedTransResult = await updateTransaction(req.body.Body.stkCallback);
    const resultCode = req.body.Body.stkCallback.ResultCode;
    if(updatedTransResult && resultCode === 0) {
        generateTickets(updatedTransResult);
    } else {
        console.log('failed transaction');
    }
});

const updateTransaction = async (transaction) => {
    const {
        MerchantRequestID,
        CheckoutRequestID,
        ResultCode,
        ResultDesc,
        CallbackMetadata
     } = transaction;
    const query = {
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID
    };
    const update = {
        resultDescription: ResultDesc,
        resultCode: ResultCode,
        mpesaReceiptNumber: CallbackMetadata ? CallbackMetadata.Item[1].Value : 'n/a',
        mpesaTransactionDate: CallbackMetadata ? moment(CallbackMetadata.Item[3].Value) : moment(),
        status: ResultCode === 0 ? 'completed' : 'failed'
    }
    const updatedTrans = await Transaction.findOneAndUpdate(query, update, { new: true });
    if(updatedTrans) { return updatedTrans; }
    return false;
}

const generateTickets = async (transaction) => {
    const { _id, userId, tickets, status, eventId } = transaction;
    try {
        if( !(await Ticket.findOne({ transactionId: _id })) ) {
            if(status === 'completed') {
                for (let { eventTicket, totalTickets } of tickets) {
                    let ticketsToBeCreated =  [];
                    for (var i = 0; i < totalTickets; i++) {
                        ticketsToBeCreated.push({
                            eventTicket,
                            originalOwner: userId,
                            currentOwner: userId,
                            transactionId: _id,
                            eventId
                        });
                    }
                    for (let ticket of ticketsToBeCreated) {
                        let newTicket = new Ticket(ticket)
                        await newTicket.save();
                        console.log('ticket generated');
                    }
                }
                deductTicketsLeft(tickets);
            } else {
                console.log('transaction failed. can not generate tickets');
            }
        } else {
            console.log('tickets with this transaction has already been generated');
        }
    } catch (e) {
        console.log(e);
    }
}

const deductTicketsLeft = async (tickets) => {
    try {
        for (let { eventTicket, totalTickets } of tickets) {
            let { ticketsLeft } = await EventTickets.findById(eventTicket);
            let updatedTicketsLeft = ticketsLeft - totalTickets;
            if(updatedTicketsLeft < 0) { throw new Error('tickets left can not be less than 0'); }
            await EventTickets.findByIdAndUpdate(eventTicket, { ticketsLeft: updatedTicketsLeft });
        }
        console.log('tickets deducted');
    } catch (e) {
        console.log(e);
    }
}

module.exports = routes;
