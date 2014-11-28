function Base64() {}


Base64.prototype.decode = function(data) {

	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		dec = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data += '';

	do {
		h1 = b64.indexOf(data.charAt(i++));
		h2 = b64.indexOf(data.charAt(i++));
		h3 = b64.indexOf(data.charAt(i++));
		h4 = b64.indexOf(data.charAt(i++));

		bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

		o1 = bits >> 16 & 0xff;
		o2 = bits >> 8 & 0xff;
		o3 = bits & 0xff;

		if (h3 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1);
		} else if (h4 == 64) {
			tmp_arr[ac++] = String.fromCharCode(o1, o2);
		} else {
			tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
		}
	} while (i < data.length);

	dec = tmp_arr.join('');

	return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
}
Base64.prototype.encode = function(data) {


	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
		ac = 0,
		enc = '',
		tmp_arr = [];

	if (!data) {
		return data;
	}

	data = unescape(encodeURIComponent(data));

	do {
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	var r = data.length % 3;

	return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}


function QuotedPrintable() {}



QuotedPrintable.prototype.decode = function(str) {
	var RFC2045Decode1 = /=\r\n/gm,
		RFC2045Decode2IN = /=([0-9A-F]{2})/gim,
		RFC2045Decode2OUT = function (sMatch, sHex) {
			return String.fromCharCode(parseInt(sHex, 16));
		};
	return str.replace(RFC2045Decode1, '')
		.replace(RFC2045Decode2IN, RFC2045Decode2OUT);
}
QuotedPrintable.prototype.encode = function(str) {
	var hexChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
		RFC2045Encode1IN = / \r\n|\r\n|[^!-<>-~ ]/gm,
		RFC2045Encode1OUT = function (sMatch) {
			if (sMatch.length > 1) {
				return sMatch.replace(' ', '=20');
			}
			var chr = sMatch.charCodeAt(0);
			return '=' + hexChars[((chr >>> 4) & 15)] + hexChars[(chr & 15)];
		};
	RFC2045Encode2IN = /.{1,72}(?!\r\n)[^=]{0,3}/g,
	RFC2045Encode2OUT = function (sMatch) {
		if (sMatch.substr(sMatch.length - 2) === '\r\n') {
			return sMatch;
		}
		return sMatch + '=\r\n';
	};
	str = str.replace(RFC2045Encode1IN, RFC2045Encode1OUT)
		.replace(RFC2045Encode2IN, RFC2045Encode2OUT);
	return str.substr(0, str.length - 3);
}




function UTF8() {}

UTF8.prototype.decode = function(str_data) {

	var tmp_arr = [],
		i = 0,
		c1 = 0,
		seqlen = 0;

	str_data += '';

	while (i < str_data.length) {
		c1 = str_data.charCodeAt(i) & 0xFF;
		seqlen = 0;
		if (c1 <= 0xBF) {
			c1 = (c1 & 0x7F);
			seqlen = 1;
		} else if (c1 <= 0xDF) {
			c1 = (c1 & 0x1F);
			seqlen = 2;
		} else if (c1 <= 0xEF) {
			c1 = (c1 & 0x0F);
			seqlen = 3;
		} else {
			c1 = (c1 & 0x07);
			seqlen = 4;
		}

		for (var ai = 1; ai < seqlen; ++ai) {
			c1 = ((c1 << 0x06) | (str_data.charCodeAt(ai + i) & 0x3F));
		}

		if (seqlen == 4) {
			c1 -= 0x10000;
			tmp_arr.push(String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF)), String.fromCharCode(0xDC00 | (c1 & 0x3FF)));
		} else {
			tmp_arr.push(String.fromCharCode(c1));
		}

		i += seqlen;
	}

	return tmp_arr.join("");
}
UTF8.prototype.encode = function(argString) {

	if (argString === null || typeof argString === 'undefined') {
		return '';
	}
	var string = (argString + '');
	var utftext = '',
		start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode(
				(c1 >> 6) | 192, (c1 & 63) | 128
			);
		} else if ((c1 & 0xF800) != 0xD800) {
			enc = String.fromCharCode(
				(c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		} else {
			if ((c1 & 0xFC00) != 0xD800) {
				throw new RangeError('Unmatched trail surrogate at ' + n);
			}
			var c2 = string.charCodeAt(++n);
			if ((c2 & 0xFC00) != 0xDC00) {
				throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
			}
			c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
			enc = String.fromCharCode(
				(c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
			);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
}



var Unicode = function() {};
Unicode.escape = function(str, shouldEscapePrintable){
	str = toString(str);
	return str.replace(/[\s\S]/g, function(ch){
		// skip printable ASCII chars if we should not escape them
		if (!shouldEscapePrintable && (/[\x20-\x7E]/).test(ch)) {
			return ch;
		}
		// we use "000" and slice(-4) for brevity, need to pad zeros,
		// unicode escape always have 4 chars after "\u"
		return '\\u'+ ('000'+ ch.charCodeAt(0).toString(16)).slice(-4);
	});
}

Unicode.unescape = function(str){
	str = toString(str);
	return str.replace(/\\u[0-9a-f]{4}/g, function(ch){
		var code = parseInt(ch.slice(2), 16);
		return String.fromCharCode(code);
	});
}
