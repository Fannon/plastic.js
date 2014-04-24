/**
 * Registry of all available Display Modules
 *
 * @type {{}}
 */
plastic.modules.display.registry = {
    "table": {
        fileName: "table", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "Table Display",
        dependencies: ['d3']
    }

};