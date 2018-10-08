
export type Handler = <T>(node: T) => void;

export class DocumentProcessor {

    private targets: string[] = [];
    private handlers: Map<string, Handler> = new Map();

    constructor() {
        this.create();
    }

    public start() {
        this.targets.forEach((target) => {
            const handler = this.handlers.get(target);
            handler!(target);
        });
    }

    protected addObserver(target: string, handler: Handler) {
        this.targets.push(target);
        this.handlers.set(target, handler);
    }

    protected create() {
        // Nothing
    }
}
