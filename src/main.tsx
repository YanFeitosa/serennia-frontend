import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionsProvider } from './contexts/PermissionsContext';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Check if user should see landing or app
const getInitialRoute = () => {
  // If accessing root and not authenticated, show landing
  // Otherwise, router will handle it
  return null;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <PermissionsProvider>
            <AppRouter />
          </PermissionsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
