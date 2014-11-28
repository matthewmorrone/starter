
TimeMethods = (function() {
	function TimeMethods() {}

	TimeMethods.prototype._rjust = function(fixnum, str) {
		if (str == null) {
			str = '0';
		}
		return _str.rjust(fixnum + "", 2, str);
	};

	TimeMethods.prototype.strftime = function(date, format) {
		var fill, locale, out;
		locale = R.Time.LOCALE;
		fill = _time._rjust;
		out = format.replace(/%(.)/g, function(_, flag) {
			var day, jtime;
			switch (flag) {
				case 'a':
					return locale.DAYS_SHORT[_time.wday(date)];
				case 'A':
					return locale.DAYS[_time.wday(date)];
				case 'b':
					return locale.MONTHS_SHORT[_time.month(date)];
				case 'B':
					return locale.MONTHS[_time.month(date)];
				case 'C':
					return _time.year(date) % 100;
				case 'd':
					return fill(_time.day(date));
				case 'D':
					return _time.strftime(date, '%m/%d/%y');
				case 'e':
					return fill(_time.day(date), ' ');
				case 'F':
					return _time.strftime(date, '%Y-%m-%d');
				case 'h':
					return locale.MONTHS_SHORT[_time.month(date)];
				case 'H':
					return fill(_time.hour(date));
				case 'I':
					return fill(_time.hour12(date));
				case 'j':
					jtime = new Date(_time.year(date), 0, 1).getTime();
					return Math.ceil((date.getTime() - jtime) / (1000 * 60 * 60 * 24));
				case 'k':
					return _str.rjust("" + _time.hour(date), 2, ' ');
				case 'l':
					return fill(_time.hour12(date), ' ');
				case 'm':
					return fill(_time.month(date));
				case 'M':
					return fill(_time.min(date));
				case 'n':
					return "\n";
				case 'N':
					return _err.throw_not_implemented();
				case 'p':
					if (_time.hour(date) < 12) {
						return locale.AM;
					} else {
						return locale.PM;
					}
					break;
				case 'P':
					if (_time.hour(date) < 12) {
						return locale.AM_LOW;
					} else {
						return locale.PM_LOW;
					}
					break;
				case 'r':
					return _time.strftime(date, '%I:%M:%S %p');
				case 'R':
					return _time.strftime(date, '%H:%M');
				case 'S':
					return fill(_time.sec(date));
				case 's':
					return Math.floor((date.getTime()) / 1000);
				case 't':
					return "\t";
				case 'T':
					return _time.strftime(date, '%H:%M:%S');
				case 'u':
					day = _time.wday(date);
					if (day === 0) {
						return 7;
					} else {
						return day;
					}
					break;
				case 'v':
					return _time.strftime(date, '%e-%b-%Y');
				case 'w':
					return _time.wday(date);
				case 'y':
					return _str.slice(_time.year(date) + "", -2, 2);
				case 'Y':
					return _time.year(date);
				case 'x':
					return _time.strftime(date, '%m/%d/%y');
				case 'X':
					return _time.strftime(date, '%H:%M:%S');
				case 'z':
					return _time._offset_str(date);
				case 'Z':
					return _time.zone(date);
				default:
					return flag;
			}
		});
		return out;
	};

	TimeMethods.prototype.asctime = function(date) {
		return _time.strftime(date, "%a %b %e %H:%M:%S %Y");
	};

	TimeMethods.prototype.ctime = TimeMethods.prototype.asctime;

	TimeMethods.prototype.year = function(date) {
		return date.getFullYear();
	};

	TimeMethods.prototype.month = function(date) {
		return date.getMonth() + 1;
	};

	TimeMethods.prototype.mon = TimeMethods.prototype.month;

	TimeMethods.prototype.monday = function(date) {
		return _time.wday(date) === 1;
	};

	TimeMethods.prototype.tuesday = function(date) {
		return _time.wday(date) === 2;
	};

	TimeMethods.prototype.wednesday = function(date) {
		return _time.wday(date) === 3;
	};

	TimeMethods.prototype.thursday = function(date) {
		return _time.wday(date) === 4;
	};

	TimeMethods.prototype.friday = function(date) {
		return _time.wday(date) === 5;
	};

	TimeMethods.prototype.saturday = function(date) {
		return _time.wday(date) === 6;
	};

	TimeMethods.prototype.sunday = function(date) {
		return _time.wday(date) === 0;
	};

	TimeMethods.prototype.day = function(date) {
		return date.getDate();
	};

	TimeMethods.prototype.mday = TimeMethods.prototype.day;

	TimeMethods.prototype.hour = function(date) {
		return date.getHours();
	};

	TimeMethods.prototype.hour12 = function(date) {
		return date.getHours() % 12;
	};

	TimeMethods.prototype.min = function(date) {
		return date.getMinutes();
	};

	TimeMethods.prototype.sec = function(date) {
		return date.getSeconds();
	};

	TimeMethods.prototype.tv_usec = function(date) {
		return (date.valueOf() % 1000) * 1000;
	};

	TimeMethods.prototype.usec = TimeMethods.prototype.tv_usec;

	TimeMethods.prototype.wday = function(date) {
		return date.getDay();
	};

	TimeMethods.prototype.yday = function(date) {
		var secs;
		secs = date.getTime();
		return Math.floor(secs / 86400000);
	};

	TimeMethods.prototype.gmt_offset = function(date) {
		return date.getTimezoneOffset() * -60;
	};

	TimeMethods.prototype._offset_str = function(date) {
		var hour, mins, offset, sign;
		offset = _time.gmt_offset(date);
		mins = offset / 60;
		if (mins === 0) {
			return '+0000';
		}
		sign = mins > 0 ? '+' : '-';
		mins = Math.abs(mins);
		hour = this._rjust(Math.ceil(mins / 60));
		mins = this._rjust(mins % 60);
		return sign + hour + mins;
	};

	return TimeMethods;

})();

