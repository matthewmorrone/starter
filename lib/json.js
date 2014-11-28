


/*
JSON 2
*/

/*
	json2.js
	2014-02-04

	Public Domain.

	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	See http://www.JSON.org/js.html


	This code should be minified before deployment.
	See http://javascript.crockford.com/jsmin.html

	USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	NOT CONTROL.


	This file creates a global JSON object containing two methods: stringify
	and parse.

		JSON.stringify(value, replacer, space)
			value       any JavaScript value, usually an object or array.

			replacer    an optional parameter that determines how object
						values are stringified for objects. It can be a
						function or an array of strings.

			space       an optional parameter that specifies the indentation
						of nested structures. If it is omitted, the text will
						be packed without extra whitespace. If it is a number,
						it will specify the number of spaces to indent at each
						level. If it is a string (such as '\t' or '&nbsp;'),
						it contains the characters used to indent at each level.

			This method produces a JSON text from a JavaScript value.

			When an object value is found, if the object contains a toJSON
			method, its toJSON method will be called and the result will be
			stringified. A toJSON method does not serialize: it returns the
			value represented by the name/value pair that should be serialized,
			or undefined if nothing should be serialized. The toJSON method
			will be passed the key associated with the value, and this will be
			bound to the value

			For example, this would serialize Dates as ISO strings.

				Date.prototype.toJSON = function (key) {
					function f(n) {
						// Format integers to have at least two digits.
						return n < 10 ? '0' + n : n;
					}

					return this.getUTCFullYear()   + '-' +
						 f(this.getUTCMonth() + 1) + '-' +
						 f(this.getUTCDate())      + 'T' +
						 f(this.getUTCHours())     + ':' +
						 f(this.getUTCMinutes())   + ':' +
						 f(this.getUTCSeconds())   + 'Z';
				};

			You can provide an optional replacer method. It will be passed the
			key and value of each member, with this bound to the containing
			object. The value that is returned from your method will be
			serialized. If your method returns undefined, then the member will
			be excluded from the serialization.

			If the replacer parameter is an array of strings, then it will be
			used to select the members to be serialized. It filters the results
			such that only members with keys listed in the replacer array are
			stringified.

			Values that do not have JSON representations, such as undefined or
			functions, will not be serialized. Such values in objects will be
			dropped; in arrays they will be replaced with null. You can use
			a replacer function to replace those with JSON values.
			JSON.stringify(undefined) returns undefined.

			The optional space parameter produces a stringification of the
			value that is filled with line breaks and indentation to make it
			easier to read.

			If the space parameter is a non-empty string, then that string will
			be used for indentation. If the space parameter is a number, then
			the indentation will be that many spaces.

			Example:

			text = JSON.stringify(['e', {pluribus: 'unum'}]);
			// text is '["e",{"pluribus":"unum"}]'


			text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
			// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

			text = JSON.stringify([new Date()], function (key, value) {
				return this[key] instanceof Date ?
					'Date(' + this[key] + ')' : value;
			});
			// text is '["Date(---current time---)"]'


		JSON.parse(text, reviver)
			This method parses a JSON text to produce an object or array.
			It can throw a SyntaxError exception.

			The optional reviver parameter is a function that can filter and
			transform the results. It receives each of the keys and values,
			and its return value is used instead of the original value.
			If it returns what it received, then the structure is not modified.
			If it returns undefined then the member is deleted.

			Example:

			// Parse the text. Values that look like ISO date strings will
			// be converted to Date objects.

			myData = JSON.parse(text, function (key, value) {
				var a;
				if (typeof value === 'string') {
					a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
					if (a) {
						return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
							+a[5], +a[6]));
					}
				}
				return value;
			});

			myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
				var d;
				if (typeof value === 'string' &&
						value.slice(0, 5) === 'Date(' &&
						value.slice(-1) === ')') {
					d = new Date(value.slice(5, -1));
					if (d) {
						return d;
					}
				}
				return value;
			});


	This is a reference implementation. You are free to copy, modify, or
	redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
	call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
	getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
	lastIndex, length, parse, prototype, push, replace, slice, stringify,
	test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
	JSON = {};
}

(function () {
	'use strict';

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function () {

			return isFinite(this.valueOf())
				? this.getUTCFullYear()     + '-' +
					f(this.getUTCMonth() + 1) + '-' +
					f(this.getUTCDate())      + 'T' +
					f(this.getUTCHours())     + ':' +
					f(this.getUTCMinutes())   + ':' +
					f(this.getUTCSeconds())   + 'Z'
				: null;
		};

		String.prototype.toJSON      =
			Number.prototype.toJSON  =
			Boolean.prototype.toJSON = function () {
				return this.valueOf();
			};
	}

	var cx,
		escapable,
		gap,
		indent,
		meta,
		rep;


	function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string'
				? c
				: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

// Produce a string from holder[key].

		var i,          // The loop counter.
			k,          // The member key.
			v,          // The member value.
			length,
			mind = gap,
			partial,
			value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
				typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

// What happens next depends on the value's type.

		switch (typeof value) {
		case 'string':
			return quote(value);

		case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : 'null';

		case 'boolean':
		case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

			return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

		case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

			if (!value) {
				return 'null';
			}

// Make an array to hold the partial results of stringifying this object value.

			gap += indent;
			partial = [];

// Is the value an array?

			if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || 'null';
				}

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

				v = partial.length === 0
					? '[]'
					: gap
					? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
					: '[' + partial.join(',') + ']';
				gap = mind;
				return v;
			}

// If the replacer is an array, use it to select the members to be stringified.

			if (rep && typeof rep === 'object') {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === 'string') {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			} else {

// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
			}

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

			v = partial.length === 0
				? '{}'
				: gap
				? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
				: '{' + partial.join(',') + '}';
			gap = mind;
			return v;
		}
	}

// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		};
		JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
					(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

			return str('', {'': value});
		};
	}


// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
		JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function'
					? walk({'': j}, '')
					: j;
			}

// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
}());



/*
JSON 3
*/


