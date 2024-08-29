import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/auth';
import { Web3Provider, Web3ProviderComponent } from './store/Web3Context';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Web3ProviderComponent>
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </AuthProvider>
  </Web3ProviderComponent>
);