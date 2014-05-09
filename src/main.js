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

/* jshint -W079 */ /* Ignores Redefinition of plastic */

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
    version: '0.0.5',

    /**
     * Array which holds all the plastic.js Elements
     *
     * @type Array
     */
    elements: [],

    /**
     * Module Namespace
     *
     * This includes module and depencency handling and of course all available modules
     *
     *
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules Namespace
         * @namespace
         * @ignore
         */
        query: {},

        /**
         * API Parser Modules Namespace
         * @namespace
         * @ignore
         */
        api: {},

        /**
         * Data Parser Modules Namespace
         * @namespace
         * @ignore
         */
        data: {},

        /**
         * Display Modules Namespace
         * @namespace
         * @ignore
         */
        display: {}

    },

    /**
     * Namespace for helper functions
     * @namespace
     * @ignore
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

    if (this.options.debug) {
        console.log('[MAIN] plastic.js version v' + plastic.version + ' INIT');
    }


    /**
     * Global plastic events
     *
     * PubSub Pattern
     *
     * @type {plastic.helper.Events}
     */
    plastic.events = new plastic.helper.Events();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    var $plasticElements = $('plastic, .plastic-js');


    // Create new plastic.Elements
    $plasticElements.each(function() {

        var el = $(this);

        // If Debug Mode is activated: Do not use Exception handling (let it crash)
        if (plastic.options.debug) {
            plastic.elements.push(new plastic.Element(el));
        } else {
            if (plastic.options.debug) {
                plastic.elements.push(new plastic.Element(el));
            } else {
                try {
                    plastic.elements.push(new plastic.Element(el));
                } catch(e) {
                    plastic.msg('plastic element crashed while init', 'error', el);
                }
            }

        }

    });

    // Fetch all registered Dependencies
    plastic.modules.dependencyManager.fetch();

    $.each(plastic.elements, function(i, el ) {
        if (el.options.debug) {
            el.execute();
        } else {
            try {
                el.execute();
            } catch(e) {
                console.error('plastic.js Element Crash on init');
            }
        }

    });

};

$(document).ready(function() {
    plastic.execute();
});
