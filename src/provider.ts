export interface Provider {
    load(): Promise<void>;
    fetch(key: string): Promise<any>;
}

export class JSONProvider implements Provider {

    private document: any = {};

    public async load(): Promise<void> {
        // TODO: read from file
        this.document = {
            title: "Document Title",
            description: "Document Description",
        };
    }

    public async fetch(key: string): Promise<any> {
        const fields = key.split(".");
        return fields.reduce((previous, current) => previous[current], this.document);
    }
}
