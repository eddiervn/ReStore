import { ThemeProvider } from '@emotion/react';

import Header from './Header';
import { Container, createTheme, CssBaseline } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import 'react-toastify/ReactToastify.css'
import LoadingComponent from './LoadingComponent';
import { useAppDispatch } from '../store/configureStore';
import { fetchBasketAsync} from '../../features/basket/basketSlice';
import { fetchCurrentUser } from '../../features/account/accountSlice';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const palleteType = darkMode? 'dark' : 'light';
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

const initApp = useCallback (async () => {
    try{
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    }
    catch(e: any){
      console.log(e)
    }
  }, [dispatch]);

  useEffect(() => {
     initApp().then(_ => setLoading(false));
  }, [initApp])

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
        {loading ? ( <LoadingComponent message='Initializing app...' />)
        : (<>
        <CssBaseline/>
        <Header  handleThemeChange={ handleThemeChange} darkMode={darkMode}/>
        <Container sx={{mt:12}}>
          <Outlet/>
        </Container></>) }
    </ThemeProvider> 
  )
}

export default App
