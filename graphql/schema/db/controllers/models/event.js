const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

//so mongoose can stop throwing that warning
mongoose.Promise = global.Promise;

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    okhi: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    bannerUrl: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
        default: false
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    isFree: {
        type: Boolean,
        required: true
    },
    tickets: [{
        type: { type: String, required: true },
        price: { type: Number, required: true },
        ticketsLeft: { type: Number, required: true }
    }],
    interest: {
        type : mongoose.Schema.Types.ObjectId, ref: 'Interest',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
