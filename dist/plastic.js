/*! plastic - v0.0.1 - 2014-04-24
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
/*jshint -W079 */ // Ignores Redefinition of plastic

var plastic = (function () {

    /**
     * Bootstrap plastic.js
     */
    $(document).ready(function() {

        // Get all <plastic> elements on the page and store them as jQuery DOM Objects
        plastic.elements = $('plastic, .plastic-js');

        // Iterate all <plastic> Elements
        plastic.elements.each(function() {

            // Get Element Data
            var elData = plastic.getElementData($(this));

            // Process this Element
            plastic.processElement($(this), elData);

        });

    });


    /**
     * Reveal public pointers to private functions and properties
     */
    return {

        version: '0.0.3', // semver

        /** This holds all the plastic jQuery elements */
        elements: [],

        /** Namespace for all plastic modules */
        modules: {

            /** Data Parser Namespace */
            dataParser: {},

            /** Data Parser Namespace */
            queryParser: {},

            /** Data Parser Namespace */
            schemaParser: {},

            /** Display Modules Namespace */
            display: {}

        },

        /** Helper Functions Namespace */
        helper: {}


    };

})();


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
 * Plastic.js (default) Options
 * Written in JSON Notation
 *
 * @type {{}}
 */
plastic.options = {
    width: '100%'
};

plastic.callDisplay = function(elData, $el) {

    console.info('callDisplay');
    console.dir(elData);

    plastic.prepareCanvas($el);

    var displayModule = plastic.modules.display.registry[elData.options.display].fileName;

    if (displayModule) {
        plastic.modules.display[displayModule](elData);
    } else {
        plastic.helper.msg('Display Module not found!', 'error');
    }


};

plastic.callParseData = function(elData) {

    console.info('PARSING DATA');
    console.dir(elData);

    // Look for data parser module in the registry
    var parser = plastic.modules.dataParser.registry[elData.options.dataFormat].fileName;
    console.msg('Using Parser: ' + parser);

    if (parser) {
        plastic.modules.dataParser[parser].validate(elData.rawData);
        elData.data = plastic.modules.dataParser[parser].parse(elData.rawData);

        plastic.callDisplay(elData);
    } else {
        plastic.helper.msg('Parser Module not found!', 'error');
    }



};

// TODO!

// TODO!

plastic.getElementData = function(el) {

    console.info('plastic.getElementData();');


    /**
     * Element Data Object.
     * This contains all information that is read from the plastic HTML element
     */
    var elData = {};


    //////////////////////////////////////////
    // GET ELEMENT STYLE                    //
    //////////////////////////////////////////

    // TODO: Case handling if size was not defined (could be 0 height)

    /** Element CSS Style (Contains Width and Height) */
    elData.style = {};

    elData.style.height = el.height();
    elData.style.width = el.width();


    //////////////////////////////////////////
    // GET OPTIONS DATA                     //
    //////////////////////////////////////////

    /** Element Options */
    elData.options = {}; // mandatory!

    var optionsObject = el.find(".plastic-options");
    plastic.o = optionsObject;


    if (optionsObject.length > 0) {

        var optionsString = optionsObject[0].text; // TODO: Or .innerText in some cases?
//        console.log(optionsString);

        if (optionsString && optionsString !== '') {

            try {
                elData.options = $.parseJSON(optionsString);
            } catch(e) {
                plastic.helper.msg('Invalid JSON in the Options Object!');
            }

        } else {
            plastic.helper.msg('Empty Obptions Element!', 'error', el);
        }
    } else {
        plastic.helper.msg('No options provided!', 'error', el);
    }


    //////////////////////////////////////////
    // GET QUERY DATA                       //
    //////////////////////////////////////////

    // Get Data-URL
    var queryElement = el.find(".plastic-query");

    if (queryElement.length > 0)  {

        /** Element Query Data */
        elData.query = {};

        elData.query.url = queryElement.attr('data-query-url');
        elData.query.type = queryElement.attr('type');

        var queryString = queryElement[0].text;

        if (queryString && queryString !== '') {
            elData.query.text = $.parseJSON(queryString);
        } else {
            plastic.helper.msg('Empty Query Element!', 'error', el);
        }

    }



    //////////////////////////////////////////
    // GET DATA DATA                        //
    //////////////////////////////////////////

    // Get Data-URL
    var dataElement = el.find(".plastic-data");

    if (dataElement.length > 0) {

        /** Element Data */
        elData.data = {};

        elData.data.url = dataElement.attr('data-url');
        elData.data.parser = dataElement.attr('data-format');

        // If no Data URL given, read Data Object
        if (!elData.data.url) {

            var dataString = dataElement[0].text;
            console.msg(dataString);
            if (dataString && dataString !== '') {
                elData.data.object = $.parseJSON(dataString);
            } else {
                plastic.helper.msg('Empty Data Element!', 'error', el);
            }

        }

    }



    //////////////////////////////////////////
    // GET SCHEMA DATA                      //
    //////////////////////////////////////////

    // Get Data-URL
    var schemaElement = el.find(".plastic-schema");

    if (queryElement.length > 0)  {

        /** Element Schema Data */
        elData.schema = {};

        elData.schema.type = schemaElement.attr('data-schema-format');

        var schemaString = schemaElement[0].text;

        if (schemaString && schemaString !== '') {
            elData.schema.text = $.parseJSON(schemaString);
        } else {
            plastic.helper.msg('Empty Schema Element!', 'error', el);
        }

    }


    //////////////////////////////////////////
    // RETURN ELEMENT DATA                  //
    //////////////////////////////////////////

    console.dir(elData);
    return elData;


};

