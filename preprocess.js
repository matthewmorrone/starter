/*
<style>
.table.col.cell {
	@bb-top: @sb;
	@b-left: @sb;
}
.table.col: last-child {
	@b-right: @sb;
}
.table.col {
	@b-bottom: @sb;
}
.table.col {
	float: left;
}
.table.caption {
	@b-top: @sb;
	@b-left: @sb;
	@b-right: @sb;
	text-align: center;
}
</style>
<script>
$(@f() {

});
</script>
*/

var scripts = {
	"f": "function",
}
var styles = {
	"sb": "1px solid black",
	"b": "border",
};
String.prototype.usurp = function (dict) {
	var flag = arguments[1] || "@";
	var str = Object.keys(dict).join('|');
	var re = RegExp(flag + '(' + str + ')', 'ig');
	return this.replace(re, function (_, word) {
		_ = dict[word.toLowerCase()];
		if (/^[A-Z][a-z]/.test(word)) // initial caps
			_ = _.slice(0, 1).toUpperCase() + _.slice(1);
		else if (/^[A-Z][A-Z]/.test(word)) // all caps
			_ = _.toUpperCase();
		return _;
	});
}
if (typeof String.prototype.supplant !== 'function') {
	String.prototype.supplant = function (o) {
		return this.replace(/{{([^{}]*)}}/g, function (a, b) {
			var r = o[b];
			return typeof r === 'string' ? r : a;
		});
	};
}
$("style").each(function () {
	$(this).text($(this).text().usurp(styles));
});
$("script").each(function () {
	$(this).text($(this).text().usurp(scripts));
});
window.preprocess = function () {
	if (!document.head) {
		var $head = window.make("head", $);
	}
	if (!document.body) {
		var $body = window.make("body", $);
	}
	$headies = $(document).find("script, link, icon, style, fragment, meta, title");
	$bodies = $(document).find(":not(script, link, icon, style, fragment, meta, title)");
	$head.html(headies);
	$body.html(bodies);
	var $html = window.make("html", $);
	$html.append($head).append($body);

	$("script").each(function () {
		var script = $(this);
		var inline = $("<script></script>");
		var include = $("<script></script>");

		if (script.text() !== "" && script.src() !== "") {
			inline.text(script.text());
			include.src(script.src());
		}
		script.after(include).after(inline);
		script.remove();

		// 'use strict';
	})

	$("style").each(function () {
		var style = $(this);
		var link = $("<link />", {
			rel: "stylesheet",
			type: "text/css"
		});
		var styles = $("<style></style>");

		if (style.src() !== "") {
			if (style.text() == "") {
				link.href(style.src());
				$("head").append(link);
			} else {
				link.attr("href", style.src());
				styles.text(style.text());
				$("head").append(link);
				$("head").append(styles);
			}

		}
		style.remove();

	});
	$("icon").each(function () {
		var icon = $(this);
		var link = $("<link />", {
			href: icon.src(),
			rel: "icon",
			type: "image/png"
		});
		icon.remove();
		$("head").append(link);
	});
	$("fragment[data-src]").each(function () {
		var src = $(this);
		$.post(src.attr("data-src"), function (data) {
			src.html(data);
		});
	});
}
