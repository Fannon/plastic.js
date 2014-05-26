// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'discrete-bar-chart',
    className: 'DiscreteBarChart',
    dependencies: ["nvd3"]
});

/**
 * Bar Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.DiscreteBarChart = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {};

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};

    /**
     * Display Element that is rendered
     * @type {{}}
     */
    this.displayEl = undefined;

};

plastic.modules.display.DiscreteBarChart.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function () {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Bar Chart
     *
     * @returns {*}
     */
    execute: function () {



    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};