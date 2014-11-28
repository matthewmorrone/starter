
var args = [].slice.call(arguments, 0);

/**
 * (Sort of) fixes JavaScript's built-in Array.prototype.sort method.
 *
 * Numbers come first, then strings. Other stuff (e.g., objects) doesn't make
 * sense to sort w/o passing a function, so you get undefined behavior.
 *
 * @example
 * [1, 10, 5].sort();  // => [1, 5, 10]
 * ['b', 'a'].sort();  // => ['a', 'b']
 * [1, '2', 3].sort(); // => [1, 3, '2']
 * ['b', 1, '3', 'a', 2].sort(); // => [1, 2, '3', 'a', 'b']
 *
 * // Make sure custom comparisons still work
 *
 * [{ foo: 2 }, { foo: 1 }].sort(function(x, y) {
 *   return x.foo - y.foo;
 * });
 * // => [{ foo: 1 }, { foo: 2 }]
 *
 * [1, 2, 3].sort(function(x, y) { return y - x; });
 * // => [3, 2, 1]
 */
(function (proto) {
	var original = proto.sort;

	function baseCompare(x, y) {
		if (x == y) {
			return 0;
		}
		return x > y ? 1 : -1;
	}

	function defaultCompareFunction(x, y) {
		var flags = (typeof x == 'number' ? 1 : 0) + (typeof y == 'number' ? 2 : 0);
		switch (flags) {
		case 0:
			return baseCompare(x, y);
		case 1:
			return -1;
		case 2:
			return 1;
		case 3:
			return x - y;
		}
	}
	proto.sort = function sort(compareFunction) {
		return original.call(this, compareFunction || defaultCompareFunction);
	};
}(Array.prototype));
}(Array.prototype));

if (!slice) {
	// function slice (arr, i) {return Array.prototype.slice.call(arr, i)}
	var slice = Array.prototype.slice.call;
}

Array.combine = function (keys, values) {
	var new_array = {},
		keycount = keys && keys.length,
		i = 0;
	if (typeof keys !== 'object' || typeof values !== 'object' || typeof keycount !== 'number' || typeof values.length !== 'number' || !keycount) {
		return false;
	}
	if (keycount != values.length) {
		return false;
	}
	for (i = 0; i < keycount; i++) {
		new_array[keys[i]] = values[i];
	}
	return new_array;
}
Array.fill = function (start_index, num, mixed_val) {
	var key, tmp_arr = {};
	if (!isNaN(start_index) && !isNaN(num)) {
		for (key = 0; key < num; key++) {
			tmp_arr[(key + start_index)] = mixed_val;
		}
	}
	return tmp_arr;
}
Array.fill_keys = function (keys, value) {
	var retObj = {},
		key = '';
	for (key in keys) {
		retObj[keys[key]] = value;
	}
	return retObj;
}
Array.range = function (low, high, step) {
	var matrix = [];
	var inival, endval, plus;
	var walker = step || 1;
	var chars = false;
	if (!isNaN(low) && !isNaN(high)) {
		inival = low;
		endval = high;
	} else if (isNaN(low) && isNaN(high)) {
		chars = true;
		inival = low.charCodeAt(0);
		endval = high.charCodeAt(0);
	} else {
		inival = (isNaN(low) ? 0 : low);
		endval = (isNaN(high) ? 0 : high);
	}
	plus = ((inival > endval) ? false : true);
	if (plus) {
		while (inival <= endval) {
			matrix.push(((chars) ? String.fromCharCode(inival) : inival));
			inival += walker;
		}
	} else {
		while (inival >= endval) {
			matrix.push(((chars) ? String.fromCharCode(inival) : inival));
			inival -= walker;
		}
	}
	return matrix;
}
Array.merge_recursive = function (arr1, arr2) {
	var idx = '';
	if (arr1 && Object.prototype.toString.call(arr1) === '[object Array]' && arr2 && Object.prototype.toString.call(arr2) === '[object Array]') {
		for (idx in arr2) {
			arr1.push(arr2[idx]);
		}
	} else if ((arr1 && (arr1 instanceof Object)) && (arr2 && (arr2 instanceof Object))) {
		for (idx in arr2) {
			if (idx in arr1) {
				if (typeof arr1[idx] === 'object' && typeof arr2 === 'object') {
					arr1[idx] = this.array_merge(arr1[idx], arr2[idx]);
				} else {
					arr1[idx] = arr2[idx];
				}
			} else {
				arr1[idx] = arr2[idx];
			}
		}
	}
	return arr1;
}
Array.memcpy = function (src, srcOffset, dst, dstOffset, length) {
	var i;
	src = src.subarray || src.slice ? src : src.buffer;
	dst = dst.subarray || dst.slice ? dst : dst.buffer;
	src = srcOffset ? src.subarray ? src.subarray(srcOffset, length && srcOffset + length) : src.slice(srcOffset, length && srcOffset + length) : src;
	if (dst.set) {
		dst.set(src, dstOffset);
	} else {
		for (i = 0; i < src.length; i++) {
			dst[i + dstOffset] = src[i];
		}
	}
	return dst;
}

function argmerge(a, b) {
	var result = [];
	for (var i = 0, len = Math.max(a.length, b.length); i < len; i++) {
		result[i] = (b[i] == Function._) ? a[i] || Function._ : (b[i] !== undefined && b[i]) || a[i];
	}
	return result;
};

