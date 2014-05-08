/**
 * Schema Parser Helper Function
 *
 * @singleton
 * @namespace
 */
plastic.ElementSchema = function(pEl) {
    "use strict";

    /**
     * plastic.js Element Object
     */
    this.pEl = pEl;

    this.dataDescription = {};

    /**
     * Description Schema
     * @type {{}}
     */
    this.descriptionSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": this.dataDescription
    };



};

plastic.ElementSchema.prototype = {


    /**
     * Apply schema (if available) to the data
     */
    apply: function () {
        "use strict";
        this.dataDescription = this.pEl.attr.data.description;

        if (this.dataDescription && Object.keys(this.dataDescription).length > 0) {
            this.applyHtml();
        }

    },

    /**
     * Calculates processed Data (HTML'ified) with the descriptionSchema applied
     *
     * @todo (Optionally) validate data against the descriptionSchema
     *
     * @returns {[]}
     */
    applyHtml: function() {
        "use strict";

        /**
         * Maps DataTypes (Formats) to a converter function, which returns the HTML reprentation of the type
         *
         * @type {{}}
         */
        var htmlMapper = {
            "email": function(val) {
                var strippedVal = val.replace('mailto:', '');
                return '<a href="' + val + '">' + strippedVal + '</a>';
            },
            "uri": function(val) {
                return '<a href="' + val + '">' + val + '</a>';
            }
        };


        var self = this;
        var processedData = this.pEl.attr.data.processed;

        var processedHtml = $.extend(true, [], processedData); // Deep Copy

        for (var i = 0; i < processedHtml.length; i++) {

            var row = processedHtml[i];

            for (var cellType in row) {

                var cellValue = row[cellType];
                var format = this.dataDescription[cellType].format;

                // TODO: Case-Handling: value could be no array (?)
                for (var j = 0; j < cellValue.length; j++) {

                    if (format) {
                        cellValue[j] = htmlMapper[format](cellValue[j]);
                    }
                }
            }

        }

        this.pEl.attr.data.processedHtml = processedHtml;
    }
};
