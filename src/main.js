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

/*jshint -W079 */ // Ignores Redefinition of plastic

/**
 * plastic.js Namespace
 *
 * @namespace
 */
var plastic = {

    /** type String */
    version: '0.0.4',

    /**
     * This holds all the plastic jQuery elements
     * @type Array
     */
    elements: [],

    /**
     * plastic.js modules
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules
         * @namespace
         */
        query: {},

        /**
         * API Parser Modules
         * @namespace
         */
        api: {},

        /**
         * Data Parser Modules
         * @namespace
         */
        data: {},

        /**
         * Display Modules
         * @namespace
         */
        display: {}

    },

    /**
     * Helper Functions
     * @namespace
     */
    helper: {}


};

plastic.run = function() {
    "use strict";
    console.info('plastic.js version v' + plastic.version);

    // Build registry of all available Modules
    plastic.helper.buildRegistries();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    plastic.elements = $('plastic, .plastic-js');

    // Iterate all <plastic> Elements
    var plasticCounter = 0;
    plastic.elements.each(function() {

        var el = $(this);

        plastic.elements[plasticCounter] = new plastic.Element(el);

        try {

//            plastic.elements[plasticCounter] = new plastic.Element(el);

//            // Get Element Data
//            var elData = plastic.getElementAttributes(el);
//
//            // Check if Element Data is valid
//            var valid = plastic.validateElementAttributes(elData);
//
//            if (valid) {
//                plastic.processElement($(this), elData);
//            } else {
//                console.error('Invalid Element Data!');
//            }

        } catch(e) {
            console.error('plastic.js Element Crash');
        }

    });
};

$(document).ready(function() {
    plastic.run();
});
