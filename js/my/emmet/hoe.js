

var hoe = function(tag, attrs){
    var $ele = document.createElement(tag);
    if (attrs){
        for(var name in attrs){
            $ele.setAttribute(name, attrs[name]);
        }
    }
    for(var i=2, max=arguments.length; i<max; i++){
        var param = arguments[i];
        if(param instanceof Node){
            $ele.appendChild(param);
        }
        else {
            $ele.appendChild(document.createTextNode(param));
        }
    }
    if('createdCallback' in $ele){
        $ele.__init__();
    }
    return $ele;
};

hoe.append = function($ele){
    for(var i=1, max=arguments.length; i<max; i++){
        var param = arguments[i];
        if(param instanceof Node){
            $ele.appendChild(param);
        }
        else {
            $ele.appendChild(document.createTextNode(param));
        }
    }
};

hoe.html = function($ele){
    $ele.innerHTML = '';
    for(var i=1, max=arguments.length; i<max; i++){
        var param = arguments[i];
        if(param instanceof Node){
            $ele.appendChild(param);
        }
        else {
            $ele.appendChild(document.createTextNode(param));
        }
    }
};

hoe.remove = function($ele){
    if ($ele.parentNode !== null){
        $ele.parentNode.removeChild($ele);
        return true;
    }
    else {
        return false;
    }
};

hoe.fragment = function(nodes){
    var $ele = document.createDocumentFragment();
    for(var i=0, max=nodes.length; i<max; i++){
        var param = nodes[i];
        if(typeof(param) === "string"){
            $ele.appendChild(document.createTextNode(param));
        }
        else {
            $ele.appendChild(param);
        }
    }
    return $ele;
};
hoe.extend = function(out) {
    var keys, arg;
    for (var i = 1; i < arguments.length; i++) {
        arg = arguments[i];
        if (!arg){
            continue;
        }
        keys = Object.keys(arg);
        for (var j=0, max=keys.length; j<max; j++) {
            out[keys[j]] = arg[keys[j]];
        }
    }
    return out;
};

hoe.partial = function(tag, partial_attrs){
    var partial_nodes = Array.prototype.slice.call(arguments, 2);
    return function(this_attrs){
        var attrs = hoe.extend({}, partial_attrs, this_attrs);
        var $ele = hoe(tag, attrs, hoe.fragment(partial_nodes),
                       hoe.fragment(Array.prototype.slice.call(arguments, 1)));
        return $ele;
    };
};

hoe.init_default_tags = [
    'body', 'div','span', 'pre', 'p', 'a', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong',
    'section', 'header', 'footer', 'br',
    'form', 'label', 'input', 'textarea', 'select', 'option', 'button',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th','td'
];

hoe.init = function(namespace, tags){
    namespace = namespace || window;
    tags = tags || hoe.init_default_tags;
    for (var i=0, max=tags.length; i<max; i++){
        namespace[tags[i]] = hoe.partial(tags[i]);
    }
};

hoe.inherit = function (base_type, constructor){
    var new_type;
    if (constructor){
        new_type = constructor;
    }
    else{
        new_type = function(){return base_type.apply(this, arguments);};
    }
    new_type.prototype = Object.create(base_type.prototype);
    new_type.prototype.constructor = new_type;
    hoe.extend(new_type, base_type);
    return new_type;
};

hoe.Type = function(constructor){
    return hoe.inherit(hoe.Type, constructor);
};

hoe.Type.prototype.listen = function(observed, event_name, callback){
    if (observed instanceof window.HTMLElement){
        observed.addEventListener(event_name, callback.bind(this));
        return;
    }
    else {
        if (typeof observed._hoe_obs === 'undefined'){
            observed._hoe_obs = {};
        }
        if (!(event_name in observed._hoe_obs)){
            observed._hoe_obs[event_name] = [];
        }
        observed._hoe_obs[event_name].push({scope:this, fn:callback});
    }
};

hoe.Type.prototype.fire = function(event_name, detail){
    if(this instanceof window.HTMLElement){
        var event = new CustomEvent(event_name, {detail:detail});
        this.dispatchEvent(event);
        return;
    }
    if (this._hoe_obs && this._hoe_obs[event_name]){
        var callbacks = this._hoe_obs[event_name];
        for (var i=0, max=callbacks.length; i<max; i++){
            callbacks[i].fn.apply(callbacks[i].scope,
                                  Array.prototype.slice.call(arguments, 1));
        }
    }
};

hoe.Type.prototype.forArray = function(seq, fn){
    for(var i = 0, len = seq.length; i < len; ++i) {
        fn.call(this, seq[i], i, seq);
    }
};
hoe.Type.prototype.forDict = function(seq, fn){
    for (var key in seq){
        fn.call(this, seq[key], key, seq);
    }
};

hoe.Type.prototype.mapArray = function(seq, fn){
    var result = [];
    for(var i = 0, len = seq.length; i < len; ++i) {
        result.push(fn.call(this, seq[i], i, seq));
    }
    return result;
};

hoe.Type.prototype.mapDict = function(seq, fn){
    var result = [];
    for (var key in seq){
        result.push(fn.call(this, seq[key], key, seq));
    }
    return result;
};

hoe.Type.prototype.scope = function(func){
    var args = [this].concat(Array.prototype.slice.call(arguments, 1));
    return func.bind.apply(func, args);
};
hoe.Component = function(tag_name, init_func){
    var proto = Object.create(window.HTMLElement.prototype);
    hoe.extend(proto, hoe.Type.prototype);
    proto.from_html = function(){
        return {};
    };
    proto.attachedCallback = function(){
        this.__init__();
    };

    proto.createdCallback = function(){
        if (this.parentNode){
            this.__init__();
        }
     };
    proto.__init__ = function(){
        if (!this.__initialized__){
            init_func.call(this, this.from_html());
            this.__initialized__ = true;
            this.__from_html__ = true;
        }
    };
    proto.New = function (args) {
        var obj = new proto.constructor();
        obj.__initialized__ = true;
        obj.__from_html__ = false;
        init_func.call(obj, args);
        return obj;
    };
    proto.constructor = document.registerElement(tag_name, {prototype: proto});
    return proto;
};
