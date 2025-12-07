import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { usePage } from './router';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Monitoreo } from './pages/Monitoreo';
import { Buses } from './pages/Buses';

const AppContent = () => {
  const { token } = useAuth();
  const page = usePage();

  if (!token) {
    return <Login />;
  }

  switch (page) {
    case '/monitoreo':
      return <Monitoreo />;
    case '/buses':
      return <Buses />;
    case '/dashboard':
    default:
      return <Dashboard />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
