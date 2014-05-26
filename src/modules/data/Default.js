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

    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "data": {
                "type": "array"
            },
            "schema": {

            },
            "description": {

            }
        },
        "required": ["data"]
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

    parseData: function() {
        "use strict";

        this.dataObj.processed = this.dataObj.raw.data;
    }
};
