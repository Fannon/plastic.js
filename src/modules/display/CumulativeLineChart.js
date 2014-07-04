/* global nv */

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'line-chart',
    className: 'CumulativeLineChart',
    dependencies: []
});

/**
 * Line Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.CumulativeLineChart = function($el, elAttr) {
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
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "type": "object",
        "properties": {
//            "showLabels": {
//                "description": "Show the labels.",
//                "type": "boolean",
//                "default": true
//            },
//            "tooltips": {
//                "description": "Show tooltips",
//                "type": "boolean",
//                "default": true
//            },
//            "transitionDuration": {
//                "description": "Duration of the animation in milliseconds.",
//                "type": "number",
//                "minimum": 0,
//                "default": 350
//            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};


};

plastic.modules.display.CumulativeLineChart.prototype = {

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

//        var options = this.elAttr.display.options;

        console.log('Data: ' + data.data[0]);

        var mappedData = this.mapData(data);

        var chart = nv.models.cumulativeLineChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .color(d3.scale.category10().range())
            .useInteractiveGuideline(true)
        ;

        chart.xAxis
            .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d));
            });

        chart.yAxis
            .tickFormat(d3.format(',.1%'));

        d3.select(this.$el[0].children[0])
            .datum(mappedData)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

    },

    mapData: function(data) {
        "use strict";
        var mappedData = [];



        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
