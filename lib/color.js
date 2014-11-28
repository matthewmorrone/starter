String.prototype.list = function(dl) {return this.split((dl || " "));}

Color.prototype = {
	// toString : hex;
	_applyCombination: function(fn, args) {return fn.apply(null, [this].concat([].slice.call(args)));},
	_applyModification: function(fn, args) {var color = fn.apply(null, [this].concat([].slice.call(args))); this._r = color._r; this._g = color._g; this._b = color._b; this.setAlpha(color._a); return this; },
	_makeHSL: function () {if (typeof(this.hsl) == undef) { this.hsl = rgbToHSL(this.rgb); } },
	_makeRGB: function () {if (typeof(this.rgb) == undef) { this.rgb = hslToRGB(this.hsl); } },
	alpha : function(arg) {var clr = this.clr; if (arguments.length) {clr.a = arg; return this; } else {return clr.a; } },
	alpha: function(a) {if (arguments.length === 0) {return (this.hsl || this.rgb).a; } else {a = (a === null || a === undefined) ? undefined : parseFloat(a); if (this.hsl) {return new Color({h: this.hsl.h, s: this.hsl.s, l: this.hsl.l, a: a}); } else {return new Color({r: this.rgb.r, g: this.rgb.g, b: this.rgb.b, a: a}); } } },
	alpha: function(val) {if (val === undefined) return this.values.alpha;}this.setValues("alpha", val);return this;},
	analagous: function() {return [this, this.hue(this.hue() - 1/12), this.hue(this.hue() + 1/12) ]; },
	analogous: function() {return this._applyCombination(analogous, arguments);},
	black: function(val) {return this.setChannel("cmyk", 3, val);},
	blacken: function(ratio) {this.values.hwb[2] += this.values.hwb[2] * ratio; this.setValues("hwb", this.values.hwb); return this; },
	blackness: function(val) {return this.setChannel("hwb", 2, val);},
	blend: function (other, opacity) {if (typeof opacity == "undefined") opacity = 0.5; var thisOpacity = 1 - opacity; other = new Color(other); return new Color({r: Math.floor((this.red() * thisOpacity + other.red() * opacity)), g: Math.floor((this.green() * thisOpacity + other.green() * opacity)), b: Math.floor((this.blue() * thisOpacity + other.blue() * opacity)) }); },
	blue : function(arg) {var clr = this.clr; if (arguments.length) {clr.b = arg; this.clr = Util.normalize(clr); return this; } else {return Math.round(clr.b); } },
	blue: function(b) {this._makeRGB();return (typeof(b) == undef) ? this.rgb.b :new Color({r: this.rgb.r, g: this.rgb.g, b: parseInt(b, 10), a: this.rgb.a});},
	blue: function(val) {return this.setChannel("rgb", 2, val);},
	brighten: function() {return this._applyModification(brighten, arguments);},
	clearer: function(ratio) {this.setValues("alpha", this.values.alpha - (this.values.alpha * ratio)); return this; },
	clone: function() {return new Color(this.rgb()); },
	cmyk: function(vals) {return this.setSpace("cmyk", arguments);},
	cmykArray: function() {return this.values.cmyk;},
	complement : function() {var newColor = new Color(this.clr); newColor.hue((newColor.hue() + 180) % 360); return newColor; },
	complement: function() {return this._applyCombination(complement, arguments);},
	complement: function() {this._makeHSL(); return new Color({h: (this.hsl.h + 0.5) % 1.0, s: this.hsl.s, l: this.hsl.l, a: this.hsl.a }); },
	contrast : function(other) {other = new Color(other); var diff = Math.max(this.red(), other.red()) - Math.min(this.red(), other.red()) + Math.max(this.green(), other.green()) - Math.min(this.green(), other.green()) + Math.max(this.blue(), other.blue()) - Math.min(this.blue(), other.blue()); return diff / 765; },
	contrast: function(color2) {var lum1 = this.luminosity(); var lum2 = color2.luminosity(); if (lum1 > lum2) {return (lum1 + 0.05) / (lum2 + 0.05) }; return (lum2 + 0.05) / (lum1 + 0.05); },
	contrast: function(forDark, forLight) {return new Color((this.luma() > 0.6)? forLight || "#111" : forDark || "#eee"); },
	cyan: function(val) {return this.setChannel("cmyk", 0, val);},
	dark: function() {var rgb = this.values.rgb, yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000; return yiq < 128; },
	darken : function(percentage) {return this.shade_(-percentage);},
	darken: function() {return this._applyModification(darken, arguments);},
	darken: function(amount) {this._makeHSL(); return new Color({h: this.hsl.h, s: this.hsl.s, l: this.hsl.l * (1 - amount), a: this.hsl.a }); },
	darken: function(ratio) {this.values.hsl[2] -= this.values.hsl[2] * ratio; this.setValues("hsl", this.values.hsl); return this; },
	desaturate : function(percentage) {var p = percentage / 100; var newColor = new Color(this.clr); newColor.saturation(newColor.saturation() - p); return newColor; },
	desaturate: function() {return this._applyModification(desaturate, arguments);},
	desaturate: function() {this._makeHSL(); return new Color({h: this.hsl.h, s: 0, l: this.hsl.l, a: this.hsl.a }); },
	desaturate: function(ratio) {this.values.hsl[1] -= this.values.hsl[1] * ratio; this.setValues("hsl", this.values.hsl); return this; },
	equals : function(other) {var clr1 = this;var clr2 = other;if (arguments.length < 1) {return clr1 === clr2;}return clr1.red() === clr2.red() && clr1.green() === clr2.green() && clr1.blue() === clr2.blue() && clr1.alpha() === clr2.alpha();},
	fadeIn : function(percentage) {var p = percentage / 100; var newColor = new Color(this.clr); newColor.alpha(newColor.alpha() + p); return newColor; },
	fadeOut : function(percentage) {var p = percentage / 100; var newColor = new Color(this.clr); newColor.alpha(newColor.alpha() - p); return newColor; },
	getAlpha: function() {return this._a;},
	getBrightness: function() {var rgb = this.toRgb();return(rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;},
	getFormat: function() {return this._format;},
	getValues : function(space) {var vals = {}; for (var i = 0; i < space.length; i++) {vals[space[i]] = this.values[space][i]; } if (this.values.alpha != 1) {vals["a"] = this.values.alpha; } return vals; },
	gradient : function(other, n) {other = new Color(other); var gradient = []; var r = this.red(); var g = this.green(); var b = this.blue(); var dr = (other.red() - this.red()) / (n - 1); var dg = (other.green() - this.green()) / (n - 1); var db = (other.blue() - this.blue()) / (n - 1); for (var i = 0; i < n; i++) {gradient.push(new Color({r: r, g: g, b: b})); r += dr; g += dg; b += db; } return gradient; },
	grayscale : function() {return this.desaturate(100);},
	green : function(arg) {var clr = this.clr; if (arguments.length) {clr.g = arg; this.clr = Util.normalize(clr); return this; } else {return Math.round(clr.g); } },
	green: function(g) {this._makeRGB();return (typeof(g) == undef) ? this.rgb.g :new Color({r: this.rgb.r, g: parseInt(g, 10), b: this.rgb.b, a: this.rgb.a});},
	green: function(val) {return this.setChannel("rgb", 1, val);},
	greyscale: function() {return this._applyModification(greyscale, arguments);},
	greyscale: function() {var rgb = this.values.rgb; var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11; this.setValues("rgb", [val, val, val]); return this; },
	harmony : function(type, index) {index = typeof index === 'number' ? Math.abs(parseInt(index, 10)) : 0; var clrs = []; var hsv = Util.rgbToHsv(this.clr); var hues = [0, 180]; switch (type) {case 'analogous': 			hues = [0, 30, 60]; 		break; case 'triad': 				hues = [0, 120, 240];		break; case 'split-complementary': hues = [0, 150, 210]; 		break; case 'rectangle': 			hues = [0, 60, 180, 240]; 	break; case 'square': 				hues = [0, 90, 180, 270]; 	break; case 'complementary': 		hues = [0, 180]; 			break; } var n = hues.length; var offset = hues[index % n]; for (var i = 0; i < n; i++) {clrs.push(new Color({h: (hsv.h + hues[i] - offset) % 360, s:  hsv.s, v:  hsv.v, a: this.clr.a })); } return clrs; },
	hex : function() {var rString = ('0' + this.red().toString(16)).slice(-2);var gString = ('0' + this.green().toString(16)).slice(-2);var bString = ('0' + this.blue().toString(16)).slice(-2);return '#' + rString + gString + bString;},
	hexString: function() {return string.hexString(this.values.rgb);},
	hsl: function(vals) {return this.setSpace("hsl", arguments);},
	hslaArray: function() {var hsl = this.values.hsl;return hsl.concat([this.values.alpha]);},
	hslArray: function() {return this.values.hsl;},
	hslaString : function() {return 'hsla(' + this.hue() + ',' + this.saturation() + ',' + (Math.round(this.lightness()*100) / 100) + ',' + this.alpha() + ')';},
	hslaString: function() {return string.hslaString(this.values.hsl, this.values.alpha);},
	hslString : function() {return 'hsl(' + this.hue() + ',' + this.saturation() + ',' + (Math.round(this.lightness()*100) / 100) + ')';},
	hslString: function() {return string.hslString(this.values.hsl, this.values.alpha);},
	hsv: function(vals) {return this.setSpace("hsv", arguments);},
	hsvArray: function() {return this.values.hsv;},
	hue : function(arg) {var clr = Util.rgbToHsv(this.clr); if (arguments.length) {clr.h = arg; this.clr = Util.normalize({hsv: clr, a: this.clr.a}); return this; } else {return Math.round(clr.h); } },
	hue: function(h) {this._makeHSL();return (typeof(h) == undef) ? this.hsl.h :new Color({h: parseFloat(h), s: this.hsl.s, l: this.hsl.l, a: this.hsl.a});},
	hue: function(val) {return this.setChannel("hsl", 0, val);},
	hwb: function(vals) {return this.setSpace("hwb", arguments);},
	hwbArray: function() {if (this.values.alpha !== 1) return this.values.hwb.concat([this.values.alpha])}return this.values.hwb;},
	hwbString: function() {return string.hwbString(this.values.hwb, this.values.alpha);},
	invert: function() {this._makeRGB(); return new Color({r: 255 - this.rgb.r, g: 255 - this.rgb.g, b: 255 - this.rgb.b, a: this.rgb.a }); },
	isDark : function() {var yiq = ((this.red()*299)+(this.green()*587)+(this.blue()*144))/1000;return yiq < 131.5;},
	isDark: function() {return this.getBrightness() < 128;},
	isLight : function() {return !this.isDark();},
	isLight: function() {return !this.isDark();},
	isValid: function() {return this._ok;},
	keyword: function() {return string.keyword(this.values.rgb, this.values.alpha);},
	labObject : function() {return Util.rgbToLab(this.clr);},
	level: function(color2) {var contrastRatio = this.contrast(color2); return (contrastRatio >= 7.1) ? 'AAA': (contrastRatio >= 4.5) ? 'AA': ''; },
	light: function() {return !this.dark();},
	lighten : function(percentage) {return this.shade_(percentage);},
	lighten: function() {return this._applyModification(lighten, arguments);},
	lighten: function(amount) {this._makeHSL(); return new Color({h: this.hsl.h, s: this.hsl.s, l: this.hsl.l + (1 - this.hsl.l) * amount, a: this.hsl.a }); },
	lighten: function(ratio) {this.values.hsl[2] += this.values.hsl[2] * ratio; this.setValues("hsl", this.values.hsl); return this; },
	lightness : function(arg) {var clr = Util.rgbToHsl(this.clr); if (arguments.length) {clr.l = arg; this.clr = Util.normalize({hsl: clr, a: this.clr.a}); return this; } else {return clr.l; } },
	lightness: function(l) {this._makeHSL(); return (typeof(l) == undef) ? this.hsl.l : new Color({h: this.hsl.h, s: this.hsl.s, l: parseFloat(l), a: this.hsl.a}); },
	lightness: function(val) {return this.setChannel("hsl", 2, val);},
	luma : function() {return (0.2126 * this.red()) + (0.7152 * this.green()) + (0.0722 * this.blue());},
	luma: function() {var rgb = this.rgb;this._makeRGB();return  (0.3*rgb.r + 0.59*rgb.g + 0.11*rgb.b) / 255;},
	luminosity: function() {var rgb = this.values.rgb; var lum = []; for (var i = 0; i < rgb.length; i++) {var chan = rgb[i] / 255; lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4) } return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2]; },
	magenta: function(val) {return this.setChannel("cmyk", 1, val);},
	mix : function(other, percentage) {other = new Color(other); var p = arguments.length < 2 ? 0.5 : percentage / 100; return new Color({r: this.red() * (1 - p) + other.red() * p, g: this.green() * (1 - p) + other.green() * p, b: this.blue() * (1 - p) + other.blue() * p, a: this.alpha() * (1 - p) + other.alpha() * p }); },
	mix: function(color2, weight) {weight = 1 - (weight == null ? 0.5 : weight); var t1 = weight * 2 - 1, d = this.alpha() - color2.alpha(); var weight1 = (((t1 * d == -1) ? t1 : (t1 + d) / (1 + t1 * d)) + 1) / 2; var weight2 = 1 - weight1; var rgb = this.rgbArray(); var rgb2 = color2.rgbArray(); for (var i = 0; i < rgb.length; i++) {rgb[i] = rgb[i] * weight1 + rgb2[i] * weight2; } this.setValues("rgb", rgb); var alpha = this.alpha() * weight + color2.alpha() * (1 - weight); this.setValues("alpha", alpha); return this; },
	monochromatic: function() {return this._applyCombination(monochromatic, arguments);},
	negate : function() {var newColor = new Color(this.clr); newColor.red(255 - newColor.red()); newColor.green(255 - newColor.green()); newColor.blue(255 - newColor.blue()); return newColor; },
	negate: function() {var rgb = [] for (var i = 0; i < 3; i++) {rgb[i] = 255 - this.values.rgb[i]; } this.setValues("rgb", rgb); return this; },
	normalize = function(arg) {arg.a = arg.a || 1; var clr = arg; if (clr.hsv !== undefined) {clr = Color.hsvToRgb(clr.hsv); clr.a = arg.a; } else if (clr.hsl !== undefined) {clr = Color.hslToRgb(clr.hsl); clr.a = arg.a; } else if (clr.css !== undefined) {clr = Color.parseCss(clr.css); } else if (clr.lab !== undefined) {clr = Color.labToRgb(clr.lab); clr.a = arg.a; } clr.r = clr.red || clr.r; clr.g = clr.green || clr.g; clr.b = clr.blue || clr.b; clr.a = clr.alpha || clr.a; clr.r = Math.clamp(clr.r, 0, 255); clr.g = Math.clamp(clr.g, 0, 255); clr.b = Math.clamp(clr.b, 0, 255); clr.a = Math.clamp(clr.a, 0, 1); return clr; }
	opaquer: function(ratio) {this.setValues("alpha", this.values.alpha + (this.values.alpha * ratio)); return this; },
	parsePredefinedClr : function (string) {return new Color.fn(predefinedClrs[string]);},
	percentString: function() {return string.percentString(this.values.rgb, this.values.alpha);},
	random : function() {return new Color({r: Math.floor(Math.random() * 255),g: Math.floor(Math.random() * 255),b: Math.floor(Math.random() * 255)});},
	randomClrRange : function(percentage) {var adjustment = ((Math.random() * 2) - 1) * percentage; var newColor = new Color(this.clr); newColor = newColor.shade_(adjustment); return newColor; },
	rectTetrad: function() {return [this, this.hue(this.hue() + 1/6), this.hue(this.hue() + 3/6), this.hue(this.hue() + 4/6) ]; },
	red : function(arg) {var clr = this.clr; if (arguments.length) {clr.r = arg; this.clr = Util.normalize(clr); return this; } else {return Math.round(clr.r); } },
	red: function(r) {this._makeRGB();return (typeof(r) == undef) ? this.rgb.r :new Color({r: parseInt(r, 10), g: this.rgb.g, b: this.rgb.b, a: this.rgb.a});},
	red: function(val) {return this.setChannel("rgb", 0, val);},
	rgb: function (vals) {return this.setSpace("rgb", arguments);},
	rgbaArray: function() {var rgb = this.values.rgb;return rgb.concat([this.values.alpha]);},
	rgbArray: function() {return this.values.rgb;},
	rgbaString : function() {return 'rgba(' + this.red() + ',' + this.green() + ',' + this.blue() + ',' + this.alpha() + ')'; },
	rgbaString: function() {return string.rgbaString(this.values.rgb, this.values.alpha);},
	rgbNumber : function() {return (this.red() << 16) | (this.green() << 8) | (this.blue());},
	rgbString: function() {return string.rgbString(this.values.rgb, this.values.alpha);},
	rotate: function(degrees) {var hue = this.values.hsl[0]; hue = (hue + degrees) % 360; hue = hue < 0 ? 360 + hue : hue; this.values.hsl[0] = hue; this.setValues("hsl", this.values.hsl); return this; },
	saturate : function(percentage) {var p = percentage / 100; var newColor = new Color(this.clr); newColor.saturation(newColor.saturation() + p); return newColor; },
	saturate: function() {return this._applyModification(saturate, arguments);},
	saturate: function(ratio) {this.values.hsl[1] += this.values.hsl[1] * ratio; this.setValues("hsl", this.values.hsl); return this; },
	saturation : function(arg) {var clr = Util.rgbToHsl(this.clr); if (arguments.length) {clr.s = arg; this.clr = Util.normalize({hsl: clr, a: this.clr.a}); return this; } else {return clr.s; } },
	saturation: function(s) {this._makeHSL(); return (typeof(s) == undef) ? this.hsl.s : new Color({h: this.hsl.h, s: parseFloat(s), l: this.hsl.l, a: this.hsl.a}); },
	saturation: function(val) {return this.setChannel("hsl", 1, val);},
	saturationv : function(arg) {var clr = Util.rgbToHsv(this.clr); if (arguments.length) {clr.s = arg; this.clr = Util.normalize({hsv: clr, a: this.clr.a}); return this; } else {return clr.s; } },
	saturationv: function(val) {return this.setChannel("hsv", 1, val);},
	setAlpha: function(value) {this._a = boundAlpha(value);this._roundA = Math.round(100*this._a) / 100;return this;},
	setChannel : function(space, index, val) {if (val === undefined) {return this.values[space][index]; } this.values[space][index] = val; this.setValues(space, this.values[space]); return this; }
	setSpace : function(space, args) {var vals = args[0]; if (vals === undefined) {return this.getValues(space); } if (typeof vals == "number") {vals = Array.prototype.slice.call(args); } this.setValues(space, vals); return this; },
	setValues : function(space, vals) {var spaces = {"rgb": ["red", "green", "blue"], "hsl": ["hue", "saturation", "lightness"], "hsv": ["hue", "saturation", "value"], "hwb": ["hue", "whiteness", "blackness"], "cmyk": ["cyan", "magenta", "yellow", "black"] }; var maxes = {"rgb": [255, 255, 255], "hsl": [360, 100, 100], "hsv": [360, 100, 100], "hwb": [360, 100, 100], "cmyk": [100, 100, 100, 100] }; var alpha = 1; if (space == "alpha") {alpha = vals; } else if (vals.length) {this.values[space] = vals.slice(0, space.length); alpha = vals[space.length]; } else if (vals[space[0]] !== undefined) {for (var i = 0; i < space.length; i++) {this.values[space][i] = vals[space[i]]; } alpha = vals.a; } else if (vals[spaces[space][0]] !== undefined) {var chans = spaces[space]; for (var i = 0; i < space.length; i++) {this.values[space][i] = vals[chans[i]]; } alpha = vals.alpha; } this.values.alpha = Math.max(0, Math.min(1, (alpha !== undefined ? alpha : this.values.alpha) )); if (space == "alpha") {return; } for (var i = 0; i < space.length; i++) {var capped = Math.max(0, Math.min(maxes[space][i], this.values[space][i])); this.values[space][i] = Math.round(capped); } for (var sname in spaces) {if (sname != space) {this.values[sname] = convert[space][sname](this.values[space]) } for (var i = 0; i < sname.length; i++) {var capped = Math.max(0, Math.min(maxes[sname][i], this.values[sname][i])); this.values[sname][i] = Math.round(capped); } } return true; },
	shade_ : function(percentage) {var newColor = new Color(this.clr); newColor.lightness(newColor.lightness() + (percentage / 100)); return newColor; },
	spin: function() {return this._applyModification(spin, arguments);},
	splitcomplement: function() {return this._applyCombination(splitcomplement, arguments);},
	splitComplementary: function() {return [this, this.hue(this.hue() - 5/12), this.hue(this.hue() + 5/12) ]; },
	stoplight : function(x, a)    {var v = x / 10 + .5;var r = Math.round(510 * (1 - v)),g = Math.round(510 * v),b = 0,a = a || 1;if (r > 255) {r = 255;}if (g > 255) {g = 255;}return new Color({r: r, g: g, b: b, a: a});}
	tetrad: function() {return this._applyCombination(tetrad, arguments);}
	tetrad: function() {var hue = this.hue(); return [this, this.hue(hue + 1/4), this.hue(hue + 2/4), this.hue(hue + 3/4) ]; },
	toFilter: function(secondColor) {var hex8String = '#' + rgbaToHex(this._r, this._g, this._b, this._a); var secondHex8String = hex8String; var gradientType = this._gradientType ? "GradientType = 1, " : ""; if(secondColor) {var s = tinycolor(secondColor); secondHex8String = s.toHex8String(); } return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")"; },
	toHex8: function() {return rgbaToHex(this._r, this._g, this._b, this._a);},
	toHex8String: function() {return '#' + this.toHex8();},
	toHex: function(allow3Char) {return rgbToHex(this._r, this._g, this._b, allow3Char);},
	toHexString: function() {this._makeRGB();return rgbToHex(this.rgb);},
	toHexString: function(allow3Char) {return '#' + this.toHex(allow3Char);},
	toHsl: function() {var hsl = rgbToHsl(this._r, this._g, this._b); return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a }; },
	toHSLString: function() {this._makeHSL();return hslToCSSHSL(this.hsl);}
	toHslString: function() {var hsl = rgbToHsl(this._r, this._g, this._b); var h = Math.round(hsl.h * 360), s = Math.round(hsl.s * 100), l = Math.round(hsl.l * 100); return(this._a == 1) ? "hsl("  + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")"; },
	toHsv: function() {var hsv = rgbToHsv(this._r, this._g, this._b);return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };},
	toHsvString: function() {var hsv = rgbToHsv(this._r, this._g, this._b); var h = Math.round(hsv.h * 360), s = Math.round(hsv.s * 100), v = Math.round(hsv.v * 100); return(this._a == 1) ? "hsv("  + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")"; },
	toJSON: function() {return this.rgb(); },
	toName: function() {if(this._a === 0) {return "transparent"; } if(this._a < 1) {return false; } return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false; },
	toName: function(color) {var i = null,colors = this.names;color = this.toArray(color);for(i in colors) {if(colors.hasOwnProperty(i)) {if(color[0] === colors[i][0] && color[1] === colors[i][1] && color[2] === colors[i][2]) {return i;}}}return false;},
	toPercentageRgb: function() {return { r: Math.round(bound01(this._r, 255) * 100) + "%", g: Math.round(bound01(this._g, 255) * 100) + "%", b: Math.round(bound01(this._b, 255) * 100) + "%", a: this._a };},
	toPercentageRgbString: function() {return(this._a == 1) ?"rgb("  + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" :"rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";},
	toRgb: function() {return { r: Math.round(this._r), g: Math.round(this._g), b: Math.round(this._b), a: this._a };},
	toRgbString: function() {return(this._a == 1) ?"rgb("  + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" :"rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";},
	toRGBString: function() {this._makeRGB();return rgbToCSSRGB(this.rgb);},
	toString: function() {return this.toHexString();},
	toString: function(format) {var formatSet = !!format; format = format || this._format; var formattedString = false; var hasAlpha = this._a < 1 && this._a >= 0; var needsAlphaFormat = !formatSet && hasAlpha &&(format === "hex" || format === "hex6" || format === "hex3" || format === "name"); if(needsAlphaFormat) {if(format === "name" && this._a === 0) {return this.toName();} return this.toRgbString(); } if(format === "rgb") {formattedString = this.toRgbString();} if(format === "prgb") {formattedString = this.toPercentageRgbString();} if(format === "hex" || format === "hex6") {formattedString = this.toHexString();} if(format === "hex3") {formattedString = this.toHexString(true);} if(format === "hex8") {formattedString = this.toHex8String();} if(format === "name") {formattedString = this.toName();} if(format === "hsl") {formattedString = this.toHslString();} if(format === "hsv") {formattedString = this.toHsvString();} return formattedString || this.toHexString();},
	triad: function() {return [this, this.hue(this.hue() - 1/3), this.hue(this.hue() + 1/3) ]; },
	triad: function() {return this._applyCombination(triad, arguments);},
	value : function(arg) {var clr = Util.rgbToHsv(this.clr); if (arguments.length) {clr.v = arg; this.clr = Util.normalize({hsv: clr, a: this.clr.a}); return this; } else {return clr.v; } },
	value: function(val) {return this.setChannel("hsv", 2, val);},
	whiten: function(ratio) {this.values.hwb[1] += this.values.hwb[1] * ratio; this.setValues("hwb", this.values.hwb); return this; },
	whiteness: function(val) {return this.setChannel("hwb", 1, val);},
	yellow: function(val) {return this.setChannel("cmyk", 2, val);},

};

function Color() {

	var color = this;
	var r = 0, g = 0, b = 0, a = 1;
	var args = Array.prototype.slice.call(arguments);
	var PHI = 0.618033988749895;

	function Construct(arg) {

		this.values = {
			rgb: [0, 0, 0],
			hsl: [0, 0, 0],
			hsv: [0, 0, 0],
			hwb: [0, 0, 0],
			cmyk: [0, 0, 0, 0],
			alpha: 1
		}
		if (arg === null || arg === undefined) {throw new TypeError('Color argument must be defined.');}
		if (arg instanceof Color) {return arg;}

		var cssString = arguments[0];

		if (typeof cssString === "string") {
			var vals = string.getRgba(cssString);
			if (vals) {this.setValues("rgb", vals);}
			else if(vals = string.getHsla(cssString)) {this.setValues("hsl", vals);}
			else if(vals = string.getHwb(cssString)) {this.setValues("hwb", vals);}
			else {throw new Error("Unable to parse color from string " + cssString);}

			if (arg.toLowerCase() in predefinedClrs) {
				return Color.parsePredefinedClr(arg);
			}
			this.clr = Color.normalize({css: arg});
		}
		if (typeof cssString === "object") {
			var vals = cssString;
			if 		(vals["r"] !== undefined || vals["red"] 		!== undefined) {this.setValues("rgb", vals)}
			else if (vals["l"] !== undefined || vals["lightness"] 	!== undefined) {this.setValues("hsl", vals)}
			else if (vals["v"] !== undefined || vals["value"] 		!== undefined) {this.setValues("hsv", vals)}
			else if (vals["w"] !== undefined || vals["whiteness"] 	!== undefined) {this.setValues("hwb", vals)}
			else if (vals["c"] !== undefined || vals["cyan"] 		!== undefined) {this.setValues("cmyk", vals)}
			else {throw new Error("Unable to parse color from object " + JSON.stringify(cssString));}
		}
		if (typeof arg === 'object') {
			if (arg.r !== undefined || arg.red !== undefined) {
				this.clr = Color.normalize({r: arg.r, g: arg.g, b: arg.b, a: arg.a});
			}
			else if (arg.v !== undefined || arg.value !== undefined) {
				this.clr = Color.normalize({hsv: arg, a: arg.a});
			}
			else if ((arg.l !== undefined || arg.lightness !== undefined) &&
				(arg.s !== undefined || arg.saturation !== undefined)) {
				this.clr = Color.normalize({hsl: arg, a: (arg.a || arg.alpha)});
			}
			else if ((arg.l !== undefined || arg.L !== undefined) && (arg.a !== undefined)) {
				this.clr = Color.normalize({lab: arg, a: (arg.a || arg.alpha)});
			}
			else {
				throw new TypeError('Color argument ' + arg + ' is invalid.');
			}
		}

		else {
			throw new TypeError('Color argument ' + arg + ' is invalid.');
		}
		return this;

	}

	if (args.length === 1) {//} && args[0].isObject()) {
		var c = args[0];
		r = c.r;
		g = c.g;
		b = c.b;
		a = c.a || 1;
	}
	if (args.length >= 3) {
		r = args[0];
		g = args[1];
		b = args[2];
		a = args[3] || 1;
	}

	var formats = "cmyk hsl hsv hwb keyword lab lch rgb xyz".list();
	// var formats = ["cmyk", "hsl", "hsv", "hwb", "keyword", "lab", "lch", "rgb", "xyz"];
	var conversions = formats.combinations(2);

};




function contrastQuotient(HSV) {
	var RGB = hsv2rgb(HSV);
	var YIQ = ((RGB.r * 299) + (RGB.g * 587) + (RGB.b * 114) ) / 1000;
	return (YIQ >= 128) ? 'dark' : 'light';
}

function convert2format(format_string, array) {
	var i;
	switch(format_string) {
		case 'hex':
		for (i = 0; i < array.length; i++) {
			array[i] = hsv2hex(array[i]);
		}
		break;
		case 'rgb':
		for (i = 0; i < array.length; i++) {
			array[i] = hsv2rgb(array[i]);
		}
		break;
		case 'rgb-string':
		for (i = 0; i < array.length; i++) {
			var raw_rgb =  hsv2rgb(array[i]);
			array[i] = "rgb(" + raw_rgb.r + "," + raw_rgb.g + "," + raw_rgb.b + ")";
		}
		break;
		case 'hsv':
		break;
		default:
		console.error('Format not recognized.');
		break;
	}
	return array;
}

parseCss = function(css) {
	var clr = {};
	var shorthandRegex = /^#[0-9a-f]{3}$/i;
	var shorthandMatch = css.match(shorthandRegex);
	if (shorthandMatch) {
		clr = {
			r: parseInt(css.charAt(1), 16) * 0x11,
			g: parseInt(css.charAt(2), 16) * 0x11,
			b: parseInt(css.charAt(3), 16) * 0x11
		};
		return normalize(clr);
	}
	var longhandRegex = /^#[0-9a-f]{6}$/i;
	var longhandMatch = css.match(longhandRegex);
	if (longhandMatch) {
		clr = {
			r: parseInt(css.slice(1,3), 16),
			g: parseInt(css.slice(3,5), 16),
			b: parseInt(css.slice(5,7), 16)
		};
		return normalize(clr);
	}
	var rgbRegex = /^rgb\(\s*([0-9]+),\s*([0-9]+),\s*([0-9]+)\s*\)$/i;
	var rgbMatch = css.match(rgbRegex);
	if (rgbMatch) {
		clr = {
			r: parseInt(rgbMatch[1], 10),
			g: parseInt(rgbMatch[2], 10),
			b: parseInt(rgbMatch[3], 10)
		};
		return normalize(clr);
	}
	var rgbaRegex = /^rgba\(\s*([0-9]+),\s*([0-9]+),\s*([0-9]+),\s*([0-9\.]+)\s*\)$/i;
	var rgbaMatch = css.match(rgbaRegex);
	if (rgbaMatch) {
		clr = {
			r: parseInt(rgbaMatch[1], 10),
			g: parseInt(rgbaMatch[2], 10),
			b: parseInt(rgbaMatch[3], 10),
			a: parseFloat(rgbaMatch[4], 10)
		};
		return normalize(clr);
	}
	throw new TypeError(css + ' is not a valid CSS string for Color.');
};
toArray: function(color) {
	var i = null,
		split = [],
		colors = this.names;
	if(color instanceof Array) {
		return color;
	}
	else if(color.indexOf('rgb') === 0) {
		split = color.replace(/rgb\(|\)|\s/gi, '').split(',');
	}
	else if(color.indexOf('#') === 0) {
		color = color.slice(1);
		if(color.length === 3) {
			color = color.replace(/([0-9a-f])/ig, '$1$1');
		}
		for(i = 0; i < 3; i++) {
			split.push(parseInt(color.slice(i * 2, (i + 1) * 2), 16));
		}
	}
	else {
		for(i in colors) {
			if(colors.hasOwnProperty(i) && i === color.toLowerCase()) {
				split = [colors[i][0], colors[i][1], colors[i][2]];
			}
		}
	}
	for(i = 0; i < 3; i++) {
		split[i] = parseInt(split[i], 10);
	}
	return split;
},



(function() {
	var l2y, y2l, conv, dotProduct, epsilon, fromLinear, kappa, m, m_inv, maxChroma, maxChromaD, refU, refV, refX, refY, refZ, rgbPrepare, root, round, toLinear, _hradExtremum, _maxChroma;
	refX = 0.95047;
	refY = 1.00000;
	refZ = 1.08883;
	lab_e = 0.008856;
	lab_k = 903.3;
	refU = (4 * refX) / (refX + (15 * refY) + (3 * refZ));
	refV = (9 * refY) / (refX + (15 * refY) + (3 * refZ));
	m = {
		R: [3.240454162114103, -1.537138512797715, -0.49853140955601],
		G: [-0.96926603050518, 1.876010845446694, 0.041556017530349],
		B: [0.055643430959114, -0.20402591351675, 1.057225188223179]
	};
	m_inv = {
		X: [0.41245643908969, 0.3575760776439, 0.18043748326639],
		Y: [0.21267285140562, 0.71515215528781, 0.072174993306559],
		Z: [0.019333895582329, 0.1191920258813, 0.95030407853636]
	};
	kappa = 24389 / 27;
	epsilon = 216 / 24389;
	_maxChroma = function(L, H) {
		var cosH, hrad, sinH, sub1, sub2;
		hrad = H / 360 * 2 * Math.PI;
		sinH = Math.sin(hrad);
		cosH = Math.cos(hrad);
		sub1 = Math.pow(L + 16, 3) / 1560896;
		sub2 = sub1 > epsilon ? sub1 : L / kappa;
		return function(channel) {
			var bottom, lbottom, m1, m2, m3, rbottom, top, _ref;
			_ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
			top = (12739311 * m3 + 11700000 * m2 + 11120499 * m1) * sub2;
			rbottom = 9608480 * m3 - 1921696 * m2;
			lbottom = 1441272 * m3 - 4323816 * m1;
			bottom = (rbottom * sinH + lbottom * cosH) * sub2;
			return function(limit) {
				return L * (top - 11700000 * limit) / (bottom + 1921696 * sinH * limit);
			};
		};
	};
	_hradExtremum = function(L) {
		var lhs, rhs, sub;
		lhs = (Math.pow(L, 3) + 48 * Math.pow(L, 2) + 768 * L + 4096) / 1560896;
		rhs = epsilon;
		sub = lhs > rhs ? lhs : L / kappa;
		return function(channel, limit) {
			var bottom, hrad, m1, m2, m3, top, _ref;
			_ref = m[channel], m1 = _ref[0], m2 = _ref[1], m3 = _ref[2];
			top = (20 * m3 - 4 * m2) * sub + 4 * limit;
			bottom = (3 * m3 - 9 * m1) * sub;
			hrad = Math.atan2(top, bottom);
			if (limit === 1) {
				hrad += Math.PI;
			}
			return hrad;
		};
	};
	maxChroma = function(L, H) {
		var C, channel, limit, mc1, mc2, result, _i, _j, _len, _len1, _ref, _ref1;
		result = Infinity;
		mc1 = _maxChroma(L, H);
		_ref = ['R', 'G', 'B'];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			channel = _ref[_i];
			mc2 = mc1(channel);
			_ref1 = [0, 1];
			for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
				limit = _ref1[_j];
				C = mc2(limit);
				if ((0 < C && C < result)) {
					result = C;
				}
			}
		}
		return result;
	};
	maxChromaD = function(L) {
		var C, channel, he1, hrad, limit, minima_C, _i, _j, _len, _len1, _ref, _ref1;
		minima_C = [];
		he1 = _hradExtremum(L);
		_ref = ['R', 'G', 'B'];
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			channel = _ref[_i];
			_ref1 = [0, 1];
			for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
				limit = _ref1[_j];
				hrad = he1(channel, limit);
				C = maxChroma(L, hrad * 180 / Math.PI);
				minima_C.push(C);
			}
		}
		return Math.min.apply(Math, minima_C);
	};
	dotProduct = function(a, b) {var i, ret, _i, _ref;ret = 0;for (i = _i = 0, _ref = a.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {ret += a[i] * b[i];}return ret;};
	round = function(num, places) {var n;n = Math.pow(10, places);return Math.round(num * n) / n;};
	fromLinear = function(c) {if (c <= 0.0031308) {return 12.92 * c;} else {return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;}};
	toLinear = function(c) {var a;a = 0.055;if (c > 0.04045) {return Math.pow((c + a) / (1 + a), 2.4);} else {return c / 12.92;}};
	rgbPrepare = function(tuple) {
		var ch, n, _i, _j, _len, _len1, _results;
		tuple = (function() {
			var _i, _len, _results;
			_results = [];
			for (_i = 0, _len = tuple.length; _i < _len; _i++) {
				n = tuple[_i];
				_results.push(round(n, 3));
			}
			return _results;
		})();
		for (_i = 0, _len = tuple.length; _i < _len; _i++) {
			ch = tuple[_i];
			if (ch < -0.0001 || ch > 1.0001) {
				throw new Error("Illegal rgb value: " + ch);
			}
			if (ch < 0) {
				ch = 0;
			}
			if (ch > 1) {
				ch = 1;
			}
		}
		_results = [];
		for (_j = 0, _len1 = tuple.length; _j < _len1; _j++) {
			ch = tuple[_j];
			_results.push(Math.round(ch * 255));
		}
		return _results;
	};
	conv = {
		'xyz': {},
		'luv': {},
		'lch': {},
		'husl': {},
		'huslp': {},
		'rgb': {},
		'hex': {}
	};
	conv.xyz.rgb = function(tuple) {var B, G, R;R = fromLinear(dotProduct(m.R, tuple));G = fromLinear(dotProduct(m.G, tuple));B = fromLinear(dotProduct(m.B, tuple));return [R, G, B];};
	conv.rgb.xyz = function(tuple) {var B, G, R, X, Y, Z, rgbl; R = tuple[0], G = tuple[1], B = tuple[2]; rgbl = [toLinear(R), toLinear(G), toLinear(B)]; X = dotProduct(m_inv.X, rgbl); Y = dotProduct(m_inv.Y, rgbl); Z = dotProduct(m_inv.Z, rgbl); return [X, Y, Z]; };
	y2l = function(Y) {if (Y <= epsilon) {return (Y / refY) * kappa; } else {return 116 * Math.pow(Y / refY, 1 / 3) - 16; } };
	l2y = function(L) {if (L <= 8) {return refY * L / kappa; } else {return refY * Math.pow((L + 16) / 116, 3); } };
	conv.xyz.luv = function(tuple) {var L, U, V, X, Y, Z, varU, varV; X = tuple[0], Y = tuple[1], Z = tuple[2]; varU = (4 * X) / (X + (15 * Y) + (3 * Z)); varV = (9 * Y) / (X + (15 * Y) + (3 * Z)); L = y2l(Y); if (L === 0) {return [0, 0, 0]; } U = 13 * L * (varU - refU); V = 13 * L * (varV - refV); return [L, U, V]; };
	conv.luv.xyz = function(tuple) {var L, U, V, X, Y, Z, varU, varV; L = tuple[0], U = tuple[1], V = tuple[2]; if (L === 0) {return [0, 0, 0]; } varU = U / (13 * L) + refU; varV = V / (13 * L) + refV; Y = l2y(L); X = 0 - (9 * Y * varU) / ((varU - 4) * varV - varU * varV); Z = (9 * Y - (15 * varV * Y) - (varV * X)) / (3 * varV); return [X, Y, Z]; };
	conv.luv.lch = function(tuple) {var C, H, Hrad, L, U, V; L = tuple[0], U = tuple[1], V = tuple[2]; C = Math.pow(Math.pow(U, 2) + Math.pow(V, 2), 1 / 2); Hrad = Math.atan2(V, U); H = Hrad * 360 / 2 / Math.PI; if (H < 0) {H = 360 + H; } return [L, C, H]; };
	conv.lch.luv = function(tuple) {var C, H, Hrad, L, U, V; L = tuple[0], C = tuple[1], H = tuple[2]; Hrad = H / 360 * 2 * Math.PI; U = Math.cos(Hrad) * C; V = Math.sin(Hrad) * C; return [L, U, V]; };
	conv.husl.lch = function(tuple) {var C, H, L, S, max; H = tuple[0], S = tuple[1], L = tuple[2]; if (L > 99.9999999) {return [100, 0, H]; } if (L < 0.00000001) {return [0, 0, H]; } max = maxChroma(L, H); C = max / 100 * S; return [L, C, H]; };
	conv.lch.husl = function(tuple) {var C, H, L, S, max; L = tuple[0], C = tuple[1], H = tuple[2]; if (L > 99.9999999) {return [H, 0, 100]; } if (L < 0.00000001) {return [H, 0, 0]; } max = maxChroma(L, H); S = C / max * 100; return [H, S, L]; };
	conv.huslp.lch = function(tuple) {var C, H, L, S, max; H = tuple[0], S = tuple[1], L = tuple[2]; if (L > 99.9999999) {return [100, 0, H]; } if (L < 0.00000001) {return [0, 0, H]; } max = maxChromaD(L); C = max / 100 * S; return [L, C, H]; };
	conv.lch.huslp = function(tuple) {var C, H, L, S, max; L = tuple[0], C = tuple[1], H = tuple[2]; if (L > 99.9999999) {return [H, 0, 100]; } if (L < 0.00000001) {return [H, 0, 0]; } max = maxChromaD(L); S = C / max * 100; return [H, S, L]; };
	conv.rgb.hex = function(tuple) {var ch, hex, _i, _len; hex = "#"; tuple = rgbPrepare(tuple); for (_i = 0, _len = tuple.length; _i < _len; _i++) {ch = tuple[_i]; ch = ch.toString(16); if (ch.length === 1) {ch = "0" + ch; } hex += ch; } return hex; };
	conv.hex.rgb = function(hex) {var b, g, r; if (hex.charAt(0) === "#") {hex = hex.substring(1, 7); } r = hex.substring(0, 2); g = hex.substring(2, 4); b = hex.substring(4, 6); return [r, g, b].map(function(n) {return parseInt(n, 16) / 255; }); };
	conv.lch.rgb = function(tuple) {return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(tuple)));};
	conv.rgb.lch = function(tuple) {return conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(tuple)));};
	conv.husl.rgb = function(tuple) {return conv.lch.rgb(conv.husl.lch(tuple));};
	conv.rgb.husl = function(tuple) {return conv.lch.husl(conv.rgb.lch(tuple));};
	conv.huslp.rgb = function(tuple) {return conv.lch.rgb(conv.huslp.lch(tuple));};
	conv.rgb.huslp = function(tuple) {return conv.lch.huslp(conv.rgb.lch(tuple));};
	root = {};
	root.fromRGB = function(R, G, B) {return conv.rgb.husl([R, G, B]);};
	root.fromHex = function(hex) {return conv.rgb.husl(conv.hex.rgb(hex));};
	root.toRGB = function(H, S, L) {return conv.husl.rgb([H, S, L]);};
	root.toHex = function(H, S, L) {return conv.rgb.hex(conv.husl.rgb([H, S, L]));};
	root.p = {};
	root.p.toRGB = function(H, S, L) {return conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L]))));};
	root.p.toHex = function(H, S, L) {return conv.rgb.hex(conv.xyz.rgb(conv.luv.xyz(conv.lch.luv(conv.huslp.lch([H, S, L])))));};
	root.p.fromRGB = function(R, G, B) {return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz([R, G, B]))));};
	root.p.fromHex = function(hex) {return conv.lch.huslp(conv.luv.lch(conv.xyz.luv(conv.rgb.xyz(conv.hex.rgb(hex)))));};
	root._conv = conv;
	root._round = round;
	root._maxChroma = maxChroma;
	root._maxChromaD = maxChromaD;
	root._hradExtremum = _hradExtremum;
	root._rgbPrepare = rgbPrepare;

}).call(this);


