import { DocumentProcessor, FieldRequirement } from "../../src";
import { process } from "../../src/decorator";
import { DocumentObserver } from "../../src/observer";
import { TomlFileProvider } from "../../src/provider";
import { FileOutputHandler } from "../../src/output";

class Requirementrocessor extends DocumentObserver(DocumentProcessor) {

    @process("title", minSize(24))
    public title(title: string): string {
        return `# ${title}`;
    }

    @process("description", minSize(30) )
    public description(description: string): string {
        return `${description}`;
    }

    @process("author.name", {mandatory: false})
    public authorName(authorName: string): string {
        const lastName = this.field<string>("author.lastName");
        return `_Author_ is ${authorName} ${lastName}`;
    }

}

function minSize(size: number): FieldRequirement {
    return {
        explanation: (text: string) => `should have at least ${size} characters and it only has ${text.length}`,
        requirement : (text: string) => text.length >= size 
    }
}



//const provider = new JSONFileProvider("./examples/simple/assets/README.json")
const provider = new TomlFileProvider("./examples/requirements/assets/README.toml")
const outputHandler = new FileOutputHandler("./examples/requirements/assets/README.md")
const processor = new Requirementrocessor(provider, outputHandler);

processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(error.message));
