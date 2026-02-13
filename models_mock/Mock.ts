import { generateUUID } from "@/lib/uuid";
import { UUIDTypes } from "uuid";

// type UnpackArray<T> = T extends (infer U)[] ? U : T;
type TAModel = { id: string }

export default abstract class Mock<TModel extends TAModel> {

    static #moks: {type: string, mock: Mock<TAModel>}[] = [];

    static ms = 1;

    protected data: TModel[] = [];

    abstract generateData(): TModel[]
    
    constructor() {
        this.data = this.generateData()
    }

    public static create<M extends Mock<TAModel>>(c: new() => M): M {
        let mock = this.#moks.find(m => m.type === c.name)
        if (!mock) {
            console.log('Creating mock for ', c.name);
            mock = {type: c.name, mock: new c()}
            this.#moks.push(mock);
        }

        return mock.mock as M;
    }

    protected uuid() {
        return generateUUID();
    }

    protected delay() {
        return new Promise( resolve => setTimeout(resolve, Mock.ms) );
    }

    public getData() {
        return this.data;
    }

    async read(): Promise<TModel[]> {
        await this.delay();
        return this.getData();
    }
    
    async readOne(id: string): Promise<TModel> {
        await this.delay();
        let data = this.data.find(d => d.id === id) ?? await this.generateDataById(id);
        if (data == undefined){
            throw new Error('Not found');
        }

        return data;
    }

    async generateDataById(id: string): Promise<TModel|undefined> {
        return undefined;
    }

    update(data: TModel) {
        const d = this.data.find(d => d.id === data.id);
        if (d) {
            Object.assign(d, data);
        }
    }

    async delete(item: TModel): Promise<void>{
        await this.delay();
        if (Math.random() < 0.3) {
            throw new Error(`Cannot delete`);
        }
        this.data = this.data.filter(m => m.id !== item.id);
    }

    async add(item: TModel): Promise<void> {
        await this.delay();
        // if (item?.title && item.title === 'error') {
        //     throw new Error("Cannot create menu");
        // }
        this.data.push(item);
    }

}