import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';
const Gear: React.FC<{
  radius: number;
  teeth: number;
  position: [number, number, number];
  rotation?: number;
}> = ({
  radius,
  teeth,
  position,
  rotation = 0
}) => {
  const meshRef = useRef<Mesh>(null);
  useFrame(state => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotation + state.clock.elapsedTime * 0.5;
    }
  });

  // Create gear geometry
  const gearShape = React.useMemo(() => {
    const points = [];
    const innerRadius = radius * 0.7;
    const outerRadius = radius;
    for (let i = 0; i < teeth; i++) {
      const angle1 = i / teeth * Math.PI * 2;
      const angle2 = (i + 0.3) / teeth * Math.PI * 2;
      const angle3 = (i + 0.7) / teeth * Math.PI * 2;
      const angle4 = (i + 1) / teeth * Math.PI * 2;

      // Outer points
      points.push(Math.cos(angle1) * outerRadius, Math.sin(angle1) * outerRadius);
      points.push(Math.cos(angle2) * outerRadius, Math.sin(angle2) * outerRadius);

      // Inner points
      points.push(Math.cos(angle3) * innerRadius, Math.sin(angle3) * innerRadius);
      points.push(Math.cos(angle4) * innerRadius, Math.sin(angle4) * innerRadius);
    }
    return points;
  }, [radius, teeth]);
  return <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[radius, radius, 0.2, teeth * 4]} />
      <meshStandardMaterial color="#4A90E2" metalness={0.8} roughness={0.2} />
    </mesh>;
};
const GearDemo: React.FC = () => {
  return <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden">
      <Canvas camera={{
      position: [0, 0, 6],
      fov: 50
    }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <spotLight position={[-10, -10, 5]} angle={0.3} penumbra={1} intensity={0.5} />
        
        {/* Main gear */}
        <Gear radius={1.5} teeth={20} position={[0, 0, 0]} />
        
        {/* Smaller interconnected gears */}
        <Gear radius={0.8} teeth={12} position={[2.2, 0, 0]} rotation={Math.PI} />
        <Gear radius={0.6} teeth={10} position={[-2, 1.2, 0]} rotation={Math.PI / 2} />
        <Gear radius={0.7} teeth={14} position={[-1.8, -1.5, 0]} rotation={-Math.PI / 3} />
        
        <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={1} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg mx-[20px]">
        <div className="text-white text-sm font-medium">Mechanical Gear System</div>
        <div className="text-white/70 text-xs">20-tooth spur gear assembly</div>
      </div>
    </div>;
};
export default GearDemo;