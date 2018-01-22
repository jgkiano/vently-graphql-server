const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;

//so mongoose can stop throwing that warning
mongoose.Promise = global.Promise;

const transactionSchema = new Schema({
    transactionReference: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    transactionAmount: {
        type: Number,
        required: true
    },
    transactionPaymentMethod: {
        type: String,
        required: true,
        default: 'N/A'
    },
    status: {
        type: String,
        required: true,
        default: 'placed'
    },
    userId: {
        type: String,
        required: true
    },
    eventId: {
        type : mongoose.Schema.Types.ObjectId, ref: 'Event',
        required: true
    },
    tickets: [
        {
            eventTicket: {
                type : mongoose.Schema.Types.ObjectId, ref: 'EventTickets',
                required: true
            },
            totalTickets: {
                type: Number,
                required: true
            }
        }
    ],
    merchantRequestId: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    checkoutRequestId: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    responseDescription: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    responseCode: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    resultDescription: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    resultCode: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    customerMessage: {
        type: String,
        required: true,
        default: 'no message provided'
    },
    mpesaReceiptNumber: {
        type: String,
        required: true,
        default: 'awaiting'
    },
    mpesaTransactionDate: {
        type: Date
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
