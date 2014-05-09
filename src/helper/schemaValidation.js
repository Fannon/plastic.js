/**
 * Helper Function which acts as a facade wrapper around the Schema Validation Library
 *
 * The Validation Objects should follow the JSON-Schema Standard: (http://json-schema.org/)
 * Currently it uses jjv (https://github.com/acornejo/jjv)
 *
 * @param {Object} schema   Schema object
 * @param {Object} data     Data to validate against the schema object
 * @param {String} [errorMessage]   Optional Error Message if Validation fails
 *
 * @returns {Object|boolean}
 */
plastic.helper.schemaValidation = function(schema, data, errorMessage) {
    "use strict";

    var env = jjv();
    env.addSchema('schema', schema);
    var errors = env.validate('schema', data);

    // validation was successful
    if (errors) {

        plastic.errors.push(errors);

        if (errorMessage) {
            throw new Error(errorMessage);
        } else {
            throw new Error('Object validation failed! Fore more informations look into the development console.');
        }

    }

};