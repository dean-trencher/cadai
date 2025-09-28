import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
const ElectronicHousing: React.FC<{
  exploded: boolean;
}> = ({
  exploded
}) => {
  const topRef = useRef<Mesh>(null);
  const bottomRef = useRef<Mesh>(null);
  const pcbRef = useRef<Mesh>(null);
  useFrame(() => {
    if (topRef.current && bottomRef.current && pcbRef.current) {
      const explosionOffset = exploded ? 2 : 0;

      // Animate the explosion/assembly
      topRef.current.position.y = 0.6 + explosionOffset;
      bottomRef.current.position.y = -0.6 - explosionOffset;
      pcbRef.current.position.y = explosionOffset * 0.3;
    }
  });
  return <>
      {/* Top housing */}
      <mesh ref={topRef} position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[2.5, 0.2, 1.8]} />
        <meshStandardMaterial color="#E74C3C" roughness={0.3} />
      </mesh>
      
      {/* Bottom housing */}
      <mesh ref={bottomRef} position={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[2.5, 0.2, 1.8]} />
        <meshStandardMaterial color="#E74C3C" roughness={0.3} />
      </mesh>
      
      {/* Side walls */}
      <mesh position={[1.25, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 1.8]} />
        <meshStandardMaterial color="#C0392B" roughness={0.3} />
      </mesh>
      <mesh position={[-1.25, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 1.2, 1.8]} />
        <meshStandardMaterial color="#C0392B" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.9]} castShadow>
        <boxGeometry args={[2.5, 1.2, 0.1]} />
        <meshStandardMaterial color="#C0392B" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0, -0.9]} castShadow>
        <boxGeometry args={[2.5, 1.2, 0.1]} />
        <meshStandardMaterial color="#C0392B" roughness={0.3} />
      </mesh>
      
      {/* PCB */}
      <mesh ref={pcbRef} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.2, 0.05, 1.5]} />
        <meshStandardMaterial color="#2ECC71" roughness={0.1} />
      </mesh>
      
      {/* Components on PCB */}
      {[[-0.8, 0.1, -0.5], [0.8, 0.1, -0.5], [0, 0.1, 0.3]].map((pos, i) => <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
        </mesh>)}
      
      {/* Screws */}
      {[[-1, -0.5, -0.7], [1, -0.5, -0.7], [-1, -0.5, 0.7], [1, -0.5, 0.7]].map((pos, i) => <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
        </mesh>)}
    </>;
};
const HousingDemo: React.FC = () => {
  const [exploded, setExploded] = useState(false);
  return <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden">
      <Canvas camera={{
      position: [4, 3, 4],
      fov: 50
    }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#3498DB" />
        
        <ElectronicHousing exploded={exploded} />
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">Arduino Nano Enclosure</div>
        <div className="text-white/70 text-xs">Snap-fit electronics housing</div>
      </div>
      
      <button onClick={() => setExploded(!exploded)} className="absolute bottom-4 right-4 bg-adam-pink hover:bg-adam-pink/80 text-white py-2 rounded-lg text-sm font-medium transition-colors px-[12px] mx-[10px]">
        {exploded ? 'Assemble' : 'Explode'}
      </button>
    </div>;
};
export default HousingDemo;