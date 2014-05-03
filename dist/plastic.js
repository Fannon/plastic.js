/*! plastic - v0.0.4 - 2014-05-03
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
/*jshint -W079 */ // Ignores Redefinition of plastic

/**
 * plastic.js Namespace
 *
 * @namespace
 */
var plastic = {

    /** type String */
    version: '0.0.4',

    /**
     * This holds all the plastic jQuery elements
     * @type Array
     */
    elements: [],

    /**
     * plastic.js modules
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules
         * @namespace
         */
        query: {},

        /**
         * API Parser Modules
         * @namespace
         */
        api: {},

        /**
         * Data Parser Modules
         * @namespace
         */
        data: {},

        /**
         * Display Modules
         * @namespace
         */
        display: {}

    },

    /**
     * Helper Functions
     * @namespace
     */
    helper: {}


};

plastic.run = function() {
    "use strict";

    console.info('plastic.js version v' + plastic.version);

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    plastic.elements = $('plastic, .plastic-js');

    // Iterate all plastic.js elements on the page
    plastic.elements.each(function() {

        var el = $(this);

        plastic.elements.push(new plastic.Element(el));

        try {

        } catch(e) {
            console.error('plastic.js Element Crash');
        }

    });
};

$(document).ready(function() {
    plastic.run();
});

