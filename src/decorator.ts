import { DocumentProcessor } from ".";

interface DocumentProcessorConstructor extends Function {
    _addDocumentProcessorObserver?:
        (target: string, handler: <T>(ev: T) => string) => void;
}

interface DocumentProcessorPrototype extends DocumentProcessor {
    constructor: DocumentProcessorConstructor;
}

type HasObservers<P extends string> = {
    [K in P]: (e: any) => string
};

export function observe(name: string) {
    return <P extends string, T extends DocumentProcessorPrototype&HasObservers<P>>
     (target: T, method: P) => {

        if (!target.constructor._addDocumentProcessorObserver) {
            throw new Error(
                `Cannot add observer for ${method} because ` +
                `DocumentObserver mixin was not applied to element.`);
        }

        target.constructor._addDocumentProcessorObserver(name, (target as HasObservers<P>)[method]);
    };
}