Array.prototype.first = function () {
	return this[0];
}
Array.prototype.rest = function (n) {
	return this.slice(n || 1, this.length);
}
Array.prototype.drop = function (n) {
	return this.slice(0, this.length - (n || 1));
}
Array.prototype.tail = function (n) {
	return this.slice((n || 0), this.length);
}
Array.prototype.head = function (n) {
	return this.slice(0, (n || this.length));
}
Array.prototype.part = function (n) {
	if (this.length % n != 0) {
		throw Error("The length of this array is not a multiple of " + n);
	}
	var result = [];
	var ary = this;
	while (ary.length > 0) {
		var sub = ary.head(n);
		result.push(sub);
		ary = ary.tail(n);
	}
	return result;
}
Array.prototype.asFn = function () {
	var self = this;
	return function (idx) {
		return self[idx];
	};
}
Array.prototype.hash = function () {
	var result = {};
	this.each(function (kv) {
		result[kv[0]] = kv[1];
	});
	return result;
}
Array.prototype.foreach = function (handler) {
	var arr = this;
	var k, it, pair;
	if (arr && typeof arr === 'object' && arr.change_key_case) {
		return arr.foreach(handler);
	}
	if (typeof this.Iterator !== 'undefined') {
		var it = this.Iterator(arr);
		if (handler.length === 1) {
			for (pair in it) {
				handler(pair[1]);
			}
		} else {
			for (pair in it) {
				handler(pair[0], pair[1]);
			}
		}
	} else if (handler.length === 1) {
		for (k in arr) {
			if (arr.hasOwnProperty(k)) {
				handler(arr[k]);
			}
		}
	} else {
		for (k in arr) {
			if (arr.hasOwnProperty(k)) {
				handler(k, arr[k]);
			}
		}
	}
}
Array.prototype.all = function (callbackfn, thisArg) {
	var T, k;
	if (this == null) {
		throw new TypeError('this is null or not defined');
	}
	var O = Object(this);
	var len = O.length >>> 0;
	if (typeof callbackfn !== 'function') {
		throw new TypeError();
	}
	if (arguments.length > 1) {
		T = thisArg;
	}
	k = 0;
	while (k < len) {
		var kValue;
		if (k in O) {
			kValue = O[k];
			var testResult = callbackfn.call(T, kValue, k, O);
			if (!testResult) {
				return false;
			}
		}
		k++;
	}
	return true;
}
Array.prototype.any = function (fun /*, thisArg*/ ) {
	if (this == null) {
		throw new TypeError('Array.prototype.some called on null or undefined');
	}
	if (typeof fun !== 'function') {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++) {
		if (i in t && fun.call(thisArg, t[i], i, t)) {
			return true;
		}
	}
	return false;
}
Array.prototype.append = function (el) {
	this.push(el);
	return this.length
}
Array.prototype.arsort = function (sort_flags) {
	var inputArr = this,
		valArr = [],
		valArrLen = 0,
		k, i, ret, sorter, that = this,
		strictForIn = false,
		populateArr = {};
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(b, a);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return (a - b);
		};
		break;
	case 'SORT_REGULAR':
	default:
		sorter = function (b, a) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push([k, inputArr[k]]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function (a, b) {
		return sorter(a[1], b[1]);
	});
	for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
		populateArr[valArr[i][0]] = valArr[i][1];
	}
	return strictForIn || populateArr;
}
Array.prototype.asFn = function () {
	var self = this;
	return function (idx) {
		return self[idx];
	};
},
Array.prototype.asort = function (sort_flags) {
	var inputArr = this,
		valArr = [],
		valArrLen = 0,
		k, i, ret, sorter, that = this,
		strictForIn = false,
		populateArr = {};
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(a, b);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return (a - b);
		};
		break;
	case 'SORT_REGULAR':
	default:
		sorter = function (a, b) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push([k, inputArr[k]]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function (a, b) {
		return sorter(a[1], b[1]);
	});
	for (i = 0, valArrLen = valArr.length; i < valArrLen; i++) {
		populateArr[valArr[i][0]] = valArr[i][1];
	}
	return strictForIn || populateArr;
}
Array.prototype.ave = function () {
	return this.sum() / this.length;
}
Array.prototype.average = function () {
	return this.sum() / this.length;
}
Array.prototype.change_key_case = function (cs) {
	var array = this,
		case_fn, key, tmp_ar = {};
	if (Object.prototype.toString.call(array) === '[object Array]') {
		return array;
	}
	if (array && typeof array === 'object' && array.change_key_case) {
		return array.change_key_case(cs);
	}
	if (array && typeof array === 'object') {
		case_fn = (!cs || cs === 'CASE_LOWER') ? 'toLowerCase' : 'toUpperCase';
		for (key in array) {
			tmp_ar[key[case_fn]()] = array[key];
		}
		return tmp_ar;
	}
	return false;
}
Array.prototype.chunk = function (n) {
	var a = this;
	var len = a.length,
		out = [],
		i = 0;
	while (i < len) {
		var size = Math.ceil((len - i) / n--);
		out.push(a.slice(i, i += size));
	}
	return out;
}
Array.prototype.chunk = function (s) {
	for (var x, i = 0, c = -1, l = this.length, n = []; i < l; i++) {
		(x = i % s) ? n[c][x] = this[i] : n[++c] = [this[i]];
	}
	return n;
}
Array.prototype.chunk = function (size, preserve_keys) {
	var input = this,
		x, p = '',
		i = 0,
		c = -1,
		l = input.length || 0,
		n = [];
	if (size < 1) {
		return null;
	}
	if (Object.prototype.toString.call(input) === '[object Array]') {
		if (preserve_keys) {
			while (i < l) {
				(x = i % size) ? n[c][i] = input[i] : n[++c] = {}, n[c][i] = input[i];
				i++;
			}
		} else {
			while (i < l) {
				(x = i % size) ? n[c][x] = input[i] : n[++c] = [input[i]];
				i++;
			}
		}
	} else {
		if (preserve_keys) {
			for (p in input) {
				if (input.hasOwnProperty(p)) {
					(x = i % size) ? n[c][p] = input[p] : n[++c] = {}, n[c][p] = input[p];
					i++;
				}
			}
		} else {
			for (p in input) {
				if (input.hasOwnProperty(p)) {
					(x = i % size) ? n[c][x] = input[p] : n[++c] = [input[p]];
					i++;
				}
			}
		}
	}
	return n;
}
Array.prototype.circ = function (i) {
	var arr = this;
	if (i === undefined || i === null) {
		return arr[0];
	}
	return (i % arr.length + arr.length) % arr.length;
}
Array.prototype.clear = function () {
	this.length = 0;
	return this;
};
Array.prototype.clear = function () {
	this.length = 0;
}
Array.prototype.clone = function () {
	return [].concat(this);
};
Array.prototype.combine = function (arr) {
	return Array.prototype.push.apply(this, arr);
}
Array.prototype.combine = function (b) {
	var a = this;
	var len = a.length;
	for (var i = 0; i < len; i = i + 5000) {
		b.unshift.apply(b, a.slice(i, i + 5000));
	}
}
Array.prototype.compact = function () {
	return this.filter(function (element) {
		return (element !== null && element !== undefined)
	});
}
Array.prototype.compare = function (b) {
	var a = this;
	if (a.length !== b.length) {
		return false;
	}
	for (var i = 0; i < a.length; ++i) {
		if (!equals(a[i], b[i])) {
			return false;
		}
	}
	return true;
}
Array.prototype.compareArrays = function (arr) {
	var i;
	if (this.length !== arr.length) {
		return false;
	}
	for (i = 0; i < arr.length; i++) {
		if (this[i].compareArrays) {
			if (!this[i].compareArrays(arr[i])) {
				return false;
			} else {
				continue;
			}
		}
		if (this[i] !== arr[i]) {
			return false;
		}
	}
	return true;
};
Array.prototype.concat = function (arr) {
	return Array.prototype.push.apply(this, arr);
}
Array.prototype.cons = function (x) {
	var a = this;
	var l = a.length;
	var b = new Array(l + 1);
	b[0] = x;
	for (var i = 0; i < l; ++i) {
		b[i + 1] = a[i];
	}
	return b;
}
Array.prototype.cons = function (x, a) {
	var a = this;
	var l = a.length;
	var b = new Array(l + 1);
	b[0] = x;
	for (var i = 0; i < l; ++i) {
		b[i + 1] = a[i];
	}
	return b;
}
Array.prototype.contains = function (el) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == el) {
			return true
		}
	}
	return false
}
Array.prototype.count = function () {
	return this.length;
};
Array.prototype.count_values = function () {
	var array = this,
		tmp_arr = {},
		key = '',
		t = '';
	var __getType = function (obj) {
		var t = typeof obj;
		t = t.toLowerCase();
		if (t === 'object') {
			t = 'array';
		}
		return t;
	};
	var __countValue = function (value) {
		switch (typeof value) {
		case 'number':
			if (Math.floor(value) !== value) {
				return;
			}
		case 'string':
			if (value in this && this.hasOwnProperty(value)) {
				++this[value];
			} else {
				this[value] = 1;
			}
		}
	};
	t = __getType(array);
	if (t === 'array') {
		for (key in array) {
			if (array.hasOwnProperty(key)) {
				__countValue.call(tmp_arr, array[key]);
			}
		}
	}
	return tmp_arr;
}
Array.prototype.delete = function (i) {
	this.splice(i, 1);
}
Array.prototype.delete_if = function (block) {
	return this.replace(this.reject(block));
};
Array.prototype.delete_range = function (start, length) {
	var new_ary, size;
	size = this.__size__();
	if (start > size || start < 0) {
		return null;
	}
	if (size < (start + length)) {
		new_ary = new R.Array([]);
	} else {
		new_ary = this.slice(0, start).concat(this.slice(start + length, size) || []);
	} if (new_ary.__size__() !== this.__size__()) {
		return this.replace(new_ary);
	}
};
Array.prototype.detect = function (fn, context) {
	var length = this.length;
	var out = null;
	for (var i = 0; i < length; i++) {
		if (fn.call(context, this[i], i, this)) {
			out = this[i];
			break;
		}
	}
	return out;
}
Array.prototype.dev = function () {
	var mean = comp_ave(this);
	var dev = 0;
	for (i in this) {
		this[i] = (this[i] - mean);
	}
	for (i in this) {
		this[i] = (this[i] * this[i]);
	}
	for (i in this) {
		dev += this[i];
	}
	dev /= (this.length - 1);
	dev = Math.sqrt(dev);
	return dev;
}
Array.prototype.diff = function (c, m) {
	var d = [],
		e = -1,
		h, i, j, k, x;
	for (i = c.length, k = this.length; i--;) {
		for (j = k; j && (h = c[i] !== this[--j]);) {}
		x = h && (d[++e] = m ? i : c[i]);
	}
	return d;
};
Array.prototype.diff = function () {
	var arr1 = this,
		retArr = {},
		argl = arguments.length,
		k1 = '',
		i = 1,
		k = '',
		arr = {};
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1]) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.diff = function (c, m) {
	var d = [],
		e = -1,
		h, i, j, k;
	for (i = c.length, k = this.length; i--;) {
		for (j = k; j && (h = c[i] !== this[--j]););
		h && (d[++e] = m ? i : c[i]);
	}
	return d;
}
Array.prototype.diff_assoc = function () {
	var arr1 = this,
		retArr = {},
		argl = arguments.length,
		k1 = '',
		i = 1,
		k = '',
		arr = {};
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1] && k === k1) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.diff_key = function () {
	var arr1 = this,
		argl = arguments.length,
		retArr = {},
		k1 = '',
		i = 1,
		k = '',
		arr = {};
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (k === k1) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.diff_uassoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		cb = arguments[arglm1],
		arr = {},
		i = 1,
		k1 = '',
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.diff_ukey = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		cb = arguments[arglm1],
		arr = {},
		i = 1,
		k1 = '',
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb(k, k1) === 0) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.difference = function () {
	var arr = this;
	var arrs = slice(arr.concat(arguments), 1),
		result = arr.unique().filter(function (needle) {
			return !arrs.some(function (haystack) {
				return haystack.contains(needle);
			});
		});
	return result;
}
Array.prototype.drop = function (n) {
	if (!n) {
		throw new TypeError();
	}
	return this.slice(n);
}
Array.prototype.drop = function (n) {
	return this.slice(0, this.length - (n || 1));
},
Array.prototype.each = Array.forEach
Array.prototype.each = function (action, index) {
	for (var i = 0, l = this.length; i < l; ++i) {
		action(this[i], index);
	}
}
Array.prototype.each = function (f) {
	for (var i = 0,
		var len = this.length; i < len; i++) {
		f && f.call(this, this[i], i);
	}
};
Array.prototype.empty = function () {
	var arr = this;
	return arr.length === 0;
};
Array.prototype.empty = function () {
	this.length = 0;
}
Array.prototype.every = function (fun) {
	var len = this.length,
		thisp = arguments[1],
		i;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this && !fun.call(thisp, this[i], i, this)) {
			return false;
		}
	}
	return true;
};
Array.prototype.every = function (callbackfn, thisArg) {
	var T, k;
	if (this == null) {
		throw new TypeError('this is null or not defined');
	}
	var O = Object(this);
	var len = O.length >>> 0;
	if (typeof callbackfn !== 'function') {
		throw new TypeError();
	}
	if (arguments.length > 1) {
		T = thisArg;
	}
	k = 0;
	while (k < len) {
		var kValue;
		if (k in O) {
			kValue = O[k];
			var testResult = callbackfn.call(T, kValue, k, O);
			if (!testResult) {
				return false;
			}
		}
		k++;
	}
	return true;
}
Array.prototype.fetch = function (idx, default_or_block) {
	var arr = this;
	var len, orig;
	idx = __int(idx);
	len = arr.length;
	orig = idx;
	if (idx < 0) {
		idx = idx + len;
	}
	if (idx < 0 || idx >= len) {
		if ((default_or_block != null ? default_or_block.call : void 0) != null) {
			return default_or_block(orig);
		}
		if (default_or_block !== void 0) {
			return default_or_block;
		}
		_err.throw_index();
	}
	return arr[idx];
};
Array.prototype.fill = function () {
	var arr = this;
	var args, arr, block, e, fill, i, left, obj, one, right, size, total, two, v;
	arr = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	if (args.length === 0) {
		_err.throw_argument();
	}
	block = __extract_block(args);
	if (block) {
		if (args.length >= 3) {
			_err.throw_argument();
		}
		one = args[0];
		two = args[1];
	} else {
		if (args.length > 3) {
			_err.throw_argument();
		}
		obj = args[0];
		one = args[1];
		two = args[2];
	}
	size = arr.length;
	if ((one != null ? one.is_range : void 0) != null) {
		_err.throw_not_implemented();
	} else if (one !== void 0 && one !== null) {
		left = __int(one);
		if (left < 0) {
			left = left + size;
		}
		if (left < 0) {
			left = 0;
		}
		if (two !== void 0 && two !== null) {
			try {
				right = __int(two);
			} catch (_error) {
				e = _error;
				_err.throw_argument("second argument must be a Fixnum");
			}
			if (right === 0) {
				return arr;
			}
			right = right + left;
		} else {
			right = size;
		}
	} else {
		left = 0;
		right = size;
	}
	total = right;
	if (right > size) {
		fill = _arr.__native_array_with__(right - size, null);
		arr.push.apply(arr, fill);
		total = right;
	}
	i = left;
	if (block) {
		while (total > i) {
			v = block(i);
			arr[i] = v === void 0 ? null : v;
			i += 1;
		}
	} else {
		while (total > i) {
			arr[i] = obj;
			i += 1;
		}
	}
	return arr;
};
Array.prototype.filter = function (fun) {
	var len = this.length,
		res = [],
		thisp = arguments[1],
		i, val;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this) {
			val = this[i];
			if (fun.call(thisp, val, i, this)) {
				res.push(val);
			}
		}
	}
	return res;
};
Array.prototype.filter = function (func) {
	var arr = this,
		retObj = {},
		k;
	func = func || function (v) {
		return v;
	};
	if (Object.prototype.toString.call(arr) === '[object Array]') {
		retObj = [];
	}
	for (k in arr) {
		if (func(arr[k])) {
			retObj[k] = arr[k];
		}
	}
	return retObj;
}
Array.prototype.find = function (func) {
	for (var i = 0, l = this.length; i < l; ++i) {
		var item = this[i];
		if (func(item)) {
			return item;
		}
	}
	return null;
}
Array.prototype.first = function () {
	return this[0];
};
Array.prototype.first = function () {
	return this[0];
},
Array.prototype.first = function (n) {
	var arr = this;
	if (n != null) {
		if (n < 0) {
			_err.throw_argument();
		}
		return arr.slice(0, n);
	} else {
		return arr[0];
	}
};
Array.prototype.flatten = function () {
	var arr = this;
	for (var i = arr.length; i--;) {
		0 in arr[i] && Array.splice.apply(arr, [i, 1].concat(Array.flatten(arr[i])));
	}
	return arr;
}
Array.prototype.flatten = function (level) {
	var arr = this;
	level = level == null ? -1 : level;
	return arr.flattenTo([], level);
}
Array.prototype.flattenTo = function (result, level) {
	var arr = this;
	if (arr == null) {
		return result;
	} else if (level === 0) {
		result.append(arr);
		return result;
	}
	var value, i = -1,
		len = arr.length;
	while (++i < len) {
		value = arr[i];
		if (isArray(value)) {
			value.flattenTo(result, level - 1);
		} else {
			result.push(value);
		}
	}
	return result;
}
Array.prototype.flip = function () {
	var trans = this,
		key, tmp_ar = {};
	if (trans && typeof trans === 'object' && trans.change_key_case) {
		return trans.flip();
	}
	for (key in trans) {
		if (!trans.hasOwnProperty(key)) {
			continue;
		}
		tmp_ar[trans[key]] = key;
	}
	return tmp_ar;
}
Array.prototype.fold = Array.reduce
Array.prototype.foldl = function (fnc, start) {
	var a = start,
		i;
	for (i = 0; i < this.length; i++) {
		a = fnc(this[i], a);
	}
	return a;
};
Array.prototype.foldr = Array.reduceRight
Array.prototype.foldr = function (fnc, start) {
	var a = start,
		i;
	for (i = this.length - 1; i > -1; i--) {
		a = fnc(this[i], a);
	}
	return a;
};
Array.prototype.forEach = function (fnc) {
	var len = this.length,
		thisp = arguments[1],
		i;
	if (typeof fnc !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this) {
			fnc.call(thisp, this[i], i, this);
		}
	}
};
Array.prototype.forEach = function (action, index) {
	for (var i = 0, l = this.length; i < l; ++i) {
		action(this[i], index);
	}
}
Array.prototype.foreach = function (action, index) {
	for (var i = 0, l = this.length; i < l; ++i) {
		action(this[i], index);
	}
}
Array.prototype.get = function (i) {
	return this[i];
}
Array.prototype.getRand = function () {
	return this[Math.floor(Math.random() * this.length)];
}
Array.prototype.group = function (fn, context) {
	if (typeof fn !== "function") {
		throw new TypeError();
	}
	return this.reduce(function (grouped, elem, index, arr) {
		var key = fn.call(context, elem, index, arr);
		if (!grouped[key]) {
			grouped[key] = [];
		}
		grouped[key].push(elem);
		return grouped;
	}, {});
}
Array.prototype.groupBy = function (categorize, thisObj) {
	var arr = this;
	if (categorize) {
		categorize = makeIterator(categorize, thisObj);
	} else {
		categorize = identity;
	}
	var buckets = {};
	forEach(arr, function (element) {
		var bucket = categorize(element);
		if (!(bucket in buckets)) {
			buckets[bucket] = [];
		}
		buckets[bucket].push(element);
	});
	return buckets;
}
Array.prototype.hash = function () {
	var result = $H();
	this.each(function (kv) {
		result[kv[0]] = kv[1];
	});
	return result;
}
Array.prototype.head = function () {
	return this[0];
}
Array.prototype.head = function (n) {
	return this.slice(0, (n || this.length));
},
Array.prototype.implode = function (glue) {
	var pieces = this;
	var i = '',
		retVal = '',
		tGlue = '';
	if (arguments.length === 1) {
		pieces = glue;
		glue = '';
	}
	if (typeof pieces === 'object') {
		if (Object.prototype.toString.call(pieces) === '[object Array]') {
			return pieces.join(glue);
		}
		for (i in pieces) {
			retVal += tGlue + pieces[i];
			tGlue = glue;
		}
		return retVal;
	}
	return pieces;
}
Array.prototype.in = function (needle, argStrict) {
	var haystack = this;
	var key = '',
		strict = !!argStrict;
	if (strict) {
		for (key in haystack) {
			if (haystack[key] === needle) {
				return true;
			}
		}
	} else {
		for (key in haystack) {
			if (haystack[key] == needle) {
				return true;
			}
		}
	}
	return false;
}
Array.prototype.inArray = function (val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === val) {
			return true
		}
	}
	return false
}
Array.prototype.index = function (i) {
	var arr = this;
	return arr[circ(arr, i)];
}
Array.prototype.indexesOf = function (elt) {
	var a = [],
		from, i;
	from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0) {
		from += this.length;
	}
	for (i = from; i < this.length; i++) {
		if (typeof (elt) === 'object' && elt.constructor === RegExp) {
			if (elt.test(this[i])) {
				a.push(i);
			}
		} else if (this[i] === elt) {
			a.push(i);
		}
	}
	return a;
};
Array.prototype.indexOf = function (elt) {
	var len = this.length,
		from = Number(arguments[1]) || 0;
	from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	if (from < 0) {
		from += len;
	}
	for (; from < len; from++) {
		if (from in this && this[from] === elt) {
			return from;
		}
	}
	return -1;
};
Array.prototype.indexOf = function (item) {
	var length = this.length;
	for (var i = 0; i < length; i++)
		if (this[i] === item) return i;
	return -1;
}
Array.prototype.intArrayToString = function () {
	var a = '',
		i;
	for (i = 0; i < this.length; i++) {
		if (typeof this[i] !== "number") {
			throw new Error("Array must be all numbers");
		} else if (this[i] < 0) {
			throw new Error("Numbers must be 0 and up");
		}
		a += String.fromCharCode(this[i]);
	}
	return a;
};
Array.prototype.intersect = function () {
	var a, a1, a2, n, l, l2, i, j;
	if (!arguments.length) {
		return [];
	}
	a1 = this;
	a = a2 = null;
	n = 0;
	while (n < arguments.length) {
		a = [];
		a2 = arguments[n];
		l = a1.length;
		l2 = a2.length;
		for (i = 0; i < l; i++) {
			for (j = 0; j < l2; j++) {
				if (a1[i] === a2[j]) {
					a.push(a1[i]);
				}
			}
		}
		a1 = a;
		n++;
	}
	return a;
};
Array.prototype.intersect = function () {
	var arr1 = this,
		retArr = {},
		argl = arguments.length,
		arglm1 = argl - 1,
		k1 = '',
		arr = {},
		i = 0,
		k = '';
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1]) {
					if (i === arglm1) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.intersect_assoc = function () {
	var arr1 = this,
		retArr = {},
		argl = arguments.length,
		arglm1 = argl - 1,
		k1 = '',
		arr = {},
		i = 0,
		k = '';
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1] && k === k1) {
					if (i === arglm1) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.intersect_key = function () {
	var arr1 = this,
		retArr = {},
		argl = arguments.length,
		arglm1 = argl - 1,
		k1 = '',
		arr = {},
		i = 0,
		k = '';
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < argl; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (k === k1) {
					if (i === arglm1) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.intersect_uassoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 1,
		cb = arguments[arglm1],
		k1 = '',
		i = 1,
		arr = {},
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (arr[k] === arr1[k1] && cb(k, k1) === 0) {
					if (i === arglm2) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.intersect_ukey = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 1,
		cb = arguments[arglm1],
		k1 = '',
		i = 1,
		arr = {},
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb(k, k1) === 0) {
					if (i === arglm2) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.intersection = function () {
	var arrs = slice(arguments, 1),
		result = filter(arr.unique(), function (needle) {
			return arrs.every(function (haystack) {
				return haystack.contains(needle);
			});
		});
	return result;
}
Array.prototype.intersectSorted = function () {
	var a, a1, a2, n, l, l2, i, j;
	if (!arguments.length) {
		return [];
	}
	a1 = this;
	a2 = null;
	var k = a1.length;
	var d = new Date();
	n = 0;
	while (n < arguments.length) {
		a2 = arguments[n];
		l2 = a2.length;
		for (i = 0; i < l2; i++) {
			a1[k] = a2[i];
			k++;
		}
		n++;
	}
	a1 = mergeSort(a1);
	a = new Array();
	l = a1.length;
	for (i = 0; i < l; i++) {
		if (a1[i] === a1[i + 1]) {
			a.push(a1[i]);
		}
	}

	function mergeSort(array) {
		var length = array.length;
		if (length <= 1) {
			return array;
		}
		var left = new Array();
		var right = new Array();
		var mi = (array.length) % 2;
		if (mi == 0) {
			mi = (array.length) / 2;
		} else {
			mi = (array.length - 1) / 2;
		}
		for (var i = 0; i < mi; i++) {
			left[i] = array[i];
		}
		var j = 0;
		for (var i = mi; i < array.length; i++) {
			right[j] = array[i];
			j++;
		}
		j = 0;
		left = mergeSort(left);
		right = mergeSort(right);
		var result = new Array();
		result = merge(left, right);
		return result;
	}

	function merge(left, right) {
		var llength = left.length;
		var rlength = right.length;
		var result = new Array();
		var i = 0;
		var k = 0;
		var j = 0;
		var m = 0;
		while (llength > 0 || rlength > 0) {
			if (llength > 0 && rlength > 0) {
				if (left[j] <= right[m]) {
					result[k] = left[j];
					k++j++llength--;
				} else {
					result[k] = right[m];
					k++;
					m++;
					rlength--;
				}
			} else if (llength > 0) {
				var q = result.length;
				for (var i = j; i < left.length; i++) {
					result[q] = left[i];
					q++;
				}
				break;
			} else if (rlength > 0) {
				var q = result.length;
				for (var i = m; i < right.length; i++) {
					result[q] = right[i];
					q++;
				}
				break;
			}
		}
		return result;
	}
	return a;
};
Array.prototype.iter = function (fn, args) {
	for (var i = 0,
		var len = this.length; i < len; i++) {
		fn.apply(this[i], args);
	}
}
Array.prototype.join = function (glue) {
	return this.implode(glue);
}
Array.prototype.keep_if = function (block) {
	var arr = this;
	var ary, el, idx, len;
	if (block == null) {
		return __enumerate(_arr.keep_if, [arr]);
	}
	block = Block.splat_arguments(block);
	ary = [];
	idx = -1;
	len = arr.length;
	while (++idx < len) {
		el = arr[idx];
		if (!__falsey(block(el))) {
			ary.push(el);
		}
	}
	return ary;
};
Array.prototype.key_exists = function (key) {
	var search = this;
	if (!search || (search.constructor !== Array && search.constructor !== Object)) {
		return false;
	}
	return key in search;
}
Array.prototype.keys = function (search_value, argStrict) {
	var input = this,
		search = typeof search_value !== 'undefined',
		tmp_arr = [],
		strict = !!argStrict,
		include = true,
		key = '';
	if (input && typeof input === 'object' && input.change_key_case) {
		return input.keys(search_value, argStrict);
	}
	for (key in input) {
		if (input.hasOwnProperty(key)) {
			include = true;
			if (search) {
				if (strict && input[key] !== search_value) {
					include = false;
				} else if (input[key] != search_value) {
					include = false;
				}
			}
			if (include) {
				tmp_arr[tmp_arr.length] = key;
			}
		}
	}
	return tmp_arr;
}
Array.prototype.krsort = function (sort_flags) {
	var inputArr = this,
		tmp_arr = {},
		keys = [],
		sorter, i, k, that = this,
		strictForIn = false,
		populateArr = {};
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(b, a);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return (b - a);
		};
		break;
	case 'SORT_REGULAR':
	default:
		sorter = function (b, a) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			keys.push(k);
		}
	}
	keys.sort(sorter);
	populateArr = strictForIn ? inputArr : populateArr;
	for (i = 0; i < keys.length; i++) {
		k = keys[i];
		tmp_arr[k] = inputArr[k];
		if (strictForIn) {
			delete inputArr[k];
		}
	}
	for (i in tmp_arr) {
		if (tmp_arr.hasOwnProperty(i)) {
			populateArr[i] = tmp_arr[i];
		}
	}
	return strictForIn || populateArr;
}
Array.prototype.ksort = function (sort_flags) {
	var inputArr = this,
		tmp_arr = {},
		keys = [],
		sorter, i, k, that = this,
		strictForIn = false,
		populateArr = {};
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(a, b);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return ((a + 0) - (b + 0));
		};
		break;
	default:
		sorter = function (a, b) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			keys.push(k);
		}
	}
	keys.sort(sorter);
	populateArr = strictForIn ? inputArr : populateArr;
	for (i = 0; i < keys.length; i++) {
		k = keys[i];
		tmp_arr[k] = inputArr[k];
		if (strictForIn) {
			delete inputArr[k];
		}
	}
	for (i in tmp_arr) {
		if (tmp_arr.hasOwnProperty(i)) {
			populateArr[i] = tmp_arr[i];
		}
	}
	return strictForIn || populateArr;
}
Array.prototype.last = function () {
	return this[this.length - 1];
};
Array.prototype.last = function (n) {
	var arr = this;
	var len;
	len = arr.length;
	if (n === void 0) {
		return arr[len - 1];
	}
	if (len === 0 || n === 0) {
		return [];
	}
	if (n < 0) {
		_err.throw_argument("count must be positive");
	}
	if (n > len) {
		n = len;
	}
	return arr.slice(-n);
};
Array.prototype.lastIndexOf = function (elt) {
	var len = this.length,
		from = Number(arguments[1]);
	if (isNaN(from)) {
		from = len - 1;
	} else {
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) {
			from += len;
		} else if (from >= len) {
			from = len - 1;
		}
	}
	for (; from > -1; from--) {
		if (from in this && this[from] === elt) {
			return from;
		}
	}
	return -1;
};
Array.prototype.lastIndexOf = function (n) {
	var i = this.length;
	while (i--) {
		if (this[i] === n) {
			return i
		}
	}
	return -1
}
Array.prototype.list = function () {
	var i = 0,
		arr = [];
	arr = arguments[arguments.length - 1];
	if (arr && typeof arr === 'object' && arr.change_key_case) {
		return arr.list.apply(arr, Array.prototype.slice.call(arguments, 0, -1));
	}
	if (arr && typeof arr === 'object' && arr.length && !arr.propertyIsEnumerable('length')) {
		for (i = 0; i < arr.length; i++) {
			this.window[arguments[i]] = arr[i];
		}
	} else {
		for (i in arr) {
			if (i.length === parseInt(i).toString().length && parseInt(i) < arguments.length - 1) {
				this.window[arguments[i]] = arr[i];
			}
		}
	}
	return arr;
}
Array.prototype.loop = function (callback) {
	var arr = this;
	for (i = 0; i < arr.length; i++) {
		callback.call(arr, arr[i], i);
	}
}
Array.prototype.map = function (fnc) {
	var len = this.length,
		res = [],
		thisp = arguments[1],
		i;
	if (typeof fnc !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this) {
			res[i] = fnc.call(thisp, this[i], i, this);
		}
	}
	return res;
};
Array.prototype.map = function (callback) {
	var argc = arguments.length,
		argv = arguments,
		glbl = this.window,
		obj = null,
		cb = callback,
		j = argv[1].length,
		i = 0,
		k = 1,
		m = 0,
		tmp = [],
		tmp_ar = [];
	while (i < j) {
		while (k < argc) {
			tmp[m++] = argv[k++][i];
		}
		m = 0;
		k = 1;
		if (callback) {
			if (typeof callback === 'string') {
				cb = glbl[callback];
			} else if (typeof callback === 'object' && callback.length) {
				obj = typeof callback[0] === 'string' ? glbl[callback[0]] : callback[0];
				if (typeof obj === 'undefined') {
					throw 'Object not found: ' + callback[0];
				}
				cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1];
			}
			tmp_ar[i++] = cb.apply(obj, tmp);
		} else {
			tmp_ar[i++] = tmp;
		}
		tmp = [];
	}
	return tmp_ar;
}
Array.prototype.map = function (f) {
	var a = this;
	var b = new Array(a.length);
	for (var i = 0; i < a.length; ++i) {
		b[i] = f(a[i]);
	}
	return b;
}
Array.prototype.map = function (f) {
	var a = this;
	var b = new Array(a.length);
	for (var i = 0; i < a.length; ++i) {
		b[i] = f(a[i]);
	}
	return b;
}
Array.prototype.matchApply = function (v) {
	return Array.indexOf(arguments[1], v, 1);
}
Array.prototype.matchCall = function (v) {
	return Array.indexOf(arguments, v, 1) - 1;
}
Array.prototype.max = function () {
	return Math.max.apply({}, this);
};
Array.prototype.max = function () {
	return Math.max.apply(Math, this);
}
Array.prototype.mean = function () {
	for (var i = 0, sum = 0; i < this.length; sum += this[i++]) {}
	return sum / this.length;
};
Array.prototype.mean = function () {
	return this.sum() / this.length;
}
Array.prototype.merge = function () {
	var args = Array.prototype.slice.call(arguments),
		argl = args.length,
		arg, retObj = {},
		k = '',
		argil = 0,
		j = 0,
		i = 0,
		ct = 0,
		toStr = Object.prototype.toString,
		retArr = true;
	for (i = 0; i < argl; i++) {
		if (toStr.call(args[i]) !== '[object Array]') {
			retArr = false;
			break;
		}
	}
	if (retArr) {
		retArr = [];
		for (i = 0; i < argl; i++) {
			retArr = retArr.concat(args[i]);
		}
		return retArr;
	}
	for (i = 0, ct = 0; i < argl; i++) {
		arg = args[i];
		if (toStr.call(arg) === '[object Array]') {
			for (j = 0, argil = arg.length; j < argil; j++) {
				retObj[ct++] = arg[j];
			}
		} else {
			for (k in arg) {
				if (arg.hasOwnProperty(k)) {
					if (parseInt(k, 10) + '' === k) {
						retObj[ct++] = arg[k];
					} else {
						retObj[k] = arg[k];
					}
				}
			}
		}
	}
	return retObj;
}
Array.prototype.min = function () {
	return Math.min.apply({}, this);
};
Array.prototype.min = function () {
	return Math.min.apply(Math, this);
}
Array.prototype.minus = function (other) {
	var arr = this;
	var ary, el, idx, len;
	other = __arr(other);
	ary = [];
	idx = -1;
	len = arr.length;
	while (++idx < len) {
		el = arr[idx];
		if (!_arr.include(other, el)) {
			ary.push(el);
		}
	}
	return ary;
};
Array.prototype.move = function (oldIndex, newIndex) {
	var array = this;
	if (newIndex >= array.length) {
		var k = newIndex - array.length;
		while ((k--) + 1) {
			array.push(undefined);
		}
	}
	array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
	return array;
}
Array.prototype.multiply = function (multiplier) {
	var arr = this;
	var ary, idx, total;
	if (multiplier === null) {
		_err.throw_type();
	}
	if (__isStr(multiplier)) {
		return _arr.join(arr, __str(multiplier));
	} else {
		multiplier = __int(multiplier);
		if (multiplier < 0) {
			_err.throw_argument("count cannot be negative");
		}
		total = arr.length;
		if (total === 0) {
			return [];
		} else if (total === 1) {
			return arr.slice(0);
		}
		ary = [];
		idx = -1;
		while (++idx < multiplier) {
			ary = ary.concat(arr);
		}
		return ary;
	}
};
Array.prototype.multisort = function () {
	var arr = this;
	var g, i, j, k, l, sal, vkey, elIndex, lastSorts, tmpArray, zlast;
	var sortFlag = [0];
	var thingsToSort = [];
	var nLastSort = [];
	var lastSort = [];
	var args = arguments;
	var flags = {
		'SORT_REGULAR': 16,
		'SORT_NUMERIC': 17,
		'SORT_STRING': 18,
		'SORT_ASC': 32,
		'SORT_DESC': 40
	};
	var sortDuplicator = function (a, b) {
		return nLastSort.shift();
	};
	var sortFunctions = [[

		function (a, b) {
			lastSort.push(a > b ? 1 : (a < b ? -1 : 0));
			return a > b ? 1 : (a < b ? -1 : 0);
		},
		function (a, b) {
			lastSort.push(b > a ? 1 : (b < a ? -1 : 0));
			return b > a ? 1 : (b < a ? -1 : 0);
		}], [

		function (a, b) {
			lastSort.push(a - b);
			return a - b;
		},
		function (a, b) {
			lastSort.push(b - a);
			return b - a;
		}], [

		function (a, b) {
			lastSort.push((a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0));
			return (a + '') > (b + '') ? 1 : ((a + '') < (b + '') ? -1 : 0);
		},
		function (a, b) {
			lastSort.push((b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0));
			return (b + '') > (a + '') ? 1 : ((b + '') < (a + '') ? -1 : 0);
		}]];
	var sortArrs = [[]];
	var sortKeys = [[]];
	if (Object.prototype.toString.call(arr) === '[object Array]') {
		sortArrs[0] = arr;
	} else if (arr && typeof arr === 'object') {
		for (i in arr) {
			if (arr.hasOwnProperty(i)) {
				sortKeys[0].push(i);
				sortArrs[0].push(arr[i]);
			}
		}
	} else {
		return false;
	}
	var arrMainLength = sortArrs[0].length;
	var sortComponents = [0, arrMainLength];
	var argl = arguments.length;
	for (j = 1; j < argl; j++) {
		if (Object.prototype.toString.call(arguments[j]) === '[object Array]') {
			sortArrs[j] = arguments[j];
			sortFlag[j] = 0;
			if (arguments[j].length !== arrMainLength) {
				return false;
			}
		} else if (arguments[j] && typeof arguments[j] === 'object') {
			sortKeys[j] = [];
			sortArrs[j] = [];
			sortFlag[j] = 0;
			for (i in arguments[j]) {
				if (arguments[j].hasOwnProperty(i)) {
					sortKeys[j].push(i);
					sortArrs[j].push(arguments[j][i]);
				}
			}
			if (sortArrs[j].length !== arrMainLength) {
				return false;
			}
		} else if (typeof arguments[j] === 'string') {
			var lFlag = sortFlag.pop();
			if (typeof flags[arguments[j]] === 'undefined' || ((((flags[arguments[j]]) >>> 4) & (lFlag >>> 4)) > 0)) {
				return false;
			}
			sortFlag.push(lFlag + flags[arguments[j]]);
		} else {
			return false;
		}
	}
	for (i = 0; i !== arrMainLength; i++) {
		thingsToSort.push(true);
	}
	for (i in sortArrs) {
		if (sortArrs.hasOwnProperty(i)) {
			lastSorts = [];
			tmpArray = [];
			elIndex = 0;
			nLastSort = [];
			lastSort = [];
			if (sortComponents.length === 0) {
				if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
					args[i] = sortArrs[i];
				} else {
					for (k in arguments[i]) {
						if (arguments[i].hasOwnProperty(k)) {
							delete arguments[i][k];
						}
					}
					sal = sortArrs[i].length;
					for (j = 0, vkey = 0; j < sal; j++) {
						vkey = sortKeys[i][j];
						args[i][vkey] = sortArrs[i][j];
					}
				}
				delete sortArrs[i];
				delete sortKeys[i];
				continue;
			}
			var sFunction = sortFunctions[(sortFlag[i] & 3)][((sortFlag[i] & 8) > 0) ? 1 : 0];
			for (l = 0; l !== sortComponents.length; l += 2) {
				tmpArray = sortArrs[i].slice(sortComponents[l], sortComponents[l + 1] + 1);
				tmpArray.sort(sFunction);
				lastSorts[l] = [].concat(lastSort);
				elIndex = sortComponents[l];
				for (g in tmpArray) {
					if (tmpArray.hasOwnProperty(g)) {
						sortArrs[i][elIndex] = tmpArray[g];
						elIndex++;
					}
				}
			}
			sFunction = sortDuplicator;
			for (j in sortArrs) {
				if (sortArrs.hasOwnProperty(j)) {
					if (sortArrs[j] === sortArrs[i]) {
						continue;
					}
					for (l = 0; l !== sortComponents.length; l += 2) {
						tmpArray = sortArrs[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
						nLastSort = [].concat(lastSorts[l]);
						tmpArray.sort(sFunction);
						elIndex = sortComponents[l];
						for (g in tmpArray) {
							if (tmpArray.hasOwnProperty(g)) {
								sortArrs[j][elIndex] = tmpArray[g];
								elIndex++;
							}
						}
					}
				}
			}
			for (j in sortKeys) {
				if (sortKeys.hasOwnProperty(j)) {
					for (l = 0; l !== sortComponents.length; l += 2) {
						tmpArray = sortKeys[j].slice(sortComponents[l], sortComponents[l + 1] + 1);
						nLastSort = [].concat(lastSorts[l]);
						tmpArray.sort(sFunction);
						elIndex = sortComponents[l];
						for (g in tmpArray) {
							if (tmpArray.hasOwnProperty(g)) {
								sortKeys[j][elIndex] = tmpArray[g];
								elIndex++;
							}
						}
					}
				}
			}
			zlast = null;
			sortComponents = [];
			for (j in sortArrs[i]) {
				if (sortArrs[i].hasOwnProperty(j)) {
					if (!thingsToSort[j]) {
						if ((sortComponents.length & 1)) {
							sortComponents.push(j - 1);
						}
						zlast = null;
						continue;
					}
					if (!(sortComponents.length & 1)) {
						if (zlast !== null) {
							if (sortArrs[i][j] === zlast) {
								sortComponents.push(j - 1);
							} else {
								thingsToSort[j] = false;
							}
						}
						zlast = sortArrs[i][j];
					} else {
						if (sortArrs[i][j] !== zlast) {
							sortComponents.push(j - 1);
							zlast = sortArrs[i][j];
						}
					}
				}
			}
			if (sortComponents.length & 1) {
				sortComponents.push(j);
			}
			if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
				args[i] = sortArrs[i];
			} else {
				for (j in arguments[i]) {
					if (arguments[i].hasOwnProperty(j)) {
						delete arguments[i][j];
					}
				}
				sal = sortArrs[i].length;
				for (j = 0, vkey = 0; j < sal; j++) {
					vkey = sortKeys[i][j];
					args[i][vkey] = sortArrs[i][j];
				}
			}
			delete sortArrs[i];
			delete sortKeys[i];
		}
	}
	return true;
}
Array.prototype.natcasesort = function () {
	var inputArr = this,
		valArr = [],
		k, i, ret, that = this,
		strictForIn = false,
		populateArr = {};
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push([k, inputArr[k]]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function (a, b) {
		return that.strnatcasecmp(a[1], b[1]);
	});
	for (i = 0; i < valArr.length; i++) {
		populateArr[valArr[i][0]] = valArr[i][1];
	}
	return strictForIn || populateArr;
}
Array.prototype.natsort = function () {
	var inputArr = this,
		valArr = [],
		k, i, ret, that = this,
		strictForIn = false,
		populateArr = {};
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push([k, inputArr[k]]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function (a, b) {
		return that.strnatcmp(a[1], b[1]);
	});
	for (i = 0; i < valArr.length; i++) {
		populateArr[valArr[i][0]] = valArr[i][1];
	}
	return strictForIn || populateArr;
}
Array.prototype.none = function (fun) {
	var len = this.length,
		thisp = arguments[1],
		i;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this && fun.call(thisp, this[i], i, this)) {
			return false;
		}
	}
	return true;
};
Array.prototype.nrsort = function (d) {
	var d = -1;
	return this.sort(function (a, b) {
		if (isNaN(a - b)) {
			return (isNaN(a) ? 1 : -1) * d;
		}
		return (a - b) * d;
	});
	return this;
}
Array.prototype.nsort = function () {
	var d = 1;
	return this.sort(function (a, b) {
		if (isNaN(a - b)) {
			return (isNaN(a) ? 1 : -1) * d;
		}
		return (a - b) * d;
	});
	return this;
}
Array.prototype.numSort = function () {
	this.sort(function (a, b) {
		return a - b;
	});
	return this;
}
Array.prototype.orderedGroup = function (propOrFunc) {
	var arr = this;
	if (!propOrFunc) {
		throw new Error('You must specific a property name or mappable function.');
	}
	var getGroupKey = typeof propOrFunc === 'function' ? propOrFunc : function (item) {
		return item[propOrFunc];
	};
	var results = [];
	var dict = {};
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		var key = getGroupKey(arr[i]);
		if (!(key in dict)) {
			dict[key] = [];
			results.push({
				key: key,
				items: dict[key]
			});
		}
		dict[key].push(arr[i]);
	}
	return results;
}
Array.prototype.overlaps = function (one, two) {
	return one[0] <= two.slice(-1)[0] && two[0] <= one.slice(-1)[0];
}
Array.prototype.pad = function (pad_size, pad_value) {
	var input = this,
		pad = [],
		newArray = [],
		newLength, diff = 0,
		i = 0;
	if (Object.prototype.toString.call(input) === '[object Array]' && !isNaN(pad_size)) {
		newLength = ((pad_size < 0) ? (pad_size * -1) : pad_size);
		diff = newLength - input.length;
		if (diff > 0) {
			for (i = 0; i < diff; i++) {
				newArray[i] = pad_value;
			}
			pad = ((pad_size < 0) ? newArray.concat(input) : input.concat(newArray));
		} else {
			pad = input;
		}
	}
	return pad;
}
Array.prototype.partition = function (n) {
	if (this.length % n != 0) throw Error("The length of this array is not a multiple of " + n);
	var result = [];
	var ary = this;
	while (ary.length > 0) {
		var sub = ary.head(n);
		result.push(sub);
		ary = ary.tail(n);
	}
	return result;
},
Array.prototype.permute = function (m) {
	for (var p = -1, j, k, f, r, l = this.length, q = 1, i = l + 1; --i; q *= i);
	for (x = [new Array(l), new Array(l), new Array(l), new Array(l)], j = q, k = l + 1, i = -1; ++i < l; x[2][i] = i, x[1][i] = x[0][i] = j /= --k);
	for (r = new Array(q); ++p < q;) {
		for (r[p] = new Array(l), i = -1; ++i < l; !--x[1][i] && (x[1][i] = x[0][i], x[2][i] = (x[2][i] + 1) % l), r[p][i] = m ? x[3][i] : this[x[3][i]])
			for (x[3][i] = x[2][i], f = 0; !f; f = !f)
				for (j = i; j; x[3][--j] == x[2][i] && (x[3][i] = x[2][i] = (x[2][i] + 1) % l, f = 1));
	}
	return r;
}
Array.prototype.pickMany = function (nItems) {
	var arr = this;
	if (nItems != null) {
		var result = [];
		if (nItems > 0 && arr && arr.length) {
			nItems = nItems > arr.length ? arr.length : nItems;
			while (nItems--) {
				result.push(arr.pickOne());
			}
		}
		return result;
	}
	return (arr && arr.length) ? arr.pickOne() : void(0);
}
Array.prototype.pickOne = function () {
	var arr = this;
	var idx = Random.integer(0, arr.length - 1);
	return arr.splice(idx, 1)[0];
}
Array.prototype.pluck = function (n) {
	if (!n || typeof n !== 'string') {
		throw new TypeError();
	}
	return this.map(function (member) {
		var value
		if (member[n] !== undefined) {
			value = typeof member[n] == 'function' ? member[n]() : member[n];
		} else {
			value = undefined
		}
		return value;
	});
}
Array.prototype.plus = function (other) {
	return this.concat(other);
};
Array.prototype.pop = function () {
	var inputArr = this,
		key = '',
		lastKey = '';
	if (inputArr.hasOwnProperty('length')) {
		if (!inputArr.length) {
			return null;
		}
		return inputArr.pop();
	} else {
		for (key in inputArr) {
			if (inputArr.hasOwnProperty(key)) {
				lastKey = key;
			}
		}
		if (lastKey) {
			var tmp = inputArr[lastKey];
			delete(inputArr[lastKey]);
			return tmp;
		} else {
			return null;
		}
	}
}
Array.prototype.product = function () {
	var arr = this;
	var a, args, arr, block, block_result, outer, result, v, _j, _len1;
	arr = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	result = [];
	block = __extract_block(args);
	args = (function () {
		var _j, _len1, _results;
		_results = [];
		for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
			a = args[_j];
			_results.push(__arr(a));
		}
		return _results;
	})();
	args = args.reverse();
	args.push(arr);
	outer = _arr.inject(args, result.push, function (trigger, values) {
		return function (partial) {
			var val, _j, _len1, _results;
			_results = [];
			for (_j = 0, _len1 = values.length; _j < _len1; _j++) {
				val = values[_j];
				_results.push(trigger.call(result, partial.concat(val)));
			}
			return _results;
		};
	});
	outer([]);
	if (block) {
		block_result = arr;
		for (_j = 0, _len1 = result.length; _j < _len1; _j++) {
			v = result[_j];
			block_result.push(block(v));
		}
		return block_result;
	} else {
		return result;
	}
};
Array.prototype.product = function () {
	var input = this,
		idx = 0,
		product = 1,
		il = 0;
	if (Object.prototype.toString.call(input) !== '[object Array]') {
		return null;
	}
	il = input.length;
	while (idx < il) {
		product *= (!isNaN(input[idx]) ? input[idx] : 0);
		idx++;
	}
	return product;
}
Array.prototype.push = function () {
	var inputArr = this,
		i = 0,
		pr = '',
		argv = arguments,
		argc = argv.length,
		allDigits = /^\d$/,
		size = 0,
		highestIdx = 0,
		len = 0;
	if (inputArr.hasOwnProperty('length')) {
		for (i = 1; i < argc; i++) {
			inputArr[inputArr.length] = argv[i];
		}
		return inputArr.length;
	}
	for (pr in inputArr) {
		if (inputArr.hasOwnProperty(pr)) {
			++len;
			if (pr.search(allDigits) !== -1) {
				size = parseInt(pr, 10);
				highestIdx = size > highestIdx ? size : highestIdx;
			}
		}
	}
	for (i = 1; i < argc; i++) {
		inputArr[++highestIdx] = argv[i];
	}
	return len + i - 1;
}
Array.prototype.pushUniq = function (item) {
	return this.indexOf(item) == -1 ? this.push(item) : false
}
Array.prototype.rand = function (num_req) {
	var input = this;
	var indexes = [];
	var ticks = num_req || 1;
	var checkDuplicate = function (input, value) {
		var exist = false,
			index = 0,
			il = input.length;
		while (index < il) {
			if (input[index] === value) {
				exist = true;
				break;
			}
			index++;
		}
		return exist;
	};
	if (Object.prototype.toString.call(input) === '[object Array]' && ticks <= input.length) {
		while (true) {
			var rand = Math.floor((Math.random() * input.length));
			if (indexes.length === ticks) {
				break;
			}
			if (!checkDuplicate(indexes, rand)) {
				indexes.push(rand);
			}
		}
	} else {
		indexes = null;
	}
	return ((ticks == 1) ? indexes.join() : indexes);
}
Array.prototype.random = function () {
	return this[Math.floor((Math.random() * this.length))];
};
Array.prototype.random = function (arr) {
	var arr = this;
	var idx = Random.integer(0, arr.length - 1);
	return arr.splice(idx, 1)[0];
}
Array.prototype.randomElement = function () {
	return this[Math.floor(Math.random() * this.length)];
}
Array.prototype.range = function (from, to, step) {
	var letters = 'abcdefghijklmnopqrstuvwxyz';
	letters = letters.toUpperCase() + letters + letters.toUpperCase();
	var self, isExclusive, isReversed, isNumberRange, index, finalIndex, parts, method, tmp;
	self = [];
	if (arguments.length == 1 || typeof from == 'string' && typeof to == 'number') {
		isExclusive = from.indexOf('...') > -1;
		step = to;
		parts = from.split(/\.{2,3}/);
		from = parts[0];
		to = parts[1];
	}
	step = step || 1;
	isNumberRange = Number(from) == Number(from);
	if (isNumberRange) {
		finalIndex = Number(to) + 1e-16;
		index = Number(from);
	} else {
		index = letters.indexOf(from);
		method = (from == from.toLowerCase() && to == to.toUpperCase()) ? 'lastIndexOf' : 'indexOf';
		finalIndex = letters[method](to);
	}
	isReversed = index > finalIndex;
	if (isReversed) {
		tmp = index;
		index = finalIndex;
		finalIndex = tmp;
	}
	while (index <= finalIndex) {
		self.push(isNumberRange ? index : letters.charAt(index));
		index += step;
	}
	if (isReversed) self.reverse();
	if (isExclusive) self.pop();
	return self;
}
Array.prototype.reduce = function (fun) {
	var len = this.length,
		i = 0,
		rv;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	if (len === 0 && arguments.length === 1) {
		throw new TypeError();
	}
	if (arguments.length >= 2) {
		rv = arguments[1];
	} else {
		do {
			if (i in this) {
				rv = this[i++];
				break;
			}
			if (++i >= len) {
				throw new TypeError();
			}
		} while (true);
	}
	for (; i < len; i++) {
		if (i in this) {
			rv = fun.call(null, rv, this[i], i, this);
		}
	}
	return rv;
};
Array.prototype.reduce = function (callback) {
	var a_input = this;
	var lon = a_input.length;
	var res = 0,
		i = 0;
	var tmp = [];
	for (i = 0; i < lon; i += 2) {
		tmp[0] = a_input[i];
		if (a_input[(i + 1)]) {
			tmp[1] = a_input[(i + 1)];
		} else {
			tmp[1] = 0;
		}
		res += callback.apply(null, tmp);
		tmp = [];
	}
	return res;
}
Array.prototype.reduceRight = function (fun) {
	var len = this.length,
		i, rv;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	if (len === 0 && arguments.length === 1) {
		throw new TypeError();
	}
	i = len - 1;
	if (arguments.length >= 2) {
		rv = arguments[1];
	} else {
		do {
			if (i in this) {
				rv = this[i--];
				break;
			}
			if (--i < 0) {
				throw new TypeError();
			}
		} while (true);
	}
	for (; i >= 0; i--) {
		if (i in this) {
			rv = fun.call(null, rv, this[i], i, this);
		}
	}
	return rv;
};
Array.prototype.reject = function (fn, context) {
	if (typeof fn !== "function") {
		throw new TypeError();
	}
	return this.reduce(function (keepers, elem, index, arr) {
		if (!fn.call(context, elem, index, arr)) {
			keepers.push(elem);
		}
		return keepers;
	}, []);
}
Array.prototype.reject = function (fun) {
	var len = this.length,
		res = [],
		thisp = arguments[1],
		i, val;
	if (typeof fun !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this) {
			val = this[i];
			if (!fun.call(thisp, val, i, this)) {
				res.push(val);
			}
		}
	}
	return res;
};
Array.prototype.remove = function (elt) {
	var a = this.indexesOf(elt),
		i;
	for (i = 0; i < a.length; i++) {
		this.splice(a[i], 1);
	}
	return this;
};
Array.prototype.remove = function () {
	var arr = this,
		len = arr.length,
		o = slice(arguments),
		lastId = -1;
	for (; len--;) {
		if (~o.indexOf(arr[len])) arr.splice(lastId = len, 1);
	}
	return lastId;
}
Array.prototype.remove = function (el) {
	!!
	let (pos = this.lastIndexOf(el));
	pos != -1 && this.splice(pos, 1);
}
Array.prototype.removeDuplicated = function (s) {
	var a = this.slice(),
		p, i, j;
	if (s) {
		for (i = a.length; i > 1;) {
			if (a[--i] === a[i - 1]) {
				for (p = i - 1;
					(p--) && a[i] === a[p];) {}
				i -= a.splice(p + 1, i - p - 1).length;
			}
		}
	} else {
		for (i = a.length; i;) {
			for (p = (--i); p > 0;) {
				if (a[i] === a[--p]) {
					for (j = p; --p && a[i] === a[p];) {}
					i -= a.splice(p + 1, j - p).length;
				}
			}
		}
	}
	return a;
};
Array.prototype.replace = function () {
	var arr = this,
		retObj = {},
		i = 0,
		p = '',
		argl = arguments.length;
	if (argl < 2) {
		throw new Error('There should be at least 2 arguments passed to array_replace()');
	}
	for (p in arr) {
		retObj[p] = arr[p];
	}
	for (i = 1; i < argl; i++) {
		for (p in arguments[i]) {
			retObj[p] = arguments[i][p];
		}
	}
	return retObj;
}
Array.prototype.replace_recursive = function () {
	var arr = this,
		retObj = {},
		i = 0,
		p = '',
		argl = arguments.length;
	if (argl < 2) {
		throw new Error('There should be at least 2 arguments passed to array_replace_recursive()');
	}
	for (p in arr) {
		retObj[p] = arr[p];
	}
	for (i = 1; i < argl; i++) {
		for (p in arguments[i]) {
			if (retObj[p] && typeof retObj[p] === 'object') {
				retObj[p] = this.array_replace_recursive(retObj[p], arguments[i][p]);
			} else {
				retObj[p] = arguments[i][p];
			}
		}
	}
	return retObj;
}
Array.prototype.rest = function (n) {
	return this.slice(n || 1, this.length);
},
Array.prototype.reverse = function (preserve_keys) {
	var array = this,
		isArray = Object.prototype.toString.call(array) === '[object Array]',
		tmp_arr = preserve_keys ? {} : [],
		key;
	if (isArray && !preserve_keys) {
		return array.slice(0).reverse();
	}
	if (preserve_keys) {
		var keys = [];
		for (key in array) {
			keys.push(key);
		}
		var i = keys.length;
		while (i--) {
			key = keys[i];
			tmp_arr[key] = array[key];
		}
	} else {
		for (key in array) {
			tmp_arr.unshift(array[key]);
		}
	}
	return tmp_arr;
}
Array.prototype.reverse_each = function (block) {
	var arr = this;
	var idx;
	if (block == null) {
		return __enumerate(_arr.reverse_each, [arr]);
	}
	block = Block.splat_arguments(block);
	idx = arr.length;
	while (idx--) {
		block(arr[idx]);
	}
	return arr;
};
Array.prototype.rotate = function (cnt) {
	var arr = this;
	var idx, len, sliced;
	if (cnt === void 0) {
		cnt = 1;
	} else {
		cnt = __int(cnt);
	}
	len = arr.length;
	if (len === 1) {
		return arr;
	}
	if (len === 0) {
		return [];
	}
	idx = cnt % len;
	sliced = arr.slice(0, idx);
	return arr.slice(idx).concat(sliced);
};
Array.prototype.rotate = function (n) {
	var arr = this;
	var output = [];
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		output.push(index(arr, i + n));
	}
	return output;
}
Array.prototype.rotate = function (p) {
	for (var l = this.length, p = (Math.abs(p) >= l && (p %= l), p < 0 && (p += l), p), i, x; p; p = (Math.ceil(l / p) - 1) * p - l + (l = p)) {
		for (i = l; i > p; x = this[--i], this[i] = this[i - p], this[i - p] = x);
	}
	return this;
}
Array.prototype.rsort = function (sort_flags) {
	var inputArr = this,
		valArr = [],
		k = '',
		i = 0,
		sorter = false,
		that = this,
		strictForIn = false,
		populateArr = [];
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(b, a);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return (b - a);
		};
		break;
	case 'SORT_REGULAR':
	default:
		sorter = function (b, a) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	try {} catch (e) {}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push(inputArr[k]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(sorter);
	for (i = 0; i < valArr.length; i++) {
		populateArr[i] = valArr[i];
	}
	return strictForIn || populateArr;
}
Array.prototype.sample = function (n, range) {
	var arr = this;
	var ary, idx, len, ridx, tmp;
	if (range == null) {
		range = void 0;
	}
	len = arr.length;
	if (n === void 0) {
		return arr[__rand(len)];
	}
	n = __int(n);
	if (n < 0) {
		_err.throw_argument();
	}
	if (n > len) {
		n = len;
	}
	ary = arr.slice(0);
	idx = -1;
	while (++idx < n) {
		ridx = idx + __rand(len - idx);
		tmp = ary[idx];
		ary[idx] = ary[ridx];
		ary[ridx] = tmp;
	}
	return ary.slice(0, n);
};
Array.prototype.search = function (needle, argStrict) {
	var haystack = this;
	var strict = !!argStrict,
		key = '';
	if (haystack && typeof haystack === 'object' && haystack.change_key_case) {
		return haystack.search(needle, argStrict);
	}
	if (typeof needle === 'object' && needle.exec) {
		if (!strict) {
			var flags = 'i' + (needle.global ? 'g' : '') + (needle.multiline ? 'm' : '') + (needle.sticky ? 'y' : '');
			needle = new RegExp(needle.source, flags);
		}
		for (key in haystack) {
			if (haystack.hasOwnProperty(key)) {
				if (needle.test(haystack[key])) {
					return key;
				}
			}
		}
		return false;
	}
	for (key in haystack) {
		if (haystack.hasOwnProperty(key)) {
			if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
				return key;
			}
		}
	}
	return false;
}
Array.prototype.search = function (searchStr) {
	var returnArray = false;
	for (i = 0; i < this.length; i++) {
		if (typeof (searchStr) == 'function') {
			if (searchStr.test(this[i])) {
				if (!returnArray) {
					returnArray = [];
				}
				returnArray.push(i);
			}
		} else {
			if (this[i] === searchStr) {
				if (!returnArray) {
					returnArray = [];
				}
				returnArray.push(i);
			}
		}
	}
	return returnArray;
}
Array.prototype.shift = function () {
	var inputArr = this,
		props = false,
		shift = undefined,
		pr = '',
		allDigits = /^\d$/,
		int_ct = -1,
		_checkToUpIndices = function (arr, ct, key) {
			if (arr[ct] !== undefined) {
				var tmp = ct;
				ct += 1;
				if (ct === key) {
					ct += 1;
				}
				ct = _checkToUpIndices(arr, ct, key);
				arr[ct] = arr[tmp];
				delete arr[tmp];
			}
			return ct;
		};
	if (inputArr.length === 0) {
		return null;
	}
	if (inputArr.length > 0) {
		return inputArr.shift();
	}
}
Array.prototype.shift = function () {
	var result = this[0];
	for (var i = 1; i < this.length; i++) {
		this[i - 1] = this[i]
	}
	this.length = this.length - 1;
	return result
}
Array.prototype.shuffle = function () {
	var copy = this.slice(),
		v = [],
		i, j;
	for (i = 0; i < this.length; i++) {
		j = Math.floor((Math.random() * copy.length));
		v[i] = copy[j];
		copy.splice(j, 1);
	}
	return v;
};
Array.prototype.shuffle = function () {
	var inputArr = this,
		valArr = [],
		k = '',
		i = 0,
		strictForIn = false,
		populateArr = [];
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push(inputArr[k]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function () {
		return 0.5 - Math.random();
	});
	populateArr = strictForIn ? inputArr : populateArr;
	for (i = 0; i < valArr.length; i++) {
		populateArr[i] = valArr[i];
	}
	return strictForIn || populateArr;
}
Array.prototype.shuffle = function () {
	var i = this.length,
		j, temp;
	if (i == 0) {
		return;
	}
	while (--i) {
		j = Math.floor(Math.random() * (i + 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
}
Array.prototype.size = function () {
	return this.length;
};
Array.prototype.slice = function (offst, lgth, preserve_keys) {
	var arr = this,
		key = '';
	if (Object.prototype.toString.call(arr) !== '[object Array]' || (preserve_keys && offst !== 0)) {
		var lgt = 0,
			newAssoc = {};
		for (key in arr) {
			lgt += 1;
			newAssoc[key] = arr[key];
		}
		arr = newAssoc;
		offst = (offst < 0) ? lgt + offst : offst;
		lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;
		var assoc = {};
		var start = false,
			it = -1,
			arrlgth = 0,
			no_pk_idx = 0;
		for (key in arr) {
			++it;
			if (arrlgth >= lgth) {
				break;
			}
			if (it == offst) {
				start = true;
			}
			if (!start) {
				continue;
			}++arrlgth;
			if (this.is_int(key) && !preserve_keys) {
				assoc[no_pk_idx++] = arr[key];
			} else {
				assoc[key] = arr[key];
			}
		}
		return assoc;
	}
	if (lgth === undefined) {
		return arr.slice(offst);
	} else if (lgth >= 0) {
		return arr.slice(offst, offst + lgth);
	} else {
		return arr.slice(offst, lgth);
	}
}
Array.prototype.some = function (f) {
	var len = this.length,
		thisp = arguments[1],
		i;
	if (typeof f !== "function") {
		throw new TypeError();
	}
	for (i = 0; i < len; i++) {
		if (i in this && f.call(thisp, this[i], i, this)) {
			return true;
		}
	}
	return false;
};
Array.prototype.some = function (fun /*, thisArg*/ ) {
	if (this == null) {
		throw new TypeError('Array.prototype.some called on null or undefined');
	}
	if (typeof fun !== 'function') {
		throw new TypeError();
	}
	var t = Object(this);
	var len = t.length >>> 0;
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++) {
		if (i in t && fun.call(thisArg, t[i], i, t)) {
			return true;
		}
	}
	return false;
}
Array.prototype.sort = function () {
	var tmp;
	for (var i = 0; i < this.length; i++) {
		for (var j = 0; j < this.length; j++) {
			if (this[i] < this[j]) {
				tmp = this[i];
				this[i] = this[j];
				this[j] = tmp
			}
		}
	}
}
Array.prototype.sort = function (sort_flags) {
	var inputArr = this,
		valArr = [],
		keyArr = [],
		k = '',
		i = 0,
		sorter = false,
		that = this,
		strictForIn = false,
		populateArr = [];
	switch (sort_flags) {
	case 'SORT_STRING':
		sorter = function (a, b) {
			return that.strnatcmp(a, b);
		};
		break;
	case 'SORT_NUMERIC':
		sorter = function (a, b) {
			return (a - b);
		};
		break;
	case 'SORT_REGULAR':
	default:
		sorter = function (a, b) {
			var aFloat = parseFloat(a),
				bFloat = parseFloat(b),
				aNumeric = aFloat + '' === a,
				bNumeric = bFloat + '' === b;
			if (aNumeric && bNumeric) {
				return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
			} else if (aNumeric && !bNumeric) {
				return 1;
			} else if (!aNumeric && bNumeric) {
				return -1;
			}
			return a > b ? 1 : a < b ? -1 : 0;
		};
		break;
	}
	try {} catch (e) {}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push(inputArr[k]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(sorter);
	for (i = 0; i < valArr.length; i++) {
		populateArr[i] = valArr[i];
	}
	return strictForIn || populateArr;
}
Array.prototype.sortNum = function () {
	return this.sort(function (a, b) {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	});
};
Array.prototype.splice = function (offst, lgth, replacement) {
	var arr = this;
	var _checkToUpIndices = function (arr, ct, key) {
		if (arr[ct] !== undefined) {
			var tmp = ct;
			ct += 1;
			if (ct === key) {
				ct += 1;
			}
			ct = _checkToUpIndices(arr, ct, key);
			arr[ct] = arr[tmp];
			delete arr[tmp];
		}
		return ct;
	};
	if (replacement && typeof replacement !== 'object') {
		replacement = [replacement];
	}
	if (lgth === undefined) {
		lgth = offst >= 0 ? arr.length - offst : -offst;
	} else if (lgth < 0) {
		lgth = (offst >= 0 ? arr.length - offst : -offst) + lgth;
	}
	if (Object.prototype.toString.call(arr) !== '[object Array]') {
		var lgt = 0,
			ct = -1,
			rmvd = [],
			rmvdObj = {},
			repl_ct = -1,
			int_ct = -1;
		var returnArr = true,
			rmvd_ct = 0,
			rmvd_lgth = 0,
			key = '';
		for (key in arr) {
			lgt += 1;
		}
		offst = (offst >= 0) ? offst : lgt + offst;
		for (key in arr) {
			ct += 1;
			if (ct < offst) {
				if (this.is_int(key)) {
					int_ct += 1;
					if (parseInt(key, 10) === int_ct) {
						continue;
					}
					_checkToUpIndices(arr, int_ct, key);
					arr[int_ct] = arr[key];
					delete arr[key];
				}
				continue;
			}
			if (returnArr && this.is_int(key)) {
				rmvd.push(arr[key]);
				rmvdObj[rmvd_ct++] = arr[key];
			} else {
				rmvdObj[key] = arr[key];
				returnArr = false;
			}
			rmvd_lgth += 1;
			if (replacement && replacement[++repl_ct]) {
				arr[key] = replacement[repl_ct];
			} else {
				delete arr[key];
			}
		}
		return returnArr ? rmvd : rmvdObj;
	}
	if (replacement) {
		replacement.unshift(offst, lgth);
		return Array.prototype.splice.apply(arr, replacement);
	}
	return arr.splice(offst, lgth);
}
Array.prototype.spliced = function (index, howMany) {
	var arr = this;
	var elements = Array.prototype.slice.apply(arguments, [3]);
	var elementsLen = elements.length;
	var results = [];
	var len = arr.length;
	for (var i = 0; i < index && i < len; i++) {
		results.push(arr[i]);
	}
	for (i = 0; i < elementsLen; i++) {
		results.push(elements[i]);
	}
	for (i = index + howMany; i < len; i++) {
		results.push(arr[i]);
	}
	return results;
}
Array.prototype.sum = function () {
	var i, sum;
	for (i = 0, sum = 0; i < this.length; sum += this[i++]) {}
	return sum;
};
Array.prototype.sum = function () {
	var array = this,
		key, sum = 0;
	if (array && typeof array === 'object' && array.change_key_case) {
		return array.sum.apply(array, Array.prototype.slice.call(arguments, 0));
	}
	if (typeof array !== 'object') {
		return null;
	}
	for (key in array) {
		if (!isNaN(parseFloat(array[key]))) {
			sum += parseFloat(array[key]);
		}
	}
	return sum;
}
Array.prototype.sum = function () {
	var sum = 0;
	for (var i in this) {
		if (!this.hasOwnProperty(i)) {
			continue;
		}
		sum += parseFloat(this[i]);
	}
	return sum;
}
Array.prototype.switchApply = function (i) {
	return arguments[1][++i];
}
Array.prototype.switchCall = function (i) {
	return arguments[++i];
}
Array.prototype.tail = function () {
	return this.slice(1);
}
Array.prototype.tail = function () {
	var a = this;
	var b = new Array(l);
	for (var i = 0,
		var l = a.length - 1; i < l; ++i) {
		b[i] = a[i + 1];
	}
	return b;
}
Array.prototype.tail = function () {
	var a = this;
	var l = a.length - 1;
	var b = new Array(l);
	for (var i = 0; i < l; ++i) {
		b[i] = a[i + 1];
	}
	return b;
}
Array.prototype.tail = function (n) {
	return this.slice((n || 0), this.length);
},
Array.prototype.take = function (n) {
	if (!n) {
		throw new TypeError();
	}
	return this.slice(0, n);
}
Array.prototype.tally = function () {
	var arr = this;
	var dict = {};
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		var count = dict[arr[i]] || 0;
		dict[arr[i]] = count + 1;
	}
	return dict;
}
Array.prototype.to_enum = function () {
	var args, iter;
	iter = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	if (iter == null) {
		iter = "each";
	}
	return new R.Enumerator(this, iter, args);
};
Array.prototype.toArray = function (args) {
	if (typeof args === "string") throw new TypeError('Array.toArray called on non-arguments');
	return slice.call(args, 0);
}
Array.prototype.tocsv = function (dl, lb) {
	if (!dl) {
		dl = ",";
	}
	if (!lb) {
		lb = "\n";
	}
	var arr = this;
	for (var line in arr) {
		arr[line] = arr[line].join(dl)
	}
	return arr.join(lb);
}
Array.prototype.toObject = function (f) {
	var arr = this;
	var keyValues = [];
	var len = arr.length;
	for (var i = 0; i < len; i++) {
		keyValues.push(f(arr[i], i));
	}
	return merge.apply(arr, keyValues);
}
Array.prototype.transpose = function () {
	var arr = this;
	var ary, entry, idx, len, max, out, _j, _len1;
	if (arr.length === 0) {
		return [];
	}
	out = [];
	max = null;
	for (_j = 0, _len1 = arr.length; _j < _len1; _j++) {
		ary = arr[_j];
		ary = __arr(ary);
		max || (max = ary.length);
		if (ary.length !== max) {
			_err.throw_index();
		}
		idx = -1;
		len = ary.length;
		while (++idx < len) {
			if (!out[idx]) {
				out.push([]);
			}
			entry = out[idx];
			entry.push(ary[idx]);
		}
	}
	return out;
};
Array.prototype.truncate = function (i) {
	this.length = (this.length - i);
	return this.length
}
Array.prototype.uasort = function (sorter) {
	var inputArr = this,
		valArr = [],
		tempKeyVal, tempValue, ret, k = '',
		i = 0,
		strictForIn = false,
		populateArr = {};
	if (typeof sorter === 'string') {
		sorter = this[sorter];
	} else if (Object.prototype.toString.call(sorter) === '[object Array]') {
		sorter = this[sorter[0]][sorter[1]];
	}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push([k, inputArr[k]]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	valArr.sort(function (a, b) {
		return sorter(a[1], b[1]);
	});
	for (i = 0; i < valArr.length; i++) {
		populateArr[valArr[i][0]] = valArr[i][1];
	}
	return strictForIn || populateArr;
}
Array.prototype.udiff = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		cb = arguments[arglm1],
		arr = '',
		i = 1,
		k1 = '',
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb(arr[k], arr1[k1]) === 0) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.udiff_assoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		cb = arguments[arglm1],
		arr = {},
		i = 1,
		k1 = '',
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb(arr[k], arr1[k1]) === 0 && k === k1) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.udiff_uassoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 1,
		cb = arguments[arglm1],
		cb0 = arguments[arglm2],
		k1 = '',
		i = 1,
		k = '',
		arr = {};
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	cb0 = (typeof cb0 === 'string') ? this.window[cb0] : (Object.prototype.toString.call(cb0) === '[object Array]') ? this.window[cb0[0]][cb0[1]] : cb0;
	arr1keys: for (k1 in arr1) {
		for (i = 1; i < arglm2; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
					continue arr1keys;
				}
			}
			retArr[k1] = arr1[k1];
		}
	}
	return retArr;
}
Array.prototype.uintersect = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 1,
		cb = arguments[arglm1],
		k1 = '',
		i = 1,
		arr = {},
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb(arr[k], arr1[k1]) === 0) {
					if (i === arglm2) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.uintersect_assoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 2,
		cb = arguments[arglm1],
		k1 = '',
		i = 1,
		arr = {},
		k = '';
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < arglm1; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (k === k1 && cb(arr[k], arr1[k1]) === 0) {
					if (i === arglm2) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.uintersect_uassoc = function () {
	var arr1 = this,
		retArr = {},
		arglm1 = arguments.length - 1,
		arglm2 = arglm1 - 1,
		cb = arguments[arglm1],
		cb0 = arguments[arglm2],
		k1 = '',
		i = 1,
		k = '',
		arr = {};
	cb = (typeof cb === 'string') ? this.window[cb] : (Object.prototype.toString.call(cb) === '[object Array]') ? this.window[cb[0]][cb[1]] : cb;
	cb0 = (typeof cb0 === 'string') ? this.window[cb0] : (Object.prototype.toString.call(cb0) === '[object Array]') ? this.window[cb0[0]][cb0[1]] : cb0;
	arr1keys: for (k1 in arr1) {
		arrs: for (i = 1; i < arglm2; i++) {
			arr = arguments[i];
			for (k in arr) {
				if (cb0(arr[k], arr1[k1]) === 0 && cb(k, k1) === 0) {
					if (i === arguments.length - 3) {
						retArr[k1] = arr1[k1];
					}
					continue arrs;
				}
			}
			continue arr1keys;
		}
	}
	return retArr;
}
Array.prototype.uksort = function (sorter) {
	var inputArr = this,
		tmp_arr = {},
		keys = [],
		i = 0,
		k = '',
		strictForIn = false,
		populateArr = {};
	if (typeof sorter === 'string') {
		sorter = this.window[sorter];
	}
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			keys.push(k);
		}
	}
	try {
		if (sorter) {
			keys.sort(sorter);
		} else {
			keys.sort();
		}
	} catch (e) {
		return false;
	}
	populateArr = strictForIn ? inputArr : populateArr;
	for (i = 0; i < keys.length; i++) {
		k = keys[i];
		tmp_arr[k] = inputArr[k];
		if (strictForIn) {
			delete inputArr[k];
		}
	}
	for (i in tmp_arr) {
		if (tmp_arr.hasOwnProperty(i)) {
			populateArr[i] = tmp_arr[i];
		}
	}
	return strictForIn || populateArr;
}
Array.prototype.union = function (arrs) {
	var results = [];
	var i = -1,
		len = arguments.length;
	while (++i < len) {
		results.append(arguments[i]);
	}
	return results.unique();
}
Array.prototype.uniq = Array.filter.partial(function (s, i, a) {
	return i == a.lastIndexOf(s)
})
Array.prototype.uniq = function () {
	var arr = this;
	var ary, el, idx, len;
	idx = -1;
	len = arr.length;
	ary = [];
	while (++idx < len) {
		el = arr[idx];
		if (ary.indexOf(el) < 0) {
			ary.push(el);
		}
	}
	return ary;
};
Array.prototype.unique = function () {
	var o = {},
		i, l = this.length,
		r = [];
	for (i = 0; i < l; i += 1) o[this[i]] = this[i];
	for (i in o) r.push(o[i]);
	return r;
};
Array.prototype.unique = function () {
	var a = [],
		l = this.length;
	for (var i = 0; i < l; i++) {
		for (var j = i + 1; j < l; j++)
			if (this[i] === this[j]) j = ++i;
		a.push(this[i]);
	}
	return a;
};
Array.prototype.unique = function () {
	var inputArr = this,
		key = '',
		tmp_arr2 = {},
		val = '';
	var __array_search = function (needle, haystack) {
		var fkey = '';
		for (fkey in haystack) {
			if (haystack.hasOwnProperty(fkey)) {
				if ((haystack[fkey] + '') === (needle + '')) {
					return fkey;
				}
			}
		}
		return false;
	};
	for (key in inputArr) {
		if (inputArr.hasOwnProperty(key)) {
			val = inputArr[key];
			if (false === __array_search(val, tmp_arr2)) {
				tmp_arr2[key] = val;
			}
		}
	}
	return tmp_arr2;
}
Array.prototype.unique = function () {
	var a = [],
		i;
	this.sort();
	for (i = 0; i < this.length; i++) {
		if (this[i] !== this[i + 1]) {
			a[a.length] = this[i]
		}
	}
	return a
}
Array.prototype.unshift = function () {
	var array = this,
		i = arguments.length;
	while (--i !== 0) {
		arguments[0].unshift(arguments[i]);
	}
	return arguments[0].length;
}
Array.prototype.unshift = function (el) {
	this[this.length] = null;
	for (var i = 1; i < this.length; i++) {
		this[i] = this[i - 1]
	}
	this[0] = el;
	return this.length
}
Array.prototype.usort = function (sorter) {
	var inputArr = this,
		valArr = [],
		k = '',
		i = 0,
		strictForIn = false,
		populateArr = {};
	if (typeof sorter === 'string') {
		sorter = this[sorter];
	} else if (Object.prototype.toString.call(sorter) === '[object Array]') {
		sorter = this[sorter[0]][sorter[1]];
	}
	populateArr = strictForIn ? inputArr : populateArr;
	for (k in inputArr) {
		if (inputArr.hasOwnProperty(k)) {
			valArr.push(inputArr[k]);
			if (strictForIn) {
				delete inputArr[k];
			}
		}
	}
	try {
		valArr.sort(sorter);
	} catch (e) {
		return false;
	}
	for (i = 0; i < valArr.length; i++) {
		populateArr[i] = valArr[i];
	}
	return strictForIn || populateArr;
}
Array.prototype.values = function () {
	var input = this,
		tmp_arr = [],
		key = '';
	if (input && typeof input === 'object' && input.change_key_case) {
		return input.values();
	}
	for (key in input) {
		tmp_arr[tmp_arr.length] = input[key];
	}
	return tmp_arr;
}
Array.prototype.walk = function (funcname, userdata) {
	var array = this,
		key, value, ini;
	if (!array || typeof array !== 'object') {
		return false;
	}
	if (typeof array === 'object' && array.change_key_case) {
		if (arguments.length > 2) {
			return array.walk(funcname, userdata);
		} else {
			return array.walk(funcname);
		}
	}
	try {
		if (typeof funcname === 'function') {
			for (key in array) {
				if (arguments.length > 2) {
					funcname(array[key], key, userdata);
				} else {
					funcname(array[key], key);
				}
			}
		} else if (typeof funcname === 'string') {
			this.php_js = this.php_js || {};
			this.php_js.ini = this.php_js.ini || {};
			ini = this.php_js.ini['phpjs.no-eval'];
			if (ini && (parseInt(ini.local_value, 10) !== 0 && (!ini.local_value.toLowerCase || ini.local_value.toLowerCase() !== 'off'))) {
				if (arguments.length > 2) {
					for (key in array) {
						this.window[funcname](array[key], key, userdata);
					}
				} else {
					for (key in array) {
						this.window[funcname](array[key], key);
					}
				}
			} else {
				if (arguments.length > 2) {
					for (key in array) {
						eval(funcname + '(array[key], key, userdata)');
					}
				} else {
					for (key in array) {
						eval(funcname + '(array[key], key)');
					}
				}
			}
		} else if (funcname && typeof funcname === 'object' && funcname.length === 2) {
			var obj = funcname[0],
				func = funcname[1];
			if (arguments.length > 2) {
				for (key in array) {
					obj[func](array[key], key, userdata);
				}
			} else {
				for (key in array) {
					obj[func](array[key], key);
				}
			}
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
	return true;
}
Array.prototype.walk_recursive = function (funcname, userdata) {
	var array = this,
		key;
	if (typeof array !== 'object') {
		return false;
	}
	for (key in array) {
		if (typeof array[key] === 'object') {
			return this.array_walk_recursive(array[key], funcname, userdata);
		}
		if (typeof userdata !== 'undefined') {
			eval(funcname + '( array [key] , key , userdata  )');
		} else {
			eval(funcname + '(  userdata ) ');
		}
	}
	return true;
}
Array.prototype.where = function (func) {
	var found = [];
	for (var i = 0, l = this.length; i < l; ++i) {
		var item = this[i];
		if (func(item)) found.push(item);
	}
	return found;
}
Array.prototype.wrap = function (obj) {
	if (obj == null || obj == undefined) return [];
	if (Array.isArray(obj)) return obj;
	return [obj];
}
Array.prototype.xor = function (arr2) {
	var arr1 = this;
	arr1 = arr1.unique();
	arr2 = arr2.unique();
	var a1 = arr1.filter(function (item) {
			return !arr2.contains(item);
		}),
		a2 = arr2.filter(function (item) {
			return !arr1.contains(item);
		});
	return a1.concat(a2);
}
Array.prototype.zip = function () {
	var arr = this;
	var len = arr ? max(map(arguments, (arr == null ? 0 : arr.length))) : 0,
		results = [],
		i = -1;
	while (++i < len) {
		results.push(map(arguments, function (item) {
			return item == null ? undefined : item[i];
		}));
	}
	return results;
}
Array.prototype['&'] = function (other) {
	return new RArray(_arr.intersection(this.__native__, other));
};
Array.prototype['<<'] = function (obj) {
	this.__native__.push(obj);
	return this;
};

var nonenum = (" ").split(" ");
for (var f in fns) {
	var fn = nonenum[f];
	var func = fns[fn];
	define(Array.prototype, nonenum[f], fns[nonenum[f]]);
}
