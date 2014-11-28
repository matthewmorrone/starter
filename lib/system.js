

var ua = (window.navigator && navigator.userAgent) || "";
var av = (window.navigator && navigator.appVersion) || "";
var System = {
	browser:(function() {
		var ua =(window.navigator && navigator.userAgent) || "";
		if(/Arora/i.test(ua)) {return 'Arora';}
		else if(/Chrome/i.test(ua)) {return 'Chrome';}
		else if(/Epiphany/i.test(ua)) {return 'Epiphany';}
		else if(/Firefox/i.test(ua)) {return 'Firefox';}
		else if(/Mobile(\/.*)? Safari/i.test(ua)) {return 'Mobile Safari';}
		else if(/MSIE/i.test(ua)) {return 'Internet Explorer';}
		else if(/Midori/i.test(ua)) {return 'Midori';}
		else if(/Opera/.test(ua)) {return 'Opera';}
		else if(/Safari/i.test(ua)) {return 'Safari';}
		return false;
	})(),
	os:(function() {
		var ua =(window.navigator && navigator.userAgent) || "";
		if(/Android/i.test(ua)) {return 'Android';}
		else if(/CrOS/i.test(ua)) {return 'Chrome OS';}
		else if(/iP[ao]d|iPhone/i.test(ua)) {return 'iOS';}
		else if(/Linux/i.test(ua)) {return 'Linux';}
		else if(/Mac OS/i.test(ua)) {return 'Mac OS';}
		else if(/windows/i.test(ua)) {return 'Windows';}
		return false;
	})(),
	browserCheck: {
		ie: function() {return /msie/i.test(ua);},
		ie6: function() {return /msie/i.test(ua);},
		ie7: function() {return /msie/i.test(ua);},
		ie8: function() {return /msie/i.test(ua);},
		ie9: function() {return /msie/i.test(ua);},
		ie10: function() {return /msie/i.test(ua);},
		ie11: function() {return /msie/i.test(ua);},
		firefox: function() {return /firefox/i.test(ua);},
		gecko: function() {return /gecko/i.test(ua);},
		opera: function() {return /opera/i.test(ua);},
		safari: function() {return /webkit\W(?!.*chrome).*safari\W/i.test(ua);},
		chrome: function() {return /webkit\W.*(chrome|chromium)\W/i.test(ua);},
		webkit: function() {return /webkit\W/i.test(ua);},
		mobile: function() {return /iphone|ipod|(android.*?mobile)|blackberry|nokia/i.test(ua);},
		tablet: function() {return /ipad|android(?!.*mobile)/i.test(ua);},
		desktop: function() {return !this.mobile() && !this.tablet();},
		kindle: function() {return /kindle|silk/i.test(ua);},
		tv: function() {return /googletv|sonydtv|appletv|roku|smarttv/i.test(ua);},
		online: function() {return navigator.onLine;},
		offline: function() {return !this.online();},
		windows: function() {return /win/i.test(av);},
		mac: function() {return /mac/i.test(av);},
		unix: function() {return /x11/i.test(av);},
		linux: function() {return /linux/i.test(av);}
	}
	support: {
		canvas: !! window.CanvasRenderingContext2D,
		localStorage:(function() {
			try {return !! window.localStorage.getItem;}
			catch(error) {return false;}
		})(),
		file: !! window.File && !! window.FileReader && !! window.FileList && !! window.Blob,
		fileSystem: !! window.requestFileSystem || !! window.webkitRequestFileSystem,
		getUserMedia: !! window.navigator.getUserMedia || !! window.navigator.webkitGetUserMedia || !! window.navigator.mozGetUserMedia || !! window.navigator.msGetUserMedia,
		requestAnimationFrame: !! window.mozRequestAnimationFrame || !! window.webkitRequestAnimationFrame || !! window.oRequestAnimationFrame || !! window.msRequestAnimationFrame,
		sessionStorage:(function() {
			try {return !! window.sessionStorage.getItem;}
			catch(error) {return false;}
		})(),
		webgl:(function() {try {return !! window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');} catch(e) {return false;}})(),
		worker: !! window.Worker
	}
};

function bowser() {

	var t = true

	function detect(ua) {

		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
			, likeAndroid = /like android/i.test(ua)
			, android = !likeAndroid && /android/i.test(ua)
			, versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
			, tablet = /tablet/i.test(ua)
			, mobile = !tablet && /[^-]mobi/i.test(ua)
			, result

		if (/opera|opr/i.test(ua)) {
			result = {
				name: 'Opera'
			, opera: t
			, version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
			}
		}
		else if (/windows phone/i.test(ua)) {
			result = {
				name: 'Windows Phone'
			, windowsphone: t
			, msie: t
			, version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/msie|trident/i.test(ua)) {
			result = {
				name: 'Internet Explorer'
			, msie: t
			, version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
			}
		}
		else if (/chrome|crios|crmo/i.test(ua)) {
			result = {
				name: 'Chrome'
			, chrome: t
			, version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		}
		else if (iosdevice) {
			result = {
				name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
			}
			if (versionIdentifier) {
				result.version = versionIdentifier
			}
		}
		else if (/sailfish/i.test(ua)) {
			result = {
				name: 'Sailfish'
			, sailfish: t
			, version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/seamonkey
			result = {
				name: 'SeaMonkey'
			, seamonkey: t
			, version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/firefox|iceweasel/i.test(ua)) {
			result = {
				name: 'Firefox'
			, firefox: t
			, version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
			}
			if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
				result.firefoxos = t
			}
		}
		else if (/silk/i.test(ua)) {
			result =  {
				name: 'Amazon Silk'
			, silk: t
			, version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
			}
		}
		else if (android) {
			result = {
				name: 'Android'
			, version: versionIdentifier
			}
		}
		else if (/phantom/i.test(ua)) {
			result = {
				name: 'PhantomJS'
			, phantom: t
			, version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
			result = {
				name: 'BlackBerry'
			, blackberry: t
			, version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/(web|hpw)os/i.test(ua)) {
			result = {
				name: 'WebOS'
			, webos: t
			, version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
			};
			/touchpad
		}
		else if (/bada/i.test(ua)) {
			result = {
				name: 'Bada'
			, bada: t
			, version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
			};
		}
		else if (/tizen/i.test(ua)) {
			result = {
				name: 'Tizen'
			, tizen: t
			, version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
			};
		}
		else if (/safari/i.test(ua)) {
			result = {
				name: 'Safari'
			, safari: t
			, version: versionIdentifier
			}
		}
		else result = {}
		if (/(apple)?webkit/i.test(ua)) {
			result.name = result.name || "Webkit"
			result.webkit = t
			if (!result.version && versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if (!result.opera && /gecko
			result.name = result.name || "Gecko"
			result.gecko = t
			result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
		}
		if (android || result.silk) {
			result.android = t
		} else if (iosdevice) {
			result[iosdevice] = t
			result.ios = t
		}
		var osVersion = '';
		if (iosdevice) {
			osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
			osVersion = osVersion.replace(/[_\s]/g, '.');
		} else if (android) {
			osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
		} else if (result.windowsphone) {
			osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
		} else if (result.webos) {
			osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
		} else if (result.blackberry) {
			osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
		} else if (result.bada) {
			osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
		} else if (result.tizen) {
			osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
		}
		if (osVersion) {
			result.osversion = osVersion;
		}
		var osMajorVersion = osVersion.split('.')[0];
		if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
			result.tablet = t
		} else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
			result.mobile = t
		}
		if ((result.msie && result.version >= 10) ||
				(result.chrome && result.version >= 20) ||
				(result.firefox && result.version >= 20.0) ||
				(result.safari && result.version >= 6) ||
				(result.opera && result.version >= 10.0) ||
				(result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
				) {
			result.a = t;
		}
		else if ((result.msie && result.version < 10) ||
				(result.chrome && result.version < 20) ||
				(result.firefox && result.version < 20.0) ||
				(result.safari && result.version < 6) ||
				(result.opera && result.version < 10.0) ||
				(result.ios && result.osversion && result.osversion.split(".")[0] < 6)
				) {
			result.c = t
		} else result.x = t

		return result
	}

	var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')

	bowser._detect = detect;

	return bowser
}


window.browser=(function() {
	var browser=navigator.userAgent;
	return {
		'ie':browser.test(/MSIE/i),
		'ie6':this.ie||!window.XMLHttpRequest,
		'ie7':this.ie||window.XMLHttpRequest,
		'ff':browser.test(/Firefox/),
		'moz':browser.test(/Mozilla/),
		'ns':browser.test(/Netscape/),
		'op':Boolean(window.opera),
		'saf':browser.test(/WebKit/i),
		'kq':browser.test(/Khtml/i)
	}
})();


