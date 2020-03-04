import { DocumentProcessor, FieldRequirement, Handler } from ".";

interface SuperDocumentProcessorConstructor {

    observers?: Array<{target: string,  handler: Handler, requirement?: FieldRequirement }>;

    new(...args: any[]): DocumentProcessor;

}

interface DocumentProcessorObserverConstructor {

    _addDocumentProcessorObserver: (target: string, handler: Handler) => void;

    new(...args: any[]): {};

}

export function DocumentObserver<TBase extends SuperDocumentProcessorConstructor>(Base: TBase):
    TBase&DocumentProcessorObserverConstructor {
    return class extends Base {

        public static _addDocumentProcessorObserver(target: string,
                                                    handler: Handler,
                                                    requirement?: FieldRequirement): void {
            if (!this.hasOwnProperty("observers")) {
                this.observers = [];
            }

            this.observers!.push({target, handler, requirement});
        }

        public create() {
            super.create();
            const constructor = this.constructor as SuperDocumentProcessorConstructor;

            if (!constructor.hasOwnProperty("observers")) {
                constructor.observers = [];
            }

            constructor.observers!.forEach(({target, handler, requirement}) =>
                                             this.addObserver(target, handler.bind(this), requirement));
        }

    };
}