plastic.prepareCanvas = function(el) {
    console.info('PREPARING VISUALISATION');

    el.append('<div id="vis"></div>');
    $('#vis')
        .height(el.height())
        .width(el.width())
        .css('overflow', 'scroll')
        .css('padding', '5px')
    ;

};

plastic.processElement = function($el, elData) {

    var async = false;
    var request;


    if (elData.dataUrl) { // Get Data from URL if given

        async = true;


        request = $.ajax(elData.dataUrl)
            .fail(function() {
                plastic.helper.msg('Could not get Data from URL ' + elData.dataUrl, "error", $el );
            })
            .always(function() { });

    }


    if (!async) {
        console.msg('Received Synchronous Data');
        plastic.callParseData(elData);
    } else {
        request.done(function(data) {

            // TODO: Prüfen ob data schon Objekt ist oder noch erst JSON.parsed werden muss
            console.msg('Getting Data from URL via AJAX');

            try {
                if (data !== null && typeof data === 'object') {
                    elData.rawData = data;
                } else {
                    elData.rawData = $.parseJSON(data);
                }
            } catch(e) {
                console.error(e);
            }

            console.msg('Received asynchronous data.');

            plastic.callParseData(elData);
        });
    }

}
// TODO
plastic.modules.dataParser.registry = {
    "default": {
        fileName: "default", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "Default data format",
        dependencies: []
    },
    "sparql-json": {
        fileName: "sparqlJson",
        humanReadableName: "SPARQL JSON",
        dependencies: []
    }

}
// This will parse the default plastic.js data-format.

// TODO: This is not implemented yet
// TODO: Decide how the default data format should look like

plastic.modules.dataParser.sparqlJson = (function () {

    var validate = function(data) {
        return true;
    };

    var parse = function(data) {

        var success = validate(data);

        console.info('PARSING DATA VIA: SPARQL JSON');
        console.dir(data);

        var processedData = [];

        for (var i = 0; i < data.results.bindings.length; i++) {

            processedData[i] = {};

            var row = data.results.bindings[i];

            for (var o in row) {
                processedData[i][o] = row[o].value;
            }
        }

        console.dir(processedData);

        return processedData;

    };


    return {
        validate: validate,
        parse: parse
    };

})();

plastic.modules.queryParser.registry = {
    "plication/sparql-query": {
        fileName: "sparql", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "SPARQL Query Parser",
        dependencies: []
    }
}

plastic.modules.queryParser.sparql = function(elData) {

//    var url = elData.data.url

//    http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=PREFIX+owl%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2002%2F07%2Fowl%23%3E%0D%0APREFIX+xsd%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0D%0APREFIX+rdfs%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0D%0APREFIX+rdf%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%3E%0D%0APREFIX+foaf%3A+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2F%3E%0D%0APREFIX+dc%3A+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%3E%0D%0APREFIX+%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F%3E%0D%0APREFIX+dbpedia2%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fproperty%2F%3E%0D%0APREFIX+dbpedia%3A+%3Chttp%3A%2F%2Fdbpedia.org%2F%3E%0D%0APREFIX+skos%3A+%3Chttp%3A%2F%2Fwww.w3.org%2F2004%2F02%2Fskos%2Fcore%23%3E%0D%0APREFIX+dbo%3A+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2F%3E%0D%0A%0D%0ASELECT+%3Fname+%3Fbirth+%3Fdescription+%3Fperson+WHERE+%7B%0D%0A+++++%3Fperson+dbo%3AbirthPlace+%3ABerlin+.%0D%0A+++++%3Fperson+%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2Fsubject%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2FCategory%3AGerman_musicians%3E+.%0D%0A+++++%3Fperson+dbo%3AbirthDate+%3Fbirth+.%0D%0A+++++%3Fperson+foaf%3Aname+%3Fname+.%0D%0A+++++%3Fperson+rdfs%3Acomment+%3Fdescription+.%0D%0A+++++FILTER+%28LANG%28%3Fdescription%29+%3D+%27en%27%29+.%0D%0A%7D%0D%0AORDER+BY+%3Fname&output=jsonp

};

plastic.modules.schemaParser.registry = {
    "default": {
        fileName: "default", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "Default Schema Parser",
        dependencies: []
    }
}
// TODO: Write a default Schema Parser
// TODO: Decide how the default schema should look like

plastic.modules.display.registry = {
    "table": {
        fileName: "table", // This has to be named like the JavaScript File in the /src/dataParser directory
        humanReadableName: "Table Display",
        dependencies: ['d3']
    }

}
plastic.modules.display.table = function (elData) {

    console.info('DISPLAY MODULE: TABLE');
    console.dir(elData);

    var data = elData.data;
    var vis = d3.select("#vis");

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
                    value: row[column]
                };
            });
        })
        .enter()
        .append("td")
        .html(function(d) {
            return d.value;
        });

    // Twitter Bootstrap Classes
    $('table').addClass('table table-condensed');

    return table;

};

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