/*! JSON v3.3.2 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
;(function () {
	// Detect the `define` function exposed by asynchronous module loaders. The
	// strict `define` check is necessary for compatibility with `r.js`.
	var isLoader = typeof define === "function" && define.amd;

	// A set of types used to distinguish objects from primitives.
	var objectTypes = {
		"function": true,
		"object": true
	};

	// Detect the `exports` object exposed by CommonJS implementations.
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	// Use the `global` object exposed by Node (including Browserify via
	// `insert-module-globals`), Narwhal, and Ringo as the default context,
	// and the `window` object in browsers. Rhino exports a `global` function
	// instead.
	var root = objectTypes[typeof window] && window || this,
			freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && typeof global == "object" && global;

	if (freeGlobal && (freeGlobal["global"] === freeGlobal || freeGlobal["window"] === freeGlobal || freeGlobal["self"] === freeGlobal)) {
		root = freeGlobal;
	}

	// Public: Initializes JSON 3 using the given `context` object, attaching the
	// `stringify` and `parse` functions to the specified `exports` object.
	function runInContext(context, exports) {
		context || (context = root["Object"]());
		exports || (exports = root["Object"]());

		// Native constructor aliases.
		var Number = context["Number"] || root["Number"],
				String = context["String"] || root["String"],
				Object = context["Object"] || root["Object"],
				Date = context["Date"] || root["Date"],
				SyntaxError = context["SyntaxError"] || root["SyntaxError"],
				TypeError = context["TypeError"] || root["TypeError"],
				Math = context["Math"] || root["Math"],
				nativeJSON = context["JSON"] || root["JSON"];

		// Delegate to the native `stringify` and `parse` implementations.
		if (typeof nativeJSON == "object" && nativeJSON) {
			exports.stringify = nativeJSON.stringify;
			exports.parse = nativeJSON.parse;
		}

		// Convenience aliases.
		var objectProto = Object.prototype,
				getClass = objectProto.toString,
				isProperty, forEach, undef;

		// Test the `Date#getUTC*` methods. Based on work by @Yaffle.
		var isExtended = new Date(-3509827334573292);
		try {
			// The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
			// results for certain dates in Opera >= 10.53.
			isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
				// Safari < 2.0.2 stores the internal millisecond time value correctly,
				// but clips the values returned by the date methods to the range of
				// signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
				isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
		} catch (exception) {}

		// Internal: Determines whether the native `JSON.stringify` and `parse`
		// implementations are spec-compliant. Based on work by Ken Snyder.
		function has(name) {
			if (has[name] !== undef) {
				// Return cached feature test result.
				return has[name];
			}
			var isSupported;
			if (name == "bug-string-char-index") {
				// IE <= 7 doesn't support accessing string characters using square
				// bracket notation. IE 8 only supports this for primitives.
				isSupported = "a"[0] != "a";
			} else if (name == "json") {
				// Indicates whether both `JSON.stringify` and `JSON.parse` are
				// supported.
				isSupported = has("json-stringify") && has("json-parse");
			} else {
				var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
				// Test `JSON.stringify`.
				if (name == "json-stringify") {
					var stringify = exports.stringify, stringifySupported = typeof stringify == "function" && isExtended;
					if (stringifySupported) {
						// A test function object with a custom `toJSON` method.
						(value = function () {
							return 1;
						}).toJSON = value;
						try {
							stringifySupported =
								// Firefox 3.1b1 and b2 serialize string, number, and boolean
								// primitives as object literals.
								stringify(0) === "0" &&
								// FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
								// literals.
								stringify(new Number()) === "0" &&
								stringify(new String()) == '""' &&
								// FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
								// does not define a canonical JSON representation (this applies to
								// objects with `toJSON` properties as well, *unless* they are nested
								// within an object or array).
								stringify(getClass) === undef &&
								// IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
								// FF 3.1b3 pass this test.
								stringify(undef) === undef &&
								// Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
								// respectively, if the value is omitted entirely.
								stringify() === undef &&
								// FF 3.1b1, 2 throw an error if the given value is not a number,
								// string, array, object, Boolean, or `null` literal. This applies to
								// objects with custom `toJSON` methods as well, unless they are nested
								// inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
								// methods entirely.
								stringify(value) === "1" &&
								stringify([value]) == "[1]" &&
								// Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
								// `"[null]"`.
								stringify([undef]) == "[null]" &&
								// YUI 3.0.0b1 fails to serialize `null` literals.
								stringify(null) == "null" &&
								// FF 3.1b1, 2 halts serialization if an array contains a function:
								// `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
								// elides non-JSON values from objects and arrays, unless they
								// define custom `toJSON` methods.
								stringify([undef, getClass, null]) == "[null,null,null]" &&
								// Simple serialization test. FF 3.1b1 uses Unicode escape sequences
								// where character escape codes are expected (e.g., `\b` => `\u0008`).
								stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
								// FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
								stringify(null, value) === "1" &&
								stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
								// JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
								// serialize extended years.
								stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
								// The milliseconds are optional in ES 5, but required in 5.1.
								stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
								// Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
								// four-digit years instead of six-digit years. Credits: @Yaffle.
								stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
								// Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
								// values less than 1000. Credits: @Yaffle.
								stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
						} catch (exception) {
							stringifySupported = false;
						}
					}
					isSupported = stringifySupported;
				}
				// Test `JSON.parse`.
				if (name == "json-parse") {
					var parse = exports.parse;
					if (typeof parse == "function") {
						try {
							// FF 3.1b1, b2 will throw an exception if a bare literal is provided.
							// Conforming implementations should also coerce the initial argument to
							// a string prior to parsing.
							if (parse("0") === 0 && !parse(false)) {
								// Simple parsing test.
								value = parse(serialized);
								var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
								if (parseSupported) {
									try {
										// Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
										parseSupported = !parse('"\t"');
									} catch (exception) {}
									if (parseSupported) {
										try {
											// FF 4.0 and 4.0.1 allow leading `+` signs and leading
											// decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
											// certain octal literals.
											parseSupported = parse("01") !== 1;
										} catch (exception) {}
									}
									if (parseSupported) {
										try {
											// FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
											// points. These environments, along with FF 3.1b1 and 2,
											// also allow trailing commas in JSON objects and arrays.
											parseSupported = parse("1.") !== 1;
										} catch (exception) {}
									}
								}
							}
						} catch (exception) {
							parseSupported = false;
						}
					}
					isSupported = parseSupported;
				}
			}
			return has[name] = !!isSupported;
		}

		if (!has("json")) {
			// Common `[[Class]]` name aliases.
			var functionClass = "[object Function]",
					dateClass = "[object Date]",
					numberClass = "[object Number]",
					stringClass = "[object String]",
					arrayClass = "[object Array]",
					booleanClass = "[object Boolean]";

			// Detect incomplete support for accessing string characters by index.
			var charIndexBuggy = has("bug-string-char-index");

			// Define additional utility methods if the `Date` methods are buggy.
			if (!isExtended) {
				var floor = Math.floor;
				// A mapping between the months of the year and the number of days between
				// January 1st and the first of the respective month.
				var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
				// Internal: Calculates the number of days between the Unix epoch and the
				// first day of the given month.
				var getDay = function (year, month) {
					return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
				};
			}

			// Internal: Determines if a property is a direct property of the given
			// object. Delegates to the native `Object#hasOwnProperty` method.
			if (!(isProperty = objectProto.hasOwnProperty)) {
				isProperty = function (property) {
					var members = {}, constructor;
					if ((members.__proto__ = null, members.__proto__ = {
						// The *proto* property cannot be set multiple times in recent
						// versions of Firefox and SeaMonkey.
						"toString": 1
					}, members).toString != getClass) {
						// Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
						// supports the mutable *proto* property.
						isProperty = function (property) {
							// Capture and break the object's prototype chain (see section 8.6.2
							// of the ES 5.1 spec). The parenthesized expression prevents an
							// unsafe transformation by the Closure Compiler.
							var original = this.__proto__, result = property in (this.__proto__ = null, this);
							// Restore the original prototype chain.
							this.__proto__ = original;
							return result;
						};
					} else {
						// Capture a reference to the top-level `Object` constructor.
						constructor = members.constructor;
						// Use the `constructor` property to simulate `Object#hasOwnProperty` in
						// other environments.
						isProperty = function (property) {
							var parent = (this.constructor || constructor).prototype;
							return property in this && !(property in parent && this[property] === parent[property]);
						};
					}
					members = null;
					return isProperty.call(this, property);
				};
			}

			// Internal: Normalizes the `for...in` iteration algorithm across
			// environments. Each enumerated key is yielded to a `callback` function.
			forEach = function (object, callback) {
				var size = 0, Properties, members, property;

				// Tests for bugs in the current environment's `for...in` algorithm. The
				// `valueOf` property inherits the non-enumerable flag from
				// `Object.prototype` in older versions of IE, Netscape, and Mozilla.
				(Properties = function () {
					this.valueOf = 0;
				}).prototype.valueOf = 0;

				// Iterate over a new instance of the `Properties` class.
				members = new Properties();
				for (property in members) {
					// Ignore all properties inherited from `Object.prototype`.
					if (isProperty.call(members, property)) {
						size++;
					}
				}
				Properties = members = null;

				// Normalize the iteration algorithm.
				if (!size) {
					// A list of non-enumerable properties inherited from `Object.prototype`.
					members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
					// IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
					// properties.
					forEach = function (object, callback) {
						var isFunction = getClass.call(object) == functionClass, property, length;
						var hasProperty = !isFunction && typeof object.constructor != "function" && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || isProperty;
						for (property in object) {
							// Gecko <= 1.0 enumerates the `prototype` property of functions under
							// certain conditions; IE does not.
							if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
								callback(property);
							}
						}
						// Manually invoke the callback for each non-enumerable property.
						for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
					};
				} else if (size == 2) {
					// Safari <= 2.0.4 enumerates shadowed properties twice.
					forEach = function (object, callback) {
						// Create a set of iterated properties.
						var members = {}, isFunction = getClass.call(object) == functionClass, property;
						for (property in object) {
							// Store each property name to prevent double enumeration. The
							// `prototype` property of functions is not enumerated due to cross-
							// environment inconsistencies.
							if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
								callback(property);
							}
						}
					};
				} else {
					// No bugs detected; use the standard `for...in` algorithm.
					forEach = function (object, callback) {
						var isFunction = getClass.call(object) == functionClass, property, isConstructor;
						for (property in object) {
							if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
								callback(property);
							}
						}
						// Manually invoke the callback for the `constructor` property due to
						// cross-environment inconsistencies.
						if (isConstructor || isProperty.call(object, (property = "constructor"))) {
							callback(property);
						}
					};
				}
				return forEach(object, callback);
			};

			// Public: Serializes a JavaScript `value` as a JSON string. The optional
			// `filter` argument may specify either a function that alters how object and
			// array members are serialized, or an array of strings and numbers that
			// indicates which properties should be serialized. The optional `width`
			// argument may be either a string or number that specifies the indentation
			// level of the output.
			if (!has("json-stringify")) {
				// Internal: A map of control characters and their escaped equivalents.
				var Escapes = {
					92: "\\\\",
					34: '\\"',
					8: "\\b",
					12: "\\f",
					10: "\\n",
					13: "\\r",
					9: "\\t"
				};

				// Internal: Converts `value` into a zero-padded string such that its
				// length is at least equal to `width`. The `width` must be <= 6.
				var leadingZeroes = "000000";
				var toPaddedString = function (width, value) {
					// The `|| 0` expression is necessary to work around a bug in
					// Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
					return (leadingZeroes + (value || 0)).slice(-width);
				};

				// Internal: Double-quotes a string `value`, replacing all ASCII control
				// characters (characters with code unit values between 0 and 31) with
				// their escaped equivalents. This is an implementation of the
				// `Quote(value)` operation defined in ES 5.1 section 15.12.3.
				var unicodePrefix = "\\u00";
				var quote = function (value) {
					var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
					var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
					for (; index < length; index++) {
						var charCode = value.charCodeAt(index);
						// If the character is a control character, append its Unicode or
						// shorthand escape sequence; otherwise, append the character as-is.
						switch (charCode) {
							case 8: case 9: case 10: case 12: case 13: case 34: case 92:
								result += Escapes[charCode];
								break;
							default:
								if (charCode < 32) {
									result += unicodePrefix + toPaddedString(2, charCode.toString(16));
									break;
								}
								result += useCharIndex ? symbols[index] : value.charAt(index);
						}
					}
					return result + '"';
				};

				// Internal: Recursively serializes an object. Implements the
				// `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
				var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
					var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
					try {
						// Necessary for host object support.
						value = object[property];
					} catch (exception) {}
					if (typeof value == "object" && value) {
						className = getClass.call(value);
						if (className == dateClass && !isProperty.call(value, "toJSON")) {
							if (value > -1 / 0 && value < 1 / 0) {
								// Dates are serialized according to the `Date#toJSON` method
								// specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
								// for the ISO 8601 date time string format.
								if (getDay) {
									// Manually compute the year, month, date, hours, minutes,
									// seconds, and milliseconds if the `getUTC*` methods are
									// buggy. Adapted from @Yaffle's `date-shim` project.
									date = floor(value / 864e5);
									for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
									for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
									date = 1 + date - getDay(year, month);
									// The `time` value specifies the time within the day (see ES
									// 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
									// to compute `A modulo B`, as the `%` operator does not
									// correspond to the `modulo` operation for negative numbers.
									time = (value % 864e5 + 864e5) % 864e5;
									// The hours, minutes, seconds, and milliseconds are obtained by
									// decomposing the time within the day. See section 15.9.1.10.
									hours = floor(time / 36e5) % 24;
									minutes = floor(time / 6e4) % 60;
									seconds = floor(time / 1e3) % 60;
									milliseconds = time % 1e3;
								} else {
									year = value.getUTCFullYear();
									month = value.getUTCMonth();
									date = value.getUTCDate();
									hours = value.getUTCHours();
									minutes = value.getUTCMinutes();
									seconds = value.getUTCSeconds();
									milliseconds = value.getUTCMilliseconds();
								}
								// Serialize extended years correctly.
								value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
									"-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
									// Months, dates, hours, minutes, and seconds should have two
									// digits; milliseconds should have three.
									"T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
									// Milliseconds are optional in ES 5.0, but required in 5.1.
									"." + toPaddedString(3, milliseconds) + "Z";
							} else {
								value = null;
							}
						} else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
							// Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
							// `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
							// ignores all `toJSON` methods on these objects unless they are
							// defined directly on an instance.
							value = value.toJSON(property);
						}
					}
					if (callback) {
						// If a replacement function was provided, call it to obtain the value
						// for serialization.
						value = callback.call(object, property, value);
					}
					if (value === null) {
						return "null";
					}
					className = getClass.call(value);
					if (className == booleanClass) {
						// Booleans are represented literally.
						return "" + value;
					} else if (className == numberClass) {
						// JSON numbers must be finite. `Infinity` and `NaN` are serialized as
						// `"null"`.
						return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
					} else if (className == stringClass) {
						// Strings are double-quoted and escaped.
						return quote("" + value);
					}
					// Recursively serialize objects and arrays.
					if (typeof value == "object") {
						// Check for cyclic structures. This is a linear search; performance
						// is inversely proportional to the number of unique nested objects.
						for (length = stack.length; length--;) {
							if (stack[length] === value) {
								// Cyclic structures cannot be serialized by `JSON.stringify`.
								throw TypeError();
							}
						}
						// Add the object to the stack of traversed objects.
						stack.push(value);
						results = [];
						// Save the current indentation level and indent one additional level.
						prefix = indentation;
						indentation += whitespace;
						if (className == arrayClass) {
							// Recursively serialize array elements.
							for (index = 0, length = value.length; index < length; index++) {
								element = serialize(index, value, callback, properties, whitespace, indentation, stack);
								results.push(element === undef ? "null" : element);
							}
							result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
						} else {
							// Recursively serialize object members. Members are selected from
							// either a user-specified list of property names, or the object
							// itself.
							forEach(properties || value, function (property) {
								var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
								if (element !== undef) {
									// According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
									// is not the empty string, let `member` {quote(property) + ":"}
									// be the concatenation of `member` and the `space` character."
									// The "`space` character" refers to the literal space
									// character, not the `space` {width} argument provided to
									// `JSON.stringify`.
									results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
								}
							});
							result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
						}
						// Remove the object from the traversed object stack.
						stack.pop();
						return result;
					}
				};

				// Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
				exports.stringify = function (source, filter, width) {
					var whitespace, callback, properties, className;
					if (objectTypes[typeof filter] && filter) {
						if ((className = getClass.call(filter)) == functionClass) {
							callback = filter;
						} else if (className == arrayClass) {
							// Convert the property names array into a makeshift set.
							properties = {};
							for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
						}
					}
					if (width) {
						if ((className = getClass.call(width)) == numberClass) {
							// Convert the `width` to an integer and create a string containing
							// `width` number of space characters.
							if ((width -= width % 1) > 0) {
								for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
							}
						} else if (className == stringClass) {
							whitespace = width.length <= 10 ? width : width.slice(0, 10);
						}
					}
					// Opera <= 7.54u2 discards the values associated with empty string keys
					// (`""`) only if they are used directly within an object member list
					// (e.g., `!("" in { "": 1})`).
					return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
				};
			}

			// Public: Parses a JSON source string.
			if (!has("json-parse")) {
				var fromCharCode = String.fromCharCode;

				// Internal: A map of escaped control characters and their unescaped
				// equivalents.
				var Unescapes = {
					92: "\\",
					34: '"',
					47: "/",
					98: "\b",
					116: "\t",
					110: "\n",
					102: "\f",
					114: "\r"
				};

				// Internal: Stores the parser state.
				var Index, Source;

				// Internal: Resets the parser state and throws a `SyntaxError`.
				var abort = function () {
					Index = Source = null;
					throw SyntaxError();
				};

				// Internal: Returns the next token, or `"$"` if the parser has reached
				// the end of the source string. A token may be a string, number, `null`
				// literal, or Boolean literal.
				var lex = function () {
					var source = Source, length = source.length, value, begin, position, isSigned, charCode;
					while (Index < length) {
						charCode = source.charCodeAt(Index);
						switch (charCode) {
							case 9: case 10: case 13: case 32:
								// Skip whitespace tokens, including tabs, carriage returns, line
								// feeds, and space characters.
								Index++;
								break;
							case 123: case 125: case 91: case 93: case 58: case 44:
								// Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
								// the current position.
								value = charIndexBuggy ? source.charAt(Index) : source[Index];
								Index++;
								return value;
							case 34:
								// `"` delimits a JSON string; advance to the next character and
								// begin parsing the string. String tokens are prefixed with the
								// sentinel `@` character to distinguish them from punctuators and
								// end-of-string tokens.
								for (value = "@", Index++; Index < length;) {
									charCode = source.charCodeAt(Index);
									if (charCode < 32) {
										// Unescaped ASCII control characters (those with a code unit
										// less than the space character) are not permitted.
										abort();
									} else if (charCode == 92) {
										// A reverse solidus (`\`) marks the beginning of an escaped
										// control character (including `"`, `\`, and `/`) or Unicode
										// escape sequence.
										charCode = source.charCodeAt(++Index);
										switch (charCode) {
											case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
												// Revive escaped control characters.
												value += Unescapes[charCode];
												Index++;
												break;
											case 117:
												// `\u` marks the beginning of a Unicode escape sequence.
												// Advance to the first character and validate the
												// four-digit code point.
												begin = ++Index;
												for (position = Index + 4; Index < position; Index++) {
													charCode = source.charCodeAt(Index);
													// A valid sequence comprises four hexdigits (case-
													// insensitive) that form a single hexadecimal value.
													if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
														// Invalid Unicode escape sequence.
														abort();
													}
												}
												// Revive the escaped character.
												value += fromCharCode("0x" + source.slice(begin, Index));
												break;
											default:
												// Invalid escape sequence.
												abort();
										}
									} else {
										if (charCode == 34) {
											// An unescaped double-quote character marks the end of the
											// string.
											break;
										}
										charCode = source.charCodeAt(Index);
										begin = Index;
										// Optimize for the common case where a string is valid.
										while (charCode >= 32 && charCode != 92 && charCode != 34) {
											charCode = source.charCodeAt(++Index);
										}
										// Append the string as-is.
										value += source.slice(begin, Index);
									}
								}
								if (source.charCodeAt(Index) == 34) {
									// Advance to the next character and return the revived string.
									Index++;
									return value;
								}
								// Unterminated string.
								abort();
							default:
								// Parse numbers and literals.
								begin = Index;
								// Advance past the negative sign, if one is specified.
								if (charCode == 45) {
									isSigned = true;
									charCode = source.charCodeAt(++Index);
								}
								// Parse an integer or floating-point value.
								if (charCode >= 48 && charCode <= 57) {
									// Leading zeroes are interpreted as octal literals.
									if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
										// Illegal octal literal.
										abort();
									}
									isSigned = false;
									// Parse the integer component.
									for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
									// Floats cannot contain a leading decimal point; however, this
									// case is already accounted for by the parser.
									if (source.charCodeAt(Index) == 46) {
										position = ++Index;
										// Parse the decimal component.
										for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
										if (position == Index) {
											// Illegal trailing decimal.
											abort();
										}
										Index = position;
									}
									// Parse exponents. The `e` denoting the exponent is
									// case-insensitive.
									charCode = source.charCodeAt(Index);
									if (charCode == 101 || charCode == 69) {
										charCode = source.charCodeAt(++Index);
										// Skip past the sign following the exponent, if one is
										// specified.
										if (charCode == 43 || charCode == 45) {
											Index++;
										}
										// Parse the exponential component.
										for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
										if (position == Index) {
											// Illegal empty exponent.
											abort();
										}
										Index = position;
									}
									// Coerce the parsed value to a JavaScript number.
									return +source.slice(begin, Index);
								}
								// A negative sign may only precede numbers.
								if (isSigned) {
									abort();
								}
								// `true`, `false`, and `null` literals.
								if (source.slice(Index, Index + 4) == "true") {
									Index += 4;
									return true;
								} else if (source.slice(Index, Index + 5) == "false") {
									Index += 5;
									return false;
								} else if (source.slice(Index, Index + 4) == "null") {
									Index += 4;
									return null;
								}
								// Unrecognized token.
								abort();
						}
					}
					// Return the sentinel `$` character if the parser has reached the end
					// of the source string.
					return "$";
				};

				// Internal: Parses a JSON `value` token.
				var get = function (value) {
					var results, hasMembers;
					if (value == "$") {
						// Unexpected end of input.
						abort();
					}
					if (typeof value == "string") {
						if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
							// Remove the sentinel `@` character.
							return value.slice(1);
						}
						// Parse object and array literals.
						if (value == "[") {
							// Parses a JSON array, returning a new JavaScript array.
							results = [];
							for (;; hasMembers || (hasMembers = true)) {
								value = lex();
								// A closing square bracket marks the end of the array literal.
								if (value == "]") {
									break;
								}
								// If the array literal contains elements, the current token
								// should be a comma separating the previous element from the
								// next.
								if (hasMembers) {
									if (value == ",") {
										value = lex();
										if (value == "]") {
											// Unexpected trailing `,` in array literal.
											abort();
										}
									} else {
										// A `,` must separate each array element.
										abort();
									}
								}
								// Elisions and leading commas are not permitted.
								if (value == ",") {
									abort();
								}
								results.push(get(value));
							}
							return results;
						} else if (value == "{") {
							// Parses a JSON object, returning a new JavaScript object.
							results = {};
							for (;; hasMembers || (hasMembers = true)) {
								value = lex();
								// A closing curly brace marks the end of the object literal.
								if (value == "}") {
									break;
								}
								// If the object literal contains members, the current token
								// should be a comma separator.
								if (hasMembers) {
									if (value == ",") {
										value = lex();
										if (value == "}") {
											// Unexpected trailing `,` in object literal.
											abort();
										}
									} else {
										// A `,` must separate each object member.
										abort();
									}
								}
								// Leading commas are not permitted, object property names must be
								// double-quoted strings, and a `:` must separate each property
								// name and value.
								if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
									abort();
								}
								results[value.slice(1)] = get(lex());
							}
							return results;
						}
						// Unexpected token encountered.
						abort();
					}
					return value;
				};

				// Internal: Updates a traversed object member.
				var update = function (source, property, callback) {
					var element = walk(source, property, callback);
					if (element === undef) {
						delete source[property];
					} else {
						source[property] = element;
					}
				};

				// Internal: Recursively traverses a parsed JSON object, invoking the
				// `callback` function for each value. This is an implementation of the
				// `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
				var walk = function (source, property, callback) {
					var value = source[property], length;
					if (typeof value == "object" && value) {
						// `forEach` can't be used to traverse an array in Opera <= 8.54
						// because its `Object#hasOwnProperty` implementation returns `false`
						// for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
						if (getClass.call(value) == arrayClass) {
							for (length = value.length; length--;) {
								update(value, length, callback);
							}
						} else {
							forEach(value, function (property) {
								update(value, property, callback);
							});
						}
					}
					return callback.call(source, property, value);
				};

				// Public: `JSON.parse`. See ES 5.1 section 15.12.2.
				exports.parse = function (source, callback) {
					var result, value;
					Index = 0;
					Source = "" + source;
					result = get(lex());
					// If a JSON string contains multiple tokens, it is invalid.
					if (lex() != "$") {
						abort();
					}
					// Reset the parser state.
					Index = Source = null;
					return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
				};
			}
		}

		exports["runInContext"] = runInContext;
		return exports;
	}

	if (freeExports && !isLoader) {
		// Export for CommonJS environments.
		runInContext(root, freeExports);
	} else {
		// Export for web browsers and JavaScript engines.
		var nativeJSON = root.JSON,
				previousJSON = root["JSON3"],
				isRestored = false;

		var JSON3 = runInContext(root, (root["JSON3"] = {
			// Public: Restores the original value of the global `JSON` object and
			// returns a reference to the `JSON3` object.
			"noConflict": function () {
				if (!isRestored) {
					isRestored = true;
					root.JSON = nativeJSON;
					root["JSON3"] = previousJSON;
					nativeJSON = previousJSON = null;
				}
				return JSON3;
			}
		}));

		root.JSON = {
			"parse": JSON3.parse,
			"stringify": JSON3.stringify
		};
	}

	// Export for asynchronous module loaders.
	if (isLoader) {
		define(function () {
			return JSON3;
		});
	}
}).call(this);




/*
JSON 4
*/


var json4 = (function() {
	"use strict";

	function json(input) {
		var charCode;

		do {
			charCode = input.charCodeAt(this.index++);
		} while(charCode <= 32)

		if(charCode == 91) { // [
			while((charCode = input.charCodeAt(this.index)) <= 32) {
				this.index++;
			}

			if(charCode == 93) {
				this.index++;
				return [];
			}

			var result = [];

			do {
				result.push(json.call(this, input));

				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)
			} while(charCode == 44); //,

			if(charCode == 93) { // ]
				return result;
			}
		} else if(charCode == 123) { // {
			while((charCode = input.charCodeAt(this.index)) <= 32) {
				this.index++;
			}

			if(charCode == 125) { // }
				this.index++;
				return {};
			}

			var result = {};
			var id, start, tmp;

			do {
				while((charCode = input.charCodeAt(this.index)) <= 32) {
					this.index++;
				}

				if(charCode != 34) { // "
					throw new SyntaxError("Illegal character expected '\"' at index "+this.index+"!");
				}

				start = this.index;

				do {
					this.index = input.indexOf('"', this.index+1);
					for(tmp = 1; input.charCodeAt(this.index-tmp) == 92; tmp++) {}
				} while(tmp%2==0)

				if(this.index == -1) {
					throw new SyntaxError("Unterminated string literal!");
				}

				id = input.slice(start+1, this.index++).replace('\\"', '"');


				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)

				if(charCode != 58) { // :
					throw new SyntaxError("Illegal character expecting ':' at index "+this.index+"!");
				}

				result[id] = json.call(this, input);

				do {
					charCode = input.charCodeAt(this.index++);
				} while(charCode <= 32)
			} while(charCode == 44); // ,

			if(charCode == 125) { // }
				return result;
			}
		} else if(charCode >= 48 && charCode <= 57 || charCode == 43 || charCode == 45) { //digit
			var start = this.index-1;

			if(charCode == 43 || charCode == 45) { //+ -
				charCode = input.charCodeAt(++this.index);
			}

			while((charCode = input.charCodeAt(this.index)) >= 48 && charCode <= 57) {
				this.index++;
			}

			if(charCode == 46) { //.
				do {
					charCode = input.charCodeAt(++this.index);
				} while(charCode >= 48 && charCode <= 57)
			}
			if(charCode == 69 || charCode == 101) { //e E
				charCode = input.charCodeAt(++this.index);
				if(charCode == 43 || charCode == 45) { //+ -
					charCode = input.charCodeAt(++this.index);
				}

				if(charCode >= 48 && charCode <= 57) {
					do {
						charCode = input.charCodeAt(++this.index);
					} while(charCode >= 48 && charCode <= 57)
				} else {
					throw SyntaxError("Missing exponent at index "+this.index+"");
				}
			}

			return parseFloat(input.slice(start, this.index));
		} else if(charCode == 34) { // "
			var start = this.index-1;

			do {
				this.index = input.indexOf('"', this.index+1);
				for(tmp = 1; input.charCodeAt(this.index-tmp) == 92; tmp++) {}
			} while(tmp%2==0)

			if(this.index == -1) {
				throw new SyntaxError("Unterminated string literal!");
			}

			return input.slice(start+1, this.index++).replace('\\"', '"');
		} else if(charCode == 110) { //n
			if(input.charCodeAt(this.index++) == 117) {
				if(input.charCodeAt(this.index++) == 108) {
					if(input.charCodeAt(this.index++) == 108) {
						return null;
					}
				}
			}
		} else if(charCode == 102) { //f
			if(input.charCodeAt(this.index++) == 97) {
				if(input.charCodeAt(this.index++) == 108) {
					if(input.charCodeAt(this.index++) == 115) {
						if(input.charCodeAt(this.index++) == 101) {
							return false;
						}
					}
				}
			}
		} else if(charCode == 116) { //t
			if(input.charCodeAt(this.index++) == 114) {
				if(input.charCodeAt(this.index++) == 117) {
					if(input.charCodeAt(this.index++) == 101) {
						return true;
					}
				}
			}
		}

		throw new SyntaxError("Unexpected character '"+input[this.index]+"' at index "+this.index+"!");
	}
	return function(input) {
		return json.call({index : 0}, input);
	}
})();





