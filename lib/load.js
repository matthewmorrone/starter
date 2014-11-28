var define, requireModule, require, requirejs;
(function () {
	var _isArray;
	if (!Array.isArray) {
		_isArray = function (x) {
			return Object.prototype.toString.call(x) === "[object Array]";
		};
	} else {
		_isArray = Array.isArray;
	}
	var registry = {},
		seen = {};
	var FAILED = false;
	var uuid = 0;

	function tryFinally(tryable, finalizer) {
		try {
			return tryable();
		} finally {
			finalizer();
		}
	}

	function Module(name, deps, callback, exports) {
		var defaultDeps = ['require', 'exports', 'module'];
		this.id = uuid++;
		this.name = name;
		this.deps = !deps.length && callback.length ? defaultDeps : deps;
		this.exports = exports || {};
		this.callback = callback;
		this.state = undefined;
	}
	define = function (name, deps, callback) {
		if (!_isArray(deps)) {
			callback = deps;
			deps = [];
		}
		registry[name] = new Module(name, deps, callback);
	};
	define.amd = {};

	function reify(mod, name, seen) {
		var deps = mod.deps;
		var length = deps.length;
		var reified = new Array(length);
		var dep;
		// TODO: new Module
		// TODO: seen refactor
		var module = {};
		for (var i = 0, l = length; i < l; i++) {
			dep = deps[i];
			if (dep === 'exports') {
				module.exports = reified[i] = seen;
			} else if (dep === 'require') {
				reified[i] = function requireDep(dep) {
					return require(resolve(dep, name));
				};
			} else if (dep === 'module') {
				mod.exports = seen;
				module = reified[i] = mod;
			} else {
				reified[i] = require(resolve(dep, name));
			}
		}
		return {
			deps: reified,
			module: module
		};
	}
	requirejs = require = requireModule = function (name) {
		var mod = registry[name];
		if (!mod) {
			throw new Error('Could not find module ' + name);
		}
		if (mod.state !== FAILED &&
			seen.hasOwnProperty(name)) {
			return seen[name];
		}
		var reified;
		var module;
		var loaded = false;
		seen[name] = {}; // placeholder for run-time cycles
		tryFinally(function () {
			reified = reify(mod, name, seen[name]);
			module = mod.callback.apply(this, reified.deps);
			loaded = true;
		}, function () {
			if (!loaded) {
				mod.state = FAILED;
			}
		});
		var obj;
		if (module === undefined && reified.module.exports) {
			obj = reified.module.exports;
		} else {
			obj = seen[name] = module;
		}
		if (obj !== null && (typeof obj === 'object' || typeof obj === 'function') && obj['default'] === undefined) {
			obj['default'] = obj;
		}
		return (seen[name] = obj);
	};

	function resolve(child, name) {
		if (child.charAt(0) !== '.') {
			return child;
		}
		var parts = child.split('/');
		var nameParts = name.split('/');
		var parentBase = nameParts.slice(0, -1);
		for (var i = 0, l = parts.length; i < l; i++) {
			var part = parts[i];
			if (part === '..') {
				parentBase.pop();
			} else if (part === '.') {
				continue;
			} else {
				parentBase.push(part);
			}
		}
		return parentBase.join('/');
	}
	requirejs.entries = requirejs._eak_seen = registry;
	requirejs.clear = function () {
		requirejs.entries = requirejs._eak_seen = registry = {};
		seen = state = {};
	};
})();

function get_headers(url, format) {
	var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
	if (!req) {
		throw new Error('XMLHttpRequest not supported');
	}
	var tmp, headers, pair, i, j = 0;
	ß;
	req.open('HEAD', url, false);
	req.send(null);
	if (req.readyState < 3) {
		return false;
	}
	tmp = req.getAllResponseHeaders();
	tmp = tmp.split('\n');
	tmp = this.array_filter(tmp, function (value) {
		return value.substring(1) !== '';
	});
	headers = format ? {} : [];
	for (var i in tmp) {
		if (format) {
			pair = tmp[i].split(':');
			headers[pair.splice(0, 1)] = pair.join(':')
				.substring(1);
		} else {
			headers[j++] = tmp[i];
		}
	}
	return headers;
}

