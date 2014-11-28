String.prototype.jsescape = function () {
	var str = this;
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').replace(/[\f]/g, '\\f').replace(/[\b]/g, '\\b').replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r');
}

String.chr = function (codePt) {
	if (codePt > 0xFFFF) {
		codePt -= 0x10000;
		return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
	}
	return String.fromCharCode(codePt);
}
String.format = function (format) {
	var args = Array.prototype.slice.call(arguments, 1);
	return format.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};
String.prototype.addslashes = function () {
	var str = this;
	return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
String.prototype.after = function (delim) {
	var str = this;
	var delimIndex = str.indexOf(delim);
	return delimIndex >= 0 ? str.substring(delimIndex + delim.length) : str;
}
String.prototype.before = function (delim) {
	var str = this;
	return str.split(delim)[0];
}
String.prototype.between = function (left, right) {
	var s = this.s;
	var startPos = s.indexOf(left);
	var endPos = s.indexOf(right, startPos + left.length);
	if (endPos == -1 && right != null) return new this.constructor('')
	else if (endPos == -1 && right == null) return new this.constructor(s.substring(startPos + left.length))
	else return new this.constructor(s.slice(startPos + left.length, endPos));
},
String.prototype.between = function (left, right) {
	var str = this;
	return before(after(str, left), right);
}
String.prototype.bin2hex = function (s) {
	var i, l, o = '',
		n;
	s += '';
	for (i = 0, l = s.length; i < l; i++) {
		n = s.charCodeAt(i).toString(16);
		o += n.length < 2 ? '0' + n : n;
	}
	return o;
}
String.prototype.bookend = function (left, right) {
	var str = this;
	return (left || '') + str + (right || left || '');
}
String.prototype.camelCase = function () {
	var string = this;
	return string.replace(/-\D/g, function (match) {
		return match.charAt(1).toUpperCase();
	});
}
String.prototype.camelCase = function () {
	var str = toString(this);
	str = replaceAccents(str);
	str = removeNonWord(str).replace(/[\-_]/g, ' ').replace(/\s[a-z]/g, upperCase).replace(/\s+/g, '').replace(/^[A-Z]/g, lowerCase);
	return str;
},
String.prototype.camelCaseToHyphen = function (string) {
	return string.replace(/([A-Z])/g, function (string) {
		return '-' + string.toLowerCase();
	});
},
String.prototype.camelize = function () {
	return this.replace(/\W+(.)/g, function (match, letter) {
		return letter.toUpperCase();
	});
},
String.prototype.camelize = function () {
	var s = this.trim().s.replace(/(\-|_|\s)+(.)?/g, function (mathc, sep, c) {
		return (c ? c.toUpperCase() : '');
	});
	return new this.constructor(s);
},
String.prototype.capitalize = function () {
	return new this.constructor(this.s.substr(0, 1).toUpperCase() + this.s.substring(1).toLowerCase());
},
String.prototype.capitalize = function () {
	var input = this;
	if (typeof input !== "string" || !input) {
		return null;
	}
	return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
},
String.prototype.casecmp = function (f_string2) {
	var f_string1 = this;
	var string1 = (f_string1 + '').toLowerCase();
	var string2 = (f_string2 + '').toLowerCase();
	if (string1 > string2) {
		return 1;
	} else if (string1 == string2) {
		return 0;
	}
	return -1;
}
String.prototype.charAt = function (index) {
	return this.s.charAt(index);
},
String.prototype.checkMail = function () {
	return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this);
},
String.prototype.chomp = function () {
	return String(this).substring(0, this.length - parseInt(arguments[0]))
},
String.prototype.chomp = function (offset) {
	var input = this;
	if (typeof input !== "string" || !input) {
		return null;
	}
	return input.substring(0, input.length - offset)
},
String.prototype.chomp = function (sep) {
	var str = this;
	var ending, regexp, _ref2;
	if (sep == null) {
		sep = "\n";
	}
	sep = __str(sep);
	if (sep.length === 0) {
		regexp = /((\r\n)|\n)+$/;
	} else if (sep === "\n" || sep === "\r" || sep === "\r\n") {
		ending = ((_ref2 = str.match(/((\r\n)|\n|\r)$/)) != null ? _ref2[0] : void 0) || "\n";
		regexp = new RegExp("(" + (_rgx.escape(ending)) + ")$");
	} else {
		regexp = new RegExp("(" + (_rgx.escape(sep)) + ")$");
	}
	return str.replace(regexp, '');
};
String.prototype.chompLeft = function (prefix) {
	var s = this.s;
	if (s.indexOf(prefix) === 0) {
		s = s.slice(prefix.length);
		return new this.constructor(s);
	} else {
		return this;
	}
},
String.prototype.chompRight = function (suffix) {
	if (this.endsWith(suffix)) {
		var s = this.s;
		s = s.slice(0, s.length - suffix.length);
		return new this.constructor(s);
	} else {
		return this;
	}
},
String.prototype.chop = function () {
	return this.slice(0, -1);
}
String.prototype.chop = function () {
	var str = this;
	if (str.length === 0) {
		return str;
	}
	if (str.lastIndexOf("\r\n") === str.length - 2) {
		return str.slice(0, -2);
	} else {
		return str.slice(0, -1);
	}
};
String.prototype.chop = function (charlist) {
	var str = this;
	return this.rtrim(str, charlist);
}
String.prototype.chr = function (needle, bool) {
	var haystack = this;
	return this.strstr(needle, bool);
}
String.prototype.chunk_split = function (chunklen, end) {
	var body = this;
	chunklen = parseInt(chunklen, 10) || 76;
	end = end || '\r\n';
	if (chunklen < 1) {
		return false;
	}
	return body.match(new RegExp('.{0,' + chunklen + '}', 'g')).join(end);
}
String.prototype.cmp = function (str2) {
	var str1 = this;
	return ((str1 == str2) ? 0 : ((str1 > str2) ? 1 : -1));
}
String.prototype.collapseWhitespace = function () {
	var s = this.s.replace(/[\s\xa0]+/g, ' ').replace(/^\s+|\s+$/g, '');
	return new this.constructor(s);
},
String.prototype.contains = function (ss) {
	return this.s.indexOf(ss) >= 0;
},
String.prototype.contains = function (string) {
	return this.indexOf(string) > -1;
}
String.prototype.contains = function (substring, fromIndex) {
	var str = toString(this);
	substring = toString(substring);
	return str.indexOf(substring, fromIndex) !== -1;
},
String.prototype.convert_uudecode = function () {
	var str = this;
	var chr = function (c) {
		return String.fromCharCode(c);
	};
	if (!str || str === '') {
		return chr(0);
	} else if (!this.is_scalar(str)) {
		return false;
	} else if (str.length < 8) {
		return false;
	}
	var decoded = '',
		tmp1 = '',
		tmp2 = '';
	var c = 0,
		i = 0,
		j = 0,
		a = 0;
	var line = str.split('\n');
	var bytes = [];
	for (i in line) {
		c = line[i].charCodeAt(0);
		bytes = line[i].substr(1);
		for (j in bytes) {
			tmp1 = bytes[j].charCodeAt(0) - 32;
			tmp1 = tmp1.toString(2);
			while (tmp1.length < 6) {
				tmp1 = '0' + tmp1;
			}
			tmp2 += tmp1;
		}
		for (i = 0; i <= (tmp2.length / 8) - 1; i++) {
			tmp1 = tmp2.substr(a, 8);
			if (tmp1 == '01100000') {
				decoded += chr(0);
			} else {
				decoded += chr(parseInt(tmp1, 2));
			}
			a += 8;
		}
		a = 0;
		tmp2 = '';
	}
	return this.rtrim(decoded, '\0');
}
String.prototype.convert_uuencode = function () {
	var str = this;
	var chr = function (c) {
		return String.fromCharCode(c);
	};
	if (!str || str === '') {
		return chr(0);
	} else if (!this.is_scalar(str)) {
		return false;
	}
	var c = 0,
		u = 0,
		i = 0,
		a = 0;
	var encoded = '',
		tmp1 = '',
		tmp2 = '',
		bytes = {};
	var chunk = function () {
		bytes = str.substr(u, 45);
		for (i in bytes) {
			bytes[i] = bytes[i].charCodeAt(0);
		}
		if (bytes.length != 0) {
			return bytes.length;
		} else {
			return 0;
		}
	};
	while (chunk() !== 0) {
		c = chunk();
		u += 45;
		encoded += chr(c + 32);
		for (i in bytes) {
			tmp1 = bytes[i].charCodeAt(0).toString(2);
			while (tmp1.length < 8) {
				tmp1 = '0' + tmp1;
			}
			tmp2 += tmp1;
		}
		while (tmp2.length % 6) {
			tmp2 = tmp2 + '0';
		}
		for (i = 0; i <= (tmp2.length / 6) - 1; i++) {
			tmp1 = tmp2.substr(a, 6);
			if (tmp1 == '000000') {
				encoded += chr(96);
			} else {
				encoded += chr(parseInt(tmp1, 2) + 32);
			}
			a += 6;
		}
		a = 0;
		tmp2 = '';
		encoded += '\n';
	}
	encoded += chr(96) + '\n';
	return encoded;
}
String.prototype.count = function (ss) {
	var count = 0,
		pos = this.s.indexOf(ss) while (pos >= 0) {
			count += 1 pos = this.s.indexOf(ss, pos + 1)
		}
	return count
},
String.prototype.count_chars = function (mode) {
	var str = this;
	var result = {},
		resultArr = [],
		i;
	str = ('' + str).split('').sort().join('').match(/(.)\1*/g);
	if ((mode & 1) == 0) {
		for (i = 0; i != 256; i++) {
			result[i] = 0;
		}
	}
	if (mode === 2 || mode === 4) {
		for (i = 0; i != str.length; i += 1) {
			delete result[str[i].charCodeAt(0)];
		}
		for (i in result) {
			result[i] = (mode === 4) ? String.fromCharCode(i) : 0;
		}
	} else if (mode === 3) {
		for (i = 0; i != str.length; i += 1) {
			result[i] = str[i].slice(0, 1);
		}
	} else {
		for (i = 0; i != str.length; i += 1) {
			result[str[i].charCodeAt(0)] = str[i].length;
		}
	} if (mode < 3) {
		return result;
	}
	for (i in result) {
		resultArr.push(result[i]);
	}
	return resultArr.join('');
}
String.prototype.crc32 = function () {
	var str = this;
	str = this.utf8_encode(str);
	var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
	var crc = 0;
	var x = 0;
	var y = 0;
	crc = crc ^ (-1);
	for (var i = 0, iTop = str.length; i < iTop; i++) {
		y = (crc ^ str.charCodeAt(i)) & 0xFF;
		x = '0x' + table.substr(y * 9, 8);
		crc = (crc >>> 8) ^ x;
	}
	return crc ^ (-1);
}
String.prototype.crop = function (maxChars, append) {
	var str = toString(this);
	return truncate(str, maxChars, append, true);
}
String.prototype.cspn = function (mask, start, length) {
	var str = this;
	start = start ? start : 0;
	var count = (length && ((start + length) < str.length)) ? start + length : str.length;
	strct: for (var i = start, lgth = 0; i < count; i++) {
		for (var j = 0; j < mask.length; j++) {
			if (str.charAt(i).indexOf(mask[j]) !== -1) {
				continue strct;
			}
		}++lgth;
	}
	return lgth;
}
String.prototype.dasherize = function () {
	return this.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}
