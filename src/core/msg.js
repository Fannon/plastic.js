/**
 * Global Message Function
 *
 * This draws a visible Error Message into the plastic element,
 * if a reference to the element is given.
 *
 * Should be used instead of console.log
 *
 * @todo Add an Close Button?
 *
 * @singleton
 * @namespace
 */
plastic.msg = {

    /**
     * Log Array
     *
     * If debugging is enabled, all infos, warnings and errors will be saved here
     *
     * @type {Array}
     * @private
     */
    _logs: [],

    /**
     * Logs a Message or Object to the Log Object and the console
     *
     * @example
     * plastic.msg.log('For your information', this.$el);
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {Object}          [el]    concerning plastic.js DOM element
     */
    log: function(msg, el) {
        "use strict";
        this.createLogEntry(msg, 'info', el || false);
        console.log(msg);
    },

    /**
     * Logs an Object to the Log Object and the console
     *
     * @example
     * plastic.msg.dir(myObject);
     *
     * @param {Object}   obj     Message String or Object
     */
    dir: function(obj) {
        "use strict";
        this.createLogEntry(obj, 'dump');
        console.dir(obj);
    },

    /**
     * Logs a Warning Message or Object to the Log Object and the console
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {Object}          [el]    concerning plastic.js DOM element
     */
    warn: function(msg, el) {
        "use strict";
        this.createLogEntry(msg, 'warning', el || false);
        console.warn(msg);
    },


    /**
     * Logs and outputs an error
     *
     * Can be given an error string or object
     *
     * @param {string}  msg       Log Message
     * @param {Object}  [el]      plastic element to append the message on
     */
    error: function (msg, el) {

        var message = msg;

        console.error(msg);
        this.createLogEntry(msg, 'error', el);

        if (msg instanceof Error) {
            message = msg.message;
        }

        this.createNotification(message, 'error', el);

    },

    /**
     * Creates a new log entry object if logging is enabled
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {string}          type    Message Type
     * @param {Object}          [el]    concerning plastic.js DOM element
     *
     */
    createLogEntry: function(msg, type, el) {
        "use strict";

        if (plastic.options.log) {
            var logObj = {
                timestamp: (new Date()).getTime(),
                type: type,
                msg: msg
            };

            if (el) {
                logObj.el = el;
            }

            this._logs.push(logObj);
        }

    },

    /**
     * Creates a new notification within the plastic-js-messages div
     *
     * @todo Check if msg is an Object, if it is use pre tag for displaying it
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {string}          type    Message Type
     * @param {Object}          [el]    concerning plastic.js DOM element or concerning plastic element
     */
    createNotification: function(msg, type, el) {

        if (el.$el) {
            el = el.$el;
        }

        if (el && el.find) {
            var msgBox = el.find('.plastic-js-messages');
            msgBox.append('<div class="plastic-js-msg plastic-js-msg-error"><strong>' + type.toUpperCase() + ':</strong> ' + msg + '</div>');
        }

    },

    /**
     * Parses the Log Object to a JSON string and dumps the string and the object into the console
     */
    dumpLogObject: function() {
        "use strict";
        console.log('> Dumping plastic.js log as Object:');
        console.dir(this._logs);
    },

    /**
     * Parses the Log Object to a JSON string and dumps the string and the object into the console
     */
    dumpLogJSON: function() {
        "use strict";
        console.log('> Dumping plastic.js log as JSON String:');
        console.log(JSON.stringify(this._logs, null, 4));
    },

    /**
     * Pretty prints an JSON Object to an HTML string
     *
     * @link http://stackoverflow.com/a/7220510
     *
     * @todo Wrap it into a pre tag
     *
     * @param   {Object} json   JSON Object
     * @returns {string} HTML String
     */
    prettyPrintJSON: function (json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, false, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
};


