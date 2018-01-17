const graphql = require('graphql');
const casual = require('casual');
const mock = require('./mock');
const controllers = require('./db/controllers');

const {
    interest,
    user,
    event,
    ticket,
    transaction,
    eventManager
} = controllers;

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLFloat,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInputObjectType
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        _id: { type: GraphQLID },
        userName: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        verificationCode: { type: GraphQLInt },
        isVerified: { type: GraphQLBoolean },
        interests: {
            type: new GraphQLList(InterestType),
            resolve: user.getInterests
        },
        tickets: {
            type: new GraphQLList(TicketType),
            resolve: ticket.getAllUserTickets
        },
        transactions: {
            type: new GraphQLList(TransactionType),
            resolve: transaction.getAllUserTransactions
        }
    })
});

const EventTicketsType = new GraphQLObjectType({
    name: 'EventTicketsType',
    fields: () => ({
        _id: { type: GraphQLID },
        eventId: { type: GraphQLID },
        type: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        currency: { type: GraphQLString },
        ticketsLeft: { type: GraphQLInt },
        event: {
            type: EventType,
            resolve: event.readEvent
        }
    })
});

const EventManagerType = new GraphQLObjectType({
    name: 'EventManagerType',
    fields: () => ({
        _id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        email: { type: GraphQLString },
        gender: { type: GraphQLString },
        verificationCode: { type: GraphQLInt },
        isVerified: { type: GraphQLBoolean },
        events: {
            type: new GraphQLList(EventType),
            resolve: eventManager.getEvents
        }
    })
});

const EventType = new GraphQLObjectType({
    name: 'EventType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        locationName: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat },
        okhi: { type: GraphQLString },
        description: { type: GraphQLString },
        bannerUrl: { type: GraphQLString },
        isActive: { type: GraphQLBoolean },
        isClosed: { type: GraphQLBoolean },
        isFree: { type: GraphQLBoolean },
        tickets: {
            type: new GraphQLList(EventTicketsType),
            resolve: event.getEventTickets
        },
        eventManager: {
            type: EventManagerType,
            resolve: event.getEventManager
        },
        attendees: {
            type: new GraphQLList(UserType),
            resolve: event.getAttendees
        }
    })
});

const TicketType = new GraphQLObjectType({
    name: 'TicketType',
    fields: () => ({
        _id: { type: GraphQLID },
        type: { type: GraphQLString },
        price: { type: GraphQLFloat },
        currency: { type: GraphQLString },
        originalOwner: {
            type: UserType,
            resolve(parentValue, args) {
                return mock.users(true)
            }
        },
        currentOwner: {
            type: UserType,
            resolve(parentValue, args) {
                return mock.users(true)
            }
        },
        eventManager: {
            type: EventManagerType,
            resolve(parentValue, args) {
                return mock.eventManagers(true)
            }
        },
        event: {
            type: EventType,
            resolve(parentValue, args) {
                return mock.events(true)
            }
        },
        transaction: {
            type: TransactionType,
            resolve(parentValue, args) {
                return mock.transactions(true)
            }
        }
    })
});

const TransactionType = new GraphQLObjectType({
    name: 'TransactionType',
    fields: () => ({
        _id: { type: GraphQLID },
        reference: { type: GraphQLString },
        date: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        paymentMethod: { type: GraphQLString },
        status: { type: GraphQLID },
        user: {
            type: UserType,
            resolve(parentValue, args) {
                return mock.users(true)
            }
        },
        event: {
            type: EventType,
            resolve(parentValue, args) {
                return mock.events(true)
            }
        },
        tickets: {
            type: GraphQLList(TicketType),
            resolve(parentValue, args) {
                return mock.tickets()
            }
        }
    })
});

const InterestType = new GraphQLObjectType({
    name: 'InterestType',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        events: {
            type: new GraphQLList(EventType),
            resolve(parentValue, args) {
                return mock.events()
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return mock.users()
            }
        }
    })
});

