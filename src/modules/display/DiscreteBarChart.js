/* global nv */

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'discrete-bar-chart',
    className: 'DiscreteBarChart',
    dependencies: ["d3", "nvd3"],
    requirements: ["data-description"]
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
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Discrete Bar Chart",

        "type": "object",
        "properties": {
            "staggerLabels": {
                "title": "Label Staggering",
                "description": "Too many bars and not enough room? Try staggering labels.",
                "type": "boolean",
                "default": false
            },
            "tooltips": {
                "title": "Tooltips",
                "description": "Show tooltips",
                "type": "boolean",
                "default": true
            },
            "showValues": {
                "title": "Display Values",
                "description": "Show the bar value right on top of each bar.",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "title": "Transition Duration",
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

        var options = this.elAttr.display.options;

        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .staggerLabels(options.staggerLabels)
            .tooltips(options.tooltips)
            .showValues(options.showValues)
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
        var mappedData = [{}];

        mappedData[0].key = "";
        mappedData[0].values = [];

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

            mappedData[0].values.push({
                "label": row[labelColumn][0],
                "value": parseInt(row[valueColumn][0], 10)
            });
        }

        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