module.exports = {
	rgb2hsl: rgb2hsl,
	rgb2hsv: rgb2hsv,
	rgb2hwb: rgb2hwb,
	rgb2cmyk: rgb2cmyk,
	rgb2keyword: rgb2keyword,
	rgb2xyz: rgb2xyz,
	rgb2lab: rgb2lab,
	rgb2lch: rgb2lch,
	hsl2rgb: hsl2rgb,
	hsl2hsv: hsl2hsv,
	hsl2hwb: hsl2hwb,
	hsl2cmyk: hsl2cmyk,
	hsl2keyword: hsl2keyword,
	hsv2rgb: hsv2rgb,
	hsv2hsl: hsv2hsl,
	hsv2hwb: hsv2hwb,
	hsv2cmyk: hsv2cmyk,
	hsv2keyword: hsv2keyword,
	hwb2rgb: hwb2rgb,
	hwb2hsl: hwb2hsl,
	hwb2hsv: hwb2hsv,
	hwb2cmyk: hwb2cmyk,
	hwb2keyword: hwb2keyword,
	cmyk2rgb: cmyk2rgb,
	cmyk2hsl: cmyk2hsl,
	cmyk2hsv: cmyk2hsv,
	cmyk2hwb: cmyk2hwb,
	cmyk2keyword: cmyk2keyword,
	keyword2rgb: keyword2rgb,
	keyword2hsl: keyword2hsl,
	keyword2hsv: keyword2hsv,
	keyword2hwb: keyword2hwb,
	keyword2cmyk: keyword2cmyk,
	keyword2lab: keyword2lab,
	keyword2xyz: keyword2xyz,
	xyz2rgb: xyz2rgb,
	xyz2lab: xyz2lab,
	xyz2lch: xyz2lch,
	lab2xyz: lab2xyz,
	lab2rgb: lab2rgb,
	lab2lch: lab2lch,
	lch2lab: lch2lab,
	lch2xyz: lch2xyz,
	lch2rgb: lch2rgb
}
function rgb2hsl(rgb) {
	var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, l;
	if (max == min) h = 0;
	else if (r == max) h = (g - b) / delta;
	else if (g == max) h = 2 + (b - r) / delta;
	else if (b == max) h = 4 + (r - g)/ delta;
	h = Math.min(h * 60, 360);
	if (h < 0) h += 360;
	l = (min + max) / 2;
	if (max == min)
		s = 0;
	else if (l <= 0.5)
		s = delta / (max + min);
	else
		s = delta / (2 - max - min);
	return [h, s * 100, l * 100];
}
function rgb2hsv(rgb) {
	var r = rgb[0],
			g = rgb[1],
			b = rgb[2],
			min = Math.min(r, g, b),
			max = Math.max(r, g, b),
			delta = max - min,
			h, s, v;
	if (max == 0)
		s = 0;
	else
		s = (delta/max * 1000)/10;
	if (max == min)
		h = 0;
	else if (r == max)
		h = (g - b) / delta;
	else if (g == max)
		h = 2 + (b - r) / delta;
	else if (b == max)
		h = 4 + (r - g) / delta;
	h = Math.min(h * 60, 360);
	if (h < 0)
		h += 360;
	v = ((max / 255) * 1000) / 10;
	return [h, s, v];
}
function rgb2hwb(rgb) {
	var r = rgb[0],
			g = rgb[1],
			b = rgb[2],
			h = rgb2hsl(rgb)[0]
			w = 1/255 * Math.min(r, Math.min(g, b))
			b = 1 - 1/255 * Math.max(r, Math.max(g, b));
	return [h, w * 100, b * 100];
}
function rgb2cmyk(rgb) {
	var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255,
			c, m, y, k;
	k = Math.min(1 - r, 1 - g, 1 - b);
	c = (1 - r - k) / (1 - k);
	m = (1 - g - k) / (1 - k);
	y = (1 - b - k) / (1 - k);
	return [c * 100, m * 100, y * 100, k * 100];
}
function rgb2keyword(rgb) {
	return reverseKeywords[JSON.stringify(rgb)];
}
function rgb2xyz(rgb) {
	var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255;
	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);
	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);
	return [x * 100, y *100, z * 100];
}
function rgb2lab(rgb) {
	var xyz = rgb2xyz(rgb),
				x = xyz[0],
				y = xyz[1],
				z = xyz[2],
				l, a, b;
	x /= 95.047;
	y /= 100;
	z /= 108.883;
	x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);
	return [l, a, b];
}
function rgb2lch(args) {
	return lab2lch(rgb2lab(args));
}
function hsl2rgb(hsl) {
	var h = hsl[0] / 360,
			s = hsl[1] / 100,
			l = hsl[2] / 100,
			t1, t2, t3, rgb, val;
	if (s == 0) {
		val = l * 255;
		return [val, val, val];
	}
	if (l < 0.5)
		t2 = l * (1 + s);
	else
		t2 = l + s - l * s;
	t1 = 2 * l - t2;
	rgb = [0, 0, 0];
	for (var i = 0; i < 3; i++) {
		t3 = h + 1 / 3 * - (i - 1);
		t3 < 0 && t3++;
		t3 > 1 && t3--;
		if (6 * t3 < 1)
			val = t1 + (t2 - t1) * 6 * t3;
		else if (2 * t3 < 1)
			val = t2;
		else if (3 * t3 < 2)
			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
		else
			val = t1;
		rgb[i] = val * 255;
	}
	return rgb;
}
function hsl2hsv(hsl) {
	var h = hsl[0],
			s = hsl[1] / 100,
			l = hsl[2] / 100,
			sv, v;
	l *= 2;
	s *= (l <= 1) ? l : 2 - l;
	v = (l + s) / 2;
	sv = (2 * s) / (l + s);
	return [h, sv * 100, v * 100];
}
function hsl2hwb(args) {
	return rgb2hwb(hsl2rgb(args));
}
function hsl2cmyk(args) {
	return rgb2cmyk(hsl2rgb(args));
}
function hsl2keyword(args) {
	return rgb2keyword(hsl2rgb(args));
}
function hsv2rgb(hsv) {
	var h = hsv[0] / 60,
			s = hsv[1] / 100,
			v = hsv[2] / 100,
			hi = Math.floor(h) % 6;
	var f = h - Math.floor(h),
			p = 255 * v * (1 - s),
			q = 255 * v * (1 - (s * f)),
			t = 255 * v * (1 - (s * (1 - f))),
			v = 255 * v;
	switch(hi) {
		case 0:
			return [v, t, p];
		case 1:
			return [q, v, p];
		case 2:
			return [p, v, t];
		case 3:
			return [p, q, v];
		case 4:
			return [t, p, v];
		case 5:
			return [v, p, q];
	}
}
function hsv2hsl(hsv) {
	var h = hsv[0],
			s = hsv[1] / 100,
			v = hsv[2] / 100,
			sl, l;
	l = (2 - s) * v;
	sl = s * v;
	sl /= (l <= 1) ? l : 2 - l;
	l /= 2;
	return [h, sl * 100, l * 100];
}
function hsv2hwb(args) {
	return rgb2hwb(hsv2rgb(args))
}
function hsv2cmyk(args) {
	return rgb2cmyk(hsv2rgb(args));
}
function hsv2keyword(args) {
	return rgb2keyword(hsv2rgb(args));
}
function hwb2rgb(hwb) {
	var h = hwb[0] / 360,
			wh = hwb[1] / 100,
			bl = hwb[2] / 100,
			ratio = wh + bl,
			i, v, f, n;
	if (ratio > 1) {
		wh /= ratio;
		bl /= ratio;
	}
	i = Math.floor(6 * h);
	v = 1 - bl;
	f = 6 * h - i;
	if ((i & 0x01) != 0) {
		f = 1 - f;
	}
	n = wh + f * (v - wh);
	switch (i) {
		default:
		case 6:
		case 0: r = v; g = n; b = wh; break;
		case 1: r = n; g = v; b = wh; break;
		case 2: r = wh; g = v; b = n; break;
		case 3: r = wh; g = n; b = v; break;
		case 4: r = n; g = wh; b = v; break;
		case 5: r = v; g = wh; b = n; break;
	}
	return [r * 255, g * 255, b * 255];
}
function hwb2hsl(args) {
	return rgb2hsl(hwb2rgb(args));
}
function hwb2hsv(args) {
	return rgb2hsv(hwb2rgb(args));
}
function hwb2cmyk(args) {
	return rgb2cmyk(hwb2rgb(args));
}
function hwb2keyword(args) {
	return rgb2keyword(hwb2rgb(args));
}
function cmyk2rgb(cmyk) {
	var c = cmyk[0] / 100,
			m = cmyk[1] / 100,
			y = cmyk[2] / 100,
			k = cmyk[3] / 100,
			r, g, b;
	r = 1 - Math.min(1, c * (1 - k) + k);
	g = 1 - Math.min(1, m * (1 - k) + k);
	b = 1 - Math.min(1, y * (1 - k) + k);
	return [r * 255, g * 255, b * 255];
}
function cmyk2hsl(args) {
	return rgb2hsl(cmyk2rgb(args));
}
function cmyk2hsv(args) {
	return rgb2hsv(cmyk2rgb(args));
}
function cmyk2hwb(args) {
	return rgb2hwb(cmyk2rgb(args));
}
function cmyk2keyword(args) {
	return rgb2keyword(cmyk2rgb(args));
}
function xyz2rgb(xyz) {
	var x = xyz[0] / 100,
			y = xyz[1] / 100,
			z = xyz[2] / 100,
			r, g, b;
	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);
	r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
		: r = (r * 12.92);
	g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
		: g = (g * 12.92);
	b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
		: b = (b * 12.92);
	r = Math.min(Math.max(0, r), 1);
	g = Math.min(Math.max(0, g), 1);
	b = Math.min(Math.max(0, b), 1);
	return [r * 255, g * 255, b * 255];
}
function xyz2lab(xyz) {
	var x = xyz[0],
			y = xyz[1],
			z = xyz[2],
			l, a, b;
	x /= 95.047;
	y /= 100;
	z /= 108.883;
	x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);
	l = (116 * y) - 16;
	a = 500 * (x - y);
	b = 200 * (y - z);
	return [l, a, b];
}
function xyz2lch(args) {
	return lab2lch(xyz2lab(args));
}
function lab2xyz(lab) {
	var l = lab[0],
			a = lab[1],
			b = lab[2],
			x, y, z, y2;
	if (l <= 8) {
		y = (l * 100) / 903.3;
		y2 = (7.787 * (y / 100)) + (16 / 116);
	} else {
		y = 100 * Math.pow((l + 16) / 116, 3);
		y2 = Math.pow(y / 100, 1/3);
	}
	x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);
	z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);
	return [x, y, z];
}
function lab2lch(lab) {
	var l = lab[0],
			a = lab[1],
			b = lab[2],
			hr, h, c;
	hr = Math.atan2(b, a);
	h = hr * 360 / 2 / Math.PI;
	if (h < 0) {
		h += 360;
	}
	c = Math.sqrt(a * a + b * b);
	return [l, c, h];
}
function lab2rgb(args) {
	return xyz2rgb(lab2xyz(args));
}
function lch2lab(lch) {
	var l = lch[0],
			c = lch[1],
			h = lch[2],
			a, b, hr;
	hr = h / 360 * 2 * Math.PI;
	a = c * Math.cos(hr);
	b = c * Math.sin(hr);
	return [l, a, b];
}
function lch2xyz(args) {
	return lab2xyz(lch2lab(args));
}
function lch2rgb(args) {
	return lab2rgb(lch2lab(args));
}
function keyword2rgb(keyword) {
	return cssKeywords[keyword];
}
function keyword2hsl(args) {
	return rgb2hsl(keyword2rgb(args));
}
function keyword2hsv(args) {
	return rgb2hsv(keyword2rgb(args));
}
function keyword2hwb(args) {
	return rgb2hwb(keyword2rgb(args));
}
function keyword2cmyk(args) {
	return rgb2cmyk(keyword2rgb(args));
}
function keyword2lab(args) {
	return rgb2lab(keyword2rgb(args));
}
function keyword2xyz(args) {
	return rgb2xyz(keyword2rgb(args));
}
function() {
	var randomColor = function(options) {
		options = options || {};
		var H,S,B;
		if(options.count != null) {
			var totalColors = options.count,
					colors = [];
			options.count = null;
			while(totalColors > colors.length) {
				colors.push(randomColor(options));
			}
			options.count = totalColors;
			return colors;
		}
		H = pickHue(options);
		S = pickSaturation(H, options);
		B = pickBrightness(H, S, options);
		return setFormat([H,S,B], options);
	};
	function pickHue(options) {
		var hueRange = getHueRange(options.hue),
				hue = randomWithin(hueRange);
		if(hue < 0) {hue = 360 + hue}
		return hue;
	}
	function pickSaturation(hue, options) {
		if(options.luminosity === 'random') {
			return randomWithin([0,100]);
		}
		if(options.hue === 'monochrome') {
			return 0;
		}
		var saturationRange = getSaturationRange(hue);
		var sMin = saturationRange[0],
				sMax = saturationRange[1];
		switch(options.luminosity) {
			case 'bright':
				sMin = 55;
				break;
			case 'dark':
				sMin = sMax - 10;
				break;
			case 'light':
				sMax = 55;
				break;
	}
		return randomWithin([sMin, sMax]);
	}
	function pickBrightness(H, S, options) {
		var brightness,
				bMin = getMinimumBrightness(H, S),
				bMax = 100;
		switch(options.luminosity) {
			case 'dark':
				bMax = bMin + 20;
				break;
			case 'light':
				bMin = (bMax + bMin)/2;
				break;
			case 'random':
				bMin = 0;
				bMax = 100;
				break;
		}
		return randomWithin([bMin, bMax]);
	}
	function setFormat(hsv, options) {
		switch(options.format) {
			case 'hsvArray':
				return hsv;
			case 'hsv':
				return colorString('hsv', hsv);
			case 'rgbArray':
				return HSVtoRGB(hsv);
			case 'rgb':
				return colorString('rgb', HSVtoRGB(hsv));
			default:
				return HSVtoHex(hsv);
		}
	}
	function getMinimumBrightness(H, S) {
		var lowerBounds = getColorInfo(H).lowerBounds;
		for(var i = 0; i < lowerBounds.length - 1; i++) {
			var s1 = lowerBounds[i][0],
					v1 = lowerBounds[i][1];
			var s2 = lowerBounds[i+1][0],
					v2 = lowerBounds[i+1][1];
			if(S >= s1 && S <= s2) {
				var m = (v2 - v1)/(s2 - s1),
						b = v1 - m*s1;
				return m*S + b;
			}
		}
		return 0;
	}
	function getHueRange(colorInput) {
		if(typeof parseInt(colorInput) === 'number') {
			var number = parseInt(colorInput);
			if(number < 360 && number > 0) {
				return [number, number];
			}
		}
		if(typeof colorInput === 'string') {
			if(colorDictionary[colorInput]) {
				var color = colorDictionary[colorInput];
				if(color.hueRange) {return color.hueRange}
			}
		}
		return [0,360];
	}
	function getSaturationRange(hue) {
		return getColorInfo(hue).saturationRange;
	}
	function getColorInfo(hue) {
		if(hue >= 334 && hue <= 360) {
			hue-= 360;
		}
		for(var colorName in colorDictionary) {
			var color = colorDictionary[colorName];
			if(color.hueRange &&
					hue >= color.hueRange[0] &&
					hue <= color.hueRange[1]) {
					return colorDictionary[colorName];
			}
		} return 'Color not found';
	}
	function shiftHue(h, degrees) {
		return(h + degrees)%360;
	}
	function colorString(prefix, values) {
		return prefix + '(' + values.join(', ') + ')';
	}
	return randomColor;
}));

