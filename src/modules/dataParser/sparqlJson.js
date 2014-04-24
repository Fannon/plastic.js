/**
 * Parses tabular data from SPARQL Endpoints
 *
 * TODO: Make this to module-pattern
 * TODO: Break this into parse and validate (and possible helper functions)
 */
plastic.modules.dataParser.sparqlJson = (function () {

    var dependencies = [];

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

        console.info('PARSING DATA VIA: SPARQL JSON');
        console.dir(data);

        var processedData = [];

        for (var i = 0; i < data.results.bindings.length; i++) {

            processedData[i] = {};

            var row = data.results.bindings[i];

            for (var o in row) {
                processedData[i][o] = row[o].value;
            }
        }

        console.dir(processedData);

        return processedData;

    };

    // Make public
    return {
        dependencies: dependencies,
        validate: validate,
        parse: parse
    };

})();
