'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Header from "../Components/Header";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Box, Drawer } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import { TabList, TabPanel } from "@mui/lab";
import styled from "styled-components";
import BlogCoontent from "../Components/BlogCoontent";
import DetailArticle from "../Components/DetailArticle";


export default function DetailOffline() {
  return (
    <Container className="primary-glow  " >
      <DetailArticle/>
    </Container>
  );
}


const Container = styled.div `

color: ${({ theme }) => theme.palette.text.primary};
h4{
  color: #1c8ebb;

}
background-color: ${({ theme }) => theme.palette.background.default};
padding: 0px 20px;
max-height: 100vh;
overflow: hidden;
.MuiTabs-flexContainer{
  justify-content: center;
}`
