/**
 * Dependency Registry Singleton
 *
 * @singleton
 * @namespace
 */
plastic.modules.dependencies = {

    /**
     * Registry Object that collects all extnal dependencies by name, and ressources
     *
     * If a module is added that has a new external dependency it can either be added here
     * or be added via setDependency() at runtime.
     * If "test" is given, plastic.js will look if the given global variable exists. If it does, it will not be loaded.
     */
    registry: {
        "d3": {
            "test": "d3",
            "js": ["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"]
        },
        "nvd3": {
            "js": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js"],
            "css": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.css"]
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
        for (var i = 0; i < dependencyArray.length; i++) {
            var depName = dependencyArray[i];
            this.usedDeps[depName] = this.registry[depName];
        }

    },

    /**
     * Fetches all external dependencies asyncronally
     *
     * Dependencies to load have to be added first via .add(dependencies)
     * Triggers plastic events (loaded-)
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

            if (urls.test && !window[urls.test]) {
                LazyLoad.css(urls.css, cssComplete, depName);
                LazyLoad.js(urls.js, jsComplete, depName);
            } else {
                jsComplete();
                if (plastic.options.debug) {
                    console.info('[GLOBAL] Dependency ' + depName + ' not loaded, it already exists ');
                }
            }



        }
    }

};
