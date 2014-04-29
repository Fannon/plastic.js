/**
 * This is a SPARQL Query Parser
 * It turns the Query into a SPARQL Endpoint URL
 */
plastic.modules.queryParser.sparql = (function () {

    var name = 'SPARQL Query Parser';
    var apiName = 'application/sparql-query';
    var fileName = 'sparql';
    var dependencies = [];

    var validate = function(queryObj) {
        console.info('queryParser.sparql.validate();');
        return true;
    };

    var parse = function(queryObj) {

        console.info('queryParser.sparql.parse();');

        // Set Data Parser Module
        var dataObj = {
            parser: 'sparqlJson'
        };

        var url = queryObj.url;
        var query = queryObj.text;

        var queryEncoded = encodeURIComponent(query);

        dataObj.url = url + '?query=' + queryEncoded + '&output=json&callback=?';

        return dataObj;
    };

    // Make Functions public
    return {
        name: name,
        apiName: apiName,
        fileName: fileName,
        dependencies: dependencies,
        validate: validate,
        parse: parse
    };

})();
