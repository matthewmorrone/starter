window.define = function(obj, name, value) {if (value) {var config = {value: value, enumerable: false, configurable: true, writable: true}; Object.defineProperty(obj, name, config); return true; } window[obj] = name; }
window.make = function(tag, $) {var el = document.createElement(tag); return ($ ? $(el) : el); }
window.create = function(element, arg) {var elem = document.createElement(element); if (arg) {var attrs = arg; for (var attr in attrs) {elem.setAttribute([attr], attrs[attr]); } } return elem; }


Object.create = function(parent, props){
	function F(){}
	F.prototype = parent;
	return (props ? new F() : this.mixin(new F(), props));
}
window.new = function(proto) {
	function ctor() {}
	ctor.prototype = proto;
	return new ctor();
}
function createNew(C, args) {
	var o = new C();
	C.apply(o, args);
	return o;
}

window.uniqueId = function(prefix) {if (prefix == undefined) {prefix = 'id';} for (var i = 0; $(prefix+i); i++) {}; return prefix+i; }
