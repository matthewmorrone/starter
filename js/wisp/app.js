;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    var _ns_ = {
            id: 'try-wisp.main',
            doc: void 0
        };
    var codemirrorActivine = require('codemirror-activine');
    var activine = codemirrorActivine;
    var codemirrorPersist = require('codemirror-persist');
    var persist = codemirrorPersist;
    var wisp_engine_browser = require('wisp/engine/browser');
    var wisp_sequence = require('wisp/sequence');
    var rest = wisp_sequence.rest;
    var cons = wisp_sequence.cons;
    var vec = wisp_sequence.vec;
    var wisp_runtime = require('wisp/runtime');
    var str = wisp_runtime.str;
    var wisp_reader = require('wisp/reader');
    var read_ = wisp_reader.read_;
    var wisp_compiler = require('wisp/compiler');
    var compile = wisp_compiler.compile;
}
persist(CodeMirror);
var throttle = exports.throttle = function throttle(lambda, ms) {
        return function () {
            var idø1 = 0;
            return function throttled() {
                var params = Array.prototype.slice.call(arguments, 0);
                clearTimeout(idø1, throttled);
                return idø1 = setTimeout.apply(window, vec(cons(lambda, cons(ms, params))));
            };
        }.call(this);
    };
var tooglePreview = exports.tooglePreview = function tooglePreview() {
        return function () {
            var outputø1 = document.getElementById('output');
            var inputø1 = document.getElementById('input');
            outputø1.hidden = !outputø1.hidden;
            return inputø1.style.width = outputø1.hidden ? '100%' : '50%';
        }.call(this);
    };
var _errorMarker_ = exports._errorMarker_ = function () {
        var viewø1 = document.createElement('span');
        viewø1.textContent = '\u25CF';
        viewø1.style.color = 'black';
        viewø1.style.opacity = '0.5';
        return viewø1;
    }.call(this);
var updatePreview = exports.updatePreview = throttle(function (editor) {
        editor.clearGutter('error-gutter');
        return function () {
            var codeø1 = editor.getValue();
            var resultø1 = compile(codeø1, { 'source-uri': 'scratch' });
            var errorø1 = (resultø1 || 0)['error'];
            localStorage.buffer = codeø1;
            return errorø1 ? (function () {
                localStorage.buffer = codeø1;
                _errorMarker_.setAttribute('title', errorø1.message);
                return editor.setGutterMarker(errorø1.line || 0, 'error-gutter', _errorMarker_);
            })() : output.setValue((resultø1 || 0)['code']);
        }.call(this);
    }, 200);
var input = exports.input = CodeMirror(document.getElementById('input'), {
        'lineNumbers': true,
        'matchBrackets': true,
        'electricChars': true,
        'persist': true,
        'styleActiveLine': true,
        'autofocus': true,
        'value': document.getElementById('examples').innerHTML,
        'theme': 'solarized dark',
        'mode': 'clojure',
        'autoClearEmptyLines': true,
        'fixedGutter': true,
        'gutters': ['error-gutter'],
        'extraKeys': { 'Tab': 'indentSelection' },
        'onChange': updatePreview,
        'onGutterClick': tooglePreview
    });
input.on('change', updatePreview);
input.on('gutterClick', tooglePreview);
updatePreview(input);
var output = exports.output = CodeMirror(document.getElementById('output'), {
        'lineNumbers': true,
        'fixedGutter': true,
        'matchBrackets': true,
        'mode': 'javascript',
        'theme': 'solarized dark',
        'readOnly': true
    });
},{"codemirror-activine":6,"codemirror-persist":7,"wisp/compiler":12,"wisp/engine/browser":13,"wisp/reader":32,"wisp/runtime":33,"wisp/sequence":34}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"PcZj9L":[function(require,module,exports){
var TA = require('typedarray')
var xDataView = typeof DataView === 'undefined'
  ? TA.DataView : DataView
var xArrayBuffer = typeof ArrayBuffer === 'undefined'
  ? TA.ArrayBuffer : ArrayBuffer
var xUint8Array = typeof Uint8Array === 'undefined'
  ? TA.Uint8Array : Uint8Array

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

var browserSupport

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 *
 * Firefox is a special case because it doesn't allow augmenting "native" object
 * instances. See `ProxyBuffer` below for more details.
 */
function Buffer (subject, encoding) {
  var type = typeof subject

  // Work-around: node's base64 implementation
  // allows for non-padded strings while base64-js
  // does not..
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // Assume object is an array
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf = augment(new xUint8Array(length))
  if (Buffer.isBuffer(subject)) {
    // Speed optimization -- use set if we're copying from a Uint8Array
    buf.set(subject)
  } else if (isArrayIsh(subject)) {
    // Treat array-ish objects as a byte array.
    for (var i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function(encoding) {
  switch ((encoding + '').toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
    case 'raw':
      return true

    default:
      return false
  }
}

Buffer.isBuffer = function isBuffer (b) {
  return b && b._isBuffer
}

Buffer.byteLength = function (str, encoding) {
  switch (encoding || 'utf8') {
    case 'hex':
      return str.length / 2

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length

    case 'ascii':
    case 'binary':
      return str.length

    case 'base64':
      return base64ToBytes(str).length

    default:
      throw new Error('Unknown encoding')
  }
}

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error('Usage: Buffer.concat(list, [totalLength])\n' +
        'list should be an Array.')
  }

  var i
  var buf

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      buf = list[i]
      totalLength += buf.length
    }
  }

  var buffer = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    buf = list[i]
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

// INSTANCE METHODS
// ================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) {
    throw new Error('Invalid hex string')
  }
  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
}

function _asciiWrite (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var bytes, pos
  return Buffer._charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
}

function BufferWrite (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  switch (encoding) {
    case 'hex':
      return _hexWrite(this, string, offset, length)

    case 'utf8':
    case 'utf-8':
      return _utf8Write(this, string, offset, length)

    case 'ascii':
      return _asciiWrite(this, string, offset, length)

    case 'binary':
      return _binaryWrite(this, string, offset, length)

    case 'base64':
      return _base64Write(this, string, offset, length)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToString (encoding, start, end) {
  var self = (this instanceof ProxyBuffer)
    ? this._proxy
    : this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  switch (encoding) {
    case 'hex':
      return _hexSlice(self, start, end)

    case 'utf8':
    case 'utf-8':
      return _utf8Slice(self, start, end)

    case 'ascii':
      return _asciiSlice(self, start, end)

    case 'binary':
      return _binarySlice(self, start, end)

    case 'base64':
      return _base64Slice(self, start, end)

    default:
      throw new Error('Unknown encoding')
  }
}

function BufferToJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
function BufferCopy (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start)
    throw new Error('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new Error('targetStart out of bounds')
  if (start < 0 || start >= source.length)
    throw new Error('sourceStart out of bounds')
  if (end < 0 || end > source.length)
    throw new Error('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  // copy!
  for (var i = 0; i < end - start; i++)
    target[i + target_start] = this[i + start]
}

function _base64Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  return require('base64-js').fromByteArray(bytes)
}

function _utf8Slice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  var tmp = ''
  var i = 0
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i])
      tmp = ''
    } else {
      tmp += '%' + bytes[i].toString(16)
    }

    i++
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var ret = ''
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

// TODO: add test that modifying the new buffer slice will modify memory in the
// original buffer! Use code from:
// http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end
function BufferSlice (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)
  return augment(this.subarray(start, end)) // Uint8Array built-in method
}

function BufferReadUInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getUint16(0, littleEndian)
  } else {
    return buf._dataview.getUint16(offset, littleEndian)
  }
}

function BufferReadUInt16LE (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

function BufferReadUInt16BE (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getUint32(0, littleEndian)
  } else {
    return buf._dataview.getUint32(offset, littleEndian)
  }
}

function BufferReadUInt32LE (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

function BufferReadUInt32BE (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

function BufferReadInt8 (offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < buf.length, 'Trying to read beyond buffer length')
  }

  if (offset >= buf.length)
    return

  return buf._dataview.getInt8(offset)
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint8(0, buf[len - 1])
    return dv.getInt16(0, littleEndian)
  } else {
    return buf._dataview.getInt16(offset, littleEndian)
  }
}

function BufferReadInt16LE (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

function BufferReadInt16BE (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    for (var i = 0; i + offset < len; i++) {
      dv.setUint8(i, buf[i + offset])
    }
    return dv.getInt32(0, littleEndian)
  } else {
    return buf._dataview.getInt32(offset, littleEndian)
  }
}

function BufferReadInt32LE (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

function BufferReadInt32BE (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat32(offset, littleEndian)
}

function BufferReadFloatLE (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

function BufferReadFloatBE (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return buf._dataview.getFloat64(offset, littleEndian)
}

function BufferReadDoubleLE (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

function BufferReadDoubleBE (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

function BufferWriteUInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= buf.length) return

  buf[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setUint16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setUint16(offset, value, littleEndian)
  }
}

function BufferWriteUInt16LE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

function BufferWriteUInt16BE (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setUint32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setUint32(offset, value, littleEndian)
  }
}

function BufferWriteUInt32LE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

function BufferWriteUInt32BE (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

function BufferWriteInt8 (value, offset, noAssert) {
  var buf = this
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= buf.length) return

  buf._dataview.setInt8(offset, value)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 1 === len) {
    var dv = new xDataView(new xArrayBuffer(2))
    dv.setInt16(0, value, littleEndian)
    buf[offset] = dv.getUint8(0)
  } else {
    buf._dataview.setInt16(offset, value, littleEndian)
  }
}

function BufferWriteInt16LE (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

function BufferWriteInt16BE (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setInt32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setInt32(offset, value, littleEndian)
  }
}

function BufferWriteInt32LE (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

function BufferWriteInt32BE (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 3 >= len) {
    var dv = new xDataView(new xArrayBuffer(4))
    dv.setFloat32(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat32(offset, value, littleEndian)
  }
}

function BufferWriteFloatLE (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

function BufferWriteFloatBE (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof (littleEndian) === 'boolean',
        'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len) {
    return
  } else if (offset + 7 >= len) {
    var dv = new xDataView(new xArrayBuffer(8))
    dv.setFloat64(0, value, littleEndian)
    for (var i = 0; i + offset < len; i++) {
      buf[i + offset] = dv.getUint8(i)
    }
  } else {
    buf._dataview.setFloat64(offset, value, littleEndian)
  }
}

function BufferWriteDoubleLE (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

function BufferWriteDoubleBE (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
function BufferFill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error('value is not a number')
  }

  if (end < start) throw new Error('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds')
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds')
  }

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

function BufferInspect () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

// Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
// Added in Node 0.12.
function BufferToArrayBuffer () {
  return (new Buffer(this)).buffer
}


// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

/**
 * Check to see if the browser supports augmenting a `Uint8Array` instance.
 * @return {boolean}
 */
function _browserSupport () {
  var arr = new xUint8Array(0)
  arr.foo = function () { return 42 }

  try {
    return (42 === arr.foo())
  } catch (e) {
    return false
  }
}

/**
 * Class: ProxyBuffer
 * ==================
 *
 * Only used in Firefox, since Firefox does not allow augmenting "native"
 * objects (like Uint8Array instances) with new properties for some unknown
 * (probably silly) reason. So we'll use an ES6 Proxy (supported since
 * Firefox 18) to wrap the Uint8Array instance without actually adding any
 * properties to it.
 *
 * Instances of this "fake" Buffer class are the "target" of the
 * ES6 Proxy (see `augment` function).
 *
 * We couldn't just use the `Uint8Array` as the target of the `Proxy` because
 * Proxies have an important limitation on trapping the `toString` method.
 * `Object.prototype.toString.call(proxy)` gets called whenever something is
 * implicitly cast to a String. Unfortunately, with a `Proxy` this
 * unconditionally returns `Object.prototype.toString.call(target)` which would
 * always return "[object Uint8Array]" if we used the `Uint8Array` instance as
 * the target. And, remember, in Firefox we cannot redefine the `Uint8Array`
 * instance's `toString` method.
 *
 * So, we use this `ProxyBuffer` class as the proxy's "target". Since this class
 * has its own custom `toString` method, it will get called whenever `toString`
 * gets called, implicitly or explicitly, on the `Proxy` instance.
 *
 * We also have to define the Uint8Array methods `subarray` and `set` on
 * `ProxyBuffer` because if we didn't then `proxy.subarray(0)` would have its
 * `this` set to `proxy` (a `Proxy` instance) which throws an exception in
 * Firefox which expects it to be a `TypedArray` instance.
 */
function ProxyBuffer (arr) {
  this._arr = arr

  if (arr.byteLength !== 0)
    this._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)
}

ProxyBuffer.prototype.write = BufferWrite
ProxyBuffer.prototype.toString = BufferToString
ProxyBuffer.prototype.toLocaleString = BufferToString
ProxyBuffer.prototype.toJSON = BufferToJSON
ProxyBuffer.prototype.copy = BufferCopy
ProxyBuffer.prototype.slice = BufferSlice
ProxyBuffer.prototype.readUInt8 = BufferReadUInt8
ProxyBuffer.prototype.readUInt16LE = BufferReadUInt16LE
ProxyBuffer.prototype.readUInt16BE = BufferReadUInt16BE
ProxyBuffer.prototype.readUInt32LE = BufferReadUInt32LE
ProxyBuffer.prototype.readUInt32BE = BufferReadUInt32BE
ProxyBuffer.prototype.readInt8 = BufferReadInt8
ProxyBuffer.prototype.readInt16LE = BufferReadInt16LE
ProxyBuffer.prototype.readInt16BE = BufferReadInt16BE
ProxyBuffer.prototype.readInt32LE = BufferReadInt32LE
ProxyBuffer.prototype.readInt32BE = BufferReadInt32BE
ProxyBuffer.prototype.readFloatLE = BufferReadFloatLE
ProxyBuffer.prototype.readFloatBE = BufferReadFloatBE
ProxyBuffer.prototype.readDoubleLE = BufferReadDoubleLE
ProxyBuffer.prototype.readDoubleBE = BufferReadDoubleBE
ProxyBuffer.prototype.writeUInt8 = BufferWriteUInt8
ProxyBuffer.prototype.writeUInt16LE = BufferWriteUInt16LE
ProxyBuffer.prototype.writeUInt16BE = BufferWriteUInt16BE
ProxyBuffer.prototype.writeUInt32LE = BufferWriteUInt32LE
ProxyBuffer.prototype.writeUInt32BE = BufferWriteUInt32BE
ProxyBuffer.prototype.writeInt8 = BufferWriteInt8
ProxyBuffer.prototype.writeInt16LE = BufferWriteInt16LE
ProxyBuffer.prototype.writeInt16BE = BufferWriteInt16BE
ProxyBuffer.prototype.writeInt32LE = BufferWriteInt32LE
ProxyBuffer.prototype.writeInt32BE = BufferWriteInt32BE
ProxyBuffer.prototype.writeFloatLE = BufferWriteFloatLE
ProxyBuffer.prototype.writeFloatBE = BufferWriteFloatBE
ProxyBuffer.prototype.writeDoubleLE = BufferWriteDoubleLE
ProxyBuffer.prototype.writeDoubleBE = BufferWriteDoubleBE
ProxyBuffer.prototype.fill = BufferFill
ProxyBuffer.prototype.inspect = BufferInspect
ProxyBuffer.prototype.toArrayBuffer = BufferToArrayBuffer
ProxyBuffer.prototype._isBuffer = true
ProxyBuffer.prototype.subarray = function () {
  return this._arr.subarray.apply(this._arr, arguments)
}
ProxyBuffer.prototype.set = function () {
  return this._arr.set.apply(this._arr, arguments)
}

var ProxyHandler = {
  get: function (target, name) {
    if (name in target) return target[name]
    else return target._arr[name]
  },
  set: function (target, name, value) {
    target._arr[name] = value
  }
}

function augment (arr) {
  if (browserSupport === undefined) {
    browserSupport = _browserSupport()
  }

  if (browserSupport) {
    // Augment the Uint8Array *instance* (not the class!) with Buffer methods
    arr.write = BufferWrite
    arr.toString = BufferToString
    arr.toLocaleString = BufferToString
    arr.toJSON = BufferToJSON
    arr.copy = BufferCopy
    arr.slice = BufferSlice
    arr.readUInt8 = BufferReadUInt8
    arr.readUInt16LE = BufferReadUInt16LE
    arr.readUInt16BE = BufferReadUInt16BE
    arr.readUInt32LE = BufferReadUInt32LE
    arr.readUInt32BE = BufferReadUInt32BE
    arr.readInt8 = BufferReadInt8
    arr.readInt16LE = BufferReadInt16LE
    arr.readInt16BE = BufferReadInt16BE
    arr.readInt32LE = BufferReadInt32LE
    arr.readInt32BE = BufferReadInt32BE
    arr.readFloatLE = BufferReadFloatLE
    arr.readFloatBE = BufferReadFloatBE
    arr.readDoubleLE = BufferReadDoubleLE
    arr.readDoubleBE = BufferReadDoubleBE
    arr.writeUInt8 = BufferWriteUInt8
    arr.writeUInt16LE = BufferWriteUInt16LE
    arr.writeUInt16BE = BufferWriteUInt16BE
    arr.writeUInt32LE = BufferWriteUInt32LE
    arr.writeUInt32BE = BufferWriteUInt32BE
    arr.writeInt8 = BufferWriteInt8
    arr.writeInt16LE = BufferWriteInt16LE
    arr.writeInt16BE = BufferWriteInt16BE
    arr.writeInt32LE = BufferWriteInt32LE
    arr.writeInt32BE = BufferWriteInt32BE
    arr.writeFloatLE = BufferWriteFloatLE
    arr.writeFloatBE = BufferWriteFloatBE
    arr.writeDoubleLE = BufferWriteDoubleLE
    arr.writeDoubleBE = BufferWriteDoubleBE
    arr.fill = BufferFill
    arr.inspect = BufferInspect
    arr.toArrayBuffer = BufferToArrayBuffer
    arr._isBuffer = true

    if (arr.byteLength !== 0)
      arr._dataview = new xDataView(arr.buffer, arr.byteOffset, arr.byteLength)

    return arr

  } else {
    // This is a browser that doesn't support augmenting the `Uint8Array`
    // instance (*ahem* Firefox) so use an ES6 `Proxy`.
    var proxyBuffer = new ProxyBuffer(arr)
    var proxy = new Proxy(proxyBuffer, ProxyHandler)
    proxyBuffer._proxy = proxy
    return proxy
  }
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArrayIsh (subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }

  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }

  return byteArray
}

function base64ToBytes (str) {
  return require('base64-js').toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos, i = 0
  while (i < length) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break

    dst[i + offset] = src[i]
    i++
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint (value, max) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value >= 0,
      'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754(value, max, min) {
  assert(typeof (value) == 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

},{"base64-js":3,"typedarray":4}],"native-buffer-browserify":[function(require,module,exports){
module.exports=require('PcZj9L');
},{}],3:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],4:[function(require,module,exports){
var undefined = (void 0); // Paranoia

// Beyond this value, index getters/setters (i.e. array[0], array[1]) are so slow to
// create, and consume so much memory, that the browser appears frozen.
var MAX_ARRAY_LENGTH = 1e5;

// Approximations of internal ECMAScript conversion functions
var ECMAScript = (function() {
  // Stash a copy in case other scripts modify these
  var opts = Object.prototype.toString,
      ophop = Object.prototype.hasOwnProperty;

  return {
    // Class returns internal [[Class]] property, used to avoid cross-frame instanceof issues:
    Class: function(v) { return opts.call(v).replace(/^\[object *|\]$/g, ''); },
    HasProperty: function(o, p) { return p in o; },
    HasOwnProperty: function(o, p) { return ophop.call(o, p); },
    IsCallable: function(o) { return typeof o === 'function'; },
    ToInt32: function(v) { return v >> 0; },
    ToUint32: function(v) { return v >>> 0; }
  };
}());

// Snapshot intrinsics
var LN2 = Math.LN2,
    abs = Math.abs,
    floor = Math.floor,
    log = Math.log,
    min = Math.min,
    pow = Math.pow,
    round = Math.round;

// ES5: lock down object properties
function configureProperties(obj) {
  if (getOwnPropertyNames && defineProperty) {
    var props = getOwnPropertyNames(obj), i;
    for (i = 0; i < props.length; i += 1) {
      defineProperty(obj, props[i], {
        value: obj[props[i]],
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
}

// emulate ES5 getter/setter API using legacy APIs
// http://blogs.msdn.com/b/ie/archive/2010/09/07/transitioning-existing-code-to-the-es5-getter-setter-apis.aspx
// (second clause tests for Object.defineProperty() in IE<9 that only supports extending DOM prototypes, but
// note that IE<9 does not support __defineGetter__ or __defineSetter__ so it just renders the method harmless)
var defineProperty = Object.defineProperty || function(o, p, desc) {
  if (!o === Object(o)) throw new TypeError("Object.defineProperty called on non-object");
  if (ECMAScript.HasProperty(desc, 'get') && Object.prototype.__defineGetter__) { Object.prototype.__defineGetter__.call(o, p, desc.get); }
  if (ECMAScript.HasProperty(desc, 'set') && Object.prototype.__defineSetter__) { Object.prototype.__defineSetter__.call(o, p, desc.set); }
  if (ECMAScript.HasProperty(desc, 'value')) { o[p] = desc.value; }
  return o;
};

var getOwnPropertyNames = Object.getOwnPropertyNames || function getOwnPropertyNames(o) {
  if (o !== Object(o)) throw new TypeError("Object.getOwnPropertyNames called on non-object");
  var props = [], p;
  for (p in o) {
    if (ECMAScript.HasOwnProperty(o, p)) {
      props.push(p);
    }
  }
  return props;
};

// ES5: Make obj[index] an alias for obj._getter(index)/obj._setter(index, value)
// for index in 0 ... obj.length
function makeArrayAccessors(obj) {
  if (!defineProperty) { return; }

  if (obj.length > MAX_ARRAY_LENGTH) throw new RangeError("Array too large for polyfill");

  function makeArrayAccessor(index) {
    defineProperty(obj, index, {
      'get': function() { return obj._getter(index); },
      'set': function(v) { obj._setter(index, v); },
      enumerable: true,
      configurable: false
    });
  }

  var i;
  for (i = 0; i < obj.length; i += 1) {
    makeArrayAccessor(i);
  }
}

// Internal conversion functions:
//    pack<Type>()   - take a number (interpreted as Type), output a byte array
//    unpack<Type>() - take a byte array, output a Type-like number

function as_signed(value, bits) { var s = 32 - bits; return (value << s) >> s; }
function as_unsigned(value, bits) { var s = 32 - bits; return (value << s) >>> s; }

function packI8(n) { return [n & 0xff]; }
function unpackI8(bytes) { return as_signed(bytes[0], 8); }

function packU8(n) { return [n & 0xff]; }
function unpackU8(bytes) { return as_unsigned(bytes[0], 8); }

function packU8Clamped(n) { n = round(Number(n)); return [n < 0 ? 0 : n > 0xff ? 0xff : n & 0xff]; }

function packI16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackI16(bytes) { return as_signed(bytes[0] << 8 | bytes[1], 16); }

function packU16(n) { return [(n >> 8) & 0xff, n & 0xff]; }
function unpackU16(bytes) { return as_unsigned(bytes[0] << 8 | bytes[1], 16); }

function packI32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackI32(bytes) { return as_signed(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packU32(n) { return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff]; }
function unpackU32(bytes) { return as_unsigned(bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3], 32); }

function packIEEE754(v, ebits, fbits) {

  var bias = (1 << (ebits - 1)) - 1,
      s, e, f, ln,
      i, bits, str, bytes;

  function roundToEven(n) {
    var w = floor(n), f = n - w;
    if (f < 0.5)
      return w;
    if (f > 0.5)
      return w + 1;
    return w % 2 ? w + 1 : w;
  }

  // Compute sign, exponent, fraction
  if (v !== v) {
    // NaN
    // http://dev.w3.org/2006/webapi/WebIDL/#es-type-mapping
    e = (1 << ebits) - 1; f = pow(2, fbits - 1); s = 0;
  } else if (v === Infinity || v === -Infinity) {
    e = (1 << ebits) - 1; f = 0; s = (v < 0) ? 1 : 0;
  } else if (v === 0) {
    e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
  } else {
    s = v < 0;
    v = abs(v);

    if (v >= pow(2, 1 - bias)) {
      e = min(floor(log(v) / LN2), 1023);
      f = roundToEven(v / pow(2, e) * pow(2, fbits));
      if (f / pow(2, fbits) >= 2) {
        e = e + 1;
        f = 1;
      }
      if (e > bias) {
        // Overflow
        e = (1 << ebits) - 1;
        f = 0;
      } else {
        // Normalized
        e = e + bias;
        f = f - pow(2, fbits);
      }
    } else {
      // Denormalized
      e = 0;
      f = roundToEven(v / pow(2, 1 - bias - fbits));
    }
  }

  // Pack sign, exponent, fraction
  bits = [];
  for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = floor(f / 2); }
  for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = floor(e / 2); }
  bits.push(s ? 1 : 0);
  bits.reverse();
  str = bits.join('');

  // Bits to bytes
  bytes = [];
  while (str.length) {
    bytes.push(parseInt(str.substring(0, 8), 2));
    str = str.substring(8);
  }
  return bytes;
}

function unpackIEEE754(bytes, ebits, fbits) {

  // Bytes to bits
  var bits = [], i, j, b, str,
      bias, s, e, f;

  for (i = bytes.length; i; i -= 1) {
    b = bytes[i - 1];
    for (j = 8; j; j -= 1) {
      bits.push(b % 2 ? 1 : 0); b = b >> 1;
    }
  }
  bits.reverse();
  str = bits.join('');

  // Unpack sign, exponent, fraction
  bias = (1 << (ebits - 1)) - 1;
  s = parseInt(str.substring(0, 1), 2) ? -1 : 1;
  e = parseInt(str.substring(1, 1 + ebits), 2);
  f = parseInt(str.substring(1 + ebits), 2);

  // Produce number
  if (e === (1 << ebits) - 1) {
    return f !== 0 ? NaN : s * Infinity;
  } else if (e > 0) {
    // Normalized
    return s * pow(2, e - bias) * (1 + f / pow(2, fbits));
  } else if (f !== 0) {
    // Denormalized
    return s * pow(2, -(bias - 1)) * (f / pow(2, fbits));
  } else {
    return s < 0 ? -0 : 0;
  }
}

function unpackF64(b) { return unpackIEEE754(b, 11, 52); }
function packF64(v) { return packIEEE754(v, 11, 52); }
function unpackF32(b) { return unpackIEEE754(b, 8, 23); }
function packF32(v) { return packIEEE754(v, 8, 23); }


//
// 3 The ArrayBuffer Type
//

(function() {

  /** @constructor */
  var ArrayBuffer = function ArrayBuffer(length) {
    length = ECMAScript.ToInt32(length);
    if (length < 0) throw new RangeError('ArrayBuffer size is not a small enough positive integer');

    this.byteLength = length;
    this._bytes = [];
    this._bytes.length = length;

    var i;
    for (i = 0; i < this.byteLength; i += 1) {
      this._bytes[i] = 0;
    }

    configureProperties(this);
  };

  exports.ArrayBuffer = exports.ArrayBuffer || ArrayBuffer;

  //
  // 4 The ArrayBufferView Type
  //

  // NOTE: this constructor is not exported
  /** @constructor */
  var ArrayBufferView = function ArrayBufferView() {
    //this.buffer = null;
    //this.byteOffset = 0;
    //this.byteLength = 0;
  };

  //
  // 5 The Typed Array View Types
  //

  function makeConstructor(bytesPerElement, pack, unpack) {
    // Each TypedArray type requires a distinct constructor instance with
    // identical logic, which this produces.

    var ctor;
    ctor = function(buffer, byteOffset, length) {
      var array, sequence, i, s;

      if (!arguments.length || typeof arguments[0] === 'number') {
        // Constructor(unsigned long length)
        this.length = ECMAScript.ToInt32(arguments[0]);
        if (length < 0) throw new RangeError('ArrayBufferView size is not a small enough positive integer');

        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;
      } else if (typeof arguments[0] === 'object' && arguments[0].constructor === ctor) {
        // Constructor(TypedArray array)
        array = arguments[0];

        this.length = array.length;
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          this._setter(i, array._getter(i));
        }
      } else if (typeof arguments[0] === 'object' &&
                 !(arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(sequence<type> array)
        sequence = arguments[0];

        this.length = ECMAScript.ToUint32(sequence.length);
        this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        this.buffer = new ArrayBuffer(this.byteLength);
        this.byteOffset = 0;

        for (i = 0; i < this.length; i += 1) {
          s = sequence[i];
          this._setter(i, Number(s));
        }
      } else if (typeof arguments[0] === 'object' &&
                 (arguments[0] instanceof ArrayBuffer || ECMAScript.Class(arguments[0]) === 'ArrayBuffer')) {
        // Constructor(ArrayBuffer buffer,
        //             optional unsigned long byteOffset, optional unsigned long length)
        this.buffer = buffer;

        this.byteOffset = ECMAScript.ToUint32(byteOffset);
        if (this.byteOffset > this.buffer.byteLength) {
          throw new RangeError("byteOffset out of range");
        }

        if (this.byteOffset % this.BYTES_PER_ELEMENT) {
          // The given byteOffset must be a multiple of the element
          // size of the specific type, otherwise an exception is raised.
          throw new RangeError("ArrayBuffer length minus the byteOffset is not a multiple of the element size.");
        }

        if (arguments.length < 3) {
          this.byteLength = this.buffer.byteLength - this.byteOffset;

          if (this.byteLength % this.BYTES_PER_ELEMENT) {
            throw new RangeError("length of buffer minus byteOffset not a multiple of the element size");
          }
          this.length = this.byteLength / this.BYTES_PER_ELEMENT;
        } else {
          this.length = ECMAScript.ToUint32(length);
          this.byteLength = this.length * this.BYTES_PER_ELEMENT;
        }

        if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
          throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }

      this.constructor = ctor;

      configureProperties(this);
      makeArrayAccessors(this);
    };

    ctor.prototype = new ArrayBufferView();
    ctor.prototype.BYTES_PER_ELEMENT = bytesPerElement;
    ctor.prototype._pack = pack;
    ctor.prototype._unpack = unpack;
    ctor.BYTES_PER_ELEMENT = bytesPerElement;

    // getter type (unsigned long index);
    ctor.prototype._getter = function(index) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = [], i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        bytes.push(this.buffer._bytes[o]);
      }
      return this._unpack(bytes);
    };

    // NONSTANDARD: convenience alias for getter: type get(unsigned long index);
    ctor.prototype.get = ctor.prototype._getter;

    // setter void (unsigned long index, type value);
    ctor.prototype._setter = function(index, value) {
      if (arguments.length < 2) throw new SyntaxError("Not enough arguments");

      index = ECMAScript.ToUint32(index);
      if (index >= this.length) {
        return undefined;
      }

      var bytes = this._pack(value), i, o;
      for (i = 0, o = this.byteOffset + index * this.BYTES_PER_ELEMENT;
           i < this.BYTES_PER_ELEMENT;
           i += 1, o += 1) {
        this.buffer._bytes[o] = bytes[i];
      }
    };

    // void set(TypedArray array, optional unsigned long offset);
    // void set(sequence<type> array, optional unsigned long offset);
    ctor.prototype.set = function(index, value) {
      if (arguments.length < 1) throw new SyntaxError("Not enough arguments");
      var array, sequence, offset, len,
          i, s, d,
          byteOffset, byteLength, tmp;

      if (typeof arguments[0] === 'object' && arguments[0].constructor === this.constructor) {
        // void set(TypedArray array, optional unsigned long offset);
        array = arguments[0];
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + array.length > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        byteOffset = this.byteOffset + offset * this.BYTES_PER_ELEMENT;
        byteLength = array.length * this.BYTES_PER_ELEMENT;

        if (array.buffer === this.buffer) {
          tmp = [];
          for (i = 0, s = array.byteOffset; i < byteLength; i += 1, s += 1) {
            tmp[i] = array.buffer._bytes[s];
          }
          for (i = 0, d = byteOffset; i < byteLength; i += 1, d += 1) {
            this.buffer._bytes[d] = tmp[i];
          }
        } else {
          for (i = 0, s = array.byteOffset, d = byteOffset;
               i < byteLength; i += 1, s += 1, d += 1) {
            this.buffer._bytes[d] = array.buffer._bytes[s];
          }
        }
      } else if (typeof arguments[0] === 'object' && typeof arguments[0].length !== 'undefined') {
        // void set(sequence<type> array, optional unsigned long offset);
        sequence = arguments[0];
        len = ECMAScript.ToUint32(sequence.length);
        offset = ECMAScript.ToUint32(arguments[1]);

        if (offset + len > this.length) {
          throw new RangeError("Offset plus length of array is out of range");
        }

        for (i = 0; i < len; i += 1) {
          s = sequence[i];
          this._setter(offset + i, Number(s));
        }
      } else {
        throw new TypeError("Unexpected argument type(s)");
      }
    };

    // TypedArray subarray(long begin, optional long end);
    ctor.prototype.subarray = function(start, end) {
      function clamp(v, min, max) { return v < min ? min : v > max ? max : v; }

      start = ECMAScript.ToInt32(start);
      end = ECMAScript.ToInt32(end);

      if (arguments.length < 1) { start = 0; }
      if (arguments.length < 2) { end = this.length; }

      if (start < 0) { start = this.length + start; }
      if (end < 0) { end = this.length + end; }

      start = clamp(start, 0, this.length);
      end = clamp(end, 0, this.length);

      var len = end - start;
      if (len < 0) {
        len = 0;
      }

      return new this.constructor(
        this.buffer, this.byteOffset + start * this.BYTES_PER_ELEMENT, len);
    };

    return ctor;
  }

  var Int8Array = makeConstructor(1, packI8, unpackI8);
  var Uint8Array = makeConstructor(1, packU8, unpackU8);
  var Uint8ClampedArray = makeConstructor(1, packU8Clamped, unpackU8);
  var Int16Array = makeConstructor(2, packI16, unpackI16);
  var Uint16Array = makeConstructor(2, packU16, unpackU16);
  var Int32Array = makeConstructor(4, packI32, unpackI32);
  var Uint32Array = makeConstructor(4, packU32, unpackU32);
  var Float32Array = makeConstructor(4, packF32, unpackF32);
  var Float64Array = makeConstructor(8, packF64, unpackF64);

  exports.Int8Array = exports.Int8Array || Int8Array;
  exports.Uint8Array = exports.Uint8Array || Uint8Array;
  exports.Uint8ClampedArray = exports.Uint8ClampedArray || Uint8ClampedArray;
  exports.Int16Array = exports.Int16Array || Int16Array;
  exports.Uint16Array = exports.Uint16Array || Uint16Array;
  exports.Int32Array = exports.Int32Array || Int32Array;
  exports.Uint32Array = exports.Uint32Array || Uint32Array;
  exports.Float32Array = exports.Float32Array || Float32Array;
  exports.Float64Array = exports.Float64Array || Float64Array;
}());

//
// 6 The DataView View Type
//

(function() {
  function r(array, index) {
    return ECMAScript.IsCallable(array.get) ? array.get(index) : array[index];
  }

  var IS_BIG_ENDIAN = (function() {
    var u16array = new(exports.Uint16Array)([0x1234]),
        u8array = new(exports.Uint8Array)(u16array.buffer);
    return r(u8array, 0) === 0x12;
  }());

  // Constructor(ArrayBuffer buffer,
  //             optional unsigned long byteOffset,
  //             optional unsigned long byteLength)
  /** @constructor */
  var DataView = function DataView(buffer, byteOffset, byteLength) {
    if (arguments.length === 0) {
      buffer = new ArrayBuffer(0);
    } else if (!(buffer instanceof ArrayBuffer || ECMAScript.Class(buffer) === 'ArrayBuffer')) {
      throw new TypeError("TypeError");
    }

    this.buffer = buffer || new ArrayBuffer(0);

    this.byteOffset = ECMAScript.ToUint32(byteOffset);
    if (this.byteOffset > this.buffer.byteLength) {
      throw new RangeError("byteOffset out of range");
    }

    if (arguments.length < 3) {
      this.byteLength = this.buffer.byteLength - this.byteOffset;
    } else {
      this.byteLength = ECMAScript.ToUint32(byteLength);
    }

    if ((this.byteOffset + this.byteLength) > this.buffer.byteLength) {
      throw new RangeError("byteOffset and length reference an area beyond the end of the buffer");
    }

    configureProperties(this);
  };

  function makeGetter(arrayType) {
    return function(byteOffset, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);

      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }
      byteOffset += this.byteOffset;

      var uint8Array = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT),
          bytes = [], i;
      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(uint8Array, i));
      }

      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      return r(new arrayType(new Uint8Array(bytes).buffer), 0);
    };
  }

  DataView.prototype.getUint8 = makeGetter(exports.Uint8Array);
  DataView.prototype.getInt8 = makeGetter(exports.Int8Array);
  DataView.prototype.getUint16 = makeGetter(exports.Uint16Array);
  DataView.prototype.getInt16 = makeGetter(exports.Int16Array);
  DataView.prototype.getUint32 = makeGetter(exports.Uint32Array);
  DataView.prototype.getInt32 = makeGetter(exports.Int32Array);
  DataView.prototype.getFloat32 = makeGetter(exports.Float32Array);
  DataView.prototype.getFloat64 = makeGetter(exports.Float64Array);

  function makeSetter(arrayType) {
    return function(byteOffset, value, littleEndian) {

      byteOffset = ECMAScript.ToUint32(byteOffset);
      if (byteOffset + arrayType.BYTES_PER_ELEMENT > this.byteLength) {
        throw new RangeError("Array index out of range");
      }

      // Get bytes
      var typeArray = new arrayType([value]),
          byteArray = new Uint8Array(typeArray.buffer),
          bytes = [], i, byteView;

      for (i = 0; i < arrayType.BYTES_PER_ELEMENT; i += 1) {
        bytes.push(r(byteArray, i));
      }

      // Flip if necessary
      if (Boolean(littleEndian) === Boolean(IS_BIG_ENDIAN)) {
        bytes.reverse();
      }

      // Write them
      byteView = new Uint8Array(this.buffer, byteOffset, arrayType.BYTES_PER_ELEMENT);
      byteView.set(bytes);
    };
  }

  DataView.prototype.setUint8 = makeSetter(exports.Uint8Array);
  DataView.prototype.setInt8 = makeSetter(exports.Int8Array);
  DataView.prototype.setUint16 = makeSetter(exports.Uint16Array);
  DataView.prototype.setInt16 = makeSetter(exports.Int16Array);
  DataView.prototype.setUint32 = makeSetter(exports.Uint32Array);
  DataView.prototype.setInt32 = makeSetter(exports.Int32Array);
  DataView.prototype.setFloat32 = makeSetter(exports.Float32Array);
  DataView.prototype.setFloat64 = makeSetter(exports.Float64Array);

  exports.DataView = exports.DataView || DataView;

}());

},{}]},{},[])
;;module.exports=require("native-buffer-browserify").Buffer

},{}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
var process=require("__browserify_process");// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

},{"__browserify_process":4}],6:[function(require,module,exports){
"use strict";

var activeLine = "line@activine"

function onCursorActivity(editor) {
  var line = editor.getLineHandle(editor.getCursor().line)
  var active = editor[activeLine]
  if (line != active) {
    editor.removeLineClass(active, "background", "activeline")
    editor[activeLine] = editor.addLineClass(line, "background", "activeline")
  }
}

function setup(editor, value) {
  /**
  Takes editor and enables persists changes to the buffer across the sessions.
  **/
  if (value) {
    editor[activeLine] = editor.addLineClass(0, "background", "activeline")
    editor.on("cursorActivity", onCursorActivity)
    onCursorActivity(editor)
  } else if (activeLine in editor) {
    editor.removeLineClass(editor[activeLine], "background", "activeline")
    delete editor[activeLine]
    editor.off("cursorActivity", onCursorActivity)
  }
}

function plugin(CodeMirror) {
  CodeMirror.defineOption("activeLine", false, setup)
}

module.exports = plugin

},{}],7:[function(require,module,exports){
"use strict";

function onChange(editor) {
  localStorage[window.location.href.split("#")[0]] = editor.getValue()
}

function setup(editor, value) {
  /**
  Takes editor and enables persists changes to the buffer across the sessions.
  **/
  if (value) {
    var address = window.location.href.split("#")[0]
    var persisted = localStorage[address] || editor.getValue()
    editor.setValue(persisted)
    editor.on("change", onChange)
  } else {
    editor.off("change", onChange)
  }
}

function plugin(CodeMirror) {
  CodeMirror.defineOption("persist", false, setup)
}

module.exports = plugin

},{}],8:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.analyzer',
            doc: void 0
        };
    var wisp_ast = require('./ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var isKeyword = wisp_ast.isKeyword;
    var isQuote = wisp_ast.isQuote;
    var symbol = wisp_ast.symbol;
    var namespace = wisp_ast.namespace;
    var name = wisp_ast.name;
    var prStr = wisp_ast.prStr;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var wisp_sequence = require('./sequence');
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var conj = wisp_sequence.conj;
    var partition = wisp_sequence.partition;
    var seq = wisp_sequence.seq;
    var isEmpty = wisp_sequence.isEmpty;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var isEvery = wisp_sequence.isEvery;
    var concat = wisp_sequence.concat;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var last = wisp_sequence.last;
    var butlast = wisp_sequence.butlast;
    var interleave = wisp_sequence.interleave;
    var cons = wisp_sequence.cons;
    var count = wisp_sequence.count;
    var some = wisp_sequence.some;
    var assoc = wisp_sequence.assoc;
    var reduce = wisp_sequence.reduce;
    var filter = wisp_sequence.filter;
    var isSeq = wisp_sequence.isSeq;
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isDictionary = wisp_runtime.isDictionary;
    var isVector = wisp_runtime.isVector;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isDate = wisp_runtime.isDate;
    var isRePattern = wisp_runtime.isRePattern;
    var isEven = wisp_runtime.isEven;
    var isEqual = wisp_runtime.isEqual;
    var max = wisp_runtime.max;
    var dec = wisp_runtime.dec;
    var dictionary = wisp_runtime.dictionary;
    var subs = wisp_runtime.subs;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var wisp_expander = require('./expander');
    var macroexpand = wisp_expander.macroexpand;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
}
var syntaxError = exports.syntaxError = function syntaxError(message, form) {
        return function () {
            var metadataø1 = meta(form);
            var lineø1 = ((metadataø1 || 0)['start'] || 0)['line'];
            var uriø1 = (metadataø1 || 0)['uri'];
            var columnø1 = ((metadataø1 || 0)['start'] || 0)['column'];
            var errorø1 = SyntaxError('' + message + '\n' + 'Form: ' + prStr(form) + '\n' + 'URI: ' + uriø1 + '\n' + 'Line: ' + lineø1 + '\n' + 'Column: ' + columnø1);
            errorø1.lineNumber = lineø1;
            errorø1.line = lineø1;
            errorø1.columnNumber = columnø1;
            errorø1.column = columnø1;
            errorø1.fileName = uriø1;
            errorø1.uri = uriø1;
            return (function () {
                throw errorø1;
            })();
        }.call(this);
    };
