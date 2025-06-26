import React from 'react';
import Login from '../../src/components/auth/loginForm'

interface LoginPageProps {
    onLoginSuccess: () => void;
    onSignupClick: () => void;
    onBackClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSignupClick, onBackClick }) => {
    return (
        <Login
            onLoginSuccess={onLoginSuccess}
            onSignupClick={onSignupClick}
            onBackClick={onBackClick}
        />
    );
};

export default LoginPage;
