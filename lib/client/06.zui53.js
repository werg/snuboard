// # ZUI53
//
// Copyright (c) 2011 Florian Günther
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

function registerNS(ns)
{
 var nsParts = ns.split(".");
 var root = window;

 for(var i=0; i<nsParts.length; i++)
 {
  if(typeof root[nsParts[i]] == "undefined")
   root[nsParts[i]] = new Object();

  root = root[nsParts[i]];
 }
}

function namespace(name, callback)
{
  registerNS(name);
  callback( eval(name) );
}
/*!
 * jQuery JavaScript Library v1.6.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Jun 30 14:16:56 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z])/ig,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.6.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery._Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return (new Function( "return " + data ))();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Converts a dashed string to camelCased string;
	// Used by both the css and data modules
	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {

		if ( indexOf ) {
			return indexOf.call( array, elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


var // Promise methods
	promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
	// Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({
	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						// make sure args are available (#8421)
						args = args || [];
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			always: function() {
				return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			pipe: function( fnDone, fnFail ) {
				return jQuery.Deferred(function( newDefer ) {
					jQuery.each( {
						done: [ fnDone, "resolve" ],
						fail: [ fnFail, "reject" ]
					}, function( handler, data ) {
						var fn = data[ 0 ],
							action = data[ 1 ],
							returned;
						if ( jQuery.isFunction( fn ) ) {
							deferred[ handler ](function() {
								returned = fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise().then( newDefer.resolve, newDefer.reject );
								} else {
									newDefer[ action ]( returned );
								}
							});
						} else {
							deferred[ handler ]( newDefer[ action ] );
						}
					});
				}).promise();
			},
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		});
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = arguments,
			i = 0,
			length = args.length,
			count = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					// Strange bug in FF4:
					// Values changed onto the arguments object sometimes end up as undefined values
					// outside the $.when method. Cloning the object into a fresh array solves the issue
					deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
				}
			};
		}
		if ( length > 1 ) {
			for( ; i < length; i++ ) {
				if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return deferred.promise();
	}
});



jQuery.support = (function() {

	var div = document.createElement( "div" ),
		documentElement = document.documentElement,
		all,
		a,
		select,
		opt,
		input,
		marginDiv,
		support,
		fragment,
		body,
		testElementParent,
		testElement,
		testElementStyle,
		tds,
		events,
		eventName,
		i,
		isSupported;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName( "tbody" ).length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName( "link" ).length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains it's value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");
	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	div.innerHTML = "";

	// Figure out if the W3C box model works as expected
	div.style.width = div.style.paddingLeft = "1px";

	body = document.getElementsByTagName( "body" )[ 0 ];
	// We use our own, invisible, body unless the body is already present
	// in which case we use a div (#9239)
	testElement = document.createElement( body ? "div" : "body" );
	testElementStyle = {
		visibility: "hidden",
		width: 0,
		height: 0,
		border: 0,
		margin: 0
	};
	if ( body ) {
		jQuery.extend( testElementStyle, {
			position: "absolute",
			left: -1000,
			top: -1000
		});
	}
	for ( i in testElementStyle ) {
		testElement.style[ i ] = testElementStyle[ i ];
	}
	testElement.appendChild( div );
	testElementParent = body || documentElement;
	testElementParent.insertBefore( testElement, testElementParent.firstChild );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	support.boxModel = div.offsetWidth === 2;

	if ( "zoom" in div.style ) {
		// Check if natively block-level elements act like inline-block
		// elements when setting their display to 'inline' and giving
		// them layout
		// (IE < 8 does this)
		div.style.display = "inline";
		div.style.zoom = 1;
		support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

		// Check if elements with layout shrink-wrap their children
		// (IE 6 does this)
		div.style.display = "";
		div.innerHTML = "<div style='width:4px;'></div>";
		support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
	}

	div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
	tds = div.getElementsByTagName( "td" );

	// Check if table cells still have offsetWidth/Height when they are set
	// to display:none and there are still other visible table cells in a
	// table row; if so, offsetWidth/Height are not reliable for use when
	// determining if an element has been hidden directly using
	// display:none (it is still safe to use offsets if a parent element is
	// hidden; don safety goggles and see bug #4512 for more information).
	// (only IE 8 fails this test)
	isSupported = ( tds[ 0 ].offsetHeight === 0 );

	tds[ 0 ].style.display = "";
	tds[ 1 ].style.display = "none";

	// Check if empty table cells still have offsetWidth/Height
	// (IE < 8 fail this test)
	support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
	div.innerHTML = "";

	// Check if div with explicit width and no margin-right incorrectly
	// gets computed margin-right based on width of container. For more
	// info see bug #3333
	// Fails in WebKit before Feb 2011 nightlies
	// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
	if ( document.defaultView && document.defaultView.getComputedStyle ) {
		marginDiv = document.createElement( "div" );
		marginDiv.style.width = "0";
		marginDiv.style.marginRight = "0";
		div.appendChild( marginDiv );
		support.reliableMarginRight =
			( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
	}

	// Remove the body element we added
	testElement.innerHTML = "";
	testElementParent.removeChild( testElement );

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for( i in {
			submit: 1,
			change: 1,
			focusin: 1
		} ) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Null connected elements to avoid leaks in IE
	testElement = fragment = select = opt = body = marginDiv = div = input = null;

	return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([a-z])([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? 
			// Check for both converted-to-camel and non-converted data property names
			thisCache[ jQuery.camelCase( name ) ] || thisCache[ name ] :
			thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
			    var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		var name = "data-" + key.replace( rmultiDash, "$1-$2" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery.data( elem, deferDataKey, undefined, true );
	if ( defer &&
		( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
		( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
				!jQuery.data( elem, markDataKey, undefined, true ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.resolve();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = (type || "fx") + "mark";
			jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
			if ( count ) {
				jQuery.data( elem, key, count, true );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		if ( elem ) {
			type = (type || "fx") + "queue";
			var q = jQuery.data( elem, type, undefined, true );
			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery.data( elem, type, jQuery.makeArray(data), true );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			defer;

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function() {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
				count++;
				tmp.done( resolve );
			}
		}
		resolve();
		return defer.promise();
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	rinvalidChar = /\:|^on/,
	formHook, boolHook;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},
	
	prop: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.prop );
	},
	
	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = (value || "").split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret,
			elem = this[0];
		
		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ? 
					// handle most common string cases
					ret.replace(rreturn, "") : 
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return undefined;
		}

		var isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
					var option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
	
	attrFix: {
		// Always normalize to ensure hook usage
		tabindex: "tabIndex"
	},
	
	attr: function( elem, name, value, pass ) {
		var nType = elem.nodeType;
		
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( !("getAttribute" in elem) ) {
			return jQuery.prop( elem, name, value );
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// Normalize the name if needed
		if ( notxml ) {
			name = jQuery.attrFix[ name ] || name;

			hooks = jQuery.attrHooks[ name ];

			if ( !hooks ) {
				// Use boolHook for boolean attributes
				if ( rboolean.test( name ) ) {

					hooks = boolHook;

				// Use formHook for forms and if the name contains certain characters
				} else if ( formHook && name !== "className" &&
					(jQuery.nodeName( elem, "form" ) || rinvalidChar.test( name )) ) {

					hooks = formHook;
				}
			}
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return undefined;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, name ) {
		var propName;
		if ( elem.nodeType === 1 ) {
			name = jQuery.attrFix[ name ] || name;
		
			if ( jQuery.support.getSetAttribute ) {
				// Use removeAttribute in browsers that support it
				elem.removeAttribute( name );
			} else {
				jQuery.attr( elem, name, "" );
				elem.removeAttributeNode( elem.getAttributeNode( name ) );
			}

			// Set corresponding property to false for boolean attributes
			if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
				elem[ propName ] = false;
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabIndex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		},
		// Use the value property for back compat
		// Use the formHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( formHook && jQuery.nodeName( elem, "button" ) ) {
					return formHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},
	
	prop: function( elem, name, value ) {
		var nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return undefined;
		}

		var ret, hooks,
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return (elem[ name ] = value);
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== undefined ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},
	
	propHooks: {}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		return jQuery.prop( elem, name ) ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

	// propFix is more comprehensive and contains all fixes
	jQuery.attrFix = jQuery.propFix;
	
	// Use this for any attribute on a form in IE6/7
	formHook = jQuery.attrHooks.name = jQuery.attrHooks.title = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			// Return undefined if nodeValue is empty string
			return ret && ret.nodeValue !== "" ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Check form objects in IE (multiple bugs related)
			// Only use nodeValue if the attribute node exists on the form
			var ret = elem.getAttributeNode( name );
			if ( ret ) {
				ret.nodeValue = value;
				return value;
			}
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return (elem.style.cssText = "" + value);
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	});
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
			}
		}
	});
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspaces = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},
	
	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			exclusive;

		if ( type.indexOf("!") >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.exclusive = exclusive;
		event.namespace = namespaces.join(".");
		event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");
		
		// triggerHandler() and global events don't bubble or run the default action
		if ( onlyHandlers || !elem ) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Handle a global trigger
		if ( !elem ) {
			// TODO: Stop taunting the data cache; remove global events and always attach to document
			jQuery.each( jQuery.cache, function() {
				// internalKey variable is just used to make it easier to find
				// and potentially change this stuff later; currently it just
				// points to jQuery.expando
				var internalKey = jQuery.expando,
					internalCache = this[ internalKey ];
				if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
					jQuery.event.trigger( event, data, internalCache.handle.elem );
				}
			});
			return;
		}

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		event.target = elem;

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		var cur = elem,
			// IE doesn't like method names with a colon (#3533, #8272)
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

		// Fire event on the current element, then bubble up the DOM tree
		do {
			var handle = jQuery._data( cur, "handle" );

			event.currentTarget = cur;
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Trigger an inline bound script
			if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
				event.result = false;
				event.preventDefault();
			}

			// Bubble up to document, then to window
			cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
		} while ( cur && !event.isPropagationStopped() );

		// If nobody prevented the default action, do it now
		if ( !event.isDefaultPrevented() ) {
			var old,
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction)() check here because IE6/7 fails that test.
				// IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
				try {
					if ( ontype && elem[ type ] ) {
						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ ontype ];

						if ( old ) {
							elem[ ontype ] = null;
						}

						jQuery.event.triggered = type;
						elem[ type ]();
					}
				} catch ( ieError ) {}

				if ( old ) {
					elem[ ontype ] = old;
				}

				jQuery.event.triggered = undefined;
			}
		}
		
		return event.result;
	},

	handle: function( event ) {
		event = jQuery.event.fix( event || window.event );
		// Snapshot the handlers list since a called handler may add/remove events.
		var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
			run_all = !event.exclusive && !event.namespace,
			args = Array.prototype.slice.call( arguments, 0 );

		// Use the fix-ed Event rather than the (read-only) native event
		args[0] = event;
		event.currentTarget = this;

		for ( var j = 0, l = handlers.length; j < l; j++ ) {
			var handleObj = handlers[ j ];

			// Triggered event must 1) be non-exclusive and have no namespace, or
			// 2) have namespace(s) a subset or equal to those in the bound event.
			if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handleObj.handler;
				event.data = handleObj.data;
				event.handleObj = handleObj;

				var ret = handleObj.handler.apply( this, args );

				if ( ret !== undefined ) {
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if ( event.isImmediatePropagationStopped() ) {
					break;
				}
			}
		}
		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var eventDocument = event.target.ownerDocument || document,
				doc = eventDocument.documentElement,
				body = eventDocument.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {

	// Check if mouse(over|out) are still within the same parent element
	var related = event.relatedTarget,
		inside = false,
		eventType = event.type;

	event.type = event.data;

	if ( related !== this ) {

		if ( related ) {
			inside = jQuery.contains( this, related );
		}

		if ( !inside ) {

			jQuery.event.handle.apply( this, arguments );

			event.type = eventType;
		}
	}
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( !jQuery.nodeName( this, "form" ) ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( jQuery.nodeName( elem, "select" ) ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

				if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0;

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( donor ) {
			// Donor event is always a native one; fix it and switch its type.
			// Let focusin/out handler cancel the donor focus/blur event.
			var e = jQuery.event.fix( donor );
			e.type = fix;
			e.originalEvent = {};
			jQuery.event.trigger( e, null, e.target );
			if ( e.isDefaultPrevented() ) {
				donor.preventDefault();
			}
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		var handler;

		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( arguments.length === 2 || data === false ) {
			fn = data;
			data = undefined;
		}

		if ( name === "one" ) {
			handler = function( event ) {
				jQuery( this ).unbind( event, handler );
				return fn.apply( this, arguments );
			};
			handler.guid = fn.guid || jQuery.guid++;
		} else {
			handler = fn;
		}

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
			return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( name === "die" && !types &&
					origSelector && origSelector.charAt(0) === "." ) {

			context.unbind( origSelector );

			return this;
		}

		if ( data === false || jQuery.isFunction( data ) ) {
			fn = data || returnFalse;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( liveMap[ type ] ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

					// Make sure not to accidentally match a child element with the same selector
					if ( related && jQuery.contains( elem, related ) ) {
						related = elem;
					}
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && ( typeof selector === "string" ?
			jQuery.filter( selector, this ).length > 0 :
			this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];
		
		// Array
		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[ selector ] ) {
						matches[ selector ] = POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[ selector ];

						if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc;

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );

	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	if ( jQuery.nodeName( elem, "input" ) ) {
		fixDefaultChecked( elem );
	} else if ( "getElementsByTagName" in elem ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType;

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], j;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div");

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}



var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,
	rrelNum = /^[+\-]=/,
	rrelNumFilter = /[^+\-\.\de]+/g,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Make sure that NaN and null values aren't set. See: #7116
			if ( type === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && rrelNum.test( value ) ) {
				value = +value.replace( rrelNumFilter, "" ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWH( elem, name, extra );
				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				return val;
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat( value );

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN( value ) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				var ret;
				jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						ret = curCSS( elem, "margin-right", "marginRight" );
					} else {
						ret = elem.style.marginRight;
					}
				});
				return ret;
			}
		};
	}
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		which = name === "width" ? cssWidth : cssHeight;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			jQuery.each( which, function() {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
				}
			});
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ] || 0;
	}
	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		jQuery.each( which, function() {
			val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
			}
		});
	}

	return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
		( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow,
	requestAnimationFrame = window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
						jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data(elem, "olddisplay") || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				if ( this[i].style ) {
					var display = jQuery.css( this[i], "display" );

					if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
						jQuery._data( this[i], "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p,
				display, e,
				parts, start, end, unit;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			for ( p in prop ) {

				// property name normalization
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				val = prop[ name ];

				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							display = defaultDisplay( this.nodeName );

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			var timers = jQuery.timers,
				i = timers.length;
			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}
			while ( i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue !== false ) {
				jQuery.dequeue( this );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx,
			raf;

		this.startTime = fxNow || createFxNow();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			// Use requestAnimationFrame instead of setInterval if available
			if ( requestAnimationFrame ) {
				timerId = true;
				raf = function() {
					// When timerId gets set to null at any point, this stops
					if ( timerId ) {
						requestAnimationFrame( raf );
						fx.tick();
					}
				};
				requestAnimationFrame( raf );
			} else {
				timerId = setInterval( fx.tick, fx.interval );
			}
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options,
			i, n;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( i in options.animatedProperties ) {
				if ( options.animatedProperties[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery(elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( var p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[p] );
					}
				}

				// Execute the complete function
				options.complete.call( elem );
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ((this.end - this.start) * this.pos);
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );

		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );

			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function( val ) {
		var elem, win;

		if ( val === undefined ) {
			elem = this[ 0 ];

			if ( !elem ) {
				return null;
			}

			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}

		// Set the scroll offset
		return this.each(function() {
			win = getWindow( this );

			if ( win ) {
				win.scrollTo(
					!i ? val : jQuery( win ).scrollLeft(),
					 i ? val : jQuery( win ).scrollTop()
				);

			} else {
				this[ method ] = val;
			}
		});
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem && elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})(window);
/*! Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.4
 * 
 * Requires: 1.2.2+
 */

(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },
    
    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },
    
    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";
    
    // Old school scrollwheel delta
    if ( event.wheelDelta ) { delta = event.wheelDelta/120; }
    if ( event.detail     ) { delta = -event.detail/3; }
    
    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;
    
    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }
    
    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
    
    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);
    
    return $.event.handle.apply(this, args);
}

})(jQuery);
/*!
 * jQuery 2d Transform v0.9.3
 * http://wiki.github.com/heygrady/transform/
 *
 * Copyright 2010, Grady Kuhnline
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Date: Sat Dec 4 15:46:09 2010 -0800
 */
