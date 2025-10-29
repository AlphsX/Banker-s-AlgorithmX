// Utility functions and constants for markdown processing with performance optimizations

import { MarkdownError, StreamingError, CodeBlock } from '@/types/markdown';

// Performance optimization: Content analysis cache (removed - using PerformanceCache instead)
const CACHE_MAX_SIZE = 100;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache entry interface
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hits: number;
}

// Generic cache utility
class PerformanceCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = CACHE_MAX_SIZE, ttl = CACHE_TTL) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if entry is expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry.value;
  }

  set(key: string, value: T): void {
    // Clean up expired entries
    this.cleanup();

    // If cache is full, remove least recently used entry
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 1
    });
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let lruKey = '';
    let lruHits = Infinity;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < lruHits || (entry.hits === lruHits && entry.timestamp < oldestTime)) {
        lruKey = key;
        lruHits = entry.hits;
        oldestTime = entry.timestamp;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Create performance caches
const featureAnalysisCache = new PerformanceCache<{
  hasHeaders: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasLinks: boolean;
  hasBlockquotes: boolean;
  hasCodeBlocks: boolean;
  hasInlineCode: boolean;
  estimatedReadTime: number;
}>(50, 2 * 60 * 1000); // 2 minutes
const codeBlockCache = new PerformanceCache<CodeBlock[]>(30, 5 * 60 * 1000); // 5 minutes
const validationCache = new PerformanceCache<MarkdownError[]>(100, 10 * 60 * 1000); // 10 minutes

// Supported programming languages for syntax highlighting
export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'sass',
  'json',
  'xml',
  'yaml',
  'markdown',
  'bash',
  'shell',
  'sql',
  'dockerfile',
  'nginx',
  'apache',
  'plaintext',
  'text'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

// Language aliases for better detection
export const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'cpp': 'cpp',
  'c++': 'cpp',
  'cs': 'csharp',
  'rb': 'ruby',
  'rs': 'rust',
  'kt': 'kotlin',
  'sh': 'bash',
  'zsh': 'bash',
  'fish': 'bash',
  'powershell': 'bash',
  'ps1': 'bash',
  'yml': 'yaml',
  'md': 'markdown',
  'txt': 'plaintext'
};

// Detect language from code block info string
export function detectLanguage(info: string): SupportedLanguage {
  if (!info) return 'plaintext';
  
  const lang = info.toLowerCase().trim().split(' ')[0];
  
  // Check direct match
  if (SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage)) {
    return lang as SupportedLanguage;
  }
  
  // Check aliases
  if (LANGUAGE_ALIASES[lang]) {
    return LANGUAGE_ALIASES[lang];
  }
  
  return 'plaintext';
}

// Performance-optimized markdown validation with caching
export function validateMarkdownContent(content: string): MarkdownError[] {
  if (!content) return [];

  // Create cache key
  const cacheKey = createContentHash(content);
  
  // Check cache first
  const cached = validationCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const errors: MarkdownError[] = [];
  
  // Check for unclosed code blocks
  const codeBlockMatches = content.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    errors.push({
      type: 'parsing',
      message: 'Unclosed code block detected',
      recoverable: true
    });
  }
  
  // Check for malformed headers
  const malformedHeaders = content.match(/^#{7,}/gm);
  if (malformedHeaders) {
    errors.push({
      type: 'parsing',
      message: 'Invalid header level (more than 6 #)',
      recoverable: true
    });
  }

  // Check for malformed links
  const malformedLinks = content.match(/\[[^\]]*\]\([^)]*$/gm);
  if (malformedLinks) {
    errors.push({
      type: 'parsing',
      message: 'Unclosed link detected',
      recoverable: true
    });
  }

  // Check for extremely long lines that might cause performance issues
  const lines = content.split('\n');
  const longLines = lines.filter(line => line.length > 1000);
  if (longLines.length > 0) {
    errors.push({
      type: 'rendering',
      message: `${longLines.length} extremely long line(s) detected (>1000 chars)`,
      recoverable: true
    });
  }
  
  // Cache the result
  validationCache.set(cacheKey, errors);
  
  return errors;
}

// Performance-optimized code block extraction with caching
export function extractCodeBlocks(content: string) {
  if (!content) return [];

  // Create cache key
  const cacheKey = createContentHash(content);
  
  // Check cache first
  const cached = codeBlockCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    blocks.push({
      id: `code-block-${blocks.length}`,
      language: detectLanguage(match[1] || ''),
      code: match[2].trim(),
      startLine: content.substring(0, match.index).split('\n').length,
      endLine: content.substring(0, match.index + match[0].length).split('\n').length
    });
  }
  
  // Cache the result
  codeBlockCache.set(cacheKey, blocks);
  
  return blocks;
}

