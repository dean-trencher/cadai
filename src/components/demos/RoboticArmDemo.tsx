import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh, Group } from 'three';
const RobotJoint: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  length: number;
  animated: boolean;
}> = ({
  position,
  rotation,
  length,
  animated
}) => {
  const jointRef = useRef<Group>(null);
  const [localRotation, setLocalRotation] = useState(0);
  useFrame(state => {
    if (jointRef.current && animated) {
      const time = state.clock.elapsedTime;
      jointRef.current.rotation.y = Math.sin(time * 0.5) * 0.5;
      jointRef.current.rotation.z = Math.cos(time * 0.3) * 0.3;
    }
  });
  return <group ref={jointRef} position={position} rotation={rotation}>
      {/* Joint base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Arm segment */}
      <mesh position={[0, length / 2, 0]} castShadow>
        <boxGeometry args={[0.1, length, 0.1]} />
        <meshStandardMaterial color="#E74C3C" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* End effector */}
      <mesh position={[0, length, 0]} castShadow>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#F39C12" metalness={0.7} roughness={0.2} />
      </mesh>
    </group>;
};
const RobotBase: React.FC = () => {
  const baseRef = useRef<Group>(null);
  useFrame(state => {
    if (baseRef.current) {
      baseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.8;
    }
  });
  return <group ref={baseRef}>
      {/* Base platform */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.2]} />
        <meshStandardMaterial color="#2C3E50" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Main column */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.25, 1]} />
        <meshStandardMaterial color="#34495E" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>;
};
const RoboticArmDemo: React.FC = () => {
  const [animated, setAnimated] = useState(true);
  return <div className="w-full aspect-video bg-adam-darker/50 border border-white/10 rounded-lg overflow-hidden relative">
      <Canvas camera={{
      position: [4, 3, 4],
      fov: 50
    }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.5} color="#3498DB" />
        
        <RobotBase />
        
        {/* Multi-segment robotic arm */}
        <RobotJoint position={[0, 0.5, 0]} rotation={[0, 0, 0]} length={1.2} animated={animated} />
        <RobotJoint position={[0, 1.7, 0]} rotation={[0, Math.PI / 4, 0]} length={1} animated={animated} />
        <RobotJoint position={[0.7, 2.7, 0.7]} rotation={[0, -Math.PI / 3, 0]} length={0.8} animated={animated} />
        
        <OrbitControls enableZoom={true} />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg mx-[20px]">
        <div className="text-white text-sm font-medium">6-DOF Robotic Arm</div>
        <div className="text-white/70 text-xs">Industrial automation system</div>
      </div>
      
      <button onClick={() => setAnimated(!animated)} className="absolute bottom-4 right-4 bg-adam-pink hover:bg-adam-pink/80 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
        {animated ? 'Stop' : 'Animate'}
      </button>
    </div>;
};
export default RoboticArmDemo;