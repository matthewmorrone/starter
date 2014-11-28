/**
 *       jquery.numberformatter - Formatting/Parsing Numbers in jQuery
 *       Completely changed by Peter Higgins (dante@dojotoolkit.org)
 *       Originally written by Michael Abernethy (mike@abernethysoft.com)
 *
 *       This plugin can be used to format numbers as text and parse text as Numbers
 *       Because we live in an international world, we cannot assume that everyone
 *       uses "," to divide thousands, and "." as a decimal point.
 *
 *       The format() function will take the text within any selector by calling
 *       text() or val() on them, getting the String, and applying the specified format to it.
 *       It will return the jQuery object
 *
 *       The parse() function will take the text within any selector by calling text()
 *       or val() on them, turning the String into a Number, and returning these
 *       values in a Number array.
 *       It WILL BREAK the jQuery chain, and return an Array of Numbers.
 *
 *       Because there is limited use in a plugin that is unable to simply parse strings and numbers
 *       The parsing and formatting section has been broken out into $.formatNumber and $.parseNumber
 *
 *       The syntax for the formatting is:
 *       0 = Digit
 *       # = Digit, zero shows as absent
 *       . = Decimal separator
 *       - = Negative sign
 *       , = Grouping Separator
 *       % = Percent (multiplies the number by 100)
 *       For example, a format of "#,###.00" and text of 4500.20 will
 *       display as "4.500,20" with a locale of "de", and "4,500.20" with a locale of "us"
 *
 *
 *       As of now, the only acceptable locales are
 *       United States -> "us"
 *       Arab Emirates -> "ae"
 *       Egypt -> "eg"
 *       Israel -> "il"
 *       Japan -> "jp"
 *       South Korea -> "kr"
 *       Thailand -> "th"
 *       China -> "cn"
 *       Hong Kong -> "hk"
 *       Taiwan -> "tw"
 *       Australia -> "au"
 *       Canada -> "ca"
 *       Great Britain -> "gb"
 *       India -> "in"
 *       Germany -> "de"
 *       Vietnam -> "vn"
 *       Spain -> "es"
 *       Denmark -> "dk"
 *       Austria -> "at"
 *       Greece -> "gr"
 *       Brazil -> "br"
 *       Czech -> "cz"
 *       France  -> "fr"
 *       Finland -> "fi"
 *       Russia -> "ru"
 *       Sweden -> "se"
 *       Switzerland -> "ch"
 *
 *       TODO
 *       Separate positive and negative patterns separated by a ":" (e.g. use (#,###) for accounting)
 *       More options may come in the future (currency)
 **/
// (function(){

var defaults = {
	parse: {
		locale: "us",
		decimalSeparatorAlwaysShown: false
	},
	format: {
		format: "#,###.00",
		locale: "us",
		decimalSeparatorAlwaysShown: false
	}
}

var formatCodes = function (locale) {

	var dec = ".",
		group = ",",
		neg = "-";
	switch (locale.toLowerCase()) {
	case "de":
	case "vn":
	case "es":
	case "dk":
	case "at":
	case "gr":
	case "br":
		dec = ",";
		group = ".";
		break;
	case "cz":
	case "fr":
	case "fi":
	case "ru":
	case "se":
		group = " ";
		dec = ",";
		break;
	case "ch":
		group = "'";
		break;
	}

	return {
		group: group,
		dec: dec,
		neg: neg
	}

};

