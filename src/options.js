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
     * This enables logging of some informations to the console
     * This also ignores Exception handiling. If an error occurs it will crash hard and precice.
     *
     * @type {boolean}
     */
    debug: false,

    /**
     *
     * If true, plastic.js will keep a log object
     *
     * It is stored in plastic.msg._logs and can be JSON Dumped via plastic.msg.dumpLog();
     *
     */
    log: true,

    /**
     * Logs Benchmark Infos to the console
     *
     * @type {boolean}
     */
    benchmark: true,

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
    timeout: 3000,

    /**
     * If true, an additional info box is shown below the plastic element
     * This displays additional infos like execution time
     */
    showInfoBox: true
};
