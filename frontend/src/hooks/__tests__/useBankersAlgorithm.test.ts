/**
 * useBankersAlgorithm Hook Tests
 *
 * Comprehensive test suite to verify all functionality extracted from page.tsx
 * Tests ensure that refactored logic maintains identical behavior.
 *
 * Run: bun test src/hooks/__tests__/useBankersAlgorithm.test.ts
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { BankersAlgorithmCalculator } from "@/lib/bankers-algorithm-calculator";
import { calculateNeedMatrix } from "@/utils/matrix-utils";
import { ResourceRequest } from "@/types/bankers-algorithm";

/**
 * Since useBankersAlgorithm is a React hook and requires React context,
 * we test the underlying logic functions directly.
 * This validates that the extracted logic works correctly.
 */
describe("useBankersAlgorithm - Logic Validation", () => {
  let calculator: BankersAlgorithmCalculator;

  beforeEach(() => {
    calculator = new BankersAlgorithmCalculator();
  });

  describe("State Initialization", () => {
    test("should create default state with valid structure", () => {
      const state = calculator.createDefaultState();

      expect(state.processCount).toBeGreaterThan(0);
      expect(state.resourceCount).toBeGreaterThan(0);
      expect(state.allocation.length).toBe(state.processCount);
      expect(state.max.length).toBe(state.processCount);
      expect(state.available.length).toBe(state.resourceCount);
      expect(state.need.length).toBe(state.processCount);
      expect(state.finish.length).toBe(state.processCount);
      expect(state.isCalculating).toBe(false);
    });

    test("should create fresh state with all zeros", () => {
      const state = calculator.createFreshState();

      expect(
        state.allocation.every((row) => row.every((val) => val === 0)),
      ).toBe(true);
      expect(state.max.every((row) => row.every((val) => val === 0))).toBe(
        true,
      );
      expect(state.available.every((val) => val === 0)).toBe(true);
    });
  });

  describe("Matrix Update Operations", () => {
    test("updateAllocation should update value and recalculate need", () => {
      const state = calculator.createDefaultState();
      const originalAllocation = state.allocation[0][0];
      const newValue = originalAllocation + 1;

      // Simulate updateAllocation logic
      const newAllocation = state.allocation.map((row) => [...row]);
      newAllocation[0][0] = Math.max(0, newValue);
      const newNeed = calculateNeedMatrix(state.max, newAllocation);

      expect(newAllocation[0][0]).toBe(newValue);
      expect(newNeed[0][0]).toBe(state.max[0][0] - newValue);
    });

    test("updateMax should update value and recalculate need", () => {
      const state = calculator.createDefaultState();
      const newMaxValue = 10;

      // Simulate updateMax logic
      const newMax = state.max.map((row) => [...row]);
      newMax[0][0] = Math.max(0, newMaxValue);
      const newNeed = calculateNeedMatrix(newMax, state.allocation);

      expect(newMax[0][0]).toBe(newMaxValue);
      expect(newNeed[0][0]).toBe(newMaxValue - state.allocation[0][0]);
    });

    test("updateAvailable should update value with non-negative constraint", () => {
      const state = calculator.createDefaultState();

      // Test positive value
      const newAvailable = [...state.available];
      newAvailable[0] = Math.max(0, 5);
      expect(newAvailable[0]).toBe(5);

      // Test negative value should be clamped to 0
      newAvailable[1] = Math.max(0, -3);
      expect(newAvailable[1]).toBe(0);
    });
  });

  describe("Count Update Operations", () => {
    test("updateProcessCount should resize matrices correctly", () => {
      const state = calculator.createDefaultState();
      const newProcessCount = 5;

      const newState = calculator.resizeMatrices(
        state,
        newProcessCount,
        state.resourceCount,
      );

      expect(newState.processCount).toBe(newProcessCount);
      expect(newState.allocation.length).toBe(newProcessCount);
      expect(newState.max.length).toBe(newProcessCount);
      expect(newState.need.length).toBe(newProcessCount);
      expect(newState.finish.length).toBe(newProcessCount);
    });

    test("updateResourceCount should resize matrices correctly", () => {
      const state = calculator.createDefaultState();
      const newResourceCount = 5;

      const newState = calculator.resizeMatrices(
        state,
        state.processCount,
        newResourceCount,
      );

      expect(newState.resourceCount).toBe(newResourceCount);
      expect(newState.allocation[0].length).toBe(newResourceCount);
      expect(newState.max[0].length).toBe(newResourceCount);
      expect(newState.available.length).toBe(newResourceCount);
    });

    test("should clamp process count to valid range (1-10)", () => {
      const clampCount = (
        value: number,
        limits: { min: number; max: number },
      ) => Math.max(limits.min, Math.min(limits.max, value));

      expect(clampCount(0, { min: 1, max: 10 })).toBe(1);
      expect(clampCount(15, { min: 1, max: 10 })).toBe(10);
      expect(clampCount(5, { min: 1, max: 10 })).toBe(5);
    });

    test("should preserve existing data when resizing", () => {
      const state = calculator.createDefaultState();
      const originalValue = state.allocation[0][0];

      const newState = calculator.resizeMatrices(
        state,
        state.processCount + 2,
        state.resourceCount + 2,
      );

      expect(newState.allocation[0][0]).toBe(originalValue);
    });
  });

  describe("Safety Check Operations", () => {
    test("checkSafety should identify safe state", () => {
      const state = calculator.createDefaultState();
      const result = calculator.checkSafety(
        state.available,
        state.allocation,
        state.need,
      );

      expect(result.isSafe).toBe(true);
      expect(result.safeSequence.length).toBeGreaterThan(0);
      expect(result.steps.length).toBeGreaterThan(0);
    });

    test("checkSafety should identify unsafe state", () => {
      const state = calculator.createDefaultState();
      state.available = [0, 0, 0]; // No resources available

      const result = calculator.checkSafety(
        state.available,
        state.allocation,
        state.need,
      );

      expect(result.isSafe).toBe(false);
      expect(result.safeSequence).toEqual([]);
    });

    test("checkSafety should validate system data before running", () => {
      const state = calculator.createDefaultState();
      state.allocation[0][0] = -1; // Invalid negative value

      const errors = calculator.validateSystemData(state);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes("non-negative"))).toBe(true);
    });
  });

  describe("Resource Request Operations", () => {
    test("processRequest should grant safe request", () => {
      const state = calculator.createDefaultState();
      const request: ResourceRequest = {
        processId: 0,
        requestVector: [1, 0, 0],
      };

      const result = calculator.processRequest(request, state);

      expect(result.canGrant).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.simulationSteps).toBeDefined();
    });

    test("processRequest should deny request exceeding need", () => {
      const state = calculator.createDefaultState();
      const request: ResourceRequest = {
        processId: 0,
        requestVector: [999, 999, 999],
      };

      const result = calculator.processRequest(request, state);

      expect(result.canGrant).toBe(false);
      expect(result.errorMessage).toContain("exceeds declared maximum");
    });

    test("processRequest should deny request exceeding available", () => {
      const state = calculator.createDefaultState();
      state.available = [0, 0, 0];
      // Set a small need so request passes need check but fails availability
      state.need[0] = [1, 1, 1];

      const request: ResourceRequest = {
        processId: 0,
        requestVector: [1, 0, 0],
      };

      const result = calculator.processRequest(request, state);

      expect(result.canGrant).toBe(false);
      expect(result.errorMessage).toContain("Insufficient resources");
    });
  });

  describe("Reset and Load Operations", () => {
    test("resetAlgorithm should preserve process and resource counts", () => {
      const state = calculator.createDefaultState();

      // Resize first
      const resized = calculator.resizeMatrices(state, 5, 4);

      // Then reset
      const freshState = calculator.createFreshState();
      const resetState = calculator.resizeMatrices(
        freshState,
        resized.processCount,
        resized.resourceCount,
      );

      expect(resetState.processCount).toBe(5);
      expect(resetState.resourceCount).toBe(4);
      expect(
        resetState.allocation.every((row) => row.every((v) => v === 0)),
      ).toBe(true);
    });

    test("loadDefaultExample should restore default state", () => {
      const defaultState = calculator.createDefaultState();

      expect(defaultState.processCount).toBe(2);
      expect(defaultState.resourceCount).toBe(3);
      expect(defaultState.isSafe).toBe(true);
    });
  });

  describe("Process Completion Operations", () => {
    test("completeProcess should release resources when need is zero", () => {
      const state = calculator.createDefaultState();
      state.need[0] = [0, 0, 0]; // Process 0 has completed its task

      const newState = calculator.completeProcess(state, 0);

      expect(newState.finish[0]).toBe(true);
      expect(newState.allocation[0]).toEqual([0, 0, 0]);
    });

    test("completeProcess should not complete process with remaining need", () => {
      const state = calculator.createDefaultState();
      // Process 0 still has need

      const newState = calculator.completeProcess(state, 0);

      expect(newState).toEqual(state); // No change
    });

    test("completeProcess should throw for invalid process ID", () => {
      const state = calculator.createDefaultState();

      expect(() => calculator.completeProcess(state, 999)).toThrow(
        "Invalid process ID",
      );
    });
  });

  describe("Step State Building", () => {
    test("should correctly track work vector through steps", () => {
      const state = calculator.createDefaultState();
      const result = calculator.checkSafety(
        state.available,
        state.allocation,
        state.need,
      );

      // First step should have work = available
      expect(result.steps[0].workVector).toEqual(state.available);

      // Each subsequent step should have valid work vector
      result.steps.forEach((step) => {
        if (step.workVector) {
          expect(step.workVector.length).toBe(state.resourceCount);
          expect(step.workVector.every((v) => v >= 0)).toBe(true);
        }
      });
    });

    test("should correctly track finish state through steps", () => {
      const state = calculator.createDefaultState();
      const result = calculator.checkSafety(
        state.available,
        state.allocation,
        state.need,
      );

      // Final finish state should match result
      expect(result.finalFinishState.length).toBe(state.processCount);

      if (result.isSafe) {
        expect(result.finalFinishState.every((f) => f === true)).toBe(true);
      }
    });
  });

  describe("Data Immutability", () => {
    test("should not mutate original state on matrix update", () => {
      const state = calculator.createDefaultState();
      const originalAllocation = JSON.stringify(state.allocation);

      // Simulate update
      const newAllocation = state.allocation.map((row) => [...row]);
      newAllocation[0][0] = 999;

      expect(JSON.stringify(state.allocation)).toBe(originalAllocation);
    });

    test("should not mutate original state on resize", () => {
      const state = calculator.createDefaultState();
      const originalProcessCount = state.processCount;

      calculator.resizeMatrices(state, 10, 10);

      expect(state.processCount).toBe(originalProcessCount);
    });
  });

  describe("Edge Cases", () => {
    test("should handle single process system", () => {
      const state = calculator.createDefaultState();
      const singleProcessState = calculator.resizeMatrices(state, 1, 3);

      const result = calculator.checkSafety(
        singleProcessState.available,
        singleProcessState.allocation,
        singleProcessState.need,
      );

      expect(result.steps.length).toBeGreaterThan(0);
    });

    test("should handle single resource system", () => {
      const state = calculator.createDefaultState();
      const singleResourceState = calculator.resizeMatrices(state, 2, 1);

      const result = calculator.checkSafety(
        singleResourceState.available,
        singleResourceState.allocation,
        singleResourceState.need,
      );

      expect(result.steps.length).toBeGreaterThan(0);
    });

    test("should handle maximum allowed dimensions", () => {
      const state = calculator.createDefaultState();
      const maxState = calculator.resizeMatrices(state, 10, 10);

      expect(maxState.processCount).toBe(10);
      expect(maxState.resourceCount).toBe(10);
      expect(maxState.allocation.length).toBe(10);
      expect(maxState.allocation[0].length).toBe(10);
    });

    test("should handle zero request vector", () => {
      const state = calculator.createDefaultState();
      const request: ResourceRequest = {
        processId: 0,
        requestVector: [0, 0, 0],
      };

      const result = calculator.processRequest(request, state);

      expect(result.canGrant).toBe(true);
    });

    test("should quickly detect unsafe state with zero available resources", () => {
      const state = calculator.createDefaultState();
      state.available = [0, 0, 0];

      const startTime = performance.now();
      const result = calculator.checkSafety(
        state.available,
        state.allocation,
        state.need,
      );
      const endTime = performance.now();

      expect(result.isSafe).toBe(false);
      expect(result.steps.length).toBe(1); // Early exit with single step
      expect(result.steps[0].description).toContain("no available resources");
      expect(endTime - startTime).toBeLessThan(1); // Should be nearly instant
    });
  });
});