var analyzeKeyword = exports.analyzeKeyword = function analyzeKeyword(env, form) {
        return {
            'op': 'constant',
            'form': form
        };
    };
var __specials__ = exports.__specials__ = {};
var installSpecial = exports.installSpecial = function installSpecial(op, analyzer) {
        return (__specials__ || 0)[name(op)] = analyzer;
    };
var analyzeSpecial = exports.analyzeSpecial = function analyzeSpecial(analyzer, env, form) {
        return function () {
            var metadataø1 = meta(form);
            var astø1 = analyzer(env, form);
            return conj({
                'start': (metadataø1 || 0)['start'],
                'end': (metadataø1 || 0)['end']
            }, astø1);
        }.call(this);
    };
var analyzeIf = exports.analyzeIf = function analyzeIf(env, form) {
        return function () {
            var formsø1 = rest(form);
            var testø1 = analyze(env, first(formsø1));
            var consequentø1 = analyze(env, second(formsø1));
            var alternateø1 = analyze(env, third(formsø1));
            count(formsø1) < 2 ? syntaxError('Malformed if expression, too few operands', form) : void 0;
            return {
                'op': 'if',
                'form': form,
                'test': testø1,
                'consequent': consequentø1,
                'alternate': alternateø1
            };
        }.call(this);
    };
installSpecial('if', analyzeIf);
var analyzeThrow = exports.analyzeThrow = function analyzeThrow(env, form) {
        return function () {
            var expressionø1 = analyze(env, second(form));
            return {
                'op': 'throw',
                'form': form,
                'throw': expressionø1
            };
        }.call(this);
    };
installSpecial('throw', analyzeThrow);
var analyzeTry = exports.analyzeTry = function analyzeTry(env, form) {
        return function () {
            var formsø1 = vec(rest(form));
            var tailø1 = last(formsø1);
            var finalizerFormø1 = isList(tailø1) && isEqual(symbol(void 0, 'finally'), first(tailø1)) ? rest(tailø1) : void 0;
            var finalizerø1 = finalizerFormø1 ? analyzeBlock(env, finalizerFormø1) : void 0;
            var bodyFormø1 = finalizerø1 ? butlast(formsø1) : formsø1;
            var tailø2 = last(bodyFormø1);
            var handlerFormø1 = isList(tailø2) && isEqual(symbol(void 0, 'catch'), first(tailø2)) ? rest(tailø2) : void 0;
            var handlerø1 = handlerFormø1 ? conj({ 'name': analyze(env, first(handlerFormø1)) }, analyzeBlock(env, rest(handlerFormø1))) : void 0;
            var bodyø1 = handlerFormø1 ? analyzeBlock(env, butlast(bodyFormø1)) : analyzeBlock(env, bodyFormø1);
            return {
                'op': 'try',
                'form': form,
                'body': bodyø1,
                'handler': handlerø1,
                'finalizer': finalizerø1
            };
        }.call(this);
    };
installSpecial('try', analyzeTry);
var analyzeSet = exports.analyzeSet = function analyzeSet(env, form) {
        return function () {
            var bodyø1 = rest(form);
            var leftø1 = first(bodyø1);
            var rightø1 = second(bodyø1);
            var targetø1 = isSymbol(leftø1) ? analyzeSymbol(env, leftø1) : isList(leftø1) ? analyzeList(env, leftø1) : 'else' ? leftø1 : void 0;
            var valueø1 = analyze(env, rightø1);
            return {
                'op': 'set!',
                'target': targetø1,
                'value': valueø1,
                'form': form
            };
        }.call(this);
    };
installSpecial('set!', analyzeSet);
var analyzeNew = exports.analyzeNew = function analyzeNew(env, form) {
        return function () {
            var bodyø1 = rest(form);
            var constructorø1 = analyze(env, first(bodyø1));
            var paramsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, rest(bodyø1)));
            return {
                'op': 'new',
                'constructor': constructorø1,
                'form': form,
                'params': paramsø1
            };
        }.call(this);
    };
installSpecial('new', analyzeNew);
var analyzeAget = exports.analyzeAget = function analyzeAget(env, form) {
        return function () {
            var bodyø1 = rest(form);
            var targetø1 = analyze(env, first(bodyø1));
            var attributeø1 = second(bodyø1);
            var fieldø1 = isQuote(attributeø1) && isSymbol(second(attributeø1)) && second(attributeø1);
            return isNil(attributeø1) ? syntaxError('Malformed aget expression expected (aget object member)', form) : {
                'op': 'member-expression',
                'computed': !fieldø1,
                'form': form,
                'target': targetø1,
                'property': fieldø1 ? conj(analyzeSpecial(analyzeIdentifier, env, fieldø1), { 'binding': void 0 }) : analyze(env, attributeø1)
            };
        }.call(this);
    };
installSpecial('aget', analyzeAget);
var parseDef = exports.parseDef = function parseDef() {
        switch (arguments.length) {
        case 1:
            var id = arguments[0];
            return { 'id': id };
        case 2:
            var id = arguments[0];
            var init = arguments[1];
            return {
                'id': id,
                'init': init
            };
        case 3:
            var id = arguments[0];
            var doc = arguments[1];
            var init = arguments[2];
            return {
                'id': id,
                'doc': doc,
                'init': init
            };
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var analyzeDef = exports.analyzeDef = function analyzeDef(env, form) {
        return function () {
            var paramsø1 = parseDef.apply(void 0, vec(rest(form)));
            var idø1 = (paramsø1 || 0)['id'];
            var metadataø1 = meta(idø1);
            var bindingø1 = analyzeSpecial(analyzeDeclaration, env, idø1);
            var initø1 = analyze(env, (paramsø1 || 0)['init']);
            var docø1 = (paramsø1 || 0)['doc'] || (metadataø1 || 0)['doc'];
            return {
                'op': 'def',
                'doc': docø1,
                'id': bindingø1,
                'init': initø1,
                'export': (env || 0)['top'] && !(metadataø1 || 0)['private'],
                'form': form
            };
        }.call(this);
    };
installSpecial('def', analyzeDef);
var analyzeDo = exports.analyzeDo = function analyzeDo(env, form) {
        return function () {
            var expressionsø1 = rest(form);
            var bodyø1 = analyzeBlock(env, expressionsø1);
            return conj(bodyø1, {
                'op': 'do',
                'form': form
            });
        }.call(this);
    };
installSpecial('do', analyzeDo);
var analyzeSymbol = exports.analyzeSymbol = function analyzeSymbol(env, form) {
        return function () {
            var formsø1 = split(name(form), '.');
            var metadataø1 = meta(form);
            var startø1 = (metadataø1 || 0)['start'];
            var endø1 = (metadataø1 || 0)['end'];
            var expansionø1 = count(formsø1) > 1 ? list(symbol(void 0, 'aget'), withMeta(symbol(first(formsø1)), conj(metadataø1, {
                    'start': startø1,
                    'end': {
                        'line': (endø1 || 0)['line'],
                        'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
                    }
                })), list(symbol(void 0, 'quote'), withMeta(symbol(join('.', rest(formsø1))), conj(metadataø1, {
                    'end': endø1,
                    'start': {
                        'line': (startø1 || 0)['line'],
                        'column': 1 + (startø1 || 0)['column'] + count(first(formsø1))
                    }
                })))) : void 0;
            return expansionø1 ? analyze(env, withMeta(expansionø1, meta(form))) : analyzeSpecial(analyzeIdentifier, env, form);
        }.call(this);
    };
var analyzeIdentifier = exports.analyzeIdentifier = function analyzeIdentifier(env, form) {
        return {
            'op': 'var',
            'type': 'identifier',
            'form': form,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end'],
            'binding': resolveBinding(env, form)
        };
    };
var unresolvedBinding = exports.unresolvedBinding = function unresolvedBinding(env, form) {
        return {
            'op': 'unresolved-binding',
            'type': 'unresolved-binding',
            'identifier': {
                'type': 'identifier',
                'form': symbol(namespace(form), name(form))
            },
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end']
        };
    };
var resolveBinding = exports.resolveBinding = function resolveBinding(env, form) {
        return ((env || 0)['locals'] || 0)[name(form)] || ((env || 0)['enclosed'] || 0)[name(form)] || unresolvedBinding(env, form);
    };
var analyzeShadow = exports.analyzeShadow = function analyzeShadow(env, id) {
        return function () {
            var bindingø1 = resolveBinding(env, id);
            return {
                'depth': inc((bindingø1 || 0)['depth'] || 0),
                'shadow': bindingø1
            };
        }.call(this);
    };
var analyzeBinding = exports.analyzeBinding = function analyzeBinding(env, form) {
        return function () {
            var idø1 = first(form);
            var bodyø1 = second(form);
            return conj(analyzeShadow(env, idø1), {
                'op': 'binding',
                'type': 'binding',
                'id': idø1,
                'init': analyze(env, bodyø1),
                'form': form
            });
        }.call(this);
    };
var analyzeDeclaration = exports.analyzeDeclaration = function analyzeDeclaration(env, form) {
        !!(namespace(form) || 1 < count(split('.', '' + form))) ? (function () {
            throw Error('' + 'Assert failed: ' + '' + '(not (or (namespace form) (< 1 (count (split "." (str form))))))');
        })() : void 0;
        return conj(analyzeShadow(env, form), {
            'op': 'var',
            'type': 'identifier',
            'depth': 0,
            'id': form,
            'form': form
        });
    };
var analyzeParam = exports.analyzeParam = function analyzeParam(env, form) {
        return conj(analyzeShadow(env, form), {
            'op': 'param',
            'type': 'parameter',
            'id': form,
            'form': form,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end']
        });
    };
var withBinding = exports.withBinding = function withBinding(env, form) {
        return conj(env, {
            'locals': assoc((env || 0)['locals'], name((form || 0)['id']), form),
            'bindings': conj((env || 0)['bindings'], form)
        });
    };
var withParam = exports.withParam = function withParam(env, form) {
        return conj(withBinding(env, form), { 'params': conj((env || 0)['params'], form) });
    };
var subEnv = exports.subEnv = function subEnv(env) {
        return {
            'enclosed': conj({}, (env || 0)['enclosed'], (env || 0)['locals']),
            'locals': {},
            'bindings': [],
            'params': (env || 0)['params'] || []
        };
    };
var analyzeLet_ = exports.analyzeLet_ = function analyzeLet_(env, form, isLoop) {
        return function () {
            var expressionsø1 = rest(form);
            var bindingsø1 = first(expressionsø1);
            var bodyø1 = rest(expressionsø1);
            var isValidBindingsø1 = isVector(bindingsø1) && isEven(count(bindingsø1));
            var _ø1 = !isValidBindingsø1 ? (function () {
                    throw Error('' + 'Assert failed: ' + 'bindings must be vector of even number of elements' + 'valid-bindings?');
                })() : void 0;
            var scopeø1 = reduce(function ($1, $2) {
                    return withBinding($1, analyzeBinding($1, $2));
                }, subEnv(env), partition(2, bindingsø1));
            var bindingsø2 = (scopeø1 || 0)['bindings'];
            var expressionsø2 = analyzeBlock(isLoop ? conj(scopeø1, { 'params': bindingsø2 }) : scopeø1, bodyø1);
            return {
                'op': 'let',
                'form': form,
                'start': (meta(form) || 0)['start'],
                'end': (meta(form) || 0)['end'],
                'bindings': bindingsø2,
                'statements': (expressionsø2 || 0)['statements'],
                'result': (expressionsø2 || 0)['result']
            };
        }.call(this);
    };
var analyzeLet = exports.analyzeLet = function analyzeLet(env, form) {
        return analyzeLet_(env, form, false);
    };
installSpecial('let', analyzeLet);
var analyzeLoop = exports.analyzeLoop = function analyzeLoop(env, form) {
        return conj(analyzeLet_(env, form, true), { 'op': 'loop' });
    };
installSpecial('loop', analyzeLoop);
var analyzeRecur = exports.analyzeRecur = function analyzeRecur(env, form) {
        return function () {
            var paramsø1 = (env || 0)['params'];
            var formsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, rest(form)));
            return isEqual(count(paramsø1), count(formsø1)) ? {
                'op': 'recur',
                'form': form,
                'params': formsø1
            } : syntaxError('Recurs with wrong number of arguments', form);
        }.call(this);
    };
installSpecial('recur', analyzeRecur);
var analyzeQuotedList = exports.analyzeQuotedList = function analyzeQuotedList(form) {
        return {
            'op': 'list',
            'items': map(analyzeQuoted, vec(form)),
            'form': form,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end']
        };
    };
var analyzeQuotedVector = exports.analyzeQuotedVector = function analyzeQuotedVector(form) {
        return {
            'op': 'vector',
            'items': map(analyzeQuoted, form),
            'form': form,
            'start': (meta(form) || 0)['start'],
            'end': (meta(form) || 0)['end']
        };
    };
var analyzeQuotedDictionary = exports.analyzeQuotedDictionary = function analyzeQuotedDictionary(form) {
        return function () {
            var namesø1 = vec(map(analyzeQuoted, keys(form)));
            var valuesø1 = vec(map(analyzeQuoted, vals(form)));
            return {
                'op': 'dictionary',
                'form': form,
                'keys': namesø1,
                'values': valuesø1,
                'start': (meta(form) || 0)['start'],
                'end': (meta(form) || 0)['end']
            };
        }.call(this);
    };
var analyzeQuotedSymbol = exports.analyzeQuotedSymbol = function analyzeQuotedSymbol(form) {
        return {
            'op': 'symbol',
            'name': name(form),
            'namespace': namespace(form),
            'form': form
        };
    };
var analyzeQuotedKeyword = exports.analyzeQuotedKeyword = function analyzeQuotedKeyword(form) {
        return {
            'op': 'keyword',
            'name': name(form),
            'namespace': namespace(form),
            'form': form
        };
    };
var analyzeQuoted = exports.analyzeQuoted = function analyzeQuoted(form) {
        return isSymbol(form) ? analyzeQuotedSymbol(form) : isKeyword(form) ? analyzeQuotedKeyword(form) : isList(form) ? analyzeQuotedList(form) : isVector(form) ? analyzeQuotedVector(form) : isDictionary(form) ? analyzeQuotedDictionary(form) : 'else' ? {
            'op': 'constant',
            'form': form
        } : void 0;
    };
var analyzeQuote = exports.analyzeQuote = function analyzeQuote(env, form) {
        return analyzeQuoted(second(form));
    };
installSpecial('quote', analyzeQuote);
var analyzeStatement = exports.analyzeStatement = function analyzeStatement(env, form) {
        return function () {
            var statementsø1 = (env || 0)['statements'] || [];
            var bindingsø1 = (env || 0)['bindings'] || [];
            var statementø1 = analyze(conj(env, { 'statements': void 0 }), form);
            var opø1 = (statementø1 || 0)['op'];
            var defsø1 = isEqual(opø1, 'def') ? [(statementø1 || 0)['var']] : 'else' ? void 0 : void 0;
            return conj(env, {
                'statements': conj(statementsø1, statementø1),
                'bindings': concat(bindingsø1, defsø1)
            });
        }.call(this);
    };
var analyzeBlock = exports.analyzeBlock = function analyzeBlock(env, form) {
        return function () {
            var bodyø1 = count(form) > 1 ? reduce(analyzeStatement, env, butlast(form)) : void 0;
            var resultø1 = analyze(bodyø1 || env, last(form));
            return {
                'statements': (bodyø1 || 0)['statements'],
                'result': resultø1
            };
        }.call(this);
    };
var analyzeFnMethod = exports.analyzeFnMethod = function analyzeFnMethod(env, form) {
        return function () {
            var signatureø1 = isList(form) && isVector(first(form)) ? first(form) : syntaxError('Malformed fn overload form', form);
            var bodyø1 = rest(form);
            var variadicø1 = some(function ($1) {
                    return isEqual(symbol(void 0, '&'), $1);
                }, signatureø1);
            var paramsø1 = variadicø1 ? filter(function ($1) {
                    return !isEqual(symbol(void 0, '&'), $1);
                }, signatureø1) : signatureø1;
            var arityø1 = variadicø1 ? dec(count(paramsø1)) : count(paramsø1);
            var scopeø1 = reduce(function ($1, $2) {
                    return withParam($1, analyzeParam($1, $2));
                }, conj(env, { 'params': [] }), paramsø1);
            return conj(analyzeBlock(scopeø1, bodyø1), {
                'op': 'overload',
                'variadic': variadicø1,
                'arity': arityø1,
                'params': (scopeø1 || 0)['params'],
                'form': form
            });
        }.call(this);
    };
var analyzeFn = exports.analyzeFn = function analyzeFn(env, form) {
        return function () {
            var formsø1 = rest(form);
            var formsø2 = isSymbol(first(formsø1)) ? formsø1 : cons(void 0, formsø1);
            var idø1 = first(formsø2);
            var bindingø1 = idø1 ? analyzeSpecial(analyzeDeclaration, env, idø1) : void 0;
            var bodyø1 = rest(formsø2);
            var overloadsø1 = isVector(first(bodyø1)) ? list(bodyø1) : isList(first(bodyø1)) && isVector(first(first(bodyø1))) ? bodyø1 : 'else' ? syntaxError('' + 'Malformed fn expression, ' + 'parameter declaration (' + prStr(first(bodyø1)) + ') must be a vector', form) : void 0;
            var scopeø1 = bindingø1 ? withBinding(subEnv(env), bindingø1) : subEnv(env);
            var methodsø1 = map(function ($1) {
                    return analyzeFnMethod(scopeø1, $1);
                }, vec(overloadsø1));
            var arityø1 = max.apply(void 0, map(function ($1) {
                    return ($1 || 0)['arity'];
                }, methodsø1));
            var variadicø1 = some(function ($1) {
                    return ($1 || 0)['variadic'];
                }, methodsø1);
            return {
                'op': 'fn',
                'type': 'function',
                'id': bindingø1,
                'variadic': variadicø1,
                'methods': methodsø1,
                'form': form
            };
        }.call(this);
    };
installSpecial('fn', analyzeFn);
var parseReferences = exports.parseReferences = function parseReferences(forms) {
        return reduce(function (references, form) {
            return isSeq(form) ? assoc(references, name(first(form)), vec(rest(form))) : references;
        }, {}, forms);
    };
var parseRequire = exports.parseRequire = function parseRequire(form) {
        return function () {
            var requirementø1 = isSymbol(form) ? [form] : vec(form);
            var idø1 = first(requirementø1);
            var paramsø1 = dictionary.apply(void 0, rest(requirementø1));
            var renamesø1 = (paramsø1 || 0)['\uA789rename'];
            var namesø1 = (paramsø1 || 0)['\uA789refer'];
            var aliasø1 = (paramsø1 || 0)['\uA789as'];
            var referencesø1 = !isEmpty(namesø1) ? reduce(function (refers, reference) {
                    return conj(refers, {
                        'op': 'refer',
                        'form': reference,
                        'name': reference,
                        'rename': (renamesø1 || 0)[reference] || (renamesø1 || 0)[name(reference)],
                        'ns': idø1
                    });
                }, [], namesø1) : void 0;
            return {
                'op': 'require',
                'alias': aliasø1,
                'ns': idø1,
                'refer': referencesø1,
                'form': form
            };
        }.call(this);
    };
var analyzeNs = exports.analyzeNs = function analyzeNs(env, form) {
        return function () {
            var formsø1 = rest(form);
            var nameø1 = first(formsø1);
            var bodyø1 = rest(formsø1);
            var docø1 = isString(first(bodyø1)) ? first(bodyø1) : void 0;
            var referencesø1 = parseReferences(docø1 ? rest(bodyø1) : bodyø1);
            var requirementsø1 = (referencesø1 || 0)['require'] ? map(parseRequire, (referencesø1 || 0)['require']) : void 0;
            return {
                'op': 'ns',
                'name': nameø1,
                'doc': docø1,
                'require': requirementsø1 ? vec(requirementsø1) : void 0,
                'form': form
            };
        }.call(this);
    };
installSpecial('ns', analyzeNs);
var analyzeList = exports.analyzeList = function analyzeList(env, form) {
        return function () {
            var expansionø1 = macroexpand(form, env);
            var operatorø1 = first(form);
            var analyzerø1 = isSymbol(operatorø1) && (__specials__ || 0)[name(operatorø1)];
            return !(expansionø1 === form) ? analyze(env, expansionø1) : analyzerø1 ? analyzeSpecial(analyzerø1, env, expansionø1) : 'else' ? analyzeInvoke(env, expansionø1) : void 0;
        }.call(this);
    };
var analyzeVector = exports.analyzeVector = function analyzeVector(env, form) {
        return function () {
            var itemsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, form));
            return {
                'op': 'vector',
                'form': form,
                'items': itemsø1
            };
        }.call(this);
    };
var analyzeDictionary = exports.analyzeDictionary = function analyzeDictionary(env, form) {
        return function () {
            var namesø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, keys(form)));
            var valuesø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, vals(form)));
            return {
                'op': 'dictionary',
                'keys': namesø1,
                'values': valuesø1,
                'form': form
            };
        }.call(this);
    };
var analyzeInvoke = exports.analyzeInvoke = function analyzeInvoke(env, form) {
        return function () {
            var calleeø1 = analyze(env, first(form));
            var paramsø1 = vec(map(function ($1) {
                    return analyze(env, $1);
                }, rest(form)));
            return {
                'op': 'invoke',
                'callee': calleeø1,
                'params': paramsø1,
                'form': form
            };
        }.call(this);
    };
var analyzeConstant = exports.analyzeConstant = function analyzeConstant(env, form) {
        return {
            'op': 'constant',
            'form': form
        };
    };
var analyze = exports.analyze = function analyze() {
        switch (arguments.length) {
        case 1:
            var form = arguments[0];
            return analyze({
                'locals': {},
                'bindings': [],
                'top': true
            }, form);
        case 2:
            var env = arguments[0];
            var form = arguments[1];
            return isNil(form) ? analyzeConstant(env, form) : isSymbol(form) ? analyzeSymbol(env, form) : isList(form) ? isEmpty(form) ? analyzeQuoted(form) : analyzeList(env, form) : isDictionary(form) ? analyzeDictionary(env, form) : isVector(form) ? analyzeVector(env, form) : isKeyword(form) ? analyzeKeyword(env, form) : 'else' ? analyzeConstant(env, form) : void 0;
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
},{"./ast":9,"./expander":14,"./runtime":33,"./sequence":34,"./string":35}],9:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.ast',
            doc: void 0
        };
    var wisp_sequence = require('./sequence');
    var isList = wisp_sequence.isList;
    var isSequential = wisp_sequence.isSequential;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var count = wisp_sequence.count;
    var last = wisp_sequence.last;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var repeat = wisp_sequence.repeat;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isVector = wisp_runtime.isVector;
    var isNumber = wisp_runtime.isNumber;
    var isString = wisp_runtime.isString;
    var isBoolean = wisp_runtime.isBoolean;
    var isObject = wisp_runtime.isObject;
    var isDate = wisp_runtime.isDate;
    var isRePattern = wisp_runtime.isRePattern;
    var isDictionary = wisp_runtime.isDictionary;
    var str = wisp_runtime.str;
    var inc = wisp_runtime.inc;
    var subs = wisp_runtime.subs;
    var isEqual = wisp_runtime.isEqual;
}
var withMeta = exports.withMeta = function withMeta(value, metadata) {
        Object.defineProperty(value, 'metadata', {
            'value': metadata,
            'configurable': true
        });
        return value;
    };
var meta = exports.meta = function meta(value) {
        return isNil(value) ? void 0 : value.metadata;
    };
var __nsSeparator__ = exports.__nsSeparator__ = '\u2044';
var Symbol = function Symbol(namespace, name) {
    this.namespace = namespace;
    this.name = name;
    return this;
};
Symbol.type = 'wisp.symbol';
Symbol.prototype.type = Symbol.type;
Symbol.prototype.toString = function () {
    return function () {
        var prefixø1 = '' + '\uFEFF' + '\'';
        var nsø1 = namespace(this);
        return nsø1 ? '' + prefixø1 + nsø1 + '/' + name(this) : '' + prefixø1 + name(this);
    }.call(this);
};
var symbol = exports.symbol = function symbol(ns, id) {
        return isSymbol(ns) ? ns : isKeyword(ns) ? new Symbol(namespace(ns), name(ns)) : isNil(id) ? new Symbol(void 0, ns) : 'else' ? new Symbol(ns, id) : void 0;
    };
var isSymbol = exports.isSymbol = function isSymbol(x) {
        return isString(x) && '\uFEFF' === x[0] && '\'' === x[1] || x && Symbol.type === x.type;
    };
var isKeyword = exports.isKeyword = function isKeyword(x) {
        return isString(x) && count(x) > 1 && first(x) === '\uA789';
    };
var keyword = exports.keyword = function keyword(ns, id) {
        return isKeyword(ns) ? ns : isSymbol(ns) ? '' + '\uA789' + name(ns) : isNil(id) ? '' + '\uA789' + ns : isNil(ns) ? '' + '\uA789' + id : 'else' ? '' + '\uA789' + ns + __nsSeparator__ + id : void 0;
    };
var keywordName = function keywordName(value) {
    return last(split(subs(value, 1), __nsSeparator__));
};
var symbolName = function symbolName(value) {
    return value.name || last(split(subs(value, 2), __nsSeparator__));
};
var name = exports.name = function name(value) {
        return isSymbol(value) ? symbolName(value) : isKeyword(value) ? keywordName(value) : isString(value) ? value : 'else' ? (function () {
            throw new TypeError('' + 'Doesn\'t support name: ' + value);
        })() : void 0;
    };
var keywordNamespace = function keywordNamespace(x) {
    return function () {
        var partsø1 = split(subs(x, 1), __nsSeparator__);
        return count(partsø1) > 1 ? partsø1[0] : void 0;
    }.call(this);
};
var symbolNamespace = function symbolNamespace(x) {
    return function () {
        var partsø1 = isString(x) ? split(subs(x, 1), __nsSeparator__) : [
                x.namespace,
                x.name
            ];
        return count(partsø1) > 1 ? partsø1[0] : void 0;
    }.call(this);
};
var namespace = exports.namespace = function namespace(x) {
        return isSymbol(x) ? symbolNamespace(x) : isKeyword(x) ? keywordNamespace(x) : 'else' ? (function () {
            throw new TypeError('' + 'Doesn\'t supports namespace: ' + x);
        })() : void 0;
    };
var gensym = exports.gensym = function gensym(prefix) {
        return symbol('' + (isNil(prefix) ? 'G__' : prefix) + (gensym.base = gensym.base + 1));
    };
gensym.base = 0;
var isUnquote = exports.isUnquote = function isUnquote(form) {
        return isList(form) && isEqual(first(form), symbol(void 0, 'unquote'));
    };
var isUnquoteSplicing = exports.isUnquoteSplicing = function isUnquoteSplicing(form) {
        return isList(form) && isEqual(first(form), symbol(void 0, 'unquote-splicing'));
    };
var isQuote = exports.isQuote = function isQuote(form) {
        return isList(form) && isEqual(first(form), symbol(void 0, 'quote'));
    };
var isSyntaxQuote = exports.isSyntaxQuote = function isSyntaxQuote(form) {
        return isList(form) && isEqual(first(form), symbol(void 0, 'syntax-quote'));
    };
var normalize = function normalize(n, len) {
    return function loop() {
        var recur = loop;
        var nsø1 = '' + n;
        do {
            recur = count(nsø1) < len ? (loop[0] = '' + '0' + nsø1, loop) : nsø1;
        } while (nsø1 = loop[0], recur === loop);
        return recur;
    }.call(this);
};
var quoteString = exports.quoteString = function quoteString(s) {
        s = join('\\"', split(s, '"'));
        s = join('\\\\', split(s, '\\'));
        s = join('\\b', split(s, '\b'));
        s = join('\\f', split(s, '\f'));
        s = join('\\n', split(s, '\n'));
        s = join('\\r', split(s, '\r'));
        s = join('\\t', split(s, '\t'));
        return '' + '"' + s + '"';
    };
var prStr = exports.prStr = function prStr(x, offset) {
        return function () {
            var offsetø2 = offset || 0;
            return isNil(x) ? 'nil' : isKeyword(x) ? namespace(x) ? '' + ':' + namespace(x) + '/' + name(x) : '' + ':' + name(x) : isSymbol(x) ? namespace(x) ? '' + namespace(x) + '/' + name(x) : name(x) : isString(x) ? quoteString(x) : isDate(x) ? '' + '#inst "' + x.getUTCFullYear() + '-' + normalize(inc(x.getUTCMonth()), 2) + '-' + normalize(x.getUTCDate(), 2) + 'T' + normalize(x.getUTCHours(), 2) + ':' + normalize(x.getUTCMinutes(), 2) + ':' + normalize(x.getUTCSeconds(), 2) + '.' + normalize(x.getUTCMilliseconds(), 3) + '-' + '00:00"' : isVector(x) ? '' + '[' + join('' + '\n ' + join(repeat(inc(offsetø2), ' ')), map(function ($1) {
                return prStr($1, inc(offsetø2));
            }, vec(x))) + ']' : isDictionary(x) ? '' + '{' + join('' + ',\n' + join(repeat(inc(offsetø2), ' ')), map(function (pair) {
                return function () {
                    var indentø1 = join(repeat(offsetø2, ' '));
                    var keyø1 = prStr(first(pair), inc(offsetø2));
                    var valueø1 = prStr(second(pair), 2 + offsetø2 + count(keyø1));
                    return '' + keyø1 + ' ' + valueø1;
                }.call(this);
            }, x)) + '}' : isSequential(x) ? '' + '(' + join(' ', map(function ($1) {
                return prStr($1, inc(offsetø2));
            }, vec(x))) + ')' : isRePattern(x) ? '' + '#"' + join('\\/', split(x.source, '/')) + '"' : 'else' ? '' + x : void 0;
        }.call(this);
    };
},{"./runtime":33,"./sequence":34,"./string":35}],10:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.backend.escodegen.generator',
            doc: void 0
        };
    var wisp_reader = require('./../../reader');
    var readString = wisp_reader.readFromString;
    var read_ = wisp_reader.read_;
    var wisp_ast = require('./../../ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var namespace = wisp_ast.namespace;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var isQuote = wisp_ast.isQuote;
    var isSyntaxQuote = wisp_ast.isSyntaxQuote;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var prStr = wisp_ast.prStr;
    var wisp_sequence = require('./../../sequence');
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var butlast = wisp_sequence.butlast;
    var reverse = wisp_sequence.reverse;
    var reduce = wisp_sequence.reduce;
    var vec = wisp_sequence.vec;
    var last = wisp_sequence.last;
    var map = wisp_sequence.map;
    var filter = wisp_sequence.filter;
    var take = wisp_sequence.take;
    var concat = wisp_sequence.concat;
    var partition = wisp_sequence.partition;
    var repeat = wisp_sequence.repeat;
    var interleave = wisp_sequence.interleave;
    var wisp_runtime = require('./../../runtime');
    var isOdd = wisp_runtime.isOdd;
    var isDictionary = wisp_runtime.isDictionary;
    var dictionary = wisp_runtime.dictionary;
    var merge = wisp_runtime.merge;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isContainsVector = wisp_runtime.isContainsVector;
    var mapDictionary = wisp_runtime.mapDictionary;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isVector = wisp_runtime.isVector;
    var isBoolean = wisp_runtime.isBoolean;
    var subs = wisp_runtime.subs;
    var reFind = wisp_runtime.reFind;
    var isTrue = wisp_runtime.isTrue;
    var isFalse = wisp_runtime.isFalse;
    var isNil = wisp_runtime.isNil;
    var isRePattern = wisp_runtime.isRePattern;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var str = wisp_runtime.str;
    var char = wisp_runtime.char;
    var int = wisp_runtime.int;
    var isEqual = wisp_runtime.isEqual;
    var isStrictEqual = wisp_runtime.isStrictEqual;
    var wisp_string = require('./../../string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var upperCase = wisp_string.upperCase;
    var replace = wisp_string.replace;
    var wisp_expander = require('./../../expander');
    var installMacro = wisp_expander.installMacro;
    var wisp_analyzer = require('./../../analyzer');
    var emptyEnv = wisp_analyzer.emptyEnv;
    var analyze = wisp_analyzer.analyze;
    var analyze_ = wisp_analyzer.analyze_;
    var wisp_backend_escodegen_writer = require('./writer');
    var write = wisp_backend_escodegen_writer.write;
    var compile = wisp_backend_escodegen_writer.compile;
    var write_ = wisp_backend_escodegen_writer.write_;
    var escodegen = require('escodegen');
    var generate_ = escodegen.generate;
    var base64Encode = require('base64-encode');
    var btoa = base64Encode;
    var fs = require('fs');
    var readFileSync = fs.readFileSync;
    var writeFileSync = fs.writeFileSync;
    var path = require('path');
    var basename = path.basename;
    var dirname = path.dirname;
    var joinPath = path.join;
}
var generate = exports.generate = function generate(options) {
        var nodes = Array.prototype.slice.call(arguments, 1);
        return function () {
            var astø1 = write_.apply(void 0, nodes);
            var outputø1 = generate_(astø1, {
                    'file': (options || 0)['output-uri'],
                    'sourceContent': (options || 0)['source'],
                    'sourceMap': (options || 0)['source-uri'],
                    'sourceMapRoot': (options || 0)['source-root'],
                    'sourceMapWithCode': true
                });
            (outputø1 || 0)['map'].setSourceContent((options || 0)['source-uri'], (options || 0)['source']);
            return {
                'code': (options || 0)['no-map'] ? (outputø1 || 0)['code'] : '' + (outputø1 || 0)['code'] + '\n//# sourceMappingURL=' + 'data:application/json;base64,' + btoa('' + (outputø1 || 0)['map']) + '\n',
                'source-map': (outputø1 || 0)['map'],
                'js-ast': astø1
            };
        }.call(this);
    };
var expandDefmacro = exports.expandDefmacro = function expandDefmacro(andForm, id) {
        var body = Array.prototype.slice.call(arguments, 2);
        return function () {
            var fnø1 = withMeta(list.apply(void 0, [symbol(void 0, 'defn')].concat([id], vec(body))), meta(andForm));
            var formø1 = list.apply(void 0, [symbol(void 0, 'do')].concat([fnø1], [id]));
            var astø1 = analyze(formø1);
            var codeø1 = compile(astø1);
            var macroø1 = eval(codeø1);
            installMacro(id, macroø1);
            return void 0;
        }.call(this);
    };
installMacro(symbol(void 0, 'defmacro'), withMeta(expandDefmacro, { 'implicit': ['&form'] }));
},{"./../../analyzer":8,"./../../ast":9,"./../../expander":14,"./../../reader":32,"./../../runtime":33,"./../../sequence":34,"./../../string":35,"./writer":11,"base64-encode":15,"escodegen":16,"fs":2,"path":5}],11:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.backend.escodegen.writer',
            doc: void 0
        };
    var wisp_reader = require('./../../reader');
    var readFromString = wisp_reader.readFromString;
    var wisp_ast = require('./../../ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var namespace = wisp_ast.namespace;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var isQuote = wisp_ast.isQuote;
    var isSyntaxQuote = wisp_ast.isSyntaxQuote;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var prStr = wisp_ast.prStr;
    var wisp_sequence = require('./../../sequence');
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var butlast = wisp_sequence.butlast;
    var reverse = wisp_sequence.reverse;
    var reduce = wisp_sequence.reduce;
    var vec = wisp_sequence.vec;
    var last = wisp_sequence.last;
    var map = wisp_sequence.map;
    var filter = wisp_sequence.filter;
    var take = wisp_sequence.take;
    var concat = wisp_sequence.concat;
    var partition = wisp_sequence.partition;
    var repeat = wisp_sequence.repeat;
    var interleave = wisp_sequence.interleave;
    var assoc = wisp_sequence.assoc;
    var wisp_runtime = require('./../../runtime');
    var isOdd = wisp_runtime.isOdd;
    var isDictionary = wisp_runtime.isDictionary;
    var dictionary = wisp_runtime.dictionary;
    var merge = wisp_runtime.merge;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isContainsVector = wisp_runtime.isContainsVector;
    var mapDictionary = wisp_runtime.mapDictionary;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isVector = wisp_runtime.isVector;
    var isBoolean = wisp_runtime.isBoolean;
    var subs = wisp_runtime.subs;
    var reFind = wisp_runtime.reFind;
    var isTrue = wisp_runtime.isTrue;
    var isFalse = wisp_runtime.isFalse;
    var isNil = wisp_runtime.isNil;
    var isRePattern = wisp_runtime.isRePattern;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var str = wisp_runtime.str;
    var char = wisp_runtime.char;
    var int = wisp_runtime.int;
    var isEqual = wisp_runtime.isEqual;
    var isStrictEqual = wisp_runtime.isStrictEqual;
    var wisp_string = require('./../../string');
    var split = wisp_string.split;
    var join = wisp_string.join;
    var upperCase = wisp_string.upperCase;
    var replace = wisp_string.replace;
    var triml = wisp_string.triml;
    var wisp_expander = require('./../../expander');
    var installMacro = wisp_expander.installMacro;
    var escodegen = require('escodegen');
    var generate = escodegen.generate;
}
var __uniqueChar__ = exports.__uniqueChar__ = '\xF8';
var toCamelJoin = exports.toCamelJoin = function toCamelJoin(prefix, key) {
        return '' + prefix + (!isEmpty(prefix) && !isEmpty(key) ? '' + upperCase((key || 0)[0]) + subs(key, 1) : key);
    };
