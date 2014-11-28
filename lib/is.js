function typeOf(x) {
	var type = Object.prototype.toString.call(x).split(' ')[1].split(']')[0];
	return type === 'Object' ? x.constructor.name : type;
}

function sizeof(mixed_var, mode) {
	return this.count(mixed_var, mode);
}

(function (root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.t = factory();
	}
}(this, function () {
	'use strict';
	var failed = false;

	function onFail(message) {
		if (!failed) {
			debugger;
		}
		failed = true;
		throw new Error(message);
	}
	var options = {
		onFail: onFail,
		update: null
	};

	function fail(message) {
		options.onFail(message);
	}

	function assert(guard) {
		if (guard !== true) {
			var args = slice.call(arguments, 1);
			var message = args[0] ? format.apply(null, args) : 'assert failed';
			fail(message);
		}
	}
	var slice = Array.prototype.slice;

	function mixin(target, source, overwrite) {
		if (Nil.is(source)) {
			return target;
		}
		for (var k in source) {
			if (source.hasOwnProperty(k)) {
				if (!overwrite) {
					assert(!target.hasOwnProperty(k), 'cannot overwrite property %s', k);
				}
				target[k] = source[k];
			}
		}
		return target;
	}

	function merge() {
		return Array.prototype.reduce.call(arguments, function (x, y) {
			return mixin(x, y, true);
		}, {});
	}

	function format() {
		var args = slice.call(arguments);
		var len = args.length;
		var i = 1;
		var message = args[0];

		function formatArgument(match, type) {
			if (match === '%%') {
				return '%';
			}
			if (i >= len) {
				return match;
			}
			var formatter = format.formatters[type];
			if (!formatter) {
				return match;
			}
			return formatter(args[i++]);
		}
		var str = message.replace(/%([a-z%])/g, formatArgument);
		if (i < len) {
			str += ' ' + args.slice(i).join(' ');
		}
		return str;
	}

	function replacer(key, value) {
		if (typeof value === 'function') {
			return format('Func', value.name);
		}
		return value;
	}
	format.formatters = {
		s: function (x) {
			return String(x);
		},
		j: function (x) {
			return JSON.stringify(x, replacer);
		}
	};

	function isType(type) {
		return Func.is(type) && Obj.is(type.meta);
	}

	function getName(type) {
		assert(isType(type), 'Invalid argument `type` of value `%j` supplied to `getName()`, expected a type.', type);
		return type.meta.name;
	}

	function deprecated(message) {
		if (console && console.warn) {
			console.warn(message);
		}
	}

	function getKind(type) {
		assert(isType(type), 'Invalid argument `type` of value `%j` supplied to `geKind()`, expected a type.', type);
		return type.meta.kind;
	}

	function isKind(type, kind) {
		deprecated('`isKind(type, kind)` is deprecated, use `getKind(type) === kind` instead');
		return getKind(type) === kind;
	}

	function blockNew(x, type) {
		assert(!(x instanceof type), 'Operator `new` is forbidden for `%s`', getName(type));
	}

	function update() {
		assert(Func.is(options.update), 'Missing `options.update` implementation');
		var T = this;
		var value = options.update.apply(T, arguments);
		return T(value);
	}

	function irriducible(name, is) {
		assert(typeof name === 'string', 'Invalid argument `name` supplied to `irriducible()`');
		assert(typeof is === 'function', 'Invalid argument `is` supplied to `irriducible()`');

		function Irriducible(value) {
			blockNew(this, Irriducible);
			assert(is(value), 'Invalid `%s` supplied to `%s`', value, name);
			return value;
		}
		Irriducible.meta = {
			kind: 'irriducible',
			name: name
		};
		Irriducible.is = is;
		return Irriducible;
	}
	var Any = irriducible('Any', function () {
		return true;
	});
	var Nil = irriducible('Nil', function (x) {
		return x === null || x === undefined;
	});
	var Str = irriducible('Str', function (x) {
		return typeof x === 'string';
	});
	var Num = irriducible('Num', function (x) {
		return typeof x === 'number' && isFinite(x) && !isNaN(x);
	});
	var Bool = irriducible('Bool', function (x) {
		return x === true || x === false;
	});
	var Arr = irriducible('Arr', function (x) {
		return x instanceof Array;
	});
	var Obj = irriducible('Obj', function (x) {
		return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
	});
	var Func = irriducible('Func', function (x) {
		return typeof x === 'function';
	});
	var Err = irriducible('Err', function (x) {
		return x instanceof Error;
	});
	var Re = irriducible('Re', function (x) {
		return x instanceof RegExp;
	});
	var Dat = irriducible('Dat', function (x) {
		return x instanceof Date;
	});
	var Type = irriducible('Type', isType);

	function struct(props, name) {
		assert(dict(Type).is(props), 'Invalid argument `props` supplied to `struct()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `struct()`');
		name = name || 'struct';

		function Struct(value, mut) {
			if (Struct.is(value)) {
				return value;
			}
			assert(Obj.is(value), 'Invalid `%s` supplied to `%s`, expected an `Obj`', value, name);
			if (!(this instanceof Struct)) {
				return new Struct(value, mut);
			}
			for (var k in props) {
				if (props.hasOwnProperty(k)) {
					var expected = props[k];
					var actual = value[k];
					this[k] = expected(actual, mut);
				}
			}
			if (!mut) {
				Object.freeze(this);
			}
		}
		Struct.meta = {
			kind: 'struct',
			props: props,
			name: name
		};
		Struct.is = function (x) {
			return x instanceof Struct;
		};
		Struct.update = update;
		return Struct;
	}

	function union(types, name) {
		assert(list(Type).is(types), 'Invalid argument `types` supplied to `union()`');
		var len = types.length;
		assert(len >= 2, 'Invalid argument `types` supplied to `union()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `union()`');
		name = name || format('union([%s])', types.map(getName).join(', '));

		function Union(value, mut) {
			blockNew(this, Union);
			assert(Func.is(Union.dispatch), 'unimplemented %s.dispatch()', name);
			var type = Union.dispatch(value);
			assert(isType(type), '%s.dispatch() returns no type', name);
			return type(value, mut);
		}
		Union.meta = {
			kind: 'union',
			types: types,
			name: name
		};
		Union.is = function (x) {
			return types.some(function (type) {
				return type.is(x);
			});
		};
		Union.dispatch = function (x) {
			for (var i = 0, len = types.length; i < len; i++) {
				if (types[i].is(x)) {
					return types[i];
				}
			}
		};
		return Union;
	}

	function maybe(type, name) {
		assert(isType(type), 'Invalid argument `type` supplied to `maybe()`');
		if (getKind(type) === 'maybe') {
			return type;
		}
		assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` supplied to `maybe()`');
		name = name || format('maybe(%s)', getName(type));

		function Maybe(value, mut) {
			blockNew(this, Maybe);
			return Nil.is(value) ? null : type(value, mut);
		}
		Maybe.meta = {
			kind: 'maybe',
			type: type,
			name: name
		};
		Maybe.is = function (x) {
			return Nil.is(x) || type.is(x);
		};
		return Maybe;
	}

	function enums(map, name) {
		assert(Obj.is(map), 'Invalid argument `map` supplied to `enums()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `enums()`');
		name = name || 'enums';
		var keys = Object.keys(map);

		function Enums(value) {
			blockNew(this, Enums);
			assert(Enums.is(value), 'Invalid `%s` supplied to `%s`, expected one of %j', value, name, keys);
			return value;
		}
		Enums.meta = {
			kind: 'enums',
			map: map,
			name: name
		};
		Enums.is = function (x) {
			return Str.is(x) && map.hasOwnProperty(x);
		};
		return Enums;
	}
	enums.of = function (keys, name) {
		keys = Str.is(keys) ? keys.split(' ') : keys;
		var value = {};
		keys.forEach(function (k) {
			value[k] = k;
		});
		return enums(value, name);
	};

	function tuple(types, name) {
		assert(list(Type).is(types), 'Invalid argument `types` supplied to `tuple()`');
		var len = types.length;
		assert(len >= 2, 'Invalid argument `types` supplied to `tuple()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `tuple()`');
		name = name || format('tuple([%s])', types.map(getName).join(', '));

		function Tuple(value, mut) {
			blockNew(this, Tuple);
			assert(Arr.is(value) && value.length === len, 'Invalid `%s` supplied to `%s`, expected an `Arr` of length `%s`', value, name, len);
			if (Tuple.isTuple(value)) {
				return value;
			}
			var arr = [];
			for (var i = 0; i < len; i++) {
				var expected = types[i];
				var actual = value[i];
				arr.push(expected(actual, mut));
			}
			if (!mut) {
				Object.freeze(arr);
			}
			return arr;
		}
		Tuple.meta = {
			kind: 'tuple',
			types: types,
			name: name
		};
		Tuple.isTuple = function (x) {
			return types.every(function (type, i) {
				return type.is(x[i]);
			});
		};
		Tuple.is = function (x) {
			return Arr.is(x) && x.length === len && Tuple.isTuple(x);
		};
		Tuple.update = update;
		return Tuple;
	}

	function subtype(type, predicate, name) {
		assert(isType(type), 'Invalid argument `type` supplied to `subtype()`');
		assert(Func.is(predicate), 'Invalid argument `predicate` supplied to `subtype()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `subtype()`');
		name = name || format('subtype(%s)', getName(type));
		var expected = predicate.__doc__ || format('insert a valid value for %s', predicate.name || 'the subtype');

		function Subtype(value, mut) {
			blockNew(this, Subtype);
			var x = type(value, mut);
			assert(predicate(x), 'Invalid `%s` supplied to `%s`, %s', value, name, expected);
			return x;
		}
		Subtype.meta = {
			kind: 'subtype',
			type: type,
			predicate: predicate,
			name: name
		};
		Subtype.is = function (x) {
			return type.is(x) && predicate(x);
		};
		return Subtype;
	}

	function list(type, name) {
		assert(isType(type), 'Invalid argument `type` supplied to `list()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `list()`');
		name = name || format('list(%s)', getName(type));

		function List(value, mut) {
			blockNew(this, List);
			assert(Arr.is(value), 'Invalid `%s` supplied to `%s`, expected an `Arr`', value, name);
			if (List.isList(value)) {
				return value;
			}
			var arr = [];
			for (var i = 0, len = value.length; i < len; i++) {
				var actual = value[i];
				arr.push(type(actual, mut));
			}
			if (!mut) {
				Object.freeze(arr);
			}
			return arr;
		}
		List.meta = {
			kind: 'list',
			type: type,
			name: name
		};
		List.isList = function (x) {
			return x.every(type.is);
		};
		List.is = function (x) {
			return Arr.is(x) && List.isList(x);
		};
		List.update = update;
		return List;
	}

	function dict(type, name) {
		assert(isType(type), 'Invalid argument `type` supplied to `dict()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `dict()`');
		name = name || format('dict(%s)', getName(type));

		function Dict(value, mut) {
			blockNew(this, Dict);
			assert(Obj.is(value), 'Invalid `%s` supplied to `%s`, expected an `Obj`', value, name);
			if (Dict.isDict(value)) {
				return value;
			}
			var obj = {};
			for (var k in value) {
				if (value.hasOwnProperty(k)) {
					var actual = value[k];
					obj[k] = type(actual, mut);
				}
			}
			if (!mut) {
				Object.freeze(obj);
			}
			return obj;
		}
		Dict.meta = {
			kind: 'dict',
			type: type,
			name: name
		};
		Dict.isDict = function (x) {
			for (var k in x) {
				if (x.hasOwnProperty(k) && !type.is(x[k])) {
					return false;
				}
			}
			return true;
		};
		Dict.is = function (x) {
			return Obj.is(x) && Dict.isDict(x);
		};
		Dict.update = update;
		return Dict;
	}

	function func(Arguments, f, Return, name) {
		name = name || 'func()';
		Arguments = Arr.is(Arguments) ? tuple(Arguments, 'Arguments') : Arguments;
		assert(isType(Arguments), 'Invalid argument `Arguments` supplied to `func()`');
		assert(Func.is(f), 'Invalid argument `f` supplied to `func()`');
		assert(Nil.is(Return) || isType(Return), 'Invalid argument `Return` supplied to `func()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `func()`');
		name = name || f.name || 'func';
		Return = Return || null;
		if (isType(f) && f.meta.Arguments === Arguments && f.meta.Return === Return) {
			return f;
		}

		function fn() {
			var args = slice.call(arguments);
			if (args.length < f.length) {
				args.length = f.length;
			}
			args = Arguments(args);
			var r = f.apply(this, args);
			if (Return) {
				r = Return(r);
			}
			return r;
		}
		fn.is = function (x) {
			return x === fn;
		};
		fn.meta = {
			kind: 'func',
			Arguments: Arguments,
			f: f,
			Return: Return,
			name: name
		};
		return fn;
	}

	function alias(type, name) {
		assert(isType(type), 'Invalid argument `type` supplied to `alias()`');
		assert(maybe(Str).is(name), 'Invalid argument `name` supplied to `alias()`');
		name = name || 'alias(' + getName(type) + ')';

		function Alias(value, mut) {
			return type(value, mut);
		}
		Alias.is = function (x) {
			return type.is(x);
		};
		Alias.meta = type.meta;
		Alias.name = name;
		return Alias;
	}
	return {
		util: {
			mixin: mixin,
			merge: merge,
			format: format,
			isType: isType,
			getName: getName,
			getKind: getKind,
			isKind: isKind,
			slice: slice
		},
		options: options,
		assert: assert,
		fail: fail,
		Any: Any,
		Nil: Nil,
		Str: Str,
		Num: Num,
		Bool: Bool,
		Arr: Arr,
		Obj: Obj,
		Func: Func,
		Err: Err,
		Re: Re,
		Dat: Dat,
		Type: Type,
		irriducible: irriducible,
		struct: struct,
		enums: enums,
		union: union,
		maybe: maybe,
		tuple: tuple,
		subtype: subtype,
		list: list,
		dict: dict,
		func: func,
		alias: alias
	};
}));

