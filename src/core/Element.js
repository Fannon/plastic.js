/**
 * Plastic Element Prototype
 *
 * This creates a new plastic.js element and executes all processes needed to get the final result
 *
 * @example
 * plastic.elements[i] = new plastic.Element(el);
 *
 * @param {Object} $el jQuery DOM Element
 *
 * @constructor
 */
plastic.Element = function($el) {

    // Create a Message container
    this.createMessageContainer($el);

    /**
     * Current plastic Element (pEl)
     *
     * @type {plastic.Element}
     */
    var self = this;

    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * This plastic elements jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = $el;

    /**
     * HTML ID if available, otherwise auto generated ID
     * @type {String}
     */
    this.id = undefined;

    // Get / Calculate ID
    if ($el && $el[0] && $el[0].id) {
        this.id = $el[0].id;
    } else {
        this.id = 'plastic-el-' + plastic.elements.length + 1;
        $el[0].id = this.id;
    }

    /**
     * Inherited (and overwritten) general element options
     *
     * @type {Object|plastic.options}
     */
    this.options = plastic.options;

    if (this.options.debug) {
        plastic.msg.log('[#' + this.id + '] new plastic.Element()');
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
    this.eventsTotal = 1;

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


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    // Merge general options from ElementsAttributes
    this.mergeOptions();

    // Register all necessary dependencies
    this.registerDependencies();


    //////////////////////////////////////////
    // REGISTER EVENTS LSITENERS            //
    //////////////////////////////////////////

    /** Helper Function: On dependency load */
    var depLoaded = function() {
        "use strict";
        self.benchmarkModulesLoaded.push((new Date()).getTime());
        this.updateProgress();
    };

    for (var i = 0; i < this.dependencies.length; i++) {
        this.eventsTotal += 1;
        plastic.events.sub('loaded-' + this.dependencies[i], self, depLoaded);
    }


};

//////////////////////////////////////////
// Element Methods                      //
//////////////////////////////////////////

plastic.Element.prototype = {

    /**
     * Executes the processing of the plastic.element
     */
    execute: function() {

        /** Asynchronous Mode */
        var self = this;

        this.createDisplayContainer(this.$el);

        if (plastic.options.showInfoBox) {
            this.createInfoContainer(this.$el);
        }


        //////////////////////////////////////////
        // CALLING QUERY MODULE                 //
        //////////////////////////////////////////

        if (this.attr.query) { // OPTIONAL
            this.queryModule = new plastic.modules.Module(this, 'query', this.attr.query.module);
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (this.attr.data && this.attr.data.url) {

            if (this.options.debug) {
                plastic.msg.log('[#' + this.id + '] Data-URL: ' + this.attr.data.url);
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
                        plastic.msg.error('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.$el );
                        self.cancelProgress();
                    }
                });
            } catch(e) {
                plastic.msg.error(e, self.$el);
                throw new Error('Data Request failed');
            }

        } else {
            // Data is already there, continue:
            self.updateProgress();
        }

    },

    /**
     * Creates a new Attributes Object which parses and stores all Attributes of the plastic.js element
     */
    updateAttributes: function() {
        "use strict";
        this.attributes = new plastic.ElementAttributes(this.$el);
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Message Container
     * @todo $el.find unnecessary?
     */
    createMessageContainer: function($el) {
        "use strict";

        $el.append('<div class="plastic-js-messages"></div>');
        var msgEl = $el.find('.plastic-js-messages');
        msgEl.width($el.innerWidth());
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Display Container
     * @todo $el.find unnecessary?
     */
    createDisplayContainer: function($el) {
        "use strict";

        $el.append('<div class="plastic-js-display"></div>');
        var displayEl = $el.find('.plastic-js-display');

        if ($el.height() > 0) {
            displayEl.height($el.height());
        } else {
            displayEl.height('auto');
        }

        displayEl.html('<div class="loading"></div><div class="spinner"></div></div>');

    },

    /**
     * Helper Functin which creates a HTML Element for use as InfoBox
     */
    createInfoContainer: function($el) {
        "use strict";
        $el.append('<div class="plastic-js-info"></div>');
        $el.css('margin-bottom', '42px'); // TODO: Make this dynamic
    },

    /**
     * Updates the Progress of asynchronal events
     */
    updateProgress: function() {
        "use strict";

        this.eventsProgress += 1;

        if (this.options.debug) {
            plastic.msg.log('[#' + this.id + '] Current Progress: ' + this.eventsProgress + '/' + this.eventsTotal);
        }

        // If all events are run (dependencies loaded): continue with processing of the element
        if (this.eventsProgress === this.eventsTotal) {
            this.completeProgress();
        }
    },

    /**
     * Cancels the processing of the element and displays the info to the user
     */
    cancelProgress: function() {
        "use strict";
        plastic.msg.error('plastic.js processing aborted.', this.$el);
        // Clear all Element Events
        this.events = new plastic.helper.Events();
    },

    /**
     * This executes all remaining actions after all events are completed
     */
    completeProgress: function() {
        "use strict";

        // Instanciate new Data Module
        this.dataModule = new plastic.modules.Module(this, 'data', this.attr.data.module);

        if (!this.attr.data.description) {
            this.attr.data.description = plastic.helper.duckTyping(this.attr.data.processed);
        }

        // Apply Data Description if available
        this.applySchema();

        // Instanciate new Display Module (renders the output)
        this.displayModule = new plastic.modules.Module(this, 'display', this.attr.display.module);

        this.benchmarkCompleted = (new Date()).getTime();

        if (this.options.benchmark) {
            this.displayBenchmark();
        }

        if (this.options.showInfoBox) {
            this.displayInfoBox();
        }
    },

    /**
     * Looks for all external dependencies that are required by the currently used modules
     *
     * Registers all Dependencys for Lazyloading
     * @todo Use a Set Datastructure?
     */
    registerDependencies: function() {
        "use strict";

        var displayModuleInfo = plastic.modules.moduleManager.get('display', this.attr.display.module);

        if (displayModuleInfo) {
            if (displayModuleInfo.dependencies) {
                plastic.modules.dependencyManager.add(displayModuleInfo.dependencies);
            } else {
                plastic.msg.warn('No Dependencies set!', this.$el);
            }

        } else {
            plastic.msg.error('Display Module not found!', this.$el);
        }

        if (this.attr.data && this.attr.data.module) {
            var dataModuleInfo = plastic.modules.moduleManager.get('data', this.attr.data.module);
            plastic.modules.dependencyManager.add(dataModuleInfo.dependencies);
        }

        this.dependencies = (this.dependencies.concat(displayModuleInfo.dependencies));
    },

    /**
     * Merges the current plastic element options with the general options.
     * Local settings overwrite global settings
     * Makes a deep copy
     */
    mergeOptions: function() {
        "use strict";
        this.options = $.extend(true, {}, plastic.options, this.attr.options);
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
            msg += ' | DEPENDENCY ' + (i + 1) + ': ' + moduleDiff + 'ms';
        }

        msg += ' | TOTAL: ' + totalDiff + 'ms';
        plastic.msg.log(msg);
    },

    /**
     * Fills the Infobox with informations about the current plastic element, for example loading time.
     */
    displayInfoBox: function() {
        "use strict";
        var infoBox = this.$el.find('.plastic-js-info');
        var html = 'Data : ' + (this.benchmarkDataLoaded - this.benchmarkStart) + 'ms | ';
        html += 'Total: ' + (this.benchmarkCompleted - this.benchmarkStart) + 'ms';
        infoBox.html(html);
    },

    /**
     * Applies Data Description to generate "annotated / enriched" processed data
     */
    applySchema: function() {
        "use strict";

        var self = this;
        var processedData = this.attr.data.processed;
        var dataDescription = this.attr.data.description;

        var applyHtml = function() {

            /**
             * Maps DataTypes (Formats) to a converter function, which returns the HTML reprentation of the type
             * @todo Create more Formats
             * @todo Create Phone Number
             *
             * @type {{}}
             */
            var htmlMapper = {
                "email": function(val) {
                    var strippedVal = val.replace('mailto:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "phone": function(val) {
                    var strippedVal = val.replace('tel:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "uri": function(val) {
                    // Strips http:// or ftp:// etc.
                    var strippedVal = val.replace(/\w*:\/{2}/g, ''); //
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                }
            };

            var processedHtml = $.extend(true, [], processedData); // Deep Copy

            for (var i = 0; i < processedHtml.length; i++) {

                var row = processedHtml[i];

                for (var cellType in row) {

                    var cellValue = row[cellType];

                    if (dataDescription[cellType] && dataDescription[cellType].format) {
                        var format = dataDescription[cellType].format;

                        for (var j = 0; j < cellValue.length; j++) {

                            if (format && htmlMapper[format]) {
                                cellValue[j] = htmlMapper[format](cellValue[j]);
                            }
                        }
                    }

                }

            }

            self.attr.data.processedHtml = processedHtml;
        };

        if (dataDescription && Object.keys(dataDescription).length > 0) {
            applyHtml();
        }

    }

};
