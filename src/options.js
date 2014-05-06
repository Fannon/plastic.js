/**
 * plastic.js default options
 *
 * All options are inherited (and can be overwritten) by the specific plastic.js element
 * Written in JSON Notation
 *
 * @namespace
 * @type {Object}
 */
plastic.options = {

    /**
     * Debug Mode
     *
     * This enables logging of some informations and benchmarks to the console
     * This also ignores Exception handiling. If an error occurs it will crash hard and precice.
     *
     * @type {boolean}
     */
    debug: true,

    /**
     * Width of Canvas, if not given
     * @type {string}
     */
    width: '100%',

    /**
     * Height of Canvas, if not given
     * @type {string}
     */
    height: 'auto',

    /**
     * Default AJAX Timeout (in ms)
     * @type {number}
     */
    timeout: 5000
};
