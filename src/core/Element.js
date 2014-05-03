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
                            elAttr.data.raw = data;
                        } else {
                            elAttr.data.raw = $.parseJSON(data);
                        }
                    } catch(e) {
                        plastic.msg(e, 'error', el);
                    }

                })
                .fail(function() {
                    plastic.msg('Could not get Data from URL <a href="' + elAttr.data.url + '">' + elAttr.data.url + '</a>', "error", el );
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

        console.info('processElement.callQueryParser(); ' + elAttr.query.type);

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('query',[elAttr.query.type]);
        var Module = plastic.modules.query[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            this.queryModule = new Module(elAttr.query);
            this.validateModule(this.queryModule, elAttr.query);
            elAttr.data = this.queryModule.parse();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Query Parser Module ' + elAttr.query.type + ' not found.', 'error', el);
        }

        return elAttr;

    },

    /**
     * Helper Function to call the Data Parser Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDataParser: function(el, elAttr) {

        console.info('processElement.callDataParser()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('data',[elAttr.data.parser]);
        var Module = plastic.modules.data[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            console.dir(elAttr);

            this.dataModule = new Module(elAttr.data);
            this.validateModule(this.dataModule, elAttr.data.raw);
            elAttr.data = this.dataModule.parse();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Data Parser Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }

    },

    /**
     * Helper Function to call the Display Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDisplayModule: function(el, elAttr) {

        console.info('plastic.Element.callDisplayModule()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('display',[elAttr.options.display.module]);
        var Module = plastic.modules.display[moduleInfo.className];

        if (Module) {

            console.log('Using Display Module: ' + moduleInfo.className);

            // @todo: Manage Dependencies

            this.displayModule = new Module(el, elAttr);
            this.validateModule(this.displayModule, elAttr.options.display);
            this.displayModule.render();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Display Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }


    },

    /**
     * Validation Helper Function
     *
     * This calls two kinds of validations:
     * * General Validation: Validates custom Logic
     * * Schema Validation: Validates the Data Structure of the incoming data
     *
     * @param {{}} module   plastic.js Module
     * @param {{}} data     Data Object that is to be validated
     */
    validateModule: function(module, data) {

        if (module.validate) {
            var validationErrors = module.validate();

            // validation was successful
            if (validationErrors) {
                console.dir(validationErrors);
                throw new Error('Validation Error!');
            }
        }

        if (module.validationSchema) {

            console.log('Schema Validation');

            var env = jjv();
            env.addSchema('data', module.validationSchema);
            var schemaErrors = env.validate('data', data);

            // validation was successful
            if (schemaErrors) {
                console.dir(schemaErrors);
                throw new Error('Data Structure invalid!');
            }
        }
    }

};
