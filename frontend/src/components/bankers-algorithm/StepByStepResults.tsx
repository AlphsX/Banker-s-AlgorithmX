"use client";

import { useState, useEffect } from "react";
import { AlgorithmStep } from "@/types/bankers-algorithm";

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
  isSafe,
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
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden" style={{ border: "1px solid #e1e1e1" }}>
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
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
                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
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
                      {step.processChecked && (
                        <div className="mt-1">
                          <span
                            className={`text-sm font-medium ${
                              step.canFinish === true
                                ? "text-green-600 dark:text-green-400"
                                : step.canFinish === false
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            —{" "}
                            {step.canFinish === true
                              ? "true"
                              : step.canFinish === false
                              ? "false"
                              : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Final Result */}
            {animationComplete && (
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid #e1e1e1" }}>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400 text-lg">
                    ★
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    Hence, the SAFE Sequence is as follows:{" "}
                    {safeSequence.join(" → ")}.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
