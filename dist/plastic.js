/*! plastic - v0.0.1 - 2014-04-17
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
var plastic = (function () {

    /**
     * Bootstrap plastic.js
     */
    $(document).ready(function() {

        console.log('plastic.js version: ' + plastic.version);

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.$elements = $('plastic, .plastic-js');

        // Iterate all <plastic>
        plastic.$elements.each(function() {
            plastic.prepareCanvas($(this));
            plastic.getPlasticElementData($(this));
        });

    });


    /**
     * Reveal public pointers to private functions and properties
     */
    return {

        version: '0.0.2', // semver

        /** This holds all the plastic jQuery elements */
        $elements: [],

        /** Data Parser Namespace */
        dataParser: {
            available: {}
        },

        /** Data Parser Namespace */
        queryParser: {
            available: {}
        },

        /** Data Parser Namespace */
        schemaParser: {
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
    width: '100%'
};

/**
 * Helper Function that calls the proper Display Module
 *
 * @param elData
 */
plastic.callDisplay = function(elData) {
    var displayModule = plastic.display.available[elData.options.display];
    plastic.display[displayModule](elData);
};

/**
 * Helper Function that calls the proper ParseData Module
 *
 * @param elData
 */
plastic.callParseData = function(elData) {
    console.info('PARSING DATA');
    console.dir(elData);

    var parser = plastic.dataParser.available[elData.options.dataFormat];

    elData.data = plastic.dataParser[parser](elData.rawData);

    plastic.callDisplay(elData);
};

// TODO!

// TODO!

/**
 * Gets MetaData (Data/DataURL and Options) from <plastic> Element
 *
 * // TODO: Error Handling
 *
 * @param $el    Plastic HTML Element selected via jQuery
 */
plastic.getPlasticElementData = function($el) {

    var elData = {};
    var async = false;
    var request;

    console.info('main.getPlasticData(el)');


    //////////////////////////////////////////
    // GET GENERAL DATA                     //
    //////////////////////////////////////////

    elData.height = $el.height();
    elData.width = $el.width();

    // TODO: Integrate this with width and height from options (?)
    // TODO: Case handling if size was not defined (could be 0 height)


    //////////////////////////////////////////
    // GET DATA DATA                        //
    //////////////////////////////////////////

    // Get Data-URL
    elData.dataUrl = $el.find(".plastic-data").attr('data-src');

    if (elData.dataUrl) { // Get Data from URL if given

        async = true;

        // TODO: Asynchronous Event !!!

        request = $.ajax(elData.dataUrl)

            .fail(function() {
                console.error( "error" );
            })
            .always(function() {

            });

    } else {
        // Else: Get data from script tag

        var dataObject = $el.find(".plastic-data");

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
    // GET OPTIONS DATA                     //
    //////////////////////////////////////////

    var optionsObject = $el.find(".plastic-options");

    console.log('$el.find(".plastic-options");');
    console.dir(optionsObject);

    if (optionsObject.length > 0) {
        var optionsString = optionsObject[0].innerText;
        if (optionsString && optionsString !== '') {
            elData.options = JSON.parse(optionsString);
        } else {
            console.log('Empty Element!');
        }
    } else {
        console.log('No Options Object');
    }

    //////////////////////////////////////////
    // GET SCHEMA DATA                      //
    //////////////////////////////////////////

    // TODO


    //////////////////////////////////////////
    // GET QUERY DATA                       //
    //////////////////////////////////////////

    // TODO


    //////////////////////////////////////////
    // VALIDATE AND PASSING ON              //
    //////////////////////////////////////////

    /**
     * Validate the elData Object
     *
     * // TODO: Not implemented yet
     *
     * @param elData
     */
    var validate = function(elData) {
        plastic.callParseData(elData);
    };


    if (!async) {
        console.log('Received Synchronous Data');
        validate(elData);
    } else {
        request.done(function(data) {

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

            validate(elData);
        });
    }





};

/**
 * Inserts a drawing Canvas which has exactly the same size as the plastic Element
 *
 * TODO: If no size is given, or given by the options -> Consider this
 *
 * @param el
 */
plastic.prepareCanvas = function(el) {
    console.info('PREPARING VISUALISATION');

    el.append('<div id="vis"></div>');
    $('#vis')
        .height(el.height())
        .width(el.width())
        .css('overflow', 'scroll')
        .css('padding', '5px')
    ;

};

// This will parse the default plastic.js data-format.

// TODO: This is not implemented yet
// TODO: Decide how the default data format should look like

// Register dataParser
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

// Register query parser
plastic.queryParser.available['sparql'] = 'sparql';

/**
 * This is a SPARQL Query Parser
 * It turns the Query into an API URL
 *
 * TODO: Not implemented yet.
 */
plastic.queryParser.sparql = function() {

};

// TODO: Write a default Schema Parser
// TODO: Decide how the default schema should look like

// Register display module
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
