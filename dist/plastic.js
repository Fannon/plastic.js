/*! plastic - v0.0.1 - 2014-04-11
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
var plastic = (function () {

    $(document).ready(function() {

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.$elements = $('plastic');

        // Iterate all <plastic>
        plastic.$elements.each(function() {
            getPlasticData($(this));
        });
    });

    function getPlasticData() {
        // TODO
    }


    $(document).ready(function() {
       console.log('plastic.js version::: ' + plastic.version);
    });

    // Reveal public pointers to
    // private functions and properties

    return {

        version: '0.0.1', // semver

        $elements: [],

        elements: [],

        /** Display Modules Namespace */
        display: {},

        /** Helper Functions Namespace */
        helper: {},

        /** Data Parser Namespace */
        dataParser: {}

    };

})();


/**
 * Plastic.js (default) Options
 * Written in JSON Notation
 *
 * @type {{}}
 */
plastic.options = {
    test: 1
};

/* global plastic */

plastic.dataParser.sparqlJson = (function () {

    var a = 1;

    return {
        a: a,
        test: 'test'
    };

})();

/**
 * Table Display Module
 */
plastic.display.table = (function () {

    var a = 1;

    return {
        a: a,
        test: 'test'
    };

})();

/* global plastic */

/**
 * Global Log Function
 * Should be used instead of console.logs
 *
 * TODO: Make this visible as an overlay of the visualisation
 * TODO: Make it closeable
 *
 * @param type      enum: info, warning, error)
 * @param msg       Log Message
 */
plastic.helper.log = function (type, msg) {
    // TODO
    console.log('msg');
};
