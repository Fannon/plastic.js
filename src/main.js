/*
 * plastic.js
 *
 * plastic.js is a JavaScript library that lets you make your data visible!
 * OpenSource at GitHub: https://github.com/Fannon/plastic.js
 * Documentation: https://github.com/Fannon/plastic.js/wiki
 *
 * This is work in progress - and not production ready!
 *
 * Copyright (c) 2014 Simon Heimler
 * Licensed under the MIT license.
 */

/* jshint -W079 */ /* Ignores Redefinition of plastic */

/**
 * plastic.js Namespace
 *
 * @namespace
 */
var plastic = {

    /**
     * Version Number
     * @type String
     */
    version: '0.0.4',

    /**
     * Array which holds all the plastic.js Elements
     *
     * @type Array
     */
    elements: [],

    /**
     * Module Namespace
     *
     * This includes module and depencency handling and of course all available modules
     *
     *
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules Namespace
         * @namespace
         * @ignore
         */
        query: {},

        /**
         * API Parser Modules Namespace
         * @namespace
         * @ignore
         */
        api: {},

        /**
         * Data Parser Modules Namespace
         * @namespace
         * @ignore
         */
        data: {},

        /**
         * Display Modules Namespace
         * @namespace
         * @ignore
         */
        display: {}

    }

};

/**
 * Executes plastic.js
 *
 * This is done automatically on the DOM Ready Event
 */
plastic.execute = function() {
    "use strict";

    console.info('plastic.js version v' + plastic.version);

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    var $plasticElements = $('plastic, .plastic-js');


    // Create new plastic.Elements
    $plasticElements.each(function() {

        // If Debug Mode is activated: Do not use Exception handling (let it crash)
        if (plastic.options.debug) {
            plastic.elements.push(new plastic.Element($(this)));
        } else {
            try {
                plastic.elements.push(new plastic.Element($(this)));
            } catch(e) {
                console.error('plastic.js Element Crash');
            }
        }

    });

    console.log(plastic.modules.dependencies.collectedDeps);
    console.log(plastic.modules.dependencies.collectedUrls);

    plastic.modules.dependencies.fetch(function() {
        $.each(plastic.elements, function(i, el) {
//            console.dir(el);
//        el.execute();
        });
    });



//    // Iterate all plastic.js elements on the page
//    plastic.elements.each(function() {
//
//        var el = $(this);
//
//        // If Debug Mode is activated: Do not use Exception handling (let it crash)
//        if (plastic.options.debug) {
//            plastic.elements.push(new plastic.Element(el));
//        } else {
//            try {
//                plastic.elements.push(new plastic.Element(el));
//            } catch(e) {
//                console.error('plastic.js Element Crash');
//            }
//        }
//
//    });
};

$(document).ready(function() {
    plastic.execute();
});
