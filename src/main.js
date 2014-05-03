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

/**
 * Executes plastic.js
 *
 * This is done automatically on the DOM Ready Event
 */
plastic.execute = function() {
    "use strict";

    console.info('plastic.js version v' + plastic.version);

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    plastic.elements = $('plastic, .plastic-js');

    // Iterate all plastic.js elements on the page
    plastic.elements.each(function() {

        var el = $(this);

        plastic.elements.push(new plastic.Element(el));

        try {

        } catch(e) {
            console.error('plastic.js Element Crash');
        }

    });
};

$(document).ready(function() {
    plastic.execute();
});
