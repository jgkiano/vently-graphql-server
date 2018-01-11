const graphql = require('graphql');

const {
    GraphQLSchema,
} = graphql;

const { RootQuery, mutation } = require('./root');

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
