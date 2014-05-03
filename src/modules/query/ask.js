/**
 * This is a ASK Query Parser
 * It turns the Query into a ASK API URL
 */
plastic.modules.query.ask = (function () {

    var name = 'ASK Query Parser (SMW)';
    var apiName = 'application/ask-query';
    var fileName = 'ask';
    var dependencies = [];

    var validate = function(queryObj) {
        console.info('query.ask.validate();');
        return false;
    };

    var parse = function(queryObj) {

        console.info('query.ask.parse();');

        // Set Data Parser Module
        var dataObj = {
            parser: 'ask-json'
        };

        var url = queryObj.url;
        var query = queryObj.text;

        var queryTrimmed = $.trim(query.replace(/\s+/g, ''));
        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?action=ask&query=' + queryEncoded + '&format=json&callback=?';

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
