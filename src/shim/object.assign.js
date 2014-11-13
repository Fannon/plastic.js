/**
 * ES6 Object.assign shim
 * Based on https://github.com/es-shims/es6-shim
 */
(function(){
    'use strict';

    var isObject = function (obj) {
        return obj && typeof obj === 'object';
    };

    if(!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            value: function(target, source){
                var s, i, props;
                if (!isObject(target)) { throw new TypeError('target must be an object'); }
                for (s = 1; s < arguments.length; ++s) {
                    source = arguments[s];
                    if (!isObject(source)) { throw new TypeError('source ' + s + ' must be an object'); }
                    props = Object.keys(Object(source));
                    for (i = 0; i < props.length; ++i) {
                        target[props[i]] = source[props[i]];
                    }
                }
                return target;
            },
            enumerable: false
        });
    }
})();
