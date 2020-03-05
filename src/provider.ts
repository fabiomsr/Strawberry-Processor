import { readFileSync } from 'fs';
import {parse } from '@iarna/toml'

export abstract class Provider {
    protected document: any = {};

    abstract load(): Promise<void>;

    public fetch(key: string): any {
        const fields = key.split(".");
        return fields.reduce((previous, current) => previous ? previous[current] : undefined, this.document);
    }
}

export class JSONProvider extends Provider {

    constructor(content: any){
        super();
        this.document = content;
    }

    public async load(): Promise<void> {}

}

export class JSONFileProvider extends Provider {

    constructor(private path: string){
        super();
    }

    public async load(): Promise<void> {
        const rawData = readFileSync(this.path, {encoding: 'UTF-8'});
        this.document = JSON.parse(rawData)
    }

}

export class TomlFileProvider extends Provider {

    constructor(private path: string){
        super();
    }

    public async load(): Promise<void> {
        const rawData = readFileSync(this.path, {encoding: 'UTF-8'});
        this.document = parse(rawData)
    }
   
}
