plastic.helper.buildRegistries = (function () {

    /**
     * Build dynamically Registries of all available Modules for each Module Type
     * The registry includes some basic informations about the Module
     */
    var builder = function() {

        console.info('plastic.helper.buildRegistries();');

        // Build Registry of all Module Types
        buildModuleRegistry('queryParser');
        buildModuleRegistry('dataParser');
        buildModuleRegistry('display');
        buildModuleRegistry('schemaParser');

    };

    /**
     * Private Helper Function that does the actual work
     *
     * @param moduleType    Name of the Module Type
     */
    var buildModuleRegistry = function(moduleType) {

        var moduleTypeRegistry = {};

        for (var obj in plastic.modules[moduleType]) {
            var module = plastic.modules[moduleType][obj];
            if(plastic.modules[moduleType].hasOwnProperty(obj) && module.apiName){
                moduleTypeRegistry[module.apiName] = {
                    name: module.name,
                    fileName: module.fileName,
                    dependencies: module.dependencies
                };
            }
        }

        plastic.modules[moduleType]._registry = moduleTypeRegistry;
    };

    return builder;

})();