function isObject(object) {
	var type = typeof object;
	return type === 'function' || type === 'object' && !!object;
}

function isArray(object) {
	return toString.call(object) == '[object Array]';
}

function isString(object) {
	return toString.call(object) === '[object String]';
}

function isNumber(value) {
	return !isNaN(Number(value));
}

function isBoolean(value) {
	return value == false || value == true;
}

function isNull(value) {
	return value == null;
}

function isPresent(value) {
	return value != null;
}

function range(n) {
	return Array.apply(null, Array(n)).map(function (_, i) {
		return i;
	});
}

(function (global, module) {

		var exports = module.exports;

		module.exports = expect;
		expect.Assertion = Assertion;

		expect.version = '0.3.1';

		var flags = {
			not: ['to', 'be', 'have', 'include', 'only'],
			to: ['be', 'have', 'include', 'only', 'not'],
			only: ['have'],
			have: ['own'],
			be: ['an']
		};

		function expect(obj) {
			return new Assertion(obj);
		}

		function Assertion(obj, flag, parent) {
			this.obj = obj;
			this.flags = {};

			if (undefined != parent) {
				this.flags[flag] = true;

				for (var i in parent.flags) {
					if (parent.flags.hasOwnProperty(i)) {
						this.flags[i] = true;
					}
				}
			}

			var $flags = flag ? flags[flag] : keys(flags),
				self = this;

			if ($flags) {
				for (var i = 0, l = $flags.length; i < l; i++) {
					if (this.flags[$flags[i]]) continue;

					var name = $flags[i],
						assertion = new Assertion(this.obj, name, this)

					if ('function' == typeof Assertion.prototype[name]) {
						var old = this[name];
						this[name] = function () {
							return old.apply(self, arguments);
						};

						for (var fn in Assertion.prototype) {
							if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
								this[name][fn] = bind(assertion[fn], assertion);
							}
						}
					} else {
						this[name] = assertion;
					}
				}
			}
		}

		Assertion.prototype.assert = function (truth, msg, error, expected) {
			var msg = this.flags.not ? error : msg,
				ok = this.flags.not ? !truth : truth,
				err;

			if (!ok) {
				err = new Error(msg.call(this));
				if (arguments.length > 3) {
					err.actual = this.obj;
					err.expected = expected;
					err.showDiff = true;
				}
				throw err;
			}

			this.and = new Assertion(this.obj);
		};

		Assertion.prototype.ok = function () {
			this.assert(!!this.obj, function () {
				return 'expected ' + i(this.obj) + ' to be truthy'
			}, function () {
				return 'expected ' + i(this.obj) + ' to be falsy'
			});
		};

		Assertion.prototype.withArgs = function () {
			expect(this.obj).to.be.a('function');
			var fn = this.obj;
			var args = Array.prototype.slice.call(arguments);
			return expect(function () {
				fn.apply(null, args);
			});
		};

		Assertion.prototype.throwError =
			Assertion.prototype.throwException = function (fn) {
				expect(this.obj).to.be.a('function');

				var thrown = false,
					not = this.flags.not;

				try {
					this.obj();
				} catch (e) {
					if (isRegExp(fn)) {
						var subject = 'string' == typeof e ? e : e.message;
						if (not) {
							expect(subject).to.not.match(fn);
						} else {
							expect(subject).to.match(fn);
						}
					} else if ('function' == typeof fn) {
						fn(e);
					}
					thrown = true;
				}

				if (isRegExp(fn) && not) {
					this.flags.not = false;
				}

				var name = this.obj.name || 'fn';
				this.assert(
					thrown, function () {
						return 'expected ' + name + ' to throw an exception'
					}, function () {
						return 'expected ' + name + ' not to throw an exception'
					});
		};

		Assertion.prototype.empty = function () {
			var expectation;

			if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
				if ('number' == typeof this.obj.length) {
					expectation = !this.obj.length;
				} else {
					expectation = !keys(this.obj).length;
				}
			} else {
				if ('string' != typeof this.obj) {
					expect(this.obj).to.be.an('object');
				}

				expect(this.obj).to.have.property('length');
				expectation = !this.obj.length;
			}

			this.assert(
				expectation, function () {
					return 'expected ' + i(this.obj) + ' to be empty'
				}, function () {
					return 'expected ' + i(this.obj) + ' to not be empty'
				});
			return this;
		};

		Assertion.prototype.be =
			Assertion.prototype.equal = function (obj) {
				this.assert(
					obj === this.obj, function () {
						return 'expected ' + i(this.obj) + ' to equal ' + i(obj)
					}, function () {
						return 'expected ' + i(this.obj) + ' to not equal ' + i(obj)
					});
				return this;
		};

		Assertion.prototype.eql = function (obj) {
			this.assert(
				expect.eql(this.obj, obj), function () {
					return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj)
				}, function () {
					return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj)
				}, obj);
			return this;
		};

		Assertion.prototype.within = function (start, finish) {
			var range = start + '..' + finish;
			this.assert(
				this.obj >= start && this.obj <= finish, function () {
					return 'expected ' + i(this.obj) + ' to be within ' + range
				}, function () {
					return 'expected ' + i(this.obj) + ' to not be within ' + range
				});
			return this;
		};

		Assertion.prototype.a =
			Assertion.prototype.an = function (type) {
				if ('string' == typeof type) {
					var n = /^[aeiou]/.test(type) ? 'n' : '';
					this.assert(
						'array' == type ? isArray(this.obj) :
						'regexp' == type ? isRegExp(this.obj) :
						'object' == type ? 'object' == typeof this.obj && null !== this.obj : type == typeof this.obj, function () {
							return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type
						}, function () {
							return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type
						});
				} else {
					var name = type.name || 'supplied constructor';
					this.assert(
						this.obj instanceof type, function () {
							return 'expected ' + i(this.obj) + ' to be an instance of ' + name
						}, function () {
							return 'expected ' + i(this.obj) + ' not to be an instance of ' + name
						});
				}

				return this;
		};

		Assertion.prototype.greaterThan =
			Assertion.prototype.above = function (n) {
				this.assert(
					this.obj > n, function () {
						return 'expected ' + i(this.obj) + ' to be above ' + n
					}, function () {
						return 'expected ' + i(this.obj) + ' to be below ' + n
					});
				return this;
		};

		Assertion.prototype.lessThan =
			Assertion.prototype.below = function (n) {
				this.assert(
					this.obj < n, function () {
						return 'expected ' + i(this.obj) + ' to be below ' + n
					}, function () {
						return 'expected ' + i(this.obj) + ' to be above ' + n
					});
				return this;
		};

		Assertion.prototype.match = function (regexp) {
			this.assert(
				regexp.exec(this.obj), function () {
					return 'expected ' + i(this.obj) + ' to match ' + regexp
				}, function () {
					return 'expected ' + i(this.obj) + ' not to match ' + regexp
				});
			return this;
		};

		Assertion.prototype.length = function (n) {
			expect(this.obj).to.have.property('length');
			var len = this.obj.length;
			this.assert(
				n == len, function () {
					return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len
				}, function () {
					return 'expected ' + i(this.obj) + ' to not have a length of ' + len
				});
			return this;
		};

		Assertion.prototype.property = function (name, val) {
			if (this.flags.own) {
				this.assert(
					Object.prototype.hasOwnProperty.call(this.obj, name), function () {
						return 'expected ' + i(this.obj) + ' to have own property ' + i(name)
					}, function () {
						return 'expected ' + i(this.obj) + ' to not have own property ' + i(name)
					});
				return this;
			}

			if (this.flags.not && undefined !== val) {
				if (undefined === this.obj[name]) {
					throw new Error(i(this.obj) + ' has no property ' + i(name));
				}
			} else {
				var hasProp;
				try {
					hasProp = name in this.obj
				} catch (e) {
					hasProp = undefined !== this.obj[name]
				}

				this.assert(
					hasProp, function () {
						return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
					}, function () {
						return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
					});
			}

			if (undefined !== val) {
				this.assert(
					val === this.obj[name], function () {
						return 'expected ' + i(this.obj) + ' to have a property ' + i(name) + ' of ' + i(val) + ', but got ' + i(this.obj[name])
					}, function () {
						return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) + ' of ' + i(val)
					});
			}

			this.obj = this.obj[name];
			return this;
		};

		Assertion.prototype.string =
			Assertion.prototype.contain = function (obj) {
				if ('string' == typeof this.obj) {
					this.assert(~this.obj.indexOf(obj), function () {
						return 'expected ' + i(this.obj) + ' to contain ' + i(obj)
					}, function () {
						return 'expected ' + i(this.obj) + ' to not contain ' + i(obj)
					});
				} else {
					this.assert(~indexOf(this.obj, obj), function () {
						return 'expected ' + i(this.obj) + ' to contain ' + i(obj)
					}, function () {
						return 'expected ' + i(this.obj) + ' to not contain ' + i(obj)
					});
				}
				return this;
		};

		Assertion.prototype.key =
			Assertion.prototype.keys = function ($keys) {
				var str, ok = true;

				$keys = isArray($keys) ? $keys : Array.prototype.slice.call(arguments);

				if (!$keys.length) throw new Error('keys required');

				var actual = keys(this.obj),
					len = $keys.length;
				ok = every($keys, function (key) {
					return~ indexOf(actual, key);
				});
				if (!this.flags.not && this.flags.only) {
					ok = ok && $keys.length == actual.length;
				}
				if (len > 1) {
					$keys = map($keys, function (key) {
						return i(key);
					});
					var last = $keys.pop();
					str = $keys.join(', ') + ', and ' + last;
				} else {
					str = i($keys[0]);
				}
				str = (len > 1 ? 'keys ' : 'key ') + str;
				str = (!this.flags.only ? 'include ' : 'only have ') + str;
				this.assert(
					ok, function () {
						return 'expected ' + i(this.obj) + ' to ' + str
					}, function () {
						return 'expected ' + i(this.obj) + ' to not ' + str
					});

				return this;
		};

		Assertion.prototype.fail = function (msg) {
			var error = function () {
				return msg || "explicit failure";
			}
			this.assert(false, error, error);
			return this;
		};

		function bind(fn, scope) {
			return function () {
				return fn.apply(scope, arguments);
			}
		}

		function every(arr, fn, thisObj) {
			var scope = thisObj || global;
			for (var i = 0, j = arr.length; i < j; ++i) {
				if (!fn.call(scope, arr[i], i, arr)) {
					return false;
				}
			}
			return true;
		}

		function indexOf(arr, o, i) {
			if (Array.prototype.indexOf) {
				return Array.prototype.indexOf.call(arr, o, i);
			}

			if (arr.length === undefined) {
				return -1;
			}

			for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0; i < j && arr[i] !== o; i++);

			return j <= i ? -1 : i;
		}
		var getOuterHTML = function (element) {
			if ('outerHTML' in element) return element.outerHTML;
			var ns = "http://www.w3.org/1999/xhtml";
			var container = document.createElementNS(ns, '_');
			var xmlSerializer = new XMLSerializer();
			var html;
			if (document.xmlVersion) {
				return xmlSerializer.serializeToString(element);
			} else {
				container.appendChild(element.cloneNode(false));
				html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
				container.innerHTML = '';
				return html;
			}
		};
		var isDOMElement = function (object) {
			if (typeof HTMLElement === 'object') {
				return object instanceof HTMLElement;
			} else {
				return object &&
					typeof object === 'object' &&
					object.nodeType === 1 &&
					typeof object.nodeName === 'string';
			}
		};

		function i(obj, showHidden, depth) {
			var seen = [];

			function stylize(str) {
				return str;
			}

			function format(value, recurseTimes) {
				if (value && typeof value.inspect === 'function' &&
					value !== exports &&
					!(value.constructor && value.constructor.prototype === value)) {
					return value.inspect(recurseTimes);
				}
				switch (typeof value) {
				case 'undefined':
					return stylize('undefined', 'undefined');

				case 'string':
					var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
						.replace(/'/g, "\\'")
						.replace(/\\"/g, '"') + '\'';
					return stylize(simple, 'string');

				case 'number':
					return stylize('' + value, 'number');

				case 'boolean':
					return stylize('' + value, 'boolean');
				}
				if (value === null) {
					return stylize('null', 'null');
				}

				if (isDOMElement(value)) {
					return getOuterHTML(value);
				}
				var visible_keys = keys(value);
				var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;
				if (typeof value === 'function' && $keys.length === 0) {
					if (isRegExp(value)) {
						return stylize('' + value, 'regexp');
					} else {
						var name = value.name ? ': ' + value.name : '';
						return stylize('[Function' + name + ']', 'special');
					}
				}
				if (isDate(value) && $keys.length === 0) {
					return stylize(value.toUTCString(), 'date');
				}
				if (value instanceof Error) {
					return stylize("[" + value.toString() + "]", 'Error');
				}

				var base, type, braces;
				if (isArray(value)) {
					type = 'Array';
					braces = ['[', ']'];
				} else {
					type = 'Object';
					braces = ['{', '}'];
				}
				if (typeof value === 'function') {
					var n = value.name ? ': ' + value.name : '';
					base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
				} else {
					base = '';
				}
				if (isDate(value)) {
					base = ' ' + value.toUTCString();
				}

				if ($keys.length === 0) {
					return braces[0] + base + braces[1];
				}

				if (recurseTimes < 0) {
					if (isRegExp(value)) {
						return stylize('' + value, 'regexp');
					} else {
						return stylize('[Object]', 'special');
					}
				}

				seen.push(value);

				var output = map($keys, function (key) {
					var name, str;
					if (value.__lookupGetter__) {
						if (value.__lookupGetter__(key)) {
							if (value.__lookupSetter__(key)) {
								str = stylize('[Getter/Setter]', 'special');
							} else {
								str = stylize('[Getter]', 'special');
							}
						} else {
							if (value.__lookupSetter__(key)) {
								str = stylize('[Setter]', 'special');
							}
						}
					}
					if (indexOf(visible_keys, key) < 0) {
						name = '[' + key + ']';
					}
					if (!str) {
						if (indexOf(seen, value[key]) < 0) {
							if (recurseTimes === null) {
								str = format(value[key]);
							} else {
								str = format(value[key], recurseTimes - 1);
							}
							if (str.indexOf('\n') > -1) {
								if (isArray(value)) {
									str = map(str.split('\n'), function (line) {
										return '  ' + line;
									}).join('\n').substr(2);
								} else {
									str = '\n' + map(str.split('\n'), function (line) {
										return '   ' + line;
									}).join('\n');
								}
							}
						} else {
							str = stylize('[Circular]', 'special');
						}
					}
					if (typeof name === 'undefined') {
						if (type === 'Array' && key.match(/^\d+$/)) {
							return str;
						}
						name = json.stringify('' + key);
						if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
							name = name.substr(1, name.length - 2);
							name = stylize(name, 'name');
						} else {
							name = name.replace(/'/g, "\\'")
								.replace(/\\"/g, '"')
								.replace(/(^"|"$)/g, "'");
							name = stylize(name, 'string');
						}
					}

					return name + ': ' + str;
				});

				seen.pop();

				var numLinesEst = 0;
				var length = reduce(output, function (prev, cur) {
					numLinesEst++;
					if (indexOf(cur, '\n') >= 0) numLinesEst++;
					return prev + cur.length + 1;
				}, 0);

				if (length > 50) {
					output = braces[0] +
						(base === '' ? '' : base + '\n ') +
						' ' +
						output.join(',\n  ') +
						' ' +
						braces[1];

				} else {
					output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
				}

				return output;
			}
			return format(obj, (typeof depth === 'undefined' ? 2 : depth));
		}

		expect.stringify = i;

		function isArray(ar) {
			return Object.prototype.toString.call(ar) === '[object Array]';
		}

		function isRegExp(re) {
			var s;
			try {
				s = '' + re;
			} catch (e) {
				return false;
			}

			return re instanceof RegExp ||
				typeof (re) === 'function' &&
				re.constructor.name === 'RegExp' &&
				re.compile &&
				re.test &&
				re.exec &&
				s.match(/^\/.*\/[gim]{0,3}$/);
		}

		function isDate(d) {
			return d instanceof Date;
		}

		function keys(obj) {
			if (Object.keys) {
				return Object.keys(obj);
			}

			var keys = [];

			for (var i in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, i)) {
					keys.push(i);
				}
			}

			return keys;
		}

		function map(arr, mapper, that) {
			if (Array.prototype.map) {
				return Array.prototype.map.call(arr, mapper, that);
			}

			var other = new Array(arr.length);

			for (var i = 0, n = arr.length; i < n; i++)
				if (i in arr)
					other[i] = mapper.call(that, arr[i], i, arr);

			return other;
		}

		function reduce(arr, fun) {
			if (Array.prototype.reduce) {
				return Array.prototype.reduce.apply(
					arr, Array.prototype.slice.call(arguments, 1)
				);
			}

			var len = +this.length;

			if (typeof fun !== "function")
				throw new TypeError();
			if (len === 0 && arguments.length === 1)
				throw new TypeError();

			var i = 0;
			if (arguments.length >= 2) {
				var rv = arguments[1];
			} else {
				do {
					if (i in this) {
						rv = this[i++];
						break;
					}
					if (++i >= len)
						throw new TypeError();
				} while (true);
			}

			for (; i < len; i++) {
				if (i in this)
					rv = fun.call(null, rv, this[i], i, this);
			}

			return rv;
		}

		expect.eql = function eql(actual, expected) {
			if (actual === expected) {
				return true;
			} else if ('undefined' != typeof Buffer && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
				if (actual.length != expected.length) return false;

				for (var i = 0; i < actual.length; i++) {
					if (actual[i] !== expected[i]) return false;
				}

				return true;
			} else if (actual instanceof Date && expected instanceof Date) {
				return actual.getTime() === expected.getTime();
			} else if (typeof actual != 'object' && typeof expected != 'object') {
				return actual == expected;
			} else if (isRegExp(actual) && isRegExp(expected)) {
				return regExpEquiv(actual, expected);
			} else {
				return objEquiv(actual, expected);
			}
		};

		function isUndefinedOrNull(value) {
			return value === null || value === undefined;
		}

		function isArguments(object) {
			return Object.prototype.toString.call(object) == '[object Arguments]';
		}

		function regExpEquiv(a, b) {
			return a.source === b.source && a.global === b.global &&
				a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
		}

		function objEquiv(a, b) {
			if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
				return false;
			if (a.prototype !== b.prototype) return false;
			if (isArguments(a)) {
				if (!isArguments(b)) {
					return false;
				}
				a = pSlice.call(a);
				b = pSlice.call(b);
				return expect.eql(a, b);
			}
			try {
				var ka = keys(a),
					kb = keys(b),
					key, i;
			} catch (e)
			return false;
		}
		if (ka.length != kb.length)
			return false;
		ka.sort();
		kb.sort();
		for (i = ka.length - 1; i >= 0; i--) {
			if (ka[i] != kb[i])
				return false;
		}
		for (i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if (!expect.eql(a[key], b[key]))
				return false;
		}
		return true;
	}

	var json = (function () {
		"use strict";

		if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
			return {
				parse: nativeJSON.parse,
				stringify: nativeJSON.stringify
			}
		}

		var JSON = {};

		function f(n) {
			return n < 10 ? '0' + n : n;
		}

		function date(d, key) {
			return isFinite(d.valueOf()) ?
				d.getUTCFullYear() + '-' +
				f(d.getUTCMonth() + 1) + '-' +
				f(d.getUTCDate()) + 'T' +
				f(d.getUTCHours()) + ':' +
				f(d.getUTCMinutes()) + ':' +
				f(d.getUTCSeconds()) + 'Z' : null;
		}

		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap,
			indent,
			meta = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			},
			rep;

		function quote(string) {

			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}

		function str(key, holder) {

			var i,
				k,
				v,
				length,
				mind = gap,
				partial,
				value = holder[key];

			if (value instanceof Date) {
				value = date(key);
			}

			if (typeof rep === 'function') {
				value = rep.call(holder, key, value);
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

				gap += indent;
				partial = [];

				if (Object.prototype.toString.apply(value) === '[object Array]') {

					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					v = partial.length === 0 ? '[]' : gap ?
						'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
						'[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

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

					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				v = partial.length === 0 ? '{}' : gap ?
					'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
					'{' + partial.join(',') + '}';
				gap = mind;
				return v;
			}
		}

		JSON.stringify = function (value, replacer, space) {

			var i;
			gap = '';
			indent = '';

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

			} else if (typeof space === 'string') {
				indent = space;
			}

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
				(typeof replacer !== 'object' ||
					typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			return str('', {
				'': value
			});
		};

		JSON.parse = function (text, reviver) {

			var j;

			function walk(holder, key) {

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

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			if (/^[\],:{}\s]*$/
				.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
					.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
					.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

				j = eval('(' + text + ')');

				return typeof reviver === 'function' ?
					walk({
						'': j
					}, '') : j;
			}

			throw new SyntaxError('JSON.parse');
		};

		return JSON;
	})();

	if ('undefined' != typeof window) {
		window.expect = module.exports;
	}

})(
	this, 'undefined' != typeof module ? module : {
		exports: {}
	}
);

