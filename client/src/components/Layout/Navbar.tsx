// src/components/Layout/Navbar.tsx
import React, { useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';

const LogoAnimation = () => {
  const logoRef = React.useRef();
  useFrame((state) => {
    if (logoRef.current) logoRef.current.rotation.y += 0.005;
  });
  return (<mesh ref={logoRef} position={[0, 0, 0]}>
    <boxGeometry args={[1, 0.5, 0.1]} />
    <meshStandardMaterial color="#E5BEEC" />
  </mesh>);
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (<nav className="navbar">
    <div className="navbar-container">
      <Link to="/" className="logo">
        <Suspense fallback={<div>Loading Logo...</div>}>
          <Canvas style={{ height: '50px', width: '100px' }}>
            <ambientLight /><LogoAnimation />
          </Canvas>
        </Suspense>
      </Link>
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>☰</button>
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/features">Features</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </div>
  </nav>);
};

export default Navbar;