/*
JSON 5
*/

// json5.js
// Modern JSON. See README.md for details.
//
// This file is based directly off of Douglas Crockford's json_parse.js:
// https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js

var JSON5 = (typeof exports === 'object' ? exports : {});

JSON5.parse = (function () {
	"use strict";

// This is a function that can parse a JSON5 text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON5 parser in other languages.

// We are defining the function inside of another function to avoid creating
// global variables.

	var at,     // The index of the current character
		ch,     // The current character
		escapee = {
			"'":  "'",
			'"':  '"',
			'\\': '\\',
			'/':  '/',
			'\n': '',       // Replace escaped newlines in strings w/ empty string
			b:    '\b',
			f:    '\f',
			n:    '\n',
			r:    '\r',
			t:    '\t'
		},
		ws = [
			' ',
			'\t',
			'\r',
			'\n',
			'\v',
			'\f',
			'\xA0',
			'\uFEFF'
		],
		text,

		error = function (m) {

// Call error when something is wrong.

			var error = new SyntaxError();
			error.message = m;
			error.at = at;
			error.text = text;
			throw error;
		},

		next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

			if (c && c !== ch) {
				error("Expected '" + c + "' instead of '" + ch + "'");
			}

// Get the next character. When there are no more characters,
// return the empty string.

			ch = text.charAt(at);
			at += 1;
			return ch;
		},

		peek = function () {

// Get the next character without consuming it or
// assigning it to the ch varaible.

			return text.charAt(at);
		},

		identifier = function () {

// Parse an identifier. Normally, reserved words are disallowed here, but we
// only use this for unquoted object keys, where reserved words are allowed,
// so we don't check for those here. References:
// - http://es5.github.com/#x7.6
// - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
// - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
// TODO Identifiers can have Unicode "letters" in them; add support for those.

			var key = ch;

			// Identifiers must start with a letter, _ or $.
			if ((ch !== '_' && ch !== '$') &&
					(ch < 'a' || ch > 'z') &&
					(ch < 'A' || ch > 'Z')) {
				error("Bad identifier");
			}

			// Subsequent characters can contain digits.
			while (next() && (
					ch === '_' || ch === '$' ||
					(ch >= 'a' && ch <= 'z') ||
					(ch >= 'A' && ch <= 'Z') ||
					(ch >= '0' && ch <= '9'))) {
				key += ch;
			}

			return key;
		},

		number = function () {

// Parse a number value.

			var number,
				sign = '',
				string = '',
				base = 10;

			if (ch === '-' || ch === '+') {
				sign = ch;
				next(ch);
			}

			// support for Infinity (could tweak to allow other words):
			if (ch === 'I') {
				number = word();
				if (typeof number !== 'number' || isNaN(number)) {
					error('Unexpected word for number');
				}
				return (sign === '-') ? -number : number;
			}

			// support for NaN
			if (ch === 'N' ) {
			  number = word();
			  if (!isNaN(number)) {
				error('expected word to be NaN');
			  }
			  // ignore sign as -NaN also is NaN
			  return number;
			}

			if (ch === '0') {
				string += ch;
				next();
				if (ch === 'x' || ch === 'X') {
					string += ch;
					next();
					base = 16;
				} else if (ch >= '0' && ch <= '9') {
					error('Octal literal');
				}
			}

			switch (base) {
			case 10:
				while (ch >= '0' && ch <= '9' ) {
					string += ch;
					next();
				}
				if (ch === '.') {
					string += '.';
					while (next() && ch >= '0' && ch <= '9') {
						string += ch;
					}
				}
				if (ch === 'e' || ch === 'E') {
					string += ch;
					next();
					if (ch === '-' || ch === '+') {
						string += ch;
						next();
					}
					while (ch >= '0' && ch <= '9') {
						string += ch;
						next();
					}
				}
				break;
			case 16:
				while (ch >= '0' && ch <= '9' || ch >= 'A' && ch <= 'F' || ch >= 'a' && ch <= 'f') {
					string += ch;
					next();
				}
				break;
			}

			if(sign === '-') {
				number = -string;
			} else {
				number = +string;
			}

			if (!isFinite(number)) {
				error("Bad number");
			} else {
				return number;
			}
		},

		string = function () {

// Parse a string value.

			var hex,
				i,
				string = '',
				delim,      // double quote or single quote
				uffff;

// When parsing for string values, we must look for ' or " and \ characters.

			if (ch === '"' || ch === "'") {
				delim = ch;
				while (next()) {
					if (ch === delim) {
						next();
						return string;
					} else if (ch === '\\') {
						next();
						if (ch === 'u') {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) {
									break;
								}
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (ch === '\r') {
							if (peek() === '\n') {
								next();
							}
						} else if (typeof escapee[ch] === 'string') {
							string += escapee[ch];
						} else {
							break;
						}
					} else if (ch === '\n') {
						// unescaped newlines are invalid; see:
						// https://github.com/aseemk/json5/issues/24
						// TODO this feels special-cased; are there other
						// invalid unescaped chars?
						break;
					} else {
						string += ch;
					}
				}
			}
			error("Bad string");
		},

		inlineComment = function () {

// Skip an inline comment, assuming this is one. The current character should
// be the second / character in the // pair that begins this inline comment.
// To finish the inline comment, we look for a newline or the end of the text.

			if (ch !== '/') {
				error("Not an inline comment");
			}

			do {
				next();
				if (ch === '\n' || ch === '\r') {
					next();
					return;
				}
			} while (ch);
		},

		blockComment = function () {

// Skip a block comment, assuming this is one. The current character should be
// the * character in the /* pair that begins this block comment.
// To finish the block comment, we look for an ending */ pair of characters,
// but we also watch for the end of text before the comment is terminated.

			if (ch !== '*') {
				error("Not a block comment");
			}

			do {
				next();
				while (ch === '*') {
					next('*');
					if (ch === '/') {
						next('/');
						return;
					}
				}
			} while (ch);

			error("Unterminated block comment");
		},

		comment = function () {

// Skip a comment, whether inline or block-level, assuming this is one.
// Comments always begin with a / character.

			if (ch !== '/') {
				error("Not a comment");
			}

			next('/');

			if (ch === '/') {
				inlineComment();
			} else if (ch === '*') {
				blockComment();
			} else {
				error("Unrecognized comment");
			}
		},

		white = function () {

// Skip whitespace and comments.
// Note that we're detecting comments by only a single / character.
// This works since regular expressions are not valid JSON(5), but this will
// break if there are other valid values that begin with a / character!

			while (ch) {
				if (ch === '/') {
					comment();
				} else if (ws.indexOf(ch) >= 0) {
					next();
				} else {
					return;
				}
			}
		},

		word = function () {

// true, false, or null.

			switch (ch) {
			case 't':
				next('t');
				next('r');
				next('u');
				next('e');
				return true;
			case 'f':
				next('f');
				next('a');
				next('l');
				next('s');
				next('e');
				return false;
			case 'n':
				next('n');
				next('u');
				next('l');
				next('l');
				return null;
			case 'I':
				next('I');
				next('n');
				next('f');
				next('i');
				next('n');
				next('i');
				next('t');
				next('y');
				return Infinity;
			case 'N':
			  next( 'N' );
			  next( 'a' );
			  next( 'N' );
			  return NaN;
			}
			error("Unexpected '" + ch + "'");
		},

		value,  // Place holder for the value function.

		array = function () {

// Parse an array value.

			var array = [];

			if (ch === '[') {
				next('[');
				white();
				while (ch) {
					if (ch === ']') {
						next(']');
						return array;   // Potentially empty array
					}
					// ES5 allows omitting elements in arrays, e.g. [,] and
					// [,null]. We don't allow this in JSON5.
					if (ch === ',') {
						error("Missing array element");
					} else {
						array.push(value());
					}
					white();
					// If there's no comma after this value, this needs to
					// be the end of the array.
					if (ch !== ',') {
						next(']');
						return array;
					}
					next(',');
					white();
				}
			}
			error("Bad array");
		},

		object = function () {

// Parse an object value.

			var key,
				object = {};

			if (ch === '{') {
				next('{');
				white();
				while (ch) {
					if (ch === '}') {
						next('}');
						return object;   // Potentially empty object
					}

					// Keys can be unquoted. If they are, they need to be
					// valid JS identifiers.
					if (ch === '"' || ch === "'") {
						key = string();
					} else {
						key = identifier();
					}

					white();
					next(':');
					object[key] = value();
					white();
					// If there's no comma after this pair, this needs to be
					// the end of the object.
					if (ch !== ',') {
						next('}');
						return object;
					}
					next(',');
					white();
				}
			}
			error("Bad object");
		};

	value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

		white();
		switch (ch) {
		case '{':
			return object();
		case '[':
			return array();
		case '"':
		case "'":
			return string();
		case '-':
		case '+':
		case '.':
			return number();
		default:
			return ch >= '0' && ch <= '9' ? number() : word();
		}
	};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

	return function (source, reviver) {
		var result;

		text = String(source);
		at = 0;
		ch = ' ';
		result = value();
		white();
		if (ch) {
			error("Syntax error");
		}

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

		return typeof reviver === 'function' ? (function walk(holder, key) {
			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = walk(value, k);
						if (v !== undefined) {
							value[k] = v;
						} else {
							delete value[k];
						}
					}
				}
			}
			return reviver.call(holder, key, value);
		}({'': result}, '')) : result;
	};
}());

