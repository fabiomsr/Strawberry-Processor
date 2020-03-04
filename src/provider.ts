import { readFileSync } from 'fs';

export interface Provider {
    load(): Promise<void>;
    fetch(key: string): any;
}

export class JSONProvider implements Provider {

    constructor(private document: any){ }

    public async load(): Promise<void> {}

    public fetch(key: string): any {
        const fields = key.split(".");
        return fields.reduce((previous, current) => previous[current], this.document);
    }
}

export class JSONFileProvider implements Provider {

    private document: any = {};

    constructor(private path: string){ }

    public async load(): Promise<void> {
        const rawData = readFileSync(this.path, {encoding: 'UTF-8'});
        this.document = JSON.parse(rawData)
    }

    public fetch(key: string): any {
        const fields = key.split(".");
        return fields.reduce((previous, current) => previous[current], this.document);
    }
}
