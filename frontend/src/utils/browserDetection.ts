/**
 * Browser Detection Utility
 * Detects supported browsers: Comet, Chrome, Arc Browser, Safari, Firefox, Brave
 *
 * Security: Uses compile-time regex patterns only (no user input in patterns)
 * to prevent ReDoS attacks per OWASP guidelines.
 */

export interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  userAgent: string;
}

interface BrowserPattern {
  pattern: RegExp;
  name: string;
  supported: boolean;
  versionKey: 'chrome' | 'firefox' | 'safari';
  exclude?: RegExp;
}

const VERSION_PATTERNS: Record<string, RegExp> = {
  chrome: /Chrome\/(\d+\.\d+)/,
  firefox: /Firefox\/(\d+\.\d+)/,
  safari: /Version\/(\d+\.\d+)/,
} as const;

function extractBrowserVersion(
  userAgent: string,
  versionKey: keyof typeof VERSION_PATTERNS,
): string {
  const pattern = VERSION_PATTERNS[versionKey];
  const match = userAgent.match(pattern);
  return match?.[1] ?? 'Unknown';
}

export const detectBrowser = (): BrowserInfo => {
  const userAgent = navigator.userAgent;
  const userAgentLower = userAgent.toLowerCase();

  const browsers: Record<string, BrowserPattern> = {
    comet: {
      pattern: /comet/i,
      name: 'Comet',
      supported: true,
      versionKey: 'chrome',
    },
    arc: {
      pattern: /arc/i,
      name: 'Arc Browser',
      supported: true,
      versionKey: 'chrome',
    },
    brave: {
      pattern: /brave/i,
      name: 'Brave',
      supported: true,
      versionKey: 'chrome',
    },
    firefox: {
      pattern: /firefox/i,
      name: 'Firefox',
      supported: true,
      versionKey: 'firefox',
    },
    chrome: {
      pattern: /chrome/i,
      name: 'Chrome',
      supported: true,
      versionKey: 'chrome',
      exclude: /edg|opr|brave|arc|comet|firefox/i,
    },
    safari: {
      pattern: /safari/i,
      name: 'Safari',
      supported: true,
      versionKey: 'safari',
      exclude: /chrome|chromium|edg|opr|brave|arc|comet|firefox/i,
    },
  };

  for (const browser of Object.values(browsers)) {
    if (browser.pattern.test(userAgentLower)) {
      if (browser.exclude && browser.exclude.test(userAgentLower)) {
        continue;
      }

      return {
        name: browser.name,
        version: extractBrowserVersion(userAgent, browser.versionKey),
        isSupported: browser.supported,
        userAgent,
      };
    }
  }

  return {
    name: 'Unknown',
    version: 'Unknown',
    isSupported: false,
    userAgent,
  };
};

export const getSupportedBrowsers = (): string[] => {
  return ['Comet', 'Chrome', 'Arc Browser', 'Safari', 'Firefox', 'Brave'];
};

export const getBrowserRecommendation = (
  currentBrowser: BrowserInfo,
): string => {
  if (currentBrowser.isSupported) {
    return `You're using ${currentBrowser.name} ${currentBrowser.version} - fully supported!`;
  }

  const supportedBrowsers = getSupportedBrowsers();
  return `Your browser (${currentBrowser.name}) is not supported. Please use one of these browsers: ${supportedBrowsers.join(', ')}.`;
};

// Check if current browser supports speech recognition
export const checkSpeechRecognitionSupport = (
  browserInfo: BrowserInfo,
): {
  supported: boolean;
  message: string;
} => {
  if (!browserInfo.isSupported) {
    return {
      supported: false,
      message: `Voice input is not available in ${browserInfo.name}. Please use a supported browser: ${getSupportedBrowsers().join(', ')}.`,
    };
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    let message = `Voice input is not supported in ${browserInfo.name}.`;

    // Provide specific guidance for supported browsers and mobile OS
    const userAgent = navigator.userAgent;

    if (browserInfo.name === 'Firefox') {
      message = `Voice input is not yet supported in Firefox. Please use Chrome, Safari, Brave, or Arc Browser for voice features.`;
    } else if (browserInfo.name === 'Safari') {
      if (/iPhone|iPad|iPod/i.test(userAgent)) {
        message = `Voice input requires iOS 14.5+ and Safari 14.1+. Please update your device.`;
      } else {
        message = `Voice input requires Safari 14.1+ on macOS. Please update your browser.`;
      }
    } else if (/Android/i.test(userAgent)) {
      if (/MIUI|HyperOS/i.test(userAgent)) {
        message = `Voice input on Xiaomi devices works best with Chrome. Please use Chrome browser.`;
      } else if (/HarmonyOS|EMUI/i.test(userAgent)) {
        message = `Voice input on Huawei devices works best with Chrome. Please use Chrome browser.`;
      } else if (/Samsung|OneUI/i.test(userAgent)) {
        message = `Voice input on Samsung devices works best with Chrome or Samsung Internet. Please use Chrome browser.`;
      } else {
        message = `Voice input on Android requires Chrome 25+. Please use Chrome browser.`;
      }
    }

    return {
      supported: false,
      message,
    };
  }

  return {
    supported: true,
    message: `Voice input is available in ${browserInfo.name} ${browserInfo.version}.`,
  };
};
