import React from 'react';
import App from './App/index.tsx';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';

import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
);
