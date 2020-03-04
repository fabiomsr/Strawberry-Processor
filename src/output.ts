import { writeFileSync } from 'fs';

export interface OutputHandler {
    append(content: string): void;
    flush(): Promise<void>;
}

export class DefaultOutputHandler implements OutputHandler {

    protected document: string = "";

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


export class FileOutputHandler extends DefaultOutputHandler {

    constructor(private filePath: string) {
        super()
     }

    public async flush(): Promise<void> {
        writeFileSync(this.filePath, this.document);
    }

}

export class ContentOutputHandler implements OutputHandler {

    public content: string = ""
    protected document: string = "";

    public append(content: string): void {
        if (!this.document) {
            this.document = content;
            return;
        }

        this.document = this.document.concat(...["\n", content]);
    }

    public async flush(): Promise<void> {
        this.content = this.document;
    }

}

