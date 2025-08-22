import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx("main", { style: {
                    minHeight: 'calc(100vh - 140px)',
                    padding: '2rem 0',
                }, children: _jsx("div", { className: "container", children: _jsx(Outlet, {}) }) }), _jsx(Footer, {})] }));
};
export default Layout;
