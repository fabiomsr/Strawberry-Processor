
import * as chai from "chai";
import { expect } from "chai";
import { JSONProvider } from "../src/provider";

const document = {
    title: "Document Title",
    description: "Document Description",
    author: {
        name: "Author name",
        lastName: "Author lastname",
    },
};

const provider = new JSONProvider(document);

describe("Provider", () => {

    before(async () => await provider.load());

    it("should return description tag content",  () => {
        const content = provider.fetch("description");
        expect(content).to.equal("Document Description");
    });

    it("should return author name tag content",  () => {
        const content = provider.fetch("author.name");
        expect(content).to.equal("Author name");
    });

});
