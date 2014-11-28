(function() {
	function noop() {}


	var __toString = Object.prototype.toString;
	var __slice = Array.prototype.slice;

	define(Boolean.prototype, 	"alert", function(){nativeAlert(this);};);
	define(Number.prototype, 	"alert", function(){nativeAlert(this);};);
	define(String.prototype, 	"alert", function(){nativeAlert(this);};);
	define(Function.prototype, 	"alert", function(){nativeAlert(this.toString());};);
	define(Array.prototype, 	"alert", function(){nativeAlert(this.join(", "));};);
	define(Date.prototype, 		"alert", function(){nativeAlert(this);};);
	define(RegExp.prototype, 	"alert", function(){nativeAlert(this);};);
	define(Object.prototype, 	"alert", function(){nativeAlert(JSON.stringify(this););};);
})();


