var load = (function() {
	var generatePaths = function(path, files, ext) {
		return files.map(function(a) {return path+"/"+a+"."+ext;});
	}
	var load = {
		js: function(files, path) {
			var path = (path ? "."+path : ".");
			var paths = generatePaths(path, files, "js");
			var scripts = paths.map(function(url) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = url;
				document.getElementsByTagName("head")[0].appendChild(script);
				return script;
			});
			return scripts;
		},
		css: function(files, path) {
			var path = (path ? "."+path : ".");
			var paths = generatePaths(path, files, "css");
			var links = paths.map(function(url) {
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = url;
				document.getElementsByTagName("head")[0].appendChild(link);
				return link;
			});
			return links;
		}
	};

	return load;
})();

