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

    this.el = el;
    this.attr = this.parseAttr(el);

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
     *
     * @param {Object} [el]     Plastic.js DOM Element
     *
     * @returns {Object}
     */
    parseAttr: function(el) {
        "use strict";

        console.info('plastic.getElementAttributes();');


        /**
         * Element Data Object.
         * This contains all information that is read from the plastic HTML element
         */
        var elAttr = {};


        elAttr.style = this.getStyle(el);




        //////////////////////////////////////////
        // GET OPTIONS DATA                     //
        //////////////////////////////////////////

        /** Element Options */
        elAttr.options = {}; // mandatory!

        var optionsObject = el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

            if (optionsString && optionsString !== '') {

                try {
                    elAttr.options = $.parseJSON(optionsString);
                } catch(e) {
                    plastic.helper.msg('Invalid JSON in the Options Object!');
                }

            } else {
                plastic.helper.msg('Empty Obptions Element!', 'error', el);
            }

        } else {
            plastic.helper.msg('No options provided!', 'error', el);
        }


        //////////////////////////////////////////
        // GET QUERY DATA                       //
        //////////////////////////////////////////

        // Get Data-URL
        var queryElement = el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            elAttr.query = {};

            elAttr.query.url = queryElement.attr('data-query-url');
            elAttr.query.type = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                elAttr.query.text = queryString;
            } else {
                plastic.helper.msg('Empty Query Element!', 'error', el);
            }

        }


        //////////////////////////////////////////
        // GET SCHEMA DATA                      //
        //////////////////////////////////////////

        // Get Data-URL
        var schemaElement = el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            /** Element Schema Data */
            elAttr.schema = {};

            elAttr.schema.type = schemaElement.attr('data-schema-format');

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                elAttr.schema.text = $.parseJSON(schemaString);
            } else {
                plastic.helper.msg('Empty Schema Element!', 'error', el);
            }

        }


        //////////////////////////////////////////
        // GET DATA DATA                        //
        //////////////////////////////////////////

        // Get Data-URL
        var dataElement = el.find(".plastic-data");

        if (dataElement.length > 0) {

            /** Element Data */
            elAttr.data = {};

            elAttr.data.url = dataElement.attr('data-url');
            elAttr.data.parser = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!elAttr.data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {
                    elAttr.data.object = $.parseJSON(dataString);
                } else {
                    plastic.helper.msg('Empty Data Element!', 'error', el);
                }

            }

        }



        //////////////////////////////////////////
        // RETURN ELEMENT DATA                  //
        //////////////////////////////////////////

        console.log(elAttr);
        return elAttr;
    },

    getStyle: function(el) {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        var style = {};
        //////////////////////////////////////////
        // GET ELEMENT STYLE                    //
        //////////////////////////////////////////

        // TODO: Case handling if size was not defined (could be 0 height)

        style.height = 12;
        style.width = 12;

        return style;
    },

    /**
     * Validates the parsed ElementAttributes Data
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";
        return true;
    }


};
