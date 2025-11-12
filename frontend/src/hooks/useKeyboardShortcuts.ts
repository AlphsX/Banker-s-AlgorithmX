"use client";

import { useEffect, useCallback } from "react";

interface KeyboardShortcutsConfig {
  onToggleSidebar?: () => void;
  onToggleTheme?: () => void;
  onCheckSafety?: () => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutsConfig) {
  const {
    onToggleSidebar,
    onToggleTheme,
    onCheckSafety,
  } = config;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check for modifier keys (Cmd on Mac, Ctrl on Windows/Linux)
      const isModifierPressed = event.metaKey || event.ctrlKey;

      // Handle Shift+Enter for Check Safety
      if (event.key === "Enter" && event.shiftKey && !isModifierPressed && onCheckSafety) {
        event.preventDefault();
        onCheckSafety();
        return;
      }

      if (!isModifierPressed) return;

      // Prevent default behavior for our shortcuts
      switch (event.key) {
        case "[":
          // Cmd+[ or Ctrl+[ - Toggle sidebar
          if (onToggleSidebar) {
            event.preventDefault();
            onToggleSidebar();
          }
          break;

        case "d":
          // Cmd+D or Ctrl+D - Toggle dark mode
          if (onToggleTheme) {
            event.preventDefault();
            onToggleTheme();
          }
          break;
      }
    },
    [onToggleSidebar, onToggleTheme, onCheckSafety]
  );

  useEffect(() => {
    // Add event listener for keydown events
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return helper function to check if shortcuts are supported
  return {
    isSupported: typeof window !== "undefined",
    shortcuts: {
      toggleSidebar: navigator.userAgent.includes("Mac") ? "Cmd+[" : "Ctrl+[",
      toggleTheme: navigator.userAgent.includes("Mac") ? "Cmd+D" : "Ctrl+D",
      checkSafety: "Shift+Enter",
    },
  };
}
