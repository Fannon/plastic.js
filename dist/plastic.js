/*! plastic - v0.0.4 - 2014-05-26
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
/* jshint -W079 */ /* Ignores Redefinition of plastic */

/**
 * plastic.js Namespace
 *
 * @namespace
 */
var plastic = {

    /**
     * Version Number
     * @type String
     */
    version: '0.0.5',

    /**
     * Array which holds all the plastic.js Elements
     *
     * @type Array
     */
    elements: [],

    /**
     * Module Namespace
     *
     * This includes module and depencency handling and of course all available modules
     *
     *
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules Namespace
         * @namespace
         * @ignore
         */
        query: {},

        /**
         * API Parser Modules Namespace
         * @namespace
         * @ignore
         */
        api: {},

        /**
         * Data Parser Modules Namespace
         * @namespace
         * @ignore
         */
        data: {},

        /**
         * Display Modules Namespace
         * @namespace
         * @ignore
         */
        display: {}

    },

    /**
     * Namespace for helper functions
     * @namespace
     * @ignore
     */
    helper: {}

};

/**
 * Executes plastic.js
 *
 * This is done automatically on the DOM Ready Event
 */
plastic.execute = function() {
    "use strict";

    if (this.options.debug) {
        plastic.msg.log('[MAIN] plastic.js version v' + plastic.version + ' INIT');
    }


    /**
     * Global plastic events
     *
     * PubSub Pattern
     *
     * @type {plastic.helper.Events}
     */
    plastic.events = new plastic.helper.Events();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    var $plasticElements = $('plastic, .plastic-js');


    // Create new plastic.Elements
    $plasticElements.each(function() {

        var el = $(this);

        // If Debug Mode is activated: Do not use Exception handling (let it crash)
        if (plastic.options.debug) {
            plastic.elements.push(new plastic.Element(el));
        } else {
            if (plastic.options.debug) {
                plastic.elements.push(new plastic.Element(el));
            } else {
                try {
                    plastic.elements.push(new plastic.Element(el));
                } catch(e) {
                    plastic.msg.error('plastic element crashed while init', 'error', el);
                }
            }

        }

    });

    // Fetch all registered Dependencies
    plastic.modules.dependencyManager.fetch();

    $.each(plastic.elements, function(i, el ) {
        if (el.options.debug) {
            el.execute();
        } else {
            try {
                el.execute();
            } catch(e) {
                plastic.message.error('plastic.js Element Crash on init');
            }
        }

    });

};

// Execute plastic.js on DOM Ready
$(document).ready(function() {
    plastic.execute();
});

plastic.options = {

    /**
     * Debug Mode
     *
     * This enables logging of some informations to the console
     * This also ignores Exception handiling. If an error occurs it will crash hard and precice.
     *
     * @type {boolean}
     */
    debug: true,

    /**
     *
     * If true, plastic.js will keep a log object
     *
     * It is stored in plastic.msg._logs and can be JSON Dumped via plastic.msg.dumpLog();
     *
     */
    log: true,

    /**
     * Logs Benchmark Infos to the console
     *
     * @type {boolean}
     */
    benchmark: false,

    /**
     * Width of Canvas, if not given
     * @type {string}
     */
    width: '100%',

    /**
     * Height of Canvas, if not given
     * @type {string}
     */
    height: 'auto',

    /**
     * Default AJAX Timeout (in ms)
     * @type {number}
     */
    timeout: 3000
};

/**
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
*/

LazyLoad = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE|Trident/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls.concat();

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);

/**
 * jjv.js -- A javascript library to validate json input through a json-schema.
 *
 * Copyright (c) 2013 Alex Cornejo.
 *
 * Redistributable under a MIT-style open source license.
 */

