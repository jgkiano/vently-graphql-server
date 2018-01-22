const _ = require('lodash');
const crypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const models = require('./models');

const {
    User,
    Interest,
    Ticket,
    Event
} = models;

const user = {};

user.createUser = async (parentValue, args, context) => {
    const { success, error } = await validateProvidedUserInfo(args);
    if(success) {
        try {
            const salt = await crypt.genSalt(10);
            const hash = await crypt.hash(args.password, salt);
            const user = new User({ ...args, password: hash });
            const newUser = await user.save();
            const token = jwt.sign({ id: newUser._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            return { token };
        } catch (e) {
            throw new Error(e)
        }
    }
    throw new Error(error);
}

user.readUser = async (parentValue, { _id }, context) => {
    if(_id) { return User.findById(_id); }
    return User.find({});
}

user.updateUser = async (parentValue, args, context) => {
    const { _id, userName, firstName, lastName, phoneNumber, email, password, gender, interests } = args;
    let res = null;
    if(userName) {
        res = await validateUserName(userName);
        if(!res.success) { throw new Error(res.error); }
    }
    if(phoneNumber) {
        res = await validatePhoneNumber(phoneNumber);
        if(!res.success) { throw new Error(res.error); }
    }
    if(email) {
        res = await validateEmail(email);
        if(!res.success) { throw new Error(res.error); }
    }
    if(password) {
        res = validatePassword(password);
        if(!res.success) { throw new Error(res.error); }
    }
    if(gender) {
        res = validateGender(gender);
        if(!res.success) { throw new Error(res.error); }
    }
    if(interests) {
        res = await validateInterests(interests);
        if(!res.success) { throw new Error(res.error); }
    }
    if(password) {
        try {
            const salt = await crypt.genSalt(10);
            const hash = await crypt.hash(args.password, salt);
            return User.findByIdAndUpdate(_id, {...args, password: hash}, { new: true });
        } catch (e) {
            throw new Error(e);
        }
    }
    return User.findByIdAndUpdate(_id, {...args}, { new: true });
}

user.deleteUser = async (parentValue, { _id }, context) => {
    return User.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
}

user.getInterests = async ({ _id }, args, context) => {
    try {
        const user = await User.findById(_id).populate('interests');
        if(user) { return user.interests }
        throw new Error('user does not exist');
    } catch (e) {
        throw new Error(e);
    }
}

user.getAttendingEvents = async (parentValue) => {
    try {
        const userId = parentValue._id;
        const userTickets = await Ticket.find({ currentOwner: userId });
        if(userTickets.length === 0) { return []; }
        const eventIds = await Ticket.distinct('eventId', { currentOwner: userId });
        const events = [];
        for( let eventId of eventIds ) {
            let event = await Event.findById(eventId);
            let tickets = userTickets.reduce((arr, userTicket) => {
                if(userTicket.eventId.equals(eventId)) {
                    arr.push(userTicket);
                    return arr;
                }
                return arr;
            },[]);
            events.push({ event, tickets });
        }
        return events;
    } catch (e) {
        throw new Error(e);
    }
}

user.verifyUser = async (parentValue, args, context) => {
    try {
        const { _id, verificationCode } = args;
        const user = await User.findById(_id);
        if(user.isVerified) { throw new Error('user is already verified'); }
        if(user.verificationCode === verificationCode) {
            return User.findByIdAndUpdate(_id, { isVerified: true });
        }
        throw new Error('invalid verification code');
    } catch (e) {
        throw new Error(e);
    }
}

const validateProvidedUserInfo = async (user) => {
    const {
        userName,
        firstName,
        lastName,
        phoneNumber,
        email,
        password,
        gender,
        interests
    } = user;

    if (
        !userName ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !email ||
        !password
    ) { return { error: 'missing required infomation' } }

    let resp = null;

    resp = await validateUserName(userName);
    if(resp.error) { return resp };

    resp = await validateEmail(email);
    if(resp.error) { return resp };

    resp = await validatePhoneNumber(phoneNumber);
    if(resp.error) { return resp };

    resp = validatePassword(password);
    if(resp.error) { return resp };

    resp = await validateInterests(interests);
    if(resp.error) { return resp };

    return { success: true };
}

const validateUserName = async (userName) => {
    const res = await User.findOne({ userName });
    if (res) { return { error: 'username is already taken'} }
    return { success: true };
}

const validateEmail = async (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email.toLowerCase())) {
        const res = await User.findOne({ email });
        if (res) { return { error: 'email address is already in use'} }
        return { success: true };
    } else {
        return { error: 'invalid email pattern'}
    }
}

const validatePhoneNumber = async (phoneNumber) => {
    const res = await User.findOne({ phoneNumber });
    if (res) { return { error: 'phone number already exists'} }
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

const validateInterests = async (interets) => {
    if(!interets) {
        return { success: true };
    }
    if(interets.length === 0) {
        return { error: 'please provide valid interets or don\'t pass in the property' };
    }
    for (let int of interets) {
        if(!(await Interest.findById(int))) {
            return { error: 'please provide valid interets' };
        }
    }
    return { success: true };
}
module.exports = user;
