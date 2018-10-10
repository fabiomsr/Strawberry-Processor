import { DocumentProcessor } from "../src";
import { observe } from "../src/decorator";
import { DocumentObserver } from "../src/observer";

class SimplenProcessor extends DocumentObserver(DocumentProcessor) {

    @observe("title")
    public title(title: string): string {
        console.log(title);
        return `# ${title}`;
    }

    @observe("description")
    public description(description: string): string {
        console.log(description);
        return `${description}`;
    }

}

const processor = new SimplenProcessor();
processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(`Error:${error}`));
