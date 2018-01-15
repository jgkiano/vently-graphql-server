const models = require('./models');
const moment = require('moment');

const {
    Event,
    Interest
} = models;

const event = {};

const DAYS_BEFORE_EVENT = 14;

event.createEvent = async (parentValue, args, context) => {
    const { startDate, endDate, interest } = args;
    const eventStartDate = moment(startDate);
    const eventEndDate = moment(endDate);
    const currentTime = moment();
    if(eventStartDate.diff(currentTime, 'days') < DAYS_BEFORE_EVENT) {
        throw new Error(`event must start atleast ${DAYS_BEFORE_EVENT} days before the current date`)
    }
    if(eventEndDate.isBefore(eventStartDate)) {
        throw new Error(`event start date must be greater than event end date`);
    }
    if(!( await Interest.findById(interest))) {
        throw new Error(`invalid interest provided`);
    }
    const newEvent = new Event(args);
    return newEvent.save();
}


module.exports = event;
