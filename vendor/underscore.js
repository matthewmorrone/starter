//     Underscore.js

(function () {
	var root = this;
	var previousUnderscore = root._;
	var breaker = {};
	var ArrayProto = Array.prototype,
		ObjProto = Object.prototype,
		FuncProto = Function.prototype;
	var push = ArrayProto.push,
		slice = ArrayProto.slice,
		concat = ArrayProto.concat,
		toString = ObjProto.toString,
		hasOwnProperty = ObjProto.hasOwnProperty;
	var nativeForEach = ArrayProto.forEach,
		nativeMap = ArrayProto.map,
		nativeReduce = ArrayProto.reduce,
		nativeReduceRight = ArrayProto.reduceRight,
		nativeFilter = ArrayProto.filter,
		nativeEvery = ArrayProto.every,
		nativeSome = ArrayProto.some,
		nativeIndexOf = ArrayProto.indexOf,
		nativeLastIndexOf = ArrayProto.lastIndexOf,
		nativeIsArray = Array.isArray,
		nativeKeys = Object.keys,
		nativeBind = FuncProto.bind;
	var _ = function (obj) {
		if (obj instanceof _) return obj;
		if (!(this instanceof _)) return new _(obj);
		this._wrapped = obj;
	};
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports) {
			exports = module.exports = _;
		}
		exports._ = _;
	} else {
		root._ = _;
	}
	_.VERSION = '1.6.0';
	var each = _.each = _.forEach = function (obj, iterator, context) {
		if (obj == null) return obj;
		if (nativeForEach && obj.forEach === nativeForEach) {
			obj.forEach(iterator, context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, length = obj.length; i < length; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker) return;
			}
		} else {
			var keys = _.keys(obj);
			for (var i = 0, length = keys.length; i < length; i++) {
				if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
			}
		}
		return obj;
	};
	_.map = _.collect = function (obj, iterator, context) {
		var results = [];
		if (obj == null) return results;
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
		each(obj, function (value, index, list) {
			results.push(iterator.call(context, value, index, list));
		});
		return results;
	};

	var reduceError = 'Reduce of empty array with no initial value';
	_.reduce = _.foldl = _.inject = function (obj, iterator, memo, context) {
		var initial = arguments.length > 2;
		if (obj == null) obj = [];
		if (nativeReduce && obj.reduce === nativeReduce) {
			if (context) iterator = _.bind(iterator, context);
			return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
		}
		each(obj, function (value, index, list) {
			if (!initial) {
				memo = value;
				initial = true;
			} else {
				memo = iterator.call(context, memo, value, index, list);
			}
		});
		if (!initial) throw new TypeError(reduceError);
		return memo;
	};
	_.reduceRight = _.foldr = function (obj, iterator, memo, context) {
		var initial = arguments.length > 2;
		if (obj == null) obj = [];
		if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
			if (context) iterator = _.bind(iterator, context);
			return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
		}
		var length = obj.length;
		if (length !== +length) {
			var keys = _.keys(obj);
			length = keys.length;
		}
		each(obj, function (value, index, list) {
			index = keys ? keys[--length] : --length;
			if (!initial) {
				memo = obj[index];
				initial = true;
			} else {
				memo = iterator.call(context, memo, obj[index], index, list);
			}
		});
		if (!initial) throw new TypeError(reduceError);
		return memo;
	};
	_.find = _.detect = function (obj, predicate, context) {
		var result;
		any(obj, function (value, index, list) {
			if (predicate.call(context, value, index, list)) {
				result = value;
				return true;
			}
		});
		return result;
	};
	_.filter = _.select = function (obj, predicate, context) {
		var results = [];
		if (obj == null) return results;
		if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
		each(obj, function (value, index, list) {
			if (predicate.call(context, value, index, list)) results.push(value);
		});
		return results;
	};
	_.reject = function (obj, predicate, context) {
		return _.filter(obj, function (value, index, list) {
			return !predicate.call(context, value, index, list);
		}, context);
	};
	_.every = _.all = function (obj, predicate, context) {
		predicate || (predicate = _.identity);
		var result = true;
		if (obj == null) return result;
		if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
		each(obj, function (value, index, list) {
			if (!(result = result && predicate.call(context, value, index, list))) return breaker;
		});
		return !!result;
	};
	var any = _.some = _.any = function (obj, predicate, context) {
		predicate || (predicate = _.identity);
		var result = false;
		if (obj == null) return result;
		if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
		each(obj, function (value, index, list) {
			if (result || (result = predicate.call(context, value, index, list))) return breaker;
		});
		return !!result;
	};
	_.contains = _.include = function (obj, target) {
		if (obj == null) return false;
		if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
		return any(obj, function (value) {
			return value === target;
		});
	};
	_.invoke = function (obj, method) {
		var args = slice.call(arguments, 2);
		var isFunc = _.isFunction(method);
		return _.map(obj, function (value) {
			return (isFunc ? method : value[method]).apply(value, args);
		});
	};
	_.pluck = function (obj, key) {
		return _.map(obj, _.property(key));
	};
	_.where = function (obj, attrs) {
		return _.filter(obj, _.matches(attrs));
	};
	_.findWhere = function (obj, attrs) {
		return _.find(obj, _.matches(attrs));
	};
	_.max = function (obj, iterator, context) {
		if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
			return Math.max.apply(Math, obj);
		}
		var result = -Infinity,
			lastComputed = -Infinity;
		each(obj, function (value, index, list) {
			var computed = iterator ? iterator.call(context, value, index, list) : value;
			if (computed > lastComputed) {
				result = value;
				lastComputed = computed;
			}
		});
		return result;
	};
	_.min = function (obj, iterator, context) {
		if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
			return Math.min.apply(Math, obj);
		}
		var result = Infinity,
			lastComputed = Infinity;
		each(obj, function (value, index, list) {
			var computed = iterator ? iterator.call(context, value, index, list) : value;
			if (computed < lastComputed) {
				result = value;
				lastComputed = computed;
			}
		});
		return result;
	};
	_.shuffle = function (obj) {
		var rand;
		var index = 0;
		var shuffled = [];
		each(obj, function (value) {
			rand = _.random(index++);
			shuffled[index - 1] = shuffled[rand];
			shuffled[rand] = value;
		});
		return shuffled;
	};
	_.sample = function (obj, n, guard) {
		if (n == null || guard) {
			if (obj.length !== +obj.length) obj = _.values(obj);
			return obj[_.random(obj.length - 1)];
		}
		return _.shuffle(obj).slice(0, Math.max(0, n));
	};
	var lookupIterator = function (value) {
		if (value == null) return _.identity;
		if (_.isFunction(value)) return value;
		return _.property(value);
	};
	_.sortBy = function (obj, iterator, context) {
		iterator = lookupIterator(iterator);
		return _.pluck(_.map(obj, function (value, index, list) {
			return {
				value: value,
				index: index,
				criteria: iterator.call(context, value, index, list)
			};
		}).sort(function (left, right) {
			var a = left.criteria;
			var b = right.criteria;
			if (a !== b) {
				if (a > b || a === void 0) return 1;
				if (a < b || b === void 0) return -1;
			}
			return left.index - right.index;
		}), 'value');
	};
	var group = function (behavior) {
		return function (obj, iterator, context) {
			var result = {};
			iterator = lookupIterator(iterator);
			each(obj, function (value, index) {
				var key = iterator.call(context, value, index, obj);
				behavior(result, key, value);
			});
			return result;
		};
	};
	_.groupBy = group(function (result, key, value) {
		_.has(result, key) ? result[key].push(value) : result[key] = [value];
	});
	_.indexBy = group(function (result, key, value) {
		result[key] = value;
	});
	_.countBy = group(function (result, key) {
		_.has(result, key) ? result[key]++ : result[key] = 1;
	});
	_.sortedIndex = function (array, obj, iterator, context) {
		iterator = lookupIterator(iterator);
		var value = iterator.call(context, obj);
		var low = 0,
			high = array.length;
		while (low < high) {
			var mid = (low + high) >>> 1;
			iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
		}
		return low;
	};
	_.toArray = function (obj) {
		if (!obj) return [];
		if (_.isArray(obj)) return slice.call(obj);
		if (obj.length === +obj.length) return _.map(obj, _.identity);
		return _.values(obj);
	};
	_.size = function (obj) {
		if (obj == null) return 0;
		return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
	};
	_.first = _.head = _.take = function (array, n, guard) {
		if (array == null) return void 0;
		if ((n == null) || guard) return array[0];
		if (n < 0) return [];
		return slice.call(array, 0, n);
	};
	_.initial = function (array, n, guard) {
		return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
	};
	_.last = function (array, n, guard) {
		if (array == null) return void 0;
		if ((n == null) || guard) return array[array.length - 1];
		return slice.call(array, Math.max(array.length - n, 0));
	};
	_.rest = _.tail = _.drop = function (array, n, guard) {
		return slice.call(array, (n == null) || guard ? 1 : n);
	};
	_.compact = function (array) {
		return _.filter(array, _.identity);
	};
	var flatten = function (input, shallow, output) {
		if (shallow && _.every(input, _.isArray)) {
			return concat.apply(output, input);
		}
		each(input, function (value) {
			if (_.isArray(value) || _.isArguments(value)) {
				shallow ? push.apply(output, value) : flatten(value, shallow, output);
			} else {
				output.push(value);
			}
		});
		return output;
	};
	_.flatten = function (array, shallow) {
		return flatten(array, shallow, []);
	};
	_.without = function (array) {
		return _.difference(array, slice.call(arguments, 1));
	};
	_.partition = function (array, predicate) {
		var pass = [],
			fail = [];
		each(array, function (elem) {
			(predicate(elem) ? pass : fail).push(elem);
		});
		return [pass, fail];
	};
	_.uniq = _.unique = function (array, isSorted, iterator, context) {
		if (_.isFunction(isSorted)) {
			context = iterator;
			iterator = isSorted;
			isSorted = false;
		}
		var initial = iterator ? _.map(array, iterator, context) : array;
		var results = [];
		var seen = [];
		each(initial, function (value, index) {
			if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
				seen.push(value);
				results.push(array[index]);
			}
		});
		return results;
	};
	_.union = function () {
		return _.uniq(_.flatten(arguments, true));
	};
	_.intersection = function (array) {
		var rest = slice.call(arguments, 1);
		return _.filter(_.uniq(array), function (item) {
			return _.every(rest, function (other) {
				return _.contains(other, item);
			});
		});
	};
	_.difference = function (array) {
		var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
		return _.filter(array, function (value) {
			return !_.contains(rest, value);
		});
	};
	_.zip = function () {
		var length = _.max(_.pluck(arguments, 'length').concat(0));
		var results = new Array(length);
		for (var i = 0; i < length; i++) {
			results[i] = _.pluck(arguments, '' + i);
		}
		return results;
	};
	_.object = function (list, values) {
		if (list == null) return {};
		var result = {};
		for (var i = 0, length = list.length; i < length; i++) {
			if (values) {
				result[list[i]] = values[i];
			} else {
				result[list[i][0]] = list[i][1];
			}
		}
		return result;
	};
	_.indexOf = function (array, item, isSorted) {
		if (array == null) return -1;
		var i = 0,
			length = array.length;
		if (isSorted) {
			if (typeof isSorted == 'number') {
				i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
			} else {
				i = _.sortedIndex(array, item);
				return array[i] === item ? i : -1;
			}
		}
		if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
		for (; i < length; i++)
			if (array[i] === item) return i;
		return -1;
	};
	_.lastIndexOf = function (array, item, from) {
		if (array == null) return -1;
		var hasIndex = from != null;
		if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
			return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
		}
		var i = (hasIndex ? from : array.length);
		while (i--)
			if (array[i] === item) return i;
		return -1;
	};
	_.range = function (start, stop, step) {
		if (arguments.length <= 1) {
			stop = start || 0;
			start = 0;
		}
		step = arguments[2] || 1;

		var length = Math.max(Math.ceil((stop - start) / step), 0);
		var idx = 0;
		var range = new Array(length);

		while (idx < length) {
			range[idx++] = start;
			start += step;
		}

		return range;
	};
	var ctor = function () {};
	_.bind = function (func, context) {
		var args, bound;
		if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
		if (!_.isFunction(func)) throw new TypeError;
		args = slice.call(arguments, 2);
		return bound = function () {
			if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
			ctor.prototype = func.prototype;
			var self = new ctor;
			ctor.prototype = null;
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result) return result;
			return self;
		};
	};
	_.partial = function (func) {
		var boundArgs = slice.call(arguments, 1);
		return function () {
			var position = 0;
			var args = boundArgs.slice();
			for (var i = 0, length = args.length; i < length; i++) {
				if (args[i] === _) args[i] = arguments[position++];
			}
			while (position < arguments.length) args.push(arguments[position++]);
			return func.apply(this, args);
		};
	};
	_.bindAll = function (obj) {
		var funcs = slice.call(arguments, 1);
		if (funcs.length === 0) throw new Error('bindAll must be passed function names');
		each(funcs, function (f) {
			obj[f] = _.bind(obj[f], obj);
		});
		return obj;
	};
	_.memoize = function (func, hasher) {
		var memo = {};
		hasher || (hasher = _.identity);
		return function () {
			var key = hasher.apply(this, arguments);
			return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
		};
	};
	_.delay = function (func, wait) {
		var args = slice.call(arguments, 2);
		return setTimeout(function () {
			return func.apply(null, args);
		}, wait);
	};
	_.defer = function (func) {
		return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
	};
	_.throttle = function (func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		options || (options = {});
		var later = function () {
			previous = options.leading === false ? 0 : _.now();
			timeout = null;
			result = func.apply(context, args);
			context = args = null;
		};
		return function () {
			var now = _.now();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
				context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};
	};
	_.debounce = function (func, wait, immediate) {
		var timeout, args, context, timestamp, result;

		var later = function () {
			var last = _.now() - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
					context = args = null;
				}
			}
		};

		return function () {
			context = this;
			args = arguments;
			timestamp = _.now();
			var callNow = immediate && !timeout;
			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
			if (callNow) {
				result = func.apply(context, args);
				context = args = null;
			}

			return result;
		};
	};
	_.once = function (func) {
		var ran = false,
			memo;
		return function () {
			if (ran) return memo;
			ran = true;
			memo = func.apply(this, arguments);
			func = null;
			return memo;
		};
	};
	_.wrap = function (func, wrapper) {
		return _.partial(wrapper, func);
	};
	_.compose = function () {
		var funcs = arguments;
		return function () {
			var args = arguments;
			for (var i = funcs.length - 1; i >= 0; i--) {
				args = [funcs[i].apply(this, args)];
			}
			return args[0];
		};
	};
	_.after = function (times, func) {
		return function () {
			if (--times < 1) {
				return func.apply(this, arguments);
			}
		};
	};
	_.keys = function (obj) {
		if (!_.isObject(obj)) return [];
		if (nativeKeys) return nativeKeys(obj);
		var keys = [];
		for (var key in obj)
			if (_.has(obj, key)) keys.push(key);
		return keys;
	};
	_.values = function (obj) {
		var keys = _.keys(obj);
		var length = keys.length;
		var values = new Array(length);
		for (var i = 0; i < length; i++) {
			values[i] = obj[keys[i]];
		}
		return values;
	};
	_.pairs = function (obj) {
		var keys = _.keys(obj);
		var length = keys.length;
		var pairs = new Array(length);
		for (var i = 0; i < length; i++) {
			pairs[i] = [keys[i], obj[keys[i]]];
		}
		return pairs;
	};
	_.invert = function (obj) {
		var result = {};
		var keys = _.keys(obj);
		for (var i = 0, length = keys.length; i < length; i++) {
			result[obj[keys[i]]] = keys[i];
		}
		return result;
	};
	_.functions = _.methods = function (obj) {
		var names = [];
		for (var key in obj) {
			if (_.isFunction(obj[key])) names.push(key);
		}
		return names.sort();
	};
	_.extend = function (obj) {
		each(slice.call(arguments, 1), function (source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};
	_.pick = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		each(keys, function (key) {
			if (key in obj) copy[key] = obj[key];
		});
		return copy;
	};
	_.omit = function (obj) {
		var copy = {};
		var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
		for (var key in obj) {
			if (!_.contains(keys, key)) copy[key] = obj[key];
		}
		return copy;
	};
	_.defaults = function (obj) {
		each(slice.call(arguments, 1), function (source) {
			if (source) {
				for (var prop in source) {
					if (obj[prop] === void 0) obj[prop] = source[prop];
				}
			}
		});
		return obj;
	};
	_.clone = function (obj) {
		if (!_.isObject(obj)) return obj;
		return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	};
	_.tap = function (obj, interceptor) {
		interceptor(obj);
		return obj;
	};
	var eq = function (a, b, aStack, bStack) {
		if (a === b) return a !== 0 || 1 / a == 1 / b;
		if (a == null || b == null) return a === b;
		if (a instanceof _) a = a._wrapped;
		if (b instanceof _) b = b._wrapped;
		var className = toString.call(a);
		if (className != toString.call(b)) return false;
		switch (className) {
		case '[object String]':
			return a == String(b);
		case '[object Number]':
			return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
		case '[object Date]':
		case '[object Boolean]':
			return +a == +b;
		case '[object RegExp]':
			return a.source == b.source &&
				a.global == b.global &&
				a.multiline == b.multiline &&
				a.ignoreCase == b.ignoreCase;
		}
		if (typeof a != 'object' || typeof b != 'object') return false;
		var length = aStack.length;
		while (length--) {
			if (aStack[length] == a) return bStack[length] == b;
		}
		var aCtor = a.constructor,
			bCtor = b.constructor;
		if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
			_.isFunction(bCtor) && (bCtor instanceof bCtor)) && ('constructor' in a && 'constructor' in b)) {
			return false;
		}
		aStack.push(a);
		bStack.push(b);
		var size = 0,
			result = true;
		if (className == '[object Array]') {
			size = a.length;
			result = size == b.length;
			if (result) {
				while (size--) {
					if (!(result = eq(a[size], b[size], aStack, bStack))) break;
				}
			}
		} else {
			for (var key in a) {
				if (_.has(a, key)) {
					size++;
					if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
				}
			}
			if (result) {
				for (key in b) {
					if (_.has(b, key) && !(size--)) break;
				}
				result = !size;
			}
		}
		aStack.pop();
		bStack.pop();
		return result;
	};
	_.isEqual = function (a, b) {
		return eq(a, b, [], []);
	};
	_.isEmpty = function (obj) {
		if (obj == null) return true;
		if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
		for (var key in obj)
			if (_.has(obj, key)) return false;
		return true;
	};
	_.isElement = function (obj) {
		return !!(obj && obj.nodeType === 1);
	};
	_.isArray = nativeIsArray || function (obj) {
		return toString.call(obj) == '[object Array]';
	};
	_.isObject = function (obj) {
		return obj === Object(obj);
	};
	each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function (name) {
		_['is' + name] = function (obj) {
			return toString.call(obj) == '[object ' + name + ']';
		};
	});
	if (!_.isArguments(arguments)) {
		_.isArguments = function (obj) {
			return !!(obj && _.has(obj, 'callee'));
		};
	}
	if (typeof (/./) !== 'function') {
		_.isFunction = function (obj) {
			return typeof obj === 'function';
		};
	}
	_.isFinite = function (obj) {
		return isFinite(obj) && !isNaN(parseFloat(obj));
	};
	_.isNaN = function (obj) {
		return _.isNumber(obj) && obj != +obj;
	};
	_.isBoolean = function (obj) {
		return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
	};
	_.isNull = function (obj) {
		return obj === null;
	};
	_.isUndefined = function (obj) {
		return obj === void 0;
	};
	_.has = function (obj, key) {
		return hasOwnProperty.call(obj, key);
	};
	_.noConflict = function () {
		root._ = previousUnderscore;
		return this;
	};
	_.identity = function (value) {
		return value;
	};

	_.constant = function (value) {
		return function () {
			return value;
		};
	};

	_.property = function (key) {
		return function (obj) {
			return obj[key];
		};
	};
	_.matches = function (attrs) {
		return function (obj) {
			if (obj === attrs) return true;
			for (var key in attrs) {
				if (attrs[key] !== obj[key])
					return false;
			}
			return true;
		}
	};
	_.times = function (n, iterator, context) {
		var accum = Array(Math.max(0, n));
		for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
		return accum;
	};
	_.random = function (min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.floor(Math.random() * (max - min + 1));
	};
	_.now = Date.now || function () {
		return new Date().getTime();
	};
	var entityMap = {
		escape: {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;'
		}
	};
	entityMap.unescape = _.invert(entityMap.escape);
	var entityRegexes = {
		escape: new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
		unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
	};
	_.each(['escape', 'unescape'], function (method) {
		_[method] = function (string) {
			if (string == null) return '';
			return ('' + string).replace(entityRegexes[method], function (match) {
				return entityMap[method][match];
			});
		};
	});
	_.result = function (object, property) {
		if (object == null) return void 0;
		var value = object[property];
		return _.isFunction(value) ? value.call(object) : value;
	};
	_.mixin = function (obj) {
		each(_.functions(obj), function (name) {
			var func = _[name] = obj[name];
			_.prototype[name] = function () {
				var args = [this._wrapped];
				push.apply(args, arguments);
				return result.call(this, func.apply(_, args));
			};
		});
	};
	var idCounter = 0;
	_.uniqueId = function (prefix) {
		var id = ++idCounter + '';
		return prefix ? prefix + id : id;
	};
	_.templateSettings = {
		evaluate: /<%([\s\S]+?)%>/g,
		interpolate: /<%=([\s\S]+?)%>/g,
		escape: /<%-([\s\S]+?)%>/g
	};
	var noMatch = /(.)^/;
	var escapes = {
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\t': 't',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

	var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
	_.template = function (text, data, settings) {
		var render;
		settings = _.defaults({}, settings, _.templateSettings);
		var matcher = new RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|_', 'g');
		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
			source += text.slice(index, offset)
				.replace(escaper, function (match) {
					return '\\' + escapes[match];
				});

			if (escape) {
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			}
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			}
			if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			index = offset + match.length;
			return match;
		});
		source += "';\n";
		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" +
			source + "return __p;\n";

		try {
			render = new Function(settings.variable || 'obj', '_', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		if (data) return render(data, _);
		var template = function (data) {
			return render.call(this, data, _);
		};
		template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

		return template;
	};
	_.chain = function (obj) {
		return _(obj).chain();
	};
	var result = function (obj) {
		return this._chain ? _(obj).chain() : obj;
	};
	_.mixin(_);
	each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
		var method = ArrayProto[name];
		_.prototype[name] = function () {
			var obj = this._wrapped;
			method.apply(obj, arguments);
			if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
			return result.call(this, obj);
		};
	});
	each(['concat', 'join', 'slice'], function (name) {
		var method = ArrayProto[name];
		_.prototype[name] = function () {
			return result.call(this, method.apply(this._wrapped, arguments));
		};
	});

	_.extend(_.prototype, {
		chain: function () {
			this._chain = true;
			return this;
		},
		value: function () {
			return this._wrapped;
		}

	});
	if (typeof define === 'function' && define.amd) {
		define('underscore', [], function () {
			return _;
		});
	}
}).call(this);

