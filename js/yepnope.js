// yepnope.js

window.yepnope = (function (window, document, undef) {
	var sTimeout = window.setTimeout;
	var firstScript;
	var scriptsQueue = [];
	var count = 0;
	var toString = {}.toString;
	var isOldIE = !!document.attachEvent && !(window.opera && toString.call(window.opera) == '[object Opera]');

	function noop() {}

	function isObject(obj) {
		return Object(obj) === obj;
	}

	function isString(s) {
		return typeof s == 'string';
	}

	function uniq() {
		return 'yn_' + (count++);
	}

	function readFirstScript() {
		if (!firstScript || !firstScript.parentNode) {
			firstScript = document.getElementsByTagName('script')[0];
		}
	}

	function isFileReady(readyState) {
		return (!readyState || readyState == 'loaded' || readyState == 'complete' || readyState == 'uninitialized');
	}

	function runWhenReady(src, cb) {
		cb.call(window);
	}

	function injectJs(options, cb) {
		var src;
		var attrs;
		var timeout;

		if (isString(options)) {
			src = options;
		} else if (isObject(options)) {
			src = options._url || options.src;
			attrs = options.attrs;
			timeout = options.timeout;
		}

		cb = cb || noop;
		attrs = attrs || {};

		var script = document.createElement('script');
		var done;
		var i;

		timeout = timeout || yepnope.errorTimeout;

		script.src = src;
		if (isOldIE) {
			script.event = 'onclick';
			script.id = script.htmlFor = attrs.id || uniq();
		}
		for (i in attrs) {
			script.setAttribute(i, attrs[i]);
		}
		script.onreadystatechange = script.onload = function () {

			if (!done && isFileReady(script.readyState)) {
				done = 1;
				if (isOldIE) {
					try {
						script.onclick();
					} catch (e) {}
				}
				runWhenReady(src, cb);
			}
			script.onload = script.onreadystatechange = script.onerror = null;
		};
		script.onerror = function () {
			done = 1;
			cb(new Error('Script Error: ' + src));
		};
		sTimeout(function () {
			if (!done) {
				done = 1;
				cb(new Error('Timeout: ' + src));
				script.parentNode.removeChild(script);
			}
		}, timeout);
		readFirstScript();
		firstScript.parentNode.insertBefore(script, firstScript);
	}

	function injectCss(options, cb) {
		var attrs = {};
		var href;
		var i;
		var media;
		if (isObject(options)) {
			href = options._url || options.href;
			attrs = options.attrs || {};
		} else if (isString(options)) {
			href = options;
		}
		var link = document.createElement('link');

		cb = cb || noop;
		link.href = href;
		link.rel = 'stylesheet';
		link.media = 'only x';
		link.type = 'text/css';
		sTimeout(function () {
			link.media = attrs.media || 'all';
		});
		for (i in attrs) {
			link.setAttribute(i, attrs[i]);
		}

		readFirstScript();
		firstScript.parentNode.appendChild(link);
		sTimeout(function () {
			cb.call(window);
		});
	}

	function getExtension(url) {
		var b = url.split('?')[0];
		return b.substr(b.lastIndexOf('.') + 1);
	}

	function defaultUrlFormatter(base, tests) {
		var url = base;
		var passed = [];
		var failed = [];

		for (var i in tests) {
			if (tests.hasOwnProperty(i)) {
				if (tests[i]) {
					passed.push(encodeURIComponent(i));
				} else {
					failed.push(encodeURIComponent(i));
				}
			}
		}

		if (passed.length || failed.length) {
			url += '?';
		}

		if (passed.length) {
			url += 'yep=' + passed.join(',');
		}

		if (failed.length) {
			url += (passed.length ? '&' : '') + 'nope=' + failed.join(',');
		}

		return url;
	}

	function yepnope(url, tests, cb) {
		var options;

		if (isObject(url)) {
			options = url;
			url = options.src || options.href;
		}

		url = yepnope.urlFormatter(url, tests);

		if (!options) {
			options = {
				_url: url
			};
		} else {
			options._url = url;
		}

		var type = getExtension(url);

		if (type === 'js') {
			injectJs(options, cb);
		} else if (type === 'css') {
			injectCss(options, cb);
		} else {
			throw new Error('Unable to determine filetype.');
		}
	}
	yepnope.errorTimeout = 10e3;
	yepnope.injectJs = injectJs;
	yepnope.injectCss = injectCss;
	yepnope.urlFormatter = defaultUrlFormatter;

	return yepnope;
})(window, document);
