// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'simple-table',
    className: 'SimpleTable',
    dependencies: []
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
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "type": "object",
        "properties": {
            "tableClasses": {
                "description": "Table CSS Classes",
                "type": "string",
                "default": ""
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
        var options = this.elAttr.display.options;

        // Use schema-processed HTML data if available:
        if (this.elAttr.data.processedHtml) {
            data = this.elAttr.data.processedHtml;
        } else {
            data = this.elAttr.data.processed;
        }

        var $table = $('<table class="' + options.tableClasses + '" />');

        
        //////////////////////////////////////////
        // Table Head                           //
        //////////////////////////////////////////

        var $tableHead = $('<thead />');
        var $headRow = $('<tr/>');

        for (var column in data[0]) {
            if (data[0].hasOwnProperty(column)) {
                $headRow.append('<th>' + column + '</th>');
            }
        }

        $tableHead.append($headRow);
        $table.append($tableHead);


        //////////////////////////////////////////
        // Table Body                           //
        //////////////////////////////////////////

        var $tableBody = $('<tbody />');

        $.each(data, function(index, row) {

            var $row = $('<tr/>');

            for (var colName in row) {
                $('<td/>').html(row[colName]).appendTo($row);
            }
            $tableBody.append($row);
        });

        $table.append($tableBody);


        this.$el.append($table);

    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};
