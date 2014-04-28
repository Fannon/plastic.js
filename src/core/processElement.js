/**
 * Process a specific plastic element
 *
 * This initiates all the main steps necessary to create a Data Display
 *
 * The Main Steps are:
 *  1 IF Query provided         Calling the Query Parser
 *  2 IF Data URL provided      Getting the Data via AJAX
 *  2 IF Schema provided        Calling the Schema Parser
 *  4 ALWAYS                    Calling the Data Parser
 *  5 ALWAYS                    Calling the Display Module
 *
 */
plastic.processElement = (function () {

    /**
     * @param el
     * @param elData
     */
    var process = function(el, elData) {

        console.info('plastic.processElement();');

        this.el = el;
        this.elData = elData;

        var async = false;

        plastic.prepareCanvas(el);


        //////////////////////////////////////////
        // CALLING QUERY PARSER                 //
        //////////////////////////////////////////

        if (elData.query) { // OPTIONAL
            // TODO
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////


        if (elData.data.url) { // OPTIONAL: Get Data asyncronally from URL (if given)

            async = true;

            var request = $.ajax(elData.data.url)
                    .fail(function() {
                        plastic.helper.msg('Could not get Data from URL ' + elData.dataUrl, "error", el );
                    })
                    .done(function(data) {

                        // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
                        console.log('Getting Data from URL via AJAX');

                        try {
                            if (data !== null && typeof data === 'object') {
                                elData.data.object = data;
                            } else {
                                elData.rawData = $.parseJSON(data);
                            }
                        } catch(e) {
                            console.error(e);
                        }

                        console.log('Received asynchronous data.');

                        callDataParser(el, elData);

                        callDisplayModule(el, elData);


                    })
                    .always(function() {

                    })
                ;

        }


        //////////////////////////////////////////
        // CALLING SCHEMA PARSER                 //
        //////////////////////////////////////////

        if (elData.schema) { // OPTIONAL
            // TODO
        }



        //////////////////////////////////////////
        // CALLING THE DATA PARSER              //
        //////////////////////////////////////////

        if (!async) {
            console.msg('Received Synchronous Data');
            callDataParser(el, elData);
        } else {
            // Data will be sent within the "Getting Data via URL Function when its done"
        }




        //////////////////////////////////////////
        // CALLING DISPLAY MODULE               //
        //////////////////////////////////////////



        // TODO: Wait for Data if requested via AJAX


    };

    /**
     * Helper Function to call the Query Parser Module
     *
     * @private
     *
     * @param elData
     */
    var callQueryParser = function(el, elData) {
        console.info('processElement.callQueryParser()');
        return true;
    };

    /**
     * Helper Function to call the Schema Parser Module
     *
     * @private
     *
     * @param elData
     */
    var callSchemaParser = function(el, elData) {
        console.info('processElement.callSchemaParser()');
        return true;
    };

    /**
     * Helper Function to call the Data Parser Module
     *
     * @private
     *
     * @param el
     * @param elData
     */
    var callDataParser = function(el, elData) {

        console.info('processElement.callDataParser()');
        console.dir(elData);

        // Look for data parser module in the registry
        var parser = plastic.modules.dataParser[elData.data.parser];

        if (parser) {

            console.log('Using Parser: ' + parser.name);

            try {
                parser.validate(elData.data.object);
                elData.data.object = parser.parse(elData.data.object);
            } catch(e) {
                plastic.helper.msg(e, 'error', this.el);
            }

        } else {
            plastic.helper.msg('Data Parser Module ' + elData.data.parser + ' not found.', 'error', el);
        }

    };

    /**
     * Helper Function to call the Display Module
     *
     * @private
     *
     * @param el
     * @param elData
     */
    var callDisplayModule = function(el, elData) {

        console.info('processElement.callDataParser()');
        console.dir(elData);

        // Look for data parser module in the registry
        var displayModule = plastic.modules.display[elData.options.display.module];

        if (displayModule) {

            console.log('Using Display Module: ' + displayModule.name);

            if (plastic.options.debug) {
                displayModule.validate(elData);
                elData.data = displayModule.render(el, elData);
            } else {
                try {
                    displayModule.validate(elData);
                    elData.data = displayModule.render(el, elData);
                } catch(e) {
                    plastic.helper.msg(e, 'error', this.el);
                }
            }


        } else {
            plastic.helper.msg('Display Module ' + elData.data.parser + ' not found.', 'error', el);
        }


    };

    return process;


})();
