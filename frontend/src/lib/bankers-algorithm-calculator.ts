/**
 * Banker's Algorithm Calculator implementation
 */

import {
  BankersAlgorithmState,
  AlgorithmStep,
  ResourceRequest,
  SafetyResult,
  RequestResult,
  ValidationError
} from '@/types/bankers-algorithm';

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
  createZeroVector
} from '@/utils/matrix-utils';

export class BankersAlgorithmCalculator {
  /**
   * Calculate Need matrix: Need[i][j] = Max[i][j] - Allocation[i][j]
   */
  calculateNeedMatrix(max: number[][], allocation: number[][]): number[][] {
    return calculateNeedMatrix(max, allocation);
  }

  /**
   * Safety Algorithm implementation
   * Determines if the system is in a safe state and finds a safe sequence
   */
  checkSafety(
    available: number[],
    allocation: number[][],
    need: number[][]
  ): SafetyResult {
    const processCount = allocation.length;
    
    // Initialize work vector with available resources
    let work = cloneVector(available);
    
    // Initialize finish array - all processes start as unfinished
    const finish = Array(processCount).fill(false);
    
    // Track algorithm steps for visualization
    const steps: AlgorithmStep[] = [];
    const safeSequence: string[] = [];
    
    // Add initial step
    steps.push({
      stepNumber: 1,
      description: `Initialize: Work = Available = [${work.join(', ')}]`,
      workVector: cloneVector(work),
      isHighlighted: true
    });

    let stepNumber = 2;
    let foundProcess = true;
    
    // Continue until no more processes can be found
    while (foundProcess) {
      foundProcess = false;
      
      // Look for a process that can finish
      for (let i = 0; i < processCount; i++) {
        const processName = `P${i}`;
        
        // Check if process is not finished and need <= work
        if (!finish[i] && isVectorLessOrEqual(need[i], work)) {
          // Add step showing the check
          steps.push({
            stepNumber: stepNumber++,
            description: `Check ${processName}: Need[${i}] = [${need[i].join(', ')}] <= Work = [${work.join(', ')}]`,
            workVector: cloneVector(work),
            processChecked: processName,
            canFinish: true,
            isHighlighted: true
          });
          
          // Process can finish - add its allocation to work
          work = addVectors(work, allocation[i]);
          finish[i] = true;
          safeSequence.push(processName);
          foundProcess = true;
          
          // Add step showing the update
          steps.push({
            stepNumber: stepNumber++,
            description: `${processName} can finish. Work = Work + Allocation[${i}] = [${work.join(', ')}]`,
            workVector: cloneVector(work),
            processChecked: processName,
            canFinish: true
          });
          
          break; // Start over from the beginning
        } else if (!finish[i]) {
          // Add step showing failed check
          steps.push({
            stepNumber: stepNumber++,
            description: `Check ${processName}: Need[${i}] = [${need[i].join(', ')}] > Work = [${work.join(', ')}]`,
            workVector: cloneVector(work),
            processChecked: processName,
            canFinish: false
          });
        }
      }
    }
    
    // Check if all processes finished
    const isSafe = finish.every(f => f);
    
    if (isSafe) {
      steps.push({
        stepNumber: stepNumber,
        description: `All processes can finish. Safe sequence: ${safeSequence.join(' → ')}`,
        workVector: cloneVector(work),
        isHighlighted: true
      });
    } else {
      steps.push({
        stepNumber: stepNumber,
        description: 'System is in UNSAFE state - not all processes can finish',
        workVector: cloneVector(work),
        isHighlighted: true
      });
    }
    
    return {
      isSafe,
      safeSequence: isSafe ? safeSequence : [],
      steps,
      finalFinishState: finish
    };
  }

  /**
   * Resource Request Algorithm
   * Processes a resource request and determines if it can be granted safely
   */
  processRequest(
    request: ResourceRequest,
    currentState: BankersAlgorithmState
  ): RequestResult {
    const { processId, requestVector } = request;
    const { allocation, max, available, need } = currentState;
    
    // Validate the request
    const validationErrors = validateResourceRequest(
      requestVector,
      need[processId],
      available
    );
    
    if (validationErrors.length > 0) {
      return {
        canGrant: false,
        errorMessage: validationErrors[0].message
      };
    }
    
    // Create simulation state
    const newAllocation = cloneMatrix(allocation);
    const newAvailable = cloneVector(available);
    
    // Simulate granting the request
    for (let i = 0; i < requestVector.length; i++) {
      newAllocation[processId][i] += requestVector[i];
      newAvailable[i] -= requestVector[i];
    }
    
    // Calculate new need matrix
    const newNeed = this.calculateNeedMatrix(max, newAllocation);
    
    // Check if the new state is safe
    const safetyResult = this.checkSafety(newAvailable, newAllocation, newNeed);
    
    if (safetyResult.isSafe) {
      // Create new state
      const newState: BankersAlgorithmState = {
        ...currentState,
        allocation: newAllocation,
        available: newAvailable,
        need: newNeed,
        finish: safetyResult.finalFinishState,
        safeSequence: safetyResult.safeSequence,
        algorithmSteps: safetyResult.steps
      };
      
      return {
        canGrant: true,
        newState,
        simulationSteps: safetyResult.steps
      };
    } else {
      return {
        canGrant: false,
        errorMessage: 'Request would lead to unsafe state',
        simulationSteps: safetyResult.steps
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
        field: 'allocation',
        message: 'Allocation matrix rows must match process count'
      });
    }
    
    if (state.max.length !== state.processCount) {
      errors.push({
        field: 'max',
        message: 'Max matrix rows must match process count'
      });
    }
    
    if (state.available.length !== state.resourceCount) {
      errors.push({
        field: 'available',
        message: 'Available vector length must match resource count'
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
   */
  createDefaultState(): BankersAlgorithmState {
    const processCount = 2;
    const resourceCount = 3;
    
    const allocation = [
      [7, 0, 2],
      [0, 5, 1]
    ];
    
    const max = [
      [8, 5, 3],
      [1, 5, 4]
    ];
    
    const available = [1, 0, 3];
    
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
      isCalculating: false
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
      isCalculating: false
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
      algorithmSteps: []
    };
  }
}