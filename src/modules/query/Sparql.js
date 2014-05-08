// Register Module and define dependencies:
plastic.modules.registry.add('query', 'application/sparql-query', 'Sparql', []);

/**
 * This is a SPARQL Query Parser
 * It turns the Query into a SPARQL Endpoint URL
 *
 * @constructor
 */
plastic.modules.query.Sparql = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Sparql.prototype = {

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
            module: 'sparql-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        // Trim all Whitespace
        var queryTrimmed = $.trim(query.replace(/\s+/g, ' '));

        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?query=' + queryEncoded + '&output=json&callback=?';

        return dataObj;

    }

};
