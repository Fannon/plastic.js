/**
 * Registry of all available Query Parser Modules
 *
 * @type {{}}
 */
plastic.modules.queryParser.registry = {
    "plication/sparql-query": {
        fileName: "sparql", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "SPARQL Query Parser",
        dependencies: []
    }
}
