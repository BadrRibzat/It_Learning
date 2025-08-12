// src/App.tsx
import { BrowserRouter as Router, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'; // Import unstable_HistoryRouter
import { AuthProvider } from './context/AuthContext';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import About from './components/About/About';
import Features from './components/Features/Features';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import BackgroundScene from './components/3D/BackgroundScene';
import PrivateRoute from './components/Layout/PrivateRoute';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> {/* Add future flags */}
      <AuthProvider>
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
          <Canvas style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
            <Suspense fallback={null}>
              <BackgroundScene />
            </Suspense>
          </Canvas>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard/*" element={<PrivateRoute />}>
              <Route index element={<Dashboard />} />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
