/**
 * Plastic ElementAttributes Prototype
 *
 * Creates a new ElementAttributes Object which stores all the Informations from the plastic.js element markup
 *
 * @example
 * this.attr = new plastic.ElementAttributes(el);
 *
 * @constructor
 */
plastic.ElementAttributes = function(el) {

    /**
     * plastic.js DOM Element
     *
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js Element Attributes
     *
     * @type {Object}
     */
    this.attr = {};

    /**
     * Array of element specific (collected) dependencies
     *
     * @type {Array}
     */
    this.dependencies = [];

    // Parse all Attributes of the current plastic.element
    this.parse();

    // Validate the final Attributes Object
    this.validate();

    // Register all necessary dependencies
    this.registerDependencies();

};

plastic.ElementAttributes.prototype = {

    /**
     * Gets current Attribute Object
     *
     * @returns {Object}
     */
    getAttr: function() {
        "use strict";
        return this.attr;
    },

    /**
     * Parses all Attributes of the plastic.js element
     *
     * @returns {Object}
     */
    parse: function() {
        "use strict";

        console.info('plastic.getElementAttributes();');

        this.attr.style = this.getStyle();

        this.attr.options = this.getOptions();

        var queryAttr = this.getQuery();
        if (queryAttr) {
            this.attr.query = queryAttr;
        }

        var schemaAttr = this.getSchema();
        if (schemaAttr) {
            this.attr.schema = schemaAttr;
        }

        var dataAttr = this.getData();
        if (dataAttr) {
            this.attr.data = dataAttr;
        }

        console.log(this.attr);
    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     *
     * @returns {Object|boolean}
     */
    getStyle: function() {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        var style = {};

        style.height = this.el.height();
        style.width = this.el.width();

        return style;
    },

    /**
     * Gets all Option Attributes
     *
     * @returns {Object|boolean}
     */
    getOptions: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = this.el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);
                    return options;

                } catch(e) {
                    console.dir(e);
                    plastic.msg('Invalid JSON in the Options Object!');
                    throw new Error(e);
                }

            } else {
                plastic.msg('Empty Obptions Element!', 'error', this.el);
                throw new Error('Empty Obptions Element!');
            }

        } else {
            plastic.msg('No options provided!', 'error', this.el);
            throw new Error('No options provided!');
        }
    },

    /**
     * Gets all Query Attributes
     *
     * @returns {Object|boolean}
     */
    getQuery: function() {
        "use strict";
        var queryElement = this.el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            var query = {};

            query.url = queryElement.attr('data-query-url');
            query.type = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                query.text = queryString;
                return query;
            } else {
                plastic.msg('Empty Query Element!', 'error', this.el);
                throw new Error('Empty Query Element!');
            }

        }

        return false;
    },

    /**
     * Gets all Schema Attributes
     *
     * @returns {Object|boolean}
     */
    getSchema: function() {
        "use strict";
        // Get Data-URL
        var schemaElement = this.el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            /** Element Schema Data */
            var schema = {};

            schema.type = schemaElement.attr('data-schema-format');

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                schema.text = $.parseJSON(schemaString);
                return schema;
            } else {
                plastic.msg('Empty Schema Element!', 'error', this.el);
                return false;
            }

        }
    },

    /**
     * Gets all Data Attributes
     *
     * @returns {Object|boolean}
     */
    getData: function() {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = this.el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.parser = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {
                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.msg('Empty Data Element!', 'error', this.el);
                }
            }

            return data;

        } else {
            return false;
        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";

        /**
         * JSON Schema for validation
         *
         * @link http://json-schema.org/|JSON-Schema Site
         * @type {{}}
         */
        var schema = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",

            "properties": {
                "style": {
                    "type": "object",
                    "properties": {
                        "width": {
                            "type": "number"
                        },
                        "height": {
                            "type": "number"
                        }
                    }
                },
                "options": {
                    "type": "object",
                    "properties": {
                        "general": {
                            type: "object"
                        },
                        "display": {
                            "type": "object",
                            "properties": {
                                "module": {"type": "string"},
                                "options": {"type": "object"}
                            },
                            required: ['module', "options"]
                        }
                    },
                    "required": ["general", "display"]
                },
                "query": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string"},
                        "type": {"type": "string"},
                        "url": {"type": "string"}
                    },
                    "required": ["text", "type", "url"]
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string"}
                    },
                    "required": ["text"]
                },
                "data": {
                    "type": "object",
                    "properties": {
                        "parser": {"type": "string"},
                        "raw": {"type": ["object", "array", "string"]},
                        "processed": {"type": "array"},
                        "url": {"type": "string"}
                    },
                    // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                    "required": ["parser"] }
            },
            "required": ["style", "options"]
        };

        var env = jjv();
        env.addSchema('schema', schema);
        var errors = env.validate('schema', this.attr);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('Data Structure invalid!');
        } else {
            return true;
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
        var moduleInfo = plastic.modules.registry.get('display',[this.attr.options.display.module]);
        plastic.modules.dependencies.add(moduleInfo.dependencies);
        this.dependencies = (this.dependencies.concat(moduleInfo.dependencies));
    }

};
