import fs from "fs";
import * as graphqlHTTP from 'express-graphql';
import {
    buildSchema
} from 'graphql';

const payload = fs.readFileSync("./../rsa/payload-word");

export const configHTTPMiddleWare: graphqlHTTP.Middleware = graphqlHTTP.default({
    schema: buildSchema(`
        type Query {
            payload: String
            version: String
        }
    `),
    rootValue: {
        payload: () => payload.toString(),
        version: () => 'vs-1.0.0'
    },
    graphiql: true
});