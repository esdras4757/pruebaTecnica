'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store/store';
import { appState } from './redux/types';
import { lime } from '@mui/material/colors';
import AlertComponent from './Components/Alert';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import styled from 'styled-components'
import styles from '../styles/Home.module.scss'
import { useEffect } from 'react';
import { LinearProgress } from '@mui/material';


const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary:{
      main:'#0075CC'
    },
    secondary:{
      main:'#00CCB2'
    },
    background: {
      default: '#e9e9e9',
      aside: '#0075CC',
      select: '#0060A7',
      chat:'#FFFFFF',
      secondary:'#FFFFFF',
    } as any,
    text:{
      primary:'#000'
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0075CC',
    },
    secondary:{
      main:'#00CCB2'
    },
    common: {
      white: '#ffffff'
    },
    background: {
      default: 'rgb(42, 47, 54)',
      secondary:'#37596B',
      aside: '#004B76',
      select: '#3B96AA',
      chat:'#313131'
    } as any,
    text:{
      primary:'#fff'
    }
  }
})

function ThemeComponent({ children }: { children: React.ReactNode }) {
  const dispatch=useDispatch()
  const state = useSelector((state:appState)=>state.utils.isLoading)

  useEffect(() => {
    const theme = localStorage.getItem('themeId')
    if (theme) {
      dispatch({type:'changeTheme',payload:theme==='0'?'dark':'light'})
    }
    else{
      localStorage.setItem('themeId','0')
    }
  }, [])

  const themeMode = useSelector((state: appState) => state.configuration.theme) == 'dark' ? darkTheme : lightTheme
  return (
    <ThemeProvider theme={themeMode}>
      <StyledThemeProvider theme={themeMode}>
      {state && <LinearProgress style={{position:'absolute',left:0,height:'2px',right:0,zIndex:10000}} valueBuffer={0}/>}
        {children}
      </StyledThemeProvider>
    </ThemeProvider>

  )
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {

  return (

    <Provider store={store}>
      <ThemeComponent>
        {children}
      </ThemeComponent>
    </Provider>

  )
}