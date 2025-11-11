"use client";

import React, { useRef, useCallback, useEffect } from 'react';

interface ResourceControlProps {
  resourceCount: number;
  onResourceCountChange: (count: number) => void;
  disabled?: boolean;
}

export const ResourceControl: React.FC<ResourceControlProps> = ({
  resourceCount,
  onResourceCountChange,
  disabled = false,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCountRef = useRef(resourceCount);
  const isHoldingRef = useRef(false);
  const [showMinWarning, setShowMinWarning] = React.useState(false);
  const [showMaxWarning, setShowMaxWarning] = React.useState(false);
  const [mountMinWarning, setMountMinWarning] = React.useState(false);
  const [mountMaxWarning, setMountMaxWarning] = React.useState(false);
  const hasShownMinWarningRef = useRef(false);
  const hasShownMaxWarningRef = useRef(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref in sync with prop
  useEffect(() => {
    currentCountRef.current = resourceCount;
  }, [resourceCount]);

  // Show/hide warnings with auto-dismiss
  useEffect(() => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (unmountTimeoutRef.current) {
      clearTimeout(unmountTimeoutRef.current);
    }

    if (resourceCount <= 1 && !hasShownMinWarningRef.current) {
      hasShownMinWarningRef.current = true;
      setMountMinWarning(true);
      setTimeout(() => setShowMinWarning(true), 10);
      warningTimeoutRef.current = setTimeout(() => {
        setShowMinWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMinWarning(false);
        }, 500);
      }, 3000);
    } else if (resourceCount > 1) {
      hasShownMinWarningRef.current = false;
      if (mountMinWarning) {
        setShowMinWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMinWarning(false);
        }, 500);
      }
    }

    if (resourceCount >= 10 && !hasShownMaxWarningRef.current) {
      hasShownMaxWarningRef.current = true;
      setMountMaxWarning(true);
      setTimeout(() => setShowMaxWarning(true), 10);
      warningTimeoutRef.current = setTimeout(() => {
        setShowMaxWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMaxWarning(false);
        }, 500);
      }, 3000);
    } else if (resourceCount < 10) {
      hasShownMaxWarningRef.current = false;
      if (mountMaxWarning) {
        setShowMaxWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMaxWarning(false);
        }, 500);
      }
    }

    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (unmountTimeoutRef.current) {
        clearTimeout(unmountTimeoutRef.current);
      }
    };
  }, [resourceCount, mountMinWarning, mountMaxWarning]);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleClick = (action: 'increment' | 'decrement') => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    // Only handle click if it wasn't a hold action
    if (!isHoldingRef.current) {
      if (action === 'decrement' && resourceCount > 1) {
        onResourceCountChange(resourceCount - 1);
      } else if (action === 'increment' && resourceCount < 10) {
        onResourceCountChange(resourceCount + 1);
      }
    }
    isHoldingRef.current = false;
  };

  const startAutoRepeat = useCallback((action: 'increment' | 'decrement') => {
    timeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      intervalRef.current = setInterval(() => {
        if (action === 'decrement') {
          if (currentCountRef.current > 1) {
            onResourceCountChange(currentCountRef.current - 1);
          } else {
            clearTimers();
          }
        } else {
          if (currentCountRef.current < 10) {
            onResourceCountChange(currentCountRef.current + 1);
          } else {
            clearTimers();
          }
        }
      }, 100);
    }, 500);
  }, [onResourceCountChange, clearTimers]);

  const handleMouseDown = (action: 'increment' | 'decrement') => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;
    isHoldingRef.current = false;
    if ((action === 'increment' && resourceCount < 10) || (action === 'decrement' && resourceCount > 1)) {
      startAutoRepeat(action);
    }
  };

  const handleMouseUp = () => {
    clearTimers();
  };

  const handleMouseLeave = () => {
    clearTimers();
    isHoldingRef.current = false;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Resources
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleClick('decrement')}
          onMouseDown={handleMouseDown('decrement')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown('decrement')}
          onTouchEnd={handleMouseUp}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={disabled || resourceCount <= 1}
          title="Decrease resource count (hold to repeat)"
          aria-label="Decrease resource count"
        >
          −
        </button>
        <span 
          className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-gray-100"
          aria-label={`Current resource count: ${resourceCount}`}
        >
          {resourceCount}
        </span>
        <button
          onClick={handleClick('increment')}
          onMouseDown={handleMouseDown('increment')}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown('increment')}
          onTouchEnd={handleMouseUp}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={disabled || resourceCount >= 10}
          title="Increase resource count (hold to repeat)"
          aria-label="Increase resource count"
        >
          +
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${
        resourceCount <= 1 && mountMinWarning ? 'max-h-6 mt-1' : 'max-h-0 mt-0'
      }`}>
        <p className={`text-xs text-red-500 dark:text-red-400 transition-opacity duration-500 ${
          showMinWarning ? 'opacity-100' : 'opacity-0'
        }`}>
          Minimum 1 resource required
        </p>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ${
        resourceCount >= 10 && mountMaxWarning ? 'max-h-6 mt-1' : 'max-h-0 mt-0'
      }`}>
        <p className={`text-xs text-yellow-500 dark:text-yellow-400 transition-opacity duration-500 ${
          showMaxWarning ? 'opacity-100' : 'opacity-0'
        }`}>
          Maximum 10 resources allowed
        </p>
      </div>
    </div>
  );
};
