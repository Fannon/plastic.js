/* global plastic */

// Register dataParser
plastic.dataParser.available['sparql-json'] = 'sparqlJson';

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @param data
 * @returns Array
 */
plastic.dataParser.sparqlJson = function(data) {

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