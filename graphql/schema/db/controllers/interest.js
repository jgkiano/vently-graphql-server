const models = require('./models');

const {
    Interest
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

interest.updateInterest = async (parentValue, { _id, name }, context) => {
    try {
        const res = await Interest.findOne({ name: name.toLowerCase() });
        if (res) { throw new Error('interest already exists') }
        return Interest.findByIdAndUpdate(_id, { name: name.toLowerCase() }, { new: true })
    } catch (e) {
        throw new Error(e)
    }
}



module.exports = interest;