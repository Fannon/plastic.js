/**
 * Dependency Registry
 *
 * @singleton
 * @namespace
 */
plastic.modules.dependencies = {

    /**
     *
     */
    registry: {
        "d3": [
            "//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"
        ]
//    "nvd3": [
//        "//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js",
//        "//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.css"
//    ]
    },

    moduleDependencies: {},

    /**
     * Object of all Ressources that have to be loaded
     */
    collectedDeps: {},

    collectedUrls: {},

    getDependency: function(dep) {
        "use strict";
        return this.registry[dep];
    },

    add: function(dependencies) {
        "use strict";
        for (var i = 0; i < dependencies.length; i++) {
            var depName = dependencies[i];
            var urls = this.registry[depName];

            this.collectedDeps[depName] = {
                urls: urls
            };

            for (var j = 0; j < urls.length; j++) {
                var url = urls[j];
                console.log(url);
                this.collectedUrls[url] = depName;
            }


        }

    },

    fetch: function(callback) {
        "use strict";

        var urls = [];

        for (var i = 0; i < this.collectedUrls.length; i++) {
            var obj = this.collectedUrls[i];
            console.warn(obj);

        }

//        yepnope({
//            load: this.collectedUrls,
//            complete: callback
//        });
    }

};
