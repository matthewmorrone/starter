function doublet(obj, fn, callback, args) {
	obj[fn](callback.call(obj[fn](), args));
}
doublet($("style").eq(2), "text", String.prototype.usurp, styles);

function y(f) {
	var p = function (h) {
		return function (x) {
			return f(h(h))(x);
		};
	};
	return p(p);
}
Function.prototype.y = function y() {
	var f = this;
	var p = function (h) {
		return function (x) {
			return f(h(h))(x);
		};
	};
	return p(p);
}

// var factorial = y(function(fac) {return function(n) {return n <= 2 ? n : n * fac(n - 1);};});
// var number120 = factorial(5);

// fn.apply(valueForThis, arrayOfArgs)
// fn.call(valueForThis, arg1, arg2, ...)

// function fn(n){return function(o){return o[n]();};}

Function.arg = function (n) {
	return function () {
		return arguments[n];
	};
};
Function.arity = function (n) {
	return function () {
		return arguments.length;
	};
};
Function.even = function () {
	return Function.nth(2, 2);
};
Function.filterMap = function (filter, map) {
	return function (mem, value, index, arr) {
		mem = mem || [];
		if (filter.call(this, value, index, arr)) {
			mem.push(map.call(this, value, index, arr));
		}
		return mem;
	};
};
Function.first = function () {
	return Function.arg(0);
};
Function.identity = function () {
	return Function.arg(0);
};
Function.iota = function (start, skip) {
	var num = start || 0;
	skip = skip || 1;
	return function () {
		var value = num;
		return (num += skip), value;
	};
};
Function.last = function () {
	return Function.arg(this.arity - 1);
};
Function.not = function (func) {
	return function () {
		return !func.apply(this, arguments);
	};
};
Function.nth = function (n, offset) {
	var calls = offset || 0;
	return function () {
		return !((++calls) % n);
	};
};
Function.odd = function () {
	return Function.nth(2, 1);
};
Function.prop = function (prop) {
	return function (obj) {
		return obj[prop];
	};
};
Function.prototype.arg = function (n) {
	return function () {
		return arguments[n];
	};
};
Function.prototype.arglist = function (fn) {
	return fn._arglist || fn.toString().match(/function \S*\((.*?)\)/)[1].split(',');
}
Function.prototype.aritize = function (n) {
	var f = this;
	return function () {
		var givenArgs = Array.prototype.slice.call(arguments, 0, n);
		return f.apply(this, givenArgs);
	};
}
Function.prototype.bare = function (fn, scope) {
	return function (x) {
		fn.call(scope || this, x);
	};
}
Function.prototype.bare = function (scope) {
	var fn = this;
	return function (x) {
		fn.call(scope || this, x);
	};
}
Function.prototype.bind = function (context) {
	var func = this,
		args;
	if (isFunction(func.bind)) {
		return func.bind.apply(func, Array.prototype.slice.call(arguments, 1));
	}
	args = Array.prototype.slice.call(arguments, 2);
	return function () {
		return func.apply(context, args.concat(Array.prototype.slice.call(arguments)));
	};
}
Function.prototype.byKeyVal = function () {
	var self = this;
	return function (o) {
		var r, s = this,
			a = slice(arguments) if (typeof o == "object") {
				for (r in o) {
					a[0] = r;
					a[1] = o[r];
					r = self.apply(s, a);
				}
			} else {
				r = self.apply(s, a);
			}
		return r;
	}
}
Function.prototype.byWords = function (argi, re) {
	var self = this;
	return function () {
		var s = this,
			r = s,
			a = arguments;
		(a[argi |= 0] || "").replace(re || /\S+/g, function (w) {
			a[argi] = w;
			r = self.apply(s, a);
		}) return r;
	}
}
Function.prototype.cache = function (instance, keyFn, cache) {
	var self = this;, c = cache || {}, f = function () {
		var a = arguments,
			i = !!instance || this instanceof f,
			k = keyFn ? keyFn.apply(self, a) : i + ":" + a.length + ":" + slice(a) return k in c ? c[k] : (c[k] = i ? self.construct(a) : self.apply(this, a))
	};
	f.origin = self;
	f.cached = c;
	f.extend = function () {
		return self.extend.apply(self, arguments).cache(instance, keyFn, cache);
	};
	f.prototype = self.prototype;
	return f;
}
Function.prototype.callTillValue = function (value) {
	return typeof value === 'function' ? callTillValue(value()) : value;
}
Function.prototype.catch = function (f, scope) {
	return function () {
		try {
			return f.apply(scope || this, arguments);
		} catch (e) {
			return this.undefined;
		}
	};
}
Function.prototype.catch = function (scope) {
	var f = this;
	return function () {
		try {
			return f.apply(scope || this, arguments);
		} catch (e) {
			return this.undefined;
		}
	};
}
Function.prototype.comp = function () {
	var fns = Array.prototype.slice.call(arguments),
		self = this;
	return function () {
		var temp = Array.prototype.slice.call(fns);
		var args = Array.prototype.slice.call(arguments),
			result = (self.isCallable()) ? self.apply(this, args) : null,
			fn;
		while (fn = temp.shift()) result = fn.apply(null, (result && [result]) || args);
		return result;
	};
}
Function.prototype.compose = function (g) {
	var f = this;
	return function () {
		return f.call(this, g.apply(this, Array.prototype.slice.call(arguments)));
	};
};
Function.prototype.compose = function compose() {
	var fns = arguments;
	return function (arg) {
		var n = fns.length;
		while (n--) {
			arg = fns[n].call(this, arg);
		}
		return arg;
	};
}
Function.prototype.constant = function (c) {
	return function () {
		return c;
	};
}
Function.prototype.construct = function (a) {
	var len = a.length;
	return len ? (constructFns[len] || (constructFns[len] = Fn("t a->new t(a[" + Object.prototype.keys(slice(a)).join("],a[") + "])")))(this, a) : new this;
}
Function.prototype.contains = function (haystack, needle) {
	return haystack.indexOf(needle) !== -1;
}
Function.prototype.currier = function makeCurry(rightward) {
	var fn = this;
	return function (handler, arity) {
		if (handler.curried) {
			return handler;
		}
		arity = arity || handler.length;
		var curry = function curry() {
			var args = fn.toArray(arguments);
			if (args.length >= arity) {
				var transform = rightward ? 'reverse' : 'identity';
				return fn.apply(handler, fn[transform](args));
			}
			var inner = function () {
				return fn.apply(curry, args.concat(fn.toArray(arguments)));
			};
			inner.curried = true;
			return inner;
		};
		curry.curried = true;
		return curry;
	};
}
Function.prototype.curry = this.currier(false);
Function.prototype.curryRight = this.currier(true);
Function.prototype.decorate = function () {
	var decorators = Array.prototype.slice.call(arguments),
		orig = resultFn = this,
		decorator;
	while (decorator = decorators.pop()) resultFn = decorator(resultFn);
	resultFn._arglist = Function.arglist(orig);
	resultFn._decorated = orig;
	return resultFn;
}
Function.prototype.demethodize = function () {
	var fn = this;
	return function () {
		var args = [].slice.call(arguments, 1);
		return fn.apply(arguments[0], args);
	};
}
Function.prototype.dispatch = function () {
	var fns = Array.prototype.slice.call(arguments);
	var dispatch = [];
	fns.each(function (fn) {
		var arglist = Function.arglist(fn);
		dispatch[arglist.length] = fn;
	});
	return function () {
		var args = Array.prototype.slice.call(arguments).filter($notnull);
		return dispatch[args.length].apply(this, args);
	};
}
Function.prototype.eq = function (a) {
	return function (b) {
		return a == b;
	};
}
Function.prototype.even = function () {
	return Function.prototype.nth(2, 2);
};
Function.prototype.exec = function exec(obj, key, thisObj) {
	var fn = this;
	return fn.call(thisObj, obj[key], key, obj);
}
Function.prototype.exec = function (bindorfn) {
	if (bindorfn.isCallable()) return bindorfn();
	var args = Array.prototype.slice.call(arguments).rest();
	return function (fn) {
		return fn.apply(bindorfn, args);
	};
}
Function.prototype.extend = function () {
	var a, self = this,
		i = 0;

	function f() {
		return self.apply(this, arguments);
	};
	for (Function.prototype = Object.prototype.create(self.prototype); a = arguments[i++];) {
		Object.prototype.merge(f.prototype, a);
	}
	Function.prototype.constructor = f;
	return f;
}
Function.prototype.false = function () {
	return false;
};
Function.prototype.filterMap = function (filter, map) {
	return function (mem, value, index, arr) {
		mem = mem || [];
		if (filter.call(this, value, index, arr)) {
			mem.push(map.call(this, value, index, arr));
		}
		return mem;
	};
};
Function.prototype.flip = function () {
	var f = this;
	return function () {
		return f.apply(this, Array.prototype.slice.call(arguments).reverse());
	};
};
Function.prototype.flip = function (handler) {
	var fn = this;
	return function () {
		return fn.apply(handler, fn.reverse(arguments));
	};
}
Function.prototype.get_arg = function (num) {
	if (!arguments.callee.caller) {
		try {
			throw new Error('Either you are using this in a browser which does not support the "caller" property or you are calling this from a global context');
		} catch (e) {
			return false;
		}
	}
	if (num > arguments.callee.caller.arguments.length - 1) {
		try {
			throw new Error('Argument number is greater than the number of arguments actually passed');
		} catch (e2) {
			return false;
		}
	}
	return arguments.callee.caller.arguments[num];
}
Function.prototype.get_args = function () {
	if (!arguments.callee.caller) {
		try {
			throw new Error('Either you are using this in a browser which does not support the "caller" property or you are calling this from a global context');
		} catch (e) {
			return false;
		}
	}
	return Array.prototype.slice.call(arguments.callee.caller.arguments);
}
Function.prototype.identity = function (x) {
	return x || this;
};
Function.prototype.identity = Function.prototype.first = function () {
	return Function.prototype.arg(0);
};
Function.prototype.inContext = function () {
	var f = this;
	return function (context) {
		var otherArgs = Array.prototype.slice.call(arguments, 1);
		return f.apply(context, otherArgs);
	};
}
Function.prototype.iota = function (start, skip) {
	var num = start || 0;
	skip = skip || 1;
	return function () {
		var value = num;
		return (num += skip), value;
	};
};
Function.prototype.isNative = function () {
	return (/\{\s*\[native code\]\s*\}/).test('' + this);
}
Function.prototype.iterate = function (forn, n) {
	var result = [],
		fandn = (this.isCallable()) ? [this, forn] : [forn, n],
		fn = fandn[0],
		n = fandn[1];
	for (var i = 0; i < n; i++) {
		result.push(fn());
	}
	return result;
}
Function.prototype.memoize = function memoize(handler, serializer) {
	var fn = this;
	var cache = {};
	return function () {
		var args = fn.toArray(arguments);
		var key = serializer ? serializer(args) : memoize.serialize(args);
		return key in cache ? cache[key] : cache[key] = fn.apply(handler, args);
	};
}
Function.prototype.memoize = function (fn, table) {
	table = table || {};
	return function memoized() {
		var args = Array.prototype.slice.call(arguments);
		var enc = JSON.encode(args);
		if (!table[enc]) {
			var result = fn.apply(this, args);
			if (result != Function.nomemo) {
				table[enc] = result;
				return result;
			}
		} else {
			return table[enc];
		}
	};
}
Function.prototype.memoize.serialize = function (values) {
	return this.type(values[0]) + '|' + JSON.stringify(values[0]);
}
Function.prototype.merge = function () {
	var fn = this;
	return fn.reduce(function (accumulator, value) {
		fn.each(function (property) {
			accumulator[property] = value[property];
		}, fn.properties(value));
		return accumulator;
	}, {}, fn.toArray(arguments));
}
Function.prototype.method = function (name, func) {
	this.prototype[name] = func;
	return this;
}
Function.prototype.msg = function (methodName) {
	var rest = Array.prototype.slice.call(arguments).rest();
	return function (obj) {
		var method = obj[methodName];
		if (method.isCallable()) {
			return method.apply(obj, rest);
		} else {
			return obj.methodName;
		}
	};
}
Function.prototype.multi = function (args, fn) {
	var result = [],
		i;
	for (var i = 0,
		var len = args.length; i < len; i++) {
		result.push(args[i]);
		if (fn) {
			fn.call(args, args[i], i);
		}
	}
	return result;
}
Function.prototype.negate = function (f) {
	return function () {
		var args = Array.prototype.slice.call(arguments);
		return !f.apply(this, args);
	}
};
Function.prototype.negate = function (f) {
	return function () {
		var args = Array.prototype.slice.call(arguments);
		console.log(args);
		return !f.apply(this, args);
	}
};
Function.prototype.negate = function (f, scope) {
	return function () {
		return !f.apply(scope || this, arguments);
	};
}
Function.prototype.negate = function (scope) {
	var f = this;
	return function () {
		return !f.apply(scope || this, arguments);
	};
}
Function.prototype.noop = function () {};
Function.prototype.not = function () {
	var f = this;
	return function () {
		return !f.apply(this, arguments);
	};
}
Function.prototype.not = function (fn) {
	fn = (fn) ? fn : this;
	return function () {
		return !fn.apply(this, arguments);
	};
}
Function.prototype.not = function (func) {
	return function () {
		return !func.apply(this, arguments);
	};
};
Function.prototype.nth = function (n, offset) {
	var calls = offset || 0;
	return function () {
		return !((++calls) % n);
	};
};
Function.prototype.num_args = function () {
	if (!arguments.callee.caller) {
		try {
			throw new Error('Either you are using this in a browser which does not support the "caller" property or you are calling this from a global context');
		} catch (e) {
			return false;
		}
	}
	return arguments.callee.caller.arguments.length;
}
Function.prototype.odd = function () {
	return Function.prototype.nth(2, 1);
};
Function.prototype.partial = function () {
	var args = Array.prototype.slice.call(arguments);
	var f = this;
	return function () {
		return f.apply(this, args.concat(Array.prototype.slice.call(arguments)));
	}
};
Function.prototype.partial = function () {
	var fn = this;
	var args = fn.toArray(arguments);
	var handler = args[0];
	var partialArgs = args.slice(1);
	return function () {
		return fn.apply(handler, fn.concat(partialArgs, fn.toArray(arguments)));
	};
}
Function.prototype.partial = function () {
	var self = this,
		a = slice(arguments);
	return function () {
		return self.apply(this, a.concat.apply(a, arguments));
	}
}
Function.prototype.partial = function (bind) {
	var self = this;
	args = Array.prototype.slice.call(arguments).rest();
	return function () {
		return self.apply(bind, args.concat(Array.prototype.slice.call(arguments)));
	};
}
Function.prototype.partialAt = function (index, curriedArgs) {
	var f = this;
	return function () {
		var givenArgs = Array.prototype.slice.call(arguments);
		if (index < 0) {
			index = circ(givenArgs, index) + 1;
		}
		var spliceArgs = [givenArgs, index, 0].concat(curriedArgs);
		var newArgs = spliced.apply(this, spliceArgs);
		return f.apply(this, newArgs);
	};
}
Function.prototype.pipeline = function () {
	var fn = this;
	var functions = fn.toArray(arguments);
	return function () {
		return fn.reduce(function (args, func) {
			return [fn.apply(func, args)];
		}, fn.toArray(arguments), functions)[0];
	};
}
Function.prototype.post = function (condition, error) {
	error = error || false;
	return function postDecorator(fn) {
		return function () {
			var result = fn.apply(this, arguments);
			if (condition(result)) {
				return result;
			} else {
				if (error.type() == 'boolean' && error) {
					var err = new Error("Result did not match postcondition.");
					err.args = arguments;
					err.result = result;
					err.source = fn.toString();
					throw err;
				} else if (error.type() == 'function') {
					error(passed);
				}
			}
		};
	};
}
Function.prototype.pre = function (conditions, error) {
	error = error || false;
	return function preDecorator(fn) {
		return function () {
			var args = arguments;
			var passed = conditions.map(function (afn, i) {
				var result = afn(args[i]);
				return result;
			});
			if (passed.indexOf(false) == -1) {
				return fn.apply(this, arguments);
			} else {
				if (error.type() == 'boolean' && error) {
					var err = new Error("Arguments did not match preconditions.");
					err.args = arguments;
					err.passed = passed;
					err.source = fn.toString();
					throw err;
				} else if (error.type() == 'function') {
					error(passed);
				}
			}
		}
	};
}
Function.prototype.prop = function (name) {
	return function (obj) {
		return obj[name];
	};
}
Function.prototype.prop = function (prop) {
	return function (obj) {
		return obj[prop];
	};
};
Function.prototype.prop = Function.prototype.curry(function (n, o) {
	return o[n];
});
Function.prototype.properties = function (object) {
	var accumulator = [];
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			accumulator.push(property);
		}
	}
	return accumulator;
}
Function.prototype.reduce = function (ary) {
	var fn = this,
		result = ary.first();
	while (ary.rest().length != 0) {
		var rest = ary.rest();
		result = fn(result, rest);
		ary = rest;
	}
	return result;
}
Function.prototype.sandbox = function sandbox(fn) {
	fn = fn || this;
	(function () {
		with(this) {
			fn();
		}
	}).call({})
}
Function.prototype.sequence = function () {
	return compose.apply(this, __slice.call(arguments).reverse());
};
Function.prototype.sequence = function () {
	var fns = arguments;
	return function (result) {
		for (var i = 0; i < fns.length; i++) {
			result = fns[i].call(this, result);
		}
		return result;
	};
}
Function.prototype.series = function () {
	var fns = arguments;
	return function () {
		var i = 0,
			n = fns.length;
		while (i < n) {
			fns[i].apply(this, arguments);
			i += 1;
		}
	};
}
Function.prototype.singleUse = function () {
	var fn = this;
	var alreadyCalled = false;
	return function () {
		if (alreadyCalled) {
			return;
		}
		alreadyCalled = true
		var args = Array.prototype.slice.call(arguments, 0);
		return fn.apply(null, args);
	}
}
Function.prototype.singleUse = function () {
	var fn = this;
	var alreadyCalled = false;
	return function () {
		if (alreadyCalled) {
			return;
		}
		alreadyCalled = true;
		var args = Array.prototype.slice.call(arguments, 0);
		return fn.apply(null, args);
	}
}
Function.prototype.times = function (n, thisObj) {
	var callback = this;
	var i = -1;
	while (++i < n) {
		if (callback.call(thisObj, i) === false) {
			break;
		}
	}
}
Function.prototype.true = function () {
	return true;
};
Function.prototype.undefined = this.noop;
Function.prototype.variadic = function () {
	var fn = this;
	var count = Math.max(fn.length - 1, 0);
	return function () {
		var args = __slice.call(arguments, 0, count);
		args.length = count;
		args.push(__slice.call(arguments, count));
		return fn.apply(this, args);
	};
}
Function.prototype.where = function (prop, value) {
	return function (obj) {
		return obj[prop] === value;
	};
};
Function.prototype.wrap = function (wrapper) {
	return partial(wrapper, this);
}
Function.prototype.wrap = function (wrapper) {
	return this.partial(wrapper);
}
Function.spy = function (f, spier) {
	var that = this;
	spier = spier || console.log.bind(console);
	return function () {
		var args = Array.prototype.slice.call(arguments);
		var out = f.apply(that, args);
		spier.call(that, f, args, out);
		return out;
	};
}
Function.where = function (prop, value) {
	return function (obj) {
		return obj[prop] === value;
	};
};
