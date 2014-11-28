function clog() {
	console.log(JSON.stringify(Array.prototype.slice.call(arguments).join(" ")));
}

window.nativeAlert = window.alert;
window.alert = function () {
	nativeAlert(Array.prototype.slice.call(arguments).join(" "));
}

//console.nativeLog = console.log;
var log = function () {
	console.log(Array.prototype.slice.call(arguments).join(" "));
}
var scripts = $("script")
	.filter(function (i, e) {
		return $(e).html() === "" && $(e).attr("src").substr(0, 6) === "/EGIS/";
	})
	.map(function (i, e) {
		return window.location.protocol + "//" + window.location.hostname + $(e).attr("src");
	}); // +"?version="+Date.now();

$("script").filter(function (i, e) {
	return $(e).html() === "" && $(e).attr("src").substr(0, 6) === "/EGIS/";
}).remove();
for (var i = 0, len = scripts.length; i < len; i++) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = scripts[i];
	console.log(script.src);
	$("body")[0].insertAdjacentHTML("beforeend", script.outerHTML);
}

function __CLASS__() {
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	return arguments.callee.caller && getFuncName(arguments[0].constructor);
}

function __DIR__() {
	return dirname(__FILE__());
}

function __FILE__() {
	var d = window.document;
	var t = d.getElementsByTagName('script');
	if (!t || t.length === 0) {
		t = d.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', 'script');
	}
	var url = t[t.length - 1];
	if (url.hasAttribute('src')) {
		var src = url.getAttribute('src');
		if (src !== '' && /^(https?|chrome):/.test(src)) {
			return src;
		}
	}
	return window.location.href;
}

function __FUNCTION__() {
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	return arguments.callee.caller && getFuncName(arguments.callee.caller);
}

function __LINE__(e) {
	return e.lineNumber;
}

function __METHOD__() {
	var getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	return arguments.callee.caller && getFuncName(arguments[0].constructor) + '::' + getFuncName(arguments.callee.caller);
}

window.deprecate = function (fn, msg) {
	if (config('noDeprecation')) {
		return fn;
	}
	var warned = false;

	function deprecated() {
		if (!warned) {
			if (config('throwDeprecation')) {
				throw new Error(msg);
			} else if (window.config('traceDeprecation')) {
				console.trace(msg);
			} else {
				console.error(msg);
			}
			warned = true;
		}
		return fn.apply(this, arguments);
	}
	return deprecated;
}

Object.prototype.source = function () {
	var output = [],
		temp;
	for (var i in this) {
		if (this.hasOwnProperty(i)) {
			temp = i + ":";
			switch (typeof this[i]) {
			case "object":
				temp += this[i].source();
				break;
			case "string":
				temp += "\"" + this[i] + "\"";
				break;
			default:
				temp += this[i];
			}
			output.push(temp);
		}
	}
	return "{" + output.join() + "}";
}
}

Object.prototype.dump = function (indent) {
	var obj = this;
	var result = "";
	if (indent == null) indent = "";
	for (var property in obj) {
		var value = obj[property];
		if (typeof value == 'string') value = "'" + value + "'";
		else if (typeof value == 'object') {
			if (value instanceof Array) {
				value = "[" + value + "]";
			} else {
				var od = DumpObjectIndented(value, indent + "  ");
				value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
			}
		}
		result += indent + "'" + property + "' : " + value + ",\n";
	}
	return result.replace(/,\n$/, "");
}