///////////////////////////////////////////////////////
// Transform
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * @var Regex identify the matrix filter in IE
	 */
	var rmatrix = /progid:DXImageTransform\.Microsoft\.Matrix\(.*?\)/,
		rfxnum = /^([\+\-]=)?([\d+.\-]+)(.*)$/,
		rperc = /%/;
	
	// Steal some code from Modernizr
	var m = document.createElement( 'modernizr' ),
		m_style = m.style;
		
	function stripUnits(arg) {
		return parseFloat(arg);
	}
	
	/**
	 * Find the prefix that this browser uses
	 */	
	function getVendorPrefix() {
		var property = {
			transformProperty : '',
			MozTransform : '-moz-',
			WebkitTransform : '-webkit-',
			OTransform : '-o-',
			msTransform : '-ms-'
		};
		for (var p in property) {
			if (typeof m_style[p] != 'undefined') {
				return property[p];
			}
		}
		return null;
	}
	
	function supportCssTransforms() {
		if (typeof(window.Modernizr) !== 'undefined') {
			return Modernizr.csstransforms;
		}
		
		var props = [ 'transformProperty', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform' ];
		for ( var i in props ) {
			if ( m_style[ props[i] ] !== undefined  ) {
				return true;
			}
		}
	}
		
	// Capture some basic properties
	var vendorPrefix			= getVendorPrefix(),
		transformProperty		= vendorPrefix !== null ? vendorPrefix + 'transform' : false,
		transformOriginProperty	= vendorPrefix !== null ? vendorPrefix + 'transform-origin' : false;
	
	// store support in the jQuery Support object
	$.support.csstransforms = supportCssTransforms();
	
	// IE9 public preview 6 requires the DOM names
	if (vendorPrefix == '-ms-') {
		transformProperty = 'msTransform';
		transformOriginProperty = 'msTransformOrigin';
	}
	
	/**
	 * Class for creating cross-browser transformations
	 * @constructor
	 */
	$.extend({
		transform: function(elem) {
			// Cache the transform object on the element itself
			elem.transform = this;
			
			/**
			 * The element we're working with
			 * @var jQueryCollection
			 */
			this.$elem = $(elem);
						
			/**
			 * Remember the matrix we're applying to help the safeOuterLength func
			 */
			this.applyingMatrix = false;
			this.matrix = null;
			
			/**
			 * Remember the css height and width to save time
			 * This is only really used in IE
			 * @var Number
			 */
			this.height = null;
			this.width = null;
			this.outerHeight = null;
			this.outerWidth = null;
			
			/**
			 * We need to know the box-sizing in IE for building the outerHeight and outerWidth
			 * @var string
			 */
			this.boxSizingValue = null;
			this.boxSizingProperty = null;
			
			this.attr = null;
			this.transformProperty = transformProperty;
			this.transformOriginProperty = transformOriginProperty;
		}
	});
	
	$.extend($.transform, {
		/**
		 * @var Array list of all valid transform functions
		 */
		funcs: ['matrix', 'origin', 'reflect', 'reflectX', 'reflectXY', 'reflectY', 'rotate', 'scale', 'scaleX', 'scaleY', 'skew', 'skewX', 'skewY', 'translate', 'translateX', 'translateY']
	});
	
	/**
	 * Create Transform as a jQuery plugin
	 * @param Object funcs
	 * @param Object options
	 */
	$.fn.transform = function(funcs, options) {
		return this.each(function() {
			var t = this.transform || new $.transform(this);
			if (funcs) {
				t.exec(funcs, options);
			}
		});
	};
	
	$.transform.prototype = {
		/**
		 * Applies all of the transformations
		 * @param Object funcs
		 * @param Object options
		 * forceMatrix - uses the matrix in all browsers
		 * preserve - tries to preserve the values from previous runs
		 */
		exec: function(funcs, options) {
			// extend options
			options = $.extend(true, {
				forceMatrix: false,
				preserve: false
			}, options);
	
			// preserve the funcs from the previous run
			this.attr = null;
			if (options.preserve) {
				funcs = $.extend(true, this.getAttrs(true, true), funcs);
			} else {
				funcs = $.extend(true, {}, funcs); // copy the object to prevent weirdness
			}
			
			// Record the custom attributes on the element itself
			this.setAttrs(funcs);
			
			// apply the funcs
			if ($.support.csstransforms && !options.forceMatrix) {
				// CSS3 is supported
				return this.execFuncs(funcs);
			} else if ($.browser.msie || ($.support.csstransforms && options.forceMatrix)) {
				// Internet Explorer or Forced matrix
				return this.execMatrix(funcs);
			}
			return false;
		},
		
		/**
		 * Applies all of the transformations as functions
		 * @param Object funcs
		 */
		execFuncs: function(funcs) {
			var values = [];
			
			// construct a CSS string
			for (var func in funcs) {
				// handle origin separately
				if (func == 'origin') {
					this[func].apply(this, $.isArray(funcs[func]) ? funcs[func] : [funcs[func]]);
				} else if ($.inArray(func, $.transform.funcs) !== -1) {
					values.push(this.createTransformFunc(func, funcs[func]));
				}
			}
			this.$elem.css(transformProperty, values.join(' '));
			return true;
		},
		
		/**
		 * Applies all of the transformations as a matrix
		 * @param Object funcs
		 */
		execMatrix: function(funcs) {
			var matrix,
				tempMatrix,
				args;
			
			var elem = this.$elem[0],
				_this = this;
			function normalPixels(val, i) {
				if (rperc.test(val)) {
					// this really only applies to translation
					return parseFloat(val) / 100 * _this['safeOuter' + (i ? 'Height' : 'Width')]();
				}
				return toPx(elem, val);
			}
			
			var rtranslate = /translate[X|Y]?/,
				trans = [];
				
			for (var func in funcs) {
				switch ($.type(funcs[func])) {
					case 'array': args = funcs[func]; break;
					case 'string': args = $.map(funcs[func].split(','), $.trim); break;
					default: args = [funcs[func]];
				}
				
				if ($.matrix[func]) {
					
					if ($.cssAngle[func]) {
						// normalize on degrees
						args = $.map(args, $.angle.toDegree);						
					} else if (!$.cssNumber[func]) {
						// normalize to pixels
						args = $.map(args, normalPixels);
					} else {
						// strip units
						args = $.map(args, stripUnits);
					}
					
					tempMatrix = $.matrix[func].apply(this, args);
					if (rtranslate.test(func)) {
						//defer translation
						trans.push(tempMatrix);
					} else {
						matrix = matrix ? matrix.x(tempMatrix) : tempMatrix;
					}
				} else if (func == 'origin') {
					this[func].apply(this, args);
				}
			}
			
			// check that we have a matrix
			matrix = matrix || $.matrix.identity();
			
			// Apply translation
			$.each(trans, function(i, val) { matrix = matrix.x(val); });

			// pull out the relevant values
			var a = parseFloat(matrix.e(1,1).toFixed(6)),
				b = parseFloat(matrix.e(2,1).toFixed(6)),
				c = parseFloat(matrix.e(1,2).toFixed(6)),
				d = parseFloat(matrix.e(2,2).toFixed(6)),
				tx = matrix.rows === 3 ? parseFloat(matrix.e(1,3).toFixed(6)) : 0,
				ty = matrix.rows === 3 ? parseFloat(matrix.e(2,3).toFixed(6)) : 0;
			
			//apply the transform to the element
			if ($.support.csstransforms && vendorPrefix === '-moz-') {
				// -moz-
				this.$elem.css(transformProperty, 'matrix(' + a + ', ' + b + ', ' + c + ', ' + d + ', ' + tx + 'px, ' + ty + 'px)');
			} else if ($.support.csstransforms) {
				// -webkit, -o-, w3c
				// NOTE: WebKit and Opera don't allow units on the translate variables
				this.$elem.css(transformProperty, 'matrix(' + a + ', ' + b + ', ' + c + ', ' + d + ', ' + tx + ', ' + ty + ')');
			} else if ($.browser.msie) {
				// IE requires the special transform Filter
				
				//TODO: Use Nearest Neighbor during animation FilterType=\'nearest neighbor\'
				var filterType = ', FilterType=\'nearest neighbor\''; //bilinear
				var style = this.$elem[0].style;
				var matrixFilter = 'progid:DXImageTransform.Microsoft.Matrix(' +
						'M11=' + a + ', M12=' + c + ', M21=' + b + ', M22=' + d +
						', sizingMethod=\'auto expand\'' + filterType + ')';
				var filter = style.filter || $.curCSS( this.$elem[0], "filter" ) || "";
				style.filter = rmatrix.test(filter) ? filter.replace(rmatrix, matrixFilter) : filter ? filter + ' ' + matrixFilter : matrixFilter;
				
				// Let's know that we're applying post matrix fixes and the height/width will be static for a bit
				this.applyingMatrix = true;
				this.matrix = matrix;
				
				// IE can't set the origin or translate directly
				this.fixPosition(matrix, tx, ty);
				
				this.applyingMatrix = false;
				this.matrix = null;
			}
			return true;
		},
		
		/**
		 * Sets the transform-origin
		 * This really needs to be percentages
		 * @param Number x length
		 * @param Number y length
		 */
		origin: function(x, y) {
			// use CSS in supported browsers
			if ($.support.csstransforms) {
				if (typeof y === 'undefined') {
					this.$elem.css(transformOriginProperty, x);
				} else {
					this.$elem.css(transformOriginProperty, x + ' ' + y);
				}
				return true;
			}
			
			// correct for keyword lengths
			switch (x) {
				case 'left': x = '0'; break;
				case 'right': x = '100%'; break;
				case 'center': // no break
				case undefined: x = '50%';
			}
			switch (y) {
				case 'top': y = '0'; break;
				case 'bottom': y = '100%'; break;
				case 'center': // no break
				case undefined: y = '50%'; //TODO: does this work?
			}
			
			// store mixed values with units, assumed pixels
			this.setAttr('origin', [
				rperc.test(x) ? x : toPx(this.$elem[0], x) + 'px',
				rperc.test(y) ? y : toPx(this.$elem[0], y) + 'px'
			]);
			//console.log(this.getAttr('origin'));
			return true;
		},
		
		/**
		 * Create a function suitable for a CSS value
		 * @param string func
		 * @param Mixed value
		 */
		createTransformFunc: function(func, value) {
			if (func.substr(0, 7) === 'reflect') {
				// let's fake reflection, false value 
				// falsey sets an identity matrix
				var m = value ? $.matrix[func]() : $.matrix.identity();
				return 'matrix(' + m.e(1,1) + ', ' + m.e(2,1) + ', ' + m.e(1,2) + ', ' + m.e(2,2) + ', 0, 0)';
			}
			
			//value = _correctUnits(func, value);
			
			if (func == 'matrix') {
				if (vendorPrefix === '-moz-') {
					value[4] = value[4] ? value[4] + 'px' : 0;
					value[5] = value[5] ? value[5] + 'px' : 0;
				}
			}
			return func + '(' + ($.isArray(value) ? value.join(', ') : value) + ')';
		},
		
		/**
		 * @param Matrix matrix
		 * @param Number tx
		 * @param Number ty
		 * @param Number height
		 * @param Number width
		 */
		fixPosition: function(matrix, tx, ty, height, width) {
			// now we need to fix it!
			var	calc = new $.matrix.calc(matrix, this.safeOuterHeight(), this.safeOuterWidth()),
				origin = this.getAttr('origin'); // mixed percentages and px
			
			// translate a 0, 0 origin to the current origin
			var offset = calc.originOffset(new $.matrix.V2(
				rperc.test(origin[0]) ? parseFloat(origin[0])/100*calc.outerWidth : parseFloat(origin[0]),
				rperc.test(origin[1]) ? parseFloat(origin[1])/100*calc.outerHeight : parseFloat(origin[1])
			));
			
			// IE glues the top-most and left-most pixels of the transformed object to top/left of the original object
			//TODO: This seems wrong in the calculations
			var sides = calc.sides();

			// Protect against an item that is already positioned
			var cssPosition = this.$elem.css('position');
			if (cssPosition == 'static') {
				cssPosition = 'relative';
			}
			
			//TODO: if the element is already positioned, we should attempt to respect it (somehow)
			//NOTE: we could preserve our offset top and left in an attr on the elem
			var pos = {top: 0, left: 0};
			
			// Approximates transform-origin, tx, and ty
			var css = {
				'position': cssPosition,
				'top': (offset.top + ty + sides.top + pos.top) + 'px',
				'left': (offset.left + tx + sides.left + pos.left) + 'px',
				'zoom': 1
			};

			this.$elem.css(css);
		}
	};
	
	/**
	 * Ensure that values have the appropriate units on them
	 * @param string func
	 * @param Mixed value
	 */
	function toPx(elem, val) {
		var parts = rfxnum.exec($.trim(val));
		
		if (parts[3] && parts[3] !== 'px') {
			var prop = 'paddingBottom',
				orig = $.style( elem, prop );
				
			$.style( elem, prop, val );
			val = cur( elem, prop );
			$.style( elem, prop, orig );
			return val;
		}
		return parseFloat( val );
	}
	
	function cur(elem, prop) {
		if ( elem[prop] != null && (!elem.style || elem.style[prop] == null) ) {
			return elem[ prop ];
		}

		var r = parseFloat( $.css( elem, prop ) );
		return r && r > -10000 ? r : 0;
	}
})(jQuery, this, this.document);


///////////////////////////////////////////////////////
// Safe Outer Length
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	$.extend($.transform.prototype, {
		/**
		 * @param void
		 * @return Number
		 */
		safeOuterHeight: function() {
			return this.safeOuterLength('height');
		},
		
		/**
		 * @param void
		 * @return Number
		 */
		safeOuterWidth: function() {
			return this.safeOuterLength('width');
		},
		
		/**
		 * Returns reliable outer dimensions for an object that may have been transformed.
		 * Only use this if the matrix isn't handy
		 * @param String dim height or width
		 * @return Number
		 */
		safeOuterLength: function(dim) {
			var funcName = 'outer' + (dim == 'width' ? 'Width' : 'Height');
			
			if (!$.support.csstransforms && $.browser.msie) {
				// make the variables more generic
				dim = dim == 'width' ? 'width' : 'height';
				
				// if we're transforming and have a matrix; we can shortcut.
				// the true outerHeight is the transformed outerHeight divided by the ratio.
				// the ratio is equal to the height of a 1px by 1px box that has been transformed by the same matrix.
				if (this.applyingMatrix && !this[funcName] && this.matrix) {
					// calculate and return the correct size
					var calc = new $.matrix.calc(this.matrix, 1, 1),
						ratio = calc.offset(),
						length = this.$elem[funcName]() / ratio[dim];
					this[funcName] = length;
					
					return length;
				} else if (this.applyingMatrix && this[funcName]) {
					// return the cached calculation
					return this[funcName];
				}
				
				// map dimensions to box sides			
				var side = {
					height: ['top', 'bottom'],
					width: ['left', 'right']
				};
				
				// setup some variables
				var elem = this.$elem[0],
					outerLen = parseFloat($.curCSS(elem, dim, true)), //TODO: this can be cached on animations that do not animate height/width
					boxSizingProp = this.boxSizingProperty,
					boxSizingValue = this.boxSizingValue;
				
				// IE6 && IE7 will never have a box-sizing property, so fake it
				if (!this.boxSizingProperty) {
					boxSizingProp = this.boxSizingProperty = _findBoxSizingProperty() || 'box-sizing';
					boxSizingValue = this.boxSizingValue = this.$elem.css(boxSizingProp) || 'content-box';
				}
				
				// return it immediately if we already know it
				if (this[funcName] && this[dim] == outerLen) {
					return this[funcName];
				} else {
					this[dim] = outerLen;
				}
				
				// add in the padding and border
				if (boxSizingProp && (boxSizingValue == 'padding-box' || boxSizingValue == 'content-box')) {
					outerLen += parseFloat($.curCSS(elem, 'padding-' + side[dim][0], true)) || 0 +
								  parseFloat($.curCSS(elem, 'padding-' + side[dim][1], true)) || 0;
				}
				if (boxSizingProp && boxSizingValue == 'content-box') {
					outerLen += parseFloat($.curCSS(elem, 'border-' + side[dim][0] + '-width', true)) || 0 +
								  parseFloat($.curCSS(elem, 'border-' + side[dim][1] + '-width', true)) || 0;
				}
				
				// remember and return the outerHeight
				this[funcName] = outerLen;
				return outerLen;
			}
			return this.$elem[funcName]();
		}
	});
	
	/**
	 * Determine the correct property for checking the box-sizing property
	 * @param void
	 * @return string
	 */
	var _boxSizingProperty = null;
	function _findBoxSizingProperty () {
		if (_boxSizingProperty) {
			return _boxSizingProperty;
		} 
		
		var property = {
				boxSizing : 'box-sizing',
				MozBoxSizing : '-moz-box-sizing',
				WebkitBoxSizing : '-webkit-box-sizing',
				OBoxSizing : '-o-box-sizing'
			},
			elem = document.body;
		
		for (var p in property) {
			if (typeof elem.style[p] != 'undefined') {
				_boxSizingProperty = property[p];
				return _boxSizingProperty;
			}
		}
		return null;
	}
})(jQuery, this, this.document);


