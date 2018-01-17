const config = require('../config');

const paymentConfirmation = async (req, res) => {
    const { pesapal_transaction_tracking_id, pesapal_merchant_reference } = req.query;
    const PesaPal = getPesaPal();
    const paymentStatus = await PesaPal.getPaymentDetails({
        reference: pesapal_merchant_reference,
        transaction: pesapal_transaction_tracking_id
    });
    res.send('hey there you\'ve made a purchase but we dont know' + JSON.stringify(paymentStatus));
}

const getPesaPal = () => {
    const PesaPal = require('pesapaljs').init({
        key: config.pesapalDemoKey,
        secret: config.pesapalDemoSecret,
        debug: true // false in production!
    });
    return PesaPal;
}

module.exports = paymentConfirmation;
