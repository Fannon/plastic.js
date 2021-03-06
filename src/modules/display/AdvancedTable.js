// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'advanced-table',
    className: 'AdvancedTable',
    dependencies: ['dataTable']
});

/**
 * Table Display Module
 *
 * @constructor
 */
plastic.modules.display.AdvancedTable = function($el, elAttr) {
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

        "title": "Advanced Table",

        "type": "object",
        "properties": {
            "tableClasses": {
                "title": "Table Classes",
                "description": "Table CSS Classes",
                "type": "string",
                "default": ""
            },
            "paging": {
                "title": "Paging",
                "description": "Enable Pagination of Table Elements",
                "type": "boolean",
                "default": false
            },
            "lengthMenu": {
                "title": "Menu Length",
                "description": "Sets the available number of entries in the dropdown menu. Takes an 2dim array.",
                "type": "array",
                "default": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ]
            },
            "searching": {
                "title": "Searching",
                "description": "Enable Searching of Table Elements",
                "type": "boolean",
                "default": true
            },
            "ordering": {
                "title": "Ordering",
                "description": "Feature control ordering (sorting) abilities in DataTables.",
                "type": "boolean",
                "default": true
            },
            "orderMulti": {
                "title": "Multiple Ordering",
                "description": "Multiple column ordering ability control.",
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

plastic.modules.display.AdvancedTable.prototype = {

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

        $table.DataTable(options);

    },

    update: function() {
        "use strict";
        this.execute();
    }

};