_time = R._time = function(time) {
	return new Chain(time, _time);
};

R.extend(_time, new TimeMethods());


var times = {
	year: 	31557600000,
	month: 	2629800000,
	week: 	604800000,
	day: 	86400000,
	hour: 	3600000,
	minute: 60000
}
var cardinalities = {
	day: 	7,
	month: 	12,
	week: 	52
}
var languages = {}
var defaultLanguage,
var functions = {
	time: 	getVagueTime,
	date: 	getVagueDate
}
function vagueDatetime(options) {
	var units = normalizeUnits(options.units),
		dateortime = options.dateortime || "time";
		now = Date.now(),
		from = normalizeTime(options.from, units, now),
		to = normalizeTime(options.to, units, now),
		difference = (from.timestamp || from) - (to.timestamp || to),
		absoluteDifference = Math.abs(difference),
		type;
	if(difference >= 0) {
		type = 'past';
	} else {
		type = 'future';
		difference = -difference;
	}
	if (dateortime === "time") {
		return estimateTime(difference, type, options.lang);
	}
	return estimateDate(absoluteDifference, from, to)
		|| getYearlyDifference(absoluteDifference, difference);
}

function normalizeUnits(units) {
	if(typeof units === 'undefined') {
		return 'ms';
	}
	if(units === 's' || units === 'ms') {
		return units;
	}
	throw new Error('Invalid units');
}


function normalizeTime(time, units, defaultTime) {
	if(typeof time === 'undefined') {
		return createTimeFrom(defaultTime);
	}
	if(typeof time === 'string') {
		time = parseInt(time, 10);
	}
	if(isNotDate(time) && isNotTimestamp(time)) {
		throw new Error('Invalid time');
	}
	if(typeof time === 'number' && units === 's') {
		time *= 1000;
	}
	return createTimeFrom(time);
}


function isNotDate(date) {
	// return isDate(date) === false;
	return Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime());
}

function isDate(date) {
	return Object.prototype.toString.call(date) === "[object Date]" && isNaN(date.getTime()) === false;
}

function isNotTimestamp(timestamp) {
	// return typeof timestamp !== 'number' || isNaN(timestamp);
	return isTimestamp(timestamp) === false;
}

function isTimestamp(timestamp) {
	return typeof timestamp === 'number' && isNaN(timestamp) === false;
}

