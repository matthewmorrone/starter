
function Data(data, options) {
	if (!options) options = {};

	var rxIsInt = /^\d+$/,
		rxIsFloat = /^\d*\.\d+$|^\d+\.\d*$/,
		rxNeedsQuoting = /^\s|\s$|,|"|\n/,
		ESCAPE_DELIMITERS = ['|', '^'],
		CELL_DELIMITERS = [',', ';', '\t', '|', '^'],
		LINE_DELIMITERS = ['\r\n', '\r', '\n'],

	function prepField(field) {
		if (isString(field)) {
			field = field.replace(/"/g, '""');
			if (rxNeedsQuoting.test(field) || rxIsInt.test(field) || rxIsFloat.test(field)) {
				field = '"' + field + '"';
			} else if (field === "") {
				field = '""';
			}
		} else if (isNumber(field)) {
			field = field.toString(10);
		} else if (field === null || field === undefined) {
			field = '';
		} else {
			field = field.toString();
		}
		return field;
	},



	function castToScalar(value, state) {
		var hasDot = /\./;
		if (isNaN(value)) {
			return value;
		} else {
			if (hasDot.test(value)) {
				return parseFloat(value);
			} else {
				var integer = parseInt(value);
				if(isNaN(integer)) {
					return null;
				} else {
					return integer;
				}
			}
		}
	}


	function fallback(value, fallback) {
		return isPresent(value) ? value : fallback;
	}

	function forEach(collection, iterator) {
		var currentIndex = 0,
				collectionLength = collection.length;
		while (currentIndex < collectionLength) {
			if (iterator(collection[currentIndex], currentIndex) === false) break;
			currentIndex++;
		}
		return collection;
	}

	function buildCell(index) {
		return 'attrs[' + index + ']';
	}

	function castCell(value, index) {
		if (isNumber(value)) {
			return 'Number(' + buildCell(index) + ')';
		} else if (isBoolean(value)) {
			return 'Boolean(' + buildCell(index) + ' == true)';
		} else {
			return 'String(' + buildCell(index) + ')';
		}
	}

	function buildConstructor(cast, values, attrs) {
		var definition = [];
		if (arguments.length == 2) {
			if (cast) {
				if (isArray(cast)) {
					forEach(values, function(value, index) {
						definition.push(cast[index] + '(' + buildCell(index) + ')');
					});
				} else {
					forEach(values, function(value, index) {
						definition.push(castCell(value, index));
					});
				}
			} else {
				forEach(values, function(value, index) {
					definition.push(buildCell(index));
				});
			}
			definition = 'return [' + definition.join(',') + ']';
		} else {
			if (cast) {
				if (isArray(cast)) {
					forEach(values, function(value, index) {
						definition.push('"' + attrs[index] + '": ' + cast[index] + '(' + buildCell(index) + ')');
					});
				} else {
					forEach(values, function(value, index) {
						definition.push('"' + attrs[index] + '": ' + castCell(value, index));
					});
				}
			} else {
				forEach(values, function(value, index) {
					definition.push('"' + attrs[index] + '": ' + buildCell(index));
				});
			}
			definition = 'return {' + definition.join(',') + '}';
		}
		return new Function('attrs', definition);
	}

	function detectDelimiter(string, delimiters) {
		var count = 0, detected;

		forEach(delimiters, function(delimiter) {
			var needle = delimiter, matches;
			if (ESCAPE_DELIMITERS.indexOf(delimiter) != -1) {
				needle = '\\' + needle;
			}
			matches = string.match(new RegExp(needle, 'g'));
			if (matches && matches.length > count) {
				count = matches.length;
				detected = delimiter;
			}
		});
		return (detected || delimiters[0]);
	}



	function invoke(method, constructor, attributes) {
		method(new constructor(attributes));
	}

	function normalizeData(text, lineDelimiter) {
		if (text.slice(-lineDelimiter.length) != lineDelimiter) {text += lineDelimiter;}
		return text;
	}

	function serializeType(object) {
		if (isArray(object)) {
			return 'array';
		} else if (isObject(object)) {
			return 'object';
		} else if (isString(object)) {
			return 'string';
		} else if (isNull(object)) {
			return 'null';
		} else {
			return 'primitive';
		}
	}


	if (isArray(data)) {
		this.mode = 'encode';
	} else if (isString(data)) {
		this.mode = 'parse';
	} else {
		throw new Error("Incompatible format!");
	}

	this.data = data;

	this.options = {
		header: fallback(options.header, false),
		cast: fallback(options.cast, true)
	}

	var lineDelimiter = options.lineDelimiter || options.line, cellDelimiter = options.cellDelimiter || options.delimiter;

	if (this.isParser()) {
		this.options.lineDelimiter = lineDelimiter || detectDelimiter(this.data, LINE_DELIMITERS);
		this.options.cellDelimiter = cellDelimiter || detectDelimiter(this.data, CELL_DELIMITERS);
		this.data = normalizeData(this.data, this.options.lineDelimiter);
	} else if (this.isEncoder()) {
		this.options.lineDelimiter = lineDelimiter || '\r\n';
		this.options.cellDelimiter = cellDelimiter || ',';
	}
}


Data.prototype.fromArray =function (a) {
	var cur, out = '', row, i, j;
	for (i = 0; i < a.length; i += 1) {
		row = a[i];
		for (j = 0; j < row.length; j += 1) {
			cur = row[j];
			cur = prepField(cur);
			out += j < row.length - 1 ? cur + ',' : cur;
		}
		out += "\n";
	}
	return out;
}
Data.prototype.toArray = function (s, config) {
	s = chomp(s);

	if (config === true) {
		config = {
			trim: true
		};
	} else {
		config = config || {};
	}

	var cur = '',
	inQuote = false,
	fieldQuoted = false,
	field = '',
	row = [],
	out = [],
	trimIt = config.trim === true ? true : false,
	i,
	processField = function (field) {
		var trimmedField = trim(field);
		if (fieldQuoted !== true) {
			if (field === '') {
				field = null;
			} else if (trimIt === true) {
				field = trimmedField;
			}
			if (rxIsInt.test(trimmedField) || rxIsFloat.test(trimmedField)) {
				field = +trimmedField;
			}
		}
		return field;
	};

	for (i = 0; i < s.length; i += 1) {
		cur = s.charAt(i);
		if (inQuote === false && (cur === ',' || cur === "\n")) {
			field = processField(field);
			row.push(field);
			if (cur === "\n") {
				out.push(row);
				row = [];
			}
			field = '';
			fieldQuoted = false;
		} else {
			if (cur !== '"') {
				field += cur;
			} else {
				if (!inQuote) {
					inQuote = true;
					fieldQuoted = true;
				} else {
					if (s.charAt(i + 1) === '"') {
						field += '"';
						i += 1;
					} else {
						inQuote = false;
					}
				}
			}
		}
	}
	field = processField(field);
	row.push(field);
	out.push(row);

	return out;
}
Data.prototype.fromObject = function (arr, config) {
	config = config !== undefined ? config : {};
	var columns = config.columns,
	includeColumns = config.includeColumns,
	data = '',
	dataColumns = '',
	processKnownColumns = function (obj) {
		var out = '',
		prop,
		i,
		len = arr.length,
		j,
		jlen = columns.length;

		for (i = 0; i < len; i += 1) {
			obj = arr[i];
			for (j = 0; j < jlen; j += 1) {
				prop = columns[j];
				out += prepField(obj[prop]);
				out += j < jlen - 1 ? ',' : '';
			}
			out += '\n';
		}
		return out;
	},
	processUnknownColumns = function () {
		var cols = [],
		firstRowLength,
		finalRowLength,
		obj,
		prop,
		i,
		currentCol,
		len = arr.length,
		row,
		out = [];

		for (i = 0; i < len; i += 1) {
			obj = arr[i];
			row = [];
			for (prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					currentCol = cols.indexOf(prop);
					if (currentCol === -1) {
						currentCol = cols.push(prop);
						currentCol -= 1;
					}
					row[currentCol] = prepField(obj[prop]);
				}
			}

			if (i === 0) {
				firstRowLength = row.length;
			}

			out.push(row);
		}

		finalRowLength = cols.length;
		if (firstRowLength !== finalRowLength) {
			out.forEach(function (row) {
				row.length = finalRowLength;
			});
		}
		columns = cols;

		return out.map(function (row) {
			return row.join(',');
		}).join('\n') + '\n';
	};

	includeColumns = includeColumns === undefined ? true : !!includeColumns;

	if (columns !== undefined) {
		data = processKnownColumns();
	} else {
		data = processUnknownColumns();
	}

	if (includeColumns) {
		columns.forEach(function (col) {
			dataColumns += prepField(col) + ',';
		});
		dataColumns = dataColumns.substring(0, dataColumns.length - 1);
		data = dataColumns + '\n' + data;
	}

	return data;
}
Data.prototype.toObject = function (s, config) {
	config = config !== undefined ? config : {};
	var columns = config.columns,
	trimIt = !!config.trim,
	dataArray = this.dataToArray(s, trimIt);
	if (!columns) {
		columns = dataArray.shift();
	}

	return dataArray.map(function (row) {
		var obj = {},
		i = 0,
		len = columns.length;
		for (; i < len; i += 1) {
			obj[columns[i]] = row[i];
		}
		return obj;
	});
}
Data.prototype.fromTable = function(options) {
	var options = jQuery.extend({
		separator: ',',
		header: [],
		delivery: 'popup' // popup, value
	},
	options);

	var dataData = [];
	var headerArr = [];
	var el = this;

	//header
	var numCols = options.header.length;
	var tmpRow = []; // construct header avalible array

	if (numCols > 0) {
		for (var i = 0; i < numCols; i++) {
			tmpRow[tmpRow.length] = formatData(options.header[i]);
		}
	} else {
		$(el).filter(':visible').find('th').each(function() {
			if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
		});
	}

	row2Data(tmpRow);

	// actual data
	$(el).find('tr').each(function() {
		var tmpRow = [];
		$(this).filter(':visible').find('td').each(function() {
			if ($(this).css('display') != 'none') tmpRow[tmpRow.length] = formatData($(this).html());
		});
		row2Data(tmpRow);
	});
	if (options.delivery == 'popup') {
		var mydata = dataData.join('\n');
		return popup(mydata);
	} else {
		var mydata = dataData.join('\n');
		return mydata;
	}

	function row2Data(tmpRow) {
		var tmp = tmpRow.join('') // to remove any blank rows
		// alert(tmp);
		if (tmpRow.length > 0 && tmp != '') {
			var mystr = tmpRow.join(options.separator);
			dataData[dataData.length] = mystr;
		}
	}
	function formatData(input) {
		// replace " with “
		var regexp = new RegExp(/["]/g);
		var output = input.replace(regexp, "“");
		//HTML
		var regexp = new RegExp(/\<[^\<]+\>/g);
		var output = output.replace(regexp, "");
		if (output == "") return '';
		return '"' + output + '"';
	}
	function popup(data) {
		var generator = window.open('', 'data', 'height=400,width=600');
		generator.document.write('<html><head><title>Data</title>');
		generator.document.write('</head><body >');
		generator.document.write('<textArea cols=70 rows=15 wrap="off" >');
		generator.document.write(data);
		generator.document.write('</textArea>');
		generator.document.write('</body></html>');
		generator.document.close();
		return true;
	}
};
Data.prototype.toTable = function(dataFile, options) {
	var defaults = {
		tableClass: "DataTable",
		theadClass: "",
		thClass: "",
		tbodyClass: "",
		trClass: "",
		tdClass: "",
		loadingImage: "",
		loadingText: "Loading Data data...",
		separator: ",",
		startLine: 0
	};
	var options = $.extend(defaults, options);
	return this.each(function() {
		var obj = $(this);
		var error = '';
		(options.loadingImage) ? loading = '<div style="text-align: center"><img alt="' + options.loadingText + '" src="' + options.loadingImage + '" /><br>' + options.loadingText + '</div>' : loading = options.loadingText;
		obj.html(loading);
		$.get(dataFile, function(data) {
			var tableHTML = '<table class="' + options.tableClass + '">';
			var lines = data.replace('\r','').split('\n');
			var printedLines = 0;
			var headerCount = 0;
			var headers = new Array();
			$.each(lines, function(lineCount, line) {
				if ((lineCount == 0) && (typeof(options.headers) != 'undefined')) {
					headers = options.headers;
					headerCount = headers.length;
					tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
					$.each(headers, function(headerCount, header) {
						tableHTML += '<th class="' + options.thClass + '">' + header + '</th>';
					});
					tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
				}
				if ((lineCount == options.startLine) && (typeof(options.headers) == 'undefined')) {
					headers = line.splitData(options.separator);
					headerCount = headers.length;
					tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
					$.each(headers, function(headerCount, header) {
						tableHTML += '<th class="' + options.thClass + '">' + header + '</th>';
					});
					tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
				} else if (lineCount >= options.startLine) {
					var items = line.splitData(options.separator);
					if (items.length > 1) {
						printedLines++;
						if (items.length != headerCount) {
							error += 'error on line ' + lineCount + ': Item count (' + items.length + ') does not match header count (' + headerCount + ') \n';
						}
						(printedLines % 2) ? oddOrEven = 'odd' : oddOrEven = 'even';
						tableHTML += '<tr class="' + options.trClass + ' ' + oddOrEven + '">';
						$.each(items, function(itemCount, item) {
							tableHTML += '<td class="' + options.tdClass + '">' + item + '</td>';
						});
						tableHTML += '</tr>';
					}
				}
			});
			tableHTML += '</tbody></table>';
			if (error) {
				obj.html(error);
			} else {
				obj.fadeOut(500, function() {
					obj.html(tableHTML)
				}).fadeIn(function() {
					// trigger loadComplete
					setTimeout(function() {
						obj.trigger("loadComplete");
					},0);
				});
			}
		});
	});
};

Data.prototype.set = function(setting, value) {
	return this.options[setting] = value;
}
Data.prototype.isParser = function() {
	return this.mode == 'parse';
}
Data.prototype.isEncoder = function() {
	return this.mode == 'encode';
}
Data.prototype.parse = function(callback) {
	if (this.mode != 'parse') return;

	if (this.data.trim().length === 0) return [];

	var data = this.data,
			options = this.options,
			header = options.header,
			current = { cell: '', line: [] },
			flag, record, response;

	if (!callback) {
		response = [];
		callback = function(record) {
			response.push(record);
		}
	}

	function resetFlags() {
		flag = { escaped: false, quote: false, cell: true };
	}
	function resetCell() {
		current.cell = '';
	}
	function resetLine() {
		current.line = [];
	}

	resetFlags();

	function saveCell(cell) {
		current.line.push(flag.escaped ? cell.slice(1, -1).replace(/""/g, '"') : cell);
		resetCell();
		resetFlags();
	}
	function saveLastCell(cell) {
		saveCell(cell.slice(0, 1 - options.lineDelimiter.length));
	}
	function saveLine() {
		if (header) {
			if (isArray(header)) {
				record = buildConstructor(options.cast, current.line, header);
				saveLine = function() { invoke(callback, record, current.line); };
				saveLine();
			} else {
				header = current.line;
			}
		} else {
			if (!record) {
				record = buildConstructor(options.cast, current.line);
			}
			saveLine = function() { invoke(callback, record, current.line); };
			saveLine();
		}
	}

	if (options.lineDelimiter.length == 1) {
		saveLastCell = saveCell;
	}

	var dataLength = data.length,
			cellDelimiter = options.cellDelimiter.charCodeAt(0),
			lineDelimiter = options.lineDelimiter.charCodeAt(options.lineDelimiter.length - 1),
			currentIndex, cellStart, currentChar;

	for (currentIndex = 0, cellStart = 0; currentIndex < dataLength; currentIndex++) {
		currentChar = data.charCodeAt(currentIndex);

		if (flag.cell) {
			flag.cell = false;
			if (currentChar == 34) {
				flag.escaped = true;
				continue;
			}
		}

		if (flag.escaped && currentChar == 34) {
			flag.quote = !flag.quote;
			continue;
		}

		if ((flag.escaped && flag.quote) || !flag.escaped) {
			if (currentChar == cellDelimiter) {
				saveCell(current.cell + data.slice(cellStart, currentIndex));
				cellStart = currentIndex + 1;
			} else if (currentChar == lineDelimiter) {
				saveLastCell(current.cell + data.slice(cellStart, currentIndex));
				cellStart = currentIndex + 1;
				saveLine();
				resetLine();
			}
		}
	}

	if (response) {
		return response;
	} else {
		return this;
	}
}
Data.prototype.serialize = {
	"object": function(object) {
		var that = this,
				attributes = Object.keys(object),
				serialized = Array(attributes.length);
		forEach(attributes, function(attr, index) {
			serialized[index] = that[serializeType(object[attr])](object[attr]);
		});
		return serialized;
	},
	"array": function(array) {
		var that = this,
				serialized = Array(array.length);
		forEach(array, function(value, index) {
			serialized[index] = that[serializeType(value)](value);
		});
		return serialized;
	},
	"string": function(string) {
		return '"' + String(string).replace(/"/g, '""') + '"';
	},
	"null": function(value) {
		return '';
	},
	"primitive": function(value) {
		return value;
	}
}
Data.prototype.encode = function(callback) {
	if (this.mode != 'encode') return;

	if (this.data.length == 0) return '';

	var data = this.data,
			options = this.options,
			header = options.header,
			sample = data[0],
			serialize = this.serialize,
			offset = 0,
			attributes, response;

	if (!callback) {
		response = Array(data.length);
		callback = function(record, index) {
			response[index + offset] = record;
		}
	}

	function serializeLine(record) {
		return record.join(options.cellDelimiter);
	}

	if (header) {
		if (!isArray(header)) {
			attributes = Object.keys(sample);
			header = attributes;
		}
		callback(serializeLine(serialize.array(header)), 0);
		offset = 1;
	}

	var recordType = serializeType(sample), map;

	if (recordType == 'array') {
		if (isArray(options.cast)) {
			map = Array(options.cast.length);
			forEach(options.cast, function(type, index) {
				map[index] = type.toLowerCase();
			});
		} else {
			map = Array(sample.length);
			forEach(sample, function(value, index) {
				map[index] = serializeType(value);
			});
		}
		forEach(data, function(record, recordIndex) {
			var serializedRecord = Array(map.length);
			forEach(record, function(value, valueIndex) {
				serializedRecord[valueIndex] = serialize[map[valueIndex]](value);
			});
			callback(serializeLine(serializedRecord), recordIndex);
		});
	} else if (recordType == 'object') {
		attributes = Object.keys(sample);
		if (isArray(options.cast)) {
			map = Array(options.cast.length);
			forEach(options.cast, function(type, index) {
				map[index] = type.toLowerCase();
			});
		} else {
			map = Array(attributes.length);
			forEach(attributes, function(attr, index) {
				map[index] = serializeType(sample[attr]);
			});
		}
		forEach(data, function(record, recordIndex) {
			var serializedRecord = Array(attributes.length);
			forEach(attributes, function(attr, attrIndex) {
				serializedRecord[attrIndex] = serialize[map[attrIndex]](record[attr]);
			});
			callback(serializeLine(serializedRecord), recordIndex);
		});
	}

	if (response) {
		return response.join(options.lineDelimiter);
	} else {
		return this;
	}
}
Data.prototype.forEach = function(callback) {
	return this[this.mode](callback);
}

Data.prototype.parse = function(data, options) {
	var separator = options.separator;
	var delimiter = options.delimiter;
	if(!options.state.rowNum) {
		options.state.rowNum = 1;
	}
	if(!options.state.colNum) {
		options.state.colNum = 1;
	}
	var data = [];
	var entry = [];
	var state = 0;
	var value = ''
	var exit = false;

	function endOfEntry() {
		state = 0;
		value = '';
		if(options.start && options.state.rowNum < options.start) {
			entry = [];
			options.state.rowNum++;
			options.state.colNum = 1;
			return;
		}

		if(options.onParseEntry === undefined) {
			data.push(entry);
		} else {
			var hookVal = options.onParseEntry(entry, options.state);
			if(hookVal !== false) {
				data.push(hookVal);
			}
		}
		entry = [];
		if(options.end && options.state.rowNum >= options.end) {
			exit = true;
		}
		options.state.rowNum++;
		options.state.colNum = 1;
	}

	function endOfValue() {
		if(options.onParseValue === undefined) {
			entry.push(value);
		} else {
			var hook = options.onParseValue(value, options.state);
			if(hook !== false) {
				entry.push(hook);
			}
		}
		value = '';
		state = 0;
		options.state.colNum++;
	}
	var escSeparator = RegExp.escape(separator);
	var escDelimiter = RegExp.escape(delimiter);
	var match = /(D|S|\n|\r|[^DS\r\n]+)/;
	var matchSrc = match.source;
	matchSrc = matchSrc.replace(/S/g, escSeparator);
	matchSrc = matchSrc.replace(/D/g, escDelimiter);
	match = RegExp(matchSrc, 'gm');
	data.replace(match, function (m0) {
		if(exit) {
			return;
		}
		switch (state) {
			case 0:
				if (m0 === separator) {
					value += '';
					endOfValue();
					break;
				}
				if (m0 === delimiter) {
					state = 1;
					break;
				}
				if (m0 === '\n') {
					endOfValue();
					endOfEntry();
					break;
				}
				if (/^\r$/.test(m0)) {
					break;
				}
				value += m0;
				state = 3;
				break;
			case 1:
				if (m0 === delimiter) {
					state = 2;
					break;
				}
				value += m0;
				state = 1;
				break;
			case 2:
				if (m0 === delimiter) {
					value += m0;
					state = 1;
					break;
				}
				if (m0 === separator) {
					endOfValue();
					break;
				}
				if (m0 === '\n') {
					endOfValue();
					endOfEntry();
					break;
				}
				if (/^\r$/.test(m0)) {
					break;
				}
				throw new Error('DataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
			case 3:
				if (m0 === separator) {
					endOfValue();
					break;
				}
				if (m0 === '\n') {
					endOfValue();
					endOfEntry();
					break;
				}
				if (/^\r$/.test(m0)) {
					break;
				}
				if (m0 === delimiter) {
					throw new Error('DataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
				}
				throw new Error('DataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
			default:
				throw new Error('DataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
		}
	});
	if(entry.length !== 0) {
		endOfValue();
		endOfEntry();
	}

	return data;
}
Data.prototype.splitLines = function(data, options) {
	var separator = options.separator;
	var delimiter = options.delimiter;
	if(!options.state.rowNum) {
		options.state.rowNum = 1;
	}
	var entries = [];
	var state = 0;
	var entry = '';
	var exit = false;

	function endOfLine() {
		state = 0;
		if(options.start && options.state.rowNum < options.start) {
			entry = '';
			options.state.rowNum++;
			return;
		}

		if(options.onParseEntry === undefined) {
			entries.push(entry);
		} else {
			var hookVal = options.onParseEntry(entry, options.state);
			if(hookVal !== false) {
				entries.push(hookVal);
			}
		}
		entry = '';
		if(options.end && options.state.rowNum >= options.end) {
			exit = true;
		}
		options.state.rowNum++;
	}
	var escSeparator = RegExp.escape(separator);
	var escDelimiter = RegExp.escape(delimiter);
	var match = /(D|S|\n|\r|[^DS\r\n]+)/;
	var matchSrc = match.source;
	matchSrc = matchSrc.replace(/S/g, escSeparator);
	matchSrc = matchSrc.replace(/D/g, escDelimiter);
	match = RegExp(matchSrc, 'gm');
	data.replace(match, function (m0) {
		if(exit) {
			return;
		}
		switch (state) {
			case 0:
				if (m0 === separator) {
					entry += m0;
					state = 0;
					break;
				}
				if (m0 === delimiter) {
					entry += m0;
					state = 1;
					break;
				}
				if (m0 === '\n') {
					endOfLine();
					break;
				}
				if (/^\r$/.test(m0)) {
					break;
				}
				entry += m0;
				state = 3;
				break;
			case 1:
				if (m0 === delimiter) {
					entry += m0;
					state = 2;
					break;
				}
				entry += m0;
				state = 1;
				break;
			case 2:
				var prevChar = entry.substr(entry.length - 1);
				if (m0 === delimiter && prevChar === delimiter) {
					entry += m0;
					state = 1;
					break;
				}
				if (m0 === separator) {
					entry += m0;
					state = 0;
					break;
				}
				if (m0 === '\n') {
					endOfLine();
					break;
				}
				if (m0 === '\r') {
					break;
				}
				throw new Error('DataError: Illegal state [Row:' + options.state.rowNum + ']');
			case 3:
				if (m0 === separator) {
					entry += m0;
					state = 0;
					break;
				}
				if (m0 === '\n') {
					endOfLine();
					break;
				}
				if (m0 === '\r') {
					break;
				}
				if (m0 === delimiter) {
					throw new Error('DataError: Illegal quote [Row:' + options.state.rowNum + ']');
				}
				throw new Error('DataError: Illegal state [Row:' + options.state.rowNum + ']');
			default:
				throw new Error('DataError: Unknown state [Row:' + options.state.rowNum + ']');
		}
	});
	if(entry !== '') {
		endOfLine();
	}

	return entries;
}
Data.prototype.parseEntry = function(data, options) {
	var separator = options.separator;
	var delimiter = options.delimiter;
	if(!options.state.rowNum) {
		options.state.rowNum = 1;
	}
	if(!options.state.colNum) {
		options.state.colNum = 1;
	}
	var entry = [];
	var state = 0;
	var value = '';

	function endOfValue() {
		if(options.onParseValue === undefined) {
			entry.push(value);
		} else {
			var hook = options.onParseValue(value, options.state);
			if(hook !== false) {
				entry.push(hook);
			}
		}
		value = '';
		state = 0;
		options.state.colNum++;
	}
	if(!options.match) {
		var escSeparator = RegExp.escape(separator);
		var escDelimiter = RegExp.escape(delimiter);
		var match = /(D|S|\n|\r|[^DS\r\n]+)/;
		var matchSrc = match.source;
		matchSrc = matchSrc.replace(/S/g, escSeparator);
		matchSrc = matchSrc.replace(/D/g, escDelimiter);
		options.match = RegExp(matchSrc, 'gm');
	}
	data.replace(options.match, function (m0) {
		switch (state) {
			case 0:
				if (m0 === separator) {
					value += '';
					endOfValue();
					break;
				}
				if (m0 === delimiter) {
					state = 1;
					break;
				}
				if (m0 === '\n' || m0 === '\r') {
					break;
				}
				value += m0;
				state = 3;
				break;
			case 1:
				if (m0 === delimiter) {
					state = 2;
					break;
				}
				value += m0;
				state = 1;
				break;
			case 2:
				if (m0 === delimiter) {
					value += m0;
					state = 1;
					break;
				}
				if (m0 === separator) {
					endOfValue();
					break;
				}
				if (m0 === '\n' || m0 === '\r') {
					break;
				}
				throw new Error('DataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
			case 3:
				if (m0 === separator) {
					endOfValue();
					break;
				}
				if (m0 === '\n' || m0 === '\r') {
					break;
				}
				if (m0 === delimiter) {
					throw new Error('DataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
				}
				throw new Error('DataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
			default:
				throw new Error('DataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
		}
	});
	endOfValue();

	return entry;
}

Data.prototype.toArray = function(data, options, callback) {
	var options = (options !== undefined ? options : {});
	var config = {};
	config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
	config.separator = 'separator' in options ? options.separator : $.data.defaults.separator;
	config.delimiter = 'delimiter' in options ? options.delimiter : $.data.defaults.delimiter;
	var state = (options.state !== undefined ? options.state : {});
	var options = {
		delimiter: config.delimiter,
		separator: config.separator,
		onParseEntry: options.onParseEntry,
		onParseValue: options.onParseValue,
		state: state
	}

	var entry = $.data.parsers.parseEntry(data, options);
	if(!config.callback) {
		return entry;
	} else {
		config.callback('', entry);
	}
}
Data.prototype.toArrays = function(data, options, callback) {
	var options = (options !== undefined ? options : {});
	var config = {};
	config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
	config.separator = 'separator' in options ? options.separator : $.data.defaults.separator;
	config.delimiter = 'delimiter' in options ? options.delimiter : $.data.defaults.delimiter;
	var data = [];
	var options = {
		delimiter: config.delimiter,
		separator: config.separator,
		onParseEntry: options.onParseEntry,
		onParseValue: options.onParseValue,
		start: options.start,
		end: options.end,
		state: {
			rowNum: 1,
			colNum: 1
		}
	};
	data = $.data.parsers.parse(data, options);
	if(!config.callback) {
		return data;
	} else {
		config.callback('', data);
	}
}
Data.prototype.toObjects = function(data, options, callback) {
	var options = (options !== undefined ? options : {});
	var config = {};
	config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
	config.separator = 'separator' in options ? options.separator : $.data.defaults.separator;
	config.delimiter = 'delimiter' in options ? options.delimiter : $.data.defaults.delimiter;
	config.headers = 'headers' in options ? options.headers : $.data.defaults.headers;
	options.start = 'start' in options ? options.start : 1;
	if(config.headers) {
		options.start++;
	}
	if(options.end && config.headers) {
		options.end++;
	}
	var lines = [];
	var data = [];

	var options = {
		delimiter: config.delimiter,
		separator: config.separator,
		onParseEntry: options.onParseEntry,
		onParseValue: options.onParseValue,
		start: options.start,
		end: options.end,
		state: {
			rowNum: 1,
			colNum: 1
		},
		match: false
	};
	var headerOptions = {
		delimiter: config.delimiter,
		separator: config.separator,
		start: 1,
		end: 1,
		state: {
			rowNum:1,
			colNum:1
		}
	}
	var headerLine = $.data.parsers.splitLines(data, headerOptions);
	var headers = $.data.toArray(headerLine[0], options);
	var lines = $.data.parsers.splitLines(data, options);
	options.state.colNum = 1;
	if(headers){
		options.state.rowNum = 2;
	} else {
		options.state.rowNum = 1;
	}
	for(var i=0, len=lines.length; i<len; i++) {
		var entry = $.data.toArray(lines[i], options);
		var object = {};
		for(var j in headers) {
			object[headers[j]] = entry[j];
		}
		data.push(object);
		options.state.rowNum++;
	}
	if(!config.callback) {
		return data;
	} else {
		config.callback('', data);
	}
}
Data.prototype.fromArrays = function(arrays, options, callback) {
	var options = (options !== undefined ? options : {});
	var config = {};
	config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
	config.separator = 'separator' in options ? options.separator : $.data.defaults.separator;
	config.delimiter = 'delimiter' in options ? options.delimiter : $.data.defaults.delimiter;
	config.escaper = 'escaper' in options ? options.escaper : $.data.defaults.escaper;
	config.experimental = 'experimental' in options ? options.experimental : false;

	if(!config.experimental) {
		throw new Error('not implemented');
	}

	var output = [];
	for(i in arrays) {
		output.push(arrays[i]);
	}
	if(!config.callback) {
		return output;
	} else {
		config.callback('', output);
	}
}
Data.prototype.fromObjects2Data = function(objects, options, callback) {
	var options = (options !== undefined ? options : {});
	var config = {};
	config.callback = ((callback !== undefined && typeof(callback) === 'function') ? callback : false);
	config.separator = 'separator' in options ? options.separator : $.data.defaults.separator;
	config.delimiter = 'delimiter' in options ? options.delimiter : $.data.defaults.delimiter;
	config.experimental = 'experimental' in options ? options.experimental : false;

	if(!config.experimental) {
		throw new Error('not implemented');
	}

	var output = [];
	for(i in objects) {
		output.push(arrays[i]);
	}
	if(!config.callback) {
		return output;
	} else {
		config.callback('', output);
	}
}


!function(window) {
	function DataSet(data) {
		this.__index = null;
		this.__indexedRows = Object.create(null);
		this.__map = Object.create(null);
		this.__instance = null;
		this.__increment__();
		this._data = [];
		if(data instanceof Array) {
			this.load(data);
		}
	};
	DataSet.prototype.__instances = 0;
	DataSet.prototype.__increment__ = function() {
		if(!this.__parent) {
			this.__instance = this.constructor.prototype.__instances++;
		}
	};
	DataSet.prototype.__find__ = function(row) {
		var data = this._data;
		var len = data.length;
		if(data[(len >> 1) + 1] === row) {
			return (len >> 1) + 1;
		}
		for(var i = 0; i < (len >> 1); i++) {
			if(data[i] === row) { return i; }
			if(data[len - i - 1] === row) { return len - i - 1; }
		}
		return -1;
	};
	DataSet.prototype.__prepare__ = function(data) {
		var newData = Array(data.length);
		var keys = [];
		var key;
		var keyLength;
		var index = this.__index;
		var indexedRows = this.__indexedRows;
		var mapFuncs = this.__map;
		var mapKeys = [];
		var mapKey;
		var mapLength;
		if(data.length && typeof data[0] === 'object' && data[0] !== null) {
			keys = Object.keys(data[0]);
		}
		keyLength = keys.length;
		mapKeys = Object.keys(this.__map);
		mapLength = mapKeys.length;
		if(!index) {
			for(var i = 0, len = data.length; i < len; i++) {
				var row = data[i];
				if(!row || typeof row !== 'object') { continue; }
				var newRow = Object.create(null);

				for(var j = 0; j < keyLength; j++) {
					key = keys[j];
					newRow[key] = row[key];
				}

				for(var j = 0; j < mapLength; j++) {
					mapKey = mapKeys[j];
					newRow[mapKey] = mapFuncs[mapKey].call(this, newRow);
				}
				newData[i] = newRow;
			}
		} else {
			for(var i = 0, len = data.length; i < len; i++) {
				var row = data[i];
				if(!row || typeof row !== 'object') { continue; }
				var newRow = Object.create(null);

				for(var j = 0; j < keyLength; j++) {
					key = keys[j];
					newRow[key] = row[key];
				}

				for(var j = 0; j < mapLength; j++) {
					mapKey = mapKeys[j];
					newRow[mapKey] = mapFuncs[mapKey].call(this, newRow);
				}
				indexedRows[newRow[index]] = newRow;
				newData[i] = newRow;
			}
		}
		return newData;
	};
	DataSet.prototype.defineIndex = function(key) {
		if(this.__parent) {
			throw new Error('Can only define indices on parent DataSet');
		}
		this.__index = key;
		var index = key;
		var indexedRows = Object.create(null);
		var data = this._data;
		for(var i = 0, len = data.length; i < len; i++) {
			indexedRows[data[i][index]] = data[i];
		}
		this.__indexedRows = indexedRows;
		return this;
	};
	DataSet.prototype.createMapping = function(key, fnMap) {
		if(this.__parent) {
			throw new Error('Can only define maps on parent DataSet');
		}
		this.__map[key] = fnMap;

		var data = this._data;
		for(var i = 0, len = data.length; i < len; i++) {
			var row = data[i];
			row[key] = fnMap.call(this, row);
		}
		return this;
	};
	DataSet.prototype.exists = function(indexedValue) {
		return !!this.fetch(indexedValue);
	};
	DataSet.prototype.fetch = function(indexedValue) {
		if(this.__index === null) {
			throw new Error('No index defined on DataSet');
		}
		return this.__indexedRows[indexedValue] || null;
	};
	DataSet.prototype.destroy = function(indexedValue) {
		if(this.__index === null) {
			throw new Error('No index defined on DataSet');
		}
		var row = this.__indexedRows[indexedValue];
		if(!row) {
			throw new Error('Can not destroy, index does not exist');
		}
		this._data.splice(this.__find__(row), 1);
		delete this.__indexedRows[indexedValue];
		this.__increment__();
		return row;
	};
	DataSet.prototype.__remove__ = function(removeSize) {
		var data = this._data;
		var row;
		var sz = -1;
		var index = this.__index;
		var indexedRows = {};
		var newData = Array(data.length - removeSize);
		if(index === null) {
			for(var i = 0, len = data.length; i < len; i++) {
				row = data[i];
				if(!row['__remove__']) {
					newData[++sz] = row;
				}
			}
		} else {
			for(var i = 0, len = data.length; i < len; i++) {
				row = data[i];
				if(!row['__remove__']) {
					newData[++sz] = row;
					indexedRows[row[index]] = row;
				}
			}
			this.__indexedRows = indexedRows;
		}
		this._data = newData;
		this.__increment__();
		return true;
	};
	DataSet.prototype.insert = function(data) {
		if(!(data instanceof Array)) {
			data = [].slice.call(arguments);
		}
		this._data = this._data.concat(this.__prepare__(data));
		this.__increment__();
		return true;
	};
	DataSet.prototype.load = function(data) {
		if(!(data instanceof Array)) {
			data = [].slice.call(arguments);
		}
		this._data = this.__prepare__(data);
		this.__increment__();
		return true;
	};
	DataSet.prototype.truncate = function(data) {
		this.__indexedRows = Object.create(null);
		this._data = [];
		return true;
	};
	DataSet.prototype.query = function() {
		return new DataQuery(this, this._data.slice());
	};

	function DataQuery(parent, data) {
		if(!(parent instanceof DataSet) && parent !== null) {
			throw new Error('DataQuery requires valid DataSet parent');
		}
		if(!(data instanceof Array)) {
			throw new Error('DataQuery requires valid Array of data');
		}
		this.__parent = parent;
		this.__parentInstance = parent.__instance;
		this._data = data
	};
	DataQuery.prototype.__validate__ = function() {
		if(this.__parent === null) { return; }
		if(this.__parent.__instance !== this.__parentInstance) {
			throw new Error('Invalid DataSet query, parent has been modified');
		}
	};
	DataQuery.prototype.__compare = {
		'is': function(a, b) { return a === b; },
		'not': function(a, b) { return a !== b; },
		'gt': function(a, b) { return a > b; },
		'lt': function(a, b) { return a < b; },
		'gte': function(a, b) { return a >= b; },
		'lte': function(a, b) { return a <= b; },
		'icontains': function(a, b) { return a.toLowerCase().indexOf(b.toLowerCase()) > -1; },
		'contains': function(a, b) { return a.indexOf(b) > -1; },
		'in': function(a, b) { return b.indexOf(a) > -1; },
		'not_in': function(a, b) { return b.indexOf(a) === -1; }
	};
	DataQuery.prototype.__filter = function(filters, exclude) {
		this.__validate__();
		exclude = !!exclude;
		var data = this._data.slice();
		var keys = Object.keys(filters);
		var key;
		var filterData = [];
		var filter;
		var filterType;
		for(var i = 0, len = keys.length; i < len; i++) {
			key = keys[i];
			filter = key.split('__');
			if(filter.length < 2) {
				filter.push('is');
			}
			filterType = filter.pop();
			filter = filter.join('__');
			if(!this.__compare[filterType]) {
				throw new Error('Filter type "' + filterType + '" not supported.');
			}
			filterData.push([this.__compare[filterType], filter, filters[key]]);
		}
		var tmpFilter;
		var i, compareFn, key, val;
		var filterLength = filterData.length;
		var filterMax = filterLength - 1;
		var len = data.length;
		for(var j = 0; j !== filterLength; j++) {
			tmpFilter = filterData[j];
			compareFn = tmpFilter[0];
			key = tmpFilter[1];
			val = tmpFilter[2];
			i = len;
			while(i--) { data[i] && (compareFn(data[i][key], val) === exclude) && (data[i] = null); }
		}
		var tmp = [];
		var count = 0;
		for(var i = 0; i !== len; i++) { data[i] && (tmp[count++] = data[i]); }
		return new DataQuery(this.__parent, tmp);
	};
	DataQuery.prototype.filter = function(filters) {
		return this.__filter(filters, false);
	};
	DataQuery.prototype.exclude = function(filters) {
		return this.__filter(filters, true);
	};
	DataQuery.prototype.spawn = function(ignoreIndex) {
		this.__validate__();
		var dc = new DataSet(this._data);
		if(ignoreIndex) { return dc; }
		if(this.__parent.__index) { dc.defineIndex(this.__parent.__index); }
		return dc;
	};
	DataQuery.prototype.each = function(callback) {
		if(typeof callback !== 'function') {
			throw new Error('DataQuery.each expects a callback');
		}
		var data = this._data;
		for(var i = 0, len = data.length; i < len; i++) {
			callback.call(this, data[i], i);
		}
		return this;
	};
	DataQuery.prototype.update = function(fields) {
		this.__validate__();
		var keys = Object.keys(fields);
		var key;
		var fieldLength = keys.length;
		for(var i = 0; i < fieldLength; i++) {
			key = keys[i];
			keys[i] = [key, fields[key]];
		}
		var data = this._data;
		for(var i = 0, len = data.length; i < len; i++) {
			var row = data[i];
			for(var j = 0; j < fieldLength; j++) {
				key = keys[j];
				row[key[0]] = key[1];
			}
		}
		return this;
	};
	DataQuery.prototype.remove = function() {
		this.__validate__();
		this.update({__remove__: true});
		return this.__parent.__remove__(this.count());
	};
	DataQuery.prototype.sort = function(key, sortDesc) {
		this.__validate__();
		key = (key + '').replace(/[^A-Za-z0-9]/gi, '_');
		sortDesc = !!sortDesc;
		var sortFn = new Function(
			'a',
			'b',
			[
				'var val = ' + (sortDesc ? -1 : 1) + ';',
				'if(a[\'' + key + '\'] === b[\'' + key + '\']) { return 0; }',
				'if(a[\'' + key + '\'] === null) { return -(val); }',
				'if(b[\'' + key + '\'] === null) { return (val); }',
				'if(typeof a[\'' + key + '\'] === \'number\') {',
				'  if(typeof b[\'' + key + '\'] === \'number\') {',
				'    if(isNaN(a[\'' + key + '\']) && isNaN(b[\'' + key + '\'])) { return 0; }',
				'    if(isNaN(b[\'' + key + '\'])) { return (val); }',
				'    return a[\'' + key + '\'] > b[\'' + key + '\'] ? (val) : -(val);',
				'  }',
				'  if(typeof b[\'' + key + '\'] === \'boolean\') { return -(val); }',
				'  if(typeof b[\'' + key + '\'] === \'string\') { return -(val); }',
				'  if(typeof b[\'' + key + '\'] === \'object\') { return -(val); }',
				'}',
				'if(typeof a[\'' + key + '\'] === \'boolean\') {',
				'  if(typeof b[\'' + key + '\'] === \'number\') { return (val); }',
				'  if(typeof b[\'' + key + '\'] === \'boolean\') { return a[\'' + key + '\'] > b[\'' + key + '\'] ? (val) : -(val); }',
				'  if(typeof b[\'' + key + '\'] === \'string\') { return -(val); }',
				'  if(typeof b[\'' + key + '\'] === \'object\') { return -(val); }',
				'}',
				'if(typeof a[\'' + key + '\'] === \'string\') {',
				'  if(typeof b[\'' + key + '\'] === \'number\') { return (val); }',
				'  if(typeof b[\'' + key + '\'] === \'boolean\') { return (val); }',
				'  if(typeof b[\'' + key + '\'] === \'string\') { return a[\'' + key + '\'] > b[\'' + key + '\'] ? (val) : -(val); }',
				'  if(typeof b[\'' + key + '\'] === \'object\') { return -(val); }',
				'}',
				'if(typeof a[\'' + key + '\'] === \'object\') {',
				'  if(typeof b[\'' + key + '\'] === \'object\') { return 0; }',
				'  return (val);',
				'}',
				'return 0;'
			].join('\n')
		);
		var tmp = this._data.slice().sort(sortFn);
		return new DataQuery(this.__parent, tmp);
	};
	DataQuery.prototype.values = function(key) {
		this.__validate__();
		if(!key) { return this._data.slice(); }
		var data = this._data;
		var len = data.length;
		var tmp = Array(len);
		for(var i = 0; i < len; i++) {
			tmp[i] = data[i][key];
		}
		return tmp;
	};
	DataQuery.prototype.max = function(key) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var curMax = null;
		var curVal;
		if(!len) { return 0; }
		curMax = data[0][key];
		for(var i = 1; i < len; i++) {
			curVal = data[i][key];
			if(curVal > curMax) {
				curMax = curVal;
			}
		}
		return curMax;
	};
	DataQuery.prototype.min = function(key) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var curMin = null;
		var curVal;
		if(!len) { return 0; }
		curMin = data[0][key];
		for(var i = 1; i < len; i++) {
			curVal = data[i][key];
			if(curVal < curMin) {
				curMin = curVal;
			}
		}
		return curMin;
	};
	DataQuery.prototype.sum = function(key) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var val;
		if(!len) { return 0; }
		val = parseFloat(data[0][key]);
		for(var i = 1; i < len && !isNaN(val); i++) {
			val += parseFloat(data[i][key]);
		}
		return val;
	};
	DataQuery.prototype.avg = function(key) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var val;
		if(!len) { return 0; }
		val = parseFloat(data[0][key]);
		for(var i = 1; i < len && !isNaN(val); i++) {
			val += parseFloat(data[i][key]);
		}
		return val / len;
	};
	DataQuery.prototype.reduce = function(key, reduceFn) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var cur, val;
		if(!len) { return null; }
		val = data[0][key];
		for(var i = 1; i < len; i++) {
			cur = data[i][key];
			val = reduceFn.call(this, val, cur, i);
		}
		return val;
	};
	DataQuery.prototype.distinct = function(key) {
		this.__validate__();
		var data = this._data;
		var len = data.length;
		var values = Object.create(null);
		var value;
		if(len) {
			values[data[0][key]] = true;
			for(var i = 1; i < len; i++) {
				value = data[i][key];
				if(!values[value]) {
					values[value] = true;
				}
			}
		}
		return Object.keys(values);
	};
	DataQuery.prototype.limit = function(offset, count) {
		this.__validate__();
		if(typeof(count) === 'undefined') {
			count = offset;
			offset = 0;
		}
		return new DataQuery(this.__parent, this._data.slice(offset, offset + count));
	};
	DataQuery.prototype.count = function() {
		this.__validate__();
		return this._data.length;
	};
	DataQuery.prototype.first = function() {
		if(!this._data.length) {
			return null;
		}
		return this._data[0];
	};
	DataQuery.prototype.last = function() {
		if(!this._data.length) {
			return null;
		}
		return this._data[this._data.length - 1];
	};
	window['DataSet'] = DataSet;
}(window);




var Gene = function(code) {
    if (code) this.code = code;
    this.cost = 9999;
};
Gene.prototype.code = '';
Gene.prototype.random = function(length) {
    while (length--) {
        this.code += String.fromCharCode(Math.floor(Math.random() * 255));
    }
};
Gene.prototype.mutate = function(chance) {
    if (Math.random() > chance) return;

    var index = Math.floor(Math.random() * this.code.length);
    var upOrDown = Math.random() <= 0.5 ? -1 : 1;
    var newChar = String.fromCharCode(this.code.charCodeAt(index) + upOrDown);
    var newString = '';
    for (i = 0; i < this.code.length; i++) {
        if (i == index) newString += newChar;
        else newString += this.code[i];
    }

    this.code = newString;

};
Gene.prototype.mate = function(gene) {
    var pivot = Math.round(this.code.length / 2) - 1;

    var child1 = this.code.substr(0, pivot) + gene.code.substr(pivot);
    var child2 = gene.code.substr(0, pivot) + this.code.substr(pivot);

    return [new Gene(child1), new Gene(child2)];
};
Gene.prototype.calcCost = function(compareTo) {
    var total = 0;
    for (i = 0; i < this.code.length; i++) {
        total += (this.code.charCodeAt(i) - compareTo.charCodeAt(i)) * (this.code.charCodeAt(i) - compareTo.charCodeAt(i));
    }
    this.cost = total;
};
var Population = function(goal, size) {
    this.members = [];
    this.goal = goal;
    this.generationNumber = 0;
    while (size--) {
        var gene = new Gene();
        gene.random(this.goal.length);
        this.members.push(gene);
    }
};
Population.prototype.display = function() {
    document.body.innerHTML = '';
    document.body.innerHTML += ("<h2>Generation: " + this.generationNumber + "</h2>");
    document.body.innerHTML += ("<ul>");
    for (var i = 0; i < this.members.length; i++) {
        document.body.innerHTML += ("<li>" + this.members[i].code + " (" + this.members[i].cost + ")");
    }
    document.body.innerHTML += ("</ul>");
};
Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}
Population.prototype.generation = function() {
    for (var i = 0; i < this.members.length; i++) {
        this.members[i].calcCost(this.goal);

    }

    this.sort();
    this.display();
    var children = this.members[0].mate(this.members[1]);
    this.members.splice(this.members.length - 2, 2, children[0], children[1]);

    for (var i = 0; i < this.members.length; i++) {
        this.members[i].mutate(0.5);
        this.members[i].calcCost(this.goal);
        if (this.members[i].code == this.goal) {
            this.sort();
            this.display();
            return true;
        }
    }
    this.generationNumber++;
    var scope = this;
    setTimeout(function() {
        scope.generation();
    }, 20);
};


var population = new Population("Hello, world!", 20);
population.generation();

/*
 * Expected keys in object:
 * rooms, area, type
 */
var Node = function(object) {
    for (var key in object)
    {
        this[key] = object[key];
    }
};
Node.prototype.measureDistances = function(area_range_obj, rooms_range_obj) {
    var rooms_range = rooms_range_obj.max - rooms_range_obj.min;
    var area_range  = area_range_obj.max  - area_range_obj.min;

    for (var i in this.neighbors)
    {
        /* Just shortcut syntax */
        var neighbor = this.neighbors[i];

        var delta_rooms = neighbor.rooms - this.rooms;
        delta_rooms = (delta_rooms ) / rooms_range;

        var delta_area  = neighbor.area  - this.area;
        delta_area = (delta_area ) / area_range;

        neighbor.distance = Math.sqrt( delta_rooms*delta_rooms + delta_area*delta_area );
    }
};
Node.prototype.sortByDistance = function() {
    this.neighbors.sort(function (a, b) {
        return a.distance - b.distance;
    });
};
Node.prototype.guessType = function(k) {
    var types = {};

    for (var i in this.neighbors.slice(0, k))
    {
        var neighbor = this.neighbors[i];

        if ( ! types[neighbor.type] )
        {
            types[neighbor.type] = 0;
        }

        types[neighbor.type] += 1;
    }

    var guess = {type: false, count: 0};
    for (var type in types)
    {
        if (types[type] > guess.count)
        {
            guess.type = type;
            guess.count = types[type];
        }
    }

    this.guess = guess;

    return types;
};



var NodeList = function(k) {
    this.nodes = [];
    this.k = k;
};
NodeList.prototype.add = function(node) {
    this.nodes.push(node);
};
NodeList.prototype.determineUnknown = function() {

    this.calculateRanges();

    /*
     * Loop through our nodes and look for unknown types.
     */
    for (var i in this.nodes)
    {

        if ( ! this.nodes[i].type)
        {
            /*
             * If the node is an unknown type, clone the nodes list and then measure distances.
             */

            /* Clone nodes */
            this.nodes[i].neighbors = [];
            for (var j in this.nodes)
            {
                if ( ! this.nodes[j].type)
                    continue;
                this.nodes[i].neighbors.push( new Node(this.nodes[j]) );
            }

            /* Measure distances */
            this.nodes[i].measureDistances(this.areas, this.rooms);

            /* Sort by distance */
            this.nodes[i].sortByDistance();

            /* Guess type */
            console.log(this.nodes[i].guessType(this.k));

        }
    }
};
NodeList.prototype.calculateRanges = function() {
    this.areas = {min: 1000000, max: 0};
    this.rooms = {min: 1000000, max: 0};
    for (var i in this.nodes)
    {
        if (this.nodes[i].rooms < this.rooms.min)
        {
            this.rooms.min = this.nodes[i].rooms;
        }

        if (this.nodes[i].rooms > this.rooms.max)
        {
            this.rooms.max = this.nodes[i].rooms;
        }

        if (this.nodes[i].area < this.areas.min)
        {
            this.areas.min = this.nodes[i].area;
        }

        if (this.nodes[i].area > this.areas.max)
        {
            this.areas.max = this.nodes[i].area;
        }
    }

};
NodeList.prototype.draw = function(canvas_id) {
    var rooms_range = this.rooms.max - this.rooms.min;
    var areas_range = this.areas.max - this.areas.min;

    var canvas = document.getElementById(canvas_id);
    var ctx = canvas.getContext("2d");
    var width = 400;
    var height = 400;
    ctx.clearRect(0,0,width, height);

    for (var i in this.nodes)
    {
        ctx.save();

        switch (this.nodes[i].type)
        {
            case 'apartment':
                ctx.fillStyle = 'red';
                break;
            case 'house':
                ctx.fillStyle = 'green';
                break;
            case 'flat':
                ctx.fillStyle = 'blue';
                break;
            default:
                ctx.fillStyle = '#666666';
        }

        var padding = 40;
        var x_shift_pct = (width  - padding) / width;
        var y_shift_pct = (height - padding) / height;

        var x = (this.nodes[i].rooms - this.rooms.min) * (width  / rooms_range) * x_shift_pct + (padding / 2);
        var y = (this.nodes[i].area  - this.areas.min) * (height / areas_range) * y_shift_pct + (padding / 2);
        y = Math.abs(y - height);


        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();


        /*
         * Is this an unknown node? If so, draw the radius of influence
         */

        if ( ! this.nodes[i].type )
        {
            switch (this.nodes[i].guess.type)
            {
                case 'apartment':
                    ctx.strokeStyle = 'red';
                    break;
                case 'house':
                    ctx.strokeStyle = 'green';
                    break;
                case 'flat':
                    ctx.strokeStyle = 'blue';
                    break;
                default:
                    ctx.strokeStyle = '#666666';
            }

            var radius = this.nodes[i].neighbors[this.k - 1].distance * width;
            radius *= x_shift_pct;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI*2, true);
            ctx.stroke();
            ctx.closePath();

        }

        ctx.restore();

    }

};



var nodes;


var run = function() {

    nodes = new NodeList(3);
    for (var i in data)
    {
        nodes.add( new Node(data[i]) );
    }
    var random_rooms = Math.round( Math.random() * 10 );
    var random_area = Math.round( Math.random() * 2000 );
    nodes.add( new Node({rooms: random_rooms, area: random_area, type: false}) );

    nodes.determineUnknown();
    nodes.draw("canvas");
};


setInterval(run, 5000);
run();




function length(obj) {
    var length = 0;
    for (var i in obj)
        length++;
    return length;
}
function clone(obj) {
    obj = JSON.parse(JSON.stringify(obj));
    return obj;
}
function pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
        if (Math.random() < 1 / ++count)
           result = prop;
    return result;
}

var Chromosome = function(members) {
    this.members = members;
    for (var element in this.members)
    {
        if (typeof this.members[element]['active'] == 'undefined')
        {
            this.members[element]['active'] = Math.round( Math.random() );
        }
    }
    this.mutate();
    this.calcScore();
};
Chromosome.prototype.mutate = function() {
    if (Math.random() > this.mutationRate)
        return false;
    var element = pickRandomProperty(this.members);
    this.members[element]['active'] = Number(! this.members[element]['active']);
};
Chromosome.prototype.calcScore = function() {
    if (this.score)
        return this.score;

    this.value = 0;
    this.weight = 0;
    this.score = 0;

    for (var element in this.members)
    {
        if (this.members[element]['active'])
        {
            this.value += this.members[element]['value'];
            this.weight += this.members[element]['weight'];
        }
    }

    this.score = this.value;

    if (this.weight > this.maxWeight)
    {
        this.score -= (this.weight - this.maxWeight) * 50;
    }

    return this.score;
};
Chromosome.prototype.mateWith = function(other) {
    var child1 = {};
    var child2 = {};
    var pivot = Math.round( Math.random() * (length(this.members) - 1) );
    var i = 0;
    for (var element in elements)
    {
        if (i < pivot)
        {
            child1[element] = clone(this.members[element]);
            child2[element] = clone(other.members[element]);
        }
        else
        {
            child2[element] = clone(this.members[element]);
            child1[element] = clone(other.members[element]);
        }
        i++;
    }

    child1 = new Chromosome(child1);
    child2 = new Chromosome(child2);

    return [child1, child2];
};
Chromosome.prototype.weight = 0;
Chromosome.prototype.value = 0;
Chromosome.prototype.members = [];
Chromosome.prototype.maxWeight = 1000;
Chromosome.prototype.mutationRate = 0.7;
Chromosome.prototype.score = 0;


var Population = function(elements, size)
{
    if ( ! size )
        size = 20;
    this.elements = elements;
    this.size = size;
    this.fill();
};
Population.prototype.fill = function() {
    while (this.chromosomes.length < this.size)
    {
        if (this.chromosomes.length < this.size / 3)
        {
            this.chromosomes.push( new Chromosome( clone(this.elements) ) );
        }
        else
        {
            this.mate();
        }
    }
};
Population.prototype.sort = function() {
    this.chromosomes.sort(function(a, b) { return b.calcScore() - a.calcScore(); });
};
Population.prototype.kill = function() {
    var target = Math.floor( this.elitism * this.chromosomes.length );
    while (this.chromosomes.length > target)
    {
        this.chromosomes.pop();
    }
};
Population.prototype.mate = function() {
    var key1 = pickRandomProperty(this.chromosomes);
    var key2 = key1;

    while (key2 == key1)
    {
        key2 = pickRandomProperty(this.chromosomes);
    }

    var children = this.chromosomes[key1].mateWith(this.chromosomes[key2]);
    this.chromosomes = this.chromosomes.concat(children);
};
Population.prototype.generation = function(log) {
    this.sort();
    this.kill();
    this.mate();
    this.fill();
    this.sort();
};
Population.prototype.display = function(i, noImprovement) {
    document.getElementById('gen_no').innerHTML = i;
    document.getElementById('weight').innerHTML = this.chromosomes[0].weight;
    document.getElementById('value').innerHTML = this.chromosomes[0].score;
    document.getElementById('nochange').innerHTML = noImprovement;

};
Population.prototype.run = function(threshold, noImprovement, lastScore, i) {
    if ( ! threshold )
        threshold = 1000;
    if ( ! noImprovement )
        noImprovement = 0;
    if ( ! lastScore )
        lastScore = false;
    if ( ! i )
        i = 0;

    if (noImprovement < threshold)
    {
        lastScore = this.chromosomes[0].calcScore();
        this.generation();

        if (lastScore >= this.chromosomes[0].calcScore())
        {
            noImprovement++;
        }
        else
        {
            noImprovement = 0;
        }

        i++;

        if (i % 10 == 0)
            this.display(i, noImprovement);
        var scope = this;
        setTimeout(function() { scope.run(threshold, noImprovement, lastScore, i) }, 1);

        return false;

    }
    this.display(i, noImprovement);
};


Population.prototype.elitism = 0.2;
Population.prototype.chromosomes = [];
Population.prototype.size = 100;
Population.prototype.elements = false;


var p;
p = new Population(clone(elements));

document.getElementById('runbutton').onclick = function() {
   p.run(document.getElementById('runfor').value);
};

/*
 * This is NOT free software. You may learn from and experiment with this code but you may not redistribute it or use it in any commercial application without the explicit prior consent of the author.
 * Burak Kanber
 * burak@burakkanber.com
 * October 2012
 */

var canvas;
var ctx;
var height = 400;
var width = 400;
    var data = [
    [1, 2],
    [2, 1],
    [2, 4],
    [1, 3],
    [2, 2],
    [3, 1],
    [1, 1],

    [7, 3],
    [8, 2],
    [6, 4],
    [7, 4],
    [8, 1],
    [9, 2],

    [10, 8],
    [9, 10],
    [7, 8],
    [7, 9],
    [8, 11],
    [9, 9],
];
var means = [];
var assignments = [];
var dataExtremes;
var dataRange;
var drawDelay = 2000;

function setup() {

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    dataExtremes = getDataExtremes(data);
    dataRange = getDataRanges(dataExtremes);
    means = initMeans(3);

    makeAssignments();
    draw();

    setTimeout(run, drawDelay);
}

function getDataRanges(extremes) {
    var ranges = [];

    for (var dimension in extremes)
    {
        ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
    }

    return ranges;

}

function getDataExtremes(points) {

    var extremes = [];

    for (var i in data)
    {
        var point = data[i];

        for (var dimension in point)
        {
            if ( ! extremes[dimension] )
            {
                extremes[dimension] = {min: 1000, max: 0};
            }

            if (point[dimension] < extremes[dimension].min)
            {
                extremes[dimension].min = point[dimension];
            }

            if (point[dimension] > extremes[dimension].max)
            {
                extremes[dimension].max = point[dimension];
            }
        }
    }

    return extremes;

}

function initMeans(k) {

    if ( ! k )
    {
        k = 3;
    }

    while (k--)
    {
        var mean = [];

        for (var dimension in dataExtremes)
        {
            mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
        }

        means.push(mean);
    }

    return means;

};

function makeAssignments() {

    for (var i in data)
    {
        var point = data[i];
        var distances = [];

        for (var j in means)
        {
            var mean = means[j];
            var sum = 0;

            for (var dimension in point)
            {
                var difference = point[dimension] - mean[dimension];
                difference *= difference;
                sum += difference;
            }

            distances[j] = Math.sqrt(sum);
        }

        assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
    }

}

function moveMeans() {

    makeAssignments();

    var sums = Array( means.length );
    var counts = Array( means.length );
    var moved = false;

    for (var j in means)
    {
        counts[j] = 0;
        sums[j] = Array( means[j].length );
        for (var dimension in means[j])
        {
            sums[j][dimension] = 0;
        }
    }

    for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        counts[mean_index]++;

        for (var dimension in mean)
        {
            sums[mean_index][dimension] += point[dimension];
        }
    }

    for (var mean_index in sums)
    {
        console.log(counts[mean_index]);
        if ( 0 === counts[mean_index] )
        {
            sums[mean_index] = means[mean_index];
            console.log("Mean with no points");
            console.log(sums[mean_index]);

            for (var dimension in dataExtremes)
            {
                sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
            }
            continue;
        }

        for (var dimension in sums[mean_index])
        {
            sums[mean_index][dimension] /= counts[mean_index];
        }
    }

    if (means.toString() !== sums.toString())
    {
        moved = true;
    }

    means = sums;

    return moved;

}

function run() {

    var moved = moveMeans();
    draw();

    if (moved)
    {
        setTimeout(run, drawDelay);
    }

}
function draw() {

    ctx.clearRect(0,0,width, height);

    ctx.globalAlpha = 0.3;
    for (var point_index in assignments)
    {
        var mean_index = assignments[point_index];
        var point = data[point_index];
        var mean = means[mean_index];

        ctx.save();

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(
            (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.lineTo(
            (mean[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) ),
            (mean[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) )
        );
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }
    ctx.globalAlpha = 1;

    for (var i in data)
    {
        ctx.save();

        var point = data[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.strokeStyle = '#333333';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    for (var i in means)
    {
        ctx.save();

        var point = means[i];

        var x = (point[0] - dataExtremes[0].min + 1) * (width / (dataRange[0] + 2) );
        var y = (point[1] - dataExtremes[1].min + 1) * (height / (dataRange[1] + 2) );

        ctx.fillStyle = 'green';
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI*2, true);
        ctx.fill();
        ctx.closePath();

        ctx.restore();

    }

}

setup();












/*
The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
(C) All Rights Reserved, Burak Kanber 2013
*/
var Bayes = (function (Bayes) {
    Array.prototype.unique = function () {
        var u = {}, a = [];
        for (var i = 0, l = this.length; i < l; ++i) {
            if (u.hasOwnProperty(this[i])) {
                continue;
            }
            a.push(this[i]);
            u[this[i]] = 1;
        }
        return a;
    }
    var stemKey = function (stem, label) {
        return '_Bayes::stem:' + stem + '::label:' + label;
    };
    var docCountKey = function (label) {
        return '_Bayes::docCount:' + label;
    };
    var stemCountKey = function (stem) {
        return '_Bayes::stemCount:' + stem;
    };

    var log = function (text) {
        console.log(text);
    };

    var tokenize = function (text) {
        text = text.toLowerCase().replace(/\W/g, ' ').replace(/\s+/g, ' ').trim().split(' ').unique();
        return text;
    };

    var getLabels = function () {
        var labels = localStorage.getItem('_Bayes::registeredLabels');
        if (!labels) labels = '';
        return labels.split(',').filter(function (a) {
            return a.length;
        });
    };

    var registerLabel = function (label) {
        var labels = getLabels();
        if (labels.indexOf(label) === -1) {
            labels.push(label);
            localStorage.setItem('_Bayes::registeredLabels', labels.join(','));
        }
        return true;
    };

    var stemLabelCount = function (stem, label) {
        var count = parseInt(localStorage.getItem(stemKey(stem, label)));
        if (!count) count = 0;
        return count;
    };
    var stemInverseLabelCount = function (stem, label) {
        var labels = getLabels();
        var total = 0;
        for (var i = 0, length = labels.length; i < length; i++) {
            if (labels[i] === label)
                continue;
            total += parseInt(stemLabelCount(stem, labels[i]));
        }
        return total;
    };

    var stemTotalCount = function (stem) {
        var count = parseInt(localStorage.getItem(stemCountKey(stem)));
        if (!count) count = 0;
        return count;
    };
    var docCount = function (label) {
        var count = parseInt(localStorage.getItem(docCountKey(label)));
        if (!count) count = 0;
        return count;
    };
    var docInverseCount = function (label) {
        var labels = getLabels();
        var total = 0;
        for (var i = 0, length = labels.length; i < length; i++) {
            if (labels[i] === label)
                continue;
            total += parseInt(docCount(labels[i]));
        }
        return total;
    };
    var increment = function (key) {
        var count = parseInt(localStorage.getItem(key));
        if (!count) count = 0;
        localStorage.setItem(key, parseInt(count) + 1);
        return count + 1;
    };

    var incrementStem = function (stem, label) {
        increment(stemCountKey(stem));
        increment(stemKey(stem, label));
    };

    var incrementDocCount = function (label) {
        return increment(docCountKey(label));
    };

    Bayes.train = function (text, label) {
        registerLabel(label);
        var words = tokenize(text);
        var length = words.length;
        for (var i = 0; i < length; i++)
            incrementStem(words[i], label);
        incrementDocCount(label);
    };

    Bayes.guess = function (text) {
        var words = tokenize(text);
        var length = words.length;
        var labels = getLabels();
        var totalDocCount = 0;
        var docCounts = {};
        var docInverseCounts = {};
        var scores = {};
        var labelProbability = {};

        for (var j = 0; j < labels.length; j++) {
            var label = labels[j];
            docCounts[label] = docCount(label);
            docInverseCounts[label] = docInverseCount(label);
            totalDocCount += parseInt(docCounts[label]);
        }

        for (var j = 0; j < labels.length; j++) {
            var label = labels[j];
            var logSum = 0;
            labelProbability[label] = docCounts[label] / totalDocCount;

            for (var i = 0; i < length; i++) {
                var word = words[i];
                var _stemTotalCount = stemTotalCount(word);
                if (_stemTotalCount === 0) {
                    continue;
                } else {
                    var wordProbability = stemLabelCount(word, label) / docCounts[label];
                    var wordInverseProbability = stemInverseLabelCount(word, label) / docInverseCounts[label];
                    var wordicity = wordProbability / (wordProbability + wordInverseProbability);

                    wordicity = ( (1 * 0.5) + (_stemTotalCount * wordicity) ) / ( 1 + _stemTotalCount );
                    if (wordicity === 0)
                        wordicity = 0.01;
                    else if (wordicity === 1)
                        wordicity = 0.99;
               }

                logSum += (Math.log(1 - wordicity) - Math.log(wordicity));
                log(label + "icity of " + word + ": " + wordicity);
            }
            scores[label] = 1 / ( 1 + Math.exp(logSum) );
        }
        return scores;
    };

    Bayes.extractWinner = function (scores) {
        var bestScore = 0;
        var bestLabel = null;
        for (var label in scores) {
            if (scores[label] > bestScore) {
                bestScore = scores[label];
                bestLabel = label;
            }
        }
        return {label: bestLabel, score: bestScore};
    };

    return Bayes;
})(Bayes || {});

localStorage.clear();

var go = function go() {
    var text = document.getElementById("test_phrase").value;
    var scores = Bayes.guess(text);
    var winner = Bayes.extractWinner(scores);
    document.getElementById("test_result").innerHTML = winner.label;
    document.getElementById("test_probability").innerHTML = winner.score;
    console.log(scores);
};


/*
The following is not free software. You may use it for educational purposes, but you may not redistribute or use it commercially.
(C) All Rights Reserved, Burak Kanber 2013
*/

// Define a couple of global variables so we can easily inspect data points we guessed incorrectly on.
var incorrectNegs = [];
var incorrectPos = [];

// A list of negation terms that we'll use to flag nearby tokens
var negations = new RegExp("^(never|no|nothing|nowhere|noone|none|not|havent|hasnt|hadnt|cant|couldnt|shouldnt|wont|wouldnt|dont|doesnt|didnt|isnt|arent|aint)$");

// Use 85% of our data set for training, the remaining 15% will be used for testing.
var length = negatives.length;
var split = Math.floor(0.85 * length);

// Don't spit out console.log stuff during training and guessing.
Bayes.debug = false;

// Close-proximity negation-marked unigram ("eMSU")
Bayes.tokenizer = function (text) {
    // Standard unigram tokenizer; lowercase, strip special characters, split by whitespace
    text = Bayes.unigramTokenizer(text);
    // Step through our array of tokens
    for (var i = 0, len = text.length; i < len; i++) {
        // If we find a negation word, add an exclamation point to the word preceding and following it.
        if (text[i].match(negations)) {
            if (typeof text[i + 1] !== 'undefined') text[i + 1] = "!" + text[i + 1];
            if (typeof text[i - 1] !== 'undefined') text[i - 1] = "!" + text[i - 1];
        }
    }
    // Porter Stemmer; this reduces entropy a bit
    text = text.map(function (t) { return stemmer(t); });
    return text;
};

// Set the storage engine to in-memory; this example has too much data for localStorage.
Bayes.storage = Storage;

// Runs a single training and testing experiment.
function go() {

    // Start from scratch.
    var correct = 0;
    var incorrect = 0;
    var skipped = 0;
    var trainingBar = document.getElementById("trainingProgressBar");
    var trainingVal = document.getElementById("trainingProgressValue");
    var trainingPct = 0;
    var resultsBar = document.getElementById("testResultsBar");
    var resultsVal = document.getElementById("testResultsValue");
    var resultsPct = 0.0;

    Bayes.storage._data = {};

    // Shuffle our arrays. I'm sure some really astute CS genius will find a flaw with this ;)
    negatives.sort(function () { return Math.random() - 0.5; });
    positives.sort(function () { return Math.random() - 0.5; });

    // First we train. Walk through the data until we hit our split/pivot point.
    // Unfortunately our progress bar doesn't work because of the browser's JS event loop,
    // And retooling to use animation frames is more annoying than it's worth.

    for (var i = 0; i < split; i++) {
        Bayes.train(negatives[i], 'negative');
        Bayes.train(positives[i], 'positive');
        if (i % 500 === 0) {
            // Next three lines are largely useless.
            trainingPct = Math.round(i*100 / split);
            trainingVal.innerHTML = trainingPct;
            trainingBar.style.width = trainingPct + '%';
            // If you want live updates, look at the console.
            console.log("Training progress: " + trainingPct + "%");
        }
    }

    // Clean up the progress bar for the final state.
    trainingPct = 100;
    trainingVal.innerHTML = trainingPct;
    trainingBar.style.width = trainingPct + '%';

    // Now we guess. Look at the remainder of the data set and test each of those.
    for (var i = split; i < length; i++) {
        var negResult = Bayes.extractWinner(Bayes.guess(negatives[i]));
        var posResult = Bayes.extractWinner(Bayes.guess(positives[i]));

        // Probability less than 75%? Skip it. No sense in making guesses that we know are uncertain.
        if (negResult.score < 0.75) skipped++;
        else if (negResult.label === 'negative') correct++;
        else {
            incorrect++;
            incorrectNegs.push(negatives[i]);
        }

        // Repeat for the corresponding positive data point.
        if (posResult.score < 0.75) skipped++;
        else if (posResult.label === 'positive') correct++;
        else {
            incorrect++;
            incorrectPos.push(positives[i]);
        }
    }

    // Show the accuracy for this training/testing run.
    resultsPct = Math.round(10000 * correct / (correct + incorrect)) / 100;
    resultsBar.style.width = Math.round(resultsPct) + '%';
    resultsVal.innerHTML = resultsPct;
    return resultsPct;
}

document.getElementById("testButton").addEventListener('click', function() {
    var text = document.getElementById("testBox").value;
    var result = Bayes.extractWinner(Bayes.guess(text));
    document.getElementById("testBox").value = '';
    document.getElementById("testResultLabel").innerHTML = result.label;
    document.getElementById("testResultProbability").innerHTML = Math.round(100*result.score);
    document.getElementById("testResult").style.display = 'block';
});

setTimeout(go, 500);

// We're not using this function in the public example, but this is a simple helper to run 30 tests at a time and record and average their scores.
function run() {
    var n = 30;
    var i = n;
    var scores = [];
    var sum = 0;
    while (i--) scores.push(go());
    scores.forEach(function (score) {
        sum += score;
    });

    console.log(scores);
    console.log("Average " + sum / n);
}
(function(exports){
crossfilter.version = "1.3.9";
function crossfilter_identity(d) {
	return d;
}
crossfilter.permute = permute;

function permute(array, index) {
	for (var i = 0, n = index.length, copy = new Array(n); i < n; ++i) {
		copy[i] = array[index[i]];
	}
	return copy;
}
var bisect = crossfilter.bisect = bisect_by(crossfilter_identity);

bisect.by = bisect_by;

function bisect_by(f) {
	function bisectLeft(a, x, lo, hi) {
		while (lo < hi) {
			var mid = lo + hi >>> 1;
			if (f(a[mid]) < x) lo = mid + 1;
			else hi = mid;
		}
		return lo;
	}
	function bisectRight(a, x, lo, hi) {
		while (lo < hi) {
			var mid = lo + hi >>> 1;
			if (x < f(a[mid])) hi = mid;
			else lo = mid + 1;
		}
		return lo;
	}

	bisectRight.right = bisectRight;
	bisectRight.left = bisectLeft;
	return bisectRight;
}
var heap = crossfilter.heap = heap_by(crossfilter_identity);

heap.by = heap_by;

function heap_by(f) {
	function heap(a, lo, hi) {
		var n = hi - lo,
				i = (n >>> 1) + 1;
		while (--i > 0) sift(a, i, n, lo);
		return a;
	}
	function sort(a, lo, hi) {
		var n = hi - lo,
				t;
		while (--n > 0) t = a[lo], a[lo] = a[lo + n], a[lo + n] = t, sift(a, 1, n, lo);
		return a;
	}
	function sift(a, i, n, lo) {
		var d = a[--lo + i],
				x = f(d),
				child;
		while ((child = i << 1) <= n) {
			if (child < n && f(a[lo + child]) > f(a[lo + child + 1])) child++;
			if (x <= f(a[lo + child])) break;
			a[lo + i] = a[lo + child];
			i = child;
		}
		a[lo + i] = d;
	}

	heap.sort = sort;
	return heap;
}
var heapselect = crossfilter.heapselect = heapselect_by(crossfilter_identity);

heapselect.by = heapselect_by;

function heapselect_by(f) {
	var heap = heap_by(f);
	function heapselect(a, lo, hi, k) {
		var queue = new Array(k = Math.min(hi - lo, k)),
				min,
				i,
				x,
				d;

		for (i = 0; i < k; ++i) queue[i] = a[lo++];
		heap(queue, 0, k);

		if (lo < hi) {
			min = f(queue[0]);
			do {
				if (x = f(d = a[lo]) > min) {
					queue[0] = d;
					min = f(heap(queue, 0, k)[0]);
				}
			} while (++lo < hi);
		}

		return queue;
	}

	return heapselect;
}
var insertionsort = crossfilter.insertionsort = insertionsort_by(crossfilter_identity);

insertionsort.by = insertionsort_by;

function insertionsort_by(f) {

	function insertionsort(a, lo, hi) {
		for (var i = lo + 1; i < hi; ++i) {
			for (var j = i, t = a[i], x = f(t); j > lo && f(a[j - 1]) > x; --j) {
				a[j] = a[j - 1];
			}
			a[j] = t;
		}
		return a;
	}

	return insertionsort;
}

var quicksort = crossfilter.quicksort = quicksort_by(crossfilter_identity);

quicksort.by = quicksort_by;

function quicksort_by(f) {
	var insertionsort = insertionsort_by(f);

	function sort(a, lo, hi) {
		return (hi - lo < quicksort_sizeThreshold
				? insertionsort
				: quicksort)(a, lo, hi);
	}

	function quicksort(a, lo, hi) {
		var sixth = (hi - lo) / 6 | 0,
				i1 = lo + sixth,
				i5 = hi - 1 - sixth,
				i3 = lo + hi - 1 >> 1,
				i2 = i3 - sixth,
				i4 = i3 + sixth;

		var e1 = a[i1], x1 = f(e1),
				e2 = a[i2], x2 = f(e2),
				e3 = a[i3], x3 = f(e3),
				e4 = a[i4], x4 = f(e4),
				e5 = a[i5], x5 = f(e5);

		var t;
		if (x1 > x2) t = e1, e1 = e2, e2 = t, t = x1, x1 = x2, x2 = t;
		if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;
		if (x1 > x3) t = e1, e1 = e3, e3 = t, t = x1, x1 = x3, x3 = t;
		if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
		if (x1 > x4) t = e1, e1 = e4, e4 = t, t = x1, x1 = x4, x4 = t;
		if (x3 > x4) t = e3, e3 = e4, e4 = t, t = x3, x3 = x4, x4 = t;
		if (x2 > x5) t = e2, e2 = e5, e5 = t, t = x2, x2 = x5, x5 = t;
		if (x2 > x3) t = e2, e2 = e3, e3 = t, t = x2, x2 = x3, x3 = t;
		if (x4 > x5) t = e4, e4 = e5, e5 = t, t = x4, x4 = x5, x5 = t;

		var pivot1 = e2, pivotValue1 = x2,
				pivot2 = e4, pivotValue2 = x4;
		a[i1] = e1;
		a[i2] = a[lo];
		a[i3] = e3;
		a[i4] = a[hi - 1];
		a[i5] = e5;

		var less = lo + 1,
				great = hi - 2;
		var pivotsEqual = pivotValue1 <= pivotValue2 && pivotValue1 >= pivotValue2;
		if (pivotsEqual) {
			for (var k = less; k <= great; ++k) {
				var ek = a[k], xk = f(ek);
				if (xk < pivotValue1) {
					if (k !== less) {
						a[k] = a[less];
						a[less] = ek;
					}
					++less;
				} else if (xk > pivotValue1) {
					while (true) {
						var greatValue = f(a[great]);
						if (greatValue > pivotValue1) {
							great--;
							continue;
						} else if (greatValue < pivotValue1) {
							a[k] = a[less];
							a[less++] = a[great];
							a[great--] = ek;
							break;
						} else {
							a[k] = a[great];
							a[great--] = ek;
							break;
						}
					}
				}
			}
		} else {
			for (var k = less; k <= great; k++) {
				var ek = a[k], xk = f(ek);
				if (xk < pivotValue1) {
					if (k !== less) {
						a[k] = a[less];
						a[less] = ek;
					}
					++less;
				} else {
					if (xk > pivotValue2) {
						while (true) {
							var greatValue = f(a[great]);
							if (greatValue > pivotValue2) {
								great--;
								if (great < k) break;
								continue;
							} else {
								if (greatValue < pivotValue1) {
									a[k] = a[less];
									a[less++] = a[great];
									a[great--] = ek;
								} else {
									a[k] = a[great];
									a[great--] = ek;
								}
								break;
							}
						}
					}
				}
			}
		}
		a[lo] = a[less - 1];
		a[less - 1] = pivot1;
		a[hi - 1] = a[great + 1];
		a[great + 1] = pivot2;
		sort(a, lo, less - 1);
		sort(a, great + 2, hi);

		if (pivotsEqual) {
			return a;
		}
		if (less < i1 && great > i5) {
			var lessValue, greatValue;
			while ((lessValue = f(a[less])) <= pivotValue1 && lessValue >= pivotValue1) ++less;
			while ((greatValue = f(a[great])) <= pivotValue2 && greatValue >= pivotValue2) --great;
			for (var k = less; k <= great; k++) {
				var ek = a[k], xk = f(ek);
				if (xk <= pivotValue1 && xk >= pivotValue1) {
					if (k !== less) {
						a[k] = a[less];
						a[less] = ek;
					}
					less++;
				} else {
					if (xk <= pivotValue2 && xk >= pivotValue2) {
						while (true) {
							var greatValue = f(a[great]);
							if (greatValue <= pivotValue2 && greatValue >= pivotValue2) {
								great--;
								if (great < k) break;
								continue;
							} else {
								if (greatValue < pivotValue1) {
									a[k] = a[less];
									a[less++] = a[great];
									a[great--] = ek;
								} else {
									a[k] = a[great];
									a[great--] = ek;
								}
								break;
							}
						}
					}
				}
			}
		}

		return sort(a, less, great + 1);
	}

	return sort;
}

var quicksort_sizeThreshold = 32;
var crossfilter_array8 = crossfilter_arrayUntyped,
		crossfilter_array16 = crossfilter_arrayUntyped,
		crossfilter_array32 = crossfilter_arrayUntyped,
		crossfilter_arrayLengthen = crossfilter_arrayLengthenUntyped,
		crossfilter_arrayWiden = crossfilter_arrayWidenUntyped;

if (typeof Uint8Array !== "undefined") {
	crossfilter_array8 = function(n) { return new Uint8Array(n); };
	crossfilter_array16 = function(n) { return new Uint16Array(n); };
	crossfilter_array32 = function(n) { return new Uint32Array(n); };

	crossfilter_arrayLengthen = function(array, length) {
		if (array.length >= length) return array;
		var copy = new array.constructor(length);
		copy.set(array);
		return copy;
	};

	crossfilter_arrayWiden = function(array, width) {
		var copy;
		switch (width) {
			case 16: copy = crossfilter_array16(array.length); break;
			case 32: copy = crossfilter_array32(array.length); break;
			default: throw new Error("invalid array width!");
		}
		copy.set(array);
		return copy;
	};
}

function crossfilter_arrayUntyped(n) {
	var array = new Array(n), i = -1;
	while (++i < n) array[i] = 0;
	return array;
}

function crossfilter_arrayLengthenUntyped(array, length) {
	var n = array.length;
	while (n < length) array[n++] = 0;
	return array;
}

function crossfilter_arrayWidenUntyped(array, width) {
	if (width > 32) throw new Error("invalid array width!");
	return array;
}
function crossfilter_filterExact(bisect, value) {
	return function(values) {
		var n = values.length;
		return [bisect.left(values, value, 0, n), bisect.right(values, value, 0, n)];
	};
}

function crossfilter_filterRange(bisect, range) {
	var min = range[0],
			max = range[1];
	return function(values) {
		var n = values.length;
		return [bisect.left(values, min, 0, n), bisect.left(values, max, 0, n)];
	};
}

function crossfilter_filterAll(values) {
	return [0, values.length];
}
function crossfilter_null() {
	return null;
}
function crossfilter_zero() {
	return 0;
}
function crossfilter_reduceIncrement(p) {
	return p + 1;
}

function crossfilter_reduceDecrement(p) {
	return p - 1;
}

function crossfilter_reduceAdd(f) {
	return function(p, v) {
		return p + +f(v);
	};
}

function crossfilter_reduceSubtract(f) {
	return function(p, v) {
		return p - f(v);
	};
}
exports.crossfilter = crossfilter;

function crossfilter() {
	var crossfilter = {
		add: add,
		remove: removeData,
		dimension: dimension,
		groupAll: groupAll,
		size: size
	};

	var data = [],
			n = 0,
			m = 0,
			M = 8,
			filters = crossfilter_array8(0),
			filterListeners = [],
			dataListeners = [],
			removeDataListeners = [];
	function add(newData) {
		var n0 = n,
				n1 = newData.length;
		if (n1) {
			data = data.concat(newData);
			filters = crossfilter_arrayLengthen(filters, n += n1);
			dataListeners.forEach(function(l) { l(newData, n0, n1); });
		}

		return crossfilter;
	}
	function removeData() {
		var newIndex = crossfilter_index(n, n),
				removed = [];
		for (var i = 0, j = 0; i < n; ++i) {
			if (filters[i]) newIndex[i] = j++;
			else removed.push(i);
		}
		filterListeners.forEach(function(l) { l(0, [], removed); });
		removeDataListeners.forEach(function(l) { l(newIndex); });
		for (var i = 0, j = 0, k; i < n; ++i) {
			if (k = filters[i]) {
				if (i !== j) filters[j] = k, data[j] = data[i];
				++j;
			}
		}
		data.length = j;
		while (n > j) filters[--n] = 0;
	}
	function dimension(value) {
		var dimension = {
			filter: filter,
			filterExact: filterExact,
			filterRange: filterRange,
			filterFunction: filterFunction,
			filterAll: filterAll,
			top: top,
			bottom: bottom,
			group: group,
			groupAll: groupAll,
			dispose: dispose,
			remove: dispose
		};

		var one = ~m & -~m,
				zero = ~one,
				values,
				index,
				newValues,
				newIndex,
				sort = quicksort_by(function(i) { return newValues[i]; }),
				refilter = crossfilter_filterAll,
				refilterFunction,
				indexListeners = [],
				dimensionGroups = [],
				lo0 = 0,
				hi0 = 0;
		dataListeners.unshift(preAdd);
		dataListeners.push(postAdd);

		removeDataListeners.push(removeData);
		m |= one;
		if (M >= 32 ? !one : m & (1 << M) - 1) {
			filters = crossfilter_arrayWiden(filters, M <<= 1);
		}
		preAdd(data, 0, n);
		postAdd(data, 0, n);
		function preAdd(newData, n0, n1) {
			newValues = newData.map(value);
			newIndex = sort(crossfilter_range(n1), 0, n1);
			newValues = permute(newValues, newIndex);
			var bounds = refilter(newValues), lo1 = bounds[0], hi1 = bounds[1], i;
			if (refilterFunction) {
				for (i = 0; i < n1; ++i) {
					if (!refilterFunction(newValues[i], i)) filters[newIndex[i] + n0] |= one;
				}
			} else {
				for (i = 0; i < lo1; ++i) filters[newIndex[i] + n0] |= one;
				for (i = hi1; i < n1; ++i) filters[newIndex[i] + n0] |= one;
			}
			if (!n0) {
				values = newValues;
				index = newIndex;
				lo0 = lo1;
				hi0 = hi1;
				return;
			}

			var oldValues = values,
					oldIndex = index,
					i0 = 0,
					i1 = 0;
			values = new Array(n);
			index = crossfilter_index(n, n);
			for (i = 0; i0 < n0 && i1 < n1; ++i) {
				if (oldValues[i0] < newValues[i1]) {
					values[i] = oldValues[i0];
					index[i] = oldIndex[i0++];
				} else {
					values[i] = newValues[i1];
					index[i] = newIndex[i1++] + n0;
				}
			}
			for (; i0 < n0; ++i0, ++i) {
				values[i] = oldValues[i0];
				index[i] = oldIndex[i0];
			}
			for (; i1 < n1; ++i1, ++i) {
				values[i] = newValues[i1];
				index[i] = newIndex[i1] + n0;
			}
			bounds = refilter(values), lo0 = bounds[0], hi0 = bounds[1];
		}
		function postAdd(newData, n0, n1) {
			indexListeners.forEach(function(l) { l(newValues, newIndex, n0, n1); });
			newValues = newIndex = null;
		}

		function removeData(reIndex) {
			for (var i = 0, j = 0, k; i < n; ++i) {
				if (filters[k = index[i]]) {
					if (i !== j) values[j] = values[i];
					index[j] = reIndex[k];
					++j;
				}
			}
			values.length = j;
			while (j < n) index[j++] = 0;
			var bounds = refilter(values);
			lo0 = bounds[0], hi0 = bounds[1];
		}
		function filterIndexBounds(bounds) {
			var lo1 = bounds[0],
					hi1 = bounds[1];

			if (refilterFunction) {
				refilterFunction = null;
				filterIndexFunction(function(d, i) { return lo1 <= i && i < hi1; });
				lo0 = lo1;
				hi0 = hi1;
				return dimension;
			}

			var i,
					j,
					k,
					added = [],
					removed = [];
			if (lo1 < lo0) {
				for (i = lo1, j = Math.min(lo0, hi1); i < j; ++i) {
					filters[k = index[i]] ^= one;
					added.push(k);
				}
			} else if (lo1 > lo0) {
				for (i = lo0, j = Math.min(lo1, hi0); i < j; ++i) {
					filters[k = index[i]] ^= one;
					removed.push(k);
				}
			}
			if (hi1 > hi0) {
				for (i = Math.max(lo1, hi0), j = hi1; i < j; ++i) {
					filters[k = index[i]] ^= one;
					added.push(k);
				}
			} else if (hi1 < hi0) {
				for (i = Math.max(lo0, hi1), j = hi0; i < j; ++i) {
					filters[k = index[i]] ^= one;
					removed.push(k);
				}
			}

			lo0 = lo1;
			hi0 = hi1;
			filterListeners.forEach(function(l) { l(one, added, removed); });
			return dimension;
		}
		function filter(range) {
			return range == null
					? filterAll() : Array.isArray(range)
					? filterRange(range) : typeof range === "function"
					? filterFunction(range)
					: filterExact(range);
		}
		function filterExact(value) {
			return filterIndexBounds((refilter = crossfilter_filterExact(bisect, value))(values));
		}
		function filterRange(range) {
			return filterIndexBounds((refilter = crossfilter_filterRange(bisect, range))(values));
		}
		function filterAll() {
			return filterIndexBounds((refilter = crossfilter_filterAll)(values));
		}
		function filterFunction(f) {
			refilter = crossfilter_filterAll;

			filterIndexFunction(refilterFunction = f);

			lo0 = 0;
			hi0 = n;

			return dimension;
		}

		function filterIndexFunction(f) {
			var i,
					k,
					x,
					added = [],
					removed = [];

			for (i = 0; i < n; ++i) {
				if (filters[k = index[i]] & one ^ !(x = f(values[i], i))) {
					if (x) filters[k] &= zero, added.push(k);
					else filters[k] |= one, removed.push(k);
				}
			}
			filterListeners.forEach(function(l) { l(one, added, removed); });
		}
		function top(k) {
			var array = [],
					i = hi0,
					j;

			while (--i >= lo0 && k > 0) {
				if (!filters[j = index[i]]) {
					array.push(data[j]);
					--k;
				}
			}

			return array;
		}
		function bottom(k) {
			var array = [],
					i = lo0,
					j;

			while (i < hi0 && k > 0) {
				if (!filters[j = index[i]]) {
					array.push(data[j]);
					--k;
				}
				i++;
			}

			return array;
		}
		function group(key) {
			var group = {
				top: top,
				all: all,
				reduce: reduce,
				reduceCount: reduceCount,
				reduceSum: reduceSum,
				order: order,
				orderNatural: orderNatural,
				size: size,
				dispose: dispose,
				remove: dispose
			};
			dimensionGroups.push(group);

			var groups,
					groupIndex,
					groupWidth = 8,
					groupCapacity = crossfilter_capacity(groupWidth),
					k = 0,
					select,
					heap,
					reduceAdd,
					reduceRemove,
					reduceInitial,
					update = crossfilter_null,
					reset = crossfilter_null,
					resetNeeded = true,
					groupAll = key === crossfilter_null;

			if (arguments.length < 1) key = crossfilter_identity;
			filterListeners.push(update);
			indexListeners.push(add);
			removeDataListeners.push(removeData);
			add(values, index, 0, n);
			function add(newValues, newIndex, n0, n1) {
				var oldGroups = groups,
						reIndex = crossfilter_index(k, groupCapacity),
						add = reduceAdd,
						initial = reduceInitial,
						k0 = k,
						i0 = 0,
						i1 = 0,
						j,
						g0,
						x0,
						x1,
						g,
						x;
				if (resetNeeded) add = initial = crossfilter_null;
				groups = new Array(k), k = 0;
				groupIndex = k0 > 1 ? crossfilter_arrayLengthen(groupIndex, n) : crossfilter_index(n, groupCapacity);
				if (k0) x0 = (g0 = oldGroups[0]).key;
				while (i1 < n1 && !((x1 = key(newValues[i1])) >= x1)) ++i1;
				while (i1 < n1) {
					if (g0 && x0 <= x1) {
						g = g0, x = x0;
						reIndex[i0] = k;
						if (g0 = oldGroups[++i0]) x0 = g0.key;
					} else {
						g = {key: x1, value: initial()}, x = x1;
					}
					groups[k] = g;
					while (!(x1 > x)) {
						groupIndex[j = newIndex[i1] + n0] = k;
						if (!(filters[j] & zero)) g.value = add(g.value, data[j]);
						if (++i1 >= n1) break;
						x1 = key(newValues[i1]);
					}

					groupIncrement();
				}
				while (i0 < k0) {
					groups[reIndex[i0] = k] = oldGroups[i0++];
					groupIncrement();
				}
				if (k > i0) for (i0 = 0; i0 < n0; ++i0) {
					groupIndex[i0] = reIndex[groupIndex[i0]];
				}
				j = filterListeners.indexOf(update);
				if (k > 1) {
					update = updateMany;
					reset = resetMany;
				} else {
					if (!k && groupAll) {
						k = 1;
						groups = [{key: null, value: initial()}];
					}
					if (k === 1) {
						update = updateOne;
						reset = resetOne;
					} else {
						update = crossfilter_null;
						reset = crossfilter_null;
					}
					groupIndex = null;
				}
				filterListeners[j] = update;
				function groupIncrement() {
					if (++k === groupCapacity) {
						reIndex = crossfilter_arrayWiden(reIndex, groupWidth <<= 1);
						groupIndex = crossfilter_arrayWiden(groupIndex, groupWidth);
						groupCapacity = crossfilter_capacity(groupWidth);
					}
				}
			}

			function removeData() {
				if (k > 1) {
					var oldK = k,
							oldGroups = groups,
							seenGroups = crossfilter_index(oldK, oldK);
					for (var i = 0, j = 0; i < n; ++i) {
						if (filters[i]) {
							seenGroups[groupIndex[j] = groupIndex[i]] = 1;
							++j;
						}
					}
					groups = [], k = 0;
					for (i = 0; i < oldK; ++i) {
						if (seenGroups[i]) {
							seenGroups[i] = k++;
							groups.push(oldGroups[i]);
						}
					}

					if (k > 1) {
						for (var i = 0; i < j; ++i) groupIndex[i] = seenGroups[groupIndex[i]];
					} else {
						groupIndex = null;
					}
					filterListeners[filterListeners.indexOf(update)] = k > 1
							? (reset = resetMany, update = updateMany)
							: k === 1 ? (reset = resetOne, update = updateOne)
							: reset = update = crossfilter_null;
				} else if (k === 1) {
					if (groupAll) return;
					for (var i = 0; i < n; ++i) if (filters[i]) return;
					groups = [], k = 0;
					filterListeners[filterListeners.indexOf(update)] =
					update = reset = crossfilter_null;
				}
			}
			function updateMany(filterOne, added, removed) {
				if (filterOne === one || resetNeeded) return;

				var i,
						k,
						n,
						g;
				for (i = 0, n = added.length; i < n; ++i) {
					if (!(filters[k = added[i]] & zero)) {
						g = groups[groupIndex[k]];
						g.value = reduceAdd(g.value, data[k]);
					}
				}
				for (i = 0, n = removed.length; i < n; ++i) {
					if ((filters[k = removed[i]] & zero) === filterOne) {
						g = groups[groupIndex[k]];
						g.value = reduceRemove(g.value, data[k]);
					}
				}
			}
			function updateOne(filterOne, added, removed) {
				if (filterOne === one || resetNeeded) return;

				var i,
						k,
						n,
						g = groups[0];
				for (i = 0, n = added.length; i < n; ++i) {
					if (!(filters[k = added[i]] & zero)) {
						g.value = reduceAdd(g.value, data[k]);
					}
				}
				for (i = 0, n = removed.length; i < n; ++i) {
					if ((filters[k = removed[i]] & zero) === filterOne) {
						g.value = reduceRemove(g.value, data[k]);
					}
				}
			}
			function resetMany() {
				var i,
						g;
				for (i = 0; i < k; ++i) {
					groups[i].value = reduceInitial();
				}
				for (i = 0; i < n; ++i) {
					if (!(filters[i] & zero)) {
						g = groups[groupIndex[i]];
						g.value = reduceAdd(g.value, data[i]);
					}
				}
			}
			function resetOne() {
				var i,
						g = groups[0];
				g.value = reduceInitial();
				for (i = 0; i < n; ++i) {
					if (!(filters[i] & zero)) {
						g.value = reduceAdd(g.value, data[i]);
					}
				}
			}
			function all() {
				if (resetNeeded) reset(), resetNeeded = false;
				return groups;
			}
			function top(k) {
				var top = select(all(), 0, groups.length, k);
				return heap.sort(top, 0, top.length);
			}
			function reduce(add, remove, initial) {
				reduceAdd = add;
				reduceRemove = remove;
				reduceInitial = initial;
				resetNeeded = true;
				return group;
			}
			function reduceCount() {
				return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
			}
			function reduceSum(value) {
				return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
			}
			function order(value) {
				select = heapselect_by(valueOf);
				heap = heap_by(valueOf);
				function valueOf(d) { return value(d.value); }
				return group;
			}
			function orderNatural() {
				return order(crossfilter_identity);
			}
			function size() {
				return k;
			}
			function dispose() {
				var i = filterListeners.indexOf(update);
				if (i >= 0) filterListeners.splice(i, 1);
				i = indexListeners.indexOf(add);
				if (i >= 0) indexListeners.splice(i, 1);
				i = removeDataListeners.indexOf(removeData);
				if (i >= 0) removeDataListeners.splice(i, 1);
				return group;
			}

			return reduceCount().orderNatural();
		}
		function groupAll() {
			var g = group(crossfilter_null), all = g.all;
			delete g.all;
			delete g.top;
			delete g.order;
			delete g.orderNatural;
			delete g.size;
			g.value = function() { return all()[0].value; };
			return g;
		}
		function dispose() {
			dimensionGroups.forEach(function(group) { group.dispose(); });
			var i = dataListeners.indexOf(preAdd);
			if (i >= 0) dataListeners.splice(i, 1);
			i = dataListeners.indexOf(postAdd);
			if (i >= 0) dataListeners.splice(i, 1);
			i = removeDataListeners.indexOf(removeData);
			if (i >= 0) removeDataListeners.splice(i, 1);
			for (i = 0; i < n; ++i) filters[i] &= zero;
			m &= zero;
			return dimension;
		}

		return dimension;
	}
	function groupAll() {
		var group = {
			reduce: reduce,
			reduceCount: reduceCount,
			reduceSum: reduceSum,
			value: value,
			dispose: dispose,
			remove: dispose
		};

		var reduceValue,
				reduceAdd,
				reduceRemove,
				reduceInitial,
				resetNeeded = true;
		filterListeners.push(update);
		dataListeners.push(add);
		add(data, 0, n);
		function add(newData, n0) {
			var i;

			if (resetNeeded) return;
			for (i = n0; i < n; ++i) {
				if (!filters[i]) {
					reduceValue = reduceAdd(reduceValue, data[i]);
				}
			}
		}
		function update(filterOne, added, removed) {
			var i,
					k,
					n;

			if (resetNeeded) return;
			for (i = 0, n = added.length; i < n; ++i) {
				if (!filters[k = added[i]]) {
					reduceValue = reduceAdd(reduceValue, data[k]);
				}
			}
			for (i = 0, n = removed.length; i < n; ++i) {
				if (filters[k = removed[i]] === filterOne) {
					reduceValue = reduceRemove(reduceValue, data[k]);
				}
			}
		}
		function reset() {
			var i;

			reduceValue = reduceInitial();

			for (i = 0; i < n; ++i) {
				if (!filters[i]) {
					reduceValue = reduceAdd(reduceValue, data[i]);
				}
			}
		}
		function reduce(add, remove, initial) {
			reduceAdd = add;
			reduceRemove = remove;
			reduceInitial = initial;
			resetNeeded = true;
			return group;
		}
		function reduceCount() {
			return reduce(crossfilter_reduceIncrement, crossfilter_reduceDecrement, crossfilter_zero);
		}
		function reduceSum(value) {
			return reduce(crossfilter_reduceAdd(value), crossfilter_reduceSubtract(value), crossfilter_zero);
		}
		function value() {
			if (resetNeeded) reset(), resetNeeded = false;
			return reduceValue;
		}
		function dispose() {
			var i = filterListeners.indexOf(update);
			if (i >= 0) filterListeners.splice(i);
			i = dataListeners.indexOf(add);
			if (i >= 0) dataListeners.splice(i);
			return group;
		}

		return reduceCount();
	}
	function size() {
		return n;
	}

	return arguments.length
			? add(arguments[0])
			: crossfilter;
}
function crossfilter_index(n, m) {
	return (m < 0x101
			? crossfilter_array8 : m < 0x10001
			? crossfilter_array16
			: crossfilter_array32)(n);
}
function crossfilter_range(n) {
	var range = crossfilter_index(n, n);
	for (var i = -1; ++i < n;) range[i] = i;
	return range;
}

function crossfilter_capacity(w) {
	return w === 8
			? 0x100 : w === 16
			? 0x10000
			: 0x100000000;
}
})(typeof exports !== 'undefined' && exports || this);

var Data, exports, D;
(function () {
	var typeList, makeTest, idx, typeKey, version, DC, idpad, cmax, API, protectJSON, each, eachin, isIndexable, returnFilter, runFilters, numcharsplit, orderByCol, run, intersection, filter, makeCid, safeForJson, isRegexp ;
	if (! Data) {
		version = '2.7';
		DC = 1;
		idpad = '000000';
		cmax = 1000;
		API = {};
		protectJSON = function (t) {
			if (Data.isArray(t) || Data.isObject(t)) {
				return t;
			}
			else {
				return JSON.parse(t);
			}
		};
		intersection = function(array1, array2) {
			return filter(array1, function(item) {
				return array2.indexOf(item) >= 0;
			});
		};
		filter = function(obj, iterator, context) {
			var results = [];
			if (obj == null) return results;
			if (Array.prototype.filter && obj.filter === Array.prototype.filter) return obj.filter(iterator, context);
			each(obj, function(value, index, list) {
				if (iterator.call(context, value, index, list)) results[results.length] = value;
			});
			return results;
		};
		isRegexp = function(aObj) {
			return Object.prototype.toString.call(aObj)==='[object RegExp]';
		}
		safeForJson = function(aObj) {
			var myResult = D.isArray(aObj) ? [] : D.isObject(aObj) ? {} : null;
			if(aObj===null) return aObj;
			for(var i in aObj) {
				myResult[i] = isRegexp(aObj[i]) ? aObj[i].toString() : D.isArray(aObj[i]) || D.isObject(aObj[i]) ? safeForJson(aObj[i]) : aObj[i];
			}
			return myResult;
		}
		makeCid = function(aContext) {
			var myCid = JSON.stringify(aContext);
			if(myCid.match(/regex/)===null) return myCid;
			return JSON.stringify(safeForJson(aContext));
		}
		each = function (a, fun, u) {
			var r, i, x, y;
			if (a && ((D.isArray(a) && a.length === 1) || (!D.isArray(a)))) {
				fun((D.isArray(a)) ? a[0] : a, 0);
			}
			else {
				for (r, i, x = 0, a = (D.isArray(a)) ? a : [a], y = a.length; x < y; x++) {
					i = a[x];
					if (!D.isUndefined(i) || (u || false)) {
						r = fun(i, x);
						if (r === D.EXIT) {
							break;
						}
					}
				}
			}
		};
		eachin = function (o, fun) {
			var x = 0, r, i;
			for (i in o) {
				if (o.hasOwnProperty(i)) {
					r = fun(o[i], i, x++);
					if (r === D.EXIT) {
						break;
					}
				}
			}
		};
		API.extend = function (m, f) {
			API[m] = function () {
				return f.apply(this, arguments);
			};
		};
		isIndexable = function (f) {
			var i;
			if (D.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
				return true;
			}
			if (D.isObject(f) && f.___id && f.___s) {
				return true;
			}
			if (D.isArray(f)) {
				i = true;
				each(f, function (r) {
					if (!isIndexable(r)) {
						i = false;
						return Data.EXIT;
					}
				});
				return i;
			}
			return false;
		};
		runFilters = function (r, filter) {
			var match = true;
			each(filter, function (mf) {
				switch (D.typeOf(mf)) {
					case 'function':
					if (!mf.apply(r)) {
						match = false;
						return Data.EXIT;
					}
					break;
					case 'array':
					match = (mf.length === 1) ? (runFilters(r, mf[0])) :
					(mf.length === 2) ? (runFilters(r, mf[0]) || runFilters(r, mf[1])) :
					(mf.length === 3) ? (runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2])) :
					(mf.length === 4) ? (runFilters(r, mf[0]) || runFilters(r, mf[1]) || runFilters(r, mf[2]) || runFilters(r, mf[3])) : false;
					if (mf.length > 4) {
						each(mf, function (f) {
							if (runFilters(r, f)) {
								match = true;
							}
						});
					}
					break;
				}
			});
			return match;
		};
		returnFilter = function (f) {
			var nf = [];
			if (D.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f)) {
				f = {___id : f};
			}
			if (D.isArray(f)) {
				each(f, function (r) {
					nf.push(returnFilter(r));
				});
				f = function () {
					var that = this, match = false;
					each(nf, function (f) {
						if (runFilters(that, f)) {
							match = true;
						}
					});
					return match;
				};
				return f;
			}
			if (D.isObject(f)) {
				if (D.isObject(f) && f.___id && f.___s) {
					f = {___id : f.___id};
				}
				eachin(f, function (v, i) {
					if (!D.isObject(v)) {
						v = {
							'is' : v
						};
					}
					eachin(v, function (mtest, s) {
						var c = [], looper;
						looper = (s === 'hasAll') ?
						function (mtest, func) {
							func(mtest);
						} : each;
						looper(mtest, function (mtest) {
							var su = true, f = false, matchFunc;
							matchFunc = function () {
								var mvalue = this[i], eqeq = '==', bangeq = '!=', eqeqeq = '===', lt = '<', gt = '>', lteq = '<=', gteq = '>=', bangeqeq = '!==', r ;
								if (typeof mvalue === 'undefined') {
									return false;
								}
								if ((s.indexOf('!') === 0) && s !== bangeq &&
									s !== bangeqeq)
								{
									su = false;
									s = s.substring(1, s.length);
								}
								r = (
									 (s === 'regex') ? (mtest.test(mvalue)) : (s === 'lt' || s === lt)
									 ? (mvalue < mtest) : (s === 'gt' || s === gt)
									 ? (mvalue > mtest) : (s === 'lte' || s === lteq)
									 ? (mvalue <= mtest) : (s === 'gte' || s === gteq)
									 ? (mvalue >= mtest) : (s === 'left')
									 ? (mvalue.indexOf(mtest) === 0) : (s === 'leftnocase')
									 ? (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) === 0) : (s === 'right')
									 ? (mvalue.substring((mvalue.length - mtest.length)) === mtest) : (s === 'rightnocase')
									 ? (mvalue.toLowerCase().substring((mvalue.length - mtest.length)) === mtest.toLowerCase()) : (s === 'like')
									 ? (mvalue.indexOf(mtest) >= 0) : (s === 'likenocase')
									 ? (mvalue.toLowerCase().indexOf(mtest.toLowerCase()) >= 0) : (s === eqeqeq || s === 'is')
									 ? (mvalue === mtest) : (s === eqeq)
									 ? (mvalue == mtest) : (s === bangeqeq)
									 ? (mvalue !== mtest) : (s === bangeq)
									 ? (mvalue != mtest) : (s === 'isnocase')
									 ? (mvalue.toLowerCase ? mvalue.toLowerCase() === mtest.toLowerCase() : mvalue === mtest) : (s === 'has')
									 ? (D.has(mvalue, mtest)) : (s === 'hasall')
									 ? (D.hasAll(mvalue, mtest)) : (s === 'contains')
									 ? (Data.isArray(mvalue) && mvalue.indexOf(mtest) > -1) : (s.indexOf('is') === -1 && !Data.isNull(mvalue) && !Data.isUndefined(mvalue) && !Data.isObject(mtest) && !Data.isArray(mtest) )
									 ? (mtest === mvalue[s]) : (D[s] && D.isFunction(D[s]) && s.indexOf('is') === 0)
									 ? D[s](mvalue) === mtest : (D[s] && D.isFunction(D[s]))
									 ? D[s](mvalue, mtest) : (false)
									 );
r = (r && !su) ? false : (!r && !su) ? true : r;
return r;
};
c.push(matchFunc);
});
if (c.length === 1) {
	nf.push(c[0]);
}
else {
	nf.push(function () {
		var that = this, match = false;
		each(c, function (f) {
			if (f.apply(that)) {
				match = true;
			}
		});
		return match;
	});
}
});
});
f = function () {
	var that = this, match = true;
	match = (nf.length === 1 && !nf[0].apply(that)) ? false : (nf.length === 2 && (!nf[0].apply(that) || !nf[1].apply(that))) ? false : (nf.length === 3 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that))) ? false : (nf.length === 4 && (!nf[0].apply(that) || !nf[1].apply(that) || !nf[2].apply(that) || !nf[3].apply(that))) ? false : true;
	if (nf.length > 4) {
		each(nf, function (f) {
			if (!runFilters(that, f)) {
				match = false;
			}
		});
	}
	return match;
};
return f;
}
if (D.isFunction(f)) {
	return f;
}
};
orderByCol = function (ar, o) {
	var sortFunc = function (a, b) {
		var r = 0;
		D.each(o, function (sd) {
			var o, col, dir, c, d;
			o = sd.split(' ');
			col = o[0];
			dir = (o.length === 1) ? "logical" : o[1];
			if (dir === 'logical') {
				c = numcharsplit(a[col]);
				d = numcharsplit(b[col]);
				D.each((c.length <= d.length) ? c : d, function (x, i) {
					if (c[i] < d[i]) {
						r = -1;
						return Data.EXIT;
					}
					else if (c[i] > d[i]) {
						r = 1;
						return Data.EXIT;
					}
				});
			}
			else if (dir === 'logicaldesc') {
				c = numcharsplit(a[col]);
				d = numcharsplit(b[col]);
				D.each((c.length <= d.length) ? c : d, function (x, i) {
					if (c[i] > d[i]) {
						r = -1;
						return Data.EXIT;
					}
					else if (c[i] < d[i]) {
						r = 1;
						return Data.EXIT;
					}
				});
			}
			else if (dir === 'asec' && a[col] < b[col]) {
				r = -1;
				return D.EXIT;
			}
			else if (dir === 'asec' && a[col] > b[col]) {
				r = 1;
				return D.EXIT;
			}
			else if (dir === 'desc' && a[col] > b[col]) {
				r = -1;
				return D.EXIT;
			}
			else if (dir === 'desc' && a[col] < b[col]) {
				r = 1;
				return D.EXIT;
			}
			if (r === 0 && dir === 'logical' && c.length < d.length) {
				r = -1;
			}
			else if (r === 0 && dir === 'logical' && c.length > d.length) {
				r = 1;
			}
			else if (r === 0 && dir === 'logicaldesc' && c.length > d.length) {
				r = -1;
			}
			else if (r === 0 && dir === 'logicaldesc' && c.length < d.length) {
				r = 1;
			}
			if (r !== 0) {
				return D.EXIT;
			}
		});
		return r;
		};
	return (ar && ar.push) ? ar.sort(sortFunc) : ar;
	};
(function () {
	var cache = {}, cachcounter = 0;
	numcharsplit = function (thing) {
		if (cachcounter > cmax) {
			cache = {};
			cachcounter = 0;
		}
		return cache['_' + thing] || (function () {
			var nthing = String(thing),
			na = [],
			rv = '_',
			rt = '',
			x, xx, c;
			for (x = 0, xx = nthing.length; x < xx; x++) {
				c = nthing.charCodeAt(x);
				if ((c >= 48 && c <= 57) || c === 46) {
					if (rt !== 'n') {
						rt = 'n';
						na.push(rv.toLowerCase());
						rv = '';
					}
					rv = rv + nthing.charAt(x);
				}
				else {
					if (rt !== 's') {
						rt = 's';
						na.push(parseFloat(rv));
						rv = '';
					}
					rv = rv + nthing.charAt(x);
				}
			}
			na.push((rt === 'n') ? parseFloat(rv) : rv.toLowerCase());
			na.shift();
			cache['_' + thing] = na;
			cachcounter++;
			return na;
		}());
	};
}());
run = function () {
	this.context({
		results : this.getDBI().query(this.context())
	});
};
API.extend('filter', function () {
	var
	nc = Data.mergeObj(this.context(), {run : null}),
	nq = []
	;
	each(nc.q, function (v) {
		nq.push(v);
	});
	nc.q = nq;
	each(arguments, function (f) {
		nc.q.push(returnFilter(f));
		nc.filterRaw.push(f);
	});
	return this.getroot(nc);
});
API.extend('order', function (o) {
	o = o.split(',');
	var x = [], nc;
	each(o, function (r) {
		x.push(r.replace(/^\s*/, '').replace(/\s*$/, ''));
	});
	nc = Data.mergeObj(this.context(), {sort : null});
	nc.order = x;
	return this.getroot(nc);
});
API.extend('limit', function (n) {
	var nc = Data.mergeObj(this.context(), {}),
	limitedresults
	;
	nc.limit = n;
	if (nc.run && nc.sort) {
		limitedresults = [];
		each(nc.results, function (i, x) {
			if ((x + 1) > n) {
				return Data.EXIT;
			}
			limitedresults.push(i);
		});
		nc.results = limitedresults;
	}
	return this.getroot(nc);
});
API.extend('start', function (n) {
	var nc = Data.mergeObj(this.context(), {}),
	limitedresults
	;
	nc.start = n;
	if (nc.run && nc.sort && !nc.limit) {
		limitedresults = [];
		each(nc.results, function (i, x) {
			if ((x + 1) > n) {
				limitedresults.push(i);
			}
		});
		nc.results = limitedresults;
	}
	else {
		nc = Data.mergeObj(this.context(), {run : null, start : n});
	}
	return this.getroot(nc);
});
API.extend('update', function (arg0, arg1, arg2) {
	var runEvent = true, o = {}, args = arguments, that;
	if (Data.isString(arg0) &&
		(arguments.length === 2 || arguments.length === 3))
	{
		o[arg0] = arg1;
		if (arguments.length === 3) {
			runEvent = arg2;
		}
	}
	else {
		o = arg0;
		if (args.length === 2) {
			runEvent = arg1;
		}
	}
	that = this;
	run.call(this);
	each(this.context().results, function (r) {
		var c = o;
		if (Data.isFunction(c)) {
			c = c.apply(Data.mergeObj(r, {}));
		}
		else {
			if (D.isFunction(c)) {
				c = c(Data.mergeObj(r, {}));
			}
		}
		if (Data.isObject(c)) {
			that.getDBI().update(r.___id, c, runEvent);
		}
	});
	if (this.context().results.length) {
		this.context({run : null});
	}
	return this;
});
API.extend('remove', function (runEvent) {
	var that = this, c = 0;
	run.call(this);
	each(this.context().results, function (r) {
		that.getDBI().remove(r.___id);
		c++;
	});
	if (this.context().results.length) {
		this.context({
			run : null
		});
		that.getDBI().removeCommit(runEvent);
	}
	return c;
});
API.extend('count', function () {
	run.call(this);
	return this.context().results.length;
});
API.extend('callback', function (f, delay) {
	if (f) {
		var that = this;
		setTimeout(function () {
			run.call(that);
			f.call(that.getroot(that.context()));
		}, delay || 0);
	}
	return null;
});
API.extend('get', function () {
	run.call(this);
	return this.context().results;
});
API.extend('stringify', function () {
	return JSON.stringify(this.get());
});
API.extend('first', function () {
	run.call(this);
	return this.context().results[0] || false;
});
API.extend('last', function () {
	run.call(this);
	return this.context().results[this.context().results.length - 1] ||
	false;
});
API.extend('sum', function () {
	var total = 0, that = this;
	run.call(that);
	each(arguments, function (c) {
		each(that.context().results, function (r) {
			total = total + (r[c] || 0);
		});
	});
	return total;
});
API.extend('min', function (c) {
	var lowest = null;
	run.call(this);
	each(this.context().results, function (r) {
		if (lowest === null || r[c] < lowest) {
			lowest = r[c];
		}
	});
	return lowest;
});
(function () {
	var innerJoinFunction = (function () {
		var fnCompareList, fnCombineRow, fnMain;
		fnCompareList = function (left_row, right_row, arg_list) {
			var data_lt, data_rt, op_code, error;
			if (arg_list.length === 2) {
				data_lt = left_row[arg_list[0]];
				op_code = '===';
				data_rt = right_row[arg_list[1]];
			}
			else {
				data_lt = left_row[arg_list[0]];
				op_code = arg_list[1];
				data_rt = right_row[arg_list[2]];
			}
			switch (op_code) {
				case '===' :
				return data_lt === data_rt;
				case '!==' :
				return data_lt !== data_rt;
				case '<' :
				return data_lt < data_rt;
				case '>' :
				return data_lt > data_rt;
				case '<=' :
				return data_lt <= data_rt;
				case '>=' :
				return data_lt >= data_rt;
				case '==' :
				return data_lt == data_rt;
				case '!=' :
				return data_lt != data_rt;
				default :
				throw String(op_code) + ' is not supported';
			}
		};
		fnCombineRow = function (left_row, right_row) {
			var out_map = {}, i, prefix;
			for (i in left_row) {
				if (left_row.hasOwnProperty(i)) {
					out_map[i] = left_row[i];
				}
			}
			for (i in right_row) {
				if (right_row.hasOwnProperty(i) && i !== '___id' &&
					i !== '___s')
				{
					prefix = !Data.isUndefined(out_map[i]) ? 'right_' : '';
					out_map[prefix + String(i)] = right_row[i];
				}
			}
			return out_map;
		};
		fnMain = function (table) {
			var
			right_table, i,
			arg_list = arguments,
			arg_length = arg_list.length,
			result_list = []
			;
			if (typeof table.filter !== 'function') {
				if (table.Data) {right_table = table();}
				else {
					throw 'Data DB or result not supplied';
				}
			}
			else {right_table = table;}
			this.context({
				results : this.getDBI().query(this.context())
			});
			Data.each(this.context().results, function (left_row) {
				right_table.each(function (right_row) {
					var arg_data, is_ok = true;
					CONDITION:
					for (i = 1; i < arg_length; i++) {
						arg_data = arg_list[i];
						if (typeof arg_data === 'function') {
							is_ok = arg_data(left_row, right_row);
						}
						else if (typeof arg_data === 'object' && arg_data.length) {
							is_ok = fnCompareList(left_row, right_row, arg_data);
						}
						else {
							is_ok = false;
						}
						if (!is_ok) {break CONDITION;}
					}
					if (is_ok) {
						result_list.push(fnCombineRow(left_row, right_row));
					}
				});
			});
			return Data(result_list)();
		};
		return fnMain;
	}());
API.extend('join', innerJoinFunction);
}());
API.extend('max', function (c) {
	var highest = null;
	run.call(this);
	each(this.context().results, function (r) {
		if (highest === null || r[c] > highest) {
			highest = r[c];
		}
	});
	return highest;
});
API.extend('select', function () {
	var ra = [], args = arguments;
	run.call(this);
	if (arguments.length === 1) {
		each(this.context().results, function (r) {
			ra.push(r[args[0]]);
		});
	}
	else {
		each(this.context().results, function (r) {
			var row = [];
			each(args, function (c) {
				row.push(r[c]);
			});
			ra.push(row);
		});
	}
	return ra;
});
API.extend('distinct', function () {
	var ra = [], args = arguments;
	run.call(this);
	if (arguments.length === 1) {
		each(this.context().results, function (r) {
			var v = r[args[0]], dup = false;
			each(ra, function (d) {
				if (v === d) {
					dup = true;
					return Data.EXIT;
				}
			});
			if (!dup) {
				ra.push(v);
			}
		});
	}
	else {
		each(this.context().results, function (r) {
			var row = [], dup = false;
			each(args, function (c) {
				row.push(r[c]);
			});
			each(ra, function (d) {
				var ldup = true;
				each(args, function (c, i) {
					if (row[i] !== d[i]) {
						ldup = false;
						return Data.EXIT;
					}
				});
				if (ldup) {
					dup = true;
					return Data.EXIT;
				}
			});
			if (!dup) {
				ra.push(row);
			}
		});
	}
	return ra;
});
API.extend('supplant', function (template, returnarray) {
	var ra = [];
	run.call(this);
	each(this.context().results, function (r) {
		ra.push(template.replace(/\{([^\{\}]*)\}/g, function (a, b) {
			var v = r[b];
			return typeof v === 'string' || typeof v === 'number' ? v : a;
		}));
	});
	return (!returnarray) ? ra.join("") : ra;
});
API.extend('each', function (m) {
	run.call(this);
	each(this.context().results, m);
	return this;
});
API.extend('map', function (m) {
	var ra = [];
	run.call(this);
	each(this.context().results, function (r) {
		ra.push(m(r));
	});
	return ra;
});
T = function (d) {
	var TOb = [],
	ID = {},
	RC = 1,
	settings = {
		template : false,
		onInsert : false,
		onUpdate : false,
		onRemove : false,
		onDBChange : false,
		storageName : false,
		forcePropertyCase : null,
		cacheSize : 100,
		name : ''
	},
	dm = new Date(),
	CacheCount = 0,
	CacheClear = 0,
	Cache = {},
	DBI, runIndexes, root
	;
	runIndexes = function (indexes) {
		var records = [], UniqueEnforce = false;
		if (indexes.length === 0) {
			return TOb;
		}
		each(indexes, function (f) {
			if (D.isString(f) && /[t][0-9]*[r][0-9]*/i.test(f) &&
				TOb[ID[f]])
			{
				records.push(TOb[ID[f]]);
				UniqueEnforce = true;
			}
			if (D.isObject(f) && f.___id && f.___s &&
				TOb[ID[f.___id]])
			{
				records.push(TOb[ID[f.___id]]);
				UniqueEnforce = true;
			}
			if (D.isArray(f)) {
				each(f, function (r) {
					each(runIndexes(r), function (rr) {
						records.push(rr);
					});
				});
			}
		});
		if (UniqueEnforce && records.length > 1) {
			records = [];
		}
		return records;
	};
	DBI = {
		dm : function (nd) {
			if (nd) {
				dm = nd;
				Cache = {};
				CacheCount = 0;
				CacheClear = 0;
			}
			if (settings.onDBChange) {
				setTimeout(function () {
					settings.onDBChange.call(TOb);
				}, 0);
			}
			if (settings.storageName) {
				setTimeout(function () {
					localStorage.setItem('data_' + settings.storageName,
										 JSON.stringify(TOb));
				});
			}
			return dm;
		},
		insert : function (i, runEvent) {
			var columns = [],
			records = [],
			input = protectJSON(i)
			;
			each(input, function (v, i) {
				var nv, o;
				if (D.isArray(v) && i === 0) {
					each(v, function (av) {
						columns.push((settings.forcePropertyCase === 'lower')
									 ? av.toLowerCase()
									 : (settings.forcePropertyCase === 'upper')
									 ? av.toUpperCase() : av);
					});
					return true;
				}
				else if (D.isArray(v)) {
					nv = {};
					each(v, function (av, ai) {
						nv[columns[ai]] = av;
					});
					v = nv;
				}
				else if (D.isObject(v) && settings.forcePropertyCase) {
					o = {};
					eachin(v, function (av, ai) {
						o[(settings.forcePropertyCase === 'lower') ? ai.toLowerCase()
						: (settings.forcePropertyCase === 'upper')
						? ai.toUpperCase() : ai] = v[ai];
					});
					v = o;
				}
				RC++;
				v.___id = 'T' + String(idpad + DC).slice(-6) + 'R' +
				String(idpad + RC).slice(-6);
				v.___s = true;
				records.push(v.___id);
				if (settings.template) {
					v = D.mergeObj(settings.template, v);
				}
				TOb.push(v);
				ID[v.___id] = TOb.length - 1;
				if (settings.onInsert &&
					(runEvent || Data.isUndefined(runEvent)))
				{
					settings.onInsert.call(v);
				}
				DBI.dm(new Date());
			});
return root(records);
},
sort : function (o) {
	TOb = orderByCol(TOb, o.split(','));
	ID = {};
	each(TOb, function (r, i) {
		ID[r.___id] = i;
	});
	DBI.dm(new Date());
	return true;
},
update : function (id, changes, runEvent) {
	var nc = {}, or, nr, tc, hasChange;
	if (settings.forcePropertyCase) {
		eachin(changes, function (v, p) {
			nc[(settings.forcePropertyCase === 'lower') ? p.toLowerCase()
			: (settings.forcePropertyCase === 'upper') ? p.toUpperCase()
			: p] = v;
		});
		changes = nc;
	}
	or = TOb[ID[id]];
	nr = D.mergeObj(or, changes);
	tc = {};
	hasChange = false;
	eachin(nr, function (v, i) {
		if (Data.isUndefined(or[i]) || or[i] !== v) {
			tc[i] = v;
			hasChange = true;
		}
	});
	if (hasChange) {
		if (settings.onUpdate &&
			(runEvent || Data.isUndefined(runEvent)))
		{
			settings.onUpdate.call(nr, TOb[ID[id]], tc);
		}
		TOb[ID[id]] = nr;
		DBI.dm(new Date());
	}
},
remove : function (id) {
	TOb[ID[id]].___s = false;
},
removeCommit : function (runEvent) {
	var x;
	for (x = TOb.length - 1; x > -1; x--) {
		if (!TOb[x].___s) {
			if (settings.onRemove &&
				(runEvent || Data.isUndefined(runEvent)))
			{
				settings.onRemove.call(TOb[x]);
			}
			ID[TOb[x].___id] = undefined;
			TOb.splice(x, 1);
		}
	}
	ID = {};
	each(TOb, function (r, i) {
		ID[r.___id] = i;
	});
	DBI.dm(new Date());
},
query : function (context) {
	var returnq, cid, results, indexed, limitq, ni;
	if (settings.cacheSize) {
		cid = '';
		each(context.filterRaw, function (r) {
			if (D.isFunction(r)) {
				cid = 'nocache';
				return Data.EXIT;
			}
		});
		if (cid === '') {
			cid = makeCid(D.mergeObj(context,
						  {q : false, run : false, sort : false}));
		}
	}
	if (!context.results || !context.run ||
		(context.run && DBI.dm() > context.run))
	{
		results = [];
		if (settings.cacheSize && Cache[cid]) {
			Cache[cid].i = CacheCount++;
			return Cache[cid].results;
		}
		else {
			if (context.q.length === 0 && context.index.length === 0) {
				each(TOb, function (r) {
					results.push(r);
				});
				returnq = results;
			}
			else {
				indexed = runIndexes(context.index);
				each(indexed, function (r) {
					if (context.q.length === 0 || runFilters(r, context.q)) {
						results.push(r);
					}
				});
				returnq = results;
			}
		}
	}
	else {
		returnq = context.results;
	}
	if (context.order.length > 0 && (!context.run || !context.sort)) {
		returnq = orderByCol(returnq, context.order);
	}
	if (returnq.length &&
		((context.limit && context.limit < returnq.length) ||
		 context.start)
		) {
		limitq = [];
	each(returnq, function (r, i) {
		if (!context.start ||
			(context.start && (i + 1) >= context.start))
		{
			if (context.limit) {
				ni = (context.start) ? (i + 1) - context.start : i;
				if (ni < context.limit) {
					limitq.push(r);
				}
				else if (ni > context.limit) {
					return Data.EXIT;
				}
			}
			else {
				limitq.push(r);
			}
		}
	});
	returnq = limitq;
}
if (settings.cacheSize && cid !== 'nocache') {
	CacheClear++;
	setTimeout(function () {
		var bCounter, nc;
		if (CacheClear >= settings.cacheSize * 2) {
			CacheClear = 0;
			bCounter = CacheCount - settings.cacheSize;
			nc = {};
			eachin(function (r, k) {
				if (r.i >= bCounter) {
					nc[k] = r;
				}
			});
			Cache = nc;
		}
	}, 0);
	Cache[cid] = {i : CacheCount++, results : returnq};
}
return returnq;
}
};
root = function () {
	var iAPI, context;
	iAPI = Data.mergeObj(Data.mergeObj(API, {insert : undefined}),
						  {getDBI : function () {return DBI;},
						  getroot : function (c) {return root.call(c);},
						  context : function (n) {
							if (n) {
								context = Data.mergeObj(context,
														 n.hasOwnProperty('results')
														 ? Data.mergeObj(n, {run : new Date(), sort: new Date()})
														 : n
														 );
							}
							return context;
						  },
						  extend : undefined
					  });
	context = (this && this.q) ? this : {
		limit : false,
		start : false,
		q : [],
		filterRaw : [],
		index : [],
		order : [],
		results : false,
		run : null,
		sort : null,
		settings : settings
	};
	each(arguments, function (f) {
		if (isIndexable(f)) {
			context.index.push(f);
		}
		else {
			context.q.push(returnFilter(f));
		}
		context.filterRaw.push(f);
	});
	return iAPI;
};
DC++;
if (d) {
	DBI.insert(d);
}
root.insert = DBI.insert;
root.merge = function (i, key, runEvent) {
	var
	search = {},
	finalSearch = [],
	obj = {}
	;
	runEvent = runEvent || false;
	key = key || 'id';
	each(i, function (o) {
		var existingObject;
		search[key] = o[key];
		finalSearch.push(o[key]);
		existingObject = root(search).first();
		if (existingObject) {
			DBI.update(existingObject.___id, o, runEvent);
		}
		else {
			DBI.insert(o, runEvent);
		}
	});
	obj[key] = finalSearch;
	return root(obj);
};
root.Data = true;
root.sort = DBI.sort;
root.settings = function (n) {
	if (n) {
		settings = Data.mergeObj(settings, n);
		if (n.template) {
			root().update(n.template);
		}
	}
	return settings;
};
root.store = function (n) {
	var r = false, i;
	if (localStorage) {
		if (n) {
			i = localStorage.getItem('data_' + n);
			if (i && i.length > 0) {
				root.insert(i);
				r = true;
			}
			if (TOb.length > 0) {
				setTimeout(function () {
					localStorage.setItem('data_' + settings.storageName, JSON.stringify(TOb));
				});
			}
		}
		root.settings({storageName : n});
	}
	return root;
};
return root;
};
Data = D;
D.each = each;
D.eachin = eachin;
D.extend = API.extend;
Data.EXIT = 'DataEXIT';
Data.mergeObj = function (ob1, ob2) {
	var c = {};
	eachin(ob1, function (v, n) {c[n] = ob1[n];});
	eachin(ob2, function (v, n) {c[n] = ob2[n];});
	return c;
};
Data.has = function (var1, var2) {
	var re = false, n;
	if ((var1.Data)) {
		re = var1(var2);
		if (re.length > 0) {
			return true;
		}
		else {
			return false;
		}
	}
	else {
		switch (D.typeOf(var1)) {
			case 'object':
			if (D.isObject(var2)) {
				eachin(var2, function (v, n) {
					if (re === true && !D.isUndefined(var1[n]) &&
						var1.hasOwnProperty(n))
					{
						re = D.has(var1[n], var2[n]);
					}
					else {
						re = false;
						return Data.EXIT;
					}
				});
			}
			else if (D.isArray(var2)) {
				each(var2, function (v, n) {
					re = D.has(var1, var2[n]);
					if (re) {
						return Data.EXIT;
					}
				});
			}
			else if (D.isString(var2)) {
				if (!Data.isUndefined(var1[var2])) {
					return true;
				}
				else {
					return false;
				}
			}
			return re;
			case 'array':
			if (D.isObject(var2)) {
				each(var1, function (v, i) {
					re = D.has(var1[i], var2);
					if (re === true) {
						return Data.EXIT;
					}
				});
			}
			else if (D.isArray(var2)) {
				each(var2, function (v2, i2) {
					each(var1, function (v1, i1) {
						re = D.has(var1[i1], var2[i2]);
						if (re === true) {
							return Data.EXIT;
						}
					});
					if (re === true) {
						return Data.EXIT;
					}
				});
			}
			else if (D.isString(var2) || D.isNumber(var2)) {
				re = false;
				for (n = 0; n < var1.length; n++) {
					re = D.has(var1[n], var2);
					if (re) {
						return true;
					}
				}
			}
			return re;
			case 'string':
			if (D.isString(var2) && var2 === var1) {
				return true;
			}
			break;
			default:
			if (D.typeOf(var1) === D.typeOf(var2) && var1 === var2) {
				return true;
			}
			break;
		}
	}
	return false;
};
Data.hasAll = function (var1, var2) {
	var D = Data, ar;
	if (D.isArray(var2)) {
		ar = true;
		each(var2, function (v) {
			ar = D.has(var1, v);
			if (ar === false) {
				return Data.EXIT;
			}
		});
		return ar;
	}
	else {
		return D.has(var1, var2);
	}
};
Data.typeOf = function (v) {
	var s = typeof v;
	if (s === 'object') {
		if (v) {
			if (typeof v.length === 'number' &&
				!(v.propertyIsEnumerable('length')))
			{
				s = 'array';
			}
		}
		else {
			s = 'null';
		}
	}
	return s;
};
Data.getObjectKeys = function (ob) {
	var kA = [];
	eachin(ob, function (n, h) {
		kA.push(h);
	});
	kA.sort();
	return kA;
};
Data.isSameArray = function (ar1, ar2) {
	return (Data.isArray(ar1) && Data.isArray(ar2) &&
			ar1.join(',') === ar2.join(',')) ? true : false;
};
Data.isSameObject = function (ob1, ob2) {
	var D = Data, rv = true;
	if (D.isObject(ob1) && D.isObject(ob2)) {
		if (D.isSameArray(D.getObjectKeys(ob1),
			D.getObjectKeys(ob2)))
		{
			eachin(ob1, function (v, n) {
				if (! ((D.isObject(ob1[n]) && D.isObject(ob2[n]) &&
					D.isSameObject(ob1[n], ob2[n])) ||
					(D.isArray(ob1[n]) && D.isArray(ob2[n]) &&
					 D.isSameArray(ob1[n], ob2[n])) || (ob1[n] === ob2[n]))
					) {
					rv = false;
				return Data.EXIT;
			}
		});
		}
		else {
			rv = false;
		}
	}
	else {
		rv = false;
	}
	return rv;
};
typeList = [
'String', 'Number', 'Object', 'Array',
'Boolean', 'Null', 'Function', 'Undefined'
];
makeTest = function (thisKey) {
	return function (data) {
		return Data.typeOf(data) === thisKey.toLowerCase() ? true : false;
	};
};
for (idx = 0; idx < typeList.length; idx++) {
	typeKey = typeList[idx];
	Data['is' + typeKey] = makeTest(typeKey);
}
}
}());
if (typeof(exports) === 'object') {
	exports.data = Data;
}
