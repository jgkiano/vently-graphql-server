const graphql = require('graphql');

const {
    GraphQLSchema,
} = graphql;

const RootQuery = require('./root');

module.exports = new GraphQLSchema({ query: RootQuery });
