'use client';

import React, {useState, useEffect, useRef} from 'react';
import {BooleanBadge} from '@/components/ui/BooleanBadge';
import {AlgorithmStep} from '@/types/bankers-algorithm';

interface AnimatedFinishBadgeProps {
  processIndex: number;
  finalFinishState: boolean;
  algorithmSteps: AlgorithmStep[];
  isCalculating: boolean;
  currentStepIndex?: number;
}

export const AnimatedFinishBadge: React.FC<AnimatedFinishBadgeProps> = ({
  processIndex,
  finalFinishState,
  algorithmSteps,
  isCalculating,
  currentStepIndex,
}) => {
  const [currentFinishState, setCurrentFinishState] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // When user navigates to a specific step, update finish state immediately
  useEffect(() => {
    if (currentStepIndex !== undefined) {
      // User is navigating through steps manually
      setCurrentFinishState(finalFinishState);
      setIsAnimating(false);
    }
  }, [currentStepIndex, finalFinishState]);

  // Reset state when calculation starts or when no steps
  useEffect(() => {
    if (isCalculating || !algorithmSteps || algorithmSteps.length === 0) {
      setCurrentFinishState(false);
      setIsAnimating(false);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    }
  }, [isCalculating, algorithmSteps]);

  // Animate through steps when algorithm steps are available (only if not manually navigating)
  useEffect(() => {
    if (
      algorithmSteps &&
      algorithmSteps.length > 0 &&
      !isCalculating &&
      currentStepIndex === undefined
    ) {
      setCurrentFinishState(false);

      // Create animation timeline that matches StepByStepResults exactly
      const animateSteps = async () => {
        for (let i = 0; i < algorithmSteps.length; i++) {
          const step = algorithmSteps[i];

          // Wait for the step to appear (400ms delay as in StepByStepResults)
          await new Promise((resolve) => setTimeout(resolve, 400));

          // Debug logging
          console.log(`P${processIndex} - Step ${i + 1}:`, {
            description: step.description,
            processChecked: step.processChecked,
            canFinish: step.canFinish,
          });

          // Check for process finishing step (step 3 with resource allocation)
          const isProcessFinishingStep =
            step.stepNumber === 3 &&
            step.processChecked &&
            step.canFinish === true &&
            (step.description.includes('work =') ||
              step.description.includes('Work ='));

          if (isProcessFinishingStep && step.processChecked) {
            const processName = step.processChecked;
            const processNum = parseInt(processName.replace('P', ''));

            console.log(
              `P${processIndex} - Found finishing step for ${processName} (${processNum})`,
            );

            // If this is our process, mark it as finished with animation
            if (processNum === processIndex) {
              console.log(`P${processIndex} - Animating finish!`);
              setCurrentFinishState(true);
              setIsAnimating(true);

              // Remove bounce animation after completion, keep the badge visible
              animationRef.current = setTimeout(() => {
                setIsAnimating(false);
              }, 800); // Match animation duration

              break; // Exit loop once this process is finished
            }
          }
        }
      };

      animateSteps();
    }

    // Cleanup function
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [algorithmSteps, isCalculating, processIndex, currentStepIndex]);

  // Fallback to final state if no animation occurred
  useEffect(() => {
    if (
      !isCalculating &&
      algorithmSteps &&
      algorithmSteps.length > 0 &&
      !currentFinishState &&
      finalFinishState
    ) {
      const timer = setTimeout(
        () => {
          setCurrentFinishState(finalFinishState);
        },
        algorithmSteps.length * 400 + 500,
      ); // Wait for all steps plus buffer

      return () => clearTimeout(timer);
    }
  }, [algorithmSteps, isCalculating, currentFinishState, finalFinishState]);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-300 ease-out transform ${
          isAnimating
            ? 'animate-finish-badge-bounce'
            : currentFinishState
              ? 'scale-100 opacity-100'
              : 'scale-100 opacity-100'
        }`}
      >
        <BooleanBadge value={currentFinishState} />
      </div>

      {/* Loading indicator when calculating */}
      {isCalculating && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-sm"
          style={{backgroundColor: 'var(--table-bg, #ffffff)'}}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
        </div>
      )}
    </div>
  );
};