function createTimeFrom(thing) {
	if(isDate(thing)) {
		return createTimeFromDate(thing);
	}
	if(isTimestamp(thing)) {
		return createTimeFromTimestamp(thing);
	}
}

function createTimeFromDate(date) {
	return createTime(date.getTime(), date);
}

function createTime(timestamp, date) {
	return {
		timestamp: timestamp,
		day: date.getDay(),
		week: getWeek(date),
		month: date.getMonth(),
		year: date.getYear()
	};
}

function getWeek(date) {
	var rollover = 0, yearStart = new Date(date.getFullYear(), 0, 1);
	if(yearStart.getDay() > date.getDay()) {
		rollover = 1;
	}
	return Math.floor((date.getTime() - yearStart.getTime()) / times.week) + rollover - 1;
}

function createTimeFromTimestamp(timestamp) {
	return createTime(timestamp, new Date(timestamp));
}

function estimateTime(difference, type, language) {
	var time, vagueTime, lang = languages[language] || languages[defaultLanguage];
	for(time in times) {
		if(times.hasOwnProperty(time) && difference >= times[time]) {
			vagueTime = Math.floor(difference / times[time]);
			return lang[type](vagueTime, lang[time][(vagueTime > 1)+0]);
		}
	}
	return lang.defaults[type];
}



function estimateDate(difference, from, to) {
	return estimateDay(difference, from, to) || estimateWeek(difference, from, to) || estimateMonth(difference, from, to) || estimateYear(from, to);
}

function estimateDay(difference, from, to) {
	return estimatePeriod(difference, 'day', from, to, 'today', 'tomorrow', 'yesterday');
}

function estimatePeriod(difference, period, from, to, current, next, previous) {
	if(difference < times[period] * 2) {
		if(from[period] === to[period]) {
			return current;
		}
		if(areConsecutive(from[period], to[period], cardinalities[period])) {
			return next;
		}
		if(areConsecutive(to[period], from[period], cardinalities[period])) {
			return previous;
		}
	}
}

function areConsecutive(lesser, greater, cardinality) {
	return lesser === greater - 1 ||(lesser === cardinality - 1 && greater === 0);
}

function estimateWeek(difference, from, to) {
	return estimateUniformPeriod(difference, 'week', from, to);
}

function estimateUniformPeriod(difference, period, from, to) {
	return estimatePeriod(difference, period, from, to, 'this ' + period, 'next ' + period, 'last ' + period);
}

function estimateMonth(difference, from, to) {
	return estimateUniformPeriod(difference, 'month', from, to);
}

function estimateYear(from, to) {
	if(from.year === to.year) {
		return 'this year';
	}
	if(from.year === to.year + 1) {
		return 'last year';
	}
	if(from.year === to.year - 1) {
		return 'next year';
	}
}

function getYearlyDifference(absoluteDifference, difference) {
	var years = Math.floor(absoluteDifference / times.year);
	if(difference < 0) {
		return 'in ' + years + ' years';
	}
	return years + ' years ago';
}



Date.formatFunctions = {count: 0};

