// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './AppRoutes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3b82f6',   // matches your --color-primary
        },
        background: {
            default: '#f4f6f8', // matches your --color-bg
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </React.StrictMode>
);