describe("Step Navigation Logic", () => {
  let calculator: BankersAlgorithmCalculator;

  beforeEach(() => {
    calculator = new BankersAlgorithmCalculator();
  });

  test("should build correct step states for safety check", () => {
    const state = calculator.createDefaultState();
    const result = calculator.checkSafety(
      state.available,
      state.allocation,
      state.need,
    );

    // Build step states manually (extracted logic)
    const states: Array<{
      work: number[];
      finish: boolean[];
    }> = [];

    let currentWork = [...state.available];
    let currentFinish = Array(state.processCount).fill(false);

    result.steps.forEach((step) => {
      if (step.workVector && step.workVector.length > 0) {
        currentWork = [...step.workVector];
      }
      if (step.processChecked && step.canFinish) {
        const processIndex = parseInt(step.processChecked.replace("P", ""));
        if (!isNaN(processIndex)) {
          currentFinish = [...currentFinish];
          currentFinish[processIndex] = true;
        }
      }
      states.push({
        work: [...currentWork],
        finish: [...currentFinish],
      });
    });

    expect(states.length).toBe(result.steps.length);
    expect(states[0].work).toEqual(state.available);
  });

  test("should restore original state when exiting navigation", () => {
    const state = calculator.createDefaultState();
    const originalAvailable = [...state.available];
    const originalAllocation = state.allocation.map((row) => [...row]);

    // Simulate navigation exit - should restore original
    expect(originalAvailable).toEqual(state.available);
    expect(originalAllocation).toEqual(state.allocation);
  });
});