if (!Date.prototype.toFormat) {
	Date.prototype.toFormat = function (format) {
		if (!Date.formatFunctions[format]) {
			Date.createNewFormat(format);
		}
		var func = Date.formatFunctions[format];
		return this[func]();
	};
}
Date.createNewFormat = function (format) {
	var funcName, code, k = [], i;
	funcName = "format" + Date.formatFunctions.count++;
	Date.formatFunctions[format] = funcName;
	code = "Date.prototype." + funcName + " = function (){return   ";
	format.replace(/\{([^\}]+|\})\}/g, function (sub, formatKey, index, str) {
		k[k.length] = {key: formatKey, idx: index};
		return '[' + k[k.length - 1].idx + ']';
	});
	for (i = 0; i < k.length; i++) {
		if (i === 0) {
			code += "'" + format.slice(0, k[i].idx).replace(/'/g, "\\'") + "' + ";
		} else {
			code += "'" + format.slice(k[i - 1].idx + k[i - 1].key.length + 2, k[i].idx).replace(/'/g, "\\'") + "' + ";
		}
		code += Date.getFormatCode(k[i].key);
		if (i === k.length - 1) {
			code += "'" + format.slice(k[i].idx + k[i].key.length + 2, format.length).replace(/'/g, "\\'") + "' + ";
		}
	}
	eval(code.substring(0, code.length - 3) + ";}");
};
Date.getFormatCode = function (formatKey) {
	switch (formatKey) {
	case "{":
		return "'{' + ";
	case "}":
		return "'}' + ";
	case "dim_28":
	case "t":
		return "this.getDaysInMonth() + ";
	case "dom":
	case "j":
		return "this.getDate() + ";
	case "dom_pad":
	case "d":
	case "%d":
	case "dd":
		return "this.getDate().pad(2) + ";
	case "dom_pads":
	case "%e":
		return "this.getDate().pad(2, ' ') + ";
	case "dom_suffix":
	case "S":
		return "this.getDate().getSuffix() + ";
	case "dow_0":
	case "w":
	case "%w":
		return "this.getDay() + ";
	case "dow_1":
	case "N":
	case "%u":
		return "(this.getDay() || 7) + ";
	case "dow_nam":
	case "D":
	case "%a":
	case "ddd":
		return "Date.dayNames[this.getDay()].substring(0, 3) + ";
	case "doy_0":
	case "z":
		return "this.getDayOfYear() + ";
	case "doy_1":
		return "(this.getDayOfYear()+1) + ";
	case "doy_1pad":
	case "%j":
		return "(this.getDayOfYear()+1).pad(3) + ";
	case "dt_loc":
	case "%x":
		return "this.toLocaleDateString() + ";
	case "dt_mdy":
	case "%D":
		return "(this.getMonth()+1).pad(2) + '/' + this.getDate().pad(2) + '/' + (this.getFullYear() % 100).pad(2) + ";
	case "dt_ymd":
		return "this.getFullYear() + '-' + (this.getMonth()+1).pad(2) + '-' + this.getDate().pad(2) + ";
	case "dtm_iso":
	case "c":
		return "this.getFullYear() + '-' + (this.getMonth()+1).pad(2) + '-' + this.getDate().pad(2) + 'T' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + ";
	case "dtm_loc":
	case "%c":
		return "this.toLocaleString() + ";
	case "dtm_ms":
		return "this.getTime() + ";
	case "dtm_rfc":
	case "r":
		return "Date.dayNames[this.getDay()].substring(0, 3) + ', ' + this.getDate().pad(2) + ' ' + Date.monthNames[this.getMonth()].substring(0, 3) + ' ' + this.getFullYear() + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + this.getGMTOffset() + ";
	case "dtm_s":
	case "U":
		return "Math.round(this.getTime() / 1000) + ";
	case "dtm_ymd_hm":
		return "this.getFullYear() + '-' + (this.getMonth()+1).pad(2) + '-' + this.getDate().pad(2) + ' ' + this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ";
	case "mo_0":
		return "this.getMonth() + ";
	case "mo_0pad":
		return "this.getMonth().pad(2) + ";
	case "mo_1":
	case "n":
		return "(this.getMonth()+1) + ";
	case "mo_1pad":
	case "m":
	case "%m":
	case "MM":
		return "(this.getMonth()+1).pad(2) + ";
	case "mo_nam":
	case "M":
	case "%b":
	case "%h":
	case "MMM":
		return "Date.monthNames[this.getMonth()].substring(0, 3) + ";
	case "mo_name":
	case "F":
	case "%B":
	case "%h":
	case "MMMM":
		return "Date.monthNames[this.getMonth()] + ";
	case "t_hm":
	case "%R":
		return "this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ";
	case "t_hma":
		return "((this.getHours() %12) ? this.getHours() % 12 : 12).pad(2) + ':' + this.getMinutes().pad(2) + ' ' + (this.getHours() < 12 ? 'am' : 'pm') + ";
	case "t_hms":
	case "%T":
		return "this.getHours().pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + ";
	case "t_hmsa":
	case "%r":
		return "((this.getHours() %12) ? this.getHours() % 12 : 12).pad(2) + ':' + this.getMinutes().pad(2) + ':' + this.getSeconds().pad(2) + ' ' + (this.getHours() < 12 ? 'am' : 'pm') + ";
	case "t_loc":
	case "%X":
		return "this.toLocaleTimeString() + ";
	case "ta_AM":
	case "A":
	case "AM":
		return "(this.getHours() < 12 ? 'AM' : 'PM') + ";
	case "ta_am":
	case "a":
	case "am":
		return "(this.getHours() < 12 ? 'am' : 'pm') + ";
	case "ta_loc":
	case "%p":
		return "(this.getHours() < 12 ? 'a.m.' : 'p.m.') + ";
	case "th_12":
	case "g":
		return "((this.getHours() %12) ? this.getHours() % 12 : 12) + ";
	case "th_12pad":
	case "h":
	case "%I":
	case "hh":
		return "((this.getHours() %12) ? this.getHours() % 12 : 12).pad(2) + ";
	case "th_24":
	case "G":
		return "this.getHours() + ";
	case "th_24pad":
	case "H":
	case "%H":
	case "HH":
		return "this.getHours().pad(2) + ";
	case "tm":
		return "this.getMinutes() + ";
	case "tm_pad":
	case "i":
	case "%M":
	case "mm":
		return "this.getMinutes().pad(2) + ";
	case "tms":
	case "u":
		return "this.getMilliseconds() + ";
	case "tms_pad":
	case "ms":
		return "this.getMilliseconds().pad(3) + ";
	case "ts":
		return "this.getSeconds() + ";
	case "ts_pad":
	case "s":
	case "%S":
	case "SS":
		return "this.getSeconds().pad(2) + ";
	case "tz_dst":
	case "I":
		return "( (this.getDSTOffset() != 0) ? 1 : 0 ) + ";
	case "tz_hm":
	case "O":
	case "zzzz":
		return "(this.getTimezoneOffset() > 0 ? '-' : '+') + Math.floor(this.getTimezoneOffset() / 60).pad(2) + (this.getTimezoneOffset() % 60).pad(2) + ";
	case "tz_h_m":
	case "P":
		return "(this.getTimezoneOffset() > 0 ? '-' : '+') + Math.floor(this.getTimezoneOffset() / 60).pad(2) + ':' + (this.getTimezoneOffset() % 60).pad(2) + ";
	case "tz_m":
		return "-this.getTimezoneOffset() + ";
	case "tz_nam":
	case "T":
		return "((this.toString().replace(/\\w{3} \\w{3} \\d{1,2}/, '').replace(/\\d{2}:\\d{2}:\\d{2}/, '').replace(/GMT[+-]\\d+/, '').replace(/[-]*\\d+/, '').replace(/ B\\.C\\./, '').trim().length == 3) ? this.toString().replace(/\\w{3} \\w{3} \\d{1,2}/, '').replace(/\\d{2}:\\d{2}:\\d{2}/, '').replace(/GMT[+-]\\d+/ , '').replace(/[-]*\\d+/ , '').replace(/ B\\.C\\./, '').trim() : this.toString().replace(/\\w{3} \\w{3} \\d{1,2}/, '').replace(/\\d{2}:\\d{2}:\\d{2}/, '').replace(/GMT[+-]\\d+/ , '').replace(/[-]*\\d+/ , '').replace(/ B\\.C\\./, '').replace(/(\\w)\\w+ (\\w)\\w+ (\\w)\\w+/, '$1$2$3').replace(/\\(|\\)/g, '')) + ";
	case "tz_name":
	case "e":
	case "%Z":
	case "Zzzz":
		return "this.toString().replace(/\\w{3} \\w{3} \\d{1,2}/, '').replace(/\\d{2}:\\d{2}:\\d{2}/, '').replace(/[^+-]\\d+/ , '') + ";
	case "tz_s":
	case "Z":
		return "(this.getTimezoneOffset() * -60) + ";
	case "wmon_iso":
	case "W":
	case "%V":
	case "week":
		return "this.getWeek('mon_iso') + ";
	case "wmon_jan":
		return "this.getWeek('mon_jan') + ";
	case "wmon_mon":
	case "%W":
		return "this.getWeek('mon_mon') + ";
	case "wsun_jan":
		return "this.getWeek('sun_jan') + ";
	case "wsun_sun":
	case "%U":
		return "this.getWeek('sun_jan') + ";
	case "y_c":
		return "Math.floor(this.getFullYear() / 100) + ";
	case "y_cpad":
	case "%C":
		return "Math.floor(this.getFullYear() / 100).pad(2) + ";
	case "y_leap":
	case "L":
		return "( (this.isLeapYear()) ? 1 : 0) + ";
	case "y_yyyy":
	case "y_yy":
	case "y":
	case "%y":
	case "yy":
		return "(this.getFullYear() % 100).pad(2) + ";
	case "y_yyyy":
	case "Y":
	case "%Y":
	case "yyyy":
		return "this.getFullYear() + ";
	case "y_yyyy_iso":
	case "o":
		return " ( (this.getWeek('mon_iso')>50 && this.getMonth()==0) ? this.getFullYear()-1 : this.getFullYear() ) + ";
	default:
		return "'" + formatKey.replace(/'/g, "\\'") + "' + ";
	}
};

Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.monthNumbers = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};
Date.msSecond = 1000;
Date.msMinute = 60000;
Date.msHour = 3600000;
Date.msDay = 86400000;
Date.msWeek = 604800000;
if (!Date.now) {
	Date.now = function () {
		var d = new Date();
		return d.getTime();
	};
}

(function () {
    var origParse = Date.parse;
    Date.parse = function (date) {
        var timestamp = origParse(date), minutesOffset = 0, struct;
        if (isNaN(timestamp) && (struct = /^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {
            if (struct[8] !== 'Z') {
                minutesOffset = +struct[10] * 60 + (+struct[11]);

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            if (!struct[7]) {
                struct[7] = '000';
            }

            timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +struct[7].substr(0, 3));
        }

        return timestamp;
    };
}());
Date.replaceChars = {
	shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	longMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	longDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
	D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
	j: function() { return this.getDate(); },
	l: function() { return Date.replaceChars.longDays[this.getDay()]; },
	N: function() { return this.getDay() + 1; },
	S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
	w: function() { return this.getDay(); },
	z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); },
	W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); },
	F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
	m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
	M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
	n: function() { return this.getMonth() + 1; },
	t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() },
	L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },
	o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();},
	Y: function() { return this.getFullYear(); },
	y: function() { return ('' + this.getFullYear()).substr(2); },
	a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
	A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
	B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); },
	g: function() { return this.getHours() % 12 || 12; },
	G: function() { return this.getHours(); },
	h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
	H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
	i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
	s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
	u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?	'0' : '')) + m; },
	e: function() { return "Not Yet Supported"; },
	I: function() { return "Not Yet Supported"; },
	O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
	P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; },
	T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
	Z: function() { return -this.getTimezoneOffset() * 60; },
	c: function() { return this.format("Y-m-d\\TH:i:sP"); },
	r: function() { return this.toString(); },
	U: function() { return this.getTime() / 1000; }
};

