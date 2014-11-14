/**
 * Version Number
 * @type String
 */
plastic.version = '0.2.0';

/**
 * Array which holds all the plastic.js Elements
 *
 * @type Array
 */
plastic.elements = [];

/**
 * Module Namespace
 *
 * This includes module and depencency handling and of course all available modules
 *
 * @namespace
 */
plastic.modules = {

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

};

/**
 * Namespace for helper functions
 * @namespace
 * @ignore
 */
plastic.helper = {};

/**
 * History of all plastic.js errors
 *
 * @type {Array}
 */
plastic.errors = [];

/**
 * Executes plastic.js
 *
 * This is done automatically on the DOM Ready Event
 */
plastic.execute = function() {
    "use strict";

    if (plastic.options.debug) {
        plastic.msg.log('[MAIN] plastic.js version v' + plastic.version + ' INIT');
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


    // Create new plastic Elements
    $plasticElements.each(function() {

        var $el = $(this);

        // If Debug Mode is activated: Do not use Exception handling (let it crash)
        if (plastic.options.debug) {
            plastic.elements.push(new plastic.Element($el));
        } else {

            if (!plastic.options.debug) {
                plastic.elements.push(new plastic.Element($el));
            } else {
                try {
                    plastic.elements.push(new plastic.Element($el));
                } catch(e) {
                    e.message += ' | plastic element crashed while init (creation)';
                    plastic.msg.error(e, 'error', $el);
                }
            }

        }

    });

    // Fetch all registered Dependencies
    plastic.modules.dependencyManager.fetch();

    // Execute all created plastic Elements
    $.each(plastic.elements, function(i, $el ) {

        if ($el.options.debug) {
            $el.execute();
        } else {
            try {
                $el.execute();
            } catch(e) {
                e.message += ' | plastic element crashed while init (execution)';
                plastic.msg.error(e, 'error', $el);
            }
        }

    });

};