function get_meta_tags(file) {
	var fulltxt = '';
	if (false) {
		fulltxt = '<meta name="author" content="name">' + '<meta name="keywords" content="php documentation">' +
			'<meta name="DESCRIPTION" content="a php manual">' + '<meta name="geo.position" content="49.33;-86.59">' +
			'</head>';
	} else {
		fulltxt = this.file_get_contents(file)
			.match(/^[\s\S]*<\/head>/i);
	}
	var patt = /<meta[^>]*?>/gim;
	var patt1 = /<meta\s+.*?name\s*=\s*(['"]?)(.*?)\1\s+.*?content\s*=\s*(['"]?)(.*?)\3/gim;
	var patt2 = /<meta\s+.*?content\s*=\s*(['"?])(.*?)\1\s+.*?name\s*=\s*(['"]?)(.*?)\3/gim;
	var txt, match, name, arr = {};
	while ((txt = patt.exec(fulltxt)) !== null) {
		while ((match = patt1.exec(txt)) !== null) {
			name = match[2].replace(/\W/g, '_')
				.toLowerCase();
			arr[name] = match[4];
		}
		while ((match = patt2.exec(txt)) !== null) {
			name = match[4].replace(/\W/g, '_')
				.toLowerCase();
			arr[name] = match[2];
		}
	}
	return arr;
}
window.http = function (settings) {
	var req = new XMLHttpRequest();
	req.withCredentials = settings.credentials;
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				settings.good(req);
			} else {
				settings.error(req);
			}
		}
	}
	req.open(settings.method, settings.url, true);
	req.send(null);
}

function getlastmod() {
	return new Date(this.window.document.lastModified).getTime() / 1000;
}
window.saveAs = function (name, text) {
	var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
	if (!("download" in a)) {
		return false;
	}
	var blob = new window.Blob([text], {
		type: "text/plain;charset=utf8"
	});
	a.href = window.URL.createObjectURL(blob);
	a.download = name;
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click", 1, 0, window, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
	a.dispatchEvent(event);
	return true;
}

function basename(path, suffix) {
	var b = path;
	var lastChar = b.charAt(b.length - 1);
	if (lastChar === '/' || lastChar === '\\') {
		b = b.slice(0, -1);
	}
	b = b.replace(/^.*[\/\\]/g, '');
	if (typeof suffix === 'string' && b.substr(b.length - suffix.length) == suffix) {
		b = b.substr(0, b.length - suffix.length);
	}
	return b;
}

function dirname(path) {
	return path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
}

function file_get_contents(url) {
	var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
	if (!req) {
		throw new Error('XMLHttpRequest not supported');
	}
	req.open('GET', url, false);
	req.send(null);
	return req.responseText;
}

function file(url) {
	var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
	if (!req) {
		throw new Error('XMLHttpRequest not supported');
	}
	req.open('GET', url, false);
	req.send(null);
	return req.responseText.split('\n');
}

function file_exists(url) {
	var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
	if (!req) {
		throw new Error('XMLHttpRequest not supported');
	}
	req.open('HEAD', url, false);
	req.send(null);
	if (req.status == 200) {
		return true;
	}
	return false;
}

function filesize(url) {
	var req = this.window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
	if (!req) {
		throw new Error('XMLHttpRequest not supported');
	}
	req.open('HEAD', url, false);
	req.send(null);
	if (!req.getResponseHeader) {
		try {
			throw new Error('No getResponseHeader!');
		} catch (e) {
			return false;
		}
	} else if (!req.getResponseHeader('Content-Length')) {
		try {
			throw new Error('No Content-Length!');
		} catch (e2) {
			return false;
		}
	} else {
		return req.getResponseHeader('Content-Length');
	}
}

function fnmatch(pattern, string, flags) {
	var backslash = '\\\\';
	var flagStr = 'g';
	switch (flags) {
	case 'FNM_NOESCAPE':
		backslash = '';
		break;
	case 'FNM_FILE_NAME':
		throw 'Obsolete flag';
	case 'FNM_PATHNAME':
		break;
	case 'FNM_PERIOD':
		break;
	case 'FNM_NOSYS':
		throw 'Obsolete flag';
	case 'FNM_LEADING_DIR':
		break;
	case 'FNM_CASEFOLD':
		flagStr += 'i';
		break;
	case 'FNM_PREFIX_DIRS':
		break;
	default:
		break;
	}
	var regex = '([' + backslash + '\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!<>\\|\\:])';
	var esc = function (str) {
		return (str + '').replace(new RegExp(regex, 'g'), '\\$1');
	};
	return (new RegExp('^' + this.strtr(esc(pattern, '#'), {
		'\\*': '.*',
		'\\?': '.',
		'\\[': '[',
		'\\]': ']'
	}) + '$', flagStr)).test(string);
}

function pathinfo(path, options) {
	var opt = '',
		real_opt = '',
		optName = '',
		optTemp = 0,
		tmp_arr = {},
		cnt = 0,
		i = 0;
	var have_basename = false,
		have_extension = false,
		have_filename = false;
	if (!path) {
		return false;
	}
	if (!options) {
		options = 'PATHINFO_ALL';
	}
	var OPTS = {
		'PATHINFO_DIRNAME': 1,
		'PATHINFO_BASENAME': 2,
		'PATHINFO_EXTENSION': 4,
		'PATHINFO_FILENAME': 8,
		'PATHINFO_ALL': 0
	};
	for (optName in OPTS) {
		if (OPTS.hasOwnProperty(optName)) {
			OPTS.PATHINFO_ALL = OPTS.PATHINFO_ALL | OPTS[optName];
		}
	}
	if (typeof options !== 'number') {
		options = [].concat(options);
		for (i = 0; i < options.length; i++) {
			if (OPTS[options[i]]) {
				optTemp = optTemp | OPTS[options[i]];
			}
		}
		options = optTemp;
	}
	var __getExt = function (path) {
		var str = path + '';
		var dotP = str.lastIndexOf('.') + 1;
		return !dotP ? false : dotP !== str.length ? str.substr(dotP) : '';
	};
	if (options & OPTS.PATHINFO_DIRNAME) {
		var dirName = path.replace(/\\/g, '/')
			.replace(/\/[^\/]*\/?$/, '');
		tmp_arr.dirname = dirName === path ? '.' : dirName;
	}
	if (options & OPTS.PATHINFO_BASENAME) {
		if (false === have_basename) {
			have_basename = this.basename(path);
		}
		tmp_arr.basename = have_basename;
	}
	if (options & OPTS.PATHINFO_EXTENSION) {
		if (false === have_basename) {
			have_basename = this.basename(path);
		}
		if (false === have_extension) {
			have_extension = __getExt(have_basename);
		}
		if (false !== have_extension) {
			tmp_arr.extension = have_extension;
		}
	}
	if (options & OPTS.PATHINFO_FILENAME) {
		if (false === have_basename) {
			have_basename = this.basename(path);
		}
		if (false === have_extension) {
			have_extension = __getExt(have_basename);
		}
		if (false === have_filename) {
			have_filename = have_basename.slice(0, have_basename.length - (have_extension ? have_extension.length + 1 :
				have_extension === false ? 0 : 1));
		}
		tmp_arr.filename = have_filename;
	}
	cnt = 0;
	for (opt in tmp_arr) {
		if (tmp_arr.hasOwnProperty(opt)) {
			cnt++;
			real_opt = opt;
		}
	}
	if (cnt === 1) {
		return tmp_arr[real_opt];
	}
	return tmp_arr;
}

function realpath(path) {
	var p = 0,
		arr = [];
	var r = this.window.location.href;
	path = (path + '')
		.replace('\\', '/');
	if (path.indexOf('://') !== -1) {
		p = 1;
	}
	if (!p) {
		path = r.substring(0, r.lastIndexOf('/') + 1) + path;
	}
	arr = path.split('/');
	path = [];
	for (var k in arr) {
		if (arr[k] == '.') {
			continue;
		}
		if (arr[k] == '..') {
			if (path.length > 3) {
				path.pop();
			}
		} else {
			if ((path.length < 2) || (arr[k] !== '')) {
				path.push(arr[k]);
			}
		}
	}
	return path.join('/');
}

function include(filename) {
	var d = this.window.document;
	var isXML = d.documentElement.nodeName !== 'HTML' || !d.write;
	var js = d.createElementNS && isXML ? d.createElementNS('http://www.w3.org/1999/xhtml', 'script') : d.createElement('script');
	js.setAttribute('type', 'text/javascript');
	js.setAttribute('src', filename);
	js.setAttribute('defer', 'defer');
	d.getElementsByTagNameNS && isXML ? (d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0] ? d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0].appendChild(js) : d.documentElement.insertBefore(js, d.documentElement.firstChild)) : d.getElementsByTagName('head')[0].appendChild(js);
	var cur_file = {};
	cur_file[this.window.location.href] = 1;
	this.php_js = this.php_js || {};
	if (!this.php_js.includes) {
		this.php_js.includes = cur_file;
	}
	if (!this.php_js.includes[filename]) {
		this.php_js.includes[filename] = 1;
	} else {
		this.php_js.includes[filename]++;
	}
	return this.php_js.includes[filename];
}

