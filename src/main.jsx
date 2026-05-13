import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 80,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#FFFFFF',
              color: '#111827',
              borderRadius: '0.75rem',
              border: '1px solid #E5E7EB',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              padding: '12px 16px',
              maxWidth: '380px',
            },
            success: {
              iconTheme: {
                primary: '#0F6E56',
                secondary: '#FFFFFF',
              },
              style: {
                borderLeft: '4px solid #0F6E56',
              },
            },
            error: {
              iconTheme: {
                primary: '#991B1B',
                secondary: '#FFFFFF',
              },
              style: {
                borderLeft: '4px solid #991B1B',
              },
            },
            loading: {
              iconTheme: {
                primary: '#1B3A5C',
                secondary: '#FFFFFF',
              },
              style: {
                borderLeft: '4px solid #1B3A5C',
              },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