function define(name, value) {
	var defn, replace, script, that = this,
		d = this.window.document;
	var toString = function (name, value) {
		return 'const ' + name + '=' + (/^(null|true|false|(\+|\-)?\d+(\.\d+)?)$/.test(value = String(value)) ? value : '"' + replace(value) + '"');
	};
	try {
		eval('const e=1');
		replace = function (value) {
			var replace = {
				'\x08': 'b',
				'\x0A': '\\n',
				'\x0B': 'v',
				'\x0C': 'f',
				'\x0D': '\\r',
				'"': '"',
				'\\': '\\'
			};
			return value.replace(/\x08|[\x0A-\x0D]|"|\\/g, function (value) {
				return '\\' + replace[value];
			});
		};
		defn = function (name, value) {
			if (d.createElementNS) {
				script = d.createElementNS('http://www.w3.org/1999/xhtml', 'script');
			} else {
				script = d.createElement('script');
			}
			script.type = 'text/javascript';
			script.appendChild(d.createTextNode(toString(name, value)));
			d.documentElement.appendChild(script);
			d.documentElement.removeChild(script);
		};
	} catch (e) {
		replace = function (value) {
			var replace = {
				'\x0A': '\\n',
				'\x0D': '\\r'
			};
			return value.replace(/"/g, '""').replace(/\n|\r/g, function (value) {
				return replace[value];
			});
		};
		defn = (this.execScript ?
			function (name, value) {
				that.execScript(toString(name, value), 'VBScript');
			} : function (name, value) {
				eval(toString(name, value).substring(6));
			};);
	}
	defn(name, value);
}

