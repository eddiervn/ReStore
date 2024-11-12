import { ThemeProvider } from '@emotion/react';

import Header from './Header';
import { Container, createTheme, CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/ReactToastify.css'
import { getCookie } from '../util/util';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { useAppDispatch } from '../store/configureStore';
import { setBasket } from '../../features/basket/basketSlice';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const palleteType = darkMode? 'dark' : 'light';
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const buyerId = getCookie('buyerId');
    if(buyerId){
      agent.Basket.get()
      .then(basket => dispatch(setBasket(basket)))
      .catch(e => console.log(e))
      .finally(() => setLoading(false));
    }
    else{
      setLoading(false);
    }
  }, [])

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

  if ( loading ) return <LoadingComponent message='Initializing app...' />

  return (
    <ThemeProvider theme={theme}>
        <ToastContainer position='bottom-right' hideProgressBar theme="colored"/>
        <CssBaseline/>
        <Header  handleThemeChange={ handleThemeChange} darkMode={darkMode}/>
        <Container sx={{mt:12}}>
          <Outlet/>
        </Container>
    </ThemeProvider>
  )
}

export default App
