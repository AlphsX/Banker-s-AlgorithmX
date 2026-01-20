'use client';

import React from 'react';

interface BooleanBadgeProps {
  value: boolean;
  className?: string;
}

export const BooleanBadge: React.FC<BooleanBadgeProps> = ({
  value,
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-center px-4 py-1 rounded-full text-sm font-medium
        ${
          value
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }
        ${className}
      `}
    >
      <span className="mr-2 text-base font-bold">{value ? '✓' : '✗'}</span>
      {value ? 'true' : 'false'}
    </div>
  );
};
