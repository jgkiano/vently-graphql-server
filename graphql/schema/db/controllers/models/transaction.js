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
    pesapalTransactionId: {
        type: String,
        required: true,
        default: 'n/a'
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
