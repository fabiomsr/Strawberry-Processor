
import * as chai from "chai";
import { expect } from "chai";
import { JSONProvider } from "../src/provider";

const provider = new JSONProvider();

describe("Provider", () => {

    before(async () => await provider.load());

    it("should return description tag content",  () => {
        const content =  provider.fetch("description");
        expect(content).to.equal("Document Description");
    });

    it("should return author name tag content",  () => {
        const content =  provider.fetch("author.name");
        expect(content).to.equal("Author name");
    });

});