(function () {
  var clone = function (obj) {
      // Handle the 3 simple types (string, number, function), and null or undefined
      if (obj === null || typeof obj !== 'object') return obj;
      var copy;

      // Handle Date
      if (obj instanceof Date) {
          copy = new Date();
          copy.setTime(obj.getTime());
          return copy;
      }

      // handle RegExp
      if (obj instanceof RegExp) {
        copy = new RegExp(obj);
        return copy;
      }

      // Handle Array
      if (obj instanceof Array) {
          copy = [];
          for (var i = 0, len = obj.length; i < len; i++)
              copy[i] = clone(obj[i]);
          return copy;
      }

      // Handle Object
      if (obj instanceof Object) {
          copy = {};
//           copy = Object.create(Object.getPrototypeOf(obj));
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr))
                copy[attr] = clone(obj[attr]);
          }
          return copy;
      }

      throw new Error("Unable to clone object!");
  };

  var clone_stack = function (stack) {
    var stack_last = stack.length-1, key = stack[stack_last].key;
    var new_stack = stack.slice(0);
    new_stack[stack_last].object[key] = clone(new_stack[stack_last].object[key]);
    return new_stack;
  };

  var copy_stack = function (new_stack, old_stack) {
    var stack_last = new_stack.length-1, key = new_stack[stack_last].key;
    old_stack[stack_last].object[key] = new_stack[stack_last].object[key];
  };

  var handled = {
    'type': true,
    'not': true,
    'anyOf': true,
    'allOf': true,
    'oneOf': true,
    '$ref': true,
    '$schema': true,
    'id': true,
    'exclusiveMaximum': true,
    'exclusiveMininum': true,
    'properties': true,
    'patternProperties': true,
    'additionalProperties': true,
    'items': true,
    'additionalItems': true,
    'required': true,
    'default': true,
    'title': true,
    'description': true,
    'definitions': true,
    'dependencies': true
  };

  var fieldType = {
    'null': function (x) {
      return x === null;
    },
    'string': function (x) {
      return typeof x === 'string';
    },
    'boolean': function (x) {
      return typeof x === 'boolean';
    },
    'number': function (x) {
      return typeof x === 'number' && !isNaN(x);
    },
    'integer': function (x) {
      return typeof x === 'number' && x%1 === 0;
    },
    'object': function (x) {
      return x && typeof x === 'object' && !Array.isArray(x);
    },
    'array': function (x) {
      return Array.isArray(x);
    },
    'date': function (x) {
      return x instanceof Date;
    }
  };

  // missing: uri, date-time, ipv4, ipv6
  var fieldFormat = {
    'alpha': function (v) {
      return (/^[a-zA-Z]+$/).test(v);
    },
    'alphanumeric': function (v) {
      return (/^[a-zA-Z0-9]+$/).test(v);
    },
    'identifier': function (v) {
      return (/^[-_a-zA-Z0-9]+$/).test(v);
    },
    'hexadecimal': function (v) {
      return (/^[a-fA-F0-9]+$/).test(v);
    },
    'numeric': function (v) {
      return (/^[0-9]+$/).test(v);
    },
    'date-time': function (v) {
      return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
    },
    'uppercase': function (v) {
      return v === v.toUpperCase();
    },
    'lowercase': function (v) {
      return v === v.toLowerCase();
    },
    'hostname': function (v) {
      return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
    },
    'uri': function (v) {
      return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
    },
    'email': function (v) { // email, ipv4 and ipv6 adapted from node-validator
      return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
    },
    'ipv4': function (v) {
      if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
        var parts = v.split('.').sort();
        if (parts[3] <= 255)
          return true;
      }
      return false;
    },
    'ipv6': function(v) {
      return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
     /*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
    }
  };

  var fieldValidate = {
    'readOnly': function (v, p) {
      return false;
    },
    // ****** numeric validation ********
    'minimum': function (v, p, schema) {
      return !(v < p || schema.exclusiveMinimum && v <= p);
    },
    'maximum': function (v, p, schema) {
      return !(v > p || schema.exclusiveMaximum && v >= p);
    },
    'multipleOf': function (v, p) {
      return (v/p)%1 === 0 || typeof v !== 'number';
    },
    // ****** string validation ******
    'pattern': function (v, p) {
      if (typeof v !== 'string')
        return true;
      var pattern, modifiers;
      if (typeof p === 'string')
        pattern=p;
      else {
        pattern=p[0];
        modifiers=p[1];
      }
      var regex = new RegExp(pattern, modifiers);
      return regex.test(v);
    },
    'minLength': function (v, p) {
      return v.length >= p || typeof v !== 'string';
    },
    'maxLength': function (v, p) {
      return v.length <= p || typeof v !== 'string';
    },
    // ***** array validation *****
    'minItems': function (v, p) {
      return v.length >= p || !Array.isArray(v);
    },
    'maxItems': function (v, p) {
      return v.length <= p || !Array.isArray(v);
    },
    'uniqueItems': function (v, p) {
      var hash = {}, key;
      for (var i = 0, len = v.length; i < len; i++) {
        key = JSON.stringify(v[i]);
        if (hash.hasOwnProperty(key))
          return false;
        else
          hash[key] = true;
      }
      return true;
    },
    // ***** object validation ****
    'minProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count >= p;
    },
    'maxProperties': function (v, p) {
      if (typeof v !== 'object')
        return true;
      var count = 0;
      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
      return count <= p;
    },
    // ****** all *****
    'enum': function (v, p) {
      var i, len, vs;
      if (typeof v === 'object') {
        vs = JSON.stringify(v);
        for (i = 0, len = p.length; i < len; i++)
          if (vs === JSON.stringify(p[i]))
            return true;
      } else {
        for (i = 0, len = p.length; i < len; i++)
          if (v === p[i])
            return true;
      }
      return false;
    }
  };

  var normalizeID = function (id) {
    return id.indexOf("://") === -1 ? id : id.split("#")[0];
  };

  var resolveURI = function (env, schema_stack, uri) {
    var curschema, components, hash_idx, name;

    hash_idx = uri.indexOf('#');

    if (hash_idx === -1) {
      if (!env.schema.hasOwnProperty(uri))
        return null;
      return [env.schema[uri]];
    }

    if (hash_idx > 0) {
      name = uri.substr(0, hash_idx);
      uri = uri.substr(hash_idx+1);
      if (!env.schema.hasOwnProperty(name)) {
        if (schema_stack && schema_stack[0].id === name)
          schema_stack = [schema_stack[0]];
        else
          return null;
      } else
        schema_stack = [env.schema[name]];
    } else {
      if (!schema_stack)
        return null;
      uri = uri.substr(1);
    }

    if (uri === '')
      return [schema_stack[0]];

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      curschema = schema_stack[0];
      components = uri.split('/');
      while (components.length > 0) {
        if (!curschema.hasOwnProperty(components[0]))
          return null;
        curschema = curschema[components[0]];
        schema_stack.push(curschema);
        components.shift();
      }
      return schema_stack;
    } else // FIX: should look for subschemas whose id matches uri
      return null;
  };

  var resolveObjectRef = function (object_stack, uri) {
    var components, object, last_frame = object_stack.length-1, skip_frames, frame, m = /^(\d+)/.exec(uri);

    if (m) {
      uri = uri.substr(m[0].length);
      skip_frames = parseInt(m[1], 10);
      if (skip_frames < 0 || skip_frames > last_frame)
        return;
      frame = object_stack[last_frame-skip_frames];
      if (uri === '#')
        return frame.key;
    } else
      frame = object_stack[0];

    object = frame.object[frame.key];

    if (uri === '')
      return object;

    if (uri.charAt(0) === '/') {
      uri = uri.substr(1);
      components = uri.split('/');
      while (components.length > 0) {
        components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
        if (!object.hasOwnProperty(components[0]))
          return;
        object = object[components[0]];
        components.shift();
      }
      return object;
    } else
      return;
  };

  var checkValidity = function (env, schema_stack, object_stack, options) {
    var i, len, count, hasProp, hasPattern;
    var p, v, malformed = false, objerrs = {}, objerr, objreq, errors = {}, props, matched, isArray;
    var sl = schema_stack.length-1, schema = schema_stack[sl];
    var ol = object_stack.length-1, object = object_stack[ol].object, name = object_stack[ol].key, prop = object[name];

    if (schema.hasOwnProperty('$ref')) {
      schema_stack= resolveURI(env, schema_stack, schema.$ref);
      if (!schema_stack)
        return {'$ref': schema.$ref};
      else
        return checkValidity(env, schema_stack, object_stack, options);
    }

    if (schema.hasOwnProperty('type')) {
      if (typeof schema.type === 'string') {
        if (options.useCoerce && env.coerceType.hasOwnProperty(schema.type))
          prop = object[name] = env.coerceType[schema.type](prop);
        if (!env.fieldType[schema.type](prop))
          return {'type': schema.type};
      } else {
        malformed = true;
        for (i = 0, len = schema.type.length; i < len && malformed; i++)
          if (env.fieldType[schema.type[i]](prop))
            malformed = false;
        if (malformed)
          return {'type': schema.type};
      }
    }

    if (schema.hasOwnProperty('allOf')) {
      for (i = 0, len = schema.allOf.length; i < len; i++) {
        objerr = checkValidity(env, schema_stack.concat(schema.allOf[i]), object_stack, options);
        if (objerr)
          return objerr;
      }
    }

    if (!options.useCoerce && !options.useDefault && !options.removeAdditional) {
      if (schema.hasOwnProperty('oneOf')) {
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), object_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
          } else {
            objerrs = objerr;
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), object_stack, options);
          if (!objerr)
            break;
        }
        if (objerr)
          return objerr;
      }

      if (schema.hasOwnProperty('not')) {
        objerr = checkValidity(env, schema_stack.concat(schema.not), object_stack, options);
        if (!objerr)
          return {'not': true};
      }
    } else {
      if (schema.hasOwnProperty('oneOf')) {
        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), new_stack, options);
          if (!objerr) {
            count = count + 1;
            if (count > 1)
              break;
            else
              copy_stack(new_stack, object_stack);
          } else {
            objerrs = objerr;
          }
        }
        if (count > 1)
          return {'oneOf': true};
        else if (count < 1)
          return objerrs;
        objerrs = {};
      }

      if (schema.hasOwnProperty('anyOf')) {
        for (i = 0, len = schema.anyOf.length; i < len; i++) {
          new_stack = clone_stack(object_stack);
          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), new_stack, options);
          if (!objerr) {
            copy_stack(new_stack, object_stack);
            break;
          }
        }
        if (objerr)
          return objerr;
      }

      if (schema.hasOwnProperty('not')) {
        objerr = checkValidity(env, schema_stack.concat(schema.not), clone_stack(object_stack), options);
        if (!objerr)
          return {'not': true};
      }
    }

    if (schema.hasOwnProperty('dependencies')) {
      for (p in schema.dependencies)
        if (schema.dependencies.hasOwnProperty(p) && prop.hasOwnProperty(p)) {
          if (Array.isArray(schema.dependencies[p])) {
            for (i = 0, len = schema.dependencies[p].length; i < len; i++)
              if (!prop.hasOwnProperty(schema.dependencies[p][i])) {
                return {'dependencies': true};
              }
          } else {
            objerr = checkValidity(env, schema_stack.concat(schema.dependencies[p]), object_stack, options);
            if (objerr)
              return objerr;
          }
        }
    }

    if (!Array.isArray(prop)) {
      props = [];
      objerrs = {};
      for (p in prop)
        if (prop.hasOwnProperty(p))
          props.push(p);

      if (options.checkRequired && schema.required) {
        for (i = 0, len = schema.required.length; i < len; i++)
          if (!prop.hasOwnProperty(schema.required[i])) {
            objerrs[schema.required[i]] = {'required': true};
            malformed = true;
          }
      }

      hasProp = schema.hasOwnProperty('properties');
      hasPattern = schema.hasOwnProperty('patternProperties');
      if (hasProp || hasPattern) {
        i = props.length;
        while (i--) {
          matched = false;
          if (hasProp && schema.properties.hasOwnProperty(props[i])) {
            matched = true;
            objerr = checkValidity(env, schema_stack.concat(schema.properties[props[i]]), object_stack.concat({object: prop, key: props[i]}), options);
            if (objerr !== null) {
              objerrs[props[i]] = objerr;
              malformed = true;
            }
          }
          if (hasPattern) {
            for (p in schema.patternProperties)
              if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
                matched = true;
                objerr = checkValidity(env, schema_stack.concat(schema.patternProperties[p]), object_stack.concat({object: prop, key: props[i]}), options);
                if (objerr !== null) {
                  objerrs[props[i]] = objerr;
                  malformed = true;
                }
              }
          }
          if (matched)
            props.splice(i, 1);
        }
      }

      if (options.useDefault && hasProp && !malformed) {
        for (p in schema.properties)
          if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
            prop[p] = schema.properties[p]['default'];
      }

      if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
        for (i = 0, len = props.length; i < len; i++)
          delete prop[props[i]];
      } else {
        if (schema.hasOwnProperty('additionalProperties')) {
          if (typeof schema.additionalProperties === 'boolean') {
            if (!schema.additionalProperties) {
              for (i = 0, len = props.length; i < len; i++) {
                objerrs[props[i]] = {'additional': true};
                malformed = true;
              }
            }
          } else {
            for (i = 0, len = props.length; i < len; i++) {
              objerr = checkValidity(env, schema_stack.concat(schema.additionalProperties), object_stack.concat({object: prop, key: props[i]}), options);
              if (objerr !== null) {
                objerrs[props[i]] = objerr;
                malformed = true;
              }
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    } else {
      if (schema.hasOwnProperty('items')) {
        if (Array.isArray(schema.items)) {
          for (i = 0, len = schema.items.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items[i]), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
          if (prop.length > len && schema.hasOwnProperty('additionalItems')) {
            if (typeof schema.additionalItems === 'boolean') {
              if (!schema.additionalItems)
                return {'additionalItems': true};
            } else {
              for (i = len, len = prop.length; i < len; i++) {
                objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
                if (objerr !== null) {
                  objerrs[i] = objerr;
                  malformed = true;
                }
              }
            }
          }
        } else {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.items), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      } else if (schema.hasOwnProperty('additionalItems')) {
        if (typeof schema.additionalItems !== 'boolean') {
          for (i = 0, len = prop.length; i < len; i++) {
            objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
            if (objerr !== null) {
              objerrs[i] = objerr;
              malformed = true;
            }
          }
        }
      }
      if (malformed)
        return {'schema': objerrs};
    }

    for (v in schema) {
      if (schema.hasOwnProperty(v) && !handled.hasOwnProperty(v)) {
        if (v === 'format') {
          if (env.fieldFormat.hasOwnProperty(schema[v]) && !env.fieldFormat[schema[v]](prop, schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        } else {
          if (env.fieldValidate.hasOwnProperty(v) && !env.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)) {
            objerrs[v] = true;
            malformed = true;
          }
        }
      }
    }

    if (malformed)
      return objerrs;
    else
      return null;
  };

  var defaultOptions = {
    useDefault: false,
    useCoerce: false,
    checkRequired: true,
    removeAdditional: false
  };

  function Environment() {
    if (!(this instanceof Environment))
      return new Environment();

    this.coerceType = {};
    this.fieldType = clone(fieldType);
    this.fieldValidate = clone(fieldValidate);
    this.fieldFormat = clone(fieldFormat);
    this.defaultOptions = clone(defaultOptions);
    this.schema = {};
  }

  Environment.prototype = {
    validate: function (name, object, options) {
      var schema_stack = [name], errors = null, object_stack = [{object: {'__root__': object}, key: '__root__'}];

      if (typeof name === 'string') {
        schema_stack = resolveURI(this, null, name);
        if (!schema_stack)
          throw new Error('jjv: could not find schema \'' + name + '\'.');
      }

      if (!options) {
        options = this.defaultOptions;
      } else {
        for (var p in this.defaultOptions)
          if (this.defaultOptions.hasOwnProperty(p) && !options.hasOwnProperty(p))
            options[p] = this.defaultOptions[p];
      }

      errors = checkValidity(this, schema_stack, object_stack, options);

      if (errors)
        return {validation: errors.hasOwnProperty('schema') ? errors.schema : errors};
      else
        return null;
    },

    resolveRef: function (schema_stack, $ref) {
      return resolveURI(this, schema_stack, $ref);
    },

    addType: function (name, func) {
      this.fieldType[name] = func;
    },

    addTypeCoercion: function (type, func) {
      this.coerceType[type] = func;
    },

    addCheck: function (name, func) {
      this.fieldValidate[name] = func;
    },

    addFormat: function (name, func) {
      this.fieldFormat[name] = func;
    },

    addSchema: function (name, schema) {
      if (!schema && name) {
        schema = name;
        name = undefined;
      }
      if (schema.hasOwnProperty('id') && typeof schema.id === 'string' && schema.id !== name) {
        if (schema.id.charAt(0) === '/')
          throw new Error('jjv: schema id\'s starting with / are invalid.');
        this.schema[normalizeID(schema.id)] = schema;
      } else if (!name) {
        throw new Error('jjv: schema needs either a name or id attribute.');
      }
      if (name)
        this.schema[normalizeID(name)] = schema;
    }
  };

  // Export for use in server and client.
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = Environment;
  else if (typeof define === 'function' && define.amd)
    define(function () {return Environment;});
  else
    window.jjv = Environment;
})();

plastic.Element = function(el) {

    var self = this;

    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = el;

    /**
     * HTML ID if available, otherwise auto generated ID
     * @type {String}
     */
    this.id = undefined;

    // Get / Calculate ID
    if (el && el[0] && el[0].id) {
        this.id = el[0].id;
    } else {
        this.id = 'plastic-el-' + plastic.elements.length + 1;
    }

    /**
     * Inherited (and overwritten) general element options
     *
     * @type {Object|plastic.options}
     */
    this.options = plastic.options;

    if (this.options.debug) {
        plastic.msg.log('[#' + this.id + '] new plastic.Element()');
    }

    /**
     * Element specific Event PubSub
     */
    this.events = new plastic.helper.Events();

    /**
     * Total Number of asynchronous Events to wait for
     *
     * @type {number}
     */
    this.eventsTotal = 1;

    /**
     * Current Number of asynchronous Events that already happened
     *
     * If this equals this.eventsTotal, the Element can be
     * @type {number}
     */
    this.eventsProgress = 0;

    /**
     * Benchmark Time Start (ms timestamp)
     * @type {number}
     */
    this.benchmarkStart = (new Date()).getTime();

    /**
     * Benchmark Time Data loaded (ms timestamp)
     * @type {number}
     */
    this.benchmarkDataLoaded = 0;

    /**
     * Benchmark Time Modules loaded (Array of ms timestamp)
     * @type {Array}
     */
    this.benchmarkModulesLoaded = [];

    /**
     * Benchmark Time Completed (ms timestamp)
     * @type {number}
     */
    this.benchmarkCompleted = 0;

    /**
     * Module Dependencies
     * Those are
     * @type {Array}
     */
    this.dependencies = [];

    /**
     * plastic.js ElementAttibutes Object (Instance)
     *
     * @type {plastic.ElementAttributes}
     */
    this.attr = new plastic.ElementAttributes(this);

    /**
     * Element Query Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.queryModule = false;

    /**
     * Element Data Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.dataModule = false;

    /**
     * Element Display Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.displayModule = false;


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    // Merge general options from ElementsAttributes
    this.mergeOptions();

    // Register all necessary dependencies
    this.registerDependencies();


    //////////////////////////////////////////
    // REGISTER EVENTS LSITENERS            //
    //////////////////////////////////////////

    /** Helper Function: On dependency load */
    var depLoaded = function() {
        "use strict";
        self.benchmarkModulesLoaded.push((new Date()).getTime());
        this.updateProgress();
    };

    for (var i = 0; i < this.dependencies.length; i++) {
        this.eventsTotal += 1;
        plastic.events.sub('loaded-' + this.dependencies[i], self, depLoaded);
    }


};