// Performance-optimized markdown feature analysis with caching
export function analyzeMarkdownFeatures(content: string): {
  hasHeaders: boolean;
  hasLists: boolean;
  hasTables: boolean;
  hasLinks: boolean;
  hasBlockquotes: boolean;
  hasCodeBlocks: boolean;
  hasInlineCode: boolean;
  estimatedReadTime: number;
} {
  if (!content) {
    return {
      hasHeaders: false,
      hasLists: false,
      hasTables: false,
      hasLinks: false,
      hasBlockquotes: false,
      hasCodeBlocks: false,
      hasInlineCode: false,
      estimatedReadTime: 0
    };
  }

  // Create cache key based on content hash
  const cacheKey = createContentHash(content);
  
  // Check cache first
  const cached = featureAnalysisCache.get(cacheKey);
  if (cached) {
    return cached as {
      hasHeaders: boolean;
      hasLists: boolean;
      hasTables: boolean;
      hasLinks: boolean;
      hasBlockquotes: boolean;
      hasCodeBlocks: boolean;
      hasInlineCode: boolean;
      estimatedReadTime: number;
    };
  }

  // Perform analysis
  const features = {
    hasHeaders: /^#{1,6}\s/m.test(content),
    hasLists: /^[\s]*[-*+]\s|^[\s]*\d+\.\s/m.test(content),
    hasTables: /\|.*\|/.test(content),
    hasLinks: /\[.*\]\(.*\)/.test(content),
    hasBlockquotes: /^>\s/m.test(content),
    hasCodeBlocks: /```/.test(content),
    hasInlineCode: /`[^`]+`/.test(content),
    estimatedReadTime: estimateReadingTime(content)
  };

  // Cache the result
  featureAnalysisCache.set(cacheKey, features);
  
  return features;
}

// Estimate reading time for content
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Handle streaming markdown errors
export function handleStreamingError(error: StreamingError): string {
  switch (error.type) {
    case 'incomplete-markdown':
      return error.content; // Return as-is for now
    case 'malformed-code-block':
      return error.content.replace(/```[^`]*$/, ''); // Remove incomplete code block
    case 'parsing-timeout':
      return error.content; // Return what we have
    default:
      return error.content;
  }
}

// Safe markdown parsing with error recovery
export function safeParseMarkdown(content: string): { 
  content: string; 
  errors: MarkdownError[] 
} {
  const errors = validateMarkdownContent(content);
  
  if (errors.length === 0) {
    return { content, errors: [] };
  }
  
  // Attempt to fix common issues
  let fixedContent = content;
  
  // Fix unclosed code blocks
  const codeBlockMatches = content.match(/```/g);
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    fixedContent += '\n```';
  }
  
  return { content: fixedContent, errors };
}

// Create a simple hash for content caching
function createContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

// Debounce function for streaming updates
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for performance-critical operations
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Performance monitoring utilities
export const performanceUtils = {
  // Clear all caches (useful for memory management)
  clearCaches: () => {
    featureAnalysisCache.clear();
    codeBlockCache.clear();
    validationCache.clear();
  },
  
  // Get cache statistics
  getCacheStats: () => ({
    featureAnalysis: {
      size: featureAnalysisCache.size(),
      maxSize: 50
    },
    codeBlocks: {
      size: codeBlockCache.size(),
      maxSize: 30
    },
    validation: {
      size: validationCache.size(),
      maxSize: 100
    }
  }),
  
  // Measure function execution time
  measureTime: <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },

  // Enhanced performance monitoring with metrics collection
  createPerformanceMonitor: () => {
    const metrics = {
      renderTimes: [] as number[],
      parseTimes: [] as number[],
      cacheHits: 0,
      cacheMisses: 0,
      errorCount: 0,
      memoryUsage: [] as number[]
    };

    return {
      startRender: () => performance.now(),
      
      endRender: (startTime: number, contentLength: number) => {
        const renderTime = performance.now() - startTime;
        metrics.renderTimes.push(renderTime);
        
        // Keep only last 100 measurements
        if (metrics.renderTimes.length > 100) {
          metrics.renderTimes.shift();
        }
        
        // Log performance warnings for slow renders
        if (renderTime > 100) {
          console.warn(`Slow markdown render: ${renderTime.toFixed(2)}ms for ${contentLength} chars`);
        }
        
        return renderTime;
      },
      
      recordCacheHit: () => metrics.cacheHits++,
      recordCacheMiss: () => metrics.cacheMisses++,
      recordError: () => metrics.errorCount++,
      
      recordMemoryUsage: () => {
        if ('memory' in performance) {
          const memInfo = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
          metrics.memoryUsage.push(memInfo.usedJSHeapSize);
          
          // Keep only last 50 measurements
          if (metrics.memoryUsage.length > 50) {
            metrics.memoryUsage.shift();
          }
        }
      },
      
      getMetrics: () => ({
        ...metrics,
        averageRenderTime: metrics.renderTimes.length > 0 
          ? metrics.renderTimes.reduce((a, b) => a + b, 0) / metrics.renderTimes.length 
          : 0,
        cacheHitRate: metrics.cacheHits + metrics.cacheMisses > 0 
          ? metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) 
          : 0,
        peakMemoryUsage: metrics.memoryUsage.length > 0 
          ? Math.max(...metrics.memoryUsage) 
          : 0
      }),
      
      reset: () => {
        metrics.renderTimes.length = 0;
        metrics.parseTimes.length = 0;
        metrics.cacheHits = 0;
        metrics.cacheMisses = 0;
        metrics.errorCount = 0;
        metrics.memoryUsage.length = 0;
      }
    };
  }
};

// Memory-efficient content chunking for large content
export function chunkContent(content: string, chunkSize = 5000): string[] {
  if (content.length <= chunkSize) {
    return [content];
  }

  const chunks: string[] = [];
  let currentChunk = '';
  const lines = content.split('\n');

  for (const line of lines) {
    if (currentChunk.length + line.length + 1 > chunkSize && currentChunk) {
      chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk += (currentChunk ? '\n' : '') + line;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}