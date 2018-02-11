const config = require('./config');
const models = require('../models');

const {
    User
} = models;

const {
    africasTalkingOptions
} = config;

const AfricasTalking = require('africastalking')(africasTalkingOptions);
const sms = AfricasTalking.SMS;

const NotificationHelper = {};

const TRANSACTION_MSG = ''

NotificationHelper.sendSMS = async (type, data) => {
    try {
        switch (type) {
            case 'transaction':
                return transactionSMSNotification(data);
            case 'verificationCode':
                return verificationCodeSMSNotification(data);
            default:
                
        }
    } catch (e) {
        console.log(e);
    }
}

const transactionSMSNotification = async (data) => {
    const { resultCode, userId, transactionAmount, transactionReference } = data;
    const { firstName, phoneNumber } = await User.findById(userId);
    let message = '';
    if(resultCode === '0') {
        message = `Hi ${firstName}. Your transaction for amount KES ${transactionAmount}.00 is SUCCESSFUL.\nHave fun!`
    } else {
        message = `Hi ${firstName}. Your transaction for amount KES ${transactionAmount}.00 has FAILED. Please contact Vently if you require assistance.`
    }
    sms.send({ to: phoneNumber, message });
}

const verificationCodeSMSNotification = async (data) => {
    const { firstName, verificationCode, phoneNumber } = data;
    let message = `Hi ${firstName}. Welcome to Vently! Your verification code is: ${verificationCode}`;
    sms.send({ to: phoneNumber, message });
}

module.exports = NotificationHelper;
