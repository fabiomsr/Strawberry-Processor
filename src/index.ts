import { JSONProvider, Provider } from "./provider";

export type Handler = <T>(node: T) => void;

export class DocumentProcessor {

    private targets: string[] = [];
    private handlers: Map<string, Handler> = new Map();

    constructor(private provider: Provider = new JSONProvider()) {
        this.create();
    }

    public async start(): Promise<void> {
        await this.provider.load();

        for (const target of this.targets) {
            const data = await this.provider.fetch(target);
            const handler = this.handlers.get(target);
            handler!(data);
        }
    }

    protected addObserver(target: string, handler: Handler) {
        this.targets.push(target);
        this.handlers.set(target, handler);
    }

    protected create() {
        // Nothing
    }
}
