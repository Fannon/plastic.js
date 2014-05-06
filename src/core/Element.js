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

    // If given an selector String, use jQuery to get the element
    if (typeof el === 'string' || el instanceof String) {
        el = $(el);
    }


    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * DOM Element
     *
     * @type {{}}
     */
    this.$el = el;

    /**
     * HTML ID if available
     */
    this.id = el[0].id;

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

    if (this.options.debug) {
        console.log('[#' + this.id + '] new plastic.Element()');
    }


    /**
     * plastic.js ElementAttibutes Object (Instance)
     *
     * @type {plastic.ElementAttributes}
     */
    this.attributes = new plastic.ElementAttributes(this);

    /**
     * Link to Attributes Object
     *
     * If you need easy access to the current Attributes Object, use this.
     *
     * @type {{}}
     */
    this.attr = this.attributes.attr;


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////


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
                    self.events.pub('data-sucess');
                },
                error: function() {
                    plastic.msg('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.$el );
                },
                complete: function(data) {
                    self.benchmarkDataLoaded = (new Date()).getTime();
                    self.attr.raw = data;
                    self.updateProgress();
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

        for (var i = 0; i < this.attributes.dependencies.length; i++) {

           this.eventsTotal += 1;

            plastic.events.sub('loaded-' + this.attributes.dependencies[i], self, depLoaded);
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

            if (this.options.debug) {
                this.displayBenchmark();
            }

        }
    },

    /**
     * Dumps benchmark data to the console
     */
    displayBenchmark: function() {
        "use strict";

        var dataLoadedDiff = this.benchmarkDataLoaded - this.benchmarkStart;
        var totalDiff = this.benchmarkCompleted - this.benchmarkStart;

        console.log('[#' + this.id + '] BENCHMARK-DATA:         ' + dataLoadedDiff + 'ms');

        for (var i = 0; i < this.benchmarkModulesLoaded.length; i++) {
            var moduleTime = this.benchmarkModulesLoaded[i];
            var moduleDiff = moduleTime - this.benchmarkStart;
            console.log('[#' + this.id + '] BENCHMARK-MODULE #' + (i + 1) + ':    ' + moduleDiff + 'ms');
        }

        console.log('[#' + this.id + '] BENCHMARK-TOTAL:        ' + totalDiff + 'ms');

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