///////////////////////////////////////////////////////
// Attr
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	var rfuncvalue = /([\w\-]*?)\((.*?)\)/g, // with values
		attr = 'data-transform',
		rspace = /\s/,
		rcspace = /,\s?/;
	
	$.extend($.transform.prototype, {		
		/**
		 * This overrides all of the attributes
		 * @param Object funcs a list of transform functions to store on this element
		 * @return void
		 */
		setAttrs: function(funcs) {
			var string = '',
				value;
			for (var func in funcs) {
				value = funcs[func];
				if ($.isArray(value)) {
					value = value.join(', ');
				}
				string += ' ' + func + '(' + value + ')'; 
			}
			this.attr = $.trim(string);
			this.$elem.attr(attr, this.attr);
		},
		
		/**
		 * This sets only a specific atribute
		 * @param string func name of a transform function
		 * @param mixed value with proper units
		 * @return void
		 */
		setAttr: function(func, value) {
			// stringify the value
			if ($.isArray(value)) {
				value = value.join(', ');
			}
			
			// pull from a local variable to look it up
			var transform = this.attr || this.$elem.attr(attr);
			if (!transform || transform.indexOf(func) == -1) {
				// we don't have any existing values, save it
				// we don't have this function yet, save it
				this.attr = $.trim(transform + ' ' + func + '(' + value + ')');
				this.$elem.attr(attr, this.attr);
			} else {
				// replace the existing value
				var funcs = [],	parts;
				
				// regex split
				rfuncvalue.lastIndex = 0; // reset the regex pointer
				while (parts = rfuncvalue.exec(transform)) {
					if (func == parts[1]) {
						funcs.push(func + '(' + value + ')');
					} else {
						funcs.push(parts[0]);
					}
				}
				this.attr = funcs.join(' ');
				this.$elem.attr(attr, this.attr);
			}
		},
		
		/**
		 * @return Object
		 */
		getAttrs: function() {
			var transform = this.attr || this.$elem.attr(attr);
			if (!transform) {
				// We don't have any existing values, return empty object
				return {};
			}
			
			// replace the existing value
			var attrs = {}, parts, value;
			
			rfuncvalue.lastIndex = 0; // reset the regex pointer
			while ((parts = rfuncvalue.exec(transform)) !== null) {
				if (parts) {
					value = parts[2].split(rcspace);
					attrs[parts[1]] = value.length == 1 ? value[0] : value;
				}
			}
			return attrs;
		},
		
		/**
		 * @param String func 
		 * @return mixed
		 */
		getAttr: function(func) {
			var attrs = this.getAttrs();
			if (typeof attrs[func] !== 'undefined') {
				return attrs[func];
			}
			
			//TODO: move the origin to a function
			if (func === 'origin' && $.support.csstransforms) {
				// supported browsers return percentages always
				return this.$elem.css(this.transformOriginProperty).split(rspace);
			} else if (func === 'origin') {
				// just force IE to also return a percentage
				return ['50%', '50%'];
			}
			
			return $.cssDefault[func] || 0;
		}
	});
	
	// Define 
	if (typeof($.cssAngle) == 'undefined') {
		$.cssAngle = {};
	}
	$.extend($.cssAngle, {
		rotate: true,
		skew: true,
		skewX: true,
		skewY: true
	});
	
	// Define default values
	if (typeof($.cssDefault) == 'undefined') {
		$.cssDefault = {};
	}
	
	$.extend($.cssDefault, {
		scale: [1, 1],
		scaleX: 1,
		scaleY: 1,
		matrix: [1, 0, 0, 1, 0, 0],
		origin: ['50%', '50%'], // TODO: allow this to be a function, like get
		reflect: [1, 0, 0, 1, 0, 0],
		reflectX: [1, 0, 0, 1, 0, 0],
		reflectXY: [1, 0, 0, 1, 0, 0],
		reflectY: [1, 0, 0, 1, 0, 0]
	});
	
	// Define functons with multiple values
	if (typeof($.cssMultipleValues) == 'undefined') {
		$.cssMultipleValues = {};
	}
	$.extend($.cssMultipleValues, {
		matrix: 6,
		origin: {
			length: 2,
			duplicate: true
		},
		reflect: 6,
		reflectX: 6,
		reflectXY: 6,
		reflectY: 6,
		scale: {
			length: 2,
			duplicate: true
		},
		skew: 2,
		translate: 2
	});
	
	// specify unitless funcs
	$.extend($.cssNumber, {
		matrix: true,
		reflect: true,
		reflectX: true,
		reflectXY: true,
		reflectY: true,
		scale: true,
		scaleX: true,
		scaleY: true
	});
	
	// override all of the css functions
	$.each($.transform.funcs, function(i, func) {
		$.cssHooks[func] = {
			set: function(elem, value) {
				var transform = elem.transform || new $.transform(elem),
					funcs = {};
				funcs[func] = value;
				transform.exec(funcs, {preserve: true});
			},
			get: function(elem, computed) {
				var transform = elem.transform || new $.transform(elem);
				return transform.getAttr(func);
			}
		};
	});
	
	// Support Reflection animation better by returning a matrix
	$.each(['reflect', 'reflectX', 'reflectXY', 'reflectY'], function(i, func) {
		$.cssHooks[func].get = function(elem, computed) {
			var transform = elem.transform || new $.transform(elem);
			return transform.getAttr('matrix') || $.cssDefault[func];
		};
	});
})(jQuery, this, this.document);
///////////////////////////////////////////////////////
// Animation
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * @var Regex looks for units on a string
	 */
	var rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/;
	
	/**
	 * Doctors prop values in the event that they contain spaces
	 * @param Object prop
	 * @param String speed
	 * @param String easing
	 * @param Function callback
	 * @return bool
	 */
	var _animate = $.fn.animate;
	$.fn.animate = function( prop, speed, easing, callback ) {
		var optall = $.speed(speed, easing, callback),
			mv = $.cssMultipleValues;
		
		// Speed always creates a complete function that must be reset
		optall.complete = optall.old;
		
		// Capture multiple values
		if (!$.isEmptyObject(prop)) {
			if (typeof optall.original === 'undefined') {
				optall.original = {};
			}
			$.each( prop, function( name, val ) {
				if (mv[name]
					|| $.cssAngle[name]
					|| (!$.cssNumber[name] && $.inArray(name, $.transform.funcs) !== -1)) {
					
					// Handle special easing
					var specialEasing = null;
					if (jQuery.isArray(prop[name])) {
						var mvlen = 1, len = val.length;
						if (mv[name]) {
							mvlen = (typeof mv[name].length === 'undefined' ? mv[name] : mv[name].length);
						}
						if ( len > mvlen
							|| (len < mvlen && len == 2)
							|| (len == 2 && mvlen == 2 && isNaN(parseFloat(val[len - 1])))) {
							
							specialEasing = val[len - 1];
							val.splice(len - 1, 1);
						}
					}
					
					// Store the original values onto the optall
					optall.original[name] = val.toString();
					
					// reduce to a unitless number (to trick animate)
					prop[name] = parseFloat(val);
				}
			} );
		}
		
		//NOTE: we edited prop above to trick animate
		//NOTE: we pre-convert to an optall so we can doctor it
		return _animate.apply(this, [arguments[0], optall]);
	};
	
	var prop = 'paddingBottom';
	function cur(elem, prop) {
		if ( elem[prop] != null && (!elem.style || elem.style[prop] == null) ) {
			//return elem[ prop ];
		}

		var r = parseFloat( $.css( elem, prop ) );
		return r && r > -10000 ? r : 0;
	}
	
	var _custom = $.fx.prototype.custom;
	$.fx.prototype.custom = function(from, to, unit) {
		var multiple = $.cssMultipleValues[this.prop],
			angle = $.cssAngle[this.prop];
		
		//TODO: simply check for the existence of CSS Hooks?
		if (multiple || (!$.cssNumber[this.prop] && $.inArray(this.prop, $.transform.funcs) !== -1)) {
			this.values = [];
			
			if (!multiple) {
				multiple = 1;
			}
			
			// Pull out the known values
			var values = this.options.original[this.prop],
				currentValues = $(this.elem).css(this.prop),
				defaultValues = $.cssDefault[this.prop] || 0;
			
			// make sure the current css value is an array
			if (!$.isArray(currentValues)) {
				currentValues = [currentValues];
			}
			
			// make sure the new values are an array
			if (!$.isArray(values)) {
				if ($.type(values) === 'string') {
					values = values.split(',');
				} else {
					values = [values];
				}
			}
			
			// make sure we have enough new values
			var length = multiple.length || multiple, i = 0;
			while (values.length < length) {
				values.push(multiple.duplicate ? values[0] : defaultValues[i] || 0);
				i++;
			}
			
			// calculate a start, end and unit for each new value
			var start, parts, end, //unit,
				fx = this,
				transform = fx.elem.transform;
				orig = $.style(fx.elem, prop);

			$.each(values, function(i, val) {
				// find a sensible start value
				if (currentValues[i]) {
					start = currentValues[i];
				} else if (defaultValues[i] && !multiple.duplicate) {
					start = defaultValues[i];
				} else if (multiple.duplicate) {
					start = currentValues[0];
				} else {
					start = 0;
				}
				
				// Force the correct unit on the start
				if (angle) {
					start = $.angle.toDegree(start);
				} else if (!$.cssNumber[fx.prop]) {
					parts = rfxnum.exec($.trim(start));
					if (parts[3] && parts[3] !== 'px') {
						if (parts[3] === '%') {
							start = parseFloat( parts[2] ) / 100 * transform['safeOuter' + (i ? 'Height' : 'Width')]();
						} else {
							$.style( fx.elem, prop, start);
							start = cur(fx.elem, prop);
							$.style( fx.elem, prop, orig);
						}
					}
				}
				start = parseFloat(start);
				
				// parse the value with a regex
				parts = rfxnum.exec($.trim(val));
				
				if (parts) {
					// we found a sensible value and unit
					end = parseFloat( parts[2] );
					unit = parts[3] || "px"; //TODO: change to an appropriate default unit
					
					if (angle) {
						end = $.angle.toDegree(end + unit);
						unit = 'deg';
					} else if (!$.cssNumber[fx.prop] && unit === '%') {
						start = (start / transform['safeOuter' + (i ? 'Height' : 'Width')]()) * 100;
					} else if (!$.cssNumber[fx.prop] && unit !== 'px') {
						$.style( fx.elem, prop, (end || 1) + unit);
						start = ((end || 1) / cur(fx.elem, prop)) * start;
						$.style( fx.elem, prop, orig);
					}
					
					// If a +=/-= token was provided, we're doing a relative animation
					if (parts[1]) {
						end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
					}
				} else {
					// I don't know when this would happen
					end = val;
					unit = ''; 
				}
								
				// Save the values
				fx.values.push({
					start: start,
					end: end,
					unit: unit
				});				
			});
		}
		return _custom.apply(this, arguments);
	};
	
	/**
	 * Animates a multi value attribute
	 * @param Object fx
	 * @return null
	 */
	$.fx.multipleValueStep = {
		_default: function(fx) {
			$.each(fx.values, function(i, val) {
				fx.values[i].now = val.start + ((val.end - val.start) * fx.pos);
			});
		}
	};
	$.each(['matrix', 'reflect', 'reflectX', 'reflectXY', 'reflectY'], function(i, func) {
		$.fx.multipleValueStep[func] = function(fx) {
			var d = fx.decomposed,
				$m = $.matrix;
				m = $m.identity();
			
			d.now = {};
			
			// increment each part of the decomposition and recompose it		
			$.each(d.start, function(k) {				
				// calculate the current value
				d.now[k] = parseFloat(d.start[k]) + ((parseFloat(d.end[k]) - parseFloat(d.start[k])) * fx.pos);
				
				// skip functions that won't affect the transform
				if (((k === 'scaleX' || k === 'scaleY') && d.now[k] === 1) ||
					(k !== 'scaleX' && k !== 'scaleY' && d.now[k] === 0)) {
					return true;
				}
				
				// calculating
				m = m.x($m[k](d.now[k]));
			});
			
			// save the correct matrix values for the value of now
			var val;
			$.each(fx.values, function(i) {
				switch (i) {
					case 0: val = parseFloat(m.e(1, 1).toFixed(6)); break;
					case 1: val = parseFloat(m.e(2, 1).toFixed(6)); break;
					case 2: val = parseFloat(m.e(1, 2).toFixed(6)); break;
					case 3: val = parseFloat(m.e(2, 2).toFixed(6)); break;
					case 4: val = parseFloat(m.e(1, 3).toFixed(6)); break;
					case 5: val = parseFloat(m.e(2, 3).toFixed(6)); break;
				}
				fx.values[i].now = val;
			});
		};
	});
	/**
	 * Step for animating tranformations
	 */
	$.each($.transform.funcs, function(i, func) {
		$.fx.step[func] = function(fx) {
			var transform = fx.elem.transform || new $.transform(fx.elem),
				funcs = {};
			
			if ($.cssMultipleValues[func] || (!$.cssNumber[func] && $.inArray(func, $.transform.funcs) !== -1)) {
				($.fx.multipleValueStep[fx.prop] || $.fx.multipleValueStep._default)(fx);
				funcs[fx.prop] = [];
				$.each(fx.values, function(i, val) {
					funcs[fx.prop].push(val.now + ($.cssNumber[fx.prop] ? '' : val.unit));
				});
			} else {
				funcs[fx.prop] = fx.now + ($.cssNumber[fx.prop] ? '' : fx.unit);
			}
			
			transform.exec(funcs, {preserve: true});
		};
	});
	
	// Support matrix animation
	$.each(['matrix', 'reflect', 'reflectX', 'reflectXY', 'reflectY'], function(i, func) {
		$.fx.step[func] = function(fx) {
			var transform = fx.elem.transform || new $.transform(fx.elem),
				funcs = {};
				
			if (!fx.initialized) {
				fx.initialized = true;

				// Reflections need a sensible end value set
				if (func !== 'matrix') {
					var values = $.matrix[func]().elements;
					var val;
					$.each(fx.values, function(i) {
						switch (i) {
							case 0: val = values[0]; break;
							case 1: val = values[2]; break;
							case 2: val = values[1]; break;
							case 3: val = values[3]; break;
							default: val = 0;
						}
						fx.values[i].end = val;
					});
				}
				
				// Decompose the start and end
				fx.decomposed = {};
				var v = fx.values;
				
				fx.decomposed.start = $.matrix.matrix(v[0].start, v[1].start, v[2].start, v[3].start, v[4].start, v[5].start).decompose();
				fx.decomposed.end = $.matrix.matrix(v[0].end, v[1].end, v[2].end, v[3].end, v[4].end, v[5].end).decompose();
			}
			
			($.fx.multipleValueStep[fx.prop] || $.fx.multipleValueStep._default)(fx);
			funcs.matrix = [];
			$.each(fx.values, function(i, val) {
				funcs.matrix.push(val.now);
			});
			
			transform.exec(funcs, {preserve: true});
		};
	});
})(jQuery, this, this.document);
///////////////////////////////////////////////////////
// Angle
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * Converting a radian to a degree
	 * @const
	 */
	var RAD_DEG = 180/Math.PI;
	
	/**
	 * Converting a radian to a grad
	 * @const
	 */
	var RAD_GRAD = 200/Math.PI;
	
	/**
	 * Converting a degree to a radian
	 * @const
	 */
	var DEG_RAD = Math.PI/180;
	
	/**
	 * Converting a degree to a grad
	 * @const
	 */
	var DEG_GRAD = 2/1.8;
	
	/**
	 * Converting a grad to a degree
	 * @const
	 */
	var GRAD_DEG = 0.9;
	
	/**
	 * Converting a grad to a radian
	 * @const
	 */
	var GRAD_RAD = Math.PI/200;
	
	
	var rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/;
	
	/**
	 * Functions for converting angles
	 * @var Object
	 */
	$.extend({
		angle: {
			/**
			 * available units for an angle
			 * @var Regex
			 */
			runit: /(deg|g?rad)/,
			
			/**
			 * Convert a radian into a degree
			 * @param Number rad
			 * @return Number
			 */
			radianToDegree: function(rad) {
				return rad * RAD_DEG;
			},
			
			/**
			 * Convert a radian into a degree
			 * @param Number rad
			 * @return Number
			 */
			radianToGrad: function(rad) {
				return rad * RAD_GRAD;
			},
			
			/**
			 * Convert a degree into a radian
			 * @param Number deg
			 * @return Number
			 */
			degreeToRadian: function(deg) {
				return deg * DEG_RAD;
			},
			
			/**
			 * Convert a degree into a radian
			 * @param Number deg
			 * @return Number
			 */
			degreeToGrad: function(deg) {
				return deg * DEG_GRAD;
			},
			
			/**
			 * Convert a grad into a degree
			 * @param Number grad
			 * @return Number
			 */
			gradToDegree: function(grad) {
				return grad * GRAD_DEG;
			},
			
			/**
			 * Convert a grad into a radian
			 * @param Number grad
			 * @return Number
			 */
			gradToRadian: function(grad) {
				return grad * GRAD_RAD;
			},
			
			/**
			 * Convert an angle with a unit to a degree
			 * @param String val angle with a unit
			 * @return Number
			 */
			toDegree: function (val) {
				var parts = rfxnum.exec(val);
				if (parts) {
					val = parseFloat( parts[2] );
					switch (parts[3] || 'deg') {
						case 'grad':
							val = $.angle.gradToDegree(val);
							break;
						case 'rad':
							val = $.angle.radianToDegree(val);
							break;
					}
					return val;
				}
				return 0;
			}
		}
	});
})(jQuery, this, this.document);
///////////////////////////////////////////////////////
// Matrix
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * Matrix object for creating matrices relevant for 2d Transformations
	 * @var Object
	 */
	if (typeof($.matrix) == 'undefined') {
		$.extend({
			matrix: {}
		});
	}
	var $m = $.matrix;
	
	$.extend( $m, {
		/**
		 * A 2-value vector
		 * @param Number x
		 * @param Number y
		 * @constructor
		 */
		V2: function(x, y){
			if ($.isArray(arguments[0])) {
				this.elements = arguments[0].slice(0, 2);
			} else {
				this.elements = [x, y];
			}
			this.length = 2;
		},
		
		/**
		 * A 2-value vector
		 * @param Number x
		 * @param Number y
		 * @param Number z
		 * @constructor
		 */
		V3: function(x, y, z){
			if ($.isArray(arguments[0])) {
				this.elements = arguments[0].slice(0, 3);
			} else {
				this.elements = [x, y, z];
			}
			this.length = 3;
		},
		
		/**
		 * A 2x2 Matrix, useful for 2D-transformations without translations
		 * @param Number mn
		 * @constructor
		 */
		M2x2: function(m11, m12, m21, m22) {
			if ($.isArray(arguments[0])) {
				this.elements = arguments[0].slice(0, 4);
			} else {
				this.elements = Array.prototype.slice.call(arguments).slice(0, 4);
			}
			this.rows = 2;
			this.cols = 2;
		},
		
		/**
		 * A 3x3 Matrix, useful for 3D-transformations without translations
		 * @param Number mn
		 * @constructor
		 */
		M3x3: function(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
			if ($.isArray(arguments[0])) {
				this.elements = arguments[0].slice(0, 9);
			} else {
				this.elements = Array.prototype.slice.call(arguments).slice(0, 9);
			}
			this.rows = 3;
			this.cols = 3;
		}
	});
	
	/** generic matrix prototype */
	var Matrix = {
		/**
		 * Return a specific element from the matrix
		 * @param Number row where 1 is the 0th row
		 * @param Number col where 1 is the 0th column
		 * @return Number
		 */
		e: function(row, col) {
			var rows = this.rows,
				cols = this.cols;
			
			// return 0 on nonsense rows and columns
			if (row > rows || col > rows || row < 1 || col < 1) {
				return 0;
			}
			
			return this.elements[(row - 1) * cols + col - 1];
		},
		
		/**
		 * Taken from Zoomooz
	     * https://github.com/jaukia/zoomooz/blob/c7a37b9a65a06ba730bd66391bbd6fe8e55d3a49/js/jquery.zoomooz.js
		 */
		decompose: function() {
			var a = this.e(1, 1),
				b = this.e(2, 1),
				c = this.e(1, 2),
				d = this.e(2, 2),
				e = this.e(1, 3),
				f = this.e(2, 3);
				
			// In case the matrix can't be decomposed
			if (Math.abs(a * d - b * c) < 0.01) {
				return {
					rotate: 0 + 'deg',
					skewX: 0 + 'deg',
					scaleX: 1,
					scaleY: 1,
					translateX: 0 + 'px',
					translateY: 0 + 'px'
				};
			}
			
			// Translate is easy
			var tx = e, ty = f;
			
			// factor out the X scale
			var sx = Math.sqrt(a * a + b * b);
			a = a/sx;
			b = b/sx;
			
			// factor out the skew
			var k = a * c + b * d;
			c -= a * k;
			d -= b * k;
			
			// factor out the Y scale
			var sy = Math.sqrt(c * c + d * d);
			c = c / sy;
			d = d / sy;
			k = k / sy;
			
			// account for negative scale
			if ((a * d - b * c) < 0.0) {
				a = -a;
				b = -b;
				//c = -c; // accomplishes nothing to negate it
				//d = -d; // accomplishes nothing to negate it
				sx = -sx;
				//sy = -sy //Scale Y shouldn't ever be negated
			}
			
			// calculate the rotation angle and skew angle
			var rad2deg = $.angle.radianToDegree;
			var r = rad2deg(Math.atan2(b, a));
			k = rad2deg(Math.atan(k));
			
			return {
				rotate: r + 'deg',
				skewX: k + 'deg',
				scaleX: sx,
				scaleY: sy,
				translateX: tx + 'px',
				translateY: ty + 'px'
			};
		}
	};
	
	/** Extend all of the matrix types with the same prototype */
	$.extend($m.M2x2.prototype, Matrix, {
		toM3x3: function() {
			var a = this.elements;
			return new $m.M3x3(
				a[0], a[1], 0,
				a[2], a[3], 0,
				0,    0,    1
			);	
		},
		
		/**
		 * Multiply a 2x2 matrix by a similar matrix or a vector
		 * @param M2x2 | V2 matrix
		 * @return M2x2 | V2
		 */
		x: function(matrix) {
			var isVector = typeof(matrix.rows) === 'undefined';
			
			// Ensure the right-sized matrix
			if (!isVector && matrix.rows == 3) {
				return this.toM3x3().x(matrix);
			}
			
			var a = this.elements,
				b = matrix.elements;
			
			if (isVector && b.length == 2) {
				// b is actually a vector
				return new $m.V2(
					a[0] * b[0] + a[1] * b[1],
					a[2] * b[0] + a[3] * b[1]
				);
			} else if (b.length == a.length) {
				// b is a 2x2 matrix
				return new $m.M2x2(
					a[0] * b[0] + a[1] * b[2],
					a[0] * b[1] + a[1] * b[3],
					
					a[2] * b[0] + a[3] * b[2],
					a[2] * b[1] + a[3] * b[3]
				);
			}
			return false; // fail
		},
		
		/**
		 * Generates an inverse of the current matrix
		 * @param void
		 * @return M2x2
		 * @link http://www.dr-lex.be/random/matrix_inv.html
		 */
		inverse: function() {
			var d = 1/this.determinant(),
				a = this.elements;
			return new $m.M2x2(
				d *  a[3], d * -a[1],
				d * -a[2], d *  a[0]
			);
		},
		
		/**
		 * Calculates the determinant of the current matrix
		 * @param void
		 * @return Number
		 * @link http://www.dr-lex.be/random/matrix_inv.html
		 */
		determinant: function() {
			var a = this.elements;
			return a[0] * a[3] - a[1] * a[2];
		}
	});
	
	$.extend($m.M3x3.prototype, Matrix, {
		/**
		 * Multiply a 3x3 matrix by a similar matrix or a vector
		 * @param M3x3 | V3 matrix
		 * @return M3x3 | V3
		 */
		x: function(matrix) {
			var isVector = typeof(matrix.rows) === 'undefined';
			
			// Ensure the right-sized matrix
			if (!isVector && matrix.rows < 3) {
				matrix = matrix.toM3x3();
			}
			
			var a = this.elements,
				b = matrix.elements;
			
			if (isVector && b.length == 3) {
				// b is actually a vector
				return new $m.V3(
					a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
					a[3] * b[0] + a[4] * b[1] + a[5] * b[2],
					a[6] * b[0] + a[7] * b[1] + a[8] * b[2]
				);
			} else if (b.length == a.length) {
				// b is a 3x3 matrix
				return new $m.M3x3(
					a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
					a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
					a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

					a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
					a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
					a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

					a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
					a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
					a[6] * b[2] + a[7] * b[5] + a[8] * b[8]
				);
			}
			return false; // fail
		},
		
		/**
		 * Generates an inverse of the current matrix
		 * @param void
		 * @return M3x3
		 * @link http://www.dr-lex.be/random/matrix_inv.html
		 */
		inverse: function() {
			var d = 1/this.determinant(),
				a = this.elements;
			return new $m.M3x3(
				d * (  a[8] * a[4] - a[7] * a[5]),
				d * (-(a[8] * a[1] - a[7] * a[2])),
				d * (  a[5] * a[1] - a[4] * a[2]),
				
				d * (-(a[8] * a[3] - a[6] * a[5])),
				d * (  a[8] * a[0] - a[6] * a[2]),
				d * (-(a[5] * a[0] - a[3] * a[2])),
				
				d * (  a[7] * a[3] - a[6] * a[4]),
				d * (-(a[7] * a[0] - a[6] * a[1])),
				d * (  a[4] * a[0] - a[3] * a[1])
			);
		},
		
		/**
		 * Calculates the determinant of the current matrix
		 * @param void
		 * @return Number
		 * @link http://www.dr-lex.be/random/matrix_inv.html
		 */
		determinant: function() {
			var a = this.elements;
			return a[0] * (a[8] * a[4] - a[7] * a[5]) - a[3] * (a[8] * a[1] - a[7] * a[2]) + a[6] * (a[5] * a[1] - a[4] * a[2]);
		}
	});
	
	/** generic vector prototype */
	var Vector = {		
		/**
		 * Return a specific element from the vector
		 * @param Number i where 1 is the 0th value
		 * @return Number
		 */
		e: function(i) {
			return this.elements[i - 1];
		}
	};
	
	/** Extend all of the vector types with the same prototype */
	$.extend($m.V2.prototype, Vector);
	$.extend($m.V3.prototype, Vector);
})(jQuery, this, this.document);
///////////////////////////////////////////////////////
// Matrix Calculations
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * Matrix object for creating matrices relevant for 2d Transformations
	 * @var Object
	 */
	if (typeof($.matrix) == 'undefined') {
		$.extend({
			matrix: {}
		});
	}
	
	$.extend( $.matrix, {
		/**
		 * Class for calculating coordinates on a matrix
		 * @param Matrix matrix
		 * @param Number outerHeight
		 * @param Number outerWidth
		 * @constructor
		 */
		calc: function(matrix, outerHeight, outerWidth) {
			/**
			 * @var Matrix
			 */
			this.matrix = matrix;
			
			/**
			 * @var Number
			 */
			this.outerHeight = outerHeight;
			
			/**
			 * @var Number
			 */
			this.outerWidth = outerWidth;
		}
	});
	
	$.matrix.calc.prototype = {
		/**
		 * Calculate a coord on the new object
		 * @return Object
		 */
		coord: function(x, y, z) {
			//default z and w
			z = typeof(z) !== 'undefined' ? z : 0;
			
			var matrix = this.matrix,
				vector;
				
			switch (matrix.rows) {
				case 2:
					vector = matrix.x(new $.matrix.V2(x, y));
					break;
				case 3:
					vector = matrix.x(new $.matrix.V3(x, y, z));
					break;
			}
			
			return vector;
		},
		
		/**
		 * Calculate the corners of the new object
		 * @return Object
		 */
		corners: function(x, y) {
			// Try to save the corners if this is called a lot
			var save = !(typeof(x) !=='undefined' || typeof(y) !=='undefined'),
				c;
			if (!this.c || !save) {
				y = y || this.outerHeight;
				x = x || this.outerWidth;
				
				c = {
					tl: this.coord(0, 0),
					bl: this.coord(0, y),
					tr: this.coord(x, 0),
					br: this.coord(x, y)
				};
			} else {
				c = this.c;
			}
			
			if (save) {
				this.c = c;
			}
			return c;
		},
		
		/**
		 * Calculate the sides of the new object
		 * @return Object
		 */
		sides: function(corners) {
			// The corners of the box
			var c = corners || this.corners();
			
			return {
				top: Math.min(c.tl.e(2), c.tr.e(2), c.br.e(2), c.bl.e(2)),
				bottom: Math.max(c.tl.e(2), c.tr.e(2), c.br.e(2), c.bl.e(2)),
				left: Math.min(c.tl.e(1), c.tr.e(1), c.br.e(1), c.bl.e(1)),
				right: Math.max(c.tl.e(1), c.tr.e(1), c.br.e(1), c.bl.e(1))
			};
		},
		
		/**
		 * Calculate the offset of the new object
		 * @return Object
		 */
		offset: function(corners) {
			// The corners of the box
			var s = this.sides(corners);
			
			// return size
			return {
				height: Math.abs(s.bottom - s.top), 
				width: Math.abs(s.right - s.left)
			};
		},
		
		/**
		 * Calculate the area of the new object
		 * @return Number
		 * @link http://en.wikipedia.org/wiki/Quadrilateral#Area_of_a_convex_quadrilateral
		 */
		area: function(corners) {
			// The corners of the box
			var c = corners || this.corners();
			
			// calculate the two diagonal vectors
			var v1 = {
					x: c.tr.e(1) - c.tl.e(1) + c.br.e(1) - c.bl.e(1),
					y: c.tr.e(2) - c.tl.e(2) + c.br.e(2) - c.bl.e(2)
				},
				v2 = {
					x: c.bl.e(1) - c.tl.e(1) + c.br.e(1) - c.tr.e(1),
					y: c.bl.e(2) - c.tl.e(2) + c.br.e(2) - c.tr.e(2)
				};
				
			return 0.25 * Math.abs(v1.e(1) * v2.e(2) - v1.e(2) * v2.e(1));
		},
		
		/**
		 * Calculate the non-affinity of the new object
		 * @return Number
		 */
		nonAffinity: function() {
			// The corners of the box
			var sides = this.sides(),
				xDiff = sides.top - sides.bottom,
				yDiff = sides.left - sides.right;
			
			return parseFloat(parseFloat(Math.abs(
				(Math.pow(xDiff, 2) + Math.pow(yDiff, 2)) /
				(sides.top * sides.bottom + sides.left * sides.right)
			)).toFixed(8));
		},
		
		/**
		 * Calculate a proper top and left for IE
		 * @param Object toOrigin
		 * @param Object fromOrigin
		 * @return Object
		 */
		originOffset: function(toOrigin, fromOrigin) {
			// the origin to translate to
			toOrigin = toOrigin ? toOrigin : new $.matrix.V2(
				this.outerWidth * 0.5,
				this.outerHeight * 0.5
			);
			
			// the origin to translate from (IE has a fixed origin of 0, 0)
			fromOrigin = fromOrigin ? fromOrigin : new $.matrix.V2(
				0,
				0
			);
			
			// transform the origins
			var toCenter = this.coord(toOrigin.e(1), toOrigin.e(2));
			var fromCenter = this.coord(fromOrigin.e(1), fromOrigin.e(2));
			
			// return the offset
			return {
				top: (fromCenter.e(2) - fromOrigin.e(2)) - (toCenter.e(2) - toOrigin.e(2)),
				left: (fromCenter.e(1) - fromOrigin.e(1)) - (toCenter.e(1) - toOrigin.e(1))
			};
		}
	};
})(jQuery, this, this.document);
///////////////////////////////////////////////////////
// 2d Matrix Functions
///////////////////////////////////////////////////////
(function($, window, document, undefined) {
	/**
	 * Matrix object for creating matrices relevant for 2d Transformations
	 * @var Object
	 */
	if (typeof($.matrix) == 'undefined') {
		$.extend({
			matrix: {}
		});
	}
	var $m = $.matrix,
		$m2x2 = $m.M2x2,
		$m3x3 = $m.M3x3;
	
	$.extend( $m, {
		/**
		 * Identity matrix
		 * @param Number size
		 * @return Matrix
		 */
		identity: function(size) {
			size = size || 2;
			var length = size * size,
				elements = new Array(length),
				mod = size + 1;
			for (var i = 0; i < length; i++) {
				elements[i] = (i % mod) === 0 ? 1 : 0;
			}
			return new $m['M'+size+'x'+size](elements);
		},
		
		/**
		 * Matrix
		 * @return Matrix
		 */
		matrix: function() {
			var args = Array.prototype.slice.call(arguments);
			// arguments are in column-major order
			switch (arguments.length) {
				case 4:
					return new $m2x2(
						args[0], args[2],
						args[1], args[3]
					);
				case 6:
					return new $m3x3(
						args[0], args[2], args[4],
						args[1], args[3], args[5],
						0,       0,       1
					);
			}
		},
		
		/**
		 * Reflect (same as rotate(180))
		 * @return Matrix
		 */
		reflect: function() {
			return new $m2x2(
				-1,  0,
				 0, -1
			);
		},
		
		/**
		 * Reflect across the x-axis (mirrored upside down)
		 * @return Matrix
		 */
		reflectX: function() {	
			return new $m2x2(
				1,  0,
				0, -1
			);
		},
		
		/**
		 * Reflect by swapping x an y (same as reflectX + rotate(-90))
		 * @return Matrix
		 */
		reflectXY: function() {
			return new $m2x2(
				0, 1,
				1, 0
			);
		},
		
		/**
		 * Reflect across the y-axis (mirrored)
		 * @return Matrix
		 */
		reflectY: function() {
			return new $m2x2(
				-1, 0,
				 0, 1
			);
		},
		
		/**
		 * Rotates around the origin
		 * @param Number deg
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#RotationDefined
		 */
		rotate: function(deg) {
			//TODO: detect units
			var rad = $.angle.degreeToRadian(deg),
				costheta = Math.cos(rad),
				sintheta = Math.sin(rad);
			
			var a = costheta,
				b = sintheta,
				c = -sintheta,
				d = costheta;
				
			return new $m2x2(
				a, c,
				b, d
			);
		},
		
		/**
		 * Scale
		 * @param Number sx
		 * @param Number sy
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#ScalingDefined
		 */
		scale: function (sx, sy) {
			sx = sx || sx === 0 ? sx : 1;
			sy = sy || sy === 0 ? sy : sx;
			
			return new $m2x2(
				sx, 0,
				0, sy
			);
		},
		
		/**
		 * Scale on the X-axis
		 * @param Number sx
		 * @return Matrix
		 */
		scaleX: function (sx) {
			return $m.scale(sx, 1);
		},
		
		/**
		 * Scale on the Y-axis
		 * @param Number sy
		 * @return Matrix
		 */
		scaleY: function (sy) {
			return $m.scale(1, sy);
		},
		
		/**
		 * Skews on the X-axis and Y-axis
		 * @param Number degX
		 * @param Number degY
		 * @return Matrix
		 */
		skew: function (degX, degY) {
			degX = degX || 0;
			degY = degY || 0;
			
			//TODO: detect units
			var radX = $.angle.degreeToRadian(degX),
				radY = $.angle.degreeToRadian(degY),
				x = Math.tan(radX),
				y = Math.tan(radY);
			
			return new $m2x2(
				1, x,
				y, 1
			);
		},
		
		/**
		 * Skews on the X-axis
		 * @param Number degX
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#SkewXDefined
		 */
		skewX: function (degX) {
			return $m.skew(degX);
		},
		
		/**
		 * Skews on the Y-axis
		 * @param Number degY
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#SkewYDefined
		 */
		skewY: function (degY) {
			return $m.skew(0, degY);
		},
		
		/**
		 * Translate
		 * @param Number tx
		 * @param Number ty
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#TranslationDefined
		 */
		translate: function (tx, ty) {
			tx = tx || 0;
			ty = ty || 0;
			
			return new $m3x3(
				1, 0, tx,
				0, 1, ty,
				0, 0, 1
			);
		},
		
		/**
		 * Translate on the X-axis
		 * @param Number tx
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#TranslationDefined
		 */
		translateX: function (tx) {
			return $m.translate(tx);
		},
		
		/**
		 * Translate on the Y-axis
		 * @param Number ty
		 * @return Matrix
		 * @link http://www.w3.org/TR/SVG/coords.html#TranslationDefined
		 */
		translateY: function (ty) {
			return $m.translate(0, ty);
		}
	});
})(jQuery, this, this.document);
// # Sylvester
// Vector and Matrix mathematics modules for JavaScript
// Copyright (c) 2007 James Coglan
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var Sylvester = {
  version: '0.1.3',
  precision: 1e-6
};

