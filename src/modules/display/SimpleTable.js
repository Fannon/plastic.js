// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'simple-table',
    className: 'SimpleTable',
    dependencies: ["d3"]
});

/**
 * Table Display Module
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

plastic.modules.display.SimpleTable.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var data = [];

        // Use schema-processed HTML data if available:
        if (this.elAttr.data.processedHtml) {
            data = this.elAttr.data.processedHtml;
        } else {
            data = this.elAttr.data.processed;
        }
        var table = this.$el.append('<table>');
        console.log(table);
        var thead = table;
        var tbody = table.append('<tbody>');

        for (var column in data[0]) {
            if (data[0].hasOwnProperty(column)) {
                thead.append('<th>' + column + '</th>');
            }
        }



        // Create Header Row (TH)
//        thead.append("tr")
//            .selectAll("th")
//            .data(columns)
//            .enter()
//            .append("th")
//            .text(function(column) {
//                return column;
//            });
//
//        // Create a row for each object in the data
//        var rows = tbody.selectAll("tr")
//            .data(data)
//            .enter()
//            .append("tr");
//
//        // Create a cell in each row for each column
//        var cells = rows.selectAll("td")
//            .data(function(row) {
//                return columns.map(function(column) {
//                    return {
//                        column: column,
//                        value: row[column].join(', ')
//                    };
//                });
//            })
//            .enter()
//            .append("td")
//            .html(function(d) {
//                return d.value;
//            });

        // Twitter Bootstrap Classes
        $('table').addClass('table table-condensed simple-table');

        this.displayEl = table;

    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};
