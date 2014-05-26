/* global nv */

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
        var data = this.elAttr.data.processed;

        var svg = this.$el.append('<svg></svg>');

        console.dir(this.$el[0].children[0]);

        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .staggerLabels(true)
            .tooltips(false)
            .showValues(true)
            .transitionDuration(350)
        ;

        var mappedData = this.mapData(data);

        d3.select(this.$el[0].children[0])
            .datum(mappedData)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

    },

    mapData: function(data) {
        "use strict";
        var mappedData = [{}];

        mappedData[0].key = "free key";
        mappedData[0].values = [];


        // TODO: Process Schema
        var description = this.elAttr.data.description;
        for (var o in description) {
            console.log(o);
        }

        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            mappedData[0].values.push({
                "label": row.country_name[0],
                "value": parseInt(row.population[0], 10)
            });
        }

        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
