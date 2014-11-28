
function isNumber(n) {return !isNaN(parseFloat(n)) && isFinite(n)}

function toNumber(val){
	if (typeof val === 'number') return val;
	if (!val) return 0;
	if (typeof val === 'string') return parseFloat(val);
	if (isArray(val)) return NaN;
	return Number(val);
}
var hasOwnProperty = {}.hasOwnProperty
Math.isNear = function(target, threshold) {
	var val = this;
	return (Math.abs(val - target) <= threshold);
}
Math.even = function (n) {
	return (typeof n === 'number' && n % 2 === 0);
};
Math.odd = function (n) {
	return (typeof n === 'number' && n % 2 === 1);
};

Math.even = function (n) {
	return (typeof n === 'number' && n % 2 === 0);
};
Math.odd = function (n) {
	return (typeof n === 'number' && n % 2 === 1);
};
Math.inRange = function(min, max, threshold){
	var val = this;
	threshold = threshold || 0;
	return (val + threshold >= min && val - threshold <= max);
}
var MAX_INT = 2147483647;
var MAX_SAFE_INTEGER = 9007199254740991;
var MAX_UINT = 4294967295;
var MIN_INT = -2147483648;

Math.acosh = function(arg) {return Math.log(arg + Math.sqrt(arg * arg - 1)); }
Math.asinh = function(arg) {return Math.log(arg + Math.sqrt(arg * arg + 1)); }
Math.atanh = function(arg) {return 0.5 * Math.log((1 + arg) / (1 - arg)); }
Math.base_convert = function(number, frombase, tobase) {return parseInt(number + '', frombase | 0).toString(tobase | 0); }
Math.bindec = function(binary_string) {binary_string = (binary_string + '').replace(/[^01]/gi, ''); return parseInt(binary_string, 2); }
Math.ceil = function(step) {var val = this; step = Math.abs(step || 1); return Math.ceil(val / step) * step; }
Math.ceil = function(value) {return Math.ceil(value); }
Math.clamp = function(min, max) {var val = this; return val < min? min : (val > max? max : val); }
Math.clamp = function(x, lower, upper) {lower = lower !== undefined ? lower : 0; upper = upper !== undefined ? upper : 1; return Math.max(lower, Math.min(upper, x)); };
Math.cosh = function(arg) {return (Math.exp(arg) + Math.exp(-arg)) / 2; }
Math.countSteps = function(step, overflow){var val = Math.floor(this / step); if (overflow) {return val % overflow; } return val; }
Math.decbin = function(number) {if (number < 0) {number = 0xFFFFFFFF + number + 1; } return parseInt(number, 10).toString(2); }
Math.dechex = function(number) {if (number < 0) {number = 0xFFFFFFFF + number + 1; } return parseInt(number, 10).toString(16); }
Math.decoct = function(number) {if (number < 0) {number = 0xFFFFFFFF + number + 1; } return parseInt(number, 10).toString(8); }
Math.deg2rad = function(angle) {return angle * .017453292519943295; }
Math.distance = function(lat1,lon1,lat2,lon2) {var R = 6371; var dLat = (lat2-lat1) * Math.PI / 180; var dLon = (lon2-lon1) * Math.PI / 180; var a = Math.sin(dLat/2) 				* Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) 	* Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) 				* Math.sin(dLon/2); var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); var d = R * c; if (d>1) {return Math.round(d)+"km";} else if (d<=1) {return Math.round(d*1000)+"m";} return d; }
Math.dotProduct = function(a, b) {var i, ret, _i, _ref; ret = 0; for (i = _i = 0, _ref = a.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {ret += a[i] * b[i]; } return ret; };
Math.expm1 = function(x) {return (x < 1e-5 && -1e-5 < x) ? x + 0.5 * x * x : Math.exp(x) - 1; }
Math.factorial = function (n) {var f = 1; if (typeof n !== 'number' || (n % 1) !== 0) {f = null; } else if (n > 1) {for (var i = 2; i <= n; i++) {f = f * i; } } return f; };
Math.floor = function(step){var val = this; step = Math.abs(step || 1); return Math.floor(val / step) * step; }
Math.fmod = function(x, y) {var tmp, tmp2, p = 0, pY = 0, l = 0.0, l2 = 0.0; tmp = x.toExponential().match(/^.\.?(.*)e(.+)$/); p = parseInt(tmp[2], 10) - (tmp[1] + '').length; tmp = y.toExponential().match(/^.\.?(.*)e(.+)$/); pY = parseInt(tmp[2], 10) - (tmp[1] + '').length; if (pY > p) {p = pY; } tmp2 = (x % y); if (p < -100 || p > 20) {l = Math.round(Math.log(tmp2) / Math.log(10)); l2 = Math.pow(10, l); return (tmp2 / l2).toFixed(l - p) * l2; } else {return parseFloat(tmp2.toFixed(-p)); } }
Math.hexdec = function(hex_string) {hex_string = (hex_string + '').replace(/[^a-f0-9]/gi, ''); return parseInt(hex_string, 16); }
Math.hypot = function(x, y) {x = Math.abs(x); y = Math.abs(y); var t = Math.min(x, y); x = Math.max(x, y); t = t / x; return x * Math.sqrt(1 + t * t) || null; }
Math.interval = function(str, step) {if (!step) {step = 1;} var re = new RegExp(/([\(\[])(\d+)\.\.(\d+)([\)\]])/); // can't deal with negative numbers var m = re.exec(str); var reverse = false; var low = parseInt(m[2]); //m[2].parseInt(); if (m[1] === "(") {low++;} var high = parseInt(m[3]); //m[3].parseInt(); if (m[4] === "]") {high++;} if (low === high) {return [high];} if (low > high) {high = [low, low = high][0]; reverse = true; } var range = []; for(var i = low; i < high; i+=step) {range.push(i); } return (reverse === true ? range.reverse() : range); }
Math.is_finite = function(val) {var warningType = ''; if (val === Infinity || val === -Infinity) {return false; } if (typeof val === 'object') {warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object'); } else if (typeof val === 'string' && !val.match(/^[\+\-]?\d/)) {warningType = 'string'; } if (warningType) {throw new Error('Warning: is_finite() expects parameter 1 to be double, ' + warningType + ' given'); } return true; }
Math.is_infinite = function(val) {var warningType = ''; if (val === Infinity || val === -Infinity) {return true; } if (typeof val === 'object') {warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object'); } else if (typeof val === 'string' && !val.match(/^[\+\-]?\d/)) {warningType = 'string'; } if (warningType) {throw new Error('Warning: is_infinite() expects parameter 1 to be double, ' + warningType + ' given'); } return false; }
Math.is_nan = function(val) {var warningType = ''; if (typeof val === 'number' && isNaN(val)) {return true; } if (typeof val === 'object') {warningType = (Object.prototype.toString.call(val) === '[object Array]' ? 'array' : 'object'); } else if (typeof val === 'string' && !val.match(/^[\+\-]?\d/)) {warningType = 'string'; } if (warningType) {throw new Error('Warning: is_nan() expects parameter 1 to be double, ' + warningType + ' given'); } return false; }
Math.lerp = function(ratio, start, end){return start + (end - start) * ratio; }
Math.log = function(arg, base) {return (typeof base === 'undefined') ? Math.log(arg) : Math.log(arg) / Math.log(base); }
Math.log10 = function(arg) {return Math.log(arg) / 2.302585092994046; }
Math.log1p = function(x) {var ret = 0, n = 50; if (x <= -1) {return '-INF'; } if (x < 0 || x > 1) {return Math.log(1 + x); } for (var i = 1; i < n; i++) {ret += Math.pow(-x, i) / i; } return -ret; }
Math.loop = function(min, max) {var val = this; return val < min? max : (val > max? min : val); }
Math.map = function(min1, max1, min2, max2) {var val = this; return Math.lerp( norm(val, min1, max1), min2, max2 ); }
Math.max = function() {var ar, retVal, i = 0, n = 0, argv = arguments, argc = argv.length, _obj2Array = function (obj) {if (Object.prototype.toString.call(obj) === '[object Array]') {return obj; } else {var ar = []; for (var i in obj) {if (obj.hasOwnProperty(i)) {ar.push(obj[i]); } } return ar; } }; _compare = function (current, next) {var i = 0, n = 0, tmp = 0, nl = 0, cl = 0; if (current === next) {return 0; } else if (typeof current === 'object') {if (typeof next === 'object') {current = _obj2Array(current); next = _obj2Array(next); cl = current.length; nl = next.length; if (nl > cl) {return 1; } else if (nl < cl) {return -1; } for (i = 0, n = cl; i < n; ++i) {tmp = _compare(current[i], next[i]); if (tmp == 1) {return 1; } else if (tmp == -1) {return -1; } } return 0; } return -1; } else if (typeof next === 'object') {return 1; } else if (isNaN(next) && !isNaN(current)) {if (current == 0) {return 0; } return (current < 0 ? 1 : -1); } else if (isNaN(current) && !isNaN(next)) {if (next == 0) {return 0; } return (next > 0 ? 1 : -1); } if (next == current) {return 0; } return (next > current ? 1 : -1); }; if (argc === 0) {throw new Error('At least one value should be passed to max()'); } else if (argc === 1) {if (typeof argv[0] === 'object') {ar = _obj2Array(argv[0]); } else {throw new Error('Wrong parameter count for max()'); } if (ar.length === 0) {throw new Error('Array must contain at least one element for max()'); } } else {ar = argv; } retVal = ar[0]; for (i = 1, n = ar.length; i < n; ++i) {if (_compare(retVal, ar[i]) == 1) {retVal = ar[i]; } } return retVal; }
Math.min = function() {var ar, retVal, i = 0, n = 0, argv = arguments, argc = argv.length, _obj2Array = function (obj) {if (Object.prototype.toString.call(obj) === '[object Array]') {return obj; } var ar = []; for (var i in obj) {if (obj.hasOwnProperty(i)) {ar.push(obj[i]); } } return ar; }; _compare = function (current, next) {var i = 0, n = 0, tmp = 0, nl = 0, cl = 0; if (current === next) {return 0; } else if (typeof current === 'object') {if (typeof next === 'object') {current = _obj2Array(current); next = _obj2Array(next); cl = current.length; nl = next.length; if (nl > cl) {return 1; } else if (nl < cl) {return -1; } for (i = 0, n = cl; i < n; ++i) {tmp = _compare(current[i], next[i]); if (tmp == 1) {return 1; } else if (tmp == -1) {return -1; } } return 0; } return -1; } else if (typeof next === 'object') {return 1; } else if (isNaN(next) && !isNaN(current)) {if (current == 0) {return 0; } return (current < 0 ? 1 : -1); } else if (isNaN(current) && !isNaN(next)) {if (next == 0) {return 0; } return (next > 0 ? 1 : -1); } if (next == current) {return 0; } return (next > current ? 1 : -1); }; if (argc === 0) {throw new Error('At least one value should be passed to min()'); } else if (argc === 1) {if (typeof argv[0] === 'object') {ar = _obj2Array(argv[0]); } else {throw new Error('Wrong parameter count for min()'); } if (ar.length === 0) {throw new Error('Array must contain at least one element for min()'); } } else {ar = argv; } retVal = ar[0]; for (i = 1, n = ar.length; i < n; ++i) {if (_compare(retVal, ar[i]) == -1) {retVal = ar[i]; } } return retVal; }
Math.modulo = function(dividend, divisor, both){while (dividend >= divisor){dividend -= divisor; } return (both ? [divident, divisor] || dividend; }
Math.nearest = function(num, factor) {if(typeof factor !== 'number') {factor = 1; } if(num === factor) {return num; } else {var result; var lowerBound,upperBound=0; while(upperBound<num) {upperBound += factor; } if(upperBound == num){result = upperBound; } else {lowerBound = upperBound-factor; if(num-lowerBound < upperBound-num) {result = lowerBound; } else {result = upperBound; } } return result; } }
Math.neighbors = function(k, n, i, c, s) {k = parseInt(k); n = parseInt(n) || 10; i = parseInt(i) || 1; c = parseInt(c) || 0; s = s || false; var r = []; if 		(k % n != 1) {if 	(k - (n+i)) > c) 			{r.push(parseInt(k)-(n+i));} if 	(k - i  	> c) 			{r.push(parseInt(k)-i);} if 	(k + (n-i)  < ((n*10)+i)) 	{r.push(parseInt(k)+(n-i));} } if 		(k % n != 0) {if 	(k - (n-i)  > c) 			{r.push(parseInt(k)-(n-i));} if 	(k + i  	< ((n*10)+i)) 	{r.push(parseInt(k)+i);} if 	(k + (n+i) 	< ((n*10)+i)) 	{r.push(parseInt(k)+(n+i));} } if 		(k - n 		> c) 			{r.push(parseInt(k)-n);} if 		(k + n 		< ((n*10)+i)) 	{r.push(parseInt(k)+n);} return (s === true ? r.sort(function(a,b){return a-b}) : r); }
Math.norm = function(min, max){var val = this; if (val < min || val > max) {throw new RangeError('value (' + val + ') must be between ' + min + ' and ' + max); } return val === max ? 1 : (val - min) / (max - min); }
Math.normsinv = function (p) {var a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00], b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01], c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00], d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00]; var plow = 0.02425, phigh = 1 - plow; var q, z, r, s = Math.sqrt, l = Math.log; if (p < plow) {q = s(-2 * l(p)); z = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); } else if (phigh < p) {q = s(-2 * l(1 - p)); z = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); } else {q = p - 0.5; r = q * q; z = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); } return +z; };
Math.octdec = function(oct_string) {oct_string = (oct_string + '').replace(/[^0-7]/gi, ''); return parseInt(oct_string, 8); }
Math.pi = function() {return 3.141592653589793; }
Math.polarToScalar = function(tuple) {var var1, var2, _C, _L, _h, _h_rad; _L = tuple[0], _C = tuple[1], _h = tuple[2]; _h_rad = _h / 360 * 2 * Math.PI; var1 = Math.cos(_h_rad) * _C; var2 = Math.sin(_h_rad) * _C; return [_L, var1, var2]; };
Math.precision = function(val, base) {val = Math.round(Math.abs(this)); return isNaN(val)? base : val; }
Math.product = function () {var a = arguments, l = a.length, p = 1; for (var i = 0; i < l; i++) {p = p * a[i]; } return p; };
Math.rad2deg = function(angle) {return angle * 57.29577951308232; }
Math.rolldice = function(n, h, l) {h = h || 6; l = 1 || 1; var r = 0; for (var i = 0; i < n; i++) {r += Math.random(l, h);} return r; }
Math.round = function(number, radix) {if (!radix) {return number >> 0;} return Math.round(number / radix) * radix; }
Math.round = function(value, precision, mode) {var m, f, isHalf, sgn; precision |= 0; m = Math.pow(10, precision); value *= m; sgn = (value > 0) | -(value < 0); isHalf = value % 1 === 0.5 * sgn; f = Math.floor(value); if (isHalf) {switch (mode) {case 'PHP_ROUND_HALF_DOWN': value = f + (sgn < 0); break; case 'PHP_ROUND_HALF_EVEN': value = f + (f % 2 * sgn); break; case 'PHP_ROUND_HALF_ODD': value = f + !(f % 2); break; default: value = f + (sgn > 0); } } return (isHalf ? value : Math.round(value)) / m; }
Math.scalarToPolar = function(tuple) {var var1, var2, _C, _L, _h, _h_rad; _L = tuple[0], var1 = tuple[1], var2 = tuple[2]; _C = Math.pow(Math.pow(var1, 2) + Math.pow(var2, 2), 1 / 2); _h_rad = Math.atan2(var2, var1); _h = _h_rad * 360 / 2 / Math.PI; if (_h < 0) {_h = 360 + _h; } return [_L, _C, _h]; };
Math.sinh = function(arg) {return (Math.exp(arg) - Math.exp(-arg)) / 2; }
Math.tanh = function(arg) {return 1 - 2 / (Math.exp(2 * arg) + 1); }

