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

var plastic = (function () {

    /**
     * Bootstrap plastic.js
     */
    $(document).ready(function() {

        console.log('plastic.js version: ' + plastic.version);

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.$elements = $('plastic');

        // Iterate all <plastic>
        plastic.$elements.each(function() {
            plastic.prepareCanvas($(this));
            plastic.getPlasticElementData($(this));
        });

    });


    /**
     * Reveal public pointers to private functions and properties
     */
    return {

        version: '0.0.2', // semver

        /** This holds all the plastic jQuery elements */
        $elements: [],

        /** Data Parser Namespace */
        dataParser: {
            available: {}
        },

        /** Data Parser Namespace */
        queryParser: {
            available: {}
        },

        /** Data Parser Namespace */
        schemaParser: {
            available: {}
        },

        /** Display Modules Namespace */
        display: {
            available: {}
        },

        /** Helper Functions Namespace */
        helper: {}


    };

})();

