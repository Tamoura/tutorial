/**
 * Data Parser Module
 * Demonstrates proper error handling for data parsing and validation
 */

/**
 * Custom error class for parsing errors
 */
class ParseError extends Error {
  constructor(message, dataType, rawData = null, originalError = null) {
    super(message);
    this.name = 'ParseError';
    this.dataType = dataType;
    this.rawData = rawData;
    this.originalError = originalError;
  }
}

/**
 * Custom error class for validation errors
 */
class ValidationError extends Error {
  constructor(message, field, value, constraint) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.constraint = constraint;
  }
}

/**
 * Safely parses JSON with detailed error messages
 * @param {string} jsonString - JSON string to parse
 * @param {string} context - Description of what's being parsed (for error messages)
 * @returns {Object} Parsed JSON object
 * @throws {ParseError} When JSON is invalid
 */
function parseJSON(jsonString, context = 'data') {
  if (jsonString === undefined || jsonString === null) {
    throw new ParseError(
      `Cannot parse ${context}: input is ${jsonString === null ? 'null' : 'undefined'}`,
      'JSON',
      jsonString
    );
  }

  if (typeof jsonString !== 'string') {
    throw new ParseError(
      `Cannot parse ${context}: expected string but received ${typeof jsonString}`,
      'JSON',
      jsonString
    );
  }

  if (jsonString.trim() === '') {
    throw new ParseError(
      `Cannot parse ${context}: input is an empty string`,
      'JSON',
      jsonString
    );
  }

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    // Extract position information from error message if available
    const positionMatch = error.message.match(/position (\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : null;

    let detailedMessage = `Invalid JSON in ${context}: ${error.message}`;

    if (position !== null) {
      const snippet = jsonString.substring(
        Math.max(0, position - 20),
        Math.min(jsonString.length, position + 20)
      );
      detailedMessage += `\n  Near: "...${snippet}..."`;
    }

    throw new ParseError(detailedMessage, 'JSON', jsonString, error);
  }
}

/**
 * Parses a number from various input types
 * @param {*} value - Value to parse as number
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {Object} options - Parsing options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {boolean} options.allowFloat - Whether to allow floating point numbers
 * @returns {number} Parsed number
 * @throws {ParseError|ValidationError} When parsing or validation fails
 */
function parseNumber(value, fieldName = 'value', options = {}) {
  const { min, max, allowFloat = true } = options;

  if (value === undefined || value === null) {
    throw new ParseError(
      `Cannot parse ${fieldName}: value is ${value === null ? 'null' : 'undefined'}`,
      'Number',
      value
    );
  }

  let parsed;

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      throw new ParseError(
        `Invalid ${fieldName}: number is ${Number.isNaN(value) ? 'NaN' : 'Infinity'}`,
        'Number',
        value
      );
    }
    parsed = value;
  } else if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      throw new ParseError(
        `Cannot parse ${fieldName}: string is empty`,
        'Number',
        value
      );
    }
    parsed = Number(trimmed);
    if (Number.isNaN(parsed)) {
      throw new ParseError(
        `Cannot parse ${fieldName}: "${value}" is not a valid number`,
        'Number',
        value
      );
    }
  } else {
    throw new ParseError(
      `Cannot parse ${fieldName}: expected number or string but received ${typeof value}`,
      'Number',
      value
    );
  }

  if (!allowFloat && !Number.isInteger(parsed)) {
    throw new ValidationError(
      `Invalid ${fieldName}: expected integer but received ${parsed}`,
      fieldName,
      parsed,
      'integer'
    );
  }

  if (min !== undefined && parsed < min) {
    throw new ValidationError(
      `Invalid ${fieldName}: ${parsed} is less than minimum value ${min}`,
      fieldName,
      parsed,
      `>= ${min}`
    );
  }

  if (max !== undefined && parsed > max) {
    throw new ValidationError(
      `Invalid ${fieldName}: ${parsed} is greater than maximum value ${max}`,
      fieldName,
      parsed,
      `<= ${max}`
    );
  }

  return parsed;
}

/**
 * Parses and validates a date
 * @param {*} value - Value to parse as date
 * @param {string} fieldName - Name of the field (for error messages)
 * @param {Object} options - Parsing options
 * @param {Date} options.minDate - Minimum allowed date
 * @param {Date} options.maxDate - Maximum allowed date
 * @returns {Date} Parsed date
 * @throws {ParseError|ValidationError} When parsing or validation fails
 */
