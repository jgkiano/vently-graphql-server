const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

//so mongoose can stop throwing that warning
mongoose.Promise = global.Promise;

const ticketSchema = new Schema({
    eventId: {
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
    type: {
        type: String,
        required: true
    },
    originalOwner: {
        type : mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    currentOwner: {
        type : mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    currentOwner: {
        type : mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    transactionId: {
        type : mongoose.Schema.Types.ObjectId, ref: 'Transaction',
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