var toPrivatePrefix = exports.toPrivatePrefix = function toPrivatePrefix(id) {
        return function () {
            var spaceDelimitedø1 = join(' ', split(id, /-/));
            var leftTrimmedø1 = triml(spaceDelimitedø1);
            var nø1 = count(id) - count(leftTrimmedø1);
            return nø1 > 0 ? '' + join('_', repeat(inc(nø1), '')) + subs(id, nø1) : id;
        }.call(this);
    };
var translateIdentifierWord = exports.translateIdentifierWord = function translateIdentifierWord(form) {
        var id = name(form);
        id = id === '*' ? 'multiply' : id === '/' ? 'divide' : id === '+' ? 'sum' : id === '-' ? 'subtract' : id === '=' ? 'equal?' : id === '==' ? 'strict-equal?' : id === '<=' ? 'not-greater-than' : id === '>=' ? 'not-less-than' : id === '>' ? 'greater-than' : id === '<' ? 'less-than' : 'else' ? id : void 0;
        id = join('_', split(id, '*'));
        id = subs(id, 0, 2) === '->' ? subs(join('-to-', split(id, '->')), 1) : join('-to-', split(id, '->'));
        id = join(split(id, '!'));
        id = join('$', split(id, '%'));
        id = join('-equal-', split(id, '='));
        id = join('-plus-', split(id, '+'));
        id = join('-and-', split(id, '&'));
        id = last(id) === '?' ? '' + 'is-' + subs(id, 0, dec(count(id))) : id;
        id = toPrivatePrefix(id);
        id = reduce(toCamelJoin, '', split(id, '-'));
        return id;
    };
var translateIdentifier = exports.translateIdentifier = function translateIdentifier(form) {
        return join('.', map(translateIdentifierWord, split(name(form), '.')));
    };
var errorArgCount = exports.errorArgCount = function errorArgCount(callee, n) {
        return (function () {
            throw SyntaxError('' + 'Wrong number of arguments (' + n + ') passed to: ' + callee);
        })();
    };
var inheritLocation = exports.inheritLocation = function inheritLocation(body) {
        return function () {
            var startø1 = ((first(body) || 0)['loc'] || 0)['start'];
            var endø1 = ((last(body) || 0)['loc'] || 0)['end'];
            return !(isNil(startø1) || isNil(endø1)) ? {
                'start': startø1,
                'end': endø1
            } : void 0;
        }.call(this);
    };
var writeLocation = exports.writeLocation = function writeLocation(form, original) {
        return function () {
            var dataø1 = meta(form);
            var inheritedø1 = meta(original);
            var startø1 = (form || 0)['start'] || (dataø1 || 0)['start'] || (inheritedø1 || 0)['start'];
            var endø1 = (form || 0)['end'] || (dataø1 || 0)['end'] || (inheritedø1 || 0)['end'];
            return !isNil(startø1) ? {
                'loc': {
                    'start': {
                        'line': inc((startø1 || 0)['line']),
                        'column': (startø1 || 0)['column']
                    },
                    'end': {
                        'line': inc((endø1 || 0)['line']),
                        'column': (endø1 || 0)['column']
                    }
                }
            } : {};
        }.call(this);
    };
var __writers__ = exports.__writers__ = {};
var installWriter = exports.installWriter = function installWriter(op, writer) {
        return (__writers__ || 0)[op] = writer;
    };
var writeOp = exports.writeOp = function writeOp(op, form) {
        return function () {
            var writerø1 = (__writers__ || 0)[op];
            !writerø1 ? (function () {
                throw Error('' + 'Assert failed: ' + ('' + 'Unsupported operation: ' + op) + 'writer');
            })() : void 0;
            return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writerø1(form));
        }.call(this);
    };
var __specials__ = exports.__specials__ = {};
var installSpecial = exports.installSpecial = function installSpecial(op, writer) {
        return (__specials__ || 0)[name(op)] = writer;
    };
var writeSpecial = exports.writeSpecial = function writeSpecial(writer, form) {
        return conj(writeLocation((form || 0)['form'], (form || 0)['original-form']), writer.apply(void 0, (form || 0)['params']));
    };
var writeNil = exports.writeNil = function writeNil(form) {
        return {
            'type': 'UnaryExpression',
            'operator': 'void',
            'argument': {
                'type': 'Literal',
                'value': 0
            },
            'prefix': true
        };
    };
installWriter('nil', writeNil);
var writeLiteral = exports.writeLiteral = function writeLiteral(form) {
        return {
            'type': 'Literal',
            'value': form
        };
    };
var writeList = exports.writeList = function writeList(form) {
        return {
            'type': 'CallExpression',
            'callee': write({
                'op': 'var',
                'form': symbol(void 0, 'list')
            }),
            'arguments': map(write, (form || 0)['items'])
        };
    };
installWriter('list', writeList);
var writeSymbol = exports.writeSymbol = function writeSymbol(form) {
        return {
            'type': 'CallExpression',
            'callee': write({
                'op': 'var',
                'form': symbol(void 0, 'symbol')
            }),
            'arguments': [
                writeConstant((form || 0)['namespace']),
                writeConstant((form || 0)['name'])
            ]
        };
    };
installWriter('symbol', writeSymbol);
var writeConstant = exports.writeConstant = function writeConstant(form) {
        return isNil(form) ? writeNil(form) : isKeyword(form) ? writeLiteral(name(form)) : isNumber(form) ? writeNumber(form.valueOf()) : isString(form) ? writeString(form) : 'else' ? writeLiteral(form) : void 0;
    };
installWriter('constant', function ($1) {
    return writeConstant(($1 || 0)['form']);
});
var writeString = exports.writeString = function writeString(form) {
        return {
            'type': 'Literal',
            'value': '' + form
        };
    };
var writeNumber = exports.writeNumber = function writeNumber(form) {
        return form < 0 ? {
            'type': 'UnaryExpression',
            'operator': '-',
            'prefix': true,
            'argument': writeNumber(form * -1)
        } : writeLiteral(form);
    };
var writeKeyword = exports.writeKeyword = function writeKeyword(form) {
        return {
            'type': 'Literal',
            'value': (form || 0)['form']
        };
    };
installWriter('keyword', writeKeyword);
var toIdentifier = exports.toIdentifier = function toIdentifier(form) {
        return {
            'type': 'Identifier',
            'name': translateIdentifier(form)
        };
    };
var writeBindingVar = exports.writeBindingVar = function writeBindingVar(form) {
        return function () {
            var idø1 = name((form || 0)['id']);
            return conj(toIdentifier((form || 0)['shadow'] ? '' + translateIdentifier(idø1) + __uniqueChar__ + (form || 0)['depth'] : idø1), writeLocation((form || 0)['id']));
        }.call(this);
    };
var writeVar = exports.writeVar = function writeVar(node) {
        return isEqual('binding', ((node || 0)['binding'] || 0)['type']) ? conj(writeBindingVar((node || 0)['binding']), writeLocation((node || 0)['form'])) : conj(writeLocation((node || 0)['form']), toIdentifier(name((node || 0)['form'])));
    };
installWriter('var', writeVar);
installWriter('param', writeVar);
var writeInvoke = exports.writeInvoke = function writeInvoke(form) {
        return {
            'type': 'CallExpression',
            'callee': write((form || 0)['callee']),
            'arguments': map(write, (form || 0)['params'])
        };
    };
installWriter('invoke', writeInvoke);
var writeVector = exports.writeVector = function writeVector(form) {
        return {
            'type': 'ArrayExpression',
            'elements': map(write, (form || 0)['items'])
        };
    };
installWriter('vector', writeVector);
var writeDictionary = exports.writeDictionary = function writeDictionary(form) {
        return function () {
            var propertiesø1 = partition(2, interleave((form || 0)['keys'], (form || 0)['values']));
            return {
                'type': 'ObjectExpression',
                'properties': map(function (pair) {
                    return function () {
                        var keyø1 = first(pair);
                        var valueø1 = second(pair);
                        return {
                            'kind': 'init',
                            'type': 'Property',
                            'key': isEqual('symbol', (keyø1 || 0)['op']) ? writeConstant('' + (keyø1 || 0)['form']) : write(keyø1),
                            'value': write(valueø1)
                        };
                    }.call(this);
                }, propertiesø1)
            };
        }.call(this);
    };
installWriter('dictionary', writeDictionary);
var writeExport = exports.writeExport = function writeExport(form) {
        return write({
            'op': 'set!',
            'target': {
                'op': 'member-expression',
                'computed': false,
                'target': {
                    'op': 'var',
                    'form': withMeta(symbol(void 0, 'exports'), meta(((form || 0)['id'] || 0)['form']))
                },
                'property': (form || 0)['id'],
                'form': ((form || 0)['id'] || 0)['form']
            },
            'value': (form || 0)['init'],
            'form': ((form || 0)['id'] || 0)['form']
        });
    };
var writeDef = exports.writeDef = function writeDef(form) {
        return conj({
            'type': 'VariableDeclaration',
            'kind': 'var',
            'declarations': [conj({
                    'type': 'VariableDeclarator',
                    'id': write((form || 0)['id']),
                    'init': conj((form || 0)['export'] ? writeExport(form) : write((form || 0)['init']))
                }, writeLocation(((form || 0)['id'] || 0)['form']))]
        }, writeLocation((form || 0)['form'], (form || 0)['original-form']));
    };
installWriter('def', writeDef);
var writeBinding = exports.writeBinding = function writeBinding(form) {
        return function () {
            var idø1 = writeBindingVar(form);
            var initø1 = write((form || 0)['init']);
            return {
                'type': 'VariableDeclaration',
                'kind': 'var',
                'loc': inheritLocation([
                    idø1,
                    initø1
                ]),
                'declarations': [{
                        'type': 'VariableDeclarator',
                        'id': idø1,
                        'init': initø1
                    }]
            };
        }.call(this);
    };
installWriter('binding', writeBinding);
var writeThrow = exports.writeThrow = function writeThrow(form) {
        return toExpression(conj({
            'type': 'ThrowStatement',
            'argument': write((form || 0)['throw'])
        }, writeLocation((form || 0)['form'], (form || 0)['original-form'])));
    };
installWriter('throw', writeThrow);
var writeNew = exports.writeNew = function writeNew(form) {
        return {
            'type': 'NewExpression',
            'callee': write((form || 0)['constructor']),
            'arguments': map(write, (form || 0)['params'])
        };
    };
installWriter('new', writeNew);
var writeSet = exports.writeSet = function writeSet(form) {
        return {
            'type': 'AssignmentExpression',
            'operator': '=',
            'left': write((form || 0)['target']),
            'right': write((form || 0)['value'])
        };
    };
installWriter('set!', writeSet);
var writeAget = exports.writeAget = function writeAget(form) {
        return {
            'type': 'MemberExpression',
            'computed': (form || 0)['computed'],
            'object': write((form || 0)['target']),
            'property': write((form || 0)['property'])
        };
    };
installWriter('member-expression', writeAget);
var __statements__ = exports.__statements__ = {
        'EmptyStatement': true,
        'BlockStatement': true,
        'ExpressionStatement': true,
        'IfStatement': true,
        'LabeledStatement': true,
        'BreakStatement': true,
        'ContinueStatement': true,
        'SwitchStatement': true,
        'ReturnStatement': true,
        'ThrowStatement': true,
        'TryStatement': true,
        'WhileStatement': true,
        'DoWhileStatement': true,
        'ForStatement': true,
        'ForInStatement': true,
        'ForOfStatement': true,
        'LetStatement': true,
        'VariableDeclaration': true,
        'FunctionDeclaration': true
    };
var writeStatement = exports.writeStatement = function writeStatement(form) {
        return toStatement(write(form));
    };
var toStatement = exports.toStatement = function toStatement(node) {
        return (__statements__ || 0)[(node || 0)['type']] ? node : {
            'type': 'ExpressionStatement',
            'expression': node,
            'loc': (node || 0)['loc']
        };
    };
var toReturn = exports.toReturn = function toReturn(form) {
        return conj({
            'type': 'ReturnStatement',
            'argument': write(form)
        }, writeLocation((form || 0)['form'], (form || 0)['original-form']));
    };
var writeBody = exports.writeBody = function writeBody(form) {
        return function () {
            var statementsø1 = map(writeStatement, (form || 0)['statements'] || []);
            var resultø1 = (form || 0)['result'] ? toReturn((form || 0)['result']) : void 0;
            return resultø1 ? conj(statementsø1, resultø1) : statementsø1;
        }.call(this);
    };
var toBlock = exports.toBlock = function toBlock(body) {
        return isVector(body) ? {
            'type': 'BlockStatement',
            'body': body,
            'loc': inheritLocation(body)
        } : {
            'type': 'BlockStatement',
            'body': [body],
            'loc': (body || 0)['loc']
        };
    };
var toExpression = exports.toExpression = function toExpression() {
        var body = Array.prototype.slice.call(arguments, 0);
        return {
            'type': 'CallExpression',
            'arguments': [],
            'loc': inheritLocation(body),
            'callee': toSequence([{
                    'type': 'FunctionExpression',
                    'id': void 0,
                    'params': [],
                    'defaults': [],
                    'expression': false,
                    'generator': false,
                    'rest': void 0,
                    'body': toBlock(body)
                }])
        };
    };
var writeDo = exports.writeDo = function writeDo(form) {
        return (meta(first((form || 0)['form'])) || 0)['block'] ? toBlock(writeBody(conj(form, {
            'result': void 0,
            'statements': conj((form || 0)['statements'], (form || 0)['result'])
        }))) : toExpression.apply(void 0, writeBody(form));
    };
installWriter('do', writeDo);
var writeIf = exports.writeIf = function writeIf(form) {
        return {
            'type': 'ConditionalExpression',
            'test': write((form || 0)['test']),
            'consequent': write((form || 0)['consequent']),
            'alternate': write((form || 0)['alternate'])
        };
    };
installWriter('if', writeIf);
var writeTry = exports.writeTry = function writeTry(form) {
        return function () {
            var handlerø1 = (form || 0)['handler'];
            var finalizerø1 = (form || 0)['finalizer'];
            return toExpression(conj({
                'type': 'TryStatement',
                'guardedHandlers': [],
                'block': toBlock(writeBody((form || 0)['body'])),
                'handlers': handlerø1 ? [{
                        'type': 'CatchClause',
                        'param': write((handlerø1 || 0)['name']),
                        'body': toBlock(writeBody(handlerø1))
                    }] : [],
                'finalizer': finalizerø1 ? toBlock(writeBody(finalizerø1)) : !handlerø1 ? toBlock([]) : 'else' ? void 0 : void 0
            }, writeLocation((form || 0)['form'], (form || 0)['original-form'])));
        }.call(this);
    };
installWriter('try', writeTry);
var writeBindingValue = function writeBindingValue(form) {
    return write((form || 0)['init']);
};
var writeBindingParam = function writeBindingParam(form) {
    return writeVar({ 'form': (form || 0)['name'] });
};
var writeBinding = exports.writeBinding = function writeBinding(form) {
        return write({
            'op': 'def',
            'var': form,
            'init': (form || 0)['init'],
            'form': form
        });
    };
var writeLet = exports.writeLet = function writeLet(form) {
        return function () {
            var bodyø1 = conj(form, { 'statements': vec(concat((form || 0)['bindings'], (form || 0)['statements'])) });
            return toIife(toBlock(writeBody(bodyø1)));
        }.call(this);
    };
installWriter('let', writeLet);
var toRebind = exports.toRebind = function toRebind(form) {
        return function loop() {
            var recur = loop;
            var resultø1 = [];
            var bindingsø1 = (form || 0)['bindings'];
            do {
                recur = isEmpty(bindingsø1) ? resultø1 : (loop[0] = conj(resultø1, {
                    'type': 'AssignmentExpression',
                    'operator': '=',
                    'left': writeBindingVar(first(bindingsø1)),
                    'right': {
                        'type': 'MemberExpression',
                        'computed': true,
                        'object': {
                            'type': 'Identifier',
                            'name': 'loop'
                        },
                        'property': {
                            'type': 'Literal',
                            'value': count(resultø1)
                        }
                    }
                }), loop[1] = rest(bindingsø1), loop);
            } while (resultø1 = loop[0], bindingsø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var toSequence = exports.toSequence = function toSequence(expressions) {
        return {
            'type': 'SequenceExpression',
            'expressions': expressions
        };
    };
var toIife = exports.toIife = function toIife(body, id) {
        return {
            'type': 'CallExpression',
            'arguments': [{ 'type': 'ThisExpression' }],
            'callee': {
                'type': 'MemberExpression',
                'computed': false,
                'object': {
                    'type': 'FunctionExpression',
                    'id': id,
                    'params': [],
                    'defaults': [],
                    'expression': false,
                    'generator': false,
                    'rest': void 0,
                    'body': body
                },
                'property': {
                    'type': 'Identifier',
                    'name': 'call'
                }
            }
        };
    };
var toLoopInit = exports.toLoopInit = function toLoopInit() {
        return {
            'type': 'VariableDeclaration',
            'kind': 'var',
            'declarations': [{
                    'type': 'VariableDeclarator',
                    'id': {
                        'type': 'Identifier',
                        'name': 'recur'
                    },
                    'init': {
                        'type': 'Identifier',
                        'name': 'loop'
                    }
                }]
        };
    };
var toDoWhile = exports.toDoWhile = function toDoWhile(body, test) {
        return {
            'type': 'DoWhileStatement',
            'body': body,
            'test': test
        };
    };
var toSetRecur = exports.toSetRecur = function toSetRecur(form) {
        return {
            'type': 'AssignmentExpression',
            'operator': '=',
            'left': {
                'type': 'Identifier',
                'name': 'recur'
            },
            'right': write(form)
        };
    };
var toLoop = exports.toLoop = function toLoop(form) {
        return toSequence(conj(toRebind(form), {
            'type': 'BinaryExpression',
            'operator': '===',
            'left': {
                'type': 'Identifier',
                'name': 'recur'
            },
            'right': {
                'type': 'Identifier',
                'name': 'loop'
            }
        }));
    };
var writeLoop = exports.writeLoop = function writeLoop(form) {
        return function () {
            var statementsø1 = (form || 0)['statements'];
            var resultø1 = (form || 0)['result'];
            var bindingsø1 = (form || 0)['bindings'];
            var loopBodyø1 = conj(map(writeStatement, statementsø1), toStatement(toSetRecur(resultø1)));
            var bodyø1 = concat([toLoopInit()], map(write, bindingsø1), [toDoWhile(toBlock(vec(loopBodyø1)), toLoop(form))], [{
                        'type': 'ReturnStatement',
                        'argument': {
                            'type': 'Identifier',
                            'name': 'recur'
                        }
                    }]);
            return toIife(toBlock(vec(bodyø1)), symbol(void 0, 'loop'));
        }.call(this);
    };
installWriter('loop', writeLoop);
var toRecur = exports.toRecur = function toRecur(form) {
        return function loop() {
            var recur = loop;
            var resultø1 = [];
            var paramsø1 = (form || 0)['params'];
            do {
                recur = isEmpty(paramsø1) ? resultø1 : (loop[0] = conj(resultø1, {
                    'type': 'AssignmentExpression',
                    'operator': '=',
                    'right': write(first(paramsø1)),
                    'left': {
                        'type': 'MemberExpression',
                        'computed': true,
                        'object': {
                            'type': 'Identifier',
                            'name': 'loop'
                        },
                        'property': {
                            'type': 'Literal',
                            'value': count(resultø1)
                        }
                    }
                }), loop[1] = rest(paramsø1), loop);
            } while (resultø1 = loop[0], paramsø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var writeRecur = exports.writeRecur = function writeRecur(form) {
        return toSequence(conj(toRecur(form), {
            'type': 'Identifier',
            'name': 'loop'
        }));
    };
installWriter('recur', writeRecur);
var fallbackOverload = exports.fallbackOverload = function fallbackOverload() {
        return {
            'type': 'SwitchCase',
            'test': void 0,
            'consequent': [{
                    'type': 'ThrowStatement',
                    'argument': {
                        'type': 'CallExpression',
                        'callee': {
                            'type': 'Identifier',
                            'name': 'RangeError'
                        },
                        'arguments': [{
                                'type': 'Literal',
                                'value': 'Wrong number of arguments passed'
                            }]
                    }
                }]
        };
    };
var spliceBinding = exports.spliceBinding = function spliceBinding(form) {
        return {
            'op': 'def',
            'id': last((form || 0)['params']),
            'init': {
                'op': 'invoke',
                'callee': {
                    'op': 'var',
                    'form': symbol(void 0, 'Array.prototype.slice.call')
                },
                'params': [
                    {
                        'op': 'var',
                        'form': symbol(void 0, 'arguments')
                    },
                    {
                        'op': 'constant',
                        'form': (form || 0)['arity'],
                        'type': 'number'
                    }
                ]
            }
        };
    };
var writeOverloadingParams = exports.writeOverloadingParams = function writeOverloadingParams(params) {
        return reduce(function (forms, param) {
            return conj(forms, {
                'op': 'def',
                'id': param,
                'init': {
                    'op': 'member-expression',
                    'computed': true,
                    'target': {
                        'op': 'var',
                        'form': symbol(void 0, 'arguments')
                    },
                    'property': {
                        'op': 'constant',
                        'type': 'number',
                        'form': count(forms)
                    }
                }
            });
        }, [], params);
    };
var writeOverloadingFn = exports.writeOverloadingFn = function writeOverloadingFn(form) {
        return function () {
            var overloadsø1 = map(writeFnOverload, (form || 0)['methods']);
            return {
                'params': [],
                'body': toBlock({
                    'type': 'SwitchStatement',
                    'discriminant': {
                        'type': 'MemberExpression',
                        'computed': false,
                        'object': {
                            'type': 'Identifier',
                            'name': 'arguments'
                        },
                        'property': {
                            'type': 'Identifier',
                            'name': 'length'
                        }
                    },
                    'cases': (form || 0)['variadic'] ? overloadsø1 : conj(overloadsø1, fallbackOverload())
                })
            };
        }.call(this);
    };
var writeFnOverload = exports.writeFnOverload = function writeFnOverload(form) {
        return function () {
            var paramsø1 = (form || 0)['params'];
            var bindingsø1 = (form || 0)['variadic'] ? conj(writeOverloadingParams(butlast(paramsø1)), spliceBinding(form)) : writeOverloadingParams(paramsø1);
            var statementsø1 = vec(concat(bindingsø1, (form || 0)['statements']));
            return {
                'type': 'SwitchCase',
                'test': !(form || 0)['variadic'] ? {
                    'type': 'Literal',
                    'value': (form || 0)['arity']
                } : void 0,
                'consequent': writeBody(conj(form, { 'statements': statementsø1 }))
            };
        }.call(this);
    };
var writeSimpleFn = exports.writeSimpleFn = function writeSimpleFn(form) {
        return function () {
            var methodø1 = first((form || 0)['methods']);
            var paramsø1 = (methodø1 || 0)['variadic'] ? butlast((methodø1 || 0)['params']) : (methodø1 || 0)['params'];
            var bodyø1 = (methodø1 || 0)['variadic'] ? conj(methodø1, { 'statements': vec(cons(spliceBinding(methodø1), (methodø1 || 0)['statements'])) }) : methodø1;
            return {
                'params': map(writeVar, paramsø1),
                'body': toBlock(writeBody(bodyø1))
            };
        }.call(this);
    };
var resolve = exports.resolve = function resolve(from, to) {
        return function () {
            var requirerø1 = split(name(from), '.');
            var requirementø1 = split(name(to), '.');
            var isRelativeø1 = !(name(from) === name(to)) && first(requirerø1) === first(requirementø1);
            return isRelativeø1 ? function loop() {
                var recur = loop;
                var fromø2 = requirerø1;
                var toø2 = requirementø1;
                do {
                    recur = first(fromø2) === first(toø2) ? (loop[0] = rest(fromø2), loop[1] = rest(toø2), loop) : join('/', concat(['.'], repeat(dec(count(fromø2)), '..'), toø2));
                } while (fromø2 = loop[0], toø2 = loop[1], recur === loop);
                return recur;
            }.call(this) : join('/', requirementø1);
        }.call(this);
    };
var idToNs = exports.idToNs = function idToNs(id) {
        return symbol(void 0, join('*', split(name(id), '.')));
    };
var writeRequire = exports.writeRequire = function writeRequire(form, requirer) {
        return function () {
            var nsBindingø1 = {
                    'op': 'def',
                    'id': {
                        'op': 'var',
                        'type': 'identifier',
                        'form': idToNs((form || 0)['ns'])
                    },
                    'init': {
                        'op': 'invoke',
                        'callee': {
                            'op': 'var',
                            'type': 'identifier',
                            'form': symbol(void 0, 'require')
                        },
                        'params': [{
                                'op': 'constant',
                                'form': resolve(requirer, (form || 0)['ns'])
                            }]
                    }
                };
            var nsAliasø1 = (form || 0)['alias'] ? {
                    'op': 'def',
                    'id': {
                        'op': 'var',
                        'type': 'identifier',
                        'form': idToNs((form || 0)['alias'])
                    },
                    'init': (nsBindingø1 || 0)['id']
                } : void 0;
            var referencesø1 = reduce(function (references, form) {
                    return conj(references, {
                        'op': 'def',
                        'id': {
                            'op': 'var',
                            'type': 'identifier',
                            'form': (form || 0)['rename'] || (form || 0)['name']
                        },
                        'init': {
                            'op': 'member-expression',
                            'computed': false,
                            'target': (nsBindingø1 || 0)['id'],
                            'property': {
                                'op': 'var',
                                'type': 'identifier',
                                'form': (form || 0)['name']
                            }
                        }
                    });
                }, [], (form || 0)['refer']);
            return vec(cons(nsBindingø1, nsAliasø1 ? cons(nsAliasø1, referencesø1) : referencesø1));
        }.call(this);
    };
var writeNs = exports.writeNs = function writeNs(form) {
        return function () {
            var nodeø1 = (form || 0)['form'];
            var requirerø1 = (form || 0)['name'];
            var nsBindingø1 = {
                    'op': 'def',
                    'original-form': nodeø1,
                    'id': {
                        'op': 'var',
                        'type': 'identifier',
                        'original-form': first(nodeø1),
                        'form': symbol(void 0, '*ns*')
                    },
                    'init': {
                        'op': 'dictionary',
                        'form': nodeø1,
                        'keys': [
                            {
                                'op': 'var',
                                'type': 'identifier',
                                'original-form': nodeø1,
                                'form': symbol(void 0, 'id')
                            },
                            {
                                'op': 'var',
                                'type': 'identifier',
                                'original-form': nodeø1,
                                'form': symbol(void 0, 'doc')
                            }
                        ],
                        'values': [
                            {
                                'op': 'constant',
                                'type': 'identifier',
                                'original-form': (form || 0)['name'],
                                'form': name((form || 0)['name'])
                            },
                            {
                                'op': 'constant',
                                'original-form': nodeø1,
                                'form': (form || 0)['doc']
                            }
                        ]
                    }
                };
            var requirementsø1 = vec(concat.apply(void 0, map(function ($1) {
                    return writeRequire($1, requirerø1);
                }, (form || 0)['require'])));
            return toBlock(map(write, vec(cons(nsBindingø1, requirementsø1))));
        }.call(this);
    };
installWriter('ns', writeNs);
var writeFn = exports.writeFn = function writeFn(form) {
        return function () {
            var baseø1 = count((form || 0)['methods']) > 1 ? writeOverloadingFn(form) : writeSimpleFn(form);
            return conj(baseø1, {
                'type': 'FunctionExpression',
                'id': (form || 0)['id'] ? writeVar((form || 0)['id']) : void 0,
                'defaults': void 0,
                'rest': void 0,
                'generator': false,
                'expression': false
            });
        }.call(this);
    };
installWriter('fn', writeFn);
var write = exports.write = function write(form) {
        return function () {
            var opø1 = (form || 0)['op'];
            var writerø1 = isEqual('invoke', (form || 0)['op']) && isEqual('var', ((form || 0)['callee'] || 0)['op']) && (__specials__ || 0)[name(((form || 0)['callee'] || 0)['form'])];
            return writerø1 ? writeSpecial(writerø1, form) : writeOp((form || 0)['op'], form);
        }.call(this);
    };
var write_ = exports.write_ = function write_() {
        var forms = Array.prototype.slice.call(arguments, 0);
        return function () {
            var bodyø1 = map(writeStatement, forms);
            return {
                'type': 'Program',
                'body': bodyø1,
                'loc': inheritLocation(bodyø1)
            };
        }.call(this);
    };
var compile = exports.compile = function compile() {
        switch (arguments.length) {
        case 1:
            var form = arguments[0];
            return compile({}, form);
        default:
            var options = arguments[0];
            var forms = Array.prototype.slice.call(arguments, 1);
            return generate(write_.apply(void 0, forms), options);
        }
    };
var getMacro = exports.getMacro = function getMacro(target, property) {
        return list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, 'or')].concat([target], [0]))], [property]));
    };
installMacro('get', getMacro);
var installLogicalOperator = exports.installLogicalOperator = function installLogicalOperator(callee, operator, fallback) {
        var writeLogicalOperator = function writeLogicalOperator() {
            var operands = Array.prototype.slice.call(arguments, 0);
            return function () {
                var nø1 = count(operands);
                return isEqual(nø1, 0) ? writeConstant(fallback) : isEqual(nø1, 1) ? write(first(operands)) : 'else' ? reduce(function (left, right) {
                    return {
                        'type': 'LogicalExpression',
                        'operator': operator,
                        'left': left,
                        'right': write(right)
                    };
                }, write(first(operands)), rest(operands)) : void 0;
            }.call(this);
        };
        return installSpecial(callee, writeLogicalOperator);
    };
installLogicalOperator('or', '||', void 0);
installLogicalOperator('and', '&&', true);
var installUnaryOperator = exports.installUnaryOperator = function installUnaryOperator(callee, operator, isPrefix) {
        var writeUnaryOperator = function writeUnaryOperator() {
            var params = Array.prototype.slice.call(arguments, 0);
            return count(params) === 1 ? {
                'type': 'UnaryExpression',
                'operator': operator,
                'argument': write(first(params)),
                'prefix': isPrefix
            } : errorArgCount(callee, count(params));
        };
        return installSpecial(callee, writeUnaryOperator);
    };
installUnaryOperator('not', '!');
installUnaryOperator('bit-not', '~');
var installBinaryOperator = exports.installBinaryOperator = function installBinaryOperator(callee, operator) {
        var writeBinaryOperator = function writeBinaryOperator() {
            var params = Array.prototype.slice.call(arguments, 0);
            return count(params) < 2 ? errorArgCount(callee, count(params)) : reduce(function (left, right) {
                return {
                    'type': 'BinaryExpression',
                    'operator': operator,
                    'left': left,
                    'right': write(right)
                };
            }, write(first(params)), rest(params));
        };
        return installSpecial(callee, writeBinaryOperator);
    };
installBinaryOperator('bit-and', '&');
installBinaryOperator('bit-or', '|');
installBinaryOperator('bit-xor', '^');
installBinaryOperator('bit-shift-left', '<<');
installBinaryOperator('bit-shift-right', '>>');
installBinaryOperator('bit-shift-right-zero-fil', '>>>');
var installArithmeticOperator = exports.installArithmeticOperator = function installArithmeticOperator(callee, operator, isValid, fallback) {
        var writeBinaryOperator = function writeBinaryOperator(left, right) {
            return {
                'type': 'BinaryExpression',
                'operator': name(operator),
                'left': left,
                'right': write(right)
            };
        };
        var writeArithmeticOperator = function writeArithmeticOperator() {
            var params = Array.prototype.slice.call(arguments, 0);
            return function () {
                var nø1 = count(params);
                return isValid && !isValid(nø1) ? errorArgCount(name(callee), nø1) : nø1 == 0 ? writeLiteral(fallback) : nø1 == 1 ? reduce(writeBinaryOperator, writeLiteral(fallback), params) : 'else' ? reduce(writeBinaryOperator, write(first(params)), rest(params)) : void 0;
            }.call(this);
        };
        return installSpecial(callee, writeArithmeticOperator);
    };
installArithmeticOperator('+', '+', void 0, 0);
installArithmeticOperator('-', '-', function ($1) {
    return $1 >= 1;
}, 0);
installArithmeticOperator('*', '*', void 0, 1);
installArithmeticOperator(keyword('/'), keyword('/'), function ($1) {
    return $1 >= 1;
}, 1);
installArithmeticOperator('mod', keyword('%'), function ($1) {
    return $1 == 2;
}, 1);
var installComparisonOperator = exports.installComparisonOperator = function installComparisonOperator(callee, operator, fallback) {
        var writeComparisonOperator = function writeComparisonOperator() {
            switch (arguments.length) {
            case 0:
                return errorArgCount(callee, 0);
            case 1:
                var form = arguments[0];
                return toSequence([
                    write(form),
                    writeLiteral(fallback)
                ]);
            case 2:
                var left = arguments[0];
                var right = arguments[1];
                return {
                    'type': 'BinaryExpression',
                    'operator': operator,
                    'left': write(left),
                    'right': write(right)
                };
            default:
                var left = arguments[0];
                var right = arguments[1];
                var more = Array.prototype.slice.call(arguments, 2);
                return reduce(function (left, right) {
                    return {
                        'type': 'LogicalExpression',
                        'operator': '&&',
                        'left': left,
                        'right': {
                            'type': 'BinaryExpression',
                            'operator': operator,
                            'left': isEqual('LogicalExpression', (left || 0)['type']) ? ((left || 0)['right'] || 0)['right'] : (left || 0)['right'],
                            'right': write(right)
                        }
                    };
                }, writeComparisonOperator(left, right), more);
            }
        };
        return installSpecial(callee, writeComparisonOperator);
    };
installComparisonOperator('==', '==', true);
installComparisonOperator('>', '>', true);
installComparisonOperator('>=', '>=', true);
installComparisonOperator('<', '<', true);
installComparisonOperator('<=', '<=', true);
var isWriteIdentical = exports.isWriteIdentical = function isWriteIdentical() {
        var params = Array.prototype.slice.call(arguments, 0);
        return count(params) === 2 ? {
            'type': 'BinaryExpression',
            'operator': '===',
            'left': write(first(params)),
            'right': write(second(params))
        } : errorArgCount('identical?', count(params));
    };
installSpecial('identical?', isWriteIdentical);
var isWriteInstance = exports.isWriteInstance = function isWriteInstance() {
        var params = Array.prototype.slice.call(arguments, 0);
        return function () {
            var constructorø1 = first(params);
            var instanceø1 = second(params);
            return count(params) < 1 ? errorArgCount('instance?', count(params)) : {
                'type': 'BinaryExpression',
                'operator': 'instanceof',
                'left': instanceø1 ? write(instanceø1) : writeConstant(instanceø1),
                'right': write(constructorø1)
            };
        }.call(this);
    };
installSpecial('instance?', isWriteInstance);
var expandApply = exports.expandApply = function expandApply(f) {
        var params = Array.prototype.slice.call(arguments, 1);
        return function () {
            var prefixø1 = vec(butlast(params));
            return isEmpty(prefixø1) ? list.apply(void 0, [symbol(void 0, '.apply')].concat([f], [void 0], vec(params))) : list.apply(void 0, [symbol(void 0, '.apply')].concat([f], [void 0], [list.apply(void 0, [symbol(void 0, '.concat')].concat([prefixø1], [last(params)]))]));
        }.call(this);
    };
installMacro('apply', expandApply);
var expandPrint = exports.expandPrint = function expandPrint(andForm) {
        var more = Array.prototype.slice.call(arguments, 1);
        'Prints the object(s) to the output for human consumption.';
        return function () {
            var opø1 = withMeta(symbol(void 0, 'console.log'), meta(andForm));
            return list.apply(void 0, [opø1].concat(vec(more)));
        }.call(this);
    };
installMacro('print', withMeta(expandPrint, { 'implicit': ['&form'] }));
var expandStr = exports.expandStr = function expandStr() {
        var forms = Array.prototype.slice.call(arguments, 0);
        return list.apply(void 0, [symbol(void 0, '+')].concat([''], vec(forms)));
    };
installMacro('str', expandStr);
var expandDebug = exports.expandDebug = function expandDebug() {
        return symbol(void 0, 'debugger');
    };
installMacro('debugger!', expandDebug);
var expandAssert = exports.expandAssert = function expandAssert() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return expandAssert(x, '');
        case 2:
            var x = arguments[0];
            var message = arguments[1];
            return function () {
                var formø1 = prStr(x);
                return list.apply(void 0, [symbol(void 0, 'if')].concat([list.apply(void 0, [symbol(void 0, 'not')].concat([x]))], [list.apply(void 0, [symbol(void 0, 'throw')].concat([list.apply(void 0, [symbol(void 0, 'Error')].concat([list.apply(void 0, [symbol(void 0, 'str')].concat(['Assert failed: '], [message], [formø1]))]))]))]));
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
installMacro('assert', expandAssert);
var expandDefprotocol = exports.expandDefprotocol = function expandDefprotocol(andEnv, id) {
        var forms = Array.prototype.slice.call(arguments, 2);
        return function () {
            var nsø1 = name(((andEnv || 0)['ns'] || 0)['name']);
            var protocolNameø1 = name(id);
            var protocolDocø1 = isString(first(forms)) ? first(forms) : void 0;
            var protocolMethodsø1 = protocolDocø1 ? rest(forms) : forms;
            var protocolø1 = reduce(function (protocol, method) {
                    return function () {
                        var methodNameø1 = first(method);
                        var idø2 = idToNs('' + nsø1 + '$' + protocolNameø1 + '$' + name(methodNameø1));
                        return assoc(protocol, methodNameø1, list.apply(void 0, [symbol(void 0, 'fn')].concat([idø2], [[symbol(void 0, 'self')].concat()], [list.apply(void 0, [symbol(void 0, 'def')].concat([symbol(void 0, 'f')], [list.apply(void 0, [symbol(void 0, 'cond')].concat([list.apply(void 0, [symbol(void 0, 'identical?')].concat([symbol(void 0, 'self')], [symbol(void 0, 'null')]))], [list.apply(void 0, [symbol(void 0, '.-nil')].concat([idø2]))], [list.apply(void 0, [symbol(void 0, 'identical?')].concat([symbol(void 0, 'self')], [void 0]))], [list.apply(void 0, [symbol(void 0, '.-nil')].concat([idø2]))], ['\uA789else'], [list.apply(void 0, [symbol(void 0, 'or')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'self')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([idø2]))]))], [list.apply(void 0, [symbol(void 0, '.-_')].concat([idø2]))]))]))]))], [list.apply(void 0, [symbol(void 0, '.apply')].concat([symbol(void 0, 'f')], [symbol(void 0, 'self')], [symbol(void 0, 'arguments')]))])));
                    }.call(this);
                }, {}, protocolMethodsø1);
            var fnsø1 = map(function (form) {
                    return list.apply(void 0, [symbol(void 0, 'def')].concat([first(form)], [list.apply(void 0, [symbol(void 0, 'aget')].concat([id], [list.apply(void 0, [symbol(void 0, 'quote')].concat([first(form)]))]))]));
                }, protocolø1);
            var satisfyø1 = assoc({}, symbol(void 0, 'wisp_core$IProtocol$id'), '' + nsø1 + '/' + protocolNameø1);
            var bodyø1 = conj(satisfyø1, protocolø1);
            return list.apply(void 0, [withMeta(symbol(void 0, 'do'), { 'block': true })].concat([list.apply(void 0, [symbol(void 0, 'def')].concat([id], [bodyø1]))], vec(fnsø1), [id]));
        }.call(this);
    };
