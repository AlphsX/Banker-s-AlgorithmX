"use client";

import React, { useRef, useCallback, useEffect } from "react";

interface CountControlProps {
  label: string;
  count: number;
  onCountChange: (count: number) => void;
  minValue?: number;
  maxValue?: number;
  minWarningMessage?: string;
  maxWarningMessage?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const CountControl: React.FC<CountControlProps> = ({
  label,
  count,
  onCountChange,
  minValue = 1,
  maxValue = 10,
  minWarningMessage = `Minimum ${minValue} required`,
  maxWarningMessage = `Maximum ${maxValue} allowed`,
  disabled = false,
  ariaLabel,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentCountRef = useRef(count);
  const isHoldingRef = useRef(false);
  const [showMinWarning, setShowMinWarning] = React.useState(false);
  const [showMaxWarning, setShowMaxWarning] = React.useState(false);
  const [mountMinWarning, setMountMinWarning] = React.useState(false);
  const [mountMaxWarning, setMountMaxWarning] = React.useState(false);
  const hasShownMinWarningRef = useRef(false);
  const hasShownMaxWarningRef = useRef(false);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unmountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    currentCountRef.current = count;
  }, [count]);

  useEffect(() => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (unmountTimeoutRef.current) {
      clearTimeout(unmountTimeoutRef.current);
    }

    if (count <= minValue && !hasShownMinWarningRef.current) {
      hasShownMinWarningRef.current = true;
      setMountMinWarning(true);
      setTimeout(() => setShowMinWarning(true), 10);
      warningTimeoutRef.current = setTimeout(() => {
        setShowMinWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMinWarning(false);
        }, 500);
      }, 3000);
    } else if (count > minValue) {
      hasShownMinWarningRef.current = false;
      if (mountMinWarning) {
        setShowMinWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMinWarning(false);
        }, 500);
      }
    }

    if (count >= maxValue && !hasShownMaxWarningRef.current) {
      hasShownMaxWarningRef.current = true;
      setMountMaxWarning(true);
      setTimeout(() => setShowMaxWarning(true), 10);
      warningTimeoutRef.current = setTimeout(() => {
        setShowMaxWarning(false);
        unmountTimeoutRef.current = setTimeout(() => {
          setMountMaxWarning(false);
        }, 500);
      }, 3000);
    } else if (count < maxValue) {
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
  }, [count, mountMinWarning, mountMaxWarning, minValue, maxValue]);

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

  const handleClick =
    (action: "increment" | "decrement") => (e: React.MouseEvent) => {
      e.stopPropagation();
      if (disabled) return;
      if (!isHoldingRef.current) {
        if (action === "decrement" && count > minValue) {
          onCountChange(count - 1);
        } else if (action === "increment" && count < maxValue) {
          onCountChange(count + 1);
        }
      }
      isHoldingRef.current = false;
    };

  const startAutoRepeat = useCallback(
    (action: "increment" | "decrement") => {
      timeoutRef.current = setTimeout(() => {
        isHoldingRef.current = true;
        intervalRef.current = setInterval(() => {
          if (action === "decrement") {
            if (currentCountRef.current > minValue) {
              onCountChange(currentCountRef.current - 1);
            } else {
              clearTimers();
            }
          } else {
            if (currentCountRef.current < maxValue) {
              onCountChange(currentCountRef.current + 1);
            } else {
              clearTimers();
            }
          }
        }, 100);
      }, 500);
    },
    [onCountChange, clearTimers, minValue, maxValue],
  );

  const handleMouseDown =
    (action: "increment" | "decrement") =>
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (disabled) return;
      isHoldingRef.current = false;
      if (
        (action === "increment" && count < maxValue) ||
        (action === "decrement" && count > minValue)
      ) {
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

  const accessibleLabel = ariaLabel || label.toLowerCase();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleClick("decrement")}
          onMouseDown={handleMouseDown("decrement")}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown("decrement")}
          onTouchEnd={handleMouseUp}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={disabled || count <= minValue}
          title={`Decrease ${accessibleLabel} count (hold to repeat)`}
          aria-label={`Decrease ${accessibleLabel} count`}
        >
          −
        </button>
        <span
          className="w-8 text-center text-lg font-semibold text-gray-900 dark:text-gray-100"
          aria-label={`Current ${accessibleLabel} count: ${count}`}
        >
          {count}
        </span>
        <button
          onClick={handleClick("increment")}
          onMouseDown={handleMouseDown("increment")}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown("increment")}
          onTouchEnd={handleMouseUp}
          className="btn-control w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation hover:scale-105 hover:shadow-md"
          disabled={disabled || count >= maxValue}
          title={`Increase ${accessibleLabel} count (hold to repeat)`}
          aria-label={`Increase ${accessibleLabel} count`}
        >
          +
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          count <= minValue && mountMinWarning ? "max-h-6 mt-1" : "max-h-0 mt-0"
        }`}
      >
        <p
          className={`text-xs text-red-500 dark:text-red-400 transition-opacity duration-500 ${
            showMinWarning ? "opacity-100" : "opacity-0"
          }`}
        >
          {minWarningMessage}
        </p>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ${
          count >= maxValue && mountMaxWarning ? "max-h-6 mt-1" : "max-h-0 mt-0"
        }`}
      >
        <p
          className={`text-xs text-yellow-500 dark:text-yellow-400 transition-opacity duration-500 ${
            showMaxWarning ? "opacity-100" : "opacity-0"
          }`}
        >
          {maxWarningMessage}
        </p>
      </div>
    </div>
  );
};
