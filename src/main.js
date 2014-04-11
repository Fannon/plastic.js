/*
 * plastic.js
 *
 *
 * Copyright (c) 2014 Simon Heimler
 * Licensed under the MIT license.
 */


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
       console.log('plastic.js version::: ' + plastic.version);
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

