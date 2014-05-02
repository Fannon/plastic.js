/**
 * Global Message Function
 * Should be used instead of console.logs
 *
 * TODO: Make this visible as an overlay in front of the visualisation
 * TODO: Make it closeable
 *
 */
plastic.helper.msg = (function () {

    /**
     *
     * @param type      enum: info, warning, error)
     * @param msg       Log Message
     * @param el        plastic element to append the message on
     */
    var message = function (msg, type, el) {

        if (type) {

            if (type === 'error') {

                if (msg !== null && typeof msg === 'object') {
                    console.error(msg);
                    createNotification(msg, type, el);
                } else {
                    console.error(type + ' :: ' + msg);
                    createNotification(msg, type, el);
                }

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

    var createNotification = function(msg, type, el) {

        el.find('.plastic-js-msg').append('<div class="plastic-msg plastic-msg-error"><strong>' + type.toUpperCase() + ':</strong> ' + msg + '</div>');
    };

    return message;

})();