function Vector() {}
Vector.prototype = {

  // Returns element i of the vector
  e: function(i) {
    return (i < 1 || i > this.elements.length) ? null : this.elements[i-1];
  },

  // Returns the number of elements the vector has
  dimensions: function() {
    return this.elements.length;
  },

  // Returns the modulus ('length') of the vector
  modulus: function() {
    return Math.sqrt(this.dot(this));
  },

  // Returns true iff the vector is equal to the argument
  eql: function(vector) {
    var n = this.elements.length;
    var V = vector.elements || vector;
    if (n != V.length) { return false; }
    do {
      if (Math.abs(this.elements[n-1] - V[n-1]) > Sylvester.precision) { return false; }
    } while (--n);
    return true;
  },

  // Returns a copy of the vector
  dup: function() {
    return Vector.create(this.elements);
  },

  // Maps the vector to another vector according to the given function
  map: function(fn) {
    var elements = [];
    this.each(function(x, i) {
      elements.push(fn(x, i));
    });
    return Vector.create(elements);
  },
  
  // Calls the iterator for each element of the vector in turn
  each: function(fn) {
    var n = this.elements.length, k = n, i;
    do { i = k - n;
      fn(this.elements[i], i+1);
    } while (--n);
  },

  // Returns a new vector created by normalizing the receiver
  toUnitVector: function() {
    var r = this.modulus();
    if (r === 0) { return this.dup(); }
    return this.map(function(x) { return x/r; });
  },

  // Returns the angle between the vector and the argument (also a vector)
  angleFrom: function(vector) {
    var V = vector.elements || vector;
    var n = this.elements.length, k = n, i;
    if (n != V.length) { return null; }
    var dot = 0, mod1 = 0, mod2 = 0;
    // Work things out in parallel to save time
    this.each(function(x, i) {
      dot += x * V[i-1];
      mod1 += x * x;
      mod2 += V[i-1] * V[i-1];
    });
    mod1 = Math.sqrt(mod1); mod2 = Math.sqrt(mod2);
    if (mod1*mod2 === 0) { return null; }
    var theta = dot / (mod1*mod2);
    if (theta < -1) { theta = -1; }
    if (theta > 1) { theta = 1; }
    return Math.acos(theta);
  },

  // Returns true iff the vector is parallel to the argument
  isParallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : (angle <= Sylvester.precision);
  },

  // Returns true iff the vector is antiparallel to the argument
  isAntiparallelTo: function(vector) {
    var angle = this.angleFrom(vector);
    return (angle === null) ? null : (Math.abs(angle - Math.PI) <= Sylvester.precision);
  },

  // Returns true iff the vector is perpendicular to the argument
  isPerpendicularTo: function(vector) {
    var dot = this.dot(vector);
    return (dot === null) ? null : (Math.abs(dot) <= Sylvester.precision);
  },

  // Returns the result of adding the argument to the vector
  add: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    return this.map(function(x, i) { return x + V[i-1]; });
  },

  // Returns the result of subtracting the argument from the vector
  subtract: function(vector) {
    var V = vector.elements || vector;
    if (this.elements.length != V.length) { return null; }
    return this.map(function(x, i) { return x - V[i-1]; });
  },

  // Returns the result of multiplying the elements of the vector by the argument
  multiply: function(k) {
    return this.map(function(x) { return x*k; });
  },

  x: function(k) { return this.multiply(k); },

  // Returns the scalar product of the vector with the argument
  // Both vectors must have equal dimensionality
  dot: function(vector) {
    var V = vector.elements || vector;
    var i, product = 0, n = this.elements.length;
    if (n != V.length) { return null; }
    do { product += this.elements[n-1] * V[n-1]; } while (--n);
    return product;
  },

  // Returns the vector product of the vector with the argument
  // Both vectors must have dimensionality 3
  cross: function(vector) {
    var B = vector.elements || vector;
    if (this.elements.length != 3 || B.length != 3) { return null; }
    var A = this.elements;
    return Vector.create([
      (A[1] * B[2]) - (A[2] * B[1]),
      (A[2] * B[0]) - (A[0] * B[2]),
      (A[0] * B[1]) - (A[1] * B[0])
    ]);
  },

  // Returns the (absolute) largest element of the vector
  max: function() {
    var m = 0, n = this.elements.length, k = n, i;
    do { i = k - n;
      if (Math.abs(this.elements[i]) > Math.abs(m)) { m = this.elements[i]; }
    } while (--n);
    return m;
  },

  // Returns the index of the first match found
  indexOf: function(x) {
    var index = null, n = this.elements.length, k = n, i;
    do { i = k - n;
      if (index === null && this.elements[i] == x) {
        index = i + 1;
      }
    } while (--n);
    return index;
  },

  // Returns a diagonal matrix with the vector's elements as its diagonal elements
  toDiagonalMatrix: function() {
    return Matrix.Diagonal(this.elements);
  },

  // Returns the result of rounding the elements of the vector
  round: function() {
    return this.map(function(x) { return Math.round(x); });
  },

  // Returns a copy of the vector with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(y) {
      return (Math.abs(y - x) <= Sylvester.precision) ? x : y;
    });
  },

  // Returns the vector's distance from the argument, when considered as a point in space
  distanceFrom: function(obj) {
    if (obj.anchor) { return obj.distanceFrom(this); }
    var V = obj.elements || obj;
    if (V.length != this.elements.length) { return null; }
    var sum = 0, part;
    this.each(function(x, i) {
      part = x - V[i-1];
      sum += part * part;
    });
    return Math.sqrt(sum);
  },

  // Returns true if the vector is point on the given line
  liesOn: function(line) {
    return line.contains(this);
  },

  // Return true iff the vector is a point in the given plane
  liesIn: function(plane) {
    return plane.contains(this);
  },

  // Rotates the vector about the given object. The object should be a 
  // point if the vector is 2D, and a line if it is 3D. Be careful with line directions!
  rotate: function(t, obj) {
    var V, R, x, y, z;
    switch (this.elements.length) {
      case 2:
        V = obj.elements || obj;
        if (V.length != 2) { return null; }
        R = Matrix.Rotation(t).elements;
        x = this.elements[0] - V[0];
        y = this.elements[1] - V[1];
        return Vector.create([
          V[0] + R[0][0] * x + R[0][1] * y,
          V[1] + R[1][0] * x + R[1][1] * y
        ]);
        break;
      case 3:
        if (!obj.direction) { return null; }
        var C = obj.pointClosestTo(this).elements;
        R = Matrix.Rotation(t, obj.direction).elements;
        x = this.elements[0] - C[0];
        y = this.elements[1] - C[1];
        z = this.elements[2] - C[2];
        return Vector.create([
          C[0] + R[0][0] * x + R[0][1] * y + R[0][2] * z,
          C[1] + R[1][0] * x + R[1][1] * y + R[1][2] * z,
          C[2] + R[2][0] * x + R[2][1] * y + R[2][2] * z
        ]);
        break;
      default:
        return null;
    }
  },

  // Returns the result of reflecting the point in the given point, line or plane
  reflectionIn: function(obj) {
    if (obj.anchor) {
      // obj is a plane or line
      var P = this.elements.slice();
      var C = obj.pointClosestTo(P).elements;
      return Vector.create([C[0] + (C[0] - P[0]), C[1] + (C[1] - P[1]), C[2] + (C[2] - (P[2] || 0))]);
    } else {
      // obj is a point
      var Q = obj.elements || obj;
      if (this.elements.length != Q.length) { return null; }
      return this.map(function(x, i) { return Q[i-1] + (Q[i-1] - x); });
    }
  },

  // Utility to make sure vectors are 3D. If they are 2D, a zero z-component is added
  to3D: function() {
    var V = this.dup();
    switch (V.elements.length) {
      case 3: break;
      case 2: V.elements.push(0); break;
      default: return null;
    }
    return V;
  },

  // Returns a string representation of the vector
  inspect: function() {
    return '[' + this.elements.join(', ') + ']';
  },

  // Set vector's elements from an array
  setElements: function(els) {
    this.elements = (els.elements || els).slice();
    return this;
  }
};
  
