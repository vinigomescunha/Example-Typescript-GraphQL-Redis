import {
    createClient,
    RedisClient,
    RetryStrategyOptions
} from "redis";

import { equal } from "assert";

const host: string = '10.1.0.3'; // docker host : docker-compose up redis

let client: RedisClient;

describe('Test Redis', () => {

    before((done: Mocha.Done) => {

        client = createClient({
            host,
            retry_strategy: (options: RetryStrategyOptions): number | Error => {
                if (options.error && options.error.code === "ECONNREFUSED") {
                    return new Error("The server refused the connection");
                }
                if (options.total_retry_time > 1000 * 6) {
                    return new Error("Retry time exhausted");
                }
                if (options.attempt > 1) {
                    return new Error("max attempt");
                }
                return Math.min(options.attempt * 100, 3000);
            }
        });
        client.on('connect', (e: Error) => {
            done();
        });
        client.on('error', (e: Error) => {
            done(e.message);
        });
    });

    describe('Redis is Working', () => {
        it('Return PING', (done: Mocha.Done) => {
            client.ping((error, response: string) => {
                equal(response === "PONG", error === null, `PONG error: ${JSON.stringify(error)}`);
                done();
            });
        });
    });
});