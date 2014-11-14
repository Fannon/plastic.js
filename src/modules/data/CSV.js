// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: ['csv', 'tsv', 'text/comma-separated-values'],
    className: 'CSV',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.CSV = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * Raw Data Schema for validation
     *
     * No schema since CSV is no JSON format
     *
     * @type {{}}
     */
    this.rawDataSchema = {};

};

plastic.modules.data.CSV.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {

        console.info(this.dataObj.raw);
        var separator = ';';

        if (this.dataObj.module === 'tsv') {
            separator = '\t';
        }

        this.dataObj.processed = this.parseCSV(this.dataObj.raw, separator, false);

        return this.dataObj;
    },

    /**
     * Parses CSV String to Array
     *
     * http://www.greywyvern.com/?post=258
     *
     * @param csv
     * @param seperator
     * @param linebreak
     * @returns {Array|*}
     */
    parseCSV: function(csv, seperator, linebreak) {

        var processedData = [];
        var headers = [];

        var csvLines = csv.split(linebreak || '\r\n');

        for (var i = 0; i < csvLines.length; i++) {

            var line = csvLines[i];

            if (i === 0) {
                headers = line.split(seperator || ';');
                console.log(headers);
            } else {
                if (line.length > 0) {
                    processedData[i] = {};
                    console.info(line);

                    var csvCells = line.split(seperator || ';');

                    for (var j = 0; j < csvCells.length; j++) {

                        var cell = csvCells[j];
                        processedData[i][headers[j]] = cell;
                    }

                }
            }


        }

        console.dir(processedData);


        return processedData;
    }
};
