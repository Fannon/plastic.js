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
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js Element Attributes
     * @type {Object}
     */
    this.attr = this.parseAttr(el);

    // Validate the final Attributes Object
    this.validate(this.attr);
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
     * @param {Object} [el]     Plastic.js DOM Element
     * @returns {Object}
     */
    parseAttr: function(el) {
        "use strict";

        console.info('plastic.getElementAttributes();');

        /**
         * ElementAttributes Object.
         * This contains all information that is read from the plastic HTML element
         */
        var elAttr = {};

        elAttr.style = this.getStyle(el);

        elAttr.options = this.getOptions(el);

        var queryAttr = this.getQuery(el);
        if (queryAttr) {
            elAttr.query = queryAttr;
        }

        var schemaAttr = this.getSchema(el);
        if (schemaAttr) {
            elAttr.schema = schemaAttr;
        }

        var dataAttr = this.getData(el);
        if (dataAttr) {
            elAttr.data = dataAttr;
        }

        console.log(elAttr);
        return elAttr;
    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getStyle: function(el) {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        var style = {};

        style.height = el.height();
        style.width = el.width();

        return style;
    },

    /**
     * Gets all Option Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getOptions: function(el) {
        "use strict";
        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);
                    return options;

                } catch(e) {
                    plastic.helper.msg('Invalid JSON in the Options Object!');
                    return false;
                }

            } else {
                plastic.helper.msg('Empty Obptions Element!', 'error', el);
                return false;
            }

        } else {
            plastic.helper.msg('No options provided!', 'error', el);
            return false;
        }
    },

    /**
     * Gets all Query Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getQuery: function(el) {
        "use strict";
        var queryElement = el.find(".plastic-query");

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
                plastic.helper.msg('Empty Query Element!', 'error', el);
                return false;
            }

        }
    },

    /**
     * Gets all Schema Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getSchema: function(el) {
        "use strict";
        // Get Data-URL
        var schemaElement = el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            /** Element Schema Data */
            var schema = {};

            schema.type = schemaElement.attr('data-schema-format');

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                schema.text = $.parseJSON(schemaString);
                return schema;
            } else {
                plastic.helper.msg('Empty Schema Element!', 'error', el);
                return false;
            }

        }
    },

    /**
     * Gets all Data Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getData: function(el) {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.parser = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {
                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.helper.msg('Empty Data Element!', 'error', el);
                }
            }

            return data;

        } else {
            return false;
        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     * @param {{}} attr ElementAttributes
     * @returns {Object|boolean}
     */
    validate: function(attr) {
        "use strict";

        /**
         * JSON Schema for validation
         *
         * @url http://json-schema.org/
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
        var errors = env.validate('schema', attr);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('Data Structure invalid!');
        } else {
            return true;
        }
    }


};
