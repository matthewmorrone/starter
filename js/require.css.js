


(function () {

	var toString = Object.prototype.toString;
	Array.prototype.each = Array.prototype.forEach;
	function isArray(object) {
		return toString.call(object) == '[object Array]';
	}

	function isString(object) {
		return toString.call(object) === '[object String]';
	}

	define(function () {
		var requireCSS = function() {
			var args = Array.prototype.slice.call(arguments);
			var path = "./";
			var files = [];
			var callback;
			if (isString(args[0])) {
				path += args[0] + "/";
				files = args[1];
				callback = args[2];
			}
			else {
				files = args[0];
				callback = args[1];
			}
			var paths = files.map(function(a) {return path+a+".css";});
			paths.every(function(url) {
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = url;
				document.getElementsByTagName("head")[0].appendChild(link);
				return true;
			});
		};

		return requireCSS;

	});

	
}());