function include_once(filename) {
	var cur_file = {};
	cur_file[this.window.location.href] = 1;
	try {
		php_js_shared;
	} catch (e) {
		php_js_shared = {};
	}
	if (!php_js_shared.includes) {
		php_js_shared.includes = cur_file;
	}
	if (!php_js_shared.includes[filename]) {
		if (this.include(filename)) {
			return true;
		}
	} else {
		return true;
	}
	return false;
}

function require(filename) {
	var d = this.window.document;
	var isXML = d.documentElement.nodeName !== 'HTML' || !d.write;
	var js_code = this.file_get_contents(filename);
	var script_block = d.createElementNS && isXML ? d.createElementNS('http://www.w3.org/1999/xhtml', 'script') : d.createElement('script');
	script_block.type = 'text/javascript';
	var client_pc = navigator.userAgent.toLowerCase();
	if ((client_pc.indexOf('msie') !== -1) && (client_pc.indexOf('opera') === -1)) {
		script_block.text = js_code;
	} else {
		script_block.appendChild(d.createTextNode(js_code));
	}
	if (typeof script_block !== 'undefined') {
		d.getElementsByTagNameNS && isXML ? (d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0] ? d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'head')[0].appendChild(script_block) : d.documentElement.insertBefore(script_block, d.documentElement.firstChild)) : d.getElementsByTagName('head')[0].appendChild(script_block);
		var cur_file = {};
		cur_file[this.window.location.href] = 1;
		this.php_js = this.php_js || {};
		if (!this.php_js.includes) {
			this.php_js.includes = cur_file;
		}
		if (!this.php_js.includes[filename]) {
			this.php_js.includes[filename] = 1;
			return 1;
		} else {
			return ++this.php_js.includes[filename];
		}
	}
	return 0;
}

