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
         * Data Parser Modules
         * @namespace
         */
        dataParser: {},

        /**
         * Query Parser Modules
         * @namespace
         */
        queryParser: {},

        /**
         * Schema Parser Modules
         * @namespace
         */
        schemaParser: {},

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

$(document).ready(function() {

    console.info('plastic.js version v' + plastic.version);

    // Build registry of all available Modules
    plastic.helper.buildRegistries();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    plastic.elements = $('plastic, .plastic-js');

    // Iterate all <plastic> Elements
    plastic.elements.each(function() {

        var el = $(this);

        try {

            // Get Element Data
            var elData = plastic.getElementData(el);

            // Check if Element Data is valid
            var valid = plastic.validateElementData(elData);

            if (valid) {
                plastic.processElement($(this), elData);
            } else {
                console.error('Invalid Element Data!');
            }

        } catch(e) {
            console.error('plastic.js Element Crash');
        }

    });

});



// Debugging Functions
console.o = function(o) {
    console.log($.parseJSON(JSON.stringify(o)));
};
