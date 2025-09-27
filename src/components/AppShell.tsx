"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/store/slices/themeSlice';
import type { RootState } from '@/store/store';
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
import BottomNav from './BottomNav';

const getPageTitle = (pathname: string): string => {
    const route = pathname.split('/')[1] || '';
    switch (route) {
        case '': return 'التمارين';
        case 'exercises': return 'مكتبة التمارين';
        case 'plans': return 'الخطط التدريبية';
        case 'progress': return 'التقدم';
        case 'achievements': return 'الإنجازات';
        case 'create-plan': return 'إنشاء خطة جديدة';
        case 'exercise': return 'تفاصيل التمرين';
        default: return 'متتبع التمارين';
    }
}

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const pageTitle = getPageTitle(pathname);

  const noShellRoutes = ['/workout'];
  const shouldShowShell = !noShellRoutes.some(route => pathname.startsWith(route));

  if (!shouldShowShell) {
    return <>{children}</>;
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
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3, mb: 7 }}>
        {children}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default AppShell;