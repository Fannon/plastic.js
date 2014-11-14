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


    /**
     * plastic.js Element
     *
     * @type {{}}
     */
    this.pEl = pEl;

    /**
     * plastic.js jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = pEl.$el;

    /**
     * Element Style Attributes
     * @type {Object}
     */
    this.style = {};

    /**
     * Element Options Attributes
     * @type {Object|boolean}
     */
    this.options = {};

    /**
     * Element Query Attributes
     * @type {Object|boolean}
     */
    this.query = false;

    /**
     * Element Display Attributes
     * @type {Object|boolean}
     */
    this.display = {};

    /**
     * Element Data Attributes
     * @type {Object|boolean}
     */
    this.data = false;

    /**
     * Element Data Description
     *
     * @type {{}}
     */
    this.description = {};


    try {

        // Parse all Attributes of the current plastic.element
        this.parse();

        // Validate the final Attributes Object
        this.validate();

    } catch (e) {
        console.log('plastic.js accident');
        console.error(e);
    }

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
            "options": {
                "type": "object"
            },
            "display": {
                "type": "object",
                "properties": {
                    "module": {"type": "string"},
                    "options": {"type": "object"}
                },
                required: ["module", "options"]
            },
            "query": {
                "type": ["object", "boolean"],
                "properties": {
                    "text": {"type": "string"},
                    "datatype": {"type": ["string", "boolean"]},
                    "url": {"type": "string"}
                },
                "required": ["datatype", "text", "url"]
            },
            "data": {
                "type": ["object", "boolean"],
                "properties": {
                    "module": {"type": ["object", "boolean"]},
                    "raw": {"type": ["object", "array", "string"]},
                    "processed": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "array"
                            }
                        }
                    },
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
            "options": this.options,
            "display": this.display
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

        // Calculate height and width
        this.style = this.getStyle();

        // If the plastic tag has a type or data-type attribute, it is assumed to use the JSON API
        if (this.$el.attr('type') || this.$el.attr('data-type')) {
            this.parseJSONAPI();

        // If not, asume the HTML API
        } else {
            this.parseHTMLAPI();
        }

        if (this.pEl.options.debug) {
            plastic.msg.dir(this.getAttrObj());
        }

    },

    /**
     * Parses a plastic.js tag that uses HTML as its API
     */
    parseHTMLAPI: function() {
        "use strict";

        this.query       = this.getDataFromTag('plastic-query', false, true);
        this.data        = this.getDataFromTag('plastic-data', false, false);
        this.description = this.getDataFromTag('plastic-description', false, false);
        this.options     = this.getDataFromTag('plastic-options', false, false) || {}; // Or empty object
        this.display     = this.getDataFromTag('plastic-display', true, false);
    },

    /**
     * Parses a plastic.js tag that uses pure JSON as API
     */
    parseJSONAPI: function() {
        "use strict";

        var jsonString = this.$el.text();
        var data = {};

        // Remove the JSON text from the element
        this.$el.text('');

        try {
            data = JSON.parse(jsonString);
        } catch (e) {
            console.error(e);
        }

        this.query               = data.query;
        this.data                = data.data;
        this.description.options = data.description;
        this.options.options     = data.options || {}; // Or empty object
        this.display.module      = data.display.module;
        this.display.options     = data.display;

        delete this.display.options.module;

    },

    /**
     * Gets width and height of the element
     * They are calculated directly from the DOM Element style
     */
    getStyle: function() {
        "use strict";
        return {
            height: this.$el.height(),
            width: this.$el.width()
        };
    },

    /**
     * Gets all Option Attributes
     */
    getDataFromTag: function(tagName, required, isPlainText) {
        "use strict";

        /** Element data */
        var data = {};

        var tag = this.$el.find('.' + tagName) || false;

        // If that tag exists
        if (tag[0]) {

            // Get the module type if available
            data.module = tag.attr('data-module') || false;
            data.datatype = tag.attr('type') || tag.attr('data-type') || false;
            data.url = tag.attr('data-url') || false;
            data.text = tag[0].text || tag[0].innerHTML || false;
            data.allAttr = {};

            $(tag[0].attributes).each(function() {
                data.allAttr[this.nodeName] = this.value;
            });

            // If tag content is JSON: Parse it and put it into options
            if (!isPlainText) {

                if (data.text && data.text !== '') {

                    try {
                        // If JSON is escaped, unescape it
                        data.options = data.text.replace(/&quot;/g, '"');
                        data.options = $.parseJSON(data.options);

                    } catch(e) {
                        console.dir(e);
                        plastic.msg.error('Invalid JSON in the Options Object!', this.$el);
                        throw new Error(e);
                    }

                } else {
                    data.options = {}; // If no options are given, return an empty object
                }
            }

            return data;

        } else {
            if (required) {
                plastic.msg.error('No Display Module set!', this.$el);
                throw new Error('No Display Module set!');
            }
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

        plastic.helper.schemaValidation(this.attrObjSchema, this.getAttrObj(), 'Element Attributes: Data Structure invalid!');

    }

};
