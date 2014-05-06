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

    // TODO: Generate this via schemaParser Helper
    this.descriptionSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {}
    };

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

    /**
     * Maps ASK-Result-Format Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaMap = {
        "_txt": {
            "type": "string"
        },
        "_ema": {
            "type": "string",
            "format": "email"
        },
        "_tel": {
            "type": "string",
            "format": "uri"
        }
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
    execute: function() {

        this.parseSchema();
        this.parseData();

        return this.dataObj;

    },

    parseSchema: function() {
        "use strict";

        if (!this.dataObj.description) {

            var schema = this.dataObj.raw.query.printrequests;

            for (var i = 0; i < schema.length; i++) {

                var o = schema[i];

                var mappedType = this.schemaMap[o.typeid];
                if (mappedType) {
                    this.descriptionSchema.properties[o.label] = mappedType;
                }

            }


        } else {

            // Description provided within the tag, will overwrite default schema
            this.descriptionSchema.properties = this.dataObj.description;
        }

        this.dataObj.descriptionSchema = this.descriptionSchema;
    },

    parseData: function() {
        "use strict";

        this.dataObj.processed = [];
        var self = this;

        // Parse Data without additional Schema Informations
        for (var obj in this.dataObj.raw.query.results) {
            var row = this.dataObj.raw.query.results[obj];
            this.dataObj.processed.push(row.printouts);
        }

        // Enrich processed data by appling the descriptionSchema to it.
        this.dataObj.processedHtml = plastic.schemaParser.getHtmlData(this.dataObj.processed, this.descriptionSchema);

    }

};
