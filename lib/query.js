


window.query = function(selector, context, undefined) {
	var matches = {
		'#': 'getElementById',
		'.': 'getElementsByClassName',
		'@': 'getElementsByName',
		'<': 'getElementsByTagName', // or =
		'$$': 'querySelectorAll', // or *
		'$': 'querySelector'
	}[selector[0]];
	context = ((context === undefined) ? document : context);
	var result = (context[matches](selector.slice(1)));
	return ((result.length < 2) ? result[0]: Array.prototype.slice.call(result));


};
if (!$) {
	$ = function(a, b) {
		if (isFunction(a)) {
			document.addEventListener("DOMContentLoaded", a, false);
			window.addEventListener("load", a, false);
		}
		else if (isString(a)) {
			return window.query(a, b);
		}
		else {
			return a;
		}
		return this;
	}
}

// xpath --> document.evaluate()
// elementFromPoint()

window.ready = function() {var fns = [], listener, doc = document, domContentLoaded = 'DOMContentLoaded', loaded = /^loaded|^c/.test(doc.readyState) if (!loaded) {doc.addEventListener(domContentLoaded, listener = function () {doc.removeEventListener(domContentLoaded, listener); loaded = 1; while (listener = fns.shift()) {listener();} }) } return function (fn) {loaded ? fn() : fns.push(fn)} };

window.domready = function() {var fns = [], listener , doc = document , hack = doc.documentElement.doScroll , domContentLoaded = 'DOMContentLoaded', loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState); if (!loaded) {doc.addEventListener(domContentLoaded, listener = function () {doc.removeEventListener(domContentLoaded, listener); loaded = 1; while (listener = fns.shift()) {listener();} }) }; return function (fn) {loaded ? fn() : fns.push(fn); } }


function $() {
	var elements = new Array();
	for (var i = 0, var len = arguments.length; i < len; i++) {
		var element = arguments[i];
		if (typeof element == 'string') {element = document.getElementById(element);}
		if (arguments.length == 1) {return element;}
		elements.push(element);
	}
	return elements;
}

// $ = function (a) {return /^f/.test(typeof a) ? /c/.test(document.readyState) ? a() : $(document).on('DOMContentLoaded', a) : new ([].push.apply(this, a && a.nodeType ? [a] : '' + a === a ? document.querySelectorAll(a) : false))}
$almighty = function (b, c, d, e) {
	// * a = selector, dom element or function
	// * returns instance or executes function on ready
	function i(a) {[].push.apply(this, a && a.nodeType ? [a] : '' + a === a ? document.querySelectorAll(a) : false)}
	$ = function (a) {return /^f/.test(typeof a) ? /c/.test(document.readyState) ? a() : $(document).on('DOMContentLoaded', a) : new i(a)}
};//(document, [], 'prototype');

