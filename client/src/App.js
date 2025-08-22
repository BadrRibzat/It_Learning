import { jsx as _jsx } from "react/jsx-runtime";
// src/App.tsx
import { Outlet } from 'react-router-dom';
import Layout from './components/Layout/Layout';
export default function App() {
    return (_jsx(Layout, { children: _jsx(Outlet, {}) }));
}
