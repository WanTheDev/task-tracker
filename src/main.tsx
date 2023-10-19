import '@mantine/core/styles.css';
import './styles/globalStyles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import Tasklist from './Tasklist.tsx'
//import { invoke } from '@tauri-apps/api'
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({

})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <Tasklist />
    </MantineProvider>
  </React.StrictMode>
)
