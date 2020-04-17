import express from 'express';
import bodyParser from 'body-parser';
import {
    configHTTPMiddleWare,
    userHTTPMiddleWare,
    authorizationMiddleWare
} from './lib/middleware';

const app: express.Application = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(authorizationMiddleWare);

app.use('/user', userHTTPMiddleWare);

app.use('/config', configHTTPMiddleWare);

app.get('/', (req: express.Request, res: express.Response) => res.send('Hello World!'));

app.listen(5000, () => console.log('Express GraphQL Server Now Running On localhost:5000/graphql'));
