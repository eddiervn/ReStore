import { ThemeProvider } from '@emotion/react';
import Catalog from '../../features/catalog/Catalog';
import Header from './Header';
import { Container, createTheme, CssBaseline } from '@mui/material';
import { useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const palleteType = darkMode? 'dark' : 'light';

  const theme = createTheme({
    palette: {
      mode: palleteType,
      background:{
        default: palleteType === 'light'? '#e9ecef' : '#121212'
      }
    }
  });

  function handleThemeChange(){
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Header  handleThemeChange={ handleThemeChange} darkMode={darkMode}/>
        <Container sx={{mt:10}}>
          <Catalog />
        </Container>
    </ThemeProvider>
  )
}

export default App