// JSON5 stringify will not quote keys where appropriate
JSON5.stringify = function (obj, replacer, space) {
	if (replacer && (typeof(replacer) !== "function" && !isArray(replacer))) {
		throw new Error('Replacer must be a function or an array');
	}
	var getReplacedValueOrUndefined = function(holder, key, isTopLevel) {
		var value = holder[key];

		// Replace the value with its toJSON value first, if possible
		if (value && value.toJSON && typeof value.toJSON === "function") {
			value = value.toJSON();
		}

		// If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
		// presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
		if (typeof(replacer) === "function") {
			return replacer.call(holder, key, value);
		} else if(replacer) {
			if (isTopLevel || isArray(holder) || replacer.indexOf(key) >= 0) {
				return value;
			} else {
				return undefined;
			}
		} else {
			return value;
		}
	};

	function isWordChar(char) {
		return (char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') ||
			char === '_' || char === '$';
	}

	function isWordStart(char) {
		return (char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			char === '_' || char === '$';
	}

	function isWord(key) {
		if (typeof key !== 'string') {
			return false;
		}
		if (!isWordStart(key[0])) {
			return false;
		}
		var i = 1, length = key.length;
		while (i < length) {
			if (!isWordChar(key[i])) {
				return false;
			}
			i++;
		}
		return true;
	}

	// export for use in tests
	JSON5.isWord = isWord;

	// polyfills
	function isArray(obj) {
		if (Array.isArray) {
			return Array.isArray(obj);
		} else {
			return Object.prototype.toString.call(obj) === '[object Array]';
		}
	}

	function isDate(obj) {
		return Object.prototype.toString.call(obj) === '[object Date]';
	}

	isNaN = isNaN || function(val) {
		return typeof val === 'number' && val !== val;
	};

	var objStack = [];
	function checkForCircular(obj) {
		for (var i = 0; i < objStack.length; i++) {
			if (objStack[i] === obj) {
				throw new TypeError("Converting circular structure to JSON");
			}
		}
	}

	function makeIndent(str, num, noNewLine) {
		if (!str) {
			return "";
		}
		// indentation no more than 10 chars
		if (str.length > 10) {
			str = str.substring(0, 10);
		}

		var indent = noNewLine ? "" : "\n";
		for (var i = 0; i < num; i++) {
			indent += str;
		}

		return indent;
	}

	var indentStr;
	if (space) {
		if (typeof space === "string") {
			indentStr = space;
		} else if (typeof space === "number" && space >= 0) {
			indentStr = makeIndent(" ", space, true);
		} else {
			// ignore space parameter
		}
	}

	// Copied from Crokford's implementation of JSON
	// See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
	// Begin
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		meta = { // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	};
	function escapeString(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ?
				c :
				'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}
	// End

	function internalStringify(holder, key, isTopLevel) {
		var buffer, res;

		// Replace the value, if necessary
		var obj_part = getReplacedValueOrUndefined(holder, key, isTopLevel);

		if (obj_part && !isDate(obj_part)) {
			// unbox objects
			// don't unbox dates, since will turn it into number
			obj_part = obj_part.valueOf();
		}
		switch(typeof obj_part) {
			case "boolean":
				return obj_part.toString();

			case "number":
				if (isNaN(obj_part) || !isFinite(obj_part)) {
					return "null";
				}
				return obj_part.toString();

			case "string":
				return escapeString(obj_part.toString());

			case "object":
				if (obj_part === null) {
					return "null";
				} else if (isArray(obj_part)) {
					checkForCircular(obj_part);
					buffer = "[";
					objStack.push(obj_part);

					for (var i = 0; i < obj_part.length; i++) {
						res = internalStringify(obj_part, i, false);
						buffer += makeIndent(indentStr, objStack.length);
						if (res === null || typeof res === "undefined") {
							buffer += "null";
						} else {
							buffer += res;
						}
						if (i < obj_part.length-1) {
							buffer += ",";
						} else if (indentStr) {
							buffer += "\n";
						}
					}
					objStack.pop();
					buffer += makeIndent(indentStr, objStack.length, true) + "]";
				} else {
					checkForCircular(obj_part);
					buffer = "{";
					var nonEmpty = false;
					objStack.push(obj_part);
					for (var prop in obj_part) {
						if (obj_part.hasOwnProperty(prop)) {
							var value = internalStringify(obj_part, prop, false);
							isTopLevel = false;
							if (typeof value !== "undefined" && value !== null) {
								buffer += makeIndent(indentStr, objStack.length);
								nonEmpty = true;
								var key = isWord(prop) ? prop : escapeString(prop);
								buffer += key + ":" + (indentStr ? ' ' : '') + value + ",";
							}
						}
					}
					objStack.pop();
					if (nonEmpty) {
						buffer = buffer.substring(0, buffer.length-1) + makeIndent(indentStr, objStack.length) + "}";
					} else {
						buffer = '{}';
					}
				}
				return buffer;
			default:
				// functions and undefined should be ignored
				return undefined;
		}
	}

	// special case...when undefined is used inside of
	// a compound object/array, return null.
	// but when top-level, return undefined
	var topLevelHolder = {"":obj};
	if (obj === undefined) {
		return getReplacedValueOrUndefined(topLevelHolder, '', true);
	}
	return internalStringify(topLevelHolder, '', true);
};


/*
JSON Compress
*/


(function () {

	var root,
		JSONC = {},
		isNodeEnvironment,
		_nCode = -1,
		toString = {}.toString;

	root = this;

	isNodeEnvironment = typeof exports === 'object' && typeof module === 'object' && typeof module.exports === 'object' && typeof require === 'function';

	function contains(arr, v) {
		var nIndex,
			nLen = arr.length;
		for (nIndex = 0; nIndex < nLen; nIndex++) {
			if (arr[nIndex][1] === v) {
				return true;
			}
		}
		return false;
	}

	function unique(oldArray) {
		var nIndex,
			nLen = oldArray.length,
			aArr = [];
		for (nIndex = 0; nIndex < nLen; nIndex++) {
			if (!contains(aArr, oldArray[nIndex][1])) {
				aArr.push(oldArray[nIndex]);
			}
		}
		return aArr;
	}

	function escapeRegExp(text) {
		return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
	}

	function _isObject(obj) {
		return toString.call(obj) === '[object Object]';
	}

	function _isArray(obj) {
		return toString.call(obj) === '[object Array]';
	}

	function _biDimensionalArrayToObject(aArr) {
		var obj = {},
			nIndex,
			nLen = aArr.length,
			oItem;
		for (nIndex = 0; nIndex < nLen; nIndex++) {
			oItem = aArr[nIndex];
			obj[oItem[0]] = oItem[1];
		}
		return obj;
	}

	function _numberToKey(index, totalChar, offset) {
		var sKeys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=_!?()*',
			aArr = [],
			currentChar = index;
		totalChar = totalChar || sKeys.length;
		offset = offset || 0;
		while (currentChar >= totalChar) {
			aArr.push(sKeys.charCodeAt((currentChar % totalChar) + offset));
			currentChar = Math.floor(currentChar / totalChar - 1);
		}
		aArr.push(sKeys.charCodeAt(currentChar + offset));
		return aArr.reverse();
	}

	function _getSpecialKey(aKeys) {
		return String.fromCharCode.apply(String, aKeys);
	}

	function _getKeys(json, aKeys) {
		var aKey,
			sKey,
			oItem;

		for (sKey in json) {

			if (json.hasOwnProperty(sKey)) {
				oItem = json[sKey];
				if (_isObject(oItem) || _isArray(oItem)) {
					aKeys = aKeys.concat(unique(_getKeys(oItem, aKeys)));
				}
				if (isNaN(Number(sKey))) {
					if (!contains(aKeys, sKey)) {
						_nCode += 1;
						aKey = [];
						aKey.push(_getSpecialKey(_numberToKey(_nCode)), sKey);
						aKeys.push(aKey);
					}
				}
			}
		}
		return aKeys;
	}

	function _compressArray(json, aKeys) {
		var nIndex,
			nLenKeys;

		for (nIndex = 0, nLenKeys = json.length; nIndex < nLenKeys; nIndex++) {
			json[nIndex] = JSONC.compress(json[nIndex], aKeys);
		}
	}

	function _compressOther(json, aKeys) {
		var oKeys,
			aKey,
			str,
			nLenKeys,
			nIndex,
			obj;
		aKeys = _getKeys(json, aKeys);
		aKeys = unique(aKeys);
		oKeys = _biDimensionalArrayToObject(aKeys);

		str = JSON.stringify(json);
		nLenKeys = aKeys.length;

		for (nIndex = 0; nIndex < nLenKeys; nIndex++) {
			aKey = aKeys[nIndex];
			str = str.replace(new RegExp(escapeRegExp('"' + aKey[1] + '"'), 'g'), '"' + aKey[0] + '"');
		}
		obj = JSON.parse(str);
		obj._ = oKeys;
		return obj;
	}

	function _decompressArray(json) {
		var nIndex, nLenKeys;

		for (nIndex = 0, nLenKeys = json.length; nIndex < nLenKeys; nIndex++) {
			json[nIndex] = JSONC.decompress(json[nIndex]);
		}
	}

	function _decompressOther(jsonCopy) {
		var oKeys, str, sKey;

		oKeys = JSON.parse(JSON.stringify(jsonCopy._));
		delete jsonCopy._;
		str = JSON.stringify(jsonCopy);
		for (sKey in oKeys) {
			if (oKeys.hasOwnProperty(sKey)) {
				str = str.replace(new RegExp('"' + sKey + '"', 'g'), '"' + oKeys[sKey] + '"');
			}
		}
		return str;
	}

	JSONC.compress = function (json, optKeys) {
		if (!optKeys) {
			_nCode = -1;
		}
		var aKeys = optKeys || [],
			obj;

		if (_isArray(json)) {
			_compressArray(json, aKeys);
			obj = json;
		}
		else {
			obj = _compressOther(json, aKeys);
		}
		return obj;
	};

	JSONC.pack = function (json, bCompress) {
		var str = JSON.stringify((bCompress ? JSONC.compress(json) : json));
		return Base64.encode(String.fromCharCode.apply(String, gzip.zip(str,{level:9})));
	};

	JSONC.decompress = function (json) {
		var str,
			jsonCopy = JSON.parse(JSON.stringify(json));
		if (_isArray(jsonCopy)) {
			_decompressArray(jsonCopy);
		}
		else {
			str = _decompressOther(jsonCopy);
		}
		return str ? JSON.parse(str) : jsonCopy;
	};
	function getArr(str) {
		var nIndex = 0,
			nLen = str.length,
			arr = [];
		for (; nIndex < nLen; nIndex++) {
			arr.push(str.charCodeAt(nIndex));
		}
		return arr;
	}

	JSONC.unpack = function (gzipped, bDecompress) {
		var aArr = getArr(Base64.decode(gzipped)),
			str = String.fromCharCode.apply(String, gzip.unzip(aArr,{level:9})),
			json = JSON.parse(str);
		return bDecompress ? JSONC.decompress(json) : json;
	};

	root.JSONC = JSONC;
	if (isNodeEnvironment) {
		module.exports = JSONC;
	}
	else if (typeof define !== 'undefined') {
		define('jsoncomp', [], function () {
			return JSONC;
		});
	}
}.call(this));



/*
JSON Diff
*/


!(function() {
	var BreakException = {};
	var isEmptyObject = function(obj) {
		var name;
		for(name in obj) {
			return false;
		}
		return true;
	};
	var cyclicCheck = [];
	var diff = function(obj1, obj2) {
		if(typeof obj1 === 'undefined')
			obj1 = {};
		if(typeof obj2 === 'undefined')
			obj2 = {};

		var val1, val2, mod = {}, add = {}, del = {}, ret;
		try {
			Object.keys(obj2).forEach(function(key) {

				val1 = obj1[key];
				val2 = obj2[key];
				if(typeof val1 === 'undefined') {
					add[key] = val2;
				} else if(typeof val1 != typeof val2) {
					mod[key] = val2;
				} else if(val1 !== val2) {
					if(typeof val2 === 'object') {
						if(cyclicCheck.indexOf(val2) >= 0)
							throw BreakException;
						ret = diff(val1, val2);
						if(!isEmptyObject(ret.mod))
							mod[key] = JSON.parse(JSON.stringify(ret.mod));
						if(!isEmptyObject(ret.add))
							add[key] = JSON.parse(JSON.stringify(ret.add));
						if(!isEmptyObject(ret.del))
							del[key] = JSON.parse(JSON.stringify(ret.del));
						cyclicCheck.push(val2);
					} else
						mod[key] = val2;
				}
			});
		} catch(e) {
			if(e !== BreakException) throw e;
		}

		Object.keys(obj1).forEach(function(key) {
			val1 = obj1[key];
			if(typeof obj2[key] === 'undefined')
				del[key] = true;
		});

		return {mod: mod, add: add, del: del};
	};

	JSON.diff = function(obj1, obj2) {
		cyclicCheck = [];
		return diff(obj1, obj2);
	};
})();

/*
JSONP
*/

(function(root) {
	var id            =(new Date()).getTime(),
		previousJSONP = root.JSONP,
		timers        = {};
	function paramify(data) {
		var query = '';
		for(var key in data) {
			if(data.hasOwnProperty(key)) {
				query += '&' + key + '=' + data[key];
			}
		}
		return query;
	}
	var JSONP = {
		VERSION: '1.0.0',
		__callbacks__: {},
		callbackName: 'callback',
		timeout: 0,
		get: function(url, data, callback, context) {
			if(typeof url      !== 'string' ) return;
			if(typeof callback !== 'function') context = callback;
			if(typeof data     === 'function') callback = data;
			if(typeof data     !== 'object' ) data = {};
			if(typeof callback !== 'function') callback = function() {};
			var
				head   = document.head || document.getElementsByTagName('head')[0] ||
								document.documentElement,
				script = document.createElement('script');
			id++;
			JSONP.__callbacks__[id] = function A() {
				clearTimeout(timers[id]);
				delete timers[id];
				delete JSONP.__callbacks__[id];
				callback.apply(context, arguments);
			};
			url +=(url.indexOf('?') === -1) ? '?' : '&';
			url += JSONP.callbackName + '=' +
						encodeURIComponent('JSONP.__callbacks__[' + id + ']');
			url += paramify(data);
			script.src = url;
			head.insertBefore(script, head.firstChild);
			if(JSONP.timeout > 0) {
				timers[id] = setTimeout(function B() {
					delete JSONP.__callbacks__[id];
					delete timers[id];
					if(head && script.parentNode) head.removeChild(script);
					script = null;
				}, JSONP.timeout);
			}
		},
		noConflict: function() {
			root.JSONP = previousJSONP;
			return this;
		}
	};
	if(typeof define === 'function' && define.amd) {
		define('JSONP', function Z() {
			return JSONP;
		});
	} else {
		root.JSONP = JSONP;
	}
}(this));

/*
JSON Path
*/

(function() {
	var FunctionSigil, JSONNavigator, JSONPath, JSONSigil, JSONSpace, MoreSigil, NullSigil, RefSigil, UndefinedSigil, fromJsonSpace, toJsonSpace;
	var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
		for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
		function ctor() { this.constructor = child; }
		ctor.prototype = parent.prototype;
		child.prototype = new ctor;
		child.__super__ = parent.prototype;
		return child;
	};
	String.prototype.smartSplit = function(separator) {
		var char, curIdx, inDoubleQuote, inQuote, inSingleQuote, parts, splitIdx, _i, _len;
		inSingleQuote = false;
		inDoubleQuote = false;
		inQuote = function() {
			return inSingleQuote || inDoubleQuote;
		};
		parts = [];
		splitIdx = 0;
		curIdx = 0;
		for (_i = 0, _len = this.length; _i < _len; _i++) {
			char = this[_i];
			if (char === '"' && !inSingleQuote) {
				inDoubleQuote = !inDoubleQuote;
			}
			if (char === '\'' && !inDoubleQuote) {
				inSingleQuote = !inSingleQuote;
			}
			if (char === separator && !inQuote()) {
				parts.push(this.substr(splitIdx, curIdx - splitIdx));
				splitIdx = curIdx;
				splitIdx++;
			}
			curIdx++;
		}
		if (splitIdx < curIdx) {
			parts.push(this.substr(splitIdx, curIdx - splitIdx));
		}
		return parts;
	};
	JSONPath = (function() {
		JSONPath.className = "JSONPath";
		JSONPath.fromString = function(string) {
			var arg, args, path, _i, _len;
			path = new JSONPath;
			if (!(string != null)) {
				return path;
			}
			string = string.replace("(", "");
			string = string.replace(")", "");
			args = string.smartSplit(',');
			for (_i = 0, _len = args.length; _i < _len; _i++) {
				arg = args[_i];
				path.pathComponents.push(arg);
			}
			return path;
		};
		function JSONPath() {
			var pathComponent, pathComponents, _i, _len;
			pathComponents = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
			this.pathComponents = [];
			for (_i = 0, _len = pathComponents.length; _i < _len; _i++) {
				pathComponent = pathComponents[_i];
				this.pathComponents.push(pathComponent);
			}
		}
		JSONPath.prototype.length = function() {
			return this.pathComponents.length;
		};
		JSONPath.prototype.leadingComponent = function() {
			return this.pathComponents[0];
		};
		JSONPath.prototype.lastComponent = function() {
			return this.pathComponents[this.pathComponents.length - 1];
		};
		JSONPath.prototype.pathByRemovingComponent = function() {
			var first;
			first = this.pathComponents.slice(0, this.pathComponents.length - 1);
			return (function(func, args, ctor) {
				ctor.prototype = func.prototype;
				var child = new ctor, result = func.apply(child, args);
				return typeof result === "object" ? result : child;
			})(JSONPath, first, function() {});
		};
		JSONPath.prototype.pathByAppendingComponent = function(component) {
			return (function(func, args, ctor) {
				ctor.prototype = func.prototype;
				var child = new ctor, result = func.apply(child, args);
				return typeof result === "object" ? result : child;
			})(JSONPath, __slice.call(this.pathComponents).concat([component]), function() {});
		};
		JSONPath.prototype.pathWithoutLeadingComponent = function() {
			var rest;
			rest = this.pathComponents.slice(1);
			return (function(func, args, ctor) {
				ctor.prototype = func.prototype;
				var child = new ctor, result = func.apply(child, args);
				return typeof result === "object" ? result : child;
			})(JSONPath, rest, function() {});
		};
		JSONPath.prototype.toString = function() {
			var component;
			return "(" + ((function() {
				var _i, _len, _ref, _results;
				_ref = this.pathComponents;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					component = _ref[_i];
					_results.push(component);
				}
				return _results;
			}).call(this)) + ")";
		};
		JSONPath.prototype.toJSON = function() {
			return toString();
		};
		return JSONPath;
	})();
	JSONNavigator = (function() {
		JSONNavigator.className = "JSONNavigator";
		function JSONNavigator(root) {
			this.root = root != null ? root : null;
		}
		JSONNavigator.prototype.objectAtPath = function(path) {
			var child, childNav, restOfPath, thisComponent;
			thisComponent = path.leadingComponent();
			restOfPath = path.pathWithoutLeadingComponent();
			if (!(thisComponent != null) && restOfPath.length > 0) {
				return;
			}
			if (!(thisComponent != null)) {
				return this.root;
			}
			child = this.root[thisComponent];
			if (!(child != null)) {
				return;
			}
			childNav = new JSONNavigator(child);
			return childNav.objectAtPath(restOfPath);
		};
		return JSONNavigator;
	})();
	JSONSpace = (function() {
		JSONSpace.className = "JSONSpace";
		function JSONSpace(parent, prev, next) {
			this.parent = parent != null ? parent : null;
			this.prev = prev != null ? prev : null;
			this.next = next != null ? next : null;
			this.children = null;
			this.value = void 0;
		}
		JSONSpace.prototype.addChild = function(child, key) {
			var brother;
			if (key == null) {
				key = null;
			}
			if (!(this.children != null) && !(key != null)) {
				this.children = [];
			} else if (!this.children && (key != null)) {
				this.children = {};
			}
			child.parent = this;
			child.next = null;
			child.prev = null;
			if (this.children.length > 0) {
				brother = this.children[this.children.length - 1];
				child.prev = brother;
				brother.next = child;
			}
			if (key != null) {
				return this.children[key] = child;
			} else {
				return this.children.push(child);
			}
		};
		JSONSpace.prototype.toJSON = function() {
			var child, hash, key, value, _i, _len, _ref, _ref2, _results;
			if (!this.children) {
				if (this.value.toJSON != null) {
					return this.value.toJSON();
				} else {
					return this.value;
				}
			} else if (this.children instanceof Array) {
				_ref = this.children;
				_results = [];
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					child = _ref[_i];
					_results.push(child);
				}
				return _results;
			} else if (typeof this.children === 'object') {
				hash = {};
				_ref2 = this.children;
				for (key in _ref2) {
					value = _ref2[key];
					hash[key] = value;
				}
				return hash;
			}
		};
		return JSONSpace;
	})();
	JSONSigil = (function() {
		JSONSigil.className = "JSONSigil";
		JSONSigil.prefix = "__@JSON_";
		JSONSigil.factory = {};
		JSONSigil.sigilFromName = function(name) {
			var argPos, args, cls, sigil;
			args = "";
			argPos = name.indexOf("(");
			if (argPos !== -1) {
				args = name.substr(argPos + 1, name.length - argPos - 2);
			}
			if (argPos !== -1) {
				name = name.substr(0, argPos);
			}
			cls = this.factory[name];
			if (cls != null) {
				sigil = new cls();
				if (args !== "") {
					sigil.parseArgs(args.smartSplit(','));
				}
				return sigil;
			} else {
				return null;
			}
		};
		function JSONSigil(name) {
			this.name = name != null ? name : "";
			JSONSigil.factory[this.name] = this.constructor;
		}
		JSONSigil.prototype.parseArgs = function(args) {};
		JSONSigil.prototype.value = function() {};
		JSONSigil.prototype.toString = function() {
			return "" + JSONSigil.prefix + this.name;
		};
		JSONSigil.prototype.toJSON = function() {
			return this.toString();
		};
		return JSONSigil;
	})();
	NullSigil = (function() {
		__extends(NullSigil, JSONSigil);
		NullSigil.className = "NullSigil";
		function NullSigil() {
			NullSigil.__super__.constructor.call(this, "null");
		}
		NullSigil.prototype.value = function() {
			return null;
		};
		return NullSigil;
	})();
	UndefinedSigil = (function() {
		__extends(UndefinedSigil, JSONSigil);
		UndefinedSigil.className = "UndefinedSigil";
		function UndefinedSigil() {
			UndefinedSigil.__super__.constructor.call(this, "undefined");
		}
		UndefinedSigil.prototype.value = function() {
			return;
		};
		return UndefinedSigil;
	})();
	MoreSigil = (function() {
		__extends(MoreSigil, JSONSigil);
		MoreSigil.className = "MoreSigil";
		function MoreSigil(count) {
			this.count = count != null ? count : null;
			MoreSigil.__super__.constructor.call(this, "more");
		}
		MoreSigil.prototype.parseArgs = function(args) {
			if (!(args != null) || (args != null ? args.length : void 0) === 0) {
				return this.count = 0;
			} else {
				return this.count = parseInt(args[0]);
			}
		};
		MoreSigil.prototype.toString = function() {
			if (this.count != null) {
				return "" + MoreSigil.__super__.toString.apply(this, arguments) + "(" + this.count + ")";
			} else {
				return MoreSigil.__super__.toString.apply(this, arguments);
			}
		};
		return MoreSigil;
	})();
	RefSigil = (function() {
		__extends(RefSigil, JSONSigil);
		RefSigil.className = "RefSigil";
		RefSigil.isRefSigil = function(name) {
			return name.lastIndexOf("" + JSONSigil.prefix + "ref", 0) === 0;
		};
		function RefSigil(path) {
			this.path = path != null ? path : new JSONPath;
			RefSigil.__super__.constructor.call(this, "ref");
		}
		RefSigil.prototype.parseArgs = function(args) {
			var components, pathComponent;
			if (!(args != null) || (args != null ? args.length : void 0) === 0) {
				return this.path = new JSONPath;
			} else {
				components = (function() {
					var _i, _len, _results;
					_results = [];
					for (_i = 0, _len = args.length; _i < _len; _i++) {
						pathComponent = args[_i];
						_results.push(pathComponent);
					}
					return _results;
				})();
				return this.path = (function(func, args, ctor) {
					ctor.prototype = func.prototype;
					var child = new ctor, result = func.apply(child, args);
					return typeof result === "object" ? result : child;
				})(JSONPath, components, function() {});
			}
		};
		RefSigil.prototype.value = function(root) {
			var nav;
			if (!(root != null)) {
				return;
			}
			nav = new JSONNavigator(root);
			return nav.objectAtPath(this.path);
		};
		RefSigil.prototype.toString = function() {
			return "" + RefSigil.__super__.toString.apply(this, arguments) + (this.path.toString());
		};
		return RefSigil;
	})();
	FunctionSigil = (function() {
		__extends(FunctionSigil, JSONSigil);
		FunctionSigil.className = "FunctionSigil";
		function FunctionSigil() {
			FunctionSigil.__super__.constructor.call(this, "function");
		}
		FunctionSigil.prototype.value = function() {
			return function() {};
		};
		return FunctionSigil;
	})();
	toJsonSpace = function(object, parentSpace, path, depthLimit, sigils) {
		var child, count, i, key, objectPath, space, subspace, testObject, value, _i, _j, _k, _len, _len2, _len3;
		space = new JSONSpace(parentSpace);
		if (object instanceof JSONSpace) {
			throw "object is already a JSONSpace";
		} else if ((depthLimit != null) && path.length() > depthLimit) {
			if (!sigils) {
				return null;
			}
			space.value = new MoreSigil;
		} else if (object === void 0) {
			if (!sigils) {
				return null;
			}
			space.value = new UndefinedSigil;
		} else if (object === null) {
			if (!sigils) {
				return null;
			}
			space.value = new NullSigil;
		} else if (typeof object === 'function') {
			if (!sigils) {
				return null;
			}
			space.value = new FunctionSigil;
		}
		if (typeof objectCache === "undefined" || objectCache === null) {
			objectCache = [];
		}
		objectPath = null;
		for (_i = 0, _len = objectCache.length; _i < _len; _i++) {
			testObject = objectCache[_i];
			if (sigils) {
				if (testObject.ref === object) {
					objectPath = testObject.path;
					break;
				}
			}
		}
		if ((objectPath != null) && sigils) {
			space.value = new RefSigil(objectPath);
		}
		if (space.value != null) {
			if (sigils) {
				return space;
			}
			return null;
		}
		switch (typeof object) {
			case 'string':
				space.value = "" + object;
				break;
			case 'number':
				space.value = object;
				break;
			case 'boolean':
				space.value = object;
				break;
			case 'object':
				space.value = object;
				if (object instanceof Array) {
					if ((depthLimit != null) && path.length() + 1 > depthLimit) {
						if (!sigils) {
							return null;
						}
						count = 0;
						for (_j = 0, _len2 = object.length; _j < _len2; _j++) {
							value = object[_j];
							count++;
						}
						space.value = new MoreSigil(count);
					} else {
						objectCache.push({
							ref: object,
							path: path
						});
						space.children = [];
						i = 0;
						for (_k = 0, _len3 = object.length; _k < _len3; _k++) {
							child = object[_k];
							subspace = toJsonSpace(child, space, path.pathByAppendingComponent(i), depthLimit, sigils);
							if (subspace != null) {
								space.addChild(subspace);
							}
							i++;
						}
					}
				} else {
					if ((depthLimit != null) && path.length() + 1 > depthLimit) {
						if (!sigils) {
							return null;
						}
						count = 0;
						for (value in object) {
							count++;
						}
						space.value = new MoreSigil(count);
					} else {
						if (sigils) {
							objectCache.push({
								ref: object,
								path: path
							});
						}
						space.children = {};
						for (key in object) {
							value = object[key];
							subspace = toJsonSpace(value, space, path.pathByAppendingComponent(key), depthLimit, sigils);
							if (subspace != null) {
								space.addChild(subspace, key);
							}
						}
					}
				}
				break;
			default:
				throw "Don't know how to turn object of type " + (typeof object) + " into a JSONSpace";
		}
		return space;
	};
	fromJsonSpace = function(space, references, path) {
		var arr, child, i, key, obj, ret, sigil, value, _len, _ref, _ref2;
		if (references == null) {
			references = {};
		}
		if (path == null) {
			path = new JSONPath;
		}
		ret = void 0;
		if ((space.children != null) && space.children instanceof Array) {
			arr = [];
			_ref = space.children;
			for (i = 0, _len = _ref.length; i < _len; i++) {
				child = _ref[i];
				arr.push(fromJsonSpace(child, references, path.pathByAppendingComponent(i)));
			}
			ret = arr;
		} else if (space.children != null) {
			obj = {};
			_ref2 = space.children;
			for (key in _ref2) {
				value = _ref2[key];
				obj[key] = fromJsonSpace(value, references, path.pathByAppendingComponent(key));
			}
			ret = obj;
		} else {
			if (typeof space.value === 'string' && space.value.lastIndexOf(JSONSigil.prefix, 0) === 0) {
				sigil = JSONSigil.sigilFromName(space.value.substr(JSONSigil.prefix.length));
				if (!(sigil != null)) {
					ret = space.value;
				} else if (RefSigil.isRefSigil(space.value)) {
					references[path] = sigil;
					ret = void 0;
				} else {
					ret = sigil.value();
				}
			} else {
				ret = space.value;
			}
		}
		return ret;
	};
	exports.VERSION = '0.2.1';
	exports.selectObject = function(root, jpath) {
		var component, components, jsonPath;
		if (!(jpath != null) || jpath.trim() === "") {
			return;
		}
		if (!(root != null)) {
			return;
		}
		components = jpath.split('/');
		jsonPath = (function(func, args, ctor) {
			ctor.prototype = func.prototype;
			var child = new ctor, result = func.apply(child, args);
			return typeof result === "object" ? result : child;
		})(JSONPath, (function() {
			var _i, _len, _results;
			_results = [];
			for (_i = 0, _len = components.length; _i < _len; _i++) {
				component = components[_i];
				if (component !== '') {
					_results.push(component);
				}
			}
			return _results;
		})(), function() {});
		return new JSONNavigator(root).objectAtPath(jsonPath);
	};
	exports.stringify = function(object, depth, replacer) {
		if (depth == null) {
			depth = null;
		}
		if (replacer == null) {
			replacer = null;
		}
		if (!(depth != null)) {
			return JSON.stringify(object, replacer);
		} else {
			return JSON.stringify(toJsonSpace(object, null, new JSONPath, depth, false), replacer);
		}
	};
	exports.serialize = function(object, depth, replacer) {
		if (depth == null) {
			depth = null;
		}
		if (replacer == null) {
			replacer = null;
		}
		return JSON.stringify(toJsonSpace(object, null, new JSONPath, depth, true), replacer);
	};
	exports.parse = function(json, reviver) {
		if (reviver == null) {
			reviver = null;
		}
		return JSON.parse(json, reviver);
	};
	exports.deserialize = function(json, reviver) {
		var graph, jsonSpace, nav, obj, parent, path, pathString, references, sigil;
		if (reviver == null) {
			reviver = null;
		}
		graph = JSON.parse(json, reviver);
		jsonSpace = toJsonSpace(graph, null, new JSONPath);
		references = {};
		obj = fromJsonSpace(jsonSpace, references);
		nav = new JSONNavigator(obj);
		for (pathString in references) {
			sigil = references[pathString];
			path = JSONPath.fromString(pathString);
			parent = nav.objectAtPath(path.pathByRemovingComponent());
			parent[path.lastComponent()] = sigil.value(obj);
		}
		return obj;
	};
}).call(this);

/*
JSON Select
*/


(function(exports) {

	var
	toString = Object.prototype.toString;

	function jsonParse(str) {
		try {
			if(JSON && JSON.parse){
				return JSON.parse(str);
			}
			return (new Function("return " + str))();
		}
		catch(e) {
			te("ijs", e.message);
		}
	}
	var errorCodes = {
		"bop":  "binary operator expected",
		"ee":   "expression expected",
		"epex": "closing paren expected ')'",
		"ijs":  "invalid json string",
		"mcp":  "missing closing paren",
		"mepf": "malformed expression in pseudo-function",
		"mexp": "multiple expressions not allowed",
		"mpc":  "multiple pseudo classes (:xxx) not allowed",
		"nmi":  "multiple ids not allowed",
		"pex":  "opening paren expected '('",
		"se":   "selector expected",
		"sex":  "string expected",
		"sra":  "string required after '.'",
		"uc":   "unrecognized char",
		"ucp":  "unexpected closing paren",
		"ujs":  "unclosed json string",
		"upc":  "unrecognized pseudo class"
	};
	function te(ec, context) {
		throw new Error(errorCodes[ec] + ( context && " in '" + context + "'"));
	}
	var toks = {
		psc: 1,
		psf: 2,
		typ: 3,
		str: 4,
		ide: 5
	};
	var pat = new RegExp(
		"^(?:" +
		"([\\r\\n\\t\\ ]+)|" +
		"([~*,>\\)\\(])|" +
		"(string|boolean|null|array|object|number)|" +
		"(:(?:root|first-child|last-child|only-child))|" +
		"(:(?:nth-child|nth-last-child|has|expr|val|contains))|" +
		"(:\\w+)|" +
		"(?:(\\.)?(\\\"(?:[^\\\\\\\"]|\\\\[^\\\"])*\\\"))|" +
		"(\\\")|" +
		"\\.((?:[_a-zA-Z]|[^\\0-\\0177]|\\\\[^\\r\\n\\f0-9a-fA-F])(?:[\\$_a-zA-Z0-9\\-]|[^\\u0000-\\u0177]|(?:\\\\[^\\r\\n\\f0-9a-fA-F]))*)" +
		")"
	);
	var nthPat = /^\s*\(\s*(?:([+\-]?)([0-9]*)n\s*(?:([+\-])\s*([0-9]))?|(odd|even)|([+\-]?[0-9]+))\s*\)/;
	function lex(str, off) {
		if (!off) off = 0;
		var m = pat.exec(str.substr(off));
		if (!m) return undefined;
		off+=m[0].length;
		var a;
		if (m[1]) a = [off, " "];
		else if (m[2]) a = [off, m[0]];
		else if (m[3]) a = [off, toks.typ, m[0]];
		else if (m[4]) a = [off, toks.psc, m[0]];
		else if (m[5]) a = [off, toks.psf, m[0]];
		else if (m[6]) te("upc", str);
		else if (m[8]) a = [off, m[7] ? toks.ide : toks.str, jsonParse(m[8])];
		else if (m[9]) te("ujs", str);
		else if (m[10]) a = [off, toks.ide, m[10].replace(/\\([^\r\n\f0-9a-fA-F])/g,"$1")];
		return a;
	}

	var exprPat = new RegExp(
		"^\\s*(?:" +
		"(true|false|null)|" +
		"(-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?)|" +
		"(\"(?:[^\\]|\\[^\"])*\")|" +
		"(x)|" +
		"(&&|\\|\\||[\\$\\^<>!\\*]=|[=+\\-*/%<>])|" +
		"([\\(\\)])" +
		")"
	);

	function is(o, t) { return typeof o === t; }
	var operators = {
		'*':  [ 9, function(lhs, rhs) { return lhs * rhs; } ],
		'/':  [ 9, function(lhs, rhs) { return lhs / rhs; } ],
		'%':  [ 9, function(lhs, rhs) { return lhs % rhs; } ],
		'+':  [ 7, function(lhs, rhs) { return lhs + rhs; } ],
		'-':  [ 7, function(lhs, rhs) { return lhs - rhs; } ],
		'<=': [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs <= rhs || is(lhs, 'string') && is(rhs, 'string') && lhs <= rhs; } ],
		'>=': [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs >= rhs || is(lhs, 'string') && is(rhs, 'string') && lhs >= rhs; } ],
		'$=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.lastIndexOf(rhs) === lhs.length - rhs.length; } ],
		'^=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.indexOf(rhs) === 0; } ],
		'*=': [ 5, function(lhs, rhs) { return is(lhs, 'string') && is(rhs, 'string') && lhs.indexOf(rhs) !== -1; } ],
		'>':  [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs > rhs || is(lhs, 'string') && is(rhs, 'string') && lhs > rhs; } ],
		'<':  [ 5, function(lhs, rhs) { return is(lhs, 'number') && is(rhs, 'number') && lhs < rhs || is(lhs, 'string') && is(rhs, 'string') && lhs < rhs; } ],
		'=':  [ 3, function(lhs, rhs) { return lhs === rhs; } ],
		'!=': [ 3, function(lhs, rhs) { return lhs !== rhs; } ],
		'&&': [ 2, function(lhs, rhs) { return lhs && rhs; } ],
		'||': [ 1, function(lhs, rhs) { return lhs || rhs; } ]
	};

	function exprLex(str, off) {
		var v, m = exprPat.exec(str.substr(off));
		if (m) {
			off += m[0].length;
			v = m[1] || m[2] || m[3] || m[5] || m[6];
			if (m[1] || m[2] || m[3]) return [off, 0, jsonParse(v)];
			else if (m[4]) return [off, 0, undefined];
			return [off, v];
		}
	}

	function exprParse2(str, off) {
		if (!off) off = 0;
		var l = exprLex(str, off),
			lhs;
		if (l && l[1] === '(') {
			lhs = exprParse2(str, l[0]);
			var p = exprLex(str, lhs[0]);
			if (!p || p[1] !== ')') te('epex', str);
			off = p[0];
			lhs = [ '(', lhs[1] ];
		} else if (!l || (l[1] && l[1] != 'x')) {
			te("ee", str + " - " + ( l[1] && l[1] ));
		} else {
			lhs = ((l[1] === 'x') ? undefined : l[2]);
			off = l[0];
		}
		var op = exprLex(str, off);
		if (!op || op[1] == ')') return [off, lhs];
		else if (op[1] == 'x' || !op[1]) {
			te('bop', str + " - " + ( op[1] && op[1] ));
		}
		var rhs = exprParse2(str, op[0]);
		off = rhs[0];
		rhs = rhs[1];
		var v;
		if (typeof rhs !== 'object' || rhs[0] === '(' || operators[op[1]][0] < operators[rhs[1]][0] ) {
			v = [lhs, op[1], rhs];
		}
		else {
			v = rhs;
			while (typeof rhs[0] === 'object' && rhs[0][0] != '(' && operators[op[1]][0] >= operators[rhs[0][1]][0]) {
				rhs = rhs[0];
			}
			rhs[0] = [lhs, op[1], rhs[0]];
		}
		return [off, v];
	}

	function exprParse(str, off) {
		function deparen(v) {
			if (typeof v !== 'object' || v === null) return v;
			else if (v[0] === '(') return deparen(v[1]);
			else return [deparen(v[0]), v[1], deparen(v[2])];
		}
		var e = exprParse2(str, off ? off : 0);
		return [e[0], deparen(e[1])];
	}

	function exprEval(expr, x) {
		if (expr === undefined) return x;
		else if (expr === null || typeof expr !== 'object') {
			return expr;
		}
		var lhs = exprEval(expr[0], x),
			rhs = exprEval(expr[2], x);
		return operators[expr[1]][1](lhs, rhs);
	}

	function parse(str, off, nested, hints) {
		if (!nested) hints = {};

		var a = [], am, readParen;
		if (!off) off = 0;

		while (true) {
			var s = parse_selector(str, off, hints);
			a.push(s[1]);
			s = lex(str, off = s[0]);
			if (s && s[1] === " ") s = lex(str, off = s[0]);
			if (!s) break;
			if (s[1] === ">" || s[1] === "~") {
				if (s[1] === "~") hints.usesSiblingOp = true;
				a.push(s[1]);
				off = s[0];
			} else if (s[1] === ",") {
				if (am === undefined) am = [ ",", a ];
				else am.push(a);
				a = [];
				off = s[0];
			} else if (s[1] === ")") {
				if (!nested) te("ucp", s[1]);
				readParen = 1;
				off = s[0];
				break;
			}
		}
		if (nested && !readParen) te("mcp", str);
		if (am) am.push(a);
		var rv;
		if (!nested && hints.usesSiblingOp) {
			rv = normalize(am ? am : a);
		} else {
			rv = am ? am : a;
		}
		return [off, rv];
	}

	function normalizeOne(sel) {
		var sels = [], s;
		for (var i = 0; i < sel.length; i++) {
			if (sel[i] === '~') {
				if (i < 2 || sel[i-2] != '>') {
					s = sel.slice(0,i-1);
					s = s.concat([{has:[[{pc: ":root"}, ">", sel[i-1]]]}, ">"]);
					s = s.concat(sel.slice(i+1));
					sels.push(s);
				}
				if (i > 1) {
					var at = sel[i-2] === '>' ? i-3 : i-2;
					s = sel.slice(0,at);
					var z = {};
					for (var k in sel[at]) if (sel[at].hasOwnProperty(k)) z[k] = sel[at][k];
					if (!z.has) z.has = [];
					z.has.push([{pc: ":root"}, ">", sel[i-1]]);
					s = s.concat(z, '>', sel.slice(i+1));
					sels.push(s);
				}
				break;
			}
		}
		if (i == sel.length) return sel;
		return sels.length > 1 ? [','].concat(sels) : sels[0];
	}

	function normalize(sels) {
		if (sels[0] === ',') {
			var r = [","];
			for (var i = i; i < sels.length; i++) {
				var s = normalizeOne(s[i]);
				r = r.concat(s[0] === "," ? s.slice(1) : s);
			}
			return r;
		} else {
			return normalizeOne(sels);
		}
	}

	function parse_selector(str, off, hints) {
		var soff = off;
		var s = { };
		var l = lex(str, off);
		if (l && l[1] === " ") { soff = off = l[0]; l = lex(str, off); }
		if (l && l[1] === toks.typ) {
			s.type = l[2];
			l = lex(str, (off = l[0]));
		} else if (l && l[1] === "*") {
			l = lex(str, (off = l[0]));
		}
		while (true) {
			if (l === undefined) {
				break;
			} else if (l[1] === toks.ide) {
				if (s.id) te("nmi", l[1]);
				s.id = l[2];
			} else if (l[1] === toks.psc) {
				if (s.pc || s.pf) te("mpc", l[1]);
				if (l[2] === ":first-child") {
					s.pf = ":nth-child";
					s.a = 0;
					s.b = 1;
				} else if (l[2] === ":last-child") {
					s.pf = ":nth-last-child";
					s.a = 0;
					s.b = 1;
				} else {
					s.pc = l[2];
				}
			} else if (l[1] === toks.psf) {
				if (l[2] === ":val" || l[2] === ":contains") {
					s.expr = [ undefined, l[2] === ":val" ? "=" : "*=", undefined];
					l = lex(str, (off = l[0]));
					if (l && l[1] === " ") l = lex(str, off = l[0]);
					if (!l || l[1] !== "(") te("pex", str);
					l = lex(str, (off = l[0]));
					if (l && l[1] === " ") l = lex(str, off = l[0]);
					if (!l || l[1] !== toks.str) te("sex", str);
					s.expr[2] = l[2];
					l = lex(str, (off = l[0]));
					if (l && l[1] === " ") l = lex(str, off = l[0]);
					if (!l || l[1] !== ")") te("epex", str);
				} else if (l[2] === ":has") {
					l = lex(str, (off = l[0]));
					if (l && l[1] === " ") l = lex(str, off = l[0]);
					if (!l || l[1] !== "(") te("pex", str);
					var h = parse(str, l[0], true);
					l[0] = h[0];
					if (!s.has) s.has = [];
					s.has.push(h[1]);
				} else if (l[2] === ":expr") {
					if (s.expr) te("mexp", str);
					var e = exprParse(str, l[0]);
					l[0] = e[0];
					s.expr = e[1];
				} else {
					if (s.pc || s.pf ) te("mpc", str);
					s.pf = l[2];
					var m = nthPat.exec(str.substr(l[0]));
					if (!m) te("mepf", str);
					if (m[5]) {
						s.a = 2;
						s.b = (m[5] === "odd") ? 1 : 0;
					} else if (m[6]) {
						s.a = 0;
						s.b = parseInt(m[6], 10);
					} else {
						s.a = parseInt((m[1] ? m[1] : "+") + (m[2] ? m[2] : "1"),10);
						s.b = m[3] ? parseInt(m[3] + m[4],10) : 0;
					}
					l[0] += m[0].length;
				}
			} else {
				break;
			}
			l = lex(str, (off = l[0]));
		}
		if (soff === off) te("se", str);

		return [off, s];
	}

	function isArray(o) {
		return Array.isArray ? Array.isArray(o) :
			toString.call(o) === "[object Array]";
	}

	function mytypeof(o) {
		if (o === null) return "null";
		var to = typeof o;
		if (to === "object" && isArray(o)) to = "array";
		return to;
	}

	function mn(node, sel, id, num, tot) {
		var sels = [];
		var cs = (sel[0] === ">") ? sel[1] : sel[0];
		var m = true, mod;
		if (cs.type) m = m && (cs.type === mytypeof(node));
		if (cs.id)   m = m && (cs.id === id);
		if (m && cs.pf) {
			if (cs.pf === ":nth-last-child") num = tot - num;
			else num++;
			if (cs.a === 0) {
				m = cs.b === num;
			} else {
				mod = ((num - cs.b) % cs.a);

				m = (!mod && ((num*cs.a + cs.b) >= 0));
			}
		}
		if (m && cs.has) {
			var bail = function() { throw 42; };
			for (var i = 0; i < cs.has.length; i++) {
				try {
					forEach(cs.has[i], node, bail);
				} catch (e) {
					if (e === 42) continue;
				}
				m = false;
				break;
			}
		}
		if (m && cs.expr) {
			m = exprEval(cs.expr, node);
		}
		if (sel[0] !== ">" && sel[0].pc !== ":root") sels.push(sel);

		if (m) {
			if (sel[0] === ">") { if (sel.length > 2) { m = false; sels.push(sel.slice(2)); } }
			else if (sel.length > 1) { m = false; sels.push(sel.slice(1)); }
		}

		return [m, sels];
	}

	function forEach(sel, obj, fun, id, num, tot) {
		var a = (sel[0] === ",") ? sel.slice(1) : [sel],
		a0 = [],
		call = false,
		i = 0, j = 0, k, x;
		for (i = 0; i < a.length; i++) {
			x = mn(obj, a[i], id, num, tot);
			if (x[0]) {
				call = true;
			}
			for (j = 0; j < x[1].length; j++) {
				a0.push(x[1][j]);
			}
		}
		if (a0.length && typeof obj === "object") {
			if (a0.length >= 1) {
				a0.unshift(",");
			}
			if (isArray(obj)) {
				for (i = 0; i < obj.length; i++) {
					forEach(a0, obj[i], fun, undefined, i, obj.length);
				}
			} else {
				for (k in obj) {
					if (obj.hasOwnProperty(k)) {
						forEach(a0, obj[k], fun, k);
					}
				}
			}
		}
		if (call && fun) {
			fun(obj);
		}
	}

	function match(sel, obj) {
		var a = [];
		forEach(sel, obj, function(x) {
			a.push(x);
		});
		return a;
	}

	function format(sel, arr) {
		sel = sel.replace(/\?/g, function() {
			if (arr.length === 0) throw "too few parameters given";
			var p = arr.shift();
			return ((typeof p === 'string') ? JSON.stringify(p) : p);
		});
		if (arr.length) throw "too many parameters supplied";
		return sel;
	}

	function compile(sel, arr) {
		if (arr) sel = format(sel, arr);
		return {
			sel: parse(sel)[1],
			match: function(obj){
				return match(this.sel, obj);
			},
			forEach: function(obj, fun) {
				return forEach(this.sel, obj, fun);
			}
		};
	}

	exports._lex = lex;
	exports._parse = parse;
	exports.match = function (sel, arr, obj) {
		if (!obj) { obj = arr; arr = undefined; }
		return compile(sel, arr).match(obj);
	};
	exports.forEach = function(sel, arr, obj, fun) {
		if (!fun) { fun = obj;  obj = arr; arr = undefined; }
		return compile(sel, arr).forEach(obj, fun);
	};
	exports.compile = compile;
})(typeof exports === "undefined" ? (window.JSONSelect = {}) : exports);

