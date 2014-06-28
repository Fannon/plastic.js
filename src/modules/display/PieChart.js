/* global nv */

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'pie-chart',
    className: 'PieChart',
    dependencies: ["nvd3"]
});

/**
 * Pie Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.PieChart = function($el, elAttr) {
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
            "showLabels": {
                "description": "Show the labels.",
                "type": "boolean",
                "default": true
            },
            "tooltips": {
                "description": "Show tooltips",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "description": "Duration of the animation in milliseconds.",
                "type": "number",
                "minimum": 0,
                "default": 350
            }
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

plastic.modules.display.PieChart.prototype = {

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

        var options = this.elAttr.display.options;

        var chart = nv.models.pieChart()
                .x(function(d) { return d.label; })
                .y(function(d) { return d.value; })
                .showLabels(options.showLabels)
                .tooltips(options.tooltips)
            ;

        var mappedData = this.mapData(data);


        d3.select(this.$el[0].children[0])
            .datum(mappedData)
            .transition().duration(options.transitionDuration)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

    },

    mapData: function(data) {
        "use strict";
        var mappedData = [];

        var labelColumn = '';
        var valueColumn = '';

        // Decides data types / mapping via data description if available:
        if (this.elAttr.data.description) {
            var description = this.elAttr.data.description;

            for (var o in description) {
                if (labelColumn === '' && description[o].type === "string") {
                    labelColumn = o;
                }

                if (valueColumn === '' && description[o].type === "number") {
                    valueColumn = o;
                }
            }
        }

        if (labelColumn === '' || valueColumn === '') {
            throw new Error('Could not map data to label and value! Please provide a correct data description / schema!');
        }

        // Do the actual mapping:
        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            mappedData.push({
                "label": row[labelColumn][0],
                "value": parseInt(row[valueColumn][0])
            });
        }

        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
