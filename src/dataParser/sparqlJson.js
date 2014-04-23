/* global plastic */

// Register dataParser
plastic.dataParser.available['sparql-json'] = 'sparqlJson';

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * TODO: Make this to module-pattern
 * TODO: Break this into parse and validate (and possible helper functions)
 */
plastic.dataParser.sparqlJson = (function () {

    var validate = function(data) {
        return true;
    };

    var parse = function(data) {

        var success = validate(data);

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


    return {
        validate: validate,
        parse: parse
    };

})();
