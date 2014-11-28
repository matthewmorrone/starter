[].forEach.call($$("*"),function(a){
	a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)
})



Object.defineProperty(Object.prototype, "asString", { enumerable: false, value: function() { return JSON.stringify(this); } });
console.log(JSON.parse(data.results.replace("\\", "\\\\")));


// logargs(this); == console.log(this,arguments);

window.logargs = function(context){
	// grab the calling functions arguments
	log(context,arguments.callee.caller.arguments);
}
function callTaker(a, b, c, d, e) {
	// arguments properties
	console.log(arguments);
	console.log(arguments.length);
	console.log(arguments.callee);
	console.log(arguments[1]);
	// Function properties
	console.log(callTaker.length);
	console.log(callTaker.caller);
	console.log(arguments.callee.caller);
	console.log(arguments.callee.caller.caller);
	console.log(callTaker.name);
	console.log(callTaker.constructor);
}
window.log = function(){
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if(this.console){
		console.log( Array.prototype.slice.call(arguments) );
	}
};
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};
var Log = Error;
Log.prototype.write = function () {
		var args = Array.prototype.slice.call(arguments, 0),
				suffix = this.lineNumber ? 'line: '  + this.lineNumber : 'stack: ' + this.stack;

		console.log.apply(console, args.concat([suffix]));
};

var a = Log().write('monkey' + 1, 'test: ' + 2);

var b = Log().write('hello' + 3, 'test: ' + 4);

(new Error).lineNumber
log: function log(arg) {
		var toPrint = [];
		for (var i = 0; i < arguments.length; ++i) {
				toPrint.push(arguments[i]);
		}

		function getErrorObject(){
				try { throw Error('') } catch(err) { return err; }
		}

		var err = getErrorObject(),
				caller;

		if ($.browser.mozilla) {
				caller = err.stack.split("\n")[2];
		} else {
				caller = err.stack.split("\n")[4];
		}

		var index = caller.indexOf('.js');

		var str = caller.substr(0, index + 3);
		index = str.lastIndexOf('/');
		str = str.substr(index + 1, str.length);

		var info = "\t\tFile: " + str;

		if ($.browser.mozilla) {
				str = caller;
		} else {
				index = caller.lastIndexOf(':');
				str = caller.substr(0, index);
		}
		index = str.lastIndexOf(':');
		str = str.substr(index + 1, str.length);
		info += " Line: " + str;
		toPrint.push(info);

		console.log.apply(console, toPrint);
}
var O = Object;
if (!O.define) {
	O.defineProperty(Object.prototype, "define", {
		enumerable: false,
		configurable: true,
		writable: true,
		value: function(key, value) {
			O.defineProperty(Object.prototype, key, { enumerable: false, value: value });
		}
	});
}
if (!O.stringify) {
	O.define("stringify", function() { return JSON.stringify(this); });
}
if (!O.parse) {
	O.define("parse", function() { return JSON.parse(this); });
}
if (!O.clone) {
	O.define("clone", function() { return JSON.parse(JSON.stringify(this)); });
}

window.onerror = function (msg, url, line) {
	 console.log("Message : " + msg );
	 console.log("url : " + url );
	 console.log("Line number : " + line );
}
[].forEach.call($$("*"),function(a){a.style.outline="1px solid #"+(~~(Math.random()*(1<<24))).toString(16)})
var str = 'posterous';

if ( !~str.search('t') ) {
	// character 't' not found branch
}
else{
	// found branch
}
'use strict';
var stripAnsi = require('strip-ansi');
var reAstral = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

module.exports = function (str) {
	return stripAnsi(str).replace(reAstral, ' ').length;
};
results[i][j][k].checked = Math.floor(Math.random() * 6 + 1) === 6;


results[i][j][k].checked = Math.floor(Math.random() * 4 + 1) === 4;
