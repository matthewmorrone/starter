
// libbcmath.js
/**
 * BC Math Library for Javascript
 * Ported from the PHP5 bcmath extension source code,
 * which uses the libbcmath package...
 *    Copyright (C) 1991, 1992, 1993, 1994, 1997 Free Software Foundation, Inc.
 *    Copyright (C) 2000 Philip A. Nelson
 *     The Free Software Foundation, Inc.
 *     59 Temple Place, Suite 330
 *     Boston, MA 02111-1307 USA.
 *      e-mail:  philnelson@acm.org
 *     us-mail:  Philip A. Nelson
 *               Computer Science Department, 9062
 *               Western Washington University
 *               Bellingham, WA 98226-9062
 *
 * bcmath-js homepage:
 *
 * This code is covered under the LGPL licence, and can be used however you want :)
 * Be kind and share any decent code changes.
 */

var libbcmath = {
  PLUS: '+',
  MINUS: '-',
  BASE: 10,           // must be 10 (for now)
  scale: 0,           // default scale

  /**
     * Basic number structure
     */
  bc_num: function() {
    this.n_sign = null; // sign
    this.n_len = null;  /* (int) The number of digits before the decimal point. */
    this.n_scale = null; /* (int) The number of digits after the decimal point. */
    //this.n_refs = null; /* (int) The number of pointers to this number. */
    //this.n_text = null; /* ?? Linked list for available list. */
    this.n_value = null;  /* array as value, where 1.23 = [1,2,3] */
    this.toString = function() {
      var r, tmp;
      tmp = this.n_value.join('');

      // add minus sign (if applicable) then add the integer part
      r = ((this.n_sign == libbcmath.PLUS) ? '' : this.n_sign) + tmp.substr(0, this.n_len);

      // if decimal places, add a . and the decimal part
      if (this.n_scale > 0) {
        r += '.' + tmp.substr(this.n_len, this.n_scale);
      }
      return r;
    };
  },

  /**
     * @param int length
     * @param int scale
     * @return bc_num
     */
  bc_new_num: function(length, scale) {
    var temp; // bc_num
    temp = new libbcmath.bc_num();
    temp.n_sign = libbcmath.PLUS;
    temp.n_len = length;
    temp.n_scale = scale;
    temp.n_value = libbcmath.safe_emalloc(1, length + scale, 0);
    libbcmath.memset(temp.n_value, 0, 0, length + scale);
    return temp;
  },

  safe_emalloc: function(size, len, extra) {
    return Array((size * len) + extra);
  },

  /**
     * Create a new number
     */
  bc_init_num: function() {
    return new libbcmath.bc_new_num(1, 0);

  },

  _bc_rm_leading_zeros: function(num) {
    /* We can move n_value to point to the first non zero digit! */
    while ((num.n_value[0] === 0) && (num.n_len > 1)) {
      num.n_value.shift();
      num.n_len--;
    }
  },

  /**
     * Convert to bc_num detecting scale
     */
  php_str2num: function(str) {
    var p;
    p = str.indexOf('.');
    if (p == -1) {
      return libbcmath.bc_str2num(str, 0);
    } else {
      return libbcmath.bc_str2num(str, (str.length - p));
    }

  },

  CH_VAL: function(c) {
    return c - '0'; //??
  },

  BCD_CHAR: function(d) {
    return d + '0'; // ??
  },

  isdigit: function(c) {
    return (isNaN(parseInt(c, 10)) ? false : true);
  },

  bc_str2num: function(str_in, scale) {
    var str, num, ptr, digits, strscale, zero_int, nptr;
    // remove any non-expected characters
    /* Check for valid number and count digits. */

    str = str_in.split(''); // convert to array
    ptr = 0;    // str
    digits = 0;
    strscale = 0;
    zero_int = false;
    if ((str[ptr] === '+') || (str[ptr] === '-')) {
      ptr++;  /* Sign */
    }
    while (str[ptr] === '0') {
      ptr++;            /* Skip leading zeros. */
    }
    //while (libbcmath.isdigit(str[ptr])) {
    while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
      ptr++;
      digits++;    /* digits */
    }

    if (str[ptr] === '.') {
      ptr++;            /* decimal point */
    }
    //while (libbcmath.isdigit(str[ptr])) {
    while ((str[ptr]) % 1 === 0) { //libbcmath.isdigit(str[ptr])) {
      ptr++;
      strscale++;    /* digits */
    }

    if ((str[ptr]) || (digits + strscale === 0)) {
      // invalid number, return 0
      return libbcmath.bc_init_num();
      //*num = bc_copy_num (BCG(_zero_));
    }

    /* Adjust numbers and allocate storage and initialize fields. */
    strscale = libbcmath.MIN(strscale, scale);
    if (digits === 0) {
      zero_int = true;
      digits = 1;
    }

    num = libbcmath.bc_new_num(digits, strscale);

    /* Build the whole number. */
    ptr = 0; // str
    if (str[ptr] === '-') {
      num.n_sign = libbcmath.MINUS;
      //(*num)->n_sign = MINUS;
      ptr++;
    } else {
      num.n_sign = libbcmath.PLUS;
      //(*num)->n_sign = PLUS;
      if (str[ptr] === '+') {
        ptr++;
      }
    }
    while (str[ptr] === '0') {
      ptr++;            /* Skip leading zeros. */
    }

    nptr = 0; //(*num)->n_value;
    if (zero_int) {
      num.n_value[nptr++] = 0;
      digits = 0;
    }
    for (; digits > 0; digits--) {
      num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
      //*nptr++ = CH_VAL(*ptr++);
    }

    /* Build the fractional part. */
    if (strscale > 0) {
      ptr++;  /* skip the decimal point! */
      for (; strscale > 0; strscale--) {
        num.n_value[nptr++] = libbcmath.CH_VAL(str[ptr++]);
      }
    }

    return num;
  },

  cint: function(v) {
    if (typeof(v) == 'undefined') {
      v = 0;
    }
    var x = parseInt(v, 10);
    if (isNaN(x)) {
      x = 0;
    }
    return x;
  },

  /**
     * Basic min function
     * @param int
     * @param int
     */
  MIN: function(a, b) {
    return ((a > b) ? b : a);
  },

  /**
     * Basic max function
     * @param int
     * @param int
     */
  MAX: function(a, b) {
    return ((a > b) ? a : b);
  },

  /**
     * Basic odd function
     * @param int
     * @param int
     */
  ODD: function(a) {
    return (a & 1);
  },

  /**
     * replicate c function
     * @param array     return (by reference)
     * @param string    char to fill
     * @param int       length to fill
     */
  memset: function(r, ptr, chr, len) {
    var i;
    for (i = 0; i < len; i++) {
      r[ptr + i] = chr;
    }
  },

  /**
     * Replacement c function
     * Obviously can't work like c does, so we've added an "offset" param so you could do memcpy(dest+1, src, len) as memcpy(dest, 1, src, len)
     * Also only works on arrays
     */
  memcpy: function(dest, ptr, src, srcptr, len) {
    var i;
    for (i = 0; i < len; i++) {
      dest[ptr + i] = src[srcptr + i];
    }
    return true;
  },


  /**
     * Determine if the number specified is zero or not
     * @param bc_num num    number to check
     * @return boolean      true when zero, false when not zero.
     */
  bc_is_zero: function(num) {
    var count; // int
    var nptr; // int

    /* Quick check. */
    //if (num == BCG(_zero_)) return TRUE;

    /* Initialize */
    count = num.n_len + num.n_scale;
    nptr = 0; //num->n_value;

    /* The check */
    while ((count > 0) && (num.n_value[nptr++] === 0)) {
      count--;
    }

    if (count !== 0) {
      return false;
    } else {
      return true;
    }
  },

  bc_out_of_memory: function() {
    throw new Error('(BC) Out of memory');
  }
};





// bcmath-js




// bcpow.js
function bcpow(left, right, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: Robin Speekenbrink (http://www.kingsquare.nl/))

  var out = Math.pow(left, right);
  if (typeof precision !== 'undefined') {
    out = Math.round(Math.round(out * Math.pow(10, scale + 1)) / Math.pow(10, 1)) / Math.pow(10, scale);
  }
  return out;
}




// bcpowmod.js
// Not yet ported. Feel like it?




// bcscale.js
// Not yet ported. Feel like it?




// bcsqrt.js
function bcsqrt(operand, scale) {
  // http://kevin.vanzonneveld.net
  // +   original by: Robin Speekenbrink (http://www.kingsquare.nl/))

  var out = Math.sqrt(operand);
  if (typeof precision !== 'undefined') {
    out = Math.round(Math.round(out * Math.pow(10, scale + 1)) / Math.pow(10, 1)) / Math.pow(10, scale);
  }
  return out;
}




// easter_date.js
function easter_date(year) {
  // Based on algorithm from polish wikipedia (http://pl.wikipedia.org/wiki/Wielkanoc)

  year = isNaN(year) ? new Date().getFullYear() : +year;

  var a = year % 19,
      b = year / 100 | 0,
      c = year % 100,
      h = (19 * a + b - (b / 4 | 0) - ((b - ((b + 8) / 25 | 0) + 1) / 3 | 0) + 15) % 30,
      l = (32 + 2 * (b % 4) + 2 * (c / 4 | 0) - h - c % 4) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451);

  return new Date(year, Math.floor((h + l - 7 * m + 114) / 31) - 1, (h + l - 7 * m + 114) % 31 + 1) / 1e3 | 0;

}




// get_called_class.js
// We are not going to port this




// get_declared_interfaces.js
// We are not going to port this




// get_parent_class.js
// We are not going to port this




// interface_exists.js
// We are not going to port this




// is_a.js
// We are not going to port this




// is_subclass_of.js
// We are not going to port this




// date_create.js
function date_create(time, timezone) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: DateTime
  // *     example 1: var tzo = timezone_open('Asia/Hong_Kong');
  // *     example 1: date_create('now', tzo);
  // *     returns 1: {}

  return new this.DateTime(time, timezone);
}




// date_interval_create_from_date_string.js
function date_interval_create_from_date_string(time) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: DateInterval
  // *     example 1: date_interval_create_from_date_string('+1 day');
  // *     returns 1: {}

  // Fix: need to check the example above
  return new this.DateInterval(time);
}




// date_parse_from_format.js
function date_parse_from_format(format, dateArg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: strtotime
  // -    depends on: date
  // -    depends on: date_parse
  // *     example 1: date_parse_from_format('j.n.Y H:iP', '6.1.2009 13:00+01:00');
  // *     returns 1: {year : 2006, month: 12, day: 12, hour: 10, minute: 0, second: 0, fraction: 0.5, warning_count: 0, warnings: [], error_count: 0, errors: [], is_localtime: false, zone_type: 1, zone: -60, is_dst:false}

  var newtime = 0, retObj = {};

  var _dst = function(t) {
    // Calculate Daylight Saving Time (derived from gettimeofday() code)
    var dst = 0;
    var jan1 = new Date(t.getFullYear(), 0, 1, 0, 0, 0, 0);  // jan 1st
    var june1 = new Date(t.getFullYear(), 6, 1, 0, 0, 0, 0); // june 1st
    var temp = jan1.toUTCString();
    var jan2 = new Date(temp.slice(0, temp.lastIndexOf(' ') - 1));
    temp = june1.toUTCString();
    var june2 = new Date(temp.slice(0, temp.lastIndexOf(' ') - 1));
    var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);
    var daylight_time_offset = (june1 - june2) / (1000 * 60 * 60);

    if (std_time_offset === daylight_time_offset) {
      dst = false; // daylight savings time is NOT observed
    }
    else {
      // positive is southern, negative is northern hemisphere
      var hemisphere = std_time_offset - daylight_time_offset;
      if (hemisphere >= 0) {
        std_time_offset = daylight_time_offset;
      }
      dst = true; // daylight savings time is observed
    }
    return dst;
  };

  try {
    newtime = 0; // fix: needs to use format, dateArg to return a time
    retObj = this.date_parse(newtime);
  }
  catch (e) {
    return false; // Presumably returns false, as with date_parse()
  }

  retObj.is_dst = _dst(newtime);

  // Fix: need to add the following as well
  //zone_type: TIMELIB_ZONETYPE_OFFSET 1, TIMELIB_ZONETYPE_ABBR   2, TIMELIB_ZONETYPE_ID     3
  //zone: -60

  return retObj;
}




// date_sun_info.js
// Not yet ported. Feel like it?




// date_sunrise.js
// Not yet ported. Feel like it?




// date_sunset.js
function date_sunset(timestamp, format, latitude, longitude, zenith, gmt_offset) {
  // depends on: ini_get

  var calc_sunset = 1; // One part that differs from date_sunrise

  var SUNFUNCS_RET_STRING = 1, SUNFUNCS_RET_TIMESTAMP = 0, SUNFUNCS_RET_DOUBLE = 2;

  format = format || SUNFUNCS_RET_STRING,
  latitude = latitude || this.ini_get('date.default_latitude'),
  longitude = longitude || this.ini_get('date.default_longitude'),
  zenith = zenith || (calc_sunset) ? this.ini_get('date.sunset_zenith') : this.ini_get('date.sunrise_zenith');

  var altitude;
	var h_rise, h_set, n;
	var rise, set, transit;
	var time;
	var rs;
	var t;
	var tzi;
	var retstr;

	if (!arguments.length || arguments.length > 6) {
    // throw "invalid format"; // warning
    return false;
	}

	if (format !== SUNFUNCS_RET_TIMESTAMP &&
		format !== SUNFUNCS_RET_STRING &&
		format !== SUNFUNCS_RET_DOUBLE) {
		// throw "Wrong return format given, pick one of SUNFUNCS_RET_TIMESTAMP, SUNFUNCS_RET_STRING or SUNFUNCS_RET_DOUBLE"; // warning
		return false;
	}
	altitude = 90 - zenith;

	/* Initialize time struct */
	t = timelib_time_ctor();
	tzi = get_timezone_info(TSRMLS_C);
	// t->tz_info = tzi;
	// t->zone_type = TIMELIB_ZONETYPE_ID;

  gmt_offset = gmt_offset || Math.floor(timelib_get_current_offset(t) / 3600);

	timelib_unixtime2local(t, time);
	rs = timelib_astro_rise_set_altitude(t, longitude, latitude, altitude, altitude > -1 ? 1 : 0,
      h_rise, h_set, rise, set, transit);
	timelib_time_dtor(t);

	if (rs != 0) {
		return false;
	}

	if (format == SUNFUNCS_RET_TIMESTAMP) {
		return Math.floor(calc_sunset ? set : rise);
	}
	n = (calc_sunset ? h_set : h_rise) + gmt_offset;

	if (n > 24 || n < 0) {
		n -= Math.floor(n / 24) * 24;
	}

	switch (format) {
		case SUNFUNCS_RET_STRING:
			retstr = spprintf('%02d:%02d', Math.floor(n), Math.floor(60 * (n - Math.floor(n))));
			return retstr;
		case SUNFUNCS_RET_DOUBLE:
			return n;
	}
  return false; // Shouldn't get here
}




// DateInterval.js
function DateInterval(interval_spec) { // string
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: date_interval_create_from_date_string
  // *     example 1: var di = new DateInterval('P2Y4DT6H8M');
  // *     example 1: di.d === 4;
  // *     returns 1: true

  var that = this,
      matches, weeks = false,
      dec = '(?:(\\d+(?:[.,]\\d*)?)', // Must decimal be followed by number?
      _pad = function(n, c) {
            if ((n = n + '').length < c) {
                return new Array(++c - n.length).join('0') + n;
            }
            return n;
      };
  if (!this.DateInterval.prototype.format) { // We need to place here for compilation reasons
    var DateInterval = this.DateInterval;
    DateInterval.prototype = {
      constructor: DateInterval,
      format: function(format) {
        return format.replace(/%([%YyMmDdaHhIiSsRr])/, function(n0, n1) {
          switch (n1) {
            case '%':
              return '%';
            case 'Y': case 'M': case 'D': case 'H': case 'I': case 'S':
              var l = n1.toLowerCase();
              return _pad(that[l], 2);
            case 'y': case 'm': case 'd': case 'h': case 'i': case 's':
              return that[n1];
            case 'a':
              return that.days;
            case 'R':
              return that.invert ? '-' : '+';
            case 'r':
              return that.invert ? '-' : '';
            default:
              throw 'Unexpected character in DateInterval.format replace';
          }
        });
      }
    };
    DateInterval.createFromDateString = function(time) { // string (date string with relative parts)
      return that.date_interval_create_from_date_string(time);
    };
  }

  try {
    if ((matches = interval_spec.match(/^P(\d+)W$/))) {
      this.d = 7 * matches[1];
      weeks = true;
    }
    else if ((matches = interval_spec.match(new RegExp(
        '^P' + dec + 'Y)?' + dec + 'M)?' + dec + 'D)?(?:T' + dec + 'H)?' + dec + 'M)?' + dec + 'S)?)?$'
        )))) {
      var mj = matches.join('');
      if (
          mj.match(/[.,]\d+../) || // Decimal used in non-lowest position
          mj.replace(/[.,]/g, '').length < 3 // Only P and/or T
      ) {
        throw 'Handle-below';
      }
    }
    else if (!(matches = interval_spec.match(
        /^P(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[0-1])T([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
        ))) {
      throw 'Handle-below';
    }
  }
  catch (e) {
    throw 'Malformed DateInterval'; // Throw exception from single place
  }
  if (!weeks) {
    this.y = matches[1] || 0;
    this.m = matches[2] || 0;
    this.d = matches[3] || 0;
    this.h = matches[4] || 0;
    this.i = matches[5] || 0;
    this.s = matches[6] || 0;
  }
  this.invert = 0; // or 1; Fix: Must be changed directly to work?
  this.days = this.d || false; // Fix: When will it not be determinable (to be false); how to determine conversion from months?
}




// DatePeriod.js
function DatePeriod(start, interval, recurrences, options) { // DateTime, DateInterval, int, int
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: new DatePeriod();
  // *     returns 1: {}

  // Finish example above

  // Is iteratable with foreach in PHP; this class is just put here for convenience,
  // as there is no PHP function that returns it; it is just placed here as a related class,
  // see http://en.wikipedia.org/wiki/ISO_8601#Durations

  if (!this.DatePeriod.EXCLUDE_START_DATE) { // We need to place here for compilation reasons
    var DatePeriod = this.DatePeriod;
    // See https://developer.mozilla.org/en/New_in_JavaScript_1.7#Iterators
    DatePeriod.prototype.__iterator__ = function() { // Mozilla/Chrome/Safari only; will allow DatePeriod to be iterated with for...in or for each
      return Iterator(this.data, false); // Allow both key and value to be passed back? (otherwise, 2nd arg is true);
      // need destructuring to get individually; might also use our implementation of foreach to do without this
      // Mozilla-only approach, but it will require use of (and adaptation of) our foreach()
    };
    DatePeriod.EXCLUDE_START_DATE = 1;
  }

  // or start, interval, end, options
  // or isostr, options
  if (options) { // the only optional part in all 3 constructor forms
  }
}




// DateTime.js
function DateTime(time, timezone) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: strtotime
  // -    depends on: DateInterval
  // *     example 1: var tzo = timezone_open('Asia/Hong_Kong');
  // *     example 1: new DateTime('now', tzo);
  // *     returns 1: {}

  // Incomplete

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  if (!this.php_js.Relator) {
    this.php_js.Relator = function() {// Used this functional class for giving privacy to the class we are creating
      // Code adapted from http://www.devpro.it/code/192.html
      // Relator explained at http://webreflection.blogspot.com/2008/07/javascript-relator-object-aka.html
      // Its use as privacy technique described at http://webreflection.blogspot.com/2008/10/new-relator-object-plus-unshared.html
      // 1) At top of closure, put: var __ = Relator.$();
      // 2) In constructor, put: var _ = __.constructor(this);
      // 3) At top of each prototype method, put: var _ = __.method(this);
      // 4) Use like:  _.privateVar = 5;
      function _indexOf(value) {
        for (var i = 0, length = this.length; i < length; i++) {
          if (this[i] === value) {
            return i;
          }
        }
        return -1;
      }
      function Relator() {
        var Stack = [], Array = [];
        if (!Stack.indexOf) {
          Stack.indexOf = _indexOf;
        }
        return {
          // create a new relator
          $: function() {
            return Relator();
          },
          constructor: function(that) {
            var i = Stack.indexOf(that);
            ~i ? Array[i] : Array[Stack.push(that) - 1] = {};
            this.method(that).that = that;
            return this.method(that);
          },
          method: function(that) {
            return Array[Stack.indexOf(that)];
          }
        };
      }
      return Relator();
    }();
  }
  // END REDUNDANT

  var __ = this.php_js.DateTimeRelator = this.php_js.DateTimeRelator || this.php_js.Relator.$(),
      _ = __.constructor(this),
      that = this;

  // DateInterval Returned by DateTime.diff()  (cf. date_interval_create_from_date_string())

  // Redefine DateTimeZone here for use below (see timezone_open())

  if (!this.DateTime.prototype.add) {
    var DateTime = this.DateTime;
    DateTime.prototype = {
      constructor: DateTime,
      add: function(/*DateInterval*/ interval) {
        return this;
      },
      diff: function(/*DateTime*/ datetime, /*optional bool*/ absolute) {return DateInterval;},
      format: function(/*string*/ format) {return '';},
      getOffset: function() {return 0;},
      getTimestamp: function() {var _ = __.method(this);
        return that.strtotime(_.time + ' +' + $timezone_offset + ' hours');
      },
      getTimezone: function() {var _ = __.method(this);
        return that.timezone_open(_.timezone);
      },
      modify: function(/*string */ modify) {return this;},
      setDate: function(/*int*/ year, /*int*/ month , /*int*/ day) {return this;},
      setISODate: function(/*int*/ year, /*int*/ week, /*optional int*/ day) {return this;},
      setTime: function(/*int*/ hour , /*int*/ minute, /*optional int*/ second) {return this;},
      setTimestamp: function(/*int*/ unixtimestamp) {return this;},
      setTimezone: function(/*DateTimeZone*/ timezone) {return this;},
      sub: function(/*DateInterval*/ interval) {return this;},
      __wakeup: function() {
        return new DateTime();
      }
    };
    DateTime.createFromFormat = function(/*string*/ format , /*string*/ time, /*optional DateTimeZone*/ timezone) {
      return new DateTime();
    };
    DateTime.__set_state = function(/*array*/ array) {
      return new DateTime();
    };
    DateTime.getLastErrors = function() {
      return [];
    };

    DateTime.ATOM = 'Y-m-d\\TH:i:sP';
    DateTime.COOKIE = 'l, d-M-y H:i:s T';
    DateTime.ISO8601 = 'Y-m-d\\TH:i:sO';
    DateTime.RFC822 = 'D, d M y H:i:s O';
    DateTime.RFC850 = 'l, d-M-y H:i:s T';
    DateTime.RFC1036 = 'D, d M y H:i:s O';
    DateTime.RFC1123 = 'D, d M Y H:i:s O';
    DateTime.RFC2822 = 'D, d M Y H:i:s O';
    DateTime.RFC3339 = 'Y-m-d\\TH:i:sP';
    DateTime.RSS = 'D, d M Y H:i:s O';
    DateTime.W3C = 'Y-m-d\\TH:i:sP';
  }

  // Depends on strtotime() and optionally accepts DateTimeZone object
  if (!time) {
    time = 'now';
  }
  _.time = time;

  if (!timezone) {
    _.timezone = null;
  }
  else {
    _.timezone = timezone.getName();
  }

}




// DateTimeZone.js
function DateTimeZone($timezone) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   derived from: Andrea Giammarchi
  // -    depends on: timezone_abbreviations_list()
  // -    depends on: timezone_identifiers_list()
  // -    depends on: timezone_transitions_get()
  // %        note 1: Creates a DateTimeZone() object as in PHP, but we really
  // %        note 1: need to implement DateTime() and possibly fix some
  // %        note 1: methods here
  // *     example 1: new DateTimeZone('Europe/Prague'); // Can't convert to string in PHP; returns the DTZ object
  // *     returns 1: {}

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  if (!this.php_js.Relator) {
    this.php_js.Relator = function() {// Used this functional class for giving privacy to the class we are creating
      // Code adapted from http://www.devpro.it/code/192.html
      // Relator explained at http://webreflection.blogspot.com/2008/07/javascript-relator-object-aka.html
      // Its use as privacy technique described at http://webreflection.blogspot.com/2008/10/new-relator-object-plus-unshared.html
      // 1) At top of closure, put: var __ = Relator.$();
      // 2) In constructor, put: var _ = __.constructor(this);
      // 3) At top of each prototype method, put: var _ = __.method(this);
      // 4) Use like:  _.privateVar = 5;
      function indexOf(value) {
        for (var i = 0, length = this.length; i < length; i++) {
          if (this[i] === value) {
            return i;
          }
        }
        return -1;
      }
      function Relator() {
        var Stack = [], Array = [];
        if (!Stack.indexOf) {
          Stack.indexOf = indexOf;
        }
        return {
          // create a new relator
          $: function() {
            return Relator();
          },
          constructor: function(that) {
            var i = Stack.indexOf(that);
            ~i ? Array[i] : Array[Stack.push(that) - 1] = {};
            this.method(that).that = that;
            return this.method(that);
          },
          method: function(that) {
            return Array[Stack.indexOf(that)];
          }
        };
      }
      return Relator();
    }();
  }
  // END REDUNDANT

  var __ = this.php_js.DateTimeZoneRelator = this.php_js.DateTimeZoneRelator || this.php_js.Relator.$(),
      _ = __.constructor(this),
      that = this;

  if (!this.DateTimeZone.AFRICA) {
    var DateTimeZone = this.DateTimeZone;
    DateTimeZone.prototype = {
      constructor: DateTimeZone,
      getLocation: function() {
        throw 'Apparently not implemented in PHP';
        // return {'country_code': 'CZ', 'latitude': 50.08333, 'longitude': 14.43333, comments:''};
      },
      getName: function() {var _ = __.method(this);
        return _.timezone;
      },
      getOffset: function(datetime) { // DateTime
        return datetime.getOffset(); // Fix: how to use rules of this object?
      },
      getTransitions: function(begin, end) {return that.timezone_transitions_get(this, begin, end);},
      listAbbreviations: function() {return that.timezone_abbreviations_list();},
      listIdentifiers: function(what, country) {return that.timezone_identifiers_list(what, country);}
    };
    DateTimeZone.AFRICA = 1;
    DateTimeZone.AMERICA = 2;
    DateTimeZone.ANTARCTICA = 4;
    DateTimeZone.ARCTIC = 8;
    DateTimeZone.ASIA = 16;
    DateTimeZone.ATLANTIC = 32;
    DateTimeZone.AUSTRALIA = 64;
    DateTimeZone.EUROPE = 128;
    DateTimeZone.INDIAN = 256;
    DateTimeZone.PACIFIC = 512;
    DateTimeZone.UTC = 1024;
    DateTimeZone.ALL = 2047;
    DateTimeZone.ALL_WITH_BC = 4095;
    DateTimeZone.PER_COUNTRY = 4096;
  }

  // END REDUNDANT
  _.timezone = $timezone;
}




// timezone_open.js
function timezone_open(timezone) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: DateTimeZone
  // *     example 1: timezone_open('Europe/Prague'); // Can't convert to string in PHP; returns the DTZ object
  // *     returns 1: {}

  return new this.DateTimeZone(timezone);
}





// timezone_version_get.js
// We are not going to port this




// chdir.js
// We are not going to port this




// chroot.js
// We are not going to port this




// closedir.js
// We are not going to port this




// dir.js
// We are not going to port this




// getcwd.js
// We are not going to port this




// opendir.js
// We are not going to port this




// readdir.js
// We are not going to port this




// rewinddir.js
// We are not going to port this




// scandir.js
// We are not going to port this




// debug_backtrace.js
function debug_backtrace(provide_object) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Mozilla only
  // %          note 2: Since "function" is a reserved word in JavaScript (even as a property), you must use
  // %          note 2:   the ['function'] notation to get the returned object's arrays' "function" property name
  // *     example 1: function test () {var b = debug_backtrace();return b[0]['function'];}
  // *     example 1: test();
  // *     returns 1: 'test'

  var funcName, line, file, fileLine = '', lastColonPos = -1,
      className, object, type,
      args = Array.prototype.slice.call(arguments),
      olderFunc,
      i = 0,
      backtraceArray = [], olderArgs = arguments,
      stackItem = '',
      lastAtPos = -1, firstParenthPos = -1;
  var getFuncName = function(fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };


  // (void 0) is undefined in argument list
  try {
    throw new Error();
  }
  catch (e) {
    var stackArr = e.stack.replace(/\n$/, '').split('\n').slice(2);
  }
  // a()@file:///C:/Users/Brett/Desktop/PHP_JS/debug_backtrace.xul:7,@file:///C:/Users/Brett/Desktop/PHP_JS/debug_backtrace.xul:16

  for (i = 0; i < stackArr.length; i++) {
    stackItem = stackArr[i];

    // Will not work if parentheses (or ampersands) are in the file name! (other option would be worse, as arguments couldn't have @ or )
    lastAtPos = stackItem.lastIndexOf('@') + 1;
    fileLine = stackItem.slice(lastAtPos);
    lastColonPos = fileLine.lastIndexOf(':') + 1;
    line = fileLine.slice(lastColonPos);
    file = fileLine.slice(0, lastColonPos - 1);

    //firstParenthPos = stackItem.indexOf('(')-1;
    //funcName = stackItem.slice(0, firstParenthPos);

    if (stackItem[0] === '@') { // this is global scope (must be i >= 1)
      // Fix: can add support for included/required files?
      // Fix: arguments returned are mismatched? ignore the last line number/call, since is call to debug_backtrace()?
      continue; // delete this when fix
    }
    else {
      olderArgs = olderArgs.callee.caller.arguments;
      args = Array.prototype.slice.call(olderArgs);
      olderFunc = olderFunc ? olderFunc.caller : arguments.callee.caller;
      funcName = getFuncName(olderFunc);
    }
    className = ''; // Not supported
    type = ''; // Special '->' and '::' values not supported for method or static methods
    object = ''; // Not supported
    if (provide_object) {
      throw 'provide_object argument is not supported in debug_backtrace';
    }

    backtraceArray.push({
      'function': funcName, // string; The current function name. See also __FUNCTION__.
      'line': line, // integer; The current line number. See also __LINE__.
      'file' : file, // string; The current file name. See also __FILE__.
      'className' : className, // string; The current class name. See also __CLASS__
      'object' : object, // object; The current object.
      'type' : type, // string; The current call type. If a method call, "->" is returned. If a static method call, "::" is returned. If a function call, nothing is returned.
      'args' : args // array; If inside a function, this lists the functions arguments. If inside an included file, this lists the included file name(s).
    });
  }
  return backtraceArray;
}




// debug_print_backtrace.js
// Not yet ported. Feel like it?




// escapeshellcmd.js
// We are not going to port this




// exec.js
// We are not going to port this




// passthru.js
// We are not going to port this




// proc_close.js
// We are not going to port this




// proc_get_status.js
// We are not going to port this




// proc_nice.js
// We are not going to port this




// proc_open.js
// We are not going to port this




// proc_terminate.js
// We are not going to port this




// shell_exec.js
// We are not going to port this




// system.js
// We are not going to port this




// chgrp.js
// We are not going to port this




// chmod.js
// We are not going to port this




// chown.js
// We are not going to port this




// clearstatcache.js
// Not yet ported. Feel like it?




// copy.js
// We are not going to port this




// delete.js
// We are not going to port this




// disk_free_space.js
// We are not going to port this




// disk_total_space.js
// We are not going to port this




// diskfreespace.js
// We are not going to port this




// fflush.js
// We are not going to port this




// file_put_contents.js
function file_put_contents(aFile, data, flags, context) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Only works at present in Mozilla (and unfinished too); might also allow context to determine
  // %          note 1: whether for Mozilla, for HTTP PUT or POST requests, etc.
  // *     example 1: file_put_contents('file://Users/Kevin/someFile.txt', 'hello');
  // *     returns 1: 5


  // Fix: allow file to be placed outside of profile directory; fix: add PHP-style flags, etc.
  var opts = 0, i = 0;

  // Initialize binary arguments. Both the string & integer (constant) input is
  // allowed
  var OPTS = {
    FILE_USE_INCLUDE_PATH: 1,
    LOCK_EX: 2,
    FILE_APPEND: 8,
    FILE_TEXT: 32,
    FILE_BINARY: 64
  };
  if (typeof flags === 'number') {
    opts = flags;
  }
  else { // Allow for a single string or an array of string flags
    flags = [].concat(flags);
    for (i = 0; i < flags.length; i++) {
      if (OPTS[flags[i]]) {
        opts = opts | OPTS[flags[i]];
      } else {

      }
    }
  }
  var append = opts & OPTS.FILE_APPEND;


  var charset = 'UTF-8'; // Can be any character encoding name that Mozilla supports
  // Setting earlier, but even with a different setting, it still seems to save as UTF-8

  //        var em = Cc['@mozilla.org/extensions/manager;1'].
  //                 getService(Ci.nsIExtensionManager);
  //          the path may use forward slash ('/') as the delimiter
  //        var file = em.getInstallLocation(MY_ID).getItemFile(MY_ID, 'content/'+filename);

  var file;
  if ((/^file:\/\//).test(aFile)) {
    // absolute file URL
    var ios = Components.classes['@mozilla.org/network/io-service;1'].
        getService(Components.interfaces.nsIIOService);
    var URL = ios.newURI(aFile, null, null);
    file = URL.QueryInterface(Components.interfaces.nsIFileURL).file; // becomes nsIFile
  }
  else {
    //native

    file = Components.classes['@mozilla.org/file/local;1'].
        createInstance(Components.interfaces.nsILocalFile);
    file.initWithPath(aFile); // e.g., "/home"
  }
  /**
//tmp
var file = Components.classes["@mozilla.org/file/directory_service;1"].
             getService(Components.interfaces.nsIProperties).
             get("TmpD", Components.interfaces.nsIFile);
file.append("suggestedName.tmp");
file.createUnique(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 438); // 0666
//
var file = Components.classes["@mozilla.org/file/directory_service;1"].
             getService(Components.interfaces.nsIProperties).
             get("ProfD", Components.interfaces.nsIFile);
//*/


  if (typeof file === 'string') {
    var tempfilename = file;
    file = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
    file.append(tempfilename);
  }

  if (!file.exists()) {   // if it doesn't exist, create  // || !file.isDirectory()
    file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 511); // DIRECTORY_TYPE (0777)
  }
  else if (!append) {
    file.remove(false); // I needed to do this to avoid some apparent race condition (the effect of junk getting added to the end)
    file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 511); // DIRECTORY_TYPE (0777)
  }
  // file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 436); // for temporary (0664)

  var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
  var fileFlags = append ? (0x02 | 0x10) : 0x02; // use 0x02 | 0x10 to open file for appending.
  foStream.init(file, fileFlags, 436, 0); // 436 is 0664
  // foStream.init(file, 0x02 | 0x08 | 0x20, 436, 0); // write, create, truncate (436 is 0664)

  var os = Cc['@mozilla.org/intl/converter-output-stream;1'].createInstance(Ci.nsIConverterOutputStream);
  // This assumes that foStream is the nsIOutputStream you want to write to
  // 0x0000 instead of '?' will produce an exception: http://www.xulplanet.com/references/xpcomref/ifaces/nsIConverterOutputStream.html
  // If charset in xsl:output is ISO-8859-1, the file won't open--if it is GB2312, it will output as UTF-8--seems buggy or?
  os.init(foStream, charset, 0, 0x0000);
  os.writeString(data);
  os.close();
  foStream.close();
  // todo: return number of bytes written or false on failure
}




// fileatime.js
// Not yet ported. Feel like it?




// filectime.js
// Not yet ported. Feel like it?




// filegroup.js
// We are not going to port this




// fileinode.js
// Not yet ported. Feel like it?




// fileowner.js
// Not yet ported. Feel like it?




// fileperms.js
// Not yet ported. Feel like it?




// filetype.js
// We are not going to port this




// flock.js
// We are not going to port this




// fnmatch.js
function fnmatch(pattern, string, flags) {
  // http://kevin.vanzonneveld.net
  // +   based on: jk at ricochetsolutions dot com (per http://www.php.net/manual/en/function.fnmatch.php#71725 )
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -   depends on: strtr
  // *     example 1: fnmatch('*gr[ae]y', 'gray');
  // *     returns 1: true

  // Unfinished
  var backslash = '\\\\';
  var flagStr = 'g';


  /*
#define    FNM_NOESCAPE    0x01    // Disable backslash escaping.
#define    FNM_PATHNAME    0x02    // Slash must be matched by slash.
#define    FNM_PERIOD    0x04    // Period must be matched by period.
#define    FNM_LEADING_DIR    0x08    // Ignore /<tail> after Imatch.
#define    FNM_CASEFOLD    0x10    // Case insensitive search.
#define FNM_PREFIX_DIRS    0x20    // Directory prefixes of pattern match too.
  */
  // all integers
  switch (flags) { // allow bitwise or'ed?
    case 'FNM_NOESCAPE': // Disable backslash escaping.
      backslash = '';
      break;
    case 'FNM_FILE_NAME': // Would have been fall-through but gone by PHP 6
      throw 'Obsolete flag';
    case 'FNM_PATHNAME': // Slash in string only matches slash in the given pattern.

      break;
    case 'FNM_PERIOD': // Leading period in string must be exactly matched by period in the given pattern.

      break;
    case 'FNM_NOSYS': // Gone by PHP 6
      throw 'Obsolete flag';
    case 'FNM_LEADING_DIR': // Ignore /<tail> after Imatch.

      break;
    case 'FNM_CASEFOLD': // Caseless match. Part of the GNU extension.
      flagStr += 'i';
      break;
    case 'FNM_PREFIX_DIRS': // Directory prefixes of pattern match too.

      break;
    default:
      break;
  }
  var regex = '([' + backslash + '\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!<>\\|\\:])'; // \, ., +, *, ?, [, ^, ], $, (, ), {, }, =, !, <, >, |, :
  var esc = function(str) {
    return (str + '').replace(new RegExp(regex, 'g'), '\\$1');
  };

  return (new RegExp('^' + this.strtr(esc(pattern, '#'), {'\\*' : '.*', '\\?' : '.', '\\[' : '[', '\\]' : ']'}) + '$', flagStr)).test(string);
}




// fputcsv.js
// We are not going to port this




// fputs.js
// We are not going to port this




// fstat.js
// Not yet ported. Feel like it?




// ftruncate.js
// We are not going to port this




// fwrite.js
// We are not going to port this




// glob.js
// We are not going to port this




// is_dir.js
// We are not going to port this




// is_executable.js
// We are not going to port this




// is_file.js
// We are not going to port this




// is_link.js
// We are not going to port this




// is_readable.js
// Not yet ported. Feel like it?




// is_uploaded_file.js
// We are not going to port this




// is_writable.js
// We are not going to port this




// is_writeable.js
// We are not going to port this




// lchgrp.js
// We are not going to port this




// lchown.js
// We are not going to port this




// link.js
// We are not going to port this




// linkinfo.js
// We are not going to port this




// lstat.js
// We are not going to port this




// mkdir.js
// We are not going to port this




// move_uploaded_file.js
// We are not going to port this




// parse_ini_file.js
// Not yet ported. Feel like it?




// parse_ini_string.js
// Original: http://nl3.php.net/manual/en/function.parse-ini-file.php#78815


function parse_ini_string($filepath ) {
  $ini = file($filepath);
  if (count($ini) == 0) { return array(); }
  $sections = array();
  $values = array();
  $globals = array();
  $i = 0;
  for ($ini in $line) {
    $line = trim($line);
    // Comments
    if ($line === '' || $line.substr(0, 1) == ';') { continue; }
    // Sections
    if ($line.substr(0, 1) == '[') {
      $sections.push($line.substr(1, -1));
      $i++;
      continue;
    }
    // Key-value pair
    list($key, $value) = explode('=', $line, 2);
    $key = trim($key);
    $value = trim($value);
    if ($i == 0) {
      // Array values
      if (substr($line, -1, 2) == '[]') {
        $globals[$key].push($value);
      } else {
        $globals[$key].push($value);
      }
    } else {
      // Array values
      if (substr($line, -1, 2) == '[]') {
        $values[$i - 1][$key].push($value);
      } else {
        $values[$i - 1][$key] = $value;
      }
    }
  }
  for ($j = 0; $j < $i; $j++) {
    $result[$sections[$j]] = $values[$j];
  }
  return $result + $globals;
}

// Better? http://nl3.php.net/manual/en/function.parse-ini-file.php#82900
//function _parse_ini_file($file, $process_sections = false) {
//  $process_sections = ($process_sections !== true) ? false : true;
//
//  $ini = file($file);
//  if (count($ini) == 0) {return array();}
//
//  $sections = array();
//  $values = array();
//  $result = array();
//  $globals = array();
//  $i = 0;
//  foreach ($ini as $line) {
//    $line = trim($line);
//    $line = str_replace("\t", " ", $line);
//
//    // Comments
//    if (!preg_match('/^[a-zA-Z0-9[]/', $line)) {continue;}
//
//    // Sections
//    if ($line{0} == '[') {
//      $tmp = explode(']', $line);
//      $sections[] = trim(substr($tmp[0], 1));
//      $i++;
//      continue;
//    }
//
//    // Key-value pair
//    list($key, $value) = explode('=', $line, 2);
//    $key = trim($key);
//    $value = trim($value);
//    if (strstr($value, ";")) {
//      $tmp = explode(';', $value);
//      if (count($tmp) == 2) {
//        if ((($value{0} != '"') && ($value{0} != "'")) ||
//            preg_match('/^".*"\s*;/', $value) || preg_match('/^".*;[^"]*$/', $value) ||
//            preg_match("/^'.*'\s*;/", $value) || preg_match("/^'.*;[^']*$/", $value) ){
//          $value = $tmp[0];
//        }
//      } else {
//        if ($value{0} == '"') {
//          $value = preg_replace('/^"(.*)".*/', '$1', $value);
//        } elseif ($value{0} == "'") {
//          $value = preg_replace("/^'(.*)'.*/", '$1', $value);
//        } else {
//          $value = $tmp[0];
//        }
//      }
//    }
//    $value = trim($value);
//    $value = trim($value, "'\"");
//
//    if ($i == 0) {
//      if (substr($line, -1, 2) == '[]') {
//        $globals[$key][] = $value;
//      } else {
//        $globals[$key] = $value;
//      }
//    } else {
//      if (substr($line, -1, 2) == '[]') {
//        $values[$i-1][$key][] = $value;
//      } else {
//        $values[$i-1][$key] = $value;
//      }
//    }
//  }
//
//  for($j = 0; $j < $i; $j++) {
//    if ($process_sections === true) {
//      $result[$sections[$j]] = $values[$j];
//    } else {
//      $result[] = $values[$j];
//    }
//  }
//
//  return $result + $globals;
//}
//?>
//
//usage regarding semicolons:
//<?php
//;sample.ini
//
//variable1   = v1;v1
//variable 2  = "v2;v2"
//variable_3  = "v3;v3;v3"
//variable4   = "v4;v4" ;v4
//variable 5  = "v5;v5;v5" ;v5
//variable_6  = "v6;v6" ;v6;;
//variable7   = "v7;;v7"
//variable 8  = 'v8;v8'
//variable_9  = 'v9;v9;v9'
//variable10  = 'v10;v10' ;v10
//variable 11 = 'v11;v11;v11' ;v11
//variable_12 = 'v12;v12' ;v2;;
//variable13  = 'v13;;v13'
//variable 14 = "v14
//variable_15 = 'v15
//variable16  = "v16;v16
//variable 17 = 'v17;v17
//?>
//<?php
////example.php
//print_r(_parse_ini_file("sample.ini"));
//?>
//<?php
////example.php output
//Array
//(
//    [variable1] => v1
//    [variable 2] => v2;v2
//    [variable_3] => v3;v3;v3
//    [variable4] => v4;v4
//    [variable 5] => v5;v5;v5
//    [variable_6] => v6;v6
//    [variable7] => v7;;v7
//    [variable 8] => v8;v8
//    [variable_9] => v9;v9;v9
//    [variable10] => v10;v10
//    [variable 11] => v11;v11;v11
//    [variable_12] => v12;v12
//    [variable13] => v13;;v13
//    [variable 14] => v14
//    [variable_15] => v15
//    [variable16] => v16
//    [variable 17] => v17
//)




// readlink.js
// We are not going to port this




// rename.js
// We are not going to port this




// rmdir.js
// We are not going to port this




// set_file_buffer.js
// We are not going to port this




// stat.js
// Not yet ported. Feel like it?




// symlink.js
// We are not going to port this




// tempnam.js
// We are not going to port this




// tmpfile.js
// We are not going to port this




// touch.js
// We are not going to port this




// umask.js
// We are not going to port this




// unlink.js
// We are not going to port this




// filter_has_var.js
// Not yet ported. Feel like it?




// filter_id.js
function filter_id(name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: filter_id('int');
  // *     returns 1: 257

  var filters = {
    // VALIDATE
    'int': 257, // FILTER_VALIDATE_INT
    'boolean' : 258, // FILTER_VALIDATE_BOOLEAN
    'float': 259, // FILTER_VALIDATE_FLOAT
    validate_regexp: 272, // FILTER_VALIDATE_REGEXP
    validate_url: 273, // FILTER_VALIDATE_URL
    validate_email: 274, // FILTER_VALIDATE_EMAIL
    validate_ip: 275, // FILTER_VALIDATE_IP
    // SANITIZE
    string: 513, // FILTER_SANITIZE_STRING
    stripped: 513, // FILTER_SANITIZE_STRIPPED
    encoded: 514, // FILTER_SANITIZE_ENCODED
    special_chars: 515, // FILTER_SANITIZE_SPECIAL_CHARS
    unsafe_raw: 516, // FILTER_UNSAFE_RAW
    email: 517, // FILTER_SANITIZE_EMAIL
    url: 518, // FILTER_SANITIZE_URL
    number_int: 519, // FILTER_SANITIZE_NUMBER_INT
    number_float: 520, // FILTER_SANITIZE_NUMBER_FLOAT
    magic_quotes: 521, // FILTER_SANITIZE_MAGIC_QUOTES
    // OTHER
    callback: 1024 // FILTER_CALLBACK
  };
  return filters[name];
}




// filter_input.js
// Not yet ported. Feel like it?




// filter_input_array.js
// Not yet ported. Feel like it?




// filter_list.js
function filter_list() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: filter_list();
  // *     returns 1: ['int','boolean','float','validate_regexp','validate_url','validate_email','validate_ip','string','stripped','encoded','special_chars','unsafe_raw','email','url','number_int','number_float','magic_quotes','callback']

  return [
    // VALIDATE
    'int',
    'boolean',
    'float',
    'validate_regexp',
    'validate_url',
    'validate_email',
    'validate_ip',
    // SANITIZE
    'string',
    'stripped',
    'encoded',
    'special_chars',
    'unsafe_raw',
    'email',
    'url',
    'number_int',
    'number_float',
    'magic_quotes',
    // OTHER
    'callback'
  ];
}




// filter_var.js
function filter_var(input, filter, options) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Rafał Kukawski (http://kukawski.pl)
  // -    depends on: addslashes
  // -    depends on: htmlspecialchars
  // -    depends on: strip_tags
  // *     example 1: filter_var('true', 'FILTER_VALIDATE_BOOLEAN');
  // *     returns 1: true

  function is(val, type) {
    if (val == null) {
      return type === 'null';
    }

    if (type === 'primitive') {
      return val !== Object(val);
    }

    var actual = typeof val;

    if (actual === 'object') {
      return {
        '[object Array]': 'array',
        '[object RegExp]': 'regex'
      }[Object.prototype.toString.call(val)] || 'object';
    }

    if (actual === 'number') {
      if (isNaN(val)) {
        return type === 'nan';
      }

      if (!isFinite(val)) {
        return 'inf';
      }
    }

    return type === actual;
  }

  function str2regex(str) {}

  function isPrimitive(val) {
    return val !== Object(val);
  }

  var supportedFilters = {
    FILTER_VALIDATE_INT: 257,
    FILTER_VALIDATE_BOOLEAN: 258,
    FILTER_VALIDATE_FLOAT: 259,
    FILTER_VALIDATE_REGEXP: 272,
    FILTER_VALIDATE_URL: 273,
    FILTER_VALIDATE_EMAIL: 274,
    FILTER_VALIDATE_IP: 275,

    FILTER_SANITIZE_STRING: 513,
    FILTER_SANITIZE_STRIPPED: 513,
    FILTER_SANITIZE_ENCODED: 514,
    FILTER_SANITIZE_SPECIAL_CHARS: 515,
    FILTER_UNSAFE_RAW: 516,
    FILTER_DEFAULT: 516,
    FILTER_SANITIZE_EMAIL: 517,
    FILTER_SANITIZE_URL: 518,
    FILTER_SANITIZE_NUMBER_INT: 519,
    FILTER_SANITIZE_NUMBER_FLOAT: 520,
    FILTER_SANITIZE_MAGIC_QUOTES: 521,
    // TODO: doesn't exist on my server. Add constant value
    FILTER_SANITIZE_FULL_SPECIAL_CHARS: -1,
    FILTER_CALLBACK: 1024
  };

  var supportedFlags = {
    FILTER_FLAG_ALLOW_OCTAL: 1,
    FILTER_FLAG_ALLOW_HEX: 2,
    FILTER_FLAG_STRIP_LOW: 4,
    FILTER_FLAG_STRIP_HIGH: 8,
    FILTER_FLAG_ENCODE_LOW: 16,
    FILTER_FLAG_ENCODE_HIGH: 32,
    FILTER_FLAG_ENCODE_AMP: 64,
    FILTER_FLAG_NO_ENCODE_QUOTES: 128,
    FILTER_FLAG_ALLOW_FRACTION: 4096,
    FILTER_FLAG_ALLOW_THOUSAND: 8192,
    FILTER_FLAG_ALLOW_SCIENTIFIC: 16384,
    FILTER_FLAG_PATH_REQUIRED: 262144,
    FILTER_FLAG_QUERY_REQUIRED: 524288,
    FILTER_FLAG_IPV4: 1048576,
    FILTER_FLAG_IPV6: 2097152,
    FILTER_FLAG_NO_RES_RANGE: 4194304,
    FILTER_FLAG_NO_PRIV_RANGE: 8388608,
    FILTER_NULL_ON_FAILURE: 134217728
  };

  if (is(filter, 'null')) {
    filter = supportedFilters.FILTER_DEFAULT;
  } else if (is(filter, 'string')) {
    filter = supportedFilters[filter];
  }

  var flags = 0;
  if (is(options, 'number')) {
    flags = options;
  } else if (is(options, 'string')) {
    flags = supportedFlags[options] || 0;
  } else if (is(options, 'object') && is(options.flags, 'number')) {
    flags = options.flags;
  }

  var opts = {};

  if (is(options, 'object')) {
    opts = options.options || {};
  }

  // it looks like the FILTER_NULL_ON_FAILURE is used across all filters, not only FILTER_VALIDATE_BOOLEAN
  // thus the failure var
  var failure = (flags & supportedFlags.FILTER_NULL_ON_FAILURE) ? null : false;

  if (!is(filter, 'number')) {
    // no numeric filter, return
    return failure;
  }

  // Shortcut for non-primitive values. All are failures
  if (!isPrimitive(input)) {
    return failure;
  }

  // if input is string, trim whitespace TODO: make a dependency on trim()?
  var data = is(input, 'string') ? input.replace(/(^\s+)|(\s+$)/g, '') : input;

  switch (filter) {
    case supportedFilters.FILTER_VALIDATE_BOOLEAN:
      return /^(?:1|true|yes|on)$/i.test(data) || (/^(?:0|false|no|off)$/i.test(data) ? false : failure);

    case supportedFilters.FILTER_VALIDATE_INT:
      var numValue = +data;

      if (!/^(?:0|[+\-]?[1-9]\d*)$/.test(data)) {
        if ((flags & supportedFlags.FILTER_FLAG_ALLOW_HEX) && /^0x[\da-f]+$/i.test(data)) {
          numValue = parseInt(data, 16);
        } else if ((flags & supportedFlags.FILTER_FLAG_ALLOW_OCTAL) && /^0[0-7]+$/.test(data)) {
          numValue = parseInt(data, 8);
        } else {
          return failure;
        }
      }

      var minValue = is(opts.min_range, 'number') ? opts.min_range : -Infinity;
      var maxValue = is(opts.max_range, 'number') ? opts.max_range : Infinity;

      if (!is(numValue, 'number') || numValue % 1 || numValue < minValue || numValue > maxValue) {
        return failure;
      }

      return numValue;

    case supportedFilters.FILTER_VALIDATE_REGEXP:
      if (is(options.regexp, 'regex')) {
        // FIXME: we are passing pre-processed input data (trimmed data).
        // check whether PHP also passess trimmed input
        var matches = options.regexp(data);
        return matches ? matches[0] : failure;
      }
    // TODO: support passing regexes as strings "#regex#is"
    case supportedFilters.FILTER_VALIDATE_IP:
      var ipv4 = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
      var ipv4privrange = /^(?:0?10|172\.0?(?:1[6-9]|2\d|3[01])|192\.168)\./;
      var ipv4resrange = /^(?:0?0?0\.|127\.0?0?0\.0?0?0\.0?0?1|128\.0?0?0\.|169\.254\.|191\.255\.|192\.0?0?0\.0?0?2\.|25[0-5]\.|2[34]\d\.|22[4-9]\.)/;
      // IPv6 regex taken from here: http://forums.intermapper.com/viewtopic.php?t=452
      var ipv6 = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;

      var mode = (supportedFlags.FILTER_FLAG_IPV4 | supportedFlags.FILTER_FLAG_IPV6);

      if (flags !== 0) {
        mode &= flags;
      }

      if (mode & supportedFlags.FILTER_FLAG_IPV4) {
        var ip = ipv4.test(input);

        if (ip) {
          if ((flags & supportedFlags.FILTER_FLAG_NO_PRIV_RANGE) && privrange.test(data)) {
            return failure;
          }

          if ((flags & supportedFlags.FILTER_FLAG_NO_RES_RANGE) && resrange.test(data)) {
            return failure;
          }

          return input;
        }
      }

      if (mode & supportedFlags.FILTER_FLAG_IPV6) {
        var ip = ipv6.test(input);

        if (ip) {
          // TODO: check ipv6 ranges
          return input;
        }
      }

      return failure;

    case supportedFilters.FILTER_CALLBACK:
      var fn = opts;

      if (is(fn, 'string')) {
        fn = this.window[fn];
      }

      if (is(fn, 'function')) {
        return fn(input);
      }

      return failure;

    case supportedFilters.FILTER_SANITIZE_NUMBER_INT:
      return ('' + input).replace(/[^\d+\-]/g, '');

    case supportedFilters.FILTER_SANITIZE_NUMBER_FLOAT:
      return ('' + input).replace(/[^\deE.,+\-]/g, '').replace(/[eE.,]/g,
          function(m) {
            return {
              '.': (filter & supportedFilters.FILTER_FLAG_ALLOW_FRACTION) ? '.' : '',
              ',': (filter & supportedFilters.FILTER_FLAG_ALLOW_THOUSAND) ? ',' : '',
              'e': (filter & supportedFilters.FILTER_FLAG_ALLOW_SCIENTIFIC) ? 'e' : '',
              'E': (filter & supportedFilters.FILTER_FLAG_ALLOW_SCIENTIFIC) ? 'e' : ''
            }[m];
          });

    /*case supportedFilters.FILTER_SANITIZE_MAGIC_QUOTES:
            return this.addslashes(input); // ('' + input).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0')*/

    case supportedFilters.FILTER_SANITIZE_URL:
      return ('' + data).replace(/[^a-zA-Z\d$\-_.+!*'(),{}|\\\^~\[\]`<>#%";\/?:@&=]/g, '');

    case supportedFilters.FILTER_SANITIZE_EMAIL:
      return ('' + data).replace(/[^a-zA-Z\d!#$%&'*+\-\/=?\^_`{|}~@.\[\]]/g, '');

    case supportedFilters.FILTER_DEFAULT:
    // is alias of FILTER_UNSAFE_RAW
    // fall-through
    case supportedFilters.FILTER_UNSAFE_RAW:
      data = input + '';

      if (flags & supportedFlags.FILTER_FLAG_ENCODE_AMP) {
        data = data.replace(/&/g, '&#38');
      }

      if ((supportedFlags.FILTER_FLAG_ENCODE_LOW |
          supportedFlags.FILTER_FLAG_STRIP_LOW |
          supportedFlags.FILTER_FLAG_ENCODE_HIGH |
          supportedFlags.FILTER_FLAG_STRIP_HIGH) &
          flags) {

        data = data.replace(/[\s\S]/g,
            function(c) {
              var charCode = c.charCodeAt(0);

              if (charCode < 32) {
                return (flags & supportedFlags.FILTER_FLAG_STRIP_LOW) ? '' :
                    (flags & supportedFlags.FILTER_FLAG_ENCODE_LOW) ? '&#' + charCode : c;
              } else if (charCode > 127) {
                return (flags & supportedFlags.FILTER_FLAG_STRIP_HIGH) ? '' : (flags & supportedFlags.FILTER_FLAG_ENCODE_HIGH) ? '&#' + charCode : c;
              }

              return c;
            });
      }

      return data;
    default:
      return false;
  }

  return false;
}




// filter_var_array.js




// register_tick_function.js
// We are not going to port this




// unregister_tick_function.js
// We are not going to port this




// dcgettext.js
function dcgettext(domain, msg, category) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.textdomains_codesets = this.php_js.textdomains_codesets || {};
  // END REDUNDANT

  var codeset = this.php_js.textdomains_codesets[domain]; // For file-getting
  var dir = this.php_js.textdomains[domain]; // For file-getting

  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  var lang = this.php_js.localeCategories[category];

}




// dcngettext.js
function dcngettext(domain, msgid1, msgid2, n, category) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.textdomains_codesets = this.php_js.textdomains_codesets || {};
  // END REDUNDANT

  var codeset = this.php_js.textdomains_codesets[domain]; // For file-getting
  var dir = this.php_js.textdomains[domain]; // For file-getting

  this.setlocale('LC_ALL', 0); // ensure setup of localization variables takes place
  var lang = this.php_js.localeCategories[category];

  // rely on phpjs.locales.LL.nplurals(n)

}




// dgettext.js
function dgettext(domain, msg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.textdomains_codesets = this.php_js.textdomains_codesets || {};
  // END REDUNDANT

  var codeset = this.php_js.textdomains_codesets[domain]; // For file-getting
  var dir = this.php_js.textdomains[domain]; // For file-getting
  var lang = this.setlocale('LC_ALL', 0);

}




// dngettext.js
function dngettext(domain, msgid1, msgid2, n) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.textdomains_codesets = this.php_js.textdomains_codesets || {};
  // END REDUNDANT

  var codeset = this.php_js.textdomains_codesets[domain]; // For file-getting
  var dir = this.php_js.textdomains[domain]; // For file-getting

  var lang = this.setlocale('LC_ALL', 0);

  // rely on phpjs.locales.LL.nplurals(n)

}




// gettext.js
function gettext(msg) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT

  var lang = this.setlocale('LC_ALL', 0);

  var domain = this.php_js.current_textdomain;

}




// ngettext.js
function ngettext(msgid1, msgid2, n) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: setlocale
  // *     example 1:
  // *     returns 1:

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  // END REDUNDANT

  var lang = this.setlocale('LC_ALL', 0);

  var domain = this.php_js.current_textdomain;

  // rely on phpjs.locales.LL.nplurals(n)

}




// textdomain.js
function textdomain(domain) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: textdomain('myapp');
  // *     returns 1: 'myapp'

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.textdomains_codesets = this.php_js.textdomains_codesets || {};
  this.php_js.current_textdomain = this.php_js.current_textdomain || null; // Default is null?
  // END REDUNDANT

  // This appears to undo a cache for gettext, so should probably obtain the file here (as in the domain-overriding functions)
  var codeset = this.php_js.textdomains_codesets[domain]; // For file-getting
  var dir = this.php_js.textdomains[domain]; // For file-getting

  var stream_opts = {
    'http': {
      'method': 'GET',
      'phpjs.override' : 'text/javascript; charset=' + codeset // Use our own custom "PHP"-like stream option to use XMLHttpRequest's overrideMimeType() (since PHP does not have an equivalent (?))
    }
  };
  var stream_context = stream_context_create(stream_opts);
  file = file_get_contents('http://www.example.com/', false, stream_context);


  if (domain === null) {
    return this.php_js.current_textdomain;
  }
  this.php_js.current_textdomain = domain;
  return domain;
}




// inclued_get_data.js
function inclued_get_data() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: inclued_get_data(); // for "include 'x.js';" called in /temp/z.js:
  // *     returns 1: {includes: [{operation: 'include', op_type: 2,filename: 'x.js',opened_path: '/tmp/x.js',fromfile: '/tmp/z.js', fromline: 2}]}

  // require, include, etc. will need to check inclued.enabled and if set, record to it
  // The only other directive is inclued.dumpdir but that requires file writing
  // Per the docs, "Class inheritance dependencies are also reported"; how?

  /*
     * this.php_js.incluedData could look like:
    {
        includes : [
            {
              operation : 'include',
              op_type : 2, // ZEND_EVAL 1, ZEND_INCLUDE 2, ZEND_INCLUDE_ONCE 4, ZEND_REQUIRE 8, ZEND_REQUIRE_ONCE 16
              filename : 'x.js',
              opened_path : '/tmp/x.js',
              fromfile : '/tmp/z.js',
              fromline : 2
            }
        ]
    }
  */

  if (!this.php_js || !this.php_js.incluedData) {
    return {};
  }
  return this.php_js.incluedData;
}




// gc_collect_cycles.js
// We are not going to port this




// gc_disable.js
// We are not going to port this




// gc_enable.js
// We are not going to port this




// gc_enabled.js
// We are not going to port this




// get_current_user.js
// We are not going to port this




// getmygid.js
// We are not going to port this




// getmyinode.js
// We are not going to port this




// getmypid.js
// We are not going to port this




// getmyuid.js
// We are not going to port this




// getopt.js
// We are not going to port this




// getrusage.js
// We are not going to port this




// main.js
// We are not going to port this




// memory_get_peak_usage.js
// We are not going to port this




// memory_get_usage.js
// We are not going to port this




// php_logo_guid.js
// We are not going to port this




// php_sapi_name.js
// We are not going to port this




// php_uname.js
// Not yet ported. Feel like it?




// phpinfo.js
// Not yet ported. Feel like it?




// set_magic_quotes_runtime.js
// We are not going to port this




// sys_get_temp_dir.js
// We are not going to port this




// zend_logo_guid.js
// We are not going to port this




// zend_thread_id.js
// We are not going to port this




// zend_version.js
// We are not going to port this




// $_SESSION.js
// Not yet ported. Feel like it?




// declare.js
// We are not going to port this




// ErrorException.js
var that = this;
this.php_js = this.php_js || {};

function ErrorException(message, code, severity, filename, lineno) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: Exception
  // *     example 1: var e = new Exception('some exception');
  // *     example 1: e.getMessage();
  // *     returns 1: 'some exception'

  if (!message) {
    message = '';
  }
  if (!code) {
    code = 0;
  }

  /* No way to set in PHP in this inheriting function!
    if (!previous) {
        previous = null;
    }
    */

  this.message = message; // protected string
  this.code = code; // protected int
  this.string = 'Exception'; // private string; Internal Exception name

  this.severity = severity; // protected int

  // UNFINISHED
  /*
    this.previous = previous; // "previous" is not a recognized property, but we'll use it; reconcile with trace array?
    this.trace; // private array; The stack trace
    */
  this.file = filename; // protected string; The filename where the exception was thrown
  this.line = lineno; // protected int; The line where the exception was thrown
  // For JavaScript:
  this.name = 'ErrorException';
  that.php_js.error_handler(this);
}
ErrorException.prototype = new this.Exception();
ErrorException.prototype.constructor = ErrorException;
ErrorException.prototype.getSeverity = function() { // Final method
  return this.severity;
};




// Exception.js
var that = this;
this.php_js = this.php_js || {};

function Exception(message, code, previous) { // string, int, Exception (all arguments optional)
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var e = new Exception('some exception');
  // *     example 1: e.getMessage();
  // *     returns 1: 'some exception'

  if (!message) {
    message = '';
  }
  if (!code) {
    code = 0;
  }
  if (!previous) {
    previous = null;
  }

  this.message = message; // protected string
  this.code = code; // protected int
  this.string = 'Exception'; // private string; Internal Exception name

  // UNFINISHED
  /*
    this.previous = previous; // "previous" is not a recognized property, but we'll use it; reconcile with trace array?
    this.trace; // private array; The stack trace
    this.file; // protected string; The filename where the exception was thrown
    this.line; // protected int; The line where the exception was thrown
    */
  // For JavaScript:
  this.name = 'Exception';
  that.php_js.exception_handler(this);
}
Exception.prototype = {
  constructor: Exception,
  // PRIVATE FINAL METHODS
  __clone: function() {
    throw 'Fatal exception: exceptions are not clonable';
  },
  // PUBLIC METHODS
  __toString: function() { // returns string
    return "exception '" + this.string + "' with message '" + this.getMessage() + "' in " +
        this.getFile() + ':' + this.getLine() + '\nStack trace:\n' + this.getTraceAsString();
  },
  // For JavaScript interface/behavior:
  toString: function() {
    return this.__toString(); // We implement on toString() to implement JavaScript Error interface
  },
  // FINAL PUBLIC METHODS
  getMessage: function() { // returns string
    return this.message;
  },
  getPrevious: function() { // returns Exception
    return this.previous;
  },
  getCode: function() { // returns int
    return this.code;
  },
  getFile: function() { // returns string
    return this.file;
  },
  getLine: function() { // returns int
    return this.line;
  },
  getTrace: function() { // returns array
    // Each entry may look like:
    // filepath(linenumber): funcName()  OR
    // {main}
    return this.trace;
  },
  getTraceAsString: function() { // returns string
    var ret = '';
    for (var i = 0; i < this.trace.length; i++) {
      ret += '\n#' + i + ' ' + this.trace[i];
    }
    return ret.slice(1);
  }
};




// goto.js
// We are not going to port this




// ezmlm_hash.js
function ezmlm_hash(address) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: ezmlm_hash('brettz');
  // *     returns 1: 50

  // Isn't working with larger strings (e.g., 'brettz9')

  // h is int,
  var h = 5381, j = 0, str_len = 0;
  for (j = 0, str_len = address.length; j < str_len; j++) {
    h = ((h + (h << 5)) ^ ((((Math.abs(address.charAt(j).toLowerCase().charCodeAt(0))) % 255) % 4294967296)));
  }
  return (h % 53) % 65535;
}




// mt_srand.js
// Not yet ported. Feel like it?




// __halt_compiler.js
// We are not going to port this




// eval.js
// We are not going to port this




// get_browser.js
// Not yet ported. Feel like it?




// highlight_file.js
// Not yet ported. Feel like it?




// highlight_string.js
// Not yet ported. Feel like it?




// show_source.js
// Not yet ported. Feel like it?




// unpack.js
function unpack(format, data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tim de Koning (http://www.kingsquare.nl)
  // +      parts by: Jonas Raoni Soares Silva
  // +      http://www.jsfromhell.com
  // +   bugfixed by: marcuswestin
  // %        note 1: Float decoding by: Jonas Raoni Soares Silva
  // %        note 2: Home: http://www.kingsquare.nl/blog/22-12-2009/13650536
  // %        note 3: Feedback: phpjs-unpack@kingsquare.nl
  // %        note 4: 'machine dependant byte order and size' aren't
  // %        note 5: applicable for JavaScript unpack works as on a 32bit,
  // %        note 6: little endian machine
  // *     example 1: unpack('f2test', 'abcddbca');
  // *     returns 1: { 'test1': 1.6777999408082E+22.
  // *     returns 2: 'test2': 2.6100787562286E+20 }

  var formatPointer = 0, dataPointer = 0, result = {}, instruction = '',
      quantifier = '', label = '', currentData = '', i = 0, j = 0,
      word = '', precisionBits = 0, exponentBits = 0, dataByteLength = 0;

  // Used by float decoding
  var b = [], bias, signal, exponent, significand, divisor, curByte,
      byteValue, startBit = 0, mask, currentResult;

  var readBits = function(start, length, byteArray) {
    var offsetLeft, offsetRight, curByte, lastByte, diff, sum;

    function shl(a, b) {
      for (++b; --b;) {
        a = ((a %= 0x7fffffff + 1) & 0x40000000) === 0x40000000 ?
            a * 2 :
            (a - 0x40000000) * 2 + 0x7fffffff + 1;
      }
      return a;
    }
    if (start < 0 || length <= 0) {
      return 0;
    }

    offsetRight = start % 8;
    curByte = byteArray.length - (start >> 3) - 1;
    lastByte = byteArray.length + (-(start + length) >> 3);
    diff = curByte - lastByte;
    sum = (
        (byteArray[curByte] >> offsetRight) &
        ((1 << (diff ? 8 - offsetRight : length)) - 1)
        ) + (
        diff && (offsetLeft = (start + length) % 8) ?
                (byteArray[lastByte++] & ((1 << offsetLeft) - 1)) <<
                (diff-- << 3) - offsetRight :
                0
        );

    for (; diff;) {
      sum += shl(byteArray[lastByte++], (diff-- << 3) - offsetRight);
    }
    return sum;
  };

  while (formatPointer < format.length) {
    instruction = format.charAt(formatPointer);

    // Start reading 'quantifier'
    quantifier = '';
    formatPointer++;
    while ((formatPointer < format.length) &&
        (format.charAt(formatPointer).match(/[\d\*]/) !== null)) {
      quantifier += format.charAt(formatPointer);
      formatPointer++;
    }
    if (quantifier === '') {
      quantifier = '1';
    }


    // Start reading label
    label = '';
    while ((formatPointer < format.length) &&
        (format.charAt(formatPointer) !== '/')) {
      label += format.charAt(formatPointer);
      formatPointer++;
    }
    if (format.charAt(formatPointer) === '/') {
      formatPointer++;
    }

    // Process given instruction
    switch (instruction) {
      case 'a': // NUL-padded string
      case 'A': // SPACE-padded string
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }
        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        if (instruction === 'a') {
          currentResult = currentData.replace(/\0+$/, '');
        } else {
          currentResult = currentData.replace(/ +$/, '');
        }
        result[label] = currentResult;
        break;

      case 'h': // Hex string, low nibble first
      case 'H': // Hex string, high nibble first
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }
        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        if (quantifier > currentData.length) {
          throw new Error('Warning: unpack(): Type ' + instruction +
              ': not enough input, need ' + quantifier);
        }

        currentResult = '';
        for (i = 0; i < currentData.length; i++) {
          word = currentData.charCodeAt(i).toString(16);
          if (instruction === 'h') {
            word = word[1] + word[0];
          }
          currentResult += word;
        }
        result[label] = currentResult;
        break;

      case 'c': // signed char
      case 'C': // unsigned c
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier);
        dataPointer += quantifier;

        for (i = 0; i < currentData.length; i++) {
          currentResult = currentData.charCodeAt(i);
          if ((instruction === 'c') && (currentResult >= 128)) {
            currentResult -= 256;
          }
          result[label + (quantifier > 1 ?
              (i + 1) :
              '')] = currentResult;
        }
        break;

      case 'S': // unsigned short (always 16 bit, machine byte order)
      case 's': // signed short (always 16 bit, machine byte order)
      case 'v': // unsigned short (always 16 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 2;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 2);
        dataPointer += quantifier * 2;

        for (i = 0; i < currentData.length; i += 2) {
          // sum per word;
          currentResult = ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
              (currentData.charCodeAt(i) & 0xFF);
          if ((instruction === 's') && (currentResult >= 32768)) {
            currentResult -= 65536;
          }
          result[label + (quantifier > 1 ?
              ((i / 2) + 1) :
              '')] = currentResult;
        }
        break;

      case 'n': // unsigned short (always 16 bit, big endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 2;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 2);
        dataPointer += quantifier * 2;

        for (i = 0; i < currentData.length; i += 2) {
          // sum per word;
          currentResult = ((currentData.charCodeAt(i) & 0xFF) << 8) +
              (currentData.charCodeAt(i + 1) & 0xFF);
          result[label + (quantifier > 1 ?
              ((i / 2) + 1) :
              '')] = currentResult;
        }
        break;

      case 'i': // signed integer (machine dependent size and byte order)
      case 'I': // unsigned integer (machine dependent size & byte order)
      case 'l': // signed long (always 32 bit, machine byte order)
      case 'L': // unsigned long (always 32 bit, machine byte order)
      case 'V': // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 4;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 4);
        dataPointer += quantifier * 4;

        for (i = 0; i < currentData.length; i += 4) {
          currentResult =
              ((currentData.charCodeAt(i + 3) & 0xFF) << 24) +
              ((currentData.charCodeAt(i + 2) & 0xFF) << 16) +
              ((currentData.charCodeAt(i + 1) & 0xFF) << 8) +
              ((currentData.charCodeAt(i) & 0xFF));
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = currentResult;
        }

        break;

      case 'N': // unsigned long (always 32 bit, little endian byte order)
        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / 4;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer, quantifier * 4);
        dataPointer += quantifier * 4;

        for (i = 0; i < currentData.length; i += 4) {
          currentResult =
              ((currentData.charCodeAt(i) & 0xFF) << 24) +
              ((currentData.charCodeAt(i + 1) & 0xFF) << 16) +
              ((currentData.charCodeAt(i + 2) & 0xFF) << 8) +
              ((currentData.charCodeAt(i + 3) & 0xFF));
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = currentResult;
        }

        break;

      case 'f':
      case 'd':
        exponentBits = 8;
        dataByteLength = 4;
        if (instruction === 'd') {
          exponentBits = 11;
          dataByteLength = 8;
        }

        if (quantifier === '*') {
          quantifier = (data.length - dataPointer) / dataByteLength;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        currentData = data.substr(dataPointer,
            quantifier * dataByteLength);
        dataPointer += quantifier * dataByteLength;

        for (i = 0; i < currentData.length; i += dataByteLength) {
          data = currentData.substr(i, dataByteLength);

          b = [];
          for (j = data.length - 1; j >= 0; --j) {
            b.push(data.charCodeAt(j));
          }

          precisionBits = (instruction === 'f') ? 23 : 52;

          bias = Math.pow(2, exponentBits - 1) - 1;
          signal = readBits(precisionBits + exponentBits, 1, b);
          exponent = readBits(precisionBits, exponentBits, b);
          significand = 0;
          divisor = 2;
          curByte = b.length + (-precisionBits >> 3) - 1;
          startBit = 0;

          do {
            byteValue = b[++curByte];
            startBit = precisionBits % 8 || 8;
            mask = 1 << startBit;
            for (; (mask >>= 1);) {
              if (byteValue & mask) {
                significand += 1 / divisor;
              }
              divisor *= 2;
            }
          } while ((precisionBits -= startBit));

          if (exponent === (bias << 1) + 1) {
            if (significand) {
              currentResult = NaN;
            } else {
              if (signal) {
                currentResult = -Infinity;
              } else {
                currentResult = +Infinity;
              }
            }
          } else {
            if ((1 + signal * -2) * (exponent || significand)) {
              if (!exponent) {
                currentResult = Math.pow(2, -bias + 1) *
                    significand;
              } else {
                currentResult = Math.pow(2,
                    exponent - bias) *
                    (1 + significand);
              }
            } else {
              currentResult = 0;
            }
          }
          result[label + (quantifier > 1 ?
              ((i / 4) + 1) :
              '')] = currentResult;
        }

        break;

      case 'x': // NUL byte
      case 'X': // Back up one byte
      case '@': // NUL byte
        if (quantifier === '*') {
          quantifier = data.length - dataPointer;
        } else {
          quantifier = parseInt(quantifier, 10);
        }

        if (quantifier > 0) {
          if (instruction === 'X') {
            dataPointer -= quantifier;
          } else {
            if (instruction === 'x') {
              dataPointer += quantifier;
            } else {
              dataPointer = quantifier;
            }
          }
        }
        break;

      default:
        throw new Error('Warning:  unpack() Type ' + instruction +
            ': unknown format code');
    }
  }
  return result;
}




// checkdnsrr.js
// We are not going to port this




// closelog.js
// We are not going to port this




// dns_check_record.js
// We are not going to port this




// dns_get_mx.js
// We are not going to port this




// dns_get_record.js
// We are not going to port this




// fsockopen.js
// We are not going to port this




// gethostbyaddr.js
// We are not going to port this




// gethostbyname.js
// We are not going to port this




// gethostbynamel.js
// We are not going to port this




// getmxrr.js
// We are not going to port this




// getprotobyname.js
// We are not going to port this




// getprotobynumber.js
// We are not going to port this




// getservbyname.js
// We are not going to port this




// getservbyport.js
// We are not going to port this




// header.js
function header(hdr, replace, http_response_code) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %    note 1: This is only for server-side JavaScript use and has not been fully tested
  // *     example 1: header('Content-type: text/plain');
  // *     returns 1: undefined

  var semi = hdr.indexOf(':');
  var prop = hdr.slice(0, semi);
  var value = hdr.slice(semi + 1).replace(/^\s+/, '');

  if (window.addHeader) { // old SSJS 1.2
    // See http://research.nihonsoft.org/javascript/ServerReferenceJS12/index.htm
    window.addHeader(prop, value);
  }
  else if (Jaxer && Jaxer.response && Jaxer.response.addHeader) {
    // See http://jaxer.org/api/
    Jaxer.response.addHeader(prop, value);
  }
  else {
    throw 'You must use a server-side implementation of JavaScript which supports addHeader';
  }
}




// headers_list.js
// We are not going to port this




// headers_sent.js
// We are not going to port this




// openlog.js
// We are not going to port this




// pfsockopen.js
// We are not going to port this




// socket_get_status.js
// We are not going to port this




// socket_set_blocking.js
// We are not going to port this




// socket_set_timeout.js
// We are not going to port this




// syslog.js
// We are not going to port this




// flush.js
function flush() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: flush();
  // *     returns 1: undefined

  var PHP_OUTPUT_HANDLER_START = 1, PHP_OUTPUT_HANDLER_CONT = 2;
  this.php_js = this.php_js || {};
  var phpjs = this.php_js, obs = phpjs.obs;

  // Not distinct from ob_flush() in JavaScript (though doesn't add to buffer), since not sending to a browser
  if (!obs || !obs.length) {
    return;
  }
  var flags = 0, ob = obs[obs.length - 1], buffer = ob.buffer;
  // Fix: verify the behavior works this way here (doesn't add as much to the buffer)
  if (ob.callback) {
    if (!ob.status) {
      flags |= PHP_OUTPUT_HANDLER_START;
    }
    flags |= PHP_OUTPUT_HANDLER_CONT;
    ob.status = 2;
    buffer = ob.callback(buffer, flags);
  }
  var flushing = this.php_js.flushing;
  this.php_js.flushing = true;
  this.echo(buffer);
  this.php_js.flushing = flushing;
  ob.buffer = '';
}




// ob_gzhandler.js
// We are not going to port this




// preg_filter.js
// Not yet ported. Feel like it?




// preg_last_error.js
// Not yet ported. Feel like it?




// preg_match.js
function preg_match(pattern, subject, matches, flags, offset) {
  // http://kevin.vanzonneveld.net
  // +   original by: Francis Lewis
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: matches = [];
  // *     example 1: preg_match(/(\w+)\W([\W\w]+)/, 'this is some text', matches);
  // *     matches 1: matches[1] == 'this'
  // *     returns 1: 1

  // UNFINISHED
  // Just found something we should take a very serious look at Steve Levithan's XRegExp which implements Unicode classes and two extra flags: http://blog.stevenlevithan.com/archives/xregexp-javascript-regex-constructor
  // Before finding this, I was working on a script to search through an SQLite database to build our Unicode expressions automatically; I may finish that as it should be expandable for the future, and be an extra eye to confirm Steve's work
  // Also need to look at/integrate with Michael Grier's http://mgrier.com/te5t/preg_match_all.js ; http://mgrier.com/te5t/testpma.html ; http://mgrier.com/te5t/testpma.php

  var i = 0, lastDelimPos = -1, flag = '', patternPart = '', flagPart = '', array = [], regexpFlags = '', subPatternNames = [];
  var getFuncName = function(fn) {
    var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
    if (!name) {
      return '(Anonymous)';
    }
    return name[1];
  };

  var join = function(arr) {
    return '(?:' + arr.join('|') + ')';
  };

  if (typeof pattern === 'string') {
    if (pattern === '') {
      // Handle how?
    }

    lastDelimPos = pattern.lastIndexOf(pattern[0]);
    if (lastDelimPos === 0) { // convenience to allow raw string without delimiters  // || a-zA-Z/.test(pattern[0]) || pattern.length === 1) { // The user is probably not using letters for delimiters (not recommended, but could be convenient for non-flagged expressions)
      pattern = new RegExp(pattern);
    }
    else {
      patternPart = pattern.slice(1, lastDelimPos);
      flagPart = pattern.slice(lastDelimPos + 1);
      // Fix: Need to study http://php.net/manual/en/regexp.reference.php more thoroughly
      // e.g., internal options i, m, s, x, U, X, J; conditional subpatterns?, comments, recursive subpatterns,
      for (i = 0; i < flagPart.length; i++) {
        flag = flagPart[i];
        switch (flag) {
          case 'g': // We don't use this in preg_match, but it's presumably not an error
          case 'm':
          case 'i':
            regexpFlags += flag;
            break;
          case 'e': // used in preg_replace only but ignored elsewhere; "does normal substitution of backreferences in the replacement string, evaluates it as PHP code, and uses the result for replacing the search string". "Single quotes, double quotes, backslashes and NULL chars will be escaped by backslashes in substituted backreferences."
            // Safely ignorable
            break;
          case 's': // "dot metacharacter in the pattern matches all characters, including newlines. Without it, newlines are excluded... A negative class such as [^a] always matches a newline character"
          case 'x': // "whitespace data characters in the pattern are totally ignored except when escaped or inside a character class, and characters between an unescaped # outside a character class and the next newline character, inclusive, are also ignored"; "Whitespace characters may never appear within special character sequences in a pattern"
          case 'A': // pattern is "constrained to match only at the start of the string which is being searched"
          case 'D': // "a dollar metacharacter in the pattern matches only at the end of the subject string" (ignored if 'm' set)
          case 'U': // "makes not greedy by default, but become greedy if followed by "?""
          case 'J': // "changes the local PCRE_DUPNAMES option. Allow duplicate names for subpatterns"
          case 'u': // "turns on additional functionality of PCRE that is incompatible with Perl. Pattern strings are treated as UTF-8."
            throw 'The passed flag "' + flag + '" is presently unsupported in ' + getFuncName(arguments.callee);
          case 'X': // "additional functionality of PCRE that is incompatible with Perl. Any backslash in a pattern that is followed by a letter that has no special meaning causes an error, thus reserving these combinations for future expansion"; not in use in PHP presently
            throw 'X flag is unimplemented at present';
            if (/\/([^\\^$.[\]|()?*+{}aefnrtdDhHsSvVwWbBAZzGCcxkgpPX\d])/.test(patternPart)) { // can be 1-3 \d together after backslash (as one unit)
              // \C = single byte (useful in 'u'/UTF8 mode)
              // CcxpPXkg are all special uses;
              //c. (any character after 'c' for control character)
              // x[a-fA-F\d][a-fA-F\d] (hex)
              // "Back references to the named subpatterns can be achieved by (?P=name) or, since PHP 5.2.4, also by \k<name>, \k'name', \k{name} or \g{name}"
              // Unicode classes (with u flag only)
              // p{} | P{} (case insensitive does not affect)
              // [CLMNPSZ]
              // C|Cc|Cf|Cn|Co|Cs|L|Ll|Lm|Lo|Lt|Lu|M|Mc|Me|Mn|N|Nd|Nl|No|P|Pc|Pd|Pe|Pf|Pi|Po|Ps|S|Sc|Sk|Sm|So|Z|Zl|Zp|Zs

              // Other, Control
              // Cc = '[\u0000-\u001f\u007f-\u009f]';
              // Other, Format
              // Cf = '(?:[\u00ad\u0600-\u0603\u06dd\u070f\u17b4-\u17b5\u200b-\u200f\u202a-\u202e\u2060-\u2064\u206a-\u206f\ufeff\ufff9-\ufffb]|[\ud834][\udd73-\udd7a]|[\udb40][\udc01\udc20-\udc58]'); /* latter surrogates represent 1d173-1d17a, e0001, e0020-e0058 */
              // Other, Unassigned
              // Cn = TO-DO;
              // Other, Private use
              // Co = '(?:[\ue000-\uf8ff]|[\udb80-\udbbe][\udc00-\udfff]|[\udbff][\udc00-\udffd]|[\udbc0-\udbfe][\udc00-\udfff]|[\udbff][\udc00-\udffd])';  // f0000-ffffd, 100000-10fffd
              // Other, Surrogate
              // Cs = '[\ud800-\udb7f\udb80-\udbff\udc00-\udfff]';

              // Need to finish Cn (above) and Ll-Sm here below
              // Letter, Lower case
              // Ll = '[]';
              // Letter, Modifier
              // Lm =
              // Letter, Other
              // Lo =
              // Letter, Title case
              // Lt =
              // Letter, Upper case
              // Lu =
              // Mark, Spacing
              // Mc =
              // Mark, Enclosing
              // Me =
              // Mark, Non-spacing
              // Mn =
              // Number, Decimal
              // Nd =
              // Number, letter
              // Nl =
              // Number, Other
              // No =
              // Punctuation, Connector
              // Pc =
              // Punctuation, Dash
              // Pd =
              // Punctuation, Close
              // Pe =
              // Punctuation, Final
              // Pf =
              // Punctuation, Initial
              // Pi =
              // Punctuation, Other
              // Po =
              // Punctuation, Open
              // Ps =
              // Symbol, Currency
              // Sc =
              // Symbol, Modifier
              // Sk =
              // Symbol, Mathematical
              // Sm ='\u002b\u003c-\u003e\u007c\u007e\u00ac\u00b1\u00d7\u00f7\u03f6\u0606-\u0608\u2044\u2052\u207a-\u207c\u208a-\u208c\u2140-\u2144\u214b\u2190-\u2194\u219a\u219b\u21a0\u21a3\u21a6\u21ae\u21ce\u21cf\u21d2\u21d4\u21f4-\u22ff\u2308-\u230b\u2320\u2321\u237c\u239b-\u23b3\u23dc-\u23e1\u25b7\u25c1\u25f8-\u25ff\u266f\u27c0-\u27c4\u27c7-\u27ca\u27cc\u27d0-\u27e5\u27f0-\u27ff\u2900-\u2982\u2999-\u29d7\u29dc-\u29fb\u29fe-\u2aff\u2b30-\u2b44\u2b47-\u2b4c\ufb29\ufe62\ufe64-\ufe66\uff0b\uff1c-\uff1e\uff5c\uff5e\uffe2\uffe9-\uffec

              // 1d6c1 1d6db 1d6fb 1d715 1d735 1d74f 1d76f 1d789 1d7a9 1d7c3

              // Symbol, Other
              // latter alternates are surrogate pairs comprising 10102, 10137-1013f, 10179-10189, 10190-1019b, 101d0-101fc, 1d000-1d0f5, 1d100-1d126, 1d129-1d164, 1d16a-1d16c, 1d183-1d184, 1d18c-1d1a9, 1d1ae-1d1dd, 1d200-1d241, 1d245, 1d300-1d356, 1f000-1f02b, 1f030-1f093
              // So = '(?:[\u00a6\u00a7\u00a9\u00ae\u00b0\u00b6\u0482\u060e\u060f\u06e9\u06fd\u06fe\u07f6\u09fa\u0b70\u0bf3-\u0bf8\u0bfa\u0c7f\u0cf1\u0cf2\u0d79\u0f01-\u0f03\u0f13-\u0f17\u0f1a-\u0f1f\u0f34\u0f36\u0f38\u0fbe-\u0fc5\u0fc7-\u0fcc\u0fce\u0fcf\u109e\u109f\u1360\u1390-\u1399\u1940\u19e0-\u19ff\u1b61-\u1b6a\u1b74-\u1b7c\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211e-\u2123\u2125\u2127\u2129\u212e\u213a\u213b\u214a\u214c\u214d\u214f\u2195-\u2199\u219c-\u219f\u21a1\u21a2\u21a4\u21a5\u21a7-\u21ad\u21af-\u21cd\u21d0\u21d1\u21d3\u21d5-\u21f3\u2300-\u2307\u230c-\u231f\u2322-\u2328\u232b-\u237b\u237d-\u239a\u23b4-\u23db\u23e2-\u23e7\u2400-\u2426\u2440-\u244a\u249c-\u24e9\u2500-\u25b6\u25b8-\u25c0\u25c2-\u25f7\u2600-\u266e\u2670-\u269d\u26a0-\u26bc\u26c0-\u26c3\u2701-\u2704\u2706-\u2709\u270c-\u2727\u2729-\u274b\u274d\u274f-\u2752\u2756\u2758-\u275e\u2761-\u2767\u2794\u2798-\u27af\u27b1-\u27be\u2800-\u28ff\u2b00-\u2b2f\u2b45\u2b46\u2b50-\u2b54\u2ce5-\u2cea\u2e80-\u2e99\u2e9b-\u2ef3\u2f00-\u2fd5\u2ff0-\u2ffb\u3004\u3012\u3013\u3020\u3036\u3037\u303e\u303f\u3190\u3191\u3196-\u319f\u31c0-\u31e3\u3200-\u321e\u322a-\u3243\u3250\u3260-\u327f\u328a-\u32b0\u32c0-\u32fe\u3300-\u33ff\u4dc0-\u4dff\ua490-\ua4c6\ua828-\ua82b\ufdfd\uffe4\uffe8\uffed\uffee\ufffc\ufffd]|(?:\ud800[\udd02\udd37-\udd3f\udd79-\udd89\udd90-\udd9b\uddd0-\uddfc])|(?:\ud834[\udc00-\udcf5\udd00-\udd26\udd29-\udd64\udd6a-\udd6c\udd83-\udd84\udd8c-\udda9\uddae-\udddd\ude00-\ude41\ude45\udf00-\udf56])|(?:\ud83c[\udc00-\udc2b\udc30-\udc93]))';

              // Separator, Line
              // Zl = '[\u2028]';
              // Separator, Paragraph
              // Zp = '[\u2029]';
              // Separator, Space
              // Zs = '[\u0020\u00a0\u1680\u180e\u2000-\u200a\u202f\u205f\u3000]';

              // Form broader groups
              // C = join([Cc, Cf, Cn, Co, Cs]);
              // L = join([Ll, Lm, Lo, Lt, Lu]);
              // M = join([Mc, Me, Mn]);
              // N = join([Nd, Nl, No]);
              // P = join([Pc, Pd, Pe, Pf, Pi, Po, Ps]);
              // S = join([Sc, Sk, Sm, So]);
              // Z = join([Zl, Zp, Zs]);


              // \X = (?>\PM\pM*)
              // "Extended properties such as "Greek" or "InMusicalSymbols" are not supported by PCRE."
              throw 'You are in "X" (PCRE_EXTRA) mode, using a reserved and presently unused escape sequence in ' + getFuncName(arguments.callee);
            }
            break;
          case 'S': // spends "more time analyzing pattern in order to speed up the time taken for matching" (for subsequent matches)
            throw 'The passed flag "' + flag + '" to ' + getFuncName(arguments.callee) + ' cannot be implemented in JavaScript'; // Could possibly optimize inefficient expressions, however
          case 'y':
            throw 'Flag "y" is a non-cross-browser, non-PHP flag, not supported in ' + getFuncName(arguments.callee);
          default:
            throw 'Unrecognized flag "' + flag + '" passed to ' + getFuncName(arguments.callee);
        }
      }
    }
  }
  else {
    patternPart = pattern.source; // Allow JavaScript type expressions to take advantage of named subpatterns, so temporarily convert to string
    regexpFlags += pattern.global ? 'g' : '';
    regexpFlags += pattern.ignoreCase ? 'i' : '';
    regexpFlags += pattern.multiline ? 'm' : '';
  }

  patternPart = patternPart.replace(/\(\?<(.*?)>(.*?)\)/g, function(namedSubpattern, name, pattern) {
    subPatternNames.push(name);
    return '(' + pattern + ')';
  });

  pattern = new RegExp(patternPart, regexpFlags);

  // store the matches in the first index of the array
  array[0] = pattern.exec(subject);

  if (!array[0]) {
    return 0;
  }

  // If the user passed in a RegExp object or literal, we will probably need to reflect on
  //   its source, ignoreCase, global, and multiline properties to form a new expression (as above?),
  //   and use lastIndex
  if (offset) {
    // Not implemented
  }
  if (flags === 'PREG_OFFSET_CAPTURE' || flags === 256) { // Fix: make flags as number and allow bitwise AND checks against flags; see pathinfo()
    // Not implemented
    return 1; // matches will need to be different, so we return early here
  }

  // loop through the first indice of the array and store the values in the $matches array
  for (i = 0; i < array[0].length; i++) {
    matches[i] = array[0][i];
    if (i > 0 && subPatternNames[i - 1] !== undefined) {
      matches[subPatternNames] = array[0][i]; // UNTESTED
    }
  }

  return 1;
}




// preg_match_all.js
// Not yet ported. Feel like it?




// preg_replace.js
//parameter limit is optional (default value is -1)
//paramater pattern is a string type
//ex: preg_replace("/Hello/i","Hi",strtoreplace)
function preg_replace(pattern, replacement, subject, limit) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ferdinand Silva
  // *     example 1: preg_replace('/van/', '', 'Kevin van Zonneveld');
  // *     returns 1: 'Kevin  Zonneveld'

  // UNFINISHED
  // We should take a very serious look at Steve Levithan's XRegExp which implements Unicode classes and two extra flags: http://blog.stevenlevithan.com/archives/xregexp-javascript-regex-constructor
  // Before finding this, I was working on a script to search through an SQLite database to build our Unicode expressions automatically; I may finish that as it should be expandable for the future, and be an extra eye to confirm Steve's work
  // Also need to look at/integrate with Michael Grier's http://mgrier.com/te5t/preg_match_all.js ; http://mgrier.com/te5t/testpma.html ; http://mgrier.com/te5t/testpma.php

  // We also need to get rid of eval usage!

  if (typeof limit === 'undefined') limit = -1;
  if (subject.match(eval(pattern))) {
    if (limit == -1) { //no limit
      return subject.replace(eval(pattern + 'g'), replacement);
    } else {

      for (x = 0; x < limit; x++)
      {
        subject = subject.replace(eval(pattern), replacement);
      }

      return subject;
    }
  } else {
    return subject;
  }
}




// preg_replace_callback.js
function preg_replace_callback(pattern, callback, subject, limit) {
  // http://kevin.vanzonneveld.net
  // +   original by: James Brumond (http://kbjrweb.com/)
  // *     example 1:
  // *     returns 1:

  // Note: We should take a very serious look at Steve Levithan's XRegExp which implements Unicode classes and two extra flags: http://blog.stevenlevithan.com/archives/xregexp-javascript-regex-constructor
  // We also need to get rid of eval usage!

	// Run variable tests
	if (typeof pattern !== 'string') {return false;}
	if (typeof callback !== 'function') {return false;}
	if (typeof subject !== 'string') {return false;}
	if (typeof limit === 'undefined') {limit = -1;}
	if (typeof limit !== 'number') {return false;}

	// Get the RegExp object
	pattern = eval(pattern);

	// Make sure there are matches
	if (pattern.test(subject)) {
		var modified = '';

		// Loop until we reach our limit, or, if no limit, loop forever
		for (var i = 0; (i < limit || limit === -1); i++) {
			// Get the next match
			var match = subject.match(pattern);

			// Make sure we found a match
			if (match === null) {break;}

			// Explode the string at the match point
			subject = subject.split(match[0], 2);

			// Do the replacement
			modified += subject[0] + callback(match);
			subject = (subject[1] || '');
		}

		subject = modified + subject;
	}
	return subject;
}




// preg_split.js
function preg_split(pattern, subject, limit, flags) {
  // http://kevin.vanzonneveld.net
  // + original by: Marco Marchiò
  // * example 1: preg_split(/[\s,]+/, 'hypertext language, programming');
  // * returns 1: ['hypertext', 'language', 'programming']
  // * example 2: preg_split('//', 'string', -1, 'PREG_SPLIT_NO_EMPTY');
  // * returns 2: ['s', 't', 'r', 'i', 'n', 'g']
  // * example 3: var str = 'hypertext language programming';
  // * example 3: preg_split('/ /', str, -1, 'PREG_SPLIT_OFFSET_CAPTURE');
  // * returns 3: [['hypertext', 0], ['language', 10], ['programming', 19]]
  // * example 4: preg_split('/( )/', '1 2 3 4 5 6 7 8', 4, 'PREG_SPLIT_DELIM_CAPTURE');
  // * returns 4: ['1', ' ', '2', ' ', '3', ' ', '4 5 6 7 8']
  // * example 5: preg_split('/( )/', '1 2 3 4 5 6 7 8', 4, (2 | 4));
  // * returns 5: [['1', 0], [' ', 1], ['2', 2], [' ', 3], ['3', 4], [' ', 5], ['4 5 6 7 8', 6]]

  limit = limit || 0; flags = flags || ''; // Limit and flags are optional

  var result, ret = [], index = 0, i = 0,
      noEmpty = false, delim = false, offset = false,
      OPTS = {}, optTemp = 0,
      regexpBody = /^\/(.*)\/\w*$/.exec(pattern.toString())[1],
      regexpFlags = /^\/.*\/(\w*)$/.exec(pattern.toString())[1];
  // Non-global regexp causes an infinite loop when executing the while,
  // so if it's not global, copy the regexp and add the "g" modifier.
  pattern = pattern.global && typeof pattern !== 'string' ? pattern :
            new RegExp(regexpBody, regexpFlags + (regexpFlags.indexOf('g') !== -1 ? '' : 'g'));

  OPTS = {
    'PREG_SPLIT_NO_EMPTY': 1,
    'PREG_SPLIT_DELIM_CAPTURE': 2,
    'PREG_SPLIT_OFFSET_CAPTURE': 4
  };
  if (typeof flags !== 'number') { // Allow for a single string or an array of string flags
    flags = [].concat(flags);
    for (i = 0; i < flags.length; i++) {
      // Resolve string input to bitwise e.g. 'PREG_SPLIT_OFFSET_CAPTURE' becomes 4
      if (OPTS[flags[i]]) {
        optTemp = optTemp | OPTS[flags[i]];
      }
    }
    flags = optTemp;
  }
  noEmpty = flags & OPTS.PREG_SPLIT_NO_EMPTY;
  delim = flags & OPTS.PREG_SPLIT_DELIM_CAPTURE;
  offset = flags & OPTS.PREG_SPLIT_OFFSET_CAPTURE;

  var _filter = function(str, strindex) {
    // If the match is empty and the PREG_SPLIT_NO_EMPTY flag is set don't add it
    if (noEmpty && !str.length) {return;}
    // If the PREG_SPLIT_OFFSET_CAPTURE flag is set
    //      transform the match into an array and add the index at position 1
    if (offset) {str = [str, strindex];}
    ret.push(str);
  };
  // Special case for empty regexp
  if (!regexpBody) {
    result = subject.split('');
    for (i = 0; i < result.length; i++) {
      _filter(result[i], i);
    }
    return ret;
  }
  // Exec the pattern and get the result
  while (result = pattern.exec(subject)) {
    // Stop if the limit is 1
    if (limit === 1) {break;}
    // Take the correct portion of the string and filter the match
    _filter(subject.slice(index, result.index), index);
    index = result.index + result[0].length;
    // If the PREG_SPLIT_DELIM_CAPTURE flag is set, every capture match must be included in the results array
    if (delim) {
      // Convert the regexp result into a normal array
      var resarr = Array.prototype.slice.call(result);
      for (i = 1; i < resarr.length; i++) {
        if (result[i] !== undefined) {
          _filter(result[i], result.index + result[0].indexOf(result[i]));
        }
      }
    }
    limit--;
  }
  // Filter last match
  _filter(subject.slice(index, subject.length), index);
  return ret;
}




// runkit_constant_add.js
// We are not going to port this




// runkit_constant_redefine.js
// We are not going to port this




// runkit_constant_remove.js
// We are not going to port this




// runkit_lint.js
// We are not going to port this




// runkit_lint_file.js
// We are not going to port this




// runkit_return_value_used.js
// We are not going to port this




// Runkit_Sandbox.js
// We are not going to port this




// runkit_sandbox_output_handler.js
// We are not going to port this




// Runkit_Sandbox_Parent.js
// We are not going to port this




// $_SESSION.js
function $_SESSION() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: serialize
  // -    depends on: urlencode
  // *     example 1:
  // *     returns 1:

  //* Bundle all session destroying functions (they all do the same thing)
  //* Resets the global $_SESSION and sets the cookie to null
  var session_set_cookie = function(name, value, expires, path, domain, secure) {
    if (expires) {
      expires = (new Date((new Date).getTime() + expires * 3600)).toGMTString();
    }

    var r = [name + '=' + t.urlencode(value)], s = {}, i = '';
    s = {expires: expires, path: path, domain: domain};
    for (var i in s) {
      if (s.hasOwnProperty(i)) { // Exclude items on Object.prototype
        s[i] && r.push(i + '=' + s[i]);
      }
    }

    return secure && r.push('secure'), document.cookie = r.join(';'), true;
  };

  /**
    * Updates the session cookie data with $_SESSION
    */
  var lifetime = 1800, t = this; // in seconds
  return session_set_cookie('JSSESSID', t.serialize(t.$_SESSION), lifetime, path, domain, secure);
}

function session_update() {
  // -    depends on: setcookie
	this.setcookie('JSSESSID', this.serialize($_SESSION));
}




// session_cache_expire.js
// Not yet ported. Feel like it?




// session_cache_limiter.js
function session_cache_limiter() {

}




// session_commit.js
function session_commit() {
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: session_commit();
  // -    depends on: session_write_close
  // *     returns 1: undefined

  return this.session_write_close();
}




// session_decode.js
function session_decode(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // -    depends on: unserialize
  // -    depends on: urldecode
  // *     example 1:
  // *     returns 1:

  /**
* Decode string from session format
  */
  return this.unserialize(this.urldecode(str));
}




// session_destroy.js
function session_destroy() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: urlencode
  // *     example 1:
  // *     returns 1:

  var t = this;

  //* Bundle all session destroying functions (they all do the same thing)
  //* Resets the global $_SESSION and sets the cookie to null
  var session_set_cookie = function(name, value, expires, path, domain, secure) {
    if (expires) {
      expires = (new Date((new Date).getTime() + expires * 3600)).toGMTString();
    }

    var r = [name + '=' + t.urlencode(value)], s = {}, i = '';
    s = {expires: expires, path: path, domain: domain};
    for (var i in s) {
      if (s.hasOwnProperty(i)) { // Exclude items on Object.prototype
        s[i] && r.push(i + '=' + s[i]);
      }
    }

    return secure && r.push('secure'), document.cookie = r.join(';'), true;
  };

  t.$_SESSION = null;
	// t.setcookie('JSSESSID', null);
  return session_set_cookie('JSSESSID', null);
}




// session_encode.js
function session_encode() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // -    depends on: urldecode
  // *     example 1:
  // *     returns 1:

  var _getcookie = function(name) {
    var cookies = document.cookie.split(';'), i = 0, l = cookies.length,
            current;
    for (; i < l; i++) {
      current = cookies[i].split('=');
      //            current[0] = current[0].replace(/\s+/,"");
      if (current[0] === name) {return current[1];}
    }
    return undefined;
  };

  /**
    * Encode string in session format (serialized then url encoded)
    */
  return this.urldecode(_getcookie('JSSESSID'));
}




// session_get_cookie_params.js
function session_get_cookie_params(l, p, d, s) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1:
  // *     returns 1:

  var t = this;
  t.php_js = t.php_js || {}, pj = t.php_js;
  pj.cookie_params = pj.cookie_params || {};
  var params = pj.cookie_params;

  return {
    lifetime: params.lifetime,
    path: params.path,
    domain: params.domain,
    secure: params.secure,
    httponly: null // Not gettable or settable in client-side JavaScript
  };
}




// session_id.js
// Not yet ported. Feel like it?




// session_is_registered.js
function session_is_registered(name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Deprecated in PHP
  // *     example 1: session_is_registered('someUnregisteredGlobalVarName');
  // *     returns 1: false

  var obj = this.$_SESSION ? this : window; // Can be stored on the namespaced object
  return !!(obj.$_SESSION) && typeof obj.$_SESSION[name] !== 'undefined';
}




// session_module_name.js
// Not yet ported. Feel like it?




// session_name.js
function session_name(name) {
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: session_name('aNewSess');
  // *     returns 1: 'PHPSESSID'

  if (name && ((/^\d+$/).test(name) || !(/^[a-zA-Z0-9]+$/).test(name))) { // if underscore ok, use \W; if need one letter, must it be at beginning?
    throw 'Session name must consist of alphanumeric characters only (and at least one letter)';
  }
  var oldSessionName = '';

  // BEGIN REDUNDANT
  if (!this.php_js) {
    this.php_js = {};
  }
  if (!this.php_js.ini) {
    this.php_js.ini = {};
  }
  if (!this.php_js.ini['session.name']) {
    this.php_js.ini['session.name'] = {};
  }
  // END REDUNDANT

  if (this.php_js.ini['session.name'].local_value) {
    oldSessionName = this.php_js.ini['session.name'].local_value;
  }

  if (name) {
    this.php_js.ini['session.name'].local_value = name;
  }
  return oldSessionName || 'PHPSESSID';
}




// session_regenerate_id.js
// Not yet ported. Feel like it?




// session_register.js
function session_register() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Deprecated in PHP
  // *     example 1: session_register('someVarName');
  // *     returns 1: true

  var name = '', obj = this.$_SESSION ? this : window; // Allow storage on the namespaced object

  if (!this.$_SESSION && !window.$_SESSION) {
    window.$_SESSION = {};
  }

  for (var i = 0, argc = arguments.length; i < argc; i++) {
    if (typeof arguments[i] !== 'string') {
      this.session_register(arguments[i]); // Probably an array
    }
    else {
      name = arguments[i];
      obj.$_SESSION[name] = window[name];
    }
  }
  return true;
}




// session_save_path.js
// Not yet ported. Feel like it?




// session_set_cookie_params.js
function session_set_cookie_params(l, p, d, s, h) {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1:
  // *     returns 1: undefined

  if (h) {
    throw 'The argument "httponly" cannot be set in a client-side version of session_set_cookie_params().';
  }

  this.php_js = this.php_js || {};
  var params = this.php_js.cookie_params;
  params.lifetime = l;
  params.path = p;
  params.domain = d;
  params.secure = !!s; //make sure bool
}




// session_set_save_handler.js
// Not yet ported. Feel like it?




// session_start.js
function session_start() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // *     example 1:
  // *     returns 1:

  var _getcookie = function(name) {
    var cookies = document.cookie.split(';'), i = 0, l = cookies.length,
            current;
    for (; i < l; i++) {
      current = cookies[i].split('=');
      //            current[0] = current[0].replace(/\s+/,"");
      if (current[0] === name) {return current[1];}
    }
    return undefined;
  };
	/**
	* Check for a PHPSESSID. If found unpack it from the cookie
	* If not found, create it then pack everything in $_SESSION
	* into a cookie.
	*/
	if (document.cookie.indexOf('JSSESSID=') === -1) {
		$_SESSION = {};
		this.setcookie('JSSESSID', this.serialize($_SESSION));
	} else {
		$_SESSION = this.unserialize(this.urldecode(_getcookie('JSSESSID')));
	}
}


/**

    * Check for a PHPSESSID. If found unpack it from the cookie
    * If not found, create it then pack everything in $_SESSION
    * into a cookie.
    */
function session_start() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: unserialize
  // -    depends on: serialize
  // -    depends on: urlencode
  // *     example 1:
  // *     returns 1:

  //* Bundle all session destroying functions (they all do the same thing)
  //* Resets the global $_SESSION and sets the cookie to null
  var t = this;
  var _getcookie = function(name) {
    var cookies = document.cookie.split(';'), i = 0, l = cookies.length,
            current;
    for (; i < l; i++) {
      current = cookies[i].split('=');
      //            current[0] = current[0].replace(/\s+/,"");
      if (current[0] === name) {return current[1];}
    }
    return undefined;
  };
  var session_set_cookie = function(name, value, expires, path, domain, secure) {
    if (expires) {
      expires = (new Date((new Date).getTime() + expires * 3600)).toGMTString();
    }

    var r = [name + '=' + t.urlencode(value)], s = {}, i = '';
    s = {expires: expires, path: path, domain: domain};
    for (var i in s) {
      if (s.hasOwnProperty(i)) { // Exclude items on Object.prototype
        s[i] && r.push(i + '=' + s[i]);
      }
    }

    return secure && r.push('secure'), document.cookie = r.join(';'), true;
  };

  var sid = 'JSSESSID';
  this.php_js = this.php_js || {};
  var pj = this.php_js;
  var cookie = _getcookie(sid);
  if (!cookie || cookie === 'null') {
    t.$_SESSION = {};
    return session_set_cookie(sid, t.serialize(t.$_SESSION), pj.lifetime, pj.path, pj.domain, pj.secure);
  }
  t.$_SESSION = t.unserialize(t.urldecode(_getcookie(sid)));
  return true;
}




// session_unregister.js
function session_unregister(name) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Deprecated in PHP
  // *     example 1: session_unregister('someVarName');
  // *     returns 1: true

  var obj = this.$_SESSION ? this : window; // Allow storage on the namespaced object
  if (obj.$_SESSION) {
    delete obj.$_SESSION[name];
  }
  return true;
}

function session_unregister() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: urlencode
  // *     example 1:
  // *     returns 1:

  //* Bundle all session destroying functions (they all do the same thing)
  //* Resets the global $_SESSION and sets the cookie to null
  var session_set_cookie = function(name, value, expires, path, domain, secure) {
    if (expires) {
      expires = (new Date((new Date).getTime() + expires * 3600)).toGMTString();
    }

    var r = [name + '=' + t.urlencode(value)], s = {}, i = '';
    s = {expires: expires, path: path, domain: domain};
    for (var i in s) {
      if (s.hasOwnProperty(i)) { // Exclude items on Object.prototype
        s[i] && r.push(i + '=' + s[i]);
      }
    }

    return secure && r.push('secure'), document.cookie = r.join(';'), true;
  };


  var t = this;
  t.$_SESSION = null;
	// t.setcookie('JSSESSID', null);
  return session_set_cookie('JSSESSID', null);
}




// session_unset.js
function session_unset() {
  // http://kevin.vanzonneveld.net
  // +   original by: Louis Stowasser
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: urlencode
  // *     example 1:
  // *     returns 1:

  var t = this;
  //* Bundle all session destroying functions (they all do the same thing)
  //* Resets the global $_SESSION and sets the cookie to null
  var session_set_cookie = function(name, value, expires, path, domain, secure) {
    if (expires) {
      expires = (new Date((new Date).getTime() + expires * 3600)).toGMTString();
    }

    var r = [name + '=' + t.urlencode(value)], s = {}, i = '';
    s = {expires: expires, path: path, domain: domain};
    for (var i in s) {
      if (s.hasOwnProperty(i)) { // Exclude items on Object.prototype
        s[i] && r.push(i + '=' + s[i]);
      }
    }

    return secure && r.push('secure'), document.cookie = r.join(';'), true;
  };

  t.$_SESSION = null;
	// t.setcookie('JSSESSID', null);
  return session_set_cookie('JSSESSID', null);
}




// session_utils.js
// This file is only for assisting session testing; it is NOT a php.js function
/**
* Get value of a cookie
*/
function getcookie(name) {
  var cookies = document.cookie.split(';'), i = 0, l = cookies.length,
      current;
  for (; i < l; i++) {
    current = cookies[i].split('=');
    //            current[0] = current[0].replace(/\s+/,"");
    if (current[0] === name) {return current[1];}
  }
  return undefined;
}




// session_write_close.js
// Not yet ported. Feel like it?




// test.html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
                    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<link rel="stylesheet" href="http://github.com/jquery/qunit/raw/master/qunit/qunit.css" type="text/css" media="screen" />
<script type="text/javascript" src="http://github.com/jquery/qunit/raw/master/qunit/qunit.js"></script>
<script type="text/javascript" src="php.default.min.js"></script>
<script type="text/javascript" src="session_utils.js"></script>

<script type="text/javascript" src="session_start.js"></script>
<script type="text/javascript" src="session_encode.js"></script>
<script type="text/javascript" src="session_destroy.js"></script>
<script type="text/javascript" src="$_SESSION.js"></script>


<script>
$(document).ready(function(){
	module('Session Start');
	test('$_SESSION Exists', function() {
		session_start();
		ok($_SESSION, 'Session Exists');
		ok(getcookie('JSSESSID'), 'Session in cookie');
	});
	test('Modify $_SESSION',function() {
		$_SESSION('test', 'data');
		$_SESSION('coheed', 'yotbr');
		equals($_SESSION.test, 'data', 'Session var exists');
		equals($_SESSION.coheed, 'yotbr', 'Session var exists');
	});
	test('$_SESSION === JSSESSID',function() {
		$_SESSION = null;
		session_start();
		equals($_SESSION.test, 'data', 'Exists after session_start');
		equals($_SESSION.coheed, 'yotbr', 'Exists after session_start');
	});
	test('Session_Encode',function() {
		var se = session_encode();
		ok(se, 'Session encoded');
		equals(se, 'a:2:{s:4:"test";s:4:"data";s:6:"coheed";s:5:"yotbr";}', 'Encoded correctly');
	});
	test('Session Destroy/Unregister/Unset',function() {
		session_destroy();
		equals($_SESSION, null, '$_SESSION empty');
        // Add back for sake of next page
		session_start();
		$_SESSION('test', 'data');
		$_SESSION('coheed', 'yotbr');
    });
});
</script>

</head>
<body>
 <h1 id="qunit-header">QUnit example</h1>
 <h2 id="qunit-banner"></h2>
 <h2 id="qunit-userAgent"></h2>
 <ol id="qunit-tests"></ol>
 <div id="qunit-fixture">test markup, will be hidden</div>
 <a href="test2.html">Page 2</a>
</body>
</html>



// test2.html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" 
                    "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<link rel="stylesheet" href="http://github.com/jquery/qunit/raw/master/qunit/qunit.css" type="text/css" media="screen" />
<script type="text/javascript" src="http://github.com/jquery/qunit/raw/master/qunit/qunit.js"></script>
<script type="text/javascript" src="php.default.min.js"></script>
<script type="text/javascript" src="session_utils.js"></script>

<script type="text/javascript" src="session_start.js"></script>

<script>
$(document).ready(function(){
	module("Session Across Pages");
	test("$_SESSION Exists", function() {
		session_start();
		ok($_SESSION, "Session Exists");
		ok(getcookie("JSSESSID"), "Session in cookie");
	});
	test("$_SESSION data intact",function() {
		equals($_SESSION.test, "data", "Session var exists");
		equals($_SESSION.coheed, "yotbr", "Session var exists");
	});
	test("$_SESSION === JSSESSID",function() {
		$_SESSION = null;
		session_start();
		equals($_SESSION.test, "data", "Exists after session_start");
		equals($_SESSION.coheed, "yotbr", "Exists after session_start");
	});
});
</script>

</head>
<body>
 <h1 id="qunit-header">QUnit example</h1>
 <h2 id="qunit-banner"></h2>
 <h2 id="qunit-userAgent"></h2>
 <ol id="qunit-tests"></ol>
 <div id="qunit-fixture">test markup, will be hidden</div>
</body>
</html>



// stream_bucket_append.js
// Not yet ported. Feel like it?




// stream_bucket_make_writeable.js
// Not yet ported. Feel like it?




// stream_bucket_new.js
// Not yet ported. Feel like it?




// stream_bucket_prepend.js
// Not yet ported. Feel like it?




// stream_copy_to_stream.js
// Not yet ported. Feel like it?




// stream_encoding.js
// Not yet ported. Feel like it?




// stream_filter_append.js
function stream_filter_append(stream, filtername, read_write, params) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var fp = fopen('test.txt', 'w+');
  // *     example 1: stream_filter_append(fp, 'string.rot13', 'STREAM_FILTER_WRITE');
  // *     returns 1: 'Resource id #1'

  // Fix: "When a new filter is appended to a stream, data in the internal buffers is processed through the new filter at that time."

  var i = 0, opts = 0, resource = {};

  // FLAGS: read_write
  if (!read_write) {read_write = 0;}
  var OPTS = {
    STREAM_FILTER_READ: 1,
    STREAM_FILTER_WRITE: 2,
    STREAM_FILTER_ALL: 1 | 2
  };
  if (typeof options === 'number') {
    opts = read_write;
  }
  else { // Allow for a single string or an array of string flags
    read_write = [].concat(read_write);
    for (i = 0; i < read_write.length; i++) {
      // Resolve string input to bitwise
      if (OPTS[read_write[i]]) {
        opts = opts | OPTS[read_write[i]];
      }
    }
  }

  // ATTACH FILTER INFO ONTO STREAM (do instead with map on php_js?)
  if (!stream.filters) {
    stream.filters = [];
  }
  stream.filters.push([filtername, opts, params]);

  // BEGIN REDUNDANT
  this.php_js = this.php_js || {};
  this.php_js.resourceIdCounter = this.php_js.resourceIdCounter || 0;

  function PHPJS_Resource(type, id, opener) { // Can reuse the following for other resources, just changing the instantiation
    // See http://php.net/manual/en/resource.php for types
    this.type = type;
    this.id = id;
    this.opener = opener;
  }
  PHPJS_Resource.prototype.toString = function() {
    return 'Resource id #' + this.id;
  };
  PHPJS_Resource.prototype.get_resource_type = function() {
    return this.type;
  };
  PHPJS_Resource.prototype.var_dump = function() {
    return 'resource(' + this.id + ') of type (' + this.type + ')';
  };
  // END REDUNDANT

  this.php_js.resourceIdCounter++;
  resource = new PHPJS_Resource('stream filter', this.php_js.resourceIdCounter, 'stream_filter_append');
  resource.streamData = [stream, filtername, opts, params]; // Will be used as basis for stream_filter_remove()
  return resource;
}




// stream_get_meta_data.js
// Not yet ported. Feel like it?




// stream_get_transports.js
// Not yet ported. Feel like it?




// stream_resolve_include_path.js
// Not yet ported. Feel like it?




// stream_select.js
// Not yet ported. Feel like it?




// stream_set_blocking.js
// Not yet ported. Feel like it?




// stream_set_timeout.js
// Not yet ported. Feel like it?




// stream_set_write_buffer.js
// Not yet ported. Feel like it?




// stream_socket_accept.js
// Not yet ported. Feel like it?




// stream_socket_client.js
// Not yet ported. Feel like it?




// stream_socket_enable_crypto.js
// Not yet ported. Feel like it?




// stream_socket_get_name.js
// Not yet ported. Feel like it?




// stream_socket_pair.js
// Not yet ported. Feel like it?




// stream_socket_recvfrom.js
// Not yet ported. Feel like it?




// stream_socket_sendto.js
// Not yet ported. Feel like it?




// stream_socket_server.js
// Not yet ported. Feel like it?




// stream_socket_shutdown.js
// Not yet ported. Feel like it?




// stream_supports_lock.js
// Not yet ported. Feel like it?




// convert_uudecode.js
function convert_uudecode(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Ole Vrijenhoek
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // -    depends on: is_scalar
  // -    depends on: rtrim
  // *     example 1: convert_uudecode('+22!L;W9E(%!(4\"$`\n`');
  // *     returns 1: 'I love PHP'

  // Not working perfectly

  // shortcut
  var chr = function(c) {
    return String.fromCharCode(c);
  };

  if (!str || str === '') {
    return chr(0);
  } else if (!this.is_scalar(str)) {
    return false;
  } else if (str.length < 8) {
    return false;
  }

  var decoded = '', tmp1 = '', tmp2 = '';
  var c = 0, i = 0, j = 0, a = 0;
  var line = str.split('\n');
  var bytes = [];

  for (i in line) {
    c = line[i].charCodeAt(0);
    bytes = line[i].substr(1);

    // Convert each char in bytes[] to a 6-bit
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




// crypt.js
// Not yet ported. Feel like it?




// metaphone.js
function metaphone(str) {
  // The code below is based on description from Wikipedia (http://en.wikipedia.org/wiki/Metaphone)
  // There are some modifications applied, like
  // - changing the order of rules
  // - changing the rules to match PHP algorithm
  // modifications are based on PHP metaphone source code

  // changing the input string to lower case
  // all rules replace lower-case characters with upper-case, so following rules won't be applied to already computed parts
  str = ('' + str).toLowerCase();

  var rules = [
    // 1. Drop duplicate adjacent letters, except for G
    // php also doesn't remove 'C' duplicates
    /([^cg])\1+/g, '',

    // 2. If the word begins with 'KN', 'GN', 'PN', 'AE', 'WR', drop the first letter

    /^[gkp]n/, 'N',
    /^ae/, 'E',
    /^wr/, 'R',

    // 3. Drop 'B' if after 'M' and if it is at the end of the word
    // php ignores the "end of word" part of the rule
    /mb/g, '',

    // 9. 'CK' transforms to 'K'
    // Applying the rule here, cause rule 4) replaces all 'C's with 'K'
    /ck/g, 'K',

    // 4. 'C' transforms to 'X' if followed by 'IA' or 'H' (unless in latter case, it is part of '-SCH-', in which case it transforms to 'K'). 'C' transforms to 'S' if followed by 'I', 'E', or 'Y'. Otherwise, 'C' transforms to 'K'
    /\Bsch/g, 'SK', // check if replace both S and H or only the C. Check if '\B' works correctly for multiple words
    /c(?=ia)/g, 'X',
    /[cs]h/g, 'X', // PHP also drops the 'H' character
    /c(?=[eiy])/g, 'S',
    /c/g, 'K',

    // 5. 'DG' transforms to 'J' if followed by 'GE', 'GY', or 'GI'. Otherwise, 'D' transforms to 'T
    /dg(?=[eiy])/g, 'J',
    /d/g, 'T',

    // 6. Drop 'G' if followed by 'H' and 'H' is not at the end or before a vowel. Drop 'G' if followed by 'N' or 'NED' and is at the end
    /gh(?![aeiou]|$)/g, 'H',
    /g(?=n(ed)?)$/g, '',

    // 7. 'G' transforms to 'J' if before 'I', 'E', or 'Y', and it is not in 'GG'. Otherwise, 'G' transforms to 'K'. Reduce 'GG' to 'G'
    /(^|[^g])g(?=[eiy])/g, '$1J',
    /g+/g, 'K', // check if that's the way GG is replaced with K, or it should be G in result string

    // 8. Drop 'H' if after vowel and not before a vowel
    /([aeiou])h(?![aeiou])/g, '$1',

    // 10. 'PH' transforms to 'F'
    /ph/g, 'F',

    // 11. 'Q' transforms to 'K'
    /q/g, 'K',

    // 12. 'S' transforms to 'X' if followed by 'H', 'IO', or 'IA'
    // php also drops the 'H' in 'SH' case, which is done in 'CH' rule
    /s(?=i[oa])/g, 'X',

    // 13. 'T' transforms to 'X' if followed by 'IA' or 'IO'. 'T' transforms to '0' if followed by 'H'. Drop 'T' if followed by 'CH'
    // php replaces 'TH' with '0', not only the 'T'
    /t(?=i[ao])/g, 'X',
    /th/g, '0',
    /t(?=ch)/g, '', // check if this is valid, cause 'CH' case is already replaced with 'X'

    // 14. 'V' transforms to 'F'
    /v/g, 'F',

    // 15. 'WH' transforms to 'W' if at the beginning. Drop 'W' if not followed by a vowel
    // 17. Drop 'Y' if not followed by a vowel
    /^wh/, 'W',
    /[wy](?![aeiou])/g, '',

    // 16. 'X' transforms to 'S' if at the beginning. Otherwise, 'X' transforms to 'KS'
    /^x/, 'S',
    /x/g, 'KS',

    // 18. 'Z' transforms to 'S'
    /z/g, 'S',

    // 19. Drop all vowels unless it is the beginning
    /(^[aeiou])?[aeiou]?/g, '$1',

    // Remove all non-ascii characters
    // doing case-insensitive replace, so that upper-case ASCII characters remain untouched
    /[^a-z0]/ig, ''
  ];

  for (var i = 0, l = rules.length; i < l; i += 2) {
    str = str.replace(rules[i], rules[i + 1]);
  }

  // transforming result to upper-case
  return str.toUpperCase();
}





// stripcslashes.js
function stripcslashes(str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: stripcslashes("\\f\\o\\o\\[ \\]");
  // *     returns 1: 'foo[ ]'

  var target = '', i = 0, sl = 0, s = '', next = '', hex = '', oct = '', hex2DigMax = /[\dA-Fa-f]{1,2}/, rest = '', seq = '',
      oct3DigMaxs = /([0-7]{1,3})((\\[0-7]{1,3})*)/, oct3DigMax = /(\\([0-7]{1,3}))*/g, escOctGrp = [];

  for (i = 0, sl = str.length; i < sl; i++) {
    s = str.charAt(i);
    next = str.charAt(i + 1);
    if (s !== '\\' || !next) {
      target += s;
      continue;
    }
    switch (next) {
      case 'r': target += '\u000D'; break;
      case 'a': target += '\u0007'; break;
      case 'n': target += '\n'; break;
      case 't': target += '\t'; break;
      case 'v': target += '\v'; break;
      case 'b': target += '\b'; break;
      case 'f': target += '\f'; break;
      case '\\': target += '\\'; break;
      case 'x': // Hex (not used in addcslashes)
        rest = str.slice(i + 2);
        if (rest.search(hex2DigMax) !== -1) { // C accepts hex larger than 2 digits (per http://www.php.net/manual/en/function.stripcslashes.php#34041 ), but not PHP
          hex = (hex2DigMax).exec(rest);
          i += hex.length; // Skip over hex
          target += String.fromCharCode(parseInt(hex, 16));
          break;
        }
      // Fall-through
      default: // Up to 3 digit octal in PHP, but we may have created a larger one in addcslashes
        rest = str.slice(i + 2);
        if (rest.search(oct3DigMaxs) !== -1) { // C accepts hex larger than 2 digits (per http://www.php.net/manual/en/function.stripcslashes.php#34041 ), but not PHP
          oct = (oct3DigMaxs).exec(rest);
          i += oct[1].length; // Skip over first octal
          // target += String.fromCharCode(parseInt(oct[1], 8)); // Sufficient for UTF-16 treatment

          // Interpret int here as UTF-8 octet(s) instead, produce non-character if none
          rest = str.slice(i + 2); // Get remainder after the octal (still need to add 2, since before close of iterating loop)
          seq = '';

          if ((escOctGrp = oct3DigMax.exec(rest)) !== null) {
            seq += '%' + parseInt(escOctGrp[2], 8).toString(16);
          }
          /* infinite loop
                    while ((escOctGrp = oct3DigMax.exec(rest)) !== null) {
                        seq += '%'+parseInt(escOctGrp[2], 8).toString(16);
                    }

                    dl('stripcslashes');
                    alert(
                        stripcslashes('\\343\\220\\201')
                    )
                    */

          try {
            target += decodeURIComponent(seq);
          }
          catch (e) { // Bad octal group
            target += '\uFFFD'; // non-character
          }

          break;
        }
        target += next;
        break;
    }
    ++i; // Skip special character "next" in switch
  }
}




// 1token_get_all.js
function token_get_all (source) {
	// Split given source into PHP tokens
	// + original by: Marco Marchi�
	// + improved by: Brett Zamir (http://brett-zamir.me)
	// - depends on: token_name
	// % note 1: Token numbers depend on the PHP version
	// % note 2: token_name is only necessary for a non-standard php.js-specific use of this function;
	// % note 2: if you define an object on this.php_js.phpParser (where "this" is the scope of the
	// % note 2: token_get_all function (either a namespaced php.js object or the window object)),
	// % note 2: this function will call that object's methods if they have the same names as the tokens,
	// % note 2: passing them the string, line number, and token number (in that order)
	// * example 1: token_get_all('/'+'* comment *'+'/');
	// * returns 1: [[311, '/* comment */', 1]]
	
	// Token to number conversion
    var tokens = {
        T_REQUIRE_ONCE:261,
        T_REQUIRE:260,
        T_EVAL:259,
        T_INCLUDE_ONCE:258,
        T_INCLUDE:257,
        T_LOGICAL_OR:262,
        T_LOGICAL_XOR:263,
        T_LOGICAL_AND:264,
        T_PRINT:265,
        T_SR_EQUAL:276,
        T_SL_EQUAL:275,
        T_XOR_EQUAL:274,
        T_OR_EQUAL:273,
        T_AND_EQUAL:272,
        T_MOD_EQUAL:271,
        T_CONCAT_EQUAL:270,
        T_DIV_EQUAL:269,
        T_MUL_EQUAL:268,
        T_MINUS_EQUAL:267,
        T_PLUS_EQUAL:266,
        T_BOOLEAN_OR:277,
        T_BOOLEAN_AND:278,
        T_IS_NOT_IDENTICAL:282,
        T_IS_IDENTICAL:281,
        T_IS_NOT_EQUAL:280,
        T_IS_EQUAL:279,
        T_IS_GREATER_OR_EQUAL:284,
        T_IS_SMALLER_OR_EQUAL:283,
        T_SR:286,
        T_SL:285,
        T_INSTANCEOF:287,
        T_UNSET_CAST:296,
        T_BOOL_CAST:295,
        T_OBJECT_CAST:294,
        T_ARRAY_CAST:293,
        T_STRING_CAST:292,
        T_DOUBLE_CAST:291,
        T_INT_CAST:290,
        T_DEC:289,
        T_INC:288,
        T_CLONE:298,
        T_NEW:297,
        T_EXIT:299,
        T_IF:300,
        T_ELSEIF:301,
        T_ELSE:302,
        T_ENDIF:303,
        T_LNUMBER:304,
        T_DNUMBER:305,
        T_STRING:306,
        T_STRING_VARNAME:307,
        T_VARIABLE:308,
        T_NUM_STRING:309,
        T_INLINE_HTML:310,
        T_CHARACTER:311,
        T_BAD_CHARACTER:312,
        T_ENCAPSED_AND_WHITESPACE:313,
        T_CONSTANT_ENCAPSED_STRING:314,
        T_ECHO:315,
        T_DO:316,
        T_WHILE:317,
        T_ENDWHILE:318,
        T_FOR:319,
        T_ENDFOR:320,
        T_FOREACH:321,
        T_ENDFOREACH:322,
        T_DECLARE:323,
        T_ENDDECLARE:324,
        T_AS:325,
        T_SWITCH:326,
        T_ENDSWITCH:327,
        T_CASE:328,
        T_DEFAULT:329,
        T_BREAK:330,
        T_CONTINUE:331,
        T_GOTO:332,
        T_FUNCTION:333,
        T_CONST:334,
        T_RETURN:335,
        T_TRY:336,
        T_CATCH:337,
        T_THROW:338,
        T_USE:339,
        T_GLOBAL:340,
        T_PUBLIC:346,
        T_PROTECTED:345,
        T_PRIVATE:344,
        T_FINAL:343,
        T_ABSTRACT:342,
        T_STATIC:341,
        T_VAR:347,
        T_UNSET:348,
        T_ISSET:349,
        T_EMPTY:350,
        T_HALT_COMPILER:351,
        T_CLASS:352,
        T_INTERFACE:353,
        T_EXTENDS:354,
        T_IMPLEMENTS:355,
        T_OBJECT_OPERATOR:356,
        T_DOUBLE_ARROW:357,
        T_LIST:358,
        T_ARRAY:359,
        T_CLASS_C:360,
        T_METHOD_C:361,
        T_FUNC_C:362,
        T_LINE:363,
        T_FILE:364,
        T_COMMENT:365,
        T_DOC_COMMENT:366,
        T_OPEN_TAG:367,
        T_OPEN_TAG_WITH_ECHO:368,
        T_CLOSE_TAG:369,
        T_WHITESPACE:370,
        T_START_HEREDOC:371,
        T_END_HEREDOC:372,
        T_DOLLAR_OPEN_CURLY_BRACES:373,
        T_CURLY_OPEN:374,
        T_PAAMAYIM_NEKUDOTAYIM:375,
        T_NAMESPACE:376,
        T_NS_C:377,
        T_DIR:378,
        T_NS_SEPARATOR:379
    },
	//Keywords tokens
	keywordsToken = {
		"abstract": tokens.T_ABSTRACT,
		"array": tokens.T_ARRAY,
		"as": tokens.T_AS,
		"break": tokens.T_BREAK,
		"case": tokens.T_CASE,
		"catch": tokens.T_CATCH,
		"class": tokens.T_CLASS,
		"__CLASS__": tokens.T_CLASS_C,
		"clone": tokens.T_CLONE,
		"const": tokens.T_CONST,
		"continue": tokens.T_CONTINUE,
		"declare": tokens.T_DECLARE,
		"default": tokens.T_DEFAULT,
		"__DIR__": tokens.T_DIR,
		"die": tokens.T_EXIT,
		"do": tokens.T_DO,
		"echo": tokens.T_ECHO,
		"else": tokens.T_ELSE,
		"elseif": tokens.T_ELSEIF,
		"empty": tokens.T_EMPTY,
		"enddeclare": tokens.T_ENDDECLARE,
		"endfor": tokens.T_ENDFOR,
		"endforeach": tokens.T_ENDFOREACH,
		"endif": tokens.T_ENDIF,
		"endswitch": tokens.T_ENDSWITCH,
		"endwhile": tokens.T_ENDWHILE,
		"eval": tokens.T_EVAL,
		"exit": tokens.T_EXIT,
		"extends": tokens.T_EXTENDS,
		"__FILE__": tokens.T_FILE,
		"final": tokens.T_FINAL,
		"for": tokens.T_FOR,
		"foreach": tokens.T_FOREACH,
		"function": tokens.T_FUNCTION,
		"__FUNCTION__": tokens.T_FUNC_C,
		"global": tokens.T_GLOBAL,
		"goto": tokens.T_GOTO,
		"__halt_compiler": tokens.T_HALT_COMPILER,
		"if": tokens.T_IF,
		"implements": tokens.T_IMPLEMENTS,
		"include": tokens.T_INCLUDE,
		"include_once": tokens.T_INCLUDE_ONCE,
		"instanceof": tokens.T_INSTANCEOF,
		"interface": tokens.T_INTERFACE,
		"isset": tokens.T_ISSET,
		"__LINE__": tokens.T_LINE,
		"list": tokens.T_LIST,
		"and": tokens.T_LOGICAL_AND,
		"or": tokens.T_LOGICAL_OR,
		"xor": tokens.T_LOGICAL_XOR,
		"__METHOD__": tokens.T_METHOD_C,
		"namespace": tokens.T_NAMESPACE,
		"__NAMESPACE__": tokens.T_NS_C,
		"new": tokens.T_NEW,
		"print": tokens.T_PRINT,
		"private": tokens.T_PRIVATE,
		"public": tokens.T_PUBLIC,
		"protected": tokens.T_PROTECTED,
		"require": tokens.T_REQUIRE,
		"require_once": tokens.T_REQUIRE_ONCE,
		"return": tokens.T_RETURN,
		"static": tokens.T_STATIC,
		"switch": tokens.T_SWITCH,
		"throw": tokens.T_THROW,
		"try": tokens.T_TRY,
		"unset": tokens.T_UNSET,
		"use": tokens.T_USE,
		"var": tokens.T_VAR,
		"while": tokens.T_WHILE
	},
	//Type casting tokens
	typeCasting = {
		"array": tokens.T_ARRAY_CAST,
		"bool": tokens.T_BOOL_CAST,
		"boolean": tokens.T_BOOL_CAST,
		"real": tokens.T_DOUBLE_CAST,
		"double": tokens.T_DOUBLE_CAST,
		"float": tokens.T_DOUBLE_CAST,
		"int": tokens.T_INT_CAST,
		"integer": tokens.T_INT_CAST,
		"object": tokens.T_OBJECT_CAST,
		"string": tokens.T_STRING_CAST,
		"unset": tokens.T_UNSET_CAST,
		"binary": tokens.T_STRING_CAST
	},
	//Symbols tokens
	symbols = {
		"&=": tokens.T_AND_EQUAL,
		"&&": tokens.T_BOOLEAN_AND,
		"||": tokens.T_BOOLEAN_OR,
		"?>": tokens.T_CLOSE_TAG,
		"%>": tokens.T_CLOSE_TAG,
		".=": tokens.T_CONCAT_EQUAL,
		"--": tokens.T_DEC,
		"/=": tokens.T_DIV_EQUAL,
		"=>": tokens.T_DOUBLE_ARROW,
		"::": tokens.T_PAAMAYIM_NEKUDOTAYIM,
		"++": tokens.T_INC,		
		"==": tokens.T_IS_EQUAL,
		">=": tokens.T_IS_GREATER_OR_EQUAL,
		"===": tokens.T_IS_IDENTICAL,
		"!=": tokens.T_IS_NOT_EQUAL,
		"<>": tokens.T_IS_NOT_EQUAL,
		"!==": tokens.T_IS_NOT_IDENTICAL,
		"<=": tokens.T_IS_SMALLER_OR_EQUAL,
		"-=": tokens.T_MINUS_EQUAL,
		"%=": tokens.T_MOD_EQUAL,
		"*=": tokens.T_MUL_EQUAL,
		"\\": tokens.T_NS_SEPARATOR,		
		"->": tokens.T_OBJECT_OPERATOR,
		"|=": tokens.T_OR_EQUAL,
		"+=": tokens.T_PLUS_EQUAL,
		"<<": tokens.T_SL,
		"<<=": tokens.T_SL_EQUAL,
		">>": tokens.T_SR,	
		">>=": tokens.T_SR_EQUAL,
		"^=": tokens.T_XOR_EQUAL
	},
	//Buffer tokens
	bufferTokens = {
		"html": tokens.T_INLINE_HTML,
		"inlineComment": tokens.T_COMMENT,
		"comment": tokens.T_COMMENT,
		"docComment": tokens.T_DOC_COMMENT,
		"singleQuote": tokens.T_CONSTANT_ENCAPSED_STRING,
		"doubleQuotes": tokens.T_CONSTANT_ENCAPSED_STRING,
		"nowdoc": tokens.T_ENCAPSED_AND_WHITESPACE,
		"heredoc": tokens.T_ENCAPSED_AND_WHITESPACE
	},
	//Buffer type. Start an html buffer immediatelly.
	bufferType = "html",
	//Buffer content
	buffer = "",
	match,
	token,
	//Last emitted token
	lastToken,
	//Results array
	ret = [],
	//Word that started the heredoc or nowdoc buffer
	heredocWord,
	//Line number
	line = 1,
	//Line at which the buffer begins
	lineBuffer = 1,
	//Flag that indicates if the current double quoted string has been splitted
	split,
	//This variable will store the previous buffer type of the tokenizer before parsing a
	//complex variable syntax
	complexVarPrevBuffer,
	//Number of open brackets inside a complex variable syntax
	openBrackets,
	//Function to emit tokens
	emitToken = function (token, code, preventBuffer, l) {
		if (!preventBuffer && bufferType) {
			buffer += token;
			lastToken = null;
		} else {
			lastToken = code ? code : token;
			ret.push(code ? [code, token, l || line] : token);
		}
	},
	//Function to emit and close the current buffer
	emitBuffer = function () {
		buffer && emitToken(buffer, bufferTokens[bufferType], true, lineBuffer);
		buffer = "";
		bufferType = null;
	},
	//Function to check if the token at the current index is escaped
	isEscaped = function () {
		var escaped = false,
			i = match.index - 1;
		for (1; i >= 0; i--) {
			if (source.charAt(i) !== "\\") {
				break;
			}
			escaped = !escaped;
		}
		return escaped;
	},
	//This function is used to split a double quoted string or a heredoc buffer after a variable
	//has been found inside it
	splitString = function () {
		//Don't emit empty buffers
		if (!buffer) {
			return;
		}
		//If the buffer is a double quoted string and it has not yet been splitted, emit the double
		//quotes as a token without an associated code
		if (bufferType === "doubleQuotes" && !split) {
			split = true;
			emitToken('"', null, true);
			buffer = buffer.substr(1);
		}
		buffer && emitToken(buffer, tokens.T_ENCAPSED_AND_WHITESPACE, true, lineBuffer);
		buffer = "";
		lineBuffer = line;
	},
	//Returns the number of line feed characters in the given string
	getNewLines = function (str) {
		var i = 0;
		str.replace(newLines, function () {
			i++;
		});
		return i;
	},
	//Regexp that matches starting whitespaces
	nextWS = /^\s/,
	//Regexp that matches starting line feeds
	nextLF = /^\r?\n/,
	//Regexp to remove characters and get the type in type casting tokens
	castType = /^\(\s*|\s*\)$/g,
	//Regexp used to find additional whitespaces matches by the first group of the main regexp
	additionalSpaces = /(\r?\n)(\s+)$/,
	//Regexp used to find line feed characters in a string
	newLines = /\n/g,
	//Regexp used to strip useless characters from heredoc start declaration
	heredocStripChars = /^<<<\s*"?|["']?\r?\n/g,
	//Regexp to check if the characters that follow a word are valid as heredoc end declaration
	heredocEndFollowing = /^;?\r?\n/,
	//Tokenizer regexp
	tokenizer = /(\s+)|(<(?:\?(?:php\r?\s?|=)?|%=?))|\b(__halt_compiler|__CLASS__|__DIR__|__FILE__|__FUNCTION__|__LINE__|__METHOD__|__NAMESPACE__|abstract|and|array|as|break|case|catch|class|clone|const|continue|declare|default|die|do|echo|elseif|else|empty|enddeclare|endforeach|endfor|endif|endswitch|endwhile|eval|exit|final|foreach|for|function|extends|global|goto|if|implements|include_once|include|instanceof|interface|isset|list|namespace|new|or|xor|print|private|protected|public|require_once|require|return|static|switch|throw|try|unset|use|var|while)\b|(\(\s*(?:array|bool(?:ean)?|real|double|float|int(?:eger)?|object|string|unset|binary)\s*\))|((?:\d+(?:\.\d*)?|\d*\.\d+)e[\+\-]?\d+|\d*\.\d+|\d+\.\d*)|(\d+(?:x[0-9a-fA-F]+)?)|(\$[a-zA-Z_][a-zA-Z_0-9]*)|(\/\/|\/\*\*?|\*\/|#)|(<<<\s*['"]?[a-zA-Z]\w*['"]?\r?\n)|(&[=&]?|\.=?|\/=?|-[=\->]?|::?|\^=?|%[=>]?|\?>?|\+[=\+]?|\*=?|\|[=\|]?|!={0,2}|=(?:>|={1,2})?|>>?=?|<(?:>|<?=?)?|[\\;\(\)\{\}\[\],~@`\$"'])|(\w+)|(.)/ig;
	
	while (match = tokenizer.exec(source)) {
		if (match[1]) {
			//Whitespace
			token = match[1];
			//Since PHP closing tag token matches also the following line feed
			//character, if the last token was a PHP closing tag and the current
			//one starts with a line feed, this character must be removed and
			//added to the previous token
			if (lastToken === tokens.T_CLOSE_TAG) {
				token = token.replace(nextLF, function (a) {
					ret[ret.length - 1][1] += a;
					line++;
					lineBuffer++;
					return "";
				});
				if (!token) {
					continue;
				}
			}
			emitToken(token, tokens.T_WHITESPACE);
			if (token.indexOf("\n") > -1) {
				//Increment line number if the token contains one or more line feed characters
				line += getNewLines(token);
				//Close the inline comment buffer if it's open
				if (bufferType === "inlineComment") {
					//Since the regexp matches multilple whitespaces but the comment token includes
					//only the first line feed, the other whitespaces must be emitted as a separated
					//token
					var spToken = false,
						lf;
					buffer = buffer.replace(additionalSpaces, function (a, p, n) {
						spToken = n;
						return p;
					});
					emitBuffer();
					if (spToken) {
						lf = getNewLines(spToken);
						emitToken(spToken, tokens.T_WHITESPACE, true, line - lf);
					}
				}
			}
		} else if (match[2]) {
			//PHP Open tags
			token = match[2];
			//If there's an active html buffer emit it as a token
			if (bufferType === "html") {
				emitBuffer();
			}
			emitToken(
				token,
				token === "<?=" || token === "<%=" ? tokens.T_OPEN_TAG_WITH_ECHO : tokens.T_OPEN_TAG
			);
			if (token.indexOf("\n") > -1) {
				line++;
			}
		} else if (match[3]) {
			//Keywords
			token = match[3];
			//If it's preceded by -> than it's an object property and it must be tokenized as T_STRING
			emitToken(
				token,
				lastToken === tokens.T_OBJECT_OPERATOR ?
				tokens.T_STRING :
				keywordsToken[token] || keywordsToken[token.toLowerCase()]
			);
		} else if (match[4]) {
			//Type-casting
			token = match[4].replace(castType, "").toLowerCase();
			emitToken(match[4], typeCasting[token]);
		} else if (match[5]) {
			//Floating point numbers
			emitToken(match[5], tokens.T_DNUMBER);
		} else if (match[6] || match[6] === "0") {
			//Integer numbers
			//Numeric array index inside a heredoc or a double quoted string
			if (lastToken === "[" && (bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				emitToken(match[6], tokens.T_NUM_STRING, true);
			} else {
				token = match[6];
				var isHex = token.charAt(1).toLowerCase() === "x";
				//If it's greater than 2147483648 it's considered as a floating point number
				emitToken(
					token,
					parseInt(isHex ? parseInt(token, 16) : token, 10) < 2147483648 ?
					tokens.T_LNUMBER :
					tokens.T_DNUMBER
				);
			}
		} else if (match[7]) {
			//Variable
			//If there's an active buffer emit the token only if it's inside a double quoted string
			//or a  heredoc and it's not escaped
			if ((bufferType === "heredoc" || bufferType === "doubleQuotes") && !isEscaped()) {
				splitString();
				emitToken(match[7], tokens.T_VARIABLE, true);
			} else {
				emitToken(match[7], tokens.T_VARIABLE);
			}
		} else if(match[8]) {
			//Comment signs
			token = match[8];
			//Change the buffer only if there's no active buffer
			if (!bufferType) {
				if (token === "//" || token === "#") {
					bufferType = "inlineComment";
				} else if (token === "/**") {
					bufferType = nextWS.test(source.substr(match.index + token.length)) ?
								"docComment" :
								"comment";
				} else if (token === "/*") {
					bufferType = "comment";
				}
				lineBuffer = line;
			}
			emitToken(token);
			//Close the multi line comment buffer if there's one open
			if (token === "*/" && (bufferType === "comment" || bufferType === "docComment")) {
				emitBuffer();
			}
		} else if (match[9]) {
			//Heredoc and nowdoc start declaration
			token = match[9];
			emitToken(token, tokens.T_START_HEREDOC);
			line++;
			if (!bufferType) {
				heredocWord = token.replace(heredocStripChars, "");
				//If the first character is a quote then it's a nowdoc otherwise it's an heredoc
				if (heredocWord.charAt(0) === "'") {
					//Strip the leading quote
					heredocWord = heredocWord.substr(1);
					bufferType = "nowdoc";
				} else {
					bufferType = "heredoc";
				}
				lineBuffer = line;
			}
		} else if (match[10]) {
			//Symbols
			token = match[10];
			if (token in symbols) {
				//Syntax $obj->prop inside strings and heredoc
				if (token === "->" && lastToken === tokens.T_VARIABLE && (bufferType === "heredoc" ||
					bufferType === "doubleQuotes")) {
					emitToken(token, symbols[token], true);
					continue;
				}
				emitToken(token, symbols[token]);
				//If the token is a PHP close tag and there isn't an active buffer start an html buffer
				if (!bufferType && symbols[token] === tokens.T_CLOSE_TAG) {
					bufferType = "html";
					lineBuffer = line;
				}
			} else {
				//Start string buffers if there isn't an active buffer
				if (!bufferType && (token === "'" || token === '"')) {
					if (token === "'") {
						bufferType = "singleQuote";
					} else {
						split = false;
						bufferType = "doubleQuotes";
					}
					lineBuffer = line;
					//Add the token to the buffer and continue to skip next checks
					emitToken(token);
					continue;
				} else if (token === '"' && bufferType === "doubleQuotes" && !isEscaped()) {
					//If the string has been splitted emit the current buffer and the double quotes
					//as separate tokens
					if (split) {
						splitString();
						bufferType = null;
						emitToken('"');
					} else {
						emitToken('"');
						emitBuffer();
					}
					continue;
				} else if (bufferType === "heredoc" || bufferType === "doubleQuotes") {
					//Array index delimiters inside heredoc or double quotes
					if ((token === "[" && lastToken === tokens.T_VARIABLE) ||
						(token === "]" && (lastToken === tokens.T_NUM_STRING ||
						lastToken === tokens.T_STRING))) {
						emitToken(token, null, true);
						continue;
					} else if (((token === "$" && source.charAt(match.index + 1) === "{") ||
								(token === "{" && source.charAt(match.index + 1) === "$")) &&
								!isEscaped()) {
						//Complex variable syntax ${varname} or {$varname}. Store the current
						//buffer type and evaluate next tokens as there's no active buffer.
						//The current buffer will be reset when the declaration is closed
						splitString();
						complexVarPrevBuffer = bufferType;
						bufferType = null;
						if (token === "$") {
							emitToken(token + "{", tokens.T_DOLLAR_OPEN_CURLY_BRACES);
							openBrackets = 0;
						} else {
							emitToken(token, tokens.T_CURLY_OPEN);
							openBrackets = 1;
						}
						continue;
					}
				} else if (complexVarPrevBuffer && !openBrackets && token === "{") {
					//Skip the token if it's the bracket that follows the dollar in the
					//${varname} syntax because it's included in the previous token
					openBrackets++;
					continue;
				}
				emitToken(token);
				//Increment or decrement the number of open brackets inside a complex
				//variable syntax
				if (complexVarPrevBuffer && (token === "{" || token === "}")) {
					if (token === "{") {
						openBrackets++;
					} else if (!--openBrackets) {
						//If every bracket has been closed reset the previous buffer
						bufferType = complexVarPrevBuffer;
						complexVarPrevBuffer = null;
					}
				} else if (token === "'" && bufferType === "singleQuote" && !isEscaped()) {
					//Stop the single quoted string buffer if the character is a quote,
					//there's an open single quoted string buffer and the character is
					//not escaped
					emitBuffer();
				}
			}
		} else if (match[11]) {
			//Word
			token = match[11];
			//If there's an open nowdoc or heredoc buffer, the string is the same that the one
			//that has started the buffer, it's preceded by a line feed and followed by the
			//right characters then emit the buffer and the word
			if ((bufferType === "nowdoc" || bufferType === "heredoc") && token === heredocWord &&
				source.charAt(match.index - 1) === "\n" &&
				heredocEndFollowing.test(source.substr(match.index + token.length))) {
				emitBuffer();
				emitToken(token, tokens.T_END_HEREDOC);
				continue;
			} else if ((bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				if (lastToken === "[") {
					//Literal array index inside a heredoc or a double quoted string
					emitToken(token, tokens.T_STRING, true);
					continue;
				} else if (lastToken === tokens.T_OBJECT_OPERATOR) {
					//Syntax $obj->prop inside strings and heredoc
					emitToken(token, tokens.T_STRING, true);
					continue;
				}
			} else  if (complexVarPrevBuffer && lastToken === tokens.T_DOLLAR_OPEN_CURLY_BRACES) {
				//Complex variable syntax  ${varname}
				emitToken(token, tokens.T_STRING_VARNAME);
				continue;
			}
			emitToken(token, tokens.T_STRING);
		} else {
			//Other characters
			//If below ASCII 32 it's a bad character
			if (token.charCodeAt(0) < 32) {
				emitToken(match[12], tokens.T_BAD_CHARACTER);
			} else {
				//If there isn't an open buffer there should be an syntax error, but we don't care
				//so it will be emitted as a simple string
				emitToken(match[12], tokens.T_STRING);
			}
		}
	}	
	//If there's an open buffer emit it
	if (bufferType && (bufferType !== "doubleQuotes" || !split)) {
		emitBuffer();
	} else {
		splitString();
	}
	return ret;
}




// 2token_get_all.js
function token_get_all (source) {
	// Split given source into PHP tokens
	// + original by: Marco Marchi�
	// + improved by: Brett Zamir (http://brett-zamir.me)
	// - depends on: token_name
	// % note 1: Token numbers depend on the PHP version
	// % note 2: token_name is only necessary for a non-standard php.js-specific use of this function;
	// % note 2: if you define an object on this.php_js.phpParser (where "this" is the scope of the
	// % note 2: token_get_all function (either a namespaced php.js object or the window object)),
	// % note 2: this function will call that object's methods if they have the same names as the tokens,
	// % note 2: passing them the string, line number, and token number (in that order)
	// * example 1: token_get_all('/'+'* comment *'+'/');
	// * returns 1: [[311, '/* comment */', 1]]
	
	// Token to number conversion
    var tokens = {
        T_REQUIRE_ONCE:261,
        T_REQUIRE:260,
        T_EVAL:259,
        T_INCLUDE_ONCE:258,
        T_INCLUDE:257,
        T_LOGICAL_OR:262,
        T_LOGICAL_XOR:263,
        T_LOGICAL_AND:264,
        T_PRINT:265,
        T_SR_EQUAL:276,
        T_SL_EQUAL:275,
        T_XOR_EQUAL:274,
        T_OR_EQUAL:273,
        T_AND_EQUAL:272,
        T_MOD_EQUAL:271,
        T_CONCAT_EQUAL:270,
        T_DIV_EQUAL:269,
        T_MUL_EQUAL:268,
        T_MINUS_EQUAL:267,
        T_PLUS_EQUAL:266,
        T_BOOLEAN_OR:277,
        T_BOOLEAN_AND:278,
        T_IS_NOT_IDENTICAL:282,
        T_IS_IDENTICAL:281,
        T_IS_NOT_EQUAL:280,
        T_IS_EQUAL:279,
        T_IS_GREATER_OR_EQUAL:284,
        T_IS_SMALLER_OR_EQUAL:283,
        T_SR:286,
        T_SL:285,
        T_INSTANCEOF:287,
        T_UNSET_CAST:296,
        T_BOOL_CAST:295,
        T_OBJECT_CAST:294,
        T_ARRAY_CAST:293,
        T_STRING_CAST:292,
        T_DOUBLE_CAST:291,
        T_INT_CAST:290,
        T_DEC:289,
        T_INC:288,
        T_CLONE:298,
        T_NEW:297,
        T_EXIT:299,
        T_IF:300,
        T_ELSEIF:301,
        T_ELSE:302,
        T_ENDIF:303,
        T_LNUMBER:304,
        T_DNUMBER:305,
        T_STRING:306,
        T_STRING_VARNAME:307,
        T_VARIABLE:308,
        T_NUM_STRING:309,
        T_INLINE_HTML:310,
        T_CHARACTER:311,
        T_BAD_CHARACTER:312,
        T_ENCAPSED_AND_WHITESPACE:313,
        T_CONSTANT_ENCAPSED_STRING:314,
        T_ECHO:315,
        T_DO:316,
        T_WHILE:317,
        T_ENDWHILE:318,
        T_FOR:319,
        T_ENDFOR:320,
        T_FOREACH:321,
        T_ENDFOREACH:322,
        T_DECLARE:323,
        T_ENDDECLARE:324,
        T_AS:325,
        T_SWITCH:326,
        T_ENDSWITCH:327,
        T_CASE:328,
        T_DEFAULT:329,
        T_BREAK:330,
        T_CONTINUE:331,
        T_GOTO:332,
        T_FUNCTION:333,
        T_CONST:334,
        T_RETURN:335,
        T_TRY:336,
        T_CATCH:337,
        T_THROW:338,
        T_USE:339,
        T_GLOBAL:340,
        T_PUBLIC:346,
        T_PROTECTED:345,
        T_PRIVATE:344,
        T_FINAL:343,
        T_ABSTRACT:342,
        T_STATIC:341,
        T_VAR:347,
        T_UNSET:348,
        T_ISSET:349,
        T_EMPTY:350,
        T_HALT_COMPILER:351,
        T_CLASS:352,
        T_INTERFACE:353,
        T_EXTENDS:354,
        T_IMPLEMENTS:355,
        T_OBJECT_OPERATOR:356,
        T_DOUBLE_ARROW:357,
        T_LIST:358,
        T_ARRAY:359,
        T_CLASS_C:360,
        T_METHOD_C:361,
        T_FUNC_C:362,
        T_LINE:363,
        T_FILE:364,
        T_COMMENT:365,
        T_DOC_COMMENT:366,
        T_OPEN_TAG:367,
        T_OPEN_TAG_WITH_ECHO:368,
        T_CLOSE_TAG:369,
        T_WHITESPACE:370,
        T_START_HEREDOC:371,
        T_END_HEREDOC:372,
        T_DOLLAR_OPEN_CURLY_BRACES:373,
        T_CURLY_OPEN:374,
        T_PAAMAYIM_NEKUDOTAYIM:375,
        T_NAMESPACE:376,
        T_NS_C:377,
        T_DIR:378,
        T_NS_SEPARATOR:379
    },
	//Keywords tokens
	keywordsToken = {
		"abstract": tokens.T_ABSTRACT,
		"array": tokens.T_ARRAY,
		"as": tokens.T_AS,
		"break": tokens.T_BREAK,
		"case": tokens.T_CASE,
		"catch": tokens.T_CATCH,
		"class": tokens.T_CLASS,
		"__CLASS__": tokens.T_CLASS_C,
		"clone": tokens.T_CLONE,
		"const": tokens.T_CONST,
		"continue": tokens.T_CONTINUE,
		"declare": tokens.T_DECLARE,
		"default": tokens.T_DEFAULT,
		"__DIR__": tokens.T_DIR,
		"die": tokens.T_EXIT,
		"do": tokens.T_DO,
		"echo": tokens.T_ECHO,
		"else": tokens.T_ELSE,
		"elseif": tokens.T_ELSEIF,
		"empty": tokens.T_EMPTY,
		"enddeclare": tokens.T_ENDDECLARE,
		"endfor": tokens.T_ENDFOR,
		"endforeach": tokens.T_ENDFOREACH,
		"endif": tokens.T_ENDIF,
		"endswitch": tokens.T_ENDSWITCH,
		"endwhile": tokens.T_ENDWHILE,
		"eval": tokens.T_EVAL,
		"exit": tokens.T_EXIT,
		"extends": tokens.T_EXTENDS,
		"__FILE__": tokens.T_FILE,
		"final": tokens.T_FINAL,
		"for": tokens.T_FOR,
		"foreach": tokens.T_FOREACH,
		"function": tokens.T_FUNCTION,
		"__FUNCTION__": tokens.T_FUNC_C,
		"global": tokens.T_GLOBAL,
		"goto": tokens.T_GOTO,
		"__halt_compiler": tokens.T_HALT_COMPILER,
		"if": tokens.T_IF,
		"implements": tokens.T_IMPLEMENTS,
		"include": tokens.T_INCLUDE,
		"include_once": tokens.T_INCLUDE_ONCE,
		"instanceof": tokens.T_INSTANCEOF,
		"interface": tokens.T_INTERFACE,
		"isset": tokens.T_ISSET,
		"__LINE__": tokens.T_LINE,
		"list": tokens.T_LIST,
		"and": tokens.T_LOGICAL_AND,
		"or": tokens.T_LOGICAL_OR,
		"xor": tokens.T_LOGICAL_XOR,
		"__METHOD__": tokens.T_METHOD_C,
		"namespace": tokens.T_NAMESPACE,
		"__NAMESPACE__": tokens.T_NS_C,
		"new": tokens.T_NEW,
		"print": tokens.T_PRINT,
		"private": tokens.T_PRIVATE,
		"public": tokens.T_PUBLIC,
		"protected": tokens.T_PROTECTED,
		"require": tokens.T_REQUIRE,
		"require_once": tokens.T_REQUIRE_ONCE,
		"return": tokens.T_RETURN,
		"static": tokens.T_STATIC,
		"switch": tokens.T_SWITCH,
		"throw": tokens.T_THROW,
		"try": tokens.T_TRY,
		"unset": tokens.T_UNSET,
		"use": tokens.T_USE,
		"var": tokens.T_VAR,
		"while": tokens.T_WHILE
	},
	//Type casting tokens
	typeCasting = {
		"array": tokens.T_ARRAY_CAST,
		"bool": tokens.T_BOOL_CAST,
		"boolean": tokens.T_BOOL_CAST,
		"real": tokens.T_DOUBLE_CAST,
		"double": tokens.T_DOUBLE_CAST,
		"float": tokens.T_DOUBLE_CAST,
		"int": tokens.T_INT_CAST,
		"integer": tokens.T_INT_CAST,
		"object": tokens.T_OBJECT_CAST,
		"string": tokens.T_STRING_CAST,
		"unset": tokens.T_UNSET_CAST,
		"binary": tokens.T_STRING_CAST
	},
	//Symbols tokens with 2 characters
	symbols2chars = {
		"&=": tokens.T_AND_EQUAL,
		"&&": tokens.T_BOOLEAN_AND,
		"||": tokens.T_BOOLEAN_OR,
		"?>": tokens.T_CLOSE_TAG,
		"%>": tokens.T_CLOSE_TAG,
		".=": tokens.T_CONCAT_EQUAL,
		"--": tokens.T_DEC,
		"/=": tokens.T_DIV_EQUAL,
		"=>": tokens.T_DOUBLE_ARROW,
		"::": tokens.T_PAAMAYIM_NEKUDOTAYIM,
		"++": tokens.T_INC,		
		"==": tokens.T_IS_EQUAL,
		">=": tokens.T_IS_GREATER_OR_EQUAL,
		"!=": tokens.T_IS_NOT_EQUAL,
		"<>": tokens.T_IS_NOT_EQUAL,
		"<=": tokens.T_IS_SMALLER_OR_EQUAL,
		"-=": tokens.T_MINUS_EQUAL,
		"%=": tokens.T_MOD_EQUAL,
		"*=": tokens.T_MUL_EQUAL,
		"->": tokens.T_OBJECT_OPERATOR,
		"|=": tokens.T_OR_EQUAL,
		"+=": tokens.T_PLUS_EQUAL,
		"<<": tokens.T_SL,
		">>": tokens.T_SR,
		"^=": tokens.T_XOR_EQUAL,
		"<?": tokens.T_OPEN_TAG
	},
	//Symbols tokens with 3 characters
	symbols3chars = {
		"===": tokens.T_IS_IDENTICAL,	
		"!==": tokens.T_IS_NOT_IDENTICAL,		
		"<<=": tokens.T_SL_EQUAL,
		">>=": tokens.T_SR_EQUAL,
		"<?=": tokens.T_OPEN_TAG_WITH_ECHO,
		"<%=": tokens.T_OPEN_TAG_WITH_ECHO
	},
	//Buffer tokens
	bufferTokens = {
		"html": tokens.T_INLINE_HTML,
		"inlineComment": tokens.T_COMMENT,
		"comment": tokens.T_COMMENT,
		"docComment": tokens.T_DOC_COMMENT,
		"singleQuote": tokens.T_CONSTANT_ENCAPSED_STRING,
		"doubleQuotes": tokens.T_CONSTANT_ENCAPSED_STRING,
		"nowdoc": tokens.T_ENCAPSED_AND_WHITESPACE,
		"heredoc": tokens.T_ENCAPSED_AND_WHITESPACE
	},
	//Characters that are emitted as tokens without a code
	singleTokenChars = ";(){}[],~@`=+/-*.$|^&<>%!?:\"'\\",
	//Buffer type. Start an html buffer immediatelly.
	bufferType = "html",
	//Buffer content
	buffer = "",
	//Last emitted token
	lastToken,
	//Results array
	ret = [],
	//Word that started the heredoc or nowdoc buffer
	heredocWord,
	//Line number
	line = 1,
	//Line at which the buffer begins
	lineBuffer = 1,
	//Flag that indicates if the current double quoted string has been splitted
	split,
	//This variable will store the previous buffer type of the tokenizer before parsing a
	//complex variable syntax
	complexVarPrevBuffer,
	//Number of open brackets inside a complex variable syntax
	openBrackets,
	//Function to emit tokens
	emitToken = function (token, code, preventBuffer, l) {
		if (!preventBuffer && bufferType) {
			buffer += token;
			lastToken = null;
		} else {
			lastToken = code ? code : token;
			ret.push(code ? [code, token, l || line] : token);
		}
	},
	//Function to emit and close the current buffer
	emitBuffer = function () {
		buffer && emitToken(buffer, bufferTokens[bufferType], true, lineBuffer);
		buffer = "";
		bufferType = null;
	},
	//Function to check if the token at the current index is escaped
	isEscaped = function () {
		var escaped = false,
			c = i - 1;
		for (; c >= 0; c--) {
			if (source.charAt(c) !== "\\") {
				break;
			}
			escaped = !escaped;
		}
		return escaped;
	},
	//This function is used to split a double quoted string or a heredoc buffer after a variable
	//has been found inside it
	splitString = function () {
		//Don't emit empty buffers
		if (!buffer) {
			return;
		}
		//If the buffer is a double quoted string and it has not yet been splitted, emit the double
		//quotes as a token without an associated code
		if (bufferType === "doubleQuotes" && !split) {
			split = true;
			emitToken('"', null, true);
			buffer = buffer.substr(1);
		}
		buffer && emitToken(buffer, tokens.T_ENCAPSED_AND_WHITESPACE, true, lineBuffer);
		buffer = "";
		lineBuffer = line;
	},
	//Returns the number of line feed characters in the given string
	getNewLines = function (str) {
		var i = 0;
		str.replace(/\n/g, function () {
			i++;
		});
		return i;
	},
	//Checks if the given ASCII identifies a whitespace
	isWhitespace = function (ASCII) {
		return ASCII === 9 || ASCII === 10 || ASCII === 13 || ASCII === 32;
	},
	//Get next whitespaces
	getWhitespaces = function () {
		var as,
			chr,
			ret = "";
		for (c = i + 1; c < length; c++) {
			chr = source.charAt(c);
			as = chr.charCodeAt(0);
			if (isWhitespace(as)) {
				ret += chr;
			} else {
				break;
			}
		}
		return ret;
	},
	//Get next word
	getWord = function (i) {
		var match = /^[a-zA-Z_]\w*/.exec(source.substr(i));
		return match ? match[0] : null;
	},
	//Get next heredoc declaration
	getHeredocWord = function () {
		return /^<<< *(['"]?[a-zA-Z]\w*)['"]?\r?\n/.exec(source.substr(i));
	},
	//Get next type casting declaration
	getTypeCasting = function () {
		var match = /^\( *([a-zA-Z]+) *\)/.exec(source.substr(i));
		return match && match[1] && (match[1].toLowerCase()) in typeCasting ? match : null;
	},
	//Get next php long open declaration
	getLongOpenDeclaration = function (i) {
		return /^php(?:\r?\s)?/i.exec(source.substr(i));
	},
	//Get next integer or float number
	getNumber = function () {
		var rnum = /^(?:((?:\d+(?:\.\d*)?|\d*\.\d+)[eE][\+\-]?\d+|\d*\.\d+|\d+\.\d*)|(\d+(?:x[0-9a-fA-F]+)?))/,
			match = rnum.exec(source.substr(i));
		if (!match) {
			return null;
		}
		if (match[2]) {
			var isHex = match[2].toLowerCase().indexOf("x") > -1;
			//If it's greater than 2147483648 it's considered as a floating point number
			if (parseInt(isHex ? parseInt(match[2], 16) : match[2], 10) < 2147483648) {
				return [match[2], tokens.T_LNUMBER];
			}
			return [match[2], tokens.T_DNUMBER];
		}
		return [match[1], tokens.T_DNUMBER];
	},
	//Regexp to check if the characters that follow a word are valid as heredoc end declaration
	heredocEndFollowing = /^;?\r?\n/,
	i = 0,
	num,
	length = source.length,
	nextch,
	word,
	ch,
	parts,
	sym,
	ASCII;
	
	for (; i < length; i++) {
		ch = source.charAt(i);
		ASCII = ch.charCodeAt(0);
		//Whitespaces
		if (isWhitespace(ASCII)) {
			//Get next whitespaces too
			ch += getWhitespaces();
			//PHP closing tags and inline comments include the following new line characters
			if ((bufferType === "inlineComment" || lastToken === tokens.T_CLOSE_TAG) && ch.indexOf("\n") > -1) {
				parts = ch.split("\n");
				line++;
				if (bufferType === "inlineComment") {
					//Close the inline comment buffer
					buffer += parts[0] + "\n";
					emitBuffer();
				} else {
					//Add the new line characters to the previous token
					ret[ret.length - 1][1] += parts[0] + "\n";
					lineBuffer = line;
				}
				i += parts[0].length;
				parts.shift();
				ch = parts.join("\n");
				if (ch === "") {
					continue;
				} else {
					i++;
				}
			}
			emitToken(ch, tokens.T_WHITESPACE);
			line += getNewLines(ch);
			i += ch.length - 1;
		} else if (ch === "#" || ch === "/" && ((nextch = source.charAt(i + 1)) === "*" || nextch === "/")) {
			//Comment signs
			//Change the buffer only if there's no active buffer
			if (!bufferType) {
				if (ch === "#") {
					bufferType = "inlineComment";
				} else if(ch + nextch === "//") {
					bufferType = "inlineComment";
					ch += nextch;
					i++;
				} else if ((ch + nextch + source.charAt(i + 2)) === "/**") {
					ch += "**";
					i += 2;
					//It's a doc comment only if it's followed by a whitespace
					if (isWhitespace(source.charCodeAt(i + 1))) {
						bufferType = "docComment";
					} else {
						bufferType = "comment";
					}
				} else {
					ch += "*";
					bufferType = "comment";
					i++
				}
				lineBuffer = line;
			}
			emitToken(ch);
		} else if (ch === "*" && source.charAt(i + 1) === "/") {
			//Multiline comments closing sings
			ch += "/";
			emitToken(ch);
			if (bufferType === "comment" || bufferType === "docComment") {
				emitBuffer();
			}
			i++;
		} else if (ch === "$" && (word = getWord(i + 1))) {
			//Variable
			if ((bufferType === "heredoc" || bufferType === "doubleQuotes") && !isEscaped()) {
				splitString();
				emitToken(ch + word, tokens.T_VARIABLE, true);
			} else {
				emitToken(ch + word, tokens.T_VARIABLE);
			}
			i += word.length;
		} else if (ch === "<" && source.substr(i + 1, 2) === "<<" && (word = getHeredocWord())) {
			//Heredoc and nowdoc start declaration
			emitToken(word[0], tokens.T_START_HEREDOC);
			line++;
			if (!bufferType) {
				heredocWord = word[1]
				//If the first character is a quote then it's a nowdoc otherwise it's an heredoc
				if (heredocWord.charAt(0) === "'") {
					//Strip the leading quote
					heredocWord = heredocWord.substr(1);
					bufferType = "nowdoc";
				} else {
					if (heredocWord.charAt(0) === '"') {
						heredocWord = heredocWord.substr(1);
					}
					bufferType = "heredoc";
				}
				lineBuffer = line;
			}
			i += word[0].length - 1;
		} else if (ch === "(" && (word = getTypeCasting())) {
			//Type-casting
			emitToken(word[0], typeCasting[word[1].toLowerCase()]);
			i += word[0].length - 1;
		} else if ((ch === "." || (ch >= "0" && ch <= "9")) && (num = getNumber())) {
			//Numbers
			//Numeric array index inside a heredoc or a double quoted string
			if (lastToken === "[" && (bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				emitToken(num[0], tokens.T_NUM_STRING, true);
			} else {
				emitToken(num[0], num[1]);
			}
			i += String(num[0]).length - 1;
		} else if (singleTokenChars.indexOf(ch) > -1) {
			//Symbols
			sym = source.substr(i, 3);
			if (sym in symbols3chars) {
				i += 2;
				//If it's a php open tag emit the html buffer
				if (bufferType === "html" && symbols3chars[sym] === tokens.T_OPEN_TAG_WITH_ECHO) {
					emitBuffer();
				}
				emitToken(sym, symbols3chars[sym]);
				continue;
			}
			sym = ch + source.charAt(i + 1);
			if (sym in symbols2chars) {
				//If it's a php open tag check if it's written in the long form and emit the html buffer
				if (symbols2chars[sym] === tokens.T_OPEN_TAG && bufferType === "html") {
					emitBuffer();
					i++;
					if (word = getLongOpenDeclaration(i + 1)) {
						i += word[0].length;
						sym += word[0];
					}
					emitToken(sym, tokens.T_OPEN_TAG);
					if (sym.indexOf("\n") > -1) {
						line++;
					}
					continue;
				}
				i++;
				//Syntax $obj->prop inside strings and heredoc
				if (sym === "->" && lastToken === tokens.T_VARIABLE && (bufferType === "heredoc" ||
					bufferType === "doubleQuotes")) {
					emitToken(sym, symbols2chars[sym], true);
					continue;
				}
				emitToken(sym, symbols2chars[sym]);
				//If the token is a PHP close tag and there isn't an active buffer start an html buffer
				if (!bufferType && symbols2chars[sym] === tokens.T_CLOSE_TAG) {
					bufferType = "html";
					lineBuffer = line;
				}
				continue;
			}
			//Start string buffers if there isn't an active buffer and the character is a quote
			if (!bufferType && (ch === "'" || ch === '"')) {
				if (ch === "'") {
					bufferType = "singleQuote";
				} else {
					split = false;
					bufferType = "doubleQuotes";
				}
				lineBuffer = line;
				//Add the token to the buffer and continue to skip next checks
				emitToken(ch);
				continue;
			} else if (ch === '"' && bufferType === "doubleQuotes" && !isEscaped()) {
				//If the string has been splitted emit the current buffer and the double quotes
				//as separate tokens
				if (split) {
					splitString();
					bufferType = null;
					emitToken('"');
				} else {
					emitToken('"');
					emitBuffer();
				}
				continue;
			} else if (bufferType === "heredoc" || bufferType === "doubleQuotes") {
				//Array index delimiters inside heredoc or double quotes
				if ((ch === "[" && lastToken === tokens.T_VARIABLE) ||
					(ch === "]" && (lastToken === tokens.T_NUM_STRING ||
					lastToken === tokens.T_STRING))) {
					emitToken(ch, null, true);
					continue;
				} else if (((ch === "$" && source.charAt(i + 1) === "{") ||
							(ch === "{" && source.charAt(i + 1) === "$")) &&
							!isEscaped()) {
					//Complex variable syntax ${varname} or {$varname}. Store the current
					//buffer type and evaluate next tokens as there's no active buffer.
					//The current buffer will be reset when the declaration is closed
					splitString();
					complexVarPrevBuffer = bufferType;
					bufferType = null;
					if (ch === "$") {
						emitToken(ch + "{", tokens.T_DOLLAR_OPEN_CURLY_BRACES);
						i++;
					} else {
						emitToken(ch, tokens.T_CURLY_OPEN);
					}
					openBrackets = 1;
					continue;
				}
			} else if (ch === "\\") {
				//Namespace separator
				emitToken(ch, tokens.T_NS_SEPARATOR);
				continue;
			}
			emitToken(ch);
			//Increment or decrement the number of open brackets inside a complex
			//variable syntax
			if (complexVarPrevBuffer && (ch === "{" || ch === "}")) {
				if (ch === "{") {
					openBrackets++;
				} else if (!--openBrackets) {
					//If every bracket has been closed reset the previous buffer
					bufferType = complexVarPrevBuffer;
					complexVarPrevBuffer = null;
				}
			} else if (ch === "'" && bufferType === "singleQuote" && !isEscaped()) {
				//Stop the single quoted string buffer if the character is a quote,
				//there's an open single quoted string buffer and the character is
				//not escaped
				emitBuffer();
			}
		} else if (word = getWord(i)) {
			//Words
			var wordLower = word.toLowerCase();
			//Check to see if it's a keyword
			if (keywordsToken.hasOwnProperty(word) || keywordsToken.hasOwnProperty(wordLower)) {
				//If it's preceded by -> than it's an object property and it must be tokenized as T_STRING
				emitToken(
					word,
					lastToken === tokens.T_OBJECT_OPERATOR ?
					tokens.T_STRING :
					keywordsToken[word] || keywordsToken[wordLower]
				);
				i += word.length - 1;
				continue;
			}
			//Stop the heredoc or the nowdoc if it's the word that has generated it
			if ((bufferType === "nowdoc" || bufferType === "heredoc") && word === heredocWord &&
				source.charAt(i - 1) === "\n" &&
				heredocEndFollowing.test(source.substr(i + word.length))) {
				emitBuffer();
				emitToken(word, tokens.T_END_HEREDOC);
				i += word.length - 1;
				continue;
			} else if ((bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				if (lastToken === "[") {
					//Literal array index inside a heredoc or a double quoted string
					emitToken(word, tokens.T_STRING, true);
					i += word.length - 1;
					continue;
				} else if (lastToken === tokens.T_OBJECT_OPERATOR) {
					//Syntax $obj->prop inside strings and heredoc
					emitToken(word, tokens.T_STRING, true);
					i += word.length - 1;
					continue;
				}
			} else if (complexVarPrevBuffer && lastToken === tokens.T_DOLLAR_OPEN_CURLY_BRACES) {
				//Complex variable syntax  ${varname}
				emitToken(word, tokens.T_STRING_VARNAME);
				i += word.length - 1;
				continue;
			}
			emitToken(word, tokens.T_STRING);
			i += word.length - 1;
		} else if (ASCII < 32) {
			//If below ASCII 32 it's a bad character
			emitToken(ch, tokens.T_BAD_CHARACTER);
		} else {
			//If there isn't an open buffer there should be an syntax error, but we don't care
			//so it will be emitted as a simple string
			emitToken(ch, tokens.T_STRING);
		}
	}
	//If there's an open buffer emit it
	if (bufferType && (bufferType !== "doubleQuotes" || !split)) {
		emitBuffer();
	} else {
		splitString();
	}
	return ret;
}




// config.php
<?php
//$file = 'test.php';
//$file = 'test2.php';
//$file = 'test3.php';
$file = 'simple.php';
$file = 'simple2.php';
$file = 'heredoc.php';

?>



// file_get_contents.min.js
/*
 * More info at: http://phpjs.org
 *
 * This is version: 3.06
 * php.js is copyright 2010 Kevin van Zonneveld.
 *
 * Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
 * (http://kevin.vanzonneveld.net), Onno Marsman, Michael White
 * (http://getsprink.com), Theriault, Waldo Malqui Silva, Paulo Ricardo F.
 * Santos, Jack, Jonas Raoni Soares Silva (http://www.jsfromhell.com), Philip
 * Peterson, Legaev Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous,
 * Martijn Wieringa, Nate, Philippe Baumann, lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/), Enrique Gonzalez,
 * Webtoolkit.info (http://www.webtoolkit.info/), Jani Hartikainen, Ole
 * Vrijenhoek, Carlos R. L. Rodrigues (http://www.jsfromhell.com), Ash Searle
 * (http://hexmen.com/blog/), travc, stag019, pilus, T.Wild,
 * http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
 * Johnny Mast (http://www.phpvrouwen.nl), Erkekjetter, WebDevHobo
 * (http://webdevhobo.blogspot.com/), GeekFG (http://geekfg.blogspot.com),
 * Andrea Giammarchi (http://webreflection.blogspot.com), d3x, marrtins,
 * Michael Grier, Mirek Slugen, majak, mdsjack (http://www.mdsjack.bo.it),
 * gettimeofday, Mailfaker (http://www.weedem.fr/), David, Michael White,
 * Public Domain (http://www.json.org/json2.js), Tim de Koning
 * (http://www.kingsquare.nl), Oleg Eremeev, Marc Palau, Steven Levithan
 * (http://blog.stevenlevithan.com), Josh Fraser
 * (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
 * KELAN, Arpad Ray (mailto:arpad@php.net), Joris, Breaking Par Consulting Inc
 * (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
 * Martin (http://www.erlenwiese.de/), AJ, Lars Fischer, Felix Geisendoerfer
 * (http://www.debuggable.com/felix), Pellentesque Malesuada, Caio Ariede
 * (http://caioariede.com), Kankrelune (http://www.webfaktory.info/), Alfonso
 * Jimenez (http://www.alfonsojimenez.com), Sakimori, Steve Hilder, gorthaur,
 * Aman Gupta, Karol Kowalski, Thunder.m, Tyler Akins (http://rumkin.com),
 * john (http://www.jd-tech.net), Douglas Crockford
 * (http://javascript.crockford.com), mktime, Gilbert, Marco, paulo kuong,
 * Frank Forte, duncan, madipta, ger, Subhasis Deb, felix, Denny Wardhana,
 * Mateusz "loonquawl" Zalega, ReverseSyntax, Francois, Scott Cariss, Slawomir
 * Kaniecki, Arno, Nathan, Nick Kolosov (http://sammy.ru), 0m3r, noname, marc
 * andreu, Fox, sankai, Sanjoy Roy, nobbler, Steve Clay, class_exists, Thiago
 * Mata (http://thiagomata.blog.com), Jon Hohle, nord_ua, Ozh, echo is bad,
 * Linuxworld, XoraX (http://www.xorax.info), Pyerre, Soren Hansen, Brad
 * Touesnard, MeEtc (http://yass.meetcweb.com), Tim Wiel, Bryan Elliott,
 * T0bsn, Peter-Paul Koch (http://www.quirksmode.org/js/beat.html), David
 * Randall, Der Simon (http://innerdom.sourceforge.net/), lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/this.), Hyam Singer
 * (http://www.impact-computing.com/), Paul, kenneth, Raphael (Ao RUDLER),
 * David James, T. Wild, Ole Vrijenhoek (http://www.nervous.nl/), J A R,
 * Bayron Guevara, LH, JB, Eugene Bulkin (http://doubleaw.com/), Stoyan Kyosev
 * (http://www.svest.org/), djmix, Marc Jansen, Francesco, Lincoln Ramsay,
 * Manish, date, Kristof Coomans (SCK-CEN Belgian Nucleair Research Centre),
 * Pierre-Luc Paour, Martin Pool, Rick Waldron, Kirk Strobeck, Saulo Vallory,
 * Christoph, Artur Tchernychev, Wagner B. Soares, Valentina De Rosa, Daniel
 * Esteban, Jason Wong (http://carrot.org/), Mick@el, rezna, Simon Willison
 * (http://simonwillison.net), Gabriel Paderni, Marco van Oort,
 * penutbutterjelly, Philipp Lenssen, Anton Ongson, Blues
 * (http://tech.bluesmoon.info/), Tomasz Wesolowski, Eric Nagel, Bobby Drake,
 * Luke Godfrey, Pul, uestla, Alan C, Yves Sucaet, sowberry, hitwork, Orlando,
 * Norman "zEh" Fuchs, Ulrich, johnrembo, Nick Callen, ejsanders, Aidan Lister
 * (http://aidanlister.com/), Brian Tafoya (http://www.premasolutions.com/),
 * Philippe Jausions (http://pear.php.net/user/jausions), kilops, dptr1988,
 * HKM, metjay, strcasecmp, strcmp, Taras Bogach, jpfle, ChaosNo1, Alexander
 * Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev), Le Torbi,
 * James, Chris, DxGx, Pedro Tainha (http://www.pedrotainha.com), Christian
 * Doebler, setcookie, Greg Frazier, Tod Gentille, Alexander M Beedie,
 * FremyCompany, T.J. Leahy, baris ozdil, FGFEmperor, daniel airton wermann
 * (http://wermann.com.br), 3D-GRAF, jakes, gabriel paderni, Yannoo, Luis
 * Salazar (http://www.freaky-media.com/), Tim de Koning, stensi, Billy, vlado
 * houba, Itsacon (http://www.itsacon.net/), Jalal Berrami, Matteo, Victor,
 * taith, Robin, Matt Bradley, fearphage
 * (http://http/my.opera.com/fearphage/), Cord, Atli Þór, Maximusya, Andrej
 * Pavlovic, Dino, rem, Greenseed, meo, Garagoth, Russell Walker
 * (http://www.nbill.co.uk/), YUI Library:
 * http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Blues at
 * http://hacks.bluesmoon.info/strftime/strftime.js, Andreas, Jamie Beck
 * (http://www.terabit.ca/), DtTvB
 * (http://dt.in.th/2008-09-16.string-length-in-bytes.html), mk.keck, Leslie
 * Hoare, Diogo Resende, Howard Yeend, Allan Jensen (http://www.winternet.no),
 * davook, Benjamin Lupton, Rival, Luke Smith (http://lucassmith.name),
 * booeyOH, Ben Bryan, Cagri Ekin, Amir Habibi
 * (http://www.residence-mixte.com/), Kheang Hok Chin
 * (http://www.distantia.ca/), Jay Klehr
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */


// Compression: minified


function file_get_contents(url,flags,context,offset,maxLen){var tmp,headers=[],newTmp=[],k=0,i=0,href='',pathPos=-1,flagNames=0,content=null,http_stream=false;var func=function(value){return value.substring(1)!=='';};this.php_js=this.php_js||{};this.php_js.ini=this.php_js.ini||{};var ini=this.php_js.ini;context=context||this.php_js.default_streams_context||null;if(!flags){flags=0;}
var OPTS={FILE_USE_INCLUDE_PATH:1,FILE_TEXT:32,FILE_BINARY:64};if(typeof flags==='number'){flagNames=flags;}
else{flags=[].concat(flags);for(i=0;i<flags.length;i++){if(OPTS[flags[i]]){flagNames=flagNames|OPTS[flags[i]];}}}
if(flagNames&OPTS.FILE_BINARY&&(flagNames&OPTS.FILE_TEXT)){throw'You cannot pass both FILE_BINARY and FILE_TEXT to file_get_contents()';}
if((flagNames&OPTS.FILE_USE_INCLUDE_PATH)&&ini.include_path&&ini.include_path.local_value){var slash=ini.include_path.local_value.indexOf('/')!==-1?'/':'\\';url=ini.include_path.local_value+slash+url;}
else if(!/^(https?|file):/.test(url)){href=this.window.location.href;pathPos=url.indexOf('/')===0?href.indexOf('/',8)-1:href.lastIndexOf('/');url=href.slice(0,pathPos+1)+url;}
if(context){var http_options=context.stream_options&&context.stream_options.http;http_stream=!!http_options;}
if(!context||http_stream){var req=this.window.ActiveXObject?new ActiveXObject('Microsoft.XMLHTTP'):new XMLHttpRequest();if(!req){throw new Error('XMLHttpRequest not supported');}
var method=http_stream?http_options.method:'GET';var async=!!(context&&context.stream_params&&context.stream_params['phpjs.async']);if(ini['phpjs.ajaxBypassCache']&&ini['phpjs.ajaxBypassCache'].local_value){url+=(url.match(/\?/)==null?"?":"&")+(new Date()).getTime();}
req.open(method,url,async);if(async){var notification=context.stream_params.notification;if(typeof notification==='function'){if(0&&req.addEventListener){}
else{req.onreadystatechange=function(aEvt){var objContext={responseText:req.responseText,responseXML:req.responseXML,status:req.status,statusText:req.statusText,readyState:req.readyState,evt:aEvt};var bytes_transferred;switch(req.readyState){case 0:notification.call(objContext,0,0,'',0,0,0);break;case 1:notification.call(objContext,0,0,'',0,0,0);break;case 2:notification.call(objContext,0,0,'',0,0,0);break;case 3:bytes_transferred=req.responseText.length*2;notification.call(objContext,7,0,'',0,bytes_transferred,0);break;case 4:if(req.status>=200&&req.status<400){bytes_transferred=req.responseText.length*2;notification.call(objContext,8,0,'',req.status,bytes_transferred,0);}
else if(req.status===403){notification.call(objContext,10,2,'',req.status,0,0);}
else{notification.call(objContext,9,2,'',req.status,0,0);}
break;default:throw'Unrecognized ready state for file_get_contents()';}}}}}
if(http_stream){var sendHeaders=http_options.header&&http_options.header.split(/\r?\n/);var userAgentSent=false;for(i=0;i<sendHeaders.length;i++){var sendHeader=sendHeaders[i];var breakPos=sendHeader.search(/:\s*/);var sendHeaderName=sendHeader.substring(0,breakPos);req.setRequestHeader(sendHeaderName,sendHeader.substring(breakPos+1));if(sendHeaderName==='User-Agent'){userAgentSent=true;}}
if(!userAgentSent){var user_agent=http_options.user_agent||(ini.user_agent&&ini.user_agent.local_value);if(user_agent){req.setRequestHeader('User-Agent',user_agent);}}
content=http_options.content||null;}
if(flagNames&OPTS.FILE_TEXT){var content_type='text/html';if(http_options&&http_options['phpjs.override']){content_type=http_options['phpjs.override'];}
else{var encoding=(ini['unicode.stream_encoding']&&ini['unicode.stream_encoding'].local_value)||'UTF-8';if(http_options&&http_options.header&&(/^content-type:/im).test(http_options.header)){content_type=http_options.header.match(/^content-type:\s*(.*)$/im)[1];}
if(!(/;\s*charset=/).test(content_type)){content_type+='; charset='+encoding;}}
req.overrideMimeType(content_type);}
else if(flagNames&OPTS.FILE_BINARY){req.overrideMimeType('text/plain; charset=x-user-defined');}
if(http_options&&http_options['phpjs.sendAsBinary']){req.sendAsBinary(content);}
else{req.send(content);}
tmp=req.getAllResponseHeaders();if(tmp){tmp=tmp.split('\n');for(k=0;k<tmp.length;k++){if(func(tmp[k])){newTmp.push(tmp[k]);}}
tmp=newTmp;for(i=0;i<tmp.length;i++){headers[i]=tmp[i];}
this.$http_response_header=headers;}
if(offset||maxLen){if(maxLen){return req.responseText.substr(offset||0,maxLen);}
return req.responseText.substr(offset);}
return req.responseText;}
return false;}




// heredoc.php
<?php
if (1)
$insert = 5;
elseif (2) {}
$a = <<<STH

Test$insert
STH;
?>



// index-old.php
<?php
/*
echo '<pre>';
echo '        ', token_name(258), ':', 258,  ',<br/>';
echo '        ', token_name(259), ':', 259,  ',<br/>';
echo '        ', token_name(260), ':', 260,  ',<br/>';
echo '        ', token_name(261), ':', 261,  ',<br/>';
echo '        ', token_name(262), ':', 262,  ',<br/>';
echo '        ', token_name(263), ':', 263,  ',<br/>';
echo '        ', token_name(264), ':', 264,  ',<br/>';
echo '        ', token_name(265), ':', 265,  ',<br/>';
echo '        ', token_name(266), ':', 266,  ',<br/>';
echo '        ', token_name(267), ':', 267,  ',<br/>';
echo '        ', token_name(268), ':', 268,  ',<br/>';
echo '        ', token_name(269), ':', 269,  ',<br/>';
echo '        ', token_name(270), ':', 270,  ',<br/>';
echo '        ', token_name(271), ':', 271,  ',<br/>';
echo '        ', token_name(272), ':', 272,  ',<br/>';
echo '        ', token_name(273), ':', 273,  ',<br/>';
echo '        ', token_name(274), ':', 274,  ',<br/>';
echo '        ', token_name(275), ':', 275,  ',<br/>';
echo '        ', token_name(276), ':', 276,  ',<br/>';
echo '        ', token_name(277), ':', 277,  ',<br/>';
echo '        ', token_name(278), ':', 278,  ',<br/>';
echo '        ', token_name(279), ':', 279,  ',<br/>';
echo '        ', token_name(280), ':', 280,  ',<br/>';
echo '        ', token_name(281), ':', 281,  ',<br/>';
echo '        ', token_name(282), ':', 282,  ',<br/>';
echo '        ', token_name(283), ':', 283,  ',<br/>';
echo '        ', token_name(284), ':', 284,  ',<br/>';
echo '        ', token_name(285), ':', 285,  ',<br/>';
echo '        ', token_name(286), ':', 286,  ',<br/>';
echo '        ', token_name(287), ':', 287,  ',<br/>';
echo '        ', token_name(288), ':', 288,  ',<br/>';
echo '        ', token_name(289), ':', 289,  ',<br/>';
echo '        ', token_name(290), ':', 290,  ',<br/>';
echo '        ', token_name(291), ':', 291,  ',<br/>';
echo '        ', token_name(292), ':', 292,  ',<br/>';
echo '        ', token_name(293), ':', 293,  ',<br/>';
echo '        ', token_name(294), ':', 294,  ',<br/>';
echo '        ', token_name(295), ':', 295,  ',<br/>';
echo '        ', token_name(296), ':', 296,  ',<br/>';
echo '        ', token_name(297), ':', 297,  ',<br/>';
echo '        ', token_name(298), ':', 298,  ',<br/>';
echo '        ', token_name(299), ':', 299,  ',<br/>';
echo '        ', token_name(300), ':', 300,  ',<br/>';
echo '        ', token_name(301), ':', 301,  ',<br/>';
echo '        ', token_name(302), ':', 302,  ',<br/>';
echo '        ', token_name(303), ':', 303,  ',<br/>';
echo '        ', token_name(304), ':', 304,  ',<br/>';
echo '        ', token_name(305), ':', 305,  ',<br/>';
echo '        ', token_name(306), ':', 306,  ',<br/>';
echo '        ', token_name(307), ':', 307,  ',<br/>';
echo '        ', token_name(308), ':', 308,  ',<br/>';
echo '        ', token_name(309), ':', 309,  ',<br/>';
echo '        ', token_name(310), ':', 310,  ',<br/>';
echo '        ', token_name(311), ':', 311,  ',<br/>';
echo '        ', token_name(312), ':', 312,  ',<br/>';
echo '        ', token_name(313), ':', 313,  ',<br/>';
echo '        ', token_name(314), ':', 314,  ',<br/>';
echo '        ', token_name(315), ':', 315,  ',<br/>';
echo '        ', token_name(316), ':', 316,  ',<br/>';
echo '        ', token_name(317), ':', 317,  ',<br/>';
echo '        ', token_name(318), ':', 318,  ',<br/>';
echo '        ', token_name(319), ':', 319,  ',<br/>';
echo '        ', token_name(320), ':', 320,  ',<br/>';
echo '        ', token_name(321), ':', 321,  ',<br/>';
echo '        ', token_name(322), ':', 322,  ',<br/>';
echo '        ', token_name(323), ':', 323,  ',<br/>';
echo '        ', token_name(324), ':', 324,  ',<br/>';
echo '        ', token_name(325), ':', 325,  ',<br/>';
echo '        ', token_name(326), ':', 326,  ',<br/>';
echo '        ', token_name(327), ':', 327,  ',<br/>';
echo '        ', token_name(328), ':', 328,  ',<br/>';
echo '        ', token_name(329), ':', 329,  ',<br/>';
echo '        ', token_name(330), ':', 330,  ',<br/>';
echo '        ', token_name(331), ':', 331,  ',<br/>';
echo '        ', token_name(332), ':', 332,  ',<br/>';
echo '        ', token_name(333), ':', 333,  ',<br/>';
echo '        ', token_name(334), ':', 334,  ',<br/>';
echo '        ', token_name(335), ':', 335,  ',<br/>';
echo '        ', token_name(336), ':', 336,  ',<br/>';
echo '        ', token_name(337), ':', 337,  ',<br/>';
echo '        ', token_name(338), ':', 338,  ',<br/>';
echo '        ', token_name(339), ':', 339,  ',<br/>';
echo '        ', token_name(340), ':', 340,  ',<br/>';
echo '        ', token_name(341), ':', 341,  ',<br/>';
echo '        ', token_name(342), ':', 342,  ',<br/>';
echo '        ', token_name(343), ':', 343,  ',<br/>';
echo '        ', token_name(344), ':', 344,  ',<br/>';
echo '        ', token_name(345), ':', 345,  ',<br/>';
echo '        ', token_name(346), ':', 346,  ',<br/>';
echo '        ', token_name(347), ':', 347,  ',<br/>';
echo '        ', token_name(348), ':', 348,  ',<br/>';
echo '        ', token_name(349), ':', 349,  ',<br/>';
echo '        ', token_name(350), ':', 350,  ',<br/>';
echo '        ', token_name(351), ':', 351,  ',<br/>';
echo '        ', token_name(352), ':', 352,  ',<br/>';
echo '        ', token_name(353), ':', 353,  ',<br/>';
echo '        ', token_name(354), ':', 354,  ',<br/>';
echo '        ', token_name(355), ':', 355,  ',<br/>';
echo '        ', token_name(356), ':', 356,  ',<br/>';
echo '        ', token_name(357), ':', 357,  ',<br/>';
echo '        ', token_name(358), ':', 358,  ',<br/>';
echo '        ', token_name(359), ':', 359,  ',<br/>';
echo '        ', token_name(360), ':', 360,  ',<br/>';
echo '        ', token_name(361), ':', 361,  ',<br/>';
echo '        ', token_name(362), ':', 362,  ',<br/>';
echo '        ', token_name(363), ':', 363,  ',<br/>';
echo '        ', token_name(364), ':', 364,  ',<br/>';
echo '        ', token_name(365), ':', 365,  ',<br/>';
echo '        ', token_name(366), ':', 366,  ',<br/>';
echo '        ', token_name(367), ':', 367,  ',<br/>';
echo '        ', token_name(368), ':', 368,  ',<br/>';
echo '        ', token_name(369), ':', 369,  ',<br/>';
echo '        ', token_name(370), ':', 370,  ',<br/>';
echo '        ', token_name(371), ':', 371,  ',<br/>';
echo '        ', token_name(372), ':', 372,  ',<br/>';
echo '        ', token_name(373), ':', 373,  ',<br/>';
echo '        ', token_name(374), ':', 374,  ',<br/>';
echo '        ', token_name(375), ':', 375,  ',<br/>';
echo '        ', token_name(376), ':', 376,  ',<br/>';
echo '        ', token_name(377), ':', 377,  ',<br/>';
echo '        ', token_name(378), ':', 378,  ',<br/>';
echo '        ', token_name(379), ':', 379,  ',<br/>';
echo '        ', token_name(380), ':', 380,  ',<br/>';
echo '</pre>';
*/
include "config.php";
$content = file_get_contents($file);
$a = token_get_all($content);
?>
<html>
<head>
	<script type="text/javascript" src="token_get_all.js"></script>
	<script type="text/javascript" src="file_get_contents.min.js"></script>
    <script type="text/javascript" src="var_export.js"></script>
	<script type="application/PHPJS" id="test" style="display:none">
<?php echo $content."\n"?>
    </script>
	<script type="text/javascript">

		function DOMReady(f) {
		  if ((/(?!.*?compatible|.*?webkit)^mozilla|opera/i).test(navigator.userAgent)){ // Feeling dirty yet?
			document.addEventListener('DOMContentLoaded', f, false);
		  } else{
			window.setTimeout(f, 0);
		  }
		}
		function replaceAll(st, rp, rpm) {
			while (st.indexOf(rp)>-1) {
                st = st.replace(rp, rpm);
            }
			return st;
		}
		function fixToken(token) {
			token = replaceAll(token, '\n', '\\n');
			token = replaceAll(token, '\t', '\\t');
			token = replaceAll(token, '\r', '\\r');
			token = replaceAll(token, ' ', '&nbsp;');
			return token;
		}
		DOMReady(function() {
			var cont = file_get_contents('s.php');
			var now = Date.now();
			var tokens = token_get_all(cont);
//			alert(((Date.now() - now) / 1000) + ' seconds');
            echo('<pre>'+var_export(tokens, true)+'</pre>');
			var start = <?php echo count($a) + 1?>; // Not in use
			var Struct=[
			<?php
			foreach($a as $k => $tok) {
				echo "\"<font color='red'>";
				if (!is_array($tok)) {
                    echo str_replace(array("\n","\t","\r"," ",'"'),array("\\\\n","\\\\t","\\\\r","&nbsp;",'\"'),htmlentities($tok))."<br>";
                }
				else {
                    foreach($tok as $t) {
                        echo str_replace(array("\n","\t","\r"," ",'"'),array("\\\\n","\\\\t","\\\\r","&nbsp;",'\"'),htmlentities($t))."<br>";
                    }
                }
				echo "</font>\"".($k == count($a) - 1 ? "" : ",");
			}
			?>
			];
			for (var i = 0; i < tokens.length; i++) {
				var str = Struct[i] ? Struct[i] : "";
				if (!(tokens[i] instanceof Array)) {
                    str += tokens[i] ? fixToken(tokens[i]) : 'undefined';
                }
				else {
					tokens[i][1] = tokens[i][1] ? fixToken(tokens[i][1]) : 'undefined';
					str += tokens[i].join('<br>');
				}
				var el = document.createElement('div');
				el.style.backgroundColor = i%2 === 0 ? '#EEE' : '#FFF';
				el.innerHTML = str;
				document.body.appendChild(el);
			}       
     	});
	</script>
</head>
<body>
<table>
<tr><td>T_REQUIRE_ONCE</td><td><font color="red">261</font></td></tr><tr><td>T_REQUIRE</td><td><font color="red">260</font></td></tr><tr><td>T_EVAL</td><td><font color="red">259</font></td></tr><tr><td>T_INCLUDE_ONCE</td><td><font color="red">258</font></td></tr><tr><td>T_INCLUDE</td><td><font color="red">257</font></td></tr><tr><td>T_LOGICAL_OR</td><td><font color="red">262</font></td></tr><tr><td>T_LOGICAL_XOR</td><td><font color="red">263</font></td></tr><tr><td>T_LOGICAL_AND</td><td><font color="red">264</font></td></tr><tr><td>T_PRINT</td><td><font color="red">265</font></td></tr><tr><td>T_SR_EQUAL</td><td><font color="red">276</font></td></tr><tr><td>T_SL_EQUAL</td><td><font color="red">275</font></td></tr><tr><td>T_XOR_EQUAL</td><td><font color="red">274</font></td></tr><tr><td>T_OR_EQUAL</td><td><font color="red">273</font></td></tr><tr><td>T_AND_EQUAL</td><td><font color="red">272</font></td></tr><tr><td>T_MOD_EQUAL</td><td><font color="red">271</font></td></tr><tr><td>T_CONCAT_EQUAL</td><td><font color="red">270</font></td></tr><tr><td>T_DIV_EQUAL</td><td><font color="red">269</font></td></tr><tr><td>T_MUL_EQUAL</td><td><font color="red">268</font></td></tr><tr><td>T_MINUS_EQUAL</td><td><font color="red">267</font></td></tr><tr><td>T_PLUS_EQUAL</td><td><font color="red">266</font></td></tr><tr><td>T_BOOLEAN_OR</td><td><font color="red">277</font></td></tr><tr><td>T_BOOLEAN_AND</td><td><font color="red">278</font></td></tr><tr><td>T_IS_NOT_IDENTICAL</td><td><font color="red">282</font></td></tr><tr><td>T_IS_IDENTICAL</td><td><font color="red">281</font></td></tr><tr><td>T_IS_NOT_EQUAL</td><td><font color="red">280</font></td></tr><tr><td>T_IS_EQUAL</td><td><font color="red">279</font></td></tr><tr><td>T_IS_GREATER_OR_EQUAL</td><td><font color="red">284</font></td></tr><tr><td>T_IS_SMALLER_OR_EQUAL</td><td><font color="red">283</font></td></tr><tr><td>T_SR</td><td><font color="red">286</font></td></tr><tr><td>T_SL</td><td><font color="red">285</font></td></tr><tr><td>T_INSTANCEOF</td><td><font color="red">287</font></td></tr><tr><td>T_UNSET_CAST</td><td><font color="red">296</font></td></tr><tr><td>T_BOOL_CAST</td><td><font color="red">295</font></td></tr><tr><td>T_OBJECT_CAST</td><td><font color="red">294</font></td></tr><tr><td>T_ARRAY_CAST</td><td><font color="red">293</font></td></tr><tr><td>T_STRING_CAST</td><td><font color="red">292</font></td></tr><tr><td>T_DOUBLE_CAST</td><td><font color="red">291</font></td></tr><tr><td>T_INT_CAST</td><td><font color="red">290</font></td></tr><tr><td>T_DEC</td><td><font color="red">289</font></td></tr><tr><td>T_INC</td><td><font color="red">288</font></td></tr><tr><td>T_CLONE</td><td><font color="red">298</font></td></tr><tr><td>T_NEW</td><td><font color="red">297</font></td></tr><tr><td>T_EXIT</td><td><font color="red">299</font></td></tr><tr><td>T_IF</td><td><font color="red">300</font></td></tr><tr><td>T_ELSEIF</td><td><font color="red">301</font></td></tr><tr><td>T_ELSE</td><td><font color="red">302</font></td></tr><tr><td>T_ENDIF</td><td><font color="red">303</font></td></tr><tr><td>T_LNUMBER</td><td><font color="red">304</font></td></tr><tr><td>T_DNUMBER</td><td><font color="red">305</font></td></tr><tr><td>T_STRING</td><td><font color="red">306</font></td></tr><tr><td>T_STRING_VARNAME</td><td><font color="red">307</font></td></tr><tr><td>T_VARIABLE</td><td><font color="red">308</font></td></tr><tr><td>T_NUM_STRING</td><td><font color="red">309</font></td></tr><tr><td>T_INLINE_HTML</td><td><font color="red">310</font></td></tr><tr><td>T_CHARACTER</td><td><font color="red">311</font></td></tr><tr><td>T_BAD_CHARACTER</td><td><font color="red">312</font></td></tr><tr><td>T_ENCAPSED_AND_WHITESPACE</td><td><font color="red">313</font></td></tr><tr><td>T_CONSTANT_ENCAPSED_STRING</td><td><font color="red">314</font></td></tr><tr><td>T_ECHO</td><td><font color="red">315</font></td></tr><tr><td>T_DO</td><td><font color="red">316</font></td></tr><tr><td>T_WHILE</td><td><font color="red">317</font></td></tr><tr><td>T_ENDWHILE</td><td><font color="red">318</font></td></tr><tr><td>T_FOR</td><td><font color="red">319</font></td></tr><tr><td>T_ENDFOR</td><td><font color="red">320</font></td></tr><tr><td>T_FOREACH</td><td><font color="red">321</font></td></tr><tr><td>T_ENDFOREACH</td><td><font color="red">322</font></td></tr><tr><td>T_DECLARE</td><td><font color="red">323</font></td></tr><tr><td>T_ENDDECLARE</td><td><font color="red">324</font></td></tr><tr><td>T_AS</td><td><font color="red">325</font></td></tr><tr><td>T_SWITCH</td><td><font color="red">326</font></td></tr><tr><td>T_ENDSWITCH</td><td><font color="red">327</font></td></tr><tr><td>T_CASE</td><td><font color="red">328</font></td></tr><tr><td>T_DEFAULT</td><td><font color="red">329</font></td></tr><tr><td>T_BREAK</td><td><font color="red">330</font></td></tr><tr><td>T_CONTINUE</td><td><font color="red">331</font></td></tr><tr><td>T_GOTO</td><td><font color="red">332</font></td></tr><tr><td>T_FUNCTION</td><td><font color="red">333</font></td></tr><tr><td>T_CONST</td><td><font color="red">334</font></td></tr><tr><td>T_RETURN</td><td><font color="red">335</font></td></tr><tr><td>T_TRY</td><td><font color="red">336</font></td></tr><tr><td>T_CATCH</td><td><font color="red">337</font></td></tr><tr><td>T_THROW</td><td><font color="red">338</font></td></tr><tr><td>T_USE</td><td><font color="red">339</font></td></tr><tr><td>T_GLOBAL</td><td><font color="red">340</font></td></tr><tr><td>T_PUBLIC</td><td><font color="red">346</font></td></tr><tr><td>T_PROTECTED</td><td><font color="red">345</font></td></tr><tr><td>T_PRIVATE</td><td><font color="red">344</font></td></tr><tr><td>T_FINAL</td><td><font color="red">343</font></td></tr><tr><td>T_ABSTRACT</td><td><font color="red">342</font></td></tr><tr><td>T_STATIC</td><td><font color="red">341</font></td></tr><tr><td>T_VAR</td><td><font color="red">347</font></td></tr><tr><td>T_UNSET</td><td><font color="red">348</font></td></tr><tr><td>T_ISSET</td><td><font color="red">349</font></td></tr><tr><td>T_EMPTY</td><td><font color="red">350</font></td></tr><tr><td>T_HALT_COMPILER</td><td><font color="red">351</font></td></tr><tr><td>T_CLASS</td><td><font color="red">352</font></td></tr><tr><td>T_INTERFACE</td><td><font color="red">353</font></td></tr><tr><td>T_EXTENDS</td><td><font color="red">354</font></td></tr><tr><td>T_IMPLEMENTS</td><td><font color="red">355</font></td></tr><tr><td>T_OBJECT_OPERATOR</td><td><font color="red">356</font></td></tr><tr><td>T_DOUBLE_ARROW</td><td><font color="red">357</font></td></tr><tr><td>T_LIST</td><td><font color="red">358</font></td></tr><tr><td>T_ARRAY</td><td><font color="red">359</font></td></tr><tr><td>T_CLASS_C</td><td><font color="red">360</font></td></tr><tr><td>T_METHOD_C</td><td><font color="red">361</font></td></tr><tr><td>T_FUNC_C</td><td><font color="red">362</font></td></tr><tr><td>T_LINE</td><td><font color="red">363</font></td></tr><tr><td>T_FILE</td><td><font color="red">364</font></td></tr><tr><td>T_COMMENT</td><td><font color="red">365</font></td></tr><tr><td>T_DOC_COMMENT</td><td><font color="red">366</font></td></tr><tr><td>T_OPEN_TAG</td><td><font color="red">367</font></td></tr><tr><td>T_OPEN_TAG_WITH_ECHO</td><td><font color="red">368</font></td></tr><tr><td>T_CLOSE_TAG</td><td><font color="red">369</font></td></tr><tr><td>T_WHITESPACE</td><td><font color="red">370</font></td></tr><tr><td>T_START_HEREDOC</td><td><font color="red">371</font></td></tr><tr><td>T_END_HEREDOC</td><td><font color="red">372</font></td></tr><tr><td>T_DOLLAR_OPEN_CURLY_BRACES</td><td><font color="red">373</font></td></tr><tr><td>T_CURLY_OPEN</td><td><font color="red">374</font></td></tr><tr><td>T_PAAMAYIM_NEKUDOTAYIM</td><td><font color="red">375</font></td></tr><tr><td>T_NAMESPACE</td><td><font color="red">376</font></td></tr><tr><td>T_NS_C</td><td><font color="red">377</font></td></tr><tr><td>T_DIR</td><td><font color="red">378</font></td></tr><tr><td>T_NS_SEPARATOR</td><td><font color="red">379</font></td></tr>
</table>
<pre><?php echo str_replace(array('&', '<'), array('&amp;', '&lt;'), var_export($a, true));  ?></pre>
</body>
</html>



// index.php
<?php
$tests=array();
$files=scandir("tests");
foreach($files as $file) {
	if (preg_match("#\.php#i", $file)) {
		$tests[] = $file;
	}
}
?>
<html>
	<head>
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
		<script type="text/javascript" src="token_get_all.js"></script>
		<script type="text/javascript">
			function execTest () {
				if (next >= files.length) {
					document.getElementsByTagName("button")[0].disabled = false;
					return;
				}
				$.post("tokenizer.php", {file: files[next]}, function (data) {
					data = $.parseJSON(data);
					var php = data[0],
						tokens,
						start,
						res = true;
					try {
						start = + (new Date);
						tokens = token_get_all(data[1]);
						time = (+ (new Date)) - start;
						totTime += time;
						var i = 0,
							l = tokens.length;
						for (; i < l; i++) {
							//console.log("PHP", php[i]);
							//console.log("JS", tokens[i]);
							if (!i in php) {
								failTest("Missing token at index " + i);
								res = false;
								break;
							} else {
								var tArr = $.isArray(tokens[i]),
									pArr = $.isArray(php[i]);
								if (tArr !== pArr) {
									res = false;
								} else if (!tArr) {
									if (tokens[i] !== php[i]) {
										res = false;
									}
								} else {
									for (var c = 0, lc = tokens[i].length; c < lc; c++) {
										if (tokens[i][c] !== php[i][c]) {
											res = false;
											break;
										}
									}
								}
								if (!res) {
									var s = i,
										stop = Math.min(s + 5, l),
										err = "";
									for (; s < stop; s++) {
										err += "PHP (" + s + "):" + "<br>" + (php[s] + "").replace(replace, replacement) + "<br>";
										err += "JS (" + s + "):" + "<br>" + (tokens[s] + "").replace(replace, replacement) + "<br>";
									}
									res = false;
									failTest(err);
									break;
								}
							}
						}
						if (res && l !== php.length) {
							failTest("Different number of tokens. PHP: " + php.length + ", JS: " + l);
						}
					} catch (e) {
						time = (+ (new Date)) - start;
						res = false;
						failTest((e.fileName ? e.fileName + "<br>" : "") + (e.lineNumber ? "Line: " + e.lineNumber + "<br>" : "") + "Message: " + e.message);
					}
					res && passTest();
					next++;
					execTest();
				});
			}
			
			function failTest (msg)
			{
				var html = boxes.eq(next).html();
				boxes.eq(next).addClass("fail").html(html+ " - Time: " + time + "ms").append($("<div class='error'>" + msg + "</div>"));
				pf.innerHTML=parseInt(pf.innerHTML) + 1;
				pt.innerHTML = totTime;
			}
			
			function passTest ()
			{
				var html = boxes.eq(next).html();
				boxes.eq(next).addClass("pass").html(html+ " - Time: " + time + "ms");
				pb.innerHTML=parseInt(pb.innerHTML) + 1;
				pt.innerHTML = totTime;
			}
			
			var files = [
					"<?php echo implode('", "', $tests);?>"
				],
				next = 0,
				replace = /[\n\r\t <>]/g,
				replacement = function (match) {
					if (match === "\n") {
						return "\\n";
					} else if (match === "\r") {
						return "\\r";
					} else if (match === "\t") {
						return "\\t";
					} else if (match === " ") {
						return "\\s";
					} else if (match === ">") {
						return "&gt;";
					} else if (match === "<") {
						return "&lt;";
					}
					return match;
				},
				boxes,
				pb,
				pt,
				pf,
				time,
				totTime = 0;
			$(document).ready(function () {
				boxes = $(".test");
				pb=document.getElementById("pass");
				pf=document.getElementById("fail");
				pt=document.getElementById("ttime");
			});
		</script>
		<style>
		body{
			font-family: Arial, Verdana, sans-serif;
			font-size:13px;
		}
		.test {
			background: #F0F0F0;
			border: 1px solid #CDCDCD;
			padding: 10px;
			margin-top: 10px;
		}
		.test.pass {
			background: #DCFEDA;
			border: 1px solid #A6FCA2;
		}
		.test.fail {
			background: #FEDADA;
			border: 1px solid #FCA6A6;
		}
		.test .error {
			background: white;
			margin-top:5px;
			border: 1px solid #FCA6A6;
		}
		</style>
	</head>
</html>
<body>
	<button onClick="this.disabled=true;execTest();">Run test</button> Total: <?php echo count($tests)?>, Pass: <span id="pass">0</span>, Fail: <span id="fail">0</span>, Total time: <span id="ttime">0</span> ms
	<?php foreach ($tests as $test):?>
	<div class="test">
		<?php echo $test?>
	</div>
	<?php endforeach;?>
	<?php
	/*echo "T_ABSTRACT: ".T_ABSTRACT.",<br>";
	echo "T_AND_EQUAL: ".T_AND_EQUAL.",<br>";
	echo "T_ARRAY: ".T_ARRAY.",<br>";
	echo "T_ARRAY_CAST: ".T_ARRAY_CAST.",<br>";
	echo "T_AS: ".T_AS.",<br>";
	echo "T_BAD_CHARACTER: ".T_BAD_CHARACTER.",<br>";
	echo "T_BOOLEAN_AND: ".T_BOOLEAN_AND.",<br>";
	echo "T_BOOLEAN_OR: ".T_BOOLEAN_OR.",<br>";
	echo "T_BOOL_CAST: ".T_BOOL_CAST.",<br>";
	echo "T_BREAK: ".T_BREAK.",<br>";
	echo "T_CASE: ".T_CASE.",<br>";
	echo "T_CATCH: ".T_CATCH.",<br>";
	echo "T_CHARACTER: ".T_CHARACTER.",<br>";
	echo "T_CLASS: ".T_CLASS.",<br>";
	echo "T_CLASS_C: ".T_CLASS_C.",<br>";
	echo "T_CLONE: ".T_CLONE.",<br>";
	echo "T_CLOSE_TAG: ".T_CLOSE_TAG.",<br>";
	echo "T_COMMENT: ".T_COMMENT.",<br>";
	echo "T_CONCAT_EQUAL: ".T_CONCAT_EQUAL.",<br>";
	echo "T_CONST: ".T_CONST.",<br>";
	echo "T_CONSTANT_ENCAPSED_STRING: ".T_CONSTANT_ENCAPSED_STRING.",<br>";
	echo "T_CONTINUE: ".T_CONTINUE.",<br>";
	echo "T_CURLY_OPEN: ".T_CURLY_OPEN.",<br>";
	echo "T_DEC: ".T_DEC.",<br>";
	echo "T_DECLARE: ".T_DECLARE.",<br>";
	echo "T_DEFAULT: ".T_DEFAULT.",<br>";
	echo "T_DIR: ".T_DIR.",<br>";
	echo "T_DIV_EQUAL: ".T_DIV_EQUAL.",<br>";
	echo "T_DNUMBER: ".T_DNUMBER.",<br>";
	echo "T_DOC_COMMENT: ".T_DOC_COMMENT.",<br>";
	echo "T_DO: ".T_DO.",<br>";
	echo "T_DOLLAR_OPEN_CURLY_BRACES: ".T_DOLLAR_OPEN_CURLY_BRACES.",<br>";
	echo "T_DOUBLE_ARROW: ".T_DOUBLE_ARROW.",<br>";
	echo "T_DOUBLE_CAST: ".T_DOUBLE_CAST.",<br>";
	echo "T_DOUBLE_COLON: ".T_DOUBLE_COLON.",<br>";
	echo "T_ECHO: ".T_ECHO.",<br>";
	echo "T_ELSE: ".T_ELSE.",<br>";
	echo "T_ELSEIF: ".T_ELSEIF.",<br>";
	echo "T_EMPTY: ".T_EMPTY.",<br>";
	echo "T_ENCAPSED_AND_WHITESPACE: ".T_ENCAPSED_AND_WHITESPACE.",<br>";
	echo "T_ENDDECLARE: ".T_ENDDECLARE.",<br>";
	echo "T_ENDFOR: ".T_ENDFOR.",<br>";
	echo "T_ENDFOREACH: ".T_ENDFOREACH.",<br>";
	echo "T_ENDIF: ".T_ENDIF.",<br>";
	echo "T_ENDSWITCH: ".T_ENDSWITCH.",<br>";
	echo "T_ENDWHILE: ".T_ENDWHILE.",<br>";
	echo "T_END_HEREDOC: ".T_END_HEREDOC.",<br>";
	echo "T_EVAL: ".T_EVAL.",<br>";
	echo "T_EXIT: ".T_EXIT.",<br>";
	echo "T_EXTENDS: ".T_EXTENDS.",<br>";
	echo "T_FILE: ".T_FILE.",<br>";
	echo "T_FINAL: ".T_FINAL.",<br>";
	echo "T_FOR: ".T_FOR.",<br>";
	echo "T_FOREACH: ".T_FOREACH.",<br>";
	echo "T_FUNCTION: ".T_FUNCTION.",<br>";
	echo "T_FUNC_C: ".T_FUNC_C.",<br>";
	echo "T_GLOBAL: ".T_GLOBAL.",<br>";
	echo "T_GOTO: ".T_GOTO.",<br>";
	echo "T_HALT_COMPILER: ".T_HALT_COMPILER.",<br>";
	echo "T_IF: ".T_IF.",<br>";
	echo "T_IMPLEMENTS: ".T_IMPLEMENTS.",<br>";
	echo "T_INC: ".T_INC.",<br>";
	echo "T_INCLUDE: ".T_INCLUDE.",<br>";
	echo "T_INCLUDE_ONCE: ".T_INCLUDE_ONCE.",<br>";
	echo "T_INLINE_HTML: ".T_INLINE_HTML.",<br>";
	echo "T_INSTANCEOF: ".T_INSTANCEOF.",<br>";
	echo "T_INT_CAST: ".T_INT_CAST.",<br>";
	echo "T_INTERFACE: ".T_INTERFACE.",<br>";
	echo "T_ISSET: ".T_ISSET.",<br>";
	echo "T_IS_EQUAL: ".T_IS_EQUAL.",<br>";
	echo "T_IS_GREATER_OR_EQUAL: ".T_IS_GREATER_OR_EQUAL.",<br>";
	echo "T_IS_IDENTICAL: ".T_IS_IDENTICAL.",<br>";
	echo "T_IS_NOT_EQUAL: ".T_IS_NOT_EQUAL.",<br>";
	echo "T_IS_NOT_IDENTICAL: ".T_IS_NOT_IDENTICAL.",<br>";
	echo "T_IS_SMALLER_OR_EQUAL: ".T_IS_SMALLER_OR_EQUAL.",<br>";
	echo "T_LINE: ".T_LINE.",<br>";
	echo "T_LIST: ".T_LIST.",<br>";
	echo "T_LNUMBER: ".T_LNUMBER.",<br>";
	echo "T_LOGICAL_AND: ".T_LOGICAL_AND.",<br>";
	echo "T_LOGICAL_OR: ".T_LOGICAL_OR.",<br>";
	echo "T_LOGICAL_XOR: ".T_LOGICAL_XOR.",<br>";
	echo "T_METHOD_C: ".T_METHOD_C.",<br>";
	echo "T_MINUS_EQUAL: ".T_MINUS_EQUAL.",<br>";
	echo "T_MOD_EQUAL: ".T_MOD_EQUAL.",<br>";
	echo "T_MUL_EQUAL: ".T_MUL_EQUAL.",<br>";
	echo "T_NAMESPACE: ".T_NAMESPACE.",<br>";
	echo "T_NS_C: ".T_NS_C.",<br>";
	echo "T_NS_SEPARATOR: ".T_NS_SEPARATOR.",<br>";
	echo "T_NEW: ".T_NEW.",<br>";
	echo "T_NUM_STRING: ".T_NUM_STRING.",<br>";
	echo "T_OBJECT_CAST: ".T_OBJECT_CAST.",<br>";
	echo "T_OBJECT_OPERATOR: ".T_OBJECT_OPERATOR.",<br>";
	echo "T_OPEN_TAG: ".T_OPEN_TAG.",<br>";
	echo "T_OPEN_TAG_WITH_ECHO: ".T_OPEN_TAG_WITH_ECHO.",<br>";
	echo "T_OR_EQUAL: ".T_OR_EQUAL.",<br>";
	echo "T_PAAMAYIM_NEKUDOTAYIM: ".T_PAAMAYIM_NEKUDOTAYIM.",<br>";
	echo "T_PLUS_EQUAL: ".T_PLUS_EQUAL.",<br>";
	echo "T_PRINT: ".T_PRINT.",<br>";
	echo "T_PRIVATE: ".T_PRIVATE.",<br>";
	echo "T_PUBLIC: ".T_PUBLIC.",<br>";
	echo "T_PROTECTED: ".T_PROTECTED.",<br>";
	echo "T_REQUIRE: ".T_REQUIRE.",<br>";
	echo "T_REQUIRE_ONCE: ".T_REQUIRE_ONCE.",<br>";
	echo "T_RETURN: ".T_RETURN.",<br>";
	echo "T_SL: ".T_SL.",<br>";
	echo "T_SL_EQUAL: ".T_SL_EQUAL.",<br>";
	echo "T_SR: ".T_SR.",<br>";
	echo "T_SR_EQUAL: ".T_SR_EQUAL.",<br>";
	echo "T_START_HEREDOC: ".T_START_HEREDOC.",<br>";
	echo "T_STATIC: ".T_STATIC.",<br>";
	echo "T_STRING: ".T_STRING.",<br>";
	echo "T_STRING_CAST: ".T_STRING_CAST.",<br>";
	echo "T_STRING_VARNAME: ".T_STRING_VARNAME.",<br>";
	echo "T_SWITCH: ".T_SWITCH.",<br>";
	echo "T_THROW: ".T_THROW.",<br>";
	echo "T_TRY: ".T_TRY.",<br>";
	echo "T_UNSET: ".T_UNSET.",<br>";
	echo "T_UNSET_CAST: ".T_UNSET_CAST.",<br>";
	echo "T_USE: ".T_USE.",<br>";
	echo "T_VAR: ".T_VAR.",<br>";
	echo "T_VARIABLE: ".T_VARIABLE.",<br>";
	echo "T_WHILE: ".T_WHILE.",<br>";
	echo "T_WHITESPACE: ".T_WHITESPACE.",<br>";
	echo "T_XOR_EQUAL: ".T_XOR_EQUAL.",<br>";
	*/
	?>
</body>



// PHPToJS.js
function PHPToJS (config) {
	this._js = '';
	if (config && typeof config.no$ !== 'undefined') {
		this.no$ = config.no$;
	}
}
PHPToJS.prototype.T_REQUIRE_ONCE = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_REQUIRE = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_EVAL = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_INCLUDE_ONCE = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_INCLUDE = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_LOGICAL_OR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_LOGICAL_XOR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_LOGICAL_AND = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PRINT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_SR_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_SL_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_XOR_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_OR_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_AND_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_MOD_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CONCAT_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DIV_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_MUL_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_MINUS_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PLUS_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_BOOLEAN_OR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_BOOLEAN_AND = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_NOT_IDENTICAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_IDENTICAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_NOT_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_GREATER_OR_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IS_SMALLER_OR_EQUAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_SR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_SL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_INSTANCEOF = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_UNSET_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_BOOL_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_OBJECT_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ARRAY_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_STRING_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DOUBLE_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_INT_CAST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DEC = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_INC = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CLONE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_NEW = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_EXIT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IF = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ELSEIF = function (string, line, token) {
    this._js += 'else if';

};
PHPToJS.prototype.T_ELSE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDIF = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_LNUMBER = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DNUMBER = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_STRING = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_STRING_VARNAME = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_VARIABLE = function (string, line, token) {
    this._js += 'var '+ (this.no$ ? string.replace(/^\$/, '') : string);

};
PHPToJS.prototype.T_NUM_STRING = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_INLINE_HTML = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CHARACTER = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_BAD_CHARACTER = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENCAPSED_AND_WHITESPACE = function (string, line, token) {
    this._js += "'"+string.replace(/'/g, "\\'")+"'";

};
PHPToJS.prototype.T_CONSTANT_ENCAPSED_STRING = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ECHO = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DO = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_WHILE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDWHILE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FOR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDFOR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FOREACH = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDFOREACH = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DECLARE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDDECLARE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_AS = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_SWITCH = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ENDSWITCH = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CASE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DEFAULT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_BREAK = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CONTINUE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_GOTO = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FUNCTION = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CONST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_RETURN = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_TRY = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CATCH = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_THROW = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_USE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_GLOBAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PUBLIC = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PROTECTED = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PRIVATE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FINAL = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ABSTRACT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_STATIC = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_VAR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_UNSET = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ISSET = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_EMPTY = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_HALT_COMPILER = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CLASS = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_INTERFACE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_EXTENDS = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_IMPLEMENTS = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_OBJECT_OPERATOR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DOUBLE_ARROW = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_LIST = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_ARRAY = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CLASS_C = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_METHOD_C = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FUNC_C = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_LINE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_FILE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_COMMENT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DOC_COMMENT = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_OPEN_TAG = function (string, line, token) {
    // this._js += string;
};
PHPToJS.prototype.T_OPEN_TAG_WITH_ECHO = function (string, line, token) {
    this._js += string;
};
PHPToJS.prototype.T_CLOSE_TAG = function (string, line, token) {
    // this._js += string;
};
PHPToJS.prototype.T_WHITESPACE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_START_HEREDOC = function (string, line, token) {
    //this._js += string;
	this._startedHeredoc = true;
};
PHPToJS.prototype.T_END_HEREDOC = function (string, line, token) {
    //this._js += string;
	this._startedHeredoc = false;

};
PHPToJS.prototype.T_DOLLAR_OPEN_CURLY_BRACES = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_CURLY_OPEN = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_PAAMAYIM_NEKUDOTAYIM = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_NAMESPACE = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_NS_C = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_DIR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype.T_NS_SEPARATOR = function (string, line, token) {
    this._js += string;

};
PHPToJS.prototype['='] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype[';'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['('] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype[')'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['{'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['}'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['['] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype[']'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['~'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['@'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['+'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['/'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['-'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['*'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['.'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['$'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['|'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['^'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['&'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['<'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['>'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['%'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['!'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype['?'] = function (string, line, token) {
	this._js += token;
};
PHPToJS.prototype[':'] = function (string, line, token) {
	this._js += token;
};





// PHPTokenizer.js
function PHPTokenizer () {

}
PHPTokenizer.prototype.T_REQUIRE_ONCE: function (string, line, token) {

};
PHPTokenizer.prototype.T_REQUIRE: function (string, line, token) {

};
PHPTokenizer.prototype.T_EVAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_INCLUDE_ONCE: function (string, line, token) {

};
PHPTokenizer.prototype.T_INCLUDE: function (string, line, token) {

};
PHPTokenizer.prototype.T_LOGICAL_OR: function (string, line, token) {

};
PHPTokenizer.prototype.T_LOGICAL_XOR: function (string, line, token) {

};
PHPTokenizer.prototype.T_LOGICAL_AND: function (string, line, token) {

};
PHPTokenizer.prototype.T_PRINT: function (string, line, token) {

};
PHPTokenizer.prototype.T_SR_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_SL_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_XOR_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_OR_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_AND_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_MOD_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_CONCAT_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_DIV_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_MUL_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_MINUS_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_PLUS_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_BOOLEAN_OR: function (string, line, token) {

};
PHPTokenizer.prototype.T_BOOLEAN_AND: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_NOT_IDENTICAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_IDENTICAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_NOT_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_GREATER_OR_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_IS_SMALLER_OR_EQUAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_SR: function (string, line, token) {

};
PHPTokenizer.prototype.T_SL: function (string, line, token) {

};
PHPTokenizer.prototype.T_INSTANCEOF: function (string, line, token) {

};
PHPTokenizer.prototype.T_UNSET_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_BOOL_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_OBJECT_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_ARRAY_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_STRING_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_DOUBLE_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_INT_CAST: function (string, line, token) {

};
PHPTokenizer.prototype.T_DEC: function (string, line, token) {

};
PHPTokenizer.prototype.T_INC: function (string, line, token) {

};
PHPTokenizer.prototype.T_CLONE: function (string, line, token) {

};
PHPTokenizer.prototype.T_NEW: function (string, line, token) {

};
PHPTokenizer.prototype.T_EXIT: function (string, line, token) {

};
PHPTokenizer.prototype.T_IF: function (string, line, token) {

};
PHPTokenizer.prototype.T_ELSEIF: function (string, line, token) {

};
PHPTokenizer.prototype.T_ELSE: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDIF: function (string, line, token) {

};
PHPTokenizer.prototype.T_LNUMBER: function (string, line, token) {

};
PHPTokenizer.prototype.T_DNUMBER: function (string, line, token) {

};
PHPTokenizer.prototype.T_STRING: function (string, line, token) {

};
PHPTokenizer.prototype.T_STRING_VARNAME: function (string, line, token) {

};
PHPTokenizer.prototype.T_VARIABLE: function (string, line, token) {

};
PHPTokenizer.prototype.T_NUM_STRING: function (string, line, token) {

};
PHPTokenizer.prototype.T_INLINE_HTML: function (string, line, token) {

};
PHPTokenizer.prototype.T_CHARACTER: function (string, line, token) {

};
PHPTokenizer.prototype.T_BAD_CHARACTER: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENCAPSED_AND_WHITESPACE: function (string, line, token) {

};
PHPTokenizer.prototype.T_CONSTANT_ENCAPSED_STRING: function (string, line, token) {

};
PHPTokenizer.prototype.T_ECHO: function (string, line, token) {

};
PHPTokenizer.prototype.T_DO: function (string, line, token) {

};
PHPTokenizer.prototype.T_WHILE: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDWHILE: function (string, line, token) {

};
PHPTokenizer.prototype.T_FOR: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDFOR: function (string, line, token) {

};
PHPTokenizer.prototype.T_FOREACH: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDFOREACH: function (string, line, token) {

};
PHPTokenizer.prototype.T_DECLARE: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDDECLARE: function (string, line, token) {

};
PHPTokenizer.prototype.T_AS: function (string, line, token) {

};
PHPTokenizer.prototype.T_SWITCH: function (string, line, token) {

};
PHPTokenizer.prototype.T_ENDSWITCH: function (string, line, token) {

};
PHPTokenizer.prototype.T_CASE: function (string, line, token) {

};
PHPTokenizer.prototype.T_DEFAULT: function (string, line, token) {

};
PHPTokenizer.prototype.T_BREAK: function (string, line, token) {

};
PHPTokenizer.prototype.T_CONTINUE: function (string, line, token) {

};
PHPTokenizer.prototype.T_GOTO: function (string, line, token) {

};
PHPTokenizer.prototype.T_FUNCTION: function (string, line, token) {

};
PHPTokenizer.prototype.T_CONST: function (string, line, token) {

};
PHPTokenizer.prototype.T_RETURN: function (string, line, token) {

};
PHPTokenizer.prototype.T_TRY: function (string, line, token) {

};
PHPTokenizer.prototype.T_CATCH: function (string, line, token) {

};
PHPTokenizer.prototype.T_THROW: function (string, line, token) {

};
PHPTokenizer.prototype.T_USE: function (string, line, token) {

};
PHPTokenizer.prototype.T_GLOBAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_PUBLIC: function (string, line, token) {

};
PHPTokenizer.prototype.T_PROTECTED: function (string, line, token) {

};
PHPTokenizer.prototype.T_PRIVATE: function (string, line, token) {

};
PHPTokenizer.prototype.T_FINAL: function (string, line, token) {

};
PHPTokenizer.prototype.T_ABSTRACT: function (string, line, token) {

};
PHPTokenizer.prototype.T_STATIC: function (string, line, token) {

};
PHPTokenizer.prototype.T_VAR: function (string, line, token) {

};
PHPTokenizer.prototype.T_UNSET: function (string, line, token) {

};
PHPTokenizer.prototype.T_ISSET: function (string, line, token) {

};
PHPTokenizer.prototype.T_EMPTY: function (string, line, token) {

};
PHPTokenizer.prototype.T_HALT_COMPILER: function (string, line, token) {

};
PHPTokenizer.prototype.T_CLASS: function (string, line, token) {

};
PHPTokenizer.prototype.T_INTERFACE: function (string, line, token) {

};
PHPTokenizer.prototype.T_EXTENDS: function (string, line, token) {

};
PHPTokenizer.prototype.T_IMPLEMENTS: function (string, line, token) {

};
PHPTokenizer.prototype.T_OBJECT_OPERATOR: function (string, line, token) {

};
PHPTokenizer.prototype.T_DOUBLE_ARROW: function (string, line, token) {

};
PHPTokenizer.prototype.T_LIST: function (string, line, token) {

};
PHPTokenizer.prototype.T_ARRAY: function (string, line, token) {

};
PHPTokenizer.prototype.T_CLASS_C: function (string, line, token) {

};
PHPTokenizer.prototype.T_METHOD_C: function (string, line, token) {

};
PHPTokenizer.prototype.T_FUNC_C: function (string, line, token) {

};
PHPTokenizer.prototype.T_LINE: function (string, line, token) {

};
PHPTokenizer.prototype.T_FILE: function (string, line, token) {

};
PHPTokenizer.prototype.T_COMMENT: function (string, line, token) {

};
PHPTokenizer.prototype.T_DOC_COMMENT: function (string, line, token) {

};
PHPTokenizer.prototype.T_OPEN_TAG: function (string, line, token) {

};
PHPTokenizer.prototype.T_OPEN_TAG_WITH_ECHO: function (string, line, token) {

};
PHPTokenizer.prototype.T_CLOSE_TAG: function (string, line, token) {

};
PHPTokenizer.prototype.T_WHITESPACE: function (string, line, token) {

};
PHPTokenizer.prototype.T_START_HEREDOC: function (string, line, token) {

};
PHPTokenizer.prototype.T_END_HEREDOC: function (string, line, token) {

};
PHPTokenizer.prototype.T_DOLLAR_OPEN_CURLY_BRACES: function (string, line, token) {

};
PHPTokenizer.prototype.T_CURLY_OPEN: function (string, line, token) {

};
PHPTokenizer.prototype.T_PAAMAYIM_NEKUDOTAYIM: function (string, line, token) {

};
PHPTokenizer.prototype.T_NAMESPACE: function (string, line, token) {

};
PHPTokenizer.prototype.T_NS_C: function (string, line, token) {

};
PHPTokenizer.prototype.T_DIR: function (string, line, token) {

};
PHPTokenizer.prototype.T_NS_SEPARATOR: function (string, line, token) {

};
PHPToJS.prototype['='] = function (string, line, token) {

};
PHPToJS.prototype[';'] = function (string, line, token) {

};
PHPToJS.prototype['('] = function (string, line, token) {

};
PHPToJS.prototype[')'] = function (string, line, token) {

};
PHPToJS.prototype['{'] = function (string, line, token) {

};
PHPToJS.prototype['}'] = function (string, line, token) {

};
PHPToJS.prototype['['] = function (string, line, token) {

};
PHPToJS.prototype[']'] = function (string, line, token) {

};
PHPToJS.prototype['~'] = function (string, line, token) {

};
PHPToJS.prototype['@'] = function (string, line, token) {

};
PHPToJS.prototype['+'] = function (string, line, token) {

};
PHPToJS.prototype['/'] = function (string, line, token) {

};
PHPToJS.prototype['-'] = function (string, line, token) {

};
PHPToJS.prototype['*'] = function (string, line, token) {

};
PHPToJS.prototype['.'] = function (string, line, token) {

};
PHPToJS.prototype['$'] = function (string, line, token) {

};
PHPToJS.prototype['|'] = function (string, line, token) {

};
PHPToJS.prototype['^'] = function (string, line, token) {

};
PHPToJS.prototype['&'] = function (string, line, token) {

};
PHPToJS.prototype['<'] = function (string, line, token) {

};
PHPToJS.prototype['>'] = function (string, line, token) {

};
PHPToJS.prototype['%'] = function (string, line, token) {

};
PHPToJS.prototype['!'] = function (string, line, token) {

};
PHPToJS.prototype['?'] = function (string, line, token) {

};
PHPToJS.prototype[':'] = function (string, line, token) {

};




// s.php
<?php
include "config.php";

$asd=file_get_contents($file);
header("Content-type: text/plain");
echo $asd;
?>



// simple.php
<?php echo; ?>



// simple2.php
/* comment */



// test.php
<?php
$a->ats=array();

$a="escape\\\"asd";

$a="set_$prop";

$a="set_$prop[0]";

$a="set_$prop[abcd]";

$a="set_${prop}";

$a="set_${prop[99]}";

$a="set_${prop[abc]}";

$a="set_{$prop}";

$a="set_{$prop[0]}";

$a="set_{$prop[a]}";

$a="set_{$prop->asd+10}";
?>



// test2.php
<?php
/**
 * DOMPDF - PHP5 HTML to PDF renderer
 *
 * File: $RCSfile: style.cls.php,v $
 * Created on: 2004-06-01
 *
 * Copyright (c) 2004 - Benj Carson <benjcarson@digitaljunkies.ca>
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library in the file LICENSE.LGPL; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA
 * 02111-1307 USA
 *
 * Alternatively, you may distribute this software under the terms of the
 * PHP License, version 3.0 or later.  A copy of this license should have
 * been distributed with this file in the file LICENSE.PHP .  If this is not
 * the case, you can obtain a copy at http://www.php.net/license/3_0.txt.
 *
 * The latest version of DOMPDF might be available at:
 * http://www.digitaljunkies.ca/dompdf
 *
 * @link http://www.digitaljunkies.ca/dompdf
 * @copyright 2004 Benj Carson
 * @author Benj Carson <benjcarson@digitaljunkies.ca>
 * @contributor Helmut Tischer <htischer@weihenstephan.org>
 * @package dompdf
 * @version 0.5.1
 *
 * Changes
 * @contributor Helmut Tischer <htischer@weihenstephan.org>
 * @version 0.5.1.htischer.20090507
 * - Fix px to pt conversion according to DOMPDF_DPI
 * - Recognize css styles with !important attribute, and store !important attribute within style
 * - Propagate !important by inherit and sequences of styles with merge.
 * - Add missing style property cache flushes for consistent rendering, e.g. on explicte assignments
 * - Add important set/get for access from outside of class
 * - Fix font_family search path with multiple fonts list in css attribute:
 *   On missing font, do not immediately fall back to default font,
 *   but try subsequent fonts in search chain. Only when none found, explicitely
 *   refer to default font.
 * - Allow read of background individual properties
 * - Add support for individual styles background-position, background-attachment, background-repeat
 * - Complete style components of list-style
 * - Add support for combined styles in addition to individual styles
 *   like {border: red 1px solid;}, { border-width: 1px;}, { border-right-color: red; } ...
 *   for font, background
 * - Propagate attributes including !important from combined style to individual component
 *   for border, background, padding, margin, font, list_style
 * - Refactor common code of border, background, padding, margin, font, list_style
 * - Refactor common code of list-style-image and background-image
 * - special treatment of css images "none" instead of url(...), otherwise would prepend string "none" with path name
 * - Added comments
 * - Added debug output
 * @contributor Helmut Tischer <htischer@weihenstephan.org>
 * @version dompdf_trunk_with_helmut_mods.20090524
 * - Allow superflous white space and string delimiter in font search path.
 * - Restore lost change of default font of above
 * @version 20090610
 * - Allow absolute path from web server root as html image reference
 * - More accurate handling of css property cache consistency
 */

/* $Id: style.cls.php 186 2009-10-19 22:42:06Z eclecticgeek@gmail.com $ */

/**
 * Represents CSS properties.
 *
 * The Style class is responsible for handling and storing CSS properties.
 * It includes methods to resolve colours and lengths, as well as getters &
 * setters for many CSS properites.
 *
 * Actual CSS parsing is performed in the {@link Stylesheet} class.
 *
 * @package dompdf
 */
class Style {

  /**
   * Default font size, in points.
   *
   * @var float
   */
  static $default_font_size = 12;

  /**
   * Default line height, as a fraction of the font size.
   *
   * @var float
   */
  static $default_line_height = 1.2;

  /**
   * List of all inline types.  Should really be a constant.
   *
   * @var array
   */
  static $INLINE_TYPES = array("inline");

  /**
   * List of all block types.  Should really be a constant.
   *
   * @var array
   */
  static $BLOCK_TYPES = array("block","inline-block", "table-cell", "list-item");

  /**
   * List of all table types.  Should really be a constant.
   *
   * @var array;
   */
  static $TABLE_TYPES = array("table", "inline-table");

  /**
   * List of valid border styles.  Should also really be a constant.
   *
   * @var array
   */
  static $BORDER_STYLES = array("none", "hidden", "dotted", "dashed", "solid",
                                "double", "groove", "ridge", "inset", "outset");

  /**
   * Default style values.
   *
   * @link http://www.w3.org/TR/CSS21/propidx.html
   *
   * @var array
   */
  static protected $_defaults = null;

  /**
   * List of inherited properties
   *
   * @link http://www.w3.org/TR/CSS21/propidx.html
   *
   * @var array
   */
  static protected $_inherited = null;

  /**
   * The stylesheet this style belongs to
   *
   * @see Stylesheet
   * @var Stylesheet
   */
  protected $_stylesheet; // stylesheet this style is attached to

  /**
   * Main array of all CSS properties & values
   *
   * @var array
   */
  protected $_props;

  /* var instead of protected would allow access outside of class */
  protected $_important_props;

  /**
   * Cached property values
   *
   * @var array
   */
  protected $_prop_cache;
  
  /**
   * Font size of parent element in document tree.  Used for relative font
   * size resolution.
   *
   * @var float
   */
  protected $_parent_font_size; // Font size of parent element
  
  // private members
  /**
   * True once the font size is resolved absolutely
   *
   * @var bool
   */
  private $__font_size_calculated; // Cache flag
  
  /**
   * Class constructor
   *
   * @param Stylesheet $stylesheet the stylesheet this Style is associated with.
   */
  function __construct(Stylesheet $stylesheet) {
    $this->_props = array();
    $this->_important_props = array();
    $this->_stylesheet = $stylesheet;
    $this->_parent_font_size = null;
    $this->__font_size_calculated = false;
    
    if ( !isset(self::$_defaults) ) {
    
      // Shorthand
      $d =& self::$_defaults;
    
      // All CSS 2.1 properties, and their default values
      $d["azimuth"] = "center";
      $d["background_attachment"] = "scroll";
      $d["background_color"] = "transparent";
      $d["background_image"] = "none";
      $d["background_position"] = "0% 0%";
      $d["background_repeat"] = "repeat";
      $d["background"] = "";
      $d["border_collapse"] = "separate";
      $d["border_color"] = "";
      $d["border_spacing"] = "0";
      $d["border_style"] = "";
      $d["border_top"] = "";
      $d["border_right"] = "";
      $d["border_bottom"] = "";
      $d["border_left"] = "";
      $d["border_top_color"] = "";
      $d["border_right_color"] = "";
      $d["border_bottom_color"] = "";
      $d["border_left_color"] = "";
      $d["border_top_style"] = "none";
      $d["border_right_style"] = "none";
      $d["border_bottom_style"] = "none";
      $d["border_left_style"] = "none";
      $d["border_top_width"] = "medium";
      $d["border_right_width"] = "medium";
      $d["border_bottom_width"] = "medium";
      $d["border_left_width"] = "medium";
      $d["border_width"] = "medium";
      $d["border"] = "";
      $d["bottom"] = "auto";
      $d["caption_side"] = "top";
      $d["clear"] = "none";
      $d["clip"] = "auto";
      $d["color"] = "#000000";
      $d["content"] = "normal";
      $d["counter_increment"] = "none";
      $d["counter_reset"] = "none";
      $d["cue_after"] = "none";
      $d["cue_before"] = "none";
      $d["cue"] = "";
      $d["cursor"] = "auto";
      $d["direction"] = "ltr";
      $d["display"] = "inline";
      $d["elevation"] = "level";
      $d["empty_cells"] = "show";
      $d["float"] = "none";
      $d["font_family"] = "serif";
      $d["font_size"] = "medium";
      $d["font_style"] = "normal";
      $d["font_variant"] = "normal";
      $d["font_weight"] = "normal";
      $d["font"] = "";
      $d["height"] = "auto";
      $d["left"] = "auto";
      $d["letter_spacing"] = "normal";
      $d["line_height"] = "normal";
      $d["list_style_image"] = "none";
      $d["list_style_position"] = "outside";
      $d["list_style_type"] = "disc";
      $d["list_style"] = "";
      $d["margin_right"] = "0";
      $d["margin_left"] = "0";
      $d["margin_top"] = "0";
      $d["margin_bottom"] = "0";
      $d["margin"] = "";
      $d["max_height"] = "none";
      $d["max_width"] = "none";
      $d["min_height"] = "0";
      $d["min_width"] = "0";
      $d["orphans"] = "2";
      $d["outline_color"] = "invert";
      $d["outline_style"] = "none";
      $d["outline_width"] = "medium";
      $d["outline"] = "";
      $d["overflow"] = "visible";
      $d["padding_top"] = "0";
      $d["padding_right"] = "0";
      $d["padding_bottom"] = "0";
      $d["padding_left"] = "0";
      $d["padding"] = "";
      $d["page_break_after"] = "auto";
      $d["page_break_before"] = "auto";
      $d["page_break_inside"] = "auto";
      $d["pause_after"] = "0";
      $d["pause_before"] = "0";
      $d["pause"] = "";
      $d["pitch_range"] = "50";
      $d["pitch"] = "medium";
      $d["play_during"] = "auto";
      $d["position"] = "static";
      $d["quotes"] = "";
      $d["richness"] = "50";
      $d["right"] = "auto";
      $d["speak_header"] = "once";
      $d["speak_numeral"] = "continuous";
      $d["speak_punctuation"] = "none";
      $d["speak"] = "normal";
      $d["speech_rate"] = "medium";
      $d["stress"] = "50";
      $d["table_layout"] = "auto";
      $d["text_align"] = "left";
      $d["text_decoration"] = "none";
      $d["text_indent"] = "0";
      $d["text_transform"] = "none";
      $d["top"] = "auto";
      $d["unicode_bidi"] = "normal";
      $d["vertical_align"] = "baseline";
      $d["visibility"] = "visible";
      $d["voice_family"] = "";
      $d["volume"] = "medium";
      $d["white_space"] = "normal";
      $d["widows"] = "2";
      $d["width"] = "auto";
      $d["word_spacing"] = "normal";
      $d["z_index"] = "auto";

      // Properties that inherit by default
      self::$_inherited = array("azimuth",
                                 "border_collapse",
                                 "border_spacing",
                                 "caption_side",
                                 "color",
                                 "cursor",
                                 "direction",
                                 "elevation",
                                 "empty_cells",
                                 "font_family",
                                 "font_size",
                                 "font_style",
                                 "font_variant",
                                 "font_weight",
                                 "font",
                                 "letter_spacing",
                                 "line_height",
                                 "list_style_image",
                                 "list_style_position",
                                 "list_style_type",
                                 "list_style",
                                 "orphans",
                                 "page_break_inside",
                                 "pitch_range",
                                 "pitch",
                                 "quotes",
                                 "richness",
                                 "speak_header",
                                 "speak_numeral",
                                 "speak_punctuation",
                                 "speak",
                                 "speech_rate",
                                 "stress",
                                 "text_align",
                                 "text_indent",
                                 "text_transform",
                                 "visibility",
                                 "voice_family",
                                 "volume",
                                 "white_space",
                                 "widows",
                                 "word_spacing");
    }

  }

  /**
   * "Destructor": forcibly free all references held by this object
   */
  function dispose() {
    unset($this->_stylesheet);
  }
  
  /**
   * returns the {@link Stylesheet} this Style is associated with.
   *
   * @return Stylesheet
   */
  function get_stylesheet() { return $this->_stylesheet; }
  
  /**
   * Converts any CSS length value into an absolute length in points.
   *
   * length_in_pt() takes a single length (e.g. '1em') or an array of
   * lengths and returns an absolute length.  If an array is passed, then
   * the return value is the sum of all elements.
   *
   * If a reference size is not provided, the default font size is used
   * ({@link Style::$default_font_size}).
   *
   * @param float|array $length   the length or array of lengths to resolve
   * @param float       $ref_size  an absolute reference size to resolve percentage lengths
   * @return float
   */
  function length_in_pt($length, $ref_size = null) {

    if ( !is_array($length) )
      $length = array($length);

    if ( !isset($ref_size) )
      $ref_size = self::$default_font_size;

    $ret = 0;
    foreach ($length as $l) {

      if ( $l === "auto" ) 
        return "auto";
      
      if ( $l === "none" )
        return "none";

      // Assume numeric values are already in points
      if ( is_numeric($l) ) {
        $ret += $l;
        continue;
      }
        
      if ( $l === "normal" ) {
        $ret += $ref_size;
        continue;
      }

      // Border lengths
      if ( $l === "thin" ) {
        $ret += 0.5;
        continue;
      }
      
      if ( $l === "medium" ) {
        $ret += 1.5;
        continue;
      }
    
      if ( $l === "thick" ) {
        $ret += 2.5;
        continue;
      }
      
      if ( ($i = mb_strpos($l, "pt"))  !== false ) {
        $ret += mb_substr($l, 0, $i);
        continue;
      }

      if ( ($i = mb_strpos($l, "px"))  !== false ) {
        $ret += ( mb_substr($l, 0, $i)  * 72 ) / DOMPDF_DPI;
        continue;
      }

      if ( ($i = mb_strpos($l, "em"))  !== false ) {
        $ret += mb_substr($l, 0, $i) * $this->__get("font_size");
        continue;
      }
      
      // FIXME: em:ex ratio?
      if ( ($i = mb_strpos($l, "ex"))  !== false ) {
        $ret += mb_substr($l, 0, $i) * $this->__get("font_size");
        continue;
      }
      
      if ( ($i = mb_strpos($l, "%"))  !== false ) {
        $ret += mb_substr($l, 0, $i)/100 * $ref_size;
        continue;
      }
      
      if ( ($i = mb_strpos($l, "in")) !== false ) {
        $ret += mb_substr($l, 0, $i) * 72;
        continue;
      }
          
      if ( ($i = mb_strpos($l, "cm")) !== false ) {
        $ret += mb_substr($l, 0, $i) * 72 / 2.54;
        continue;
      }

      if ( ($i = mb_strpos($l, "mm")) !== false ) {
        $ret += mb_substr($l, 0, $i) * 72 / 25.4;
        continue;
      }
          
      if ( ($i = mb_strpos($l, "pc")) !== false ) {
        $ret += mb_substr($l, 0, $i) / 12;
        continue;
      }
          
      // Bogus value
      $ret += $ref_size;
    }

    return $ret;
  }

  
  /**
   * Set inherited properties in this style using values in $parent
   *
   * @param Style $parent
   */
  function inherit(Style $parent) {

    // Set parent font size
    $this->_parent_font_size = $parent->get_font_size();
    
    foreach (self::$_inherited as $prop) {
      //inherit the !important property also.
      //if local property is also !important, don't inherit.
      if ( isset($parent->_props[$prop]) &&
           ( !isset($this->_props[$prop]) ||
             ( isset($parent->_important_props[$prop]) && !isset($this->_important_props[$prop]) )
           )
         ) {
        if ( isset($parent->_important_props[$prop]) ) {
          $this->_important_props[$prop] = true;
        }
        //see __set and __get, on all assignments clear cache!
		$this->_prop_cache[$prop] = null;
		$this->_props[$prop] = $parent->_props[$prop];
      }
    }
      
    foreach (array_keys($this->_props) as $prop) {
      if ( $this->_props[$prop] == "inherit" ) {
        if ( isset($parent->_important_props[$prop]) ) {
          $this->_important_props[$prop] = true;
        }
        //do not assign direct, but
        //implicite assignment through __set, redirect to specialized, get value with __get
        //This is for computing defaults if the parent setting is also missing.
        //Therefore do not directly assign the value without __set
        //set _important_props before that to be able to propagate.
        //see __set and __get, on all assignments clear cache!
		//$this->_prop_cache[$prop] = null;
		//$this->_props[$prop] = $parent->_props[$prop];
        //props_set for more obvious explicite assignment not implemented, because
        //too many implicite uses.
        // $this->props_set($prop, $parent->$prop);
        $this->$prop = $parent->$prop;
      }
    }
          
    return $this;
  }

  
  /**
   * Override properties in this style with those in $style
   *
   * @param Style $style
   */
  function merge(Style $style) {
    //treat the !important attribute
    //if old rule has !important attribute, override with new rule only if
    //the new rule is also !important
    foreach($style->_props as $prop => $val ) {
      if (isset($style->_important_props[$prop])) {
 	    $this->_important_props[$prop] = true;
        //see __set and __get, on all assignments clear cache!
		$this->_prop_cache[$prop] = null;
 	    $this->_props[$prop] = $val;
 	  } else if ( !isset($this->_important_props[$prop]) ) {
        //see __set and __get, on all assignments clear cache!
		$this->_prop_cache[$prop] = null;
 	    $this->_props[$prop] = $val;
 	  }
 	}

    if ( isset($style->_props["font_size"]) )
      $this->__font_size_calculated = false;    
  }

  
  /**
   * Returns an array(r, g, b, "r"=> r, "g"=>g, "b"=>b, "hex"=>"#rrggbb")
   * based on the provided CSS colour value.
   *
   * @param string $colour
   * @return array
   */
  function munge_colour($colour) {
    if ( is_array($colour) )
      // Assume the array has the right format...
      // FIXME: should/could verify this.
      return $colour;
    
    $r = 0;
    $g = 0;
    $b = 0;

    // Handle colour names
    switch ($colour) {

    case "maroon":
      $r = 0x80;
      break;

    case "red":
      $r = 0xff;
      break;

    case "orange":
      $r = 0xff;
      $g = 0xa5;
      break;

    case "yellow":
      $r = 0xff;
      $g = 0xff;
      break;

    case "olive":
      $r = 0x80;
      $g = 0x80;
      break;

    case "purple":
      $r = 0x80;
      $b = 0x80;
      break;

    case "fuchsia":
      $r = 0xff;
      $b = 0xff;
      break;

    case "white":
      $r = $g = $b = 0xff;
      break;

    case "lime":
      $g = 0xff;
      break;

    case "green":
      $g = 0x80;
      break;

    case "navy":
      $b = 0x80;
      break;

    case "blue":
      $b = 0xff;
      break;

    case "aqua":
      $g = 0xff;
      $b = 0xff;
      break;

    case "teal":
      $g = 0x80;
      $b = 0x80;
      break;

    case "black":
      break;

    case "sliver":
      $r = $g = $b = 0xc0;
      break;

    case "gray":
    case "grey":
      $r = $g = $b = 0x80;
      break;

    case "transparent":
      return "transparent";
      
    default:
      if ( mb_strlen($colour) == 4 && $colour{0} == "#" ) {
        // #rgb format
        $r = hexdec($colour{1} . $colour{1});
        $g = hexdec($colour{2} . $colour{2});
        $b = hexdec($colour{3} . $colour{3});

      } else if ( mb_strlen($colour) == 7 && $colour{0} == "#" ) {
        // #rrggbb format
        $r = hexdec(mb_substr($colour, 1, 2));
        $g = hexdec(mb_substr($colour, 3, 2));
        $b = hexdec(mb_substr($colour, 5, 2));

      } else if ( mb_strpos($colour, "rgb") !== false ) {
        // rgb( r,g,b ) format
        $i = mb_strpos($colour, "(");
        $j = mb_strpos($colour, ")");
        
        // Bad colour value
        if ($i === false || $j === false)
          return null;

        $triplet = explode(",", mb_substr($colour, $i+1, $j-$i-1));

        if (count($triplet) != 3)
          return null;
        
        foreach (array_keys($triplet) as $c) {
          $triplet[$c] = trim($triplet[$c]);
          
          if ( $triplet[$c]{mb_strlen($triplet[$c]) - 1} == "%" ) 
            $triplet[$c] = round($triplet[$c] * 0.255);
        }

        list($r, $g, $b) = $triplet;

      } else {
        // Who knows?
        return null;
      }
      
      // Clip to 0 - 1
      $r = $r < 0 ? 0 : ($r > 255 ? 255 : $r);
      $g = $g < 0 ? 0 : ($g > 255 ? 255 : $g);
      $b = $b < 0 ? 0 : ($b > 255 ? 255 : $b);
      break;
      
    }
    
    // Form array
    $arr = array(0 => $r / 0xff, 1 => $g / 0xff, 2 => $b / 0xff,
                 "r"=>$r / 0xff, "g"=>$g / 0xff, "b"=>$b / 0xff,
                 "hex" => sprintf("#%02X%02X%02X", $r, $g, $b));
    return $arr;
      
  }

  
  /**
   * Alias for {@link Style::munge_colour()}
   *
   * @param string $color
   * @return array
   */
  function munge_color($color) { return $this->munge_colour($color); }

  /* direct access to _important_props array from outside would work only when declared as
   * 'var $_important_props;' instead of 'protected $_important_props;'
   * Don't call _set/__get on missing attribute. Therefore need a special access.
   * Assume that __set will be also called when this is called, so do not check validity again.
   * Only created, if !important exists -> always set true.
   */
  function important_set($prop) {
      $prop = str_replace("-", "_", $prop);
      $this->_important_props[$prop] = true;
  }

  function important_get($prop) {
      isset($this->_important_props[$prop]);
  }

  /**
   * PHP5 overloaded setter
   *
   * This function along with {@link Style::__get()} permit a user of the
   * Style class to access any (CSS) property using the following syntax:
   * <code>
   *  Style->margin_top = "1em";
   *  echo (Style->margin_top);
   * </code>
   *
   * __set() automatically calls the provided set function, if one exists,
   * otherwise it sets the property directly.  Typically, __set() is not
   * called directly from outside of this class.
   *
   * On each modification clear cache to return accurate setting.
   * Also affects direct settings not using __set
   * For easier finding all assignments, attempted to allowing only explicite assignment:
   * Very many uses, e.g. frame_reflower.cls.php -> for now leave as it is
   * function __set($prop, $val) {
   *   throw new DOMPDF_Exception("Implicite replacement of assignment by __set.  Not good.");
   * }
   * function props_set($prop, $val) { ... }
   *
   * @param string $prop  the property to set
   * @param mixed  $val   the value of the property
   * 
   */
  function __set($prop, $val) {
    global $_dompdf_warnings;

    $prop = str_replace("-", "_", $prop);
    $this->_prop_cache[$prop] = null;
    
    if ( !isset(self::$_defaults[$prop]) ) {
      $_dompdf_warnings[] = "'$prop' is not a valid CSS2 property.";
      return;
    }
    
    if ( $prop !== "content" && is_string($val) && mb_strpos($val, "url") === false ) {
      $val = mb_strtolower(trim(str_replace(array("\n", "\t"), array(" "), $val)));
      $val = preg_replace("/([0-9]+) (pt|px|pc|em|ex|in|cm|mm|%)/S", "\\1\\2", $val);
    }
    
    $method = "set_$prop";

    if ( method_exists($this, $method) )
      $this->$method($val);
    else 
      $this->_props[$prop] = $val;
    
  }

  /**
   * PHP5 overloaded getter
   *
   * Along with {@link Style::__set()} __get() provides access to all CSS
   * properties directly.  Typically __get() is not called directly outside
   * of this class.
   *
   * On each modification clear cache to return accurate setting.
   * Also affects direct settings not using __set
   *
   * @param string $prop
   * @return mixed
   */
  function __get($prop) {
    
    if ( !isset(self::$_defaults[$prop]) ) 
      throw new DOMPDF_Exception("'$prop' is not a valid CSS2 property.");

    if ( isset($this->_prop_cache[$prop]) && $this->_prop_cache[$prop] != null)
      return $this->_prop_cache[$prop];
    
    $method = "get_$prop";

    // Fall back on defaults if property is not set
    if ( !isset($this->_props[$prop]) )
      $this->_props[$prop] = self::$_defaults[$prop];

    if ( method_exists($this, $method) )
      return $this->_prop_cache[$prop] = $this->$method();


    return $this->_prop_cache[$prop] = $this->_props[$prop];
  }


  /**
   * Getter for the 'font-family' CSS property.
   *
   * Uses the {@link Font_Metrics} class to resolve the font family into an
   * actual font file.
   *
   * @link http://www.w3.org/TR/CSS21/fonts.html#propdef-font-family
   * @return string
   */
  function get_font_family() {
  
    $DEBUGCSS=DEBUGCSS; //=DEBUGCSS; Allow override of global setting for ad hoc debug
	
    // Select the appropriate font.  First determine the subtype, then check
    // the specified font-families for a candidate.

    // Resolve font-weight
    $weight = $this->__get("font_weight");
    
    if ( is_numeric($weight) ) {

      if ( $weight < 600 )
        $weight = "normal";
      else
        $weight = "bold";

    } else if ( $weight === "bold" || $weight === "bolder" ) {
      $weight = "bold";

    } else {
      $weight = "normal";

    }

    // Resolve font-style
    $font_style = $this->__get("font_style");

    if ( $weight === "bold" && ($font_style === "italic" || $font_style === "oblique") )
      $subtype = "bold_italic";
    else if ( $weight === "bold" && $font_style !== "italic" && $font_style !== "oblique" )
      $subtype = "bold";
    else if ( $weight !== "bold" && ($font_style === "italic" || $font_style === "oblique") )
      $subtype = "italic";
    else
      $subtype = "normal";
    
    // Resolve the font family
    if ($DEBUGCSS) {
      print "<pre>[get_font_family:";
      print '('.$this->_props["font_family"].'.'.$font_style.'.'.$this->__get("font_weight").'.'.$weight.'.'.$subtype.')';
    }
    $families = explode(",", $this->_props["font_family"]);
    $families = array_map('trim',$families);
    reset($families);

    $font = null;
    while ( current($families) ) {
      list(,$family) = each($families);
      //remove leading and trailing string delimiters, e.g. on font names with spaces;
      //remove leading and trailing whitespace
      $family=trim($family," \t\n\r\x0B\"'");
      if ($DEBUGCSS) print '('.$family.')';
      $font = Font_Metrics::get_font($family, $subtype);

      if ( $font ) {
        if ($DEBUGCSS)  print '('.$font.")get_font_family]\n</pre>";
        return $font;
      }
    }

    $family = null;
    if ($DEBUGCSS)  print '(default)';
    $font = Font_Metrics::get_font($family, $subtype);

    if ( $font ) {
      if ($DEBUGCSS) print '('.$font.")get_font_family]\n</pre>";
      return $font;
    }
    throw new DOMPDF_Exception("Unable to find a suitable font replacement for: '" . $this->_props["font_family"] ."'");
    
  }

  /**
   * Returns the resolved font size, in points
   *
   * @link http://www.w3.org/TR/CSS21/fonts.html#propdef-font-size   
   * @return float
   */
  function get_font_size() {

    if ( $this->__font_size_calculated )
      return $this->_props["font_size"];
    
    if ( !isset($this->_props["font_size"]) )
      $fs = self::$_defaults["font_size"];
    else 
      $fs = $this->_props["font_size"];
    
    if ( !isset($this->_parent_font_size) )
      $this->_parent_font_size = self::$default_font_size;
    
    switch ($fs) {
      
    case "xx-small":
      $fs = 3/5 * $this->_parent_font_size;
      break;

    case "x-small":
      $fs = 3/4 * $this->_parent_font_size;
      break;

    case "smaller":
    case "small":
      $fs = 8/9 * $this->_parent_font_size;
      break;

    case "medium":
      $fs = $this->_parent_font_size;
      break;

    case "larger":
    case "large":
      $fs = 6/5 * $this->_parent_font_size;
      break;

    case "x-large":
      $fs = 3/2 * $this->_parent_font_size;
      break;

    case "xx-large":
      $fs = 2/1 * $this->_parent_font_size;
      break;

    default:
      break;
    }

    // Ensure relative sizes resolve to something
    if ( ($i = mb_strpos($fs, "em")) !== false ) 
      $fs = mb_substr($fs, 0, $i) * $this->_parent_font_size;

    else if ( ($i = mb_strpos($fs, "ex")) !== false ) 
      $fs = mb_substr($fs, 0, $i) * $this->_parent_font_size;

    else
      $fs = $this->length_in_pt($fs);

    //see __set and __get, on all assignments clear cache!
	$this->_prop_cache["font_size"] = null;
    $this->_props["font_size"] = $fs;
    $this->__font_size_calculated = true;
    return $this->_props["font_size"];

  }

  /**
   * @link http://www.w3.org/TR/CSS21/text.html#propdef-word-spacing
   * @return float
   */
  function get_word_spacing() {
    if ( $this->_props["word_spacing"] === "normal" )
      return 0;

    return $this->_props["word_spacing"];
  }

  /**
   * @link http://www.w3.org/TR/CSS21/visudet.html#propdef-line-height
   * @return float
   */
  function get_line_height() {
    if ( $this->_props["line_height"] === "normal" )
      return self::$default_line_height * $this->get_font_size();

    if ( is_numeric($this->_props["line_height"]) ) 
      return $this->length_in_pt( $this->_props["line_height"] . "%", $this->get_font_size());
    
    return $this->length_in_pt( $this->_props["line_height"], $this->get_font_size() );
  }

  /**
   * Returns the colour as an array
   *
   * The array has the following format:
   * <code>array(r,g,b, "r" => r, "g" => g, "b" => b, "hex" => "#rrggbb")</code>
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-color
   * @return array
   */
  function get_color() {
    return $this->munge_color( $this->_props["color"] );
  }

  /**
   * Returns the background colour as an array
   *
   * The returned array has the same format as {@link Style::get_color()}
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-color
   * @return array
   */
  function get_background_color() {
    return $this->munge_color( $this->_props["background_color"] );
  }
  
  /**
   * Returns the background position as an array
   *
   * The returned array has the following format:
   * <code>array(x,y, "x" => x, "y" => y)</code>
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-position
   * @return array
   */
  function get_background_position() {
    
    $tmp = explode(" ", $this->_props["background_position"]);

    switch ($tmp[0]) {

    case "left":
      $x = "0%";
      break;

    case "right":
      $x = "100%";
      break;

    case "top":
      $y = "0%";
      break;

    case "bottom":
      $y = "100%";
      break;

    case "center":
      $x = "50%";
      $y = "50%";
      break;

    default:
      $x = $tmp[0];
      break;
    }

    if ( isset($tmp[1]) ) {

      switch ($tmp[1]) {
      case "left":
        $x = "0%";
        break;
        
      case "right":
        $x = "100%";
        break;
        
      case "top":
        $y = "0%";
        break;
        
      case "bottom":
        $y = "100%";
        break;
        
      case "center":
        if ( $tmp[0] == "left" || $tmp[0] == "right" || $tmp[0] == "center" )
          $y = "50%";
        else
          $x = "50%";
        break;
        
      default:
        $y = $tmp[1];
        break;
      }

    } else {
      $y = "50%";
    }

    if ( !isset($x) )
      $x = "0%";

    if ( !isset($y) )
      $y = "0%";

    return array( 0 => $x, "x" => $x,
                  1 => $y, "y" => $y );
  }


  /**
   * Returns the background as it is currently stored
   *
   * (currently anyway only for completeness.
   * not used for further processing)
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-attachment
   * @return string
   */
  function get_background_attachment() {
    return $this->_props["background_attachment"];
  }


  /**
   * Returns the background_repeat as it is currently stored
   *
   * (currently anyway only for completeness.
   * not used for further processing)
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-repeat
   * @return string
   */
  function get_background_repeat() {
    return $this->_props["background_repeat"];
  }


  /**
   * Returns the background as it is currently stored
   *
   * (currently anyway only for completeness.
   * not used for further processing, but the individual get_background_xxx)
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background
   * @return string
   */
  function get_background() {
    return $this->_props["background"];
  }


  /**#@+
   * Returns the border colour as an array
   *
   * See {@link Style::get_color()}
   *
   * @link http://www.w3.org/TR/CSS21/box.html#border-color-properties
   * @return array
   */
  function get_border_top_color() {
    if ( $this->_props["border_top_color"] === "" ) {
      //see __set and __get, on all assignments clear cache!
      $this->_prop_cache["border_top_color"] = null;
      $this->_props["border_top_color"] = $this->__get("color");
    }
    return $this->munge_color($this->_props["border_top_color"]);
  }

  function get_border_right_color() {
    if ( $this->_props["border_right_color"] === "" ) {
      //see __set and __get, on all assignments clear cache!
      $this->_prop_cache["border_right_color"] = null;
      $this->_props["border_right_color"] = $this->__get("color");
    }
    return $this->munge_color($this->_props["border_right_color"]);
  }

  function get_border_bottom_color() {
    if ( $this->_props["border_bottom_color"] === "" ) {
      //see __set and __get, on all assignments clear cache!
      $this->_prop_cache["border_bottom_color"] = null;
      $this->_props["border_bottom_color"] = $this->__get("color");
    }
    return $this->munge_color($this->_props["border_bottom_color"]);;
  }

  function get_border_left_color() {
    if ( $this->_props["border_left_color"] === "" ) {
      //see __set and __get, on all assignments clear cache!
      $this->_prop_cache["border_left_color"] = null;
      $this->_props["border_left_color"] = $this->__get("color");
    }
    return $this->munge_color($this->_props["border_left_color"]);
  }
  
  /**#@-*/

 /**#@+
   * Returns the border width, as it is currently stored
   *
   * @link http://www.w3.org/TR/CSS21/box.html#border-width-properties
   * @return float|string   
   */
  function get_border_top_width() {
    $style = $this->__get("border_top_style");
    return $style !== "none" && $style !== "hidden" ? $this->length_in_pt($this->_props["border_top_width"]) : 0;
  }
  
  function get_border_right_width() {
    $style = $this->__get("border_right_style");    
    return $style !== "none" && $style !== "hidden" ? $this->length_in_pt($this->_props["border_right_width"]) : 0;
  }

  function get_border_bottom_width() {
    $style = $this->__get("border_bottom_style");
    return $style !== "none" && $style !== "hidden" ? $this->length_in_pt($this->_props["border_bottom_width"]) : 0;
  }

  function get_border_left_width() {
    $style = $this->__get("border_left_style");
    return $style !== "none" && $style !== "hidden" ? $this->length_in_pt($this->_props["border_left_width"]) : 0;
  }
  /**#@-*/

  /**
   * Return an array of all border properties.
   *
   * The returned array has the following structure:
   * <code>
   * array("top" => array("width" => [border-width],
   *                      "style" => [border-style],
   *                      "color" => [border-color (array)]),
   *       "bottom" ... )
   * </code>
   *
   * @return array
   */
  function get_border_properties() {
    return array("top" => array("width" => $this->__get("border_top_width"),
                                "style" => $this->__get("border_top_style"),
                                "color" => $this->__get("border_top_color")),
                 "bottom" => array("width" => $this->__get("border_bottom_width"),
                                   "style" => $this->__get("border_bottom_style"),
                                   "color" => $this->__get("border_bottom_color")),
                 "right" => array("width" => $this->__get("border_right_width"),
                                  "style" => $this->__get("border_right_style"),
                                  "color" => $this->__get("border_right_color")),
                 "left" => array("width" => $this->__get("border_left_width"),
                                 "style" => $this->__get("border_left_style"),
                                 "color" => $this->__get("border_left_color")));
  }

  /**
   * Return a single border property
   *
   * @return mixed
   */
  protected function _get_border($side) {
    $color = $this->__get("border_" . $side . "_color");
    
    return $this->__get("border_" . $side . "_width") . " " .
      $this->__get("border_" . $side . "_style") . " " . $color["hex"];
  }

  /**#@+
   * Return full border properties as a string
   *
   * Border properties are returned just as specified in CSS:
   * <pre>[width] [style] [color]</pre>
   * e.g. "1px solid blue"
   *
   * @link http://www.w3.org/TR/CSS21/box.html#border-shorthand-properties
   * @return string
   */
  function get_border_top() { return $this->_get_border("top"); }
  function get_border_right() { return $this->_get_border("right"); }
  function get_border_bottom() { return $this->_get_border("bottom"); }
  function get_border_left() { return $this->_get_border("left"); }
  /**#@-*/


  /**
   * Returns border spacing as an array
   *
   * The array has the format (h_space,v_space)
   *
   * @link http://www.w3.org/TR/CSS21/tables.html#propdef-border-spacing
   * @return array
   */
  function get_border_spacing() {
    return explode(" ", $this->_props["border_spacing"]);
  }

/*==============================*/

  /*
   !important attribute
   For basic functionality of the !important attribute with overloading
   of several styles of an element, changes in inherit(), merge() and _parse_properties()
   are sufficient [helpers var $_important_props, __construct(), important_set(), important_get()]

   Only for combined attributes extra treatment needed. See below.

   div { border: 1px red; }
   div { border: solid; } // Not combined! Only one occurence of same style per context
   //
   div { border: 1px red; }
   div a { border: solid; } // Adding to border style ok by inheritance
   //
   div { border-style: solid; } // Adding to border style ok because of different styles
   div { border: 1px red; }
   //
   div { border-style: solid; !important} // border: overrides, even though not !important
   div { border: 1px dashed red; }
   //
   div { border: 1px red; !important }
   div a { border-style: solid; } // Need to override because not set

   Special treatment:
   At individual property like border-top-width need to check whether overriding value is also !important.
   Also store the !important condition for later overrides.
   Since not known who is initiating the override, need to get passed !importan as parameter.
   !important Paramter taken as in the original style in the css file.
   When poperty border !important given, do not mark subsets like border_style as important. Only
   individual properties.

   Note:
   Setting individual property directly from css with e.g. set_border_top_style() is not needed, because
   missing set funcions handled by a generic handler __set(), including the !important.
   Setting individual property of as sub-property is handled below.

   Implementation see at _set_style_side_type()
   Callers _set_style_sides_type(), _set_style_type, _set_style_type_important()

   Related functionality for background, padding, margin, font, list_style
  */

  /* Generalized set function for individual attribute of combined style.
   * With check for !important
   * Applicable for background, border, padding, margin, font, list_style
   * Note: $type has a leading underscore (or is empty), the others not.
   */
  protected function _set_style_side_type($style,$side,$type,$val,$important) {
    if ( !isset($this->_important_props[$style.'_'.$side.$type]) || $important) {
      //see __set and __get, on all assignments clear cache!
      $this->_prop_cache[$style.'_'.$side.$type] = null;
      if ($important) {
        $this->_important_props[$style.'_'.$side.$type] = true;
      }
      $this->_props[$style.'_'.$side.$type] = $val;
    }
  }

  protected function _set_style_sides_type($style,$top,$right,$bottom,$left,$type,$important) {
      $this->_set_style_side_type($style,'top',$type,$top,$important);
      $this->_set_style_side_type($style,'right',$type,$right,$important);
      $this->_set_style_side_type($style,'bottom',$type,$bottom,$important);
      $this->_set_style_side_type($style,'left',$type,$left,$important);
  }

  protected function _set_style_type($style,$type,$val,$important) {
    $arr = explode(" ", $val);
    switch (count($arr)) {
    case 1:
      $this->_set_style_sides_type($style,$arr[0],$arr[0],$arr[0],$arr[0],$type,$important);
      break;
    case 2:
      $this->_set_style_sides_type($style,$arr[0],$arr[1],$arr[0],$arr[1],$type,$important);
      break;
    case 3:
      $this->_set_style_sides_type($style,$arr[0],$arr[1],$arr[1],$arr[2],$type,$important);
      break;
    case 4:
      $this->_set_style_sides_type($style,$arr[0],$arr[1],$arr[2],$arr[3],$type,$important);
      break;
    default:
      break;
    }
    //see __set and __get, on all assignments clear cache!
	$this->_prop_cache[$style.$type] = null;
    $this->_props[$style.$type] = $val;
  }

  protected function _set_style_type_important($style,$type,$val) {
    $this->_set_style_type($style,$type,$val,isset($this->_important_props[$style.$type]));
  }

  /* Anyway only called if _important matches and is assigned
   * E.g. _set_style_side_type($style,$side,'',str_replace("none", "0px", $val),isset($this->_important_props[$style.'_'.$side]));
   */
  protected function _set_style_side_width_important($style,$side,$val) {
    //see __set and __get, on all assignments clear cache!
    $this->_prop_cache[$style.'_'.$side] = null;
    $this->_props[$style.'_'.$side] = str_replace("none", "0px", $val);
  }

  protected function _set_style($style,$val,$important) {
    if ( !isset($this->_important_props[$style]) || $important) {
      if ($important) {
        $this->_important_props[$style] = true;
      }
      //see __set and __get, on all assignments clear cache!
	  $this->_prop_cache[$style] = null;
      $this->_props[$style] = $val;
    }
  }

  protected function _image($val) {
    $DEBUGCSS=DEBUGCSS;
    
    if ( mb_strpos($val, "url") === false ) {
      $path = "none"; //Don't resolve no image -> otherwise would prefix path and no longer recognize as none
    }
    else {
      $val = preg_replace("/url\(['\"]?([^'\")]+)['\"]?\)/","\\1", trim($val));

      // Resolve the url now in the context of the current stylesheet
      $parsed_url = explode_url($val);
      if ( $parsed_url["protocol"] == "" && $this->_stylesheet->get_protocol() == "" ) {
        if ($parsed_url["path"]{0} == '/' || $parsed_url["path"]{0} == '\\' ) {
          $path = $_SERVER["DOCUMENT_ROOT"].'/';
        } else {
          $path = $this->_stylesheet->get_base_path();
        }
        $path .= $parsed_url["path"] . $parsed_url["file"];
        $path = dompdf_realpath($path);
      } else {
        $path = build_url($this->_stylesheet->get_protocol(),
                          $this->_stylesheet->get_host(),
                          $this->_stylesheet->get_base_path(),
                          $val);
      }
    }
    if ($DEBUGCSS) {
      print "<pre>[_image\n";
      print_r($parsed_url);
      print $this->_stylesheet->get_protocol()."\n".$this->_stylesheet->get_base_path()."\n".$path."\n";
      print "_image]</pre>";;
    }
    return $path;
  }

/*======================*/

  /**
   * Sets colour
   *
   * The colour parameter can be any valid CSS colour value
   *   
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-color
   * @param string $colour
   */
  function set_color($colour) {
    $col = $this->munge_colour($colour);

    if ( is_null($col) )
      $col = self::$_defaults["color"];

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["color"] = null;
    $this->_props["color"] = $col["hex"];
  }

  /**
   * Sets the background colour
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-color
   * @param string $colour
   */
  function set_background_color($colour) {
    $col = $this->munge_colour($colour);
    if ( is_null($col) )
      $col = self::$_defaults["background_color"];

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["background_color"] = null;
    $this->_props["background_color"] = is_array($col) ? $col["hex"] : $col;
  }

  /**
   * Set the background image url
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#background-properties
   * @param string $url
   */
  function set_background_image($val) {
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["background_image"] = null;
    $this->_props["background_image"] = $this->_image($val);
  }

  /**
   * Sets the background repeat
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-repeat
   * @param string $val
   */
  function set_background_repeat($val) {
    if ( is_null($val) )
      $val = self::$_defaults["background_repeat"];
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
    $this->_prop_cache["background_repeat"] = null;
    $this->_props["background_repeat"] = $val;
  }

  /**
   * Sets the background attachment
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-attachment
   * @param string $val
   */
  function set_background_attachment($val) {
    if ( is_null($val) )
      $val = self::$_defaults["background_attachment"];

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["background_attachment"] = null;
    $this->_props["background_attachment"] = $val;
  }

  /**
   * Sets the background position
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background-position
   * @param string $val
   */
  function set_background_position($val) {
    if ( is_null($val) )
      $val = self::$_defaults["background_position"];

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["background_position"] = null;
    $this->_props["background_position"] = $val;
  }

  /**
   * Sets the background - combined options
   *
   * @link http://www.w3.org/TR/CSS21/colors.html#propdef-background
   * @param string $val
   */
  function set_background($val) {
    $col = null;
    $pos = array();
    $tmp = explode(" ", $val);
    $important = isset($this->_important_props["background"]);
    foreach($tmp as $attr) {
	  if (mb_substr($attr, 0, 3) == "url" || $attr === "none") {
   	    $this->_set_style("background_image", $this->_image($attr), $important);
  	  } else if ($attr === "fixed" || $attr === "scroll") {
   	    $this->_set_style("background_attachment", $attr, $important);
  	  } else if ($attr === "repeat" || $attr === "repeat-x" || $attr === "repeat-y" || $attr === "no-repeat") {
   	    $this->_set_style("background_repeat", $attr, $important);
      } else if (($col = $this->munge_color($attr)) != null ) {
   	    $this->_set_style("background_color", is_array($col) ? $col["hex"] : $col, $important);
      } else {
 		$pos[] = $attr;
 	  }
 	}
 	if (count($pos)) {
 	  $this->_set_style("background_position",implode(' ',$pos), $important);
 	}
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["background"] = null;
 	$this->_props["background"] = $val;
  }

  /**
   * Sets the font size
   *
   * $size can be any acceptable CSS size
   *
   * @link http://www.w3.org/TR/CSS21/fonts.html#propdef-font-size
   * @param string|float $size
   */
  function set_font_size($size) {
    $this->__font_size_calculated = false;
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["font_size"] = null;
    $this->_props["font_size"] = $size;
  }

  /**
   * Sets the font style
   *
   * combined attributes
   * set individual attributes also, respecting !important mark
   * exactly this order, separate by space. Multiple fonts separated by comma:
   * font-style, font-variant, font-weight, font-size, line-height, font-family
   *
   * Other than with border and list, existing partial attributes should
   * reset when starting here, even when not mentioned.
   * If individual attribute is !important and explicite or implicite replacement is not,
   * keep individual attribute
   *
   * require whitespace as delimiters for single value attributes
   * On delimiter "/" treat first as font height, second as line height
   * treat all remaining at the end of line as font
   * font-style, font-variant, font-weight, font-size, line-height, font-family
   *
   * missing font-size and font-family might be not allowed, but accept it here and
   * use default (medium size, enpty font name)
   *
   * @link http://www.w3.org/TR/CSS21/generate.html#propdef-list-style
   * @param $val
   */
  function set_font($val) {
    $this->__font_size_calculated = false;
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["font"] = null;
 	$this->_props["font"] = $val;

    $important = isset($this->_important_props["font"]);

	if ( preg_match("/^(italic|oblique|normal)\s*(.*)$/i",$val,$match) ) {
		$this->_set_style("font_style", $match[1], $important);
		$val = $match[2];
	} else {
		$this->_set_style("font_style", self::$_defaults["font_style"], $important);
	}

	if ( preg_match("/^(small-caps|normal)\s*(.*)$/i",$val,$match) ) {
		$this->_set_style("font_variant", $match[1], $important);
		$val = $match[2];
	} else {
		$this->_set_style("font_variant", self::$_defaults["font_variant"], $important);
	}

    //matching numeric value followed by unit -> this is indeed a subsequent font size. Skip!
	if ( preg_match("/^(bold|bolder|lighter|100|200|300|400|500|600|700|800|900|normal)\s*(.*)$/i",$val,$match) &&
         !preg_match("/^(?:pt|px|pc|em|ex|in|cm|mm|%)/",$match[2])
	   ) {
		$this->_set_style("font_weight", $match[1], $important);
		$val = $match[2];
	} else {
		$this->_set_style("font_weight", self::$_defaults["font_weight"], $important);
	}

	if ( preg_match("/^(xx-small|x-small|small|medium|large|x-large|xx-large|smaller|larger|\d+\s*(?:pt|px|pc|em|ex|in|cm|mm|%))\s*(.*)$/i",$val,$match) ) {
		$this->_set_style("font_size", $match[1], $important);
		$val = $match[2];
        if (preg_match("/^\/\s*(\d+\s*(?:pt|px|pc|em|ex|in|cm|mm|%))\s*(.*)$/i",$val,$match) ) {
			$this->_set_style("line_height", $match[1], $important);
			$val = $match[2];
        } else {
			$this->_set_style("line_height", self::$_defaults["line_height"], $important);
        }
	} else {
 		$this->_set_style("font_size", self::$_defaults["font_size"], $important);
		$this->_set_style("line_height", self::$_defaults["line_height"], $important);
	}

	if(strlen($val) != 0) {
	  $this->_set_style("font_family", $val, $important);
	} else {
	  $this->_set_style("font_family", self::$_defaults["font_family"], $important);
	}
  }

  /**#@+
   * Sets page break properties
   *
   * @link http://www.w3.org/TR/CSS21/page.html#page-breaks
   * @param string $break
   */
  function set_page_break_before($break) {
    if ($break === "left" || $break === "right")
      $break = "always";

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["page_break_before"] = null;
    $this->_props["page_break_before"] = $break;
  }

  function set_page_break_after($break) {
    if ($break === "left" || $break === "right")
      $break = "always";

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["page_break_after"] = null;
    $this->_props["page_break_after"] = $break;
  }
  /**#@-*/
    
  //........................................................................

  /**#@+
   * Sets the margin size
   *
   * @link http://www.w3.org/TR/CSS21/box.html#margin-properties
   * @param $val
   */
  function set_margin_top($val) {
    $this->_set_style_side_width_important('margin','top',$val);
  }

  function set_margin_right($val) {
    $this->_set_style_side_width_important('margin','right',$val);
  }

  function set_margin_bottom($val) {
    $this->_set_style_side_width_important('margin','bottom',$val);
  }

  function set_margin_left($val) {
    $this->_set_style_side_width_important('margin','left',$val);
  }
  
  function set_margin($val) {
    $val = str_replace("none", "0px", $val);
    $this->_set_style_type_important('margin','',$val);
  }
  /**#@-*/

  /**#@+
   * Sets the padding size
   *
   * @link http://www.w3.org/TR/CSS21/box.html#padding-properties
   * @param $val
   */
  function set_padding_top($val) {
    $this->_set_style_side_width_important('padding','top',$val);
  }

  function set_padding_right($val) {
    $this->_set_style_side_width_important('padding','right',$val);
  }

  function set_padding_bottom($val) {
    $this->_set_style_side_width_important('padding','bottom',$val);
  }

  function set_padding_left($val) {
    $this->_set_style_side_width_important('padding','left',$val);
  }

  function set_padding($val) {
    $val = str_replace("none", "0px", $val);
    $this->_set_style_type_important('padding','',$val);
  }
  /**#@-*/

  /**
   * Sets a single border
   *
   * @param string $side
   * @param string $border_spec  ([width] [style] [color])
   */
  protected function _set_border($side, $border_spec, $important) {
    $border_spec = str_replace(",", " ", $border_spec);
    $arr = explode(" ", $border_spec);

    // FIXME: handle partial values
 
    //For consistency of individal and combined properties, and with ie8 and firefox3
    //reset all attributes, even if only partially given   
    $this->_set_style_side_type('border',$side,'_style',self::$_defaults['border_'.$side.'_style'],$important);
    $this->_set_style_side_type('border',$side,'_width',self::$_defaults['border_'.$side.'_width'],$important);
    $this->_set_style_side_type('border',$side,'_color',self::$_defaults['border_'.$side.'_color'],$important);

    foreach ($arr as $value) {
      $value = trim($value);
      if ( in_array($value, self::$BORDER_STYLES) ) {
        $this->_set_style_side_type('border',$side,'_style',$value,$important);

      } else if ( preg_match("/[.0-9]+(?:px|pt|pc|em|ex|%|in|mm|cm)|(?:thin|medium|thick)/", $value ) ) {
        $this->_set_style_side_type('border',$side,'_width',$value,$important);

      } else {
        // must be colour
        $this->_set_style_side_type('border',$side,'_color',$value,$important);
      }
    }

    //see __set and __get, on all assignments clear cache!
	$this->_prop_cache['border_'.$side] = null;
    $this->_props['border_'.$side] = $border_spec;
  }

  /**#@+
   * Sets the border styles
   *
   * @link http://www.w3.org/TR/CSS21/box.html#border-properties
   * @param string $val
   */
  function set_border_top($val) { $this->_set_border("top", $val, isset($this->_important_props['border_top'])); }
  function set_border_right($val) { $this->_set_border("right", $val, isset($this->_important_props['border_right'])); }
  function set_border_bottom($val) { $this->_set_border("bottom", $val, isset($this->_important_props['border_bottom'])); }
  function set_border_left($val) { $this->_set_border("left", $val, isset($this->_important_props['border_left'])); }

  function set_border($val) {
    $important = isset($this->_important_props["border"]);
    $this->_set_border("top", $val, $important);
    $this->_set_border("right", $val, $important);
    $this->_set_border("bottom", $val, $important);
    $this->_set_border("left", $val, $important);
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["border"] = null;
    $this->_props["border"] = $val;
  }

  function set_border_width($val) {
    $this->_set_style_type_important('border','_width',$val);
  }

  function set_border_color($val) {
    $this->_set_style_type_important('border','_color',$val);
  }

  function set_border_style($val) {
    $this->_set_style_type_important('border','_style',$val);
  }
  /**#@-*/


  /**
   * Sets the border spacing
   *
   * @link http://www.w3.org/TR/CSS21/box.html#border-properties
   * @param float $val
   */
  function set_border_spacing($val) {

    $arr = explode(" ", $val);

    if ( count($arr) == 1 )
      $arr[1] = $arr[0];

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["border_spacing"] = null;
    $this->_props["border_spacing"] = $arr[0] . " " . $arr[1];
  }

  /**
   * Sets the list style image
   *
   * @link http://www.w3.org/TR/CSS21/generate.html#propdef-list-style-image
   * @param $val
   */
  function set_list_style_image($val) {
    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["list_style_image"] = null;
    $this->_props["list_style_image"] = $this->_image($val);
  }

  /**
   * Sets the list style
   *
   * @link http://www.w3.org/TR/CSS21/generate.html#propdef-list-style
   * @param $val
   */
  function set_list_style($val) {
    $important = isset($this->_important_props["list_style"]);
    $arr = explode(" ", str_replace(",", " ", $val));

    static $types = array("disc", "circle", "square", "decimal",
                   "decimal-leading-zero", "lower-roman",
                   "upper-roman", "lower-greek", "lower-latin",
                   "upper-latin", "armenian", "georgian",
                   "lower-alpha", "upper-alpha", "hebrew",
                   "cjk-ideographic", "hiragana", "katakana",
                   "hiragana-iroha", "katakana-iroha", "none");

    static $positions = array("inside", "outside");

    foreach ($arr as $value) {
      /* http://www.w3.org/TR/CSS21/generate.html#list-style
       * A value of 'none' for the 'list-style' property sets both 'list-style-type' and 'list-style-image' to 'none'
       */
      if ($value === "none") {
   	    $this->_set_style("list_style_type", $value, $important);
   	    $this->_set_style("list_style_image", $value, $important);
        continue;
      }

      //On setting or merging or inheriting list_style_image as well as list_style_type,
      //and url exists, then url has precedence, otherwise fall back to list_style_type
      //Firefox is wrong here (list_style_image gets overwritten on explicite list_style_type)
      //Internet Explorer 7/8 and dompdf is right.
       
	  if (mb_substr($value, 0, 3) == "url") {
   	    $this->_set_style("list_style_image", $this->_image($value), $important);
        continue;
      }

      if ( in_array($value, $types) ) {
   	    $this->_set_style("list_style_type", $value, $important);
      } else if ( in_array($value, $positions) ) {
   	    $this->_set_style("list_style_position", $value, $important);
      }
    }

    //see __set and __get, on all assignments clear cache, not needed on direct set through __set
	$this->_prop_cache["list_style"] = null;
 	$this->_props["list_style"] = $val;
  }

  /**
   * Generate a string representation of the Style
   *
   * This dumps the entire property array into a string via print_r.  Useful
   * for debugging.
   *
   * @return string
   */
 /*DEBUGCSS print: see below additional debugging util*/
  function __toString() {
    return print_r(array_merge(array("parent_font_size" => $this->_parent_font_size),
                               $this->_props), true);
  }

/*DEBUGCSS*/  function debug_print()
/*DEBUGCSS*/  {
/*DEBUGCSS*/    print "parent_font_size:".$this->_parent_font_size . ";\n";
/*DEBUGCSS*/    foreach($this->_props as $prop => $val ) {
/*DEBUGCSS*/      print $prop.':'.$val;
/*DEBUGCSS*/      if (isset($this->_important_props[$prop])) {
/*DEBUGCSS*/      	print '!important';
/*DEBUGCSS*/      }
/*DEBUGCSS*/      print ";\n";
/*DEBUGCSS*/    }
/*DEBUGCSS*/  }
}
?>



// test3.php
<?php
/**
 * Zend Framework
 *
 * LICENSE
 *
 * This source file is subject to the new BSD license that is bundled
 * with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://framework.zend.com/license/new-bsd
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@zend.com so we can send you a copy immediately.
 *
 * @category  Zend
 * @package   Zend_Date
 * @copyright Copyright (c) 2005-2008 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd     New BSD License
 * @version   $Id: Date.php 13373 2008-12-19 12:22:49Z thomas $
 */

/**
 * Include needed Date classes
 */


/**
 * @category  Zend
 * @package   Zend_Date
 * @copyright Copyright (c) 2005-2008 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd     New BSD License
 */
class Zend_Date extends Zend_Date_DateObject
{
    private $_locale  = null;

    // Fractional second variables
    private $_fractional = 0;
    private $_precision  = 3;

    private static $_options = array(
        'format_type'  => 'iso',      // format for date strings 'iso' or 'php'
        'fix_dst'      => true,       // fix dst on summer/winter time change
        'extend_month' => false,      // false - addMonth like SQL, true like excel
        'cache'        => null,       // cache to set
        'timesync'     => null        // timesync server to set
    );

    // Class wide Date Constants
    // day formats
    const DAY            = 'DAY';            // d - 2 digit day of month, 01-31
    const DAY_SHORT      = 'DAY_SHORT';      // j - 1,2 digit day of month, 1-31

    const DAY_SUFFIX     = 'DAY_SUFFIX';     // S - english suffix day of month, st-th
    const DAY_OF_YEAR    = 'DAY_OF_YEAR';    // z - Number of day of year

    const WEEKDAY        = 'WEEKDAY';        // l - full day name - locale aware, Monday - Sunday
    const WEEKDAY_SHORT  = 'WEEKDAY_SHORT';  // --- 3 letter day of week - locale aware, Mon-Sun
    const WEEKDAY_NARROW = 'WEEKDAY_NARROW'; // --- 1 letter day name - locale aware, M-S
    const WEEKDAY_NAME   = 'WEEKDAY_NAME';   // D - abbreviated day name, 1-3 letters - locale aware, Mon-Sun

    const WEEKDAY_8601   = 'WEEKDAY_8601';   // N - digit weekday ISO 8601, 1-7 1 = monday, 7=sunday
    const WEEKDAY_DIGIT  = 'WEEKDAY_DIGIT';  // w - weekday, 0-6 0=sunday, 6=saturday

    // week formats
    const WEEK           = 'WEEK';           // W - number of week ISO8601, 1-53

    // month formats
    const MONTH          = 'MONTH';          // m - 2 digit month, 01-12
    const MONTH_SHORT    = 'MONTH_SHORT';    // n - 1 digit month, no leading zeros, 1-12

    const MONTH_DAYS     = 'MONTH_DAYS';     // t - Number of days this month

    const MONTH_NAME        = 'MONTH_NAME';         // F - full month name - locale aware, January-December
    const MONTH_NAME_SHORT  = 'MONTH_NAME_SHORT';  // M - 3 letter monthname - locale aware, Jan-Dec
    const MONTH_NAME_NARROW = 'MONTH_NAME_NARROW'; // --- 1 letter month name - locale aware, J-D

    // year formats
    const YEAR           = 'YEAR';           // Y - 4 digit year
    const YEAR_SHORT     = 'YEAR_SHORT';     // y - 2 digit year, leading zeros 00-99

    const YEAR_8601      = 'YEAR_8601';      // o - number of year ISO8601
    const YEAR_SHORT_8601= 'YEAR_SHORT_8601';// --- 2 digit number of year ISO8601

    const LEAPYEAR       = 'LEAPYEAR';       // L - is leapyear ?, 0-1

    // time formats
    const MERIDIEM       = 'MERIDIEM';       // A,a - AM/PM - locale aware, AM/PM
    const SWATCH         = 'SWATCH';         // B - Swatch Internet Time

    const HOUR           = 'HOUR';           // H - 2 digit hour, leading zeros, 00-23
    const HOUR_SHORT     = 'HOUR_SHORT';     // G - 1 digit hour, no leading zero, 0-23

    const HOUR_AM        = 'HOUR_AM';        // h - 2 digit hour, leading zeros, 01-12 am/pm
    const HOUR_SHORT_AM  = 'HOUR_SHORT_AM';  // g - 1 digit hour, no leading zero, 1-12 am/pm

    const MINUTE         = 'MINUTE';         // i - 2 digit minute, leading zeros, 00-59
    const MINUTE_SHORT   = 'MINUTE_SHORT';   // --- 1 digit minute, no leading zero, 0-59

    const SECOND         = 'SECOND';         // s - 2 digit second, leading zeros, 00-59
    const SECOND_SHORT   = 'SECOND_SHORT';   // --- 1 digit second, no leading zero, 0-59

    const MILLISECOND    = 'MILLISECOND';    // --- milliseconds

    // timezone formats
    const TIMEZONE_NAME  = 'TIMEZONE_NAME';  // e - timezone string
    const DAYLIGHT       = 'DAYLIGHT';       // I - is Daylight saving time ?, 0-1
    const GMT_DIFF       = 'GMT_DIFF';       // O - GMT difference, -1200 +1200
    const GMT_DIFF_SEP   = 'GMT_DIFF_SEP';   // P - seperated GMT diff, -12:00 +12:00
    const TIMEZONE       = 'TIMEZONE';       // T - timezone, EST, GMT, MDT
    const TIMEZONE_SECS  = 'TIMEZONE_SECS';  // Z - timezone offset in seconds, -43200 +43200

    // date strings
    const ISO_8601       = 'ISO_8601';       // c - ISO 8601 date string
    const RFC_2822       = 'RFC_2822';       // r - RFC 2822 date string
    const TIMESTAMP      = 'TIMESTAMP';      // U - unix timestamp

    // additional formats
    const ERA            = 'ERA';            // --- short name of era, locale aware,
    const ERA_NAME       = 'ERA_NAME';       // --- full name of era, locale aware,
    const DATES          = 'DATES';          // --- standard date, locale aware
    const DATE_FULL      = 'DATE_FULL';      // --- full date, locale aware
    const DATE_LONG      = 'DATE_LONG';      // --- long date, locale aware
    const DATE_MEDIUM    = 'DATE_MEDIUM';    // --- medium date, locale aware
    const DATE_SHORT     = 'DATE_SHORT';     // --- short date, locale aware
    const TIMES          = 'TIMES';          // --- standard time, locale aware
    const TIME_FULL      = 'TIME_FULL';      // --- full time, locale aware
    const TIME_LONG      = 'TIME_LONG';      // --- long time, locale aware
    const TIME_MEDIUM    = 'TIME_MEDIUM';    // --- medium time, locale aware
    const TIME_SHORT     = 'TIME_SHORT';     // --- short time, locale aware
    const ATOM           = 'ATOM';           // --- DATE_ATOM
    const COOKIE         = 'COOKIE';         // --- DATE_COOKIE
    const RFC_822        = 'RFC_822';        // --- DATE_RFC822
    const RFC_850        = 'RFC_850';        // --- DATE_RFC850
    const RFC_1036       = 'RFC_1036';       // --- DATE_RFC1036
    const RFC_1123       = 'RFC_1123';       // --- DATE_RFC1123
    const RFC_3339       = 'RFC_3339';       // --- DATE_RFC3339
    const RSS            = 'RSS';            // --- DATE_RSS
    const W3C            = 'W3C';            // --- DATE_W3C

    /**
     * Generates the standard date object, could be a unix timestamp, localized date,
     * string, integer, array and so on. Also parts of dates or time are supported
     * Always set the default timezone: http://php.net/date_default_timezone_set
     * For example, in your bootstrap: date_default_timezone_set('America/Los_Angeles');
     * For detailed instructions please look in the docu.
     *
     * @param  string|integer|Zend_Date|array  $date    OPTIONAL Date value or value of date part to set
     *                                                 ,depending on $part. If null the actual time is set
     * @param  string                          $part    OPTIONAL Defines the input format of $date
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function __construct($date = null, $part = null, $locale = null)
    {
        if (($date !== null) and !($date instanceof Zend_TimeSync_Protocol) and (Zend_Locale::isLocale($date, true, false))) {
            $locale = $date;
            $date = null;
            $part = null;
        } else if (($part !== null) and (Zend_Locale::isLocale($part, null, false))) {
            $locale = $part;
            $part   = null;
        }

        $this->setLocale($locale);

        if (is_string($date) && defined('self::' . $date)) {
            $part = $date;
            $date = null;
        }

        if (is_null($date)) {
            $date = self::now($locale);
            if (($part !== null) && ($part !== self::TIMESTAMP)) {
                $date = $date->get($part);
            }
        }

        if ($date instanceof Zend_TimeSync_Protocol) {
            $date = $date->getInfo();
            $date = $this->_getTime($date['offset']);
            $part = null;
        } else if (parent::$_defaultOffset != 0) {
            $date = $this->_getTime(parent::$_defaultOffset);
        }

        // set the timezone and offset for $this
        $zone = @date_default_timezone_get();
        $this->setTimezone($zone);

        // try to get timezone from date-string
        if (!is_int($date)) {
            $zone = $this->getTimezoneFromString($date);
            $this->setTimezone($zone);
        }

        // set datepart
        if (($part !== null && $part !== self::TIMESTAMP) or (!is_numeric($date))) {
            // switch off dst handling for value setting
            $this->setUnixTimestamp($this->getGmtOffset());
            $this->set($date, $part, $this->_locale);

            // DST fix
            if ((is_array($date) === true) and (isset($date['hour']) === true)) {
                $hour = $this->toString('H');
                $hour = $date['hour'] - $hour;
                if ($hour !== 0) {
                    $this->addTimestamp($hour * 3600);
                }
            }
        } else {
            $this->setUnixTimestamp($date);
        }
    }

    /**
     * Sets class wide options, if no option was given, the actual set options will be returned
     *
     * @param  array  $options  Options to set
     * @throws Zend_Date_Exception
     * @return Options array if no option was given
     */
    public static function setOptions(array $options = array())
    {
        if (empty($options)) {
            return self::$_options;
        }
        foreach ($options as $name => $value) {
            $name  = strtolower($name);

            if (array_key_exists($name, self::$_options)) {
                switch($name) {
                    case 'format_type' :
                        if ((strtolower($value) != 'php') && (strtolower($value) != 'iso')) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception("Unknown format type ($value) for dates, only 'iso' and 'php' supported", $value);
                        }
                        break;
                    case 'fix_dst' :
                        if (!is_bool($value)) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception("'fix_dst' has to be boolean", $value);
                        }
                        break;
                    case 'extend_month' :
                        if (!is_bool($value)) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception("'extend_month' has to be boolean", $value);
                        }
                        break;
                    case 'cache' :
                        if (!$value instanceof Zend_Cache_Core) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception("Instance of Zend_Cache expected");
                        }
                        parent::$_cache = $value;
                        Zend_Locale_Data::setCache($value);
                        break;
                    case 'timesync' :
                        if (!$value instanceof Zend_TimeSync_Protocol) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception("Instance of Zend_TimeSync expected");
                        }
                        $date = $value->getInfo();
                        parent::$_defaultOffset = $date['offset'];
                        break;
                }
                self::$_options[$name] = $value;
            }
            else {
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("Unknown option: $name = $value");
            }
        }
    }

    /**
     * Returns this object's internal UNIX timestamp (equivalent to Zend_Date::TIMESTAMP).
     * If the timestamp is too large for integers, then the return value will be a string.
     * This function does not return the timestamp as an object.
     * Use clone() or copyPart() instead.
     *
     * @return integer|string  UNIX timestamp
     */
    public function getTimestamp()
    {
        return $this->getUnixTimestamp();
    }

    /**
     * Returns the calculated timestamp
     * HINT: timestamps are always GMT
     *
     * @param  string                          $calc    Type of calculation to make
     * @param  string|integer|array|Zend_Date  $stamp   Timestamp to calculate, when null the actual timestamp is calculated
     * @return Zend_Date|integer
     * @throws Zend_Date_Exception
     */
    private function _timestamp($calc, $stamp)
    {
        if ($stamp instanceof Zend_Date) {
            // extract timestamp from object
            $stamp = $stamp->get(self::TIMESTAMP, true);
        }

        if (is_array($stamp)) {
            if (isset($stamp['timestamp']) === true) {
                $stamp = $stamp['timestamp'];
            } else {
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('no timestamp given in array');
            }
        }

        if ($calc === 'set') {
            $return = $this->setUnixTimestamp($stamp);
        } else {
            $return = $this->_calcdetail($calc, $stamp, self::TIMESTAMP, null);
        }
        if ($calc !== 'cmp') {
            return $this;
        }
        return $return;
    }

    /**
     * Sets a new timestamp
     *
     * @param  integer|string|array|Zend_Date  $timestamp  Timestamp to set
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function setTimestamp($timestamp)
    {
        return $this->_timestamp('set', $timestamp);
    }

    /**
     * Adds a timestamp
     *
     * @param  integer|string|array|Zend_Date  $timestamp  Timestamp to add
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function addTimestamp($timestamp)
    {
        return $this->_timestamp('add', $timestamp);
    }

    /**
     * Subtracts a timestamp
     *
     * @param  integer|string|array|Zend_Date  $timestamp  Timestamp to sub
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function subTimestamp($timestamp)
    {
        return $this->_timestamp('sub', $timestamp);
    }

    /**
     * Compares two timestamps, returning the difference as integer
     *
     * @param  integer|string|array|Zend_Date  $timestamp  Timestamp to compare
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareTimestamp($timestamp)
    {
        return $this->_timestamp('cmp', $timestamp);
    }

    /**
     * Returns a string representation of the object
     * Supported format tokens are:
     * G - era, y - year, Y - ISO year, M - month, w - week of year, D - day of year, d - day of month
     * E - day of week, e - number of weekday (1-7), h - hour 1-12, H - hour 0-23, m - minute, s - second
     * A - milliseconds of day, z - timezone, Z - timezone offset, S - fractional second, a - period of day
     *
     * Additionally format tokens but non ISO conform are:
     * SS - day suffix, eee - php number of weekday(0-6), ddd - number of days per month
     * l - Leap year, B - swatch internet time, I - daylight saving time, X - timezone offset in seconds
     * r - RFC2822 format, U - unix timestamp
     *
     * Not supported ISO tokens are
     * u - extended year, Q - quarter, q - quarter, L - stand alone month, W - week of month
     * F - day of week of month, g - modified julian, c - stand alone weekday, k - hour 0-11, K - hour 1-24
     * v - wall zone
     *
     * @param  string              $format  OPTIONAL Rule for formatting output. If null the default date format is used
     * @param  string              $type    OPTIONAL Type for the format string which overrides the standard setting
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return string
     */
    public function toString($format = null, $type = null, $locale = null)
    {
        if ((strlen($format) != 2) and ($format !== null) and (Zend_Locale::isLocale($format, null, false))) {
            $locale = $format;
            $format = null;
        }

        if (($type !== null) and (Zend_Locale::isLocale($type, null, false))) {
            $locale = $type;
            $type = null;
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($format === null) {
            $format = Zend_Locale_Format::getDateFormat($locale) . ' ' . Zend_Locale_Format::getTimeFormat($locale);
        } else if (((self::$_options['format_type'] == 'php') && ($type === null)) or ($type === 'php')) {
            $format = Zend_Locale_Format::convertPhpToIsoFormat($format);
        }

        // get format tokens
        $j = 0;
        $comment = false;
        $output = array();
        for($i = 0; $i < strlen($format); ++$i) {

            if ($format[$i] == "'") {
                if ($comment == false) {
                    $comment = true;
                    ++$j;
                    $output[$j] = "'";
                } else if (isset($format[$i+1]) and ($format[$i+1] == "'")) {
                    $output[$j] .= "'";
                    ++$i;
                } else {
                    $comment = false;
                }
                continue;
            }

            if (isset($output[$j]) and ($output[$j][0] == $format[$i]) or
                ($comment == true)) {
                $output[$j] .= $format[$i];
            } else {
                ++$j;
                $output[$j] = $format[$i];
            }
        }

        $notset = false;
        // fill format tokens with date information
        for($i = 1; $i <= count($output); ++$i) {
            // fill fixed tokens
            switch ($output[$i]) {

                // special formats
                case 'SS' :
                    $output[$i] = $this->date('S', $this->getUnixTimestamp(), false);
                    break;

                case 'eee' :
                    $output[$i] = $this->date('N', $this->getUnixTimestamp(), false);
                    break;

                case 'ddd' :
                    $output[$i] = $this->date('t', $this->getUnixTimestamp(), false);
                    break;

                case 'l' :
                    $output[$i] = $this->date('L', $this->getUnixTimestamp(), false);
                    break;

                case 'B' :
                    $output[$i] = $this->date('B', $this->getUnixTimestamp(), false);
                    break;

                case 'I' :
                    $output[$i] = $this->date('I', $this->getUnixTimestamp(), false);
                    break;

                case 'X' :
                    $output[$i] = $this->date('Z', $this->getUnixTimestamp(), false);
                    break;

                case 'r' :
                    $output[$i] = $this->date('r', $this->getUnixTimestamp(), false);
                    break;

                case 'U' :
                    $output[$i] = $this->getUnixTimestamp();
                    break;

                    // eras
                case 'GGGGG' :
                    $output[$i] = iconv_substr($this->get(self::ERA, $locale), 0, 1) . ".";
                    break;

                case 'GGGG' :
                    $output[$i] = $this->get(self::ERA_NAME, $locale);
                    break;

                case 'GGG' :
                case 'GG'  :
                case 'G'   :
                    $output[$i] = $this->get(self::ERA, $locale);
                    break;

                // years
                case 'yy' :
                    $output[$i] = str_pad($this->get(self::YEAR_SHORT, $locale), 2, '0', STR_PAD_LEFT);
                    break;

                // ISO years
                case 'YY' :
                    $output[$i] = str_pad($this->get(self::YEAR_SHORT_8601, $locale), 2, '0', STR_PAD_LEFT);
                    break;

                // months
                case 'MMMMM' :
                    $output[$i] = iconv_substr($this->get(self::MONTH_NAME_NARROW, $locale), 0, 1);
                    break;

                case 'MMMM' :
                    $output[$i] = $this->get(self::MONTH_NAME, $locale);
                    break;

                case 'MMM' :
                    $output[$i] = $this->get(self::MONTH_NAME_SHORT, $locale);
                    break;

                case 'MM' :
                    $output[$i] = $this->get(self::MONTH, $locale);
                    break;

                case 'M' :
                    $output[$i] = $this->get(self::MONTH_SHORT, $locale);
                    break;

                // week
                case 'ww' :
                    $output[$i] = str_pad($this->get(self::WEEK, $locale), 2, '0', STR_PAD_LEFT);
                    break;

                case 'w' :
                    $output[$i] = $this->get(self::WEEK, $locale);
                    break;

                // monthday
                case 'dd' :
                    $output[$i] = $this->get(self::DAY, $locale);
                    break;

                case 'd' :
                    $output[$i] = $this->get(self::DAY_SHORT, $locale);
                    break;

                // yearday
                case 'DDD' :
                    $output[$i] = str_pad($this->get(self::DAY_OF_YEAR, $locale), 3, '0', STR_PAD_LEFT);
                    break;

                case 'DD' :
                    $output[$i] = str_pad($this->get(self::DAY_OF_YEAR, $locale), 2, '0', STR_PAD_LEFT);
                    break;

                case 'D' :
                    $output[$i] = $this->get(self::DAY_OF_YEAR, $locale);
                    break;

                // weekday
                case 'EEEEE' :
                    $output[$i] = $this->get(self::WEEKDAY_NARROW, $locale);
                    break;

                case 'EEEE' :
                    $output[$i] = $this->get(self::WEEKDAY, $locale);
                    break;

                case 'EEE' :
                    $output[$i] = $this->get(self::WEEKDAY_SHORT, $locale);
                    break;

                case 'EE' :
                    $output[$i] = $this->get(self::WEEKDAY_NAME, $locale);
                    break;

                case 'E' :
                    $output[$i] = $this->get(self::WEEKDAY_NARROW, $locale);
                    break;

                // weekday number
                case 'ee' :
                    $output[$i] = str_pad($this->get(self::WEEKDAY_8601, $locale), 2, '0', STR_PAD_LEFT);
                    break;

                case 'e' :
                    $output[$i] = $this->get(self::WEEKDAY_8601, $locale);
                    break;


                // period
                case 'a' :
                    $output[$i] = $this->get(self::MERIDIEM, $locale);
                    break;

                // hour
                case 'hh' :
                    $output[$i] = $this->get(self::HOUR_AM, $locale);
                    break;

                case 'h' :
                    $output[$i] = $this->get(self::HOUR_SHORT_AM, $locale);
                    break;

                case 'HH' :
                    $output[$i] = $this->get(self::HOUR, $locale);
                    break;

                case 'H' :
                    $output[$i] = $this->get(self::HOUR_SHORT, $locale);
                    break;

                // minute
                case 'mm' :
                    $output[$i] = $this->get(self::MINUTE, $locale);
                    break;

                case 'm' :
                    $output[$i] = $this->get(self::MINUTE_SHORT, $locale);
                    break;

                // second
                case 'ss' :
                    $output[$i] = $this->get(self::SECOND, $locale);
                    break;

                case 's' :
                    $output[$i] = $this->get(self::SECOND_SHORT, $locale);
                    break;

                case 'S' :
                    $output[$i] = $this->get(self::MILLISECOND, $locale);
                    break;

                // zone
                // @todo  v needs to be reworked as it's the long wall time and not the timezone
                case 'vvvv' :
                case 'zzzz' :
                    $output[$i] = $this->get(self::TIMEZONE_NAME, $locale);
                    break;

                // @todo  v needs to be reworked as it's the short wall time and not the timezone
                case 'v' :
                case 'zzz' :
                case 'zz'  :
                case 'z'   :
                    $output[$i] = $this->get(self::TIMEZONE, $locale);
                    break;

                // zone offset
                case 'ZZZZ' :
                    $output[$i] = $this->get(self::GMT_DIFF_SEP, $locale);
                    break;

                case 'ZZZ' :
                case 'ZZ'  :
                case 'Z'   :
                    $output[$i] = $this->get(self::GMT_DIFF, $locale);
                    break;

                default :
                    $notset = true;
                    break;
            }

            // fill variable tokens
            if ($notset == true) {
                if (($output[$i][0] !== "'") and (preg_match('/y+/', $output[$i]))) {
                    $length     = iconv_strlen($output[$i]);
                    $output[$i] = $this->get(self::YEAR, $locale);
                    $output[$i] = str_pad($output[$i], $length, '0', STR_PAD_LEFT);
                }

                if (($output[$i][0] !== "'") and (preg_match('/Y+/', $output[$i]))) {
                    $length     = iconv_strlen($output[$i]);
                    $output[$i] = $this->get(self::YEAR_8601, $locale);
                    $output[$i] = str_pad($output[$i], $length, '0', STR_PAD_LEFT);
                }

                if (($output[$i][0] !== "'") and (preg_match('/A+/', $output[$i]))) {
                    $length = iconv_strlen($output[$i]);
                    $hour   = $this->get(self::HOUR,        $locale);
                    $minute = $this->get(self::MINUTE,      $locale);
                    $second = $this->get(self::SECOND,      $locale);
                    $milli  = $this->get(self::MILLISECOND, $locale);

                    $seconds    = $milli + ($second * 1000) + ($minute * 60000) + ($hour * 3600000);
                    $output[$i] = str_pad($seconds, $length, '0', STR_PAD_LEFT);
                }

                if ($output[$i][0] === "'") {
                    $output[$i] = iconv_substr($output[$i], 1);
                }
            }
            $notset = false;
        }

        return implode('', $output);
    }

    /**
     * Returns a string representation of the date which is equal with the timestamp
     *
     * @return string
     */
    public function __toString()
    {
        return $this->toString(null, $this->_locale);
    }

    /**
     * Returns a integer representation of the object
     * But returns false when the given part is no value f.e. Month-Name
     *
     * @param  string|integer|Zend_Date  $part  OPTIONAL Defines the date or datepart to return as integer
     * @return integer|false
     */
    public function toValue($part = null)
    {
        $result = $this->get($part);
        if (is_numeric($result)) {
          return intval("$result");
        } else {
          return false;
        }
    }

    /**
     * Returns an array representation of the object
     *
     * @return array
     */
    public function toArray()
    {
        return array('day'       => $this->get(self::DAY_SHORT),
                     'month'     => $this->get(self::MONTH_SHORT),
                     'year'      => $this->get(self::YEAR),
                     'hour'      => $this->get(self::HOUR_SHORT),
                     'minute'    => $this->get(self::MINUTE_SHORT),
                     'second'    => $this->get(self::SECOND_SHORT),
                     'timezone'  => $this->get(self::TIMEZONE),
                     'timestamp' => $this->get(self::TIMESTAMP),
                     'weekday'   => $this->get(self::WEEKDAY_8601),
                     'dayofyear' => $this->get(self::DAY_OF_YEAR),
                     'week'      => $this->get(self::WEEK),
                     'gmtsecs'   => $this->get(self::TIMEZONE_SECS));
    }

    /**
     * Returns a representation of a date or datepart
     * This could be for example a localized monthname, the time without date,
     * the era or only the fractional seconds. There are about 50 different supported date parts.
     * For a complete list of supported datepart values look into the docu
     *
     * @param  string              $part    OPTIONAL Part of the date to return, if null the timestamp is returned
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return integer|string  date or datepart
     */
    public function get($part = null, $locale = null)
    {
        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if (($part !== null) and (Zend_Locale::isLocale($part, null, false))) {
            $locale = $part;
            $part = null;
        }

        if ($part === null) {
            $part = self::TIMESTAMP;
        }

        if (!defined("self::".$part)) {
            return $this->toString($part, $locale);
        }

        switch($part) {

            // day formats
            case self::DAY :
                return $this->date('d', $this->getUnixTimestamp(), false);
                break;

            case self::WEEKDAY_SHORT :
                $weekday = strtolower($this->date('D', $this->getUnixTimestamp(), false));
                $day = Zend_Locale_Data::getContent($locale, 'day', array('gregorian', 'format', 'wide', $weekday));
                return iconv_substr($day, 0, 3);
                break;

            case self::DAY_SHORT :
                return $this->date('j', $this->getUnixTimestamp(), false);
                break;

            case self::WEEKDAY :
                $weekday = strtolower($this->date('D', $this->getUnixTimestamp(), false));
                return Zend_Locale_Data::getContent($locale, 'day', array('gregorian', 'format', 'wide', $weekday));
                break;

            case self::WEEKDAY_8601 :
                return $this->date('N', $this->getUnixTimestamp(), false);
                break;

            case self::DAY_SUFFIX :
                return $this->date('S', $this->getUnixTimestamp(), false);
                break;

            case self::WEEKDAY_DIGIT :
                return $this->date('w', $this->getUnixTimestamp(), false);
                break;

            case self::DAY_OF_YEAR :
                return $this->date('z', $this->getUnixTimestamp(), false);
                break;

            case self::WEEKDAY_NARROW :
                $weekday = strtolower($this->date('D', $this->getUnixTimestamp(), false));
                $day = Zend_Locale_Data::getContent($locale, 'day', array('gregorian', 'format', 'abbreviated', $weekday));
                return iconv_substr($day, 0, 1);
                break;

            case self::WEEKDAY_NAME :
                $weekday = strtolower($this->date('D', $this->getUnixTimestamp(), false));
                return Zend_Locale_Data::getContent($locale, 'day', array('gregorian', 'format', 'abbreviated', $weekday));
                break;

            // week formats
            case self::WEEK :
                return $this->date('W', $this->getUnixTimestamp(), false);
                break;

            // month formats
            case self::MONTH_NAME :
                $month = $this->date('n', $this->getUnixTimestamp(), false);
                return Zend_Locale_Data::getContent($locale, 'month', array('gregorian', 'format', 'wide', $month));
                break;

            case self::MONTH :
                return $this->date('m', $this->getUnixTimestamp(), false);
                break;

            case self::MONTH_NAME_SHORT :
                $month = $this->date('n', $this->getUnixTimestamp(), false);
                return Zend_Locale_Data::getContent($locale, 'month', array('gregorian', 'format', 'abbreviated', $month));
                break;

            case self::MONTH_SHORT :
                return $this->date('n', $this->getUnixTimestamp(), false);
                break;

            case self::MONTH_DAYS :
                return $this->date('t', $this->getUnixTimestamp(), false);
                break;

            case self::MONTH_NAME_NARROW :
                $month = $this->date('n', $this->getUnixTimestamp(), false);
                $mon = Zend_Locale_Data::getContent($locale, 'month', array('gregorian', 'format', 'abbreviated', $month));
                return iconv_substr($mon, 0, 1);
                break;

            // year formats
            case self::LEAPYEAR :
                return $this->date('L', $this->getUnixTimestamp(), false);
                break;

            case self::YEAR_8601 :
                return $this->date('o', $this->getUnixTimestamp(), false);
                break;

            case self::YEAR :
                return $this->date('Y', $this->getUnixTimestamp(), false);
                break;

            case self::YEAR_SHORT :
                return $this->date('y', $this->getUnixTimestamp(), false);
                break;


            case self::YEAR_SHORT_8601 :
                $year = $this->date('o', $this->getUnixTimestamp(), false);
                return iconv_substr($year, -2);
                break;

            // time formats
            case self::MERIDIEM :
                $am = $this->date('a', $this->getUnixTimestamp(), false);
                if ($am == 'am') {
                    return Zend_Locale_Data::getContent($locale, 'am');
                }
                return Zend_Locale_Data::getContent($locale, 'pm');
                break;

            case self::SWATCH :
                return $this->date('B', $this->getUnixTimestamp(), false);
                break;

            case self::HOUR_SHORT_AM :
                return $this->date('g', $this->getUnixTimestamp(), false);
                break;

            case self::HOUR_SHORT :
                return $this->date('G', $this->getUnixTimestamp(), false);
                break;

            case self::HOUR_AM :
                return $this->date('h', $this->getUnixTimestamp(), false);
                break;

            case self::HOUR :
                return $this->date('H', $this->getUnixTimestamp(), false);
                break;

            case self::MINUTE :
                return $this->date('i', $this->getUnixTimestamp(), false);
                break;

            case self::SECOND :
                return $this->date('s', $this->getUnixTimestamp(), false);
                break;

            case self::MINUTE_SHORT :
                return $this->date('i', $this->getUnixTimestamp(), false);
                break;

            case self::SECOND_SHORT :
                return $this->date('s', $this->getUnixTimestamp(), false);
                break;

            case self::MILLISECOND :
                return $this->_fractional;
                break;

            // timezone formats
            case self::TIMEZONE_NAME :
                return $this->date('e', $this->getUnixTimestamp(), false);
                break;

            case self::DAYLIGHT :
                return $this->date('I', $this->getUnixTimestamp(), false);
                break;

            case self::GMT_DIFF :
                return $this->date('O', $this->getUnixTimestamp(), false);
                break;

            case self::GMT_DIFF_SEP :
                return $this->date('P', $this->getUnixTimestamp(), false);
                break;

            case self::TIMEZONE :
                return $this->date('T', $this->getUnixTimestamp(), false);
                break;

            case self::TIMEZONE_SECS :
                return $this->date('Z', $this->getUnixTimestamp(), false);
                break;

            // date strings
            case self::ISO_8601 :
                return $this->date('c', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_2822 :
                return $this->date('r', $this->getUnixTimestamp(), false);
                break;

            case self::TIMESTAMP :
                return $this->getUnixTimestamp();
                break;

            // additional formats
            case self::ERA :
                $year = $this->date('Y', $this->getUnixTimestamp(), false);
                if ($year < 0) {
                    return Zend_Locale_Data::getContent($locale, 'era', array('gregorian', 'Abbr', '0'));
                }
                return Zend_Locale_Data::getContent($locale, 'era', array('gregorian', 'Abbr', '1'));
                break;

            case self::ERA_NAME :
                $year = $this->date('Y', $this->getUnixTimestamp(), false);
                if ($year < 0) {
                    return Zend_Locale_Data::getContent($locale, 'era', array('gregorian', 'Names', '0'));
                }
                return Zend_Locale_Data::getContent($locale, 'era', array('gregorian', 'Names', '1'));
                break;

            case self::DATES :
                return $this->toString(Zend_Locale_Format::getDateFormat($locale), 'iso', $locale);
                break;

            case self::DATE_FULL :
                $date = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'full'));
                return $this->toString($date, 'iso', $locale);
                break;

            case self::DATE_LONG :
                $date = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'long'));
                return $this->toString($date, 'iso', $locale);
                break;

            case self::DATE_MEDIUM :
                $date = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'medium'));
                return $this->toString($date, 'iso', $locale);
                break;

            case self::DATE_SHORT :
                $date = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'short'));
                return $this->toString($date, 'iso', $locale);
                break;

            case self::TIMES :
                return $this->toString(Zend_Locale_Format::getTimeFormat($locale), 'iso', $locale);
                break;

            case self::TIME_FULL :
                $time = Zend_Locale_Data::getContent($locale, 'time', 'full');
                return $this->toString($time, 'iso', $locale);
                break;

            case self::TIME_LONG :
                $time = Zend_Locale_Data::getContent($locale, 'time', 'long');
                return $this->toString($time, 'iso', $locale);
                break;

            case self::TIME_MEDIUM :
                $time = Zend_Locale_Data::getContent($locale, 'time', 'medium');
                return $this->toString($time, 'iso', $locale);
                break;

            case self::TIME_SHORT :
                $time = Zend_Locale_Data::getContent($locale, 'time', 'short');
                return $this->toString($time, 'iso', $locale);
                break;

            case self::ATOM :
                return $this->date('Y\-m\-d\TH\:i\:sP', $this->getUnixTimestamp(), false);
                break;

            case self::COOKIE :
                return $this->date('l\, d\-M\-y H\:i\:s e', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_822 :
                return $this->date('D\, d M y H\:i\:s O', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_850 :
                return $this->date('l\, d\-M\-y H\:i\:s e', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_1036 :
                return $this->date('D\, d M y H\:i\:s O', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_1123 :
                return $this->date('D\, d M Y H\:i\:s O', $this->getUnixTimestamp(), false);
                break;

            case self::RFC_3339 :
                return $this->date('Y\-m\-d\TH\:i\:sP', $this->getUnixTimestamp(), false);
                break;

            case self::RSS :
                return $this->date('D\, d M Y H\:i\:s O', $this->getUnixTimestamp(), false);
                break;

            case self::W3C :
                return $this->date('Y\-m\-d\TH\:i\:sP', $this->getUnixTimestamp(), false);
                break;
        }
    }

    /**
     * Return digit from standard names (english)
     * Faster implementation than locale aware searching
     *
     * @param  string  $name
     * @return integer  Number of this month
     * @throws Zend_Date_Exception
     */
    private function _getDigitFromName($name)
    {
        switch($name) {
            case "Jan":
                return 1;

            case "Feb":
                return 2;

            case "Mar":
                return 3;

            case "Apr":
                return 4;

            case "May":
                return 5;

            case "Jun":
                return 6;

            case "Jul":
                return 7;

            case "Aug":
                return 8;

            case "Sep":
                return 9;

            case "Oct":
                return 10;

            case "Nov":
                return 11;

            case "Dec":
                return 12;

            default:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('Month ($name) is not a known month');
        }
    }

    /**
     * Counts the exact year number
     * < 70 - 2000 added, >70 < 100 - 1900, others just returned
     *
     * @param  integer  $value year number
     * @return integer  Number of year
     */
    public static function getFullYear($value)
    {
        if ($value >= 0) {
            if ($value < 70) {
                $value += 2000;
            } else if ($value < 100) {
                $value += 1900;
            }
        }
        return $value;
    }

    /**
     * Sets the given date as new date or a given datepart as new datepart returning the new datepart
     * This could be for example a localized dayname, the date without time,
     * the month or only the seconds. There are about 50 different supported date parts.
     * For a complete list of supported datepart values look into the docu
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to set
     * @param  string                          $part    OPTIONAL Part of the date to set, if null the timestamp is set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer|string  new datepart
     * @throws Zend_Date_Exception
     */
    public function set($date, $part = null, $locale = null)
    {
        $zone = $this->getTimezoneFromString($date);
        $this->setTimezone($zone);

        $result = $this->_calculate('set', $date, $part, $locale);
        return $result;
    }

    /**
     * Adds a date or datepart to the existing date, by extracting $part from $date,
     * and modifying this object by adding that part.  The $part is then extracted from
     * this object and returned as an integer or numeric string (for large values, or $part's
     * corresponding to pre-defined formatted date strings).
     * This could be for example a ISO 8601 date, the hour the monthname or only the minute.
     * There are about 50 different supported date parts.
     * For a complete list of supported datepart values look into the docu.
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to add
     * @param  string                          $part    OPTIONAL Part of the date to add, if null the timestamp is added
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer|string  new datepart
     * @throws Zend_Date_Exception
     */
    public function add($date, $part = null, $locale = null)
    {
        $this->_calculate('add', $date, $part, $locale);
        $result = $this->get($part, $locale);

        return $result;
    }

    /**
     * Subtracts a date from another date.
     * This could be for example a RFC2822 date, the time,
     * the year or only the timestamp. There are about 50 different supported date parts.
     * For a complete list of supported datepart values look into the docu
     * Be aware: Adding -2 Months is not equal to Subtracting 2 Months !!!
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to subtract
     * @param  string                          $part    OPTIONAL Part of the date to sub, if null the timestamp is subtracted
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer|string  new datepart
     * @throws Zend_Date_Exception
     */
    public function sub($date, $part = null, $locale = null)
    {
        $this->_calculate('sub', $date, $part, $locale);
        $result = $this->get($part, $locale);

        return $result;
    }

    /**
     * Compares a date or datepart with the existing one.
     * Returns -1 if earlier, 0 if equal and 1 if later.
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to compare with the date object
     * @param  string                          $part    OPTIONAL Part of the date to compare, if null the timestamp is subtracted
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compare($date, $part = null, $locale = null)
    {
        $compare = $this->_calculate('cmp', $date, $part, $locale);

        if ($compare > 0) {
            return 1;
        } else if ($compare < 0) {
            return -1;
        }
        return 0;
    }

    /**
     * Returns a new instance of Zend_Date with the selected part copied.
     * To make an exact copy, use PHP's clone keyword.
     * For a complete list of supported date part values look into the docu.
     * If a date part is copied, all other date parts are set to standard values.
     * For example: If only YEAR is copied, the returned date object is equal to
     * 01-01-YEAR 00:00:00 (01-01-1970 00:00:00 is equal to timestamp 0)
     * If only HOUR is copied, the returned date object is equal to
     * 01-01-1970 HOUR:00:00 (so $this contains a timestamp equal to a timestamp of 0 plus HOUR).
     *
     * @param  string              $part    Part of the date to compare, if null the timestamp is subtracted
     * @param  string|Zend_Locale  $locale  OPTIONAL New object's locale.  No adjustments to timezone are made.
     * @return Zend_Date
     */
    public function copyPart($part, $locale = null)
    {
        $clone = clone $this;           // copy all instance variables
        $clone->setUnixTimestamp(0);    // except the timestamp
        if ($locale != null) {
            $clone->setLocale($locale); // set an other locale if selected
        }
        $clone->set($this, $part);
        return $clone;
    }

    /**
     * Internal function, returns the offset of a given timezone
     *
     * @param string $zone
     * @return integer
     */
    public function getTimezoneFromString($zone)
    {
        if (is_array($zone)) {
            return $this->getTimezone();
        }
        if ($zone instanceof Zend_Date) {
            return $zone->getTimezone();
        }
        preg_match('/([+-]\d{2}):{0,1}\d{2}/', $zone, $match);
        if (!empty($match) and ($match[count($match) - 1] <= 12) and ($match[count($match) - 1] >= -12)) {
            $zone = "Etc/GMT";
            $zone .= ($match[count($match) - 1] < 0) ? "+" : "-";
            $zone .= (int) abs($match[count($match) - 1]);
            return $zone;
        }

        preg_match('/([[:alpha:]\/]{3,30})/', $zone, $match);
        try {
            if (!empty($match) and (!is_int($match[count($match) - 1]))) {
                $oldzone = $this->getTimezone();
                $this->setTimezone($match[count($match) - 1]);
                $result = $this->getTimezone();
                $this->setTimezone($oldzone);
                if ($result !== $oldzone) {
                    return $match[count($match) - 1];
                }
            }
        } catch (Exception $e) {
            // fall through
        }

        return $this->getTimezone();
    }

    /**
     * Calculates the date or object
     *
     * @param  string                    $calc  Calculation to make
     * @param  string|integer            $date  Date for calculation
     * @param  string|integer            $comp  Second date for calculation
     * @param  boolean|integer           $dst   Use dst correction if option is set
     * @return integer|string|Zend_Date  new timestamp or Zend_Date depending on calculation
     */
    private function _assign($calc, $date, $comp = 0, $dst = false)
    {
        switch ($calc) {
            case 'set' :
                if (!empty($comp)) {
                    $this->setUnixTimestamp(call_user_func(Zend_Locale_Math::$sub, $this->getUnixTimestamp(), $comp));
                }
                $this->setUnixTimestamp(call_user_func(Zend_Locale_Math::$add, $this->getUnixTimestamp(), $date));
                $value = $this->getUnixTimestamp();
                break;
            case 'add' :
                $this->setUnixTimestamp(call_user_func(Zend_Locale_Math::$add, $this->getUnixTimestamp(), $date));
                $value = $this->getUnixTimestamp();
                break;
            case 'sub' :
                $this->setUnixTimestamp(call_user_func(Zend_Locale_Math::$sub, $this->getUnixTimestamp(), $date));
                $value = $this->getUnixTimestamp();
                break;
            default :
                // cmp - compare
                return call_user_func(Zend_Locale_Math::$comp, $comp, $date);
                break;
        }

        // dst-correction if 'fix_dst' = true and dst !== false but only for non UTC and non GMT
        if ((self::$_options['fix_dst'] === true) and ($dst !== false) and ($this->_dst === true)) {
            $hour = $this->get(self::HOUR);
            if ($hour != $dst) {
                if (($dst == ($hour + 1)) or ($dst == ($hour - 23))) {
                    $value += 3600;
                } else if (($dst == ($hour - 1)) or ($dst == ($hour + 23))) {
                    $value -= 3600;
                }
                $this->setUnixTimestamp($value);
            }
        }
        return $this->getUnixTimestamp();
    }


    /**
     * Calculates the date or object
     *
     * @param  string                          $calc    Calculation to make, one of: 'add'|'sub'|'cmp'|'copy'|'set'
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to calculate with
     * @param  string                          $part    Part of the date to calculate, if null the timestamp is used
     * @param  string|Zend_Locale              $locale  Locale for parsing input
     * @return integer|string|Zend_Date        new timestamp
     * @throws Zend_Date_Exception
     */
    private function _calculate($calc, $date, $part, $locale)
    {
        if (is_null($date) === true) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $date must be set, null is not allowed');
        }

        if (($part !== null) and (Zend_Locale::isLocale($part, null, false))) {
            $locale = $part;
            $part   = null;
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        $locale = (string) $locale;

        // Create date parts
        $year   = $this->get(self::YEAR);
        $month  = $this->get(self::MONTH_SHORT);
        $day    = $this->get(self::DAY_SHORT);
        $hour   = $this->get(self::HOUR_SHORT);
        $minute = $this->get(self::MINUTE_SHORT);
        $second = $this->get(self::SECOND_SHORT);
        // If object extract value
        if ($date instanceof Zend_Date) {
            $date = $date->get($part, $locale);
        }

        if (is_array($date) === true) {
            if (empty($part) === false) {
                switch($part) {
                    // Fall through
                    case self::DAY:
                    case self::DAY_SHORT:
                        if (isset($date['day']) === true) {
                            $date = $date['day'];
                        }
                        break;
                    // Fall through
                    case self::WEEKDAY_SHORT:
                    case self::WEEKDAY:
                    case self::WEEKDAY_8601:
                    case self::WEEKDAY_DIGIT:
                    case self::WEEKDAY_NARROW:
                    case self::WEEKDAY_NAME:
                        if (isset($date['weekday']) === true) {
                            $date = $date['weekday'];
                            $part = self::WEEKDAY_DIGIT;
                        }
                        break;
                    case self::DAY_OF_YEAR:
                        if (isset($date['day_of_year']) === true) {
                            $date = $date['day_of_year'];
                        }
                        break;
                    // Fall through
                    case self::MONTH:
                    case self::MONTH_SHORT:
                    case self::MONTH_NAME:
                    case self::MONTH_NAME_SHORT:
                    case self::MONTH_NAME_NARROW:
                        if (isset($date['month']) === true) {
                            $date = $date['month'];
                        }
                        break;
                    // Fall through
                    case self::YEAR:
                    case self::YEAR_SHORT:
                    case self::YEAR_8601:
                    case self::YEAR_SHORT_8601:
                        if (isset($date['year']) === true) {
                            $date = $date['year'];
                        }
                        break;
                    // Fall through
                    case self::HOUR:
                    case self::HOUR_AM:
                    case self::HOUR_SHORT:
                    case self::HOUR_SHORT_AM:
                        if (isset($date['hour']) === true) {
                            $date = $date['hour'];
                        }
                        break;
                    // Fall through
                    case self::MINUTE:
                    case self::MINUTE_SHORT:
                        if (isset($date['minute']) === true) {
                            $date = $date['minute'];
                        }
                        break;
                    // Fall through
                    case self::SECOND:
                    case self::SECOND_SHORT:
                        if (isset($date['second']) === true) {
                            $date = $date['second'];
                        }
                        break;
                    // Fall through
                    case self::TIMEZONE:
                    case self::TIMEZONE_NAME:
                        if (isset($date['timezone']) === true) {
                            $date = $date['timezone'];
                        }
                        break;
                    case self::TIMESTAMP:
                        if (isset($date['timestamp']) === true) {
                            $date = $date['timestamp'];
                        }
                        break;
                    case self::WEEK:
                        if (isset($date['week']) === true) {
                            $date = $date['week'];
                        }
                        break;
                    case self::TIMEZONE_SECS:
                        if (isset($date['gmtsecs']) === true) {
                            $date = $date['gmtsecs'];
                        }
                        break;
                    default:
                        #require_once 'Zend/Date/Exception.php';
                        throw new Zend_Date_Exception("datepart for part ($part) not found in array");
                        break;
                }
            } else {
                $hours = 0;
                if (isset($date['hour']) === true) {
                    $hours = $date['hour'];
                }
                $minutes = 0;
                if (isset($date['minute']) === true) {
                    $minutes = $date['minute'];
                }
                $seconds = 0;
                if (isset($date['second']) === true) {
                    $seconds = $date['second'];
                }
                $months = 0;
                if (isset($date['month']) === true) {
                    $months = $date['month'];
                }
                $days = 0;
                if (isset($date['day']) === true) {
                    $days = $date['day'];
                }
                $years = 0;
                if (isset($date['year']) === true) {
                    $years = $date['year'];
                }
                return $this->_assign($calc, $this->mktime($hours, $minutes, $seconds, $months, $days, $years, true),
                                             $this->mktime($hour, $minute, $second, $month, $day, $year, true), $hour);
            }
        }

        // $date as object, part of foreign date as own date
        switch($part) {

            // day formats
            case self::DAY:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + intval($date), 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + intval($day), 1970, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, day expected", $date);
                break;

            case self::WEEKDAY_SHORT:
                $daylist = Zend_Locale_Data::getList($locale, 'day');
                $weekday = (int) $this->get(self::WEEKDAY_DIGIT, $locale);
                $cnt = 0;

                foreach ($daylist as $key => $value) {
                    if (strtoupper(iconv_substr($value, 0, 3)) == strtoupper($date)) {
                         $found = $cnt;
                        break;
                    }
                    ++$cnt;
                }

                // Weekday found
                if ($cnt < 7) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $found, 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            case self::DAY_SHORT:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + intval($date), 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + intval($day), 1970, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, day expected", $date);
                break;

            case self::WEEKDAY:
                $daylist = Zend_Locale_Data::getList($locale, 'day');
                $weekday = (int) $this->get(self::WEEKDAY_DIGIT, $locale);
                $cnt = 0;

                foreach ($daylist as $key => $value) {
                    if (strtoupper($value) == strtoupper($date)) {
                        $found = $cnt;
                        break;
                    }
                    ++$cnt;
                }

                // Weekday found
                if ($cnt < 7) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $found, 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            case self::WEEKDAY_8601:
                $weekday = (int) $this->get(self::WEEKDAY_8601, $locale);
                if ((intval($date) > 0) and (intval($date) < 8)) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + intval($date), 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            case self::DAY_SUFFIX:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('day suffix not supported', $date);
                break;

            case self::WEEKDAY_DIGIT:
                $weekday = (int) $this->get(self::WEEKDAY_DIGIT, $locale);
                if (is_numeric($date) and (intval($date) >= 0) and (intval($date) < 7)) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $date, 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            case self::DAY_OF_YEAR:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $date, 1970, true),
                                                 $this->mktime(0, 0, 0, $month, 1 + $day, 1970, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, day expected", $date);
                break;

            case self::WEEKDAY_NARROW:
                $daylist = Zend_Locale_Data::getList($locale, 'day', array('gregorian', 'format', 'abbreviated'));
                $weekday = (int) $this->get(self::WEEKDAY_DIGIT, $locale);
                $cnt = 0;
                foreach ($daylist as $key => $value) {
                    if (strtoupper(iconv_substr($value, 0, 1)) == strtoupper($date)) {
                        $found = $cnt;
                        break;
                    }
                    ++$cnt;
                }

                // Weekday found
                if ($cnt < 7) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $found, 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            case self::WEEKDAY_NAME:
                $daylist = Zend_Locale_Data::getList($locale, 'day', array('gregorian', 'format', 'abbreviated'));
                $weekday = (int) $this->get(self::WEEKDAY_DIGIT, $locale);
                $cnt = 0;
                foreach ($daylist as $key => $value) {
                    if (strtoupper($value) == strtoupper($date)) {
                        $found = $cnt;
                        break;
                    }
                    ++$cnt;
                }

                // Weekday found
                if ($cnt < 7) {
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1, 1 + $found, 1970, true),
                                                 $this->mktime(0, 0, 0, 1, 1 + $weekday, 1970, true), $hour);
                }

                // Weekday not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, weekday expected", $date);
                break;

            // week formats
            case self::WEEK:
                if (is_numeric($date)) {
                    $week = (int) $this->get(self::WEEK, $locale);
                    return $this->_assign($calc, parent::mktime(0, 0, 0, 1, 1 + ($date * 7), 1970, true),
                                                 parent::mktime(0, 0, 0, 1, 1 + ($week * 7), 1970, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, week expected", $date);
                break;

            // month formats
            case self::MONTH_NAME:
                $monthlist = Zend_Locale_Data::getList($locale, 'month');
                $cnt = 0;
                foreach ($monthlist as $key => $value) {
                    if (strtoupper($value) == strtoupper($date)) {
                        $found = $key;
                        break;
                    }
                    ++$cnt;
                }
                $date = array_search($date, $monthlist);

                // Monthname found
                if ($cnt < 12) {
                    $fixday = 0;
                    if ($calc == 'add') {
                        $date += $found;
                        $calc = 'set';
                        if (self::$_options['extend_month'] == false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    } else if ($calc == 'sub') {
                        $date = $month - $found;
                        $calc = 'set';
                        if (self::$_options['extend_month'] == false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $date,  $day + $fixday, $year, true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year, true), $hour);
                }

                // Monthname not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, month expected", $date);
                break;

            case self::MONTH:
                if (is_numeric($date)) {
                    $fixday = 0;
                    if ($calc == 'add') {
                        $date += $month;
                        $calc = 'set';
                        if (self::$_options['extend_month'] == false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    } else if ($calc == 'sub') {
                        $date = $month - $date;
                        $calc = 'set';
                        if (self::$_options['extend_month'] == false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $date, $day + $fixday, $year, true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, month expected", $date);
                break;

            case self::MONTH_NAME_SHORT:
                $monthlist = Zend_Locale_Data::getList($locale, 'month', array('gregorian', 'format', 'abbreviated'));
                $cnt = 0;
                foreach ($monthlist as $key => $value) {
                    if (strtoupper($value) == strtoupper($date)) {
                        $found = $key;
                        break;
                    }
                    ++$cnt;
                }
                $date = array_search($date, $monthlist);

                // Monthname found
                if ($cnt < 12) {
                    $fixday = 0;
                    if ($calc == 'add') {
                        $date += $found;
                        $calc = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    } else if ($calc == 'sub') {
                        $date = $month - $found;
                        $calc = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $date, $day + $fixday, $year, true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year, true), $hour);
                }

                // Monthname not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, month expected", $date);
                break;

            case self::MONTH_SHORT:
                if (is_numeric($date) === true) {
                    $fixday = 0;
                    if ($calc === 'add') {
                        $date += $month;
                        $calc  = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    } else if ($calc === 'sub') {
                        $date = $month - $date;
                        $calc = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    }

                    return $this->_assign($calc, $this->mktime(0, 0, 0, $date,  $day + $fixday, $year, true),
                                                 $this->mktime(0, 0, 0, $month, $day,           $year, true), $hour);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, month expected", $date);
                break;

            case self::MONTH_DAYS:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('month days not supported', $date);
                break;

            case self::MONTH_NAME_NARROW:
                $monthlist = Zend_Locale_Data::getList($locale, 'month', array('gregorian', 'stand-alone', 'narrow'));
                $cnt       = 0;
                foreach ($monthlist as $key => $value) {
                    if (strtoupper($value) === strtoupper($date)) {
                        $found = $key;
                        break;
                    }
                    ++$cnt;
                }
                $date = array_search($date, $monthlist);

                // Monthname found
                if ($cnt < 12) {
                    $fixday = 0;
                    if ($calc === 'add') {
                        $date += $found;
                        $calc  = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    } else if ($calc === 'sub') {
                        $date = $month - $found;
                        $calc = 'set';
                        if (self::$_options['extend_month'] === false) {
                            $parts = $this->getDateParts($this->mktime(0, 0, 0, $date, $day, $year, false));
                            if ($parts['mday'] != $day) {
                                $fixday = ($parts['mday'] < $day) ? -$parts['mday'] : ($parts['mday'] - $day);
                            }
                        }
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $date,  $day + $fixday, $year, true),
                                                 $this->mktime(0, 0, 0, $month, $day,           $year, true), $hour);
                }

                // Monthname not found
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, month expected", $date);
                break;

            // year formats
            case self::LEAPYEAR:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('leap year not supported', $date);
                break;

            case self::YEAR_8601:
                if (is_numeric($date)) {
                    if ($calc === 'add') {
                        $date += $year;
                        $calc  = 'set';
                    } else if ($calc === 'sub') {
                        $date = $year - $date;
                        $calc = 'set';
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $month, $day, intval($date), true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year,         true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, year expected", $date);
                break;

            case self::YEAR:
                if (is_numeric($date)) {
                    if ($calc === 'add') {
                        $date += $year;
                        $calc  = 'set';
                    } else if ($calc === 'sub') {
                        $date = $year - $date;
                        $calc = 'set';
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $month, $day, intval($date), true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year,         true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, year expected", $date);
                break;

            case self::YEAR_SHORT:
                if (is_numeric($date)) {
                    $date = intval($date);
                    if (($calc == 'set') || ($calc == 'cmp')) {
                        $date = self::getFullYear($date);
                    }
                    if ($calc === 'add') {
                        $date += $year;
                        $calc  = 'set';
                    } else if ($calc === 'sub') {
                        $date = $year - $date;
                        $calc = 'set';
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $month, $day, $date, true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, year expected", $date);
                break;

            case self::YEAR_SHORT_8601:
                if (is_numeric($date)) {
                    $date = intval($date);
                    if (($calc === 'set') || ($calc === 'cmp')) {
                        $date = self::getFullYear($date);
                    }
                    if ($calc === 'add') {
                        $date += $year;
                        $calc  = 'set';
                    } else if ($calc === 'sub') {
                        $date = $year - $date;
                        $calc = 'set';
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, $month, $day, $date, true),
                                                 $this->mktime(0, 0, 0, $month, $day, $year, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, year expected", $date);
                break;

            // time formats
            case self::MERIDIEM:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('meridiem not supported', $date);
                break;

            case self::SWATCH:
                if (is_numeric($date)) {
                    $rest    = intval($date);
                    $hours   = floor($rest * 24 / 1000);
                    $rest    = $rest - ($hours * 1000 / 24);
                    $minutes = floor($rest * 1440 / 1000);
                    $rest    = $rest - ($minutes * 1000 / 1440);
                    $seconds = floor($rest * 86400 / 1000);
                    return $this->_assign($calc, $this->mktime($hours, $minutes, $seconds, 1, 1, 1970, true),
                                                 $this->mktime($hour,  $minute,  $second,  1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, swatchstamp expected", $date);
                break;

            case self::HOUR_SHORT_AM:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(intval($date), 0, 0, 1, 1, 1970, true),
                                                 $this->mktime($hour,         0, 0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, hour expected", $date);
                break;

            case self::HOUR_SHORT:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(intval($date), 0, 0, 1, 1, 1970, true),
                                                 $this->mktime($hour,         0, 0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, hour expected", $date);
                break;

            case self::HOUR_AM:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(intval($date), 0, 0, 1, 1, 1970, true),
                                                 $this->mktime($hour,         0, 0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, hour expected", $date);
                break;

            case self::HOUR:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(intval($date), 0, 0, 1, 1, 1970, true),
                                                 $this->mktime($hour,         0, 0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, hour expected", $date);
                break;

            case self::MINUTE:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, intval($date), 0, 1, 1, 1970, true),
                                                 $this->mktime(0, $minute,       0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, minute expected", $date);
                break;

            case self::SECOND:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, 0, intval($date), 1, 1, 1970, true),
                                                 $this->mktime(0, 0, $second,       1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, second expected", $date);
                break;

            case self::MILLISECOND:
                if (is_numeric($date)) {
                    switch($calc) {
                        case 'set' :
                            return $this->setMillisecond($date);
                            break;
                        case 'add' :
                            return $this->addMillisecond($date);
                            break;
                        case 'sub' :
                            return $this->subMillisecond($date);
                            break;
                    }
                    return $this->compareMillisecond($date);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, milliseconds expected", $date);
                break;

            case self::MINUTE_SHORT:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, intval($date), 0, 1, 1, 1970, true),
                                                 $this->mktime(0, $minute,       0, 1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, minute expected", $date);
                break;

            case self::SECOND_SHORT:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $this->mktime(0, 0, intval($date), 1, 1, 1970, true),
                                                 $this->mktime(0, 0, $second,       1, 1, 1970, true), false);
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, second expected", $date);
                break;

            // timezone formats
            // break intentionally omitted
            case self::TIMEZONE_NAME:
            case self::TIMEZONE:
            case self::TIMEZONE_SECS:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('timezone not supported', $date);
                break;

            case self::DAYLIGHT:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('daylight not supported', $date);
                break;

            case self::GMT_DIFF:
            case self::GMT_DIFF_SEP:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('gmtdiff not supported', $date);
                break;

            // date strings
            case self::ISO_8601:
                // (-)YYYY-MM-dd
                preg_match('/^(-{0,1}\d{4})-(\d{2})-(\d{2})/', $date, $datematch);
                // (-)YY-MM-dd
                if (empty($datematch)) {
                    preg_match('/^(-{0,1}\d{2})-(\d{2})-(\d{2})/', $date, $datematch);
                }
                // (-)YYYYMMdd
                if (empty($datematch)) {
                    preg_match('/^(-{0,1}\d{4})(\d{2})(\d{2})/', $date, $datematch);
                }
                // (-)YYMMdd
                if (empty($datematch)) {
                    preg_match('/^(-{0,1}\d{2})(\d{2})(\d{2})/', $date, $datematch);
                }
                $tmpdate = $date;
                if (!empty($datematch)) {
                    $tmpdate = iconv_substr($date, iconv_strlen($datematch[0]));
                }
                // (T)hh:mm:ss
                preg_match('/[T,\s]{0,1}(\d{2}):(\d{2}):(\d{2})/', $tmpdate, $timematch);
                if (empty($timematch)) {
                    preg_match('/[T,\s]{0,1}(\d{2})(\d{2})(\d{2})/', $tmpdate, $timematch);
                }
                if (empty($datematch) and empty($timematch)) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("unsupported ISO8601 format ($date)", $date);
                }
                if (!empty($timematch)) {
                    $tmpdate = iconv_substr($tmpdate, iconv_strlen($timematch[0]));
                }
                if (empty($datematch)) {
                    $datematch[1] = 1970;
                    $datematch[2] = 1;
                    $datematch[3] = 1;
                } else if (iconv_strlen($datematch[1]) == 2) {
                    $datematch[1] = self::getFullYear($datematch[1]);
                }
                if (empty($timematch)) {
                    $timematch[1] = 0;
                    $timematch[2] = 0;
                    $timematch[3] = 0;
                }

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$datematch[2];
                    --$month;
                    --$datematch[3];
                    --$day;
                    $datematch[1] -= 1970;
                    $year         -= 1970;
                }
                return $this->_assign($calc, $this->mktime($timematch[1], $timematch[2], $timematch[3], 1 + $datematch[2], 1 + $datematch[3], 1970 + $datematch[1], false),
                                             $this->mktime($hour,         $minute,       $second,       1 + $month,        1 + $day,          1970 + $year,         false), false);
                break;

            case self::RFC_2822:
                $result = preg_match('/^\w{3},\s(\d{1,2})\s(\w{3})\s(\d{4})\s(\d{2}):(\d{2}):{0,1}(\d{0,2})\s([+-]{1}\d{4})$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("no RFC 2822 format ($date)", $date);
                }

                $months  = $this->_getDigitFromName($match[2]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], false),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     false), false);
                break;

            case self::TIMESTAMP:
                if (is_numeric($date)) {
                    return $this->_assign($calc, $date, $this->getUnixTimestamp());
                }
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("invalid date ($date) operand, timestamp expected", $date);
                break;

            // additional formats
            // break intentionally omitted
            case self::ERA:
            case self::ERA_NAME:
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception('era not supported', $date);
                break;

            case self::DATES:
                try {
                    $parsed = Zend_Locale_Format::getDate($date, array('locale' => $locale, 'format_type' => 'iso', 'fix_date' => true));

                    if (($calc == 'set') || ($calc == 'cmp')) {
                        --$parsed['month'];
                        --$month;
                        --$parsed['day'];
                        --$day;
                        $parsed['year'] -= 1970;
                        $year  -= 1970;
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'], true),
                                                 $this->mktime(0, 0, 0, 1 + $month,           1 + $day,           1970 + $year,           true), $hour);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::DATE_FULL:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'full'));
                    $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));

                    if (($calc == 'set') || ($calc == 'cmp')) {
                        --$parsed['month'];
                        --$month;
                        --$parsed['day'];
                        --$day;
                        $parsed['year'] -= 1970;
                        $year  -= 1970;
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'], true),
                                                 $this->mktime(0, 0, 0, 1 + $month,           1 + $day,           1970 + $year,           true), $hour);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::DATE_LONG:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'long'));
                    $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));

                    if (($calc == 'set') || ($calc == 'cmp')){
                        --$parsed['month'];
                        --$month;
                        --$parsed['day'];
                        --$day;
                        $parsed['year'] -= 1970;
                        $year  -= 1970;
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'], true),
                                                 $this->mktime(0, 0, 0, 1 + $month,           1 + $day,           1970 + $year,           true), $hour);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::DATE_MEDIUM:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'medium'));
                    $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));

                    if (($calc == 'set') || ($calc == 'cmp')) {
                        --$parsed['month'];
                        --$month;
                        --$parsed['day'];
                        --$day;
                        $parsed['year'] -= 1970;
                        $year  -= 1970;
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'], true),
                                                 $this->mktime(0, 0, 0, 1 + $month,           1 + $day,           1970 + $year,           true), $hour);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::DATE_SHORT:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'date', array('gregorian', 'short'));
                    $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));

                    $parsed['year'] = self::getFullYear($parsed['year']);

                    if (($calc == 'set') || ($calc == 'cmp')) {
                        --$parsed['month'];
                        --$month;
                        --$parsed['day'];
                        --$day;
                        $parsed['year'] -= 1970;
                        $year  -= 1970;
                    }
                    return $this->_assign($calc, $this->mktime(0, 0, 0, 1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'], true),
                                                 $this->mktime(0, 0, 0, 1 + $month,           1 + $day,           1970 + $year,           true), $hour);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::TIMES:
                try {
                    if ($calc != 'set') {
                        $month = 1;
                        $day   = 1;
                        $year  = 1970;
                    }
                    $parsed = Zend_Locale_Format::getTime($date, array('locale' => $locale, 'format_type' => 'iso', 'fix_date' => true));
                    return $this->_assign($calc, $this->mktime($parsed['hour'], $parsed['minute'], $parsed['second'], $month, $day, $year, true),
                                                 $this->mktime($hour,           $minute,           $second,           $month, $day, $year, true), false);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::TIME_FULL:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'time', array('gregorian', 'full'));
                    $parsed = Zend_Locale_Format::getTime($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));
                    if ($calc != 'set') {
                        $month = 1;
                        $day   = 1;
                        $year  = 1970;
                    }
                    return $this->_assign($calc, $this->mktime($parsed['hour'], $parsed['minute'], 0,       $month, $day, $year, true),
                                                 $this->mktime($hour,           $minute,           $second, $month, $day, $year, true), false);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::TIME_LONG:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'time', array('gregorian', 'long'));
                    $parsed = Zend_Locale_Format::getTime($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));
                    if ($calc != 'set') {
                        $month = 1;
                        $day   = 1;
                        $year  = 1970;
                    }
                    return $this->_assign($calc, $this->mktime($parsed['hour'], $parsed['minute'], $parsed['second'], $month, $day, $year, true),
                                                 $this->mktime($hour,           $minute,           $second,           $month, $day, $year, true), false);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::TIME_MEDIUM:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'time', array('gregorian', 'medium'));
                    $parsed = Zend_Locale_Format::getTime($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));
                    if ($calc != 'set') {
                        $month = 1;
                        $day   = 1;
                        $year  = 1970;
                    }
                    return $this->_assign($calc, $this->mktime($parsed['hour'], $parsed['minute'], $parsed['second'], $month, $day, $year, true),
                                                 $this->mktime($hour,           $minute,           $second,           $month, $day, $year, true), false);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            case self::TIME_SHORT:
                try {
                    $format = Zend_Locale_Data::getContent($locale, 'time', array('gregorian', 'short'));
                    $parsed = Zend_Locale_Format::getTime($date, array('date_format' => $format, 'format_type' => 'iso', 'locale' => $locale));
                    if ($calc != 'set') {
                        $month = 1;
                        $day   = 1;
                        $year  = 1970;
                    }
                    return $this->_assign($calc, $this->mktime($parsed['hour'], $parsed['minute'], 0,       $month, $day, $year, true),
                                                 $this->mktime($hour,           $minute,           $second, $month, $day, $year, true), false);
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage(), $date);
                }
                break;

            // ATOM and RFC_3339 are identical
            case self::ATOM:
            case self::RFC_3339:
                $result = preg_match('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\d{0,4}([+-]{1}\d{2}:\d{2}|Z)$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, ATOM format expected", $date);
                }

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$match[2];
                    --$month;
                    --$match[3];
                    --$day;
                    $match[1] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $match[2], 1 + $match[3], 1970 + $match[1], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,    1 + $day,      1970 + $year,     true), false);
                break;

            case self::COOKIE:
                $result = preg_match("/^\w{6,9},\s(\d{2})-(\w{3})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s.{3,20}$/", $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, COOKIE format expected", $date);
                }
                $match[0] = iconv_substr($match[0], iconv_strpos($match[0], ' ')+1);

                $months    = $this->_getDigitFromName($match[2]);
                $match[3] = self::getFullYear($match[3]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     true), false);
                break;

            case self::RFC_822:
            case self::RFC_1036:
                // new RFC 822 format, identical to RFC 1036 standard
                $result = preg_match('/^\w{0,3},{0,1}\s{0,1}(\d{1,2})\s(\w{3})\s(\d{2})\s(\d{2}):(\d{2}):{0,1}(\d{0,2})\s([+-]{1}\d{4}|\w{1,20})$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, RFC 822 date format expected", $date);
                }

                $months    = $this->_getDigitFromName($match[2]);
                $match[3] = self::getFullYear($match[3]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], false),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     false), false);
                break;

            case self::RFC_850:
                $result = preg_match('/^\w{6,9},\s(\d{2})-(\w{3})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})\s.{3,21}$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, RFC 850 date format expected", $date);
                }

                $months    = $this->_getDigitFromName($match[2]);
                $match[3] = self::getFullYear($match[3]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     true), false);
                break;

            case self::RFC_1123:
                $result = preg_match('/^\w{0,3},{0,1}\s{0,1}(\d{1,2})\s(\w{3})\s(\d{2,4})\s(\d{2}):(\d{2}):{0,1}(\d{0,2})\s([+-]{1}\d{4}|\w{1,20})$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, RFC 1123 date format expected", $date);
                }

                $months  = $this->_getDigitFromName($match[2]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     true), false);
                break;

            case self::RSS:
                $result = preg_match('/^\w{3},\s(\d{2})\s(\w{3})\s(\d{2,4})\s(\d{1,2}):(\d{2}):(\d{2})\s.{1,21}$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, RSS date format expected", $date);
                }

                $months  = $this->_getDigitFromName($match[2]);
                $match[3] = self::getFullYear($match[3]);

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$months;
                    --$month;
                    --$match[1];
                    --$day;
                    $match[3] -= 1970;
                    $year  -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $months, 1 + $match[1], 1970 + $match[3], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,  1 + $day,      1970 + $year,     true), false);
                break;

            case self::W3C:
                $result = preg_match('/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})[+-]{1}\d{2}:\d{2}$/', $date, $match);
                if (!$result) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("invalid date ($date) operand, W3C date format expected", $date);
                }

                if (($calc == 'set') || ($calc == 'cmp')) {
                    --$match[2];
                    --$month;
                    --$match[3];
                    --$day;
                    $match[1] -= 1970;
                    $year     -= 1970;
                }
                return $this->_assign($calc, $this->mktime($match[4], $match[5], $match[6], 1 + $match[2], 1 + $match[3], 1970 + $match[1], true),
                                             $this->mktime($hour,     $minute,   $second,   1 + $month,    1 + $day,      1970 + $year,     true), false);
                break;

            default:
                if (!is_numeric($date) || !empty($part)) {
                    try {
                        if (self::$_options['format_type'] == 'php') {
                            $part = Zend_Locale_Format::convertPhpToIsoFormat($part);
                        }
                        if (empty($part)) {
                            $part  = Zend_Locale_Format::getDateFormat($locale) . " ";
                            $part .= Zend_Locale_Format::getTimeFormat($locale);
                        }
                        $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $part, 'locale' => $locale, 'fix_date' => true, 'format_type' => 'iso'));
                        if ((strpos(strtoupper($part), 'YY') !== false) and (strpos(strtoupper($part), 'YYYY') === false)) {
                            $parsed['year'] = self::getFullYear($parsed['year']);
                        }
                        if (($calc == 'set') || ($calc == 'cmp')) {
                            if (isset($parsed['month'])) {
                                --$parsed['month'];
                            } else {
                                $parsed['month'] = 0;
                            }
                            if (isset($parsed['day'])) {
                                --$parsed['day'];
                            } else {
                                $parsed['day'] = 0;
                            }
                            if (isset($parsed['year'])) {
                                $parsed['year'] -= 1970;
                            } else {
                                $parsed['year'] = 0;
                            }
                        }
                        return $this->_assign($calc, $this->mktime(
                            isset($parsed['hour']) ? $parsed['hour'] : 0,
                            isset($parsed['minute']) ? $parsed['minute'] : 0,
                            isset($parsed['second']) ? $parsed['second'] : 0,
                            1 + $parsed['month'], 1 + $parsed['day'], 1970 + $parsed['year'],
                            false), $this->getUnixTimestamp(), false);
                    } catch (Zend_Locale_Exception $e) {
                        if (!is_numeric($date)) {
                            #require_once 'Zend/Date/Exception.php';
                            throw new Zend_Date_Exception($e->getMessage(), $date);
                        }
                    }
                }
                return $this->_assign($calc, $date, $this->getUnixTimestamp(), false);
                break;
        }
    }

    /**
     * Returns true when both date objects or date parts are equal.
     * For example:
     * 15.May.2000 <-> 15.June.2000 Equals only for Day or Year... all other will return false
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to equal with
     * @param  string                          $part    OPTIONAL Part of the date to compare, if null the timestamp is used
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return boolean
     * @throws Zend_Date_Exception
     */
    public function equals($date, $part = null, $locale = null)
    {
        $result = $this->compare($date, $part, $locale);

        if ($result == 0) {
            return true;
        }
        return false;
    }

    /**
     * Returns if the given date or datepart is earlier
     * For example:
     * 15.May.2000 <-> 13.June.1999 will return true for day, year and date, but not for month
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to compare with
     * @param  string                          $part    OPTIONAL Part of the date to compare, if null the timestamp is used
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return boolean
     * @throws Zend_Date_Exception
     */
    public function isEarlier($date, $part = null, $locale = null)
    {
        $result = $this->compare($date, $part, $locale);

        if ($result == -1) {
            return true;
        }
        return false;
    }

    /**
     * Returns if the given date or datepart is later
     * For example:
     * 15.May.2000 <-> 13.June.1999 will return true for month but false for day, year and date
     * Returns if the given date is later
     *
     * @param  string|integer|array|Zend_Date  $date    Date or datepart to compare with
     * @param  string                          $part    OPTIONAL Part of the date to compare, if null the timestamp is used
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return boolean
     * @throws Zend_Date_Exception
     */
    public function isLater($date, $part = null, $locale = null)
    {
        $result = $this->compare($date, $part, $locale);

        if ($result == 1) {
            return true;
        }
        return false;
    }

    /**
     * Returns only the time of the date as new Zend_Date object
     * For example:
     * 15.May.2000 10:11:23 will return a dateobject equal to 01.Jan.1970 10:11:23
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getTime($locale = null)
    {
        return $this->copyPart(self::TIME_MEDIUM, $locale);
    }

    /**
     * Returns the calculated time
     *
     * @param  string                    $calc    Calculation to make
     * @param  string|integer|array|Zend_Date  $time    Time to calculate with, if null the actual time is taken
     * @param  string                          $format  Timeformat for parsing input
     * @param  string|Zend_Locale              $locale  Locale for parsing input
     * @return integer|Zend_Date  new time
     * @throws Zend_Date_Exception
     */
    private function _time($calc, $time, $format, $locale)
    {
        if (is_null($time)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $time must be set, null is not allowed');
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($time instanceof Zend_Date) {
            // extract time from object
            $time = $time->get(self::TIME_MEDIUM, $locale);
        } else {
            if (is_array($time)) {
                if ((isset($time['hour']) === true) or (isset($time['minute']) === true) or
                    (isset($time['second']) === true)) {
                    $parsed = $time;
                } else {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("no hour, minute or second given in array");
                }
            } else {
                if (self::$_options['format_type'] == 'php') {
                    $format = Zend_Locale_Format::convertPhpToIsoFormat($format);
                }
                try {
                    $parsed = Zend_Locale_Format::getTime($time, array('date_format' => $format, 'locale' => $locale, 'format_type' => 'iso'));
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage());
                }
            }
            $time = new self(0, self::TIMESTAMP, $locale);
            $time->setTimezone('UTC');
            $time->set($parsed['hour'],   self::HOUR);
            $time->set($parsed['minute'], self::MINUTE);
            $time->set($parsed['second'], self::SECOND);
            $time = $time->get(self::TIME_MEDIUM, $locale);
        }

        $return = $this->_calcdetail($calc, $time, self::TIME_MEDIUM, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Sets a new time for the date object. Format defines how to parse the time string.
     * Also a complete date can be given, but only the time is used for setting.
     * For example: dd.MMMM.yyTHH:mm' and 'ss sec'-> 10.May.07T25:11 and 44 sec => 1h11min44sec + 1 day
     * Returned is the new date object and the existing date is left as it was before
     *
     * @param  string|integer|array|Zend_Date  $time    Time to set
     * @param  string                          $format  OPTIONAL Timeformat for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new time
     * @throws Zend_Date_Exception
     */
    public function setTime($time, $format = null, $locale = null)
    {
        return $this->_time('set', $time, $format, $locale);
    }


    /**
     * Adds a time to the existing date. Format defines how to parse the time string.
     * If only parts are given the other parts are set to 0.
     * If no format is given, the standardformat of this locale is used.
     * For example: HH:mm:ss -> 10 -> +10 hours
     *
     * @param  string|integer|array|Zend_Date  $time    Time to add
     * @param  string                          $format  OPTIONAL Timeformat for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new time
     * @throws Zend_Date_Exception
     */
    public function addTime($time, $format = null, $locale = null)
    {
        return $this->_time('add', $time, $format, $locale);
    }


    /**
     * Subtracts a time from the existing date. Format defines how to parse the time string.
     * If only parts are given the other parts are set to 0.
     * If no format is given, the standardformat of this locale is used.
     * For example: HH:mm:ss -> 10 -> -10 hours
     *
     * @param  string|integer|array|Zend_Date  $time    Time to sub
     * @param  string                          $format  OPTIONAL Timeformat for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new time
     * @throws Zend_Date_Exception
     */
    public function subTime($time, $format = null, $locale = null)
    {
        return $this->_time('sub', $time, $format, $locale);
    }


    /**
     * Compares the time from the existing date. Format defines how to parse the time string.
     * If only parts are given the other parts are set to default.
     * If no format us given, the standardformat of this locale is used.
     * For example: HH:mm:ss -> 10 -> 10 hours
     *
     * @param  string|integer|array|Zend_Date  $time    Time to compare
     * @param  string                          $format  OPTIONAL Timeformat for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareTime($time, $format = null, $locale = null)
    {
        return $this->_time('cmp', $time, $format, $locale);
    }

    /**
     * Returns a clone of $this, with the time part set to 00:00:00.
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getDate($locale = null)
    {
        $date = $this->copyPart(self::DATE_FULL, $locale);
        $date->addTimestamp($this->getGmtOffset());
        return $date;
    }

    /**
     * Returns the calculated date
     *
     * @param  string                          $calc    Calculation to make
     * @param  string|integer|array|Zend_Date  $date    Date to calculate with, if null the actual date is taken
     * @param  string                          $format  Date format for parsing
     * @param  string|Zend_Locale              $locale  Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    private function _date($calc, $date, $format, $locale)
    {
        if (is_null($date)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $date must be set, null is not allowed');
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($date instanceof Zend_Date) {
            // extract date from object
            $date = $date->get(self::DATE_FULL, $locale);
        } else {
            if (is_array($date)) {
                if ((isset($time['year']) === true) or (isset($time['month']) === true) or
                    (isset($time['day']) === true)) {
                    $parsed = $time;
                } else {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("no day,month or year given in array");
                }
            } else {
                if (self::$_options['format_type'] == 'php') {
                    $format = Zend_Locale_Format::convertPhpToIsoFormat($format);
                }
                try {
                    $parsed = Zend_Locale_Format::getDate($date, array('date_format' => $format, 'locale' => $locale, 'format_type' => 'iso'));
                    if ((strpos(strtoupper($format), 'YY') !== false) and (strpos(strtoupper($format), 'YYYY') === false)) {
                        $parsed['year'] = self::getFullYear($parsed['year']);
                    }
                } catch (Zend_Locale_Exception $e) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception($e->getMessage());
                }
            }
            $date = new self(0, self::TIMESTAMP, $locale);
            $date->setTimezone('UTC');
            $date->set($parsed['year'], self::YEAR);
            $date->set($parsed['month'], self::MONTH);
            $date->set($parsed['day'], self::DAY);
            $date = $date->get(self::DATE_FULL, $locale);
        }

        $return = $this->_calcdetail($calc, $date, self::DATE_FULL, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Sets a new date for the date object. Format defines how to parse the date string.
     * Also a complete date with time can be given, but only the date is used for setting.
     * For example: MMMM.yy HH:mm-> May.07 22:11 => 01.May.07 00:00
     * Returned is the new date object and the existing time is left as it was before
     *
     * @param  string|integer|array|Zend_Date  $date    Date to set
     * @param  string                          $format  OPTIONAL Date format for parsing
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setDate($date, $format = null, $locale = null)
    {
        return $this->_date('set', $date, $format, $locale);
    }


    /**
     * Adds a date to the existing date object. Format defines how to parse the date string.
     * If only parts are given the other parts are set to 0.
     * If no format is given, the standardformat of this locale is used.
     * For example: MM.dd.YYYY -> 10 -> +10 months
     *
     * @param  string|integer|array|Zend_Date  $date    Date to add
     * @param  string                          $format  OPTIONAL Date format for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addDate($date, $format = null, $locale = null)
    {
        return $this->_date('add', $date, $format, $locale);
    }


    /**
     * Subtracts a date from the existing date object. Format defines how to parse the date string.
     * If only parts are given the other parts are set to 0.
     * If no format is given, the standardformat of this locale is used.
     * For example: MM.dd.YYYY -> 10 -> -10 months
     * Be aware: Subtracting 2 months is not equal to Adding -2 months !!!
     *
     * @param  string|integer|array|Zend_Date  $date    Date to sub
     * @param  string                          $format  OPTIONAL Date format for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subDate($date, $format = null, $locale = null)
    {
        return $this->_date('sub', $date, $format, $locale);
    }


    /**
     * Compares the date from the existing date object, ignoring the time.
     * Format defines how to parse the date string.
     * If only parts are given the other parts are set to 0.
     * If no format is given, the standardformat of this locale is used.
     * For example: 10.01.2000 => 10.02.1999 -> false
     *
     * @param  string|integer|array|Zend_Date  $date    Date to compare
     * @param  string                          $format  OPTIONAL Date format for parsing input
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function compareDate($date, $format = null, $locale = null)
    {
        return $this->_date('cmp', $date, $format, $locale);
    }


    /**
     * Returns the full ISO 8601 date from the date object.
     * Always the complete ISO 8601 specifiction is used. If an other ISO date is needed
     * (ISO 8601 defines several formats) use toString() instead.
     * This function does not return the ISO date as object. Use copy() instead.
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return string
     */
    public function getIso($locale = null)
    {
        return $this->get(self::ISO_8601, $locale);
    }


    /**
     * Sets a new date for the date object. Not given parts are set to default.
     * Only supported ISO 8601 formats are accepted.
     * For example: 050901 -> 01.Sept.2005 00:00:00, 20050201T10:00:30 -> 01.Feb.2005 10h00m30s
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    ISO Date to set
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setIso($date, $locale = null)
    {
        return $this->_calcvalue('set', $date, 'iso', self::ISO_8601, $locale);
    }


    /**
     * Adds a ISO date to the date object. Not given parts are set to default.
     * Only supported ISO 8601 formats are accepted.
     * For example: 050901 -> + 01.Sept.2005 00:00:00, 10:00:00 -> +10h
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    ISO Date to add
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addIso($date, $locale = null)
    {
        return $this->_calcvalue('add', $date, 'iso', self::ISO_8601, $locale);
    }


    /**
     * Subtracts a ISO date from the date object. Not given parts are set to default.
     * Only supported ISO 8601 formats are accepted.
     * For example: 050901 -> - 01.Sept.2005 00:00:00, 10:00:00 -> -10h
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    ISO Date to sub
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subIso($date, $locale = null)
    {
        return $this->_calcvalue('sub', $date, 'iso', self::ISO_8601, $locale);
    }


    /**
     * Compares a ISO date with the date object. Not given parts are set to default.
     * Only supported ISO 8601 formats are accepted.
     * For example: 050901 -> - 01.Sept.2005 00:00:00, 10:00:00 -> -10h
     * Returns if equal, earlier or later
     *
     * @param  string|integer|Zend_Date  $date    ISO Date to sub
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareIso($date, $locale = null)
    {
        return $this->_calcvalue('cmp', $date, 'iso', self::ISO_8601, $locale);
    }


    /**
     * Returns a RFC 822 compilant datestring from the date object.
     * This function does not return the RFC date as object. Use copy() instead.
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return string
     */
    public function getArpa($locale = null)
    {
        return $this->get(self::RFC_822, $locale);
    }


    /**
     * Sets a RFC 822 date as new date for the date object.
     * Only RFC 822 compilant date strings are accepted.
     * For example: Sat, 14 Feb 09 00:31:30 +0100
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    RFC 822 to set
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setArpa($date, $locale = null)
    {
        return $this->_calcvalue('set', $date, 'arpa', self::RFC_822, $locale);
    }


    /**
     * Adds a RFC 822 date to the date object.
     * ARPA messages are used in emails or HTTP Headers.
     * Only RFC 822 compilant date strings are accepted.
     * For example: Sat, 14 Feb 09 00:31:30 +0100
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    RFC 822 Date to add
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addArpa($date, $locale = null)
    {
        return $this->_calcvalue('add', $date, 'arpa', self::RFC_822, $locale);
    }


    /**
     * Subtracts a RFC 822 date from the date object.
     * ARPA messages are used in emails or HTTP Headers.
     * Only RFC 822 compilant date strings are accepted.
     * For example: Sat, 14 Feb 09 00:31:30 +0100
     * Returned is the new date object
     *
     * @param  string|integer|Zend_Date  $date    RFC 822 Date to sub
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subArpa($date, $locale = null)
    {
        return $this->_calcvalue('sub', $date, 'arpa', self::RFC_822, $locale);
    }


    /**
     * Compares a RFC 822 compilant date with the date object.
     * ARPA messages are used in emails or HTTP Headers.
     * Only RFC 822 compilant date strings are accepted.
     * For example: Sat, 14 Feb 09 00:31:30 +0100
     * Returns if equal, earlier or later
     *
     * @param  string|integer|Zend_Date  $date    RFC 822 Date to sub
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareArpa($date, $locale = null)
    {
        return $this->_calcvalue('cmp', $date, 'arpa', self::RFC_822, $locale);
    }


    /**
     * Check if location is supported
     *
     * @param $location array - locations array
     * @return $horizon float
     */
    private function _checkLocation($location)
    {
        if (!isset($location['longitude']) or !isset($location['latitude'])) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('Location must include \'longitude\' and \'latitude\'', $location);
        }
        if (($location['longitude'] > 180) or ($location['longitude'] < -180)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('Longitude must be between -180 and 180', $location);
        }
        if (($location['latitude'] > 90) or ($location['latitude'] < -90)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('Latitude must be between -90 and 90', $location);
        }

        if (!isset($location['horizon'])){
            $location['horizon'] = 'effective';
        }

        switch ($location['horizon']) {
            case 'civil' :
                return -0.104528;
                break;
            case 'nautic' :
                return -0.207912;
                break;
            case 'astronomic' :
                return -0.309017;
                break;
            default :
                return -0.0145439;
                break;
        }
    }


    /**
     * Returns the time of sunrise for this date and a given location as new date object
     * For a list of cities and correct locations use the class Zend_Date_Cities
     *
     * @param  $location array - location of sunrise
     *                   ['horizon']   -> civil, nautic, astronomical, effective (default)
     *                   ['longitude'] -> longitude of location
     *                   ['latitude']  -> latitude of location
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function getSunrise($location)
    {
        $horizon = $this->_checkLocation($location);
        $result = clone $this;
        $result->set($this->calcSun($location, $horizon, true), self::TIMESTAMP);
        return $result;
    }


    /**
     * Returns the time of sunset for this date and a given location as new date object
     * For a list of cities and correct locations use the class Zend_Date_Cities
     *
     * @param  $location array - location of sunset
     *                   ['horizon']   -> civil, nautic, astronomical, effective (default)
     *                   ['longitude'] -> longitude of location
     *                   ['latitude']  -> latitude of location
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function getSunset($location)
    {
        $horizon = $this->_checkLocation($location);
        $result = clone $this;
        $result->set($this->calcSun($location, $horizon, false), self::TIMESTAMP);
        return $result;
    }


    /**
     * Returns an array with the sunset and sunrise dates for all horizon types
     * For a list of cities and correct locations use the class Zend_Date_Cities
     *
     * @param  $location array - location of suninfo
     *                   ['horizon']   -> civil, nautic, astronomical, effective (default)
     *                   ['longitude'] -> longitude of location
     *                   ['latitude']  -> latitude of location
     * @return array - [sunset|sunrise][effective|civil|nautic|astronomic]
     * @throws Zend_Date_Exception
     */
    public function getSunInfo($location)
    {
        $suninfo = array();
        for ($i = 0; $i < 4; ++$i) {
            switch ($i) {
                case 0 :
                    $location['horizon'] = 'effective';
                    break;
                case 1 :
                    $location['horizon'] = 'civil';
                    break;
                case 2 :
                    $location['horizon'] = 'nautic';
                    break;
                case 3 :
                    $location['horizon'] = 'astronomic';
                    break;
            }
            $horizon = $this->_checkLocation($location);
            $result = clone $this;
            $result->set($this->calcSun($location, $horizon, true), self::TIMESTAMP);
            $suninfo['sunrise'][$location['horizon']] = $result;
            $result = clone $this;
            $result->set($this->calcSun($location, $horizon, false), self::TIMESTAMP);
            $suninfo['sunset'][$location['horizon']]  = $result;
        }
        return $suninfo;
    }


    /**
     * Check a given year for leap year.
     *
     * @param  integer|array|Zend_Date  $year  Year to check
     * @return boolean
     */
    public static function checkLeapYear($year)
    {
        if ($year instanceof Zend_Date) {
            $year = (int) $year->get(self::YEAR);
        }
        if (is_array($year)) {
            if (isset($year['year']) === true) {
                $year = $year['year'];
            } else {
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("no year given in array");
            }
        }
        if (!is_numeric($year)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("year ($year) has to be integer for checkLeapYear()", $year);
        }

        return (bool) parent::isYearLeapYear($year);
    }


    /**
     * Returns true, if the year is a leap year.
     *
     * @return boolean
     */
    public function isLeapYear()
    {
        return self::checkLeapYear($this);
    }


    /**
     * Returns if the set date is todays date
     *
     * @return boolean
     */
    public function isToday()
    {
        $today = $this->date('Ymd', $this->_getTime());
        $day   = $this->date('Ymd', $this->getUnixTimestamp());
        return ($today == $day);
    }


    /**
     * Returns if the set date is yesterdays date
     *
     * @return boolean
     */
    public function isYesterday()
    {
        list($year, $month, $day) = explode('-', $this->date('Y-m-d', $this->_getTime()));
        // adjusts for leap days and DST changes that are timezone specific
        $yesterday = $this->date('Ymd', $this->mktime(0, 0, 0, $month, $day -1, $year));
        $day   = $this->date('Ymd', $this->getUnixTimestamp());
        return $day == $yesterday;
    }


    /**
     * Returns if the set date is tomorrows date
     *
     * @return boolean
     */
    public function isTomorrow()
    {
        list($year, $month, $day) = explode('-', $this->date('Y-m-d', $this->_getTime()));
        // adjusts for leap days and DST changes that are timezone specific
        $tomorrow = $this->date('Ymd', $this->mktime(0, 0, 0, $month, $day +1, $year));
        $day   = $this->date('Ymd', $this->getUnixTimestamp());
        return $day == $tomorrow;
    }

    /**
     * Returns the actual date as new date object
     *
     * @param  string|Zend_Locale        $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public static function now($locale = null)
    {
        return new Zend_Date(time(), self::TIMESTAMP, $locale);
    }

    /**
     * Calculate date details
     *
     * @param  string                          $calc    Calculation to make
     * @param  string|integer|array|Zend_Date  $date    Date or Part to calculate
     * @param  string                          $part    Datepart for Calculation
     * @param  string|Zend_Locale              $locale  Locale for parsing input
     * @return integer|string  new date
     * @throws Zend_Date_Exception
     */
    private function _calcdetail($calc, $date, $type, $locale)
    {
        switch($calc) {
            case 'set' :
                return $this->set($date, $type, $locale);
                break;
            case 'add' :
                return $this->add($date, $type, $locale);
                break;
            case 'sub' :
                return $this->sub($date, $type, $locale);
                break;
        }
        return $this->compare($date, $type, $locale);
    }

    /**
     * Internal calculation, returns the requested date type
     *
     * @param  string                    $calc    Calculation to make
     * @param  string|integer|Zend_Date  $value   Datevalue to calculate with, if null the actual value is taken
     * @param  string|Zend_Locale        $locale  Locale for parsing input
     * @return integer|Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    private function _calcvalue($calc, $value, $type, $parameter, $locale)
    {
        if (is_null($value)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("parameter $type must be set, null is not allowed");
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($value instanceof Zend_Date) {
            // extract value from object
            $value = $value->get($parameter, $locale);
        } else if (!is_array($value) && !is_numeric($value) && ($type != 'iso') && ($type != 'arpa')) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("invalid $type ($value) operand", $value);
        }

        $return = $this->_calcdetail($calc, $value, $parameter, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Returns only the year from the date object as new object.
     * For example: 10.May.2000 10:30:00 -> 01.Jan.2000 00:00:00
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getYear($locale = null)
    {
        return $this->copyPart(self::YEAR, $locale);
    }


    /**
     * Sets a new year
     * If the year is between 0 and 69, 2000 will be set (2000-2069)
     * If the year if between 70 and 99, 1999 will be set (1970-1999)
     * 3 or 4 digit years are set as expected. If you need to set year 0-99
     * use set() instead.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $date    Year to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setYear($year, $locale = null)
    {
        return $this->_calcvalue('set', $year, 'year', self::YEAR, $locale);
    }


    /**
     * Adds the year to the existing date object
     * If the year is between 0 and 69, 2000 will be added (2000-2069)
     * If the year if between 70 and 99, 1999 will be added (1970-1999)
     * 3 or 4 digit years are added as expected. If you need to add years from 0-99
     * use add() instead.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $date    Year to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addYear($year, $locale = null)
    {
        return $this->_calcvalue('add', $year, 'year', self::YEAR, $locale);
    }


    /**
     * Subs the year from the existing date object
     * If the year is between 0 and 69, 2000 will be subtracted (2000-2069)
     * If the year if between 70 and 99, 1999 will be subtracted (1970-1999)
     * 3 or 4 digit years are subtracted as expected. If you need to subtract years from 0-99
     * use sub() instead.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $date    Year to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subYear($year, $locale = null)
    {
        return $this->_calcvalue('sub', $year, 'year', self::YEAR, $locale);
    }


    /**
     * Compares the year with the existing date object, ignoring other date parts.
     * For example: 10.03.2000 -> 15.02.2000 -> true
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $year    Year to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareYear($year, $locale = null)
    {
        return $this->_calcvalue('cmp', $year, 'year', self::YEAR, $locale);
    }


    /**
     * Returns only the month from the date object as new object.
     * For example: 10.May.2000 10:30:00 -> 01.May.1970 00:00:00
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getMonth($locale = null)
    {
        return $this->copyPart(self::MONTH, $locale);
    }


    /**
     * Returns the calculated month
     *
     * @param  string                          $calc    Calculation to make
     * @param  string|integer|array|Zend_Date  $month   Month to calculate with, if null the actual month is taken
     * @param  string|Zend_Locale              $locale  Locale for parsing input
     * @return integer|Zend_Date  new time
     * @throws Zend_Date_Exception
     */
    private function _month($calc, $month, $locale)
    {
        if (is_null($month)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $month must be set, null is not allowed');
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($month instanceof Zend_Date) {
            // extract month from object
            $found = $month->get(self::MONTH_SHORT, $locale);
        } else {
            if (is_numeric($month)) {
                $found = $month;
            } else if (is_array($month)) {
                if (isset($month['month']) === true) {
                    $month = $month['month'];
                } else {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("no month given in array");
                }
            } else {
                $monthlist  = Zend_Locale_Data::getList($locale, 'month');
                $monthlist2 = Zend_Locale_Data::getList($locale, 'month', array('gregorian', 'format', 'abbreviated'));

                $monthlist = array_merge($monthlist, $monthlist2);
                $found = 0;
                $cnt = 0;
                foreach ($monthlist as $key => $value) {
                    if (strtoupper($value) == strtoupper($month)) {
                        $found = $key + 1;
                        break;
                    }
                    ++$cnt;
                }
                if ($found == 0) {
                    foreach ($monthlist2 as $key => $value) {
                        if (strtoupper(iconv_substr($value, 0, 1)) == strtoupper($month)) {
                            $found = $key + 1;
                            break;
                        }
                        ++$cnt;
                    }
                }
                if ($found == 0) {
                    #require_once 'Zend/Date/Exception.php';
                    throw new Zend_Date_Exception("unknown month name ($month)", $month);
                }
            }
        }
        $return = $this->_calcdetail($calc, $found, self::MONTH_SHORT, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Sets a new month
     * The month can be a number or a string. Setting months lower then 0 and greater then 12
     * will result in adding or subtracting the relevant year. (12 months equal one year)
     * If a localized monthname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $month   Month to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setMonth($month, $locale = null)
    {
        return $this->_month('set', $month, $locale);
    }


    /**
     * Adds months to the existing date object.
     * The month can be a number or a string. Adding months lower then 0 and greater then 12
     * will result in adding or subtracting the relevant year. (12 months equal one year)
     * If a localized monthname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $month   Month to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addMonth($month, $locale = null)
    {
        return $this->_month('add', $month, $locale);
    }


    /**
     * Subtracts months from the existing date object.
     * The month can be a number or a string. Subtracting months lower then 0 and greater then 12
     * will result in adding or subtracting the relevant year. (12 months equal one year)
     * If a localized monthname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     *
     * @param  string|integer|array|Zend_Date  $month   Month to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subMonth($month, $locale = null)
    {
        return $this->_month('sub', $month, $locale);
    }


    /**
     * Compares the month with the existing date object, ignoring other date parts.
     * For example: 10.03.2000 -> 15.03.1950 -> true
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $month   Month to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareMonth($month, $locale = null)
    {
        return $this->_month('cmp', $month, $locale);
    }


    /**
     * Returns the day as new date object
     * Example: 20.May.1986 -> 20.Jan.1970 00:00:00
     *
     * @param $locale  string|Zend_Locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getDay($locale = null)
    {
        return $this->copyPart(self::DAY_SHORT, $locale);
    }


    /**
     * Returns the calculated day
     *
     * @param $calc    string                    Type of calculation to make
     * @param $day     string|integer|Zend_Date  Day to calculate, when null the actual day is calculated
     * @param $locale  string|Zend_Locale        Locale for parsing input
     * @return Zend_Date|integer
     */
    private function _day($calc, $day, $locale)
    {
        if (is_null($day)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $day must be set, null is not allowed');
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($day instanceof Zend_Date) {
            $day = $day->get(self::DAY_SHORT, $locale);
        }

        if (is_numeric($day)) {
            $type = self::DAY_SHORT;
        } else if (is_array($day)) {
            if (isset($day['day']) === true) {
                $day = $day['day'];
                $type = self::WEEKDAY;
            } else {
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("no day given in array");
            }
        } else {
            switch (iconv_strlen($day)) {
                case 1 :
                   $type = self::WEEKDAY_NARROW;
                    break;
                case 2:
                    $type = self::WEEKDAY_NAME;
                    break;
                case 3:
                    $type = self::WEEKDAY_SHORT;
                    break;
                default:
                    $type = self::WEEKDAY;
                    break;
            }
        }
        $return = $this->_calcdetail($calc, $day, $type, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Sets a new day
     * The day can be a number or a string. Setting days lower then 0 or greater than the number of this months days
     * will result in adding or subtracting the relevant month.
     * If a localized dayname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     * Example: setDay('Montag', 'de_AT'); will set the monday of this week as day.
     *
     * @param  string|integer|array|Zend_Date  $month   Day to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setDay($day, $locale = null)
    {
        return $this->_day('set', $day, $locale);
    }


    /**
     * Adds days to the existing date object.
     * The day can be a number or a string. Adding days lower then 0 or greater than the number of this months days
     * will result in adding or subtracting the relevant month.
     * If a localized dayname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     * Example: addDay('Montag', 'de_AT'); will add the number of days until the next monday
     *
     * @param  string|integer|array|Zend_Date  $month   Day to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addDay($day, $locale = null)
    {
        return $this->_day('add', $day, $locale);
    }


    /**
     * Subtracts days from the existing date object.
     * The day can be a number or a string. Subtracting days lower then 0 or greater than the number of this months days
     * will result in adding or subtracting the relevant month.
     * If a localized dayname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     * Example: subDay('Montag', 'de_AT'); will sub the number of days until the previous monday
     *
     * @param  string|integer|array|Zend_Date  $month   Day to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subDay($day, $locale = null)
    {
        return $this->_day('sub', $day, $locale);
    }


    /**
     * Compares the day with the existing date object, ignoring other date parts.
     * For example: 'Monday', 'en' -> 08.Jan.2007 -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $day     Day to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareDay($day, $locale = null)
    {
        return $this->_day('cmp', $day, $locale);
    }


    /**
     * Returns the weekday as new date object
     * Weekday is always from 1-7
     * Example: 09-Jan-2007 -> 2 = Tuesday -> 02-Jan-1970 (when 02.01.1970 is also Tuesday)
     *
     * @param $locale  string|Zend_Locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getWeekday($locale = null)
    {
        return $this->copyPart(self::WEEKDAY, $locale);
    }


    /**
     * Returns the calculated weekday
     *
     * @param  $calc     string                          Type of calculation to make
     * @param  $weekday  string|integer|array|Zend_Date  Weekday to calculate, when null the actual weekday is calculated
     * @param  $locale   string|Zend_Locale              Locale for parsing input
     * @return Zend_Date|integer
     * @throws Zend_Date_Exception
     */
    private function _weekday($calc, $weekday, $locale)
    {
        if (is_null($weekday)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('parameter $weekday must be set, null is not allowed');
        }

        if ($locale === null) {
            $locale = $this->getLocale();
        }

        if ($weekday instanceof Zend_Date) {
            $weekday = $weekday->get(self::WEEKDAY_8601, $locale);
        }

        if (is_numeric($weekday)) {
            $type = self::WEEKDAY_8601;
        } else if (is_array($weekday)) {
            if (isset($weekday['weekday']) === true) {
                $weekday = $weekday['weekday'];
                $type = self::WEEKDAY;
            } else {
                #require_once 'Zend/Date/Exception.php';
                throw new Zend_Date_Exception("no weekday given in array");
            }
        } else {
            switch(iconv_strlen($weekday)) {
                case 1:
                   $type = self::WEEKDAY_NARROW;
                    break;
                case 2:
                    $type = self::WEEKDAY_NAME;
                    break;
                case 3:
                    $type = self::WEEKDAY_SHORT;
                    break;
                default:
                    $type = self::WEEKDAY;
                    break;
            }
        }
        $return = $this->_calcdetail($calc, $weekday, $type, $locale);
        if ($calc != 'cmp') {
            return $this;
        }
        return $return;
    }


    /**
     * Sets a new weekday
     * The weekday can be a number or a string. If a localized weekday name is given,
     * then it will be parsed as a date in $locale (defaults to the same locale as $this).
     * Returned is the new date object.
     * Example: setWeekday(3); will set the wednesday of this week as day.
     *
     * @param  string|integer|array|Zend_Date  $month   Weekday to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setWeekday($weekday, $locale = null)
    {
        return $this->_weekday('set', $weekday, $locale);
    }


    /**
     * Adds weekdays to the existing date object.
     * The weekday can be a number or a string.
     * If a localized dayname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     * Example: addWeekday(3); will add the difference of days from the begining of the month until
     * wednesday.
     *
     * @param  string|integer|array|Zend_Date  $month   Weekday to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addWeekday($weekday, $locale = null)
    {
        return $this->_weekday('add', $weekday, $locale);
    }


    /**
     * Subtracts weekdays from the existing date object.
     * The weekday can be a number or a string.
     * If a localized dayname is given it will be parsed with the default locale or the optional
     * set locale.
     * Returned is the new date object
     * Example: subWeekday(3); will subtract the difference of days from the begining of the month until
     * wednesday.
     *
     * @param  string|integer|array|Zend_Date  $month   Weekday to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subWeekday($weekday, $locale = null)
    {
        return $this->_weekday('sub', $weekday, $locale);
    }


    /**
     * Compares the weekday with the existing date object, ignoring other date parts.
     * For example: 'Monday', 'en' -> 08.Jan.2007 -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $weekday  Weekday to compare
     * @param  string|Zend_Locale              $locale   OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareWeekday($weekday, $locale = null)
    {
        return $this->_weekday('cmp', $weekday, $locale);
    }


    /**
     * Returns the day of year as new date object
     * Example: 02.Feb.1986 10:00:00 -> 02.Feb.1970 00:00:00
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getDayOfYear($locale = null)
    {
        return $this->copyPart(self::DAY_OF_YEAR, $locale);
    }


    /**
     * Sets a new day of year
     * The day of year is always a number.
     * Returned is the new date object
     * Example: 04.May.2004 -> setDayOfYear(10) -> 10.Jan.2004
     *
     * @param  string|integer|array|Zend_Date  $day     Day of Year to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setDayOfYear($day, $locale = null)
    {
        return $this->_calcvalue('set', $day, 'day of year', self::DAY_OF_YEAR, $locale);
    }


    /**
     * Adds a day of year to the existing date object.
     * The day of year is always a number.
     * Returned is the new date object
     * Example: addDayOfYear(10); will add 10 days to the existing date object.
     *
     * @param  string|integer|array|Zend_Date  $day     Day of Year to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addDayOfYear($day, $locale = null)
    {
        return $this->_calcvalue('add', $day, 'day of year', self::DAY_OF_YEAR, $locale);
    }


    /**
     * Subtracts a day of year from the existing date object.
     * The day of year is always a number.
     * Returned is the new date object
     * Example: subDayOfYear(10); will subtract 10 days from the existing date object.
     *
     * @param  string|integer|array|Zend_Date  $day     Day of Year to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subDayOfYear($day, $locale = null)
    {
        return $this->_calcvalue('sub', $day, 'day of year', self::DAY_OF_YEAR, $locale);
    }


    /**
     * Compares the day of year with the existing date object.
     * For example: compareDayOfYear(33) -> 02.Feb.2007 -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $day     Day of Year to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareDayOfYear($day, $locale = null)
    {
        return $this->_calcvalue('cmp', $day, 'day of year', self::DAY_OF_YEAR, $locale);
    }


    /**
     * Returns the hour as new date object
     * Example: 02.Feb.1986 10:30:25 -> 01.Jan.1970 10:00:00
     *
     * @param $locale  string|Zend_Locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getHour($locale = null)
    {
        return $this->copyPart(self::HOUR, $locale);
    }


    /**
     * Sets a new hour
     * The hour is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> setHour(7); -> 04.May.1993 07:07:25
     *
     * @param  string|integer|array|Zend_Date  $hour    Hour to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setHour($hour, $locale = null)
    {
        return $this->_calcvalue('set', $hour, 'hour', self::HOUR_SHORT, $locale);
    }


    /**
     * Adds hours to the existing date object.
     * The hour is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> addHour(12); -> 05.May.1993 01:07:25
     *
     * @param  string|integer|array|Zend_Date  $hour    Hour to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addHour($hour, $locale = null)
    {
        return $this->_calcvalue('add', $hour, 'hour', self::HOUR_SHORT, $locale);
    }


    /**
     * Subtracts hours from the existing date object.
     * The hour is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> subHour(6); -> 05.May.1993 07:07:25
     *
     * @param  string|integer|array|Zend_Date  $hour    Hour to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subHour($hour, $locale = null)
    {
        return $this->_calcvalue('sub', $hour, 'hour', self::HOUR_SHORT, $locale);
    }


    /**
     * Compares the hour with the existing date object.
     * For example: 10:30:25 -> compareHour(10) -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $hour    Hour to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareHour($hour, $locale = null)
    {
        return $this->_calcvalue('cmp', $hour, 'hour', self::HOUR_SHORT, $locale);
    }


    /**
     * Returns the minute as new date object
     * Example: 02.Feb.1986 10:30:25 -> 01.Jan.1970 00:30:00
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getMinute($locale = null)
    {
        return $this->copyPart(self::MINUTE, $locale);
    }


    /**
     * Sets a new minute
     * The minute is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> setMinute(29); -> 04.May.1993 13:29:25
     *
     * @param  string|integer|array|Zend_Date  $minute  Minute to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setMinute($minute, $locale = null)
    {
        return $this->_calcvalue('set', $minute, 'minute', self::MINUTE_SHORT, $locale);
    }


    /**
     * Adds minutes to the existing date object.
     * The minute is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> addMinute(65); -> 04.May.1993 13:12:25
     *
     * @param  string|integer|array|Zend_Date  $minute  Minute to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addMinute($minute, $locale = null)
    {
        return $this->_calcvalue('add', $minute, 'minute', self::MINUTE_SHORT, $locale);
    }


    /**
     * Subtracts minutes from the existing date object.
     * The minute is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> subMinute(9); -> 04.May.1993 12:58:25
     *
     * @param  string|integer|array|Zend_Date  $minute  Minute to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subMinute($minute, $locale = null)
    {
        return $this->_calcvalue('sub', $minute, 'minute', self::MINUTE_SHORT, $locale);
    }


    /**
     * Compares the minute with the existing date object.
     * For example: 10:30:25 -> compareMinute(30) -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date  $minute  Hour to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareMinute($minute, $locale = null)
    {
        return $this->_calcvalue('cmp', $minute, 'minute', self::MINUTE_SHORT, $locale);
    }


    /**
     * Returns the second as new date object
     * Example: 02.Feb.1986 10:30:25 -> 01.Jan.1970 00:00:25
     *
     * @param  string|Zend_Locale  $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getSecond($locale = null)
    {
        return $this->copyPart(self::SECOND, $locale);
    }


    /**
     * Sets new seconds to the existing date object.
     * The second is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> setSecond(100); -> 04.May.1993 13:08:40
     *
     * @param  string|integer|array|Zend_Date $second Second to set
     * @param  string|Zend_Locale             $locale (Optional) Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function setSecond($second, $locale = null)
    {
        return $this->_calcvalue('set', $second, 'second', self::SECOND_SHORT, $locale);
    }


    /**
     * Adds seconds to the existing date object.
     * The second is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> addSecond(65); -> 04.May.1993 13:08:30
     *
     * @param  string|integer|array|Zend_Date $second Second to add
     * @param  string|Zend_Locale             $locale (Optional) Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function addSecond($second, $locale = null)
    {
        return $this->_calcvalue('add', $second, 'second', self::SECOND_SHORT, $locale);
    }


    /**
     * Subtracts seconds from the existing date object.
     * The second is always a number.
     * Returned is the new date object
     * Example: 04.May.1993 13:07:25 -> subSecond(10); -> 04.May.1993 13:07:15
     *
     * @param  string|integer|array|Zend_Date $second Second to sub
     * @param  string|Zend_Locale             $locale (Optional) Locale for parsing input
     * @return Zend_Date  new date
     * @throws Zend_Date_Exception
     */
    public function subSecond($second, $locale = null)
    {
        return $this->_calcvalue('sub', $second, 'second', self::SECOND_SHORT, $locale);
    }


    /**
     * Compares the second with the existing date object.
     * For example: 10:30:25 -> compareSecond(25) -> 0
     * Returns if equal, earlier or later
     *
     * @param  string|integer|array|Zend_Date $second Second to compare
     * @param  string|Zend_Locale             $locale (Optional) Locale for parsing input
     * @return integer  0 = equal, 1 = later, -1 = earlier
     * @throws Zend_Date_Exception
     */
    public function compareSecond($second, $locale = null)
    {
        return $this->_calcvalue('cmp', $second, 'second', self::SECOND_SHORT, $locale);
    }


    /**
     * Returns the precision for fractional seconds
     *
     * @return integer
     */
    public function getFractionalPrecision()
    {
        return $this->_precision;
    }


    /**
     * Sets a new precision for fractional seconds
     *
     * @param  integer $precision Precision for the fractional datepart 3 = milliseconds
     * @throws Zend_Date_Exception
     * @return void
     */
    public function setFractionalPrecision($precision)
    {
        if (!intval($precision) or ($precision < 0) or ($precision > 9)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("precision ($precision) must be a positive integer less than 10", $precision);
        }
        $this->_precision = (int) $precision;
    }


    /**
     * Returns the milliseconds of the date object
     *
     * @return integer
     */
    public function getMilliSecond()
    {
        return $this->_fractional;
    }


    /**
     * Sets new milliseconds for the date object
     * Example: setMilliSecond(550, 2) -> equals +5 Sec +50 MilliSec
     *
     * @param  integer|Zend_Date $milli     (Optional) Millisecond to set, when null the actual millisecond is set
     * @param  integer           $precision (Optional) Fraction precision of the given milliseconds
     * @return integer|string
     */
    public function setMilliSecond($milli = null, $precision = null)
    {
        if ($milli === null) {
            list($milli, $time) = explode(" ", microtime());
            $milli = intval($milli);
            $precision = 6;
        } else if (!is_numeric($milli)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("invalid milli second ($milli) operand", $milli);
        }

        if ($precision === null) {
            $precision = $this->_precision;
        } else if (!is_int($precision) || $precision < 1 || $precision > 9) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("precision ($precision) must be a positive integer less than 10", $precision);
        }

        $this->_fractional = 0;
        $this->addMilliSecond($milli, $precision);
        return $this->_fractional;
    }


    /**
     * Adds milliseconds to the date object
     *
     * @param  integer|Zend_Date $milli     (Optional) Millisecond to add, when null the actual millisecond is added
     * @param  integer           $precision (Optional) Fractional precision for the given milliseconds
     * @return integer|string
     */
    public function addMilliSecond($milli = null, $precision = null)
    {
        if ($milli === null) {
            list($milli, $time) = explode(" ", microtime());
            $milli = intval($milli);
        } else if (!is_numeric($milli)) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("invalid milli second ($milli) operand", $milli);
        }

        if ($precision === null) {
            $precision = $this->_precision;
        } else if (!is_int($precision) || $precision < 1 || $precision > 9) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("precision ($precision) must be a positive integer less than 10", $precision);
        }

        if ($precision != $this->_precision) {
            if ($precision > $this->_precision) {
                $diff = $precision - $this->_precision;
                $milli = (int) ($milli / (10 * $diff));
            } else {
                $diff = $this->_precision - $precision;
                $milli = (int) ($milli * (10 * $diff));
            }
        }

        $this->_fractional += $milli;
        // Add/sub milliseconds + add/sub seconds

        $max = pow(10, $this->_precision);
        // Milli includes seconds
        if ($this->_fractional >= $max) {
            while ($this->_fractional >= $max) {
                $this->addSecond(1);
                $this->_fractional -= $max;
            }
        }

        if ($this->_fractional < 0) {
            while ($this->_fractional < 0) {
                $this->subSecond(1);
                $this->_fractional += $max;
            }
        }

        return $this->_fractional;
    }


    /**
     * Subtracts a millisecond
     *
     * @param  integer|Zend_Date $milli     (Optional) Millisecond to sub, when null the actual millisecond is subtracted
     * @param  integer           $precision (Optional) Fractional precision for the given milliseconds
     * @return integer
     */
    public function subMilliSecond($milli = null, $precision = null)
    {
        return $this->addMilliSecond(0 - $milli);
    }

    /**
     * Compares only the millisecond part, returning the difference
     *
     * @param  integer|Zend_Date  $milli  OPTIONAL Millisecond to compare, when null the actual millisecond is compared
     * @param  integer            $precision  OPTIONAL Fractional precision for the given milliseconds
     * @return integer
     */
    public function compareMilliSecond($milli = null, $precision = null)
    {
        if ($milli === null) {
            list($milli, $time) = explode(" ", microtime());
            $milli = intval($milli);
        } else if (is_numeric($milli) === false) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("invalid milli second ($milli) operand", $milli);
        }

        if ($precision === null) {
            $precision = $this->_precision;
        } else if (!is_int($precision) || $precision < 1 || $precision > 9) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception("precision ($precision) must be a positive integer less than 10", $precision);
        }

        if ($precision === 0) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception('precision is 0');
        }

        if ($precision != $this->_precision) {
            if ($precision > $this->_precision) {
                $diff = $precision - $this->_precision;
                $milli = (int) ($milli / (10 * $diff));
            } else {
                $diff = $this->_precision - $precision;
                $milli = (int) ($milli * (10 * $diff));
            }
        }

        $comp = $this->_fractional - $milli;
        if ($comp < 0) {
            return -1;
        } else if ($comp > 0) {
            return 1;
        }
        return 0;
    }

    /**
     * Returns the week as new date object using monday as begining of the week
     * Example: 12.Jan.2007 -> 08.Jan.1970 00:00:00
     *
     * @param $locale  string|Zend_Locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     */
    public function getWeek($locale = null)
    {
        return $this->copyPart(self::WEEK, $locale);
    }

    /**
     * Sets a new week. The week is always a number. The day of week is not changed.
     * Returned is the new date object
     * Example: 09.Jan.2007 13:07:25 -> setWeek(1); -> 02.Jan.2007 13:07:25
     *
     * @param  string|integer|array|Zend_Date  $week    Week to set
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function setWeek($week, $locale = null)
    {
        return $this->_calcvalue('set', $week, 'week', self::WEEK, $locale);
    }

    /**
     * Adds a week. The week is always a number. The day of week is not changed.
     * Returned is the new date object
     * Example: 09.Jan.2007 13:07:25 -> addWeek(1); -> 16.Jan.2007 13:07:25
     *
     * @param  string|integer|array|Zend_Date  $week    Week to add
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function addWeek($week, $locale = null)
    {
        return $this->_calcvalue('add', $week, 'week', self::WEEK, $locale);
    }

    /**
     * Subtracts a week. The week is always a number. The day of week is not changed.
     * Returned is the new date object
     * Example: 09.Jan.2007 13:07:25 -> subWeek(1); -> 02.Jan.2007 13:07:25
     *
     * @param  string|integer|array|Zend_Date  $week    Week to sub
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return Zend_Date
     * @throws Zend_Date_Exception
     */
    public function subWeek($week, $locale = null)
    {
        return $this->_calcvalue('sub', $week, 'week', self::WEEK, $locale);
    }

    /**
     * Compares only the week part, returning the difference
     * Returned is the new date object
     * Returns if equal, earlier or later
     * Example: 09.Jan.2007 13:07:25 -> compareWeek(2); -> 0
     *
     * @param  string|integer|array|Zend_Date  $week    Week to compare
     * @param  string|Zend_Locale              $locale  OPTIONAL Locale for parsing input
     * @return integer 0 = equal, 1 = later, -1 = earlier
     */
    public function compareWeek($week, $locale = null)
    {
        return $this->_calcvalue('cmp', $week, 'week', self::WEEK, $locale);
    }

    /**
     * Sets a new standard locale for the date object.
     * This locale will be used for all functions
     * Returned is the really set locale.
     * Example: 'de_XX' will be set to 'de' because 'de_XX' does not exist
     * 'xx_YY' will be set to 'root' because 'xx' does not exist
     *
     * @param  string|Zend_Locale $locale (Optional) Locale for parsing input
     * @throws Zend_Date_Exception When the given locale does not exist
     * @return Zend_Date Provides fluent interface
     */
    public function setLocale($locale = null)
    {
        try {
            $this->_locale = Zend_Locale::findLocale($locale);
        } catch (Zend_Locale_Exception $e) {
            #require_once 'Zend/Date/Exception.php';
            throw new Zend_Date_Exception($e->getMessage());
        }

        return $this;
    }

    /**
     * Returns the actual set locale
     *
     * @return string
     */
    public function getLocale()
    {
        return $this->_locale;
    }

    /**
     * Checks if the given date is a real date or datepart.
     * Returns false if a expected datepart is missing or a datepart exceeds its possible border.
     * But the check will only be done for the expected dateparts which are given by format.
     * If no format is given the standard dateformat for the actual locale is used.
     * f.e. 30.February.2007 will return false if format is 'dd.MMMM.YYYY'
     *
     * @param  string             $date   Date to parse for correctness
     * @param  string             $format (Optional) Format for parsing the date string
     * @param  string|Zend_Locale $locale (Optional) Locale for parsing date parts
     * @return boolean            True when all date parts are correct
     */
    public static function isDate($date, $format = null, $locale = null)
    {
        if (!is_string($date) and !is_numeric($date) and !($date instanceof Zend_Date)) {
            return false;
        }

        if (($format !== null) and (Zend_Locale::isLocale($format, null, false))) {
            $locale = $format;
            $format = null;
        }

        $locale = Zend_Locale::findLocale($locale);

        if ($format === null) {
            $format = Zend_Locale_Format::getDateFormat($locale);
        } else if (self::$_options['format_type'] == 'php') {
            $format = Zend_Locale_Format::convertPhpToIsoFormat($format);
        }

        try {
            $parsed = Zend_Locale_Format::getDate($date, array('locale' => $locale,
                                                  'date_format' => $format, 'format_type' => 'iso',
                                                  'fix_date' => false));

            if (isset($parsed['year']) and ((strpos(strtoupper($format), 'YY') !== false) and
                (strpos(strtoupper($format), 'YYYY') === false))) {
                $parsed['year'] = self::getFullYear($parsed['year']);
            }
        } catch (Zend_Locale_Exception $e) {
            // Date can not be parsed
            return false;
        }

        if (((strpos($format, 'Y') !== false) or (strpos($format, 'y') !== false)) and
            (!isset($parsed['year']))) {
            // Year expected but not found
            return false;
        }

        if ((strpos($format, 'M') !== false) and (!isset($parsed['month']))) {
            // Month expected but not found
            return false;
        }

        if ((strpos($format, 'd') !== false) and (!isset($parsed['day']))) {
            // Day expected but not found
            return false;
        }

        if (((strpos($format, 'H') !== false) or (strpos($format, 'h') !== false)) and
            (!isset($parsed['hour']))) {
            // Hour expected but not found
            return false;
        }

        if ((strpos($format, 'm') !== false) and (!isset($parsed['minute']))) {
            // Minute expected but not found
            return false;
        }

        if ((strpos($format, 's') !== false) and (!isset($parsed['second']))) {
            // Second expected  but not found
            return false;
        }

        // Set not given dateparts
        if (isset($parsed['hour']) === false) {
            $parsed['hour'] = 0;
        }

        if (isset($parsed['minute']) === false) {
            $parsed['minute'] = 0;
        }

        if (isset($parsed['second']) === false) {
            $parsed['second'] = 0;
        }

        if (isset($parsed['month']) === false) {
            $parsed['month'] = 1;
        }

        if (isset($parsed['day']) === false) {
            $parsed['day'] = 1;
        }

        if (isset($parsed['year']) === false) {
            $parsed['year'] = 1970;
        }

        $date      = new self($parsed, null, $locale);
        $timestamp = $date->mktime($parsed['hour'], $parsed['minute'], $parsed['second'],
                                   $parsed['month'], $parsed['day'], $parsed['year']);
        if ($parsed['year'] != $date->date('Y', $timestamp)) {
            // Given year differs from parsed year
            return false;
        }

        if ($parsed['month'] != $date->date('n', $timestamp)) {
            // Given month differs from parsed month
            return false;
        }

        if ($parsed['day'] != $date->date('j', $timestamp)) {
            // Given day differs from parsed day
            return false;
        }

        if ($parsed['hour'] != $date->date('G', $timestamp)) {
            // Given hour differs from parsed hour
            return false;
        }

        if ($parsed['minute'] != $date->date('i', $timestamp)) {
            // Given minute differs from parsed minute
            return false;
        }

        if ($parsed['second'] != $date->date('s', $timestamp)) {
            // Given second differs from parsed second
            return false;
        }

        return true;
    }

}




// tests




// token_get_all-old.js
function token_get_all(source) {
    // Split given source into PHP tokens
    // +      original by: Marco Marchiò
    // +      improved by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: token_name
    // %        note 1: Token numbers depend on the PHP version
    // %        note 2: token_name is only necessary for a non-standard php.js-specific use of this function;
    // %        note 2: if you define an object on this.php_js.phpParser (where "this" is the scope of the
    // %        note 2: token_get_all function (either a namespaced php.js object or the window object)),
    // %        note 2: this function will call that object's methods if they have the same names as the tokens,
    // %        note 2: passing them the string, line number, and token number (in that order)
    // *     example 1: token_get_all('/'+'* comment *'+'/');
    // *     returns 1: [[311, '/* comment */', 1]]

    // Token to number conversion
    var tokens = {
        T_REQUIRE_ONCE:261,
        T_REQUIRE:260,
        T_EVAL:259,
        T_INCLUDE_ONCE:258,
        T_INCLUDE:257,
        T_LOGICAL_OR:262,
        T_LOGICAL_XOR:263,
        T_LOGICAL_AND:264,
        T_PRINT:265,
        T_SR_EQUAL:276,
        T_SL_EQUAL:275,
        T_XOR_EQUAL:274,
        T_OR_EQUAL:273,
        T_AND_EQUAL:272,
        T_MOD_EQUAL:271,
        T_CONCAT_EQUAL:270,
        T_DIV_EQUAL:269,
        T_MUL_EQUAL:268,
        T_MINUS_EQUAL:267,
        T_PLUS_EQUAL:266,
        T_BOOLEAN_OR:277,
        T_BOOLEAN_AND:278,
        T_IS_NOT_IDENTICAL:282,
        T_IS_IDENTICAL:281,
        T_IS_NOT_EQUAL:280,
        T_IS_EQUAL:279,
        T_IS_GREATER_OR_EQUAL:284,
        T_IS_SMALLER_OR_EQUAL:283,
        T_SR:286,
        T_SL:285,
        T_INSTANCEOF:287,
        T_UNSET_CAST:296,
        T_BOOL_CAST:295,
        T_OBJECT_CAST:294,
        T_ARRAY_CAST:293,
        T_STRING_CAST:292,
        T_DOUBLE_CAST:291,
        T_INT_CAST:290,
        T_DEC:289,
        T_INC:288,
        T_CLONE:298,
        T_NEW:297,
        T_EXIT:299,
        T_IF:300,
        T_ELSEIF:301,
        T_ELSE:302,
        T_ENDIF:303,
        T_LNUMBER:304,
        T_DNUMBER:305,
        T_STRING:306,
        T_STRING_VARNAME:307,
        T_VARIABLE:308,
        T_NUM_STRING:309,
        T_INLINE_HTML:310,
        T_CHARACTER:311,
        T_BAD_CHARACTER:312,
        T_ENCAPSED_AND_WHITESPACE:313,
        T_CONSTANT_ENCAPSED_STRING:314,
        T_ECHO:315,
        T_DO:316,
        T_WHILE:317,
        T_ENDWHILE:318,
        T_FOR:319,
        T_ENDFOR:320,
        T_FOREACH:321,
        T_ENDFOREACH:322,
        T_DECLARE:323,
        T_ENDDECLARE:324,
        T_AS:325,
        T_SWITCH:326,
        T_ENDSWITCH:327,
        T_CASE:328,
        T_DEFAULT:329,
        T_BREAK:330,
        T_CONTINUE:331,
        T_GOTO:332,
        T_FUNCTION:333,
        T_CONST:334,
        T_RETURN:335,
        T_TRY:336,
        T_CATCH:337,
        T_THROW:338,
        T_USE:339,
        T_GLOBAL:340,
        T_PUBLIC:346,
        T_PROTECTED:345,
        T_PRIVATE:344,
        T_FINAL:343,
        T_ABSTRACT:342,
        T_STATIC:341,
        T_VAR:347,
        T_UNSET:348,
        T_ISSET:349,
        T_EMPTY:350,
        T_HALT_COMPILER:351,
        T_CLASS:352,
        T_INTERFACE:353,
        T_EXTENDS:354,
        T_IMPLEMENTS:355,
        T_OBJECT_OPERATOR:356,
        T_DOUBLE_ARROW:357,
        T_LIST:358,
        T_ARRAY:359,
        T_CLASS_C:360,
        T_METHOD_C:361,
        T_FUNC_C:362,
        T_LINE:363,
        T_FILE:364,
        T_COMMENT:365,
        T_DOC_COMMENT:366,
        T_OPEN_TAG:367,
        T_OPEN_TAG_WITH_ECHO:368,
        T_CLOSE_TAG:369,
        T_WHITESPACE:370,
        T_START_HEREDOC:371,
        T_END_HEREDOC:372,
        T_DOLLAR_OPEN_CURLY_BRACES:373,
        T_CURLY_OPEN:374,
        T_PAAMAYIM_NEKUDOTAYIM:375,
        T_NAMESPACE:376,
        T_NS_C:377,
        T_DIR:378,
        T_NS_SEPARATOR:379
    },
/**
    tokens = { // using PHP 5.2.6 on Windows, I get these values for token_name()
        T_REQUIRE_ONCE:258,
        T_REQUIRE:259,
        T_EVAL:260,
        T_INCLUDE_ONCE:261,
        T_INCLUDE:262,
        T_LOGICAL_OR:263,
        T_LOGICAL_XOR:264,
        T_LOGICAL_AND:265,
        T_PRINT:266,
        T_SR_EQUAL:267,
        T_SL_EQUAL:268,
        T_XOR_EQUAL:269,
        T_OR_EQUAL:270,
        T_AND_EQUAL:271,
        T_MOD_EQUAL:272,
        T_CONCAT_EQUAL:273,
        T_DIV_EQUAL:274,
        T_MUL_EQUAL:275,
        T_MINUS_EQUAL:276,
        T_PLUS_EQUAL:277,
        T_BOOLEAN_OR:278,
        T_BOOLEAN_AND:279,
        T_IS_NOT_IDENTICAL:280,
        T_IS_IDENTICAL:281,
        T_IS_NOT_EQUAL:282,
        T_IS_EQUAL:283,
        T_IS_GREATER_OR_EQUAL:284,
        T_IS_SMALLER_OR_EQUAL:285,
        T_SR:286,
        T_SL:287,
        T_INSTANCEOF:288,
        T_UNSET_CAST:289,
        T_BOOL_CAST:290,
        T_OBJECT_CAST:291,
        T_ARRAY_CAST:292,
        T_STRING_CAST:293,
        T_DOUBLE_CAST:294,
        T_INT_CAST:295,
        T_DEC:296,
        T_INC:297,
        T_CLONE:298,
        T_NEW:299,
        T_EXIT:300,
        T_IF:301,
        T_ELSEIF:302,
        T_ELSE:303,
        T_ENDIF:304,
        T_LNUMBER:305,
        T_DNUMBER:306,
        T_STRING:307,
        T_STRING_VARNAME:308,
        T_VARIABLE:309,
        T_NUM_STRING:310,
        T_INLINE_HTML:311,
        T_CHARACTER:312,
        T_BAD_CHARACTER:313,
        T_ENCAPSED_AND_WHITESPACE:314,
        T_CONSTANT_ENCAPSED_STRING:315,
        T_ECHO:316,
        T_DO:317,
        T_WHILE:318,
        T_ENDWHILE:319,
        T_FOR:320,
        T_ENDFOR:321,
        T_FOREACH:322,
        T_ENDFOREACH:323,
        T_DECLARE:324,
        T_ENDDECLARE:325,
        T_AS:326,
        T_SWITCH:327,
        T_ENDSWITCH:328,
        T_CASE:329,
        T_DEFAULT:330,
        T_BREAK:331,
        T_CONTINUE:332,
        T_FUNCTION:333,
        T_CONST:334,
        T_RETURN:335,
        T_TRY:336,
        T_CATCH:337,
        T_THROW:338,
        T_USE:339,
        T_GLOBAL:340,
        T_PUBLIC:341,
        T_PROTECTED:342,
        T_PRIVATE:343,
        T_FINAL:344,
        T_ABSTRACT:345,
        T_STATIC:346,
        T_VAR:347,
        T_UNSET:348,
        T_ISSET:349,
        T_EMPTY:350,
        T_HALT_COMPILER:351,
        T_CLASS:352,
        T_INTERFACE:353,
        T_EXTENDS:354,
        T_IMPLEMENTS:355,
        T_OBJECT_OPERATOR:356,
        T_DOUBLE_ARROW:357,
        T_LIST:358,
        T_ARRAY:359,
        T_CLASS_C:360,
        T_METHOD_C:361,
        T_FUNC_C:362,
        T_LINE:363,
        T_FILE:364,
        T_COMMENT:365,
        T_DOC_COMMENT:366,
        T_OPEN_TAG:367,
        T_OPEN_TAG_WITH_ECHO:368,
        T_CLOSE_TAG:369,
        T_WHITESPACE:370,
        T_START_HEREDOC:371,
        T_END_HEREDOC:372,
        T_DOLLAR_OPEN_CURLY_BRACES:373,
        T_CURLY_OPEN:374,
        T_DOUBLE_COLON:375
        /*,UNKNOWN:376,
        UNKNOWN:377,
        UNKNOWN:378,
        UNKNOWN:379,
        UNKNOWN:380,*/
    },
//*/

    // Tokens indentified by a keyword
    keywordsTokens = {
        'abstract':'T_ABSTRACT',
        'as':'T_AS',
        'break':'T_BREAK',
        'case':'T_CASE',
        'catch':'T_CATCH',
        'class':'T_CLASS',
        '__CLASS__':'T_CLASS_C',
        'clone':'T_CLONE',
        'const':'T_CONST',
        'continue':'T_CONTINUE',
        'default':'T_DEFAULT',
        '__DIR__':'T_DIR',
        'do':'T_DO',
        'else':'T_ELSE',
        'enddeclare':'T_ENDDECLARE',
        'endfor':'T_ENDFOR',
        'endforeach':'T_ENDFOREACH',
        'endif':'T_ENDIF',
        'endswitch':'T_ENDSWITCH',
        'endwhile':'T_ENDWHILE',
        'extends':'T_EXTENDS',
        '__FILE__':'T_FILE',
        'final':'T_FINAL',
        'function':'T_FUNCTION',
        '__FUNCTION__':'T_FUNC_C',
        'global':'T_GLOBAL',
        'goto':'T_GOTO',
        'implements':'T_IMPLEMENTS',
        'instanceof':'T_INSTANCEOF',
        'interface':'T_INTERFACE',
        '__LINE__':'T_LINE',
        'and':'T_LOGICAL_AND',
        'or':'T_LOGICAL_OR',
        'xor':'T_LOGICAL_XOR',
        '__METHOD__':'T_METHOD_C',
        '__NAMESPACE__':'T_NS_C',
        'new':'T_NEW',
        'namespace':'T_NAMESPACE',
        'private':'T_PRIVATE',
        'public':'T_PUBLIC',
        'protected':'T_PROTECTED',
        'return':'T_RETURN',
        'static':'T_STATIC',
        'throw':'T_THROW',
        'try':'T_TRY',
        'use':'T_USE',
        'var':'T_VAR',
        'echo':'T_ECHO',
        'exit':'T_EXIT',
        'die':'T_EXIT',
        'include':'T_INCLUDE',
        'include_once':'T_INCLUDE_ONCE',
        'print':'T_PRINT',
        'require':'T_REQUIRE',
        'require_once':'T_REQUIRE_ONCE'
    },
    // Tokens indentified by a keyword followed by a (
    funcLoopCondTokens = {
        'array':'T_ARRAY',
        'declare':'T_DECLARE',
        'elseif':'T_ELSEIF',
        'empty':'T_EMPTY',
        'eval':'T_EVAL',
        'for':'T_FOR',
        'foreach':'T_FOREACH',
        '__halt_compiler':'T_HALT_COMPILER',
        'if':'T_IF',
        'isset':'T_ISSET',
        'list':'T_LIST',
        'switch':'T_SWITCH',
        'unset':'T_UNSET',
        'while':'T_WHILE'
    },
    // Type casting tokens
    castingTokens = {
        'unset':'T_UNSET_CAST',
        'bool':'T_BOOL_CAST',
        'boolean':'T_BOOL_CAST',
        'object':'T_OBJECT_CAST',
        'array':'T_ARRAY_CAST',
        'string':'T_STRING_CAST',
        'binary':'T_STRING_CAST',
        'real':'T_DOUBLE_CAST',
        'double':'T_DOUBLE_CAST',
        'float':'T_DOUBLE_CAST',
        'int':'T_INT_CAST',
        'integer':'T_INT_CAST'
    },
    // 2 chars tokens
    twoCharsTokens = {
        '&&':tokens.T_BOOLEAN_AND,
        '&=':tokens.T_AND_EQUAL,
        '||':tokens.T_BOOLEAN_OR,
        '|=':tokens.T_OR_EQUAL,
        '.=':tokens.T_CONCAT_EQUAL,
        '--':tokens.T_DEC,
        '-=':tokens.T_MINUS_EQUAL,
        '->':tokens.T_OBJECT_OPERATOR,
        '%=':tokens.T_MOD_EQUAL,
        '=>':tokens.T_DOUBLE_ARROW,
        '::':tokens.T_PAAMAYIM_NEKUDOTAYIM,
        '/=':tokens.T_DIV_EQUAL,
        '++':tokens.T_INC,
        '+=':tokens.T_PLUS_EQUAL,
        '<>':tokens.T_IS_NOT_EQUAL,
        '<=':tokens.T_IS_SMALLER_OR_EQUAL,
        '*=':tokens.T_MUL_EQUAL,
        '<%':tokens.T_OPEN_TAG,
        '>=':tokens.T_IS_GREATER_OR_EQUAL,
        '^=':tokens.T_XOR_EQUAL,
        '==':tokens.T_IS_EQUAL,
        '!=':tokens.T_IS_NOT_EQUAL,
        '>>':tokens.T_SR,
        '<<':tokens.T_SL
    },
    // 3 chars tokens
    threeCharsTokens = {
        '===':tokens.T_IS_IDENTICAL,
        '!==':tokens.T_IS_NOT_IDENTICAL,
        '>>=':tokens.T_SR_EQUAL,
        '<<=':tokens.T_SL_EQUAL,
        '<?=':tokens.T_OPEN_TAG_WITH_ECHO,
        '<%=':tokens.T_OPEN_TAG_WITH_ECHO
    },
    // These two variables contain a set of char without an associated token
    nonTokensChar = ';(){}[],~@`', charNoToken = '=+/-*.$|^&<>%!?:',
    // Immediately start an HTML buffer
    buffer = '', bufferType = 'HTML',
    line = 1, isEncapsed, hdlabel, ret = [],
    // Get a word in the code starting from the given index
    getCurrentWord = function (start) {
        var match = (/^([\w]+)\s*(\()?/).exec(source.substr(start));
        return match;
    },
    // Get a type cast construct in the code starting from the given index
    getCurrentCasting = function (start) {
        var match = (/^\(\s*(\w+)\s*\)/).exec(source.substr(start));
        if (match && match[1]) {
            match[1] = match[1].toLowerCase();
        }
        return match;
    },
    // Get a decimal or integer number in the code starting from the given index
    checkCurrentNumber = function (start) {
        var match = (/^\d*\.?\d+(?:x[\da-f]+|e\-?\d+)?/i).exec(source.substr(start));
        if (match) {
            var at;
            if ((/^\d+(?:x[\da-f]+)?$/i).test(match[0])) {at = tokens.T_LNUMBER;}
            else {at = tokens.T_DNUMBER;}
            return [at, match[0]];
        }
        else {return null;}
    },
    // Check if the char at the given index is escaped
    isEscaped = function (start) {
        if (source.charAt(start-1) !== '\\') {return false;}
        var count = 1;
        for (var c = start-2; c>=0; c--) {
            if (source.charAt(c) !== '\\') {break;}
            else {count++;}
        }
        return (count % 2 !== 0);
    },
    // Get the heredoc starting label
    getHeredoc = function (start) {
        var match = (/^(\s*(.*)?)(\r?\n)/i).exec(source.substr(start));
        return match;
    },
    // Get heredoc closing label
    getHeredocClose = function(start, lab) {
        var s = start - 1;
        if (source.charAt(s) !== '\n') {return null;}
        var reg = new RegExp('^' + lab + ';\\r?\\n'),
        match = reg.exec(source.substr(start));
        return match;
    },
    // Get whitespaces at the given position
    // Mode: 0 every whitespace, 1 only next new line, 2 only next space or new line
    getCurrentWhitespaces = function(start, mode) {
        var ascii = source.charCodeAt(start), sp = '';
        if (!mode) {
            while (ascii === 9 || ascii === 10 || ascii === 13 || ascii === 32) {
                sp += source.charAt(start);
                start++;
                ascii = source.charCodeAt(start);
            }
            return sp;
        }
        else if (mode === 1) {
            if (ascii === 10 || (ascii === 13 && source.charCodeAt(start + 1) === 10)) {
                return (ascii === 13 ? source.charAt(start) + source.charAt(start + 1) : source.charAt(start));
            }
            else {return '';}
        }
        else {
            if (ascii === 32 || ascii === 10 || (ascii === 13 && source.charCodeAt(start + 1) === 10)) {
                return (ascii === 13 ? source.charAt(start) + source.charAt(start + 1) : source.charAt(start));
            }
            else {return '';}
        }
    },
    // Count the number of substrings in a given string
    countSubstrings = function (str, sub) {
        if (!str.length || !sub.length) {return 0;}
        var ind = str.indexOf(sub), count = 0;
        while (ind>-1) {
            count++;
            ind = str.indexOf(sub, ind + 1);
        }
        return count;
    },
    // Add a token to the result array
    pushOnRet = function (token, string) {
        if (string === undefined) {ret.push(token);}
        else {ret.push([token, string, line]);}
    },
    oldPushOnRet = pushOnRet;

    var that = this;
    if (this.php_js && this.php_js.phpParser) {
        pushOnRet = function (token, string) {
            var action = that.php_js.phpParser[typeof token === 'number' ? that.token_name(token) : token];
            if (typeof action === 'function') {
                action.call(that.php_js.phpParser, string, line, token);
            }
            oldPushOnRet(token, string);
        };
    }
    // Loop through every character in the string
    for (var i = 0; i < source.length; i++) {
        // Get the current character and its ascii code
        var ch = source.charAt(i), ASCII = source.charCodeAt(i);
        // If is set a buffer then manage it
        if (buffer !== undefined) {
            switch (bufferType) {
                // HTML
                case 'HTML':
                    // If there's no php open tag add the char to the buffer and continue
                    if (ch === '<' && (source.charAt(i + 1) === '?' || source.charAt(i + 1) === '%')) {
                        if (buffer.length) {pushOnRet(tokens.T_INLINE_HTML, buffer);}
                        line += countSubstrings(buffer, '\n');
                        bufferType = undefined;
                        buffer = undefined;
                    }
                    else {
                        buffer += ch;
                        continue;
                    }
                break;
                // Inline comments
                case 'inlineComment':
                    // Stop it if the current char is a new line char otherwise add the char to the buffer
                    buffer += ch;
                    if (ASCII === 10) {
                        pushOnRet(tokens.T_COMMENT, buffer);
                        bufferType = undefined;
                        buffer = undefined;
                        line++;
                    }
                    continue;
                // Multiline e doc comments
                case 'DOCComment':
                case 'multilineComment':
                    // Add the char to the buffer and stop it if there's the close comments sign
                    buffer += ch;
                    if (ch === '*' && source.charAt(i + 1) === '/') {
                        buffer += source.charAt(i + 1);
                        if (bufferType === 'multilineComment') {pushOnRet(tokens.T_COMMENT, buffer);}
                        else {
                            pushOnRet(tokens.T_DOC_COMMENT, buffer);
                        }
                        line += countSubstrings(buffer, '\n');
                        bufferType = undefined;
                        buffer = undefined;
                        i++;
                    }
                    continue;
                // Single quoted strings and double quoted strings
                case 'doubleQuote':
                case 'singleQuote':
                    // If the buffer is a double quote string and the current char is a dollar sign
                    // or a curly bracket and it's not escaped don't skip this part
                    if (bufferType === 'singleQuote' || (ch !== '$' && ch !== '{') || isEscaped(i)) {
                        // Heredoc. If there's a heredoc open and this can close it, close the buffer
                        if (hdlabel && ch === hdlabel.charAt(0) && getHeredocClose(i, hdlabel)) {
                            if (buffer.length) { // Is the fact that token_get_all does report a line break at
                                                             // the end of a HEREDOC, despite it not being counted as
                                                             // part of the HEREDOC, a PHP bug?
                                pushOnRet(tokens.T_ENCAPSED_AND_WHITESPACE, buffer);
                                line += countSubstrings(buffer, '\n');
                            }
                            pushOnRet(tokens.T_END_HEREDOC, hdlabel);
                            i += hdlabel.length - 1;
                            hdlabel = null;
                            bufferType = undefined;
                            buffer = undefined;
                            continue;
                        }
                        else {buffer += ch;}
                        // If the current char is a quote (for single quoted string) or a double quote(for double quoted string)
                        // and it's not escaped close the buffer
                        if (!hdlabel && ((ch === "'" && bufferType === 'singleQuote') ||
                            (ch === '"' && bufferType === 'doubleQuote')) && !isEscaped(i)) {
                            // If the isEncapsed is true add it as a T_ENCAPSED_AND_WHITESPACE otherwise add it as a normal string
                            if (isEncapsed) {
                                if (buffer.length>1) {
                                    pushOnRet(tokens.T_ENCAPSED_AND_WHITESPACE, buffer.substr(0, buffer.length-1));
                                }
                                pushOnRet('"');
                            }
                            else {
                                pushOnRet(tokens.T_CONSTANT_ENCAPSED_STRING, buffer);
                            }
                            line += countSubstrings(buffer, '\n');
                            bufferType = undefined;
                            buffer = undefined;
                        }
                        continue;
                    }
                break;
                // This buffer is activated when {$ is found so if the char is a closed bracket and it's not escaped stop the
                // buffer and reset the double quoted string buffer
                case 'curlyInString':
                    if (ch === '}' && !isEscaped(i)) {
                        pushOnRet('}');
                        bufferType = 'doubleQuote';
                        buffer = '';
                    }
                break;
            }
        }
        var ws;
        if (bufferType !== 'doubleQuote') {
            // Whitespaces
            if (ASCII === 9 || ASCII === 10 || ASCII === 13 || ASCII === 32) {
                ws = getCurrentWhitespaces(i + 1);
                ch += ws;
                pushOnRet(tokens.T_WHITESPACE, ch);
                // If it's new line character increment the line variable
                if (ASCII === 10) {line++;}
                if (ws) {line += countSubstrings(ws, '\n');}
                i += ch.length-1;
                continue;
            }
            // Bad char
            else if (ASCII < 32) {
                pushOnRet(tokens.T_BAD_CHARACTER, ch);
                continue;
            }
            // Char without token: (){}[]
            else if (nonTokensChar.indexOf(ch) !== -1) {
                if (ch === '(') {
                    // Type casting
                    var cast = getCurrentCasting(i);
                    if (cast && castingTokens[cast[1]]) {
                        pushOnRet(castingTokens[cast[1]], cast[0]);
                        i += cast[0].length - 1;
                        continue;
                    }
                }
                pushOnRet(ch);
                continue;
            }
            // Start a comment (with #), single or double quoted string buffer
            else if (ch === '#' || ch === "'" || ch === '"') {
                buffer = ch;
                bufferType = ch === '#' ? 'inlineComment' : (ch === "'" ? 'singleQuote' : 'doubleQuote');
                isEncapsed = false;
                continue;
            }
            // Namespace separator
            else if (ch === '\\') {
                pushOnRet(tokens.T_NS_SEPARATOR, ch);
                continue;
            }
        }
        // Get the current word
        var word = getCurrentWord(i), lowWord = word ? word[1].toLowerCase() : '', nextCharWord = getCurrentWord(i + 1);
        // Keyword
        if (word && (keywordsTokens[word[1]] || keywordsTokens[lowWord])) {
            pushOnRet((keywordsTokens[lowWord] ? tokens[keywordsTokens[lowWord]] : tokens[keywordsTokens[word[1]]]), word[1]);
            i += lowWord.length - 1;
            continue;
        }
        // Functions, loops and condition: every keyword followed by (
        else if (word && word[2] === '(' && funcLoopCondTokens[lowWord]) {
            pushOnRet(tokens[funcLoopCondTokens[lowWord]], word[1]);
            i += lowWord.length - 1;
            continue;
        }
        // Variables
        else if (bufferType !== 'doubleQuote' && ch === '$' && nextCharWord) {
            pushOnRet(tokens.T_VARIABLE, ch + nextCharWord[1]);
            i += nextCharWord[1].length;
            continue;
        }
        // Variables inside strings
        else if (bufferType === 'doubleQuote' && (ch === '$' || ch === '{')) {
            var toInsert = [], changeBuffer = false;
            if (ch === '$') {
                // ${a}
                if (source.charAt(i + 1) === '{') {
                    nextCharWord = getCurrentWord(i + 2);
                    if (nextCharWord) {
                        // Get the next word and check that it is followed by a }
                        var afterChar = source.charAt(i + nextCharWord[0].length + 2);
                        if (afterChar === '}') {
                            toInsert.push([tokens.T_DOLLAR_OPEN_CURLY_BRACES, '${']);
                            toInsert.push([tokens.T_STRING_VARNAME, nextCharWord[0]]);
                            toInsert.push('}');
                            i += nextCharWord[0].length + 2;
                        }
                        // ${a[0]}, ${a[b]}
                        else if (afterChar === '[') {
                            // If it's followed by a [ get the array index
                            var nextNextCharWord = getCurrentWord(i + nextCharWord[0].length + 3);
                            // Check also that it's followed by a ] and a }
                            if (nextNextCharWord && source.charAt(i + nextCharWord[0].length + 3 + nextNextCharWord[0].length) === ']' &&
                                source.charAt(i + nextCharWord[0].length + 3 + nextNextCharWord[0].length + 1) === '}') {
                                toInsert.push([tokens.T_DOLLAR_OPEN_CURLY_BRACES, '${']);
                                toInsert.push([tokens.T_STRING_VARNAME, nextCharWord[0]]);
                                toInsert.push('[');
                                if ((/^\d+$/).test(nextNextCharWord[0])) {toInsert.push([tokens.T_LNUMBER, nextNextCharWord[0]]);}
                                else {toInsert.push([tokens.T_STRING, nextNextCharWord[0]]);}
                                toInsert.push(']');
                                toInsert.push('}');
                                i += nextCharWord[0].length + 3 + nextNextCharWord[0].length + 1;
                            }
                        }
                    }
                }
                // $a
                else {
                    nextCharWord = getCurrentWord(i + 1);
                    if (nextCharWord) {
                        toInsert.push([tokens.T_VARIABLE, ch + nextCharWord[1]]);
                        i += nextCharWord[1].length;
                        // $a[0], $a[b]
                        if (source.charAt(i + 1) === '[') {
                            // If it's an array get its index and check that it's followed by a ]
                            nextCharWord = getCurrentWord(i + 2);
                            if (nextCharWord && source.charAt(i + nextCharWord[0].length + 2) === ']') {
                                toInsert.push('[');
                                if ((/^\d+$/).test(nextCharWord[0])) {
                                    toInsert.push([tokens.T_NUM_STRING, nextCharWord[0]]);
                                }
                                else {
                                    toInsert.push([tokens.T_STRING, nextCharWord[0]]);
                                }
                                toInsert.push(']');
                                i += nextCharWord[0].length + 2;
                            }
                        }
                    }
                }
            }
            // {$a}
            else if (source.charAt(i + 1) === '$') {
                // If there are variables inside brackets parse them as normal code by changing the buffer
                toInsert.push([tokens.T_CURLY_OPEN, ch]);
                changeBuffer = true;
            }
            // If there's nothing to insert it means that it's not a string variable sintax
            if (!toInsert.length) {
                buffer += ch;
                continue;
            }
            // Insert the buffer as with the T_ENCAPSED_AND_WHITESPACE token
            if (!isEncapsed && buffer.charAt(0) === '"') {
                pushOnRet('"');
                buffer = buffer.substr(1);
                isEncapsed = true;
            }
            if (buffer.length) {
                pushOnRet(tokens.T_ENCAPSED_AND_WHITESPACE, buffer);
                line += countSubstrings(buffer, '\n');
                buffer = '';
            }
            // Insert every token found
            for (var ind = 0; ind < toInsert.length; ind++) {
                if (Object.prototype.toString.call(toInsert[ind]) === '[object Array]') {
                    pushOnRet(toInsert[ind][0], toInsert[ind][1]);
                }
                else {
                    pushOnRet(toInsert[ind]);
                }
            }
            // Change the buffer if necessary
            if (changeBuffer) {bufferType = 'curlyInString';}
            continue;
        }
        // Concat the current char with the following
        var couple = ch + source.charAt(i + 1), triplet = couple + source.charAt(i + 2), insString;
        // If it's a three chars token add it and continue
        if (threeCharsTokens[triplet]) {
            pushOnRet(threeCharsTokens[triplet], triplet);
            i += 2;
            continue;
        // If it's a two chars token add it and continue
        }
        else if (triplet === '<<<') { // Avoid being treated as '<<' shift by couple check (handle instead in switch below)
        }
        else if (twoCharsTokens[couple]) {
            pushOnRet(twoCharsTokens[couple], couple);
            i++;
            continue;
        }
        // Other symbols
        switch (couple) {
            // If it's a php closing tag start an HTML buffer
            case '?>':
            case '%>':
                ws = getCurrentWhitespaces(i + 2, 1);
                couple += ws;
                pushOnRet(tokens.T_CLOSE_TAG, couple);
                if (ws && ws.indexOf('\n') !== -1) {line++;}
                i += couple.length - 1;
                buffer = '';
                bufferType = 'HTML';
                continue;
            case '<<':
                // If <<< check for heredoc start
                nextCharWord = getHeredoc(i + 3);
                if (source.charAt(i + 2) === '<' && nextCharWord) {
                    // If there's a heredoc start a double quoted string buffer
                    // because they have the same behaviour
                    bufferType = 'doubleQuote';
                    isEncapsed = true;
                    buffer = '';
                    i += nextCharWord[0].length + 2;
                    hdlabel = nextCharWord[1];
                    pushOnRet(tokens.T_START_HEREDOC, '<<<'+nextCharWord[0]);
                    line++;
                    continue;
                }
            break;
            case '<%':
            case '<?':
                insString = couple;
                if (couple === '<?' && source.charAt(i + 2) === 'p' &&
                    source.charAt(i + 3) === 'h' && source.charAt(i + 4) === 'p') {
                    insString += 'php';
                }
                ws = getCurrentWhitespaces(i + 2 + (insString.length>2 ? 3 : 0), 2);
                insString += ws;
                pushOnRet(tokens.T_OPEN_TAG, insString);
                i += insString.length - 1;
                if (ws && ws.indexOf('\n') !== -1) {line++;}
                continue;
            // Start a multiline comment buffer
            case '/*':
                buffer = couple;
                if (source.charAt(i + 2) === '*' && (/\s/).test(source.charAt(i + 3))) {
                    bufferType = 'DOCComment';
                    buffer += source.charAt(i + 2) + source.charAt(i + 3);
                    i += 2;
                }
                else {bufferType = 'multilineComment';}
                i++;
                continue;
            // Start a comment buffer
            case '//':
                buffer = couple;
                bufferType = 'inlineComment';
                i++;
                continue;
            default:
                insString = checkCurrentNumber(i);
                // Other characters without tokens
                if (charNoToken.indexOf(ch) !== -1) {
                    pushOnRet(ch);
                    continue;
                }
                //  Integer and decimal numbers
                else if (insString) {
                    pushOnRet(insString[0], insString[1]);
                    i += insString[1].length - 1;
                    continue;
                }
            break;
        }
        // If a word was found insert it as a T_STRING
        if (word && word[1]) {
            pushOnRet(tokens.T_STRING, word[1]);
            i += word[1].length - 1;
        }
    }
    // Close the HTML buffer if there's one open
    if (buffer !== undefined && bufferType === 'HTML' && buffer.length) {
        pushOnRet(tokens.T_INLINE_HTML, buffer);
    }
    // Return the token array
    return ret;
}




// token_get_all.js
function token_get_all (source) {
	// Split given source into PHP tokens
	// + original by: Marco Marchiò
	// + improved by: Brett Zamir (http://brett-zamir.me)
	// - depends on: token_name
	// % note 1: Token numbers depend on the PHP version
	// % note 2: token_name is only necessary for a non-standard php.js-specific use of this function;
	// % note 2: if you define an object on this.php_js.phpParser (where "this" is the scope of the
	// % note 2: token_get_all function (either a namespaced php.js object or the window object)),
	// % note 2: this function will call that object's methods if they have the same names as the tokens,
	// % note 2: passing them the string, line number, and token number (in that order)
	// * example 1: token_get_all('/'+'* comment *'+'/');
	// * returns 1: [[310, '/* comment */', 1]]

	// Token to number conversion
    var num,
        nextch,
        word,
        ch,
        parts,
        sym,
        ASCII,
        i = 0,
        that = this,
        length = source.length,
        //Regexp to check if the characters that follow a word are valid as heredoc end declaration
        heredocEndFollowing = /^;?\r?\n/,
        tokens = {
            T_REQUIRE_ONCE: 261,
            T_REQUIRE: 260,
            T_EVAL: 259,
            T_INCLUDE_ONCE: 258,
            T_INCLUDE: 257,
            T_LOGICAL_OR: 262,
            T_LOGICAL_XOR: 263,
            T_LOGICAL_AND: 264,
            T_PRINT: 265,
            T_SR_EQUAL: 276,
            T_SL_EQUAL: 275,
            T_XOR_EQUAL: 274,
            T_OR_EQUAL: 273,
            T_AND_EQUAL: 272,
            T_MOD_EQUAL: 271,
            T_CONCAT_EQUAL: 270,
            T_DIV_EQUAL: 269,
            T_MUL_EQUAL: 268,
            T_MINUS_EQUAL: 267,
            T_PLUS_EQUAL: 266,
            T_BOOLEAN_OR: 277,
            T_BOOLEAN_AND: 278,
            T_IS_NOT_IDENTICAL: 282,
            T_IS_IDENTICAL: 281,
            T_IS_NOT_EQUAL: 280,
            T_IS_EQUAL: 279,
            T_IS_GREATER_OR_EQUAL: 284,
            T_IS_SMALLER_OR_EQUAL: 283,
            T_SR: 286,
            T_SL: 285,
            T_INSTANCEOF: 287,
            T_UNSET_CAST: 296,
            T_BOOL_CAST: 295,
            T_OBJECT_CAST: 294,
            T_ARRAY_CAST: 293,
            T_STRING_CAST: 292,
            T_DOUBLE_CAST: 291,
            T_INT_CAST: 290,
            T_DEC: 289,
            T_INC: 288,
            T_CLONE: 298,
            T_NEW: 297,
            T_EXIT: 299,
            T_IF: 300,
            T_ELSEIF: 301,
            T_ELSE: 302,
            T_ENDIF: 303,
            T_LNUMBER: 304,
            T_DNUMBER: 305,
            T_STRING: 306,
            T_STRING_VARNAME: 307,
            T_VARIABLE: 308,
            T_NUM_STRING: 309,
            T_INLINE_HTML: 310,
            T_CHARACTER: 311,
            T_BAD_CHARACTER: 312,
            T_ENCAPSED_AND_WHITESPACE: 313,
            T_CONSTANT_ENCAPSED_STRING: 314,
            T_ECHO: 315,
            T_DO: 316,
            T_WHILE: 317,
            T_ENDWHILE: 318,
            T_FOR: 319,
            T_ENDFOR: 320,
            T_FOREACH: 321,
            T_ENDFOREACH: 322,
            T_DECLARE: 323,
            T_ENDDECLARE: 324,
            T_AS: 325,
            T_SWITCH: 326,
            T_ENDSWITCH: 327,
            T_CASE: 328,
            T_DEFAULT: 329,
            T_BREAK: 330,
            T_CONTINUE: 331,
            T_GOTO: 332,
            T_FUNCTION: 333,
            T_CONST: 334,
            T_RETURN: 335,
            T_TRY: 336,
            T_CATCH: 337,
            T_THROW: 338,
            T_USE: 339,
            T_GLOBAL: 340,
            T_PUBLIC: 346,
            T_PROTECTED: 345,
            T_PRIVATE: 344,
            T_FINAL: 343,
            T_ABSTRACT: 342,
            T_STATIC: 341,
            T_VAR: 347,
            T_UNSET: 348,
            T_ISSET: 349,
            T_EMPTY: 350,
            T_HALT_COMPILER: 351,
            T_CLASS: 352,
            T_INTERFACE: 353,
            T_EXTENDS: 354,
            T_IMPLEMENTS: 355,
            T_OBJECT_OPERATOR: 356,
            T_DOUBLE_ARROW: 357,
            T_LIST: 358,
            T_ARRAY: 359,
            T_CLASS_C: 360,
            T_METHOD_C: 361,
            T_FUNC_C: 362,
            T_LINE: 363,
            T_FILE: 364,
            T_COMMENT: 365,
            T_DOC_COMMENT: 366,
            T_OPEN_TAG: 367,
            T_OPEN_TAG_WITH_ECHO: 368,
            T_CLOSE_TAG: 369,
            T_WHITESPACE: 370,
            T_START_HEREDOC: 371,
            T_END_HEREDOC: 372,
            T_DOLLAR_OPEN_CURLY_BRACES: 373,
            T_CURLY_OPEN: 374,
            T_PAAMAYIM_NEKUDOTAYIM: 375,
            T_NAMESPACE: 376,
            T_NS_C: 377,
            T_DIR: 378,
            T_NS_SEPARATOR: 379
        },
        //Keywords tokens
        keywordsToken = {
            "abstract": tokens.T_ABSTRACT,
            "array": tokens.T_ARRAY,
            "as": tokens.T_AS,
            "break": tokens.T_BREAK,
            "case": tokens.T_CASE,
            "catch": tokens.T_CATCH,
            "class": tokens.T_CLASS,
            "__CLASS__": tokens.T_CLASS_C,
            "clone": tokens.T_CLONE,
            "const": tokens.T_CONST,
            "continue": tokens.T_CONTINUE,
            "declare": tokens.T_DECLARE,
            "default": tokens.T_DEFAULT,
            "__DIR__": tokens.T_DIR,
            "die": tokens.T_EXIT,
            "do": tokens.T_DO,
            "echo": tokens.T_ECHO,
            "else": tokens.T_ELSE,
            "elseif": tokens.T_ELSEIF,
            "empty": tokens.T_EMPTY,
            "enddeclare": tokens.T_ENDDECLARE,
            "endfor": tokens.T_ENDFOR,
            "endforeach": tokens.T_ENDFOREACH,
            "endif": tokens.T_ENDIF,
            "endswitch": tokens.T_ENDSWITCH,
            "endwhile": tokens.T_ENDWHILE,
            "eval": tokens.T_EVAL,
            "exit": tokens.T_EXIT,
            "extends": tokens.T_EXTENDS,
            "__FILE__": tokens.T_FILE,
            "final": tokens.T_FINAL,
            "for": tokens.T_FOR,
            "foreach": tokens.T_FOREACH,
            "function": tokens.T_FUNCTION,
            "__FUNCTION__": tokens.T_FUNC_C,
            "global": tokens.T_GLOBAL,
            "goto": tokens.T_GOTO,
            "__halt_compiler": tokens.T_HALT_COMPILER,
            "if": tokens.T_IF,
            "implements": tokens.T_IMPLEMENTS,
            "include": tokens.T_INCLUDE,
            "include_once": tokens.T_INCLUDE_ONCE,
            "instanceof": tokens.T_INSTANCEOF,
            "interface": tokens.T_INTERFACE,
            "isset": tokens.T_ISSET,
            "__LINE__": tokens.T_LINE,
            "list": tokens.T_LIST,
            "and": tokens.T_LOGICAL_AND,
            "or": tokens.T_LOGICAL_OR,
            "xor": tokens.T_LOGICAL_XOR,
            "__METHOD__": tokens.T_METHOD_C,
            "namespace": tokens.T_NAMESPACE,
            "__NAMESPACE__": tokens.T_NS_C,
            "new": tokens.T_NEW,
            "print": tokens.T_PRINT,
            "private": tokens.T_PRIVATE,
            "public": tokens.T_PUBLIC,
            "protected": tokens.T_PROTECTED,
            "require": tokens.T_REQUIRE,
            "require_once": tokens.T_REQUIRE_ONCE,
            "return": tokens.T_RETURN,
            "static": tokens.T_STATIC,
            "switch": tokens.T_SWITCH,
            "throw": tokens.T_THROW,
            "try": tokens.T_TRY,
            "unset": tokens.T_UNSET,
            "use": tokens.T_USE,
            "var": tokens.T_VAR,
            "while": tokens.T_WHILE
        },
        //Type casting tokens
        typeCasting = {
            "array": tokens.T_ARRAY_CAST,
            "bool": tokens.T_BOOL_CAST,
            "boolean": tokens.T_BOOL_CAST,
            "real": tokens.T_DOUBLE_CAST,
            "double": tokens.T_DOUBLE_CAST,
            "float": tokens.T_DOUBLE_CAST,
            "int": tokens.T_INT_CAST,
            "integer": tokens.T_INT_CAST,
            "object": tokens.T_OBJECT_CAST,
            "string": tokens.T_STRING_CAST,
            "unset": tokens.T_UNSET_CAST,
            "binary": tokens.T_STRING_CAST
        },
        //Symbols tokens with 2 characters
        symbols2chars = {
            "&=": tokens.T_AND_EQUAL,
            "&&": tokens.T_BOOLEAN_AND,
            "||": tokens.T_BOOLEAN_OR,
            "?>": tokens.T_CLOSE_TAG,
            "%>": tokens.T_CLOSE_TAG,
            ".=": tokens.T_CONCAT_EQUAL,
            "--": tokens.T_DEC,
            "/=": tokens.T_DIV_EQUAL,
            "=>": tokens.T_DOUBLE_ARROW,
            "::": tokens.T_PAAMAYIM_NEKUDOTAYIM,
            "++": tokens.T_INC,
            "==": tokens.T_IS_EQUAL,
            ">=": tokens.T_IS_GREATER_OR_EQUAL,
            "!=": tokens.T_IS_NOT_EQUAL,
            "<>": tokens.T_IS_NOT_EQUAL,
            "<=": tokens.T_IS_SMALLER_OR_EQUAL,
            "-=": tokens.T_MINUS_EQUAL,
            "%=": tokens.T_MOD_EQUAL,
            "*=": tokens.T_MUL_EQUAL,
            "->": tokens.T_OBJECT_OPERATOR,
            "|=": tokens.T_OR_EQUAL,
            "+=": tokens.T_PLUS_EQUAL,
            "<<": tokens.T_SL,
            ">>": tokens.T_SR,
            "^=": tokens.T_XOR_EQUAL,
            "<?": tokens.T_OPEN_TAG
        },
        //Symbols tokens with 3 characters
        symbols3chars = {
            "===": tokens.T_IS_IDENTICAL,
            "!==": tokens.T_IS_NOT_IDENTICAL,
            "<<=": tokens.T_SL_EQUAL,
            ">>=": tokens.T_SR_EQUAL,
            "<?=": tokens.T_OPEN_TAG_WITH_ECHO,
            "<%=": tokens.T_OPEN_TAG_WITH_ECHO
        },
        //Buffer tokens
        bufferTokens = {
            "html": tokens.T_INLINE_HTML,
            "inlineComment": tokens.T_COMMENT,
            "comment": tokens.T_COMMENT,
            "docComment": tokens.T_DOC_COMMENT,
            "singleQuote": tokens.T_CONSTANT_ENCAPSED_STRING,
            "doubleQuotes": tokens.T_CONSTANT_ENCAPSED_STRING,
            "nowdoc": tokens.T_ENCAPSED_AND_WHITESPACE,
            "heredoc": tokens.T_ENCAPSED_AND_WHITESPACE
        },
        //Characters that are emitted as tokens without a code
        singleTokenChars = ";(){}[],~@`=+/-*.$|^&<>%!?:\"'\\",
        //Buffer type. Start an html buffer immediatelly.
        bufferType = "html",
        //Buffer content
        buffer = "",
        //Last emitted token
        lastToken,
        //Results array
        ret = [],
        //Word that started the heredoc or nowdoc buffer
        heredocWord,
        //Line number
        line = 1,
        //Line at which the buffer begins
        lineBuffer = 1,
        //Flag that indicates if the current double quoted string has been splitted
        split,
        //This variable will store the previous buffer type of the tokenizer before parsing a
        //complex variable syntax
        complexVarPrevBuffer,
        //Number of open brackets inside a complex variable syntax
        openBrackets,
        //Function to emit tokens
        emitToken = function (token, code, preventBuffer, l) {
            if (!preventBuffer && bufferType) {
                buffer += token;
                lastToken = null;
            } else {
                lastToken = code || token;
                ret.push(code ? [code, token, l || line] : token);
            }
        },
        //Function to emit and close the current buffer
        emitBuffer = function () {
            buffer && emitToken(buffer, bufferTokens[bufferType], true, lineBuffer);
            buffer = "";
            bufferType = null;
        },
        //Function to check if the token at the current index is escaped
        isEscaped = function (s) {
            var escaped = false,
                c = (s || i) - 1;
            for (; c >= 0; c--) {
                if (source.charAt(c) !== "\\") {
                    break;
                }
                escaped = !escaped;
            }
            return escaped;
        },
        //Returns the number of line feed characters in the given string
        countNewLines = function (str) {
            var i = 0;
            str.replace(/\n/g, function () {
                i++;
            });
            return i;
        },
        //Get the part of source that is between the current index and the index of the limit character
        getBufferAndEmit = function (start, type, limit, canBeEscaped) {
            /*23456*/
            var startL = start.length,
                startPos = i + startL,
                pos = source.indexOf(limit, startPos);
            lineBuffer = line;
            if (canBeEscaped) {
                while (pos !== -1 && isEscaped(pos)) {
                    pos = source.indexOf(limit, pos + 1);
                }
            }
            bufferType = type;
            if (pos === -1) {
                buffer = start + source.substr(startPos);
            } else {
                buffer = start + source.substr(startPos, pos - startPos) + limit;
            }
            line += countNewLines(buffer);
            emitBuffer();
            i = pos + limit.length - 1;
        },
        //This function is used to split a double quoted string or a heredoc buffer after a variable
        //has been found inside it
        splitString = function () {
            //Don't emit empty buffers
            if (!buffer) {
                return;
            }
            //If the buffer is a double quoted string and it has not yet been splitted, emit the double
            //quotes as a token without an associated code
            if (bufferType === "doubleQuotes" && !split) {
                split = true;
                emitToken('"', null, true);
                buffer = buffer.substr(1);
            }
            buffer && emitToken(buffer, tokens.T_ENCAPSED_AND_WHITESPACE, true, lineBuffer);
            buffer = "";
            lineBuffer = line;
        },
        //Checks if the given ASCII identifies a whitespace
        isWhitespace = function (ASCII) {
            return ASCII === 9 || ASCII === 10 || ASCII === 13 || ASCII === 32;
        },
        //Get next whitespaces
        getWhitespaces = function () {
            var as,
                chr,
                ret = "";
            for (i++; i < length; i++) {
                chr = source.charAt(i);
                as = chr.charCodeAt(0);
                if (isWhitespace(as)) {
                    ret += chr;
                } else {
                    i--;
                    break;
                }
            }
            return ret;
        },
        //Get next word
        getWord = function (i) {
            var match = /^[a-zA-Z_]\w*/.exec(source.substr(i));
            return match ? match[0] : null;
        },
        //Get next heredoc declaration
        getHeredocWord = function () {
            return (/^<<< *(['"]?[a-zA-Z]\w*)['"]?\r?\n/).exec(source.substr(i));
        },
        //Get next type casting declaration
        getTypeCasting = function () {
            var match = (/^\( *([a-zA-Z]+) *\)/).exec(source.substr(i));
            return match && match[1] && (match[1].toLowerCase()) in typeCasting ? match : null;
        },
        //Get next php long open declaration
        getLongOpenDeclaration = function (i) {
            return (/^php(?:\r?\s)?/i).exec(source.substr(i));
        },
        //Get next integer or float number
        getNumber = function () {
            var rnum = /^(?:((?:\d+(?:\.\d*)?|\d*\.\d+)[eE][\+\-]?\d+|\d*\.\d+|\d+\.\d*)|(\d+(?:x[0-9a-fA-F]+)?))/,
                match = rnum.exec(source.substr(i));
            if (!match) {
                return null;
            }
            if (match[2]) {
                var isHex = match[2].toLowerCase().indexOf("x") > -1;
                //If it's greater than 2147483648 it's considered as a floating point number
                if (parseInt(isHex ? parseInt(match[2], 16) : match[2], 10) < 2147483648) {
                    return [match[2], tokens.T_LNUMBER];
                }
                return [match[2], tokens.T_DNUMBER];
            }
            return [match[1], tokens.T_DNUMBER];
        };

    // Avoid running a conditional for each token by overwriting function
    if (this.php_js && this.php_js.phpParser) {
        var oldEmitToken = emitToken;
        emitToken = function (token, code, preventBuffer, l) {
            var action = that.php_js.phpParser[typeof token === 'number' ? that.token_name(token) : token];
            // Allow execution of (optional) parsing callbacks during first run-through
            if (typeof action === 'function') {
                action.call(that.php_js.phpParser, code, line, token, preventBuffer, l);
            }
            oldEmitToken(token, code, preventBuffer, l);
        };
    }

	for (; i < length; i++) {
		ch = source.charAt(i);
		ASCII = ch.charCodeAt(0);
		//Whitespaces
		if (isWhitespace(ASCII)) {
			//Get next whitespaces too
			ch += getWhitespaces();
			emitToken(ch, tokens.T_WHITESPACE);
			line += countNewLines(ch);
		} else if (ch === "#" || (ch === "/" && ((nextch = source.charAt(i + 1)) === "*" || nextch === "/"))) {
			//Comment signs
			//Change the buffer only if there's no active buffer
			if (!bufferType) {
				if (ch === "#") {
					getBufferAndEmit("#", "inlineComment", "\n");
				} else if (ch + nextch === "//") {
					getBufferAndEmit("//", "inlineComment", "\n");
				} else if ((ch + nextch + source.charAt(i + 2)) === "/**") {
					getBufferAndEmit(
						"/**",
						//It's a doc comment only if it's followed by a whitespaces
						isWhitespace(source.charCodeAt(i + 3)) ? "docComment" : "comment",
						"*/"
					);
				} else {
					getBufferAndEmit("/*", "comment", "*/");
				}
				continue;
			}
			emitToken(ch);
		} else if (ch === "$" && (word = getWord(i + 1))) {
			//Variable
			if ((bufferType === "heredoc" || bufferType === "doubleQuotes") && !isEscaped()) {
				splitString();
				emitToken(ch + word, tokens.T_VARIABLE, true);
			} else {
				emitToken(ch + word, tokens.T_VARIABLE);
			}
			i += word.length;
		} else if (ch === "<" && source.substr(i + 1, 2) === "<<" && (word = getHeredocWord())) {
			//Heredoc and nowdoc start declaration
			emitToken(word[0], tokens.T_START_HEREDOC);
			line++;
			if (!bufferType) {
				heredocWord = word[1];
				//If the first character is a quote then it's a nowdoc otherwise it's an heredoc
				if (heredocWord.charAt(0) === "'") {
					//Strip the leading quote
					heredocWord = heredocWord.substr(1);
					bufferType = "nowdoc";
				} else {
					if (heredocWord.charAt(0) === '"') {
						heredocWord = heredocWord.substr(1);
					}
					bufferType = "heredoc";
				}
				lineBuffer = line;
			}
			i += word[0].length - 1;
		} else if (ch === "(" && (word = getTypeCasting())) {
			//Type-casting
			emitToken(word[0], typeCasting[word[1].toLowerCase()]);
			i += word[0].length - 1;
		} else if ((ch === "." || (ch >= "0" && ch <= "9")) && (num = getNumber())) {
			//Numbers
			//Numeric array index inside a heredoc or a double quoted string
			if (lastToken === "[" && (bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				emitToken(num[0], tokens.T_NUM_STRING, true);
			} else {
				emitToken(num[0], num[1]);
			}
			i += String(num[0]).length - 1;
		} else if (singleTokenChars.indexOf(ch) > -1) {
			//Symbols
			sym = source.substr(i, 3);
			if (sym in symbols3chars) {
				i += 2;
				//If it's a php open tag emit the html buffer
				if (bufferType === "html" && symbols3chars[sym] === tokens.T_OPEN_TAG_WITH_ECHO) {
					emitBuffer();
				}
				emitToken(sym, symbols3chars[sym]);
				continue;
			}
			sym = ch + source.charAt(i + 1);
			if (sym in symbols2chars) {
				//If it's a php open tag check if it's written in the long form and emit the html buffer
				if (symbols2chars[sym] === tokens.T_OPEN_TAG && bufferType === "html") {
					emitBuffer();
					i++;
					if (word = getLongOpenDeclaration(i + 1)) {
						i += word[0].length;
						sym += word[0];
					}
					emitToken(sym, tokens.T_OPEN_TAG);
					if (sym.indexOf("\n") > -1) {
						line++;
					}
					continue;
				}
				i++;
				//Syntax $obj->prop inside strings and heredoc
				if (sym === "->" && lastToken === tokens.T_VARIABLE && (bufferType === "heredoc" ||
					bufferType === "doubleQuotes")) {
					emitToken(sym, symbols2chars[sym], true);
					continue;
				}
				emitToken(sym, symbols2chars[sym]);
				//If the token is a PHP close tag and there isn't an active buffer start an html buffer
				if (!bufferType && symbols2chars[sym] === tokens.T_CLOSE_TAG) {
					//PHP closing tag includes the following new line characters
					if (nextch = /^\r?\n/.exec(source.substr(i + 1, 2))) {
						ret[ret.length - 1][1] += nextch[0];
						i += nextch[0].length;
						line++;
					}
					bufferType = "html";
					lineBuffer = line;
				}
				continue;
			}
			//Start string buffers if there isn't an active buffer and the character is a quote
			if (!bufferType && (ch === "'" || ch === '"')) {
				if (ch === "'") {
					getBufferAndEmit("'", "singleQuote", "'", true);
				} else {
					split = false;
					bufferType = "doubleQuotes";
					lineBuffer = line;
					//Add the token to the buffer and continue to skip next checks
					emitToken(ch);
				}
				continue;
			} else if (ch === '"' && bufferType === "doubleQuotes" && !isEscaped()) {
				//If the string has been splitted emit the current buffer and the double quotes
				//as separate tokens
				if (split) {
					splitString();
					bufferType = null;
					emitToken('"');
				} else {
					emitToken('"');
					emitBuffer();
				}
				continue;
			} else if (bufferType === "heredoc" || bufferType === "doubleQuotes") {
				//Array index delimiters inside heredoc or double quotes
				if ((ch === "[" && lastToken === tokens.T_VARIABLE) ||
                        (ch === "]" && (lastToken === tokens.T_NUM_STRING ||
                        lastToken === tokens.T_STRING))) {
					emitToken(ch, null, true);
					continue;
				} else if (((ch === "$" && source.charAt(i + 1) === "{") ||
							(ch === "{" && source.charAt(i + 1) === "$")) &&
							!isEscaped()) {
					//Complex variable syntax ${varname} or {$varname}. Store the current
					//buffer type and evaluate next tokens as there's no active buffer.
					//The current buffer will be reset when the declaration is closed
					splitString();
					complexVarPrevBuffer = bufferType;
					bufferType = null;
					if (ch === "$") {
						emitToken(ch + "{", tokens.T_DOLLAR_OPEN_CURLY_BRACES);
						i++;
					} else {
						emitToken(ch, tokens.T_CURLY_OPEN);
					}
					openBrackets = 1;
					continue;
				}
			} else if (ch === "\\") {
				//Namespace separator
				emitToken(ch, tokens.T_NS_SEPARATOR);
				continue;
			}
			emitToken(ch);
			//Increment or decrement the number of open brackets inside a complex
			//variable syntax
			if (complexVarPrevBuffer && (ch === "{" || ch === "}")) {
				if (ch === "{") {
					openBrackets++;
				} else if (!--openBrackets) {
					//If every bracket has been closed reset the previous buffer
					bufferType = complexVarPrevBuffer;
					complexVarPrevBuffer = null;
				}
			}
		} else if (word = getWord(i)) {
			//Words
			var wordLower = word.toLowerCase();
			//Check to see if it's a keyword
			if (keywordsToken.hasOwnProperty(word) || keywordsToken.hasOwnProperty(wordLower)) {
				//If it's preceded by -> than it's an object property and it must be tokenized as T_STRING
				emitToken(
					word,
					lastToken === tokens.T_OBJECT_OPERATOR ?
                        tokens.T_STRING :
                        keywordsToken[word] || keywordsToken[wordLower]
				);
				i += word.length - 1;
				continue;
			}
			//Stop the heredoc or the nowdoc if it's the word that has generated it
			if ((bufferType === "nowdoc" || bufferType === "heredoc") && word === heredocWord &&
                    source.charAt(i - 1) === "\n" &&
                    heredocEndFollowing.test(source.substr(i + word.length))) {
				emitBuffer();
				emitToken(word, tokens.T_END_HEREDOC);
				i += word.length - 1;
				continue;
			} else if ((bufferType === "heredoc" || bufferType === "doubleQuotes")) {
				if (lastToken === "[") {
					//Literal array index inside a heredoc or a double quoted string
					emitToken(word, tokens.T_STRING, true);
					i += word.length - 1;
					continue;
				} else if (lastToken === tokens.T_OBJECT_OPERATOR) {
					//Syntax $obj->prop inside strings and heredoc
					emitToken(word, tokens.T_STRING, true);
					i += word.length - 1;
					continue;
				}
			} else if (complexVarPrevBuffer && lastToken === tokens.T_DOLLAR_OPEN_CURLY_BRACES) {
				//Complex variable syntax  ${varname}
				emitToken(word, tokens.T_STRING_VARNAME);
				i += word.length - 1;
				continue;
			}
			emitToken(word, tokens.T_STRING);
			i += word.length - 1;
		} else if (ASCII < 32) {
			//If below ASCII 32 it's a bad character
			emitToken(ch, tokens.T_BAD_CHARACTER);
		} else {
			//If there isn't an open buffer there should be an syntax error, but we don't care
			//so it will be emitted as a simple string
			emitToken(ch, tokens.T_STRING);
		}
	}
	//If there's an open buffer emit it
	if (bufferType && (bufferType !== "doubleQuotes" || !split)) {
		emitBuffer();
	} else {
		splitString();
	}
	return ret;
}




// tokenizer.php
<?php
function toUTF ($val)
{
	if (is_array($val)) {
		return array_map("toUTF", $val);
	} elseif (is_string($val)) {
		return utf8_encode($val);
	}
	return $val;
}

$content = file_get_contents("tests/" . $_POST["file"]);
$result = array(token_get_all($content), $content);
$result = array_map("toUTF", $result);
die(json_encode($result));



// tokenizer_tests




// var_export.js
function var_export (mixed_expression, bool_return) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: johnrembo
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   input by: Brian Tafoya (http://www.premasolutions.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // -    depends on: echo
    // *     example 1: var_export(null);
    // *     returns 1: null
    // *     example 2: var_export({0: 'Kevin', 1: 'van', 2: 'Zonneveld'}, true);
    // *     returns 2: "array (\n  0 => 'Kevin',\n  1 => 'van',\n  2 => 'Zonneveld'\n)"
    // *     example 3: data = 'Kevin';
    // *     example 3: var_export(data, true);
    // *     returns 3: "'Kevin'"

    var retstr = '',
        iret = '',
        cnt = 0,
        x = [],
        i = 0,
        funcParts = [],
        idtLevel = arguments[2] || 2, // We use the last argument (not part of PHP) to pass in our indentation level
        innerIndent = '', outerIndent = '';

    var getFuncName = function (fn) {
        var name = (/\W*function\s+([\w\$]+)\s*\(/).exec(fn);
        if (!name) {
            return '(Anonymous)';
        }
        return name[1];
    };

    var _makeIndent = function (idtLevel) {
        return (new Array(idtLevel+1)).join(' ');
    };

    var __getType = function (inp) {
        var i = 0;
        var match, type = typeof inp;
        if (type === 'object' && inp.constructor && getFuncName(inp.constructor) === 'PHPJS_Resource') {
            return 'resource';
        }
        if (type === 'function') {
            return 'function';
        }
        if (type === 'object' && !inp) {
            return 'null'; // Should this be just null?
        }
        if (type === "object") {
            if (!inp.constructor) {
                return 'object';
            }
            var cons = inp.constructor.toString();
            match = cons.match(/(\w+)\(/);
            if (match) {
                cons = match[1].toLowerCase();
            }
            var types = ["boolean", "number", "string", "array"];
            for (i=0; i < types.length; i++) {
                if (cons === types[i]) {
                    type = types[i];
                    break;
                }
            }
        }
        return type;
    };
    var type = __getType(mixed_expression);

    if (type === null) {
        retstr = "NULL";
    } else if (type === 'array' || type === 'object') {
        outerIndent = _makeIndent(idtLevel-2);
        innerIndent = _makeIndent(idtLevel);
        for (i in mixed_expression) {
            var value = this.var_export(mixed_expression[i], true, idtLevel+2);
            value = typeof value === 'string' ? value.replace(/</g, '&lt;').replace(/>/g, '&gt;') : value;
            x[cnt++] = innerIndent+i+' => '+(__getType(mixed_expression[i]) === 'array' ? '\n' : '')+value;
        }
        iret = x.join(',\n');
        retstr = outerIndent+"array (\n"+iret+'\n'+outerIndent+')';
    }
    else if (type === 'function') {
        funcParts = mixed_expression.toString().match(/function .*?\((.*?)\) \{([\s\S]*)\}/);

        // For lambda functions, var_export() outputs such as the following:  '\000lambda_1'
        // Since it will probably not be a common use to expect this (unhelpful) form, we'll use another PHP-exportable
        // construct, create_function() (though dollar signs must be on the variables in JavaScript); if using instead
        // in JavaScript and you are using the namespaced version, note that create_function() will not be available
        // as a global
        retstr = "create_function ('"+funcParts[1]+"', '"+funcParts[2].replace(new RegExp("'", 'g'), "\\'")+"')";
    }
    else if (type === 'resource') {
        retstr = 'NULL'; // Resources treated as null for var_export
    } else {
        retstr = (typeof ( mixed_expression ) !== 'string') ? mixed_expression : "'" + mixed_expression.replace(/(["'])/g, "\\$1").replace(/\0/g, "\\0") + "'";
    }

    if (bool_return !== true) {
        this.echo(retstr);
        return null;
    } else {
        return retstr;
    }
}

function echo () {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: echo is bad
    // +   improved by: Nate
    // +    revised by: Der Simon (http://innerdom.sourceforge.net/)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Eugene Bulkin (http://doubleaw.com/)
    // +   input by: JB
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: If browsers start to support DOM Level 3 Load and Save (parsing/serializing),
    // %        note 1: we wouldn't need any such long code (even most of the code below). See
    // %        note 1: link below for a cross-browser implementation in JavaScript. HTML5 might
    // %        note 1: possibly support DOMParser, but that is not presently a standard.
    // %        note 2: Although innerHTML is widely used and may become standard as of HTML5, it is also not ideal for
    // %        note 2: use with a temporary holder before appending to the DOM (as is our last resort below),
    // %        note 2: since it may not work in an XML context
    // %        note 3: Using innerHTML to directly add to the BODY is very dangerous because it will
    // %        note 3: break all pre-existing references to HTMLElements.
    // *     example 1: echo('<div><p>abc</p><p>abc</p></div>');
    // *     returns 1: undefined

    var arg = '', argc = arguments.length, argv = arguments, i = 0;
    var win = this.window;
    var d = win.document;
    var ns_xhtml = 'http://www.w3.org/1999/xhtml';
    var ns_xul = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul'; // If we're in a XUL context

    var holder;

    var stringToDOM = function (str, parent, ns, container) {
        var extraNSs = '';
        if (ns === ns_xul) {
            extraNSs = ' xmlns:html="'+ns_xhtml+'"';
        }
        var stringContainer = '<'+container+' xmlns="'+ns+'"'+extraNSs+'>'+str+'</'+container+'>';
        if (win.DOMImplementationLS &&
            win.DOMImplementationLS.createLSInput &&
            win.DOMImplementationLS.createLSParser) { // Follows the DOM 3 Load and Save standard, but not
            // implemented in browsers at present; HTML5 is to standardize on innerHTML, but not for XML (though
            // possibly will also standardize with DOMParser); in the meantime, to ensure fullest browser support, could
            // attach http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.js (see http://svn2.assembla.com/svn/brettz9/DOMToString/DOM3.xhtml for a simple test file)
            var lsInput = DOMImplementationLS.createLSInput();
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            lsInput.stringData = stringContainer;
            var lsParser = DOMImplementationLS.createLSParser(1, null); // synchronous, no schema type
            return lsParser.parse(lsInput).firstChild;
        }
        else if (win.DOMParser) {
            // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
            try {
                var fc = new DOMParser().parseFromString(stringContainer, 'text/xml');
                if (!fc || !fc.documentElement ||
                        fc.documentElement.localName !== 'parsererror' ||
                        fc.documentElement.namespaceURI !== 'http://www.mozilla.org/newlayout/xml/parsererror.xml') {
                    return fc.documentElement.firstChild;
                }
                // If there's a parsing error, we just continue on
            }
            catch(e) {
                // If there's a parsing error, we just continue on
            }
        }
        else if (win.ActiveXObject) { // We don't bother with a holder in Explorer as it doesn't support namespaces
            var axo = new ActiveXObject('MSXML2.DOMDocument');
            axo.loadXML(str);
            return axo.documentElement;
        }
        /*else if (win.XMLHttpRequest) { // Supposed to work in older Safari
            var req = new win.XMLHttpRequest;
            req.open('GET', 'data:application/xml;charset=utf-8,'+encodeURIComponent(str), false);
            if (req.overrideMimeType) {
                req.overrideMimeType('application/xml');
            }
            req.send(null);
            return req.responseXML;
        }*/
        // Document fragment did not work with innerHTML, so we create a temporary element holder
        // If we're in XHTML, we'll try to allow the XHTML namespace to be available by default
        //if (d.createElementNS && (d.contentType && d.contentType !== 'text/html')) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways)
        if (d.createElementNS &&  // Browser supports the method
            d.documentElement.namespaceURI && (d.documentElement.namespaceURI !== null || // We can use if the document is using a namespace
            d.documentElement.nodeName.toLowerCase() !== 'html' || // We know it's not HTML4 or less, if the tag is not HTML (even if the root namespace is null)
            (d.contentType && d.contentType !== 'text/html') // We know it's not regular HTML4 or less if this is Mozilla (only browser supporting the attribute) and the content type is something other than text/html; other HTML5 roots (like svg) still have a namespace
        )) { // Don't create namespaced elements if we're being served as HTML (currently only Mozilla supports this detection in true XHTML-supporting browsers, but Safari and Opera should work with the above DOMParser anyways, and IE doesn't support createElementNS anyways); last test is for the sake of being in a pure XML document
            holder = d.createElementNS(ns, container);
        }
        else {
            holder = d.createElement(container); // Document fragment did not work with innerHTML
        }
        holder.innerHTML = str;
        while (holder.firstChild) {
            parent.appendChild(holder.firstChild);
        }
        return false;
        // throw 'Your browser does not support DOM parsing as required by echo()';
    };


    var ieFix = function (node) {
        if (node.nodeType === 1) {
            var newNode = d.createElement(node.nodeName);
            var i, len;
            if (node.attributes && node.attributes.length > 0) {
                for (i = 0, len = node.attributes.length; i < len; i++) {
                    newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i].nodeName));
                }
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (i = 0, len = node.childNodes.length; i < len; i++) {
                    newNode.appendChild(ieFix(node.childNodes[i]));
                }
            }
            return newNode;
        }
        else {
            return d.createTextNode(node.nodeValue);
        }
    };

    for (i = 0; i < argc; i++ ) {
        arg = argv[i];
        if (this.php_js && this.php_js.ini && this.php_js.ini['phpjs.echo_embedded_vars']) {
            arg = arg.replace(/(.?)\{\$(.*?)\}/g, function (s, m1, m2) {
                // We assume for now that embedded variables do not have dollar sign; to add a dollar sign, you currently must use {$$var} (We might change this, however.)
                // Doesn't cover all cases yet: see http://php.net/manual/en/language.types.string.php#language.types.string.syntax.double
                if (m1 !== '\\') {
                    return m1+eval(m2);
                }
                else {
                    return s;
                }
            });
        }
        if (d.appendChild) {
            if (d.body) {
                if (win.navigator.appName === 'Microsoft Internet Explorer') { // We unfortunately cannot use feature detection, since this is an IE bug with cloneNode nodes being appended
                    d.body.appendChild(stringToDOM(ieFix(arg)));
                }
                else {
                    var unappendedLeft = stringToDOM(arg, d.body, ns_xhtml, 'div').cloneNode(true); // We will not actually append the div tag (just using for providing XHTML namespace by default)
                    if (unappendedLeft) {
                        d.body.appendChild(unappendedLeft);
                    }
                }
            } else {
                d.documentElement.appendChild(stringToDOM(arg, d.documentElement, ns_xul, 'description')); // We will not actually append the description tag (just using for providing XUL namespace by default)
            }
        } else if (d.write) {
            d.write(arg);
        }/* else { // This could recurse if we ever add print!
            print(arg);
        }*/
    }
}





// debug_zval_dump.js
// We are not going to port this




// is_numeric.js
function is_numeric(mixed_var) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: David
  // +   improved by: taith
  // +   bugfixed by: Tim de Koning
  // +   bugfixed by: WebDevHobo (http://webdevhobo.blogspot.com/)
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Rafał Kukawski (http://blog.kukawski.pl)
  // *     example 1: is_numeric(186.31);
  // *     returns 1: true
  // *     example 2: is_numeric('Kevin van Zonneveld');
  // *     returns 2: false
  // *     example 3: is_numeric('+186.31e2');
  // *     returns 3: true
  // *     example 4: is_numeric('');
  // *     returns 4: false
  // *     example 4: is_numeric([]);
  // *     returns 4: false

  // The old implementation doesn't work correctly with strings containing white characters at the beginnig or at the end
  // eg. "\t123\t". phpjs function returns true, where PHP returns false

  // The function below should cover the case described above,
  // Still thinking about removing the regex, but have no better idea
  // also type checking is still required, because one-element arrays
  // are serialized to valid numeric strings and numbers (+[3.14] -> 3.14)
  // and PHP returns false for arrays
  var type = typeof mixed_var,
      /*
            ^ # the string has to begin with
            [+\-]? # optional sign character
            (?:
                0x[\da-f]+ # should be proper HEX value
                | # or
                (?:
                    (?:
                        \d+(?:\.\d*)? # integer part with optional decimal part (0, 000, 001, 3, 3.14 or 3.)
                        | # or
                        \.\d+ # just the decimal part (.14)
                    )
                )
                (e[+\-]?\d+)? # and with optional scientific notation e2, e-2, e+2
            )
            $
        */
      valid_number = /^[+\-]?(?:0x[\da-f]+|(?:(?:\d+(?:\.\d*)?|\.\d+))(e[+\-]?\d+)?)$/i;

  return !isNaN(mixed_var) && (type === 'number' || (type === 'string' && valid_number.test(mixed_var));
}




// var_inspect.js
function var_inspect() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: This function has not been documented yet (for PHP 6)
  // *     example 1: var_inspect('Vie\u0302\u0323t Nam');
  // *     returns 1: true

  // Incomplete (only started for Unicode)

  // see http://www.slideshare.net/manuellemos/php-for-grownups-presentation
  var ret = '', i = 0, j = 0;
  for (i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    switch (typeof arg) {
      case 'string':
        ret += 'unicode(' + arg.length + ') "' + arg + '" {'; // Make dependent on strlen if surrogate pairs treated as one here (composites as two though)
        for (j = 0; j < arg.length; j++) {
          var hex = arg[j].charCodeAt(0).toString(16); // Need to check for surrogates?
          ret += ' ' + (new Array(5 - hex.length)).join('0') + hex; // Pad up to 4 zeroes (why not 6?)
        }
        ret += ' }\n';
        break;
    }
  }
  return ret;
}




// xdiff_file_bdiff.js
// Not yet ported. Feel like it?




// xdiff_file_bdiff_size.js
// Not yet ported. Feel like it?




// xdiff_file_bpatch.js
// Not yet ported. Feel like it?




// xdiff_file_diff_binary.js
// Not yet ported. Feel like it?




// xdiff_file_merge3.js
// Not yet ported. Feel like it?




// xdiff_file_patch_binary.js
// Not yet ported. Feel like it?




// xdiff_file_rabdiff.js
// Not yet ported. Feel like it?




// xdiff_string_bdiff.js
// Not yet ported. Feel like it?




// xdiff_string_bdiff_size.js
// Not yet ported. Feel like it?




// xdiff_string_bpatch.js
// Not yet ported. Feel like it?




// xdiff_string_diff_binary.js
// Not yet ported. Feel like it?




// xdiff_string_merge3.js
// Not yet ported. Feel like it?




// xdiff_string_patch_binary.js
// Not yet ported. Feel like it?




// xdiff_string_rabdiff.js
// Not yet ported. Feel like it?




// xml_error_string.js
// Not yet ported. Feel like it?




// xml_get_current_byte_index.js
// Not yet ported. Feel like it?




// xml_get_current_column_number.js
// Not yet ported. Feel like it?




// xml_get_current_line_number.js
// Not yet ported. Feel like it?




// xml_get_error_code.js
// Not yet ported. Feel like it?




// xml_parse.js
// Not yet ported. Feel like it?




// xml_parse_into_struct.js
// Not yet ported. Feel like it?




// xml_parser_create.js
// Not yet ported. Feel like it?




// xml_parser_create_ns.js
// Not yet ported. Feel like it?




// xml_parser_free.js
// Not yet ported. Feel like it?




// xml_parser_get_option.js
// Not yet ported. Feel like it?




// xml_parser_set_option.js
// Not yet ported. Feel like it?




// xml_set_character_data_handler.js
// Not yet ported. Feel like it?




// xml_set_default_handler.js
// Not yet ported. Feel like it?




// xml_set_element_handler.js
// Not yet ported. Feel like it?




// xml_set_end_namespace_decl_handler.js
// Not yet ported. Feel like it?




// xml_set_external_entity_ref_handler.js
// Not yet ported. Feel like it?




// xml_set_notation_decl_handler.js
// Not yet ported. Feel like it?




// xml_set_object.js
// Not yet ported. Feel like it?




// xml_set_processing_instruction_handler.js
// Not yet ported. Feel like it?




// xml_set_start_namespace_decl_handler.js
// Not yet ported. Feel like it?




// xml_set_unparsed_entity_decl_handler.js
// Not yet ported. Feel like it?




// XMLReader.js
function XMLReader() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: var xr = new XMLReader();
  // *     returns 1: {}

  // Fix: Add and inherit from PHPJS_Resource

  function XMLReader() {
  }
  XMLReader.prototype = {
    close: function() { //  Close the XMLReader input

    },
    expand: function() { //  Returns a copy of the current node as a DOM object

    },
    getAttribute: function() { //  Get the value of a named attribute

    },
    getAttributeNo: function() { //  Get the value of an attribute by index

    },
    getAttributeNs: function() { //  Get the value of an attribute by localname and URI

    },
    getParserProperty: function() { //  Indicates if specified property has been set

    },
    isValid: function() { //  Indicates if the parsed document is valid

    },
    lookupNamespace: function() { //  Lookup namespace for a prefix

    },
    moveToAttribute: function() { //  Move cursor to a named attribute

    },
    moveToAttributeNo: function() { //  Move cursor to an attribute by index

    },
    moveToAttributeNs: function() { //  Move cursor to a named attribute

    },
    moveToElement: function() { //  Position cursor on the parent Element of current Attribute

    },
    moveToFirstAttribute: function() { //  Position cursor on the first Attribute

    },
    moveToNextAttribute: function() { //  Position cursor on the next Attribute

    },
    next: function() { //  Move cursor to next node skipping all subtrees

    },
    open: function() { //  Set the URI containing the XML to parse

    },
    read: function() { //  Move to next node in document

    },
    readInnerXML: function() { //  Retrieve XML from current node

    },
    readOuterXML: function() { //  Retrieve XML from current node, including it self

    },
    readString: function() { //  Reads the contents of the current node as an string

    },
    setParserProperty: function() { //  Set or Unset parser options

    },
    setRelaxNGSchema: function() { //  Set the filename or URI for a RelaxNG Schema

    },
    setRelaxNGSchemaSource: function() { //  Set the data containing a RelaxNG Schema

    },
    setSchema: function() { //  Validate document against XSD

    },
    XML: function() { //  Set the data containing the XML to parse

    }
  };
  return XMLReader;
}




// xmlwriter_open_memory.js
function xmlwriter_open_memory() {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: xmlwriter_open_memory();
  // *     returns 1: true

  var that = this;

  // Note: see echo for the type of Sax2 or the like which we want to be able to parse from strings

  // Create unique resource id
  if (!this.php_js.resourceIdCounter) {
    this.php_js.resourceIdCounter = 0;
  }
  this.php_js.resourceIdCounter++;


  function PHPJS_Resource(type, id, opener) { // Can reuse the following for other resources, just changing the instantiation
    // See http://php.net/manual/en/resource.php for types
    this.type = type;
    this.id = id;
    this.opener = opener;
  }
  PHPJS_Resource.prototype = {
    constructor: PHPJS_Resource,
    // Our own API for Resources
    toString: function() {
      return 'Resource id #' + this.id;
    },
    get_resource_type: function() {
      return this.type;
    },
    var_dump: function() {
      return 'resource(' + this.id + ') of type (' + this.type + ')';
    }
  };

  function XMLWriter() { // Might be used independently as well, as PHP allows

  }
  XMLWriter.prototype = new PHPJS_Resource('xmlwriter', this.php_js.resourceIdCounter, 'xmlwriter_open_memory'); // is the first argument the right resource type for XMLWriter?

  // XMLWriter.prototype.constructor = XMLWriter; // we may need to keep the constructor as PHPJS_Resource for type checking elsewhere; can use type property instead

  XMLWriter.prototype.endAttribute = function() {

    return true;
  };
  XMLWriter.prototype.endCData = function() {

    return true;
  };
  XMLWriter.prototype.endComment = function() {

    return true;
  };
  XMLWriter.prototype.endDocument = function() {

    return true;
  };
  XMLWriter.prototype.endDTDAttlist = function() {

    return true;
  };
  XMLWriter.prototype.endDTDElement = function() {

    return true;
  };
  XMLWriter.prototype.endDTDEntity = function() {

    return true;
  };
  XMLWriter.prototype.endDTD = function() {

    return true;
  };
  XMLWriter.prototype.endElement = function() {

    return true;
  };
  XMLWriter.prototype.endPI = function() {

    return true;
  };
  XMLWriter.prototype.flush = function(empty) {
    var buffer = this.buffer;
    that.echo(buffer);
    if (empty) {
      this.buffer = '';
    }
    return buffer; // gives old buffer contents?
  };
  XMLWriter.prototype.fullEndElement = function() {

    return true;
  };
  XMLWriter.prototype.openMemory = function() {
    return new XMLWriter(); // Should be static?
  };
  XMLWriter.prototype.openURI = function(uri) {
    throw new Error('XMLWriter.openURI is not implemented');
  };
  XMLWriter.prototype.outputMemory = function(flush) {
    if (flush) {
      that.echo(this.buffer);
      this.buffer = ''; // Todo: Should the buffer be cleared?
    }
    return this.buffer;
  };
  XMLWriter.prototype.setIndentString = function(indentString) {
    this.indentString = indentString;
    return true;
  };
  XMLWriter.prototype.setIndent = function(indent) {
    this.indent = indent;
    return true;
  };
  XMLWriter.prototype.startAttributeNS = function(prefix, name, uri) {

    return true;
  };
  XMLWriter.prototype.startAttribute = function(name) {

    return true;
  };
  XMLWriter.prototype.startCData = function() {

    return true;
  };
  XMLWriter.prototype.startComment = function() {

    return true;
  };
  XMLWriter.prototype.startDocument = function(version, encoding, standalone) {

    return true;
  };
  XMLWriter.prototype.startDTDAttlist = function(name) {

    return true;
  };
  XMLWriter.prototype.startDTDElement = function(qualifiedName) {

    return true;
  };
  XMLWriter.prototype.startDTDEntity = function(name, isparam) {

    return true;
  };
  XMLWriter.prototype.startDTD = function(qualifiedName, publicId, systemId) {

    return true;
  };
  XMLWriter.prototype.startElementNS = function(prefix, name, uri) {

    return true;
  };
  XMLWriter.prototype.startElement = function(name) {

    return true;
  };
  XMLWriter.prototype.startPI = function(target) {

    return true;
  };
  XMLWriter.prototype.text = function(content) {

    return true;
  };
  XMLWriter.prototype.writeAttributeNS = function(prefix, name, uri, content) {

    return true;
  };
  XMLWriter.prototype.writeAttribute = function(name, value) {

    return true;
  };
  XMLWriter.prototype.writeCData = function(content) {

    return true;
  };
  XMLWriter.prototype.writeComment = function(content) {

    return true;
  };
  XMLWriter.prototype.writeDTDAttlist = function(name, content) {

    return true;
  };
  XMLWriter.prototype.writeDTDElement = function(name, content) {

    return true;
  };
  XMLWriter.prototype.writeDTDEntity = function(name, content, pe, pubid, sysid, ndataid) {

    return true;
  };
  XMLWriter.prototype.writeDTD = function(name, publicId, systemId, subset) {

    return true;
  };
  XMLWriter.prototype.writeElementNS = function(prefix, name, uri, content) {

    return true;
  };
  XMLWriter.prototype.writeElement = function(name, content) {

    return true;
  };
  XMLWriter.prototype.writePI = function(target, content) {

    return true;
  };
  XMLWriter.prototype.writeRaw = function(content) {

    return true;
  };

  var xmlwriter = new XMLWriter();

  return xmlwriter;
}




// xmlwriter_open_uri.js
// We are not going to port this



