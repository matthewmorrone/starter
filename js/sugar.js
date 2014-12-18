
(function(){
	'use strict';

	var Sugar = {};
	var object = Object;
	var globalContext = typeof global !== 'undefined' ? global : window;
	var hasExports = typeof module !== 'undefined' && module.exports;
	var noConflict = hasExports && typeof process !== 'undefined' ? process.env['SUGAR_NO_CONFLICT'] : false;
	var internalHasOwnProperty = object.prototype.hasOwnProperty;
	var propertyDescriptorSupport = !!(object.defineProperty && object.defineProperties);
	var natives = 'Boolean,Number,String,Array,Date,RegExp,Function'.split(',');
	var proxies = {};

	function initializeGlobal() {
		Sugar = {

			'extend': extend,
			'restore': restore,
			'revert': revert,
			'noConflict': noConflict
		};
		if (hasExports) {
			module.exports = Sugar;
		} else {
			globalContext['Sugar'] = Sugar;
		}
	}

	function initializeNatives() {
		iterateOverObject(natives.concat('Object'), function(i, name) {
			proxies[globalContext[name]] = name;
			Sugar[name] = {};
		});
	}

	function extend(klass, methods, instance, polyfill, override) {
		var extendee;
		instance = instance !== false;
		extendee = instance ? klass.prototype : klass;
		iterateOverObject(methods, function(name, prop) {
			var existing = checkGlobal('method', klass, name, extendee),
					original = checkGlobal('original', klass, name, extendee),
					existed  = name in extendee;
			if(typeof polyfill === 'function' && existing) {
				prop = wrapExisting(existing, prop, polyfill);
			}
			defineOnGlobal(klass, name, instance, original, prop, existed);
			if(canDefineOnNative(klass, polyfill, existing, override)) {
				setProperty(extendee, name, prop);
			}
		});
	}

	function alias(klass, target, source) {
		var method = getProxy(klass)[source];
		var obj = {};
		obj[target] = method['method'];
		extend(klass, obj, method['instance']);
	}

	function restore(klass, methods) {
		if(noConflict) return;
		return batchMethodExecute(klass, methods, function(target, name, m) {
			setProperty(target, name, m.method);
		});
	}

	function revert(klass, methods) {
		return batchMethodExecute(klass, methods, function(target, name, m) {
			if(m['existed']) {
				setProperty(target, name, m['original']);
			} else {
				delete target[name];
			}
		});
	}

	function batchMethodExecute(klass, methods, fn) {
		var all = !methods, changed = false;
		if(typeof methods === 'string') methods = [methods];
		iterateOverObject(getProxy(klass), function(name, m) {
			if(all || methods.indexOf(name) !== -1) {
				changed = true;
				fn(m['instance'] ? klass.prototype : klass, name, m);
			}
		});
		return changed;
	}

	function checkGlobal(type, klass, name, extendee) {
		var proxy = getProxy(klass), methodExists;
		methodExists = proxy && hasOwnProperty(proxy, name);
		if(methodExists) {
			return proxy[name][type];
		} else {
			return extendee[name];
		}
	}

	function canDefineOnNative(klass, polyfill, existing, override) {
		if(override) {
			return true;
		} else if(polyfill === true) {
			return !existing;
		}
		return !noConflict || !proxies[klass];
	}

	function wrapExisting(originalFn, extendedFn, condition) {
		return function(a) {
			return condition.apply(this, arguments) ?
						 extendedFn.apply(this, arguments) :
						 originalFn.apply(this, arguments);
		}
	}

	function wrapInstanceAsClass(fn) {
		return function(obj) {
			var args = arguments, newArgs = [], i;
			for(i = 1;i < args.length;i++) {
				newArgs.push(args[i]);
			}
			return fn.apply(obj, newArgs);
		};
	}

	function defineOnGlobal(klass, name, instance, original, prop, existed) {
		var proxy = getProxy(klass), result;
		if(!proxy) return;
		result = instance ? wrapInstanceAsClass(prop) : prop;
		setProperty(proxy, name, result, true);
		if(typeof prop === 'function') {
			setProperty(result, 'original', original);
			setProperty(result, 'method', prop);
			setProperty(result, 'existed', existed);
			setProperty(result, 'instance', instance);
		}
	}

	function getProxy(klass) {
		return Sugar[proxies[klass]];
	}

	function setProperty(target, name, property, enumerable) {
		if(propertyDescriptorSupport) {
			object.defineProperty(target, name, {
				'value': property,
				'enumerable': !!enumerable,
				'configurable': true,
				'writable': true
			});
		} else {
			target[name] = property;
		}
	}

	function iterateOverObject(obj, fn) {
		var key;
		for(key in obj) {
			if(!hasOwnProperty(obj, key)) continue;
			if(fn.call(obj, key, obj[key], obj) === false) break;
		}
	}

	function hasOwnProperty(obj, prop) {
		return !!obj && internalHasOwnProperty.call(obj, prop);
	}

	initializeGlobal();
	initializeNatives();

	var object = Object, array = Array, regexp = RegExp, date = Date, string = String, number = Number, func = Function, math = Math, Undefined;

	var sugarObject = Sugar.Object, sugarArray = Sugar.Array, sugarDate = Sugar.Date, sugarString = Sugar.String, sugarNumber = Sugar.Number;
	var internalToString = object.prototype.toString;
	var regexIsFunction = typeof regexp() === 'function';
	var noKeysInStringObjects = !('0' in new string('a'));
	var typeChecks = {};
	var matchedByValueReg = /^\[object Date|Array|String|Number|RegExp|Boolean|Arguments\]$/;

	var isBoolean  = buildPrimitiveClassCheck('boolean', natives[0]);
	var isNumber   = buildPrimitiveClassCheck('number',  natives[1]);
	var isString   = buildPrimitiveClassCheck('string',  natives[2]);

	var isArray    = buildClassCheck(natives[3]);
	var isDate     = buildClassCheck(natives[4]);
	var isRegExp   = buildClassCheck(natives[5]);
	var isFunction = buildClassCheck(natives[6]);

	function isClass(obj, klass, cached) {
		var k = cached || className(obj);
		return k === '[object '+klass+']';
	}

	function buildClassCheck(klass) {
		var fn = (klass === 'Array' && array.isArray) || function(obj, cached) {
			return isClass(obj, klass, cached);
		};
		typeChecks[klass] = fn;
		return fn;
	}

	function buildPrimitiveClassCheck(type, klass) {
		var fn = function(obj) {
			if(isObjectType(obj)) {
				return isClass(obj, klass);
			}
			return typeof obj === type;
		}
		typeChecks[klass] = fn;
		return fn;
	}

	function className(obj) {
		return internalToString.call(obj);
	}

	function extendSimilar(klass, set, fn, instance, polyfill, override) {
		var methods = {};
		set = isString(set) ? set.split(',') : set;
		set.forEach(function(name, i) {
			fn(methods, name, i);
		});
		extend(klass, methods, instance, polyfill, override);
	}

	function isArgumentsObject(obj) {
		return hasProperty(obj, 'length') && (className(obj) === '[object Arguments]' || !!obj.callee);
	}

	function multiArgs(args, fn, from) {
		var result = [], i = from || 0, len;
		for(len = args.length; i < len; i++) {
			result.push(args[i]);
			if(fn) fn.call(args, args[i], i);
		}
		return result;
	}

	function flattenedArgs(args, fn, from) {
		var arg = args[from || 0];
		if(isArray(arg)) {
			args = arg;
			from = 0;
		}
		return multiArgs(args, fn, from);
	}

	function checkCallback(fn) {
		if(!fn || !fn.call) {
			throw new TypeError('Callback is not callable');
		}
	}

	function isDefined(o) {
		return o !== Undefined;
	}

	function isUndefined(o) {
		return o === Undefined;
	}

	function hasProperty(obj, prop) {
		return !isPrimitiveType(obj) && prop in obj;
	}

	function isObjectType(obj) {
		return !!obj && (typeof obj === 'object' || (regexIsFunction && isRegExp(obj)));
	}

	function isPrimitiveType(obj) {
		var type = typeof obj;
		return obj == null || type === 'string' || type === 'number' || type === 'boolean';
	}

	function isPlainObject(obj, klass) {
		klass = klass || className(obj);
		try {
			if (obj && obj.constructor &&
						!hasOwnProperty(obj, 'constructor') &&
						!hasOwnProperty(obj.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		} catch (e) {
			return false;
		}
		return !!obj && klass === '[object Object]' && 'hasOwnProperty' in obj;
	}

	function simpleRepeat(n, fn) {
		for(var i = 0; i < n; i++) {
			fn(i);
		}
	}

	function simpleMerge(target, source) {
		iterateOverObject(source, function(key) {
			target[key] = source[key];
		});
		return target;
	}
	 function coercePrimitiveToObject(obj) {
		 if(isPrimitiveType(obj)) {
			 obj = object(obj);
		 }
		 if(noKeysInStringObjects && isString(obj)) {
			 forceStringCoercion(obj);
		 }
		 return obj;
	 }
	 function forceStringCoercion(obj) {
		 var i = 0, chr;
		 while(chr = obj.charAt(i)) {
			 obj[i++] = chr;
		 }
	 }

	function Hash(obj) {
		simpleMerge(this, coercePrimitiveToObject(obj));
	};

	Hash.prototype.constructor = object;

	var abs   = math.abs;
	var pow   = math.pow;
	var ceil  = math.ceil;
	var floor = math.floor;
	var round = math.round;
	var min   = math.min;
	var max   = math.max;

	function withPrecision(val, precision, fn) {
		var multiplier = pow(10, abs(precision || 0));
		fn = fn || round;
		if(precision < 0) multiplier = 1 / multiplier;
		return fn(val * multiplier) / multiplier;
	}

	var HalfWidthZeroCode = 0x30;
	var HalfWidthNineCode = 0x39;
	var FullWidthZeroCode = 0xff10;
	var FullWidthNineCode = 0xff19;

	var HalfWidthPeriod = '.';
	var FullWidthPeriod = '．';
	var HalfWidthComma  = ',';
	var FullWidthDigits   = '';

	var NumberNormalizeMap = {};
	var NumberNormalizeReg;

	function codeIsNumeral(code) {
		return (code >= HalfWidthZeroCode && code <= HalfWidthNineCode) ||
					 (code >= FullWidthZeroCode && code <= FullWidthNineCode);
	}

	function buildNumberHelpers() {
		var digit, i;
		for(i = 0; i <= 9; i++) {
			digit = chr(i + FullWidthZeroCode);
			FullWidthDigits += digit;
			NumberNormalizeMap[digit] = chr(i + HalfWidthZeroCode);
		}
		NumberNormalizeMap[HalfWidthComma] = '';
		NumberNormalizeMap[FullWidthPeriod] = HalfWidthPeriod;
		NumberNormalizeMap[HalfWidthPeriod] = HalfWidthPeriod;
		NumberNormalizeReg = regexp('[' + FullWidthDigits + FullWidthPeriod + HalfWidthComma + HalfWidthPeriod + ']', 'g');
	}

	function chr(num) {
		return string.fromCharCode(num);
	}
	function getTrimmableCharacters() {
		return '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u2028\u2029\u3000\uFEFF';
	}

	function repeatString(str, num) {
		var result = '';
		str = str.toString();
		while (num > 0) {
			if (num & 1) {
				result += str;
			}
			if (num >>= 1) {
				str += str;
			}
		}
		return result;
	}
	function stringToNumber(str, base) {
		var sanitized, isDecimal;
		sanitized = str.replace(NumberNormalizeReg, function(chr) {
			var replacement = NumberNormalizeMap[chr];
			if(replacement === HalfWidthPeriod) {
				isDecimal = true;
			}
			return replacement;
		});
		return isDecimal ? parseFloat(sanitized) : parseInt(sanitized, base || 10);
	}

	function padNumber(num, place, sign, base) {
		var str = abs(num).toString(base || 10);
		str = repeatString('0', place - str.replace(/\.\d+/, '').length) + str;
		if(sign || num < 0) {
			str = (num < 0 ? '-' : '+') + str;
		}
		return str;
	}

	function getOrdinalizedSuffix(num) {
		if(num >= 11 && num <= 13) {
			return 'th';
		} else {
			switch(num % 10) {
				case 1:  return 'st';
				case 2:  return 'nd';
				case 3:  return 'rd';
				default: return 'th';
			}
		}
	}

	function getRegExpFlags(reg, add) {
		var flags = '';
		add = add || '';
		function checkFlag(prop, flag) {
			if(prop || add.indexOf(flag) > -1) {
				flags += flag;
			}
		}
		checkFlag(reg.multiline, 'm');
		checkFlag(reg.ignoreCase, 'i');
		checkFlag(reg.global, 'g');
		checkFlag(reg.sticky, 'y');
		return flags;
	}

	function escapeRegExp(str) {
		if(!isString(str)) str = string(str);
		return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g,'\\$1');
	}

	function callDateGet(d, method) {
		return d['get' + (d._utc ? 'UTC' : '') + method]();
	}

	function callDateSet(d, method, value) {
		return d['set' + (d._utc ? 'UTC' : '') + method](value);
	}

	function stringify(thing, stack) {
		var type = typeof thing,
				thingIsObject,
				thingIsArray,
				klass, value,
				arr, key, i, len;
		if(type === 'string') return thing;

		klass         = internalToString.call(thing);
		thingIsObject = isPlainObject(thing, klass);
		thingIsArray  = isArray(thing, klass);

		if(thing != null && thingIsObject || thingIsArray) {
			if(!stack) stack = [];
			if(stack.length > 1) {
				i = stack.length;
				while (i--) {
					if (stack[i] === thing) {
						return 'CYC';
					}
				}
			}
			stack.push(thing);
			value = thing.valueOf() + string(thing.constructor);
			arr = thingIsArray ? thing : object.keys(thing).sort();
			for(i = 0, len = arr.length; i < len; i++) {
				key = thingIsArray ? i : arr[i];
				value += key + stringify(thing[key], stack);
			}
			stack.pop();
		} else if(1 / thing === -Infinity) {
			value = '-0';
		} else {
			value = string(thing && thing.valueOf ? thing.valueOf() : thing);
		}
		return type + klass + value;
	}

	function isEqual(a, b) {
		if(a === b) {
			return a !== 0 || 1 / a === 1 / b;
		} else if(objectIsMatchedByValue(a) && objectIsMatchedByValue(b)) {
			return stringify(a) === stringify(b);
		}
		return false;
	}

	function objectIsMatchedByValue(obj) {
		var klass = className(obj);
		return matchedByValueReg.test(klass) || isPlainObject(obj, klass);
	}

	function getEntriesForIndexes(obj, args, isString) {
		var result,
				length    = obj.length,
				argsLen   = args.length,
				overshoot = args[argsLen - 1] !== false,
				multiple  = argsLen > (overshoot ? 1 : 2);
		if(!multiple) {
			return entryAtIndex(obj, length, args[0], overshoot, isString);
		}
		result = [];
		multiArgs(args, function(index) {
			if(isBoolean(index)) return false;
			result.push(entryAtIndex(obj, length, index, overshoot, isString));
		});
		return result;
	}

	function entryAtIndex(obj, length, index, overshoot, isString) {
		if(overshoot) {
			index = index % length;
			if(index < 0) index = length + index;
		}
		return isString ? obj.charAt(index) : obj[index];
	}

	function transformArgument(el, map, context, mapArgs) {
		if(!map) {
			return el;
		} else if(map.apply) {
			return map.apply(context, mapArgs || []);
		} else if(isFunction(el[map])) {
			return el[map].call(el);
		} else {
			return el[map];
		}
	}

	 function keysWithObjectCoercion(obj) {
		 return object.keys(coercePrimitiveToObject(obj));
	 }

	function buildObjectInstanceMethods(set, target) {
		set.forEach(function(name) {
			var classFn = sugarObject[name === 'equals' ? 'equal' : name];
			var fn = function() {
				var args = arguments, newArgs = [this], i;
				for(i = 0;i < args.length;i++) {
					newArgs.push(args[i]);
				}
				return classFn.apply(null, newArgs);
			}
			setProperty(target.prototype, name, fn);
		});
	}

	buildNumberHelpers();

	extend(object, {

		'keys': function(obj) {
			var keys = [];
			if(!isObjectType(obj) && !isRegExp(obj) && !isFunction(obj)) {
				throw new TypeError('Object required');
			}
			iterateOverObject(obj, function(key, value) {
				keys.push(key);
			});
			return keys;
		}

	}, false, true);

	function arrayIndexOf(arr, search, fromIndex, increment) {
		var length = arr.length,
				fromRight = increment == -1,
				start = fromRight ? length - 1 : 0,
				index = toIntegerWithDefault(fromIndex, start);
		if(index < 0) {
			index = length + index;
		}
		if((!fromRight && index < 0) || (fromRight && index >= length)) {
			index = start;
		}
		while((fromRight && index >= 0) || (!fromRight && index < length)) {
			if(arr[index] === search) {
				return index;
			}
			index += increment;
		}
		return -1;
	}

	function arrayReduce(arr, fn, initialValue, fromRight) {
		var length = arr.length, count = 0, defined = isDefined(initialValue), result, index;
		checkCallback(fn);
		if(length == 0 && !defined) {
			throw new TypeError('Reduce called on empty array with no initial value');
		} else if(defined) {
			result = initialValue;
		} else {
			result = arr[fromRight ? length - 1 : count];
			count++;
		}
		while(count < length) {
			index = fromRight ? length - count - 1 : count;
			if(index in arr) {
				result = fn(result, arr[index], index, arr);
			}
			count++;
		}
		return result;
	}

	function toIntegerWithDefault(i, d) {
		if(isNaN(i)) {
			return d;
		} else {
			return parseInt(i >> 0);
		}
	}

	function checkFirstArgumentExists(args) {
		if(args.length === 0) {
			throw new TypeError('First argument must be defined');
		}
	}

	extend(array, {

		'isArray': function(obj) {
			return isArray(obj);
		}

	}, false, true);

	extend(array, {

		'every': function(fn, scope) {
			var length = this.length, index = 0;
			checkFirstArgumentExists(arguments);
			while(index < length) {
				if(index in this && !fn.call(scope, this[index], index, this)) {
					return false;
				}
				index++;
			}
			return true;
		},
		'some': function(fn, scope) {
			var length = this.length, index = 0;
			checkFirstArgumentExists(arguments);
			while(index < length) {
				if(index in this && fn.call(scope, this[index], index, this)) {
					return true;
				}
				index++;
			}
			return false;
		},
		'map': function(fn, scope) {
			var scope = arguments[1], length = this.length, index = 0, result = new Array(length);
			checkFirstArgumentExists(arguments);
			while(index < length) {
				if(index in this) {
					result[index] = fn.call(scope, this[index], index, this);
				}
				index++;
			}
			return result;
		},
		'filter': function(fn) {
			var scope = arguments[1];
			var length = this.length, index = 0, result = [];
			checkFirstArgumentExists(arguments);
			while(index < length) {
				if(index in this && fn.call(scope, this[index], index, this)) {
					result.push(this[index]);
				}
				index++;
			}
			return result;
		},
		'indexOf': function(search) {
			var fromIndex = arguments[1];
			if(isString(this)) return this.indexOf(search, fromIndex);
			return arrayIndexOf(this, search, fromIndex, 1);
		},
		'lastIndexOf': function(search) {
			var fromIndex = arguments[1];
			if(isString(this)) return this.lastIndexOf(search, fromIndex);
			return arrayIndexOf(this, search, fromIndex, -1);
		},
		'forEach': function(fn) {
			var length = this.length, index = 0, scope = arguments[1];
			checkCallback(fn);
			while(index < length) {
				if(index in this) {
					fn.call(scope, this[index], index, this);
				}
				index++;
			}
		},
		'reduce': function(fn) {
			return arrayReduce(this, fn, arguments[1]);
		},
		'reduceRight': function(fn) {
			return arrayReduce(this, fn, arguments[1], true);
		}

	}, true, true);

	var TrimRegExp = regexp('^[' + getTrimmableCharacters() + ']+|['+getTrimmableCharacters()+']+$', 'g')

	extend(string, {

		'trim': function() {
			return this.toString().replace(TrimRegExp, '');
		}
	}, true, true);

	extend(func, {

		'bind': function(scope) {
			var fn = this, args = multiArgs(arguments, null, 1), bound;
			if(!isFunction(this)) {
				throw new TypeError('Function.prototype.bind called on a non-function');
			}
			bound = function() {
				return fn.apply(fn.prototype && this instanceof fn ? this : scope, args.concat(multiArgs(arguments)));
			}
			bound.prototype = this.prototype;
			return bound;
		}

	}, true, true);

	function hasISOStringSupport() {
		var d = new date(date.UTC(2000, 0)), expected = '2000-01-01T00:00:00.000Z';
		return !!d.toISOString && d.toISOString() === expected;
	}

	extend(date, {

		'now': function() {
			return new date().getTime();
		}

	}, false, true);

	extendSimilar(date, 'toISOString,toJSON', function(methods, name) {
		methods[name] = function() {
			return padNumber(this.getUTCFullYear(), 4) + '-' +
						 padNumber(this.getUTCMonth() + 1, 2) + '-' +
						 padNumber(this.getUTCDate(), 2) + 'T' +
						 padNumber(this.getUTCHours(), 2) + ':' +
						 padNumber(this.getUTCMinutes(), 2) + ':' +
						 padNumber(this.getUTCSeconds(), 2) + '.' +
						 padNumber(this.getUTCMilliseconds(), 3) + 'Z';
		}
	}, true, true, !hasISOStringSupport());

	function regexMatcher(reg) {
		reg = regexp(reg);
		return function (el) {
			return reg.test(el);
		}
	}

	function dateMatcher(d) {
		var ms = d.getTime();
		return function (el) {
			return !!(el && el.getTime) && el.getTime() === ms;
		}
	}

	function functionMatcher(fn) {
		return function (el, i, arr) {
			return el === fn || fn.call(this, el, i, arr);
		}
	}

	function invertedArgsFunctionMatcher(fn) {
		return function (value, key, obj) {
			return value === fn || fn.call(obj, key, value, obj);
		}
	}

	function fuzzyMatcher(obj, isObject) {
		var matchers = {};
		return function (el, i, arr) {
			var key;
			if(!isObjectType(el)) {
				return false;
			}
			for(key in obj) {
				matchers[key] = matchers[key] || getMatcher(obj[key], isObject);
				if(matchers[key].call(arr, el[key], i, arr) === false) {
					return false;
				}
			}
			return true;
		}
	}

	function defaultMatcher(f) {
		return function (el) {
			return el === f || isEqual(el, f);
		}
	}

	function getMatcher(f, isObject) {
		if(isPrimitiveType(f)) {
		} else if(isRegExp(f)) {
			return regexMatcher(f);
		} else if(isDate(f)) {
			return dateMatcher(f);
		} else if(isFunction(f)) {
			if(isObject) {
				return invertedArgsFunctionMatcher(f);
			} else {
				return functionMatcher(f);
			}
		} else if(isPlainObject(f)) {
			return fuzzyMatcher(f, isObject);
		}
		return defaultMatcher(f);
	}

	function transformArgument(el, map, context, mapArgs) {
		if(!map) {
			return el;
		} else if(map.apply) {
			return map.apply(context, mapArgs || []);
		} else if(isArray(map)) {
			return map.map(function(m) {
				return transformArgument(el, m, context, mapArgs);
			});
		} else if(isFunction(el[map])) {
			return el[map].call(el);
		} else {
			return el[map];
		}
	}

	function compareValue(aVal, bVal) {
		var cmp, i;
		if(isString(aVal) && isString(bVal)) {
			return collateStrings(aVal, bVal);
		} else if(isArray(aVal) && isArray(bVal)) {
			if(aVal.length < bVal.length) {
				return -1;
			} else if(aVal.length > bVal.length) {
				return 1;
			} else {
				for(i = 0; i < aVal.length; i++) {
					cmp = compareValue(aVal[i], bVal[i]);
					if(cmp !== 0) {
						return cmp;
					}
				}
				return 0;
			}
		} else if(aVal < bVal) {
			return -1;
		} else if(aVal > bVal) {
			return 1;
		} else {
			return 0;
		}

	}

	function arrayEach(arr, fn, startIndex, loop) {
		var index, i, length = +arr.length;
		if(startIndex < 0) startIndex = arr.length + startIndex;
		i = isNaN(startIndex) ? 0 : startIndex;
		if(loop === true) {
			length += i;
		}
		while(i < length) {
			index = i % arr.length;
			if(!(index in arr)) {
				return iterateOverSparseArray(arr, fn, i, loop);
			} else if(fn.call(arr, arr[index], index, arr) === false) {
				break;
			}
			i++;
		}
	}

	function iterateOverSparseArray(arr, fn, fromIndex, loop) {
		var indexes = [], i;
		for(i in arr) {
			if(isArrayIndex(arr, i) && i >= fromIndex) {
				indexes.push(parseInt(i));
			}
		}
		arrayEach(indexes.sort(), function(index) {
			return fn.call(arr, arr[index], index, arr);
		});
		return arr;
	}

	function isArrayIndex(arr, i) {
		return i in arr && toUInt32(i) == i && i != 0xffffffff;
	}

	function toUInt32(i) {
		return i >>> 0;
	}

	function arrayFind(arr, f, startIndex, loop, returnIndex, context) {
		var result, index, matcher;
		if(arr.length > 0) {
			matcher = getMatcher(f);
			arrayEach(arr, function(el, i) {
				if(matcher.call(context, el, i, arr)) {
					result = el;
					index = i;
					return false;
				}
			}, startIndex, loop);
		}
		return returnIndex ? index : result;
	}

	function arrayFindAll(arr, f, index, loop) {
		var result = [], matcher;
		if(arr.length > 0) {
			matcher = getMatcher(f);
			arrayEach(arr, function(el, i, arr) {
				if(matcher(el, i, arr)) {
					result.push(el);
				}
			}, index, loop);
		}
		return result;
	}

	function arrayAdd(arr, el, index) {
		if(!isNumber(number(index)) || isNaN(index)) index = arr.length;
		array.prototype.splice.apply(arr, [index, 0].concat(el));
		return arr;
	}

	function arrayRemove(arr, args) {
		multiArgs(args, function(f) {
			var i = 0, matcher = getMatcher(f);
			while(i < arr.length) {
				if(matcher(arr[i], i, arr)) {
					arr.splice(i, 1);
				} else {
					i++;
				}
			}
		});
		return arr;
	}

	function arrayUnique(arr, map) {
		var result = [], o = {}, transformed;
		arrayEach(arr, function(el, i) {
			transformed = map ? transformArgument(el, map, arr, [el, i, arr]) : el;
			if(!checkForElementInHashAndSet(o, transformed)) {
				result.push(el);
			}
		})
		return result;
	}

	function arrayIntersect(arr1, arr2, subtract) {
		var result = [], o = {};
		arrayEach(arr2, function(el) {
			checkForElementInHashAndSet(o, el);
		});
		arrayEach(arr1, function(el) {
			var stringified = stringify(el),
					isReference = !objectIsMatchedByValue(el);
			if(elementExistsInHash(o, stringified, el, isReference) !== subtract) {
				discardElementFromHash(o, stringified, el, isReference);
				result.push(el);
			}
		});
		return result;
	}

	function arrayFlatten(arr, level, current) {
		level = level || Infinity;
		current = current || 0;
		var result = [];
		arrayEach(arr, function(el) {
			if(isArray(el) && current < level) {
				result = result.concat(arrayFlatten(el, level, current + 1));
			} else {
				result.push(el);
			}
		});
		return result;
	}

	function arrayGroupBy(arr, map, fn) {
		var result = {}, key;
		arrayEach(arr, function(el, index) {
			key = transformArgument(el, map, arr, [el, index, arr]);
			if(!result[key]) result[key] = [];
			result[key].push(el);
		});
		if(fn) {
			iterateOverObject(result, fn);
		}
		return result;
	}

	function arraySum(arr, map) {
		if(map) {
			arr = sugarArray.map(arr, map);
		}
		return arr.length > 0 ? arr.reduce(function(a,b) { return a + b; }) : 0;
	}

	function arrayCompact(arr, all) {
		var result = [];
		arrayEach(arr, function(el, i) {
			if(isArray(el)) {
				result.push(arrayCompact(el));
			} else if(all && el) {
				result.push(el);
			} else if(!all && el != null && el.valueOf() === el.valueOf()) {
				result.push(el);
			}
		});
		return result;
	}

	function arrayRandomize(arr) {
		arr = arrayClone(arr);
		var i = arr.length, j, x;
		while(i) {
			j = (math.random() * i) | 0;
			x = arr[--i];
			arr[i] = arr[j];
			arr[j] = x;
		}
		return arr;
	}

	function arrayClone(arr) {
		return simpleMerge([], arr);
	}

	function isArrayLike(obj) {
		return hasProperty(obj, 'length') && !isString(obj) && !isPlainObject(obj);
	}

	function flatArguments(args) {
		var result = [];
		multiArgs(args, function(arg) {
			result = result.concat(arg);
		});
		return result;
	}

	function elementExistsInHash(hash, key, element, isReference) {
		var exists = hasOwnProperty(hash, key);
		if(isReference) {
			if(!hash[key]) {
				hash[key] = [];
			}
			exists = hash[key].indexOf(element) !== -1;
		}
		return exists;
	}

	function checkForElementInHashAndSet(hash, element) {
		var stringified = stringify(element),
				isReference = !objectIsMatchedByValue(element),
				exists      = elementExistsInHash(hash, stringified, element, isReference);
		if(isReference) {
			hash[stringified].push(element);
		} else {
			hash[stringified] = element;
		}
		return exists;
	}

	function discardElementFromHash(hash, key, element, isReference) {
		var arr, i = 0;
		if(isReference) {
			arr = hash[key];
			while(i < arr.length) {
				if(arr[i] === element) {
					arr.splice(i, 1);
				} else {
					i += 1;
				}
			}
		} else {
			delete hash[key];
		}
	}

	function getMinOrMax(obj, map, which, all) {
		var el,
				key,
				edge,
				test,
				result = [],
				max = which === 'max',
				min = which === 'min',
				isArray = array.isArray(obj);
		for(key in obj) {
			if(!obj.hasOwnProperty(key)) continue;
			el   = obj[key];
			test = transformArgument(el, map, obj, isArray ? [el, parseInt(key), obj] : []);
			if(isUndefined(test)) {
				throw new TypeError('Cannot compare with undefined');
			}
			if(test === edge) {
				result.push(el);
			} else if(isUndefined(edge) || (max && test > edge) || (min && test < edge)) {
				result = [el];
				edge = test;
			}
		}
		if(!isArray) result = arrayFlatten(result, 1);
		return all ? result : result[0];
	}

	function collateStrings(a, b) {
		var aValue, bValue, aChar, bChar, aEquiv, bEquiv, index = 0, tiebreaker = 0;

		var sortIgnore      = sugarArray[AlphanumericSortIgnore];
		var sortIgnoreCase  = sugarArray[AlphanumericSortIgnoreCase];
		var sortEquivalents = sugarArray[AlphanumericSortEquivalents];
		var sortOrder       = sugarArray[AlphanumericSortOrder];
		var naturalSort     = sugarArray[AlphanumericSortNatural];

		a = getCollationReadyString(a, sortIgnore, sortIgnoreCase);
		b = getCollationReadyString(b, sortIgnore, sortIgnoreCase);

		do {

			aChar  = getCollationCharacter(a, index, sortEquivalents);
			bChar  = getCollationCharacter(b, index, sortEquivalents);
			aValue = getSortOrderIndex(aChar, sortOrder);
			bValue = getSortOrderIndex(bChar, sortOrder);

			if(aValue === -1 || bValue === -1) {
				aValue = a.charCodeAt(index) || null;
				bValue = b.charCodeAt(index) || null;
				if(naturalSort && codeIsNumeral(aValue) && codeIsNumeral(bValue)) {
					aValue = stringToNumber(a.slice(index));
					bValue = stringToNumber(b.slice(index));
				}
			} else {
				aEquiv = aChar !== a.charAt(index);
				bEquiv = bChar !== b.charAt(index);
				if(aEquiv !== bEquiv && tiebreaker === 0) {
					tiebreaker = aEquiv - bEquiv;
				}
			}
			index += 1;
		} while(aValue != null && bValue != null && aValue === bValue);
		if(aValue === bValue) return tiebreaker;
		return aValue - bValue;
	}

	function getCollationReadyString(str, sortIgnore, sortIgnoreCase) {
		if(!isString(str)) str = string(str);
		if(sortIgnoreCase) {
			str = str.toLowerCase();
		}
		if(sortIgnore) {
			str = str.replace(sortIgnore, '');
		}
		return str;
	}

	function getCollationCharacter(str, index, sortEquivalents) {
		var chr = str.charAt(index);
		return sortEquivalents[chr] || chr;
	}

	function getSortOrderIndex(chr, sortOrder) {
		if(!chr) {
			return null;
		} else {
			return sortOrder.indexOf(chr);
		}
	}

	var AlphanumericSort            = 'AlphanumericSort';
	var AlphanumericSortOrder       = 'AlphanumericSortOrder';
	var AlphanumericSortIgnore      = 'AlphanumericSortIgnore';
	var AlphanumericSortIgnoreCase  = 'AlphanumericSortIgnoreCase';
	var AlphanumericSortEquivalents = 'AlphanumericSortEquivalents';
	var AlphanumericSortNatural     = 'AlphanumericSortNatural';

	function buildEnhancements() {
		var nativeMap = array.prototype.map;
		var callbackCheck = function() {
			var args = arguments;
			return args.length > 0 && !isFunction(args[0]);
		};
		extendSimilar(array, 'every,some,filter,find,findIndex', function(methods, name) {
			var nativeFn = array.prototype[name]
			methods[name] = function(f) {
				var matcher = getMatcher(f);
				return nativeFn.call(this, function(el, index, arr) {
					return matcher(el, index, arr);
				});
			}
		}, true, callbackCheck);
		extend(array, {
			'map': function(map, context) {
				var arr = this;
				if(arguments.length < 2) {
					context = arr;
				}
				return nativeMap.call(arr, function(el, index) {
					return transformArgument(el, map, context, [el, index, arr]);
				});
			}
		}, true, callbackCheck);
	}

	function buildAlphanumericSort() {
		var order = 'AÁÀÂÃĄBCĆČÇDĎÐEÉÈĚÊËĘFGĞHıIÍÌİÎÏJKLŁMNŃŇÑOÓÒÔPQRŘSŚŠŞTŤUÚÙŮÛÜVWXYÝZŹŻŽÞÆŒØÕÅÄÖ';
		var equiv = 'AÁÀÂÃÄ,CÇ,EÉÈÊË,IÍÌİÎÏ,OÓÒÔÕÖ,Sß,UÚÙÛÜ';
		sugarArray[AlphanumericSortOrder] = order.split('').map(function(str) {
			return str + str.toLowerCase();
		}).join('');
		var equivalents = {};
		arrayEach(equiv.split(','), function(set) {
			var equivalent = set.charAt(0);
			arrayEach(set.slice(1).split(''), function(chr) {
				equivalents[chr] = equivalent;
				equivalents[chr.toLowerCase()] = equivalent.toLowerCase();
			});
		});
		sugarArray[AlphanumericSortNatural] = true;
		sugarArray[AlphanumericSortIgnoreCase] = true;
		sugarArray[AlphanumericSortEquivalents] = equivalents;
	}

	extend(array, {

		'create': function() {
			var result = [];
			multiArgs(arguments, function(a) {
				if(isArgumentsObject(a) || isArrayLike(a)) {
					a = multiArgs(a);
				}
				result = result.concat(a);
			});
			return result;
		}

	}, false);

	extend(array, {

		'find': function(f) {
			var context = arguments[1];
			checkCallback(f);
			return arrayFind(this, f, 0, false, false, context);
		},
		'findIndex': function(f) {
			var index, context = arguments[1];
			checkCallback(f);
			index = arrayFind(this, f, 0, false, true, context);
			return isUndefined(index) ? -1 : index;
		}

	}, true, true);

	extend(array, {

		'findFrom': function(f, index, loop) {
			return arrayFind(this, f, index, loop);
		},
		'findIndexFrom': function(f, index, loop) {
			var index = arrayFind(this, f, index, loop, true);
			return isUndefined(index) ? -1 : index;
		},
		'findAll': function(f, index, loop) {
			return arrayFindAll(this, f, index, loop);
		},
		'count': function(f) {
			if(isUndefined(f)) return this.length;
			return arrayFindAll(this, f).length;
		},
		'removeAt': function(start, end) {
			if(isUndefined(start)) return this;
			if(isUndefined(end))   end = start;
			this.splice(start, end - start + 1);
			return this;
		},
		'include': function(el, index) {
			return arrayAdd(arrayClone(this), el, index);
		},
		'exclude': function() {
			return arrayRemove(arrayClone(this), arguments);
		},
		'clone': function() {
			return arrayClone(this);
		},
		'unique': function(map) {
			return arrayUnique(this, map);
		},
		'flatten': function(limit) {
			return arrayFlatten(this, limit);
		},
		'union': function() {
			return arrayUnique(this.concat(flatArguments(arguments)));
		},
		'intersect': function() {
			return arrayIntersect(this, flatArguments(arguments), false);
		},
		'subtract': function(a) {
			return arrayIntersect(this, flatArguments(arguments), true);
		},
		'at': function() {
			return getEntriesForIndexes(this, arguments);
		},
		'first': function(num) {
			if(isUndefined(num)) return this[0];
			if(num < 0) num = 0;
			return this.slice(0, num);
		},
		'last': function(num) {
			if(isUndefined(num)) return this[this.length - 1];
			var start = this.length - num < 0 ? 0 : this.length - num;
			return this.slice(start);
		},
		'from': function(num) {
			return this.slice(num);
		},
		'to': function(num) {
			if(isUndefined(num)) num = this.length;
			return this.slice(0, num);
		},
		'min': function(map, all) {
			return getMinOrMax(this, map, 'min', all);
		},
		'max': function(map, all) {
			return getMinOrMax(this, map, 'max', all);
		},
		'least': function(map, all) {
			return getMinOrMax(arrayGroupBy(this, map), 'length', 'min', all);
		},
		'most': function(map, all) {
			return getMinOrMax(arrayGroupBy(this, map), 'length', 'max', all);
		},
		'sum': function(map) {
			return arraySum(this, map);
		},
		'average': function(map) {
			return this.length > 0 ? arraySum(this, map) / this.length : 0;
		},
		'inGroups': function(num, padding) {
			var pad = arguments.length > 1;
			var arr = this;
			var result = [];
			var divisor = ceil(this.length / num);
			simpleRepeat(num, function(i) {
				var index = i * divisor;
				var group = arr.slice(index, index + divisor);
				if(pad && group.length < divisor) {
					simpleRepeat(divisor - group.length, function() {
						group.push(padding);
					});
				}
				result.push(group);
			});
			return result;
		},
		'inGroupsOf': function(num, padding) {
			var result = [], len = this.length, arr = this, group;
			if(len === 0 || num === 0) return arr;
			if(isUndefined(num)) num = 1;
			if(isUndefined(padding)) padding = null;
			simpleRepeat(ceil(len / num), function(i) {
				group = arr.slice(num * i, num * i + num);
				while(group.length < num) {
					group.push(padding);
				}
				result.push(group);
			});
			return result;
		},
		'isEmpty': function() {
			return arrayCompact(this).length == 0;
		},
		'sortBy': function(map, desc) {
			var arr = arrayClone(this);
			arr.sort(function(a, b) {
				var aProperty = transformArgument(a, map, arr, [a]);
				var bProperty = transformArgument(b, map, arr, [b]);
				return compareValue(aProperty, bProperty) * (desc ? -1 : 1);
			});
			return arr;
		},
		'randomize': function() {
			return arrayRandomize(this);
		},
		'zip': function() {
			var args = multiArgs(arguments);
			return this.map(function(el, i) {
				return [el].concat(args.map(function(k) {
					return (i in k) ? k[i] : null;
				}));
			});
		},
		'sample': function(num) {
			var arr = arrayRandomize(this);
			return arguments.length > 0 ? arr.slice(0, num) : arr[0];
		},
		'each': function(fn, index, loop) {
			arrayEach(this, fn, index, loop);
			return this;
		},
		'add': function(el, index) {
			return arrayAdd(this, el, index);
		},
		'remove': function() {
			return arrayRemove(this, arguments);
		},
		'compact': function(all) {
			return arrayCompact(this, all);
		},
		'groupBy': function(map, fn) {
			return arrayGroupBy(this, map, fn);
		},
		'none': function(f) {
			var args = multiArgs(arguments);
			return !sugarArray.some.apply(this, [this].concat(args));
		}

	});

	function buildAliases() {

		alias(array, 'all', 'every');

		alias(array, 'any', 'some');

		alias(array, 'insert', 'add');
	}

	function buildEnumerableMethods(names, mapping) {
		extendSimilar(object, names, function(methods, name) {
			var unwrapped = sugarArray[name]['method'];
			methods[name] = function(obj, arg1, arg2) {
				var result, coerced = keysWithObjectCoercion(obj), matcher;
				if(!mapping) {
					matcher = getMatcher(arg1, true);
				}
				result = unwrapped.call(coerced, function(key) {
					var value = obj[key];
					if(mapping) {
						return transformArgument(value, arg1, obj, [key, value, obj]);
					} else {
						return matcher(value, key, obj);
					}
				}, arg2);
				if(isArray(result)) {
					result = result.reduce(function(o, key, i) {
						o[key] = obj[key];
						return o;
					}, {});
				}
				return result;
			};
		}, false);
		buildObjectInstanceMethods(names, Hash);
	}

	function exportSortAlgorithm() {
		sugarArray[AlphanumericSort] = collateStrings;
	}

	var EnumerableFindingMethods = 'any,all,none,count,find,findAll,isEmpty'.split(',');
	var EnumerableMappingMethods = 'sum,average,min,max,least,most'.split(',');

	buildEnhancements();
	buildAliases();
	buildAlphanumericSort();
	buildEnumerableMethods(EnumerableFindingMethods);
	buildEnumerableMethods(EnumerableMappingMethods, true);
	exportSortAlgorithm();

	var English;
	var CurrentLocalization;

	var TimeFormat = ['ampm','hour','minute','second','ampm','utc','offset_sign','offset_hours','offset_minutes','ampm'];
	var DecimalReg = '(?:[,.]\\d+)?';
	var HoursReg   = '\\d{1,2}' + DecimalReg;
	var SixtyReg   = '[0-5]\\d' + DecimalReg;
	var RequiredTime = '({t})?\\s*('+HoursReg+')(?:{h}('+SixtyReg+')?{m}(?::?('+SixtyReg+'){s})?\\s*(?:({t})|(Z)|(?:([+-])(\\d{2,2})(?::?(\\d{2,2}))?)?)?|\\s*({t}))';

	var KanjiDigits = '〇一二三四五六七八九十百千万';
	var AsianDigitMap = {};
	var AsianDigitReg;

	var DateArgumentUnits;
	var DateUnitsReversed;
	var CoreDateFormats = [];
	var CompiledOutputFormats = {};

	var DateFormatTokens = {

		'yyyy': function(d) {
			return callDateGet(d, 'FullYear');
		},
		'yy': function(d) {
			return callDateGet(d, 'FullYear') % 100;
		},
		'ord': function(d) {
			var date = callDateGet(d, 'Date');
			return date + getOrdinalizedSuffix(date);
		},
		'tz': function(d) {
			return getUTCOffset(d);
		},
		'isotz': function(d) {
			return getUTCOffset(d, true);
		},
		'Z': function(d) {
			return getUTCOffset(d);
		},
		'ZZ': function(d) {
			return getUTCOffset(d).replace(/(\d{2})$/, ':$1');
		}

	};

	var DateUnits = [
		{
			name: 'year',
			method: 'FullYear',
			ambiguous: true,
			multiplier: function(d) {
				var adjust = d ? (isLeapYear(d) ? 1 : 0) : 0.25;
				return (365 + adjust) * 24 * 60 * 60 * 1000;
			}
		},
		{
			name: 'month',
			error: 0.919,
			method: 'Month',
			ambiguous: true,
			multiplier: function(d, ms) {
				var days = 30.4375, inMonth;
				if(d) {
					inMonth = getDaysInMonth(d);
					if(ms <= inMonth * 24 * 60 * 60 * 1000) {
						days = inMonth;
					}
				}
				return days * 24 * 60 * 60 * 1000;
			}
		},
		{
			name: 'week',
			method: 'ISOWeek',
			multiplier: function() {
				return 7 * 24 * 60 * 60 * 1000;
			}
		},
		{
			name: 'day',
			error: 0.958,
			method: 'Date',
			ambiguous: true,
			multiplier: function() {
				return 24 * 60 * 60 * 1000;
			}
		},
		{
			name: 'hour',
			method: 'Hours',
			multiplier: function() {
				return 60 * 60 * 1000;
			}
		},
		{
			name: 'minute',
			method: 'Minutes',
			multiplier: function() {
				return 60 * 1000;
			}
		},
		{
			name: 'second',
			method: 'Seconds',
			multiplier: function() {
				return 1000;
			}
		},
		{
			name: 'millisecond',
			method: 'Milliseconds',
			multiplier: function() {
				return 1;
			}
		}
	];

	var Localizations = {};

	function Localization(l) {
		simpleMerge(this, l);
		this.compiledFormats = CoreDateFormats.concat();
	}

	Localization.prototype = {

		get: function(prop) {
			return this[prop] || '';
		},
		getMonth: function(n) {
			if(isNumber(n)) {
				return n - 1;
			} else {
				return this['months'].indexOf(n) % 12;
			}
		},
		getWeekday: function(n) {
			return this['weekdays'].indexOf(n) % 7;
		},
		getNumber: function(n, digit) {
			var mapped = this.ordinalNumberMap[n];
			if(mapped) {
				if(digit) {
					mapped = mapped % 10;
				}
				return mapped;
			}
			return isNumber(n) ? n : 1;
		},
		getNumericDate: function(n) {
			var self = this;
			return n.replace(regexp(this['num'], 'g'), function(d) {
				var num = self.getNumber(d, true);
				return num || '';
			});
		},
		getUnitIndex: function(n) {
			return this['units'].indexOf(n) % 8;
		},
		getRelativeFormat: function(adu) {
			return this.convertAdjustedToFormat(adu, adu[2] > 0 ? 'future' : 'past');
		},
		getDuration: function(ms) {
			return this.convertAdjustedToFormat(getAdjustedUnit(ms), 'duration');
		},
		hasVariant: function(code) {
			code = code || this.code;
			return code === 'en' || code === 'en-US' ? true : this['variant'];
		},
		matchAM: function(str) {
			return str === this.get('ampm')[0];
		},
		matchPM: function(str) {
			return str && str === this.get('ampm')[1];
		},
		convertAdjustedToFormat: function(adu, mode) {
			var sign, unit, mult,
					num    = adu[0],
					u      = adu[1],
					ms     = adu[2],
					format = this[mode] || this['relative'];
			if(isFunction(format)) {
				return format.call(this, num, u, ms, mode);
			}
			mult = this['plural'] && num > 1 ? 1 : 0;
			unit = this['units'][mult * 8 + u] || this['units'][u];
			if(this['capitalizeUnit']) unit = simpleCapitalize(unit);
			sign = this['modifiers'].filter(function(m) { return m.name == 'sign' && m.value == (ms > 0 ? 1 : -1); })[0];
			return format.replace(/\{(.*?)\}/g, function(full, match) {
				switch(match) {
					case 'num': return num;
					case 'unit': return unit;
					case 'sign': return sign.src;
				}
			});
		},
		getFormats: function() {
			return this.cachedFormat ? [this.cachedFormat].concat(this.compiledFormats) : this.compiledFormats;
		},
		addFormat: function(src, allowsTime, match, variant, iso) {
			var to = match || [], loc = this, time, timeMarkers, lastIsNumeral;

			src = src.replace(/\s+/g, '[,. ]*');
			src = src.replace(/\{([^,]+?)\}/g, function(all, k) {
				var value, arr, result,
						opt   = k.match(/\?$/),
						nc    = k.match(/^(\d+)\??$/),
						slice = k.match(/(\d)(?:-(\d))?/),
						key   = k.replace(/[^a-z]+$/, '');
				if(nc) {
					value = loc.get('tokens')[nc[1]];
				} else if(loc[key]) {
					value = loc[key];
				} else if(loc[key + 's']) {
					value = loc[key + 's'];
					if(slice) {
						arr = [];
						value.forEach(function(m, i) {
							var mod = i % (loc['units'] ? 8 : value.length);
							if(mod >= slice[1] && mod <= (slice[2] || slice[1])) {
								arr.push(m);
							}
						});
						value = arr;
					}
					value = arrayToAlternates(value);
				}
				if(!value) {
					return '';
				}
				if(nc) {
					result = '(?:' + value + ')';
				} else {
					if(!match) {
						to.push(key);
					}
					result = '(' + value + ')';
				}
				if(opt) {
					result += '?';
				}
				return result;
			});
			if(allowsTime) {
				time = prepareTime(RequiredTime, loc, iso);
				timeMarkers = ['t','[\\s\\u3000]'].concat(loc.get('timeMarker'));
				lastIsNumeral = src.match(/\\d\{\d,\d\}\)+\??$/);
				addDateInputFormat(loc, '(?:' + time + ')[,\\s\\u3000]+?' + src, TimeFormat.concat(to), variant);
				addDateInputFormat(loc, src + '(?:[,\\s]*(?:' + timeMarkers.join('|') + (lastIsNumeral ? '+' : '*') +')' + time + ')?', to.concat(TimeFormat), variant);
			} else {
				addDateInputFormat(loc, src, to, variant);
			}
		}

	};

	function getLocalization(localeCode, fallback) {
		var loc;
		if(!isString(localeCode)) localeCode = '';
		loc = Localizations[localeCode] || Localizations[localeCode.slice(0,2)];
		if(fallback === false && !loc) {
			throw new TypeError('Invalid locale.');
		}
		return loc || CurrentLocalization;
	}

	function setLocalization(localeCode, set) {
		var loc, canAbbreviate;

		function initializeField(name) {
			var val = loc[name];
			if(isString(val)) {
				loc[name] = val.split(',');
			} else if(!val) {
				loc[name] = [];
			}
		}

		function eachAlternate(str, fn) {
			str = str.split('+').map(function(split) {
				return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
					return suffixes.split('|').map(function(suffix) {
						return base + suffix;
					}).join('|');
				});
			}).join('|');
			return str.split('|').forEach(fn);
		}

		function setArray(name, abbreviate, multiple) {
			var arr = [];
			loc[name].forEach(function(full, i) {
				if(abbreviate) {
					full += '+' + full.slice(0,3);
				}
				eachAlternate(full, function(alt, j) {
					arr[j * multiple + i] = alt.toLowerCase();
				});
			});
			loc[name] = arr;
		}

		function getDigit(start, stop, allowNumbers) {
			var str = '\\d{' + start + ',' + stop + '}';
			if(allowNumbers) str += '|(?:' + arrayToAlternates(loc.get('numbers')) + ')+';
			return str;
		}

		function getNum() {
			var numbers = loc.get('numbers');
			var arr = ['-?\\d+'].concat(loc.get('articles'));
			if(numbers) {
				arr = arr.concat(numbers);
			}
			return arrayToAlternates(arr);
		}

		function setDefault(name, value) {
			loc[name] = loc[name] || value;
		}

		function buildNumbers() {
			var map = loc.ordinalNumberMap = {}, all = [];
			loc['numbers'].forEach(function(full, i) {
				eachAlternate(full, function(alt) {
					all.push(alt);
					map[alt] = i + 1;
				});
			});
			loc['numbers'] = all;
		}

		function buildModifiers() {
			var arr = [];
			loc.modifiersByName = {};
			loc['modifiers'].push({ 'name': 'day', 'src': 'yesterday', 'value': -1 });
			loc['modifiers'].push({ 'name': 'day', 'src': 'today', 'value': 0 });
			loc['modifiers'].push({ 'name': 'day', 'src': 'tomorrow', 'value': 1 });
			loc['modifiers'].forEach(function(modifier) {
				var name = modifier.name;
				eachAlternate(modifier.src, function(t) {
					var locEntry = loc[name];
					loc.modifiersByName[t] = modifier;
					arr.push({ name: name, src: t, value: modifier.value });
					loc[name] = locEntry ? locEntry + '|' + t : t;
				});
			});
			loc['day'] += '|' + arrayToAlternates(loc['weekdays']);
			loc['modifiers'] = arr;
		}
		loc = new Localization(set);
		initializeField('modifiers');
		'months,weekdays,units,numbers,articles,tokens,timeMarker,ampm,timeSuffixes,dateParse,timeParse'.split(',').forEach(initializeField);

		canAbbreviate = !loc['monthSuffix'];

		buildNumbers();

		setArray('months',   canAbbreviate, 12);
		setArray('weekdays', canAbbreviate, 7);
		setArray('units', false, 8);

		setDefault('code', localeCode);
		setDefault('date', getDigit(1,2, loc['digitDate']));
		setDefault('year', "'\\d{2}|" + getDigit(4,4));
		setDefault('num', getNum());

		buildModifiers();

		if(loc['monthSuffix']) {
			loc['month'] = getDigit(1,2);
			loc['months'] = '1,2,3,4,5,6,7,8,9,10,11,12'.split(',').map(function(n) { return n + loc['monthSuffix']; });
		}
		loc['full_month'] = getDigit(1,2) + '|' + arrayToAlternates(loc['months']);
		if(loc['timeSuffixes'].length > 0) {
			loc.addFormat(prepareTime(RequiredTime, loc), false, TimeFormat);
		}

		loc.addFormat('{day}', true);
		loc.addFormat('{month}' + (loc['monthSuffix'] || ''));
		loc.addFormat('{year}' + (loc['yearSuffix'] || ''));

		loc['timeParse'].forEach(function(src) {
			loc.addFormat(src, true);
		});

		loc['dateParse'].forEach(function(src) {
			loc.addFormat(src);
		});

		return Localizations[localeCode] = loc;
	}

	function addDateInputFormat(locale, format, match, variant) {
		locale.compiledFormats.unshift({
			variant: !!variant,
			locale: locale,
			reg: regexp('^' + format + '$', 'i'),
			to: match
		});
	}

	function simpleCapitalize(str) {
		return str.slice(0,1).toUpperCase() + str.slice(1);
	}

	function arrayToAlternates(arr) {
		return arr.filter(function(el) {
			return !!el;
		}).join('|');
	}

	function getNewDate() {
		var fn = sugarDate['newDateInternal'];
		return fn ? fn() : new date;
	}

	function cloneDate(d) {
		var cloned = new date(d.getTime());
		setUTC(cloned, !!d._utc);
		return cloned;
	}
	function callDateSetWithWeek(d, method, value) {
		if(method === 'ISOWeek') {
			return setWeekNumber(d, value);
		} else {
			return callDateSet(d, method, value);
		}
	}

	function isValid(d) {
		return !isNaN(d.getTime());
	}

	function isLeapYear(d) {
		var year = callDateGet(d, 'FullYear');
		return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
	}

	function setUTC(d, force) {
		setProperty(d, '_utc', !!force);
		return d;
	}

	function isUTC(d) {
		return !!d._utc || d.getTimezoneOffset() === 0;
	}

	function getUTCOffset(d, iso) {
		var offset = d._utc ? 0 : d.getTimezoneOffset();
		var colon  = iso === true ? ':' : '';
		if(!offset && iso) return 'Z';
		return padNumber(floor(-offset / 60), 2, true) + colon + padNumber(abs(offset % 60), 2);
	}

	function collectDateArguments(args, allowDuration) {
		var obj;
		if(isObjectType(args[0])) {
			return args;
		} else if (isNumber(args[0]) && !isNumber(args[1])) {
			return [args[0]];
		} else if (isString(args[0]) && allowDuration) {
			return [getDateParamsFromString(args[0]), args[1]];
		}
		obj = {};
		DateArgumentUnits.forEach(function(u,i) {
			obj[u.name] = args[i];
		});
		return [obj];
	}

	function getDateParamsFromString(str, num) {
		var match, num, params = {};
		match = str.match(/^(-?\d+)?\s?(\w+?)s?$/i);
		if(match) {
			if(isUndefined(num)) {
				num = parseInt(match[1]);
				if(isNaN(num)) {
					num = 1;
				}
			}
			params[match[2].toLowerCase()] = num;
		}
		return params;
	}

	function iterateOverDateUnits(fn, from, to) {
		var i, unit;
		if(isUndefined(to)) to = DateUnitsReversed.length;
		for(i = from || 0; i < to; i++) {
			unit = DateUnitsReversed[i];
			if(fn(unit.name, unit, i) === false) {
				break;
			}
		}
	}

	function advanceDate(d, args) {
		var args = collectDateArguments(args, true);
		return updateDate(d, args[0], args[1], 1);
	}

	function setDate(d, args) {
		var args = collectDateArguments(args);
		return updateDate(d, args[0], args[1])
	}

	function resetDate(d, unit) {
		var params = {}, recognized;
		unit = unit || 'hours';
		if(unit === 'date') unit = 'days';
		recognized = DateUnits.some(function(u) {
			return unit === u.name || unit === u.name + 's';
		});
		params[unit] = unit.match(/^days?/) ? 1 : 0;
		return recognized ? setDate(d, [params, true]) : d;
	}

	function setWeekday(d, dow) {
		if(isUndefined(dow)) return;
		return callDateSet(d, 'Date', callDateGet(d, 'Date') + dow - callDateGet(d, 'Day'));
	}

	function moveToBeginningOfUnit(d, unit) {
		var set = {};
		switch(unit) {
			case 'year':  set['year']    = callDateGet(d, 'FullYear'); break;
			case 'month': set['month']   = callDateGet(d, 'Month');    break;
			case 'day':   set['day']     = callDateGet(d, 'Date');     break;
			case 'week':  set['weekday'] = 0; break;
		}
		return setDate(d, [set, true]);
	}

	function moveToEndOfUnit(d, unit) {
		var set = { 'hours': 23, 'minutes': 59, 'seconds': 59, 'milliseconds': 999 };
		switch(unit) {
			case 'year':  set['month']   = 11; set['day'] = 31; break;
			case 'month': set['day']     = getDaysInMonth(d);  break;
			case 'week':  set['weekday'] = 6;                   break;
		}
		return setDate(d, [set, true]);
	}

	function getFormatMatch(match, arr) {
		var obj = {}, value, num;
		arr.forEach(function(key, i) {
			value = match[i + 1];
			if(isUndefined(value) || value === '') return;
			if(key === 'year') {
				obj.yearAsString = value.replace(/'/, '');
			}
			num = parseFloat(value.replace(/'/, '').replace(/,/, '.'));
			obj[key] = !isNaN(num) ? num : value.toLowerCase();
		});
		return obj;
	}

	function cleanDateInput(str) {
		str = str.trim().replace(/^just (?=now)|\.+$/i, '');
		return convertAsianDigits(str);
	}

	function convertAsianDigits(str) {
		return str.replace(AsianDigitReg, function(full, disallowed, match) {
			var sum = 0, place = 1, lastWasHolder, lastHolder;
			if(disallowed) return full;
			match.split('').reverse().forEach(function(letter) {
				var value = AsianDigitMap[letter], holder = value > 9;
				if(holder) {
					if(lastWasHolder) sum += place;
					place *= value / (lastHolder || 1);
					lastHolder = value;
				} else {
					if(lastWasHolder === false) {
						place *= 10;
					}
					sum += place * value;
				}
				lastWasHolder = holder;
			});
			if(lastWasHolder) sum += place;
			return sum;
		});
	}

	function getExtendedDate(f, localeCode, prefer, forceUTC) {
		var d, relative, baseLocalization, afterCallbacks, loc, set, unit, unitIndex, weekday, num, tmp;

		d = getNewDate();
		afterCallbacks = [];

		function afterDateSet(fn) {
			afterCallbacks.push(fn);
		}

		function fireCallbacks() {
			afterCallbacks.forEach(function(fn) {
				fn.call();
			});
		}

		function setWeekdayOfMonth() {
			var w = d.getDay();
			setWeekday(d, (7 * (set['num'] - 1)) + (w > weekday ? weekday + 7 : weekday));
		}

		function setUnitEdge() {
			var modifier = loc.modifiersByName[set['edge']];
			iterateOverDateUnits(function(name) {
				if(isDefined(set[name])) {
					unit = name;
					return false;
				}
			}, 4);
			if(unit === 'year') {
				set.specificity = 'month';
			} else if(unit === 'month' || unit === 'week') {
				set.specificity = 'day';
			}
			if(modifier.value < 0) {
				moveToEndOfUnit(d, unit);
			} else {
				moveToBeginningOfUnit(d, unit);
			}
			if(modifier.value === -2) resetDate(d);
		}

		function separateAbsoluteUnits() {
			var params;
			iterateOverDateUnits(function(name, u, i) {
				if(name === 'day') name = 'date';
				if(isDefined(set[name])) {
					if(i >= unitIndex) {
						invalidateDate(d);
						return false;
					}
					params = params || {};
					params[name] = set[name];
					delete set[name];
				}
			});
			if(params) {
				afterDateSet(function() {
					setDate(d, [params, true]);
				});
			}
		}

		setUTC(d, forceUTC);

		if(isDate(f)) {
			setUTC(d, isUTC(f)).setTime(f.getTime());
		} else if(isNumber(f) || f === null) {
			d.setTime(f);
		} else if(isObjectType(f)) {
			setDate(d, [f, true]);
			set = f;
		} else if(isString(f)) {
			baseLocalization = getLocalization(localeCode);
			f = cleanDateInput(f);

			if(baseLocalization) {
				iterateOverObject(baseLocalization.getFormats(), function(i, dif) {
					var match = f.match(dif.reg);
					if(match) {

						loc = dif.locale;
						set = getFormatMatch(match, dif.to, loc);
						loc.cachedFormat = dif;

						if(set['utc']) {
							setUTC(d, true);
						}

						if(set.timestamp) {
							set = set.timestamp;
							return false;
						}
						if(dif.variant && !isString(set['month']) && (isString(set['date']) || baseLocalization.hasVariant(localeCode))) {
							tmp = set['month'];
							set['month'] = set['date'];
							set['date']  = tmp;
						}
						if(hasAbbreviatedYear(set)) {
							set['year'] = getYearFromAbbreviation(set['year']);
						}
						if(set['month']) {
							set['month'] = loc.getMonth(set['month']);
							if(set['shift'] && !set['unit']) set['unit'] = loc['units'][7];
						}
						if(set['weekday'] && set['date']) {
							delete set['weekday'];
						} else if(set['weekday']) {
							set['weekday'] = loc.getWeekday(set['weekday']);
							if(set['shift'] && !set['unit']) set['unit'] = loc['units'][5];
						}
						if(set['day'] && (tmp = loc.modifiersByName[set['day']])) {
							set['day'] = tmp.value;
							resetDate(d);
							relative = true;
						} else if(set['day'] && (weekday = loc.getWeekday(set['day'])) > -1) {
							delete set['day'];
							if(set['num'] && set['month']) {
								afterDateSet(setWeekdayOfMonth);
								set['day'] = 1;
							} else {
								set['weekday'] = weekday;
							}
						}

						if(set['date'] && !isNumber(set['date'])) {
							set['date'] = loc.getNumericDate(set['date']);
						}
						if(loc.matchPM(set['ampm']) && set['hour'] < 12) {
							set['hour'] += 12;
						} else if(loc.matchAM(set['ampm']) && set['hour'] === 12) {
							set['hour'] = 0;
						}
						if('offset_hours' in set || 'offset_minutes' in set) {
							setUTC(d, true);
							set['offset_minutes'] = set['offset_minutes'] || 0;
							set['offset_minutes'] += set['offset_hours'] * 60;
							if(set['offset_sign'] === '-') {
								set['offset_minutes'] *= -1;
							}
							set['minute'] -= set['offset_minutes'];
						}
						if(set['unit']) {
							relative  = true;
							num       = loc.getNumber(set['num']);
							unitIndex = loc.getUnitIndex(set['unit']);
							unit      = English['units'][unitIndex];
							separateAbsoluteUnits();
							if(set['shift']) {
								num *= (tmp = loc.modifiersByName[set['shift']]) ? tmp.value : 0;
							}
							if(set['sign'] && (tmp = loc.modifiersByName[set['sign']])) {
								num *= tmp.value;
							}
							if(isDefined(set['weekday'])) {
								setDate(d, [{'weekday': set['weekday'] }, true]);
								delete set['weekday'];
							}
							set[unit] = (set[unit] || 0) + num;
						}
						if(set['edge']) {
							afterDateSet(setUnitEdge);
						}

						if(set['year_sign'] === '-') {
							set['year'] *= -1;
						}

						iterateOverDateUnits(function(name, unit, i) {
							var value = set[name], fraction = value % 1;
							if(fraction) {
								set[DateUnitsReversed[i - 1].name] = round(fraction * (name === 'second' ? 1000 : 60));
								set[name] = floor(value);
							}
						}, 1, 4);
						return false;
					}
				});
			}
			if(!set) {
				if(f !== 'now') {
					d = new date(f);
				}
				if(forceUTC) {
					d.addMinutes(-d.getTimezoneOffset());
				}
			} else if(relative) {
				advanceDate(d, [set]);
			} else {
				if(d._utc) {
					resetDate(d);
				}
				updateDate(d, set, true, false, prefer);
			}
			fireCallbacks();
			setUTC(d, false);
		}
		return {
			date: d,
			set: set
		}
	}

	function hasAbbreviatedYear(obj) {
		return obj.yearAsString && obj.yearAsString.length === 2;
	}
	function getYearFromAbbreviation(year) {
		return round(callDateGet(getNewDate(), 'FullYear') / 100) * 100 - round(year / 100) * 100 + year;
	}

	function getShortHour(d) {
		var hours = callDateGet(d, 'Hours');
		return hours === 0 ? 12 : hours - (floor(hours / 13) * 12);
	}
	function getWeekNumber(date) {
		date = cloneDate(date);
		var dow = callDateGet(date, 'Day') || 7;
		resetDate(advanceDate(date, [(4 - dow) + ' days']));
		return 1 + floor(sugarDate.daysSince(date, moveToBeginningOfUnit(cloneDate(date), 'year')) / 7);
	}

	function setWeekNumber(date, num) {
		var weekday = callDateGet(date, 'Day') || 7;
		if(isUndefined(num)) return;
		setDate(date, [{ 'month': 0, 'date': 4 }]);
		setDate(date, [{ 'weekday': 1 }]);
		if(num > 1) {
			advanceDate(date, [{ 'weeks': num - 1 }]);
		}
		if(weekday !== 1) {
			advanceDate(date, [{ 'days': weekday - 1 }]);
		}
		return date.getTime();
	}

	function getDaysInMonth(d) {
		return 32 - callDateGet(new date(callDateGet(d, 'FullYear'), callDateGet(d, 'Month'), 32), 'Date');
	}

	function getAdjustedUnit(ms) {
		var next, ams = abs(ms), value = ams, unitIndex = 0;
		iterateOverDateUnits(function(name, unit, i) {
			next = floor(withPrecision(ams / unit.multiplier(), 1));
			if(next >= 1) {
				value = next;
				unitIndex = i;
			}
		}, 1);
		return [value, unitIndex, ms];
	}

	function getRelativeWithMonthFallback(date) {
		var adu = getAdjustedUnit(sugarDate.millisecondsFromNow(date));
		if(allowMonthFallback(date, adu)) {
			adu[0] = abs(sugarDate.monthsFromNow(date));
			adu[1] = 6;
		}
		return adu;
	}

	function allowMonthFallback(date, adu) {
		return adu[1] === 6 ||
		(adu[1] === 5 && adu[0] === 4 && sugarDate.daysFromNow(date) >= getDaysInMonth(getNewDate()));
	}

	function createMeridianTokens(slice, caps) {
		var fn = function(d, localeCode) {
			var hours = callDateGet(d, 'Hours');
			return getLocalization(localeCode).get('ampm')[floor(hours / 12)] || '';
		}
		createFormatToken('t', fn, 1);
		createFormatToken('tt', fn);
		createFormatToken('T', fn, 1, 1);
		createFormatToken('TT', fn, null, 2);
	}

	function createWeekdayTokens(slice, caps) {
		var fn = function(d, localeCode) {
			var dow = callDateGet(d, 'Day');
			return getLocalization(localeCode)['weekdays'][dow];
		}
		createFormatToken('dow', fn, 3);
		createFormatToken('Dow', fn, 3, 1);
		createFormatToken('weekday', fn);
		createFormatToken('Weekday', fn, null, 1);
	}

	function createMonthTokens(slice, caps) {
		createMonthToken('mon', 0, 3);
		createMonthToken('month', 0);
		createMonthToken('month2', 1);
		createMonthToken('month3', 2);
	}

	function createMonthToken(token, multiplier, slice) {
		var fn = function(d, localeCode) {
			var month = callDateGet(d, 'Month');
			return getLocalization(localeCode)['months'][month + (multiplier * 12)];
		};
		createFormatToken(token, fn, slice);
		createFormatToken(simpleCapitalize(token), fn, slice, 1);
	}

	function createFormatToken(t, fn, slice, caps) {
		DateFormatTokens[t] = function(d, localeCode) {
			var str = fn(d, localeCode);
			if(slice) str = str.slice(0, slice);
			if(caps)  str = str.slice(0, caps).toUpperCase() + str.slice(caps);
			return str;
		}
	}

	function createPaddedToken(t, fn, ms) {
		DateFormatTokens[t] = fn;
		DateFormatTokens[t + t] = function (d, localeCode) {
			return padNumber(fn(d, localeCode), 2);
		};
		if(ms) {
			DateFormatTokens[t + t + t] = function (d, localeCode) {
				return padNumber(fn(d, localeCode), 3);
			};
			DateFormatTokens[t + t + t + t] = function (d, localeCode) {
				return padNumber(fn(d, localeCode), 4);
			};
		}
	}

	function buildCompiledOutputFormat(format) {
		var match = format.match(/(\{\w+\})|[^{}]+/g);
		CompiledOutputFormats[format] = match.map(function(p) {
			p.replace(/\{(\w+)\}/, function(full, token) {
				p = DateFormatTokens[token] || token;
				return token;
			});
			return p;
		});
	}

	function executeCompiledOutputFormat(date, format, localeCode) {
		var compiledFormat, length, i, t, result = '';
		compiledFormat = CompiledOutputFormats[format];
		for(i = 0, length = compiledFormat.length; i < length; i++) {
			t = compiledFormat[i];
			result += isFunction(t) ? t(date, localeCode) : t;
		}
		return result;
	}

	function formatDate(date, format, relative, localeCode) {
		var adu;
		if(!isValid(date)) {
			return 'Invalid Date';
		} else if(isString(sugarDate[format])) {
			format = sugarDate[format];
		} else if(isFunction(format)) {
			adu = getRelativeWithMonthFallback(date);
			format = format.apply(date, adu.concat(getLocalization(localeCode)));
		}
		if(!format && relative) {
			adu = adu || getRelativeWithMonthFallback(date);
			if(adu[1] === 0) {
				adu[1] = 1;
				adu[0] = 1;
			}
			return getLocalization(localeCode).getRelativeFormat(adu);
		}
		format = format || 'long';
		if(format === 'short' || format === 'long' || format === 'full') {
			format = getLocalization(localeCode)[format];
		}

		if(!CompiledOutputFormats[format]) {
			buildCompiledOutputFormat(format);
		}

		return executeCompiledOutputFormat(date, format, localeCode);
	}

	function fullCompareDate(d, f, margin, utc) {
		var tmp, comp;
		if(!isValid(d)) return;
		if(isString(f)) {
			f = f.trim().toLowerCase();
			comp = setUTC(cloneDate(d), utc);
			switch(true) {
				case f === 'future':  return d.getTime() > getNewDate().getTime();
				case f === 'past':    return d.getTime() < getNewDate().getTime();
				case f === 'weekday': return callDateGet(comp, 'Day') > 0 && callDateGet(comp, 'Day') < 6;
				case f === 'weekend': return callDateGet(comp, 'Day') === 0 || callDateGet(comp, 'Day') === 6;
				case (tmp = English['weekdays'].indexOf(f) % 7) > -1: return callDateGet(comp, 'Day') === tmp;
				case (tmp = English['months'].indexOf(f) % 12) > -1:  return callDateGet(comp, 'Month') === tmp;
			}
		}
		return compareDate(d, f, null, margin, utc);
	}

	function compareDate(d, find, localeCode, buffer, forceUTC) {
		var p, t, min, max, override, accuracy = 0, loBuffer = 0, hiBuffer = 0;
		p = getExtendedDate(find, localeCode, null, forceUTC);
		if(buffer > 0) {
			loBuffer = hiBuffer = buffer;
			override = true;
		}
		if(!isValid(p.date)) return false;
		if(p.set && p.set.specificity) {
			if(p.set['edge'] || p.set['shift']) {
				moveToBeginningOfUnit(p.date, p.set.specificity);
			}
			if(p.set.specificity === 'month') {
				max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity).getTime();
			} else {
				max = advanceDate(cloneDate(p.date), ['1 ' + p.set.specificity]).getTime() - 1;
			}
			if(!override && p.set['sign'] && p.set.specificity !== 'millisecond') {
				loBuffer = 50;
				hiBuffer = -50;
			}
		}
		t   = d.getTime();
		min = p.date.getTime();
		max = max || (min + accuracy);
		max = compensateForTimezoneTraversal(d, min, max);
		return t >= (min - loBuffer) && t <= (max + hiBuffer);
	}

	function compensateForTimezoneTraversal(d, min, max) {
		var dMin, dMax, minOffset, maxOffset;
		dMin = new date(min);
		dMax = setUTC(new date(max), isUTC(d));
		if(callDateGet(dMax, 'Hours') !== 23) {
			minOffset = dMin.getTimezoneOffset();
			maxOffset = dMax.getTimezoneOffset();
			if(minOffset !== maxOffset) {
				max += (maxOffset - minOffset).minutes();
			}
		}
		return max;
	}

	function updateDate(d, params, reset, advance, prefer) {
		var weekday, specificityIndex;

		function getParam(key) {
			return isDefined(params[key]) ? params[key] : params[key + 's'];
		}

		function paramExists(key) {
			return isDefined(getParam(key));
		}

		function uniqueParamExists(key, isDay) {
			return paramExists(key) || (isDay && paramExists('weekday'));
		}

		function canDisambiguate() {
			switch(prefer) {
				case -1: return d > getNewDate();
				case  1: return d < getNewDate();
			}
		}

		if(isNumber(params) && advance) {
			params = { 'milliseconds': params };
		} else if(isNumber(params)) {
			d.setTime(params);
			return d;
		}
		if(isDefined(params['date'])) {
			params['day'] = params['date'];
		}
		iterateOverDateUnits(function(name, unit, i) {
			var isDay = name === 'day';
			if(uniqueParamExists(name, isDay)) {
				params.specificity = name;
				specificityIndex = +i;
				return false;
			} else if(reset && name !== 'week' && (!isDay || !paramExists('week'))) {
				callDateSet(d, unit.method, (isDay ? 1 : 0));
			}
		});
		DateUnits.forEach(function(u, i) {
			var name = u.name, method = u.method, higherUnit = DateUnits[i - 1], value;
			value = getParam(name)
			if(isUndefined(value)) return;
			if(advance) {
				if(name === 'week') {
					value  = (params['day'] || 0) + (value * 7);
					method = 'Date';
				}
				value = (value * advance) + callDateGet(d, method);
			} else if(name === 'month' && paramExists('day')) {
				callDateSet(d, 'Date', 15);
			}
			callDateSetWithWeek(d, method, value);
			if(advance && name === 'month') {
				checkMonthTraversal(d, value);
			}
		});
		if(!advance && !paramExists('day') && paramExists('weekday')) {
			var weekday = getParam('weekday'), isAhead, futurePreferred;
			setWeekday(d, weekday);
		}
		if(canDisambiguate()) {
			iterateOverDateUnits(function(name, u) {
				var ambiguous = u.ambiguous || (name === 'week' && paramExists('weekday'));
				if(ambiguous && !uniqueParamExists(name, name === 'day')) {
					sugarDate[u.addMethod](d, prefer);
					return false;
				} else if(name === 'year' && hasAbbreviatedYear(params)) {
					advanceDate(d, [{'years': 100 * prefer}]);
				}
			}, specificityIndex + 1);
		}
		return d;
	}
	function prepareTime(format, loc, iso) {
		var timeSuffixMapping = {'h':0,'m':1,'s':2}, add;
		loc = loc || English;
		return format.replace(/{([a-z])}/g, function(full, token) {
			var separators = [],
					isHours = token === 'h',
					tokenIsRequired = isHours && !iso;
			if(token === 't') {
				return loc.get('ampm').join('|');
			} else {
				if(isHours) {
					separators.push(':');
				}
				if(add = loc['timeSuffixes'][timeSuffixMapping[token]]) {
					separators.push(add + '\\s*');
				}
				return separators.length === 0 ? '' : '(?:' + separators.join('|') + ')' + (tokenIsRequired ? '' : '?');
			}
		});
	}

	function checkMonthTraversal(date, targetMonth) {
		if(targetMonth < 0) {
			targetMonth = targetMonth % 12 + 12;
		}
		if(targetMonth % 12 !== callDateGet(date, 'Month')) {
			callDateSet(date, 'Date', 0);
		}
	}

	function createDate(args, prefer, forceUTC) {
		var f, localeCode;
		if(isNumber(args[1])) {
			f = collectDateArguments(args)[0];
		} else {
			f          = args[0];
			localeCode = args[1];
		}
		return getExtendedDate(f, localeCode, prefer, forceUTC).date;
	}

	function invalidateDate(d) {
		d.setTime(NaN);
	}

	function buildDateUnits() {
		DateUnitsReversed = DateUnits.concat().reverse();
		DateArgumentUnits = DateUnits.concat();
		DateArgumentUnits.splice(2,1);
	}

	function buildDateMethods() {
		extendSimilar(date, DateUnits, function(methods, u, i) {
			var name = u.name, caps = simpleCapitalize(name), multiplier = u.multiplier(), since, until;
			u.addMethod = 'add' + caps + 's';
			function applyErrorMargin(ms) {
				var num      = ms / multiplier,
						fraction = num % 1,
						error    = u.error || 0.999;
				if(fraction && abs(fraction % 1) > error) {
					num = round(num);
				}
				return num < 0 ? ceil(num) : floor(num);
			}
			since = function(f, localeCode) {
				return applyErrorMargin(this.getTime() - createDate([f, localeCode]).getTime());
			};
			until = function(f, localeCode) {
				return applyErrorMargin(createDate([f, localeCode]).getTime() - this.getTime());
			};
			methods[name+'sAgo']     = until;
			methods[name+'sUntil']   = until;
			methods[name+'sSince']   = since;
			methods[name+'sFromNow'] = since;
			methods[u.addMethod] = function(num, reset) {
				var set = {};
				set[name] = num;
				return advanceDate(this, [set, reset]);
			};
			buildNumberToDateAlias(u, multiplier);
			if(i < 3) {
				['Last','This','Next'].forEach(function(shift) {
					methods['is' + shift + caps] = function() {
						return compareDate(this, shift + ' ' + name, 'en');
					};
				});
			}
			if(i < 4) {
				methods['beginningOf' + caps] = function() {
					return moveToBeginningOfUnit(this, name);
				};
				methods['endOf' + caps] = function() {
					return moveToEndOfUnit(this, name);
				};
			}
		});
	}

	function buildCoreInputFormats() {
		English.addFormat('([+-])?(\\d{4,4})[-.\\/]?{full_month}[-.]?(\\d{1,2})?', true, ['year_sign','year','month','date'], false, true);
		English.addFormat('(\\d{1,2})[-.\\/]{full_month}(?:[-.\\/](\\d{2,4}))?', true, ['date','month','year'], true);
		English.addFormat('{full_month}[-.](\\d{4,4})', false, ['month','year']);
		English.addFormat('\\/Date\\((\\d+(?:[+-]\\d{4,4})?)\\)\\/', false, ['timestamp'])
		English.addFormat(prepareTime(RequiredTime, English), false, TimeFormat)
		CoreDateFormats = English.compiledFormats.slice(0,7).reverse();
		English.compiledFormats = English.compiledFormats.slice(7).concat(CoreDateFormats);
	}

	function buildFormatTokens() {

		createPaddedToken('f', function(d) {
			return callDateGet(d, 'Milliseconds');
		}, true);

		createPaddedToken('s', function(d) {
			return callDateGet(d, 'Seconds');
		});

		createPaddedToken('m', function(d) {
			return callDateGet(d, 'Minutes');
		});

		createPaddedToken('h', function(d) {
			return callDateGet(d, 'Hours') % 12 || 12;
		});

		createPaddedToken('H', function(d) {
			return callDateGet(d, 'Hours');
		});

		createPaddedToken('d', function(d) {
			return callDateGet(d, 'Date');
		});

		createPaddedToken('M', function(d) {
			return callDateGet(d, 'Month') + 1;
		});

		createMeridianTokens();
		createWeekdayTokens();
		createMonthTokens();
		DateFormatTokens['ms']           = DateFormatTokens['f'];
		DateFormatTokens['milliseconds'] = DateFormatTokens['f'];
		DateFormatTokens['seconds']      = DateFormatTokens['s'];
		DateFormatTokens['minutes']      = DateFormatTokens['m'];
		DateFormatTokens['hours']        = DateFormatTokens['h'];
		DateFormatTokens['24hr']         = DateFormatTokens['H'];
		DateFormatTokens['12hr']         = DateFormatTokens['h'];
		DateFormatTokens['date']         = DateFormatTokens['d'];
		DateFormatTokens['day']          = DateFormatTokens['d'];
		DateFormatTokens['year']         = DateFormatTokens['yyyy'];

	}

	function buildFormatShortcuts() {
		extendSimilar(date, 'short,long,full', function(methods, name) {
			methods[name] = function(localeCode) {
				return formatDate(this, name, false, localeCode);
			}
		});
	}

	function buildAsianDigits() {
		KanjiDigits.split('').forEach(function(digit, value) {
			var holder;
			if(value > 9) {
				value = pow(10, value - 9);
			}
			AsianDigitMap[digit] = value;
		});
		simpleMerge(AsianDigitMap, NumberNormalizeMap);
		AsianDigitReg = regexp('([期週周])?([' + KanjiDigits + FullWidthDigits + ']+)(?!昨)', 'g');
	}

	function buildRelativeAliases() {
		var special  = 'today,yesterday,tomorrow,weekday,weekend,future,past'.split(',');
		var weekdays = English['weekdays'].slice(0,7);
		var months   = English['months'].slice(0,12);
		extendSimilar(date, special.concat(weekdays).concat(months), function(methods, name) {
			methods['is'+ simpleCapitalize(name)] = function(utc) {
				return fullCompareDate(this, name, 0, utc);
			};
		});
	}

	function buildUTCAliases() {
		extend(date, {
			'utc': {
				'create': function() {
					return createDate(arguments, 0, true);
				},
				'past': function() {
					return createDate(arguments, -1, true);
				},
				'future': function() {
					return createDate(arguments, 1, true);
				}
			}
		}, false);
	}

	function setDateProperties() {
		extend(date, {
			'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {tz}',
			'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {tz}',
			'ISO8601_DATE': '{yyyy}-{MM}-{dd}',
			'ISO8601_DATETIME': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{fff}{isotz}'
		}, false);
	}

	extend(date, {

		'create': function() {
			return createDate(arguments);
		},
		'past': function() {
			return createDate(arguments, -1);
		},
		'future': function() {
			return createDate(arguments, 1);
		},
		'addLocale': function(localeCode, set) {
			return setLocalization(localeCode, set);
		},
		'setLocale': function(localeCode, set) {
			var loc = getLocalization(localeCode, false);
			CurrentLocalization = loc;
			if(localeCode && localeCode !== loc['code']) {
				loc['code'] = localeCode;
			}
			return loc;
		},
		'getLocale': function(localeCode) {
			return !localeCode ? CurrentLocalization : getLocalization(localeCode, false);
		},
		'addFormat': function(format, match, localeCode) {
			addDateInputFormat(getLocalization(localeCode), format, match);
		}

	}, false);

	extend(date, {

		'set': function() {
			return setDate(this, arguments);
		},
		'setWeekday': function(dow) {
			return setWeekday(this, dow);
		},
		'setISOWeek': function(num) {
			return setWeekNumber(this, num);
		},
		'getISOWeek': function() {
			return getWeekNumber(this);
		},
		'beginningOfISOWeek': function() {
			var day = this.getDay();
			if(day === 0) {
				day = -6;
			} else if(day !== 1) {
				day = 1;
			}
			setWeekday(this, day);
			return resetDate(this);
		},
		'endOfISOWeek': function() {
			if(this.getDay() !== 0) {
				setWeekday(this, 7);
			}
			return moveToEndOfUnit(this, 'day');
		},
		'getUTCOffset': function(iso) {
			return getUTCOffset(this, iso);
		},
		'setUTC': function(set) {
			return setUTC(this, set);
		},
		'isUTC': function() {
			return isUTC(this);
		},
		'advance': function() {
			return advanceDate(this, arguments);
		},
		'rewind': function() {
			var args = collectDateArguments(arguments, true);
			return updateDate(this, args[0], args[1], -1);
		},
		'isValid': function() {
			return isValid(this);
		},
		'isAfter': function(d, margin, utc) {
			return this.getTime() > createDate([d]).getTime() - (margin || 0);
		},
		'isBefore': function(d, margin) {
			return this.getTime() < createDate([d]).getTime() + (margin || 0);
		},
		'isBetween': function(d1, d2, margin) {
			var t  = this.getTime();
			var t1 = createDate([d1]).getTime();
			var t2 = createDate([d2]).getTime();
			var lo = min(t1, t2);
			var hi = max(t1, t2);
			margin = margin || 0;
			return (lo - margin < t) && (hi + margin > t);
		},
		'isLeapYear': function() {
			return isLeapYear(this);
		},
		'daysInMonth': function() {
			return getDaysInMonth(this);
		},
		'format': function(f, localeCode) {
			return formatDate(this, f, false, localeCode);
		},
		'relative': function(fn, localeCode) {
			if(isString(fn)) {
				localeCode = fn;
				fn = null;
			}
			return formatDate(this, fn, true, localeCode);
		},
		'is': function(f, margin, utc) {
			return fullCompareDate(this, f, margin, utc);
		},
		'reset': function(unit) {
			return resetDate(this, unit);
		},
		'clone': function() {
			return cloneDate(this);
		},
		'iso': function() {
			return this.toISOString();
		},
		'getWeekday': function() {
			return this.getDay();
		},
		'getUTCWeekday': function() {
			return this.getUTCDay();
		}

	});

	function buildNumberToDateAlias(u, multiplier) {
		var name = u.name, methods = {};
		function base() {
			return round(this * multiplier);
		}
		function after() {
			return sugarDate[u.addMethod](createDate(arguments), this);
		}
		function before() {
			return sugarDate[u.addMethod](createDate(arguments), -this);
		}
		methods[name] = base;
		methods[name + 's'] = base;
		methods[name + 'Before'] = before;
		methods[name + 'sBefore'] = before;
		methods[name + 'Ago'] = before;
		methods[name + 'sAgo'] = before;
		methods[name + 'After'] = after;
		methods[name + 'sAfter'] = after;
		methods[name + 'FromNow'] = after;
		methods[name + 'sFromNow'] = after;
		extend(number, methods);
	}

	extend(number, {

		'duration': function(localeCode) {
			return getLocalization(localeCode).getDuration(this);
		}

	});

	English = CurrentLocalization = sugarDate.addLocale('en', {
		'plural':     true,
		'timeMarker': 'at',
		'ampm':       'am,pm',
		'months':     'January,February,March,April,May,June,July,August,September,October,November,December',
		'weekdays':   'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
		'units':      'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
		'numbers':    'one,two,three,four,five,six,seven,eight,nine,ten',
		'articles':   'a,an,the',
		'tokens':     'the,st|nd|rd|th,of',
		'short':      '{Month} {d}, {yyyy}',
		'long':       '{Month} {d}, {yyyy} {h}:{mm}{tt}',
		'full':       '{Weekday} {Month} {d}, {yyyy} {h}:{mm}:{ss}{tt}',
		'past':       '{num} {unit} {sign}',
		'future':     '{num} {unit} {sign}',
		'duration':   '{num} {unit}',
		'modifiers': [
			{ 'name': 'sign',  'src': 'ago|before', 'value': -1 },
			{ 'name': 'sign',  'src': 'from now|after|from|in|later', 'value': 1 },
			{ 'name': 'edge',  'src': 'last day', 'value': -2 },
			{ 'name': 'edge',  'src': 'end', 'value': -1 },
			{ 'name': 'edge',  'src': 'first day|beginning', 'value': 1 },
			{ 'name': 'shift', 'src': 'last', 'value': -1 },
			{ 'name': 'shift', 'src': 'the|this', 'value': 0 },
			{ 'name': 'shift', 'src': 'next', 'value': 1 }
		],
		'dateParse': [
			'{month} {year}',
			'{shift} {unit=5-7}',
			'{0?} {date}{1}',
			'{0?} {edge} of {shift?} {unit=4-7?} {month?} {year?}'
		],
		'timeParse': [
			'{num} {unit} {sign}',
			'{sign} {num} {unit}',
			'{0} {num}{1} {day} of {month} {year?}',
			'{weekday?} {month} {date}{1?} {year?}',
			'{date} {month} {year}',
			'{date} {month}',
			'{shift} {weekday}',
			'{shift} week {weekday}',
			'{weekday} {2?} {shift} week',
			'{num} {unit=4-5} {sign} {day}',
			'{0?} {date}{1} of {month}',
			'{0?}{month?} {date?}{1?} of {shift} {unit=6-7}',
			'{edge} of {day}'
		]
	});

	buildDateUnits();
	buildDateMethods();
	buildCoreInputFormats();
	buildFormatTokens();
	buildFormatShortcuts();
	buildAsianDigits();
	buildRelativeAliases();
	buildUTCAliases();
	setDateProperties();

	var DATE_UNITS               = 'year|month|week|day|hour|minute|(?:milli)?second';
	var FULL_CAPTURED_DURATION   = '((?:\\d+)?\\s*(?:' + DATE_UNITS + '))s?';
	var RANGE_REG                = /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i;
	var DURATION_REG             = regexp('(\\d+)?\\s*('+ DATE_UNITS +')s?', 'i');
	var RANGE_REG_FRONT_DURATION = regexp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s*at\\s*(.+)', 'i');
	var RANGE_REG_REAR_DURATION  = regexp('(.+)\\s*for\\s*' + FULL_CAPTURED_DURATION, 'i');

	function Range(start, end) {
		this.start = cloneRangeMember(start);
		this.end   = cloneRangeMember(end);
	};

	function getRangeMemberNumericValue(m) {
		return isString(m) ? m.charCodeAt(0) : m;
	}

	function getRangeMemberPrimitiveValue(m) {
		if(m == null) return m;
		return isDate(m) ? m.getTime() : m.valueOf();
	}

	function getPrecision(n) {
		var split = n.toString().split('.');
		return split[1] ? split[1].length : 0;
	}

	function getGreaterPrecision(n1, n2) {
		return max(getPrecision(n1), getPrecision(n2));
	}

	function getSimpleDate(str) {
		return str == null ? new date() : new date(str);
	}

	function getSugarExtendedDate(d) {
		return sugarDate.create(d);
	}

	function dateConstructorIsExtended() {
		return !!sugarDate.create;
	}

	function createDateRangeFromString(str) {
		var match, datetime, duration, dio, start, end;
		if(match = str.match(RANGE_REG)) {
			return DateRangeConstructor(match[1], match[2]);
		}
		if(match = str.match(RANGE_REG_FRONT_DURATION)) {
			duration = match[1];
			datetime = match[2];
		}
		if(match = str.match(RANGE_REG_REAR_DURATION)) {
			datetime = match[1];
			duration = match[2];
		}
		if(datetime && duration) {
			start = getSugarExtendedDate(datetime);
			dio = getDateIncrementObject(duration);
			end = incrementDate(start, dio[0], dio[1]);
		}
		return DateRangeConstructor(start, end);
	}

	function cloneRangeMember(m) {
		if(isDate(m)) {
			return new date(m.getTime());
		} else {
			return getRangeMemberPrimitiveValue(m);
		}
	}

	function isValidRangeMember(m) {
		var val = getRangeMemberPrimitiveValue(m);
		return (!!val || val === 0) && valueIsNotInfinite(m);
	}

	function valueIsNotInfinite(m) {
		return m !== -Infinity && m !== Infinity;
	}

	function getDateIncrementObject(amt) {
		var match, val, unit;
		if(isNumber(amt)) {
			return [amt, 'Milliseconds'];
		}
		match = amt.match(DURATION_REG);
		val = parseInt(match[1]) || 1;
		unit = match[2].slice(0,1).toUpperCase() + match[2].slice(1).toLowerCase();
		if(unit.match(/hour|minute|second/i)) {
			unit += 's';
		} else if(unit === 'Year') {
			unit = 'FullYear';
		} else if(unit === 'Day') {
			unit = 'Date';
		}
		return [val, unit];
	}

	function incrementDate(current, amount, unit) {
		var val  = callDateGet(current, unit);
		var d    = new date(current.getTime());
		callDateSet(d, unit, val + amount);
		return d;
	}

	function incrementString(current, amount) {
		return string.fromCharCode(current.charCodeAt(0) + amount);
	}

	function incrementNumber(current, amount, precision) {
		return withPrecision(current + amount, precision);
	}

	Range.prototype.toString = function() {
		return this.isValid() ? this.start + ".." + this.end : 'Invalid Range';
	};

	extend(Range, {

		'isValid': function() {
			return isValidRangeMember(this.start) && isValidRangeMember(this.end) && typeof this.start === typeof this.end;
		},
		'span': function() {
			return this.isValid() ? abs(
				getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start)
			) + 1 : NaN;
		},
		'contains': function(obj) {
			var self = this, arr;
			if(obj == null) return false;
			if(obj.start && obj.end) {
				return obj.start >= this.start && obj.start <= this.end &&
							 obj.end   >= this.start && obj.end   <= this.end;
			} else {
				return obj >= this.start && obj <= this.end;
			}
		},
		'every': function(amount, fn) {
			var increment,
					precision,
					dio,
					unit,
					start   = this.start,
					end     = this.end,
					inverse = end < start,
					current = start,
					index   = 0,
					result  = [];

			if(!this.isValid()) {
				return [];
			}
			if(isFunction(amount)) {
				fn = amount;
				amount = null;
			}
			amount = amount || 1;
			if(isNumber(start)) {
				precision = getGreaterPrecision(start, amount);
				increment = function() {
					return incrementNumber(current, amount, precision);
				};
			} else if(isString(start)) {
				increment = function() {
					return incrementString(current, amount);
				};
			} else if(isDate(start)) {
				dio = getDateIncrementObject(amount);
				amount = dio[0];
				unit = dio[1];
				increment = function() {
					return incrementDate(current, amount, unit);
				};
			}
			if(inverse && amount > 0) {
				amount *= -1;
			}
			while(inverse ? current >= end : current <= end) {
				result.push(current);
				if(fn) {
					fn(current, index);
				}
				current = increment();
				index++;
			}
			return result;
		},
		'union': function(range) {
			return new Range(
				this.start < range.start ? this.start : range.start,
				this.end   > range.end   ? this.end   : range.end
			);
		},
		'intersect': function(range) {
			if(range.start > this.end || range.end < this.start) {
				return new Range(NaN, NaN);
			}
			return new Range(
				this.start > range.start ? this.start : range.start,
				this.end   < range.end   ? this.end   : range.end
			);
		},
		'clone': function(range) {
			return new Range(this.start, this.end);
		},
		'clamp': function(obj) {
			var clamped,
					start = this.start,
					end = this.end,
					min = end < start ? end : start,
					max = start > end ? start : end;
			if(obj < min) {
				clamped = min;
			} else if(obj > max) {
				clamped = max;
			} else {
				clamped = obj;
			}
			return cloneRangeMember(clamped);
		}

	});

	 function extendRangeConstructor(klass, constructor) {
		 extend(klass, { 'range': constructor }, false);
	 }

	 var PrimitiveRangeConstructor = function(start, end) {
		 return new Range(start, end);
	 };

	 var DateRangeConstructor = function(start, end) {
		 if(dateConstructorIsExtended()) {
			 if(arguments.length === 1 && isString(start)) {
				 return createDateRangeFromString(start);
			 }
			 start = getSugarExtendedDate(start);
			 end   = getSugarExtendedDate(end);
		 } else {
			 start = getSimpleDate(start);
			 end   = getSimpleDate(end);
		 }
		 return new Range(start, end);
	 };

	 extendRangeConstructor(number, PrimitiveRangeConstructor);
	 extendRangeConstructor(string, PrimitiveRangeConstructor);
	 extendRangeConstructor(date, DateRangeConstructor);

	extend(number, {

		'upto': function(num, fn, step) {
			return new Range(this, num).every(step, fn);
		},
		'clamp': function(start, end) {
			return new Range(start, end).clamp(this);
		},
		'cap': function(max) {
			return new Range(Undefined, max).clamp(this);
		}

	});

	alias(number, 'downto', 'upto');

	extend(array, {

		'create': function(range) {
			return range.every();
		}

	}, false, function(a) { return a instanceof Range; });

	function setDelay(fn, ms, after, scope, args) {
		if(ms === Infinity) return;
		if(!fn.timers) fn.timers = [];
		if(!isNumber(ms)) ms = 1;
		fn._canceled = false;
		fn.timers.push(setTimeout(function(){
			if(!fn._canceled) {
				after.apply(scope, args || []);
			}
		}, ms));
	}

	function cancelFunction(fn) {
		var timers = fn.timers, timer;
		if(isArray(timers)) {
			while(timer = timers.shift()) {
				clearTimeout(timer);
			}
		}
		fn._canceled = true;
		return fn;
	}

	function createLazyFunction(fn, ms, immediate, limit) {
		var queue = [], locked = false, execute, rounded, perExecution, result;
		ms = ms || 1;
		limit = limit || Infinity;
		rounded = ceil(ms);
		perExecution = round(rounded / ms) || 1;
		execute = function() {
			var queueLength = queue.length, maxPerRound;
			if(queueLength == 0) return;
			maxPerRound = max(queueLength - perExecution, 0);
			while(queueLength > maxPerRound) {
				result = func.prototype.apply.apply(fn, queue.shift());
				queueLength--;
			}
			setDelay(lazy, rounded, function() {
				locked = false;
				execute();
			});
		}
		function lazy() {
			if(queue.length < limit - (locked && immediate ? 1 : 0)) {
				queue.push([this, arguments]);
			}
			if(!locked) {
				locked = true;
				if(immediate) {
					execute();
				} else {
					setDelay(lazy, rounded, execute);
				}
			}
			return result;
		}
		return lazy;
	}

	extend(func, {

		'lazy': function(ms, immediate, limit) {
			return createLazyFunction(this, ms, immediate, limit);
		},
		'throttle': function(ms) {
			return createLazyFunction(this, ms, true, 1);
		},
		'debounce': function(ms) {
			var fn = this;
			function debounced() {
				cancelFunction(debounced);
				setDelay(debounced, ms, fn, this, arguments);
			};
			return debounced;
		},
		'delay': function(ms) {
			var fn = this;
			var args = multiArgs(arguments, null, 1);
			setDelay(fn, ms, fn, fn, args);
			return fn;
		},
		'every': function(ms) {
			var fn = this, args = arguments;
			args = args.length > 1 ? multiArgs(args, null, 1) : [];
			function execute () {
				fn.apply(fn, args);
				setDelay(fn, ms, execute);
			}
			setDelay(fn, ms, execute);
			return fn;
		},
		'cancel': function() {
			return cancelFunction(this);
		},
		'after': function(num) {
			var fn = this, counter = 0, storedArguments = [];
			if(!isNumber(num)) {
				num = 1;
			} else if(num === 0) {
				fn.call();
				return fn;
			}
			return function() {
				var ret;
				storedArguments.push(multiArgs(arguments));
				counter++;
				if(counter == num) {
					ret = fn.call(this, storedArguments);
					counter = 0;
					storedArguments = [];
					return ret;
				}
			}
		},
		'once': function() {
			return createLazyFunction(this, Infinity, true, 1);
		},
		'fill': function() {
			var fn = this, curried = multiArgs(arguments);
			return function() {
				var args = multiArgs(arguments);
				curried.forEach(function(arg, index) {
					if(arg != null || index >= args.length) args.splice(index, 0, arg);
				});
				return fn.apply(this, args);
			}
		}

	});

	function getThousands() {
		var str = sugarNumber.thousands;
		return isString(str) ? str : ',';
	}

	function getDecimal() {
		var str = sugarNumber.decimal;
		return isString(str) ? str : '.';
	}

	function abbreviateNumber(num, roundTo, str, mid, limit, bytes) {
		var fixed        = num.toFixed(20),
				decimalPlace = fixed.search(/\./),
				numeralPlace = fixed.search(/[1-9]/),
				significant  = decimalPlace - numeralPlace,
				unit, i, divisor;
		if(significant > 0) {
			significant -= 1;
		}
		i = max(min(floor(significant / 3), limit === false ? str.length : limit), -mid);
		unit = str.charAt(i + mid - 1);
		if(significant < -9) {
			i = -3;
			roundTo = abs(significant) - 9;
			unit = str.slice(0,1);
		}
		divisor = bytes ? pow(2, 10 * i) : pow(10, i * 3);
		return formatNumber(withPrecision(num / divisor, roundTo || 0)) + unit.trim();
	}

	function formatNumber(num, place) {
		var i, str, split, integer, fraction, result = '';
		var thousands = getThousands();
		var decimal   = getDecimal();
		str      = (isNumber(place) ? withPrecision(num, place || 0).toFixed(max(place, 0)) : num.toString()).replace(/^-/, '');
		split    = str.split('.');
		integer  = split[0];
		fraction = split[1];
		for(i = integer.length; i > 0; i -= 3) {
			if(i < integer.length) {
				result = thousands + result;
			}
			result = integer.slice(max(0, i - 3), i) + result;
		}
		if(fraction) {
			result += decimal + repeatString('0', (place || 0) - fraction.length) + fraction;
		}
		return (num < 0 ? '-' : '') + result;
	}

	function isInteger(n) {
		return n % 1 === 0;
	}

	function isMultiple(n1, n2) {
		return n1 % n2 === 0;
	}

	extend(number, {

		'random': function(n1, n2) {
			var minNum, maxNum;
			if(arguments.length == 1) n2 = n1, n1 = 0;
			minNum = min(n1 || 0, isUndefined(n2) ? 1 : n2);
			maxNum = max(n1 || 0, isUndefined(n2) ? 1 : n2) + 1;
			return floor((math.random() * (maxNum - minNum)) + minNum);
		}

	}, false);

	extend(number, {

		'isNaN': function(value) {
			return value !== value;
		}

	}, false, true);

	extend(number, {

		'log': function(base) {
			 return math.log(this) / (base ? math.log(base) : 1);
		 },
		'abbr': function(precision) {
			return abbreviateNumber(this, precision, 'kmbt', 0, 4);
		},
		'metric': function(precision, limit) {
			return abbreviateNumber(this, precision, 'nμm kMGTPE', 4, isUndefined(limit) ? 1 : limit);
		},
		'bytes': function(precision, limit, si) {
			return abbreviateNumber(this, precision, 'kMGTPE', 0, isUndefined(limit) ? 4 : limit, si !== true) + 'B';
		},
		'isInteger': function() {
			return isInteger(this);
		},
		'isOdd': function() {
			return isInteger(this) && !isMultiple(this, 2);
		},
		'isEven': function() {
			return isMultiple(this, 2);
		},
		'isMultipleOf': function(num) {
			return isMultiple(this, num);
		},
		'format': function(place) {
			return formatNumber(this, place);
		},
		'hex': function(pad) {
			return padNumber(this, pad || 1, false, 16);
		},
		'times': function(fn) {
			if(fn) {
				for(var i = 0; i < this; i++) {
					fn.call(this, i);
				}
			}
			return +this;
		},
		'chr': function() {
			return string.fromCharCode(this);
		},
		'pad': function(place, sign, base) {
			return padNumber(this, place, sign, base);
		},
		'ordinalize': function() {
			var suffix, num = abs(this), last = parseInt(num.toString().slice(-2));
			return this + getOrdinalizedSuffix(last);
		},
		'toNumber': function() {
			return parseFloat(this, 10);
		}

	});

	function buildNumber() {
		function createRoundingFunction(fn) {
			return function (precision) {
				return precision ? withPrecision(this, precision, fn) : fn(this);
			}
		}
		extend(number, {
			'ceil':   createRoundingFunction(ceil),
			'round':  createRoundingFunction(round),
			'floor':  createRoundingFunction(floor)
		});
		extendSimilar(number, 'abs,pow,sin,asin,cos,acos,tan,atan,exp,pow,sqrt', function(methods, name) {
			methods[name] = function(a, b) {
				return math[name](this.valueOf(), a, b);
			}
		});
	}

	buildNumber();

	var ObjectTypeMethods = 'isObject,isNaN'.split(',');
	var ObjectHashMethods = 'equals,keys,values,select,reject,each,map,size,merge,clone,watch,tap,has,toQueryString'.split(',');

	function setParamsObject(obj, param, value, castBoolean) {
		var reg = /^(.+?)(\[.*\])$/, paramIsArray, match, allKeys, key;
		if(match = param.match(reg)) {
			key = match[1];
			allKeys = match[2].replace(/^\[|\]$/g, '').split('][');
			allKeys.forEach(function(k) {
				paramIsArray = !k || k.match(/^\d+$/);
				if(!key && isArray(obj)) key = obj.length;
				if(!hasOwnProperty(obj, key)) {
					obj[key] = paramIsArray ? [] : {};
				}
				obj = obj[key];
				key = k;
			});
			if(!key && paramIsArray) key = obj.length.toString();
			setParamsObject(obj, key, value, castBoolean);
		} else if(castBoolean && value === 'true') {
			obj[param] = true;
		} else if(castBoolean && value === 'false') {
			obj[param] = false;
		} else {
			obj[param] = value;
		}
	}

	function objectToQueryString(base, obj) {
		var tmp;
		if(isArray(obj) || (isObjectType(obj) && obj.toString === internalToString)) {
			tmp = [];
			iterateOverObject(obj, function(key, value) {
				if(base) {
					key = base + '[' + key + ']';
				}
				tmp.push(objectToQueryString(key, value));
			});
			return tmp.join('&');
		} else {
			if(!base) return '';
			return sanitizeURIComponent(base) + '=' + (isDate(obj) ? obj.getTime() : sanitizeURIComponent(obj));
		}
	}

	function sanitizeURIComponent(obj) {
		return !obj && obj !== false && obj !== 0 ? '' : encodeURIComponent(obj).replace(/%20/g, '+');
	}

	function matchInObject(match, key, value) {
		if(isRegExp(match)) {
			return match.test(key);
		} else if(isObjectType(match)) {
			return match[key] === value;
		} else {
			return key === string(match);
		}
	}

	function selectFromObject(obj, args, select) {
		var match, result = obj instanceof Hash ? new Hash : {};
		iterateOverObject(obj, function(key, value) {
			match = false;
			flattenedArgs(args, function(arg) {
				if(matchInObject(arg, key, value)) {
					match = true;
				}
			}, 1);
			if(match === select) {
				result[key] = value;
			}
		});
		return result;
	}

	var getOwnPropertyNames      = object.getOwnPropertyNames;
	var defineProperty           = propertyDescriptorSupport ? object.defineProperty : definePropertyShim;
	var getOwnPropertyDescriptor = propertyDescriptorSupport ? object.getOwnPropertyDescriptor : getOwnPropertyDescriptorShim;
	var iterateOverProperties    = propertyDescriptorSupport ? iterateOverPropertyNames : iterateOverObject;

	function iterateOverPropertyNames(obj, fn) {
		getOwnPropertyNames(obj).forEach(fn);
	}

	function getOwnPropertyDescriptorShim(obj, prop) {
		return obj.hasOwnProperty(prop) ? { 'value': obj[prop] } : Undefined;
	}

	function definePropertyShim(obj, prop, descriptor) {
		obj[prop] = descriptor['value'];
	}

	function mergeObject(target, source, deep, resolve) {
		if(!isObjectType(source)) return target;

		iterateOverProperties(source, function(prop) {

			var resolved;
			var sourceDescriptor = getOwnPropertyDescriptor(source, prop);
			var targetDescriptor = getOwnPropertyDescriptor(target, prop);
			var sourceVal        = sourceDescriptor && sourceDescriptor.value;
			var targetVal        = targetDescriptor && targetDescriptor.value;
			var sourceIsObject   = isObjectType(sourceVal);
			var goingDeep        = deep && sourceIsObject;
			var conflict         = isDefined(targetDescriptor) && targetDescriptor.value != null;

			if(conflict) {
				if(!goingDeep && resolve === false) {
					return;
				} else if(isFunction(resolve)) {
					resolved = resolve.call(source, prop, targetVal, sourceVal);
					if(isDefined(resolved)) {
						sourceDescriptor.value = resolved;
						goingDeep = false;
					}
				}
			}

			if(goingDeep) {
				sourceDescriptor.value = handleDeepMerge(targetVal, sourceVal, deep, resolve);
			}

			defineProperty(target, prop, sourceDescriptor);
		});
		return target;
	}

	function handleDeepMerge(targetVal, sourceVal, deep, resolve) {
		if(isDate(sourceVal)) {
			return new date(sourceVal.getTime());
		} else if(isRegExp(sourceVal)) {
			return new regexp(sourceVal.source, getRegExpFlags(sourceVal));
		} else {
			if(!isObjectType(targetVal)) targetVal = isArray(sourceVal) ? [] : {};
			return mergeObject(targetVal, sourceVal, deep, resolve);
		}
	}

	function mapAllObject() {
		buildObjectInstanceMethods(getObjectInstanceMethods(), object);
	}

	function unmapAllObject() {
		var objProto = object.prototype, methods = getObjectInstanceMethods();
		methods.forEach(function(name) {
			if(objProto[name]) {
				delete objProto[name];
			}
		});
	}

	function getObjectInstanceMethods() {
		return ObjectTypeMethods.concat(ObjectHashMethods);
	}

	function buildTypeMethods() {
		extendSimilar(object, natives, function(methods, name) {
			var method = 'is' + name;
			ObjectTypeMethods.push(method);
			methods[method] = typeChecks[name];
		}, false);
	}

	extend(object, {

		'watch': function(obj, prop, fn) {
			var value, descriptor;
			if(!propertyDescriptorSupport) return false;
			descriptor = getOwnPropertyDescriptor(obj, prop);
			if(descriptor && (!descriptor.configurable || descriptor.get || descriptor.set)) {
				return false;
			}
			value = obj[prop];
			defineProperty(obj, prop, {
				'configurable': true,
				'enumerable'  : !descriptor || descriptor.enumerable,
				'get': function() {
					return value;
				},
				'set': function(to) {
					value = fn.call(obj, prop, value, to);
				}
			});
			return true;
		},
		'unwatch': function(obj, prop) {
			var descriptor;
			if(!propertyDescriptorSupport) return false;
			descriptor = getOwnPropertyDescriptor(obj, prop);
			if(!descriptor.configurable) {
				return;
			}
			defineProperty(obj, prop, {
				'configurable': true,
				'value': 3
			});
		}
	}, false, true, true);

	extend(object, {

		'keys': function(obj, fn) {
			var keys = object.keys(obj);
			keys.forEach(function(key) {
				fn.call(obj, key, obj[key]);
			});
			return keys;
		}

	}, false, function() { return arguments.length > 1; });

	extend(object, {

		'isArguments': function(obj) {
			return isArgumentsObject(obj);
		},
		'isObject': function(obj) {
			return isPlainObject(obj);
		},
		'isNaN': function(obj) {
			return isNumber(obj) && obj.valueOf() !== obj.valueOf();
		},
		'equal': function(a, b) {
			return isEqual(a, b);
		},
		'extended': function(obj) {
			return new Hash(obj);
		},
		'merge': function(target, source, deep, resolve) {
			return mergeObject(target, source, deep, resolve);
		},
		'values': function(obj, fn) {
			var values = [];
			iterateOverObject(obj, function(k,v) {
				values.push(v);
				if(fn) fn.call(obj,v);
			});
			return values;
		},
		'clone': function(obj, deep) {
			var target, klass;
			if(!isObjectType(obj)) {
				return obj;
			}
			klass = className(obj);
			if(isDate(obj, klass) && sugarDate.clone) {
				return sugarDate.clone(obj);
			} else if(isDate(obj, klass) || isRegExp(obj, klass)) {
				return new obj.constructor(obj);
			} else if(obj instanceof Hash) {
				target = new Hash;
			} else if(isArray(obj, klass)) {
				target = [];
			} else if(isPlainObject(obj, klass)) {
				target = {};
			} else {
				throw new TypeError('Clone must be a basic data type.');
			}
			return mergeObject(target, obj, deep);
		},
		'fromQueryString': function(str, castBoolean) {
			var result = new Hash, split;
			str = str && str.toString ? str.toString() : '';
			str.replace(/^.*?\?/, '').split('&').forEach(function(p) {
				var split = p.split('=');
				if(split.length !== 2) return;
				setParamsObject(result, split[0], decodeURIComponent(split[1]), castBoolean);
			});
			return result;
		},
		'toQueryString': function(obj, namespace) {
			return objectToQueryString(namespace, obj);
		},
		'tap': function(obj, arg) {
			var fn = arg;
			if(!isFunction(arg)) {
				fn = function() {
					if(arg) obj[arg]();
				}
			}
			fn.call(obj, obj);
			return obj;
		},
		'has': function (obj, key) {
			return hasOwnProperty(obj, key);
		},
		'select': function (obj) {
			return selectFromObject(obj, arguments, true);
		},
		'reject': function (obj) {
			return selectFromObject(obj, arguments, false);
		},
		'map': function(obj, map) {
			var result = {}, key, value;
			for(key in obj) {
				if(!hasOwnProperty(obj, key)) continue;
				value = obj[key];
				result[key] = transformArgument(value, map, obj, [key, value, obj]);
			}
			return result;
		},
		'each': function(obj, fn) {
			checkCallback(fn);
			iterateOverObject(obj, fn);
			return obj;
		},
		'size': function (obj) {
			return keysWithObjectCoercion(obj).length;
		}

	}, false);

	extend(Sugar, {

		'extendObject': function(on) {
			if(on !== false) {
				mapAllObject();
			} else {
				unmapAllObject();
			}
			return true;
		}

	}, false);

	buildTypeMethods();
	buildObjectInstanceMethods(ObjectHashMethods, Hash);

	extend(regexp, {

		'escape': function(str) {
			return escapeRegExp(str);
		}

	}, false);

	extend(regexp, {

		'getFlags': function() {
			return getRegExpFlags(this);
		},
		'setFlags': function(flags) {
			return regexp(this.source, flags);
		},
		'addFlag': function(flag) {
			return regexp(this.source, getRegExpFlags(this, flag));
		},
		'removeFlag': function(flag) {
			return regexp(this.source, getRegExpFlags(this).replace(flag, ''));
		}

	});

	var HTML_CODE_MATCH = /&#(x)?([\w\d]{0,5});/i;

	var HTML_VOID_ELEMENTS = [
		'area','base','br','col','command','embed','hr','img',
		'input','keygen','link','meta','param','source','track','wbr'
	];

	function getInflector() {
		return sugarString.Inflector;
	}

	function getAcronym(word) {
		var inflector = getInflector();
		var word = inflector && inflector.acronyms[word];
		if(isString(word)) {
			return word;
		}
	}

	function checkRepeatRange(num) {
		num = +num;
		if(num < 0 || num === Infinity) {
			throw new RangeError('Invalid number');
		}
		return num;
	}

	function padString(num, padding) {
		return repeatString(isDefined(padding) ? padding : ' ', num);
	}

	function truncateString(str, length, from, ellipsis, split) {
		var str1, str2, len1, len2;
		if(str.length <= length) {
			return str.toString();
		}
		ellipsis = isUndefined(ellipsis) ? '...' : ellipsis;
		switch(from) {
			case 'left':
				str2 = split ? truncateOnWord(str, length, true) : str.slice(str.length - length);
				return ellipsis + str2;
			case 'middle':
				len1 = ceil(length / 2);
				len2 = floor(length / 2);
				str1 = split ? truncateOnWord(str, len1) : str.slice(0, len1);
				str2 = split ? truncateOnWord(str, len2, true) : str.slice(str.length - len2);
				return str1 + ellipsis + str2;
			default:
				str1 = split ? truncateOnWord(str, length) : str.slice(0, length);
				return str1 + ellipsis;
		}
	}

	function stringEach(str, search, fn) {
		var i, len, result, chunks;
		if(isFunction(search)) {
			fn = search;
			search = /[\s\S]/g;
		} else if(!search) {
			search = /[\s\S]/g
		} else if(isString(search)) {
			search = regexp(escapeRegExp(search), 'gi');
		} else if(isRegExp(search)) {
			search = regexp(search.source, getRegExpFlags(search, 'g'));
		}
		chunks = str.match(search) || [];
		if(fn) {
			for(i = 0, len = chunks.length; i < len; i++) {
				result = fn.call(str, chunks[i], i, chunks);
				if(result === false) {
					chunks.length = i + 1;
					break;
				} else if(isDefined(result)) {
					chunks[i] = result;
				}
			}
		}
		return chunks;
	}

	function eachWord(str, fn) {
		return stringEach(str.trim(), /\S+/g, fn);
	}

	function stringCodes(str, fn) {
		var codes = [], i, len;
		for(i = 0, len = str.length; i < len; i++) {
			var code = str.charCodeAt(i);
			codes.push(code);
			if(fn) fn.call(str, code, i);
		}
		return codes;
	}

	function shiftChar(str, n) {
		var result = '';
		n = n || 0;
		stringCodes(str, function(c) {
			result += chr(c + n);
		});
		return result;
	}

	function underscore(str) {
		var inflector = getInflector();
		return str
			.replace(/[-\s]+/g, '_')
			.replace(inflector && inflector.acronymRegExp, function(acronym, index) {
				return (index > 0 ? '_' : '') + acronym.toLowerCase();
			})
			.replace(/([A-Z\d]+)([A-Z][a-z])/g,'$1_$2')
			.replace(/([a-z\d])([A-Z])/g,'$1_$2')
			.toLowerCase();
	}

	function spacify(str) {
		return underscore(str).replace(/_/g, ' ');
	}

	function capitalize(str, all) {
		var lastResponded;
		return str.toLowerCase().replace(all ? /[^']/g : /^\S/, function(lower) {
			var upper = lower.toUpperCase(), result;
			result = lastResponded ? lower : upper;
			lastResponded = upper !== lower;
			return result;
		});
	}

	function reverseString(str) {
		return str.split('').reverse().join('');
	}

	function stringFirst(str, num) {
		if(isUndefined(num)) num = 1;
		return str.substr(0, num);
	}

	function stringLast(str, num) {
		if(isUndefined(num)) num = 1;
		var start = str.length - num < 0 ? 0 : str.length - num;
		return str.substr(start);
	}

	function stringFrom(str, from) {
		return str.slice(numberOrIndex(str, from, true));
	}

	function stringTo(str, to) {
		if(isUndefined(to)) to = str.length;
		return str.slice(0, numberOrIndex(str, to));
	}

	function stringAssign(str, args) {
		var obj = {};
		flattenedArgs(args, function(a, i) {
			if(isObjectType(a)) {
				simpleMerge(obj, a);
			} else {
				obj[i + 1] = a;
			}
		});
		return str.replace(/\{([^{]+?)\}/g, function(m, key) {
			return hasOwnProperty(obj, key) ? obj[key] : m;
		});
	}

	function isBlank(str) {
		return str.trim().length === 0;
	}

	function truncateOnWord(str, limit, fromLeft) {
		if(fromLeft) {
			return reverseString(truncateOnWord(reverseString(str), limit));
		}
		var reg = regexp('(?=[' + getTrimmableCharacters() + '])');
		var words = str.split(reg);
		var count = 0;
		return words.filter(function(word) {
			count += word.length;
			return count <= limit;
		}).join('');
	}

	function convertHTMLCodes(str) {
		return str.replace(HTML_CODE_MATCH, function(full, hex, code) {
			return string.fromCharCode(parseInt(code, hex ? 16 : 10));
		});
	}

	function tagIsVoid(tag) {
		return HTML_VOID_ELEMENTS.indexOf(tag.toLowerCase()) !== -1;
	}

	function replaceTags(str, args, strip) {
		var lastIndex = args.length - 1, lastArg = args[lastIndex], replacementFn, tags, reg;
		if(isFunction(lastArg)) {
			replacementFn = lastArg;
			args.length = lastIndex;
		}
		tags = flattenedArgs(args).map(function(tag) {
			return escapeRegExp(tag);
		}).join('|');
		reg = regexp('<(\\/)?(' + (tags || '[^\\s>]+') + ')\\s*([^<>]*?)\\s*(\\/)?\\s*>', 'gi');
		return runTagReplacements(str, reg, strip, replacementFn);
	}

	function runTagReplacements(str, reg, strip, replacementFn, fullString) {

		var match;
		var result = '';
		var currentIndex = 0;
		var currentlyOpenTagName;
		var currentlyOpenTagAttributes;
		var currentlyOpenTagCount = 0;

		function processTag(index, tagName, attributes, tagLength) {
			var content = str.slice(currentIndex, index), replacement;
			if(replacementFn) {
				replacement = replacementFn.call(fullString, tagName, content, attributes, fullString);
				if(isDefined(replacement)) {
					content = replacement;
				} else if(!strip) {
					content = '';
				}
			} else if(!strip) {
				content = '';
			}
			result += runTagReplacements(content, reg, strip, replacementFn, fullString);
			currentIndex = index + (tagLength || 0);
		}

		fullString = fullString || str;
		reg = regexp(reg.source, 'gi');

		while(match = reg.exec(str)) {

			var tagName         = match[2];
			var attributes      = match[3];
			var isClosingTag    = !!match[1];
			var isSelfClosing   = !!match[4];
			var tagLength       = match[0].length;
			var isOpeningTag    = !isClosingTag && !isSelfClosing && !tagIsVoid(tagName);
			var isSameAsCurrent = tagName === currentlyOpenTagName;

			if(!currentlyOpenTagName) {
				result += str.slice(currentIndex, match.index);
				currentIndex = match.index;
			}

			if(isOpeningTag) {
				if(!currentlyOpenTagName) {
					currentlyOpenTagName = tagName;
					currentlyOpenTagAttributes = attributes;
					currentlyOpenTagCount++;
					currentIndex += tagLength;
				} else if(isSameAsCurrent) {
					currentlyOpenTagCount++;
				}
			} else if(isClosingTag && isSameAsCurrent) {
				currentlyOpenTagCount--;
				if(currentlyOpenTagCount === 0) {
					processTag(match.index, currentlyOpenTagName, currentlyOpenTagAttributes, tagLength);
					currentlyOpenTagName       = null;
					currentlyOpenTagAttributes = null;
				}
			} else if(!currentlyOpenTagName) {
				processTag(match.index, tagName, attributes, tagLength);
			}
		}
		if(currentlyOpenTagName) {
			processTag(str.length, currentlyOpenTagName, currentlyOpenTagAttributes);
		}
		result += str.slice(currentIndex);
		return result;
	}

	function numberOrIndex(str, n, from) {
		if(isString(n)) {
			n = str.indexOf(n);
			if(n === -1) {
				n = from ? str.length : 0;
			}
		}
		return n;
	}

	var encodeBase64, decodeBase64;

	function buildBase64(key) {
		var encodeAscii, decodeAscii;

		function catchEncodingError(fn) {
			return function(str) {
				try {
					return fn(str);
				} catch(e) {
					return '';
				}
			}
		}

		if(typeof Buffer !== 'undefined') {
			encodeBase64 = function(str) {
				return new Buffer(str).toString('base64');
			}
			decodeBase64 = function(str) {
				return new Buffer(str, 'base64').toString('utf8');
			}
			return;
		}
		if(typeof btoa !== 'undefined') {
			encodeAscii = catchEncodingError(btoa);
			decodeAscii = catchEncodingError(atob);
		} else {
			var base64reg = /[^A-Za-z0-9\+\/\=]/g;
			encodeAscii = function(str) {
				var output = '';
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				do {
					chr1 = str.charCodeAt(i++);
					chr2 = str.charCodeAt(i++);
					chr3 = str.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
					chr1 = chr2 = chr3 = '';
					enc1 = enc2 = enc3 = enc4 = '';
				} while (i < str.length);
				return output;
			}
			decodeAscii = function(input) {
				var output = '';
				var chr1, chr2, chr3;
				var enc1, enc2, enc3, enc4;
				var i = 0;
				if(input.match(base64reg)) {
					return '';
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
				do {
					enc1 = key.indexOf(input.charAt(i++));
					enc2 = key.indexOf(input.charAt(i++));
					enc3 = key.indexOf(input.charAt(i++));
					enc4 = key.indexOf(input.charAt(i++));
					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;
					output = output + chr(chr1);
					if (enc3 != 64) {
						output = output + chr(chr2);
					}
					if (enc4 != 64) {
						output = output + chr(chr3);
					}
					chr1 = chr2 = chr3 = '';
					enc1 = enc2 = enc3 = enc4 = '';
				} while (i < input.length);
				return output;
			}
		}
		encodeBase64 = function(str) {
			return encodeAscii(unescape(encodeURIComponent(str)));
		}
		decodeBase64 = function(str) {
			return decodeURIComponent(escape(decodeAscii(str)));
		}
	}

	function getCoercedStringSubject(obj) {
		if(obj == null) {
			throw new TypeError();
		}
		return string(obj);
	}

	function getCoercedSearchString(obj, errorOnRegex) {
		if(errorOnRegex && isRegExp(obj)) {
			throw new TypeError();
		}
		return string(obj);
	}

	function buildStartEndsWith() {
		var override = true;
		try {
			''.startsWith(/./);
		} catch(e) {
			override = false;
		}
		extend(string, {

			'startsWith': function(searchString) {
				var str, start, pos, len, searchLength, position = arguments[1];
				str = getCoercedStringSubject(this);
				searchString = getCoercedSearchString(searchString, true);
				pos = number(position) || 0;
				len = str.length;
				start = min(max(pos, 0), len);
				searchLength = searchString.length;
				if(searchLength + start > len) {
					return false;
				}
				if(str.substr(start, searchLength) === searchString) {
					return true;
				}
				return false;
			},
			'endsWith': function(searchString) {
				var str, start, end, pos, len, searchLength, endPosition = arguments[1];
				str = getCoercedStringSubject(this);
				searchString = getCoercedSearchString(searchString, true);
				len = str.length;
				pos = len;
				if(isDefined(endPosition)) {
					pos = number(endPosition) || 0;
				}
				end = min(max(pos, 0), len);
				searchLength = searchString.length;
				start = end - searchLength;
				if(start < 0) {
					return false;
				}
				if(str.substr(start, searchLength) === searchString) {
					return true;
				}
				return false;
			}

		}, true, true, override);
	}
	extend(string, {

		'contains': function(searchString) {
			var str = getCoercedStringSubject(this), position = arguments[1];
			return str.indexOf(searchString, position) > -1;
		},
		'repeat': function(num) {
			num = checkRepeatRange(num);
			return repeatString(this, num);
		}

	}, true, true);

	extend(string, {

		'escapeURL': function(param) {
			return param ? encodeURIComponent(this) : encodeURI(this);
		},
		'unescapeURL': function(param) {
			return param ? decodeURI(this) : decodeURIComponent(this);
		},
		'escapeHTML': function() {
			return this.replace(/&/g,  '&amp;' )
								 .replace(/</g,  '&lt;'  )
								 .replace(/>/g,  '&gt;'  )
								 .replace(/"/g,  '&quot;')
								 .replace(/'/g,  '&apos;')
								 .replace(/
		},
		'unescapeHTML': function() {
			return convertHTMLCodes(this)
								 .replace(/&lt;/g,   '<')
								 .replace(/&gt;/g,   '>')
								 .replace(/&nbsp;/g, ' ')
								 .replace(/&quot;/g, '"')
								 .replace(/&apos;/g, "'")
								 .replace(/&amp;/g,  '&');
		},
		'encodeBase64': function() {
			return encodeBase64(this);
		},
		'decodeBase64': function() {
			return decodeBase64(this);
		},
		'each': function(search, fn) {
			return stringEach(this, search, fn);
		},
		'map': function(map, scope) {
			var str = this.toString();
			if(isFunction(map)) {
				var fn = map;
				map = function(letter, i, arr) {
					return fn.call(scope, letter, i, str);
				}
			}
			return str.split('').map(map, scope).join('');
		},
		'shift': function(n) {
			return shiftChar(this, n);
		},
		'codes': function(fn) {
			return stringCodes(this, fn);
		},
		'chars': function(fn) {
			return stringEach(this, fn);
		},
		'words': function(fn) {
			return eachWord(this, fn);
		},
		'lines': function(fn) {
			return stringEach(this.trim(), /^.*$/gm, fn);
		},
		'paragraphs': function(fn) {
			var paragraphs = this.trim().split(/[\r\n]{2,}/);
			paragraphs = paragraphs.map(function(p) {
				if(fn) var s = fn.call(p);
				return s ? s : p;
			});
			return paragraphs;
		},
		'isBlank': function() {
			return isBlank(this);
		},
		'add': function(str, index) {
			index = isUndefined(index) ? this.length : index;
			return this.slice(0, index) + str + this.slice(index);
		},
		'remove': function(f) {
			return this.replace(f, '');
		},
		'reverse': function() {
			return reverseString(this);
		},
		'compact': function() {
			return this.trim().replace(/([\r\n\s　])+/g, function(match, whitespace){
				return whitespace === '　' ? whitespace : ' ';
			});
		},
		'at': function() {
			return getEntriesForIndexes(this, arguments, true);
		},
		'from': function(from) {
			return stringFrom(this, from);
		},
		'to': function(to) {
			return stringTo(this, to);
		},
		'dasherize': function() {
			return underscore(this).replace(/_/g, '-');
		},
		'underscore': function() {
			return underscore(this);
		},
		'camelize': function(first) {
			return underscore(this).replace(/(^|_)([^_]+)/g, function(match, pre, word, index) {
				var acronym = getAcronym(word), cap = first !== false || index > 0;
				if(acronym) return cap ? acronym : acronym.toLowerCase();
				return cap ? capitalize(word) : word;
			});
		},
		'spacify': function() {
			return spacify(this);
		},
		'stripTags': function() {
			return replaceTags(this, arguments, true);
		},
		'removeTags': function() {
			return replaceTags(this, arguments, false);
		},
		'truncate': function(length, from, ellipsis) {
			return truncateString(this, length, from, ellipsis);
		},
		'truncateOnWord': function(length, from, ellipsis) {
			return truncateString(this, length, from, ellipsis, true);
		},
		'pad': function(num, padding) {
			var half, front, back;
			num   = checkRepeatRange(num);
			half  = max(0, num - this.length) / 2;
			front = floor(half);
			back  = ceil(half);
			return padString(front, padding) + this + padString(back, padding);
		},
		'padLeft': function(num, padding) {
			num = checkRepeatRange(num);
			return padString(max(0, num - this.length), padding) + this;
		},
		'padRight': function(num, padding) {
			num = checkRepeatRange(num);
			return this + padString(max(0, num - this.length), padding);
		},
		'first': function(num) {
			return stringFirst(this, num);
		},
		'last': function(num) {
			return stringLast(this, num);
		},
		'toNumber': function(base) {
			return stringToNumber(this, base);
		},
		'capitalize': function(all) {
			return capitalize(this, all);
		},
		'assign': function() {
			return stringAssign(this, arguments);
		},
		'trimLeft': function() {
			return this.replace(regexp('^['+getTrimmableCharacters()+']+'), '');
		},
		'trimRight': function() {
			return this.replace(regexp('['+getTrimmableCharacters()+']+$'), '');
		}

	});

	alias(string, 'insert', 'add');

	buildStartEndsWith();
	buildBase64('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=');

	var plurals      = [],
			singulars    = [],
			uncountables = [],
			humans       = [],
			acronyms     = {},
			Downcased,
			Inflector,
			NormalizeMap = {},
			NormalizeReg,
			NormalizeSource;

	function removeFromArray(arr, find) {
		var index = arr.indexOf(find);
		if(index > -1) {
			arr.splice(index, 1);
		}
	}

	function removeFromUncountablesAndAddTo(arr, rule, replacement) {
		if(isString(rule)) {
			removeFromArray(uncountables, rule);
		}
		removeFromArray(uncountables, replacement);
		arr.unshift({ rule: rule, replacement: replacement })
	}

	function paramMatchesType(param, type) {
		return param == type || param == 'all' || !param;
	}

	function isUncountable(word) {
		return uncountables.some(function(uncountable) {
			return new regexp('\\b' + uncountable + '$', 'i').test(word);
		});
	}

	function inflect(word, pluralize) {
		word = isString(word) ? word.toString() : '';
		if(isBlank(word) || isUncountable(word)) {
			return word;
		} else {
			return runReplacements(word, pluralize ? plurals : singulars);
		}
	}

	function runReplacements(word, table) {
		iterateOverObject(table, function(i, inflection) {
			if(word.match(inflection.rule)) {
				word = word.replace(inflection.rule, inflection.replacement);
				return false;
			}
		});
		return word;
	}

	function capitalizeWithoutDowncasing(word) {
		return word.replace(/^\W*[a-z]/, function(w){
			return w.toUpperCase();
		});
	}

	function humanize(str) {
		var str = runReplacements(str, humans), acronym;
		str = str.replace(/_id$/g, '');
		str = str.replace(/(_)?([a-z\d]*)/gi, function(match, _, word){
			var lower = word.toLowerCase();
			acronym = hasOwnProperty(acronyms, lower) ? acronyms[lower] : null;
			return (_ ? ' ' : '') + (acronym || lower);
		});
		return capitalizeWithoutDowncasing(str);
	}

	function toAscii(str) {
		return str.replace(NormalizeReg, function(character) {
			return NormalizeMap[character];
		});
	}

	function buildNormalizeMap() {
		var normalized, str, all = '';
		for(normalized in NormalizeSource) {
			if(!NormalizeSource.hasOwnProperty(normalized)) continue;
			str = NormalizeSource[normalized];
			str.split('').forEach(function(character) {
				NormalizeMap[character] = normalized;
			});
			all += str;
		}
		NormalizeReg = RegExp('[' + all + ']', 'g');
	}

	Inflector = {

		'acronym': function(word) {
			acronyms[word.toLowerCase()] = word;
			var all = object.keys(acronyms).map(function(key) {
				return acronyms[key];
			});
			Inflector.acronymRegExp = regexp(all.join('|'), 'g');
		},
		'plural': function(rule, replacement) {
			removeFromUncountablesAndAddTo(plurals, rule, replacement);
		},
		'singular': function(rule, replacement) {
			removeFromUncountablesAndAddTo(singulars, rule, replacement);
		},
		'irregular': function(singular, plural) {
			var singularFirst      = stringFirst(singular),
					singularRest       = stringFrom(singular, 1),
					pluralFirst        = stringFirst(plural),
					pluralRest         = stringFrom(plural, 1),
					pluralFirstUpper   = pluralFirst.toUpperCase(),
					pluralFirstLower   = pluralFirst.toLowerCase(),
					singularFirstUpper = singularFirst.toUpperCase(),
					singularFirstLower = singularFirst.toLowerCase();
			removeFromArray(uncountables, singular);
			removeFromArray(uncountables, plural);
			if(singularFirstUpper == pluralFirstUpper) {
				Inflector.plural(new regexp(stringAssign('({1}){2}$', [singularFirst, singularRest]), 'i'), '$1' + pluralRest);
				Inflector.plural(new regexp(stringAssign('({1}){2}$', [pluralFirst, pluralRest]), 'i'), '$1' + pluralRest);
				Inflector.singular(new regexp(stringAssign('({1}){2}$', [pluralFirst, pluralRest]), 'i'), '$1' + singularRest);
			} else {
				Inflector.plural(new regexp(stringAssign('{1}{2}$', [singularFirstUpper, singularRest])), pluralFirstUpper + pluralRest);
				Inflector.plural(new regexp(stringAssign('{1}{2}$', [singularFirstLower, singularRest])), pluralFirstLower + pluralRest);
				Inflector.plural(new regexp(stringAssign('{1}{2}$', [pluralFirstUpper, pluralRest])), pluralFirstUpper + pluralRest);
				Inflector.plural(new regexp(stringAssign('{1}{2}$', [pluralFirstLower, pluralRest])), pluralFirstLower + pluralRest);
				Inflector.singular(new regexp(stringAssign('{1}{2}$', [pluralFirstUpper, pluralRest])), singularFirstUpper + singularRest);
				Inflector.singular(new regexp(stringAssign('{1}{2}$', [pluralFirstLower, pluralRest])), singularFirstLower + singularRest);
			}
		},
		'uncountable': function(first) {
			var add = array.isArray(first) ? first : multiArgs(arguments);
			uncountables = uncountables.concat(add);
		},
		'human': function(rule, replacement) {
			humans.unshift({ rule: rule, replacement: replacement })
		},
		'clear': function(type) {
			if(paramMatchesType(type, 'singulars'))    singulars    = [];
			if(paramMatchesType(type, 'plurals'))      plurals      = [];
			if(paramMatchesType(type, 'uncountables')) uncountables = [];
			if(paramMatchesType(type, 'humans'))       humans       = [];
			if(paramMatchesType(type, 'acronyms'))     acronyms     = {};
		}

	};

	Downcased = [
		'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
		'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
		'with', 'for'
	];

	Inflector.plural(/$/, 's');
	Inflector.plural(/s$/gi, 's');
	Inflector.plural(/(ax|test)is$/gi, '$1es');
	Inflector.plural(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1i');
	Inflector.plural(/(census|alias|status|fetus|genius|virus)$/gi, '$1es');
	Inflector.plural(/(bu)s$/gi, '$1ses');
	Inflector.plural(/(buffal|tomat)o$/gi, '$1oes');
	Inflector.plural(/([ti])um$/gi, '$1a');
	Inflector.plural(/([ti])a$/gi, '$1a');
	Inflector.plural(/sis$/gi, 'ses');
	Inflector.plural(/f+e?$/gi, 'ves');
	Inflector.plural(/(cuff|roof)$/gi, '$1s');
	Inflector.plural(/([ht]ive)$/gi, '$1s');
	Inflector.plural(/([^aeiouy]o)$/gi, '$1es');
	Inflector.plural(/([^aeiouy]|qu)y$/gi, '$1ies');
	Inflector.plural(/(x|ch|ss|sh)$/gi, '$1es');
	Inflector.plural(/(tr|vert)(?:ix|ex)$/gi, '$1ices');
	Inflector.plural(/([ml])ouse$/gi, '$1ice');
	Inflector.plural(/([ml])ice$/gi, '$1ice');
	Inflector.plural(/^(ox)$/gi, '$1en');
	Inflector.plural(/^(oxen)$/gi, '$1');
	Inflector.plural(/(quiz)$/gi, '$1zes');
	Inflector.plural(/(phot|cant|hom|zer|pian|portic|pr|quart|kimon)o$/gi, '$1os');
	Inflector.plural(/(craft)$/gi, '$1');
	Inflector.plural(/([ft])[eo]{2}(th?)$/gi, '$1ee$2');

	Inflector.singular(/s$/gi, '');
	Inflector.singular(/([pst][aiu]s)$/gi, '$1');
	Inflector.singular(/([aeiouy])ss$/gi, '$1ss');
	Inflector.singular(/(n)ews$/gi, '$1ews');
	Inflector.singular(/([ti])a$/gi, '$1um');
	Inflector.singular(/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/gi, '$1$2sis');
	Inflector.singular(/(^analy)ses$/gi, '$1sis');
	Inflector.singular(/(i)(f|ves)$/i, '$1fe');
	Inflector.singular(/([aeolr]f?)(f|ves)$/i, '$1f');
	Inflector.singular(/([ht]ive)s$/gi, '$1');
	Inflector.singular(/([^aeiouy]|qu)ies$/gi, '$1y');
	Inflector.singular(/(s)eries$/gi, '$1eries');
	Inflector.singular(/(m)ovies$/gi, '$1ovie');
	Inflector.singular(/(x|ch|ss|sh)es$/gi, '$1');
	Inflector.singular(/([ml])(ous|ic)e$/gi, '$1ouse');
	Inflector.singular(/(bus)(es)?$/gi, '$1');
	Inflector.singular(/(o)es$/gi, '$1');
	Inflector.singular(/(shoe)s?$/gi, '$1');
	Inflector.singular(/(cris|ax|test)[ie]s$/gi, '$1is');
	Inflector.singular(/(octop|fung|foc|radi|alumn|cact)(i|us)$/gi, '$1us');
	Inflector.singular(/(census|alias|status|fetus|genius|virus)(es)?$/gi, '$1');
	Inflector.singular(/^(ox)(en)?/gi, '$1');
	Inflector.singular(/(vert)(ex|ices)$/gi, '$1ex');
	Inflector.singular(/tr(ix|ices)$/gi, 'trix');
	Inflector.singular(/(quiz)(zes)?$/gi, '$1');
	Inflector.singular(/(database)s?$/gi, '$1');
	Inflector.singular(/ee(th?)$/gi, 'oo$1');

	Inflector.irregular('person', 'people');
	Inflector.irregular('man', 'men');
	Inflector.irregular('deer', 'deer');
	Inflector.irregular('human', 'humans');
	Inflector.irregular('child', 'children');
	Inflector.irregular('sex', 'sexes');
	Inflector.irregular('move', 'moves');
	Inflector.irregular('save', 'saves');
	Inflector.irregular('goose', 'geese');
	Inflector.irregular('zombie', 'zombies');

	Inflector.uncountable('equipment,information,rice,money,species,series,fish,sheep,jeans'.split(','));

	NormalizeSource = {
		'A':  'AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ',
		'B':  'BⒷＢḂḄḆɃƂƁ',
		'C':  'CⒸＣĆĈĊČÇḈƇȻꜾ',
		'D':  'DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ',
		'E':  'EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ',
		'F':  'FⒻＦḞƑꝻ',
		'G':  'GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ',
		'H':  'HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ',
		'I':  'IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ',
		'J':  'JⒿＪĴɈ',
		'K':  'KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ',
		'L':  'LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ',
		'M':  'MⓂＭḾṀṂⱮƜ',
		'N':  'NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ',
		'O':  'OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ',
		'P':  'PⓅＰṔṖƤⱣꝐꝒꝔ',
		'Q':  'QⓆＱꝖꝘɊ',
		'R':  'RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ',
		'S':  'SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ',
		'T':  'TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ',
		'U':  'UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ',
		'V':  'VⓋＶṼṾƲꝞɅ',
		'W':  'WⓌＷẀẂŴẆẄẈⱲ',
		'X':  'XⓍＸẊẌ',
		'Y':  'YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ',
		'Z':  'ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ',
		'a':  'aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ',
		'b':  'bⓑｂḃḅḇƀƃɓ',
		'c':  'cⓒｃćĉċčçḉƈȼꜿↄ',
		'd':  'dⓓｄḋďḍḑḓḏđƌɖɗꝺ',
		'e':  'eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ',
		'f':  'fⓕｆḟƒꝼ',
		'g':  'gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ',
		'h':  'hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ',
		'i':  'iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı',
		'j':  'jⓙｊĵǰɉ',
		'k':  'kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ',
		'l':  'lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ',
		'm':  'mⓜｍḿṁṃɱɯ',
		'n':  'nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ',
		'o':  'oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ',
		'p':  'pⓟｐṕṗƥᵽꝑꝓꝕ',
		'q':  'qⓠｑɋꝗꝙ',
		'r':  'rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ',
		's':  'sⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛ',
		't':  'tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ',
		'u':  'uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ',
		'v':  'vⓥｖṽṿʋꝟʌ',
		'w':  'wⓦｗẁẃŵẇẅẘẉⱳ',
		'x':  'xⓧｘẋẍ',
		'y':  'yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ',
		'z':  'zⓩｚźẑżžẓẕƶȥɀⱬꝣ',
		'AA': 'Ꜳ',
		'AE': 'ÆǼǢ',
		'AO': 'Ꜵ',
		'AU': 'Ꜷ',
		'AV': 'ꜸꜺ',
		'AY': 'Ꜽ',
		'DZ': 'ǱǄ',
		'Dz': 'ǲǅ',
		'LJ': 'Ǉ',
		'Lj': 'ǈ',
		'NJ': 'Ǌ',
		'Nj': 'ǋ',
		'OI': 'Ƣ',
		'OO': 'Ꝏ',
		'OU': 'Ȣ',
		'TZ': 'Ꜩ',
		'VY': 'Ꝡ',
		'aa': 'ꜳ',
		'ae': 'æǽǣ',
		'ao': 'ꜵ',
		'au': 'ꜷ',
		'av': 'ꜹꜻ',
		'ay': 'ꜽ',
		'dz': 'ǳǆ',
		'hv': 'ƕ',
		'lj': 'ǉ',
		'nj': 'ǌ',
		'oi': 'ƣ',
		'ou': 'ȣ',
		'oo': 'ꝏ',
		'ss': 'ß',
		'tz': 'ꜩ',
		'vy': 'ꝡ'
	};

	extend(string, {

		'pluralize': function() {
			return inflect(this, true);
		},
		'singularize': function() {
			return inflect(this, false);
		},
		'humanize': function() {
			return humanize(this);
		},
		'titleize': function() {
			var fullStopPunctuation = /[.:;!]$/, hasPunctuation, lastHadPunctuation, isFirstOrLast;
			var str = humanize(spacify(this));
			return eachWord(str, function(word, index, words) {
				hasPunctuation = fullStopPunctuation.test(word);
				isFirstOrLast = index == 0 || index == words.length - 1 || hasPunctuation || lastHadPunctuation;
				lastHadPunctuation = hasPunctuation;
				if(isFirstOrLast || Downcased.indexOf(word) === -1) {
					return capitalizeWithoutDowncasing(word, true);
				} else {
					return word;
				}
			}).join(' ');
		},
		'parameterize': function(separator) {
			var str = toAscii(this);
			if(separator === undefined) separator = '-';
			str = str.replace(/[^a-z0-9\-_]+/gi, separator)
			if(separator) {
				str = str.replace(new regexp(stringAssign('^{sep}+|{sep}+$|({sep}){sep}+', [{ 'sep': escapeRegExp(separator) }]), 'g'), '$1');
			}
			return encodeURI(str.toLowerCase());
		},
		'toAscii': function() {
			return toAscii(this);
		}

	});

	sugarString.Inflector = Inflector;
	sugarString.Inflector.acronyms = acronyms;

	buildNormalizeMap();

	var unicodeScripts = [
		{ names: ['Arabic'],      source: '\u0600-\u06FF' },
		{ names: ['Cyrillic'],    source: '\u0400-\u04FF' },
		{ names: ['Devanagari'],  source: '\u0900-\u097F' },
		{ names: ['Greek'],       source: '\u0370-\u03FF' },
		{ names: ['Hangul'],      source: '\uAC00-\uD7AF\u1100-\u11FF' },
		{ names: ['Han','Kanji'], source: '\u4E00-\u9FFF\uF900-\uFAFF' },
		{ names: ['Hebrew'],      source: '\u0590-\u05FF' },
		{ names: ['Hiragana'],    source: '\u3040-\u309F\u30FB-\u30FC' },
		{ names: ['Kana'],        source: '\u3040-\u30FF\uFF61-\uFF9F' },
		{ names: ['Katakana'],    source: '\u30A0-\u30FF\uFF61-\uFF9F' },
		{ names: ['Latin'],       source: '\u0001-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F' },
		{ names: ['Thai'],        source: '\u0E00-\u0E7F' }
	];

	function buildUnicodeScripts() {
		extendSimilar(string, unicodeScripts, function(methods, script) {
			var is = regexp('^['+ script.source +'\\s]+$');
			var has = regexp('['+ script.source +']');
			script.names.forEach(function(name) {
				methods['is' + name] = function() {
					return is.test(this.trim());
				}
				methods['has' + name] = function() {
					return has.test(this.trim());
				}
			});
		});
	}

	var HALF_WIDTH_TO_FULL_WIDTH_TRAVERSAL = 65248;

	var widthConversionRanges = [
		{ type: 'a', start: 65,  end: 90  },
		{ type: 'a', start: 97,  end: 122 },
		{ type: 'n', start: 48,  end: 57  },
		{ type: 'p', start: 33,  end: 47  },
		{ type: 'p', start: 58,  end: 64  },
		{ type: 'p', start: 91,  end: 96  },
		{ type: 'p', start: 123, end: 126 }
	];

	var WidthConversionTable;
	var allHankaku   = /[\u0020-\u00A5]|[\uFF61-\uFF9F][ﾞﾟ]?/g;
	var allZenkaku   = /[\u2212\u3000-\u301C\u301A-\u30FC\uFF01-\uFF60\uFFE0-\uFFE6]/g;
	var hankakuPunctuation  = '｡､｢｣¥¢£';
	var zenkakuPunctuation  = '。、「」￥￠￡';
	var voicedKatakana      = /[カキクケコサシスセソタチツテトハヒフヘホ]/;
	var semiVoicedKatakana  = /[ハヒフヘホヲ]/;
	var hankakuKatakana     = 'ｱｲｳｴｵｧｨｩｪｫｶｷｸｹｺｻｼｽｾｿﾀﾁﾂｯﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔｬﾕｭﾖｮﾗﾘﾙﾚﾛﾜｦﾝｰ･';
	var zenkakuKatakana     = 'アイウエオァィゥェォカキクケコサシスセソタチツッテトナニヌネノハヒフヘホマミムメモヤャユュヨョラリルレロワヲンー・';

	function convertCharacterWidth(str, args, reg, type) {
		if(!WidthConversionTable) {
			buildWidthConversionTables();
		}
		var mode = multiArgs(args).join(''), table = WidthConversionTable[type];
		mode = mode.replace(/all/, '').replace(/(\w)lphabet|umbers?|atakana|paces?|unctuation/g, '$1');
		return str.replace(reg, function(c) {
			var entry = table[c], to;
			if(entry) {
				if(mode === '' && entry.all) {
					return entry.all;
				} else {
					for (var i = 0, len = mode.length; i < len; i++) {
						to = entry[mode.charAt(i)];
						if(to) {
							return to;
						}
					}
				}
			}
			return c;
		});
	}

	function buildWidthConversionTables() {
		var hankaku;
		WidthConversionTable = {
			'zenkaku': {},
			'hankaku': {}
		};
		widthConversionRanges.forEach(function(r) {
			simpleRepeat(r.end - r.start + 1, function(n) {
				n += r.start;
				setWidthConversion(r.type, chr(n), chr(n + HALF_WIDTH_TO_FULL_WIDTH_TRAVERSAL));
			});
		});
		stringEach(zenkakuKatakana, function(c, i) {
			hankaku = hankakuKatakana.charAt(i);
			setWidthConversion('k', hankaku, c);
			if(c.match(voicedKatakana)) {
				setWidthConversion('k', hankaku + 'ﾞ', shiftChar(c, 1));
			}
			if(c.match(semiVoicedKatakana)) {
				setWidthConversion('k', hankaku + 'ﾟ', shiftChar(c, 2));
			}
		});
		stringEach(zenkakuPunctuation, function(c, i) {
			setWidthConversion('p', hankakuPunctuation.charAt(i), c);
		});
		setWidthConversion('s', ' ', '　');
		setWidthConversion('k', 'ｳﾞ', 'ヴ');
		setWidthConversion('k', 'ｦﾞ', 'ヺ');
		setConversionTableEntry('hankaku', 'n', '−', '-');
		setConversionTableEntry('hankaku', 'n', 'ー', '-', false);
		setConversionTableEntry('zenkaku', 'n', '-', '－', false);
	}

	function setWidthConversion(type, half, full) {
		setConversionTableEntry('zenkaku', type, half, full);
		setConversionTableEntry('hankaku', type, full, half);
	}

	function setConversionTableEntry(width, type, from, to, all) {
		var obj = WidthConversionTable[width][from] || {};
		if(all !== false) {
			obj.all = to;
		}
		obj[type]  = to;
		WidthConversionTable[width][from] = obj;
	}

	function hankaku(str, args) {
		return convertCharacterWidth(str, args, allZenkaku, 'hankaku');
	}

	function zenkaku(str, args) {
		return convertCharacterWidth(str, args, allHankaku, 'zenkaku');
	}

	extend(string, {

		'hankaku': function() {
			return hankaku(this, arguments);
		},
		'zenkaku': function() {
			return zenkaku(this, arguments);
		},
		'hiragana': function(all) {
			var str = this;
			if(all !== false) {
				str = zenkaku(str, ['k']);
			}
			return str.replace(/[\u30A1-\u30F6]/g, function(c) {
				return shiftChar(c, -96);
			});
		},
		'katakana': function() {
			return this.replace(/[\u3041-\u3096]/g, function(c) {
				return shiftChar(c, 96);
			});
		}

	});

	buildUnicodeScripts();

Sugar.Date.addLocale('da', {
	'plural': true,
	'months': 'januar,februar,marts,april,maj,juni,juli,august,september,oktober,november,december',
	'weekdays': 'søndag|sondag,mandag,tirsdag,onsdag,torsdag,fredag,lørdag|lordag',
	'units': 'millisekund:|er,sekund:|er,minut:|ter,tim:e|er,dag:|e,ug:e|er|en,måned:|er|en+maaned:|er|en,år:||et+aar:||et',
	'numbers': 'en|et,to,tre,fire,fem,seks,syv,otte,ni,ti',
	'tokens': 'den,for',
	'articles': 'den',
	'short':'d. {d}. {month} {yyyy}',
	'long': 'den {d}. {month} {yyyy} {H}:{mm}',
	'full': '{Weekday} den {d}. {month} {yyyy} {H}:{mm}:{ss}',
	'past': '{num} {unit} {sign}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'forgårs|i forgårs|forgaars|i forgaars', 'value': -2 },
		{ 'name': 'day', 'src': 'i går|igår|i gaar|igaar', 'value': -1 },
		{ 'name': 'day', 'src': 'i dag|idag', 'value': 0 },
		{ 'name': 'day', 'src': 'i morgen|imorgen', 'value': 1 },
		{ 'name': 'day', 'src': 'over morgon|overmorgen|i over morgen|i overmorgen|iovermorgen', 'value': 2 },
		{ 'name': 'sign', 'src': 'siden', 'value': -1 },
		{ 'name': 'sign', 'src': 'om', 'value':  1 },
		{ 'name': 'shift', 'src': 'i sidste|sidste', 'value': -1 },
		{ 'name': 'shift', 'src': 'denne', 'value': 0 },
		{ 'name': 'shift', 'src': 'næste|naeste', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{sign} {num} {unit}',
		'{1?} {num} {unit} {sign}',
		'{shift} {unit=5-7}'
	],
	'timeParse': [
		'{0?} {weekday?} {date?} {month} {year}',
		'{date} {month}',
		'{shift} {weekday}'
	]
});

Sugar.Date.addLocale('de', {
	'plural': true,
	 'capitalizeUnit': true,
	'months': 'Januar,Februar,März|Marz,April,Mai,Juni,Juli,August,September,Oktober,November,Dezember',
	'weekdays': 'Sonntag,Montag,Dienstag,Mittwoch,Donnerstag,Freitag,Samstag',
	'units': 'Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en',
	'numbers': 'ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn',
	'tokens': 'der',
	'short':'{d}. {Month} {yyyy}',
	'long': '{d}. {Month} {yyyy} {H}:{mm}',
	'full': '{Weekday} {d}. {Month} {yyyy} {H}:{mm}:{ss}',
	'past': '{sign} {num} {unit}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'timeMarker': 'um',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'vorgestern', 'value': -2 },
		{ 'name': 'day', 'src': 'gestern', 'value': -1 },
		{ 'name': 'day', 'src': 'heute', 'value': 0 },
		{ 'name': 'day', 'src': 'morgen', 'value': 1 },
		{ 'name': 'day', 'src': 'übermorgen|ubermorgen|uebermorgen', 'value': 2 },
		{ 'name': 'sign', 'src': 'vor:|her', 'value': -1 },
		{ 'name': 'sign', 'src': 'in', 'value': 1 },
		{ 'name': 'shift', 'src': 'letzte:|r|n|s', 'value': -1 },
		{ 'name': 'shift', 'src': 'nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s+kommende:n|r', 'value': 1 }
	],
	'dateParse': [
		'{sign} {num} {unit}',
		'{num} {unit} {sign}',
		'{shift} {unit=5-7}'
	],
	'timeParse': [
		'{weekday?} {date?} {month} {year?}',
		'{shift} {weekday}'
	]
});

Sugar.Date.addLocale('es', {
	'plural': true,
	'months': 'enero,febrero,marzo,abril,mayo,junio,julio,agosto,septiembre,octubre,noviembre,diciembre',
	'weekdays': 'domingo,lunes,martes,miércoles|miercoles,jueves,viernes,sábado|sabado',
	'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,día|días|dia|dias,semana:|s,mes:|es,año|años|ano|anos',
	'numbers': 'uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez',
	'tokens': 'el,la,de',
	'short':'{d} {month} {yyyy}',
	'long': '{d} {month} {yyyy} {H}:{mm}',
	'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
	'past': '{sign} {num} {unit}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'timeMarker': 'a las',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'anteayer', 'value': -2 },
		{ 'name': 'day', 'src': 'ayer', 'value': -1 },
		{ 'name': 'day', 'src': 'hoy', 'value': 0 },
		{ 'name': 'day', 'src': 'mañana|manana', 'value': 1 },
		{ 'name': 'sign', 'src': 'hace', 'value': -1 },
		{ 'name': 'sign', 'src': 'dentro de', 'value': 1 },
		{ 'name': 'shift', 'src': 'pasad:o|a', 'value': -1 },
		{ 'name': 'shift', 'src': 'próximo|próxima|proximo|proxima', 'value': 1 }
	],
	'dateParse': [
		'{sign} {num} {unit}',
		'{num} {unit} {sign}',
		'{0?}{1?} {unit=5-7} {shift}',
		'{0?}{1?} {shift} {unit=5-7}'
	],
	'timeParse': [
		'{shift} {weekday}',
		'{weekday} {shift}',
		'{date?} {2?} {month} {2?} {year?}'
	]
});
Sugar.Date.addLocale('fi', {
		'plural':     true,
		'timeMarker': 'kello',
		'ampm':       ',',
		'months':     'tammikuu,helmikuu,maaliskuu,huhtikuu,toukokuu,kesäkuu,heinäkuu,elokuu,syyskuu,lokakuu,marraskuu,joulukuu',
		'weekdays':   'sunnuntai,maanantai,tiistai,keskiviikko,torstai,perjantai,lauantai',
		'units':      'millisekun:ti|tia|teja|tina|nin,sekun:ti|tia|teja|tina|nin,minuut:ti|tia|teja|tina|in,tun:ti|tia|teja|tina|nin,päiv:ä|ää|iä|änä|än,viik:ko|koa|koja|on|kona,kuukau:si|sia|tta|den|tena,vuo:si|sia|tta|den|tena',
		'numbers':    'yksi|ensimmäinen,kaksi|toinen,kolm:e|as,neljä:s,vii:si|des,kuu:si|des,seitsemä:n|s,kahdeksa:n|s,yhdeksä:n|s,kymmene:n|s',
		'articles':   '',
		'optionals':  '',
		'short':      '{d}. {month}ta {yyyy}',
		'long':       '{d}. {month}ta {yyyy} kello {H}.{mm}',
		'full':       '{Weekday}na {d}. {month}ta {yyyy} kello {H}.{mm}',
		'relative':       function(num, unit, ms, format) {
			var units = this['units'];
			function numberWithUnit(mult) {
				return (num === 1 ? '' : num + ' ') + units[(8 * mult) + unit];
			}
			switch(format) {
				case 'duration':  return numberWithUnit(0);
				case 'past':      return numberWithUnit(num > 1 ? 1 : 0) + ' sitten';
				case 'future':    return numberWithUnit(4) + ' päästä';
			}
		},
		'modifiers': [
				{ 'name': 'day',   'src': 'toissa päivänä|toissa päiväistä', 'value': -2 },
				{ 'name': 'day',   'src': 'eilen|eilistä', 'value': -1 },
				{ 'name': 'day',   'src': 'tänään', 'value': 0 },
				{ 'name': 'day',   'src': 'huomenna|huomista', 'value': 1 },
				{ 'name': 'day',   'src': 'ylihuomenna|ylihuomista', 'value': 2 },
				{ 'name': 'sign',  'src': 'sitten|aiemmin', 'value': -1 },
				{ 'name': 'sign',  'src': 'päästä|kuluttua|myöhemmin', 'value': 1 },
				{ 'name': 'edge',  'src': 'viimeinen|viimeisenä', 'value': -2 },
				{ 'name': 'edge',  'src': 'lopussa', 'value': -1 },
				{ 'name': 'edge',  'src': 'ensimmäinen|ensimmäisenä', 'value': 1 },
				{ 'name': 'shift', 'src': 'edellinen|edellisenä|edeltävä|edeltävänä|viime|toissa', 'value': -1 },
				{ 'name': 'shift', 'src': 'tänä|tämän', 'value': 0 },
				{ 'name': 'shift', 'src': 'seuraava|seuraavana|tuleva|tulevana|ensi', 'value': 1 }
		],
		'dateParse': [
				'{num} {unit} {sign}',
				'{sign} {num} {unit}',
				'{num} {unit=4-5} {sign} {day}',
				'{month} {year}',
				'{shift} {unit=5-7}'
		],
		'timeParse': [
				'{0} {num}{1} {day} of {month} {year?}',
				'{weekday?} {month} {date}{1} {year?}',
				'{date} {month} {year}',
				'{shift} {weekday}',
				'{shift} week {weekday}',
				'{weekday} {2} {shift} week',
				'{0} {date}{1} of {month}',
				'{0}{month?} {date?}{1} of {shift} {unit=6-7}'
		]
});

Sugar.Date.addLocale('fr', {
	'plural': true,
	'months': 'janvier,février|fevrier,mars,avril,mai,juin,juillet,août,septembre,octobre,novembre,décembre|decembre',
	'weekdays': 'dimanche,lundi,mardi,mercredi,jeudi,vendredi,samedi',
	'units': 'milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee',
	'numbers': 'un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix',
	'tokens': "l'|la|le",
	'short':'{d} {month} {yyyy}',
	'long': '{d} {month} {yyyy} {H}:{mm}',
	'full': '{Weekday} {d} {month} {yyyy} {H}:{mm}:{ss}',
	'past': '{sign} {num} {unit}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'timeMarker': 'à',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'hier', 'value': -1 },
		{ 'name': 'day', 'src': "aujourd'hui", 'value': 0 },
		{ 'name': 'day', 'src': 'demain', 'value': 1 },
		{ 'name': 'sign', 'src': 'il y a', 'value': -1 },
		{ 'name': 'sign', 'src': "dans|d'ici", 'value': 1 },
		{ 'name': 'shift', 'src': 'derni:èr|er|ère|ere', 'value': -1 },
		{ 'name': 'shift', 'src': 'prochain:|e', 'value': 1 }
	],
	'dateParse': [
		'{sign} {num} {unit}',
		'{sign} {num} {unit}',
		'{0?} {unit=5-7} {shift}'
	],
	'timeParse': [
		'{weekday?} {0?} {date?} {month} {year?}',
		'{0?} {weekday} {shift}'
	]
});

Sugar.Date.addLocale('it', {
	'plural': true,
	'months': 'Gennaio,Febbraio,Marzo,Aprile,Maggio,Giugno,Luglio,Agosto,Settembre,Ottobre,Novembre,Dicembre',
	'weekdays': 'Domenica,Luned:ì|i,Marted:ì|i,Mercoled:ì|i,Gioved:ì|i,Venerd:ì|i,Sabato',
	'units': 'millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i',
	'numbers': "un:|a|o|',due,tre,quattro,cinque,sei,sette,otto,nove,dieci",
	'tokens': "l'|la|il",
	'short':'{d} {Month} {yyyy}',
	'long': '{d} {Month} {yyyy} {H}:{mm}',
	'full': '{Weekday} {d} {Month} {yyyy} {H}:{mm}:{ss}',
	'past': '{num} {unit} {sign}',
	'future': '{num} {unit} {sign}',
	'duration': '{num} {unit}',
	'timeMarker': 'alle',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'ieri', 'value': -1 },
		{ 'name': 'day', 'src': 'oggi', 'value': 0 },
		{ 'name': 'day', 'src': 'domani', 'value': 1 },
		{ 'name': 'day', 'src': 'dopodomani', 'value': 2 },
		{ 'name': 'sign', 'src': 'fa', 'value': -1 },
		{ 'name': 'sign', 'src': 'da adesso', 'value': 1 },
		{ 'name': 'shift', 'src': 'scors:o|a', 'value': -1 },
		{ 'name': 'shift', 'src': 'prossim:o|a', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{0?} {unit=5-7} {shift}',
		'{0?} {shift} {unit=5-7}'
	],
	'timeParse': [
		'{weekday?} {date?} {month} {year?}',
		'{shift} {weekday}'
	]
});

Sugar.Date.addLocale('ja', {
	'monthSuffix': '月',
	'weekdays': '日曜日,月曜日,火曜日,水曜日,木曜日,金曜日,土曜日',
	'units': 'ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年',
	'short': '{yyyy}年{M}月{d}日',
	'long': '{yyyy}年{M}月{d}日 {H}時{mm}分',
	'full': '{yyyy}年{M}月{d}日 {Weekday} {H}時{mm}分{ss}秒',
	'past': '{num}{unit}{sign}',
	'future': '{num}{unit}{sign}',
	'duration': '{num}{unit}',
	'timeSuffixes': '時,分,秒',
	'ampm': '午前,午後',
	'modifiers': [
		{ 'name': 'day', 'src': '一昨日', 'value': -2 },
		{ 'name': 'day', 'src': '昨日', 'value': -1 },
		{ 'name': 'day', 'src': '今日', 'value': 0 },
		{ 'name': 'day', 'src': '明日', 'value': 1 },
		{ 'name': 'day', 'src': '明後日', 'value': 2 },
		{ 'name': 'sign', 'src': '前', 'value': -1 },
		{ 'name': 'sign', 'src': '後', 'value':  1 },
		{ 'name': 'shift', 'src': '去|先', 'value': -1 },
		{ 'name': 'shift', 'src': '来', 'value':  1 }
	],
	'dateParse': [
		'{num}{unit}{sign}'
	],
	'timeParse': [
		'{shift}{unit=5-7}{weekday?}',
		'{year}年{month?}月?{date?}日?',
		'{month}月{date?}日?',
		'{date}日'
	]
});

Sugar.Date.addLocale('ko', {
	'digitDate': true,
	'monthSuffix': '월',
	'weekdays': '일요일,월요일,화요일,수요일,목요일,금요일,토요일',
	'units': '밀리초,초,분,시간,일,주,개월|달,년|해',
	'numbers': '일|한,이,삼,사,오,육,칠,팔,구,십',
	'short': '{yyyy}년{M}월{d}일',
	'long': '{yyyy}년{M}월{d}일 {H}시{mm}분',
	'full': '{yyyy}년{M}월{d}일 {Weekday} {H}시{mm}분{ss}초',
	'past': '{num}{unit} {sign}',
	'future': '{num}{unit} {sign}',
	'duration': '{num}{unit}',
	'timeSuffixes': '시,분,초',
	'ampm': '오전,오후',
	'modifiers': [
		{ 'name': 'day', 'src': '그저께', 'value': -2 },
		{ 'name': 'day', 'src': '어제', 'value': -1 },
		{ 'name': 'day', 'src': '오늘', 'value': 0 },
		{ 'name': 'day', 'src': '내일', 'value': 1 },
		{ 'name': 'day', 'src': '모레', 'value': 2 },
		{ 'name': 'sign', 'src': '전', 'value': -1 },
		{ 'name': 'sign', 'src': '후', 'value':  1 },
		{ 'name': 'shift', 'src': '지난|작', 'value': -1 },
		{ 'name': 'shift', 'src': '이번|올', 'value': 0 },
		{ 'name': 'shift', 'src': '다음|내', 'value': 1 }
	],
	'dateParse': [
		'{num}{unit} {sign}',
		'{shift?} {unit=5-7}'
	],
	'timeParse': [
		'{shift} {unit=5?} {weekday}',
		'{year}년{month?}월?{date?}일?',
		'{month}월{date?}일?',
		'{date}일'
	]
});

Sugar.Date.addLocale('nl', {
	'plural': true,
	'months': 'januari,februari,maart,april,mei,juni,juli,augustus,september,oktober,november,december',
	'weekdays': 'zondag|zo,maandag|ma,dinsdag|di,woensdag|woe|wo,donderdag|do,vrijdag|vrij|vr,zaterdag|za',
	'units': 'milliseconde:|n,seconde:|n,minu:ut|ten,uur,dag:|en,we:ek|ken,maand:|en,jaar',
	'numbers': 'een,twee,drie,vier,vijf,zes,zeven,acht,negen',
	'tokens': '',
	'short':'{d} {Month} {yyyy}',
	'long': '{d} {Month} {yyyy} {H}:{mm}',
	'full': '{Weekday} {d} {Month} {yyyy} {H}:{mm}:{ss}',
	'past': '{num} {unit} {sign}',
	'future': '{num} {unit} {sign}',
	'duration': '{num} {unit}',
	'timeMarker': "'s|om",
	'modifiers': [
		{ 'name': 'day', 'src': 'gisteren', 'value': -1 },
		{ 'name': 'day', 'src': 'vandaag', 'value': 0 },
		{ 'name': 'day', 'src': 'morgen', 'value': 1 },
		{ 'name': 'day', 'src': 'overmorgen', 'value': 2 },
		{ 'name': 'sign', 'src': 'geleden', 'value': -1 },
		{ 'name': 'sign', 'src': 'vanaf nu', 'value': 1 },
		{ 'name': 'shift', 'src': 'laatste|vorige|afgelopen', 'value': -1 },
		{ 'name': 'shift', 'src': 'volgend:|e', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{0?} {unit=5-7} {shift}',
		'{0?} {shift} {unit=5-7}'
	],
	'timeParse': [
		'{weekday?} {date?} {month} {year?}',
		'{shift} {weekday}'
	]
});

Sugar.Date.addLocale('pl', {
	'plural':    true,
	'months':    'Styczeń|Stycznia,Luty|Lutego,Marzec|Marca,Kwiecień|Kwietnia,Maj|Maja,Czerwiec|Czerwca,Lipiec|Lipca,Sierpień|Sierpnia,Wrzesień|Września,Październik|Października,Listopad|Listopada,Grudzień|Grudnia',
	'weekdays':  'Niedziela|Niedzielę,Poniedziałek,Wtorek,Środ:a|ę,Czwartek,Piątek,Sobota|Sobotę',
	'units':     'milisekund:a|y|,sekund:a|y|,minut:a|y|,godzin:a|y|,dzień|dni,tydzień|tygodnie|tygodni,miesiące|miesiące|miesięcy,rok|lata|lat',
	'numbers':   'jeden|jedną,dwa|dwie,trzy,cztery,pięć,sześć,siedem,osiem,dziewięć,dziesięć',
	'optionals': 'w|we,roku',
	'short':     '{d} {Month} {yyyy}',
	'long':      '{d} {Month} {yyyy} {H}:{mm}',
	'full' :     '{Weekday}, {d} {Month} {yyyy} {H}:{mm}:{ss}',
	'past':      '{num} {unit} {sign}',
	'future':    '{sign} {num} {unit}',
	'duration':  '{num} {unit}',
	'timeMarker':'o',
	'ampm':      'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'przedwczoraj', 'value': -2 },
		{ 'name': 'day', 'src': 'wczoraj', 'value': -1 },
		{ 'name': 'day', 'src': 'dzisiaj|dziś', 'value': 0 },
		{ 'name': 'day', 'src': 'jutro', 'value': 1 },
		{ 'name': 'day', 'src': 'pojutrze', 'value': 2 },
		{ 'name': 'sign', 'src': 'temu|przed', 'value': -1 },
		{ 'name': 'sign', 'src': 'za', 'value': 1 },
		{ 'name': 'shift', 'src': 'zeszły|zeszła|ostatni|ostatnia', 'value': -1 },
		{ 'name': 'shift', 'src': 'następny|następna|następnego|przyszły|przyszła|przyszłego', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{sign} {num} {unit}',
		'{month} {year}',
		'{shift} {unit=5-7}',
		'{0} {shift?} {weekday}'
	],
	'timeParse': [
		'{date} {month} {year?} {1}',
		'{0} {shift?} {weekday}'
	]
});

Sugar.Date.addLocale('pt', {
	'plural': true,
	'months': 'janeiro,fevereiro,março,abril,maio,junho,julho,agosto,setembro,outubro,novembro,dezembro',
	'weekdays': 'domingo,segunda-feira,terça-feira,quarta-feira,quinta-feira,sexta-feira,sábado|sabado',
	'units': 'milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,mês|mêses|mes|meses,ano:|s',
	'numbers': 'um:|a,dois|duas,três|tres,quatro,cinco,seis,sete,oito,nove,dez',
	'tokens': 'a,de',
	'short':'{d} de {month} de {yyyy}',
	'long': '{d} de {month} de {yyyy} {H}:{mm}',
	'full': '{Weekday}, {d} de {month} de {yyyy} {H}:{mm}:{ss}',
	'past': '{num} {unit} {sign}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'timeMarker': 'às',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'anteontem', 'value': -2 },
		{ 'name': 'day', 'src': 'ontem', 'value': -1 },
		{ 'name': 'day', 'src': 'hoje', 'value': 0 },
		{ 'name': 'day', 'src': 'amanh:ã|a', 'value': 1 },
		{ 'name': 'sign', 'src': 'atrás|atras|há|ha', 'value': -1 },
		{ 'name': 'sign', 'src': 'daqui a', 'value': 1 },
		{ 'name': 'shift', 'src': 'passad:o|a', 'value': -1 },
		{ 'name': 'shift', 'src': 'próximo|próxima|proximo|proxima', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{sign} {num} {unit}',
		'{0?} {unit=5-7} {shift}',
		'{0?} {shift} {unit=5-7}'
	],
	'timeParse': [
		'{date?} {1?} {month} {1?} {year?}',
		'{0?} {shift} {weekday}'
	]
});

Sugar.Date.addLocale('ru', {
	'months': 'Январ:я|ь,Феврал:я|ь,Март:а|,Апрел:я|ь,Ма:я|й,Июн:я|ь,Июл:я|ь,Август:а|,Сентябр:я|ь,Октябр:я|ь,Ноябр:я|ь,Декабр:я|ь',
	'weekdays': 'Воскресенье,Понедельник,Вторник,Среда,Четверг,Пятница,Суббота',
	'units': 'миллисекунд:а|у|ы|,секунд:а|у|ы|,минут:а|у|ы|,час:||а|ов,день|день|дня|дней,недел:я|ю|и|ь|е,месяц:||а|ев|е,год|год|года|лет|году',
	'numbers': 'од:ин|ну,дв:а|е,три,четыре,пять,шесть,семь,восемь,девять,десять',
	'tokens': 'в|на,года',
	'short':'{d} {month} {yyyy} года',
	'long': '{d} {month} {yyyy} года {H}:{mm}',
	'full': '{Weekday} {d} {month} {yyyy} года {H}:{mm}:{ss}',
	'relative': function(num, unit, ms, format) {
		var numberWithUnit, last = num.toString().slice(-1), mult;
		switch(true) {
			case num >= 11 && num <= 15: mult = 3; break;
			case last == 1: mult = 1; break;
			case last >= 2 && last <= 4: mult = 2; break;
			default: mult = 3;
		}
		numberWithUnit = num + ' ' + this['units'][(mult * 8) + unit];
		switch(format) {
			case 'duration':  return numberWithUnit;
			case 'past':      return numberWithUnit + ' назад';
			case 'future':    return 'через ' + numberWithUnit;
		}
	},
	'timeMarker': 'в',
	'ampm': ' утра, вечера',
	'modifiers': [
		{ 'name': 'day', 'src': 'позавчера', 'value': -2 },
		{ 'name': 'day', 'src': 'вчера', 'value': -1 },
		{ 'name': 'day', 'src': 'сегодня', 'value': 0 },
		{ 'name': 'day', 'src': 'завтра', 'value': 1 },
		{ 'name': 'day', 'src': 'послезавтра', 'value': 2 },
		{ 'name': 'sign', 'src': 'назад', 'value': -1 },
		{ 'name': 'sign', 'src': 'через', 'value': 1 },
		{ 'name': 'shift', 'src': 'прошл:ый|ой|ом', 'value': -1 },
		{ 'name': 'shift', 'src': 'следующ:ий|ей|ем', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{sign} {num} {unit}',
		'{month} {year}',
		'{0?} {shift} {unit=5-7}'
	],
	'timeParse': [
		'{date} {month} {year?} {1?}',
		'{0?} {shift} {weekday}'
	]
});

Sugar.Date.addLocale('sv', {
	'plural': true,
	'months': 'januari,februari,mars,april,maj,juni,juli,augusti,september,oktober,november,december',
	'weekdays': 'söndag|sondag,måndag:|en+mandag:|en,tisdag,onsdag,torsdag,fredag,lördag|lordag',
	'units': 'millisekund:|er,sekund:|er,minut:|er,timm:e|ar,dag:|ar,veck:a|or|an,månad:|er|en+manad:|er|en,år:||et+ar:||et',
	'numbers': 'en|ett,två|tva,tre,fyra,fem,sex,sju,åtta|atta,nio,tio',
	'tokens': 'den,för|for',
	'articles': 'den',
	'short':'den {d} {month} {yyyy}',
	'long': 'den {d} {month} {yyyy} {H}:{mm}',
	'full': '{Weekday} den {d} {month} {yyyy} {H}:{mm}:{ss}',
	'past': '{num} {unit} {sign}',
	'future': '{sign} {num} {unit}',
	'duration': '{num} {unit}',
	'ampm': 'am,pm',
	'modifiers': [
		{ 'name': 'day', 'src': 'förrgår|i förrgår|iförrgår|forrgar|i forrgar|iforrgar', 'value': -2 },
		{ 'name': 'day', 'src': 'går|i går|igår|gar|i gar|igar', 'value': -1 },
		{ 'name': 'day', 'src': 'dag|i dag|idag', 'value': 0 },
		{ 'name': 'day', 'src': 'morgon|i morgon|imorgon', 'value': 1 },
		{ 'name': 'day', 'src': 'över morgon|övermorgon|i över morgon|i övermorgon|iövermorgon|over morgon|overmorgon|i over morgon|i overmorgon|iovermorgon', 'value': 2 },
		{ 'name': 'sign', 'src': 'sedan|sen', 'value': -1 },
		{ 'name': 'sign', 'src': 'om', 'value':  1 },
		{ 'name': 'shift', 'src': 'i förra|förra|i forra|forra', 'value': -1 },
		{ 'name': 'shift', 'src': 'denna', 'value': 0 },
		{ 'name': 'shift', 'src': 'nästa|nasta', 'value': 1 }
	],
	'dateParse': [
		'{num} {unit} {sign}',
		'{sign} {num} {unit}',
		'{1?} {num} {unit} {sign}',
		'{shift} {unit=5-7}'
	],
	'timeParse': [
		'{0?} {weekday?} {date?} {month} {year}',
		'{date} {month}',
		'{shift} {weekday}'
	]
});

Sugar.Date.addLocale('zh-CN', {
	'variant': true,
	'monthSuffix': '月',
	'weekdays': '星期日|周日|星期天,星期一|周一,星期二|周二,星期三|周三,星期四|周四,星期五|周五,星期六|周六',
	'units': '毫秒,秒钟,分钟,小时,天,个星期|周,个月,年',
	'tokens': '日|号',
	'short':'{yyyy}年{M}月{d}日',
	'long': '{yyyy}年{M}月{d}日 {tt}{h}:{mm}',
	'full': '{yyyy}年{M}月{d}日 {weekday} {tt}{h}:{mm}:{ss}',
	'past': '{num}{unit}{sign}',
	'future': '{num}{unit}{sign}',
	'duration': '{num}{unit}',
	'timeSuffixes': '点|时,分钟?,秒',
	'ampm': '上午,下午',
	'modifiers': [
		{ 'name': 'day', 'src': '大前天', 'value': -3 },
		{ 'name': 'day', 'src': '前天', 'value': -2 },
		{ 'name': 'day', 'src': '昨天', 'value': -1 },
		{ 'name': 'day', 'src': '今天', 'value': 0 },
		{ 'name': 'day', 'src': '明天', 'value': 1 },
		{ 'name': 'day', 'src': '后天', 'value': 2 },
		{ 'name': 'day', 'src': '大后天', 'value': 3 },
		{ 'name': 'sign', 'src': '前', 'value': -1 },
		{ 'name': 'sign', 'src': '后', 'value':  1 },
		{ 'name': 'shift', 'src': '上|去', 'value': -1 },
		{ 'name': 'shift', 'src': '这', 'value':  0 },
		{ 'name': 'shift', 'src': '下|明', 'value':  1 }
	],
	'dateParse': [
		'{num}{unit}{sign}',
		'{shift}{unit=5-7}'
	],
	'timeParse': [
		'{shift}{weekday}',
		'{year}年{month?}月?{date?}{0?}',
		'{month}月{date?}{0?}',
		'{date}[日号]'
	]
});

Sugar.Date.addLocale('zh-TW', {
	'monthSuffix': '月',
	'weekdays': '星期日|週日|星期天,星期一|週一,星期二|週二,星期三|週三,星期四|週四,星期五|週五,星期六|週六',
	'units': '毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年',
	'tokens': '日|號',
	'short':'{yyyy}年{M}月{d}日',
	'long': '{yyyy}年{M}月{d}日 {tt}{h}:{mm}',
	'full': '{yyyy}年{M}月{d}日 {Weekday} {tt}{h}:{mm}:{ss}',
	'past': '{num}{unit}{sign}',
	'future': '{num}{unit}{sign}',
	'duration': '{num}{unit}',
	'timeSuffixes': '點|時,分鐘?,秒',
	'ampm': '上午,下午',
	'modifiers': [
		{ 'name': 'day', 'src': '大前天', 'value': -3 },
		{ 'name': 'day', 'src': '前天', 'value': -2 },
		{ 'name': 'day', 'src': '昨天', 'value': -1 },
		{ 'name': 'day', 'src': '今天', 'value': 0 },
		{ 'name': 'day', 'src': '明天', 'value': 1 },
		{ 'name': 'day', 'src': '後天', 'value': 2 },
		{ 'name': 'day', 'src': '大後天', 'value': 3 },
		{ 'name': 'sign', 'src': '前', 'value': -1 },
		{ 'name': 'sign', 'src': '後', 'value': 1 },
		{ 'name': 'shift', 'src': '上|去', 'value': -1 },
		{ 'name': 'shift', 'src': '這', 'value':  0 },
		{ 'name': 'shift', 'src': '下|明', 'value':  1 }
	],
	'dateParse': [
		'{num}{unit}{sign}',
		'{shift}{unit=5-7}'
	],
	'timeParse': [
		'{shift}{weekday}',
		'{year}年{month?}月?{date?}{0?}',
		'{month}月{date?}{0?}',
		'{date}[日號]'
	]
});

})();
