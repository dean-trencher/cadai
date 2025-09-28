import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';

const Piston: React.FC<{ position: [number, number, number]; phase: number }> = ({ position, phase }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      const pistonMovement = Math.sin(time * 2 + phase) * 0.3;
      groupRef.current.position.y = position[1] + pistonMovement;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Piston head */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.8]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Connecting rod */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color="#808080" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const EngineBlock: React.FC = () => {
  return (
    <>
      {/* Main engine block */}
      <mesh position={[0, -1, 0]} castShadow>
        <boxGeometry args={[3, 1.5, 2]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Cylinder heads */}
      {[-0.8, 0, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.2]} />
          <meshStandardMaterial color="#34495E" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      
      {/* Crankshaft */}
      <mesh position={[0, -1.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 3.5]} />
        <meshStandardMaterial color="#1A1A1A" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
};

const EngineDemo: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#FF6B6B" />
        
        <EngineBlock />
        
        {/* Pistons with different phases for realistic engine motion */}
        <Piston position={[-0.8, 0.5, 0]} phase={0} />
        <Piston position={[0, 0.5, 0]} phase={Math.PI} />
        <Piston position={[0.8, 0.5, 0]} phase={Math.PI / 2} />
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={2} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">V6 Engine Assembly</div>
        <div className="text-white/70 text-xs">4-stroke combustion engine</div>
      </div>
    </div>
  );
};

export default EngineDemo;