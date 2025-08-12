// src/components/Layout/Footer.tsx
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';

const FooterLogo = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.005;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial color="#E5BEEC" />
    </mesh>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Canvas style={{ height: '30px', width: '60px' }}>
            <ambientLight />
            <FooterLogo />
          </Canvas>
          <p style={{ fontSize: '0.9rem' }}>Master CLI commands through interactive learning</p>
        </div>
        <div className="footer-section">
          <h4 style={{ fontSize: '1.1rem' }}>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 style={{ fontSize: '1.1rem' }}>Contact</h4>
          <p style={{ fontSize: '0.9rem' }}>Email: badrribzat@gmail.com</p>
          <p style={{ fontSize: '0.9rem' }}>© 2025 Badr Ribzat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
