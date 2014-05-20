// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'raw-data',
    className: 'RawData',
    dependencies: []
});

/**
 * Displays the Raw Data (and Schema if provided) as formatted JSON
 *
 * @constructor
 */
plastic.modules.display.SimpleTable = function($el, elAttr) {
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
     * Display Element that is rendered
     * @type {{}}
     */
    this.displayEl = undefined;

};

plastic.modules.display.SimpleTable.prototype = {

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

//        var $displayEl = this.$el.find('.plastic-js-display')[0];
//
//        console.dir($displayEl);
//
//        this.displayEl = $('<pre></pre>')
//            .append($('<code></code>'))
//                .addClass("raw-data")
//                .append($('<code></code>'))
//        ;


    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};
