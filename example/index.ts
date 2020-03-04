import { DocumentProcessor, FieldRequirement, FieldError } from "../src";
import { process } from "../src/decorator";
import { DocumentObserver } from "../src/observer";
import { JSONProvider, JSONFileProvider, TomlFileProvider } from "../src/provider";
import { FileOutputHandler, ContentOutputHandler } from "../src/output";

class SimpleProcessor extends DocumentObserver(DocumentProcessor) {

    @process("title")
    public title(title: string): string {
        return `# ${title}`;
    }

    @process("author", {mandatory: false})
    public author(author: {name: string, lastName: string}): string {
        return `${author.name}`;
    }

    @process("description", minSize(0) )
    public description(description: string): string {
        return `${description}`;
    }

    @process("author.name", {mandatory: false})
    public authorName(authorName: string): string {
        const lastName = this.field<string>("author.lastName");
        return `Author is ${authorName} ${lastName}`;
    }

    @process("part2")
    public async part2(path: string): Promise<string> {
        if(!path) return ""
        const provider = new JSONFileProvider(path)
        const outputHandler = new ContentOutputHandler()
        const processor = new SimpleProcessor(provider, outputHandler);
        await processor.start()
    
        return outputHandler.content;
    }

}

function minSize(size: number): FieldRequirement {
    return {
        explanation: (text: string) => `should have at least ${size} characters and it only has ${text.length}`,
        requirement : (text: string) => text.length > size 
    }
}


//const provider = new JSONFileProvider("./example/assets/README.json")
const provider = new TomlFileProvider("./example/assets/README.toml")
const outputHandler = new FileOutputHandler("./example/assets/README.md")
const processor = new SimpleProcessor(provider, outputHandler);
processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(error.message));
