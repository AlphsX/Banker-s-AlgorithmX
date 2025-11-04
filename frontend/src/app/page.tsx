"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";

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

  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onToggleTheme: toggleDarkMode,
    onFocusInput: focusInput,
    onNewChat: resetAlgorithm, // Repurpose new chat for reset
    onToggleTools: loadDefaultExample, // Load example with Ctrl+Shift+T
  });

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

    // Add a small delay to show loading state
    setTimeout(() => {
      const safetyResult = calculator.checkSafety(
        algorithmState.available,
        algorithmState.allocation,
        algorithmState.need
      );

      setAlgorithmState((prev) => ({
        ...prev,
        finish: safetyResult.finalFinishState,
        safeSequence: safetyResult.safeSequence,
        algorithmSteps: safetyResult.steps,
        isSafe: safetyResult.isSafe,
        isCalculating: false,
        lastUpdated: new Date(),
      }));

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

  // Process resource request with enhanced error handling
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const [requestResult, setRequestResult] = useState<{
    isRequest: boolean;
    wasGranted?: boolean;
    processId?: number;
    requestVector?: number[];
  }>({ isRequest: false });

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
              lastStep.description += `\n\n✅ REQUEST GRANTED: Process P${request.processId} successfully allocated [${request.requestVector.join(", ")}] resources. The system remains in a safe state.`;
            }
          }

          setAlgorithmState({
            ...requestResult.newState,
            algorithmSteps: enhancedSteps,
            lastUpdated: new Date(),
          });
          
          // Set request result state
          setRequestResult({ 
            isRequest: true, 
            wasGranted: true,
            processId: request.processId,
            requestVector: request.requestVector
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
              lastStep.description += `\n\n❌ REQUEST DENIED: Process P${request.processId} request [${request.requestVector.join(", ")}] cannot be granted as it would lead to an unsafe state (potential deadlock).`;
            }
          }

          // Set request result state
          setRequestResult({ 
            isRequest: true, 
            wasGranted: false,
            processId: request.processId,
            requestVector: request.requestVector
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
            setAlgorithmState((prev) => ({
              ...prev,
              algorithmSteps: enhancedSteps,
              safeSequence: [],
              finish: prev.finish.map(() => false),
              isSafe: false,
              lastUpdated: new Date(),
            }));
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
          className={`md:hidden fixed inset-0 z-50 flex transition-opacity duration-300 ${
            isSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
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
                isCollapsed={false}
              />
            </div>

            {/* Mobile Sidebar Footer - Always at bottom */}
            <div className="p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200"
                      style={{
                        backgroundColor: "var(--button-bg, #f3f4f6)",
                        borderColor: "var(--button-border, #e5e7eb)",
                      }}
                    >
                      <User
                        className="h-5 w-5 text-gray-600 mx-auto"
                        style={{ color: "var(--foreground, #4b5563)" }}
                      />
                    </div>
                    <div
                      className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                      style={{ borderColor: "var(--sidebar-bg, #ffffff)" }}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Anonymous
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AnimatedThemeToggler
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isUsingSystemPreference={isUsingSystemPreference}
                    className="btn-hover p-2 rounded-lg transition-colors flex items-center justify-center touch-manipulation min-h-[40px] min-w-[40px]"
                  />
                  <button
                    className="btn-hover w-10 h-10 rounded-full transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  >
                    {isSidebarOpen ? (
                      <ChevronLeft
                        className="h-5 w-5 mx-auto"
                        style={{ color: "var(--text-secondary, #6b7280)" }}
                      />
                    ) : (
                      <ChevronRight
                        className="h-5 w-5 mx-auto"
                        style={{ color: "var(--text-secondary, #6b7280)" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div
          ref={sidebarRef}
          className={`hidden md:flex bg-[#fdfdfd] border-r border-[#f2f2f2] flex-col transition-all duration-300 shadow-sm
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
              isCollapsed={isDesktopSidebarCollapsed}
            />
          </div>

          {/* Sidebar Footer - Always at bottom */}
          <div className="flex-shrink-0 p-4">
            {!isDesktopSidebarCollapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div
                      className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200"
                      style={{
                        backgroundColor: "var(--button-bg, #f3f4f6)",
                        borderColor: "var(--button-border, #e5e7eb)",
                      }}
                    >
                      <User
                        className="h-5 w-5 text-gray-600 mx-auto"
                        style={{ color: "var(--foreground, #4b5563)" }}
                      />
                    </div>
                    <div
                      className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                      style={{ borderColor: "var(--sidebar-bg, #ffffff)" }}
                    ></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Anonymous
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AnimatedThemeToggler
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isUsingSystemPreference={isUsingSystemPreference}
                    className="btn-hover p-2 rounded-lg transition-colors flex items-center justify-center touch-manipulation min-h-[40px] min-w-[40px]"
                  />
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
                    {isDesktopSidebarCollapsed ? (
                      <ChevronRight
                        className="h-5 w-5 mx-auto"
                        style={{ color: "var(--text-secondary, #6b7280)" }}
                      />
                    ) : (
                      <ChevronLeft
                        className="h-5 w-5 mx-auto"
                        style={{ color: "var(--text-secondary, #6b7280)" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative" title="User">
                  <div
                    className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200"
                    style={{
                      backgroundColor: "var(--button-bg, #f3f4f6)",
                      borderColor: "var(--button-border, #e5e7eb)",
                    }}
                  >
                    <User
                      className="h-5 w-5 text-gray-600 mx-auto"
                      style={{ color: "var(--foreground, #4b5563)" }}
                    />
                  </div>
                  <div
                    className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"
                    style={{ borderColor: "var(--sidebar-bg, #ffffff)" }}
                  ></div>
                </div>
                <AnimatedThemeToggler
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                  isUsingSystemPreference={isUsingSystemPreference}
                  className="btn-hover p-2 rounded-lg transition-colors flex items-center justify-center touch-manipulation min-h-[40px] min-w-[40px]"
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
                  {isDesktopSidebarCollapsed ? (
                    <ChevronRight
                      className="h-5 w-5 mx-auto"
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    />
                  ) : (
                    <ChevronLeft
                      className="h-5 w-5 mx-auto"
                      style={{ color: "var(--text-secondary, #6b7280)" }}
                    />
                  )}
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
            className="flex-1 overflow-y-auto bg-white"
            style={{ backgroundColor: "var(--page-bg)" }}
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
