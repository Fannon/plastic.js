/**
 * Dependency Manager (Singleton)
 *
 * The Dependency Manager is used to keep track which dependencies are needed to load every plastic element on the page
 * It can (lazy)load those dependencys on demand and manages the according events.
 *
 * @singleton
 * @namespace
 */
plastic.modules.dependencyManager = {

    /**
     * Registry Object that collects all extnal dependencies by name, and ressources
     *
     * If a module is added that has a new external dependency it can either be added here
     * or be added via setDependency() at runtime.
     * If "test" is given, plastic.js will look if the given global variable exists. If it does, it will not be loaded.
     */
    registry: {
        "d3": {
            "title": 'D3.js',
            "website": 'http://d3js.org/',
            "version": '3.4.6',
            "js": ["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"],
            "test": "d3"
        },
        "c3": {
            "title": 'C3.js',
            "website": 'http://c3js.org/',
            "version": '0.1.29',
            "js": ["http://cdnjs.cloudflare.com/ajax/libs/c3/0.1.29/c3.min.js"],
            "test": "c3"
        },
        "nvd3": {
            "title": 'NVD3',
            "website": 'http://nvd3.org/',
            "version": '1.1.15-beta',
            "js": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js"],
            "css": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.css"],
            "test": "nv"
        },
        "dataTable": {
            "title": 'DataTables',
            "website": 'http://www.datatables.net/',
            "version": '1.10.0',
            "js": ["//cdn.datatables.net/1.10.0/js/jquery.dataTables.js"],
            "css": ["//cdn.datatables.net/1.10.0/css/jquery.dataTables.css"],
            "test": "$(document).DataTable"
        }
    },

    /**
     * Object of all Ressources that have to be loaded
     */
    usedDeps: {},

    /**
     * Sets a new dependency (that isn't registered yet)
     *
     * @param {string}  depName     Dependency Name
     * @param {Array}      [jsArray]   Array of JavaScript Files to load (optional)
     * @param {Array}      [cssArray]  Array of CSS Files to load (optional)
     */
    setDependency: function(depName, jsArray, cssArray) {
        "use strict";
        this.registry[depName] = {};

        if (jsArray && jsArray instanceof Array) {
            this.registry.js = jsArray;
        }

        if (cssArray && cssArray instanceof Array) {
            this.registry.css = cssArray;
        }
    },

    /**
     * Gets a dependency Object by name
     *
     * @param {string}  dep
     * @returns {{}}
     */
    getDependency: function(dep) {
        "use strict";
        return this.registry[dep];
    },

    /**
     * Add a dependency that has to be loaded
     *
     * @param {Array} dependencyArray  Array of dependency names (has to fit with the registry above)
     */
    add: function(dependencyArray) {
        "use strict";

        if (dependencyArray) {
            for (var i = 0; i < dependencyArray.length; i++) {
                var depName = dependencyArray[i];
                this.usedDeps[depName] = this.registry[depName];
            }
        } else {
            // TODO: Handle this case!
        }

    },

    /**
     * Fetches all external dependencies asyncronally
     *
     * Dependencies to load have to be added first via .add(dependencies)
     * Triggers plastic events (loaded-)
     *
     * Uses {@link https://github.com/rgrove/lazyload/}
     *
     * @todo Dependency Caching?
     */
    fetch: function() {

        "use strict";

        var cssComplete = function() {
            plastic.events.pub('loaded-' + depName + '.css');
        };

        var jsComplete = function() {
            plastic.events.pub('loaded-' + depName);
        };

        for (var depName in this.usedDeps) {

            var urls = this.usedDeps[depName];

            if (this.missingDependency(urls.test)) {

                LazyLoad.css(urls.css, cssComplete, depName);
                LazyLoad.js(urls.js, jsComplete, depName);

            } else {

                jsComplete();
                if (plastic.options.debug) {
                    plastic.msg.log('[GLOBAL] Dependency ' + depName + ' not loaded, it already exists ');
                }
            }

        }
    },

    /**
     * Checks if Dependency is already loaded. Supports three types of checks:
     *
     * * Global Browser Functions
     * * jQuery Global Functions
     * * jQuery Element Functions
     *
     * @param   {string}      test
     * @returns {boolean}
     */
    missingDependency: function(test) {
        "use strict";

        // If no test is given, always load dependency
        if (!test) {
            return true;
        }

        var testString = test;

        // Check for jQuery Element Plugin
        if (test.indexOf("$(document).") > -1) {

            testString = test.replace('$(document).', '');

            if($(document)[testString]) {
                return false;
            } else {
                return true;
            }
        }

        // Check for jQuery Plugin / Function
        if (test.indexOf("$.") > -1) {
            testString = test.replace('$.', '');
            if($[testString]) {
                return false;
            } else {
                return true;
            }

        }

        // Test for global object / function
        if (window[test]) {
            return false;
        }

        // If still no test-condition is met, declare dependency as missing
        return true;


    }

};
