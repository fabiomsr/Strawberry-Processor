import { DefaultOutputHandler, OutputHandler } from "./output";
import { JSONProvider, Provider } from "./provider";

export type Handler = <T>(node: T) => string;

export class DocumentProcessor {

    private targets: string[] = [];
    private handlers: Map<string, Handler> = new Map();

    constructor(private provider: Provider = new JSONProvider(),
                private output: OutputHandler = new DefaultOutputHandler()) {
        this.create();
    }

    public async start(): Promise<void> {
        await this.provider.load();

        for (const target of this.targets) {
            const data = this.provider.fetch(target);
            const handler = this.handlers.get(target);
            this.output.append(handler!(data));
        }

        return await this.finish();
    }

    protected addObserver(target: string, handler: Handler) {
        this.targets.push(target);
        this.handlers.set(target, handler);
    }

    protected create() {
        // Nothing
    }

    protected async finish(): Promise<void> {
        return await this.output.flush();
    }

}
