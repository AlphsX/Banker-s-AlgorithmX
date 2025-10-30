"use client";

import React, { useState, useEffect, useRef } from "react";
import { BooleanBadge } from "@/components/ui/BooleanBadge";
import { AlgorithmStep } from "@/types/bankers-algorithm";

interface AnimatedFinishBadgeProps {
  processIndex: number;
  finalFinishState: boolean;
  algorithmSteps: AlgorithmStep[];
  isCalculating: boolean;
}

export const AnimatedFinishBadge: React.FC<AnimatedFinishBadgeProps> = ({
  processIndex,
  finalFinishState,
  algorithmSteps,
  isCalculating,
}) => {
  const [currentFinishState, setCurrentFinishState] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when calculation starts or when no steps
  useEffect(() => {
    if (isCalculating || algorithmSteps.length === 0) {
      setCurrentFinishState(false);
      setIsAnimating(false);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    }
  }, [isCalculating, algorithmSteps.length]);

  // Animate through steps when algorithm steps are available
  useEffect(() => {
    if (algorithmSteps.length > 0 && !isCalculating) {
      setCurrentFinishState(false);

      // Create animation timeline that matches StepByStepResults exactly
      const animateSteps = async () => {
        // Track which processes have been marked as finished
        const processFinished = Array(10).fill(false);
        
        for (let i = 0; i < algorithmSteps.length; i++) {
          const step = algorithmSteps[i];
          
          // Wait for the step to appear (400ms delay as in StepByStepResults)
          await new Promise((resolve) => setTimeout(resolve, 400));
          
          // Check if this step shows a process finishing
          if (step.description.includes("can finish") && step.processChecked) {
            const processName = step.processChecked;
            const processNum = parseInt(processName.replace('P', '')); // Already 0-based index
            
            // If this is our process and it hasn't finished yet
            if (processNum === processIndex && !processFinished[processIndex]) {
              processFinished[processIndex] = true;
              
              // Mark as finished with bounce animation
              setCurrentFinishState(true);
              setIsAnimating(true);
              
              // Remove animation after a brief period
              animationRef.current = setTimeout(() => {
                setIsAnimating(false);
              }, 600);
              
              break;
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
  }, [algorithmSteps, isCalculating, processIndex]);

  // Fallback to final state if no animation occurred
  useEffect(() => {
    if (!isCalculating && algorithmSteps.length > 0 && !currentFinishState && finalFinishState) {
      const timer = setTimeout(() => {
        setCurrentFinishState(finalFinishState);
      }, algorithmSteps.length * 400 + 500); // Wait for all steps plus buffer

      return () => clearTimeout(timer);
    }
  }, [algorithmSteps.length, isCalculating, currentFinishState, finalFinishState]);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-500 ease-out transform ${
          isAnimating 
            ? "animate-smooth-glow" 
            : "scale-100"
        }`}
      >
        <BooleanBadge value={currentFinishState} />
      </div>
      
      {/* Loading indicator when calculating */}
      {isCalculating && (
        <div 
          className="absolute inset-0 flex items-center justify-center rounded-full backdrop-blur-sm"
          style={{ backgroundColor: 'var(--table-bg, #ffffff)' }}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600 dark:border-gray-600 dark:border-t-gray-300"></div>
        </div>
      )}
      
      <style jsx>{`
        .animate-smooth-glow {
          animation: smooth-glow 1s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes smooth-glow {
          0% { 
            transform: scale(1);
            filter: brightness(1);
          }
          25% { 
            transform: scale(1.02);
            filter: brightness(1.1);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.15) drop-shadow(0 0 8px rgba(34, 197, 94, 0.3));
          }
          75% { 
            transform: scale(1.02);
            filter: brightness(1.1);
          }
          100% { 
            transform: scale(1);
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
};