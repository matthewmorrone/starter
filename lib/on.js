
$.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
"change select submit keydown keypress keyup error contextmenu").split(" "),
function(i, name)
{
	$.fn[name] = function(fn) {
		return arguments.length > 0 ?
			$(document).on(name, this, fn) :
			this.trigger(name);
	};
});

