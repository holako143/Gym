import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/themeSlice';
import { RootState } from '../store/store';
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
import { useNavigate } from 'react-router-dom';


// A simple function to get the page title from the pathname
const getPageTitle = (pathname: string): string => {
    if (pathname === '/') return 'Workouts';
    const cleanPath = pathname.substring(1);
    // Handle cases like /workout/1 by just taking the first part
    const title = cleanPath.split('/')[0];
    return title.charAt(0).toUpperCase() + title.slice(1);
}

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const pageTitle = getPageTitle(location.pathname);

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
          <IconButton sx={{ ml: 1 }} onClick={() => navigate('/profile')} color="inherit">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 3, mb: 7 /* space for bottom nav */ }}>
        <Outlet />
      </Container>

      <BottomNav />
    </Box>
  );
};

export default Layout;