Object.prototype.chill = Object.prototype.freeze;
Object.prototype.freeze = function () {
	var o = this;
	prop, propKey;
	Object.chill(o);
	for (propKey in o) {
		prop = o[propKey];
		if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
			continue;
		}
		prop.freeze();
	}
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

function isFunction(obj) {
	return Object.prototype.toString.call(obj) === '[object Function]';
};

function isObject(obj) {
	return obj && obj.constructor === O;
}

function isString(obj) {
	return Object.prototype.toString.call(obj) === '[object String]';
};
Object.is = function is(a, b) {
	return (a === b && (a !== 0 || 1 / a === 1 / b)) || (a !== a && b !== b);
};
Object.keyValue = function (key, value) {
	var o = {};
	o[key] = value;
	return o;
}
Object.merge() {
	var mothership = {};
	var len = arguments.length;
	for (var i = 0; i < len; i++) {
		var outlier = arguments[i];
		for (var prop in outlier) {
			if (typeOf(outlier[prop]) === 'object' && outlier[prop].constructor === Object && outlier[prop] !== null && !(outlier[prop] instanceof Array)) {
				mothership[prop] = merge(mothership[prop], outlier[prop]);
			} else if (outlier[prop] !== undefined) {
				mothership[prop] = outlier[prop];
			}
		}
	}
	return mothership;
}
Object.prototype.cast = function (val) {
	var r;
	if (val === null || val === 'null') {
		r = null;
	} else if (val === 'true') {
		r = true;
	} else if (val === 'false') {
		r = false;
	} else if (val === undefined || val === 'undefined') {
		r = undefined;
	} else if (val === '' || isNaN(val)) {
		r = val;
	} else {
		r = parseFloat(val);
	}
	return r;
}
Object.prototype.changeKeys = function (changedKeys) {
	var obj = this;
	var result = {};
	for (var key in obj) {
		result[key in changedKeys ? changedKeys[key] : key] = obj[key];
	}
	return result;
}
Object.prototype.clone = function () {
	return JSON.parse(JSON.stringify(this));
}
Object.prototype.clone = function (source, temp, key) {
	if (isObject(source)) {
		temp = {};
		for (key in source)
			if (hasOwn.call(source, key)) {
				temp[key] = Object.prototype.clone(source[key]);
			}
		source = temp;
	}
	return source;
}
Object.prototype.compact = function () {
	var matrix = {},
		that = this;
	var process = function (value) {
		var i = 0,
			l = value.length,
			key_value = '';
		for (i = 0; i < l; i++) {
			key_value = value[i];
			if (Object.prototype.toString.call(key_value) === '[object Array]') {
				process(key_value);
			} else {
				if (typeof that.window[key_value] !== 'undefined') {
					matrix[key_value] = that.window[key_value];
				}
			}
		}
		return true;
	};
	return matrix;
}
Object.prototype.compare = function compare(b) {
	var a = this;
	if ((a === null && b !== null) || (a !== null && b === null)) {
		return false;
	}
	var akeys = Object.keys(a),
		bkeys = Object.keys(b);
	if (akeys.length !== bkeys.length) {
		return false;
	}
	for (var i = 0, k; i < akeys.length; ++i) {
		k = akeys[i];
		if (!(k in b && equals(a[k], b[k]))) {
			return false;
		}
	}
	return true;
}
Object.prototype.compare = function () {
	var obj1 = this;
	var obj2 = arguments[0];
	for (var param in obj1) {
		if (typeof obj1[param] == 'object' && obj1[param] != null) {
			if (typeof obj2[param] != "undefined" && obj1[param].length != obj2[param].length) {
				return true;
			}
			if (compareObjects(obj1[param], obj2[param]) === true) return true;
		} else {
			if (param != "$$hashKey") {
				if (obj1[param] != obj2[param]) {
					return true;
				}
			}
		}
	}
	return false;
}
Object.prototype.compare = function (d) {
	return function (a, b) {
		return ((d || 1).sign() > 0 ? (a > b ? 1 : (a < b ? -1 : 0)) : (a > b ? -1 : (a < b ? 1 : 0)));
	}
}
Object.prototype.contains = function (needle) {
	var obj = this;
	return obj.some(function (val) {
		return (val === needle);
	});
}
Object.prototype.copy = function () {
	var obj = this;
	if (typeof obj !== "object") {
		return obj;
	}
	if (obj.constructor === RegExp) {
		return obj;
	}
	var retVal = new obj.constructor();
	for (var key in obj) {
		if (!obj.hasOwnProperty(key)) {
			continue;
		}
		retVal[key] = obj[key.deepCopy();
		}
		return retVal;
	}
	Object.prototype.count = function (mode) {
		var mixed_var = this,
			key, cnt = 0;
		if (mixed_var === null || typeof mixed_var === 'undefined') {
			return 0;
		} else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object) {
			return 1;
		}
		if (mode === 'COUNT_RECURSIVE') {
			mode = 1;
		}
		if (mode != 1) {
			mode = 0;
		}
		for (key in mixed_var) {
			if (mixed_var.hasOwnProperty(key)) {
				cnt++;
				if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object)) {
					cnt += this.count(mixed_var[key], 1);
				}
			}
		}
		return cnt;
	}
	Object.prototype.deepMerge = Object.prototype.deepCopy = function (target, source, path, changed, key, val) {
		path = path || "";
		changed = changed || [];
		for (key in source)
			if (hasOwn.call(source, key) && target[key] !== source[key]) {
				val = source[key];
				changed.push(path + key);
				if (val === null) {
					delete target[key];
				} else if (isObject(val)) {
					if (!isObject(target[key])) {
						target[key] = {};
					}
					Object.prototype.deepMerge(target[key], val, path + key + ".", changed);
				} else target[key] = val;
			}
		return changed;
	}
	Object.prototype.each = function (callback) {
		var elements = this,
			element, key, _i, _len;
		if (typeof elements === 'array') {
			for (_i = 0, _len = elements.length; _i < _len; _i++) {
				element = elements[_i];
				if (!callback.call(element, _i, element)) {
					return elements;
				}
			}
		} else {
			for (key in elements) {
				if (!callback.call(elements[key], key, elements[key])) {
					return elements;
				}
			}
		}
		return elements;
	};
	Object.prototype.each = function (f) {
		for (var i in this) {
			f && this.hasOwnProperty(i) && f.call(this, this[i], i);
		}
	};
	Object.prototype.each = function (iterator, context) {
		var obj = this;
		if (obj.isArray()) {
			for (var x = 0, len = obj.length; x < len; x++) {
				result = iterator.call(context, obj[x], x, obj);
				if (result !== undefined) {
					return result;
				}
			}
		} else if (obj.isObject()) {
			for (var x in obj) {
				if (obj.hasOwnProperty(x)) {
					result = iterator.call(context, obj[x], x, obj);
					if (result !== undefined) {
						return result;
					}
				}
			}
		}
		throw new TypeError("Array or Object is expected");
	}
	Object.prototype.each = function (obj, fn, scope, key) {
		if (obj) {
			for (key in obj) {
				hasOwn.call(obj, key) && fn.call(scope, obj[key], key, obj);
			}
		}
	}
	Object.prototype.empty = function () {
		var mixed_var = this;
		var undef, key, i, len;
		var emptyValues = [undef, null, false, 0, '', '0'];
		for (i = 0, len = emptyValues.length; i < len; i++) {
			if (mixed_var === emptyValues[i]) {
				return true;
			}
		}
		if (typeof mixed_var === 'object') {
			for (key in mixed_var) {
				return false;
			}
			return true;
		}
		return false;
	}
	Object.prototype.explode = function (arg) {
		var obj = this;
		arg = arg || ",";
		return obj.replace(/^(\s+|\t+)|(\s+|\t+)$/g, "").split(new RegExp("\\s*" + arg + "\\s*"));
	}
	Object.prototype.extend = function () for (var i = 1; i < arguments.length; i++) {
		if (!arguments[i]) {
			continue;
		}
		for (var k in arguments[i]) {
			if (!Object.prototype.hasOwnProperty.call(arguments[i], k)) {
				continue;
			}
			this[k] = arguments[i][k];
		}
	}
	return this;
};
Object.prototype.extract = function (type, prefix) {
	var arr = this;
	if (Object.prototype.toString.call(arr) === '[object Array]' && (type !== 'EXTR_PREFIX_ALL' && type !== 'EXTR_PREFIX_INVALID')) {
		return 0;
	}
	var targetObj = this.window;
	if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.extractTargetObj'] && this.php_js.ini['phpjs.extractTargetObj'].local_value) {
		targetObj = this.php_js.ini['phpjs.extractTargetObj'].local_value;
	}
	var chng = 0;
	for (var i in arr) {
		var validIdent = /^[_a-zA-Z$][\w|$]*$/;
		var prefixed = prefix + '_' + i;
		try {
			switch (type) {
			case 'EXTR_PREFIX_SAME' || 2:
				if (targetObj[i] !== undefined) {
					if (prefixed.match(validIdent) !== null) {
						targetObj[prefixed] = arr[i];
						++chng;
					}
				} else {
					targetObj[i] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_SKIP' || 1:
				if (targetObj[i] === undefined) {
					targetObj[i] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_PREFIX_ALL' || 3:
				if (prefixed.match(validIdent) !== null) {
					targetObj[prefixed] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_PREFIX_INVALID' || 4:
				if (i.match(validIdent) !== null) {
					if (prefixed.match(validIdent) !== null) {
						targetObj[prefixed] = arr[i];
						++chng;
					}
				} else {
					targetObj[i] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_IF_EXISTS' || 6:
				if (targetObj[i] !== undefined) {
					targetObj[i] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_PREFIX_IF_EXISTS' || 5:
				if (targetObj[i] !== undefined && prefixed.match(validIdent) !== null) {
					targetObj[prefixed] = arr[i];
					++chng;
				}
				break;
			case 'EXTR_REFS' || 256:
				throw 'The EXTR_REFS type will not work in JavaScript';
			case 'EXTR_OVERWRITE' || 0:
			default:
				targetObj[i] = arr[i];
				++chng;
				break;
			}
		} catch (e) {}
	}
	return chng;
}
Object.prototype.filterObject = function (f) {
	var obj = this;
	var result = {};
	for (var key in obj) {
		if (f(key, obj[key])) {
			result[key] = obj[key];
		}
	}
	return result;
}
Object.prototype.flatten = function (line, lines) {
	var obj = this;
	if (!lines) {
		lines = [];
	}
	if (!line) {
		line = '';
	}
	if (!_.isArray(obj) && !_.isObject(obj)) {
		return lines.push(line + '=' + obj);
	}
	for (var k in obj) {
		flatten(obj[k], line + (line.length ? '.' : '') + k, lines);
	}
	return lines;
}
Object.prototype.flip = function () {
	var o = this;
	var flipped = {};
	for (var i in o) {
		if (o.hasOwnProperty(i)) {
			flipped[o[i]] = i;
		}
	}
	return flipped;
}
Object.prototype.fold = function (f, base) {
	base = ("undefined" != typeof base) ? base : 0;
	this.each(function (e, i) {
		base = f.call(this, e, base);
	});
	return base;
};
Object.prototype.forIn = function forIn(fn, thisObj) {
	var obj = this;
	var key, i = 0;
	for (key in obj) {
		if (fn.exec(obj, key, thisObj) === false) {
			break;
		}
	}
}
Object.prototype.forOwn = function forOwn(obj, fn, thisObj) {
	var obj = this;
	obj.forIn(function (val, key) {
		if (obj.hasOwn(key)) {
			return fn.call(thisObj, obj[key], key, obj);
		}
	});
}
Object.prototype.function = function (fn) {
	var obj = this,
		nth = obj.length,
		i;
	for (i = 0; i < nth; i++) {
		if (fn.call(obj, obj[i], i) === false) {
			break;
		}
	}
	return obj;
}
Object.prototype.functions = function () {
	var obj = this;
	var keys = [];
	obj.forIn(function (val, key) {
		if (typeof val === 'function') {
			keys.push(key);
		}
	});
	return keys.sort();
}
Object.prototype.hash = function () {
	var o = this;
	if (o === undefined) {
		return 'undefined';
	} else if (o === null) {
		return 'null';
	} else if (typeof o === 'string' || typeof o === 'number') {
		return '' + o;
	} else if (typeOf(o) === 'array') {
		return '_[{0}]_'.format(o.map(hash).join(','));
	} else if (typeOf(o) === 'object') {
		var objString = '';
		for (var prop in o) {
			objString += supplant('{0}_:_{1}', [prop, hash(o[prop])]);
		}
		return supplant('_\{{0}}_', [objString]);
	} else {
		throw new Error('Unhashable value: ' + o);
	}
}
Object.prototype.index = function (id) {
	var obj = this;
	if (typeof obj == "object") {
		for (var i = 0; i < obj.length; i++) {
			if (typeof obj[i] != "undefined" && typeof obj[i].id != "undefined" && obj[i].id == id) {
				return i;
			}
		}
	}
	return false;
}
Object.prototype.isArray = function () {
	return this.constructor == Array;
}
Object.prototype.isObjectDescriptor = function () {
	var o = this;
	if (typeof o !== 'object' || o === null) {
		return false;
	}
	for (var i in o) {
		if (!Object.prototype.hasOwnProperty.call(o, i)) {
			continue;
		}
		if (!
			var isPropertyDescriptor(o[i])) {
			return false;
		}
	}
	if (!i) {
		return false;
	}
	return true;
}
Object.prototype.isPropertyDescriptor = function () {
	var o = this;
	if (typeof o !== 'object') {
		return false;
	}
	return 'value' in o || 'writable' in o || 'get' in o || 'set' in o || 'configurable' in o || 'enumerable' in o;
}
Object.prototype.join = function (propSeparator, valueSeparator) {
	var obj = this;
	var keyValuePairs = [];
	propSeparator = propSeparator || ":";
	valueSeparator = valueSeparator || ",";
	for (var prop in obj) {
		keyValuePairs.push(prop + valueSeparator + obj[prop]);
	}
	return keyValuePairs.join(propSeparator);
}
Object.prototype.json = function (json) {
	var json = json || this;
	return (typeof json === "object" ? JSON.stringify(json) : JSON.parse(json));
}
Object.prototype.keys = function () {
	var obj = this;
	var result = [];
	if (!obj.isObject() && !obj.isArray()) {
		throw new TypeError("Object or Array is expected");
	}
	if (obj.keys()) {
		return obj.keys();
	}
	obj.forEach(function (value, key) {
		result.push(key);
	});
	return result;
}
Object.prototype.length = function () {
	var object = this,
		i = 0;
	for (var key in object) {
		i++;
	}
	return i;
}
Object.prototype.map = function (f) {
	var obj = this;
	var result = {};
	for (var key in obj) {
		var pair = f(key, obj[key]);
		for (var prop in pair) {
			result[prop] = pair[prop];
		}
	}
	return result;
}
Object.prototype.map = function (f) {
	var return_value = {};
	f && this.each(function (e, i) {
		return_value[i] = f.call(this, e);
	});
	return return_value;
};
Object.prototype.merge = function () {
	var obj = this,
		i = 1,
		key, val, target;
	target = this.clone(arguments[0]);
	while (obj = arguments[i++]) {
		for (key in obj) {
			if (!obj.hasOwn(key)) {
				continue;
			}
			val = obj[key];
			if (val.isObject() && target[key].isObject()) {
				target[key] = target[key].merge(val);
			} else {
				target[key] = val.clone();
			}
		}
	}
	return target;
}
Object.prototype.merge = function (target) {
	var src = this;
	var array, dst;
	array = Array.isArray(src);
	dst = array && [] || {};
	if (array) {
		target = target || [];
		dst = dst.concat(target);
		src.forEach(function (e, i) {
			if (typeof e === 'object') {
				return dst[i] = methods.merge(target[i], e);
			} else {
				if (target.indexOf(e === -1)) {
					return dst.push(e);
				}
			}
		});
	} else {
		if (target && typeof target === 'object') {
			target.keys().forEach(function (key) {
				return dst[key] = target[key];
			});
		}
		target.keys(src).forEach(function (key) {
			if (typeof src[key] !== 'object' || !src[key]) {
				return dst[key] = src[key];
			} else {
				if (!target[key]) {
					return dst[key] = src[key];
				} else {
					return dst[key] = target[key].merge(src[key]);
				}
			}
		});
	}
	return dst;
}
Object.prototype.merge = function (target, source) {
	for (var key, i = 1; source = arguments[i++];) {
		for (key in source) {
			if (hasOwn.call(source, key)) {
				target[key] = source[key];
			}
		}
	}
	return target;
}
Object.prototype.method_exists = function (method) {
	var obj = this;
	if (typeof obj === 'string') {
		return this.window[obj] && typeof this.window[obj][method] === 'function';
	}
	return typeof obj[method] === 'function';
}
Object.prototype.pick = function pick(obj, var_keys) {
	var obj = this;
	var keys = typeof arguments[1] !== 'string' ? arguments[1] : slice(arguments, 1),
		out = {},
		i = 0,
		key;
	while (key = keys[i++]) {
		out[key] = obj[key];
	}
	return out;
}
Object.prototype.pluck = function (propName) {
	var obj = this;
	return obj.map(obj.prop(propName));
}
Object.prototype.properties = function () {
	var object = this;
	var accumulator = [];
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			accumulator.push(property);
		}
	}
	return accumulator;
}
Object.prototype.property_exists = function (prop) {
	var cls = this;
	cls = (typeof cls === 'string') ? this.window[cls] : cls;
	if (typeof cls === 'function' && cls.toSource && cls.toSource().match(new RegExp('this\\.' + prop + '\\s'))) {
		return true;
	}
	return (cls[prop] !== undefined && typeof cls[prop] !== 'function') || (cls.prototype !== undefined && cls.prototype[prop] !== undefined && typeof cls.prototype[prop] !== 'function') || (cls.constructor && cls.constructor[prop] !== undefined && typeof cls.constructor[prop] !== 'function');
}
Object.prototype.provide = function () {
	var obj = this;
	if (obj !== Object(obj)) {
		throw new TypeError('Object.provide called on non-object');
	}
	var properties = Array.prototype.slice.call(arguments, 1);
	var node = obj;
	properties.forEach(function (prop) {
		if (!node[prop]) {
			node[prop] = {};
		} else if (node[prop] !== Object(node[prop])) {
			throw new TypeError('Object.provide can only add properties to a plain object');
		}
		node = node[prop];
	}) return node;
};
Object.prototype.renameProperty = function (old_key, new_key) {
	if (old_key !== new_key) {
		Object.defineProperty(o, new_key, Object.getOwnPropertyDescriptor(o, old_key));
		delete o[old_key];
	}
}
Object.prototype.search = function (key, val) {
	var obj = this;
	var objects = [];
	for (var i in obj) {
		if (typeof obj[i] == 'object') {
			objects = objects.concat(searchObjects(obj[i], key, val));
		} else if (i == key && obj[key] == val) {
			objects.push(obj);
		}
	}
	return objects;
}
Object.prototype.serialize = function () {
	return JSON.stringify(this);
}
Object.prototype.serialize = function () {
	var obj = {};
	this.each(this.serializeArray(), function (k, v) {
		obj[v.name] = v.value;
	});
	return obj;
}
Object.prototype.sort = function (c, d) {
	var reA = /[^a-zA-Z]/g;
	var reN = /[^0-9]/g;
	return function (a, b) {
		var aA = a.replace(reA, "");
		var bA = b.replace(reA, "");
		if (aA === bA) {
			var aN = parseInt(a.replace(reN, ""), 10);
			var bN = parseInt(b.replace(reN, ""), 10);
			return aN === bN ? 0 : aN > bN ? (d * 1) : (d * -1);
		} else {
			return aA > bA ? (d * 1) : (d * -1);
		}
	}
}
Object.prototype.sort = function (query, sub) {
	var obj = this;
	query = query.replace(/\s*asc/ig, "").replace(/\s*desc/ig, " desc");
	var queries = explode(query).map(function (i) {
			return i.split(" ");
		}),
		sorts = [];
	if (sub && sub !== "") {
		sub = "." + sub;
	} else {
		sub = "";
	}
	Object.each(queries, function (i) {
		var desc = i[1] === "desc";
		if (!desc) {
			sorts.push("if(a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"]) return -1;");
			sorts.push("if(a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"]) return 1;");
		} else {
			sorts.push("if(a" + sub + "[\"" + i[0] + "\"] < b" + sub + "[\"" + i[0] + "\"]) return 1;");
			sorts.push("if(a" + sub + "[\"" + i[0] + "\"] > b" + sub + "[\"" + i[0] + "\"]) return -1;");
		}
	});
	sorts.push("else return 0;");
	return obj.sort(new Function("a", "b", sorts.join("\n")));
}
Object.prototype.toArray = function (f) {
	var obj = this;
	f = f || function (key, value) {
		return {
			key: key,
			value: value
		};
	};
	var result = [];
	for (var key in obj) {
		result.push(f(key, obj[key]));
	}
	return result;
}
Object.prototype.toIterator = function toIterator(thisObj) {
	var src = this;
	switch (typeof src) {
	case 'function':
		return (typeof thisObj !== 'undefined') ? function (val, i, arr) {
			return src.call(thisObj, val, i, arr);
		} : src;
	case 'object':
		return function (val) {
			return deepMatches(val, src);
		};
	case 'string':
	case 'number':
		return prop(src);
	}
}
Object.prototype.toObject = function (path) {
	var i, j, o = window,
		segments = path.split(".");
	for (i = 0, j = segments.length; i < j; i++) {
		o = o[segments[i]];
	}
	return o;
}
Object.prototype.values = function () {
	var obj = this;
	if (obj !== Object(obj)) {
		throw new TypeError('Object.values called on non-object');
	}
	return obj.keys().map(function (key) {
		return obj[key]
	});
};
Object.prototype.values = function () {
	var obj = this;
	var vals = [];
	obj.forOwn(function (val, key) {
		vals.push(val);
	});
	return vals;
}
Object.prototype.zip = function (keys, vals) {
	return keys.fold(function (_, key, i) {
		_[key] = vals[i];
		return _;
	}, {});
}
Object.settype = function (vr, type) {
	var is_array = function (arr) {
		return typeof arr === 'object' && typeof arr.length === 'number' && !(arr.propertyIsEnumerable('length')) && typeof arr.splice === 'function';
	};
	var v, mtch, i, obj;
	v = this[vr] ? this[vr] : vr;
	try {
		switch (type) {
		case 'boolean':
			if (is_array(v) && v.length === 0) {
				this[vr] = false;
			} else if (v === '0') {
				this[vr] = false;
			} else if (typeof v === 'object' && !is_array(v)) {
				var lgth = false;
				for (i in v) {
					lgth = true;
				}
				this[vr] = lgth;
			} else {
				this[vr] = !!v;
			}
			break;
		case 'integer':
			if (typeof v === 'number') {
				this[vr] = parseInt(v, 10);
			} else if (typeof v === 'string') {
				mtch = v.match(/^([+\-]?)(\d+)/);
				if (!mtch) {
					this[vr] = 0;
				} else {
					this[vr] = parseInt(v, 10);
				}
			} else if (v === true) {
				this[vr] = 1;
			} else if (v === false || v === null) {
				this[vr] = 0;
			} else if (is_array(v) && v.length === 0) {
				this[vr] = 0;
			} else if (typeof v === 'object') {
				this[vr] = 1;
			}
			break;
		case 'float':
			if (typeof v === 'string') {
				mtch = v.match(/^([+\-]?)(\d+(\.\d+)?|\.\d+)([eE][+\-]?\d+)?/);
				if (!mtch) {
					this[vr] = 0;
				} else {
					this[vr] = parseFloat(v, 10);
				}
			} else if (v === true) {
				this[vr] = 1;
			} else if (v === false || v === null) {
				this[vr] = 0;
			} else if (is_array(v) && v.length === 0) {
				this[vr] = 0;
			} else if (typeof v === 'object') {
				this[vr] = 1;
			}
			break;
		case 'string':
			if (v === null || v === false) {
				this[vr] = '';
			} else if (is_array(v)) {
				this[vr] = 'Array';
			} else if (typeof v === 'object') {
				this[vr] = 'Object';
			} else if (v === true) {
				this[vr] = '1';
			} else {
				this[vr] += '';
			}
			break;
		case 'array':
			if (v === null) {
				this[vr] = [];
			} else if (typeof v !== 'object') {
				this[vr] = [v];
			}
			break;
		case 'object':
			if (v === null) {
				this[vr] = {};
			} else if (is_array(v)) {
				for (i = 0, obj = {}; i < v.length; i++) {
					obj[i] = v;
				}
				this[vr] = obj;
			} else if (typeof v !== 'object') {
				this[vr] = {
					scalar: v
				};
			}
			break;
		case 'null':
			delete this[vr];
			break;
		}
		return true;
	} catch (e) {
		return false;
	}
}