installMacro('defprotocol', withMeta(expandDefprotocol, { 'implicit': ['&env'] }));
var expandDeftype = exports.expandDeftype = function expandDeftype(id, fields) {
        var forms = Array.prototype.slice.call(arguments, 2);
        return function () {
            var typeInitø1 = map(function (field) {
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'this')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([field]))]))], [field]));
                }, fields);
            var constructorø1 = conj(typeInitø1, symbol(void 0, 'this'));
            var methodInitø1 = map(function (field) {
                    return list.apply(void 0, [symbol(void 0, 'def')].concat([field], [list.apply(void 0, [symbol(void 0, 'aget')].concat([symbol(void 0, 'this')], [list.apply(void 0, [symbol(void 0, 'quote')].concat([field]))]))]));
                }, fields);
            var makeMethodø1 = function (protocol, form) {
                return function () {
                    var methodNameø1 = first(form);
                    var paramsø1 = second(form);
                    var bodyø1 = rest(rest(form));
                    var fieldNameø1 = isEqual(name(protocol), 'Object') ? list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1])) : list.apply(void 0, [symbol(void 0, '.-name')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))]));
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([id]))], [fieldNameø1]))], [list.apply(void 0, [symbol(void 0, 'fn')].concat([paramsø1], vec(methodInitø1), vec(bodyø1)))]));
                }.call(this);
            };
            var satisfyø1 = function (protocol) {
                return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([id]))], [list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true]));
            };
            var bodyø1 = reduce(function (type, form) {
                    return isList(form) ? conj(type, { 'body': conj((type || 0)['body'], makeMethodø1((type || 0)['protocol'], form)) }) : conj(type, {
                        'protocol': form,
                        'body': conj((type || 0)['body'], satisfyø1(form))
                    });
                }, {
                    'protocol': void 0,
                    'body': []
                }, forms);
            var methodsø1 = (bodyø1 || 0)['body'];
            return list.apply(void 0, [symbol(void 0, 'def')].concat([id], [list.apply(void 0, [symbol(void 0, 'do')].concat([list.apply(void 0, [symbol(void 0, 'defn-')].concat([id], [fields], vec(constructorø1)))], vec(methodsø1), [id]))]));
        }.call(this);
    };
installMacro('deftype', expandDeftype);
installMacro('defrecord', expandDeftype);
var expandExtendType = exports.expandExtendType = function expandExtendType(type) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return function () {
            var isDefaultTypeø1 = isEqual(type, symbol(void 0, 'default'));
            var isNilTypeø1 = isNil(type);
            var satisfyø1 = function (protocol) {
                return isDefaultTypeø1 ? list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$_')].concat([protocol]))], [true])) : isNilTypeø1 ? list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$nil')].concat([protocol]))], [true])) : 'else' ? list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([type]))], [list.apply(void 0, [symbol(void 0, '.-wisp_core$IProtocol$id')].concat([protocol]))]))], [true])) : void 0;
            };
            var makeMethodø1 = function (protocol, form) {
                return function () {
                    var methodNameø1 = first(form);
                    var paramsø1 = second(form);
                    var bodyø1 = rest(rest(form));
                    var targetø1 = isDefaultTypeø1 ? list.apply(void 0, [symbol(void 0, '.-_')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))])) : isNilTypeø1 ? list.apply(void 0, [symbol(void 0, '.-nil')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))])) : 'else' ? list.apply(void 0, [symbol(void 0, 'aget')].concat([list.apply(void 0, [symbol(void 0, '.-prototype')].concat([type]))], [list.apply(void 0, [symbol(void 0, '.-name')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([protocol], [list.apply(void 0, [symbol(void 0, 'quote')].concat([methodNameø1]))]))]))])) : void 0;
                    return list.apply(void 0, [symbol(void 0, 'set!')].concat([targetø1], [list.apply(void 0, [symbol(void 0, 'fn')].concat([paramsø1], vec(bodyø1)))]));
                }.call(this);
            };
            var bodyø1 = reduce(function (body, form) {
                    return isList(form) ? conj(body, { 'methods': conj((body || 0)['methods'], makeMethodø1((body || 0)['protocol'], form)) }) : conj(body, {
                        'protocol': form,
                        'methods': conj((body || 0)['methods'], satisfyø1(form))
                    });
                }, {
                    'protocol': void 0,
                    'methods': []
                }, forms);
            var methodsø1 = (bodyø1 || 0)['methods'];
            return list.apply(void 0, [symbol(void 0, 'do')].concat(vec(methodsø1), [void 0]));
        }.call(this);
    };
installMacro('extend-type', expandExtendType);
var expandExtendProtocol = exports.expandExtendProtocol = function expandExtendProtocol(protocol) {
        var forms = Array.prototype.slice.call(arguments, 1);
        return function () {
            var specsø1 = reduce(function (specs, form) {
                    return isList(form) ? cons({
                        'type': (first(specs) || 0)['type'],
                        'methods': conj((first(specs) || 0)['methods'], form)
                    }, rest(specs)) : cons({
                        'type': form,
                        'methods': []
                    }, specs);
                }, void 0, forms);
            var bodyø1 = map(function (form) {
                    return list.apply(void 0, [symbol(void 0, 'extend-type')].concat([(form || 0)['type']], [protocol], vec((form || 0)['methods'])));
                }, specsø1);
            return list.apply(void 0, [symbol(void 0, 'do')].concat(vec(bodyø1), [void 0]));
        }.call(this);
    };
installMacro('extend-protocol', expandExtendProtocol);
var asetExpand = exports.asetExpand = function asetExpand() {
        switch (arguments.length) {
        case 3:
            var target = arguments[0];
            var field = arguments[1];
            var value = arguments[2];
            return list.apply(void 0, [symbol(void 0, 'set!')].concat([list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [field]))], [value]));
        default:
            var target = arguments[0];
            var field = arguments[1];
            var subField = arguments[2];
            var subFieldsAndValue = Array.prototype.slice.call(arguments, 3);
            return function () {
                var resolvedTargetø1 = reduce(function (form, node) {
                        return list.apply(void 0, [symbol(void 0, 'aget')].concat([form], [node]));
                    }, list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [field])), cons(subField, butlast(subFieldsAndValue)));
                var valueø1 = last(subFieldsAndValue);
                return list.apply(void 0, [symbol(void 0, 'set!')].concat([resolvedTargetø1], [valueø1]));
            }.call(this);
        }
    };
installMacro('aset', asetExpand);
var alengthExpand = exports.alengthExpand = function alengthExpand(array) {
        return list.apply(void 0, [symbol(void 0, '.-length')].concat([array]));
    };
installMacro('alength', alengthExpand);
},{"./../../ast":9,"./../../expander":14,"./../../reader":32,"./../../runtime":33,"./../../sequence":34,"./../../string":35,"escodegen":16}],12:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.compiler',
            doc: void 0
        };
    var wisp_analyzer = require('./analyzer');
    var analyze = wisp_analyzer.analyze;
    var wisp_reader = require('./reader');
    var read_ = wisp_reader.read_;
    var read = wisp_reader.read;
    var pushBackReader = wisp_reader.pushBackReader;
    var wisp_string = require('./string');
    var replace = wisp_string.replace;
    var wisp_sequence = require('./sequence');
    var map = wisp_sequence.map;
    var conj = wisp_sequence.conj;
    var cons = wisp_sequence.cons;
    var vec = wisp_sequence.vec;
    var first = wisp_sequence.first;
    var rest = wisp_sequence.rest;
    var isEmpty = wisp_sequence.isEmpty;
    var count = wisp_sequence.count;
    var wisp_runtime = require('./runtime');
    var isError = wisp_runtime.isError;
    var isEqual = wisp_runtime.isEqual;
    var wisp_ast = require('./ast');
    var name = wisp_ast.name;
    var symbol = wisp_ast.symbol;
    var wisp_backend_escodegen_generator = require('./backend/escodegen/generator');
    var generateJs = wisp_backend_escodegen_generator.generate;
    var base64Encode = require('base64-encode');
    var btoa = base64Encode;
}
var generate = exports.generate = generateJs;
var readForm = exports.readForm = function readForm(reader, eof) {
        return (function () {
            try {
                return read(reader, false, eof, false);
            } catch (error) {
                return error;
            }
        })();
    };
var readForms = exports.readForms = function readForms(source, uri) {
        return function () {
            var readerø1 = pushBackReader(source, uri);
            var eofø1 = {};
            return function loop() {
                var recur = loop;
                var formsø1 = [];
                var formø1 = readForm(readerø1, eofø1);
                do {
                    recur = isError(formø1) ? {
                        'forms': formsø1,
                        'error': formø1
                    } : formø1 === eofø1 ? { 'forms': formsø1 } : 'else' ? (loop[0] = conj(formsø1, formø1), loop[1] = readForm(readerø1, eofø1), loop) : void 0;
                } while (formsø1 = loop[0], formø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
var analyzeForm = exports.analyzeForm = function analyzeForm(env, form) {
        return (function () {
            try {
                return analyze(env, form);
            } catch (error) {
                return error;
            }
        })();
    };
var analyzeForms = exports.analyzeForms = function analyzeForms(forms) {
        return function loop() {
            var recur = loop;
            var nodesø1 = [];
            var formsø2 = forms;
            var envø1 = {
                    'locals': {},
                    'bindings': [],
                    'top': true,
                    'ns': { 'name': symbol(void 0, 'user.wisp') }
                };
            do {
                recur = function () {
                    var nodeø1 = analyzeForm(envø1, first(formsø2));
                    var nsø1 = isEqual((nodeø1 || 0)['op'], 'ns') ? nodeø1 : (envø1 || 0)['ns'];
                    return isError(nodeø1) ? {
                        'ast': nodesø1,
                        'error': nodeø1
                    } : count(formsø2) <= 1 ? { 'ast': conj(nodesø1, nodeø1) } : 'else' ? (loop[0] = conj(nodesø1, nodeø1), loop[1] = rest(formsø2), loop[2] = conj(envø1, { 'ns': nsø1 }), loop) : void 0;
                }.call(this);
            } while (nodesø1 = loop[0], formsø2 = loop[1], envø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    };
var compile = exports.compile = function compile() {
        switch (arguments.length) {
        case 1:
            var source = arguments[0];
            return compile(source, {});
        case 2:
            var source = arguments[0];
            var options = arguments[1];
            return function () {
                var sourceUriø1 = (options || 0)['source-uri'] || name('anonymous.wisp');
                var formsø1 = readForms(source, sourceUriø1);
                var astø1 = (formsø1 || 0)['error'] ? formsø1 : analyzeForms((formsø1 || 0)['forms']);
                var outputø1 = (astø1 || 0)['error'] ? astø1 : (function () {
                        try {
                            return generate.apply(void 0, vec(cons(conj(options, {
                                'source': source,
                                'source-uri': sourceUriø1
                            }), (astø1 || 0)['ast'])));
                        } catch (error) {
                            return { 'error': error };
                        }
                    })();
                var resultø1 = {
                        'source-uri': sourceUriø1,
                        'ast': (astø1 || 0)['ast'],
                        'forms': (formsø1 || 0)['forms']
                    };
                return conj(options, outputø1, resultø1);
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var evaluate = exports.evaluate = function evaluate(source) {
        return function () {
            var outputø1 = compile(source);
            return (outputø1 || 0)['error'] ? (function () {
                throw (outputø1 || 0)['error'];
            })() : eval((outputø1 || 0)['code']);
        }.call(this);
    };
},{"./analyzer":8,"./ast":9,"./backend/escodegen/generator":10,"./reader":32,"./runtime":33,"./sequence":34,"./string":35,"base64-encode":15}],13:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.engine.browser',
            doc: void 0
        };
    var wisp_runtime = require('./../runtime');
    var str = wisp_runtime.str;
    var wisp_sequence = require('./../sequence');
    var rest = wisp_sequence.rest;
    var wisp_reader = require('./../reader');
    var read_ = wisp_reader.read_;
    var readFromString = wisp_reader.readFromString;
    var wisp_compiler = require('./../compiler');
    var compile_ = wisp_compiler.compile_;
}
var evaluate = exports.evaluate = function evaluate(code, url) {
        return eval(compile_(read_(code, url)));
    };
var run = exports.run = function run(code, url) {
        return Function(compile_(read_(code, url)))();
    };
var load = exports.load = function load(url, callback) {
        var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        request.open('GET', url, true);
        request.overrideMimeType ? request.overrideMimeType('application/wisp') : void 0;
        request.onreadystatechange = function () {
            return request.readyState === 4 ? request.status === 0 || request.status === 200 ? callback(run(request.responseText, url)) : callback('Could not load') : void 0;
        };
        return request.send(null);
    };
var runScripts = exports.runScripts = function runScripts() {
        var scripts = Array.prototype.filter.call(document.getElementsByTagName('script'), function (script) {
                return script.type === 'application/wisp';
            });
        var next = function next() {
            return scripts.length ? function () {
                var scriptø1 = scripts.shift();
                return scriptø1.src ? load(scriptø1.src, next) : next(run(scriptø1.innerHTML));
            }.call(this) : void 0;
        };
        return next();
    };
document.readyState === 'complete' || document.readyState === 'interactive' ? runScripts() : window.addEventListener ? window.addEventListener('DOMContentLoaded', runScripts, false) : window.attachEvent('onload', runScripts);
},{"./../compiler":12,"./../reader":32,"./../runtime":33,"./../sequence":34}],14:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.expander',
            doc: 'wisp syntax and macro expander module'
        };
    var wisp_ast = require('./ast');
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var isSymbol = wisp_ast.isSymbol;
    var isKeyword = wisp_ast.isKeyword;
    var isQuote = wisp_ast.isQuote;
    var symbol = wisp_ast.symbol;
    var namespace = wisp_ast.namespace;
    var name = wisp_ast.name;
    var isUnquote = wisp_ast.isUnquote;
    var isUnquoteSplicing = wisp_ast.isUnquoteSplicing;
    var wisp_sequence = require('./sequence');
    var isList = wisp_sequence.isList;
    var list = wisp_sequence.list;
    var conj = wisp_sequence.conj;
    var partition = wisp_sequence.partition;
    var seq = wisp_sequence.seq;
    var isEmpty = wisp_sequence.isEmpty;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var isEvery = wisp_sequence.isEvery;
    var concat = wisp_sequence.concat;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var last = wisp_sequence.last;
    var butlast = wisp_sequence.butlast;
    var interleave = wisp_sequence.interleave;
    var cons = wisp_sequence.cons;
    var count = wisp_sequence.count;
    var some = wisp_sequence.some;
    var assoc = wisp_sequence.assoc;
    var reduce = wisp_sequence.reduce;
    var filter = wisp_sequence.filter;
    var isSeq = wisp_sequence.isSeq;
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isDictionary = wisp_runtime.isDictionary;
    var isVector = wisp_runtime.isVector;
    var keys = wisp_runtime.keys;
    var vals = wisp_runtime.vals;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isDate = wisp_runtime.isDate;
    var isRePattern = wisp_runtime.isRePattern;
    var isEven = wisp_runtime.isEven;
    var isEqual = wisp_runtime.isEqual;
    var max = wisp_runtime.max;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var dictionary = wisp_runtime.dictionary;
    var subs = wisp_runtime.subs;
    var wisp_string = require('./string');
    var split = wisp_string.split;
}
var __macros__ = exports.__macros__ = {};
var expand = function expand(expander, form, env) {
    return function () {
        var metadataø1 = meta(form) || {};
        var parmasø1 = rest(form);
        var implicitø1 = map(function ($1) {
                return isEqual('&form', $1) ? form : isEqual('&env', $1) ? env : 'else' ? $1 : void 0;
            }, (meta(expander) || 0)['implicit'] || []);
        var paramsø1 = vec(concat(implicitø1, vec(rest(form))));
        var expansionø1 = expander.apply(void 0, paramsø1);
        return expansionø1 ? withMeta(expansionø1, conj(metadataø1, meta(expansionø1))) : expansionø1;
    }.call(this);
};
var installMacro = exports.installMacro = function installMacro(op, expander) {
        return (__macros__ || 0)[name(op)] = expander;
    };
var macro = function macro(op) {
    return isSymbol(op) && (__macros__ || 0)[name(op)];
};
var isMethodSyntax = exports.isMethodSyntax = function isMethodSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === first(idø1) && !('-' === second(idø1)) && !('.' === idø1);
        }.call(this);
    };
var isFieldSyntax = exports.isFieldSyntax = function isFieldSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === first(idø1) && '-' === second(idø1);
        }.call(this);
    };
var isNewSyntax = exports.isNewSyntax = function isNewSyntax(op) {
        return function () {
            var idø1 = isSymbol(op) && name(op);
            return idø1 && '.' === last(idø1) && !('.' === idø1);
        }.call(this);
    };
var methodSyntax = exports.methodSyntax = function methodSyntax(op, target) {
        var params = Array.prototype.slice.call(arguments, 2);
        return function () {
            var opMetaø1 = meta(op);
            var formStartø1 = (opMetaø1 || 0)['start'];
            var targetMetaø1 = meta(target);
            var memberø1 = withMeta(symbol(subs(name(op), 1)), conj(opMetaø1, {
                    'start': {
                        'line': (formStartø1 || 0)['line'],
                        'column': inc((formStartø1 || 0)['column'])
                    }
                }));
            var agetø1 = withMeta(symbol(void 0, 'aget'), conj(opMetaø1, {
                    'end': {
                        'line': (formStartø1 || 0)['line'],
                        'column': inc((formStartø1 || 0)['column'])
                    }
                }));
            var methodø1 = withMeta(list.apply(void 0, [agetø1].concat([target], [list.apply(void 0, [symbol(void 0, 'quote')].concat([memberø1]))])), conj(opMetaø1, { 'end': (meta(target) || 0)['end'] }));
            return isNil(target) ? (function () {
                throw Error('Malformed method expression, expecting (.method object ...)');
            })() : list.apply(void 0, [methodø1].concat(vec(params)));
        }.call(this);
    };
var fieldSyntax = exports.fieldSyntax = function fieldSyntax(field, target) {
        var more = Array.prototype.slice.call(arguments, 2);
        return function () {
            var metadataø1 = meta(field);
            var startø1 = (metadataø1 || 0)['start'];
            var endø1 = (metadataø1 || 0)['end'];
            var memberø1 = withMeta(symbol(subs(name(field), 2)), conj(metadataø1, {
                    'start': {
                        'line': (startø1 || 0)['line'],
                        'column': (startø1 || 0)['column'] + 2
                    }
                }));
            return isNil(target) || count(more) ? (function () {
                throw Error('Malformed member expression, expecting (.-member target)');
            })() : list.apply(void 0, [symbol(void 0, 'aget')].concat([target], [list.apply(void 0, [symbol(void 0, 'quote')].concat([memberø1]))]));
        }.call(this);
    };
var newSyntax = exports.newSyntax = function newSyntax(op) {
        var params = Array.prototype.slice.call(arguments, 1);
        return function () {
            var idø1 = name(op);
            var idMetaø1 = (idø1 || 0)['meta'];
            var renameø1 = subs(idø1, 0, dec(count(idø1)));
            var constructorø1 = withMeta(symbol(renameø1), conj(idMetaø1, {
                    'end': {
                        'line': ((idMetaø1 || 0)['end'] || 0)['line'],
                        'column': dec(((idMetaø1 || 0)['end'] || 0)['column'])
                    }
                }));
            var operatorø1 = withMeta(symbol(void 0, 'new'), conj(idMetaø1, {
                    'start': {
                        'line': ((idMetaø1 || 0)['end'] || 0)['line'],
                        'column': dec(((idMetaø1 || 0)['end'] || 0)['column'])
                    }
                }));
            return list.apply(void 0, [symbol(void 0, 'new')].concat([constructorø1], vec(params)));
        }.call(this);
    };
var keywordInvoke = exports.keywordInvoke = function keywordInvoke(keyword, target) {
        return list.apply(void 0, [symbol(void 0, 'get')].concat([target], [keyword]));
    };
var desugar = function desugar(expander, form) {
    return function () {
        var desugaredø1 = expander.apply(void 0, vec(form));
        var metadataø1 = conj({}, meta(form), meta(desugaredø1));
        return withMeta(desugaredø1, metadataø1);
    }.call(this);
};
var macroexpand1 = exports.macroexpand1 = function macroexpand1(form, env) {
        return function () {
            var opø1 = isList(form) && first(form);
            var expanderø1 = macro(opø1);
            return expanderø1 ? expand(expanderø1, form, env) : isKeyword(opø1) ? desugar(keywordInvoke, form) : isFieldSyntax(opø1) ? desugar(fieldSyntax, form) : isMethodSyntax(opø1) ? desugar(methodSyntax, form) : isNewSyntax(opø1) ? desugar(newSyntax, form) : 'else' ? form : void 0;
        }.call(this);
    };
