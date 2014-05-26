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
plastic.modules.display.RawData = function($el, elAttr) {
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

plastic.modules.display.RawData.prototype = {

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var displayEl = this.$el.find('.plastic-js-display')[0];

        this.$displayEl = $(displayEl);

        var html = '<pre class="raw-data"><code>' + JSON.stringify(this.elAttr.data.raw, false, 4) + '</code></pre>';

        this.$displayEl.html(html);


    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};
