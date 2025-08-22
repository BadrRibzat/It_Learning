import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Auth/Register.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    // ✅ Added 'async' here
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            const result = await register(username, email, password);
            if (result === 'success') {
                setSuccess(true);
            }
            else {
                setError(result);
            }
        }
        catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Registration failed:', err);
        }
    };
    if (success) {
        return (_jsxs("div", { style: { padding: '4rem 1rem', textAlign: 'center' }, children: [_jsx("h2", { children: "Check Your Email" }), _jsxs("p", { children: ["We've sent a verification link to ", _jsx("strong", { children: email }), "."] }), _jsx("p", { children: "Please click the link to verify your account." }), _jsx("button", { onClick: () => navigate('/login'), style: {
                        background: '#6750a4',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }, children: "Back to Login" })] }));
    }
    return (_jsx("div", { className: "auth-container", style: { padding: '4rem 1rem' }, children: _jsxs("div", { className: "auth-form", style: { maxWidth: '400px', margin: '0 auto' }, children: [_jsx("h2", { children: "Create Account" }), error && (_jsx("div", { style: { color: 'red', marginBottom: '1rem' }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "UserName" }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), required: true, style: {
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    } })] }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: {
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    } })] }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: {
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    } })] }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "Confirm Password" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, style: {
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px'
                                    } })] }), _jsx("button", { type: "submit", style: {
                                width: '100%',
                                background: '#6750a4',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '8px'
                            }, children: "Register" })] }), _jsxs("p", { style: { marginTop: '1.5rem' }, children: ["Already have an account?", ' ', _jsx("a", { onClick: () => navigate('/login'), style: { color: '#6750a4', cursor: 'pointer' }, children: "Login" })] })] }) }));
};
export default Register;
