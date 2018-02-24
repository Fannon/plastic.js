// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'default',
    className: 'Default',
    dependencies: []
});
/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.Default = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.dataDescription = {};

    /**
     * Raw Data Schema for validation
     *
     * TODO: Further describe "data" structure
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array"
                    }
                }
            },
            "schema": {
                "type": "object",
                "additionalProperties": {
                    "type": "object"
                }
            },
            "description": {
                "type": "object"
            }
        },
        "required": ["data"]
    };

    this.example = {
        data: [
            {
                "column1": ["cell1"],
                "column2": ["cell2"]
            }

        ],
        schema: {

        },
        description: {

        }
    };

};

plastic.modules.data.Default.prototype = {

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
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {
        this.dataObj.processed = this.dataObj.raw.data;
        return this.dataObj;
    }
};
