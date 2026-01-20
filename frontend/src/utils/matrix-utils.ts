/**
 * Matrix and Vector Operations Utility
 * Optimized mathematical operations for the Banker's Algorithm
 * Based on the matrix operations from GreeksforGreeks implementation
 */

import {ValidationError} from '@/types/bankers-algorithm';

/**
 * Creates a matrix filled with zeros
 */
export function createZeroMatrix(rows: number, cols: number): number[][] {
  return Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(0));
}

/**
 * Creates a vector filled with zeros
 */
export function createZeroVector(length: number): number[] {
  return Array(length).fill(0);
}

/**
 * Calculates the Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
 */
export function calculateNeedMatrix(
  max: number[][],
  allocation: number[][],
): number[][] {
  const rows = max.length;
  const cols = max[0]?.length || 0;

  if (allocation.length !== rows || (allocation[0]?.length || 0) !== cols) {
    throw new Error('Matrix dimensions do not match');
  }

  const need: number[][] = [];
  for (let i = 0; i < rows; i++) {
    need[i] = [];
    for (let j = 0; j < cols; j++) {
      need[i][j] = max[i][j] - allocation[i][j];
    }
  }

  return need;
}

/**
 * Checks if vector a is less than or equal to vector b (component-wise)
 */
export function isVectorLessOrEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] > b[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Adds two vectors component-wise
 */
export function addVectors(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error('Vector dimensions do not match');
  }

  return a.map((val, index) => val + b[index]);
}

/**
 * Subtracts vector b from vector a component-wise
 */
export function subtractVectors(a: number[], b: number[]): number[] {
  if (a.length !== b.length) {
    throw new Error('Vector dimensions do not match');
  }

  return a.map((val, index) => val - b[index]);
}

/**
 * Creates a deep copy of a matrix
 */
export function cloneMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => [...row]);
}

/**
 * Creates a deep copy of a vector
 */
export function cloneVector(vector: number[]): number[] {
  return [...vector];
}

/**
 * Validates that all matrix values are non-negative integers
 */
export function validateMatrixValues(matrix: number[][]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const value = matrix[i][j];
      if (!Number.isInteger(value) || value < 0) {
        errors.push({
          field: `matrix[${i}][${j}]`,
          message: `Value must be a non-negative integer, got ${value}`,
        });
      }
    }
  }

  return errors;
}

/**
 * Validates that all vector values are non-negative integers
 */
export function validateVectorValues(vector: number[]): ValidationError[] {
  const errors: ValidationError[] = [];

  for (let i = 0; i < vector.length; i++) {
    const value = vector[i];
    if (!Number.isInteger(value) || value < 0) {
      errors.push({
        field: `vector[${i}]`,
        message: `Value must be a non-negative integer, got ${value}`,
      });
    }
  }

  return errors;
}

/**
 * Validates that Allocation[i][j] <= Max[i][j] for all i, j
 */
export function validateAllocationConstraints(
  allocation: number[][],
  max: number[][],
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (allocation.length !== max.length) {
    errors.push({
      field: 'matrices',
      message: 'Allocation and Max matrices must have the same number of rows',
    });
    return errors;
  }

  for (let i = 0; i < allocation.length; i++) {
    if (allocation[i].length !== max[i].length) {
      errors.push({
        field: `row[${i}]`,
        message:
          'Allocation and Max matrices must have the same number of columns',
      });
      continue;
    }

    for (let j = 0; j < allocation[i].length; j++) {
      if (allocation[i][j] > max[i][j]) {
        errors.push({
          field: `allocation[${i}][${j}]`,
          message: `Allocation (${allocation[i][j]}) cannot exceed Max (${max[i][j]})`,
        });
      }
    }
  }

  return errors;
}

/**
 * Validates a resource request against need and available vectors
 * Implements the validation rules from the Banker's Algorithm
 */
export function validateResourceRequest(
  request: number[],
  need: number[],
  available: number[],
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (request.length !== need.length || request.length !== available.length) {
    errors.push({
      field: 'request',
      message: 'Request vector dimensions do not match system dimensions',
    });
    return errors;
  }

  // Validate request values are non-negative integers
  const requestErrors = validateVectorValues(request);
  errors.push(...requestErrors);

  // Rule 1: Request must not exceed need (Request[i] <= Need[i])
  for (let i = 0; i < request.length; i++) {
    if (request[i] > need[i]) {
      errors.push({
        field: `request[${i}]`,
        message: `Request (${request[i]}) exceeds need (${need[i]}) for resource ${i}`,
      });
    }
  }

  // Rule 2: Request must not exceed available resources (Request[i] <= Available[i])
  for (let i = 0; i < request.length; i++) {
    if (request[i] > available[i]) {
      errors.push({
        field: `request[${i}]`,
        message: `Request (${request[i]}) exceeds available (${available[i]}) for resource ${i}`,
      });
    }
  }

  return errors;
}

/**
 * Calculates the sum of all elements in a vector
 */
export function vectorSum(vector: number[]): number {
  return vector.reduce((sum, value) => sum + value, 0);
}

/**
 * Calculates the sum of each column in a matrix (total allocated per resource)
 */
export function matrixColumnSums(matrix: number[][]): number[] {
  if (matrix.length === 0) return [];

  const cols = matrix[0].length;
  const sums = createZeroVector(cols);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < cols; j++) {
      sums[j] += matrix[i][j];
    }
  }

  return sums;
}

/**
 * Checks if a matrix is rectangular (all rows have the same length)
 */
export function isMatrixRectangular(matrix: number[][]): boolean {
  if (matrix.length === 0) return true;

  const expectedCols = matrix[0].length;
  return matrix.every((row) => row.length === expectedCols);
}

/**
 * Checks if two vectors are equal
 */
export function vectorsEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

/**
 * Checks if two matrices are equal
 */
export function matricesEqual(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  return a.every((row, i) => vectorsEqual(row, b[i]));
}
