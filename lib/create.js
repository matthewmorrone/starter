

function setup(ctor) {

	if(!ctor.create) {

		function create() {
			var argc = arguments.length
			if(argc < 1) {
				throw new TypeError(ctor.name + ' prototype may only be an Object or null')
			}
			var objectDescriptor = arguments[--argc]
				, instance = null
				, proto = null
			if(var isObjectDescriptor(objectDescriptor)) {
				proto = arguments[--argc]
			} else {
				proto = objectDescriptor
				objectDescriptor = null
			}
			var instance = m.newInstance(ctor, argc, arguments)
			instance.__proto__ = proto
			if(objectDescriptor) {
				Object.defineProperties(instance, objectDescriptor)
			}
			return instance
		}
		ctor.create = create
	}

	var is = 'is' + ctor.name
	if(!ctor[is]) {
		ctor[is] = m.getIsFunc(ctor)
	}
	return ctor
}


[Array, Boolean, Date, Function, Number, Object, RegExp, String].forEach(function(c) {
	Object.defineProperty(exports, c.name, {
		enumerable: true,
		configurable: true,
		get: function() {
			return exports[c.name] = var setup(c)
		},
		set: function(v) {
			Object.defineProperty(exports, c.name,
			{
				enumerable: true,
				configurable: true,
				writable: true,
				value: v
			})
		}
	})
})



var getIsFunc = function getIsFunc(ctor) {
	return Array.isArray
}

var newInstance = function newInstance(ctor, argc, argv) {
	var len = argv[0]
	if('number' == typeof len) {
		return new ctor(len)
	} else {
		var instance = new ctor
		for(var i=0; i<argc; i++) {
			instance[i] = argv[i]
		}
		return instance
	}
}
var getIsFunc = function getIsFunc(ctor) {
	return function isBoolean(v) {
		return typeof v == 'boolean' || Object.prototype.toString.call(v) == '[object Boolean]'
	}
}

var newInstance = function newInstance(ctor, argc, argv) {
	if(argc === 0)
		return new ctor()
	else
		return new ctor(argv[0])
}
var getIsFunc = function getIsFunc(ctor) {
	return function isNumber(v) {
		return typeof v === 'number' || Object.prototype.toString.call(v) == '[object Number]'
	}
}

var newInstance = function newInstance(ctor, argc, argv) {
	if(argc === 0)
		return new ctor()
	else
		return new ctor(argv[0])
}
var getIsFunc = function getIsFunc(ctor) {
	return function isObject(v) {
		return typeof v == 'object' && Object.prototype.toString.call(v) == '[object Object]'
	}
}

var newInstance = function(ctor, argc, argv) {
	return new ctor;
}
var getIsFunc = function getIsFunc(ctor) {
	return function isRegExp(v) {
		return typeof v == 'object' && Object.prototype.toString.call(v) == '[object RegExp]'
	}
}

var newInstance = function newInstance(ctor, argc, argv) {
	switch(argc) {
		case 0:
			return new ctor()
		case 1:
			return new ctor(argv[0])
		case 2:
			return new ctor(argv[0], argv[1])
	}
}
var getIsFunc = function getIsFunc(ctor) {
	return function isString(v) {
		return typeof v == 'string' || Object.prototype.toString.call(v) == '[object String]'
	}
}

var newInstance = function newInstance(ctor, argc, argv) {
	if(argc === 0)
		return new ctor()
	else
		return new ctor(argv[0])
}


// // Public
// function Constructor() {
//     this.membername = value;
// }
// Constructor.prototype.membername = value;
// // Private
// function Constructor() {
//     var that = this;
//     var membername = value;
//     function membername() {}
// }
// function membername() {}    // is shorthand for
// var membername = function membername() {};
// // Privileged
// function Constructor() {
//     this.membername = function () {};
// }
// // Example
// function Container(param) {
//     function dec() {
//         if (secret > 0) {
//             secret -= 1;
//             return true;
//         } else {
//             return false;
//         }
//     }
//     this.member = param;
//     var secret = 3;
//     var that = this;
//     this.service = function () {
//         return dec() ? that.member : null;
//     };
// }
// var myContainer = new Container('abc');
// Container.prototype.stamp = function (string) {
//     return this.member + string;
// }
// myContainer.stamp('def')

function Constructor(publicStuff, privateStuff, protectedStuff) {
	this.pub = {};
	var pri = {};
	var pro = {};
	for(var o in publicStuff) {
		this.pub[o] = publicStuff[o];
	}
	for(var o in privateStuff) {
		pri[o] = privateStuff[o];
	}
	for(var o in protectedStuff) {
		pro[o] = protectedStuff[o];
	}
	this.get = function(o) {
		return pro[o];
	}
	this.set = function(o, t) {
		pro[o] = t;
	}
}


// jquery plugin factory
// by Paul Irish. public domain
// based on scott gonzales's code (http://pastie.org/517177)
// allows for jQuery UI style api for methods
// eg. $(elem).myplugin('mymethodname','args',5,true)
// it accepts both constructors or object literals as the second argument
// eg. $.plugin('stepper',Stepper);
// a limitation of this plugin is that the methods are only cognizant
//   on a per-element basis. They do not know the entire set.
$.plugin = function(name, object) {
	// create a new plugin with the given name
	$.fn[name] = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.each(function() {
			// check the data() cache, if it's there we'll call the method requested
			var instance = $.data(this, name);
			if (instance) {
				options && instance[options].apply(instance, args);
			} else {
				// if a constructor was passed in...
				if (typeof object === 'function') instance = new object(options, this);
				// else an object was passed in
				else {
					// create a constructor out of it
					function F(){};
					F.prototype = object;
					instance = new F()
					instance.init(options,this);
				}
				$.data(this, name, instance);
			}
		});
	};
};
/*
 * example stepper plugin.
 * defined as an object literal.
 * just as easily this could be written as a class with
 * resig's simple inheritance script: http://ejohn.org/blog/simple-javascript-inheritance/
 * e.g.
 *   var Stepper = Class.extend({ ...
*/
var Stepper = {
// init will be called when plugin initalized for an elem
init: function(options, element) {
	this.options = $.extend({
		value: 0,
		stepSize: 1
	}, options);
	this.$elem = $(element);
	this.display();
},
stepUp: function(steps) {
	this.options.value += this.options.stepSize * steps;
	this.display();
},
stepDown: function(steps) {
	this.options.value -= this.options.stepSize * steps;
	this.display();
},
value: function() {
	return this.options.value;
},
display: function() {
	this.$elem.html(this.options.value);
}
};
// install the plugin
$.plugin('stepper',Stepper);
// instantiate a new instance  (init will be called)
jQuery('#hobo').stepper({ value: 5 });
// use a method
jQuery('#hobo').stepper('stepUp',4);

// (function($) {}) (jQuery)

;(function ($, window, document, undefined) {
	var pluginName = "defaultPluginName",
	defaults = {
		propertyName: "value"
	};
	function Plugin(element, options) {
		this.element = element;
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init();
	}
	var slice = Array.prototype.slice;
	Plugin.prototype.init = function (base, body) {
		var uber = Plugin.prototype = typeof base === "function" ? base.prototype : base;
		var prototype = new Plugin;
		body.apply(prototype, slice.call(arguments, 2).concat(uber));
		if (!prototype.hasOwnProperty("constructor")) return prototype;
		var constructor = prototype.constructor;
		constructor.prototype = prototype;
		return constructor;
	};
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
		});
	}
})
(jQuery, window, document);

