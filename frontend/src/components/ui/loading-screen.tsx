"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export function LoadingScreen({
  isLoading,
  onLoadingComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration and mobile viewport
  useEffect(() => {
    setIsHydrated(true);

    // Set up proper mobile viewport height
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH);
    window.addEventListener("orientationchange", setVH);

    return () => {
      window.removeEventListener("resize", setVH);
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  useEffect(() => {
    if (!isLoading || !isHydrated) return;

    let startTime: number;
    const duration = 400; // Match the useAppLoading duration
    let animationId: number;

    const updateProgress = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;
      const rawProgress = (elapsed / duration) * 100;

      // Smooth easing curve (ease-out)
      const easedProgress = 100 * (1 - Math.pow(1 - rawProgress / 100, 3));

      setProgress(Math.min(easedProgress, 100));

      if (rawProgress < 100) {
        animationId = requestAnimationFrame(updateProgress);
      } else {
        // Start exit animation
        setIsExiting(true);
        setTimeout(() => onLoadingComplete?.(), 200);
      }
    };

    animationId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isLoading, onLoadingComplete, isHydrated]);

  // Don't render anything until hydrated to prevent hydration mismatch
  if (!isHydrated || !isLoading) return null;

  return (
    <div
      className={`loading-container fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black transition-opacity duration-200 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Banker's Algorithm Logo with subtle animation */}
        <div className="w-16 h-16 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-all duration-500 ${
              progress > 50 ? "scale-105" : "scale-100"
            }`}
            style={{
              // Prevent layout shift during animation
              willChange: "transform",
            }}
          >
            <path
              clipRule="evenodd"
              fill="#000000"
              fillRule="evenodd"
              d="M8.5 0C8.5 0 4.58642 3.74805 3.94122 4.39717C3.86128 4.4776 3.84989 4.60224 3.91398 4.69539C3.97806 4.78854 4.09993 4.82451 4.20557 4.78145L7.90537 3.27345L11.7747 9.36041C11.8406 9.46403 11.9758 9.50133 12.0869 9.44651C12.1979 9.39169 12.2483 9.26276 12.2032 9.1489C11.7103 7.90508 8.5 0 8.5 0ZM6.29304 6.03867C6.35522 5.93334 6.32602 5.79881 6.22554 5.72763C6.12505 5.65645 5.98605 5.67185 5.90418 5.76322C5.12486 6.633 0 12.5 0 12.5C0 12.5 5.18613 13.803 6.03089 13.9939C6.14204 14.0191 6.25587 13.964 6.30355 13.8621C6.35122 13.7603 6.31967 13.6394 6.22796 13.5728L3.1616 11.3431L6.29304 6.03867ZM14.054 7.5893C14.016 7.47964 13.9029 7.4131 13.7867 7.43203C13.6705 7.45096 13.5853 7.5498 13.5853 7.66564V11.3824L6.45275 11.5197C6.32824 11.5221 6.22613 11.6175 6.2173 11.7396C6.20846 11.8618 6.2958 11.9704 6.41871 11.9901C7.68171 12.1927 16 13.5728 16 13.5728C16 13.5728 14.3311 8.38966 14.054 7.5893Z"
              className="dark:fill-white"
            />
          </svg>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="w-64 h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full rounded-full bg-gray-900 dark:bg-gray-100 relative overflow-hidden"
            style={{
              width: `${Math.min(progress, 100)}%`,
              transition: "width 0.1s ease-out",
            }}
          >
            {/* Shimmer effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-gray-800/30 to-transparent animate-pulse"
              style={{
                animation:
                  progress > 0 ? "shimmer 1.5s ease-in-out infinite" : "none",
              }}
            />
          </div>
        </div>

        {/* Loading text with fade animation */}
        <div
          className={`text-sm text-gray-600 dark:text-gray-400 transition-opacity duration-300 ${
            progress > 80 ? "opacity-50" : "opacity-100"
          }`}
        ></div>
      </div>

      <style jsx>{`
        .loading-container {
          min-height: 100vh;
          min-height: 100dvh;
          /* Ensure proper mobile viewport handling */
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }

        @supports (height: 100dvh) {
          .loading-container {
            min-height: 100dvh;
          }
        }

        /* Prevent zoom on double tap for mobile */
        .loading-container * {
          touch-action: manipulation;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Optimize for mobile performance */
        @media (max-width: 768px) {
          .loading-container {
            /* Use hardware acceleration */
            transform: translateZ(0);
            backface-visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