(function (root) {
	var _ = root._ || require('underscore');
	var slice = Array.prototype.slice,
		concat = Array.prototype.concat;

	var existy = function (x) {
		return x != null;
	};

	_.mixin({
		cat: function () {
			return _.reduce(arguments, function (acc, elem) {
				if (_.isArguments(elem)) {
					return concat.call(acc, slice.call(elem));
				} else {
					return concat.call(acc, elem);
				}
			}, []);
		},
		cons: function (head, tail) {
			return _.cat([head], tail);
		},
		chunk: function (array, n, pad) {
			var p = function (array) {
				if (array == null) return [];

				var part = _.take(array, n);

				if (n === _.size(part)) {
					return _.cons(part, p(_.drop(array, n)));
				} else {
					return pad ? [_.take(_.cat(part, pad), n)] : [];
				}
			};

			return p(array);
		},
		chunkAll: function (array, n, step) {
			step = (step != null) ? step : n;

			var p = function (array, n, step) {
				if (_.isEmpty(array)) return [];

				return _.cons(_.take(array, n),
					p(_.drop(array, step), n, step));
			};

			return p(array, n, step);
		},
		mapcat: function (array, fun) {
			return _.cat.apply(null, _.map(array, fun));
		},
		interpose: function (array, inter) {
			if (!_.isArray(array)) throw new TypeError;
			var sz = _.size(array);
			if (sz === 0) return array;
			if (sz === 1) return array;

			return slice.call(_.mapcat(array, function (elem) {
				return _.cons(elem, [inter]);
			}), 0, -1);
		},
		weave: function () {
			if (!_.some(arguments)) return [];
			if (arguments.length == 1) return arguments[0];

			return _.filter(_.flatten(_.zip.apply(null, arguments), true), function (elem) {
				return elem != null;
			});
		},
		interleave: _.weave,
		repeat: function (t, elem) {
			return _.times(t, function () {
				return elem;
			});
		},
		cycle: function (t, elems) {
			return _.flatten(_.times(t, function () {
				return elems;
			}), true);
		},
		splitAt: function (array, index) {
			return [_.take(array, index), _.drop(array, index)];
		},
		iterateUntil: function (doit, checkit, seed) {
			var ret = [];
			var result = doit(seed);

			while (checkit(result)) {
				ret.push(result);
				result = doit(result);
			}

			return ret;
		},
		takeSkipping: function (array, n) {
			var ret = [];
			var sz = _.size(array);

			if (n <= 0) return [];
			if (n === 1) return array;

			for (var index = 0; index < sz; index += n) {
				ret.push(array[index]);
			}

			return ret;
		},
		reductions: function (array, fun, init) {
			var ret = [];
			var acc = init;

			_.each(array, function (v, k) {
				acc = fun(acc, array[k]);
				ret.push(acc);
			});

			return ret;
		},
		keepIndexed: function (array, pred) {
			return _.filter(_.map(_.range(_.size(array)), function (i) {
					return pred(i, array[i]);
				}),
				existy);
		},
		reverseOrder: function (obj) {
			if (typeof obj == 'string')
				throw new TypeError('Strings cannot be reversed by _.reverseOrder');
			return slice.call(obj).reverse();
		}
	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var slice = Array.prototype.slice,
		concat = Array.prototype.concat;

	var existy = function (x) {
		return x != null;
	};
	var truthy = function (x) {
		return (x !== false) && existy(x);
	};
	var isSeq = function (x) {
		return (_.isArray(x)) || (_.isArguments(x));
	};

	_.mixin({
		second: function (array, n, guard) {
			if (array == null) return void 0;
			return (n != null) && !guard ? slice.call(array, 1, n) : array[1];
		},
		third: function (array, n, guard) {
			if (array == null) return void 0;
			return (n != null) && !guard ? slice.call(array, 2, n) : array[2];
		},
		nth: function (array, index, guard) {
			if ((index != null) && !guard) return array[index];
		},
		takeWhile: function (array, pred) {
			if (!isSeq(array)) throw new TypeError;

			var sz = _.size(array);

			for (var index = 0; index < sz; index++) {
				if (!truthy(pred(array[index]))) {
					break;
				}
			}

			return _.take(array, index);
		},
		dropWhile: function (array, pred) {
			if (!isSeq(array)) throw new TypeError;

			var sz = _.size(array);

			for (var index = 0; index < sz; index++) {
				if (!truthy(pred(array[index])))
					break;
			}

			return _.drop(array, index);
		},
		splitWith: function (array, pred) {
			return [_.takeWhile(array, pred), _.dropWhile(array, pred)];
		},
		partitionBy: function (array, fun) {
			if (_.isEmpty(array) || !existy(array)) return [];

			var fst = _.first(array);
			var fstVal = fun(fst);
			var run = concat.call([fst], _.takeWhile(_.rest(array), function (e) {
				return _.isEqual(fstVal, fun(e));
			}));

			return concat.call([run], _.partitionBy(_.drop(array, _.size(run)), fun));
		},
		best: function (array, fun) {
			return _.reduce(array, function (x, y) {
				return fun(x, y) ? x : y;
			});
		},
		keep: function (array, fun) {
			if (!isSeq(array)) throw new TypeError("expected an array as the first argument");

			return _.filter(_.map(array, function (e) {
				return fun(e);
			}), existy);
		}
	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var stopRecursion = {};
	var stopWalk = {};

	var notTreeError = 'Not a tree: same object found in two different branches';

	function defaultTraversal(obj) {
		return _.isElement(obj) ? obj.children : obj;
	}

	function walkImpl(root, traversalStrategy, beforeFunc, afterFunc, context, collectResults) {
		var visited = [];
		return (function _walk(value, key, parent) {
			if (_.isObject(value)) {
				if (visited.indexOf(value) >= 0) throw new TypeError(notTreeError);
				visited.push(value);
			}

			if (beforeFunc) {
				var result = beforeFunc.call(context, value, key, parent);
				if (result === stopWalk) return stopWalk;
				if (result === stopRecursion) return;
			}

			var subResults;
			var target = traversalStrategy(value);
			if (_.isObject(target) && !_.isEmpty(target)) {
				if (collectResults) subResults = _.isArray(value) ? [] : {};

				var stop = _.any(target, function (obj, key) {
					var result = _walk(obj, key, value);
					if (result === stopWalk) return true;
					if (subResults) subResults[key] = result;
				});
				if (stop) return stopWalk;
			}
			if (afterFunc) return afterFunc.call(context, value, key, parent, subResults);
		})(root);
	}

	function pluck(obj, propertyName, recursive) {
		var results = [];
		this.preorder(obj, function (value, key) {
			if (!recursive && key == propertyName)
				return stopRecursion;
			if (_.has(value, propertyName))
				results[results.length] = value[propertyName];
		});
		return results;
	}

	var exports = {
		find: function (obj, visitor, context) {
			var result;
			this.preorder(obj, function (value, key, parent) {
				if (visitor.call(context, value, key, parent)) {
					result = value;
					return stopWalk;
				}
			}, context);
			return result;
		},
		filter: function (obj, strategy, visitor, context) {
			var results = [];
			if (obj == null) return results;
			strategy(obj, function (value, key, parent) {
				if (visitor.call(context, value, key, parent)) results.push(value);
			}, null, this._traversalStrategy);
			return results;
		},
		reject: function (obj, strategy, visitor, context) {
			return this.filter(obj, strategy, function (value, key, parent) {
				return !visitor.call(context, value, key, parent);
			});
		},
		map: function (obj, strategy, visitor, context) {
			var results = [];
			strategy(obj, function (value, key, parent) {
				results[results.length] = visitor.call(context, value, key, parent);
			}, null, this._traversalStrategy);
			return results;
		},
		pluck: function (obj, propertyName) {
			return pluck.call(this, obj, propertyName, false);
		},
		pluckRec: function (obj, propertyName) {
			return pluck.call(this, obj, propertyName, true);
		},
		postorder: function (obj, visitor, context, traversalStrategy) {
			traversalStrategy = traversalStrategy || this._traversalStrategy;
			walkImpl(obj, traversalStrategy, null, visitor, context);
		},
		preorder: function (obj, visitor, context, traversalStrategy) {
			traversalStrategy = traversalStrategy || this._traversalStrategy;
			walkImpl(obj, traversalStrategy, visitor, null, context);
		},
		reduce: function (obj, visitor, leafMemo, context) {
			var reducer = function (value, key, parent, subResults) {
				return visitor(subResults || leafMemo, value, key, parent);
			};
			return walkImpl(obj, this._traversalStrategy, null, reducer, context, true);
		}
	};
	exports.collect = exports.map;
	exports.detect = exports.find;
	exports.select = exports.filter;
	_.walk = function (traversalStrategy) {
		var walker = _.clone(exports);
		_.bindAll.apply(null, [walker].concat(_.keys(walker)));

		walker._traversalStrategy = traversalStrategy || defaultTraversal;
		return walker;
	};
	_.extend(_.walk, _.walk());
})(this);

(function (root) {
	var _ = root._ || require('underscore');

	function enforcesUnary(fn) {
		return function mustBeUnary() {
			if (arguments.length === 1) {
				return fn.apply(this, arguments);
			} else throw new RangeError('Only a single argument may be accepted.');

		};
	}
	var curry = (function () {
		function collectArgs(func, that, argCount, args, newArg, reverse) {
			if (reverse === true) {
				args.unshift(newArg);
			} else {
				args.push(newArg);
			}
			if (args.length == argCount) {
				return func.apply(that, args);
			} else {
				return enforcesUnary(function () {
					return collectArgs(func, that, argCount, args.slice(0), arguments[0], reverse);
				});
			}
		}
		return function curry(func, reverse) {
			var that = this;
			return enforcesUnary(function () {
				return collectArgs(func, that, func.length, [], arguments[0], reverse);
			});
		};
	}());
	var enforce = (function () {
		var CACHE = [];
		return function enforce(func) {
			if (typeof func !== 'function') {
				throw new Error('Argument 1 must be a function.');
			}
			var funcLength = func.length;
			if (CACHE[funcLength] === undefined) {
				CACHE[funcLength] = function (enforceFunc) {
					return function () {
						if (arguments.length !== funcLength) {
							throw new RangeError(funcLength + ' arguments must be applied.');
						}
						return enforceFunc.apply(this, arguments);
					};
				};
			}
			return CACHE[funcLength](func);
		};
	}());

	_.mixin({
		fix: function (fun) {
			var fixArgs = _.rest(arguments);

			var f = function () {
				var args = fixArgs.slice();
				var arg = 0;

				for (var i = 0; i < (args.length || arg < arguments.length); i++) {
					if (args[i] === _) {
						args[i] = arguments[arg++];
					}
				}

				return fun.apply(null, args);
			};

			f._original = fun;

			return f;
		},
		unary: function (fun) {
			return function unary(a) {
				return fun.call(this, a);
			};
		},
		binary: function (fun) {
			return function binary(a, b) {
				return fun.call(this, a, b);
			};
		},
		ternary: function (fun) {
			return function ternary(a, b, c) {
				return fun.call(this, a, b, c);
			};
		},
		quaternary: function (fun) {
			return function quaternary(a, b, c, d) {
				return fun.call(this, a, b, c, d);
			};
		},
		curry: curry,
		rCurry: function (func) {
			return curry.call(this, func, true);
		},
		curry2: function (fun) {
			return enforcesUnary(function curried(first) {
				return enforcesUnary(function (last) {
					return fun.call(this, first, last);
				});
			});
		},
		curry3: function (fun) {
			return enforcesUnary(function (first) {
				return enforcesUnary(function (second) {
					return enforcesUnary(function (last) {
						return fun.call(this, first, second, last);
					});
				});
			});
		},
		rcurry2: function (fun) {
			return enforcesUnary(function (last) {
				return enforcesUnary(function (first) {
					return fun.call(this, first, last);
				});
			});
		},
		rcurry3: function (fun) {
			return enforcesUnary(function (last) {
				return enforcesUnary(function (second) {
					return enforcesUnary(function (first) {
						return fun.call(this, first, second, last);
					});
				});
			});
		},
		enforce: enforce
	});

	_.arity = (function () {

		var FUNCTIONS = {};
		return function arity(numberOfArgs, fun) {
			if (FUNCTIONS[numberOfArgs] == null) {
				var parameters = new Array(numberOfArgs);
				for (var i = 0; i < numberOfArgs; ++i) {
					parameters[i] = "__" + i;
				}
				var pstr = parameters.join();
				var code = "return function (" + pstr + ") { return fun.apply(this, arguments); };";
				FUNCTIONS[numberOfArgs] = new Function(['fun'], code);
			}
			if (fun == null) {
				return function (fun) {
					return arity(numberOfArgs, fun);
				};
			} else return FUNCTIONS[numberOfArgs](fun);
		};
	})();

})(this);

(function (root) {
	var _ = root._ || require('underscore');

	var existy = function (x) {
		return x != null;
	};
	var truthy = function (x) {
		return (x !== false) && existy(x);
	};
	var __reverse = [].reverse;
	var __slice = [].slice;
	var __map = [].map;
	var curry2 = function (fun) {
		return function curried(first, optionalLast) {
			if (arguments.length === 1) {
				return function (last) {
					return fun(first, last);
				};
			} else return fun(first, optionalLast);
		};
	};

	function baseMapArgs(fun, mapFun) {
		return _.arity(fun.length, function () {
			return fun.apply(this, __map.call(arguments, mapFun));
		});
	}

	_.mixin({
		always: _.constant,
		pipeline: function () {
			var funs = (_.isArray(arguments[0])) ? arguments[0] : arguments;

			return function (seed) {
				return _.reduce(funs,
					function (l, r) {
						return r(l);
					},
					seed);
			};
		},
		conjoin: function () {
			var preds = arguments;

			return function (array) {
				return _.every(array, function (e) {
					return _.every(preds, function (p) {
						return p(e);
					});
				});
			};
		},
		disjoin: function () {
			var preds = arguments;

			return function (array) {
				return _.some(array, function (e) {
					return _.some(preds, function (p) {
						return p(e);
					});
				});
			};
		},
		comparator: function (fun) {
			return function (x, y) {
				if (truthy(fun(x, y)))
					return -1;
				else if (truthy(fun(y, x)))
					return 1;
				else
					return 0;
			};
		},
		complement: function (pred) {
			return function () {
				return !pred.apply(this, arguments);
			};
		},
		splat: function (fun) {
			return function (array) {
				return fun.apply(this, array);
			};
		},
		unsplat: function (fun) {
			var funLength = fun.length;

			if (funLength < 1) {
				return fun;
			} else if (funLength === 1) {
				return function () {
					return fun.call(this, __slice.call(arguments, 0));
				};
			} else {
				return function () {
					var numberOfArgs = arguments.length,
						namedArgs = __slice.call(arguments, 0, funLength - 1),
						numberOfMissingNamedArgs = Math.max(funLength - numberOfArgs - 1, 0),
						argPadding = new Array(numberOfMissingNamedArgs),
						variadicArgs = __slice.call(arguments, fun.length - 1);

					return fun.apply(this, namedArgs.concat(argPadding).concat([variadicArgs]));
				};
			}
		},
		unsplatl: function (fun) {
			var funLength = fun.length;

			if (funLength < 1) {
				return fun;
			} else if (funLength === 1) {
				return function () {
					return fun.call(this, __slice.call(arguments, 0));
				};
			} else {
				return function () {
					var numberOfArgs = arguments.length,
						namedArgs = __slice.call(arguments, Math.max(numberOfArgs - funLength + 1, 0)),
						variadicArgs = __slice.call(arguments, 0, Math.max(numberOfArgs - funLength + 1, 0));

					return fun.apply(this, [variadicArgs].concat(namedArgs));
				};
			}
		},
		mapArgs: curry2(baseMapArgs),
		juxt: function () {
			var funs = arguments;

			return function () {
				var args = arguments;
				return _.map(funs, function (f) {
					return f.apply(this, args);
				}, this);
			};
		},
		fnull: function (fun) {
			var defaults = _.rest(arguments);

			return function () {
				var args = _.toArray(arguments);
				var sz = _.size(defaults);

				for (var i = 0; i < sz; i++) {
					if (!existy(args[i]))
						args[i] = defaults[i];
				}

				return fun.apply(this, args);
			};
		},
		flip2: function (fun) {
			return function () {
				var flipped = __slice.call(arguments);
				flipped[0] = arguments[1];
				flipped[1] = arguments[0];

				return fun.apply(this, flipped);
			};
		},
		flip: function (fun) {
			return function () {
				var reversed = __reverse.call(arguments);

				return fun.apply(this, reversed);
			};
		},
		functionalize: function (method) {
			return function (ctx) {
				return method.apply(ctx, _.rest(arguments));
			};
		},
		methodize: function (func) {
			return function () {
				return func.apply(null, _.cons(this, arguments));
			};
		},
		k: _.always,
		t: _.pipeline
	});

	_.unsplatr = _.unsplat;
	_.mapArgsWith = curry2(_.flip(baseMapArgs));
	_.bound = function (obj, fname) {
		var fn = obj[fname];
		if (!_.isFunction(fn))
			throw new TypeError("Expected property to be a function");
		return _.bind(fn, obj);
	};

})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var slice = Array.prototype.slice;

	_.mixin({
		attempt: function (object, method) {
			if (object == null) return void 0;
			var func = object[method];
			var args = slice.call(arguments, 2);
			return _.isFunction(func) ? func.apply(object, args) : void 0;
		}
	});

})(this);

(function (root, undefined) {
	var _ = root._ || require('underscore');

	var HASNTBEENRUN = {};

	function unary(fun) {
		return function (first) {
			return fun.call(this, first);
		};
	}

	function binary(fun) {
		return function (first, second) {
			return fun.call(this, first, second);
		};
	}

	function foldl(iter, binaryFn, seed) {
		var state, element;
		if (seed !== void 0) {
			state = seed;
		} else {
			state = iter();
		}
		element = iter();
		while (element != null) {
			state = binaryFn.call(element, state, element);
			element = iter();
		}
		return state;
	}

	function unfold(seed, unaryFn) {
		var state = HASNTBEENRUN;
		return function () {
			if (state === HASNTBEENRUN) {
				state = seed;
			} else if (state != null) {
				state = unaryFn.call(state, state);
			}

			return state;
		};
	}

	function unfoldWithReturn(seed, unaryFn) {
		var state = seed,
			pair,
			value;
		return function () {
			if (state != null) {
				pair = unaryFn.call(state, state);
				value = pair[1];
				state = value != null ? pair[0] : void 0;
				return value;
			} else return void 0;
		};
	}

	function accumulate(iter, binaryFn, initial) {
		var state = initial;
		return function () {
			var element = iter();
			if (element == null) {
				return element;
			} else {
				if (state === void 0) {
					state = element;
				} else {
					state = binaryFn.call(element, state, element);
				}

				return state;
			}
		};
	}

	function accumulateWithReturn(iter, binaryFn, initial) {
		var state = initial,
			stateAndReturnValue,
			element;
		return function () {
			element = iter();
			if (element == null) {
				return element;
			} else {
				if (state === void 0) {
					state = element;
					return state;
				} else {
					stateAndReturnValue = binaryFn.call(element, state, element);
					state = stateAndReturnValue[0];
					return stateAndReturnValue[1];
				}
			}
		};
	}

	function map(iter, unaryFn) {
		return function () {
			var element;
			element = iter();
			if (element != null) {
				return unaryFn.call(element, element);
			} else {
				return void 0;
			}
		};
	}

	function mapcat(iter, unaryFn) {
		var lastIter = null;
		return function () {
			var element;
			var gen;
			if (lastIter == null) {
				gen = iter();
				if (gen == null) {
					lastIter = null;
					return void 0;
				}
				lastIter = unaryFn.call(gen, gen);
			}
			while (element == null) {
				element = lastIter();
				if (element == null) {
					gen = iter();
					if (gen == null) {
						lastIter = null;
						return void 0;
					} else {
						lastIter = unaryFn.call(gen, gen);
					}
				}
			}
			return element;
		};
	}

	function select(iter, unaryPredicateFn) {
		return function () {
			var element;
			element = iter();
			while (element != null) {
				if (unaryPredicateFn.call(element, element)) {
					return element;
				}
				element = iter();
			}
			return void 0;
		};
	}

	function reject(iter, unaryPredicateFn) {
		return select(iter, function (something) {
			return !unaryPredicateFn(something);
		});
	}

	function find(iter, unaryPredicateFn) {
		return select(iter, unaryPredicateFn)();
	}

	function slice(iter, numberToDrop, numberToTake) {
		var count = 0;
		while (numberToDrop-- > 0) {
			iter();
		}
		if (numberToTake != null) {
			return function () {
				if (++count <= numberToTake) {
					return iter();
				} else {
					return void 0;
				}
			};
		} else return iter;
	}

	function drop(iter, numberToDrop) {
		return slice(iter, numberToDrop == null ? 1 : numberToDrop);
	}

	function take(iter, numberToTake) {
		return slice(iter, 0, numberToTake == null ? 1 : numberToTake);
	}

	function List(array) {
		var index = 0;
		return function () {
			return array[index++];
		};
	}

	function Tree(array) {
		var index, myself, state;
		index = 0;
		state = [];
		myself = function () {
			var element, tempState;
			element = array[index++];
			if (element instanceof Array) {
				state.push({
					array: array,
					index: index
				});
				array = element;
				index = 0;
				return myself();
			} else if (element === void 0) {
				if (state.length > 0) {
					tempState = state.pop();
					array = tempState.array;
					index = tempState.index;
					return myself();
				} else {
					return void 0;
				}
			} else {
				return element;
			}
		};
		return myself;
	}

	function K(value) {
		return function () {
			return value;
		};
	}

	function upRange(from, to, by) {
		return function () {
			var was;

			if (from > to) {
				return void 0;
			} else {
				was = from;
				from = from + by;
				return was;
			}
		};
	}

	function downRange(from, to, by) {
		return function () {
			var was;

			if (from < to) {
				return void 0;
			} else {
				was = from;
				from = from - by;
				return was;
			}
		};
	}

	function range(from, to, by) {
		if (from == null) {
			return upRange(1, Infinity, 1);
		} else if (to == null) {
			return upRange(from, Infinity, 1);
		} else if (by == null) {
			if (from <= to) {
				return upRange(from, to, 1);
			} else return downRange(from, to, 1);
		} else if (by > 0) {
			return upRange(from, to, by);
		} else if (by < 0) {
			return downRange(from, to, Math.abs(by));
		} else return k(from);
	}

	var numbers = unary(range);

	_.iterators = {
		accumulate: accumulate,
		accumulateWithReturn: accumulateWithReturn,
		foldl: foldl,
		reduce: foldl,
		unfold: unfold,
		unfoldWithReturn: unfoldWithReturn,
		map: map,
		mapcat: mapcat,
		select: select,
		reject: reject,
		filter: select,
		find: find,
		slice: slice,
		drop: drop,
		take: take,
		List: List,
		Tree: Tree,
		constant: K,
		K: K,
		numbers: numbers,
		range: range
	};

})(this, void 0);

(function (root) {
	var _ = root._ || require('underscore');

	_.mixin({
		isInstanceOf: function (x, t) {
			return (x instanceof t);
		},
		isAssociative: function (x) {
			return _.isArray(x) || _.isObject(x) || _.isArguments(x);
		},
		isIndexed: function (x) {
			return _.isArray(x) || _.isString(x) || _.isArguments(x);
		},
		isSequential: function (x) {
			return (_.isArray(x)) || (_.isArguments(x));
		},
		isPlainObject: function (x) {
			return _.isObject(x) && x.constructor === root.Object;
		},
		isZero: function (x) {
			return 0 === x;
		},
		isEven: function (x) {
			return _.isFinite(x) && (x & 1) === 0;
		},
		isOdd: function (x) {
			return _.isFinite(x) && !_.isEven(x);
		},
		isPositive: function (x) {
			return x > 0;
		},
		isNegative: function (x) {
			return x < 0;
		},
		isValidDate: function (x) {
			return _.isDate(x) && !_.isNaN(x.getTime());
		},
		isNumeric: function (n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		isInteger: function (i) {
			return _.isNumeric(i) && i % 1 === 0;
		},
		isFloat: function (n) {
			return _.isNumeric(n) && !_.isInteger(n);
		},
		isJSON: function (str) {
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		},
		isIncreasing: function () {
			var count = _.size(arguments);
			if (count === 1) return true;
			if (count === 2) return arguments[0] < arguments[1];

			for (var i = 1; i < count; i++) {
				if (arguments[i - 1] >= arguments[i]) {
					return false;
				}
			}

			return true;
		},
		isDecreasing: function () {
			var count = _.size(arguments);
			if (count === 1) return true;
			if (count === 2) return arguments[0] > arguments[1];

			for (var i = 1; i < count; i++) {
				if (arguments[i - 1] <= arguments[i]) {
					return false;
				}
			}

			return true;
		}
	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var slice = Array.prototype.slice,
		concat = Array.prototype.concat;

	var existy = function (x) {
		return x != null;
	};
	var truthy = function (x) {
		return (x !== false) && existy(x);
	};
	var isAssociative = function (x) {
		return _.isArray(x) || _.isObject(x);
	};
	var curry2 = function (fun) {
		return function (last) {
			return function (first) {
				return fun(first, last);
			};
		};
	};

	_.mixin({
		merge: function () {
			var dest = _.some(arguments) ? {} : null;

			if (truthy(dest)) {
				_.extend.apply(null, concat.call([dest], _.toArray(arguments)));
			}

			return dest;
		},
		renameKeys: function (obj, kobj) {
			return _.reduce(kobj, function (o, nu, old) {
					if (existy(obj[old])) {
						o[nu] = obj[old];
						return o;
					} else
						return o;
				},
				_.omit.apply(null, concat.call([obj], _.keys(kobj))));
		},
		snapshot: function (obj) {
			if (obj == null || typeof (obj) != 'object') {
				return obj;
			}

			var temp = new obj.constructor();

			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					temp[key] = _.snapshot(obj[key]);
				}
			}

			return temp;
		},
		updatePath: function (obj, fun, ks, defaultValue) {
			if (!isAssociative(obj)) throw new TypeError("Attempted to update a non-associative object.");
			if (!existy(ks)) return fun(obj);

			var deepness = _.isArray(ks);
			var keys = deepness ? ks : [ks];
			var ret = deepness ? _.snapshot(obj) : _.clone(obj);
			var lastKey = _.last(keys);
			var target = ret;

			_.each(_.initial(keys), function (key) {
				if (defaultValue && !_.has(target, key)) {
					target[key] = _.clone(defaultValue);
				}
				target = target[key];
			});

			target[lastKey] = fun(target[lastKey]);
			return ret;
		},
		setPath: function (obj, value, ks, defaultValue) {
			if (!existy(ks)) throw new TypeError("Attempted to set a property at a null path.");

			return _.updatePath(obj, function () {
				return value;
			}, ks, defaultValue);
		},
		frequencies: curry2(_.countBy)(_.identity)
	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var concat = Array.prototype.concat;
	var ArrayProto = Array.prototype;
	var slice = ArrayProto.slice;

	_.mixin({
		accessor: function (field) {
			return function (obj) {
				return (obj && obj[field]);
			};
		},
		dictionary: function (obj) {
			return function (field) {
				return (obj && field && obj[field]);
			};
		},
		selectKeys: function (obj, ks) {
			return _.pick.apply(null, concat.call([obj], ks));
		},
		kv: function (obj, key) {
			if (_.has(obj, key)) {
				return [key, obj[key]];
			}

			return void 0;
		},
		getPath: function getPath(obj, ks) {
			if (typeof ks == "string") ks = ks.split(".");
			if (obj === undefined) return void 0;
			if (ks.length === 0) return obj;
			if (obj === null) return void 0;

			return getPath(obj[_.first(ks)], _.rest(ks));
		},
		hasPath: function hasPath(obj, ks) {
			if (typeof ks == "string") ks = ks.split(".");

			var numKeys = ks.length;

			if (obj == null && numKeys > 0) return false;

			if (!(ks[0] in obj)) return false;

			if (numKeys === 1) return true;

			return hasPath(obj[_.first(ks)], _.rest(ks));
		},
		pickWhen: function (obj, pred) {
			var copy = {};

			_.each(obj, function (value, key) {
				if (pred(obj[key])) copy[key] = obj[key];
			});

			return copy;
		},
		omitWhen: function (obj, pred) {
			return _.pickWhen(obj, function (e) {
				return !pred(e);
			});
		}

	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');

	_.mixin({
		exists: function (x) {
			return x != null;
		},
		truthy: function (x) {
			return (x !== false) && _.exists(x);
		},
		falsey: function (x) {
			return !_.truthy(x);
		},
		not: function (b) {
			return !b;
		},
		firstExisting: function () {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != null) return arguments[i];
			}
		}
	});

})(this);

(function (root) {
	var _ = root._ || require('underscore');

	function variadicMath(operator) {
		return function () {
			return _.reduce(arguments, operator);
		};
	}

	function variadicComparator(comparator) {
		return function () {
			var result;
			for (var i = 0; i < arguments.length - 1; i++) {
				result = comparator(arguments[i], arguments[i + 1]);
				if (result === false) return result;
			}
			return result;
		};
	}

	function invert(fn) {
		return function () {
			return !fn.apply(this, arguments);
		};
	}

	function add(x, y) {
		return x + y;
	}

	function sub(x, y) {
		return x - y;
	}

	function mul(x, y) {
		return x * y;
	}

	function div(x, y) {
		return x / y;
	}

	function mod(x, y) {
		return x % y;
	}

	function inc(x) {
		return ++x;
	}

	function dec(x) {
		return --x;
	}

	function neg(x) {
		return -x;
	}

	function bitwiseAnd(x, y) {
		return x & y;
	}

	function bitwiseOr(x, y) {
		return x | y;
	}

	function bitwiseXor(x, y) {
		return x ^ y;
	}

	function bitwiseLeft(x, y) {
		return x << y;
	}

	function bitwiseRight(x, y) {
		return x >> y;
	}

	function bitwiseZ(x, y) {
		return x >>> y;
	}

	function bitwiseNot(x) {
		return~ x;
	}

	function eq(x, y) {
		return x == y;
	}

	function seq(x, y) {
		return x === y;
	}

	function not(x) {
		return !x;
	}

	function gt(x, y) {
		return x > y;
	}

	function lt(x, y) {
		return x < y;
	}

	function gte(x, y) {
		return x >= y;
	}

	function lte(x, y) {
		return x <= y;
	}

	_.mixin({
		add: variadicMath(add),
		sub: variadicMath(sub),
		mul: variadicMath(mul),
		div: variadicMath(div),
		mod: mod,
		inc: inc,
		dec: dec,
		neg: neg,
		eq: variadicComparator(eq),
		seq: variadicComparator(seq),
		neq: invert(variadicComparator(eq)),
		sneq: invert(variadicComparator(seq)),
		not: not,
		gt: variadicComparator(gt),
		lt: variadicComparator(lt),
		gte: variadicComparator(gte),
		lte: variadicComparator(lte),
		bitwiseAnd: variadicMath(bitwiseAnd),
		bitwiseOr: variadicMath(bitwiseOr),
		bitwiseXor: variadicMath(bitwiseXor),
		bitwiseNot: bitwiseNot,
		bitwiseLeft: variadicMath(bitwiseLeft),
		bitwiseRight: variadicMath(bitwiseRight),
		bitwiseZ: variadicMath(bitwiseZ)
	});
})(this);

(function (root) {
	var _ = root._ || require('underscore');
	var plusRegex = /\+/g;
	var spaceRegex = /\%20/g;
	var bracketRegex = /(?:([^\[]+))|(?:\[(.*?)\])/g;

	var urlDecode = function (s) {
		return decodeURIComponent(s.replace(plusRegex, '%20'));
	};
	var urlEncode = function (s) {
		return encodeURIComponent(s).replace(spaceRegex, '+');
	};

	var buildParams = function (prefix, val, top) {
		if (_.isUndefined(top)) top = true;
		if (_.isArray(val)) {
			return _.map(val, function (value, key) {
				return buildParams(top ? key : prefix + '[]', value, false);
			}).join('&');
		} else if (_.isObject(val)) {
			return _.map(val, function (value, key) {
				return buildParams(top ? key : prefix + '[' + key + ']', value, false);
			}).join('&');
		} else {
			return urlEncode(prefix) + '=' + urlEncode(val);
		}
	};

	_.mixin({
		explode: function (s) {
			return s.split('');
		},
		fromQuery: function (str) {
			var parameters = str.split('&'),
				obj = {},
				parameter,
				key,
				match,
				lastKey,
				subKey,
				depth;
			_.each(parameters, function (parameter) {
				parameter = parameter.split('=');
				key = urlDecode(parameter[0]);
				lastKey = key;
				depth = obj;
				bracketRegex.lastIndex = 0;
				while ((match = bracketRegex.exec(key)) !== null) {
					if (!_.isUndefined(match[1])) {
						subKey = match[1];

					} else {
						subKey = match[2];
						depth[lastKey] = depth[lastKey] || (subKey ? {} : []);
						depth = depth[lastKey];
					}
					lastKey = subKey || _.size(depth);
				}
				depth[lastKey] = urlDecode(parameter[1]);
			});

			return obj;
		},
		implode: function (a) {
			return a.join('');
		},
		camelCase: function (string) {
			return string.replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		},
		toDash: function (string) {
			string = string.replace(/([A-Z])/g, function (_1) {
				return "-" + _1.toLowerCase();
			});
			return (string.charAt(0) == '-') ? string.substr(1) : string;
		},
		toQuery: function (obj) {
			return buildParams('', obj);
		},
		strContains: function (str, search) {
			if (typeof str != 'string') throw new TypeError;
			return (str.indexOf(search) != -1);
		}

	});
})(this);

(function (root) {
	var _ = root._ || require('underscore');

	_.mixin({
		done: function (value) {
			var ret = _(value);
			ret.stopTrampoline = true;
			return ret;
		},
		trampoline: function (fun) {
			var result = fun.apply(fun, _.rest(arguments));

			while (_.isFunction(result)) {
				result = result();
				if ((result instanceof _) && (result.stopTrampoline)) break;
			}

			return result.value();
		}
	});

})(this);

! function (root, String) {
	'use strict';

	var nativeTrim = String.prototype.trim;
	var nativeTrimRight = String.prototype.trimRight;
	var nativeTrimLeft = String.prototype.trimLeft;

	var parseNumber = function (source) {
		return source * 1 || 0;
	};

	var strRepeat = function (str, qty) {
		if (qty < 1) return '';
		var result = '';
		while (qty > 0) {
			if (qty & 1) result += str;
			qty >>= 1, str += str;
		}
		return result;
	};

	var slice = [].slice;

	var defaultToWhiteSpace = function (characters) {
		if (characters == null)
			return '\\s';
		else if (characters.source)
			return characters.source;
		else
			return '[' + _s.escapeRegExp(characters) + ']';
	};

	function boolMatch(s, matchers) {
		var i, matcher, down = s.toLowerCase();
		matchers = [].concat(matchers);
		for (i = 0; i < matchers.length; i += 1) {
			matcher = matchers[i];
			if (!matcher) continue;
			if (matcher.test && matcher.test(s)) return true;
			if (matcher.toLowerCase() === down) return true;
		}
	}

	var escapeChars = {
		lt: '<',
		gt: '>',
		quot: '"',
		amp: '&',
		apos: "'"
	};

	var reversedEscapeChars = {};
	for (var key in escapeChars) reversedEscapeChars[escapeChars[key]] = key;
	reversedEscapeChars["'"] = '#39';

	var sprintf = (function () {
		function get_type(variable) {
			return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
		}

		var str_repeat = strRepeat;

		var str_format = function () {
			if (!str_format.cache.hasOwnProperty(arguments[0])) {
				str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
			}
			return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
		};

		str_format.format = function (parse_tree, argv) {
			var cursor = 1,
				tree_length = parse_tree.length,
				node_type = '',
				arg, output = [],
				i, k, match, pad, pad_character, pad_length;
			for (i = 0; i < tree_length; i++) {
				node_type = get_type(parse_tree[i]);
				if (node_type === 'string') {
					output.push(parse_tree[i]);
				} else if (node_type === 'array') {
					match = parse_tree[i];
					if (match[2]) {
						arg = argv[cursor];
						for (k = 0; k < match[2].length; k++) {
							if (!arg.hasOwnProperty(match[2][k])) {
								throw new Error(sprintf('[_.sprintf] property "%s" does not exist', match[2][k]));
							}
							arg = arg[match[2][k]];
						}
					} else if (match[1]) {
						arg = argv[match[1]];
					} else {
						arg = argv[cursor++];
					}

					if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
						throw new Error(sprintf('[_.sprintf] expecting number but found %s', get_type(arg)));
					}
					switch (match[8]) {
					case 'b':
						arg = arg.toString(2);
						break;
					case 'c':
						arg = String.fromCharCode(arg);
						break;
					case 'd':
						arg = parseInt(arg, 10);
						break;
					case 'e':
						arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
						break;
					case 'f':
						arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
						break;
					case 'o':
						arg = arg.toString(8);
						break;
					case 's':
						arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg);
						break;
					case 'u':
						arg = Math.abs(arg);
						break;
					case 'x':
						arg = arg.toString(16);
						break;
					case 'X':
						arg = arg.toString(16).toUpperCase();
						break;
					}
					arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+' + arg : arg);
					pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
					pad_length = match[6] - String(arg).length;
					pad = match[6] ? str_repeat(pad_character, pad_length) : '';
					output.push(match[5] ? arg + pad : pad + arg);
				}
			}
			return output.join('');
		};

		str_format.cache = {};

		str_format.parse = function (fmt) {
			var _fmt = fmt,
				match = [],
				parse_tree = [],
				arg_names = 0;
			while (_fmt) {
				if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
					parse_tree.push(match[0]);
				} else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
					parse_tree.push('%');
				} else if ((match = /^\x25(?:([1-9]\d*)\_|\(([^\)]+)\))?(\+)?(0|'[^_])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
					if (match[2]) {
						arg_names |= 1;
						var field_list = [],
							replacement_field = match[2],
							field_match = [];
						if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
							field_list.push(field_match[1]);
							while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
								if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
									field_list.push(field_match[1]);
								} else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
									field_list.push(field_match[1]);
								} else {
									throw new Error('[_.sprintf] huh?');
								}
							}
						} else {
							throw new Error('[_.sprintf] huh?');
						}
						match[2] = field_list;
					} else {
						arg_names |= 2;
					}
					if (arg_names === 3) {
						throw new Error('[_.sprintf] mixing positional and named placeholders is not (yet) supported');
					}
					parse_tree.push(match);
				} else {
					throw new Error('[_.sprintf] huh?');
				}
				_fmt = _fmt.substring(match[0].length);
			}
			return parse_tree;
		};

		return str_format;
	})();

	var _s = {

		VERSION: '2.3.0',
		isBlank: function (str) {
			if (str == null) str = '';
			return (/^\s*_/).test(str);
		},
		stripTags: function (str) {
			if (str == null) return '';
			return String(str).replace(/<\/?[^>]+>/g, '');
		},
		capitalize: function (str) {
			str = str == null ? '' : String(str);
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
		chop: function (str, step) {
			if (str == null) return [];
			str = String(str);
			step = ~~step;
			return step > 0 ? str.match(new RegExp('.{1,' + step + '}', 'g')) : [str];
		},
		clean: function (str) {
			return _s.strip(str).replace(/\s+/g, ' ');
		},
		count: function (str, substr) {
			if (str == null || substr == null) return 0;

			str = String(str);
			substr = String(substr);

			var count = 0,
				pos = 0,
				length = substr.length;

			while (true) {
				pos = str.indexOf(substr, pos);
				if (pos === -1) break;
				count++;
				pos += length;
			}

			return count;
		},
		chars: function (str) {
			if (str == null) return [];
			return String(str).split('');
		},
		swapCase: function (str) {
			if (str == null) return '';
			return String(str).replace(/\S/g, function (c) {
				return c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase();
			});
		},
		escapeHTML: function (str) {
			if (str == null) return '';
			return String(str).replace(/[&<>"']/g, function (m) {
				return '&' + reversedEscapeChars[m] + ';';
			});
		},
		unescapeHTML: function (str) {
			if (str == null) return '';
			return String(str).replace(/\&([^;]+);/g, function (entity, entityCode) {
				var match;

				if (entityCode in escapeChars) {
					return escapeChars[entityCode];
				} else if (match = entityCode.match(/^#x([\da-fA-F]+)_/)) {
					return String.fromCharCode(parseInt(match[1], 16));
				} else if (match = entityCode.match(/^#(\d+)_/)) {
					return String.fromCharCode(~~match[1]);
				} else {
					return entity;
				}
			});
		},
		escapeRegExp: function (str) {
			if (str == null) return '';
			return String(str).replace(/([.*+?^=!:_{}()|[\]\/\\])/g, '\\_1');
		},
		splice: function (str, i, howmany, substr) {
			var arr = _s.chars(str);
			arr.splice(~~i, ~~howmany, substr);
			return arr.join('');
		},
		insert: function (str, i, substr) {
			return _s.splice(str, i, 0, substr);
		},
		include: function (str, needle) {
			if (needle === '') return true;
			if (str == null) return false;
			return String(str).indexOf(needle) !== -1;
		},
		join: function () {
			var args = slice.call(arguments),
				separator = args.shift();

			if (separator == null) separator = '';

			return args.join(separator);
		},
		lines: function (str) {
			if (str == null) return [];
			return String(str).split("\n");
		},
		reverse: function (str) {
			return _s.chars(str).reverse().join('');
		},
		startsWith: function (str, starts) {
			if (starts === '') return true;
			if (str == null || starts == null) return false;
			str = String(str);
			starts = String(starts);
			return str.length >= starts.length && str.slice(0, starts.length) === starts;
		},
		endsWith: function (str, ends) {
			if (ends === '') return true;
			if (str == null || ends == null) return false;
			str = String(str);
			ends = String(ends);
			return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
		},
		succ: function (str) {
			if (str == null) return '';
			str = String(str);
			return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length - 1) + 1);
		},
		titleize: function (str) {
			if (str == null) return '';
			str = String(str).toLowerCase();
			return str.replace(/(?:^|\s|-)\S/g, function (c) {
				return c.toUpperCase();
			});
		},
		camelize: function (str) {
			return _s.trim(str).replace(/[-_\s]+(.)?/g, function (match, c) {
				return c ? c.toUpperCase() : "";
			});
		},
		underscored: function (str) {
			return _s.trim(str).replace(/([a-z\d])([A-Z]+)/g, '_1__2').replace(/[-\s]+/g, '_').toLowerCase();
		},
		dasherize: function (str) {
			return _s.trim(str).replace(/([A-Z])/g, '-_1').replace(/[-_\s]+/g, '-').toLowerCase();
		},
		classify: function (str) {
			return _s.titleize(String(str).replace(/[\W_]/g, ' ')).replace(/\s/g, '');
		},
		humanize: function (str) {
			return _s.capitalize(_s.underscored(str).replace(/_id_/, '').replace(/_/g, ' '));
		},
		trim: function (str, characters) {
			if (str == null) return '';
			if (!characters && nativeTrim) return nativeTrim.call(str);
			characters = defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp('^' + characters + '+|' + characters + '+_', 'g'), '');
		},
		ltrim: function (str, characters) {
			if (str == null) return '';
			if (!characters && nativeTrimLeft) return nativeTrimLeft.call(str);
			characters = defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp('^' + characters + '+'), '');
		},
		rtrim: function (str, characters) {
			if (str == null) return '';
			if (!characters && nativeTrimRight) return nativeTrimRight.call(str);
			characters = defaultToWhiteSpace(characters);
			return String(str).replace(new RegExp(characters + '+_'), '');
		},
		truncate: function (str, length, truncateStr) {
			if (str == null) return '';
			str = String(str);
			truncateStr = truncateStr || '...';
			length = ~~length;
			return str.length > length ? str.slice(0, length) + truncateStr : str;
		},
		prune: function (str, length, pruneStr) {
			if (str == null) return '';

			str = String(str);
			length = ~~length;
			pruneStr = pruneStr != null ? String(pruneStr) : '...';

			if (str.length <= length) return str;

			var tmpl = function (c) {
					return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' ';
				},
				template = str.slice(0, length + 1).replace(/.(?=\W*\w*_)/g, tmpl);

			if (template.slice(template.length - 2).match(/\w\w/))
				template = template.replace(/\s*\S+_/, '');
			else
				template = _s.rtrim(template.slice(0, template.length - 1));

			return (template + pruneStr).length > str.length ? str : str.slice(0, template.length) + pruneStr;
		},
		words: function (str, delimiter) {
			if (_s.isBlank(str)) return [];
			return _s.trim(str, delimiter).split(delimiter || /\s+/);
		},
		pad: function (str, length, padStr, type) {
			str = str == null ? '' : String(str);
			length = ~~length;

			var padlen = 0;

			if (!padStr)
				padStr = ' ';
			else if (padStr.length > 1)
				padStr = padStr.charAt(0);

			switch (type) {
			case 'right':
				padlen = length - str.length;
				return str + strRepeat(padStr, padlen);
			case 'both':
				padlen = length - str.length;
				return strRepeat(padStr, Math.ceil(padlen / 2)) + str + strRepeat(padStr, Math.floor(padlen / 2));
			default:
				padlen = length - str.length;
				return strRepeat(padStr, padlen) + str;
			}
		},
		lpad: function (str, length, padStr) {
			return _s.pad(str, length, padStr);
		},
		rpad: function (str, length, padStr) {
			return _s.pad(str, length, padStr, 'right');
		},
		lrpad: function (str, length, padStr) {
			return _s.pad(str, length, padStr, 'both');
		},
		sprintf: sprintf,
		vsprintf: function (fmt, argv) {
			argv.unshift(fmt);
			return sprintf.apply(null, argv);
		},
		toNumber: function (str, decimals) {
			if (!str) return 0;
			str = _s.trim(str);
			if (!str.match(/^-?\d+(?:\.\d+)?_/)) return NaN;
			return parseNumber(parseNumber(str).toFixed(~~decimals));
		},
		numberFormat: function (number, dec, dsep, tsep) {
			if (isNaN(number) || number == null) return '';

			number = number.toFixed(~~dec);
			tsep = typeof tsep == 'string' ? tsep : ',';

			var parts = number.split('.'),
				fnums = parts[0],
				decimals = parts[1] ? (dsep || '.') + parts[1] : '';

			return fnums.replace(/(\d)(?=(?:\d{3})+_)/g, '_1' + tsep) + decimals;
		},
		strRight: function (str, sep) {
			if (str == null) return '';
			str = String(str);
			sep = sep != null ? String(sep) : sep;
			var pos = !sep ? -1 : str.indexOf(sep);
			return~ pos ? str.slice(pos + sep.length, str.length) : str;
		},
		strRightBack: function (str, sep) {
			if (str == null) return '';
			str = String(str);
			sep = sep != null ? String(sep) : sep;
			var pos = !sep ? -1 : str.lastIndexOf(sep);
			return~ pos ? str.slice(pos + sep.length, str.length) : str;
		},
		strLeft: function (str, sep) {
			if (str == null) return '';
			str = String(str);
			sep = sep != null ? String(sep) : sep;
			var pos = !sep ? -1 : str.indexOf(sep);
			return~ pos ? str.slice(0, pos) : str;
		},
		strLeftBack: function (str, sep) {
			if (str == null) return '';
			str += '';
			sep = sep != null ? '' + sep : sep;
			var pos = str.lastIndexOf(sep);
			return~ pos ? str.slice(0, pos) : str;
		},
		toSentence: function (array, separator, lastSeparator, serial) {
			separator = separator || ', ';
			lastSeparator = lastSeparator || ' and ';
			var a = array.slice(),
				lastMember = a.pop();

			if (array.length > 2 && serial) lastSeparator = _s.rtrim(separator) + lastSeparator;

			return a.length ? a.join(separator) + lastSeparator + lastMember : lastMember;
		},
		toSentenceSerial: function () {
			var args = slice.call(arguments);
			args[3] = true;
			return _s.toSentence.apply(_s, args);
		},
		slugify: function (str) {
			if (str == null) return '';

			var from = "ąàáäâãåæăćęèéëêìíïîłńòóöôõøśșțùúüûñçżź",
				to = "aaaaaaaaaceeeeeiiiilnoooooosstuuuunczz",
				regex = new RegExp(defaultToWhiteSpace(from), 'g');

			str = String(str).toLowerCase().replace(regex, function (c) {
				var index = from.indexOf(c);
				return to.charAt(index) || '-';
			});

			return _s.dasherize(str.replace(/[^\w\s-]/g, ''));
		},
		surround: function (str, wrapper) {
			return [wrapper, str, wrapper].join('');
		},
		quote: function (str, quoteChar) {
			return _s.surround(str, quoteChar || '"');
		},
		unquote: function (str, quoteChar) {
			quoteChar = quoteChar || '"';
			if (str[0] === quoteChar && str[str.length - 1] === quoteChar)
				return str.slice(1, str.length - 1);
			else return str;
		},
		exports: function () {
			var result = {};

			for (var prop in this) {
				if (!this.hasOwnProperty(prop) || prop.match(/^(?:include|contains|reverse)_/)) continue;
				result[prop] = this[prop];
			}

			return result;
		},
		repeat: function (str, qty, separator) {
			if (str == null) return '';

			qty = ~~qty;
			if (separator == null) return strRepeat(String(str), qty);
			for (var repeat = []; qty > 0; repeat[--qty] = str) {}
			return repeat.join(separator);
		},
		naturalCmp: function (str1, str2) {
			if (str1 == str2) return 0;
			if (!str1) return -1;
			if (!str2) return 1;

			var cmpRegex = /(\.\d+)|(\d+)|(\D+)/g,
				tokens1 = String(str1).toLowerCase().match(cmpRegex),
				tokens2 = String(str2).toLowerCase().match(cmpRegex),
				count = Math.min(tokens1.length, tokens2.length);

			for (var i = 0; i < count; i++) {
				var a = tokens1[i],
					b = tokens2[i];

				if (a !== b) {
					var num1 = parseInt(a, 10);
					if (!isNaN(num1)) {
						var num2 = parseInt(b, 10);
						if (!isNaN(num2) && num1 - num2)
							return num1 - num2;
					}
					return a < b ? -1 : 1;
				}
			}

			if (tokens1.length === tokens2.length)
				return tokens1.length - tokens2.length;

			return str1 < str2 ? -1 : 1;
		},
		levenshtein: function (str1, str2) {
			if (str1 == null && str2 == null) return 0;
			if (str1 == null) return String(str2).length;
			if (str2 == null) return String(str1).length;

			str1 = String(str1);
			str2 = String(str2);

			var current = [],
				prev, value;

			for (var i = 0; i <= str2.length; i++)
				for (var j = 0; j <= str1.length; j++) {
					if (i && j)
						if (str1.charAt(j - 1) === str2.charAt(i - 1))
							value = prev;
						else
							value = Math.min(current[j], current[j - 1], prev) + 1;
					else
						value = i + j;

					prev = current[j];
					current[j] = value;
				}

			return current.pop();
		},
		toBoolean: function (str, trueValues, falseValues) {
			if (typeof str === "number") str = "" + str;
			if (typeof str !== "string") return !!str;
			str = _s.trim(str);
			if (boolMatch(str, trueValues || ["true", "1"])) return true;
			if (boolMatch(str, falseValues || ["false", "0"])) return false;
		}
	};

	_s.strip = _s.trim;
	_s.lstrip = _s.ltrim;
	_s.rstrip = _s.rtrim;
	_s.center = _s.lrpad;
	_s.rjust = _s.lpad;
	_s.ljust = _s.rpad;
	_s.contains = _s.include;
	_s.q = _s.quote;
	_s.toBool = _s.toBoolean;
	if (typeof exports !== 'undefined') {
		if (typeof module !== 'undefined' && module.exports)
			module.exports = _s;

		exports._s = _s;
	}
	if (typeof define === 'function' && define.amd)
		define('underscore.string', [], function () {
			return _s;
		});
	root._ = root._ || {};
	root._.string = root._.str = _s;
}(this, String);

