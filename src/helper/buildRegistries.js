plastic.helper.buildRegistries = (function () {

    return function() {

        console.info('plastic.helper.buildRegistries();');

        // Query Parser Registry
        var queryParserRegistry = {};
        for (var obj in plastic.modules.queryParser) {
            var module = plastic.modules.queryParser[obj];
            if(plastic.modules.queryParser.hasOwnProperty(obj) && module.apiName){
                queryParserRegistry[module.apiName] = {
                    name: module.name,
                    fileName: module.fileName,
                    dependencies: module.dependencies
                };
            }
        }

        plastic.modules.queryParser._registry = queryParserRegistry;
    };

})();