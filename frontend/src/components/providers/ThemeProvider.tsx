'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    // ブラウザ拡張機能からの非推奨警告を抑制
    if (typeof window !== 'undefined') {
      const originalWarn = console.warn;
      const originalError = console.error;

      console.warn = (...args: any[]) => {
        const message = args.join(' ');
        if (
          message.includes('ms-high-contrast') ||
          message.includes('ms-high-contrast-adjust') ||
          (message.includes('[Deprecation]') && message.includes('content.js'))
        ) {
          // 警告を抑制
          return;
        }
        originalWarn.apply(console, args);
      };

      console.error = (...args: any[]) => {
        const message = args.join(' ');
        if (
          message.includes('ms-high-contrast') ||
          message.includes('ms-high-contrast-adjust') ||
          (message.includes('[Deprecation]') && message.includes('content.js'))
        ) {
          // エラーを抑制
          return;
        }
        originalError.apply(console, args);
      };
    }
  }, []);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