var colorShortcuts = {
	aqua: "0ff",
	black: "000",
	blue: "00f",
	cyan: "0ff",
	fuchsia: "f0f",
	lightslategray: "789",
	lightslategrey: "789",
	lime: "0f0",
	magenta: "f0f",
	red: "f00",
	white: "fff",
	yellow: "ff0"
};
var colorKeywordsSmall = {
	aqua: "00ffff",
	black: "000000",
	blue: "0000ff",
	fuschia: "ff00ff",
	gray: "808080",
	green: "008000",
	grey: "808080",
	lime: "00ff00",
	maroon: "800000",
	navy: "000080",
	olive: "808000",
	orange: "ffa500",
	purple: "800080",
	red: "ff0000",
	silver: "c0c0c0",
	teal: "008080",
	white: "ffffff",
	yellow: "ffff00"
};

var colorKeywords = {
	aliceblue: ["f0f8ff", [240, 248, 255]],
	antiquewhite: ["faebd7", [250, 235, 215]],
	aqua: ["00ffff", [0, 255, 255]],
	aquamarine: ["7fffd4", [127, 255, 212]],
	azure: ["f0ffff", [240, 255, 255]],
	beige: ["f5f5dc", [245, 245, 220]],
	bisque: ["ffe4c4", [255, 228, 196]],
	black: ["000000", [0, 0, 0]],
	blanchedalmond: ["ffebcd", [255, 235, 205]],
	blue: ["0000ff", [0, 0, 255]],
	blueviolet: ["8a2be2", [138, 43, 226]],
	brown: ["a52a2a", [165, 42, 42]],
	burlywood: ["deb887", [222, 184, 135]],
	cadetblue: ["5f9ea0", [95, 158, 160]],
	chartreuse: ["7fff00", [127, 255, 0]],
	chocolate: ["d2691e", [210, 105, 30]],
	coral: ["ff7f50", [255, 127, 80]],
	cornflowerblue: ["6495ed", [100, 149, 237]],
	cornsilk: ["fff8dc", [255, 248, 220]],
	crimson: ["dc143c", [220, 20, 60]],
	cyan: ["00ffff", [0, 255, 255]],
	darkblue: ["00008b", [0, 0, 139]],
	darkcyan: ["008b8b", [0, 139, 139]],
	darkgoldenrod: ["b8860b", [184, 134, 11]],
	darkgray: ["a9a9a9", [169, 169, 169]],
	darkgreen: ["006400", [0, 100, 0]],
	darkgrey: ["a9a9a9", [169, 169, 169]],
	darkkhaki: ["bdb76b", [189, 183, 107]],
	darkmagenta: ["8b008b", [139, 0, 139]],
	darkolivegreen: ["556b2f", [85, 107, 47]],
	darkorange: ["ff8c00", [255, 140, 0]],
	darkorchid: ["9932cc", [153, 50, 204]],
	darkred: ["8b0000", [139, 0, 0]],
	darksalmon: ["e9967a", [233, 150, 122]],
	darkseagreen: ["8fbc8f", [143, 188, 143]],
	darkslateblue: ["483d8b", [72, 61, 139]],
	darkslategray: ["2f4f4f", [47, 79, 79]],
	darkslategrey: ["2f4f4f", [47, 79, 79]],
	darkturquoise: ["00ced1", [0, 206, 209]],
	darkviolet: ["9400d3", [148, 0, 211]],
	deeppink: ["ff1493", [255, 20, 147]],
	deepskyblue: ["00bfff", [0, 191, 255]],
	dimgray: ["696969", [105, 105, 105]],
	dimgrey: ["696969", [105, 105, 105]],
	dodgerblue: ["1e90ff", [30, 144, 255]],
	feldspar: ["d19275", [209, 146, 117]],
	firebrick: ["b22222", [178, 34, 34]],
	floralwhite: ["fffaf0", [255, 250, 240]],
	forestgreen: ["228b22", [34, 139, 34]],
	fuchsia: ["ff00ff", [255, 0, 255]],
	gainsboro: ["dcdcdc", [220, 220, 220]],
	ghostwhite: ["f8f8ff", [248, 248, 255]],
	gold: ["ffd700", [255, 215, 0]],
	goldenrod: ["daa520", [218, 165, 32]],
	gray: ["808080", [128, 128, 128]],
	green: ["008000", [0, 128, 0]],
	greenyellow: ["adff2f", [173, 255, 47]],
	grey: ["808080", [128, 128, 128]],
	honeydew: ["f0fff0", [240, 255, 240]],
	hotpink: ["ff69b4", [255, 105, 180]],
	indianred: ["cd5c5c", [205, 92, 92]],
	indigo: ["4b0082", [75, 0, 130]],
	ivory: ["fffff0", [255, 255, 240]],
	khaki: ["f0e68c", [240, 230, 140]],
	lavender: ["e6e6fa", [230, 230, 250]],
	lavenderblush: ["fff0f5", [255, 240, 245]],
	lawngreen: ["7cfc00", [124, 252, 0]],
	lemonchiffon: ["fffacd", [255, 250, 205]],
	lightblue: ["add8e6", [173, 216, 230]],
	lightcoral: ["f08080", [240, 128, 128]],
	lightcyan: ["e0ffff", [224, 255, 255]],
	lightgoldenrodyellow: ["fafad2", [250, 250, 210]],
	lightgray: ["d3d3d3", [211, 211, 211]],
	lightgray: [211, 211, 211],
	lightgreen: ["90ee90", [144, 238, 144]],
	lightgrey: ["d3d3d3", [211, 211, 211]],
	lightpink: ["ffb6c1", [255, 182, 193]],
	lightsalmon: ["ffa07a", [255, 160, 122]],
	lightseagreen: ["20b2aa", [32, 178, 170]],
	lightskyblue: ["87cefa", [135, 206, 250]],
	lightslategray: ["778899", [119, 136, 153]],
	lightslategrey: ["778899", [119, 136, 153]],
	lightsteelblue: ["b0c4de", [176, 196, 222]],
	lightyellow: ["ffffe0", [255, 255, 224]],
	lime: ["00ff00", [0, 255, 0]],
	limegreen: ["32cd32", [50, 205, 50]],
	linen: ["faf0e6", [250, 240, 230]],
	magenta: ["ff00ff", [255, 0, 255]],
	maroon: ["800000", [128, 0, 0]],
	mediumaquamarine: ["66cdaa", [102, 205, 170]],
	mediumblue: ["0000cd", [0, 0, 205]],
	mediumorchid: ["ba55d3", [186, 85, 211]],
	mediumpurple: ["9370db", [147, 112, 219]],
	mediumseagreen: ["3cb371", [60, 179, 113]],
	mediumslateblue: ["7b68ee", [123, 104, 238]],
	mediumspringgreen: ["00fa9a", [0, 250, 154]],
	mediumturquoise: ["48d1cc", [72, 209, 204]],
	mediumvioletred: ["c71585", [199, 21, 133]],
	midnightblue: ["191970", [25, 25, 112]],
	mintcream: ["f5fffa", [245, 255, 250]],
	mistyrose: ["ffe4e1", [255, 228, 225]],
	moccasin: ["ffe4b5", [255, 228, 181]],
	navajowhite: ["ffdead", [255, 222, 173]],
	navy: ["000080", [0, 0, 128]],
	oldlace: ["fdf5e6", [253, 245, 230]],
	olive: ["808000", [128, 128, 0]],
	olivedrab: ["6b8e23", [107, 142, 35]],
	orange: ["ffa500", [255, 165, 0]],
	orangered: ["ff4500", [255, 69, 0]],
	orchid: ["da70d6", [218, 112, 214]],
	palegoldenrod: ["eee8aa", [238, 232, 170]],
	palegreen: ["98fb98", [152, 251, 152]],
	paleturquoise: ["afeeee", [175, 238, 238]],
	palevioletred: ["db7093", [219, 112, 147]],
	papayawhip: ["ffefd5", [255, 239, 213]],
	peachpuff: ["ffdab9", [255, 218, 185]],
	peru: ["cd853f", [205, 133, 63]],
	pink: ["ffc0cb", [255, 192, 203]],
	plum: ["dda0dd", [221, 160, 221]],
	powderblue: ["b0e0e6", [176, 224, 230]],
	purple: ["800080", [128, 0, 128]],
	rebeccapurple: ["663399", [102, 51, 153]],
	red: ["ff0000", [255, 0, 0]],
	rosybrown: ["bc8f8f", [188, 143, 143]],
	royalblue: ["4169e1", [65, 105, 225]],
	saddlebrown: ["8b4513", [139, 69, 19]],
	salmon: ["fa8072", [250, 128, 114]],
	sandybrown: ["faa460", [244, 164, 96]],
	seagreen: ["2e8b57", [46, 139, 87]],
	seashell: ["fff5ee", [255, 245, 238]],
	sienna: ["a0522d", [160, 82, 45]],
	silver: ["c0c0c0", [192, 192, 192]],
	skyblue: ["87ceeb", [135, 206, 235]],
	slateblue: ["6a5acd", [106, 90, 205]],
	slategray: ["708090", [112, 128, 144]],
	slategrey: ["708090", [112, 128, 144]],
	snow: ["fffafa", [255, 250, 250]],
	springgreen: ["00ff7f", [0, 255, 127]],
	steelblue: ["4682b4", [70, 130, 180]],
	tan: ["d2b48c", [210, 180, 140]],
	teal: ["008080", [0, 128, 128]],
	thistle: ["d8bfd8", [216, 191, 216]],
	tomato: ["ff6347", [255, 99, 71]],
	turquoise: ["40e0d0", [64, 224, 208]],
	violet: ["ee82ee", [238, 130, 238]],
	wheat: ["f5deb3", [245, 222, 179]],
	white: ["ffffff", [255, 255, 255]],
	whitesmoke: ["f5f5f5", [245, 245, 245]],
	yellow: ["ffff00", [255, 255, 0]],
	yellowgreen: ["9acd32", [154, 205, 50]]
};

var colorDictionary = {};
function defineColor(name, hueRange, lowerBounds) {
	var sMin = lowerBounds[0][0],
		sMax = lowerBounds[lowerBounds.length - 1][0],
		bMin = lowerBounds[lowerBounds.length - 1][1],
		bMax = lowerBounds[0][1];
	colorDictionary[name] = {
		hueRange: hueRange,
		lowerBounds: lowerBounds,
		saturationRange: [sMin, sMax],
		brightnessRange: [bMin, bMax]
	};
}
function loadColorBounds() {
	defineColor('monochrome', null, [[0,0],[100,0]] );
	defineColor('red', [-26,18], [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]] );
	defineColor('orange', [19,46], [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]] );
	defineColor('yellow', [47,62], [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]] );
	defineColor('green', [63,178], [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]] );
	defineColor('blue', [179, 257], [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]] );
	defineColor('purple', [258, 282], [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]] );
	defineColor('pink', [283, 334], [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]] );
}();