Object.prototype.pp = function (depth, embedded) {
	var object = this;
	typeof (depth) == "number" || (depth = 0)
	typeof (embedded) == "boolean" || (embedded = false)
	var newline = false
	var spacer = function (depth) {
		var spaces = "";
		for (var i = 0; i < depth; i++) {
			spaces += "  "
		};
		return spaces
	}
	var pretty = ""
	if (typeof (object) == "undefined") {
		pretty += "undefined"
	} else if (typeof (object) == "boolean" || typeof (object) == "number") {
		pretty += object.toString()
	} else if (typeof (object) == "string") {
		pretty += "\"" + object + "\""
	} else if (object == null) {
		pretty += "null"
	} else if (object instanceof(Array)) {
		if (object.length > 0) {
			if (embedded) {
				newline = true
			}
			var content = ""
			for each(var item in object) {
				content += pp(item, depth + 1) + ",\n" + spacer(depth + 1)
			}
			content = content.replace(/,\n\s*$/, "").replace(/^\s*/, "")
			pretty += "[" + content + "\n" + spacer(depth) + "]"
		} else {
			pretty += "[]"
		}
	} else if (typeof (object) == "object") {
		if (Object.keys(object).length > 0) {
			if (embedded) {
				newline = true
			}
			var content = ""
			for (var key in object) {
				content += spacer(depth + 1) + key.toString() + ": " + pp(object[key], depth + 2, true) + ",\n"
			}
			content = content.replace(/,\n\s*$/, "").replace(/^\s*/, "")
			pretty += "{" + content + "\n" + spacer(depth) + "}"
		} else {
			pretty += "{}"
		}
	} else {
		pretty += object.toString()
	}
	return ((newline ? "\n" + spacer(depth) : "") + pretty)
}

