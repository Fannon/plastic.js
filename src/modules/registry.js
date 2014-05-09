/**
 * plastic.js Module Registry Singleton
 *
 * @example
 * plastic.modules.registry.add('display', 'simple-table', 'SimpleTable', ["d3"]);
 * @example
 * var moduleInfo = plastic.modules.registry.add('display', 'simple-table');
 *
 * @singleton
 * @namespace
 */
plastic.modules.registry = {

    /**
     * Module Registry Object
     *
     * @type {{}}
     */
    modules: {
        api: {},
        data: {},
        display: {},
        query: {}
    },

    parametersSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "moduleType": {"type": "string"},
            "apiName": {"type": "string"},
            "className": {"type": "string"},
            "dependencies": {"type": "array"}

        },
        "required": ["moduleType", "apiName", "className"]
    },

    /**
     * Register Modules to the Registry.
     *
     * Every Module has to register itself here, or it won't be found and exectuted!
     *
     * @param {Object}  paramsObj  ParameterObject
     */
    add: function(paramsObj) {
        "use strict";

        var env = jjv();
        env.addSchema('parameters', this.parametersSchema);
        var errors = env.validate('parameters', paramsObj);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('ModuleRegistry parameters invalid!');
        }

        try {
            this.modules[paramsObj.moduleType][paramsObj.apiName] = paramsObj;
        } catch(e) {
            console.log(e);
            console.error('Wrong usage of Module Registry!');
        }
    },

    /**
     * Gets a Module by Type and Api Name
     *
     * @param moduleType
     * @param apiName
     */
    get: function(moduleType, apiName) {
        "use strict";
        if (this.modules[moduleType][apiName]) {
            return this.modules[moduleType][apiName];
        } else {
            return false;
        }
    }


};
