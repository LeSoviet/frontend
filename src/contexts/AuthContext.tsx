import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Admin, LoginRequest } from '../types';
import apiService from '../services/api';

interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          apiService.setToken(token);
          const response = await apiService.getProfile();
          if (response.success) {
            setAdmin(response.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        const { token, admin: adminData } = response.data;
        apiService.setToken(token);
        setAdmin(adminData);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiService.logout();
    setAdmin(null);
  };

  const value: AuthContextType = {
    admin,
    isAuthenticated: !!admin,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};