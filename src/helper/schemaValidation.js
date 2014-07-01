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

    var valid = tv4.validate(data, schema);

    if (valid) {
        return false;
    } else {

        if (errorMessage && tv4.error.message) {
            errorMessage += ' ' + tv4.error.message;

            if (tv4.error.dataPath) {
                errorMessage += ' @' + tv4.error.dataPath;
            }
        }

        var error = new Error('Validation Error');
        error.name = 'Validation Error';
        error.message = errorMessage || tv4.error.message;
        error.schemaValidation = tv4.error;
        error.stack = (new Error()).stack;

        throw error;
    }


};
