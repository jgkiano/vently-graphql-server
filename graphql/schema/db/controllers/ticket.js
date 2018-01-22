const models = require('./models');

const {
    Ticket,
    Event,
    EventTickets,
    User,
    Transaction
} = models;

const MAX_TICKETS_USER_SHOULD_HAVE = 5;
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
    return Ticket.find({ currentOwner: _id, isClaimed: false });
}

ticket.updateEventTickets = async (parentValue, args, context) => {
    const { _id, type, description, ticketsLeft } = args;
    const eventTicket = await EventTickets.findById(_id);
    if(!eventTicket) {
        throw new Error('invalid event ticket type provided');
    }
    if(type) {
        const { eventId } = eventTicket;
        const eventTickets = await EventTickets.find({ eventId });
        eventTickets.forEach((eventTicket) => {
            if(eventTicket.type === type.toLowerCase()) {
                throw new Error('event type already exists');
            }
        });
    }
    if(ticketsLeft < 0) {
        throw new Error('ticketsLeft can not be less than 0');
    }
    return EventTickets.findByIdAndUpdate(_id,args,{new:true});
}

ticket.readTicket = async(parentValue, { _id }, context) => {
    return Ticket.findById(_id);
}

ticket.getTicketInfo = async({ eventTicket }, args, context) => {
    return EventTickets.findById(eventTicket);
}

ticket.getOriginalOwner = async ({ originalOwner }, args, context) => {
    return User.findById(originalOwner);
}

ticket.getCurrentOwner = async ({ currentOwner }, args, context) => {
    return User.findById(currentOwner);
}

ticket.getEventManager = async ({ eventTicket }, args, context) => {
    try {
        const { eventId } = await EventTickets.findById(eventTicket);
        const { eventManager } = await Event.findById(eventId).populate('eventManager');
        return eventManager;
    } catch (e) {
        throw new Error(e);
    }
}

ticket.getEvent = async ({ eventTicket }, args, context) => {
    try {
        const { eventId } = await EventTickets.findById(eventTicket).populate('eventId');
        return eventId;
    } catch (e) {
        throw new Error(e);
    }
}

ticket.getTransaction = async ({ transactionId }, args, context) => Transaction.findById(transactionId);

ticket.transferTicket = async (parentValue, args, context) => {
    try {
        const { userId, ticketId, phoneNumber, userName, email } = args;
        //not enough info
        if(!phoneNumber && !userName && !email) { return { responseCode: 3000 }; }
        let partyB = null;
        if(phoneNumber && !partyB) { partyB = await User.findOne({ phoneNumber }); }
        if(userName && !partyB) { partyB = await User.findOne({ userName }); }
        if(email && !partyB) { partyB = await User.findOne({ email }); }
        // user not found
        if(!partyB) { return { responseCode: 3001 }; }
        if(partyB._id.equals(userId)) { return { responseCode: 3002 }; }
        const ticket = await Ticket.findById(ticketId);
        if(!ticket) { return { responseCode: 3003 }; }
        const partBTickets = await Ticket.find({ currentOwner: partyB._id, eventId: ticket.eventId });
        if(partBTickets && partBTickets.length >= MAX_TICKETS_USER_SHOULD_HAVE) {
            return { responseCode: 3004 };
        }
        await Ticket.findByIdAndUpdate(ticketId, { currentOwner: partyB._id });
        return { responseCode: 4000 };
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = ticket;