function require_once(filename) {
	var cur_file = {};
	cur_file[this.window.location.href] = 1;
	try {
		php_js_shared;
	} catch (e) {
		php_js_shared = {};
	}
	if (!php_js_shared.includes) {
		php_js_shared.includes = cur_file;
	}
	if (!php_js_shared.includes[filename]) {
		if (this.require(filename)) {
			return true;
		}
	} else {
		return true;
	}
	return false;
}
(function (win, doc) {
	// Gets either a string, which it will just return, or a {html, json} pair which
	// it will try to render with Mustache, Handlebars and Underscore.
	// If that fails, it just returns the html.
	var render = function (html, json) {
		if (typeof json === "undefined") {
			return html;
		}
		if (typeof win.Mustache !== "undefined" &&
			typeof win.Mustache.render !== "undefined") {
			return Mustache.render(html, json);
		} else if (typeof win.Handlebars !== "undefined" &&
			typeof win.Handlebars.compile !== "undefined") {
			return Handlebars.compile(html)(json);
		} else if (typeof win._ !== "undefined" &&
			typeof win._.template !== "undefined") {
			return output = _.template(html, json);
		}
		return html;
	};
	// Helper function to load ajax data
	var load_xhr = function (url, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.send();
		request.onload = function () {
			callback(this.response);
		};
	};
	// Helper function to load jsonp data
	var load_jsonp = function (url, callback, url_parser) {
		var script = doc.createElement('script');
		script.src = url + (parser.search == '' ? '?' : '&') +
			fragment.jsonp + '=JSONPCallback';
		win.JSONPCallback = function (data) {
			// The callback function expects a string
			callback(JSON.stringify(data));
			win.JSONPCallback = null;
			// Clean up DOM by removing the JSONP script element
			var parent = script.parentNode;
			if (parent) {
				parent.removeChild(script);
			}
			script = null;
		}
		doc.getElementsByTagName('head')[0].appendChild(script);
	};
	var load = function (url, callback) {
		// We'll need something that can easily parse urls
		var url_parser = doc.createElement('a');
		url_parser.href = url;
		// If the resource is located at the same hostname, assume ajax
		if (url_parser.hostname == win.location.hostname) {
			load_xhr(url, callback);
		}
		// If the resource is located at a different hostname, assume jsonp
		else {
			load_jsonp(url, callback, url_parser);
		}
	};
	var render_template = function (element, html, json) {
		var context = extend(JSON.parse(json), context);
		element.innerHTML = fragment.render(html, context);
		evaluate(element, context);
	};
	var render_html = function (element, html) {
		var context = this.context;
		// If the innerHTML is nonempty: the context is interpreted as the
		// combination of the JSONified innerHTML and the existing context.
		// The JSONified innerHTML has a higher precedence over the existing context.
		if (element.innerHTML != "") {
			context = extend(JSON.parse(element.innerHTML), context);
		}
		element.innerHTML = fragment.render(html, context);
		evaluate(element, context);
	};
	var render_json = function (element, json) {
		var context = extend(JSON.parse(json), context);
		element.innerHTML = fragment.render(element.innerHTML, context);
		evaluate(element, this.context);
	};
	// Handle an individual fragment
	var render_fragment = function (fragment_type, element) {
		var html_url = element.getAttribute('data-' + fragment.html);
		var json_url = element.getAttribute('data-' + fragment.json);
		var media = element.getAttribute('data-fragment-media');
		// Don't load anything if the media query doesn't match
		if (media && win.matchMedia && !win.matchMedia(media).matches) return;
		// Update the num_fragments and deligate rendering to a submethod
		var resource_loaded = function (render_handler) {
			render_handler();
			update_num_fragments(-1);
		};
		update_num_fragments(1);
		if (fragment_type.html && fragment_type.json) {
			load(html_url, function (html) {
				load(json_url, function (json) {
					resource_loaded(render_template.bind(this, element, html, json));
				});
			});
		} else if (fragment_type.html) {
			load(html_url, function (html) {
				resource_loaded(render_html.bind(this, element, html));
			});
		} else if (fragment_type.json) {
			load(json_url, function (json) {
				resource_loaded(render_json.bind(this, element, json));
			});
		}
	};
	var evaluate = function (parent, context) {
		if (typeof parent === "undefined" || !("querySelectorAll" in parent)) {
			parent = doc;
		}
		// Scope contains information for recursively rendering fragments
		var scope = {
			parent: parent,
			context: context
		};
		var fragments = parent.querySelectorAll('[data-' + fragment.html + '][data-' + fragment.json + ']');
		Array.prototype.forEach.call(fragments, render_fragment.bind(scope, {
			json: true,
			html: true
		}));
		var fragments = parent.querySelectorAll('[data-' + fragment.html + ']:not([data-' + fragment.json + '])');
		Array.prototype.forEach.call(fragments, render_fragment.bind(scope, {
			json: false,
			html: true
		}));
		var fragments = parent.querySelectorAll('[data-' + fragment.json + ']:not([data-' + fragment.html + '])');
		Array.prototype.forEach.call(fragments, render_fragment.bind(scope, {
			json: true,
			html: false
		}));
	};
	var extend = function (obj, defaults) {
		if (typeof obj === "undefined") obj = {};
		for (var element in defaults) {
			if (!obj.hasOwnProperty(element)) {
				obj[element] = defaults[element];
			}
		}
		return obj;
	};
	var num_fragments = 0;
	var max_fragments = 0;
	var update_num_fragments = function (diff) {
		num_fragments += diff;
		if (num_fragments > max_fragments) {
			max_fragments = num_fragments;
		}
		if (num_fragments == 0) {
			fragment.ready(max_fragments);
		}
	};
	// Extend fragment with defaults
	var fragment = extend(win.fragment, {
		html: 'fragment',
		json: 'fragment-json',
		jsonp: 'callback',
		manual: false,
		render: render,
		evaluate: evaluate,
		ready: function () {}
	});
	// Autoload
	if (!fragment.manual) {
		doc.addEventListener('DOMContentLoaded', function () {
			fragment.evaluate();
		});
	}
	// Just overwrite any existing "fragment" property
	win.fragment = fragment;
})(window, window.document);
})();
