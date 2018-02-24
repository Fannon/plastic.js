// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'query',
    apiName: 'application/ask-query',
    className: 'Ask',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.query.Ask = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Ask.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} queryObj
     */
    setQueryObj: function(queryObj) {
        "use strict";

        this.queryObj = queryObj;
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

        // Set Data Parser Module
        var dataObj = {
            module: 'ask-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        var queryTrimmed = $.trim(query.replace(/\s+/g, ''));
        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?action=ask&query=' + queryEncoded + '&format=json&callback=?';

        return dataObj;
    }

};
