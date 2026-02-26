import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (userData) => {
        const data = await authService.login(userData);
        if (data.success) {
            setUser(data.data);
            return data.data;
        }
        throw new Error(data.message);
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        if (data.success) {
            setUser(data.data);
            return data.data;
        }
        throw new Error(data.message);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
