"use client";
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '../theme/theme';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// A wrapper component to apply the theme based on Redux state
const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const themeMode = useSelector((state: RootState) => state.theme.mode);
    const theme = getTheme(themeMode);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
        <ThemeWrapper>
            {children}
        </ThemeWrapper>
    </Provider>
  );
}