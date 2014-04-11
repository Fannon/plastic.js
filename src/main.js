/*
 * <plastic>
 *
 * Copyright (c) 2014 Simon Heimler
 * Licensed under the MIT license.
 */

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

