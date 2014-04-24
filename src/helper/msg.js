/**
 * Global Message Function
 * Should be used instead of console.logs
 *
 * TODO: Make this visible as an overlay in front of the visualisation
 * TODO: Make it closeable
 *
 * @param type      enum: info, warning, error)
 * @param msg       Log Message
 * @param el        plastic element to append the message on
 */
plastic.helper.msg = function (msg, type, el) {

    if (type) {

        if (type === 'error') {
            console.error(type + ' :: ' + msg);
        } else if (type === 'warning') {
            console.warn(type + ' :: ' + msg);
        } else if (type === 'info') {
            console.info(type + ' :: ' + msg);
        } else {
            console.log(type + ' :: ' + msg);
        }


    } else {
        console.log('--> ' + msg);
    }

};