var macroexpand = exports.macroexpand = function macroexpand(form, env) {
        return function loop() {
            var recur = loop;
            var originalø1 = form;
            var expandedø1 = macroexpand1(form, env);
            do {
                recur = originalø1 === expandedø1 ? originalø1 : (loop[0] = expandedø1, loop[1] = macroexpand1(expandedø1, env), loop);
            } while (originalø1 = loop[0], expandedø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var syntaxQuote = exports.syntaxQuote = function syntaxQuote(form) {
        return isSymbol(form) ? list(symbol(void 0, 'quote'), form) : isKeyword(form) ? list(symbol(void 0, 'quote'), form) : isNumber(form) || isString(form) || isBoolean(form) || isNil(form) || isRePattern(form) ? form : isUnquote(form) ? second(form) : isUnquoteSplicing(form) ? readerError('Illegal use of `~@` expression, can only be present in a list') : isEmpty(form) ? form : isDictionary(form) ? list(symbol(void 0, 'apply'), symbol(void 0, 'dictionary'), cons(symbol(void 0, '.concat'), sequenceExpand(concat.apply(void 0, seq(form))))) : isVector(form) ? cons(symbol(void 0, '.concat'), sequenceExpand(form)) : isList(form) ? isEmpty(form) ? cons(symbol(void 0, 'list'), void 0) : list(symbol(void 0, 'apply'), symbol(void 0, 'list'), cons(symbol(void 0, '.concat'), sequenceExpand(form))) : 'else' ? readerError('Unknown Collection type') : void 0;
    };
var syntaxQuoteExpand = exports.syntaxQuoteExpand = syntaxQuote;
var unquoteSplicingExpand = exports.unquoteSplicingExpand = function unquoteSplicingExpand(form) {
        return isVector(form) ? form : list(symbol(void 0, 'vec'), form);
    };
var sequenceExpand = exports.sequenceExpand = function sequenceExpand(forms) {
        return map(function (form) {
            return isUnquote(form) ? [second(form)] : isUnquoteSplicing(form) ? unquoteSplicingExpand(second(form)) : 'else' ? [syntaxQuoteExpand(form)] : void 0;
        }, forms);
    };
installMacro('syntax-quote', syntaxQuote);
var notEqual = exports.notEqual = function notEqual() {
        var body = Array.prototype.slice.call(arguments, 0);
        return list.apply(void 0, [symbol(void 0, 'not')].concat([list.apply(void 0, [symbol(void 0, '=')].concat(vec(body)))]));
    };
installMacro('not=', notEqual);
var expandCond = exports.expandCond = function expandCond() {
        var clauses = Array.prototype.slice.call(arguments, 0);
        return !isEmpty(clauses) ? list(symbol(void 0, 'if'), first(clauses), isEmpty(rest(clauses)) ? (function () {
            throw Error('cond requires an even number of forms');
        })() : second(clauses), cons(symbol(void 0, 'cond'), rest(rest(clauses)))) : void 0;
    };
installMacro('cond', expandCond);
var expandDefn = exports.expandDefn = function expandDefn(andForm, name) {
        var docPlusMetaPlusBody = Array.prototype.slice.call(arguments, 2);
        return function () {
            var docø1 = isString(first(docPlusMetaPlusBody)) ? first(docPlusMetaPlusBody) : void 0;
            var metaPlusBodyø1 = docø1 ? rest(docPlusMetaPlusBody) : docPlusMetaPlusBody;
            var metadataø1 = isDictionary(first(metaPlusBodyø1)) ? conj({ 'doc': docø1 }, first(metaPlusBodyø1)) : void 0;
            var bodyø1 = metadataø1 ? rest(metaPlusBodyø1) : metaPlusBodyø1;
            var idø1 = withMeta(name, conj(meta(name) || {}, metadataø1));
            var fnø1 = withMeta(list.apply(void 0, [symbol(void 0, 'fn')].concat([idø1], vec(bodyø1))), meta(andForm));
            return list.apply(void 0, [symbol(void 0, 'def')].concat([idø1], [fnø1]));
        }.call(this);
    };
installMacro('defn', withMeta(expandDefn, { 'implicit': ['&form'] }));
var expandPrivateDefn = exports.expandPrivateDefn = function expandPrivateDefn(name) {
        var body = Array.prototype.slice.call(arguments, 1);
        return function () {
            var metadataø1 = conj(meta(name) || {}, { 'private': true });
            var idø1 = withMeta(name, metadataø1);
            return list.apply(void 0, [symbol(void 0, 'defn')].concat([idø1], vec(body)));
        }.call(this);
    };
installMacro('defn-', expandPrivateDefn);
},{"./ast":9,"./runtime":33,"./sequence":34,"./string":35}],15:[function(require,module,exports){
var Buffer=require("__browserify_Buffer");module.exports = encode;
function encode(input) {
  return new Buffer(input).toString('base64')
}
},{"__browserify_Buffer":3}],16:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*global exports:true, generateStatement:true, generateExpression:true, require:true, global:true*/
(function () {
    'use strict';

    var Syntax,
        Precedence,
        BinaryPrecedence,
        SourceNode,
        estraverse,
        esutils,
        isArray,
        base,
        indent,
        json,
        renumber,
        hexadecimal,
        quotes,
        escapeless,
        newline,
        space,
        parentheses,
        semicolons,
        safeConcatenation,
        directive,
        extra,
        parse,
        sourceMap,
        FORMAT_MINIFY,
        FORMAT_DEFAULTS;

    estraverse = require('estraverse');
    esutils = require('esutils');

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ComprehensionBlock: 'ComprehensionBlock',
        ComprehensionExpression: 'ComprehensionExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        DebuggerStatement: 'DebuggerStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'

    };

    Precedence = {
        Sequence: 0,
        Yield: 1,
        Assignment: 1,
        Conditional: 2,
        ArrowFunction: 2,
        LogicalOR: 3,
        LogicalAND: 4,
        BitwiseOR: 5,
        BitwiseXOR: 6,
        BitwiseAND: 7,
        Equality: 8,
        Relational: 9,
        BitwiseSHIFT: 10,
        Additive: 11,
        Multiplicative: 12,
        Unary: 13,
        Postfix: 14,
        Call: 15,
        New: 16,
        Member: 17,
        Primary: 18
    };

    BinaryPrecedence = {
        '||': Precedence.LogicalOR,
        '&&': Precedence.LogicalAND,
        '|': Precedence.BitwiseOR,
        '^': Precedence.BitwiseXOR,
        '&': Precedence.BitwiseAND,
        '==': Precedence.Equality,
        '!=': Precedence.Equality,
        '===': Precedence.Equality,
        '!==': Precedence.Equality,
        'is': Precedence.Equality,
        'isnt': Precedence.Equality,
        '<': Precedence.Relational,
        '>': Precedence.Relational,
        '<=': Precedence.Relational,
        '>=': Precedence.Relational,
        'in': Precedence.Relational,
        'instanceof': Precedence.Relational,
        '<<': Precedence.BitwiseSHIFT,
        '>>': Precedence.BitwiseSHIFT,
        '>>>': Precedence.BitwiseSHIFT,
        '+': Precedence.Additive,
        '-': Precedence.Additive,
        '*': Precedence.Multiplicative,
        '%': Precedence.Multiplicative,
        '/': Precedence.Multiplicative
    };

    function getDefaultOptions() {
        // default options
        return {
            indent: null,
            base: null,
            parse: null,
            comment: false,
            format: {
                indent: {
                    style: '    ',
                    base: 0,
                    adjustMultilineComment: false
                },
                newline: '\n',
                space: ' ',
                json: false,
                renumber: false,
                hexadecimal: false,
                quotes: 'single',
                escapeless: false,
                compact: false,
                parentheses: true,
                semicolons: true,
                safeConcatenation: false
            },
            moz: {
                starlessGenerator: false,
                parenthesizedComprehensionBlock: false
            },
            sourceMap: null,
            sourceMapRoot: null,
            sourceMapWithCode: false,
            directive: false,
            verbatim: null
        };
    }

    function stringRepeat(str, num) {
        var result = '';

        for (num |= 0; num > 0; num >>>= 1, str += str) {
            if (num & 1) {
                result += str;
            }
        }

        return result;
    }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    // Fallback for the non SourceMap environment
    function SourceNodeMock(line, column, filename, chunk) {
        var result = [];

        function flatten(input) {
            var i, iz;
            if (isArray(input)) {
                for (i = 0, iz = input.length; i < iz; ++i) {
                    flatten(input[i]);
                }
            } else if (input instanceof SourceNodeMock) {
                result.push(input);
            } else if (typeof input === 'string' && input) {
                result.push(input);
            }
        }

        flatten(chunk);
        this.children = result;
    }

    SourceNodeMock.prototype.toString = function toString() {
        var res = '', i, iz, node;
        for (i = 0, iz = this.children.length; i < iz; ++i) {
            node = this.children[i];
            if (node instanceof SourceNodeMock) {
                res += node.toString();
            } else {
                res += node;
            }
        }
        return res;
    };

    SourceNodeMock.prototype.replaceRight = function replaceRight(pattern, replacement) {
        var last = this.children[this.children.length - 1];
        if (last instanceof SourceNodeMock) {
            last.replaceRight(pattern, replacement);
        } else if (typeof last === 'string') {
            this.children[this.children.length - 1] = last.replace(pattern, replacement);
        } else {
            this.children.push(''.replace(pattern, replacement));
        }
        return this;
    };

    SourceNodeMock.prototype.join = function join(sep) {
        var i, iz, result;
        result = [];
        iz = this.children.length;
        if (iz > 0) {
            --iz;
            for (i = 0; i < iz; ++i) {
                result.push(this.children[i], sep);
            }
            result.push(this.children[iz]);
            this.children = result;
        }
        return this;
    };

    function hasLineTerminator(str) {
        return (/[\r\n]/g).test(str);
    }

    function endsWithLineTerminator(str) {
        var len = str.length;
        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
    }

    function updateDeeply(target, override) {
        var key, val;

        function isHashObject(target) {
            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
        }

        for (key in override) {
            if (override.hasOwnProperty(key)) {
                val = override[key];
                if (isHashObject(val)) {
                    if (isHashObject(target[key])) {
                        updateDeeply(target[key], val);
                    } else {
                        target[key] = updateDeeply({}, val);
                    }
                } else {
                    target[key] = val;
                }
            }
        }
        return target;
    }

    function generateNumber(value) {
        var result, point, temp, exponent, pos;

        if (value !== value) {
            throw new Error('Numeric literal whose value is NaN');
        }
        if (value < 0 || (value === 0 && 1 / value < 0)) {
            throw new Error('Numeric literal whose value is negative');
        }

        if (value === 1 / 0) {
            return json ? 'null' : renumber ? '1e400' : '1e+400';
        }

        result = '' + value;
        if (!renumber || result.length < 3) {
            return result;
        }

        point = result.indexOf('.');
        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
            point = 0;
            result = result.slice(1);
        }
        temp = result;
        result = result.replace('e+', 'e');
        exponent = 0;
        if ((pos = temp.indexOf('e')) > 0) {
            exponent = +temp.slice(pos + 1);
            temp = temp.slice(0, pos);
        }
        if (point >= 0) {
            exponent -= temp.length - point - 1;
            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
        }
        pos = 0;
        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
            --pos;
        }
        if (pos !== 0) {
            exponent -= pos;
            temp = temp.slice(0, pos);
        }
        if (exponent !== 0) {
            temp += 'e' + exponent;
        }
        if ((temp.length < result.length ||
                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
                +temp === value) {
            result = temp;
        }

        return result;
    }

    // Generate valid RegExp expression.
    // This function is based on https://github.com/Constellation/iv Engine

    function escapeRegExpCharacter(ch, previousIsBackslash) {
        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
        if ((ch & ~1) === 0x2028) {
            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
        } else if (ch === 10 || ch === 13) {  // \n, \r
            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
        }
        return String.fromCharCode(ch);
    }

    function generateRegExp(reg) {
        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

        result = reg.toString();

        if (reg.source) {
            // extract flag from toString result
            match = result.match(/\/([^/]*)$/);
            if (!match) {
                return result;
            }

            flags = match[1];
            result = '';

            characterInBrack = false;
            previousIsBackslash = false;
            for (i = 0, iz = reg.source.length; i < iz; ++i) {
                ch = reg.source.charCodeAt(i);

                if (!previousIsBackslash) {
                    if (characterInBrack) {
                        if (ch === 93) {  // ]
                            characterInBrack = false;
                        }
                    } else {
                        if (ch === 47) {  // /
                            result += '\\';
                        } else if (ch === 91) {  // [
                            characterInBrack = true;
                        }
                    }
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    previousIsBackslash = ch === 92;  // \
                } else {
                    // if new RegExp("\\\n') is provided, create /\n/
                    result += escapeRegExpCharacter(ch, previousIsBackslash);
                    // prevent like /\\[/]/
                    previousIsBackslash = false;
                }
            }

            return '/' + result + '/' + flags;
        }

        return result;
    }

    function escapeAllowedCharacter(code, next) {
        var hex, result = '\\';

        switch (code) {
        case 0x08  /* \b */:
            result += 'b';
            break;
        case 0x0C  /* \f */:
            result += 'f';
            break;
        case 0x09  /* \t */:
            result += 't';
            break;
        default:
            hex = code.toString(16).toUpperCase();
            if (json || code > 0xFF) {
                result += 'u' + '0000'.slice(hex.length) + hex;
            } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
                result += '0';
            } else if (code === 0x000B  /* \v */) { // '\v'
                result += 'x0B';
            } else {
                result += 'x' + '00'.slice(hex.length) + hex;
            }
            break;
        }

        return result;
    }

    function escapeDisallowedCharacter(code) {
        var result = '\\';
        switch (code) {
        case 0x5C  /* \ */:
            result += '\\';
            break;
        case 0x0A  /* \n */:
            result += 'n';
            break;
        case 0x0D  /* \r */:
            result += 'r';
            break;
        case 0x2028:
            result += 'u2028';
            break;
        case 0x2029:
            result += 'u2029';
            break;
        default:
            throw new Error('Incorrectly classified character');
        }

        return result;
    }

    function escapeDirective(str) {
        var i, iz, code, quote;

        quote = quotes === 'double' ? '"' : '\'';
        for (i = 0, iz = str.length; i < iz; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                quote = '"';
                break;
            } else if (code === 0x22  /* " */) {
                quote = '\'';
                break;
            } else if (code === 0x5C  /* \ */) {
                ++i;
            }
        }

        return quote + str + quote;
    }

    function escapeString(str) {
        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if (code === 0x27  /* ' */) {
                ++singleQuotes;
            } else if (code === 0x22  /* " */) {
                ++doubleQuotes;
            } else if (code === 0x2F  /* / */ && json) {
                result += '\\';
            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
                result += escapeDisallowedCharacter(code);
                continue;
            } else if ((json && code < 0x20  /* SP */) || !(json || escapeless || (code >= 0x20  /* SP */ && code <= 0x7E  /* ~ */))) {
                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
                continue;
            }
            result += String.fromCharCode(code);
        }

        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
        quote = single ? '\'' : '"';

        if (!(single ? singleQuotes : doubleQuotes)) {
            return quote + result + quote;
        }

        str = result;
        result = quote;

        for (i = 0, len = str.length; i < len; ++i) {
            code = str.charCodeAt(i);
            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
                result += '\\';
            }
            result += String.fromCharCode(code);
        }

        return result + quote;
    }

    function toSourceNode(generated, node) {
        if (node == null) {
            if (generated instanceof SourceNode) {
                return generated;
            } else {
                node = {};
            }
        }
        if (node.loc == null) {
            return new SourceNode(null, null, sourceMap, generated, node.name || null);
        }
        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
    }

    function noEmptySpace() {
        return (space) ? space : ' ';
    }

    function join(left, right) {
        var leftSource = toSourceNode(left).toString(),
            rightSource = toSourceNode(right).toString(),
            leftCharCode = leftSource.charCodeAt(leftSource.length - 1),
            rightCharCode = rightSource.charCodeAt(0);

        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
        esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode) ||
        leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
            return [left, noEmptySpace(), right];
        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
            return [left, right];
        }
        return [left, space, right];
    }

    function addIndent(stmt) {
        return [base, stmt];
    }

    function withIndent(fn) {
        var previousBase, result;
        previousBase = base;
        base += indent;
        result = fn.call(this, base);
        base = previousBase;
        return result;
    }

    function calculateSpaces(str) {
        var i;
        for (i = str.length - 1; i >= 0; --i) {
            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
                break;
            }
        }
        return (str.length - 1) - i;
    }

    function adjustMultilineComment(value, specialBase) {
        var array, i, len, line, j, spaces, previousBase;

        array = value.split(/\r\n|[\r\n]/);
        spaces = Number.MAX_VALUE;

        // first line doesn't have indentation
        for (i = 1, len = array.length; i < len; ++i) {
            line = array[i];
            j = 0;
            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
                ++j;
            }
            if (spaces > j) {
                spaces = j;
            }
        }

        if (typeof specialBase !== 'undefined') {
            // pattern like
            // {
            //   var t = 20;  /*
            //                 * this is comment
            //                 */
            // }
            previousBase = base;
            if (array[1][spaces] === '*') {
                specialBase += ' ';
            }
            base = specialBase;
        } else {
            if (spaces & 1) {
                // /*
                //  *
                //  */
                // If spaces are odd number, above pattern is considered.
                // We waste 1 space.
                --spaces;
            }
            previousBase = base;
        }

        for (i = 1, len = array.length; i < len; ++i) {
            array[i] = toSourceNode(addIndent(array[i].slice(spaces))).join('');
        }

        base = previousBase;

        return array.join('\n');
    }

    function generateComment(comment, specialBase) {
        if (comment.type === 'Line') {
            if (endsWithLineTerminator(comment.value)) {
                return '//' + comment.value;
            } else {
                // Always use LineTerminator
                return '//' + comment.value + '\n';
            }
        }
        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
        }
        return '/*' + comment.value + '*/';
    }

    function addCommentsToStatement(stmt, result) {
        var i, len, comment, save, tailingToStatement, specialBase, fragment;

        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
            save = result;

            comment = stmt.leadingComments[0];
            result = [];
            if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
                result.push('\n');
            }
            result.push(generateComment(comment));
            if (!endsWithLineTerminator(toSourceNode(result).toString())) {
                result.push('\n');
            }

            for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
                comment = stmt.leadingComments[i];
                fragment = [generateComment(comment)];
                if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
                    fragment.push('\n');
                }
                result.push(addIndent(fragment));
            }

            result.push(addIndent(save));
        }

        if (stmt.trailingComments) {
            tailingToStatement = !endsWithLineTerminator(toSourceNode(result).toString());
            specialBase = stringRepeat(' ', calculateSpaces(toSourceNode([base, result, indent]).toString()));
            for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
                comment = stmt.trailingComments[i];
                if (tailingToStatement) {
                    // We assume target like following script
                    //
                    // var t = 20;  /**
                    //               * This is comment of t
                    //               */
                    if (i === 0) {
                        // first case
                        result = [result, indent];
                    } else {
                        result = [result, specialBase];
                    }
                    result.push(generateComment(comment, specialBase));
                } else {
                    result = [result, addIndent(generateComment(comment))];
                }
                if (i !== len - 1 && !endsWithLineTerminator(toSourceNode(result).toString())) {
                    result = [result, '\n'];
                }
            }
        }

        return result;
    }

    function parenthesize(text, current, should) {
        if (current < should) {
            return ['(', text, ')'];
        }
        return text;
    }

    function maybeBlock(stmt, semicolonOptional, functionBody) {
        var result, noLeadingComment;

        noLeadingComment = !extra.comment || !stmt.leadingComments;

        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
            return [space, generateStatement(stmt, { functionBody: functionBody })];
        }

        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
            return ';';
        }

        withIndent(function () {
            result = [newline, addIndent(generateStatement(stmt, { semicolonOptional: semicolonOptional, functionBody: functionBody }))];
        });

        return result;
    }

    function maybeBlockSuffix(stmt, result) {
        var ends = endsWithLineTerminator(toSourceNode(result).toString());
        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
            return [result, space];
        }
        if (ends) {
            return [result, base];
        }
        return [result, newline, base];
    }

    function generateVerbatim(expr, option) {
        var i, result;
        result = expr[extra.verbatim].split(/\r\n|\n/);
        for (i = 1; i < result.length; i++) {
            result[i] = newline + base + result[i];
        }

        result = parenthesize(result, Precedence.Sequence, option.precedence);
        return toSourceNode(result, expr);
    }

    function generateIdentifier(node) {
        return toSourceNode(node.name, node);
    }

    function generateFunctionBody(node) {
        var result, i, len, expr, arrow;

        arrow = node.type === Syntax.ArrowFunctionExpression;

        if (arrow && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
            // arg => { } case
            result = [generateIdentifier(node.params[0])];
        } else {
            result = ['('];
            for (i = 0, len = node.params.length; i < len; ++i) {
                result.push(generateIdentifier(node.params[i]));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result.push(')');
        }

        if (arrow) {
            result.push(space, '=>');
        }

        if (node.expression) {
            result.push(space);
            expr = generateExpression(node.body, {
                precedence: Precedence.Assignment,
                allowIn: true,
                allowCall: true
            });
            if (expr.toString().charAt(0) === '{') {
                expr = ['(', expr, ')'];
            }
            result.push(expr);
        } else {
            result.push(maybeBlock(node.body, false, true));
        }
        return result;
    }

    function generateExpression(expr, option) {
        var result,
            precedence,
            type,
            currentPrecedence,
            i,
            len,
            raw,
            fragment,
            multiline,
            leftCharCode,
            leftSource,
            rightCharCode,
            allowIn,
            allowCall,
            allowUnparenthesizedNew,
            property;

        precedence = option.precedence;
        allowIn = option.allowIn;
        allowCall = option.allowCall;
        type = expr.type || option.type;

        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
            return generateVerbatim(expr, option);
        }

        switch (type) {
        case Syntax.SequenceExpression:
            result = [];
            allowIn |= (Precedence.Sequence < precedence);
            for (i = 0, len = expr.expressions.length; i < len; ++i) {
                result.push(generateExpression(expr.expressions[i], {
                    precedence: Precedence.Assignment,
                    allowIn: allowIn,
                    allowCall: true
                }));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result = parenthesize(result, Precedence.Sequence, precedence);
            break;

        case Syntax.AssignmentExpression:
            allowIn |= (Precedence.Assignment < precedence);
            result = parenthesize(
                [
                    generateExpression(expr.left, {
                        precedence: Precedence.Call,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + expr.operator + space,
                    generateExpression(expr.right, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ],
                Precedence.Assignment,
                precedence
            );
            break;

        case Syntax.ArrowFunctionExpression:
            allowIn |= (Precedence.ArrowFunction < precedence);
            result = parenthesize(generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
            break;

        case Syntax.ConditionalExpression:
            allowIn |= (Precedence.Conditional < precedence);
            result = parenthesize(
                [
                    generateExpression(expr.test, {
                        precedence: Precedence.LogicalOR,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + '?' + space,
                    generateExpression(expr.consequent, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space + ':' + space,
                    generateExpression(expr.alternate, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ],
                Precedence.Conditional,
                precedence
            );
            break;

        case Syntax.LogicalExpression:
        case Syntax.BinaryExpression:
            currentPrecedence = BinaryPrecedence[expr.operator];

            allowIn |= (currentPrecedence < precedence);

            fragment = generateExpression(expr.left, {
                precedence: currentPrecedence,
                allowIn: allowIn,
                allowCall: true
            });

            leftSource = fragment.toString();

            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPart(expr.operator.charCodeAt(0))) {
                result = [fragment, noEmptySpace(), expr.operator];
            } else {
                result = join(fragment, expr.operator);
            }

            fragment = generateExpression(expr.right, {
                precedence: currentPrecedence + 1,
                allowIn: allowIn,
                allowCall: true
            });

            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
                result.push(noEmptySpace(), fragment);
            } else {
                result = join(result, fragment);
            }

            if (expr.operator === 'in' && !allowIn) {
                result = ['(', result, ')'];
            } else {
                result = parenthesize(result, currentPrecedence, precedence);
            }

            break;

        case Syntax.CallExpression:
            result = [generateExpression(expr.callee, {
                precedence: Precedence.Call,
                allowIn: true,
                allowCall: true,
                allowUnparenthesizedNew: false
            })];

            result.push('(');
            for (i = 0, len = expr['arguments'].length; i < len; ++i) {
                result.push(generateExpression(expr['arguments'][i], {
                    precedence: Precedence.Assignment,
                    allowIn: true,
                    allowCall: true
                }));
                if (i + 1 < len) {
                    result.push(',' + space);
                }
            }
            result.push(')');

            if (!allowCall) {
                result = ['(', result, ')'];
            } else {
                result = parenthesize(result, Precedence.Call, precedence);
            }
            break;

        case Syntax.NewExpression:
            len = expr['arguments'].length;
            allowUnparenthesizedNew = option.allowUnparenthesizedNew === undefined || option.allowUnparenthesizedNew;

            result = join(
                'new',
                generateExpression(expr.callee, {
                    precedence: Precedence.New,
                    allowIn: true,
                    allowCall: false,
                    allowUnparenthesizedNew: allowUnparenthesizedNew && !parentheses && len === 0
                })
            );

            if (!allowUnparenthesizedNew || parentheses || len > 0) {
                result.push('(');
                for (i = 0; i < len; ++i) {
                    result.push(generateExpression(expr['arguments'][i], {
                        precedence: Precedence.Assignment,
                        allowIn: true,
                        allowCall: true
                    }));
                    if (i + 1 < len) {
                        result.push(',' + space);
                    }
                }
                result.push(')');
            }

            result = parenthesize(result, Precedence.New, precedence);
            break;

        case Syntax.MemberExpression:
            result = [generateExpression(expr.object, {
                precedence: Precedence.Call,
                allowIn: true,
                allowCall: allowCall,
                allowUnparenthesizedNew: false
            })];

            if (expr.computed) {
                result.push('[', generateExpression(expr.property, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: allowCall
                }), ']');
            } else {
                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
                    fragment = toSourceNode(result).toString();
                    // When the following conditions are all true,
                    //   1. No floating point
                    //   2. Don't have exponents
                    //   3. The last character is a decimal digit
                    //   4. Not hexadecimal OR octal number literal
                    // we should add a floating point.
                    if (
                            fragment.indexOf('.') < 0 &&
                            !/[eExX]/.test(fragment) &&
                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
                            ) {
                        result.push('.');
                    }
                }
                result.push('.', generateIdentifier(expr.property));
            }

            result = parenthesize(result, Precedence.Member, precedence);
            break;

        case Syntax.UnaryExpression:
            fragment = generateExpression(expr.argument, {
                precedence: Precedence.Unary,
                allowIn: true,
                allowCall: true
            });

            if (space === '') {
                result = join(expr.operator, fragment);
            } else {
                result = [expr.operator];
                if (expr.operator.length > 2) {
                    // delete, void, typeof
                    // get `typeof []`, not `typeof[]`
                    result = join(result, fragment);
                } else {
                    // Prevent inserting spaces between operator and argument if it is unnecessary
                    // like, `!cond`
                    leftSource = toSourceNode(result).toString();
                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
                    rightCharCode = fragment.toString().charCodeAt(0);

                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
                            (esutils.code.isIdentifierPart(leftCharCode) && esutils.code.isIdentifierPart(rightCharCode))) {
                        result.push(noEmptySpace(), fragment);
                    } else {
                        result.push(fragment);
                    }
                }
            }
            result = parenthesize(result, Precedence.Unary, precedence);
            break;

        case Syntax.YieldExpression:
            if (expr.delegate) {
                result = 'yield*';
            } else {
                result = 'yield';
            }
            if (expr.argument) {
                result = join(
                    result,
                    generateExpression(expr.argument, {
                        precedence: Precedence.Yield,
                        allowIn: true,
                        allowCall: true
                    })
                );
            }
            result = parenthesize(result, Precedence.Yield, precedence);
            break;

        case Syntax.UpdateExpression:
            if (expr.prefix) {
                result = parenthesize(
                    [
                        expr.operator,
                        generateExpression(expr.argument, {
                            precedence: Precedence.Unary,
                            allowIn: true,
                            allowCall: true
                        })
                    ],
                    Precedence.Unary,
                    precedence
                );
            } else {
                result = parenthesize(
                    [
                        generateExpression(expr.argument, {
                            precedence: Precedence.Postfix,
                            allowIn: true,
                            allowCall: true
                        }),
                        expr.operator
                    ],
                    Precedence.Postfix,
                    precedence
                );
            }
            break;

        case Syntax.FunctionExpression:
            result = 'function';

            if (expr.id) {
                result = [result, noEmptySpace(),
                          generateIdentifier(expr.id),
                          generateFunctionBody(expr)];
            } else {
                result = [result + space, generateFunctionBody(expr)];
            }

            break;

        case Syntax.ArrayPattern:
        case Syntax.ArrayExpression:
            if (!expr.elements.length) {
                result = '[]';
                break;
            }
            multiline = expr.elements.length > 1;
            result = ['[', multiline ? newline : ''];
            withIndent(function (indent) {
                for (i = 0, len = expr.elements.length; i < len; ++i) {
                    if (!expr.elements[i]) {
                        if (multiline) {
                            result.push(indent);
                        }
                        if (i + 1 === len) {
                            result.push(',');
                        }
                    } else {
                        result.push(multiline ? indent : '', generateExpression(expr.elements[i], {
                            precedence: Precedence.Assignment,
                            allowIn: true,
                            allowCall: true
                        }));
                    }
                    if (i + 1 < len) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });
            if (multiline && !endsWithLineTerminator(toSourceNode(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '', ']');
            break;

        case Syntax.Property:
            if (expr.kind === 'get' || expr.kind === 'set') {
                result = [
                    expr.kind, noEmptySpace(),
                    generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    generateFunctionBody(expr.value)
                ];
            } else {
                if (expr.shorthand) {
                    result = generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    });
                } else if (expr.method) {
                    result = [];
                    if (expr.value.generator) {
                        result.push('*');
                    }
                    result.push(generateExpression(expr.key, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }), generateFunctionBody(expr.value));
                } else {
                    result = [
                        generateExpression(expr.key, {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true
                        }),
                        ':' + space,
                        generateExpression(expr.value, {
                            precedence: Precedence.Assignment,
                            allowIn: true,
                            allowCall: true
                        })
                    ];
                }
            }
            break;

        case Syntax.ObjectExpression:
            if (!expr.properties.length) {
                result = '{}';
                break;
            }
            multiline = expr.properties.length > 1;

            withIndent(function () {
                fragment = generateExpression(expr.properties[0], {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true,
                    type: Syntax.Property
                });
            });

            if (!multiline) {
                // issues 4
                // Do not transform from
                //   dejavu.Class.declare({
                //       method2: function () {}
                //   });
                // to
                //   dejavu.Class.declare({method2: function () {
                //       }});
                if (!hasLineTerminator(toSourceNode(fragment).toString())) {
                    result = [ '{', space, fragment, space, '}' ];
                    break;
                }
            }

            withIndent(function (indent) {
                result = [ '{', newline, indent, fragment ];

                if (multiline) {
                    result.push(',' + newline);
                    for (i = 1, len = expr.properties.length; i < len; ++i) {
                        result.push(indent, generateExpression(expr.properties[i], {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true,
                            type: Syntax.Property
                        }));
                        if (i + 1 < len) {
                            result.push(',' + newline);
                        }
                    }
                }
            });

            if (!endsWithLineTerminator(toSourceNode(result).toString())) {
                result.push(newline);
            }
            result.push(base, '}');
            break;

        case Syntax.ObjectPattern:
            if (!expr.properties.length) {
                result = '{}';
                break;
            }

            multiline = false;
            if (expr.properties.length === 1) {
                property = expr.properties[0];
                if (property.value.type !== Syntax.Identifier) {
                    multiline = true;
                }
            } else {
                for (i = 0, len = expr.properties.length; i < len; ++i) {
                    property = expr.properties[i];
                    if (!property.shorthand) {
                        multiline = true;
                        break;
                    }
                }
            }
            result = ['{', multiline ? newline : '' ];

            withIndent(function (indent) {
                for (i = 0, len = expr.properties.length; i < len; ++i) {
                    result.push(multiline ? indent : '', generateExpression(expr.properties[i], {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }));
                    if (i + 1 < len) {
                        result.push(',' + (multiline ? newline : space));
                    }
                }
            });

            if (multiline && !endsWithLineTerminator(toSourceNode(result).toString())) {
                result.push(newline);
            }
            result.push(multiline ? base : '', '}');
            break;

        case Syntax.ThisExpression:
            result = 'this';
            break;

        case Syntax.Identifier:
            result = generateIdentifier(expr);
            break;

        case Syntax.Literal:
            if (expr.hasOwnProperty('raw') && parse) {
                try {
                    raw = parse(expr.raw).body[0].expression;
                    if (raw.type === Syntax.Literal) {
                        if (raw.value === expr.value) {
                            result = expr.raw;
                            break;
                        }
                    }
                } catch (e) {
                    // not use raw property
                }
            }

            if (expr.value === null) {
                result = 'null';
                break;
            }

            if (typeof expr.value === 'string') {
                result = escapeString(expr.value);
                break;
            }

            if (typeof expr.value === 'number') {
                result = generateNumber(expr.value);
                break;
            }

            if (typeof expr.value === 'boolean') {
                result = expr.value ? 'true' : 'false';
                break;
            }

            result = generateRegExp(expr.value);
            break;

        case Syntax.ComprehensionExpression:
            result = [
                '[',
                generateExpression(expr.body, {
                    precedence: Precedence.Assignment,
                    allowIn: true,
                    allowCall: true
                })
            ];

            if (expr.blocks) {
                for (i = 0, len = expr.blocks.length; i < len; ++i) {
                    fragment = generateExpression(expr.blocks[i], {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    });
                    result = join(result, fragment);
                }
            }

            if (expr.filter) {
                result = join(result, 'if' + space);
                fragment = generateExpression(expr.filter, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                });
                if (extra.moz.parenthesizedComprehensionBlock) {
                    result = join(result, [ '(', fragment, ')' ]);
                } else {
                    result = join(result, fragment);
                }
            }
            result.push(']');
            break;

        case Syntax.ComprehensionBlock:
            if (expr.left.type === Syntax.VariableDeclaration) {
                fragment = [
                    expr.left.kind, noEmptySpace(),
                    generateStatement(expr.left.declarations[0], {
                        allowIn: false
                    })
                ];
            } else {
                fragment = generateExpression(expr.left, {
                    precedence: Precedence.Call,
                    allowIn: true,
                    allowCall: true
                });
            }

            fragment = join(fragment, expr.of ? 'of' : 'in');
            fragment = join(fragment, generateExpression(expr.right, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            }));

            if (extra.moz.parenthesizedComprehensionBlock) {
                result = [ 'for' + space + '(', fragment, ')' ];
            } else {
                result = join('for' + space, fragment);
            }
            break;

        default:
            throw new Error('Unknown expression type: ' + expr.type);
        }

        return toSourceNode(result, expr);
    }

    function generateStatement(stmt, option) {
        var i, len, result, node, allowIn, functionBody, directiveContext, fragment, semicolon;

        allowIn = true;
        semicolon = ';';
        functionBody = false;
        directiveContext = false;
        if (option) {
            allowIn = option.allowIn === undefined || option.allowIn;
            if (!semicolons && option.semicolonOptional === true) {
                semicolon = '';
            }
            functionBody = option.functionBody;
            directiveContext = option.directiveContext;
        }

        switch (stmt.type) {
        case Syntax.BlockStatement:
            result = ['{', newline];

            withIndent(function () {
                for (i = 0, len = stmt.body.length; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.body[i], {
                        semicolonOptional: i === len - 1,
                        directiveContext: functionBody
                    }));
                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
                        result.push(newline);
                    }
                }
            });

            result.push(addIndent('}'));
            break;

        case Syntax.BreakStatement:
            if (stmt.label) {
                result = 'break ' + stmt.label.name + semicolon;
            } else {
                result = 'break' + semicolon;
            }
            break;

        case Syntax.ContinueStatement:
            if (stmt.label) {
                result = 'continue ' + stmt.label.name + semicolon;
            } else {
                result = 'continue' + semicolon;
            }
            break;

        case Syntax.DirectiveStatement:
            if (stmt.raw) {
                result = stmt.raw + semicolon;
            } else {
                result = escapeDirective(stmt.directive) + semicolon;
            }
            break;

        case Syntax.DoWhileStatement:
            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
            result = join('do', maybeBlock(stmt.body));
            result = maybeBlockSuffix(stmt.body, result);
            result = join(result, [
                'while' + space + '(',
                generateExpression(stmt.test, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                }),
                ')' + semicolon
            ]);
            break;

        case Syntax.CatchClause:
            withIndent(function () {
                result = [
                    'catch' + space + '(',
                    generateExpression(stmt.param, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            result.push(maybeBlock(stmt.body));
            break;

        case Syntax.DebuggerStatement:
            result = 'debugger' + semicolon;
            break;

        case Syntax.EmptyStatement:
            result = ';';
            break;

        case Syntax.ExpressionStatement:
            result = [generateExpression(stmt.expression, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            })];
            // 12.4 '{', 'function' is not allowed in this position.
            // wrap expression with parentheses
            fragment = toSourceNode(result).toString();
            if (fragment.charAt(0) === '{' || (fragment.slice(0, 8) === 'function' && ' ('.indexOf(fragment.charAt(8)) >= 0) || (directive && directiveContext && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
                result = ['(', result, ')' + semicolon];
            } else {
                result.push(semicolon);
            }
            break;

        case Syntax.VariableDeclarator:
            if (stmt.init) {
                result = [
                    generateExpression(stmt.id, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    }),
                    space,
                    '=',
                    space,
                    generateExpression(stmt.init, {
                        precedence: Precedence.Assignment,
                        allowIn: allowIn,
                        allowCall: true
                    })
                ];
            } else {
                result = generateIdentifier(stmt.id);
            }
            break;

        case Syntax.VariableDeclaration:
            result = [stmt.kind];
            // special path for
            // var x = function () {
            // };
            if (stmt.declarations.length === 1 && stmt.declarations[0].init &&
                    stmt.declarations[0].init.type === Syntax.FunctionExpression) {
                result.push(noEmptySpace(), generateStatement(stmt.declarations[0], {
                    allowIn: allowIn
                }));
            } else {
                // VariableDeclarator is typed as Statement,
                // but joined with comma (not LineTerminator).
                // So if comment is attached to target node, we should specialize.
                withIndent(function () {
                    node = stmt.declarations[0];
                    if (extra.comment && node.leadingComments) {
                        result.push('\n', addIndent(generateStatement(node, {
                            allowIn: allowIn
                        })));
                    } else {
                        result.push(noEmptySpace(), generateStatement(node, {
                            allowIn: allowIn
                        }));
                    }

                    for (i = 1, len = stmt.declarations.length; i < len; ++i) {
                        node = stmt.declarations[i];
                        if (extra.comment && node.leadingComments) {
                            result.push(',' + newline, addIndent(generateStatement(node, {
                                allowIn: allowIn
                            })));
                        } else {
                            result.push(',' + space, generateStatement(node, {
                                allowIn: allowIn
                            }));
                        }
                    }
                });
            }
            result.push(semicolon);
            break;

        case Syntax.ThrowStatement:
            result = [join(
                'throw',
                generateExpression(stmt.argument, {
                    precedence: Precedence.Sequence,
                    allowIn: true,
                    allowCall: true
                })
            ), semicolon];
            break;

        case Syntax.TryStatement:
            result = ['try', maybeBlock(stmt.block)];
            result = maybeBlockSuffix(stmt.block, result);
            if (stmt.handlers) {
                // old interface
                for (i = 0, len = stmt.handlers.length; i < len; ++i) {
                    result = join(result, generateStatement(stmt.handlers[i]));
                    if (stmt.finalizer || i + 1 !== len) {
                        result = maybeBlockSuffix(stmt.handlers[i].body, result);
                    }
                }
            } else {
                // new interface
                if (stmt.handler) {
                    result = join(result, generateStatement(stmt.handler));
                    if (stmt.finalizer || stmt.guardedHandlers.length > 0) {
                        result = maybeBlockSuffix(stmt.handler.body, result);
                    }
                }

                for (i = 0, len = stmt.guardedHandlers.length; i < len; ++i) {
                    result = join(result, generateStatement(stmt.guardedHandlers[i]));
                    if (stmt.finalizer || i + 1 !== len) {
                        result = maybeBlockSuffix(stmt.guardedHandlers[i].body, result);
                    }
                }
            }
            if (stmt.finalizer) {
                result = join(result, ['finally', maybeBlock(stmt.finalizer)]);
            }
            break;

        case Syntax.SwitchStatement:
            withIndent(function () {
                result = [
                    'switch' + space + '(',
                    generateExpression(stmt.discriminant, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')' + space + '{' + newline
                ];
            });
            if (stmt.cases) {
                for (i = 0, len = stmt.cases.length; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.cases[i], {semicolonOptional: i === len - 1}));
                    result.push(fragment);
                    if (!endsWithLineTerminator(toSourceNode(fragment).toString())) {
                        result.push(newline);
                    }
                }
            }
            result.push(addIndent('}'));
            break;

        case Syntax.SwitchCase:
            withIndent(function () {
                if (stmt.test) {
                    result = [
                        join('case', generateExpression(stmt.test, {
                            precedence: Precedence.Sequence,
                            allowIn: true,
                            allowCall: true
                        })),
                        ':'
                    ];
                } else {
                    result = ['default:'];
                }

                i = 0;
                len = stmt.consequent.length;
                if (len && stmt.consequent[0].type === Syntax.BlockStatement) {
                    fragment = maybeBlock(stmt.consequent[0]);
                    result.push(fragment);
                    i = 1;
                }

                if (i !== len && !endsWithLineTerminator(toSourceNode(result).toString())) {
                    result.push(newline);
                }

                for (; i < len; ++i) {
                    fragment = addIndent(generateStatement(stmt.consequent[i], {semicolonOptional: i === len - 1 && semicolon === ''}));
                    result.push(fragment);
                    if (i + 1 !== len && !endsWithLineTerminator(toSourceNode(fragment).toString())) {
                        result.push(newline);
                    }
                }
            });
            break;

        case Syntax.IfStatement:
            withIndent(function () {
                result = [
                    'if' + space + '(',
                    generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            if (stmt.alternate) {
                result.push(maybeBlock(stmt.consequent));
                result = maybeBlockSuffix(stmt.consequent, result);
                if (stmt.alternate.type === Syntax.IfStatement) {
                    result = join(result, ['else ', generateStatement(stmt.alternate, {semicolonOptional: semicolon === ''})]);
                } else {
                    result = join(result, join('else', maybeBlock(stmt.alternate, semicolon === '')));
                }
            } else {
                result.push(maybeBlock(stmt.consequent, semicolon === ''));
            }
            break;

        case Syntax.ForStatement:
            withIndent(function () {
                result = ['for' + space + '('];
                if (stmt.init) {
                    if (stmt.init.type === Syntax.VariableDeclaration) {
                        result.push(generateStatement(stmt.init, {allowIn: false}));
                    } else {
                        result.push(generateExpression(stmt.init, {
                            precedence: Precedence.Sequence,
                            allowIn: false,
                            allowCall: true
                        }), ';');
                    }
                } else {
                    result.push(';');
                }

                if (stmt.test) {
                    result.push(space, generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }), ';');
                } else {
                    result.push(';');
                }

                if (stmt.update) {
                    result.push(space, generateExpression(stmt.update, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }), ')');
                } else {
                    result.push(')');
                }
            });

            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        case Syntax.ForInStatement:
            result = ['for' + space + '('];
            withIndent(function () {
                if (stmt.left.type === Syntax.VariableDeclaration) {
                    withIndent(function () {
                        result.push(stmt.left.kind + noEmptySpace(), generateStatement(stmt.left.declarations[0], {
                            allowIn: false
                        }));
                    });
                } else {
                    result.push(generateExpression(stmt.left, {
                        precedence: Precedence.Call,
                        allowIn: true,
                        allowCall: true
                    }));
                }

                result = join(result, 'in');
                result = [join(
                    result,
                    generateExpression(stmt.right, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    })
                ), ')'];
            });
            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        case Syntax.LabeledStatement:
            result = [stmt.label.name + ':', maybeBlock(stmt.body, semicolon === '')];
            break;

        case Syntax.Program:
            len = stmt.body.length;
            result = [safeConcatenation && len > 0 ? '\n' : ''];
            for (i = 0; i < len; ++i) {
                fragment = addIndent(
                    generateStatement(stmt.body[i], {
                        semicolonOptional: !safeConcatenation && i === len - 1,
                        directiveContext: true
                    })
                );
                result.push(fragment);
                if (i + 1 < len && !endsWithLineTerminator(toSourceNode(fragment).toString())) {
                    result.push(newline);
                }
            }
            break;

        case Syntax.FunctionDeclaration:
            result = [(stmt.generator && !extra.moz.starlessGenerator ? 'function* ' : 'function '),
                      generateIdentifier(stmt.id),
                      generateFunctionBody(stmt)];
            break;

        case Syntax.ReturnStatement:
            if (stmt.argument) {
                result = [join(
                    'return',
                    generateExpression(stmt.argument, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    })
                ), semicolon];
            } else {
                result = ['return' + semicolon];
            }
            break;

        case Syntax.WhileStatement:
            withIndent(function () {
                result = [
                    'while' + space + '(',
                    generateExpression(stmt.test, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        case Syntax.WithStatement:
            withIndent(function () {
                result = [
                    'with' + space + '(',
                    generateExpression(stmt.object, {
                        precedence: Precedence.Sequence,
                        allowIn: true,
                        allowCall: true
                    }),
                    ')'
                ];
            });
            result.push(maybeBlock(stmt.body, semicolon === ''));
            break;

        default:
            throw new Error('Unknown statement type: ' + stmt.type);
        }

        // Attach comments

        if (extra.comment) {
            result = addCommentsToStatement(stmt, result);
        }

        fragment = toSourceNode(result).toString();
        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
            result = toSourceNode(result).replaceRight(/\s+$/, '');
        }

        return toSourceNode(result, stmt);
    }

    function generate(node, options) {
        var defaultOptions = getDefaultOptions(), result, pair;

        if (options != null) {
            // Obsolete options
            //
            //   `options.indent`
            //   `options.base`
            //
            // Instead of them, we can use `option.format.indent`.
            if (typeof options.indent === 'string') {
                defaultOptions.format.indent.style = options.indent;
            }
            if (typeof options.base === 'number') {
                defaultOptions.format.indent.base = options.base;
            }
            options = updateDeeply(defaultOptions, options);
            indent = options.format.indent.style;
            if (typeof options.base === 'string') {
                base = options.base;
            } else {
                base = stringRepeat(indent, options.format.indent.base);
            }
        } else {
            options = defaultOptions;
            indent = options.format.indent.style;
            base = stringRepeat(indent, options.format.indent.base);
        }
        json = options.format.json;
        renumber = options.format.renumber;
        hexadecimal = json ? false : options.format.hexadecimal;
        quotes = json ? 'double' : options.format.quotes;
        escapeless = options.format.escapeless;
        newline = options.format.newline;
        space = options.format.space;
        if (options.format.compact) {
            newline = space = indent = base = '';
        }
        parentheses = options.format.parentheses;
        semicolons = options.format.semicolons;
        safeConcatenation = options.format.safeConcatenation;
        directive = options.directive;
        parse = json ? null : options.parse;
        sourceMap = options.sourceMap;
        extra = options;

        if (sourceMap) {
            if (!exports.browser) {
                // We assume environment is node.js
                // And prevent from including source-map by browserify
                SourceNode = require('source-map').SourceNode;
            } else {
                SourceNode = global.sourceMap.SourceNode;
            }
        } else {
            SourceNode = SourceNodeMock;
        }

        switch (node.type) {
        case Syntax.BlockStatement:
        case Syntax.BreakStatement:
        case Syntax.CatchClause:
        case Syntax.ContinueStatement:
        case Syntax.DirectiveStatement:
        case Syntax.DoWhileStatement:
        case Syntax.DebuggerStatement:
        case Syntax.EmptyStatement:
        case Syntax.ExpressionStatement:
        case Syntax.ForStatement:
        case Syntax.ForInStatement:
        case Syntax.FunctionDeclaration:
        case Syntax.IfStatement:
        case Syntax.LabeledStatement:
        case Syntax.Program:
        case Syntax.ReturnStatement:
        case Syntax.SwitchStatement:
        case Syntax.SwitchCase:
        case Syntax.ThrowStatement:
        case Syntax.TryStatement:
        case Syntax.VariableDeclaration:
        case Syntax.VariableDeclarator:
        case Syntax.WhileStatement:
        case Syntax.WithStatement:
            result = generateStatement(node);
            break;

        case Syntax.AssignmentExpression:
        case Syntax.ArrayExpression:
        case Syntax.ArrayPattern:
        case Syntax.BinaryExpression:
        case Syntax.CallExpression:
        case Syntax.ConditionalExpression:
        case Syntax.FunctionExpression:
        case Syntax.Identifier:
        case Syntax.Literal:
        case Syntax.LogicalExpression:
        case Syntax.MemberExpression:
        case Syntax.NewExpression:
        case Syntax.ObjectExpression:
        case Syntax.ObjectPattern:
        case Syntax.Property:
        case Syntax.SequenceExpression:
        case Syntax.ThisExpression:
        case Syntax.UnaryExpression:
        case Syntax.UpdateExpression:
        case Syntax.YieldExpression:

            result = generateExpression(node, {
                precedence: Precedence.Sequence,
                allowIn: true,
                allowCall: true
            });
            break;

        default:
            throw new Error('Unknown node type: ' + node.type);
        }

        if (!sourceMap) {
            return result.toString();
        }


        pair = result.toStringWithSourceMap({
            file: options.file,
            sourceRoot: options.sourceMapRoot
        });

        if (options.sourceContent) {
            pair.map.setSourceContent(options.sourceMap,
                                      options.sourceContent);
        }

        if (options.sourceMapWithCode) {
            return pair;
        }

        return pair.map.toString();
    }

    FORMAT_MINIFY = {
        indent: {
            style: '',
            base: 0
        },
        renumber: true,
        hexadecimal: true,
        quotes: 'auto',
        escapeless: true,
        compact: true,
        parentheses: false,
        semicolons: false
    };

    FORMAT_DEFAULTS = getDefaultOptions().format;

    exports.version = require('./package.json').version;
    exports.generate = generate;
    exports.attachComments = estraverse.attachComments;
    exports.browser = false;
    exports.FORMAT_MINIFY = FORMAT_MINIFY;
    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./package.json":31,"estraverse":17,"esutils":20,"source-map":21}],17:[function(require,module,exports){
/*
  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*jslint vars:false, bitwise:true*/
/*jshint indent:4*/
/*global exports:true, define:true*/
(function (root, factory) {
    'use strict';

    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
    // and plain browser loading,
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.estraverse = {}));
    }
}(this, function (exports) {
    'use strict';

    var Syntax,
        isArray,
        VisitorOption,
        VisitorKeys,
        BREAK,
        SKIP;

    Syntax = {
        AssignmentExpression: 'AssignmentExpression',
        ArrayExpression: 'ArrayExpression',
        ArrayPattern: 'ArrayPattern',
        ArrowFunctionExpression: 'ArrowFunctionExpression',
        BlockStatement: 'BlockStatement',
        BinaryExpression: 'BinaryExpression',
        BreakStatement: 'BreakStatement',
        CallExpression: 'CallExpression',
        CatchClause: 'CatchClause',
        ClassBody: 'ClassBody',
        ClassDeclaration: 'ClassDeclaration',
        ClassExpression: 'ClassExpression',
        ConditionalExpression: 'ConditionalExpression',
        ContinueStatement: 'ContinueStatement',
        DebuggerStatement: 'DebuggerStatement',
        DirectiveStatement: 'DirectiveStatement',
        DoWhileStatement: 'DoWhileStatement',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        ForStatement: 'ForStatement',
        ForInStatement: 'ForInStatement',
        FunctionDeclaration: 'FunctionDeclaration',
        FunctionExpression: 'FunctionExpression',
        Identifier: 'Identifier',
        IfStatement: 'IfStatement',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        MethodDefinition: 'MethodDefinition',
        NewExpression: 'NewExpression',
        ObjectExpression: 'ObjectExpression',
        ObjectPattern: 'ObjectPattern',
        Program: 'Program',
        Property: 'Property',
        ReturnStatement: 'ReturnStatement',
        SequenceExpression: 'SequenceExpression',
        SwitchStatement: 'SwitchStatement',
        SwitchCase: 'SwitchCase',
        ThisExpression: 'ThisExpression',
        ThrowStatement: 'ThrowStatement',
        TryStatement: 'TryStatement',
        UnaryExpression: 'UnaryExpression',
        UpdateExpression: 'UpdateExpression',
        VariableDeclaration: 'VariableDeclaration',
        VariableDeclarator: 'VariableDeclarator',
        WhileStatement: 'WhileStatement',
        WithStatement: 'WithStatement',
        YieldExpression: 'YieldExpression'
    };

    function ignoreJSHintError() { }

    isArray = Array.isArray;
    if (!isArray) {
        isArray = function isArray(array) {
            return Object.prototype.toString.call(array) === '[object Array]';
        };
    }

    function deepCopy(obj) {
        var ret = {}, key, val;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (typeof val === 'object' && val !== null) {
                    ret[key] = deepCopy(val);
                } else {
                    ret[key] = val;
                }
            }
        }
        return ret;
    }

    function shallowCopy(obj) {
        var ret = {}, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                ret[key] = obj[key];
            }
        }
        return ret;
    }
    ignoreJSHintError(shallowCopy);

    // based on LLVM libc++ upper_bound / lower_bound
    // MIT License

    function upperBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                len = diff;
            } else {
                i = current + 1;
                len -= diff + 1;
            }
        }
        return i;
    }

    function lowerBound(array, func) {
        var diff, len, i, current;

        len = array.length;
        i = 0;

        while (len) {
            diff = len >>> 1;
            current = i + diff;
            if (func(array[current])) {
                i = current + 1;
                len -= diff + 1;
            } else {
                len = diff;
            }
        }
        return i;
    }
    ignoreJSHintError(lowerBound);

    VisitorKeys = {
        AssignmentExpression: ['left', 'right'],
        ArrayExpression: ['elements'],
        ArrayPattern: ['elements'],
        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
        BlockStatement: ['body'],
        BinaryExpression: ['left', 'right'],
        BreakStatement: ['label'],
        CallExpression: ['callee', 'arguments'],
        CatchClause: ['param', 'body'],
        ClassBody: ['body'],
        ClassDeclaration: ['id', 'body', 'superClass'],
        ClassExpression: ['id', 'body', 'superClass'],
        ConditionalExpression: ['test', 'consequent', 'alternate'],
        ContinueStatement: ['label'],
        DebuggerStatement: [],
        DirectiveStatement: [],
        DoWhileStatement: ['body', 'test'],
        EmptyStatement: [],
        ExpressionStatement: ['expression'],
        ForStatement: ['init', 'test', 'update', 'body'],
        ForInStatement: ['left', 'right', 'body'],
        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
        Identifier: [],
        IfStatement: ['test', 'consequent', 'alternate'],
        Literal: [],
        LabeledStatement: ['label', 'body'],
        LogicalExpression: ['left', 'right'],
        MemberExpression: ['object', 'property'],
        MethodDefinition: ['key', 'value'],
        NewExpression: ['callee', 'arguments'],
        ObjectExpression: ['properties'],
        ObjectPattern: ['properties'],
        Program: ['body'],
        Property: ['key', 'value'],
        ReturnStatement: ['argument'],
        SequenceExpression: ['expressions'],
        SwitchStatement: ['discriminant', 'cases'],
        SwitchCase: ['test', 'consequent'],
        ThisExpression: [],
        ThrowStatement: ['argument'],
        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
        UnaryExpression: ['argument'],
        UpdateExpression: ['argument'],
        VariableDeclaration: ['declarations'],
        VariableDeclarator: ['id', 'init'],
        WhileStatement: ['test', 'body'],
        WithStatement: ['object', 'body'],
        YieldExpression: ['argument']
    };

    // unique id
    BREAK = {};
    SKIP = {};

    VisitorOption = {
        Break: BREAK,
        Skip: SKIP
    };

    function Reference(parent, key) {
        this.parent = parent;
        this.key = key;
    }

    Reference.prototype.replace = function replace(node) {
        this.parent[this.key] = node;
    };

    function Element(node, path, wrap, ref) {
        this.node = node;
        this.path = path;
        this.wrap = wrap;
        this.ref = ref;
    }

    function Controller() { }

    // API:
    // return property path array from root to current node
    Controller.prototype.path = function path() {
        var i, iz, j, jz, result, element;

        function addToPath(result, path) {
            if (isArray(path)) {
                for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                }
            } else {
                result.push(path);
            }
        }

        // root node
        if (!this.__current.path) {
            return null;
        }

        // first node is sentinel, second node is root element
        result = [];
        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
            element = this.__leavelist[i];
            addToPath(result, element.path);
        }
        addToPath(result, this.__current.path);
        return result;
    };

    // API:
    // return array of parent elements
    Controller.prototype.parents = function parents() {
        var i, iz, result;

        // first node is sentinel
        result = [];
        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
            result.push(this.__leavelist[i].node);
        }

        return result;
    };

    // API:
    // return current node
    Controller.prototype.current = function current() {
        return this.__current.node;
    };

    Controller.prototype.__execute = function __execute(callback, element) {
        var previous, result;

        result = undefined;

        previous  = this.__current;
        this.__current = element;
        this.__state = null;
        if (callback) {
            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
        }
        this.__current = previous;

        return result;
    };

    // API:
    // notify control skip / break
    Controller.prototype.notify = function notify(flag) {
        this.__state = flag;
    };

    // API:
    // skip child nodes of current node
    Controller.prototype.skip = function () {
        this.notify(SKIP);
    };

    // API:
    // break traversals
    Controller.prototype['break'] = function () {
        this.notify(BREAK);
    };

    Controller.prototype.__initialize = function(root, visitor) {
        this.visitor = visitor;
        this.root = root;
        this.__worklist = [];
        this.__leavelist = [];
        this.__current = null;
        this.__state = null;
    };

    Controller.prototype.traverse = function traverse(root, visitor) {
        var worklist,
            leavelist,
            element,
            node,
            nodeType,
            ret,
            key,
            current,
            current2,
            candidates,
            candidate,
            sentinel;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        worklist.push(new Element(root, null, null, null));
        leavelist.push(new Element(null, null, null, null));

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                ret = this.__execute(visitor.leave, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }
                continue;
            }

            if (element.node) {

                ret = this.__execute(visitor.enter, element);

                if (this.__state === BREAK || ret === BREAK) {
                    return;
                }

                worklist.push(sentinel);
                leavelist.push(element);

                if (this.__state === SKIP || ret === SKIP) {
                    continue;
                }

                node = element.node;
                nodeType = element.wrap || node.type;
                candidates = VisitorKeys[nodeType];

                current = candidates.length;
                while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                        continue;
                    }

                    if (!isArray(candidate)) {
                        worklist.push(new Element(candidate, key, null, null));
                        continue;
                    }

                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                            continue;
                        }
                        if ((nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === candidates[current]) {
                            element = new Element(candidate[current2], [key, current2], 'Property', null);
                        } else {
                            element = new Element(candidate[current2], [key, current2], null, null);
                        }
                        worklist.push(element);
                    }
                }
            }
        }
    };

    Controller.prototype.replace = function replace(root, visitor) {
        var worklist,
            leavelist,
            node,
            nodeType,
            target,
            element,
            current,
            current2,
            candidates,
            candidate,
            sentinel,
            outer,
            key;

        this.__initialize(root, visitor);

        sentinel = {};

        // reference
        worklist = this.__worklist;
        leavelist = this.__leavelist;

        // initialize
        outer = {
            root: root
        };
        element = new Element(root, null, null, new Reference(outer, 'root'));
        worklist.push(element);
        leavelist.push(element);

        while (worklist.length) {
            element = worklist.pop();

            if (element === sentinel) {
                element = leavelist.pop();

                target = this.__execute(visitor.leave, element);

                // node may be replaced with null,
                // so distinguish between undefined and null in this place
                if (target !== undefined && target !== BREAK && target !== SKIP) {
                    // replace
                    element.ref.replace(target);
                }

                if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                }
                continue;
            }

            target = this.__execute(visitor.enter, element);

            // node may be replaced with null,
            // so distinguish between undefined and null in this place
            if (target !== undefined && target !== BREAK && target !== SKIP) {
                // replace
                element.ref.replace(target);
                element.node = target;
            }

            if (this.__state === BREAK || target === BREAK) {
                return outer.root;
            }

            // node may be null
            node = element.node;
            if (!node) {
                continue;
            }

            worklist.push(sentinel);
            leavelist.push(element);

            if (this.__state === SKIP || target === SKIP) {
                continue;
            }

            nodeType = element.wrap || node.type;
            candidates = VisitorKeys[nodeType];

            current = candidates.length;
            while ((current -= 1) >= 0) {
                key = candidates[current];
                candidate = node[key];
                if (!candidate) {
                    continue;
                }

                if (!isArray(candidate)) {
                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
                    continue;
                }

                current2 = candidate.length;
                while ((current2 -= 1) >= 0) {
                    if (!candidate[current2]) {
                        continue;
                    }
                    if (nodeType === Syntax.ObjectExpression && 'properties' === candidates[current]) {
                        element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
                    } else {
                        element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
                    }
                    worklist.push(element);
                }
            }
        }

        return outer.root;
    };

    function traverse(root, visitor) {
        var controller = new Controller();
        return controller.traverse(root, visitor);
    }

    function replace(root, visitor) {
        var controller = new Controller();
        return controller.replace(root, visitor);
    }

    function extendCommentRange(comment, tokens) {
        var target;

        target = upperBound(tokens, function search(token) {
            return token.range[0] > comment.range[0];
        });

        comment.extendedRange = [comment.range[0], comment.range[1]];

        if (target !== tokens.length) {
            comment.extendedRange[1] = tokens[target].range[0];
        }

        target -= 1;
        if (target >= 0) {
            comment.extendedRange[0] = tokens[target].range[1];
        }

        return comment;
    }

    function attachComments(tree, providedComments, tokens) {
        // At first, we should calculate extended comment ranges.
        var comments = [], comment, len, i, cursor;

        if (!tree.range) {
            throw new Error('attachComments needs range information');
        }

        // tokens array is empty, we attach comments to tree as 'leadingComments'
        if (!tokens.length) {
            if (providedComments.length) {
                for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                }
                tree.leadingComments = comments;
            }
            return tree;
        }

        for (i = 0, len = providedComments.length; i < len; i += 1) {
            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
        }

        // This is based on John Freeman's implementation.
        cursor = 0;
        traverse(tree, {
            enter: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                        break;
                    }

                    if (comment.extendedRange[1] === node.range[0]) {
                        if (!node.leadingComments) {
                            node.leadingComments = [];
                        }
                        node.leadingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        cursor = 0;
        traverse(tree, {
            leave: function (node) {
                var comment;

                while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                        break;
                    }

                    if (node.range[1] === comment.extendedRange[0]) {
                        if (!node.trailingComments) {
                            node.trailingComments = [];
                        }
                        node.trailingComments.push(comment);
                        comments.splice(cursor, 1);
                    } else {
                        cursor += 1;
                    }
                }

                // already out of owned node
                if (cursor === comments.length) {
                    return VisitorOption.Break;
                }

                if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                }
            }
        });

        return tree;
    }

    exports.version = '1.3.3-dev';
    exports.Syntax = Syntax;
    exports.traverse = traverse;
    exports.replace = replace;
    exports.attachComments = attachComments;
    exports.VisitorKeys = VisitorKeys;
    exports.VisitorOption = VisitorOption;
    exports.Controller = Controller;
}));
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],18:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var Regex;

    // See also tools/generate-unicode-regex.py.
    Regex = {
        NonAsciiIdentifierStart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]'),
        NonAsciiIdentifierPart: new RegExp('[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0\u08A2-\u08AC\u08E4-\u08FE\u0900-\u0963\u0966-\u096F\u0971-\u0977\u0979-\u097F\u0981-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C82\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191C\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1D00-\u1DE6\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA697\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7B\uAA80-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE26\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]')
    };

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }

    function isHexDigit(ch) {
        return isDecimalDigit(ch) || (97 <= ch && ch <= 102) || (65 <= ch && ch <= 70);
    }

    function isOctalDigit(ch) {
        return (ch >= 48 && ch <= 55);   // 0..7
    }

    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
            (ch >= 0x1680 && [0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF].indexOf(ch) >= 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch === 92) ||                    // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)));
    }

    function isIdentifierPart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch >= 48 && ch <= 57) ||         // 0..9
            (ch === 92) ||                    // \ (backslash)
            ((ch >= 0x80) && Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)));
    }

    module.exports = {
        isDecimalDigit: isDecimalDigit,
        isHexDigit: isHexDigit,
        isOctalDigit: isOctalDigit,
        isWhiteSpace: isWhiteSpace,
        isLineTerminator: isLineTerminator,
        isIdentifierStart: isIdentifierStart,
        isIdentifierPart: isIdentifierPart
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{}],19:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function () {
    'use strict';

    var code = require('./code');

    function isStrictModeReservedWordES6(id) {
        switch (id) {
        case 'implements':
        case 'interface':
        case 'package':
        case 'private':
        case 'protected':
        case 'public':
        case 'static':
        case 'let':
            return true;
        default:
            return false;
        }
    }

    function isKeywordES5(id, strict) {
        // yield should not be treated as keyword under non-strict mode.
        if (!strict && id === 'yield') {
            return false;
        }
        return isKeywordES6(id, strict);
    }

    function isKeywordES6(id, strict) {
        if (strict && isStrictModeReservedWordES6(id)) {
            return true;
        }

        switch (id.length) {
        case 2:
            return (id === 'if') || (id === 'in') || (id === 'do');
        case 3:
            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
        case 4:
            return (id === 'this') || (id === 'else') || (id === 'case') ||
                (id === 'void') || (id === 'with') || (id === 'enum');
        case 5:
            return (id === 'while') || (id === 'break') || (id === 'catch') ||
                (id === 'throw') || (id === 'const') || (id === 'yield') ||
                (id === 'class') || (id === 'super');
        case 6:
            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
                (id === 'switch') || (id === 'export') || (id === 'import');
        case 7:
            return (id === 'default') || (id === 'finally') || (id === 'extends');
        case 8:
            return (id === 'function') || (id === 'continue') || (id === 'debugger');
        case 10:
            return (id === 'instanceof');
        default:
            return false;
        }
    }

    function isRestrictedWord(id) {
        return id === 'eval' || id === 'arguments';
    }

    function isIdentifierName(id) {
        var i, iz, ch;

        if (id.length === 0) {
            return false;
        }

        ch = id.charCodeAt(0);
        if (!code.isIdentifierStart(ch) || ch === 92) {  // \ (backslash)
            return false;
        }

        for (i = 1, iz = id.length; i < iz; ++i) {
            ch = id.charCodeAt(i);
            if (!code.isIdentifierPart(ch) || ch === 92) {  // \ (backslash)
                return false;
            }
        }
        return true;
    }

    module.exports = {
        isKeywordES5: isKeywordES5,
        isKeywordES6: isKeywordES6,
        isRestrictedWord: isRestrictedWord,
        isIdentifierName: isIdentifierName
    };
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":18}],20:[function(require,module,exports){
/*
  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


(function () {
    'use strict';

    exports.code = require('./code');
    exports.keyword = require('./keyword');
}());
/* vim: set sw=4 ts=4 et tw=80 : */

},{"./code":18,"./keyword":19}],21:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./source-map/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./source-map/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./source-map/source-node').SourceNode;

},{"./source-map/source-map-consumer":26,"./source-map/source-map-generator":27,"./source-map/source-node":28}],22:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');

  /**
   * A data structure which is a combination of an array and a set. Adding a new
   * member is O(1), testing for membership is O(1), and finding the index of an
   * element is O(1). Removing elements from the set is not supported. Only
   * strings are supported for membership.
   */
  function ArraySet() {
    this._array = [];
    this._set = {};
  }

  /**
   * Static method for creating ArraySet instances from an existing array.
   */
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i = 0, len = aArray.length; i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };

  /**
   * Add the given string to this set.
   *
   * @param String aStr
   */
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var isDuplicate = this.has(aStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      this._set[util.toSetString(aStr)] = idx;
    }
  };

  /**
   * Is the given string a member of this set?
   *
   * @param String aStr
   */
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    return Object.prototype.hasOwnProperty.call(this._set,
                                                util.toSetString(aStr));
  };

  /**
   * What is the index of the given string in the array?
   *
   * @param String aStr
   */
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (this.has(aStr)) {
      return this._set[util.toSetString(aStr)];
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };

  /**
   * What is the element at the given index?
   *
   * @param Number aIdx
   */
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error('No element indexed by ' + aIdx);
  };

  /**
   * Returns the array representation of this set (which has the proper indices
   * indicated by indexOf). Note that this is a copy of the internal array used
   * for storing the members so that no one can mess with internal state.
   */
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };

  exports.ArraySet = ArraySet;

});

},{"./util":29,"amdefine":30}],23:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64 = require('./base64');

  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
  // length quantities we use in the source map spec, the first bit is the sign,
  // the next four bits are the actual value, and the 6th bit is the
  // continuation bit. The continuation bit tells us whether there are more
  // digits in this value following this digit.
  //
  //   Continuation
  //   |    Sign
  //   |    |
  //   V    V
  //   101011

  var VLQ_BASE_SHIFT = 5;

  // binary: 100000
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

  // binary: 011111
  var VLQ_BASE_MASK = VLQ_BASE - 1;

  // binary: 100000
  var VLQ_CONTINUATION_BIT = VLQ_BASE;

  /**
   * Converts from a two-complement value to a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
   */
  function toVLQSigned(aValue) {
    return aValue < 0
      ? ((-aValue) << 1) + 1
      : (aValue << 1) + 0;
  }

  /**
   * Converts to a two-complement value from a value where the sign bit is
   * is placed in the least significant bit.  For example, as decimals:
   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
   */
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative
      ? -shifted
      : shifted;
  }

  /**
   * Returns the base 64 VLQ encoded value.
   */
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;

    var vlq = toVLQSigned(aValue);

    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        // There are still more digits in this value, so we must make sure the
        // continuation bit is marked.
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);

    return encoded;
  };

  /**
   * Decodes the next base 64 VLQ value from the given string and returns the
   * value and the rest of the string.
   */
  exports.decode = function base64VLQ_decode(aStr) {
    var i = 0;
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;

    do {
      if (i >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charAt(i++));
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);

    return {
      value: fromVLQSigned(result),
      rest: aStr.slice(i)
    };
  };

});

},{"./base64":24,"amdefine":30}],24:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var charToIntMap = {};
  var intToCharMap = {};

  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    .split('')
    .forEach(function (ch, index) {
      charToIntMap[ch] = index;
      intToCharMap[index] = ch;
    });

  /**
   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
   */
  exports.encode = function base64_encode(aNumber) {
    if (aNumber in intToCharMap) {
      return intToCharMap[aNumber];
    }
    throw new TypeError("Must be between 0 and 63: " + aNumber);
  };

  /**
   * Decode a single base 64 digit to an integer.
   */
  exports.decode = function base64_decode(aChar) {
    if (aChar in charToIntMap) {
      return charToIntMap[aChar];
    }
    throw new TypeError("Not a valid base 64 digit: " + aChar);
  };

});

},{"amdefine":30}],25:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * Recursive implementation of binary search.
   *
   * @param aLow Indices here and lower do not contain the needle.
   * @param aHigh Indices here and higher do not contain the needle.
   * @param aNeedle The element being searched for.
   * @param aHaystack The non-empty array being searched.
   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
   */
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
    // This function terminates when one of the following is true:
    //
    //   1. We find the exact element we are looking for.
    //
    //   2. We did not find the exact element, but we can return the next
    //      closest element that is less than that element.
    //
    //   3. We did not find the exact element, and there is no next-closest
    //      element which is less than the one we are searching for, so we
    //      return null.
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      // Found the element we are looking for.
      return aHaystack[mid];
    }
    else if (cmp > 0) {
      // aHaystack[mid] is greater than our needle.
      if (aHigh - mid > 1) {
        // The element is in the upper half.
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
      }
      // We did not find an exact match, return the next closest one
      // (termination case 2).
      return aHaystack[mid];
    }
    else {
      // aHaystack[mid] is less than our needle.
      if (mid - aLow > 1) {
        // The element is in the lower half.
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
      }
      // The exact needle element was not found in this haystack. Determine if
      // we are in termination case (2) or (3) and return the appropriate thing.
      return aLow < 0
        ? null
        : aHaystack[aLow];
    }
  }

  /**
   * This is an implementation of binary search which will always try and return
   * the next lowest value checked if there is no exact hit. This is because
   * mappings between original and generated line/col pairs are single points,
   * and there is an implicit region between each of them, so a miss just means
   * that you aren't on the very start of a region.
   *
   * @param aNeedle The element you are looking for.
   * @param aHaystack The array that is being searched.
   * @param aCompare A function which takes the needle and an element in the
   *     array and returns -1, 0, or 1 depending on whether the needle is less
   *     than, equal to, or greater than the element, respectively.
   */
  exports.search = function search(aNeedle, aHaystack, aCompare) {
    return aHaystack.length > 0
      ? recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
      : null;
  };

});

},{"amdefine":30}],26:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var util = require('./util');
  var binarySearch = require('./binary-search');
  var ArraySet = require('./array-set').ArraySet;
  var base64VLQ = require('./base64-vlq');

  /**
   * A SourceMapConsumer instance represents a parsed source map which we can
   * query for information about the original file positions by giving it a file
   * position in the generated source.
   *
   * The only parameter is the raw source map (either as a JSON string, or
   * already parsed to an object). According to the spec, source maps have the
   * following attributes:
   *
   *   - version: Which version of the source map spec this map is following.
   *   - sources: An array of URLs to the original source files.
   *   - names: An array of identifiers which can be referrenced by individual mappings.
   *   - sourceRoot: Optional. The URL root from which all sources are relative.
   *   - sourcesContent: Optional. An array of contents of the original source files.
   *   - mappings: A string of base64 VLQs which contain the actual mappings.
   *   - file: The generated file this source map is associated with.
   *
   * Here is an example source map, taken from the source map spec[0]:
   *
   *     {
   *       version : 3,
   *       file: "out.js",
   *       sourceRoot : "",
   *       sources: ["foo.js", "bar.js"],
   *       names: ["src", "maps", "are", "fun"],
   *       mappings: "AA,AB;;ABCDE;"
   *     }
   *
   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
   */
  function SourceMapConsumer(aSourceMap) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === 'string') {
      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
    }

    var version = util.getArg(sourceMap, 'version');
    var sources = util.getArg(sourceMap, 'sources');
    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
    // requires the array) to play nice here.
    var names = util.getArg(sourceMap, 'names', []);
    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
    var mappings = util.getArg(sourceMap, 'mappings');
    var file = util.getArg(sourceMap, 'file', null);

    // Once again, Sass deviates from the spec and supplies the version as a
    // string rather than a number, so we use loose equality checking here.
    if (version != this._version) {
      throw new Error('Unsupported version: ' + version);
    }

    // Pass `true` below to allow duplicate names and sources. While source maps
    // are intended to be compressed and deduplicated, the TypeScript compiler
    // sometimes generates source maps with duplicates in them. See Github issue
    // #72 and bugzil.la/889492.
    this._names = ArraySet.fromArray(names, true);
    this._sources = ArraySet.fromArray(sources, true);

    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this.file = file;
  }

  /**
   * Create a SourceMapConsumer from a SourceMapGenerator.
   *
   * @param SourceMapGenerator aSourceMap
   *        The source map that will be consumed.
   * @returns SourceMapConsumer
   */
  SourceMapConsumer.fromSourceMap =
    function SourceMapConsumer_fromSourceMap(aSourceMap) {
      var smc = Object.create(SourceMapConsumer.prototype);

      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
      smc.sourceRoot = aSourceMap._sourceRoot;
      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                              smc.sourceRoot);
      smc.file = aSourceMap._file;

      smc.__generatedMappings = aSourceMap._mappings.slice()
        .sort(util.compareByGeneratedPositions);
      smc.__originalMappings = aSourceMap._mappings.slice()
        .sort(util.compareByOriginalPositions);

      return smc;
    };

  /**
   * The version of the source mapping spec that we are consuming.
   */
  SourceMapConsumer.prototype._version = 3;

  /**
   * The list of original sources.
   */
  Object.defineProperty(SourceMapConsumer.prototype, 'sources', {
    get: function () {
      return this._sources.toArray().map(function (s) {
        return this.sourceRoot ? util.join(this.sourceRoot, s) : s;
      }, this);
    }
  });

  // `__generatedMappings` and `__originalMappings` are arrays that hold the
  // parsed mapping coordinates from the source map's "mappings" attribute. They
  // are lazily instantiated, accessed via the `_generatedMappings` and
  // `_originalMappings` getters respectively, and we only parse the mappings
  // and create these arrays once queried for a source location. We jump through
  // these hoops because there can be many thousands of mappings, and parsing
  // them is expensive, so we only want to do it if we must.
  //
  // Each object in the arrays is of the form:
  //
  //     {
  //       generatedLine: The line number in the generated code,
  //       generatedColumn: The column number in the generated code,
  //       source: The path to the original source file that generated this
  //               chunk of code,
  //       originalLine: The line number in the original source that
  //                     corresponds to this chunk of generated code,
  //       originalColumn: The column number in the original source that
  //                       corresponds to this chunk of generated code,
  //       name: The name of the original symbol which generated this chunk of
  //             code.
  //     }
  //
  // All properties except for `generatedLine` and `generatedColumn` can be
  // `null`.
  //
  // `_generatedMappings` is ordered by the generated positions.
  //
  // `_originalMappings` is ordered by the original positions.

  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
    get: function () {
      if (!this.__generatedMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__generatedMappings;
    }
  });

  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
    get: function () {
      if (!this.__originalMappings) {
        this.__generatedMappings = [];
        this.__originalMappings = [];
        this._parseMappings(this._mappings, this.sourceRoot);
      }

      return this.__originalMappings;
    }
  });

  /**
   * Parse the mappings in a string in to a data structure which we can easily
   * query (the ordered arrays in the `this.__generatedMappings` and
   * `this.__originalMappings` properties).
   */
  SourceMapConsumer.prototype._parseMappings =
    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
      var generatedLine = 1;
      var previousGeneratedColumn = 0;
      var previousOriginalLine = 0;
      var previousOriginalColumn = 0;
      var previousSource = 0;
      var previousName = 0;
      var mappingSeparator = /^[,;]/;
      var str = aStr;
      var mapping;
      var temp;

      while (str.length > 0) {
        if (str.charAt(0) === ';') {
          generatedLine++;
          str = str.slice(1);
          previousGeneratedColumn = 0;
        }
        else if (str.charAt(0) === ',') {
          str = str.slice(1);
        }
        else {
          mapping = {};
          mapping.generatedLine = generatedLine;

          // Generated column.
          temp = base64VLQ.decode(str);
          mapping.generatedColumn = previousGeneratedColumn + temp.value;
          previousGeneratedColumn = mapping.generatedColumn;
          str = temp.rest;

          if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
            // Original source.
            temp = base64VLQ.decode(str);
            mapping.source = this._sources.at(previousSource + temp.value);
            previousSource += temp.value;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source, but no line and column');
            }

            // Original line.
            temp = base64VLQ.decode(str);
            mapping.originalLine = previousOriginalLine + temp.value;
            previousOriginalLine = mapping.originalLine;
            // Lines are stored 0-based
            mapping.originalLine += 1;
            str = temp.rest;
            if (str.length === 0 || mappingSeparator.test(str.charAt(0))) {
              throw new Error('Found a source and line, but no column');
            }

            // Original column.
            temp = base64VLQ.decode(str);
            mapping.originalColumn = previousOriginalColumn + temp.value;
            previousOriginalColumn = mapping.originalColumn;
            str = temp.rest;

            if (str.length > 0 && !mappingSeparator.test(str.charAt(0))) {
              // Original name.
              temp = base64VLQ.decode(str);
              mapping.name = this._names.at(previousName + temp.value);
              previousName += temp.value;
              str = temp.rest;
            }
          }

          this.__generatedMappings.push(mapping);
          if (typeof mapping.originalLine === 'number') {
            this.__originalMappings.push(mapping);
          }
        }
      }

      this.__originalMappings.sort(util.compareByOriginalPositions);
    };

  /**
   * Find the mapping that best matches the hypothetical "needle" mapping that
   * we are searching for in the given "haystack" of mappings.
   */
  SourceMapConsumer.prototype._findMapping =
    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                           aColumnName, aComparator) {
      // To return the position we are searching for, we must first find the
      // mapping for the given position and then return the opposite position it
      // points to. Because the mappings are sorted, we can use binary search to
      // find the best mapping.

      if (aNeedle[aLineName] <= 0) {
        throw new TypeError('Line must be greater than or equal to 1, got '
                            + aNeedle[aLineName]);
      }
      if (aNeedle[aColumnName] < 0) {
        throw new TypeError('Column must be greater than or equal to 0, got '
                            + aNeedle[aColumnName]);
      }

      return binarySearch.search(aNeedle, aMappings, aComparator);
    };

  /**
   * Returns the original source, line, and column information for the generated
   * source's line and column positions provided. The only argument is an object
   * with the following properties:
   *
   *   - line: The line number in the generated source.
   *   - column: The column number in the generated source.
   *
   * and an object is returned with the following properties:
   *
   *   - source: The original source file, or null.
   *   - line: The line number in the original source, or null.
   *   - column: The column number in the original source, or null.
   *   - name: The original identifier, or null.
   */
  SourceMapConsumer.prototype.originalPositionFor =
    function SourceMapConsumer_originalPositionFor(aArgs) {
      var needle = {
        generatedLine: util.getArg(aArgs, 'line'),
        generatedColumn: util.getArg(aArgs, 'column')
      };

      var mapping = this._findMapping(needle,
                                      this._generatedMappings,
                                      "generatedLine",
                                      "generatedColumn",
                                      util.compareByGeneratedPositions);

      if (mapping) {
        var source = util.getArg(mapping, 'source', null);
        if (source && this.sourceRoot) {
          source = util.join(this.sourceRoot, source);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: util.getArg(mapping, 'name', null)
        };
      }

      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    };

  /**
   * Returns the original source content. The only argument is the url of the
   * original source file. Returns null if no original source content is
   * availible.
   */
  SourceMapConsumer.prototype.sourceContentFor =
    function SourceMapConsumer_sourceContentFor(aSource) {
      if (!this.sourcesContent) {
        return null;
      }

      if (this.sourceRoot) {
        aSource = util.relative(this.sourceRoot, aSource);
      }

      if (this._sources.has(aSource)) {
        return this.sourcesContent[this._sources.indexOf(aSource)];
      }

      var url;
      if (this.sourceRoot
          && (url = util.urlParse(this.sourceRoot))) {
        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
        // many users. We can help them out when they expect file:// URIs to
        // behave like it would if they were running a local HTTP server. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
        if (url.scheme == "file"
            && this._sources.has(fileUriAbsPath)) {
          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
        }

        if ((!url.path || url.path == "/")
            && this._sources.has("/" + aSource)) {
          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
        }
      }

      throw new Error('"' + aSource + '" is not in the SourceMap.');
    };

  /**
   * Returns the generated line and column information for the original source,
   * line, and column positions provided. The only argument is an object with
   * the following properties:
   *
   *   - source: The filename of the original source.
   *   - line: The line number in the original source.
   *   - column: The column number in the original source.
   *
   * and an object is returned with the following properties:
   *
   *   - line: The line number in the generated source, or null.
   *   - column: The column number in the generated source, or null.
   */
  SourceMapConsumer.prototype.generatedPositionFor =
    function SourceMapConsumer_generatedPositionFor(aArgs) {
      var needle = {
        source: util.getArg(aArgs, 'source'),
        originalLine: util.getArg(aArgs, 'line'),
        originalColumn: util.getArg(aArgs, 'column')
      };

      if (this.sourceRoot) {
        needle.source = util.relative(this.sourceRoot, needle.source);
      }

      var mapping = this._findMapping(needle,
                                      this._originalMappings,
                                      "originalLine",
                                      "originalColumn",
                                      util.compareByOriginalPositions);

      if (mapping) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null)
        };
      }

      return {
        line: null,
        column: null
      };
    };

  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;

  /**
   * Iterate over each mapping between an original source/line/column and a
   * generated line/column in this source map.
   *
   * @param Function aCallback
   *        The function that is called with each mapping.
   * @param Object aContext
   *        Optional. If specified, this object will be the value of `this` every
   *        time that `aCallback` is called.
   * @param aOrder
   *        Either `SourceMapConsumer.GENERATED_ORDER` or
   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
   *        iterate over the mappings sorted by the generated file's line/column
   *        order or the original's source/line/column order, respectively. Defaults to
   *        `SourceMapConsumer.GENERATED_ORDER`.
   */
  SourceMapConsumer.prototype.eachMapping =
    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
      var context = aContext || null;
      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

      var mappings;
      switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
      }

      var sourceRoot = this.sourceRoot;
      mappings.map(function (mapping) {
        var source = mapping.source;
        if (source && sourceRoot) {
          source = util.join(sourceRoot, source);
        }
        return {
          source: source,
          generatedLine: mapping.generatedLine,
          generatedColumn: mapping.generatedColumn,
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: mapping.name
        };
      }).forEach(aCallback, context);
    };

  exports.SourceMapConsumer = SourceMapConsumer;

});

},{"./array-set":22,"./base64-vlq":23,"./binary-search":25,"./util":29,"amdefine":30}],27:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var base64VLQ = require('./base64-vlq');
  var util = require('./util');
  var ArraySet = require('./array-set').ArraySet;

  /**
   * An instance of the SourceMapGenerator represents a source map which is
   * being built incrementally. To create a new one, you must pass an object
   * with the following properties:
   *
   *   - file: The filename of the generated source.
   *   - sourceRoot: An optional root for all URLs in this source map.
   */
  function SourceMapGenerator(aArgs) {
    this._file = util.getArg(aArgs, 'file');
    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = [];
    this._sourcesContents = null;
  }

  SourceMapGenerator.prototype._version = 3;

  /**
   * Creates a new SourceMapGenerator based on a SourceMapConsumer
   *
   * @param aSourceMapConsumer The SourceMap.
   */
  SourceMapGenerator.fromSourceMap =
    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
      var sourceRoot = aSourceMapConsumer.sourceRoot;
      var generator = new SourceMapGenerator({
        file: aSourceMapConsumer.file,
        sourceRoot: sourceRoot
      });
      aSourceMapConsumer.eachMapping(function (mapping) {
        var newMapping = {
          generated: {
            line: mapping.generatedLine,
            column: mapping.generatedColumn
          }
        };

        if (mapping.source) {
          newMapping.source = mapping.source;
          if (sourceRoot) {
            newMapping.source = util.relative(sourceRoot, newMapping.source);
          }

          newMapping.original = {
            line: mapping.originalLine,
            column: mapping.originalColumn
          };

          if (mapping.name) {
            newMapping.name = mapping.name;
          }
        }

        generator.addMapping(newMapping);
      });
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          generator.setSourceContent(sourceFile, content);
        }
      });
      return generator;
    };

  /**
   * Add a single mapping from original source line and column to the generated
   * source's line and column for this source map being created. The mapping
   * object should have the following properties:
   *
   *   - generated: An object with the generated line and column positions.
   *   - original: An object with the original line and column positions.
   *   - source: The original source file (relative to the sourceRoot).
   *   - name: An optional original token name for this mapping.
   */
  SourceMapGenerator.prototype.addMapping =
    function SourceMapGenerator_addMapping(aArgs) {
      var generated = util.getArg(aArgs, 'generated');
      var original = util.getArg(aArgs, 'original', null);
      var source = util.getArg(aArgs, 'source', null);
      var name = util.getArg(aArgs, 'name', null);

      this._validateMapping(generated, original, source, name);

      if (source && !this._sources.has(source)) {
        this._sources.add(source);
      }

      if (name && !this._names.has(name)) {
        this._names.add(name);
      }

      this._mappings.push({
        generatedLine: generated.line,
        generatedColumn: generated.column,
        originalLine: original != null && original.line,
        originalColumn: original != null && original.column,
        source: source,
        name: name
      });
    };

  /**
   * Set the source content for a source file.
   */
  SourceMapGenerator.prototype.setSourceContent =
    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
      var source = aSourceFile;
      if (this._sourceRoot) {
        source = util.relative(this._sourceRoot, source);
      }

      if (aSourceContent !== null) {
        // Add the source content to the _sourcesContents map.
        // Create a new _sourcesContents map if the property is null.
        if (!this._sourcesContents) {
          this._sourcesContents = {};
        }
        this._sourcesContents[util.toSetString(source)] = aSourceContent;
      } else {
        // Remove the source file from the _sourcesContents map.
        // If the _sourcesContents map is empty, set the property to null.
        delete this._sourcesContents[util.toSetString(source)];
        if (Object.keys(this._sourcesContents).length === 0) {
          this._sourcesContents = null;
        }
      }
    };

  /**
   * Applies the mappings of a sub-source-map for a specific source file to the
   * source map being generated. Each mapping to the supplied source file is
   * rewritten using the supplied source map. Note: The resolution for the
   * resulting mappings is the minimium of this map and the supplied map.
   *
   * @param aSourceMapConsumer The source map to be applied.
   * @param aSourceFile Optional. The filename of the source file.
   *        If omitted, SourceMapConsumer's file property will be used.
   */
  SourceMapGenerator.prototype.applySourceMap =
    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile) {
      // If aSourceFile is omitted, we will use the file property of the SourceMap
      if (!aSourceFile) {
        aSourceFile = aSourceMapConsumer.file;
      }
      var sourceRoot = this._sourceRoot;
      // Make "aSourceFile" relative if an absolute Url is passed.
      if (sourceRoot) {
        aSourceFile = util.relative(sourceRoot, aSourceFile);
      }
      // Applying the SourceMap can add and remove items from the sources and
      // the names array.
      var newSources = new ArraySet();
      var newNames = new ArraySet();

      // Find mappings for the "aSourceFile"
      this._mappings.forEach(function (mapping) {
        if (mapping.source === aSourceFile && mapping.originalLine) {
          // Check if it can be mapped by the source map, then update the mapping.
          var original = aSourceMapConsumer.originalPositionFor({
            line: mapping.originalLine,
            column: mapping.originalColumn
          });
          if (original.source !== null) {
            // Copy mapping
            if (sourceRoot) {
              mapping.source = util.relative(sourceRoot, original.source);
            } else {
              mapping.source = original.source;
            }
            mapping.originalLine = original.line;
            mapping.originalColumn = original.column;
            if (original.name !== null && mapping.name !== null) {
              // Only use the identifier name if it's an identifier
              // in both SourceMaps
              mapping.name = original.name;
            }
          }
        }

        var source = mapping.source;
        if (source && !newSources.has(source)) {
          newSources.add(source);
        }

        var name = mapping.name;
        if (name && !newNames.has(name)) {
          newNames.add(name);
        }

      }, this);
      this._sources = newSources;
      this._names = newNames;

      // Copy sourcesContents of applied map.
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          if (sourceRoot) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          this.setSourceContent(sourceFile, content);
        }
      }, this);
    };

  /**
   * A mapping can have one of the three levels of data:
   *
   *   1. Just the generated position.
   *   2. The Generated position, original position, and original source.
   *   3. Generated and original position, original source, as well as a name
   *      token.
   *
   * To maintain consistency, we validate that any new mapping being added falls
   * in to one of these categories.
   */
  SourceMapGenerator.prototype._validateMapping =
    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                aName) {
      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
          && aGenerated.line > 0 && aGenerated.column >= 0
          && !aOriginal && !aSource && !aName) {
        // Case 1.
        return;
      }
      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
               && aGenerated.line > 0 && aGenerated.column >= 0
               && aOriginal.line > 0 && aOriginal.column >= 0
               && aSource) {
        // Cases 2 and 3.
        return;
      }
      else {
        throw new Error('Invalid mapping: ' + JSON.stringify({
          generated: aGenerated,
          source: aSource,
          orginal: aOriginal,
          name: aName
        }));
      }
    };

  /**
   * Serialize the accumulated mappings in to the stream of base 64 VLQs
   * specified by the source map format.
   */
  SourceMapGenerator.prototype._serializeMappings =
    function SourceMapGenerator_serializeMappings() {
      var previousGeneratedColumn = 0;
      var previousGeneratedLine = 1;
      var previousOriginalColumn = 0;
      var previousOriginalLine = 0;
      var previousName = 0;
      var previousSource = 0;
      var result = '';
      var mapping;

      // The mappings must be guaranteed to be in sorted order before we start
      // serializing them or else the generated line numbers (which are defined
      // via the ';' separators) will be all messed up. Note: it might be more
      // performant to maintain the sorting as we insert them, rather than as we
      // serialize them, but the big O is the same either way.
      this._mappings.sort(util.compareByGeneratedPositions);

      for (var i = 0, len = this._mappings.length; i < len; i++) {
        mapping = this._mappings[i];

        if (mapping.generatedLine !== previousGeneratedLine) {
          previousGeneratedColumn = 0;
          while (mapping.generatedLine !== previousGeneratedLine) {
            result += ';';
            previousGeneratedLine++;
          }
        }
        else {
          if (i > 0) {
            if (!util.compareByGeneratedPositions(mapping, this._mappings[i - 1])) {
              continue;
            }
            result += ',';
          }
        }

        result += base64VLQ.encode(mapping.generatedColumn
                                   - previousGeneratedColumn);
        previousGeneratedColumn = mapping.generatedColumn;

        if (mapping.source) {
          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
                                     - previousSource);
          previousSource = this._sources.indexOf(mapping.source);

          // lines are stored 0-based in SourceMap spec version 3
          result += base64VLQ.encode(mapping.originalLine - 1
                                     - previousOriginalLine);
          previousOriginalLine = mapping.originalLine - 1;

          result += base64VLQ.encode(mapping.originalColumn
                                     - previousOriginalColumn);
          previousOriginalColumn = mapping.originalColumn;

          if (mapping.name) {
            result += base64VLQ.encode(this._names.indexOf(mapping.name)
                                       - previousName);
            previousName = this._names.indexOf(mapping.name);
          }
        }
      }

      return result;
    };

  SourceMapGenerator.prototype._generateSourcesContent =
    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
      return aSources.map(function (source) {
        if (!this._sourcesContents) {
          return null;
        }
        if (aSourceRoot) {
          source = util.relative(aSourceRoot, source);
        }
        var key = util.toSetString(source);
        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
                                                    key)
          ? this._sourcesContents[key]
          : null;
      }, this);
    };

  /**
   * Externalize the source map.
   */
  SourceMapGenerator.prototype.toJSON =
    function SourceMapGenerator_toJSON() {
      var map = {
        version: this._version,
        file: this._file,
        sources: this._sources.toArray(),
        names: this._names.toArray(),
        mappings: this._serializeMappings()
      };
      if (this._sourceRoot) {
        map.sourceRoot = this._sourceRoot;
      }
      if (this._sourcesContents) {
        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
      }

      return map;
    };

  /**
   * Render the source map being generated to a string.
   */
  SourceMapGenerator.prototype.toString =
    function SourceMapGenerator_toString() {
      return JSON.stringify(this);
    };

  exports.SourceMapGenerator = SourceMapGenerator;

});

},{"./array-set":22,"./base64-vlq":23,"./util":29,"amdefine":30}],28:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
  var util = require('./util');

  /**
   * SourceNodes provide a way to abstract over interpolating/concatenating
   * snippets of generated JavaScript source code while maintaining the line and
   * column information associated with the original source code.
   *
   * @param aLine The original line number.
   * @param aColumn The original column number.
   * @param aSource The original source's filename.
   * @param aChunks Optional. An array of strings which are snippets of
   *        generated JS, or other SourceNodes.
   * @param aName The original identifier.
   */
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine === undefined ? null : aLine;
    this.column = aColumn === undefined ? null : aColumn;
    this.source = aSource === undefined ? null : aSource;
    this.name = aName === undefined ? null : aName;
    if (aChunks != null) this.add(aChunks);
  }

  /**
   * Creates a SourceNode from generated code and a SourceMapConsumer.
   *
   * @param aGeneratedCode The generated code
   * @param aSourceMapConsumer The SourceMap for the generated code
   */
  SourceNode.fromStringWithSourceMap =
    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer) {
      // The SourceNode we want to fill with the generated code
      // and the SourceMap
      var node = new SourceNode();

      // The generated code
      // Processed fragments are removed from this array.
      var remainingLines = aGeneratedCode.split('\n');

      // We need to remember the position of "remainingLines"
      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

      // The generate SourceNodes we need a code range.
      // To extract it current and last mapping is used.
      // Here we store the last mapping.
      var lastMapping = null;

      aSourceMapConsumer.eachMapping(function (mapping) {
        if (lastMapping === null) {
          // We add the generated code until the first mapping
          // to the SourceNode without any mapping.
          // Each line is added as separate string.
          while (lastGeneratedLine < mapping.generatedLine) {
            node.add(remainingLines.shift() + "\n");
            lastGeneratedLine++;
          }
          if (lastGeneratedColumn < mapping.generatedColumn) {
            var nextLine = remainingLines[0];
            node.add(nextLine.substr(0, mapping.generatedColumn));
            remainingLines[0] = nextLine.substr(mapping.generatedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
          }
        } else {
          // We add the code from "lastMapping" to "mapping":
          // First check if there is a new line in between.
          if (lastGeneratedLine < mapping.generatedLine) {
            var code = "";
            // Associate full lines with "lastMapping"
            do {
              code += remainingLines.shift() + "\n";
              lastGeneratedLine++;
              lastGeneratedColumn = 0;
            } while (lastGeneratedLine < mapping.generatedLine);
            // When we reached the correct line, we add code until we
            // reach the correct column too.
            if (lastGeneratedColumn < mapping.generatedColumn) {
              var nextLine = remainingLines[0];
              code += nextLine.substr(0, mapping.generatedColumn);
              remainingLines[0] = nextLine.substr(mapping.generatedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
            }
            // Create the SourceNode.
            addMappingWithCode(lastMapping, code);
          } else {
            // There is no new line in between.
            // Associate the code between "lastGeneratedColumn" and
            // "mapping.generatedColumn" with "lastMapping"
            var nextLine = remainingLines[0];
            var code = nextLine.substr(0, mapping.generatedColumn -
                                          lastGeneratedColumn);
            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                                lastGeneratedColumn);
            lastGeneratedColumn = mapping.generatedColumn;
            addMappingWithCode(lastMapping, code);
          }
        }
        lastMapping = mapping;
      }, this);
      // We have processed all mappings.
      // Associate the remaining code in the current line with "lastMapping"
      // and add the remaining lines without any mapping
      addMappingWithCode(lastMapping, remainingLines.join("\n"));

      // Copy sourcesContent into SourceNode
      aSourceMapConsumer.sources.forEach(function (sourceFile) {
        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
        if (content) {
          node.setSourceContent(sourceFile, content);
        }
      });

      return node;

      function addMappingWithCode(mapping, code) {
        if (mapping === null || mapping.source === undefined) {
          node.add(code);
        } else {
          node.add(new SourceNode(mapping.originalLine,
                                  mapping.originalColumn,
                                  mapping.source,
                                  code,
                                  mapping.name));
        }
      }
    };

  /**
   * Add a chunk of generated JS to this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function (chunk) {
        this.add(chunk);
      }, this);
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Add a chunk of generated JS to the beginning of this source node.
   *
   * @param aChunk A string snippet of generated JS code, another instance of
   *        SourceNode, or an array where each member is one of those things.
   */
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length-1; i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    }
    else if (aChunk instanceof SourceNode || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    }
    else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };

  /**
   * Walk over the tree of JS snippets in this node and its children. The
   * walking function is called once for each snippet of JS and is passed that
   * snippet and the its original associated source's line/column location.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length; i < len; i++) {
      chunk = this.children[i];
      if (chunk instanceof SourceNode) {
        chunk.walk(aFn);
      }
      else {
        if (chunk !== '') {
          aFn(chunk, { source: this.source,
                       line: this.line,
                       column: this.column,
                       name: this.name });
        }
      }
    }
  };

  /**
   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
   * each of `this.children`.
   *
   * @param aSep The separator.
   */
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0; i < len-1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };

  /**
   * Call String.prototype.replace on the very right-most source snippet. Useful
   * for trimming whitespace from the end of a source node, etc.
   *
   * @param aPattern The pattern to replace.
   * @param aReplacement The thing to replace the pattern with.
   */
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild instanceof SourceNode) {
      lastChild.replaceRight(aPattern, aReplacement);
    }
    else if (typeof lastChild === 'string') {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    }
    else {
      this.children.push(''.replace(aPattern, aReplacement));
    }
    return this;
  };

  /**
   * Set the source content for a source file. This will be added to the SourceMapGenerator
   * in the sourcesContent field.
   *
   * @param aSourceFile The filename of the source file
   * @param aSourceContent The content of the source file
   */
  SourceNode.prototype.setSourceContent =
    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
    };

  /**
   * Walk over the tree of SourceNodes. The walking function is called for each
   * source file content and is passed the filename and source content.
   *
   * @param aFn The traversal function.
   */
  SourceNode.prototype.walkSourceContents =
    function SourceNode_walkSourceContents(aFn) {
      for (var i = 0, len = this.children.length; i < len; i++) {
        if (this.children[i] instanceof SourceNode) {
          this.children[i].walkSourceContents(aFn);
        }
      }

      var sources = Object.keys(this.sourceContents);
      for (var i = 0, len = sources.length; i < len; i++) {
        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
      }
    };

  /**
   * Return the string representation of this source node. Walks over the tree
   * and concatenates all the various snippets together to one string.
   */
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function (chunk) {
      str += chunk;
    });
    return str;
  };

  /**
   * Returns the string representation of this source node along with a source
   * map.
   */
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function (chunk, original) {
      generated.code += chunk;
      if (original.source !== null
          && original.line !== null
          && original.column !== null) {
        if(lastOriginalSource !== original.source
           || lastOriginalLine !== original.line
           || lastOriginalColumn !== original.column
           || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      chunk.split('').forEach(function (ch) {
        if (ch === '\n') {
          generated.line++;
          generated.column = 0;
        } else {
          generated.column++;
        }
      });
    });
    this.walkSourceContents(function (sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });

    return { code: generated.code, map: map };
  };

  exports.SourceNode = SourceNode;

});

},{"./source-map-generator":27,"./util":29,"amdefine":30}],29:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
if (typeof define !== 'function') {
    var define = require('amdefine')(module, require);
}
define(function (require, exports, module) {

  /**
   * This is a helper function for getting values from parameter/options
   * objects.
   *
   * @param args The object we are extracting values from
   * @param name The name of the property we are getting.
   * @param defaultValue An optional value to return if the property is missing
   * from the object. If this is not specified and the property is missing, an
   * error will be thrown.
   */
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;

  var urlRegexp = /([\w+\-.]+):\/\/((\w+:\w+)@)?([\w.]+)?(:(\d+))?(\S+)?/;
  var dataUrlRegexp = /^data:.+\,.+/;

  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[3],
      host: match[4],
      port: match[6],
      path: match[7]
    };
  }
  exports.urlParse = urlParse;

  function urlGenerate(aParsedUrl) {
    var url = aParsedUrl.scheme + "://";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@"
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;

  function join(aRoot, aPath) {
    var url;

    if (aPath.match(urlRegexp) || aPath.match(dataUrlRegexp)) {
      return aPath;
    }

    if (aPath.charAt(0) === '/' && (url = urlParse(aRoot))) {
      url.path = aPath;
      return urlGenerate(url);
    }

    return aRoot.replace(/\/$/, '') + '/' + aPath;
  }
  exports.join = join;

  /**
   * Because behavior goes wacky when you set `__proto__` on objects, we
   * have to prefix all the strings in our set with an arbitrary character.
   *
   * See https://github.com/mozilla/source-map/pull/31 and
   * https://github.com/mozilla/source-map/issues/30
   *
   * @param String aStr
   */
  function toSetString(aStr) {
    return '$' + aStr;
  }
  exports.toSetString = toSetString;

  function fromSetString(aStr) {
    return aStr.substr(1);
  }
  exports.fromSetString = fromSetString;

  function relative(aRoot, aPath) {
    aRoot = aRoot.replace(/\/$/, '');

    var url = urlParse(aRoot);
    if (aPath.charAt(0) == "/" && url && url.path == "/") {
      return aPath.slice(1);
    }

    return aPath.indexOf(aRoot + '/') === 0
      ? aPath.substr(aRoot.length + 1)
      : aPath;
  }
  exports.relative = relative;

  function strcmp(aStr1, aStr2) {
    var s1 = aStr1 || "";
    var s2 = aStr2 || "";
    return (s1 > s2) - (s1 < s2);
  }

  /**
   * Comparator between two mappings where the original positions are compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same original source/line/column, but different generated
   * line and column the same. Useful when searching for a mapping with a
   * stubbed out mapping.
   */
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp;

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp || onlyCompareOriginal) {
      return cmp;
    }

    cmp = strcmp(mappingA.name, mappingB.name);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    return mappingA.generatedColumn - mappingB.generatedColumn;
  };
  exports.compareByOriginalPositions = compareByOriginalPositions;

  /**
   * Comparator between two mappings where the generated positions are
   * compared.
   *
   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
   * mappings with the same generated line and column, but different
   * source/name/original line and column the same. Useful when searching for a
   * mapping with a stubbed out mapping.
   */
  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
    var cmp;

    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp || onlyCompareGenerated) {
      return cmp;
    }

    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp) {
      return cmp;
    }

    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp) {
      return cmp;
    }

    return strcmp(mappingA.name, mappingB.name);
  };
  exports.compareByGeneratedPositions = compareByGeneratedPositions;

});

},{"amdefine":30}],30:[function(require,module,exports){
var process=require("__browserify_process"),__filename="/node_modules/wisp/node_modules/escodegen/node_modules/source-map/node_modules/amdefine/amdefine.js";/** vim: et:ts=4:sw=4:sts=4
 * @license amdefine 0.1.0 Copyright (c) 2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/amdefine for details
 */

/*jslint node: true */
/*global module, process */
'use strict';

/**
 * Creates a define for node.
 * @param {Object} module the "module" object that is defined by Node for the
 * current module.
 * @param {Function} [requireFn]. Node's require function for the current module.
 * It only needs to be passed in Node versions before 0.5, when module.require
 * did not exist.
 * @returns {Function} a define function that is usable for the current node
 * module.
 */
function amdefine(module, requireFn) {
    'use strict';
    var defineCache = {},
        loaderCache = {},
        alreadyCalled = false,
        path = require('path'),
        makeRequire, stringRequire;

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots(ary) {
        var i, part;
        for (i = 0; ary[i]; i+= 1) {
            part = ary[i];
            if (part === '.') {
                ary.splice(i, 1);
                i -= 1;
            } else if (part === '..') {
                if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                    //End of the line. Keep at least one non-dot
                    //path segment at the front so it can be mapped
                    //correctly to disk. Otherwise, there is likely
                    //no path mapping for a path starting with '..'.
                    //This can still fail, but catches the most reasonable
                    //uses of ..
                    break;
                } else if (i > 0) {
                    ary.splice(i - 1, 2);
                    i -= 2;
                }
            }
        }
    }

    function normalize(name, baseName) {
        var baseParts;

        //Adjust any relative paths.
        if (name && name.charAt(0) === '.') {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                baseParts = baseName.split('/');
                baseParts = baseParts.slice(0, baseParts.length - 1);
                baseParts = baseParts.concat(name.split('/'));
                trimDots(baseParts);
                name = baseParts.join('/');
            }
        }

        return name;
    }

    /**
     * Create the normalize() function passed to a loader plugin's
     * normalize method.
     */
    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(id) {
        function load(value) {
            loaderCache[id] = value;
        }

        load.fromText = function (id, text) {
            //This one is difficult because the text can/probably uses
            //define, and any relative paths and requires should be relative
            //to that id was it would be found on disk. But this would require
            //bootstrapping a module/require fairly deeply from node core.
            //Not sure how best to go about that yet.
            throw new Error('amdefine does not implement load.fromText');
        };

        return load;
    }

    makeRequire = function (systemRequire, exports, module, relId) {
        function amdRequire(deps, callback) {
            if (typeof deps === 'string') {
                //Synchronous, single module require('')
                return stringRequire(systemRequire, exports, module, deps, relId);
            } else {
                //Array of dependencies with a callback.

                //Convert the dependencies to modules.
                deps = deps.map(function (depName) {
                    return stringRequire(systemRequire, exports, module, depName, relId);
                });

                //Wait for next tick to call back the require call.
                process.nextTick(function () {
                    callback.apply(null, deps);
                });
            }
        }

        amdRequire.toUrl = function (filePath) {
            if (filePath.indexOf('.') === 0) {
                return normalize(filePath, path.dirname(module.filename));
            } else {
                return filePath;
            }
        };

        return amdRequire;
    };

    //Favor explicit value, passed in if the module wants to support Node 0.4.
    requireFn = requireFn || function req() {
        return module.require.apply(module, arguments);
    };

    function runFactory(id, deps, factory) {
        var r, e, m, result;

        if (id) {
            e = loaderCache[id] = {};
            m = {
                id: id,
                uri: __filename,
                exports: e
            };
            r = makeRequire(requireFn, e, m, id);
        } else {
            //Only support one define call per file
            if (alreadyCalled) {
                throw new Error('amdefine with no module ID cannot be called more than once per file.');
            }
            alreadyCalled = true;

            //Use the real variables from node
            //Use module.exports for exports, since
            //the exports in here is amdefine exports.
            e = module.exports;
            m = module;
            r = makeRequire(requireFn, e, m, module.id);
        }

        //If there are dependencies, they are strings, so need
        //to convert them to dependency values.
        if (deps) {
            deps = deps.map(function (depName) {
                return r(depName);
            });
        }

        //Call the factory with the right dependencies.
        if (typeof factory === 'function') {
            result = factory.apply(m.exports, deps);
        } else {
            result = factory;
        }

        if (result !== undefined) {
            m.exports = result;
            if (id) {
                loaderCache[id] = m.exports;
            }
        }
    }

    stringRequire = function (systemRequire, exports, module, id, relId) {
        //Split the ID by a ! so that
        var index = id.indexOf('!'),
            originalId = id,
            prefix, plugin;

        if (index === -1) {
            id = normalize(id, relId);

            //Straight module lookup. If it is one of the special dependencies,
            //deal with it, otherwise, delegate to node.
            if (id === 'require') {
                return makeRequire(systemRequire, exports, module, relId);
            } else if (id === 'exports') {
                return exports;
            } else if (id === 'module') {
                return module;
            } else if (loaderCache.hasOwnProperty(id)) {
                return loaderCache[id];
            } else if (defineCache[id]) {
                runFactory.apply(null, defineCache[id]);
                return loaderCache[id];
            } else {
                if(systemRequire) {
                    return systemRequire(originalId);
                } else {
                    throw new Error('No module with ID: ' + id);
                }
            }
        } else {
            //There is a plugin in play.
            prefix = id.substring(0, index);
            id = id.substring(index + 1, id.length);

            plugin = stringRequire(systemRequire, exports, module, prefix, relId);

            if (plugin.normalize) {
                id = plugin.normalize(id, makeNormalize(relId));
            } else {
                //Normalize the ID normally.
                id = normalize(id, relId);
            }

            if (loaderCache[id]) {
                return loaderCache[id];
            } else {
                plugin.load(id, makeRequire(systemRequire, exports, module, relId), makeLoad(id), {});

                return loaderCache[id];
            }
        }
    };

    //Create a define function specific to the module asking for amdefine.
    function define(id, deps, factory) {
        if (Array.isArray(id)) {
            factory = deps;
            deps = id;
            id = undefined;
        } else if (typeof id !== 'string') {
            factory = id;
            id = deps = undefined;
        }

        if (deps && !Array.isArray(deps)) {
            factory = deps;
            deps = undefined;
        }

        if (!deps) {
            deps = ['require', 'exports', 'module'];
        }

        //Set up properties for this module. If an ID, then use
        //internal cache. If no ID, then use the external variables
        //for this node module.
        if (id) {
            //Put the module in deep freeze until there is a
            //require call for it.
            defineCache[id] = [id, deps, factory];
        } else {
            runFactory(id, deps, factory);
        }
    }

    //define.require, which has access to all the values in the
    //cache. Useful for AMD modules that all have IDs in the file,
    //but need to finally export a value to node based on one of those
    //IDs.
    define.require = function (id) {
        if (loaderCache[id]) {
            return loaderCache[id];
        }

        if (defineCache[id]) {
            runFactory.apply(null, defineCache[id]);
            return loaderCache[id];
        }
    };

    define.amd = {};

    return define;
}

