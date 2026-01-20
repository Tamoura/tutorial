/**
 * File Utilities Module
 * Demonstrates proper error handling for file operations
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Custom error class for file operation errors
 */
class FileOperationError extends Error {
  constructor(message, operation, filePath, originalError = null) {
    super(message);
    this.name = 'FileOperationError';
    this.operation = operation;
    this.filePath = filePath;
    this.originalError = originalError;
  }
}

/**
 * Reads a file and returns its contents
 * @param {string} filePath - Path to the file to read
 * @param {string} encoding - File encoding (default: 'utf8')
 * @returns {Promise<string>} File contents
 * @throws {FileOperationError} When file cannot be read
 */
async function readFile(filePath, encoding = 'utf8') {
  if (!filePath || typeof filePath !== 'string') {
    throw new FileOperationError(
      'Invalid file path: path must be a non-empty string',
      'read',
      filePath
    );
  }

  const absolutePath = path.resolve(filePath);

  try {
    const content = await fs.readFile(absolutePath, encoding);
    return content;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new FileOperationError(
        `File not found: "${absolutePath}"`,
        'read',
        absolutePath,
        error
      );
    }
    if (error.code === 'EACCES') {
      throw new FileOperationError(
        `Permission denied: cannot read "${absolutePath}"`,
        'read',
        absolutePath,
        error
      );
    }
    if (error.code === 'EISDIR') {
      throw new FileOperationError(
        `Invalid operation: "${absolutePath}" is a directory, not a file`,
        'read',
        absolutePath,
        error
      );
    }
    throw new FileOperationError(
      `Failed to read file "${absolutePath}": ${error.message}`,
      'read',
      absolutePath,
      error
    );
  }
}

/**
 * Writes content to a file
 * @param {string} filePath - Path to the file to write
 * @param {string|Buffer} content - Content to write
 * @param {Object} options - Write options
 * @returns {Promise<void>}
 * @throws {FileOperationError} When file cannot be written
 */
async function writeFile(filePath, content, options = {}) {
  if (!filePath || typeof filePath !== 'string') {
    throw new FileOperationError(
      'Invalid file path: path must be a non-empty string',
      'write',
      filePath
    );
  }

  if (content === undefined || content === null) {
    throw new FileOperationError(
      'Invalid content: content cannot be null or undefined',
      'write',
      filePath
    );
  }

  const absolutePath = path.resolve(filePath);
  const dir = path.dirname(absolutePath);

  try {
    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(absolutePath, content, options);
  } catch (error) {
    if (error.code === 'EACCES') {
      throw new FileOperationError(
        `Permission denied: cannot write to "${absolutePath}"`,
        'write',
        absolutePath,
        error
      );
    }
    if (error.code === 'ENOSPC') {
      throw new FileOperationError(
        `Disk full: cannot write to "${absolutePath}"`,
        'write',
        absolutePath,
        error
      );
    }
    throw new FileOperationError(
      `Failed to write file "${absolutePath}": ${error.message}`,
      'write',
      absolutePath,
      error
    );
  }
}

/**
 * Checks if a file exists
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} True if file exists
 */
async function fileExists(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  try {
    const stats = await fs.stat(path.resolve(filePath));
    return stats.isFile();
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false;
    }
    // For other errors (permission issues, etc.), we still return false
    // but log the unexpected error
    console.warn(`Unexpected error checking file existence: ${error.message}`);
    return false;
  }
}

/**
 * Safely deletes a file
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<boolean>} True if file was deleted, false if it didn't exist
 * @throws {FileOperationError} When file cannot be deleted
 */
async function deleteFile(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new FileOperationError(
      'Invalid file path: path must be a non-empty string',
      'delete',
      filePath
    );
  }

  const absolutePath = path.resolve(filePath);

  try {
    await fs.unlink(absolutePath);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // File doesn't exist, nothing to delete
    }
    if (error.code === 'EACCES') {
      throw new FileOperationError(
        `Permission denied: cannot delete "${absolutePath}"`,
        'delete',
        absolutePath,
        error
      );
    }
    if (error.code === 'EISDIR') {
      throw new FileOperationError(
        `Invalid operation: "${absolutePath}" is a directory. Use deleteDirectory() instead`,
        'delete',
        absolutePath,
        error
      );
    }
    throw new FileOperationError(
      `Failed to delete file "${absolutePath}": ${error.message}`,
      'delete',
      absolutePath,
      error
    );
  }
}

module.exports = {
  FileOperationError,
  readFile,
  writeFile,
  fileExists,
  deleteFile
};
