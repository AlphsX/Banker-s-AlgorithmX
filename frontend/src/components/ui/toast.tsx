"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto dismiss after duration
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(toast.id);
    }, 300);
  }, [toast.id, onDismiss]);

  const Icon = toast.type === 'success' ? CheckCircle : XCircle;
  const bgColor = toast.type === 'success' 
    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  const iconColor = toast.type === 'success' 
    ? 'text-green-500 dark:text-green-400' 
    : 'text-red-500 dark:text-red-400';
  const textColor = toast.type === 'success'
    ? 'text-green-800 dark:text-green-200'
    : 'text-red-800 dark:text-red-200';

  return (
    <div
      className={`
        relative flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-out
        ${bgColor}
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'scale-95' : 'scale-100'}
      `}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${textColor}`}>
          {toast.title}
        </p>
        <p className={`text-sm mt-1 ${textColor} opacity-90`}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className={`flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${textColor}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    type: 'success' | 'error',
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = {
      id,
      type,
      title,
      message,
      duration
    };

    setToasts(prev => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((title: string, message: string, duration?: number) => {
    showToast('success', title, message, duration);
  }, [showToast]);

  const showError = useCallback((title: string, message: string, duration?: number) => {
    showToast('error', title, message, duration);
  }, [showToast]);

  return {
    toasts,
    showSuccess,
    showError,
    dismissToast
  };
};