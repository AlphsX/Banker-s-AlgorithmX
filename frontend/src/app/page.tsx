"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronsRight } from "lucide-react";

// Import existing hooks and utilities
import {
  useDarkMode,
  useSwipeGesture,
  useDynamicFavicon,
  useKeyboardShortcuts,
} from "@/hooks";

import { AnimatedThemeToggler } from "@/components/magicui";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BrowserCompatibilityWarning } from "@/components/ui/browser-compatibility-warning";
import { ToastContainer, useToast } from "@/components/ui";
import { useAppLoading } from "@/hooks/useAppLoading";

// Import Banker's Algorithm types and calculator
import {
  BankersAlgorithmState,
  ResourceRequest,
} from "@/types/bankers-algorithm";
import { BankersAlgorithmCalculator } from "@/lib/bankers-algorithm-calculator";
import {
  SystemControls,
  AlgorithmTable,
  StepByStepResults,
} from "@/components/bankers-algorithm";

// Updated Logo Icon Component for Banker's Algorithm with theme-dependent colors matching favicon
const LogoIcon = ({ className }: { className?: string }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      clipRule="evenodd"
      fill="#000000"
      fillRule="evenodd"
      d="M8.5 0C8.5 0 4.58642 3.74805 3.94122 4.39717C3.86128 4.4776 3.84989 4.60224 3.91398 4.69539C3.97806 4.78854 4.09993 4.82451 4.20557 4.78145L7.90537 3.27345L11.7747 9.36041C11.8406 9.46403 11.9758 9.50133 12.0869 9.44651C12.1979 9.39169 12.2483 9.26276 12.2032 9.1489C11.7103 7.90508 8.5 0 8.5 0ZM6.29304 6.03867C6.35522 5.93334 6.32602 5.79881 6.22554 5.72763C6.12505 5.65645 5.98605 5.67185 5.90418 5.76322C5.12486 6.633 0 12.5 0 12.5C0 12.5 5.18613 13.803 6.03089 13.9939C6.14204 14.0191 6.25587 13.964 6.30355 13.8621C6.35122 13.7603 6.31967 13.6394 6.22796 13.5728L3.1616 11.3431L6.29304 6.03867ZM14.054 7.5893C14.016 7.47964 13.9029 7.4131 13.7867 7.43203C13.6705 7.45096 13.5853 7.5498 13.5853 7.66564V11.3824L6.45275 11.5197C6.32824 11.5221 6.22613 11.6175 6.2173 11.7396C6.20846 11.8618 6.2958 11.9704 6.41871 11.9901C7.68171 12.1927 16 13.5728 16 13.5728C16 13.5728 14.3311 8.38966 14.054 7.5893Z"
      className="dark:fill-white"
    />
  </svg>
);