module.exports = amdefine;

},{"__browserify_process":4,"path":5}],31:[function(require,module,exports){
module.exports={
  "name": "escodegen",
  "description": "ECMAScript code generator",
  "homepage": "http://github.com/Constellation/escodegen",
  "main": "escodegen.js",
  "bin": {
    "esgenerate": "./bin/esgenerate.js",
    "escodegen": "./bin/escodegen.js"
  },
  "version": "1.0.2-dev",
  "engines": {
    "node": ">=0.4.0"
  },
  "maintainers": [
    {
      "name": "Yusuke Suzuki",
      "email": "utatane.tea@gmail.com",
      "url": "http://github.com/Constellation"
    }
  ],
  "repository": {
    "type": "git",
    "url": "http://github.com/Constellation/escodegen.git"
  },
  "dependencies": {
    "esprima": "~1.0.4",
    "estraverse": "~1.5.0",
    "esutils": "~1.0.0",
    "source-map": "~0.1.30"
  },
  "optionalDependencies": {
    "source-map": "~0.1.30"
  },
  "devDependencies": {
    "esprima-moz": "*",
    "commonjs-everywhere": "~0.8.0",
    "q": "*",
    "bower": "*",
    "semver": "*",
    "chai": "~1.7.2",
    "grunt-contrib-jshint": "~0.5.0",
    "grunt-cli": "~0.1.9",
    "grunt": "~0.4.1",
    "grunt-mocha-test": "~0.6.2"
  },
  "licenses": [
    {
      "type": "BSD",
      "url": "http://github.com/Constellation/escodegen/raw/master/LICENSE.BSD"
    }
  ],
  "scripts": {
    "test": "grunt travis",
    "unit-test": "grunt test",
    "lint": "grunt lint",
    "release": "node tools/release.js",
    "build-min": "./node_modules/.bin/cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
    "build": "./node_modules/.bin/cjsify -a path: tools/entry-point.js > escodegen.browser.js"
  },
  "readme": "\n### Escodegen [![Build Status](https://secure.travis-ci.org/Constellation/escodegen.png)](http://travis-ci.org/Constellation/escodegen) [![Build Status](https://drone.io/github.com/Constellation/escodegen/status.png)](https://drone.io/github.com/Constellation/escodegen/latest)\n\nEscodegen ([escodegen](http://github.com/Constellation/escodegen)) is\n[ECMAScript](http://www.ecma-international.org/publications/standards/Ecma-262.htm)\n(also popularly known as [JavaScript](http://en.wikipedia.org/wiki/JavaScript>JavaScript))\ncode generator from [Parser API](https://developer.mozilla.org/en/SpiderMonkey/Parser_API) AST.\nSee [online generator demo](http://constellation.github.com/escodegen/demo/index.html).\n\n\n### Install\n\nEscodegen can be used in a web browser:\n\n    <script src=\"escodegen.browser.js\"></script>\n\nescodegen.browser.js is found in tagged-revision. See Tags on GitHub.\n\nOr in a Node.js application via the package manager:\n\n    npm install escodegen\n\n### Usage\n\nA simple example: the program\n\n    escodegen.generate({\n        type: 'BinaryExpression',\n        operator: '+',\n        left: { type: 'Literal', value: 40 },\n        right: { type: 'Literal', value: 2 }\n    });\n\nproduces the string `'40 + 2'`\n\nSee the [API page](https://github.com/Constellation/escodegen/wiki/API) for\noptions. To run the tests, execute `npm test` in the root directory.\n\n### License\n\n#### Escodegen\n\nCopyright (C) 2012 [Yusuke Suzuki](http://github.com/Constellation)\n (twitter: [@Constellation](http://twitter.com/Constellation)) and other contributors.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n  * Redistributions of source code must retain the above copyright\n    notice, this list of conditions and the following disclaimer.\n\n  * Redistributions in binary form must reproduce the above copyright\n    notice, this list of conditions and the following disclaimer in the\n    documentation and/or other materials provided with the distribution.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\"\nAND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\nIMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\nARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY\nDIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES\n(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;\nLOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND\nON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF\nTHIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n\n#### source-map\n\nSourceNodeMocks has a limited interface of mozilla/source-map SourceNode implementations.\n\nCopyright (c) 2009-2011, Mozilla Foundation and contributors\nAll rights reserved.\n\nRedistribution and use in source and binary forms, with or without\nmodification, are permitted provided that the following conditions are met:\n\n* Redistributions of source code must retain the above copyright notice, this\n  list of conditions and the following disclaimer.\n\n* Redistributions in binary form must reproduce the above copyright notice,\n  this list of conditions and the following disclaimer in the documentation\n  and/or other materials provided with the distribution.\n\n* Neither the names of the Mozilla Foundation nor the names of project\n  contributors may be used to endorse or promote products derived from this\n  software without specific prior written permission.\n\nTHIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND\nANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED\nWARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE\nDISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE\nFOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\nDAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR\nSERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER\nCAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,\nOR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\nOF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n",
  "readmeFilename": "README.md",
  "bugs": {
    "url": "https://github.com/Constellation/escodegen/issues"
  },
  "_id": "escodegen@1.0.2-dev",
  "dist": {
    "shasum": "24e0bd423166af81b9eaa3ad77243ea63f1f0de0"
  },
  "_resolved": "git://github.com/Constellation/escodegen.git#efed3e21a5d2545d6050c867422ee027a0b7a9cf",
  "_from": "escodegen@git://github.com/Constellation/escodegen.git#master"
}

},{}],32:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.reader',
            doc: 'Reader module provides functions for reading text input\n  as wisp data structures'
        };
    var wisp_sequence = require('./sequence');
    var list = wisp_sequence.list;
    var isList = wisp_sequence.isList;
    var count = wisp_sequence.count;
    var isEmpty = wisp_sequence.isEmpty;
    var first = wisp_sequence.first;
    var second = wisp_sequence.second;
    var third = wisp_sequence.third;
    var rest = wisp_sequence.rest;
    var map = wisp_sequence.map;
    var vec = wisp_sequence.vec;
    var cons = wisp_sequence.cons;
    var conj = wisp_sequence.conj;
    var rest = wisp_sequence.rest;
    var concat = wisp_sequence.concat;
    var last = wisp_sequence.last;
    var butlast = wisp_sequence.butlast;
    var sort = wisp_sequence.sort;
    var lazySeq = wisp_sequence.lazySeq;
    var reduce = wisp_sequence.reduce;
    var wisp_runtime = require('./runtime');
    var isOdd = wisp_runtime.isOdd;
    var dictionary = wisp_runtime.dictionary;
    var keys = wisp_runtime.keys;
    var isNil = wisp_runtime.isNil;
    var inc = wisp_runtime.inc;
    var dec = wisp_runtime.dec;
    var isVector = wisp_runtime.isVector;
    var isString = wisp_runtime.isString;
    var isNumber = wisp_runtime.isNumber;
    var isBoolean = wisp_runtime.isBoolean;
    var isObject = wisp_runtime.isObject;
    var isDictionary = wisp_runtime.isDictionary;
    var rePattern = wisp_runtime.rePattern;
    var reMatches = wisp_runtime.reMatches;
    var reFind = wisp_runtime.reFind;
    var str = wisp_runtime.str;
    var subs = wisp_runtime.subs;
    var char = wisp_runtime.char;
    var vals = wisp_runtime.vals;
    var isEqual = wisp_runtime.isEqual;
    var wisp_ast = require('./ast');
    var isSymbol = wisp_ast.isSymbol;
    var symbol = wisp_ast.symbol;
    var isKeyword = wisp_ast.isKeyword;
    var keyword = wisp_ast.keyword;
    var meta = wisp_ast.meta;
    var withMeta = wisp_ast.withMeta;
    var name = wisp_ast.name;
    var gensym = wisp_ast.gensym;
    var wisp_string = require('./string');
    var split = wisp_string.split;
    var join = wisp_string.join;
}
var pushBackReader = exports.pushBackReader = function pushBackReader(source, uri) {
        return {
            'lines': split(source, '\n'),
            'buffer': '',
            'uri': uri,
            'column': -1,
            'line': 0
        };
    };
