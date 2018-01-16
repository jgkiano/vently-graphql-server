const models = require('./models');

const {
    Ticket,
    Event
} = models;

const ticket = {};

const MAX_AMOUNT_OF_TICKETS_TO_BE_GENERATED = 100;

ticket.createTickets = async (parentValue, args, context) => {
    const { eventId, tickets } = args;
    if( ! (await Event.findById(eventId)) ) {
        throw new Error('event provided is invalid');
    }
    tickets.forEach((ticket) => {
        if(!ticket.type || !ticket.price || !ticket.amountToBeGenerated) {
            throw new Error('invalid ticket parameters');
        }
        if(!tickets.amountToBeGenerated > MAX_AMOUNT_OF_TICKETS_TO_BE_GENERATED) {
            throw new Error('tickets to be generated for a specific type has exceeded the maximum limit allowed');
        }
    });
    let tempTickets = [];
    let newTicket = null;
    try {
        for (let ticket of tickets) {
            const { type, price, amountToBeGenerated } = ticket;
            for (var i = 0; i < amountToBeGenerated; i++) {
                tempTickets.push({ type, price });
            }
            for (let tempTicket of tempTickets) {
                newTicket = new Ticket({ ...tempTicket, eventId });
                await newTicket.save();
                console.log('ticket generated');
            }
            tempTickets = [];
        }
        return Event.findById(eventId);
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = ticket;
