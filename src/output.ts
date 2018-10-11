export interface OutputHandler {
    append(content: string): void;
    flush(): Promise<void>;
}

export class DefaultOutputHandler implements OutputHandler {

    private document: string = "";

    public append(content: string): void {
        if (!this.document) {
            this.document = content;
            return;
        }

        this.document = this.document.concat(...["\n", content]);
    }

    public async flush(): Promise<void> {
        console.log(this.document);
    }

}
