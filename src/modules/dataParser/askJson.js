/**
 * Parses tabular data from SPARQL Endpoints
 *
 */
plastic.modules.dataParser.askJson = (function () {

    var name = 'ASK (basic) JSON Parser';
    var apiName = 'ask-json';
    var fileName = 'askJson';
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

        console.info('plastic.modules.dataParser.askJson();');

        console.dir(data);

        var processedData = [];

        for (var obj in data.query.results) {

            var row = data.query.results[obj];
            console.log(row.printouts);

            processedData.push(row.printouts);
        }

        console.dir(processedData);
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
