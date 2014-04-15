/**
 * Created by fannon on 09.04.2014.
 */
/* global plastic */

// Register Parser
plastic.dataParser.available['sparql-json'] = 'sparqlJson';

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @param data
 * @returns Array
 */
plastic.dataParser.sparqlJson = function(data) {

    console.info('PARSING DATA VIA: SPARQL JSON');

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
