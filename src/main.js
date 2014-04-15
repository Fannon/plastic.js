/*
 * <plastic>
 *
 * Copyright (c) 2014 Simon Heimler
 * Licensed under the MIT license.
 */

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

