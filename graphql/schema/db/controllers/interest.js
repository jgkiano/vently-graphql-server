const models = require('./models');

const {
    Interest,
    Event,
    User
} = models;

const interest = {};

interest.createInterest = async (parentValue, { name }, context) => {
    try {
        const res = await Interest.findOne({ name: name.toLowerCase() });
        if (res) { throw new Error('interest already exists') }
        const newInterest = new Interest({ name: name.toLowerCase() });
        return newInterest.save();
    } catch (e) {
        throw new Error(e)
    }
}

interest.readInterest = async (parentValue, { _id }, context) => {
    if(_id) { return Interest.findById(_id); }
    return Interest.find({});
}

interest.updateInterest = async (parentValue, { _id, name }, context) => {
    try {
        const res = await Interest.findOne({ name: name.toLowerCase() });
        if (res) { throw new Error('interest already exists') }
        return Interest.findByIdAndUpdate(_id, { name: name.toLowerCase() }, { new: true })
    } catch (e) {
        throw new Error(e)
    }
}

interest.deleteInterest = async (parentValue, { _id, name }, context) => {
    try {
        return Interest.findByIdAndUpdate(_id, { isDeleted: true }, { new: true });
    } catch (e) {
        throw new Error(e)
    }
}

interest.getEvents = ({ _id }) => Event.find({ interest: _id });

interest.getUsers = ({ _id }) => User.find({ interests: { $in: [_id] } });

module.exports = interest;
