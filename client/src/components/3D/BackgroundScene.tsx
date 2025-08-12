// src/components/3D/BackgroundScene.tsx
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

const BackgroundScene = () => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) groupRef.current.rotation.y += 0.001;
  });

  return (<>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} color="#E5BEEC" intensity={1} />
    <group ref={groupRef}>
      {[...Array(20)].map((_, i) => (
        <mesh key={i} position={[Math.random() * 10 - 5, Math.random() * 10 - 5, -Math.random() * 10]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="#917FB3" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
    <OrbitControls enableZoom={false} enablePan={false} />
  </>);
};

export default BackgroundScene;
