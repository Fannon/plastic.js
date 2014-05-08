/**
 * Schema Parser Helper Function
 *
 * @constructor
 */
plastic.ElementValidator = function(pEl) {
    "use strict";

    /**
     * plastic.js Element Object
     */
    this.pEl = pEl;

    /**
     * Description Schema
     *
     * @link http://json-schema.org/|JSON-Schema Site
     * @type {{}}
     */
    this.descriptionSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {}
    };

    /**
     * JSON Schema for Attributes validation
     *
     * @link http://json-schema.org/|JSON-Schema Site
     * @type {{}}
     */
    this.attributesSchema = {
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
            "data": {
                "type": "object",
                "properties": {
                    "parser": {"type": "string"},
                    "raw": {"type": ["object", "array", "string"]},
                    "processed": {"type": "array"},
                    "url": {"type": "string"},
                    "description": {"type": "object"} // TODO: Define Description SCHEMA
                },
                // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                "required": ["parser"] }
        },
        "required": ["style", "options"]
    };

};

plastic.ElementSchema.prototype = {

    /**
     * Validates the parsed ElementAttributes Data
     *
     * @returns {Object|boolean}
     */
    validateAttributes: function() {
        "use strict";

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

    validateElement: function() {
        "use strict";

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

        if (module.validate) {
            var validationErrors = module.validate();

            // validation was successful
            if (validationErrors) {
                console.dir(validationErrors);
                throw new Error('Validation Error!');
            }
        }

        if (this.attr.data && this.attr.data.raw) {
            this.validateSchema('rawDataSchema', this.attr.data.raw);
        }

        if (this.attr.data && this.attr.data.processed) {
            this.validateSchema('processedDataSchema', this.attr.data.processed);
        }

        if (this.attr.options && this.attr.options.display && this.attr.options.display.options) {
            this.validateSchema('displayOptionsSchema', this.attr.options.display.options);
        }


    },

    validateSchema: function(schema, schemaName, data) {
        "use strict";
        var env = jjv();

        env.addSchema(schemaName, data);
        var errors = env.validate(schema, data);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error(schemaName + ' Schema Structure invalid!');
        }
    }
};
