// Register Module and define dependencies:
plastic.modules.registry.add('data', 'ask-json', 'AskJson', []);

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.AskJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.validationSchema = {
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

};

plastic.modules.data.AskJson.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} dataObj
     */
    setDataObj: function(dataObj) {
        "use strict";

        this.dataObj = dataObj;
    },

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {Object}
     */
    parse: function() {

        console.info('plastic.modules.data.AskJson.parse();');

        console.dir(this.rawData);

        this.dataObj.processed = [];

        for (var obj in this.dataObj.raw.query.results) {
            var row = this.dataObj.raw.query.results[obj];
            this.dataObj.processed.push(row.printouts);
        }

        return this.dataObj;

    }

};
