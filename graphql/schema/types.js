const graphql = require('graphql');
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
    GraphQLString,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
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
});

const NotifyStatusType = new GraphQLObjectType({
    name: 'NotifyStatusType',
    fields: () => ({
        status: { type: GraphQLBoolean }
    })
});

module.exports = {
    UserType,
    UserAttendingEventsType,
    EventTicketsType,
    EventManagerType,
    EventType,
    TicketType,
    TransactionType,
    InterestType,
    TokenType,
    InboundTransactionType,
    TransactionRequestStatusType,
    TicketTransferResponseType,
    NotifyStatusType
};
