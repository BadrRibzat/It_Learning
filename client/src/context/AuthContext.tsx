// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import * as jwtDecode from 'jwt-decode';
import api from '../utils/api';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<string>;
  register: (username: string, email: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode.jwtDecode(token);
        setUser({ token, ...decoded });
      } catch {
        localStorage.removeItem('token');
        console.error('Invalid token, logging out');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      return 'success';
    } catch (err: any) {
      return err.response?.data?.message || 'Login failed';
    }
  };

  const register = async (username: string, email: string, password: string): Promise<string> => {
    try {
      await api.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword: password,
      });
      return 'success';
    } catch (err: any) {
      return err.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