var formatNumber = function (text, options, dontmix) {
	// summary: Format some plain number to a localized printable version

	var opts = dontmix ? (options || defaults.format) : $.extend({}, defaults.format, options),
		d = dontmix || formatCodes(opts.locale),
		dec = d.dec,
		group = d.group,
		neg = d.neg,
		validFormat = "0#-,.",
		returnString = "";

	// strip all the invalid characters at the beginning and the end
	// of the format, and we'll stick them back on at the end
	// make a special case for the negative sign "-" though, so
	// we can have formats like -$23.32
	var prefix = "",
		negativeInFront = false;
	for (var i = 0, l = opts.format.length; i < l; i++) {
		if (validFormat.indexOf(opts.format.charAt(i)) == -1) {
			prefix = prefix + opts.format.charAt(i);
		} else if (i == 0 && opts.format.charAt(i) == '-') {
			negativeInFront = true;
			continue;
		} else {
			break;
		}
	}

	var suffix = "";
	for (var i = opts.format.length - 1; i >= 0; i--) {
		if (validFormat.indexOf(opts.format.charAt(i)) == -1) {
			suffix = opts.format.charAt(i) + suffix;
		} else {
			break;
		}

	}

	opts.format = opts.format.substring(prefix.length);
	opts.format = opts.format.substring(0, opts.format.length - suffix.length);

	// now we need to convert it into a number
	while (text.indexOf(group) > -1) {
		text = text.replace(group, '');
	}

	var number = new Number(text.replace(dec, ".").replace(neg, "-"));

	// special case for percentages
	if (suffix == "%") {
		number *= 100;
	}

	var decimalValue = number % 1;

	if (opts.format.indexOf(".") > -1) {
		var decimalPortion = dec;
		var decimalFormat = opts.format.substring(opts.format.lastIndexOf(".") + 1);
		var decimalString = new String(decimalValue.toFixed(decimalFormat.length));
		decimalString = decimalString.substring(decimalString.lastIndexOf(".") + 1);
		for (var i = 0, l = decimalFormat.length; i < l; i++) {
			if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) != '0') {
				decimalPortion += decimalString.charAt(i);
				continue;
			} else if (decimalFormat.charAt(i) == '#' && decimalString.charAt(i) == '0') {
				var notParsed = decimalString.substring(i);
				if (notParsed.match('[1-9]')) {
					decimalPortion += decimalString.charAt(i);
					continue;
				} else {
					break;
				}
			} else if (decimalFormat.charAt(i) == "0") {
				decimalPortion += decimalString.charAt(i);
			}
		}

		returnString += decimalPortion;

	} else {
		number = Math.round(number);
	}

	var ones = Math.floor(number);
	if (number < 0) {
		ones = Math.ceil(number);
	}

	var onePortion = "";
	if (ones == 0) {
		onePortion = "0";
	} else {
		// find how many digits are in the group
		var onesFormat = "";
		if (opts.format.indexOf(".") == -1) {
			onesFormat = opts.format;
		} else {
			onesFormat = opts.format.substring(0, opts.format.indexOf("."));
		}

		var oneText = new String(Math.abs(ones));
		var groupLength = 9999;
		if (onesFormat.lastIndexOf(",") != -1) {
			groupLength = onesFormat.length - onesFormat.lastIndexOf(",") - 1;
		}

		var groupCount = 0;
		for (var i = oneText.length - 1; i > -1; i--) {
			onePortion = oneText.charAt(i) + onePortion;
			groupCount++;
			if (groupCount == groupLength && i != 0) {
				onePortion = group + onePortion;
				groupCount = 0;
			}

		}
	}

	returnString = onePortion + returnString;

	// handle special case where negative is in front of the invalid
	// characters
	if (number < 0 && negativeInFront && prefix.length > 0) {
		prefix = neg + prefix;
	} else if (number < 0) {
		returnString = neg + returnString;
	}

	if (!opts.decimalSeparatorAlwaysShown && returnString.lastIndexOf(dec) == returnString.length - 1) {
		returnString = returnString.substring(0, returnString.length - 1);
	}

	returnString = prefix + returnString + suffix;
	return returnString;

};

var parseNumber = function (text, options, dontmix) {

	var opts = /*dontmix ? (*/ options || defaults.parse /*) : $.extend({}, defaults.parse, options)*/ ,
		formatData = dontmix || formatCodes(opts.locale),
		dec = formatData.dec,
		group = formatData.group,
		neg = formatData.neg,
		valid = "1234567890.-";

	// now we need to convert it into a number
	while (text.indexOf(group) > -1) {
		text = text.replace(group, '');
	}

	text = text.replace(dec, ".").replace(neg, "-");

	var validText = "",
		hasPercent = false;

	if (text.charAt(text.length - 1) == "%") {
		hasPercent = true
	}
	for (var i = 0, l = text.length; i < l; i++) {
		if (valid.indexOf(text.charAt(i)) > -1) {
			validText += text.charAt(i);
		}
	}

	var number = new Number(validText);
	if (hasPercent) {
		number = number / 100;
		number = number.toFixed(validText.length - 1);
	}

	return number;

}

