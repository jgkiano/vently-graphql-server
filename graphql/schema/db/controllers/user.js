const models = require('./models');
const _ = require('lodash');

const {
    User,
    Interest
} = models;

const user = {};

user.createUser = async (parentValue, args, context) => {
    console.log(await validateProvidedUserInfo(args));
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
        !password ||
        !gender
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

    resp = validateGender(gender);
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
    if (res) { return { error: 'username is already taken'} }
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