(function (root, factory) {
	if (typeof exports === "object") {
		module.exports = factory(require('lodash'));
	} else if (typeof define === "function" && define.amd) {
		define(['lodash'], factory);
	} else {
		root._tpl = factory(_);
	}
})(this, function (_) {
	"use strict";

	var hbs = /\{\{(.+?)\}\}/g;

	_.templateSettings.ignoreKeys = false;

	function _tpl(subject, data, settings) {
		var result;
		var opts = _.defaults(settings || {}, _.templateSettings);
		if (opts.mustache || opts.handlebars) {
			opts.interpolate = hbs;
		}
		if (_.isString(subject)) {
			return _.template(subject, data, opts);
		} else if (_.isArray(subject)) {
			result = [];
			opts.ignoreKeys = true;
		} else {
			result = {};
		}

		_.each(subject, function (element, key) {
			var item = element;
			if (!opts.ignoreKeys) {
				key = _.template(key, data, opts);
			}
			if (_.isFunction(item)) {
				item = item(data);
			}
			if (_.isObject(item)) {
				result[key] = _tpl(item, data, opts);
			} else if (_.isString(item)) {
				result[key] = _.template(item, data, opts);
			}
		});
		return result;
	}

	_tpl.templateSettings = _.templateSettings;

	return _tpl;
});

