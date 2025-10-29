"use client";

import { useState, useEffect } from 'react';
import { AlgorithmStep } from '@/types/bankers-algorithm';

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
  isSafe
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
          await new Promise(resolve => setTimeout(resolve, 400));
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
    <div className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl border border-gray-200/40 dark:border-gray-700/40 rounded-2xl p-3 sm:p-6 transition-all duration-500">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
        Algorithm Results
      </h2>
      
      {/* Loading State */}
      {isCalculating && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-400">Calculating safety...</span>
          </div>
        </div>
      )}

      {/* Results Content */}
      {!isCalculating && steps.length > 0 && (
        <>
          {/* Safe Sequence or Unsafe State */}
          <div 
            className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl transition-all duration-500 transform ${
              animationComplete 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4'
            }`}
          >
            {isSafe && safeSequence.length > 0 ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base text-green-700 dark:text-green-300 font-semibold">
                    System is SAFE
                  </span>
                </div>
                <div className="mt-2 text-green-600 dark:text-green-400">
                  <div className="text-sm sm:text-base">
                    <strong>Safe Sequence:</strong>
                  </div>
                  <div className="mt-1 font-mono text-sm sm:text-lg break-all">
                    {safeSequence.join(' → ')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm sm:text-base text-red-700 dark:text-red-300 font-semibold">
                    System is UNSAFE
                  </span>
                </div>
                <div className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400">
                  Not all processes can complete execution safely
                </div>
              </div>
            )}
          </div>

          {/* Algorithm Steps */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
              <span>Step-by-Step Execution:</span>
              {!animationComplete && (
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </h3>
            
            <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
              {steps.map((step, index) => {
                const isVisible = index < visibleSteps;
                const isCurrentStep = index === visibleSteps - 1 && !animationComplete;
                
                return (
                  <div
                    key={index}
                    className={`transition-all duration-500 transform ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-4 scale-95'
                    }`}
                  >
                    <div
                      className={`p-3 sm:p-4 rounded-lg border transition-all duration-300 ${
                        step.isHighlighted
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md'
                          : step.canFinish === true
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : step.canFinish === false
                          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                          : 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                      } ${
                        isCurrentStep ? 'ring-2 ring-blue-300 dark:ring-blue-600' : ''
                      }`}
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <div 
                            className={`flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.isHighlighted
                                ? 'bg-blue-500 text-white'
                                : step.canFinish === true
                                ? 'bg-green-500 text-white'
                                : step.canFinish === false
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-400 text-white'
                            }`}
                          >
                            {step.stepNumber}
                          </div>
                          
                          {step.processChecked && (
                            <div className={`px-2 py-1 rounded-md text-xs font-medium truncate ${
                              step.canFinish === true
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : step.canFinish === false
                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}>
                              {step.processChecked}
                              {step.canFinish === true && ' ✓'}
                              {step.canFinish === false && ' ✗'}
                            </div>
                          )}
                        </div>
                        
                        {isCurrentStep && (
                          <div className="flex-shrink-0">
                            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>

                      {/* Step Description */}
                      <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 leading-relaxed">
                        {step.description}
                      </div>

                      {/* Work Vector Display */}
                      {step.workVector && step.workVector.length > 0 && (
                        <div className="bg-white/60 dark:bg-gray-900/40 rounded-md p-2 sm:p-3 border border-gray-200/50 dark:border-gray-600/50">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex-shrink-0">
                              Work Vector:
                            </span>
                            <div className="font-mono text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 break-all">
                              [{step.workVector.join(', ')}]
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </div>
  );
}