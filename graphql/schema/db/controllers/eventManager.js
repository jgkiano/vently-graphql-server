const models = require('./models');
const crypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const casual = require('casual');

const {
    EventManager,
    Event
} = models;

const eventManager = {};

eventManager.createEventManager = async (parentValue, args, context) => {
    const { success, error } = await validateProvidedUserInfo(args);
    if(success) {
        try {
            const salt = await crypt.genSalt(10);
            const hash = await crypt.hash(args.password, salt);
            const eventManager = new EventManager({ ...args, password: hash });
            const newEventManager = await eventManager.save();
            const token = jwt.sign({ id: newEventManager._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            return { token };
        } catch (e) {
            throw new Error(e)
        }
    }
    throw new Error(error);
}

eventManager.updateEventManager = async (parentValue, args, context) => {
    const { phoneNumber, email, _id } = args;
    let res = null;
    if(email) {
        res = await validateEmail(email);
        if(res.error) { throw new Error(res.error) }
    }
    if(phoneNumber) {
        res = await validatePhoneNumber(phoneNumber);
        if(res.error) { throw new Error(res.error) }
    }
    if(phoneNumber) {
        return EventManager.findByIdAndUpdate(_id, { ...args, isVerified: false, verificationCode: casual.integer(from = 1000, to = 9999) }, { new: true });
    }
    return EventManager.findByIdAndUpdate(_id, { ...args }, { new: true });
}

eventManager.deleteEventManager = async (parentValue, { _id }, context) => {
    return EventManager.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
}

eventManager.readEventManager = async (parentValue, { _id }, context ) => {
    if(_id) { return EventManager.findById(_id); }
    return EventManager.find({});
}

eventManager.getEvents = async ({ _id }) => {
    return Event.find({ eventManager: _id });
}

const validateProvidedUserInfo = async (eventManager) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
    } = eventManager;

    if (
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !email ||
        !password
    ) { return { error: 'missing required infomation' } }

    let resp = null;

    resp = await validateEmail(email);
    if(resp.error) { return resp };

    resp = await validatePhoneNumber(phoneNumber);
    if(resp.error) { return resp };

    resp = validatePassword(password);
    if(resp.error) { return resp };

    return { success: true };
}

const validateEmail = async (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email.toLowerCase())) {
        const res = await EventManager.findOne({ email });
        if (res) { return { error: 'email address is already in use'} }
        return { success: true };
    } else {
        return { error: 'invalid email pattern'}
    }
}

const validatePhoneNumber = async (phoneNumber) => {
    const res = await EventManager.findOne({ phoneNumber });
    if (res) { return { error: 'phone number is already in use'} }
    return { success: true };
}

const validatePassword = (password) => {
    const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if(re.test(password)) {
        return { success: true };
    }
    return { error: 'password is too weak, must be have atleast one number, one lowercase and one uppercase letter and minimum of six characters'}
}

const validateGender = (gender) => {
    if(gender.toLowerCase() === 'male' || gender.toLowerCase() === 'female' || gender.toLowerCase() === 'other') {
        return { success: true };
    }
    return { error: 'please provide a valid gender format' };
}

module.exports = eventManager;