function parseDate(value, fieldName = 'date', options = {}) {
  const { minDate, maxDate } = options;

  if (value === undefined || value === null) {
    throw new ParseError(
      `Cannot parse ${fieldName}: value is ${value === null ? 'null' : 'undefined'}`,
      'Date',
      value
    );
  }

  let parsed;

  if (value instanceof Date) {
    parsed = value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    parsed = new Date(value);
  } else {
    throw new ParseError(
      `Cannot parse ${fieldName}: expected Date, string, or number but received ${typeof value}`,
      'Date',
      value
    );
  }

  if (Number.isNaN(parsed.getTime())) {
    throw new ParseError(
      `Invalid ${fieldName}: "${value}" is not a valid date`,
      'Date',
      value
    );
  }

  if (minDate && parsed < minDate) {
    throw new ValidationError(
      `Invalid ${fieldName}: date must be on or after ${minDate.toISOString()}`,
      fieldName,
      parsed,
      `>= ${minDate.toISOString()}`
    );
  }

  if (maxDate && parsed > maxDate) {
    throw new ValidationError(
      `Invalid ${fieldName}: date must be on or before ${maxDate.toISOString()}`,
      fieldName,
      parsed,
      `<= ${maxDate.toISOString()}`
    );
  }

  return parsed;
}

/**
 * Parses and validates an email address
 * @param {*} value - Value to parse as email
 * @param {string} fieldName - Name of the field (for error messages)
 * @returns {string} Validated email address
 * @throws {ParseError|ValidationError} When parsing or validation fails
 */
function parseEmail(value, fieldName = 'email') {
  if (value === undefined || value === null) {
    throw new ParseError(
      `Cannot parse ${fieldName}: value is ${value === null ? 'null' : 'undefined'}`,
      'Email',
      value
    );
  }

  if (typeof value !== 'string') {
    throw new ParseError(
      `Cannot parse ${fieldName}: expected string but received ${typeof value}`,
      'Email',
      value
    );
  }

  const trimmed = value.trim().toLowerCase();

  if (trimmed === '') {
    throw new ParseError(
      `Cannot parse ${fieldName}: email is empty`,
      'Email',
      value
    );
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmed)) {
    throw new ValidationError(
      `Invalid ${fieldName}: "${value}" is not a valid email address`,
      fieldName,
      value,
      'valid email format'
    );
  }

  return trimmed;
}

/**
 * Safely accesses nested properties with proper error handling
 * @param {Object} obj - Object to access
 * @param {string} path - Dot-separated path to property
 * @param {Object} options - Access options
 * @param {boolean} options.required - Whether the property is required
 * @param {*} options.defaultValue - Default value if property is not found
 * @returns {*} Property value
 * @throws {ParseError} When required property is not found
 */
function getNestedProperty(obj, path, options = {}) {
  const { required = false, defaultValue = undefined } = options;

  if (obj === undefined || obj === null) {
    if (required) {
      throw new ParseError(
        `Cannot access "${path}": object is ${obj === null ? 'null' : 'undefined'}`,
        'Object',
        obj
      );
    }
    return defaultValue;
  }

  if (typeof obj !== 'object') {
    if (required) {
      throw new ParseError(
        `Cannot access "${path}": expected object but received ${typeof obj}`,
        'Object',
        obj
      );
    }
    return defaultValue;
  }

  const parts = path.split('.');
  let current = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (current === undefined || current === null) {
      if (required) {
        const accessedPath = parts.slice(0, i).join('.');
        throw new ParseError(
          `Cannot access "${path}": "${accessedPath}" is ${current === null ? 'null' : 'undefined'}`,
          'Object',
          obj
        );
      }
      return defaultValue;
    }

    current = current[part];
  }

  if ((current === undefined || current === null) && required) {
    throw new ParseError(
      `Required property "${path}" is ${current === null ? 'null' : 'not found'}`,
      'Object',
      obj
    );
  }

  return current !== undefined ? current : defaultValue;
}

module.exports = {
  ParseError,
  ValidationError,
  parseJSON,
  parseNumber,
  parseDate,
  parseEmail,
  getNestedProperty
};