var peekChar = exports.peekChar = function peekChar(reader) {
        return function () {
            var lineø1 = (reader || 0)['lines'][(reader || 0)['line']];
            var columnø1 = inc((reader || 0)['column']);
            return isNil(lineø1) ? void 0 : lineø1[columnø1] || '\n';
        }.call(this);
    };
var readChar = exports.readChar = function readChar(reader) {
        return function () {
            var chø1 = peekChar(reader);
            isNewline(peekChar(reader)) ? (function () {
                (reader || 0)['line'] = inc((reader || 0)['line']);
                return (reader || 0)['column'] = -1;
            })() : (reader || 0)['column'] = inc((reader || 0)['column']);
            return chø1;
        }.call(this);
    };
var isNewline = exports.isNewline = function isNewline(ch) {
        return '\n' === ch;
    };
var isBreakingWhitespace = exports.isBreakingWhitespace = function isBreakingWhitespace(ch) {
        return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
    };
var isWhitespace = exports.isWhitespace = function isWhitespace(ch) {
        return isBreakingWhitespace(ch) || ',' === ch;
    };
var isNumeric = exports.isNumeric = function isNumeric(ch) {
        return ch === '0' || ch === '1' || ch === '2' || ch === '3' || ch === '4' || ch === '5' || ch === '6' || ch === '7' || ch === '8' || ch === '9';
    };
var isCommentPrefix = exports.isCommentPrefix = function isCommentPrefix(ch) {
        return ';' === ch;
    };
var isNumberLiteral = exports.isNumberLiteral = function isNumberLiteral(reader, initch) {
        return isNumeric(initch) || ('+' === initch || '-' === initch) && isNumeric(peekChar(reader));
    };
var readerError = exports.readerError = function readerError(reader, message) {
        return function () {
            var textø1 = '' + message + '\n' + 'line:' + (reader || 0)['line'] + '\n' + 'column:' + (reader || 0)['column'];
            var errorø1 = SyntaxError(textø1, (reader || 0)['uri']);
            errorø1.line = (reader || 0)['line'];
            errorø1.column = (reader || 0)['column'];
            errorø1.uri = (reader || 0)['uri'];
            return (function () {
                throw errorø1;
            })();
        }.call(this);
    };
var isMacroTerminating = exports.isMacroTerminating = function isMacroTerminating(ch) {
        return !(ch === '#') && !(ch === '\'') && !(ch === ':') && macros(ch);
    };
