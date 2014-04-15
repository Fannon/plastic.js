/*! plastic - v0.0.1 - 2014-04-15
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
var plastic = (function () {

    $(document).ready(function() {

        console.log('plastic.js version: ' + plastic.version);

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.$elements = $('plastic');

        // Iterate all <plastic>
        plastic.$elements.each(function() {
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
    function getPlasticData(el) {

        var elData = {};
        var async = false;

        console.log('main.getPlasticData(el)');


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
                    console.log('getJSON from URL');
                    elData.data = data;
                })
                .fail(function() {
                    console.error( "error" );
                })
                .always(function() {
                    console.log('##### Asynchronous MetaData: ');
                    console.dir(elData);
                });


        } else {
            // Else: Get data from script tag

            var dataObject = el.find(".plastic-data");

            if (dataObject.length > 0) {
                var dataString = dataObject[0].text;
                if (dataString && dataString !== '') {
                    elData.data = JSON.parse(dataString);
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

        //////////////////////////////////////////
        // OPTIONS                              //
        //////////////////////////////////////////

        elData.height = el.height();
        elData.width = el.width();

        if (!async) {
            console.log('##### Synchronous MetaData: ');
            console.dir(elData);
        }

    }



    // Reveal public pointers to private functions and properties
    return {

        version: '0.0.2', // semver

        $elements: [],

        /** Display Modules Namespace */
        display: {},

        /** Helper Functions Namespace */
        helper: {},

        /** Data Parser Namespace */
        dataParser: {}

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

plastic.dataParser.sparqlJson = (function () {

    var a = 1;

    return {
        a: a,
        test: 'test'
    };

})();

/**
 * Table Display Module
 */
plastic.display.table = (function () {

    var a = 1;

    return {
        a: a,
        test: 'test'
    };

})();

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
