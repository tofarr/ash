import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4a6da7',
    },
    secondary: {
      main: '#FFCC00',
    },
    error: {
      main: '#CC3300',
    }
  }
});

const CustomTheme: React.FC = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

export default CustomTheme;