//////////////////////////////////////////
// Element Methods                      //
//////////////////////////////////////////

plastic.Element.prototype = {

    /**
     * Executes the processing of the plastic.element
     */
    execute: function() {

        /** Asynchronous Mode */
        var self = this;

        this.createMessageContainer(this.$el);
        this.createDisplayContainer(this.$el);


        //////////////////////////////////////////
        // CALLING QUERY MODULE                 //
        //////////////////////////////////////////

        if (this.attr.query) { // OPTIONAL
            this.queryModule = new plastic.modules.Module(this, 'query', this.attr.query.module);
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (this.attr.data && this.attr.data.url) {

            if (this.options.debug) {
                plastic.msg.log('[#' + this.id + '] Data-URL: ' + this.attr.data.url);
            }

            // TODO: Catch Timeout Error

            /** jQuery AJAX Request Object */
            try {
                $.ajax({
                    url: this.attr.data.url,
                    dataType: 'json',
                    timeout: this.options.timeout,
                    success: function(data) {
                        "use strict";

                        if (data !== null && typeof data === 'object') {
                            self.attr.data.raw = data;
                        } else {
                            self.attr.data.raw = $.parseJSON(data);
                        }

                        self.benchmarkDataLoaded = (new Date()).getTime();
                        self.attr.raw = data;
                        self.updateProgress();

                        self.events.pub('data-sucess');
                    },
                    error: function() {
                        plastic.msg('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.$el );
                        self.cancelProgress();
                    }
                });
            } catch(e) {
                plastic.msg.error(e);
                throw new Error('Data Request failed');
            }

        } else {
            // Data is already there, continue:
            self.updateProgress();
        }

    },

    /**
     * Creates a new Attributes Object which parses and stores all Attributes of the plastic.js element
     */
    updateAttributes: function() {
        "use strict";
        this.attributes = new plastic.ElementAttributes(this.$el);
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Message Container
     * @todo $el.find unnecessary?
     */
    createMessageContainer: function() {
        "use strict";

        this.$el.css('position', 'relative');

        this.$el.append('<div class="plastic-js-messages"></div>');
        var msgEl = this.$el.find('.plastic-js-messages');
        msgEl
            .width(this.$el.width())
        ;
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Display Container
     * @todo $el.find unnecessary?
     */
    createDisplayContainer: function() {
        "use strict";

        this.$el.append('<div class="plastic-js-display"></div>');
        var displayEl = this.$el.find('.plastic-js-display');
        displayEl
            .height(this.$el.height())
            .width(this.$el.width())
        ;
    },

    /**
     * Updates the Progress of asynchronal events
     */
    updateProgress: function() {
        "use strict";

        this.eventsProgress += 1;

        if (this.options.debug) {
            plastic.msg.log('[#' + this.id + '] Current Progress: ' + this.eventsProgress + '/' + this.eventsTotal);
        }

        // If all events are run (dependencies loaded): continue with processing of the element
        if (this.eventsProgress === this.eventsTotal) {
            this.completeProgress();
        }
    },

    /**
     * Cancels the processing of the element and displays the info to the user
     */
    cancelProgress: function() {
        "use strict";
        plastic.msg('plastic.js processing aborted.', 'error', this.$el);
        // Clear all Element Events
        this.events = new plastic.helper.Events();
    },

    /**
     * This executes all remaining actions after all events are completed
     */
    completeProgress: function() {
        "use strict";

        // Instanciate new Data Module
        this.dataModule = new plastic.modules.Module(this, 'data', this.attr.data.module);

        // Apply Data Description if available
        this.applySchema();

        // Instanciate new Display Module (renders the output)
        this.displayModule = new plastic.modules.Module(this, 'display', this.attr.display.module);

        this.benchmarkCompleted = (new Date()).getTime();

        if (this.options.benchmark) {
            this.displayBenchmark();
        }
    },

    /**
     * Looks for all external dependencies that are required by the currently used modules
     *
     * Registers all Dependencys for Lazyloading
     * @todo Use a Set Datastructure?
     */
    registerDependencies: function() {
        "use strict";

        var displayModuleInfo = plastic.modules.moduleManager.get('display', this.attr.display.module);
        plastic.modules.dependencyManager.add(displayModuleInfo.dependencies);

        if (this.attr.data && this.attr.data.module) {
            var dataModuleInfo = plastic.modules.moduleManager.get('data', this.attr.data.module);
            plastic.modules.dependencyManager.add(dataModuleInfo.dependencies);
        }

        this.dependencies = (this.dependencies.concat(displayModuleInfo.dependencies));
    },

    mergeOptions: function() {
        "use strict";
        this.options = $.extend(true, {}, plastic.options, this.attr.options.general);
    },

    /**
     * Dumps benchmark data to the console
     */
    displayBenchmark: function() {
        "use strict";

        var dataLoadedDiff = this.benchmarkDataLoaded - this.benchmarkStart;
        var totalDiff = this.benchmarkCompleted - this.benchmarkStart;

        var msg = '[#' + this.id + '] BENCHMARK:';

        msg += (' DATA: ' + dataLoadedDiff + 'ms');

        for (var i = 0; i < this.benchmarkModulesLoaded.length; i++) {
            var moduleTime = this.benchmarkModulesLoaded[i];
            var moduleDiff = moduleTime - this.benchmarkStart;
            msg += ' | MODULE-' + (i + 1) + ': ' + moduleDiff + 'ms';
        }

        msg += ' | TOTAL: ' + totalDiff + 'ms';
        plastic.msg.log(msg);

    },

    /**
     * Applies Data Description to generate "annotated / enriched" processed data
     */
    applySchema: function() {
        "use strict";

        var self = this;
        var processedData = this.attr.data.processed;
        var dataDescription = this.attr.data.description;

        var applyHtml = function() {

            /**
             * Maps DataTypes (Formats) to a converter function, which returns the HTML reprentation of the type
             * @todo Create more Formats
             * @todo Create Phone Number
             *
             * @type {{}}
             */
            var htmlMapper = {
                "email": function(val) {
                    var strippedVal = val.replace('mailto:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "phone": function(val) {
                    var strippedVal = val.replace('tel:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "uri": function(val) {
                    // Strips http:// or ftp:// etc.
                    var strippedVal = val.replace(/\w*:\/{2}/g, ''); //
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                }
            };

            var processedHtml = $.extend(true, [], processedData); // Deep Copy

            for (var i = 0; i < processedHtml.length; i++) {

                var row = processedHtml[i];

                for (var cellType in row) {

                    var cellValue = row[cellType];
                    var format = dataDescription[cellType].format;

                    // TODO: Case-Handling: value could be no array (?)
                    for (var j = 0; j < cellValue.length; j++) {

                        if (format) {
                            cellValue[j] = htmlMapper[format](cellValue[j]);
                        }
                    }
                }

            }

            self.attr.data.processedHtml = processedHtml;
        };

        if (dataDescription && Object.keys(dataDescription).length > 0) {
            applyHtml();
        }

    }

};

plastic.ElementAttributes = function(pEl) {


    this.pEl = pEl;

    /**
     * plastic.js DOM Element
     *
     * @type {{}}
     */
    this.$el = pEl.$el;

    /**
     * Element Style Attributes
     * @type {Object|boolean}
     */
    this.style = false;

    /**
     * Element Options Attributes
     * @type {Object|boolean}
     */
    this.options = {};

    /**
     * Element Query Attributes
     * @type {Object|boolean}
     */
    this.query = false;

    /**
     * Element Display Attributes
     * @type {Object|boolean}
     */
    this.display = {};

    /**
     * Element Data Attributes
     * @type {Object|boolean}
     */
    this.data = false;

    // Parse all Attributes of the current plastic.element
    this.parse();

    // Validate the final Attributes Object
    this.validate();

};

plastic.ElementAttributes.prototype = {

    /**
     * JSON Schema for validation
     *
     * @link http://json-schema.org/|JSON-Schema Site
     * @type {{}}
     */
    attrObjSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "style": {
                "type": "object",
                "properties": {
                    "width": {
                        "type": "number"
                    },
                    "height": {
                        "type": "number"
                    }
                }
            },
            "options": {
                "type": "object"
            },
            "display": {
                "type": "object",
                "properties": {
                    "module": {"type": "string"},
                    "options": {"type": "object"}
                },
                required: ["module", "options"]
            },
            "query": {
                "type": ["object", "boolean"],
                "properties": {
                    "text": {"type": "string"},
                    "module": {"type": "string"},
                    "url": {"type": "string"}
                },
                "required": ["module", "text", "url"]
            },
            "data": {
                "type": ["object", "boolean"],
                "properties": {
                    "module": {"type": "string"},
                    "raw": {"type": ["object", "array", "string"]},
                    "processed": {"type": "array"},
                    "processedHtml": {"type": "array"},
                    "url": {"type": "string"},
                    "description": {"type": "object"} // TODO: Define Description SCHEMA
                },
                // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                "required": ["module"] }
        },
        "required": ["style", "options"]
    },


    /**
     * Returns a compact, current Attribute Object
     * Removes all main-attributes which are flagged with false
     *
     * @returns {Object}
     */
    getAttrObj: function() {
        "use strict";

        var attrObj = {
            "style": this.style,
            "options": this.options,
            "display": this.display
        };

        if (this.data) {
            attrObj.data = this.data;
        }

        if (this.query) {
            attrObj.query = this.query;
        }

        return attrObj;
    },

    /**
     * Parses all Attributes of the plastic.js element
     *
     * @returns {Object}
     */
    parse: function() {
        "use strict";

        this.getStyle();
        this.getOptions();
        this.getQuery();
        this.getData();
        this.getDataDescription();
        this.getDisplay();

        if (this.pEl.options.debug) {
            plastic.msg.dir(this.getAttrObj());
        }

    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     */
    getStyle: function() {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        this.style = {};

        this.style.height = this.$el.height();
        this.style.width = this.$el.width();
    },

    /**
     * Gets all Option Attributes
     */
    getOptions: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = this.$el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text;

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);

                    // SUCCESS
                    this.options.general = options;

                } catch(e) {
                    console.dir(e);
                    plastic.msg('Invalid JSON in the Options Object!');
                    throw new Error(e);
                }

            } else {
                plastic.msg('Empty Obptions Element!', 'error', this.$el);
                throw new Error('Empty Obptions Element!');
            }

        }
    },

    /**
     * Gets all Option Attributes
     */
    getDisplay: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var displayObject = this.$el.find(".plastic-display");

        if (displayObject.length > 0) {

            this.display.module = displayObject.attr('data-display-module');

            var optionsString = displayObject[0].text;

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);
                    this.display.options = options;


                } catch(e) {
                    console.dir(e);
                    plastic.msg('Invalid JSON in the Options Object!');
                    throw new Error(e);
                }

            } else {
                plastic.msg('Empty Display Element!', 'error', this.$el);
                throw new Error('Empty Display Element!');
            }

        } else {
            plastic.msg('No Display Module set!', 'error', this.$el);
            throw new Error('No Display Module set!');
        }
    },

    /**
     * Gets all Query Attributes and stores them into this.query
     */
    getQuery: function() {
        "use strict";
        var queryElement = this.$el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            var query = {};

            query.url = queryElement.attr('data-query-url');
            query.module = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                query.text = queryString;

                // SUCCESS
                this.query = query;

            } else {
                plastic.msg('Empty Query Element!', 'error', this.$el);
                throw new Error('Empty Query Element!');
            }

        }
    },

    /**
     * Gets all Schema Attributes
     */
    getDataDescription: function() {
        "use strict";
        // Get Data-URL
        var schemaElement = this.$el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                this.data.description =  $.parseJSON(schemaString);
            } else {
                plastic.msg('Data Description Element provided, but empty!', 'error', this.$el);
            }

        }
    },

    /**
     * Gets all Data Attributes
     */
    getData: function() {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = this.$el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.module = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {


                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.msg('Empty Data Element!', 'error', this.$el);
                }
            }

            // SUCCESS
            this.data = data;

        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";

        var env = jjv();
        env.addSchema('schema', this.attrObjSchema);
        var errors = env.validate('schema', this.getAttrObj());

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('Data Structure invalid!');
        }

    }

};

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
        this.createLogEntry(msg, 'info', el);
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
        this.createLogEntry(msg, 'warning', el);
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

        console.error(msg);
        this.createLogEntry(msg, 'error', el);
        this.createNotification(msg, 'error', el);

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
     * @param {Object}          [el]    concerning plastic.js DOM element
     */
    createNotification: function(msg, type, el) {

        msg = this.prettyPrintJSON(msg);

        el.find('.plastic-js-messages').append('<div class="plastic-js-msg plastic-js-msg-error"><strong>' + type.toUpperCase() + ':</strong>' + msg + '</div>');
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
            json = JSON.stringify(json, undefined, 2);
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

plastic.helper.schemaValidation = function(schema, data, errorMessage) {
    "use strict";

    var env = jjv();
    env.addSchema('schema', schema);
    var errors = env.validate('schema', data);

    // validation was successful
    if (errors) {

        plastic.errors.push(errors);

        if (errorMessage) {
            throw new Error(errorMessage);
        } else {
            throw new Error('Object validation failed! Fore more informations look into the development console.');
        }

    }

};
plastic.modules.Module = function(pEl, type, name) {

    /**
     * plastic Element
     * @type {plastic.Element}
     */
    this.pEl = pEl;

    /**
     * Module Name
     * @type {string}
     */
    this.name = name;

    /**
     * Module Type
     * @type {string}
     */
    this.type = type;

    /**
     * Specific Module Instance
     *
     * @type {Object}
     */
    this.module = undefined;

    /**
     * Module Infos (like className, Dependencies, etc.)
     * @type {Object}
     */
    this.info = plastic.modules.moduleManager.get(type, name);

    if (!this.info)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    var Module = plastic.modules[type][this.info.className];

    if (!Module)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    // Specific case handling for each module-type
    if (type === 'display') {
        this.module = new Module(pEl.$el, pEl.attr);
        this.execute();

    } else if (type === 'data') {
        this.module = new Module(pEl.attr.data);
        this.execute();

    } else if (type === 'query') {
        this.module = new Module(pEl.attr.query);
        this.execute();

    } else {
        throw new Error('Invalid Module Type!');
    }

};

plastic.modules.Module.prototype = {

    /**
     * Executes the module and stores the return values accordingly
     *
     * Validates the data against the module before executing it
     */
    execute: function() {
        "use strict";

        if (this.type === 'display') {
            this.validate();
            this.module.execute();

        } else if (this.type === 'data') {
            this.validate();
            this.pEl.attr.data = this.module.execute();

        } else if (this.type === 'query') {
            this.validate();
            this.pEl.attr.data = this.module.execute();
        }

    },

    /**
     * General Module Validation
     *
     * This calls all available validation Schemas and Function of the module
     */
    validate: function() {
        "use strict";

        var self = this;

        // General Validation (by logic)
        if (this.module.validate) {

            var validationErrors = this.module.validate();

            // validation was successful
            if (validationErrors) {
                plastic.msg.log(validationErrors, self.pEl.$el);
                throw new Error('Module ' + this.name + ': Validation Error!');
            }
        }


        // Schema Validation (by schema objects)
        if (this.module.rawDataSchema && this.pEl.attr.data && this.pEl.attr.data.raw) {
            plastic.helper.schemaValidation(this.module.rawDataSchema, this.pEl.attr.data.raw, 'Raw Data invalid!');
        }

        if (this.module.processedDataSchema && this.pEl.attr.data && this.pEl.attr.data.processed) {
            plastic.helper.schemaValidation(this.module.processedDataSchema, this.pEl.attr.data.processed, 'Processed Data invalid!');
        }

        if (this.module.displayOptionsSchema && this.pEl.attr.options && this.pEl.attr.options.display && this.pEl.attr.options.display.options) {
            plastic.helper.schemaValidation(this.module.displayOptionsSchema, this.pEl.attr.options.display.options, 'Display Options invalid!');
        }


    },

    /**
     * Calls the Module Update function (if available)
     */
    update: function() {
        "use strict";
        if (this.module.update) {
            this.module.update();
        }

    }



};

plastic.modules.dependencyManager = {

    /**
     * Registry Object that collects all extnal dependencies by name, and ressources
     *
     * If a module is added that has a new external dependency it can either be added here
     * or be added via setDependency() at runtime.
     * If "test" is given, plastic.js will look if the given global variable exists. If it does, it will not be loaded.
     */
    registry: {
        "d3": {
            "test": "d3",
            "js": ["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"]
        },
        "nvd3": {
            "js": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js"],
            "css": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.css"]
        }
    },

    /**
     * Object of all Ressources that have to be loaded
     */
    usedDeps: {},

    /**
     * Sets a new dependency (that isn't registered yet)
     *
     * @param {string}  depName     Dependency Name
     * @param {Array}      [jsArray]   Array of JavaScript Files to load (optional)
     * @param {Array}      [cssArray]  Array of CSS Files to load (optional)
     */
    setDependency: function(depName, jsArray, cssArray) {
        "use strict";
        this.registry[depName] = {};

        if (jsArray && jsArray instanceof Array) {
            this.registry.js = jsArray;
        }

        if (cssArray && cssArray instanceof Array) {
            this.registry.css = cssArray;
        }
    },

    /**
     * Gets a dependency Object by name
     *
     * @param {string}  dep
     * @returns {{}}
     */
    getDependency: function(dep) {
        "use strict";
        return this.registry[dep];
    },

    /**
     * Add a dependency that has to be loaded
     *
     * @param {Array} dependencyArray  Array of dependency names (has to fit with the registry above)
     */
    add: function(dependencyArray) {
        "use strict";
        for (var i = 0; i < dependencyArray.length; i++) {
            var depName = dependencyArray[i];
            this.usedDeps[depName] = this.registry[depName];
        }

    },

    /**
     * Fetches all external dependencies asyncronally
     *
     * Dependencies to load have to be added first via .add(dependencies)
     * Triggers plastic events (loaded-)
     * Uses {@link https://github.com/rgrove/lazyload/}
     *
     * @todo Dependency Caching?
     */
    fetch: function() {

        "use strict";

        var cssComplete = function() {
            plastic.events.pub('loaded-' + depName + '.css');
        };

        var jsComplete = function() {
            plastic.events.pub('loaded-' + depName);
        };

        for (var depName in this.usedDeps) {

            var urls = this.usedDeps[depName];

            if (urls.test && !window[urls.test]) {
                LazyLoad.css(urls.css, cssComplete, depName);
                LazyLoad.js(urls.js, jsComplete, depName);
            } else {
                jsComplete();
                if (plastic.options.debug) {
                    plastic.msg.log('[GLOBAL] Dependency ' + depName + ' not loaded, it already exists ');
                }
            }

        }
    }

};

plastic.modules.moduleManager = {

    /**
     * Module Registry Object
     *
     * @type {{}}
     */
    modules: {
        api: {},
        data: {},
        display: {},
        query: {}
    },

    parametersSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "moduleType": {"type": "string"},
            "apiName": {"type": "string"},
            "className": {"type": "string"},
            "dependencies": {"type": "array"}
        },
        "required": ["moduleType", "apiName", "className"]
    },

    /**
     * Register Modules to the Registry.
     *
     * Every Module has to register itself here, or it won't be found and exectuted!
     *
     * @param {Object}  paramsObj  ParameterObject
     */
    register: function(paramsObj) {
        "use strict";

        plastic.helper.schemaValidation(this.parametersSchema, paramsObj);

        try {
            this.modules[paramsObj.moduleType][paramsObj.apiName] = paramsObj;
        } catch(e) {
            console.log(e);
            console.error('Wrong usage of Module Registry!');
        }
    },

    /**
     * Gets a Module by Type and Api Name
     *
     * @param moduleType
     * @param apiName
     */
    get: function(moduleType, apiName) {
        "use strict";
        if (this.modules[moduleType] && this.modules[moduleType][apiName]) {
            return this.modules[moduleType][apiName];
        } else {
            return false;
        }
    }


};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'ask-json',
    className: 'AskJson',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.AskJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.dataDescription = {};

    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "query": {
                "type": "object",
                "properties": {
                    "printrequests": {
                        "type": "array",
                        "properties": {
                            "label": {"type": "string"},
                            "typeid": {"type": "string"},
                            "mode": {"type": "number"}
                        },
                        "required": ["label", "typeid"]
                    },
                    "results": {
                        "type": "object",
                        "additionalProperties": {
                            "type": "object",
                            "properties": {
                                "printouts": {"type": "object"},
                                "fulltext": {"type": "string"},
                                "fullurl": {"type": "string"}
                            },
                            "required": ["printouts"]
                        }
                    }
                },
                "required": ["printrequests", "results"]
            }
        },
        "required": ["query"]
    };

    /**
     * Maps ASK-Result-Format Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaMap = {
        "_txt": {
            "type": "string"
        },
        "_ema": {
            "type": "string",
            "format": "email"
        },
        "_tel": {
            "type": "string",
            "format": "phone"
        }
    };


};

plastic.modules.data.AskJson.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {Object}
     */
    execute: function() {

        this.parseSchema();
        this.parseData();

        return this.dataObj;

    },

    parseSchema: function() {
        "use strict";

        if (!this.dataObj.description) {

            var schema = this.dataObj.raw.query.printrequests;

            for (var i = 0; i < schema.length; i++) {

                var o = schema[i];

                var mappedType = this.schemaMap[o.typeid];
                if (mappedType) {
                    this.dataDescription[o.label] = mappedType;
                }

            }

            this.dataObj.description = this.dataDescription;

        }
    },

    parseData: function() {
        "use strict";

        this.dataObj.processed = [];
        var self = this;

        // Parse Data without additional Schema Informations
        for (var obj in this.dataObj.raw.query.results) {
            var row = this.dataObj.raw.query.results[obj];
            this.dataObj.processed.push(row.printouts);
        }

        // Enrich processed data by appling the descriptionSchema to it.
//        this.dataObj.processedHtml = plastic.schemaParser.getHtmlData(this.dataObj.processed, this.descriptionSchema);

    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'default',
    className: 'Default',
    dependencies: []
});
/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.Default = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.dataDescription = {};

    /**
     * Raw Data Schema for validation
     *
     * TODO: Further describe "data" structure
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "data": {
                "type": "array"
            },
            "schema": {
                "type": "object"
            },
            "description": {
                "type": "object"
            }
        },
        "required": ["data"]
    };

};

plastic.modules.data.Default.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {
        this.dataObj.processed = this.dataObj.raw.data;
        return this.dataObj;
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'sparql-json',
    className: 'SparqlJson',
    dependencies: []
});

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @author Simon Heimler
 * @constructor
 */