function defined(constant_name) {
	var tmp = this.window[constant_name];

	this.window[constant_name] = this.window[constant_name] ? 'changed' + this.window[constant_name].toString() : 'changed';
	var returnval = this.window[constant_name] === tmp;
	if (!returnval) {
		this.window[constant_name] = tmp;
	}

	return returnval;
}

function get_resource_type(handle) {
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	if (!handle || typeof handle !== 'object' || !handle.constructor || getFuncName(handle.constructor) !== 'PHPJS_Resource') {
		return false;
	}
	return handle.get_resource_type();
}

function gettype(mixed_var) {
	var s = typeof mixed_var,
		name;
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/)
			.exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	if (s === 'object') {
		if (mixed_var !== null) {
			if (typeof mixed_var.length === 'number' && !(mixed_var.propertyIsEnumerable('length')) && typeof mixed_var
				.splice === 'function') {
				s = 'array';
			} else if (mixed_var.constructor && getFuncName(mixed_var.constructor)) {
				name = getFuncName(mixed_var.constructor);
				if (name === 'Date') {
					s = 'date';
				} else if (name === 'RegExp') {
					s = 'regexp';
				} else if (name === 'PHPJS_Resource') {
					s = 'resource';
				}
			}
		} else {
			s = 'null';
		}
	} else if (s === 'number') {
		s = this.is_float(mixed_var) ? 'double' : 'integer';
	}
	return s;
}

