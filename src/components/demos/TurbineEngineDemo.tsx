import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';

const TurbineBlade: React.FC<{ radius: number; angle: number }> = ({ radius, angle }) => {
  return (
    <mesh 
      position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
      rotation={[0, angle + Math.PI/2, Math.PI/12]}
      castShadow
    >
      <boxGeometry args={[0.05, 0.8, 0.3]} />
      <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
    </mesh>
  );
};

const TurbineFan: React.FC<{ position: [number, number, number]; speed: number }> = ({ position, speed }) => {
  const fanRef = useRef<Group>(null);
  
  useFrame(() => {
    if (fanRef.current) {
      fanRef.current.rotation.y += speed;
    }
  });

  const bladeCount = 24;
  const radius = 1.2;

  return (
    <group ref={fanRef} position={position}>
      {/* Central hub */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Fan blades */}
      {Array.from({ length: bladeCount }, (_, i) => (
        <TurbineBlade 
          key={i} 
          radius={radius} 
          angle={(i / bladeCount) * Math.PI * 2} 
        />
      ))}
    </group>
  );
};

const EngineHousing: React.FC = () => {
  return (
    <>
      {/* Main engine casing */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 4]} />
        <meshStandardMaterial color="#34495E" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Inlet cone */}
      <mesh position={[0, 0, 2.5]} castShadow>
        <cylinderGeometry args={[1.4, 1.8, 1]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Exhaust nozzle */}
      <mesh position={[0, 0, -2.8]} castShadow>
        <cylinderGeometry args={[1.2, 1.8, 1.5]} />
        <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Combustion chamber */}
      <mesh position={[0, 0, -1]} castShadow>
        <cylinderGeometry args={[1.5, 1.5, 1]} />
        <meshStandardMaterial color="#F39C12" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Support struts */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
        <mesh 
          key={i}
          position={[Math.cos(angle) * 1.6, 0.8, 0]}
          rotation={[0, 0, Math.PI/2]}
          castShadow
        >
          <cylinderGeometry args={[0.08, 0.08, 1.6]} />
          <meshStandardMaterial color="#7F8C8D" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </>
  );
};

const TurbineEngineDemo: React.FC = () => {
  return (
    <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [6, 3, 6], fov: 50 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[0, 0, -5]} intensity={1} color="#FF6B35" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#74B9FF" />
        
        <EngineHousing />
        
        {/* Multiple turbine stages */}
        <TurbineFan position={[0, 0, 1.8]} speed={0.15} />
        <TurbineFan position={[0, 0, 0.6]} speed={-0.12} />
        <TurbineFan position={[0, 0, -0.6]} speed={0.18} />
        <TurbineFan position={[0, 0, -1.8]} speed={-0.1} />
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg">
        <div className="text-white text-sm font-medium">Jet Turbine Engine</div>
        <div className="text-white/70 text-xs">Multi-stage compressor system</div>
      </div>
    </div>
  );
};

export default TurbineEngineDemo;