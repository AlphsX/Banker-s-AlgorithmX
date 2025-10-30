"use client";

import { useState, useEffect } from "react";
import { AlgorithmStep } from "@/types/bankers-algorithm";
import { BooleanBadge } from "@/components/ui/BooleanBadge";

interface StepByStepResultsProps {
  steps: AlgorithmStep[];
  safeSequence: string[];
  isCalculating: boolean;
  isSafe: boolean;
}

export function StepByStepResults({
  steps,
  safeSequence,
  isCalculating,
}: StepByStepResultsProps) {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Reset animation when new steps are provided
  useEffect(() => {
    if (steps.length > 0 && !isCalculating) {
      setVisibleSteps(0);
      setAnimationComplete(false);

      // Start step-by-step animation with 400ms delays
      const animateSteps = async () => {
        for (let i = 0; i <= steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setVisibleSteps(i);
        }
        setAnimationComplete(true);
      };

      animateSteps();
    } else if (steps.length === 0) {
      setVisibleSteps(0);
      setAnimationComplete(false);
    }
  }, [steps, isCalculating]);

  // Don't render if no steps or still calculating
  if (steps.length === 0 && !isCalculating) {
    return null;
  }

  return (
    <div
      className="bg-white rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: 'var(--table-bg)',
        border: '1px solid var(--table-border)'
      }}
    >
      <div className="p-6">
        {/* Step Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Step
          </h2>
        </div>

        {/* Loading State */}
        {isCalculating && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Calculating safety...
              </span>
            </div>
          </div>
        )}

        {/* Results Content */}
        {!isCalculating && steps.length > 0 && (
          <div className="space-y-4">
            {/* Algorithm Steps */}
            {steps.map((step, index) => {
              const isVisible = index < visibleSteps;

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
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--button-bg, #f3f4f6)'
                      }}>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {step.stepNumber}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                        {step.description}
                      </div>
                      {step.workVector && step.workVector.length > 0 && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono">
                          = ({step.workVector.join(", ")})
                        </div>
                      )}
                      {step.processChecked &&
                        step.canFinish !== undefined &&
                        (step.description.includes("<=") ||
                          step.description.includes("≤") ||
                          step.description.includes(">")) && (
                          <div className="mt-2">
                            <BooleanBadge
                              value={step.canFinish}
                              className="text-xs"
                            />
                          </div>
                        )}
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
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray-900 dark:text-white"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M8.5 0C8.5 0 4.58642 3.74805 3.94122 4.39717C3.86128 4.4776 3.84989 4.60224 3.91398 4.69539C3.97806 4.78854 4.09993 4.82451 4.20557 4.78145L7.90537 3.27345L11.7747 9.36041C11.8406 9.46403 11.9758 9.50133 12.0869 9.44651C12.1979 9.39169 12.2483 9.26276 12.2032 9.1489C11.7103 7.90508 8.5 0 8.5 0ZM6.29304 6.03867C6.35522 5.93334 6.32602 5.79881 6.22554 5.72763C6.12505 5.65645 5.98605 5.67185 5.90418 5.76322C5.12486 6.633 0 12.5 0 12.5C0 12.5 5.18613 13.803 6.03089 13.9939C6.14204 14.0191 6.25587 13.964 6.30355 13.8621C6.35122 13.7603 6.31967 13.6394 6.22796 13.5728L3.1616 11.3431L6.29304 6.03867ZM14.054 7.5893C14.016 7.47964 13.9029 7.4131 13.7867 7.43203C13.6705 7.45096 13.5853 7.5498 13.5853 7.66564V11.3824L6.45275 11.5197C6.32824 11.5221 6.22613 11.6175 6.2173 11.7396C6.20846 11.8618 6.2958 11.9704 6.41871 11.9901C7.68171 12.1927 16 13.5728 16 13.5728C16 13.5728 14.3311 8.38966 14.054 7.5893Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                      <span className="font-medium">
                        Hence, the SAFE Sequence is as follows:{" "}
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
