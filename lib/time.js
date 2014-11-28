(function (window) {
	'use strict';

	window.timing = window.timing || {

		getTimes: function (opts) {
			var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;
			var timing = performance.timing;
			var api = {};
			opts = opts || {};

			if (timing) {
				if (opts && !opts.simple) {
					for (var k in timing) {
						if (timing.hasOwnProperty(k)) {
							api[k] = timing[k];
						}
					}
				}
				if (api.firstPaint === undefined) {
					var firstPaint = 0;
					if (window.chrome && window.chrome.loadTimes) {
						firstPaint = window.chrome.loadTimes().firstPaintTime * 1000;
						api.firstPaintTime = firstPaint - (window.chrome.loadTimes().startLoadTime * 1000);
					} else if (typeof window.performance.timing.msFirstPaint === 'number') {
						firstPaint = window.performance.timing.msFirstPaint;
						api.firstPaintTime = firstPaint - window.performance.timing.navigationStart;
					}
					if (opts && !opts.simple) {
						api.firstPaint = firstPaint;
					}
				}
				api.loadTime = timing.loadEventEnd - timing.navigationStart;
				api.domReadyTime = timing.domComplete - timing.domInteractive;
				api.readyStart = timing.fetchStart - timing.navigationStart;
				api.redirectTime = timing.redirectEnd - timing.redirectStart;
				api.appcacheTime = timing.domainLookupStart - timing.fetchStart;
				api.unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
				api.lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
				api.connectTime = timing.connectEnd - timing.connectStart;
				api.requestTime = timing.responseEnd - timing.requestStart;
				api.initDomTreeTime = timing.domInteractive - timing.responseEnd;
				api.loadEventTime = timing.loadEventEnd - timing.loadEventStart;
			}

			return api;
		},
		printTable: function (opts) {
			var table = {};
			var data = this.getTimes(opts);
			Object.keys(data).sort().forEach(function (k) {
				table[k] = {
					ms: data[k],
					s: +((data[k] / 1000).toFixed(2))
				};
			});
			console.table(table);
		},
		printSimpleTable: function () {
			this.printTable({
				simple: true
			});
		}
	};
	return timing.printSimpleTable();

})(this);

Function.prototype.delay = function (msDelay) {
	var handler = this;
	return setTimeout(handler, msDelay);
}
Function.prototype.delayed = function (handler, msDelay) {
	var fn = this;
	return function () {
		return fn.delay(fn.partial(handler, fn.toArray(arguments)), msDelay);
	};
}
Function.prototype.wait = function (delay) {
	var callback = this;
	var baseTime = now() + delay;
	return function () {
		var ms = Math.max(baseTime - now(), 4);
		return this.delay.apply(this, append([callback, ms, this], arguments));
	};
}
Function.prototype.ync = Function.prototype.compose(Function.prototype.partial(Function.prototype.delayedFor, 0));
Function.prototype.delayFor = Function.prototype.flip(Function.prototype.delay);
Function.prototype.delayedFor = Function.prototype.flip(Function.prototype.delayed);
Function.prototype.async = Function.prototype.compose(Function.prototype.partial(Function.prototype.delayedFor, 0));
Function.prototype.debounce = function (time) {
	var fn = this,
		timeout;
	return function () {
		var args = Array.prototype.slice.call(arguments, 0);
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			return fn.apply(null, args);
		}, time);
	}
}
Function.prototype.throttle = function throttle(delay) {
	var fn = this,
		context, timeout, result, args, diff, prevCall = 0;

	function delayed() {
		prevCall = now();
		timeout = null;
		result = fn.apply(context, args);
	}

	function throttled() {
		context = this;
		args = arguments;
		diff = delay - (now() - prevCall);
		if (diff <= 0) {
			clearTimeout(timeout);
			delayed();
		} else if (!timeout) {
			timeout = setTimeout(delayed, diff);
		}
		return result;
	}
	throttled.cancel = function () {
		clearTimeout(timeout);
	};
	return throttled;
}

function sleep(ms) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > ms) {
			break;
		}
	}
}

function basesleep(seconds) {
	var start = new Date().getTime();
	while (new Date() < start + seconds * 1000) {}
	return 0;
}

function microsleep(microseconds) {
	var start = new Date().getTime();
	while (new Date() < (start + microseconds / 1000)) {}
	return true;
}

function nanosleep(seconds, nanoseconds) {
	var start = new Date().getTime();
	while (new Date() < (start + seconds * 1000 + nanoseconds / 1000000)) {}
	return true;
}

function sleepUntil(timestamp) {
	while (new Date() < timestamp * 1000) {}
	return true;
}
