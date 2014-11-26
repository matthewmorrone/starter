

define(['jquery'], function($) {
	$.each({
		checked: "checked",
		class: "class",
		colspan: "colspan",
		content: "content",
		disabled: "disabled",
		for: "for",
		href: "href",
		id: "id",
		label: "label",
		multiple: "multiple",
		name: "name",
		readonly: "readonly",
		rel: "rel",
		rowspan: "rowspan",
		selected: "selected",
		src: "src",
		style: "style",
		target: "target",
		// text: "text",
		title: "title",
		type: "type",
		valign: "valign",
		value: "value"
	}, function (name, type) {
		elem = this[0]
		$.fn[name] = function (value) {
			return $.access(this, function (elem, type, value) {
				if (value === undefined) {
					orig = $.attr(elem, type);
					ret = parseFloat(orig);
					return ($.isNumeric(ret) ? ret : orig);
				}
				$(elem).attr(type, value);

			}, type, value, arguments.length, null)

		}

	});

	$.each({
		background: "background",
		border: "border",
		bottom: "bottom",
		color: "color",
		cursor: "cursor",
		display: "display",
		float: "float",
		font: "font",
		height: "height",
		left: "left",
		margin: "margin",
		outline: "outline",
		overflow: "overflow",
		padding: "padding",
		position: "position",
		right: "right",
		top: "top",
		visibility: "visibility",
		width: "width"
	}, function (name, type) {
		elem = this[0]
		$.fn.css[name] = function (value) {
			return $.access(this, function (elem, type, value) {
				if (value === undefined) {
					orig = $.css(elem, type);
					ret = parseFloat(orig);
					return ($.isNumeric(ret) ? ret : orig);

				}
				$(elem).css(type, value);

			}, type, value, arguments.length, null)
		}
	});
});