export default function BankersAlgorithmPage() {
  const { isDarkMode, toggleDarkMode, isUsingSystemPreference } = useDarkMode();
  const { isLoading: appIsLoading } = useAppLoading();
  const { toasts, showSuccess, showError, dismissToast } = useToast();

  // Dynamic favicon based on theme
  useDynamicFavicon(isDarkMode);

  // Sidebar state management
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  // Banker's Algorithm state
  const [algorithmState, setAlgorithmState] = useState<BankersAlgorithmState>(
    () => {
      const calculator = new BankersAlgorithmCalculator();
      return calculator.createDefaultState();
    }
  );

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Initialize calculator - use useMemo to avoid recreating on every render
  const calculator = useMemo(() => new BankersAlgorithmCalculator(), []);
  
  // Track if initial preview has been shown
  const hasShownInitialPreview = useRef(false);

  // Keyboard shortcuts
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
    setIsDesktopSidebarCollapsed((prev) => !prev);
  }, []);

  const focusInput = useCallback(() => {
    // Focus on first input field in the algorithm table
    const firstInput = document.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const resetAlgorithm = useCallback(() => {
    // Preserve current process and resource counts
    const currentProcessCount = algorithmState.processCount;
    const currentResourceCount = algorithmState.resourceCount;
    
    // Create fresh state with preserved counts
    const freshState = calculator.createFreshState();
    const newState = calculator.resizeMatrices(
      freshState,
      currentProcessCount,
      currentResourceCount
    );
    
    setAlgorithmState(newState);
    focusInput();
    showSuccess(
      "System Reset",
      "Matrix values have been reset while preserving process and resource counts.",
      3000
    );
  }, [focusInput, calculator, showSuccess, algorithmState.processCount, algorithmState.resourceCount]);

  // Load default example
  const loadDefaultExample = useCallback(() => {
    const defaultState = calculator.createDefaultState();
    setAlgorithmState(defaultState);
    showSuccess(
      "Example Loaded",
      "Classical Banker's Algorithm example has been loaded successfully.",
      4000
    );
  }, [calculator, showSuccess]);

  // Complete a process (simulate process finishing its task)
  const completeProcess = useCallback(
    (processId: number) => {
      try {
        const newState = calculator.completeProcess(algorithmState, processId);

        if (newState !== algorithmState) {
          setAlgorithmState({
            ...newState,
            lastUpdated: new Date(),
          });

          showSuccess(
            "Process Completed",
            `Process P${processId} has completed execution and released all resources.`,
            5000
          );
        } else {
          showError(
            "Cannot Complete Process",
            `Process P${processId} cannot be completed yet. It still has unfinished tasks.`,
            5000
          );
        }
      } catch (error) {
        showError(
          "Process Completion Error",
          error instanceof Error ? error.message : "Failed to complete process",
          5000
        );
      }
    },
    [algorithmState, calculator, showSuccess, showError]
  );

  // Update process count
  const updateProcessCount = useCallback(
    (newCount: number) => {
      const minCount = 1;
      const maxCount = 10;
      const validCount = Math.max(minCount, Math.min(maxCount, newCount));

      const newState = calculator.resizeMatrices(
        algorithmState,
        validCount,
        algorithmState.resourceCount
      );
      setAlgorithmState(newState);
    },
    [algorithmState, calculator]
  );

  // Update resource count
  const updateResourceCount = useCallback(
    (newCount: number) => {
      const minCount = 1;
      const maxCount = 10;
      const validCount = Math.max(minCount, Math.min(maxCount, newCount));

      const newState = calculator.resizeMatrices(
        algorithmState,
        algorithmState.processCount,
        validCount
      );
      setAlgorithmState(newState);
    },
    [algorithmState, calculator]
  );

  // Update available resources
  const updateAvailable = useCallback(
    (index: number, value: number) => {
      const newAvailable = [...algorithmState.available];
      newAvailable[index] = Math.max(0, value);

      setAlgorithmState((prev) => ({
        ...prev,
        available: newAvailable,
      }));
    },
    [algorithmState.available]
  );

  // Update allocation matrix
  const updateAllocation = useCallback(
    (processIndex: number, resourceIndex: number, value: number) => {
      const newAllocation = algorithmState.allocation.map((row) => [...row]);
      newAllocation[processIndex][resourceIndex] = Math.max(0, value);

      // Recalculate need matrix
      const newNeed = calculator.calculateNeedMatrix(
        algorithmState.max,
        newAllocation
      );

      setAlgorithmState((prev) => ({
        ...prev,
        allocation: newAllocation,
        need: newNeed,
      }));
    },
    [algorithmState.allocation, algorithmState.max, calculator]
  );

  // Update max matrix
  const updateMax = useCallback(
    (processIndex: number, resourceIndex: number, value: number) => {
      const newMax = algorithmState.max.map((row) => [...row]);
      newMax[processIndex][resourceIndex] = Math.max(0, value);

      // Recalculate need matrix
      const newNeed = calculator.calculateNeedMatrix(
        newMax,
        algorithmState.allocation
      );

      setAlgorithmState((prev) => ({
        ...prev,
        max: newMax,
        need: newNeed,
      }));
    },
    [algorithmState.max, algorithmState.allocation, calculator]
  );

  // Check safety with enhanced validation
  const checkSafety = useCallback(() => {
    // First validate the system state
    const validationErrors = calculator.validateSystemData(algorithmState);

    if (validationErrors.length > 0) {
      showError(
        "System Validation Failed",
        `Please fix the following issues: ${validationErrors
          .map((e) => e.message)
          .join(", ")}`,
        8000
      );
      return;
    }

    // Clear previous calculation data before starting new calculation
    setAlgorithmState((prev) => ({ 
      ...prev, 
      isCalculating: true,
      // Clear previous calculation results
      algorithmSteps: [],
      safeSequence: [],
      finish: Array(prev.processCount).fill(false),
      isSafe: undefined,
    }));
    
    // Clear request result since this is just a safety check
    setRequestResult({ isRequest: false });
    
    // Reset step navigation
    setCurrentStepIndex(undefined);
    setStepStates([]);

    // Add a small delay to show loading state
    setTimeout(() => {
      const safetyResult = calculator.checkSafety(
        algorithmState.available,
        algorithmState.allocation,
        algorithmState.need
      );

      // Save original state before updating
      // Note: We don't need to save 'available' because it never changes during navigation
      setOriginalStateBeforeSteps({
        available: [...algorithmState.available], // Keep original available
        allocation: algorithmState.allocation.map(row => [...row]),
        need: algorithmState.need.map(row => [...row]),
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
      
      // Build step states for navigation - track complete state at each step
      const states: Array<{ 
        work: number[]; 
        finish: boolean[];
        allocation: number[][];
        need: number[][];
        available?: number[]; // Not used for safety check, available stays constant
      }> = [];
      let currentWork = [...algorithmState.available];
      let currentFinish = Array(algorithmState.processCount).fill(false);
      let currentAllocation = algorithmState.allocation.map(row => [...row]);
      let currentNeed = algorithmState.need.map(row => [...row]);
      
      safetyResult.steps.forEach((step) => {
        if (step.workVector && step.workVector.length > 0) {
          currentWork = [...step.workVector];
        }
        if (step.processChecked && step.canFinish) {
          const processIndex = parseInt(step.processChecked.replace('P', ''));
          if (!isNaN(processIndex)) {
            currentFinish = [...currentFinish];
            currentFinish[processIndex] = true;
          }
        }
        states.push({
          work: [...currentWork],
          finish: [...currentFinish],
          allocation: currentAllocation.map(row => [...row]),
          need: currentNeed.map(row => [...row]),
          // Don't include available - it should remain constant for safety checks
        });
      });
      
      setStepStates(states);

      // Show result notification
      if (safetyResult.isSafe) {
        showSuccess(
          "System is Safe",
          `Safe execution sequence found: ${safetyResult.safeSequence.join(
            " → "
          )}`,
          6000
        );
      } else {
        showError(
          "System is Unsafe",
          "The current system state could lead to deadlock. Please review resource allocation.",
          8000
        );
      }
    }, 300);
  }, [algorithmState, calculator, showSuccess, showError]);

  // Auto-preview on initial page load (only once)
  useEffect(() => {
    if (!hasShownInitialPreview.current) {
      const runInitialPreview = () => {
        setTimeout(() => {
          checkSafety();
          hasShownInitialPreview.current = true;
        }, 1000);
      };
      
      runInitialPreview();
    }
  }, [checkSafety]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onToggleTheme: toggleDarkMode,
    onCheckSafety: checkSafety, // Check safety with Shift+Enter
  });

  // Process resource request with enhanced error handling
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [requestResult, setRequestResult] = useState<{
    isRequest: boolean;
    wasGranted?: boolean;
    processId?: number;
    requestVector?: number[];
    shouldResetRequest?: boolean;
  }>({ isRequest: false });

  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState<number | undefined>(undefined);
  const [stepStates, setStepStates] = useState<Array<{
    work: number[];
    finish: boolean[];
    allocation: number[][];
    need: number[][];
    available?: number[]; // Optional: only used for request steps
  }>>([]);
  const [originalStateBeforeSteps, setOriginalStateBeforeSteps] = useState<{
    available: number[];
    allocation: number[][];
    need: number[][];
    finish: boolean[];
  } | null>(null);

  // Handle step navigation
  const handleStepChange = useCallback((stepIndex: number | undefined) => {
    setCurrentStepIndex(stepIndex);
    
    // If stepIndex is undefined, reset to final state (exit navigation mode)
    if (stepIndex === undefined) {
      // Restore the original state from before step navigation
      if (originalStateBeforeSteps) {
        setAlgorithmState((prev) => ({
          ...prev,
          available: [...originalStateBeforeSteps.available],
          allocation: originalStateBeforeSteps.allocation.map(row => [...row]),
          need: originalStateBeforeSteps.need.map(row => [...row]),
          finish: [...originalStateBeforeSteps.finish],
        }));
      }
      return;
    }
    
    // Update the UI to reflect the state at this step
    if (stepStates[stepIndex]) {
      const stepState = stepStates[stepIndex];
      setAlgorithmState((prev) => ({
        ...prev,
        // For request steps, update available if it's tracked; otherwise keep original
        available: stepState.available ? [...stepState.available] : prev.available,
        allocation: stepState.allocation.map(row => [...row]),
        need: stepState.need.map(row => [...row]),
        finish: [...stepState.finish],
      }));
    }
  }, [stepStates, originalStateBeforeSteps]);

  const processResourceRequest = useCallback(
    (request: ResourceRequest) => {
      setIsProcessingRequest(true);

      // Clear previous calculation data before starting new request processing
      setAlgorithmState((prev) => ({
        ...prev,
        // Clear previous calculation results
        algorithmSteps: [],
        safeSequence: [],
        finish: Array(prev.processCount).fill(false),
        isSafe: undefined,
      }));
      
      // Reset step navigation
      setCurrentStepIndex(undefined);
      setStepStates([]);

      // Add a small delay to show loading state
      setTimeout(() => {
        const requestResult = calculator.processRequest(
          request,
          algorithmState
        );

        if (requestResult.canGrant && requestResult.newState) {
          // Request can be granted - update state with enhanced final step
          const enhancedSteps = [...(requestResult.simulationSteps || [])];
          
          // Add request result information to the final step
          if (enhancedSteps.length > 0) {
            const lastStep = enhancedSteps[enhancedSteps.length - 1];
            if (lastStep.description.includes("System is SAFE")) {
              lastStep.description += `\n\n[REQUEST GRANTED]: Process P${request.processId} successfully allocated [${request.requestVector.join(", ")}] resources. The system remains in a safe state.`;
            }
          }

          // Save original state before updating for step navigation
          // For granted requests, save the NEW state (after allocation)
          setOriginalStateBeforeSteps({
            available: [...requestResult.newState.available], // New available after allocation
            allocation: requestResult.newState.allocation.map(row => [...row]),
            need: requestResult.newState.need.map(row => [...row]),
            finish: [...requestResult.newState.finish],
          });

          setAlgorithmState({
            ...requestResult.newState,
            algorithmSteps: enhancedSteps,
            lastUpdated: new Date(),
          });
          
          // Build step states for navigation
          const states: Array<{ 
            work: number[]; 
            finish: boolean[];
            allocation: number[][];
            need: number[][];
            available: number[]; // Track available separately for request steps
          }> = [];
          let currentWork = [...requestResult.newState.available];
          let currentFinish = Array(requestResult.newState.processCount).fill(false);
          let currentAllocation = requestResult.newState.allocation.map(row => [...row]);
          let currentNeed = requestResult.newState.need.map(row => [...row]);
          let currentAvailable = [...algorithmState.available]; // Start with original available
          let allocationHappened = false;
          
          enhancedSteps.forEach((step, index) => {
            // Check if this step is where allocation happens (step 3 in request process)
            if (step.description.includes("Temporarily allocate resources") && requestResult.newState) {
              allocationHappened = true;
              currentAvailable = [...requestResult.newState.available]; // Update to new available after allocation
              currentAllocation = requestResult.newState.allocation.map(row => [...row]);
              currentNeed = requestResult.newState.need.map(row => [...row]);
            }
            
            if (step.workVector && step.workVector.length > 0) {
              currentWork = [...step.workVector];
            }
            if (step.processChecked && step.canFinish) {
              const processIndex = parseInt(step.processChecked.replace('P', ''));
              if (!isNaN(processIndex)) {
                currentFinish = [...currentFinish];
                currentFinish[processIndex] = true;
              }
            }
            states.push({
              work: [...currentWork],
              finish: [...currentFinish],
              allocation: currentAllocation.map(row => [...row]),
              need: currentNeed.map(row => [...row]),
              available: [...currentAvailable], // Store the correct available for this step
            });
          });
          
          setStepStates(states);
          
          // Set request result state
          setRequestResult({ 
            isRequest: true, 
            wasGranted: true,
            processId: request.processId,
            requestVector: request.requestVector,
            shouldResetRequest: true, // Signal to reset request panel
          });

          // Show success message with detailed information
          showSuccess(
            "Request Granted",
            requestResult.errorMessage ||
              `Process P${
                request.processId
              } allocated [${request.requestVector.join(
                ", "
              )}]. System remains safe.`,
            6000
          );
        } else {
          // Request cannot be granted - show detailed error with enhanced final step
          const enhancedSteps = [...(requestResult.simulationSteps || [])];
          
          // Add request result information to the final step
          if (enhancedSteps.length > 0) {
            const lastStep = enhancedSteps[enhancedSteps.length - 1];
            if (lastStep.description.includes("System is UNSAFE")) {
              lastStep.description += `\n\n[REQUEST DENIED]: Process P${request.processId} request [${request.requestVector.join(", ")}] cannot be granted as it would lead to an unsafe state (potential deadlock).`;
            }
          }

          // Set request result state
          setRequestResult({ 
            isRequest: true, 
            wasGranted: false,
            processId: request.processId,
            requestVector: request.requestVector,
          });

          showError(
            "Request Denied",
            requestResult.errorMessage ||
              `Process P${
                request.processId
              } request [${request.requestVector.join(
                ", "
              )}] cannot be granted.`,
            8000
          );

          // Show the simulation steps even for denied requests to help user understand why
          if (requestResult.simulationSteps) {
            // Save original state before updating for step navigation
            // Note: We don't need to save 'available' because it never changes during navigation
            setOriginalStateBeforeSteps({
              available: [...algorithmState.available], // Keep original available
              allocation: algorithmState.allocation.map(row => [...row]),
              need: algorithmState.need.map(row => [...row]),
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
            
            // Build step states for navigation
            const states: Array<{ 
              work: number[]; 
              finish: boolean[];
              allocation: number[][];
              need: number[][];
              available?: number[];
            }> = [];
            let currentWork = [...algorithmState.available];
            let currentFinish = Array(algorithmState.processCount).fill(false);
            let currentAllocation = algorithmState.allocation.map(row => [...row]);
            let currentNeed = algorithmState.need.map(row => [...row]);
            let currentAvailable = [...algorithmState.available]; // Start with original available
            
            // For denied requests, we still need to track when allocation would have happened
            enhancedSteps.forEach((step) => {
              // Check if this step is where allocation would happen (step 3 in request process)
              if (step.description.includes("Temporarily allocate resources")) {
                // Extract the new available from the description or calculate it
                // For denied requests, we simulate what would have happened
                const requestVector = request.requestVector;
                currentAvailable = algorithmState.available.map((val, idx) => val - requestVector[idx]);
                // Note: For denied requests, allocation/need don't actually change in the real state
                // but we show what the simulation tried
              }
              
              if (step.workVector && step.workVector.length > 0) {
                currentWork = [...step.workVector];
              }
              if (step.processChecked && step.canFinish) {
                const processIndex = parseInt(step.processChecked.replace('P', ''));
                if (!isNaN(processIndex)) {
                  currentFinish = [...currentFinish];
                  currentFinish[processIndex] = true;
                }
              }
              states.push({
                work: [...currentWork],
                finish: [...currentFinish],
                allocation: currentAllocation.map(row => [...row]),
                need: currentNeed.map(row => [...row]),
                available: [...currentAvailable],
              });
            });
            
            setStepStates(states);
          }
        }

        setIsProcessingRequest(false);
      }, 500);
    },
    [algorithmState, calculator, showSuccess, showError]
  );

  // Setup swipe gestures for mobile sidebar
  const { attachToElement } = useSwipeGesture({
    onSwipeRight: () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsSidebarOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    },
    threshold: 100,
    velocityThreshold: 0.5,
    preventScroll: false,
  });

  // Attach swipe gesture to main container
  useEffect(() => {
    if (mainContainerRef.current) {
      attachToElement(mainContainerRef.current);
    }
  }, [attachToElement]);

  // Detect if content is scrollable and show/hide scroll button
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const checkScrollable = () => {
      const { scrollTop, scrollHeight, clientHeight } = mainContent;
      const isScrollable = scrollHeight > clientHeight;
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrollable && isNotAtBottom);
    };

    // Check on mount and when content changes
    checkScrollable();
    
    // Check on scroll
    mainContent.addEventListener('scroll', checkScrollable);
    
    // Check on resize
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(mainContent);

    return () => {
      mainContent.removeEventListener('scroll', checkScrollable);
      resizeObserver.disconnect();
    };
  }, [algorithmState.algorithmSteps]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // Show loading screen if app is still loading
  if (appIsLoading) {
    return <LoadingScreen isLoading={appIsLoading} />;
  }

  return (
    <>
      {/* Browser Compatibility Warning */}
      <BrowserCompatibilityWarning
        onDismiss={() => {
          /* Browser warning dismissed */
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div
        ref={mainContainerRef}
        className="swipe-container flex h-screen bg-gray-50 text-gray-900 dark:text-gray-50 transition-all duration-300"
        style={{ backgroundColor: "var(--page-bg, #f9fafb)" }}
      >
        {/* Mobile Sidebar Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ease-out ${
            isSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsSidebarOpen(false);
              }
            }}
          ></div>
          <div
            className={`relative w-64 bg-[#fdfdfd] border-r border-[#f2f2f2] flex flex-col z-10 transition-transform duration-300 ease-out shadow-xl ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            style={{
              backgroundColor: "var(--sidebar-bg, #fdfdfd)",
              borderColor: "var(--sidebar-border, #f2f2f2)",
            }}
          >
            {/* Mobile Sidebar Header */}
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  <div
                    className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAlgorithm();
                    }}
                  >
                    <LogoIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile System Controls - Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <SystemControls
                processCount={algorithmState.processCount}
                resourceCount={algorithmState.resourceCount}
                available={algorithmState.available}
                need={algorithmState.need}
                onProcessCountChange={updateProcessCount}
                onResourceCountChange={updateResourceCount}
                onAvailableChange={updateAvailable}
                onRequestSubmit={processResourceRequest}
                isProcessingRequest={isProcessingRequest}
                isCalculating={algorithmState.isCalculating}
                isCollapsed={false}
                shouldResetRequest={requestResult.shouldResetRequest}
                onRequestResetComplete={() => setRequestResult(prev => ({ ...prev, shouldResetRequest: false }))}
              />
            </div>

            {/* Mobile Sidebar Footer - Always at bottom */}
            <div className="p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AnimatedThemeToggler
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isUsingSystemPreference={isUsingSystemPreference}
                    className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center touch-manipulation"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  >
                    <ChevronsRight
                      className={`h-[18px] w-[18px] mx-auto transition-transform duration-200 ${
                        isSidebarOpen ? "rotate-180" : ""
                      }`}
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          ref={sidebarRef}
          className={`hidden md:flex bg-[#fdfdfd] border-r border-[#f2f2f2] flex-col transition-all duration-300 ease-out shadow-sm
          ${
            isDesktopSidebarCollapsed
              ? "w-16 cursor-e-resize"
              : "w-64 cursor-w-resize"
          } overflow-hidden`}
          style={{
            backgroundColor: "var(--sidebar-bg, #fdfdfd)",
            borderColor: "var(--sidebar-border, #f2f2f2)",
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const isInteractiveElement = target.closest(
              "button, a, input, textarea, select"
            );

            if (!isInteractiveElement) {
              e.stopPropagation();
              setIsDesktopSidebarCollapsed((prev) => !prev);
            }
          }}
        >
          {/* Sidebar Header */}
          <div className="p-6">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center w-full ${
                  isDesktopSidebarCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div
                  className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetAlgorithm();
                  }}
                >
                  <LogoIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop System Controls - Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <SystemControls
              processCount={algorithmState.processCount}
              resourceCount={algorithmState.resourceCount}
              available={algorithmState.available}
              need={algorithmState.need}
              onProcessCountChange={updateProcessCount}
              onResourceCountChange={updateResourceCount}
              onAvailableChange={updateAvailable}
              onRequestSubmit={processResourceRequest}
              isProcessingRequest={isProcessingRequest}
              isCalculating={algorithmState.isCalculating}
              isCollapsed={isDesktopSidebarCollapsed}
              shouldResetRequest={requestResult.shouldResetRequest}
              onRequestResetComplete={() => setRequestResult(prev => ({ ...prev, shouldResetRequest: false }))}
            />
          </div>

          {/* Sidebar Footer - Always at bottom */}
          <div className="flex-shrink-0 p-4">
            {!isDesktopSidebarCollapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AnimatedThemeToggler
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isUsingSystemPreference={isUsingSystemPreference}
                    className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center touch-manipulation"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
                    }}
                    title={
                      isDesktopSidebarCollapsed
                        ? "Open sidebar"
                        : "Close sidebar"
                    }
                  >
                    <ChevronsRight
                      className={`h-[18px] w-[18px] mx-auto transition-transform duration-200 ${
                        isDesktopSidebarCollapsed ? "" : "rotate-180"
                      }`}
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <AnimatedThemeToggler
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  isUsingSystemPreference={isUsingSystemPreference}
                  className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center touch-manipulation"
                />
                <button
                  className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDesktopSidebarCollapsed(!isDesktopSidebarCollapsed);
                  }}
                  title={
                    isDesktopSidebarCollapsed ? "Open sidebar" : "Close sidebar"
                  }
                >
                  <ChevronsRight
                    className={`h-[18px] w-[18px] mx-auto transition-transform duration-200 ${
                      isDesktopSidebarCollapsed ? "" : "rotate-180"
                    }`}
                    style={{ color: "var(--text-secondary, #6b7280)" }}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Bar - Clean and minimal */}
          <header
            className="bg-white"
            style={{ backgroundColor: "var(--page-bg)" }}
          >
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  {/* Mobile Menu Toggle */}
                  <button
                    className="btn-hover md:hidden p-2 rounded-full transition-colors flex items-center justify-center touch-manipulation min-h-[44px] min-w-[44px]"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    >
                      <path d="M11.6663 12.6686L11.801 12.6823C12.1038 12.7445 12.3313 13.0125 12.3313 13.3337C12.3311 13.6547 12.1038 13.9229 11.801 13.985L11.6663 13.9987H3.33325C2.96609 13.9987 2.66839 13.7008 2.66821 13.3337C2.66821 12.9664 2.96598 12.6686 3.33325 12.6686H11.6663ZM16.6663 6.00163L16.801 6.0153C17.1038 6.07747 17.3313 6.34546 17.3313 6.66667C17.3313 6.98788 17.1038 7.25586 16.801 7.31803L16.6663 7.33171H3.33325C2.96598 7.33171 2.66821 7.03394 2.66821 6.66667C2.66821 6.2994 2.96598 6.00163 3.33325 6.00163H16.6663Z"></path>
                    </svg>
                  </button>

                  {/* Title */}
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Banker&apos;s Algorithm
                  </h1>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                  {/* Action Buttons */}
                  <button
                    onClick={checkSafety}
                    disabled={
                      algorithmState.isCalculating || isProcessingRequest
                    }
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed text-white dark:text-black rounded-full font-medium transition-colors duration-200 touch-manipulation min-h-[40px]"
                  >
                    {algorithmState.isCalculating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black"></div>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-4"
                      >
                        <polygon points="6 3 20 12 6 21 6 3"></polygon>
                      </svg>
                    )}
                    <span className="text-sm">
                      {algorithmState.isCalculating
                        ? "Analyzing..."
                        : "Check Safety"}
                    </span>
                  </button>

                  <button
                    onClick={resetAlgorithm}
                    disabled={
                      algorithmState.isCalculating || isProcessingRequest
                    }
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full font-medium transition-colors duration-200 touch-manipulation min-h-[40px] disabled:bg-gray-200 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--button-bg, #ffffff)",
                      borderColor: "var(--button-border, #e1e1e1)",
                      color: "var(--foreground)",
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor =
                          "var(--button-bg, #f9fafb)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor =
                          "var(--button-bg, #ffffff)";
                      }
                    }}
                    title="Reset to empty state"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-[2] size-4"
                    >
                      <path
                        d="M4 20V15H4.31241M4.31241 15H9M4.31241 15C5.51251 18.073 8.50203 20.25 12 20.25C15.8582 20.25 19.0978 17.6016 20 14.0236M20 4V9H19.6876M19.6876 9H15M19.6876 9C18.4875 5.92698 15.498 3.75 12 3.75C8.14184 3.75 4.90224 6.3984 4 9.9764"
                        stroke="currentColor"
                      ></path>
                    </svg>
                    <span className="text-sm">Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Algorithm Interface */}
          <div
            ref={mainContentRef}
            className="flex-1 overflow-y-auto bg-white relative"
            style={{ 
              backgroundColor: "var(--page-bg)",
              scrollBehavior: "smooth"
            }}
          >
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* Algorithm Table */}
              <AlgorithmTable
                processCount={algorithmState.processCount}
                resourceCount={algorithmState.resourceCount}
                allocation={algorithmState.allocation}
                max={algorithmState.max}
                need={algorithmState.need}
                finish={algorithmState.finish}
                algorithmSteps={algorithmState.algorithmSteps}
                isCalculating={algorithmState.isCalculating}
                isProcessingRequest={isProcessingRequest}
                currentStepIndex={currentStepIndex}
                onAllocationChange={updateAllocation}
                onMaxChange={updateMax}
              />

              {/* Mobile Action Buttons - Only show on mobile */}
              <div className="sm:hidden flex flex-col gap-3">
                <button
                  onClick={checkSafety}
                  disabled={algorithmState.isCalculating || isProcessingRequest}
                  className="w-full px-6 py-3 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed text-white dark:text-black rounded-full font-medium transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
                >
                  {algorithmState.isCalculating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black"></div>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                    >
                      <polygon points="6 3 20 12 6 21 6 3"></polygon>
                    </svg>
                  )}
                  <span className="text-sm">
                    {algorithmState.isCalculating
                      ? "Calculating..."
                      : "Check Safety"}
                  </span>
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={resetAlgorithm}
                    disabled={
                      algorithmState.isCalculating || isProcessingRequest
                    }
                    className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-medium transition-colors duration-200 flex items-center justify-center space-x-2 touch-manipulation min-h-[48px] disabled:bg-gray-200 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--button-bg, #ffffff)",
                      borderColor: "var(--button-border, #e1e1e1)",
                      color: "var(--foreground)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-[2] size-4"
                    >
                      <path
                        d="M4 20V15H4.31241M4.31241 15H9M4.31241 15C5.51251 18.073 8.50203 20.25 12 20.25C15.8582 20.25 19.0978 17.6016 20 14.0236M20 4V9H19.6876M19.6876 9H15M19.6876 9C18.4875 5.92698 15.498 3.75 12 3.75C8.14184 3.75 4.90224 6.3984 4 9.9764"
                        stroke="currentColor"
                      ></path>
                    </svg>
                    <span className="text-sm">Reset</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step Results */}
              <StepByStepResults
                steps={algorithmState.algorithmSteps}
                safeSequence={algorithmState.safeSequence}
                isCalculating={algorithmState.isCalculating}
                isProcessingRequest={isProcessingRequest}
                isSafe={
                  algorithmState.isSafe ??
                  algorithmState.safeSequence.length > 0
                }
                requestResult={requestResult}
                onStepChange={handleStepChange}
                currentStepIndex={currentStepIndex}
              />
            </div>

            {/* Scroll to Bottom Button */}
            <div 
              className={`fixed right-6 bottom-6 z-30 transition-all duration-300 ease-in-out ${
                showScrollButton 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <button
                onClick={scrollToBottom}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out select-none h-10 w-10 rounded-full shadow-lg hover:shadow-xl hover:scale-110"
                style={{
                  backgroundColor: isDarkMode ? '#292929' : '#ffffff',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode ? '#3a3a3a' : '#e6e6e6',
                  color: isDarkMode ? '#9e9e9e' : '#0d0d0d',
                }}
                type="button"
                aria-label="Scroll to bottom"
                title="Scroll to bottom"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-[2] -mb-0.5"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeLinecap="square"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
