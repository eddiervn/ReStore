import { ThemeProvider } from '@emotion/react';

import Header from './Header';
import { Container, createTheme, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const palleteType = darkMode? 'dark' : 'light';

  let theme = createTheme({
    palette: {
      mode: palleteType,
      background:{
        default: palleteType === 'light'? '#e9ecef' : '#121212'
      },
      warning:{
        main: 'rgb(253, 83, 97)'
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
          <Outlet/>
        </Container>
    </ThemeProvider>
  )
}

export default App
