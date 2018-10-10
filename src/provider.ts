export interface Provider {
    load(): Promise<void>;
    fetch(key: string): any;
}

export class JSONProvider implements Provider {

    private document: any = {};

    public async load(): Promise<void> {
        // TODO: read from file
        this.document = {
            title: "Document Title",
            description: "Document Description",
            author: {
                name: "Author name",
                lastName: "Author lastname",
            },
        };
    }

    public fetch(key: string): any {
        const fields = key.split(".");
        return fields.reduce((previous, current) => previous[current], this.document);
    }
}
