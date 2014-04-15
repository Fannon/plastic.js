/**
 * Created by Fannon on 11.04.2014.
 */
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
plastic.helper.log = function (type, msg) {
    // TODO
    console.log(type + ' :: ' + msg);
};
