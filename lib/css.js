(function ($, oldcss) {
	var rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/;
	$.fn.css = function (obj, val) {
		var parts = rfxnum.exec(val),
			that = this;
		if ($.isPlainObject(obj)) {
			$.each(obj, function (k, v) {
				$(that).css(k, v);
			});
		} else if (val && parts && parts[1]) {
			var end = parseFloat(parts[2])
			return oldcss.call(this, obj, function (index, currentValue) {
				return ((parts[1] === "-=" ? -1 : 1) * end) + parseFloat(currentValue);
			});
		} else {
			return oldcss.apply(this, arguments);
		}
		return this;
	};
})(jQuery, jQuery.fn.css);
(function ($) {
	var css = $.fn.css,
		methods = {
			'padding': 1,
			'margin': 1
		},
		dirs = 'Top Right Bottom Left'.split(' ');
	$.fn.css = function (prop, val) {
		var jq = this;
		if (val || !(prop in methods)) return css.apply(jq, arguments);
		return $.map(dirs, function (k) {
			return css.call(jq, prop + k)
		}).join(' ');
	}
})(jQuery);
(function ($) {
	var _css = $.fn.css;
	$.fn.css = function (name, val) {
		if (!val && /background[-p|P]osition/.test(name)) {
			var value = _css.apply(this, arguments);
			return value !== undefined ? value :
				[_css.call(this, "backgroundPositionX"), "px ",
				_css.call(this, "backgroundPositionY"), "px"].join("");
		} else {
			return _css.apply(this, arguments);
		}
	}
})(jQuery);;
(function (root) {

	if (!root.CSS) {
		root.CSS = {};
	}

	var CSS = root.CSS;

	var InvalidCharacterError = function (message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	if (!CSS.escape) {
		CSS.escape = function (value) {
			var string = String(value);
			var length = string.length;
			var index = -1;
			var codeUnit;
			var result = '';
			var firstCodeUnit = string.charCodeAt(0);
			while (++index < length) {
				codeUnit = string.charCodeAt(index);
				if (codeUnit == 0x0000) {
					throw new InvalidCharacterError(
						'Invalid character: the input contains U+0000.'
					);
				}

				if (
					(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
					(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
					(
						index == 1 &&
						codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
						firstCodeUnit == 0x002D
					)
				) {
					result += '\\' + codeUnit.toString(16) + ' ';
					continue;
				}
				if (
					codeUnit >= 0x0080 ||
					codeUnit == 0x002D ||
					codeUnit == 0x005F ||
					codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
					codeUnit >= 0x0041 && codeUnit <= 0x005A ||
					codeUnit >= 0x0061 && codeUnit <= 0x007A
				) {
					result += string.charAt(index);
					continue;
				}
				result += '\\' + string.charAt(index);

			}
			return result;
		};
	}

}(typeof global != 'undefined' ? global : this));

var cssQuery = function () {
	var version = "2.0.3";
	cssQuery.uniqueIds = true;
	cssQuery.caching = false;

	var $COMMA = /\s*,\s*/;

	function cssQuery($selector, $$from) {
		try {
			var $match = [];
			var $useCache = cssQuery.caching && !$$from;
			var $base = $$from ? ($$from.constructor == Array) ? $$from : [$$from] : [document];
			var $$selectors = parseSelector($selector).split($COMMA),
				i;
			for (i = 0; i < $$selectors.length; i++) {
				$selector = _toStream($$selectors[i]);
				$$from = $base;
				if ($selector.slice(0, 3).join("") == " *#") {
					var id = $selector[3];
					if (cssQuery.uniqueIds && $base.length == 1 && $base[0].getElementById) {
						$$from = [$base[0].getElementById(id)];
						$selector = $selector.slice(4);
					} else if (isMSIE) {
						$$from = _msie_selectById([], $base, id);
						$selector = $selector.slice(4);
					}
				}
				var j = 0,
					$token, $filter, $arguments, $cacheSelector = "";
				while (j < $selector.length) {
					$token = $selector[j++];
					$filter = $selector[j++];
					$cacheSelector += $token + $filter;
					$arguments = "";
					if ($selector[j] == "(") {
						while ($selector[j++] != ")" && j < $selector.length) {
							$arguments += $selector[j];
						}
						$arguments = $arguments.slice(0, -1);
						$cacheSelector += "(" + $arguments + ")";
					}
					$$from = ($useCache && cache[$cacheSelector]) ?
						cache[$cacheSelector] : select($$from, $token, $filter, $arguments);
					if ($useCache) cache[$cacheSelector] = $$from;
				}
				$match = $match.concat($$from);
			}
			delete cssQuery.error;
			return $match;
		} catch ($error) {
			cssQuery.error = $error;
			return [];
		}
	};

	cssQuery.toString = function () {
		return "function cssQuery() {\n  [version " + version + "]\n}";
	};
	var cache = {};
	cssQuery.clearCache = function ($selector) {
		if ($selector) {
			$selector = _toStream($selector).join("");
			delete cache[$selector];
		} else cache = {};
	};
	var modules = {};
	var loaded = false;
	cssQuery.addModule = function ($name, $script) {
		if (loaded) eval("$script=" + String($script));
		modules[$name] = new $script();;
	};
	cssQuery.valueOf = function ($code) {
		return $code ? eval($code) : this;
	};

	var selectors = {};
	var pseudoClasses = {};
	var AttributeSelector = {
		match: /\[([\w-]+(\|[\w-]+)?)\s*(\W?=)?\s*([^\]]*)\]/
	};
	var attributeSelectors = [];
	selectors[" "] = function ($results, $from, $tagName, $namespace) {
		var $element, i, j;
		for (i = 0; i < $from.length; i++) {
			var $subset = getElementsByTagName($from[i], $tagName, $namespace);
			for (j = 0;
				($element = $subset[j]); j++) {
				if (thisElement($element) && compareNamespace($element, $namespace))
					$results.push($element);
			}
		}
	};
	selectors["#"] = function ($results, $from, $id) {
		var $element, j;
		for (j = 0;
			($element = $from[j]); j++)
			if ($element.id == $id) $results.push($element);
	};
	selectors["."] = function ($results, $from, $className) {
		$className = new RegExp("(^|\\s)" + $className + "(\\s|$)");
		var $element, i;
		for (i = 0;
			($element = $from[i]); i++)
			if ($className.test($element.className)) $results.push($element);
	};
	selectors[":"] = function ($results, $from, $pseudoClass, $arguments) {
		var $test = pseudoClasses[$pseudoClass],
			$element, i;
		if ($test)
			for (i = 0;
				($element = $from[i]); i++)
				if ($test($element, $arguments)) $results.push($element);
	};

	pseudoClasses["link"] = function ($element) {
		var $links = getDocument($element).links;
		if ($links)
			for (var i = 0; i < $links.length; i++) {
				if ($links[i] == $element) return true;
			}
	};

	pseudoClasses["visited"] = function ($element) {};
	var thisElement = function ($element) {
		return ($element && $element.nodeType == 1 && $element.tagName != "!") ? $element : null;
	};
	var previousElementSibling = function ($element) {
		while ($element && ($element = $element.previousSibling) && !thisElement($element)) continue;
		return $element;
	};
	var nextElementSibling = function ($element) {
		while ($element && ($element = $element.nextSibling) && !thisElement($element)) continue;
		return $element;
	};
	var firstElementChild = function ($element) {
		return thisElement($element.firstChild) || nextElementSibling($element.firstChild);
	};

	var lastElementChild = function ($element) {
		return thisElement($element.lastChild) || previousElementSibling($element.lastChild);
	};
	var childElements = function ($element) {
		var $childElements = [];
		$element = firstElementChild($element);
		while ($element) {
			$childElements.push($element);
			$element = nextElementSibling($element);
		}
		return $childElements;
	};

	var isMSIE = true;

	var isXML = function ($element) {
		return !getDocument($element).write;
	};
	var getDocument = function ($node) {
		return $node.ownerDocument || $node.document || $node;
	};

	var getElementsByTagName = function ($node, $tagName, $namespace) {
		if (isXML($node) && $namespace) $tagName = $namespace + ":" + $tagName;
		return ($tagName == "*" && $node.all) ? $node.all : $node.getElementsByTagName($tagName);
	};

	var compareTagName = function ($element, $tagName, $namespace) {
		if ($tagName == "*") return thisElement($element);
		if (!compareNamespace($element, $namespace)) return false;
		if (!isXML($element)) $tagName = $tagName.toUpperCase();
		return $element.tagName == $tagName;
	};

	var compareNamespace = function ($element, $namespace) {
		if (isXML($element)) return true;
		return !$namespace || ($namespace == "*") || ($element.scopeName == $namespace);
	};

	var getTextContent = function ($element) {
		return $element.innerText;
	};

	function _msie_selectById($results, $from, id) {
		var $match, i, j;
		for (i = 0; i < $from.length; i++) {
			if ($match = $from[i].all.item(id)) {
				if ($match.id == id) $results.push($match);
				else if ($match.length != null) {
					for (j = 0; j < $match.length; j++) {
						if ($match[j].id == id) $results.push($match[j]);
					}
				}
			}
		}
		return $results;
	};
	if (![].push) Array.prototype.push = function () {
		for (var i = 0; i < arguments.length; i++) {
			this[this.length] = arguments[i];
		}
		return this.length;
	};
	var $NAMESPACE = /\|/;

	function select($$from, $token, $filter, $arguments) {
		if ($NAMESPACE.test($filter)) {
			$filter = $filter.split($NAMESPACE);
			$arguments = $filter[0];
			$filter = $filter[1];
		}
		var $results = [];
		if (selectors[$token]) {
			selectors[$token]($results, $$from, $filter, $arguments);
		}
		return $results;
	};
	var STANDARD_SELECT = /^[^\s>+~]/;
	var STREAM = /[\s#.:>+~()@]|[^\s#.:>+~()@]+/g;

	function _toStream($selector) {
		if (STANDARD_SELECT.test($selector)) $selector = " " + $selector;
		return $selector.match(STREAM) || [];
	};

	var WHITESPACE = /\s*([\s>+~(),]|^|$)\s*/g;
	var IMPLIED_ALL = /([\s>+~,]|[^(]\+|^)([#.:@])/g;
	var parseSelector = function ($selector) {
		return $selector
			.replace(WHITESPACE, "$1")
			.replace(IMPLIED_ALL, "$1*$2");
	};

	var Quote = {
		toString: function () {
			return "'"
		},
		match: /^('[^']*')|("[^"]*")$/,
		test: function ($string) {
			return this.match.test($string);
		},
		add: function ($string) {
			return this.test($string) ? $string : this + $string + this;
		},
		remove: function ($string) {
			return this.test($string) ? $string.slice(1, -1) : $string;
		}
	};

	var getText = function ($text) {
		return Quote.remove($text);
	};

	var $ESCAPE = /([\/()[\]?{}|*+-])/g;

	function regEscape($string) {
		return $string.replace($ESCAPE, "\\$1");
	};

	loaded = true;

	var $document = (typeof Document == "function") ? Document.prototype : document;

	$document.matchAll = function (selectors) {
		return cssQuery(selectors, [this]);
	};

	$document.match = function (selectors) {
		return this.matchAll(selectors)[0];
	};

	return cssQuery;

}();

cssQuery.addModule("css-standard", function () {
	isMSIE = eval("false;");

	if (!isMSIE) {
		getElementsByTagName = function ($node, $tagName, $namespace) {
			return $namespace ? $node.getElementsByTagNameNS("*", $tagName) :
				$node.getElementsByTagName($tagName);
		};

		compareNamespace = function ($element, $namespace) {
			return !$namespace || ($namespace == "*") || ($element.prefix == $namespace);
		};

		isXML = document.contentType ? function ($node) {
			return /xml/i.test(getDocument($node).contentType);
		} : function ($node) {
			return getDocument($node).documentElement.tagName != "HTML";
		};

		getTextContent = function ($element) {
			return $element.textContent || $element.innerText || _getTextContent($element);
		};

		function _getTextContent($element) {
			var $textContent = "",
				$node, i;
			for (i = 0;
				($node = $element.childNodes[i]); i++) {
				switch ($node.nodeType) {
				case 11:
				case 1:
					$textContent += _getTextContent($node);
					break;
				case 3:
					$textContent += $node.nodeValue;
					break;
				}
			}
			return $textContent;
		};
	}
});

cssQuery.addModule("css-level2", function () {
	selectors[">"] = function ($results, $from, $tagName, $namespace) {
		var $element, i, j;
		for (i = 0; i < $from.length; i++) {
			var $subset = childElements($from[i]);
			for (j = 0;
				($element = $subset[j]); j++)
				if (compareTagName($element, $tagName, $namespace))
					$results.push($element);
		}
	};
	selectors["+"] = function ($results, $from, $tagName, $namespace) {
		for (var i = 0; i < $from.length; i++) {
			var $element = nextElementSibling($from[i]);
			if ($element && compareTagName($element, $tagName, $namespace))
				$results.push($element);
		}
	};
	selectors["@"] = function ($results, $from, $attributeSelectorID) {
		var $test = attributeSelectors[$attributeSelectorID].test;
		var $element, i;
		for (i = 0;
			($element = $from[i]); i++)
			if ($test($element)) $results.push($element);
	};

	pseudoClasses["first-child"] = function ($element) {
		return !previousElementSibling($element);
	};

	pseudoClasses["lang"] = function ($element, $code) {
		$code = new RegExp("^" + $code, "i");
		while ($element && !$element.getAttribute("lang")) $element = $element.parentNode;
		return $element && $code.test($element.getAttribute("lang"));
	};
	AttributeSelector.NS_IE = /\\:/g;
	AttributeSelector.PREFIX = "@";
	AttributeSelector.tests = {};
	AttributeSelector.replace = function ($match, $attribute, $namespace, $compare, $value) {
		var $key = this.PREFIX + $match;
		if (!attributeSelectors[$key]) {
			$attribute = this.create($attribute, $compare || "", $value || "");
			attributeSelectors[$key] = $attribute;
			attributeSelectors.push($attribute);
		}
		return attributeSelectors[$key].id;
	};
	AttributeSelector.parse = function ($selector) {
		$selector = $selector.replace(this.NS_IE, "|");
		var $match;
		while ($match = $selector.match(this.match)) {
			var $replace = this.replace($match[0], $match[1], $match[2], $match[3], $match[4]);
			$selector = $selector.replace(this.match, $replace);
		}
		return $selector;
	};
	AttributeSelector.create = function ($propertyName, $test, $value) {
		var $attributeSelector = {};
		$attributeSelector.id = this.PREFIX + attributeSelectors.length;
		$attributeSelector.name = $propertyName;
		$test = this.tests[$test];
		$test = $test ? $test(this.getAttribute($propertyName), getText($value)) : false;
		$attributeSelector.test = new Function("e", "return " + $test);
		return $attributeSelector;
	};
	AttributeSelector.getAttribute = function ($name) {
		switch ($name.toLowerCase()) {
		case "id":
			return "e.id";
		case "class":
			return "e.className";
		case "for":
			return "e.htmlFor";
		case "href":
			return "e.getAttribute('href',2)";
		}
		return "e.getAttribute('" + $name.replace($NAMESPACE, ":") + "')";
	};

	AttributeSelector.tests[""] = function ($attribute) {
		return $attribute;
	};

	AttributeSelector.tests["="] = function ($attribute, $value) {
		return $attribute + "==" + Quote.add($value);
	};

	AttributeSelector.tests["~="] = function ($attribute, $value) {
		return "/(^| )" + regEscape($value) + "( |$)/.test(" + $attribute + ")";
	};

	AttributeSelector.tests["|="] = function ($attribute, $value) {
		return "/^" + regEscape($value) + "(-|$)/.test(" + $attribute + ")";
	};
	var _parseSelector = parseSelector;
	parseSelector = function ($selector) {
		return _parseSelector(AttributeSelector.parse($selector));
	};

});

cssQuery.addModule("css-level3", function () {

	selectors["~"] = function ($results, $from, $tagName, $namespace) {
		var $element, i;
		for (i = 0;
			($element = $from[i]); i++) {
			while ($element = nextElementSibling($element)) {
				if (compareTagName($element, $tagName, $namespace))
					$results.push($element);
			}
		}
	};

	pseudoClasses["contains"] = function ($element, $text) {
		$text = new RegExp(regEscape(getText($text)));
		return $text.test(getTextContent($element));
	};

	pseudoClasses["root"] = function ($element) {
		return $element == getDocument($element).documentElement;
	};

	pseudoClasses["empty"] = function ($element) {
		var $node, i;
		for (i = 0;
			($node = $element.childNodes[i]); i++) {
			if (thisElement($node) || $node.nodeType == 3) return false;
		}
		return true;
	};

	pseudoClasses["last-child"] = function ($element) {
		return !nextElementSibling($element);
	};

	pseudoClasses["only-child"] = function ($element) {
		$element = $element.parentNode;
		return firstElementChild($element) == lastElementChild($element);
	};

	pseudoClasses["not"] = function ($element, $selector) {
		var $negated = cssQuery($selector, getDocument($element));
		for (var i = 0; i < $negated.length; i++) {
			if ($negated[i] == $element) return false;
		}
		return true;
	};

	pseudoClasses["nth-child"] = function ($element, $arguments) {
		return nthChild($element, $arguments, previousElementSibling);
	};

	pseudoClasses["nth-last-child"] = function ($element, $arguments) {
		return nthChild($element, $arguments, nextElementSibling);
	};

	pseudoClasses["target"] = function ($element) {
		return $element.id == location.hash.slice(1);
	};

	pseudoClasses["checked"] = function ($element) {
		return $element.checked;
	};

	pseudoClasses["enabled"] = function ($element) {
		return $element.disabled === false;
	};

	pseudoClasses["disabled"] = function ($element) {
		return $element.disabled;
	};

	pseudoClasses["indeterminate"] = function ($element) {
		return $element.indeterminate;
	};

	AttributeSelector.tests["^="] = function ($attribute, $value) {
		return "/^" + regEscape($value) + "/.test(" + $attribute + ")";
	};

	AttributeSelector.tests["$="] = function ($attribute, $value) {
		return "/" + regEscape($value) + "$/.test(" + $attribute + ")";
	};

	AttributeSelector.tests["*="] = function ($attribute, $value) {
		return "/" + regEscape($value) + "/.test(" + $attribute + ")";
	};

	function nthChild($element, $arguments, $traverse) {
		switch ($arguments) {
		case "n":
			return true;
		case "even":
			$arguments = "2n";
			break;
		case "odd":
			$arguments = "2n+1";
		}

		var $$children = childElements($element.parentNode);

		function _checkIndex($index) {
			var $index = ($traverse == nextElementSibling) ? $$children.length - $index : $index - 1;
			return $$children[$index] == $element;
		};
		if (!isNaN($arguments)) return _checkIndex($arguments);

		$arguments = $arguments.split("n");
		var $multiplier = parseInt($arguments[0]);
		var $step = parseInt($arguments[1]);

		if ((isNaN($multiplier) || $multiplier == 1) && $step == 0) return true;
		if ($multiplier == 0 && !isNaN($step)) return _checkIndex($step);
		if (isNaN($step)) $step = 0;

		var $count = 1;
		while ($element = $traverse($element)) $count++;

		if (isNaN($multiplier) || $multiplier == 1)
			return ($traverse == nextElementSibling) ? ($count <= $step) : ($step >= $count);

		return ($count % $multiplier) == $step;
	};

});
