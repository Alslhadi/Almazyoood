import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyPasscode } from '../services/authService';

// Define the shape of the context
interface AuthContextType {
    isAuthenticated: boolean;
    login: (passcode: string | null) => boolean;
    logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A custom hook to easily use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Define the props for the provider component
interface AuthProviderProps {
    children: React.ReactNode;
}

const AUTH_STORAGE_KEY = 'isAuthenticated';

// The provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Check for a logged-in session in localStorage on initial load
    useEffect(() => {
        try {
            const storedAuthStatus = localStorage.getItem(AUTH_STORAGE_KEY);
            if (storedAuthStatus === 'true') {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Failed to read auth status from localStorage", error);
        }
    }, []);

    // Login function
    const login = (passcode: string | null): boolean => {
        if (verifyPasscode(passcode)) {
            setIsAuthenticated(true);
            localStorage.setItem(AUTH_STORAGE_KEY, 'true');
            return true;
        } else {
            return false;
        }
    };

    // Logout function
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const value = {
        isAuthenticated,
        login,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};