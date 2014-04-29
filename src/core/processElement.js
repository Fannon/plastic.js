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
     * TODO: Introduce Error State: Stop further Processing if there are Exceptions
     *
     * @param el
     * @param elData
     */
    var process = function(el, elData) {

        console.info('plastic.processElement();');

        /** Asynchronous Mode */
        var async = false;
        var error = false;
        var request;

        plastic.prepareCanvas(el);


        //////////////////////////////////////////
        // CALLING QUERY PARSER                 //
        //////////////////////////////////////////

        if (elData.query) { // OPTIONAL
            elData = callQueryParser(el, elData);
        }


        //////////////////////////////////////////
        // CALLING SCHEMA PARSER                 //
        //////////////////////////////////////////

        if (elData.schema) { // OPTIONAL
            elData = callSchemaParser(el, elData);
        }



        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (elData.data && elData.data.url) { // OPTIONAL: Get Data asyncronally from URL (if given)

            var start = (new Date()).getTime();
            async = true;

            console.log('Getting Data from URL via AJAX: ' + elData.data.url);

            request = $.getJSON(elData.data.url)
                .done(function(data) {
                    try {
                        if (data !== null && typeof data === 'object') {
                            elData.data.object = data;
                        } else {
                            elData.data.object = $.parseJSON(data);
                        }
                    } catch(e) {
                        plastic.helper.msg(e, 'error', el);
                    }

                })
                .fail(function() {
                    plastic.helper.msg('Could not get Data from URL ' + elData.data.url, "error", el );
                    error = true;
                })
                .always(function() {
                    var diff = (new Date()).getTime() - start;
                    console.log("Request completed in " + diff + 'ms');
                })
            ;

        }



        //////////////////////////////////////////
        // CALLING THE DATA & DISPLAX MODULE    //
        //////////////////////////////////////////

        if (async) {

            // On Request complete
            request.complete(function(data) {

                console.log('Received asynchronous data.');

                if (!error) {
                    callDataParser(el, elData);
                }
                if (!error) {
                    callDisplayModule(el, elData);
                }
            });

        } else {

            console.log('Received Synchronous Data');

            if (!error) {
                callDataParser(el, elData);
            }
            if (!error) {
                callDisplayModule(el, elData);
            }

        }


    };

    /**
     * Helper Function to call the Query Parser Module
     *
     * @private
     *
     * @param el
     * @param elData
     */
    var callQueryParser = function(el, elData) {

        console.info('processElement.callQueryParser();');

        var newElData = elData;

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.queryParser._registry[elData.query.type];

        if (moduleInfo) {
            var parser = plastic.modules.queryParser[moduleInfo.fileName];

            if (parser) {

                if (plastic.options.debug) {
                    parser.validate(elData.query);
                    newElData.data = parser.parse(elData.query);
                } else {
                    try {
                        parser.validate(elData.query);
                        newElData.data = parser.parse(elData.query);
                    } catch(e) {
                        plastic.helper.msg(e, 'error', this.el);
                    }
                }


            } else {
                plastic.helper.msg('Query Parser Module for Type ' + elData.query.type + ' not found. (Module)', 'error', el);
            }

        } else {
            plastic.helper.msg('Query Parser Module for Type ' + elData.query.type + ' not found. (Registry)', 'error', el);
        }




        return newElData;
    };

    /**
     * Helper Function to call the Schema Parser Module
     *
     * @private
     *
     * @param el
     * @param elData
     */
    var callSchemaParser = function(el, elData) {
        console.info('processElement.callSchemaParser()');

        var newElData = elData;

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.schemaParser._registry[elData.schema.type];
        var parser = plastic.modules.schemaParser[moduleInfo.fileName];

        if (parser) {

            if (plastic.options.debug) {
                parser.validate(elData.query);
                newElData = parser.parse(elData);
            } else {
                try {
                    parser.validate(elData.query);
                    newElData = parser.parse(elData);
                } catch(e) {
                    plastic.helper.msg(e, 'error', this.el);
                }
            }


        } else {
            plastic.helper.msg('Schema Parser Module for Type ' + elData.query.type + ' not found.', 'error', el);
        }

        return newElData;
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

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.dataParser._registry[elData.data.parser];
        var parser = plastic.modules.dataParser[moduleInfo.fileName];

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

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.display._registry[elData.options.display.module];
        var displayModule = plastic.modules.display[moduleInfo.fileName];

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
