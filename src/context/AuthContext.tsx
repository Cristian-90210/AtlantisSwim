import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';
import type { User } from '../types';
import axiosInstance from '../api/axiosInstance';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const res = await axiosInstance.post('/session/auth', {
                credentialType: email,
                password,
            });

            const body = res.data;
            if (!body.isSuccess || !body.data) return false;

            const data = body.data;

            // Store JWT token for subsequent API calls
            localStorage.setItem('auth_token', data.token);

            const loggedIn: User = {
                id:     String(data.id),
                name:   `${data.firstName} ${data.lastName}`.trim() || data.userName,
                email:  data.email,
                role:   data.roleId as UserRole,
            };

            setUser(loggedIn);
            localStorage.setItem('user', JSON.stringify(loggedIn));
            return true;
        } catch {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('atlantis_cart');
        window.dispatchEvent(new Event('user-logout'));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === UserRole.Admin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
