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


    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * DOM Element
     *
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js ElementAttibutes Object (Instance)
     *
     * @type {plastic.ElementAttributes}
     */
    this.attributes = {};

    /**
     * Link to Attributes Object
     *
     * If you need easy access to the current Attributes Object, use this.
     *
     * @type {{}}
     */
    this.attr = this.attributes.attr;

    /**
     * Element specific Event PubSub
     */
    this.events = plastic.helper.Events();

    /**
     * Inherited (and overwritten) general element options
     *
     * @type {Object|plastic.options}
     */
    this.options = plastic.options;

    /**
     * Element Query Module Instance
     *
     * @type {{}}
     */
    this.queryModule = undefined;

    /**
     * Element Data Module Instance
     *
     * @type {{}}
     */
    this.dataModule = undefined;

    /**
     * Element Display Module Instance
     *
     * @type {{}}
     */
    this.displayModule = undefined;


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    this.getAttribues();



};

//////////////////////////////////////////
// Element Methods                      //
//////////////////////////////////////////

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

    getAttribues: function() {
        "use strict";
        this.attr = new plastic.ElementAttributes(this.el);
    },

    /**
     * Executes the processing of the plastic.element
     * This starts
     *
     * @todo Introduce Error State: Stop further Processing if there are Exceptions
     */
    execute: function() {

        console.info('plastic.processElement();');

        /** Asynchronous Mode */
        var async = false;
        var error = false;
        var request;
        var self = this;

        this.createMsgContainer(this.el);
        this.createDisplayContainer(this.el);


        //////////////////////////////////////////
        // CALLING QUERY PARSER                 //
        //////////////////////////////////////////

        if (this.attr.query) { // OPTIONAL
            this.callQueryParser();
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (this.attr.data && this.attr.data.url) {

            var start = (new Date()).getTime();
            async = true;

            console.log('Getting Data from URL via AJAX: ' + this.attr.data.url);

            request = $.ajax({
                url: this.attr.data.url,
                dataType: 'json',
                timeout: this.options.timeout,
                success: function(data) {
                    "use strict";
                    if (data !== null && typeof data === 'object') {
                        self.attr.data.raw = data;
                    } else {
                        self.attr.data.raw = $.parseJSON(data);
                    }
                },
                error: function() {
                    plastic.msg('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.el );
                    error = true;
                }
            });

        }


        //////////////////////////////////////////
        // CALLING THE DATA & DISPLAY MODULE    //
        //////////////////////////////////////////

        if (async) {

            // On Request complete
            request.complete(function(data) {

                console.log('Received asynchronous data.');
                var diff = (new Date()).getTime() - start;
                console.log("Request completed in " + diff + 'ms');

                if (!error) {
                    self.callDataParser();
                }
                if (!error) {
                    self.callDisplayModule();
                }
            });

        } else {

            console.log('Received Synchronous Data');

            self.callDataParser();
            self.callDisplayModule();

        }


    },

    /**
     * Helper Functin which creates a HTML Element for use as a Message Container
     */
    createMsgContainer: function() {
        "use strict";

        this.el.css('position', 'relative');

        this.el.append('<div class="plastic-js-msg"></div>');
        var msgEl = this.el.find('.plastic-js-msg');
        msgEl
            .height(this.el.height())
            .width(this.el.width())
        ;
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Display Container
     */
    createDisplayContainer: function() {
        "use strict";
        console.info('plastic.prepareCanvas();');

        this.el.append('<div class="plastic-js-display"></div>');
        var displayEl = this.el.find('.plastic-js-display');
        displayEl
            .height(this.el.height())
            .width(this.el.width())
        ;
    },

    /**
     * Helper Function to call the Query Parser Module
     */
    callQueryParser: function() {

        console.info('processElement.callQueryParser(); ' + this.attr.query.type);

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('query',[this.attr.query.type]);
        var Module = plastic.modules.query[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            this.queryModule = new Module(this.attr.query);
            this.validateModule(this.queryModule, this.attr.query);
            this.attr.data = this.queryModule.execute();

        } else {
            plastic.msg('Query Parser Module ' + this.attr.query.type + ' not found.', 'error', this.el);
        }

    },

    /**
     * Helper Function to call the Data Parser Module
     */
    callDataParser: function() {

        console.info('processElement.callDataParser()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('data',[this.attr.data.parser]);
        var Module = plastic.modules.data[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            console.dir(this.attr);

            this.dataModule = new Module(this.attr.data);
            this.validateModule(this.dataModule, this.attr.data.raw);
            this.attr.data = this.dataModule.execute();

        } else {
            plastic.msg('Data Parser Module ' + this.attr.data.parser + ' not found.', 'error', this.el);
        }

    },

    /**
     * Helper Function to call the Display Module
     *
     * @todo: Manage Dependencies
     */
    callDisplayModule: function() {

        var self = this;

        console.info('plastic.Element.callDisplayModule()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('display',[this.attr.options.display.module]);
        var Module = plastic.modules.display[moduleInfo.className];

        if (Module) {

            console.log('Using Display Module: ' + moduleInfo.className);
            console.log(moduleInfo.dependencies);

            plastic.modules.dependencies.add(moduleInfo.dependencies);

//            if (moduleInfo.dependencies && moduleInfo.dependencies.length > 0) {
//
//                console.log('Loading Dependencies');
//                for (var i = 0; i < moduleInfo.dependencies.length; i++) {
//                    var depInfo = moduleInfo.dependencies[i];
//                    var dep = plastic.modules.dependencies.registry[depInfo];
//                    console.dir(dep);
//
//                    yepnope({
//                        load: dep,
//                        complete: function() {
//                            "use strict";
//
//                            self.displayModule = new Module(self.el, self.attr);
//                            self.validateModule(self.displayModule, self.attr.options.display);
//                            self.displayModule.execute();
//                        }
//                    });
//
//                }
//            }

            return false;





        } else {
            plastic.msg('Display Module ' + this.attr.data.parser + ' not found.', 'error', this.el);
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
