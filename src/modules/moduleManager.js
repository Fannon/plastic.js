/**
 * plastic.js Module Manager (Singleton)
 *
 * The ModuleManager is used to register plastic.js Modules
 * It stores which modules are available and additional informations about them (like dependencies)
 *
 * @example
 * plastic.modules.moduleManager.register('display', 'simple-table', 'SimpleTable', ["d3"]);
 * @example
 * var moduleInfo = plastic.modules.moduleManager.get('display', 'simple-table');
 *
 * @singleton
 * @namespace
 */
plastic.modules.moduleManager = {

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

    /**
     * Parameters Schema
     * TODO: Remove this?
     */
    parametersSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "moduleType": {"type": "string"},
            "apiName": {"type": ["string", "array"]},
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
    register: function(paramsObj) {
        "use strict";

        plastic.helper.schemaValidation(this.parametersSchema, paramsObj);

        try {

            if ($.isArray(paramsObj.apiName)) {
                for (var i = 0; i < paramsObj.apiName.length; i++) {
                    this.modules[paramsObj.moduleType][paramsObj.apiName[i]] = paramsObj;
                }
            } else {
                this.modules[paramsObj.moduleType][paramsObj.apiName] = paramsObj;
            }

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
        if (this.modules[moduleType] && this.modules[moduleType][apiName]) {
            return this.modules[moduleType][apiName];
        } else {
            return false;
        }
    }


};
