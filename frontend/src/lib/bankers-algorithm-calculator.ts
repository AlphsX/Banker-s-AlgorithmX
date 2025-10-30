import {
  BankersAlgorithmState,
  AlgorithmStep,
  ResourceRequest,
  SafetyResult,
  RequestResult,
  ValidationError,
} from "@/types/bankers-algorithm";

import {
  calculateNeedMatrix,
  isVectorLessOrEqual,
  addVectors,
  cloneMatrix,
  cloneVector,
  validateMatrixValues,
  validateVectorValues,
  validateAllocationConstraints,
  validateResourceRequest,
  createZeroMatrix,
  createZeroVector,
} from "@/utils/matrix-utils";

export class BankersAlgorithmCalculator {
  /**
   * Calculate Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
   */
  calculateNeedMatrix(max: number[][], allocation: number[][]): number[][] {
    return calculateNeedMatrix(max, allocation);
  }

  /**
   * Safety Algorithm Implementation (Based on C++ BANKER::isSAFESTATE)
   *
   * Algorithm Steps:
   * 1. Initialize Work = Available and Finish[i] = false for all processes
   * 2. Find process Pi such that Finish[i] = false and Need[i] <= Work
   * 3. If found: Work = Work + Allocation[i], Finish[i] = true, repeat step 2
   * 4. If all Finish[i] = true, system is safe; otherwise unsafe
   */
  checkSafety(
    available: number[],
    allocation: number[][],
    need: number[][]
  ): SafetyResult {
    const processCount = allocation.length;

    // Step 1: Initialize Work = Available and Finish[i] = false
    let work = cloneVector(available);
    const finish = Array(processCount).fill(false);

    // Track algorithm execution for step-by-step visualization
    const steps: AlgorithmStep[] = [];
    const safeSequence: string[] = [];

    // Initial state
    steps.push({
      stepNumber: 1,
      description: `Step 1: Initialize Work = Available = [${work.join(
        ", "
      )}], Finish = [${finish.map((f) => (f ? "T" : "F")).join(", ")}]`,
      workVector: cloneVector(work),
      isHighlighted: true,
    });

    let stepNumber = 2;
    let foundProcess = true;
    let iterationCount = 0;
    const maxIterations = processCount * 2; // Prevent infinite loops

    // Step 2: Main algorithm loop - find processes that can finish
    while (foundProcess && iterationCount < maxIterations) {
      foundProcess = false;
      iterationCount++;

      // Check each process to see if it can finish
      for (let i = 0; i < processCount; i++) {
        const processName = `P${i}`;

        // Step 2: Find Pi such that Finish[i] = false and Need[i] <= Work
        if (!finish[i]) {
          const canFinish = isVectorLessOrEqual(need[i], work);

          // Show the comparison step
          steps.push({
            stepNumber: stepNumber++,
            description: `Check ${processName}: Need[${i}] = [${need[i].join(
              ", "
            )}] ${canFinish ? "≤" : ">"} Work = [${work.join(", ")}]`,
            workVector: cloneVector(work),
            processChecked: processName,
            canFinish,
            isHighlighted: canFinish,
          });

          if (canFinish) {
            // Step 3: Process can finish - simulate resource release
            work = addVectors(work, allocation[i]);
            finish[i] = true;
            safeSequence.push(processName);
            foundProcess = true;

            // Show resource release step
            steps.push({
              stepNumber: stepNumber++,
              description: `${processName} finishes and releases resources: Work = Work + Allocation[${i}] = [${work.join(
                ", "
              )}]`,
              workVector: cloneVector(work),
              processChecked: processName,
              canFinish: true,
              isHighlighted: true,
            });

            // Important: Start over from the beginning (like C++ implementation)
            break;
          }
        }
      }
    }

    // Step 4: Check if all processes finished (system safety)
    const isSafe = finish.every((f) => f);

    if (isSafe) {
      steps.push({
        stepNumber: stepNumber,
        description: `Step 4: All processes can finish safely. Safe sequence: ${safeSequence.join(
          " → "
        )}`,
        workVector: cloneVector(work),
        isHighlighted: true,
      });
    } else {
      // Find which processes couldn't finish
      const unfinishedProcesses = finish
        .map((finished, index) => (finished ? null : `P${index}`))
        .filter((p) => p !== null);

      steps.push({
        stepNumber: stepNumber,
        description: `Step 4: System is UNSAFE - Processes ${unfinishedProcesses.join(
          ", "
        )} cannot finish (potential deadlock)`,
        workVector: cloneVector(work),
        isHighlighted: true,
      });
    }

    return {
      isSafe,
      safeSequence: isSafe ? safeSequence : [],
      steps,
      finalFinishState: finish,
    };
  }

