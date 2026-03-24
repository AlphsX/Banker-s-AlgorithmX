'use client';

import React, {useId} from 'react';
import {LOGO_THEMES, LOGO_PATHS, LOGO_VIEWBOX} from '@/constants/logo-config';

export type LogoTheme = keyof typeof LOGO_THEMES;

interface LogoIconProps {
  className?: string;
  theme?: LogoTheme;
  width?: number | string;
  height?: number | string;
}

export const LogoIcon = ({
  className,
  theme = 'vibrant',
  width = 14,
  height = 14,
}: LogoIconProps) => {
  const id = useId();
  const themeColors = LOGO_THEMES[theme];

  return (
    <svg
      width={width}
      height={height}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id={`logo-grad-top-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor={themeColors.top.start} />
          <stop offset="100%" stopColor={themeColors.top.end} />
        </linearGradient>
        <linearGradient
          id={`logo-grad-left-${id}`}
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor={themeColors.left.start} />
          <stop offset="100%" stopColor={themeColors.left.end} />
        </linearGradient>
        <linearGradient
          id={`logo-grad-right-${id}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={themeColors.right.start} />
          <stop offset="100%" stopColor={themeColors.right.end} />
        </linearGradient>
      </defs>
      {LOGO_PATHS.map((path) => (
        <path
          key={path.id}
          fill={`url(#${path.gradientId}-${id})`}
          d={path.d}
        />
      ))}
    </svg>
  );
};
