import { DefaultOutputHandler, OutputHandler } from "./output";
import { JSONProvider, Provider } from "./provider";

export type Handler = <T>(node: T) => string;
export interface FieldRequirement {
    mandatory?: boolean;
    requirement?: (field: any) => boolean;
}

interface Field {
    handler: Handler;
    options?: FieldRequirement;
}

export class DocumentProcessor {

    private targets: string[] = [];
    private handlers: Map<string, Field> = new Map();

    constructor(private provider: Provider = new JSONProvider(),
                private output: OutputHandler = new DefaultOutputHandler()) {
        this.create();
    }

    public async start(): Promise<void> {
        await this.provider.load();

        for (const target of this.targets) {
            const data = this.provider.fetch(target);
            const field = this.handlers.get(target)!;

            if (this.testFieldRequirement(target, data, field.options)) {
                this.output.append(field.handler(data));
            } else {
                throw new Error(`Field [${target}] does not meet requirements`);
            }
        }

        return await this.finish();
    }

    protected addObserver(target: string, handler: Handler, options?: FieldRequirement) {
        this.targets.push(target);
        this.handlers.set(target, { handler, options });
    }

    protected create() {
        // Nothing
    }

    protected async finish(): Promise<void> {
        return await this.output.flush();
    }

    private testFieldRequirement(field: string, data: any, options?: FieldRequirement): boolean {
        if (!options || (!data && !options.mandatory)) {
            return true;
        }

        if (!data && options.mandatory) {
            throw new Error(`Field [${field}] is empty but has been marked as required`);
        }

        return options.requirement ? options.requirement(data) : true;
    }

}
