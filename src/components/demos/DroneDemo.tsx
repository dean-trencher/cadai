import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';

const Propeller: React.FC<{ position: [number, number, number]; direction: number }> = ({ position, direction }) => {
  const propRef = useRef<Group>(null);
  
  useFrame(() => {
    if (propRef.current) {
      propRef.current.rotation.y += 0.2 * direction;
    }
  });

  return (
    <group ref={propRef} position={position}>
      {/* Motor */}
      <mesh castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.15]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Propeller blades */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
        <mesh 
          key={i}
          position={[Math.cos(angle) * 0.25, 0, Math.sin(angle) * 0.25]}
          rotation={[0, angle, Math.PI/12]}
          castShadow
        >
          <boxGeometry args={[0.4, 0.02, 0.08]} />
          <meshStandardMaterial color="#34495E" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

const DroneArm: React.FC<{ position: [number, number, number]; rotation: [number, number, number] }> = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation} castShadow>
      <boxGeometry args={[1.2, 0.05, 0.05]} />
      <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

const DroneBody: React.FC = () => {
  const bodyRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (bodyRef.current) {
      // Subtle hovering motion
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      bodyRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={bodyRef}>
      {/* Main body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.2, 0.4]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Camera gimbal */}
      <mesh position={[0, -0.15, 0.3]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Landing gear */}
      {[[-0.2, -0.2, -0.1], [0.2, -0.2, -0.1], [-0.2, -0.2, 0.1], [0.2, -0.2, 0.1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.15]} />
          <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      
      {/* Battery compartment */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.2]} />
        <meshStandardMaterial color="#27AE60" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

const DroneDemo: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#3498DB" />
        
        <DroneBody />
        
        {/* Drone arms */}
        <DroneArm position={[0.6, 0, 0.3]} rotation={[0, Math.PI/4, 0]} />
        <DroneArm position={[-0.6, 0, 0.3]} rotation={[0, -Math.PI/4, 0]} />
        <DroneArm position={[0.6, 0, -0.3]} rotation={[0, -Math.PI/4, 0]} />
        <DroneArm position={[-0.6, 0, -0.3]} rotation={[0, Math.PI/4, 0]} />
        
        {/* Propellers */}
        <Propeller position={[0.85, 0.1, 0.55]} direction={1} />
        <Propeller position={[-0.85, 0.1, 0.55]} direction={-1} />
        <Propeller position={[0.85, 0.1, -0.55]} direction={-1} />
        <Propeller position={[-0.85, 0.1, -0.55]} direction={1} />
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">Quadcopter Drone</div>
        <div className="text-white/70 text-xs">Professional UAV assembly</div>
      </div>
    </div>
  );
};

export default DroneDemo;