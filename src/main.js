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
 */
var plastic = {

    version: '0.0.4', // semver

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

$(document).ready(function() {

    console.info('plastic.js version v' + plastic.version);

    // Build registry of all available Modules
    plastic.helper.buildRegistries();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    plastic.elements = $('plastic, .plastic-js');

//    // Iterate all <plastic> Elements
    plastic.elements.each(function() {

        var el = $(this);

        var elData = plastic.getElementData(el);

        // Validate Element Data
        var valid = plastic.validateElementData(elData);

        // Process this Element
        plastic.processElement($(this), elData);

    });

});



// Debugging Functions
console.o = function(o) {
    console.log($.parseJSON(JSON.stringify(o)));
};