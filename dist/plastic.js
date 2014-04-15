/*! plastic - v0.0.1 - 2014-04-15
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
var plastic = (function () {

    /**
     * Bootstrap plastic.js
     */
    $(document).ready(function() {

        console.log('plastic.js version: ' + plastic.version);

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.$elements = $('plastic');

        // Iterate all <plastic>
        plastic.$elements.each(function() {
            prepareVisualisation($(this));
            getPlasticData($(this));
        });

    });

    /**
     * Gets MetaData (Data/DataURL and Options) from <plastic> Element
     *
     * // TODO: Error Handling
     *
     * @param el
     */
    var getPlasticData = function(el) {

        var elData = {};
        var async = false;

        console.info('main.getPlasticData(el)');


        //////////////////////////////////////////
        // DATA                                 //
        //////////////////////////////////////////

        // Get Data-URL
        elData.dataUrl = el.attr('data-url');

        if (elData.dataUrl) { // Get Data from URL if given

            async = true;

            // TODO: Asynchronous Event !!!

            var request = $.ajax(elData.dataUrl)

                .done(function(data) {

                    // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
                    console.log('Getting Data from URL via AJAX');

                    try {
                        if (data !== null && typeof data === 'object') {
                            elData.rawData = data;
                        } else {
                            elData.rawData = $.parseJSON(data);
                        }
                    } catch(e) {
                        console.error(e);
                    }

                    console.log('Received asynchronous data.');
                    parseData(elData);
                })
                .fail(function() {
                    console.error( "error" );
                })
                .always(function() {

                });


        } else {
            // Else: Get data from script tag

            var dataObject = el.find(".plastic-data");

            if (dataObject.length > 0) {
                var dataString = dataObject[0].text;
                console.log(dataString);
                if (dataString && dataString !== '') {
                    elData.rawData = $.parseJSON(dataString);
                } else {
                    console.log('Empty Element!');
                }
            } else {
                console.log('No Data Object');
            }
        }

        //////////////////////////////////////////
        // OPTIONS                              //
        //////////////////////////////////////////

        var optionsObject = el.find(".plastic-options");

        if (optionsObject.length > 0) {
            var optionsString = optionsObject[0].text;
            if (optionsString && optionsString !== '') {
                elData.options = JSON.parse(optionsString);
            } else {
                console.log('Empty Element!');
            }
        } else {
            console.log('No Options Object');
        }

        elData.height = el.height();
        elData.width = el.width();

        if (!async) {
            console.log('Received Synchronous Data');
            parseData(elData);
        }

    };

    /**
     * Helper Function that calls the proper ParseData Module
     *
     * @param elData
     */
    var parseData = function(elData) {
        console.info('PARSING DATA');
        console.dir(elData);
        var parser = plastic.dataParser.available[elData.options.dataFormat];

        elData.data = plastic.dataParser[parser](elData.rawData);

        drawData(elData);
    };

    /**
     * Helper Function that calls the proper Display Module
     *
     * @param elData
     */
    var drawData = function(elData) {
        var displayModule = plastic.display.available[elData.options.display];
        plastic.display[displayModule](elData);
    };

    /**
     * Inserts a drawing Canvas which has exactly the same size as the plastic Element
     *
     * TODO: If no size is given, or given by the options -> Consider this
     *
     * @param el
     */
    var prepareVisualisation = function(el) {
        console.info('PREPARING VISUALISATION');

        el.append('<div id="vis"></div>');
        $('#vis')
            .height(el.height())
            .width(el.width())
            .css('overflow', 'scroll')
            .css('padding', '5px')
        ;

    };


    /**
     * Reveal public pointers to private functions and properties
     */
    return {

        version: '0.0.2', // semver

        $elements: [],

        /** Data Parser Namespace */
        dataParser: {
            available: {}
        },

        /** Data Parser Namespace */
        queryParser: {
            available: {}
        },

        /** Display Modules Namespace */
        display: {
            available: {}
        },

        /** Helper Functions Namespace */
        helper: {}



    };

})();


/**
 * Plastic.js (default) Options
 * Written in JSON Notation
 *
 * @type {{}}
 */
plastic.options = {
    test: 1
};

/* global plastic */

// Register Parser
plastic.dataParser.available['sparql-json'] = 'sparqlJson';

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @param data
 * @returns Array
 */
plastic.dataParser.sparqlJson = function(data) {


    console.info('PARSING DATA VIA: SPARQL JSON');
    console.dir(data);

    var processedData = [];

    for (var i = 0; i < data.results.bindings.length; i++) {

        processedData[i] = {};

        var row = data.results.bindings[i];

        for (var o in row) {
            processedData[i][o] = row[o].value;
        }
    }

    console.dir(processedData);

    return processedData;

};

plastic.display.available['table'] = 'table';

/**
 * Table Display Module
 */
plastic.display.table = function (elData) {

    console.info('DISPLAY MODULE: TABLE');
    console.dir(elData);

    var data = elData.data;
    var vis = d3.select("#vis");

    var table = vis.append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Get Columns from Data
    var columns = [];
    for (var o in data[0]) {
        if (data[0].hasOwnProperty(o)) {
            columns.push(o);
        }
    }

    // Create Header Row (TH)
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) {
            return column;
        });

    // Create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // Create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {
                    column: column,
                    value: row[column]
                };
            });
        })
        .enter()
        .append("td")
        .html(function(d) {
            return d.value;
        });

    // Twitter Bootstrap Classes
    $('table').addClass('table table-condensed');

    return table;

};

/* global plastic */

/**
 * Global Log Function
 * Should be used instead of console.logs
 *
 * TODO: Make this visible as an overlay of the visualisation
 * TODO: Make it closeable
 *
 * @param type      enum: info, warning, error)
 * @param msg       Log Message
 */
plastic.helper.log = function (type, msg) {
    // TODO
    console.log(type + ' :: ' + msg);
};

/* global plastic */

/**
 * This is a SPARQL Query Parser
 * It turns the Query into an API URL
 *
 * TODO: Not implemented yet.
 */
plastic.queryParser.sparql = function() {

};
