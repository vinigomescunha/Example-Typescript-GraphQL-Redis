export interface IAdapter {
    isConnected(): boolean;
    all(): Promise<any[]>;    
    get(id: number): Promise<any>; // async returm data
    set(id: number, value: any): Promise<any>; //, async
    del(id: number): Promise<boolean>;//, async
    add(item: any): Promise<number>;//, async return id from instance added
    delAll(): Promise<boolean>;
}