// Constructor function
Vector.create = function(elements) {
  var V = new Vector();
  return V.setElements(elements);
};

// i, j, k unit vectors
Vector.i = Vector.create([1,0,0]);
Vector.j = Vector.create([0,1,0]);
Vector.k = Vector.create([0,0,1]);

// Random vector of size n
Vector.Random = function(n) {
  var elements = [];
  do { elements.push(Math.random());
  } while (--n);
  return Vector.create(elements);
};

// Vector filled with zeros
Vector.Zero = function(n) {
  var elements = [];
  do { elements.push(0);
  } while (--n);
  return Vector.create(elements);
};



function Matrix() {}
Matrix.prototype = {

  // Returns element (i,j) of the matrix
  e: function(i,j) {
    if (i < 1 || i > this.elements.length || j < 1 || j > this.elements[0].length) { return null; }
    return this.elements[i-1][j-1];
  },

  // Returns row k of the matrix as a vector
  row: function(i) {
    if (i > this.elements.length) { return null; }
    return Vector.create(this.elements[i-1]);
  },

  // Returns column k of the matrix as a vector
  col: function(j) {
    if (j > this.elements[0].length) { return null; }
    var col = [], n = this.elements.length, k = n, i;
    do { i = k - n;
      col.push(this.elements[i][j-1]);
    } while (--n);
    return Vector.create(col);
  },

  // Returns the number of rows/columns the matrix has
  dimensions: function() {
    return {rows: this.elements.length, cols: this.elements[0].length};
  },

  // Returns the number of rows in the matrix
  rows: function() {
    return this.elements.length;
  },

  // Returns the number of columns in the matrix
  cols: function() {
    return this.elements[0].length;
  },

  // Returns true iff the matrix is equal to the argument. You can supply
  // a vector as the argument, in which case the receiver must be a
  // one-column matrix equal to the vector.
  eql: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (this.elements.length != M.length ||
        this.elements[0].length != M[0].length) { return false; }
    var ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(this.elements[i][j] - M[i][j]) > Sylvester.precision) { return false; }
      } while (--nj);
    } while (--ni);
    return true;
  },

  // Returns a copy of the matrix
  dup: function() {
    return Matrix.create(this.elements);
  },

  // Maps the matrix to another matrix (of the same dimensions) according to the given function
  map: function(fn) {
    var els = [], ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      els[i] = [];
      do { j = kj - nj;
        els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
      } while (--nj);
    } while (--ni);
    return Matrix.create(els);
  },

  // Returns true iff the argument has the same dimensions as the matrix
  isSameSizeAs: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    return (this.elements.length == M.length &&
        this.elements[0].length == M[0].length);
  },

  // Returns the result of adding the argument to the matrix
  add: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    return this.map(function(x, i, j) { return x + M[i-1][j-1]; });
  },

  // Returns the result of subtracting the argument from the matrix
  subtract: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.isSameSizeAs(M)) { return null; }
    return this.map(function(x, i, j) { return x - M[i-1][j-1]; });
  },

  // Returns true iff the matrix can multiply the argument from the left
  canMultiplyFromLeft: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    // this.columns should equal matrix.rows
    return (this.elements[0].length == M.length);
  },

  // Returns the result of multiplying the matrix from the right by the argument.
  // If the argument is a scalar then just multiply all the elements. If the argument is
  // a vector, a vector is returned, which saves you having to remember calling
  // col(1) on the result.
  multiply: function(matrix) {
    if (!matrix.elements) {
      return this.map(function(x) { return x * matrix; });
    }
    var returnVector = matrix.modulus ? true : false;
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    if (!this.canMultiplyFromLeft(M)) { return null; }
    var ni = this.elements.length, ki = ni, i, nj, kj = M[0].length, j;
    var cols = this.elements[0].length, elements = [], sum, nc, c;
    do { i = ki - ni;
      elements[i] = [];
      nj = kj;
      do { j = kj - nj;
        sum = 0;
        nc = cols;
        do { c = cols - nc;
          sum += this.elements[i][c] * M[c][j];
        } while (--nc);
        elements[i][j] = sum;
      } while (--nj);
    } while (--ni);
    var M = Matrix.create(elements);
    return returnVector ? M.col(1) : M;
  },

  x: function(matrix) { return this.multiply(matrix); },

  // Returns a submatrix taken from the matrix
  // Argument order is: start row, start col, nrows, ncols
  // Element selection wraps if the required index is outside the matrix's bounds, so you could
  // use this to perform row/column cycling or copy-augmenting.
  minor: function(a, b, c, d) {
    var elements = [], ni = c, i, nj, j;
    var rows = this.elements.length, cols = this.elements[0].length;
    do { i = c - ni;
      elements[i] = [];
      nj = d;
      do { j = d - nj;
        elements[i][j] = this.elements[(a+i-1)%rows][(b+j-1)%cols];
      } while (--nj);
    } while (--ni);
    return Matrix.create(elements);
  },

  // Returns the transpose of the matrix
  transpose: function() {
    var rows = this.elements.length, cols = this.elements[0].length;
    var elements = [], ni = cols, i, nj, j;
    do { i = cols - ni;
      elements[i] = [];
      nj = rows;
      do { j = rows - nj;
        elements[i][j] = this.elements[j][i];
      } while (--nj);
    } while (--ni);
    return Matrix.create(elements);
  },

  // Returns true iff the matrix is square
  isSquare: function() {
    return (this.elements.length == this.elements[0].length);
  },

  // Returns the (absolute) largest element of the matrix
  max: function() {
    var m = 0, ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(this.elements[i][j]) > Math.abs(m)) { m = this.elements[i][j]; }
      } while (--nj);
    } while (--ni);
    return m;
  },

  // Returns the indeces of the first match found by reading row-by-row from left to right
  indexOf: function(x) {
    var index = null, ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (this.elements[i][j] == x) { return {i: i+1, j: j+1}; }
      } while (--nj);
    } while (--ni);
    return null;
  },

  // If the matrix is square, returns the diagonal elements as a vector.
  // Otherwise, returns null.
  diagonal: function() {
    if (!this.isSquare) { return null; }
    var els = [], n = this.elements.length, k = n, i;
    do { i = k - n;
      els.push(this.elements[i][i]);
    } while (--n);
    return Vector.create(els);
  },

  // Make the matrix upper (right) triangular by Gaussian elimination.
  // This method only adds multiples of rows to other rows. No rows are
  // scaled up or switched, and the determinant is preserved.
  toRightTriangular: function() {
    var M = this.dup(), els;
    var n = this.elements.length, k = n, i, np, kp = this.elements[0].length, p;
    do { i = k - n;
      if (M.elements[i][i] == 0) {
        for (j = i + 1; j < k; j++) {
          if (M.elements[j][i] != 0) {
            els = []; np = kp;
            do { p = kp - np;
              els.push(M.elements[i][p] + M.elements[j][p]);
            } while (--np);
            M.elements[i] = els;
            break;
          }
        }
      }
      if (M.elements[i][i] != 0) {
        for (j = i + 1; j < k; j++) {
          var multiplier = M.elements[j][i] / M.elements[i][i];
          els = []; np = kp;
          do { p = kp - np;
            // Elements with column numbers up to an including the number
            // of the row that we're subtracting can safely be set straight to
            // zero, since that's the point of this routine and it avoids having
            // to loop over and correct rounding errors later
            els.push(p <= i ? 0 : M.elements[j][p] - M.elements[i][p] * multiplier);
          } while (--np);
          M.elements[j] = els;
        }
      }
    } while (--n);
    return M;
  },

  toUpperTriangular: function() { return this.toRightTriangular(); },

  // Returns the determinant for square matrices
  determinant: function() {
    if (!this.isSquare()) { return null; }
    var M = this.toRightTriangular();
    var det = M.elements[0][0], n = M.elements.length - 1, k = n, i;
    do { i = k - n + 1;
      det = det * M.elements[i][i];
    } while (--n);
    return det;
  },

  det: function() { return this.determinant(); },

  // Returns true iff the matrix is singular
  isSingular: function() {
    return (this.isSquare() && this.determinant() === 0);
  },

  // Returns the trace for square matrices
  trace: function() {
    if (!this.isSquare()) { return null; }
    var tr = this.elements[0][0], n = this.elements.length - 1, k = n, i;
    do { i = k - n + 1;
      tr += this.elements[i][i];
    } while (--n);
    return tr;
  },

  tr: function() { return this.trace(); },

  // Returns the rank of the matrix
  rank: function() {
    var M = this.toRightTriangular(), rank = 0;
    var ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        if (Math.abs(M.elements[i][j]) > Sylvester.precision) { rank++; break; }
      } while (--nj);
    } while (--ni);
    return rank;
  },
  
  rk: function() { return this.rank(); },

  // Returns the result of attaching the given argument to the right-hand side of the matrix
  augment: function(matrix) {
    var M = matrix.elements || matrix;
    if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
    var T = this.dup(), cols = T.elements[0].length;
    var ni = T.elements.length, ki = ni, i, nj, kj = M[0].length, j;
    if (ni != M.length) { return null; }
    do { i = ki - ni;
      nj = kj;
      do { j = kj - nj;
        T.elements[i][cols + j] = M[i][j];
      } while (--nj);
    } while (--ni);
    return T;
  },

  // Returns the inverse (if one exists) using Gauss-Jordan
  inverse: function() {
    if (!this.isSquare() || this.isSingular()) { return null; }
    var ni = this.elements.length, ki = ni, i, j;
    var M = this.augment(Matrix.I(ni)).toRightTriangular();
    var np, kp = M.elements[0].length, p, els, divisor;
    var inverse_elements = [], new_element;
    // Matrix is non-singular so there will be no zeros on the diagonal
    // Cycle through rows from last to first
    do { i = ni - 1;
      // First, normalise diagonal elements to 1
      els = []; np = kp;
      inverse_elements[i] = [];
      divisor = M.elements[i][i];
      do { p = kp - np;
        new_element = M.elements[i][p] / divisor;
        els.push(new_element);
        // Shuffle of the current row of the right hand side into the results
        // array as it will not be modified by later runs through this loop
        if (p >= ki) { inverse_elements[i].push(new_element); }
      } while (--np);
      M.elements[i] = els;
      // Then, subtract this row from those above it to
      // give the identity matrix on the left hand side
      for (j = 0; j < i; j++) {
        els = []; np = kp;
        do { p = kp - np;
          els.push(M.elements[j][p] - M.elements[i][p] * M.elements[j][i]);
        } while (--np);
        M.elements[j] = els;
      }
    } while (--ni);
    return Matrix.create(inverse_elements);
  },

  inv: function() { return this.inverse(); },

  // Returns the result of rounding all the elements
  round: function() {
    return this.map(function(x) { return Math.round(x); });
  },

  // Returns a copy of the matrix with elements set to the given value if they
  // differ from it by less than Sylvester.precision
  snapTo: function(x) {
    return this.map(function(p) {
      return (Math.abs(p - x) <= Sylvester.precision) ? x : p;
    });
  },

  // Returns a string representation of the matrix
  inspect: function() {
    var matrix_rows = [];
    var n = this.elements.length, k = n, i;
    do { i = k - n;
      matrix_rows.push(Vector.create(this.elements[i]).inspect());
    } while (--n);
    return matrix_rows.join('\n');
  },

  // Set the matrix's elements from an array. If the argument passed
  // is a vector, the resulting matrix will be a single column.
  setElements: function(els) {
    var i, elements = els.elements || els;
    if (typeof(elements[0][0]) != 'undefined') {
      var ni = elements.length, ki = ni, nj, kj, j;
      this.elements = [];
      do { i = ki - ni;
        nj = elements[i].length; kj = nj;
        this.elements[i] = [];
        do { j = kj - nj;
          this.elements[i][j] = elements[i][j];
        } while (--nj);
      } while(--ni);
      return this;
    }
    var n = elements.length, k = n;
    this.elements = [];
    do { i = k - n;
      this.elements.push([elements[i]]);
    } while (--n);
    return this;
  }
};

