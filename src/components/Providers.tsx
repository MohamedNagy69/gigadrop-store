'use client';

import React, { useEffect, useMemo } from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useThemeStore } from '@/stores/themeStore';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme, locale } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';
    root.lang = locale;
  }, [theme, locale]);

  const muiTheme = useMemo(
    () =>
      createTheme({
        direction: locale === 'ar' ? 'rtl' : 'ltr',
        palette: {
          mode: theme,
          primary: {
            main: theme === 'dark' ? '#CCFF00' : '#2E7D32',
            contrastText: theme === 'dark' ? '#000000' : '#FFFFFF',
          },
          secondary: {
            main: theme === 'dark' ? '#111111' : '#1A1A1A',
          },
          background: {
            default: theme === 'dark' ? '#000000' : '#F2F3F5',
            paper: theme === 'dark' ? '#111111' : '#FFFFFF',
          },
          text: {
            primary: theme === 'dark' ? '#FFFFFF' : '#1A1A1A',
            secondary: theme === 'dark' ? '#999999' : '#333333',
          },
          error: {
            main: theme === 'dark' ? '#FF4444' : '#E53935',
          },
          success: {
            main: theme === 'dark' ? '#CCFF00' : '#2E7D32',
          },
        },
        typography: {
          fontFamily: "'Inter', 'Cairo', system-ui, sans-serif",
        },
        shape: {
          borderRadius: 12,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
                backgroundColor: theme === 'dark' ? '#111111' : '#FFFFFF',
                border: `1px solid ${theme === 'dark' ? '#222222' : 'rgba(0, 0, 0, 0.06)'}`,
                boxShadow:
                  theme === 'dark'
                    ? 'none'
                    : '0 2px 12px -2px rgba(0, 0, 0, 0.04), inset 0 1px 0 #FFFFFF',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root:
                theme === 'light'
                  ? {
                      backgroundColor: '#E8F5E9 !important',
                      color: '#2E7D32 !important',
                      border: '1px solid rgba(46, 125, 50, 0.2)',
                      fontWeight: 700,
                    }
                  : {},
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                color: theme === 'dark' ? '#CCFF00 !important' : '#2E7D32 !important',
                borderBottomColor: theme === 'dark' ? '#222222' : 'rgba(0, 0, 0, 0.06)',
                fontWeight: 700,
              },
              body: {
                borderBottomColor: theme === 'dark' ? '#222222' : 'rgba(0, 0, 0, 0.04)',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 8,
              },
            },
          },
        },
      }),
    [theme, locale]
  );

  return (
    <SessionProvider>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </SessionProvider>
  );
}