function intval(mixed_var, base) {
	var tmp;
	var type = typeof mixed_var;
	if (type === 'boolean') {
		return +mixed_var;
	} else if (type === 'string') {
		tmp = parseInt(mixed_var, base || 10);
		return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;
	} else if (type === 'number' && isFinite(mixed_var)) {
		return mixed_var | 0;
	} else {
		return 0;
	}
}

function is_array(mixed_var) {
	var ini,
		_getFuncName = function (fn) {
			var name = (/\W*function\s+([\w\$]+)\s*\(/)
				.exec(fn);
			if (!name) {
				return '(Anonymous)';
			}
			return name[1];
		};
	_isArray = function (mixed_var) {
		if (!mixed_var || typeof mixed_var !== 'object' || typeof mixed_var.length !== 'number') {
			return false;
		}
		var len = mixed_var.length;
		mixed_var[mixed_var.length] = 'bogus';
		if (len !== mixed_var.length) {
			mixed_var.length -= 1;
			return true;
		}
		delete mixed_var[mixed_var.length];
		return false;
	};
	if (!mixed_var || typeof mixed_var !== 'object') {
		return false;
	}
	this.php_js = this.php_js || {};
	this.php_js.ini = this.php_js.ini || {};
	ini = this.php_js.ini['phpjs.objectsAsArrays'];
	return _isArray(mixed_var) ||
		((!ini || (
			(parseInt(ini.local_value, 10) !== 0 && (!ini.local_value.toLowerCase || ini.local_value.toLowerCase() !==
				'off')))) && (
			Object.prototype.toString.call(mixed_var) === '[object Object]' && _getFuncName(mixed_var.constructor) ===
			'Object'
		));
}

function is_binary(vr) {
	return typeof vr === 'string';
}

function is_bool(mixed_var) {
	return (mixed_var === true || mixed_var === false);
}

function is_buffer(vr) {
	return typeof vr === 'string';
}

function is_callable(v, syntax_only, callable_name) {
	var name = '',
		obj = {},
		method = '';
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/)
			.exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	if (typeof v === 'string') {
		obj = this.window;
		method = v;
		name = v;
	} else if (typeof v === 'function') {
		return true;
	} else if (Object.prototype.toString.call(v) === '[object Array]' &&
		v.length === 2 && typeof v[0] === 'object' && typeof v[1] === 'string') {
		obj = v[0];
		method = v[1];
		name = (obj.constructor && getFuncName(obj.constructor)) + '::' + method;
	} else {
		return false;
	}
	if (syntax_only || typeof obj[method] === 'function') {
		if (callable_name) {
			this.window[callable_name] = name;
		}
		return true;
	}
	return false;
}

