// src/components/Home/Home.tsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';

const AnimatedCard = () => {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });
  return (<mesh ref={meshRef} position={[0, 0, 0]}>
    <boxGeometry args={[2, 1, 0.1]} />
    <meshStandardMaterial color="#E5BEEC" />
  </mesh>);
};

const Home = () => {
  return (<div className="home-container">
    <section className="hero">
      <h1>Master CLI Commands</h1>
      <p>Interactive learning for developers</p>
      <Suspense fallback={<div>Loading 3D...</div>}>
        <Canvas style={{ height: '300px' }}>
          <ambientLight /><AnimatedCard />
        </Canvas>
      </Suspense>
    </section>
  </div>);
};

export default Home;
