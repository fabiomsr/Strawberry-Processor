import { DefaultOutputHandler, OutputHandler } from "./output";
import { JSONProvider, Provider } from "./provider";

export type Handler = <T>(node: T) => string | Promise<string>;
export interface FieldRequirement {
    mandatory?: boolean;
    requirement?: (field: any) => boolean;
    explanation?: (field: any) => string;
}

interface Field {
    handler: Handler;
    options?: FieldRequirement;
}

export class DocumentProcessor {

    private targets: string[] = [];
    private handlers: Map<string, Field> = new Map();
    private errors: FieldError[] = [];

    constructor(private provider: Provider = new JSONProvider({}),
                private output: OutputHandler = new DefaultOutputHandler()) {
        this.create();
    }

    public async start(): Promise<void> {
        await this.provider.load();

        for (const target of this.targets) {
            const data = this.provider.fetch(target);
            const field = this.handlers.get(target)!;

            if (this.testFieldRequirement(target, data, field.options)) {
                const result = field.handler(data)

                if(result instanceof Promise) {
                    this.output.append(await result);
                } else {
                    this.output.append(result)
                }
            } else {
                this.errors.push(
                    new FieldError(field.options?.explanation ? `Field [${target}] ${field.options?.explanation(data)}`:
                                                                `Field [${target}] does not meet requirements`));
            }
        }

        if(!this.errors.length) {
            return await this.finish();
        } else {
            this.errors.forEach(error => console.error(error.message));
            throw new Error("There are some errors in the input document");
        }
    }

    protected addObserver(target: string, handler: Handler, options?: FieldRequirement) {
        this.targets.push(target);
        this.handlers.set(target, { handler, options });
    }

    protected field<T>(id: string): T {
        return this.provider.fetch(id)
    }

    protected addError(error: FieldError) {
        this.errors.push(error);
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
            this.errors.push(new FieldError(`Field [${field}] is empty but has been marked as required`));
            return false;
        }

        return options.requirement ? options.requirement(data) : true;
    }

}

export class FieldError {
   constructor(public message: string) {};
}