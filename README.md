[![Build Status](https://travis-ci.com/fabiomsr/document-processor.svg?branch=master)](https://travis-ci.com/fabiomsr/document-processor)

# Strawberry Document Processor

This package aims to generate documents by processing another one, allowing throughout the process to verify the input document.

Here you have a Hello World! example:

- Input file README.toml

~~~toml
title="Toml Example"
message="Hello, World!"
~~~

Now you can create a processor to convert it to a Markdown file:

~~~ts
    class SimpleProcessor extends DocumentObserver(DocumentProcessor) {

        @process("title")
        public title(title: string): string {
            return `# ${title}`;
        }

        @process("message" )
        public message(message: string): string {
            return `__${message}__`;
        }

    }

~~~

Finally, you have to run the processor:

~~~ts
    const provider = new JSONFileProvider("README.toml")
    const outputHandler = new FileOutputHandler("README.md")

    const processor = new SimpleProcessor(provider, outputHandler);
    processor.start()
        .then(() => console.log("Finish"))
        .catch((error) => console.error(error));
~~~

And you got this:

~~~ts
    # Toml Example
    __Hello, World!__
~~~

## More Examples
You can see more examples inside the [examples](./examples) folder

## When it is useful?
For example, it is useful when you have to generate multiple documents with the same structure.
 If you have to keep different markdown files or other types of files in multiple repositories
,as can be web components, and you want each file to have the same structure and design, you can write a json or toml file with the content and forget about the document design. The design will be applied with this tool and a review step is also being added to verify the correctness of the document as shown below.


## Document Correctness

You may want to check the correctness of a file and it cannot be checked by itself as a markdown file. With this package, you can add rules to check every part of the document you want.

To add a requirement to a field you can add extra params to the __process__ decorator.

~~~ts
    @process(id: string, requirement?: FieldRequirement)

    interface FieldRequirement {
        mandatory?: boolean;
        requirement?: (field: any) => boolean;
        explanation?: (field: any) => string;
    }
~~~

So, you can do things like that:

- Do a field optional, fields are mandatory by default:

~~~ts
    @process("message", { mandatory: false } )
    public message(message: string): string {
        return `__${message}__`;
    }
~~~

- Add a custom check

~~~ts
    @process("message", { requirement: (message: string) => message.lenght > 10 } )
    public message(message: string): string {
        return `__${message}__`;
    }
~~~

- Reuse a check

~~~ts
    @process("author", minSize(15) )
    public author(author: string): string {
        return `__${author}__`;
    }

    @process("message", minSize(100) )
    public message(message: string): string {
        return `__${message}__`;
    }

    function minSize(size: number): FieldRequirement {
        return {
            explanation: (text: string) => `should have at least ${size} characters and it only has ${text.length}`,
            requirement : (text: string) => text.length > size 
        }
    }

~~~

If any of these requirements fail the processor will throw an error with an explanation.

For example, for this input:

~~~
    {
        "title" : "Less than 10",
        "message": "Less than 100"
    }
~~~

You got this result:

~~~
    Field [title] should have at least 15 characters and it only has 12
    Field [message] should have at least 100 characters and it only has 13
    
    There are some errors in the input document
~~~

As you can see, it can be useful to add to your continuous integration so you can easily verify the correctness and deny any PR.

## Field process

### Children

To process a children field you have to use the period syntax, as shown below:

- We will process the author name so we need to specify this id: __author.name__:

~~~toml
title = "Make room, Make room"
description = "It is a 1966 science fiction novel exploring the consequences of unchecked population growth on society."

[author]
name = "Harry"
lastName = "Harrison"
~~~

~~~ts 
    @process("author.name")
    public message(authorName: string): string {
        return `__${authorName}__`;
    }
~~~


### Node

You can receive an object instead of a string, for example:

~~~ts 
    @process("author")
    public message(author: {name: string, lastName: string}): string {
        return `__${name} ${lastName}__`;
    }
~~~

### Get a field

If you need to get a field when you are processing another you can use the field method, you can also use the period syntax with the field method.

~~~ts
    @process("author")
    public message(author: {name: string, lastName: string}): string {
        const title = this.field("title");
        return `__${name} ${lastName}__ is the author of ${title}`;
    }
~~~

The field method is parametrized so you can specify a return type:

~~~ts
    @process("author")
    public message(author: {name: string, lastName: string}): string {
        const title = this.field<string>("title");
        return `__${name} ${lastName}__ is the author of ${title}`;
    }
~~~

### Register an error

To register an error you can use the error method and add a new one.

~~~ts
    @process("title")
    public title(title: string): string {
        // ...
        this.addError(new FieldError("Custom error!"));
        // ...
    }
~~~

## Async / await

Processors are async/await friendly so you can specify a process method like an async method and return a promise:

~~~ts
    @process("title")
    public async title(title: string): Promise<string> {
        const processedTitle = await convertTitle(title);
        return `# ${processedTitle}`
    }
~~~

### Processor Composition

Due to processors are async/await friendly you can use others processor when you are processing your document, as shown in the example below:

~~~json
    {
        "title" : "JSON Example",
        "anotherFile": "example.md"
    }
~~~

~~~ts
    @process("anotherFile")
    public async title(anotherFile: string): Promise<string> {
        const provider = new JSONFileProvider(anotherFile)
        const outputHandler = new ContentOutputHandler()

        await AnotherProcessor(provider, outputHandler).start()
        
        return outputHandler.content;
    }
~~~


## Provider and OutputHandler

This package has the following provider that you can use to read your input documents if you want your custom provider you can implement the Provider interface.

- JSONProvider, JSONFileProvider and TomlFileProvider .

And it has the following output handler, you can also write your output handler by implementing the OutputHandler interface.

- DefaultOutputHandler prints the result on the console.
- FileOutputHandler saves the result in a file.
- ContentOutputHandler saves the result in its content field.