function var_dump() {
	var output = '',
		pad_char = ' ',
		pad_val = 4,
		lgth = 0,
		i = 0;
	var _getFuncName = function (fn) {
		var name = (/\W*function\s+([\w\$]+)\s*\(/)
			.exec(fn);
		if (!name) {
			return '(Anonymous)';
		}
		return name[1];
	};
	var _repeat_char = function (len, pad_char) {
		var str = '';
		for (var i = 0; i < len; i++) {
			str += pad_char;
		}
		return str;
	};
	var _getInnerVal = function (val, thick_pad) {
		var ret = '';
		if (val === null) {
			ret = 'NULL';
		} else if (typeof val === 'boolean') {
			ret = 'bool(' + val + ')';
		} else if (typeof val === 'string') {
			ret = 'string(' + val.length + ') "' + val + '"';
		} else if (typeof val === 'number') {
			if (parseFloat(val) == parseInt(val, 10)) {
				ret = 'int(' + val + ')';
			} else {
				ret = 'float(' + val + ')';
			}
		} else if (typeof val === 'undefined') {
			ret = 'undefined';
		} else if (typeof val === 'function') {
			var funcLines = val.toString()
				.split('\n');
			ret = '';
			for (var i = 0, fll = funcLines.length; i < fll; i++) {
				ret += (i !== 0 ? '\n' + thick_pad : '') + funcLines[i];
			}
		} else if (val instanceof Date) {
			ret = 'Date(' + val + ')';
		} else if (val instanceof RegExp) {
			ret = 'RegExp(' + val + ')';
		} else if (val.nodeName) {
			switch (val.nodeType) {
			case 1:
				if (typeof val.namespaceURI === 'undefined' || val.namespaceURI === 'http://www.w3.org/1999/xhtml') {
					ret = 'HTMLElement("' + val.nodeName + '")';
				} else {
					ret = 'XML Element("' + val.nodeName + '")';
				}
				break;
			case 2:
				ret = 'ATTRIBUTE_NODE(' + val.nodeName + ')';
				break;
			case 3:
				ret = 'TEXT_NODE(' + val.nodeValue + ')';
				break;
			case 4:
				ret = 'CDATA_SECTION_NODE(' + val.nodeValue + ')';
				break;
			case 5:
				ret = 'ENTITY_REFERENCE_NODE';
				break;
			case 6:
				ret = 'ENTITY_NODE';
				break;
			case 7:
				ret = 'PROCESSING_INSTRUCTION_NODE(' + val.nodeName + ':' + val.nodeValue + ')';
				break;
			case 8:
				ret = 'COMMENT_NODE(' + val.nodeValue + ')';
				break;
			case 9:
				ret = 'DOCUMENT_NODE';
				break;
			case 10:
				ret = 'DOCUMENT_TYPE_NODE';
				break;
			case 11:
				ret = 'DOCUMENT_FRAGMENT_NODE';
				break;
			case 12:
				ret = 'NOTATION_NODE';
				break;
			}
		}
		return ret;
	};
	var _formatArray = function (obj, cur_depth, pad_val, pad_char) {
		var someProp = '';
		if (cur_depth > 0) {
			cur_depth++;
		}
		var base_pad = _repeat_char(pad_val * (cur_depth - 1), pad_char);
		var thick_pad = _repeat_char(pad_val * (cur_depth + 1), pad_char);
		var str = '';
		var val = '';
		if (typeof obj === 'object' && obj !== null) {
			if (obj.constructor && _getFuncName(obj.constructor) === 'PHPJS_Resource') {
				return obj.var_dump();
			}
			lgth = 0;
			for (someProp in obj) {
				lgth++;
			}
			str += 'array(' + lgth + ') {\n';
			for (var key in obj) {
				var objVal = obj[key];
				if (typeof objVal === 'object' && objVal !== null && !(objVal instanceof Date) && !(objVal instanceof RegExp) && !
					objVal.nodeName) {
					str += thick_pad + '[' + key + '] =>\n' + thick_pad + _formatArray(objVal, cur_depth + 1, pad_val,
						pad_char);
				} else {
					val = _getInnerVal(objVal, thick_pad);
					str += thick_pad + '[' + key + '] =>\n' + thick_pad + val + '\n';
				}
			}
			str += base_pad + '}\n';
		} else {
			str = _getInnerVal(obj, thick_pad);
		}
		return str;
	};
	output = _formatArray(arguments[0], 0, pad_val, pad_char);
	for (i = 1; i < arguments.length; i++) {
		output += '\n' + _formatArray(arguments[i], 0, pad_val, pad_char);
	}
	echo(output);
}

function var_export(mixed_expression, bool_return) {
	var retstr = '',
		iret = '',
		value,
		cnt = 0,
		x = [],
		i = 0,
		funcParts = [],
		idtLevel = arguments[2] || 2,
		innerIndent = '',
		outerIndent = '',
		getFuncName = function (fn) {
			var name = (/\W*function\s+([\w\$]+)\s*\(/)
				.exec(fn);
			if (!name) {
				return '(Anonymous)';
			}
			return name[1];
		};
	_makeIndent = function (idtLevel) {
		return (new Array(idtLevel + 1))
			.join(' ');
	};
	__getType = function (inp) {
		var i = 0,
			match, types, cons, type = typeof inp;
		if (type === 'object' && (inp && inp.constructor) &&
			getFuncName(inp.constructor) === 'PHPJS_Resource') {
			return 'resource';
		}
		if (type === 'function') {
			return 'function';
		}
		if (type === 'object' && !inp) {
			return 'null';
		}
		if (type === 'object') {
			if (!inp.constructor) {
				return 'object';
			}
			cons = inp.constructor.toString();
			match = cons.match(/(\w+)\(/);
			if (match) {
				cons = match[1].toLowerCase();
			}
			types = ['boolean', 'number', 'string', 'array'];
			for (i = 0; i < types.length; i++) {
				if (cons === types[i]) {
					type = types[i];
					break;
				}
			}
		}
		return type;
	};
	type = __getType(mixed_expression);
	if (type === null) {
		retstr = 'NULL';
	} else if (type === 'array' || type === 'object') {
		outerIndent = _makeIndent(idtLevel - 2);
		innerIndent = _makeIndent(idtLevel);
		for (i in mixed_expression) {
			value = this.var_export(mixed_expression[i], 1, idtLevel + 2);
			value = typeof value === 'string' ? value.replace(/</g, '&lt;')
				.
			replace(/>/g, '&gt;') : value;
			x[cnt++] = innerIndent + i + ' => ' +
				(__getType(mixed_expression[i]) === 'array' ?
				'\n' : '') + value;
		}
		iret = x.join(',\n');
		retstr = outerIndent + 'array (\n' + iret + '\n' + outerIndent + ')';
	} else if (type === 'function') {
		funcParts = mixed_expression.toString()
			.
		match(/function .*?\((.*?)\) \{([\s\S]*)\}/);
		retstr = "create_function ('" + funcParts[1] + "', '" +
			funcParts[2].replace(new RegExp("'", 'g'), "\\'") + "')";
	} else if (type === 'resource') {
		retstr = 'NULL';
	} else {
		retstr = typeof mixed_expression !== 'string' ? mixed_expression :
			"'" + mixed_expression.replace(/(["'])/g, '\\$1')
			.
		replace(/\0/g, '\\0') + "'";
	}
	if (!bool_return) {
		echo(retstr);
		return null;
	}
	return retstr;
}

function var_inspect() {
	var ret = '',
		i = 0,
		j = 0;
	for (i = 0; i < arguments.length; i++) {
		var arg = arguments[i];
		switch (typeof arg) {
		case 'string':
			ret += 'unicode(' + arg.length + ') "' + arg + '" {';
			for (j = 0; j < arg.length; j++) {
				var hex = arg[j].charCodeAt(0).toString(16);
				ret += ' ' + (new Array(5 - hex.length)).join('0') + hex;
			}
			ret += ' }\n';
			break;
		}
	}
	return ret;
}

function print_r(array, return_val) {
	var output = '',
		pad_char = ' ',
		pad_val = 4,
		d = this.window.document,
		getFuncName = function (fn) {
			var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
			if (!name) {
				return '(Anonymous)';
			}
			return name[1];
		};
	repeat_char = function (len, pad_char) {
		var str = '';
		for (var i = 0; i < len; i++) {
			str += pad_char;
		}
		return str;
	};
	formatArray = function (obj, cur_depth, pad_val, pad_char) {
		if (cur_depth > 0) {
			cur_depth++;
		}
		var base_pad = repeat_char(pad_val * cur_depth, pad_char);
		var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
		var str = '';
		if (typeof obj === 'object' && obj !== null && obj.constructor && getFuncName(obj.constructor) !== 'PHPJS_Resource') {
			str += 'Array\n' + base_pad + '(\n';
			for (var key in obj) {
				if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
					str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
				} else {
					str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
				}
			}
			str += base_pad + ')\n';
		} else if (obj === null || obj === undefined) {
			str = '';
		} else {
			str = obj.toString();
		}
		return str;
	};
	output = formatArray(array, 0, pad_val, pad_char);
	if (return_val !== true) {
		if (d.body) {
			echo(output);
		} else {
			try {
				d = XULDocument;
				echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
			} catch (e) {
				echo(output);
			}
		}
		return true;
	}
	return output;
}

function print_r(array, return_val) {
	var output = '',
		pad_char = ' ',
		pad_val = 4,
		d = this.window.document,
		getFuncName = function (fn) {
			var name = (/\W*function\s+([\w\$]+)\s*\(/)
				.exec(fn);
			if (!name) {
				return '(Anonymous)';
			}
			return name[1];
		};
	repeat_char = function (len, pad_char) {
		var str = '';
		for (var i = 0; i < len; i++) {
			str += pad_char;
		}
		return str;
	};
	formatArray = function (obj, cur_depth, pad_val, pad_char) {
		if (cur_depth > 0) {
			cur_depth++;
		}
		var base_pad = repeat_char(pad_val * cur_depth, pad_char);
		var thick_pad = repeat_char(pad_val * (cur_depth + 1), pad_char);
		var str = '';
		if (typeof obj === 'object' && obj !== null && obj.constructor) {
			str += 'Array\n' + base_pad + '(\n';
			for (var key in obj) {
				if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
					str += thick_pad + '[' + key + '] => ' + formatArray(obj[key], cur_depth + 1, pad_val, pad_char);
				} else {
					str += thick_pad + '[' + key + '] => ' + obj[key] + '\n';
				}
			}
			str += base_pad + ')\n';
		} else if (obj === null || obj === undefined) {
			str = '';
		} else {
			str = obj.toString();
		}
		return str;
	};
	output = formatArray(array, 0, pad_val, pad_char);
	if (return_val !== true) {
		if (d.body) {
			echo(output);
		} else {
			try {
				d = XULDocument;
				echo('<pre xmlns="http://www.w3.org/1999/xhtml" style="white-space:pre;">' + output + '</pre>');
			} catch (e) {
				echo(output);
			}
		}
		return true;
	}
	return output;
}

window.nativeAlert = window.alert
window.logAlert = false;
window.logError = false;
window.alert = function (b) {
	window.logAlert = b;
	if (window.logAlert === true) {
		console.log(args(arguments).join(", "));
	}
	window.nativeAlert(args(arguments).join(", "));
	return this;
}

window.dump = function (a) {
	if (a) {
		for (var b in window) {
			if (window.hasOwnProperty(b)) {
				console.log(b);
			}
		}
	}
	var standardGlobals = ["top", "window", "location", "external", "chrome", "document", "inlineCSS", "target", "width", "height", "canvas", "data", "DOMURL", "img", "svg", "ctx", "url", "w", "a", "speechSynthesis", "webkitNotifications", "localStorage", "sessionStorage", "applicationCache", "webkitStorageInfo", "indexedDB", "webkitIndexedDB", "crypto", "CSS", "performance", "console", "devicePixelRatio", "styleMedia", "parent", "opener", "frames", "self", "defaultstatus", "defaultStatus", "status", "name", "length", "closed", "pageYOffset", "pageXOffset", "scrollY", "scrollX", "screenTop", "screenLeft", "screenY", "screenX", "innerWidth", "innerHeight", "outerWidth", "outerHeight", "offscreenBuffering", "frameElement", "clientInformation", "navigator", "toolbar", "statusbar", "scrollbars", "personalbar", "menubar", "locationbar", "history", "screen", "postMessage", "close", "blur", "focus", "ondeviceorientation", "ondevicemotion", "onunload", "onstorage", "onresize", "onpopstate", "onpageshow", "onpagehide", "ononline", "onoffline", "onmessage", "onhashchange", "onbeforeunload", "onwaiting", "onvolumechange", "ontimeupdate", "onsuspend", "onsubmit", "onstalled", "onshow", "onselect", "onseeking", "onseeked", "onscroll", "onreset", "onratechange", "onprogress", "onplaying", "onplay", "onpause", "onmousewheel", "onmouseup", "onmouseover", "onmouseout", "onmousemove", "onmouseleave", "onmouseenter", "onmousedown", "onloadstart", "onloadedmetadata", "onloadeddata", "onload", "onkeyup", "onkeypress", "onkeydown", "oninvalid", "oninput", "onfocus", "onerror", "onended", "onemptied", "ondurationchange", "ondrop", "ondragstart", "ondragover", "ondragleave", "ondragenter", "ondragend", "ondrag", "ondblclick", "oncuechange", "oncontextmenu", "onclose", "onclick", "onchange", "oncanplaythrough", "oncanplay", "oncancel", "onblur", "onabort", "onwheel", "onwebkittransitionend", "onwebkitanimationstart", "onwebkitanimationiteration", "onwebkitanimationend", "ontransitionend", "onsearch", "getSelection", "print", "stop", "open", "showModalDialog", "alert", "confirm", "prompt", "find", "scrollBy", "scrollTo", "scroll", "moveBy", "moveTo", "resizeBy", "resizeTo", "matchMedia", "requestAnimationFrame", "cancelAnimationFrame", "webkitRequestAnimationFrame", "webkitCancelAnimationFrame", "webkitCancelRequestAnimationFrame", "captureEvents", "releaseEvents", "atob", "btoa", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "TEMPORARY", "PERSISTENT", "getComputedStyle", "getMatchedCSSRules", "webkitConvertPointFromPageToNode", "webkitConvertPointFromNodeToPage", "webkitRequestFileSystem", "webkitResolveLocalFileSystemURL", "openDatabase", "addEventListener", "removeEventListener", "dispatchEvent"];
	var appSpecificGlobals = {};
	for (var w in window) {
		if (standardGlobals.indexOf(w) == -1) {
			appSpecificGlobals[w] = window[w];
		}
	}
	console.log(appSpecificGlobals);
	return this;
}

window.echo = function () {
	console.log(this, args(arguments))
};
window.print = function () {
	console.log(this, args(arguments))
};

window.throw = function () {
	console.log(new Error().stack);
	return this;
}

window.error = function (b) {
	window.logError = b;
	if (b === false) {
		window.onerror = function () {};
		return;
	}
	window.onerror = function (msg, url, line) {
		window.nativeAlert("Message: " + msg, "\nurl: " + url, "\nLine Number: " + line);
		console.log("Message: " + msg, "\nurl: " + url, "\nLine Number: " + line);
	};
	return this;

}

//$(document).bind({ cut: function () {}, copy: function () {}, paste: function () {} });
window.logCut = function () {
	$(document).on("cut", function (e) {
		var selectedText = (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);
		if (!selectedText || selectedText == "") {
			if (document.activeElement.selectionStart) {
				selectedText = document.activeElement.value.substring(document.activeElement.selectionStart.document.activeElement.selectionEnd);
			}
		}
		console.log(selectedText.toString());
	});
}
window.logCopy = function () {
	$(document).on("copy", function (e) {
		var selectedText = (window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange().text);
		if (!selectedText || selectedText == "") {
			if (document.activeElement.selectionStart) {
				selectedText = document.activeElement.value.substring(document.activeElement.selectionStart.document.activeElement.selectionEnd);
			}
		}
		console.log(selectedText.toString());
	});
}
window.logPaste = function () {
	$(document).on("paste", function (e) {
		var pastedText = "";
		if (window.clipboardData && window.clipboardData.getData) {
			pastedText = window.clipboardData.getData('Text');
		} else if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
			pastedText = e.originalEvent.clipboardData.getData('text/plain');
		}
		console.log(pastedText);
	});
}

function echo() {
	var isNode = typeof module !== 'undefined' && module.exports && typeof global !== "undefined" && {}.toString.call(global) == '[object global]';
	if (isNode) {
		var args = Array.prototype.slice.call(arguments);
		return console.log(args.join(' '));
	}
	var arg = '';
	var argc = arguments.length;
	var argv = arguments;
	var i = 0;
	var holder, win = this.window;
	var d = win.document;
	var ns_xhtml = 'http://www.w3.org/1999/xhtml';
	var ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
	var stringToDOM = function (str, parent, ns, container) {
		var extraNSs = '';
		if (ns === ns_xul) {
			extraNSs = ' xmlns:html="' + ns_xhtml + '"';
		}
		var stringContainer = '<' + container + ' xmlns="' + ns + '"' + extraNSs + '>' + str + '</' + container + '>';
		var dils = win.DOMImplementationLS;
		var dp = win.DOMParser;
		var ax = win.ActiveXObject;
		if (dils && dils.createLSInput && dils.createLSParser) {
			var lsInput = dils.createLSInput();
			lsInput.stringData = stringContainer;
			var lsParser = dils.createLSParser(1, null);
			return lsParser.parse(lsInput)
				.firstChild;
		} else if (dp) {
			try {
				var fc = new dp()
					.parseFromString(stringContainer, 'text/xml');
				if (fc && fc.documentElement && fc.documentElement.localName !== 'parsererror' && fc.documentElement.namespaceURI !==
					'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
					return fc.documentElement.firstChild;
				}
			} catch (e) {}
		} else if (ax) {
			var axo = new ax('MSXML2.DOMDocument');
			axo.loadXML(str);
			return axo.documentElement;
		}
		if (d.createElementNS &&
			(d.documentElement.namespaceURI ||
				d.documentElement.nodeName.toLowerCase() !== 'html' ||
				(d.contentType && d.contentType !== 'text/html')
			)) {
			holder = d.createElementNS(ns, container);
		} else {
			holder = d.createElement(container);
		}
		holder.innerHTML = str;
		while (holder.firstChild) {
			parent.appendChild(holder.firstChild);
		}
		return false;
	};
	var ieFix = function (node) {
		if (node.nodeType === 1) {
			var newNode = d.createElement(node.nodeName);
			var i, len;
			if (node.attributes && node.attributes.length > 0) {
				for (i = 0, len = node.attributes.length; i < len; i++) {
					newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
				}
			}
			if (node.childNodes && node.childNodes.length > 0) {
				for (i = 0, len = node.childNodes.length; i < len; i++) {
					newNode.appendChild(ieFix(node.childNodes[i]));
				}
			}
			return newNode;
		} else {
			return d.createTextNode(node.nodeValue);
		}
	};
	var replacer = function (s, m1, m2) {
		if (m1 !== '\\') {
			return m1 + eval(m2);
		} else {
			return s;
		}
	};

	for (i = 0; i < argc; i++) {
		if (d.appendChild) {
			if (d.body) {
				if (win.navigator.appName === 'Microsoft Internet Explorer') {
					d.body.appendChild(stringToDOM(ieFix(arg)));
				} else {
					var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div')
						.cloneNode(true);
					if (unappendedLeft) {
						d.body.appendChild(unappendedLeft);
					}
				}
			} else {
				d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description'));
			}
		} else if (d.write) {
			d.write(arg);
		} else {
			console.log(arg);
		}
	}
}

function fprintf(handle, format) {
	var str = this.sprintf.apply(this, Array.prototype.slice.call(arguments, 1));
	try {
		this.fwrite(handle, str);
	} catch (e) {
		throw new Error('Error in fprintf() file-writing');
	}
	return str.length;
}

function vfprintf(handle, format, args) {
	var str = this.sprintf.apply(this, [].concat(format, args));
	try {
		this.fwrite(handle, str);
	} catch (e) {
		throw new Error('Error in vfprintf() file-writing');
	}
	return str.length;
}

function vprintf(format, args) {
	var body, elmt;
	var ret = '',
		d = this.window.document;
	var HTMLNS = 'http://www.w3.org/1999/xhtml';
	body = d.getElementsByTagNameNS ? (d.getElementsByTagNameNS(HTMLNS, 'body')[0] ? d.getElementsByTagNameNS(HTMLNS,
		'body')[0] : d.documentElement.lastChild) : d.getElementsByTagName('body')[0];
	if (!body) {
		return false;
	}
	ret = this.sprintf.apply(this, [format].concat(args));
	elmt = d.createTextNode(ret);
	body.appendChild(elmt);
	return ret.length;
}

function vsprintf(format, args) {
	return this.sprintf.apply(this, [format].concat(args));
}

function print(arg) {
	echo(arg);
	return 1;
}

function printf() {
	var body, elmt, d = this.window.document;
	var ret = '';
	var HTMLNS = 'http://www.w3.org/1999/xhtml';
	body = d.getElementsByTagNameNS ? (d.getElementsByTagNameNS(HTMLNS, 'body')[0] ? d.getElementsByTagNameNS(HTMLNS,
		'body')[0] : d.documentElement.lastChild) : d.getElementsByTagName('body')[0];
	if (!body) {
		return false;
	}
	ret = this.sprintf.apply(this, arguments);
	elmt = d.createTextNode(ret);
	body.appendChild(elmt);
	return ret.length;
}

function sprintf() {
	var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
	var a = arguments;
	var i = 0;
	var format = a[i++];
	var pad = function (str, len, chr, leftJustify) {
		if (!chr) {
			chr = ' ';
		}
		var padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0)
			.join(chr);
		return leftJustify ? str + padding : padding + str;
	};
	var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
		var diff = minWidth - value.length;
		if (diff > 0) {
			if (leftJustify || !zeroPad) {
				value = pad(value, minWidth, customPadChar, leftJustify);
			} else {
				value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
			}
		}
		return value;
	};
	var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
		var number = value >>> 0;
		prefix = prefix && number && {
			'2': '0b',
			'8': '0',
			'16': '0x'
		}[base] || '';
		value = prefix + pad(number.toString(base), precision || 0, '0', false);
		return justify(value, prefix, leftJustify, minWidth, zeroPad);
	};
	var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
		if (precision != null) {
			value = value.slice(0, precision);
		}
		return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
	};
	var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
		var number, prefix, method, textTransform, value;
		if (substring === '%%') {
			return '%';
		}
		var leftJustify = false;
		var positivePrefix = '';
		var zeroPad = false;
		var prefixBaseX = false;
		var customPadChar = ' ';
		var flagsl = flags.length;
		for (var j = 0; flags && j < flagsl; j++) {
			switch (flags.charAt(j)) {
			case ' ':
				positivePrefix = ' ';
				break;
			case '+':
				positivePrefix = '+';
				break;
			case '-':
				leftJustify = true;
				break;
			case "'":
				customPadChar = flags.charAt(j + 1);
				break;
			case '0':
				zeroPad = true;
				customPadChar = '0';
				break;
			case '#':
				prefixBaseX = true;
				break;
			}
		}
		if (!minWidth) {
			minWidth = 0;
		} else if (minWidth === '*') {
			minWidth = +a[i++];
		} else if (minWidth.charAt(0) == '*') {
			minWidth = +a[minWidth.slice(1, -1)];
		} else {
			minWidth = +minWidth;
		}
		if (minWidth < 0) {
			minWidth = -minWidth;
			leftJustify = true;
		}
		if (!isFinite(minWidth)) {
			throw new Error('sprintf: (minimum-)width must be finite');
		}
		if (!precision) {
			precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
		} else if (precision === '*') {
			precision = +a[i++];
		} else if (precision.charAt(0) == '*') {
			precision = +a[precision.slice(1, -1)];
		} else {
			precision = +precision;
		}
		value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
		switch (type) {
		case 's':
			return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
		case 'c':
			return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
		case 'b':
			return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'o':
			return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'x':
			return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'X':
			return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad)
				.toUpperCase();
		case 'u':
			return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
		case 'i':
		case 'd':
			number = +value || 0;
			number = Math.round(number - number % 1);
			prefix = number < 0 ? '-' : positivePrefix;
			value = prefix + pad(String(Math.abs(number)), precision, '0', false);
			return justify(value, prefix, leftJustify, minWidth, zeroPad);
		case 'e':
		case 'E':
		case 'f':
		case 'F':
		case 'g':
		case 'G':
			number = +value;
			prefix = number < 0 ? '-' : positivePrefix;
			method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
			textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
			value = prefix + Math.abs(number)[method](precision);
			return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
		default:
			return substring;
		}
	};
	return format.replace(regex, doFormat);
}

