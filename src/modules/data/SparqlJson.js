// Register Module and define dependencies:
plastic.modules.registry.add('data', 'sparql-json', 'SparqlJson', []);

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @author Simon Heimler
 * @constructor
 */
plastic.modules.data.SparqlJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * SPARQL Result Format Schema
     *
     * @todo: Not 100% done
     * @type {{}}
     */
    this.validationSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "head": {
                "type": "object",
                "properties": {
                    "link": {"type": "array"},
                    "vars": {"type": "array"}
                },
                "required": ["vars"]
            },
            "results": {
                "type": "object",
                "properties": {
                    "bindings": {
                        type: "array",
                        "additionalProperties": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "datatype": {"type": "string"},
                                    "type": {"type": "string"},
                                    "value": {"type": "string"}
                                },
                                "required": ["datatype", "type", "value"]
                            }
                        }
                    },
                    "required": ["bindings"]
                }
            }
        },
        "required": ["head", "results"]
    };

};

plastic.modules.data.SparqlJson.prototype = {

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
     * @returns {{}}
     */
    execute: function() {

        this.dataObj.processed = [];

        for (var i = 0; i < this.dataObj.raw.results.bindings.length; i++) {

            this.dataObj.processed[i] = {};

            var row = this.dataObj.raw.results.bindings[i];

            for (var o in row) {
                this.dataObj.processed[i][o] = row[o].value;
            }
        }

        return this.dataObj;

    }

};
