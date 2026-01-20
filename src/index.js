/**
 * Error Handling Tutorial
 *
 * This file demonstrates how to use the error handling utilities
 * and best practices for error handling in JavaScript/Node.js applications.
 */

const {
  FileOperationError,
  readFile,
  writeFile,
  fileExists,
  deleteFile
} = require('./utils/fileUtils');

const {
  ParseError,
  ValidationError,
  parseJSON,
  parseNumber,
  parseDate,
  parseEmail,
  getNestedProperty
} = require('./utils/dataParser');

const {
  APIError,
  TimeoutError,
  NetworkError,
  createAPIClient
} = require('./utils/apiClient');

const {
  AsyncOperationError,
  asyncWrapper,
  withTimeout,
  withRetry,
  parallelWithErrors,
  sequentialWithErrors,
  safeAsync,
  sleep
} = require('./utils/asyncHandler');

/**
 * Example: File Operations with Error Handling
 */
async function fileOperationsExample() {
  console.log('\n=== File Operations Example ===\n');

  // Example 1: Reading a file that might not exist
  try {
    const content = await readFile('./config.json');
    console.log('Config loaded successfully');
  } catch (error) {
    if (error instanceof FileOperationError) {
      console.log(`File operation failed: ${error.message}`);
      console.log(`  Operation: ${error.operation}`);
      console.log(`  Path: ${error.filePath}`);
    } else {
      throw error; // Re-throw unexpected errors
    }
  }

  // Example 2: Writing a file with proper error handling
  try {
    await writeFile('./output/results.txt', 'Hello, World!');
    console.log('File written successfully');
  } catch (error) {
    if (error instanceof FileOperationError) {
      console.log(`Failed to write file: ${error.message}`);
    }
  }

  // Example 3: Check if file exists before reading
  const exists = await fileExists('./data.json');
  if (exists) {
    const data = await readFile('./data.json');
    console.log('Data loaded');
  } else {
    console.log('Data file not found, using defaults');
  }
}

/**
 * Example: Data Parsing with Validation
 */
function dataParsingExample() {
  console.log('\n=== Data Parsing Example ===\n');

  // Example 1: Parsing JSON with detailed errors
  const invalidJson = '{"name": "John", age: 30}'; // Missing quotes around age
  try {
    const data = parseJSON(invalidJson, 'user data');
  } catch (error) {
    if (error instanceof ParseError) {
      console.log(`Parse error: ${error.message}`);
      console.log(`  Data type: ${error.dataType}`);
    }
  }

  // Example 2: Parsing numbers with validation
  try {
    const age = parseNumber('25', 'age', { min: 0, max: 150, allowFloat: false });
    console.log(`Valid age: ${age}`);

    // This will throw a ValidationError
    const invalidAge = parseNumber('200', 'age', { min: 0, max: 150 });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`Validation failed: ${error.message}`);
      console.log(`  Field: ${error.field}`);
      console.log(`  Constraint: ${error.constraint}`);
    }
  }

  // Example 3: Parsing and validating email
  try {
    const email = parseEmail('user@example.com', 'contact email');
    console.log(`Valid email: ${email}`);

    const invalidEmail = parseEmail('not-an-email', 'contact email');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`Invalid email: ${error.message}`);
    }
  }

  // Example 4: Safe nested property access
  const userData = {
    user: {
      profile: {
        name: 'John'
      }
    }
  };

  const name = getNestedProperty(userData, 'user.profile.name', { required: true });
  console.log(`User name: ${name}`);

  const nickname = getNestedProperty(userData, 'user.profile.nickname', {
    defaultValue: 'N/A'
  });
  console.log(`Nickname: ${nickname}`);

  try {
    const missingRequired = getNestedProperty(userData, 'user.settings.theme', {
      required: true
    });
  } catch (error) {
    if (error instanceof ParseError) {
      console.log(`Required property missing: ${error.message}`);
    }
  }
}

/**
 * Example: API Client with Error Handling
 */
