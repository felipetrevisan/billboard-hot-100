import { createTheme } from '@mui/material/styles';
import { Inter } from '@next/font/google';
import { orange, purple } from 'tailwindcss/colors';

export const inter = Inter({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Heveltica', 'Arial', 'sans-serif'],
  variable: '--font-inter',
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: purple[500],
    },
    secondary: {
      main: orange[500],
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
  },
});

export default theme;
