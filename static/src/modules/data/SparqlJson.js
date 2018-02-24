// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'sparql-json',
    className: 'SparqlJson',
    dependencies: []
});

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
    this.rawDataSchema = {
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

    /**
     * Maps SPARQL Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaDatatypeMap = {
        "http://www.w3.org/2001/XMLSchema#integer": {
            "type": "number"
        },
        "http://www.w3.org/2001/XMLSchema#double": {
            "type": "number"
        },
        "http://www.w3.org/2001/XMLSchema#date": {
            "type": "string",
            "format": "date"
        }
    };

    /**
     * Maps SPARQL Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaTypeMap = {
        "uri": {
            "type": "string",
            "format": "uri"
        },
        "literal": {
           "type": "string"
        }
    };

    this.dataDescription = {};

};

plastic.modules.data.SparqlJson.prototype = {

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

        this.parseSchema();
        this.parseData();

        return this.dataObj;

    },

    parseSchema: function() {
        "use strict";

        if (!this.dataObj.description) {

            var schema = this.dataObj.raw.results.bindings[0];

            for (var o in schema) {

                var col = schema[o];
                var mappedType = false;

                if (col.datatype) {
                    mappedType = this.schemaDatatypeMap[col.datatype];
                } else if (col.type) {
                    mappedType = this.schemaTypeMap[col.type];
                }

                // Default Data Description Type
                if (!mappedType) {
                    mappedType = {
                        "type": "string"
                    };
                }

                this.dataDescription[o] = mappedType;


                this.dataObj.description = this.dataDescription;
            }

        }
    },

    parseData: function() {
        "use strict";

        this.dataObj.processed = [];

        for (var i = 0; i < this.dataObj.raw.results.bindings.length; i++) {

            this.dataObj.processed[i] = {};

            var row = this.dataObj.raw.results.bindings[i];

            for (var o in row) {

                var value = row[o].value;

                // If value is a number type, parse it as float (takes care of integers, too)
                if (this.dataDescription[o].type === 'number') {
                    value = parseFloat(value);
                }

                this.dataObj.processed[i][o] = [value];
            }
        }

        return this.dataObj;

    }

};
