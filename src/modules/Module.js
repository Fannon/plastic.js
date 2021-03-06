/**
 * This is a plastic Module Wrapper
 *
 * This Class instanciates the specific Module (factory pattern)
 * It also provides a thin wrapper around it (facade pattern)
 * The Module Object also handles common module tasks like validation
 *
 * @param {plastic.Element} pEl     plastic.Element
 * @param {string}          type    Module Type
 * @param {string}          name    Module Name
 *
 * @constructor
 */
plastic.modules.Module = function(pEl, type, name) {

    /**
     * plastic Element
     * @type {plastic.Element}
     */
    this.pEl = pEl;

    /**
     * Module Name
     * @type {string}
     */
    this.name = name;

    /**
     * Module Type
     * @type {string}
     */
    this.type = type;

    /**
     * Specific Module Instance
     *
     * @type {Object}
     */
    this.module = undefined;

    /**
     * Module Infos (like className, Dependencies, etc.)
     * @type {Object}
     */
    this.info = plastic.modules.moduleManager.get(type, name);

    if (!this.info)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    var Module = plastic.modules[type][this.info.className];

    if (!Module)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    // Specific case handling for each module-type
    if (type === 'display') {
        var $el = $(pEl.$el.find('.plastic-js-output')[0]);
        $el.html('');
        this.module = new Module($el, pEl.attr);
        this.execute();

    } else if (type === 'data') {
        this.module = new Module(pEl.attr.data);
        this.execute();

    } else if (type === 'query') {
        this.module = new Module(pEl.attr.query);
        this.execute();

    } else {
        throw new Error('Invalid Module Type!');
    }

};

plastic.modules.Module.prototype = {

    /**
     * Executes the module and stores the return values accordingly
     *
     * Validates the data against the module before executing it
     */
    execute: function() {
        "use strict";

        if (this.type === 'display') {
            this.validate();
            this.module.execute();

        } else if (this.type === 'data') {
            this.validate();
            this.pEl.attr.data = this.module.execute();

        } else if (this.type === 'query') {
            this.validate();
            this.pEl.attr.data = this.module.execute();
        }

    },

    /**
     * General Module Validation
     *
     * This calls all available validation Schemas and Function of the module
     */
    validate: function() {
        "use strict";

        var self = this;

        // General Validation (by logic)
        if (this.module.validate) {

            var validationErrors = this.module.validate();

            // validation was successful
            if (validationErrors) {
                plastic.msg.log(validationErrors, self.pEl.$el);
                console.dir(validationErrors);
                throw new Error('Module ' + this.name + ': Validation Error!');
            }
        }

        try {
            // Schema Validation (by schema objects)
            if (this.module.rawDataSchema && this.pEl.attr.data && this.pEl.attr.data.raw) {
                plastic.helper.schemaValidation(this.module.rawDataSchema, this.pEl.attr.data.raw, 'Raw Data invalid!');
            }

            if (this.module.processedDataSchema && this.pEl.attr.data && this.pEl.attr.data.processed) {
                plastic.helper.schemaValidation(this.module.processedDataSchema, this.pEl.attr.data.processed, 'Processed Data invalid!');
            }

            if (this.module.displayOptionsSchema) {

                try {
                    plastic.helper.schemaValidation(this.module.displayOptionsSchema, this.pEl.attr.display.options, 'Display Options invalid!');
                } catch (e) {
                    plastic.msg.error(e, this.pEl);
                    return false;
                }


                // If an (optional) option is not given, inherit the default from the option schema
                for (var propName in this.module.displayOptionsSchema.properties) {

                    if (this.module.displayOptionsSchema.properties[propName]) {
                        if (!this.pEl.attr.display.options.hasOwnProperty(propName)) {
                            this.pEl.attr.display.options[propName] = this.module.displayOptionsSchema.properties[propName].default;
                        }
                    } else {
                        plastic.msg.warn('Option given that is not defined in the Option Schema');
                    }


                }
            }

        } catch (e) {
            plastic.msg.error(e, this.pEl);
            // TODO: Stop Display Processing
            // TODO: Message to the User
        }

    },

    /**
     * Calls the Module Update function (if available)
     */
    update: function() {
        "use strict";
        if (this.module.update) {
            this.module.update();
        }

    }



};