// Constructor function
Matrix.create = function(elements) {
  var M = new Matrix();
  return M.setElements(elements);
};

// Identity matrix of size n
Matrix.I = function(n) {
  var els = [], k = n, i, nj, j;
  do { i = k - n;
    els[i] = []; nj = k;
    do { j = k - nj;
      els[i][j] = (i == j) ? 1 : 0;
    } while (--nj);
  } while (--n);
  return Matrix.create(els);
};

// Diagonal matrix - all off-diagonal elements are zero
Matrix.Diagonal = function(elements) {
  var n = elements.length, k = n, i;
  var M = Matrix.I(n);
  do { i = k - n;
    M.elements[i][i] = elements[i];
  } while (--n);
  return M;
};

// Rotation matrix about some axis. If no axis is
// supplied, assume we're after a 2D transform
Matrix.Rotation = function(theta, a) {
  if (!a) {
    return Matrix.create([
      [Math.cos(theta),  -Math.sin(theta)],
      [Math.sin(theta),   Math.cos(theta)]
    ]);
  }
  var axis = a.dup();
  if (axis.elements.length != 3) { return null; }
  var mod = axis.modulus();
  var x = axis.elements[0]/mod, y = axis.elements[1]/mod, z = axis.elements[2]/mod;
  var s = Math.sin(theta), c = Math.cos(theta), t = 1 - c;
  // Formula derived here: http://www.gamedev.net/reference/articles/article1199.asp
  // That proof rotates the co-ordinate system so theta
  // becomes -theta and sin becomes -sin here.
  return Matrix.create([
    [ t*x*x + c, t*x*y - s*z, t*x*z + s*y ],
    [ t*x*y + s*z, t*y*y + c, t*y*z - s*x ],
    [ t*x*z - s*y, t*y*z + s*x, t*z*z + c ]
  ]);
};

// Special case rotations
Matrix.RotationX = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  1,  0,  0 ],
    [  0,  c, -s ],
    [  0,  s,  c ]
  ]);
};
Matrix.RotationY = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  c,  0,  s ],
    [  0,  1,  0 ],
    [ -s,  0,  c ]
  ]);
};
Matrix.RotationZ = function(t) {
  var c = Math.cos(t), s = Math.sin(t);
  return Matrix.create([
    [  c, -s,  0 ],
    [  s,  c,  0 ],
    [  0,  0,  1 ]
  ]);
};

// Random matrix of n rows, m columns
Matrix.Random = function(n, m) {
  return Matrix.Zero(n, m).map(
    function() { return Math.random(); }
  );
};

// Matrix filled with zeros
Matrix.Zero = function(n, m) {
  var els = [], ni = n, i, nj, j;
  do { i = n - ni;
    els[i] = [];
    nj = m;
    do { j = m - nj;
      els[i][j] = 0;
    } while (--nj);
  } while (--ni);
  return Matrix.create(els);
};



function Line() {}
Line.prototype = {

  // Returns true if the argument occupies the same space as the line
  eql: function(line) {
    return (this.isParallelTo(line) && this.contains(line.anchor));
  },

  // Returns a copy of the line
  dup: function() {
    return Line.create(this.anchor, this.direction);
  },

  // Returns the result of translating the line by the given vector/array
  translate: function(vector) {
    var V = vector.elements || vector;
    return Line.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.direction);
  },

  // Returns true if the line is parallel to the argument. Here, 'parallel to'
  // means that the argument's direction is either parallel or antiparallel to
  // the line's own direction. A line is parallel to a plane if the two do not
  // have a unique intersection.
  isParallelTo: function(obj) {
    if (obj.normal) { return obj.isParallelTo(this); }
    var theta = this.direction.angleFrom(obj.direction);
    return (Math.abs(theta) <= Sylvester.precision || Math.abs(theta - Math.PI) <= Sylvester.precision);
  },

  // Returns the line's perpendicular distance from the argument,
  // which can be a point, a line or a plane
  distanceFrom: function(obj) {
    if (obj.normal) { return obj.distanceFrom(this); }
    if (obj.direction) {
      // obj is a line
      if (this.isParallelTo(obj)) { return this.distanceFrom(obj.anchor); }
      var N = this.direction.cross(obj.direction).toUnitVector().elements;
      var A = this.anchor.elements, B = obj.anchor.elements;
      return Math.abs((A[0] - B[0]) * N[0] + (A[1] - B[1]) * N[1] + (A[2] - B[2]) * N[2]);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      var A = this.anchor.elements, D = this.direction.elements;
      var PA1 = P[0] - A[0], PA2 = P[1] - A[1], PA3 = (P[2] || 0) - A[2];
      var modPA = Math.sqrt(PA1*PA1 + PA2*PA2 + PA3*PA3);
      if (modPA === 0) return 0;
      // Assumes direction vector is normalized
      var cosTheta = (PA1 * D[0] + PA2 * D[1] + PA3 * D[2]) / modPA;
      var sin2 = 1 - cosTheta*cosTheta;
      return Math.abs(modPA * Math.sqrt(sin2 < 0 ? 0 : sin2));
    }
  },

  // Returns true iff the argument is a point on the line
  contains: function(point) {
    var dist = this.distanceFrom(point);
    return (dist !== null && dist <= Sylvester.precision);
  },

  // Returns true iff the line lies in the given plane
  liesIn: function(plane) {
    return plane.contains(this);
  },

  // Returns true iff the line has a unique point of intersection with the argument
  intersects: function(obj) {
    if (obj.normal) { return obj.intersects(this); }
    return (!this.isParallelTo(obj) && this.distanceFrom(obj) <= Sylvester.precision);
  },

  // Returns the unique intersection point with the argument, if one exists
  intersectionWith: function(obj) {
    if (obj.normal) { return obj.intersectionWith(this); }
    if (!this.intersects(obj)) { return null; }
    var P = this.anchor.elements, X = this.direction.elements,
        Q = obj.anchor.elements, Y = obj.direction.elements;
    var X1 = X[0], X2 = X[1], X3 = X[2], Y1 = Y[0], Y2 = Y[1], Y3 = Y[2];
    var PsubQ1 = P[0] - Q[0], PsubQ2 = P[1] - Q[1], PsubQ3 = P[2] - Q[2];
    var XdotQsubP = - X1*PsubQ1 - X2*PsubQ2 - X3*PsubQ3;
    var YdotPsubQ = Y1*PsubQ1 + Y2*PsubQ2 + Y3*PsubQ3;
    var XdotX = X1*X1 + X2*X2 + X3*X3;
    var YdotY = Y1*Y1 + Y2*Y2 + Y3*Y3;
    var XdotY = X1*Y1 + X2*Y2 + X3*Y3;
    var k = (XdotQsubP * YdotY / XdotX + XdotY * YdotPsubQ) / (YdotY - XdotY * XdotY);
    return Vector.create([P[0] + k*X1, P[1] + k*X2, P[2] + k*X3]);
  },

  // Returns the point on the line that is closest to the given point or line
  pointClosestTo: function(obj) {
    if (obj.direction) {
      // obj is a line
      if (this.intersects(obj)) { return this.intersectionWith(obj); }
      if (this.isParallelTo(obj)) { return null; }
      var D = this.direction.elements, E = obj.direction.elements;
      var D1 = D[0], D2 = D[1], D3 = D[2], E1 = E[0], E2 = E[1], E3 = E[2];
      // Create plane containing obj and the shared normal and intersect this with it
      // Thank you: http://www.cgafaq.info/wiki/Line-line_distance
      var x = (D3 * E1 - D1 * E3), y = (D1 * E2 - D2 * E1), z = (D2 * E3 - D3 * E2);
      var N = Vector.create([x * E3 - y * E2, y * E1 - z * E3, z * E2 - x * E1]);
      var P = Plane.create(obj.anchor, N);
      return P.intersectionWith(this);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      if (this.contains(P)) { return Vector.create(P); }
      var A = this.anchor.elements, D = this.direction.elements;
      var D1 = D[0], D2 = D[1], D3 = D[2], A1 = A[0], A2 = A[1], A3 = A[2];
      var x = D1 * (P[1]-A2) - D2 * (P[0]-A1), y = D2 * ((P[2] || 0) - A3) - D3 * (P[1]-A2),
          z = D3 * (P[0]-A1) - D1 * ((P[2] || 0) - A3);
      var V = Vector.create([D2 * x - D3 * z, D3 * y - D1 * x, D1 * z - D2 * y]);
      var k = this.distanceFrom(P) / V.modulus();
      return Vector.create([
        P[0] + V.elements[0] * k,
        P[1] + V.elements[1] * k,
        (P[2] || 0) + V.elements[2] * k
      ]);
    }
  },

  // Returns a copy of the line rotated by t radians about the given line. Works by
  // finding the argument's closest point to this line's anchor point (call this C) and
  // rotating the anchor about C. Also rotates the line's direction about the argument's.
  // Be careful with this - the rotation axis' direction affects the outcome!
  rotate: function(t, line) {
    // If we're working in 2D
    if (typeof(line.direction) == 'undefined') { line = Line.create(line.to3D(), Vector.k); }
    var R = Matrix.Rotation(t, line.direction).elements;
    var C = line.pointClosestTo(this.anchor).elements;
    var A = this.anchor.elements, D = this.direction.elements;
    var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
    var x = A1 - C1, y = A2 - C2, z = A3 - C3;
    return Line.create([
      C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z,
      C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z,
      C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z
    ], [
      R[0][0] * D[0] + R[0][1] * D[1] + R[0][2] * D[2],
      R[1][0] * D[0] + R[1][1] * D[1] + R[1][2] * D[2],
      R[2][0] * D[0] + R[2][1] * D[1] + R[2][2] * D[2]
    ]);
  },

  // Returns the line's reflection in the given point or line
  reflectionIn: function(obj) {
    if (obj.normal) {
      // obj is a plane
      var A = this.anchor.elements, D = this.direction.elements;
      var A1 = A[0], A2 = A[1], A3 = A[2], D1 = D[0], D2 = D[1], D3 = D[2];
      var newA = this.anchor.reflectionIn(obj).elements;
      // Add the line's direction vector to its anchor, then mirror that in the plane
      var AD1 = A1 + D1, AD2 = A2 + D2, AD3 = A3 + D3;
      var Q = obj.pointClosestTo([AD1, AD2, AD3]).elements;
      var newD = [Q[0] + (Q[0] - AD1) - newA[0], Q[1] + (Q[1] - AD2) - newA[1], Q[2] + (Q[2] - AD3) - newA[2]];
      return Line.create(newA, newD);
    } else if (obj.direction) {
      // obj is a line - reflection obtained by rotating PI radians about obj
      return this.rotate(Math.PI, obj);
    } else {
      // obj is a point - just reflect the line's anchor in it
      var P = obj.elements || obj;
      return Line.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.direction);
    }
  },

  // Set the line's anchor point and direction.
  setVectors: function(anchor, direction) {
    // Need to do this so that line's properties are not
    // references to the arguments passed in
    anchor = Vector.create(anchor);
    direction = Vector.create(direction);
    if (anchor.elements.length == 2) {anchor.elements.push(0); }
    if (direction.elements.length == 2) { direction.elements.push(0); }
    if (anchor.elements.length > 3 || direction.elements.length > 3) { return null; }
    var mod = direction.modulus();
    if (mod === 0) { return null; }
    this.anchor = anchor;
    this.direction = Vector.create([
      direction.elements[0] / mod,
      direction.elements[1] / mod,
      direction.elements[2] / mod
    ]);
    return this;
  }
};

  
// Constructor function
Line.create = function(anchor, direction) {
  var L = new Line();
  return L.setVectors(anchor, direction);
};

