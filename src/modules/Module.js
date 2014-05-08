/**
 * This is a plastic Module Wrapper
 *
 * This Class instanciates the specific Module and provides a thin wrapper around it (facade pattern)
 * It handles common module tasks like validation
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
     * @type {{}}
     */
    this.module = undefined;

    /**
     * Module Infos (like className, Dependencies, etc.)
     * @type {{}}
     */
    this.info = plastic.modules.registry.get(type, name);

    if (!this.info)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    var Module = plastic.modules[type][this.info.className];

    if (!Module)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    // Specific case handling for each module-type
    if (type === 'display') {

        this.module = new Module(pEl.$el, pEl.attr);
        this.validate();
        this.execute();

    } else if (type === 'data') {

        this.module = new Module(pEl.attr.data);
        this.validate();
        pEl.attr.data = this.execute();

    } else if (type === 'query') {

        this.module = new Module(pEl.attr.query);
        this.validate();
        pEl.attr.data = this.execute();

    } else {
        throw new Error('Invalid Module Type!');
    }


};

plastic.modules.Module.prototype = {

    execute: function() {
        "use strict";
        return this.module.execute();
    },

    validate: function() {
        "use strict";

        if (this.module.validate) {
            var validationErrors = this.module.validate();

            // validation was successful
            if (validationErrors) {
                console.dir(validationErrors);
                throw new Error('Validation Error!');
            }
        }

        if (this.module.rawDataSchema && this.pEl.attr.data && this.pEl.attr.data.raw) {
            this.validateModuleSchema('rawDataSchema', this.pEl.attr.data.raw);
        }

        if (this.module.processedDataSchema && this.pEl.attr.data && this.pEl.attr.data.processed) {
            this.validateModuleSchema('processedDataSchema', this.pEl.attr.data.processed);
        }

        if (this.module.displayOptionsSchema && this.pEl.attr.options && this.pEl.attr.options.display && this.pEl.attr.options.display.options) {
            this.validateModuleSchema('displayOptionsSchema', this.pEl.attr.options.display.options);
        }


    },

    update: function() {
        "use strict";
        this.module.update();
    },

    validateModuleSchema: function(schemaName, data) {

        var env = jjv();
        var schema = this.module[schemaName];

        env.addSchema(schemaName, data);
        var errors = env.validate(schema, data);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error(schemaName + ' Schema Structure invalid!');
        }
    }

};
