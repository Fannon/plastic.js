/* global nv */

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'line-chart',
    className: 'CumulativeLineChart',
    dependencies: ["d3", "nvd3"]
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

        "title": "Cumulative Line Chart",

        "type": "object",
        "properties": {
            "useInteractiveGuideline": {
                "title": "Interactive Guideline",
                "description": "Show the interactive Guideline.",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "title": "Transition Duration",
                "description": "Duration of the animation in milliseconds.",
                "type": "number",
                "minimum": 0,
                "default": 350
            },
            "showLegend": {
                "title": "Display Legend",
                "description": "Show the legend, allowing users to turn on/off line series.",
                "type": "boolean",
                "default": true
            },
            "marginLeft": {
                "title": "Left Margin",
                "description": "Adjust chart margins to give the x-axis some breathing room.",
                "type": "boolean",
                "default": true
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

        var options = this.elAttr.display.options;

        var data = this.elAttr.data.processed;
        var mappedData = this.mapData(data);

        var svg = this.$el.append('<svg></svg>');

        var chart = nv.models.lineChart()
                .margin({left: options.margin})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(options.useInteractiveGuideline)  //We want nice looking tooltips and a guideline!
                .transitionDuration(options.transitionDuration)  //how fast do you want the lines to transition?
                .showLegend(options.showLegend)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
            ;

//        chart.xAxis     //Chart x-axis settings
//            .axisLabel('Time (ms)')
//            .tickFormat(d3.format(',r'));
//
//        chart.yAxis     //Chart y-axis settings
//            .axisLabel('Voltage (v)')
//            .tickFormat(d3.format('.02f'));


        d3.select(this.$el[0].children[0])    //Select the <svg> element you want to render the chart in.
            .datum(mappedData)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function() {
            chart.update();
        });

    },

    mapData: function(data) {
        "use strict";

        var mappedData = [];
        var dataDescription = this.elAttr.data.description;

        var xAxis = this.findX(dataDescription);

        for (var columnName in dataDescription ) {

            var column = dataDescription[columnName];

            if (columnName !== xAxis && column.type === "number") {

                var seriesData = {};
                seriesData.key = columnName;
                seriesData.values = [];

                // TODO: If xAxis can be used as Timestamp or Scala, use it as X entry

                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
//                    console.dir(row[columnName][0]);
                    var dataEntry = {
                        "x": i,
                        "y": row[columnName][0]
                    };
                    seriesData.values.push(dataEntry);
                }

                mappedData.push(seriesData);
            }
        }

        return mappedData;
    },

    /**
     * Analyzes the Data Description which column should be used as X-Axis.
     * Fallback to first Column (which should be the x-axis anyway)
     *
     * @param dataDescription
     * @returns {*}
     */
    findX: function (dataDescription) {
        "use strict";
        for (var columnName in dataDescription) {
            var column = dataDescription[columnName];
            if (column.type === 'string' || (column.format && column.format === 'date'))  {
                return columnName;
            }
        }

        for (columnName in dataDescription) {
            return columnName;
        }

    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
