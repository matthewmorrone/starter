window.boot = function (cb) {
	document.addEventListener("DOMContentLoaded", cb);
}
window.bottom = function () {
	var distanceToViewportTop = ($(document).height() - $(window).height());
	var viewPortTop = $(document).scrollTop();
	if (viewPortTop === 0) return false;
	return (viewPortTop - distanceToViewportTop === 0);
};
window.currentScript = function () {
	if (document.currentScript) {
		return document.currentScript;
	}
	var scripts = document.getElementsByTagName('script');
	return scripts[scripts.length - 1];
}
window.die = function (status) {
	return window.exit(status);
}
window.disableBack = function () {
	function cantGoBack() {
		window.history.forward();
	}
	window.onload = cantGoBack();
	window.onpageshow = function (evt) {
		if (evt.persisted) {
			cantGoBack();
		}
	}
}
window.exit = function (status) {
	var i, that = this,
		_addEvent = function (el, type, handler, capturing) {
			if (el.addEventListener) {
				el.addEventListener(type, handler, !!capturing);
			} else if (el.attachEvent) {
				el.attachEvent('on' + type, handler);
			} else {
				el['on' + type] = handler;
			}
		},
		_stopEvent = function (e) {
			if (e.stopPropagation) {
				e.stopPropagation();
				e.preventDefault();
			} else {
				that.window.event.cancelBubble = true;
				that.window.event.returnValue = false;
			}
		};
	if (typeof status === 'string') {
		alert(status);
	}
	_addEvent(this.window, 'error', function (e) {
		_stopEvent(e);
	}, false);
	var handlers = ['copy', 'cut', 'paste', 'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput', 'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'];
	for (i = 0; i < handlers.length; i++) {
		_addEvent(this.window, handlers[i], function (e) {
			_stopEvent(e);
		}, true);
	}
	if (this.window.stop) {
		this.window.stop();
	}
	throw '';
}
window.falsy = function (test) {
	return test === undefined || test === 'undefined' || test === false || test === 'false' || test === 0 || test === '0' || test === '' || test === null || test === 'null';
}
window.functionExists = function (func_name) {
	if (typeof func_name === 'string') {
		func_name = window[func_name];
	}
	return typeof func_name === 'function';
}
window.functions = function () {
	var i = '',
		arr = [],
		already = {};
	for (i in window) {
		try {
			if (typeof window[i] === 'function') {
				if (!already[i]) {
					already[i] = 1;
					arr.push(i);
				}
			} else if (typeof window[i] === 'object') {
				for (var j in window[i]) {
					if (typeof window[j] === 'function' && window[j] && !already[j]) {
						already[j] = 1;
						arr.push(j);
					}
				}
			}
		} catch (e) {}
	}
	return arr;
}
window.insertAtCursor = function (myField, myValue) {
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	} else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		restoreTop = myField.scrollTop;
		myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
		myField.selectionStart = startPos + myValue.length;
		myField.selectionEnd = startPos + myValue.length;
		if (restoreTop > 0) {
			myField.scrollTop = restoreTop;
		}
	} else {
		myField.value += myValue;
	}
}
window.interceptTabs = function (evt, control) {
	key = evt.keyCode ? evt.keyCode : evt.which ? evt.which : evt.charCode;
	if (key == 9) {
		insertAtCursor(control, '\t');
		return false;
	} else {
		return key;
	}
}
window.msieversion = function () {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if (msie > 0) {
		return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
	} else {
		return 0;
	}
	return 0;
}
window.normalize = function () {
	$('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" />');
}
window.now = function () {
	return Date.now() || function () {
		return +(new Date());
	}
	window.reset = function () {
		$("head").append("<style>/* reset.css */html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center,dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary,time, mark, audio, video {margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; } /* HTML5 display-role reset for older browsers */ article, aside, details, figcaption, figure, footer, header, hgroup, menu, nav, section {display: block; } body {line-height: 1; } ol, ul {list-style: none; } blockquote, q {quotes: none; } blockquote:before, blockquote:after,q:before, q:after {content: ''; content: none; } table {border-collapse: collapse; border-spacing: 0; }</style>");
	}
	window.run = function () {
		var scripts = document.getElementsByTagName("script");
		eval(scripts[scripts.length - 1].innerHTML);
	}
	window.truthy = function (val) {
		return (val ? true : false);
	}
	window.unset = function () {
		var i = 0,
			arg = '',
			win = '',
			winRef = /^(?:this)?window[.[]/,
			arr = [],
			accessor = '',
			bracket = /\[['"]?(\d+)['"]?\]$/;
		for (i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			winRef.lastIndex = 0, bracket.lastIndex = 0;
			win = winRef.test(arg) ? '' : 'this.window.';
			if (bracket.test(arg)) {
				accessor = arg.match(bracket)[1];
				arr = eval(win + arg.replace(bracket, ''));
				arr.splice(accessor, 1);
			} else {
				eval('delete ' + win + arg);
			}
		}
	}
	window.vars = function () {
		var i = '',
			arr = [],
			already = {};
		for (i in this.window) {
			try {
				if (typeof this.window[i] === 'object') {
					for (var j in this.window[i]) {
						if (this.window[j] && !already[j]) {
							already[j] = 1;
							arr.push(j);
						}
					}
				} else if (!already[i]) {
					already[i] = 1;
					arr.push(i);
				}
			} catch (e) {
				if (!already[i]) {
					already[i] = 1;
					arr.push(i);
				}
			}
		}
		return arr;
	}
