const graphql = require('graphql');
const types = require('./types');
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
    GraphQLNonNull,
    GraphQLString,
    GraphQLID,
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLInt
} = graphql;

const {
    InterestType,
    UserType,
    TokenType,
    EventManagerType,
    EventType,
    EventTicketsType,
    TransactionRequestStatusType,
    TicketTransferResponseType,
    InboundTransactionType,
    StatusType
} = types;

module.exports = new GraphQLObjectType({
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
        sendVerificationCode: {
            type: StatusType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve: user.sendVerificationCode
        },
        verifyUser: {
            type: UserType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
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
        },
        getVently: {
            type: StatusType,
            args: {
                userId: { type: GraphQLNonNull(GraphQLID) },
                phoneNumber: { type: GraphQLString }
            },
            resolve: user.getVently
        }
    }
});