(function e(t, n, r) {
	function s(o, u) {
		if (!n[o]) {
			if (!t[o]) {
				var a = typeof require == "function" && require;
				if (!u && a) return a(o, !0);
				if (i) return i(o, !0);
				throw new Error("Cannot find module '" + o + "'")
			}
			var f = n[o] = {
				exports: {}
			};
			t[o][0].call(f.exports, function (e) {
				var n = t[o][1][e];
				return s(n ? n : e)
			}, f, f.exports, e, t, n, r)
		}
		return n[o].exports
	}
	var i = typeof require == "function" && require;
	for (var o = 0; o < r.length; o++) s(r[o]);
	return s
})({
	1: [

		function (require, module, exports) {
			var index = require('./');

			index.save = function (db, destination) {
				destination = destination || 'db';
				localStorage.setItem(destination, JSON.stringify(db, null, 2));
			};

			index.load = function (source) {
				source = source || 'db';
				return JSON.parse(localStorage.getItem(source));
			};

			index.mixWith(_);
}, {
			"./": 2
		}],
	2: [

		function (require, module, exports) {
			var _;

			function uuid(a, b) {
				for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
				return b
			}

			module.exports = {
				__update: function (dest, src) {
					_.each(src, function (value, key) {
						dest[key] = value;
					});
				},
				__remove: function (array, item) {
					var index = _.indexOf(array, item);
					if (index != -1) array.splice(index, 1);
				},
				get: function (collection, id) {
					return _.find(collection, function (doc) {
						return doc[_.id] === id;
					});
				},
				createId: function (collection, doc) {
					return uuid();
				},
				insert: function (collection, doc) {
					doc[_.id] = doc[_.id] || _.createId(collection, doc);

					collection.push(doc);

					return doc;
				},
				update: function (collection, id, attrs) {
					var doc = _.get(collection, id);

					if (doc) _.__update(doc, attrs);

					return doc;
				},
				updateWhere: function (collection, whereAttrs, attrs) {
					var docs = _.where(collection, whereAttrs);

					docs.forEach(function (doc) {
						_.__update(doc, attrs);
					});

					return docs;
				},
				remove: function (collection, id) {
					var doc = _.get(collection, id);

					_.__remove(collection, doc);

					return doc;
				},
				removeWhere: function (collection, attrs) {
					var docs = _.where(collection, attrs);

					docs.forEach(function (doc) {
						_.__remove(collection, doc);
					});

					return docs;
				},
				mixWith: function (lib) {
					_ = lib;
					_.id = 'id';
					_.mixin(this);

				}
			};
}, {}]
}, {}, [1])

