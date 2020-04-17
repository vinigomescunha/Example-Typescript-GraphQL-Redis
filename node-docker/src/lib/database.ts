import { RedisAdapter, DBS } from './Databases';
import { IAdapter } from './Databases/interfaces/adapter';

class DatabaseBuilder {

    private instance: any = null;
    private config: { host?: string } | null = null;
    private adapterName: string = '';

    constructor(adapterName: string, config?: { host: string }) {
        if (!adapterName) throw new Error('Empty Adapter Name!');
        this.adapterName = adapterName;
        this.config = config ? config : null;
        this.build();
    }

    public getInstance() {
        return this.instance;
    }

    private isValidAdapter(): boolean {
        return Object.values(DBS).map(v => v.toString()).includes(this.adapterName);
    }

    private getInstanceAdapter(): IAdapter {
        switch (this.adapterName) {
            case DBS.REDIS:
                return new RedisAdapter(this.config);
            default:
                throw new Error('Instance not found!');
        }
    }

    private build() {
        if (this.isValidAdapter()) {
            this.instance = this.getInstanceAdapter();
            if (this.instance) {
                return this.instance;
            } else {
                throw new Error('Adapter Error! N/A');
            }
        } else {
            throw new Error('Adapter Name Not Found!');
        }
    }

}
export { IAdapter as Adapter, DatabaseBuilder };