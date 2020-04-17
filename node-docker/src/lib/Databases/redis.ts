import { DBS } from './enums/dbs';
import { IAdapter } from './interfaces/adapter';
import { createClient, RedisClient, RetryStrategyOptions } from 'redis';

export class RedisAdapter implements IAdapter {

    public static TYPE: DBS = DBS.REDIS;

    public stackErrors: any[] = [];

    private instance: RedisClient;

    constructor(config?: { host?: string } | null) {
        this.instance = createClient({
            host: config?.host ? config.host : '127.0.0.1',
            retry_strategy: (options: RetryStrategyOptions): number | Error => {
                if (options.error && options.error.code === "ECONNREFUSED") {
                    return new Error("The server refused the connection");
                }
                if (options.total_retry_time > 1000 * 60 * 30) {
                    return new Error("Retry time exhausted");
                }
                if (options.attempt > 3) {
                    return new Error("max attempt");
                }
                return Math.min(options.attempt * 100, 3000);
            },
        });
        this.instance.on("error", (error) => {
            this.stackErrors.push(error);
        });
    }

    public isConnected(): boolean {
        return this.instance.connected;
    }

    private getAllKeys(): Promise<string[]> {
        return new Promise(async r => {
            this.instance.keys('item-*', (err, stack) => {
                r(!err ? stack : []);
            });
        });
    }

    public all(): Promise<any[]> {
        return new Promise(async r => {
            const allKeys: string[] = await this.getAllKeys();
            this.instance.mget(allKeys, (err: any, response: string[]) => {
                r(!err ? response.map(v => JSON.parse(v)) : []);
            });
        });
    }

    public get(id: number): Promise<any> {
        return new Promise(r => {
            this.instance.get(`item-${id}`, (err, response) => {
                let parsed;
                try {
                    parsed = JSON.parse(response);
                } catch (e) {
                    // log error parsing data winston
                }
                r(!err ? parsed : null);
            });
        });
    }

    public set(id: number, value: any): Promise<any> { // any é user
        return new Promise(async r => {
            const item = await this.get(id);
            const newUser = { ...item, ...value };
            this.instance.set(`item-${id}`, JSON.stringify(newUser), (err, response) => {
                r(!err ? newUser : null);
            });
        });
    }

    public del(id: number): Promise<boolean> {
        return new Promise(async r => {
            this.instance.del(`item-${id}`, (err, response) => {
                r(!err ? true : false);
            });
        });
    }

    private getLengthItems(): Promise<number> {
        return new Promise(async r => {
            this.instance.keys('item-*', (err, stack) => {
                r(!err ? stack.length : 0);
            });
        });
    }

    private getlastIndex(): Promise<number> {
        return new Promise(async r => {
            this.instance.get('last-index', (err, stack) => {
                r(!err ? +stack : 0);
            });
        });
    }

    private setLastIndex(id: number): Promise<number> {
        return new Promise(async r => {
            this.instance.set('last-index', id.toString(), (err, stack) => {
                r(!err ? stack.length : 0);
            });
        });
    }

    private createId(): Promise<number> {
        return new Promise(async r => {
            const lenghtItems: number = await this.getLengthItems();
            const lastIndex: number = (await this.getlastIndex()) + 1;
            r(lastIndex ? lastIndex : lenghtItems);
        });
    }

    public add(item: any): Promise<number> {
        return new Promise(async r => {
            const id: number = await this.createId();
            item.id = id;
            const isAdd: boolean = await this.set(id, item);
            if (isAdd) {
                await this.setLastIndex(id); // isso da uma treta em concorrencia... mas nesse caso estou me divertindo com um banco que não tem o proposito de armazenar dados complexos(id de transação) por ser key-value (redis)
            }
            r(isAdd ? id : NaN);
        });
    }

    public delAll(): Promise<boolean> {
        return new Promise(r => {
            this.instance.flushall((err) => {
                r(!err ? true : false);
            })
        });
    }

}
