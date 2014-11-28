var slowEach = jQuery.fn.each;
jQuery.fn.each = (function () {
	var jq = jQuery([1]);
	return function (c) {
		var i = -1,
			el, len = this.length;
		try {
			while (++i < len &&
				(el = jq[0] = this[i]) &&
				c.call(jq, i, el) !== false);
		} catch (e) {
			delete jq[0];
			throw e;
		}
		delete jq[0];
		return this;
	};
}());

(function ($) {

	$.logCallsTo = function (method, isOn$) {
		var old = isOn ? $[method] : $.fn[method],
			that = this;
		(isOn$ ? $ : $.fn)[method] = function () {
			window.console && console.log.apply(console, [this, method, arguments]);
			return old.apply(this, arguments);
		}
	}

	$.cache = {};
	$.publish = function ( /* String */ topic, /* Array? */ args) {
		cache[topic] && $.each(cache[topic], function () {
			this.apply($, args || []);
		});
	};
	$.subscribe = function ( /* String */ topic, /* Function */ callback) {
		if (!cache[topic]) {
			cache[topic] = [];
		}
		cache[topic].push(callback);
		return [topic, callback];
	};
	$.unsubscribe = function ( /* Array */ handle) {
		var t = handle[0];
		cache[t] && $.each(cache[t], function (idx) {
			if (this == handle[1]) {
				cache[t].splice(idx, 1);
			}
		});
	};

	$.hitch = function (scope, method) {
		if (!method) {
			method = scope;
			scope = null;
		}
		if (typeof method == "string") {
			scope = scope || window;
			if (!scope[method]) {
				throw (['method not found']);
			}
			return function () {
				return scope[method].apply(scope, arguments || []);
			};
		}
		return !scope ? method : function () {
			return method.apply(scope, arguments || []);
		};
	}

	$.fn.dataAttr = function (attr, val) {
		return val ? this.attr('data-' + attr, val) : this.attr('data-' + attr);
	};
	$.fn.scrollTo = function (e) {
		return this.live('click', function () {
			$('html,body').animate({
				'scrollTop': $($(this).attr('href')).offset().top - 40 + 'px'
			});
		})
	};
	$.fn.bindIf = function (eventType, eventHandler, ifCondition) {
		var proxy = function (event) {
			if (ifCondition()) {
				eventHandler.apply(this, arguments);
			}
		};
		this.bind(eventType, proxy);
		return (this);
	};

	$.fn.doOffDom = function (hollaback) {
		var ref = this.next()[0] || null,
			par = this[0].parentNode;
		this.detach();
		hollaback.apply(this, arguments);
		par.insertBefore(this[0], ref);
		return this;
	};

	$.fn.hoverClass = function (str) {
		str = str || 'hover';
		return $(this).hover(function () {
			$(this).addClass(str)
		}, function () {
			$(this).removeClass(str)
		});
	}

	$.fn.indexOf = function (selector) {
		return $.inArray($(this).filter(selector)[0], $.makeArray(this))
	}

	$.fn.setAllToMaxHeight = function () {
		return this.height(Math.max.apply(this, $.map(this, function (e) {
			return $(e).height();
		})));
	}

	$.fn.splitAnd = function (num, func, is$) {
		var low = 0,
			high = num;
		while (this.eq(low).length) {
			if (is$ || this instanceOf jQuery) {
				func.apply(this.slice(low, high));
			} else {
				func.apply($.makeArray(this.slice(low, high)));
			}
			low = high;
			high = high + num;
		}
		return this;
	}

	$.parseURI = function (url) {
		function parseURI(str) {
			var o = parseURI.options,
				m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
				uri = {},
				i = 14;
			while (i--) uri[o.key[i]] = m[i] || "";
			uri[o.q.name] = {};
			uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
				if ($1) uri[o.q.name][$1] = $2
			});
			return uri
		};
		parseURI.options = {
			strictMode: false,
			key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
			q: {
				name: "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		};
		if (typeof url === 'string') {
			return parseURI(url);
		}
		return parseURI(document.location.href);
	}

	$.expr[":"].visible = function (a) {
		return !(jQuery(a).is(':hidden') || jQuery(a).parents(':hidden').length);
	};
	$.expr[':'].aria = function (e, i, m) {
		var attrs = e.attributes;
		for (var x in attrs) {
			if (attrs[x].nodeName && attrs[x].nodeName.match(/^aria-/)) {
				return m[3] ? $(e).filter('[aria-' + m[3] + ']').length : true;
			}
		}
		return false;
	}
	$.expr[':'].focus = function (a) {
		return (a == document.activeElement);
	}
	$.expr[":"].contains = $.expr.createPseudo(function (arg) {
		return function (elem) {
			return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});

	$.fn.outerHTML = function () {
		return $('<div>').append($(this).clone()).html();
	}
	$.fn.toString = $.fn.outerHTML;
	$.fn.wrapText = function (el) {
		$(this).html("<" + el + ">" + $(this).html() + "</" + el + ">");
		return this;
	}
	$.fn.tag = function (i) {
		if (arguments.length === 0) {
			return $(this)[0].tagName;
		}
		var $this = $(this);
		var newnode = $('<' + i + '></' + i '>').html($this.html());
		var attributes = $.map(this.attributes, function (item) {
			return item.name
		})

		$.each(attributes, function (i, item) {
			newnode.attr(i, item)
		})

		$this.after(newnode);
		$this.remove();
		return newnode;
	};

	var selectionDisabled = {
		"-webkit-touch-callout": "none",
		"-webkit-user-select": "none",
		"-khtml-user-select": "none",
		"-moz-user-select": "none",
		"-ms-user-select": "none",
		"user-select": "none"
	};
	var selectionEnabled = {
		"-webkit-touch-callout": "",
		"-webkit-user-select": "",
		"-khtml-user-select": "",
		"-moz-user-select": "",
		"-ms-user-select": "",
		"user-select": ""
	};
	$.fn.disableSelection = function (recursive) {
		recursive = recursive || true;
		if (recursive) {
			$(this).css(selectionDisabled);
			if ($(this)[0].nodeType == 1) {
				$(this)[0].setAttribute("unselectable", "on")
			}
			var child = $(this)[0].firstChild
			while (child) {
				$(child).disableSelectionRecursive()
				child = child.nextSibling
			}
		} else {
			return this.each(function () {
				$(this).css(selectionDisabled)
					.attr('unselectable', 'on')
					.bind('selectstart', function () {
						return false;
					});
			});

		};
	};
	$.fn.enableSelection = function (recursive) {
		recursive = recursive || true;
		if (recursive) {
			$(this).css(selectionEnabled);
			if ($(this)[0].nodeType == 1) {
				$(this)[0].setAttribute("unselectable", "off")
			}
			var child = $(this)[0].firstChild
			while (child) {
				$(child).enableSelectionRecursive()
				child = child.nextSibling
			}
		} else {
			return this.each(function () {
				$(this).css(selectionEnabled).attr('unselectable', 'off').unbind('selectstart');
			});
		}
	};

	// $.fn.value = $.fn.val;
	$.fn.value = function (i) {
		if ($(this).attr("value") != "") {
			if (!i) {
				return $(this).attr("value");
			} else {
				$(this).attr("value", i);
			}
		} else {
			return $(this).value(i);
		}
	};

	$.title = function (input) {
		if (arguments.length == 0) {
			return $("title").html();
		}
		$("title").html(input);
		return this;
	}

	$.fn.visible = function (a) {
		if (arguments.length === 0) {
			return $(this).is(":visible");
		}
		if (a === true) {
			$(this).show();
		} else {
			$(this).hide();
		}
		return this;
	}

	$.fn.maxHeight = function () {
		var max = 0;
		this.each(function () {
			max = Math.max(max, $(this).height());
		});
		return max;
	}
	$.fn.maxWidth = function () {
		var max = 0;
		this.each(function () {
			max = Math.max(max, $(this).width());
		});
		return max;
	}
	$.fn.id = function (i) {
		if (i === undefined) {
			return $(this)[0].id;
		}
		if (arguments.length == 0) {
			return $(this).attr("id");
		}
		if (i === "") {
			$(this).removeAttr("id");
			return this;
		}
		$(this).attr("id", i);
	}

	$.fn.removeAttrs = function () {
		return this.each(function () {
			var attributes = $.map(this.attributes, function (item) {
				return item.name;
			});
			var el = $(this);
			$.each(attributes, function (i, item) {
				el.removeAttr(item);
			});
		});
	}

	$.file = function (address) {
		return $.ajax({
			url: address,
			async: false
		}).responseText
	}
	$.file_get_contents = $.file;

	$.stop = function (e) {
		if (!e.preventDefault) {
			e.returnValue = false;
		} else {
			e.preventDefault();
		}
	};

	$.param = function (obj, prefix) {
		var str = [];
		for (var p in obj) {
			var k = prefix ? prefix + "[" + p + "]" : p,
				v = obj[p];
			str.push(typeof v == "object" ? $.param(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
		}
		return str.join("&");
	};

	//window.onunload
	$.confirm = function (mode) {
		if (arguments.length === 0) {
			mode = true;
		}
		if (mode === true) {
			window.onbeforeunload = function () {
				return "Please Confirm.";
			};
		} else {
			window.onbeforeunload = function () {};
		}
		return this;
	}

	$.fn.shuffle = function () {
		return this.each(function () {
			var items = $(this).children();
			return (items.length) ? $(this).html($.shuffle(items)) : this;
		})
	}
	$.fn.shuffleRows = function () {
		return this.each(function () {
			var main = $(/table/i.test(this.tagName) ? this.tBodies[0] : this);
			var firstElem = [],
				counter = 0;
			main.children().each(function () {
				firstElem.push(this.firstChild)
			});
			main.shuffle();
			main.children().each(function () {
				this.insertBefore(firstElem[counter++], this.firstChild)
			});
		})
	}

	$.fn.extend({
		toggle: function (fn) {
			var args = arguments,
				guid = fn.guid || $.guid++,
				i = 0,
				toggler = function (event) {
					var lastToggle = ($._data(this, "lastToggle" + fn.guid) || 0) % i;
					$._data(this, "lastToggle" + fn.guid, lastToggle + 1);
					event.preventDefault();
					return args[lastToggle].apply(this, arguments) || false;
				};
			toggler.guid = guid;
			while (i < args.length) {
				args[i++].guid = guid;
			}
			return this.click(toggler);
		},

		dbltoggle: function (fn) {
			var args = arguments,
				guid = fn.guid || $.guid++,
				i = 0,
				dblToggler = function (event) {
					var lastDblToggle = ($._data(this, "lastDblToggle" + fn.guid) || 0) % i;
					$._data(this, "lastDblToggle" + fn.guid, lastDblToggle + 1);
					event.preventDefault();
					return args[lastDblToggle].apply(this, arguments) || false;
				};
			dblToggler.guid = guid;
			while (i < args.length) {
				args[i++].guid = guid;
			}
			return this.dblclick(dblToggler);
		},
		hover: function (fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

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
		text: "text",
		title: "title",
		type: "type",
		valign: "valign" //,
		// value: "value"
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

	})

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
		$.fn[name] = function (value) {
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

})
(jQuery)
