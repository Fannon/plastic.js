/**
 * Registry of all available Data Parser Modules
 *
 * @type {{}}
 */
plastic.modules.dataParser.registry = {
    "default": {
        fileName: "default", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "Default data format",
        dependencies: []
    },
    "sparql-json": {
        fileName: "sparqlJson",
        humanReadableName: "SPARQL JSON",
        dependencies: []
    }

};