  /**
   * Resource Request Algorithm Implementation (Based on C++ BANKER::requestRES)
   *
   * Algorithm Steps:
   * 1. Check if Request[i] <= Need[i] (request doesn't exceed declared maximum)
   * 2. Check if Request[i] <= Available (resources are available)
   * 3. Temporarily allocate resources and check if resulting state is safe
   * 4. If safe, grant request; otherwise, deny and rollback
   */
  processRequest(
    request: ResourceRequest,
    currentState: BankersAlgorithmState
  ): RequestResult {
    const { processId, requestVector } = request;
    const { allocation, max, available, need } = currentState;

    // Validate inputs
    if (!allocation || !max || !available || !need) {
      return {
        canGrant: false,
        errorMessage: "Invalid system state: missing required matrices",
      };
    }

    if (processId < 0 || processId >= currentState.processCount) {
      return {
        canGrant: false,
        errorMessage: `Invalid process ID: ${processId}`,
      };
    }

    // Step 1: Validate request doesn't exceed need
    for (let j = 0; j < requestVector.length; j++) {
      if (requestVector[j] > need[processId][j]) {
        return {
          canGrant: false,
          errorMessage: `Request DENIED: Process P${processId} requested ${requestVector[j]} of resource ${j}, but only needs ${need[processId][j]} (exceeds declared maximum need)`,
        };
      }
    }

    // Step 2: Validate request doesn't exceed available resources
    for (let j = 0; j < requestVector.length; j++) {
      if (requestVector[j] > available[j]) {
        return {
          canGrant: false,
          errorMessage: `Request DENIED: Process P${processId} requested ${requestVector[j]} of resource ${j}, but only ${available[j]} available (insufficient resources)`,
        };
      }
    }

    // Step 3: Temporarily allocate resources (simulation)
    const newAllocation = cloneMatrix(allocation);
    const newAvailable = cloneVector(available);

    // Simulate the allocation
    for (let i = 0; i < requestVector.length; i++) {
      newAllocation[processId][i] += requestVector[i];
      newAvailable[i] -= requestVector[i];
    }

    // Recalculate need matrix after temporary allocation
    const newNeed = this.calculateNeedMatrix(max, newAllocation);

    // Step 4: Check if the new state would be safe
    const safetyResult = this.checkSafety(newAvailable, newAllocation, newNeed);

    if (safetyResult.isSafe) {
      // Request can be granted safely
      const newState: BankersAlgorithmState = {
        ...currentState,
        allocation: newAllocation,
        available: newAvailable,
        need: newNeed,
        finish: safetyResult.finalFinishState,
        safeSequence: safetyResult.safeSequence,
        algorithmSteps: safetyResult.steps,
        isSafe: true,
      };

      return {
        canGrant: true,
        newState,
        simulationSteps: safetyResult.steps,
        errorMessage: `Request GRANTED: Process P${processId} allocated [${requestVector.join(
          ", "
        )}]. System remains in safe state.`,
      };
    } else {
      // Request would lead to unsafe state - deny it
      return {
        canGrant: false,
        errorMessage: `Request DENIED: Granting this request would lead to an UNSAFE state (potential deadlock). Process P${processId} must wait.`,
        simulationSteps: safetyResult.steps,
      };
    }
  }

  /**
   * Validates the entire system state
   */
  validateSystemState(state: BankersAlgorithmState): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate matrix dimensions
    if (state.allocation.length !== state.processCount) {
      errors.push({
        field: "allocation",
        message: "Allocation matrix rows must match process count",
      });
    }

    if (state.max.length !== state.processCount) {
      errors.push({
        field: "max",
        message: "Max matrix rows must match process count",
      });
    }

    if (state.available.length !== state.resourceCount) {
      errors.push({
        field: "available",
        message: "Available vector length must match resource count",
      });
    }

    // Validate matrix values
    errors.push(...validateMatrixValues(state.allocation));
    errors.push(...validateMatrixValues(state.max));
    errors.push(...validateVectorValues(state.available));

    // Validate allocation constraints
    errors.push(...validateAllocationConstraints(state.allocation, state.max));

