/**
 * Parses tabular data from SPARQL Endpoints
 *
 */
plastic.modules.data.sparqlJson = (function () {

    var name = 'SPARQL JSON Parser';
    var apiName = 'sparql-json';
    var fileName = 'sparqlJson';
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

        console.info('plastic.modules.data.sparqlJson();');

        var processedData = [];

        for (var i = 0; i < data.results.bindings.length; i++) {

            processedData[i] = {};

            var row = data.results.bindings[i];

            for (var o in row) {
                processedData[i][o] = row[o].value;
            }
        }

        return processedData;

    };

    // Make public
    return {
        name: name,
        apiName: apiName,
        fileName: fileName,
        dependencies: dependencies,
        validate: validate,
        parse: parse
    };

})();
