import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

export type AuthView = 'login' | 'signup';

interface AuthWrapperProps {
    onAuthenticated: (userId: string, token: string) => void;
    initialView?: AuthView;
    children?: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ onAuthenticated, initialView = 'login', children }) => {
    const [view, setView] = useState<AuthView>(initialView);
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('auth_token'));

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleAuth = (userId: string, token: string) => {
        setIsAuthenticated(true);
        onAuthenticated(userId, token);
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    if (view === 'login') {
        return (
            <LoginPage
                onLogin={handleAuth}
                onSwitchToSignup={() => setView('signup')}
            />
        );
    }

    return (
        <SignupPage
            onSignup={handleAuth}
            onSwitchToLogin={() => setView('login')}
        />
    );
};

export default AuthWrapper;
export { LoginPage, SignupPage };
