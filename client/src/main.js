import { jsx as _jsx } from "react/jsx-runtime";
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Import components
import App from './App';
import Home from './components/Home/Home';
import About from './components/About/About';
import Features from './components/Features/Features';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Verification from './components/Auth/Verification';
// Import layout and auth
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';
const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(App, {}),
        children: [
            { index: true, element: _jsx(Home, {}) },
            { path: 'about', element: _jsx(About, {}) },
            { path: 'features', element: _jsx(Features, {}) },
            { path: 'login', element: _jsx(Login, {}) },
            { path: 'register', element: _jsx(Register, {}) },
            { path: 'verify/:token', element: _jsx(Verification, {}) },
            {
                path: 'dashboard',
                element: (_jsx(PrivateRoute, { children: _jsx(Dashboard, {}) })),
            },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(AuthProvider, { children: _jsx(RouterProvider, { router: router }) }));
