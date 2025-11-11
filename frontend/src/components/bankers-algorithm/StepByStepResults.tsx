"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AlgorithmStep } from "@/types/bankers-algorithm";
import { BooleanBadge } from "@/components/ui/BooleanBadge";

interface StepByStepResultsProps {
  steps: AlgorithmStep[];
  safeSequence: string[];
  isCalculating: boolean;
  isSafe: boolean;
  isProcessingRequest?: boolean;
  requestResult?: {
    isRequest: boolean;
    wasGranted?: boolean;
    processId?: number;
    requestVector?: number[];
  };
  onStepChange?: (stepIndex: number | undefined) => void;
  currentStepIndex?: number;
}

export function StepByStepResults({
  steps,
  safeSequence,
  isCalculating,
  isProcessingRequest = false,
  requestResult,
  onStepChange,
  currentStepIndex,
}: StepByStepResultsProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showCompletionDot, setShowCompletionDot] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Keyboard navigation for steps
  useEffect(() => {
    if (!animationComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Exit step navigation mode with Escape key
      if (e.key === 'Escape' && currentStepIndex !== undefined) {
        e.preventDefault();
        onStepChange?.(undefined as any); // Reset to normal view
        return;
      }

      // Only handle navigation keys if in step navigation mode
      if (currentStepIndex === undefined) return;

      if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        e.preventDefault();
        onStepChange?.(currentStepIndex - 1);
      } else if (e.key === 'ArrowRight' && currentStepIndex < steps.length - 1) {
        e.preventDefault();
        onStepChange?.(currentStepIndex + 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        onStepChange?.(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onStepChange?.(steps.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animationComplete, currentStepIndex, steps.length, onStepChange]);

  // Reset all states when starting new calculation
  const resetStates = useCallback(() => {
    setVisibleSteps(0);
    setAnimationComplete(false);
    setShowCompletionDot(false);
    setElapsedTime(null);
    startTimeRef.current = null;
  }, []);

  // Reset and start timing when calculation begins
  useEffect(() => {
    if (isCalculating || isProcessingRequest) {
      // First reset everything completely
      resetStates();

      // Then start new timer
      startTimeRef.current = Date.now();
    }
  }, [isCalculating, isProcessingRequest, resetStates]);

  // Start animation when calculation completes and steps are available
  useEffect(() => {
    if (steps.length > 0 && !isCalculating && !isProcessingRequest) {
      setVisibleSteps(0);
      setAnimationComplete(false);

      // Start step-by-step animation with 400ms delays
      const animateSteps = async () => {
        for (let i = 0; i <= steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setVisibleSteps(i);
        }
        setAnimationComplete(true);

        // Show completion dot after 200ms delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Calculate final elapsed time from when calculation started
        let finalTime = 0;

        if (startTimeRef.current) {
          finalTime = Date.now() - startTimeRef.current;
          // Clear the timer reference to prevent reuse
          startTimeRef.current = null;
        }

        if (finalTime > 0) {
          setElapsedTime(finalTime);
        }
        setShowCompletionDot(true);
      };

      animateSteps();
    } else if (steps.length === 0 && !isCalculating && !isProcessingRequest) {
      // Reset everything when no steps and not calculating
      resetStates();
    }
  }, [steps, isCalculating, isProcessingRequest, resetStates]);

  // Don't render if no steps or still calculating
  if (steps.length === 0 && !isCalculating && !isProcessingRequest) {
    return null;
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{
        backgroundColor: "var(--table-bg)",
        border: "1px solid var(--table-border)",
      }}
      onClick={(e) => {
        // Exit navigation mode when clicking anywhere in the Steps box
        // but not on step buttons themselves
        const target = e.target as HTMLElement;
        const isStepButton = target.closest('button[title*="Jump to step"]') || target.closest('button[title*="Jump to final result"]');
        
        if (!isStepButton && currentStepIndex !== undefined) {
          onStepChange?.(undefined);
        }
      }}
    >
      <div className="p-6">
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Steps
            <span
              className={`ml-1 transition-opacity duration-300 text-gray-400 dark:text-gray-500 ${
                showCompletionDot ? "opacity-100" : "opacity-0"
              }`}
            >
              •
              {showCompletionDot && elapsedTime !== null && (
                <span className="ml-1 text-sm font-mono">{elapsedTime}ms</span>
              )}
            </span>
          </h2>
        </div>

        {/* Loading State */}
        {(isCalculating || isProcessingRequest) && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
              <span className="text-gray-600 dark:text-gray-400">
                {isProcessingRequest ? "Processing request..." : "Analyzing safety..."}
              </span>
            </div>
          </div>
        )}

        {/* Results Content */}
        {!isCalculating && !isProcessingRequest && steps.length > 0 && (
          <div className="space-y-4">
            {/* Algorithm Steps */}
            {steps.map((step, index) => {
              const isVisible = index < visibleSteps;
              const isCurrentStep = currentStepIndex !== undefined && index === currentStepIndex;
              const isAfterCurrentStep = currentStepIndex !== undefined && index > currentStepIndex;

              return (
                <div
                  key={index}
                  className={`transition-all duration-500 transform ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onStepChange?.(index)}
                      disabled={!animationComplete}
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                        animationComplete ? 'cursor-pointer hover:scale-110 hover:shadow-md' : 'cursor-default'
                      } ${
                        isCurrentStep 
                          ? 'ring-2 ring-gray-400 dark:ring-gray-500' 
                          : ''
                      }`}
                      style={{
                        backgroundColor: isCurrentStep 
                          ? 'var(--button-bg, #f3f4f6)' 
                          : "var(--button-bg, #f3f4f6)",
                      }}
                      title={animationComplete ? `Jump to step ${step.stepNumber}` : ''}
                    >
                      <span className={`text-sm font-semibold transition-colors duration-200 ${
                        isCurrentStep 
                          ? 'text-gray-900 dark:text-gray-100' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {step.stepNumber}
                      </span>
                    </button>
                    <div className={`flex-1 min-w-0 transition-opacity duration-300 ${
                      isAfterCurrentStep ? 'opacity-40' : 'opacity-100'
                    }`}>
                      <div className={`text-sm leading-relaxed transition-colors duration-200 ${
                        isAfterCurrentStep 
                          ? 'text-gray-500 dark:text-gray-500' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {/* Filter out request result information from step description */}
                        {step.description.split(/\n\n[✅❌]/).length > 1 
                          ? step.description.split(/\n\n[✅❌]/)[0]
                          : step.description}
                      </div>
                      {step.workVector && step.workVector.length > 0 && (
                        <div className={`mt-1 text-sm font-mono transition-colors duration-200 ${
                          isAfterCurrentStep 
                            ? 'text-gray-400 dark:text-gray-600' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          = ({step.workVector.join(", ")})
                        </div>
                      )}
                      {/* Show boolean badge - prioritize request validation steps first */}
                      {step.canFinish !== undefined && (() => {
                        // Check if this is a request validation step (steps 1 and 2 with "Check if Request")
                        const isRequestValidationStep = (step.stepNumber === 1 || step.stepNumber === 2) &&
                          step.description.includes("Check if Request");
                        
                        // Check if this is a safety algorithm process check (has processChecked and comparison symbols)
                        const isSafetyProcessCheck = step.processChecked &&
                          (step.description.includes("need[P") && step.description.includes("≤ work")) &&
                          !step.description.includes("Check if Request");
                        
                        // Show badge if it's either type of step (but not both)
                        if (isRequestValidationStep || isSafetyProcessCheck) {
                          return (
                            <div className="mt-2">
                              <BooleanBadge
                                value={step.canFinish}
                                className="text-xs"
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Final Result */}
            {animationComplete && (
              <div
                className="mt-6 pt-4"
                style={{ borderTop: "1px solid var(--table-border)" }}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onStepChange?.(steps.length - 1)}
                    disabled={!animationComplete}
                    className={`flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                      animationComplete ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                    } ${
                      currentStepIndex === steps.length - 1
                        ? 'ring-2 ring-gray-400 dark:ring-gray-500 rounded-full p-1'
                        : ''
                    }`}
                    title={animationComplete ? 'Jump to final result' : ''}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={
                        safeSequence.length > 0 // Result Icon
                          ? "text-gray-900 dark:text-white" // text-green-600 dark:text-green-400
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M8.5 0C8.5 0 4.58642 3.74805 3.94122 4.39717C3.86128 4.4776 3.84989 4.60224 3.91398 4.69539C3.97806 4.78854 4.09993 4.82451 4.20557 4.78145L7.90537 3.27345L11.7747 9.36041C11.8406 9.46403 11.9758 9.50133 12.0869 9.44651C12.1979 9.39169 12.2483 9.26276 12.2032 9.1489C11.7103 7.90508 8.5 0 8.5 0ZM6.29304 6.03867C6.35522 5.93334 6.32602 5.79881 6.22554 5.72763C6.12505 5.65645 5.98605 5.67185 5.90418 5.76322C5.12486 6.633 0 12.5 0 12.5C0 12.5 5.18613 13.803 6.03089 13.9939C6.14204 14.0191 6.25587 13.964 6.30355 13.8621C6.35122 13.7603 6.31967 13.6394 6.22796 13.5728L3.1616 11.3431L6.29304 6.03867ZM14.054 7.5893C14.016 7.47964 13.9029 7.4131 13.7867 7.43203C13.6705 7.45096 13.5853 7.5498 13.5853 7.66564V11.3824L6.45275 11.5197C6.32824 11.5221 6.22613 11.6175 6.2173 11.7396C6.20846 11.8618 6.2958 11.9704 6.41871 11.9901C7.68171 12.1927 16 13.5728 16 13.5728C16 13.5728 14.3311 8.38966 14.054 7.5893Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                  <div className={`flex-1 min-w-0 transition-opacity duration-300 ${
                    currentStepIndex !== undefined && currentStepIndex < steps.length - 1 ? 'opacity-40' : 'opacity-100'
                  }`}>
                    <div className={`text-sm leading-relaxed transition-colors duration-200 ${
                      currentStepIndex !== undefined && currentStepIndex < steps.length - 1
                        ? 'text-gray-500 dark:text-gray-500'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {(() => {
                        // Check if this is a request result by looking for request information in the last step
                        const lastStep = steps.length > 0 ? steps[steps.length - 1] : null;
                        
                        // Check for request results using both prop and step description
                        const hasRequestGranted = requestResult?.isRequest && requestResult?.wasGranted === true || 
                                                 lastStep?.description.includes("✅ REQUEST GRANTED:");
                        const hasRequestDenied = requestResult?.isRequest && requestResult?.wasGranted === false || 
                                                lastStep?.description.includes("❌ REQUEST DENIED:");
                        

                        
                        // If this is a request result, show custom message format
                        if (hasRequestGranted && requestResult?.processId !== undefined && requestResult?.requestVector) {
                          return (
                            <>
                              <span className="font-medium text-green-600 dark:text-green-400">
                                Request GRANTED • Process P{requestResult.processId} successfully allocated [{requestResult.requestVector.join(", ")}] resources.
                              </span>
                              <div className="mt-2">
                                <span className="font-medium">
                                  System remains in SAFE state with execution sequence:{" "}
                                </span>
                                <div className="inline-flex items-center space-x-2 mt-1 flex-wrap">
                                  {safeSequence.map((process, index) => (
                                    <div
                                      key={process}
                                      className="inline-flex items-center space-x-2"
                                    >
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        {process}
                                      </span>
                                      {index < safeSequence.length - 1 && (
                                        <span className="text-green-600 dark:text-green-400 font-medium text-lg">
                                          →
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <span className="font-medium">.</span>
                              </div>
                            </>
                          );
                        } else if (hasRequestDenied && requestResult?.processId !== undefined && requestResult?.requestVector) {
                          return (
                            <>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                Request DENIED • Process P{requestResult.processId} request [{requestResult.requestVector.join(", ")}] cannot be granted.
                              </span>
                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Granting this request would lead to an UNSAFE state with potential deadlock. The system cannot guarantee all processes can complete their execution.
                              </div>
                            </>
                          );
                        } else if (safeSequence.length > 0) {
                          // Normal safety check result (not a request)
                          return (
                            <>
                              <span className="font-medium">
                                System is SAFE • Hence, the SAFE Sequence is as follows:{" "}
                              </span>
                              <div className="inline-flex items-center space-x-2 mt-1 flex-wrap">
                                {safeSequence.map((process, index) => (
                                  <div
                                    key={process}
                                    className="inline-flex items-center space-x-2"
                                  >
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                      {process}
                                    </span>
                                    {index < safeSequence.length - 1 && (
                                      <span className="text-green-600 dark:text-green-400 font-medium text-lg">
                                        →
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <span className="font-medium">.</span>
                            </>
                          );
                        } else {
                          // Normal unsafe result (not a request)
                          return (
                            <>
                              <span className="font-medium text-red-600 dark:text-red-400">
                                System is UNSAFE • No safe sequence exists.
                              </span>
                              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                The system cannot find a sequence where all
                                processes can complete their execution without
                                potential deadlock.
                              </div>
                            </>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
