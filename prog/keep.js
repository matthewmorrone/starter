function Person() {
  var data = {
    name: 'foo'
  };
  var p = {};
  // attach get/set method
  getSet(p, 'name', data, 'name');
  return p;
}

We can even use the same property name by default, and return the object reference in the setter mode.
function getSet(o, name, data, dataName) {
  if (arguments.length === 3) {
    dataName = name;
  }
  o[name] = function () {
    if (!arguments.length) {
      return data[dataName];
    }
    data[dataName] = arguments[0];
    return o;
  };
}
// use
p.name('jim').name() // jim

function Maybe(x) {
  if (x instanceof Maybe) {
    return x;
  }
  if (this instanceof Maybe) {
    this.value = x;
    this.ap = function ap(arg) {
      // access function x via lexical scope
      if (typeof x === 'function')
        return Maybe(arg).map(x);
    };
  } else
    return new Maybe(x);
}

Now we can quickly wrap functions passed as steps to the promise
q('foo')
  .then(Maybe(length).ap)
  .then(Maybe(console.log).ap)
  .done();
// prints 3 asynchronously
q()
  .then(Maybe(length).ap)
  .then(Maybe(console.log).ap)
  .done();
// prints nothing

function Maybe(x) {
  if (x instanceof Maybe) {
    return x;
  }

  if (this instanceof Maybe)
    this.value = x;
  else
    return new Maybe(x);
}
console.log(Maybe('foo'));
console.log(Maybe(Maybe('foo')));
// prints
{ value: 'foo' }
{ value: 'foo' }


for (var i in flavoured.befores) {
  var flavouring = flavoured.befores[i];
  if (flavouring.apply(this, args) === false) return;
}

var returnValue = flavoured.body.apply(this, arguments);

for (var i in flavoured.afters) {
  var flavouring = flavoured.afters[i];
  flavouring.apply(this, returnValue);
}

return returnValue;   }


function Applier(value) {
  return function ApplierInner(arg) {
    if (!arguments.length) {
      return value;
    }
    if (typeof arg === 'function') {
      // behave like Functor
      return Applier(arg(value));
    }
    return ApplierInner;
  };
}
function Applier(value, conditions) {
  conditions = conditions || function () { return true; };
  return function ApplierInner(arg) {
    if (!arguments.length) {
      return value;
    }
    if (typeof value === 'function' && conditions(arg)) {
      // behave like Applicative
      return Applier(value(arg), conditions);
    }
    if (typeof arg === 'function' && conditions(value)) {
      // behave like Functor
      return Applier(arg(value), conditions);
    }
    return ApplierInner;
  };
}
function MaybeApplier(value) {
  function exists(value) {
    return value !== null && typeof value !== 'undefined';
  }
  return Applier(value, exists);
}
