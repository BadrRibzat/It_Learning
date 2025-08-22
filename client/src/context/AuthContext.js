import { jsx as _jsx } from "react/jsx-runtime";
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // ✅ Restore user from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode.jwtDecode(token);
                setUser({ token, ...decoded });
            }
            catch (err) {
                localStorage.removeItem('token');
                console.error('Invalid token, logging out');
            }
        }
    }, []);
    const login = async (email, password) => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return 'success';
        }
        catch (err) {
            return err.response?.data?.message || 'Login failed';
        }
    };
    const register = async (username, email, password) => {
        try {
            await axios.post('/api/auth/register', {
                username,
                email,
                password,
                confirmPassword: password
            });
            return 'success';
        }
        catch (err) {
            return err.response?.data?.message || 'Registration failed';
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, register, logout }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within AuthProvider");
    return context;
};
