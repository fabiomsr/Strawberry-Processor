import { DocumentProcessor, FieldRequirement, FieldError } from "../../src";
import { process } from "../../src/decorator";
import { DocumentObserver } from "../../src/observer";
import { TomlFileProvider } from "../../src/provider";
import { FileOutputHandler } from "../../src/output";

class Requirementrocessor extends DocumentObserver(DocumentProcessor) {

    @process("title", minSize(50))
    public title(title: string): string {
        return `# ${title}`;
    }

    @process("description", minSize(30) )
    public description(description: string): string {
        this.addError(new FieldError("This is a custom error!"))
        return `${description}`;
    }

}

function minSize(size: number): FieldRequirement {
    return {
        explanation: (text: string) => `should have at least ${size} characters and it only has ${text.length}`,
        requirement : (text: string) => text.length >= size 
    }
}



//const provider = new JSONFileProvider("./examples/simple/assets/README.json")
const provider = new TomlFileProvider("./examples/errors/assets/README.toml")
const outputHandler = new FileOutputHandler("./examples/errors/assets/README.md")
const processor = new Requirementrocessor(provider, outputHandler);

processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(error.message));