// Axes
Line.X = Line.create(Vector.Zero(3), Vector.i);
Line.Y = Line.create(Vector.Zero(3), Vector.j);
Line.Z = Line.create(Vector.Zero(3), Vector.k);



function Plane() {}
Plane.prototype = {

  // Returns true iff the plane occupies the same space as the argument
  eql: function(plane) {
    return (this.contains(plane.anchor) && this.isParallelTo(plane));
  },

  // Returns a copy of the plane
  dup: function() {
    return Plane.create(this.anchor, this.normal);
  },

  // Returns the result of translating the plane by the given vector
  translate: function(vector) {
    var V = vector.elements || vector;
    return Plane.create([
      this.anchor.elements[0] + V[0],
      this.anchor.elements[1] + V[1],
      this.anchor.elements[2] + (V[2] || 0)
    ], this.normal);
  },

  // Returns true iff the plane is parallel to the argument. Will return true
  // if the planes are equal, or if you give a line and it lies in the plane.
  isParallelTo: function(obj) {
    var theta;
    if (obj.normal) {
      // obj is a plane
      theta = this.normal.angleFrom(obj.normal);
      return (Math.abs(theta) <= Sylvester.precision || Math.abs(Math.PI - theta) <= Sylvester.precision);
    } else if (obj.direction) {
      // obj is a line
      return this.normal.isPerpendicularTo(obj.direction);
    }
    return null;
  },
  
  // Returns true iff the receiver is perpendicular to the argument
  isPerpendicularTo: function(plane) {
    var theta = this.normal.angleFrom(plane.normal);
    return (Math.abs(Math.PI/2 - theta) <= Sylvester.precision);
  },

  // Returns the plane's distance from the given object (point, line or plane)
  distanceFrom: function(obj) {
    if (this.intersects(obj) || this.contains(obj)) { return 0; }
    if (obj.anchor) {
      // obj is a plane or line
      var A = this.anchor.elements, B = obj.anchor.elements, N = this.normal.elements;
      return Math.abs((A[0] - B[0]) * N[0] + (A[1] - B[1]) * N[1] + (A[2] - B[2]) * N[2]);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      var A = this.anchor.elements, N = this.normal.elements;
      return Math.abs((A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2]);
    }
  },

  // Returns true iff the plane contains the given point or line
  contains: function(obj) {
    if (obj.normal) { return null; }
    if (obj.direction) {
      return (this.contains(obj.anchor) && this.contains(obj.anchor.add(obj.direction)));
    } else {
      var P = obj.elements || obj;
      var A = this.anchor.elements, N = this.normal.elements;
      var diff = Math.abs(N[0]*(A[0] - P[0]) + N[1]*(A[1] - P[1]) + N[2]*(A[2] - (P[2] || 0)));
      return (diff <= Sylvester.precision);
    }
  },

  // Returns true iff the plane has a unique point/line of intersection with the argument
  intersects: function(obj) {
    if (typeof(obj.direction) == 'undefined' && typeof(obj.normal) == 'undefined') { return null; }
    return !this.isParallelTo(obj);
  },

  // Returns the unique intersection with the argument, if one exists. The result
  // will be a vector if a line is supplied, and a line if a plane is supplied.
  intersectionWith: function(obj) {
    if (!this.intersects(obj)) { return null; }
    if (obj.direction) {
      // obj is a line
      var A = obj.anchor.elements, D = obj.direction.elements,
          P = this.anchor.elements, N = this.normal.elements;
      var multiplier = (N[0]*(P[0]-A[0]) + N[1]*(P[1]-A[1]) + N[2]*(P[2]-A[2])) / (N[0]*D[0] + N[1]*D[1] + N[2]*D[2]);
      return Vector.create([A[0] + D[0]*multiplier, A[1] + D[1]*multiplier, A[2] + D[2]*multiplier]);
    } else if (obj.normal) {
      // obj is a plane
      var direction = this.normal.cross(obj.normal).toUnitVector();
      // To find an anchor point, we find one co-ordinate that has a value
      // of zero somewhere on the intersection, and remember which one we picked
      var N = this.normal.elements, A = this.anchor.elements,
          O = obj.normal.elements, B = obj.anchor.elements;
      var solver = Matrix.Zero(2,2), i = 0;
      while (solver.isSingular()) {
        i++;
        solver = Matrix.create([
          [ N[i%3], N[(i+1)%3] ],
          [ O[i%3], O[(i+1)%3]  ]
        ]);
      }
      // Then we solve the simultaneous equations in the remaining dimensions
      var inverse = solver.inverse().elements;
      var x = N[0]*A[0] + N[1]*A[1] + N[2]*A[2];
      var y = O[0]*B[0] + O[1]*B[1] + O[2]*B[2];
      var intersection = [
        inverse[0][0] * x + inverse[0][1] * y,
        inverse[1][0] * x + inverse[1][1] * y
      ];
      var anchor = [];
      for (var j = 1; j <= 3; j++) {
        // This formula picks the right element from intersection by
        // cycling depending on which element we set to zero above
        anchor.push((i == j) ? 0 : intersection[(j + (5 - i)%3)%3]);
      }
      return Line.create(anchor, direction);
    }
  },

  // Returns the point in the plane closest to the given point
  pointClosestTo: function(point) {
    var P = point.elements || point;
    var A = this.anchor.elements, N = this.normal.elements;
    var dot = (A[0] - P[0]) * N[0] + (A[1] - P[1]) * N[1] + (A[2] - (P[2] || 0)) * N[2];
    return Vector.create([P[0] + N[0] * dot, P[1] + N[1] * dot, (P[2] || 0) + N[2] * dot]);
  },

  // Returns a copy of the plane, rotated by t radians about the given line
  // See notes on Line#rotate.
  rotate: function(t, line) {
    var R = Matrix.Rotation(t, line.direction).elements;
    var C = line.pointClosestTo(this.anchor).elements;
    var A = this.anchor.elements, N = this.normal.elements;
    var C1 = C[0], C2 = C[1], C3 = C[2], A1 = A[0], A2 = A[1], A3 = A[2];
    var x = A1 - C1, y = A2 - C2, z = A3 - C3;
    return Plane.create([
      C1 + R[0][0] * x + R[0][1] * y + R[0][2] * z,
      C2 + R[1][0] * x + R[1][1] * y + R[1][2] * z,
      C3 + R[2][0] * x + R[2][1] * y + R[2][2] * z
    ], [
      R[0][0] * N[0] + R[0][1] * N[1] + R[0][2] * N[2],
      R[1][0] * N[0] + R[1][1] * N[1] + R[1][2] * N[2],
      R[2][0] * N[0] + R[2][1] * N[1] + R[2][2] * N[2]
    ]);
  },

  // Returns the reflection of the plane in the given point, line or plane.
  reflectionIn: function(obj) {
    if (obj.normal) {
      // obj is a plane
      var A = this.anchor.elements, N = this.normal.elements;
      var A1 = A[0], A2 = A[1], A3 = A[2], N1 = N[0], N2 = N[1], N3 = N[2];
      var newA = this.anchor.reflectionIn(obj).elements;
      // Add the plane's normal to its anchor, then mirror that in the other plane
      var AN1 = A1 + N1, AN2 = A2 + N2, AN3 = A3 + N3;
      var Q = obj.pointClosestTo([AN1, AN2, AN3]).elements;
      var newN = [Q[0] + (Q[0] - AN1) - newA[0], Q[1] + (Q[1] - AN2) - newA[1], Q[2] + (Q[2] - AN3) - newA[2]];
      return Plane.create(newA, newN);
    } else if (obj.direction) {
      // obj is a line
      return this.rotate(Math.PI, obj);
    } else {
      // obj is a point
      var P = obj.elements || obj;
      return Plane.create(this.anchor.reflectionIn([P[0], P[1], (P[2] || 0)]), this.normal);
    }
  },

  // Sets the anchor point and normal to the plane. If three arguments are specified,
  // the normal is calculated by assuming the three points should lie in the same plane.
  // If only two are sepcified, the second is taken to be the normal. Normal vector is
  // normalised before storage.
  setVectors: function(anchor, v1, v2) {
    anchor = Vector.create(anchor);
    anchor = anchor.to3D(); if (anchor === null) { return null; }
    v1 = Vector.create(v1);
    v1 = v1.to3D(); if (v1 === null) { return null; }
    if (typeof(v2) == 'undefined') {
      v2 = null;
    } else {
      v2 = Vector.create(v2);
      v2 = v2.to3D(); if (v2 === null) { return null; }
    }
    var A1 = anchor.elements[0], A2 = anchor.elements[1], A3 = anchor.elements[2];
    var v11 = v1.elements[0], v12 = v1.elements[1], v13 = v1.elements[2];
    var normal, mod;
    if (v2 !== null) {
      var v21 = v2.elements[0], v22 = v2.elements[1], v23 = v2.elements[2];
      normal = Vector.create([
        (v12 - A2) * (v23 - A3) - (v13 - A3) * (v22 - A2),
        (v13 - A3) * (v21 - A1) - (v11 - A1) * (v23 - A3),
        (v11 - A1) * (v22 - A2) - (v12 - A2) * (v21 - A1)
      ]);
      mod = normal.modulus();
      if (mod === 0) { return null; }
      normal = Vector.create([normal.elements[0] / mod, normal.elements[1] / mod, normal.elements[2] / mod]);
    } else {
      mod = Math.sqrt(v11*v11 + v12*v12 + v13*v13);
      if (mod === 0) { return null; }
      normal = Vector.create([v1.elements[0] / mod, v1.elements[1] / mod, v1.elements[2] / mod]);
    }
    this.anchor = anchor;
    this.normal = normal;
    return this;
  }
};

// Constructor function
Plane.create = function(anchor, v1, v2) {
  var P = new Plane();
  return P.setVectors(anchor, v1, v2);
};

// X-Y-Z planes
Plane.XY = Plane.create(Vector.Zero(3), Vector.k);
Plane.YZ = Plane.create(Vector.Zero(3), Vector.i);
Plane.ZX = Plane.create(Vector.Zero(3), Vector.j);
Plane.YX = Plane.XY; Plane.ZY = Plane.YZ; Plane.XZ = Plane.ZX;

