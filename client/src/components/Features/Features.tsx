// src/components/Features/Features.tsx
import { Canvas, useFrame } from '@react-three/fiber'; // Added useFrame
import { useRef, Suspense } from 'react';


const FeatureBox = ({ position, color, text }) => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
  });
  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const Features = () => {
  return (
    <div className="features-page">
      <section className="page-header">
        <h1>Platform Features</h1>
      </section>
      <Canvas style={{ height: '400px' }}>
        <ambientLight />
        <FeatureBox position={[-2, 0, 0]} color="#917FB3" text="Interactive Flashcards" />
        <FeatureBox position={[0, 0, 0]} color="#E5BEEC" text="Real-time Validation" />
        <FeatureBox position={[2, 0, 0]} color="#2A2F4F" text="Progress Tracking" />
      </Canvas>
    </div>
  );
};

export default Features;