var exports, funkyjs, methods, root, setupMethods, _;

_ = require('underscore');

_.str = require('underscore.string');

methods = {
	'incr': function (elem, step) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['incr'];
		case 1:
			return elem + 1;
		default:
			return elem + step;
		}
	},
	'sum': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['sum'];
		default:
			return _.reduce(args, (function (memo, el) {
				return memo + el;
			}), 0);
		}
	},
	'sum-array': function (list) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['sum-array'];
		default:
			return methods['sum'].apply(this, list);
		}
	},
	'mult': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['mult'];
		default:
			return _.reduce(args, (function (memo, el) {
				return memo * el;
			}), 1);
		}
	},
	'mult-array': function (list) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['mult-array'];
		default:
			return methods['mult'].apply(this, list);
		}
	},
	'unpair': function (list) {
		var args, item, object, _i, _len;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['unpair'];
		default:
			object = {};
			for (_i = 0, _len = list.length; _i < _len; _i++) {
				item = list[_i];
				if (object.hasOwnProperty(item[0])) {
					if (_.isArray(object[item[0]])) {
						object[item[0]].push(item[1]);
					} else {
						object[item[0]] = [object[item[0]], item[1]];
					}
				} else {
					object[item[0]] = item[1];
				}
			}
			return object;
		}
	},
	'object-surgery': function (object, key, func) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['object-surgery'];
		case 1:
			return function (k, fn) {
				return methods['object-surgery'](object, k, fn);
			};
		case 2:
			return function (fn) {
				return methods['object-surgery'](object, key, fn);
			};
		default:
			object[key] = func(object[key]);
			return object;
		}
	},
	'array-surgery': function (list, index, func) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['array-surgery'];
		case 1:
			return function (idx, fn) {
				return methods['array-surgery'](list, idx, fn);
			};
		case 2:
			return function (fn) {
				return methods['array-surgery'](list, index, fn);
			};
		default:
			list[index] = func(list[index]);
			return list;
		}
	},
	'strToBool': function (string) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['strToBool'];
		default:
			if (string === 'false') {
				return false;
			} else {
				if (string === 'true') {
					return true;
				} else {
					return string;
				}
			}
		}
	},
	'not': function (value) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['not'];
		default:
			return !value;
		}
	},
	'is': function (value1, value2) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['is'];
		case 1:
			return function (val2) {
				return methods['is'](value1, val2);
			};
		default:
			return value1 === value2;
		}
	},
	'isnt': function (value1, value2) {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['isnt'];
		case 1:
			return function (val2) {
				return methods['isnt'](value1, val2);
			};
		default:
			return value1 !== value2;
		}
	},
	'and': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['and'];
		default:
			return _.size(args) !== _.size(_.reject(args, function (arg) {
				return !arg;
			}));
		}
	},
	'or': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['or'];
		default:
			return _.size(_.reject(args, function (arg) {
				return !arg;
			}) !== 0);
		}
	},
	'xor': function () {
		var args, _ref;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['xor'];
		default:
			return _.size((_ref = _.reject(args, function (arg) {
				return !arg;
			})) !== 0 && _ref !== _.size(args));
		}
	},
	'if': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['if'];
		case 1:
			return function (cond) {
				return methods['if'](cond, args[0]);
			};
		case 2:
			return function (cond) {
				return methods['if'](cond, args[0], args[1]);
			};
		default:
			if (args[0]) {
				return typeof args[1] === "function" ? args[1]() : void 0;
			} else {
				return typeof args[2] === "function" ? args[2]() : void 0;
			}
		}
	},
	'while': function () {
		var args, _results;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['while'];
		case 1:
			return function (fn) {
				return methods['while'](args[0], fn);
			};
		default:
			_results = [];
			while (typeof args[0] === "function" ? args[0]() : void 0) {
				_results.push(typeof args[1] === "function" ? args[1]() : void 0);
			}
			return _results;
		}
	},
	'unless': function () {
		var args;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['unless'];
		case 1:
			return function (cond) {
				return methods['unless'](cond, args[0]);
			};
		case 2:
			return function (cond) {
				return methods['unless'](cond, args[0], args[1]);
			};
		default:
			if (!args[0]) {
				return typeof args[1] === "function" ? args[1]() : void 0;
			} else {
				return typeof args[2] === "function" ? args[2]() : void 0;
			}
		}
	},
	'until': function () {
		var args, _results;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['until'];
		case 1:
			return function (fn) {
				return methods['until'](args[0], fn);
			};
		default:
			_results = [];
			while (!(typeof args[0] === "function" ? args[0]() : void 0)) {
				_results.push(typeof args[1] === "function" ? args[1]() : void 0);
			}
			return _results;
		}
	},
	'switch': function (input) {
		var arg, args, _i, _len, _ref;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['switch'];
		default:
			_ref = _.rest(args, 1);
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				arg = _ref[_i];
				if (arg[0] === input) {
					return arg[1]();
				}
			}
		}
	},
	'call': function () {
		var args, func;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['call'];
		default:
			func = _.last(args);
			if (typeof func === 'function') {
				return func.apply(this, _.initial(args));
			}
		}
	},
	'compose': function () {
		var args, func, funcs, val, _i, _len;
		args = _.toArray(arguments);
		switch (args.length) {
		case 0:
			return methods['compose'];
		default:
			val = _.last(args);
			funcs = _.initial(_.rest(args, 1));
			funcs.reverse();
			for (_i = 0, _len = funcs.length; _i < _len; _i++) {
				func = funcs[_i];
				val = func(val);
			}
			return val;
		}
	}
};

