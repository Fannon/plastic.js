/**
 * Parses tabular data from SPARQL Endpoints
 *
 */
plastic.modules.data.askJson = (function () {

    var name = 'ASK (basic) JSON Parser';
    var apiName = 'ask-json';
    var fileName = 'askJson';
    var dependencies = [];

    /**
     * Provides a JSON-Schema to validate the incoming Data
     *
     * Uses json-schema
     *
     * @type {{}}
     */
    var dataStructure = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "query": {
                "type": "object",
                "properties": {
                    "printrequests": {
                        "type": "array",
                        "properties": {
                            "label": {"type": "string"},
                            "typeid": {"type": "string"},
                            "mode": {"type": "number"}
                        },
                        "required": ["label", "typeid"]
                    },
                    "results": {
                        "type": "object",
                        "additionalProperties": {
                            "type": "object",
                            "properties": {
                                "printouts": {"type": "object"},
                                "fulltext": {"type": "string"},
                                "fullurl": {"type": "string"}
                            },
                            "required": ["printouts"]
                        }
                    }
                },
                "required": ["printrequests", "results"]
            }
        },
        "required": ["query"]
    };

    /**
     * Validate this specific data format
     * Returns true if valid, false if not.
     *
     * @param data
     * @returns {boolean}
     */
    var validate = function(data) {

        return true;

    };


    /**
     * Parses the data into an internal used data format
     *
     * @param data
     * @returns {Array}
     */
    var parse = function(data) {

        console.info('plastic.modules.data.askJson();');

        console.dir(data);

        var processedData = [];

        for (var obj in data.query.results) {

            var row = data.query.results[obj];
            processedData.push(row.printouts);
        }

        return processedData;

    };


    // Make public
    return {
        name: name,
        apiName: apiName,
        fileName: fileName,
        dependencies: dependencies,
        dataStructure: dataStructure,
        validate: validate,
        parse: parse
    };

})();
