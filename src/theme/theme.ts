import { createTheme, PaletteOptions } from '@mui/material/styles';

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#0d7ff2', // Using the blue from the original design
  },
  background: {
    default: '#f5f7f8',
    paper: '#ffffff',
  },
};

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#0d7ff2',
  },
  background: {
    default: '#101922',
    paper: '#1c252e',
  },
};

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: mode === 'light' ? lightPalette : darkPalette,
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '9999px',
                }
            }
        }
    }
  });