/*
JSONX
*/

var JSONX = JSONX || {};
(function (window, undefined) {
	var
		document = window.document,
		rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
		rclickable = /^a(?:rea)?$/i,
		rfocusable = /^(?:button|input|object|select|textarea)$/i,
		rinvalidChar = /\:|^on/,
		rtype = /^(?:button|input)$/i,
		boolHook,
		formHook,
		helper = {
			attr: function (ele, notXml, name, value) {
				var hooks, ret;
				if (!('getAttribute' in ele)) {
					return helper.prop(ele, notXml, name, value);
				}
				name = notXml && helper.attrFix[name] || name;
				hooks = helper.attrHooks[name];
				if (!hooks) {
					if (rboolean.test(name)) {
							hooks = boolHook;
					} else if (formHook && name !== 'className' &&
										(helper.nodeName(ele, 'form') ||
										rinvalidChar.test(name))) {
						hooks = formHook;
					}
				}
				if (value !== undefined) {
					if (value === null) {
						return undefined;
					} else if (hooks && 'set' in hooks && notXml &&
										(ret = hooks.set(ele, value, name)) !== undefined) {
						return ret;
					} else {
						ele.setAttribute(name, '' + value);
						return value;
					}
				} else if (hooks && 'get' in hooks && notXml &&
									(ret = hooks.get(ele, name)) !== null) {
					return ret;
				} else {
					ret = ele.getAttribute(name);
					return ret === null ? undefined : ret;
				}
			},
			attributes: function (ele, map) {
				var
					name,
					notXml = ele.nodeType !== 1 || !helper.isXml(ele);
				if (map === undefined) {
					map = {};
					if (ele.attributes.length > 0) {
						for (var i = 0; i < ele.attributes.length; i++) {
							name = ele.attributes[i].name;
							name = notXml && helper.propFix[name] || name;
							map[name] = helper.attr(ele, notXml, name);
						}
					}
					return map;
				} else {
					for (name in map) helper.attr(ele, notXml, name, map[name]);
				}
			},
			attrFix: {
				tabindex: 'tabIndex'
			},
			attrHooks: {
				tabIndex: {
					get: function (ele) {
						var
							attrNode = ele.getAttributeNode('tabIndex'),
							ret;
						if (attrNode && attrNode.specified) {
							ret = parseInt(attrNode.value, 10);
						} else if (rfocusable.test(ele.nodeName) ||
											rclickable.test(ele.nodeName) && ele.href) {
							ret = 0;
						}
						return ret;
					}
				},
				type: {
					set: function (ele, value) {
						var val;
						if (rtype.test(ele.nodeName) && ele.parentNode) {
							throw new Error('Can\'t change attribute: type');
						} else if (!helper.support.radioValue && value === 'radio' &&
											helper.nodeName(ele, 'input')) {
							val = ele.value;
							ele.setAttribute('type', value);
							if (val) ele.value = val;
							return value;
						}
					}
				},
				value: {
					get: function (ele, name) {
						if (formHook && helper.nodeName(ele, 'button')) {
							return formHook.get(ele, name);
						}
						return name in ele ? ele.value : null;
					},
					set: function (ele, value, name) {
						if (formHook && helper.nodeName(ele, 'button')) {
							return formHook.set(ele, value, name);
						}
						ele.value = value;
					}
				}
			},
			classToType: {},
			contents: function (ele) {
				if (helper.nodeName(ele, 'iframe')) {
					ele = ele.contentDocument || ele.contentWindow.document;
				}
				return helper.makeArray(ele.childNodes);
			},
			each: function (obj, callback, delimiter) {
				var name;
				if (delimiter === undefined) delimiter = ' ';
				switch (helper.type(obj)) {
				case 'string':
					obj = obj.split(delimiter);
				case 'array':
					for (name in obj) {
						if (callback.call(obj[name], name, obj[name]) === false) break;
					}
					break;
				case 'object':
					for (var i = 0; i < obj.length;) {
						if (callback.call(obj[i], i, obj[i++]) === false) break;
					}
				}
				return obj;
			},
			isArray: Array.isArray || function (obj) {
				return helper.type(obj) === 'array';
			},
			isEmptyObject: function (obj) {
				var name;
				for (name in obj) return false;
				return true;
			},
			isPlainObject: function (obj) {
				var key;
				if (!obj || helper.type(obj) !== 'object' || obj.nodeType ||
						helper.isWindow(obj)) {
					return false;
				}
				if (obj.constructor &&
					!Object.prototype.hasOwnProperty.call(obj, 'constructor') &&
					!Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
					return false;
				}
				for (key in obj) {}
				return key === undefined || Object.prototype.hasOwnProperty.call(obj, key);
			},
			isWindow: function (obj) {
				return obj && helper.type(obj) === 'object' && 'setInterval' in obj;
			},
			isXml: function (ele) {
				ele = (ele ? ele.ownerDocument || ele : 0).documentElement;
				return ele ? ele.nodeName.toLowerCase() !== 'html' : false;
			},
			makeArray: function (array) {
				var ret = [], type;
				if (array !== null) {
					type = helper.type(array);
					if (array.length === null || type === 'string' ||
							type === 'function' || type === 'regexp' ||
							helper.isWindow(array)) {
						Array.prototype.push.call(ret, array);
					} else {
						helper.merge(ret, array);
					}
				}
				return ret;
			},
			merge: function (first, second) {
				var
					i = first.length,
					j = 0,
					k;
				if (helper.type(second.length) === 'number') {
					for (k = second.length; j < k; j++) first[i++] = second[j];
				} else {
					while (second[j] !== undefined) first[i++] = second[j++];
				}
				first.length = i;
				return first;
			},
			nodeName: function (ele, name) {
				return ele.nodeName && ele.nodeName.toUpperCase() === name.toUpperCase();
			},
			prop: function (ele, notXml, name, value) {
				var hooks, ret;
				name = notXml && helper.propFix[name] || name;
				hooks = helper.propHooks[name];
				if (value !== undefined) {
					if (hooks && 'set' in hooks &&
						(ret = hooks.set(ele, value, name)) !== undefined) {
						return ret;
					} else {
						return (ele[name] = value);
					}
				} else {
					if (hooks && 'get' in hooks &&
						(ret = hooks.get(ele, name)) !== undefined) {
						return ret;
					} else {
						return ele[name];
					}
				}
			},
			propFix: {
				cellspacing     : 'cellSpacing',
				cellpadding     : 'cellPadding',
				'class'         : 'className',
				colspan         : 'colSpan',
				contenteditable : 'contentEditable',
				'for'           : 'htmlFor',
				frameborder     : 'frameBorder',
				maxlength       : 'maxLength',
				readonly        : 'readOnly',
				rowspan         : 'rowSpan',
				tabindex        : 'tabIndex',
				usemap          : 'useMap'
			},
			propHooks: {},
			support: (function () {
				var
					a,
					div = document.createElement('div'),
					input,
					opt,
					select;
				div.setAttribute('className', 't');
				div.innerHTML = '<a href="/a" style="top:1px;">a</a>';
				a = div.getElementsByTagName('a')[0];
				select = document.createElement('select');
				opt = select.appendChild(document.createElement('option'));
				var support = {
					hrefNormalized  : a.getAttribute('href') === '/a',
					getSetAttribute : div.className !== 't',
					optSelected     : opt.selected,
					style           : /top/.test(a.getAttribute('style'))
				};
				input = document.createElement('input');
				input.value = 't';
				input.setAttribute('type', 'radio');
				support.radioValue = input.value === 't';
				return support;
			}()),
			type: function (obj) {
				if (obj === null) return String(obj);
				return helper.classToType[Object.prototype.toString.call(obj)] || 'object';
			}
	};
	helper.each('Boolean Number String Function Array Date RegExp Object',
			function (i, name) {
					helper.classToType['[object ' + name + ']'] = name.toLowerCase();
			}
	);
	boolHook = {
		get: function (ele, name) {
			return helper.prop(ele, name) ? name.toLowerCase() : undefined;
		},
		set: function (ele, value, name) {
			var propName;
			if (value === true) {
				propName = helper.propFix[name] || name;
				if (propName in ele) ele[propName] = true;
				ele.setAttribute(name, name.toLowerCase());
			}
			return name;
		}
	};
	if (!helper.support.getSetAttribute) {
		helper.attrFix = helper.propFix;
		formHook = helper.attrHooks.name = helper.attrHooks.title = {
			get: function (ele, name) {
				var ret = ele.getAttributeNode(name);
				return ret && ret.nodeValue !== '' ? ret.nodeValue : undefined;
			},
			set: function (ele, value, name) {
				var ret = ele.getAttributeNode(name);
				if (ret) {
					ret.nodeValue = value;
					return value;
				}
			}
		};
		helper.each('width height', function (i, name) {
			helper.attrHooks[name] = helper.attrHooks[name] || {};
			helper.attrHooks[name].set = function (ele, value) {
				if (value === '') {
					ele.setAttribute(name, 'auto');
					return value;
				}
			};
		});
	}
	if (!helper.support.hrefNormalized) {
		helper.each('href src width height', function (i, name) {
			helper.attrHooks[name] = helper.attrHooks[name] || {};
			helper.attrHooks[name].get = function (ele) {
				var ret = ele.getAttribute(name, 2);
				return ret === null ? undefined : ret;
			};
		});
	}
	if (!helper.support.style) {
		helper.attrHooks.style = {
			get: function (ele) {
				return ele.style.cssText.toLowerCase() || undefined;
			},
			set: function (ele, value) {
				return (ele.style.cssText = '' + value);
			}
		};
	}
	if (!helper.support.optSelected) {
		helper.attrHooks.selected = helper.attrHooks.selected || {};
		helper.propHooks.selected.get = function (ele) {
			var parent = ele.parentNode;
			if (parent) {
				parent.selectedIndex;
				if (parent.parentNode) parent.parentNode.selectedIndex;
			}
		};
	}
	if (helper.type(JSONX.build) !== 'function') {
		JSONX.build = function (value) {
			if (helper.type(value) === 'undefined') return;
			function convertJsonx(obj, parent) {
				var array = [], ele = {};
				if (helper.isArray(obj)) {
					if (!obj.length || helper.type(obj[0]) !== 'string') {
						throw new SyntaxError('JSONX.build');
					}
					ele = document.createElement(obj[0]);
					if (obj.length > 1) {
						if (helper.isPlainObject(obj[1])) {
							helper.attributes(ele, obj[1]);
							if (obj.length > 2) array = Array.prototype.slice.call(obj, 2);
						} else {
							array = Array.prototype.slice.call(obj, 1);
						}
						if (array.length) convertJsonx(array, ele);
					}
				} else if (helper.type(obj) === 'string') {
					parent.appendChild(obj);
				}
				return parent;
			}
			if (helper.type(value) === 'string') value = JSONX.parse(value);
			if (!helper.isArray(value)) throw new TypeError('JSONX.build');
			return helper.contents(convertJsonx(value, document.createElement('x')));
		};
	}
	if (helper.type(JSONX.parse) !== 'function') {
		JSONX.parse = function (value) {
			if (helper.type(value) === 'undefined') return;
			function convertNodes(array) {
				var attrs, contents, obj, ret = [];
				for (var i = 0; i < array.length; i++) {
						var j;
						obj = array[i];
						contents = helper.contents(obj);
						Array.prototype.push.call(ret, obj.nodeName.toLowerCase());
						attrs = helper.attributes(obj);
						if (!helper.isEmptyObject(attrs)) {
							Array.prototype.push.call(ret, attrs);
						}
						if (contents.length) {
							for (j = 0; j < contents.length; j++) {
								if (contents[j].nodeType === 3) {
									Array.prototype.push.call(ret, contents[j].textContent);
								} else {
									Array.prototype.push.call(ret, convertNodes([contents[j]]));
								}
							}
						}
				}
				return ret;
			}
			switch (helper.type(value)) {
			case 'string':
				return JSON.parse(value);
			case 'array':
				return convertNodes(value);
			case 'object':
				if (helper.type(value.nodeType) === 'number') {
					return convertNodes([value]);
				}
				if (helper.type(value.length) === 'number') {
					return convertNodes(helper.makeArray(value));
				}
			}
			throw new TypeError('JSONX.parse');
		};
	}
	if (helper.type(JSONX.stringify) !== 'function') {
		JSONX.stringify = function (value) {
			var type = helper.type(value);
			if (type === 'undefined') return;
			if ((type === 'array' && value.length > 0 && value[0].nodeType) ||
					type === 'object') {
				value = JSONX.parse(value);
			}
			if (helper.isArray(value)) return JSON.stringify(value);
			throw new TypeError('JSONX.stringify');
		};
	}
}(window));

