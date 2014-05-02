/**
 * This is a SPARQL Query Parser
 * It turns the Query into a SPARQL Endpoint URL
 */
plastic.modules.query.sparql = (function () {

    var name = 'SPARQL Query Parser';
    var apiName = 'application/sparql-query';
    var fileName = 'sparql';
    var dependencies = [];

    var validate = function(queryObj) {
        console.info('query.sparql.validate();');
        return true;
    };

    var parse = function(queryObj) {

        console.info('query.sparql.parse();');

        // Set Data Parser Module
        var dataObj = {
            parser: 'sparql-json'
        };

        var url = queryObj.url;
        var query = queryObj.text;

        // Trim all Whitespace
        var queryTrimmed = $.trim(query.replace(/\s+/g, ' '));

        var queryEncoded = encodeURIComponent(queryTrimmed);

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
