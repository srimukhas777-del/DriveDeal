import React from 'react';
import AppRouter from './router/index';
import AuthProvider from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
