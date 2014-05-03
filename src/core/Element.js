/**
 * Plastic Element Prototype
 *
 * This creates a new plastic.js element and executes all processes needed to get the final result
 *
 * @example
 * plastic.elements[i] = new plastic.Element(el);
 *
 * @constructor
 */
plastic.Element = function(el) {

    /**
     * DOM Element
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js ElementAttibutes Object (Instance)
     * @type {plastic.ElementAttributes}
     */
    this.attributes = new plastic.ElementAttributes(el);

    /**
     * Link to Attributes Object
     * If you need easy access to the current Attributes Object, use this.
     * @type {{}}
     */
    this.attr = this.attributes.attr;

    this.queryModule = false;
    this.dataModule = false;
    this.displayModule = false;

    this.process(this.el, this.attr);

};

plastic.Element.prototype = {

    /**
     * Get DOM Element within PlasticElement Container
     * @returns {Object}
     */
    getEl:function() {
        return this.el;
    },

    /**
     * Get DOM Element within PlasticElement Container
     * @param el
     */
    setEl:function(el) {
        this.el = el;
    },

    /**
     * Get plastic.js Element Attributes
     * @returns {Object}
     */
    getAttr:function() {
        return this.attr;
    },

    /**
     * TODO: Introduce Error State: Stop further Processing if there are Exceptions
     *
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    process: function(el, elAttr) {

        console.info('plastic.processElement();');

        /** Asynchronous Mode */
        var async = false;
        var error = false;
        var request;
        var self = this;

        this.createMsgContainer(el);
        this.createDisplayContainer(el);


        //////////////////////////////////////////
        // CALLING QUERY PARSER                 //
        //////////////////////////////////////////

        if (elAttr.query) { // OPTIONAL
            elAttr = this.callQueryParser(el, elAttr);
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (elAttr.data && elAttr.data.url) { // OPTIONAL: Get Data asyncronally from URL (if given)

            var start = (new Date()).getTime();
            async = true;

            console.log('Getting Data from URL via AJAX: ' + elAttr.data.url);

            request = $.getJSON(elAttr.data.url)
                .done(function(data) {
                    try {
                        if (data !== null && typeof data === 'object') {
                            elAttr.data.object = data;
                        } else {
                            elAttr.data.object = $.parseJSON(data);
                        }
                    } catch(e) {
                        plastic.helper.msg(e, 'error', el);
                    }

                })
                .fail(function() {
                    plastic.helper.msg('Could not get Data from URL <a href="' + elAttr.data.url + '">' + elAttr.data.url + '</a>', "error", el );
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
                    self.callDataParser(el, elAttr);
                }
                if (!error) {
                    self.callDisplayModule(el, elAttr);
                }
            });

        } else {

            console.log('Received Synchronous Data');

            if (!error) {
                self.callDataParser(el, elAttr);
            }
            if (!error) {
                self.callDisplayModule(el, elAttr);
            }

        }


    },

    createMsgContainer: function(el) {
        "use strict";

        el.css('position', 'relative');

        el.append('<div class="plastic-js-msg"></div>');
        var msgEl = el.find('.plastic-js-msg');
        msgEl
            .height(el.height())
            .width(el.width())
        ;
    },

    createDisplayContainer: function(el) {
        "use strict";
        console.info('plastic.prepareCanvas();');

        el.append('<div class="plastic-js-display"></div>');
        var displayEl = el.find('.plastic-js-display');
        displayEl
            .height(el.height())
            .width(el.width())
        ;
    },

    /**
     * Helper Function to call the Query Parser Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callQueryParser: function(el, elAttr) {

        console.info('processElement.callQueryParser();');

        var newElData = elAttr;

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.query._registry[elAttr.query.type];

        if (moduleInfo) {
            var parser = plastic.modules.query[moduleInfo.fileName];

            if (parser) {

                if (plastic.options.debug) {
                    parser.validate(elAttr.query);
                    newElData.data = parser.parse(elAttr.query);
                } else {
                    try {
                        parser.validate(elAttr.query);
                        newElData.data = parser.parse(elAttr.query);
                    } catch(e) {
                        plastic.helper.msg(e, 'error', this.el);
                    }
                }


            } else {
                plastic.helper.msg('Query Parser Module for Type ' + elAttr.query.type + ' not found. (Module)', 'error', el);
            }

        } else {
            plastic.helper.msg('Query Parser Module for Type ' + elAttr.query.type + ' not found. (Registry)', 'error', el);
        }

        return newElData;
    },

    /**
     * Helper Function to call the Data Parser Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDataParser: function(el, elAttr) {

        console.info('processElement.callDataParser()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.data._registry[elAttr.data.parser];
        var parser = plastic.modules.data[moduleInfo.fileName];

        if (parser) {

            console.log('Using Parser: ' + parser.name);

            try {
                this.validateDataStructure(parser, elAttr.data.object);
                parser.validate(elAttr.data.object);
                elAttr.data.object = parser.parse(elAttr.data.object);
            } catch(e) {
                plastic.helper.msg(e, 'error', el);
            }

        } else {
            plastic.helper.msg('Data Parser Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }

    },

    /**
     * Helper Function to call the Display Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDisplayModule: function(el, elAttr) {

        console.info('processElement.callDataParser()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.display._registry[elAttr.options.display.module];
        var displayModule = plastic.modules.display[moduleInfo.fileName];

        if (displayModule) {

            console.log('Using Display Module: ' + displayModule.name);

            if (plastic.options.debug) {
                displayModule.validate(elAttr);
                elAttr.data = displayModule.render(el, elAttr);
            } else {
                try {
                    displayModule.validate(elAttr);
                    elAttr.data = displayModule.render(el, elAttr);
                } catch(e) {
                    plastic.helper.msg(e, 'error', this.el);
                }
            }


        } else {
            plastic.helper.msg('Display Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }


    },

    /**
     * Validates the Data Structure of the incoming data according to the module validation schema
     *
     * @param {{}} module   plastic.js Module
     * @param {{}} data     Data Object that is to be validated
     */
    validateDataStructure: function(module, data) {
        if (module.dataStructure) {
            var env = jjv();
            env.addSchema('data', module.dataStructure);
            var errors = env.validate('data', data);

            // validation was successful
            if (errors) {
                console.dir(errors);
                throw new Error('Data Structure invalid!');
            }
        }
    }

};
