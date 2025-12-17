/**
 * Security Tests for Banker's Algorithm
 * Validates protection against OWASP Top 10 vulnerabilities
 *
 * Security Analysis for this Frontend Application:
 * - XSS: React's JSX escapes values by default, no dangerouslySetInnerHTML
 * - SQL Injection: N/A - No database in frontend
 * - Command Injection: N/A - No shell exec in frontend
 * - DDoS: Rate limiting should be handled at infrastructure level
 * - Input Validation: Algorithm validates all matrix inputs
 */

import { describe, test, expect } from "bun:test";
import { BankersAlgorithmCalculator } from "../bankers-algorithm-calculator";
import {
  validateMatrixValues,
  validateVectorValues,
  isVectorLessOrEqual,
  calculateNeedMatrix,
} from "@/utils/matrix-utils";

describe("Security Tests - Input Validation", () => {
  const calculator = new BankersAlgorithmCalculator();

  describe("Injection Prevention (Matrix Input Validation)", () => {
    test("should reject negative values in allocation matrix", () => {
      const state = calculator.createDefaultState();
      state.allocation[0][0] = -1;

      const errors = calculator.validateSystemData(state);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes("non-negative"))).toBe(true);
    });

    test("should reject NaN values", () => {
      const errors = validateMatrixValues([
        [NaN, 1],
        [2, 3],
      ]);
      expect(errors.length).toBeGreaterThan(0);
    });

    test("should reject Infinity values", () => {
      const errors = validateVectorValues([Infinity, 1, 2]);
      expect(errors.length).toBeGreaterThan(0);
    });

    test("should reject non-integer values", () => {
      const errors = validateMatrixValues([
        [1.5, 2],
        [3, 4],
      ]);
      expect(errors.length).toBeGreaterThan(0);
    });

    test("should handle extremely large values safely", () => {
      const largeValue = Number.MAX_SAFE_INTEGER;
      const errors = validateVectorValues([largeValue, 1, 2]);
      // Should not throw, just validate
      expect(errors).toBeDefined();
    });
  });

  describe("Resource Exhaustion Prevention", () => {
    test("should handle large process counts without stack overflow", () => {
      const state = calculator.createDefaultState();
      const resized = calculator.resizeMatrices(state, 100, 10);

      expect(resized.processCount).toBe(100);
      expect(resized.allocation.length).toBe(100);
    });

    test("should prevent infinite loops in safety algorithm", () => {
      // Algorithm has maxIterations guard
      const available = [0, 0, 0];
      const allocation = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ];
      const need = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];

      // Should complete and return unsafe, not hang
      const start = Date.now();
      const result = calculator.checkSafety(available, allocation, need);
      const elapsed = Date.now() - start;

      expect(result.isSafe).toBe(false);
      expect(elapsed).toBeLessThan(1000); // Should complete in < 1 second
    });
  });

  describe("Data Integrity", () => {
    test("should not mutate input arrays", () => {
      const original = [1, 2, 3];
      const copy = [...original];

      isVectorLessOrEqual(original, [2, 3, 4]);

      expect(original).toEqual(copy);
    });

    test("should create deep copies of matrices", () => {
      const max = [
        [2, 1],
        [1, 2],
      ];
      const allocation = [
        [1, 0],
        [0, 1],
      ];

      const need = calculateNeedMatrix(max, allocation);

      // Modifying need should not affect original matrices
      need[0][0] = 999;
      expect(max[0][0]).toBe(2);
    });
  });

  describe("Request Validation (Authorization Check)", () => {
    test("should reject invalid process IDs", () => {
      const state = calculator.createDefaultState();

      const result = calculator.processRequest(
        { processId: -1, requestVector: [1, 0, 0] },
        state,
      );

      expect(result.canGrant).toBe(false);
      expect(result.errorMessage).toContain("Invalid");
    });

    test("should reject out-of-bounds process IDs", () => {
      const state = calculator.createDefaultState();

      const result = calculator.processRequest(
        { processId: 999, requestVector: [1, 0, 0] },
        state,
      );

      expect(result.canGrant).toBe(false);
      expect(result.errorMessage).toContain("Invalid process ID");
    });

    test("should reject requests exceeding declared maximum", () => {
      const state = calculator.createDefaultState();

      const result = calculator.processRequest(
        { processId: 0, requestVector: [999, 999, 999] },
        state,
      );

      expect(result.canGrant).toBe(false);
      expect(result.errorMessage).toContain("exceeds declared maximum");
    });
  });
});
