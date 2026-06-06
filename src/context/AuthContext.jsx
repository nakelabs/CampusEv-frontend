// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getAuthUser, login, logout, register, confirmRegister } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await getAuthUser();
            setUser(currentUser);
            setLoading(false);
        };
        checkUser();
    }, []);

    const handleLogin = async (email, password) => {
        const result = await login(email, password);
        const currentUser = await getAuthUser();
        setUser(currentUser);
        return result;
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login: handleLogin, logout: handleLogout, register, confirmRegister }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
