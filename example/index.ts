import { DocumentProcessor } from "../src";
import { observe } from "../src/decorator";
import { DocumentObserver } from "../src/observer";

class SimpleProcessor extends DocumentObserver(DocumentProcessor) {

    @observe("title")
    public title(title: string): string {
        return `# ${title}`;
    }

    @observe("description", { requirement: (desc: string) => desc.length > 10 })
    public description(description: string): string {
        return `${description}`;
    }

    @observe("author", {mandatory: false})
    public author(author: {name: string, lastname: string}): string {
        return `${author.name}`;
    }

}

const processor = new SimpleProcessor();
processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(`Error:${error}`));
