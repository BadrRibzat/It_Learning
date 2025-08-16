// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import * as jwtDecode from 'jwt-decode'; // ✅ Correcting import

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // ✅ Restore user from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode.jwtDecode(token); // ✅ Call jwtDecode.jwtDecode()
        setUser({ token, ...decoded });
      } catch (err) {
        localStorage.removeItem('token');
        console.error('Invalid token, logging out');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const { token, ...userData } = res.data;
      localStorage.setItem('token', token);
      setUser(userData);
      navigate('/dashboard');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      await axios.post('/api/auth/register', {
        username,
        email,
        password,
        confirmPassword: password
      });
      navigate('/login'); // ✅ Better UX
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
