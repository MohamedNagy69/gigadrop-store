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
            main: theme === 'dark' ? '#CCFF00' : '#059669',
            contrastText: theme === 'dark' ? '#000000' : '#FFFFFF',
          },
          secondary: {
            main: theme === 'dark' ? '#111111' : '#0F172A',
          },
          background: {
            default: theme === 'dark' ? '#000000' : '#F4F6F9',
            paper: theme === 'dark' ? '#111111' : '#FFFFFF',
          },
          text: {
            primary: theme === 'dark' ? '#FFFFFF' : '#020617',
            secondary: theme === 'dark' ? '#999999' : '#334155',
          },
          error: {
            main: theme === 'dark' ? '#FF4444' : '#DC2626',
          },
          success: {
            main: theme === 'dark' ? '#CCFF00' : '#059669',
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
                border: `1px solid ${theme === 'dark' ? '#222222' : '#E2E8F0'}`,
                boxShadow:
                  theme === 'dark'
                    ? 'none'
                    : '0 4px 20px -2px rgba(15, 23, 42, 0.05), inset 0 1px 0 #FFFFFF',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root:
                theme === 'light'
                  ? {
                      backgroundColor: 'rgba(5, 150, 105, 0.08) !important',
                      color: '#047857 !important',
                      border: '1px solid rgba(5, 150, 105, 0.25)',
                      fontWeight: 700,
                    }
                  : {},
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                color: theme === 'dark' ? '#CCFF00 !important' : '#047857 !important',
                borderBottomColor: theme === 'dark' ? '#222222' : '#E2E8F0',
                fontWeight: 700,
              },
              body: {
                borderBottomColor: theme === 'dark' ? '#222222' : '#F1F5F9',
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
