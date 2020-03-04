import { DocumentProcessor, FieldRequirement } from ".";

interface DocumentProcessorConstructor extends Function {
    _addDocumentProcessorObserver?:
        (target: string, handler: <T>(ev: T) => string | Promise<string>, requirement?: FieldRequirement) => void;
}

interface DocumentProcessorPrototype extends DocumentProcessor {
    constructor: DocumentProcessorConstructor;
}

type HasObservers<P extends string> = {
    [K in P]: (e: any) => string | Promise<string>
};

export function process(name: string, requirement?: FieldRequirement) {
    return <P extends string, T extends DocumentProcessorPrototype&HasObservers<P>>
     (target: T, method: P) => {

        if (!target.constructor._addDocumentProcessorObserver) {
            throw new Error(
                `Cannot add observer for ${method} because ` +
                `DocumentObserver mixin was not applied to processor.`);
        }

        target.constructor._addDocumentProcessorObserver(name, (target as HasObservers<P>)[method], requirement);
    };
}