setupMethods = function (LIB, one, two, three) {
	var methodName, _fn, _fn1, _i, _j, _k, _len, _len1, _len2, _results;
	_fn = function (name) {
		return methods[name] = function () {
			var args;
			args = _.toArray(arguments);
			switch (args.length) {
			case 0:
				return methods[name];
			case 1:
				return function () {
					return LIB[name].apply(this, _.union([args[0]], _.toArray(arguments)));
				};
			case 2:
				return function () {
					return LIB[name].apply(this, _.union([args[0], args[1]], _.toArray(arguments)));
				};
			default:
				return LIB[name].apply(this, args);
			}
		};
	};
	for (_i = 0, _len = three.length; _i < _len; _i++) {
		methodName = three[_i];
		_fn(methodName);
	}
	_fn1 = function (name) {
		return methods[name] = function () {
			var args;
			args = _.toArray(arguments);
			switch (args.length) {
			case 0:
				return methods[name];
			case 1:
				return function () {
					return LIB[name].apply(this, _.union([args[0]], _.toArray(arguments)));
				};
			default:
				return LIB[name].apply(this, args);
			}
		};
	};
	for (_j = 0, _len1 = two.length; _j < _len1; _j++) {
		methodName = two[_j];
		_fn1(methodName);
	}
	_results = [];
	for (_k = 0, _len2 = one.length; _k < _len2; _k++) {
		methodName = one[_k];
		_results.push((function (name) {
			return methods[name] = function () {
				var args;
				args = _.toArray(arguments);
				switch (args.length) {
				case 0:
					return methods[name];
				default:
					return LIB[name].apply(this, args);
				}
			};
		})(methodName));
	}
	return _results;
};