    return errors;
  }

  /**
   * Creates a default system state with example values
   * Based on classical Banker's Algorithm textbook example (guaranteed safe)
   */
  createDefaultState(): BankersAlgorithmState {
    const processCount = 3;
    const resourceCount = 3;

    // Safe state example from operating systems textbooks
    const allocation = [
      [0, 1, 0], // P0: currently allocated resources
      [2, 0, 0], // P1: currently allocated resources
      [3, 0, 2], // P2: currently allocated resources
    ];

    const max = [
      [7, 5, 3], // P0: maximum resource needs
      [3, 2, 2], // P1: maximum resource needs
      [9, 0, 2], // P2: maximum resource needs
    ];

    // Increased available resources to ensure safety
    const available = [10, 5, 3]; // Available resources: A=10, B=5, C=3

    const need = this.calculateNeedMatrix(max, allocation);

    // Verify this is actually safe
    const safetyResult = this.checkSafety(available, allocation, need);

    return {
      processCount,
      resourceCount,
      allocation,
      max,
      available,
      need,
      finish: Array(processCount).fill(false),
      safeSequence: safetyResult.safeSequence,
      algorithmSteps: safetyResult.steps,
      isCalculating: false,
      isSafe: safetyResult.isSafe,
    };
  }

  /**
   * Creates a fresh system state with zero values (for refresh functionality)
   */
  createFreshState(): BankersAlgorithmState {
    const processCount = 2;
    const resourceCount = 3;

    const allocation = createZeroMatrix(processCount, resourceCount);
    const max = createZeroMatrix(processCount, resourceCount);
    const available = createZeroVector(resourceCount);
    const need = this.calculateNeedMatrix(max, allocation);

    return {
      processCount,
      resourceCount,
      allocation,
      max,
      available,
      need,
      finish: Array(processCount).fill(false),
      safeSequence: [],
      algorithmSteps: [],
      isCalculating: false,
    };
  }

  /**
   * Resizes matrices when process or resource count changes
   */
  resizeMatrices(
    currentState: BankersAlgorithmState,
    newProcessCount: number,
    newResourceCount: number
  ): BankersAlgorithmState {
    // Create new matrices with appropriate dimensions
    const newAllocation = createZeroMatrix(newProcessCount, newResourceCount);
    const newMax = createZeroMatrix(newProcessCount, newResourceCount);
    const newAvailable = createZeroVector(newResourceCount);

    // Copy existing values where possible
    const minProcesses = Math.min(currentState.processCount, newProcessCount);
    const minResources = Math.min(currentState.resourceCount, newResourceCount);

    for (let i = 0; i < minProcesses; i++) {
      for (let j = 0; j < minResources; j++) {
        newAllocation[i][j] = currentState.allocation[i]?.[j] || 0;
        newMax[i][j] = currentState.max[i]?.[j] || 0;
      }
    }

    for (let j = 0; j < minResources; j++) {
      newAvailable[j] = currentState.available[j] || 0;
    }

    const newNeed = this.calculateNeedMatrix(newMax, newAllocation);

    return {
      ...currentState,
      processCount: newProcessCount,
      resourceCount: newResourceCount,
      allocation: newAllocation,
      max: newMax,
      available: newAvailable,
      need: newNeed,
      finish: Array(newProcessCount).fill(false),
      safeSequence: [],
      algorithmSteps: [],
    };
  }

  /**
   * Process Completion Simulation (Based on C++ BANKER::checkPRO)
   * Simulates a process completing its execution and releasing all allocated resources
   */
  completeProcess(
    state: BankersAlgorithmState,
    processId: number
  ): BankersAlgorithmState {
    if (processId < 0 || processId >= state.processCount) {
      throw new Error(`Invalid process ID: ${processId}`);
    }

    if (state.finish[processId]) {
      // Process already completed
      return state;
    }

    // Check if process has completed its task (Need = 0 for all resources)
    const hasCompletedTask = state.need[processId].every((need) => need === 0);

    if (!hasCompletedTask) {
      // Process hasn't finished its task yet
      return state;
    }

    // Simulate process completion and resource release
    const newAvailable = cloneVector(state.available);
    const newAllocation = cloneMatrix(state.allocation);
    const newFinish = [...state.finish];

    // Release all allocated resources back to the system
    for (let j = 0; j < state.resourceCount; j++) {
      newAvailable[j] += state.allocation[processId][j];
      newAllocation[processId][j] = 0;
    }

    // Mark process as finished
    newFinish[processId] = true;

    // Recalculate need matrix
    const newNeed = this.calculateNeedMatrix(state.max, newAllocation);

    // Check safety of new state
    const safetyResult = this.checkSafety(newAvailable, newAllocation, newNeed);

    return {
      ...state,
      allocation: newAllocation,
      available: newAvailable,
      need: newNeed,
      finish: newFinish,
      safeSequence: safetyResult.safeSequence,
      algorithmSteps: safetyResult.steps,
    };
  }

  /**
   * Find Safe Sequence (Based on C++ BANKER::findSAFESEQ)
   * Finds and returns the safe execution sequence if system is safe
   */
  findSafeSequence(state: BankersAlgorithmState): string[] {
    const safetyResult = this.checkSafety(
      state.available,
      state.allocation,
      state.need
    );
    return safetyResult.safeSequence;
  }

  /**
   * Comprehensive System Validation (Based on C++ BANKER::validateDATA)
   * Validates all system constraints and data integrity
   */
  validateSystemData(state: BankersAlgorithmState): ValidationError[] {
    const errors: ValidationError[] = [];

    // Basic dimension validation
    if (state.processCount <= 0) {
      errors.push({
        field: "processCount",
        message: "Process count must be positive",
      });
    }

    if (state.resourceCount <= 0) {
      errors.push({
        field: "resourceCount",
        message: "Resource count must be positive",
      });
    }

    // Matrix dimension validation
    if (state.allocation.length !== state.processCount) {
      errors.push({
        field: "allocation",
        message: `Allocation matrix must have ${state.processCount} rows`,
      });
    }

    if (state.max.length !== state.processCount) {
      errors.push({
        field: "max",
        message: `Maximum matrix must have ${state.processCount} rows`,
      });
    }

    // Resource vector validation
    if (state.available.length !== state.resourceCount) {
      errors.push({
        field: "available",
        message: `Available vector must have ${state.resourceCount} elements`,
      });
    }

    // Validate all values are non-negative
    errors.push(...validateMatrixValues(state.allocation));
    errors.push(...validateMatrixValues(state.max));
    errors.push(...validateVectorValues(state.available));

    // Validate allocation constraints (Allocation <= Maximum)
    errors.push(...validateAllocationConstraints(state.allocation, state.max));

    // Validate resource consistency (total allocated + available should be consistent)
    if (state.allocation.length > 0 && state.allocation[0]) {
      for (let j = 0; j < state.resourceCount; j++) {
        let totalAllocated = 0;
        for (let i = 0; i < state.processCount; i++) {
          if (state.allocation[i] && state.allocation[i][j] !== undefined) {
            totalAllocated += state.allocation[i][j];
          }
        }

        // Note: We can't validate total resources without knowing the initial total
        // This would require additional system information
      }
    }

    return errors;
  }

  /**
   * System Snapshot (Based on C++ BANKER::snapshot)
   * Creates a comprehensive snapshot of current system state
   */
  getSystemSnapshot(state: BankersAlgorithmState): {
    processCount: number;
    resourceCount: number;
    matrices: {
      allocation: number[][];
      maximum: number[][];
      need: number[][];
    };
    vectors: {
      available: number[];
      finish: boolean[];
    };
    safetyInfo: {
      isSafe: boolean;
      safeSequence: string[];
    };
    statistics: {
      completedProcesses: number;
      totalAllocatedResources: number[];
      resourceUtilization: number[];
    };
  } {
    const safetyResult = this.checkSafety(
      state.available,
      state.allocation,
      state.need
    );

    // Calculate statistics
    const completedProcesses = state.finish.filter((f) => f).length;
    const totalAllocatedResources = Array(state.resourceCount).fill(0);

    for (let i = 0; i < state.processCount; i++) {
      for (let j = 0; j < state.resourceCount; j++) {
        totalAllocatedResources[j] += state.allocation[i][j];
      }
    }

    const resourceUtilization = totalAllocatedResources.map((allocated, j) => {
      const total = allocated + state.available[j];
      return total > 0 ? (allocated / total) * 100 : 0;
    });

    return {
      processCount: state.processCount,
      resourceCount: state.resourceCount,
      matrices: {
        allocation: state.allocation,
        maximum: state.max,
        need: state.need,
      },
      vectors: {
        available: state.available,
        finish: state.finish,
      },
      safetyInfo: {
        isSafe: safetyResult.isSafe,
        safeSequence: safetyResult.safeSequence,
      },
      statistics: {
        completedProcesses,
        totalAllocatedResources,
        resourceUtilization,
      },
    };
  }
}
