// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'simple-default',
    className: 'SimpleDefault',
    dependencies: []
});
/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.SimpleDefault = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * Raw Data Schema for validation
     *
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",

        "type": "array",
        "items": {
            "type": "object"
        }
    };

};

plastic.modules.data.SimpleDefault.prototype = {

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

        var processedData = [];

        for (var i = 0; i < this.dataObj.raw.length; i++) {
            var col = this.dataObj.raw[i];
            processedData[i] = {};
            for (var cell in col) {
                processedData[i][cell] = [col[cell]];
            }
        }

        this.dataObj.processed = processedData;
        return this.dataObj;
    }
};