function is_double(mixed_var) {
	return this.is_float(mixed_var);
}

function is_float(mixed_var) {
	return +mixed_var === mixed_var && (!isFinite(mixed_var) || !!(mixed_var % 1));
}

function is_int(mixed_var) {
	return mixed_var === +mixed_var && isFinite(mixed_var) && !(mixed_var % 1);
}

function is_integer(mixed_var) {
	return this.is_int(mixed_var);
}

function is_long(mixed_var) {
	return this.is_float(mixed_var);
}

function is_null(mixed_var) {
	return (mixed_var === null);
}

function is_numeric(mixed_var) {
	var type = typeof mixed_var,
		valid_number = /^[+\-]?(?:0x[\da-f]+|(?:(?:\d+(?:\.\d*)?|\.\d+))(e[+\-]?\d+)?)$/i;
	return !isNaN(mixed_var) && (type === 'number' || (type === 'string' && valid_number.test(mixed_var));
	}

	function is_numeric(mixed_var) {
		var whitespace =
			" \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
		return (typeof mixed_var === 'number' || (typeof mixed_var === 'string' && whitespace.indexOf(mixed_var.slice(-1)) === -
			1)) && mixed_var !== '' && !isNaN(mixed_var);
	}

	function is_object(mixed_var) {
		if (Object.prototype.toString.call(mixed_var) === '[object Array]') {
			return false;
		}
		return mixed_var !== null && typeof mixed_var === 'object';
	}

	function is_real(mixed_var) {
		return this.is_float(mixed_var);
	}

	function is_resource(handle) {
		var getFuncName = function (fn) {
			var name = (/\W*function\s+([\w\$]+)\s*\(/)
				.exec(fn);
			if (!name) {
				return '(Anonymous)';
			}
			return name[1];
		};
		return !(!handle || typeof handle !== 'object' || !handle.constructor || getFuncName(handle.constructor) !==
			'PHPJS_Resource');
	}

	function is_scalar(mixed_var) {
		return (/boolean|number|string/)
			.test(typeof mixed_var);
	}

	function is_string(mixed_var) {
		return (typeof mixed_var === 'string');
	}

	function is_unicode(vr) {
		if (typeof vr !== 'string') {
			return false;
		}
		var arr = [],
			any = '([\s\S])',
			highSurrogate = '[\uD800-\uDBFF]',
			lowSurrogate = '[\uDC00-\uDFFF]',
			highSurrogateBeforeAny = new RegExp(highSurrogate + any, 'g'),
			lowSurrogateAfterAny = new RegExp(any + lowSurrogate, 'g'),
			singleLowSurrogate = new RegExp('^' + lowSurrogate + '$'),
			singleHighSurrogate = new RegExp('^' + highSurrogate + '$');
		while ((arr = highSurrogateBeforeAny.exec(vr)) !== null) {
			if (!arr[1] || !arr[1].match(singleLowSurrogate)) {
				return false;
			}
		}
		while ((arr = lowSurrogateAfterAny.exec(vr)) !== null) {
			if (!arr[1] || !arr[1].match(singleHighSurrogate)) {
				return false;
			}
		}
		return true;
	}

	function isset() {
		var a = arguments,
			l = a.length,
			i = 0,
			undef;
		if (l === 0) {
			throw new Error('Empty isset');
		}
		while (i !== l) {
			if (a[i] === undef || a[i] === null) {
				return false;
			}
			i++;
		}
		return true;
	}
	(function (global) {
		"use strict";

		var _jShould = global.jShould;
		var _$$ = global.$$;

		var is = function (value, type) {
				return type === value == null ? '' + value : ({}).toString.call(value).slice(8, -1).toLowerCase();
			},
			contains = function (source, value) {
				if (is(source, 'string')) {
					return source.indexOf(value) !== -1;
				} else if (is(source, 'array')) {
					if (Array.prototype.indexOf) {
						return source.indexOf(value) !== -1;
					}

					for (var i = 0, il = source.length; i < il; i++) {
						if (source[i] === value) {
							return true;
						}
					}
				} else if (is(source, 'object')) {
					for (var prop in source) {
						if (source.hasOwnProperty(prop) && prop === value) {
							return true;
						}
					}
				}

				return false;
			},
			isEmpty = function (value) {
				if (!is(value, 'object')) {
					return !value.length;
				} else {
					for (var prop in value) {
						if (value.hasOwnProperty(prop)) {
							return false;
						}
					}

					return true;
				}
			};

		var jShould = function (value) {
			if (!(this instanceof jShould)) {
				return new jShould(value);
			}

			this.context = value;
		};

		jShould.prototype = {
			shouldEqual: function (value) {
				deepEqual(this.context, value, 'The arguments should have been equal.');
				return this;
			},
			shouldNotEqual: function (value) {
				notDeepEqual(this.context, value, 'The arguments should not have been equal.');
				return this;
			},
			shouldBeType: function (type) {
				ok(typeof this.context === type, 'The argument should have been of type: "' + type + '".');
				return this;
			},
			shouldNotBeType: function (type) {
				ok(typeof this.context !== type, 'The argument should not have been of type: "' + type + '".');
				return this;
			},
			shouldContain: function (value) {
				ok(contains(this.context, value), 'The argument should have contained "' + value + '".');
				return this;
			},
			shouldNotContain: function (value) {
				ok(!contains(this.context, value), 'The argument should not have contained "' + value + '".');
				return this;
			},
			shouldBeNull: function () {
				ok(is(this.context, 'null'), 'The argument should have been null.');
				return this;
			},
			shouldNotBeNull: function () {
				ok(!is(this.context, 'null'), 'The argument should have been null.');
				return this;
			},
			shouldBeEmpty: function () {
				ok(isEmpty(this.context), 'The argument should have been empty.');
				return this;
			},
			shouldNotBeEmpty: function () {
				ok(!isEmpty(this.context), 'The argument should not have been empty.');
				return this;
			},
			shouldBeUndefined: function () {
				ok(is(this.context, 'undefined'), 'The argument should have been undefined.');
				return this;
			},
			shouldBeDefined: function () {
				ok(!is(this.context, 'undefined'), 'The argument should have been defined.');
				return this;
			},
			shouldBeTrue: function () {
				ok(this.context === true, 'The argument should have been true.');
				return this;
			},
			shouldBeFalse: function () {
				ok(this.context === false, 'The argument should have been false.');
				return this;
			},
			shouldBeLessThan: function (num) {
				ok(is(this.context, 'number') && this.context < num, 'The argument should have been less than ' + num + '.');
				return this;
			},
			shouldBeMoreThan: function (num) {
				ok(is(this.context, 'number') && this.context > num, 'The argument should have been more than ' + num + '.');
				return this;
			},
			shouldThrowException: function () {
				raises(this.context, 'The argument should have thrown an exception.');
				return this;
			}
		};

		jShould.extend = function (name, message, expression) {
			jShould.prototype[name] = function () {
				ok(expression(this.context), message);
				return this;
			};
		};

		jShould.noConflict = function () {
			global.$$ = _$$;
			global.jShould = _jShould;

			return jShould;
		};

		global.$$ = global.jShould = jShould;
	})(this);

	function compare(a, b) {
		return a > b ? 1 :
			a < b ? -1 :
			0;
	}

	function compareProperty(property) {
		return function (a, b) {
			return compare(a[property], b[property]);
		};
	}

	function dynamicCompare(props) {

		if (!props || !(props instanceof Array)) {
			throw new Error('props is falsey or not an Array');
		}

		return function (a, b) {
			var len = props.length;
			for (var i = 0; i < len; i++) {
				var aVal, bVal, sortDir;
				if (typeof props[i] == 'function') {
					aVal = props[i](a);
					bVal = props[i](b);
					sortDir = 'asc';
				} else if (props[i].toLowerCase().indexOf(' ') >= 0) {
					var splitVal = props[i].split(' ');
					aVal = a[splitVal[0]];
					bVal = b[splitVal[0]];
					sortDir = splitVal[1].toLowerCase();
				} else {
					aVal = a[props[i]];
					bVal = b[props[i]];
					sortDir = 'asc';
				}
				if (aVal != bVal) {
					return sortDir == 'asc' ? compare(aVal, bVal) : compare(bVal, aVal);
				}
			}
			return 0;
		};
	}

	function equals(a, b) {

		if (typeof a !== typeof b) {
			return false;
		}
		if (a instanceof Array) {
			if (a.length !== b.length) {
				return false;
			}
			for (var i = 0, l = a.length; i < l; i++) {
				if (!b || !b[i] || !equals(a[i], b[i])) {
					return false;
				}
			}
		} else if (typeof a === 'number' || typeof a === 'string' || typeof a === 'boolean' || typeof a === 'undefined') {
			if (a !== b) {
				return false;
			}
		} else if (Object.keys(a).length === Object.keys(b)) {
			for (var property in a) {
				if (!(property in b && b[property] === a[property])) {
					return false;
				}
			}
		} else {
			return a === b;
		}

		return true;
	}

	function isValue(x) {
		return x !== undefined && x !== null && x !== '';
	}

	function typeOf(value) {
		var s = typeof value;
		if (s === 'object') {
			if (value) {
				if (typeof value.length === 'number' &&
					!(value.propertyIsEnumerable('length')) &&
					typeof value.splice === 'function') {
					s = 'array';
				}
			} else {
				s = 'null';
			}
		}
		return s;
	}

	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0

	(function (module) {

			if (typeof module.exports === 'undefined') {
				module.exports = module;
			}
			var create = Object.create || function (p) {
				if (!p) throw Error('no type');

				function f() {};
				f.prototype = p;
				return new f();
			};
			var util = {
				inherits: function (ctor, superCtor) {
					ctor.super_ = superCtor;
					ctor.prototype = create(superCtor.prototype, {
						constructor: {
							value: ctor,
							enumerable: false,
							writable: true,
							configurable: true
						}
					});
				},
				isArray: function (ar) {
					return Array.isArray(ar);
				},
				isBoolean: function (arg) {
					return typeof arg === 'boolean';
				},
				isNull: function (arg) {
					return arg === null;
				},
				isNullOrUndefined: function (arg) {
					return arg == null;
				},
				isNumber: function (arg) {
					return typeof arg === 'number';
				},
				isString: function (arg) {
					return typeof arg === 'string';
				},
				isSymbol: function (arg) {
					return typeof arg === 'symbol';
				},
				isUndefined: function (arg) {
					return arg === void 0;
				},
				isRegExp: function (re) {
					return util.isObject(re) && util.objectToString(re) === '[object RegExp]';
				},
				isObject: function (arg) {
					return typeof arg === 'object' && arg !== null;
				},
				isDate: function (d) {
					return util.isObject(d) && util.objectToString(d) === '[object Date]';
				},
				isError: function (e) {
					return isObject(e) &&
						(objectToString(e) === '[object Error]' || e instanceof Error);
				},
				isFunction: function (arg) {
					return typeof arg === 'function';
				},
				isPrimitive: function (arg) {
					return arg === null ||
						typeof arg === 'boolean' ||
						typeof arg === 'number' ||
						typeof arg === 'string' ||
						typeof arg === 'symbol' ||
						typeof arg === 'undefined';
				},
				objectToString: function (o) {
					return Object.prototype.toString.call(o);
				}
			};

			var pSlice = Array.prototype.slice;
			var Object_keys = typeof Object.keys === 'function' ? Object.keys : function (obj) {
				var keys = [];
				for (var key in obj) keys.push(key);
				return keys;
			};

			var assert = module.exports = ok;

			assert.AssertionError = function AssertionError(options) {
				this.name = 'AssertionError';
				this.actual = options.actual;
				this.expected = options.expected;
				this.operator = options.operator;
				if (options.message) {
					this.message = options.message;
					this.generatedMessage = false;
				} else {
					this.message = getMessage(this);
					this.generatedMessage = true;
				}
				var stackStartFunction = options.stackStartFunction || fail;
				if (Error.captureStackTrace) {
					Error.captureStackTrace(this, stackStartFunction);
				} else {
					try {
						this.stack = (new Error).stack.toString();
					} catch (e) {}
				}
			};
			util.inherits(assert.AssertionError, Error);

			function replacer(key, value) {
				if (util.isUndefined(value)) {
					return '' + value;
				}
				if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
					return value.toString();
				}
				if (util.isFunction(value) || util.isRegExp(value)) {
					return value.toString();
				}
				return value;
			}

			function truncate(s, n) {
				if (util.isString(s)) {
					return s.length < n ? s : s.slice(0, n);
				} else {
					return s;
				}
			}

			function getMessage(self) {
				return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
					self.operator + ' ' +
					truncate(JSON.stringify(self.expected, replacer), 128);
			}

			function fail(actual, expected, message, operator, stackStartFunction) {
				throw new assert.AssertionError({
					message: message,
					actual: actual,
					expected: expected,
					operator: operator,
					stackStartFunction: stackStartFunction
				});
			}
			assert.fail = fail;

			function ok(value, message) {
				if (!value) fail(value, true, message, '==', assert.ok);
			}
			assert.ok = ok;

			assert.equal = function equal(actual, expected, message) {
				if (actual != expected) fail(actual, expected, message, '==', assert.equal);
			};

			assert.notEqual = function notEqual(actual, expected, message) {
				if (actual == expected) {
					fail(actual, expected, message, '!=', assert.notEqual);
				}
			};

			assert.deepEqual = function deepEqual(actual, expected, message) {
				if (!_deepEqual(actual, expected)) {
					fail(actual, expected, message, 'deepEqual', assert.deepEqual);
				}
			};

			function _deepEqual(actual, expected) {
				if (actual === expected) {
					return true;
				} else if (util.isDate(actual) && util.isDate(expected)) {
					return actual.getTime() === expected.getTime();
				} else if (util.isRegExp(actual) && util.isRegExp(expected)) {
					return actual.source === expected.source &&
						actual.global === expected.global &&
						actual.multiline === expected.multiline &&
						actual.lastIndex === expected.lastIndex &&
						actual.ignoreCase === expected.ignoreCase;
				} else if (!util.isObject(actual) && !util.isObject(expected)) {
					return actual == expected;
				} else {
					return objEquiv(actual, expected);
				}
			}

			function isArguments(object) {
				return Object.prototype.toString.call(object) == '[object Arguments]';
			}

			function objEquiv(a, b) {
				if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
					return false;
				if (a.prototype !== b.prototype) return false;
				var aIsArgs = isArguments(a),
					bIsArgs = isArguments(b);
				if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
					return false;
				if (aIsArgs) {
					a = pSlice.call(a);
					b = pSlice.call(b);
					return _deepEqual(a, b);
				}
				try {
					var ka = Object.keys(a),
						kb = Object.keys(b),
						key, i;
				} catch (e)
				return false;
			}
			if (ka.length != kb.length)
				return false;
			ka.sort();
			kb.sort();
			for (i = ka.length - 1; i >= 0; i--) {
				if (ka[i] != kb[i])
					return false;
			}
			for (i = ka.length - 1; i >= 0; i--) {
				key = ka[i];
				if (!_deepEqual(a[key], b[key])) return false;
			}
			return true;
		}

		assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
			if (_deepEqual(actual, expected)) {
				fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
			}
		};

		assert.strictEqual = function strictEqual(actual, expected, message) {
			if (actual !== expected) {
				fail(actual, expected, message, '===', assert.strictEqual);
			}
		};

		assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
			if (actual === expected) {
				fail(actual, expected, message, '!==', assert.notStrictEqual);
			}
		};

		function expectedException(actual, expected) {
			if (!actual || !expected) {
				return false;
			}

			if (Object.prototype.toString.call(expected) == '[object RegExp]') {
				return expected.test(actual);
			} else if (actual instanceof expected) {
				return true;
			} else if (expected.call({}, actual) === true) {
				return true;
			}

			return false;
		}

		function _throws(shouldThrow, block, expected, message) {
			var actual;

			if (util.isString(expected)) {
				message = expected;
				expected = null;
			}

			try {
				block();
			} catch (e) {
				actual = e;
			}

			message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
				(message ? ' ' + message : '.');

			if (shouldThrow && !actual) {
				fail(actual, expected, 'Missing expected exception' + message);
			}

			if (!shouldThrow && expectedException(actual, expected)) {
				fail(actual, expected, 'Got unwanted exception' + message);
			}

			if ((shouldThrow && actual && expected &&
				!expectedException(actual, expected)) || (!shouldThrow && actual)) {
				throw actual;
			}
		}

		assert.throws = function (block, error, message) {
			_throws.apply(this, [true].concat(pSlice.call(arguments)));
		}; assert.doesNotThrow = function (block, message) {
			_throws.apply(this, [false].concat(pSlice.call(arguments)));
		};

		assert.ifError = function (err) {
			if (err) {
				throw err;
			}
		};

		module.assert = module.exports; delete module.exports;
	})(this);

