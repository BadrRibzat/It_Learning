// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

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

// Add ErrorPage component
const ErrorPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Error</h2>
      <p>Something went wrong. Please try again later.</p>
      <a href="/">Go back to home</a>
    </div>
  );
};

// Define router OUTSIDE component
const router = createBrowserRouter([
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
      { path: 'error', element: <ErrorPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </I18nextProvider>
);
