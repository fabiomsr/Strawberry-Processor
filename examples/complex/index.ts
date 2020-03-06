import { DocumentProcessor } from "../../src";
import { process } from "../../src/decorator";
import { DocumentObserver } from "../../src/observer";
import { TomlFileProvider } from "../../src/provider";
import { FileOutputHandler } from "../../src/output";

class WebComponentProcessor extends DocumentObserver(DocumentProcessor) {

    @process("id")
    public badges(id: string): string {
        return `
        [![GitHub Releases](https://badgen.net/github/tag/vanillawc/${id})](https://github.com/vanillawc/${id}/releases)
        [![NPM Release](https://badgen.net/npm/v/@vanillawc/${id})](https://www.npmjs.com/package/@vanillawc/${id})
        [![MIT License](https://badgen.net/github/license/vanillawc/${id})](https://raw.githubusercontent.com/vanillawc/${id}/master/LICENSE)
        [![Published on WebComponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/vanillawc/${id})
        [![Latest Status](https://github.com/vanillawc/${id}/workflows/Latest/badge.svg)](https://github.com/vanillawc/${id}/actions)
        [![Release Status](https://github.com/vanillawc/${id}/workflows/Release/badge.svg)](https://github.com/vanillawc/${id}/actions)
        `.replace(/^        /gm, '');
    }

    @process("description")
    public description(description: string): string {
        return description
    }

    @process("installation", {mandatory : false})
    public installation(_: string): string {
        return `
        -----

        ## Installation
        
        \`\`\`sh
        npm i @vanillawc/${this.field("id")}
        \`\`\`
        
        Then import the \`index.js\` file at the root of the package.
        
        -----`.replace(/^        /gm, '');
    }

    @process("usage", {mandatory : false})
    public usage(usage: string): string {
        const id = this.field("id")
        return `
        ## Usage

        \`\`\`html
        ${usage ? usage : `<${id}></${id}>`}
        \`\`\`
        `.replace(/^        /gm, '');
    }

    @process("attributes", {mandatory : false})
    public attributes(attributes: Entry[]): string {
        return !attributes ? "" : 
        attributes.reduce<string>( (accumulator, attribute ) => 
             accumulator + `- \`${attribute.name}\` -  ${attribute.description}\n`  
        , "## Attributes\n")
    }

    @process("properties", {mandatory : false})
    public properties(properties: Entry[]): string {
        return !properties ? "" : 
        properties.reduce<string>( (accumulator, property ) => 
            accumulator + `- \`${property.name}\` -  ${property.description}\n`  
        , "## Properties\n")
    }

    @process("demo")
    public demo(link: string): string {
        const id = this.field("id")
        return `
        ## Demos
        [${id} - Demo](${link})
        `.replace(/^        /gm, '');
    }

}

interface Entry {
    name:string;
    description:string;
}


// Monaco editor
const monacoProvider = new TomlFileProvider("./examples/complex/assets/wc_monaco_editor.toml")
const monacoOutputHandler = new FileOutputHandler("./examples/complex/assets/WC_MONACO_EDITOR_README.md")

// Blink
const blinkProvider = new TomlFileProvider("./examples/complex/assets/wc_blink.toml")
const blinkOutputHandler = new FileOutputHandler("./examples/complex/assets/WC_BLINK_README.md")

const processor = new WebComponentProcessor(blinkProvider, blinkOutputHandler);

processor.start()
    .then(() => console.log("Finish"))
    .catch((error) => console.error(error.message));
