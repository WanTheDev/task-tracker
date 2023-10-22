import '@mantine/core/styles.css';
import './styles/globalStyles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
//import { invoke } from '@tauri-apps/api'
import { createTheme, MantineProvider } from '@mantine/core';
import TaskManager from './TaskManager';

const theme = createTheme({

})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme='dark'>
      <TaskManager />
    </MantineProvider>
  </React.StrictMode>
)
