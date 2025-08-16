// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

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
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/Layout/PrivateRoute';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'features', element: <Features /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'verify/:token', element: <Verification /> },
        {
          path: 'dashboard',
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
