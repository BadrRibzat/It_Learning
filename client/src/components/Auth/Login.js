import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Auth/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result === 'success') {
            navigate('/dashboard');
        }
        else {
            setError(result);
        }
    };
    return (_jsx("div", { className: "auth-container", style: { padding: '4rem 1rem' }, children: _jsxs("div", { className: "auth-form", style: { maxWidth: '400px', margin: '0 auto' }, children: [_jsx("h2", { children: "Login" }), error && _jsx("div", { style: { color: 'red', marginBottom: '1rem' }, children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' } })] }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { children: "Password" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: { width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px' } })] }), _jsx("button", { type: "submit", style: { width: '100%', padding: '0.75rem', background: '#6750a4', color: 'white', border: 'none', borderRadius: '8px' }, children: "Login" })] }), _jsxs("p", { style: { marginTop: '1.5rem' }, children: ["Don't have an account? ", _jsx("a", { onClick: () => navigate('/register'), style: { color: '#6750a4', cursor: 'pointer' }, children: "Register" })] })] }) }));
};
export default Login;
