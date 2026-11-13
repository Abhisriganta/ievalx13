import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config/queryClient';

import ThemeProvider from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import AppRouter from '@/routes/AppRouter';

import AppToast from '@/components/common/AppToast';

import AppLoader from '@/components/common/AppLoader';

import { OfflineGate } from '@/components/common/NetworkError';


const BootGate = ({ children }) => {
  const { loading } = useAuth();
  return (
    <>
      <AppLoader active={loading} />
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
  <ThemeProvider>
    <AuthProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3500}
        Components={{
          default: AppToast,
          success: AppToast,
          error:   AppToast,
          warning: AppToast,
          info:    AppToast,
        }}
      >
        <BootGate>
          <OfflineGate>
            <Router>
              <AppRouter />
            </Router>
          </OfflineGate>
        </BootGate>
      </SnackbarProvider>
    </AuthProvider>
  </ThemeProvider>
  </QueryClientProvider>
);

export default App;