// yepnope.js
// Version - 1.5.4pre
//
// by
// Alex Sexton - @SlexAxton - AlexSexton[at]gmail.com
// Ralph Holzmann - @ralphholzmann - ralphholzmann[at]gmail.com
//
// http://yepnopejs.com/
// https://github.com/SlexAxton/yepnope.js/
//
// Tri-license - WTFPL | MIT | BSD
//
// Please minify before use.
// Also available as Modernizr.load via the Modernizr Project
//
( function ( window, doc, undef ) {

var docElement            = doc.documentElement,
    sTimeout              = window.setTimeout,
    firstScript           = doc.getElementsByTagName( "script" )[ 0 ],
    toString              = {}.toString,
    execStack             = [],
    started               = 0,
    noop                  = function () {},
    // Before you get mad about browser sniffs, please read:
    // https://github.com/Modernizr/Modernizr/wiki/Undetectables
    // If you have a better solution, we are actively looking to solve the problem
    isGecko               = ( "MozAppearance" in docElement.style ),
    isGeckoLTE18          = isGecko && !! doc.createRange().compareNode,
    insBeforeObj          = isGeckoLTE18 ? docElement : firstScript.parentNode,
    // Thanks to @jdalton for showing us this opera detection (by way of @kangax) (and probably @miketaylr too, or whatever...)
    isOpera               = window.opera && toString.call( window.opera ) == "[object Opera]",
    isIE                  = !! doc.attachEvent && !isOpera,
    strJsElem             = isGecko ? "object" : isIE  ? "script" : "img",
    strCssElem            = isIE ? "script" : strJsElem,
    isArray               = Array.isArray || function ( obj ) {
      return toString.call( obj ) == "[object Array]";
    },
    isObject              = function ( obj ) {
      return Object(obj) === obj;
    },
    isString              = function ( s ) {
      return typeof s == "string";
    },
    isFunction            = function ( fn ) {
      return toString.call( fn ) == "[object Function]";
    },
    globalFilters         = [],
    scriptCache           = {},
    prefixes              = {
      // key value pair timeout options
      timeout : function( resourceObj, prefix_parts ) {
        if ( prefix_parts.length ) {
          resourceObj['timeout'] = prefix_parts[ 0 ];
        }
        return resourceObj;
      }
    },
    handler,
    yepnope;

  /* Loader helper functions */
  function isFileReady ( readyState ) {
    // Check to see if any of the ways a file can be ready are available as properties on the file's element
    return ( ! readyState || readyState == "loaded" || readyState == "complete" || readyState == "uninitialized" );
  }


  // Takes a preloaded js obj (changes in different browsers) and injects it into the head
  // in the appropriate order
  function injectJs ( src, cb, attrs, timeout, /* internal use */ err, internal ) {
    var script = doc.createElement( "script" ),
        done, i;

    timeout = timeout || yepnope['errorTimeout'];

    script.src = src;

    // Add our extra attributes to the script element
    for ( i in attrs ) {
        script.setAttribute( i, attrs[ i ] );
    }

    cb = internal ? executeStack : ( cb || noop );

    // Bind to load events
    script.onreadystatechange = script.onload = function () {

      if ( ! done && isFileReady( script.readyState ) ) {

        // Set done to prevent this function from being called twice.
        done = 1;
        cb();

        // Handle memory leak in IE
        script.onload = script.onreadystatechange = null;
      }
    };

    // 404 Fallback
    sTimeout(function () {
      if ( ! done ) {
        done = 1;
        // Might as well pass in an error-state if we fire the 404 fallback
        cb(1);
      }
    }, timeout );

    // Inject script into to document
    // or immediately callback if we know there
    // was previously a timeout error
    err ? script.onload() : firstScript.parentNode.insertBefore( script, firstScript );
  }

  // Takes a preloaded css obj (changes in different browsers) and injects it into the head
  function injectCss ( href, cb, attrs, timeout, /* Internal use */ err, internal ) {

    // Create stylesheet link
    var link = doc.createElement( "link" ),
        done, i;

    timeout = timeout || yepnope['errorTimeout'];

    cb = internal ? executeStack : ( cb || noop );

    // Add attributes
    link.href = href;
    link.rel  = "stylesheet";
    link.type = "text/css";

    // Add our extra attributes to the link element
    for ( i in attrs ) {
      link.setAttribute( i, attrs[ i ] );
    }

    if ( ! err ) {
      firstScript.parentNode.insertBefore( link, firstScript );
      sTimeout(cb, 0);
    }
  }

  function executeStack ( ) {
    // shift an element off of the stack
    var i   = execStack.shift();
    started = 1;

    // if a is truthy and the first item in the stack has an src
    if ( i ) {
      // if it's a script, inject it into the head with no type attribute
      if ( i['t'] ) {
        // Inject after a timeout so FF has time to be a jerk about it and
        // not double load (ignore the cache)
        sTimeout( function () {
          (i['t'] == "c" ?  yepnope['injectCss'] : yepnope['injectJs'])( i['s'], 0, i['a'], i['x'], i['e'], 1 );
        }, 0 );
      }
      // Otherwise, just call the function and potentially run the stack
      else {
        i();
        executeStack();
      }
    }
    else {
      // just reset out of recursive mode
      started = 0;
    }
  }

  function preloadFile ( elem, url, type, splicePoint, dontExec, attrObj, timeout ) {

    timeout = timeout || yepnope['errorTimeout'];

    // Create appropriate element for browser and type
    var preloadElem = doc.createElement( elem ),
        done        = 0,
        firstFlag   = 0,
        stackObject = {
          "t": type,     // type
          "s": url,      // src
        //r: 0,        // ready
          "e": dontExec,// set to true if we don't want to reinject
          "a": attrObj,
          "x": timeout
        };

    // The first time (common-case)
    if ( scriptCache[ url ] === 1 ) {
      firstFlag = 1;
      scriptCache[ url ] = [];
    }

    function onload ( first ) {
      // If the script/css file is loaded
      if ( ! done && isFileReady( preloadElem.readyState ) ) {

        // Set done to prevent this function from being called twice.
        stackObject['r'] = done = 1;

        ! started && executeStack();

        // Handle memory leak in IE
        preloadElem.onload = preloadElem.onreadystatechange = null;
        if ( first ) {
          if ( elem != "img" ) {
            sTimeout(function(){ insBeforeObj.removeChild( preloadElem ) }, 50);
          }

          for ( var i in scriptCache[ url ] ) {
            if ( scriptCache[ url ].hasOwnProperty( i ) ) {
              scriptCache[ url ][ i ].onload();
            }
          }
        }
      }
    }


    // Setting url to data for objects or src for img/scripts
    if ( elem == "object" ) {
      preloadElem.data = url;
    } else {
      preloadElem.src = url;

      // Setting bogus script type to allow the script to be cached
      preloadElem.type = elem;
    }

    // Don't let it show up visually
    preloadElem.width = preloadElem.height = "0";

    // Attach handlers for all browsers
    preloadElem.onerror = preloadElem.onload = preloadElem.onreadystatechange = function(){
      onload.call(this, firstFlag);
    };
    // inject the element into the stack depending on if it's
    // in the middle of other scripts or not
    execStack.splice( splicePoint, 0, stackObject );

    // The only place these can't go is in the <head> element, since objects won't load in there
    // so we have two options - insert before the head element (which is hard to assume) - or
    // insertBefore technically takes null/undefined as a second param and it will insert the element into
    // the parent last. We try the head, and it automatically falls back to undefined.
    if ( elem != "img" ) {
      // If it's the first time, or we've already loaded it all the way through
      if ( firstFlag || scriptCache[ url ] === 2 ) {
        insBeforeObj.insertBefore( preloadElem, isGeckoLTE18 ? null : firstScript );

        // If something fails, and onerror doesn't fire,
        // continue after a timeout.
        sTimeout( onload, timeout );
      }
      else {
        // instead of injecting, just hold on to it
        scriptCache[ url ].push( preloadElem );
      }
    }
  }

  function load ( resource, type, dontExec, attrObj, timeout ) {
    // If this method gets hit multiple times, we should flag
    // that the execution of other threads should halt.
    started = 0;

    // We'll do 'j' for js and 'c' for css, yay for unreadable minification tactics
    type = type || "j";
    if ( isString( resource ) ) {
      // if the resource passed in here is a string, preload the file
      preloadFile( type == "c" ? strCssElem : strJsElem, resource, type, this['i']++, dontExec, attrObj, timeout );
    } else {
      // Otherwise it's a callback function and we can splice it into the stack to run
      execStack.splice( this['i']++, 0, resource );
      execStack.length == 1 && executeStack();
    }

    // OMG is this jQueries? For chaining...
    return this;
  }

  // return the yepnope object with a fresh loader attached
  function getYepnope () {
    var y = yepnope;
    y['loader'] = {
      "load": load,
      "i" : 0
    };
    return y;
  }

  /* End loader helper functions */
  // Yepnope Function
  yepnope = function ( needs ) {

    var i,
        need,
        // start the chain as a plain instance
        chain = this['yepnope']['loader'];

    function satisfyPrefixes ( url ) {
      // split all prefixes out
      var parts   = url.split( "!" ),
      gLen    = globalFilters.length,
      origUrl = parts.pop(),
      pLen    = parts.length,
      res     = {
        "url"      : origUrl,
        // keep this one static for callback variable consistency
        "origUrl"  : origUrl,
        "prefixes" : parts
      },
      mFunc,
      j,
      prefix_parts;

      // loop through prefixes
      // if there are none, this automatically gets skipped
      for ( j = 0; j < pLen; j++ ) {
        prefix_parts = parts[ j ].split( '=' );
        mFunc = prefixes[ prefix_parts.shift() ];
        if ( mFunc ) {
          res = mFunc( res, prefix_parts );
        }
      }

      // Go through our global filters
      for ( j = 0; j < gLen; j++ ) {
        res = globalFilters[ j ]( res );
      }

      // return the final url
      return res;
    }

    function getExtension ( url ) {
        return url.split(".").pop().split("?").shift();
    }

    function loadScriptOrStyle ( input, callback, chain, index, testResult ) {
      // run through our set of prefixes
      var resource     = satisfyPrefixes( input ),
          autoCallback = resource['autoCallback'],
          extension    = getExtension( resource['url'] );

      // if no object is returned or the url is empty/0 just exit the load
      if ( resource['bypass'] ) {
        return;
      }

      // Determine callback, if any
      if ( callback ) {
        callback = isFunction( callback ) ?
          callback :
          callback[ input ] ||
          callback[ index ] ||
          callback[ ( input.split( "/" ).pop().split( "?" )[ 0 ] ) ];
      }

      // if someone is overriding all normal functionality
      if ( resource['instead'] ) {
        return resource['instead']( input, callback, chain, index, testResult );
      }
      else {
        // Handle if we've already had this url and it's completed loaded already
        if ( scriptCache[ resource['url'] ] ) {
          // don't let this execute again
          resource['noexec'] = true;
        }
        else {
          scriptCache[ resource['url'] ] = 1;
        }

        // Throw this into the queue
        chain.load( resource['url'], ( ( resource['forceCSS'] || ( ! resource['forceJS'] && "css" == getExtension( resource['url'] ) ) ) ) ? "c" : undef, resource['noexec'], resource['attrs'], resource['timeout'] );

        // If we have a callback, we'll start the chain over
        if ( isFunction( callback ) || isFunction( autoCallback ) ) {
          // Call getJS with our current stack of things
          chain['load']( function () {
            // Hijack yepnope and restart index counter
            getYepnope();
            // Call our callbacks with this set of data
            callback && callback( resource['origUrl'], testResult, index );
            autoCallback && autoCallback( resource['origUrl'], testResult, index );

            // Override this to just a boolean positive
            scriptCache[ resource['url'] ] = 2;
          } );
        }
      }
    }

    function loadFromTestObject ( testObject, chain ) {
        var testResult = !! testObject['test'],
            group      = testResult ? testObject['yep'] : testObject['nope'],
            always     = testObject['load'] || testObject['both'],
            callback   = testObject['callback'] || noop,
            cbRef      = callback,
            complete   = testObject['complete'] || noop,
            needGroupSize,
            callbackKey;

        // Reusable function for dealing with the different input types
        // NOTE:: relies on closures to keep 'chain' up to date, a bit confusing, but
        // much smaller than the functional equivalent in this case.
        function handleGroup ( needGroup, moreToCome ) {
          if ( ! needGroup ) {
            // Call the complete callback when there's nothing to load.
            ! moreToCome && complete();
          }
          // If it's a string
          else if ( isString( needGroup ) ) {
            // if it's a string, it's the last
            if ( !moreToCome ) {
              // Add in the complete callback to go at the end
              callback = function () {
                var args = [].slice.call( arguments );
                cbRef.apply( this, args );
                complete();
              };
            }
            // Just load the script of style
            loadScriptOrStyle( needGroup, callback, chain, 0, testResult );
          }
          // See if we have an object. Doesn't matter if it's an array or a key/val hash
          // Note:: order cannot be guaranteed on an key value object with multiple elements
          // since the for-in does not preserve order. Arrays _should_ go in order though.
          else if ( isObject( needGroup ) ) {
            // I hate this, but idk another way for objects.
            needGroupSize = (function(){
              var count = 0, i
              for (i in needGroup ) {
                if ( needGroup.hasOwnProperty( i ) ) {
                  count++;
                }
              }
              return count;
            })();

            for ( callbackKey in needGroup ) {
              // Safari 2 does not have hasOwnProperty, but not worth the bytes for a shim
              // patch if needed. Kangax has a nice shim for it. Or just remove the check
              // and promise not to extend the object prototype.
              if ( needGroup.hasOwnProperty( callbackKey ) ) {
                // Find the last added resource, and append to it's callback.
                if ( ! moreToCome && ! ( --needGroupSize ) ) {
                  // If this is an object full of callbacks
                  if ( ! isFunction( callback ) ) {
                    // Add in the complete callback to go at the end
                    callback[ callbackKey ] = (function( innerCb ) {
                      return function () {
                        var args = [].slice.call( arguments );
                        innerCb && innerCb.apply( this, args );
                        complete();
                      };
                    })( cbRef[ callbackKey ] );
                  }
                  // If this is just a single callback
                  else {
                    callback = function () {
                      var args = [].slice.call( arguments );
                      cbRef.apply( this, args );
                      complete();
                    };
                  }
                }
                loadScriptOrStyle( needGroup[ callbackKey ], callback, chain, callbackKey, testResult );
              }
            }
          }
        }

        // figure out what this group should do
        handleGroup( group, !!always );

        // Run our loader on the load/both group too
        // the always stuff always loads second.
        always && handleGroup( always );
    }

    // Someone just decides to load a single script or css file as a string
    if ( isString( needs ) ) {
      loadScriptOrStyle( needs, 0, chain, 0 );
    }
    // Normal case is likely an array of different types of loading options
    else if ( isArray( needs ) ) {
      // go through the list of needs
      for( i = 0; i < needs.length; i++ ) {
        need = needs[ i ];

        // if it's a string, just load it
        if ( isString( need ) ) {
          loadScriptOrStyle( need, 0, chain, 0 );
        }
        // if it's an array, call our function recursively
        else if ( isArray( need ) ) {
          yepnope( need );
        }
        // if it's an object, use our modernizr logic to win
        else if ( isObject( need ) ) {
          loadFromTestObject( need, chain );
        }
      }
    }
    // Allow a single object to be passed in
    else if ( isObject( needs ) ) {
      loadFromTestObject( needs, chain );
    }
  };

  // This publicly exposed function is for allowing
  // you to add functionality based on prefixes on the
  // string files you add. 'css!' is a builtin prefix
  //
  // The arguments are the prefix (not including the !) as a string
  // and
  // A callback function. This function is passed a resource object
  // that can be manipulated and then returned. (like middleware. har.)
  //
  // Examples of this can be seen in the officially supported ie prefix
  yepnope['addPrefix'] = function ( prefix, callback ) {
    prefixes[ prefix ] = callback;
  };

  // A filter is a global function that every resource
  // object that passes through yepnope will see. You can
  // of course conditionally choose to modify the resource objects
  // or just pass them along. The filter function takes the resource
  // object and is expected to return one.
  //
  // The best example of a filter is the 'autoprotocol' officially
  // supported filter
  yepnope['addFilter'] = function ( filter ) {
    globalFilters.push( filter );
  };

  // Default error timeout to 10sec - modify to alter
  yepnope['errorTimeout'] = 1e4;

  // Webreflection readystate hack
  // safe for jQuery 1.4+ ( i.e. don't use yepnope with jQuery 1.3.2 )
  // if the readyState is null and we have a listener
  if ( doc.readyState == null && doc.addEventListener ) {
    // set the ready state to loading
    doc.readyState = "loading";
    // call the listener
    doc.addEventListener( "DOMContentLoaded", handler = function () {
      // Remove the listener
      doc.removeEventListener( "DOMContentLoaded", handler, 0 );
      // Set it to ready
      doc.readyState = "complete";
    }, 0 );
  }

  // Attach loader &
  // Leak it
  window['yepnope'] = getYepnope();

  // Exposing executeStack to better facilitate plugins
  window['yepnope']['executeStack'] = executeStack;
  window['yepnope']['injectJs'] = injectJs;
  window['yepnope']['injectCss'] = injectCss;

})( this, document );