async function apiClientExample() {
  console.log('\n=== API Client Example ===\n');

  const api = createAPIClient({
    baseURL: 'https://api.example.com',
    timeout: 5000,
    maxRetries: 2
  });

  // Example 1: Making a request with error handling
  try {
    const users = await api.get('/users');
    console.log('Users loaded:', users.length);
  } catch (error) {
    if (error instanceof TimeoutError) {
      console.log(`Request timed out: ${error.message}`);
    } else if (error instanceof NetworkError) {
      console.log(`Network error: ${error.message}`);
    } else if (error instanceof APIError) {
      console.log(`API error (${error.statusCode}): ${error.message}`);
      if (error.isRetryable()) {
        console.log('This error is retryable - consider trying again later');
      }
    }
  }

  // Example 2: POST request with body
  try {
    const newUser = await api.post('/users', {
      name: 'Jane Doe',
      email: 'jane@example.com'
    });
    console.log('User created:', newUser.id);
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 422) {
      console.log('Validation error from API:', error.message);
    }
  }
}

/**
 * Example: Async Operations with Error Handling
 */
async function asyncOperationsExample() {
  console.log('\n=== Async Operations Example ===\n');

  // Example 1: Operation with timeout
  try {
    const result = await withTimeout(
      slowOperation(),
      1000,
      'slow operation'
    );
    console.log('Operation completed:', result);
  } catch (error) {
    if (error instanceof AsyncOperationError) {
      console.log(`Async operation failed: ${error.message}`);
    }
  }

  // Example 2: Operation with retries
  let attemptCount = 0;
  try {
    const result = await withRetry(
      async (attempt) => {
        attemptCount++;
        console.log(`Attempt ${attempt + 1}...`);
        if (attempt < 2) {
          throw new Error('Temporary failure');
        }
        return 'Success!';
      },
      {
        maxRetries: 3,
        baseDelay: 100,
        onRetry: (error, attempt, delay) => {
          console.log(`Retrying in ${delay}ms due to: ${error.message}`);
        }
      }
    );
    console.log(`Operation succeeded after ${attemptCount} attempts: ${result}`);
  } catch (error) {
    console.log(`Operation failed after all retries: ${error.message}`);
  }

  // Example 3: Parallel operations with error collection
  const operations = [
    Promise.resolve('Result 1'),
    Promise.reject(new Error('Operation 2 failed')),
    Promise.resolve('Result 3'),
    Promise.reject(new Error('Operation 4 failed'))
  ];

  const { results, errors } = await parallelWithErrors(operations);
  console.log(`Parallel operations: ${results.length} succeeded, ${errors.length} failed`);
  results.forEach(r => console.log(`  Success at index ${r.index}: ${r.value}`));
  errors.forEach(e => console.log(`  Error at index ${e.index}: ${e.error.message}`));

  // Example 4: Safe async pattern (Go-style)
  const [error, data] = await safeAsync(fetchData());
  if (error) {
    console.log('Failed to fetch data:', error.message);
  } else {
    console.log('Data fetched:', data);
  }
}

/**
 * Helper: Simulates a slow operation
 */
async function slowOperation() {
  await sleep(2000);
  return 'completed';
}

/**
 * Helper: Simulates fetching data
 */
async function fetchData() {
  await sleep(100);
  return { id: 1, name: 'Example Data' };
}

/**
 * Main entry point
 */
async function main() {
  console.log('========================================');
  console.log('   Error Handling Tutorial Examples');
  console.log('========================================');

  try {
    // Run examples
    await fileOperationsExample();
    dataParsingExample();
    await apiClientExample();
    await asyncOperationsExample();

    console.log('\n========================================');
    console.log('   All examples completed!');
    console.log('========================================\n');
  } catch (error) {
    console.error('Unexpected error in main:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  // Export all utilities for use as a library
  // File utilities
  FileOperationError,
  readFile,
  writeFile,
  fileExists,
  deleteFile,
  // Data parser utilities
  ParseError,
  ValidationError,
  parseJSON,
  parseNumber,
  parseDate,
  parseEmail,
  getNestedProperty,
  // API client utilities
  APIError,
  TimeoutError,
  NetworkError,
  createAPIClient,
  // Async handler utilities
  AsyncOperationError,
  asyncWrapper,
  withTimeout,
  withRetry,
  parallelWithErrors,
  sequentialWithErrors,
  safeAsync,
  sleep
};
