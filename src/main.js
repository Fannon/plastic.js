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

var plastic = (function () {

    /**
     * Bootstrap plastic.js
     */
    $(document).ready(function() {

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.elements = $('plastic, .plastic-js');

        // Iterate all <plastic> Elements
        plastic.elements.each(function() {

            // Get Element Data
            var elData = plastic.getElementData($(this));

            // Validate Element Data
            var valid = plastic.validateElementData(elData);

            // Process this Element
            plastic.processElement($(this), elData);

        });

    });


    /**
     * Reveal public pointers to private functions and properties
     */
    return {

        version: '0.0.3', // semver

        /** This holds all the plastic jQuery elements */
        elements: [],

        /** Namespace for all plastic modules */
        modules: {

            /** Data Parser Namespace */
            dataParser: {},

            /** Data Parser Namespace */
            queryParser: {},

            /** Data Parser Namespace */
            schemaParser: {},

            /** Display Modules Namespace */
            display: {}

        },

        /** Helper Functions Namespace */
        helper: {}


    };

})();