/**
 * plastic.js (default) general ptions
 * Written in JSON Notation
 *
 * @namespace
 * @type {Object}
 */
plastic.options = {

    /** Debug Mode @type {boolean} */
    debug: true,

    /** Width of Canvas, if not given {string} */
    width: '100%'
};

plastic.Element = function(el) {

    /**
     * DOM Element
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js ElementAttibutes Object (Instance)
     * @type {plastic.ElementAttributes}
     */
    this.attributes = new plastic.ElementAttributes(el);

    /**
     * Link to Attributes Object
     * If you need easy access to the current Attributes Object, use this.
     * @type {{}}
     */
    this.attr = this.attributes.attr;

    this.queryModule = false;
    this.dataModule = false;
    this.displayModule = false;

    this.process(this.el, this.attr);

};

plastic.Element.prototype = {

    /**
     * Get DOM Element within PlasticElement Container
     * @returns {Object}
     */
    getEl:function() {
        return this.el;
    },

    /**
     * Get DOM Element within PlasticElement Container
     * @param el
     */
    setEl:function(el) {
        this.el = el;
    },

    /**
     * Get plastic.js Element Attributes
     * @returns {Object}
     */
    getAttr:function() {
        return this.attr;
    },

    /**
     * TODO: Introduce Error State: Stop further Processing if there are Exceptions
     *
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    process: function(el, elAttr) {

        console.info('plastic.processElement();');

        /** Asynchronous Mode */
        var async = false;
        var error = false;
        var request;
        var self = this;

        this.createMsgContainer(el);
        this.createDisplayContainer(el);


        //////////////////////////////////////////
        // CALLING QUERY PARSER                 //
        //////////////////////////////////////////

        if (elAttr.query) { // OPTIONAL
            elAttr = this.callQueryParser(el, elAttr);
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (elAttr.data && elAttr.data.url) { // OPTIONAL: Get Data asyncronally from URL (if given)

            var start = (new Date()).getTime();
            async = true;

            console.log('Getting Data from URL via AJAX: ' + elAttr.data.url);

            request = $.getJSON(elAttr.data.url)
                .done(function(data) {
                    try {
                        if (data !== null && typeof data === 'object') {
                            elAttr.data.raw = data;
                        } else {
                            elAttr.data.raw = $.parseJSON(data);
                        }
                    } catch(e) {
                        plastic.msg(e, 'error', el);
                    }

                })
                .fail(function() {
                    plastic.msg('Could not get Data from URL <a href="' + elAttr.data.url + '">' + elAttr.data.url + '</a>', "error", el );
                    error = true;
                })
                .always(function() {
                    var diff = (new Date()).getTime() - start;
                    console.log("Request completed in " + diff + 'ms');
                })
            ;

        }



        //////////////////////////////////////////
        // CALLING THE DATA & DISPLAX MODULE    //
        //////////////////////////////////////////

        if (async) {

            // On Request complete
            request.complete(function(data) {

                console.log('Received asynchronous data.');

                if (!error) {
                    self.callDataParser(el, elAttr);
                }
                if (!error) {
                    self.callDisplayModule(el, elAttr);
                }
            });

        } else {

            console.log('Received Synchronous Data');

            if (!error) {
                self.callDataParser(el, elAttr);
            }
            if (!error) {
                self.callDisplayModule(el, elAttr);
            }

        }


    },

    createMsgContainer: function(el) {
        "use strict";

        el.css('position', 'relative');

        el.append('<div class="plastic-js-msg"></div>');
        var msgEl = el.find('.plastic-js-msg');
        msgEl
            .height(el.height())
            .width(el.width())
        ;
    },

    createDisplayContainer: function(el) {
        "use strict";
        console.info('plastic.prepareCanvas();');

        el.append('<div class="plastic-js-display"></div>');
        var displayEl = el.find('.plastic-js-display');
        displayEl
            .height(el.height())
            .width(el.width())
        ;
    },

    /**
     * Helper Function to call the Query Parser Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callQueryParser: function(el, elAttr) {

        console.info('processElement.callQueryParser(); ' + elAttr.query.type);

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('query',[elAttr.query.type]);
        var Module = plastic.modules.query[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            this.queryModule = new Module(elAttr.query);
            this.validateModule(this.queryModule, elAttr.query);
            elAttr.data = this.queryModule.parse();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Query Parser Module ' + elAttr.query.type + ' not found.', 'error', el);
        }

        return elAttr;

    },

    /**
     * Helper Function to call the Data Parser Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDataParser: function(el, elAttr) {

        console.info('processElement.callDataParser()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('data',[elAttr.data.parser]);
        var Module = plastic.modules.data[moduleInfo.className];

        if (Module) {

            console.log('Using Parser: ' + moduleInfo.className);

            console.dir(elAttr);

            this.dataModule = new Module(elAttr.data);
            this.validateModule(this.dataModule, elAttr.data.raw);
            elAttr.data = this.dataModule.parse();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Data Parser Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }

    },

    /**
     * Helper Function to call the Display Module
     * @param {{}} el       plastic.js DOM Element
     * @param {{}} elAttr   ElementAttributes Object
     */
    callDisplayModule: function(el, elAttr) {

        console.info('plastic.Element.callDisplayModule()');

        // Look for data parser module in the registry
        var moduleInfo = plastic.modules.registry.get('display',[elAttr.options.display.module]);
        var Module = plastic.modules.display[moduleInfo.className];

        if (Module) {

            console.log('Using Display Module: ' + moduleInfo.className);

            // @todo: Manage Dependencies

            this.displayModule = new Module(el, elAttr);
            this.validateModule(this.displayModule, elAttr.options.display);
            this.displayModule.render();

            // TODO: Try 'n' Catch

        } else {
            plastic.msg('Display Module ' + elAttr.data.parser + ' not found.', 'error', el);
        }


    },

    /**
     * Validation Helper Function
     *
     * This calls two kinds of validations:
     * * General Validation: Validates custom Logic
     * * Schema Validation: Validates the Data Structure of the incoming data
     *
     * @param {{}} module   plastic.js Module
     * @param {{}} data     Data Object that is to be validated
     */
    validateModule: function(module, data) {

        if (module.validate) {
            var validationErrors = module.validate();

            // validation was successful
            if (validationErrors) {
                console.dir(validationErrors);
                throw new Error('Validation Error!');
            }
        }

        if (module.validationSchema) {

            console.log('Schema Validation');

            var env = jjv();
            env.addSchema('data', module.validationSchema);
            var schemaErrors = env.validate('data', data);

            // validation was successful
            if (schemaErrors) {
                console.dir(schemaErrors);
                throw new Error('Data Structure invalid!');
            }
        }
    }

};

