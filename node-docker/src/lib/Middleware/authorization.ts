
import { RequestHandler, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from "fs";

const privateKey = fs.readFileSync('./../rsa/private.pem', 'utf8');

const payload = fs.readFileSync("./../rsa/payload-word");

const formatString = (str: string) => str.replace(/\\n/g, "").trim();

const formatAuthorization = (str: string) => str.split(" ").slice(1).join(" ").replace(/\\n/g, "\n");

/**
 * algorithm sign/verify
* - HS256:    HMAC using SHA-256 hash algorithm (default)
* - HS384:    HMAC using SHA-384 hash algorithm
* - HS512:    HMAC using SHA-512 hash algorithm
* - RS256:    RSASSA using SHA-256 hash algorithm
* - RS384:    RSASSA using SHA-384 hash algorithm
* - RS512:    RSASSA using SHA-512 hash algorithm
* - ES256:    ECDSA using P-256 curve and SHA-256 hash algorithm
* - ES384:    ECDSA using P-384 curve and SHA-384 hash algorithm
* - ES512:    ECDSA using P-521 curve and SHA-512 hash algorithm
* - none:     No digital signature or MAC value included
*/
const signOptions: jwt.SignOptions = {
    algorithm: "RS256"
};

const verifyOptions: jwt.VerifyOptions = {
    algorithms: ["RS256"]
};

const token = jwt.sign(payload, privateKey, signOptions);

export const authorizationMiddleWare: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    /*if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const publicKey = formatAuthorization(req.headers.authorization);
        const verified = jwt.verify(token, publicKey, verifyOptions);
        if (verified && formatString(verified.toString()) === formatString(payload.toString())) {
            next();
        } else {
            res.status(401).send('invalid token');
        }
    } else {
        res.status(401).send('Unauthorized');
        return;
    }*/next();
};