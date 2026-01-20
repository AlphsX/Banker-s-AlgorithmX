/**
 * useBankersAlgorithm Hook
 *
 * Consolidates all Banker's Algorithm state and operations.
 * Extracted from page.tsx to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Algorithm state management (allocation, max, available, need matrices)
 * - Safety checking
 * - Resource request processing
 * - Process/resource count management
 * - Matrix value updates
 *
 * @module hooks/useBankersAlgorithm
 */

import {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {
  BankersAlgorithmState,
  ResourceRequest,
} from '@/types/bankers-algorithm';
import {BankersAlgorithmCalculator} from '@/lib/bankers-algorithm-calculator';
import {calculateNeedMatrix} from '@/utils/matrix-utils';

export interface UseBankersAlgorithmReturn {
  algorithmState: BankersAlgorithmState;
  calculator: BankersAlgorithmCalculator;
  isProcessingRequest: boolean;
  requestResult: RequestResultState;
  stepNavigationState: StepNavigationState;

  // Actions
  checkSafety: () => void;
  processResourceRequest: (request: ResourceRequest) => void;
  updateAllocation: (
    processIndex: number,
    resourceIndex: number,
    value: number,
  ) => void;
  updateMax: (
    processIndex: number,
    resourceIndex: number,
    value: number,
  ) => void;
  updateAvailable: (index: number, value: number) => void;
  updateProcessCount: (newCount: number) => void;
  updateResourceCount: (newCount: number) => void;
  resetAlgorithm: () => void;
  loadDefaultExample: () => void;
  completeProcess: (processId: number) => void;
  handleStepChange: (stepIndex: number | undefined) => void;
  setRequestResult: React.Dispatch<React.SetStateAction<RequestResultState>>;
}

export interface RequestResultState {
  isRequest: boolean;
  wasGranted?: boolean;
  processId?: number;
  requestVector?: number[];
  shouldResetRequest?: boolean;
}

export interface StepNavigationState {
  currentStepIndex: number | undefined;
  stepStates: Array<{
    work: number[];
    finish: boolean[];
    allocation: number[][];
    need: number[][];
    available?: number[];
  }>;
  originalStateBeforeSteps: {
    available: number[];
    allocation: number[][];
    need: number[][];
    finish: boolean[];
  } | null;
}

export interface UseBankersAlgorithmOptions {
  onSuccess?: (title: string, message: string, duration?: number) => void;
  onError?: (title: string, message: string, duration?: number) => void;
  autoPreviewOnMount?: boolean;
}

const PROCESS_COUNT_LIMITS = {min: 1, max: 10} as const;
const RESOURCE_COUNT_LIMITS = {min: 1, max: 10} as const;

export function useBankersAlgorithm(
  options: UseBankersAlgorithmOptions = {},
): UseBankersAlgorithmReturn {
  const {onSuccess, onError, autoPreviewOnMount = true} = options;

  // Memoized calculator instance
  const calculator = useMemo(() => new BankersAlgorithmCalculator(), []);

  // Core algorithm state
  const [algorithmState, setAlgorithmState] = useState<BankersAlgorithmState>(
    () => calculator.createDefaultState(),
  );

  // Request processing state
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [requestResult, setRequestResult] = useState<RequestResultState>({
    isRequest: false,
  });

  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState<number | undefined>(
    undefined,
  );
  const [stepStates, setStepStates] = useState<
    Array<{
      work: number[];
      finish: boolean[];
      allocation: number[][];
      need: number[][];
      available?: number[];
    }>
  >([]);
  const [originalStateBeforeSteps, setOriginalStateBeforeSteps] = useState<{
    available: number[];
    allocation: number[][];
    need: number[][];
    finish: boolean[];
  } | null>(null);

  // Track initial preview
  const hasShownInitialPreview = useRef(false);

  /**
   * Clamps a count value within allowed limits
   */
  const clampCount = useCallback(
    (value: number, limits: {min: number; max: number}) =>
      Math.max(limits.min, Math.min(limits.max, value)),
    [],
  );

  /**
   * Builds step states for navigation from algorithm steps
   * Optimized: Uses references for read-only data to reduce memory allocations
   */
  const buildStepStates = useCallback(
    (
      steps: BankersAlgorithmState['algorithmSteps'],
      initialState: {
        available: number[];
        allocation: number[][];
        need: number[][];
        finish: boolean[];
        processCount: number;
      },
      newState?: BankersAlgorithmState,
      isGrantedRequest?: boolean,
    ) => {
      const states: Array<{
        work: number[];
        finish: boolean[];
        allocation: number[][];
        need: number[][];
        available?: number[];
      }> = [];

      // Use shallow copies for tracking, deep clone only when state changes
      let currentWork = initialState.available;
      let currentFinish = new Array(initialState.processCount).fill(false);
      let currentAllocation = initialState.allocation;
      let currentNeed = initialState.need;
      let currentAvailable = initialState.available;

      steps.forEach((step) => {
        // Only clone when allocation actually changes (granted request)
        if (step.description.includes('Temporarily allocate resources')) {
          if (isGrantedRequest && newState) {
            currentAvailable = newState.available;
            currentAllocation = newState.allocation;
            currentNeed = newState.need;
          }
        }

        // Update work vector when it changes
        if (step.workVector && step.workVector.length > 0) {
          currentWork = step.workVector;
        }

        // Update finish state when process completes
        if (step.processChecked && step.canFinish) {
          const processIndex = parseInt(step.processChecked.replace('P', ''));
          if (!isNaN(processIndex)) {
            // Clone finish array only when it changes
            currentFinish = [...currentFinish];
            currentFinish[processIndex] = true;
          }
        }

        // Store references (read-only for UI display)
        states.push({
          work: currentWork,
          finish: currentFinish,
          allocation: currentAllocation,
          need: currentNeed,
          available: currentAvailable,
        });
      });

      return states;
    },
    [],
  );

  /**
   * Updates allocation matrix value
   */
  const updateAllocation = useCallback(
    (processIndex: number, resourceIndex: number, value: number) => {
      setAlgorithmState((prev) => {
        const newAllocation = prev.allocation.map((row) => [...row]);
        newAllocation[processIndex][resourceIndex] = Math.max(0, value);
        const newNeed = calculateNeedMatrix(prev.max, newAllocation);

        return {
          ...prev,
          allocation: newAllocation,
          need: newNeed,
        };
      });
    },
    [],
  );

  /**
   * Updates max matrix value
   */
  const updateMax = useCallback(
    (processIndex: number, resourceIndex: number, value: number) => {
      setAlgorithmState((prev) => {
        const newMax = prev.max.map((row) => [...row]);
        newMax[processIndex][resourceIndex] = Math.max(0, value);
        const newNeed = calculateNeedMatrix(newMax, prev.allocation);

        return {
          ...prev,
          max: newMax,
          need: newNeed,
        };
      });
    },
    [],
  );

  /**
   * Updates available resources
   */
  const updateAvailable = useCallback((index: number, value: number) => {
    setAlgorithmState((prev) => {
      const newAvailable = [...prev.available];
      newAvailable[index] = Math.max(0, value);
      return {...prev, available: newAvailable};
    });
  }, []);

  /**
   * Updates process count with matrix resizing
   */
  const updateProcessCount = useCallback(
    (newCount: number) => {
      const validCount = clampCount(newCount, PROCESS_COUNT_LIMITS);
      setAlgorithmState((prev) =>
        calculator.resizeMatrices(prev, validCount, prev.resourceCount),
      );
    },
    [calculator, clampCount],
  );

  /**
   * Updates resource count with matrix resizing
   */
  const updateResourceCount = useCallback(
    (newCount: number) => {
      const validCount = clampCount(newCount, RESOURCE_COUNT_LIMITS);
      setAlgorithmState((prev) =>
        calculator.resizeMatrices(prev, prev.processCount, validCount),
      );
    },
    [calculator, clampCount],
  );

  /**
   * Resets algorithm to empty state while preserving counts
   */
  const resetAlgorithm = useCallback(() => {
    setAlgorithmState((prev) => {
      const freshState = calculator.createFreshState();
      return calculator.resizeMatrices(
        freshState,
        prev.processCount,
        prev.resourceCount,
      );
    });
    setCurrentStepIndex(undefined);
    setStepStates([]);
    setRequestResult({isRequest: false});
    onSuccess?.(
      'System Reset',
      'Matrix values have been reset while preserving process and resource counts.',
      3000,
    );
  }, [calculator, onSuccess]);

  /**
   * Loads default example data
   */
  const loadDefaultExample = useCallback(() => {
    const defaultState = calculator.createDefaultState();
    setAlgorithmState(defaultState);
    setCurrentStepIndex(undefined);
    setStepStates([]);
    onSuccess?.(
      'Example Loaded',
      "Classical Banker's Algorithm example has been loaded successfully.",
      4000,
    );
  }, [calculator, onSuccess]);

  /**
   * Completes a process and releases its resources
   */
  const completeProcess = useCallback(
    (processId: number) => {
      try {
        const newState = calculator.completeProcess(algorithmState, processId);

        if (newState !== algorithmState) {
          setAlgorithmState({
            ...newState,
            lastUpdated: new Date(),
          });
          onSuccess?.(
            'Process Completed',
            `Process P${processId} has completed execution and released all resources.`,
            5000,
          );
        } else {
          onError?.(
            'Cannot Complete Process',
            `Process P${processId} cannot be completed yet. It still has unfinished tasks.`,
            5000,
          );
        }
      } catch (error) {
        onError?.(
          'Process Completion Error',
          error instanceof Error ? error.message : 'Failed to complete process',
          5000,
        );
      }
    },
    [algorithmState, calculator, onSuccess, onError],
  );

  /**
   * Handles step navigation changes
   * Optimized: Direct assignment for display (read-only in UI)
   */
  const handleStepChange = useCallback(
    (stepIndex: number | undefined) => {
      setCurrentStepIndex(stepIndex);

      if (stepIndex === undefined) {
        // Restore original state when exiting navigation
        if (originalStateBeforeSteps) {
          setAlgorithmState((prev) => ({
            ...prev,
            available: originalStateBeforeSteps.available,
            allocation: originalStateBeforeSteps.allocation,
            need: originalStateBeforeSteps.need,
            finish: originalStateBeforeSteps.finish,
          }));
        }
        return;
      }

      // Update UI to reflect state at this step (read-only references)
      if (stepStates[stepIndex]) {
        const stepState = stepStates[stepIndex];
        setAlgorithmState((prev) => ({
          ...prev,
          available: stepState.available || stepState.work,
          allocation: stepState.allocation,
          need: stepState.need,
          finish: stepState.finish,
        }));
      }
    },
    [stepStates, originalStateBeforeSteps],
  );

  /**
   * Checks system safety and updates state with results
   */
  const checkSafety = useCallback(() => {
    // Validate system state
    const validationErrors = calculator.validateSystemData(algorithmState);
    if (validationErrors.length > 0) {
      onError?.(
        'System Validation Failed',
        `Please fix the following issues: ${validationErrors
          .map((e) => e.message)
          .join(', ')}`,
        8000,
      );
      return;
    }

    // Clear previous state
    setAlgorithmState((prev) => ({
      ...prev,
      isCalculating: true,
      algorithmSteps: [],
      safeSequence: [],
      finish: Array(prev.processCount).fill(false),
      isSafe: undefined,
    }));
    setRequestResult({isRequest: false});
    setCurrentStepIndex(undefined);
    setStepStates([]);

    // Run safety check with delay for UI feedback
    setTimeout(() => {
      const safetyResult = calculator.checkSafety(
        algorithmState.available,
        algorithmState.allocation,
        algorithmState.need,
      );

      // Save original state for navigation
      setOriginalStateBeforeSteps({
        available: [...algorithmState.available],
        allocation: algorithmState.allocation.map((row) => [...row]),
        need: algorithmState.need.map((row) => [...row]),
        finish: [...algorithmState.finish],
      });

      setAlgorithmState((prev) => ({
        ...prev,
        finish: safetyResult.finalFinishState,
        safeSequence: safetyResult.safeSequence,
        algorithmSteps: safetyResult.steps,
        isSafe: safetyResult.isSafe,
        isCalculating: false,
        lastUpdated: new Date(),
      }));

      // Build step states
      const states = buildStepStates(safetyResult.steps, {
        available: algorithmState.available,
        allocation: algorithmState.allocation,
        need: algorithmState.need,
        finish: algorithmState.finish,
        processCount: algorithmState.processCount,
      });
      setStepStates(states);

      // Show result notification
      if (safetyResult.isSafe) {
        onSuccess?.(
          'System is Safe',
          `Safe execution sequence found: ${safetyResult.safeSequence.join(
            ' → ',
          )}`,
          6000,
        );
      } else {
        onError?.(
          'System is Unsafe',
          'The current system state could lead to deadlock. Please review resource allocation.',
          8000,
        );
      }
    }, 300);
  }, [algorithmState, calculator, onSuccess, onError, buildStepStates]);

  /**
   * Processes a resource request
   */
  const processResourceRequest = useCallback(
    (request: ResourceRequest) => {
      setIsProcessingRequest(true);

      // Clear previous state
      setAlgorithmState((prev) => ({
        ...prev,
        algorithmSteps: [],
        safeSequence: [],
        finish: Array(prev.processCount).fill(false),
        isSafe: undefined,
      }));
      setCurrentStepIndex(undefined);
      setStepStates([]);

      setTimeout(() => {
        const result = calculator.processRequest(request, algorithmState);

        if (result.canGrant && result.newState) {
          // Request granted - update state
          const enhancedSteps = [...(result.simulationSteps || [])];

          // Enhance final step with grant message
          if (enhancedSteps.length > 0) {
            const lastStep = enhancedSteps[enhancedSteps.length - 1];
            if (lastStep.description.includes('System is SAFE')) {
              lastStep.description += `\n\n[REQUEST GRANTED]: Process P${
                request.processId
              } successfully allocated [${request.requestVector.join(
                ', ',
              )}] resources. The system remains in a safe state.`;
            }
          }

          setOriginalStateBeforeSteps({
            available: [...result.newState.available],
            allocation: result.newState.allocation.map((row) => [...row]),
            need: result.newState.need.map((row) => [...row]),
            finish: [...result.newState.finish],
          });

          setAlgorithmState({
            ...result.newState,
            algorithmSteps: enhancedSteps,
            lastUpdated: new Date(),
          });

          const states = buildStepStates(
            enhancedSteps,
            {
              available: algorithmState.available,
              allocation: algorithmState.allocation,
              need: algorithmState.need,
              finish: algorithmState.finish,
              processCount: algorithmState.processCount,
            },
            result.newState,
            true,
          );
          setStepStates(states);

          setRequestResult({
            isRequest: true,
            wasGranted: true,
            processId: request.processId,
            requestVector: request.requestVector,
            shouldResetRequest: true,
          });

          onSuccess?.(
            'Request Granted',
            result.errorMessage ||
              `Process P${
                request.processId
              } allocated [${request.requestVector.join(
                ', ',
              )}]. System remains safe.`,
            6000,
          );
        } else {
          // Request denied
          const enhancedSteps = [...(result.simulationSteps || [])];

          if (enhancedSteps.length > 0) {
            const lastStep = enhancedSteps[enhancedSteps.length - 1];
            if (lastStep.description.includes('System is UNSAFE')) {
              lastStep.description += `\n\n[REQUEST DENIED]: Process P${
                request.processId
              } request [${request.requestVector.join(
                ', ',
              )}] cannot be granted as it would lead to an unsafe state (potential deadlock).`;
            }
          }

          setRequestResult({
            isRequest: true,
            wasGranted: false,
            processId: request.processId,
            requestVector: request.requestVector,
          });

          onError?.(
            'Request Denied',
            result.errorMessage ||
              `Process P${
                request.processId
              } request [${request.requestVector.join(
                ', ',
              )}] cannot be granted.`,
            8000,
          );

          if (result.simulationSteps) {
            setOriginalStateBeforeSteps({
              available: [...algorithmState.available],
              allocation: algorithmState.allocation.map((row) => [...row]),
              need: algorithmState.need.map((row) => [...row]),
              finish: [...algorithmState.finish],
            });

            setAlgorithmState((prev) => ({
              ...prev,
              algorithmSteps: enhancedSteps,
              safeSequence: [],
              finish: prev.finish.map(() => false),
              isSafe: false,
              lastUpdated: new Date(),
            }));

            const states = buildStepStates(
              enhancedSteps,
              {
                available: algorithmState.available,
                allocation: algorithmState.allocation,
                need: algorithmState.need,
                finish: algorithmState.finish,
                processCount: algorithmState.processCount,
              },
              undefined,
              false,
            );
            setStepStates(states);
          }
        }

        setIsProcessingRequest(false);
      }, 500);
    },
    [algorithmState, calculator, onSuccess, onError, buildStepStates],
  );

  // Auto-preview on mount
  useEffect(() => {
    if (autoPreviewOnMount && !hasShownInitialPreview.current) {
      const timer = setTimeout(() => {
        checkSafety();
        hasShownInitialPreview.current = true;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPreviewOnMount, checkSafety]);

  return {
    algorithmState,
    calculator,
    isProcessingRequest,
    requestResult,
    stepNavigationState: {
      currentStepIndex,
      stepStates,
      originalStateBeforeSteps,
    },

    checkSafety,
    processResourceRequest,
    updateAllocation,
    updateMax,
    updateAvailable,
    updateProcessCount,
    updateResourceCount,
    resetAlgorithm,
    loadDefaultExample,
    completeProcess,
    handleStepChange,
    setRequestResult,
  };
}
