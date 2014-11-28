


window.location.changeParam = function(param, value) {
	var currentURL = window.location.href+'&';
	var change = new RegExp('('+param+')=(.*)&', 'g');
	var newURL = currentURL.replace(change, '$1='+value+'&');

	if (getURLParameter(param) !== null){
		try {
			window.history.replaceState('', '', newURL.slice(0, - 1) );
		} catch (e) {
			console.log(e);
		}
	} else {
		var currURL = window.location.href;
		if (currURL.indexOf("?") !== -1){
			window.history.replaceState('', '', currentURL.slice(0, - 1) + '&' + param + '=' + value);
		} else {
			window.history.replaceState('', '', currentURL.slice(0, - 1) + '?' + param + '=' + value);
		}
	}
}


(function (global) {

	var re = {
		starts_with_slashes: /^\/+/,
		ends_with_slashes: /\/+$/,
		pluses: /\+/g,
		query_separator: /[&;]/,
		url_parser: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	};

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function (fn, scope) {
			for (var i = 0, len = this.length; i < len; ++i) {
				fn.call(scope || this, this[i], i, this);
			}
		};
	}

	Url.decodeRaw = function() {
		var str = this;
		return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () {return '%25';}));
	}
	Url.encodeRaw = function() {
		var str = this;
		str = (str + '').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
	}
	Url.decode = function() {
		var str = this;
		return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function () {return '%25';}).replace(/\+/g, '%20'));
	}
	Url.encode = function() {
		var str = this;
		str = (str + '').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
	}

	Url.buildQuery = function(formdata, numeric_prefix, arg_separator) {

		var value, key, tmp = [], that = this;

		var _http_build_query_helper = function (key, val, arg_separator) {
			var k, tmp = [];
			if (val === true) {
				val = '1';
			} else if (val === false) {
				val = '0';
			}
			if (val != null) {
				if (typeof val === 'object') {
					for (k in val) {
						if (val[k] != null) {
							tmp.push(_http_build_query_helper(key + '[' + k + ']', val[k], arg_separator));
						}
					}
					return tmp.join(arg_separator);
				} else if (typeof val !== 'function') {
					return that.urlencode(key) + '=' + that.urlencode(val);
				} else {
					throw new Error('There was an error processing for http_build_query().');
				}
			} else {
				return '';
			}
		};

		if (!arg_separator) {
			arg_separator = '&';
		}
		for (key in formdata) {
			value = formdata[key];
			if (numeric_prefix && !isNaN(key)) {
				key = String(numeric_prefix) + key;
			}
			var query = _http_build_query_helper(key, value, arg_separator);
			if (query !== '') {
				tmp.push(query);
			}
		}

		return tmp.join(arg_separator);
	}

	function parseURL(str) {
		var parser = re.url_parser;
		var parserKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
		var m = parser.exec(str || '');
		var parts = {};

		parserKeys.forEach(function (key, i) {
			parts[key] = m[i] || '';
		});

		return parts;
	}

	function parseQuery(str) {
		var i, ps, p, n, k, v;
		var pairs = [];

		if (typeof (str) === 'undefined' || str === null || str === '') {
			return pairs;
		}

		if (str.indexOf('?') === 0) {
			str = str.substring(1);
		}

		ps = str.toString().split(re.query_separator);

		for (i = 0; i < ps.length; i++) {
			p = ps[i];
			n = p.indexOf('=');

			if (n !== 0) {
				k = decodeURIComponent(p.substring(0, n));
				v = decodeURIComponent(p.substring(n + 1));
				//pairs.push(n === -1 ? [p, null] : [k, v]);
				n === -1 ? pairs[p] = null : pairs[k] = v;
			}

		}
		return pairs;
	}

	// parser.protocol; // => "http:"
	// parser.hostname; // => "example.com"
	// parser.port;	  // => "3000"
	// parser.pathname; // => "/pathname/"
	// parser.search;	// => "?search=test"
	// parser.hash;	  // => "#hash"
	// parser.host;	  // => "example.com:3000"
	function parse(url) {
		var parser = document.createElement('a');
		parser.href = url || window.location.href;
		return parser;
	}


	function parseParams(url) {
		var parameters = {};
		var query = url || window.location.search;
		query = query.replace('?', '');
		var params = query.split('&');
		for(var i = 0; i < params.length ; i++){
			var parts = params[i].split('=');
			parameters[parts[0]] = parts[1];
		}
		return parameters;
	}

	function Url(str) {
		this.urlParts = parseURL(str);
		this.queryPairs = parseQuery(this.urlParts.query);
		this.hasAuthorityPrefixUserPref = null;
	}

	['protocol', 'userInfo', 'host', 'port', 'path', 'anchor'].forEach(function (key) {
		Url.prototype[key] = function (val) {
			if (typeof val !== 'undefined') {
				this.urlParts[key] = val;
			}
			return this.urlParts[key];
		};
	});

	Url.prototype.hasAuthorityPrefix = function (val) {
		if (typeof val !== 'undefined') {
			this.hasAuthorityPrefixUserPref = val;
		}

		if (this.hasAuthorityPrefixUserPref === null) {
			return (this.urlParts.source.indexOf('//') !== -1);
		} else {
			return this.hasAuthorityPrefixUserPref;
		}
	};

	Url.prototype.query = function (val) {
		var s = '', i, param;

		if (typeof val !== 'undefined') {
			this.queryPairs = parseQuery(val);
		}

		for (i = 0; i < this.queryPairs.length; i++) {
			param = this.queryPairs[i];
			if (s.length > 0) {
				s += '&';
			}
			if (param[1] === null) {
				s += param[0];
			} else {
				s += param[0];
				s += '=';
				if (param[1]) {
					s += encodeURIComponent(param[1]);
				}
			}
		}
		return s.length > 0 ? '?' + s : s;
	};

	Url.prototype.getQueryParamValue = function (key) {
		var param, i;
		for (i = 0; i < this.queryPairs.length; i++) {
			param = this.queryPairs[i];
			if (key === param[0]) {
				return param[1];
			}
		}
	};

	Url.prototype.getQueryParamValues = function (key) {
		var arr = [], i, param;
		for (i = 0; i < this.queryPairs.length; i++) {
			param = this.queryPairs[i];
			if (key === param[0]) {
				arr.push(param[1]);
			}
		}
		return arr;
	};

	Url.prototype.deleteQueryParam = function (key, val) {
		var arr = [], i, param, keyMatchesFilter, valMatchesFilter;

		for (i = 0; i < this.queryPairs.length; i++) {

			param = this.queryPairs[i];
			keyMatchesFilter = decode(param[0]) === decode(key);
			valMatchesFilter = param[1] === val;

			if ((arguments.length === 1 && !keyMatchesFilter) || (arguments.length === 2 && (!keyMatchesFilter || !valMatchesFilter))) {
				arr.push(param);
			}
		}

		this.queryPairs = arr;

		return this;
	};

	Url.prototype.addQueryParam = function (key, val, index) {
		if (arguments.length === 3 && index !== -1) {
			index = Math.min(index, this.queryPairs.length);
			this.queryPairs.splice(index, 0, [key, val]);
		} else if (arguments.length > 0) {
			this.queryPairs.push([key, val]);
		}
		return this;
	};

	Url.prototype.replaceQueryParam = function (key, newVal, oldVal) {
		var index = -1, i, param;

		if (arguments.length === 3) {
			for (i = 0; i < this.queryPairs.length; i++) {
				param = this.queryPairs[i];
				if (decode(param[0]) === decode(key) && decodeURIComponent(param[1]) === decode(oldVal)) {
					index = i;
					break;
				}
			}
			this.deleteQueryParam(key, oldVal).addQueryParam(key, newVal, index);
		} else {
			for (i = 0; i < this.queryPairs.length; i++) {
				param = this.queryPairs[i];
				if (decode(param[0]) === decode(key)) {
					index = i;
					break;
				}
			}
			this.deleteQueryParam(key);
			this.addQueryParam(key, newVal, index);
		}
		return this;
	};

	['protocol', 'hasAuthorityPrefix', 'userInfo', 'host', 'port', 'path', 'query', 'anchor'].forEach(function (key) {
		var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
		Url.prototype[method] = function (val) {
			this[key](val);
			return this;
		};
	});

	Url.prototype.scheme = function () {
		var s = '';

		if (this.protocol()) {
			s += this.protocol();
			if (this.protocol().indexOf(':') !== this.protocol().length - 1) {
				s += ':';
			}
			s += '//';
		} else {
			if (this.hasAuthorityPrefix() && this.host()) {
				s += '//';
			}
		}

		return s;
	};

	Url.prototype.origin = function () {
		var s = this.scheme();

		if (s == 'file://') {
			return s + this.urlParts.authority;
		}

		if (this.userInfo() && this.host()) {
			s += this.userInfo();
			if (this.userInfo().indexOf('@') !== this.userInfo().length - 1) {
				s += '@';
			}
		}

		if (this.host()) {
			s += this.host();
			if (this.port()) {
				s += ':' + this.port();
			}
		}

		return s;
	};

	Url.prototype.addTrailingSlash = function () {
		var path = this.path() || '';

		if (path.substr(-1) !== '/') {
			this.path(path + '/');
		}

		return this;
	};

	Url.prototype.toString = function () {
		var path, s = this.origin();

		if (this.path()) {
			path = this.path();
			if (!(re.ends_with_slashes.test(s) || re.starts_with_slashes.test(path))) {
				s += '/';
			} else {
				if (s) {
					s.replace(re.ends_with_slashes, '/');
				}
				path = path.replace(re.starts_with_slashes, '/');
			}
			s += path;
		} else {
			if (this.host() && (this.query().toString() || this.anchor())) {
				s += '/';
			}
		}
		if (this.query().toString()) {
			if (this.query().toString().indexOf('?') !== 0) {
				s += '?';
			}
			s += this.query().toString();
		}

		if (this.anchor()) {
			if (this.anchor().indexOf('#') !== 0) {
				s += '#';
			}
			s += this.anchor();
		}

		return s;
	};

	Url.prototype.clone = function () {
		return new Url(this.toString());
	};

	if (typeof define === 'function' && define.amd) {
		define(function () {
			return Url;
		});
	} else if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = Url;
	} else {
		global.Url = Url;
	}
}(this));



window.$_GET = function(name) {
	if (!name) {return new Url(window.location.href).queryPairs;}
	var nameEQ = name + '=',
		url = window.location.href,
		pos = url.indexOf('?'),
		url = url.slice(pos + 1),
		arr = url.split('&'),
		i = 0,
		pair = '',
		arrl = arr.length;
	for (i = 0; i < arrl; i++) {
		var pair = arr[i];
		if (pair.indexOf(nameEQ) === 0) {
			return decodeURIComponent(pair.slice(nameEQ.length).replace(/\+/g, '%20'));
		}
	}
	return null;
}

