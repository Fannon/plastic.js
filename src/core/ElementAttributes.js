/**
 * Plastic ElementAttributes Prototype
 *
 * Creates a new ElementAttributes Object which stores all the Informations from the plastic.js element markup
 *
 * @example
 * this.attr = new plastic.ElementAttributes(el);
 *
 * @todo Refactoring: Direct access to parent (plasticElement) attributes where it makes sense
 *
 * @constructor
 */
plastic.ElementAttributes = function(pEl) {


    this.pEl = pEl;

    /**
     * plastic.js DOM Element
     *
     * @type {{}}
     */
    this.$el = pEl.$el;

    /**
     * plastic.js Element Attributes
     *
     * @type {Object}
     */
    this.attr = {};

    /**
     * Element Style Attributes
     * @type {Object|boolean}
     */
    this.style = false;

    /**
     * Element Options Attributes
     * @type {Object|boolean}
     */
    this.options = false;

    /**
     * Element Query Attributes
     * @type {Object|boolean}
     */
    this.query = false;

    /**
     * Element Data Attributes
     * @type {Object|boolean}
     */
    this.data = false;

    // Parse all Attributes of the current plastic.element
    this.parse();

    // Validate the final Attributes Object
    this.validate();

};

plastic.ElementAttributes.prototype = {

    /**
     * JSON Schema for validation
     *
     * @link http://json-schema.org/|JSON-Schema Site
     * @type {{}}
     */
    attrObjSchema: {
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
                        required: ["module", "options"]
                    }
                },
                "required": ["general", "display"]
            },
            "query": {
                "type": ["object", "boolean"],
                "properties": {
                    "text": {"type": "string"},
                    "module": {"type": "string"},
                    "url": {"type": "string"}
                },
                "required": ["module", "text", "url"]
            },
            "data": {
                "type": ["object", "boolean"],
                "properties": {
                    "module": {"type": "string"},
                    "raw": {"type": ["object", "array", "string"]},
                    "processed": {"type": "array"},
                    "processedHtml": {"type": "array"},
                    "url": {"type": "string"},
                    "description": {"type": "object"} // TODO: Define Description SCHEMA
                },
                // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                "required": ["module"] }
        },
        "required": ["style", "options"]
    },


    /**
     * Returns a compact, current Attribute Object
     * Removes all main-attributes which are flagged with false
     *
     * @returns {Object}
     */
    getAttrObj: function() {
        "use strict";

        var attrObj = {
            "style": this.style,
            "options": this.options
        };

        if (this.data) {
            attrObj.data = this.data;
        }

        if (this.query) {
            attrObj.query = this.query;
        }

        return attrObj;
    },

    /**
     * Parses all Attributes of the plastic.js element
     *
     * @returns {Object}
     */
    parse: function() {
        "use strict";

        this.getStyle();
        this.getOptions();
        this.getQuery();
        this.getData();
        this.getDataDescription();

        if (this.pEl.options.debug) {
            console.log(this.getAttrObj());
        }

    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     */
    getStyle: function() {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        this.style = {};

        this.style.height = this.$el.height();
        this.style.width = this.$el.width();
    },

    /**
     * Gets all Option Attributes
     */
    getOptions: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = this.$el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);

                    // SUCCESS
                    this.displayModule = options.display.module;
                    this.options = options;

                } catch(e) {
                    console.dir(e);
                    plastic.msg('Invalid JSON in the Options Object!');
                    throw new Error(e);
                }

            } else {
                plastic.msg('Empty Obptions Element!', 'error', this.$el);
                throw new Error('Empty Obptions Element!');
            }

        } else {
            plastic.msg('No options provided!', 'error', this.$el);
            throw new Error('No options provided!');
        }
    },

    /**
     * Gets all Query Attributes and stores them into this.query
     */
    getQuery: function() {
        "use strict";
        var queryElement = this.$el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            var query = {};

            query.url = queryElement.attr('data-query-url');
            query.module = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                query.text = queryString;

                // SUCCESS
                this.queryModule = query.module;
                this.query = query;

            } else {
                plastic.msg('Empty Query Element!', 'error', this.$el);
                throw new Error('Empty Query Element!');
            }

        }
    },

    /**
     * Gets all Schema Attributes
     */
    getDataDescription: function() {
        "use strict";
        // Get Data-URL
        var schemaElement = this.$el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                this.data.description =  $.parseJSON(schemaString);
            } else {
                plastic.msg('Data Description Element provided, but empty!', 'error', this.$el);
            }

        }
    },

    /**
     * Gets all Data Attributes
     */
    getData: function() {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = this.$el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.module = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {


                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.msg('Empty Data Element!', 'error', this.$el);
                }
            }

            // SUCCESS
//            this.dataModule =
            this.data = data;

        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";

        var env = jjv();
        env.addSchema('schema', this.attrObjSchema);
        var errors = env.validate('schema', this.getAttrObj());

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('Data Structure invalid!');
        }

    }

};