// function is(x, y){if (x === y) {return x !== 0 || 1 / x === 1 / y; } return x !== x && y !== y; }
// function isnt(x, y){return !is(x, y);}

define(Object.prototype, "is", function (y) {
	var x = this;
	if (x === y) {
		return x !== 0 || 1 / x === 1 / y;
	}
	return x !== x && y !== y;
});
define(Object.prototype, "isnt", function (y) {
	return !this.is(y);
});
define(Object.prototype, 'isNull', function (obj) {
	return obj === null;
});
define(Object.prototype, 'isUndefined', function (obj) {
	return toString.call(obj) === '[object Undefined]' || obj === void 0;
});
define(Object.prototype, 'isDefined', function (obj) {
	return toString.call(obj) !== '[object Undefined]' && obj === void 0;
});
define(Object.prototype, 'not', function (predicate) {
	return function () {
		return !predicate.apply(null, arguments);
	};
});
define(Object.prototype, 'isNot', function (predicate) {
	return function () {
		return !predicate.apply(null, arguments);
	};
});
define(Object.prototype, 'isEmpty', function () {
	if (this === null || typeof this !== 'object') {
		return !(this && this.length > 0);
	}
	return Object.prototype.keys(this).length === 0;
});

window.assert(condition, message) {
	if (!condition) {
		message = message || "Assertion failed";
		if (typeof Error !== "undefined") {
			throw new Error(message);
		}
		throw message;
	}
}

