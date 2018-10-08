import { DocumentProcessor, Handler } from ".";

interface SuperDocumentProcessorConstructor {

    observers?: Array<{target: string, handler: Handler}>;

    new(...args: any[]): DocumentProcessor;

}

interface DocumentProcessorObserverConstructor {

    _addDocumentProcessorObserver: (target: string, handler: (node: any) => string) => void;

    new(...args: any[]): {};

}

export function DocumentObserver<TBase extends SuperDocumentProcessorConstructor>(Base: TBase):
    TBase&DocumentProcessorObserverConstructor {
    return class extends Base {

        public static _addDocumentProcessorObserver(target: string,
                                                    handler: <T>(node: T) => string): void {
            if (!this.hasOwnProperty("observers")) {
                this.observers = [];
            }

            this.observers!.push({target, handler});
        }

        public create() {
            super.create();
            const constructor = this.constructor as SuperDocumentProcessorConstructor;

            if (!constructor.hasOwnProperty("observers")) {
                constructor.observers = [];
            }

            constructor.observers!.forEach(({target, handler}) => this.addObserver(target, handler.bind(this)));
        }

    };
}
