import { DocumentProcessor } from "../src";
import { observe } from "../src/decorator";
import { DocumentObserver } from "../src/observer";

class SimpleProcessor extends DocumentObserver(DocumentProcessor) {

    @observe("title")
    public title(title: string): string {
        return `# ${title}`;
    }

    @observe("description")
    public description(description: string): string {
        return `${description}`;
    }

}

const processor = new SimpleProcessor();
processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(`Error:${error}`));