setupMethods(_, ['uniq', 'first', 'initial', 'last', 'rest', 'flatten', 'object', 'shuffle', 'toArray', 'size', 'compact', 'union', 'intersection', 'zip', 'range', 'bindAll', 'memoize', 'defer', 'once', 'compose', 'keys', 'values', 'invert', 'pairs', 'functions', 'clone', 'isEmpty', 'isElement', 'isArray', 'isObject', 'isArguments', 'isFunction', 'isString', 'isNumber', 'isFinite', 'isBoolean', 'isDate', 'isRegExp', 'isNaN', 'isNull', 'isUndefined', 'identity', 'random', 'escape', 'unescape'], ['each', 'map', 'find', 'filter', 'reject', 'every', 'some', 'max', 'min', 'sortBy', 'where', 'contains', 'pluck', 'groupBy', 'countBy', 'without', 'difference', 'invoke', 'indexOf', 'lastIndexOf', 'sortedIndex', 'bind', 'delay', 'throttle', 'debounce', 'after', 'wrap', 'extend', 'pick', 'omit', 'defaults', 'tap', 'has', 'isEqual', 'times', 'result', 'template'], ['reduce', 'reduceRight']);

setupMethods(_.str, ['numberFormat', 'capitalize', 'clean', 'chars', 'swapCase', 'isBlank', 'lines', 'reverse', 'succ', 'titleize', 'camelize', 'classify', 'underscored', 'dasherize', 'humanize', 'trim', 'ltrim', 'rtrim', 'words', 'toNumber', 'stripTags', 'toSentence', 'toSentenceSerial', 'quote', 'slugify'], ['levenshtein', 'chop', 'include', 'count', 'insert', 'join', 'startsWith', 'endsWith', 'truncate', 'prune', 'sprintf', 'pad', 'lpad', 'rpad', 'lrpad', 'strRight', 'strRightBack', 'strLeft', 'strLeftBack', 'repeat', 'surround'], ['splice']);

funkyjs = function () {
	var args;
	args = _.toArray(arguments);
	if (typeof args[0] === 'string' && methods.hasOwnProperty(args[0])) {
		return methods[args[0]].apply(this, _.rest(args, 1));
	} else if (typeof args[0] === 'function') {
		if (args.length > 1) {
			return function () {
				return args[0].apply(this, _.rest(args, 1));
			};
		} else {
			return function () {
				return args[0].apply(this, _.toArray(arguments));
			};
		}
	} else {
		return function () {
			return args[0];
		};
	}
};

root = this;

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = funkyjs;
	}
	exports.funkyjs = funkyjs;
} else {
	root.funkyjs = funkyjs;
}

var nthArg = _.curry(function (n, fn) {
	return function () {
		return fn(arguments[n]);
	};
});

module.exports = {
	nthArg: nthArg,
	fst: nthArg(0),
	snd: nthArg(1),
	thd: nthArg(2)
};

// (Any) => Any
var _ = function (x) {
	return x
}
_.pair = function (key, val) {
	var o = {}
	o[key] = val
	return o
}
_.contains = function (obj, key) {
	for (var k in obj) {
		if (k === key) {
			return true
		}
	}
	return false
}
_.some = function (obj, predicate) {
	predicate = predicate || function () {
		return true
	}
	for (var k in obj) {
		if (predicate(obj[k], k)) {
			return true
		}
	}
	return false
}
_.every = function (obj, predicate) {
	for (var k in obj) {
		if (!predicate(obj[k], k)) {
			return false
		}
	}
	return true
}

_.first = function (obj) {
	for (var k in obj) {
		return _.pair(k, obj[k])
	}
}

_.key = function (obj) {
	for (var k in obj) {
		return k
	}
}

_.value = function (obj) {
	for (var k in obj) {
		return obj[k]
	}
}
_.count = function (obj, predicate) {
	if (typeof predicate !== 'function') {
		return Object.keys(obj).length
	}
	var c = 0
	for (var k in obj) {
		if (predicate(obj[k])) {
			c++
		}
	}
	return c
}
_.filter = function (obj, predicate) {
	var o = {}
	for (var k in obj) {
		if (predicate(obj[k])) {
			o[k] = obj[k]
		}
	}
	return o
}
_.forEach = function (obj, iterator) {
	for (var k in obj) {
		iterator(obj[k], k)
	}
	return obj
}
_.map = function (obj, fn) {
	var o = {}
	for (var k in obj) {
		o[k] = fn(obj[k], k)
	}
	return o
}
_.reduce = function (obj, fn, seed) {
	var val = seed || {}
	for (var k in obj) {
		val = fn(val, obj[k], k)
	}
	return val
}
_.concat = function (objA, objB) {
	for (var k in objB) {
		objA[k] = objB[k]
	}
	return objA
}

_.flatMap = function (obj, fn) {
	return _.reduce(obj, function (arr, val, key) {
		return arr.concat(fn(val, key))
	}, [])
}
_.eq = function (a, b) {
	return a === b
}
_.assert = function (fn, expect, val) {
	if (typeof fn !== 'function') {
		val = expect
		expect = fn
		fn = _.eq
	}
	if (val === undefined) {
		return function (val) {
			return _.assert(fn, expect, val)
		}
	}
	if (!fn(expect, val)) {
		throw new Error('Assertion error', expect, val)
	}
}
_.not = function (a) {
	return !a
}
_.and = function (a, b) {
	return a && b
}
_.or = function (a, b) {
	return a || b
}
_.xor = function (a, b) {
	return (a || b) && !(a && b)
}
_.select = function (data, projection) {
	if (typeof data !== 'object') {
		throw new TypeError('missing required parameter `data`')
	}
	if (typeof projection !== 'object') {
		throw new TypeError('missing required parameter `projection`')
	}
	if (Array.isArray(projection)) {
		return _.select(data, projection.reduce(function (out, val) {
			if (typeof val === 'object') {
				_.concat(out, val)
			} else {
				out[val] = true
			}
			return out
		}, {}))
	}
	return _.reduce(projection, function (out, val, key) {
		if (typeof val === 'string') {
			out[val] = data[key]
		} else {
			out[key] = data[key]
		}
		return out
	})

}

/*
Underscore Query - A lightweight query API for JavaScript collections
(c)2012 - Dave Tonge
May be freely distributed according to MIT license.

This is small library that provides a query api for JavaScript arrays similar to *mongo db*.
The aim of the project is to provide a simple, well tested, way of filtering data in JavaScript.
*/

