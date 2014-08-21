/*! plastic - v0.1.0 - 2014-08-21
* https://github.com/Fannon/plasticjs
* Copyright (c) 2014 Simon Heimler; Licensed MIT */
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module !== 'undefined' && module.exports){
    // CommonJS. Define export.
    module.exports = factory();
  } else {
    // Browser globals
    global.tv4 = factory();
  }
}(this, function () {

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2Fkeys
if (!Object.keys) {
	Object.keys = (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [];

			for (var prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (var i=0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	})();
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if (!Object.create) {
	Object.create = (function(){
		function F(){}

		return function(o){
			if (arguments.length !== 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}
			F.prototype = o;
			return new F();
		};
	})();
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FisArray
if(!Array.isArray) {
	Array.isArray = function (vArg) {
		return Object.prototype.toString.call(vArg) === "[object Array]";
	};
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FArray%2FindexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		if (this === null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;

		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 1) {
			n = Number(arguments[1]);
			if (n !== n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n !== 0 && n !== Infinity && n !== -Infinity) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}

// Grungey Object.isFrozen hack
if (!Object.isFrozen) {
	Object.isFrozen = function (obj) {
		var key = "tv4_test_frozen_key";
		while (obj.hasOwnProperty(key)) {
			key += Math.random();
		}
		try {
			obj[key] = true;
			delete obj[key];
			return false;
		} catch (e) {
			return true;
		}
	};
}
var ValidatorContext = function ValidatorContext(parent, collectMultiple, errorMessages, checkRecursive, trackUnknownProperties) {
	this.missing = [];
	this.missingMap = {};
	this.formatValidators = parent ? Object.create(parent.formatValidators) : {};
	this.schemas = parent ? Object.create(parent.schemas) : {};
	this.collectMultiple = collectMultiple;
	this.errors = [];
	this.handleError = collectMultiple ? this.collectError : this.returnError;
	if (checkRecursive) {
		this.checkRecursive = true;
		this.scanned = [];
		this.scannedFrozen = [];
		this.scannedFrozenSchemas = [];
		this.scannedFrozenValidationErrors = [];
		this.validatedSchemasKey = 'tv4_validation_id';
		this.validationErrorsKey = 'tv4_validation_errors_id';
	}
	if (trackUnknownProperties) {
		this.trackUnknownProperties = true;
		this.knownPropertyPaths = {};
		this.unknownPropertyPaths = {};
	}
	this.errorMessages = errorMessages;
	this.definedKeywords = {};
	if (parent) {
		for (var key in parent.definedKeywords) {
			this.definedKeywords[key] = parent.definedKeywords[key].slice(0);
		}
	}
};
ValidatorContext.prototype.defineKeyword = function (keyword, keywordFunction) {
	this.definedKeywords[keyword] = this.definedKeywords[keyword] || [];
	this.definedKeywords[keyword].push(keywordFunction);
};
ValidatorContext.prototype.createError = function (code, messageParams, dataPath, schemaPath, subErrors) {
	var messageTemplate = this.errorMessages[code] || ErrorMessagesDefault[code];
	if (typeof messageTemplate !== 'string') {
		return new ValidationError(code, "Unknown error code " + code + ": " + JSON.stringify(messageParams), dataPath, schemaPath, subErrors);
	}
	// Adapted from Crockford's supplant()
	var message = messageTemplate.replace(/\{([^{}]*)\}/g, function (whole, varName) {
		var subValue = messageParams[varName];
		return typeof subValue === 'string' || typeof subValue === 'number' ? subValue : whole;
	});
	return new ValidationError(code, message, dataPath, schemaPath, subErrors);
};
ValidatorContext.prototype.returnError = function (error) {
	return error;
};
ValidatorContext.prototype.collectError = function (error) {
	if (error) {
		this.errors.push(error);
	}
	return null;
};
ValidatorContext.prototype.prefixErrors = function (startIndex, dataPath, schemaPath) {
	for (var i = startIndex; i < this.errors.length; i++) {
		this.errors[i] = this.errors[i].prefixWith(dataPath, schemaPath);
	}
	return this;
};
ValidatorContext.prototype.banUnknownProperties = function () {
	for (var unknownPath in this.unknownPropertyPaths) {
		var error = this.createError(ErrorCodes.UNKNOWN_PROPERTY, {path: unknownPath}, unknownPath, "");
		var result = this.handleError(error);
		if (result) {
			return result;
		}
	}
	return null;
};

ValidatorContext.prototype.addFormat = function (format, validator) {
	if (typeof format === 'object') {
		for (var key in format) {
			this.addFormat(key, format[key]);
		}
		return this;
	}
	this.formatValidators[format] = validator;
};
ValidatorContext.prototype.resolveRefs = function (schema, urlHistory) {
	if (schema['$ref'] !== undefined) {
		urlHistory = urlHistory || {};
		if (urlHistory[schema['$ref']]) {
			return this.createError(ErrorCodes.CIRCULAR_REFERENCE, {urls: Object.keys(urlHistory).join(', ')}, '', '');
		}
		urlHistory[schema['$ref']] = true;
		schema = this.getSchema(schema['$ref'], urlHistory);
	}
	return schema;
};
ValidatorContext.prototype.getSchema = function (url, urlHistory) {
	var schema;
	if (this.schemas[url] !== undefined) {
		schema = this.schemas[url];
		return this.resolveRefs(schema, urlHistory);
	}
	var baseUrl = url;
	var fragment = "";
	if (url.indexOf('#') !== -1) {
		fragment = url.substring(url.indexOf("#") + 1);
		baseUrl = url.substring(0, url.indexOf("#"));
	}
	if (typeof this.schemas[baseUrl] === 'object') {
		schema = this.schemas[baseUrl];
		var pointerPath = decodeURIComponent(fragment);
		if (pointerPath === "") {
			return this.resolveRefs(schema, urlHistory);
		} else if (pointerPath.charAt(0) !== "/") {
			return undefined;
		}
		var parts = pointerPath.split("/").slice(1);
		for (var i = 0; i < parts.length; i++) {
			var component = parts[i].replace(/~1/g, "/").replace(/~0/g, "~");
			if (schema[component] === undefined) {
				schema = undefined;
				break;
			}
			schema = schema[component];
		}
		if (schema !== undefined) {
			return this.resolveRefs(schema, urlHistory);
		}
	}
	if (this.missing[baseUrl] === undefined) {
		this.missing.push(baseUrl);
		this.missing[baseUrl] = baseUrl;
		this.missingMap[baseUrl] = baseUrl;
	}
};
ValidatorContext.prototype.searchSchemas = function (schema, url) {
	if (schema && typeof schema === "object") {
		if (typeof schema.id === "string") {
			if (isTrustedUrl(url, schema.id)) {
				if (this.schemas[schema.id] === undefined) {
					this.schemas[schema.id] = schema;
				}
			}
		}
		for (var key in schema) {
			if (key !== "enum") {
				if (typeof schema[key] === "object") {
					this.searchSchemas(schema[key], url);
				} else if (key === "$ref") {
					var uri = getDocumentUri(schema[key]);
					if (uri && this.schemas[uri] === undefined && this.missingMap[uri] === undefined) {
						this.missingMap[uri] = uri;
					}
				}
			}
		}
	}
};
ValidatorContext.prototype.addSchema = function (url, schema) {
	//overload
	if (typeof url !== 'string' || typeof schema === 'undefined') {
		if (typeof url === 'object' && typeof url.id === 'string') {
			schema = url;
			url = schema.id;
		}
		else {
			return;
		}
	}
	if (url = getDocumentUri(url) + "#") {
		// Remove empty fragment
		url = getDocumentUri(url);
	}
	this.schemas[url] = schema;
	delete this.missingMap[url];
	normSchema(schema, url);
	this.searchSchemas(schema, url);
};

ValidatorContext.prototype.getSchemaMap = function () {
	var map = {};
	for (var key in this.schemas) {
		map[key] = this.schemas[key];
	}
	return map;
};

ValidatorContext.prototype.getSchemaUris = function (filterRegExp) {
	var list = [];
	for (var key in this.schemas) {
		if (!filterRegExp || filterRegExp.test(key)) {
			list.push(key);
		}
	}
	return list;
};

ValidatorContext.prototype.getMissingUris = function (filterRegExp) {
	var list = [];
	for (var key in this.missingMap) {
		if (!filterRegExp || filterRegExp.test(key)) {
			list.push(key);
		}
	}
	return list;
};

ValidatorContext.prototype.dropSchemas = function () {
	this.schemas = {};
	this.reset();
};
ValidatorContext.prototype.reset = function () {
	this.missing = [];
	this.missingMap = {};
	this.errors = [];
};

ValidatorContext.prototype.validateAll = function (data, schema, dataPathParts, schemaPathParts, dataPointerPath) {
	var topLevel;
	schema = this.resolveRefs(schema);
	if (!schema) {
		return null;
	} else if (schema instanceof ValidationError) {
		this.errors.push(schema);
		return schema;
	}

	var startErrorCount = this.errors.length;
	var frozenIndex, scannedFrozenSchemaIndex = null, scannedSchemasIndex = null;
	if (this.checkRecursive && data && typeof data === 'object') {
		topLevel = !this.scanned.length;
		if (data[this.validatedSchemasKey]) {
			var schemaIndex = data[this.validatedSchemasKey].indexOf(schema);
			if (schemaIndex !== -1) {
				this.errors = this.errors.concat(data[this.validationErrorsKey][schemaIndex]);
				return null;
			}
		}
		if (Object.isFrozen(data)) {
			frozenIndex = this.scannedFrozen.indexOf(data);
			if (frozenIndex !== -1) {
				var frozenSchemaIndex = this.scannedFrozenSchemas[frozenIndex].indexOf(schema);
				if (frozenSchemaIndex !== -1) {
					this.errors = this.errors.concat(this.scannedFrozenValidationErrors[frozenIndex][frozenSchemaIndex]);
					return null;
				}
			}
		}
		this.scanned.push(data);
		if (Object.isFrozen(data)) {
			if (frozenIndex === -1) {
				frozenIndex = this.scannedFrozen.length;
				this.scannedFrozen.push(data);
				this.scannedFrozenSchemas.push([]);
			}
			scannedFrozenSchemaIndex = this.scannedFrozenSchemas[frozenIndex].length;
			this.scannedFrozenSchemas[frozenIndex][scannedFrozenSchemaIndex] = schema;
			this.scannedFrozenValidationErrors[frozenIndex][scannedFrozenSchemaIndex] = [];
		} else {
			if (!data[this.validatedSchemasKey]) {
				try {
					Object.defineProperty(data, this.validatedSchemasKey, {
						value: [],
						configurable: true
					});
					Object.defineProperty(data, this.validationErrorsKey, {
						value: [],
						configurable: true
					});
				} catch (e) {
					//IE 7/8 workaround
					data[this.validatedSchemasKey] = [];
					data[this.validationErrorsKey] = [];
				}
			}
			scannedSchemasIndex = data[this.validatedSchemasKey].length;
			data[this.validatedSchemasKey][scannedSchemasIndex] = schema;
			data[this.validationErrorsKey][scannedSchemasIndex] = [];
		}
	}

	var errorCount = this.errors.length;
	var error = this.validateBasic(data, schema, dataPointerPath)
		|| this.validateNumeric(data, schema, dataPointerPath)
		|| this.validateString(data, schema, dataPointerPath)
		|| this.validateArray(data, schema, dataPointerPath)
		|| this.validateObject(data, schema, dataPointerPath)
		|| this.validateCombinations(data, schema, dataPointerPath)
		|| this.validateFormat(data, schema, dataPointerPath)
		|| this.validateDefinedKeywords(data, schema, dataPointerPath)
		|| null;

	if (topLevel) {
		while (this.scanned.length) {
			var item = this.scanned.pop();
			delete item[this.validatedSchemasKey];
		}
		this.scannedFrozen = [];
		this.scannedFrozenSchemas = [];
	}

	if (error || errorCount !== this.errors.length) {
		while ((dataPathParts && dataPathParts.length) || (schemaPathParts && schemaPathParts.length)) {
			var dataPart = (dataPathParts && dataPathParts.length) ? "" + dataPathParts.pop() : null;
			var schemaPart = (schemaPathParts && schemaPathParts.length) ? "" + schemaPathParts.pop() : null;
			if (error) {
				error = error.prefixWith(dataPart, schemaPart);
			}
			this.prefixErrors(errorCount, dataPart, schemaPart);
		}
	}
	
	if (scannedFrozenSchemaIndex !== null) {
		this.scannedFrozenValidationErrors[frozenIndex][scannedFrozenSchemaIndex] = this.errors.slice(startErrorCount);
	} else if (scannedSchemasIndex !== null) {
		data[this.validationErrorsKey][scannedSchemasIndex] = this.errors.slice(startErrorCount);
	}

	return this.handleError(error);
};
ValidatorContext.prototype.validateFormat = function (data, schema) {
	if (typeof schema.format !== 'string' || !this.formatValidators[schema.format]) {
		return null;
	}
	var errorMessage = this.formatValidators[schema.format].call(null, data, schema);
	if (typeof errorMessage === 'string' || typeof errorMessage === 'number') {
		return this.createError(ErrorCodes.FORMAT_CUSTOM, {message: errorMessage}).prefixWith(null, "format");
	} else if (errorMessage && typeof errorMessage === 'object') {
		return this.createError(ErrorCodes.FORMAT_CUSTOM, {message: errorMessage.message || "?"}, errorMessage.dataPath || null, errorMessage.schemaPath || "/format");
	}
	return null;
};
ValidatorContext.prototype.validateDefinedKeywords = function (data, schema) {
	for (var key in this.definedKeywords) {
		var validationFunctions = this.definedKeywords[key];
		for (var i = 0; i < validationFunctions.length; i++) {
			var func = validationFunctions[i];
			var result = func(data, schema[key], schema);
			if (typeof result === 'string' || typeof result === 'number') {
				return this.createError(ErrorCodes.KEYWORD_CUSTOM, {key: key, message: result}).prefixWith(null, "format");
			} else if (result && typeof result === 'object') {
				var code = result.code || ErrorCodes.KEYWORD_CUSTOM;
				if (typeof code === 'string') {
					if (!ErrorCodes[code]) {
						throw new Error('Undefined error code (use defineError): ' + code);
					}
					code = ErrorCodes[code];
				}
				var messageParams = (typeof result.message === 'object') ? result.message : {key: key, message: result.message || "?"};
				var schemaPath = result.schemaPath ||( "/" + key.replace(/~/g, '~0').replace(/\//g, '~1'));
				return this.createError(code, messageParams, result.dataPath || null, schemaPath);
			}
		}
	}
	return null;
};

function recursiveCompare(A, B) {
	if (A === B) {
		return true;
	}
	if (typeof A === "object" && typeof B === "object") {
		if (Array.isArray(A) !== Array.isArray(B)) {
			return false;
		} else if (Array.isArray(A)) {
			if (A.length !== B.length) {
				return false;
			}
			for (var i = 0; i < A.length; i++) {
				if (!recursiveCompare(A[i], B[i])) {
					return false;
				}
			}
		} else {
			var key;
			for (key in A) {
				if (B[key] === undefined && A[key] !== undefined) {
					return false;
				}
			}
			for (key in B) {
				if (A[key] === undefined && B[key] !== undefined) {
					return false;
				}
			}
			for (key in A) {
				if (!recursiveCompare(A[key], B[key])) {
					return false;
				}
			}
		}
		return true;
	}
	return false;
}

ValidatorContext.prototype.validateBasic = function validateBasic(data, schema, dataPointerPath) {
	var error;
	if (error = this.validateType(data, schema, dataPointerPath)) {
		return error.prefixWith(null, "type");
	}
	if (error = this.validateEnum(data, schema, dataPointerPath)) {
		return error.prefixWith(null, "type");
	}
	return null;
};

ValidatorContext.prototype.validateType = function validateType(data, schema) {
	if (schema.type === undefined) {
		return null;
	}
	var dataType = typeof data;
	if (data === null) {
		dataType = "null";
	} else if (Array.isArray(data)) {
		dataType = "array";
	}
	var allowedTypes = schema.type;
	if (typeof allowedTypes !== "object") {
		allowedTypes = [allowedTypes];
	}

	for (var i = 0; i < allowedTypes.length; i++) {
		var type = allowedTypes[i];
		if (type === dataType || (type === "integer" && dataType === "number" && (data % 1 === 0))) {
			return null;
		}
	}
	return this.createError(ErrorCodes.INVALID_TYPE, {type: dataType, expected: allowedTypes.join("/")});
};

ValidatorContext.prototype.validateEnum = function validateEnum(data, schema) {
	if (schema["enum"] === undefined) {
		return null;
	}
	for (var i = 0; i < schema["enum"].length; i++) {
		var enumVal = schema["enum"][i];
		if (recursiveCompare(data, enumVal)) {
			return null;
		}
	}
	return this.createError(ErrorCodes.ENUM_MISMATCH, {value: (typeof JSON !== 'undefined') ? JSON.stringify(data) : data});
};

ValidatorContext.prototype.validateNumeric = function validateNumeric(data, schema, dataPointerPath) {
	return this.validateMultipleOf(data, schema, dataPointerPath)
		|| this.validateMinMax(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateMultipleOf = function validateMultipleOf(data, schema) {
	var multipleOf = schema.multipleOf || schema.divisibleBy;
	if (multipleOf === undefined) {
		return null;
	}
	if (typeof data === "number") {
		if (data % multipleOf !== 0) {
			return this.createError(ErrorCodes.NUMBER_MULTIPLE_OF, {value: data, multipleOf: multipleOf});
		}
	}
	return null;
};

ValidatorContext.prototype.validateMinMax = function validateMinMax(data, schema) {
	if (typeof data !== "number") {
		return null;
	}
	if (schema.minimum !== undefined) {
		if (data < schema.minimum) {
			return this.createError(ErrorCodes.NUMBER_MINIMUM, {value: data, minimum: schema.minimum}).prefixWith(null, "minimum");
		}
		if (schema.exclusiveMinimum && data === schema.minimum) {
			return this.createError(ErrorCodes.NUMBER_MINIMUM_EXCLUSIVE, {value: data, minimum: schema.minimum}).prefixWith(null, "exclusiveMinimum");
		}
	}
	if (schema.maximum !== undefined) {
		if (data > schema.maximum) {
			return this.createError(ErrorCodes.NUMBER_MAXIMUM, {value: data, maximum: schema.maximum}).prefixWith(null, "maximum");
		}
		if (schema.exclusiveMaximum && data === schema.maximum) {
			return this.createError(ErrorCodes.NUMBER_MAXIMUM_EXCLUSIVE, {value: data, maximum: schema.maximum}).prefixWith(null, "exclusiveMaximum");
		}
	}
	return null;
};

ValidatorContext.prototype.validateString = function validateString(data, schema, dataPointerPath) {
	return this.validateStringLength(data, schema, dataPointerPath)
		|| this.validateStringPattern(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateStringLength = function validateStringLength(data, schema) {
	if (typeof data !== "string") {
		return null;
	}
	if (schema.minLength !== undefined) {
		if (data.length < schema.minLength) {
			return this.createError(ErrorCodes.STRING_LENGTH_SHORT, {length: data.length, minimum: schema.minLength}).prefixWith(null, "minLength");
		}
	}
	if (schema.maxLength !== undefined) {
		if (data.length > schema.maxLength) {
			return this.createError(ErrorCodes.STRING_LENGTH_LONG, {length: data.length, maximum: schema.maxLength}).prefixWith(null, "maxLength");
		}
	}
	return null;
};

ValidatorContext.prototype.validateStringPattern = function validateStringPattern(data, schema) {
	if (typeof data !== "string" || schema.pattern === undefined) {
		return null;
	}
	var regexp = new RegExp(schema.pattern);
	if (!regexp.test(data)) {
		return this.createError(ErrorCodes.STRING_PATTERN, {pattern: schema.pattern}).prefixWith(null, "pattern");
	}
	return null;
};
ValidatorContext.prototype.validateArray = function validateArray(data, schema, dataPointerPath) {
	if (!Array.isArray(data)) {
		return null;
	}
	return this.validateArrayLength(data, schema, dataPointerPath)
		|| this.validateArrayUniqueItems(data, schema, dataPointerPath)
		|| this.validateArrayItems(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateArrayLength = function validateArrayLength(data, schema) {
	var error;
	if (schema.minItems !== undefined) {
		if (data.length < schema.minItems) {
			error = (this.createError(ErrorCodes.ARRAY_LENGTH_SHORT, {length: data.length, minimum: schema.minItems})).prefixWith(null, "minItems");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	if (schema.maxItems !== undefined) {
		if (data.length > schema.maxItems) {
			error = (this.createError(ErrorCodes.ARRAY_LENGTH_LONG, {length: data.length, maximum: schema.maxItems})).prefixWith(null, "maxItems");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateArrayUniqueItems = function validateArrayUniqueItems(data, schema) {
	if (schema.uniqueItems) {
		for (var i = 0; i < data.length; i++) {
			for (var j = i + 1; j < data.length; j++) {
				if (recursiveCompare(data[i], data[j])) {
					var error = (this.createError(ErrorCodes.ARRAY_UNIQUE, {match1: i, match2: j})).prefixWith(null, "uniqueItems");
					if (this.handleError(error)) {
						return error;
					}
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateArrayItems = function validateArrayItems(data, schema, dataPointerPath) {
	if (schema.items === undefined) {
		return null;
	}
	var error, i;
	if (Array.isArray(schema.items)) {
		for (i = 0; i < data.length; i++) {
			if (i < schema.items.length) {
				if (error = this.validateAll(data[i], schema.items[i], [i], ["items", i], dataPointerPath + "/" + i)) {
					return error;
				}
			} else if (schema.additionalItems !== undefined) {
				if (typeof schema.additionalItems === "boolean") {
					if (!schema.additionalItems) {
						error = (this.createError(ErrorCodes.ARRAY_ADDITIONAL_ITEMS, {})).prefixWith("" + i, "additionalItems");
						if (this.handleError(error)) {
							return error;
						}
					}
				} else if (error = this.validateAll(data[i], schema.additionalItems, [i], ["additionalItems"], dataPointerPath + "/" + i)) {
					return error;
				}
			}
		}
	} else {
		for (i = 0; i < data.length; i++) {
			if (error = this.validateAll(data[i], schema.items, [i], ["items"], dataPointerPath + "/" + i)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObject = function validateObject(data, schema, dataPointerPath) {
	if (typeof data !== "object" || data === null || Array.isArray(data)) {
		return null;
	}
	return this.validateObjectMinMaxProperties(data, schema, dataPointerPath)
		|| this.validateObjectRequiredProperties(data, schema, dataPointerPath)
		|| this.validateObjectProperties(data, schema, dataPointerPath)
		|| this.validateObjectDependencies(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateObjectMinMaxProperties = function validateObjectMinMaxProperties(data, schema) {
	var keys = Object.keys(data);
	var error;
	if (schema.minProperties !== undefined) {
		if (keys.length < schema.minProperties) {
			error = this.createError(ErrorCodes.OBJECT_PROPERTIES_MINIMUM, {propertyCount: keys.length, minimum: schema.minProperties}).prefixWith(null, "minProperties");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	if (schema.maxProperties !== undefined) {
		if (keys.length > schema.maxProperties) {
			error = this.createError(ErrorCodes.OBJECT_PROPERTIES_MAXIMUM, {propertyCount: keys.length, maximum: schema.maxProperties}).prefixWith(null, "maxProperties");
			if (this.handleError(error)) {
				return error;
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectRequiredProperties = function validateObjectRequiredProperties(data, schema) {
	if (schema.required !== undefined) {
		for (var i = 0; i < schema.required.length; i++) {
			var key = schema.required[i];
			if (data[key] === undefined) {
				var error = this.createError(ErrorCodes.OBJECT_REQUIRED, {key: key}).prefixWith(null, "" + i).prefixWith(null, "required");
				if (this.handleError(error)) {
					return error;
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectProperties = function validateObjectProperties(data, schema, dataPointerPath) {
	var error;
	for (var key in data) {
		var keyPointerPath = dataPointerPath + "/" + key.replace(/~/g, '~0').replace(/\//g, '~1');
		var foundMatch = false;
		if (schema.properties !== undefined && schema.properties[key] !== undefined) {
			foundMatch = true;
			if (error = this.validateAll(data[key], schema.properties[key], [key], ["properties", key], keyPointerPath)) {
				return error;
			}
		}
		if (schema.patternProperties !== undefined) {
			for (var patternKey in schema.patternProperties) {
				var regexp = new RegExp(patternKey);
				if (regexp.test(key)) {
					foundMatch = true;
					if (error = this.validateAll(data[key], schema.patternProperties[patternKey], [key], ["patternProperties", patternKey], keyPointerPath)) {
						return error;
					}
				}
			}
		}
		if (!foundMatch) {
			if (schema.additionalProperties !== undefined) {
				if (this.trackUnknownProperties) {
					this.knownPropertyPaths[keyPointerPath] = true;
					delete this.unknownPropertyPaths[keyPointerPath];
				}
				if (typeof schema.additionalProperties === "boolean") {
					if (!schema.additionalProperties) {
						error = this.createError(ErrorCodes.OBJECT_ADDITIONAL_PROPERTIES, {}).prefixWith(key, "additionalProperties");
						if (this.handleError(error)) {
							return error;
						}
					}
				} else {
					if (error = this.validateAll(data[key], schema.additionalProperties, [key], ["additionalProperties"], keyPointerPath)) {
						return error;
					}
				}
			} else if (this.trackUnknownProperties && !this.knownPropertyPaths[keyPointerPath]) {
				this.unknownPropertyPaths[keyPointerPath] = true;
			}
		} else if (this.trackUnknownProperties) {
			this.knownPropertyPaths[keyPointerPath] = true;
			delete this.unknownPropertyPaths[keyPointerPath];
		}
	}
	return null;
};

ValidatorContext.prototype.validateObjectDependencies = function validateObjectDependencies(data, schema, dataPointerPath) {
	var error;
	if (schema.dependencies !== undefined) {
		for (var depKey in schema.dependencies) {
			if (data[depKey] !== undefined) {
				var dep = schema.dependencies[depKey];
				if (typeof dep === "string") {
					if (data[dep] === undefined) {
						error = this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY, {key: depKey, missing: dep}).prefixWith(null, depKey).prefixWith(null, "dependencies");
						if (this.handleError(error)) {
							return error;
						}
					}
				} else if (Array.isArray(dep)) {
					for (var i = 0; i < dep.length; i++) {
						var requiredKey = dep[i];
						if (data[requiredKey] === undefined) {
							error = this.createError(ErrorCodes.OBJECT_DEPENDENCY_KEY, {key: depKey, missing: requiredKey}).prefixWith(null, "" + i).prefixWith(null, depKey).prefixWith(null, "dependencies");
							if (this.handleError(error)) {
								return error;
							}
						}
					}
				} else {
					if (error = this.validateAll(data, dep, [], ["dependencies", depKey], dataPointerPath)) {
						return error;
					}
				}
			}
		}
	}
	return null;
};

ValidatorContext.prototype.validateCombinations = function validateCombinations(data, schema, dataPointerPath) {
	return this.validateAllOf(data, schema, dataPointerPath)
		|| this.validateAnyOf(data, schema, dataPointerPath)
		|| this.validateOneOf(data, schema, dataPointerPath)
		|| this.validateNot(data, schema, dataPointerPath)
		|| null;
};

ValidatorContext.prototype.validateAllOf = function validateAllOf(data, schema, dataPointerPath) {
	if (schema.allOf === undefined) {
		return null;
	}
	var error;
	for (var i = 0; i < schema.allOf.length; i++) {
		var subSchema = schema.allOf[i];
		if (error = this.validateAll(data, subSchema, [], ["allOf", i], dataPointerPath)) {
			return error;
		}
	}
	return null;
};

ValidatorContext.prototype.validateAnyOf = function validateAnyOf(data, schema, dataPointerPath) {
	if (schema.anyOf === undefined) {
		return null;
	}
	var errors = [];
	var startErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
	}
	var errorAtEnd = true;
	for (var i = 0; i < schema.anyOf.length; i++) {
		if (this.trackUnknownProperties) {
			this.unknownPropertyPaths = {};
			this.knownPropertyPaths = {};
		}
		var subSchema = schema.anyOf[i];

		var errorCount = this.errors.length;
		var error = this.validateAll(data, subSchema, [], ["anyOf", i], dataPointerPath);

		if (error === null && errorCount === this.errors.length) {
			this.errors = this.errors.slice(0, startErrorCount);

			if (this.trackUnknownProperties) {
				for (var knownKey in this.knownPropertyPaths) {
					oldKnownPropertyPaths[knownKey] = true;
					delete oldUnknownPropertyPaths[knownKey];
				}
				for (var unknownKey in this.unknownPropertyPaths) {
					if (!oldKnownPropertyPaths[unknownKey]) {
						oldUnknownPropertyPaths[unknownKey] = true;
					}
				}
				// We need to continue looping so we catch all the property definitions, but we don't want to return an error
				errorAtEnd = false;
				continue;
			}

			return null;
		}
		if (error) {
			errors.push(error.prefixWith(null, "" + i).prefixWith(null, "anyOf"));
		}
	}
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (errorAtEnd) {
		errors = errors.concat(this.errors.slice(startErrorCount));
		this.errors = this.errors.slice(0, startErrorCount);
		return this.createError(ErrorCodes.ANY_OF_MISSING, {}, "", "/anyOf", errors);
	}
};

ValidatorContext.prototype.validateOneOf = function validateOneOf(data, schema, dataPointerPath) {
	if (schema.oneOf === undefined) {
		return null;
	}
	var validIndex = null;
	var errors = [];
	var startErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
	}
	for (var i = 0; i < schema.oneOf.length; i++) {
		if (this.trackUnknownProperties) {
			this.unknownPropertyPaths = {};
			this.knownPropertyPaths = {};
		}
		var subSchema = schema.oneOf[i];

		var errorCount = this.errors.length;
		var error = this.validateAll(data, subSchema, [], ["oneOf", i], dataPointerPath);

		if (error === null && errorCount === this.errors.length) {
			if (validIndex === null) {
				validIndex = i;
			} else {
				this.errors = this.errors.slice(0, startErrorCount);
				return this.createError(ErrorCodes.ONE_OF_MULTIPLE, {index1: validIndex, index2: i}, "", "/oneOf");
			}
			if (this.trackUnknownProperties) {
				for (var knownKey in this.knownPropertyPaths) {
					oldKnownPropertyPaths[knownKey] = true;
					delete oldUnknownPropertyPaths[knownKey];
				}
				for (var unknownKey in this.unknownPropertyPaths) {
					if (!oldKnownPropertyPaths[unknownKey]) {
						oldUnknownPropertyPaths[unknownKey] = true;
					}
				}
			}
		} else if (error) {
			errors.push(error.prefixWith(null, "" + i).prefixWith(null, "oneOf"));
		}
	}
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (validIndex === null) {
		errors = errors.concat(this.errors.slice(startErrorCount));
		this.errors = this.errors.slice(0, startErrorCount);
		return this.createError(ErrorCodes.ONE_OF_MISSING, {}, "", "/oneOf", errors);
	} else {
		this.errors = this.errors.slice(0, startErrorCount);
	}
	return null;
};

ValidatorContext.prototype.validateNot = function validateNot(data, schema, dataPointerPath) {
	if (schema.not === undefined) {
		return null;
	}
	var oldErrorCount = this.errors.length;
	var oldUnknownPropertyPaths, oldKnownPropertyPaths;
	if (this.trackUnknownProperties) {
		oldUnknownPropertyPaths = this.unknownPropertyPaths;
		oldKnownPropertyPaths = this.knownPropertyPaths;
		this.unknownPropertyPaths = {};
		this.knownPropertyPaths = {};
	}
	var error = this.validateAll(data, schema.not, null, null, dataPointerPath);
	var notErrors = this.errors.slice(oldErrorCount);
	this.errors = this.errors.slice(0, oldErrorCount);
	if (this.trackUnknownProperties) {
		this.unknownPropertyPaths = oldUnknownPropertyPaths;
		this.knownPropertyPaths = oldKnownPropertyPaths;
	}
	if (error === null && notErrors.length === 0) {
		return this.createError(ErrorCodes.NOT_PASSED, {}, "", "/not");
	}
	return null;
};

// parseURI() and resolveUrl() are from https://gist.github.com/1088850
//   -  released as public domain by author ("Yaffle") - see comments on gist

function parseURI(url) {
	var m = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
	// authority = '//' + user + ':' + pass '@' + hostname + ':' port
	return (m ? {
		href     : m[0] || '',
		protocol : m[1] || '',
		authority: m[2] || '',
		host     : m[3] || '',
		hostname : m[4] || '',
		port     : m[5] || '',
		pathname : m[6] || '',
		search   : m[7] || '',
		hash     : m[8] || ''
	} : null);
}

function resolveUrl(base, href) {// RFC 3986

	function removeDotSegments(input) {
		var output = [];
		input.replace(/^(\.\.?(\/|$))+/, '')
			.replace(/\/(\.(\/|$))+/g, '/')
			.replace(/\/\.\.$/, '/../')
			.replace(/\/?[^\/]*/g, function (p) {
				if (p === '/..') {
					output.pop();
				} else {
					output.push(p);
				}
		});
		return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
	}

	href = parseURI(href || '');
	base = parseURI(base || '');

	return !href || !base ? null : (href.protocol || base.protocol) +
		(href.protocol || href.authority ? href.authority : base.authority) +
		removeDotSegments(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname)) +
		(href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) +
		href.hash;
}

function getDocumentUri(uri) {
	return uri.split('#')[0];
}
function normSchema(schema, baseUri) {
	if (schema && typeof schema === "object") {
		if (baseUri === undefined) {
			baseUri = schema.id;
		} else if (typeof schema.id === "string") {
			baseUri = resolveUrl(baseUri, schema.id);
			schema.id = baseUri;
		}
		if (Array.isArray(schema)) {
			for (var i = 0; i < schema.length; i++) {
				normSchema(schema[i], baseUri);
			}
		} else {
			if (typeof schema['$ref'] === "string") {
				schema['$ref'] = resolveUrl(baseUri, schema['$ref']);
			}
			for (var key in schema) {
				if (key !== "enum") {
					normSchema(schema[key], baseUri);
				}
			}
		}
	}
}

var ErrorCodes = {
	INVALID_TYPE: 0,
	ENUM_MISMATCH: 1,
	ANY_OF_MISSING: 10,
	ONE_OF_MISSING: 11,
	ONE_OF_MULTIPLE: 12,
	NOT_PASSED: 13,
	// Numeric errors
	NUMBER_MULTIPLE_OF: 100,
	NUMBER_MINIMUM: 101,
	NUMBER_MINIMUM_EXCLUSIVE: 102,
	NUMBER_MAXIMUM: 103,
	NUMBER_MAXIMUM_EXCLUSIVE: 104,
	// String errors
	STRING_LENGTH_SHORT: 200,
	STRING_LENGTH_LONG: 201,
	STRING_PATTERN: 202,
	// Object errors
	OBJECT_PROPERTIES_MINIMUM: 300,
	OBJECT_PROPERTIES_MAXIMUM: 301,
	OBJECT_REQUIRED: 302,
	OBJECT_ADDITIONAL_PROPERTIES: 303,
	OBJECT_DEPENDENCY_KEY: 304,
	// Array errors
	ARRAY_LENGTH_SHORT: 400,
	ARRAY_LENGTH_LONG: 401,
	ARRAY_UNIQUE: 402,
	ARRAY_ADDITIONAL_ITEMS: 403,
	// Custom/user-defined errors
	FORMAT_CUSTOM: 500,
	KEYWORD_CUSTOM: 501,
	// Schema structure
	CIRCULAR_REFERENCE: 600,
	// Non-standard validation options
	UNKNOWN_PROPERTY: 1000
};
var ErrorCodeLookup = {};
for (var key in ErrorCodes) {
	ErrorCodeLookup[ErrorCodes[key]] = key;
}
var ErrorMessagesDefault = {
	INVALID_TYPE: "invalid type: {type} (expected {expected})",
	ENUM_MISMATCH: "No enum match for: {value}",
	ANY_OF_MISSING: "Data does not match any schemas from \"anyOf\"",
	ONE_OF_MISSING: "Data does not match any schemas from \"oneOf\"",
	ONE_OF_MULTIPLE: "Data is valid against more than one schema from \"oneOf\": indices {index1} and {index2}",
	NOT_PASSED: "Data matches schema from \"not\"",
	// Numeric errors
	NUMBER_MULTIPLE_OF: "Value {value} is not a multiple of {multipleOf}",
	NUMBER_MINIMUM: "Value {value} is less than minimum {minimum}",
	NUMBER_MINIMUM_EXCLUSIVE: "Value {value} is equal to exclusive minimum {minimum}",
	NUMBER_MAXIMUM: "Value {value} is greater than maximum {maximum}",
	NUMBER_MAXIMUM_EXCLUSIVE: "Value {value} is equal to exclusive maximum {maximum}",
	// String errors
	STRING_LENGTH_SHORT: "String is too short ({length} chars), minimum {minimum}",
	STRING_LENGTH_LONG: "String is too long ({length} chars), maximum {maximum}",
	STRING_PATTERN: "String does not match pattern: {pattern}",
	// Object errors
	OBJECT_PROPERTIES_MINIMUM: "Too few properties defined ({propertyCount}), minimum {minimum}",
	OBJECT_PROPERTIES_MAXIMUM: "Too many properties defined ({propertyCount}), maximum {maximum}",
	OBJECT_REQUIRED: "Missing required property: {key}",
	OBJECT_ADDITIONAL_PROPERTIES: "Additional properties not allowed",
	OBJECT_DEPENDENCY_KEY: "Dependency failed - key must exist: {missing} (due to key: {key})",
	// Array errors
	ARRAY_LENGTH_SHORT: "Array is too short ({length}), minimum {minimum}",
	ARRAY_LENGTH_LONG: "Array is too long ({length}), maximum {maximum}",
	ARRAY_UNIQUE: "Array items are not unique (indices {match1} and {match2})",
	ARRAY_ADDITIONAL_ITEMS: "Additional items not allowed",
	// Format errors
	FORMAT_CUSTOM: "Format validation failed ({message})",
	KEYWORD_CUSTOM: "Keyword failed: {key} ({message})",
	// Schema structure
	CIRCULAR_REFERENCE: "Circular $refs: {urls}",
	// Non-standard validation options
	UNKNOWN_PROPERTY: "Unknown property (not in schema)"
};

function ValidationError(code, message, dataPath, schemaPath, subErrors) {
	Error.call(this);
	if (code === undefined) {
		throw new Error ("No code supplied for error: "+ message);
	}
	this.message = message;
	this.code = code;
	this.dataPath = dataPath || "";
	this.schemaPath = schemaPath || "";
	this.subErrors = subErrors || null;

	var err = new Error(this.message);
	this.stack = err.stack || err.stacktrace;
	if (!this.stack) {
		try {
			throw err;
		}
		catch(err) {
			this.stack = err.stack || err.stacktrace;
		}
	}
}
ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.constructor = ValidationError;
ValidationError.prototype.name = 'ValidationError';

ValidationError.prototype.prefixWith = function (dataPrefix, schemaPrefix) {
	if (dataPrefix !== null) {
		dataPrefix = dataPrefix.replace(/~/g, "~0").replace(/\//g, "~1");
		this.dataPath = "/" + dataPrefix + this.dataPath;
	}
	if (schemaPrefix !== null) {
		schemaPrefix = schemaPrefix.replace(/~/g, "~0").replace(/\//g, "~1");
		this.schemaPath = "/" + schemaPrefix + this.schemaPath;
	}
	if (this.subErrors !== null) {
		for (var i = 0; i < this.subErrors.length; i++) {
			this.subErrors[i].prefixWith(dataPrefix, schemaPrefix);
		}
	}
	return this;
};

function isTrustedUrl(baseUrl, testUrl) {
	if(testUrl.substring(0, baseUrl.length) === baseUrl){
		var remainder = testUrl.substring(baseUrl.length);
		if ((testUrl.length > 0 && testUrl.charAt(baseUrl.length - 1) === "/")
			|| remainder.charAt(0) === "#"
			|| remainder.charAt(0) === "?") {
			return true;
		}
	}
	return false;
}

var languages = {};
function createApi(language) {
	var globalContext = new ValidatorContext();
	var currentLanguage = language || 'en';
	var api = {
		addFormat: function () {
			globalContext.addFormat.apply(globalContext, arguments);
		},
		language: function (code) {
			if (!code) {
				return currentLanguage;
			}
			if (!languages[code]) {
				code = code.split('-')[0]; // fall back to base language
			}
			if (languages[code]) {
				currentLanguage = code;
				return code; // so you can tell if fall-back has happened
			}
			return false;
		},
		addLanguage: function (code, messageMap) {
			var key;
			for (key in ErrorCodes) {
				if (messageMap[key] && !messageMap[ErrorCodes[key]]) {
					messageMap[ErrorCodes[key]] = messageMap[key];
				}
			}
			var rootCode = code.split('-')[0];
			if (!languages[rootCode]) { // use for base language if not yet defined
				languages[code] = messageMap;
				languages[rootCode] = messageMap;
			} else {
				languages[code] = Object.create(languages[rootCode]);
				for (key in messageMap) {
					if (typeof languages[rootCode][key] === 'undefined') {
						languages[rootCode][key] = messageMap[key];
					}
					languages[code][key] = messageMap[key];
				}
			}
			return this;
		},
		freshApi: function (language) {
			var result = createApi();
			if (language) {
				result.language(language);
			}
			return result;
		},
		validate: function (data, schema, checkRecursive, banUnknownProperties) {
			var context = new ValidatorContext(globalContext, false, languages[currentLanguage], checkRecursive, banUnknownProperties);
			if (typeof schema === "string") {
				schema = {"$ref": schema};
			}
			context.addSchema("", schema);
			var error = context.validateAll(data, schema, null, null, "");
			if (!error && banUnknownProperties) {
				error = context.banUnknownProperties();
			}
			this.error = error;
			this.missing = context.missing;
			this.valid = (error === null);
			return this.valid;
		},
		validateResult: function () {
			var result = {};
			this.validate.apply(result, arguments);
			return result;
		},
		validateMultiple: function (data, schema, checkRecursive, banUnknownProperties) {
			var context = new ValidatorContext(globalContext, true, languages[currentLanguage], checkRecursive, banUnknownProperties);
			if (typeof schema === "string") {
				schema = {"$ref": schema};
			}
			context.addSchema("", schema);
			context.validateAll(data, schema, null, null, "");
			if (banUnknownProperties) {
				context.banUnknownProperties();
			}
			var result = {};
			result.errors = context.errors;
			result.missing = context.missing;
			result.valid = (result.errors.length === 0);
			return result;
		},
		addSchema: function () {
			return globalContext.addSchema.apply(globalContext, arguments);
		},
		getSchema: function () {
			return globalContext.getSchema.apply(globalContext, arguments);
		},
		getSchemaMap: function () {
			return globalContext.getSchemaMap.apply(globalContext, arguments);
		},
		getSchemaUris: function () {
			return globalContext.getSchemaUris.apply(globalContext, arguments);
		},
		getMissingUris: function () {
			return globalContext.getMissingUris.apply(globalContext, arguments);
		},
		dropSchemas: function () {
			globalContext.dropSchemas.apply(globalContext, arguments);
		},
		defineKeyword: function () {
			globalContext.defineKeyword.apply(globalContext, arguments);
		},
		defineError: function (codeName, codeNumber, defaultMessage) {
			if (typeof codeName !== 'string' || !/^[A-Z]+(_[A-Z]+)*$/.test(codeName)) {
				throw new Error('Code name must be a string in UPPER_CASE_WITH_UNDERSCORES');
			}
			if (typeof codeNumber !== 'number' || codeNumber%1 !== 0 || codeNumber < 10000) {
				throw new Error('Code number must be an integer > 10000');
			}
			if (typeof ErrorCodes[codeName] !== 'undefined') {
				throw new Error('Error already defined: ' + codeName + ' as ' + ErrorCodes[codeName]);
			}
			if (typeof ErrorCodeLookup[codeNumber] !== 'undefined') {
				throw new Error('Error code already used: ' + ErrorCodeLookup[codeNumber] + ' as ' + codeNumber);
			}
			ErrorCodes[codeName] = codeNumber;
			ErrorCodeLookup[codeNumber] = codeName;
			ErrorMessagesDefault[codeName] = ErrorMessagesDefault[codeNumber] = defaultMessage;
			for (var langCode in languages) {
				var language = languages[langCode];
				if (language[codeName]) {
					language[codeNumber] = language[codeNumber] || language[codeName];
				}
			}
		},
		reset: function () {
			globalContext.reset();
			this.error = null;
			this.missing = [];
			this.valid = true;
		},
		missing: [],
		error: null,
		valid: true,
		normSchema: normSchema,
		resolveUrl: resolveUrl,
		getDocumentUri: getDocumentUri,
		errorCodes: ErrorCodes
	};
	return api;
}

var tv4 = createApi();
tv4.addLanguage('en-gb', ErrorMessagesDefault);

//legacy property
tv4.tv4 = tv4;

return tv4; // used by _header.js to globalise.

}));
/**
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
*/

LazyLoad = (function (doc) {
  // -- Private Variables ------------------------------------------------------

  // User agent and feature test information.
  var env,

  // Reference to the <head> element (populated lazily).
  head,

  // Requests currently in progress, if any.
  pending = {},

  // Number of times we've polled to check whether a pending stylesheet has
  // finished loading. If this gets too high, we're probably stalled.
  pollCount = 0,

  // Queued requests.
  queue = {css: [], js: []},

  // Reference to the browser's list of stylesheets.
  styleSheets = doc.styleSheets;

  // -- Private Methods --------------------------------------------------------

  /**
  Creates and returns an HTML element with the specified name and attributes.

  @method createNode
  @param {String} name element name
  @param {Object} attrs name/value mapping of element attributes
  @return {HTMLElement}
  @private
  */
  function createNode(name, attrs) {
    var node = doc.createElement(name), attr;

    for (attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        node.setAttribute(attr, attrs[attr]);
      }
    }

    return node;
  }

  /**
  Called when the current pending resource of the specified type has finished
  loading. Executes the associated callback (if any) and loads the next
  resource in the queue.

  @method finish
  @param {String} type resource type ('css' or 'js')
  @private
  */
  function finish(type) {
    var p = pending[type],
        callback,
        urls;

    if (p) {
      callback = p.callback;
      urls     = p.urls;

      urls.shift();
      pollCount = 0;

      // If this is the last of the pending URLs, execute the callback and
      // start the next request in the queue (if any).
      if (!urls.length) {
        callback && callback.call(p.context, p.obj);
        pending[type] = null;
        queue[type].length && load(type);
      }
    }
  }

  /**
  Populates the <code>env</code> variable with user agent and feature test
  information.

  @method getEnv
  @private
  */
  function getEnv() {
    var ua = navigator.userAgent;

    env = {
      // True if this browser supports disabling async mode on dynamically
      // created script nodes. See
      // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
      async: doc.createElement('script').async === true
    };

    (env.webkit = /AppleWebKit\//.test(ua))
      || (env.ie = /MSIE|Trident/.test(ua))
      || (env.opera = /Opera/.test(ua))
      || (env.gecko = /Gecko\//.test(ua))
      || (env.unknown = true);
  }

  /**
  Loads the specified resources, or the next resource of the specified type
  in the queue if no resources are specified. If a resource of the specified
  type is already being loaded, the new request will be queued until the
  first request has been finished.

  When an array of resource URLs is specified, those URLs will be loaded in
  parallel if it is possible to do so while preserving execution order. All
  browsers support parallel loading of CSS, but only Firefox and Opera
  support parallel loading of scripts. In other browsers, scripts will be
  queued and loaded one at a time to ensure correct execution order.

  @method load
  @param {String} type resource type ('css' or 'js')
  @param {String|Array} urls (optional) URL or array of URLs to load
  @param {Function} callback (optional) callback function to execute when the
    resource is loaded
  @param {Object} obj (optional) object to pass to the callback function
  @param {Object} context (optional) if provided, the callback function will
    be executed in this object's context
  @private
  */
  function load(type, urls, callback, obj, context) {
    var _finish = function () { finish(type); },
        isCSS   = type === 'css',
        nodes   = [],
        i, len, node, p, pendingUrls, url;

    env || getEnv();

    if (urls) {
      // If urls is a string, wrap it in an array. Otherwise assume it's an
      // array and create a copy of it so modifications won't be made to the
      // original.
      urls = typeof urls === 'string' ? [urls] : urls.concat();

      // Create a request object for each URL. If multiple URLs are specified,
      // the callback will only be executed after all URLs have been loaded.
      //
      // Sadly, Firefox and Opera are the only browsers capable of loading
      // scripts in parallel while preserving execution order. In all other
      // browsers, scripts must be loaded sequentially.
      //
      // All browsers respect CSS specificity based on the order of the link
      // elements in the DOM, regardless of the order in which the stylesheets
      // are actually downloaded.
      if (isCSS || env.async || env.gecko || env.opera) {
        // Load in parallel.
        queue[type].push({
          urls    : urls,
          callback: callback,
          obj     : obj,
          context : context
        });
      } else {
        // Load sequentially.
        for (i = 0, len = urls.length; i < len; ++i) {
          queue[type].push({
            urls    : [urls[i]],
            callback: i === len - 1 ? callback : null, // callback is only added to the last URL
            obj     : obj,
            context : context
          });
        }
      }
    }

    // If a previous load request of this type is currently in progress, we'll
    // wait our turn. Otherwise, grab the next item in the queue.
    if (pending[type] || !(p = pending[type] = queue[type].shift())) {
      return;
    }

    head || (head = doc.head || doc.getElementsByTagName('head')[0]);
    pendingUrls = p.urls.concat();

    for (i = 0, len = pendingUrls.length; i < len; ++i) {
      url = pendingUrls[i];

      if (isCSS) {
          node = env.gecko ? createNode('style') : createNode('link', {
            href: url,
            rel : 'stylesheet'
          });
      } else {
        node = createNode('script', {src: url});
        node.async = false;
      }

      node.className = 'lazyload';
      node.setAttribute('charset', 'utf-8');

      if (env.ie && !isCSS && 'onreadystatechange' in node && !('draggable' in node)) {
        node.onreadystatechange = function () {
          if (/loaded|complete/.test(node.readyState)) {
            node.onreadystatechange = null;
            _finish();
          }
        };
      } else if (isCSS && (env.gecko || env.webkit)) {
        // Gecko and WebKit don't support the onload event on link nodes.
        if (env.webkit) {
          // In WebKit, we can poll for changes to document.styleSheets to
          // figure out when stylesheets have loaded.
          p.urls[i] = node.href; // resolve relative URLs (or polling won't work)
          pollWebKit();
        } else {
          // In Gecko, we can import the requested URL into a <style> node and
          // poll for the existence of node.sheet.cssRules. Props to Zach
          // Leatherman for calling my attention to this technique.
          node.innerHTML = '@import "' + url + '";';
          pollGecko(node);
        }
      } else {
        node.onload = node.onerror = _finish;
      }

      nodes.push(node);
    }

    for (i = 0, len = nodes.length; i < len; ++i) {
      head.appendChild(nodes[i]);
    }
  }

  /**
  Begins polling to determine when the specified stylesheet has finished loading
  in Gecko. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  Thanks to Zach Leatherman for calling my attention to the @import-based
  cross-domain technique used here, and to Oleg Slobodskoi for an earlier
  same-domain implementation. See Zach's blog for more details:
  http://www.zachleat.com/web/2010/07/29/load-css-dynamically/

  @method pollGecko
  @param {HTMLElement} node Style node to poll.
  @private
  */
  function pollGecko(node) {
    var hasRules;

    try {
      // We don't really need to store this value or ever refer to it again, but
      // if we don't store it, Closure Compiler assumes the code is useless and
      // removes it.
      hasRules = !!node.sheet.cssRules;
    } catch (ex) {
      // An exception means the stylesheet is still loading.
      pollCount += 1;

      if (pollCount < 200) {
        setTimeout(function () { pollGecko(node); }, 50);
      } else {
        // We've been polling for 10 seconds and nothing's happened. Stop
        // polling and finish the pending requests to avoid blocking further
        // requests.
        hasRules && finish('css');
      }

      return;
    }

    // If we get here, the stylesheet has loaded.
    finish('css');
  }

  /**
  Begins polling to determine when pending stylesheets have finished loading
  in WebKit. Polling stops when all pending stylesheets have loaded or after 10
  seconds (to prevent stalls).

  @method pollWebKit
  @private
  */
  function pollWebKit() {
    var css = pending.css, i;

    if (css) {
      i = styleSheets.length;

      // Look for a stylesheet matching the pending URL.
      while (--i >= 0) {
        if (styleSheets[i].href === css.urls[0]) {
          finish('css');
          break;
        }
      }

      pollCount += 1;

      if (css) {
        if (pollCount < 200) {
          setTimeout(pollWebKit, 50);
        } else {
          // We've been polling for 10 seconds and nothing's happened, which may
          // indicate that the stylesheet has been removed from the document
          // before it had a chance to load. Stop polling and finish the pending
          // request to prevent blocking further requests.
          finish('css');
        }
      }
    }
  }

  return {

    /**
    Requests the specified CSS URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified, the stylesheets will be loaded in parallel and the callback
    will be executed after all stylesheets have finished loading.

    @method css
    @param {String|Array} urls CSS URL or array of CSS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified stylesheets are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    css: function (urls, callback, obj, context) {
      load('css', urls, callback, obj, context);
    },

    /**
    Requests the specified JavaScript URL or URLs and executes the specified
    callback (if any) when they have finished loading. If an array of URLs is
    specified and the browser supports it, the scripts will be loaded in
    parallel and the callback will be executed after all scripts have
    finished loading.

    Currently, only Firefox and Opera support parallel loading of scripts while
    preserving execution order. In other browsers, scripts will be
    queued and loaded one at a time to ensure correct execution order.

    @method js
    @param {String|Array} urls JS URL or array of JS URLs to load
    @param {Function} callback (optional) callback function to execute when
      the specified scripts are loaded
    @param {Object} obj (optional) object to pass to the callback function
    @param {Object} context (optional) if provided, the callback function
      will be executed in this object's context
    @static
    */
    js: function (urls, callback, obj, context) {
      load('js', urls, callback, obj, context);
    }

  };
})(this.document);

/* jshint -W079 */ /* Ignores Redefinition of plastic */

/**
 * plastic.js Namespace
 *
 * @namespace
 */
var plastic = {

    /**
     * Version Number
     * @type String
     */
    version: '0.1.0',

    /**
     * Array which holds all the plastic.js Elements
     *
     * @type Array
     */
    elements: [],

    /**
     * Module Namespace
     *
     * This includes module and depencency handling and of course all available modules
     *
     *
     * @namespace
     */
    modules: {

        /**
         * Query Parser Modules Namespace
         * @namespace
         * @ignore
         */
        query: {},

        /**
         * API Parser Modules Namespace
         * @namespace
         * @ignore
         */
        api: {},

        /**
         * Data Parser Modules Namespace
         * @namespace
         * @ignore
         */
        data: {},

        /**
         * Display Modules Namespace
         * @namespace
         * @ignore
         */
        display: {}

    },

    /**
     * Namespace for helper functions
     * @namespace
     * @ignore
     */
    helper: {},


    errors: []

};

/**
 * Executes plastic.js
 *
 * This is done automatically on the DOM Ready Event
 */
plastic.execute = function() {
    "use strict";

    if (this.options.debug) {
        plastic.msg.log('[MAIN] plastic.js version v' + plastic.version + ' INIT');
    }


    /**
     * Global plastic events
     *
     * PubSub Pattern
     *
     * @type {plastic.helper.Events}
     */
    plastic.events = new plastic.helper.Events();

    // Get all <plastic> elements on the page and store them as jQuery DOM Objects
    var $plasticElements = $('plastic, .plastic-js');


    // Create new plastic Elements
    $plasticElements.each(function() {

        var $el = $(this);

        // If Debug Mode is activated: Do not use Exception handling (let it crash)
        if (plastic.options.debug) {
            plastic.elements.push(new plastic.Element($el));
        } else {

            if (!plastic.options.debug) {
                plastic.elements.push(new plastic.Element($el));
            } else {
                try {
                    plastic.elements.push(new plastic.Element($el));
                } catch(e) {
                    e.message += ' | plastic element crashed while init (creation)';
                    plastic.msg.error(e, 'error', $el);
                }
            }

        }

    });

    // Fetch all registered Dependencies
    plastic.modules.dependencyManager.fetch();

    // Execute all created plastic Elements
    $.each(plastic.elements, function(i, $el ) {

        if ($el.options.debug) {
            $el.execute();
        } else {
            try {
                $el.execute();
            } catch(e) {
                e.message += ' | plastic element crashed while init (execution)';
                plastic.msg.error(e, 'error', $el);
            }
        }

    });

};

// Execute plastic.js on DOM Ready
$(document).ready(function() {
    plastic.execute();
});

plastic.options = {

    /**
     * Debug Mode
     *
     * This enables logging of some informations to the console
     * This also ignores Exception handiling. If an error occurs it will crash hard and precice.
     *
     * @type {boolean}
     */
    debug: false,

    /**
     * If true, plastic.js will keep a log object
     * It is stored in plastic.msg._logs and can be JSON Dumped via plastic.msg.dumpLog();
     *
     * @type {boolean}
     */
    log: true,

    /**
     * Logs Benchmark Infos to the console
     *
     * @type {boolean}
     */
    benchmark: false,

    /**
     * Width of Canvas, if not given
     * @type {string}
     */
    width: '100%',

    /**
     * Height of Canvas, if not given
     * @type {string}
     */
    height: 'auto',

    /**
     * Default AJAX Timeout (in ms)
     * @type {number}
     */
    timeout: 12000,

    /**
     * If true, an additional info box is shown below the plastic element
     * This displays additional infos like execution time
     * @type {boolean}
     */
    showInfoBox: false
};

plastic.Element = function($el) {

    // Create a Message container
    this.createMessageContainer($el);

    /**
     * Current plastic Element (pEl)
     *
     * @type {plastic.Element}
     */
    var self = this;

    //////////////////////////////////////////
    // Element Attributes                   //
    //////////////////////////////////////////

    /**
     * This plastic elements jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = $el;

    /**
     * HTML ID if available, otherwise auto generated ID
     * @type {String}
     */
    this.id = undefined;

    // Get / Calculate ID
    if ($el && $el[0] && $el[0].id) {
        this.id = $el[0].id;
    } else {
        this.id = 'plastic-el-' + plastic.elements.length + 1;
        $el[0].id = this.id;
    }

    /**
     * Inherited (and overwritten) general element options
     *
     * @type {Object|plastic.options}
     */
    this.options = plastic.options;

    if (this.options.debug) {
        plastic.msg.log('[#' + this.id + '] new plastic.Element()');
    }

    /**
     * Element specific Event PubSub
     */
    this.events = new plastic.helper.Events();

    /**
     * Total Number of asynchronous Events to wait for
     *
     * @type {number}
     */
    this.eventsTotal = 1;

    /**
     * Current Number of asynchronous Events that already happened
     *
     * If this equals this.eventsTotal, the Element can be
     * @type {number}
     */
    this.eventsProgress = 0;

    /**
     * Benchmark Time Start (ms timestamp)
     * @type {number}
     */
    this.benchmarkStart = (new Date()).getTime();

    /**
     * Benchmark Time Data loaded (ms timestamp)
     * @type {number}
     */
    this.benchmarkDataLoaded = 0;

    /**
     * Benchmark Time Modules loaded (Array of ms timestamp)
     * @type {Array}
     */
    this.benchmarkModulesLoaded = [];

    /**
     * Benchmark Time Completed (ms timestamp)
     * @type {number}
     */
    this.benchmarkCompleted = 0;

    /**
     * Module Dependencies
     * Those are
     * @type {Array}
     */
    this.dependencies = [];

    /**
     * plastic.js ElementAttibutes Object (Instance)
     *
     * @type {plastic.ElementAttributes}
     */
    this.attr = new plastic.ElementAttributes(this);

    /**
     * Element Query Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.queryModule = false;

    /**
     * Element Data Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.dataModule = false;

    /**
     * Element Display Module Instance
     *
     * @type {plastic.element.Element|boolean}
     */
    this.displayModule = false;


    //////////////////////////////////////////
    // Element Bootstrap                    //
    //////////////////////////////////////////

    // Merge general options from ElementsAttributes
    this.mergeOptions();

    // Register all necessary dependencies
    this.registerDependencies();


    //////////////////////////////////////////
    // REGISTER EVENTS LSITENERS            //
    //////////////////////////////////////////

    /** Helper Function: On dependency load */
    var depLoaded = function() {
        "use strict";
        self.benchmarkModulesLoaded.push((new Date()).getTime());
        this.updateProgress();
    };

    for (var i = 0; i < this.dependencies.length; i++) {
        this.eventsTotal += 1;
        plastic.events.sub('loaded-' + this.dependencies[i], self, depLoaded);
    }


};

//////////////////////////////////////////
// Element Methods                      //
//////////////////////////////////////////

plastic.Element.prototype = {

    /**
     * Executes the processing of the plastic.element
     */
    execute: function() {

        /** Asynchronous Mode */
        var self = this;

        this.createDisplayContainer(this.$el);

        if (plastic.options.showInfoBox) {
            this.createInfoContainer(this.$el);
        }


        //////////////////////////////////////////
        // CALLING QUERY MODULE                 //
        //////////////////////////////////////////

        if (this.attr.query) { // OPTIONAL
            this.queryModule = new plastic.modules.Module(this, 'query', this.attr.query.module);
        }


        //////////////////////////////////////////
        // GETTING DATA VIA URL                 //
        //////////////////////////////////////////

        if (this.attr.data && this.attr.data.url) {

            var dataType = 'json';

            if (this.options.debug) {
                plastic.msg.log('[#' + this.id + '] Data-URL: ' + this.attr.data.url);
            }

            // TODO: Catch Timeout Error

            // If data is in text format, load it via $.get
            if (this.attr.data.module === ('csv' || 'tsv')) {

                try {
                    $.get(this.attr.data.url, function(data){

                        self.attr.data.raw = new String(data);

                        self.benchmarkDataLoaded = (new Date()).getTime();
                        self.attr.raw = data;
                        self.updateProgress();

                        self.events.pub('data-sucess');

                    });


                } catch(e) {
                    plastic.msg.error(e, self.$el);
                    throw new Error('Data Request failed');
                }



            // Assume file is in JSON format and load it via $.ajax
            } else {

                /** jQuery AJAX Request Object */
                try {
                    $.ajax({
                        url: this.attr.data.url,
                        dataType: 'json',
                        timeout: this.options.timeout,
                        success: function(data) {
                            "use strict";

                            if (data !== null && typeof data === 'object') {
                                self.attr.data.raw = data;
                            } else {
                                self.attr.data.raw = $.parseJSON(data);
                            }

                            self.benchmarkDataLoaded = (new Date()).getTime();
                            self.attr.raw = data;
                            self.updateProgress();

                            self.events.pub('data-sucess');
                        },
                        error: function() {
                            plastic.msg.error('Could not get Data from URL <a href="' + self.attr.data.url + '">' + self.attr.data.url + '</a>', "error", self.$el );
                            self.cancelProgress();
                        }
                    });
                } catch(e) {
                    plastic.msg.error(e, self.$el);
                    throw new Error('Data Request failed');
                }
            }



        } else {
            // Data is already there, continue:
            self.updateProgress();
        }

    },

    /**
     * Creates a new Attributes Object which parses and stores all Attributes of the plastic.js element
     */
    updateAttributes: function() {
        "use strict";
        this.attributes = new plastic.ElementAttributes(this.$el);
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Message Container
     * @todo $el.find unnecessary?
     */
    createMessageContainer: function($el) {
        "use strict";

        $el.append('<div class="plastic-js-messages"></div>');
        var msgEl = $el.find('.plastic-js-messages');
        msgEl.width($el.innerWidth());
    },

    /**
     * Helper Functin which creates a HTML Element for use as a Display Container
     * @todo $el.find unnecessary?
     */
    createDisplayContainer: function($el) {
        "use strict";

        $el.append('<div class="plastic-js-display"></div>');
        var displayEl = $el.find('.plastic-js-display');

        if ($el.height() > 0) {
            displayEl.height($el.height());
        } else {
            displayEl.height('auto');
        }

        displayEl.html('<div class="loading"></div><div class="spinner"></div></div>');

    },

    /**
     * Helper Functin which creates a HTML Element for use as InfoBox
     */
    createInfoContainer: function($el) {
        "use strict";
        $el.append('<div class="plastic-js-info"></div>');
        $el.css('margin-bottom', '42px'); // TODO: Make this dynamic
    },

    /**
     * Updates the Progress of asynchronal events
     */
    updateProgress: function() {
        "use strict";

        this.eventsProgress += 1;

        if (this.options.debug) {
            plastic.msg.log('[#' + this.id + '] Current Progress: ' + this.eventsProgress + '/' + this.eventsTotal);
        }

        // If all events are run (dependencies loaded): continue with processing of the element
        if (this.eventsProgress === this.eventsTotal) {
            this.completeProgress();
        }
    },

    /**
     * Cancels the processing of the element and displays the info to the user
     */
    cancelProgress: function() {
        "use strict";
        plastic.msg.error('plastic.js processing aborted.', this.$el);
        // Clear all Element Events
        this.events = new plastic.helper.Events();
    },

    /**
     * This executes all remaining actions after all events are completed
     */
    completeProgress: function() {
        "use strict";

        // Instanciate new Data Module
        this.dataModule = new plastic.modules.Module(this, 'data', this.attr.data.module);

        if (!this.attr.data.description) {
            this.attr.data.description = plastic.helper.duckTyping(this.attr.data.processed);
        }

        // Apply Data Description if available
        this.applySchema();

        // Instanciate new Display Module (renders the output)
        this.displayModule = new plastic.modules.Module(this, 'display', this.attr.display.module);

        this.benchmarkCompleted = (new Date()).getTime();

        if (this.options.benchmark) {
            this.displayBenchmark();
        }

        if (this.options.showInfoBox) {
            this.displayInfoBox();
        }
    },

    /**
     * Looks for all external dependencies that are required by the currently used modules
     *
     * Registers all Dependencys for Lazyloading
     * @todo Use a Set Datastructure?
     */
    registerDependencies: function() {
        "use strict";

        var displayModuleInfo = plastic.modules.moduleManager.get('display', this.attr.display.module);

        if (displayModuleInfo) {
            if (displayModuleInfo.dependencies) {
                plastic.modules.dependencyManager.add(displayModuleInfo.dependencies);
            } else {
                plastic.msg.warn('No Dependencies set!', this.$el);
            }

        } else {
            plastic.msg.error('Display Module not found!', this.$el);
        }

        if (this.attr.data && this.attr.data.module) {
            var dataModuleInfo = plastic.modules.moduleManager.get('data', this.attr.data.module);
            plastic.modules.dependencyManager.add(dataModuleInfo.dependencies);
        }

        this.dependencies = (this.dependencies.concat(displayModuleInfo.dependencies));
    },

    /**
     * Merges the current plastic element options with the general options.
     * Local settings overwrite global settings
     * Makes a deep copy
     */
    mergeOptions: function() {
        "use strict";
        this.options = $.extend(true, {}, plastic.options, this.attr.options);
    },

    /**
     * Dumps benchmark data to the console
     */
    displayBenchmark: function() {
        "use strict";

        var dataLoadedDiff = this.benchmarkDataLoaded - this.benchmarkStart;
        var totalDiff = this.benchmarkCompleted - this.benchmarkStart;

        var msg = '[#' + this.id + '] BENCHMARK:';

        msg += (' DATA: ' + dataLoadedDiff + 'ms');

        for (var i = 0; i < this.benchmarkModulesLoaded.length; i++) {
            var moduleTime = this.benchmarkModulesLoaded[i];
            var moduleDiff = moduleTime - this.benchmarkStart;
            msg += ' | DEPENDENCY ' + (i + 1) + ': ' + moduleDiff + 'ms';
        }

        msg += ' | TOTAL: ' + totalDiff + 'ms';
        plastic.msg.log(msg);
    },

    /**
     * Fills the Infobox with informations about the current plastic element, for example loading time.
     */
    displayInfoBox: function() {
        "use strict";
        var infoBox = this.$el.find('.plastic-js-info');
        var html = 'Data : ' + (this.benchmarkDataLoaded - this.benchmarkStart) + 'ms | ';
        html += 'Total: ' + (this.benchmarkCompleted - this.benchmarkStart) + 'ms';
        infoBox.html(html);
    },

    /**
     * Applies Data Description to generate "annotated / enriched" processed data
     */
    applySchema: function() {
        "use strict";

        var self = this;
        var processedData = this.attr.data.processed;
        var dataDescription = this.attr.data.description;

        var applyHtml = function() {

            /**
             * Maps DataTypes (Formats) to a converter function, which returns the HTML reprentation of the type
             * @todo Create more Formats
             * @todo Create Phone Number
             *
             * @type {{}}
             */
            var htmlMapper = {
                "email": function(val) {
                    var strippedVal = val.replace('mailto:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "phone": function(val) {
                    var strippedVal = val.replace('tel:', '');
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                },
                "uri": function(val) {
                    // Strips http:// or ftp:// etc.
                    var strippedVal = val.replace(/\w*:\/{2}/g, ''); //
                    return '<a href="' + val + '">' + strippedVal + '</a>';
                }
            };

            var processedHtml = $.extend(true, [], processedData); // Deep Copy

            for (var i = 0; i < processedHtml.length; i++) {

                var row = processedHtml[i];

                for (var cellType in row) {

                    var cellValue = row[cellType];

                    if (dataDescription[cellType] && dataDescription[cellType].format) {
                        var format = dataDescription[cellType].format;

                        for (var j = 0; j < cellValue.length; j++) {

                            if (format && htmlMapper[format]) {
                                cellValue[j] = htmlMapper[format](cellValue[j]);
                            }
                        }
                    }

                }

            }

            self.attr.data.processedHtml = processedHtml;
        };

        if (dataDescription && Object.keys(dataDescription).length > 0) {
            applyHtml();
        }

    }

};

plastic.ElementAttributes = function(pEl) {


    /**
     * plastic.js Element
     *
     * @type {{}}
     */
    this.pEl = pEl;

    /**
     * plastic.js jQuery DOM Element
     *
     * @type {{}}
     */
    this.$el = pEl.$el;

    /**
     * Element Style Attributes
     * @type {Object|boolean}
     */
    this.style = false;

    /**
     * Element Options Attributes
     * @type {Object|boolean}
     */
    this.options = {};

    /**
     * Element Query Attributes
     * @type {Object|boolean}
     */
    this.query = false;

    /**
     * Element Display Attributes
     * @type {Object|boolean}
     */
    this.display = {};

    /**
     * Element Data Attributes
     * @type {Object|boolean}
     */
    this.data = false;

    // Parse all Attributes of the current plastic.element
    this.parse();

    // Validate the final Attributes Object
    this.validate();

};

plastic.ElementAttributes.prototype = {

    /**
     * JSON Schema for validation
     *
     * @link http://json-schema.org/|JSON-Schema Site
     * @type {{}}
     */
    attrObjSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "style": {
                "type": "object",
                "properties": {
                    "width": {
                        "type": "number"
                    },
                    "height": {
                        "type": "number"
                    }
                }
            },
            "options": {
                "type": "object"
            },
            "display": {
                "type": "object",
                "properties": {
                    "module": {"type": "string"},
                    "options": {"type": "object"}
                },
                required: ["module", "options"]
            },
            "query": {
                "type": ["object", "boolean"],
                "properties": {
                    "text": {"type": "string"},
                    "module": {"type": "string"},
                    "url": {"type": "string"}
                },
                "required": ["module", "text", "url"]
            },
            "data": {
                "type": ["object", "boolean"],
                "properties": {
                    "module": {"type": "string"},
                    "raw": {"type": ["object", "array", "string"]},
                    "processed": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "array"
                            }
                        }
                    },
                    "processedHtml": {"type": "array"},
                    "url": {"type": "string"},
                    "description": {"type": "object"} // TODO: Define Description SCHEMA
                },
                // TODO: object OR url (http://spacetelescope.github.io/understanding-json-schema/reference/combining.html)
                "required": ["module"] }
        },
        "required": ["style", "options"]
    },


    /**
     * Returns a compact, current Attribute Object
     * Removes all main-attributes which are flagged with false
     *
     * @returns {Object}
     */
    getAttrObj: function() {
        "use strict";

        var attrObj = {
            "style": this.style,
            "options": this.options,
            "display": this.display
        };

        if (this.data) {
            attrObj.data = this.data;
        }

        if (this.query) {
            attrObj.query = this.query;
        }

        return attrObj;
    },

    /**
     * Parses all Attributes of the plastic.js element
     *
     * @returns {Object}
     */
    parse: function() {
        "use strict";

        this.getStyle();
        this.getOptions();
        this.getQuery();
        this.getData();
        this.getDataDescription();
        this.getDisplay();

        if (this.pEl.options.debug) {
            plastic.msg.dir(this.getAttrObj());
        }

    },

    /**
     * Gets all Style Attributes
     * They are calculated directly from the DOM Element style
     */
    getStyle: function() {
        "use strict";

        /** Element CSS Style (Contains Width and Height) */
        this.style = {};

        this.style.height = this.$el.height();
        this.style.width = this.$el.width();
    },

    /**
     * Gets all Option Attributes
     */
    getOptions: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var optionsObject = this.$el.find(".plastic-options");

        if (optionsObject.length > 0) {

            var optionsString = optionsObject[0].text;

            if (optionsString && optionsString !== '') {

                try {

                    // If JSON is escaped, unescape it
                    optionsString = optionsString.replace(/&quot;/g, '"');

                    options = $.parseJSON(optionsString);
                    this.options = options;

                } catch(e) {
                    console.dir(e);
                    plastic.msg.error('Invalid JSON in the Options Object!', this.$el);
                    throw new Error(e);
                }

            } else {
                plastic.msg.error('Empty Obptions Element!', this.$el);
                throw new Error('Empty Obptions Element!');
            }

        }
    },

    /**
     * Gets all Option Attributes
     */
    getDisplay: function() {
        "use strict";

        /** Element Options */
        var options = {}; // mandatory!

        var displayObject = this.$el.find(".plastic-display");

        if (displayObject.length > 0) {

            this.display.module = displayObject.attr('data-display-module');

            var optionsString = displayObject[0].text;

            if (optionsString && optionsString !== '') {

                try {

                    // If JSON is escaped, unescape it
                    optionsString = optionsString.replace(/&quot;/g, '"');

                    options = $.parseJSON(optionsString);
                    this.display.options = options;

                } catch(e) {
                    console.dir(e);
                    plastic.msg.error('Invalid JSON in the Options Object!', this.$el);
                    throw new Error(e);
                }

            } else {
                this.display.options = {};
            }

        } else {
            plastic.msg.error('No Display Module set!', this.$el);
            throw new Error('No Display Module set!');
        }

    },

    /**
     * Gets all Query Attributes and stores them into this.query
     */
    getQuery: function() {
        "use strict";
        var queryElement = this.$el.find(".plastic-query");

        if (queryElement.length > 0)  {

            /** Element Query Data */
            var query = {};

            query.url = queryElement.attr('data-query-url');
            query.module = queryElement.attr('type');

            var queryString = queryElement[0].text;

            if (queryString && queryString !== '') {
                query.text = queryString;

                // SUCCESS
                this.query = query;

            } else {
                plastic.msg.error('Empty Query Element!', this.$el);
                throw new Error('Empty Query Element!');
            }

        }
    },

    /**
     * Gets all Schema Attributes
     */
    getDataDescription: function() {
        "use strict";
        // Get Data-URL
        var schemaElement = this.$el.find(".plastic-schema");

        if (schemaElement.length > 0)  {

            var schemaString = schemaElement[0].text;

            if (schemaString && schemaString !== '') {
                // If JSON is escaped, unescape it
                schemaString = schemaString.replace(/&quot;/g, '"');
                this.data.description =  $.parseJSON(schemaString);
            } else {
                plastic.msg.error('Data Description Element provided, but empty!', this.$el);
            }

        }
    },

    /**
     * Gets all Data Attributes
     */
    getData: function() {
        "use strict";

        /** Element Data */
        var data = {};

        // Get Data-URL
        var dataElement = this.$el.find(".plastic-data");

        if (dataElement.length > 0) {

            data.url = dataElement.attr('data-url');
            data.module = dataElement.attr('data-format');

            // If no Data URL given, read Data Object
            if (!data.url) {

                var dataString = dataElement[0].text;

                if (dataString && dataString !== '') {
                    // If JSON is escaped, unescape it
                    dataString = dataString.replace(/&quot;/g, '"');
                    data.raw = $.parseJSON(dataString);
                } else {
                    plastic.msg.error('Empty Data Element!', this.$el);
                }
            }

            // SUCCESS
            this.data = data;

        }
    },

    /**
     * Validates the parsed ElementAttributes Data
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";

        plastic.helper.schemaValidation(this.attrObjSchema, this.getAttrObj(), 'Element Attributes: Data Structure invalid!');

    }

};

plastic.msg = {

    /**
     * Log Array
     *
     * If debugging is enabled, all infos, warnings and errors will be saved here
     *
     * @type {Array}
     * @private
     */
    _logs: [],

    /**
     * Logs a Message or Object to the Log Object and the console
     *
     * @example
     * plastic.msg.log('For your information', this.$el);
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {Object}          [el]    concerning plastic.js DOM element
     */
    log: function(msg, el) {
        "use strict";
        this.createLogEntry(msg, 'info', el || false);
        if (el) {
            console.log('[#' + el.id + '] ' + msg);
        }
        console.log(msg);
    },

    /**
     * Logs an Object to the Log Object and the console
     *
     * @example
     * plastic.msg.dir(myObject);
     *
     * @param {Object}   obj     Message String or Object
     */
    dir: function(obj) {
        "use strict";
        this.createLogEntry(obj, 'dump');
        console.dir(obj);
    },

    /**
     * Logs a Warning Message or Object to the Log Object and the console
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {Object}          [el]    concerning plastic.js DOM element
     */
    warn: function(msg, el) {
        "use strict";
        this.createLogEntry(msg, 'warning', el || false);
        console.warn(msg);
    },


    /**
     * Logs and outputs an error
     *
     * Can be given an error string or object
     *
     * @param {string}  msg       Log Message
     * @param {Object}  [el]      plastic element to append the message on
     */
    error: function (msg, el) {

        var message = msg;

        console.error(msg);
        this.createLogEntry(msg, 'error', el);

        if (msg instanceof Error) {
            message = msg.message;
        }

        this.createNotification(message, 'error', el);

    },

    /**
     * Creates a new log entry object if logging is enabled
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {string}          type    Message Type
     * @param {Object}          [el]    concerning plastic.js DOM element
     *
     */
    createLogEntry: function(msg, type, el) {
        "use strict";

        if (plastic.options.log) {
            var logObj = {
                timestamp: (new Date()).getTime(),
                type: type,
                msg: msg
            };

            if (el) {
                logObj.el = el;
            }

            this._logs.push(logObj);
        }

    },

    /**
     * Creates a new notification within the plastic-js-messages div
     *
     * @todo Check if msg is an Object, if it is use pre tag for displaying it
     *
     * @param {string|Object}   msg     Message String or Object
     * @param {string}          type    Message Type
     * @param {Object}          [el]    concerning plastic.js DOM element or concerning plastic element
     */
    createNotification: function(msg, type, el) {

        if (el.$el) {
            el = el.$el;
        }

        if (el && el.find) {
            var msgBox = el.find('.plastic-js-messages');
            msgBox.append('<div class="plastic-js-msg plastic-js-msg-error"><strong>' + type.toUpperCase() + ':</strong> ' + msg + '</div>');
        }

    },

    /**
     * Parses the Log Object to a JSON string and dumps the string and the object into the console
     */
    dumpLogObject: function() {
        "use strict";
        console.log('> Dumping plastic.js log as Object:');
        console.dir(this._logs);
    },

    /**
     * Parses the Log Object to a JSON string and dumps the string and the object into the console
     */
    dumpLogJSON: function() {
        "use strict";
        console.log('> Dumping plastic.js log as JSON String:');
        console.log(JSON.stringify(this._logs, null, 4));
    },

    /**
     * Pretty prints an JSON Object to an HTML string
     *
     * @link http://stackoverflow.com/a/7220510
     *
     * @todo Wrap it into a pre tag
     *
     * @param   {Object} json   JSON Object
     * @returns {string} HTML String
     */
    prettyPrintJSON: function (json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, false, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
};



plastic.helper.duckTyping = function(data) {
    "use strict";

    var dataDescription = {};

    var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (var attrName in data[0]) {

        var attrValue = data[0][attrName][0];

        if ($.isNumeric(attrValue)) {

            dataDescription[attrName] = {
                type: "number"
            };

        } else {

            dataDescription[attrName] = {
                type: "string"
            };

            if (attrValue.indexOf("http://") > -1) {
                dataDescription[attrName].format = "url";
            } else if (emailRegexp.test(attrValue) || attrValue.indexOf("mailto:") > -1) {
                dataDescription[attrName].format = "email";
            } else if (attrValue.indexOf("tel:") > -1) {
                dataDescription[attrName].format = "phone";
            }


        }

    }

    return dataDescription;

};

plastic.helper.Events = function() {
    "use strict";

};

plastic.helper.Events.prototype = {

    /** @private */
    _subs: {},

    /**
     * Publish Event
     *
     * @param {string} topic
     *
     * @returns {boolean}
     */
    pub: function(topic) {

        var slice = [].slice;

        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to publish.");
        }

        var args = slice.call(arguments, 1), topicSubscriptions, subscription, length, i = 0, ret;

        if (!this._subs[topic]) {
            return true;
        }

        topicSubscriptions = this._subs[ topic ].slice();
        for (length = topicSubscriptions.length; i < length; i++) {
            subscription = topicSubscriptions[ i ];
            ret = subscription.callback.apply(subscription.context, args);
            if (ret === false) {
                break;
            }
        }
        return ret !== false;
    },

    /**
     * Subscribe Event
     *
     * @param {string}          topic
     * @param {Object|Function} context
     * @param {Function}        callback
     * @param {number|Function} priority
     *
     * @returns {Function}
     */
    sub: function(topic, context, callback, priority) {
        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to create a subscription.");
        }

        if (arguments.length === 3 && typeof callback === "number") {
            priority = callback;
            callback = context;
            context = null;
        }
        if (arguments.length === 2) {
            callback = context;
            context = null;
        }
        priority = priority || 10;

        var topicIndex = 0,
            topics = topic.split(/\s/),
            topicLength = topics.length,
            added;
        for (; topicIndex < topicLength; topicIndex++) {
            topic = topics[ topicIndex ];
            added = false;
            if (!this._subs[ topic ]) {
                this._subs[ topic ] = [];
            }

            var i = this._subs[ topic ].length - 1,
                subscriptionInfo = {
                    callback: callback,
                    context: context,
                    priority: priority
                };

            for (; i >= 0; i--) {
                if (this._subs[ topic ][ i ].priority <= priority) {
                    this._subs[ topic ].splice(i + 1, 0, subscriptionInfo);
                    added = true;
                    break;
                }
            }

            if (!added) {
                this._subs[ topic ].unshift(subscriptionInfo);
            }
        }

        return callback;
    },

    /**
     * Unsubscribe Event
     *
     * @param {string}          topic
     * @param {Object|Function} context
     * @param {Function}        callback
     */
    unsub: function(topic, context, callback) {
        if (typeof topic !== "string") {
            throw new Error("You must provide a valid topic to remove a subscription.");
        }

        if (arguments.length === 2) {
            callback = context;
            context = null;
        }

        if (!this._subs[ topic ]) {
            return;
        }

        var length = this._subs[ topic ].length,
            i = 0;

        for (; i < length; i++) {
            if (this._subs[ topic ][ i ].callback === callback) {
                if (!context || this._subs[ topic ][ i ].context === context) {
                    this._subs[ topic ].splice(i, 1);

                    // Adjust counter and length for removed item
                    i--;
                    length--;
                }
            }
        }
    }
};


/**
 * Helper Function which acts as a facade wrapper around the Schema Validation Library
 *
 * The Validation Objects should follow the JSON-Schema Standard: (http://json-schema.org/)
 * Currently it uses tv4 (https://github.com/geraintluff/tv4)
 *
 * @param {Object} schema   Schema object
 * @param {Object} data     Data to validate against the schema object
 * @param {String} [errorMessage]   Optional Error Message if Validation fails
 *
 * @returns {Object|boolean}
 */
plastic.helper.schemaValidation = function(schema, data, errorMessage) {
    "use strict";

    var valid = tv4.validate(data, schema);

    if (valid) {
        return false;
    } else {

        if (errorMessage && tv4.error.message) {
            errorMessage += ' ' + tv4.error.message;

            if (tv4.error.dataPath) {
                errorMessage += ' @' + tv4.error.dataPath;
            }
        }

        var error = new Error('Validation Error');
        error.name = 'Validation Error';
        error.message = errorMessage || tv4.error.message;
        error.schemaValidation = tv4.error;
        error.stack = (new Error()).stack;

        throw error;
    }


};

plastic.modules.Module = function(pEl, type, name) {

    /**
     * plastic Element
     * @type {plastic.Element}
     */
    this.pEl = pEl;

    /**
     * Module Name
     * @type {string}
     */
    this.name = name;

    /**
     * Module Type
     * @type {string}
     */
    this.type = type;

    /**
     * Specific Module Instance
     *
     * @type {Object}
     */
    this.module = undefined;

    /**
     * Module Infos (like className, Dependencies, etc.)
     * @type {Object}
     */
    this.info = plastic.modules.moduleManager.get(type, name);

    if (!this.info)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    var Module = plastic.modules[type][this.info.className];

    if (!Module)  {
        throw new Error('Module of type "' + type + '" and name "' + name + '" not found!');
    }

    // Specific case handling for each module-type
    if (type === 'display') {
        var $el = $(pEl.$el.find('.plastic-js-display')[0]);
        $el.html('');
        this.module = new Module($el, pEl.attr);
        this.execute();

    } else if (type === 'data') {
        this.module = new Module(pEl.attr.data);
        this.execute();

    } else if (type === 'query') {
        this.module = new Module(pEl.attr.query);
        this.execute();

    } else {
        throw new Error('Invalid Module Type!');
    }

};

plastic.modules.Module.prototype = {

    /**
     * Executes the module and stores the return values accordingly
     *
     * Validates the data against the module before executing it
     */
    execute: function() {
        "use strict";

        if (this.type === 'display') {
            this.validate();
            this.module.execute();

        } else if (this.type === 'data') {
            this.validate();
            this.pEl.attr.data = this.module.execute();

        } else if (this.type === 'query') {
            this.validate();
            this.pEl.attr.data = this.module.execute();
        }

    },

    /**
     * General Module Validation
     *
     * This calls all available validation Schemas and Function of the module
     */
    validate: function() {
        "use strict";

        var self = this;

        // General Validation (by logic)
        if (this.module.validate) {

            var validationErrors = this.module.validate();

            // validation was successful
            if (validationErrors) {
                plastic.msg.log(validationErrors, self.pEl.$el);
                console.dir(validationErrors);
                throw new Error('Module ' + this.name + ': Validation Error!');
            }
        }

        try {
            // Schema Validation (by schema objects)
            if (this.module.rawDataSchema && this.pEl.attr.data && this.pEl.attr.data.raw) {
                plastic.helper.schemaValidation(this.module.rawDataSchema, this.pEl.attr.data.raw, 'Raw Data invalid!');
            }

            if (this.module.processedDataSchema && this.pEl.attr.data && this.pEl.attr.data.processed) {
                plastic.helper.schemaValidation(this.module.processedDataSchema, this.pEl.attr.data.processed, 'Processed Data invalid!');
            }

            if (this.module.displayOptionsSchema) {

                try {
                    plastic.helper.schemaValidation(this.module.displayOptionsSchema, this.pEl.attr.display.options, 'Display Options invalid!');
                } catch (e) {
                    plastic.msg.error(e, this.pEl);
                    return false;
                }


                // If an (optional) option is not given, inherit the default from the option schema
                for (var propName in this.module.displayOptionsSchema.properties) {

                    if (this.module.displayOptionsSchema.properties[propName]) {
                        if (!this.pEl.attr.display.options.hasOwnProperty(propName)) {
                            this.pEl.attr.display.options[propName] = this.module.displayOptionsSchema.properties[propName].default;
                        }
                    } else {
                        plastic.msg.warn('Option given that is not defined in the Option Schema');
                    }


                }
            }

        } catch (e) {
//            console.error(e);
            plastic.msg.error(e, this.pEl);
            // TODO: Stop Display Processing
            // TODO: Message to the User
        }

    },

    /**
     * Calls the Module Update function (if available)
     */
    update: function() {
        "use strict";
        if (this.module.update) {
            this.module.update();
        }

    }



};

plastic.modules.dependencyManager = {

    /**
     * Registry Object that collects all extnal dependencies by name, and ressources
     *
     * If a module is added that has a new external dependency it can either be added here
     * or be added via setDependency() at runtime.
     * If "test" is given, plastic.js will look if the given global variable exists. If it does, it will not be loaded.
     */
    registry: {
        "d3": {
            "title": 'D3.js',
            "website": 'http://d3js.org/',
            "version": '3.4.6',
            "js": ["//cdnjs.cloudflare.com/ajax/libs/d3/3.4.6/d3.min.js"],
            "test": "d3"
        },
        "c3": {
            "title": 'C3.js',
            "website": 'http://c3js.org/',
            "version": '0.1.29',
            "js": ["//cdnjs.cloudflare.com/ajax/libs/c3/0.1.29/c3.min.js"],
            "test": "c3"
        },
        "nvd3": {
            "title": 'NVD3',
            "website": 'http://nvd3.org/',
            "version": '1.1.15-beta',
            "js": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.js"],
            "css": ["//cdnjs.cloudflare.com/ajax/libs/nvd3/1.1.15-beta/nv.d3.min.css"],
            "test": "nv"
        },
        "dataTable": {
            "title": 'DataTables',
            "website": 'http://www.datatables.net/',
            "version": '1.10.0',
            "js": ["//cdn.datatables.net/1.10.0/js/jquery.dataTables.js"],
            "css": ["//cdn.datatables.net/1.10.0/css/jquery.dataTables.css"],
            "test": "$(document).DataTable"
        }
    },

    /**
     * Object of all Ressources that have to be loaded
     */
    usedDeps: {},

    /**
     * Sets a new dependency (that isn't registered yet)
     *
     * @param {string}  depName     Dependency Name
     * @param {Array}      [jsArray]   Array of JavaScript Files to load (optional)
     * @param {Array}      [cssArray]  Array of CSS Files to load (optional)
     */
    setDependency: function(depName, jsArray, cssArray) {
        "use strict";
        this.registry[depName] = {};

        if (jsArray && jsArray instanceof Array) {
            this.registry.js = jsArray;
        }

        if (cssArray && cssArray instanceof Array) {
            this.registry.css = cssArray;
        }
    },

    /**
     * Gets a dependency Object by name
     *
     * @param {string}  dep
     * @returns {{}}
     */
    getDependency: function(dep) {
        "use strict";
        return this.registry[dep];
    },

    /**
     * Add a dependency that has to be loaded
     *
     * @param {Array} dependencyArray  Array of dependency names (has to fit with the registry above)
     */
    add: function(dependencyArray) {
        "use strict";

        if (dependencyArray) {
            for (var i = 0; i < dependencyArray.length; i++) {
                var depName = dependencyArray[i];
                this.usedDeps[depName] = this.registry[depName];
            }
        } else {
            // TODO: Handle this case!
        }

    },

    /**
     * Fetches all external dependencies asyncronally
     *
     * Dependencies to load have to be added first via .add(dependencies)
     * Triggers plastic events (loaded-)
     *
     * Uses {@link https://github.com/rgrove/lazyload/}
     *
     * @todo Dependency Caching?
     */
    fetch: function() {

        "use strict";

        var cssComplete = function() {
            plastic.events.pub('loaded-' + depName + '.css');
        };

        var jsComplete = function() {
            plastic.events.pub('loaded-' + depName);
        };

        for (var depName in this.usedDeps) {

            var urls = this.usedDeps[depName];

            if (this.missingDependency(urls.test)) {

                LazyLoad.css(urls.css, cssComplete, depName);
                LazyLoad.js(urls.js, jsComplete, depName);

            } else {

                jsComplete();
                if (plastic.options.debug) {
                    plastic.msg.log('[GLOBAL] Dependency ' + depName + ' not loaded, it already exists ');
                }
            }

        }
    },

    /**
     * Checks if Dependency is already loaded. Supports three types of checks:
     *
     * * Global Browser Functions
     * * jQuery Global Functions
     * * jQuery Element Functions
     *
     * @param   {string}      test
     * @returns {boolean}
     */
    missingDependency: function(test) {
        "use strict";

        // If no test is given, always load dependency
        if (!test) {
            return true;
        }

        var testString = test;

        // Check for jQuery Element Plugin
        if (test.indexOf("$(document).") > -1) {

            testString = test.replace('$(document).', '');

            if($(document)[testString]) {
                return false;
            } else {
                return true;
            }
        }

        // Check for jQuery Plugin / Function
        if (test.indexOf("$.") > -1) {
            testString = test.replace('$.', '');
            if($[testString]) {
                return false;
            } else {
                return true;
            }

        }

        // Test for global object / function
        if (window[test]) {
            return false;
        }

        // If still no test-condition is met, declare dependency as missing
        return true;


    }

};

plastic.modules.moduleManager = {

    /**
     * Module Registry Object
     *
     * @type {{}}
     */
    modules: {
        api: {},
        data: {},
        display: {},
        query: {}
    },

    parametersSchema: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "moduleType": {"type": "string"},
            "apiName": {"type": "string"},
            "className": {"type": "string"},
            "dependencies": {"type": "array"}
        },
        "required": ["moduleType", "apiName", "className"]
    },

    /**
     * Register Modules to the Registry.
     *
     * Every Module has to register itself here, or it won't be found and exectuted!
     *
     * @param {Object}  paramsObj  ParameterObject
     */
    register: function(paramsObj) {
        "use strict";

        plastic.helper.schemaValidation(this.parametersSchema, paramsObj);

        try {
            this.modules[paramsObj.moduleType][paramsObj.apiName] = paramsObj;
        } catch(e) {
            console.log(e);
            console.error('Wrong usage of Module Registry!');
        }
    },

    /**
     * Gets a Module by Type and Api Name
     *
     * @param moduleType
     * @param apiName
     */
    get: function(moduleType, apiName) {
        "use strict";
        if (this.modules[moduleType] && this.modules[moduleType][apiName]) {
            return this.modules[moduleType][apiName];
        } else {
            return false;
        }
    }


};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'ask-json',
    className: 'AskJson',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.AskJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.dataDescription = {};

    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "query": {
                "type": "object",
                "properties": {
                    "printrequests": {
                        "type": "array",
                        "properties": {
                            "label": {"type": "string"},
                            "typeid": {"type": "string"},
                            "mode": {"type": "number"}
                        },
                        "required": ["label", "typeid"]
                    },
                    "results": {
                        "type": "object",
                        "additionalProperties": {
                            "type": "object",
                            "properties": {
                                "printouts": {"type": "object"},
                                "fulltext": {"type": "string"},
                                "fullurl": {"type": "string"}
                            },
                            "required": ["printouts"]
                        }
                    }
                },
                "required": ["printrequests", "results"]
            }
        },
        "required": ["query"]
    };

    /**
     * Maps ASK-Result-Format Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaMap = {
        "_txt": {
            "type": "string"
        },
        "_ema": {
            "type": "string",
            "format": "email"
        },
        "_tel": {
            "type": "string",
            "format": "phone"
        }
    };


};

plastic.modules.data.AskJson.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {Object}
     */
    execute: function() {

        this.parseSchema();
        this.parseData();

        return this.dataObj;

    },

    parseSchema: function() {
        "use strict";

        if (!this.dataObj.description) {

            var schema = this.dataObj.raw.query.printrequests;

            for (var i = 0; i < schema.length; i++) {

                var o = schema[i];

                var mappedType = this.schemaMap[o.typeid];
                if (mappedType) {
                    this.dataDescription[o.label] = mappedType;
                }

            }

            this.dataObj.description = this.dataDescription;

        }
    },

    parseData: function() {
        "use strict";

        this.dataObj.processed = [];
        var self = this;

        // Parse Data without additional Schema Informations
        for (var obj in this.dataObj.raw.query.results) {
            var row = this.dataObj.raw.query.results[obj];
            this.dataObj.processed.push(row.printouts);
        }

        // Enrich processed data by appling the descriptionSchema to it.
//        this.dataObj.processedHtml = plastic.schemaParser.getHtmlData(this.dataObj.processed, this.descriptionSchema);

    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'csv',
    className: 'CSV',
    dependencies: []
});

plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'tsv',
    className: 'CSV',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.CSV = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * Raw Data Schema for validation
     *
     * No schema since CSV is no JSON format
     *
     * @type {{}}
     */
    this.rawDataSchema = {};

};

plastic.modules.data.CSV.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {

        console.info(this.dataObj.raw);
        var separator = ';';

        if (this.dataObj.module === 'tsv') {
            separator = '\t';
        }

        this.dataObj.processed = this.parseCSV(this.dataObj.raw, separator, false);

        return this.dataObj;
    },

    /**
     * Parses CSV String to Array
     *
     * http://www.greywyvern.com/?post=258
     *
     * @param csv
     * @param seperator
     * @param linebreak
     * @returns {Array|*}
     */
    parseCSV: function(csv, seperator, linebreak) {

        var processedData = [];
        var headers = [];

        var csvLines = csv.split(linebreak || '\r\n');

        for (var i = 0; i < csvLines.length; i++) {

            var line = csvLines[i];

            if (i === 0) {
                headers = line.split(seperator || ';');
                console.log(headers);
            } else {
                if (line.length > 0) {
                    processedData[i] = {};
                    console.info(line);

                    var csvCells = line.split(seperator || ';');

                    for (var j = 0; j < csvCells.length; j++) {

                        var cell = csvCells[j];
                        processedData[i][headers[j]] = cell;
                    }

                }
            }


        }

        console.dir(processedData);


        return processedData;
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'default',
    className: 'Default',
    dependencies: []
});
/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.Default = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    this.dataDescription = {};

    /**
     * Raw Data Schema for validation
     *
     * TODO: Further describe "data" structure
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "data": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": {
                        "type": "array"
                    }
                }
            },
            "schema": {
                "type": "object",
                "additionalProperties": {
                    "type": "object"
                }
            },
            "description": {
                "type": "object"
            }
        },
        "required": ["data"]
    };

};

plastic.modules.data.Default.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {
        this.dataObj.processed = this.dataObj.raw.data;
        return this.dataObj;
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'simple-default',
    className: 'SimpleDefault',
    dependencies: []
});
/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.data.SimpleDefault = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * Raw Data Schema for validation
     *
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",

        "type": "array",
        "items": {
            "type": "object"
        }
    };

};

plastic.modules.data.SimpleDefault.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Since the data is already in the correct format, it has just to be returned
     *
     * @returns {Object}
     */
    execute: function() {

        var processedData = [];

        for (var i = 0; i < this.dataObj.raw.length; i++) {
            var col = this.dataObj.raw[i];
            processedData[i] = {};
            for (var cell in col) {
                processedData[i][cell] = [col[cell]];
            }
        }

        this.dataObj.processed = processedData;
        return this.dataObj;
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'data',
    apiName: 'sparql-json',
    className: 'SparqlJson',
    dependencies: []
});

/**
 * Parses tabular data from SPARQL Endpoints
 *
 * @author Simon Heimler
 * @constructor
 */
plastic.modules.data.SparqlJson = function(dataObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.dataObj = dataObj;

    /**
     * SPARQL Result Format Schema
     *
     * @todo: Not 100% done
     * @type {{}}
     */
    this.rawDataSchema = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",

        "properties": {
            "head": {
                "type": "object",
                "properties": {
                    "link": {"type": "array"},
                    "vars": {"type": "array"}
                },
                "required": ["vars"]
            },
            "results": {
                "type": "object",
                "properties": {
                    "bindings": {
                        type: "array",
                        "additionalProperties": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "object",
                                "properties": {
                                    "datatype": {"type": "string"},
                                    "type": {"type": "string"},
                                    "value": {"type": "string"}
                                },
                                "required": ["datatype", "type", "value"]
                            }
                        }
                    },
                    "required": ["bindings"]
                }
            }
        },
        "required": ["head", "results"]
    };

    /**
     * Maps SPARQL Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaDatatypeMap = {
        "http://www.w3.org/2001/XMLSchema#integer": {
            "type": "number"
        },
        "http://www.w3.org/2001/XMLSchema#double": {
            "type": "number"
        },
        "http://www.w3.org/2001/XMLSchema#date": {
            "type": "string",
            "format": "date"
        }
    };

    /**
     * Maps SPARQL Schema to JSON-Schema
     *
     * @type {{}}
     */
    this.schemaTypeMap = {
        "uri": {
            "type": "string",
            "format": "uri"
        },
        "literal": {
           "type": "string"
        }
    };

    this.dataDescription = {};

};

plastic.modules.data.SparqlJson.prototype = {

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        this.parseSchema();
        this.parseData();

        return this.dataObj;

    },

    parseSchema: function() {
        "use strict";

        if (!this.dataObj.description) {

            var schema = this.dataObj.raw.results.bindings[0];

            for (var o in schema) {

                var col = schema[o];
                var mappedType = false;

                if (col.datatype) {
                    mappedType = this.schemaDatatypeMap[col.datatype];
                } else if (col.type) {
                    mappedType = this.schemaTypeMap[col.type];
                }

                // Default Data Description Type
                if (!mappedType) {
                    mappedType = {
                        "type": "string"
                    };
                }

                this.dataDescription[o] = mappedType;


                this.dataObj.description = this.dataDescription;
            }

        }
    },

    parseData: function() {
        "use strict";

        this.dataObj.processed = [];

        for (var i = 0; i < this.dataObj.raw.results.bindings.length; i++) {

            this.dataObj.processed[i] = {};

            var row = this.dataObj.raw.results.bindings[i];

            for (var o in row) {

                var value = row[o].value;

                // If value is a number type, parse it as float (takes care of integers, too)
                if (this.dataDescription[o].type === 'number') {
                    value = parseFloat(value);
                }

                this.dataObj.processed[i][o] = [value];
            }
        }

        return this.dataObj;

    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'advanced-table',
    className: 'AdvancedTable',
    dependencies: ['dataTable']
});

/**
 * Table Display Module
 *
 * @constructor
 */
plastic.modules.display.AdvancedTable = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Advanced Table",

        "type": "object",
        "properties": {
            "tableClasses": {
                "title": "Table Classes",
                "description": "Table CSS Classes",
                "type": "string",
                "default": ""
            },
            "paging": {
                "title": "Paging",
                "description": "Enable Pagination of Table Elements",
                "type": "boolean",
                "default": false
            },
            "lengthMenu": {
                "title": "Menu Length",
                "description": "Sets the available number of entries in the dropdown menu. Takes an 2dim array.",
                "type": "array",
                "default": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ]
            },
            "searching": {
                "title": "Searching",
                "description": "Enable Searching of Table Elements",
                "type": "boolean",
                "default": true
            },
            "ordering": {
                "title": "Ordering",
                "description": "Feature control ordering (sorting) abilities in DataTables.",
                "type": "boolean",
                "default": true
            },
            "orderMulti": {
                "title": "Multiple Ordering",
                "description": "Multiple column ordering ability control.",
                "type": "boolean",
                "default": true
            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};

};

plastic.modules.display.AdvancedTable.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var data = [];
        var options = this.elAttr.display.options;

        // Use schema-processed HTML data if available:
        if (this.elAttr.data.processedHtml) {
            data = this.elAttr.data.processedHtml;
        } else {
            data = this.elAttr.data.processed;
        }

        var $table = $('<table class="' + options.tableClasses + '" />');


        //////////////////////////////////////////
        // Table Head                           //
        //////////////////////////////////////////

        var $tableHead = $('<thead />');
        var $headRow = $('<tr/>');

        for (var column in data[0]) {
            if (data[0].hasOwnProperty(column)) {
                $headRow.append('<th>' + column + '</th>');
            }
        }

        $tableHead.append($headRow);
        $table.append($tableHead);


        //////////////////////////////////////////
        // Table Body                           //
        //////////////////////////////////////////

        var $tableBody = $('<tbody />');

        $.each(data, function(index, row) {

            var $row = $('<tr/>');

            for (var colName in row) {
                $('<td/>').html(row[colName]).appendTo($row);
            }
            $tableBody.append($row);
        });

        $table.append($tableBody);

        this.$el.append($table);

        $table.DataTable(options);

    },

    update: function() {
        "use strict";
        this.execute();
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'line-chart',
    className: 'CumulativeLineChart',
    dependencies: ["d3", "nvd3"]
});

/**
 * Line Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.CumulativeLineChart = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Cumulative Line Chart",

        "type": "object",
        "properties": {
            "useInteractiveGuideline": {
                "title": "Interactive Guideline",
                "description": "Show the interactive Guideline.",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "title": "Transition Duration",
                "description": "Duration of the animation in milliseconds.",
                "type": "number",
                "minimum": 0,
                "default": 350
            },
            "showLegend": {
                "title": "Display Legend",
                "description": "Show the legend, allowing users to turn on/off line series.",
                "type": "boolean",
                "default": true
            },
            "marginLeft": {
                "title": "Left Margin",
                "description": "Adjust chart margins to give the x-axis some breathing room.",
                "type": "boolean",
                "default": true
            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};


};

plastic.modules.display.CumulativeLineChart.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function () {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Bar Chart
     *
     * @returns {*}
     */
    execute: function () {

        var options = this.elAttr.display.options;

        var data = this.elAttr.data.processed;
        var mappedData = this.mapData(data);

        var svg = this.$el.append('<svg></svg>');

        var chart = nv.models.lineChart()
                .margin({left: options.margin})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(options.useInteractiveGuideline)  //We want nice looking tooltips and a guideline!
                .transitionDuration(options.transitionDuration)  //how fast do you want the lines to transition?
                .showLegend(options.showLegend)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
            ;

//        chart.xAxis     //Chart x-axis settings
//            .axisLabel('Time (ms)')
//            .tickFormat(d3.format(',r'));
//
//        chart.yAxis     //Chart y-axis settings
//            .axisLabel('Voltage (v)')
//            .tickFormat(d3.format('.02f'));


        d3.select(this.$el[0].children[0])    //Select the <svg> element you want to render the chart in.
            .datum(mappedData)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function() {
            chart.update();
        });

    },

    mapData: function(data) {
        "use strict";

        var mappedData = [];
        var dataDescription = this.elAttr.data.description;

        var xAxis = this.findX(dataDescription);

        for (var columnName in dataDescription ) {

            var column = dataDescription[columnName];

            if (columnName !== xAxis && column.type === "number") {

                var seriesData = {};
                seriesData.key = columnName;
                seriesData.values = [];

                // TODO: If xAxis can be used as Timestamp or Scala, use it as X entry

                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
//                    console.dir(row[columnName][0]);
                    var dataEntry = {
                        "x": i,
                        "y": row[columnName][0]
                    };
                    seriesData.values.push(dataEntry);
                }

                mappedData.push(seriesData);
            }
        }

        return mappedData;
    },

    /**
     * Analyzes the Data Description which column should be used as X-Axis.
     * Fallback to first Column (which should be the x-axis anyway)
     *
     * @param dataDescription
     * @returns {*}
     */
    findX: function (dataDescription) {
        "use strict";
        for (var columnName in dataDescription) {
            var column = dataDescription[columnName];
            if (column.type === 'string' || (column.format && column.format === 'date'))  {
                return columnName;
            }
        }

        for (columnName in dataDescription) {
            return columnName;
        }

    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'discrete-bar-chart',
    className: 'DiscreteBarChart',
    dependencies: ["d3", "nvd3"],
    requirements: ["data-description"]
});

/**
 * Bar Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.DiscreteBarChart = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Discrete Bar Chart",

        "type": "object",
        "properties": {
            "staggerLabels": {
                "title": "Label Staggering",
                "description": "Too many bars and not enough room? Try staggering labels.",
                "type": "boolean",
                "default": false
            },
            "tooltips": {
                "title": "Tooltips",
                "description": "Show tooltips",
                "type": "boolean",
                "default": true
            },
            "showValues": {
                "title": "Display Values",
                "description": "Show the bar value right on top of each bar.",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "title": "Transition Duration",
                "description": "Duration of the animation in milliseconds.",
                "type": "number",
                "minimum": 0,
                "default": 350
            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};


};

plastic.modules.display.DiscreteBarChart.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function () {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Bar Chart
     *
     * @returns {*}
     */
    execute: function () {
        var data = this.elAttr.data.processed;

        var svg = this.$el.append('<svg></svg>');

        var options = this.elAttr.display.options;

        var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .staggerLabels(options.staggerLabels)
            .tooltips(options.tooltips)
            .showValues(options.showValues)
        ;

        var mappedData = this.mapData(data);

        d3.select(this.$el[0].children[0])
            .datum(mappedData)
            .transition().duration(options.transitionDuration)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

    },

    mapData: function(data) {
        "use strict";
        var mappedData = [{}];

        mappedData[0].key = "";
        mappedData[0].values = [];

        var labelColumn = '';
        var valueColumn = '';

        // Decides data types / mapping via data description if available:
        if (this.elAttr.data.description) {
            var description = this.elAttr.data.description;

            for (var o in description) {
                if (labelColumn === '' && description[o].type === "string") {
                    labelColumn = o;
                }

                if (valueColumn === '' && description[o].type === "number") {
                    valueColumn = o;
                }
            }
        }

        if (labelColumn === '' || valueColumn === '') {
            throw new Error('Could not map data to label and value! Please provide a correct data description / schema!');
        }


        // Do the actual mapping:
        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            mappedData[0].values.push({
                "label": row[labelColumn][0],
                "value": parseInt(row[valueColumn][0], 10)
            });
        }

        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'pie-chart',
    className: 'PieChart',
    dependencies: ["d3", "nvd3"]
});

/**
 * Pie Chart Display Module
 *
 * @constructor
 */
plastic.modules.display.PieChart = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Pie Chart",

        "type": "object",
        "properties": {
            "showLabels": {
                "title": "Display Labels",
                "description": "Show the labels.",
                "type": "boolean",
                "default": true
            },
            "tooltips": {
                "title": "Tooltips",
                "description": "Show tooltips",
                "type": "boolean",
                "default": true
            },
            "transitionDuration": {
                "title": "Transition Duration",
                "description": "Duration of the animation in milliseconds.",
                "type": "number",
                "minimum": 0,
                "default": 350
            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};


};

plastic.modules.display.PieChart.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function () {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Bar Chart
     *
     * @returns {*}
     */
    execute: function () {
        var data = this.elAttr.data.processed;

        var svg = this.$el.append('<svg></svg>');

        var options = this.elAttr.display.options;

        var chart = nv.models.pieChart()
            .x(function(d) { return d.label; })
            .y(function(d) { return d.value; })
            .showLabels(options.showLabels)
            .tooltips(options.tooltips)
        ;

        var mappedData = this.mapData(data);


        d3.select(this.$el[0].children[0])
            .datum(mappedData)
            .transition().duration(options.transitionDuration)
            .call(chart);

        nv.utils.windowResize(chart.update);
        return chart;

    },

    mapData: function(data) {
        "use strict";
        var mappedData = [];

        var labelColumn = '';
        var valueColumn = '';

        // Decides data types / mapping via data description if available:
        if (this.elAttr.data.description) {
            var description = this.elAttr.data.description;

            for (var o in description) {
                if (labelColumn === '' && description[o].type === "string") {
                    labelColumn = o;
                }

                if (valueColumn === '' && description[o].type === "number") {
                    valueColumn = o;
                }
            }
        }

        if (labelColumn === '' || valueColumn === '') {
            throw new Error('Could not map data to label and value! Please provide a correct data description / schema!');
        }

        // Do the actual mapping:
        for (var i = 0; i < data.length; i++) {
            var row = data[i];

            mappedData.push({
                "label": row[labelColumn][0],
                "value": parseInt(row[valueColumn][0])
            });
        }

        return mappedData;
    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }
};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'raw-data',
    className: 'RawData',
    dependencies: []
});

/**
 * Displays the Raw Data (and Schema if provided) as formatted JSON
 *
 * @constructor
 */
plastic.modules.display.RawData = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

};

plastic.modules.display.RawData.prototype = {

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        console.info(this.$el);

        var html = '<pre class="raw-data">' + JSON.stringify(this.elAttr.data.raw, false, 4) + '</code></pre>';

        this.$el.html(html);


    },

    update: function() {
        "use strict";
        this.execute(); // TODO: Write Update function
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'display',
    apiName: 'simple-table',
    className: 'SimpleTable',
    dependencies: []
});

/**
 * Table Display Module
 *
 * @constructor
 */
plastic.modules.display.SimpleTable = function($el, elAttr) {
    "use strict";

    /**
     * plastic.js DOM Element
     */
    this.$el = $el;

    /**
     * plastic.js ElementAttributes
     */
    this.elAttr = elAttr;

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.displayOptionsSchema = {

        "$schema": "http://json-schema.org/draft-04/schema#",

        "title": "Simple Table",

        "type": "object",
        "properties": {
            "tableClasses": {
                "title": "Table Classes",
                "description": "Table CSS Classes",
                "type": "string",
                "default": ""
            }
        },
        "additionalProperties": false,
        "required": []

    };

    /**
     * Display Options Validation Schema
     * @type {{}}
     */
    this.processedDataSchema = {};

};

plastic.modules.display.SimpleTable.prototype = {

    /**
     * Validates ElementAttributes
     *
     * @returns {Object|boolean}
     */
    validate: function() {
        "use strict";
        return false; // No Errors
    },

    /**
     * Renders the Table
     *
     * @returns {*}
     */
    execute: function() {

        var data = [];
        var options = this.elAttr.display.options;

        // Use schema-processed HTML data if available:
        if (this.elAttr.data.processedHtml) {
            data = this.elAttr.data.processedHtml;
        } else {
            data = this.elAttr.data.processed;
        }

        var $table = $('<table class="' + options.tableClasses + '" />');


        //////////////////////////////////////////
        // Table Head                           //
        //////////////////////////////////////////

        var $tableHead = $('<thead />');
        var $headRow = $('<tr/>');

        for (var column in data[0]) {
            if (data[0].hasOwnProperty(column)) {
                $headRow.append('<th>' + column + '</th>');
            }
        }

        $tableHead.append($headRow);
        $table.append($tableHead);


        //////////////////////////////////////////
        // Table Body                           //
        //////////////////////////////////////////

        var $tableBody = $('<tbody />');

        $.each(data, function(index, row) {

            var $row = $('<tr/>');

            for (var colName in row) {
                $('<td/>').html(row[colName]).appendTo($row);
            }
            $tableBody.append($row);
        });

        $table.append($tableBody);


        this.$el.append($table);

    },

    update: function() {
        "use strict";
        this.execute();
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'query',
    apiName: 'application/ask-query',
    className: 'Ask',
    dependencies: []
});

/**
 * Parses tabular data from an ASK Semantic MediaWiki API
 *
 * @constructor
 */
plastic.modules.query.Ask = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Ask.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} queryObj
     */
    setQueryObj: function(queryObj) {
        "use strict";

        this.queryObj = queryObj;
    },

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        // Set Data Parser Module
        var dataObj = {
            module: 'ask-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        var queryTrimmed = $.trim(query.replace(/\s+/g, ''));
        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?action=ask&query=' + queryEncoded + '&format=json&callback=?';

        return dataObj;
    }

};

// Register Module and define dependencies:
plastic.modules.moduleManager.register({
    moduleType: 'query',
    apiName: 'application/sparql-query',
    className: 'Sparql',
    dependencies: []
});

/**
 * This is a SPARQL Query Parser
 * It turns the Query into a SPARQL Endpoint URL
 *
 * @constructor
 */
plastic.modules.query.Sparql = function(queryObj) {

    /**
     * Incoming Raw Data
     * @type {{}}
     */
    this.queryObj = queryObj;

};

plastic.modules.query.Sparql.prototype = {

    /**
     * Sets Raw Data Object after Instanciation
     *
     * @param {{}} queryObj
     */
    setQueryObj: function(queryObj) {
        "use strict";

        this.queryObj = queryObj;
    },

    /**
     * Custom Validation
     *
     * @returns {boolean}
     */
    validate: function() {
        "use strict";
        return false;
    },

    /**
     * Parses the data into an internal used data format
     *
     * @returns {{}}
     */
    execute: function() {

        // Set Data Parser Module
        var dataObj = {
            module: 'sparql-json'
        };

        var url = this.queryObj.url;
        var query = this.queryObj.text;

        // Trim all Whitespace
        var queryTrimmed = $.trim(query.replace(/\s+/g, ' '));

        var queryEncoded = encodeURIComponent(queryTrimmed);

        dataObj.url = url + '?query=' + queryEncoded + '&output=json&callback=?';

        return dataObj;

    }

};
