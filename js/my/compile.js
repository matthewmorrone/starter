
	$("coffeescript").each(function() {
		var $this = $(this);
		var script = $("<script><\/script>", {type: "text\/javascript"}).text(CoffeeScript.compile($this.text()));
		$this.replaceWith(script);
	});
	var LiveScript = require("LiveScript");
	$("livescript").each(function() {
		var $this = $(this);
		var script = $("<script><\/script>", {type: "text\/javascript"}).text(LiveScript.compile($this.text()));
		$this.replaceWith(script);
	});

/*

function assert(test, msg) {
	var color = test ? "green" : "red";
	var stat = test ? "passed" : "failed";
	document.write("<div style='color:" + color + "'>"+ stat + ": " + msg + "</div>");
}
$(function() {
	var LiveScript = require("LiveScript");
	assert(LiveScript, "LiveScript exists");
	assert(LiveScript.compile, "LiveScript.compile exists");
	assert(LiveScript.go, "LiveScript.go exists");



	$("livescript").each(function() {
		var $this = $(this);
		log(LiveScript)
		var ls = LiveScript.compile($this.text(), {bare: true});
		var script = $("<script><\/script>", {type: "text\/javascript"}).text(ls);
		log(ls);
		$this.replaceWith(script);
	});

});

*/