plastic.modules.data.SparqlJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * SPARQL Result Format Schema
     *
     * @todo: Not 100% done
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "head": {
                "type": "object",
                "properties": {
                    "link": {"type": "array"},
                    "vars": {"type": "array"}
                },
                "required": ["vars"]
            },
            "results": {
                "type": "object",
                "properties": {
                    "bindings": {
                        type: "array",
                        "additionalProperties": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "datatype": {"type": "string"},
                                    "type": {"type": "string"},
                                    "value": {"type": "string"}
                                },
                                "required": ["datatype", "type", "value"]
                            }
                        }
                    },
                    "required": ["bindings"]
                }
            }
        },
        "required": ["head", "results"]
    };

};

plastic.modules.data.SparqlJson.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        this.dataObj.processed = [];

        for (var i = 0; i < this.dataObj.raw.results.bindings.length; i++) {

            this.dataObj.processed[i] = {};

            var row = this.dataObj.raw.results.bindings[i];

            for (var o in row) {
                this.dataObj.processed[i][o] = [];
                this.dataObj.processed[i][o].push(row[o].value);
            }
        }

        return this.dataObj;

    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'discrete-bar-chart',
    className: 'DiscreteBarChart',
    dependencies: ["nvd3"]
});

/**
 * Bar Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.DiscreteBarChart = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {};

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};

    /**
     * Display Element that is rendered
     * @type {{}}
     */
    this.displayEl = undefined;

};

