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
<style>
.table .col .cell {
	@b-top: @sb;
	@b-left: @sb;
}
.table .col: last-child {
	@b-right: @sb;
}
.table .col {
	@b-bottom: @sb;
}
.table .col {
	float: left;
}
.table .caption {
	@b-top: @sb;
	@b-left: @sb;
	@b-right: @sb;
	text-align: center;
}
</style>
