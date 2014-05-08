/**
 * Global Message Function
 *
 * This draws a visible Error Message into the plastic element,
 * if a reference to the element is given.
 *
 * Should be used instead of console.logs
 *
 * @todo Improve Case Handling
 * @todo Add an Close Button?
 *
 * @function
 */
plastic.msg = (function () {

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

        el.find('.plastic-js-messages').append('<div class="plastic-js-msg plastic-js-msg-error"><strong>' + type.toUpperCase() + ':</strong> ' + msg + '</div>');
    };

    return message;

})();

