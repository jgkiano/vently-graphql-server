const models = require('./models');
const moment = require('moment');

const {
    Event,
    Interest
} = models;

const event = {};

const DAYS_BEFORE_EVENT = 14;

event.createEvent = async (parentValue, args, context) => {
    const res = await validateEventDate(args);
    if(res.success) {
        const newEvent = new Event(args);
        return newEvent.save();
    }
    throw new Error(res.error);
}

event.readEvent = async (parentValue, { _id }, context) => {
    if(_id) { return Event.findById(_id); }
    return Event.find({});
}

event.updateEvent = async (parentValue, args, context) => {
    const { startDate, endDate, interest, _id } = args;
    const event = await Event.findById(_id);
    const currentTime = moment();
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


module.exports = event;
