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

    /**
     * Register Modules to the Registry.
     *
     * Every Module has to register itself here, or it won't be found and exectuted!
     *
     * @param {string}   moduleType
     * @param {string}   apiName
     * @param {string}   className
     * @param {Array}    dependencies    Array with all dependencies. All Dependencies have to be listed dependencies.js
     */
    add: function(moduleType, apiName, className, dependencies) {
        "use strict";
        try {
            this.modules[moduleType][apiName] = {
                "className": className,
                "apiName": apiName,
                "dependencies": dependencies
            };
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
