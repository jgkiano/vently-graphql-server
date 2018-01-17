const models = require('./models');
const moment = require('moment');

const {
    Event,
    EventTickets,
    Interest,
    EventManager,
    Ticket
} = models;

const event = {};

const DAYS_BEFORE_EVENT = 14;

event.createEvent = async (parentValue, args, context) => {
    const res = await validateEventDate(args);
    if(res.success) {
        if( !args.eventManagerId || ! (await EventManager.findById(args.eventManagerId)) ) {
            throw new Error('invalid event manager provided');
        }
        const newEvent = new Event({ ...args, eventManager: args.eventManagerId });
        return newEvent.save();
    }
    throw new Error(res.error);
}

event.readEvent = async (parentValue, { _id }, context) => {
    if(_id) { return Event.findById(_id); }
    if(parentValue && parentValue.eventId) { return Event.findById(parentValue.eventId); }
    return Event.find({});
}

event.updateEvent = async (parentValue, args, context) => {
    const { startDate, endDate, interest, tickets, _id } = args;
    const event = await Event.findById(_id);
    const currentTime = moment();
    if(!event) {
        throw new Error('invalid event');
    }
    if(startDate && moment(startDate).diff(currentTime, 'days') < DAYS_BEFORE_EVENT) {
        throw new Error(`event must start atleast ${DAYS_BEFORE_EVENT} days before the current date`);
    }
    if(endDate && moment(endDate).isBefore(moment(event.startDate))) {
        throw new Error(`event start date must be greater than event end date`);
    }
    if( interest && ! (await Interest.findById(interest)) ) {
        throw new Error(`invlaid interest provided`);
    }
    return Event.findByIdAndUpdate(_id, { ...args }, { new: true });
}

event.deleteEvent = async (parentValue, { _id }, context) => {
    return Event.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
}

const validateEventDate = async (event) => {
    const { startDate, endDate, interest } = event;
    const eventStartDate = moment(startDate);
    const eventEndDate = moment(endDate);
    const currentTime = moment();
    if(eventStartDate.diff(currentTime, 'days') < DAYS_BEFORE_EVENT) {
        return { error: `event must start atleast ${DAYS_BEFORE_EVENT} days before the current date` };
    }
    if(eventEndDate.isBefore(eventStartDate)) {
        return { error: `event start date must be greater than event end date` };
    }
    if(! ( await Interest.findById(interest)) ) {
        return { error: `invlaid interest provided` };
    }
    return { success: true };
}

event.getEventTickets = async ({ _id }, args, context) => {
    return EventTickets.find({ eventId: _id });
}

event.getEventManager = async ({ eventManager }) => {
    return EventManager.findById(eventManager);
}

event.getAttendees = async ({ _id }) => {
    const tickets = await Ticket.find({ eventId: _id }).populate('currentOwner');
    if(tickets.length > 0) {
        console.log(tickets);
    }
    return [];
}


module.exports = event;
