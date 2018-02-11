const types = require('./types');
const graphql = require('graphql');
const controllers = require('./db/controllers');

const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLList
} = graphql;

const {
    UserType,
    EventType,
    EventManagerType,
    InterestType,
    TicketType,
    TransactionType
} = types;

const {
    interest,
    user,
    event,
    ticket,
    transaction,
    eventManager
} = controllers;

module.exports = new GraphQLObjectType({
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
