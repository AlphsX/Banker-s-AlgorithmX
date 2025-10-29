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
import { BankersAlgorithmState, ResourceRequest } from "@/types/bankers-algorithm";
import { BankersAlgorithmCalculator } from "@/lib/bankers-algorithm-calculator";
import { SystemControls, AlgorithmTable, StepByStepResults } from "@/components/bankers-algorithm";

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
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);

  // Banker's Algorithm state
  const [algorithmState, setAlgorithmState] = useState<BankersAlgorithmState>(() => {
    const calculator = new BankersAlgorithmCalculator();
    return calculator.createDefaultState();
  });

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Initialize calculator - use useMemo to avoid recreating on every render
  const calculator = useMemo(() => new BankersAlgorithmCalculator(), []);

  // Keyboard shortcuts
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
    setIsDesktopSidebarCollapsed((prev) => !prev);
  }, []);

  const focusInput = useCallback(() => {
    // Focus on first input field in the algorithm table
    const firstInput = document.querySelector('input[type="number"]') as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const resetAlgorithm = useCallback(() => {
    const newState = calculator.createFreshState();
    setAlgorithmState(newState);
    focusInput();
  }, [focusInput, calculator]);

  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onToggleTheme: toggleDarkMode,
    onFocusInput: focusInput,
    onNewChat: resetAlgorithm, // Repurpose new chat for reset
    onToggleTools: () => {}, // Not used in this context
  });



  // Update process count
  const updateProcessCount = useCallback((newCount: number) => {
    const minCount = 1;
    const maxCount = 10;
    const validCount = Math.max(minCount, Math.min(maxCount, newCount));
    
    const newState = calculator.resizeMatrices(
      algorithmState,
      validCount,
      algorithmState.resourceCount
    );
    setAlgorithmState(newState);
  }, [algorithmState, calculator]);

  // Update resource count
  const updateResourceCount = useCallback((newCount: number) => {
    const minCount = 1;
    const maxCount = 10;
    const validCount = Math.max(minCount, Math.min(maxCount, newCount));
    
    const newState = calculator.resizeMatrices(
      algorithmState,
      algorithmState.processCount,
      validCount
    );
    setAlgorithmState(newState);
  }, [algorithmState, calculator]);

  // Update available resources
  const updateAvailable = useCallback((index: number, value: number) => {
    const newAvailable = [...algorithmState.available];
    newAvailable[index] = Math.max(0, value);
    
    setAlgorithmState(prev => ({
      ...prev,
      available: newAvailable
    }));
  }, [algorithmState.available]);

  // Update allocation matrix
  const updateAllocation = useCallback((processIndex: number, resourceIndex: number, value: number) => {
    const newAllocation = algorithmState.allocation.map(row => [...row]);
    newAllocation[processIndex][resourceIndex] = Math.max(0, value);
    
    // Recalculate need matrix
    const newNeed = calculator.calculateNeedMatrix(algorithmState.max, newAllocation);
    
    setAlgorithmState(prev => ({
      ...prev,
      allocation: newAllocation,
      need: newNeed
    }));
  }, [algorithmState.allocation, algorithmState.max, calculator]);

  // Update max matrix
  const updateMax = useCallback((processIndex: number, resourceIndex: number, value: number) => {
    const newMax = algorithmState.max.map(row => [...row]);
    newMax[processIndex][resourceIndex] = Math.max(0, value);
    
    // Recalculate need matrix
    const newNeed = calculator.calculateNeedMatrix(newMax, algorithmState.allocation);
    
    setAlgorithmState(prev => ({
      ...prev,
      max: newMax,
      need: newNeed
    }));
  }, [algorithmState.max, algorithmState.allocation, calculator]);

  // Check safety
  const checkSafety = useCallback(() => {
    setAlgorithmState(prev => ({ ...prev, isCalculating: true }));
    
    // Add a small delay to show loading state
    setTimeout(() => {
      const safetyResult = calculator.checkSafety(
        algorithmState.available,
        algorithmState.allocation,
        algorithmState.need
      );
      
      setAlgorithmState(prev => ({
        ...prev,
        finish: safetyResult.finalFinishState,
        safeSequence: safetyResult.safeSequence,
        algorithmSteps: safetyResult.steps,
        isCalculating: false
      }));
    }, 300);
  }, [algorithmState.available, algorithmState.allocation, algorithmState.need, calculator]);

  // Process resource request
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  
  const processResourceRequest = useCallback((request: ResourceRequest) => {
    setIsProcessingRequest(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      const requestResult = calculator.processRequest(request, algorithmState);
      
      if (requestResult.canGrant && requestResult.newState) {
        // Request can be granted - update state
        setAlgorithmState(requestResult.newState);
        
        // Show success message
        showSuccess(
          'Request Granted',
          `Process P${request.processId} request [${request.requestVector.join(', ')}] has been granted successfully. System remains in safe state.`,
          6000
        );
      } else {
        // Request cannot be granted - show error
        showError(
          'Request Denied',
          `Process P${request.processId} request [${request.requestVector.join(', ')}] cannot be granted: ${requestResult.errorMessage}`,
          8000
        );
        
        // Show the simulation steps even for denied requests to help user understand why
        if (requestResult.simulationSteps) {
          setAlgorithmState(prev => ({
            ...prev,
            algorithmSteps: requestResult.simulationSteps || [],
            safeSequence: [],
            finish: prev.finish.map(() => false)
          }));
        }
      }
      
      setIsProcessingRequest(false);
    }, 500); // Slightly longer delay to show the processing state
  }, [algorithmState, calculator, showSuccess, showError]);

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
        className="swipe-container flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-1000 dark:via-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-50 transition-all duration-500"
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
            className={`relative w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/30 dark:border-gray-700/30 flex flex-col z-10 transition-transform duration-300 ease-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Mobile Sidebar Header */}
            <div className="p-6">
              <div className="flex items-center justify-start">
                <div className="relative">
                  <div
                    className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAlgorithm();
                    }}
                  >
                    <LogoIcon className="h-6 w-6 mx-auto" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile System Controls */}
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

            {/* Mobile Sidebar Footer - Always at bottom */}
            <div className="p-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-9 w-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
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
                <div className="flex items-center space-x-1">
                  <button
                    className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSidebarOpen(!isSidebarOpen);
                    }}
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  >
                    {isSidebarOpen ? (
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
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
          className={`hidden md:flex bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r 
          border-gray-200/30 dark:border-gray-700/30 flex-col transition-all duration-300 
          ${
            isDesktopSidebarCollapsed
              ? "w-16 cursor-e-resize"
              : "w-64 cursor-w-resize"
          } overflow-hidden`}
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
          <div className="p-4">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center w-full ${
                  isDesktopSidebarCollapsed ? "justify-center" : "justify-start"
                }`}
              >
                <div className="relative">
                  <div
                    className="flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetAlgorithm();
                    }}
                  >
                    <LogoIcon className="h-6 w-6 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop System Controls */}
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

          {/* Sidebar Footer - Always at bottom */}
          <div className="mt-auto p-4">
            {!isDesktopSidebarCollapsed ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-9 w-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      User
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors flex items-center justify-center"
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
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    ) : (
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-3">
                <div className="relative" title="User">
                  <div className="h-9 w-9 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                    <User className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors flex items-center justify-center"
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
                      <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    ) : (
                      <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 mx-auto" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Bar - Enhanced responsive design */}
          <header className="relative">
            <div className="relative z-10 px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
                  {/* Mobile Menu Toggle */}
                  <button
                    className="md:hidden p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200 shadow hover:shadow-md flex items-center justify-center touch-manipulation min-h-[44px] min-w-[44px]"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-700 dark:text-gray-200"
                    >
                      <path d="M11.6663 12.6686L11.801 12.6823C12.1038 12.7445 12.3313 13.0125 12.3313 13.3337C12.3311 13.6547 12.1038 13.9229 11.801 13.985L11.6663 13.9987H3.33325C2.96609 13.9987 2.66839 13.7008 2.66821 13.3337C2.66821 12.9664 2.96598 12.6686 3.33325 12.6686H11.6663ZM16.6663 6.00163L16.801 6.0153C17.1038 6.07747 17.3313 6.34546 17.3313 6.66667C17.3313 6.98788 17.1038 7.25586 16.801 7.31803L16.6663 7.33171H3.33325C2.96598 7.33171 2.66821 7.03394 2.66821 6.66667C2.66821 6.2994 2.96598 6.00163 3.33325 6.00163H16.6663Z"></path>
                    </svg>
                  </button>

                  <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                    <span className="hidden sm:inline">Banker&apos;s Algorithm Calculator</span>
                    <span className="sm:hidden">Banker&apos;s Algorithm</span>
                  </h1>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <AnimatedThemeToggler
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isUsingSystemPreference={isUsingSystemPreference}
                    className="p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-200/40 dark:border-gray-700/40 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200 shadow hover:shadow-md flex items-center justify-center touch-manipulation min-h-[44px] min-w-[44px]"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Algorithm Interface */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Algorithm Table */}
              <AlgorithmTable
                processCount={algorithmState.processCount}
                resourceCount={algorithmState.resourceCount}
                allocation={algorithmState.allocation}
                max={algorithmState.max}
                need={algorithmState.need}
                finish={algorithmState.finish}
                onAllocationChange={updateAllocation}
                onMaxChange={updateMax}
              />

              {/* Action Buttons - Enhanced mobile layout */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={checkSafety}
                  disabled={algorithmState.isCalculating || isProcessingRequest}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow hover:shadow-md flex items-center justify-center space-x-2 touch-manipulation min-h-[48px]"
                >
                  {algorithmState.isCalculating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span className="text-sm sm:text-base">{algorithmState.isCalculating ? 'Calculating...' : 'Check Safety'}</span>
                </button>
                <button
                  onClick={resetAlgorithm}
                  disabled={algorithmState.isCalculating || isProcessingRequest}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors duration-200 shadow hover:shadow-md touch-manipulation min-h-[48px]"
                >
                  <span className="text-sm sm:text-base">Refresh</span>
                </button>
              </div>

              {/* Step-by-Step Results */}
              <StepByStepResults
                steps={algorithmState.algorithmSteps}
                safeSequence={algorithmState.safeSequence}
                isCalculating={algorithmState.isCalculating}
                isSafe={algorithmState.safeSequence.length > 0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}