// Utility functions
var $V = Vector.create;
var $M = Matrix.create;
var $L = Line.create;
var $P = Plane.create;
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('ZUI53.Tools', function(exports) {
    exports.Base = (function() {

      function Base() {
        this.stopEvent = __bind(this.stopEvent, this);
        this.makeUnexclusive = __bind(this.makeUnexclusive, this);
        this.makeExclusive = __bind(this.makeExclusive, this);
        this.detach = __bind(this.detach, this);
        this.attach = __bind(this.attach, this);        this.set = null;
        this.group = null;
        this.attached = false;
      }

      Base.prototype.attach = function() {
        if (this.group) this.group.attach(this);
        return this.attached = true;
      };

      Base.prototype.detach = function() {
        return this.attached = false;
      };

      Base.prototype.makeExclusive = function() {
        if (this.set) this.set.exclusive(this);
        return this.attach();
      };

      Base.prototype.makeUnexclusive = function() {
        if (this.set) return this.set.unexclusive();
      };

      Base.prototype.stopEvent = function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      };

      return Base;

    })();
    exports.SetGroup = (function() {

      function SetGroup() {
        this.requestUnexclusive = __bind(this.requestUnexclusive, this);
        this.requestExclusive = __bind(this.requestExclusive, this);
        this.attach = __bind(this.attach, this);
        this.add = __bind(this.add, this);        this.tools = [];
        this.current = null;
        this.beforeExclusive = null;
      }

      SetGroup.prototype.add = function(tool) {
        tool.group = this;
        this.tools.push(tool);
        if (this.tools.length === 1) return tool.attach();
      };

      SetGroup.prototype.attach = function(tool) {
        var t, _i, _len, _ref, _results;
        this.current = tool;
        _ref = this.tools;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          if (t !== tool) {
            _results.push(t.detach());
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      SetGroup.prototype.requestExclusive = function(tool) {
        if (this.current && this.current !== tool) this.current.detach();
        return this.beforeExclusive = this.current;
      };

      SetGroup.prototype.requestUnexclusive = function() {
        this.current = this.beforeExclusive;
        if (this.current) return this.current.attach();
      };

      return SetGroup;

    })();
    return exports.Set = (function() {

      function Set(default_tool) {
        this.default_tool = default_tool;
        this.unexclusive = __bind(this.unexclusive, this);
        this.exclusive = __bind(this.exclusive, this);
        this.add = __bind(this.add, this);
        this.groups = [new exports.SetGroup()];
        this.default_tool.set = this;
        if (this.default_tool) this.default_tool.attach();
      }

      Set.prototype.add = function(tool) {
        this.groups[0].add(tool);
        return tool.set = this;
      };

      Set.prototype.exclusive = function(tool) {
        var g, _i, _len, _ref;
        _ref = this.groups;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          g.requestExclusive(tool);
        }
        if (this.default_tool !== tool && this.default_tool) {
          return this.default_tool.detach();
        }
      };

      Set.prototype.unexclusive = function() {
        var g, _i, _len, _ref;
        _ref = this.groups;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          g = _ref[_i];
          g.requestUnexclusive();
        }
        if (this.default_tool) return this.default_tool.attach();
      };

      return Set;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace('ZUI53.Tools', function(exports) {
    return exports.Pan = (function() {

      __extends(Pan, exports.Base);

      function Pan(zui) {
        this._start_with = __bind(this._start_with, this);
        this._pan_with = __bind(this._pan_with, this);
        this.touch_stop = __bind(this.touch_stop, this);
        this.touch_move = __bind(this.touch_move, this);
        this.touch_start = __bind(this.touch_start, this);
        this.stop = __bind(this.stop, this);
        this.pan = __bind(this.pan, this);
        this.start = __bind(this.start, this);
        this.detach = __bind(this.detach, this);
        this.attach = __bind(this.attach, this);        this.vp = zui;
        this.eventDispatcher = zui.viewport;
        this.use_capture = false;
      }

      Pan.prototype.attach = function() {
        $('body').addClass('pan');
        $(this.eventDispatcher).bind('mousedown', this.start);
        return this.eventDispatcher.addEventListener('touchstart', this.touch_start, this.use_capture);
      };

      Pan.prototype.detach = function() {
        $('body').removeClass('pan');
        this.touch_stop(null);
        $(this.eventDispatcher).unbind('mousedown', this.start);
        return this.eventDispatcher.removeEventListener('touchstart', this.touch_start, this.use_capture);
      };

      Pan.prototype.start = function(e) {
        $('body').addClass('panning');
        this._start_with(e.screenX, e.screenY);
        window.addEventListener('mousemove', this.pan, this.use_capture);
        return window.addEventListener('mouseup', this.stop, this.use_capture);
      };

      Pan.prototype.pan = function(e) {
        return this._pan_with(e.screenX, e.screenY);
      };

      Pan.prototype.stop = function(e) {
        $('body').removeClass('panning');
        window.removeEventListener('mousemove', this.pan, this.use_capture);
        window.removeEventListener('mouseup', this.stop, this.use_capture);
        window.removeEventListener('touchmove', this.pan, this.use_capture);
        return window.removeEventListener('touchstop', this.stop, this.use_capture);
      };

      Pan.prototype.touch_start = function(e) {
        this._start_with(e.touches[0].clientX, e.touches[0].clientY);
        this.eventDispatcher.addEventListener('touchmove', this.touch_move, this.use_capture);
        this.eventDispatcher.addEventListener('touchstop', this.touch_stop, this.use_capture);
        return e.preventDefault();
      };

      Pan.prototype.touch_move = function(e) {
        return this._pan_with(e.touches[0].clientX, e.touches[0].clientY);
      };

      Pan.prototype.touch_stop = function(e) {
        this.eventDispatcher.removeEventListener('touchmove', this.touch_move, this.use_capture);
        return this.eventDispatcher.removeEventListener('touchstop', this.touch_stop, this.use_capture);
      };

      Pan.prototype._pan_with = function(x, y) {
        var dX, dY;
        dX = x - this.startX;
        dY = y - this.startY;
        this.startX = x;
        this.startY = y;
        return this.vp.panBy(dX, dY);
      };

      Pan.prototype._start_with = function(x, y) {
        this.startX = x;
        return this.startY = y;
      };

      return Pan;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  namespace('ZUI53.Tools', function(exports) {
    return exports.Zoom = (function() {

      __extends(Zoom, exports.Base);

      function Zoom(zui) {
        this.find_distance = __bind(this.find_distance, this);
        this.find_midpoint = __bind(this.find_midpoint, this);
        this.touch_move = __bind(this.touch_move, this);
        this._internal_gesture_end = __bind(this._internal_gesture_end, this);
        this._internal_gesture_start = __bind(this._internal_gesture_start, this);
        this.gesture_end = __bind(this.gesture_end, this);
        this.gesture_move = __bind(this.gesture_move, this);
        this.gesture_start = __bind(this.gesture_start, this);
        this.zoom = __bind(this.zoom, this);
        this.moz_touch_up = __bind(this.moz_touch_up, this);
        this.moz_touch_move = __bind(this.moz_touch_move, this);
        this.moz_touch_down = __bind(this.moz_touch_down, this);
        this.create_touch_index = __bind(this.create_touch_index, this);
        this.update_moz_touch = __bind(this.update_moz_touch, this);
        this.fetch_touch = __bind(this.fetch_touch, this);
        this.detach = __bind(this.detach, this);
        this.attach = __bind(this.attach, this);        this.vp = zui;
        this.eventDispatcher = zui.viewport;
        this.use_capture = true;
        this.t1 = null;
        this.t2 = null;
        this.touch = {
          touches: [],
          touch_ids: []
        };
      }

      Zoom.prototype.attach = function() {
        $(this.eventDispatcher).mousewheel(this.zoom);
        this.eventDispatcher.addEventListener('gesturestart', this.gesture_start, this.use_capture);
        this.eventDispatcher.addEventListener('MozTouchDown', this.moz_touch_down, this.use_capture);
        return this.eventDispatcher.addEventListener('MozTouchUp', this.moz_touch_up, this.use_capture);
      };

      Zoom.prototype.detach = function() {
        $(this.eventDispatcher).unmousewheel(this.zoom);
        this.eventDispatcher.removeEventListener('gesturestart', this.gesture_start, this.use_capture);
        this.eventDispatcher.removeEventListener('MozTouchDown', this.moz_touch_down, this.use_capture);
        return this.eventDispatcher.removeEventListener('MozTouchUp', this.moz_touch_up, this.use_capture);
      };

      Zoom.prototype.fetch_touch = function(e, value) {
        if (this.t1 && this.t1.streamId === e.streamId) {
          this.t1 = value || e;
        } else {
          this.t2 = value || e;
        }
        return this.update_moz_touch();
      };

      Zoom.prototype.update_moz_touch = function() {
        var mp;
        if (this.t1 && this.t2) {
          try {
            return mp = this.find_midpoint({
              touches: [this.t1, this.t2]
            });
          } catch (e) {
            return console.log(e);
          }
        } else if (this.t1 || this.t2) {
          return console.log('only one');
        }
      };

      Zoom.prototype.create_touch_index = function(streamId) {
        var i;
        i = this.touch.touch_ids.indexOf(streamId);
        if (i < 0) {
          i = this.touch.touch_ids.length;
          this.touch.touch_ids[i] = streamId;
        }
        return i;
      };

      Zoom.prototype.moz_touch_down = function(e) {
        var i;
        this.touch_df = null;
        try {
          i = this.create_touch_index(e.streamId);
          this.touch.touches[i] = e;
          if (this.touch.touches.length === 2) {
            this._internal_gesture_start();
            return this.eventDispatcher.addEventListener('MozTouchMove', this.moz_touch_move, this.use_capture);
          }
        } catch (e) {
          return console.log(e);
        }
      };

      Zoom.prototype.moz_touch_move = function(e) {
        var d, i, s;
        i = this.create_touch_index(e.streamId);
        this.touch.touches[i] = e;
        this.touch_move(this.touch);
        d = this.find_distance(this.touch);
        if (this.touch_df) {
          s = this.touch_df * d;
          return this.gesture_move({
            scale: s
          });
        } else {
          return this.touch_df = 1 / d;
        }
      };

      Zoom.prototype.moz_touch_up = function(e) {
        var i;
        i = this.touch.touch_ids.indexOf(e.streamId);
        if (i > 0) {
          console.log("Removed: " + i);
          if (this.touch.touches.length === 2) {
            this._internal_gesture_end();
            this.eventDispatcher.removeEventListener('MozTouchMove', this.moz_touch_move, this.use_capture);
          }
          this.touch.touches.splice(i, 1);
          return this.touch.touch_ids.splice(i, 1);
        }
      };

      Zoom.prototype.zoom = function(e) {
        var delta, f;
        delta = e.wheelDelta || (e.detail * -1);
        f = 0.05;
        if (delta < 0) f *= -1;
        return this.vp.zoomBy(f, e.clientX, e.clientY);
      };

      Zoom.prototype.gesture_start = function(e) {
        this._internal_gesture_start();
        this.eventDispatcher.addEventListener('gesturechange', this.gesture_move, this.use_capture);
        this.eventDispatcher.addEventListener('gestureend', this.gesture_end, this.use_capture);
        return this.eventDispatcher.addEventListener('touchmove', this.touch_move, this.use_capture);
      };

      Zoom.prototype.gesture_move = function(e) {
        if (this.last_touch_p) {
          return this.vp.zoomSet(this.start_scale * e.scale, this.last_touch_p.e(1), this.last_touch_p.e(2));
        }
      };

      Zoom.prototype.gesture_end = function(e) {
        this.eventDispatcher.removeEventListener('touchmove', this.touch_move, this.use_capture);
        this.eventDispatcher.removeEventListener('gesturechange', this.gesture_move, this.use_capture);
        this.eventDispatcher.removeEventListener('gestureend', this.gesture_end, this.use_capture);
        return this._internal_gesture_end();
      };

      Zoom.prototype._internal_gesture_start = function() {
        this.makeExclusive();
        this.last_touch_p = null;
        return this.start_scale = this.vp.scale;
      };

      Zoom.prototype._internal_gesture_end = function() {
        return this.makeUnexclusive();
      };

      Zoom.prototype.touch_move = function(e) {
        var d, new_touch_p;
        if (this.last_touch_p) {
          new_touch_p = this.find_midpoint(e);
          d = new_touch_p.subtract(this.last_touch_p);
          this.last_touch_p = new_touch_p;
          return this.vp.panBy(d.e(1), d.e(2));
        } else {
          return this.last_touch_p = this.find_midpoint(e);
        }
      };

      Zoom.prototype.find_midpoint = function(e) {
        var d, p, p1, p2, t1, t2;
        t1 = e.touches[0];
        t2 = e.touches[1];
        p1 = $V([t1.clientX, t1.clientY, 1]);
        p2 = $V([t2.clientX, t2.clientY, 1]);
        d = p2.subtract(p1).multiply(0.5);
        return p = p1.add(d);
      };

      Zoom.prototype.find_distance = function(e) {
        var p1, p2, t1, t2;
        t1 = e.touches[0];
        t2 = e.touches[1];
        p1 = $V([t1.clientX, t1.clientY, 1]);
        p2 = $V([t2.clientX, t2.clientY, 1]);
        return p2.distanceFrom(p1);
      };

      return Zoom;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('ZUI53', function(exports) {
    return exports.Viewport = (function() {

      function Viewport(vp) {
        this.setTransformString = __bind(this.setTransformString, this);
        this.getTransformString = __bind(this.getTransformString, this);
        this.setPanAndScale = __bind(this.setPanAndScale, this);
        this.getPanAndScale = __bind(this.getPanAndScale, this);
        this.showBounds = __bind(this.showBounds, this);
        this.avp = __bind(this.avp, this);
        this.translateSurface = __bind(this.translateSurface, this);
        this.fitToLimits = __bind(this.fitToLimits, this);
        this.zoomSet = __bind(this.zoomSet, this);
        this.panScaleTo = __bind(this.panScaleTo, this);
        this.zoomBy = __bind(this.zoomBy, this);
        this.panBy = __bind(this.panBy, this);
        this.updateSurface = __bind(this.updateSurface, this);
        this.surfaceToLayer = __bind(this.surfaceToLayer, this);
        this.surfaceToClient = __bind(this.surfaceToClient, this);
        this.layerToSurface = __bind(this.layerToSurface, this);
        this.clientToSurface = __bind(this.clientToSurface, this);
        this.addLimits = __bind(this.addLimits, this);
        this.removeSurface = __bind(this.removeSurface, this);
        this.addSurface = __bind(this.addSurface, this);
        this.reset = __bind(this.reset, this);
        this.updateOffset = __bind(this.updateOffset, this);
        var _this = this;
        this.min_scale = null;
        this.max_scale = null;
        this.viewport = this.styleViewport(vp);
        this.surfaces = [];
        this.updateOffset();
        this.reset();
        $(vp).scroll(function(e) {
          var jVP;
          jVP = $(_this.viewport);
          _this.panBy(-jVP.scrollLeft(), -jVP.scrollTop());
          return jVP.scrollTop(0).scrollLeft(0);
        });
        this.toolset = new ZUI53.Tools.Set(new ZUI53.Tools.Zoom(this));
      }

      Viewport.prototype.styleViewport = function(vp) {
        $(vp).css({
          'position': 'relative',
          'overflow': 'hidden',
          'width': '100%',
          'height': '100%'
        });
        return vp;
      };

      Viewport.prototype.updateOffset = function() {
        this.vpOffset = $(this.viewport).offset();
        this.vpOffset.left -= Number($(window.document).scrollLeft());
        this.vpOffset.top -= Number($(window.document).scrollTop());
        this.vpOffM = $M([[1, 0, this.vpOffset.left], [0, 1, this.vpOffset.top], [0, 0, 1]]);
        return this.vpOffM;
      };

      Viewport.prototype.reset = function() {
        this.zoomPos = 0;
        this.scale = 1.0;
        this.surfaceM = $M([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        return this.updateSurface();
      };

      Viewport.prototype.addSurface = function(surface) {
        this.surfaces.push(surface);
        return this.addLimits(surface.limits());
      };

      Viewport.prototype.removeSurface = function(surface) {
        var i;
        i = this.surfaces.indexOf(surface);
        if (i >= 0) return this.surfaces.splice(i, 1);
      };

      Viewport.prototype.addLimits = function(limits) {
        if (!limits) return;
        if (this.min_scale || this.max_scale) {
          if (limits[0]) this.min_scale = Math.max(limits[0], this.min_scale);
          if (limits[1]) {
            return this.max_scale = Math.min(limits[1], this.max_scale);
          }
        } else {
          this.min_scale = limits[0];
          return this.max_scale = limits[1];
        }
      };

      Viewport.prototype.clientToSurface = function(x, y) {
        var sV, v;
        v = $V([x, y, 1]);
        return sV = this.surfaceM.inverse().multiply(this.updateOffset().inverse().multiply(v));
      };

      Viewport.prototype.layerToSurface = function(x, y) {
        var sV, v;
        v = $V([x, y, 1]);
        return sV = this.surfaceM.inverse().multiply(v);
      };

      Viewport.prototype.surfaceToClient = function(v) {
        return this.updateOffset().multiply(this.surfaceM.multiply(v));
      };

      Viewport.prototype.surfaceToLayer = function(v) {
        return this.surfaceM.multiply(v);
      };

      Viewport.prototype.updateSurface = function() {
        var node, v, _i, _len, _ref;
        v = this.getPanAndScale();
        _ref = this.surfaces;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          node.apply(v[0], v[1], v[2]);
        }
        return true;
      };

      Viewport.prototype.panBy = function(x, y) {
        this.translateSurface(x, y);
        return this.updateSurface();
      };

      Viewport.prototype.zoomBy = function(byF, clientX, clientY) {
        var newScale;
        newScale = this._pos_to_scale(this.zoomPos + byF);
        return this.zoomSet(newScale, clientX, clientY);
      };

      Viewport.prototype.panScaleTo = function(panX, panY, scale) {
        this.setPanAndScale(panX, panY, scale);
        return this.updateSurface();
      };

      Viewport.prototype.zoomSet = function(newScale, clientX, clientY) {
        var c, dX, dY, scaleBy, sf;
        newScale = this.fitToLimits(newScale);
        this.zoomPos = this._scale_to_pos(newScale);
        if (newScale !== this.scale) {
          sf = this.clientToSurface(clientX, clientY);
          scaleBy = newScale / this.scale;
          this.surfaceM = this._scaleMatrix(this.surfaceM, scaleBy);
          this.scale = newScale;
          c = this.surfaceToClient(sf);
          dX = clientX - c.e(1);
          dY = clientY - c.e(2);
          this.translateSurface(dX, dY);
        }
        return this.updateSurface();
      };

      Viewport.prototype.fitToLimits = function(s) {
        if (this.min_scale && s < this.min_scale) {
          s = this.min_scale;
        } else if (this.max_scale && s > this.max_scale) {
          s = this.max_scale;
        }
        return s;
      };

      Viewport.prototype.translateSurface = function(x, y) {
        return this.surfaceM = this._translateMatrix(this.surfaceM, x, y);
      };

      Viewport.prototype._translateMatrix = function(m, x, y) {
        return m.add($M([[0, 0, x], [0, 0, y], [0, 0, 0]]));
      };

      Viewport.prototype._scaleMatrix = function(m, s) {
        return m.multiply($M([[s, 0, 0], [0, s, 0], [0, 0, 1]]));
      };

      Viewport.prototype._pos_to_scale = function(pos) {
        return Math.exp(pos);
      };

      Viewport.prototype._scale_to_pos = function(s) {
        return Math.log(s);
      };

      Viewport.prototype.avp = function() {
        var del, max, min;
        this.updateOffset();
        min = this.clientToSurface(this.vpOffset.left, this.vpOffset.top);
        max = this.clientToSurface(this.vpOffset.left + $(this.viewport).width(), this.vpOffset.top + $(this.viewport).height());
        del = max.subtract(min);
        return {
          x: min.e(1),
          y: min.e(2),
          width: del.e(1),
          height: del.e(2)
        };
      };

      Viewport.prototype._boundsCenter = function(b) {
        return {
          x: b.x + b.width / 2,
          y: b.y + b.height / 2
        };
      };

      Viewport.prototype.showBounds = function(evp) {
        var aC, avp, eC, exp, s;
        if (evp.width === 0 || evp.height === 0) return;
        avp = this.avp();
        s = Math.min(avp.width / evp.width, avp.height / evp.height);
        exp = 50 / s;
        evp.x -= exp;
        evp.y -= exp;
        evp.width += 2 * exp;
        evp.height += 2 * exp;
        s = Math.min(avp.width / evp.width, avp.height / evp.height);
        s = this.fitToLimits(s);
        eC = this._boundsCenter(evp);
        aC = this._boundsCenter(avp);
        this.setPanAndScale(-eC.x * s, -eC.y * s, s);
        this.translateSurface($(this.viewport).width() / 2, $(this.viewport).height() / 2);
        return this.updateSurface();
      };

      Viewport.prototype.getPanAndScale = function() {
        return [this.surfaceM.e(1, 3), this.surfaceM.e(2, 3), this.surfaceM.e(1, 1)];
      };

      Viewport.prototype.setPanAndScale = function(panX, panY, scale) {
        this.surfaceM = $M([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        this.translateSurface(panX, panY);
        this.surfaceM = this._scaleMatrix(this.surfaceM, scale);
        this.scale = scale;
        return this.zoomPos = this._scale_to_pos(scale);
      };

      Viewport.prototype.getTransformString = function() {
        return this.getPanAndScale().join(',');
      };

      Viewport.prototype.setTransformString = function(str) {
        var panX, panY, scale, v;
        if (!str) return;
        v = str.split(',');
        panX = Number(v[0]);
        panY = Number(v[1]);
        scale = Number(v[2]);
        this.setPanAndScale(panX, panY, scale);
        return this.updateSurface();
      };

      return Viewport;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('ZUI53.Surfaces', function(exports) {
    return exports.CSS = (function() {

      function CSS(node) {
        this.node = node;
        this.apply = __bind(this.apply, this);
        $(this.node).transform({
          origin: ['0', '0']
        });
        $(this.node).css({
          'position': 'absolute'
        });
      }

      CSS.prototype.limits = function() {
        return null;
      };

      CSS.prototype.apply = function(panX, panY, scale) {
        return $(this.node).transform({
          matrix: [scale, 0.0, 0.0, scale, panX, panY]
        });
      };

      return CSS;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('ZUI53.Surfaces', function(exports) {
    return exports.SNU = (function() {

      function SNU(node, cb) {
        this.node = node;
        this.cb = cb;
        this.apply = __bind(this.apply, this);
        $(this.node).transform({
          origin: ['0', '0']
        });
        $(this.node).css({
          'position': 'absolute'
        });
      }

      SNU.prototype.limits = function() {
        return [0.0000001, 1];
      };

      SNU.prototype.apply = function(panX, panY, scale) {
        this.cb(panX, panY, scale);
        return $(this.node).transform({
          matrix: [scale, 0.0, 0.0, scale, panX, panY]
        });
      };

      return SNU;

    })();
  });

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace('ZUI53.Surfaces', function(exports) {
    return exports.SVG = (function() {

      function SVG(node) {
        this.node = node;
        this.apply = __bind(this.apply, this);
      }

      SVG.prototype.limits = function() {
        return [0.0001, 20000];
      };

      SVG.prototype.apply = function(panX, panY, scale) {
        var singleSVG;
        singleSVG = "translate(" + panX + ", " + panY + ") scale(" + scale + ", " + scale + ")";
        return $(this.node).attr("transform", singleSVG);
      };

      return SVG;

    })();
  });

}).call(this);
