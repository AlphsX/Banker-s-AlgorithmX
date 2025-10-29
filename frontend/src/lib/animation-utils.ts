/**
 * Animation utilities for enhanced UX
 * Provides smooth transitions, micro-interactions, and performance optimizations
 */

export interface AnimationConfig {
  duration?: number;
  easing?: string;
  delay?: number;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface SpringConfig {
  tension?: number;
  friction?: number;
  mass?: number;
}

// Default animation configurations
export const ANIMATION_PRESETS = {
  // Smooth content loading
  fadeIn: {
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    fillMode: 'forwards' as const,
  },
  
  // Theme switching
  themeTransition: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Copy button interactions
  copySuccess: {
    duration: 200,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Streaming content
  streamingPulse: {
    duration: 1500,
    easing: 'ease-in-out',
  },
  
  // Mobile touch interactions
  touchFeedback: {
    duration: 150,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Micro-interactions
  hover: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Loading states
  skeleton: {
    duration: 2000,
    easing: 'ease-in-out',
  },
} as const;

// Spring physics configurations
export const SPRING_PRESETS = {
  gentle: { tension: 120, friction: 14, mass: 1 },
  wobbly: { tension: 180, friction: 12, mass: 1 },
  stiff: { tension: 210, friction: 20, mass: 1 },
  slow: { tension: 280, friction: 60, mass: 1 },
  molasses: { tension: 280, friction: 120, mass: 1 },
} as const;

/**
 * Creates a smooth fade-in animation
 */
export const createFadeInAnimation = (config: AnimationConfig = {}) => {
  const { duration = 400, easing = 'cubic-bezier(0.4, 0, 0.2, 1)', delay = 0 } = config;
  
  return {
    initial: { opacity: 0, transform: 'translateY(10px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: duration / 1000, ease: easing, delay: delay / 1000 },
  };
};

/**
 * Creates a smooth scale animation for buttons
 */
export const createScaleAnimation = (scale = 1.05, config: AnimationConfig = {}) => {
  const { duration = 150 } = config;
  
  return {
    whileHover: { scale },
    whileTap: { scale: scale * 0.95 },
    transition: { duration: duration / 1000, ease: 'easeOut' },
  };
};

/**
 * Creates a stagger animation for lists
 */
export const createStaggerAnimation = (staggerDelay = 100) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: staggerDelay / 1000,
    },
  };
};

/**
 * Creates a smooth theme transition
 */
export const createThemeTransition = () => {
  return {
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };
};

/**
 * Creates a loading shimmer effect
 */
export const createShimmerAnimation = () => {
  return {
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s infinite',
  };
};

/**
 * Creates a pulse animation for streaming content
 */
export const createPulseAnimation = (config: AnimationConfig = {}) => {
  const { duration = 1500 } = config;
  
  return {
    animation: `pulse ${duration}ms ease-in-out infinite`,
  };
};

/**
 * Creates a bounce animation for notifications
 */
export const createBounceAnimation = () => {
  return {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  };
};

/**
 * Creates a slide animation for mobile gestures
 */
export const createSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
  const transforms = {
    left: { x: '-100%' },
    right: { x: '100%' },
    up: { y: '-100%' },
    down: { y: '100%' },
  };
  
  return {
    initial: transforms[direction],
    animate: { x: 0, y: 0 },
    exit: transforms[direction],
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  };
};

/**
 * Performance-optimized animation hook
 */
export const useOptimizedAnimation = () => {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;
  
  const shouldAnimate = !prefersReducedMotion;
  
  return {
    shouldAnimate,
    getAnimationProps: (animationProps: any) => 
      shouldAnimate ? animationProps : {},
  };
};

/**
 * Creates a typing animation for streaming text
 */
export const createTypingAnimation = () => {
  return {
    initial: { width: 0 },
    animate: { width: 'auto' },
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  };
};

/**
 * Creates a glow effect animation
 */
export const createGlowAnimation = (color = 'rgba(59, 130, 246, 0.5)') => {
  return {
    boxShadow: `0 0 20px ${color}`,
    animation: 'glow 2s ease-in-out infinite alternate',
  };
};

/**
 * Creates a morphing animation for shape changes
 */
export const createMorphAnimation = () => {
  return {
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
    },
  };
};

/**
 * Creates a parallax scroll effect
 */
export const createParallaxAnimation = (offset = 0.5) => {
  return {
    transform: `translateY(${offset * 100}px)`,
    transition: 'transform 0.1s ease-out',
  };
};

/**
 * Creates a magnetic hover effect
 */
export const createMagneticAnimation = () => {
  return {
    whileHover: {
      scale: 1.05,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
    whileTap: {
      scale: 0.95,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };
};

/**
 * Creates a liquid animation for smooth state changes
 */
export const createLiquidAnimation = () => {
  return {
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  };
};

/**
 * Utility to create CSS custom properties for animations
 */
export const createAnimationVariables = (config: Record<string, any>) => {
  const cssVars: Record<string, string> = {};
  
  Object.entries(config).forEach(([key, value]) => {
    cssVars[`--animation-${key}`] = typeof value === 'number' ? `${value}ms` : value;
  });
  
  return cssVars;
};

/**
 * Creates a breathing animation for loading states
 */
export const createBreathingAnimation = () => {
  return {
    animation: 'breathing 3s ease-in-out infinite',
  };
};

/**
 * Creates a wave animation for progress indicators
 */
export const createWaveAnimation = () => {
  return {
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    backgroundSize: '200% 100%',
    animation: 'wave 1.5s infinite',
  };
};