/*
JSON Encode
*/

function json_decode(str_json) {

	var json = this.window.JSON;
	if (typeof json === 'object' && typeof json.parse === 'function') {
		try {
			return json.parse(str_json);
		} catch (err) {
			if (!(err instanceof SyntaxError)) {
				throw new Error('Unexpected error type in json_decode()');
			}
			this.php_js = this.php_js || {};
			this.php_js.last_error_json = 4;
			return null;
		}
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var j;
	var text = str_json;
	cx.lastIndex = 0;
	if (cx.test(text)) {
		text = text.replace(cx, function (a) {
			return '\\u' + ('0000' + a.charCodeAt(0)
				.toString(16))
				.slice(-4);
		});
	}
	if ((/^[\],:{}\s]*$/)
		.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
		j = eval('(' + text + ')');

		return j;
	}

	this.php_js = this.php_js || {};
	this.php_js.last_error_json = 4;
	return null;
}
function json_encode(mixed_val) {

	var retVal, json = this.window.JSON;
	try {
		if (typeof json === 'object' && typeof json.stringify === 'function') {
			retVal = json.stringify(mixed_val);
			if (retVal === undefined) {
				throw new SyntaxError('json_encode');
			}
			return retVal;
		}

		var value = mixed_val;

		var quote = function (string) {
			var escapable =
				/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			var meta = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			};

			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0)
					.toString(16))
					.slice(-4);
			}) + '"' : '"' + string + '"';
		};

		var str = function (key, holder) {
			var gap = '';
			var indent = '    ';
			var i = 0;
			var k = '';
			var v = '';
			var length = 0;
			var mind = gap;
			var partial = [];
			var value = holder[key];
			if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
				value = value.toJSON(key);
			}
			switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':
				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':
				return String(value);

			case 'object':
				if (!value) {
					return 'null';
				}
				if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource &&
					value instanceof window.PHPJS_Resource)) {
					throw new SyntaxError('json_encode');
				}
				gap += indent;
				partial = [];
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}
					v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind +
						']' : '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}
				for (k in value) {
					if (Object.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ': ' : ':') + v);
						}
					}
				}
				v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
					'{' + partial.join(',') + '}';
				gap = mind;
				return v;
			case 'undefined':
			case 'function':
			default:
				throw new SyntaxError('json_encode');
			}
		};
		return str('', {
			'': value
		});

	} catch (err) {
		if (!(err instanceof SyntaxError)) {
			throw new Error('Unexpected error type in json_encode()');
		}
		this.php_js = this.php_js || {};
		this.php_js.last_error_json = 4;
		return null;
	}
}
function json_last_error() {
	return this.php_js && this.php_js.last_error_json ? this.php_js.last_error_json : 0;
}


