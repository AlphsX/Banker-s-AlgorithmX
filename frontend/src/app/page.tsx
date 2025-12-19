"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronsRight } from "lucide-react";

import {
  useDarkMode,
  useSwipeGesture,
  useDynamicFavicon,
  useKeyboardShortcuts,
  useBankersAlgorithm,
} from "@/hooks";

import { AnimatedThemeToggler } from "@/components/magicui";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { BrowserCompatibilityWarning } from "@/components/ui/browser-compatibility-warning";
import { ToastContainer, useToast } from "@/components/ui";
import { useAppLoading } from "@/hooks/useAppLoading";

import {
  SystemControls,
  AlgorithmTable,
  StepByStepResults,
} from "@/components/bankers-algorithm";

/**
 * Logo Icon Component for Banker's Algorithm
 * Theme-dependent colors matching favicon
 */
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

  // Use the consolidated Banker's Algorithm hook
  const {
    algorithmState,
    isProcessingRequest,
    requestResult,
    stepNavigationState,
    checkSafety,
    processResourceRequest,
    updateAllocation,
    updateMax,
    updateAvailable,
    updateProcessCount,
    updateResourceCount,
    resetAlgorithm,
    handleStepChange,
    setRequestResult,
  } = useBankersAlgorithm({
    onSuccess: showSuccess,
    onError: showError,
    autoPreviewOnMount: true,
  });

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Toggle sidebar callback
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
    setIsDesktopSidebarCollapsed((prev) => !prev);
  }, []);

  // Focus first input callback
  const focusInput = useCallback(() => {
    const firstInput = document.querySelector(
      'input[type="number"]',
    ) as HTMLInputElement;
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  // Enhanced reset with focus
  const handleReset = useCallback(() => {
    resetAlgorithm();
    focusInput();
  }, [resetAlgorithm, focusInput]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleSidebar: toggleSidebar,
    onToggleTheme: toggleDarkMode,
    onCheckSafety: checkSafety,
  });

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
      setIsScrolled(scrollTop > 10);
    };

    checkScrollable();
    mainContent.addEventListener("scroll", checkScrollable);
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(mainContent);

    return () => {
      mainContent.removeEventListener("scroll", checkScrollable);
      resizeObserver.disconnect();
    };
  }, [algorithmState.algorithmSteps]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({
        top: mainContentRef.current.scrollHeight,
        behavior: "smooth",
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
      <BrowserCompatibilityWarning onDismiss={() => {}} />

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
                      handleReset();
                    }}
                  >
                    <LogoIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile System Controls */}
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
                onRequestResetComplete={() =>
                  setRequestResult((prev) => ({
                    ...prev,
                    shouldResetRequest: false,
                  }))
                }
              />
            </div>

            {/* Mobile Sidebar Footer */}
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
              "button, a, input, textarea, select",
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
                    handleReset();
                  }}
                >
                  <LogoIcon className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop System Controls */}
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
              onRequestResetComplete={() =>
                setRequestResult((prev) => ({
                  ...prev,
                  shouldResetRequest: false,
                }))
              }
            />
          </div>

          {/* Sidebar Footer */}
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
          {/* Top Bar */}
          <header
            className={`absolute top-0 inset-x-0 z-20 transition-all duration-700 ease-in-out ${
              isScrolled
                ? "bg-white/5 dark:bg-black/10 backdrop-blur-md saturate-150 supports-[backdrop-filter]:bg-white/5"
                : "bg-transparent"
            }`}
          >
            <div className="px-6 py-4">
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
                    onClick={handleReset}
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
            className="flex-1 overflow-y-auto bg-white relative pt-20"
            style={{
              backgroundColor: "var(--page-bg)",
              scrollBehavior: "smooth",
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
                currentStepIndex={stepNavigationState.currentStepIndex}
                onAllocationChange={updateAllocation}
                onMaxChange={updateMax}
              />

              {/* Mobile Action Buttons */}
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
                    onClick={handleReset}
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
                currentStepIndex={stepNavigationState.currentStepIndex}
              />
            </div>

            {/* Scroll to Bottom Button */}
            <div
              className={`fixed right-6 bottom-6 z-30 transition-all duration-300 ease-in-out ${
                showScrollButton
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <button
                onClick={scrollToBottom}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium leading-[normal] cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out select-none h-10 w-10 rounded-full shadow-lg hover:shadow-xl hover:scale-110"
                style={{
                  backgroundColor: isDarkMode ? "#292929" : "#ffffff",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: isDarkMode ? "#3a3a3a" : "#e6e6e6",
                  color: isDarkMode ? "#9e9e9e" : "#0d0d0d",
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
