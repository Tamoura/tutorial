/**
 * API Client Module
 * Demonstrates proper error handling for network/API operations
 */

/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, statusCode = null, endpoint = null, method = 'GET', originalError = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
    this.method = method;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if error is retryable
   */
  isRetryable() {
    // Network errors and server errors (5xx) are typically retryable
    if (!this.statusCode) return true; // Network errors
    return this.statusCode >= 500 && this.statusCode < 600;
  }
}

/**
 * Custom error class for timeout errors
 */
class TimeoutError extends APIError {
  constructor(endpoint, timeout, method = 'GET') {
    super(
      `Request to "${endpoint}" timed out after ${timeout}ms`,
      null,
      endpoint,
      method
    );
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

/**
 * Custom error class for network errors
 */
class NetworkError extends APIError {
  constructor(message, endpoint, method = 'GET', originalError = null) {
    super(message, null, endpoint, method, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Creates an API client with proper error handling
 * @param {Object} config - Client configuration
 * @param {string} config.baseURL - Base URL for API requests
 * @param {number} config.timeout - Default timeout in milliseconds
 * @param {Object} config.headers - Default headers
 * @param {number} config.maxRetries - Maximum number of retries for failed requests
 * @returns {Object} API client instance
 */
function createAPIClient(config = {}) {
  const {
    baseURL = '',
    timeout = 30000,
    headers = {},
    maxRetries = 3
  } = config;

  // Validate configuration
  if (baseURL && typeof baseURL !== 'string') {
    throw new Error('Invalid configuration: baseURL must be a string');
  }

  if (typeof timeout !== 'number' || timeout <= 0) {
    throw new Error('Invalid configuration: timeout must be a positive number');
  }

  if (typeof maxRetries !== 'number' || maxRetries < 0) {
    throw new Error('Invalid configuration: maxRetries must be a non-negative number');
  }

  /**
   * Makes an HTTP request with error handling and retries
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response data
   */
  async function request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers: requestHeaders = {},
      timeout: requestTimeout = timeout,
      retries = maxRetries
    } = options;

    // Validate endpoint
    if (!endpoint || typeof endpoint !== 'string') {
      throw new APIError(
        'Invalid endpoint: must be a non-empty string',
        null,
        endpoint,
        method
      );
    }

    const url = baseURL ? `${baseURL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}` : endpoint;
    const mergedHeaders = { ...headers, ...requestHeaders };

    // Add JSON content type for requests with body
    if (body && !mergedHeaders['Content-Type']) {
      mergedHeaders['Content-Type'] = 'application/json';
    }

    let lastError = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await executeRequest(url, {
          method,
          headers: mergedHeaders,
          body: body ? JSON.stringify(body) : null,
          timeout: requestTimeout
        });

        return response;
      } catch (error) {
        lastError = error;

        // Don't retry if error is not retryable
        if (error instanceof APIError && !error.isRetryable()) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          break;
        }

        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Executes a single HTTP request
   * @private
   */
  async function executeRequest(url, options) {
    const { method, headers, body, timeout: requestTimeout } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Parse response
      const contentType = response.headers.get('content-type');
      let data;

      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      } catch (parseError) {
        throw new APIError(
          `Failed to parse response from "${url}": ${parseError.message}`,
          response.status,
          url,
          method,
          parseError
        );
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = extractErrorMessage(data, response.status);
        throw new APIError(
          errorMessage,
          response.status,
          url,
          method
        );
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new TimeoutError(url, requestTimeout, method);
      }

      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new NetworkError(
          `Network error: Unable to connect to "${url}". Please check your internet connection.`,
          url,
          method,
          error
        );
      }

      // Re-throw API errors
      if (error instanceof APIError) {
        throw error;
      }

      // Handle unknown errors
      throw new NetworkError(
        `Unexpected error during request to "${url}": ${error.message}`,
        url,
        method,
        error
      );
    }
  }

  /**
   * Extracts error message from response data
   * @private
   */
  function extractErrorMessage(data, statusCode) {
    // Try common error message fields
    if (typeof data === 'object' && data !== null) {
      if (data.message) return data.message;
      if (data.error) return typeof data.error === 'string' ? data.error : data.error.message;
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.map(e => e.message || e).join(', ');
      }
    }

    // Default error messages based on status code
    const statusMessages = {
      400: 'Bad Request: The server could not understand the request',
      401: 'Unauthorized: Authentication is required',
      403: 'Forbidden: You do not have permission to access this resource',
      404: 'Not Found: The requested resource does not exist',
      405: 'Method Not Allowed: This HTTP method is not supported',
      408: 'Request Timeout: The server timed out waiting for the request',
      409: 'Conflict: The request conflicts with the current state',
      422: 'Unprocessable Entity: The request data is invalid',
      429: 'Too Many Requests: Rate limit exceeded. Please try again later',
      500: 'Internal Server Error: Something went wrong on the server',
      502: 'Bad Gateway: The server received an invalid response',
      503: 'Service Unavailable: The server is temporarily unavailable',
      504: 'Gateway Timeout: The server took too long to respond'
    };

    return statusMessages[statusCode] || `HTTP Error ${statusCode}`;
  }

  /**
   * Sleep utility for retry backoff
   * @private
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Return client with HTTP method shortcuts
  return {
    request,
    get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => request(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => request(endpoint, { ...options, method: 'PUT', body }),
    patch: (endpoint, body, options) => request(endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' })
  };
}

module.exports = {
  APIError,
  TimeoutError,
  NetworkError,
  createAPIClient
};
