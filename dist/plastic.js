/*! plastic - v0.0.1 - 2014-04-10
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
var plastic = (function () {

    var privateCounter = 0;

    function privateFunction() {
        privateCounter++;
    }

    function publicFunction() {
        publicIncrement();
    }

    function publicIncrement() {
        privateFunction();
    }

    function publicGetCount(){
        return privateCounter;
    }

    $(document).ready(function() {
       console.log('plastic.js version ' + plastic.version);
    });

    // Reveal public pointers to
    // private functions and properties

    return {

        version: '0.0.1', // semver

        /** Display Modules Namespace */
        display: {},

        /** Helper Functions Namespace */
        helper: {},

        // Make functions public

        start: publicFunction,
        increment: publicIncrement,
        count: publicGetCount
    };

})();


/**
 * Plastic.js (default) Options
 * Written in JSON Notation
 *
 * @type {{}}
 */
plastic.options = {
    test: 2
};
/* global plastic */

plastic.display.table = (function () {

    var privateCounter = 0;

    function privateFunction() {
        privateCounter++;
    }

    function publicFunction() {
        console.log('TEST');
        privateFunction();
    }

    return {
        start: publicFunction
    };

})();
