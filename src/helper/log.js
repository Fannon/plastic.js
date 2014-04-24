/* global plastic */

/**
 * Global Log Function
 * Should be used instead of console.logs
 *
 * TODO: Make this visible as an overlay of the visualisation
 * TODO: Make it closeable
 *
 * @param type      enum: info, warning, error)
 * @param msg       Log Message
 */
plastic.helper.log = function (msg, type) {
    // TODO
    if (type) {
        console.log(type + ' :: ' + msg);
    } else {
        console.log('--> ' + msg);
    }

};