var tojson = function(x, indent, nolint){
	if (x === null || x === undefined) {
		return String(x);
	}
	indent = indent || '';

	switch (typeof x) {
	case 'string':
		var out = new Array(x.length+1);
		out[0] = '"';
		for (var i=0; i<x.length; i++){
			if (x[i] === '"') {
				out[out.length] = '\\"';
			} else if (x[i] === '\\') {
				out[out.length] = '\\\\';
			} else if (x[i] === '\b') {
				out[out.length] = '\\b';
			} else if (x[i] === '\f') {
				out[out.length] = '\\f';
			} else if (x[i] === '\n') {
				out[out.length] = '\\n';
			} else if (x[i] === '\r') {
				out[out.length] = '\\r';
			} else if (x[i] === '\t') {
				out[out.length] = '\\t';
			} else {
				var code = x.charCodeAt(i);
				if (code < 0x20) {
					out[out.length] = (code < 0x10 ? '\\u000' : '\\u00') + code.toString(16);
				} else {
					out[out.length] = x[i];
				}
			}
		}
		return out.join('') + '"';
	case 'number':

	case 'boolean':
		return '' + x;
	case 'object':
		var func = $.isArray(x) ? tojsonArray : tojsonObject;
		var s = func(x, indent, nolint);
		if ((nolint === null || nolint === undefined || nolint === true) &&
				s.length < 80 &&
				(indent === null || indent.length === 0)){
			s = s.replace(/[\t\r\n]+/gm, ' ');
		}
		return s;
	case 'function':
		return x.toString();
	default:
		throw 'tojson can\'t handle type ' + (typeof x);
	}
};

var tojsonObject = function(x, indent, nolint){
	var lineEnding = nolint ? ' ' : '\n';
	var tabSpace = nolint ? '' : '\t';
	indent = indent || '';

	if (typeof(x.tojson) === 'function' && x.tojson !== tojson) {
		return x.tojson(indent, nolint);
	}

	if (x.constructor &&
			typeof(x.constructor.tojson) === 'function' &&
			x.constructor.tojson !== tojson) {
		return x.constructor.tojson(x, indent, nolint);
	}

	if (hasDefinedProperty(x, 'toString') && !$.isArray(x)) {
		return x.toString();
	}

	if (x instanceof Error) {
		return x.toString();
	}

	if (isObjectId(x)) {
		return 'ObjectId("' + x.$oid + '")';
	}
	indent += tabSpace;
	var s = '{';

	var pairs = [];
	for (var k in x) {
		if (x.hasOwnProperty(k)) {
			var val = x[k];
			var pair = '"' + k + '" : ' + tojson(val, indent, nolint);

			if (k === '_id') {
				pairs.unshift(pair);
			} else {
				pairs.push(pair);
			}
		}
	}
	s += $.map(pairs, function (pair) {
		return lineEnding + indent + pair;
	}).join(',');
	s += lineEnding;
	indent = indent.substring(1);
	return s + indent + '}';
};

var tojsonArray = function (a, indent, nolint) {
	if (a.length === 0) {
		return '[ ]';
	}

	var lineEnding = nolint ? ' ' : '\n';
	if (!indent || nolint) {
		indent = '';
	}

	var s = '[' + lineEnding;
	indent += '\t';
	for (var i = 0; i < a.length; i++) {
		s += indent + tojson(a[i], indent, nolint);
		if (i < a.length - 1) {
			s += ',' + lineEnding;
		}
	}
	if (a.length === 0) {
		s += indent;
	}

	indent = indent.substring(1);
	s += lineEnding + indent + ']';
	return s;
};

var isObjectId = function(obj) {
	var keys = Object.keys(obj);
	return keys.length === 1 && keys[0] === '$oid' && typeof(obj.$oid) === 'string' && /^[0-9a-f]{24}$/.test(obj.$oid);
};

var hasDefinedProperty = function (obj, prop) {
	if (Object.getPrototypeOf === undefined || Object.getPrototypeOf(obj) === null) {
		return false;
	} else if (obj.hasOwnProperty(prop)) {
		return true;
	} else {
		return hasDefinedProperty(Object.getPrototypeOf(obj), prop);
	}
};


/*
JSON Sans Eval
*/


// This source code is free for use in the public domain.
// NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

// http://code.google.com/p/json-sans-eval/

/**
 * Parses a string of well-formed JSON text.
 *
 * If the input is not well-formed, then behavior is undefined, but it is
 * deterministic and is guaranteed not to modify any object other than its
 * return value.
 *
 * This does not use `eval` so is less likely to have obscure security bugs than
 * json2.js.
 * It is optimized for speed, so is much faster than json_parse.js.
 *
 * This library should be used whenever security is a concern (when JSON may
 * come from an untrusted source), speed is a concern, and erroring on malformed
 * JSON is *not* a concern.
 *
 *                      Pros                   Cons
 *                    +-----------------------+-----------------------+
 * json_sans_eval.js  | Fast, secure          | Not validating        |
 *                    +-----------------------+-----------------------+
 * json_parse.js      | Validating, secure    | Slow                  |
 *                    +-----------------------+-----------------------+
 * json2.js           | Fast, some validation | Potentially insecure  |
 *                    +-----------------------+-----------------------+
 *
 * json2.js is very fast, but potentially insecure since it calls `eval` to
 * parse JSON data, so an attacker might be able to supply strange JS that
 * looks like JSON, but that executes arbitrary javascript.
 * If you do have to use json2.js with untrusted data, make sure you keep
 * your version of json2.js up to date so that you get patches as they're
 * released.
 *
 * @param {string} json per RFC 4627
 * @param {function (this:Object, string, *):*} opt_reviver optional function
 *     that reworks JSON objects post-parse per Chapter 15.12 of EcmaScript3.1.
 *     If supplied, the function is called with a string key, and a value.
 *     The value is the property of 'this'.  The reviver should return
 *     the value to use in its place.  So if dates were serialized as
 *     {@code { "type": "Date", "time": 1234 }}, then a reviver might look like
 *     {@code
 *     function (key, value) {
 *       if (value && typeof value === 'object' && 'Date' === value.type) {
 *         return new Date(value.time);
 *       } else {
 *         return value;
 *       }
 *     }}.
 *     If the reviver returns {@code undefined} then the property named by key
 *     will be deleted from its container.
 *     {@code this} is bound to the object containing the specified property.
 * @return {Object|Array}
 * @author Mike Samuel <mikesamuel@gmail.com>
 */
var jsonParse = (function () {
	var number
			= '(?:-?\\b(?:0|[1-9][0-9]*)(?:\\.[0-9]+)?(?:[eE][+-]?[0-9]+)?\\b)';
	var oneChar = '(?:[^\\0-\\x08\\x0a-\\x1f\"\\\\]'
			+ '|\\\\(?:[\"/\\\\bfnrt]|u[0-9A-Fa-f]{4}))';
	var string = '(?:\"' + oneChar + '*\")';

	// Will match a value in a well-formed JSON file.
	// If the input is not well-formed, may match strangely, but not in an unsafe
	// way.
	// Since this only matches value tokens, it does not match whitespace, colons,
	// or commas.
	var jsonToken = new RegExp(
			'(?:false|true|null|[\\{\\}\\[\\]]'
			+ '|' + number
			+ '|' + string
			+ ')', 'g');

	// Matches escape sequences in a string literal
	var escapeSequence = new RegExp('\\\\(?:([^u])|u(.{4}))', 'g');

	// Decodes escape sequences in object literals
	var escapes = {
		'"': '"',
		'/': '/',
		'\\': '\\',
		'b': '\b',
		'f': '\f',
		'n': '\n',
		'r': '\r',
		't': '\t'
	};
	function unescapeOne(_, ch, hex) {
		return ch ? escapes[ch] : String.fromCharCode(parseInt(hex, 16));
	}

	// A non-falsy value that coerces to the empty string when used as a key.
	var EMPTY_STRING = new String('');
	var SLASH = '\\';

	// Constructor to use based on an open token.
	var firstTokenCtors = { '{': Object, '[': Array };

	var hop = Object.hasOwnProperty;

	return function (json, opt_reviver) {
		// Split into tokens
		var toks = json.match(jsonToken);
		// Construct the object to return
		var result;
		var tok = toks[0];
		var topLevelPrimitive = false;
		if ('{' === tok) {
			result = {};
		} else if ('[' === tok) {
			result = [];
		} else {
			// The RFC only allows arrays or objects at the top level, but the JSON.parse
			// defined by the EcmaScript 5 draft does allow strings, booleans, numbers, and null
			// at the top level.
			result = [];
			topLevelPrimitive = true;
		}

		// If undefined, the key in an object key/value record to use for the next
		// value parsed.
		var key;
		// Loop over remaining tokens maintaining a stack of uncompleted objects and
		// arrays.
		var stack = [result];
		for (var i = 1 - topLevelPrimitive, n = toks.length; i < n; ++i) {
			tok = toks[i];

			var cont;
			switch (tok.charCodeAt(0)) {
				default:  // sign or digit
					cont = stack[0];
					cont[key || cont.length] = +(tok);
					key = void 0;
					break;
				case 0x22:  // '"'
					tok = tok.substring(1, tok.length - 1);
					if (tok.indexOf(SLASH) !== -1) {
						tok = tok.replace(escapeSequence, unescapeOne);
					}
					cont = stack[0];
					if (!key) {
						if (cont instanceof Array) {
							key = cont.length;
						} else {
							key = tok || EMPTY_STRING;  // Use as key for next value seen.
							break;
						}
					}
					cont[key] = tok;
					key = void 0;
					break;
				case 0x5b:  // '['
					cont = stack[0];
					stack.unshift(cont[key || cont.length] = []);
					key = void 0;
					break;
				case 0x5d:  // ']'
					stack.shift();
					break;
				case 0x66:  // 'f'
					cont = stack[0];
					cont[key || cont.length] = false;
					key = void 0;
					break;
				case 0x6e:  // 'n'
					cont = stack[0];
					cont[key || cont.length] = null;
					key = void 0;
					break;
				case 0x74:  // 't'
					cont = stack[0];
					cont[key || cont.length] = true;
					key = void 0;
					break;
				case 0x7b:  // '{'
					cont = stack[0];
					stack.unshift(cont[key || cont.length] = {});
					key = void 0;
					break;
				case 0x7d:  // '}'
					stack.shift();
					break;
			}
		}
		// Fail if we've got an uncompleted object.
		if (topLevelPrimitive) {
			if (stack.length !== 1) { throw new Error(); }
			result = result[0];
		} else {
			if (stack.length) { throw new Error(); }
		}

		if (opt_reviver) {
			// Based on walk as implemented in http://www.json.org/json2.js
			var walk = function (holder, key) {
				var value = holder[key];
				if (value && typeof value === 'object') {
					var toDelete = null;
					for (var k in value) {
						if (hop.call(value, k) && value !== holder) {
							// Recurse to properties first.  This has the effect of causing
							// the reviver to be called on the object graph depth-first.

							// Since 'this' is bound to the holder of the property, the
							// reviver can access sibling properties of k including ones
							// that have not yet been revived.

							// The value returned by the reviver is used in place of the
							// current value of property k.
							// If it returns undefined then the property is deleted.
							var v = walk(value, k);
							if (v !== void 0) {
								value[k] = v;
							} else {
								// Deleting properties inside the loop has vaguely defined
								// semantics in ES3 and ES3.1.
								if (!toDelete) { toDelete = []; }
								toDelete.push(k);
							}
						}
					}
					if (toDelete) {
						for (var i = toDelete.length; --i >= 0;) {
							delete value[toDelete[i]];
						}
					}
				}
				return opt_reviver.call(holder, key, value);
			};
			result = walk({ '': result }, '');
		}

		return result;
	};
})();

/*
JSON Parse State
*/


/*
	json_parse_state.js
	2013-05-26

	Public Domain.

	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	This file creates a json_parse function.

		json_parse(text, reviver)
			This method parses a JSON text to produce an object or array.
			It can throw a SyntaxError exception.

			The optional reviver parameter is a function that can filter and
			transform the results. It receives each of the keys and values,
			and its return value is used instead of the original value.
			If it returns what it received, then the structure is not modified.
			If it returns undefined then the member is deleted.

			Example:

			// Parse the text. Values that look like ISO date strings will
			// be converted to Date objects.

			myData = json_parse(text, function (key, value) {
				var a;
				if (typeof value === 'string') {
					a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
					if (a) {
						return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
							+a[5], +a[6]));
					}
				}
				return value;
			});

	This is a reference implementation. You are free to copy, modify, or
	redistribute.

	This code should be minified before deployment.
	See http://javascript.crockford.com/jsmin.html

	USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	NOT CONTROL.
*/

