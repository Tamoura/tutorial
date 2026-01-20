/**
 * Async Handler Module
 * Demonstrates proper error handling for async operations and promise rejection handling
 */

/**
 * Custom error class for async operation errors
 */
class AsyncOperationError extends Error {
  constructor(message, operation, originalError = null) {
    super(message);
    this.name = 'AsyncOperationError';
    this.operation = operation;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Wraps an async function with proper error handling
 * Useful for Express route handlers or similar patterns
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Wrapped function with error handling
 */
function asyncWrapper(fn) {
  if (typeof fn !== 'function') {
    throw new Error('asyncWrapper requires a function argument');
  }

  return async function wrappedFunction(...args) {
    try {
      return await fn(...args);
    } catch (error) {
      // If there's a next function (Express middleware pattern), call it
      const next = args.find(arg => typeof arg === 'function' && arg.length >= 1);
      if (next) {
        return next(error);
      }
      throw error;
    }
  };
}

/**
 * Executes an async operation with timeout
 * @param {Promise} promise - Promise to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} operationName - Name of the operation (for error messages)
 * @returns {Promise} Result of the promise
 * @throws {AsyncOperationError} When operation times out
 */
async function withTimeout(promise, timeoutMs, operationName = 'operation') {
  if (!(promise instanceof Promise)) {
    throw new AsyncOperationError(
      'withTimeout requires a Promise as the first argument',
      operationName
    );
  }

  if (typeof timeoutMs !== 'number' || timeoutMs <= 0) {
    throw new AsyncOperationError(
      'withTimeout requires a positive timeout value',
      operationName
    );
  }

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new AsyncOperationError(
        `${operationName} timed out after ${timeoutMs}ms`,
        operationName
      ));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Executes an async operation with retries
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.baseDelay - Base delay in milliseconds (default: 1000)
 * @param {boolean} options.exponentialBackoff - Use exponential backoff (default: true)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @param {Function} options.onRetry - Callback called before each retry
 * @returns {Promise} Result of the async function
 */
async function withRetry(asyncFn, options = {}) {
  if (typeof asyncFn !== 'function') {
    throw new AsyncOperationError(
      'withRetry requires a function argument',
      'retry'
    );
  }

  const {
    maxRetries = 3,
    baseDelay = 1000,
    exponentialBackoff = true,
    shouldRetry = () => true,
    onRetry = null
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn(attempt);
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (attempt === maxRetries || !shouldRetry(error, attempt)) {
        break;
      }

      // Calculate delay
      const delay = exponentialBackoff
        ? Math.min(baseDelay * Math.pow(2, attempt), 30000)
        : baseDelay;

      // Call retry callback if provided
      if (onRetry && typeof onRetry === 'function') {
        try {
          onRetry(error, attempt, delay);
        } catch (callbackError) {
          console.warn('onRetry callback threw an error:', callbackError.message);
        }
      }

      await sleep(delay);
    }
  }

  throw new AsyncOperationError(
    `Operation failed after ${maxRetries + 1} attempts: ${lastError.message}`,
    'retry',
    lastError
  );
}

/**
 * Executes multiple promises in parallel with error handling
 * Unlike Promise.all, this collects all results and errors
 * @param {Array<Promise>} promises - Array of promises to execute
 * @param {Object} options - Options
 * @param {boolean} options.stopOnError - Stop on first error (default: false)
 * @returns {Promise<Object>} Object with results and errors arrays
 */
async function parallelWithErrors(promises, options = {}) {
  if (!Array.isArray(promises)) {
    throw new AsyncOperationError(
      'parallelWithErrors requires an array of promises',
      'parallel'
    );
  }

  const { stopOnError = false } = options;

  if (stopOnError) {
    // Use Promise.all for fail-fast behavior
    try {
      const results = await Promise.all(promises);
      return { results, errors: [] };
    } catch (error) {
      return { results: [], errors: [error] };
    }
  }

  // Use Promise.allSettled to collect all results and errors
  const settled = await Promise.allSettled(promises);

  const results = [];
  const errors = [];

  settled.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      results.push({ index, value: result.value });
    } else {
      errors.push({ index, error: result.reason });
    }
  });

  return { results, errors };
}

/**
 * Executes promises sequentially with error handling
 * @param {Array<Function>} asyncFns - Array of async functions to execute in order
 * @param {Object} options - Options
 * @param {boolean} options.stopOnError - Stop on first error (default: true)
 * @param {Function} options.onProgress - Progress callback
 * @returns {Promise<Array>} Array of results
 */
async function sequentialWithErrors(asyncFns, options = {}) {
  if (!Array.isArray(asyncFns)) {
    throw new AsyncOperationError(
      'sequentialWithErrors requires an array of functions',
      'sequential'
    );
  }

  const { stopOnError = true, onProgress = null } = options;
  const results = [];
  const errors = [];

  for (let i = 0; i < asyncFns.length; i++) {
    const fn = asyncFns[i];

    if (typeof fn !== 'function') {
      const error = new AsyncOperationError(
        `Item at index ${i} is not a function`,
        'sequential'
      );

      if (stopOnError) {
        throw error;
      }

      errors.push({ index: i, error });
      continue;
    }

    try {
      const result = await fn(i, results);
      results.push({ index: i, value: result });

      if (onProgress && typeof onProgress === 'function') {
        try {
          onProgress(i, asyncFns.length, result);
        } catch (callbackError) {
          console.warn('onProgress callback threw an error:', callbackError.message);
        }
      }
    } catch (error) {
      if (stopOnError) {
        throw new AsyncOperationError(
          `Sequential operation failed at index ${i}: ${error.message}`,
          'sequential',
          error
        );
      }

      errors.push({ index: i, error });
    }
  }

  return { results, errors };
}

/**
 * Creates a debounced async function
 * @param {Function} asyncFn - Async function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounceAsync(asyncFn, wait) {
  if (typeof asyncFn !== 'function') {
    throw new Error('debounceAsync requires a function argument');
  }

  if (typeof wait !== 'number' || wait < 0) {
    throw new Error('debounceAsync requires a non-negative wait time');
  }

  let timeoutId = null;
  let pendingPromise = null;
  let pendingResolve = null;
  let pendingReject = null;

  return async function debouncedFunction(...args) {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Create new promise if none pending
    if (!pendingPromise) {
      pendingPromise = new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;
      });
    }

    // Set new timeout
    timeoutId = setTimeout(async () => {
      const resolve = pendingResolve;
      const reject = pendingReject;

      // Reset state before executing
      pendingPromise = null;
      pendingResolve = null;
      pendingReject = null;
      timeoutId = null;

      try {
        const result = await asyncFn(...args);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, wait);

    return pendingPromise;
  };
}

/**
 * Safely handles an async operation, returning a tuple of [error, result]
 * Similar to Go's error handling pattern
 * @param {Promise} promise - Promise to handle
 * @returns {Promise<Array>} Tuple of [error, result]
 */
async function safeAsync(promise) {
  try {
    const result = await promise;
    return [null, result];
  } catch (error) {
    return [error, null];
  }
}

/**
 * Sleep utility
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  AsyncOperationError,
  asyncWrapper,
  withTimeout,
  withRetry,
  parallelWithErrors,
  sequentialWithErrors,
  debounceAsync,
  safeAsync,
  sleep
};
