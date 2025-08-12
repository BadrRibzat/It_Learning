// src/components/Flashcard/Flashcard.tsx
import { Canvas useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';

const Flashcard = () => {
  const meshRef = useRef();
  const [flipped, setFlipped] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = flipped ? Math.PI : 0;
    }
  });

  return (
    <mesh ref={meshRef} onClick={() => setFlipped(!flipped)}>
      <boxGeometry args={[2, 1, 0.1]} />
      <meshStandardMaterial color="#E5BEEC" />
    </mesh>
  );
};

export default Flashcard;