plastic.ElementAttributes = function(el) {

    /**
     * plastic.js DOM Element
     * @type {{}}
     */
    this.el = el;

    /**
     * plastic.js Element Attributes
     * @type {Object}
     */
    this.attr = this.parseAttr(el);

    // Validate the final Attributes Object
    this.validate(this.attr);
};

plastic.ElementAttributes.prototype = {

    /**
     * Gets current Attribute Object
     *
     * @returns {Object}
     */
    getAttr: function() {
        "use strict";
        return this.attr;
    },

    /**
     * Parses all Attributes of the plastic.js element
     *
     * @param {Object} [el]     Plastic.js DOM Element
     * @returns {Object}
     */
    parseAttr: function(el) {
        "use strict";

        console.info('plastic.getElementAttributes();');

        /**
         * ElementAttributes Object.
         * This contains all information that is read from the plastic HTML element
         */
        var elAttr = {};

        elAttr.style = this.getStyle(el);

        elAttr.options = this.getOptions(el);

        var queryAttr = this.getQuery(el);
        if (queryAttr) {
            elAttr.query = queryAttr;
        }

        var schemaAttr = this.getSchema(el);
        if (schemaAttr) {
            elAttr.schema = schemaAttr;
        }

        var dataAttr = this.getData(el);
        if (dataAttr) {
            elAttr.data = dataAttr;
        }

        console.log(elAttr);
        return elAttr;
    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getStyle: function(el) {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        var style = {};

        style.height = el.height();
        style.width = el.width();

        return style;
    },

    /**
     * Gets all Option Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getOptions: function(el) {
        "use strict";
        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?

            if (optionsString && optionsString !== '') {

                try {
                    options = $.parseJSON(optionsString);
                    return options;

                } catch(e) {
                    plastic.msg('Invalid JSON in the Options Object!');
                    return false;
                }

            } else {
                plastic.msg('Empty Obptions Element!', 'error', el);
                return false;
            }

        } else {
            plastic.msg('No options provided!', 'error', el);
            return false;
        }
    },

    /**
     * Gets all Query Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getQuery: function(el) {
        "use strict";
        var queryElement = el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            var query = {};

            query.url = queryElement.attr('data-query-url');
            query.type = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                query.text = queryString;
                return query;
            } else {
                plastic.msg('Empty Query Element!', 'error', el);
                return false;
            }

        }
    },

    /**
     * Gets all Schema Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getSchema: function(el) {
        "use strict";
        // Get Data-URL
        var schemaElement = el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            /** Element Schema Data */
            var schema = {};

            schema.type = schemaElement.attr('data-schema-format');

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                schema.text = $.parseJSON(schemaString);
                return schema;
            } else {
                plastic.msg('Empty Schema Element!', 'error', el);
                return false;
            }

        }
    },

    /**
     * Gets all Data Attributes
     *
     * @param {{}} el   plastic.js DOM element
     * @returns {Object|boolean}
     */
    getData: function(el) {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.parser = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {
                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.msg('Empty Data Element!', 'error', el);
                }
            }

            return data;

        } else {
            return false;
        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     * @param {{}} attr ElementAttributes
     * @returns {Object|boolean}
     */
    validate: function(attr) {
        "use strict";

        /**
         * JSON Schema for validation
         *
         * @url http://json-schema.org/
         * @type {{}}
         */
        var schema = {
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
                    "type": "object",
                    "properties": {
                        "general": {
                            type: "object"
                        },
                        "display": {
                            "type": "object",
                            "properties": {
                                "module": {"type": "string"},
                                "options": {"type": "object"}
                            },
                            required: ['module', "options"]
                        }
                    },
                    "required": ["general", "display"]
                },
                "query": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string"},
                        "type": {"type": "string"},
                        "url": {"type": "string"}
                    },
                    "required": ["text", "type", "url"]
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "text": {"type": "string"}
                    },
                    "required": ["text"]
                },
                "data": {
                    "type": "object",
                    "properties": {
                        "parser": {"type": "string"},
                        "raw": {"type": ["object", "array", "string"]},
                        "processed": {"type": "array"},
                        "url": {"type": "string"}
                    },
                    // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                    "required": ["parser"] }
            },
            "required": ["style", "options"]
        };

        var env = jjv();
        env.addSchema('schema', schema);
        var errors = env.validate('schema', attr);

        // validation was successful
        if (errors) {
            console.dir(errors);
            throw new Error('Data Structure invalid!');
        } else {
            return true;
        }
    }


};

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

        el.find('.plastic-js-msg').append('<div class="plastic-msg plastic-msg-error"><strong>' + type.toUpperCase() + ':</strong> ' + msg + '</div>');
    };

    return message;

})();

