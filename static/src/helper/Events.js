/**
 * plastic.js Events (PubSub Pattern)
 *
 * Adapted from {@link http://amplifyjs.com Amplify.js} into a commented OO implementation
 *
 * @link https://github.com/appendto/amplify/blob/master/src/core.js|Link to Source
 *
 * @constructor
 */
plastic.helper.Events = function() {
    "use strict";

};

plastic.helper.Events.prototype = {

    /** @private */
    _subs: {},

    /**
     * Publish Event
     *
     * @param {string} topic
     *
     * @returns {boolean}
     */
    pub: function(topic) {

        var slice = [].slice;

        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to publish.");
        }

        var args = slice.call(arguments, 1), topicSubscriptions, subscription, length, i = 0, ret;

        if (!this._subs[topic]) {
            return true;
        }

        topicSubscriptions = this._subs[ topic ].slice();
        for (length = topicSubscriptions.length; i < length; i++) {
            subscription = topicSubscriptions[ i ];
            ret = subscription.callback.apply(subscription.context, args);
            if (ret === false) {
                break;
            }
        }
        return ret !== false;
    },

    /**
     * Subscribe Event
     *
     * @param {string}          topic
     * @param {Object|Function} context
     * @param {Function}        callback
     * @param {number|Function} priority
     *
     * @returns {Function}
     */
    sub: function(topic, context, callback, priority) {
        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to create a subscription.");
        }

        if (arguments.length === 3 && typeof callback === "number") {
            priority = callback;
            callback = context;
            context = null;
        }
        if (arguments.length === 2) {
            callback = context;
            context = null;
        }
        priority = priority || 10;

        var topicIndex = 0,
            topics = topic.split(/\s/),
            topicLength = topics.length,
            added;
        for (; topicIndex < topicLength; topicIndex++) {
            topic = topics[ topicIndex ];
            added = false;
            if (!this._subs[ topic ]) {
                this._subs[ topic ] = [];
            }

            var i = this._subs[ topic ].length - 1,
                subscriptionInfo = {
                    callback: callback,
                    context: context,
                    priority: priority
                };

            for (; i >= 0; i--) {
                if (this._subs[ topic ][ i ].priority <= priority) {
                    this._subs[ topic ].splice(i + 1, 0, subscriptionInfo);
                    added = true;
                    break;
                }
            }

            if (!added) {
                this._subs[ topic ].unshift(subscriptionInfo);
            }
        }

        return callback;
    },

    /**
     * Unsubscribe Event
     *
     * @param {string}          topic
     * @param {Object|Function} context
     * @param {Function}        callback
     */
    unsub: function(topic, context, callback) {
        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to remove a subscription.");
        }

        if (arguments.length === 2) {
            callback = context;
            context = null;
        }

        if (!this._subs[ topic ]) {
            return;
        }

        var length = this._subs[ topic ].length,
            i = 0;

        for (; i < length; i++) {
            if (this._subs[ topic ][ i ].callback === callback) {
                if (!context || this._subs[ topic ][ i ].context === context) {
                    this._subs[ topic ].splice(i, 1);

                    // Adjust counter and length for removed item
                    i--;
                    length--;
                }
            }
        }
    }
};