String.prototype.dasherize = function () {
	var s = this.trim().s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
	return new this.constructor(s);
},
String.prototype.decodeHtmlEntities = function () {
	var s = this.s;
	s = s.replace(/&#(\d+);?/g, function (_, code) {
		return String.fromCharCode(code);
	}).replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
		return String.fromCharCode(parseInt(hex, 16));
	}).replace(/&([^;\W]+;?)/g, function (m, e) {
		var ee = e.replace(/;$/, '');
		var target = ENTITIES[e] || (e.match(/;$/) && ENTITIES[ee]);
		if (typeof target === 'number') {
			return String.fromCharCode(target);
		} else if (typeof target === 'string') {
			return target;
		} else {
			return m;
		}
	}) return new this.constructor(s);
},
String.prototype.ECMAsplit = ('ab'.split(/a*/).length > 1 ? String.prototype.split : function (separator, limit) {
	if (typeof limit != 'undefined') {
		throw "ECMAsplit: limit is unimplemented";
	}
	var result = this.split.apply(this, arguments),
		re = RegExp(separator),
		savedIndex = re.lastIndex,
		match = re.exec(this);
	if (match && match.index == 0) {
		result.unshift('');
	}
	re.lastIndex = savedIndex;
	return result;
});
String.prototype.empty = function () {
	var str = this;
	return str.length === 0;
};
String.prototype.encML = function () {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
String.prototype.endsWith = function (str) {
	return (this.length - str.length) === this.lastIndexOf(str);
};
String.prototype.endsWith = function () {
	return this.slice(-str.length) == arguments[0];
},
String.prototype.endsWith = function (string) {
	var index = this.length - string.length;
	return index >= 0 && this.indexOf(string, index) > -1;
},
String.prototype.endsWith = function (suffix) {
	var l = this.s.length - suffix.length;
	return l >= 0 && this.s.indexOf(suffix, l) === l;
},
String.prototype.ensureLeft = function (prefix) {
	var s = this.s;
	if (s.indexOf(prefix) === 0) {
		return this;
	} else {
		return new this.constructor(prefix + s);
	}
},
String.prototype.ensureRight = function (suffix) {
	var s = this.s;
	if (this.endsWith(suffix)) {
		return this;
	} else {
		return new this.constructor(s + suffix);
	}
},
String.prototype.entify = function () {
	return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
},
String.prototype.equals = function () {
	return String(this) === String(arguments[0]);
},
String.prototype.escAll = function () {
	var c, i, l = this.length,
		o = '"';
	for (i = 0; i < l; i += 1) {
		c = this.charAt(i);
		if (c >= ' ') {
			if (c === '\\' || c === '"') {
				o += '\\';
			}
			o += c;
		} else {
			switch (c) {
			case '\b':
				o += '\\b';
				break;
			case '\f':
				o += '\\f';
				break;
			case '\n':
				o += '\\n';
				break;
			case '\r':
				o += '\\r';
				break;
			case '\t':
				o += '\\t';
				break;
			default:
				c = c.charCodeAt();
				o += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}
		}
	}
	return o + '"';
};
String.prototype.escape = function () {
	return String(this).replace(/[<>&"]/g, function (character) {
		return {
			"<": "&lt;",
			">": "&gt;",
			"&": "&amp;",
			"\"": "&quot;"
		}[character]
	})
},
String.prototype.escapeRegExp = function () {
	var str = toString(this);
	return str.replace(/\W/g, '\\$&');
},
String.prototype.escapeshellarg = function () {
	var arg = this;
	var ret = '';
	ret = arg.replace(/[^\\]'/g, function (m, i, s) {
		return m.slice(0, 1) + '\\\'';
	});
	return "'" + ret + "'";
}
String.prototype.escapeXML = function () {
	return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&apos;');
}
String.prototype.explode = function (delimiter, limit) {
	var string = this;
	if (arguments.length < 2 || typeof delimiter === 'undefined' || typeof string === 'undefined') return null;
	if (delimiter === '' || delimiter === false || delimiter === null) return false;
	if (typeof delimiter === 'function' || typeof delimiter === 'object' || typeof string === 'function' || typeof string === 'object') {
		return {
			0: ''
		};
	}
	if (delimiter === true) delimiter = '1';
	delimiter += '';
	string += '';
	var s = string.split(delimiter);
	if (typeof limit === 'undefined') return s;
	if (limit === 0) limit = 1;
	if (limit > 0) {
		if (limit >= s.length) return s;
		return s.slice(0, limit - 1).concat([s.slice(limit - 1).join(delimiter)]);
	}
	if (-limit >= s.length) return [];
	s.splice(s.length + limit);
	return s;
}
String.prototype.extension = function () {
	return String(this).substring(String(this).length - 3, String(this).length);
},
String.prototype.extract = function (pattern, options) {
	var str = this;
	options = options || {};
	var delimiters = options.delimiters || ["{", "}"];
	var lowercase = options.lowercase;
	var whitespace = options.whitespace;
	var special_chars_regex = /[\\\^\$\*\+\.\?\(\)]/g;
	var token_regex = new RegExp(delimiters[0] + "([^" + delimiters.join("") + "\t\r\n]+)" + delimiters[1], "g");
	var tokens = pattern.match(token_regex);
	var pattern_regex = new RegExp(pattern.replace(special_chars_regex, "\\$&").replace(token_regex, "(\.+)"));
	if (lowercase) {
		str = str.toLowerCase();
	}
	if (whitespace) {
		str = str.replace(/\s+/g, function (match) {
			var whitespace_str = "";
			for (var i = 0; i < whitespace; i++) {
				whitespace_str = whitespace_str + match.charAt(0);
			}
			return whitespace_str;
		});
	}
	var matches = str.match(pattern_regex);
	if (!matches) {
		return null;
	}
	if (!tokens) {
		return (str === pattern) ? {} : null;
	}
	matches = matches.splice(1);
	var output = {};
	for (var i = 0; i < tokens.length; i++) {
		output[tokens[i].replace(new RegExp(delimiters[0] + "|" + delimiters[1], "g"), "")] = matches[i];
	}
	return output;
},
String.prototype.first = function () {
	return String(this).slice(0, 1);
},
String.prototype.format = function (o) {
	return this.replace(/\{([^\{\}]*)\}/g, function (a, b) {
		var r = o[b];
		return typeof r === 'string' || typeof r === 'number' ? r : a;
	});
};
String.prototype.format = function () {
	return String(this).replace(/\{\d+\}/g, function (capture) {
		return arguments[capture.match(/\d+/)];
	})
},
String.prototype.format = function () {
	return this.replace(/{(\d+)}/g, function (match, number) {
		return typeof arguments[number] != 'undefined' ? arguments[number] : match;
	});
},
String.prototype.fromcsv = function (dl, lb) {
	if (!dl) {
		dl = ",";
	};
	if (!lb) {
		lb = "\n";
	};
	var str = this;
	str = str.split(lb);
	for (var line in str) {
		str[line] = str[line].split(dl);
	};
	return str;
}
String.prototype.ftrim = function () {
	return String(this).replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
},
String.prototype.fulltrim = function () {
	return String(this).replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
},
String.prototype.generate = function () {
	var rdmstring = "",
		len = arguments[0];
	for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {
		return rdmString.substr(0, len);
	};
},
String.prototype.getcsv = function (delimiter, enclosure, escape) {
	var input = this;
	var i, inpLen, output = [];
	var backwards = function (str) {
		return str.split('').reverse().join('');
	};
	var pq = function (str) {
		return String(str).replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<\>\|\:])/g, '\\$1');
	};
	delimiter = delimiter || ',';
	enclosure = enclosure || '"';
	escape = escape || '\\';
	var pqEnc = pq(enclosure);
	var pqEsc = pq(escape);
	input = input.replace(new RegExp('^\\s*' + pqEnc), '').replace(new RegExp(pqEnc + '\\s*$'), '');
	input = backwards(input).split(new RegExp(pqEnc + '\\s*' + pq(delimiter) + '\\s*' + pqEnc + '(?!' + pqEsc + ')', 'g')).reverse();
	for (i = 0, inpLen = input.length; i < inpLen; i++) {
		output.push(backwards(input[i]).replace(new RegExp(pqEsc + pqEnc, 'g'), enclosure));
	}
	return output;
}
String.prototype.getDigits = function () {
	return String(this).replace(/[^\d]/g, "");
},
String.prototype.guid = function () {
	'use strict';
	return {
		newGuid: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	};
},
String.prototype.guid = function (length) {
	var buf = [],
		chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
		charlen = chars.length,
		length = length || 32;
	for (var i = 0; i < length; i++) {
		buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
	}
	return buf.join('');
},
String.prototype.hashCode = function () {
	var hash = 0,
		i, char;
	if (this.length == 0) {
		return hash
	};
	for (i = 0, l = this.length; i < l; i++) {
		char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash |= 0;
	}
	return hash;
},
String.prototype.hexEscape = function () {
	var string = this;
	var length = string.length;
	var index = -1;
	var result = '';
	var hex;
	while (++index < length) {
		hex = string.charCodeAt(index).toString(16).toUpperCase();
		result += '\\x' + ('00' + hex).slice(-2);
	}
	return result;
}
String.prototype.horspool = function (pattern) {
	function prebmbc(str, size) {
		var bmbc = new Array(size);
		var m = str.length;
		for (var i = 0; i < bmbc.length; i++) {
			bmbc[i] = m;
		}
		for (var i = 0; i < m - 1; i++) {
			bmbc[str[i]] = m - i - 1;
		}
		return bmbc;
	}
	var searchStr = this;
	if (arguments.length < 1) {
		return horspool;
	}
	var bmbc = prebmbc(pattern, 256);
	var m = pattern.length;

	function search(str) {
		if (arguments.length < 1) {
			return search;
		}
		var c, j = 0;
		var n = str.length;
		var matches = new Array();
		while (j <= n - m) {
			c = str[j + m - 1];
			if (pattern[m - 1] == c) {
				if (pattern.compareTo(str.slice(j, j + m))) {
					matches.push(j);
				}
			}
			j += bmbc[c];
		}
		return matches;
	}
	if (arguments.length > 1) {
		return search(searchStr);
	} else {
		return search;
	}
},
String.prototype.humanize = function () { //modified from underscore.string if (this.s === null || this.s === undefined) return new this.constructor('') var s = this.underscore().replace(/_id$/,'').replace(/_/g, ' ').trim().capitalize() return new this.constructor(s) },
	String.prototype.humanize = function () {
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
	},
	String.prototype.hyphenate = function () {
		var str = toString(this);
		str = unCamelCase(str);
		return slugify(str, "-");
	},
	String.prototype.hyphenToCamelCase = function (string) {
		return string.replace(/-([a-z])/g, function (string) {
			return string[1].toUpperCase();
		});
	},
	String.prototype.insert = function (index, partial) {
		var str = toString(this);
		if (index < 0) {
			index = str.length + index;
		}
		index = str.clamp(index, 0, str.length);
		return str.substr(0, index) + partial + str.substr(index);
	},
	String.prototype.insert = function (string, index) {
		return this.slice(0, index) + string + this.slice(index);
	}
	String.prototype.interpolate = function (replacements, syntax) {
		var str = toString(this);
		var replaceFn = function (match, prop) {
			return toString(str.get(replacements, prop));
		};
		return str.replace(syntax || stache, replaceFn);
	},
	String.prototype.ip_tags = function (allowed) {
		var input = this;
		allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
			return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
		});
	}
	String.prototype.ipcslashes = function () {
		var str = this;
		var target = '',
			i = 0,
			sl = 0,
			s = '',
			next = '',
			hex = '',
			oct = '',
			hex2DigMax = /[\dA-Fa-f]{1,2}/,
			rest = '',
			seq = '',
			oct3DigMaxs = /([0-7]{1,3})((\\[0-7]{1,3})*)/,
			oct3DigMax = /(\\([0-7]{1,3}))*/g,
			escOctGrp = [];
		for (i = 0, sl = str.length; i < sl; i++) {
			s = str.charAt(i);
			next = str.charAt(i + 1);
			if (s !== '\\' || !next) {
				target += s;
				continue;
			}
			switch (next) {
			case 'r':
				target += '\u000D';
				break;
			case 'a':
				target += '\u0007';
				break;
			case 'n':
				target += '\n';
				break;
			case 't':
				target += '\t';
				break;
			case 'v':
				target += '\v';
				break;
			case 'b':
				target += '\b';
				break;
			case 'f':
				target += '\f';
				break;
			case '\\':
				target += '\\';
				break;
			case 'x':
				rest = str.slice(i + 2);
				if (rest.search(hex2DigMax) !== -1) {
					hex = (hex2DigMax).exec(rest);
					i += hex.length;
					target += String.fromCharCode(parseInt(hex, 16));
					break;
				}
			default:
				rest = str.slice(i + 2);
				if (rest.search(oct3DigMaxs) !== -1) {
					oct = (oct3DigMaxs).exec(rest);
					i += oct[1].length;
					rest = str.slice(i + 2);
					seq = '';
					if ((escOctGrp = oct3DigMax.exec(rest)) !== null) {
						seq += '%' + parseInt(escOctGrp[2], 8).toString(16);
					}
					try {
						target += decodeURIComponent(seq);
					} catch (e) {
						target += '\uFFFD';
					}
					break;
				}
				target += next;
				break;
			}++i;
		}
	}
	String.prototype.ipos = function (f_needle, f_offset) {
		var haystack = this;
		var haystack = (haystack + '').toLowerCase();
		var needle = (f_needle + '').toLowerCase();
		var index = 0;
		if ((index = haystack.indexOf(needle, f_offset)) !== -1) {
			return index;
		}
		return false;
	}
	String.prototype.ipslashes = function () {
		var str = this;
		return (str + '').replace(/\\(.?)/g, function (s, n1) {
			switch (n1) {
			case '\\':
				return '\\';
			case '0':
				return '\u0000';
			case '':
				return '';
			default:
				return n1;
			}
		});
	}
	String.prototype.ireplace = function (replace, subject, count) {
		var search = this;
		var i = 0,
			j = 0,
			temp = '',
			repl = '',
			sl = 0,
			fl = 0,
			f = '',
			r = '',
			s = '',
			ra = '',
			sa = '',
			otemp = '',
			oi = '',
			ofjl = '',
			os = subject,
			osa = Object.prototype.toString.call(os) === '[object Array]';
		if (typeof (search) === 'object') {
			temp = search;
			search = new Array();
			for (i = 0; i < temp.length; i += 1) {
				search[i] = temp[i].toLowerCase();
			}
		} else {
			search = search.toLowerCase();
		} if (typeof (subject) === 'object') {
			temp = subject;
			subject = new Array();
			for (i = 0; i < temp.length; i += 1) {
				subject[i] = temp[i].toLowerCase();
			}
		} else {
			subject = subject.toLowerCase();
		} if (typeof (search) === 'object' && typeof (replace) === 'string') {
			temp = replace;
			replace = new Array();
			for (i = 0; i < search.length; i += 1) {
				replace[i] = temp;
			}
		}
		temp = '';
		f = [].concat(search);
		r = [].concat(replace);
		ra = Object.prototype.toString.call(r) === '[object Array]';
		s = subject;
		sa = Object.prototype.toString.call(s) === '[object Array]';
		s = [].concat(s);
		os = [].concat(os);
		if (count) {
			this.window[count] = 0;
		}
		for (i = 0, sl = s.length; i < sl; i++) {
			if (s[i] === '') {
				continue;
			}
			for (j = 0, fl = f.length; j < fl; j++) {
				temp = s[i] + '';
				repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
				s[i] = (temp).split(f[j]).join(repl);
				otemp = os[i] + '';
				oi = temp.indexOf(f[j]);
				ofjl = f[j].length;
				if (oi >= 0) {
					os[i] = (otemp).split(otemp.substr(oi, ofjl)).join(repl);
				}
				if (count) {
					this.window[count] += ((temp.split(f[j])).length - 1);
				}
			}
		}
		return osa ? os : os[0];
	}
	String.prototype.isAlpha = function () {
		return !/[^a-z\xDF-\xFF]|^$/.test(this.s.toLowerCase());
	},
	String.prototype.isAlphaNumeric = function () {
		return !/[^0-9a-z\xDF-\xFF]/.test(this.s.toLowerCase());
	},
	String.prototype.isAlphanumeric = function () {
		return !(/\W/.test(this));
	},
	String.prototype.isBlank = function () {
		return this === '' && this.trim().length === 0;
	}),
