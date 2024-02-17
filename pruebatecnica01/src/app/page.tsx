'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Header from "./Components/Header";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useEffect, useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box, Drawer } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import styled from "styled-components";
import BlogCoontent from "./Components/BlogCoontent";
import BlogContent from "./Components/BlogCoontent";
import OfflineView from "./Components/OfflineView";

  

  let value2=false
  if (typeof window !== 'undefined') {
    value2=window?.navigator.onLine
  }
 function SimpleBottomNavigation() {
  const [value, setValue] = useState(0);
  const [isOnline, setIsOnline] = useState(value2);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (window) {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
  
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

   
  }, []);

  return (
    <Nav className="d-block d-md-none" >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Blog" icon={<i />} />
        <BottomNavigationAction label="Favorites" icon={<i />} />
        <BottomNavigationAction label="Nearby" icon={<i />} />
      </BottomNavigation>
    </Nav>
  );
}
const Home = () => {
  const [isOnline, setIsOnline] = useState(value2);
  const [offlineMode, setOfflineMode] = useState(false)
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar el estado de conexión directamente
    if (!navigator.onLine) {
      setIsOnline(false);
    }
    if (navigator.onLine) {
      setIsOnline(!offlineMode);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineMode]);


  return (
    <Container style={{opacity:0}} className="primary-glow">
      <Header offlineMode={offlineMode} setOfflineMode={setOfflineMode}/>
      {isOnline ? (
        <BlogContent offlineMode={offlineMode} setOfflineMode={setOfflineMode}/>
      ) : (
        <OfflineView offlineMode={offlineMode}  setOfflineMode={setOfflineMode}/>
      )}
      <SimpleBottomNavigation />
    </Container>
  );
};

const Container = styled.div`
opacity: 1 !important;

  color: ${({ theme }) => theme.palette.text.primary};
  h4 {
    color: #1c8ebb;
  }
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 0px 20px;
  max-height: 100vh;
  overflow: hidden;
  .MuiTabs-flexContainer {
    justify-content: center;
  }
`;

const OfflineMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
  margin-top: 20px;
`;
const Nav = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;

`

export default Home;
