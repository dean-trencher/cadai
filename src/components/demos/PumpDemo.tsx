import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';

const Impeller: React.FC = () => {
  const impellerRef = useRef<Group>(null);
  
  useFrame(() => {
    if (impellerRef.current) {
      impellerRef.current.rotation.y += 0.1;
    }
  });

  const bladeCount = 8;
  
  return (
    <group ref={impellerRef}>
      {/* Central hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Impeller blades */}
      {Array.from({ length: bladeCount }, (_, i) => {
        const angle = (i / bladeCount) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 0.8, 0, Math.sin(angle) * 0.8]}
            rotation={[0, angle + Math.PI/2, Math.PI/6]}
            castShadow
          >
            <boxGeometry args={[0.15, 0.4, 0.8]} />
            <meshStandardMaterial color="#3498DB" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
      
      {/* Blade tips */}
      {Array.from({ length: bladeCount }, (_, i) => {
        const angle = (i / bladeCount) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 1.1, 0, Math.sin(angle) * 1.1]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.1, 0.3, 0.05]} />
            <meshStandardMaterial color="#2980B9" metalness={0.8} roughness={0.2} />
          </mesh>
        );
      })}
    </group>
  );
};

const PumpHousing: React.FC = () => {
  return (
    <>
      {/* Main volute casing */}
      <mesh castShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.6]} />
        <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Inlet pipe */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI/2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.8]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Outlet pipe */}
      <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.6]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Flanges */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.1]} />
        <meshStandardMaterial color="#7F8C8D" metalness={0.8} roughness={0.2} />
      </mesh>
      
      <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1]} />
        <meshStandardMaterial color="#7F8C8D" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Mounting feet */}
      {[[-1.2, -0.8, -1], [1.2, -0.8, -1], [-1.2, -0.8, 1], [1.2, -0.8, 1]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.3, 0.2, 0.3]} />
          <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Bearing housing */}
      <mesh position={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial color="#95A5A6" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
};

const Motor: React.FC = () => {
  const motorRef = useRef<Group>(null);
  
  useFrame(() => {
    if (motorRef.current) {
      motorRef.current.rotation.z += 0.05;
    }
  });

  return (
    <group ref={motorRef} position={[0, 0, 1.2]}>
      {/* Motor body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.8]} />
        <meshStandardMaterial color="#F39C12" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Motor shaft */}
      <mesh position={[0, 0, -0.6]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.8]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Cooling fins */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh 
            key={i}
            position={[Math.cos(angle) * 0.38, 0, Math.sin(angle) * 0.38]}
            rotation={[0, angle, 0]}
            castShadow
          >
            <boxGeometry args={[0.05, 0.6, 0.02]} />
            <meshStandardMaterial color="#E67E22" metalness={0.7} roughness={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

const PumpDemo: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#3498DB" />
        <pointLight position={[2, 0, 0]} intensity={0.3} color="#E74C3C" />
        
        <PumpHousing />
        <Impeller />
        <Motor />
        
        {/* Flow visualization particles */}
        {Array.from({ length: 20 }, (_, i) => (
          <mesh 
            key={i}
            position={[
              Math.random() * 3 - 1.5,
              Math.random() * 2 - 1,
              Math.random() * 3 - 1.5
            ]}
            castShadow
          >
            <sphereGeometry args={[0.02]} />
            <meshStandardMaterial color="#74B9FF" emissive="#74B9FF" emissiveIntensity={0.3} />
          </mesh>
        ))}
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">Centrifugal Pump</div>
        <div className="text-white/70 text-xs">Industrial fluid transfer system</div>
      </div>
    </div>
  );
};

export default PumpDemo;