String.prototype.isBlank = function () {
	return this === null || typeof (this) === 'undefined' || this.length === 0;
},
String.prototype.isCC = function (type) {
	var regex;
	if (type == null) {
		type = 'any';
	}
	regex = (function () {
		switch (type) {
		case 'any':
			return /^[0-9]{15,16}$/;
		case 'ae' || 'AmericanExpress':
			return /^(34)|(37)\d{14}$/;
		case 'Discover':
			return /^6011\d{12}$/;
		case 'mc' || 'MasterCard':
			return /^5[1-5]\d{14}$/;
		case 'Visa':
			return /^4\d{15}$/;
		}
	})();
	return regex.test(this);
},
String.prototype.isCol = function () {
	return String(this).search(/\w/) != -1;
},
String.prototype.isColRange = function () {
	return String(this).search(/\w:\w/) != -1;
},
String.prototype.isCoordinate = function () {
	return /-?\d{1,3}\.\d+/.test(this);
},
String.prototype.isCreditCard = function (type) {
	return this.cc(this, type);
},
String.prototype.isDecimal = function () {
	return String(this).search(/^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/) != -1;
},
String.prototype.isEmail = function () {
	return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this);
},
String.prototype.isEmail = function () {
	return String(this).search(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/) != -1;
},
String.prototype.isEmpty = function () {
	return this === '' && this.trim().length === 0;
}),
String.prototype.isEmpty = function () {
	return this.s === null || this.s === undefined ? true : /^[\s\xa0]*$/.test(this.s);
},
String.prototype.isInteger = function () {
	return /^-?\d+$/.test(this);
},
String.prototype.isLower = function () {
	return this.isAlpha() && this.s.toLowerCase() === this.s;
},
String.prototype.isNotBlank = function () {
	return !this.isBlank();
},
String.prototype.isntBlank = function () {
	return String(this).search(/\S/) != -1;
},
String.prototype.isNumber = function () {
	return String(this).search(/^\s*(\+|-)?\d+\s*$/) != -1;
},
String.prototype.isNumeric = function () {
	return !/[^0-9]/.test(this.s);
},
String.prototype.isPhone = function (country) {
	var regex;
	if (country == null) {
		country = 'us';
	}
	regex = (function () {
		switch (country) {
		case 'ar':
			return /^(?:\+|[0]{2})?(54)?(:?[\s-])*\d{4}(:?[\s-])*\d{4}$/;
		case 'au':
			return /^(?:\+|0)?(?:61)?\s?[2-478](?:[ -]?[0-9]){8}$/;
		case 'ca':
			return /^(1-?)?(([2-9]\d{2})|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/;
		case 'fr':
			return /^(?:0|\(?\+33\)?\s?|0033\s?)[1-79](?:[\.\-\s]?\d\d){4}$/;
		case 'is':
			return /^(?:\+|[0]{2})?(354)?(:?[\s-])*\d{3}(:?[\s-])*\d{4}$/;
		case 'uk':
			return /^(?:\+|044)?(?:\s+)?\(?(\d{1,5}|\d{4}\s*\d{1,2})\)?\s+|-(\d{1,4}(\s+|-)?\d{1,4}|(\d{6}))\d{6}$/;
		case 'us':
			return /^(\d{3})(:?[\s\-])*(\d{3})(:?[\s\-])*(\d{4})$/;
		}
	})();
	return regex.test(this);
},
String.prototype.isPositiveDecimal = function () {
	return (!/\D/.test(this)) || (/^\d+\.\d+$/.test(this));
},
String.prototype.isRange = function () {
	return String(this).search(/\w\d:\w\d/) != -1;
},
String.prototype.isRow = function () {
	return String(this).search(/\d/) != -1;
},
String.prototype.isRowRange = function () {
	return String(this).search(/\d:\d/) != -1;
},
String.prototype.isSelector = function () {
	return String(this).search(/^([0-9A-z]([#|.|,|:][0-9A-z]){0,10})?$/) != -1;
},
String.prototype.istr = function (needle, bool) {
	var haystack = this;
	var pos = 0;
	haystack += '';
	pos = haystack.toLowerCase().indexOf((needle + '').toLowerCase());
	if (pos == -1) {
		return false;
	} else {
		if (bool) {
			return haystack.substr(0, pos);
		} else {
			return haystack.slice(pos);
		}
	}
}
String.prototype.isUnempty = function () {
	return this !== '' && this.trim().length !== 0;
}),
String.prototype.isUpper = function () {
	return this.isAlpha() && this.s.toUpperCase() === this.s;
},
String.prototype.isUrl = function () {
	return /(http:\/\/)?(www\.)?(.+?)(\.com|\.org|\.gov|\.edu)(\/.*?)?/.test(this);
},
String.prototype.isZip = function (country) {
	var regex;
	if (country == null) {
		country = 'us';
	}
	regex = (function () {
		switch (country) {
		case 'ar':
			return /^\d{4}$/;
		case 'au':
			return /^\d{4}$/;
		case 'at':
			return /^\d{4}$/;
		case 'be':
			return /^\d{4}$/;
		case 'br':
			return /^\d{5}[\-]?\d{3}$/;
		case 'ca':
			return /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
		case 'dk':
			return /^\d{3,4}$/;
		case 'de':
			return /^\d{5}$/;
		case 'es':
			return /^((0[1-9]|5[0-2])|[1-4]\d)\d{3}$/;
		case 'gb':
			return /^[A-Za-z]{1,2}[0-9Rr][0-9A-Za-z]? \d[ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}$/;
		case 'hu':
			return /^\d{4}$/;
		case 'is':
			return /^\d{3}$/;
		case 'it':
			return /^\d{5}$/;
		case 'jp':
			return /^\d{3}-\d{4}$/;
		case 'lu':
			return /^(L\s*(-|—|–))\s*?[\d]{4}$/;
		case 'nl':
			return /^[1-9]\d{3}\s?[a-zA-Z]{2}$/;
		case 'pl':
			return /^\d{2}\-\d{3}$/;
		case 'se':
			return /^\d{3}\s?\d{2}$/;
		case 'us':
			return /^(\d{5}([\-]\d{4})?)$/;
		}
	})();
	return regex.test(this);
},
String.prototype.last = function () {
	return String(this).slice(-1);
},
String.prototype.latinise = function () {
	var s = this.replace(/[^A-Za-z0-9\[\] ]/g, function (x) {
		return latin_map[x] || x;
	});
	return new this.constructor(s);
},
String.prototype.lcfirst = function () {
	var str = this;
	str += '';
	var f = str.charAt(0).toLowerCase();
	return f + str.substr(1);
}
String.prototype.left = function (N) {
	if (N >= 0) {
		var s = this.s.substr(0, N);
		return new this.constructor(s);
	} else {
		return this.right(-N);
	}
},
String.prototype.len = function () {
	var string = this;
	var str = string + '';
	var i = 0,
		chr = '',
		lgth = 0;
	if (!this.php_js || !this.php_js.ini || !this.php_js.ini['unicode.semantics'] || this.php_js.ini['unicode.semantics'].local_value.toLowerCase() !== 'on') {
		return string.length;
	}
	var getWholeChar = function (str, i) {
		var code = str.charCodeAt(i);
		var next = '',
			prev = '';
		if (0xD800 <= code && code <= 0xDBFF) {
			if (str.length <= (i + 1)) {
				throw 'High surrogate without following low surrogate';
			}
			next = str.charCodeAt(i + 1);
			if (0xDC00 > next || next > 0xDFFF) {
				throw 'High surrogate without following low surrogate';
			}
			return str.charAt(i) + str.charAt(i + 1);
		} else if (0xDC00 <= code && code <= 0xDFFF) {
			if (i === 0) {
				throw 'Low surrogate without preceding high surrogate';
			}
			prev = str.charCodeAt(i - 1);
			if (0xD800 > prev || prev > 0xDBFF) {
				throw 'Low surrogate without preceding high surrogate';
			}
			return false;
		}
		return str.charAt(i);
	};
	for (i = 0, lgth = 0; i < str.length; i++) {
		if ((chr = getWholeChar(str, i)) === false) {
			continue;
		}
		lgth++;
	}
	return lgth;
}
String.prototype.levenshtein = function (c) {
	var s, l = (s = String(this).split("")).length,
		t = (c = c.split("")).length,
		i, j, m, n;
	if (!(l || t)) return Math.max(l, t);
	for (var a = [], i = l + 1; i; a[--i] = [i]);
	for (i = t + 1; a[0][--i] = i;);
	for (i = -1, m = s.length; ++i < m;)
		for (j = -1, n = c.length; ++j < n;) a[(i *= 1) + 1][(j *= 1) + 1] = Math.min(a[i][j + 1] + 1, a[i + 1][j] + 1, a[i][j] + (s[i] != c[j]));
	return a[l][t];
},
String.prototype.levenshtein = function (s2, cost_ins, cost_rep, cost_del) {
	var s1 = this;
	var LEVENSHTEIN_MAX_LENGTH = 255;
	cost_ins = cost_ins == null ? 1 : +cost_ins;
	cost_rep = cost_rep == null ? 1 : +cost_rep;
	cost_del = cost_del == null ? 1 : +cost_del;
	if (s1 == s2) {
		return 0;
	}
	var l1 = s1.length;
	var l2 = s2.length;
	if (l1 === 0) {
		return l2 * cost_ins;
	}
	if (l2 === 0) {
		return l1 * cost_del;
	}
	var split = false;
	try {
		split = !('0')[0];
	} catch (e) {
		split = true;
	}
	if (split) {
		s1 = s1.split('');
		s2 = s2.split('');
	}
	var p1 = new Array(l2 + 1);
	var p2 = new Array(l2 + 1);
	var i1, i2, c0, c1, c2, tmp;
	for (i2 = 0; i2 <= l2; i2++) {
		p1[i2] = i2 * cost_ins;
	}
	for (i1 = 0; i1 < l1; i1++) {
		p2[0] = p1[0] + cost_del;
		for (i2 = 0; i2 < l2; i2++) {
			c0 = p1[i2] + ((s1[i1] == s2[i2]) ? 0 : cost_rep);
			c1 = p1[i2 + 1] + cost_del;
			if (c1 < c0) {
				c0 = c1;
			}
			c2 = p2[i2] + cost_ins;
			if (c2 < c0) {
				c0 = c2;
			}
			p2[i2 + 1] = c0;
		}
		tmp = p1;
		p1 = p2;
		p2 = tmp;
	}
	c0 = p1[l2];
	return c0;
}
String.prototype.lines = function () { //convert windows newlines to unix newlines then convert to an Array of lines return this.replaceAll('\r\n', '\n').s.split('\n'); },
	String.prototype.lowercase = function () {
		var input = this;
		if (typeof input !== "string" || !input) {
			return null;
		}
		return input.toLowerCase()
	},
	String.prototype.ltrim = function () {
		return String(this).replace(/^\s+/, '');
	},
	String.prototype.ltrim = function (charlist) {
		var str = this;
		charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
		var re = new RegExp('^[' + charlist + ']+', 'g');
		return (str + '').replace(re, '');
	}
	String.prototype.markdown = function (src) {
		src = src || this;
		var h = '';

		function escape(t) {
			return new Option(t).innerHTML;
		}

		function inlineEscape(s) {
			return escape(s).replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2"/>').replace(/\[([^\]]+)]\(([^(]+)\)/g, '<a href="$2">$1</a>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
		}
		src.replace(/^\s+|\r|\s+$/g, '').replace(/\t/g, '    ').split(/\n\n+/).forEach(function (b, f, R) {
			f = b[0];
			R = {
				'*': [/\n\* /, '<ul><li>', '</li></ul>'],
				'1': [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>'],
				' ': [/\n    /, '<pre><code>', '</pre></code>', '\n'],
				'>': [/\n> /, '<blockquote>', '</blockquote>', '\n']
			}[f];
			h += R ? R[1] + ('\n' + b).split(R[0]).slice(1).map(R[3] ? escape : inlineEscape).join(R[3] || '</li>\n<li>') + R[2] : f == '#' ? '<h' + (f = b.indexOf(' ')) + '>' + inlineEscape(b.slice(f + 1)) + '</h' + f + '>' : f == '<' ? b : '<p>' + inlineEscape(b) + '</p>';
		});
		return h;
	};
	String.prototype.mask = function (m) {
		var m, l = (m = m.split("")).length,
			s = String(this).split(""),
			j = 0,
			h = "";
		for (var i = -1; ++i < l;)
			if (m[i] != "#") {
				if (m[i] == "\\" && (h += m[++i])) continue;
				h += m[i];
				i + 1 == l && (s[j - 1] += h, h = "");
			} else {
				if (!s[j] && !(h = "")) break;
				(s[j] = h + s[j++]) && (h = "");
			}
		return s.join("") + h;
	},
	String.prototype.md5 = function () {
		var str = this;
		var xl;
		var rotateLeft = function (lValue, iShiftBits) {
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		};
		var addUnsigned = function (lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		};
		var _F = function (x, y, z) {
			return (x & y) | ((~x) & z);
		};
		var _G = function (x, y, z) {
			return (x & z) | (y & (~z));
		};
		var _H = function (x, y, z) {
			return (x ^ y ^ z);
		};
		var _I = function (x, y, z) {
			return (y ^ (x | (~z)));
		};
		var _FF = function (a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		var _GG = function (a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		var _HH = function (a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		var _II = function (a, b, c, d, x, s, ac) {
			a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
			return addUnsigned(rotateLeft(a, s), b);
		};
		var convertToWordArray = function (str) {
			var lWordCount;
			var lMessageLength = str.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = new Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		};
		var wordToHex = function (lValue) {
			var wordToHexValue = '',
				wordToHexValue_temp = '',
				lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				wordToHexValue_temp = '0' + lByte.toString(16);
				wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
			}
			return wordToHexValue;
		};
		var x = [],
			k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
			S12 = 12,
			S13 = 17,
			S14 = 22,
			S21 = 5,
			S22 = 9,
			S23 = 14,
			S24 = 20,
			S31 = 4,
			S32 = 11,
			S33 = 16,
			S34 = 23,
			S41 = 6,
			S42 = 10,
			S43 = 15,
			S44 = 21;
		str = this.utf8_encode(str);
		x = convertToWordArray(str);
		a = 0x67452301;
		b = 0xEFCDAB89;
		c = 0x98BADCFE;
		d = 0x10325476;
		xl = x.length;
		for (k = 0; k < xl; k += 16) {
			AA = a;
			BB = b;
			CC = c;
			DD = d;
			a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = addUnsigned(a, AA);
			b = addUnsigned(b, BB);
			c = addUnsigned(c, CC);
			d = addUnsigned(d, DD);
		}
		var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
		return temp.toLowerCase();
	}
	String.prototype.metaphone = function (max_phonemes) {
		var word = this;
		var type = typeof word;
		if (type === 'undefined' || type === 'object' && word !== null) {
			return null;
		}
		if (type === 'number') {
			if (isNaN(word)) {
				word = 'NAN';
			} else if (!isFinite(word)) {
				word = 'INF';
			}
		}
		if (max_phonemes < 0) {
			return false;
		}
		max_phonemes = Math.floor(+max_phonemes) || 0;
		var alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			vowel = 'AEIOU',
			soft = 'EIY',
			leadingNonAlpha = new RegExp('^[^' + alpha + ']+');
		word = typeof word === 'string' ? word : '';
		word = word.toUpperCase().replace(leadingNonAlpha, '');
		if (!word) {
			return '';
		}
		var is = function (p, c) {
			return c !== '' && p.indexOf(c) !== -1;
		};
		var i = 0,
			cc = word.charAt(0),
			nc = word.charAt(1),
			nnc, pc, l = word.length,
			meta = '',
			traditional = true;
		switch (cc) {
		case 'A':
			meta += nc === 'E' ? nc : cc;
			i += 1;
			break;
		case 'G':
		case 'K':
		case 'P':
			if (nc === 'N') {
				meta += nc;
				i += 2;
			}
			break;
		case 'W':
			if (nc === 'R') {
				meta += nc;
				i += 2;
			} else if (nc === 'H' || is(vowel, nc)) {
				meta += 'W';
				i += 2;
			}
			break;
		case 'X':
			meta += 'S';
			i += 1;
			break;
		case 'E':
		case 'I':
		case 'O':
		case 'U':
			meta += cc;
			i++;
			break;
		}
		for (; i < l && (max_phonemes === 0 || meta.length < max_phonemes); i += 1) {
			cc = word.charAt(i);
			nc = word.charAt(i + 1);
			pc = word.charAt(i - 1);
			nnc = word.charAt(i + 2);
			if (cc === pc && cc !== 'C') {
				continue;
			}
			switch (cc) {
			case 'B':
				if (pc !== 'M') {
					meta += cc;
				}
				break;
			case 'C':
				if (is(soft, nc)) {
					if (nc === 'I' && nnc === 'A') {
						meta += 'X';
					} else if (pc !== 'S') {
						meta += 'S';
					}
				} else if (nc === 'H') {
					meta += !traditional && (nnc === 'R' || pc === 'S') ? 'K' : 'X';
					i += 1;
				} else {
					meta += 'K';
				}
				break;
			case 'D':
				if (nc === 'G' && is(soft, nnc)) {
					meta += 'J';
					i += 1;
				} else {
					meta += 'T';
				}
				break;
			case 'G':
				if (nc === 'H') {
					if (!(is('BDH', word.charAt(i - 3)) || word.charAt(i - 4) === 'H')) {
						meta += 'F';
						i += 1;
					}
				} else if (nc === 'N') {
					if (is(alpha, nnc) && word.substr(i + 1, 3) !== 'NED') {
						meta += 'K';
					}
				} else if (is(soft, nc) && pc !== 'G') {
					meta += 'J';
				} else {
					meta += 'K';
				}
				break;
			case 'H':
				if (is(vowel, nc) && !is('CGPST', pc)) {
					meta += cc;
				}
				break;
			case 'K':
				if (pc !== 'C') {
					meta += 'K';
				}
				break;
			case 'P':
				meta += nc === 'H' ? 'F' : cc;
				break;
			case 'Q':
				meta += 'K';
				break;
			case 'S':
				if (nc === 'I' && is('AO', nnc)) {
					meta += 'X';
				} else if (nc === 'H') {
					meta += 'X';
					i += 1;
				} else if (!traditional && word.substr(i + 1, 3) === 'CHW') {
					meta += 'X';
					i += 2;
				} else {
					meta += 'S';
				}
				break;
			case 'T':
				if (nc === 'I' && is('AO', nnc)) {
					meta += 'X';
				} else if (nc === 'H') {
					meta += '0';
					i += 1;
				} else if (word.substr(i + 1, 2) !== 'CH') {
					meta += 'T';
				}
				break;
			case 'V':
				meta += 'F';
				break;
			case 'W':
			case 'Y':
				if (is(vowel, nc)) {
					meta += cc;
				}
				break;
			case 'X':
				meta += 'KS';
				break;
			case 'Z':
				meta += 'S';
				break;
			case 'F':
			case 'J':
			case 'L':
			case 'M':
			case 'N':
			case 'R':
				meta += cc;
				break;
			}
		}
		return meta;
	}
	String.prototype.multiply = function (num) {
		var str = this;
		var n, out;
		if (num < 0) {
			_err.throw_argument();
		}
		out = "";
		n = 0;
		while (++n <= num) {
			out += str;
		}
		return out;
	};
	String.prototype.natcasecmp = function (str2) {
		var str1 = this;
		var a = (str1 + '').toLowerCase();
		var b = (str2 + '').toLowerCase();
		var isWhitespaceChar = function (a) {
			return a.charCodeAt(0) <= 32;
		};
		var isDigitChar = function (a) {
			var charCode = a.charCodeAt(0);
			return (charCode >= 48 && charCode <= 57);
		};
		var compareRight = function (a, b) {
			var bias = 0;
			var ia = 0;
			var ib = 0;
			var ca;
			var cb;
			for (var cnt = 0; true; ia++, ib++) {
				ca = a.charAt(ia);
				cb = b.charAt(ib);
				if (!isDigitChar(ca) && !isDigitChar(cb)) {
					return bias;
				} else if (!isDigitChar(ca)) {
					return -1;
				} else if (!isDigitChar(cb)) {
					return 1;
				} else if (ca < cb) {
					if (bias === 0) {
						bias = -1;
					}
				} else if (ca > cb) {
					if (bias === 0) {
						bias = 1;
					}
				} else if (ca === '0' && cb === '0') {
					return bias;
				}
			}
		};
		var ia = 0,
			ib = 0;
		var nza = 0,
			nzb = 0;
		var ca, cb;
		var result;
		while (true) {
			nza = nzb = 0;
			ca = a.charAt(ia);
			cb = b.charAt(ib);
			while (isWhitespaceChar(ca) || ca === '0') {
				if (ca === '0') {
					nza++;
				} else {
					nza = 0;
				}
				ca = a.charAt(++ia);
			}
			while (isWhitespaceChar(cb) || cb === '0') {
				if (cb === '0') {
					nzb++;
				} else {
					nzb = 0;
				}
				cb = b.charAt(++ib);
			}
			if (isDigitChar(ca) && isDigitChar(cb)) {
				if ((result = compareRight(a.substring(ia), b.substring(ib))) !== 0) {
					return result;
				}
			}
			if (ca === '0' && cb === '0') {
				return nza - nzb;
			}
			if (ca < cb) {
				return -1;
			} else if (ca > cb) {
				return +1;
			}
			if (ia >= a.length && ib >= b.length) return 0;
			++ia;
			++ib;
		}
	}
	String.prototype.natcmp = function (f_string2, f_version) {
		var f_string1 = this;
		var i = 0;
		if (f_version == undefined) {
			f_version = false;
		}
		var __strnatcmp_split = function (f_string) {
			var result = [];
			var buffer = '';
			var chr = '';
			var i = 0,
				f_stringl = 0;
			var text = true;
			f_stringl = f_string.length;
			for (i = 0; i < f_stringl; i++) {
				chr = f_string.substring(i, i + 1);
				if (chr.match(/\d/)) {
					if (text) {
						if (buffer.length > 0) {
							result[result.length] = buffer;
							buffer = '';
						}
						text = false;
					}
					buffer += chr;
				} else if ((text == false) && (chr === '.') && (i < (f_string.length - 1)) && (f_string.substring(i + 1, i + 2).match(/\d/))) {
					result[result.length] = buffer;
					buffer = '';
				} else {
					if (text == false) {
						if (buffer.length > 0) {
							result[result.length] = parseInt(buffer, 10);
							buffer = '';
						}
						text = true;
					}
					buffer += chr;
				}
			}
			if (buffer.length > 0) {
				if (text) {
					result[result.length] = buffer;
				} else {
					result[result.length] = parseInt(buffer, 10);
				}
			}
			return result;
		};
		var array1 = __strnatcmp_split(f_string1 + '');
		var array2 = __strnatcmp_split(f_string2 + '');
		var len = array1.length;
		var text = true;
		var result = -1;
		var r = 0;
		if (len > array2.length) {
			len = array2.length;
			result = 1;
		}
		for (i = 0; i < len; i++) {
			if (isNaN(array1[i])) {
				if (isNaN(array2[i])) {
					text = true;
					if ((r = this.strcmp(array1[i], array2[i])) != 0) {
						return r;
					}
				} else if (text) {
					return 1;
				} else {
					return -1;
				}
			} else if (isNaN(array2[i])) {
				if (text) {
					return -1;
				} else {
					return 1;
				}
			} else {
				if (text || f_version) {
					if ((r = (array1[i] - array2[i])) != 0) {
						return r;
					}
				} else {
					if ((r = this.strcmp(array1[i].toString(), array2[i].toString())) != 0) {
						return r;
					}
				}
				text = false;
			}
		}
		return result;
	}
	String.prototype.ncasecmp = function (argStr2, len) {
		var argStr1 = this,
			diff, i = 0;
		var str1 = (argStr1 + '').toLowerCase().substr(0, len);
		var str2 = (argStr2 + '').toLowerCase().substr(0, len);
		if (str1.length !== str2.length) {
			if (str1.length < str2.length) {
				len = str1.length;
				if (str2.substr(0, str1.length) == str1) {
					return str1.length - str2.length;
				}
			} else {
				len = str2.length;
				if (str1.substr(0, str2.length) == str2) {
					return str1.length - str2.length;
				}
			}
		} else {
			len = str1.length;
		}
		for (diff = 0, i = 0; i < len; i++) {
			diff = str1.charCodeAt(i) - str2.charCodeAt(i);
			if (diff !== 0) {
				return diff;
			}
		}
		return 0;
	}
	String.prototype.ncmp = function (str2, lgth) {
		var str1 = this;
		var s1 = (str1 + '').substr(0, lgth);
		var s2 = (str2 + '').substr(0, lgth);
		return ((s1 == s2) ? 0 : ((s1 > s2) ? 1 : -1));
	}
	String.prototype.nl2br = function (is_xhtml) {
		var str = this;
		var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>';
		return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}
	String.prototype.normalize = function (str) {
		var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
			to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
			mapping = {};
		for (var i = 0, j = from.length; i < j; i++) {
			mapping[from.charAt(i)] = to.charAt(i);
		}
		var ret = [];
		for (var i = 0, j = str.length; i < j; i++) {
			var c = str.charAt(i);
			if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
			else ret.push(c);
		}
		return ret.join('');
	},
	String.prototype.normalizeLineBreaks = function (lineEnd) {
		var str = toString(this);
		lineEnd = lineEnd || '\n';
		return str.replace(/\r\n/g, lineEnd).replace(/\r/g, lineEnd).replace(/\n/g, lineEnd);
	},
	String.prototype.notfirst = function () {
		return String(this).slice(1);
	},
	String.prototype.notlast = function () {
		return String(this).slice(0, -1);
	},
	String.prototype.nth = function (n) {
		if (/^(string|number)$/.test(typeof n) === false) {
			return n;
		}
		var suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'],
			match = n.toString().match(/\d$/),
			suffix;
		if (!match) {
			return n;
		}
		suffix = suffixes[match[0]];
		if (/1[123]$/.test(n)) {
			suffix = 'th';
		}
		return [n, suffix].join('');
	}
	String.prototype.onlyLetters = function () {
		return String(this).toLowerCase().replace(/[^a-z]/g, "");
	},
	String.prototype.onlyLettersNums = function () {
		return String(this).toLowerCase().replace(/[^a-z,0-9,-]/g, "");
	},
	String.prototype.ord = function () {
		var string = this;
		var str = string + '',
			code = str.charCodeAt(0);
		if (0xD800 <= code && code <= 0xDBFF) {
			var hi = code;
			if (str.length === 1) {
				return code;
			}
			var low = str.charCodeAt(1);
			return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
		}
		if (0xDC00 <= code && code <= 0xDFFF) {
			return code;
		}
		return code;
	}
	String.prototype.pad = function (n, PadChar) {
		var strNew = this.toString();
		if (!PadChar) {
			PadChar = " ";
		}
		while (strNew.length < n) {
			strNew = PadChar + strNew;
		}
		return strNew;
	};
	String.prototype.pad = function (len, ch) { //https://github.com/component/pad if (ch == null) ch = ' '; if (this.s.length >= len) return new this.constructor(this.s); len = len - this.s.length; var left = Array(Math.ceil(len / 2) + 1).join(ch); var right = Array(Math.floor(len / 2) + 1).join(ch); return new this.constructor(left + this.s + right); },
		String.prototype.pad = function (pad_length, pad_string, pad_type) {
			var input = this;
			var half = '',
				pad_to_go;
			var str_pad_repeater = function (s, len) {
				var collect = '',
					i;
				while (collect.length < len) {
					collect += s;
				}
				collect = collect.substr(0, len);
				return collect;
			};
			input += '';
			pad_string = pad_string !== undefined ? pad_string : ' ';
			if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
				pad_type = 'STR_PAD_RIGHT';
			}
			if ((pad_to_go = pad_length - input.length) > 0) {
				if (pad_type === 'STR_PAD_LEFT') {
					input = str_pad_repeater(pad_string, pad_to_go) + input;
				} else if (pad_type === 'STR_PAD_RIGHT') {
					input = input + str_pad_repeater(pad_string, pad_to_go);
				} else if (pad_type === 'STR_PAD_BOTH') {
					half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
					input = half + input + half;
					input = input.substr(0, pad_length);
				}
			}
			return input;
		}
		String.prototype.padLeft = function (len, ch) { //https://github.com/component/pad if (ch == null) ch = ' '; if (this.s.length >= len) return new this.constructor(this.s); return new this.constructor(Array(len - this.s.length + 1).join(ch) + this.s); },
			String.prototype.padr = function (n, PadChar) {
				var strNew = this.toString();
				if (!PadChar) {
					PadChar = " ";
				}
				while (strNew.length < n) {
					strNew = strNew + PadChar;
				}
				return strNew;
			};
			String.prototype.padRight = function (len, ch) { //https://github.com/component/pad if (ch == null) ch = ' '; if (this.s.length >= len) return new this.constructor(this.s); return new this.constructor(this.s + Array(len - this.s.length + 1).join(ch)); },
				String.prototype.parse_str = function (array) {
					var str = this;
					var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&'),
						sal = strArr.length,
						i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value, postLeftBracketPos, keys, keysLen, fixStr = function (str) {
							return decodeURIComponent(str.replace(/\+/g, '%20'));
						};
					if (!array) {
						array = this.window;
					}
					for (i = 0; i < sal; i++) {
						tmp = strArr[i].split('=');
						key = fixStr(tmp[0]);
						value = (tmp.length < 2) ? '' : fixStr(tmp[1]);
						while (key.charAt(0) === ' ') {
							key = key.slice(1);
						}
						if (key.indexOf('\x00') > -1) {
							key = key.slice(0, key.indexOf('\x00'));
						}
						if (key && key.charAt(0) !== '[') {
							keys = [];
							postLeftBracketPos = 0;
							for (j = 0; j < key.length; j++) {
								if (key.charAt(j) === '[' && !postLeftBracketPos) {
									postLeftBracketPos = j + 1;
								} else if (key.charAt(j) === ']') {
									if (postLeftBracketPos) {
										if (!keys.length) {
											keys.push(key.slice(0, postLeftBracketPos - 1));
										}
										keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
										postLeftBracketPos = 0;
										if (key.charAt(j + 1) !== '[') {
											break;
										}
									}
								}
							}
							if (!keys.length) {
								keys = [key];
							}
							for (j = 0; j < keys[0].length; j++) {
								chr = keys[0].charAt(j);
								if (chr === ' ' || chr === '.' || chr === '[') {
									keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
								}
								if (chr === '[') {
									break;
								}
							}
							obj = array;
							for (j = 0, keysLen = keys.length; j < keysLen; j++) {
								key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
								lastIter = j !== keys.length - 1;
								lastObj = obj;
								if ((key !== '' && key !== ' ') || j === 0) {
									if (obj[key] === undef) {
										obj[key] = {};
									}
									obj = obj[key];
								} else {
									ct = -1;
									for (p in obj) {
										if (obj.hasOwnProperty(p)) {
											if (+p > ct && p.match(/^\d+$/g)) {
												ct = +p;
											}
										}
									}
									key = ct + 1;
								}
							}
							lastObj[key] = value;
						}
					}
				}
				String.prototype.parseCSV = function (delimiter, qualifier, escape, lineDelimiter) { //try to parse no matter what delimiter = delimiter || ','; escape = escape || '\\'if (typeof qualifier == 'undefined') {qualifier = '"';} var i = 0, fieldBuffer = [], fields = [], len = this.s.length, inField = false, inUnqualifiedString = false, self = this; var ca = function(i){return self.s.charAt(i)}; if (typeof lineDelimiter !== 'undefined') {var rows = [];} if (!qualifier) {inField = true;} while (i < len) {var current = ca(i); switch (current) {case escape: //fix for issues #32 and #35 if (inField && ((escape !== qualifier) || ca(i+1) === qualifier)) {i += 1; fieldBuffer.push(ca(i)); break; } if (escape !== qualifier) break; case qualifier: inField = !inField; break; case delimiter: if(inUnqualifiedString) {inField=false; inUnqualifiedString=false; } if (inField && qualifier) {fieldBuffer.push(current);} else {fields.push(fieldBuffer.join('')) fieldBuffer.length = 0; } break; case lineDelimiter: if(inUnqualifiedString) {inField=false; inUnqualifiedString=false; fields.push(fieldBuffer.join('')) rows.push(fields); fields = []; fieldBuffer.length = 0; } else if (inField) {{fieldBuffer.push(current);} } else {if (rows) {fields.push(fieldBuffer.join('')) rows.push(fields); fields = []; fieldBuffer.length = 0; } } break; case ' ': if (inField) {fieldBuffer.push(current);} break; default: if (inField) {fieldBuffer.push(current);} else if(current!==qualifier) {fieldBuffer.push(current); inField=true; inUnqualifiedString=true; } break; } i += 1; } fields.push(fieldBuffer.join('')); if (rows) {rows.push(fields); return rows; } return fields; },
					String.prototype.parseHTML = function (htmlString) {
						var htmlString = this;
						var tmp = document.implementation.createHTMLDocument() tmp.body.innerHTML = htmlString;
						return tmp.body.children;
					}
					String.prototype.parseInt = function () {
						return parseInt(String(this));
					},
					String.prototype.parseInt = function (b, c) {
						var s = 0,
							n, l = (n = this.split("")).length,
							i = 0;
						if (b > (c = c || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz").length || b < 2) return NaN;
						while (l--) {
							s += c.indexOf(n[i++]) * Math.pow(b, l);
						};
						return s;
					};
					String.prototype.namespace = function (obj) {
						var c, b = this.split('.'),
							p = window;
						while (c = b.shift()) {
							p = (p[c] = (p[c] || {}));
						};
						if (typeof obj === 'object') {
							for (var k in obj) {
								p[k] = obj[k];
							};
						};
						return p;
					},
					String.prototype.partition = function (pattern) {
						var str = this;
						var a, b, c, idx, start;
						idx = _str.index(str, pattern);
						if (idx !== null) {
							start = idx + pattern.length;
							a = _str.slice(str, 0, idx) || '';
							b = pattern;
							c = nativeStrSlice.call(str, start);
							return [a, b, c];
						} else {
							return [str, '', ''];
						}
					};
					String.prototype.pascalCase = function () {
						var str = toString(this);
						return camelCase(str).replace(/^[a-z]/, upperCase);
					},
					String.prototype.passwordStrength = function (e) { //entropy? var pwd = this; var result = ""; var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g"); var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g"); var enoughRegex = new RegExp("(?=.{6,}).*", "g"); if (false == enoughRegex.test(pwd)) {var result = 'Más caracteres'; } else if (strongRegex.test(pwd)) {var result = 'Excelente!'; } else if (mediumRegex.test(pwd)) {var result = 'Fuerte!'; } else {var result = 'Debil!'; } return result; },
						String.prototype.pbrk = function (char_list) {
							var haystack = this;
							for (var i = 0, len = haystack.length; i < len; ++i) {
								if (char_list.indexOf(haystack.charAt(i)) >= 0) {
									return haystack.slice(i);
								}
							}
							return false;
						}
						String.prototype.pos = function (needle, offset) {
							var haystack = this;
							var i = (haystack + '').indexOf(needle, (offset || 0));
							return i === -1 ? false : i;
						}
						String.prototype.properCase = function () {
							var str = toString(this);
							return lowerCase(str).replace(/^\w|\s\w/g, upperCase);
						},
						String.prototype.quote = function () {
							var c, i, l = this.length,
								o = '"';
							for (i = 0; i < l; i += 1) {
								c = this.charAt(i);
								if (c >= ' ') {
									if (c === '\\' || c === '"') {
										o += '\\';
									}
									o += c;
								} else {
									switch (c) {
									case '\b':
										o += '\\b';
										break;
									case '\f':
										o += '\\f';
										break;
									case '\n':
										o += '\\n';
										break;
									case '\r':
										o += '\\r';
										break;
									case '\t':
										o += '\\t';
										break;
									default:
										c = c.charCodeAt();
										o += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
									}
								}
							}
							return o + '"';
						},
						String.prototype.quotemeta = function () {
							return (this + '').replace(/([\.\\\+\*\?\[\^\]\$\(\)])/g, '\\$1');
						}
						String.prototype.random = function () {
							var str = '',
								len = arguments[0];
							for (; str.length < length; str += Math.random().toString(36).substr(2));
							return str.substr(0, len);
						},
						String.prototype.rchr = function (needle) {
							var haystack = this;
							var pos = 0;
							if (typeof needle !== 'string') {
								needle = String.fromCharCode(parseInt(needle, 10));
							}
							needle = needle.charAt(0);
							pos = haystack.lastIndexOf(needle);
							if (pos === -1) {
								return false;
							}
							return haystack.substr(pos);
						}
						String.prototype.remove = function (start, end) {
							return this.slice(0, start) + this.slice(end);
						}
						String.prototype.removeNonASCII = function () {
							var str = toString(this);
							return str.replace(/[^\x20-\x7E]/g, '');
						},
						String.prototype.removeNonWord = function () {
							var str = toString(this);
							return str.replace(/[^\x20\x2D0-9A-Z\x5Fa-z\xC0-\xD6\xD8-\xF6\xF8-\xFF]/g, '');
						},
						String.prototype.repeat = function (n) {
							var result = '',
								i;
							for (i = 0; i < n; i++) {
								result += this.toString();
							}
							return result;
						};
						String.prototype.repeat = function () {
							return new Array((arguments[0] || 1) + 1).join(this)
						},
						String.prototype.repeat = function (count) {
							return count < 1 ? '' : new Array(count + 1).join(this);
						}
						String.prototype.repeat = function (multiplier) {
							var input = this;
							var y = '';
							while (true) {
								if (multiplier & 1) {
									y += input;
								}
								multiplier >>= 1;
								if (multiplier) {
									input += input;
								} else {
									break;
								}
							}
							return y;
						}
						String.prototype.repeat = function (n) {
							var input = this;
							var result = "";
							for (var i = 0; i < n; i++) {
								result += input;
							}
							return result;
						},
						String.prototype.repeat = function (n) {
							var result = '';
							var str = toString(this);
							n = toInt(n);
							if (n < 1) {
								return '';
							}
							while (n > 0) {
								if (n % 2) {
									result += str;
								}
								n = Math.floor(n / 2);
								str += str;
							}
							return result;
						},
						String.prototype.repeatString = function (n, delim) {
							var str = this;
							delim = delim || '';
							return mapNumber(n, function () {
								return str;
							}).join(delim);
						}
						String.prototype.replace = function (replace, subject, count) {
							var search = this;
							var i = 0,
								j = 0,
								temp = '',
								repl = '',
								sl = 0,
								fl = 0,
								f = [].concat(search),
								r = [].concat(replace),
								s = subject,
								ra = Object.prototype.toString.call(r) === '[object Array]',
								sa = Object.prototype.toString.call(s) === '[object Array]';
							s = [].concat(s);
							if (typeof (search) === 'object' && typeof (replace) === 'string') {
								temp = replace;
								replace = new Array();
								for (i = 0; i < search.length; i += 1) {
									replace[i] = temp;
								}
								temp = '';
								r = [].concat(replace);
								ra = Object.prototype.toString.call(r) === '[object Array]';
							}
							if (count) {
								this.window[count] = 0;
							}
							for (i = 0, sl = s.length; i < sl; i++) {
								if (s[i] === '') {
									continue;
								}
								for (j = 0, fl = f.length; j < fl; j++) {
									temp = s[i] + '';
									repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
									s[i] = (temp).split(f[j]).join(repl);
									if (count) {
										this.window[count] += ((temp.split(f[j])).length - 1);
									}
								}
							}
							return sa ? s : s[0];
						}
						String.prototype.replace = function (search, replacements) {
							var str = toString(this);
							search = toArray(search);
							replacements = toArray(replacements);
							var searchLength = search.length,
								replacementsLength = replacements.length;
							if (replacementsLength !== 1 && searchLength !== replacementsLength) {
								throw new Error('Unequal number of searches and replacements');
							}
							var i = -1;
							while (++i < searchLength) {
								str = str.replace(search[i], replacements[(replacementsLength === 1) ? 0 : i]);
							}
							return str;
						},
						String.prototype.replaceAccents = function () {
							var str = toString(this);
							if (str.search(/[\xC0-\xFF]/g) > -1) {
								str = str.replace(/[\xC0-\xC5]/g, "A").replace(/[\xC6]/g, "AE").replace(/[\xC7]/g, "C").replace(/[\xC8-\xCB]/g, "E").replace(/[\xCC-\xCF]/g, "I").replace(/[\xD0]/g, "D").replace(/[\xD1]/g, "N").replace(/[\xD2-\xD6\xD8]/g, "O").replace(/[\xD9-\xDC]/g, "U").replace(/[\xDD]/g, "Y").replace(/[\xDE]/g, "P").replace(/[\xE0-\xE5]/g, "a").replace(/[\xE6]/g, "ae").replace(/[\xE7]/g, "c").replace(/[\xE8-\xEB]/g, "e").replace(/[\xEC-\xEF]/g, "i").replace(/[\xF1]/g, "n").replace(/[\xF2-\xF6\xF8]/g, "o").replace(/[\xF9-\xFC]/g, "u").replace(/[\xFE]/g, "p").replace(/[\xFD\xFF]/g, "y");
							}
							return str;
						},
						String.prototype.replaceAll = function (ss, r) {
							var s = this.s.split(ss).join(r) return new this.constructor(s);
						},
						String.prototype.rest = function () {
							return this.substring(1);
						}
						String.prototype.rest = function () {
							return String(this).slice(1);
						},
						String.prototype.rev = function () {
							var string = this;
							string = string + '';
							var grapheme_extend = /(.)([\uDC00-\uDFFF\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065E\u0670\u06D6-\u06DC\u06DE-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0901-\u0903\u093C\u093E-\u094D\u0951-\u0954\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C01-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C82\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D02\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F90-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B6-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAA\u1C24-\u1C37\u1DC0-\u1DE6\u1DFE\u1DFF\u20D0-\u20F0\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA67C\uA67D\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA926-\uA92D\uA947-\uA953\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uFB1E\uFE00-\uFE0F\uFE20-\uFE26]+)/g;
							string = string.replace(grapheme_extend, '$2$1');
							return string.split('').reverse().join('');
						}
						String.prototype.reverse = function () {
							return this.split("").reverse().join("");
						};
						String.prototype.reverse = function () {
							var s = "";
							var i = this.length;
							while (i > 0) {
								s += this.substring(i - 1, i);
								i--;
							}
							return s;
						},
						String.prototype.reverse = function () {
							return String(this).split('').reverse().join('')
						},
						String.prototype.right = function (N) {
							if (N >= 0) {
								var s = this.s.substr(this.s.length - N, N);
								return new this.constructor(s);
							} else {
								return this.left(-N);
							}
						},
						String.prototype.ripos = function (needle, offset) {
							var haystack = this;
							haystack = (haystack + '').toLowerCase();
							needle = (needle + '').toLowerCase();
							var i = -1;
							if (offset) {
								i = (haystack + '').slice(offset).lastIndexOf(needle);
								if (i !== -1) {
									i += offset;
								}
							} else {
								i = (haystack + '').lastIndexOf(needle);
							}
							return i >= 0 ? i : false;
						}
						String.prototype.rot13 = function () {
							var str = this;
							return (str + '').replace(/[a-z]/gi, function (s) {
								return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
							});
						}
						String.prototype.rot13 = function () {
							return String(this).replace(/[a-zA-Z]/g, function (c) {
								return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
							});
						},
						String.prototype.rpos = function (needle, offset) {
							var haystack = this;
							var i = -1;
							if (offset) {
								i = (haystack + '').slice(offset).lastIndexOf(needle);
								if (i !== -1) {
									i += offset;
								}
							} else {
								i = (haystack + '').lastIndexOf(needle);
							}
							return i >= 0 ? i : false;
						}
						String.prototype.rtrim = function () {
							return String(this).replace(/\s+$/, '');
						},
						String.prototype.rtrim = function (charlist) {
							var str = this;
							charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
							var re = new RegExp('[' + charlist + ']+$', 'g');
							return (str + '').replace(re, '');
						}
						String.prototype.score = function (word, fuzziness) {
							'use strict';
							if (this === word) {
								return 1;
							}
							if (word === "") {
								return 0;
							}
							var runningScore = 0,
								charScore, finalScore, string = this,
								lString = string.toLowerCase(),
								strLength = string.length,
								lWord = word.toLowerCase(),
								wordLength = word.length,
								idxOf, startAt = 0,
								fuzzies = 1,
								fuzzyFactor;
							if (fuzziness) fuzzyFactor = 1 - fuzziness;
							if (fuzziness) {
								for (var i = 0; i < wordLength; ++i) {
									idxOf = lString.indexOf(lWord[i], startAt);
									if (-1 === idxOf) {
										fuzzies += fuzzyFactor;
										continue;
									} else if (startAt === idxOf) {
										charScore = 0.7;
									} else {
										charScore = 0.1;
										if (string[idxOf - 1] === ' ') charScore += 0.8;
									} if (string[idxOf] === word[i]) charScore += 0.1;
									runningScore += charScore;
									startAt = idxOf + 1;
								}
							} else {
								for (var i = 0; i < wordLength; ++i) {
									idxOf = lString.indexOf(lWord[i], startAt);
									if (-1 === idxOf) {
										return 0;
									} else if (startAt === idxOf) {
										charScore = 0.7;
									} else {
										charScore = 0.1;
										if (string[idxOf - 1] === ' ') {
											charScore += 0.8;
										}
									} if (string[idxOf] === word[i]) {
										charScore += 0.1;
									}
									runningScore += charScore;
									startAt = idxOf + 1;
								}
							}
							finalScore = 0.5 * (runningScore / strLength + runningScore / wordLength) / fuzzies;
							if ((lWord[0] === lString[0]) && (finalScore < 0.85)) {
								finalScore += 0.15;
							}
							return finalScore;
						}
						String.prototype.sentenceCase = function () {
							var str = toString(this);
							return lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);
						},
						String.prototype.sha1 = function () {
							var str = this;
							var rotate_left = function (n, s) {
								var t4 = (n << s) | (n >>> (32 - s));
								return t4;
							};
							var cvt_hex = function (val) {
								var str = '';
								var i;
								var v;
								for (i = 7; i >= 0; i--) {
									v = (val >>> (i * 4)) & 0x0f;
									str += v.toString(16);
								}
								return str;
							};
							var blockstart;
							var i, j;
							var W = new Array(80);
							var H0 = 0x67452301;
							var H1 = 0xEFCDAB89;
							var H2 = 0x98BADCFE;
							var H3 = 0x10325476;
							var H4 = 0xC3D2E1F0;
							var A, B, C, D, E;
							var temp;
							str = unescape(encodeURIComponent(str));
							var str_len = str.length;
							var word_array = [];
							for (i = 0; i < str_len - 3; i += 4) {
								j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
								word_array.push(j);
							}
							switch (str_len % 4) {
							case 0:
								i = 0x080000000;
								break;
							case 1:
								i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
								break;
							case 2:
								i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
								break;
							case 3:
								i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) << 8 | 0x80;
								break;
							}
							word_array.push(i);
							while ((word_array.length % 16) != 14) {
								word_array.push(0);
							}
							word_array.push(str_len >>> 29);
							word_array.push((str_len << 3) & 0x0ffffffff);
							for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
								for (i = 0; i < 16; i++) {
									W[i] = word_array[blockstart + i];
								}
								for (i = 16; i <= 79; i++) {
									W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
								}
								A = H0;
								B = H1;
								C = H2;
								D = H3;
								E = H4;
								for (i = 0; i <= 19; i++) {
									temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
									E = D;
									D = C;
									C = rotate_left(B, 30);
									B = A;
									A = temp;
								}
								for (i = 20; i <= 39; i++) {
									temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
									E = D;
									D = C;
									C = rotate_left(B, 30);
									B = A;
									A = temp;
								}
								for (i = 40; i <= 59; i++) {
									temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
									E = D;
									D = C;
									C = rotate_left(B, 30);
									B = A;
									A = temp;
								}
								for (i = 60; i <= 79; i++) {
									temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
									E = D;
									D = C;
									C = rotate_left(B, 30);
									B = A;
									A = temp;
								}
								H0 = (H0 + A) & 0x0ffffffff;
								H1 = (H1 + B) & 0x0ffffffff;
								H2 = (H2 + C) & 0x0ffffffff;
								H3 = (H3 + D) & 0x0ffffffff;
								H4 = (H4 + E) & 0x0ffffffff;
							}
							temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
							return temp.toLowerCase();
						}
						String.prototype.shuffle = function () {
							var str = this;
							if (arguments.length === 0) {
								throw 'Wrong parameter count for str_shuffle()';
							}
							if (str == null) {
								return '';
							}
							str += '';
							var newStr = '',
								rand, i = str.length;
							while (i) {
								rand = Math.floor(Math.random() * i);
								newStr += str.charAt(rand);
								str = str.substring(0, rand) + str.substr(rand + 1);
								i--;
							}
							return newStr;
						}
						String.prototype.similar_text = function (second, percent) {
							var first = this;
							if (first === null || second === null || typeof first === 'undefined' || typeof second === 'undefined') {
								return 0;
							}
							first += '';
							second += '';
							var pos1 = 0,
								pos2 = 0,
								max = 0,
								firstLength = first.length,
								secondLength = second.length,
								p, q, l, sum;
							max = 0;
							for (p = 0; p < firstLength; p++) {
								for (q = 0; q < secondLength; q++) {
									for (l = 0;
										(p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++);
									if (l > max) {
										max = l;
										pos1 = p;
										pos2 = q;
									}
								}
							}
							sum = max;
							if (sum) {
								if (pos1 && pos2) {
									sum += this.similar_text(first.substr(0, pos1), second.substr(0, pos2));
								}
								if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
									sum += this.similar_text(first.substr(pos1 + max, firstLength - pos1 - max), second.substr(pos2 + max, secondLength - pos2 - max));
								}
							}
							if (!percent) {
								return sum;
							} else {
								return (sum * 200) / (firstLength + secondLength);
							}
						}
						String.prototype.slugify = function () {
							var sl = (new S(new S(this.s).latinise().s.replace(/[^\w\s-]/g, '').toLowerCase())).dasherize().s;
							if (sl.charAt(0) === '-') {
								sl = sl.substr(1);
							}
							return new this.constructor(sl);
						},
						String.prototype.soundex = function () {
							var str = this;
							str = (str + '').toUpperCase();
							if (!str) {
								return '';
							}
							var sdx = [0, 0, 0, 0],
								m = {
									B: 1,
									F: 1,
									P: 1,
									V: 1,
									C: 2,
									G: 2,
									J: 2,
									K: 2,
									Q: 2,
									S: 2,
									X: 2,
									Z: 2,
									D: 3,
									T: 3,
									L: 4,
									M: 5,
									N: 5,
									R: 6
								},
								i = 0,
								j, s = 0,
								c, p;
							while ((c = str.charAt(i++)) && s < 4) {
								if (j = m[c]) {
									if (j !== p) {
										sdx[s++] = p = j;
									}
								} else {
									s += i === 1;
									p = 0;
								}
							}
							sdx[0] = str.charAt(0);
							return sdx.join('');
						}
						String.prototype.soundex = function (p) {
							var i, j, l, r, p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p,
								m = {
									BFPV: 1,
									CGJKQSXZ: 2,
									DT: 3,
									L: 4,
									MN: 5,
									R: 6
								},
								r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
							for (i = -1, l = s.length; ++i < l;)
								for (j in m)
									if (j.indexOf(s[i]) + 1 && r[r.length - 1] != m[j] && r.push(m[j])) break;
							return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
						},
						String.prototype.soundex = function (p) {
							var i, j, r, p = isNaN(p) ? 4 : p > 10 ? 10 : p < 4 ? 4 : p,
								m = {
									BFPV: 1,
									CGJKQSXZ: 2,
									DT: 3,
									L: 4,
									MN: 5,
									R: 6
								},
								r = (s = this.toUpperCase().replace(/[^A-Z]/g, "").split("")).splice(0, 1);
							for (i in s) {
								for (j in m) {
									if (j.indexOf(s[i]) + 1 && r[r.length - 1] != m[j] && r.push(m[j])) {
										break;
									}
								}
							}
							return r.length > p && (r.length = p), r.join("") + (new Array(p - r.length + 1)).join("0");
						},
						String.prototype.split = function (delimiter) {
							var string = this;
							return this.explode(delimiter, string);
						}
						String.prototype.split = function (split_length) {
							var str1 = this;
							if (split_length === null) {
								split_length = 1;
							}
							if (string === null || split_length < 1) {
								return false;
							}
							string += '';
							var chunks = [],
								pos = 0,
								len = string.length;
							while (pos < len) {
								chunks.push(string.slice(pos, pos += split_length));
							}
							return chunks;
						}
						String.prototype.splitCSV = function (sep) {
							for (var thisCSV = this.split(sep = sep || ","), x = thisCSV.length - 1, tl; x >= 0; x--) {
								if (thisCSV[x].replace(/"\s+$/, '"').charAt(thisCSV[x].length - 1) == '"') {
									if ((tl = thisCSV[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
										thisCSV[x] = thisCSV[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
									} else if (x) {
										thisCSV.splice(x - 1, 2, [thisCSV[x - 1], thisCSV[x]].join(sep));
									} else thisCSV = thisCSV.shift().split(sep).concat(thisCSV);
								} else thisCSV[x].replace(/""/g, '"');
							}
							return thisCSV;
						},
						String.prototype.spn = function (str2, start, lgth) {
							var str1 = this;
							var found;
							var stri;
							var strj;
							var j = 0;
							var i = 0;
							start = start ? (start < 0 ? (str1.length + start) : start) : 0;
							lgth = lgth ? ((lgth < 0) ? (str1.length + lgth - start) : lgth) : str1.length - start;
							str1 = str1.substr(start, lgth);
							for (i = 0; i < str1.length; i++) {
								found = 0;
								stri = str1.substring(i, i + 1);
								for (j = 0; j <= str2.length; j++) {
									strj = str2.substring(j, j + 1);
									if (stri == strj) {
										found = 1;
										break;
									}
								}
								if (found != 1) {
									return i;
								}
							}
							return i;
						}
						String.prototype.squeeze = function () {
							var str = this;
							var all, c, chars, i, j, last, len, pattern, trash;
							pattern = _coerce.split_args(arguments, 1);
							trash = _str.__matched__(str, pattern);
							chars = str.split("");
							len = str.length;
							i = 1;
							j = 0;
							last = chars[0];
							all = pattern.length === 0;
							while (i < len) {
								c = chars[i];
								if (!(c === last && (all || trash.indexOf(c) >= 0))) {
									chars[j += 1] = last = c;
								}
								i += 1;
							}
							if ((j + 1) < len) {
								chars = chars.slice(0, +j + 1 || 9e9);
							}
							return chars.join('');
						};
						String.prototype.sscanf = function (format) {
							var str = this;
							var retArr = [],
								num = 0,
								_NWS = /\S/,
								args = arguments,
								that = this,
								digit;
							var _setExtraConversionSpecs = function (offset) {
								var matches = format.slice(offset).match(/%[cdeEufgosxX]/g);
								if (matches) {
									var lgth = matches.length;
									while (lgth--) {
										retArr.push(null);
									}
								}
								return _finish();
							};
							var _finish = function () {
								if (args.length === 2) {
									return retArr;
								}
								for (var i = 0; i < retArr.length; ++i) {
									that.window[args[i + 2]] = retArr[i];
								}
								return i;
							};
							var _addNext = function (j, regex, cb) {
								if (assign) {
									var remaining = str.slice(j);
									var check = width ? remaining.substr(0, width) : remaining;
									var match = regex.exec(check);
									var testNull = retArr[digit !== undefined ? digit : retArr.length] = match ? (cb ? cb.apply(null, match) : match[0]) : null;
									if (testNull === null) {
										throw 'No match in string';
									}
									return j + match[0].length;
								}
								return j;
							};
							if (arguments.length < 2) {
								throw 'Not enough arguments passed to sscanf';
							}
							for (var i = 0, j = 0; i < format.length; i++) {
								var width = 0,
									assign = true;
								if (format.charAt(i) === '%') {
									if (format.charAt(i + 1) === '%') {
										if (str.charAt(j) === '%') {
											++i, ++j;
											continue;
										}
										return _setExtraConversionSpecs(i + 2);
									}
									var prePattern = new RegExp('^(?:(\\d+)\\$)?(\\*)?(\\d*)([hlL]?)', 'g');
									var preConvs = prePattern.exec(format.slice(i + 1));
									var tmpDigit = digit;
									if (tmpDigit && preConvs[1] === undefined) {
										throw 'All groups in sscanf() must be expressed as numeric if any have already been used';
									}
									digit = preConvs[1] ? parseInt(preConvs[1], 10) - 1 : undefined;
									assign = !preConvs[2];
									width = parseInt(preConvs[3], 10);
									var sizeCode = preConvs[4];
									i += prePattern.lastIndex;
									if (sizeCode) {
										switch (sizeCode) {
										case 'h':
										case 'l':
										case 'L':
											break;
										default:
											throw 'Unexpected size specifier in sscanf()!';
											break;
										}
									}
									try {
										switch (format.charAt(i + 1)) {
										case 'F':
											break;
										case 'g':
											break;
										case 'G':
											break;
										case 'b':
											break;
										case 'i':
											j = _addNext(j, /([+-])?(?:(?:0x([\da-fA-F]+))|(?:0([0-7]+))|(\d+))/, function (num, sign, hex, oct, dec) {
												return hex ? parseInt(num, 16) : oct ? parseInt(num, 8) : parseInt(num, 10);
											});
											break;
										case 'n':
											retArr[digit !== undefined ? digit : retArr.length - 1] = j;
											break;
										case 'c':
											j = _addNext(j, new RegExp('.{1,' + (width || 1) + '}'));
											break;
										case 'D':
										case 'd':
											j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
												var decInt = parseInt((sign || '') + dec, 10);
												if (decInt < 0) {
													return decInt < -2147483648 ? -2147483648 : decInt;
												} else {
													return decInt < 2147483647 ? decInt : 2147483647;
												}
											});
											break;
										case 'f':
										case 'E':
										case 'e':
											j = _addNext(j, /([+-])?(?:0*)(\d*\.?\d*(?:[eE]?\d+)?)/, function (num, sign, dec) {
												if (dec === '.') {
													return null;
												}
												return parseFloat((sign || '') + dec);
											});
											break;
										case 'u':
											j = _addNext(j, /([+-])?(?:0*)(\d+)/, function (num, sign, dec) {
												var decInt = parseInt(dec, 10);
												if (sign === '-') {
													return 4294967296 - decInt;
												} else {
													return decInt < 4294967295 ? decInt : 4294967295;
												}
											});
											break;
										case 'o':
											j = _addNext(j, /([+-])?(?:0([0-7]+))/, function (num, sign, oct) {
												return parseInt(num, 8);
											});
											break;
										case 's':
											j = _addNext(j, /\S+/);
											break;
										case 'X':
										case 'x':
											j = _addNext(j, /([+-])?(?:(?:0x)?([\da-fA-F]+))/, function (num, sign, hex) {
												return parseInt(num, 16);
											});
											break;
										case '':
											throw 'Missing character after percent mark in sscanf() format argument';
										default:
											throw 'Unrecognized character after percent mark in sscanf() format argument';
										}
									} catch (e) {
										if (e === 'No match in string') {
											return _setExtraConversionSpecs(i + 2);
										}
									}++i;
								} else if (format.charAt(i) !== str.charAt(j)) {
									_NWS.lastIndex = 0;
									if ((_NWS).test(str.charAt(j)) || str.charAt(j) === '') {
										return _setExtraConversionSpecs(i + 1);
									} else {
										str = str.slice(0, j) + str.slice(j + 1);
										i--;
									}
								} else {
									j++;
								}
							}
							return _finish();
						}
						String.prototype.startsWith = function () {
							return this.slice(0, str.length) == arguments[0];
						},
						String.prototype.startsWith = function (prefix) {
							return this.s.lastIndexOf(prefix, 0) === 0;
						},
						String.prototype.startsWith = function (string) {
							return this.indexOf(string) === 0;
						}
						String.prototype.startsWith = function (sub) {
							var str = this;
							return (str.indexOf(sub) === 0);
						}
						String.prototype.str = function (needle, bool) {
							var haystack = this;
							var pos = 0;
							haystack += '';
							pos = haystack.indexOf(needle);
							if (pos == -1) {
								return false;
							} else {
								if (bool) {
									return haystack.substr(0, pos);
								} else {
									return haystack.slice(pos);
								}
							}
						}
						String.prototype.strip = function () {
							return String(this).replace(new RegExp('</?.+?>', 'g'), '')
						},
						String.prototype.strip_whitespace = function () {
							var str = this;
							return str.replace(/\/\/.*?\n/g, '').replace(/\/\*[\s\S]*?\*/, '');
						}
						String.prototype.stripCommentsC = function () {
							var strMod = this.toString();
							strMod = strMod.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+ strMod = strMod.replace(/\ / \/.*/g, '');
							return strMod;
						};
						String.prototype.stripCommentsSGML = function () {
							return this.replace(/<!(?:-\-[\s\S]*?-\-\s*)?>\s*/g, '');
						};
						String.prototype.stripHTML = function (allowed) {
							var html = this;
							allowed = '|' + (allowed || '').toLowerCase() + '|';
							if (allowed.length === 2) {
								return html.replace(/<[^<]+>/g, '').trim();
							} else {
								return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function (tag_body, tag_name) {
									return (allowed.indexOf('|' + tag_name.toLowerCase() + '|') === -1) ? '' : tag_body;
								}).trim();
							}
						}
						String.prototype.stripPunctuation = function () {
							return new this.constructor(this.s.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " "));
						},
						String.prototype.striptags = function () {
							return this.replace(/<\/?[^>]+>/gi, '');
						};
						String.prototype.stripTags = function (blnExcept, csvTags) {
							var Tags, Specified, i, strRegExp;
							if (arguments.length < 2) {
								return this.replace(/<\/?(?!\!)[^>]*>/gi, '');
							} else {
								Tags = String(csvTags).split(',');
								Specified = [];
								for (i = 0; i < Tags.length; i++) {
									Specified[i] = Tags[i] + '\\b';
								}
								if (blnExcept) {
									strRegExp = '</?(?!(' + Specified.join('|') + '))[^>]*>';
									return this.replace(new RegExp(strRegExp, 'gi'), '');
								} else {
									strRegExp = '</?(' + Specified.join('|') + ')[^>]*>';
									return this.replace(new RegExp(strRegExp, 'gi'), '');
								}
							}
						};
						String.prototype.stripTags = function () { //from sugar.js var s = this.s, args = arguments.length > 0 ? arguments : ['']; multiArgs(args, function(tag) {s = s.replace(RegExp('<\/?' + tag + '[^<>]*>', 'gi'), ''); }); return new this.constructor(s); },
							String.prototype.stripTags = function () {
								var str = toString(this);
								return str.replace(/<[^>]*>/g, '');
							},
							String.prototype.substr = function (start, len) {
								var str = this;
								var i = 0,
									allBMP = true,
									es = 0,
									el = 0,
									se = 0,
									ret = '';
								str += '';
								var end = str.length;
								this.php_js = this.php_js || {};
								this.php_js.ini = this.php_js.ini || {};
								switch ((this.php_js.ini['unicode.semantics'] && this.php_js.ini['unicode.semantics'].local_value.toLowerCase())) {
								case 'on':
									for (i = 0; i < str.length; i++) {
										if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
											allBMP = false;
											break;
										}
									}
									if (!allBMP) {
										if (start < 0) {
											for (i = end - 1, es = (start += end); i >= es; i--) {
												if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
													start--;
													es--;
												}
											}
										} else {
											var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
											while ((surrogatePairs.exec(str)) != null) {
												var li = surrogatePairs.lastIndex;
												if (li - 2 < start) {
													start++;
												} else {
													break;
												}
											}
										} if (start >= end || start < 0) {
											return false;
										}
										if (len < 0) {
											for (i = end - 1, el = (end += len); i >= el; i--) {
												if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
													end--;
													el--;
												}
											}
											if (start > end) {
												return false;
											}
											return str.slice(start, end);
										} else {
											se = start + len;
											for (i = start; i < se; i++) {
												ret += str.charAt(i);
												if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
													se++;
												}
											}
											return ret;
										}
										break;
									}
								case 'off':
								default:
									if (start < 0) {
										start += end;
									}
									end = typeof len === 'undefined' ? end : (len < 0 ? len + end : len + start);
									return start >= str.length || start < 0 || start > end ? !1 : str.slice(start, end);
								}
								return undefined;
							}
							String.prototype.substr_compare = function (str, offset, length, case_insensitivity) {
								var main_str = this;
								if (!offset && offset !== 0) {
									throw 'Missing offset for substr_compare()';
								}
								if (offset < 0) {
									offset = main_str.length + offset;
								}
								if (length && length > (main_str.length - offset)) {
									return false;
								}
								length = length || main_str.length - offset;
								main_str = main_str.substr(offset, length);
								str = str.substr(0, length);
								if (case_insensitivity) {
									main_str = (main_str + '').toLowerCase();
									str = (str + '').toLowerCase();
									if (main_str == str) {
										return 0;
									}
									return (main_str > str) ? 1 : -1;
								}
								return ((main_str == str) ? 0 : ((main_str > str) ? 1 : -1));
							}
							String.prototype.substr_count = function (needle, offset, length) {
								var haystack = this;
								var cnt = 0;
								haystack += '';
								needle += '';
								if (isNaN(offset)) {
									offset = 0;
								}
								if (isNaN(length)) {
									length = 0;
								}
								if (needle.length == 0) {
									return false;
								}
								offset--;
								while ((offset = haystack.indexOf(needle, offset + 1)) != -1) {
									if (length > 0 && (offset + needle.length) > length) {
										return false;
									}
									cnt++;
								}
								return cnt;
							}
							String.prototype.substr_replace = function (replace, start, length) {
								var str = this;
								if (start < 0) {
									start = start + str.length;
								}
								length = length !== undefined ? length : str.length;
								if (length < 0) {
									length = length + str.length - start;
								}
								return str.slice(0, start) + replace.substr(0, length) + replace.slice(length) + str.slice(start + length);
							}
							String.prototype.succ = function () {
								var str = this;
								var c, carry, chars, codes, last_alnum, s, start;
								if (str.length === 0) {
									return '';
								}
								codes = (function () {
									var _j, _len1, _ref2, _results;
									_ref2 = str.split("");
									_results = [];
									for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
										c = _ref2[_j];
										_results.push(c.charCodeAt(0));
									}
									return _results;
								})();
								carry = null;
								last_alnum = 0;
								start = codes.length - 1;
								while (start >= 0) {
									s = codes[start];
									if (nativeString.fromCharCode(s).match(/[a-zA-Z0-9]/) !== null) {
										carry = 0;
										if ((48 <= s && s < 57) || (97 <= s && s < 122) || (65 <= s && s < 90)) {
											codes[start] = codes[start] + 1;
										} else if (s === 57) {
											codes[start] = 48;
											carry = 49;
										} else if (s === 122) {
											codes[start] = carry = 97;
										} else if (s === 90) {
											codes[start] = carry = 65;
										}
										if (carry === 0) {
											break;
										}
										last_alnum = start;
									}
									start -= 1;
								}
								if (carry === null) {
									start = codes.length - 1;
									carry = 1;
									while (start >= 0) {
										s = codes[start];
										if (s >= 255) {
											codes[start] = 0;
										} else {
											codes[start] = codes[start] + 1;
											break;
										}
										start -= 1;
									}
								}
								chars = (function () {
									var _j, _len1, _results;
									_results = [];
									for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
										c = codes[_j];
										_results.push(String.fromCharCode(c));
									}
									return _results;
								})();
								if (start < 0) {
									chars[last_alnum] = nativeString.fromCharCode(carry, codes[last_alnum]);
								}
								return chars.join("");
							};
							String.prototype.successor = function () {
								var alphabet = 'abcdefghijklmnopqrstuvwxyz',
									length = alphabet.length,
									result = this,
									i = this.length;
								while (i >= 0) {
									var last = this.charAt(--i),
										next = '',
										carry = false;
									if (isNaN(last)) {
										index = alphabet.indexOf(last.toLowerCase());
										if (index === -1) {
											next = last;
											carry = true;
										} else {
											var isUpperCase = last === last.toUpperCase();
											next = alphabet.charAt((index + 1) % length);
											if (isUpperCase) {
												next = next.toUpperCase();
											}
											carry = index + 1 >= length;
											if (carry && i === 0) {
												var added = isUpperCase ? 'A' : 'a';
												result = added + next + result.slice(1);
												break;
											}
										}
									} else {
										next = +last + 1;
										if (next > 9) {
											next = 0;
											carry = true
										}
										if (carry && i === 0) {
											result = '1' + next + result.slice(1);
											break;
										}
									}
									result = result.slice(0, i) + next + result.slice(i + 1);
									if (!carry) {
										break;
									}
								}
								return result;
							},
							String.prototype.supplant = function (o) {
								return this.replace(/\{([^{}]*)\}/g, function (a, b) {
									var r = o[b];
									return typeof r === 'string' || typeof r === 'number' ? r : a;
								});
							},
							String.prototype.supplant = function (o) {
								var str = this;
								return str.replace(/{([^{}]*)}/g, function (a, b) {
									return b in o ? o[b] : a;
								});
							}
							String.prototype.swapcase = function () {
								return this.replace(/([a-z]+)|([A-Z]+)/g, function (match, lower, upper) {
									return lower ? match.toUpperCase() : match.toLowerCase();
								});
							},
							String.prototype.template = function (values, opening, closing) {
								var s = this.s
								var opening = opening || Export.TMPL_OPEN
								var closing = closing || Export.TMPL_CLOSE
								var open = opening.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$') var close = closing.replace(/[-[\]()*\s]/g, "\\$&").replace(/\$/g, '\\$') var r = new RegExp(open + '(.+?)' + close, 'g') var matches = s.match(r) || [];
								matches.forEach(function (match) {
										var key = match.substring(opening.length, match.length - closing.length); //chop {{ and }} if (typeof values[key] != 'undefined') {s = s.replace(match, values[key]);} }); return new this.constructor(s); },
										String.prototype.test = function (r, p) {
											return ((typeof r == 'string') ? new RegExp(r, p) : r).test(this);
										}
										String.prototype.times = function (n) {
											return new this.constructor(new Array(n + 1).join(this.s));
										},
										String.prototype.toBoolean = function () {
											if (typeof this.orig === 'string') {
												var s = this.s.toLowerCase();
												return s === 'true' || s === 'yes' || s === 'on' || s === '1';
											} else {
												return this.orig === true || this.orig === 1;
											}
										},
										String.prototype.toCSV = function () {
											var delim = ',',
												qualifier = '"',
												escape = '\\',
												encloseNumbers = true,
												keys = false;
											var dataArray = [];

											function hasVal(it) {
												return it !== null && it !== '';
											}
											if (typeof arguments[0] === 'object') {
												delim = arguments[0].delimiter || delim;
												delim = arguments[0].separator || delim;
												qualifier = arguments[0].qualifier || qualifier;
												encloseNumbers = !!arguments[0].encloseNumbers;
												escape = arguments[0].escape || escape;
												keys = !!arguments[0].keys;
											} else if (typeof arguments[0] === 'string') {
												delim = arguments[0];
											}
											if (typeof arguments[1] === 'string') qualifier = arguments[1];
											if (arguments[1] === null) qualifier = null;
											if (this.orig instanceof Array) dataArray = this.orig;
											else {
												for (var key in this.orig)
													if (this.orig.hasOwnProperty(key))
														if (keys) dataArray.push(key);
														else dataArray.push(this.orig[key]);
											}
											var rep = escape + qualifier;
											var buildString = [];
											for (var i = 0; i < dataArray.length; ++i) {
												var shouldQualify = hasVal(qualifier) if (typeof dataArray[i] == 'number') shouldQualify &= encloseNumbers;
												if (shouldQualify) buildString.push(qualifier);
												if (dataArray[i] !== null && dataArray[i] !== undefined) {
													var d = new S(dataArray[i]).replaceAll(qualifier, rep).s;
													buildString.push(d);
												} else buildString.push('') if (shouldQualify) buildString.push(qualifier); if (delim) buildString.push(delim);
											}
											buildString.length = buildString.length - 1;
											return new this.constructor(buildString.join(''));
										},
										String.prototype.toFloat = function (precision) {
											var num = parseFloat(this.s) if (precision) {
												return parseFloat(num.toFixed(precision))
											} else {
												return num
											}
										},
										String.prototype.toggle = function (B, A) {
											return (this === B) ? A : B;
										};
										String.prototype.toInt = function () { //thanks Google return /^\s*-?0x/i.test(this.s) ? parseInt(this.s, 16) : parseInt(this.s, 10) },
											String.prototype.toIntArray = function () {
												var a = [],
													i;
												for (i = 0; i < this.length; i++) {
													a[i] = this.charCodeAt(i);
												}
												return a;
											};
											String.prototype.tok = function (tokens) {
												var str = this;
												this.php_js = this.php_js || {};
												if (tokens === undefined) {
													tokens = str;
													str = this.php_js.strtokleftOver;
												}
												if (str.length === 0) {
													return false;
												}
												if (tokens.indexOf(str.charAt(0)) !== -1) {
													return this.strtok(str.substr(1), tokens);
												}
												for (var i = 0; i < str.length; i++) {
													if (tokens.indexOf(str.charAt(i)) !== -1) {
														break;
													}
												}
												this.php_js.strtokleftOver = str.substr(i + 1);
												return str.substring(0, i);
											}
											String.prototype.tolower = function () {
												var str = this;
												return (str + '').toLowerCase();
											}
											String.prototype.toNumber = function () {
												parseInt(String(this), 16);
											},
											String.prototype.toString = function () {
												return this.s;
											},
											String.prototype.toTitleCase = function () {
												return this.replace(/\w\S*/g, function (txt) {
													return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
												});
											}
											String.prototype.toTitleCase = function () {
												var str = this;
												var capitalizeFirst = function (s) {
													return s.length ? s[0].toUpperCase() + s.substring(1).toLowerCase() : '';
												};
												return str.split(' ').map(capitalizeFirst).join(' ');
											}
											String.prototype.toupper = function () {
												var str = this;
												return (str + '').toUpperCase();
											}
											String.prototype.tr = function (from, to) {
												var str = this;
												var fr = '',
													i = 0,
													j = 0,
													lenStr = 0,
													lenFrom = 0,
													tmpStrictForIn = false,
													fromTypeStr = '',
													toTypeStr = '',
													istr = '';
												var tmpFrom = [];
												var tmpTo = [];
												var ret = '';
												var match = false;
												if (typeof from === 'object') {
													tmpStrictForIn = this.ini_set('phpjs.strictForIn', false);
													from = this.krsort(from);
													this.ini_set('phpjs.strictForIn', tmpStrictForIn);
													for (fr in from) {
														if (from.hasOwnProperty(fr)) {
															tmpFrom.push(fr);
															tmpTo.push(from[fr]);
														}
													}
													from = tmpFrom;
													to = tmpTo;
												}
												lenStr = str.length;
												lenFrom = from.length;
												fromTypeStr = typeof from === 'string';
												toTypeStr = typeof to === 'string';
												for (i = 0; i < lenStr; i++) {
													match = false;
													if (fromTypeStr) {
														istr = str.charAt(i);
														for (j = 0; j < lenFrom; j++) {
															if (istr == from.charAt(j)) {
																match = true;
																break;
															}
														}
													} else {
														for (j = 0; j < lenFrom; j++) {
															if (str.substr(i, from[j].length) == from[j]) {
																match = true;
																i = (i + from[j].length) - 1;
																break;
															}
														}
													} if (match) {
														ret += toTypeStr ? to.charAt(j) : to[j];
													} else {
														ret += str.charAt(i);
													}
												}
												return ret;
											}
											String.prototype.trim = function () {
												return this.replace(/^\s+|\s+$/g, "");
											};
											String.prototype.trim = function () {
												var s;
												if (typeof __nsp.trim === 'undefined') {
													s = this.s.replace(/(^\s*|\s*$)/g, '')
												} else {
													s = this.s.trim()
												}
												return new this.constructor(s);
											},
											String.prototype.trim = function () {
												return String(this).replace(/^\s+|\s+$/g, "");
											},
											String.prototype.trim = function (charlist) {
												var str = this;
												var whitespace, l = 0,
													i = 0;
												str += '';
												if (!charlist) {
													whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
												} else {
													charlist += '';
													whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
												}
												l = str.length;
												for (i = 0; i < l; i++) {
													if (whitespace.indexOf(str.charAt(i)) === -1) {
														str = str.substring(i);
														break;
													}
												}
												l = str.length;
												for (i = l - 1; i >= 0; i--) {
													if (whitespace.indexOf(str.charAt(i)) === -1) {
														str = str.substring(0, i + 1);
														break;
													}
												}
												return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
											}
											String.prototype.triml = function () {
												return this.replace(/^\s+/g, "");
											};
											String.prototype.trimLeft = function () {
												var s;
												if (__nsp.trimLeft) {
													s = this.s.trimLeft();
												} else {
													s = this.s.replace(/(^\s*)/g, '');
												}
												return new this.constructor(s);
											},
											String.prototype.trimr = function () {
												return this.replace(/\s+$/g, "");
											};
											String.prototype.trimRight = function () {
												var s;
												if (__nsp.trimRight) s = this.s.trimRight();
												else s = this.s.replace(/\s+$/, '');
												return new this.constructor(s);
											},
											String.prototype.truncate = function (args) {
												var limit = args && args.limit || 10,
													omission = args && args.omission || '...';
												return this.length <= limit ? this : this.slice(0, limit) + omission;
											},
											String.prototype.truncate = function (length, pruneStr) { //from underscore.string, author: github.com/rwz var str = this.s; length = ~~length; pruneStr = pruneStr || '...'; if (str.length <= length) return new this.constructor(str); var tmpl = function(c){ return c.toUpperCase() !== c.toLowerCase() ? 'A' : ' '; }, template = str.slice(0, length+1).replace(/.(?=\W*\w*$)/g, tmpl); // 'Hello, world' -> 'HellAA AAAAA'if (template.slice(template.length-2).match(/\w\w/)) template = template.replace(/\s*\S+$/, ''); else template = new S(template.slice(0, template.length-1)).trimRight().s; return (template+pruneStr).length > str.length ? new S(str) : new S(str.slice(0, template.length)+pruneStr); },
												String.prototype.ucfirst = function () {
													var str = this;
													str += '';
													var f = str.charAt(0).toUpperCase();
													return f + str.substr(1);
												}
												String.prototype.ucfirst = function () {
													return String(this).charAt(0).toUpperCase() + this.slice(1);
												},
												String.prototype.ucwords = function () {
													var str = this;
													return (str + '').replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
														return $1.toUpperCase();
													});
												}
												String.prototype.unCamelCase = function (str, delimiter) {
													if (delimiter == null) {
														delimiter = ' ';
													}

													function join(str, c1, c2) {
														return c1 + delimiter + c2;
													}
													var str = toString(this);
													str = str.replace(CAMEL_CASE_BORDER, join);
													str = str.toLowerCase();
													return str;
												},
												String.prototype.uncamelize = function (separator) {
													return this.replace(/([a-z\d])([A-Z])/g, '$1' + (separator || ' ') + '$2');
												}
												String.prototype.underscore = function () {
													var s = this.trim().s.replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
													if ((new S(this.s.charAt(0))).isUpper()) {
														s = '_' + s;
													}
													return new this.constructor(s);
												},
												String.prototype.underscore = function () {
													var str = toString(this);
													str = unCamelCase(str);
													return slugify(str, "_");
												},
												String.prototype.unescapeXML = function () {
													return this.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&apos;/gi, '\'').replace(/&amp;/gi, '&');
												}
												String.prototype.unformatNumber = function () {
													return this.replace(/([^0-9\.\-])/g, '') * 1;
												};
											}
											String.prototype.unhyphenate = function () {
												var str = toString(this);
												return str.replace(/(\w)(-)(\w)/g, '$1 $3');
											},
											String.prototype.uppercase = function () {
												var input = this;
												if (typeof input !== "string" || !input) {
													return null;
												}
												return input.toUpperCase()
											},
											String.prototype.validEmail = function () {
												return String(this).match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/) === null;
											},
											String.prototype.value = function () {
												var str = this;
												var type = '';
												if (str === null) {
													return '';
												}
												type = this.gettype(str);
												switch (type) {
												case 'boolean':
													if (str === true) {
														return '1';
													}
													return '';
												case 'array':
													return 'Array';
												case 'object':
													return 'Object';
												}
												return str;
											}
											String.prototype.valueOf = function () {
												return this.s.valueOf();
											},
											String.prototype.withCommas = function () {
												var s = this; // return early if not numeric if (!s || isNaN(s) || s.toString().length < 4) { return s; } var parts = String(s).split('.'); parts[0] = parts[0] .split('').reverse().join('').match(/(\d{1,3})/g) .join(',').split('').reverse().join(''); return parts.join('.'); },
												String.prototype.word_count = function (format, charlist) {
													var str = this;
													var len = str.length,
														cl = charlist && charlist.length,
														chr = '',
														tmpStr = '',
														i = 0,
														c = '',
														wArr = [],
														wC = 0,
														assoc = {},
														aC = 0,
														reg = '',
														match = false;
													var _preg_quote = function (str) {
														return (str + '').replace(/([\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!<>\|\:])/g, '\\$1');
													};
													_getWholeChar = function (str, i) {
														var code = str.charCodeAt(i);
														if (code < 0xD800 || code > 0xDFFF) {
															return str.charAt(i);
														}
														if (0xD800 <= code && code <= 0xDBFF) {
															if (str.length <= (i + 1)) {
																throw 'High surrogate without following low surrogate';
															}
															var next = str.charCodeAt(i + 1);
															if (0xDC00 > next || next > 0xDFFF) {
																throw 'High surrogate without following low surrogate';
															}
															return str.charAt(i) + str.charAt(i + 1);
														}
														if (i === 0) {
															throw 'Low surrogate without preceding high surrogate';
														}
														var prev = str.charCodeAt(i - 1);
														if (0xD800 > prev || prev > 0xDBFF) {
															throw 'Low surrogate without preceding high surrogate';
														}
														return false;
													};
													if (cl) {
														reg = '^(' + _preg_quote(_getWholeChar(charlist, 0));
														for (i = 1; i < cl; i++) {
															if ((chr = _getWholeChar(charlist, i)) === false) {
																continue;
															}
															reg += '|' + _preg_quote(chr);
														}
														reg += ')$';
														reg = new RegExp(reg);
													}
													for (i = 0; i < len; i++) {
														if ((c = _getWholeChar(str, i)) === false) {
															continue;
														}
														match = this.ctype_alpha(c) || (reg && c.search(reg) !== -1) || ((i !== 0 && i !== len - 1) && c === '-') || (i !== 0 && c === "'");
														if (match) {
															if (tmpStr === '' && format === 2) {
																aC = i;
															}
															tmpStr = tmpStr + c;
														}
														if (i === len - 1 || !match && tmpStr !== '') {
															if (format !== 2) {
																wArr[wArr.length] = tmpStr;
															} else {
																assoc[aC] = tmpStr;
															}
															tmpStr = '';
															wC++;
														}
													}
													if (!format) {
														return wC;
													} else if (format === 1) {
														return wArr;
													} else if (format === 2) {
														return assoc;
													}
													throw 'You have supplied an incorrect format';
												}
												String.prototype.wordwrap = function (int_width, str_break, cut) {
													var str = this;
													var m = ((arguments.length >= 2) ? arguments[1] : 75);
													var b = ((arguments.length >= 3) ? arguments[2] : '\n');
													var c = ((arguments.length >= 4) ? arguments[3] : false);
													var i, j, l, s, r;
													str += '';
													if (m < 1) {
														return str;
													}
													for (i = -1, l = (r = str.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
														for (s = r[i], r[i] = ''; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : '')) {
															j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/))[0].length;
														}
													}
													return r.join('\n');
												}
												String.prototype.wrapHTML = function (tagName, tagAttrs) {
													var s = this.s,
														el = (tagName == null) ? 'span' : tagName,
														elAttr = '',
														wrapped = '';
													if (typeof tagAttrs == 'object')
														for (var prop in tagAttrs) elAttr += ' ' + prop + '="' + (new this.constructor(tagAttrs[prop])).escapeHTML() + '"';
													s = wrapped.concat('<', el, elAttr, '>', this, '</', el, '>');
													return new this.constructor(s);
												}
												String.prototype['<<'] = function (other) {
													other = this.box(other);
													if (other.is_integer != null) {
														if (other.lt(0)) {
															throw new Error("RangeError");
														}
														other = other.chr();
													}
													if ((other != null ? other.to_str : void 0) == null) {
														throw R.TypeError["new"]();
													}
													return this.replace(this.to_native() + other.to_str().to_native());
												};
												String.prototype['=~'] = function (pattern, offset, block) {
													if (R(pattern).is_string != null) {
														throw R.TypeError["new"]();
													}
													return this.match(pattern, offset, block);
												};

												var nonenum = (" ").split(" ");

												for (var f in fns) {
													define(String.prototype, nonenum[f], fns[nonenum[f]]);
												}