Date.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
Date.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
Date.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
Date.monthNumbers = {Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11};
Date.msSecond = 1000;
Date.msMinute = 60000;
Date.msHour = 3600000;
Date.msDay = 86400000;
Date.msWeek = 604800000;
var origParse = Date.parse;
Date.parse = function (date) {var timestamp = origParse(date), minutesOffset = 0, struct; if (isNaN(timestamp) && (struct = /^(\d{4}|[+\-]\d{6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3,}))?)?(?:(Z)|([+\-])(\d{2})(?::?(\d{2}))?))?/.exec(date))) {if (struct[8] !== 'Z') {minutesOffset = +struct[10] * 60 + (+struct[11]); if (struct[9] === '+') {minutesOffset = 0 - minutesOffset; } } if (!struct[7]) {struct[7] = '000'; } timestamp = Date.UTC(+struct[1], +struct[2] - 1, +struct[3], +struct[4], +struct[5] + minutesOffset, +struct[6], +struct[7].substr(0, 3)); } return timestamp; };

Date.age = function(dob) {var dateOfBirth = +new Date(dob); var age = ~~((Date.now() - dateOfBirth) / (31557600000)); return age; };
Date.ago = function(val) {val = 0 | (Date.now() - val) / 1000; var unit, length = { second: 60, minute: 60, hour: 24, day: 7, week: 4.35, month: 12, year: 10000 }, result; for (unit in length) {result = val % length[unit]; if (!(val = 0 | val / length[unit])) {return result + ' ' + (result-1 ? unit + 's' : unit); } } };
Date.agoFromNow = function(v) {if (v > Date.now()) {return ago(2 * Date.now() - v) + ' from now';} else {return ago(v) + ' ago';} };
Date.convert = function(sourceUnitName, destinationUnitName){var val = this.toString(); function getUnit(unitName){switch(unitName){case 'ms': case 'millisecond': return 1; case 's': case 'second': return 1000; case 'm': case 'minute': return 60000; case 'h': case 'hour': return 3600000; case 'd': case 'day': return 86400000; case 'w': case 'week': return 604800000; default: throw new Error('"'+ unitName + '" is not a valid unit'); } } destinationUnitName = destinationUnitName || 'ms'; return (val * getUnit(sourceUnitName)) / getUnit(destinationUnitName); };
Date.fromLong = function(dateAsLong) {var date = new Date(dateAsLong); return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes(); };
Date.fromMysql = function(datetime) {var t = datetime.split(/[- :]/); return new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]); };
Date.fromTimestamp = function(t) {var t = md.split(/[- :]/); var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]); return d; };
Date.now = function () {var d = new Date(); return d.getTime(); };
Date.prototype.format = function(format) {var returnStr = ''; var replace = Date.replaceChars; for (var i = 0; i < format.length; i++) {var curChar = format.charAt(i); if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {returnStr += curChar; } else if (replace[curChar]) {returnStr += replace[curChar].call(this); } else if (curChar != "\\"){returnStr += curChar; } } return returnStr; };
Date.prototype.getDayOfYear = function () {var num = 0, i; Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28; for (i = 0; i < this.getMonth(); ++i) {num += Date.daysInMonth[i]; } return num + this.getDate() - 1; };
Date.prototype.getDaysInMonth = function () {Date.daysInMonth[1] = this.isLeapYear() ? 29 : 28; return Date.daysInMonth[this.getMonth()]; };
Date.prototype.getDSTOffset = function () {var dGiven, sGivenU, dGivenU, dJan, sJanU, dJanU, diffStandardTimeMin, diffGivenTimeMin; dGiven = this; sGivenU = dGiven.toUTCString(); dGivenU = new Date(sGivenU.substring(0, sGivenU.lastIndexOf(" ") - 1)); dJan = new Date(dGiven.getFullYear(), 0, 1, 0, 0, 0, 0); sJanU = dJan.toUTCString(); dJanU = new Date(sJanU.substring(0, sJanU.lastIndexOf(" ") - 1)); diffStandardTimeMin = (dJan - dJanU) / (1000 * 60); diffGivenTimeMin = (dGiven - dGivenU) / (1000 * 60); return Math.abs(diffStandardTimeMin - diffGivenTimeMin); };
Date.prototype.getDSTOffsetLocale = function () {var dNow = new Date(), dJul, sJulU, dJulU, dJan, sJanU, dJanU, diffStandardTimeMin, diffDaylightTimeMin; dJul = new Date(dNow.getFullYear(), 6, 1, 0, 0, 0, 0); sJulU = dJul.toUTCString(); dJulU = new Date(sJulU.substring(0, sJulU.lastIndexOf(" ") - 1)); dJan = new Date(dNow.getFullYear(), 0, 1, 0, 0, 0, 0); sJanU = dJan.toUTCString(); dJanU = new Date(sJanU.substring(0, sJanU.lastIndexOf(" ") - 1)); diffStandardTimeMin = (dJan - dJanU) / (1000 * 60); diffDaylightTimeMin = (dJul - dJulU) / (1000 * 60); return Math.abs(diffStandardTimeMin - diffDaylightTimeMin); };
Date.prototype.getElapsed = function (A) {return Math.abs((A || new Date()).getTime() - this.getTime()); };
Date.prototype.getFirstDayOfMonth = function () {var day = (this.getDay() - (this.getDate() - 1)) % 7; return (day < 0) ? (day + 7) : day; };
Date.prototype.getGMTOffset = function () {return (this.getTimezoneOffset() > 0 ? "-" : "+") + Math.floor(this.getTimezoneOffset() / 60).pad(2) + (this.getTimezoneOffset() % 60).pad(2); };
Date.prototype.getLastDayOfMonth = function () {var day = (this.getDay() + (Date.daysInMonth[this.getMonth()] - this.getDate())) % 7; return (day < 0) ? (day + 7) : day; };
Date.prototype.getWeek = function (flag) {var jan1 = new Date(this.getFullYear(), 0, 1), d_dow, jan1_dow, d1w1, daysDiff, wk, dPrev, dPrev_dow, jan1Prev, jan1Prev_dow, d1w1Prev, daysDiffPrev; switch (flag) {case 'mon_iso': d_dow = this.getDay() || 7; jan1_dow = jan1.getDay() || 7; d1w1 = new Date(jan1.getTime() + (jan1_dow > 4 ? 8 - jan1_dow : -(jan1_dow - 1)) * 1000 * 60 * 60 * 24); break; case 'mon_jan': d_dow = this.getDay() || 7; jan1_dow = jan1.getDay() || 7; d1w1 = new Date(jan1.getTime() - (jan1_dow - 1) * 1000 * 60 * 60 * 24); break; case 'mon_mon': d_dow = this.getDay() || 7; jan1_dow = jan1.getDay() || 7; d1w1 = new Date(jan1.getTime() + (jan1_dow === 1 ? 0 : 8 - jan1_dow) * 1000 * 60 * 60 * 24); break; case 'sun_sun': d_dow = this.getDay(); jan1_dow = jan1.getDay(); d1w1 = new Date(jan1.getTime() + (jan1_dow === 0 ? 0 : 7 - jan1_dow) * 1000 * 60 * 60 * 24); break; default: d_dow = this.getDay(); jan1_dow = jan1.getDay(); d1w1 = new Date(jan1.getTime() - (jan1_dow) * 1000 * 60 * 60 * 24); } daysDiff = Math.floor((this.getTime() - d1w1.getTime()) / 1000 / 60 / 60 / 24); wk = Math.floor((daysDiff / 7) + 1); if (flag === 'mon_iso' && wk === 0) {dPrev = new Date(this.getFullYear() - 1, 11, 31); dPrev_dow = dPrev.getDay() || 7; jan1Prev = new Date(dPrev.getFullYear(), 0, 1); jan1Prev_dow = jan1Prev.getDay() || 7; d1w1Prev = new Date(jan1Prev.getTime() + (jan1Prev_dow > 4 ? 8 - jan1Prev_dow : -(jan1Prev_dow - 1)) * 1000 * 60 * 60 * 24); daysDiffPrev = Math.floor((dPrev.getTime() - d1w1Prev.getTime()) / 1000 / 60 / 60 / 24); wk =  Math.floor((daysDiffPrev / 7) + 1); } return wk.pad(2); };
Date.prototype.isAfter = function(d) {return this.getTime() > d.getTime(); };
Date.prototype.isBefore = function(d) {return this.getTime() < d.getTime(); };
Date.prototype.isFuture = function(d) {if (d == null) {d = this; } return this.getTime() > d.getTime(); };
Date.prototype.isLeapYear = function () {var year = this.getFullYear(); return ((year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0))); };
Date.prototype.isLeapYear = function() {var year; year = this.getFullYear(); return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0); };
Date.prototype.isPast = function(d) {if (d == null) {d = this; } return this.getTime() < d.getTime(); };
Date.prototype.isValid = function() {return !this.getTime().isNaN(); };
Date.prototype.isWeekday = function() {return this.getUTCDay() > 0 && this.getUTCDay() < 6; };
Date.prototype.isWeekend = function() {return this.getUTCDay() === 0 || this.getUTCDay() === 6; };

