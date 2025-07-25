import { createContext, useState, useEffect } from 'react';
import apiClient from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const login = async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        setUser(response.data.user);
        return response;
    };

    const logout = async () => {
        await apiClient.post('/auth/logout');
        setUser(null);
    };

    const value = { user, setUser, login, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
