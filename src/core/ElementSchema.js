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

    /**
     * Description Schema
     * @type {{}}
     */
    this.descriptionSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {}
    };

};

plastic.ElementSchema.prototype = {

    /**
     * Maps DataTypes (Formats) to a converter function, which returns the HTML reprentation of the type
     *
     * @type {{}}
     */
    htmlMap: {
        "email": function(val) {
            "use strict";
            var strippedVal = val.replace('mailto:','');
            return '<a href="' + val + '">' + strippedVal + '</a>';
        },
        "uri": function(val) {
            "use strict";
            return '<a href="' + val + '">' + val + '</a>';
        }
    },

    /**
     * Calculates processed Data (HTML'ified) with the descriptionSchema applied
     *
     * @todo (Optionally) validate data against the descriptionSchema
     *
     * @param processedData
     * @param descriptionSchema
     *
     * @returns {[]}
     */
    getHtmlData: function(processedData, descriptionSchema) {
        "use strict";

        var self = this;
        var processedHtml = $.extend(true, [], processedData); // Deep Copy

        for (var i = 0; i < processedHtml.length; i++) {

            var row = processedHtml[i];

            for (var cellType in row) {

                var cellValue = row[cellType];
                var format = descriptionSchema.properties[cellType].format;

                // TODO: Case-Handling: value could be no array (?)
                for (var j = 0; j < cellValue.length; j++) {

                    if (format) {
                        cellValue[j] = self.htmlMap[format](cellValue[j]);
                    }
                }
            }

        }

        return processedHtml;
    }
};
