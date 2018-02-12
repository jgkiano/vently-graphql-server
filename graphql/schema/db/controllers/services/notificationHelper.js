const config = require('./config');
const models = require('../models');

const {
    User,
    Ticket
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
                return await transactionSMSNotification(data);
            case 'verificationCode':
                return await verificationCodeSMSNotification(data);
            case 'getVently':
                return await getVently(data);
            case 'ticketTransfer':
                return await ticketTransfer(data);
            default:
                console.log('wtf??');
        }
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

const transactionSMSNotification = async (data) => {
    try {
        const { resultCode, userId, transactionAmount, transactionReference } = data;
        const { firstName, phoneNumber } = await User.findById(userId);
        let message = '';
        if(resultCode === '0') {
            message = `Hi ${firstName}. Your transaction for amount KES ${transactionAmount}.00 is SUCCESSFUL.\nHave fun!`
        } else {
            message = `Hi ${firstName}. Your transaction for amount KES ${transactionAmount}.00 has FAILED. Please contact Vently if you require assistance.`
        }
        sms.send({ to: phoneNumber, message });
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

const verificationCodeSMSNotification = async (data) => {
    try {
        const { firstName, verificationCode, phoneNumber } = data;
        let message = `Hi ${firstName}. Welcome to Vently! Your verification code is: ${verificationCode}`;
        await sms.send({ to: phoneNumber, message });
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

const getVently = async ({ userId, phoneNumber }) => {
    try {
        const { firstName } = await User.findById(userId);
        let message = `Hey there! ${firstName} wants to give you a ticket for an event. Download the Vently app to get it!`;
        await sms.send({ to: phoneNumber, message });
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

const ticketTransfer = async ({ partyA, partyB, ticketId }) => {
    try {
        const sendingUser = await User.findById(partyA);
        const ticketInfo = await Ticket.findById(ticketId).populate('eventId');
        let firstMessage = `Hi ${sendingUser.firstName}. You've SUCCESSFULLY transfered one ticket for ${ticketInfo.eventId.name} to ${partyB.firstName}.`;
        let secondMessage = `Hi ${partyB.firstName}. You've SUCCESSFULLY received one ticket for ${ticketInfo.eventId.name} from ${sendingUser.firstName}.`;
        await sms.send({ to: sendingUser.phoneNumber, message: firstMessage });
        await sms.send({ to: partyB.phoneNumber, message: secondMessage });
        return true;
    } catch (e) {
        throw new Error(e);
    }
}

module.exports = NotificationHelper;
