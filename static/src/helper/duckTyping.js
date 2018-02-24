/**
 * Simple "Duck Typing" Helper Function
 *
 * This looks at the data and interprets it for basic data types
 * Of course this may lead to inaccuracies!
 *
 * @param {Object} data   Incoming processed Data
 *
 * @returns {Object}    Data Description Object
 */
plastic.helper.duckTyping = function(data) {
    "use strict";

    var dataDescription = {};

    var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (var attrName in data[0]) {

        var attrValue = data[0][attrName][0];

        if ($.isNumeric(attrValue)) {

            dataDescription[attrName] = {
                type: "number"
            };

        } else {

            dataDescription[attrName] = {
                type: "string"
            };

            if (attrValue.indexOf("http://") > -1) {
                dataDescription[attrName].format = "url";
            } else if (emailRegexp.test(attrValue) || attrValue.indexOf("mailto:") > -1) {
                dataDescription[attrName].format = "email";
            } else if (attrValue.indexOf("tel:") > -1) {
                dataDescription[attrName].format = "phone";
            }


        }

    }

    return dataDescription;

};
