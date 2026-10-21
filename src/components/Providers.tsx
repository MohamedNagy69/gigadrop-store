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
            main: theme === 'dark' ? '#CCFF00' : '#166534',
            contrastText: theme === 'dark' ? '#000000' : '#F8FAFC',
          },
          secondary: {
            main: theme === 'dark' ? '#111111' : '#1E293B',
          },
          background: {
            default: theme === 'dark' ? '#000000' : '#DCE3EC',
            paper: theme === 'dark' ? '#111111' : '#E9EEF5',
          },
          text: {
            primary: theme === 'dark' ? '#FFFFFF' : '#0F172A',
            secondary: theme === 'dark' ? '#999999' : '#334155',
          },
          error: {
            main: theme === 'dark' ? '#FF4444' : '#B91C1C',
          },
          success: {
            main: theme === 'dark' ? '#CCFF00' : '#166534',
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
                backgroundColor: theme === 'dark' ? '#111111' : '#E9EEF5',
                border: `1px solid ${theme === 'dark' ? '#222222' : '#C2CDDC'}`,
                boxShadow:
                  theme === 'dark'
                    ? 'none'
                    : '0 6px 22px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.45)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root:
                theme === 'light'
                  ? {
                      backgroundColor: 'rgba(22, 101, 52, 0.14) !important',
                      color: '#14532D !important',
                      border: '1px solid rgba(22, 101, 52, 0.3)',
                    }
                  : {},
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                color: theme === 'dark' ? '#CCFF00 !important' : '#166534 !important',
                borderBottomColor: theme === 'dark' ? '#222222' : '#C2CDDC',
              },
              body: {
                borderBottomColor: theme === 'dark' ? '#222222' : '#CFD8E3',
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
