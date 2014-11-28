
Element.prototype.after = function after(el) {return this.extract().insertAdjacentHTML("afterend", extract(el)); };
Element.prototype.append = function(el) {return this.extract().insertAdjacentHTML("beforeend", extract(el)); };
Element.prototype.attr = function(name, value) {if (value) {return this.setAttribute(name, value);} else {var att; if (name == 'class') {att = this.className;} else if (name == 'style') {att = this.style;} else {att = this.getAttribute(name);} return att; } }
Element.prototype.before = function before(el) {return this.extract().insertAdjacentHTML("beforebegin", extract(el)); };
Element.prototype.clone = function() {return this.cloneNode(true); }
Element.prototype.each = function(arr, cb) {if(arr == null) {return;} else if (Array.prototype.forEach && arr.forEach === Array.prototype.forEach) {arr.forEach(cb);} else {for(var i = 0; i < arr.length; i++) {(function() {cb(arr[i], i, arr);})(); } } }
Element.prototype.empty = function() {this.innerHTML = ''; }
Element.prototype.extract = function () { var el = this; return (el instanceof jQuery ? el[0] : (typeof el === "string"? el : $(el).outerHTML())); }
Element.prototype.filter = function(nodes, fn) {return Array.prototype.filter.call(nodes, fn); }
Element.prototype.getDimension = function() {var element = this; var el = typeof(element) == 'string' ? $(element) : element; var border=(function() {if($browser.ie) {return !getStyle(el,"border-size") ? 0 : getStyle(el,"border-size").toNumber(); } else {return 0; } })(); if (getStyle(el, 'display') != 'none') {return {width: el.offsetWidth-border, height: el.offsetHeight-border};} var els = el.style; var originalVisibility = els.visibility; var originalPosition = els.position; els.visibility = 'hidden'; els.position = 'absolute'; els.display = ''; var obj = {width: el.clientWidth-border, height: el.clientHeight-border}; els.display = 'none'; els.position = originalPosition; els.visibility = originalVisibility; return obj; }
Element.prototype.getStyle = function(st) {var element = this; var el = typeof(element) == 'string' ? $(element) : element; if (typeof el == 'object' && typeof st == 'string') {var style = camelCase(st); if (el != null) {var value = el.style[style]; if (value != '') return value; try {return el.currentStyle[style]; } catch(e) {} try {return window.getComputedStyle(el, null)[style]; } catch(e) {} } } return ''; }
Element.prototype.html = function(newHtml) {if (newHtml) {this.innerHTML = newhtml;} else {return this.innerHTML;} }
Element.prototype.next = function() {return this.nextElementSibling; };
Element.prototype.off = function(eventName,	eventHandler) {this.removeEventListener(eventName, eventHandler); }
Element.prototype.offset = function() {return {left: this.offsetLeft, top: this.offsetTop}; }
Element.prototype.on = function(eventName, eventHandler) {this.addEventListener(eventName, eventHandler); }
Element.prototype.outerHTML = function() {return this.outerHTML; }
Element.prototype.parent = function() {return this.parentNode; };
Element.prototype.prepend = function(el) {return this.extract().insertAdjacentHTML("afterbegin", extract(el)); };
Element.prototype.previous = function() {return this.previousElementSibling; };
Element.prototype.remove = function remove() {this.removeChild(child); };
Element.prototype.replace = function replace(newhtml) {this.outerHTML = newhtml; };
Element.prototype.siblings = function() {return this.filter(this.parentNode.children, function (child) { return child !== el; }); };
Element.prototype.style = function(rule) {var node = this; var comp = window.getComputedStyle(node, null); var result = {}; if (rule) {return cs.getPropertyValue(rule); } else {var len = comp.length; for(var i = 0; i < len; i++) {var style = comp[i]; result[style] = cs.getPropertyValue(style); } } return result; }
Element.prototype.text = function() {var el = this; if (el.textContent) {return el.textContent;} if (el.innerText) {return el.innerText;} if (typeof el.innerHTML == 'string') {return el.innerHTML.replace(/<[^<>]+>/g,'');} }
Element.prototype.text = function(newtext) {if (newText) {this.textContent = newtext;} else {return this.textContent;} }
Element.prototype.toggle = function(className){this.classList.toggle(className); return; var element = this; if (!element || !className){return;} var classString = element.className, nameIndex = classString.indexOf(className); if (nameIndex == -1) {classString += ' ' + className;} else {classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);} element.className = classString; }
Element.prototype.toggleClass = Element.prototype.toggle;
