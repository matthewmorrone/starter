
Array.prototype.statistics = function(){
	var a = this;
	var r = {mean: 0, variance: 0, deviation: 0}, t = a.length;
	for(var m, s = 0, l = t; l--; s += a[l]);
	for(m = r.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
	return r.deviation = Math.sqrt(r.variance = s / t), r;
}
Array.prototype.mean = function() {return this.statistics.mean;};
Array.prototype.deviation = function() {return this.statistics.deviation;};
Array.prototype.variance = function() {return this.statistics.variance;};

// var x = statistics([2, 3, 4]);
// document.write(
//     "statistics([2, 3, 4]).mean = ", x.mean, "<br />",
//     "statistics([2, 3, 4]).deviation = ", x.deviation, "<br />",
//     "statistics([2, 3, 4]).variance = ", x.variance
// );

Array.prototype.leastSquares = function()
{
	var twodarray = this;
	function get_r(xs,ys,xbar,ybar,sdx,sdy)
	{
		var xy=0
		for(var j=0;j<xs.length;j++)
		{
			xs[j]=parseFloat(xs[j])
			ys[j]=parseFloat(ys[j])
			xy += (xs[j] - xbar) * (ys[j] - ybar)
		}
		corr=Math.round(1/(xs.length-1)*xy/(sdx*sdy)*10000)/10000
		return corr
	}
	var ave=[]
	for (var j=0;j<twodarray[0].length;j++)
	{
		aver=[]
		for (var i=0;i<twodarray.length;i++)
		{
			aver.push(twodarray[i][j])
		}
		ave.push(aver)
	}
	var xbar=comp_ave(ave[0].slice())
	var ybar=comp_ave(ave[1].slice())
	var sdx=comp_dev(ave[0].slice())
	var sdy=comp_dev(ave[1].slice())
	var r=get_r(ave[0].slice(),ave[1].slice(),xbar,ybar,sdx,sdy)

	var b=r*(sdy/sdx)
	var a=ybar - (b*xbar)

	return [a,b].slice()
}

Array.prototype.sum = function () {
	var s = 0,
		a = this,
		l = a.length;
	for (var i = 0; i < l; i++) {
		s += +a[i];
	}
	return s;
};

Array.prototype.sample = function (samples) {
	var s = samples,
		a = this,
		l = a.length,
		doSampling = (typeof s === 'number' && s < l),
		sampledArray = [],
		i;

	if (doSampling) {
		var count = Math.floor(s / 10) + 1;
		var randomIndex = function () {
			return a[Math.floor(Math.random() * l)];
		};

		for (i = 0; i < count; i++) {
			sampledArray.push(
				randomIndex(), randomIndex(),
				randomIndex(), randomIndex(),
				randomIndex(), randomIndex(),
				randomIndex(), randomIndex(),
				randomIndex(), randomIndex()
			);
		}

		return sampledArray.slice(0, s);
	} else {
		return this;
	}
};

Array.prototype.mean = function () {
	var a = this;
	return a.sum() / a.length;
};

Array.prototype.variance = function () {
	var a = this,
		l = a.length,
		m = a.mean(),
		sumOfSquares = 0,
		i = 0;

	for (i = 0; i < l; i++) {
		sumOfSquares += Math.pow(a[i] - m, 2);
	}

	return sumOfSquares / l;
};

Array.prototype.stdDev = function () {
	return Math.sqrt(this.variance());
};

var minMax = function (type) {
	var a = this,
		l = a.length,
		t = (type === 'max' ? 'max' : 'min'),
		fn = Math[t],
		i = 0;
	var batchSize = 100000,
		batch = [],
		passes = Math.floor(l / batchSize) + 1;

	for (i = 0; i < passes; i++) {
		var start = i * batchSize,
			end = start + batchSize;

		var value = fn.apply(
				Math, a.slice(start, end)
			);
		batch.push(value);
	}

	return fn.apply(Math, batch);
};

Array.prototype.max = function () {
	return minMax.call(this, 'max');
};

Array.prototype.min = function () {
	return minMax.call(this, 'min');
};

Array.prototype.sortNumber = function (invert) {
	if (!!invert) {
		return this.sort(function (a, b) { return a - b; }).reverse();
	} else {
		return this.sort(function (a, b) { return a - b; });
	}
};

Array.prototype.median = function () {
	var a = this,
		l = a.length,
		isOdd = (l % 2 === 1),
		middleIndex = Math.floor((l - 1) / 2),
		sorted = a.sortNumber(),
		median;

	if (isOdd) {
		median = sorted[middleIndex];
	} else {
		median = (sorted[middleIndex] + sorted[middleIndex + 1]) / 2;
	}
	return median;
};

Array.prototype.percentile = function (percent) {
	var a = this,
		index = Math.floor(percent * a.length);
	return a.sortNumber()[index];
};

Array.prototype.histogram = function () {
	var a = this,
		l = a.length,
		o = {},
		i = 0,
		val;

	for (i = 0; i < l; i++) {
		val = a[i];
		if (typeof o[val] === 'number') {
			o[val]++;
		} else {
			o[val] = 1;
		}
	}

	return o;
};

Array.prototype.countByType = function () {
	var a = this,
		l = a.length,
		o = {},
		i = 0,
		realTypeOf = function (obj) {
			return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
		};

	for (i = 0; i < l; i++) {
		var type = realTypeOf(a[i]);
		if (o[type] !== undefined) {
			o[type]++;
		} else {
			o[type] = 1;
		}
	}

	return o;
};
