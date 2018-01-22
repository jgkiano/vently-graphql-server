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
        pushTokens: { type: GraphQLList(GraphQLString) },
        interests: {
            type: new GraphQLList(InterestType),
            resolve: user.getInterests
        },
        eventsAttending: {
            type: new GraphQLList(UserAttendingEventsType),
            resolve: user.getAttendingEvents
        },
        transactions: {
            type: new GraphQLList(TransactionType),
            resolve: transaction.getAllUserTransactions
        },
    })
});

const UserAttendingEventsType = new GraphQLObjectType({
    name: 'UserAttendingEventsType',
    fields: () => ({
        event: { type: EventType },
        tickets: { type: new GraphQLList(TicketType) }
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
        ticketInfo: {
            type: EventTicketsType,
            resolve: ticket.getTicketInfo
        },
        originalOwner: {
            type: UserType,
            resolve: ticket.getOriginalOwner
        },
        currentOwner: {
            type: UserType,
            resolve: ticket.getCurrentOwner
        },
        eventManager: {
            type: EventManagerType,
            resolve: ticket.getEventManager
        },
        event: {
            type: EventType,
            resolve: ticket.getEvent
        },
        transaction: {
            type: TransactionType,
            resolve: ticket.getTransaction
        },
        isClaimed: {
            type: GraphQLBoolean
        }
    })
});

const TransactionType = new GraphQLObjectType({
    name: 'TransactionType',
    fields: () => ({
        _id: { type: GraphQLID },
        transactionReference: { type: GraphQLString },
        transactionDate: { type: GraphQLString },
        transactionAmount: { type: GraphQLFloat },
        transactionPaymentMethod: { type: GraphQLString },
        status: { type: GraphQLString },
        checkoutRequestId: { type: GraphQLString },
        responseDescription: { type: GraphQLString },
        responseCode: { type: GraphQLString },
        resultDescription: { type: GraphQLString },
        resultCode: { type: GraphQLString },
        customerMessage: { type: GraphQLString },
        mpesaReceiptNumber: { type: GraphQLString },
        mpesaTransactionDate: { type: GraphQLString },
        user: {
            type: UserType,
            resolve: transaction.getUser
        },
        tickets: {
            type: GraphQLList(TicketType),
            resolve: transaction.getTickets
        },
        event: {
            type: EventType,
            resolve: transaction.getEvent
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
            resolve: interest.getEvents
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: interest.getUsers
        }
    })
});

const TokenType = new GraphQLObjectType({
    name: 'TokenType',
    fields: () => ({
        token: { type: GraphQLString }
    })
});

const InboundTransactionType = new GraphQLInputObjectType({
    name: 'InboundTransactionType',
    fields: () => ({
        eventTicket: { type: GraphQLNonNull(GraphQLID) },
        totalTickets: { type: GraphQLNonNull(GraphQLInt) }
    })
});

const TransactionRequestStatusType = new GraphQLObjectType({
    name: 'TransactionRequestStatusType',
    fields: () => ({
        transactionRequestStatus: { type: GraphQLBoolean }
    })
});

const TicketTransferResponseType = new GraphQLObjectType({
    name: 'TicketTransferResponseType',
    fields: () => ({
        responseCode: { type: GraphQLInt }
    })
})

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
            args: { _id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: ticket.readTicket
        },
        transaction: {
            type: TransactionType,
            args: { _id: { type: GraphQLNonNull(GraphQLID) } },
            resolve: transaction.readTransaction
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
        verifyUser: {
            type: UserType,
            args: {
                _id: { type: GraphQLNonNull(GraphQLID) },
                verificationCode: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: user.verifyUser
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
        },
        createTransaction: {
            type: TransactionRequestStatusType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                tickets: { type: GraphQLNonNull(GraphQLList(InboundTransactionType)) }
            },
            resolve: transaction.createTransaction
        },
        transferTicket: {
            type: TicketTransferResponseType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                ticketId: { type: GraphQLNonNull(GraphQLID) },
                phoneNumber: { type: GraphQLString },
                userName: { type: GraphQLString },
                email: { type: GraphQLString },
            },
            resolve: ticket.transferTicket
        }
    }
});





module.exports = { RootQuery, mutation };