Math.toWindow = function() {
	var line =	function(x)	{return x}
	var sin = 	function(x)	{return Math.sin(x)}
	var cos = 	function(x)	{return Math.cos(x)}
	var tan = 	function(x)	{return Math.tan(x)}
	var asin = 	function(x)	{return Math.asin(x)}
	var acos = 	function(x)	{return Math.acos(x)}
	var atan = 	function(x)	{return Math.atan(x)}
	var sqrt = 	function(x)	{return Math.sqrt(x)}
	var abs = 	function(x)	{return Math.abs(x)}
	var ceil = 	function(x)	{return Math.ceil(x)}
	var floor = function(x)	{return Math.floor(x)}
	var e = 	function(x)	{return Math.pow(Math.E, x)}
	var z = 	function(x) {return (1/(2*Math.PI))*e(((-(x*x))/2))}
	for (var item in Math) {window.prototype[item] = item}
}

// fibonacci = function(n){return Math.round(Math.pow((Math.sqrt(5) + 1) / 2, Math.abs(n)) / Math.sqrt(5)) * (n < 0 && n % 2 ? -1 : 1);};
/* Version with fewer recursions */
// fibonacci = function(n){var o; return n < 2 ? n : n % 2 ? (o = fibonacci(n = -(-n >> 1))) * o + (o = fibonacci(n - 1)) * o : (fibonacci(n >>= 1) + 2 * fibonacci(n - 1)) * fibonacci(n);};