Function.prototype.debug = function (desc) {
	return Function.prototype.deb.apply(this, [desc, true])
}
Function.prototype.deb = function (desc, collapsed) {
	var getColor = function () {
		return 'rgb(' + (Math.floor((256 - 180) * Math.random()) + 200) + ',' + (Math.floor((256 - 180) * Math.random()) + 200) + ',' + (Math.floor((256 - 180) * Math.random()) + 200) + ')';
	}
	var log = function (str, group, styles) {
		if (typeof console === 'undefined') return;
		if (is_chrome && typeof str === 'string') {
			if (styles !== false && str.indexOf('%20') < 0) {
				console[group ? (collapsed ? 'groupCollapsed' : 'group') : 'log']('%c' + str, 'background:' + bg + ';' + styles);
			} else {
				console[group ? (collapsed ? 'groupCollapsed' : 'group') : 'log'](str);
			}
		} else {
			console[group ? 'group' : 'log'](str);
		}
	}
	var groupEnd = function () {
		if (typeof console === 'undefined') return;
		console.groupEnd();
	}
	var getFnDef = function (fn) {
		return fn.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[0];
	}
	var fnIn = function (stack, args, fn) {
		var fnDef = getFnDef(fn);
		if (stack[0].indexOf('Error') === 0) {
			stack = stack.slice(1);
		}
		log(desc + fnDef + ')', grouping);
		if (args && args.length > 0) {
			log('arguments:', true);
			for (var i = 0; i < args.length; i++) {
				var a = typeof args[i] == 'function' ? 'function' : args[i];
				log(a, false, 'color:#727272;font-size:10px;');
			}
			groupEnd();
		}
		if (stack && stack.length > 1) {
			log('stack trace:', true);
			for (var i = 0; i < stack.length; i++) {
				log('  ' + stack[i].trim(), false, false);
			}
			groupEnd();
		}
	}
	var fnOut = function (time, res) {
		var isFunc = typeof res == 'function';
		log('  returns: ' + ((isFunc && getFnDef(res)) || ''), !isFunc);
		!isFunc && (log(res, false) || groupEnd());
		log('  duration: ' + (Date.now() - time) + 'ms');
		log('}');
		if (grouping) {
			groupEnd();
		}
	}

	var fn = this,
		desc = desc ? desc + ': ' : '',
		indent = 0,
		bg,
		grouping = console && console.group && console.groupEnd,
		is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

	return function () {
		bg = getColor();
		var time = Date.now();
		fnIn((new Error()).stack.split(new RegExp("\\n")), arguments, fn);
		var res = fn.apply(this, Array.prototype.slice.call(arguments, 0));
		fnOut(time, res);
		return res;
	}
}
