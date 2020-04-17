
import * as graphqlHTTP from 'express-graphql';
import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLFieldResolver,
    GraphQLOutputType,
    GraphQLFieldConfigArgumentMap,
    GraphQLScalarType,
    GraphQLSchema,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList
} from 'graphql';

import { DatabaseBuilder, Adapter } from '../database';
const host: string = '10.1.0.3';
const instance: Adapter = new DatabaseBuilder('redis', { host }).getInstance();

interface User {
    id: number;
    name: string;
    email: string;
    description: string;
    isBlocked: boolean;
}

interface MyRootValues {
    getuser: (id: number) => Promise<User>; // retorna usuario
    setuser: (obj: any) => Promise<User>; // retorna usuario mas poderia retornar boolean
    adduser: (obj: any) => Promise<number>; // retorna id
    deluser: (obj: any) => Promise<boolean>; // retorna que foi feito corretamente
    allusers: () => Promise<User[]>;
    isConnected: Function; // () => boolean;
}

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        description: { type: GraphQLString },
        isBlocked: { type: GraphQLBoolean }
    }
});

const sampleOutPut = new GraphQLScalarType({
    name: 'MyMesg',
    serialize: _ => _
});

const query = new GraphQLObjectType({
    name: 'MyQuery',
    fields: () => ({
        all_users: {
            type: new GraphQLNonNull(new GraphQLList(userType/*new GraphQLNonNull(User)*/)),
            resolve: async (_: MyRootValues) => await _.allusers()
        },
        user: {
            type: <GraphQLOutputType>userType,
            args: <GraphQLFieldConfigArgumentMap | undefined>{
                id: { type: GraphQLInt }
            },
            resolve: async (_: MyRootValues, obj: { [id: string]: any }) => await _.getuser(obj.id)
        },
        connected: {
            type: <GraphQLOutputType>sampleOutPut,
            resolve: (_: MyRootValues, obj: { [id: string]: any }): GraphQLFieldResolver<any, any> => _.isConnected()
        }
    })
});

const mutation = new GraphQLObjectType({
    name: 'MyMutation',
    fields: () => ({
        user_set: {
            type: <GraphQLOutputType>userType,// retorna usuario mas poderia retornar boolean
            args: <GraphQLFieldConfigArgumentMap | undefined>{
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                description: { type: GraphQLString },
                isBlocked: { type: GraphQLBoolean }
            },
            resolve: async (_: MyRootValues, obj: { [key: string]: any; }) => await _.setuser(obj)
        },
        user_add: {
            type: <GraphQLScalarType>sampleOutPut, // GraphQLBoolean
            args: <GraphQLFieldConfigArgumentMap | undefined>{
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (_: MyRootValues, obj: { [key: string]: any; }) => await _.adduser(obj)
        },
        user_del: {
            type: <GraphQLScalarType>sampleOutPut, // GraphQLBoolean
            args: <GraphQLFieldConfigArgumentMap | undefined>{
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: async (_: MyRootValues, obj: { [id: string]: any; }) => await _.deluser(obj)
        }
    })
});

const schema = new GraphQLSchema({ query, mutation });

const rootValue: MyRootValues = {
    getuser: (id: number): Promise<User> => new Promise(async r => {
        r(await instance.get(id));
    }),
    setuser: (obj: any): Promise<User> => new Promise(async r => {
        r(await instance.set(obj.id, obj));
    }),
    adduser: async (obj: any): Promise<number> => {
        obj.isBlocked = false;
        return await instance.add(obj);
    },
    allusers: async (): Promise<any[]> => await instance.all(),
    deluser: async (obj: any): Promise<boolean> => await instance.del(obj.id),
    isConnected: (): boolean => instance.isConnected()
};

export const userHTTPMiddleWare: graphqlHTTP.Middleware = graphqlHTTP.default({
    schema,
    rootValue,
    graphiql: process.env.NODE_ENV !== 'test',
});

// (async () =>  await instance.delAll())();