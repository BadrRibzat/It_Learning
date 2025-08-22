import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Layout/Footer.tsx
const Footer = () => {
    return (_jsx("footer", { style: {
            backgroundColor: '#f0f0f0',
            padding: '1.5rem 2rem',
            borderTop: '1px solid #ddd',
            marginTop: 'auto',
            fontSize: '0.9rem',
            color: '#555',
        }, children: _jsxs("div", { style: {
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                textAlign: 'center',
            }, children: [_jsxs("div", { children: [_jsx("h3", { style: { color: '#6750a4', marginBottom: '0.5rem' }, children: "IT-Learning" }), _jsx("p", { children: "Master CLI commands through interactive flashcards." })] }), _jsxs("div", { children: [_jsx("h4", { style: { color: '#6750a4' }, children: "Quick Links" }), _jsxs("ul", { style: { listStyle: 'none', padding: 0 }, children: [_jsx("li", { children: _jsx("a", { href: "/", children: "Home" }) }), _jsx("li", { children: _jsx("a", { href: "/features", children: "Features" }) }), _jsx("li", { children: _jsx("a", { href: "/about", children: "About" }) })] })] }), _jsxs("div", { children: [_jsx("h4", { style: { color: '#6750a4' }, children: "Contact" }), _jsx("p", { children: "Email: badrribzat@gmail.com" }), _jsx("p", { children: "\u00A9 2025 Badr Ribzat. All rights reserved." })] })] }) }));
};
export default Footer;