Number.prototype.parse = parseNumber;
Number.prototype.format = formatNumber;

// // expose this in public:
// $.parseNumber = parseNumber;
// $.fn.parse = function(opts){
// 	var o = $.extend({}, defaults.parse, opts), codez = formatCodes(o.locale);
// 	return $.map(this, function(item){
// 		var me = $(item), val = me[me.is(":input") ? "val" : "text"]();
// 		return parseNumber(val, o, codez);
// 	});
// }
// $.fn.parse.defaults = defaults.parse;

// $.formatNumber = formatNumber;
// $.fn.format = function(opts){
// 	var o = $.extend({}, defaults.format, opts), codez = formatCodes(o.locale);
// 	return this.each(function(){
// 		var me = $(this);
// 		me[me.is(":input") ? "val" : "text" ](function(_, v){
// 			return formatNumber(v, o, codez);
// 		});
// 	});
// }
// $.fn.format.defaults = defaults.format;

// })(jQuery);

Number.modulo = function (divisor, both) {
	var dividend = this;
	while (dividend >= divisor) {
		dividend -= divisor;
	}
	return (both ? [divident, divisor] || dividend;
	}
	Number.precision = function (nDecimalDigits) {
		var val = this;
		var pow = Math.pow(10, nDecimalDigits);
		return +(Math.round(val * pow) / pow).toFixed(nDecimalDigits);
	}
	Number.prototype.abbreviate = function (nDecimals, dict) {
		var val = this;
		var _defaultDict = {
			thousand: 'K',
			million: 'M',
			billion: 'B'
		};
		nDecimals = nDecimals != null ? nDecimals : 1;
		dict = dict || _defaultDict;
		val = val.precision(nDecimals);
		var str, mod;
		if (val < 1000000) {
			mod = enforcePrecision(val / 1000, nDecimals);
			str = mod < 1000 ? mod + dict.thousand : 1 + dict.million;
		} else if (val < 1000000000) {
			mod = enforcePrecision(val / 1000000, nDecimals);
			str = mod < 1000 ? mod + dict.million : 1 + dict.billion;
		} else {
			str = enforcePrecision(val / 1000000000, nDecimals) + dict.billion;
		}
		return str;
	}
	Number.prototype.constrain = function (min, max) {
		return Math.min(Math.max(this, min), max);
	};
	Number.prototype.currency = function (nDecimalDigits, decimalSeparator, thousandsSeparator) {
		var val = this;
		val = toNumber(val);
		nDecimalDigits = nDecimalDigits == null ? 2 : nDecimalDigits;
		decimalSeparator = decimalSeparator == null ? '.' : decimalSeparator;
		thousandsSeparator = thousandsSeparator == null ? ',' : thousandsSeparator;
		var fixed = val.toFixed(nDecimalDigits),
			parts = new RegExp('^(-?\\d{1,3})((?:\\d{3})+)(\\.(\\d{' + nDecimalDigits + '}))?$').exec(fixed);
		if (parts) {
			return parts[1] + parts[2].replace(/\d{3}/g, thousandsSeparator + '$&') + (parts[4] ? decimalSeparator + parts[4] : '');
		} else {
			return fixed.replace('.', decimalSeparator);
		}
	}
	Number.prototype.equals = function (val) {
		return this === val;
	};
	Number.prototype.factorial = function () {
		return this.range(1).reduce(function (a, b) {
			return a * b;
		});
	};
	Number.prototype.format = function (decimals, dec_point, thousands_sep) {
		var number = this;
		number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec);
				return '' + (Math.round(n * k) / k).toFixed(prec);
			};
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
		return s.join(dec);
	}
	Number.prototype.format = function (prefix) {
		var num = this;
		prefix = prefix || '';
		num += '';
		var splitStr = num.split('.');
		var splitLeft = splitStr[0];
		var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
		var regx = /(\d+)(\d{3})/;
		while (regx.test(splitLeft)) {
			splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
		}
		return prefix + splitLeft + splitRight;
	}
	Number.prototype.formatDecimal = function (places, nixCommas) {
		var num = this.toString(),
			splitStr = num.split('.'),
			splitLeft = splitStr[0],
			splitRight = '',
			regx;
		if (!nixCommas) {
			regx = /(\d+)(\d{3})/;
			while (regx.test(splitLeft)) {
				splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
			}
		}
		if (places === 0) {
			splitRight = '';
		} else if (places > 0 && places !== true) {
			if (splitStr.length > 1) {
				splitStr[1] = splitStr[1].substr(0, places).padr(places, '0');
			} else {
				splitStr[1] = ''.padr(places, '0');
			}
			splitRight = '.' + splitStr[1];
		} else {
			splitRight = (splitStr.length > 1) ? '.' + splitStr[1] : '';
		}
		return splitLeft + splitRight;
	};
	Number.prototype.getSuffix = function () {
		if (isNaN(this)) {
			return '';
		}
		if (String(this).search(/^-?\d+$/) === -1) {
			return '';
		}
		var suf = 'th';
		if (this !== 11 && this !== 12 && this !== 13) {
			switch (this % 10) {
			case 1:
				suf = 'st';
				break;
			case 2:
				suf = 'nd';
				break;
			case 3:
				suf = 'rd';
				break;
			}
		}
		return suf;
	};
	Number.prototype.hours = function () {
		return this.minutes() * 60;
	}
	Number.prototype.inet_ntop = function () {
		var a = this;
		var i = 0,
			m = '',
			c = [];
		a += '';
		if (a.length === 4) {
			return [a.charCodeAt(0), a.charCodeAt(1), a.charCodeAt(2), a.charCodeAt(3)].join('.');
		} else if (a.length === 16) {
			for (i = 0; i < 16; i++) {
				c.push(((a.charCodeAt(i++) << 8) + a.charCodeAt(i)).toString(16));
			}
			return c.join(':').replace(/((^|:)0(?=:|$))+:?/g, function (t) {
				m = (t.length > m.length) ? t : m;
				return t;
			}).replace(m || ' ', '::');
		} else {
			return false;
		}
	}
	Number.prototype.inet_pton = function () {
		var a = this;
		var r, m, x, i, j, f = String.fromCharCode;
		m = a.match(/^(?:\d{1,3}(?:\.|$)){4}/);
		if (m) {
			m = m[0].split('.');
			m = f(m[0]) + f(m[1]) + f(m[2]) + f(m[3]);
			return m.length === 4 ? m : false;
		}
		r = /^((?:[\da-f]{1,4}(?::|)){0,8})(::)?((?:[\da-f]{1,4}(?::|)){0,8})$/;
		m = a.match(r);
		if (m) {
			for (j = 1; j < 4; j++) {
				if (j === 2 || m[j].length === 0) {
					continue;
				}
				m[j] = m[j].split(':');
				for (i = 0; i < m[j].length; i++) {
					m[j][i] = parseInt(m[j][i], 16);
					if (isNaN(m[j][i])) {
						return false;
					}
					m[j][i] = f(m[j][i] >> 8) + f(m[j][i] & 0xFF);
				}
				m[j] = m[j].join('');
			}
			x = m[1].length + m[3].length;
			if (x === 16) {
				return m[1] + m[3];
			} else if (x < 16 && m[2].length > 0) {
				return m[1] + (new Array(16 - x + 1)).join('\x00') + m[3];
			}
		}
		return false;
	}
	Number.prototype.ip2long = function () {
		var IP = this;
		var i = 0;
		IP = IP.match(/^([1-9]\d*|0[0-7]*|0x[\da-f]+)(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?(?:\.([1-9]\d*|0[0-7]*|0x[\da-f]+))?$/i);
		if (!IP) {
			return false;
		}
		IP[0] = 0;
		for (i = 1; i < 5; i += 1) {
			IP[0] += !!((IP[i] || '').length);
			IP[i] = parseInt(IP[i]) || 0;
		}
		IP.push(256, 256, 256, 256);
		IP[4 + IP[0]] *= Math.pow(256, 4 - IP[0]);
		if (IP[1] >= IP[5] || IP[2] >= IP[6] || IP[3] >= IP[7] || IP[4] >= IP[8]) {
			return false;
		}
		return IP[1] * (IP[0] === 1 || 16777216) + IP[2] * (IP[0] <= 2 || 65536) + IP[3] * (IP[0] <= 3 || 256) + IP[4] * 1;
	}
	Number.prototype.isInt = function () {
		if (isNaN(this)) {
			return false;
		}
		if (String(this).search(/^-?\d+$/) === -1) {
			return false;
		} else {
			return true;
		}
	};
	Number.prototype.long2ip = function () {
		var ip = this;
		if (!isFinite(ip)) {
			return false;
		}
		return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
	}
	Number.prototype.map = function map(f) {
		f = f || noop;
		var results = [];
		for (var i = 0; i < n; i++) {
			results.push(f(i));
		}
		return results;
	}
	Number.prototype.minutes = function () {
		return this.seconds() * 60;
	}
	Number.prototype.nth = function () {
		var number = this;
		if (number % 100 >= 11 && number % 100 <= 13) return number + "th";
		switch (number % 10) {
		case 1:
			return number + "st";
		case 2:
			return number + "nd";
		case 3:
			return number + "rd";
		}
		return number + "th";
	}
	Number.prototype.ordinal = function (n) {
		var n = this;
		var lastDigit = n % 10;
		return n + (n >= 11 && n <= 13 ? 'th' : lastDigit === 1 ? 'st' : lastDigit === 2 ? 'nd' : lastDigit === 3 ? 'rd' : 'th');
	}
	Number.prototype.pad = function (n, PadChar) {
		var strNew = this.toString();
		if (!PadChar) {
			PadChar = "0";
		}
		while (strNew.length < n) {
			strNew = PadChar + strNew;
		}
		return strNew;
	};
	Number.prototype.pad = function (zeroes) {
		if (typeof zeroes !== "number") {
			throw new TypeError;
		}
		if (zeroes < 0) {
			throw new RangeError;
		}
		var out = this + ""
		while (Math.floor(zeroes--)) {
			out = "0" + out;
		}
		return out;
	}
	Number.prototype.precision = function (base) {
		val = Math.round(Math.abs(this));
		return isNaN(val) ? base : val;
	}
	Number.prototype.prefix = function (len) {
		return ("0000000000000000" + this).substr(-len)
	}
	Number.prototype.range = function (n, result) {
		result = result || [];
		n = typeof n === 'undefined' ? 0 : n;
		if (this <= 0) {
			return result.reverse();
		} else {
			return this.range.call(this - 1, n, result.concat([this - 1 + n]));
		}
	};
	Number.prototype.round = function (i) {
		return this.toFixed(i);
	};
	Number.prototype.seconds = function () {
		return this * 1000;
	}
	Number.prototype.setInRange = function (from, to) {
		if (this < from) {
			return from;
		}
		if (this > to) {
			return to;
		}
		return this;
	}
	Number.prototype.sign = function () {
		return this ? this < 0 ? -1 : 1 : 0;
	};
	Number.prototype.times = function (fn) {
		for (var i = 0; i < this; i++) {
			fn(i);
		};
	}
	Number.prototype.times = function (fn, self) {
		return this.range().forEach(fn, self);
	};
	Number.prototype.toBase = function (b, c) {
		var s = "",
			n = this;
		if (b > (c = (c || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").split("")).length || b < 2) {
			return "";
		}
		while (n) {
			s = c[n % b] + s, n = Math.floor(n / b);
		}
		return s;
	};
	Number.prototype.toHex = function () {
		return '0x' + Number(this).toString(16)
	}
	Number.prototype.unformat = function () {
		var num = this;
		return num.replace(/([^0-9\.\-])/g, '') * 1;
	}
	Number.prototype.uuid = function () {
		var dec2hex = [];
		for (var i = 0; i <= 15; i++) {
			dec2hex[i] = i.toString(16);
		}
		var uuid = '';
		for (var i = 1; i <= 36; i++) {
			if (i === 9 || i === 14 || i === 19 || i === 24) {
				uuid += '-';
			} else if (i === 15) {
				uuid += 4;
			} else if (i === 20) {
				uuid += dec2hex[(Math.random() * 4 | 0 + 8)];
			} else {
				uuid += dec2hex[(Math.random() * 15 | 0)];
			}
		}
		return uuid;
	};

	Number.prototype.base = function (src, caps, srcAlphabet, dstAlphabet) {
		alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
		if (caps == true) {
			alphabet = alphabet.toUpperCase()
		}
		if (typeof src === "number") {
			src = String(src)
		}
		if (typeof srcAlphabet !== typeof dstAlphabet) {
			TypeError("Alphabet types don't match. ")
		}
		if (typeof srcAlphabet === "number") {
			var srcBase = srcAlphabet
			var dstBase = dstAlphabet
			srcAlphabet = alphabet.substring(0, srcBase)
			dstAlphabet = alphabet.substring(0, dstBase)
		}
		if (typeof srcAlphabet === "string") {
			var srcBase = srcAlphabet.length
			var dstBase = dstAlphabet.length
		}
		var wet = src,
			val = 0,
			mlt = 1
		while (wet.length > 0) {
			var digit = wet.charAt(wet.length - 1)
			val += mlt * srcAlphabet.indexOf(digit)
			wet = wet.substring(0, wet.length - 1)
			mlt *= srcBase
		}
		wet = val
		var ret = ""
		while (wet >= dstBase) {
			var digitVal = wet % dstBase
			var digit = dstAlphabet.charAt(digitVal)
			ret = digit + ret
			wet /= dstBase
		}
		var digit = dstAlphabet.charAt(wet)
		return digit + ret
	}

	(function (define, names) {
			if (!define || !names.forEach) {
				return;
			}
			names.forEach(function (name) {
				define(Number.prototype, name, {
					value: function () {
						return Math[name].apply(
							Math, [this].concat([].slice.call(arguments))
						);
					},
					writable: true,
					enumerable: false,
				});
			});

			(Object.defineProperty, [
		'abs',
		'acos',
		'asin',
		'atan',
		'atan2',
		'ceil',
		'cos',
		'exp',
		'floor',
		'log',
		'max',
		'min',
		'pow',
		'round',
		'sin',
		'sqrt',
		'tan'
	]);
		);

		(function () {
			var addGetter, addMethod, defineProperty, fn, getters,
				methods, name, numberProto, _i, _j, _len, _len1,
				__slice = [].slice;

			numberProto = Number.prototype;

			defineProperty = Object.defineProperty;

			if (defineProperty == null) {
				defineProperty = function (object, name, descriptor) {
					return object.__defineGetter__(name, descriptor.get);
				};
			}

			addGetter = function (name, fn) {
				var get;
				get = name === 'random' ? function () {
					return this * fn();
				} : function () {
					return fn(this);
				};
				return defineProperty(numberProto, name, {
					get: get
				});
			};

			addMethod = function (name, fn) {
				return Number.prototype[name] = function () {
					var args;
					args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
					return fn.apply(Math, [this].concat(args));
				};
			};

			getters = ['abs', 'acos', 'asin', 'atan', 'ceil',
				'cos', 'exp', 'floor', 'log', 'random',
				'round', 'sin', 'sqrt', 'tan'];

			methods = ['atan2', 'max', 'min', 'pow'];

			defineProperty(numberProto, 'squared', {
				get: function () {
					return this.pow(2);
				}
			});

			defineProperty(numberProto, 'cubed', {
				get: function () {
					return this.pow(3);
				}
			});

			defineProperty(numberProto, 'factorial', {
				get: function () {
					var n, product;
					n = +this;
					if (n < 0) {
						throw new RangeError("" + n + " is not positive");
					}
					if (n !== (n | 0)) {
						throw new TypeError("" + n + " is not an integer");
					}
					product = 1;
					while (n) {
						product *= n--;
					}
					return product;
				}
			});

			for (_i = 0, _len = getters.length; _i < _len; _i++) {
				name = getters[_i];
				if (typeof (fn = Math[name]) === 'function') {
					addGetter(name, fn);
				}
			}

			for (_j = 0, _len1 = methods.length; _j < _len1; _j++) {
				name = methods[_j];
				if (typeof (fn = Math[name]) === 'function') {
					addMethod(name, fn);
				}
			}

		}).call(this);
