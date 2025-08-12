// src/components/About/About.tsx
import { Canvas, useFrame } from '@react-three/fiber'; // Added useFrame
import { useRef, Suspense } from 'react';

const TeamAvatar = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y += 0.01;
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#E5BEEC" />
    </mesh>
  );
};

const About = () => {
  return (
    <div className="about-page">
      <section className="page-header">
        <h1>About IT-Learning</h1>
      </section>
      <div className="about-content">
        <div className="project-info">
          <h2>Project Vision</h2>
          <p>IT-Learning was created to make CLI mastery accessible worldwide.</p>
        </div>
        <div className="team-section">
          <h2>Meet the Founder</h2>
          <Canvas style={{ height: '200px' }}>
            <ambientLight />
            <TeamAvatar />
          </Canvas>
          <h3>Badr Ribzat</h3>
          <p>CEO & Founder</p>
        </div>
      </div>
    </div>
  );
};

export default About;
