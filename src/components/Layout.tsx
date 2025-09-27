"use client";
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import type { RootState } from '../store/store';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BottomNav from './BottomNav';

const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return 'Workouts';
    const cleanPath = pathname.substring(1);
    const title = cleanPath.split('/')[0];
    return title.charAt(0).toUpperCase() + title.slice(1);
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const pageTitle = getPageTitle(pathname);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Don't render layout for unauthenticated users, as they will be redirected.
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <IconButton sx={{ ml: 1 }} onClick={() => dispatch(toggleTheme())} color="inherit">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton sx={{ ml: 1 }} onClick={() => router.push('/profile')} color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3, mb: 7 }}>
        {children}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default Layout;