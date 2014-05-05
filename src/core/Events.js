plastic.events = {

    _topics: {},

    subscribe: function mediatorSubscribe( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
            this._topics[ topic ] = [];
        }

        this._topics[ topic ].push( callback );
        return true;
    },

    unsubscribe: function mediatorUnsubscrive( topic, callback ) {
        if( ! this._topics.hasOwnProperty( topic ) ) {
            return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
            if( this._topics[ topic ][ i ] === callback ) {
                this._topics[ topic ].splice( i, 1 );
                return true;
            }
        }

        return false;
    },

    publish: function mediatorPublish() {
        var args = Array.prototype.slice.call( arguments );
        var topic = args.shift();

        if( ! this._topics.hasOwnProperty( topic ) ) {
            return false;
        }

        for( var i = 0, len = this._topics[ topic ].length; i < len; i++ ) {
            this._topics[ topic ][ i ].apply( undefined, args );
        }
        return true;
    }


};