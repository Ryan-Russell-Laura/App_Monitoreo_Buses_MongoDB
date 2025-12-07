import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUsuario = localStorage.getItem('usuario');
    if (savedToken && savedUsuario) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUsuario));
    }
  }, []);

  const login = (newToken: string, newUsuario: Usuario) => {
    setToken(newToken);
    setUsuario(newUsuario);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(newUsuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