var readToken = exports.readToken = function readToken(reader, initch) {
        return function loop() {
            var recur = loop;
            var bufferø1 = initch;
            var chø1 = peekChar(reader);
            do {
                recur = isNil(chø1) || isWhitespace(chø1) || isMacroTerminating(chø1) ? bufferø1 : (loop[0] = '' + bufferø1 + readChar(reader), loop[1] = peekChar(reader), loop);
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var skipLine = exports.skipLine = function skipLine(reader, _) {
        return function loop() {
            var recur = loop;
            do {
                recur = function () {
                    var chø1 = readChar(reader);
                    return chø1 === '\n' || chø1 === '\r' || isNil(chø1) ? reader : (loop);
                }.call(this);
            } while (recur === loop);
            return recur;
        }.call(this);
    };
var intPattern = exports.intPattern = rePattern('^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+)|0[0-9]+)(N)?$');
var ratioPattern = exports.ratioPattern = rePattern('([-+]?[0-9]+)/([0-9]+)');
var floatPattern = exports.floatPattern = rePattern('([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?');
var matchInt = exports.matchInt = function matchInt(s) {
        return function () {
            var groupsø1 = reFind(intPattern, s);
            var group3ø1 = groupsø1[2];
            return !(isNil(group3ø1) || count(group3ø1) < 1) ? 0 : function () {
                var negateø1 = '-' === groupsø1[1] ? -1 : 1;
                var aø1 = groupsø1[3] ? [
                        groupsø1[3],
                        10
                    ] : groupsø1[4] ? [
                        groupsø1[4],
                        16
                    ] : groupsø1[5] ? [
                        groupsø1[5],
                        8
                    ] : groupsø1[7] ? [
                        groupsø1[7],
                        parseInt(groupsø1[7])
                    ] : 'else' ? [
                        void 0,
                        void 0
                    ] : void 0;
                var nø1 = aø1[0];
                var radixø1 = aø1[1];
                return isNil(nø1) ? void 0 : negateø1 * parseInt(nø1, radixø1);
            }.call(this);
        }.call(this);
    };
var matchRatio = exports.matchRatio = function matchRatio(s) {
        return function () {
            var groupsø1 = reFind(ratioPattern, s);
            var numinatorø1 = groupsø1[1];
            var denominatorø1 = groupsø1[2];
            return parseInt(numinatorø1) / parseInt(denominatorø1);
        }.call(this);
    };
var matchFloat = exports.matchFloat = function matchFloat(s) {
        return parseFloat(s);
    };
var matchNumber = exports.matchNumber = function matchNumber(s) {
        return reMatches(intPattern, s) ? matchInt(s) : reMatches(ratioPattern, s) ? matchRatio(s) : reMatches(floatPattern, s) ? matchFloat(s) : void 0;
    };
var escapeCharMap = exports.escapeCharMap = function escapeCharMap(c) {
        return c === 't' ? '\t' : c === 'r' ? '\r' : c === 'n' ? '\n' : c === '\\' ? '\\' : c === '"' ? '"' : c === 'b' ? '\b' : c === 'f' ? '\f' : 'else' ? void 0 : void 0;
    };
var read2Chars = exports.read2Chars = function read2Chars(reader) {
        return '' + readChar(reader) + readChar(reader);
    };
var read4Chars = exports.read4Chars = function read4Chars(reader) {
        return '' + readChar(reader) + readChar(reader) + readChar(reader) + readChar(reader);
    };
var unicode2Pattern = exports.unicode2Pattern = rePattern('[0-9A-Fa-f]{2}');
var unicode4Pattern = exports.unicode4Pattern = rePattern('[0-9A-Fa-f]{4}');
var validateUnicodeEscape = exports.validateUnicodeEscape = function validateUnicodeEscape(unicodePattern, reader, escapeChar, unicodeStr) {
        return reMatches(unicodePattern, unicodeStr) ? unicodeStr : readerError(reader, '' + 'Unexpected unicode escape ' + '\\' + escapeChar + unicodeStr);
    };
var makeUnicodeChar = exports.makeUnicodeChar = function makeUnicodeChar(codeStr, base) {
        return function () {
            var baseø2 = base || 16;
            var codeø1 = parseInt(codeStr, baseø2);
            return char(codeø1);
        }.call(this);
    };
var escapeChar = exports.escapeChar = function escapeChar(buffer, reader) {
        return function () {
            var chø1 = readChar(reader);
            var mapresultø1 = escapeCharMap(chø1);
            return mapresultø1 ? mapresultø1 : chø1 === 'x' ? makeUnicodeChar(validateUnicodeEscape(unicode2Pattern, reader, chø1, read2Chars(reader))) : chø1 === 'u' ? makeUnicodeChar(validateUnicodeEscape(unicode4Pattern, reader, chø1, read4Chars(reader))) : isNumeric(chø1) ? char(chø1) : 'else' ? readerError(reader, '' + 'Unexpected unicode escape ' + '\\' + chø1) : void 0;
        }.call(this);
    };
var readPast = exports.readPast = function readPast(predicate, reader) {
        return function loop() {
            var recur = loop;
            var _ø1 = void 0;
            do {
                recur = predicate(peekChar(reader)) ? (loop[0] = readChar(reader), loop) : peekChar(reader);
            } while (_ø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    };
var readDelimitedList = exports.readDelimitedList = function readDelimitedList(delim, reader, isRecursive) {
        return function loop() {
            var recur = loop;
            var formsø1 = [];
            do {
                recur = function () {
                    var _ø1 = readPast(isWhitespace, reader);
                    var chø1 = readChar(reader);
                    !chø1 ? readerError(reader, 'EOF') : void 0;
                    return delim === chø1 ? formsø1 : function () {
                        var formø1 = readForm(reader, chø1);
                        return loop[0] = formø1 === reader ? formsø1 : conj(formsø1, formø1), loop;
                    }.call(this);
                }.call(this);
            } while (formsø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    };
var notImplemented = exports.notImplemented = function notImplemented(reader, ch) {
        return readerError(reader, '' + 'Reader for ' + ch + ' not implemented yet');
    };
var readDispatch = exports.readDispatch = function readDispatch(reader, _) {
        return function () {
            var chø1 = readChar(reader);
            var dmø1 = dispatchMacros(chø1);
            return dmø1 ? dmø1(reader, _) : function () {
                var objectø1 = maybeReadTaggedType(reader, chø1);
                return objectø1 ? objectø1 : readerError(reader, 'No dispatch macro for ', chø1);
            }.call(this);
        }.call(this);
    };
var readUnmatchedDelimiter = exports.readUnmatchedDelimiter = function readUnmatchedDelimiter(rdr, ch) {
        return readerError(rdr, 'Unmached delimiter ', ch);
    };
var readList = exports.readList = function readList(reader, _) {
        return function () {
            var formø1 = readDelimitedList(')', reader, true);
            return withMeta(list.apply(void 0, formø1), meta(formø1));
        }.call(this);
    };
var readComment = exports.readComment = function readComment(reader, _) {
        return function loop() {
            var recur = loop;
            var bufferø1 = '';
            var chø1 = readChar(reader);
            do {
                recur = isNil(chø1) || '\n' === chø1 ? reader || list(symbol(void 0, 'comment'), bufferø1) : '\\' === chø1 ? (loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop) : 'else' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var readVector = exports.readVector = function readVector(reader) {
        return readDelimitedList(']', reader, true);
    };
var readMap = exports.readMap = function readMap(reader) {
        return function () {
            var formø1 = readDelimitedList('}', reader, true);
            return isOdd(count(formø1)) ? readerError(reader, 'Map literal must contain an even number of forms') : withMeta(dictionary.apply(void 0, formø1), meta(formø1));
        }.call(this);
    };
var readSet = exports.readSet = function readSet(reader, _) {
        return function () {
            var formø1 = readDelimitedList('}', reader, true);
            return withMeta(concat([symbol(void 0, 'set')], formø1), meta(formø1));
        }.call(this);
    };
var readNumber = exports.readNumber = function readNumber(reader, initch) {
        return function loop() {
            var recur = loop;
            var bufferø1 = initch;
            var chø1 = peekChar(reader);
            do {
                recur = isNil(chø1) || isWhitespace(chø1) || macros(chø1) ? (function () {
                    var match = matchNumber(bufferø1);
                    return isNil(match) ? readerError(reader, 'Invalid number format [', bufferø1, ']') : new Number(match);
                })() : (loop[0] = '' + bufferø1 + readChar(reader), loop[1] = peekChar(reader), loop);
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var readString = exports.readString = function readString(reader) {
        return function loop() {
            var recur = loop;
            var bufferø1 = '';
            var chø1 = readChar(reader);
            do {
                recur = isNil(chø1) ? readerError(reader, 'EOF while reading string') : '\\' === chø1 ? (loop[0] = '' + bufferø1 + escapeChar(bufferø1, reader), loop[1] = readChar(reader), loop) : '"' === chø1 ? new String(bufferø1) : 'default' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var readCharacter = exports.readCharacter = function readCharacter(reader) {
        return new String(readChar(reader));
    };
var readUnquote = exports.readUnquote = function readUnquote(reader) {
        return function () {
            var chø1 = peekChar(reader);
            return !chø1 ? readerError(reader, 'EOF while reading character') : chø1 === '@' ? (function () {
                readChar(reader);
                return list(symbol(void 0, 'unquote-splicing'), read(reader, true, void 0, true));
            })() : list(symbol(void 0, 'unquote'), read(reader, true, void 0, true));
        }.call(this);
    };
var specialSymbols = exports.specialSymbols = function specialSymbols(text, notFound) {
        return text === 'nil' ? void 0 : text === 'true' ? true : text === 'false' ? false : 'else' ? notFound : void 0;
    };
var readSymbol = exports.readSymbol = function readSymbol(reader, initch) {
        return function () {
            var tokenø1 = readToken(reader, initch);
            var partsø1 = split(tokenø1, '/');
            var hasNsø1 = count(partsø1) > 1 && count(tokenø1) > 1;
            var nsø1 = first(partsø1);
            var nameø1 = join('/', rest(partsø1));
            return hasNsø1 ? symbol(nsø1, nameø1) : specialSymbols(tokenø1, symbol(tokenø1));
        }.call(this);
    };
var readKeyword = exports.readKeyword = function readKeyword(reader, initch) {
        return function () {
            var tokenø1 = readToken(reader, readChar(reader));
            var partsø1 = split(tokenø1, '/');
            var nameø1 = last(partsø1);
            var nsø1 = count(partsø1) > 1 ? join('/', butlast(partsø1)) : void 0;
            var issueø1 = last(nsø1) === ':' ? 'namespace can\'t ends with ":"' : last(nameø1) === ':' ? 'name can\'t end with ":"' : last(nameø1) === '/' ? 'name can\'t end with "/"' : count(split(tokenø1, '::')) > 1 ? 'name can\'t contain "::"' : void 0;
            return issueø1 ? readerError(reader, 'Invalid token (', issueø1, '): ', tokenø1) : !nsø1 && first(nameø1) === ':' ? keyword(rest(nameø1)) : keyword(nsø1, nameø1);
        }.call(this);
    };
var desugarMeta = exports.desugarMeta = function desugarMeta(form) {
        return isKeyword(form) ? dictionary(name(form), true) : isSymbol(form) ? { 'tag': form } : isString(form) ? { 'tag': form } : isDictionary(form) ? reduce(function (result, pair) {
            (result || 0)[name(first(pair))] = second(pair);
            return result;
        }, {}, form) : 'else' ? form : void 0;
    };
var wrappingReader = exports.wrappingReader = function wrappingReader(prefix) {
        return function (reader) {
            return list(prefix, read(reader, true, void 0, true));
        };
    };
var throwingReader = exports.throwingReader = function throwingReader(msg) {
        return function (reader) {
            return readerError(reader, msg);
        };
    };
var readMeta = exports.readMeta = function readMeta(reader, _) {
        return function () {
            var metadataø1 = desugarMeta(read(reader, true, void 0, true));
            !isDictionary(metadataø1) ? readerError(reader, 'Metadata must be Symbol, Keyword, String or Map') : void 0;
            return function () {
                var formø1 = read(reader, true, void 0, true);
                return isObject(formø1) ? withMeta(formø1, conj(metadataø1, meta(formø1))) : formø1;
            }.call(this);
        }.call(this);
    };
var readRegex = exports.readRegex = function readRegex(reader) {
        return function loop() {
            var recur = loop;
            var bufferø1 = '';
            var chø1 = readChar(reader);
            do {
                recur = isNil(chø1) ? readerError(reader, 'EOF while reading string') : '\\' === chø1 ? (loop[0] = '' + bufferø1 + chø1 + readChar(reader), loop[1] = readChar(reader), loop) : '"' === chø1 ? rePattern(bufferø1) : 'default' ? (loop[0] = '' + bufferø1 + chø1, loop[1] = readChar(reader), loop) : void 0;
            } while (bufferø1 = loop[0], chø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var readParam = exports.readParam = function readParam(reader, initch) {
        return function () {
            var formø1 = readSymbol(reader, initch);
            return isEqual(formø1, symbol('%')) ? symbol('%1') : formø1;
        }.call(this);
    };
var isParam = exports.isParam = function isParam(form) {
        return isSymbol(form) && '%' === first(name(form));
    };
var lambdaParamsHash = exports.lambdaParamsHash = function lambdaParamsHash(form) {
        return isParam(form) ? dictionary(form, form) : isDictionary(form) || isVector(form) || isList(form) ? conj.apply(void 0, map(lambdaParamsHash, vec(form))) : 'else' ? {} : void 0;
    };
var lambdaParams = exports.lambdaParams = function lambdaParams(body) {
        return function () {
            var namesø1 = sort(vals(lambdaParamsHash(body)));
            var variadicø1 = isEqual(first(namesø1), symbol('%&'));
            var nø1 = variadicø1 && count(namesø1) === 1 ? 0 : parseInt(rest(name(last(namesø1))));
            var paramsø1 = function loop() {
                    var recur = loop;
                    var namesø2 = [];
                    var iø1 = 1;
                    do {
                        recur = iø1 <= nø1 ? (loop[0] = conj(namesø2, symbol('' + '%' + iø1)), loop[1] = inc(iø1), loop) : namesø2;
                    } while (namesø2 = loop[0], iø1 = loop[1], recur === loop);
                    return recur;
                }.call(this);
            return variadicø1 ? conj(paramsø1, symbol(void 0, '&'), symbol(void 0, '%&')) : namesø1;
        }.call(this);
    };
var readLambda = exports.readLambda = function readLambda(reader) {
        return function () {
            var bodyø1 = readList(reader);
            return list(symbol(void 0, 'fn'), lambdaParams(bodyø1), bodyø1);
        }.call(this);
    };
var readDiscard = exports.readDiscard = function readDiscard(reader, _) {
        read(reader, true, void 0, true);
        return reader;
    };
var macros = exports.macros = function macros(c) {
        return c === '"' ? readString : c === '\\' ? readCharacter : c === ':' ? readKeyword : c === ';' ? readComment : c === '\'' ? wrappingReader(symbol(void 0, 'quote')) : c === '@' ? wrappingReader(symbol(void 0, 'deref')) : c === '^' ? readMeta : c === '`' ? wrappingReader(symbol(void 0, 'syntax-quote')) : c === '~' ? readUnquote : c === '(' ? readList : c === ')' ? readUnmatchedDelimiter : c === '[' ? readVector : c === ']' ? readUnmatchedDelimiter : c === '{' ? readMap : c === '}' ? readUnmatchedDelimiter : c === '%' ? readParam : c === '#' ? readDispatch : 'else' ? void 0 : void 0;
    };
var dispatchMacros = exports.dispatchMacros = function dispatchMacros(s) {
        return s === '{' ? readSet : s === '(' ? readLambda : s === '<' ? throwingReader('Unreadable form') : s === '"' ? readRegex : s === '!' ? readComment : s === '_' ? readDiscard : 'else' ? void 0 : void 0;
    };
var readForm = exports.readForm = function readForm(reader, ch) {
        return function () {
            var startø1 = {
                    'line': (reader || 0)['line'],
                    'column': (reader || 0)['column']
                };
            var readMacroø1 = macros(ch);
            var formø1 = readMacroø1 ? readMacroø1(reader, ch) : isNumberLiteral(reader, ch) ? readNumber(reader, ch) : 'else' ? readSymbol(reader, ch) : void 0;
            var endø1 = {
                    'line': (reader || 0)['line'],
                    'column': inc((reader || 0)['column'])
                };
            var locationø1 = {
                    'uri': (reader || 0)['uri'],
                    'start': startø1,
                    'end': endø1
                };
            return formø1 === reader ? formø1 : !(isBoolean(formø1) || isNil(formø1) || isKeyword(formø1)) ? withMeta(formø1, conj(locationø1, meta(formø1))) : 'else' ? formø1 : void 0;
        }.call(this);
    };
var read = exports.read = function read(reader, eofIsError, sentinel, isRecursive) {
        return function loop() {
            var recur = loop;
            do {
                recur = function () {
                    var chø1 = readChar(reader);
                    var formø1 = isNil(chø1) ? eofIsError ? readerError(reader, 'EOF') : sentinel : isWhitespace(chø1) ? reader : isCommentPrefix(chø1) ? read(readComment(reader, chø1), eofIsError, sentinel, isRecursive) : 'else' ? readForm(reader, chø1) : void 0;
                    return formø1 === reader ? (loop) : formø1;
                }.call(this);
            } while (recur === loop);
            return recur;
        }.call(this);
    };
var read_ = exports.read_ = function read_(source, uri) {
        return function () {
            var readerø1 = pushBackReader(source, uri);
            var eofø1 = gensym();
            return function loop() {
                var recur = loop;
                var formsø1 = [];
                var formø1 = read(readerø1, false, eofø1, false);
                do {
                    recur = formø1 === eofø1 ? formsø1 : (loop[0] = conj(formsø1, formø1), loop[1] = read(readerø1, false, eofø1, false), loop);
                } while (formsø1 = loop[0], formø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }.call(this);
    };
var readFromString = exports.readFromString = function readFromString(source, uri) {
        return function () {
            var readerø1 = pushBackReader(source, uri);
            return read(readerø1, true, void 0, false);
        }.call(this);
    };
var readUuid = function readUuid(uuid) {
    return isString(uuid) ? list.apply(void 0, [symbol(void 0, 'UUID.')].concat([uuid])) : readerError(void 0, 'UUID literal expects a string as its representation.');
};
var readQueue = function readQueue(items) {
    return isVector(items) ? list.apply(void 0, [symbol(void 0, 'PersistentQueue.')].concat([items])) : readerError(void 0, 'Queue literal expects a vector for its elements.');
};
var __tagTable__ = exports.__tagTable__ = dictionary('uuid', readUuid, 'queue', readQueue);
var maybeReadTaggedType = exports.maybeReadTaggedType = function maybeReadTaggedType(reader, initch) {
        return function () {
            var tagø1 = readSymbol(reader, initch);
            var pfnø1 = (__tagTable__ || 0)[name(tagø1)];
            return pfnø1 ? pfnø1(read(reader, true, void 0, false)) : readerError(reader, '' + 'Could not find tag parser for ' + name(tagø1) + ' in ' + ('' + keys(__tagTable__)));
        }.call(this);
    };
},{"./ast":9,"./runtime":33,"./sequence":34,"./string":35}],33:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.runtime',
            doc: 'Core primitives required for runtime'
        };
}
var identity = exports.identity = function identity(x) {
        return x;
    };
var isOdd = exports.isOdd = function isOdd(n) {
        return n % 2 === 1;
    };
var isEven = exports.isEven = function isEven(n) {
        return n % 2 === 0;
    };
var isDictionary = exports.isDictionary = function isDictionary(form) {
        return isObject(form) && isObject(Object.getPrototypeOf(form)) && isNil(Object.getPrototypeOf(Object.getPrototypeOf(form)));
    };
var dictionary = exports.dictionary = function dictionary() {
        var pairs = Array.prototype.slice.call(arguments, 0);
        return function loop() {
            var recur = loop;
            var keyValuesø1 = pairs;
            var resultø1 = {};
            do {
                recur = keyValuesø1.length ? (function () {
                    resultø1[keyValuesø1[0]] = keyValuesø1[1];
                    return loop[0] = keyValuesø1.slice(2), loop[1] = resultø1, loop;
                })() : resultø1;
            } while (keyValuesø1 = loop[0], resultø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var keys = exports.keys = function keys(dictionary) {
        return Object.keys(dictionary);
    };
var vals = exports.vals = function vals(dictionary) {
        return keys(dictionary).map(function (key) {
            return (dictionary || 0)[key];
        });
    };
var keyValues = exports.keyValues = function keyValues(dictionary) {
        return keys(dictionary).map(function (key) {
            return [
                key,
                (dictionary || 0)[key]
            ];
        });
    };
var merge = exports.merge = function merge() {
        return Object.create(Object.prototype, Array.prototype.slice.call(arguments).reduce(function (descriptor, dictionary) {
            isObject(dictionary) ? Object.keys(dictionary).forEach(function (key) {
                return (descriptor || 0)[key] = Object.getOwnPropertyDescriptor(dictionary, key);
            }) : void 0;
            return descriptor;
        }, Object.create(Object.prototype)));
    };
var isSatisfies = exports.isSatisfies = function isSatisfies(protocol, x) {
        return x === void 0 ? protocol.wisp_core$IProtocol$nil : x === null ? protocol.wisp_core$IProtocol$nil : 'else' ? x[protocol.wisp_core$IProtocol$id] || protocol.wisp_core$IProtocol$_ : void 0;
    };
var isContainsVector = exports.isContainsVector = function isContainsVector(vector, element) {
        return vector.indexOf(element) >= 0;
    };
var mapDictionary = exports.mapDictionary = function mapDictionary(source, f) {
        return Object.keys(source).reduce(function (target, key) {
            (target || 0)[key] = f((source || 0)[key]);
            return target;
        }, {});
    };
var toString = exports.toString = Object.prototype.toString;
var isFn = exports.isFn = typeof(/./) === 'function' ? function (x) {
        return toString.call(x) === '[object Function]';
    } : function (x) {
        return typeof(x) === 'function';
    };
var isError = exports.isError = function isError(x) {
        return x instanceof Error || toString.call(x) === '[object Error]';
    };
var isString = exports.isString = function isString(x) {
        return typeof(x) === 'string' || toString.call(x) === '[object String]';
    };
var isNumber = exports.isNumber = function isNumber(x) {
        return typeof(x) === 'number' || toString.call(x) === '[object Number]';
    };
var isVector = exports.isVector = isFn(Array.isArray) ? Array.isArray : function (x) {
        return toString.call(x) === '[object Array]';
    };
var isDate = exports.isDate = function isDate(x) {
        return toString.call(x) === '[object Date]';
    };
var isBoolean = exports.isBoolean = function isBoolean(x) {
        return x === true || x === false || toString.call(x) === '[object Boolean]';
    };
var isRePattern = exports.isRePattern = function isRePattern(x) {
        return toString.call(x) === '[object RegExp]';
    };
var isObject = exports.isObject = function isObject(x) {
        return x && typeof(x) === 'object';
    };
var isNil = exports.isNil = function isNil(x) {
        return x === void 0 || x === null;
    };
var isTrue = exports.isTrue = function isTrue(x) {
        return x === true;
    };
var isFalse = exports.isFalse = function isFalse(x) {
        return x === true;
    };
var reFind = exports.reFind = function reFind(re, s) {
        return function () {
            var matchesø1 = re.exec(s);
            return !isNil(matchesø1) ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : void 0;
        }.call(this);
    };
var reMatches = exports.reMatches = function reMatches(pattern, source) {
        return function () {
            var matchesø1 = pattern.exec(source);
            return !isNil(matchesø1) && (matchesø1 || 0)[0] === source ? matchesø1.length === 1 ? (matchesø1 || 0)[0] : matchesø1 : void 0;
        }.call(this);
    };
var rePattern = exports.rePattern = function rePattern(s) {
        return function () {
            var matchø1 = reFind(/^(?:\(\?([idmsux]*)\))?(.*)/, s);
            return new RegExp((matchø1 || 0)[2], (matchø1 || 0)[1]);
        }.call(this);
    };
var inc = exports.inc = function inc(x) {
        return x + 1;
    };
var dec = exports.dec = function dec(x) {
        return x - 1;
    };
var str = exports.str = function str() {
        return String.prototype.concat.apply('', arguments);
    };
var char = exports.char = function char(code) {
        return String.fromCharCode(code);
    };
var int = exports.int = function int(x) {
        return isNumber(x) ? x >= 0 ? Math.floor(x) : Math.floor(x) : x.charCodeAt(0);
    };
var subs = exports.subs = function subs(string, start, end) {
        return string.substring(start, end);
    };
var isPatternEqual = function isPatternEqual(x, y) {
    return isRePattern(x) && isRePattern(y) && x.source === y.source && x.global === y.global && x.multiline === y.multiline && x.ignoreCase === y.ignoreCase;
};
var isDateEqual = function isDateEqual(x, y) {
    return isDate(x) && isDate(y) && Number(x) === Number(y);
};
var isDictionaryEqual = function isDictionaryEqual(x, y) {
    return isObject(x) && isObject(y) && function () {
        var xKeysø1 = keys(x);
        var yKeysø1 = keys(y);
        var xCountø1 = xKeysø1.length;
        var yCountø1 = yKeysø1.length;
        return xCountø1 === yCountø1 && function loop() {
            var recur = loop;
            var indexø1 = 0;
            var countø1 = xCountø1;
            var keysø1 = xKeysø1;
            do {
                recur = indexø1 < countø1 ? isEquivalent((x || 0)[(keysø1 || 0)[indexø1]], (y || 0)[(keysø1 || 0)[indexø1]]) ? (loop[0] = inc(indexø1), loop[1] = countø1, loop[2] = keysø1, loop) : false : true;
            } while (indexø1 = loop[0], countø1 = loop[1], keysø1 = loop[2], recur === loop);
            return recur;
        }.call(this);
    }.call(this);
};
var isVectorEqual = function isVectorEqual(x, y) {
    return isVector(x) && isVector(y) && x.length === y.length && function loop() {
        var recur = loop;
        var xsø1 = x;
        var ysø1 = y;
        var indexø1 = 0;
        var countø1 = x.length;
        do {
            recur = indexø1 < countø1 ? isEquivalent((xsø1 || 0)[indexø1], (ysø1 || 0)[indexø1]) ? (loop[0] = xsø1, loop[1] = ysø1, loop[2] = inc(indexø1), loop[3] = countø1, loop) : false : true;
        } while (xsø1 = loop[0], ysø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
        return recur;
    }.call(this);
};
var isEquivalent = function isEquivalent() {
    switch (arguments.length) {
    case 1:
        var x = arguments[0];
        return true;
    case 2:
        var x = arguments[0];
        var y = arguments[1];
        return x === y || (isNil(x) ? isNil(y) : isNil(y) ? isNil(x) : isString(x) ? isString(y) && x.toString() === y.toString() : isNumber(x) ? isNumber(y) && x.valueOf() === y.valueOf() : isFn(x) ? false : isBoolean(x) ? false : isDate(x) ? isDateEqual(x, y) : isVector(x) ? isVectorEqual(x, y, [], []) : isRePattern(x) ? isPatternEqual(x, y) : 'else' ? isDictionaryEqual(x, y) : void 0);
    default:
        var x = arguments[0];
        var y = arguments[1];
        var more = Array.prototype.slice.call(arguments, 2);
        return function loop() {
            var recur = loop;
            var previousø1 = x;
            var currentø1 = y;
            var indexø1 = 0;
            var countø1 = more.length;
            do {
                recur = isEquivalent(previousø1, currentø1) && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
            } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
            return recur;
        }.call(this);
    }
};
var isEqual = exports.isEqual = isEquivalent;
var isStrictEqual = exports.isStrictEqual = function isStrictEqual() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x === y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 == currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var greaterThan = exports.greaterThan = function greaterThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x > y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 > currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var notLessThan = exports.notLessThan = function notLessThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x >= y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 >= currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var lessThan = exports.lessThan = function lessThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x < y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 < currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var notGreaterThan = exports.notGreaterThan = function notGreaterThan() {
        switch (arguments.length) {
        case 1:
            var x = arguments[0];
            return true;
        case 2:
            var x = arguments[0];
            var y = arguments[1];
            return x <= y;
        default:
            var x = arguments[0];
            var y = arguments[1];
            var more = Array.prototype.slice.call(arguments, 2);
            return function loop() {
                var recur = loop;
                var previousø1 = x;
                var currentø1 = y;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = previousø1 <= currentø1 && (indexø1 < countø1 ? (loop[0] = currentø1, loop[1] = (more || 0)[indexø1], loop[2] = inc(indexø1), loop[3] = countø1, loop) : true);
                } while (previousø1 = loop[0], currentø1 = loop[1], indexø1 = loop[2], countø1 = loop[3], recur === loop);
                return recur;
            }.call(this);
        }
    };
var sum = exports.sum = function sum() {
        switch (arguments.length) {
        case 0:
            return 0;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a + b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a + b + c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a + b + c + d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a + b + c + d + e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a + b + c + d + e + f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a + b + c + d + e + f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 + (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var subtract = exports.subtract = function subtract() {
        switch (arguments.length) {
        case 0:
            return (function () {
                throw TypeError('Wrong number of args passed to: -');
            })();
        case 1:
            var a = arguments[0];
            return 0 - a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a - b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a - b - c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a - b - c - d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a - b - c - d - e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a - b - c - d - e - f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a - b - c - d - e - f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 - (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var divide = exports.divide = function divide() {
        switch (arguments.length) {
        case 0:
            return (function () {
                throw TypeError('Wrong number of args passed to: /');
            })();
        case 1:
            var a = arguments[0];
            return 1 / a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a / b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a / b / c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a / b / c / d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a / b / c / d / e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a / b / c / d / e / f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a / b / c / d / e / f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 / (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var multiply = exports.multiply = function multiply() {
        switch (arguments.length) {
        case 0:
            return 1;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a * b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a * b * c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a * b * c * d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a * b * c * d * e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a * b * c * d * e * f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a * b * c * d * e * f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 * (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var and = exports.and = function and() {
        switch (arguments.length) {
        case 0:
            return true;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a && b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a && b && c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a && b && c && d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a && b && c && d && e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a && b && c && d && e && f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a && b && c && d && e && f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 && (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var or = exports.or = function or() {
        switch (arguments.length) {
        case 0:
            return void 0;
        case 1:
            var a = arguments[0];
            return a;
        case 2:
            var a = arguments[0];
            var b = arguments[1];
            return a || b;
        case 3:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            return a || b || c;
        case 4:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            return a || b || c || d;
        case 5:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            return a || b || c || d || e;
        case 6:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            return a || b || c || d || e || f;
        default:
            var a = arguments[0];
            var b = arguments[1];
            var c = arguments[2];
            var d = arguments[3];
            var e = arguments[4];
            var f = arguments[5];
            var more = Array.prototype.slice.call(arguments, 6);
            return function loop() {
                var recur = loop;
                var valueø1 = a || b || c || d || e || f;
                var indexø1 = 0;
                var countø1 = more.length;
                do {
                    recur = indexø1 < countø1 ? (loop[0] = valueø1 || (more || 0)[indexø1], loop[1] = inc(indexø1), loop[2] = countø1, loop) : valueø1;
                } while (valueø1 = loop[0], indexø1 = loop[1], countø1 = loop[2], recur === loop);
                return recur;
            }.call(this);
        }
    };
var print = exports.print = function print() {
        var more = Array.prototype.slice.call(arguments, 0);
        return console.log.apply(void 0, more);
    };
var max = exports.max = Math.max;
var min = exports.min = Math.min;
},{}],34:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.sequence',
            doc: void 0
        };
    var wisp_runtime = require('./runtime');
    var isNil = wisp_runtime.isNil;
    var isVector = wisp_runtime.isVector;
    var isFn = wisp_runtime.isFn;
    var isNumber = wisp_runtime.isNumber;
    var isString = wisp_runtime.isString;
    var isDictionary = wisp_runtime.isDictionary;
    var keyValues = wisp_runtime.keyValues;
    var str = wisp_runtime.str;
    var dec = wisp_runtime.dec;
    var inc = wisp_runtime.inc;
    var merge = wisp_runtime.merge;
    var dictionary = wisp_runtime.dictionary;
}
var List = function List(head, tail) {
    this.head = head;
    this.tail = tail || list();
    this.length = inc(count(this.tail));
    return this;
};
List.prototype.length = 0;
List.type = 'wisp.list';
List.prototype.type = List.type;
List.prototype.tail = Object.create(List.prototype);
List.prototype.toString = function () {
    return function loop() {
        var recur = loop;
        var resultø1 = '';
        var listø1 = this;
        do {
            recur = isEmpty(listø1) ? '' + '(' + resultø1.substr(1) + ')' : (loop[0] = '' + resultø1 + ' ' + (isVector(first(listø1)) ? '' + '[' + first(listø1).join(' ') + ']' : isNil(first(listø1)) ? 'nil' : isString(first(listø1)) ? JSON.stringify(first(listø1)) : isNumber(first(listø1)) ? JSON.stringify(first(listø1)) : first(listø1)), loop[1] = rest(listø1), loop);
        } while (resultø1 = loop[0], listø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var lazySeqValue = function lazySeqValue(lazySeq) {
    return !lazySeq.realized ? (lazySeq.realized = true) && (lazySeq.x = lazySeq.x()) : lazySeq.x;
};
var LazySeq = function LazySeq(realized, x) {
    this.realized = realized || false;
    this.x = x;
    return this;
};
LazySeq.type = 'wisp.lazy.seq';
LazySeq.prototype.type = LazySeq.type;
var lazySeq = exports.lazySeq = function lazySeq(realized, body) {
        return new LazySeq(realized, body);
    };
var isLazySeq = exports.isLazySeq = function isLazySeq(value) {
        return value && LazySeq.type === value.type;
    };
void 0;
var isList = exports.isList = function isList(value) {
        return value && List.type === value.type;
    };
var list = exports.list = function list() {
        return arguments.length === 0 ? Object.create(List.prototype) : Array.prototype.slice.call(arguments).reduceRight(function (tail, head) {
            return cons(head, tail);
        }, list());
    };
var cons = exports.cons = function cons(head, tail) {
        return new List(head, tail);
    };
var reverseList = function reverseList(sequence) {
    return function loop() {
        var recur = loop;
        var itemsø1 = [];
        var sourceø1 = sequence;
        do {
            recur = isEmpty(sourceø1) ? list.apply(void 0, itemsø1) : (loop[0] = [first(sourceø1)].concat(itemsø1), loop[1] = rest(sourceø1), loop);
        } while (itemsø1 = loop[0], sourceø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var isSequential = exports.isSequential = function isSequential(x) {
        return isList(x) || isVector(x) || isLazySeq(x) || isDictionary(x) || isString(x);
    };
var reverse = exports.reverse = function reverse(sequence) {
        return isList(sequence) ? reverseList(sequence) : isVector(sequence) ? sequence.reverse() : isNil(sequence) ? list() : 'else' ? reverse(seq(sequence)) : void 0;
    };
var map = exports.map = function map(f, sequence) {
        return isVector(sequence) ? sequence.map(function ($1) {
            return f($1);
        }) : isList(sequence) ? mapList(f, sequence) : isNil(sequence) ? list() : 'else' ? map(f, seq(sequence)) : void 0;
    };
var mapList = function mapList(f, sequence) {
    return function loop() {
        var recur = loop;
        var resultø1 = list();
        var itemsø1 = sequence;
        do {
            recur = isEmpty(itemsø1) ? reverse(resultø1) : (loop[0] = cons(f(first(itemsø1)), resultø1), loop[1] = rest(itemsø1), loop);
        } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var filter = exports.filter = function filter(isF, sequence) {
        return isVector(sequence) ? sequence.filter(isF) : isList(sequence) ? filterList(isF, sequence) : isNil(sequence) ? list() : 'else' ? filter(isF, seq(sequence)) : void 0;
    };
var filterList = function filterList(isF, sequence) {
    return function loop() {
        var recur = loop;
        var resultø1 = list();
        var itemsø1 = sequence;
        do {
            recur = isEmpty(itemsø1) ? reverse(resultø1) : (loop[0] = isF(first(itemsø1)) ? cons(first(itemsø1), resultø1) : resultø1, loop[1] = rest(itemsø1), loop);
        } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var reduce = exports.reduce = function reduce(f) {
        var params = Array.prototype.slice.call(arguments, 1);
        return function () {
            var hasInitialø1 = count(params) >= 2;
            var initialø1 = hasInitialø1 ? first(params) : void 0;
            var sequenceø1 = hasInitialø1 ? second(params) : first(params);
            return isNil(sequenceø1) ? initialø1 : isVector(sequenceø1) ? hasInitialø1 ? sequenceø1.reduce(f, initialø1) : sequenceø1.reduce(f) : isList(sequenceø1) ? hasInitialø1 ? reduceList(f, initialø1, sequenceø1) : reduceList(f, first(sequenceø1), rest(sequenceø1)) : 'else' ? reduce(f, initialø1, seq(sequenceø1)) : void 0;
        }.call(this);
    };
var reduceList = function reduceList(f, initial, sequence) {
    return function loop() {
        var recur = loop;
        var resultø1 = initial;
        var itemsø1 = sequence;
        do {
            recur = isEmpty(itemsø1) ? resultø1 : (loop[0] = f(resultø1, first(itemsø1)), loop[1] = rest(itemsø1), loop);
        } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var count = exports.count = function count(sequence) {
        return isNil(sequence) ? 0 : seq(sequence).length;
    };
var isEmpty = exports.isEmpty = function isEmpty(sequence) {
        return count(sequence) === 0;
    };
var first = exports.first = function first(sequence) {
        return isNil(sequence) ? void 0 : isList(sequence) ? sequence.head : isVector(sequence) || isString(sequence) ? (sequence || 0)[0] : isLazySeq(sequence) ? first(lazySeqValue(sequence)) : 'else' ? first(seq(sequence)) : void 0;
    };
var second = exports.second = function second(sequence) {
        return isNil(sequence) ? void 0 : isList(sequence) ? first(rest(sequence)) : isVector(sequence) || isString(sequence) ? (sequence || 0)[1] : isLazySeq(sequence) ? second(lazySeqValue(sequence)) : 'else' ? first(rest(seq(sequence))) : void 0;
    };
var third = exports.third = function third(sequence) {
        return isNil(sequence) ? void 0 : isList(sequence) ? first(rest(rest(sequence))) : isVector(sequence) || isString(sequence) ? (sequence || 0)[2] : isLazySeq(sequence) ? third(lazySeqValue(sequence)) : 'else' ? second(rest(seq(sequence))) : void 0;
    };
var rest = exports.rest = function rest(sequence) {
        return isNil(sequence) ? list() : isList(sequence) ? sequence.tail : isVector(sequence) || isString(sequence) ? sequence.slice(1) : isLazySeq(sequence) ? rest(lazySeqValue(sequence)) : 'else' ? rest(seq(sequence)) : void 0;
    };
var lastOfList = function lastOfList(list) {
    return function loop() {
        var recur = loop;
        var itemø1 = first(list);
        var itemsø1 = rest(list);
        do {
            recur = isEmpty(itemsø1) ? itemø1 : (loop[0] = first(itemsø1), loop[1] = rest(itemsø1), loop);
        } while (itemø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var last = exports.last = function last(sequence) {
        return isVector(sequence) || isString(sequence) ? (sequence || 0)[dec(count(sequence))] : isList(sequence) ? lastOfList(sequence) : isNil(sequence) ? void 0 : isLazySeq(sequence) ? last(lazySeqValue(sequence)) : 'else' ? last(seq(sequence)) : void 0;
    };
var butlast = exports.butlast = function butlast(sequence) {
        return function () {
            var itemsø1 = isNil(sequence) ? void 0 : isString(sequence) ? subs(sequence, 0, dec(count(sequence))) : isVector(sequence) ? sequence.slice(0, dec(count(sequence))) : isList(sequence) ? list.apply(void 0, butlast(vec(sequence))) : isLazySeq(sequence) ? butlast(lazySeqValue(sequence)) : 'else' ? butlast(seq(sequence)) : void 0;
            return !(isNil(itemsø1) || isEmpty(itemsø1)) ? itemsø1 : void 0;
        }.call(this);
    };
var take = exports.take = function take(n, sequence) {
        return isNil(sequence) ? list() : isVector(sequence) ? takeFromVector(n, sequence) : isList(sequence) ? takeFromList(n, sequence) : isLazySeq(sequence) ? take(n, lazySeqValue(sequence)) : 'else' ? take(n, seq(sequence)) : void 0;
    };
var takeVectorWhile = function takeVectorWhile(predicate, vector) {
    return function loop() {
        var recur = loop;
        var resultø1 = [];
        var tailø1 = vector;
        var headø1 = first(vector);
        do {
            recur = !isEmpty(tailø1) && predicate(headø1) ? (loop[0] = conj(resultø1, headø1), loop[1] = rest(tailø1), loop[2] = first(tailø1), loop) : resultø1;
        } while (resultø1 = loop[0], tailø1 = loop[1], headø1 = loop[2], recur === loop);
        return recur;
    }.call(this);
};
var takeListWhile = function takeListWhile(predicate, items) {
    return function loop() {
        var recur = loop;
        var resultø1 = [];
        var tailø1 = items;
        var headø1 = first(items);
        do {
            recur = !isEmpty(tailø1) && isPredicate(headø1) ? (loop[0] = conj(resultø1, headø1), loop[1] = rest(tailø1), loop[2] = first(tailø1), loop) : list.apply(void 0, resultø1);
        } while (resultø1 = loop[0], tailø1 = loop[1], headø1 = loop[2], recur === loop);
        return recur;
    }.call(this);
};
var takeWhile = exports.takeWhile = function takeWhile(predicate, sequence) {
        return isNil(sequence) ? list() : isVector(sequence) ? takeVectorWhile(predicate, sequence) : isList(sequence) ? takeVectorWhile(predicate, sequence) : 'else' ? takeWhile(predicate, lazySeqValue(sequence)) : void 0;
    };
var takeFromVector = function takeFromVector(n, vector) {
    return vector.slice(0, n);
};
var takeFromList = function takeFromList(n, sequence) {
    return function loop() {
        var recur = loop;
        var takenø1 = list();
        var itemsø1 = sequence;
        var nø2 = n;
        do {
            recur = nø2 === 0 || isEmpty(itemsø1) ? reverse(takenø1) : (loop[0] = cons(first(itemsø1), takenø1), loop[1] = rest(itemsø1), loop[2] = dec(nø2), loop);
        } while (takenø1 = loop[0], itemsø1 = loop[1], nø2 = loop[2], recur === loop);
        return recur;
    }.call(this);
};
var dropFromList = function dropFromList(n, sequence) {
    return function loop() {
        var recur = loop;
        var leftø1 = n;
        var itemsø1 = sequence;
        do {
            recur = leftø1 < 1 || isEmpty(itemsø1) ? itemsø1 : (loop[0] = dec(leftø1), loop[1] = rest(itemsø1), loop);
        } while (leftø1 = loop[0], itemsø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var drop = exports.drop = function drop(n, sequence) {
        return n <= 0 ? sequence : isString(sequence) ? sequence.substr(n) : isVector(sequence) ? sequence.slice(n) : isList(sequence) ? dropFromList(n, sequence) : isNil(sequence) ? list() : isLazySeq(sequence) ? drop(n, lazySeqValue(sequence)) : 'else' ? drop(n, seq(sequence)) : void 0;
    };
var conjList = function conjList(sequence, items) {
    return reduce(function (result, item) {
        return cons(item, result);
    }, sequence, items);
};
var conj = exports.conj = function conj(sequence) {
        var items = Array.prototype.slice.call(arguments, 1);
        return isVector(sequence) ? sequence.concat(items) : isString(sequence) ? '' + sequence + str.apply(void 0, items) : isNil(sequence) ? list.apply(void 0, reverse(items)) : isList(sequence) || isLazySeq() ? conjList(sequence, items) : isDictionary(sequence) ? merge(sequence, merge.apply(void 0, items)) : 'else' ? (function () {
            throw TypeError('' + 'Type can\'t be conjoined ' + sequence);
        })() : void 0;
    };
var assoc = exports.assoc = function assoc(source) {
        var keyValues = Array.prototype.slice.call(arguments, 1);
        return conj(source, dictionary.apply(void 0, keyValues));
    };
var concat = exports.concat = function concat() {
        var sequences = Array.prototype.slice.call(arguments, 0);
        return reverse(reduce(function (result, sequence) {
            return reduce(function (result, item) {
                return cons(item, result);
            }, result, seq(sequence));
        }, list(), sequences));
    };
var seq = exports.seq = function seq(sequence) {
        return isNil(sequence) ? void 0 : isVector(sequence) || isList(sequence) || isLazySeq(sequence) ? sequence : isString(sequence) ? Array.prototype.slice.call(sequence) : isDictionary(sequence) ? keyValues(sequence) : 'default' ? (function () {
            throw TypeError('' + 'Can not seq ' + sequence);
        })() : void 0;
    };
var isSeq = exports.isSeq = function isSeq(sequence) {
        return isList(sequence) || isLazySeq(sequence);
    };
var listToVector = function listToVector(source) {
    return function loop() {
        var recur = loop;
        var resultø1 = [];
        var listø1 = source;
        do {
            recur = isEmpty(listø1) ? resultø1 : (loop[0] = (function () {
                resultø1.push(first(listø1));
                return resultø1;
            })(), loop[1] = rest(listø1), loop);
        } while (resultø1 = loop[0], listø1 = loop[1], recur === loop);
        return recur;
    }.call(this);
};
var vec = exports.vec = function vec(sequence) {
        return isNil(sequence) ? [] : isVector(sequence) ? sequence : isList(sequence) ? listToVector(sequence) : 'else' ? vec(seq(sequence)) : void 0;
    };
var sort = exports.sort = function sort(f, items) {
        return function () {
            var hasComparatorø1 = isFn(f);
            var itemsø2 = !hasComparatorø1 && isNil(items) ? f : items;
            var compareø1 = hasComparatorø1 ? function (a, b) {
                    return f(a, b) ? 0 : 1;
                } : void 0;
            return isNil(itemsø2) ? list() : isVector(itemsø2) ? itemsø2.sort(compareø1) : isList(itemsø2) ? list.apply(void 0, vec(itemsø2).sort(compareø1)) : isDictionary(itemsø2) ? seq(itemsø2).sort(compareø1) : 'else' ? sort(f, seq(itemsø2)) : void 0;
        }.call(this);
    };
var repeat = exports.repeat = function repeat(n, x) {
        return function loop() {
            var recur = loop;
            var nø2 = n;
            var resultø1 = [];
            do {
                recur = nø2 <= 0 ? resultø1 : (loop[0] = dec(nø2), loop[1] = conj(resultø1, x), loop);
            } while (nø2 = loop[0], resultø1 = loop[1], recur === loop);
            return recur;
        }.call(this);
    };
var isEvery = exports.isEvery = function isEvery(predicate, sequence) {
        return vec(sequence).every(function ($1) {
            return predicate($1);
        });
    };
var some = exports.some = function some(predicate, sequence) {
        return function loop() {
            var recur = loop;
            var itemsø1 = sequence;
            do {
                recur = isEmpty(itemsø1) ? false : predicate(first(itemsø1)) ? true : 'else' ? (loop[0] = rest(itemsø1), loop) : void 0;
            } while (itemsø1 = loop[0], recur === loop);
            return recur;
        }.call(this);
    };
var partition = exports.partition = function partition() {
        switch (arguments.length) {
        case 2:
            var n = arguments[0];
            var coll = arguments[1];
            return partition(n, n, coll);
        case 3:
            var n = arguments[0];
            var step = arguments[1];
            var coll = arguments[2];
            return partition(n, step, [], coll);
        case 4:
            var n = arguments[0];
            var step = arguments[1];
            var pad = arguments[2];
            var coll = arguments[3];
            return function loop() {
                var recur = loop;
                var resultø1 = [];
                var itemsø1 = seq(coll);
                do {
                    recur = function () {
                        var chunkø1 = take(n, itemsø1);
                        var sizeø1 = count(chunkø1);
                        return sizeø1 === n ? (loop[0] = conj(resultø1, chunkø1), loop[1] = drop(step, itemsø1), loop) : 0 === sizeø1 ? resultø1 : n > sizeø1 + count(pad) ? resultø1 : 'else' ? conj(resultø1, take(n, vec(concat(chunkø1, pad)))) : void 0;
                    }.call(this);
                } while (resultø1 = loop[0], itemsø1 = loop[1], recur === loop);
                return recur;
            }.call(this);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var interleave = exports.interleave = function interleave() {
        switch (arguments.length) {
        case 2:
            var ax = arguments[0];
            var bx = arguments[1];
            return function loop() {
                var recur = loop;
                var cxø1 = [];
                var axø2 = ax;
                var bxø2 = bx;
                do {
                    recur = isEmpty(axø2) || isEmpty(bxø2) ? seq(cxø1) : (loop[0] = conj(cxø1, first(axø2), first(bxø2)), loop[1] = rest(axø2), loop[2] = rest(bxø2), loop);
                } while (cxø1 = loop[0], axø2 = loop[1], bxø2 = loop[2], recur === loop);
                return recur;
            }.call(this);
        default:
            var sequences = Array.prototype.slice.call(arguments, 0);
            return function loop() {
                var recur = loop;
                var resultø1 = [];
                var sequencesø2 = sequences;
                do {
                    recur = some(isEmpty, sequencesø2) ? resultø1 : (loop[0] = concat(resultø1, map(first, sequencesø2)), loop[1] = map(rest, sequencesø2), loop);
                } while (resultø1 = loop[0], sequencesø2 = loop[1], recur === loop);
                return recur;
            }.call(this);
        }
    };
var nth = exports.nth = function nth(sequence, index, notFound) {
        return isNil(sequence) ? notFound : isList(sequence) ? index < count(sequence) ? first(drop(index, sequence)) : notFound : isVector(sequence) || isString(sequence) ? index < count(sequence) ? sequence[index] : notFound : isLazySeq(sequence) ? nth(lazySeqValue(sequence), index, notFound) : 'else' ? (function () {
            throw TypeError('Unsupported type');
        })() : void 0;
    };
},{"./runtime":33}],35:[function(require,module,exports){
{
    var _ns_ = {
            id: 'wisp.string',
            doc: void 0
        };
    var wisp_runtime = require('./runtime');
    var str = wisp_runtime.str;
    var subs = wisp_runtime.subs;
    var reMatches = wisp_runtime.reMatches;
    var isNil = wisp_runtime.isNil;
    var isString = wisp_runtime.isString;
    var wisp_sequence = require('./sequence');
    var vec = wisp_sequence.vec;
    var isEmpty = wisp_sequence.isEmpty;
}
var split = exports.split = function split(string, pattern, limit) {
        return string.split(pattern, limit);
    };
var join = exports.join = function join() {
        switch (arguments.length) {
        case 1:
            var coll = arguments[0];
            return str.apply(void 0, vec(coll));
        case 2:
            var separator = arguments[0];
            var coll = arguments[1];
            return vec(coll).join(separator);
        default:
            throw RangeError('Wrong number of arguments passed');
        }
    };
var upperCase = exports.upperCase = function upperCase(string) {
        return string.toUpperCase();
    };
var upperCase = exports.upperCase = function upperCase(string) {
        return string.toUpperCase();
    };
var lowerCase = exports.lowerCase = function lowerCase(string) {
        return string.toLowerCase();
    };
var capitalize = exports.capitalize = function capitalize(string) {
        return count(string) < 2 ? upperCase(string) : '' + upperCase(subs(s, 0, 1)) + lowerCase(subs(s, 1));
    };
var replace = exports.replace = function replace(string, match, replacement) {
        return string.replace(match, replacement);
    };
var __LEFTSPACES__ = exports.__LEFTSPACES__ = /^\s\s*/;
var __RIGHTSPACES__ = exports.__RIGHTSPACES__ = /\s\s*$/;
var __SPACES__ = exports.__SPACES__ = /^\s\s*$/;
var triml = exports.triml = isNil(''.trimLeft) ? function (string) {
        return string.replace(__LEFTSPACES__, '');
    } : function (string) {
        return string.trimLeft();
    };
var trimr = exports.trimr = isNil(''.trimRight) ? function (string) {
        return string.replace(__RIGHTSPACES__, '');
    } : function (string) {
        return string.trimRight();
    };
var trim = exports.trim = isNil(''.trim) ? function (string) {
        return string.replace(__LEFTSPACES__).replace(__RIGHTSPACES__);
    } : function (string) {
        return string.trim();
    };
var isBlank = exports.isBlank = function isBlank(string) {
        return isNil(string) || isEmpty(string) || reMatches(__SPACES__, string);
    };
},{"./runtime":33,"./sequence":34}]},{},[1])
;