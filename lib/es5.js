(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = factory();
	}
}(this, function () {
	var ArrayPrototype = Array.prototype;
	var ObjectPrototype = Object.prototype;
	var FunctionPrototype = Function.prototype;
	var StringPrototype = String.prototype;
	var NumberPrototype = Number.prototype;
	var array_slice = ArrayPrototype.slice;
	var array_splice = ArrayPrototype.splice;
	var array_push = ArrayPrototype.push;
	var array_unshift = ArrayPrototype.unshift;
	var call = FunctionPrototype.call;
	var _toString = ObjectPrototype.toString;
	var isFunction = function (val) {
		return ObjectPrototype.toString.call(val) === '[object Function]';
	};
	var isRegex = function (val) {
		return ObjectPrototype.toString.call(val) === '[object RegExp]';
	};
	var isArray = function isArray(obj) {
		return _toString.call(obj) === "[object Array]";
	};
	var isString = function isString(obj) {
		return _toString.call(obj) === "[object String]";
	};
	var isArguments = function isArguments(value) {
		var str = _toString.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = !isArray(value) && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && isFunction(value.callee);
		}
		return isArgs;
	};
	var supportsDescriptors = Object.defineProperty && (function () {
		try {
			Object.defineProperty({}, 'x', {});
			return true;
		} catch (e) {
			return false;
		}
	}());
	var defineProperty;
	if (supportsDescriptors) {
		defineProperty = function (object, name, method, forceAssign) {
			if (!forceAssign && (name in object)) {
				return;
			}
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				writable: true,
				value: method
			});
		};
	} else {
		defineProperty = function (object, name, method, forceAssign) {
			if (!forceAssign && (name in object)) {
				return;
			}
			object[name] = method;
		};
	}
	var defineProperties = function (object, map, forceAssign) {
		for (var name in map) {
			if (ObjectPrototype.hasOwnProperty.call(map, name)) {
				defineProperty(object, name, map[name], forceAssign);
			}
		}
	};

	function toInteger(n) {
		n = +n;
		if (n !== n) {
			n = 0;
		} else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
		return n;
	}

	function isPrimitive(input) {
		var type = typeof input;
		return (
			input === null ||
			type === "undefined" ||
			type === "boolean" ||
			type === "number" ||
			type === "string"
		);
	}

	function toPrimitive(input) {
		var val, valueOf, toStr;
		if (isPrimitive(input)) {
			return input;
		}
		valueOf = input.valueOf;
		if (isFunction(valueOf)) {
			val = valueOf.call(input);
			if (isPrimitive(val)) {
				return val;
			}
		}
		toStr = input.toString;
		if (isFunction(toStr)) {
			val = toStr.call(input);
			if (isPrimitive(val)) {
				return val;
			}
		}
		throw new TypeError();
	}
	var toObject = function (o) {
		if (o == null) {
			throw new TypeError("can't convert " + o + " to object");
		}
		return Object(o);
	};
	var ToUint32 = function ToUint32(x) {
		return x >>> 0;
	};

	function Empty() {}
	defineProperties(FunctionPrototype, {
		bind: function bind(that) {
			var target = this;
			if (!isFunction(target)) {
				throw new TypeError("Function.prototype.bind called on incompatible " + target);
			}
			var args = array_slice.call(arguments, 1);
			var binder = function () {
				if (this instanceof bound) {
					var result = target.apply(
						this,
						args.concat(array_slice.call(arguments))
					);
					if (Object(result) === result) {
						return result;
					}
					return this;
				} else {
					return target.apply(
						that,
						args.concat(array_slice.call(arguments))
					);
				}
			};
			var boundLength = Math.max(0, target.length - args.length);
			var boundArgs = [];
			for (var i = 0; i < boundLength; i++) {
				boundArgs.push("$" + i);
			}
			var bound = Function("binder", "return function (" + boundArgs.join(",") + "){return binder.apply(this,arguments)}")(binder);
			if (target.prototype) {
				Empty.prototype = target.prototype;
				bound.prototype = new Empty();
				Empty.prototype = null;
			}
			return bound;
		}
	});
	var owns = call.bind(ObjectPrototype.hasOwnProperty);
	var defineGetter;
	var defineSetter;
	var lookupGetter;
	var lookupSetter;
	var supportsAccessors;
	if ((supportsAccessors = owns(ObjectPrototype, "__defineGetter__"))) {
		defineGetter = call.bind(ObjectPrototype.__defineGetter__);
		defineSetter = call.bind(ObjectPrototype.__defineSetter__);
		lookupGetter = call.bind(ObjectPrototype.__lookupGetter__);
		lookupSetter = call.bind(ObjectPrototype.__lookupSetter__);
	}
	var spliceNoopReturnsEmptyArray = (function () {
		var a = [1, 2];
		var result = a.splice();
		return a.length === 2 && isArray(result) && result.length === 0;
	}());
	defineProperties(ArrayPrototype, {
		splice: function splice(start, deleteCount) {
			if (arguments.length === 0) {
				return [];
			} else {
				return array_splice.apply(this, arguments);
			}
		}
	}, spliceNoopReturnsEmptyArray);
	var spliceWorksWithEmptyObject = (function () {
		var obj = {};
		ArrayPrototype.splice.call(obj, 0, 0, 1);
		return obj.length === 1;
	}());
	defineProperties(ArrayPrototype, {
		splice: function splice(start, deleteCount) {
			if (arguments.length === 0) {
				return [];
			}
			var args = arguments;
			this.length = Math.max(toInteger(this.length), 0);
			if (arguments.length > 0 && typeof deleteCount !== 'number') {
				args = array_slice.call(arguments);
				if (args.length < 2) {
					args.push(this.length - start);
				} else {
					args[1] = toInteger(deleteCount);
				}
			}
			return array_splice.apply(this, args);
		}
	}, !spliceWorksWithEmptyObject);
	var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
	defineProperties(ArrayPrototype, {
		unshift: function () {
			array_unshift.apply(this, arguments);
			return this.length;
		}
	}, hasUnshiftReturnValueBug);
	defineProperties(Array, {
		isArray: isArray
	});
	var boxedString = Object("a");
	var splitString = boxedString[0] !== "a" || !(0 in boxedString);
	var properlyBoxesContext = function properlyBoxed(method) {
		var properlyBoxesNonStrict = true;
		var properlyBoxesStrict = true;
		if (method) {
			method.call('foo', function (_, __, context) {
				if (typeof context !== 'object') {
					properlyBoxesNonStrict = false;
				}
			});
			method.call([1], function () {
				'use strict';
				properlyBoxesStrict = typeof this === 'string';
			}, 'x');
		}
		return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};
	defineProperties(ArrayPrototype, {
		forEach: function forEach(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				thisp = arguments[1],
				i = -1,
				length = self.length >>> 0;
			if (!isFunction(fun)) {
				throw new TypeError();
			}
			while (++i < length) {
				if (i in self) {
					fun.call(thisp, self[i], i, object);
				}
			}
		}
	}, !properlyBoxesContext(ArrayPrototype.forEach));
	defineProperties(ArrayPrototype, {
		map: function map(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0,
				result = Array(length),
				thisp = arguments[1];
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			for (var i = 0; i < length; i++) {
				if (i in self) {
					result[i] = fun.call(thisp, self[i], i, object);
				}
			}
			return result;
		}
	}, !properlyBoxesContext(ArrayPrototype.map));
	defineProperties(ArrayPrototype, {
		filter: function filter(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0,
				result = [],
				value,
				thisp = arguments[1];
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			for (var i = 0; i < length; i++) {
				if (i in self) {
					value = self[i];
					if (fun.call(thisp, value, i, object)) {
						result.push(value);
					}
				}
			}
			return result;
		}
	}, !properlyBoxesContext(ArrayPrototype.filter));
	defineProperties(ArrayPrototype, {
		every: function every(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0,
				thisp = arguments[1];
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			for (var i = 0; i < length; i++) {
				if (i in self && !fun.call(thisp, self[i], i, object)) {
					return false;
				}
			}
			return true;
		}
	}, !properlyBoxesContext(ArrayPrototype.every));
	defineProperties(ArrayPrototype, {
		some: function some(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0,
				thisp = arguments[1];
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			for (var i = 0; i < length; i++) {
				if (i in self && fun.call(thisp, self[i], i, object)) {
					return true;
				}
			}
			return false;
		}
	}, !properlyBoxesContext(ArrayPrototype.some));
	var reduceCoercesToObject = false;
	if (ArrayPrototype.reduce) {
		reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
			return list;
		}) === 'object';
	}
	defineProperties(ArrayPrototype, {
		reduce: function reduce(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0;
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			if (!length && arguments.length === 1) {
				throw new TypeError("reduce of empty array with no initial value");
			}
			var i = 0;
			var result;
			if (arguments.length >= 2) {
				result = arguments[1];
			} else {
				do {
					if (i in self) {
						result = self[i++];
						break;
					}
					if (++i >= length) {
						throw new TypeError("reduce of empty array with no initial value");
					}
				} while (true);
			}
			for (; i < length; i++) {
				if (i in self) {
					result = fun.call(void 0, result, self[i], i, object);
				}
			}
			return result;
		}
	}, !reduceCoercesToObject);
	var reduceRightCoercesToObject = false;
	if (ArrayPrototype.reduceRight) {
		reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
			return list;
		}) === 'object';
	}
	defineProperties(ArrayPrototype, {
		reduceRight: function reduceRight(fun) {
			var object = toObject(this),
				self = splitString && isString(this) ? this.split('') : object,
				length = self.length >>> 0;
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}
			if (!length && arguments.length === 1) {
				throw new TypeError("reduceRight of empty array with no initial value");
			}
			var result, i = length - 1;
			if (arguments.length >= 2) {
				result = arguments[1];
			} else {
				do {
					if (i in self) {
						result = self[i--];
						break;
					}
					if (--i < 0) {
						throw new TypeError("reduceRight of empty array with no initial value");
					}
				} while (true);
			}
			if (i < 0) {
				return result;
			}
			do {
				if (i in self) {
					result = fun.call(void 0, result, self[i], i, object);
				}
			} while (i--);
			return result;
		}
	}, !reduceRightCoercesToObject);
	var hasFirefox2IndexOfBug = Array.prototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
	defineProperties(ArrayPrototype, {
		indexOf: function indexOf(sought) {
			var self = splitString && isString(this) ? this.split('') : toObject(this),
				length = self.length >>> 0;
			if (!length) {
				return -1;
			}
			var i = 0;
			if (arguments.length > 1) {
				i = toInteger(arguments[1]);
			}
			i = i >= 0 ? i : Math.max(0, length + i);
			for (; i < length; i++) {
				if (i in self && self[i] === sought) {
					return i;
				}
			}
			return -1;
		}
	}, hasFirefox2IndexOfBug);
	var hasFirefox2LastIndexOfBug = Array.prototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
	defineProperties(ArrayPrototype, {
		lastIndexOf: function lastIndexOf(sought) {
			var self = splitString && isString(this) ? this.split('') : toObject(this),
				length = self.length >>> 0;
			if (!length) {
				return -1;
			}
			var i = length - 1;
			if (arguments.length > 1) {
				i = Math.min(i, toInteger(arguments[1]));
			}
			i = i >= 0 ? i : length - Math.abs(i);
			for (; i >= 0; i--) {
				if (i in self && sought === self[i]) {
					return i;
				}
			}
			return -1;
		}
	}, hasFirefox2LastIndexOfBug);
	var hasDontEnumBug = !({
			'toString': null
		}).propertyIsEnumerable('toString'),
		hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
		dontEnums = [
		"toString",
		"toLocaleString",
		"valueOf",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"constructor"
	],
		dontEnumsLength = dontEnums.length;
	defineProperties(Object, {
		keys: function keys(object) {
			var isFn = isFunction(object),
				isArgs = isArguments(object),
				isObject = object !== null && typeof object === 'object',
				isStr = isObject && isString(object);
			if (!isObject && !isFn && !isArgs) {
				throw new TypeError("Object.keys called on a non-object");
			}
			var theKeys = [];
			var skipProto = hasProtoEnumBug && isFn;
			if (isStr || isArgs) {
				for (var i = 0; i < object.length; ++i) {
					theKeys.push(String(i));
				}
			} else {
				for (var name in object) {
					if (!(skipProto && name === 'prototype') && owns(object, name)) {
						theKeys.push(String(name));
					}
				}
			}
			if (hasDontEnumBug) {
				var ctor = object.constructor,
					skipConstructor = ctor && ctor.prototype === object;
				for (var j = 0; j < dontEnumsLength; j++) {
					var dontEnum = dontEnums[j];
					if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
						theKeys.push(dontEnum);
					}
				}
			}
			return theKeys;
		}
	});
	var keysWorksWithArguments = Object.keys && (function () {
		return Object.keys(arguments).length === 2;
	}(1, 2));
	var originalKeys = Object.keys;
	defineProperties(Object, {
		keys: function keys(object) {
			if (isArguments(object)) {
				return originalKeys(ArrayPrototype.slice.call(object));
			} else {
				return originalKeys(object);
			}
		}
	}, !keysWorksWithArguments);
	var negativeDate = -62198755200000;
	var negativeYearString = "-000001";
	var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1;
	defineProperties(Date.prototype, {
		toISOString: function toISOString() {
			var result, length, value, year, month;
			if (!isFinite(this)) {
				throw new RangeError("Date.prototype.toISOString called on non-finite value.");
			}
			year = this.getUTCFullYear();
			month = this.getUTCMonth();
			year += Math.floor(month / 12);
			month = (month % 12 + 12) % 12;
			result = [month + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
			year = (
				(year < 0 ? "-" : (year > 9999 ? "+" : "")) +
				("00000" + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6)
			);
			length = result.length;
			while (length--) {
				value = result[length];
				if (value < 10) {
					result[length] = "0" + value;
				}
			}
			return (
				year + "-" + result.slice(0, 2).join("-") +
				"T" + result.slice(2).join(":") + "." +
				("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
			);
		}
	}, hasNegativeDateBug);
	var dateToJSONIsSupported = false;
	try {
		dateToJSONIsSupported = (
			Date.prototype.toJSON &&
			new Date(NaN).toJSON() === null &&
			new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
			Date.prototype.toJSON.call({
				toISOString: function () {
					return true;
				}
			})
		);
	} catch (e) {}
	if (!dateToJSONIsSupported) {
		Date.prototype.toJSON = function toJSON(key) {
			var o = Object(this),
				tv = toPrimitive(o),
				toISO;
			if (typeof tv === "number" && !isFinite(tv)) {
				return null;
			}
			toISO = o.toISOString;
			if (typeof toISO !== "function") {
				throw new TypeError("toISOString property is not callable");
			}
			return toISO.call(o);
		};
	}
	var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
	var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z'));
	var doesNotParseY2KNewYear = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
	if (!Date.parse || doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
		Date = (function (NativeDate) {
			function Date(Y, M, D, h, m, s, ms) {
				var length = arguments.length;
				if (this instanceof NativeDate) {
					var date = length === 1 && String(Y) === Y ?
						new NativeDate(Date.parse(Y)) :
						length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
						length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
						length >= 5 ? new NativeDate(Y, M, D, h, m) :
						length >= 4 ? new NativeDate(Y, M, D, h) :
						length >= 3 ? new NativeDate(Y, M, D) :
						length >= 2 ? new NativeDate(Y, M) :
						length >= 1 ? new NativeDate(Y) :
						new NativeDate();
					date.constructor = Date;
					return date;
				}
				return NativeDate.apply(this, arguments);
			}
			var isoDateExpression = new RegExp("^" +
				"(\\d{4}|[\+\-]\\d{6})" +
				"(?:-(\\d{2})" +
				"(?:-(\\d{2})" +
				"(?:" +
				"T(\\d{2})" +
				":(\\d{2})" +
				"(?:" +
				":(\\d{2})" +
				"(?:(\\.\\d{1,}))?" +
				")?" +
				"(" +
				"Z|" +
				"(?:" +
				"([-+])" +
				"(\\d{2})" +
				":(\\d{2})" +
				")" +
				")?)?)?)?" +
				"$");
			var months = [
			0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
		];

			function dayFromMonth(year, month) {
				var t = month > 1 ? 1 : 0;
				return (
					months[month] +
					Math.floor((year - 1969 + t) / 4) -
					Math.floor((year - 1901 + t) / 100) +
					Math.floor((year - 1601 + t) / 400) +
					365 * (year - 1970)
				);
			}

			function toUTC(t) {
				return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
			}
			for (var key in NativeDate) {
				Date[key] = NativeDate[key];
			}
			Date.now = NativeDate.now;
			Date.UTC = NativeDate.UTC;
			Date.prototype = NativeDate.prototype;
			Date.prototype.constructor = Date;
			Date.parse = function parse(string) {
				var match = isoDateExpression.exec(string);
				if (match) {
					var year = Number(match[1]),
						month = Number(match[2] || 1) - 1,
						day = Number(match[3] || 1) - 1,
						hour = Number(match[4] || 0),
						minute = Number(match[5] || 0),
						second = Number(match[6] || 0),
						millisecond = Math.floor(Number(match[7] || 0) * 1000),
						isLocalTime = Boolean(match[4] && !match[8]),
						signOffset = match[9] === "-" ? 1 : -1,
						hourOffset = Number(match[10] || 0),
						minuteOffset = Number(match[11] || 0),
						result;
					if (
						hour < (
							minute > 0 || second > 0 || millisecond > 0 ?
							24 : 25
						) &&
						minute < 60 && second < 60 && millisecond < 1000 &&
						month > -1 && month < 12 && hourOffset < 24 &&
						minuteOffset < 60 &&
						day > -1 &&
						day < (
							dayFromMonth(year, month + 1) -
							dayFromMonth(year, month)
						)
					) {
						result = (
							(dayFromMonth(year, month) + day) * 24 +
							hour +
							hourOffset * signOffset
						) * 60;
						result = (
							(result + minute + minuteOffset * signOffset) * 60 +
							second
						) * 1000 + millisecond;
						if (isLocalTime) {
							result = toUTC(result);
						}
						if (-8.64e15 <= result && result <= 8.64e15) {
							return result;
						}
					}
					return NaN;
				}
				return NativeDate.parse.apply(this, arguments);
			};
			return Date;
		})(Date);
	}
	if (!Date.now) {
		Date.now = function now() {
			return new Date().getTime();
		};
	}
	var hasToFixedBugs = NumberPrototype.toFixed && (
		(0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) !== '1' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128"
	);
	var toFixedHelpers = {
		base: 1e7,
		size: 6,
		data: [0, 0, 0, 0, 0, 0],
		multiply: function multiply(n, c) {
			var i = -1;
			while (++i < toFixedHelpers.size) {
				c += n * toFixedHelpers.data[i];
				toFixedHelpers.data[i] = c % toFixedHelpers.base;
				c = Math.floor(c / toFixedHelpers.base);
			}
		},
		divide: function divide(n) {
			var i = toFixedHelpers.size,
				c = 0;
			while (--i >= 0) {
				c += toFixedHelpers.data[i];
				toFixedHelpers.data[i] = Math.floor(c / n);
				c = (c % n) * toFixedHelpers.base;
			}
		},
		numToString: function numToString() {
			var i = toFixedHelpers.size;
			var s = '';
			while (--i >= 0) {
				if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
					var t = String(toFixedHelpers.data[i]);
					if (s === '') {
						s = t;
					} else {
						s += '0000000'.slice(0, 7 - t.length) + t;
					}
				}
			}
			return s;
		},
		pow: function pow(x, n, acc) {
			return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
		},
		log: function log(x) {
			var n = 0;
			while (x >= 4096) {
				n += 12;
				x /= 4096;
			}
			while (x >= 2) {
				n += 1;
				x /= 2;
			}
			return n;
		}
	};
	defineProperties(NumberPrototype, {
		toFixed: function toFixed(fractionDigits) {
			var f, x, s, m, e, z, j, k;
			f = Number(fractionDigits);
			f = f !== f ? 0 : Math.floor(f);
			if (f < 0 || f > 20) {
				throw new RangeError("Number.toFixed called with invalid number of decimals");
			}
			x = Number(this);
			if (x !== x) {
				return "NaN";
			}
			if (x <= -1e21 || x >= 1e21) {
				return String(x);
			}
			s = "";
			if (x < 0) {
				s = "-";
				x = -x;
			}
			m = "0";
			if (x > 1e-21) {
				e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
				z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
				z *= 0x10000000000000;
				e = 52 - e;
				if (e > 0) {
					toFixedHelpers.multiply(0, z);
					j = f;
					while (j >= 7) {
						toFixedHelpers.multiply(1e7, 0);
						j -= 7;
					}
					toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
					j = e - 1;
					while (j >= 23) {
						toFixedHelpers.divide(1 << 23);
						j -= 23;
					}
					toFixedHelpers.divide(1 << j);
					toFixedHelpers.multiply(1, 1);
					toFixedHelpers.divide(2);
					m = toFixedHelpers.numToString();
				} else {
					toFixedHelpers.multiply(0, z);
					toFixedHelpers.multiply(1 << (-e), 0);
					m = toFixedHelpers.numToString() + '0.00000000000000000000'.slice(2, 2 + f);
				}
			}
			if (f > 0) {
				k = m.length;
				if (k <= f) {
					m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
				} else {
					m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
				}
			} else {
				m = s + m;
			}
			return m;
		}
	}, hasToFixedBugs);
	var string_split = StringPrototype.split;
	if (
		'ab'.split(/(?:ab)*/).length !== 2 ||
		'.'.split(/(.?)(.?)/).length !== 4 ||
		'tesst'.split(/(s)*/)[1] === "t" ||
		'test'.split(/(?:)/, -1).length !== 4 ||
		''.split(/.?/).length ||
		'.'.split(/()()/).length > 1
	) {
		(function () {
			var compliantExecNpcg = /()??/.exec("")[1] === void 0;
			StringPrototype.split = function (separator, limit) {
				var string = this;
				if (separator === void 0 && limit === 0) {
					return [];
				}
				if (_toString.call(separator) !== "[object RegExp]") {
					return string_split.call(this, separator, limit);
				}
				var output = [],
					flags = (separator.ignoreCase ? "i" : "") +
					(separator.multiline ? "m" : "") +
					(separator.extended ? "x" : "") +
					(separator.sticky ? "y" : ""),
					lastLastIndex = 0,
					separator2, match, lastIndex, lastLength;
				separator = new RegExp(separator.source, flags + "g");
				string += "";
				if (!compliantExecNpcg) {
					separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
				}
				limit = limit === void 0 ?
					-1 >>> 0 :
					ToUint32(limit);
				while (match = separator.exec(string)) {
					lastIndex = match.index + match[0].length;
					if (lastIndex > lastLastIndex) {
						output.push(string.slice(lastLastIndex, match.index));
						if (!compliantExecNpcg && match.length > 1) {
							match[0].replace(separator2, function () {
								for (var i = 1; i < arguments.length - 2; i++) {
									if (arguments[i] === void 0) {
										match[i] = void 0;
									}
								}
							});
						}
						if (match.length > 1 && match.index < string.length) {
							ArrayPrototype.push.apply(output, match.slice(1));
						}
						lastLength = match[0].length;
						lastLastIndex = lastIndex;
						if (output.length >= limit) {
							break;
						}
					}
					if (separator.lastIndex === match.index) {
						separator.lastIndex++;
					}
				}
				if (lastLastIndex === string.length) {
					if (lastLength || !separator.test("")) {
						output.push("");
					}
				} else {
					output.push(string.slice(lastLastIndex));
				}
				return output.length > limit ? output.slice(0, limit) : output;
			};
		}());
	} else if ("0".split(void 0, 0).length) {
		StringPrototype.split = function split(separator, limit) {
			if (separator === void 0 && limit === 0) {
				return [];
			}
			return string_split.call(this, separator, limit);
		};
	}
	var str_replace = StringPrototype.replace;
	var replaceReportsGroupsCorrectly = (function () {
		var groups = [];
		'x'.replace(/x(.)?/g, function (match, group) {
			groups.push(group);
		});
		return groups.length === 1 && typeof groups[0] === 'undefined';
	}());
	if (!replaceReportsGroupsCorrectly) {
		StringPrototype.replace = function replace(searchValue, replaceValue) {
			var isFn = isFunction(replaceValue);
			var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
			if (!isFn || !hasCapturingGroups) {
				return str_replace.call(this, searchValue, replaceValue);
			} else {
				var wrappedReplaceValue = function (match) {
					var length = arguments.length;
					var originalLastIndex = searchValue.lastIndex;
					searchValue.lastIndex = 0;
					var args = searchValue.exec(match);
					searchValue.lastIndex = originalLastIndex;
					args.push(arguments[length - 2], arguments[length - 1]);
					return replaceValue.apply(this, args);
				};
				return str_replace.call(this, searchValue, wrappedReplaceValue);
			}
		};
	}
	var string_substr = StringPrototype.substr;
	var hasNegativeSubstrBug = "".substr && "0b".substr(-1) !== "b";
	defineProperties(StringPrototype, {
		substr: function substr(start, length) {
			return string_substr.call(
				this,
				start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
				length
			);
		}
	}, hasNegativeSubstrBug);
	var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
		"\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
		"\u2029\uFEFF";
	var zeroWidth = '\u200b';
	var wsRegexChars = "[" + ws + "]";
	var trimBeginRegexp = new RegExp("^" + wsRegexChars + wsRegexChars + "*");
	var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + "*$");
	var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
	defineProperties(StringPrototype, {
		trim: function trim() {
			if (this === void 0 || this === null) {
				throw new TypeError("can't convert " + this + " to object");
			}
			return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
		}
	}, hasTrimWhitespaceBug);
	if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
		parseInt = (function (origParseInt) {
			var hexRegex = /^0[xX]/;
			return function parseIntES5(str, radix) {
				str = String(str).trim();
				if (!Number(radix)) {
					radix = hexRegex.test(str) ? 16 : 10;
				}
				return origParseInt(str, radix);
			};
		}(parseInt));
	}
}));
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.returnExports = factory();
	}
}(this, function () {
	var call = Function.prototype.call;
	var prototypeOfObject = Object.prototype;
	var owns = call.bind(prototypeOfObject.hasOwnProperty);
	var defineGetter;
	var defineSetter;
	var lookupGetter;
	var lookupSetter;
	var supportsAccessors = owns(prototypeOfObject, "__defineGetter__");
	if (supportsAccessors) {
		defineGetter = call.bind(prototypeOfObject.__defineGetter__);
		defineSetter = call.bind(prototypeOfObject.__defineSetter__);
		lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
		lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
	}
	if (!Object.getPrototypeOf) {
		Object.getPrototypeOf = function getPrototypeOf(object) {
			var proto = object.__proto__;
			if (proto || proto === null) {
				return proto;
			} else if (object.constructor) {
				return object.constructor.prototype;
			} else {
				return prototypeOfObject;
			}
		};
	}

	function doesGetOwnPropertyDescriptorWork(object) {
		try {
			object.sentinel = 0;
			return Object.getOwnPropertyDescriptor(
				object,
				"sentinel"
			).value === 0;
		} catch (exception) {}
	}
	if (Object.defineProperty) {
		var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork({});
		var getOwnPropertyDescriptorWorksOnDom = typeof document === "undefined" ||
			doesGetOwnPropertyDescriptorWork(document.createElement("div"));
		if (!getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject) {
			var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
		}
	}
	if (!Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback) {
		var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";
		Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
			if ((typeof object !== "object" && typeof object !== "function") || object === null) {
				throw new TypeError(ERR_NON_OBJECT + object);
			}
			if (getOwnPropertyDescriptorFallback) {
				try {
					return getOwnPropertyDescriptorFallback.call(Object, object, property);
				} catch (exception) {}
			}
			if (!owns(object, property)) {
				return;
			}
			var descriptor = {
				enumerable: true,
				configurable: true
			};
			if (supportsAccessors) {
				var prototype = object.__proto__;
				var notPrototypeOfObject = object !== prototypeOfObject;
				if (notPrototypeOfObject) {
					object.__proto__ = prototypeOfObject;
				}
				var getter = lookupGetter(object, property);
				var setter = lookupSetter(object, property);
				if (notPrototypeOfObject) {
					object.__proto__ = prototype;
				}
				if (getter || setter) {
					if (getter) {
						descriptor.get = getter;
					}
					if (setter) {
						descriptor.set = setter;
					}
					return descriptor;
				}
			}
			descriptor.value = object[property];
			descriptor.writable = true;
			return descriptor;
		};
	}
	if (!Object.getOwnPropertyNames) {
		Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
			return Object.keys(object);
		};
	}
	if (!Object.create) {
		var createEmpty;
		var supportsProto = !({
				__proto__: null
			}
			instanceof Object);
		if (supportsProto || typeof document === 'undefined') {
			createEmpty = function () {
				return {
					"__proto__": null
				};
			};
		} else {
			createEmpty = function () {
				var iframe = document.createElement('iframe');
				var parent = document.body || document.documentElement;
				iframe.style.display = 'none';
				parent.appendChild(iframe);
				iframe.src = 'javascript:';
				var empty = iframe.contentWindow.Object.prototype;
				parent.removeChild(iframe);
				iframe = null;
				delete empty.constructor;
				delete empty.hasOwnProperty;
				delete empty.propertyIsEnumerable;
				delete empty.isPrototypeOf;
				delete empty.toLocaleString;
				delete empty.toString;
				delete empty.valueOf;
				empty.__proto__ = null;

				function Empty() {}
				Empty.prototype = empty;
				createEmpty = function () {
					return new Empty();
				};
				return new Empty();
			};
		}
		Object.create = function create(prototype, properties) {
			var object;

			function Type() {}
			if (prototype === null) {
				object = createEmpty();
			} else {
				if (typeof prototype !== "object" && typeof prototype !== "function") {
					throw new TypeError("Object prototype may only be an Object or null");
				}
				Type.prototype = prototype;
				object = new Type();
				object.__proto__ = prototype;
			}
			if (properties !== void 0) {
				Object.defineProperties(object, properties);
			}
			return object;
		};
	}

	function doesDefinePropertyWork(object) {
		try {
			Object.defineProperty(object, "sentinel", {});
			return "sentinel" in object;
		} catch (exception) {}
	}
	if (Object.defineProperty) {
		var definePropertyWorksOnObject = doesDefinePropertyWork({});
		var definePropertyWorksOnDom = typeof document === "undefined" ||
			doesDefinePropertyWork(document.createElement("div"));
		if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
			var definePropertyFallback = Object.defineProperty,
				definePropertiesFallback = Object.defineProperties;
		}
	}
	if (!Object.defineProperty || definePropertyFallback) {
		var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
		var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
		var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
			"on this javascript engine";
		Object.defineProperty = function defineProperty(object, property, descriptor) {
			if ((typeof object !== "object" && typeof object !== "function") || object === null) {
				throw new TypeError(ERR_NON_OBJECT_TARGET + object);
			}
			if ((typeof descriptor !== "object" && typeof descriptor !== "function") || descriptor === null) {
				throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
			}
			if (definePropertyFallback) {
				try {
					return definePropertyFallback.call(Object, object, property, descriptor);
				} catch (exception) {}
			}
			if (owns(descriptor, "value")) {
				if (supportsAccessors && (lookupGetter(object, property) ||
					lookupSetter(object, property))) {
					var prototype = object.__proto__;
					object.__proto__ = prototypeOfObject;
					delete object[property];
					object[property] = descriptor.value;
					object.__proto__ = prototype;
				} else {
					object[property] = descriptor.value;
				}
			} else {
				if (!supportsAccessors) {
					throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
				}
				if (owns(descriptor, "get")) {
					defineGetter(object, property, descriptor.get);
				}
				if (owns(descriptor, "set")) {
					defineSetter(object, property, descriptor.set);
				}
			}
			return object;
		};
	}
	if (!Object.defineProperties || definePropertiesFallback) {
		Object.defineProperties = function defineProperties(object, properties) {
			if (definePropertiesFallback) {
				try {
					return definePropertiesFallback.call(Object, object, properties);
				} catch (exception) {}
			}
			for (var property in properties) {
				if (owns(properties, property) && property !== "__proto__") {
					Object.defineProperty(object, property, properties[property]);
				}
			}
			return object;
		};
	}
	if (!Object.seal) {
		Object.seal = function seal(object) {
			return object;
		};
	}
	if (!Object.freeze) {
		Object.freeze = function freeze(object) {
			return object;
		};
	}
	try {
		Object.freeze(function () {});
	} catch (exception) {
		Object.freeze = (function freeze(freezeObject) {
			return function freeze(object) {
				if (typeof object === "function") {
					return object;
				} else {
					return freezeObject(object);
				}
			};
		})(Object.freeze);
	}
	if (!Object.preventExtensions) {
		Object.preventExtensions = function preventExtensions(object) {
			return object;
		};
	}
	if (!Object.isSealed) {
		Object.isSealed = function isSealed(object) {
			return false;
		};
	}
	if (!Object.isFrozen) {
		Object.isFrozen = function isFrozen(object) {
			return false;
		};
	}
	if (!Object.isExtensible) {
		Object.isExtensible = function isExtensible(object) {
			if (Object(object) !== object) {
				throw new TypeError();
			}
			var name = '';
			while (owns(object, name)) {
				name += '?';
			}
			object[name] = true;
			var returnValue = owns(object, name);
			delete object[name];
			return returnValue;
		};
	}
}));