/*jslint regexp: true, unparam: true */

/*members "", "\"", ",", "\/", ":", "[", "\\", "]", acomma, avalue, b,
	call, colon, container, exec, f, false, firstavalue, firstokey,
	fromCharCode, go, hasOwnProperty, key, length, n, null, ocomma, okey,
	ovalue, pop, prototype, push, r, replace, slice, state, t, test, true,
	value, "{", "}"
*/

var json_parse = (function () {
	"use strict";

// This function creates a JSON parse function that uses a state machine rather
// than the dangerous eval function to parse a JSON text.

	var state,      // The state of the parser, one of
					// 'go'         The starting state
					// 'ok'         The final, accepting state
					// 'firstokey'  Ready for the first key of the object or
					//              the closing of an empty object
					// 'okey'       Ready for the next key of the object
					// 'colon'      Ready for the colon
					// 'ovalue'     Ready for the value half of a key/value pair
					// 'ocomma'     Ready for a comma or closing }
					// 'firstavalue' Ready for the first value of an array or
					//              an empty array
					// 'avalue'     Ready for the next value of an array
					// 'acomma'     Ready for a comma or closing ]
		stack,      // The stack, for controlling nesting.
		container,  // The current container object or array
		key,        // The current key
		value,      // The current value
		escapes = { // Escapement translation table
			'\\': '\\',
			'"': '"',
			'/': '/',
			't': '\t',
			'n': '\n',
			'r': '\r',
			'f': '\f',
			'b': '\b'
		},
		string = {   // The actions for string tokens
			go: function () {
				state = 'ok';
			},
			firstokey: function () {
				key = value;
				state = 'colon';
			},
			okey: function () {
				key = value;
				state = 'colon';
			},
			ovalue: function () {
				state = 'ocomma';
			},
			firstavalue: function () {
				state = 'acomma';
			},
			avalue: function () {
				state = 'acomma';
			}
		},
		number = {   // The actions for number tokens
			go: function () {
				state = 'ok';
			},
			ovalue: function () {
				state = 'ocomma';
			},
			firstavalue: function () {
				state = 'acomma';
			},
			avalue: function () {
				state = 'acomma';
			}
		},
		action = {

// The action table describes the behavior of the machine. It contains an
// object for each token. Each object contains a method that is called when
// a token is matched in a state. An object will lack a method for illegal
// states.

			'{': {
				go: function () {
					stack.push({state: 'ok'});
					container = {};
					state = 'firstokey';
				},
				ovalue: function () {
					stack.push({container: container, state: 'ocomma', key: key});
					container = {};
					state = 'firstokey';
				},
				firstavalue: function () {
					stack.push({container: container, state: 'acomma'});
					container = {};
					state = 'firstokey';
				},
				avalue: function () {
					stack.push({container: container, state: 'acomma'});
					container = {};
					state = 'firstokey';
				}
			},
			'}': {
				firstokey: function () {
					var pop = stack.pop();
					value = container;
					container = pop.container;
					key = pop.key;
					state = pop.state;
				},
				ocomma: function () {
					var pop = stack.pop();
					container[key] = value;
					value = container;
					container = pop.container;
					key = pop.key;
					state = pop.state;
				}
			},
			'[': {
				go: function () {
					stack.push({state: 'ok'});
					container = [];
					state = 'firstavalue';
				},
				ovalue: function () {
					stack.push({container: container, state: 'ocomma', key: key});
					container = [];
					state = 'firstavalue';
				},
				firstavalue: function () {
					stack.push({container: container, state: 'acomma'});
					container = [];
					state = 'firstavalue';
				},
				avalue: function () {
					stack.push({container: container, state: 'acomma'});
					container = [];
					state = 'firstavalue';
				}
			},
			']': {
				firstavalue: function () {
					var pop = stack.pop();
					value = container;
					container = pop.container;
					key = pop.key;
					state = pop.state;
				},
				acomma: function () {
					var pop = stack.pop();
					container.push(value);
					value = container;
					container = pop.container;
					key = pop.key;
					state = pop.state;
				}
			},
			':': {
				colon: function () {
					if (Object.hasOwnProperty.call(container, key)) {
						throw new SyntaxError('Duplicate key "' + key + '"');
					}
					state = 'ovalue';
				}
			},
			',': {
				ocomma: function () {
					container[key] = value;
					state = 'okey';
				},
				acomma: function () {
					container.push(value);
					state = 'avalue';
				}
			},
			'true': {
				go: function () {
					value = true;
					state = 'ok';
				},
				ovalue: function () {
					value = true;
					state = 'ocomma';
				},
				firstavalue: function () {
					value = true;
					state = 'acomma';
				},
				avalue: function () {
					value = true;
					state = 'acomma';
				}
			},
			'false': {
				go: function () {
					value = false;
					state = 'ok';
				},
				ovalue: function () {
					value = false;
					state = 'ocomma';
				},
				firstavalue: function () {
					value = false;
					state = 'acomma';
				},
				avalue: function () {
					value = false;
					state = 'acomma';
				}
			},
			'null': {
				go: function () {
					value = null;
					state = 'ok';
				},
				ovalue: function () {
					value = null;
					state = 'ocomma';
				},
				firstavalue: function () {
					value = null;
					state = 'acomma';
				},
				avalue: function () {
					value = null;
					state = 'acomma';
				}
			}
		};

	function debackslashify(text) {

// Remove and replace any backslash escapement.

		return text.replace(/\\(?:u(.{4})|([^u]))/g, function (a, b, c) {
			return b ? String.fromCharCode(parseInt(b, 16)) : escapes[c];
		});
	}

	return function (source, reviver) {

// A regular expression is used to extract tokens from the JSON text.
// The extraction process is cautious.

		var r,          // The result of the exec method.
			tx = /^[\x20\t\n\r]*(?:([,:\[\]{}]|true|false|null)|(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)|"((?:[^\r\n\t\\\"]|\\(?:["\\\/trnfb]|u[0-9a-fA-F]{4}))*)")/;

// Set the starting state.

		state = 'go';

// The stack records the container, key, and state for each object or array
// that contains another object or array while processing nested structures.

		stack = [];

// If any error occurs, we will catch it and ultimately throw a syntax error.

		try {

// For each token...

			for (;;) {
				r = tx.exec(source);
				if (!r) {
					break;
				}

// r is the result array from matching the tokenizing regular expression.
//  r[0] contains everything that matched, including any initial whitespace.
//  r[1] contains any punctuation that was matched, or true, false, or null.
//  r[2] contains a matched number, still in string form.
//  r[3] contains a matched string, without quotes but with escapement.

				if (r[1]) {

// Token: Execute the action for this state and token.

					action[r[1]][state]();

				} else if (r[2]) {

// Number token: Convert the number string into a number value and execute
// the action for this state and number.

					value = +r[2];
					number[state]();
				} else {

// String token: Replace the escapement sequences and execute the action for
// this state and string.

					value = debackslashify(r[3]);
					string[state]();
				}

// Remove the token from the string. The loop will continue as long as there
// are tokens. This is a slow process, but it allows the use of ^ matching,
// which assures that no illegal tokens slip through.

				source = source.slice(r[0].length);
			}

// If we find a state/token combination that is illegal, then the action will
// cause an error. We handle the error by simply changing the state.

		} catch (e) {
			state = e;
		}

// The parsing is finished. If we are not in the final 'ok' state, or if the
// remaining source contains anything except whitespace, then we did not have
//a well-formed JSON text.

		if (state !== 'ok' || /[^\x20\t\n\r]/.test(source)) {
			throw state instanceof SyntaxError ? state : new SyntaxError('JSON');
		}

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the current
// value in an empty key. If there is not a reviver function, we simply return
// that value.

		return typeof reviver === 'function' ? (function walk(holder, key) {
			var k, v, value = holder[key];
			if (value && typeof value === 'object') {
				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = walk(value, k);
						if (v !== undefined) {
							value[k] = v;
						} else {
							delete value[k];
						}
					}
				}
			}
			return reviver.call(holder, key, value);
		}({'': value}, '')) : value;
	};
}());

/*
JSON Parse
*/


/*
	json_parse.js
	2012-06-20

	Public Domain.

	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	This file creates a json_parse function.

		json_parse(text, reviver)
			This method parses a JSON text to produce an object or array.
			It can throw a SyntaxError exception.

			The optional reviver parameter is a function that can filter and
			transform the results. It receives each of the keys and values,
			and its return value is used instead of the original value.
			If it returns what it received, then the structure is not modified.
			If it returns undefined then the member is deleted.

			Example:

			// Parse the text. Values that look like ISO date strings will
			// be converted to Date objects.

			myData = json_parse(text, function (key, value) {
				var a;
				if (typeof value === 'string') {
					a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
					if (a) {
						return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
							+a[5], +a[6]));
					}
				}
				return value;
			});

	This is a reference implementation. You are free to copy, modify, or
	redistribute.

	This code should be minified before deployment.
	See http://javascript.crockford.com/jsmin.html

	USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	NOT CONTROL.
*/

/*members "", "\"", "\/", "\\", at, b, call, charAt, f, fromCharCode,
	hasOwnProperty, message, n, name, prototype, push, r, t, text
*/

var json_parse = (function () {
	"use strict";

// This is a function that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.

// We are defining the function inside of another function to avoid creating
// global variables.

	var at,     // The index of the current character
		ch,     // The current character
		escapee = {
			'"':  '"',
			'\\': '\\',
			'/':  '/',
			b:    '\b',
			f:    '\f',
			n:    '\n',
			r:    '\r',
			t:    '\t'
		},
		text,

		error = function (m) {

// Call error when something is wrong.

			throw {
				name:    'SyntaxError',
				message: m,
				at:      at,
				text:    text
			};
		},

		next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

			if (c && c !== ch) {
				error("Expected '" + c + "' instead of '" + ch + "'");
			}

// Get the next character. When there are no more characters,
// return the empty string.

			ch = text.charAt(at);
			at += 1;
			return ch;
		},

		number = function () {

// Parse a number value.

			var number,
				string = '';

			if (ch === '-') {
				string = '-';
				next('-');
			}
			while (ch >= '0' && ch <= '9') {
				string += ch;
				next();
			}
			if (ch === '.') {
				string += '.';
				while (next() && ch >= '0' && ch <= '9') {
					string += ch;
				}
			}
			if (ch === 'e' || ch === 'E') {
				string += ch;
				next();
				if (ch === '-' || ch === '+') {
					string += ch;
					next();
				}
				while (ch >= '0' && ch <= '9') {
					string += ch;
					next();
				}
			}
			number = +string;
			if (!isFinite(number)) {
				error("Bad number");
			} else {
				return number;
			}
		},

		string = function () {

// Parse a string value.

			var hex,
				i,
				string = '',
				uffff;

// When parsing for string values, we must look for " and \ characters.

			if (ch === '"') {
				while (next()) {
					if (ch === '"') {
						next();
						return string;
					}
					if (ch === '\\') {
						next();
						if (ch === 'u') {
							uffff = 0;
							for (i = 0; i < 4; i += 1) {
								hex = parseInt(next(), 16);
								if (!isFinite(hex)) {
									break;
								}
								uffff = uffff * 16 + hex;
							}
							string += String.fromCharCode(uffff);
						} else if (typeof escapee[ch] === 'string') {
							string += escapee[ch];
						} else {
							break;
						}
					} else {
						string += ch;
					}
				}
			}
			error("Bad string");
		},

		white = function () {

// Skip whitespace.

			while (ch && ch <= ' ') {
				next();
			}
		},

		word = function () {

// true, false, or null.

			switch (ch) {
			case 't':
				next('t');
				next('r');
				next('u');
				next('e');
				return true;
			case 'f':
				next('f');
				next('a');
				next('l');
				next('s');
				next('e');
				return false;
			case 'n':
				next('n');
				next('u');
				next('l');
				next('l');
				return null;
			}
			error("Unexpected '" + ch + "'");
		},

		value,  // Place holder for the value function.

		array = function () {

// Parse an array value.

			var array = [];

			if (ch === '[') {
				next('[');
				white();
				if (ch === ']') {
					next(']');
					return array;   // empty array
				}
				while (ch) {
					array.push(value());
					white();
					if (ch === ']') {
						next(']');
						return array;
					}
					next(',');
					white();
				}
			}
			error("Bad array");
		},

		object = function () {

// Parse an object value.

			var key,
				object = {};

			if (ch === '{') {
				next('{');
				white();
				if (ch === '}') {
					next('}');
					return object;   // empty object
				}
				while (ch) {
					key = string();
					white();
					next(':');
					if (Object.hasOwnProperty.call(object, key)) {
						error('Duplicate key "' + key + '"');
					}
					object[key] = value();
					white();
					if (ch === '}') {
						next('}');
						return object;
					}
					next(',');
					white();
				}
			}
			error("Bad object");
		};

	value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

		white();
		switch (ch) {
		case '{':
			return object();
		case '[':
			return array();
		case '"':
			return string();
		case '-':
			return number();
		default:
			return ch >= '0' && ch <= '9' ? number() : word();
		}
	};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

	return function (source, reviver) {
		var result;

		text = source;
		at = 0;
		ch = ' ';
		result = value();
		white();
		if (ch) {
			error("Syntax error");
		}

// If there is a reviver function, we recursively walk the new structure,
// passing each name/value pair to the reviver function for possible
// transformation, starting with a temporary root object that holds the result
// in an empty key. If there is not a reviver function, we simply return the
// result.

		return typeof reviver === 'function'
			? (function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}({'': result}, ''))
			: result;
	};
}());

/*
JSON Cycle
*/


/*
	cycle.js
	2013-02-19

	Public Domain.

	NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

	This code should be minified before deployment.
	See http://javascript.crockford.com/jsmin.html

	USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
	NOT CONTROL.
*/

/*jslint evil: true, regexp: true */

/*members $ref, apply, call, decycle, hasOwnProperty, length, prototype, push,
	retrocycle, stringify, test, toString
*/

if (typeof JSON.decycle !== 'function') {
	JSON.decycle = function decycle(object) {
		'use strict';

// Make a deep copy of an object or array, assuring that there is at most
// one instance of each object or array in the resulting structure. The
// duplicate references (which might be forming cycles) are replaced with
// an object of the form
//      {$ref: PATH}
// where the PATH is a JSONPath string that locates the first occurance.
// So,
//      var a = [];
//      a[0] = a;
//      return JSON.stringify(JSON.decycle(a));
// produces the string '[{"$ref":"$"}]'.

// JSONPath is used to locate the unique object. $ indicates the top level of
// the object or array. [NUMBER] or [STRING] indicates a child member or
// property.

		var objects = [],   // Keep a reference to each unique object or array
			paths = [];     // Keep the path to each unique object or array

		return (function derez(value, path) {

// The derez recurses through the object, producing the deep copy.

			var i,          // The loop counter
				name,       // Property name
				nu;         // The new object or array

// typeof null === 'object', so go on if this value is really an object but not
// one of the weird builtin objects.

			if (typeof value === 'object' && value !== null &&
					!(value instanceof Boolean) &&
					!(value instanceof Date)    &&
					!(value instanceof Number)  &&
					!(value instanceof RegExp)  &&
					!(value instanceof String)) {

// If the value is an object or array, look to see if we have already
// encountered it. If so, return a $ref/path object. This is a hard way,
// linear search that will get slower as the number of unique objects grows.

				for (i = 0; i < objects.length; i += 1) {
					if (objects[i] === value) {
						return {$ref: paths[i]};
					}
				}

// Otherwise, accumulate the unique value and its path.

				objects.push(value);
				paths.push(path);

// If it is an array, replicate the array.

				if (Object.prototype.toString.apply(value) === '[object Array]') {
					nu = [];
					for (i = 0; i < value.length; i += 1) {
						nu[i] = derez(value[i], path + '[' + i + ']');
					}
				} else {

// If it is an object, replicate the object.

					nu = {};
					for (name in value) {
						if (Object.prototype.hasOwnProperty.call(value, name)) {
							nu[name] = derez(value[name],
								path + '[' + JSON.stringify(name) + ']');
						}
					}
				}
				return nu;
			}
			return value;
		}(object, '$'));
	};
}


if (typeof JSON.retrocycle !== 'function') {
	JSON.retrocycle = function retrocycle($) {
		'use strict';

// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.

		var px =
			/^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

		(function rez(value) {

// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.

			var i, item, name, path;

			if (value && typeof value === 'object') {
				if (Object.prototype.toString.apply(value) === '[object Array]') {
					for (i = 0; i < value.length; i += 1) {
						item = value[i];
						if (item && typeof item === 'object') {
							path = item.$ref;
							if (typeof path === 'string' && px.test(path)) {
								value[i] = eval(path);
							} else {
								rez(item);
							}
						}
					}
				} else {
					for (name in value) {
						if (typeof value[name] === 'object') {
							item = value[name];
							if (item) {
								path = item.$ref;
								if (typeof path === 'string' && px.test(path)) {
									value[name] = eval(path);
								} else {
									rez(item);
								}
							}
						}
					}
				}
			}
		}($));
		return $;
	};
}


