plastic.modules.display.DiscreteBarChart.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function () {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Bar Chart
     *
     * @returns {*}
     */
    execute: function () {



    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};
// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'raw-data',
    className: 'RawData',
    dependencies: []
});

/**
 * Displays the Raw Data (and Schema if provided) as formatted JSON
 *
 * @constructor
 */
plastic.modules.display.RawData = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

};

plastic.modules.display.RawData.prototype = {

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var displayEl = this.$el.find('.plastic-js-display')[0];

        var $displayEl = $(displayEl);

        var html = '<pre class="raw-data">' + JSON.stringify(this.elAttr.data.raw, false, 4) + '</code></pre>';

        $displayEl.html(html);


    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'simple-table',
    className: 'SimpleTable',
    dependencies: ["d3"]
});

/**
 * Table Display Module
 *
 * @constructor
 */
plastic.modules.display.SimpleTable = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {};

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};

    /**
     * Display Element that is rendered
     * @type {{}}
     */
    this.displayEl = undefined;

};

plastic.modules.display.SimpleTable.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var $el = this.$el.find('.plastic-js-display')[0];
        var data = [];

        // Use schema-processed HTML data if available:
        if (this.elAttr.data.processedHtml) {
            data = this.elAttr.data.processedHtml;
        } else {
            data = this.elAttr.data.processed;
        }

        var vis = d3.select($el);

        var table = vis.append("table");
        var thead = table.append("thead");
        var tbody = table.append("tbody");

        // Get Columns from Data
        var columns = [];
        for (var o in data[0]) {
            if (data[0].hasOwnProperty(o)) {
                columns.push(o);
            }
        }

        // Create Header Row (TH)
        thead.append("tr")
            .selectAll("th")
            .data(columns)
            .enter()
            .append("th")
            .text(function(column) {
                return column;
            });

        // Create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(data)
            .enter()
            .append("tr");

        // Create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(row) {
                return columns.map(function(column) {
                    return {
                        column: column,
                        value: row[column].join(', ')
                    };
                });
            })
            .enter()
            .append("td")
            .html(function(d) {
                return d.value;
            });

        // Twitter Bootstrap Classes
        $('table').addClass('table table-condensed simple-table');

        this.displayEl = table;

    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'query',
    apiName: 'application/ask-query',
    className: 'Ask',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.query.Ask = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Ask.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} queryObj
     */
    setQueryObj: function(queryObj) {
        "use strict";

        this.queryObj = queryObj;
    },

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        // Set Data Parser Module
        var dataObj = {
            module: 'ask-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        var queryTrimmed = $.trim(query.replace(/\s+/g, ''));
        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?action=ask&query=' + queryEncoded + '&format=json&callback=?';

        return dataObj;
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'query',
    apiName: 'application/sparql-query',
    className: 'Sparql',
    dependencies: []
});

/**
 * This is a SPARQL Query Parser
 * It turns the Query into a SPARQL Endpoint URL
 *
 * @constructor
 */
plastic.modules.query.Sparql = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Sparql.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} queryObj
     */
    setQueryObj: function(queryObj) {
        "use strict";

        this.queryObj = queryObj;
    },

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        // Set Data Parser Module
        var dataObj = {
            module: 'sparql-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        // Trim all Whitespace
        var queryTrimmed = $.trim(query.replace(/\s+/g, ' '));

        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?query=' + queryEncoded + '&output=json&callback=?';

        return dataObj;

    }

};
