const casual = require('casual');

const mock = {};
const MAXNUMBER = 5;
const MINNUMBER = 3;

mock.users = (single = false) => genMock(single, 'user');

mock.events = (single = false) => genMock(single, 'event');

mock.tickets = (single = false) => genMock(single, 'ticket');

mock.transactions = (single = false) => genMock(single, 'transaction');

mock.eventManagers = (single = false) => genMock(single, 'eventManager');

mock.interests = (single = false) => genMock(single, 'interest');

const genMock = (single, mockType) => {
    const randNumber = casual.integer(from = MINNUMBER, to = MAXNUMBER);
    let arr = [];
    switch (mockType) {
        case 'user':
            if(single) { return getUser(); }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getUser());
            }
            return arr;
        case 'event':
            if(single) { return getEvent(); }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getEvent());
            }
            return arr;
        case 'ticket':
            if(single) { return getTicket(); }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getTicket());
            }
            return arr;
        case 'transaction':
            if(single) { return getTransaction(); }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getTransaction());
            }
            return arr;
        case 'eventManager':
            if(single) { return getEventManager(); }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getEventManager());
            }
            return arr;
        case 'interest':
            if(single) { return getInterest();  }
            for (var i = 0; i < randNumber; i++) {
                arr.push(getInterest());
            }
            return arr;
        default:
    }
}

const getUser = () => ({
    _id: casual.uuid,
    firstName: casual.first_name,
    lastName: casual.last_name,
    phoneNumber: casual.phone,
    email: casual.email.toLowerCase(),
    gender: casual.coin_flip ? 'male' : 'female',
    verificationCode: casual.integer(from = 1000, to = 10000),
    isActivated: casual.coin_flip
})

const getEvent = () => ({
    _id: casual.uuid,
    name: casual.words(n = 5),
    startDate: casual.moment,
    endDate: casual.moment,
    locationName: casual.street,
    lat: casual.latitude,
    lng: casual.longitude,
    okhi: 'http://okhi.co/🎉',
    description: casual.sentences(n = 6),
    bannerUrl: 'http://via.placeholder.com/1080x1920',
    isActive: casual.coin_flip,
    isClosed: casual.coin_flip,
    isFree: casual.coin_flip,
})

const getTicket = () => ({
    _id: casual.uuid,
    type: casual.coin_flip ? 'vip' : 'ordinary',
    price: casual.integer(from = 100, to = 1000),
    currency: 'KES'
});

const getTransaction = () => ({
    _id: casual.uuid,
    reference: casual.uuid,
    date: casual.moment,
    amount: casual.integer(from = 700, to = 5000),
    paymentMethod: casual.card_type,
    status: casual.coin_flip ? 'complete' : 'pending',
});

const getEventManager = () => ({
    _id: casual.uuid,
    firstName: casual.first_name,
    lastName: casual.last_name,
    phoneNumber: casual.phone,
    email: casual.email.toLowerCase(),
    gender: casual.coin_flip ? 'male' : 'female',
    verificationCode: casual.integer(from = 1000, to = 10000),
    isActivated: casual.coin_flip
});

const getInterest = () => ({
    _id: casual.uuid,
    name: casual.color_name
});

module.exports = mock;
