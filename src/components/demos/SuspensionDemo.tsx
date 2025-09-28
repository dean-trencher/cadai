import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';

const Wheel: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Rim */}
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.2]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Tire */}
      <mesh castShadow>
        <torusGeometry args={[0.4, 0.15, 8, 16]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.9} />
      </mesh>
      
      {/* Spokes */}
      {[0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3].map((angle, i) => (
        <mesh 
          key={i}
          position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}
          rotation={[0, angle, 0]}
          castShadow
        >
          <boxGeometry args={[0.25, 0.02, 0.02]} />
          <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

const SpringDamper: React.FC<{ position: [number, number, number]; compression: number }> = ({ position, compression }) => {
  const springRef = useRef<Group>(null);
  
  return (
    <group ref={springRef} position={position}>
      {/* Shock absorber */}
      <mesh position={[0, compression, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1 - Math.abs(compression)]} />
        <meshStandardMaterial color="#F39C12" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Spring coil */}
      <mesh position={[0, compression + 0.2, 0]} castShadow>
        <torusGeometry args={[0.12, 0.03, 6, 12]} />
        <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Upper mount */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.1]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Lower mount */}
      <mesh position={[0, -0.8 + compression, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.1]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const ControlArm: React.FC<{ position: [number, number, number]; rotation: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Main arm */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.08, 0.08]} />
        <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Ball joints */}
      <mesh position={[-0.6, 0, 0]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0, 0]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

const SuspensionDemo: React.FC = () => {
  const suspensionRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (suspensionRef.current) {
      // Simulate road bumps
      const bounce = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      suspensionRef.current.position.y = bounce;
    }
  });

  return (
    <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#3498DB" />
        
        <group ref={suspensionRef}>
          {/* Wheels */}
          <Wheel position={[-1.5, -1, 0]} />
          <Wheel position={[1.5, -1, 0]} />
          
          {/* Springs and dampers */}
          <SpringDamper position={[-1.2, 0, 0]} compression={Math.sin(Date.now() * 0.003) * 0.1} />
          <SpringDamper position={[1.2, 0, 0]} compression={Math.sin(Date.now() * 0.003 + Math.PI) * 0.1} />
          
          {/* Control arms */}
          <ControlArm position={[-1, -0.3, 0.2]} rotation={[0, 0, -0.1]} />
          <ControlArm position={[1, -0.3, 0.2]} rotation={[0, 0, 0.1]} />
          <ControlArm position={[-1, -0.3, -0.2]} rotation={[0, 0, -0.1]} />
          <ControlArm position={[1, -0.3, -0.2]} rotation={[0, 0, 0.1]} />
          
          {/* Chassis */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[3, 0.2, 1]} />
            <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Anti-roll bar */}
          <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 2.8]} />
            <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">Car Suspension System</div>
        <div className="text-white/70 text-xs">MacPherson strut assembly</div>
      </div>
    </div>
  );
};

export default SuspensionDemo;