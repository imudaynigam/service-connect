import React from 'react';
import Signup from '../../src/components/auth/signup'; 
interface SignupPageProps {
    onSignupSuccess: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignupSuccess }) => {
    return (
        <Signup onSignupSuccess={onSignupSuccess} />
    );
};

export default SignupPage;
