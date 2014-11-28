
Math.oldRandom = Math.random();
Math.random = function(min, max, round, mt) {
	if(arguments.length === 0) {return Math.oldRandom();}
	if(!round) {round = 1;}
	if(mt) {
		min = parseInt(min, 10);
		max = parseInt(max, 10);
	}
	// return Math.round(((Math.oldRandom() * (max - min)) + min)), round);
	return Math.floor(Math.oldRandom() * (max - min + 1)) + min;
}




function Random() {return Math.random();}

Random.prototype.min = function() {
	return 0;
}
Random.prototype.max = function() {
	return 2147483647;
}
Random.prototype.between = function(low, high, digits) {
	var d =(typeof digits === 'number' && digits > 0 ? digits : 0),
	floor = +low,
	range = +(high - low),
	random = Math.random() * range + floor;

	return random.toFixed(d);
};
Random.prototype.within = function(range) {
	return Math.floor(range[0] + Math.random()* (range[1] + 1 - range[0]));
}
Random.prototype.normal = function(mean, stdDev) {
	var u, v, s;
	mean = mean || 0;
	stdDev = stdDev || 1;

	do {
		u = Math.random() * 2 - 1;
		v = Math.random() * 2 - 1;
		s = u * u + v * v;
	} while(s >= 1 || s === 0);
	return mean + stdDev * u * Math.sqrt(-2 * Math.log(s) / s);
};



Random.prototype.bool = function(){
	return Math.random() >= 0.5;
}
Random.prototype.boolean = function(){
	return Math.random() >= 0.5;
}
Random.prototype.bit = function(){
	return this.bool() ? 1 : 0;
}
Random.prototype.sign = function() {
	return this.bool() ? 1 : -1;
}
Random.prototype.index = function(arr) {
	return this.integer(0, arr.length-1);
}
Random.prototype.float = function(min, max){
	min = min == null ? MIN_INT : min;
	max = max == null ? MAX_INT : max;
	return min +(max - min) * Math.random();
}
Random.prototype.integer = function(min, max){
	min = min == null ? MIN_INT : ~~min;
	max = max == null ? MAX_INT : ~~max;
	return Math.round(rand(min - 0.5, max + 0.499999999999));
}
Random.prototype.string = function() {

	var defaultDictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

	function randomString(length, dictionary) {
		if(!isNumber(length) || length <= 0) {
			length = 8;
		}

		if(!isString(dictionary) || dictionary.length < 1) {
			dictionary = defaultDictionary;
		}

		var result = '',
		domain = dictionary.length - 1;

		while(length--) {
			result += dictionary[Random.integer(0, domain)];
		}

		return result;
	}

	return randomString;
});



Random.prototype.hex = function(size){
	var _chars = '0123456789abcdef'.split('');
	size = size && size > 0? size : 6;
	var str = '';
	while(size--) {
		str += choice(_chars);
	}
	return str;
}

Random.prototype.guid = function() {
	var result =
		this.hex(8) +
		'-' +
		this.hex(4) +
		'-' +
		'4' +
		this.hex(3) +
		'-' +
		choice(8, 9, 'a', 'b') +
		this.hex(3) +
		'-' +
		this.hex(12);
	return result;
}

// from urllib import urlopen
// import random

// got the list from here, no point grabbing it each time though...

// webpage = urlopen('http://dictionary-thesaurus.com/wordlists/Nouns%285,449%29.txt').read()
// word_list = webpage.splitlines()


Random.prototype.word = function(n) {
	var result = [];
	for(var i = 0; i < n; i++) {
		result.push(word_list[Math.random(0, word_list.length)]);
	}
	return result;
}

//create a delabriandais tree
