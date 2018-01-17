const models = require('./models');

const {
    Ticket,
    Event,
    EventTickets
} = models;

const ticket = {};

ticket.createEventTickets = async (parentValue, args, context) => {
    const { eventId, type, price, ticketsLeft } = args;
    if( ! ( await Event.findById(eventId) ) ) {
        throw new Error('invalid event provided');
    }
    const res =  await EventTickets.findOne({ eventId, type });
    if(res) {
        throw new Error('event type already exists for this event');
    }
    const eventTicket = new EventTickets({ ...args, type: args.type.toLowerCase() });
    return eventTicket.save();
}

ticket.getAllUserTickets = async ({ _id }, args, context) => {
    return Ticket.find({ currentOwner: _id });
}

module.exports = ticket;