const TokenType = new GraphQLObjectType({
    name: 'TokenType',
    fields: () => ({
        token: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type : UserType,
            args: { _id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: user.readUser
        },
        users: {
            type : GraphQLList(UserType),
            resolve: user.readUser
        },
        event: {
            type: EventType,
            args: { _id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: event.readEvent
        },
        events: {
            type: GraphQLList(EventType),
            resolve: event.readEvent
        },
        eventManager: {
            type: EventManagerType,
            args: { _id: { type: GraphQLID } },
            resolve: eventManager.readEventManager
        },
        eventManagers: {
            type : GraphQLList(EventManagerType),
            resolve: eventManager.readEventManager
        },
        interest: {
            type: InterestType,
            args: { _id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: interest.readInterest
        },
        interests: {
            type: GraphQLList(InterestType),
            resolve: interest.readInterest
        },
        ticket: {
            type: TicketType,
            args: { _id: { type: GraphQLID } },
            resolve(parentValue, args, context) {
                return mock.tickets(true);
            }
        },
        transaction: {
            type: TransactionType,
            args: { _id: { type: GraphQLID } },
            resolve(parentValue, args, context) {
                return mock.transactions(true);
            }
        }
    }
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createInterest: {
            type: InterestType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: interest.createInterest
        },
        updateInterest: {
            type: InterestType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: interest.updateInterest
        },
        deleteInterest: {
            type: InterestType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: interest.deleteInterest
        },
        createUser: {
            type: TokenType,
            args: {
                userName: { type: GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                gender: { type: GraphQLString },
                interests: { type: GraphQLList(GraphQLString) },
            },
            resolve: user.createUser
        },
        updateUser: {
            type: UserType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                userName: { type: GraphQLString },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                phoneNumber: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                gender: { type: GraphQLString },
                interests: { type: GraphQLList(GraphQLString) },
            },
            resolve: user.updateUser
        },
        deleteUser: {
            type: UserType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: user.deleteUser
        },
        createEventManager: {
            type: TokenType,
            args: {
                firstName: { type: GraphQLNonNull(GraphQLString) },
                lastName: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
                gender: { type: GraphQLString },
            },
            resolve: eventManager.createEventManager
        },
        updateEventManager: {
            type: EventManagerType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                firstName: { type: GraphQLString },
                lastName: { type: GraphQLString },
                phoneNumber: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
                gender: { type: GraphQLString },
            },
            resolve: eventManager.updateEventManager
        },
        deleteEventManager: {
            type: EventManagerType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: eventManager.deleteEventManager
        },
        createEvent: {
            type: EventType,
            args: {
                eventManagerId: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLNonNull(GraphQLString) },
                startDate: { type: GraphQLNonNull(GraphQLString) },
                endDate: { type: GraphQLNonNull(GraphQLString) },
                locationName: { type: GraphQLNonNull(GraphQLString) },
                lat: { type: GraphQLNonNull(GraphQLFloat) },
                lng: { type: GraphQLNonNull(GraphQLFloat) },
                okhi:  { type: GraphQLString },
                description: { type: GraphQLNonNull(GraphQLString) },
                bannerUrl: { type: GraphQLNonNull(GraphQLString) },
                isFree: { type: GraphQLNonNull(GraphQLBoolean) },
                interest: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: event.createEvent
        },
        updateEvent: {
            type: EventType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                startDate: { type: GraphQLString },
                endDate: { type: GraphQLString },
                locationName: { type: GraphQLString },
                lat: { type: GraphQLFloat },
                lng: { type: GraphQLFloat },
                okhi:  { type: GraphQLString },
                description: { type: GraphQLString },
                bannerUrl: { type: GraphQLString },
                isFree: { type: GraphQLBoolean },
                interest: { type:GraphQLString }
            },
            resolve: event.updateEvent
        },
        deleteEvent: {
            type: EventType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve: event.deleteEvent
        },
        createEventTickets: {
            type: EventTicketsType,
            args: {
                eventId: { type: GraphQLNonNull(GraphQLID) },
                type: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                price: { type: GraphQLNonNull(GraphQLFloat) },
                currency: { type: GraphQLString },
                ticketsLeft: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: ticket.createEventTickets
        },
        updateEventTicket: {
            type: EventTicketsType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                type: { type: GraphQLString },
                description: { type: GraphQLString },
                ticketsLeft: { type: GraphQLInt }
            },
            resolve: ticket.updateEventTickets
        }
    }
});





module.exports = { RootQuery, mutation };
