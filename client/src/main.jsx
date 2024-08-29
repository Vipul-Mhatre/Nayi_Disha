import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from "next-themes";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Router>
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="dark">
                <App />
            </NextThemesProvider>
        </NextUIProvider>
    </Router>
)