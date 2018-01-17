const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

//so mongoose can stop throwing that warning
mongoose.Promise = global.Promise;

const eventTicketsSchema = new Schema({
    eventId: {
        type : mongoose.Schema.Types.ObjectId, ref: 'Event'
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        default: 'KES'
    },
    ticketsLeft: {
        type: Number,
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

const EventTickets = mongoose.model('EventTickets', eventTicketsSchema);



module.exports = EventTickets;