define(Object.prototype, 'isSameType', function (obj) {
	return Object.prototype.toString.call(this) === Object.prototype.toString.call(obj);
});
define(Object.prototype, 'isOwnProperty', function (prop) {
	return Object.prototype.hasOwnProperty.call(this, prop);
});
define(Object.prototype, 'isPlainObject', function isPlainObject() {
	return (!!this && typeof this === 'object' && this.constructor === Object);
});
define(Object.prototype, 'isPrimitive', function isPrimitive() {
	switch (typeof this) {
	case "string":
	case "number":
	case "boolean":
		return true;
	}
	return this == null;
});
define(Object.prototype, 'isOk', function (exp) {
	var val = this;
	if (typeof val === 'string') {
		return exp.test(val.trim());
	} else {
		return !!val;
	}
});

define(Object.prototype, 'isType', function (type) {
	return Object.prototype.toString.call(this) === ("[object " + type + "]");
});

define(Object.prototype, 'typeOf', function typeOf(val) { //, undefined) {
	var val = val || this;
	if (val === null) {
		return 'Null';
	} else if (val === undefined) {
		return 'Undefined';
	} else {
		// return toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		return /^\[object (.*)\]$/.exec(Object.prototype.toString.call(val))[1];
	}
});

define(Object.prototype, 'isInstanceOf', function (obj, prototype) {
	if (obj.isUndefined() || obj.isNull()) {
		return false;
	}
	if (prototype.isFunction() && obj instanceof prototype) {
		return true;
	}
	return false;
});
define(Object.prototype, 'isLike', function (obj, duck) {
	var name;
	for (name in duck) {
		if (duck.hasOwnProperty(name)) {
			if (obj.hasOwnProperty(name) === false || typeof obj[name] !== typeof duck[name]) {
				return false;
			}
			if (isObject(obj[name]) && isLike(obj[name], duck[name]) === false) {
				return false;
			}
		}
	}
	return true;
});
[ /*'Object', */ 'Array', 'Boolean', 'Date', 'Function', 'Number', 'String', 'RegExp'].forEach(function (type) {
	return Object.prototype["is" + type] = function () {
		return Object.prototype.toString.call(this) === ("[object " + type + "]");
	};
});

define(Object.prototype, 'isObject', function (obj, strict) {
	if (strict) {
		return typeof obj === 'object' && !isNull(obj) && !isArray(obj) && !isDate(obj);
	}
	return toString.call(obj) === '[object Object]' && obj !== void 0;
});

define(Object.prototype, 'isUnemptyString', function (obj) {
	return isString(obj) && obj !== '';
});
define(Object.prototype, 'isEmptyString', function (obj) {
	return isString(obj) && obj === '';
});
define(Object.prototype, 'isWebUrl', function (obj) {
	return isUnemptyString(obj) && /^https?:\/\/.+/.test(obj);
});
define(Object.prototype, 'isGitUrl', function (obj) {
	return isUnemptyString(obj) && /^git\+(ssh|https?):\/\/.+/.test(obj);
});
define(Object.prototype, 'isEmail', function (obj) {
	return isUnemptyString(obj) && /\S+@\S+/.test(obj);
});
define(Object.prototype, 'isLength', function isLength(obj, value) {
	return obj && obj.length === value;
});
define(Object.prototype, 'isNumber', function isNumber(obj) {
	return typeof obj === 'number' && isNaN(obj) === false && obj !== Number.POSITIVE_INFINITY && obj !== Number.NEGATIVE_INFINITY;
});

define(Object.prototype, "isNaN", function isNaN(val) {
	return !isNumber(val) || !this.isNumber() || $isNaN(Number(val));
});

define(Object.prototype, 'isOdd', function isOdd(obj) {
	return isNumber(obj) && (obj % 2 === 1 || obj % 2 === -1);
});
define(Object.prototype, 'isEven', function isEven(obj) {
	return isNumber(obj) && obj % 2 === 0;
});
define(Object.prototype, 'isInteger', function isInteger(obj) {
	return isNumber(obj) && obj % 1 === 0;
});
define(Object.prototype, 'isFloat', function isFloat(obj) {
	return isNumber(obj) && obj % 1 !== 0;
});
define(Object.prototype, 'isPositive', function isPositive(obj) {
	return isNumber(obj) && obj > 0;
});
define(Object.prototype, 'isNegative', function isNegative(obj) {
	return isNumber(obj) && obj < 0;
});

define(Object.prototype, 'isFinite', function isFinite(val) {
	var is = false;
	if (typeof val === 'string' && val !== '') {
		is = isFinite(parseFloat(val));
	} else if (this.isNumber(val)) {
		is = isFinite(val);
	}
	return is;
});

define(Number.prototype, 'isOdd', function isOdd(obj) {
	return (obj % 2 === 1 || obj % 2 === -1);
});
define(Number.prototype, 'isEven', function isEven(obj) {
	return obj % 2 === 0;
});
define(Number.prototype, 'isInteger', function isInteger(obj) {
	return obj % 1 === 0;
});
define(Number.prototype, 'isFloat', function isFloat(obj) {
	return obj % 1 !== 0;
});
define(Number.prototype, 'isPositive', function isPositive(obj) {
	return obj > 0;
});
define(Number.prototype, 'isNegative', function isNegative(obj) {
	return obj < 0;
});
define(Number.prototype, "isMultipleOf", function isMultipleOf(multiple) {
	return this % multiple === 0;
});
define(Number.prototype, "isLuhn", function isLuhn(num) {
	num = (num + '').split('').reverse();
	var sum = 0,
		i, digit;
	for (i = 0; i < num.length; i++) {
		digit = parseInt(num[i], 10) * ((i + 1) % 2 ? 1 : 2);
		sum += digit > 9 ? digit - 9 : digit;
	}
	return (sum % 10) === 0;
});
