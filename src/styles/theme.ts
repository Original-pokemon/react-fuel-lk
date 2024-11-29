import { createTheme } from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import brandColors from './const';
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    fuelColors: {
      [key: number]: string;
    };
  }
  interface PaletteOptions {
    fuelColors?: {
      [key: number]: string;
    };
  }
}

const theme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: brandColors.blue.main,
        light: brandColors.blue.light,
        dark: brandColors.blue.dark,
        contrastText: brandColors.blue.contrastText,
      },
      secondary: {
        main: brandColors.orange.main,
        light: brandColors.orange.light,
        dark: brandColors.orange.dark,
        contrastText: brandColors.orange.contrastText,
      },
      background: {
        default: brandColors.white.main,
        paper: brandColors.white.light,
      },
      text: {
        primary: '#5F738B',
        secondary: '#F0F0F0',
      },
      fuelColors: {
        14: brandColors.ai92, // АИ-92
        15: brandColors.ai95, // АИ-95
        17: brandColors.dt, // ДТ
        18: brandColors.sug, // Газ
        19: brandColors.ai95p, // АИ-95 PROFIT
        21: brandColors.ai100p, // АИ-100 PROFIT
      },
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
          a: {
            textDecoration: 'none',
            color: 'inherit',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
    shape: {
      borderRadius: 12,
    },
  },
  ruRU,
);

export default theme;
