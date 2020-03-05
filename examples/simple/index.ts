import { DocumentProcessor } from "../../src";
import { process } from "../../src/decorator";
import { DocumentObserver } from "../../src/observer";
import { TomlFileProvider } from "../../src/provider";
import { FileOutputHandler } from "../../src/output";

class SimpleProcessor extends DocumentObserver(DocumentProcessor) {

    @process("title")
    public title(title: string): string {
        return `# ${title}`;
    }

    @process("description" )
    public description(description: string): string {
        return `${description}`;
    }

    @process("author.name")
    public authorName(authorName: string): string {
        const lastName = this.field<string>("author.lastName");
        return `_Author_ is ${authorName} ${lastName}`;
    }

}


//const provider = new JSONFileProvider("./examples/simple/assets/README.json")
const provider = new TomlFileProvider("./examples/simple/assets/README.toml")
const outputHandler = new FileOutputHandler("./examples/simple/assets/README.md")
const processor = new SimpleProcessor(provider, outputHandler);

processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(error.message));