(function () {
	var QueryBuilder, addToQuery, buildQuery, createUtils, expose, findOne, key, makeTest, parseGetter, parseParamType, parseQuery, parseSubQuery, performQuery, performQuerySingle, root, runQuery, single, testModelAttribute, testQueryValue, utils, _i, _len, _ref,
		__indexOf = [].indexOf || function (item) {
			for (var i = 0, l = this.length; i < l; i++) {
				if (i in this && this[i] === item) return i;
			}
			return -1;
		},
		__hasProp = {}.hasOwnProperty;

	root = this;

	/* UTILS*/

	utils = {};

	createUtils = function (_) {
		var key, _i, _len, _ref;
		_ref = ["every", "some", "filter", "detect", "reject", "reduce", "intersection", "isEqual", "keys", "isArray", "result", "groupBy", "map", "each"];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			key = _ref[_i];
			utils[key] = _[key];
			if (!utils[key]) {
				throw new Error("Please ensure that you first initialize      underscore-query with either lodash or underscore");
			}
		}
	};

	utils.getType = function (obj) {
		var type;
		type = Object.prototype.toString.call(obj).substr(8);
		return type.substr(0, type.length - 1);
	};

	utils.makeObj = function (key, val) {
		var o;
		(o = {})[key] = val;
		return o;
	};

	utils.reverseString = function (str) {
		return str.toLowerCase().split("").reverse().join("");
	};

	utils.compoundKeys = ["$and", "$not", "$or", "$nor"];

	utils.makeGetter = function (keys) {
		keys = keys.split(".");
		return function (obj) {
			var key, out, _i, _len;
			out = obj;
			for (_i = 0, _len = keys.length; _i < _len; _i++) {
				key = keys[_i];
				if (out) {
					out = utils.result(out, key);
				}
			}
			return out;
		};
	};

	parseParamType = function (query) {
		var key, o, paramType, queryParam, type, value;
		key = utils.keys(query)[0];
		queryParam = query[key];
		o = {
			key: key
		};
		if (key.indexOf(".") !== -1) {
			o.getter = utils.makeGetter(key);
		}
		paramType = utils.getType(queryParam);
		switch (paramType) {
		case "RegExp":
		case "Date":
			o.type = "$" + (paramType.toLowerCase());
			o.value = queryParam;
			break;
		case "Object":
			if (__indexOf.call(utils.compoundKeys, key) >= 0) {
				o.type = key;
				o.value = parseSubQuery(queryParam);
				o.key = null;
			} else {
				for (type in queryParam) {
					if (!__hasProp.call(queryParam, type)) continue;
					value = queryParam[type];
					if (testQueryValue(type, value)) {
						o.type = type;
						switch (type) {
						case "$elemMatch":
							o.value = single(parseQuery(value));
							break;
						case "$endsWith":
							o.value = utils.reverseString(value);
							break;
						case "$likeI":
						case "$startsWith":
							o.value = value.toLowerCase();
							break;
						case "$computed":
							o = parseParamType(utils.makeObj(key, value));
							o.getter = utils.makeGetter(key);
							break;
						default:
							o.value = value;
						}
					} else {
						throw new Error("Query value (" + value + ") doesn't match query type: (" + type + ")");
					}
				}
			}
			break;
		default:
			o.type = "$equal";
			o.value = queryParam;
		}
		if ((o.type === "$equal") && (paramType === "Object" || paramType === "Array")) {
			o.type = "$deepEqual";
		}
		return o;
	};

	parseSubQuery = function (rawQuery) {
		var key, query, queryArray, val, _i, _len, _results;
		if (utils.isArray(rawQuery)) {
			queryArray = rawQuery;
		} else {
			queryArray = (function () {
				var _results;
				_results = [];
				for (key in rawQuery) {
					if (!__hasProp.call(rawQuery, key)) continue;
					val = rawQuery[key];
					_results.push(utils.makeObj(key, val));
				}
				return _results;
			})();
		}
		_results = [];
		for (_i = 0, _len = queryArray.length; _i < _len; _i++) {
			query = queryArray[_i];
			_results.push(parseParamType(query));
		}
		return _results;
	};

	testQueryValue = function (queryType, value) {
		var valueType;
		valueType = utils.getType(value);
		switch (queryType) {
		case "$in":
		case "$nin":
		case "$all":
		case "$any":
			return valueType === "Array";
		case "$size":
			return valueType === "Number";
		case "$regex":
		case "$regexp":
			return valueType === "RegExp";
		case "$like":
		case "$likeI":
			return valueType === "String";
		case "$between":
		case "$mod":
			return (valueType === "Array") && (value.length === 2);
		case "$cb":
			return valueType === "Function";
		default:
			return true;
		}
	};

	testModelAttribute = function (queryType, value) {
		var valueType;
		valueType = utils.getType(value);
		switch (queryType) {
		case "$like":
		case "$likeI":
		case "$regex":
		case "$startsWith":
		case "$endsWith":
			return valueType === "String";
		case "$contains":
		case "$all":
		case "$any":
		case "$elemMatch":
			return valueType === "Array";
		case "$size":
			return valueType === "String" || valueType === "Array";
		case "$in":
		case "$nin":
			return value != null;
		default:
			return true;
		}
	};

	performQuery = function (type, value, attr, model, getter) {
		switch (type) {
		case "$equal":
			if (utils.isArray(attr)) {
				return __indexOf.call(attr, value) >= 0;
			} else {
				return attr === value;
			}
			break;
		case "$deepEqual":
			return utils.isEqual(attr, value);
		case "$contains":
			return __indexOf.call(attr, value) >= 0;
		case "$ne":
			return attr !== value;
		case "$lt":
			return attr < value;
		case "$gt":
			return attr > value;
		case "$lte":
			return attr <= value;
		case "$gte":
			return attr >= value;
		case "$between":
			return (value[0] < attr && attr < value[1]);
		case "$betweene":
			return (value[0] <= attr && attr <= value[1]);
		case "$in":
			return __indexOf.call(value, attr) >= 0;
		case "$nin":
			return __indexOf.call(value, attr) < 0;
		case "$all":
			return utils.every(value, function (item) {
				return __indexOf.call(attr, item) >= 0;
			});
		case "$any":
			return utils.some(attr, function (item) {
				return __indexOf.call(value, item) >= 0;
			});
		case "$size":
			return attr.length === value;
		case "$exists":
		case "$has":
			return (attr != null) === value;
		case "$like":
			return attr.indexOf(value) !== -1;
		case "$likeI":
			return attr.toLowerCase().indexOf(value) !== -1;
		case "$startsWith":
			return attr.toLowerCase().indexOf(value) === 0;
		case "$endsWith":
			return utils.reverseString(attr).indexOf(value) === 0;
		case "$type":
			return typeof attr === value;
		case "$regex":
		case "$regexp":
			return value.test(attr);
		case "$cb":
			return value.call(model, attr);
		case "$mod":
			return (attr % value[0]) === value[1];
		case "$elemMatch":
			return runQuery(attr, value, null, true);
		case "$and":
		case "$or":
		case "$nor":
		case "$not":
			return performQuerySingle(type, value, getter, model);
		default:
			return false;
		}
	};

	single = function (queries, getter) {
		var method;
		if (utils.getType(getter) === "String") {
			method = getter;
			getter = function (obj, key) {
				return obj[method](key);
			};
		}
		return function (model) {
			var queryObj, _i, _len;
			for (_i = 0, _len = queries.length; _i < _len; _i++) {
				queryObj = queries[_i];
				if (!performQuerySingle(queryObj.type, queryObj.parsedQuery, getter, model)) {
					return false;
				}
			}
			return true;
		};
	};

	performQuerySingle = function (type, query, getter, model) {
		var attr, passes, q, test, _i, _len;
		passes = 0;
		for (_i = 0, _len = query.length; _i < _len; _i++) {
			q = query[_i];
			if (q.getter) {
				attr = q.getter(model, q.key);
			} else if (getter) {
				attr = getter(model, q.key);
			} else {
				attr = model[q.key];
			}
			test = testModelAttribute(q.type, attr);
			if (test) {
				test = performQuery(q.type, q.value, attr, model, getter);
			}
			if (test) {
				passes++;
			}
			switch (type) {
			case "$and":
				if (!test) {
					return false;
				}
				break;
			case "$not":
				if (test) {
					return false;
				}
				break;
			case "$or":
				if (test) {
					return true;
				}
				break;
			case "$nor":
				if (test) {
					return false;
				}
				break;
			default:
				throw new Error("Invalid compound method");
				throw new Error("Invalid compound method");
			}
		}
		if (type === "$not") {
			return passes === 0;
		} else {
			return type !== "$or";
		}
	};

	parseQuery = function (query) {
		var compoundQuery, key, queryKeys, type, val;
		queryKeys = utils.keys(query);
		if (!queryKeys.length) {
			return [];
		}
		compoundQuery = utils.intersection(utils.compoundKeys, queryKeys);
		if (compoundQuery.length === 0) {
			return [
				{
					type: "$and",
					parsedQuery: parseSubQuery(query)
				}
			];
		} else {
			if (compoundQuery.length !== queryKeys.length) {
				if (__indexOf.call(compoundQuery, "$and") < 0) {
					query.$and = {};
					compoundQuery.unshift("$and");
				}
				for (key in query) {
					if (!__hasProp.call(query, key)) continue;
					val = query[key];
					if (!(__indexOf.call(utils.compoundKeys, key) < 0)) {
						continue;
					}
					query.$and[key] = val;
					delete query[key];
				}
			}
			return (function () {
				var _i, _len, _results;
				_results = [];
				for (_i = 0, _len = compoundQuery.length; _i < _len; _i++) {
					type = compoundQuery[_i];
					_results.push({
						type: type,
						parsedQuery: parseSubQuery(query[type])
					});
				}
				return _results;
			})();
		}
	};

	parseGetter = function (getter) {
		var method;
		if (utils.getType(getter) === "String") {
			method = getter;
			getter = function (obj, key) {
				return obj[method](key);
			};
		}
		return getter;
	};

	QueryBuilder = (function () {
		function QueryBuilder(items, _getter) {
			this.items = items;
			this._getter = _getter;
			this.theQuery = {};
		}

		QueryBuilder.prototype.indexQueries = function () {
			var index, key, queries, query, type, _ref;
			_ref = this.theQuery;
			for (type in _ref) {
				if (!__hasProp.call(_ref, type)) continue;
				queries = _ref[type];
				index = 0;
				while (index < queries.length) {
					query = queries[index];
					key = utils.keys(query)[0];
					if ((key in this.indexes) && (type === "$and") && (utils.getType(query[key]) === "String")) {
						this._indexQueries[key] = query[key];
						queries.splice(index, 1);
					} else {
						index++;
					}
				}
				if (!queries.length) {
					delete this.theQuery[type];
				}
			}
			return this._indexQueries;
		};

		QueryBuilder.prototype.getIndexedItems = function (items) {
			var indexQueries, key, val, _ref, _ref1;
			indexQueries = this.indexQueries();
			for (key in indexQueries) {
				if (!__hasProp.call(indexQueries, key)) continue;
				val = indexQueries[key];
				if (this.indexKeys.length > 1) {
					items = utils.intersection(items, (_ref = this.indexes[key][val]) != null ? _ref : []);
				} else {
					items = (_ref1 = this.indexes[key][val]) != null ? _ref1 : [];
				}
			}
			return items;
		};

		QueryBuilder.prototype.all = function (items, first) {
			if (items) {
				this.items = items;
			}
			if (this.indexes) {
				items = this.getIndexedItems(this.items);
			} else {
				items = this.items;
			}
			return runQuery(items, this.theQuery, this._getter, first);
		};

		QueryBuilder.prototype.chain = function () {
			return _.chain(this.all.apply(this, arguments));
		};

		QueryBuilder.prototype.clone = function () {
			var cloned;
			cloned = new QueryBuilder(this.items, this._getter);
			if (this.indexes) {
				cloned._indexQueries = {};
				cloned.indexes = this.indexes;
				cloned.indexKeys = this.indexKeys;
			}
			return cloned;
		};

		QueryBuilder.prototype.tester = function () {
			return makeTest(this.theQuery, this._getter);
		};

		QueryBuilder.prototype.first = function (items) {
			return this.all(items, true);
		};

		QueryBuilder.prototype.getter = function (_getter) {
			this._getter = _getter;
			return this;
		};

		QueryBuilder.prototype.index = function (name, fn) {
			if (!this.items) {
				throw new Error("Index should only be called after items have been added.");
			}
			if (fn == null) {
				fn = name;
			}
			if (this.indexes == null) {
				this.indexes = {};
			}
			if (this.indexKeys == null) {
				this.indexKeys = [];
			}
			if (this._indexQueries == null) {
				this._indexQueries = {};
			}
			if (__indexOf.call(this.indexKeys, name) < 0) {
				this.indexKeys.push(name);
			}
			this.indexes[name] = utils.groupBy(this.items, fn);
			return this;
		};

		return QueryBuilder;

	})();

	addToQuery = function (type) {
		return function (params, qVal) {
			var _base;
			if (qVal) {
				params = utils.makeObj(params, qVal);
			}
			if ((_base = this.theQuery)[type] == null) {
				_base[type] = [];
			}
			this.theQuery[type].push(params);
			return this;
		};
	};

	_ref = utils.compoundKeys;
	for (_i = 0, _len = _ref.length; _i < _len; _i++) {
		key = _ref[_i];
		QueryBuilder.prototype[key.substr(1)] = addToQuery(key);
	}

	QueryBuilder.prototype.find = QueryBuilder.prototype.query = QueryBuilder.prototype.run = QueryBuilder.prototype.all;

	buildQuery = function (items, getter) {
		return new QueryBuilder(items, getter);
	};

	makeTest = function (query, getter) {
		return single(parseQuery(query), parseGetter(getter));
	};

	findOne = function (items, query, getter) {
		return runQuery(items, query, getter, true);
	};

	runQuery = function (items, query, getter, first) {
		var fn;
		if (arguments.length < 2) {
			return buildQuery.apply(this, arguments);
		}
		if (getter) {
			getter = parseGetter(getter);
		}
		if (!(utils.getType(query) === "Function")) {
			query = single(parseQuery(query), getter);
		}
		fn = first ? utils.detect : utils.filter;
		return fn(items, query);
	};

	runQuery.build = buildQuery;

	runQuery.parse = parseQuery;

	runQuery.findOne = runQuery.first = findOne;

	runQuery.tester = runQuery.testWith = makeTest;

	runQuery.getter = runQuery.pluckWith = utils.makeGetter;

	expose = function (_, mixin) {
		if (mixin == null) {
			mixin = true;
		}
		createUtils(_);
		if (mixin) {
			_.mixin({
				query: runQuery,
				q: runQuery
			});
		}
		return runQuery;
	};

	if (root._) {
		return expose(root._);
	}

	if (exports && (typeof module !== "undefined" && module !== null ? module.exports : void 0)) {
		return module.exports = expose;
	}

	return expose;

}).call(this);
