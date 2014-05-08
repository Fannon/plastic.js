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
    this.attr = new plastic.ElementAttributes(this);

    /**
     * Element Query Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.queryModule = false;

    /**
     * Element Data Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.dataModule = false;

    /**
     * Element Display Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.displayModule = false;

    /**
     * Element Schema
     */
    this.schema = plastic.ElementSchema(this);


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    // Merge general options from ElementsAttributes
    this.mergeOptions();

    // Register all necessary dependencies
    this.registerDependencies();


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
            this.queryModule = new plastic.modules.Module(this, 'query', this.attr.query.module);
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
            try {
                $.ajax({
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
            } catch(e) {
                console.error(e);
                throw new Error('Data Request failed');
            }


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

    /**
     * Updates the Progress of asynchronal events
     */
    updateProgress: function() {
        "use strict";

        this.eventsProgress += 1;

        if (this.options.debug) {
            console.log('[#' + this.id + '] Current Progress: ' + this.eventsProgress + '/' + this.eventsTotal);
        }


        // If all events are run (dependencies loaded): continue with processing of the element
        if (this.eventsProgress === this.eventsTotal) {

            this.dataModule = new plastic.modules.Module(this, 'data', this.attr.data.module);
            this.displayModule = new plastic.modules.Module(this, 'display', this.attr.options.display.module);

            this.benchmarkCompleted = (new Date()).getTime();

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

        msg += ' | TOTAL: ' + totalDiff + 'ms';
        console.log(msg);

    },

    /**
     * Looks for all external dependencies that are required by the currently used modules
     *
     * Registers all Dependencys for Lazyloading
     * @todo Use a Set Datastructure?
     */
    registerDependencies: function() {
        "use strict";

        console.dir(this.attr);
        var displayModuleInfo = plastic.modules.registry.get('display', this.attr.options.display.module);
        plastic.modules.dependencies.add(displayModuleInfo.dependencies);

        if (this.attr.data && this.attr.data.module) {
            var dataModuleInfo = plastic.modules.registry.get('data', this.attr.data.module);
            plastic.modules.dependencies.add(dataModuleInfo.dependencies);
        }

        this.dependencies = (this.dependencies.concat(displayModuleInfo.dependencies));
    },

    mergeOptions: function() {
        "use strict";
        this.options = $.extend(true, {}, plastic.options, this.attr.options.general);
    }

};
