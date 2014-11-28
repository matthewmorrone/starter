
;(function() {
	var undefined;
	var VERSION = '3.0.0-pre';
	var BIND_FLAG = 1,
		BIND_KEY_FLAG = 2,
		CURRY_FLAG = 4,
		CURRY_RIGHT_FLAG = 8,
		CURRY_BOUND_FLAG = 16,
		PARTIAL_FLAG = 32,
		PARTIAL_RIGHT_FLAG = 64;
	var HOT_COUNT = 150,
		HOT_SPAN = 16;
	var FUNC_ERROR_TEXT = 'Expected a function';
	var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1;
	var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;
	var PLACEHOLDER = '__lodash_placeholder__';
	var idCounter = 0;
	var reAllCaps = /^[A-Z]+$/;
	var reEmptyStringLeading = /\b__p \+= '';/g,
		reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
		reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	var reEscapedHtml = /&(?:amp|lt|gt|quot|#39|#96);/g,
		reUnescapedHtml = /[&<>"'`]/g;
	var reEscape = /<%-([\s\S]+?)%>/g,
		reEvaluate = /<%([\s\S]+?)%>/g,
		reInterpolate = /<%=([\s\S]+?)%>/g;
	var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	var reFlags = /\w*$/;
	var reFuncName = /^\s*function[ \n\r\t]+\w/;
	var reHexPrefix = /^0[xX]/;
	var reHostCtor = /^\[object .+?Constructor\]$/;
	var reLatin1 = /[\xC0-\xFF]/g;
	var reNoMatch = /($^)/;
	var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g;
	var reThis = /\bthis\b/;
	var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	var reWords = /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g;
	var whitespace = (
		' \t\x0B\f\xA0\ufeff' + '\n\r\u2028\u2029' + '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
	);
	var contextProps = [
		'Array', 'ArrayBuffer', 'Date', 'Error', 'Float32Array', 'Float64Array',
		'Function', 'Int8Array', 'Int16Array', 'Int32Array', 'Math', 'Number',
		'Object', 'RegExp', 'Set', 'String', '_', 'clearTimeout', 'document',
		'isFinite', 'parseInt', 'setTimeout', 'TypeError', 'Uint8Array',
		'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'WeakMap',
		'window', 'WinRTError'
	];
	var shadowedProps = [
		'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
		'toLocaleString', 'toString', 'valueOf'
	];
	var templateCounter = -1;
	var argsClass = '[object Arguments]',
		arrayClass = '[object Array]',
		boolClass = '[object Boolean]',
		dateClass = '[object Date]',
		errorClass = '[object Error]',
		funcClass = '[object Function]',
		mapClass = '[object Map]',
		numberClass = '[object Number]',
		objectClass = '[object Object]',
		regexpClass = '[object RegExp]',
		setClass = '[object Set]',
		stringClass = '[object String]',
		weakMapClass = '[object WeakMap]';
	var arrayBufferClass = '[object ArrayBuffer]',
		float32Class = '[object Float32Array]',
		float64Class = '[object Float64Array]',
		int8Class = '[object Int8Array]',
		int16Class = '[object Int16Array]',
		int32Class = '[object Int32Array]',
		uint8Class = '[object Uint8Array]',
		uint8ClampedClass = '[object Uint8ClampedArray]',
		uint16Class = '[object Uint16Array]',
		uint32Class = '[object Uint32Array]';
	var arrayLikeClasses = {}; arrayLikeClasses[argsClass] = arrayLikeClasses[arrayClass] = arrayLikeClasses[float32Class] = arrayLikeClasses[float64Class] = arrayLikeClasses[int8Class] = arrayLikeClasses[int16Class] = arrayLikeClasses[int32Class] = arrayLikeClasses[uint8Class] = arrayLikeClasses[uint8ClampedClass] = arrayLikeClasses[uint16Class] = arrayLikeClasses[uint32Class] = true; arrayLikeClasses[arrayBufferClass] = arrayLikeClasses[boolClass] = arrayLikeClasses[dateClass] = arrayLikeClasses[errorClass] = arrayLikeClasses[funcClass] = arrayLikeClasses[mapClass] = arrayLikeClasses[numberClass] = arrayLikeClasses[objectClass] = arrayLikeClasses[regexpClass] = arrayLikeClasses[setClass] = arrayLikeClasses[stringClass] = arrayLikeClasses[weakMapClass] = false;
	var cloneableClasses = {}; cloneableClasses[argsClass] = cloneableClasses[arrayClass] = cloneableClasses[arrayBufferClass] = cloneableClasses[boolClass] = cloneableClasses[dateClass] = cloneableClasses[float32Class] = cloneableClasses[float64Class] = cloneableClasses[int8Class] = cloneableClasses[int16Class] = cloneableClasses[int32Class] = cloneableClasses[numberClass] = cloneableClasses[objectClass] = cloneableClasses[regexpClass] = cloneableClasses[stringClass] = cloneableClasses[uint8Class] = cloneableClasses[uint8ClampedClass] = cloneableClasses[uint16Class] = cloneableClasses[uint32Class] = true; cloneableClasses[errorClass] = cloneableClasses[funcClass] = cloneableClasses[mapClass] = cloneableClasses[setClass] = cloneableClasses[weakMapClass] = false;
	var debounceOptions = {
		'leading': false,
		'maxWait': 0,
		'trailing': false
	};
	var descriptor = {
		'configurable': false,
		'enumerable': false,
		'value': null,
		'writable': false
	};
	var htmlEscapes = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'`': '&#96;'
	};
	var htmlUnescapes = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&#39;': "'",
		'&#96;': '`'
	};
	var deburredLetters = {
		'\xC0': 'A',  '\xC1': 'A', '\xC2': 'A', '\xC3': 'A', '\xC4': 'A', '\xC5': 'A',
		'\xE0': 'a',  '\xE1': 'a', '\xE2': 'a', '\xE3': 'a', '\xE4': 'a', '\xE5': 'a',
		'\xC7': 'C',  '\xE7': 'c',
		'\xD0': 'D',  '\xF0': 'd',
		'\xC8': 'E',  '\xC9': 'E', '\xCA': 'E', '\xCB': 'E',
		'\xE8': 'e',  '\xE9': 'e', '\xEA': 'e', '\xEB': 'e',
		'\xCC': 'I',  '\xCD': 'I', '\xCE': 'I', '\xCF': 'I',
		'\xEC': 'i',  '\xED': 'i', '\xEE': 'i', '\xEF': 'i',
		'\xD1': 'N',  '\xF1': 'n',
		'\xD2': 'O',  '\xD3': 'O', '\xD4': 'O', '\xD5': 'O', '\xD6': 'O', '\xD8': 'O',
		'\xF2': 'o',  '\xF3': 'o', '\xF4': 'o', '\xF5': 'o', '\xF6': 'o', '\xF8': 'o',
		'\xD9': 'U',  '\xDA': 'U', '\xDB': 'U', '\xDC': 'U',
		'\xF9': 'u',  '\xFA': 'u', '\xFB': 'u', '\xFC': 'u',
		'\xDD': 'Y',  '\xFD': 'y', '\xFF': 'y',
		'\xC6': 'AE', '\xE6': 'ae',
		'\xDE': 'Th', '\xFE': 'th',
		'\xDF': 'ss', '\xD7': ' ', '\xF7': ' '
	};
	var objectTypes = {
		'function': true,
		'object': true
	};
	var stringEscapes = {
		'\\': '\\',
		"'": "'",
		'\n': 'n',
		'\r': 'r',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};
	var root = (objectTypes[typeof window] && window) || this;
	var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
	var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;
	var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
	if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
		root = freeGlobal;
	}
	var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;
	function baseAt(collection, props) {
		var index = -1,
			length = props.length,
			result = Array(length);
		while(++index < length) {
			result[index] = collection[props[index]];
		}
		return result;
	}
	function baseCompareAscending(value, other) {
		if (value !== other) {
			if (value > other || typeof value == 'undefined') {
				return 1;
			}
			if (value < other || typeof other == 'undefined') {
				return -1;
			}
		}
		return 0;
	}
	function baseIndexOf(array, value, fromIndex) {
		var index = (fromIndex || 0) - 1,
			length = array ? array.length : 0,
			isReflexive = value === value;
		while (++index < length) {
			var other = array[index];
			if ((isReflexive ? other === value : other !== other)) {
				return index;
			}
		}
		return -1;
	}
	function baseSlice(array) {
		var index = -1,
			length = array ? array.length : 0,
			result = Array(length);
		while (++index < length) {
			result[index] = array[index];
		}
		return result;
	}
	function cacheIndexOf(cache, value) {
		return cache.has(value) ? 0 : -1;
	}
	function charAtCallback(string) {
		return string.charCodeAt(0);
	}
	function charsLeftIndex(string, chars) {
		var index = -1,
			length = string.length;
		while (++index < length && chars.indexOf(string.charAt(index)) > -1) {}
		return index;
	}
	function charsRightIndex(string, chars) {
		var index = string.length;
		while (index-- && chars.indexOf(string.charAt(index)) > -1) {}
		return index;
	}
	function compareAscending(object, other) {
		return baseCompareAscending(object.criteria, other.criteria) || (object.index - other.index);
	}
	function compareMultipleAscending(object, other) {
		var index = -1,
			objCriteria = object.criteria,
			othCriteria = other.criteria,
			length = objCriteria.length;
		while (++index < length) {
			var result = baseCompareAscending(objCriteria[index], othCriteria[index]);
			if (result) {
				return result;
			}
		}
		return object.index - other.index;
	}
	function createCompounder(callback) {
		return function(string) {
			var index = -1, words = string != null && String(string).replace(reLatin1, deburrLetter).match(reWords), length = words ? words.length : 0, result = '';
			while (++index < length) {
				result = callback(result, words[index], index, words);
			}
			return result;
		};
	}
	function deburrLetter(letter) {
		return deburredLetters[letter];
	}
	function escapeHtmlChar(chr) {
		return htmlEscapes[chr];
	}
	function escapeStringChar(chr) {
		return '\\' + stringEscapes[chr];
	}
	var isHostObject = (function() {
		try {
			({ 'toString': 0 } + '');
		} catch(e) {
			return function() { return false; };
		}
		return function(value) {
			return typeof value.toString != 'function' && typeof (value + '') == 'string';
		};
	}());
	function isWhitespace(charCode) {
		return ((charCode <= 160 && (charCode >= 9 && charCode <= 13) || charCode == 32 || charCode == 160) || charCode == 5760 || charCode == 6158 || (charCode >= 8192 && (charCode <= 8202 || charCode == 8232 || charCode == 8233 || charCode == 8239 || charCode == 8287 || charCode == 12288 || charCode == 65279)));
	}
	function trimmedLeftIndex(string) {
		var index = -1,
			length = string.length;
		while (++index < length && isWhitespace(string.charCodeAt(index))) {}
		return index;
	}
	function trimmedRightIndex(string) {
		var index = string.length;
		while (index-- && isWhitespace(string.charCodeAt(index))) {}
		return index;
	}
	function unescapeHtmlChar(chr) {
		return htmlUnescapes[chr];
	}
	function runInContext(context) {
		context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;
		var Array = context.Array, Date = context.Date, Error = context.Error, Function = context.Function, Math = context.Math, Number = context.Number, Object = context.Object, RegExp = context.RegExp, String = context.String, TypeError = context.TypeError;
		var arrayProto = Array.prototype, errorProto = Error.prototype, objectProto = Object.prototype, stringProto = String.prototype;
		var document = (document = context.window) && document.document;
		var fnToString = Function.prototype.toString;
		var hasOwnProperty = objectProto.hasOwnProperty;
		var oldDash = context._;
		var toString = objectProto.toString;
		var reNative = RegExp('^' + escapeRegExp(toString) .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
		var ArrayBuffer = isNative(ArrayBuffer = context.ArrayBuffer) && ArrayBuffer,
			bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
			ceil = Math.ceil,
			clearTimeout = context.clearTimeout,
			floor = Math.floor,
			getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
			push = arrayProto.push,
			propertyIsEnumerable = objectProto.propertyIsEnumerable,
			Set = isNative(Set = context.Set) && Set,
			setTimeout = context.setTimeout,
			splice = arrayProto.splice,
			Uint8Array = isNative(Uint8Array = context.Uint8Array) && Uint8Array,
			unshift = arrayProto.unshift,
			WeakMap = isNative(WeakMap = context.WeakMap) && WeakMap;
		var Float64Array = (function() {
			try {
				var func = isNative(func = context.Float64Array) && func, result = new func(new ArrayBuffer(10), 0, 1) && func;
			} catch(e) {}
			return result;
		}());
		var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
			nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
			nativeIsFinite = context.isFinite,
			nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
			nativeMax = Math.max,
			nativeMin = Math.min,
			nativeNow = isNative(nativeNow = Date.now) && nativeNow,
			nativeNumIsFinite = isNative(nativeNumIsFinite = Number.isFinite) && nativeNumIsFinite,
			nativeParseInt = context.parseInt,
			nativeRandom = Math.random;
		var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;
		var metaMap = WeakMap && new WeakMap;
		var ctorByClass = {};
		ctorByClass[float32Class] = context.Float32Array;
		ctorByClass[float64Class] = context.Float64Array;
		ctorByClass[int8Class] = context.Int8Array;
		ctorByClass[int16Class] = context.Int16Array;
		ctorByClass[int32Class] = context.Int32Array;
		ctorByClass[uint8Class] = context.Uint8Array;
		ctorByClass[uint8ClampedClass] = context.Uint8ClampedArray;
		ctorByClass[uint16Class] = context.Uint16Array;
		ctorByClass[uint32Class] = context.Uint32Array;
		var nonEnumProps = {};
		nonEnumProps[arrayClass] = nonEnumProps[dateClass] = nonEnumProps[numberClass] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
		nonEnumProps[boolClass] = nonEnumProps[stringClass] = { 'constructor': true, 'toString': true, 'valueOf': true };
		nonEnumProps[errorClass] = nonEnumProps[funcClass] = nonEnumProps[regexpClass] = { 'constructor': true, 'toString': true };
		nonEnumProps[objectClass] = { 'constructor': true };
		arrayEach(shadowedProps, function(key) {
			for (var className in nonEnumProps) {
				if (hasOwnProperty.call(nonEnumProps, className)) {
					var props = nonEnumProps[className];
					props[key] = hasOwnProperty.call(props, key);
				}
			}
		});
		function lodash(value) {
			if (value && typeof value == 'object') {
				if (value instanceof lodashWrapper) {
					return value;
				}
				if (!isArray(value) && hasOwnProperty.call(value, '__wrapped__')) {
					value = value.__wrapped__;
				}
			}
			return new lodashWrapper(value);
		}
		function lodashWrapper(value, chainAll) {
			this.__chain__ = !!chainAll;
			this.__wrapped__ = value;
		}
		var support = lodash.support = {};
		(function(x) {
			var Ctor = function() { this.x = 1; }, object = { '0': 1, 'length': 1 }, props = [];
			Ctor.prototype = { 'valueOf': 1, 'y': 1 };
			for (var key in new Ctor) { props.push(key); }
			support.argsClass = toString.call(arguments) == argsClass;
			support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') || propertyIsEnumerable.call(errorProto, 'name');
			support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');
			support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);
			support.funcNames = typeof Function.name == 'string';
			support.nodeClass = toString.call(document) != objectClass;
			support.nonEnumStrings = !propertyIsEnumerable.call('x', 0);
			support.nonEnumShadows = !/valueOf/.test(props);
			support.ownLast = props[0] != 'x';
			support.spliceObjects = (splice.call(object, 0, 1), !object[0]);
			support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';
			try {
				support.dom = document.createDocumentFragment().nodeType === 11;
			} catch(e) {
				support.dom = false;
			}
			try {
				support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
			} catch(e) {
				support.nonEnumArgs = true;
			}
		}(0, 0));
		lodash.templateSettings = {
			'escape': reEscape,
		'evaluate': reEvaluate,
		'interpolate': reInterpolate,
		'variable': '',
		'imports': {
				'_': lodash
			}
		};
		function arrayEach(array, iteratee) {
			var index = -1, length = array.length;
			while (++index < length) {
				if (iteratee(array[index], index, array) === false) {
					break;
				}
			}
			return array;
		}
		function arrayEachRight(array, iteratee) {
			var length = array.length;
			while (length--) {
				if (iteratee(array[length], length, array) === false) {
					break;
				}
			}
			return array;
		}
		function arrayEvery(array, predicate) {
			var index = -1, length = array.length;
			while (++index < length) {
				if (!predicate(array[index], index, array)) {
					return false;
				}
			}
			return true;
		}
		function arrayMap(array, iteratee) {
			var index = -1, length = array.length, result = Array(length);
			while (++index < length) {
				result[index] = iteratee(array[index], index, array);
			}
			return result;
		}
		function arrayFilter(array, predicate) {
			var index = -1, length = array.length, resIndex = -1, result = [];
			while (++index < length) {
				var value = array[index];
				if (predicate(value, index, array)) {
					result[++resIndex] = value;
				}
			}
			return result;
		}
		function arrayReduce(array, iteratee, accumulator, initFromArray) {
			var index = -1, length = array.length;
			if (initFromArray && length) {
				accumulator = array[++index];
			}
			while (++index < length) {
				accumulator = iteratee(accumulator, array[index], index, array);
			}
			return accumulator;
		}
		function arrayReduceRight(array, iteratee, accumulator, initFromArray) {
			var length = array.length;
			if (initFromArray && length) {
				accumulator = array[--length];
			}
			while (length--) {
				accumulator = iteratee(accumulator, array[length], length, array);
			}
			return accumulator;
		}
		function arraySome(array, predicate) {
			var index = -1, length = array.length;
			while (++index < length) {
				if (predicate(array[index], index, array)) {
					return true;
				}
			}
			return false;
		}
		function assignDefaults(objectValue, sourceValue) {
			return typeof objectValue == 'undefined'? sourceValue : objectValue;
		}
		function assignOwnDefaults(objectValue, sourceValue, key, object) {
			return (typeof objectValue == 'undefined' || !hasOwnProperty.call(object, key)) ? sourceValue : objectValue;
		}
		function baseAssign(object, source, customizer) {
			var index = -1, props = keys(source), length = props.length;
			while (++index < length) {
				var key = props[index];
				object[key] = customizer ? customizer(object[key], source[key], key, object, source) : source[key];
			}
			return object;
		}
		function baseBindAll(object, methodNames) {
			var index = -1, length = methodNames.length;
			while (++index < length) {
				var key = methodNames[index];
				object[key] = createWrapper(object[key], BIND_FLAG, null, object);
			}
			return object;
		}
		function baseCallback(func, thisArg, argCount) {
			var type = typeof func;
			if (type == 'function') {
				if (typeof thisArg == 'undefined') {
					return func;
				}
				var data = getData(func);
				if (typeof data == 'undefined') {
					if (support.funcNames) {
						data = !func.name;
					}
					data = data || !support.funcDecomp;
					if (!data) {
						var source = fnToString.call(func);
						if (!support.funcNames) {
							data = !reFuncName.test(source);
						}
						if (!data) {
							data = reThis.test(source) || isNative(func);
							baseSetData(func, data);
						}
					}
				}
				if (data === false || (data !== true && data[1] & BIND_FLAG)) {
					return func;
				}
				switch (argCount) {
					case 1: return function(value) {
						return func.call(thisArg, value);
					};
					case 3: return function(value, index, collection) {
						return func.call(thisArg, value, index, collection);
					};
					case 4: return function(accumulator, value, index, collection) {
						return func.call(thisArg, accumulator, value, index, collection);
					};
					case 5: return function(value, other, key, object, source) {
						return func.call(thisArg, value, other, key, object, source);
					};
				}
				return function() {
					return func.apply(thisArg, arguments);
				};
			}
			if (func == null) {
				return identity;
			}
			return type == 'object' ? matches(func) : property(func);
		}
		function baseClone(value, isDeep, customizer, stackA, stackB) {
			var result = customizer ? customizer(value) : undefined;
			if (typeof result != 'undefined') {
				return result;
			}
			var isArr = isArray(value);
			result = value;
			if (isArr) {
				result = initArrayClone(value, isDeep);
			} else if (isObject(value)) {
				result = initObjectClone(value, isDeep);
				value = (isDeep && toString.call(result) == objectClass) ? value : result;
			}
			if (!isDeep || result === value) {
				return result;
			}
			stackA || (stackA = []);
			stackB || (stackB = []);
			var length = stackA.length;
			while (length--) {
				if (stackA[length] == value) {
					return stackB[length];
				}
			}
			stackA.push(value);
			stackB.push(result);
			(isArr ? arrayEach : baseForOwn)(value, function(valValue, key) {
				var valClone = customizer ? customizer(valValue, key) : undefined;
				result[key] = typeof valClone == 'undefined'? baseClone(valValue, isDeep, null, stackA, stackB) : valClone;
			});
			return result;
		}
		function baseCreate(prototype) {
			return isObject(prototype) ? nativeCreate(prototype) : {};
		}
		if (!nativeCreate) {
			baseCreate = (function() {
				function Object() {}
				return function(prototype) {
					if (isObject(prototype)) {
						Object.prototype = prototype;
						var result = new Object;
						Object.prototype = null;
					}
					return result || context.Object();
				};
			}());
		}
		function baseCurry(func, bitmask, arity) {
			if (typeof arity != 'number') {
				arity = arity == null ? (func ? func.length : 0) : nativeMax(+arity || 0, 0);
			}
			return createWrapper(func, bitmask, arity);
		}
		function baseDifference(array, values) {
			var length = array ? array.length : 0;
			if (!length) {
				return [];
			}
			var index = -1, indexOf = getIndexOf(), prereq = indexOf == baseIndexOf, isLarge = prereq && createCache && values && values.length >= 200, isCommon = prereq && !isLarge, result = [], valuesLength = values ? values.length : 0;
			if (isLarge) {
				indexOf = cacheIndexOf;
				values = createCache(values);
			}
			outer:
			while (++index < length) {
				var value = array[index];
				if (isCommon && value === value) {
					var valuesIndex = valuesLength;
					while (valuesIndex--) {
						if (values[valuesIndex] === value) {
							continue outer;
						}
					}
					result.push(value);
				}
				else if (indexOf(values, value) < 0) {
					result.push(value);
				}
			}
			return result;
		}
		function baseEach(collection, iteratee) {
			var length = collection ? collection.length : 0;
			if (!(typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER)) {
				return baseForOwn(collection, iteratee);
			}
			var index = -1, iterable = toIterable(collection);
			while (++index < length) {
				if (iteratee(iterable[index], index, iterable) === false) {
					break;
				}
			}
			return collection;
		}
		function baseEachRight(collection, iteratee) {
			var length = collection ? collection.length : 0;
			if (!(typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER)) {
				return baseForOwnRight(collection, iteratee);
			}
			var iterable = toIterable(collection);
			while (length--) {
				if (iteratee(iterable[length], length, iterable) === false) {
					break;
				}
			}
			return collection;
		}
		function baseEvery(collection, predicate) {
			var result = true;
			baseEach(collection, function(value, index, collection) {
				result = !!predicate(value, index, collection);
				return result;
			});
			return result;
		}
		function baseFilter(collection, predicate) {
			var result = [];
			baseEach(collection, function(value, index, collection) {
				if (predicate(value, index, collection)) {
					result.push(value);
				}
			});
			return result;
		}
		function baseFind(collection, predicate, eachFunc, retKey) {
			var result;
			eachFunc(collection, function(value, key, collection) {
				if (predicate(value, key, collection)) {
					result = retKey ? key : value;
					return false;
				}
			});
			return result;
		}
		function baseFlatten(array, isDeep, isStrict, fromIndex) {
			var index = (fromIndex || 0) - 1, length = array.length, resIndex = -1, result = [];
			while (++index < length) {
				var value = array[index];
				if (value && typeof value == 'object' && typeof value.length == 'number'
						&& (isArray(value) || isArguments(value))) {
					if (isDeep) {
						value = baseFlatten(value, isDeep, isStrict);
					}
					var valIndex = -1, valLength = value.length;
					result.length += valLength;
					while (++valIndex < valLength) {
						result[++resIndex] = value[valIndex];
					}
				} else if (!isStrict) {
					result[++resIndex] = value;
				}
			}
			return result;
		}
		function baseFor(object, iteratee, keysFunc) {
			var index = -1, props = keysFunc(object), length = props.length;
			while (++index < length) {
				var key = props[index];
				if (iteratee(object[key], key, object) === false) {
					break;
				}
			}
			return object;
		}
		function baseForRight(object, iteratee, keysFunc) {
			var props = keysFunc(object), length = props.length;
			while (length--) {
				var key = props[length];
				if (iteratee(object[key], key, object) === false) {
					break;
				}
			}
			return object;
		}
		function baseForIn(object, iteratee) {
			return baseFor(object, iteratee, keysIn);
		}
		function baseForOwn(object, iteratee) {
			return baseFor(object, iteratee, keys);
		}
		function baseForOwnRight(object, iteratee) {
			return baseForRight(object, iteratee, keys);
		}
		function baseFunctions(object, props) {
			var index = -1, length = props.length, resIndex = -1, result = [];
			while (++index < length) {
				var key = props[index];
				if (isFunction(object[key])) {
					result[++resIndex] = key;
				}
			}
			return result;
		}
		function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
			var result = customizer && !stackA ? customizer(value, other) : undefined;
			if (typeof result != 'undefined') {
				return !!result;
			}
			if (value === other) {
				return value !== 0 || (1 / value == 1 / other);
			}
			var valType = typeof value, othType = typeof other;
			if (!(valType == 'number' && othType == 'number') && (value == null || other == null || (valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object'))) {
				return false;
			}
			var valClass = toString.call(value), valIsArg = valClass == argsClass, othClass = toString.call(other), othIsArg = othClass == argsClass;
			if (valIsArg) {
				valClass = objectClass;
			}
			if (othIsArg) {
				othClass = objectClass;
			}
			var valIsArr = arrayLikeClasses[valClass], valIsErr = valClass == errorClass, valIsObj = valClass == objectClass && !isHostObject(value), othIsObj = othClass == objectClass && !isHostObject(other);
			var isSameClass = valClass == othClass;
			if (isSameClass && valIsArr) {
				var valLength = value.length, othLength = other.length;
				if (valLength != othLength && !(isWhere && othLength > valLength)) {
					return false;
				}
			}
			else {
				var valWrapped = valIsObj && hasOwnProperty.call(value, '__wrapped__'), othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
				if (valWrapped || othWrapped) {
					return baseIsEqual(valWrapped ? value.__wrapped__ : value, othWrapped ? other.__wrapped__ : other, customizer, isWhere, stackA, stackB);
				}
				if (!isSameClass) {
					return false;
				}
				if (valIsErr || valIsObj) {
					if (!support.argsClass) {
						valIsArg = isArguments(value);
						othIsArg = isArguments(other);
					}
					var valCtor = valIsArg ? Object : value.constructor, othCtor = othIsArg ? Object : other.constructor;
					if (valIsErr) {
						if (valCtor.prototype.name != othCtor.prototype.name) {
							return false;
						}
					}
					else {
						var valHasCtor = !valIsArg && hasOwnProperty.call(value, 'constructor'), othHasCtor = !othIsArg && hasOwnProperty.call(other, 'constructor');
						if (valHasCtor != othHasCtor) {
							return false;
						}
						if (!valHasCtor) {
							if (valCtor != othCtor && !(isFunction(valCtor) && valCtor instanceof valCtor && isFunction(othCtor) && othCtor instanceof othCtor) && ('constructor' in value && 'constructor' in other)
									) {
								return false;
							}
						}
					}
					var valProps = valIsErr ? ['message', 'name'] : keys(value), othProps = valIsErr ? valProps : keys(other);
					if (valIsArg) {
						valProps.push('length');
					}
					if (othIsArg) {
						othProps.push('length');
					}
					valLength = valProps.length;
					othLength = othProps.length;
					if (valLength != othLength && !isWhere) {
						return false;
					}
				}
				else {
					switch (valClass) {
						case boolClass:
						case dateClass:
							return +value == +other;
						case numberClass:
							return (value != +value) ? other != +other : (value == 0 ? ((1 / value) == (1 / other)) : value == +other);
						case regexpClass:
						case stringClass:
							return value == String(other);
					}
					return false;
				}
			}
			stackA || (stackA = []);
			stackB || (stackB = []);
			var index = stackA.length;
			while (index--) {
				if (stackA[index] == value) {
					return stackB[index] == other;
				}
			}
			stackA.push(value);
			stackB.push(other);
			result = true;
			if (valIsArr) {
				while (result && ++index < valLength) {
					var valValue = value[index];
					if (isWhere) {
						var othIndex = othLength;
						while (othIndex--) {
							result = baseIsEqual(valValue, other[othIndex], customizer, isWhere, stackA, stackB);
							if (result) {
								break;
							}
						}
					} else {
						var othValue = other[index];
						result = customizer ? customizer(valValue, othValue, index) : undefined;
						if (typeof result == 'undefined') {
							result = baseIsEqual(valValue, othValue, customizer, isWhere, stackA, stackB);
						}
					}
				}
			}
			else {
				while (result && ++index < valLength) {
					var key = valProps[index];
					result = valIsErr || hasOwnProperty.call(other, key);
					if (result) {
						valValue = value[key];
						othValue = other[key];
						result = customizer ? customizer(valValue, othValue, key) : undefined;
						if (typeof result == 'undefined') {
							result = baseIsEqual(valValue, othValue, customizer, isWhere, stackA, stackB);
						}
					}
				}
			}
			stackA.pop();
			stackB.pop();
			return !!result;
		}
		function baseInvoke(collection, methodName, args) {
			var index = -1, isFunc = typeof methodName == 'function', length = collection ? collection.length : 0, result = [];
			if (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) {
				result.length = length;
			}
			baseEach(collection, function(value) {
				var func = isFunc ? methodName : (value != null && value[methodName]);
				result[++index] = func ? func.apply(value, args) : undefined;
			});
			return result;
		}
		function baseMap(collection, iteratee) {
			var result = [];
			baseEach(collection, function(value, key, collection) {
				result.push(iteratee(value, key, collection));
			});
			return result;
		}
		function baseMerge(object, source, customizer, stackA, stackB) {
			var isSrcArr = isArrayLike(source);
			(isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
				var isArr = srcValue && isArrayLike(srcValue), isObj = srcValue && isPlainObject(srcValue), value = object[key];
				if (!(isArr || isObj)) {
					result = customizer ? customizer(value, srcValue, key, object, source) : undefined;
					if (typeof result == 'undefined') {
						result = srcValue;
					}
					if (isSrcArr || typeof result != 'undefined') {
						object[key] = result;
					}
					return;
				}
				stackA || (stackA = []);
				stackB || (stackB = []);
				var length = stackA.length;
				while (length--) {
					if (stackA[length] == srcValue) {
						object[key] = stackB[length];
						return;
					}
				}
				var result = customizer ? customizer(value, srcValue, key, object, source) : undefined, isDeep = typeof result == 'undefined';
				if (isDeep) {
					result = isArr ? (isArray(value) ? value : []) : (isPlainObject(value) ? value : {});
				}
				stackA.push(srcValue);
				stackB.push(result);
				if (isDeep) {
					baseMerge(result, srcValue, customizer, stackA, stackB);
				}
				object[key] = result;
			});
			return object;
		}
		function basePartial(func, bitmask, args, holders, thisArg) {
			if (func) {
				var data = getData(func), arity = data ? data[2] : func.length;
				arity = nativeMax(arity - args.length, 0);
			}
			return (bitmask & PARTIAL_FLAG) ? createWrapper(func, bitmask, arity, thisArg, args, holders) : createWrapper(func, bitmask, arity, thisArg, null, null, args, holders);
		}
		function basePullAt(array, indexes) {
			var length = indexes.length, result = baseAt(array, indexes);
			indexes.sort(baseCompareAscending);
			while (length--) {
				var index = parseFloat(indexes[length]);
				if (index != previous && index > -1 && index % 1 == 0) {
					var previous = index;
					splice.call(array, index, 1);
				}
			}
			return result;
		}
		function baseRandom(min, max) {
			return min + floor(nativeRandom() * (max - min + 1));
		}
		function baseReduce(collection, iteratee, accumulator, initFromCollection, eachFunc) {
			eachFunc(collection, function(value, index, collection) {
				accumulator = initFromCollection ? (initFromCollection = false, value) : iteratee(accumulator, value, index, collection)
			});
			return accumulator;
		}
		var baseSetData = !metaMap ? identity : function(func, data) {
			metaMap.set(func, data);
			return func;
		};
		function baseSome(collection, predicate) {
			var result;
			baseEach(collection, function(value, index, collection) {
				result = predicate(value, index, collection);
				return !result;
			});
			return !!result;
		}
		function baseSortedIndex(array, value, iteratee, retHighest) {
			var low = 0, high = array ? array.length : low;
			value = iteratee(value);
			var hintNum = typeof value == 'number' || (value != null && isFunction(value.valueOf) && typeof value.valueOf() == 'number');
			while (low < high) {
				var mid = (low + high) >>> 1, computed = iteratee(array[mid]), setLow = retHighest ? (computed <= value) : (computed < value);
				if (hintNum && typeof computed != 'undefined') {
					computed = +computed;
					setLow = computed != computed || setLow;
				}
				if (setLow) {
					low = mid + 1;
				} else {
					high = mid;
				}
			}
			return high;
		}
		function baseUniq(array, iteratee) {
			var index = -1, indexOf = getIndexOf(), length = array.length, prereq = indexOf == baseIndexOf, isLarge = prereq && createCache && length >= 200, isCommon = prereq && !isLarge, result = [];
			if (isLarge) {
				var seen = createCache();
				indexOf = cacheIndexOf;
			} else {
				seen = iteratee ? [] : result;
			}
			outer:
			while (++index < length) {
				var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
				if (isCommon && value === value) {
					var seenIndex = seen.length;
					while (seenIndex--) {
						if (seen[seenIndex] === computed) {
							continue outer;
						}
					}
					if (iteratee) {
						seen.push(computed);
					}
					result.push(value);
				}
				else if (indexOf(seen, computed) < 0) {
					if (iteratee || isLarge) {
						seen.push(computed);
					}
					result.push(value);
				}
			}
			return result;
		}
		function baseValues(object, keysFunc) {
			var index = -1, props = keysFunc(object), length = props.length, result = Array(length);
			while (++index < length) {
				result[index] = object[props[index]];
			}
			return result;
		}
		function bufferClone(buffer) {
			return bufferSlice.call(buffer, 0);
		}
		if (!bufferSlice) {
			bufferClone = !(ArrayBuffer && Uint8Array) ? identity : function(buffer) {
				var byteLength = buffer.byteLength, floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0, offset = floatLength * FLOAT64_BYTES_PER_ELEMENT, result = new ArrayBuffer(byteLength);
				if (floatLength) {
					var view = new Float64Array(result, 0, floatLength);
					view.set(new Float64Array(buffer, 0, floatLength));
				}
				if (byteLength != offset) {
					view = new Uint8Array(result, offset);
					view.set(new Uint8Array(buffer, offset));
				}
				return result;
			};
		}
		function composeArgs(partialArgs, partialHolders, args) {
			var holdersLength = partialHolders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), leftIndex = -1, leftLength = partialArgs.length, result = Array(argsLength + leftLength);
			while (++leftIndex < leftLength) {
				result[leftIndex] = partialArgs[leftIndex];
			}
			while (++argsIndex < holdersLength) {
				result[partialHolders[argsIndex]] = args[argsIndex];
			}
			while (argsLength--) {
				result[leftIndex++] = args[argsIndex++];
			}
			return result;
		}
		function composeArgsRight(partialRightArgs, partialRightHolders, args) {
			var holdersIndex = -1, holdersLength = partialRightHolders.length, argsIndex = -1, argsLength = nativeMax(args.length - holdersLength, 0), rightIndex = -1, rightLength = partialRightArgs.length, result = Array(argsLength + rightLength);
			while (++argsIndex < argsLength) {
				result[argsIndex] = args[argsIndex];
			}
			var pad = argsIndex;
			while (++rightIndex < rightLength) {
				result[pad + rightIndex] = partialRightArgs[rightIndex];
			}
			while (++holdersIndex < holdersLength) {
				result[pad + partialRightHolders[holdersIndex]] = args[argsIndex++];
			}
			return result;
		}
		function createAggregator(setter, initializer) {
			return function(collection, iteratee, thisArg) {
				var result = initializer ? initializer() : {};
				iteratee = getCallback(iteratee, thisArg, 3);
				if (isArray(collection)) {
					var index = -1, length = collection.length;
					while (++index < length) {
						var value = collection[index];
						setter(result, value, iteratee(value, index, collection), collection);
					}
				} else {
					baseEach(collection, function(value, key, collection) {
						setter(result, value, iteratee(value, key, collection), collection);
					});
				}
				return result;
			};
		}
		function createAssigner(assigner) {
			return function() {
				var length = arguments.length, object = arguments[0];
				if (object == null || length < 2) {
					return object;
				}
				var type = typeof arguments[2];
				if ((type == 'number' || type == 'string') && arguments[3] && arguments[3][arguments[2]] === arguments[1]) {
					length = 2;
				}
				if (length > 3 && typeof arguments[length - 2] == 'function') {
					var customizer = baseCallback(arguments[--length - 1], arguments[length--], 5);
				} else if (length > 2 && typeof arguments[length - 1] == 'function') {
					customizer = arguments[--length];
				}
				var index = 0;
				while (++index < length) {
					assigner(object, arguments[index], customizer);
				}
				return object;
			};
		}
		function createBindWrapper(func, thisArg) {
			var Ctor = createCtorWrapper(func);
			function wrapper() {
				return (this instanceof wrapper ? Ctor : func).apply(thisArg, arguments);
			}
			return wrapper;
		}
		var createCache = Set && function(array) {
			var cache = new Set, length = array ? array.length : 0;
			cache.push = cache.add;
			while (length--) {
				cache.push(array[length]);
			}
			return cache;
		};
		function createCtorWrapper(Ctor) {
			return function() {
				var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, arguments);
				return isObject(result) ? result : thisBinding;
			};
		}
		function createHybridWrapper(func, bitmask, arity, thisArg, partialArgs, partialHolders, partialRightArgs, partialRightHolders) {
			var isBind = bitmask & BIND_FLAG, isBindKey = bitmask & BIND_KEY_FLAG, isCurry = bitmask & CURRY_FLAG, isCurryRight = bitmask & CURRY_RIGHT_FLAG, isCurryBound = bitmask & CURRY_BOUND_FLAG;
				var Ctor = !isBindKey && createCtorWrapper(func), key = func;
			function wrapper() {
				var length = arguments.length, index = length, args = Array(length);
				while (index--) {
					args[index] = arguments[index];
				}
				if (partialArgs) {
					args = composeArgs(partialArgs, partialHolders, args);
				}
				if (partialRightArgs) {
					args = composeArgsRight(partialRightArgs, partialRightHolders, args);
				}
				if (isCurry || isCurryRight) {
					var placeholder = wrapper.placeholder, holders = replaceHolders(args, placeholder);
					length -= holders.length;
					if (length < arity) {
						var newArity = nativeMax(arity - length, 0), newPartialArgs = isCurry ? args : null, newPartialHolders = isCurry ? holders : null, newPartialRightArgs = isCurry ? null : args, newPartialRightHolders = isCurry ? null : holders;
						bitmask |= (isCurry ? PARTIAL_FLAG : PARTIAL_RIGHT_FLAG);
						bitmask &= ~(isCurry ? PARTIAL_RIGHT_FLAG : PARTIAL_FLAG);
						if (!isCurryBound) {
							bitmask &= ~(BIND_FLAG | BIND_KEY_FLAG);
						}
						var result = createHybridWrapper(func, bitmask, newArity, thisArg, newPartialArgs, newPartialHolders, newPartialRightArgs, newPartialRightHolders);
						result.placeholder = placeholder;
						return setData(result, [func, bitmask, newArity, thisArg, newPartialArgs, newPartialHolders, newPartialRightArgs, newPartialRightHolders]);
					}
				}
				var thisBinding = isBind ? thisArg : this;
				if (isBindKey) {
					func = thisBinding[key];
				}
				return (this instanceof wrapper ? (Ctor || createCtorWrapper(func)) : func).apply(thisBinding, args);
			}
			return wrapper;
		}
		function createPad(string, length, chars) {
			var strLength = string.length;
			length = +length;
			if (strLength >= length || !nativeIsFinite(length)) {
				return '';
			}
			var padLength = length - strLength;
			chars = chars == null ? ' ' : String(chars);
			return repeat(chars, ceil(padLength / chars.length)).slice(0, padLength);
		}
		function createPartialWrapper(func, bitmask, partialArgs, thisArg) {
			var isBind = bitmask & BIND_FLAG, Ctor = createCtorWrapper(func);
			function wrapper() {
				var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partialArgs.length, args = Array(argsLength + leftLength);
				while (++leftIndex < leftLength) {
					args[leftIndex] = partialArgs[leftIndex];
				}
				while (argsLength--) {
					args[leftIndex++] = arguments[++argsIndex];
				}
				return (this instanceof wrapper ? Ctor : func).apply(isBind ? thisArg : this, args);
			}
			return wrapper;
		}
		function createWrapper(func, bitmask, arity, thisArg, partialArgs, partialHolders, partialRightArgs, partialRightHolders) {
			var isBindKey = bitmask & BIND_KEY_FLAG;
			if (!isBindKey && !isFunction(func)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			var isPartial = bitmask & PARTIAL_FLAG;
			if (isPartial && !partialArgs.length) {
				bitmask &= ~PARTIAL_FLAG;
				isPartial = false;
				partialArgs = partialHolders = null;
			}
			var isPartialRight = bitmask & PARTIAL_RIGHT_FLAG;
			if (isPartialRight && !partialRightArgs.length) {
				bitmask &= ~PARTIAL_RIGHT_FLAG;
				isPartialRight = false;
				partialRightArgs = partialRightHolders = null;
			}
			var data = (data = !isBindKey && getData(func)) && data !== true && data;
			if (data) {
				var funcBitmask = data[1], funcIsBind = funcBitmask & BIND_FLAG, isBind = bitmask & BIND_FLAG;
				func = data[0];
				bitmask |= funcBitmask;
				if (arity == null) {
					arity = data[2];
				}
				if (funcIsBind) {
					thisArg = data[3];
				}
				if (!isBind && funcIsBind) {
					bitmask |= CURRY_BOUND_FLAG;
				}
				var funcArgs = data[4];
				if (funcArgs) {
					var funcHolders = data[5];
					partialArgs = isPartial ? composeArgs(funcArgs, funcHolders, partialArgs) : baseSlice(funcArgs);
					partialHolders = isPartial ? replaceHolders(partialArgs, PLACEHOLDER) : baseSlice(funcHolders);
				}
				funcArgs = data[6];
				if (funcArgs) {
					funcHolders = data[7];
					partialRightArgs = isPartialRight ? composeArgsRight(funcArgs, funcHolders, partialRightArgs) : baseSlice(funcArgs);
					partialRightHolders = isPartialRight ? replaceHolders(partialRightArgs, PLACEHOLDER) : baseSlice(funcHolders);
				}
			}
			if (arity == null) {
				arity = isBindKey ? 0 : func.length;
			}
			if (bitmask == BIND_FLAG) {
				var result = createBindWrapper(func, thisArg);
			} else if ((bitmask == PARTIAL_FLAG || bitmask == (BIND_FLAG | PARTIAL_FLAG)) && !partialHolders.length) {
				result = createPartialWrapper(func, bitmask, partialArgs, thisArg);
			} else {
				result = createHybridWrapper(func, bitmask, arity, thisArg, partialArgs, partialHolders, partialRightArgs, partialRightHolders);
			}
			var setter = data ? baseSetData : setData;
			return setter(result, [func, bitmask, arity, thisArg, partialArgs, partialHolders, partialRightArgs, partialRightHolders]);
		}
		function getCallback(func, thisArg, argCount) {
			var result = lodash.callback || callback;
			result = result === callback ? baseCallback : result;
			return argCount ? result(func, thisArg, argCount) : result;
		}
		var getData = !metaMap ? noop : function(func) {
			return metaMap.get(func);
		};
		function getIndexOf(collection, target, fromIndex) {
			var result = lodash.indexOf || indexOf;
			result = result === indexOf ? baseIndexOf : result;
			return collection ? result(collection, target, fromIndex) : result;
		}
		function initArrayClone(array, isDeep) {
			var index = -1, length = array.length, result = array.constructor(length);
			if (!isDeep) {
				while (++index < length) {
					result[index] = array[index];
				}
			}
			if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
				result.index = array.index;
				result.input = array.input;
			}
			return result;
		}
		function initObjectClone(object, isDeep) {
			var className = toString.call(object);
			if (!cloneableClasses[className] || isHostObject(object)) {
				return object;
			}
			var Ctor = object.constructor, isArgs = className == argsClass || (!support.argsClass && isArguments(object)), isObj = className == objectClass;
			if (isObj && !(isFunction(Ctor) && (Ctor instanceof Ctor))) {
				Ctor = Object;
			}
			if (isArgs || isObj) {
				var result = isDeep ? new Ctor : baseAssign(new Ctor, object);
				if (isArgs) {
					result.length = object.length;
				}
				return result;
			}
			switch (className) {
				case arrayBufferClass:
					return bufferClone(object);
				case boolClass:
				case dateClass:
					return new Ctor(+object);
				case float32Class: case float64Class:
				case int8Class: case int16Class: case int32Class:
				case uint8Class: case uint8ClampedClass: case uint16Class: case uint32Class:
					if (Ctor instanceof Ctor) {
						Ctor = ctorByClass[className];
					}
					var buffer = object.buffer;
					return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);
				case numberClass:
				case stringClass:
					return new Ctor(object);
				case regexpClass:
					result = Ctor(object.source, reFlags.exec(object));
					result.lastIndex = object.lastIndex;
			}
			return result;
		}
		function isArrayLike(value) {
			return (value && typeof value == 'object' && typeof value.length == 'number' && arrayLikeClasses[toString.call(value)]) || false;
		}
		function isStrictComparable(value) {
			return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
		}
		function pickByArray(object, props) {
			var index = -1, length = props.length, result = {};
			while (++index < length) {
				var key = props[index];
				if (key in object) {
					result[key] = object[key];
				}
			}
			return result;
		}
		function pickByCallback(object, predicate) {
			var result = {};
			baseForIn(object, function(value, key, object) {
				if (predicate(value, key, object)) {
					result[key] = value;
				}
			});
			return result;
		}
		function replaceHolders(array, placeholder) {
			var index = -1, length = array.length, resIndex = -1, result = [];
			while (++index < length) {
				if (array[index] === placeholder) {
					array[index] = PLACEHOLDER;
					result[++resIndex] = index;
				}
			}
			return result;
		}
		var setData = (function() {
			var count = 0, lastCalled = 0;
			return function(key, value) {
				var stamp = now ? now() : 0, remaining = HOT_SPAN - (stamp - lastCalled);
				lastCalled = stamp;
				if (remaining > 0) {
					if (++count >= HOT_COUNT) {
						return key;
					}
				} else {
					count = 0;
				}
				return baseSetData(key, value);
			};
		}());
		function shimIsPlainObject(value) {
			var Ctor, result;
			if (!(value && typeof value == 'object' && toString.call(value) == objectClass && !isHostObject(value)) || (!hasOwnProperty.call(value, 'constructor') && (Ctor = value.constructor, isFunction(Ctor) && !(Ctor instanceof Ctor))) || (!support.argsClass && isArguments(value))) {
				return false;
			}
			if (support.ownLast) {
				baseForIn(value, function(value, key, object) {
					result = hasOwnProperty.call(object, key);
					return false;
				});
				return result !== false;
			}
			baseForIn(value, function(value, key) {
				result = key;
			});
			return typeof result == 'undefined' || hasOwnProperty.call(value, result);
		}
		function shimKeys(object) {
			var keyIndex, index = -1, props = keysIn(object), length = props.length, objLength = length && object.length, maxIndex = objLength - 1, result = [];
			var allowIndexes = typeof objLength == 'number' && objLength > 0 && (isArray(object) || (support.nonEnumArgs && isArguments(object)) || (support.nonEnumStrings && isString(object)));
			while (++index < length) {
				var key = props[index];
				if ((allowIndexes && (keyIndex = +key, keyIndex > -1 && keyIndex <= maxIndex && keyIndex % 1 == 0)) || hasOwnProperty.call(object, key)) {
					result.push(key);
				}
			}
			return result;
		}
		function sortedUniq(array, iteratee) {
			var seen, index = -1, length = array.length, resIndex = -1, result = [];
			while (++index < length) {
				var value = array[index], computed = iteratee ? iteratee(value, index, array) : value;
				if (!index || seen !== computed) {
					seen = computed;
					result[++resIndex] = value;
				}
			}
			return result;
		}
		function toIterable(value) {
			if (value == null) {
				return [];
			}
			var length = value.length;
			if (!(typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER)) {
				return values(value);
			}
			value = toObject(value);
			if (support.unindexedChars && isString(value)) {
				var index = -1;
				while (++index < length) {
					value[index] = value.charAt(index);
				}
			}
			return value;
		}
		function toObject(value) {
			return isObject(value) ? value : Object(value);
		}
		function chunk(array, size) {
			var index = 0, length = array ? array.length : 0, resIndex = -1, result = [];
			size = typeof size == 'undefined' ? 1 : nativeMax(+size || 1, 1);
			while (index < length) {
				result[++resIndex] = slice(array, index, (index += size));
			}
			return result;
		}
		function compact(array) {
			var index = -1, length = array ? array.length : 0, resIndex = -1, result = [];
			while (++index < length) {
				var value = array[index];
				if (value) {
					result[++resIndex] = value;
				}
			}
			return result;
		}
		function difference() {
			var index = -1, length = arguments.length;
			while (++index < length) {
				var value = arguments[index];
				if (isArray(value) || isArguments(value)) {
					break;
				}
			}
			return baseDifference(arguments[index], baseFlatten(arguments, false, true, ++index));
		}
		function drop(array, n, guard) {
			n = (n == null || guard) ? 1 : n;
			return slice(array, n < 0 ? 0 : n);
		}
		function dropRight(array, n, guard) {
			var length = array ? array.length : 0;
			n = (n == null || guard) ? 1 : n;
			n = length - (n || 0);
			return slice(array, 0, n < 0 ? 0 : n);
		}
		function dropRightWhile(array, predicate, thisArg) {
			var length = array ? array.length : 0, index = length;
			predicate = getCallback(predicate, thisArg, 3);
			while (index-- && predicate(array[index], index, array)) {}
			return slice(array, 0, index + 1);
		}
		function dropWhile(array, predicate, thisArg) {
			var index = -1, length = array ? array.length : 0;
			predicate = getCallback(predicate, thisArg, 3);
			while (++index < length && predicate(array[index], index, array)) {}
			return slice(array, index);
		}
		function findIndex(array, predicate, thisArg) {
			var index = -1, length = array ? array.length : 0;
			predicate = getCallback(predicate, thisArg, 3);
			while (++index < length) {
				if (predicate(array[index], index, array)) {
					return index;
				}
			}
			return -1;
		}
		function findLastIndex(array, predicate, thisArg) {
			var length = array ? array.length : 0;
			predicate = getCallback(predicate, thisArg, 3);
			while (length--) {
				if (predicate(array[length], length, array)) {
					return length;
				}
			}
			return -1;
		}
		function first(array) {
			return array ? array[0] : undefined;
		}
		function flatten(array, isDeep, guard) {
			var length = array ? array.length : 0;
			if (!length) {
				return [];
			}
			var type = typeof isDeep;
			if ((type == 'number' || type == 'string') && guard && guard[isDeep] === array) {
				isDeep = false;
			}
			return baseFlatten(array, isDeep);
		}
		function flattenDeep(array) {
			var length = array ? array.length : 0;
			return length ? baseFlatten(array, true) : [];
		}
		function indexOf(array, value, fromIndex) {
			var length = array ? array.length : 0;
			if (typeof fromIndex == 'number') {
				fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
			} else if (fromIndex) {
				var index = sortedIndex(array, value);
				return (length && array[index] === value) ? index : -1;
			}
			return baseIndexOf(array, value, fromIndex);
		}
		function initial(array) {
			var length = array ? array.length : 0;
			return slice(array, 0, length ? length - 1 : 0);
		}
		function intersection() {
			var args = [], argsIndex = -1, argsLength = arguments.length, caches = [], indexOf = getIndexOf(), prereq = createCache && indexOf == baseIndexOf;
			while (++argsIndex < argsLength) {
				var value = arguments[argsIndex];
				if (isArray(value) || isArguments(value)) {
					args.push(value);
					caches.push(prereq && value.length >= 120 && createCache(argsIndex && value));
				}
			}
			argsLength = args.length;
			var array = args[0], index = -1, length = array ? array.length : 0, result = [], seen = caches[0];
			outer:
			while (++index < length) {
				value = array[index];
				if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value)) < 0) {
					argsIndex = argsLength;
					while (--argsIndex) {
						var cache = caches[argsIndex];
						if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
							continue outer;
						}
					}
					if (seen) {
						seen.push(value);
					}
					result.push(value);
				}
			}
			return result;
		}
		function last(array) {
			var length = array ? array.length : 0;
			return length ? array[length - 1] : undefined;
		}
		function lastIndexOf(array, value, fromIndex) {
			var length = array ? array.length : 0, index = length;
			if (typeof fromIndex == 'number') {
				index = (fromIndex < 0 ? nativeMax(index + fromIndex, 0) : nativeMin(fromIndex || 0, index - 1)) + 1;
			} else if (fromIndex) {
				index = sortedLastIndex(array, value) - 1;
				return (length && array[index] === value) ? index : -1;
			}
			var isReflexive = value === value;
			while (index--) {
				var other = array[index];
				if ((isReflexive ? other === value : other !== other)) {
					return index;
				}
			}
			return -1;
		}
		function pull() {
			var array = arguments[0], index = 0, indexOf = getIndexOf(), length = arguments.length;
			while (++index < length) {
				var fromIndex = 0, value = arguments[index];
				while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
					splice.call(array, fromIndex, 1);
				}
			}
			return array;
		}
		function pullAt(array) {
			return basePullAt(array, baseFlatten(arguments, false, false, 1));
		}
		function remove(array, predicate, thisArg) {
			var index = -1, length = array ? array.length : 0, result = [];
			predicate = getCallback(predicate, thisArg, 3);
			while (++index < length) {
				var value = array[index];
				if (predicate(value, index, array)) {
					result.push(value);
					splice.call(array, index--, 1);
					length--;
				}
			}
			return result;
		}
		function rest(array) {
			return slice(array, 1);
		}
		function slice(array, start, end) {
			var index = -1, length = array ? array.length : 0;
			start = start == null ? 0 : (+start || 0);
			if (start < 0) {
				start = -start > length ? 0 : (length + start);
			}
			end = (typeof end == 'undefined' || end > length) ? length : (+end || 0);
			if (end < 0) {
				end += length;
			}
			if (end && end == length && !start) {
				return baseSlice(array);
			}
			length = start > end ? 0 : (end - start);
			var result = Array(length);
			while (++index < length) {
				result[index] = array[index + start];
			}
			return result;
		}
		function sortedIndex(array, value, iteratee, thisArg) {
			iteratee = iteratee == null ? identity : getCallback(iteratee, thisArg, 1);
			return baseSortedIndex(array, value, iteratee);
		}
		function sortedLastIndex(array, value, iteratee, thisArg) {
			iteratee = iteratee == null ? identity : getCallback(iteratee, thisArg, 1);
			return baseSortedIndex(array, value, iteratee, true);
		}
		function take(array, n, guard) {
			n = (n == null || guard) ? 1 : n;
			return slice(array, 0, n < 0 ? 0 : n);
		}
		function takeRight(array, n, guard) {
			var length = array ? array.length : 0;
			n = (n == null || guard) ? 1 : n;
			n = length - (n || 0);
			return slice(array, n < 0 ? 0 : n);
		}
		function takeRightWhile(array, predicate, thisArg) {
			var length = array ? array.length : 0, index = length;
			predicate = getCallback(predicate, thisArg, 3);
			while (index-- && predicate(array[index], index, array)) {}
			return slice(array, index + 1);
		}
		function takeWhile(array, predicate, thisArg) {
			var index = -1, length = array ? array.length : 0;
			predicate = getCallback(predicate, thisArg, 3);
			while (++index < length && predicate(array[index], index, array)) {}
			return slice(array, 0, index);
		}
		function union() {
			return baseUniq(baseFlatten(arguments, false, true));
		}
		function uniq(array, isSorted, iteratee, thisArg) {
			var length = array ? array.length : 0;
			if (!length) {
				return [];
			}
			var type = typeof isSorted;
			if (type != 'boolean' && isSorted != null) {
				thisArg = iteratee;
				iteratee = isSorted;
				isSorted = false;
				if ((type == 'number' || type == 'string') && thisArg && thisArg[iteratee] === array) {
					iteratee = null;
				}
			}
			if (iteratee != null) {
				iteratee = getCallback(iteratee, thisArg, 3);
			}
			return (isSorted && getIndexOf() == baseIndexOf) ? sortedUniq(array, iteratee) : baseUniq(array, iteratee);
		}
		function unzip(array) {
			var index = -1, length = isObject(length = max(array, 'length')) && length.length || 0, result = Array(length);
			while (++index < length) {
				result[index] = pluck(array, index);
			}
			return result;
		}
		function without(array) {
			return baseDifference(array, slice(arguments, 1));
		}
		function xor() {
			var index = -1, length = arguments.length;
			while (++index < length) {
				var array = arguments[index];
				if (isArray(array) || isArguments(array)) {
					var result = result ? baseDifference(result, array).concat(baseDifference(array, result)) : array;
				}
			}
			return result ? baseUniq(result) : [];
		}
		function zip() {
			var length = arguments.length, array = Array(length);
			while (length--) {
				array[length] = arguments[length];
			}
			return unzip(array);
		}
		function zipObject(props, vals) {
			var index = -1, length = props ? props.length : 0, result = {};
			if (!vals && length && !isArray(props[0])) {
				vals = [];
			}
			while (++index < length) {
				var key = props[index];
				if (vals) {
					result[key] = vals[index];
				} else if (key) {
					result[key[0]] = key[1];
				}
			}
			return result;
		}
		function chain(value) {
			var result = lodash(value);
			result.__chain__ = true;
			return result;
		}
		function tap(value, interceptor, thisArg) {
			interceptor.call(thisArg, value);
			return value;
		}
		function wrapperChain() {
			this.__chain__ = true;
			return this;
		}
		function wrapperToString() {
			return String(this.__wrapped__);
		}
		function wrapperValueOf() {
			return this.__wrapped__;
		}
		function at(collection) {
			var length = collection ? collection.length : 0;
			if (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) {
				collection = toIterable(collection);
			}
			return baseAt(collection, baseFlatten(arguments, false, false, 1));
		}
		function contains(collection, target, fromIndex) {
			var length = collection ? collection.length : 0;
			if (!(typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER)) {
				collection = values(collection);
				length = collection.length;
			}
			if (typeof fromIndex == 'number') {
				fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
			} else {
				fromIndex = 0;
			}
			return (typeof collection == 'string' || !isArray(collection) && isString(collection)) ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1) : (getIndexOf(collection, target, fromIndex) > -1);
		}
		var countBy = createAggregator(function(result, value, key) {
			hasOwnProperty.call(result, key) ? ++result[key] : (result[key] = 1);
		});
		function every(collection, predicate, thisArg) {
			var func = isArray(collection) ? arrayEvery : baseEvery;
			if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
				predicate = getCallback(predicate, thisArg, 3);
			}
			return func(collection, predicate);
		}
		function filter(collection, predicate, thisArg) {
			var func = isArray(collection) ? arrayFilter : baseFilter;
			predicate = getCallback(predicate, thisArg, 3);
			return func(collection, predicate);
		}
		function find(collection, predicate, thisArg) {
			if (isArray(collection)) {
				var index = findIndex(collection, predicate, thisArg);
				return index > -1 ? collection[index] : undefined;
			}
			predicate = getCallback(predicate, thisArg, 3);
			return baseFind(collection, predicate, baseEach);
		}
		function findLast(collection, predicate, thisArg) {
			predicate = getCallback(predicate, thisArg, 3);
			return baseFind(collection, predicate, baseEachRight);
		}
		function findWhere(collection, source) {
			return find(collection, matches(source));
		}
		function forEach(collection, iteratee, thisArg) {
			return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection)) ? arrayEach(collection, iteratee) : baseEach(collection, baseCallback(iteratee, thisArg, 3));
		}
		function forEachRight(collection, iteratee, thisArg) {
			return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection)) ? arrayEachRight(collection, iteratee) : baseEachRight(collection, baseCallback(iteratee, thisArg, 3));
		}
		var groupBy = createAggregator(function(result, value, key) {
			if (hasOwnProperty.call(result, key)) {
				result[key].push(value);
			} else {
				result[key] = [value];
			}
		});
		var indexBy = createAggregator(function(result, value, key) {
			result[key] = value;
		});
		function invoke(collection, methodName) {
			return baseInvoke(collection, methodName, slice(arguments, 2));
		}
		function map(collection, iteratee, thisArg) {
			iteratee = getCallback(iteratee, thisArg, 3);
			var func = isArray(collection) ? arrayMap : baseMap;
			return func(collection, iteratee);
		}
		function max(collection, iteratee, thisArg) {
			var computed = -Infinity, result = computed, type = typeof iteratee;
			if ((type == 'number' || type == 'string') && thisArg && thisArg[iteratee] === collection) {
				iteratee = null;
			}
			var noIteratee = iteratee == null, isArr = noIteratee && isArray(collection), isStr = !isArr && isString(collection);
			if (noIteratee && !isStr) {
				var index = -1, iterable = toIterable(collection), length = iterable.length;
				while (++index < length) {
					var value = iterable[index];
					if (value > result) {
						result = value;
					}
				}
			} else {
				iteratee = (noIteratee && isStr) ? charAtCallback : getCallback(iteratee, thisArg, 3);
				baseEach(collection, function(value, index, collection) {
					var current = iteratee(value, index, collection);
					if (current > computed || (current === -Infinity && current === result)) {
						computed = current;
						result = value;
					}
				});
			}
			return result;
		}
		function min(collection, iteratee, thisArg) {
			var computed = Infinity, result = computed, type = typeof iteratee;
			if ((type == 'number' || type == 'string') && thisArg && thisArg[iteratee] === collection) {
				iteratee = null;
			}
			var noIteratee = iteratee == null, isArr = noIteratee && isArray(collection), isStr = !isArr && isString(collection);
			if (noIteratee && !isStr) {
				var index = -1, iterable = toIterable(collection), length = iterable.length;
				while (++index < length) {
					var value = iterable[index];
					if (value < result) {
						result = value;
					}
				}
			} else {
				iteratee = (noIteratee && isStr) ? charAtCallback : getCallback(iteratee, thisArg, 3);
				baseEach(collection, function(value, index, collection) {
					var current = iteratee(value, index, collection);
					if (current < computed || (current === Infinity && current === result)) {
						computed = current;
						result = value;
					}
				});
			}
			return result;
		}
		var partition = createAggregator(function(result, value, key) {
			result[key ? 0 : 1].push(value);
		}, function() { return [[], []]; });
		function pluck(collection, key) {
			return map(collection, property(key));
		}
		function reduce(collection, iteratee, accumulator, thisArg) {
			var func = isArray(collection) ? arrayReduce : baseReduce;
			return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEach);
		}
		function reduceRight(collection, iteratee, accumulator, thisArg) {
			var func = isArray(collection) ? arrayReduceRight : baseReduce;
			return func(collection, getCallback(iteratee, thisArg, 4), accumulator, arguments.length < 3, baseEachRight);
		}
		function reject(collection, predicate, thisArg) {
			var func = isArray(collection) ? arrayFilter : baseFilter;
			predicate = getCallback(predicate, thisArg, 3);
			return func(collection, function(value, index, collection) {
				return !predicate(value, index, collection);
			});
		}
		function sample(collection, n, guard) {
			if (n == null || guard) {
				collection = toIterable(collection);
				var length = collection.length;
				return length > 0 ? collection[baseRandom(0, length - 1)] : undefined;
			}
			var result = shuffle(collection);
			result.length = nativeMin(n < 0 ? 0 : (+n || 0), result.length);
			return result;
		}
		function shuffle(collection) {
			collection = toIterable(collection);
			var index = -1, length = collection.length, result = Array(length);
			while (++index < length) {
				var rand = baseRandom(0, index);
				if (index != rand) {
					result[index] = result[rand];
				}
				result[rand] = collection[index];
			}
			return result;
		}
		function size(collection) {
			var length = collection ? collection.length : 0;
			return (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) ? length : keys(collection).length;
		}
		function some(collection, predicate, thisArg) {
			var func = isArray(collection) ? arraySome : baseSome;
			if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
				predicate = getCallback(predicate, thisArg, 3);
			}
			return func(collection, predicate);
		}
		function sortBy(collection, iteratee, thisArg) {
			var index = -1, length = collection ? collection.length : 0, multi = iteratee && isArray(iteratee), result = [];
			if (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) {
				result.length = length;
			}
			if (!multi) {
				iteratee = getCallback(iteratee, thisArg, 3);
			}
			baseEach(collection, function(value, key, collection) {
				if (multi) {
					var length = iteratee.length, criteria = Array(length);
					while (length--) {
						criteria[length] = value == null ? undefined : value[iteratee[length]];
					}
				} else {
					criteria = iteratee(value, key, collection);
				}
				result[++index] = { 'criteria': criteria, 'index': index, 'value': value };
			});
			length = result.length;
			result.sort(multi ? compareMultipleAscending : compareAscending);
			while (length--) {
				result[length] = result[length].value;
			}
			return result;
		}
		function toArray(collection) {
			var length = collection ? collection.length : 0;
			if (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) {
				return (support.unindexedChars && isString(collection)) ? collection.split('') : baseSlice(collection);
			}
			return values(collection);
		}
		function where(collection, source) {
			return filter(collection, matches(source));
		}
		function after(n, func) {
			if (!isFunction(func)) {
				if (isFunction(n)) {
					var temp = n;
					n = func;
					func = temp;
				} else {
					throw new TypeError(FUNC_ERROR_TEXT);
				}
			}
			n = nativeIsFinite(n = +n) ? n : 0;
			return function() {
				if (--n < 1) {
					return func.apply(this, arguments);
				}
			};
		}
		function before(n, func) {
			var result;
			if (!isFunction(func)) {
				if (isFunction(n)) {
					var temp = n;
					n = func;
					func = temp;
				} else {
					throw new TypeError(FUNC_ERROR_TEXT);
				}
			}
			return function() {
				if (--n > 0) {
					result = func.apply(this, arguments);
				} else {
					func = null;
				}
				return result;
			};
		}
		function bind(func, thisArg) {
			if (arguments.length < 3) {
				return createWrapper(func, BIND_FLAG, null, thisArg);
			}
			var args = slice(arguments, 2), holders = replaceHolders(args, bind.placeholder);
			return basePartial(func, BIND_FLAG | PARTIAL_FLAG, args, holders, thisArg);
		}
		function bindAll(object) {
			return baseBindAll(object,
			arguments.length > 1 ? baseFlatten(arguments, false, false, 1) : functions(object)
			);
		}
		function bindKey(object, key) {
			var bitmask = BIND_FLAG | BIND_KEY_FLAG;
			if (arguments.length > 2) {
				var args = slice(arguments, 2), holders = replaceHolders(args, bindKey.placeholder);
			}
			return args ? createWrapper(key, bitmask, null, object, args, holders) : createWrapper(key, bitmask, null, object);
		}
		function curry(func, arity) {
			var result = baseCurry(func, CURRY_FLAG, arity);
			result.placeholder = curry.placeholder;
			return result;
		}
		function curryRight(func, arity) {
			var result = baseCurry(func, CURRY_RIGHT_FLAG, arity);
			result.placeholder = curryRight.placeholder;
			return result;
		}
		function debounce(func, wait, options) {
			var args, maxTimeoutId, result, stamp, thisArg, timeoutId, trailingCall, lastCalled = 0, maxWait = false, trailing = true;
			if (!isFunction(func)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			wait = wait < 0 ? 0 : wait;
			if (options === true) {
				var leading = true;
				trailing = false;
			} else if (isObject(options)) {
				leading = options.leading;
				maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
				trailing = 'trailing' in options ? options.trailing : trailing;
			}
			function cancel() {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				if (maxTimeoutId) {
					clearTimeout(maxTimeoutId);
				}
				maxTimeoutId = timeoutId = trailingCall = undefined;
			}
			function delayed() {
				var remaining = wait - (now() - stamp);
				if (remaining <= 0 || remaining > wait) {
					if (maxTimeoutId) {
						clearTimeout(maxTimeoutId);
					}
					var isCalled = trailingCall;
					maxTimeoutId = timeoutId = trailingCall = undefined;
					if (isCalled) {
						lastCalled = now();
						result = func.apply(thisArg, args);
						if (!timeoutId && !maxTimeoutId) {
							args = thisArg = null;
						}
					}
				} else {
					timeoutId = setTimeout(delayed, remaining);
				}
			}
			function maxDelayed() {
				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				maxTimeoutId = timeoutId = trailingCall = undefined;
				if (trailing || (maxWait !== wait)) {
					lastCalled = now();
					result = func.apply(thisArg, args);
					if (!timeoutId && !maxTimeoutId) {
						args = thisArg = null;
					}
				}
			}
			function debounced() {
				args = arguments;
				stamp = now();
				thisArg = this;
				trailingCall = trailing && (timeoutId || !leading);
				if (maxWait === false) {
					var leadingCall = leading && !timeoutId;
				} else {
					if (!maxTimeoutId && !leading) {
						lastCalled = stamp;
					}
					var remaining = maxWait - (stamp - lastCalled), isCalled = remaining <= 0 || remaining > maxWait;
					if (isCalled) {
						if (maxTimeoutId) {
							maxTimeoutId = clearTimeout(maxTimeoutId);
						}
						lastCalled = stamp;
						result = func.apply(thisArg, args);
					}
					else if (!maxTimeoutId) {
						maxTimeoutId = setTimeout(maxDelayed, remaining);
					}
				}
				if (isCalled && timeoutId) {
					timeoutId = clearTimeout(timeoutId);
				}
				else if (!timeoutId && wait !== maxWait) {
					timeoutId = setTimeout(delayed, wait);
				}
				if (leadingCall) {
					isCalled = true;
					result = func.apply(thisArg, args);
				}
				if (isCalled && !timeoutId && !maxTimeoutId) {
					args = thisArg = null;
				}
				return result;
			}
			debounced.cancel = cancel;
			return debounced;
		}
		function defer(func) {
			if (!isFunction(func)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			var args = slice(arguments, 1);
			return setTimeout(function() { func.apply(undefined, args); }, 1);
		}
		function delay(func, wait) {
			if (!isFunction(func)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			var args = slice(arguments, 2);
			return setTimeout(function() { func.apply(undefined, args); }, wait);
		}
		function flow() {
			var funcs = arguments, length = funcs.length;
			if (!length) {
				return function() {};
			}
			if (!arrayEvery(funcs, isFunction)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			return function() {
				var index = 0, result = funcs[index].apply(this, arguments);
				while (++index < length) {
					result = funcs[index].call(this, result);
				}
				return result;
			};
		}
		function flowRight() {
			var funcs = arguments, fromIndex = funcs.length - 1;
			if (fromIndex < 0) {
				return function() {};
			}
			if (!arrayEvery(funcs, isFunction)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			return function() {
				var index = fromIndex, result = funcs[index].apply(this, arguments);
				while (index--) {
					result = funcs[index].call(this, result);
				}
				return result;
			};
		}
		function memoize(func, resolver) {
			if (!isFunction(func) || (resolver && !isFunction(resolver))) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			var memoized = function() {
				var key = resolver ? resolver.apply(this, arguments) : arguments[0];
				if (key == '__proto__') {
					return func.apply(this, arguments);
				}
				var cache = memoized.cache;
				return hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = func.apply(this, arguments));
			};
			memoized.cache = {};
			return memoized;
		}
		function negate(predicate) {
			if (!isFunction(predicate)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			return function() {
				return !predicate.apply(this, arguments);
			};
		}
		var once = partial(before, 2);
		function partial(func) {
			var args = slice(arguments, 1), holders = replaceHolders(args, partial.placeholder);
			return basePartial(func, PARTIAL_FLAG, args, holders);
		}
		function partialRight(func) {
			var args = slice(arguments, 1), holders = replaceHolders(args, partialRight.placeholder);
			return basePartial(func, PARTIAL_RIGHT_FLAG, args, holders);
		}
		function throttle(func, wait, options) {
			var leading = true, trailing = true;
			if (!isFunction(func)) {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			if (options === false) {
				leading = false;
			} else if (isObject(options)) {
				leading = 'leading' in options ? !!options.leading : leading;
				trailing = 'trailing' in options ? !!options.trailing : trailing;
			}
			debounceOptions.leading = leading;
			debounceOptions.maxWait = +wait;
			debounceOptions.trailing = trailing;
			return debounce(func, wait, debounceOptions);
		}
		function wrap(value, wrapper) {
			return basePartial(wrapper, PARTIAL_FLAG, [value], []);
		}
		function clone(value, isDeep, customizer, thisArg) {
			var type = typeof isDeep;
			if (type != 'boolean' && isDeep != null) {
				thisArg = customizer;
				customizer = isDeep;
				isDeep = false;
				if ((type == 'number' || type == 'string') && thisArg && thisArg[customizer] === value) {
					customizer = null;
				}
			}
			customizer = typeof customizer == 'function' && baseCallback(customizer, thisArg, 1);
			return baseClone(value, isDeep, customizer);
		}
		function cloneDeep(value, customizer, thisArg) {
			customizer = typeof customizer == 'function' && baseCallback(customizer, thisArg, 1);
			return baseClone(value, true, customizer);
		}
		function isArguments(value) {
			var length = (value && typeof value == 'object') ? value.length : undefined;
			return (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER && toString.call(value) == argsClass) || false;
		}
		if (!support.argsClass) {
			isArguments = function(value) {
				var length = (value && typeof value == 'object') ? value.length : undefined;
				return (typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER && hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee')) || false;
			};
		}
		var isArray = nativeIsArray || function(value) {
			return (value && typeof value == 'object' && typeof value.length == 'number' && toString.call(value) == arrayClass) || false;
		};
		function isBoolean(value) {
			return (value === true || value === false || value && typeof value == 'object' && toString.call(value) == boolClass) || false;
		}
		function isDate(value) {
			return (value && typeof value == 'object' && toString.call(value) == dateClass) || false;
		}
		function isElement(value) {
			return (value && typeof value == 'object' && value.nodeType === 1 && (support.nodeClass ? toString.call(value).indexOf('Element') > -1 : isHostObject(value))) || false;
		}
		if (!support.dom) {
			isElement = function(value) {
				return (value && typeof value == 'object' && value.nodeType === 1 && !isPlainObject(value)) || false;
			};
		}
		function isEmpty(value) {
			if (value == null) {
				return true;
			}
			var length = value.length;
			if ((typeof length == 'number' && length > -1 && length <= MAX_SAFE_INTEGER) && (isArray(value) || isString(value) || isArguments(value) || (typeof value == 'object' && isFunction(value.splice)))) {
				return !length;
			}
			return !keys(value).length;
		}
		function isEqual(value, other, customizer, thisArg) {
			customizer = typeof customizer == 'function' && baseCallback(customizer, thisArg, 3);
			return (!customizer && isStrictComparable(value) && isStrictComparable(other)) ? value === other : baseIsEqual(value, other, customizer);
		}
		function isError(value) {
			return (value && typeof value == 'object' && toString.call(value) == errorClass) || false;
		}
		var isFinite = nativeNumIsFinite || function(value) {
			return typeof value == 'number' && nativeIsFinite(value);
		};
		function isFunction(value) {
			return typeof value == 'function' || false;
		}
		if (isFunction(/x/)) {
			isFunction = function(value) {
				return typeof value == 'function' && toString.call(value) == funcClass;
			};
		}
		function isObject(value) {
			var type = typeof value;
			return type == 'function' || (value && type == 'object') || false;
		}
		function isNaN(value) {
			return isNumber(value) && value != +value;
		}
		function isNative(value) {
			if (isFunction(value)) {
				return reNative.test(fnToString.call(value));
			}
			return (value && typeof value == 'object' && (isHostObject(value) ? reNative : reHostCtor).test(value)) || false;
		}
		function isNull(value) {
			return value === null;
		}
		function isNumber(value) {
			var type = typeof value;
			return type == 'number' || (value && type == 'object' && toString.call(value) == numberClass) || false;
		}
		var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
			if (!(value && toString.call(value) == objectClass) || (!support.argsClass && isArguments(value))) {
				return false;
			}
			var valueOf = value.valueOf, objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);
			return objProto ? (value == objProto || getPrototypeOf(value) == objProto) : shimIsPlainObject(value);
		};
		function isRegExp(value) {
			return (isObject(value) && toString.call(value) == regexpClass) || false;
		}
		function isString(value) {
			return typeof value == 'string' || (value && typeof value == 'object' && toString.call(value) == stringClass) || false;
		}
		function isUndefined(value) {
			return typeof value == 'undefined';
		}
		var assign = createAssigner(baseAssign);
		function create(prototype, properties) {
			var result = baseCreate(prototype);
			return properties ? baseAssign(result, properties) : result;
		}
		function defaults(object) {
			if (object == null) {
				return object;
			}
			var args = baseSlice(arguments);
			args.push(assignDefaults);
			return assign.apply(undefined, args);
		}
		function findKey(object, predicate, thisArg) {
			predicate = getCallback(predicate, thisArg, 3);
			return baseFind(object, predicate, baseForOwn, true);
		}
		function findLastKey(object, predicate, thisArg) {
			predicate = getCallback(predicate, thisArg, 3);
			return baseFind(object, predicate, baseForOwnRight, true);
		}
		function forIn(object, iteratee, thisArg) {
			if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
				iteratee = baseCallback(iteratee, thisArg, 3);
			}
			return baseFor(object, iteratee, keysIn);
		}
		function forInRight(object, iteratee, thisArg) {
			iteratee = baseCallback(iteratee, thisArg, 3);
			return baseForRight(object, iteratee, keysIn);
		}
		function forOwn(object, iteratee, thisArg) {
			if (typeof iteratee != 'function' || typeof thisArg != 'undefined') {
				iteratee = baseCallback(iteratee, thisArg, 3);
			}
			return baseForOwn(object, iteratee);
		}
		function forOwnRight(object, iteratee, thisArg) {
			iteratee = baseCallback(iteratee, thisArg, 3);
			return baseForRight(object, iteratee, keys);
		}
		function functions(object) {
			return baseFunctions(object, keysIn(object));
		}
		function has(object, key) {
			return object ? hasOwnProperty.call(object, key) : false;
		}
		function invert(object, multiValue) {
			var index = -1, props = keys(object), length = props.length, result = {};
			while (++index < length) {
				var key = props[index], value = object[key];
				if (multiValue) {
					if (hasOwnProperty.call(result, value)) {
						result[value].push(key);
					} else {
						result[value] = [key];
					}
				}
				else {
					result[value] = key;
				}
			}
			return result;
		}
		var keys = !nativeKeys ? shimKeys : function(object) {
			object = toObject(object);
			var Ctor = object.constructor, length = object.length;
			if ((Ctor && object === Ctor.prototype) || (typeof length == 'number' && length > 0) || (support.enumPrototypes && typeof object == 'function')) {
				return shimKeys(object);
			}
			return nativeKeys(object);
		};
		function keysIn(object) {
			if (object == null) {
				return [];
			}
			object = toObject(object);
			var length = object.length;
			length = (typeof length == 'number' && length > 0 && (isArray(object) || (support.nonEnumStrings && isString(object)) || (support.nonEnumArgs && isArguments(object))) && length) || 0;
			var keyIndex, Ctor = object.constructor, index = -1, isProto = Ctor && object === Ctor.prototype, maxIndex = length - 1, result = Array(length), skipIndexes = length > 0, skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error), skipProto = support.enumPrototypes && typeof object == 'function';
			while (++index < length) {
				result[index] = String(index);
			}
			for (var key in object) {
				if (!(isProto && key == 'constructor') && !(skipProto && key == 'prototype') && !(skipErrorProps && (key == 'message' || key == 'name')) && !(skipIndexes && (keyIndex = +key, keyIndex > -1 && keyIndex <= maxIndex && keyIndex % 1 == 0))) {
					result.push(key);
				}
			}
			if (support.nonEnumShadows && object !== objectProto) {
				index = -1;
				length = shadowedProps.length;
				if (isProto) {
					var className = object === stringProto ? stringClass : object === errorProto ? errorClass : toString.call(object), nonEnum = nonEnumProps[className];
				}
				while (++index < length) {
					key = shadowedProps[index];
					if (!(nonEnum && nonEnum[key]) && hasOwnProperty.call(object, key)) {
						result.push(key);
					}
				}
			}
			return result;
		}
		function mapValues(object, iteratee, thisArg) {
			var result = {};
			iteratee = getCallback(iteratee, thisArg, 3);
			baseForOwn(object, function(value, key, object) {
				result[key] = iteratee(value, key, object);
			});
			return result;
		}
		var merge = createAssigner(baseMerge);
		function omit(object, predicate, thisArg) {
			if (object == null) {
				return {};
			}
			var iterable = toObject(object);
			if (typeof predicate != 'function') {
				var props = arrayMap(baseFlatten(arguments, false, false, 1), String);
				return pickByArray(iterable, baseDifference(keysIn(iterable), props));
			}
			predicate = getCallback(predicate, thisArg, 3);
			return pickByCallback(iterable, function(value, key, object) {
				return !predicate(value, key, object);
			});
		}
		function pairs(object) {
			var index = -1, props = keys(object), length = props.length, result = Array(length);
			while (++index < length) {
				var key = props[index];
				result[index] = [key, object[key]];
			}
			return result;
		}
		function pick(object, predicate, thisArg) {
			if (object == null) {
				return {};
			}
			var iterable = toObject(object);
			return typeof predicate == 'function'? pickByCallback(iterable, getCallback(predicate, thisArg, 3)) : pickByArray(iterable, baseFlatten(arguments, false, false, 1));
		}
		function transform(object, iteratee, accumulator, thisArg) {
			var isArr = isArrayLike(object);
			if (accumulator == null) {
				if (isArr) {
					accumulator = [];
				} else {
					if (isObject(object)) {
						var Ctor = object.constructor, proto = Ctor && Ctor.prototype;
					}
					accumulator = baseCreate(proto);
				}
			}
			if (iteratee) {
				iteratee = getCallback(iteratee, thisArg, 4);
				(isArr ? arrayEach : baseForOwn)(object, function(value, index, object) {
					return iteratee(accumulator, value, index, object);
				});
			}
			return accumulator;
		}
		function values(object) {
			return baseValues(object, keys);
		}
		function valuesIn(object) {
			return baseValues(object, keysIn);
		}
		var camelCase = createCompounder(function(result, word, index) {
			if (!index && reAllCaps.test(word)) {
				return result + word.toLowerCase();
			}
			return result + (word.charAt(0)[index ? 'toUpperCase' : 'toLowerCase']() + word.slice(1));
		});
		function capitalize(string) {
			if (string == null) {
				return '';
			}
			string = String(string);
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
		function endsWith(string, target, position) {
			string = string == null ? '' : String(string);
			target = String(target);
			var length = string.length;
			position = (typeof position == 'undefined' ? length : nativeMin(position < 0 ? 0 : (+position || 0), length)) - target.length;
			return position >= 0 && string.indexOf(target, position) == position;
		}
		function escape(string) {
			string = string == null ? '' : String(string);
			return (reUnescapedHtml.lastIndex = 0, reUnescapedHtml.test(string)) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
		}
		function escapeRegExp(string) {
			string = string == null ? '' : String(string);
			return (reRegExpChars.lastIndex = 0, reRegExpChars.test(string)) ? string.replace(reRegExpChars, '\\$&') : string;
		}
		var kebabCase = createCompounder(function(result, word, index) {
			return result + (index ? '-' : '') + word.toLowerCase();
		});
		function pad(string, length, chars) {
			string = string == null ? '' : String(string);
			length = +length;
			var strLength = string.length;
			if (strLength >= length || !nativeIsFinite(length)) {
				return string;
			}
			var mid = (length - strLength) / 2, leftLength = floor(mid), rightLength = ceil(mid);
			chars = createPad('', rightLength, chars);
			return chars.slice(0, leftLength) + string + chars;
		}
		function padLeft(string, length, chars) {
			string = string == null ? '' : String(string);
			return createPad(string, length, chars) + string;
		}
		function padRight(string, length, chars) {
			string = string == null ? '' : String(string);
			return string + createPad(string, length, chars);
		}
		function repeat(string, n) {
			var result = '';
			n = +n;
			if (n < 1 || string == null || !nativeIsFinite(n)) {
				return result;
			}
			string = String(string);
			do {
				if (n % 2) {
					result += string;
				}
				n = floor(n / 2);
				string += string;
			} while (n);
			return result;
		}
		var snakeCase = createCompounder(function(result, word, index) {
			return result + (index ? '_' : '') + word.toLowerCase();
		});
		function startsWith(string, target, position) {
			string = string == null ? '' : String(string);
			position = typeof position == 'undefined' ? 0 : nativeMin(position < 0 ? 0 : (+position || 0), string.length);
			return string.lastIndexOf(target, position) == position;
		}
		function template(string, options, otherOptions) {
			var settings = lodash.templateSettings;
			options = assign({}, otherOptions || options, settings, assignOwnDefaults);
			string = String(string == null ? '' : string);
			var imports = assign({}, options.imports, settings.imports, assignOwnDefaults), importsKeys = keys(imports), importsValues = values(imports);
			var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
			var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g');
			var sourceURL = options.sourceURL || ('/lodash/template/source[' + (++templateCounter) + ']');
			sourceURL = sourceURL ? ('\n') : '';
			string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
				interpolateValue || (interpolateValue = esTemplateValue);
				source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
				if (escapeValue) {
					isEscaping = true;
					source += "' +\n__e(" + escapeValue + ") +\n'";
				}
				if (evaluateValue) {
					isEvaluating = true;
					source += "';\n" + evaluateValue + ";\n__p += '";
				}
				if (interpolateValue) {
					source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
				}
				index = offset + match.length;
				return match;
			});
			source += "';\n";
			var variable = options.variable;
			if (!variable) {
				source = 'with (obj) {\n' + source + '\n}\n';
			}
			source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source) .replace(reEmptyStringMiddle, '$1') .replace(reEmptyStringTrailing, '$1;');
			source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '': 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape': '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n": ';\n') + source + 'return __p\n}';
			var result = attempt(function() {
				return Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
			});
			result.source = source;
			if (isError(result)) {
				throw result;
			}
			return result;
		}
		function trim(string, chars) {
			string = string == null ? '' : String(string);
			if (!string) {
				return string;
			}
			if (chars == null) {
				return string.slice(trimmedLeftIndex(string), trimmedRightIndex(string) + 1);
			}
			chars = String(chars);
			return string.slice(charsLeftIndex(string, chars), charsRightIndex(string, chars) + 1);
		}
		function trimLeft(string, chars) {
			string = string == null ? '' : String(string);
			if (!string) {
				return string;
			}
			if (chars == null) {
				return string.slice(trimmedLeftIndex(string))
			}
			chars = String(chars);
			return string.slice(charsLeftIndex(string, chars));
		}
		function trimRight(string, chars) {
			string = string == null ? '' : String(string);
			if (!string) {
				return string;
			}
			if (chars == null) {
				return string.slice(0, trimmedRightIndex(string) + 1)
			}
			chars = String(chars);
			return string.slice(0, charsRightIndex(string, chars) + 1);
		}
		function trunc(string, options) {
			var length = 30, omission = '...';
			if (isObject(options)) {
				var separator = 'separator' in options ? options.separator : separator;
				length = 'length' in options ? +options.length || 0 : length;
				omission = 'omission' in options ? String(options.omission) : omission;
			}
			else if (options != null) {
				length = +options || 0;
			}
			string = string == null ? '' : String(string);
			if (length >= string.length) {
				return string;
			}
			var end = length - omission.length;
			if (end < 1) {
				return omission;
			}
			var result = string.slice(0, end);
			if (separator == null) {
				return result + omission;
			}
			if (isRegExp(separator)) {
				if (string.slice(end).search(separator)) {
					var match, newEnd, substring = string.slice(0, end);
					if (!separator.global) {
						separator = RegExp(separator.source, (reFlags.exec(separator) || '') + 'g');
					}
					separator.lastIndex = 0;
					while ((match = separator.exec(substring))) {
						newEnd = match.index;
					}
					result = result.slice(0, newEnd == null ? end : newEnd);
				}
			} else if (string.indexOf(separator, end) != end) {
				var index = result.lastIndexOf(separator);
				if (index > -1) {
					result = result.slice(0, index);
				}
			}
			return result + omission;
		}
		function unescape(string) {
			string = string == null ? '' : String(string);
			return (reEscapedHtml.lastIndex = 0, reEscapedHtml.test(string)) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
		}
		function attempt(func) {
			try {
				return func();
			} catch(e) {
				return isError(e) ? e : Error(e);
			}
		}
		function callback(func, thisArg) {
			return baseCallback(func, thisArg);
		}
		function constant(value) {
			return function() {
				return value;
			};
		}
		function identity(value) {
			return value;
		}
		function matches(source) {
			var props = keys(source), length = props.length;
			if (length == 1) {
				var key = props[0], value = source[key];
				if (isStrictComparable(value)) {
					return function(object) {
						return object != null && value === object[key] && hasOwnProperty.call(object, key);
					};
				}
			}
			var index = length, flags = Array(length), vals = Array(length);
			while (index--) {
				value = source[props[index]];
				var isStrict = isStrictComparable(value);
				flags[index] = isStrict;
				vals[index] = isStrict ? value : baseClone(value);
			}
			return function(object) {
				index = length;
				if (object == null) {
					return !index;
				}
				while (index--) {
					if (flags[index] ? vals[index] !== object[props[index]] : !hasOwnProperty.call(object, props[index])) {
						return false;
					}
				}
				index = length;
				while (index--) {
					if (flags[index] ? !hasOwnProperty.call(object, props[index]) : !baseIsEqual(vals[index], object[props[index]], null, true)) {
						return false;
					}
				}
				return true;
			};
		}
		function mixin(object, source, options) {
			var chain = true, isObj = isObject(source), noOpts = options == null, props = noOpts && isObj && keys(source), methodNames = props && baseFunctions(source, props);
			if ((props && props.length && !methodNames.length) || (noOpts && !isObj)) {
				if (noOpts) {
					options = source;
				}
				methodNames = false;
				source = object;
				object = this;
			}
			methodNames || (methodNames = baseFunctions(source, keys(source)));
			if (options === false) {
				chain = false;
			} else if (isObject(options) && 'chain' in options) {
				chain = options.chain;
			}
			var index = -1, isFunc = isFunction(object), length = methodNames.length;
			while (++index < length) {
				var methodName = methodNames[index], func = object[methodName] = source[methodName];
				if (isFunc) {
					object.prototype[methodName] = (function(func) {
						return function() {
							var chainAll = this.__chain__, value = this.__wrapped__, args = [value];
							push.apply(args, arguments);
							var result = func.apply(object, args);
							if (chain || chainAll) {
								if (value === result && isObject(result)) {
									return this;
								}
								result = new object(result);
								result.__chain__ = chainAll;
							}
							return result;
						};
					}(func));
				}
			}
			return object;
		}
		function noConflict() {
			context._ = oldDash;
			return this;
		}
		function noop() {
		}
		var now = nativeNow || function() {
			return new Date().getTime();
		};
		function parseInt(value, radix, guard) {
			return nativeParseInt(value, guard ? 0 : radix);
		}
		if (nativeParseInt(whitespace + '08') != 8) {
			parseInt = function(value, radix, guard) {
				value = trim(value);
				radix = guard ? 0 : +radix;
				return nativeParseInt(value, radix || (reHexPrefix.test(value) ? 16 : 10));
			};
		}
		function property(key) {
			return function(object) {
				return object == null ? undefined : object[key];
			};
		}
		function random(min, max, floating) {
			var type = typeof max;
			if ((type == 'number' || type == 'string') && floating && floating[max] === min) {
				max = floating = null;
			}
			var noMin = min == null, noMax = max == null;
			if (floating == null) {
				if (noMax && typeof min == 'boolean') {
					floating = min;
					min = 1;
				}
				else if (typeof max == 'boolean') {
					floating = max;
					noMax = true;
				}
			}
			if (noMin && noMax) {
				max = 1;
				noMax = false;
			}
			min = +min || 0;
			if (noMax) {
				max = min;
				min = 0;
			} else {
				max = +max || 0;
			}
			if (floating || min % 1 || max % 1) {
				var rand = nativeRandom();
				return nativeMin(min + (rand * (max - min + parseFloat('1e-' + (String(rand).length - 1)))), max);
			}
			return baseRandom(min, max);
		}
		function range(start, end, step) {
			start = +start || 0;
			var type = typeof end;
			if ((type == 'number' || type == 'string') && step && step[end] === start) {
				end = step = null;
			}
			step = step == null ? 1 : (+step || 0);
			if (end == null) {
				end = start;
				start = 0;
			} else {
				end = +end || 0;
			}
			var index = -1, length = nativeMax(ceil((end - start) / (step || 1)), 0), result = Array(length);
			while (++index < length) {
				result[index] = start;
				start += step;
			}
			return result;
		}
		function result(object, key, defaultValue) {
			var value = object == null ? undefined : object[key];
			if (typeof value == 'undefined') {
				return defaultValue;
			}
			return isFunction(value) ? object[key]() : value;
		}
		function times(n, iteratee, thisArg) {
			n = nativeIsFinite(n = +n) && n > -1 ? n : 0;
			iteratee = baseCallback(iteratee, thisArg, 1);
			var index = -1, result = Array(nativeMin(n, MAX_ARRAY_LENGTH));
			while (++index < n) {
				if (index < MAX_ARRAY_LENGTH) {
					result[index] = iteratee(index);
				} else {
					iteratee(index);
				}
			}
			return result;
		}
		function uniqueId(prefix) {
			var id = ++idCounter;
			return String(prefix == null ? '' : prefix) + id;
		}
		lodash.after = after;
		lodash.assign = assign;
		lodash.at = at;
		lodash.before = before;
		lodash.bind = bind;
		lodash.bindAll = bindAll;
		lodash.bindKey = bindKey;
		lodash.callback = callback;
		lodash.chain = chain;
		lodash.chunk = chunk;
		lodash.compact = compact;
		lodash.constant = constant;
		lodash.countBy = countBy;
		lodash.create = create;
		lodash.curry = curry;
		lodash.curryRight = curryRight;
		lodash.debounce = debounce;
		lodash.defaults = defaults;
		lodash.defer = defer;
		lodash.delay = delay;
		lodash.difference = difference;
		lodash.drop = drop;
		lodash.dropRight = dropRight;
		lodash.dropRightWhile = dropRightWhile;
		lodash.dropWhile = dropWhile;
		lodash.filter = filter;
		lodash.flatten = flatten;
		lodash.flattenDeep = flattenDeep;
		lodash.flow = flow;
		lodash.flowRight = flowRight;
		lodash.forEach = forEach;
		lodash.forEachRight = forEachRight;
		lodash.forIn = forIn;
		lodash.forInRight = forInRight;
		lodash.forOwn = forOwn;
		lodash.forOwnRight = forOwnRight;
		lodash.functions = functions;
		lodash.groupBy = groupBy;
		lodash.indexBy = indexBy;
		lodash.initial = initial;
		lodash.intersection = intersection;
		lodash.invert = invert;
		lodash.invoke = invoke;
		lodash.keys = keys;
		lodash.keysIn = keysIn;
		lodash.map = map;
		lodash.mapValues = mapValues;
		lodash.matches = matches;
		lodash.memoize = memoize;
		lodash.merge = merge;
		lodash.mixin = mixin;
		lodash.negate = negate;
		lodash.omit = omit;
		lodash.once = once;
		lodash.pairs = pairs;
		lodash.partial = partial;
		lodash.partialRight = partialRight;
		lodash.partition = partition;
		lodash.pick = pick;
		lodash.pluck = pluck;
		lodash.property = property;
		lodash.pull = pull;
		lodash.pullAt = pullAt;
		lodash.range = range;
		lodash.reject = reject;
		lodash.remove = remove;
		lodash.rest = rest;
		lodash.shuffle = shuffle;
		lodash.slice = slice;
		lodash.sortBy = sortBy;
		lodash.take = take;
		lodash.takeRight = takeRight;
		lodash.takeRightWhile = takeRightWhile;
		lodash.takeWhile = takeWhile;
		lodash.tap = tap;
		lodash.throttle = throttle;
		lodash.times = times;
		lodash.toArray = toArray;
		lodash.transform = transform;
		lodash.union = union;
		lodash.uniq = uniq;
		lodash.unzip = unzip;
		lodash.values = values;
		lodash.valuesIn = valuesIn;
		lodash.where = where;
		lodash.without = without;
		lodash.wrap = wrap;
		lodash.xor = xor;
		lodash.zip = zip;
		lodash.zipObject = zipObject;
		lodash.backflow = flowRight;
		lodash.collect = map;
		lodash.compose = flowRight;
		lodash.each = forEach;
		lodash.eachRight = forEachRight;
		lodash.extend = assign;
		lodash.iteratee = callback;
		lodash.methods = functions;
		lodash.object = zipObject;
		lodash.select = filter;
		lodash.tail = rest;
		lodash.unique = uniq;
		mixin(lodash, baseAssign({}, lodash));
		lodash.attempt = attempt;
		lodash.camelCase = camelCase;
		lodash.capitalize = capitalize;
		lodash.clone = clone;
		lodash.cloneDeep = cloneDeep;
		lodash.contains = contains;
		lodash.endsWith = endsWith;
		lodash.escape = escape;
		lodash.escapeRegExp = escapeRegExp;
		lodash.every = every;
		lodash.find = find;
		lodash.findIndex = findIndex;
		lodash.findKey = findKey;
		lodash.findLast = findLast;
		lodash.findLastIndex = findLastIndex;
		lodash.findLastKey = findLastKey;
		lodash.findWhere = findWhere;
		lodash.first = first;
		lodash.has = has;
		lodash.identity = identity;
		lodash.indexOf = indexOf;
		lodash.isArguments = isArguments;
		lodash.isArray = isArray;
		lodash.isBoolean = isBoolean;
		lodash.isDate = isDate;
		lodash.isElement = isElement;
		lodash.isEmpty = isEmpty;
		lodash.isEqual = isEqual;
		lodash.isError = isError;
		lodash.isFinite = isFinite;
		lodash.isFunction = isFunction;
		lodash.isNaN = isNaN;
		lodash.isNative = isNative;
		lodash.isNull = isNull;
		lodash.isNumber = isNumber;
		lodash.isObject = isObject;
		lodash.isPlainObject = isPlainObject;
		lodash.isRegExp = isRegExp;
		lodash.isString = isString;
		lodash.isUndefined = isUndefined;
		lodash.kebabCase = kebabCase;
		lodash.last = last;
		lodash.lastIndexOf = lastIndexOf;
		lodash.max = max;
		lodash.min = min;
		lodash.noConflict = noConflict;
		lodash.noop = noop;
		lodash.now = now;
		lodash.pad = pad;
		lodash.padLeft = padLeft;
		lodash.padRight = padRight;
		lodash.parseInt = parseInt;
		lodash.random = random;
		lodash.reduce = reduce;
		lodash.reduceRight = reduceRight;
		lodash.repeat = repeat;
		lodash.result = result;
		lodash.runInContext = runInContext;
		lodash.size = size;
		lodash.snakeCase = snakeCase;
		lodash.some = some;
		lodash.sortedIndex = sortedIndex;
		lodash.sortedLastIndex = sortedLastIndex;
		lodash.startsWith = startsWith;
		lodash.template = template;
		lodash.trim = trim;
		lodash.trimLeft = trimLeft;
		lodash.trimRight = trimRight;
		lodash.trunc = trunc;
		lodash.unescape = unescape;
		lodash.uniqueId = uniqueId;
		lodash.all = every;
		lodash.any = some;
		lodash.detect = find;
		lodash.foldl = reduce;
		lodash.foldr = reduceRight;
		lodash.head = first;
		lodash.include = contains;
		lodash.inject = reduce;
		mixin(lodash, (function() {
			var source = {};
			baseForOwn(lodash, function(func, methodName) {
				if (!lodash.prototype[methodName]) {
					source[methodName] = func;
				}
			});
			return source;
		}()), false);
		lodash.sample = sample;
		baseForOwn(lodash, function(func, methodName) {
			var callbackable = methodName != 'sample';
			if (!lodash.prototype[methodName]) {
				lodash.prototype[methodName] = function(n, guard) {
					var chainAll = this.__chain__, result = func(this.__wrapped__, n, guard);
					return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function'))) ? result : new lodashWrapper(result, chainAll);
				};
			}
		});
		lodash.VERSION = VERSION;
		lodashWrapper.prototype = lodash.prototype;
		lodash.prototype.chain = wrapperChain;
		lodash.prototype.toString = wrapperToString;
		lodash.prototype.toJSON = lodash.prototype.value = lodash.prototype.valueOf = wrapperValueOf;
		arrayEach(['bind', 'bindKey', 'curry', 'curryRight', 'partial', 'partialRight'], function(methodName) {
			lodash[methodName].placeholder = lodash;
		});
		arrayEach(['join', 'pop', 'shift'], function(methodName) {
			var func = arrayProto[methodName];
			lodash.prototype[methodName] = function() {
				var chainAll = this.__chain__, result = func.apply(this.__wrapped__, arguments);
				return chainAll ? new lodashWrapper(result, chainAll) : result;
			};
		});
		arrayEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
			var func = arrayProto[methodName];
			lodash.prototype[methodName] = function() {
				func.apply(this.__wrapped__, arguments);
				return this;
			};
		});
		arrayEach(['concat', 'splice'], function(methodName) {
			var func = arrayProto[methodName];
			lodash.prototype[methodName] = function() {
				return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
			};
		});
		if (!support.spliceObjects) {
			arrayEach(['pop', 'shift', 'splice'], function(methodName) {
				var func = arrayProto[methodName], isSplice = methodName == 'splice';
				lodash.prototype[methodName] = function() {
					var chainAll = this.__chain__, value = this.__wrapped__, result = func.apply(value, arguments);
					if (value.length === 0) {
						delete value[0];
					}
					return (chainAll || isSplice) ? new lodashWrapper(result, chainAll) : result;
				};
			});
		}
		return lodash;
	}
	var _ = runInContext();
	if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
		root._ = _;
		define(function() {
			return _;
		});
	}
	else if (freeExports && freeModule) {
		if (moduleExports) {
			(freeModule.exports = _)._ = _;
		}
		else {
			freeExports._ = _;
		}
	}
	else {
		root._ = _;
	}
}.call(this));
