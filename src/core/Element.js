/**
 * Plastic Element Prototype
 *
 * This creates a new plastic.js element and executes all processes needed to get the final result
 *
 * @example
 * plastic.elements[i] = new plastic.Element(el);
 *
 * @param {string|Object} el jQuery DOM Element or jQuery Selector ID String
 *
 * @constructor
 */
plastic.Element = function(el) {

    // If given an selector String, use jQuery to get the element
    if (typeof el === 'string' || el instanceof String) {
        if (el.charAt(0) === '#') {
            el = $(el);
        } else {
            throw new Error('plasticElement Constructor only takes HTML ID Selectors! (e.g. "#myel")');
        }
    }


    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = el;

    if (el && el[0] && el[0].id) {

        /**
         * HTML ID if available, otherwise auto generated ID
         * @type {String}
         */
        this.id = el[0].id;

    } else {
        this.id = 'plastic-el-' + plastic.elements.length + 1;
    }

    /**
     * Inherited (and overwritten) general element options
     *
     * @type {Object|plastic.options}
     */
    this.options = plastic.options;

    if (this.options.debug) {
        console.log('[#' + this.id + '] new plastic.Element()');
    }

    /**
     * Element specific Event PubSub
     */
    this.events = new plastic.helper.Events();

    /**
     * Total Number of asynchronous Events to wait for
     *
     * @type {number}
     */
    this.eventsTotal = 0;

    /**
     * Current Number of asynchronous Events that already happened
     *
     * If this equals this.eventsTotal, the Element can be
     * @type {number}
     */
    this.eventsProgress = 0;

    /**
     * Benchmark Time Start (ms timestamp)
     * @type {number}
     */
    this.benchmarkStart = (new Date()).getTime();

    /**
     * Benchmark Time Data loaded (ms timestamp)
     * @type {number}
     */
    this.benchmarkDataLoaded = 0;

    /**
     * Benchmark Time Modules loaded (Array of ms timestamp)
     * @type {Array}
     */
    this.benchmarkModulesLoaded = [];

    /**
     * Benchmark Time Completed (ms timestamp)
     * @type {number}
     */
    this.benchmarkCompleted = 0;

    /**
     * Module Dependencies
     * Those are
     * @type {Array}
     */
    this.dependencies = [];

    /**
     * plastic.js ElementAttibutes Object (Instance)
     *
     * @type {plastic.ElementAttributes}
     */
    this.attributes = new plastic.ElementAttributes(this);

    /**
     * Link to calculated Attributes Object
     *
     * If you need easy access to the current Attributes Object, use this.
     *
     * @type {{}}
     */
    this.attr = this.attributes.attr;

    /**
     * Element Query Module Instance
     *
     * @type {Object|boolean}
     */
    this.queryModule = false;

    /**
     * Element Data Module Instance
     *
     * @type {Object|boolean}
     */
    this.dataModule = false;

    /**
     * Element Display Module Instance
     *
     * @type {Object|boolean}
     */
    this.displayModule = false;

    /**
     *
     */
    this.schema = plastic.ElementSchema(this);


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    this.mergeOptions();


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
        return this.$el;
    },

    /**
     * Get DOM Element within PlasticElement Container
     * @param el
     */
    setEl:function(el) {
        this.$el = el;
    },

    /**
     * Get plastic.js Element Attributes Object
     *
     * @returns {Object}
     */
    getAttr:function() {
        return this.attr;
    },

    /**
     * Creates a new Attributes Object which parses and stores all Attributes of the plastic.js element
     */
    parseAttributes: function() {
        "use strict";
        this.attributes = new plastic.ElementAttributes(this.$el);
        this.attr = this.attributes.attr;
    },

    /**
     * Executes the processing of the plastic.element
     * This starts
     *
     * @todo Introduce Error State: Stop further Processing if there are Exceptions
     */
    execute: function() {

        /** Asynchronous Mode */
        var self = this;

        this.createMsgContainer(this.$el);
        this.createDisplayContainer(this.$el);


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

            this.eventsTotal += 1;

            if (this.options.debug) {
                console.log('[#' + this.id + '] Data-URL: ' + this.attr.data.url);
            }

            // TODO: Catch Timeout Error

            /** jQuery AJAX Request Object */
            var request = $.ajax({
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

                    self.benchmarkDataLoaded = (new Date()).getTime();
                    self.attr.raw = data;
                    self.updateProgress();

                    self.events.pub('data-sucess');
                },
                error: function() {
                    plastic.msg('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.$el );
                    self.cancelProgress();
                }
            });

        }


        //////////////////////////////////////////
        // LOAD ALL EXTERNAL DEPENDENCIES       //
        //////////////////////////////////////////

        var depLoaded = function() {
            "use strict";
            self.benchmarkModulesLoaded.push((new Date()).getTime());
            this.updateProgress();
        };

        for (var i = 0; i < this.dependencies.length; i++) {

           this.eventsTotal += 1;

            plastic.events.sub('loaded-' + this.dependencies[i], self, depLoaded);
        }


    },

    /**
     * Helper Functin which creates a HTML Element for use as a Message Container
     */
    createMsgContainer: function() {
        "use strict";

        this.$el.css('position', 'relative');

        this.$el.append('<div class="plastic-js-msg"></div>');
        var msgEl = this.$el.find('.plastic-js-msg');
        msgEl
            .width(this.$el.width())
        ;
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Display Container
     */
    createDisplayContainer: function() {
        "use strict";

        this.$el.append('<div class="plastic-js-display"></div>');
        var displayEl = this.$el.find('.plastic-js-display');
        displayEl
            .height(this.$el.height())
            .width(this.$el.width())
        ;
    },

    updateProgress: function() {
        "use strict";

        this.eventsProgress += 1;

        if (this.options.debug) {
            console.log('[#' + this.id + '] Current Progress: ' + this.eventsProgress + '/' + this.eventsTotal);
        }


        if (this.eventsProgress === this.eventsTotal) {

            this.callDataParser();
            this.callDisplayModule();

            if (this.options.benchmark) {
                this.displayBenchmark();
            }

        }
    },

    /**
     * Cancels the processing of the element and displays the info to the user
     * @todo Unsubscribe all remaining events?
     */
    cancelProgress: function() {
        "use strict";
        plastic.msg('plastic.js processing aborted.', 'error', this.$el);
    },

    /**
     * Dumps benchmark data to the console
     */
    displayBenchmark: function() {
        "use strict";

        var dataLoadedDiff = this.benchmarkDataLoaded - this.benchmarkStart;
        var totalDiff = this.benchmarkCompleted - this.benchmarkStart;

        var msg = '[#' + this.id + '] BENCHMARK:';

        msg += (' DATA: ' + dataLoadedDiff + 'ms');

        for (var i = 0; i < this.benchmarkModulesLoaded.length; i++) {
            var moduleTime = this.benchmarkModulesLoaded[i];
            var moduleDiff = moduleTime - this.benchmarkStart;
            msg += ' | MODULE-' + (i + 1) + ': ' + moduleDiff + 'ms';
        }

        msg += '] | TOTAL: ' + totalDiff + 'ms';
        console.log(msg);

    },



    /**
     * Helper Function to call the Query Parser Module
     */
    callQueryParser: function() {

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('query',[this.attr.query.type]);
        var Module = plastic.modules.query[moduleInfo.className];

        if (Module) {
            this.queryModule = new Module(this.attr.query);
            this.validateModule(this.queryModule, this.attr.query);
            this.attr.data = this.queryModule.execute();

        } else {
            plastic.msg('Query Parser Module ' + this.attr.query.type + ' not found.', 'error', this.$el);
        }

    },

    /**
     * Helper Function to call the Data Parser Module
     */
    callDataParser: function() {

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('data', [this.attr.data.parser]);
        var Module = plastic.modules.data[moduleInfo.className];

        if (Module) {
            this.dataModule = new Module(this.attr.data);
            this.validateModule(this.dataModule, this.attr.data.raw);
            this.attr.data = this.dataModule.execute();

        } else {
            plastic.msg('Data Parser Module ' + this.attr.data.parser + ' not found.', 'error', this.$el);
        }

    },

    /**
     * Helper Function to call the Display Module
     */
    callDisplayModule: function() {

        var self = this;

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('display',[this.attr.options.display.module]);
        var Module = plastic.modules.display[moduleInfo.className];

        if (Module) {

            self.displayModule = new Module(self.$el, self.attr);
            self.validateModule(self.displayModule, self.attr.options.display);
            self.displayModule.execute();

            self.benchmarkCompleted = (new Date()).getTime();

        } else {
            plastic.msg('Display Module ' + this.attr.data.parser + ' not found.', 'error', this.$el);
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
     */
    validateModule: function(module) {

        var env = jjv();

        var validateSchema = function(schemaName, data) {

            if (module[schemaName]) {
                env.addSchema(schemaName, module[schemaName]);
                var errors = env.validate(schemaName, data);

                // validation was successful
                if (errors) {
                    console.dir(errors);
                    throw new Error( schemaName + ' Structure invalid!');
                }
            }

        };

        if (module.validate) {
            var validationErrors = module.validate();

            // validation was successful
            if (validationErrors) {
                console.dir(validationErrors);
                throw new Error('Validation Error!');
            }
        }

        if (this.attr.data && this.attr.data.raw) {
            validateSchema('rawDataSchema', this.attr.data.raw);
        }

        if (this.attr.data && this.attr.data.processed) {
            validateSchema('processedDataSchema', this.attr.data.processed);
        }

        if (this.attr.options && this.attr.options.display && this.attr.options.display.options) {
            validateSchema('displayOptionsSchema', this.attr.options.display.options);
        }


    },

    mergeOptions: function() {
        "use strict";
        this.options = $.extend(true, {}, plastic.options, this.attr.options.general);
    }

};
